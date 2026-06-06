(function () {
    const STORAGE_KEY = 'eshop_a11y_prefs';
    const LEVEL_LABELS = ['A', 'A+', 'A++', 'A+++'];

    function loadPrefs() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
        catch { return {}; }
    }

    function savePrefs(prefs) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch { }
    }

    function applyPrefs(prefs) {
        const html = document.documentElement;
        html.classList.remove('a11y-text-1', 'a11y-text-2', 'a11y-text-3');
        const lvl = prefs.textLevel | 0;
        if (lvl >= 1 && lvl <= 3) html.classList.add('a11y-text-' + lvl);
        html.classList.toggle('a11y-high-contrast', !!prefs.highContrast);
        html.classList.toggle('a11y-show-labels', !!prefs.showLabels);
    }

    applyPrefs(loadPrefs());

    function update(patch) {
        const prefs = Object.assign({}, loadPrefs(), patch);
        savePrefs(prefs);
        applyPrefs(prefs);
        return prefs;
    }

    window.eshopAccessibility = {
        increaseText() {
            const p = loadPrefs();
            return update({ textLevel: Math.min(((p.textLevel | 0) + 1), 3) });
        },
        decreaseText() {
            const p = loadPrefs();
            return update({ textLevel: Math.max(((p.textLevel | 0) - 1), 0) });
        },
        toggleHighContrast() {
            return update({ highContrast: !loadPrefs().highContrast });
        },
        toggleLabels() {
            return update({ showLabels: !loadPrefs().showLabels });
        },
        getPrefs: loadPrefs
    };

    function syncPanel(panel) {
        const prefs = loadPrefs();
        const hc = panel.querySelector('[data-a11y-hc]');
        const lb = panel.querySelector('[data-a11y-labels]');
        const lvl = panel.querySelector('[data-a11y-level]');
        if (hc) hc.checked = !!prefs.highContrast;
        if (lb) lb.checked = !!prefs.showLabels;
        if (lvl) lvl.textContent = LEVEL_LABELS[prefs.textLevel | 0];
    }

    function bindPanel() {
        const toggleBtn = document.querySelector('[data-a11y-toggle]');
        const panel = document.querySelector('[data-a11y-panel]');
        if (!toggleBtn || !panel || toggleBtn.dataset.a11yBound === '1') return;
        toggleBtn.dataset.a11yBound = '1';

        syncPanel(panel);

        toggleBtn.addEventListener('click', () => {
            const open = panel.classList.toggle('a11y-panel-open');
            toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        const lvl = panel.querySelector('[data-a11y-level]');
        const inc = panel.querySelector('[data-a11y-inc]');
        const dec = panel.querySelector('[data-a11y-dec]');
        const hc = panel.querySelector('[data-a11y-hc]');
        const lb = panel.querySelector('[data-a11y-labels]');

        if (inc) inc.addEventListener('click', () => {
            const p = window.eshopAccessibility.increaseText();
            if (lvl) lvl.textContent = LEVEL_LABELS[p.textLevel | 0];
        });
        if (dec) dec.addEventListener('click', () => {
            const p = window.eshopAccessibility.decreaseText();
            if (lvl) lvl.textContent = LEVEL_LABELS[p.textLevel | 0];
        });
        if (hc) hc.addEventListener('change', () => window.eshopAccessibility.toggleHighContrast());
        if (lb) lb.addEventListener('change', () => window.eshopAccessibility.toggleLabels());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && panel.classList.contains('a11y-panel-open')) {
                panel.classList.remove('a11y-panel-open');
                toggleBtn.setAttribute('aria-expanded', 'false');
                toggleBtn.focus();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindPanel);
    } else {
        bindPanel();
    }
    document.addEventListener('enhancedload', bindPanel);
})();
