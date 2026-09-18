import { supabase } from '../lib/supabase.js';
import { getCurrentUser } from '../lib/auth.js';
import { showToast } from '../lib/toast.js';
import { navigateTo } from '../lib/router.js';
import { getIcon } from '../lib/icons.js';

export const DetailView = {
  async render(container, { params }) {
    const listingId = params?.id;

    if (!listingId) {
      container.innerHTML = `
        <div class="max-w-xl mx-auto my-16 p-8 text-center bg-white rounded-xl shadow-xs border border-slate-200">
          <p class="text-rose-600 font-bold mb-4">No listing specified.</p>
          <a href="#/" class="btn-interactive px-4 py-2 bg-primary text-white rounded-lg text-xs font-semibold">Back to Browse</a>
        </div>
      `;
      return;
    }

    // Animated Skeleton Loader while fetching
    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full animate-fade-in">
        <!-- Skeleton Header -->
        <div class="flex flex-col gap-2 mb-6">
          <div class="h-4 w-48 skeleton rounded"></div>
          <div class="h-7 w-3/4 skeleton rounded"></div>
          <div class="h-4 w-1/3 skeleton rounded"></div>
        </div>

        <!-- Skeleton Image Gallery -->
        <div class="w-full h-72 sm:h-96 skeleton rounded-xl mb-6"></div>

        <!-- Skeleton Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-8 flex flex-col gap-4">
            <div class="h-28 w-full skeleton rounded-xl"></div>
            <div class="h-40 w-full skeleton rounded-xl"></div>
          </div>
          <div class="lg:col-span-4 h-64 skeleton rounded-xl"></div>
        </div>
      </div>
    `;

    const { data: listing, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', listingId)
      .single();

    if (error || !listing) {
      container.innerHTML = `
        <div class="max-w-xl mx-auto my-16 p-8 text-center bg-white rounded-xl shadow-xs border border-slate-200">
          <div class="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3">
            ${getIcon('alert-triangle', { class: 'w-6 h-6' })}
          </div>
          <h2 class="text-base font-bold text-slate-800 mb-1">Listing Not Found</h2>
          <p class="text-xs text-slate-500 mb-4">This listing may have been rented out or removed by the landlord.</p>
          <a href="#/" class="btn-interactive px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold inline-block">Browse All Rentals</a>
        </div>
      `;
      return;
    }

    const currentUser = getCurrentUser();
    const isOwner = currentUser && currentUser.id === listing.user_id;

    const photos = listing.photos && listing.photos.length > 0
      ? listing.photos
      : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'];

    const formattedPrice = Number(listing.price).toLocaleString('en-IN');
    const cleanPhone = (listing.contact_phone || '').replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('977') ? cleanPhone : `977${cleanPhone}`;
    const contactName = listing.contact_name || 'Landlord / घरधनी';

    // Deep links
    const waUrl = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(`Namaste ${contactName}-ji, I am interested in your "${listing.title}" listed on GharBhada (ID: ${listing.id.substring(0, 8)}). Is it still available?`)}`;
    const viberUrl = `viber://chat?number=%2B${phoneWithCountry}`;
    const telUrl = `tel:+${phoneWithCountry}`;

    const categoryLabels = {
      room: 'Single Room (कोठा)',
      flat: 'Full Flat / Apartment (फ्ल्याट)',
      commercial: 'Commercial / Shutter (सटर/पसल)',
      land: 'Open Land / Plot (जग्गा)',
      vehicle: 'Vehicle Rental (सवारी साधन)',
      other: 'Rental Property'
    };

    container.innerHTML = `
      <div class="w-full min-h-screen pb-16">
        <!-- Top Breadcrumbs & Actions -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <nav class="flex items-center gap-1.5 text-slate-500">
              <a href="#/" class="hover:text-primary transition-colors">Home (गृहपृष्ठ)</a>
              ${getIcon('chevron-right', { class: 'w-3 h-3 text-slate-400' })}
              <a href="#/?cat=${listing.category}" class="hover:text-primary transition-colors">${categoryLabels[listing.category] || listing.category}</a>
              ${getIcon('chevron-right', { class: 'w-3 h-3 text-slate-400' })}
              <span class="text-slate-800 font-semibold truncate max-w-[200px]">${listing.location_area}</span>
            </nav>

            <div class="flex items-center gap-2">
              ${isOwner ? `
                <a href="#/edit/${listing.id}" class="btn-interactive inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors border border-slate-200/80">
                  ${getIcon('edit', { class: 'w-3.5 h-3.5 text-slate-600' })}
                  <span>Edit Listing</span>
                </a>
              ` : ''}
              <button id="share-btn" class="btn-interactive inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors border border-slate-200/80">
                ${getIcon('share-2', { class: 'w-3.5 h-3.5 text-slate-600' })}
                <span>Share</span>
              </button>
            </div>
          </div>

          <!-- Title & Area Header -->
          <div class="mt-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2.5 py-0.5 rounded-md bg-primary-light text-primary text-[11px] font-semibold border border-primary/20">
                  ${categoryLabels[listing.category] || 'Rental Space'}
                </span>
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px] font-semibold">
                  ${getIcon('check-circle', { class: 'w-3 h-3 text-emerald-600' })} Verified Owner
                </span>
                <span class="text-slate-400 text-[11px]">
                  Listed ${new Date(listing.created_at).toLocaleDateString('en-GB')}
                </span>
              </div>
              <h1 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                ${listing.title}
              </h1>
              <p class="text-xs text-slate-500 flex items-center gap-1 mt-1">
                ${getIcon('map-pin', { class: 'w-3.5 h-3.5 text-primary shrink-0' })}
                <span>${listing.location_area}, ${listing.location_city}</span>
                ${listing.landmark ? `<span class="text-slate-300">•</span> <span class="text-secondary font-medium">${listing.landmark}</span>` : ''}
              </p>
            </div>

            <!-- Price Card Header (Desktop) -->
            <div class="hidden md:flex flex-col items-end bg-white p-3 px-5 rounded-xl border border-slate-200/80 shadow-xs">
              <span class="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Monthly Rental</span>
              <div class="flex items-baseline gap-1">
                <span class="text-2xl font-bold text-primary">रु ${formattedPrice}</span>
                <span class="text-xs text-slate-500">/ month</span>
              </div>
              ${listing.is_negotiable ? '<span class="text-[11px] text-secondary font-medium">Price Negotiable (छलफल गर्न सकिने)</span>' : ''}
            </div>
          </div>
        </section>

        <!-- Interactive Image Carousel with Smooth Transitions -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div class="relative rounded-xl overflow-hidden border border-slate-200/80 shadow-xs bg-slate-900 group select-none">
            <!-- Main Slide Viewport -->
            <div id="carousel-viewport" class="relative w-full h-[280px] sm:h-[380px] md:h-[460px] overflow-hidden">
              ${photos.map((src, idx) => `
                <div class="carousel-slide absolute inset-0 transition-opacity duration-300 ease-out ${idx === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}" data-slide-index="${idx}">
                  <img src="${src}" class="w-full h-full object-cover" alt="${listing.title} - photo ${idx + 1}"/>
                  <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                </div>
              `).join('')}
            </div>

            <!-- Left & Right Arrow Controls -->
            ${photos.length > 1 ? `
              <button id="carousel-prev-btn" class="btn-interactive absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-transform" aria-label="Previous photo">
                ${getIcon('chevron-left', { class: 'w-5 h-5' })}
              </button>
              <button id="carousel-next-btn" class="btn-interactive absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-transform" aria-label="Next photo">
                ${getIcon('chevron-right', { class: 'w-5 h-5' })}
              </button>
            ` : ''}

            <!-- Slide Counter Badge -->
            <div class="absolute bottom-3 right-3 z-20 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
              <span id="carousel-active-index">1</span> / ${photos.length} Photos
            </div>

            <!-- Dot Indicators (for quick navigation) -->
            ${photos.length > 1 ? `
              <div class="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                ${photos.map((_, idx) => `
                  <button type="button" class="carousel-dot w-2 h-2 rounded-full transition-all ${idx === 0 ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}" data-slide-target="${idx}" aria-label="Go to slide ${idx + 1}"></button>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Thumbnail Strip (Smooth Slide Selection) -->
          ${photos.length > 1 ? `
            <div class="flex items-center gap-2 mt-2 overflow-x-auto pb-1 no-scrollbar" id="thumbnail-strip">
              ${photos.map((src, idx) => `
                <button type="button" class="thumbnail-item shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${idx === 0 ? 'border-primary shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'}" data-thumb-target="${idx}">
                  <img src="${src}" class="w-full h-full object-cover"/>
                </button>
              `).join('')}
            </div>
          ` : ''}
        </section>

        <!-- Main Content 2-Column Grid -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            <!-- Left 8 Columns: Details, Description, Specs -->
            <div class="lg:col-span-8 flex flex-col gap-4 min-w-0">
              
              <!-- Quick Overview Bento Bar -->
              <div class="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                <p class="text-[11px] font-bold text-primary uppercase tracking-wider mb-3">Property Overview (मुख्य विवरण)</p>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-primary">
                      ${getIcon('bed', { class: 'w-4 h-4' })}
                    </div>
                    <div>
                      <span class="text-[10px] text-slate-500 block">Bedrooms</span>
                      <span class="text-xs font-bold text-slate-900">${listing.bedrooms || 1} Bed${(listing.bedrooms || 1) > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-secondary">
                      ${getIcon('bath', { class: 'w-4 h-4' })}
                    </div>
                    <div>
                      <span class="text-[10px] text-slate-500 block">Bathrooms</span>
                      <span class="text-xs font-bold text-slate-900">${listing.bathrooms || 1} Bath</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sky-600">
                      ${getIcon('droplet', { class: 'w-4 h-4' })}
                    </div>
                    <div>
                      <span class="text-[10px] text-slate-500 block">Water Supply</span>
                      <span class="text-xs font-bold text-slate-900 truncate">${listing.water_facility || '24/7 Supply'}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-primary">
                      ${getIcon('handshake', { class: 'w-4 h-4' })}
                    </div>
                    <div>
                      <span class="text-[10px] text-slate-500 block">Negotiable</span>
                      <span class="text-xs font-bold text-slate-900">${listing.is_negotiable ? 'Yes (छलफल)' : 'Fixed'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Description Narrative -->
              <div class="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col gap-2.5">
                <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h2 class="text-sm font-bold text-slate-900">About This Space (सम्पत्ति विवरण)</h2>
                  <span class="text-xs text-secondary font-medium">Direct from Landlord</span>
                </div>
                
                <div class="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
                  ${listing.description || 'No detailed description provided.'}
                </div>
              </div>

              <!-- Key Amenities Grid -->
              <div class="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col gap-3">
                <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h2 class="text-sm font-bold text-slate-900">Amenities & Features (सुविधाहरू)</h2>
                  <span class="text-xs text-secondary font-semibold">Verified Highlights</span>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div class="flex flex-col items-center text-center p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                    <div class="text-primary mb-1">${getIcon('droplet', { class: 'w-4 h-4' })}</div>
                    <span class="text-xs font-bold text-slate-800">24/7 Water</span>
                    <span class="text-[10px] text-slate-500">बोरिङ + मेलम्ची</span>
                  </div>

                  <div class="flex flex-col items-center text-center p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                    <div class="text-secondary mb-1">${getIcon('shield', { class: 'w-4 h-4' })}</div>
                    <span class="text-xs font-bold text-slate-800">Parking</span>
                    <span class="text-[10px] text-slate-500">Bike / Car Slot</span>
                  </div>

                  <div class="flex flex-col items-center text-center p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                    <div class="text-amber-600 mb-1">${getIcon('sun', { class: 'w-4 h-4' })}</div>
                    <span class="text-xs font-bold text-slate-800">Solar Hot Water</span>
                    <span class="text-[10px] text-slate-500">तातो पानी सुविधा</span>
                  </div>

                  <div class="flex flex-col items-center text-center p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                    <div class="text-sky-600 mb-1">${getIcon('wifi', { class: 'w-4 h-4' })}</div>
                    <span class="text-xs font-bold text-slate-800">Fiber Internet</span>
                    <span class="text-[10px] text-slate-500">High Speed Ready</span>
                  </div>
                </div>
              </div>

              <!-- Location Map Notice -->
              <div class="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-sm font-bold text-slate-900">Location & Neighborhood</h3>
                  <span class="text-xs text-primary font-bold">${listing.location_area}</span>
                </div>
                <div class="w-full h-36 bg-slate-50 rounded-xl flex flex-col items-center justify-center p-4 text-center border border-slate-200/80">
                  ${getIcon('map-pin', { class: 'w-6 h-6 text-primary mb-1' })}
                  <p class="text-xs sm:text-sm font-bold text-slate-900">${listing.location_area}, ${listing.location_city}</p>
                  ${listing.landmark ? `<p class="text-xs text-slate-500 mt-0.5">Landmark: ${listing.landmark}</p>` : ''}
                  <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${listing.location_area}, ${listing.location_city}, Nepal`)}" target="_blank" rel="noopener noreferrer" class="btn-interactive mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors border border-slate-200/80">
                    ${getIcon('external-link', { class: 'w-3.5 h-3.5 text-slate-500' })}
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- Right 4 Columns: Sticky Landlord Contact Card -->
            <div class="lg:col-span-4 lg:sticky lg:top-20 flex flex-col gap-4">
              
              <!-- Contact Card -->
              <div class="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col gap-3.5">
                
                <!-- Price Display -->
                <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span class="text-[10px] text-slate-500 uppercase tracking-wide block">Monthly Rent</span>
                    <span class="text-2xl font-bold text-primary">रु ${formattedPrice}</span>
                  </div>
                  <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60">
                    तुरुन्त खाली
                  </span>
                </div>

                <!-- Landlord Profile Summary -->
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-base shrink-0 border border-primary/20">
                    ${contactName[0].toUpperCase()}
                  </div>
                  <div class="min-w-0 flex-1">
                    <h4 class="text-sm font-bold text-slate-900 truncate">${contactName}</h4>
                    <p class="text-xs text-primary font-medium">घरधनी (Property Owner)</p>
                    <p class="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      ${getIcon('shield-check', { class: 'w-3.5 h-3.5 text-emerald-600' })}
                      <span>ID & Phone Verified</span>
                    </p>
                  </div>
                </div>

                <!-- Direct Communication Channels -->
                <div class="flex flex-col gap-2 pt-1">
                  <!-- WhatsApp -->
                  <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-interactive w-full py-2.5 px-3 rounded-lg bg-[#25D366] hover:brightness-105 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs">
                    ${getIcon('message-circle', { class: 'w-4 h-4' })}
                    <span>Chat on WhatsApp (${listing.contact_phone})</span>
                  </a>

                  <!-- Viber -->
                  <a href="${viberUrl}" class="btn-interactive w-full py-2.5 px-3 rounded-lg bg-[#7360F2] hover:brightness-105 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs">
                    ${getIcon('phone', { class: 'w-4 h-4' })}
                    <span>Connect on Viber</span>
                  </a>

                  <!-- Phone Call -->
                  <a href="${telUrl}" class="btn-interactive w-full py-2.5 px-3 rounded-lg bg-secondary hover:bg-secondary-hover text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs">
                    ${getIcon('phone-call', { class: 'w-4 h-4' })}
                    <span>Call Now: ${listing.contact_phone}</span>
                  </a>
                </div>

                <!-- Renter Safety Box -->
                <div class="p-3 rounded-lg bg-slate-50 text-slate-700 flex flex-col gap-1 text-[11px] border border-slate-200/60">
                  <div class="flex items-center gap-1 text-primary font-bold">
                    <span>🇳🇵</span> Renter Safety Tip:
                  </div>
                  <p class="text-slate-500 leading-relaxed">
                    Never pay advance booking charges online without inspecting the property and meeting the owner in person. GharBhada has 100% zero broker charges.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
    `;

    // Initialize Interactive Carousel Logic
    let activeIndex = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const thumbs = document.querySelectorAll('.thumbnail-item');
    const counterEl = document.getElementById('carousel-active-index');

    function goToSlide(index) {
      if (index < 0) index = photos.length - 1;
      if (index >= photos.length) index = 0;
      activeIndex = index;

      // Update slide opacity
      slides.forEach((slide, idx) => {
        if (idx === activeIndex) {
          slide.classList.remove('opacity-0', 'z-0', 'pointer-events-none');
          slide.classList.add('opacity-100', 'z-10');
        } else {
          slide.classList.remove('opacity-100', 'z-10');
          slide.classList.add('opacity-0', 'z-0', 'pointer-events-none');
        }
      });

      // Update dots
      dots.forEach((dot, idx) => {
        if (idx === activeIndex) {
          dot.className = 'carousel-dot w-2 h-2 rounded-full transition-all bg-white scale-125';
        } else {
          dot.className = 'carousel-dot w-2 h-2 rounded-full transition-all bg-white/50 hover:bg-white/75';
        }
      });

      // Update thumbnails
      thumbs.forEach((thumb, idx) => {
        if (idx === activeIndex) {
          thumb.className = 'thumbnail-item shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 border-primary shadow-xs transition-all cursor-pointer';
          thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
          thumb.className = 'thumbnail-item shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 border-transparent opacity-70 hover:opacity-100 transition-all cursor-pointer';
        }
      });

      // Update counter
      if (counterEl) counterEl.textContent = activeIndex + 1;
    }

    document.getElementById('carousel-prev-btn')?.addEventListener('click', () => goToSlide(activeIndex - 1));
    document.getElementById('carousel-next-btn')?.addEventListener('click', () => goToSlide(activeIndex + 1));

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const target = parseInt(dot.getAttribute('data-slide-target'), 10);
        goToSlide(target);
      });
    });

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const target = parseInt(thumb.getAttribute('data-thumb-target'), 10);
        goToSlide(target);
      });
    });

    // Touch swipe support for mobile
    const viewport = document.getElementById('carousel-viewport');
    let touchStartX = 0;
    let touchEndX = 0;

    viewport?.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewport?.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          goToSlide(activeIndex + 1); // Swipe left -> next
        } else {
          goToSlide(activeIndex - 1); // Swipe right -> prev
        }
      }
    }, { passive: true });

    // Share button
    document.getElementById('share-btn')?.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: listing.title,
            text: `Check out this rental on GharBhada: ${listing.title}`,
            url: window.location.href,
          });
        } catch (e) {
          navigator.clipboard.writeText(window.location.href);
          showToast('Listing link copied to clipboard!');
        }
      } else {
        navigator.clipboard.writeText(window.location.href);
        showToast('Listing link copied to clipboard!');
      }
    });
  }
};
