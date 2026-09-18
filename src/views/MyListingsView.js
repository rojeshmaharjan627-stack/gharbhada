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
      <div class="max-w-7xl mx-auto px-margin-sm lg:px-margin py-8 animate-fade-in">
        
        <!-- Landlord Summary Banner -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-surface-container-lowest p-6 rounded-DEFAULT shadow-sm border border-surface-container-high">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-primary-container/20 text-primary flex items-center justify-center font-black text-2xl shrink-0">
              ${(userName[0] || 'L').toUpperCase()}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="font-headline-md text-headline-md font-bold text-on-surface">${userName}</h1>
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-xs font-bold">
                  <span class="material-symbols-outlined text-[13px]">verified</span> Verified Landlord
                </span>
              </div>
              <p class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">${user.email}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <a href="#/post" class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-surface-tint text-on-primary font-label-lg font-bold shadow-md transition-all">
              <span class="material-symbols-outlined text-[20px]">add_circle</span>
              <span>+ Post Another Rental</span>
            </a>
          </div>
        </div>

        <!-- Dashboard Stat Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div class="p-5 rounded-DEFAULT bg-surface-container-lowest shadow-sm border border-surface-container-high flex flex-col justify-between">
            <span class="font-label-sm text-label-sm text-on-surface-variant font-bold">Active Listings (सक्रिय घरभाडा)</span>
            <div class="mt-2 flex items-baseline gap-2">
              <span id="active-count" class="font-display-lg text-3xl font-black text-primary">...</span>
              <span class="text-xs text-on-surface-variant">live on marketplace</span>
            </div>
          </div>

          <div class="p-5 rounded-DEFAULT bg-surface-container-lowest shadow-sm border border-surface-container-high flex flex-col justify-between">
            <span class="font-label-sm text-label-sm text-on-surface-variant font-bold">Commission Saved</span>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="font-display-lg text-3xl font-black text-secondary">रु ०</span>
              <span class="text-xs text-on-surface-variant">100% Direct to Tenant</span>
            </div>
          </div>

          <div class="p-5 rounded-DEFAULT bg-surface-container-lowest shadow-sm border border-surface-container-high flex flex-col justify-between">
            <span class="font-label-sm text-label-sm text-on-surface-variant font-bold">Tenant Inquiries Channel</span>
            <div class="mt-2 flex items-center gap-3 text-on-surface text-sm">
              <span class="flex items-center gap-1 text-[#25D366] font-bold"><span class="material-symbols-outlined text-[16px]">chat</span> WhatsApp</span>
              <span class="flex items-center gap-1 text-[#7360F2] font-bold"><span class="material-symbols-outlined text-[16px]">forum</span> Viber</span>
              <span class="flex items-center gap-1 text-secondary font-bold"><span class="material-symbols-outlined text-[16px]">call</span> Call</span>
            </div>
          </div>
        </div>

        <!-- Listings Section -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-headline-sm text-headline-sm font-bold text-on-surface">Your Properties (तपाईंका लिस्टिङहरू)</h2>
          <span class="text-xs text-on-surface-variant">Manage, edit, or remove listings</span>
        </div>

        <div id="my-listings-container" class="flex flex-col gap-4">
          <div class="py-16 text-center text-on-surface-variant">
            <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p>Loading your listings...</p>
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
          <div class="p-6 bg-error-container text-error rounded-DEFAULT text-center">
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
          <div class="p-12 text-center bg-surface-container-lowest rounded-DEFAULT border border-dashed border-outline-variant/50">
            <span class="material-symbols-outlined text-5xl text-on-surface-variant mb-2">real_estate_agent</span>
            <h3 class="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">You have no listings posted yet</h3>
            <p class="font-body-sm text-body-sm text-on-surface-variant mb-6">Start connecting with verified tenants by listing your room, flat, shutter, or land.</p>
            <a href="#/post" class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-label-lg font-bold shadow-md hover:shadow-lg transition-all">
              <span class="material-symbols-outlined text-[20px]">add_circle</span>
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
          <article class="p-4 sm:p-5 rounded-DEFAULT bg-surface-container-lowest shadow-sm border border-surface-container-high flex flex-col md:flex-row gap-5 items-start">
            <!-- Thumbnail -->
            <a href="#/listing/${item.id}" class="relative w-full md:w-56 h-40 rounded-DEFAULT overflow-hidden flex-shrink-0 bg-surface-container block cursor-pointer">
              <img src="${photo}" class="w-full h-full object-cover"/>
              <span class="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm ${isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-container-high text-on-surface-variant'}">
                ${isActive ? '● Active & Live' : '● Rented Out'}
              </span>
            </a>

            <!-- Info & Actions -->
            <div class="flex flex-col justify-between flex-1 min-w-0 w-full h-full">
              <div>
                <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div class="inline-flex items-center gap-1 text-secondary font-label-sm text-xs mb-0.5">
                      <span class="material-symbols-outlined text-[15px]">location_on</span>
                      <span>${item.location_area}, ${item.location_city}</span>
                    </div>
                    <a href="#/listing/${item.id}" class="hover:text-primary transition-colors">
                      <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold truncate">${item.title}</h3>
                    </a>
                  </div>
                  <div class="text-left sm:text-right shrink-0">
                    <span class="font-headline-md text-headline-md text-primary font-extrabold block">रु ${formattedPrice}</span>
                    <span class="font-label-sm text-xs text-on-surface-variant">/ month</span>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-2 mt-2 text-xs text-on-surface-variant">
                  <span class="px-2.5 py-0.5 rounded-full bg-surface-container-low text-on-surface">${item.category.toUpperCase()}</span>
                  <span class="px-2.5 py-0.5 rounded-full bg-surface-container-low text-on-surface">${item.bedrooms || 1} Bed / ${item.bathrooms || 1} Bath</span>
                  <span class="px-2.5 py-0.5 rounded-full bg-surface-container-low text-on-surface">${item.water_facility || '24/7 Water'}</span>
                  <span class="text-on-surface-variant ml-1">Phone: ${item.contact_phone}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-surface-container-high">
                <a href="#/edit/${item.id}" class="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-container text-on-surface font-label-md text-sm transition-colors">
                  <span class="material-symbols-outlined text-[16px]">edit</span>
                  <span>Edit Details</span>
                </a>

                <button type="button" class="toggle-status-btn inline-flex items-center gap-1 px-4 py-1.5 rounded-full font-label-md text-sm transition-colors ${isActive ? 'bg-secondary text-white hover:opacity-90' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'}" data-id="${item.id}" data-status="${item.status}">
                  <span class="material-symbols-outlined text-[16px]">${isActive ? 'check_circle' : 'replay'}</span>
                  <span>${isActive ? 'Mark as Rented (भाडामा लाग्यो)' : 'Mark as Available'}</span>
                </button>

                <a href="#/listing/${item.id}" class="inline-flex items-center gap-1 px-4 py-1.5 rounded-full hover:bg-surface-container-low text-secondary font-label-md text-sm transition-colors">
                  <span class="material-symbols-outlined text-[16px]">visibility</span>
                  <span>View Public Page</span>
                </a>

                <button type="button" class="delete-listing-btn inline-flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-error-container text-error font-label-md text-sm transition-colors ml-auto" data-id="${item.id}" data-title="${item.title}">
                  <span class="material-symbols-outlined text-[16px]">delete</span>
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
