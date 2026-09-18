import { supabase } from '../lib/supabase.js';

export const BrowseView = {
  async render(container, { queryParams }) {
    const initialCategory = queryParams.get('cat') || 'all';
    const initialQuery = queryParams.get('q') || queryParams.get('area') || '';
    const initialPrice = queryParams.get('price') || 'any';
    const initialSort = queryParams.get('sort') || 'newest';

    container.innerHTML = `
      <div class="flex flex-col w-full animate-fade-in">
        <!-- Ambient Decor -->
        <div class="relative w-full overflow-hidden">
          <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
          <div class="absolute top-48 -right-32 w-[28rem] h-[28rem] rounded-full bg-secondary-container/40 blur-3xl pointer-events-none"></div>

          <!-- Search Hero Section -->
          <section class="max-w-7xl mx-auto px-margin-sm lg:px-margin pt-space-md pb-space-lg w-full">
            <!-- Tagline -->
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-space-sm mb-space-md">
              <div>
                <div class="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container text-secondary font-label-sm text-label-sm mb-space-xs">
                  <span class="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span>नेपालभर प्रत्यक्ष घरधनीसँग सम्पर्क • 100% Zero Broker Commission</span>
                </div>
                <h1 class="font-display-lg text-headline-lg lg:text-display-lg text-on-surface tracking-tight">
                  Find Your Next Space in <span class="text-primary underline decoration-primary-container/40 decoration-wavy underline-offset-8">Nepal</span>.
                </h1>
              </div>
              <p class="font-body-md text-body-md text-on-surface-variant max-w-md">
                Verified rooms, flats, shutters, and equipment for rent across Kathmandu Valley, Pokhara, and major cities with direct owner communication.
              </p>
            </div>

            <!-- Main Floating Search Shell -->
            <div class="bg-surface-container-lowest rounded-DEFAULT lg:rounded-full shadow-[0_12px_32px_-6px_rgba(38,70,83,0.12),0_4px_12px_-2px_rgba(231,111,81,0.08)] p-space-sm">
              <form id="search-form" class="grid grid-cols-1 md:grid-cols-12 gap-space-xs items-center">
                <!-- Location / Keyword Input -->
                <div class="md:col-span-5 flex items-center gap-space-sm px-space-md py-space-sm rounded-full bg-surface hover:bg-surface-container-low transition-colors group">
                  <span class="material-symbols-outlined text-primary text-[22px] group-focus-within:scale-110 transition-transform">location_on</span>
                  <div class="flex flex-col w-full min-w-0">
                    <label class="font-label-sm text-label-sm text-on-surface-variant">Where / ठेगाना वा ठाउँ</label>
                    <input id="search-input" class="w-full bg-transparent font-label-lg text-label-lg text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none truncate" placeholder="e.g. Baneshwor, Jhamsikhel, Lakeside..." type="text" value="${initialQuery}"/>
                  </div>
                </div>

                <!-- Category Select -->
                <div class="md:col-span-3 flex items-center gap-space-sm px-space-md py-space-sm rounded-full bg-surface hover:bg-surface-container-low transition-colors">
                  <span class="material-symbols-outlined text-secondary text-[22px]">category</span>
                  <div class="flex flex-col w-full min-w-0">
                    <label class="font-label-sm text-label-sm text-on-surface-variant">Category / वर्ग</label>
                    <select id="category-select" class="w-full bg-transparent font-label-lg text-label-lg text-on-surface focus:outline-none cursor-pointer">
                      <option value="all" ${initialCategory === 'all' ? 'selected' : ''}>All Categories (सबै)</option>
                      <option value="room" ${initialCategory === 'room' ? 'selected' : ''}>1 BHK / Room (कोठा)</option>
                      <option value="flat" ${initialCategory === 'flat' ? 'selected' : ''}>Full Flat / Apartment (फ्ल्याट)</option>
                      <option value="commercial" ${initialCategory === 'commercial' ? 'selected' : ''}>Office / Shutter (सटर)</option>
                      <option value="land" ${initialCategory === 'land' ? 'selected' : ''}>Plot / Land (जग्गा)</option>
                      <option value="vehicle" ${initialCategory === 'vehicle' ? 'selected' : ''}>Bike / Car (गाडी/बाइक)</option>
                    </select>
                  </div>
                </div>

                <!-- Price Range Filter -->
                <div class="md:col-span-3 flex items-center gap-space-sm px-space-md py-space-sm rounded-full bg-surface hover:bg-surface-container-low transition-colors">
                  <span class="material-symbols-outlined text-tertiary text-[22px]">payments</span>
                  <div class="flex flex-col w-full min-w-0">
                    <label class="font-label-sm text-label-sm text-on-surface-variant">Price Range (मासिक भाडा)</label>
                    <select id="price-select" class="w-full bg-transparent font-label-lg text-label-lg text-on-surface focus:outline-none cursor-pointer">
                      <option value="any" ${initialPrice === 'any' ? 'selected' : ''}>Any Budget</option>
                      <option value="15000" ${initialPrice === '15000' ? 'selected' : ''}>Up to Rs. 15,000</option>
                      <option value="30000" ${initialPrice === '30000' ? 'selected' : ''}>Rs. 15,000 - 30,000</option>
                      <option value="60000" ${initialPrice === '60000' ? 'selected' : ''}>Rs. 30,000 - 60,000</option>
                      <option value="60000plus" ${initialPrice === '60000plus' ? 'selected' : ''}>Rs. 60,000+</option>
                    </select>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="md:col-span-1 flex items-center justify-center p-space-xs">
                  <button type="submit" class="w-full md:w-12 h-12 rounded-full bg-primary-container hover:bg-primary text-on-primary flex items-center justify-center shadow-[0_4px_14px_rgba(231,111,81,0.35)] hover:scale-105 transition-all" title="Search Rentals">
                    <span class="material-symbols-outlined text-[24px]">search</span>
                  </button>
                </div>
              </form>
            </div>

            <!-- Quick Area Shortcuts -->
            <div class="flex flex-wrap items-center gap-space-xs mt-space-sm pt-space-xs">
              <span class="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase tracking-wider mr-space-xs flex items-center gap-1">
                <span class="material-symbols-outlined text-[15px] text-primary">local_fire_department</span> Hot Areas:
              </span>
              ${['New Baneshwor', 'Jhamsikhel', 'Lakeside Pokhara', 'Pulchowk', 'Baluwatar', 'Koteshwor', 'Thamel', 'Sanepa'].map(area => `
                <button type="button" class="quick-area-chip px-space-sm py-space-xs rounded-full bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm shadow-[0_1px_3px_rgba(38,70,83,0.06)] transition-all cursor-pointer" data-area="${area}">
                  ${area}
                </button>
              `).join('')}
            </div>

            <!-- Category Pills Filter Carousel -->
            <div class="flex items-center gap-space-xs mt-space-md overflow-x-auto pb-space-xs no-scrollbar" id="category-pills">
              ${[
                { id: 'all', label: 'All (सबै)', icon: 'apps', isEmoji: false },
                { id: 'room', label: 'Rooms (कोठा)', icon: '🛏️', isEmoji: true },
                { id: 'flat', label: 'Flats (फ्ल्याट)', icon: '🏢', isEmoji: true },
                { id: 'commercial', label: 'Commercial / Shutter', icon: '🏬', isEmoji: true },
                { id: 'land', label: 'Land (जग्गा)', icon: '🏞️', isEmoji: true },
                { id: 'vehicle', label: 'Vehicle (गाडी/बाइक)', icon: '🏍️', isEmoji: true },
              ].map(cat => {
                const isActive = (initialCategory === cat.id);
                const activeClass = isActive 
                  ? 'bg-primary text-on-primary shadow-[0_2px_8px_rgba(163,61,35,0.25)]' 
                  : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface shadow-[0_1px_4px_rgba(38,70,83,0.06)]';
                return `
                  <button type="button" class="category-pill-btn shrink-0 inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all cursor-pointer ${activeClass}" data-cat="${cat.id}">
                    ${cat.isEmoji ? `<span class="text-[16px]">${cat.icon}</span>` : `<span class="material-symbols-outlined text-[18px]">${cat.icon}</span>`}
                    <span>${cat.label}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </section>
        </div>

        <!-- Listings Stream Header & Filter Bar -->
        <section class="max-w-7xl mx-auto px-margin-sm lg:px-margin w-full pb-space-xl">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm mb-space-lg pb-space-sm border-b border-surface-container-high">
            <div>
              <h2 class="font-headline-md text-headline-md text-on-surface font-bold">Featured Rentals Across Nepal</h2>
              <p id="results-count" class="font-body-sm text-body-sm text-on-surface-variant">
                Loading verified listings...
              </p>
            </div>
            
            <div class="flex items-center gap-space-sm self-end sm:self-auto">
              <label class="font-label-sm text-label-sm text-on-surface-variant hidden md:inline" for="sort-dropdown">Sort by:</label>
              <div class="relative">
                <select id="sort-dropdown" class="appearance-none pl-space-md pr-space-xl py-space-xs bg-surface-container-lowest rounded-full font-label-md text-label-md text-on-surface shadow-[0_1px_4px_rgba(38,70,83,0.06)] focus:outline-none cursor-pointer">
                  <option value="newest" ${initialSort === 'newest' ? 'selected' : ''}>Newest First (नयाँ)</option>
                  <option value="price_asc" ${initialSort === 'price_asc' ? 'selected' : ''}>Price: Low to High (सस्तो देखि)</option>
                  <option value="price_desc" ${initialSort === 'price_desc' ? 'selected' : ''}>Price: High to Low (महँगो देखि)</option>
                </select>
                <span class="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">expand_more</span>
              </div>
            </div>
          </div>

          <!-- Listings Grid -->
          <div id="listings-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            <!-- Rendered dynamically -->
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

      grid.innerHTML = `
        <div class="col-span-full py-16 flex flex-col items-center justify-center text-on-surface-variant">
          <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p class="font-label-lg text-label-lg">Fetching rental spaces...</p>
        </div>
      `;

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
          <div class="col-span-full p-8 text-center bg-error-container/30 rounded-DEFAULT text-error">
            Failed to load listings: ${error.message}
          </div>
        `;
        return;
      }

      countEl.textContent = `Showing ${listings?.length || 0} curated listings available for immediate move-in • No broker markup`;

      if (!listings || listings.length === 0) {
        grid.innerHTML = `
          <div class="col-span-full py-16 text-center bg-surface-container-lowest rounded-DEFAULT p-8 shadow-sm">
            <span class="material-symbols-outlined text-5xl text-on-surface-variant mb-2">search_off</span>
            <h3 class="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">No listings found</h3>
            <p class="font-body-sm text-body-sm text-on-surface-variant mb-4">Try clearing filters or searching for another neighborhood like "Baneshwor" or "Jhamsikhel".</p>
            <button id="reset-filters-btn" class="px-6 py-2 rounded-full bg-primary text-on-primary font-label-md">Clear Filters</button>
          </div>
        `;
        document.getElementById('reset-filters-btn')?.addEventListener('click', () => {
          currentCategory = 'all';
          currentQuery = '';
          currentPrice = 'any';
          document.getElementById('search-input').value = '';
          document.getElementById('category-select').value = 'all';
          document.getElementById('price-select').value = 'any';
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

      grid.innerHTML = listings.map(item => {
        const photo = item.photos?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80';
        const formattedPrice = Number(item.price).toLocaleString('en-IN');
        const badge = categoryBadges[item.category] || '🏡 Rental';
        const cleanPhone = (item.contact_phone || '').replace(/[^0-9]/g, '');
        const waUrl = `https://wa.me/977${cleanPhone}?text=${encodeURIComponent(`Namaste, I am interested in your listing "${item.title}" on GharBhada.`)}`;

        return `
          <article class="group flex flex-col bg-surface-container-lowest rounded-DEFAULT overflow-hidden shadow-[0_2px_8px_-1px_rgba(38,70,83,0.05),0_1px_3px_0_rgba(231,111,81,0.04)] hover:shadow-[0_12px_24px_-4px_rgba(38,70,83,0.08),0_4px_10px_-2px_rgba(231,111,81,0.06)] transition-all duration-300">
            <!-- Media Container -->
            <a href="#/listing/${item.id}" class="relative aspect-[4/3] w-full overflow-hidden bg-surface-container block cursor-pointer">
              <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${photo}" alt="${item.title}" loading="lazy"/>
              <span class="absolute top-3 left-3 px-space-sm py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-secondary font-label-sm text-label-sm font-bold tracking-wide shadow-sm">
                ${badge}
              </span>
              
              <!-- Floating Price Badge -->
              <div class="absolute bottom-3 left-3 px-space-md py-1 rounded-full bg-primary-container text-on-primary font-headline-sm text-headline-sm font-extrabold shadow-md flex items-baseline gap-1">
                <span>रु ${formattedPrice}</span>
                <span class="font-label-sm text-label-sm font-normal text-on-primary/90">/ mo</span>
              </div>
            </a>

            <!-- Card Content -->
            <div class="p-space-md flex flex-col flex-grow justify-between gap-space-sm">
              <div>
                <a href="#/listing/${item.id}" class="block group-hover:text-primary transition-colors cursor-pointer">
                  <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold line-clamp-1">
                    ${item.title}
                  </h3>
                </a>
                <p class="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-1">
                  <span class="material-symbols-outlined text-primary text-[16px] shrink-0">pin_drop</span>
                  <span class="truncate">${item.location_area}, ${item.location_city}</span>
                </p>

                <!-- Feature Badges -->
                <div class="flex flex-wrap gap-1.5 mt-space-sm">
                  <span class="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                    <span class="material-symbols-outlined text-[13px] text-primary">verified</span> Verified Owner
                  </span>
                  <span class="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
                    <span class="material-symbols-outlined text-[13px]">water_drop</span> ${item.water_facility || '24/7 Water'}
                  </span>
                  ${item.is_negotiable ? `
                    <span class="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                      <span class="material-symbols-outlined text-[13px]">handshake</span> Negotiable
                    </span>
                  ` : ''}
                </div>
              </div>

              <!-- Quick Action Bar -->
              <div class="pt-space-sm border-t border-surface-container-high/60 flex items-center gap-space-xs">
                <a class="flex-1 inline-flex items-center justify-center gap-1.5 py-space-xs px-space-sm rounded-full bg-surface-container-high hover:bg-secondary-container text-on-surface font-label-md text-label-md transition-colors" href="${waUrl}" target="_blank" rel="noopener noreferrer">
                  <span class="material-symbols-outlined text-[18px] text-[#25D366]">chat</span>
                  <span>WhatsApp</span>
                </a>
                <a class="flex-1 inline-flex items-center justify-center gap-1.5 py-space-xs px-space-sm rounded-full bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md shadow-sm transition-all" href="tel:${cleanPhone}">
                  <span class="material-symbols-outlined text-[18px]">call</span>
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
          pill.className = 'category-pill-btn shrink-0 inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all cursor-pointer bg-primary text-on-primary shadow-[0_2px_8px_rgba(163,61,35,0.25)]';
        } else {
          pill.className = 'category-pill-btn shrink-0 inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all cursor-pointer bg-surface-container-lowest hover:bg-surface-container text-on-surface shadow-[0_1px_4px_rgba(38,70,83,0.06)]';
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
