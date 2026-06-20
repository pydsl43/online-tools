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

  // --- Language tools catalog ---
  var toolsCatalog = {
    zh: [
      { icon: '🔐', name: '随机密码生成器', desc: '在线生成高强度随机密码。支持自定义长度、字符类型、批量生成。纯浏览器端生成，安全可靠。', url: '/password-generator/' },
      { icon: '🆔', name: '身份证查询验证', desc: '18位身份证号码校验、提取出生日期、性别、年龄、发证地信息。ISO 7064 校验算法，精准可靠。', url: '/id-card-validator/' },
      { icon: '🏠', name: '房贷计算器', desc: '商业贷款、公积金贷款、组合贷款计算。等额本息和等额本金双模式对比，含详细还款计划表。', url: '/mortgage-calculator/' },
      { icon: '📍', name: 'IP地址查询', desc: '自动检测本机 IP 地址，查询 IP 归属地和运营商信息。纯浏览器端处理，保护隐私安全。', url: '/ip-lookup/' },
      { icon: '💰', name: '个税计算器', desc: '基于 2025-2026 最新累进税率表，支持社保公积金扣除、专项附加扣除、年终奖计税对比。', url: '/tax-calculator/' },
      { icon: '🖼️', name: '在线图片压缩', desc: '支持 JPG、PNG、WebP 格式压缩。智能保持画质，可批量处理多张图片，压缩率最高达 80%。所有处理在浏览器本地完成，无需上传。', url: '/image-tools/' },
      { icon: '📄', name: '在线PDF工具', desc: 'PDF 合并、拆分、压缩、格式转换一站完成。支持 PDF 与 Word、Excel、图片互转，无需安装任何软件。', url: '/pdf-tools/' },
      { icon: '✍️', name: '在线文字处理工具', desc: '文字去重、排序、替换、统计字数、格式转换。支持正则表达式，批量处理文本文件，编程者和写作者的效率利器。', url: '/text-tools/' },
    ],
    en: [
      { icon: '🖼️', name: 'Image Compression', desc: 'Compress JPG, PNG, WebP images with smart quality preservation. Batch process multiple images, up to 80% compression. All local in your browser.', url: '/image-tools/' },
      { icon: '📄', name: 'PDF Tools', desc: 'Merge, split, compress, and convert PDFs right in your browser. No software installation needed. Privacy-first, no file upload.', url: '/pdf-tools/' },
      { icon: '✍️', name: 'Text Processing', desc: 'Deduplicate, sort, replace, count words, convert formats. Supports regex and batch text processing.', url: '/text-tools/' },
      { icon: '🔐', name: 'Password Generator', desc: 'Generate strong random passwords with custom length, character types, and batch mode. 100% client-side, secure.', url: '/password-generator/' },
      { icon: '📏', name: 'Unit Converter', desc: 'Convert between imperial and metric units: length, weight, temperature, volume. Real-time conversion as you type.', url: '/en/unit-converter/' },
      { icon: '📄', name: 'Resume Builder', desc: 'Create professional resumes and cover letters online. Free templates, real-time preview, and PDF export with one click.', url: '/en/resume-builder/' },
      { icon: '💰', name: 'Sales Tax Calculator', desc: 'Calculate US sales tax for all 50 states. Enter amount, select state, instantly see base price, tax amount, and total.', url: '/en/sales-tax-calculator/' },
      { icon: '🗺️', name: 'ZIP Code Lookup', desc: 'Lookup US ZIP codes instantly. Find city, state, county, area code, and timezone for any ZIP code.', url: '/en/zip-code-lookup/' },
      { icon: '📅', name: 'US Holidays', desc: 'View all US federal holidays for any year. Countdown to next holiday, with today highlighting.', url: '/en/us-holidays/' },
    ],
    ja: [
      { icon: '🔮', name: '名前診断', desc: 'あなたの名前で運勢を占う！大吉から末吉まで、簡単な名前診断を楽しめます。SNSで共有も可能。', url: '/ja/fortune-diagnosis/' },
      { icon: '📮', name: '郵便番号検索', desc: '日本の郵便番号を検索。全国主要都市の郵便番号に対応。都道府県、市区町村、町域を表示。', url: '/ja/zip-code-lookup/' },
      { icon: '🎂', name: '年齢計算', desc: '生年月日から正確な年齢を計算。和暦（令和/平成/昭和）対応、星座や次の誕生日までの日数も表示。', url: '/ja/age-calculator/' },
      { icon: '✍️', name: '文字数カウント', desc: 'リアルタイムで文字数をカウント。漢字、ひらがな、カタカナを個別に集計。コピーもワンクリック。', url: '/ja/char-counter/' },
      { icon: '📋', name: '履歴書作成', desc: 'オンラインで履歴書を作成。学歴、職歴、資格を入力してプレビュー。印刷にも対応。', url: '/ja/resume-builder/' },
    ],
    es: [
      { icon: '🆔', name: 'Generador CURP/RFC', desc: 'Genera y valida CURP y RFC para México. Algoritmo oficial de la Secretaría de Hacienda.', url: '/es/curp-generator/' },
      { icon: '🆔', name: 'Validador RUT', desc: 'Valida RUT chileno con algoritmo módulo 11. Genera RUTs aleatorios válidos con formato automático.', url: '/es/rut-validator/' },
      { icon: '🆔', name: 'Validador DNI/NIE', desc: 'Valida DNI y NIE españoles. Cálculo de letra de control para documentos de identidad nacionales y de extranjeros.', url: '/es/dni-validator/' },
      { icon: '💱', name: 'Conversor de Monedas', desc: 'Convierte entre monedas latinoamericanas: MXN, ARS, CLP, PEN, COP, USD. Tasas indicativas actualizadas.', url: '/es/currency-converter/' },
      { icon: '🕐', name: 'Zonas Horarias', desc: 'Convierte horas entre zonas horarias de Latinoamérica. Relojes en vivo para CDMX, Buenos Aires, Santiago, Lima, Bogotá.', url: '/es/timezone-converter/' },
    ],
    pt: [
      { icon: '🆔', name: 'Validador CPF/CNPJ', desc: 'Valide e gere CPF e CNPJ com algoritmo oficial da Receita Federal. Formatação automática.', url: '/pt/cpf-cnpj-validator/' },
      { icon: '📮', name: 'Consulta CEP', desc: 'Busque CEPs brasileiros. Encontre logradouro, bairro, cidade e estado para qualquer CEP.', url: '/pt/cep-lookup/' },
      { icon: '💰', name: 'Calculadora INSS', desc: 'Calcule o desconto do INSS sobre o salário. Tabela progressiva 2025-2026 com alíquotas de 7,5% a 14%.', url: '/pt/inss-calculator/' },
      { icon: '📅', name: 'Feriados Brasil', desc: 'Veja todos os feriados nacionais do Brasil. Contagem regressiva para o próximo feriado.', url: '/pt/brazil-holidays/' },
      { icon: '💱', name: 'Conversor de Moedas', desc: 'Converta BRL para USD, EUR, GBP, ARS. Taxas indicativas com cartões de referência.', url: '/pt/currency-converter/' },
    ],
  };

  /**
   * Render tool cards for the current language.
   */
  function renderToolCards() {
    var grid = document.getElementById('tool-cards-grid');
    if (!grid) return;

    var lang = currentLang;
    var tools = toolsCatalog[lang] || toolsCatalog[DEFAULT_LANG];
    var ctaTexts = { zh: '立即使用 →', en: 'Use Now →', ja: '今すぐ使う →', es: 'Usar Ahora →', pt: 'Usar Agora →' };
    var ctaText = ctaTexts[lang] || ctaTexts.en;

    // Use responsive grid: 2 cols on md, 3 on lg
    grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8';

    grid.innerHTML = '';
    tools.forEach(function (tool) {
      var card = document.createElement('a');
      card.href = tool.url + (tool.url.indexOf('?') === -1 ? '?lang=' + lang : '&lang=' + lang);
      card.className = 'glass-card rounded-3xl p-8 cursor-pointer block group';
      card.innerHTML =
        '<div class="card-icon text-5xl mb-6 inline-block">' + tool.icon + '</div>' +
        '<div class="flex items-center gap-2 mb-3">' +
          '<h3 class="text-2xl font-bold text-gray-800">' + tool.name + '</h3>' +
          '<span class="badge badge-success">✅ Online Ready</span>' +
        '</div>' +
        '<p class="text-gray-500 leading-relaxed mb-6">' + tool.desc + '</p>' +
        '<div class="flex items-center text-indigo-500 font-semibold group-hover:gap-2 transition-all">' +
          ctaText +
        '</div>';
      grid.appendChild(card);
    });
  }

  // --- Initialize ---
  var detectedLang = detectLanguage();
  applyTranslations(detectedLang);
  renderToolCards();

  // Append ?lang=xx to all internal links (except current language default)
  document.addEventListener('DOMContentLoaded', function () {
    var lang = getCurrentLang();
    document.querySelectorAll('a[href^="/"], a[href^="https://wdnmd.vip"]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href.indexOf('lang=') === -1 && href.indexOf('#') !== 0) {
        a.setAttribute('href', href + (href.indexOf('?') === -1 ? '?lang=' + lang : '&lang=' + lang));
      }
    });
  });

  // Listen for language changes to re-render tools
  document.addEventListener('languageChanged', function () {
    renderToolCards();
  });

  // --- Expose public API ---
  window.translations = typeof translations !== 'undefined' ? translations : {};
  window.setLanguage = setLanguage;
  window.getCurrentLang = getCurrentLang;
  window.createLanguageSelector = createLanguageSelector;

})();
