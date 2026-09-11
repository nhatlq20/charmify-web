/* ─────────────────────────────────────────────────────────────
   FocusLoop — DevTools Console Test Snippet
   Paste into the browser console while on run.html to
   seed localStorage and immediately test the redirect flow.
   ───────────────────────────────────────────────────────────── */

// 1. SEED: inject a sample rule set (adjust times to match right now)
const now = new Date();
const currentHour = now.getHours();
const currentDay  = now.getDay();

const testRules = {
  version: "1.0",
  settings: {
    defaultFallbackUrl: "https://notion.so"
  },
  rules: [
    {
      id: "rule_study",
      label: "Study Block",
      // Set window to current hour so this rule ALWAYS matches during testing
      startHour: currentHour,
      endHour:   currentHour + 1,
      daysOfWeek: [currentDay],  // today
      actionType: "web",          // 'web' is safe in DevTools (no app prompt)
      targetUri:  "https://www.notion.so",
      fallbackUrl: "https://www.notion.so"
    },
    {
      id: "rule_workout",
      label: "Workout",
      startHour: 17,
      endHour:   19,
      daysOfWeek: [1, 2, 3, 4, 5],
      actionType: "app",
      targetUri:  "strava://",
      fallbackUrl: "https://www.strava.com"
    }
  ]
};

localStorage.setItem('focusloop_rules', JSON.stringify(testRules));
console.log('%c[FocusLoop] Rules seeded!', 'color:#6366f1;font-weight:bold');
console.log('Current context → hour:', currentHour, '| day:', currentDay);
console.log('Expected match: rule_study → https://www.notion.so');

// 2. REPLAY: re-run the engine without reloading
//    (The IIFE on the page already ran; manually trigger the run fn
//     by temporarily overriding window.location.replace so we can see
//     what URL it would navigate to.)
const _originalReplace = window.location.replace.bind(window.location);
let capturedUrl = null;
Object.defineProperty(window.location, 'replace', {
  configurable: true,
  value: function(url) {
    capturedUrl = url;
    console.log('%c[FocusLoop] → would redirect to: ' + url,
                'color:#22c55e;font-weight:bold');
    // Uncomment the next line to actually perform the redirect:
    // _originalReplace(url);
  }
});

// Re-invoke the engine logic inline (mirrors run.html's IIFE exactly)
(function () {
  var LS_KEY = 'focusloop_rules';
  var SETUP_URL = '/setup';
  var raw = localStorage.getItem(LS_KEY);
  if (!raw) { console.warn('[FocusLoop] No data in localStorage'); return; }
  var config = JSON.parse(raw);
  var rules = config.rules || [];
  var settings = config.settings || {};
  var defaultFallback = settings.defaultFallbackUrl || SETUP_URL;
  var now = new Date();
  var h = now.getHours();
  var d = now.getDay();
  var matched = null;
  for (var i = 0; i < rules.length; i++) {
    var r = rules[i];
    if (r.daysOfWeek.indexOf(d) !== -1 && h >= r.startHour && h < r.endHour) {
      matched = r; break;
    }
  }
  if (matched) {
    console.log('%c[FocusLoop] Matched rule: ' + JSON.stringify(matched, null, 2),
                'color:#f59e0b');
    window.location.replace(matched.targetUri || defaultFallback);
  } else {
    console.warn('[FocusLoop] No rule matched → defaultFallbackUrl:', defaultFallback);
    window.location.replace(defaultFallback);
  }
})();

// 3. CLEANUP: restore window.location.replace after 2s
setTimeout(function () {
  Object.defineProperty(window.location, 'replace', {
    configurable: true, value: _originalReplace
  });
  console.log('%c[FocusLoop] window.location.replace restored', 'color:#94a3b8');
}, 2000);

// ── Test helpers ──────────────────────────────────────────────
// Clear rules (triggers /setup path):
//   localStorage.removeItem('focusloop_rules'); location.reload();
//
// Test corrupted data (triggers error path):
//   localStorage.setItem('focusloop_rules', 'NOT_VALID_JSON'); location.reload();
//
// Test no-match (no rule for current time):
//   Set startHour/endHour to a past window, e.g. startHour:0, endHour:1
