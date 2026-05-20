const { Plugin } = require('obsidian');

module.exports = class FullscreenNotePlugin extends Plugin {

  async onload() {

    // ── زرار في الـ Ribbon (الشريط الجانبي) ──
    this.addRibbonIcon('expand', 'ملء الشاشة', () => {
      this.toggleFullscreen();
    });

    // ── Command + Hotkey ──
    this.addCommand({
      id: 'toggle-fullscreen-note',
      name: 'ملء الشاشة للنوت الحالية',
      callback: () => this.toggleFullscreen(),
      hotkeys: [{ modifiers: ['Mod', 'Shift'], key: 'f' }]
    });

    // ── زرار عائم فوق كل note ──
    this.registerEvent(
      this.app.workspace.on('layout-change', () => this.injectButton())
    );
    this.registerEvent(
      this.app.workspace.on('active-leaf-change', () => this.injectButton())
    );

    this.injectButton();
  }

  toggleFullscreen() {
    const leaf = this.app.workspace.activeLeaf;
    if (!leaf) return;

    const el = leaf.view.contentEl;

    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(e => console.error(e));
    } else {
      document.exitFullscreen();
    }
  }

  injectButton() {
    // شيل الزرار القديم لو موجود
    document.querySelectorAll('.fs-float-btn').forEach(b => b.remove());

    const leaf = this.app.workspace.activeLeaf;
    if (!leaf) return;

    const container = leaf.view.contentEl;
    if (!container) return;

    const btn = document.createElement('button');
    btn.className = 'fs-float-btn';
    btn.innerHTML = '⛶';
    btn.title = 'ملء الشاشة  (Ctrl+Shift+F)';

    Object.assign(btn.style, {
      position:   'absolute',
      top:        '12px',
      right:      '12px',
      zIndex:     '9999',
      background: 'rgba(30,18,8,.75)',
      color:      '#fdf8ee',
      border:     'none',
      borderRadius:'8px',
      padding:    '6px 10px',
      fontSize:   '1.1rem',
      cursor:     'pointer',
      backdropFilter: 'blur(4px)',
      transition: 'opacity .2s',
      opacity:    '0.5',
    });

    btn.addEventListener('mouseenter', () => btn.style.opacity = '1');
    btn.addEventListener('mouseleave', () => btn.style.opacity = '0.5');
    btn.addEventListener('click',      () => this.toggleFullscreen());

    // الـ container لازم يكون relative
    if (getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }

    container.appendChild(btn);
  }

  onunload() {
    document.querySelectorAll('.fs-float-btn').forEach(b => b.remove());
  }
};
