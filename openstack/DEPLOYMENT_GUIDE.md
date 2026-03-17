# OpenStack 2025.1 Kolla-Ansible Multinode Deployment Guide

## Overview

This deployment uses Kolla-Ansible to deploy OpenStack 2025.1 in a multinode configuration with:
- **6 nodes**: 3 controllers + 3 compute/HCI nodes
- **External Ceph cluster** for storage
- **OVN** for networking
- **High availability** with VIPs
- **TLS** enabled internally and externally

## Network Architecture

### VLAN Configuration
| VLAN | Purpose | Interface | Network | CIDR |
|------|---------|-----------|---------|------|
| 3407 | Management | bond0.3407 → br-mgmt | Management | 10.8.132.96/27 |
| 3410 | OpenStack API | bond0.3410 → br-api | API/Tunnel | 10.8.132.192/27 |
| 3408 | Ceph Cluster | bond1.3408 | Storage Cluster | 10.8.132.128/27 |
| 3409 | Ceph Public | bond1.3409 | Storage Public | 10.8.132.160/27 |
| 3411 | Provider Networks | bond1.3411 → br-provider | External | - |

### VIP Configuration
- **Internal VIP**: 10.8.132.210 (within br-api subnet)
- **External VIP**: 10.8.132.170 (within bond1.3409 subnet)

## Key Configuration Files

### `/etc/kolla/globals.yml` - Critical Settings

```yaml
# OpenStack Release
openstack_release: "2025.1"
kolla_base_distro: "ubuntu"

# VIPs for HA
kolla_internal_vip_address: "10.8.132.210"
kolla_internal_fqdn: "internal.otech.local"
kolla_external_vip_address: "10.8.132.170"
kolla_external_fqdn: "public.otech.local"
kolla_external_vip_interface: "br-provider"

# Network interfaces (IMPORTANT: Use br-api for tunneling)
api_interface: "br-api"
tunnel_interface: "br-api"          # NOT bond1.3408 (that's Ceph cluster!)
neutron_external_interface: "bond1.3411"
neutron_plugin_agent: "ovn"

# External Ceph Configuration
enable_ceph_repo: "false"
external_ceph_cephx_enabled: true
external_ceph_mon_hosts: "controller01,controller02,controller03"

# Cinder HA Configuration
cinder_coordination_backend: "valkey"
enable_valkey: "yes"
cinder_cluster_name: "cinder-ha-cluster"

# Additional Services
enable_masakari: "yes"
enable_skyline: "yes"

# Monitoring
enable_prometheus: "yes"
enable_grafana: "yes"
enable_prometheus_node_exporter: "false"  # Conflicts with Ceph node-exporter

# TLS
kolla_enable_tls_internal: "yes"
kolla_enable_tls_external: "yes"
```

### `/etc/hosts` Configuration

**CRITICAL**: Each hostname must resolve uniquely to the API interface IP:

```
10.8.132.194    controller01.otech.local controller01
10.8.132.195    controller02.otech.local controller02
10.8.132.196    controller03.otech.local controller03
10.8.132.197    computehci01.otech.local computehci01
10.8.132.198    computehci02.otech.local computehci02
10.8.132.199    computehci03.otech.local computehci03
```

**DO NOT** add `127.0.1.1 {{ inventory_hostname }}` entries - this breaks RabbitMQ prechecks!

## Deployment Steps

### 1. Prerequisites
```bash
# Install Python dependencies
pip install ansible

# Copy configuration files
cp globals.yml /etc/kolla/globals.yml
cp multinode /etc/kolla/multinode
```

### 2. Network Configuration
- Ensure all VLANs are properly configured
- Verify IP addresses match network plan
- Test connectivity between all nodes

### 3. Hosts File Deployment
```bash
# Deploy consistent /etc/hosts across all nodes
ansible-playbook -i multinode site-ost.yml
```

### 4. Ceph Cluster Preparation
```bash
# Optional: Pause Ceph during bootstrap to avoid disruption
sudo ceph orch pause

# Or be prepared to restart services afterward
```

### 5. Bootstrap Servers
```bash
kolla-ansible -i multinode bootstrap-servers
```

