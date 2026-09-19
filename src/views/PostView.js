import { supabase } from '../lib/supabase.js';
import { getCurrentUser } from '../lib/auth.js';
import { showToast } from '../lib/toast.js';
import { navigateTo } from '../lib/router.js';
import { getIcon } from '../lib/icons.js';
import { t, getLanguage } from '../lib/i18n.js';

export const PostView = {
  protected: true,

  async render(container, { params }) {
    const editId = params?.id;
    let existingListing = null;

    if (editId) {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', editId)
        .single();

      if (!error && data) {
        existingListing = data;
        const currentUser = getCurrentUser();
        if (currentUser && data.user_id !== currentUser.id) {
          showToast('You can only edit your own listings', 'error');
          navigateTo('#/my-listings');
          return;
        }
      }
    }

    const user = getCurrentUser();
    const defaultContactName = existingListing?.contact_name || user?.user_metadata?.full_name || '';
    const defaultPhone = existingListing?.contact_phone || user?.user_metadata?.phone || '';
    let uploadedPhotoUrls = existingListing?.photos ? [...existingListing.photos] : [];
    let currentStep = 1; // 1: Type & Info, 2: Location & Rent, 3: Specs & Photos, 4: Contact & Confirm

    function updateWizardUI() {
      // Step indicator states
      for (let i = 1; i <= 4; i++) {
        const stepEl = document.getElementById(`step-item-${i}`);
        const panelEl = document.getElementById(`wizard-step-panel-${i}`);
        if (!stepEl || !panelEl) continue;

        if (i === currentStep) {
          stepEl.className = 'flex items-center gap-2 text-xs font-bold text-[#D97757] border-b-2 border-[#D97757] pb-2';
          panelEl.classList.remove('hidden');
        } else if (i < currentStep) {
          stepEl.className = 'flex items-center gap-2 text-xs font-semibold text-[#5B8266] border-b-2 border-[#5B8266] pb-2 cursor-pointer';
          panelEl.classList.add('hidden');
        } else {
          stepEl.className = 'flex items-center gap-2 text-xs font-medium text-[#6B6258] border-b-2 border-transparent pb-2';
          panelEl.classList.add('hidden');
        }
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    container.innerHTML = `
      <div class="max-w-2xl mx-auto px-4 sm:px-6 py-6 page-transition">
        
        <!-- Header -->
        <div class="mb-6">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF0EC] text-[#D97757] text-xs font-bold mb-2 border border-[#D97757]/20 shadow-xs">
            <span>🇳🇵</span>
            <span>${editId ? 'Edit Rental Listing (सम्पादन)' : '०% ब्रोकर शुल्क • Zero Broker Commission'}</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1B16]">
            ${editId ? 'Edit Rental Listing' : t('postTitle')}
          </h1>
          <p class="text-xs sm:text-sm text-[#6B6258] mt-1 leading-relaxed">
            ${t('postSubtitle')}
          </p>
        </div>

        <!-- 4-Step Progress Stepper -->
        <div class="grid grid-cols-4 gap-2 mb-6 border-b border-[#F0EBE3] select-none text-center">
          <div id="step-item-1" class="flex items-center justify-center gap-1.5 text-xs font-bold text-[#D97757] border-b-2 border-[#D97757] pb-2.5">
            <span class="w-5 h-5 rounded-full bg-[#D97757] text-white flex items-center justify-center text-[10px]">1</span>
            <span class="hidden sm:inline">Type & Info</span>
          </div>
          <div id="step-item-2" class="flex items-center justify-center gap-1.5 text-xs font-medium text-[#6B6258] border-b-2 border-transparent pb-2.5">
            <span class="w-5 h-5 rounded-full bg-[#FDFBF7] border border-[#F0EBE3] text-[#6B6258] flex items-center justify-center text-[10px]">2</span>
            <span class="hidden sm:inline">Location & Rent</span>
          </div>
          <div id="step-item-3" class="flex items-center justify-center gap-1.5 text-xs font-medium text-[#6B6258] border-b-2 border-transparent pb-2.5">
            <span class="w-5 h-5 rounded-full bg-[#FDFBF7] border border-[#F0EBE3] text-[#6B6258] flex items-center justify-center text-[10px]">3</span>
            <span class="hidden sm:inline">Photos & Specs</span>
          </div>
          <div id="step-item-4" class="flex items-center justify-center gap-1.5 text-xs font-medium text-[#6B6258] border-b-2 border-transparent pb-2.5">
            <span class="w-5 h-5 rounded-full bg-[#FDFBF7] border border-[#F0EBE3] text-[#6B6258] flex items-center justify-center text-[10px]">4</span>
            <span class="hidden sm:inline">Contact</span>
          </div>
        </div>

        <!-- Multi-Step Form -->
        <form id="post-rental-form" class="flex flex-col gap-5">
          
          <!-- STEP 1: Category & Basic Details -->
          <div id="wizard-step-panel-1" class="flex flex-col gap-4">
            <div class="bg-white p-5 rounded-[12px] border border-[#F0EBE3] shadow-card flex flex-col gap-4">
              <div>
                <h3 class="text-sm font-bold text-[#1F1B16] mb-1">Select Property Type (सम्पत्तिको प्रकार) <span class="text-[#D97757]">*</span></h3>
                <p class="text-xs text-[#6B6258]">Choose the rental category that best describes your space.</p>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                ${[
                  { id: 'room', label: 'Room (कोठा)', emoji: '🛏️', desc: '1 BHK or Single Room' },
                  { id: 'flat', label: 'Flat (फ्ल्याट)', emoji: '🏢', desc: '2-3 BHK Full Apartment' },
                  { id: 'house', label: 'House (घर)', emoji: '🏠', desc: 'Independent House' },
                  { id: 'commercial', label: 'Shutter (सटर)', emoji: '🏬', desc: 'Shop or Office Space' },
                  { id: 'land', label: 'Land (जग्गा)', emoji: '🏞️', desc: 'Open Plot for Lease' },
                  { id: 'vehicle', label: 'Vehicle (सवारी)', emoji: '🏍️', desc: 'Bike, Scooter or Car' }
                ].map(cat => {
                  const isChecked = (existingListing?.category || 'flat') === cat.id;
                  return `
                    <label class="group relative cursor-pointer">
                      <input type="radio" name="category" value="${cat.id}" class="peer sr-only" ${isChecked ? 'checked' : ''}/>
                      <div class="p-3 rounded-[8px] bg-[#FDFBF7] peer-checked:bg-[#FDF0EC] peer-checked:border-[#D97757] peer-checked:text-[#D97757] border border-[#F0EBE3] hover:border-[#D97757]/40 transition-all flex flex-col items-center text-center gap-1 shadow-card min-touch-target">
                        <span class="text-2xl">${cat.emoji}</span>
                        <span class="text-xs font-bold text-[#1F1B16] peer-checked:text-[#D97757]">${cat.label}</span>
                        <span class="text-[10px] text-[#6B6258] line-clamp-1">${cat.desc}</span>
                      </div>
                    </label>
                  `;
                }).join('')}
              </div>

              <div class="flex flex-col gap-1.5 pt-2 border-t border-[#F0EBE3]">
                <label class="text-xs font-bold text-[#1F1B16]" for="listing-title">
                  Listing Title (शीर्षक) <span class="text-[#D97757]">*</span>
                </label>
                <input id="listing-title" required maxlength="100" class="input-focus w-full px-3.5 py-2.5 text-[#1F1B16] placeholder:text-[#6B6258]/60 text-sm font-medium min-touch-target" placeholder="e.g. 2 BHK Sunny Flat near Shankhamul Bridge with Car Parking" value="${existingListing?.title || ''}"/>
                <span class="text-[11px] text-[#6B6258]">Include key highlights like sunlight, floor, or parking.</span>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-[#1F1B16]" for="listing-description">
                  Comprehensive Description (नेपाली वा English मा लेख्नुहोस्)
                </label>
                <textarea id="listing-description" rows="4" class="input-focus w-full p-3 text-[#1F1B16] placeholder:text-[#6B6258]/60 text-sm leading-relaxed" placeholder="Describe water availability (Melamchi/Boring), electricity sub-meter, preferred tenant (family/bachelor), and nearby amenities...">${existingListing?.description || ''}</textarea>
              </div>

              <div class="flex justify-end pt-2">
                <button type="button" id="next-step-1" class="btn-press px-6 py-2.5 rounded-[8px] bg-[#D97757] hover:bg-[#c66849] text-white text-xs font-bold shadow-card flex items-center gap-1 min-touch-target">
                  <span>${t('nextBtn')}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- STEP 2: Location & Pricing -->
          <div id="wizard-step-panel-2" class="hidden flex flex-col gap-4">
            <div class="bg-white p-5 rounded-[12px] border border-[#F0EBE3] shadow-card flex flex-col gap-4">
              <div>
                <h3 class="text-sm font-bold text-[#1F1B16] mb-1">Location & Rent Details (स्थान र भाडा)</h3>
                <p class="text-xs text-[#6B6258]">Provide exact area details so verified tenants can find your property easily.</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-[#1F1B16]" for="location-city">
                    District / City <span class="text-[#D97757]">*</span>
                  </label>
                  <select id="location-city" required class="input-focus w-full px-3.5 py-2.5 text-[#1F1B16] text-sm cursor-pointer min-touch-target font-medium">
                    ${['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan', 'Butwal', 'Dharan', 'Other'].map(city => `
                      <option value="${city}" ${(existingListing?.location_city || 'Kathmandu') === city ? 'selected' : ''}>${city}</option>
                    `).join('')}
                  </select>
                </div>

                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-[#1F1B16]" for="location-area">
                    Neighborhood / Area (टोल / ठाउँ) <span class="text-[#D97757]">*</span>
                  </label>
                  <input id="location-area" required class="input-focus w-full px-3.5 py-2.5 text-[#1F1B16] placeholder:text-[#6B6258]/60 text-sm font-medium min-touch-target" placeholder="e.g. New Baneshwor, Jhamsikhel, Pulchowk" value="${existingListing?.location_area || ''}"/>
                </div>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-[#1F1B16]" for="location-landmark">
                  Nearby Landmark / Street Access (नजिकको स्थान)
                </label>
                <input id="location-landmark" class="input-focus w-full px-3.5 py-2.5 text-[#1F1B16] placeholder:text-[#6B6258]/60 text-sm font-medium min-touch-target" placeholder="e.g. 50m inside Ring Road, Near Shankhamul Bridge" value="${existingListing?.landmark || ''}"/>
              </div>

              <div class="flex flex-col gap-1.5 pt-2 border-t border-[#F0EBE3]">
                <label class="text-xs font-bold text-[#1F1B16]" for="rental-price">
                  Monthly Rent in NPR (मासिक भाडा रु) <span class="text-[#D97757]">*</span>
                </label>
                <div class="flex items-center bg-[#FDFBF7] rounded-[8px] border border-[#F0EBE3] px-3.5 py-2 focus-within:border-[#D97757] focus-within:ring-2 focus-within:ring-[#D97757]/20 transition-all min-touch-target">
                  <span class="font-bold text-[#D97757] mr-2 text-sm">रु (NPR)</span>
                  <input id="rental-price" required type="number" min="0" step="500" class="w-full bg-transparent text-[#1F1B16] font-bold text-base focus:outline-none" placeholder="25000" value="${existingListing?.price || ''}"/>
                </div>
              </div>

              <div class="flex items-center pt-1">
                <label class="flex items-center gap-2 cursor-pointer select-none">
                  <input id="is-negotiable" type="checkbox" class="w-4 h-4 accent-[#D97757] rounded cursor-pointer" ${existingListing?.is_negotiable !== false ? 'checked' : ''}/>
                  <span class="text-xs font-bold text-[#1F1B16]">Price Negotiable (भाडामा छलफल गर्न सकिने)</span>
                </label>
              </div>

              <div class="flex justify-between pt-3 border-t border-[#F0EBE3]">
                <button type="button" id="prev-step-2" class="btn-press px-4 py-2.5 rounded-[8px] bg-[#FDFBF7] border border-[#F0EBE3] text-[#6B6258] text-xs font-bold min-touch-target">
                  <span>${t('backBtn')}</span>
                </button>
                <button type="button" id="next-step-2" class="btn-press px-6 py-2.5 rounded-[8px] bg-[#D97757] hover:bg-[#c66849] text-white text-xs font-bold shadow-card flex items-center gap-1 min-touch-target">
                  <span>${t('nextBtn')}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- STEP 3: Specs & Photos -->
          <div id="wizard-step-panel-3" class="hidden flex flex-col gap-4">
            <div class="bg-white p-5 rounded-[12px] border border-[#F0EBE3] shadow-card flex flex-col gap-4">
              <div>
                <h3 class="text-sm font-bold text-[#1F1B16] mb-1">Specifications & Real Photos (सुविधा र फोटोहरू)</h3>
                <p class="text-xs text-[#6B6258]">${t('photoUploadNudge')}</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-[#1F1B16]" for="bedrooms-input">Bedrooms</label>
                  <input id="bedrooms-input" type="number" min="0" max="20" class="input-focus w-full px-3 py-2 text-[#1F1B16] text-sm font-medium min-touch-target" value="${existingListing?.bedrooms || 1}"/>
                </div>

                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-[#1F1B16]" for="bathrooms-input">Bathrooms</label>
                  <input id="bathrooms-input" type="number" min="0" max="10" class="input-focus w-full px-3 py-2 text-[#1F1B16] text-sm font-medium min-touch-target" value="${existingListing?.bathrooms || 1}"/>
                </div>

                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-[#1F1B16]" for="water-facility">Water Supply</label>
                  <input id="water-facility" class="input-focus w-full px-3 py-2 text-[#1F1B16] text-sm font-medium min-touch-target" placeholder="24/7 Melamchi + Boring" value="${existingListing?.water_facility || '24/7 Supply'}"/>
                </div>
              </div>

              <!-- Upload Dropzone -->
              <div class="pt-2 border-t border-[#F0EBE3]">
                <div id="dropzone" class="border-2 border-dashed border-[#D97757]/40 hover:border-[#D97757] rounded-[12px] p-6 text-center cursor-pointer bg-[#FDF0EC]/30 hover:bg-[#FDF0EC]/60 transition-all">
                  <input type="file" id="photo-file-input" multiple accept="image/*" class="hidden"/>
                  <div class="text-[#D97757] mb-1.5">
                    ${getIcon('camera', { class: 'w-8 h-8 mx-auto' })}
                  </div>
                  <p class="text-sm font-bold text-[#1F1B16]">Tap to Select or Drag Photos Here</p>
                  <p class="text-[11px] text-[#6B6258] mt-0.5">Upload JPG, PNG, or WebP photos of rooms, kitchen, and bathroom</p>
                </div>

                <!-- Upload progress bar -->
                <div id="upload-status" class="hidden text-xs text-[#D97757] flex items-center gap-2 mt-2">
                  <div class="w-3.5 h-3.5 border-2 border-[#D97757] border-t-transparent rounded-full animate-spin"></div>
                  <span id="upload-status-text">Uploading photos to Supabase Storage...</span>
                </div>

                <!-- Thumbnails Container -->
                <div id="thumbnails-grid" class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
                  <!-- Rendered dynamically -->
                </div>
              </div>

              <div class="flex justify-between pt-3 border-t border-[#F0EBE3]">
                <button type="button" id="prev-step-3" class="btn-press px-4 py-2.5 rounded-[8px] bg-[#FDFBF7] border border-[#F0EBE3] text-[#6B6258] text-xs font-bold min-touch-target">
                  <span>${t('backBtn')}</span>
                </button>
                <button type="button" id="next-step-3" class="btn-press px-6 py-2.5 rounded-[8px] bg-[#D97757] hover:bg-[#c66849] text-white text-xs font-bold shadow-card flex items-center gap-1 min-touch-target">
                  <span>${t('nextBtn')}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- STEP 4: Direct Contact & Verification -->
          <div id="wizard-step-panel-4" class="hidden flex flex-col gap-4">
            <div class="bg-white p-5 rounded-[12px] border border-[#F0EBE3] shadow-card flex flex-col gap-4">
              <div>
                <h3 class="text-sm font-bold text-[#1F1B16] mb-1">Direct Contact & Confirmation (सम्पर्क र प्रमाणीकरण)</h3>
                <p class="text-xs text-[#6B6258]">Tenants will connect with you straight through these verified channels.</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-[#1F1B16]" for="contact-name">
                    Contact Person / Owner Name <span class="text-[#D97757]">*</span>
                  </label>
                  <input id="contact-name" required class="input-focus w-full px-3.5 py-2.5 text-[#1F1B16] text-sm font-medium min-touch-target" placeholder="e.g. Rameshwor Karki" value="${defaultContactName}"/>
                </div>

                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-[#1F1B16]" for="contact-phone">
                    Primary Mobile Number <span class="text-[#D97757]">*</span>
                  </label>
                  <div class="flex items-center bg-[#FDFBF7] rounded-[8px] border border-[#F0EBE3] px-3 py-2 focus-within:border-[#D97757] focus-within:ring-2 focus-within:ring-[#D97757]/20 transition-all min-touch-target">
                    <span class="font-bold text-[#6B6258] mr-2 text-xs">🇳🇵 +977</span>
                    <input id="contact-phone" required type="tel" maxlength="10" class="w-full bg-transparent text-[#1F1B16] text-sm font-semibold focus:outline-none" placeholder="98XXXXXXXX" value="${defaultPhone}"/>
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-2 pt-2 border-t border-[#F0EBE3]">
                <label class="text-xs font-bold text-[#1F1B16]">Preferred Contact Method</label>
                <div class="grid grid-cols-3 gap-2">
                  <label class="p-2.5 rounded-[8px] bg-[#FDFBF7] border border-[#F0EBE3] flex items-center justify-center gap-1.5 cursor-pointer has-[:checked]:bg-[#FDF0EC] has-[:checked]:border-[#D97757]">
                    <input type="radio" name="contact_method" value="call" class="accent-[#D97757]" ${(existingListing?.contact_method || 'call') === 'call' ? 'checked' : ''}/>
                    <span class="text-xs font-bold text-[#1F1B16]">Phone Call</span>
                  </label>
                  <label class="p-2.5 rounded-[8px] bg-[#FDFBF7] border border-[#F0EBE3] flex items-center justify-center gap-1.5 cursor-pointer has-[:checked]:bg-[#FDF0EC] has-[:checked]:border-[#D97757]">
                    <input type="radio" name="contact_method" value="whatsapp" class="accent-[#D97757]" ${existingListing?.contact_method === 'whatsapp' ? 'checked' : ''}/>
                    <span class="text-xs font-bold text-[#1F1B16]">WhatsApp</span>
                  </label>
                  <label class="p-2.5 rounded-[8px] bg-[#FDFBF7] border border-[#F0EBE3] flex items-center justify-center gap-1.5 cursor-pointer has-[:checked]:bg-[#FDF0EC] has-[:checked]:border-[#D97757]">
                    <input type="radio" name="contact_method" value="viber" class="accent-[#D97757]" ${existingListing?.contact_method === 'viber' ? 'checked' : ''}/>
                    <span class="text-xs font-bold text-[#1F1B16]">Viber</span>
                  </label>
                </div>
              </div>

              <div class="pt-2">
                <label class="flex items-start gap-2.5 cursor-pointer select-none">
                  <input type="checkbox" required class="mt-0.5 w-4 h-4 accent-[#D97757] rounded cursor-pointer" checked/>
                  <span class="text-xs text-[#6B6258] leading-relaxed font-medium">
                    ${t('authorizedOwnerCheck')}
                  </span>
                </label>
              </div>

              <div class="flex justify-between pt-3 border-t border-[#F0EBE3]">
                <button type="button" id="prev-step-4" class="btn-press px-4 py-2.5 rounded-[8px] bg-[#FDFBF7] border border-[#F0EBE3] text-[#6B6258] text-xs font-bold min-touch-target">
                  <span>${t('backBtn')}</span>
                </button>
                <button id="submit-btn" type="submit" class="btn-press px-6 py-2.5 rounded-[8px] bg-[#D97757] hover:bg-[#c66849] text-white text-sm font-bold shadow-card flex items-center gap-1.5 cursor-pointer min-touch-target">
                  ${getIcon('send', { class: 'w-4 h-4 text-white' })}
                  <span>${editId ? 'Save Changes' : t('publishBtn')}</span>
                </button>
              </div>
            </div>
          </div>

        </form>
      </div>
    `;

    // Render photo thumbnails
    function renderThumbnails() {
      const grid = document.getElementById('thumbnails-grid');
      if (!grid) return;

      if (uploadedPhotoUrls.length === 0) {
        grid.innerHTML = '<p class="col-span-full text-xs text-[#6B6258] italic">No photos added yet. Upload at least one real photo.</p>';
        return;
      }

      grid.innerHTML = uploadedPhotoUrls.map((url, idx) => `
        <div class="relative group aspect-[4/3] rounded-[8px] overflow-hidden bg-[#FDFBF7] shadow-card border border-[#F0EBE3]">
          <img src="${url}" class="w-full h-full object-cover" alt="Photo ${idx + 1}"/>
          <button type="button" class="remove-photo-btn btn-press absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#1F1B16]/80 hover:bg-[#C1543D] text-white flex items-center justify-center text-xs opacity-90 hover:opacity-100 shadow-card transition-colors" data-index="${idx}" title="Remove photo">
            ${getIcon('x', { class: 'w-3 h-3' })}
          </button>
          ${idx === 0 ? '<span class="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-[4px] bg-white/95 text-[#D97757] font-bold text-[10px] shadow-card">Cover</span>' : ''}
        </div>
      `).join('');

      document.querySelectorAll('.remove-photo-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const index = parseInt(btn.getAttribute('data-index'), 10);
          uploadedPhotoUrls.splice(index, 1);
          renderThumbnails();
        });
      });
    }

    renderThumbnails();

    // Stepper Navigation Handlers
    document.getElementById('next-step-1')?.addEventListener('click', () => {
      const title = document.getElementById('listing-title')?.value.trim();
      if (!title) {
        showToast('Please enter a listing title', 'error');
        document.getElementById('listing-title')?.focus();
        return;
      }
      currentStep = 2;
      updateWizardUI();
    });

    document.getElementById('prev-step-2')?.addEventListener('click', () => {
      currentStep = 1;
      updateWizardUI();
    });

    document.getElementById('next-step-2')?.addEventListener('click', () => {
      const area = document.getElementById('location-area')?.value.trim();
      const price = document.getElementById('rental-price')?.value;
      if (!area) {
        showToast('Please enter neighborhood/area', 'error');
        document.getElementById('location-area')?.focus();
        return;
      }
      if (!price || parseFloat(price) <= 0) {
        showToast('Please enter valid monthly rent', 'error');
        document.getElementById('rental-price')?.focus();
        return;
      }
      currentStep = 3;
      updateWizardUI();
    });

    document.getElementById('prev-step-3')?.addEventListener('click', () => {
      currentStep = 2;
      updateWizardUI();
    });

    document.getElementById('next-step-3')?.addEventListener('click', () => {
      currentStep = 4;
      updateWizardUI();
    });

    document.getElementById('prev-step-4')?.addEventListener('click', () => {
      currentStep = 3;
      updateWizardUI();
    });

    // File Upload handling
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('photo-file-input');
    const uploadStatus = document.getElementById('upload-status');
    const uploadStatusText = document.getElementById('upload-status-text');

    dropzone?.addEventListener('click', () => fileInput?.click());

    dropzone?.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('border-[#D97757]', 'bg-[#FDF0EC]/60');
    });

    dropzone?.addEventListener('dragleave', () => {
      dropzone.classList.remove('border-[#D97757]', 'bg-[#FDF0EC]/60');
    });

    dropzone?.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('border-[#D97757]', 'bg-[#FDF0EC]/60');
      if (e.dataTransfer.files?.length) {
        handleFileUpload(e.dataTransfer.files);
      }
    });

    fileInput?.addEventListener('change', (e) => {
      if (e.target.files?.length) {
        handleFileUpload(e.target.files);
      }
    });

    async function handleFileUpload(files) {
      if (!files || files.length === 0) return;

      uploadStatus?.classList.remove('hidden');
      const currentUser = getCurrentUser();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split('.').pop() || 'jpg';
        const userId = currentUser?.id || 'guest';
        const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

        uploadStatusText.textContent = `Uploading photo ${i + 1} of ${files.length}...`;

        const { data, error } = await supabase.storage
          .from('listing-photos')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          showToast(`Photo upload failed: ${error.message}`, 'error');
        } else if (data) {
          const { data: { publicUrl } } = supabase.storage
            .from('listing-photos')
            .getPublicUrl(fileName);

          uploadedPhotoUrls.push(publicUrl);
          renderThumbnails();
        }
      }

      uploadStatus?.classList.add('hidden');
      showToast('Photos uploaded successfully!');
    }

    // Submit form
    document.getElementById('post-rental-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submit-btn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <span>Saving...</span>
      `;

      try {
        const currentUser = getCurrentUser();
        if (!currentUser) throw new Error('You must be logged in to submit a listing.');

        const category = document.querySelector('input[name="category"]:checked')?.value || 'flat';
        const title = document.getElementById('listing-title').value.trim();
        const description = document.getElementById('listing-description').value.trim();
        const location_city = document.getElementById('location-city').value;
        const location_area = document.getElementById('location-area').value.trim();
        const landmark = document.getElementById('location-landmark').value.trim();
        const price = parseFloat(document.getElementById('rental-price').value);
        const water_facility = document.getElementById('water-facility').value.trim();
        const bedrooms = parseInt(document.getElementById('bedrooms-input').value, 10) || 1;
        const bathrooms = parseInt(document.getElementById('bathrooms-input').value, 10) || 1;
        const is_negotiable = document.getElementById('is-negotiable').checked;
        const contact_name = document.getElementById('contact-name').value.trim();
        const contact_phone = document.getElementById('contact-phone').value.trim();
        const contact_method = document.querySelector('input[name="contact_method"]:checked')?.value || 'call';

        // Fallback demo photo if none uploaded
        const finalPhotos = uploadedPhotoUrls.length > 0 
          ? uploadedPhotoUrls 
          : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'];

        const payload = {
          title,
          description,
          category,
          location_city,
          location_area,
          landmark,
          price,
          currency: 'NPR',
          water_facility,
          bedrooms,
          bathrooms,
          is_negotiable,
          photos: finalPhotos,
          contact_name,
          contact_phone,
          contact_method,
          user_id: currentUser.id,
          status: 'active'
        };

        if (editId) {
          const { error } = await supabase
            .from('listings')
            .update(payload)
            .eq('id', editId)
            .eq('user_id', currentUser.id);

          if (error) throw error;
          showToast('Listing updated successfully! (लिस्टिङ अपडेट भयो)');
          navigateTo(`#/listing/${editId}`);
        } else {
          const { data, error } = await supabase
            .from('listings')
            .insert([payload])
            .select()
            .single();

          if (error) throw error;
          showToast('Listing published successfully! (लिस्टिङ पोस्ट भयो)');
          navigateTo(`#/listing/${data.id}`);
        }
      } catch (err) {
        showToast(err.message || 'Failed to save listing', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          ${getIcon('send', { class: 'w-4 h-4' })}
          <span>${editId ? 'Save Changes' : 'Publish Listing Now'}</span>
        `;
      }
    });
  }
};
