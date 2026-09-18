import { supabase } from '../lib/supabase.js';
import { getIcon } from '../lib/icons.js';

export const BrowseView = {
  async render(container, { queryParams }) {
    const initialCategory = queryParams.get('cat') || 'all';
    const initialQuery = queryParams.get('q') || queryParams.get('area') || '';
    const initialPrice = queryParams.get('price') || 'any';
    const initialSort = queryParams.get('sort') || 'newest';

    container.innerHTML = `
      <div class="flex flex-col w-full">
        <!-- Ambient subtle glow -->
        <div class="relative w-full overflow-hidden">
          <div class="absolute -top-32 -left-32 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>

          <!-- Hero Search Section -->
          <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 w-full">
            <!-- Header Headline -->
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-5">
              <div>
                <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-light text-primary text-xs font-semibold mb-2 border border-primary/20">
                  <span class="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  <span>प्रत्यक्ष घरधनीसँग सम्पर्क • 100% Zero Broker Commission</span>
                </div>
                <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                  Find Your Next Rental Space in <span class="text-primary underline decoration-primary/30 decoration-wavy underline-offset-4">Nepal</span>
                </h1>
              </div>
              <p class="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed">
                Verified rooms, flats, shutters, and properties across Kathmandu Valley, Pokhara, and major cities with direct owner contact.
              </p>
            </div>

            <!-- Modern Search Shell -->
            <div class="bg-white rounded-xl shadow-xs border border-slate-200/80 p-1.5 sm:p-2">
              <form id="search-form" class="grid grid-cols-1 md:grid-cols-12 gap-1.5 items-center">
                <!-- Location Input -->
                <div class="md:col-span-5 flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition-colors group">
                  ${getIcon('map-pin', { class: 'w-4 h-4 text-primary shrink-0 group-focus-within:scale-105 transition-transform' })}
                  <div class="flex flex-col w-full min-w-0">
                    <label class="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Location / ठेगाना</label>
                    <input id="search-input" class="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none truncate font-normal" placeholder="Area e.g. Baneshwor, Jhamsikhel, Lakeside..." type="text" value="${initialQuery}"/>
                  </div>
                </div>

                <!-- Category Selector -->
                <div class="md:col-span-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition-colors">
                  ${getIcon('layers', { class: 'w-4 h-4 text-slate-500 shrink-0' })}
                  <div class="flex flex-col w-full min-w-0">
                    <label class="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Category / वर्ग</label>
                    <select id="category-select" class="w-full bg-transparent text-xs sm:text-sm text-slate-900 focus:outline-none cursor-pointer font-normal">
                      <option value="all" ${initialCategory === 'all' ? 'selected' : ''}>All Categories (सबै)</option>
                      <option value="room" ${initialCategory === 'room' ? 'selected' : ''}>1 BHK / Room (कोठा)</option>
                      <option value="flat" ${initialCategory === 'flat' ? 'selected' : ''}>Full Flat / Apartment (फ्ल्याट)</option>
                      <option value="commercial" ${initialCategory === 'commercial' ? 'selected' : ''}>Office / Shutter (सटर)</option>
                      <option value="land" ${initialCategory === 'land' ? 'selected' : ''}>Plot / Land (जग्गा)</option>
                      <option value="vehicle" ${initialCategory === 'vehicle' ? 'selected' : ''}>Bike / Car (गाडी/बाइक)</option>
                    </select>
                  </div>
                </div>

                <!-- Budget Range Filter -->
                <div class="md:col-span-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition-colors">
                  ${getIcon('sliders-horizontal', { class: 'w-4 h-4 text-slate-500 shrink-0' })}
                  <div class="flex flex-col w-full min-w-0">
                    <label class="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Price Range (मासिक भाडा)</label>
                    <select id="price-select" class="w-full bg-transparent text-xs sm:text-sm text-slate-900 focus:outline-none cursor-pointer font-normal">
                      <option value="any" ${initialPrice === 'any' ? 'selected' : ''}>Any Budget</option>
                      <option value="15000" ${initialPrice === '15000' ? 'selected' : ''}>Up to Rs. 15,000</option>
                      <option value="30000" ${initialPrice === '30000' ? 'selected' : ''}>Rs. 15,000 - 30,000</option>
                      <option value="60000" ${initialPrice === '60000' ? 'selected' : ''}>Rs. 30,000 - 60,000</option>
                      <option value="60000plus" ${initialPrice === '60000plus' ? 'selected' : ''}>Rs. 60,000+</option>
                    </select>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="md:col-span-1 flex items-center justify-center p-0.5">
                  <button type="submit" class="btn-interactive w-full md:w-10 h-10 rounded-lg bg-primary hover:bg-primary-hover text-white flex items-center justify-center shadow-xs cursor-pointer" title="Search Rentals">
                    ${getIcon('search', { class: 'w-4 h-4' })}
                  </button>
                </div>
              </form>
            </div>

            <!-- Quick Area Shortcuts -->
            <div class="flex flex-wrap items-center gap-1.5 mt-3 pt-1">
              <span class="text-xs text-slate-500 font-semibold uppercase tracking-wider mr-1 flex items-center gap-1">
                ${getIcon('flame', { class: 'w-3.5 h-3.5 text-primary' })} Hot Areas:
              </span>
              ${['New Baneshwor', 'Jhamsikhel', 'Lakeside Pokhara', 'Pulchowk', 'Baluwatar', 'Koteshwor', 'Thamel', 'Sanepa'].map(area => `
                <button type="button" class="quick-area-chip btn-interactive px-2.5 py-1 rounded-full bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs border border-slate-200/80 transition-all cursor-pointer" data-area="${area}">
                  ${area}
                </button>
              `).join('')}
            </div>

            <!-- Category Pills Filter Carousel -->
            <div class="flex items-center gap-1.5 mt-4 overflow-x-auto pb-1 no-scrollbar" id="category-pills">
              ${[
                { id: 'all', label: 'All (सबै)', icon: 'layout-grid', isEmoji: false },
                { id: 'room', label: 'Rooms (कोठा)', icon: '🛏️', isEmoji: true },
                { id: 'flat', label: 'Flats (फ्ल्याट)', icon: '🏢', isEmoji: true },
                { id: 'commercial', label: 'Commercial / Shutter', icon: '🏬', isEmoji: true },
                { id: 'land', label: 'Land (जग्गा)', icon: '🏞️', isEmoji: true },
                { id: 'vehicle', label: 'Vehicle (गाडी/बाइक)', icon: '🏍️', isEmoji: true },
              ].map(cat => {
                const isActive = (initialCategory === cat.id);
                const activeClass = isActive 
                  ? 'bg-primary text-white shadow-xs' 
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80';
                return `
                  <button type="button" class="category-pill-btn btn-interactive shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${activeClass}" data-cat="${cat.id}">
                    ${cat.isEmoji ? `<span class="text-[13px]">${cat.icon}</span>` : getIcon(cat.icon, { class: 'w-3.5 h-3.5' })}
                    <span>${cat.label}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </section>
        </div>

        <!-- Listings Stream Header & Filter Bar -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-200/60">
            <div>
              <h2 class="text-base sm:text-lg font-bold text-slate-900">Featured Rentals Across Nepal</h2>
              <p id="results-count" class="text-xs text-slate-500 mt-0.5">
                Loading verified listings...
              </p>
            </div>
            
            <div class="flex items-center gap-2 self-end sm:self-auto">
              <label class="text-xs text-slate-500 hidden md:inline" for="sort-dropdown">Sort by:</label>
              <div class="relative">
                <select id="sort-dropdown" class="appearance-none pl-3 pr-7 py-1.5 bg-white rounded-lg text-xs font-medium text-slate-700 border border-slate-200/80 focus:outline-none cursor-pointer">
                  <option value="newest" ${initialSort === 'newest' ? 'selected' : ''}>Newest First (नयाँ)</option>
                  <option value="price_asc" ${initialSort === 'price_asc' ? 'selected' : ''}>Price: Low to High (सस्तो देखि)</option>
                  <option value="price_desc" ${initialSort === 'price_desc' ? 'selected' : ''}>Price: High to Low (महँगो देखि)</option>
                </select>
                <span class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                  ${getIcon('chevron-down', { class: 'w-3.5 h-3.5' })}
                </span>
              </div>
            </div>
          </div>

          <!-- Listings Grid (Rendered dynamically) -->
          <div id="listings-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <!-- Animated Skeleton Loader displayed by default -->
            ${[1, 2, 3, 4, 5, 6].map(() => `
              <div class="flex flex-col bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
                <div class="aspect-[4/3] w-full skeleton"></div>
                <div class="p-3.5 flex flex-col gap-2.5">
                  <div class="h-4 w-3/4 skeleton rounded"></div>
                  <div class="h-3 w-1/2 skeleton rounded"></div>
                  <div class="flex gap-1.5 pt-1">
                    <div class="h-5 w-16 skeleton rounded"></div>
                    <div class="h-5 w-20 skeleton rounded"></div>
                  </div>
                  <div class="pt-2.5 border-t border-slate-100 flex gap-2">
                    <div class="h-7 flex-1 skeleton rounded-lg"></div>
                    <div class="h-7 flex-1 skeleton rounded-lg"></div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;

    // State for filtering
    let currentCategory = initialCategory;
    let currentQuery = initialQuery;
    let currentPrice = initialPrice;
    let currentSort = initialSort;

    async function loadListings() {
      const grid = document.getElementById('listings-grid');
      const countEl = document.getElementById('results-count');
      if (!grid) return;

      // Show animated skeleton while fetching
      grid.innerHTML = [1, 2, 3, 4, 5, 6].map(() => `
        <div class="flex flex-col bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div class="aspect-[4/3] w-full skeleton"></div>
          <div class="p-3.5 flex flex-col gap-2.5">
            <div class="h-4 w-3/4 skeleton rounded"></div>
            <div class="h-3 w-1/2 skeleton rounded"></div>
            <div class="flex gap-1.5 pt-1">
              <div class="h-5 w-16 skeleton rounded"></div>
              <div class="h-5 w-20 skeleton rounded"></div>
            </div>
            <div class="pt-2.5 border-t border-slate-100 flex gap-2">
              <div class="h-7 flex-1 skeleton rounded-lg"></div>
              <div class="h-7 flex-1 skeleton rounded-lg"></div>
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
          <div class="col-span-full p-6 text-center bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs">
            Failed to load listings: ${error.message}
          </div>
        `;
        return;
      }

      if (countEl) {
        countEl.textContent = `Showing ${listings?.length || 0} curated listings available for immediate move-in • No broker markup`;
      }

      if (!listings || listings.length === 0) {
        grid.innerHTML = `
          <div class="col-span-full py-12 text-center bg-white rounded-xl p-8 border border-dashed border-slate-300">
            <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
              ${getIcon('search', { class: 'w-6 h-6' })}
            </div>
            <h3 class="text-sm font-bold text-slate-800 mb-1">No listings found</h3>
            <p class="text-xs text-slate-500 mb-4">Try clearing filters or searching for another neighborhood like "Baneshwor" or "Jhamsikhel".</p>
            <button id="reset-filters-btn" class="btn-interactive px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs">Clear Filters</button>
          </div>
        `;
        document.getElementById('reset-filters-btn')?.addEventListener('click', () => {
          currentCategory = 'all';
          currentQuery = '';
          currentPrice = 'any';
          const searchInput = document.getElementById('search-input');
          const catSelect = document.getElementById('category-select');
          const priceSelect = document.getElementById('price-select');
          if (searchInput) searchInput.value = '';
          if (catSelect) catSelect.value = 'all';
          if (priceSelect) priceSelect.value = 'any';
          updatePillsUI();
          loadListings();
        });
        return;
      }

      const categoryBadges = {
        room: '🛏️ Single Room',
        flat: '🏢 Full Flat',
        commercial: '🏬 Shutter / Office',
        land: '🏞️ Plot / Land',
        vehicle: '🏍️ Bike / Vehicle',
        other: '🏡 Property'
      };

      grid.innerHTML = listings.map((item, index) => {
        const photo = item.photos?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80';
        const formattedPrice = Number(item.price).toLocaleString('en-IN');
        const badge = categoryBadges[item.category] || '🏡 Rental';
        const cleanPhone = (item.contact_phone || '').replace(/[^0-9]/g, '');
        const waUrl = `https://wa.me/977${cleanPhone}?text=${encodeURIComponent(`Namaste, I am interested in your listing "${item.title}" on GharBhada.`)}`;
        const staggerDelay = Math.min(index * 45, 360);

        return `
          <article class="card-hover stagger-card group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-xs" style="animation-delay: ${staggerDelay}ms;">
            <!-- Media Container -->
            <a href="#/listing/${item.id}" class="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 block cursor-pointer">
              <img class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" src="${photo}" alt="${item.title}" loading="lazy"/>
              
              <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-slate-800 text-[11px] font-semibold tracking-wide shadow-xs border border-slate-100">
                ${badge}
              </span>
              
              <!-- Floating Price Badge -->
              <div class="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-primary text-white text-xs font-bold shadow-xs flex items-baseline gap-0.5">
                <span class="text-sm font-bold">रु ${formattedPrice}</span>
                <span class="text-[10px] font-normal text-white/90">/ mo</span>
              </div>
            </a>

            <!-- Card Content -->
            <div class="p-3.5 flex flex-col flex-grow justify-between gap-2.5">
              <div>
                <a href="#/listing/${item.id}" class="block group-hover:text-primary transition-colors cursor-pointer">
                  <h3 class="text-sm font-semibold text-slate-900 line-clamp-1 leading-snug">
                    ${item.title}
                  </h3>
                </a>
                <p class="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  ${getIcon('map-pin', { class: 'w-3.5 h-3.5 text-primary shrink-0' })}
                  <span class="truncate">${item.location_area}, ${item.location_city}</span>
                </p>

                <!-- Feature Badges -->
                <div class="flex flex-wrap gap-1 mt-2">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                    ${getIcon('check-circle', { class: 'w-3 h-3 text-emerald-600' })} Verified
                  </span>
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                    ${getIcon('droplet', { class: 'w-3 h-3 text-sky-600' })} ${item.water_facility || '24/7 Water'}
                  </span>
                  ${item.is_negotiable ? `
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                      Negotiable
                    </span>
                  ` : ''}
                </div>
              </div>

              <!-- Quick Action Bar -->
              <div class="pt-2.5 border-t border-slate-100 flex items-center gap-2">
                <a class="btn-interactive flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors border border-slate-200/60" href="${waUrl}" target="_blank" rel="noopener noreferrer">
                  ${getIcon('message-circle', { class: 'w-3.5 h-3.5 text-[#25D366]' })}
                  <span>WhatsApp</span>
                </a>
                <a class="btn-interactive flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-all" href="tel:${cleanPhone}">
                  ${getIcon('phone', { class: 'w-3.5 h-3.5' })}
                  <span>Call Now</span>
                </a>
              </div>
            </div>
          </article>
        `;
      }).join('');
    }

    function updatePillsUI() {
      const pills = document.querySelectorAll('.category-pill-btn');
      pills.forEach(pill => {
        const cat = pill.getAttribute('data-cat');
        if (cat === currentCategory) {
          pill.className = 'category-pill-btn btn-interactive shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer bg-primary text-white shadow-xs';
        } else {
          pill.className = 'category-pill-btn btn-interactive shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80';
        }
      });
    }

    // Search form submit
    document.getElementById('search-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      currentQuery = document.getElementById('search-input').value;
      currentCategory = document.getElementById('category-select').value;
      currentPrice = document.getElementById('price-select').value;
      updatePillsUI();
      loadListings();
    });

    // Category dropdown change
    document.getElementById('category-select')?.addEventListener('change', (e) => {
      currentCategory = e.target.value;
      updatePillsUI();
      loadListings();
    });

    // Price select change
    document.getElementById('price-select')?.addEventListener('change', (e) => {
      currentPrice = e.target.value;
      loadListings();
    });

    // Sort dropdown change
    document.getElementById('sort-dropdown')?.addEventListener('change', (e) => {
      currentSort = e.target.value;
      loadListings();
    });

    // Category pills click
    document.querySelectorAll('.category-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategory = btn.getAttribute('data-cat');
        const select = document.getElementById('category-select');
        if (select) select.value = currentCategory;
        updatePillsUI();
        loadListings();
      });
    });

    // Quick area shortcuts click
    document.querySelectorAll('.quick-area-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const area = chip.getAttribute('data-area');
        currentQuery = area;
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = area;
        loadListings();
      });
    });

    // Initial load
    loadListings();
  }
};
