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
    <header class="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-b border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div class="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        <!-- Brand Logo -->
        <div class="flex items-center gap-4 shrink-0">
          <a class="flex items-center gap-2 cursor-pointer group" id="nav-brand" href="#/">
            <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-base group-hover:scale-105 transition-transform">
              🏠
            </div>
            <div class="flex flex-col leading-none">
              <span class="text-base text-primary tracking-tight font-bold">GharBhada</span>
              <span class="text-[10px] text-on-surface-variant font-medium">घरभाडा नेपाल</span>
            </div>
          </a>

          <!-- Location Badge -->
          <div class="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-surface-container-low rounded-full text-on-surface-variant text-xs font-medium">
            <span class="material-symbols-outlined text-[15px] text-primary">location_on</span>
            <span>Nepal / नेपाल</span>
          </div>
        </div>

        <!-- Center Nav Links -->
        <nav class="hidden md:flex items-center gap-1">
          <a class="px-3.5 py-1.5 rounded-full text-xs font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer" href="#/">
            Browse Rentals (भाडामा)
          </a>
          ${user ? `
            <a class="px-3.5 py-1.5 rounded-full text-xs font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer" href="#/my-listings">
              My Listings (मेरो लिस्टिङ)
            </a>
          ` : ''}
        </nav>

        <!-- Right Side Actions -->
        <div class="flex items-center gap-2.5 shrink-0">
          
          <!-- Post a Rental Button -->
          <a class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary hover:bg-primary/90 text-on-primary rounded-full text-xs font-semibold shadow-sm transition-all cursor-pointer hover:shadow" href="#/post">
            <span class="material-symbols-outlined text-[16px]">add_circle</span>
            <span class="hidden sm:inline">Post a Rental (+ पोस्ट)</span>
            <span class="sm:hidden">+ Post</span>
          </a>

          ${user ? `
            <!-- User Menu -->
            <div class="relative">
              <button id="user-menu-btn" class="flex items-center gap-1.5 p-1 pr-2 rounded-full bg-surface-container-low hover:bg-surface-container transition-colors" type="button">
                <div class="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-xs">
                  ${userInitial}
                </div>
                <span class="hidden lg:inline text-xs text-on-surface font-semibold max-w-[110px] truncate">
                  ${userName}
                </span>
                <span class="material-symbols-outlined text-[14px] text-on-surface-variant">arrow_drop_down</span>
              </button>

              <div id="user-dropdown" class="hidden absolute right-0 mt-1.5 w-56 bg-surface-container-lowest rounded-xl shadow-[0_8px_20px_-4px_rgba(0,0,0,0.08)] p-1.5 z-50 flex-col gap-0.5 border border-slate-200/80">
                <div class="px-3 py-2 border-b border-slate-100 mb-1">
                  <p class="text-xs text-on-surface font-bold truncate">${userName}</p>
                  <p class="text-[11px] text-on-surface-variant truncate">${user.email}</p>
                </div>
                <a class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface text-xs transition-colors" href="#/my-listings">
                  <span class="material-symbols-outlined text-[16px] text-secondary">real_estate_agent</span>
                  My Listings (मेरो लिस्टिङ)
                </a>
                <a class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface text-xs transition-colors" href="#/post">
                  <span class="material-symbols-outlined text-[16px] text-primary">add_circle</span>
                  Post a Rental (+ पोस्ट)
                </a>
                <button id="signout-btn" class="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-error-container/40 hover:text-error text-on-surface-variant text-xs transition-colors text-left" type="button">
                  <span class="material-symbols-outlined text-[16px]">logout</span>
                  Sign Out (बाहिरिनुहोस्)
                </button>
              </div>
            </div>
          ` : `
            <!-- Sign In CTA -->
            <a class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-medium transition-colors cursor-pointer border border-slate-200/60" href="#/login">
              <span class="material-symbols-outlined text-[16px]">account_circle</span>
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
