import { supabase } from '../lib/supabase.js';
import { getIcon } from '../lib/icons.js';
import { t, getLanguage, formatNPR, getRelativeTime } from '../lib/i18n.js';

export const BrowseView = {
  async render(container, { queryParams }) {
    let currentCategory = queryParams.get('cat') || 'all';
    let currentQuery = queryParams.get('q') || queryParams.get('area') || '';
    let currentPrice = queryParams.get('price') || 'any';
    let currentSort = queryParams.get('sort') || 'newest';
    let currentBedrooms = queryParams.get('beds') || 'any';
    let filterDrawerOpen = false;

    function buildView() {
      const currentLang = getLanguage();

      container.innerHTML = `
        <div class="flex flex-col w-full page-transition pb-20">
          
          <!-- 1. Hero Above-The-Fold Section -->
          <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 w-full">
            
            <!-- Trust Headline Banner -->
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-5">
              <div>
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF0EC] text-[#D97757] text-xs font-bold mb-2 border border-[#D97757]/20 shadow-xs">
                  <span class="inline-block w-2 h-2 rounded-full bg-[#D97757] animate-pulse"></span>
                  <span>${t('heroTagline')}</span>
                </div>
                <h1 class="text-2xl sm:text-3xl font-bold text-[#1F1B16] tracking-tight leading-tight">
                  ${t('heroTitlePrefix')} <span class="text-[#D97757] underline decoration-[#D97757]/30 decoration-wavy underline-offset-4">${t('heroTitleSuffix')}</span>
                </h1>
              </div>
              <p class="text-xs sm:text-sm text-[#6B6258] max-w-md leading-relaxed">
                ${t('heroSubtitle')}
              </p>
            </div>

            <!-- Single-Purpose Unified Search Bar -->
            <div class="bg-white rounded-[12px] shadow-card border border-[#F0EBE3] p-2.5 sm:p-3">
              <form id="hero-search-form" class="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
                
                <!-- Location Input -->
                <div class="md:col-span-5 flex items-center gap-2.5 px-3.5 py-2.5 rounded-[8px] bg-[#FDFBF7] border border-[#F0EBE3] hover:border-[#D97757]/40 transition-colors group">
                  ${getIcon('map-pin', { class: 'w-4 h-4 text-[#D97757] shrink-0 group-focus-within:scale-110 transition-transform' })}
                  <div class="flex flex-col w-full min-w-0">
                    <label class="text-[10px] uppercase font-bold text-[#6B6258] tracking-wider" for="search-location-input">Location / टोल वा शहर</label>
                    <input id="search-location-input" class="w-full bg-transparent text-sm text-[#1F1B16] placeholder:text-[#6B6258]/60 focus:outline-none truncate font-medium" placeholder="${t('searchPlaceholder')}" type="text" value="${currentQuery}"/>
                  </div>
                </div>

                <!-- Category Select -->
                <div class="md:col-span-3 flex items-center gap-2 px-3.5 py-2.5 rounded-[8px] bg-[#FDFBF7] border border-[#F0EBE3] hover:border-[#D97757]/40 transition-colors">
                  ${getIcon('layers', { class: 'w-4 h-4 text-[#7C9885] shrink-0' })}
                  <div class="flex flex-col w-full min-w-0">
                    <label class="text-[10px] uppercase font-bold text-[#6B6258] tracking-wider" for="hero-cat-select">Category / प्रकार</label>
                    <select id="hero-cat-select" class="w-full bg-transparent text-sm text-[#1F1B16] focus:outline-none cursor-pointer font-medium">
                      <option value="all" ${currentCategory === 'all' ? 'selected' : ''}>${t('categoryAll')}</option>
                      <option value="room" ${currentCategory === 'room' ? 'selected' : ''}>${t('catRoom')}</option>
                      <option value="flat" ${currentCategory === 'flat' ? 'selected' : ''}>${t('catFlat')}</option>
                      <option value="house" ${currentCategory === 'house' ? 'selected' : ''}>${t('catHouse')}</option>
                      <option value="commercial" ${currentCategory === 'commercial' ? 'selected' : ''}>${t('catCommercial')}</option>
                      <option value="land" ${currentCategory === 'land' ? 'selected' : ''}>${t('catLand')}</option>
                      <option value="vehicle" ${currentCategory === 'vehicle' ? 'selected' : ''}>${t('catVehicle')}</option>
                    </select>
                  </div>
                </div>

                <!-- Price Range Filter -->
                <div class="md:col-span-3 flex items-center gap-2 px-3.5 py-2.5 rounded-[8px] bg-[#FDFBF7] border border-[#F0EBE3] hover:border-[#D97757]/40 transition-colors">
                  ${getIcon('sliders-horizontal', { class: 'w-4 h-4 text-[#D97757] shrink-0' })}
                  <div class="flex flex-col w-full min-w-0">
                    <label class="text-[10px] uppercase font-bold text-[#6B6258] tracking-wider" for="hero-price-select">Budget / बजेट</label>
                    <select id="hero-price-select" class="w-full bg-transparent text-sm text-[#1F1B16] focus:outline-none cursor-pointer font-medium">
                      <option value="any" ${currentPrice === 'any' ? 'selected' : ''}>${t('priceAny')}</option>
                      <option value="15000" ${currentPrice === '15000' ? 'selected' : ''}>${t('priceUpTo15k')}</option>
                      <option value="30000" ${currentPrice === '30000' ? 'selected' : ''}>${t('price15kTo30k')}</option>
                      <option value="60000" ${currentPrice === '60000' ? 'selected' : ''}>${t('price30kTo60k')}</option>
                      <option value="60000plus" ${currentPrice === '60000plus' ? 'selected' : ''}>${t('priceAbove60k')}</option>
                    </select>
                  </div>
                </div>

                <!-- Search CTA -->
                <div class="md:col-span-1 flex items-center">
                  <button type="submit" class="btn-press w-full h-11 rounded-[8px] bg-[#D97757] hover:bg-[#c66849] text-white flex items-center justify-center shadow-card font-bold min-touch-target cursor-pointer" title="${t('searchBtn')}">
                    ${getIcon('search', { class: 'w-5 h-5 text-white' })}
                  </button>
                </div>
              </form>
            </div>

            <!-- 2. Large Tappable Category Tiles -->
            <div class="mt-5">
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-3">
                ${[
                  { id: 'all', label: t('categoryAll'), sub: 'Browse All', emoji: '🔍' },
                  { id: 'room', label: t('catRoom'), sub: t('catRoomSub'), emoji: '🛏️' },
                  { id: 'flat', label: t('catFlat'), sub: t('catFlatSub'), emoji: '🏢' },
                  { id: 'house', label: t('catHouse'), sub: t('catHouseSub'), emoji: '🏠' },
                  { id: 'commercial', label: t('catCommercial'), sub: t('catCommercialSub'), emoji: '🏬' },
                  { id: 'land', label: t('catLand'), sub: t('catLandSub'), emoji: '🏞️' },
                ].map(tile => {
                  const isSelected = currentCategory === tile.id;
                  return `
                    <button type="button" class="category-tile-btn btn-press text-left p-3 sm:p-3.5 rounded-[12px] transition-all cursor-pointer border shadow-card ${isSelected ? 'bg-[#FDF0EC] border-[#D97757] ring-2 ring-[#D97757]/20' : 'bg-white border-[#F0EBE3] hover:border-[#D97757]/40 hover:bg-[#FDFBF7]'}" data-cat="${tile.id}">
                      <div class="text-2xl sm:text-3xl mb-1">${tile.emoji}</div>
                      <h4 class="text-xs sm:text-sm font-bold text-[#1F1B16] leading-tight truncate ${isSelected ? 'text-[#D97757]' : ''}">${tile.label}</h4>
                      <p class="text-[10px] text-[#6B6258] mt-0.5 truncate">${tile.sub}</p>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Quick Hot Area Chips -->
            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-4">
              <span class="text-xs font-semibold text-[#6B6258] uppercase tracking-wider flex items-center gap-1 mr-1">
                ${getIcon('flame', { class: 'w-3.5 h-3.5 text-[#D97757]' })} ${t('hotAreasLabel')}
              </span>
              ${['New Baneshwor', 'Jhamsikhel', 'Lakeside Pokhara', 'Pulchowk', 'Baluwatar', 'Koteshwor', 'Sanepa', 'Thamel'].map(area => `
                <button type="button" class="quick-area-chip btn-press px-2.5 py-1 rounded-[6px] bg-white hover:bg-[#FDFBF7] text-[#6B6258] hover:text-[#1F1B16] text-xs font-medium border border-[#F0EBE3] shadow-card transition-colors cursor-pointer" data-area="${area}">
                  ${area}
                </button>
              `).join('')}
            </div>

            <!-- 3. How It Works 3-Step Trust Section -->
            <div class="mt-6 p-4 sm:p-5 rounded-[12px] bg-white border border-[#F0EBE3] shadow-card">
              <div class="flex items-center gap-2 mb-3">
                <span class="px-2 py-0.5 rounded-[6px] bg-[#EEF4F0] text-[#5B8266] text-[11px] font-bold border border-[#5B8266]/20">
                  ${getIcon('check-circle', { class: 'w-3 h-3 text-[#5B8266]' })} Direct Tenancy
                </span>
                <h3 class="text-xs sm:text-sm font-bold text-[#1F1B16]">${t('howTitle')}</h3>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div class="flex items-start gap-2.5">
                  <div class="w-8 h-8 rounded-[8px] bg-[#FDF0EC] text-[#D97757] flex items-center justify-center font-bold text-xs shrink-0 border border-[#D97757]/20">
                    १
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-[#1F1B16]">${t('howStep1Title')}</h4>
                    <p class="text-[11px] text-[#6B6258] leading-relaxed mt-0.5">${t('howStep1Desc')}</p>
                  </div>
                </div>

                <div class="flex items-start gap-2.5">
                  <div class="w-8 h-8 rounded-[8px] bg-[#EEF4F0] text-[#5B8266] flex items-center justify-center font-bold text-xs shrink-0 border border-[#5B8266]/20">
                    २
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-[#1F1B16]">${t('howStep2Title')}</h4>
                    <p class="text-[11px] text-[#6B6258] leading-relaxed mt-0.5">${t('howStep2Desc')}</p>
                  </div>
                </div>

                <div class="flex items-start gap-2.5">
                  <div class="w-8 h-8 rounded-[8px] bg-[#FDF0EC] text-[#D97757] flex items-center justify-center font-bold text-xs shrink-0 border border-[#D97757]/20">
                    ३
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-[#1F1B16]">${t('howStep3Title')}</h4>
                    <p class="text-[11px] text-[#6B6258] leading-relaxed mt-0.5">${t('howStep3Desc')}</p>
                  </div>
                </div>
              </div>
            </div>

          </section>

          <!-- 4. Listings Results Section -->
          <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-6">
            
            <!-- Filter Bar & Sorter -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-[#F0EBE3]">
              <div>
                <h2 class="text-lg sm:text-xl font-bold text-[#1F1B16] tracking-tight">${t('featuredHeading')}</h2>
                <p id="results-count" class="text-xs text-[#6B6258] mt-0.5">
                  Loading verified rentals...
                </p>
              </div>

              <div class="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
                <!-- Mobile Filter Toggle Button -->
                <button id="toggle-filter-sheet-btn" type="button" class="btn-press sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-white border border-[#F0EBE3] shadow-card text-xs font-bold text-[#1F1B16]">
                  ${getIcon('filter', { class: 'w-3.5 h-3.5 text-[#D97757]' })}
                  <span>${t('filterBtn')}</span>
                  ${currentBedrooms !== 'any' || currentPrice !== 'any' || currentCategory !== 'all' ? `
                    <span class="w-2 h-2 rounded-full bg-[#D97757]"></span>
                  ` : ''}
                </button>

                <!-- Sorting Dropdown -->
                <div class="relative">
                  <select id="sort-dropdown" class="appearance-none pl-3 pr-7 py-1.5 bg-white rounded-[8px] text-xs font-semibold text-[#1F1B16] border border-[#F0EBE3] shadow-card focus:outline-none cursor-pointer">
                    <option value="newest" ${currentSort === 'newest' ? 'selected' : ''}>${t('sortNewest')}</option>
                    <option value="price_asc" ${currentSort === 'price_asc' ? 'selected' : ''}>${t('sortPriceAsc')}</option>
                    <option value="price_desc" ${currentSort === 'price_desc' ? 'selected' : ''}>${t('sortPriceDesc')}</option>
                  </select>
                  <span class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#6B6258]">
                    ${getIcon('chevron-down', { class: 'w-3.5 h-3.5' })}
                  </span>
                </div>
              </div>
            </div>

            <!-- Active Filter Chips (if any applied) -->
            <div id="active-filter-chips" class="flex flex-wrap items-center gap-2 mb-4 ${currentCategory === 'all' && currentPrice === 'any' && !currentQuery && currentBedrooms === 'any' ? 'hidden' : ''}">
              <span class="text-[11px] text-[#6B6258] font-medium">Active Filters:</span>
              ${currentCategory !== 'all' ? `
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FDF0EC] text-[#D97757] text-xs font-medium border border-[#D97757]/20">
                  <span>Category: ${currentCategory}</span>
                  <button type="button" class="remove-cat-filter font-bold text-[#D97757]">×</button>
                </span>
              ` : ''}
              ${currentQuery ? `
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-[#1F1B16] text-xs font-medium border border-[#F0EBE3] shadow-card">
                  <span>"${currentQuery}"</span>
                  <button type="button" class="remove-query-filter font-bold text-[#6B6258]">×</button>
                </span>
              ` : ''}
              ${currentPrice !== 'any' ? `
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-[#1F1B16] text-xs font-medium border border-[#F0EBE3] shadow-card">
                  <span>Budget Filter</span>
                  <button type="button" class="remove-price-filter font-bold text-[#6B6258]">×</button>
                </span>
              ` : ''}
              <button id="clear-all-filters-btn" type="button" class="text-xs text-[#D97757] font-bold hover:underline ml-1">
                ${t('clearFilters')}
              </button>
            </div>

            <!-- Listings Grid -->
            <div id="listings-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Skeletons rendered initially -->
              ${[1, 2, 3, 4, 5, 6].map(() => `
                <div class="bg-white rounded-[12px] border border-[#F0EBE3] overflow-hidden shadow-card">
                  <div class="aspect-[4/3] w-full skeleton-shimmer"></div>
                  <div class="p-4 flex flex-col gap-2.5">
                    <div class="h-4 w-1/3 skeleton-shimmer"></div>
                    <div class="h-5 w-3/4 skeleton-shimmer"></div>
                    <div class="h-3 w-1/2 skeleton-shimmer"></div>
                    <div class="pt-3 border-t border-[#F0EBE3] flex gap-2">
                      <div class="h-9 flex-1 skeleton-shimmer rounded-[8px]"></div>
                      <div class="h-9 flex-1 skeleton-shimmer rounded-[8px]"></div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

          </section>

          <!-- 5. Mobile Slide-Up Filter Drawer (Bottom Sheet) -->
          <div id="filter-drawer" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity duration-200 hidden flex items-end">
            <div class="w-full bg-white rounded-t-[20px] p-5 shadow-2xl border-t border-[#F0EBE3] max-h-[85vh] overflow-y-auto">
              <div class="flex items-center justify-between pb-3 border-b border-[#F0EBE3]">
                <h3 class="text-base font-bold text-[#1F1B16]">${t('filterBtn')}</h3>
                <button id="close-filter-drawer-btn" type="button" class="w-8 h-8 rounded-full bg-[#FDFBF7] flex items-center justify-center text-[#6B6258]">
                  ${getIcon('x', { class: 'w-4 h-4' })}
                </button>
              </div>

              <div class="flex flex-col gap-4 py-4">
                <div>
                  <label class="text-xs font-bold text-[#1F1B16] block mb-1.5">Property Type</label>
                  <select id="mobile-drawer-cat" class="w-full p-2.5 rounded-[8px] bg-[#FDFBF7] border border-[#F0EBE3] text-sm font-medium">
                    <option value="all">All Categories</option>
                    <option value="room" ${currentCategory === 'room' ? 'selected' : ''}>Room (कोठा)</option>
                    <option value="flat" ${currentCategory === 'flat' ? 'selected' : ''}>Flat (फ्ल्याट)</option>
                    <option value="house" ${currentCategory === 'house' ? 'selected' : ''}>House (घर)</option>
                    <option value="commercial" ${currentCategory === 'commercial' ? 'selected' : ''}>Shutter (सटर)</option>
                    <option value="land" ${currentCategory === 'land' ? 'selected' : ''}>Land (जग्गा)</option>
                  </select>
                </div>

                <div>
                  <label class="text-xs font-bold text-[#1F1B16] block mb-1.5">Budget Range</label>
                  <select id="mobile-drawer-price" class="w-full p-2.5 rounded-[8px] bg-[#FDFBF7] border border-[#F0EBE3] text-sm font-medium">
                    <option value="any">Any Budget</option>
                    <option value="15000" ${currentPrice === '15000' ? 'selected' : ''}>Up to Rs. 15,000</option>
                    <option value="30000" ${currentPrice === '30000' ? 'selected' : ''}>Rs. 15,000 - 30,000</option>
                    <option value="60000" ${currentPrice === '60000' ? 'selected' : ''}>Rs. 30,000 - 60,000</option>
                    <option value="60000plus" ${currentPrice === '60000plus' ? 'selected' : ''}>Rs. 60,000+</option>
                  </select>
                </div>

                <div>
                  <label class="text-xs font-bold text-[#1F1B16] block mb-1.5">Bedrooms</label>
                  <div class="grid grid-cols-4 gap-2">
                    ${['any', '1', '2', '3'].map(b => `
                      <button type="button" class="drawer-bed-btn btn-press py-2 rounded-[8px] text-xs font-bold border transition-colors ${currentBedrooms === b ? 'bg-[#D97757] text-white border-[#D97757]' : 'bg-[#FDFBF7] text-[#1F1B16] border-[#F0EBE3]'}" data-bed="${b}">
                        ${b === 'any' ? 'Any' : `${b} Bed`}
                      </button>
                    `).join('')}
                  </div>
                </div>

                <div class="pt-3 border-t border-[#F0EBE3] flex gap-3">
                  <button id="drawer-clear-btn" type="button" class="btn-press flex-1 py-3 rounded-[8px] bg-[#FDFBF7] text-[#6B6258] text-xs font-bold border border-[#F0EBE3]">
                    Reset
                  </button>
                  <button id="drawer-apply-btn" type="button" class="btn-press flex-1 py-3 rounded-[8px] bg-[#D97757] text-white text-xs font-bold shadow-card">
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      `;

      attachEventListeners();
      loadListings();
    }

    async function loadListings() {
      const grid = document.getElementById('listings-grid');
      const countEl = document.getElementById('results-count');
      if (!grid) return;

      // Render Skeleton
      grid.innerHTML = [1, 2, 3, 4, 5, 6].map(() => `
        <div class="bg-white rounded-[12px] border border-[#F0EBE3] overflow-hidden shadow-card">
          <div class="aspect-[4/3] w-full skeleton-shimmer"></div>
          <div class="p-4 flex flex-col gap-2.5">
            <div class="h-4 w-1/3 skeleton-shimmer"></div>
            <div class="h-5 w-3/4 skeleton-shimmer"></div>
            <div class="h-3 w-1/2 skeleton-shimmer"></div>
            <div class="pt-3 border-t border-[#F0EBE3] flex gap-2">
              <div class="h-9 flex-1 skeleton-shimmer rounded-[8px]"></div>
              <div class="h-9 flex-1 skeleton-shimmer rounded-[8px]"></div>
            </div>
          </div>
        </div>
      `).join('');

      let query = supabase.from('listings').select('*').eq('status', 'active');

      if (currentCategory && currentCategory !== 'all') {
        query = query.eq('category', currentCategory);
      }

      if (currentQuery.trim()) {
        const q = currentQuery.trim();
        query = query.or(`title.ilike.%${q}%,location_area.ilike.%${q}%,location_city.ilike.%${q}%,description.ilike.%${q}%`);
      }

      if (currentPrice === '15000') {
        query = query.lte('price', 15000);
      } else if (currentPrice === '30000') {
        query = query.gte('price', 15000).lte('price', 30000);
      } else if (currentPrice === '60000') {
        query = query.gte('price', 30000).lte('price', 60000);
      } else if (currentPrice === '60000plus') {
        query = query.gte('price', 60000);
      }

      if (currentBedrooms !== 'any') {
        query = query.eq('bedrooms', parseInt(currentBedrooms, 10));
      }

      if (currentSort === 'price_asc') {
        query = query.order('price', { ascending: true });
      } else if (currentSort === 'price_desc') {
        query = query.order('price', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data: listings, error } = await query;

      if (error) {
        grid.innerHTML = `
          <div class="col-span-full p-6 text-center bg-[#FDF0EC] border border-[#C1543D]/30 rounded-[12px] text-[#C1543D] text-xs">
            Failed to load listings: ${error.message}
          </div>
        `;
        return;
      }

      const lang = getLanguage();
      if (countEl) {
        countEl.textContent = lang === 'ne' 
          ? `${listings?.length || 0} वटा प्रमाणित घरभाडा उपलब्ध • १००% सिधा घरधनी सम्पर्क` 
          : `Showing ${listings?.length || 0} verified rentals • 100% direct landlord contact`;
      }

      if (!listings || listings.length === 0) {
        grid.innerHTML = `
          <div class="col-span-full py-16 text-center bg-white rounded-[12px] p-8 border border-dashed border-[#F0EBE3] shadow-card">
            <div class="w-14 h-14 rounded-full bg-[#FDFBF7] border border-[#F0EBE3] flex items-center justify-center mx-auto mb-3 text-[#6B6258]">
              ${getIcon('search', { class: 'w-7 h-7 text-[#D97757]' })}
            </div>
            <h3 class="text-base font-bold text-[#1F1B16] mb-1.5">${t('noResultsTitle')}</h3>
            <p class="text-xs sm:text-sm text-[#6B6258] mb-5 max-w-md mx-auto">${t('noResultsDesc')}</p>
            <button id="grid-reset-btn" type="button" class="btn-press px-5 py-2.5 rounded-[8px] bg-[#D97757] hover:bg-[#c66849] text-white text-xs font-bold shadow-card">
              ${t('resetFiltersBtn')}
            </button>
          </div>
        `;
        document.getElementById('grid-reset-btn')?.addEventListener('click', () => {
          currentCategory = 'all';
          currentQuery = '';
          currentPrice = 'any';
          currentBedrooms = 'any';
          buildView();
        });
        return;
      }

      const categoryLabels = {
        room: lang === 'ne' ? 'कोठा (Room)' : 'Single Room',
        flat: lang === 'ne' ? 'फ्ल्याट (Flat)' : 'Full Flat',
        house: lang === 'ne' ? 'घर (House)' : 'Full House',
        commercial: lang === 'ne' ? 'सटर/अफिस' : 'Shutter/Office',
        land: lang === 'ne' ? 'जग्गा (Land)' : 'Open Land',
        vehicle: lang === 'ne' ? 'सवारी' : 'Vehicle'
      };

      grid.innerHTML = listings.map((item, index) => {
        const photos = item.photos && item.photos.length > 0 ? item.photos : [];
        const photo = photos[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80';
        const photoCount = photos.length || 1;
        const formattedPrice = formatNPR(item.price, lang);
        const relativeTime = getRelativeTime(item.created_at, lang);
        const catBadge = categoryLabels[item.category] || item.category;
        const cleanPhone = (item.contact_phone || '').replace(/[^0-9]/g, '');
        const phoneWithCountry = cleanPhone.startsWith('977') ? cleanPhone : `977${cleanPhone}`;
        
        // One-tap deep links directly on the card
        const waUrl = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(`Namaste, I am interested in your listing "${item.title}" on GharBhada (ID: ${item.id.substring(0, 6)}). Is it still available?`)}`;
        const viberUrl = `viber://chat?number=%2B${phoneWithCountry}`;
        const telUrl = `tel:+${phoneWithCountry}`;
        const staggerDelay = Math.min(index * 50, 300);

        return `
          <article class="card-airbnb card-stagger group flex flex-col overflow-hidden" style="animation-delay: ${staggerDelay}ms;">
            
            <!-- 1. Dominant 4:3 Photo with Badges -->
            <a href="#/listing/${item.id}" class="relative aspect-[4/3] w-full overflow-hidden bg-[#FDFBF7] block cursor-pointer">
              <img class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" src="${photo}" alt="${item.title}" loading="lazy"/>
              
              <!-- Property Category Badge -->
              <span class="absolute top-3 left-3 px-2.5 py-1 rounded-[6px] bg-white/95 backdrop-blur-xs text-[#1F1B16] text-[11px] font-bold shadow-card border border-[#F0EBE3]">
                ${catBadge}
              </span>

              <!-- Photo Counter Badge -->
              <span class="absolute top-3 right-3 px-2 py-0.5 rounded-[6px] bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1">
                ${getIcon('camera', { class: 'w-3 h-3' })} ${photoCount}
              </span>

              <!-- Freshness Tag -->
              <span class="absolute bottom-3 left-3 px-2 py-0.5 rounded-[6px] bg-white/90 text-[#6B6258] text-[10px] font-medium shadow-card flex items-center gap-1">
                ${getIcon('clock', { class: 'w-3 h-3 text-[#D97757]' })} ${relativeTime}
              </span>
            </a>

            <!-- 2. Card Content -->
            <div class="p-4 flex flex-col flex-grow justify-between gap-3">
              <div>
                
                <!-- Price Callout (Second-Most Prominent) -->
                <div class="flex items-baseline justify-between gap-2">
                  <div class="flex items-baseline gap-1">
                    <span class="text-xl font-bold text-[#D97757]">${formattedPrice}</span>
                    <span class="text-xs text-[#6B6258] font-medium">${t('perMonth')}</span>
                  </div>
                  ${item.is_negotiable ? `
                    <span class="text-[11px] text-[#7C9885] font-semibold px-2 py-0.5 rounded-[4px] bg-[#FDFBF7] border border-[#7C9885]/20">
                      ${t('negotiable')}
                    </span>
                  ` : ''}
                </div>

                <!-- Title -->
                <a href="#/listing/${item.id}" class="block group-hover:text-[#D97757] transition-colors cursor-pointer mt-1.5">
                  <h3 class="text-sm font-semibold text-[#1F1B16] line-clamp-1 leading-snug">
                    ${item.title}
                  </h3>
                </a>

                <!-- Location -->
                <p class="text-xs text-[#6B6258] flex items-center gap-1 mt-1">
                  ${getIcon('map-pin', { class: 'w-3.5 h-3.5 text-[#D97757] shrink-0' })}
                  <span class="truncate font-medium">${item.location_area}, ${item.location_city}</span>
                </p>

                <!-- Compact Spec Chips with Icons -->
                <div class="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-[#EEF4F0] text-[#5B8266] text-[11px] font-semibold border border-[#5B8266]/20">
                    ${getIcon('shield-check', { class: 'w-3 h-3 text-[#5B8266]' })} ${t('verifiedLandlord')}
                  </span>
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-[#FDFBF7] text-[#1F1B16] text-[11px] font-medium border border-[#F0EBE3]">
                    ${getIcon('bed', { class: 'w-3 h-3 text-[#D97757]' })} ${item.bedrooms || 1} Bed
                  </span>
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-[#FDFBF7] text-[#1F1B16] text-[11px] font-medium border border-[#F0EBE3]">
                    ${getIcon('droplet', { class: 'w-3 h-3 text-[#7C9885]' })} ${item.water_facility || '24/7 Water'}
                  </span>
                </div>
              </div>

              <!-- 3. One-Tap Direct Contact Action Bar on the Card -->
              <div class="pt-3 border-t border-[#F0EBE3] flex items-center gap-2">
                <!-- WhatsApp -->
                <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-press flex-1 inline-flex items-center justify-center gap-1 py-2 px-2 rounded-[8px] bg-white hover:bg-[#FDFBF7] text-[#25D366] text-xs font-bold border border-[#F0EBE3] shadow-card transition-colors" title="Chat on WhatsApp">
                  ${getIcon('message-circle', { class: 'w-3.5 h-3.5 text-[#25D366]' })}
                  <span class="text-[11px]">${t('chatWhatsApp')}</span>
                </a>

                <!-- Viber -->
                <a href="${viberUrl}" class="btn-press inline-flex items-center justify-center p-2 rounded-[8px] bg-white hover:bg-[#FDFBF7] text-[#7360F2] text-xs font-bold border border-[#F0EBE3] shadow-card transition-colors" title="Connect on Viber">
                  ${getIcon('phone', { class: 'w-3.5 h-3.5 text-[#7360F2]' })}
                </a>

                <!-- Phone Call -->
                <a href="${telUrl}" class="btn-press flex-1 inline-flex items-center justify-center gap-1 py-2 px-2 rounded-[8px] bg-[#D97757] hover:bg-[#c66849] text-white text-xs font-bold shadow-card transition-colors" title="Direct Phone Call">
                  ${getIcon('phone-call', { class: 'w-3.5 h-3.5 text-white' })}
                  <span class="text-[11px]">${t('callNow')}</span>
                </a>
              </div>

            </div>
          </article>
        `;
      }).join('');
    }

    function attachEventListeners() {
      // Search form
      document.getElementById('hero-search-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        currentQuery = document.getElementById('search-location-input')?.value || '';
        currentCategory = document.getElementById('hero-cat-select')?.value || 'all';
        currentPrice = document.getElementById('hero-price-select')?.value || 'any';
        buildView();
      });

      // Category select in hero
      document.getElementById('hero-cat-select')?.addEventListener('change', (e) => {
        currentCategory = e.target.value;
        buildView();
      });

      // Price select in hero
      document.getElementById('hero-price-select')?.addEventListener('change', (e) => {
        currentPrice = e.target.value;
        buildView();
      });

      // Category Tiles
      document.querySelectorAll('.category-tile-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          currentCategory = btn.getAttribute('data-cat');
          buildView();
        });
      });

      // Quick Area Chips
      document.querySelectorAll('.quick-area-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          currentQuery = chip.getAttribute('data-area');
          buildView();
        });
      });

      // Sort dropdown
      document.getElementById('sort-dropdown')?.addEventListener('change', (e) => {
        currentSort = e.target.value;
        loadListings();
      });

      // Remove active chips
      document.querySelector('.remove-cat-filter')?.addEventListener('click', () => {
        currentCategory = 'all';
        buildView();
      });
      document.querySelector('.remove-query-filter')?.addEventListener('click', () => {
        currentQuery = '';
        buildView();
      });
      document.querySelector('.remove-price-filter')?.addEventListener('click', () => {
        currentPrice = 'any';
        buildView();
      });
      document.getElementById('clear-all-filters-btn')?.addEventListener('click', () => {
        currentCategory = 'all';
        currentQuery = '';
        currentPrice = 'any';
        currentBedrooms = 'any';
        buildView();
      });

      // Mobile filter drawer
      const filterDrawer = document.getElementById('filter-drawer');
      document.getElementById('toggle-filter-sheet-btn')?.addEventListener('click', () => {
        filterDrawer?.classList.remove('hidden');
      });
      document.getElementById('close-filter-drawer-btn')?.addEventListener('click', () => {
        filterDrawer?.classList.add('hidden');
      });

      // Drawer bedroom buttons
      document.querySelectorAll('.drawer-bed-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.drawer-bed-btn').forEach(b => {
            b.classList.remove('bg-[#D97757]', 'text-white', 'border-[#D97757]');
            b.classList.add('bg-[#FDFBF7]', 'text-[#1F1B16]', 'border-[#F0EBE3]');
          });
          btn.classList.add('bg-[#D97757]', 'text-white', 'border-[#D97757]');
          btn.classList.remove('bg-[#FDFBF7]', 'text-[#1F1B16]', 'border-[#F0EBE3]');
          currentBedrooms = btn.getAttribute('data-bed');
        });
      });

      document.getElementById('drawer-apply-btn')?.addEventListener('click', () => {
        currentCategory = document.getElementById('mobile-drawer-cat')?.value || 'all';
        currentPrice = document.getElementById('mobile-drawer-price')?.value || 'any';
        filterDrawer?.classList.add('hidden');
        buildView();
      });

      document.getElementById('drawer-clear-btn')?.addEventListener('click', () => {
        currentCategory = 'all';
        currentPrice = 'any';
        currentBedrooms = 'any';
        filterDrawer?.classList.add('hidden');
        buildView();
      });
    }

    // Language change listener to re-render dynamically
    const langHandler = () => {
      buildView();
    };
    window.addEventListener('gharbhada:languageChange', langHandler);

    buildView();
  }
};
