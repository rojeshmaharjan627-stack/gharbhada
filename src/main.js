import './style.css';
import { initAuth } from './lib/auth.js';
import { registerRoutes, initRouter, handleRoute } from './lib/router.js';
import { renderNavbar } from './components/Navbar.js';
import { renderFooter } from './components/Footer.js';

import { BrowseView } from './views/BrowseView.js';
import { DetailView } from './views/DetailView.js';
import { PostView } from './views/PostView.js';
import { LoginView } from './views/LoginView.js';
import { MyListingsView } from './views/MyListingsView.js';

async function bootstrap() {
  // 1. Initialize Supabase Auth session
  await initAuth();

  // 2. Render static layout shells
  renderNavbar();
  renderFooter();

  // 3. Register application routes
  registerRoutes({
    '#/': BrowseView,
    '#/browse': BrowseView,
    '#/listing/:id': DetailView,
    '#/post': PostView,
    '#/edit/:id': PostView,
    '#/login': LoginView,
    '#/my-listings': MyListingsView,
  });

  // 4. Start Router
  initRouter();
  handleRoute();

  // 5. Auth state listener for UI refresh
  window.addEventListener('auth-changed', () => {
    renderNavbar();
  });
}

bootstrap().catch(err => {
  console.error('Bootstrap failed:', err);
});
