import { supabase } from '../lib/supabase.js';
import { getCurrentUser } from '../lib/auth.js';
import { showToast } from '../lib/toast.js';
import { navigateTo } from '../lib/router.js';
import { getIcon } from '../lib/icons.js';

export const MyListingsView = {
  protected: true,

  async render(container) {
    const user = getCurrentUser();
    if (!user) {
      navigateTo('#/login?redirect=my-listings');
      return;
    }

    const userName = user.user_metadata?.full_name || user.email.split('@')[0];

    container.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        
        <!-- Landlord Summary Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 sm:p-5 rounded-xl shadow-xs border border-slate-200/80">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-lg bg-primary-light text-primary flex items-center justify-center font-bold text-base shrink-0 border border-primary/20">
              ${(userName[0] || 'L').toUpperCase()}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-base sm:text-lg font-bold text-slate-900">${userName}</h1>
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-semibold">
                  ${getIcon('check-circle', { class: 'w-3 h-3 text-emerald-600' })} Verified Landlord
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">${user.email}</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <a href="#/post" class="btn-interactive inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-all">
              ${getIcon('plus', { class: 'w-4 h-4' })}
              <span>+ Post Another Rental</span>
            </a>
          </div>
        </div>

        <!-- Dashboard Stat Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div class="p-4 rounded-xl bg-white shadow-xs border border-slate-200/80 flex flex-col justify-between">
            <span class="text-[11px] font-semibold text-slate-500">Active Listings (सक्रिय घरभाडा)</span>
            <div class="mt-1.5 flex items-baseline gap-2">
              <span id="active-count" class="text-xl font-bold text-primary">...</span>
              <span class="text-[11px] text-slate-400">live on marketplace</span>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-white shadow-xs border border-slate-200/80 flex flex-col justify-between">
            <span class="text-[11px] font-semibold text-slate-500">Commission Saved</span>
            <div class="mt-1.5 flex items-baseline gap-2">
              <span class="text-xl font-bold text-secondary">रु ०</span>
              <span class="text-[11px] text-slate-400">100% Direct to Tenant</span>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-white shadow-xs border border-slate-200/80 flex flex-col justify-between">
            <span class="text-[11px] font-semibold text-slate-500">Tenant Inquiries Channel</span>
            <div class="mt-1.5 flex items-center gap-3 text-slate-700 text-xs font-semibold">
              <span class="flex items-center gap-1 text-[#25D366]">${getIcon('message-circle', { class: 'w-3.5 h-3.5' })} WhatsApp</span>
              <span class="flex items-center gap-1 text-[#7360F2]">${getIcon('phone', { class: 'w-3.5 h-3.5' })} Viber</span>
              <span class="flex items-center gap-1 text-secondary">${getIcon('phone-call', { class: 'w-3.5 h-3.5' })} Call</span>
            </div>
          </div>
        </div>

        <!-- Listings Section -->
        <div class="flex items-center justify-between mb-3.5">
          <h2 class="text-sm sm:text-base font-bold text-slate-800">Your Properties (तपाईंका लिस्टिङहरू)</h2>
          <span class="text-xs text-slate-500">Manage, edit, or remove listings</span>
        </div>

        <div id="my-listings-container" class="flex flex-col gap-3">
          <!-- Animated Skeleton Loader -->
          ${[1, 2].map(() => `
            <div class="p-4 rounded-xl bg-white shadow-xs border border-slate-200/80 flex flex-col md:flex-row gap-4 items-start">
              <div class="w-full md:w-48 h-32 rounded-lg skeleton shrink-0"></div>
              <div class="flex flex-col flex-1 w-full gap-2">
                <div class="h-4 w-3/4 skeleton rounded"></div>
                <div class="h-3 w-1/3 skeleton rounded"></div>
                <div class="h-5 w-1/2 skeleton rounded-md mt-2"></div>
                <div class="h-7 w-48 skeleton rounded-lg mt-2"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    async function loadMyListings() {
      const containerEl = document.getElementById('my-listings-container');
      const countEl = document.getElementById('active-count');
      if (!containerEl) return;

      const { data: listings, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        containerEl.innerHTML = `
          <div class="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-center text-xs">
            Failed to load listings: ${error.message}
          </div>
        `;
        return;
      }

      if (countEl) {
        countEl.textContent = listings.filter(l => l.status === 'active').length;
      }

      if (!listings || listings.length === 0) {
        containerEl.innerHTML = `
          <div class="p-8 text-center bg-white rounded-xl border border-dashed border-slate-300">
            <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
              ${getIcon('home', { class: 'w-6 h-6' })}
            </div>
            <h3 class="text-sm font-bold text-slate-800 mb-1">You have no listings posted yet</h3>
            <p class="text-xs text-slate-500 mb-4">Start connecting with verified tenants by listing your room, flat, shutter, or land.</p>
            <a href="#/post" class="btn-interactive inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs">
              ${getIcon('plus', { class: 'w-4 h-4' })}
              <span>Post Your First Rental (+ पोस्ट गर्नुहोस्)</span>
            </a>
          </div>
        `;
        return;
      }

      containerEl.innerHTML = listings.map((item, index) => {
        const photo = item.photos?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80';
        const formattedPrice = Number(item.price).toLocaleString('en-IN');
        const isActive = item.status === 'active';
        const staggerDelay = Math.min(index * 50, 300);

        return `
          <article class="card-hover stagger-card p-3.5 sm:p-4 rounded-xl bg-white shadow-xs border border-slate-200/80 flex flex-col md:flex-row gap-4 items-start" style="animation-delay: ${staggerDelay}ms;">
            <!-- Thumbnail -->
            <a href="#/listing/${item.id}" class="relative w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 block cursor-pointer">
              <img src="${photo}" class="w-full h-full object-cover"/>
              <span class="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs ${isActive ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-white'}">
                ${isActive ? '● Active' : '● Rented'}
              </span>
            </a>

            <!-- Info & Actions -->
            <div class="flex flex-col justify-between flex-1 min-w-0 w-full h-full">
              <div>
                <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5">
                  <div>
                    <div class="inline-flex items-center gap-1 text-secondary text-[11px] font-medium mb-0.5">
                      ${getIcon('map-pin', { class: 'w-3 h-3 text-secondary' })}
                      <span>${item.location_area}, ${item.location_city}</span>
                    </div>
                    <a href="#/listing/${item.id}" class="hover:text-primary transition-colors">
                      <h3 class="text-sm sm:text-base text-slate-900 font-bold truncate">${item.title}</h3>
                    </a>
                  </div>
                  <div class="text-left sm:text-right shrink-0">
                    <span class="text-base font-bold text-primary block">रु ${formattedPrice}</span>
                    <span class="text-[10px] text-slate-400">/ month</span>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-1.5 mt-2 text-[11px] text-slate-500">
                  <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">${item.category.toUpperCase()}</span>
                  <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">${item.bedrooms || 1} Bed / ${item.bathrooms || 1} Bath</span>
                  <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">${item.water_facility || '24/7 Water'}</span>
                  <span class="text-slate-400 ml-1">Phone: ${item.contact_phone}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-slate-100">
                <a href="#/edit/${item.id}" class="btn-interactive inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors">
                  ${getIcon('edit', { class: 'w-3.5 h-3.5 text-slate-600' })}
                  <span>Edit</span>
                </a>

                <button type="button" class="toggle-status-btn btn-interactive inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${isActive ? 'bg-secondary/10 text-secondary hover:bg-secondary/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}" data-id="${item.id}" data-status="${item.status}">
                  ${getIcon(isActive ? 'check-circle' : 'rotate-ccw', { class: 'w-3.5 h-3.5' })}
                  <span>${isActive ? 'Mark as Rented' : 'Mark as Available'}</span>
                </button>

                <a href="#/listing/${item.id}" class="btn-interactive inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors">
                  ${getIcon('eye', { class: 'w-3.5 h-3.5' })}
                  <span>View</span>
                </a>

                <button type="button" class="delete-listing-btn btn-interactive inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 text-xs font-semibold transition-colors ml-auto" data-id="${item.id}" data-title="${item.title}">
                  ${getIcon('trash-2', { class: 'w-3.5 h-3.5' })}
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </article>
        `;
      }).join('');

      // Wire Toggle Status
      document.querySelectorAll('.toggle-status-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.getAttribute('data-id');
          const currentStatus = btn.getAttribute('data-status');
          const newStatus = currentStatus === 'active' ? 'rented' : 'active';

          try {
            const { error } = await supabase
              .from('listings')
              .update({ status: newStatus })
              .eq('id', id)
              .eq('user_id', user.id);

            if (error) throw error;
            showToast(`Listing marked as ${newStatus === 'active' ? 'Available' : 'Rented Out'}`);
            loadMyListings();
          } catch (err) {
            showToast(err.message, 'error');
          }
        });
      });

      // Wire Delete
      document.querySelectorAll('.delete-listing-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.getAttribute('data-id');
          const title = btn.getAttribute('data-title');

          if (confirm(`Are you sure you want to permanently delete "${title}"? This action cannot be undone.`)) {
            try {
              const { error } = await supabase
                .from('listings')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);

              if (error) throw error;
              showToast('Listing deleted successfully (लिस्टिङ हटाइयो)');
              loadMyListings();
            } catch (err) {
              showToast(err.message, 'error');
            }
          }
        });
      });
    }

    loadMyListings();
  }
};
