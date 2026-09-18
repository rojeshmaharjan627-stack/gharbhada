export function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bg = type === 'error' 
    ? 'bg-error text-on-error' 
    : type === 'info' 
    ? 'bg-secondary text-on-secondary' 
    : 'bg-primary text-on-primary';

  const icon = type === 'error' ? 'error' : type === 'info' ? 'info' : 'check_circle';

  toast.className = `pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-full shadow-lg ${bg} font-label-md text-label-md transition-all duration-300 transform translate-y-2 opacity-0`;
  toast.innerHTML = `
    <span class="material-symbols-outlined text-[20px]">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
