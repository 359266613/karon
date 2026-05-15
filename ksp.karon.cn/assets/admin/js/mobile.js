(function ($, window, document) {
    'use strict';

    var mobileQuery = window.matchMedia ? window.matchMedia('(max-width: 768px)') : null;
    var $body;
    var $sidebar;
    var $mask;

    function isMobile() {
        return mobileQuery ? mobileQuery.matches : window.innerWidth <= 768;
    }

    function ensureMask() {
        if ($mask && $mask.length) return;
        $mask = $('<div class="mobile-sidebar-mask" aria-hidden="true"></div>');
        $('body').append($mask);
    }

    function openSidebar() {
        if (!isMobile()) return;
        ensureMask();
        $body.addClass('mobile-sidebar-open');
        $sidebar.attr('aria-hidden', 'false');
    }

    function closeSidebar() {
        $body.removeClass('mobile-sidebar-open');
        $sidebar.attr('aria-hidden', 'true');
    }

    function toggleSidebar() {
        if ($body.hasClass('mobile-sidebar-open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }

    function bindSidebar() {
        $body = $('body');
        $sidebar = $('#sidebar');
        ensureMask();

        $('#sidebar_toggle').on('click.mobile', function (event) {
            if (!isMobile()) return;
            event.preventDefault();
            event.stopImmediatePropagation();
            toggleSidebar();
        });

        $mask.on('click.mobile', closeSidebar);

        $(document).on('keyup.mobile', function (event) {
            if (event.key === 'Escape') {
                closeSidebar();
            }
        });

        $sidebar.on('click.mobile', 'a', function () {
            if (!isMobile()) return;
            if ($(this).next('.second-menu').length) return;
            closeSidebar();
        });

        if (mobileQuery && mobileQuery.addEventListener) {
            mobileQuery.addEventListener('change', function (event) {
                if (!event.matches) {
                    closeSidebar();
                }
            });
        } else if (mobileQuery && mobileQuery.addListener) {
            mobileQuery.addListener(function (event) {
                if (!event.matches) {
                    closeSidebar();
                }
            });
        }
    }

    function registerServiceWorker() {
        if (!('serviceWorker' in navigator)) return;
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('/sw.js').catch(function () {
                // 静态导出版或 file:// 预览时可能不可用，忽略以免影响页面主流程。
            });
        });
    }

    $(function () {
        bindSidebar();
        registerServiceWorker();
    });
})(jQuery, window, document);