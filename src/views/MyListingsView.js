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
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 page-transition">
        
        <!-- Landlord Summary Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-5 rounded-[12px] shadow-card border border-[#F0EBE3]">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-[8px] bg-[#FDF0EC] text-[#D97757] flex items-center justify-center font-bold text-base shrink-0 border border-[#D97757]/20">
              ${(userName[0] || 'L').toUpperCase()}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-base sm:text-lg font-semibold text-[#1F1B16]">${userName}</h1>
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[8px] bg-[#EEF4F0] text-[#5B8266] border border-[#5B8266]/20 text-[11px] font-semibold">
                  ${getIcon('check-circle', { class: 'w-3 h-3 text-[#5B8266]' })} Verified Landlord
                </span>
              </div>
              <p class="text-xs text-[#6B6258] mt-0.5">${user.email}</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <a href="#/post" class="btn-press inline-flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-[#D97757] hover:bg-[#c66849] text-white text-xs font-semibold shadow-card transition-all">
              ${getIcon('plus', { class: 'w-4 h-4' })}
              <span>Post Another Rental</span>
            </a>
          </div>
        </div>

        <!-- Dashboard Stat Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
          <div class="p-4 rounded-[12px] bg-white shadow-card border border-[#F0EBE3] flex flex-col justify-between">
            <span class="text-xs font-medium text-[#6B6258]">Active Listings (सक्रिय घरभाडा)</span>
            <div class="mt-2 flex items-baseline gap-2">
              <span id="active-count" class="text-2xl font-bold text-[#D97757]">...</span>
              <span class="text-xs text-[#6B6258]">live on marketplace</span>
            </div>
          </div>

          <div class="p-4 rounded-[12px] bg-white shadow-card border border-[#F0EBE3] flex flex-col justify-between">
            <span class="text-xs font-medium text-[#6B6258]">Commission Saved</span>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-2xl font-bold text-[#7C9885]">रु ०</span>
              <span class="text-xs text-[#6B6258]">100% Direct to Tenant</span>
            </div>
          </div>

          <div class="p-4 rounded-[12px] bg-white shadow-card border border-[#F0EBE3] flex flex-col justify-between">
            <span class="text-xs font-medium text-[#6B6258]">Tenant Inquiries Channel</span>
            <div class="mt-2 flex items-center gap-3 text-[#1F1B16] text-xs font-medium">
              <span class="flex items-center gap-1 text-[#25D366]">${getIcon('message-circle', { class: 'w-3.5 h-3.5' })} WhatsApp</span>
              <span class="flex items-center gap-1 text-[#7360F2]">${getIcon('phone', { class: 'w-3.5 h-3.5' })} Viber</span>
              <span class="flex items-center gap-1 text-[#7C9885]">${getIcon('phone-call', { class: 'w-3.5 h-3.5' })} Call</span>
            </div>
          </div>
        </div>

        <!-- Listings Section -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-semibold text-[#1F1B16]">Your Properties (तपाईंका लिस्टिङहरू)</h2>
          <span class="text-xs text-[#6B6258]">Manage, edit, or remove listings</span>
        </div>

        <div id="my-listings-container" class="flex flex-col gap-3.5">
          <!-- Warm Shimmer Skeletons -->
          ${[1, 2].map(() => `
            <div class="p-4 rounded-[12px] bg-white shadow-card border border-[#F0EBE3] flex flex-col md:flex-row gap-4 items-start">
              <div class="w-full md:w-48 h-32 rounded-[8px] skeleton-shimmer shrink-0"></div>
              <div class="flex flex-col flex-1 w-full gap-2.5">
                <div class="h-4 w-3/4 skeleton-shimmer rounded-[6px]"></div>
                <div class="h-3 w-1/3 skeleton-shimmer rounded-[6px]"></div>
                <div class="h-5 w-1/2 skeleton-shimmer rounded-[6px] mt-2"></div>
                <div class="h-7 w-48 skeleton-shimmer rounded-[8px] mt-2"></div>
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
          <div class="p-4 bg-[#FDF0EC] border border-[#C1543D]/30 text-[#C1543D] rounded-[12px] text-center text-xs">
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
          <div class="p-10 text-center bg-white rounded-[12px] border border-[#F0EBE3] shadow-card">
            <div class="w-12 h-12 rounded-full bg-[#FDFBF7] border border-[#F0EBE3] flex items-center justify-center mx-auto mb-3 text-[#6B6258]">
              ${getIcon('home', { class: 'w-6 h-6' })}
            </div>
            <h3 class="text-base font-semibold text-[#1F1B16] mb-1">You have no listings posted yet</h3>
            <p class="text-sm text-[#6B6258] mb-5">Start connecting with verified tenants by listing your room, flat, shutter, or land.</p>
            <a href="#/post" class="btn-press inline-flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-[#D97757] hover:bg-[#c66849] text-white text-sm font-semibold shadow-card">
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
          <article class="card-airbnb card-stagger p-4 rounded-[12px] bg-white shadow-card border border-[#F0EBE3] flex flex-col md:flex-row gap-4 items-start" style="animation-delay: ${staggerDelay}ms;">
            <!-- Thumbnail (4:3) -->
            <a href="#/listing/${item.id}" class="relative w-full md:w-48 aspect-[4/3] rounded-[8px] overflow-hidden flex-shrink-0 bg-[#FDFBF7] block cursor-pointer">
              <img src="${photo}" class="w-full h-full object-cover" alt="${item.title}"/>
              <span class="absolute top-2 left-2 px-2.5 py-0.5 rounded-[6px] text-[10px] font-semibold shadow-card ${isActive ? 'bg-[#5B8266] text-white' : 'bg-[#6B6258] text-white'}">
                ${isActive ? '● Active' : '● Rented'}
              </span>
            </a>

            <!-- Info & Actions -->
            <div class="flex flex-col justify-between flex-1 min-w-0 w-full h-full">
              <div>
                <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5">
                  <div>
                    <div class="inline-flex items-center gap-1 text-[#7C9885] text-xs font-medium mb-1">
                      ${getIcon('map-pin', { class: 'w-3 h-3 text-[#7C9885]' })}
                      <span>${item.location_area}, ${item.location_city}</span>
                    </div>
                    <a href="#/listing/${item.id}" class="hover:text-[#D97757] transition-colors">
                      <h3 class="text-base text-[#1F1B16] font-semibold truncate">${item.title}</h3>
                    </a>
                  </div>
                  <div class="text-left sm:text-right shrink-0">
                    <span class="text-lg font-bold text-[#D97757] block">रु ${formattedPrice}</span>
                    <span class="text-[10px] text-[#6B6258]">/ month</span>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-1.5 mt-2.5 text-xs text-[#6B6258]">
                  <span class="px-2 py-0.5 rounded-[6px] bg-[#FDFBF7] border border-[#F0EBE3] text-[#1F1B16] font-medium">${item.category.toUpperCase()}</span>
                  <span class="px-2 py-0.5 rounded-[6px] bg-[#FDFBF7] border border-[#F0EBE3] text-[#1F1B16] font-medium">${item.bedrooms || 1} Bed / ${item.bathrooms || 1} Bath</span>
                  <span class="px-2 py-0.5 rounded-[6px] bg-[#FDFBF7] border border-[#F0EBE3] text-[#1F1B16] font-medium">${item.water_facility || '24/7 Water'}</span>
                  <span class="text-[#6B6258] ml-1">Phone: ${item.contact_phone}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-[#F0EBE3]">
                <a href="#/edit/${item.id}" class="btn-press inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#FDFBF7] hover:bg-[#F7F3EC] text-[#1F1B16] text-xs font-medium transition-colors border border-[#F0EBE3]">
                  ${getIcon('edit', { class: 'w-3.5 h-3.5 text-[#6B6258]' })}
                  <span>Edit</span>
                </a>

                <button type="button" class="toggle-status-btn btn-press inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-medium transition-colors ${isActive ? 'bg-[#EEF4F0] text-[#5B8266] border border-[#5B8266]/20 hover:bg-[#e0ece3]' : 'bg-[#FDFBF7] text-[#1F1B16] border border-[#F0EBE3] hover:bg-[#F7F3EC]'}" data-id="${item.id}" data-status="${item.status}">
                  ${getIcon(isActive ? 'check-circle' : 'rotate-ccw', { class: 'w-3.5 h-3.5' })}
                  <span>${isActive ? 'Mark as Rented' : 'Mark as Available'}</span>
                </button>

                <a href="#/listing/${item.id}" class="btn-press inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[8px] hover:bg-[#FDFBF7] text-[#6B6258] hover:text-[#1F1B16] text-xs font-medium transition-colors">
                  ${getIcon('eye', { class: 'w-3.5 h-3.5' })}
                  <span>View</span>
                </a>

                <button type="button" class="delete-listing-btn btn-press inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[8px] hover:bg-[#FDF0EC] text-[#C1543D] text-xs font-medium transition-colors ml-auto" data-id="${item.id}" data-title="${item.title}">
                  ${getIcon('trash-2', { class: 'w-3.5 h-3.5 text-[#C1543D]' })}
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
