import { supabase } from '../lib/supabase.js';
import { getCurrentUser } from '../lib/auth.js';
import { showToast } from '../lib/toast.js';
import { navigateTo } from '../lib/router.js';

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
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
        
        <!-- Landlord Summary Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-surface-container-lowest p-4 sm:p-5 rounded-xl shadow-xs border border-slate-200/80">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base shrink-0">
              ${(userName[0] || 'L').toUpperCase()}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-base sm:text-lg font-bold text-on-surface">${userName}</h1>
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-semibold">
                  <span class="material-symbols-outlined text-[12px]">verified</span> Verified Landlord
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">${user.email}</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <a href="#/post" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-surface-tint text-on-primary text-xs font-semibold shadow-xs transition-all">
              <span class="material-symbols-outlined text-[16px]">add_circle</span>
              <span>+ Post Another Rental</span>
            </a>
          </div>
        </div>

        <!-- Dashboard Stat Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div class="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs border border-slate-200/80 flex flex-col justify-between">
            <span class="text-[11px] font-semibold text-slate-500">Active Listings (सक्रिय घरभाडा)</span>
            <div class="mt-1.5 flex items-baseline gap-2">
              <span id="active-count" class="text-xl font-bold text-primary">...</span>
              <span class="text-[11px] text-slate-400">live on marketplace</span>
            </div>
          </div>

          <div class="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs border border-slate-200/80 flex flex-col justify-between">
            <span class="text-[11px] font-semibold text-slate-500">Commission Saved</span>
            <div class="mt-1.5 flex items-baseline gap-2">
              <span class="text-xl font-bold text-secondary">रु ०</span>
              <span class="text-[11px] text-slate-400">100% Direct to Tenant</span>
            </div>
          </div>

          <div class="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs border border-slate-200/80 flex flex-col justify-between">
            <span class="text-[11px] font-semibold text-slate-500">Tenant Inquiries Channel</span>
            <div class="mt-1.5 flex items-center gap-3 text-slate-700 text-xs font-semibold">
              <span class="flex items-center gap-1 text-[#25D366]"><span class="material-symbols-outlined text-[15px]">chat</span> WhatsApp</span>
              <span class="flex items-center gap-1 text-[#7360F2]"><span class="material-symbols-outlined text-[15px]">forum</span> Viber</span>
              <span class="flex items-center gap-1 text-secondary"><span class="material-symbols-outlined text-[15px]">call</span> Call</span>
            </div>
          </div>
        </div>

        <!-- Listings Section -->
        <div class="flex items-center justify-between mb-3.5">
          <h2 class="text-sm sm:text-base font-bold text-slate-800">Your Properties (तपाईंका लिस्टिङहरू)</h2>
          <span class="text-xs text-slate-500">Manage, edit, or remove listings</span>
        </div>

        <div id="my-listings-container" class="flex flex-col gap-3">
          <div class="py-12 text-center text-slate-400">
            <div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p class="text-xs">Loading your listings...</p>
          </div>
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
          <div class="p-4 bg-error-container/30 border border-error/20 text-error rounded-xl text-center text-xs">
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
          <div class="p-8 text-center bg-surface-container-lowest rounded-xl border border-dashed border-slate-300">
            <span class="material-symbols-outlined text-4xl text-slate-300 mb-1.5">real_estate_agent</span>
            <h3 class="text-sm font-bold text-slate-800 mb-1">You have no listings posted yet</h3>
            <p class="text-xs text-slate-500 mb-4">Start connecting with verified tenants by listing your room, flat, shutter, or land.</p>
            <a href="#/post" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold shadow-xs hover:shadow transition-all">
              <span class="material-symbols-outlined text-[16px]">add_circle</span>
              <span>Post Your First Rental (+ पोस्ट गर्नुहोस्)</span>
            </a>
          </div>
        `;
        return;
      }

      containerEl.innerHTML = listings.map(item => {
        const photo = item.photos?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80';
        const formattedPrice = Number(item.price).toLocaleString('en-IN');
        const isActive = item.status === 'active';

        return `
          <article class="p-3.5 sm:p-4 rounded-xl bg-surface-container-lowest shadow-xs border border-slate-200/80 flex flex-col md:flex-row gap-4 items-start">
            <!-- Thumbnail -->
            <a href="#/listing/${item.id}" class="relative w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container block cursor-pointer">
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
                      <span class="material-symbols-outlined text-[13px]">location_on</span>
                      <span>${item.location_area}, ${item.location_city}</span>
                    </div>
                    <a href="#/listing/${item.id}" class="hover:text-primary transition-colors">
                      <h3 class="text-sm sm:text-base text-on-surface font-bold truncate">${item.title}</h3>
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
                <a href="#/edit/${item.id}" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors">
                  <span class="material-symbols-outlined text-[14px]">edit</span>
                  <span>Edit</span>
                </a>

                <button type="button" class="toggle-status-btn inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${isActive ? 'bg-secondary/10 text-secondary hover:bg-secondary/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}" data-id="${item.id}" data-status="${item.status}">
                  <span class="material-symbols-outlined text-[14px]">${isActive ? 'check_circle' : 'replay'}</span>
                  <span>${isActive ? 'Mark as Rented' : 'Mark as Available'}</span>
                </button>

                <a href="#/listing/${item.id}" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors">
                  <span class="material-symbols-outlined text-[14px]">visibility</span>
                  <span>View</span>
                </a>

                <button type="button" class="delete-listing-btn inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 text-xs font-semibold transition-colors ml-auto" data-id="${item.id}" data-title="${item.title}">
                  <span class="material-symbols-outlined text-[14px]">delete</span>
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
