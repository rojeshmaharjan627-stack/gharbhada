import { supabase } from '../lib/supabase.js';
import { getCurrentUser } from '../lib/auth.js';
import { showToast } from '../lib/toast.js';
import { getIcon } from '../lib/icons.js';
import { t, getLanguage, formatNPR, getRelativeTime } from '../lib/i18n.js';

export const DetailView = {
  async render(container, { params }) {
    const listingId = params?.id;

    if (!listingId) {
      container.innerHTML = `
        <div class="max-w-xl mx-auto my-16 p-8 text-center bg-white rounded-2xl shadow-card border border-slate-200">
          <p class="text-red-500 font-bold mb-4">No listing specified.</p>
          <a href="#/" class="btn-modern inline-flex items-center px-5 py-2.5 bg-[#F04D36] text-white rounded-xl text-xs font-bold shadow-md">Back to Browse</a>
        </div>
      `;
      return;
    }

    // Modern Neutral Skeleton
    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full page-transition">
        <div class="flex flex-col gap-3 mb-6">
          <div class="h-4 w-48 skeleton-shimmer rounded-lg"></div>
          <div class="h-8 w-2/3 skeleton-shimmer rounded-xl"></div>
          <div class="h-4 w-1/3 skeleton-shimmer rounded-lg"></div>
        </div>
        <div class="w-full h-72 sm:h-[440px] skeleton-shimmer rounded-2xl mb-6"></div>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-8 flex flex-col gap-4">
            <div class="h-32 w-full skeleton-shimmer rounded-2xl"></div>
            <div class="h-48 w-full skeleton-shimmer rounded-2xl"></div>
          </div>
          <div class="lg:col-span-4 h-80 skeleton-shimmer rounded-2xl"></div>
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
        <div class="max-w-xl mx-auto my-16 p-8 text-center bg-white rounded-2xl shadow-card border border-slate-200">
          <div class="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-3">
            ${getIcon('alert-triangle', { class: 'w-6 h-6' })}
          </div>
          <h2 class="text-base font-bold text-slate-900 mb-1">Listing Not Found</h2>
          <p class="text-xs text-slate-500 mb-6">This listing may have been rented out or removed by the landlord.</p>
          <a href="#/" class="btn-modern inline-flex items-center px-5 py-2.5 bg-[#F04D36] text-white rounded-xl text-xs font-bold shadow-md">Browse All Rentals</a>
        </div>
      `;
      return;
    }

    const lang = getLanguage();
    const currentUser = getCurrentUser();
    const isOwner = currentUser && currentUser.id === listing.user_id;

    const photos = listing.photos && listing.photos.length > 0
      ? listing.photos
      : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'];

    const formattedPrice = formatNPR(listing.price, lang);
    const cleanPhone = (listing.contact_phone || '').replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('977') ? cleanPhone : `977${cleanPhone}`;
    const contactName = listing.contact_name || (lang === 'ne' ? 'घरधनी' : 'Property Owner');

    // Deep links
    const waUrl = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(`Namaste ${contactName}-ji, I am interested in your "${listing.title}" on GharBhada (ID: ${listing.id.substring(0, 8)}). Is it still available?`)}`;
    const viberUrl = `viber://chat?number=%2B${phoneWithCountry}`;
    const telUrl = `tel:+${phoneWithCountry}`;

    const categoryLabels = {
      room: lang === 'ne' ? 'कोठा (Room)' : 'Single Room',
      flat: lang === 'ne' ? 'फ्ल्याट (Flat)' : 'Full Flat / Apartment',
      house: lang === 'ne' ? 'घर (House)' : 'Full House',
      commercial: lang === 'ne' ? 'सटर/अफिस' : 'Commercial Shutter',
      land: lang === 'ne' ? 'जग्गा (Land)' : 'Open Land',
      vehicle: lang === 'ne' ? 'सवारी' : 'Vehicle'
    };

    container.innerHTML = `
      <div class="w-full min-h-screen pb-28 page-transition">
        
        <!-- Top Breadcrumbs & Actions -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <nav class="flex items-center gap-2 text-slate-500 font-medium">
              <a href="#/" class="hover:text-[#F04D36] transition-colors">Home (गृहपृष्ठ)</a>
              ${getIcon('chevron-right', { class: 'w-3 h-3 text-slate-300' })}
              <a href="#/?cat=${listing.category}" class="hover:text-[#F04D36] transition-colors">${categoryLabels[listing.category] || listing.category}</a>
              ${getIcon('chevron-right', { class: 'w-3 h-3 text-slate-300' })}
              <span class="text-slate-900 font-bold truncate max-w-[200px]">${listing.location_area}</span>
            </nav>

            <div class="flex items-center gap-2">
              ${isOwner ? `
                <a href="#/edit/${listing.id}" class="btn-press inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all border border-slate-200 shadow-xs">
                  ${getIcon('edit', { class: 'w-3.5 h-3.5 text-slate-600' })}
                  <span>Edit Listing</span>
                </a>
              ` : ''}
              <button id="detail-share-btn" class="btn-press inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all border border-slate-200 shadow-xs cursor-pointer">
                ${getIcon('share-2', { class: 'w-3.5 h-3.5 text-slate-600' })}
                <span>Share</span>
              </button>
            </div>
          </div>

          <!-- Title & Price Header -->
          <div class="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="px-3 py-1 rounded-full bg-orange-50 text-[#F04D36] text-[11px] font-bold border border-orange-200/80">
                  ${categoryLabels[listing.category] || 'Rental Space'}
                </span>
                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold">
                  ${getIcon('shield-check', { class: 'w-3.5 h-3.5 text-emerald-600' })} ${t('verifiedLandlord')}
                </span>
                <span class="text-slate-400 text-[11px] flex items-center gap-1 font-medium ml-1">
                  ${getIcon('clock', { class: 'w-3 h-3 text-[#F04D36]' })} ${getRelativeTime(listing.created_at, lang)}
                </span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                ${listing.title}
              </h1>
              <p class="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 mt-1.5 font-medium">
                ${getIcon('map-pin', { class: 'w-4 h-4 text-[#F04D36] shrink-0' })}
                <span>${listing.location_area}, ${listing.location_city}</span>
                ${listing.landmark ? `<span class="text-slate-300">•</span> <span class="text-teal-600 font-bold">${listing.landmark}</span>` : ''}
              </p>
            </div>

            <!-- Price Card Header (Desktop) -->
            <div class="hidden md:flex flex-col items-end bg-white p-4 px-6 rounded-2xl border border-slate-200 shadow-card">
              <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">${t('rentAmount')}</span>
              <div class="flex items-baseline gap-1.5">
                <span class="text-3xl font-extrabold text-[#F04D36] tracking-tight">${formattedPrice}</span>
                <span class="text-xs text-slate-400 font-semibold">${t('perMonth')}</span>
              </div>
              ${listing.is_negotiable ? `<span class="text-[11px] text-emerald-600 font-bold mt-0.5">${t('negotiable')}</span>` : ''}
            </div>
          </div>
        </section>

        <!-- Interactive Image Carousel with Smooth Transition -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div class="relative rounded-2xl overflow-hidden border border-slate-200 shadow-card bg-slate-900 group select-none">
            
            <div id="carousel-viewport" class="relative w-full h-[280px] sm:h-[420px] md:h-[500px] overflow-hidden">
              ${photos.map((src, idx) => `
                <div class="carousel-slide absolute inset-0 transition-opacity duration-300 ease-out ${idx === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}" data-slide-index="${idx}">
                  <img src="${src}" class="w-full h-full object-cover" alt="${listing.title} - photo ${idx + 1}"/>
                  <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                </div>
              `).join('')}
            </div>

            <!-- Arrow Controls -->
            ${photos.length > 1 ? `
              <button id="carousel-prev-btn" class="btn-press absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition-transform min-touch-target cursor-pointer backdrop-blur-xs" aria-label="Previous photo">
                ${getIcon('chevron-left', { class: 'w-5 h-5' })}
              </button>
              <button id="carousel-next-btn" class="btn-press absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition-transform min-touch-target cursor-pointer backdrop-blur-xs" aria-label="Next photo">
                ${getIcon('chevron-right', { class: 'w-5 h-5' })}
              </button>
            ` : ''}

            <!-- Slide Counter Badge -->
            <div class="absolute bottom-4 right-4 z-20 px-3 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-white text-xs font-bold">
              <span id="carousel-active-index">1</span> / ${photos.length} ${t('photosCount')}
            </div>

            <!-- Dot Indicators -->
            ${photos.length > 1 ? `
              <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                ${photos.map((_, idx) => `
                  <button type="button" class="carousel-dot w-2.5 h-2.5 rounded-full transition-all ${idx === 0 ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}" data-slide-target="${idx}" aria-label="Slide ${idx + 1}"></button>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Thumbnail Strip (Desktop) -->
          ${photos.length > 1 ? `
            <div class="flex items-center gap-3 mt-3 overflow-x-auto pb-1 no-scrollbar" id="thumbnail-strip">
              ${photos.map((src, idx) => `
                <button type="button" class="thumbnail-item shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${idx === 0 ? 'border-[#F04D36] shadow-sm scale-102' : 'border-transparent opacity-60 hover:opacity-100'}" data-thumb-target="${idx}">
                  <img src="${src}" class="w-full h-full object-cover" alt="Thumb ${idx + 1}"/>
                </button>
              `).join('')}
            </div>
          ` : ''}
        </section>

        <!-- Main Content 2-Column Grid -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- Left 8 Columns: Details, Description, Specs -->
            <div class="lg:col-span-8 flex flex-col gap-6 min-w-0">
              
              <!-- Quick Overview Bento Bar -->
              <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
                <p class="text-xs font-bold text-[#F04D36] uppercase tracking-wider mb-4">${t('propertyOverview')}</p>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  
                  <div class="flex items-center gap-3 p-3 rounded-xl bg-orange-50/60 border border-orange-100/70">
                    <div class="w-10 h-10 rounded-xl bg-orange-100 text-[#F04D36] flex items-center justify-center shrink-0">
                      ${getIcon('bed', { class: 'w-5 h-5' })}
                    </div>
                    <div>
                      <span class="text-[11px] text-slate-500 block font-semibold">${t('bedrooms')}</span>
                      <span class="text-sm font-extrabold text-slate-900">${listing.bedrooms || 1} Bed${(listing.bedrooms || 1) > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100/70">
                    <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      ${getIcon('bath', { class: 'w-5 h-5' })}
                    </div>
                    <div>
                      <span class="text-[11px] text-slate-500 block font-semibold">${t('bathrooms')}</span>
                      <span class="text-sm font-extrabold text-slate-900">${listing.bathrooms || 1} Bath</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-3 p-3 rounded-xl bg-teal-50/60 border border-teal-100/70">
                    <div class="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                      ${getIcon('droplet', { class: 'w-5 h-5' })}
                    </div>
                    <div>
                      <span class="text-[11px] text-slate-500 block font-semibold">${t('waterSupply')}</span>
                      <span class="text-sm font-extrabold text-slate-900 truncate">${listing.water_facility || '24/7 Supply'}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-3 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100/70">
                    <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      ${getIcon('handshake', { class: 'w-5 h-5' })}
                    </div>
                    <div>
                      <span class="text-[11px] text-slate-500 block font-semibold">Pricing</span>
                      <span class="text-sm font-extrabold text-slate-900">${listing.is_negotiable ? t('negotiable') : t('fixedPrice')}</span>
                    </div>
                  </div>

                </div>
              </div>

              <!-- Description Narrative -->
              <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card flex flex-col gap-4">
                <div class="flex items-center justify-between border-b border-slate-100 pb-3.5">
                  <h2 class="text-lg font-bold text-slate-900">${t('aboutSpace')}</h2>
                  <span class="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                    ${getIcon('check-circle', { class: 'w-3.5 h-3.5 text-emerald-600' })} Direct Landlord
                  </span>
                </div>
                
                <div class="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                  ${listing.description || 'No detailed description provided.'}
                </div>
              </div>

              <!-- Amenities Grid -->
              <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card flex flex-col gap-4">
                <div class="flex items-center justify-between border-b border-slate-100 pb-3.5">
                  <h2 class="text-lg font-bold text-slate-900">${t('amenitiesTitle')}</h2>
                  <span class="text-xs text-teal-600 font-bold">Verified Highlights</span>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div class="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="text-[#F04D36] mb-2">${getIcon('droplet', { class: 'w-5 h-5' })}</div>
                    <span class="text-xs font-bold text-slate-900">24/7 Water</span>
                    <span class="text-[11px] text-slate-400 mt-0.5">मेलम्ची / बोरिङ</span>
                  </div>

                  <div class="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="text-teal-600 mb-2">${getIcon('shield', { class: 'w-5 h-5' })}</div>
                    <span class="text-xs font-bold text-slate-900">Parking Space</span>
                    <span class="text-[11px] text-slate-400 mt-0.5">Bike / Car Slot</span>
                  </div>

                  <div class="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="text-amber-500 mb-2">${getIcon('sun', { class: 'w-5 h-5' })}</div>
                    <span class="text-xs font-bold text-slate-900">Solar Hot Water</span>
                    <span class="text-[11px] text-slate-400 mt-0.5">तातो पानी सुविधा</span>
                  </div>

                  <div class="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="text-indigo-600 mb-2">${getIcon('wifi', { class: 'w-5 h-5' })}</div>
                    <span class="text-xs font-bold text-slate-900">Fiber Internet</span>
                    <span class="text-[11px] text-slate-400 mt-0.5">High Speed Ready</span>
                  </div>
                </div>
              </div>

              <!-- Location Neighborhood Map -->
              <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
                <div class="flex items-center justify-between mb-3.5">
                  <h3 class="text-lg font-bold text-slate-900">${t('neighborhoodTitle')}</h3>
                  <span class="text-xs text-[#F04D36] font-bold">${listing.location_area}</span>
                </div>
                <div class="w-full h-40 bg-slate-50 rounded-xl flex flex-col items-center justify-center p-4 text-center border border-slate-200">
                  <div class="w-10 h-10 rounded-xl bg-orange-100 text-[#F04D36] flex items-center justify-center mb-2">
                    ${getIcon('map-pin', { class: 'w-5 h-5' })}
                  </div>
                  <p class="text-sm font-bold text-slate-900">${listing.location_area}, ${listing.location_city}</p>
                  ${listing.landmark ? `<p class="text-xs text-slate-500 mt-0.5 font-medium">Landmark: ${listing.landmark}</p>` : ''}
                  <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${listing.location_area}, ${listing.location_city}, Nepal`)}" target="_blank" rel="noopener noreferrer" class="btn-press mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-white text-slate-800 text-xs font-bold hover:bg-slate-50 transition-all border border-slate-200 shadow-xs">
                    ${getIcon('external-link', { class: 'w-3.5 h-3.5 text-slate-500' })}
                    <span>${t('openMaps')}</span>
                  </a>
                </div>
              </div>

            </div>

            <!-- Right 4 Columns: Sticky Landlord Contact Card (Desktop) -->
            <div class="lg:col-span-4 lg:sticky lg:top-24 hidden lg:flex flex-col gap-4">
              <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-floating flex flex-col gap-5">
                
                <!-- Price Display -->
                <div class="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span class="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">${t('rentAmount')}</span>
                    <span class="text-3xl font-extrabold text-[#F04D36] tracking-tight">${formattedPrice}</span>
                  </div>
                  <span class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/80">
                    ${t('immediatelyAvailable')}
                  </span>
                </div>

                <!-- Landlord Profile Summary -->
                <div class="flex items-center gap-3.5">
                  <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-base shrink-0 border border-emerald-200/80">
                    ${contactName[0].toUpperCase()}
                  </div>
                  <div class="min-w-0 flex-1">
                    <h4 class="text-sm font-bold text-slate-900 truncate">${contactName}</h4>
                    <p class="text-xs text-slate-500 font-medium">घरधनी (Property Owner)</p>
                    <p class="text-[11px] text-emerald-600 flex items-center gap-1 mt-0.5 font-bold">
                      ${getIcon('shield-check', { class: 'w-3.5 h-3.5 text-emerald-600' })}
                      <span>${t('landlordVerified')}</span>
                    </p>
                  </div>
                </div>

                <!-- Direct Communication Channels -->
                <div class="flex flex-col gap-2.5 pt-1">
                  <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-press w-full py-3 px-4 rounded-xl bg-[#25D366] hover:brightness-105 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs min-touch-target">
                    ${getIcon('message-circle', { class: 'w-4 h-4' })}
                    <span>Chat on WhatsApp (${listing.contact_phone})</span>
                  </a>

                  <a href="${viberUrl}" class="btn-press w-full py-3 px-4 rounded-xl bg-[#7360F2] hover:brightness-105 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs min-touch-target">
                    ${getIcon('phone', { class: 'w-4 h-4' })}
                    <span>Connect on Viber</span>
                  </a>

                  <a href="${telUrl}" class="btn-modern w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#F04D36] to-[#E03A22] hover:from-[#E03A22] hover:to-[#C82B15] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-glow min-touch-target">
                    ${getIcon('phone-call', { class: 'w-4 h-4 text-white' })}
                    <span>Call Now: ${listing.contact_phone}</span>
                  </a>
                </div>

                <!-- Renter Safety Box -->
                <div class="p-4 rounded-xl bg-slate-50 text-slate-800 flex flex-col gap-1.5 text-[11px] border border-slate-200">
                  <div class="flex items-center gap-1.5 text-[#F04D36] font-bold">
                    <span>🇳🇵</span> ${t('renterSafetyTipTitle')}
                  </div>
                  <p class="text-slate-500 leading-relaxed">
                    ${t('renterSafetyTipBody')}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        <!-- 6. Mobile Sticky Contact Bar (Always Visible While Scrolling on Mobile) -->
        <div class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-3.5 shadow-2xl">
          <div class="max-w-md mx-auto flex items-center gap-2.5">
            <!-- Price Summary -->
            <div class="shrink-0 pr-2">
              <span class="text-[10px] text-slate-400 block leading-none font-bold uppercase">Rent</span>
              <span class="text-base font-extrabold text-[#F04D36]">${formattedPrice}</span>
            </div>

            <!-- WhatsApp -->
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-press flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#25D366] text-white text-xs font-bold shadow-xs min-touch-target">
              ${getIcon('message-circle', { class: 'w-4 h-4' })}
              <span>WhatsApp</span>
            </a>

            <!-- Viber -->
            <a href="${viberUrl}" class="btn-press p-2.5 rounded-xl bg-[#7360F2] text-white flex items-center justify-center shadow-xs min-touch-target" title="Viber">
              ${getIcon('phone', { class: 'w-4 h-4' })}
            </a>

            <!-- Phone Call -->
            <a href="${telUrl}" class="btn-modern flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#F04D36] to-[#E03A22] text-white text-xs font-bold shadow-xs min-touch-target">
              ${getIcon('phone-call', { class: 'w-4 h-4 text-white' })}
              <span>Call</span>
            </a>
          </div>
        </div>

      </div>
    `;

    // Carousel Logic
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
          dot.className = 'carousel-dot w-2.5 h-2.5 rounded-full transition-all bg-white scale-125';
        } else {
          dot.className = 'carousel-dot w-2.5 h-2.5 rounded-full transition-all bg-white/50 hover:bg-white/80';
        }
      });

      thumbs.forEach((thumb, idx) => {
        if (idx === activeIndex) {
          thumb.className = 'thumbnail-item shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 border-[#F04D36] shadow-sm scale-102 transition-all cursor-pointer';
          thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
          thumb.className = 'thumbnail-item shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 border-transparent opacity-60 hover:opacity-100 transition-all cursor-pointer';
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

    // Mobile touch swipe
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
        if (diff > 0) goToSlide(activeIndex + 1);
        else goToSlide(activeIndex - 1);
      }
    }, { passive: true });

    // Share button
    document.getElementById('detail-share-btn')?.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: listing.title,
            text: `Check out this rental on GharBhada: ${listing.title}`,
            url: window.location.href,
          });
        } catch (e) {
          navigator.clipboard.writeText(window.location.href);
          showToast('Link copied to clipboard!');
        }
      } else {
        navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!');
      }
    });
  }
};
