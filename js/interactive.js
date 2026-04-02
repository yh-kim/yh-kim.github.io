/*!
 * Interactive Features for Pimi's Blog
 * Dark mode, reading progress, code copy, search, reactions, typing, AOS
 */

(function ($) {
    'use strict';

    /* ================================================================
       Utility: load a script asynchronously (safe wrapper)
    ================================================================ */
    function loadScript(url, callback) {
        var s = document.createElement('script');
        s.src = url;
        if (callback) {
            s.addEventListener('load', function () { callback(); }, false);
        }
        document.body.appendChild(s);
    }

    /* ================================================================
       1. Dark Mode
    ================================================================ */
    var DARK_KEY = 'pimi-dark-mode';

    function applyTheme(isDark) {
        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        var $icon = $('#dark-mode-toggle i');
        $icon.attr('class', isDark ? 'fa fa-sun-o' : 'fa fa-moon-o');
    }

    function initDarkMode() {
        // Determine initial preference
        var stored = localStorage.getItem(DARK_KEY);
        var isDark;
        if (stored !== null) {
            isDark = stored === 'true';
        } else {
            isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        applyTheme(isDark);

        $('#dark-mode-toggle').on('click', function (e) {
            e.preventDefault();
            var nowDark = document.documentElement.hasAttribute('data-theme');
            isDark = !nowDark;
            localStorage.setItem(DARK_KEY, isDark);
            applyTheme(isDark);
        });

        // Listen for OS-level changes (only when no stored preference)
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (mq) {
                if (localStorage.getItem(DARK_KEY) === null) {
                    applyTheme(mq.matches);
                }
            });
        }
    }

    /* ================================================================
       2. Reading Progress Bar
    ================================================================ */
    function initReadingProgress() {
        var $bar = $('#reading-progress-bar');
        if ($bar.length === 0) return;

        $(window).on('scroll.readingProgress', function () {
            var scrollTop = $(this).scrollTop();
            var docH = $(document).height() - $(this).height();
            var pct = docH > 0 ? Math.min(100, (scrollTop / docH) * 100) : 0;
            $bar.css('width', pct + '%');
        });
    }

    /* ================================================================
       3. Code Block Copy Button
    ================================================================ */
    function initCodeCopy() {
        // Only in post pages
        if ($('.post-container').length === 0) return;

        $('.highlight').each(function () {
            var $block = $(this);
            var $btn = $('<button class="code-copy-btn" aria-label="코드 복사">복사</button>');
            $block.append($btn);

            $btn.on('click', function () {
                var code = $block.find('code').text();
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(code).then(function () {
                        showCopied($btn);
                    }).catch(function () {
                        fallbackCopy(code, $btn);
                    });
                } else {
                    fallbackCopy(code, $btn);
                }
            });
        });
    }

    function fallbackCopy(text, $btn) {
        var $tmp = $('<textarea style="position:fixed;top:-9999px;opacity:0;">');
        $('body').append($tmp);
        $tmp.val(text).select();
        try { document.execCommand('copy'); } catch (e) {}
        $tmp.remove();
        showCopied($btn);
    }

    function showCopied($btn) {
        $btn.text('완료!').addClass('copied');
        setTimeout(function () {
            $btn.text('복사').removeClass('copied');
        }, 2000);
    }

    /* ================================================================
       4. Post Reactions (localStorage-based)
    ================================================================ */
    var REACT_PREFIX = 'pimi-react-';

    function initReactions() {
        var $container = $('#post-reactions');
        if ($container.length === 0) return;

        var postId = $container.data('post-id') || window.location.pathname;
        var storageKey = REACT_PREFIX + postId;
        var saved = {};
        try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch (e) {}

        // Apply saved counts + highlight current vote
        $container.find('.reaction-btn').each(function () {
            var $btn = $(this);
            var emoji = $btn.data('emoji');
            $btn.find('.reaction-count').text(saved[emoji] || 0);
            if (saved.__voted__ === emoji) {
                $btn.addClass('reacted');
            }
        });

        $container.find('.reaction-btn').on('click', function () {
            var $btn = $(this);
            var emoji = $btn.data('emoji');
            var prev = saved.__voted__;

            // Undo previous vote
            if (prev) {
                saved[prev] = Math.max(0, (saved[prev] || 0) - 1);
                $container.find('[data-emoji="' + prev + '"] .reaction-count').text(saved[prev]);
                $container.find('[data-emoji="' + prev + '"]').removeClass('reacted');
                delete saved.__voted__;
            }

            // Cast new vote (unless clicking same button)
            if (prev !== emoji) {
                saved[emoji] = (saved[emoji] || 0) + 1;
                $btn.find('.reaction-count').text(saved[emoji]);
                $btn.addClass('reacted');
                saved.__voted__ = emoji;
            }

            localStorage.setItem(storageKey, JSON.stringify(saved));
        });
    }

    /* ================================================================
       5. Real-time Search (lunr.js)
    ================================================================ */
    function initSearch() {
        var $overlay = $('#search-overlay');
        var $input   = $('#search-input');
        var $results = $('#search-results');
        if ($overlay.length === 0) return;

        var searchData = null;
        var idx        = null;
        var timer;

        function buildIndex(data) {
            idx = lunr(function () {
                this.field('title',   { boost: 10 });
                this.field('tags',    { boost:  5 });
                this.field('content');
                this.ref('url');
                var self = this;
                data.forEach(function (post) {
                    self.add({
                        url:     post.url,
                        title:   post.title,
                        tags:    (post.tags || []).join(' '),
                        content: post.content || ''
                    });
                });
            });
        }

        function openSearch() {
            $overlay.addClass('active');
            setTimeout(function () { $input.focus(); }, 50);
            if (!searchData) {
                $.getJSON('/search.json', function (data) {
                    searchData = data;
                    buildIndex(data);
                });
            }
        }

        function closeSearch() {
            $overlay.removeClass('active');
            $input.val('');
            $results.empty();
        }

        $('#search-btn').on('click', function (e) {
            e.preventDefault();
            openSearch();
        });

        $('#search-close').on('click', closeSearch);

        $overlay.on('click', function (e) {
            if ($(e.target).is('#search-overlay')) closeSearch();
        });

        $(document).on('keydown', function (e) {
            // '/' key opens search (when not in input/textarea)
            if (e.key === '/' && !$(e.target).is('input, textarea')) {
                e.preventDefault();
                openSearch();
            }
            if (e.key === 'Escape') closeSearch();
        });

        $input.on('input', function () {
            clearTimeout(timer);
            var q = $(this).val().trim();
            timer = setTimeout(function () {
                if (!q || !idx) { $results.empty(); return; }
                var results;
                try {
                    results = idx.search(q + '*');
                } catch (err) {
                    try { results = idx.search(q); } catch (e2) { results = []; }
                }
                renderResults(results);
            }, 200);
        });

        function renderResults(results) {
            $results.empty();
            if (!results || results.length === 0) {
                $results.append('<p class="search-empty">검색 결과가 없습니다.</p>');
                return;
            }
            var map = {};
            (searchData || []).forEach(function (p) { map[p.url] = p; });
            results.slice(0, 8).forEach(function (r) {
                var post = map[r.ref];
                if (!post) return;
                var tags = (post.tags || []).map(function (t) {
                    return '<span class="search-tag">' + t + '</span>';
                }).join('');
                var $item = $(
                    '<a class="search-result-item" href="' + post.url + '">' +
                        '<div class="search-result-title">' + post.title + '</div>' +
                        '<div class="search-result-meta">' + (post.date || '') + (tags ? ' &nbsp;' + tags : '') + '</div>' +
                        '<div class="search-result-snippet">' + (post.content || '').substring(0, 100) + '…</div>' +
                    '</a>'
                );
                $results.append($item);
            });
        }
    }

    /* ================================================================
       6. Typing Animation (Hero — page layout)
    ================================================================ */
    function initTyped() {
        var $el = $('#typed-subheading');
        if ($el.length === 0) return;
        // jQuery's .data() auto-parses JSON from data attributes once HTML entities are decoded;
        // fall back to explicit JSON.parse for robustness.
        var strings;
        try {
            var raw = $el.attr('data-strings') || '[]';
            strings = (typeof raw === 'string') ? JSON.parse(raw) : raw;
        } catch (e) {
            strings = [];
        }
        if (!strings || !strings.length) return;

        loadScript(
            'https://cdn.jsdelivr.net/npm/typed.js@2.0.12/lib/typed.min.js',
            function () {
                /* global Typed */
                new Typed('#typed-subheading', {
                    strings:    strings,
                    typeSpeed:  60,
                    backSpeed:  35,
                    backDelay:  2200,
                    startDelay: 600,
                    loop:       true,
                    showCursor: true,
                    cursorChar: '|'
                });
            }
        );
    }

    /* ================================================================
       7. AOS (Animate On Scroll) init
    ================================================================ */
    function initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 500,
                easing:   'ease-out',
                once:     true,
                offset:   60
            });
        }
    }

    /* ================================================================
       Boot
    ================================================================ */
    $(document).ready(function () {
        initDarkMode();
        initReadingProgress();
        initCodeCopy();
        initReactions();
        initTyped();
        // AOS might load after DOMContentLoaded; use load event as fallback
        $(window).on('load', initAOS);
        // lunr.js is loaded in footer — init search after it's available
        if (typeof lunr !== 'undefined') {
            initSearch();
        } else {
            // Poll briefly until lunr is loaded
            var attempts = 0;
            var poll = setInterval(function () {
                if (typeof lunr !== 'undefined' || attempts++ > 20) {
                    clearInterval(poll);
                    initSearch();
                }
            }, 100);
        }
    });

}(jQuery));
