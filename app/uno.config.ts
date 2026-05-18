import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  theme: {
    colors: {
      bg:           '#0f0f1a',
      card:         '#1a1a2e',
      input:        '#16213e',
      accent:       '#e94560',
      'accent-lt':  '#ff6b6b',
      good:         '#4caf82',
      'good-dim':   '#2d6b51',
      bad:          '#e94560',
      'bad-dim':    '#7a2030',
      fg:           '#eaeaea',
      muted:        '#888888',
      line:         '#2a2a4a',
    },
  },
  shortcuts: [
    // ── 页面布局 ──────────────────────────────────────────────
    ['page',          'min-h-screen overflow-y-auto pb-[calc(var(--nav-h)+16px)]'],
    ['page-header',   'px-5 pt-[52px] pb-4'],
    ['page-title',    'text-[26px] font-bold text-fg'],
    ['page-subtitle', 'text-[13px] text-muted mt-0.5'],

    // ── 卡片 ─────────────────────────────────────────────────
    ['card', 'bg-card border border-line rounded-[14px] p-5 mx-4 mb-3'],

    // ── 按钮 ─────────────────────────────────────────────────
    ['btn',        'border-none rounded-lg px-4 py-2 text-[13px] font-semibold cursor-pointer transition-all duration-150 active:scale-95 inline-flex items-center gap-1 whitespace-nowrap select-none'],
    ['btn-good',   'btn bg-good-dim text-good   flex-1 justify-center'],
    ['btn-resist', 'btn bg-good-dim text-good   flex-1 justify-center'],
    ['btn-gavein', 'btn bg-[rgba(233,69,96,.15)] text-bad flex-1 justify-center'],
    ['btn-ghost',  'btn bg-transparent border border-line text-muted'],
    ['btn-delete', 'bg-transparent border-none text-muted text-base cursor-pointer px-1 leading-none opacity-60 shrink-0 active:opacity-100 active:text-bad'],
    ['btn-count',  'text-[11px] bg-white/15 rounded-[10px] px-1.5 py-px'],

    // ── 徽章 ─────────────────────────────────────────────────
    ['badge',          'text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ml-2.5'],
    ['badge-good',     'badge bg-good-dim text-good'],
    ['badge-bad',      'badge bg-bad-dim  text-bad'],
    ['badge-achieved', 'badge bg-[#2d4a6b] text-[#64b5f6]'],

    // ── 底部导航 ─────────────────────────────────────────────
    ['bottom-nav', 'fixed bottom-0 left-0 right-0 h-[var(--nav-h)] bg-card border-t border-line flex z-100'],
    ['nav-item',   'flex-1 flex flex-col items-center justify-center gap-[3px] bg-transparent border-none cursor-pointer text-muted text-[11px] transition-colors duration-150'],

    // ── FAB ──────────────────────────────────────────────────
    ['fab', 'fixed right-5 bottom-[calc(var(--nav-h)+20px)] w-[52px] h-[52px] rounded-full bg-accent text-white text-[26px] border-none cursor-pointer flex items-center justify-center z-10 shadow-[0_4px_16px_rgba(233,69,96,.5)] active:scale-[.92]'],

    // ── 模态框 ───────────────────────────────────────────────
    ['modal-overlay', 'fixed inset-0 bg-black/60 z-[200] flex items-end'],
    ['modal-sheet',   'bg-card rounded-t-[14px] w-full animate-[slideUp_.25s_ease]'],
    ['modal-header',  'flex items-center justify-between px-5 py-4 border-b border-line'],
    ['modal-title',   'text-base font-bold text-fg'],
    ['modal-save',    'bg-accent border-none text-white text-sm font-semibold cursor-pointer px-4 py-1.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed'],
    ['modal-cancel',  'bg-transparent border-none text-muted text-sm cursor-pointer px-2 py-1'],

    // ── 表单 ─────────────────────────────────────────────────
    ['form-input', 'w-full bg-input border border-line rounded-lg px-3.5 py-2.5 text-fg text-sm outline-none transition-[border-color] duration-200 font-[inherit] focus:border-accent placeholder:text-muted'],

    // ── 习惯卡片 ─────────────────────────────────────────────
    ['habit-card',      'bg-card border border-line rounded-[14px] px-4 py-3.5'],
    ['habit-name',      'text-[15px] font-semibold mb-0.5 text-fg'],
    ['habit-note-text', 'text-[12px] text-muted overflow-hidden whitespace-nowrap text-ellipsis'],
    ['progress-bar',    'h-1 bg-line rounded-[2px] overflow-hidden'],

    // ── 习惯类型选择器 ───────────────────────────────────────
    ['type-btn',        'flex flex-col items-center gap-2 bg-transparent border-none cursor-pointer text-muted text-[13px] font-semibold transition-colors duration-150'],
    ['type-btn-circle', 'w-[52px] h-[52px] rounded-full flex items-center justify-center text-2xl font-bold border-2 border-line transition-all duration-150'],

    // ── 其他 ─────────────────────────────────────────────────
    ['empty-state',    'text-center py-15 px-5 text-muted'],
    ['score-mini-card','bg-card border border-line rounded-[14px] p-4 text-center'],
  ],
})
