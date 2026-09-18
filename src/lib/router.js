import { getCurrentUser } from './auth.js';
import { showToast } from './toast.js';

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
  try {
    await matchedHandler.render(appEl, { params, queryParams });
  } catch (err) {
    console.error('Route render error:', err);
    appEl.innerHTML = `
      <div class="max-w-xl mx-auto my-16 p-8 bg-surface-container-lowest rounded-DEFAULT text-center shadow-sm">
        <span class="material-symbols-outlined text-4xl text-error mb-2">error</span>
        <h2 class="text-xl font-bold mb-2">Something went wrong</h2>
        <p class="text-on-surface-variant mb-6">${err.message || 'Error rendering page'}</p>
        <a href="#/" class="px-6 py-2 bg-primary text-on-primary rounded-full font-bold">Back to Browse</a>
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
