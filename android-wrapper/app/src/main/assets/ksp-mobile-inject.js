(function () {
    'use strict';

    if (window.__kspMobileInjected) return;
    window.__kspMobileInjected = true;

    function isMobile() {
        return window.innerWidth <= 900;
    }

    function ensureMask() {
        var mask = document.querySelector('.mobile-sidebar-mask');
        if (mask) return mask;
        mask = document.createElement('div');
        mask.className = 'mobile-sidebar-mask';
        mask.setAttribute('aria-hidden', 'true');
        document.body.appendChild(mask);
        mask.addEventListener('click', closeSidebar);
        return mask;
    }

    function openSidebar() {
        if (!isMobile()) return;
        ensureMask();
        document.body.classList.add('mobile-sidebar-open');
        var sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.setAttribute('aria-hidden', 'false');
    }

    function closeSidebar() {
        document.body.classList.remove('mobile-sidebar-open');
        var sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.setAttribute('aria-hidden', 'true');
    }

    function toggleSidebar(event) {
        if (!isMobile()) return;
        event.preventDefault();
        event.stopPropagation();
        if (document.body.classList.contains('mobile-sidebar-open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }

    function bindSidebar() {
        var toggle = document.getElementById('sidebar_toggle');
        var sidebar = document.getElementById('sidebar');
        if (!toggle || !sidebar) return;

        ensureMask();
        sidebar.setAttribute('aria-hidden', 'true');
        toggle.addEventListener('click', toggleSidebar, true);

        sidebar.addEventListener('click', function (event) {
            if (!isMobile()) return;
            var link = event.target.closest ? event.target.closest('a') : null;
            if (!link) return;
            var next = link.nextElementSibling;
            if (next && next.classList.contains('second-menu')) return;
            closeSidebar();
        }, true);

        document.addEventListener('keyup', function (event) {
            if (event.key === 'Escape') closeSidebar();
        });
    }

    function forceMobileClass() {
        document.documentElement.classList.add('ksp-apk-mobile');
        document.body.classList.add('ksp-apk-mobile');
    }

    function run() {
        if (!document.body) return;
        forceMobileClass();
        bindSidebar();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }

    setTimeout(run, 500);
    setTimeout(run, 1500);
})();