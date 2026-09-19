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

    const redirectTarget = queryParams?.get('redirect') ? decodeURIComponent(queryParams.get('redirect')) : '#/my-listings';
    let activeTab = 'signin'; // 'signin' or 'signup'

    function updateView() {
      container.innerHTML = `
        <div class="max-w-md mx-auto my-14 px-4 page-transition">
          <!-- Card Shell -->
          <div class="bg-white rounded-2xl shadow-floating p-7 sm:p-8 border border-slate-200/80">
            
            <!-- Brand Badge -->
            <div class="text-center mb-6">
              <div class="w-12 h-12 rounded-xl bg-[#1E40AF] text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
                ${getIcon('home', { class: 'w-6 h-6 text-white' })}
              </div>
              <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                ${activeTab === 'signin' ? 'Welcome Back (पुन: स्वागतम्)' : 'Join GharBhada Nepal (दर्ता गर्नुहोस्)'}
              </h1>
              <p class="text-xs text-slate-500 mt-1.5 font-medium">
                ${activeTab === 'signin' ? 'Sign in to manage your rentals or post spaces' : 'Create an account to list properties across Nepal for free'}
              </p>
            </div>

            <!-- Tab Switcher -->
            <div class="flex items-center p-1 bg-slate-100 rounded-xl mb-6 border border-slate-200/60">
              <button id="tab-signin-btn" class="btn-press flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'}">
                Sign In (लगइन)
              </button>
              <button id="tab-signup-btn" class="btn-press flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'}">
                Sign Up (नयाँ खाता)
              </button>
            </div>

            <!-- Error Banner -->
            <div id="auth-error-banner" class="hidden p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs mb-5 font-medium"></div>

            <!-- Auth Form -->
            <form id="auth-form" class="flex flex-col gap-4">
              ${activeTab === 'signup' ? `
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-700" for="name-input">
                    Full Name (पुरा नाम) <span class="text-[#1E40AF]">*</span>
                  </label>
                  <div class="relative flex items-center">
                    <span class="absolute left-3.5 text-slate-400">
                      ${getIcon('user', { class: 'w-4 h-4' })}
                    </span>
                    <input id="name-input" required type="text" class="input-focus w-full pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 font-medium" placeholder="e.g. Sita Sharma"/>
                  </div>
                </div>

                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-700" for="phone-input">
                    Mobile Number (फोन नम्बर)
                  </label>
                  <div class="flex items-center gap-2">
                    <div class="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-semibold text-xs shrink-0">
                      🇳🇵 +977
                    </div>
                    <input id="phone-input" type="tel" maxlength="10" class="input-focus w-full px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 font-medium" placeholder="98XXXXXXXX"/>
                  </div>
                </div>
              ` : ''}

              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-slate-700" for="email-input">
                  Email Address (इमेल) <span class="text-[#1E40AF]">*</span>
                </label>
                <div class="relative flex items-center">
                  <span class="absolute left-3.5 text-slate-400">
                    ${getIcon('mail', { class: 'w-4 h-4' })}
                  </span>
                  <input id="email-input" required type="email" class="input-focus w-full pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 font-medium" placeholder="you@example.com"/>
                </div>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-slate-700" for="password-input">
                  Password (पासवर्ड) <span class="text-[#1E40AF]">*</span>
                </label>
                <div class="relative flex items-center">
                  <span class="absolute left-3.5 text-slate-400">
                    ${getIcon('lock', { class: 'w-4 h-4' })}
                  </span>
                  <input id="password-input" required minlength="6" type="password" class="input-focus w-full pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 font-medium" placeholder="At least 6 characters"/>
                  <button type="button" id="toggle-pwd-btn" class="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer">
                    <span id="toggle-pwd-icon">
                      ${getIcon('eye', { class: 'w-4 h-4' })}
                    </span>
                  </button>
                </div>
              </div>

              <button id="auth-submit-btn" type="submit" class="btn-brand w-full mt-2 py-3 rounded-xl text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
                <span>${activeTab === 'signin' ? 'Sign In (लगइन)' : 'Create Account (खाता खोल्नुहोस्)'}</span>
              </button>
            </form>

            <!-- Demo Account Quick Fill Helper -->
            <div class="mt-6 pt-4 border-t border-slate-100 text-center">
              <p class="text-[11px] text-slate-400 mb-2 font-medium">Need a quick test account?</p>
              <button id="quick-demo-btn" type="button" class="btn-press text-xs px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 transition-colors cursor-pointer">
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
