import { supabase } from '../lib/supabase.js';
import { getCurrentUser } from '../lib/auth.js';
import { showToast } from '../lib/toast.js';
import { navigateTo } from '../lib/router.js';

export const DetailView = {
  async render(container, { params }) {
    const listingId = params?.id;

    if (!listingId) {
      container.innerHTML = `
        <div class="max-w-xl mx-auto my-16 p-8 text-center bg-surface-container-lowest rounded-DEFAULT shadow-sm">
          <p class="text-error font-bold mb-4">No listing specified.</p>
          <a href="#/" class="px-6 py-2 bg-primary text-on-primary rounded-full font-bold">Back to Browse</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-margin-sm lg:px-margin py-8 flex flex-col items-center justify-center min-h-[50vh]">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="font-label-lg text-label-lg text-on-surface-variant">Loading rental details from GharBhada...</p>
      </div>
    `;

    const { data: listing, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', listingId)
      .single();

    if (error || !listing) {
      container.innerHTML = `
        <div class="max-w-xl mx-auto my-16 p-8 text-center bg-surface-container-lowest rounded-DEFAULT shadow-sm">
          <span class="material-symbols-outlined text-5xl text-error mb-2">error</span>
          <h2 class="font-headline-sm text-headline-sm font-bold mb-2">Listing Not Found</h2>
          <p class="font-body-sm text-body-sm text-on-surface-variant mb-6">This listing may have been rented out or removed by the landlord.</p>
          <a href="#/" class="px-6 py-2 bg-primary text-on-primary rounded-full font-bold inline-block">Browse All Rentals</a>
        </div>
      `;
      return;
    }

    const currentUser = getCurrentUser();
    const isOwner = currentUser && currentUser.id === listing.user_id;

    const photos = listing.photos && listing.photos.length > 0
      ? listing.photos
      : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'];

    const mainPhoto = photos[0];
    const thumb1 = photos[1] || photos[0];
    const thumb2 = photos[2] || photos[0];
    const thumb3 = photos[3] || photos[1] || photos[0];

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
      <div class="w-full bg-surface min-h-screen pb-16 animate-fade-in">
        <!-- Top Breadcrumbs & Action Bar -->
        <section class="max-w-7xl mx-auto px-margin-sm lg:px-margin pt-6 pb-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
            <nav class="flex items-center gap-1.5 text-on-surface-variant font-label-sm">
              <a href="#/" class="hover:text-primary transition-colors">Home (गृहपृष्ठ)</a>
              <span class="material-symbols-outlined text-[14px]">chevron_right</span>
              <a href="#/?cat=${listing.category}" class="hover:text-primary transition-colors">${categoryLabels[listing.category] || listing.category}</a>
              <span class="material-symbols-outlined text-[14px]">chevron_right</span>
              <span class="text-on-surface font-semibold truncate max-w-[200px]">${listing.location_area}</span>
            </nav>

            <div class="flex items-center gap-2">
              ${isOwner ? `
                <a href="#/edit/${listing.id}" class="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-surface-container-high hover:bg-secondary-container text-on-surface font-label-md transition-colors">
                  <span class="material-symbols-outlined text-[16px]">edit</span>
                  <span>Edit Listing</span>
                </a>
              ` : ''}
              <button id="share-btn" class="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md transition-colors">
                <span class="material-symbols-outlined text-[16px]">share</span>
                <span>Share</span>
              </button>
            </div>
          </div>

          <!-- Title & Area Header -->
          <div class="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <span class="px-3 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-bold">
                  ${categoryLabels[listing.category] || 'Rental Space'}
                </span>
                <span class="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
                  <span class="material-symbols-outlined text-[14px]">verified</span> Verified Owner
                </span>
                <span class="text-on-surface-variant text-xs font-label-sm">
                  Listed ${new Date(listing.created_at).toLocaleDateString('en-GB')}
                </span>
              </div>
              <h1 class="font-headline-lg text-headline-lg lg:text-[32px] text-on-surface font-black tracking-tight">
                ${listing.title}
              </h1>
              <p class="font-body-md text-body-md text-on-surface-variant flex items-center gap-1.5 mt-1">
                <span class="material-symbols-outlined text-primary text-[18px]">pin_drop</span>
                <span>${listing.location_area}, ${listing.location_city}</span>
                ${listing.landmark ? `<span class="text-outline-variant">•</span> <span class="text-secondary">${listing.landmark}</span>` : ''}
              </p>
            </div>

            <!-- Price in Header (Desktop) -->
            <div class="hidden md:flex flex-col items-end bg-surface-container-lowest p-4 px-6 rounded-DEFAULT shadow-sm">
              <span class="font-label-sm text-label-sm text-on-surface-variant">Monthly Rental</span>
              <div class="flex items-baseline gap-1">
                <span class="font-display-lg text-display-lg-mobile text-primary font-black">रु ${formattedPrice}</span>
                <span class="font-label-md text-label-md text-on-surface-variant">/ month</span>
              </div>
              ${listing.is_negotiable ? '<span class="text-xs text-secondary font-semibold">Price Negotiable (छलफल गर्न सकिने)</span>' : ''}
            </div>
          </div>
        </section>

        <!-- Photo Gallery Bento Grid -->
        <section class="max-w-7xl mx-auto px-margin-sm lg:px-margin mb-8">
          <div class="relative rounded-DEFAULT overflow-hidden shadow-[0_12px_24px_-4px_rgba(38,70,83,0.08)] bg-surface-container-high">
            <div class="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[340px] md:h-[480px]">
              <!-- Main Large Photo -->
              <div class="md:col-span-2 md:row-span-2 relative group overflow-hidden cursor-pointer">
                <img id="main-preview-img" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${mainPhoto}" alt="${listing.title}"/>
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
                <div class="absolute bottom-4 left-4 text-white font-label-md flex items-center gap-1.5 drop-shadow-md">
                  <span class="material-symbols-outlined text-[18px]">photo_camera</span> Primary View
                </div>
              </div>

              <!-- Thumb 1 -->
              <div class="relative group overflow-hidden cursor-pointer hidden md:block">
                <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 thumb-img" src="${thumb1}" alt="Interior view 1"/>
              </div>

              <!-- Thumb 2 -->
              <div class="relative group overflow-hidden cursor-pointer hidden md:block">
                <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 thumb-img" src="${thumb2}" alt="Interior view 2"/>
              </div>

              <!-- Thumb 3 -->
              <div class="relative group overflow-hidden cursor-pointer hidden md:block md:col-span-2">
                <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 thumb-img" src="${thumb3}" alt="Interior view 3"/>
                <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                <div class="absolute bottom-3 right-4 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full text-on-surface font-label-sm text-label-sm shadow">
                  ${photos.length} Photo${photos.length > 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Main Content 2-Column Grid -->
        <section class="max-w-7xl mx-auto px-margin-sm lg:px-margin">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            
            <!-- Left 8 Columns: Details, Description, Specs -->
            <div class="lg:col-span-8 flex flex-col gap-space-lg min-w-0">
              
              <!-- Quick Overview Bento Bar -->
              <div class="bg-surface-container-lowest rounded-DEFAULT p-space-lg shadow-[0_2px_8px_-1px_rgba(38,70,83,0.05)]">
                <p class="font-label-sm text-label-sm text-primary uppercase tracking-wider mb-space-sm font-extrabold">Property Overview (मुख्य विवरण)</p>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                      <span class="material-symbols-outlined text-[20px]">bed</span>
                    </div>
                    <div>
                      <span class="font-body-sm text-body-sm text-on-surface-variant block">Bedrooms</span>
                      <span class="font-label-lg text-label-lg font-bold text-on-surface">${listing.bedrooms || 1} Bed${(listing.bedrooms || 1) > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                      <span class="material-symbols-outlined text-[20px]">bathtub</span>
                    </div>
                    <div>
                      <span class="font-body-sm text-body-sm text-on-surface-variant block">Bathrooms</span>
                      <span class="font-label-lg text-label-lg font-bold text-on-surface">${listing.bathrooms || 1} Bath</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-tertiary">
                      <span class="material-symbols-outlined text-[20px]">water_drop</span>
                    </div>
                    <div>
                      <span class="font-body-sm text-body-sm text-on-surface-variant block">Water Supply</span>
                      <span class="font-label-lg text-label-lg font-bold text-on-surface truncate">${listing.water_facility || '24/7 Supply'}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                      <span class="material-symbols-outlined text-[20px]">handshake</span>
                    </div>
                    <div>
                      <span class="font-body-sm text-body-sm text-on-surface-variant block">Negotiable</span>
                      <span class="font-label-lg text-label-lg font-bold text-on-surface">${listing.is_negotiable ? 'Yes (छलफल)' : 'Fixed'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Description Narrative -->
              <div class="bg-surface-container-lowest rounded-DEFAULT p-space-lg shadow-[0_2px_8px_-1px_rgba(38,70,83,0.05)] flex flex-col gap-4">
                <div class="flex items-center justify-between border-b border-surface-container-high pb-3">
                  <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">About This Space (सम्पत्ति विवरण)</h2>
                  <span class="font-label-sm text-label-sm text-secondary font-semibold">Direct from Landlord</span>
                </div>
                
                <div class="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-line space-y-3">
                  ${listing.description || 'No detailed description provided.'}
                </div>
              </div>

              <!-- Key Amenities Grid -->
              <div class="bg-surface-container-lowest rounded-DEFAULT p-space-lg shadow-[0_2px_8px_-1px_rgba(38,70,83,0.05)] flex flex-col gap-4">
                <div class="flex items-center justify-between border-b border-surface-container-high pb-3">
                  <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">Amenities & Features (सुविधाहरू)</h2>
                  <span class="font-label-sm text-label-sm text-secondary font-bold">Verified Highlights</span>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div class="flex flex-col items-center text-center p-3 rounded-DEFAULT bg-surface-container-low">
                    <span class="material-symbols-outlined text-[22px] text-primary mb-1">water_drop</span>
                    <span class="font-label-md text-label-md font-bold text-on-surface">24/7 Water</span>
                    <span class="font-body-sm text-[11px] text-on-surface-variant">बोरिङ + मेलम्ची</span>
                  </div>

                  <div class="flex flex-col items-center text-center p-3 rounded-DEFAULT bg-surface-container-low">
                    <span class="material-symbols-outlined text-[22px] text-secondary mb-1">two_wheeler</span>
                    <span class="font-label-md text-label-md font-bold text-on-surface">Parking</span>
                    <span class="font-body-sm text-[11px] text-on-surface-variant">Bike / Car Slot</span>
                  </div>

                  <div class="flex flex-col items-center text-center p-3 rounded-DEFAULT bg-surface-container-low">
                    <span class="material-symbols-outlined text-[22px] text-tertiary mb-1">solar_power</span>
                    <span class="font-label-md text-label-md font-bold text-on-surface">Solar Hot Water</span>
                    <span class="font-body-sm text-[11px] text-on-surface-variant">तातो पानी सुविधा</span>
                  </div>

                  <div class="flex flex-col items-center text-center p-3 rounded-DEFAULT bg-surface-container-low">
                    <span class="material-symbols-outlined text-[22px] text-secondary mb-1">wifi</span>
                    <span class="font-label-md text-label-md font-bold text-on-surface">Fiber Internet</span>
                    <span class="font-body-sm text-[11px] text-on-surface-variant">High Speed Ready</span>
                  </div>
                </div>
              </div>

              <!-- Location Map Notice -->
              <div class="bg-surface-container-lowest rounded-DEFAULT p-space-lg shadow-[0_2px_8px_-1px_rgba(38,70,83,0.05)]">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">Location & Neighborhood</h3>
                  <span class="font-label-sm text-label-sm text-primary font-bold">${listing.location_area}</span>
                </div>
                <div class="w-full h-48 bg-surface-container-low rounded-DEFAULT flex flex-col items-center justify-center p-4 text-center border border-surface-container-high">
                  <span class="material-symbols-outlined text-4xl text-primary mb-2">location_on</span>
                  <p class="font-label-lg text-label-lg text-on-surface font-bold">${listing.location_area}, ${listing.location_city}</p>
                  ${listing.landmark ? `<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">Landmark: ${listing.landmark}</p>` : ''}
                  <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${listing.location_area}, ${listing.location_city}, Nepal`)}" target="_blank" rel="noopener noreferrer" class="mt-3 inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-surface-container text-secondary font-label-sm hover:bg-surface-container-high transition-colors">
                    <span class="material-symbols-outlined text-[16px]">open_in_new</span>
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- Right 4 Columns: Sticky Landlord Contact Card -->
            <div class="lg:col-span-4 lg:sticky lg:top-24 flex flex-col gap-4">
              
              <!-- Contact Card -->
              <div class="bg-surface-container-lowest rounded-DEFAULT p-space-lg shadow-[0_12px_32px_-6px_rgba(38,70,83,0.12),0_4px_12px_-2px_rgba(231,111,81,0.08)] flex flex-col gap-4 border border-surface-container-high">
                
                <!-- Price Display for Mobile & Card -->
                <div class="flex items-center justify-between pb-3 border-b border-surface-container-high">
                  <div>
                    <span class="font-label-sm text-label-sm text-on-surface-variant block">Monthly Rent</span>
                    <span class="font-display-lg text-[28px] text-primary font-black">रु ${formattedPrice}</span>
                  </div>
                  <span class="px-3 py-1 rounded-full bg-secondary/10 text-secondary font-label-sm text-label-sm font-bold">
                    तुरुन्त खाली
                  </span>
                </div>

                <!-- Landlord Profile Summary -->
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl shrink-0">
                    ${contactName[0].toUpperCase()}
                  </div>
                  <div class="min-w-0 flex-1">
                    <h4 class="font-headline-sm text-headline-sm text-on-surface font-bold truncate">${contactName}</h4>
                    <p class="font-label-sm text-label-sm text-primary font-semibold">घरधनी (Property Owner)</p>
                    <p class="font-body-sm text-xs text-on-surface-variant flex items-center gap-1">
                      <span class="material-symbols-outlined text-[14px] text-secondary">verified_user</span>
                      <span>ID & Phone Verified</span>
                    </p>
                  </div>
                </div>

                <!-- Direct Communication Channels -->
                <div class="flex flex-col gap-2 pt-2">
                  <!-- WhatsApp (Deep link) -->
                  <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="w-full py-3 px-4 rounded-full bg-[#25D366] hover:brightness-105 text-white font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]">
                    <span class="material-symbols-outlined text-[20px]">chat</span>
                    <span>Chat on WhatsApp (${listing.contact_phone})</span>
                  </a>

                  <!-- Viber (Deep link) -->
                  <a href="${viberUrl}" class="w-full py-3 px-4 rounded-full bg-[#7360F2] hover:brightness-105 text-white font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]">
                    <span class="material-symbols-outlined text-[20px]">forum</span>
                    <span>Connect on Viber</span>
                  </a>

                  <!-- Phone Call (Deep link) -->
                  <a href="${telUrl}" class="w-full py-3 px-4 rounded-full bg-secondary hover:bg-on-secondary-fixed-variant text-white font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]">
                    <span class="material-symbols-outlined text-[20px]">call</span>
                    <span>Call Now: ${listing.contact_phone}</span>
                  </a>
                </div>

                <!-- Renter Safety Box -->
                <div class="p-3.5 rounded-DEFAULT bg-surface-container text-on-surface flex flex-col gap-1.5 text-xs">
                  <div class="flex items-center gap-1.5 text-primary font-bold">
                    <span>🇳🇵</span> Renter Safety Tip (भाडामा बस्नेका लागि):
                  </div>
                  <p class="text-on-surface-variant leading-relaxed">
                    Never pay advance booking charges online without inspecting the property and meeting the owner in person. GharBhada has 100% zero broker charges.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
    `;

    // Photo thumbnails click to swap preview
    document.querySelectorAll('.thumb-img').forEach(img => {
      img.addEventListener('click', () => {
        const mainImg = document.getElementById('main-preview-img');
        if (mainImg) mainImg.src = img.src;
      });
    });

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
          // Fallback to clipboard
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
