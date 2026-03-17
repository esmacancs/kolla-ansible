# Custom Horizon Branding Assets

## Logo Requirements

### Main Logo (logo.svg)
- **Location**: `/etc/kolla/config/horizon/themes/custom/img/logo.svg`
- **Size**: 200x50 pixels (recommended)
- **Format**: SVG (scalable vector graphics)
- **Purpose**: Header logo in the navigation bar

### Login Logo (login.svg)
- **Location**: `/etc/kolla/config/horizon/themes/custom/img/login.svg`
- **Size**: 300x150 pixels (recommended)
- **Format**: SVG (scalable vector graphics)
- **Purpose**: Login page branding

## How to Add Your Logos

1. **Prepare your logos**:
   ```bash
   # Copy your logos to the correct locations
   cp /path/to/your/logo.png /etc/kolla/config/horizon/themes/custom/img/logo.png
   cp /path/to/your/login.png /etc/kolla/config/horizon/themes/custom/img/login.png
   ```

2. **Verify file permissions**:
   ```bash
   chmod 644 /etc/kolla/config/horizon/themes/custom/img/*.png
   ```

3. **Redeploy Horizon**:
   ```bash
   kolla-ansible reconfigure -i multinode --tags horizon
   ```

## Customization Options

### Colors (in custom.css)
Edit `/etc/kolla/config/horizon/themes/custom/css/custom.css` to change:
- Primary color: `#030303` (currently black)
- Secondary color: `#f8f8f8` (currently light gray)
- Accent color: `#337ab7` (currently blue)

### Organization Information
Edit `/etc/kolla/config/horizon/local_settings` to change:
- Organization name
- Footer links
- Contact information

## File Structure
```
/etc/kolla/config/horizon/
├── local_settings
└── themes/
    └── custom/
        ├── css/
        │   └── custom.css
        ├── js/
        │   └── custom.js
        ├── img/
        │   ├── logo.png      ← Add your main logo here
        │   └── login.png     ← Add your login logo here
        └── README.md
```

## Testing
After deployment, access your Horizon dashboard and verify:
1. Your logo appears in the header
2. Login page shows your branding
3. Colors match your organization theme
4. Footer shows your organization information
