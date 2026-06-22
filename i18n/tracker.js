/**
 * 白给工具 - Usage Tracker
 * Tracks tool usage via localStorage for social proof stats.
 * All data stays in the user's browser. No server-side collection.
 */
(function () {
  'use strict';

  // Get tool name from URL path
  var path = window.location.pathname;
  var toolSlug = path.replace(/\//g, '-').replace(/^-|-$/g, '') || 'home';

  // Only track actual tool usage (not just homepage views)
  var toolPaths = [
    'image-tools', 'pdf-tools', 'text-tools', 'tools-portal',
    'password-generator', 'id-card-validator', 'mortgage-calculator', 'ip-lookup', 'tax-calculator',
    'en/unit-converter', 'en/resume-builder', 'en/sales-tax-calculator', 'en/zip-code-lookup', 'en/us-holidays',
    'ja/fortune-diagnosis', 'ja/zip-code-lookup', 'ja/age-calculator', 'ja/char-counter', 'ja/resume-builder',
    'es/curp-generator', 'es/rut-validator', 'es/dni-validator', 'es/currency-converter', 'es/timezone-converter',
    'pt/cpf-cnpj-validator', 'pt/cep-lookup', 'pt/inss-calculator', 'pt/brazil-holidays', 'pt/currency-converter',
  ];

  var isTool = toolPaths.some(function(tp) {
    return path.indexOf(tp) !== -1;
  });

  if (isTool) {
    var storageKey = 'baigei_usage_' + toolSlug + '_' + new Date().toISOString().split('T')[0];
    // Only record once per day per tool per user
    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, '1');
    }

    // Baidu indexing: handled by official push.js on each page and the daily
    // quota-aware GitHub Actions workflow (.github/workflows/ping-search-engines.yml).
  }
})();
