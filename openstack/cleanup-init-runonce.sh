#!/bin/bash
set -o errexit
set -o pipefail

# Source OpenStack credentials
source /etc/kolla/admin-openrc.sh

echo "Cleaning up resources created by init-runonce..."

# Delete instances
echo "Deleting instances..."
openstack server list -f value -c ID | xargs -r openstack server delete

# Wait for instances to be deleted
sleep 10

# Delete floating IPs (if any)
echo "Deleting floating IPs..."
openstack floating ip list -f value -c ID | xargs -r openstack floating ip delete

# Delete routers
echo "Deleting routers..."
openstack router list -f value -c Name | grep demo-router | xargs -r openstack router delete

# Delete networks
echo "Deleting networks..."
openstack network list -f value -c Name | grep -E "demo-net|public1" | xargs -r openstack network delete

# Delete security group rules
echo "Deleting security group rules..."
ADMIN_PROJECT_ID=$(openstack project list | awk '/ admin / {print $2}')
ADMIN_SEC_GROUP=$(openstack security group list --project ${ADMIN_PROJECT_ID} | awk '/ default / {print $2}')

# Delete custom security group rules (keep default ones)
openstack security group rule list --protocol icmp ${ADMIN_SEC_GROUP} -f value -c ID | xargs -r openstack security group rule delete
openstack security group rule list --protocol tcp --dst-port 22 ${ADMIN_SEC_GROUP} -f value -c ID | xargs -r openstack security group rule delete
openstack security group rule list --protocol tcp --dst-port 8000 ${ADMIN_SEC_GROUP} -f value -c ID | xargs -r openstack security group rule delete
openstack security group rule list --protocol tcp --dst-port 8080 ${ADMIN_SEC_GROUP} -f value -c ID | xargs -r openstack security group rule delete

# Delete SSH key
echo "Deleting SSH key..."
openstack keypair delete mykey

# Delete cirros image
echo "Deleting cirros image..."
openstack image delete cirros

# Reset quotas to defaults
echo "Resetting quotas..."
openstack quota delete ${ADMIN_PROJECT_ID}

echo "Cleanup completed!"
