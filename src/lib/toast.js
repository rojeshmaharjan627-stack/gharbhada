import { getIcon } from './icons.js';

export function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  
  let iconName = 'check-circle';
  let iconColor = 'text-emerald-500';
  let borderColor = 'border-emerald-200';
  let badgeBg = 'bg-emerald-50';

  if (type === 'error') {
    iconName = 'alert-triangle';
    iconColor = 'text-red-500';
    borderColor = 'border-red-200';
    badgeBg = 'bg-red-50';
  } else if (type === 'info') {
    iconName = 'info';
    iconColor = 'text-blue-500';
    borderColor = 'border-blue-200';
    badgeBg = 'bg-blue-50';
  }

  toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-floating border ${borderColor} text-slate-800 text-xs font-semibold transition-all duration-300 transform translate-y-3 opacity-0`;
  toast.innerHTML = `
    <div class="w-7 h-7 rounded-xl ${badgeBg} ${iconColor} flex items-center justify-center shrink-0">
      ${getIcon(iconName, { class: 'w-4 h-4' })}
    </div>
    <span class="leading-snug">${message}</span>
  `;

  container.appendChild(toast);

  // Trigger smooth entrance animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-3', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('translate-y-3', 'opacity-0');
    setTimeout(() => toast.remove(), 320);
  }, 3800);
}
