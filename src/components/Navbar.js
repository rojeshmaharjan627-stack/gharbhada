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

  // Get active category from URL hash
  const hash = window.location.hash || '#/';
  const urlParams = new URLSearchParams(hash.split('?')[1] || '');
  const activeCat = urlParams.get('cat') || 'all';

  container.innerHTML = `
    <header id="main-header" class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-nav transition-all">
      
      <!-- 1. Top Primary Brand & Action Bar -->
      <div class="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 border-b border-slate-100">
        
        <!-- Brand Logo & Trust Tag -->
        <div class="flex items-center gap-3 shrink-0">
          <a class="flex items-center gap-2.5 cursor-pointer group" id="nav-brand" href="#/">
            <div class="w-9 h-9 rounded-xl bg-[#1E40AF] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200">
              ${getIcon('home', { class: 'w-5 h-5 text-white' })}
            </div>
            <div class="flex flex-col leading-tight">
              <div class="flex items-center gap-2">
                <span class="text-lg sm:text-xl text-slate-900 tracking-tight font-extrabold font-sans">${t('brandTitle')}</span>
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  ०% दलाली • No Broker
                </span>
              </div>
              <span class="text-[11px] text-slate-500 font-medium truncate max-w-[200px] hidden sm:block">${t('brandSubtitle')}</span>
            </div>
          </a>
        </div>

        <!-- Right Side Actions: Language + Post CTA + Account -->
        <div class="flex items-center gap-2.5 sm:gap-3 shrink-0">
          
          <!-- Language Toggle Switch (EN | ने) -->
          <div class="inline-flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-semibold">
            <button id="lang-btn-en" type="button" class="btn-press px-2.5 py-1 rounded-lg transition-all cursor-pointer ${currentLang === 'en' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'}">
              EN
            </button>
            <button id="lang-btn-ne" type="button" class="btn-press px-2.5 py-1 rounded-lg transition-all cursor-pointer ${currentLang === 'ne' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'}">
              नेपाली
            </button>
          </div>

          <!-- Post a Listing Button (Always High-Contrast Filled Brand Button) -->
          <a class="btn-press inline-flex items-center gap-1.5 px-4 py-2 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer min-touch-target" href="#/post">
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
                  ${getIcon('building-2', { class: 'w-4 h-4 text-[#1E40AF]' })}
                  <span>${t('myListings')}</span>
                </a>
                <a class="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-medium transition-colors" href="#/post">
                  ${getIcon('plus-circle', { class: 'w-4 h-4 text-[#1E40AF]' })}
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

      <!-- 2. Housing.com-Style Persistent Underlined Category Tab Bar -->
      <div class="bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-6 sm:gap-10 h-11">
          <a href="#/" class="nav-tab text-xs sm:text-sm py-2 ${activeCat === 'all' ? 'active' : ''}" data-cat="all">
            ${currentLang === 'ne' ? 'सबै भाडा (All)' : 'All Rentals'}
          </a>
          <a href="#/?cat=room" class="nav-tab text-xs sm:text-sm py-2 ${activeCat === 'room' ? 'active' : ''}" data-cat="room">
            ${currentLang === 'ne' ? 'कोठा (Rooms)' : 'Rooms'}
          </a>
          <a href="#/?cat=flat" class="nav-tab text-xs sm:text-sm py-2 ${activeCat === 'flat' ? 'active' : ''}" data-cat="flat">
            ${currentLang === 'ne' ? 'फ्ल्याट (Flats)' : 'Flats & Apartments'}
          </a>
          <a href="#/?cat=house" class="nav-tab text-xs sm:text-sm py-2 ${activeCat === 'house' ? 'active' : ''}" data-cat="house">
            ${currentLang === 'ne' ? 'घर (Houses)' : 'Houses'}
          </a>
          <a href="#/?cat=commercial" class="nav-tab text-xs sm:text-sm py-2 ${activeCat === 'commercial' ? 'active' : ''}" data-cat="commercial">
            ${currentLang === 'ne' ? 'सटर/अफिस (Commercial)' : 'Commercial & Shutters'}
          </a>
          <a href="#/?cat=land" class="nav-tab text-xs sm:text-sm py-2 ${activeCat === 'land' ? 'active' : ''}" data-cat="land">
            ${currentLang === 'ne' ? 'जग्गा (Land)' : 'Land / Plots'}
          </a>
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

// Listen to route and language changes to update active tab underline automatically
window.addEventListener('hashchange', renderNavbar);
window.addEventListener('gharbhada:languageChange', renderNavbar);
