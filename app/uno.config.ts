import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  theme: {
    colors: {
      bg:              '#F4F5F0',
      card:            '#FFFFFF',
      input:           '#F0EFE8',
      accent:          '#C9FF57',
      'accent-lt':     '#DFFE8A',
      'accent-fg':     '#111111',
      good:            '#16A34A',
      'good-dim':      '#DCFCE7',
      bad:             '#DC2626',
      'bad-dim':       '#FEE2E2',
      achieved:        '#2563EB',
      'achieved-dim':  '#DBEAFE',
      fg:              '#111111',
      muted:           '#9CA3AF',
      line:            '#EBEBE6',
    },
  },
  shortcuts: [
    // ── 页面布局 ──────────────────────────────────────────────
    ['page',          'min-h-[100dvh] overflow-y-auto pb-[calc(var(--nav-h)+16px)]'],
    ['page-header',   'px-5 pt-[52px] pb-4'],
    ['page-title',    'text-[28px] font-bold text-fg tracking-tight'],
    ['page-subtitle', 'text-[13px] text-muted mt-0.5'],

    // ── 卡片 ─────────────────────────────────────────────────
    ['card', 'bg-card border border-line rounded-[16px] p-5 mx-4 mb-3 shadow-[0_2px_12px_rgba(0,0,0,.06)]'],

    // ── 按钮 ─────────────────────────────────────────────────
    ['btn',        'border-none rounded-[10px] px-4 py-2 text-[13px] font-semibold cursor-pointer transition-all duration-150 active:scale-95 hover:brightness-95 inline-flex items-center gap-1 whitespace-nowrap select-none'],
    ['btn-good',   'btn bg-accent text-accent-fg flex-1 justify-center'],
    ['btn-resist', 'btn bg-accent text-accent-fg flex-1 justify-center'],
    ['btn-gavein', 'btn bg-bad-dim  text-bad     flex-1 justify-center'],
    ['btn-ghost',  'btn bg-transparent border border-line text-muted'],
    ['btn-delete', 'bg-transparent border-none text-muted text-base cursor-pointer px-1 leading-none opacity-50 shrink-0 active:opacity-100 active:text-bad transition-all duration-150'],
    ['btn-count',  'text-[11px] bg-black/10 rounded-[10px] px-1.5 py-px'],

    // ── 徽章 ─────────────────────────────────────────────────
    ['badge',          'text-[11px] font-semibold px-2 py-0.5 rounded-[5px] shrink-0 ml-2.5'],
    ['badge-good',     'badge bg-good-dim text-good'],
    ['badge-bad',      'badge bg-bad-dim  text-bad'],
    ['badge-achieved', 'badge bg-achieved-dim text-achieved'],

    // ── 底部导航 ─────────────────────────────────────────────
    ['bottom-nav', 'fixed bottom-0 left-0 right-0 h-[var(--nav-h)] bg-card/95 backdrop-blur-sm border-t border-line flex z-100'],
    ['nav-item',   'flex-1 relative flex flex-col items-center justify-center gap-[3px] bg-transparent border-none cursor-pointer text-muted text-[11px] transition-all duration-150'],

    // ── FAB ──────────────────────────────────────────────────
    ['fab', 'fixed right-5 bottom-[calc(var(--nav-h)+20px)] w-[52px] h-[52px] rounded-full bg-accent text-accent-fg text-[26px] border-none cursor-pointer flex items-center justify-center z-10 shadow-[0_4px_20px_rgba(120,200,0,.35)] active:scale-[.92] hover:shadow-[0_6px_28px_rgba(120,200,0,.5)] transition-all duration-200 animate-[popIn_.35s_cubic-bezier(.34,1.56,.64,1)]'],

    // ── 模态框 ───────────────────────────────────────────────
    ['modal-overlay', 'fixed inset-0 bg-black/40 z-[200] flex items-end'],
    ['modal-sheet',   'bg-card rounded-t-[20px] w-full animate-[slideUp_.25s_ease]'],
    ['modal-header',  'flex items-center justify-between px-5 py-4 border-b border-line'],
    ['modal-title',   'text-base font-bold text-fg'],
    ['modal-save',    'bg-accent border-none text-accent-fg text-sm font-semibold cursor-pointer px-4 py-1.5 rounded-[10px] disabled:opacity-40 disabled:cursor-not-allowed transition-opacity'],
    ['modal-cancel',  'bg-transparent border-none text-muted text-sm cursor-pointer px-2 py-1'],

    // ── 表单 ─────────────────────────────────────────────────
    ['form-input', 'w-full bg-input border border-line rounded-[10px] px-3.5 py-2.5 text-fg text-sm outline-none transition-[border-color] duration-200 font-[inherit] focus:border-accent placeholder:text-muted'],

    // ── 习惯卡片 ─────────────────────────────────────────────
    ['habit-card',      'bg-card border border-line rounded-[16px] px-4 py-3.5 shadow-[0_1px_6px_rgba(0,0,0,.06)]'],
    ['habit-name',      'text-[15px] font-semibold mb-0.5 text-fg'],
    ['habit-note-text', 'text-[12px] text-muted overflow-hidden whitespace-nowrap text-ellipsis'],
    ['progress-bar',    'h-1.5 bg-line rounded-full overflow-hidden'],

    // ── 习惯类型选择器 ───────────────────────────────────────
    ['type-btn',        'flex flex-col items-center gap-2 bg-transparent border-none cursor-pointer text-muted text-[13px] font-semibold transition-colors duration-150'],
    ['type-btn-circle', 'w-[52px] h-[52px] rounded-full flex items-center justify-center text-2xl font-bold border-2 border-line transition-all duration-150'],

    // ── 分类标签 ─────────────────────────────────────────────
    ['section-label', 'text-[11px] text-muted font-semibold tracking-[.1em] uppercase pt-1 pb-1'],

    // ── 其他 ─────────────────────────────────────────────────
    ['empty-state',     'text-center py-16 px-5 text-muted'],
    ['score-mini-card', 'bg-card border border-line rounded-[16px] p-4 text-center shadow-[0_1px_6px_rgba(0,0,0,.06)]'],
  ],
})
