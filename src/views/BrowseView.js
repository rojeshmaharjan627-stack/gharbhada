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

    // Local saved/favorite listings state (saved in localStorage for persistence)
    let savedListings = new Set(JSON.parse(localStorage.getItem('gharbhada_saved') || '[]'));

    function buildView() {
      const currentLang = getLanguage();

      container.innerHTML = `
        <div class="flex flex-col w-full page-transition pb-24">
          
          <!-- 1. Hero Section with Modern Background Gradient -->
          <section class="relative bg-gradient-to-b from-slate-100/70 via-white to-transparent pt-8 pb-4 w-full border-b border-slate-200/40">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <!-- Trust Headline Banner -->
              <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                  <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-[#F04D36] text-xs font-bold mb-3 border border-orange-200/80 shadow-xs">
                    <span class="relative flex h-2 w-2">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F04D36] opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-[#F04D36]"></span>
                    </span>
                    <span>${t('heroTagline')}</span>
                  </div>
                  <h1 class="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    ${t('heroTitlePrefix')} <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#F04D36] to-[#FB923C]">${t('heroTitleSuffix')}</span>
                  </h1>
                </div>
                <p class="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed font-normal">
                  ${t('heroSubtitle')}
                </p>
              </div>

              <!-- Unified Floating Search Bar -->
              <div class="bg-white rounded-2xl shadow-floating border border-slate-200/80 p-2 sm:p-2.5 transition-all">
                <form id="hero-search-form" class="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
                  
                  <!-- Location Input -->
                  <div class="md:col-span-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 focus-within:border-[#F04D36] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#F04D36]/10 transition-all group">
                    <div class="w-8 h-8 rounded-lg bg-orange-100/70 text-[#F04D36] flex items-center justify-center shrink-0">
                      ${getIcon('map-pin', { class: 'w-4 h-4' })}
                    </div>
                    <div class="flex flex-col w-full min-w-0">
                      <label class="text-[10px] uppercase font-bold text-slate-400 tracking-wider" for="search-location-input">Location / टोल वा शहर</label>
                      <input id="search-location-input" class="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none truncate font-semibold" placeholder="${t('searchPlaceholder')}" type="text" value="${currentQuery}"/>
                    </div>
                  </div>

                  <!-- Category Select -->
                  <div class="md:col-span-3 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 focus-within:border-[#F04D36] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#F04D36]/10 transition-all">
                    <div class="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-600 flex items-center justify-center shrink-0">
                      ${getIcon('layers', { class: 'w-4 h-4' })}
                    </div>
                    <div class="flex flex-col w-full min-w-0">
                      <label class="text-[10px] uppercase font-bold text-slate-400 tracking-wider" for="hero-cat-select">Category / प्रकार</label>
                      <select id="hero-cat-select" class="w-full bg-transparent text-sm text-slate-900 focus:outline-none cursor-pointer font-semibold">
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
                  <div class="md:col-span-3 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 focus-within:border-[#F04D36] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#F04D36]/10 transition-all">
                    <div class="w-8 h-8 rounded-lg bg-indigo-100/70 text-indigo-600 flex items-center justify-center shrink-0">
                      ${getIcon('sliders-horizontal', { class: 'w-4 h-4' })}
                    </div>
                    <div class="flex flex-col w-full min-w-0">
                      <label class="text-[10px] uppercase font-bold text-slate-400 tracking-wider" for="hero-price-select">Budget / बजेट</label>
                      <select id="hero-price-select" class="w-full bg-transparent text-sm text-slate-900 focus:outline-none cursor-pointer font-semibold">
                        <option value="any" ${currentPrice === 'any' ? 'selected' : ''}>${t('priceAny')}</option>
                        <option value="15000" ${currentPrice === '15000' ? 'selected' : ''}>${t('priceUpTo15k')}</option>
                        <option value="30000" ${currentPrice === '30000' ? 'selected' : ''}>${t('price15kTo30k')}</option>
                        <option value="60000" ${currentPrice === '60000' ? 'selected' : ''}>${t('price30kTo60k')}</option>
                        <option value="60000plus" ${currentPrice === '60000plus' ? 'selected' : ''}>${t('priceAbove60k')}</option>
                      </select>
                    </div>
                  </div>

                  <!-- Search CTA Button -->
                  <div class="md:col-span-1 flex items-center">
                    <button type="submit" class="btn-modern w-full h-[52px] rounded-xl bg-gradient-to-r from-[#F04D36] to-[#E03A22] hover:from-[#E03A22] hover:to-[#C82B15] text-white flex items-center justify-center shadow-md hover:shadow-glow font-bold min-touch-target cursor-pointer" title="${t('searchBtn')}">
                      ${getIcon('search', { class: 'w-5 h-5 text-white' })}
                    </button>
                  </div>
                </form>
              </div>

              <!-- 2. Modern Vector-Icon Category Tiles (No raw emojis) -->
              <div class="mt-6">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  ${[
                    { id: 'all', label: t('categoryAll'), sub: 'Browse All', icon: 'compass', bg: 'bg-slate-100', color: 'text-slate-700' },
                    { id: 'room', label: t('catRoom'), sub: t('catRoomSub'), icon: 'bed', bg: 'bg-orange-50', color: 'text-[#F04D36]' },
                    { id: 'flat', label: t('catFlat'), sub: t('catFlatSub'), icon: 'building-2', bg: 'bg-indigo-50', color: 'text-indigo-600' },
                    { id: 'house', label: t('catHouse'), sub: t('catHouseSub'), icon: 'home', bg: 'bg-emerald-50', color: 'text-emerald-600' },
                    { id: 'commercial', label: t('catCommercial'), sub: t('catCommercialSub'), icon: 'store', bg: 'bg-amber-50', color: 'text-amber-600' },
                    { id: 'land', label: t('catLand'), sub: t('catLandSub'), icon: 'trees', bg: 'bg-teal-50', color: 'text-teal-600' },
                  ].map(tile => {
                    const isSelected = currentCategory === tile.id;
                    return `
                      <button type="button" class="category-tile-btn btn-press text-left p-3.5 rounded-2xl transition-all cursor-pointer border ${isSelected ? 'bg-white border-[#F04D36] ring-2 ring-[#F04D36]/20 shadow-md -translate-y-0.5' : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-card hover:-translate-y-0.5'}" data-cat="${tile.id}">
                        <div class="w-10 h-10 rounded-xl ${tile.bg} ${tile.color} flex items-center justify-center mb-2 shadow-2xs">
                          ${getIcon(tile.icon, { class: 'w-5 h-5' })}
                        </div>
                        <h4 class="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate ${isSelected ? 'text-[#F04D36]' : ''}">${tile.label}</h4>
                        <p class="text-[11px] text-slate-400 mt-0.5 truncate">${tile.sub}</p>
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>

              <!-- Quick Hot Area Chips -->
              <div class="flex flex-wrap items-center gap-2 mt-5">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mr-1">
                  ${getIcon('flame', { class: 'w-3.5 h-3.5 text-[#F04D36]' })} ${t('hotAreasLabel')}
                </span>
                ${['New Baneshwor', 'Jhamsikhel', 'Lakeside Pokhara', 'Pulchowk', 'Baluwatar', 'Koteshwor', 'Sanepa', 'Thamel'].map(area => `
                  <button type="button" class="quick-area-chip btn-press px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-medium border border-slate-200 shadow-2xs transition-all cursor-pointer hover:shadow-xs" data-area="${area}">
                    ${area}
                  </button>
                `).join('')}
              </div>

              <!-- 3. How It Works 3-Step Trust Section -->
              <div class="mt-6 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-card">
                <div class="flex items-center gap-2 mb-3.5">
                  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/80">
                    ${getIcon('check-circle', { class: 'w-3 h-3 text-emerald-600' })} Direct Tenancy
                  </span>
                  <h3 class="text-xs sm:text-sm font-bold text-slate-900">${t('howTitle')}</h3>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-xl bg-orange-50 text-[#F04D36] flex items-center justify-center font-extrabold text-xs shrink-0 border border-orange-200/80">
                      १
                    </div>
                    <div>
                      <h4 class="text-xs font-bold text-slate-900">${t('howStep1Title')}</h4>
                      <p class="text-[11px] text-slate-500 leading-relaxed mt-0.5">${t('howStep1Desc')}</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-extrabold text-xs shrink-0 border border-emerald-200/80">
                      २
                    </div>
                    <div>
                      <h4 class="text-xs font-bold text-slate-900">${t('howStep2Title')}</h4>
                      <p class="text-[11px] text-slate-500 leading-relaxed mt-0.5">${t('howStep2Desc')}</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-extrabold text-xs shrink-0 border border-indigo-200/80">
                      ३
                    </div>
                    <div>
                      <h4 class="text-xs font-bold text-slate-900">${t('howStep3Title')}</h4>
                      <p class="text-[11px] text-slate-500 leading-relaxed mt-0.5">${t('howStep3Desc')}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          <!-- 4. Listings Results Section -->
          <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8">
            
            <!-- Filter Bar & Sorter -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80">
              <div>
                <h2 class="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">${t('featuredHeading')}</h2>
                <p id="results-count" class="text-xs text-slate-500 mt-1">
                  Loading verified rentals...
                </p>
              </div>

              <div class="flex items-center gap-2.5 self-stretch sm:self-auto justify-between sm:justify-end">
                <!-- Mobile Filter Toggle Button -->
                <button id="toggle-filter-sheet-btn" type="button" class="btn-press sm:hidden inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-xs text-xs font-bold text-slate-800">
                  ${getIcon('filter', { class: 'w-3.5 h-3.5 text-[#F04D36]' })}
                  <span>${t('filterBtn')}</span>
                  ${currentBedrooms !== 'any' || currentPrice !== 'any' || currentCategory !== 'all' ? `
                    <span class="w-2 h-2 rounded-full bg-[#F04D36]"></span>
                  ` : ''}
                </button>

                <!-- Sorting Dropdown -->
                <div class="relative">
                  <select id="sort-dropdown" class="appearance-none pl-3.5 pr-8 py-2 bg-white rounded-xl text-xs font-bold text-slate-800 border border-slate-200 shadow-xs focus:outline-none cursor-pointer hover:border-slate-300 transition-colors">
                    <option value="newest" ${currentSort === 'newest' ? 'selected' : ''}>${t('sortNewest')}</option>
                    <option value="price_asc" ${currentSort === 'price_asc' ? 'selected' : ''}>${t('sortPriceAsc')}</option>
                    <option value="price_desc" ${currentSort === 'price_desc' ? 'selected' : ''}>${t('sortPriceDesc')}</option>
                  </select>
                  <span class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                    ${getIcon('chevron-down', { class: 'w-3.5 h-3.5' })}
                  </span>
                </div>
              </div>
            </div>

            <!-- Active Filter Chips (if any applied) -->
            <div id="active-filter-chips" class="flex flex-wrap items-center gap-2 mb-5 ${currentCategory === 'all' && currentPrice === 'any' && !currentQuery && currentBedrooms === 'any' ? 'hidden' : ''}">
              <span class="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Active:</span>
              ${currentCategory !== 'all' ? `
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#F04D36] text-xs font-semibold border border-orange-200/80">
                  <span>Category: ${currentCategory}</span>
                  <button type="button" class="remove-cat-filter font-bold hover:opacity-75 cursor-pointer">×</button>
                </span>
              ` : ''}
              ${currentQuery ? `
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-800 text-xs font-semibold border border-slate-200 shadow-xs">
                  <span>"${currentQuery}"</span>
                  <button type="button" class="remove-query-filter font-bold text-slate-400 hover:text-slate-600 cursor-pointer">×</button>
                </span>
              ` : ''}
              ${currentPrice !== 'any' ? `
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-800 text-xs font-semibold border border-slate-200 shadow-xs">
                  <span>Budget Filter</span>
                  <button type="button" class="remove-price-filter font-bold text-slate-400 hover:text-slate-600 cursor-pointer">×</button>
                </span>
              ` : ''}
              <button id="clear-all-filters-btn" type="button" class="text-xs text-[#F04D36] font-bold hover:underline ml-1 cursor-pointer">
                ${t('clearFilters')}
              </button>
            </div>

            <!-- Listings Grid -->
            <div id="listings-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              <!-- Skeletons rendered initially -->
              ${[1, 2, 3, 4, 5, 6].map(() => `
                <div class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-card">
                  <div class="aspect-[4/3] w-full skeleton-shimmer"></div>
                  <div class="p-5 flex flex-col gap-3">
                    <div class="h-4 w-1/3 skeleton-shimmer"></div>
                    <div class="h-5 w-3/4 skeleton-shimmer"></div>
                    <div class="h-3 w-1/2 skeleton-shimmer"></div>
                    <div class="pt-3 border-t border-slate-100 flex gap-2">
                      <div class="h-9 flex-1 skeleton-shimmer rounded-xl"></div>
                      <div class="h-9 flex-1 skeleton-shimmer rounded-xl"></div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

          </section>

          <!-- 5. Mobile Slide-Up Filter Drawer (Bottom Sheet) -->
          <div id="filter-drawer" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200 hidden flex items-end">
            <div class="w-full bg-white rounded-t-3xl p-6 shadow-2xl border-t border-slate-200 max-h-[85vh] overflow-y-auto">
              <div class="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 class="text-base font-bold text-slate-900">${t('filterBtn')}</h3>
                <button id="close-filter-drawer-btn" type="button" class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer">
                  ${getIcon('x', { class: 'w-4 h-4' })}
                </button>
              </div>

              <div class="flex flex-col gap-5 py-5">
                <div>
                  <label class="text-xs font-bold text-slate-700 block mb-2">Property Type</label>
                  <select id="mobile-drawer-cat" class="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold">
                    <option value="all">All Categories</option>
                    <option value="room" ${currentCategory === 'room' ? 'selected' : ''}>Room (कोठा)</option>
                    <option value="flat" ${currentCategory === 'flat' ? 'selected' : ''}>Flat (फ्ल्याट)</option>
                    <option value="house" ${currentCategory === 'house' ? 'selected' : ''}>House (घर)</option>
                    <option value="commercial" ${currentCategory === 'commercial' ? 'selected' : ''}>Shutter (सटर)</option>
                    <option value="land" ${currentCategory === 'land' ? 'selected' : ''}>Land (जग्गा)</option>
                  </select>
                </div>

                <div>
                  <label class="text-xs font-bold text-slate-700 block mb-2">Budget Range</label>
                  <select id="mobile-drawer-price" class="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold">
                    <option value="any">Any Budget</option>
                    <option value="15000" ${currentPrice === '15000' ? 'selected' : ''}>Up to Rs. 15,000</option>
                    <option value="30000" ${currentPrice === '30000' ? 'selected' : ''}>Rs. 15,000 - 30,000</option>
                    <option value="60000" ${currentPrice === '60000' ? 'selected' : ''}>Rs. 30,000 - 60,000</option>
                    <option value="60000plus" ${currentPrice === '60000plus' ? 'selected' : ''}>Rs. 60,000+</option>
                  </select>
                </div>

                <div>
                  <label class="text-xs font-bold text-slate-700 block mb-2">Bedrooms</label>
                  <div class="grid grid-cols-4 gap-2">
                    ${['any', '1', '2', '3'].map(b => `
                      <button type="button" class="drawer-bed-btn btn-press py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${currentBedrooms === b ? 'bg-[#F04D36] text-white border-[#F04D36]' : 'bg-slate-50 text-slate-700 border-slate-200'}" data-bed="${b}">
                        ${b === 'any' ? 'Any' : `${b} Bed`}
                      </button>
                    `).join('')}
                  </div>
                </div>

                <div class="pt-4 border-t border-slate-100 flex gap-3">
                  <button id="drawer-clear-btn" type="button" class="btn-press flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs cursor-pointer">Reset</button>
                  <button id="drawer-apply-btn" type="button" class="btn-press flex-1 py-3 rounded-xl bg-[#F04D36] text-white font-bold text-xs cursor-pointer shadow-md">Apply Filters</button>
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
          <div class="col-span-full p-6 text-center bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs">
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
          <div class="col-span-full py-16 text-center bg-white rounded-2xl p-8 border border-dashed border-slate-200 shadow-card">
            <div class="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto mb-3 text-[#F04D36]">
              ${getIcon('search', { class: 'w-7 h-7' })}
            </div>
            <h3 class="text-base font-bold text-slate-900 mb-1.5">${t('noResultsTitle')}</h3>
            <p class="text-xs sm:text-sm text-slate-500 mb-6 max-w-md mx-auto">${t('noResultsDesc')}</p>
            <button id="grid-reset-btn" type="button" class="btn-modern px-6 py-2.5 rounded-xl bg-[#F04D36] text-white text-xs font-bold shadow-md cursor-pointer">
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

      grid.innerHTML = listings.map((item) => {
        const photos = item.photos && item.photos.length > 0 ? item.photos : [];
        const photo = photos[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80';
        const photoCount = photos.length || 1;
        const formattedPrice = formatNPR(item.price, lang);
        const relativeTime = getRelativeTime(item.created_at, lang);
        const catBadge = categoryLabels[item.category] || item.category;
        const cleanPhone = (item.contact_phone || '').replace(/[^0-9]/g, '');
        const phoneWithCountry = cleanPhone.startsWith('977') ? cleanPhone : `977${cleanPhone}`;
        const isSaved = savedListings.has(item.id);
        
        // Deep links directly on card
        const waUrl = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(`Namaste, I am interested in your listing "${item.title}" on GharBhada (ID: ${item.id.substring(0, 6)}). Is it still available?`)}`;
        const viberUrl = `viber://chat?number=%2B${phoneWithCountry}`;
        const telUrl = `tel:+${phoneWithCountry}`;

        return `
          <article class="card-modern group flex flex-col overflow-hidden bg-white">
            
            <!-- 1. Dominant 4:3 Photo with Badges & Interactive Heart -->
            <div class="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 block">
              <a href="#/listing/${item.id}" class="w-full h-full block">
                <img class="w-full h-full object-cover img-zoom" src="${photo}" alt="${item.title}" loading="lazy"/>
              </a>
              
              <!-- Property Category Badge (Frosted glass) -->
              <span class="glass-pill absolute top-3 left-3 px-3 py-1 rounded-full text-slate-900 text-[11px] font-bold border border-white/80">
                ${catBadge}
              </span>

              <!-- Favorite / Heart Save Button -->
              <button type="button" class="favorite-toggle-btn heart-pop absolute top-3 right-3 w-8 h-8 rounded-full glass-pill flex items-center justify-center transition-transform shadow-xs cursor-pointer z-10 ${isSaved ? 'text-[#F04D36]' : 'text-slate-600 hover:text-[#F04D36]'}" data-id="${item.id}" aria-label="Save listing">
                ${getIcon('heart', { class: `w-4 h-4 ${isSaved ? 'fill-[#F04D36]' : ''}` })}
              </button>

              <!-- Photo Counter Badge -->
              <span class="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full bg-slate-900/60 backdrop-blur-xs text-white text-[10px] font-semibold flex items-center gap-1">
                ${getIcon('camera', { class: 'w-3 h-3' })} ${photoCount}
              </span>

              <!-- Freshness Tag -->
              <span class="glass-pill absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full text-slate-600 text-[10px] font-medium flex items-center gap-1 border border-white/80">
                ${getIcon('clock', { class: 'w-3 h-3 text-[#F04D36]' })} ${relativeTime}
              </span>
            </div>

            <!-- 2. Card Content -->
            <div class="p-5 flex flex-col flex-grow justify-between gap-4">
              <div>
                
                <!-- Price Callout & Negotiable Tag -->
                <div class="flex items-baseline justify-between gap-2">
                  <div class="flex items-baseline gap-1">
                    <span class="text-2xl font-extrabold text-[#F04D36] tracking-tight">${formattedPrice}</span>
                    <span class="text-xs text-slate-400 font-semibold">${t('perMonth')}</span>
                  </div>
                  ${item.is_negotiable ? `
                    <span class="text-[11px] text-emerald-700 font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80">
                      ${t('negotiable')}
                    </span>
                  ` : ''}
                </div>

                <!-- Title -->
                <a href="#/listing/${item.id}" class="block group-hover:text-[#F04D36] transition-colors cursor-pointer mt-2">
                  <h3 class="text-base font-bold text-slate-900 line-clamp-1 leading-snug">
                    ${item.title}
                  </h3>
                </a>

                <!-- Location -->
                <p class="text-xs text-slate-500 flex items-center gap-1.5 mt-1.5">
                  ${getIcon('map-pin', { class: 'w-3.5 h-3.5 text-[#F04D36] shrink-0' })}
                  <span class="truncate font-medium">${item.location_area}, ${item.location_city}</span>
                </p>

                <!-- Compact Spec Chips with Modern Icons -->
                <div class="flex flex-wrap items-center gap-2 mt-3.5">
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200/60">
                    ${getIcon('shield-check', { class: 'w-3 h-3 text-emerald-600' })} ${t('verifiedLandlord')}
                  </span>
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 text-[11px] font-semibold border border-slate-200/80">
                    ${getIcon('bed', { class: 'w-3 h-3 text-[#F04D36]' })} ${item.bedrooms || 1} Bed
                  </span>
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 text-[11px] font-semibold border border-slate-200/80">
                    ${getIcon('droplet', { class: 'w-3 h-3 text-teal-600' })} ${item.water_facility || '24/7 Water'}
                  </span>
                </div>
              </div>

              <!-- 3. Direct Contact Action Bar on the Card -->
              <div class="pt-4 border-t border-slate-100 flex items-center gap-2">
                <!-- WhatsApp -->
                <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-press flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200/80 shadow-2xs transition-all" title="Chat on WhatsApp">
                  ${getIcon('message-circle', { class: 'w-3.5 h-3.5 text-emerald-600' })}
                  <span class="text-[11px]">${t('chatWhatsApp')}</span>
                </a>

                <!-- Viber -->
                <a href="${viberUrl}" class="btn-press inline-flex items-center justify-center p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/80 shadow-2xs transition-all" title="Connect on Viber">
                  ${getIcon('phone', { class: 'w-3.5 h-3.5 text-purple-600' })}
                </a>

                <!-- Direct Phone Call -->
                <a href="${telUrl}" class="btn-modern flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-gradient-to-r from-[#F04D36] to-[#E03A22] hover:from-[#E03A22] hover:to-[#C82B15] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all" title="Direct Phone Call">
                  ${getIcon('phone-call', { class: 'w-3.5 h-3.5 text-white' })}
                  <span class="text-[11px]">${t('callNow')}</span>
                </a>
              </div>

            </div>
          </article>
        `;
      }).join('');

      // Attach heart favorite toggle listeners
      document.querySelectorAll('.favorite-toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          if (savedListings.has(id)) {
            savedListings.delete(id);
            btn.classList.remove('text-[#F04D36]');
            btn.classList.add('text-slate-600');
            const svg = btn.querySelector('svg');
            if (svg) svg.classList.remove('fill-[#F04D36]');
          } else {
            savedListings.add(id);
            btn.classList.add('text-[#F04D36]');
            btn.classList.remove('text-slate-600');
            const svg = btn.querySelector('svg');
            if (svg) svg.classList.add('fill-[#F04D36]');
          }
          localStorage.setItem('gharbhada_saved', JSON.stringify(Array.from(savedListings)));
        });
      });
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
            b.classList.remove('bg-[#F04D36]', 'text-white', 'border-[#F04D36]');
            b.classList.add('bg-slate-50', 'text-slate-700', 'border-slate-200');
          });
          btn.classList.add('bg-[#F04D36]', 'text-white', 'border-[#F04D36]');
          btn.classList.remove('bg-slate-50', 'text-slate-700', 'border-slate-200');
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
