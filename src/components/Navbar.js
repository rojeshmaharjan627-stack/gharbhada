import { getCurrentUser, signOut } from '../lib/auth.js';
import { navigateTo } from '../lib/router.js';
import { showToast } from '../lib/toast.js';
import { getIcon } from '../lib/icons.js';

export function renderNavbar() {
  const container = document.getElementById('navbar-container');
  if (!container) return;

  const user = getCurrentUser();
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'My Account';
  const userInitial = (userName[0] || 'U').toUpperCase();

  container.innerHTML = `
    <header id="main-header" class="fixed top-0 left-0 right-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#F0EBE3] transition-all duration-200">
      <div class="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        <!-- Brand Logo -->
        <div class="flex items-center gap-3 shrink-0">
          <a class="flex items-center gap-2.5 cursor-pointer group" id="nav-brand" href="#/">
            <div class="w-8 h-8 rounded-[8px] bg-primary/10 flex items-center justify-center text-primary text-base group-hover:scale-105 transition-transform">
              🏠
            </div>
            <div class="flex flex-col leading-tight">
              <span class="text-base text-text-primary tracking-tight font-bold">GharBhada</span>
              <span class="text-[11px] text-text-secondary font-medium">घरभाडा नेपाल</span>
            </div>
          </a>

          <!-- Location Indicator -->
          <div class="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-full text-text-secondary text-xs font-medium border border-[#F0EBE3]">
            ${getIcon('map-pin', { class: 'w-3.5 h-3.5 text-primary' })}
            <span>Nepal / नेपाल</span>
          </div>
        </div>

        <!-- Center Navigation Links -->
        <nav class="hidden md:flex items-center gap-1">
          <a class="px-3 py-1.5 rounded-[8px] text-xs font-medium text-text-secondary hover:bg-white hover:text-text-primary transition-colors cursor-pointer" href="#/">
            Browse Rentals (भाडामा)
          </a>
          ${user ? `
            <a class="px-3 py-1.5 rounded-[8px] text-xs font-medium text-text-secondary hover:bg-white hover:text-text-primary transition-colors cursor-pointer" href="#/my-listings">
              My Listings (मेरो लिस्टिङ)
            </a>
          ` : ''}
        </nav>

        <!-- Right Side Actions -->
        <div class="flex items-center gap-2 shrink-0">
          
          <!-- Post a Rental Button -->
          <a class="btn-press inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer" href="#/post">
            ${getIcon('plus', { class: 'w-3.5 h-3.5' })}
            <span class="hidden sm:inline">Post a Rental (+ पोस्ट)</span>
            <span class="sm:hidden">+ Post</span>
          </a>

          ${user ? `
            <!-- User Profile Dropdown -->
            <div class="relative">
              <button id="user-menu-btn" class="btn-press flex items-center gap-1.5 p-1 pr-2 rounded-[8px] bg-white border border-[#F0EBE3] hover:border-[#E2D9CD] transition-colors" type="button">
                <div class="w-7 h-7 rounded-[6px] bg-sage text-white flex items-center justify-center font-bold text-xs">
                  ${userInitial}
                </div>
                <span class="hidden lg:inline text-xs text-text-primary font-medium max-w-[110px] truncate">
                  ${userName}
                </span>
                ${getIcon('chevron-down', { class: 'w-3.5 h-3.5 text-text-muted' })}
              </button>

              <div id="user-dropdown" class="hidden absolute right-0 mt-1.5 w-56 bg-white rounded-[12px] shadow-card p-1.5 z-50 flex flex-col gap-0.5 border border-[#F0EBE3]">
                <div class="px-3 py-2 border-b border-[#F0EBE3] mb-1">
                  <p class="text-xs text-text-primary font-bold truncate">${userName}</p>
                  <p class="text-[11px] text-text-secondary truncate">${user.email}</p>
                </div>
                <a class="flex items-center gap-2 px-3 py-1.5 rounded-[8px] hover:bg-bg text-text-secondary hover:text-text-primary text-xs transition-colors" href="#/my-listings">
                  ${getIcon('building', { class: 'w-4 h-4 text-sage' })}
                  <span>My Listings (मेरो लिस्टिङ)</span>
                </a>
                <a class="flex items-center gap-2 px-3 py-1.5 rounded-[8px] hover:bg-bg text-text-secondary hover:text-text-primary text-xs transition-colors" href="#/post">
                  ${getIcon('plus-circle', { class: 'w-4 h-4 text-primary' })}
                  <span>Post a Rental (+ पोस्ट)</span>
                </a>
                <button id="signout-btn" class="w-full flex items-center gap-2 px-3 py-1.5 rounded-[8px] hover:bg-error-light text-error text-xs transition-colors text-left" type="button">
                  ${getIcon('log-out', { class: 'w-4 h-4 text-error' })}
                  <span>Sign Out (बाहिरिनुहोस्)</span>
                </button>
              </div>
            </div>
          ` : `
            <!-- Sign In Button -->
            <a class="btn-press inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-white hover:bg-bg text-text-primary text-xs font-medium transition-colors cursor-pointer border border-[#F0EBE3]" href="#/login">
              ${getIcon('user', { class: 'w-3.5 h-3.5 text-text-secondary' })}
              <span>Sign In / Login</span>
            </a>
          `}
        </div>
      </div>
    </header>
  `;

  // Dynamic shadow on scroll
  const header = document.getElementById('main-header');
  function handleScroll() {
    if (!header) return;
    if (window.scrollY > 8) {
      header.classList.add('shadow-card', 'bg-[#FDFBF7]/95');
      header.classList.remove('bg-[#FDFBF7]/90');
    } else {
      header.classList.remove('shadow-card', 'bg-[#FDFBF7]/95');
      header.classList.add('bg-[#FDFBF7]/90');
    }
  }
  window.removeEventListener('scroll', handleScroll);
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

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
