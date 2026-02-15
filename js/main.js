//===============================================================
// メニュー制御用の関数とイベント設定（※バージョン2025-1）
//===============================================================
$(function () {
    //-------------------------------------------------
    // 変数の宣言
    //-------------------------------------------------
    const $menubar = $('#menubar');
    const $menubarHdr = $('#menubar_hdr');
    const breakPoint = 9999;

    const HIDE_MENUBAR_IF_HDR_HIDDEN = false;

    const isTouchDevice = ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0);

    //-------------------------------------------------
    // debounce関数
    //-------------------------------------------------
    function debounce(fn, wait) {
        let timerId;
        return function (...args) {
            if (timerId) {
                clearTimeout(timerId);
            }
            timerId = setTimeout(() => {
                fn.apply(this, args);
            }, wait);
        };
    }

    //-------------------------------------------------
    // ドロップダウン用の初期化関数
    //-------------------------------------------------
    function initDropdown($menu, isTouch) {
        $menu.find('ul li').each(function () {
            if ($(this).find('ul').length) {
                $(this).addClass('ddmenu_parent');
                $(this).children('a').addClass('ddmenu');
            }
        });

        if (isTouch) {
            $menu.find('.ddmenu').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const $dropdownMenu = $(this).siblings('ul');
                if ($dropdownMenu.is(':visible')) {
                    $dropdownMenu.hide();
                } else {
                    $menu.find('.ddmenu_parent ul').hide();
                    $dropdownMenu.show();
                }
            });
        } else {
            $menu.find('.ddmenu_parent').hover(
                function () {
                    $(this).children('ul').show();
                },
                function () {
                    $(this).children('ul').hide();
                }
            );
        }
    }

    //-------------------------------------------------
    // ハンバーガーメニューでの開閉制御関数
    //-------------------------------------------------
    function initHamburger($hamburger, $menu) {
        $hamburger.on('click', function () {
            $(this).toggleClass('ham');
            if ($(this).hasClass('ham')) {
                $menu.show();
                if ($(window).width() < breakPoint) {
                    $('body').addClass('noscroll');
                }
            } else {
                $menu.hide();
                if ($(window).width() < breakPoint) {
                    $('body').removeClass('noscroll');
                }
            }
            $menu.find('.ddmenu_parent ul').hide();
        });
    }

    //-------------------------------------------------
    // レスポンシブ時の表示制御 (リサイズ時)
    //-------------------------------------------------
    const handleResize = debounce(function () {
        const windowWidth = $(window).width();

        if (windowWidth < breakPoint) {
            $('body').removeClass('large-screen').addClass('small-screen');
        } else {
            $('body').removeClass('small-screen').addClass('large-screen');
            $menubarHdr.removeClass('ham');
            $menubar.find('.ddmenu_parent ul').hide();
            $('body').removeClass('noscroll');

            if (HIDE_MENUBAR_IF_HDR_HIDDEN) {
                $menubarHdr.hide();
                $menubar.hide();
            } else {
                $menubarHdr.hide();
                $menubar.show();
            }
        }

        if (windowWidth < breakPoint) {
            $menubarHdr.show();
            if (!$menubarHdr.hasClass('ham')) {
                $menubar.hide();
                $('body').removeClass('noscroll');
            }
        }
    }, 200);

    //-------------------------------------------------
    // 初期化
    //-------------------------------------------------
    initDropdown($menubar, isTouchDevice);
    initHamburger($menubarHdr, $menubar);
    handleResize();
    $(window).on('resize', handleResize);

    //-------------------------------------------------
    // アンカーリンク(#)のクリックイベント
    //-------------------------------------------------
    $menubar.find('a[href^="#"]').on('click', function () {
        if ($(this).hasClass('ddmenu')) return;

        if ($menubarHdr.is(':visible') && $menubarHdr.hasClass('ham')) {
            $menubarHdr.removeClass('ham');
            $menubar.hide();
            $menubar.find('.ddmenu_parent ul').hide();
            $('body').removeClass('noscroll');
        }
    });
});


//===============================================================
// スムーススクロール
//===============================================================
$(function () {
    var topButton = $('.pagetop');
    var scrollShow = 'pagetop-show';

    function smoothScroll(target) {
        var scrollTo = target === '#' ? 0 : $(target).offset().top;
        $('html, body').animate({ scrollTop: scrollTo }, 500);
    }

    $('a[href^="#"], .pagetop').click(function (e) {
        e.preventDefault();
        var id = $(this).attr('href') || '#';
        smoothScroll(id);
    });

    $(topButton).hide();
    $(window).scroll(function () {
        if ($(this).scrollTop() >= 300) {
            $(topButton).fadeIn().addClass(scrollShow);
        } else {
            $(topButton).fadeOut().removeClass(scrollShow);
        }
    });

    if (window.location.hash) {
        $('html, body').scrollTop(0);
        setTimeout(function () {
            smoothScroll(window.location.hash);
        }, 1000);
    }
});


//===============================================================
// 画面の高さを取得
//===============================================================
function setDynamicHeight() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
}
setDynamicHeight();
window.addEventListener('resize', setDynamicHeight);


//===============================================================
// 汎用開閉処理（FAQ）
//===============================================================
$(function () {
    $('.faq dt').next().hide();
    $('.faq dt').click(function () {
        $(this).toggleClass('active');
        $(this).next().slideToggle();
        $('.faq dt').not(this).removeClass('active').next().slideUp();
    });
});


//===============================================================
// コンテンツが終了するまで見出しをstickyで固定
//===============================================================
$(window).on('scroll', function () {
    $('.box').each(function () {
        var $box = $(this);
        var textEl = $box.find('.text')[0];
        if (textEl) {
            var textBottom = textEl.getBoundingClientRect().bottom;
            if (textBottom <= 0) {
                $box.find('.title').addClass('fade');
            } else {
                $box.find('.title').removeClass('fade');
            }
        }
    });
});


//===============================================================
// 背景画像が少しずつ上に移動する
//===============================================================
$(document).ready(function () {
    updateParallax();

    $(window).on('scroll', function () {
        updateParallax();
    });

    function updateParallax() {
        var scrollTop = $(window).scrollTop();
        var windowHeight = $(window).height();

        $('.bg-slideup').each(function () {
            var $this = $(this);
            var offsetTop = $this.offset().top;
            var height = $this.outerHeight();

            if (offsetTop + height > scrollTop && offsetTop < scrollTop + windowHeight) {
                var percentScrolled = (scrollTop + windowHeight - offsetTop) / (windowHeight + height);
                percentScrolled = percentScrolled > 1 ? 1 : percentScrolled < 0 ? 0 : percentScrolled;

                var yPos = (percentScrolled * 100);
                $this.css('background-position', 'center ' + yPos + '%');
            }
        });
    }
});


//===============================================================
// テキストのフェードイン効果
//===============================================================
$(function () {
    $('.fade-in-text').on('inview', function (event, isInView) {
        if (isInView && !$(this).data('animated')) {
            let innerHTML = '';
            const text = $(this).text();
            $(this).text('');

            for (let i = 0; i < text.length; i++) {
                innerHTML += `<span class="char" style="animation-delay: ${i * 0.1}s;">${text[i]}</span>`;
            }

            $(this).html(innerHTML).css('visibility', 'visible');
            $(this).data('animated', true);
        }
    });
});
