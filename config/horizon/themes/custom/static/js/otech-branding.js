/**
 * OTECH Cloud Horizon Custom Branding JavaScript
 * Enhanced UX with modern interactions and performance monitoring
 */

(function($) {
    'use strict';

    // OTECH Cloud Configuration
    var OTECH_CONFIG = {
        company: 'OTECH Solutions',
        version: '2025.1',
        supportEmail: 'support@otech.local',
        docsUrl: 'https://docs.otech.local',
        apiUrl: 'https://api.otech.local/docs',
        statusUrl: 'https://status.otech.local',
        colors: {
            primary: '#ff6b35',
            secondary: '#2a5298',
            accent: '#3498db',
            success: '#27ae60',
            warning: '#f39c12',
            danger: '#e74c3c',
            info: '#3498db',
            light: '#ecf0f1',
            dark: '#2c3e50'
        }
    };

    // Initialize OTECH Branding
    var OTECH_Branding = {
        init: function() {
            this.setupFooter();
            this.enhanceLogin();
            this.addAnimations();
            this.setupKeyboardShortcuts();
            this.enhanceTables();
            this.setupTooltips();
            this.setupLoadingIndicators();
            this.setupErrorHandling();
            this.performanceMonitor();
            this.enhanceForms();
            this.addCustomStyles();
        },

        // Custom Footer
        setupFooter: function() {
            var currentYear = new Date().getFullYear();
            var footerHtml = `
                <div class="container">
                    <div class="row">
                        <div class="col-md-6">
                            <p>&copy; ${currentYear} ${OTECH_CONFIG.company}. All rights reserved.</p>
                            <p><small>Powered by OpenStack | Version: ${OTECH_CONFIG.version}</small></p>
                        </div>
                        <div class="col-md-6 text-right">
                            <p>
                                <a href="${OTECH_CONFIG.docsUrl}" target="_blank">Documentation</a> |
                                <a href="${OTECH_CONFIG.apiUrl}" target="_blank">API Docs</a> |
                                <a href="${OTECH_CONFIG.statusUrl}" target="_blank">Status</a> |
                                <a href="mailto:${OTECH_CONFIG.supportEmail}">Support</a>
                            </p>
                        </div>
                    </div>
                </div>
            `;
            
            $('.footer').html(footerHtml);
        },

        // Enhanced Login Page
        enhanceLogin: function() {
            if ($('.login').length) {
                $('.login h1').text('Welcome to OTECH Cloud');
                $('.login .panel-title').text('Cloud Dashboard Login');
                
                // Add floating labels
                $('.login .form-group').each(function() {
                    var $input = $(this).find('input');
                    var $label = $(this).find('label');
                    
                    if ($input.length && $label.length) {
                        $input.addClass('floating-label');
                        $label.addClass('floating-label-text');
                        
                        $input.on('focus', function() {
                            $label.addClass('focused');
                        });
                        
                        $input.on('blur', function() {
                            if (!$(this).val()) {
                                $label.removeClass('focused');
                            }
                        });
                    }
                });
            }
        },

        // Add Animations
        addAnimations: function() {
            // Fade in dashboard panels
            $('.dashboard .panel').hide().each(function(index) {
                var $panel = $(this);
                setTimeout(function() {
                    $panel.addClass('fade-in').show();
                }, index * 100);
            });

            // Animate navigation
            $('.sidebar .nav > li').each(function(index) {
                var $li = $(this);
                setTimeout(function() {
                    $li.addClass('slide-in');
                }, index * 50);
            });
        },

        // Keyboard Shortcuts
        setupKeyboardShortcuts: function() {
            $(document).keydown(function(e) {
                // Ctrl+K for quick search
                if (e.ctrlKey && e.keyCode === 75) {
                    e.preventDefault();
                    $('#search-input').focus();
                }
                
                // Ctrl+N for new instance
                if (e.ctrlKey && e.keyCode === 78) {
                    e.preventDefault();
                    if ($('#btn_create_new_instance').length) {
                        $('#btn_create_new_instance').click();
                    }
                }
                
                // Escape to close modals
                if (e.keyCode === 27) {
                    $('.modal').modal('hide');
                    $('.popover').popover('hide');
                    $('.tooltip').tooltip('hide');
                }
                
                // Ctrl+/ for help
                if (e.ctrlKey && e.keyCode === 191) {
                    e.preventDefault();
                    window.open(OTECH_CONFIG.docsUrl, '_blank');
                }
            });
        },

        // Enhanced Tables
        enhanceTables: function() {
            $('table').addClass('table-hover');
            
            // Add sorting indicators
            $('table th.sortable').each(function() {
                var $th = $(this);
                if (!$th.find('.sort-indicator').length) {
                    $th.append(' <span class="sort-indicator">↕</span>');
                }
            });
            
            // Add row selection
            $('table tbody tr').click(function() {
                $(this).toggleClass('selected-row');
            });
            
            // Add table actions
            $('.table-actions').each(function() {
                var $actions = $(this);
                if (!$actions.find('.btn-group').length) {
                    $actions.wrapInner('<div class="btn-group"></div>');
                }
            });
        },

        // Enhanced Tooltips
        setupTooltips: function() {
            $('[data-toggle="tooltip"]').each(function() {
                var $element = $(this);
                $element.tooltip({
                    container: 'body',
                    placement: 'top',
                    trigger: 'hover focus',
                    delay: { show: 500, hide: 100 }
                });
            });
            
            // Add custom tooltips for table cells
            $('.table td[data-tooltip]').each(function() {
                var $td = $(this);
                $td.attr('title', $td.data('tooltip'));
                $td.tooltip({
                    container: 'body',
                    placement: 'top'
                });
            });
        },

        // Loading Indicators
        setupLoadingIndicators: function() {
            // Show loading on AJAX requests
            $(document).ajaxStart(function() {
                if (!$('.loading-indicator').length) {
                    $('body').append(`
                        <div class="loading-indicator">
                            <div class="loading-spinner"></div>
                            <div class="loading-text">Loading...</div>
                        </div>
                    `);
                }
            });
            
            $(document).ajaxStop(function() {
                $('.loading-indicator').fadeOut(300, function() {
                    $(this).remove();
                });
            });
            
            // Add loading to buttons
            $('.btn[data-loading-text]').click(function() {
                var $btn = $(this);
                var originalText = $btn.text();
                $btn.text($btn.data('loading-text')).prop('disabled', true);
                
                setTimeout(function() {
                    $btn.text(originalText).prop('disabled', false);
                }, 2000);
            });
        },

        // Error Handling
        setupErrorHandling: function() {
            // Global error handler
            window.addEventListener('error', function(e) {
                console.error('OTECH Dashboard Error:', e.error);
                OTECH_Branding.showNotification('An unexpected error occurred. Please refresh the page.', 'danger');
            });
            
            // AJAX error handling
            $(document).ajaxError(function(event, xhr, settings, error) {
                var message = 'Request failed';
                if (xhr.responseJSON && xhr.responseJSON.error) {
                    message = xhr.responseJSON.error;
                } else if (xhr.status === 401) {
                    message = 'Session expired. Please login again.';
                } else if (xhr.status === 403) {
                    message = 'Permission denied.';
                } else if (xhr.status >= 500) {
                    message = 'Server error. Please try again later.';
                }
                
                OTECH_Branding.showNotification(message, 'danger');
            });
        },

        // Performance Monitoring
        performanceMonitor: function() {
            // Track page load time
            window.addEventListener('load', function() {
                var loadTime = performance.now();
                console.log(`OTECH Dashboard loaded in ${loadTime.toFixed(2)}ms`);
                
                // Show performance warning if slow
                if (loadTime > 3000) {
                    OTECH_Branding.showNotification('Dashboard loading slowly. Consider checking your connection.', 'warning');
                }
            });
            
            // Monitor memory usage
            if (performance.memory) {
                setInterval(function() {
                    var memoryUsage = performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;
                    if (memoryUsage > 0.8) {
                        console.warn('High memory usage detected:', memoryUsage);
                    }
                }, 30000);
            }
        },

        // Enhanced Forms
        enhanceForms: function() {
            // Add floating labels to all forms
            $('.form-group').each(function() {
                var $group = $(this);
                var $input = $group.find('input, textarea, select');
                var $label = $group.find('label');
                
                if ($input.length && $label.length && !$group.hasClass('has-floating-label')) {
                    $group.addClass('has-floating-label');
                    
                    $input.on('focus', function() {
                        $group.addClass('focused');
                    });
                    
                    $input.on('blur', function() {
                        if (!$(this).val()) {
                            $group.removeClass('focused');
                        }
                    });
                    
                    // Check initial state
                    if ($input.val()) {
                        $group.addClass('focused');
                    }
                }
            });
            
            // Add form validation
            $('form[data-validate]').submit(function(e) {
                var $form = $(this);
                var isValid = true;
                
                $form.find('input[required], select[required], textarea[required]').each(function() {
                    var $field = $(this);
                    var $group = $field.closest('.form-group');
                    
                    if (!$field.val()) {
                        $group.addClass('has-error');
                        isValid = false;
                    } else {
                        $group.removeClass('has-error');
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                    OTECH_Branding.showNotification('Please fill in all required fields.', 'warning');
                }
            });
        },

        // Add Custom Styles
        addCustomStyles: function() {
            // Add custom logo alt text
            $('.navbar-brand img').attr('alt', 'OTECH Cloud Dashboard');
            
            // Add custom favicon
            if (!$('link[rel="icon"]').length) {
                $('head').append('<link rel="icon" type="image/x-icon" href="/static/themes/custom/img/favicon.ico">');
            }
            
            // Add custom fonts
            if (!$('link[href*="fonts.googleapis.com"]').length) {
                $('head').append(`
                    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Fira+Code:wght@400;600&display=swap" rel="stylesheet">
                `);
            }
            
            // Add custom meta tags
            $('head').append(`
                <meta name="description" content="OTECH Cloud Dashboard - Powered by OpenStack">
                <meta name="author" content="${OTECH_CONFIG.company}">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            `);
        },

        // Show Notification
        showNotification: function(message, type) {
            var notification = $(`
                <div class="alert alert-${type} alert-dismissible fade-in otech-notification" role="alert">
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                    <strong>${OTECH_CONFIG.company}:</strong> ${message}
                </div>
            `);
            
            // Find or create messages container
            var $messages = $('.messages');
            if (!$messages.length) {
                $messages = $('<div class="messages"></div>');
                $('body').prepend($messages);
            }
            
            $messages.append(notification);
            
            // Auto-dismiss after 5 seconds
            setTimeout(function() {
                notification.fadeOut(500, function() {
                    $(this).remove();
                });
            }, 5000);
        }
    };

    // Initialize when DOM is ready
    $(document).ready(function() {
        OTECH_Branding.init();
        console.log('OTECH Cloud Dashboard initialized successfully');
    });

    // Make available globally
    window.OTECH_Branding = OTECH_Branding;

})(jQuery);
