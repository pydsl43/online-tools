/**
 * 白给工具 - 国际化引擎
 * BaiGei Tools - Internationalization Engine
 *
 * Pure frontend i18n solution for static sites (no backend, no build tools).
 *
 * Usage:
 *   1. Include before </body>: <script src="/i18n/translations.js"></script>
 *   2. Include after translations: <script src="/i18n/i18n.js" defer></script>
 *   3. Add data-i18n attributes to elements
 *   4. Call createLanguageSelector('containerId') to add a language picker
 *
 * Priority: URL param (?lang=xx) > localStorage > browser language > zh (default)
 */
(function () {
  'use strict';

  var SUPPORTED_LANGS = ['zh', 'en', 'ja', 'es', 'pt'];
  var DEFAULT_LANG = 'zh';
  var STORAGE_KEY = 'baigei_lang';
  var currentLang = DEFAULT_LANG;

  /**
   * Get the user's preferred language.
   * Priority: URL param ?lang= > localStorage > browser language > default
   */
  function detectLanguage() {
    // 1. URL parameter ?lang=xx
    var urlParams = new URLSearchParams(window.location.search);
    var urlLang = urlParams.get('lang');
    if (urlLang && SUPPORTED_LANGS.indexOf(urlLang) !== -1) {
      return urlLang;
    }

    // 2. localStorage
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGS.indexOf(stored) !== -1) {
      return stored;
    }

    // 3. Browser language (navigator.language)
    var browserLang = (navigator.language || navigator.userLanguage || '').substring(0, 2);
    if (browserLang && SUPPORTED_LANGS.indexOf(browserLang) !== -1) {
      return browserLang;
    }

    // 4. Fallback
    return DEFAULT_LANG;
  }

  /**
   * Apply translations to all elements with data-i18n attributes.
   */
  function applyTranslations(lang) {
    if (typeof translations === 'undefined' || !translations[lang]) {
      // Fallback to default language if translation data doesn't exist
      if (lang !== DEFAULT_LANG) {
        return applyTranslations(DEFAULT_LANG);
      }
      return;
    }

    var dict = translations[lang];
    currentLang = lang;

    // 1. data-i18n: replace textContent (escaped)
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    // 2. data-i18n-html: replace innerHTML (allows HTML)
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    // 3. data-i18n-placeholder: set placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] !== undefined) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // 4. data-i18n-title: set title attribute
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-title');
      if (dict[key] !== undefined) {
        el.setAttribute('title', dict[key]);
      }
    });

    // 5. data-i18n-alt: set alt attribute
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-alt');
      if (dict[key] !== undefined) {
        el.setAttribute('alt', dict[key]);
      }
    });

    // 6. data-i18n-value: set value attribute
    document.querySelectorAll('[data-i18n-value]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-value');
      if (dict[key] !== undefined) {
        el.value = dict[key];
      }
    });

    // 7. data-i18n-meta-content: set <meta> content attribute
    document.querySelectorAll('[data-i18n-meta-content]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-meta-content');
      if (dict[key] !== undefined) {
        el.setAttribute('content', dict[key]);
      }
    });

    // 8. data-i18n-title-tag: set <title> tag textContent
    document.querySelectorAll('title[data-i18n-title-tag]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-title-tag');
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    // 9. Update <html lang="...">
    document.documentElement.setAttribute('lang', lang + (lang === 'zh' ? '-CN' : ''));

    // 10. Update language selector button states if present
    document.querySelectorAll('.baigei-lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  /**
   * Switch to a specific language and re-apply translations.
   * Saves the preference to localStorage.
   */
  function setLanguage(lang) {
    if (SUPPORTED_LANGS.indexOf(lang) === -1) {
      lang = DEFAULT_LANG;
    }
    localStorage.setItem(STORAGE_KEY, lang);
    applyTranslations(lang);
  }

  /**
   * Get the current active language code.
   */
  function getCurrentLang() {
    return currentLang;
  }

  /**
   * Create a styled language selector dropdown inside the given container element.
   * @param {string} containerId - The ID of the container element
   */
  function createLanguageSelector(containerId) {
    var container = document.getElementById(containerId);
    if (!container) {
      console.warn('[i18n] Container #' + containerId + ' not found');
      return;
    }

    var langNames = {
      zh: '中文',
      en: 'English',
      ja: '日本語',
      es: 'Español',
      pt: 'Português',
    };

    // Create wrapper
    var wrapper = document.createElement('div');
    wrapper.className = 'baigei-lang-selector';

    // Create style element for CSS
    var style = document.createElement('style');
    style.textContent =
      '.baigei-lang-selector{display:inline-flex;align-items:center;gap:2px;}' +
      '.baigei-lang-btn{padding:4px 8px;font-size:0.75rem;font-weight:500;border:1px solid rgba(255,255,255,0.2);' +
      'background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.7);cursor:pointer;' +
      'transition:all 0.2s ease;font-family:inherit;letter-spacing:0.02em;}' +
      '.baigei-lang-btn:first-child{border-radius:6px 0 0 6px;}' +
      '.baigei-lang-btn:last-child{border-radius:0 6px 6px 0;}' +
      '.baigei-lang-btn:not(:last-child){border-right:none;}' +
      '.baigei-lang-btn:hover{background:rgba(255,255,255,0.15);color:#fff;}' +
      '.baigei-lang-btn.active{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border-color:transparent;}' +
      '.baigei-lang-btn.active:hover{background:linear-gradient(135deg,#7b8ef0,#8a5db8);}' +
      '.hero-gradient .baigei-lang-btn{color:rgba(255,255,255,0.6);}' +
      '.hero-gradient .baigei-lang-btn.active{color:#fff;}';
    document.head.appendChild(style);

    // Create buttons for each language
    SUPPORTED_LANGS.forEach(function (code) {
      var btn = document.createElement('button');
      btn.className = 'baigei-lang-btn';
      btn.textContent = langNames[code] || code;
      btn.setAttribute('data-lang', code);
      if (code === currentLang) {
        btn.classList.add('active');
      }
      btn.addEventListener('click', function () {
        // Update active state
        wrapper.querySelectorAll('.baigei-lang-btn').forEach(function (b) {
          b.classList.remove('active');
        });
        this.classList.add('active');
        setLanguage(code);
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: code } }));
      });
      wrapper.appendChild(btn);
    });

    // Listen for language changes to update button states
    document.addEventListener('languageChanged', function (e) {
      wrapper.querySelectorAll('.baigei-lang-btn').forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-lang') === e.detail.lang);
      });
    });

    container.appendChild(wrapper);
  }

  // --- Initialize ---
  var detectedLang = detectLanguage();
  applyTranslations(detectedLang);

  // --- Expose public API ---
  window.translations = typeof translations !== 'undefined' ? translations : {};
  window.setLanguage = setLanguage;
  window.getCurrentLang = getCurrentLang;
  window.createLanguageSelector = createLanguageSelector;

})();
