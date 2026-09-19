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
          
          <!-- 1. Hero Section (Housing.com Style) -->
          <section class="relative bg-gradient-to-b from-slate-50 via-white to-slate-50/50 pt-8 pb-8 w-full border-b border-slate-200/70">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <!-- Trust Tagline & Confident Headline -->
              <div class="text-center max-w-3xl mx-auto mb-6">
                <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] text-[#1E40AF] text-xs font-bold mb-3 border border-[#DBEAFE] shadow-2xs">
                  <span class="relative flex h-2 w-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1E40AF] opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-[#1E40AF]"></span>
                  </span>
                  <span>${currentLang === 'ne' ? 'नेपालको पहिलो ०% दलाली भाडा बजार' : "Nepal's Direct Rental Marketplace • 0% Broker Commission"}</span>
                </div>
                <h1 class="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  ${currentLang === 'ne' 
                    ? 'सिधै घरधनीसँग भाडामा लिनुहोस्। <span class="text-[#1E40AF]">बिचौलिया बिना।</span>' 
                    : 'Find Direct Rentals in Nepal. <span class="text-[#1E40AF]">Zero Brokerage.</span>'}
                </h1>
                <p class="text-xs sm:text-base text-slate-500 mt-2.5 leading-relaxed font-medium max-w-2xl mx-auto">
                  ${currentLang === 'ne'
                    ? 'काठमाडौँ, ललितपुर, पोखरा लगायतका शहरहरूमा कोठा, फ्ल्याट र सटर सिधै घरधनीसँग सम्पर्क गरी भाडामा लिनुहोस्।'
                    : 'Connect directly with verified landlords via Call, WhatsApp & Viber with 100% zero middleman fees.'}
                </p>
              </div>

              <!-- Commanding Unified Floating Search Bar -->
              <div class="bg-white rounded-2xl shadow-floating border border-slate-200/80 p-2 sm:p-3 max-w-5xl mx-auto transition-all">
                <form id="hero-search-form" class="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
                  
                  <!-- Location Input -->
                  <div class="md:col-span-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 focus-within:border-[#1E40AF] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1E40AF]/15 transition-all">
                    <div class="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#1E40AF] flex items-center justify-center shrink-0">
                      ${getIcon('map-pin', { class: 'w-4 h-4' })}
                    </div>
                    <div class="flex flex-col w-full min-w-0">
                      <label class="text-[10px] uppercase font-bold text-slate-400 tracking-wider" for="search-location-input">Location / टोल वा शहर</label>
                      <input id="search-location-input" class="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none truncate font-semibold" placeholder="${t('searchPlaceholder')}" type="text" value="${currentQuery}"/>
                    </div>
                  </div>

                  <!-- Category Select -->
                  <div class="md:col-span-3 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 focus-within:border-[#1E40AF] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1E40AF]/15 transition-all">
                    <div class="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#1E40AF] flex items-center justify-center shrink-0">
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

                  <!-- Budget Range Filter -->
                  <div class="md:col-span-3 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 focus-within:border-[#1E40AF] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1E40AF]/15 transition-all">
                    <div class="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#1E40AF] flex items-center justify-center shrink-0">
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
                    <button type="submit" class="btn-brand w-full h-[52px] rounded-xl flex items-center justify-center shadow-xs font-bold min-touch-target cursor-pointer" title="${t('searchBtn')}">
                      ${getIcon('search', { class: 'w-5 h-5 text-white' })}
                    </button>
                  </div>
                </form>
              </div>

              <!-- 2. Housing.com-Style Prominent Trust Stat Banner -->
              <div class="mt-6 max-w-5xl mx-auto py-3.5 px-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
                <div class="pt-2 md:pt-0">
                  <div class="text-xl sm:text-2xl font-extrabold text-[#1E40AF]">१,२५०+</div>
                  <div class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Verified Rentals Live</div>
                </div>
                <div class="pt-2 md:pt-0">
                  <div class="text-xl sm:text-2xl font-extrabold text-slate-900">८५०+</div>
                  <div class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Direct Landlords</div>
                </div>
                <div class="pt-2 md:pt-0">
                  <div class="text-xl sm:text-2xl font-extrabold text-emerald-600">०%</div>
                  <div class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Zero Broker Fees</div>
                </div>
                <div class="pt-2 md:pt-0">
                  <div class="text-xl sm:text-2xl font-extrabold text-[#1E40AF]">रु २.५ करोड+</div>
                  <div class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Tenant Savings</div>
                </div>
              </div>

              <!-- 3. Horizontal Scrolling Row of Property-Type Tiles (Large Tap Targets) -->
              <div class="mt-6 max-w-5xl mx-auto overflow-x-auto no-scrollbar pb-2">
                <div class="flex items-center gap-3 min-w-max">
                  ${[
                    { id: 'all', label: 'All Rentals', sub: '१,२५०+ Spaces', icon: 'compass' },
                    { id: 'room', label: 'Single Rooms', sub: '४२०+ कोठाहरू', icon: 'bed' },
                    { id: 'flat', label: 'Flats & Apartments', sub: '३८०+ फ्ल्याट', icon: 'building-2' },
                    { id: 'house', label: 'Full Houses', sub: '१५०+ घरहरू', icon: 'home' },
                    { id: 'commercial', label: 'Commercial Shutters', sub: '१९०+ सटर/अफिस', icon: 'store' },
                    { id: 'land', label: 'Land & Plots', sub: '११०+ जग्गा', icon: 'trees' },
                  ].map(tile => {
                    const isSelected = currentCategory === tile.id;
                    return `
                      <button type="button" class="category-tile-btn btn-press flex items-center gap-3 p-3 px-4 rounded-2xl transition-all cursor-pointer border ${isSelected ? 'bg-[#EFF6FF] border-[#1E40AF] text-[#1E40AF] ring-2 ring-[#1E40AF]/20 shadow-xs' : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-card text-slate-800'}" data-cat="${tile.id}">
                        <div class="w-10 h-10 rounded-xl ${isSelected ? 'bg-[#1E40AF] text-white' : 'bg-slate-100 text-slate-700'} flex items-center justify-center shrink-0">
                          ${getIcon(tile.icon, { class: 'w-5 h-5' })}
                        </div>
                        <div class="text-left">
                          <h4 class="text-xs sm:text-sm font-bold leading-tight truncate">${tile.label}</h4>
                          <p class="text-[10px] text-slate-400 mt-0.5 truncate font-medium">${tile.sub}</p>
                        </div>
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>

              <!-- Quick Hot Area Chips -->
              <div class="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-5xl mx-auto">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
                  ${getIcon('flame', { class: 'w-3.5 h-3.5 text-[#1E40AF]' })} Hot Areas:
                </span>
                ${['New Baneshwor', 'Jhamsikhel', 'Lakeside Pokhara', 'Pulchowk', 'Baluwatar', 'Koteshwor', 'Sanepa', 'Thamel'].map(area => `
                  <button type="button" class="quick-area-chip btn-press px-3 py-1 rounded-full bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-semibold border border-slate-200 shadow-2xs transition-all cursor-pointer" data-area="${area}">
                    ${area}
                  </button>
                `).join('')}
              </div>

            </div>
          </section>

          <!-- 4. "NEWLY ADDED PROPERTIES" Horizontal Scrollable Section (Housing.com Signature) -->
          <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8">
            <div class="flex items-center justify-between gap-4 mb-4">
              <div>
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <h2 class="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">Newly Added in Kathmandu Valley</h2>
                </div>
                <p class="text-xs text-slate-500 mt-0.5">Fresh verified properties posted directly by landlords in the last 48 hours</p>
              </div>

              <!-- Carousel Arrow Navigation -->
              <div class="flex items-center gap-2 shrink-0">
                <button id="newly-prev-btn" type="button" class="btn-press w-9 h-9 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 hover:text-[#1E40AF] cursor-pointer" aria-label="Previous properties">
                  ${getIcon('chevron-left', { class: 'w-4 h-4' })}
                </button>
                <button id="newly-next-btn" type="button" class="btn-press w-9 h-9 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 hover:text-[#1E40AF] cursor-pointer" aria-label="Next properties">
                  ${getIcon('chevron-right', { class: 'w-4 h-4' })}
                </button>
              </div>
            </div>

            <!-- Horizontal Scrollable Container -->
            <div id="newly-added-carousel" class="flex items-stretch gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-3">
              <!-- Rendered via JS -->
            </div>
          </section>

          <!-- 5. UTILITY / VALUE-ADD SECTION ("Housing Edge" Model for Nepal) -->
          <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-10">
            <div class="bg-gradient-to-r from-slate-900 to-[#172554] text-white rounded-3xl p-6 sm:p-8 shadow-card">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <span class="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-2 border border-blue-400/30">
                    Nepal Renter & Landlord Utilities
                  </span>
                  <h2 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Free Tenancy Tools & Calculators</h2>
                  <p class="text-xs sm:text-sm text-slate-300 mt-1">Smart utilities to make renting in Nepal hassle-free, secure, and compliant.</p>
                </div>
              </div>

              <!-- Clickable Utility Cards -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <!-- Tool 1: Rent Receipt Generator -->
                <button type="button" id="tool-receipt-btn" class="btn-press text-left p-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all cursor-pointer group">
                  <div class="w-11 h-11 rounded-xl bg-blue-500/30 text-blue-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    ${getIcon('sparkles', { class: 'w-6 h-6' })}
                  </div>
                  <h3 class="text-sm sm:text-base font-bold text-white mb-1">Free Rent Receipt Generator (भाडा रसिद)</h3>
                  <p class="text-xs text-slate-300 leading-relaxed font-normal">Generate and print instant legally valid rent receipts for tax, office reimbursement, and lease proof.</p>
                  <span class="inline-flex items-center gap-1 text-xs font-bold text-blue-400 mt-3 group-hover:underline">
                    Generate Receipt →
                  </span>
                </button>

                <!-- Tool 2: Rent Affordability Calculator -->
                <button type="button" id="tool-calc-btn" class="btn-press text-left p-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all cursor-pointer group">
                  <div class="w-11 h-11 rounded-xl bg-emerald-500/30 text-emerald-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    ${getIcon('sliders-horizontal', { class: 'w-6 h-6' })}
                  </div>
                  <h3 class="text-sm sm:text-base font-bold text-white mb-1">Rent Affordability Tool (बजेट क्यालकुलेटर)</h3>
                  <p class="text-xs text-slate-300 leading-relaxed font-normal">Enter your monthly salary to calculate recommended rent ceiling (<30% rule) and avoid financial stress.</p>
                  <span class="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 mt-3 group-hover:underline">
                    Calculate Budget →
                  </span>
                </button>

                <!-- Tool 3: Security Deposit & Rules Guide -->
                <button type="button" id="tool-rules-btn" class="btn-press text-left p-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all cursor-pointer group">
                  <div class="w-11 h-11 rounded-xl bg-purple-500/30 text-purple-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    ${getIcon('shield-check', { class: 'w-6 h-6' })}
                  </div>
                  <h3 class="text-sm sm:text-base font-bold text-white mb-1">Tenancy Rules & Deposit Guide (धरौटी नियम)</h3>
                  <p class="text-xs text-slate-300 leading-relaxed font-normal">Understand standard 1-2 month deposit limits, 35-day notice periods, and dispute resolution in Nepal.</p>
                  <span class="inline-flex items-center gap-1 text-xs font-bold text-purple-400 mt-3 group-hover:underline">
                    View Tenancy Rules →
                  </span>
                </button>
              </div>
            </div>
          </section>

          <!-- 6. "POPULAR IN LALITPUR & POKHARA" Carousel -->
          <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-10">
            <div class="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 class="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">Trending in Lalitpur & Pokhara</h2>
                <p class="text-xs text-slate-500 mt-0.5">Top-viewed flats, rooms, and tourist studio rentals</p>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <button id="popular-prev-btn" type="button" class="btn-press w-9 h-9 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 hover:text-[#1E40AF] cursor-pointer" aria-label="Previous trending">
                  ${getIcon('chevron-left', { class: 'w-4 h-4' })}
                </button>
                <button id="popular-next-btn" type="button" class="btn-press w-9 h-9 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 hover:text-[#1E40AF] cursor-pointer" aria-label="Next trending">
                  ${getIcon('chevron-right', { class: 'w-4 h-4' })}
                </button>
              </div>
            </div>

            <!-- Horizontal Scrollable Container -->
            <div id="popular-carousel" class="flex items-stretch gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-3">
              <!-- Rendered via JS -->
            </div>
          </section>

          <!-- 7. CURATED ALL RENTALS GRID -->
          <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-10">
            
            <!-- Filter Bar & Sorter -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
              <div>
                <h2 class="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">${t('featuredHeading')}</h2>
                <p id="results-count" class="text-xs text-slate-500 mt-0.5">
                  Loading verified rentals...
                </p>
              </div>

              <div class="flex items-center gap-2.5 self-stretch sm:self-auto justify-between sm:justify-end">
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

            <!-- Active Filter Chips -->
            <div id="active-filter-chips" class="flex flex-wrap items-center gap-2 mb-5 ${currentCategory === 'all' && currentPrice === 'any' && !currentQuery && currentBedrooms === 'any' ? 'hidden' : ''}">
              <span class="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Active:</span>
              ${currentCategory !== 'all' ? `
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] text-[#1E40AF] text-xs font-semibold border border-[#DBEAFE]">
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
              <button id="clear-all-filters-btn" type="button" class="text-xs text-[#1E40AF] font-bold hover:underline ml-1 cursor-pointer">
                ${t('clearFilters')}
              </button>
            </div>

            <!-- Main Listings 3-Column Grid -->
            <div id="listings-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              <!-- Skeletons rendered initially -->
              ${[1, 2, 3, 4, 5, 6].map(() => `
                <div class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-card">
                  <div class="aspect-[4/3] w-full skeleton-shimmer"></div>
                  <div class="p-5 flex flex-col gap-3">
                    <div class="h-6 w-1/3 skeleton-shimmer"></div>
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

          <!-- 8. TRUST / SOCIAL PROOF ("How It Works: 3 Simple Steps") -->
          <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16">
            <div class="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs">
              <div class="text-center max-w-2xl mx-auto mb-8">
                <span class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  100% Zero Brokerage Model
                </span>
                <h2 class="text-2xl font-extrabold text-slate-900 mt-2">How GharBhada Works</h2>
                <p class="text-xs sm:text-sm text-slate-500 mt-1">Direct peer-to-peer tenancy without middlemen commissions.</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center">
                  <div class="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#1E40AF] flex items-center justify-center font-extrabold text-lg mb-3">
                    १
                  </div>
                  <h3 class="text-base font-bold text-slate-900 mb-1.5">1. Search & Filter Direct Listings</h3>
                  <p class="text-xs text-slate-500 leading-relaxed">Browse verified rooms, flats, and shutters with exact pricing, photos, and amenities.</p>
                </div>

                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center">
                  <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-extrabold text-lg mb-3">
                    २
                  </div>
                  <h3 class="text-base font-bold text-slate-900 mb-1.5">2. Connect with Owner via WhatsApp / Call</h3>
                  <p class="text-xs text-slate-500 leading-relaxed">No mediator or broker. Tap once to talk directly to the property owner and schedule a visit.</p>
                </div>

                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center">
                  <div class="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#1E40AF] flex items-center justify-center font-extrabold text-lg mb-3">
                    ३
                  </div>
                  <h3 class="text-base font-bold text-slate-900 mb-1.5">3. Inspect & Move In Free</h3>
                  <p class="text-xs text-slate-500 leading-relaxed">Meet in person, inspect water and electricity sub-meters, agree on terms, and pay exactly Rs. 0 in brokerage.</p>
                </div>
              </div>
            </div>
          </section>

          <!-- 9. RENTER ADVICE & KNOWLEDGE GUIDES (SEO Content Cards) -->
          <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-14">
            <div class="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 class="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">Renting in Nepal: Guides & Advice</h2>
                <p class="text-xs text-slate-500 mt-0.5">Essential advice on tenancy rights, agreements, and rental costs</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-card hover:shadow-card-hover transition-all flex flex-col">
                <img src="https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80" alt="Tenancy Rights" class="w-full h-44 object-cover"/>
                <div class="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <span class="text-[10px] font-bold text-[#1E40AF] uppercase tracking-wider">Legal & Rights</span>
                    <h3 class="text-sm font-bold text-slate-900 mt-1">Tenant Rights & Security Deposit Rules in Nepal</h3>
                    <p class="text-xs text-slate-500 mt-1.5 leading-relaxed">What the Civil Code 2074 states regarding 35-day notice, deposit refunds, and annual rent revisions.</p>
                  </div>
                  <span class="text-xs font-bold text-[#1E40AF] mt-4 inline-block">Read Guide →</span>
                </div>
              </div>

              <div class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-card hover:shadow-card-hover transition-all flex flex-col">
                <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80" alt="Rental Trends" class="w-full h-44 object-cover"/>
                <div class="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <span class="text-[10px] font-bold text-[#1E40AF] uppercase tracking-wider">Market Analysis</span>
                    <h3 class="text-sm font-bold text-slate-900 mt-1">Kathmandu Valley Rental Pricing Index (2026)</h3>
                    <p class="text-xs text-slate-500 mt-1.5 leading-relaxed">Average rent rates for 1BHK, 2BHK, and office shutters across Baneshwor, Jhamsikhel, and Baluwatar.</p>
                  </div>
                  <span class="text-xs font-bold text-[#1E40AF] mt-4 inline-block">Read Guide →</span>
                </div>
              </div>

              <div class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-card hover:shadow-card-hover transition-all flex flex-col">
                <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80" alt="Move-in Checklist" class="w-full h-44 object-cover"/>
                <div class="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <span class="text-[10px] font-bold text-[#1E40AF] uppercase tracking-wider">Tenant Checklist</span>
                    <h3 class="text-sm font-bold text-slate-900 mt-1">The 10-Point Inspection Checklist Before Moving In</h3>
                    <p class="text-xs text-slate-500 mt-1.5 leading-relaxed">How to check Melamchi line, boring water filters, sub-meter readings, and parking rights before handing over advance.</p>
                  </div>
                  <span class="text-xs font-bold text-[#1E40AF] mt-4 inline-block">Read Guide →</span>
                </div>
              </div>
            </div>
          </section>

          <!-- 10. INTERACTIVE UTILITY MODALS -->
          <div id="utility-modal-container"></div>

        </div>
      `;

      attachEventListeners();
      loadAllListingsData();
    }

    // Helper: Shared Housing.com-Style Listing Card Component
    function renderCardHTML(item, isCarousel = false) {
      const photos = item.photos && item.photos.length > 0 ? item.photos : [];
      const photo = photos[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80';
      const photoCount = photos.length || 1;
      const formattedPrice = formatNPR(item.price, getLanguage());
      const relativeTime = getRelativeTime(item.created_at, getLanguage());
      const cleanPhone = (item.contact_phone || '').replace(/[^0-9]/g, '');
      const phoneWithCountry = cleanPhone.startsWith('977') ? cleanPhone : `977${cleanPhone}`;
      const isSaved = savedListings.has(item.id);

      const categoryMap = {
        room: 'Single Room',
        flat: 'Full Flat',
        house: 'House',
        commercial: 'Shutter/Office',
        land: 'Land/Plot',
        vehicle: 'Vehicle'
      };

      const waUrl = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(`Namaste, I am interested in your listing "${item.title}" on GharBhada (ID: ${item.id.substring(0, 6)}). Is it still available?`)}`;
      const viberUrl = `viber://chat?number=%2B${phoneWithCountry}`;
      const telUrl = `tel:+${phoneWithCountry}`;

      const cardWidth = isCarousel ? 'w-[300px] sm:w-[340px] shrink-0' : 'w-full';

      return `
        <article class="card-modern group flex flex-col overflow-hidden bg-white ${cardWidth}">
          
          <!-- Image Section with 4:3 Ratio, Category Badge, and Wishlist Heart -->
          <div class="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 block">
            <a href="#/listing/${item.id}" class="w-full h-full block">
              <img class="w-full h-full object-cover img-zoom" src="${photo}" alt="${item.title}" loading="lazy"/>
            </a>
            
            <!-- Category Badge -->
            <span class="glass-pill absolute top-3 left-3 px-3 py-1 rounded-full text-slate-900 text-[11px] font-bold border border-white/80">
              ${categoryMap[item.category] || item.category}
            </span>

            <!-- Wishlist Heart Button -->
            <button type="button" class="favorite-toggle-btn heart-pop absolute top-3 right-3 w-8 h-8 rounded-full glass-pill flex items-center justify-center transition-transform shadow-xs cursor-pointer z-10 ${isSaved ? 'text-[#1E40AF]' : 'text-slate-600 hover:text-[#1E40AF]'}" data-id="${item.id}" aria-label="Save listing">
              ${getIcon('heart', { class: `w-4 h-4 ${isSaved ? 'fill-[#1E40AF]' : ''}` })}
            </button>

            <!-- Photo Counter -->
            <span class="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full bg-slate-900/60 backdrop-blur-xs text-white text-[10px] font-semibold flex items-center gap-1">
              ${getIcon('camera', { class: 'w-3 h-3' })} ${photoCount}
            </span>

            <!-- Freshness Tag -->
            <span class="glass-pill absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full text-slate-600 text-[10px] font-medium flex items-center gap-1 border border-white/80">
              ${getIcon('clock', { class: 'w-3 h-3 text-[#1E40AF]' })} ${relativeTime}
            </span>
          </div>

          <!-- Card Content Body -->
          <div class="p-5 flex flex-col flex-grow justify-between gap-3.5">
            <div>
              
              <!-- 1. BOLD DOMINANT PRICE (#1 Visual Element on Card) -->
              <div class="flex items-baseline justify-between gap-2">
                <div class="flex items-baseline gap-1.5">
                  <span class="text-2xl sm:text-3xl font-extrabold price-dominant text-slate-900">${formattedPrice}</span>
                  <span class="text-xs text-slate-400 font-bold uppercase tracking-wider">${t('perMonth')}</span>
                </div>
                ${item.is_negotiable ? `
                  <span class="text-[11px] text-emerald-700 font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                    Negotiable
                  </span>
                ` : ''}
              </div>

              <!-- 2. Property Title -->
              <a href="#/listing/${item.id}" class="block group-hover:text-[#1E40AF] transition-colors cursor-pointer mt-1.5">
                <h3 class="text-sm sm:text-base font-bold text-slate-800 line-clamp-1 leading-snug">
                  ${item.title}
                </h3>
              </a>

              <!-- 3. Location with MapPin -->
              <p class="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                ${getIcon('map-pin', { class: 'w-3.5 h-3.5 text-[#1E40AF] shrink-0' })}
                <span class="truncate font-medium">${item.location_area}, ${item.location_city}</span>
              </p>

              <!-- 4. One-Line Key Specs with Micro-Icons -->
              <div class="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-600 font-medium overflow-hidden">
                <span class="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">
                  ${getIcon('shield-check', { class: 'w-3 h-3 text-emerald-600' })} Verified
                </span>
                <span class="inline-flex items-center gap-1">
                  ${getIcon('bed', { class: 'w-3.5 h-3.5 text-slate-400' })} ${item.bedrooms || 1} Bed
                </span>
                <span class="text-slate-300">•</span>
                <span class="inline-flex items-center gap-1 truncate">
                  ${getIcon('droplet', { class: 'w-3.5 h-3.5 text-blue-500' })} ${item.water_facility || '24/7 Water'}
                </span>
              </div>
            </div>

            <!-- 5. Direct Contact CTAs on Card -->
            <div class="pt-3 border-t border-slate-100 flex items-center gap-2">
              <!-- WhatsApp -->
              <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-press flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200/80 shadow-2xs transition-all" title="Chat on WhatsApp">
                ${getIcon('message-circle', { class: 'w-3.5 h-3.5 text-emerald-600' })}
                <span class="text-[11px]">WhatsApp</span>
              </a>

              <!-- Viber -->
              <a href="${viberUrl}" class="btn-press inline-flex items-center justify-center p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/80 shadow-2xs transition-all" title="Connect on Viber">
                ${getIcon('phone', { class: 'w-3.5 h-3.5 text-purple-600' })}
              </a>

              <!-- Phone Call (Royal Indigo Filled Button) -->
              <a href="${telUrl}" class="btn-brand flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all" title="Direct Phone Call">
                ${getIcon('phone-call', { class: 'w-3.5 h-3.5 text-white' })}
                <span class="text-[11px]">${t('callNow')}</span>
              </a>
            </div>

          </div>
        </article>
      `;
    }

    async function loadAllListingsData() {
      const grid = document.getElementById('listings-grid');
      const newlyCarousel = document.getElementById('newly-added-carousel');
      const popularCarousel = document.getElementById('popular-carousel');
      const countEl = document.getElementById('results-count');

      // Fetch all active listings
      const { data: allListings, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error || !allListings) {
        if (grid) {
          grid.innerHTML = `
            <div class="col-span-full p-6 text-center bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-semibold">
              Failed to load listings: ${error?.message || 'Error'}
            </div>
          `;
        }
        return;
      }

      // Populate Horizontal Carousels
      if (newlyCarousel) {
        const kathmanduListings = allListings.filter(l => (l.location_city || '').toLowerCase().includes('kathmandu') || (l.location_area || '').toLowerCase().includes('baneshwor') || true).slice(0, 6);
        newlyCarousel.innerHTML = kathmanduListings.map(item => renderCardHTML(item, true)).join('');
      }

      if (popularCarousel) {
        const popularListings = allListings.filter(l => (l.location_city || '').toLowerCase().includes('lalitpur') || (l.location_city || '').toLowerCase().includes('pokhara') || true).slice(0, 6);
        popularCarousel.innerHTML = popularListings.map(item => renderCardHTML(item, true)).join('');
      }

      // Filter for Curated All Grid
      let filtered = [...allListings];

      if (currentCategory && currentCategory !== 'all') {
        filtered = filtered.filter(l => l.category === currentCategory);
      }

      if (currentQuery.trim()) {
        const q = currentQuery.trim().toLowerCase();
        filtered = filtered.filter(l => 
          (l.title || '').toLowerCase().includes(q) ||
          (l.location_area || '').toLowerCase().includes(q) ||
          (l.location_city || '').toLowerCase().includes(q) ||
          (l.description || '').toLowerCase().includes(q)
        );
      }

      if (currentPrice === '15000') {
        filtered = filtered.filter(l => l.price <= 15000);
      } else if (currentPrice === '30000') {
        filtered = filtered.filter(l => l.price >= 15000 && l.price <= 30000);
      } else if (currentPrice === '60000') {
        filtered = filtered.filter(l => l.price >= 30000 && l.price <= 60000);
      } else if (currentPrice === '60000plus') {
        filtered = filtered.filter(l => l.price >= 60000);
      }

      if (currentSort === 'price_asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (currentSort === 'price_desc') {
        filtered.sort((a, b) => b.price - a.price);
      }

      if (countEl) {
        countEl.textContent = getLanguage() === 'ne' 
          ? `${filtered.length} वटा प्रमाणित घरभाडा उपलब्ध • १००% सिधा घरधनी सम्पर्क` 
          : `Showing ${filtered.length} verified direct rentals • 0% Broker Fee`;
      }

      if (filtered.length === 0) {
        if (grid) {
          grid.innerHTML = `
            <div class="col-span-full py-16 text-center bg-white rounded-2xl p-8 border border-dashed border-slate-200 shadow-card">
              <div class="w-14 h-14 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center mx-auto mb-3 text-[#1E40AF]">
                ${getIcon('search', { class: 'w-7 h-7' })}
              </div>
              <h3 class="text-base font-bold text-slate-900 mb-1.5">${t('noResultsTitle')}</h3>
              <p class="text-xs sm:text-sm text-slate-500 mb-6 max-w-md mx-auto">${t('noResultsDesc')}</p>
              <button id="grid-reset-btn" type="button" class="btn-brand px-6 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer">
                ${t('resetFiltersBtn')}
              </button>
            </div>
          `;
          document.getElementById('grid-reset-btn')?.addEventListener('click', () => {
            currentCategory = 'all';
            currentQuery = '';
            currentPrice = 'any';
            buildView();
          });
        }
      } else if (grid) {
        grid.innerHTML = filtered.map(item => renderCardHTML(item, false)).join('');
      }

      // Attach wishlist heart listeners
      document.querySelectorAll('.favorite-toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          if (savedListings.has(id)) {
            savedListings.delete(id);
            btn.classList.remove('text-[#1E40AF]');
            btn.classList.add('text-slate-600');
            const svg = btn.querySelector('svg');
            if (svg) svg.classList.remove('fill-[#1E40AF]');
          } else {
            savedListings.add(id);
            btn.classList.add('text-[#1E40AF]');
            btn.classList.remove('text-slate-600');
            const svg = btn.querySelector('svg');
            if (svg) svg.classList.add('fill-[#1E40AF]');
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
        loadAllListingsData();
      });

      // Carousel Scroll Handlers (Kathmandu)
      const newlyCarousel = document.getElementById('newly-added-carousel');
      document.getElementById('newly-prev-btn')?.addEventListener('click', () => {
        newlyCarousel?.scrollBy({ left: -340, behavior: 'smooth' });
      });
      document.getElementById('newly-next-btn')?.addEventListener('click', () => {
        newlyCarousel?.scrollBy({ left: 340, behavior: 'smooth' });
      });

      // Carousel Scroll Handlers (Popular)
      const popularCarousel = document.getElementById('popular-carousel');
      document.getElementById('popular-prev-btn')?.addEventListener('click', () => {
        popularCarousel?.scrollBy({ left: -340, behavior: 'smooth' });
      });
      document.getElementById('popular-next-btn')?.addEventListener('click', () => {
        popularCarousel?.scrollBy({ left: 340, behavior: 'smooth' });
      });

      // Remove active filter chips
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

      // UTILITY MODAL TRIGGERS
      document.getElementById('tool-receipt-btn')?.addEventListener('click', openRentReceiptModal);
      document.getElementById('tool-calc-btn')?.addEventListener('click', openAffordabilityModal);
      document.getElementById('tool-rules-btn')?.addEventListener('click', openRulesModal);
    }

    // Modal 1: Free Rent Receipt Generator
    function openRentReceiptModal() {
      const modalContainer = document.getElementById('utility-modal-container');
      if (!modalContainer) return;

      modalContainer.innerHTML = `
        <div id="receipt-modal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#1E40AF] flex items-center justify-center font-bold">
                  📝
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-slate-900">Nepal Rent Receipt Generator</h3>
                  <p class="text-xs text-slate-500">घरभाडा रसिद जनरेटर (Legally Valid Format)</p>
                </div>
              </div>
              <button id="close-modal-btn" class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 cursor-pointer">
                ${getIcon('x', { class: 'w-4 h-4' })}
              </button>
            </div>

            <form id="receipt-generator-form" class="flex flex-col gap-3.5">
              <div>
                <label class="text-xs font-bold text-slate-700 block mb-1">Tenant Name (भाडामा बस्नेको नाम)</label>
                <input id="rec-tenant" required type="text" class="input-focus w-full px-3.5 py-2 text-sm text-slate-900 font-medium" placeholder="e.g. Rameshwor Sharma"/>
              </div>

              <div>
                <label class="text-xs font-bold text-slate-700 block mb-1">Landlord Name (घरधनीको नाम)</label>
                <input id="rec-landlord" required type="text" class="input-focus w-full px-3.5 py-2 text-sm text-slate-900 font-medium" placeholder="e.g. Maya Devi Shrestha"/>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs font-bold text-slate-700 block mb-1">Rent Amount (रकम रु)</label>
                  <input id="rec-amount" required type="number" step="500" class="input-focus w-full px-3.5 py-2 text-sm text-slate-900 font-bold" placeholder="25000"/>
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-700 block mb-1">Month (महिना)</label>
                  <select id="rec-month" class="input-focus w-full px-3.5 py-2 text-sm text-slate-900 font-medium">
                    ${['Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'].map(m => `
                      <option value="${m}">${m}</option>
                    `).join('')}
                  </select>
                </div>
              </div>

              <div>
                <label class="text-xs font-bold text-slate-700 block mb-1">Property Address (सम्पत्ति स्थान)</label>
                <input id="rec-address" required type="text" class="input-focus w-full px-3.5 py-2 text-sm text-slate-900 font-medium" placeholder="e.g. House No. 42, New Baneshwor, Kathmandu"/>
              </div>

              <div class="pt-3">
                <button type="submit" class="btn-brand w-full py-3 rounded-xl font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-2">
                  <span>Generate & Print Receipt (प्रिन्ट गर्नुहोस्)</span>
                  ${getIcon('arrow-right', { class: 'w-4 h-4' })}
                </button>
              </div>
            </form>
          </div>
        </div>
      `;

      document.getElementById('close-modal-btn')?.addEventListener('click', () => {
        modalContainer.innerHTML = '';
      });

      document.getElementById('receipt-generator-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const tenant = document.getElementById('rec-tenant').value;
        const landlord = document.getElementById('rec-landlord').value;
        const amount = document.getElementById('rec-amount').value;
        const month = document.getElementById('rec-month').value;
        const address = document.getElementById('rec-address').value;
        const date = new Date().toLocaleDateString();

        const printWin = window.open('', '_blank', 'width=700,height=500');
        printWin.document.write(`
          <html>
            <head>
              <title>Rent Receipt - ${tenant}</title>
              <style>
                body { font-family: sans-serif; padding: 40px; color: #0F172A; }
                .box { border: 2px solid #1E40AF; padding: 30px; border-radius: 12px; max-width: 600px; margin: auto; }
                .header { text-align: center; border-bottom: 1px solid #E2E8F0; padding-bottom: 15px; margin-bottom: 20px; }
                .header h2 { margin: 0; color: #1E40AF; }
                .row { display: flex; justify-content: space-between; margin: 12px 0; font-size: 14px; }
                .amount { font-size: 20px; font-weight: bold; color: #1E40AF; text-align: right; }
                .footer { margin-top: 40px; display: flex; justify-content: space-between; }
                .sig { border-top: 1px solid #000; width: 180px; text-align: center; font-size: 12px; padding-top: 5px; }
              </style>
            </head>
            <body>
              <div class="box">
                <div class="header">
                  <h2>घरभाडा रसिद • RENT RECEIPT</h2>
                  <p style="margin: 4px 0; font-size: 12px; color: #64748B;">Direct Tenancy Record (Nepal)</p>
                </div>
                <div class="row"><span><strong>Receipt Date:</strong> ${date}</span><span><strong>Month:</strong> ${month}</span></div>
                <div class="row"><span><strong>Received From (Tenant):</strong> ${tenant}</span></div>
                <div class="row"><span><strong>Property Location:</strong> ${address}</span></div>
                <div class="row"><span><strong>Received By (Landlord):</strong> ${landlord}</span></div>
                <div class="row" style="margin-top: 20px;"><span style="font-size: 16px;"><strong>Amount Paid:</strong></span><span class="amount">NPR Rs. ${Number(amount).toLocaleString('en-IN')}/-</span></div>
                <div class="footer">
                  <div class="sig">Tenant Signature</div>
                  <div class="sig">Landlord Signature</div>
                </div>
              </div>
              <script>window.print();<\/script>
            </body>
          </html>
        `);
        printWin.document.close();
      });
    }

    // Modal 2: Rent Affordability Calculator
    function openAffordabilityModal() {
      const modalContainer = document.getElementById('utility-modal-container');
      if (!modalContainer) return;

      modalContainer.innerHTML = `
        <div id="calc-modal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  🧮
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-slate-900">Rent Affordability Calculator</h3>
                  <p class="text-xs text-slate-500">तपाईंको मासिक आम्दानी अनुसार उचित भाडा बजेट</p>
                </div>
              </div>
              <button id="close-modal-btn" class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 cursor-pointer">
                ${getIcon('x', { class: 'w-4 h-4' })}
              </button>
            </div>

            <div class="flex flex-col gap-4">
              <div>
                <label class="text-xs font-bold text-slate-700 block mb-1.5">Monthly Household Income (मासिक आम्दानी रु)</label>
                <div class="flex items-center bg-slate-50 rounded-xl border border-slate-200 px-3.5 py-2.5 focus-within:border-[#1E40AF] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1E40AF]/15 transition-all">
                  <span class="font-bold text-[#1E40AF] mr-2 text-sm">रु (NPR)</span>
                  <input id="income-input" type="number" step="1000" class="w-full bg-transparent text-slate-900 font-extrabold text-base focus:outline-none" value="60000"/>
                </div>
              </div>

              <!-- Recommendation Breakdown -->
              <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col gap-3">
                <div class="flex items-baseline justify-between">
                  <span class="text-xs text-slate-600 font-semibold">Recommended Safe Rent (30% Rule)</span>
                  <span id="safe-rent-val" class="text-xl font-extrabold text-[#1E40AF]">रु १८,००० / mo</span>
                </div>
                <div class="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div class="h-full bg-[#1E40AF] rounded-full w-[30%]"></div>
                </div>

                <div class="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-200/60">
                  <div>
                    <span class="text-slate-400 block text-[10px] font-bold uppercase">Conservative (<25%)</span>
                    <span id="cons-rent-val" class="font-bold text-slate-800">रु १५,०००</span>
                  </div>
                  <div>
                    <span class="text-slate-400 block text-[10px] font-bold uppercase">Max Ceiling (35%)</span>
                    <span id="max-rent-val" class="font-bold text-slate-800">रु २१,०००</span>
                  </div>
                </div>
              </div>

              <div class="p-3.5 rounded-xl bg-blue-50 text-blue-900 text-xs leading-relaxed border border-blue-200/70">
                <strong>Financial Tip:</strong> In Kathmandu Valley, keeping your rent and utility bills under 30% of your take-home pay allows for healthy savings and emergency reserves.
              </div>

              <button type="button" id="browse-within-budget-btn" class="btn-brand w-full py-3 rounded-xl font-bold text-xs shadow-md cursor-pointer text-center">
                Browse Properties Within This Budget →
              </button>
            </div>
          </div>
        </div>
      `;

      document.getElementById('close-modal-btn')?.addEventListener('click', () => {
        modalContainer.innerHTML = '';
      });

      const incomeEl = document.getElementById('income-input');
      const safeVal = document.getElementById('safe-rent-val');
      const consVal = document.getElementById('cons-rent-val');
      const maxVal = document.getElementById('max-rent-val');

      function updateCalc() {
        const income = parseFloat(incomeEl.value) || 0;
        const safe = Math.round(income * 0.30);
        const cons = Math.round(income * 0.25);
        const max = Math.round(income * 0.35);

        safeVal.textContent = `रु ${safe.toLocaleString('en-IN')} / mo`;
        consVal.textContent = `रु ${cons.toLocaleString('en-IN')}`;
        maxVal.textContent = `रु ${max.toLocaleString('en-IN')}`;
      }

      incomeEl.addEventListener('input', updateCalc);

      document.getElementById('browse-within-budget-btn')?.addEventListener('click', () => {
        const income = parseFloat(incomeEl.value) || 0;
        const safe = Math.round(income * 0.30);
        modalContainer.innerHTML = '';
        currentPrice = safe <= 15000 ? '15000' : safe <= 30000 ? '30000' : '60000';
        buildView();
      });
    }

    // Modal 3: Tenancy Rules & Deposit Guide
    function openRulesModal() {
      const modalContainer = document.getElementById('utility-modal-container');
      if (!modalContainer) return;

      modalContainer.innerHTML = `
        <div id="rules-modal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  ⚖️
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-slate-900">Nepal Tenancy Rights & Deposit Guide</h3>
                  <p class="text-xs text-slate-500">मुलुकी देवानी संहिता २०७४ अनुसार भाडा नियम</p>
                </div>
              </div>
              <button id="close-modal-btn" class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 cursor-pointer">
                ${getIcon('x', { class: 'w-4 h-4' })}
              </button>
            </div>

            <div class="flex flex-col gap-4 text-xs text-slate-600 leading-relaxed">
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 class="font-bold text-slate-900 mb-1">1. Security Deposit Limits (धरौटी रकम)</h4>
                <p>By standard practice and municipal guidelines in Nepal, a landlord typically requests 1 to 2 months of advance rent as a refundable security deposit. Always insist on a written receipt indicating this deposit is refundable upon move-out.</p>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 class="font-bold text-slate-900 mb-1">2. 35-Day Notice Period (खाली गर्ने म्याद)</h4>
                <p>Either party (tenant or landlord) must provide at least 35 days prior written or verbal notice before terminating tenancy, unless mutual agreement allows otherwise.</p>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 class="font-bold text-slate-900 mb-1">3. Electricity & Water Sub-meters (विद्युत र पानी)</h4>
                <p>Check the initial sub-meter reading on your move-in date and write it into your agreement notes. Nepal NEA unit rates are typically 12-15 NPR/unit.</p>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 class="font-bold text-slate-900 mb-1">4. Written Tenancy Agreement (भाडा सम्झौता)</h4>
                <p>For rent exceeding NPR 20,000/month or commercial shutters, an agreement signed on Rs. 10 stamp paper with 2 witnesses is legally enforceable.</p>
              </div>

              <button type="button" id="close-rules-btn" class="btn-brand w-full py-2.5 rounded-xl font-bold text-xs mt-2 cursor-pointer">
                I Understand (बुझें)
              </button>
            </div>
          </div>
        </div>
      `;

      document.getElementById('close-modal-btn')?.addEventListener('click', () => {
        modalContainer.innerHTML = '';
      });
      document.getElementById('close-rules-btn')?.addEventListener('click', () => {
        modalContainer.innerHTML = '';
      });
    }

    // Dynamic Language change listener
    window.addEventListener('gharbhada:languageChange', buildView);

    buildView();
  }
};
