import { getCurrentUser, signOut } from '../lib/auth.js';
import { navigateTo } from '../lib/router.js';
import { showToast } from '../lib/toast.js';
import { getIcon } from '../lib/icons.js';
import { t, getLanguage, setLanguage } from '../lib/i18n.js';

export function renderNavbar() {
  const container = document.getElementById('navbar-container');
  if (!container) return;

  const user = getCurrentUser();
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'My Account';
  const userInitial = (userName[0] || 'U').toUpperCase();
  const currentLang = getLanguage();

  container.innerHTML = `
    <header id="main-header" class="fixed top-0 left-0 right-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#F0EBE3] transition-all duration-200">
      <div class="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        
        <!-- Brand Logo & Trust Tag -->
        <div class="flex items-center gap-3 shrink-0">
          <a class="flex items-center gap-2.5 cursor-pointer group" id="nav-brand" href="#/">
            <div class="w-9 h-9 rounded-[8px] bg-[#FDF0EC] text-[#D97757] flex items-center justify-center text-lg border border-[#D97757]/20 group-hover:scale-105 transition-transform shadow-xs">
              🏠
            </div>
            <div class="flex flex-col leading-tight">
              <div class="flex items-center gap-1.5">
                <span class="text-base sm:text-lg text-[#1F1B16] tracking-tight font-bold font-sans">${t('brandTitle')}</span>
                <span class="hidden sm:inline-block px-1.5 py-0.5 rounded-[4px] bg-[#EEF4F0] text-[#5B8266] text-[10px] font-bold border border-[#5B8266]/20">०% दलाली</span>
              </div>
              <span class="text-[11px] text-[#6B6258] font-medium truncate max-w-[180px]">${t('brandSubtitle')}</span>
            </div>
          </a>
        </div>

        <!-- Center Navigation Links -->
        <nav class="hidden md:flex items-center gap-1">
          <a class="px-3.5 py-2 rounded-[8px] text-xs font-semibold text-[#6B6258] hover:bg-white hover:text-[#1F1B16] transition-colors cursor-pointer" href="#/">
            ${t('browseRentals')}
          </a>
          ${user ? `
            <a class="px-3.5 py-2 rounded-[8px] text-xs font-semibold text-[#6B6258] hover:bg-white hover:text-[#1F1B16] transition-colors cursor-pointer" href="#/my-listings">
              ${t('myListings')}
            </a>
          ` : ''}
        </nav>

        <!-- Right Side Actions & Language Switcher -->
        <div class="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          <!-- Language Toggle Switch (EN | ने) -->
          <div class="inline-flex items-center bg-white p-1 rounded-[8px] border border-[#F0EBE3] shadow-card text-xs">
            <button id="lang-btn-en" type="button" class="btn-press px-2 py-1 rounded-[6px] font-bold transition-colors ${currentLang === 'en' ? 'bg-[#D97757] text-white' : 'text-[#6B6258] hover:text-[#1F1B16]'}">
              EN
            </button>
            <button id="lang-btn-ne" type="button" class="btn-press px-2 py-1 rounded-[6px] font-bold transition-colors ${currentLang === 'ne' ? 'bg-[#D97757] text-white' : 'text-[#6B6258] hover:text-[#1F1B16]'}">
              नेपाली
            </button>
          </div>

          <!-- Post a Rental Button (Always High-Contrast Primary CTA) -->
          <a class="btn-press inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#D97757] hover:bg-[#c66849] text-white text-xs font-bold shadow-card transition-all cursor-pointer min-touch-target" href="#/post">
            ${getIcon('plus', { class: 'w-4 h-4 text-white' })}
            <span class="hidden sm:inline">${t('postRental')}</span>
            <span class="sm:hidden font-bold">+ Post</span>
          </a>

          ${user ? `
            <!-- User Profile Dropdown -->
            <div class="relative">
              <button id="user-menu-btn" class="btn-press flex items-center gap-1.5 p-1 pr-2 rounded-[8px] bg-white border border-[#F0EBE3] hover:border-[#E2D9CD] transition-colors min-touch-target" type="button">
                <div class="w-8 h-8 rounded-[6px] bg-[#7C9885] text-white flex items-center justify-center font-bold text-xs">
                  ${userInitial}
                </div>
                <span class="hidden lg:inline text-xs text-[#1F1B16] font-semibold max-w-[110px] truncate">
                  ${userName}
                </span>
                ${getIcon('chevron-down', { class: 'w-3.5 h-3.5 text-[#6B6258]' })}
              </button>

              <div id="user-dropdown" class="hidden absolute right-0 mt-1.5 w-56 bg-white rounded-[12px] shadow-card p-1.5 z-50 flex flex-col gap-0.5 border border-[#F0EBE3]">
                <div class="px-3 py-2 border-b border-[#F0EBE3] mb-1">
                  <p class="text-xs text-[#1F1B16] font-bold truncate">${userName}</p>
                  <p class="text-[11px] text-[#6B6258] truncate">${user.email}</p>
                </div>
                <a class="flex items-center gap-2 px-3 py-2 rounded-[8px] hover:bg-[#FDFBF7] text-[#6B6258] hover:text-[#1F1B16] text-xs font-medium transition-colors" href="#/my-listings">
                  ${getIcon('building', { class: 'w-4 h-4 text-[#7C9885]' })}
                  <span>${t('myListings')}</span>
                </a>
                <a class="flex items-center gap-2 px-3 py-2 rounded-[8px] hover:bg-[#FDFBF7] text-[#6B6258] hover:text-[#1F1B16] text-xs font-medium transition-colors" href="#/post">
                  ${getIcon('plus-circle', { class: 'w-4 h-4 text-[#D97757]' })}
                  <span>${t('postRental')}</span>
                </a>
                <button id="signout-btn" class="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] hover:bg-[#FDF0EC] text-[#C1543D] text-xs font-semibold transition-colors text-left" type="button">
                  ${getIcon('log-out', { class: 'w-4 h-4 text-[#C1543D]' })}
                  <span>${t('signOut')}</span>
                </button>
              </div>
            </div>
          ` : `
            <!-- Sign In Button -->
            <a class="btn-press inline-flex items-center gap-1.5 px-3 py-2 rounded-[8px] bg-white hover:bg-[#FDFBF7] text-[#1F1B16] text-xs font-semibold transition-colors cursor-pointer border border-[#F0EBE3] shadow-card min-touch-target" href="#/login">
              ${getIcon('user', { class: 'w-3.5 h-3.5 text-[#6B6258]' })}
              <span class="hidden sm:inline">${t('signIn')}</span>
              <span class="sm:hidden">Login</span>
            </a>
          `}
        </div>
      </div>
    </header>
  `;

  // Language Switch Handlers
  document.getElementById('lang-btn-en')?.addEventListener('click', () => setLanguage('en'));
  document.getElementById('lang-btn-ne')?.addEventListener('click', () => setLanguage('ne'));

  // User menu dropdown toggle
  const userMenuBtn = document.getElementById('user-menu-btn');
  const userDropdown = document.getElementById('user-dropdown');
  if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      userDropdown.classList.add('hidden');
    });
  }

  // Sign out button
  const signoutBtn = document.getElementById('signout-btn');
  if (signoutBtn) {
    signoutBtn.addEventListener('click', async () => {
      try {
        await signOut();
        showToast('Signed out successfully');
        renderNavbar();
        navigateTo('#/');
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }
}

// Listen to language change to re-render navbar automatically
window.addEventListener('gharbhada:languageChange', () => {
  renderNavbar();
});
