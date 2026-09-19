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
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 page-transition">
        
        <!-- Landlord Summary Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-6 rounded-2xl shadow-card border border-slate-200/80">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-[#1E40AF] text-white flex items-center justify-center font-extrabold text-lg shrink-0 shadow-xs">
              ${(userName[0] || 'L').toUpperCase()}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-lg font-bold text-slate-900">${userName}</h1>
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1E40AF] border border-blue-200/80 text-[11px] font-bold">
                  ${getIcon('check-circle', { class: 'w-3 h-3 text-[#1E40AF]' })} Verified Landlord
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5 font-medium">${user.email}</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <a href="#/post" class="btn-brand inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs">
              ${getIcon('plus', { class: 'w-4 h-4 text-white' })}
              <span>+ Post Another Rental</span>
            </a>
          </div>
        </div>

        <!-- Dashboard Stat Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
          <div class="p-5 rounded-2xl bg-white shadow-card border border-slate-200/80 flex flex-col justify-between">
            <span class="text-xs font-bold text-slate-500">Active Listings (सक्रिय घरभाडा)</span>
            <div class="mt-2 flex items-baseline gap-2">
              <span id="active-count" class="price-dominant text-3xl font-extrabold text-slate-900">...</span>
              <span class="text-xs text-slate-400 font-medium">live on marketplace</span>
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-white shadow-card border border-slate-200/80 flex flex-col justify-between">
            <span class="text-xs font-bold text-slate-500">Commission Saved</span>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="price-dominant text-3xl font-extrabold text-emerald-600">रु ०</span>
              <span class="text-xs text-slate-400 font-medium">100% Direct to Tenant</span>
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-white shadow-card border border-slate-200/80 flex flex-col justify-between">
            <span class="text-xs font-bold text-slate-500">Tenant Inquiries Channels</span>
            <div class="mt-3 flex items-center gap-3 text-slate-800 text-xs font-semibold">
              <span class="flex items-center gap-1 text-emerald-600">${getIcon('message-circle', { class: 'w-4 h-4' })} WhatsApp</span>
              <span class="flex items-center gap-1 text-purple-600">${getIcon('phone', { class: 'w-4 h-4' })} Viber</span>
              <span class="flex items-center gap-1 text-[#1E40AF]">${getIcon('phone-call', { class: 'w-4 h-4' })} Call</span>
            </div>
          </div>
        </div>

        <!-- Listings Section -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-slate-900">Your Properties (तपाईंका लिस्टिङहरू)</h2>
          <span class="text-xs text-slate-500 font-medium">Manage, edit, or remove listings</span>
        </div>

        <div id="my-listings-container" class="flex flex-col gap-4">
          <!-- Neutral Skeletons -->
          ${[1, 2].map(() => `
            <div class="p-5 rounded-2xl bg-white shadow-card border border-slate-200/80 flex flex-col md:flex-row gap-4 items-start">
              <div class="w-full md:w-52 h-36 rounded-xl skeleton-shimmer shrink-0"></div>
              <div class="flex flex-col flex-1 w-full gap-3">
                <div class="h-4 w-3/4 skeleton-shimmer rounded-lg"></div>
                <div class="h-3 w-1/3 skeleton-shimmer rounded-lg"></div>
                <div class="h-5 w-1/2 skeleton-shimmer rounded-lg mt-2"></div>
                <div class="h-8 w-48 skeleton-shimmer rounded-xl mt-2"></div>
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
          <div class="p-5 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-center text-xs font-medium">
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
          <div class="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-card">
            <div class="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-3 text-[#1E40AF]">
              ${getIcon('home', { class: 'w-7 h-7 text-[#1E40AF]' })}
            </div>
            <h3 class="text-base font-bold text-slate-900 mb-1">You have no listings posted yet</h3>
            <p class="text-xs sm:text-sm text-slate-500 mb-6 max-w-sm mx-auto">Start connecting with verified tenants by listing your room, flat, shutter, or land.</p>
            <a href="#/post" class="btn-brand inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm">
              ${getIcon('plus', { class: 'w-4 h-4 text-white' })}
              <span>Post Your First Rental (+ पोस्ट गर्नुहोस्)</span>
            </a>
          </div>
        `;
        return;
      }

      containerEl.innerHTML = listings.map((item) => {
        const photo = item.photos?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80';
        const formattedPrice = Number(item.price).toLocaleString('en-IN');
        const isActive = item.status === 'active';

        return `
          <article class="card-modern group p-5 rounded-2xl bg-white shadow-card border border-slate-200/80 flex flex-col md:flex-row gap-5 items-start">
            <!-- Thumbnail (4:3) -->
            <a href="#/listing/${item.id}" class="relative w-full md:w-52 aspect-[4/3] rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 block cursor-pointer">
              <img src="${photo}" class="w-full h-full object-cover img-zoom" alt="${item.title}"/>
              <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${isActive ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-white'}">
                ${isActive ? '● Active' : '● Rented'}
              </span>
            </a>

            <!-- Info & Actions -->
            <div class="flex flex-col justify-between flex-1 min-w-0 w-full h-full">
              <div>
                <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div class="inline-flex items-center gap-1 text-[#1E40AF] text-xs font-semibold mb-1">
                      ${getIcon('map-pin', { class: 'w-3 h-3 text-[#1E40AF]' })}
                      <span>${item.location_area}, ${item.location_city}</span>
                    </div>
                    <a href="#/listing/${item.id}" class="hover:text-[#1E40AF] transition-colors">
                      <h3 class="text-base text-slate-900 font-bold truncate">${item.title}</h3>
                    </a>
                  </div>
                  <div class="text-left sm:text-right shrink-0">
                    <span class="price-dominant text-xl sm:text-2xl font-extrabold text-slate-900 block">रु ${formattedPrice}</span>
                    <span class="text-[10px] text-slate-400 font-semibold">/ month</span>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-2 mt-3 text-xs">
                  <span class="px-2.5 py-1 rounded-lg bg-blue-50 text-[#1E40AF] font-bold uppercase text-[10px]">${item.category}</span>
                  <span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">${item.bedrooms || 1} Bed / ${item.bathrooms || 1} Bath</span>
                  <span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">${item.water_facility || '24/7 Water'}</span>
                  <span class="text-slate-500 font-medium ml-1">Contact: ${item.contact_phone}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap items-center gap-2 mt-5 pt-3.5 border-t border-slate-100">
                <a href="#/edit/${item.id}" class="btn-press inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all border border-slate-200">
                  ${getIcon('edit', { class: 'w-3.5 h-3.5 text-slate-600' })}
                  <span>Edit</span>
                </a>

                <button type="button" class="toggle-status-btn btn-press inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100' : 'bg-slate-50 text-slate-800 border border-slate-200 hover:bg-slate-100'}" data-id="${item.id}" data-status="${item.status}">
                  ${getIcon(isActive ? 'check-circle' : 'rotate-ccw', { class: 'w-3.5 h-3.5' })}
                  <span>${isActive ? 'Mark as Rented' : 'Mark as Available'}</span>
                </button>

                <a href="#/listing/${item.id}" class="btn-press inline-flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-bold transition-all">
                  ${getIcon('eye', { class: 'w-3.5 h-3.5' })}
                  <span>View</span>
                </a>

                <button type="button" class="delete-listing-btn btn-press inline-flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all ml-auto cursor-pointer" data-id="${item.id}" data-title="${item.title}">
                  ${getIcon('trash-2', { class: 'w-3.5 h-3.5 text-rose-500' })}
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
