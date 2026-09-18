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
        <div class="max-w-xl mx-auto my-16 p-8 text-center bg-white rounded-[12px] shadow-card border border-[#F0EBE3]">
          <p class="text-[#C1543D] font-medium mb-4">No listing specified.</p>
          <a href="#/" class="btn-press inline-flex items-center px-4 py-2 bg-[#D97757] text-white rounded-[8px] text-sm font-medium">Back to Browse</a>
        </div>
      `;
      return;
    }

    // World-Class Warm Shimmer Skeleton Loader
    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full page-transition">
        <!-- Skeleton Header -->
        <div class="flex flex-col gap-2.5 mb-6">
          <div class="h-4 w-48 skeleton-shimmer rounded-[6px]"></div>
          <div class="h-8 w-2/3 skeleton-shimmer rounded-[8px]"></div>
          <div class="h-4 w-1/3 skeleton-shimmer rounded-[6px]"></div>
        </div>

        <!-- Skeleton Carousel -->
        <div class="w-full h-72 sm:h-[420px] skeleton-shimmer rounded-[12px] mb-6"></div>

        <!-- Skeleton Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-8 flex flex-col gap-4">
            <div class="h-28 w-full skeleton-shimmer rounded-[12px]"></div>
            <div class="h-44 w-full skeleton-shimmer rounded-[12px]"></div>
          </div>
          <div class="lg:col-span-4 h-72 skeleton-shimmer rounded-[12px]"></div>
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
        <div class="max-w-xl mx-auto my-16 p-8 text-center bg-white rounded-[12px] shadow-card border border-[#F0EBE3]">
          <div class="w-12 h-12 rounded-full bg-[#FDF0EC] text-[#C1543D] flex items-center justify-center mx-auto mb-3">
            ${getIcon('alert-triangle', { class: 'w-6 h-6' })}
          </div>
          <h2 class="text-base font-semibold text-[#1F1B16] mb-1">Listing Not Found</h2>
          <p class="text-sm text-[#6B6258] mb-5">This listing may have been rented out or removed by the landlord.</p>
          <a href="#/" class="btn-press inline-flex items-center px-4 py-2 bg-[#D97757] hover:bg-[#c66849] text-white rounded-[8px] text-sm font-medium">Browse All Rentals</a>
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
      <div class="w-full min-h-screen pb-16 page-transition">
        <!-- Top Breadcrumbs & Actions -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <nav class="flex items-center gap-1.5 text-[#6B6258]">
              <a href="#/" class="hover:text-[#D97757] transition-colors">Home (गृहपृष्ठ)</a>
              ${getIcon('chevron-right', { class: 'w-3 h-3 text-[#6B6258]/60' })}
              <a href="#/?cat=${listing.category}" class="hover:text-[#D97757] transition-colors">${categoryLabels[listing.category] || listing.category}</a>
              ${getIcon('chevron-right', { class: 'w-3 h-3 text-[#6B6258]/60' })}
              <span class="text-[#1F1B16] font-medium truncate max-w-[200px]">${listing.location_area}</span>
            </nav>

            <div class="flex items-center gap-2">
              ${isOwner ? `
                <a href="#/edit/${listing.id}" class="btn-press inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-white hover:bg-[#FDFBF7] text-[#1F1B16] text-xs font-medium transition-colors border border-[#F0EBE3] shadow-card">
                  ${getIcon('edit', { class: 'w-3.5 h-3.5 text-[#6B6258]' })}
                  <span>Edit Listing</span>
                </a>
              ` : ''}
              <button id="share-btn" class="btn-press inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-white hover:bg-[#FDFBF7] text-[#1F1B16] text-xs font-medium transition-colors border border-[#F0EBE3] shadow-card">
                ${getIcon('share-2', { class: 'w-3.5 h-3.5 text-[#6B6258]' })}
                <span>Share</span>
              </button>
            </div>
          </div>

          <!-- Title & Area Header -->
          <div class="mt-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <span class="px-2.5 py-0.5 rounded-[8px] bg-[#F7F3EC] text-[#7C9885] text-[11px] font-semibold border border-[#7C9885]/20">
                  ${categoryLabels[listing.category] || 'Rental Space'}
                </span>
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[8px] bg-[#EEF4F0] text-[#5B8266] border border-[#5B8266]/20 text-[11px] font-semibold">
                  ${getIcon('check-circle', { class: 'w-3 h-3 text-[#5B8266]' })} Verified Owner
                </span>
                <span class="text-[#6B6258] text-[11px]">
                  Listed ${new Date(listing.created_at).toLocaleDateString('en-GB')}
                </span>
              </div>
              <h1 class="text-xl sm:text-2xl font-semibold text-[#1F1B16] tracking-tight leading-tight">
                ${listing.title}
              </h1>
              <p class="text-sm text-[#6B6258] flex items-center gap-1 mt-1">
                ${getIcon('map-pin', { class: 'w-3.5 h-3.5 text-[#D97757] shrink-0' })}
                <span>${listing.location_area}, ${listing.location_city}</span>
                ${listing.landmark ? `<span class="text-[#F0EBE3]">•</span> <span class="text-[#7C9885] font-medium">${listing.landmark}</span>` : ''}
              </p>
            </div>

            <!-- Price Card Header (Desktop) -->
            <div class="hidden md:flex flex-col items-end bg-white p-3 px-5 rounded-[12px] border border-[#F0EBE3] shadow-card">
              <span class="text-[10px] uppercase font-semibold text-[#6B6258] tracking-wider">Monthly Rental</span>
              <div class="flex items-baseline gap-1">
                <span class="text-2xl font-bold text-[#D97757]">रु ${formattedPrice}</span>
                <span class="text-xs text-[#6B6258]">/ month</span>
              </div>
              ${listing.is_negotiable ? '<span class="text-[11px] text-[#7C9885] font-medium">Price Negotiable (छलफल गर्न सकिने)</span>' : ''}
            </div>
          </div>
        </section>

        <!-- Interactive Image Carousel with Smooth Slide Transition -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div class="relative rounded-[12px] overflow-hidden border border-[#F0EBE3] shadow-card bg-[#1F1B16] group select-none">
            <!-- Main Slide Viewport -->
            <div id="carousel-viewport" class="relative w-full h-[280px] sm:h-[380px] md:h-[460px] overflow-hidden">
              ${photos.map((src, idx) => `
                <div class="carousel-slide absolute inset-0 transition-opacity duration-200 ease-out ${idx === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}" data-slide-index="${idx}">
                  <img src="${src}" class="w-full h-full object-cover" alt="${listing.title} - photo ${idx + 1}"/>
                  <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                </div>
              `).join('')}
            </div>

            <!-- Left & Right Arrow Controls -->
            ${photos.length > 1 ? `
              <button id="carousel-prev-btn" class="btn-press absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-[#1F1B16] flex items-center justify-center shadow-md transition-transform" aria-label="Previous photo">
                ${getIcon('chevron-left', { class: 'w-5 h-5' })}
              </button>
              <button id="carousel-next-btn" class="btn-press absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-[#1F1B16] flex items-center justify-center shadow-md transition-transform" aria-label="Next photo">
                ${getIcon('chevron-right', { class: 'w-5 h-5' })}
              </button>
            ` : ''}

            <!-- Slide Counter Badge -->
            <div class="absolute bottom-3 right-3 z-20 px-2.5 py-1 rounded-[8px] bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
              <span id="carousel-active-index">1</span> / ${photos.length} Photos
            </div>

            <!-- Dot Indicators -->
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
            <div class="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1 no-scrollbar" id="thumbnail-strip">
              ${photos.map((src, idx) => `
                <button type="button" class="thumbnail-item shrink-0 w-16 h-12 rounded-[8px] overflow-hidden border-2 transition-all cursor-pointer ${idx === 0 ? 'border-[#D97757] shadow-card' : 'border-transparent opacity-70 hover:opacity-100'}" data-thumb-target="${idx}">
                  <img src="${src}" class="w-full h-full object-cover" alt="Thumb ${idx + 1}"/>
                </button>
              `).join('')}
            </div>
          ` : ''}
        </section>

        <!-- Main Content 2-Column Grid -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            <!-- Left 8 Columns: Details, Description, Specs -->
            <div class="lg:col-span-8 flex flex-col gap-5 min-w-0">
              
              <!-- Quick Overview Bar -->
              <div class="bg-white rounded-[12px] p-5 border border-[#F0EBE3] shadow-card">
                <p class="text-[11px] font-semibold text-[#D97757] uppercase tracking-wider mb-3">Property Overview (मुख्य विवरण)</p>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div class="flex items-center gap-2.5">
                    <div class="w-9 h-9 rounded-[8px] bg-[#FDF0EC] flex items-center justify-center text-[#D97757]">
                      ${getIcon('bed', { class: 'w-4 h-4' })}
                    </div>
                    <div>
                      <span class="text-[11px] text-[#6B6258] block">Bedrooms</span>
                      <span class="text-sm font-semibold text-[#1F1B16]">${listing.bedrooms || 1} Bed${(listing.bedrooms || 1) > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2.5">
                    <div class="w-9 h-9 rounded-[8px] bg-[#EEF4F0] flex items-center justify-center text-[#7C9885]">
                      ${getIcon('bath', { class: 'w-4 h-4' })}
                    </div>
                    <div>
                      <span class="text-[11px] text-[#6B6258] block">Bathrooms</span>
                      <span class="text-sm font-semibold text-[#1F1B16]">${listing.bathrooms || 1} Bath</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2.5">
                    <div class="w-9 h-9 rounded-[8px] bg-[#F7F3EC] flex items-center justify-center text-[#7C9885]">
                      ${getIcon('droplet', { class: 'w-4 h-4' })}
                    </div>
                    <div>
                      <span class="text-[11px] text-[#6B6258] block">Water Supply</span>
                      <span class="text-sm font-semibold text-[#1F1B16] truncate">${listing.water_facility || '24/7 Supply'}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2.5">
                    <div class="w-9 h-9 rounded-[8px] bg-[#FDF0EC] flex items-center justify-center text-[#D97757]">
                      ${getIcon('handshake', { class: 'w-4 h-4' })}
                    </div>
                    <div>
                      <span class="text-[11px] text-[#6B6258] block">Negotiable</span>
                      <span class="text-sm font-semibold text-[#1F1B16]">${listing.is_negotiable ? 'Yes (छलफल)' : 'Fixed'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Description Narrative -->
              <div class="bg-white rounded-[12px] p-5 border border-[#F0EBE3] shadow-card flex flex-col gap-3">
                <div class="flex items-center justify-between border-b border-[#F0EBE3] pb-3">
                  <h2 class="text-base font-semibold text-[#1F1B16]">About This Space (सम्पत्ति विवरण)</h2>
                  <span class="text-xs text-[#7C9885] font-medium">Direct from Landlord</span>
                </div>
                
                <div class="text-sm text-[#1F1B16] leading-relaxed whitespace-pre-line">
                  ${listing.description || 'No detailed description provided.'}
                </div>
              </div>

              <!-- Key Amenities Grid -->
              <div class="bg-white rounded-[12px] p-5 border border-[#F0EBE3] shadow-card flex flex-col gap-3.5">
                <div class="flex items-center justify-between border-b border-[#F0EBE3] pb-3">
                  <h2 class="text-base font-semibold text-[#1F1B16]">Amenities & Features (सुविधाहरू)</h2>
                  <span class="text-xs text-[#7C9885] font-medium">Verified Highlights</span>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div class="flex flex-col items-center text-center p-3 rounded-[8px] bg-[#FDFBF7] border border-[#F0EBE3]">
                    <div class="text-[#D97757] mb-1.5">${getIcon('droplet', { class: 'w-4 h-4' })}</div>
                    <span class="text-xs font-semibold text-[#1F1B16]">24/7 Water</span>
                    <span class="text-[10px] text-[#6B6258]">बोरिङ + मेलम्ची</span>
                  </div>

                  <div class="flex flex-col items-center text-center p-3 rounded-[8px] bg-[#FDFBF7] border border-[#F0EBE3]">
                    <div class="text-[#7C9885] mb-1.5">${getIcon('shield', { class: 'w-4 h-4' })}</div>
                    <span class="text-xs font-semibold text-[#1F1B16]">Parking</span>
                    <span class="text-[10px] text-[#6B6258]">Bike / Car Slot</span>
                  </div>

                  <div class="flex flex-col items-center text-center p-3 rounded-[8px] bg-[#FDFBF7] border border-[#F0EBE3]">
                    <div class="text-[#D97757] mb-1.5">${getIcon('sun', { class: 'w-4 h-4' })}</div>
                    <span class="text-xs font-semibold text-[#1F1B16]">Solar Hot Water</span>
                    <span class="text-[10px] text-[#6B6258]">तातो पानी सुविधा</span>
                  </div>

                  <div class="flex flex-col items-center text-center p-3 rounded-[8px] bg-[#FDFBF7] border border-[#F0EBE3]">
                    <div class="text-[#5B8266] mb-1.5">${getIcon('wifi', { class: 'w-4 h-4' })}</div>
                    <span class="text-xs font-semibold text-[#1F1B16]">Fiber Internet</span>
                    <span class="text-[10px] text-[#6B6258]">High Speed Ready</span>
                  </div>
                </div>
              </div>

              <!-- Location Map Notice -->
              <div class="bg-white rounded-[12px] p-5 border border-[#F0EBE3] shadow-card">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-base font-semibold text-[#1F1B16]">Location & Neighborhood</h3>
                  <span class="text-xs text-[#D97757] font-semibold">${listing.location_area}</span>
                </div>
                <div class="w-full h-36 bg-[#FDFBF7] rounded-[12px] flex flex-col items-center justify-center p-4 text-center border border-[#F0EBE3]">
                  ${getIcon('map-pin', { class: 'w-6 h-6 text-[#D97757] mb-1.5' })}
                  <p class="text-sm font-semibold text-[#1F1B16]">${listing.location_area}, ${listing.location_city}</p>
                  ${listing.landmark ? `<p class="text-xs text-[#6B6258] mt-0.5">Landmark: ${listing.landmark}</p>` : ''}
                  <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${listing.location_area}, ${listing.location_city}, Nepal`)}" target="_blank" rel="noopener noreferrer" class="btn-press mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[8px] bg-white text-[#1F1B16] text-xs font-medium hover:bg-[#FDFBF7] transition-colors border border-[#F0EBE3] shadow-card">
                    ${getIcon('external-link', { class: 'w-3.5 h-3.5 text-[#6B6258]' })}
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- Right 4 Columns: Sticky Landlord Contact Card -->
            <div class="lg:col-span-4 lg:sticky lg:top-20 flex flex-col gap-4">
              
              <!-- Contact Card -->
              <div class="bg-white rounded-[12px] p-5 border border-[#F0EBE3] shadow-card flex flex-col gap-4">
                
                <!-- Price Display -->
                <div class="flex items-center justify-between pb-3 border-b border-[#F0EBE3]">
                  <div>
                    <span class="text-[10px] text-[#6B6258] uppercase tracking-wide block font-medium">Monthly Rent</span>
                    <span class="text-2xl font-bold text-[#D97757]">रु ${formattedPrice}</span>
                  </div>
                  <span class="px-2.5 py-1 rounded-[8px] bg-[#EEF4F0] text-[#5B8266] text-xs font-semibold border border-[#5B8266]/20">
                    तुरुन्त खाली
                  </span>
                </div>

                <!-- Landlord Profile Summary -->
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-[#FDF0EC] text-[#D97757] flex items-center justify-center font-bold text-base shrink-0 border border-[#D97757]/20">
                    ${contactName[0].toUpperCase()}
                  </div>
                  <div class="min-w-0 flex-1">
                    <h4 class="text-sm font-semibold text-[#1F1B16] truncate">${contactName}</h4>
                    <p class="text-xs text-[#D97757] font-medium">घरधनी (Property Owner)</p>
                    <p class="text-[11px] text-[#6B6258] flex items-center gap-1 mt-0.5">
                      ${getIcon('shield-check', { class: 'w-3.5 h-3.5 text-[#5B8266]' })}
                      <span>ID & Phone Verified</span>
                    </p>
                  </div>
                </div>

                <!-- Direct Communication Channels -->
                <div class="flex flex-col gap-2 pt-1">
                  <!-- WhatsApp -->
                  <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-press w-full py-2.5 px-3 rounded-[8px] bg-[#25D366] hover:brightness-105 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-card">
                    ${getIcon('message-circle', { class: 'w-4 h-4' })}
                    <span>Chat on WhatsApp (${listing.contact_phone})</span>
                  </a>

                  <!-- Viber -->
                  <a href="${viberUrl}" class="btn-press w-full py-2.5 px-3 rounded-[8px] bg-[#7360F2] hover:brightness-105 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-card">
                    ${getIcon('phone', { class: 'w-4 h-4' })}
                    <span>Connect on Viber</span>
                  </a>

                  <!-- Phone Call -->
                  <a href="${telUrl}" class="btn-press w-full py-2.5 px-3 rounded-[8px] bg-[#7C9885] hover:bg-[#6e8876] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-card">
                    ${getIcon('phone-call', { class: 'w-4 h-4' })}
                    <span>Call Now: ${listing.contact_phone}</span>
                  </a>
                </div>

                <!-- Renter Safety Box -->
                <div class="p-3.5 rounded-[8px] bg-[#FDFBF7] text-[#1F1B16] flex flex-col gap-1 text-[11px] border border-[#F0EBE3]">
                  <div class="flex items-center gap-1 text-[#D97757] font-semibold">
                    <span>🇳🇵</span> Renter Safety Tip:
                  </div>
                  <p class="text-[#6B6258] leading-relaxed">
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

      slides.forEach((slide, idx) => {
        if (idx === activeIndex) {
          slide.classList.remove('opacity-0', 'z-0', 'pointer-events-none');
          slide.classList.add('opacity-100', 'z-10');
        } else {
          slide.classList.remove('opacity-100', 'z-10');
          slide.classList.add('opacity-0', 'z-0', 'pointer-events-none');
        }
      });

      dots.forEach((dot, idx) => {
        if (idx === activeIndex) {
          dot.className = 'carousel-dot w-2 h-2 rounded-full transition-all bg-white scale-125';
        } else {
          dot.className = 'carousel-dot w-2 h-2 rounded-full transition-all bg-white/50 hover:bg-white/75';
        }
      });

      thumbs.forEach((thumb, idx) => {
        if (idx === activeIndex) {
          thumb.className = 'thumbnail-item shrink-0 w-16 h-12 rounded-[8px] overflow-hidden border-2 border-[#D97757] shadow-card transition-all cursor-pointer';
          thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
          thumb.className = 'thumbnail-item shrink-0 w-16 h-12 rounded-[8px] overflow-hidden border-2 border-transparent opacity-70 hover:opacity-100 transition-all cursor-pointer';
        }
      });

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
          goToSlide(activeIndex + 1);
        } else {
          goToSlide(activeIndex - 1);
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
