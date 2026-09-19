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
    <header id="main-header" class="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300">
      <div class="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        <!-- Brand Logo & Trust Tag -->
        <div class="flex items-center gap-3 shrink-0">
          <a class="flex items-center gap-2.5 cursor-pointer group" id="nav-brand" href="#/">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F04D36] to-[#FB923C] text-white flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:shadow-glow transition-all duration-300">
              ${getIcon('home', { class: 'w-5 h-5 text-white' })}
            </div>
            <div class="flex flex-col leading-tight">
              <div class="flex items-center gap-1.5">
                <span class="text-base sm:text-lg text-slate-900 tracking-tight font-extrabold font-sans">${t('brandTitle')}</span>
                <span class="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-200">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  ०% दलाली
                </span>
              </div>
              <span class="text-[11px] text-slate-500 font-medium truncate max-w-[180px]">${t('brandSubtitle')}</span>
            </div>
          </a>
        </div>

        <!-- Center Navigation Links -->
        <nav class="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-xl border border-slate-200/60">
          <a class="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white hover:shadow-xs transition-all cursor-pointer" href="#/">
            ${t('browseRentals')}
          </a>
          ${user ? `
            <a class="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white hover:shadow-xs transition-all cursor-pointer" href="#/my-listings">
              ${t('myListings')}
            </a>
          ` : ''}
        </nav>

        <!-- Right Side Actions & Language Switcher -->
        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
          
          <!-- Language Toggle Switch (EN | ने) -->
          <div class="inline-flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
            <button id="lang-btn-en" type="button" class="btn-press px-2.5 py-1 rounded-md transition-all ${currentLang === 'en' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'}">
              EN
            </button>
            <button id="lang-btn-ne" type="button" class="btn-press px-2.5 py-1 rounded-md transition-all ${currentLang === 'ne' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'}">
              नेपाली
            </button>
          </div>

          <!-- Post a Rental Button (Vibrant Coral CTA) -->
          <a class="btn-modern inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#F04D36] to-[#E03A22] hover:from-[#E03A22] hover:to-[#C82B15] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-glow transition-all cursor-pointer min-touch-target" href="#/post">
            ${getIcon('plus', { class: 'w-4 h-4 text-white' })}
            <span class="hidden sm:inline">${t('postRental')}</span>
            <span class="sm:hidden font-bold">+ Post</span>
          </a>

          ${user ? `
            <!-- User Profile Dropdown -->
            <div class="relative">
              <button id="user-menu-btn" class="btn-press flex items-center gap-2 p-1 pr-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors shadow-xs min-touch-target cursor-pointer" type="button">
                <div class="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  ${userInitial}
                </div>
                <span class="hidden lg:inline text-xs text-slate-800 font-semibold max-w-[110px] truncate">
                  ${userName}
                </span>
                ${getIcon('chevron-down', { class: 'w-3.5 h-3.5 text-slate-400' })}
              </button>

              <div id="user-dropdown" class="hidden absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-floating p-1.5 z-50 flex flex-col gap-0.5 border border-slate-100 transition-all">
                <div class="px-3.5 py-2.5 border-b border-slate-100 mb-1">
                  <p class="text-xs text-slate-900 font-bold truncate">${userName}</p>
                  <p class="text-[11px] text-slate-400 truncate">${user.email}</p>
                </div>
                <a class="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-medium transition-colors" href="#/my-listings">
                  ${getIcon('building-2', { class: 'w-4 h-4 text-teal-600' })}
                  <span>${t('myListings')}</span>
                </a>
                <a class="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-medium transition-colors" href="#/post">
                  ${getIcon('plus-circle', { class: 'w-4 h-4 text-[#F04D36]' })}
                  <span>${t('postRental')}</span>
                </a>
                <button id="signout-btn" class="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 text-xs font-semibold transition-colors text-left cursor-pointer" type="button">
                  ${getIcon('log-out', { class: 'w-4 h-4 text-red-500' })}
                  <span>${t('signOut')}</span>
                </button>
              </div>
            </div>
          ` : `
            <!-- Sign In Button -->
            <a class="btn-press inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-colors cursor-pointer border border-slate-200 shadow-xs min-touch-target" href="#/login">
              ${getIcon('user', { class: 'w-3.5 h-3.5 text-slate-500' })}
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
