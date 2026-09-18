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
        <!-- Hero Search Section -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 w-full">
          <!-- Tagline & Headline -->
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-semibold mb-2.5 border border-primary/20">
                <span class="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span>प्रत्यक्ष घरधनी सम्पर्क • Zero Broker Commission</span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight leading-tight">
                Verified Rental Spaces in <span class="text-primary underline decoration-primary/30 decoration-wavy underline-offset-4">Nepal</span>
              </h1>
            </div>
            <p class="text-sm text-text-secondary max-w-md leading-relaxed">
              Browse flats, rooms, and commercial shutters across Kathmandu Valley, Pokhara, and major cities with direct owner contact.
            </p>
          </div>

          <!-- Linear-discipline Search Shell -->
          <div class="bg-white rounded-[12px] shadow-card border border-[#F0EBE3] p-2">
            <form id="search-form" class="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
              <!-- Location Input -->
              <div class="md:col-span-5 flex items-center gap-2.5 px-3 py-2 rounded-[8px] bg-bg hover:bg-[#F5EFE6]/60 transition-colors group">
                ${getIcon('map-pin', { class: 'w-4 h-4 text-primary shrink-0 group-focus-within:scale-105 transition-transform' })}
                <div class="flex flex-col w-full min-w-0">
                  <label class="text-[11px] uppercase font-semibold text-text-secondary tracking-wider">Location / ठेगाना</label>
                  <input id="search-input" class="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none truncate font-normal" placeholder="Area e.g. Baneshwor, Jhamsikhel, Lakeside..." type="text" value="${initialQuery}"/>
                </div>
              </div>

              <!-- Category Selector -->
              <div class="md:col-span-3 flex items-center gap-2 px-3 py-2 rounded-[8px] bg-bg hover:bg-[#F5EFE6]/60 transition-colors">
                ${getIcon('layers', { class: 'w-4 h-4 text-text-secondary shrink-0' })}
                <div class="flex flex-col w-full min-w-0">
                  <label class="text-[11px] uppercase font-semibold text-text-secondary tracking-wider">Category / वर्ग</label>
                  <select id="category-select" class="w-full bg-transparent text-sm text-text-primary focus:outline-none cursor-pointer font-normal">
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
              <div class="md:col-span-3 flex items-center gap-2 px-3 py-2 rounded-[8px] bg-bg hover:bg-[#F5EFE6]/60 transition-colors">
                ${getIcon('sliders-horizontal', { class: 'w-4 h-4 text-text-secondary shrink-0' })}
                <div class="flex flex-col w-full min-w-0">
                  <label class="text-[11px] uppercase font-semibold text-text-secondary tracking-wider">Price Range (मासिक भाडा)</label>
                  <select id="price-select" class="w-full bg-transparent text-sm text-text-primary focus:outline-none cursor-pointer font-normal">
                    <option value="any" ${initialPrice === 'any' ? 'selected' : ''}>Any Budget</option>
                    <option value="15000" ${initialPrice === '15000' ? 'selected' : ''}>Up to Rs. 15,000</option>
                    <option value="30000" ${initialPrice === '30000' ? 'selected' : ''}>Rs. 15,000 - 30,000</option>
                    <option value="60000" ${initialPrice === '60000' ? 'selected' : ''}>Rs. 30,000 - 60,000</option>
                    <option value="60000plus" ${initialPrice === '60000plus' ? 'selected' : ''}>Rs. 60,000+</option>
                  </select>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="md:col-span-1 flex items-center justify-center">
                <button type="submit" class="btn-press w-full md:w-10 h-10 rounded-[8px] bg-primary hover:bg-primary-hover text-white flex items-center justify-center shadow-xs cursor-pointer" title="Search Rentals">
                  ${getIcon('search', { class: 'w-4 h-4' })}
                </button>
              </div>
            </form>
          </div>

          <!-- Quick Area Shortcuts -->
          <div class="flex flex-wrap items-center gap-2 mt-4">
            <span class="text-xs text-text-secondary font-medium uppercase tracking-wider mr-1 flex items-center gap-1">
              ${getIcon('flame', { class: 'w-3.5 h-3.5 text-primary' })} Hot Areas:
            </span>
            ${['New Baneshwor', 'Jhamsikhel', 'Lakeside Pokhara', 'Pulchowk', 'Baluwatar', 'Koteshwor', 'Thamel', 'Sanepa'].map(area => `
              <button type="button" class="quick-area-chip btn-press px-3 py-1 rounded-full bg-white hover:bg-bg text-text-secondary hover:text-text-primary text-xs border border-[#F0EBE3] transition-colors cursor-pointer" data-area="${area}">
                ${area}
              </button>
            `).join('')}
          </div>

          <!-- Category Filter Pills -->
          <div class="flex items-center gap-2 mt-4 overflow-x-auto pb-1 no-scrollbar" id="category-pills">
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
                ? 'bg-primary text-white shadow-xs border-primary' 
                : 'bg-white hover:bg-bg text-text-secondary hover:text-text-primary border-[#F0EBE3]';
              return `
                <button type="button" class="category-pill-btn btn-press shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${activeClass}" data-cat="${cat.id}">
                  ${cat.isEmoji ? `<span class="text-[13px]">${cat.icon}</span>` : getIcon(cat.icon, { class: 'w-3.5 h-3.5' })}
                  <span>${cat.label}</span>
                </button>
              `;
            }).join('')}
          </div>
        </section>

        <!-- Listings Section -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16 pt-4">
          <!-- Section Bar -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#F0EBE3]">
            <div>
              <h2 class="text-lg font-bold text-text-primary">Featured Rentals Across Nepal</h2>
              <p id="results-count" class="text-xs text-text-secondary mt-0.5">
                Loading verified listings...
              </p>
            </div>
            
            <div class="flex items-center gap-2 self-end sm:self-auto">
              <label class="text-xs text-text-secondary hidden md:inline" for="sort-dropdown">Sort by:</label>
              <div class="relative">
                <select id="sort-dropdown" class="appearance-none pl-3 pr-7 py-1.5 bg-white rounded-[8px] text-xs font-medium text-text-primary border border-[#F0EBE3] focus:outline-none cursor-pointer">
                  <option value="newest" ${initialSort === 'newest' ? 'selected' : ''}>Newest First (नयाँ)</option>
                  <option value="price_asc" ${initialSort === 'price_asc' ? 'selected' : ''}>Price: Low to High (सस्तो देखि)</option>
                  <option value="price_desc" ${initialSort === 'price_desc' ? 'selected' : ''}>Price: High to Low (महँगो देखि)</option>
                </select>
                <span class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-text-muted">
                  ${getIcon('chevron-down', { class: 'w-3.5 h-3.5' })}
                </span>
              </div>
            </div>
          </div>

          <!-- Listings Grid -->
          <div id="listings-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Warm Shimmer Skeletons on initial load -->
            ${[1, 2, 3, 4, 5, 6].map(() => `
              <div class="bg-white rounded-[12px] border border-[#F0EBE3] overflow-hidden shadow-card">
                <div class="aspect-[4/3] w-full skeleton-shimmer"></div>
                <div class="p-4 flex flex-col gap-2.5">
                  <div class="h-4 w-1/3 skeleton-shimmer"></div>
                  <div class="h-4 w-3/4 skeleton-shimmer"></div>
                  <div class="h-3 w-1/2 skeleton-shimmer"></div>
                  <div class="pt-2 border-t border-[#F0EBE3] flex gap-2">
                    <div class="h-8 flex-1 skeleton-shimmer"></div>
                    <div class="h-8 flex-1 skeleton-shimmer"></div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;

    // State
    let currentCategory = initialCategory;
    let currentQuery = initialQuery;
    let currentPrice = initialPrice;
    let currentSort = initialSort;

    async function loadListings() {
      const grid = document.getElementById('listings-grid');
      const countEl = document.getElementById('results-count');
      if (!grid) return;

      // Show warm skeleton state while loading
      grid.innerHTML = [1, 2, 3, 4, 5, 6].map(() => `
        <div class="bg-white rounded-[12px] border border-[#F0EBE3] overflow-hidden shadow-card">
          <div class="aspect-[4/3] w-full skeleton-shimmer"></div>
          <div class="p-4 flex flex-col gap-2.5">
            <div class="h-4 w-1/3 skeleton-shimmer"></div>
            <div class="h-4 w-3/4 skeleton-shimmer"></div>
            <div class="h-3 w-1/2 skeleton-shimmer"></div>
            <div class="pt-2 border-t border-[#F0EBE3] flex gap-2">
              <div class="h-8 flex-1 skeleton-shimmer"></div>
              <div class="h-8 flex-1 skeleton-shimmer"></div>
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
          <div class="col-span-full p-6 text-center bg-error-light border border-error/20 rounded-[12px] text-error text-xs">
            Failed to load listings: ${error.message}
          </div>
        `;
        return;
      }

      if (countEl) {
        countEl.textContent = `Showing ${listings?.length || 0} curated rentals • 100% direct owner contact`;
      }

      if (!listings || listings.length === 0) {
        grid.innerHTML = `
          <div class="col-span-full py-16 text-center bg-white rounded-[12px] p-8 border border-dashed border-[#F0EBE3]">
            <div class="w-12 h-12 rounded-full bg-bg flex items-center justify-center mx-auto mb-3 text-text-muted">
              ${getIcon('search', { class: 'w-6 h-6' })}
            </div>
            <h3 class="text-base font-bold text-text-primary mb-1">No listings found</h3>
            <p class="text-xs text-text-secondary mb-4">Try clearing filters or searching for another neighborhood.</p>
            <button id="reset-filters-btn" class="btn-press px-4 py-2 rounded-[8px] bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs">Clear Filters</button>
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
        room: 'Single Room (कोठा)',
        flat: 'Full Flat (फ्ल्याट)',
        commercial: 'Shutter / Office',
        land: 'Land (जग्गा)',
        vehicle: 'Vehicle (सवारी)',
        other: 'Rental Property'
      };

      // Airbnb-standard listing cards: large 4:3 photo dominant, bold price second, title below, location + category muted tags
      grid.innerHTML = listings.map((item, index) => {
        const photo = item.photos?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80';
        const formattedPrice = Number(item.price).toLocaleString('en-IN');
        const badge = categoryBadges[item.category] || 'Rental';
        const cleanPhone = (item.contact_phone || '').replace(/[^0-9]/g, '');
        const waUrl = `https://wa.me/977${cleanPhone}?text=${encodeURIComponent(`Namaste, I am interested in your listing "${item.title}" on GharBhada.`)}`;
        const staggerDelay = Math.min(index * 50, 350);

        return `
          <article class="card-airbnb card-stagger group flex flex-col overflow-hidden" style="animation-delay: ${staggerDelay}ms;">
            <!-- 1. Dominant 4:3 Photo -->
            <a href="#/listing/${item.id}" class="relative aspect-[4/3] w-full overflow-hidden bg-[#F5EFE6] block cursor-pointer">
              <img class="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300" src="${photo}" alt="${item.title}" loading="lazy"/>
              
              <!-- Subtle Category Chip -->
              <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-text-primary text-[11px] font-medium shadow-card border border-[#F0EBE3]">
                ${badge}
              </span>
            </a>

            <!-- 2. Card Body: Price dominant, title below, muted tags -->
            <div class="p-4 flex flex-col flex-grow justify-between gap-3">
              <div>
                <!-- Price (second-most prominent element) -->
                <div class="flex items-baseline gap-1">
                  <span class="text-lg font-bold text-text-primary">रु ${formattedPrice}</span>
                  <span class="text-xs text-text-secondary">/ month</span>
                  ${item.is_negotiable ? `<span class="ml-auto text-[11px] text-sage font-medium">Negotiable</span>` : ''}
                </div>

                <!-- Listing Title -->
                <a href="#/listing/${item.id}" class="block group-hover:text-primary transition-colors cursor-pointer mt-1">
                  <h3 class="text-sm font-semibold text-text-primary line-clamp-1 leading-snug">
                    ${item.title}
                  </h3>
                </a>

                <!-- Location & Category Muted Tags -->
                <p class="text-xs text-text-secondary flex items-center gap-1 mt-1">
                  ${getIcon('map-pin', { class: 'w-3.5 h-3.5 text-primary shrink-0' })}
                  <span class="truncate">${item.location_area}, ${item.location_city}</span>
                </p>

                <!-- Amenity Highlights -->
                <div class="flex flex-wrap gap-1.5 mt-2.5">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-bg text-text-secondary text-[11px] font-medium border border-[#F0EBE3]">
                    ${getIcon('check-circle', { class: 'w-3 h-3 text-success' })} Verified
                  </span>
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-bg text-text-secondary text-[11px] font-medium border border-[#F0EBE3]">
                    ${getIcon('droplet', { class: 'w-3 h-3 text-primary' })} ${item.water_facility || '24/7 Water'}
                  </span>
                </div>
              </div>

              <!-- Quick Action Bar -->
              <div class="pt-3 border-t border-[#F0EBE3] flex items-center gap-2">
                <a class="btn-press flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-[8px] bg-white hover:bg-bg text-text-primary text-xs font-medium border border-[#F0EBE3] transition-colors" href="${waUrl}" target="_blank" rel="noopener noreferrer">
                  ${getIcon('message-circle', { class: 'w-3.5 h-3.5 text-whatsapp' })}
                  <span>WhatsApp</span>
                </a>
                <a class="btn-press flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-[8px] bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-colors" href="tel:${cleanPhone}">
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
          pill.className = 'category-pill-btn btn-press shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer bg-primary text-white shadow-xs border-primary';
        } else {
          pill.className = 'category-pill-btn btn-press shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer bg-white hover:bg-bg text-text-secondary hover:text-text-primary border-[#F0EBE3]';
        }
      });
    }

    // Event listeners
    document.getElementById('search-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      currentQuery = document.getElementById('search-input').value;
      currentCategory = document.getElementById('category-select').value;
      currentPrice = document.getElementById('price-select').value;
      updatePillsUI();
      loadListings();
    });

    document.getElementById('category-select')?.addEventListener('change', (e) => {
      currentCategory = e.target.value;
      updatePillsUI();
      loadListings();
    });

    document.getElementById('price-select')?.addEventListener('change', (e) => {
      currentPrice = e.target.value;
      loadListings();
    });

    document.getElementById('sort-dropdown')?.addEventListener('change', (e) => {
      currentSort = e.target.value;
      loadListings();
    });

    document.querySelectorAll('.category-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategory = btn.getAttribute('data-cat');
        const select = document.getElementById('category-select');
        if (select) select.value = currentCategory;
        updatePillsUI();
        loadListings();
      });
    });

    document.querySelectorAll('.quick-area-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const area = chip.getAttribute('data-area');
        currentQuery = area;
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = area;
        loadListings();
      });
    });

    loadListings();
  }
};
