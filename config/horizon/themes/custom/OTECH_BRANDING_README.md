# OTECH Cloud Horizon Custom Branding

## Overview

This is a comprehensive custom branding theme for OpenStack Horizon dashboard, designed specifically for OTECH Solutions cloud infrastructure. The theme features modern gradient design, enhanced user experience, and responsive layout.

## Features

### 🎨 Visual Design
- **Modern Gradient Design**: Beautiful color gradients throughout the interface
- **OTECH Branding**: Custom color scheme with orange (#ff6b35) and blue (#2a5298) accents
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Dark Mode Support**: Automatic dark mode detection and styling
- **Custom Animations**: Smooth transitions and micro-interactions

### 🚀 Enhanced UX
- **Custom Footer**: Professional footer with company information and links
- **Enhanced Login Page**: Modern login interface with floating labels
- **Keyboard Shortcuts**: Productivity shortcuts (Ctrl+K search, Ctrl+N new instance, etc.)
- **Loading Indicators**: Professional loading animations for AJAX requests
- **Error Handling**: User-friendly error notifications and messages

### 📊 Dashboard Improvements
- **Enhanced Tables**: Better styling, sorting indicators, and row selection
- **Card Animations**: Fade-in animations for dashboard panels
- **Custom Tooltips**: Enhanced tooltips with better positioning
- **Form Enhancements**: Floating labels, validation, and improved styling

## File Structure

```
/etc/kolla/config/horizon/themes/custom/
├── README.md                           # This file
├── theme.yaml                          # Theme configuration
├── css/
│   ├── custom.css                       # Main custom styles
│   ├── otech-branding.css              # OTECH branding styles
│   ├── responsive.css                   # Responsive design
│   └── animations.css                  # Animation definitions
├── js/
│   ├── custom.js                        # Main custom JavaScript
│   ├── otech-branding.js               # OTECH branding JavaScript
│   ├── keyboard-shortcuts.js           # Keyboard shortcuts
│   └── performance.js                   # Performance monitoring
└── img/
    ├── logo.svg                         # Main logo
    ├── otech-logo.svg                   # OTECH logo
    ├── otech-login-logo.svg            # Login page logo
    ├── login.svg                        # Original login logo
    └── favicon.ico                      # Favicon
```

## Configuration

### 1. Horizon Settings

Add to `/etc/kolla/config/horizon/local_settings`:

```python
# Site Branding
SITE_BRANDING = "OTECH Cloud Dashboard"
SITE_BRANDING_LINK = "https://otech.local"

# Custom Theme Configuration
AVAILABLE_THEMES = [
    ('default', 'Default', 'themes/default'),
    ('custom', 'OTECH Theme', 'themes/custom'),
]
DEFAULT_THEME = 'custom'

# Custom Settings
OTECH_CLOUD_SETTINGS = {
    'company_name': 'OTECH Solutions',
    'support_email': 'support@otech.local',
    'documentation_url': 'https://docs.otech.local',
    'api_docs_url': 'https://api.otech.local/docs',
    'status_page_url': 'https://status.otech.local',
}
```

### 2. Theme Configuration

The theme is configured in `theme.yaml` with:

- **Color Palette**: Primary, secondary, and accent colors
- **Typography**: Custom fonts and text styling
- **Layout**: Component dimensions and spacing
- **Features**: Enabled theme features and plugins

## Color Scheme

| Color | Usage | Hex Code |
|-------|-------|----------|
| **Primary** | Buttons, links, highlights | `#ff6b35` |
| **Secondary** | Navigation, headers | `#2a5298` |
| **Accent** | Info elements, tables | `#3498db` |
| **Success** | Success messages | `#27ae60` |
| **Warning** | Warning messages | `#f39c12` |
| **Danger** | Error messages | `#e74c3c` |
| **Light** | Backgrounds, text | `#ecf0f1` |
| **Dark** | Text, borders | `#2c3e50` |

## Customization

### Adding Custom Colors

Edit `css/otech-branding.css`:

```css
:root {
    --otech-custom-color: #your-color;
    --otech-custom-gradient: linear-gradient(...);
}
```

### Modifying Logo

Replace the SVG files in `img/` directory:
- `otech-logo.svg` - Main navigation logo
- `otech-login-logo.svg` - Login page logo

### Adding Custom JavaScript

Add new functionality in `js/otech-branding.js`:

```javascript
// Add custom functionality
OTECH_Branding.customFunction = function() {
    // Your custom code
};
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Focus search input |
| `Ctrl+N` | New instance (if available) |
| `Ctrl+/` | Open documentation |
| `Escape` | Close modals/popovers |

## Performance Features

### Monitoring
- Page load time tracking
- Memory usage monitoring
- AJAX request performance
- Slow loading warnings

### Optimizations
- CSS compression
- JavaScript minification
- Image optimization
- Lazy loading for large content

## Browser Compatibility

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome | 90+ | ✅ Full Support |
| Firefox | 88+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |
| Edge | 90+ | ✅ Full Support |

### Mobile Support

| Platform | Minimum Version | Status |
|----------|----------------|--------|
| iOS | 14+ | ✅ Full Support |
| Android | 10+ | ✅ Full Support |

## Security Features

- **HTTPS Only**: All resources loaded over HTTPS
- **Secure Headers**: CSP, X-Frame-Options, XSS protection
- **Session Security**: Secure cookies, CSRF protection
- **Input Validation**: Client and server-side validation

## Accessibility

- **WCAG 2.1 AA**: Compliance with accessibility standards
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader**: Optimized for screen readers
- **High Contrast**: Support for high contrast mode

## Troubleshooting

### Common Issues

1. **Theme Not Loading**
   - Check file permissions
   - Verify theme configuration
   - Restart Horizon services

2. **CSS Not Applying**
   - Clear browser cache
   - Check CSS syntax
   - Verify file paths

3. **JavaScript Errors**
   - Check browser console
   - Verify jQuery dependency
   - Check for syntax errors

### Debug Mode

Enable debug mode in `local_settings`:

```python
DEBUG = True
LOGGING['loggers']['horizon']['level'] = 'DEBUG'
```

## Deployment

### 1. Apply Configuration

```bash
# Copy theme files
sudo cp -r /etc/kolla/config/horizon/themes/custom /usr/share/openstack-dashboard/openstack_dashboard/themes/

# Update local_settings
sudo cp /etc/kolla/config/horizon/local_settings /etc/openstack-dashboard/local_settings

# Restart Horizon
sudo systemctl restart apache2
# or
sudo docker restart horizon
```

### 2. Verify Installation

1. Open Horizon dashboard
2. Go to Settings → Theme
3. Select "OTECH Theme"
4. Verify styling and functionality

## Maintenance

### Regular Tasks

- **Monthly**: Check for OpenStack updates
- **Quarterly**: Review and update branding
- **Annually**: Full theme review and optimization

### Updates

To update the theme:

1. Backup current configuration
2. Update theme files
3. Test in staging environment
4. Deploy to production
5. Verify functionality

## Support

### Documentation

- **User Guide**: Available in dashboard help
- **API Documentation**: https://api.otech.local/docs
- **Status Page**: https://status.otech.local

### Contact

- **Email**: support@otech.local
- **Documentation**: https://docs.otech.local
- **Issues**: Report through dashboard or email

## License

This theme is proprietary to OTECH Solutions and is provided as part of the OTECH Cloud infrastructure.

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-11 | Initial release with full branding |

---

**OTECH Solutions Cloud Dashboard**  
*Modern cloud infrastructure management platform*
