import { signIn, signUp, getCurrentUser } from '../lib/auth.js';
import { renderNavbar } from '../components/Navbar.js';
import { showToast } from '../lib/toast.js';
import { navigateTo } from '../lib/router.js';
import { getIcon } from '../lib/icons.js';

export const LoginView = {
  render(container, { queryParams }) {
    if (getCurrentUser()) {
      navigateTo('#/my-listings');
      return;
    }

    const redirectTarget = queryParams.get('redirect') ? decodeURIComponent(queryParams.get('redirect')) : '#/my-listings';
    let activeTab = 'signin'; // 'signin' or 'signup'

    function updateView() {
      container.innerHTML = `
        <div class="max-w-sm mx-auto my-10 px-4 animate-fade-in">
          <!-- Card Shell -->
          <div class="bg-white rounded-xl shadow-xs p-6 border border-slate-200/80">
            
            <!-- Brand Badge -->
            <div class="text-center mb-5">
              <div class="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center text-xl mx-auto mb-2 border border-primary/20">
                🏠
              </div>
              <h1 class="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                ${activeTab === 'signin' ? 'Welcome Back (पुन: स्वागतम्)' : 'Join GharBhada Nepal (दर्ता गर्नुहोस्)'}
              </h1>
              <p class="text-xs text-slate-500 mt-1">
                ${activeTab === 'signin' ? 'Sign in to manage your rentals or post spaces' : 'Create an account to list properties across Nepal for free'}
              </p>
            </div>

            <!-- Tab Switcher -->
            <div class="flex items-center p-1 bg-slate-100 rounded-lg mb-5 border border-slate-200/60">
              <button id="tab-signin-btn" class="btn-interactive flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'signin' ? 'bg-white text-primary shadow-xs' : 'text-slate-500 hover:text-slate-900'}">
                Sign In (लगइन)
              </button>
              <button id="tab-signup-btn" class="btn-interactive flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'signup' ? 'bg-white text-primary shadow-xs' : 'text-slate-500 hover:text-slate-900'}">
                Sign Up (नयाँ खाता)
              </button>
            </div>

            <!-- Error Banner -->
            <div id="auth-error-banner" class="hidden p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs mb-4"></div>

            <!-- Auth Form -->
            <form id="auth-form" class="flex flex-col gap-3.5">
              ${activeTab === 'signup' ? `
                <div class="flex flex-col gap-1">
                  <label class="text-xs font-semibold text-slate-700" for="name-input">
                    Full Name (पुरा नाम) <span class="text-primary">*</span>
                  </label>
                  <div class="relative flex items-center">
                    <span class="absolute left-3 text-slate-400">
                      ${getIcon('user', { class: 'w-4 h-4' })}
                    </span>
                    <input id="name-input" required type="text" class="input-interactive w-full bg-slate-50 border border-slate-200/80 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400" placeholder="e.g. Sita Sharma"/>
                  </div>
                </div>

                <div class="flex flex-col gap-1">
                  <label class="text-xs font-semibold text-slate-700" for="phone-input">
                    Mobile Number (फोन नम्बर)
                  </label>
                  <div class="flex items-center gap-2">
                    <div class="px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-700 font-semibold text-xs shrink-0">
                      🇳🇵 +977
                    </div>
                    <input id="phone-input" type="tel" maxlength="10" class="input-interactive w-full bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400" placeholder="98XXXXXXXX"/>
                  </div>
                </div>
              ` : ''}

              <div class="flex flex-col gap-1">
                <label class="text-xs font-semibold text-slate-700" for="email-input">
                  Email Address (इमेल) <span class="text-primary">*</span>
                </label>
                <div class="relative flex items-center">
                  <span class="absolute left-3 text-slate-400">
                    ${getIcon('mail', { class: 'w-4 h-4' })}
                  </span>
                  <input id="email-input" required type="email" class="input-interactive w-full bg-slate-50 border border-slate-200/80 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400" placeholder="you@example.com"/>
                </div>
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-xs font-semibold text-slate-700" for="password-input">
                  Password (पासवर्ड) <span class="text-primary">*</span>
                </label>
                <div class="relative flex items-center">
                  <span class="absolute left-3 text-slate-400">
                    ${getIcon('lock', { class: 'w-4 h-4' })}
                  </span>
                  <input id="password-input" required minlength="6" type="password" class="input-interactive w-full bg-slate-50 border border-slate-200/80 rounded-lg pl-9 pr-9 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400" placeholder="At least 6 characters"/>
                  <button type="button" id="toggle-pwd-btn" class="absolute right-3 text-slate-400 hover:text-slate-600">
                    <span id="toggle-pwd-icon">
                      ${getIcon('eye', { class: 'w-4 h-4' })}
                    </span>
                  </button>
                </div>
              </div>

              <button id="auth-submit-btn" type="submit" class="btn-interactive w-full mt-2 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <span>${activeTab === 'signin' ? 'Sign In (लगइन)' : 'Create Account (खाता खोल्नुहोस्)'}</span>
              </button>
            </form>

            <!-- Demo Account Quick Fill Helper -->
            <div class="mt-5 pt-3.5 border-t border-slate-100 text-center">
              <p class="text-[11px] text-slate-500 mb-1.5">Need a quick test account?</p>
              <button id="quick-demo-btn" type="button" class="btn-interactive text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer">
                ⚡ Fill Demo Landlord Credentials
              </button>
            </div>
          </div>
        </div>
      `;

      // Tab clicks
      document.getElementById('tab-signin-btn')?.addEventListener('click', () => {
        activeTab = 'signin';
        updateView();
      });

      document.getElementById('tab-signup-btn')?.addEventListener('click', () => {
        activeTab = 'signup';
        updateView();
      });

      // Toggle password
      const togglePwdBtn = document.getElementById('toggle-pwd-btn');
      const pwdInput = document.getElementById('password-input');
      const pwdIcon = document.getElementById('toggle-pwd-icon');
      togglePwdBtn?.addEventListener('click', () => {
        if (pwdInput.type === 'password') {
          pwdInput.type = 'text';
          pwdIcon.innerHTML = getIcon('eye-off', { class: 'w-4 h-4' });
        } else {
          pwdInput.type = 'password';
          pwdIcon.innerHTML = getIcon('eye', { class: 'w-4 h-4' });
        }
      });

      // Quick demo helper
      document.getElementById('quick-demo-btn')?.addEventListener('click', () => {
        const emailEl = document.getElementById('email-input');
        const passEl = document.getElementById('password-input');
        if (emailEl) emailEl.value = 'landlord.demo@gharbhada.np';
        if (passEl) passEl.value = 'NepalRental2026!';
        const nameEl = document.getElementById('name-input');
        if (nameEl) nameEl.value = 'Rameshwor Karki';
        const phoneEl = document.getElementById('phone-input');
        if (phoneEl) phoneEl.value = '9841234567';
      });

      // Submit form
      document.getElementById('auth-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('auth-submit-btn');
        const errorBanner = document.getElementById('auth-error-banner');
        errorBanner.classList.add('hidden');

        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Please wait...</span>
        `;

        const email = document.getElementById('email-input').value.trim();
        const password = document.getElementById('password-input').value;

        try {
          if (activeTab === 'signup') {
            const fullName = document.getElementById('name-input')?.value.trim() || '';
            const phone = document.getElementById('phone-input')?.value.trim() || '';
            await signUp({ email, password, fullName, phone });
            showToast('Account created! Logging in...');
          } else {
            await signIn({ email, password });
            showToast('Signed in successfully! (सफलतापूर्वक लगइन भयो)');
          }

          renderNavbar();
          navigateTo(redirectTarget);
        } catch (err) {
          console.error('Auth error:', err);
          errorBanner.textContent = err.message || 'Authentication failed. Please check your credentials.';
          errorBanner.classList.remove('hidden');
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>${activeTab === 'signin' ? 'Sign In (लगइन)' : 'Create Account (खाता खोल्नुहोस्)'}</span>`;
        }
      });
    }

    updateView();
  }
};
