import { signIn, signUp, getCurrentUser } from '../lib/auth.js';
import { renderNavbar } from '../components/Navbar.js';
import { showToast } from '../lib/toast.js';
import { navigateTo } from '../lib/router.js';

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
        <div class="max-w-md mx-auto my-12 px-4 animate-fade-in">
          <!-- Card Shell -->
          <div class="bg-surface-container-lowest rounded-2xl shadow-[0_12px_32px_-6px_rgba(38,70,83,0.12),0_4px_12px_-2px_rgba(231,111,81,0.08)] p-6 sm:p-8 border border-surface-container-high">
            
            <!-- Brand Badge -->
            <div class="text-center mb-6">
              <div class="w-12 h-12 rounded-full bg-primary-container/20 text-primary flex items-center justify-center font-black text-2xl mx-auto mb-2">
                🏠
              </div>
              <h1 class="font-headline-sm text-headline-sm font-black text-on-surface">
                ${activeTab === 'signin' ? 'Welcome Back (पुन: स्वागतम्)' : 'Join GharBhada Nepal (दर्ता गर्नुहोस्)'}
              </h1>
              <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">
                ${activeTab === 'signin' ? 'Sign in to manage your rentals or post spaces' : 'Create an account to list properties across Nepal for free'}
              </p>
            </div>

            <!-- Tab Switcher -->
            <div class="flex items-center p-1 bg-surface-container-low rounded-full mb-6">
              <button id="tab-signin-btn" class="flex-1 py-2 rounded-full font-label-md text-label-md transition-all ${activeTab === 'signin' ? 'bg-surface-container-lowest text-primary shadow font-bold' : 'text-on-surface-variant hover:text-on-surface'}">
                Sign In (लगइन)
              </button>
              <button id="tab-signup-btn" class="flex-1 py-2 rounded-full font-label-md text-label-md transition-all ${activeTab === 'signup' ? 'bg-surface-container-lowest text-primary shadow font-bold' : 'text-on-surface-variant hover:text-on-surface'}">
                Sign Up (नयाँ खाता)
              </button>
            </div>

            <!-- Error Banner -->
            <div id="auth-error-banner" class="hidden p-3 rounded-xl bg-error-container text-error font-body-sm text-sm mb-4"></div>

            <!-- Auth Form -->
            <form id="auth-form" class="flex flex-col gap-4">
              ${activeTab === 'signup' ? `
                <div class="flex flex-col gap-1">
                  <label class="font-label-md text-label-md text-on-surface font-semibold" for="name-input">
                    Full Name (पुरा नाम) <span class="text-primary">*</span>
                  </label>
                  <div class="relative flex items-center">
                    <span class="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[18px]">person</span>
                    <input id="name-input" required type="text" class="w-full bg-surface-container-low rounded-full pl-10 pr-4 py-2.5 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-body-md" placeholder="e.g. Sita Sharma"/>
                  </div>
                </div>

                <div class="flex flex-col gap-1">
                  <label class="font-label-md text-label-md text-on-surface font-semibold" for="phone-input">
                    Mobile Number (फोन नम्बर)
                  </label>
                  <div class="flex items-center gap-2">
                    <div class="px-3 py-2.5 rounded-full bg-surface-container-low text-on-surface font-label-md text-sm shrink-0">
                      🇳🇵 +977
                    </div>
                    <input id="phone-input" type="tel" maxlength="10" class="w-full bg-surface-container-low rounded-full px-4 py-2.5 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-body-md" placeholder="98XXXXXXXX"/>
                  </div>
                </div>
              ` : ''}

              <div class="flex flex-col gap-1">
                <label class="font-label-md text-label-md text-on-surface font-semibold" for="email-input">
                  Email Address (इमेल) <span class="text-primary">*</span>
                </label>
                <div class="relative flex items-center">
                  <span class="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[18px]">mail</span>
                  <input id="email-input" required type="email" class="w-full bg-surface-container-low rounded-full pl-10 pr-4 py-2.5 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-body-md" placeholder="you@example.com"/>
                </div>
              </div>

              <div class="flex flex-col gap-1">
                <label class="font-label-md text-label-md text-on-surface font-semibold" for="password-input">
                  Password (पासवर्ड) <span class="text-primary">*</span>
                </label>
                <div class="relative flex items-center">
                  <span class="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[18px]">lock</span>
                  <input id="password-input" required minlength="6" type="password" class="w-full bg-surface-container-low rounded-full pl-10 pr-10 py-2.5 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-body-md" placeholder="At least 6 characters"/>
                  <button type="button" id="toggle-pwd-btn" class="absolute right-3.5 text-on-surface-variant hover:text-on-surface">
                    <span class="material-symbols-outlined text-[18px]" id="toggle-pwd-icon">visibility</span>
                  </button>
                </div>
              </div>

              <button id="auth-submit-btn" type="submit" class="w-full mt-2 py-3 rounded-full bg-primary hover:bg-surface-tint text-on-primary font-label-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <span>${activeTab === 'signin' ? 'Sign In (लगइन)' : 'Create Account (खाता खोल्नुहोस्)'}</span>
              </button>
            </form>

            <!-- Demo Account Quick Fill Helper -->
            <div class="mt-6 pt-4 border-t border-surface-container-high text-center">
              <p class="text-xs text-on-surface-variant mb-2">Need a quick test account?</p>
              <button id="quick-demo-btn" type="button" class="text-xs px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-secondary font-semibold transition-colors">
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
          pwdIcon.textContent = 'visibility_off';
        } else {
          pwdInput.type = 'password';
          pwdIcon.textContent = 'visibility';
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
          <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
