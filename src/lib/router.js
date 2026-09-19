import { getCurrentUser } from './auth.js';
import { showToast } from './toast.js';
import { getIcon } from './icons.js';

let routes = {};

export function registerRoutes(newRoutes) {
  routes = newRoutes;
}

export function navigateTo(hash) {
  if (window.location.hash === hash) {
    handleRoute();
  } else {
    window.location.hash = hash;
  }
}

export async function handleRoute() {
  const hash = window.location.hash || '#/';
  const [path, queryString] = hash.split('?');
  const queryParams = new URLSearchParams(queryString || '');

  let matchedHandler = null;
  let params = {};

  // Check static routes
  if (routes[path]) {
    matchedHandler = routes[path];
  } else {
    // Check dynamic routes (e.g. #/listing/:id or #/edit/:id)
    for (const routePattern in routes) {
      if (routePattern.includes(':')) {
        const patternParts = routePattern.split('/');
        const pathParts = path.split('/');

        if (patternParts.length === pathParts.length) {
          let match = true;
          const extractedParams = {};

          for (let i = 0; i < patternParts.length; i++) {
            if (patternParts[i].startsWith(':')) {
              const paramName = patternParts[i].substring(1);
              extractedParams[paramName] = decodeURIComponent(pathParts[i]);
            } else if (patternParts[i] !== pathParts[i]) {
              match = false;
              break;
            }
          }

          if (match) {
            matchedHandler = routes[routePattern];
            params = extractedParams;
            break;
          }
        }
      }
    }
  }

  // Fallback to home / browse
  if (!matchedHandler) {
    matchedHandler = routes['#/'] || routes['#/browse'];
  }

  const appEl = document.getElementById('app');
  if (!appEl) return;

  // Protected route check
  if (matchedHandler?.protected) {
    const user = getCurrentUser();
    if (!user) {
      showToast('Please sign in to access this page (कृपया पहिले लगइन गर्नुहोस्)', 'info');
      const redirectTarget = encodeURIComponent(hash);
      window.location.hash = `#/login?redirect=${redirectTarget}`;
      return;
    }
  }

  window.scrollTo({ top: 0, behavior: 'instant' });
  appEl.classList.remove('page-transition');
  void appEl.offsetWidth; // trigger reflow
  appEl.classList.add('page-transition');

  try {
    await matchedHandler.render(appEl, { params, queryParams });
  } catch (err) {
    console.error('Route render error:', err);
    appEl.innerHTML = `
      <div class="max-w-xl mx-auto my-16 p-8 bg-white rounded-2xl text-center shadow-card border border-slate-200">
        <div class="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-3">
          ${getIcon('alert-triangle', { class: 'w-6 h-6' })}
        </div>
        <h2 class="text-lg font-bold text-slate-900 mb-2">Something went wrong</h2>
        <p class="text-slate-600 text-sm mb-6">${err.message || 'Error rendering page'}</p>
        <a href="#/" class="btn-modern inline-flex items-center px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-md">Back to Browse</a>
      </div>
    `;
  }
}

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('auth-changed', () => {
    // If on a protected route and user logged out, redirect
    const hash = window.location.hash || '#/';
    const [path] = hash.split('?');
    if ((path === '#/post' || path === '#/my-listings' || path.startsWith('#/edit/')) && !getCurrentUser()) {
      window.location.hash = '#/login';
    }
  });
}
