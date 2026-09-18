import { getCurrentUser, signOut } from '../lib/auth.js';
import { navigateTo } from '../lib/router.js';
import { showToast } from '../lib/toast.js';

export function renderNavbar() {
  const container = document.getElementById('navbar-container');
  if (!container) return;

  const user = getCurrentUser();
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'My Account';
  const userInitial = (userName[0] || 'U').toUpperCase();

  container.innerHTML = `
    <header class="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(38,70,83,0.06)]">
      <div class="h-20 max-w-7xl mx-auto px-margin-sm lg:px-margin flex items-center justify-between gap-space-md">
        
        <!-- Brand Logo -->
        <div class="flex items-center gap-space-md shrink-0">
          <a class="flex items-center gap-space-sm cursor-pointer" id="nav-brand" href="#/">
            <div class="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-black text-xl">
              🏠
            </div>
            <div class="flex flex-col leading-none">
              <span class="font-headline-sm text-headline-sm text-primary tracking-tight font-extrabold">GharBhada</span>
              <span class="font-label-sm text-label-sm text-on-surface-variant font-medium">घरभाडा नेपाल</span>
            </div>
          </a>

          <!-- Location Indicator -->
          <div class="relative group hidden sm:block">
            <button class="flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container-low hover:bg-surface-container-high rounded-full transition-colors text-on-surface" type="button">
              <span class="material-symbols-outlined text-[18px] text-primary">location_on</span>
              <span class="font-label-lg text-label-lg">Nepal / नेपाल</span>
            </button>
          </div>
        </div>

        <!-- Center Nav Links -->
        <nav class="hidden md:flex items-center gap-space-sm">
          <a class="px-space-md py-space-xs rounded-full font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer" href="#/">
            Browse Rentals (हेर्नुहोस्)
          </a>
          ${user ? `
            <a class="px-space-md py-space-xs rounded-full font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer" href="#/my-listings">
              My Listings (मेरो घरभाडा)
            </a>
          ` : ''}
        </nav>

        <!-- Right Side Actions -->
        <div class="flex items-center gap-space-sm shrink-0">
          
          <!-- Post a Rental Button -->
          <a class="inline-flex items-center gap-space-xs px-space-lg py-space-sm bg-primary-container hover:bg-primary text-on-primary rounded-full font-label-lg text-label-lg shadow-[0_2px_8px_-1px_rgba(231,111,81,0.25)] transition-all cursor-pointer" href="#/post">
            <span class="material-symbols-outlined text-[18px]">add_circle</span>
            <span class="hidden md:inline">Post a Rental (+ पोस्ट गर्नुहोस्)</span>
            <span class="md:hidden">+ Post</span>
          </a>

          ${user ? `
            <!-- User Menu -->
            <div class="relative">
              <button id="user-menu-btn" class="flex items-center gap-space-xs p-space-xs pr-space-sm rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors" type="button">
                <div class="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-sm">
                  ${userInitial}
                </div>
                <span class="hidden lg:inline font-label-md text-label-md text-on-surface font-semibold max-w-[120px] truncate">
                  ${userName}
                </span>
                <span class="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_drop_down</span>
              </button>

              <div id="user-dropdown" class="hidden absolute right-0 mt-space-xs w-60 bg-surface-container-lowest rounded-DEFAULT shadow-[0_12px_24px_-4px_rgba(38,70,83,0.15)] p-space-xs z-50 flex-col gap-1 border border-surface-container-high">
                <div class="px-space-sm py-space-xs border-b border-surface-container-high mb-1">
                  <p class="font-label-md text-label-md text-on-surface font-bold truncate">${userName}</p>
                  <p class="font-label-sm text-label-sm text-on-surface-variant truncate">${user.email}</p>
                </div>
                <a class="flex items-center gap-space-sm px-space-sm py-2 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" href="#/my-listings">
                  <span class="material-symbols-outlined text-[18px] text-secondary">real_estate_agent</span>
                  My Listings (मेरो लिस्टिङ)
                </a>
                <a class="flex items-center gap-space-sm px-space-sm py-2 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" href="#/post">
                  <span class="material-symbols-outlined text-[18px] text-primary">add_circle</span>
                  Post a Rental (+ पोस्ट)
                </a>
                <button id="signout-btn" class="w-full flex items-center gap-space-sm px-space-sm py-2 rounded-full hover:bg-error-container hover:text-error text-on-surface-variant font-label-md text-label-md transition-colors text-left" type="button">
                  <span class="material-symbols-outlined text-[18px]">logout</span>
                  Sign Out (बाहिरिनुहोस्)
                </button>
              </div>
            </div>
          ` : `
            <!-- Sign In CTA -->
            <a class="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors cursor-pointer" href="#/login">
              <span class="material-symbols-outlined text-[18px]">account_circle</span>
              <span>Sign In / Login</span>
            </a>
          `}
        </div>
      </div>
    </header>
  `;

  // Wire event handlers
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