### 6. Post-Bootstrap Ceph Recovery
```bash
# Check Ceph status
sudo ceph -s

# Restart services if needed
sudo ceph orch restart crash
sudo ceph orch restart osd.osd-computehci01
sudo ceph orch restart osd.osd-computehci02
sudo ceph orch restart osd.osd-computehci03

# Resume Ceph operations
sudo ceph orch unpause
```

### 7. Prechecks
```bash
kolla-ansible -i multinode prechecks
```

### 8. Deployment
```bash
kolla-ansible -i multinode deploy
```

## Common Issues and Solutions

### Issue 1: RabbitMQ Hostname Resolution
**Error**: `Hostname has to resolve uniquely to the IP address of api_interface`

**Cause**: Multiple IPs resolving to same hostname in `/etc/hosts`

**Solution**: 
- Remove `127.0.1.1 {{ inventory_hostname }}` entries
- Ensure each hostname resolves only to API interface IP
- Use `site-ost.yml` playbook for consistent hosts file

### Issue 2: Ceph Repository Errors
**Error**: `apt cache update failed due to ceph repo`

**Cause**: Kolla trying to manage Ceph repositories

**Solution**:
```yaml
enable_ceph_repo: "false"
external_ceph_cephx_enabled: true
external_ceph_mon_hosts: "controller01,controller02,controller03"
```

### Issue 3: Port 9100 Conflicts
**Error**: `Timeout when waiting for :9100 to stop`

**Cause**: Ceph node-exporter running on port 9100

**Solution**:
```yaml
enable_prometheus_node_exporter: "false"
```

### Issue 4: Cinder HA Cluster Name
**Error**: `Multiple cinder-volume instances detected but cinder_cluster_name is not set`

**Solution**:
```yaml
cinder_coordination_backend: "valkey"
enable_valkey: "yes"
cinder_cluster_name: "cinder-ha-cluster"
```

### Issue 5: Network Interface Misconfiguration
**Error**: VM traffic using wrong network

**Cause**: Using Ceph cluster interface for tunneling

**Solution**:
```yaml
tunnel_interface: "br-api"  # NOT bond1.3408
```

## VM Communication Flow

### East-West Traffic (VM-to-VM)
```
VM1 → OVN Tunnel (br-api) → OVN Overlay → VM2
```

### North-South Traffic (VM-to-External)
```
VM → OVN Logical Router → br-provider → External Network
```

### API Traffic
```
VM → Internal VIP (10.8.132.210) → HAProxy → Controller Nodes
```

## Network Isolation

- **Ceph Cluster Network**: `bond1.3408` (10.8.132.128/27) - Storage-only traffic
- **Ceph Public Network**: `bond1.3409` (10.8.132.160/27) - Storage access
- **OpenStack API/Tunnel**: `br-api` (10.8.132.192/27) - Services + VM overlay
- **Management**: `br-mgmt` (10.8.132.96/27) - SSH/management
- **External**: `br-provider` - Neutron provider networks

## Maintenance Operations

### Ceph Maintenance
```bash
# Before system changes
sudo ceph orch pause

# After system changes
sudo ceph orch unpause

# Restart specific services
sudo ceph orch restart crash
sudo ceph orch restart mgr
```

### OpenStack Maintenance
```bash
# Check service status
kolla-ansible -i multinode check

# Reconfigure services
kolla-ansible -i multinode reconfigure
```

## Security Considerations

- TLS enabled for all internal and external communication
- Ceph cephx authentication enabled
- Network isolation between storage and compute traffic
- Proper firewall rules for provider networks

## Monitoring Stack

- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboards
- **Node Exporter**: System metrics (via Ceph, not Kolla)
- **OpenStack Exporter**: OpenStack service metrics

## High Availability Features

- **3 controller nodes** with VIP load balancing
- **Cinder HA** with Valkey coordination
- **Masakari** instance high availability
- **Ceph** distributed storage with replication

## Backup and Recovery

- Regular Ceph pool backups
- OpenStack database backups
- Configuration file versioning
- Network configuration documentation
