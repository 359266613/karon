$(function() {
    var $toggle = $('#sidebar_toggle');
    var $sidebar = $('#sidebar');
    var $body = $('body');
    var isHide = false;
    var isMini = false;
    var $spreadItems = $('#spreadItems');
    var $menuSpread = $('#menuSpread');
    var spreadSourceData = {};
    var $currentSecond = null;
    var $currentFirst = null;
    var $menuPopup = $('#menuPopup');
    var level = 0;
    var timerIn = 100;
    var timerOut = 200;
    var timer1 = { in: 0,
        out: 0
    };
    var timer2 = { in: 0,
        out: 0
    };
    var timer3 = { in: 0,
        out: 0
    };
    var timer4 = { in: 0,
        out: 0
    };
    (function init() {
        initSource();
        var hideSidebar = localStorage.getItem('hideSidebar');
        isHide = hideSidebar === null || hideSidebar === 'false' ? false : hideSidebar;
        if (isHide) {
            $body.addClass('side-hide');
            $menuPopup.removeClass('show');
        }
        setTimeout(function() {
            $sidebar.addClass('transition');
        }, 300)
    })();

    function toggle() {
        isHide = !isHide;
        localStorage.setItem('hideSidebar', isHide);
    }

    function retractAll() {
        var $secondMenu = $('.second-menu');
        $secondMenu.slideUp('fast', function() {
            $(this).parent().removeClass('active');
        });
    }

    function initSource() {
        var $elems = $spreadItems.children();
        $elems.each(function(index, elem) {
            key = $(elem).data('group');
            if (key) {
                if (!spreadSourceData[key]) {
                    spreadSourceData[key] = [];
                }
                spreadSourceData[key] = $(elem);

            }
        });
    }
    $toggle.on('click', function() {
        toggle();
        $body.toggleClass('side-hide');
        if (isHide) {
            retractAll();
        }
    });
    $sidebar.on('click', 'a', function(e) {
        var $this = $(this),
            $parent = $this.parent(),
            $next = $this.next();
        if ($next.length) {
            e.preventDefault();
            if (isHide) {
                toggle();
                $body.removeClass('side-hide');
            }
            if ($parent.hasClass('active')) {
                $next.slideUp('fast', function() {
                    $parent.removeClass('active');
                });
            } else {
                $next.slideDown('fast', function() {
                    $parent.addClass('active');
                });
            }
        }
    }).on('mouseenter', 'a[data-type="1"]', function() {
        var $this = $(this);
        if ($this.hasClass('is-active')) {
            clearTimeout(timer2.out);
            clearTimeout(timer3.out);
            return false;
        }
        clearTimeout(timer1.in);
        timer1.in = setTimeout(function() {
            clearTimeout(timer1.out);
            var key = $this.data('group');
            var $ul = $this.next();
            $currentFirst && $currentFirst.removeClass('is-active');
            $currentSecond && $currentSecond.removeClass('is-active');
            $currentFirst = $this;
            $currentFirst.addClass('is-active');
            if ($ul.length) {
                clearTimeout(timer2.out);
                if (isHide) {
                    isMini = false;
                    $menuPopup.empty().append($ul.clone().addClass('show'));
                    showMenuPopup();
                } else {
                    isMini = true;
                }
                hideMenuSpread();
            } else {
                $currentSecond = null;
                hideMenuPopup();
                if (isHide) {
                    $menuSpread.addClass('is-mini');
                } else {
                    $menuSpread.removeClass('is-mini');
                }
                spreadSourceData[key].addClass('show').siblings('.show').removeClass('show');
                showMenuSpread();
            }
        }, timerIn)
    }).on('mouseleave', 'a[data-type="1"]', function() {
        var $this = $(this);
        clearTimeout(timer1.in);
        if ($this.hasClass('is-active')) {
            clearTimeout(timer1.out);
            timer1.out = setTimeout(function() {
                hideMenuSpread();
                $this.removeClass('is-active');
            }, timerOut)
        }
    });

    $body.on('mouseenter', 'a[data-type="2"]', function() {
        var $this = $(this);
        if ($this.hasClass('is-active')) {
            clearTimeout(timer3.out);
            return false;
        }
        clearTimeout(timer1.out);
        clearTimeout(timer2.in);
        timer2.in = setTimeout(function() {
            clearTimeout(timer2.out);
            var key = $this.data('group');
            $currentSecond && $currentSecond.removeClass('is-active');
            $this.addClass('is-active');
            $currentSecond = $this;
            if (!isHide) {
                $currentFirst && $currentFirst.removeClass('is-active');
            }
            if (isHide && isMini) {
                $menuSpread.addClass('is-mini');
            } else {
                $menuSpread.removeClass('is-mini');
            }
            if (spreadSourceData[key]) {
                spreadSourceData[key].addClass('show').siblings('.show').removeClass('show');
                showMenuSpread();
            } else {
                hideMenuSpread();
            }
        }, timerIn)
    }).on('mouseleave', 'a[data-type="2"]', function() {
        var $this = $(this);
        clearTimeout(timer2.in);
        if ($this.hasClass('is-active')) {
            clearTimeout(timer2.out);
            timer2.out = setTimeout(function() {
                hideMenuSpread();
                $this.removeClass('is-active');
            }, timerOut)
        }
    });

    function showMenuSpread() {
        clearTimeout(timer3.out);
        if (!$menuSpread.hasClass('show')) {
            $menuSpread.addClass('show menuInLeft');
        }
    }

    function hideMenuSpread() {
        $menuSpread.removeClass('show menuInLeft');
    }

    function showMenuPopup() {
        clearTimeout(timer3.out);
        $menuPopup.addClass('show menuInLeft');
    }

    function hideMenuPopup() {
        $menuPopup.removeClass('show menuInLeft');
    }

    $menuSpread.on('mouseenter', function() {
        clearTimeout(timer1.out);
        clearTimeout(timer2.out);
        clearTimeout(timer3.out);
        clearTimeout(timer4.out);
        /*if(level == 1) {
            $currentFirst && $currentFirst.addClass('is-hover');
        } else {
            $currentSecond && $currentSecond.addClass('is-active');
        }*/
        /*if(isHide && level == 2) {
            $menuPopup.addClass('show');
        }*/
    }).on('mouseleave', function() {
        clearTimeout(timer3.out);
        timer3.out = setTimeout(function() {
            $currentSecond && $currentSecond.removeClass('is-active');
            $currentFirst && $currentFirst.removeClass('is-active');
            hideMenuSpread();
            hideMenuPopup();
        }, timerOut)
    });

    $menuPopup.on('mouseenter', function() {
        clearTimeout(timer1.out);
        clearTimeout(timer2.out);
        clearTimeout(timer3.out);
        clearTimeout(timer4.out);
        hideMenuSpread();
        // $currentFirst && $currentFirst.removeClass('is-active');
        // $currentSecond && $currentSecond.removeClass('is-active');
        $menuPopup.addClass('show');
    }).on('mouseleave', function() {
        timer4.out = setTimeout(function() {
            hideMenuPopup();
            $currentFirst && $currentFirst.removeClass('is-active');
        }, timerOut)
    });
});


function setShutcut() {
    top.layerIndex005 = layer.open({
        type: 2,
        title: "设置快捷菜单",
        area: ['650px', '500px'],
        content: "PubShortcut_list",

        closeBtn: 2,
        //btn: ['关闭'],
        yes: function(index, layo) {
            layer.close(index);
        }
    });
}