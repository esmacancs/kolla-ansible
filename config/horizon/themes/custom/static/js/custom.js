/* Custom Horizon Branding JavaScript */

// Add custom branding elements when page loads
$(document).ready(function() {
    // Add custom footer
    addCustomFooter();
    
    // Add custom logo alt text
    updateLogoAltText();
    
    // Add fade-in animation
    addFadeInAnimation();
    
    // Custom login page enhancements
    enhanceLoginPage();
});

// Add custom footer with organization info
function addCustomFooter() {
    var footerHtml = '<div class="custom-footer">' +
        '<div class="container">' +
        '<p>&copy; 2025 Your Organization. All rights reserved.</p>' +
        '<p>Powered by OpenStack</p>' +
        '</div>' +
        '</div>';
    
    $('.footer').append(footerHtml);
}

// Update logo alt text for accessibility
function updateLogoAltText() {
    $('.navbar-brand img, .login img').attr('alt', 'Your Organization Logo');
}

// Add fade-in animation to main content
function addFadeInAnimation() {
    $('.page-header, .panel, .table').addClass('fade-in');
}

// Enhance login page
function enhanceLoginPage() {
    if ($('.login').length) {
        // Add custom title
        $('.login h1').text('Welcome to Your Organization Cloud');
        
        // Add custom subtitle
        $('.login h1').after('<p class="text-center text-muted">Access your cloud resources</p>');
        
        // Add custom background
        $('.login').css('background', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
    }
}

// Custom tooltip for help text
function addCustomTooltips() {
    $('[data-toggle="tooltip"]').tooltip({
        placement: 'top',
        title: function() {
            return $(this).attr('title') || 'Click for more information';
        }
    });
}

// Custom notification styling
function customizeNotifications() {
    // Override default notification styles
    horizon.alert.add = function(type, message, details, escape) {
        var alertClass = 'alert-' + type;
        var alertHtml = '<div class="alert ' + alertClass + ' custom-alert">' +
            '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
            '<strong>' + type.charAt(0).toUpperCase() + type.slice(1) + ':</strong> ' + message +
            (details ? '<br><small>' + details + '</small>' : '') +
            '</div>';
        
        $('.messages').append(alertHtml);
        
        // Auto-dismiss after 5 seconds
        setTimeout(function() {
            $('.custom-alert').fadeOut();
        }, 5000);
    };
}

// Custom loading indicator
function showCustomLoading(element) {
    var loadingHtml = '<div class="custom-loading">' +
        '<div class="spinner"></div>' +
        '<p>Loading...</p>' +
        '</div>';
    
    $(element).append(loadingHtml);
}

function hideCustomLoading() {
    $('.custom-loading').fadeOut(function() {
        $(this).remove();
    });
}

// Initialize custom features
$(document).ready(function() {
    addCustomTooltips();
    customizeNotifications();
});
