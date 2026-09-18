import { supabase } from '../lib/supabase.js';
import { getCurrentUser } from '../lib/auth.js';
import { showToast } from '../lib/toast.js';
import { navigateTo } from '../lib/router.js';
import { getIcon } from '../lib/icons.js';

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

    container.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
        <!-- Header -->
        <div class="mb-6">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-light text-primary text-[11px] font-semibold mb-2 border border-primary/20">
            <span>🇳🇵</span>
            <span>${editId ? 'Edit Your Rental Listing (लिस्टिङ सम्पादन)' : 'Direct Owner Listing • Zero Broker Commission'}</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            ${editId ? 'Edit Rental Listing' : 'Post a Rental Property (घरभाडा पोस्ट गर्नुहोस्)'}
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">
            Connect directly with verified tenants across Nepal. No brokerage charges or intermediaries.
          </p>
        </div>

        <!-- Form -->
        <form id="post-rental-form" class="flex flex-col gap-5">
          
          <!-- 1. Category Selection -->
          <section class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-3.5">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
              <h2 class="text-sm font-bold text-slate-800">1. Property Category (सम्पत्तिको प्रकार)</h2>
            </div>
            
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              ${[
                { id: 'room', label: 'Room (कोठा)', emoji: '🛏️' },
                { id: 'flat', label: 'Flat (फ्ल्याट)', emoji: '🏢' },
                { id: 'house', label: 'Full House (घर)', emoji: '🏠' },
                { id: 'commercial', label: 'Shutter (सटर)', emoji: '🏬' },
                { id: 'land', label: 'Land (जग्गा)', emoji: '🏞️' },
                { id: 'vehicle', label: 'Vehicle (सवारी)', emoji: '🏍️' }
              ].map(cat => {
                const isChecked = (existingListing?.category || 'flat') === cat.id;
                return `
                  <label class="group relative cursor-pointer">
                    <input type="radio" name="category" value="${cat.id}" class="peer sr-only" ${isChecked ? 'checked' : ''}/>
                    <div class="p-2.5 rounded-lg bg-slate-50 peer-checked:bg-primary-light peer-checked:border-primary peer-checked:text-primary border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col items-center text-center gap-1 hover:bg-slate-100">
                      <span class="text-xl">${cat.emoji}</span>
                      <span class="text-xs font-semibold text-slate-800">${cat.label}</span>
                    </div>
                  </label>
                `;
              }).join('')}
            </div>
          </section>

          <!-- 2. Listing Title & Description -->
          <section class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-3.5">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
              <h2 class="text-sm font-bold text-slate-800">2. Title & Narrative (शीर्षक र विवरण)</h2>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-slate-700" for="listing-title">
                Catchy Listing Title <span class="text-primary">*</span>
              </label>
              <input id="listing-title" required maxlength="100" class="input-interactive w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm" placeholder="e.g., 2 BHK Sunny Flat near Shankhamul Bridge with Car Parking" value="${existingListing?.title || ''}"/>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-slate-700" for="listing-description">
                Comprehensive Description (नेपाली वा English मा लेख्नुहोस्)
              </label>
              <textarea id="listing-description" rows="4" class="input-interactive w-full p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm leading-relaxed" placeholder="Mention floor details, sunlight, water facility (Melamchi/Boring), electricity sub-meter, preferred tenant (family/bachelor), and nearby landmarks...">${existingListing?.description || ''}</textarea>
            </div>
          </section>

          <!-- 3. Location -->
          <section class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-3.5">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
              <h2 class="text-sm font-bold text-slate-800">3. Location (स्थान / ठेगाना)</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-700" for="location-city">
                  District / City <span class="text-primary">*</span>
                </label>
                <select id="location-city" required class="input-interactive w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-900 text-xs sm:text-sm cursor-pointer">
                  ${['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan', 'Butwal', 'Dharan', 'Other'].map(city => `
                    <option value="${city}" ${(existingListing?.location_city || 'Kathmandu') === city ? 'selected' : ''}>${city}</option>
                  `).join('')}
                </select>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-700" for="location-area">
                  Neighborhood / Area (टोल / ठाउँ) <span class="text-primary">*</span>
                </label>
                <input id="location-area" required class="input-interactive w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm" placeholder="e.g. New Baneshwor, Jhamsikhel, Pulchowk" value="${existingListing?.location_area || ''}"/>
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-slate-700" for="location-landmark">
                Nearby Landmark / Street Access
              </label>
              <input id="location-landmark" class="input-interactive w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm" placeholder="e.g. Near Shankhamul Bridge, 50m inside ring road" value="${existingListing?.landmark || ''}"/>
            </div>
          </section>

          <!-- 4. Pricing & Specs -->
          <section class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-3.5">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
              <h2 class="text-sm font-bold text-slate-800">4. Pricing & Details (भाडा र विवरण)</h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-700" for="rental-price">
                  Monthly Rent in NPR (नेपाली रुपैयाँ) <span class="text-primary">*</span>
                </label>
                <div class="flex items-center bg-slate-50 rounded-lg border border-slate-200/80 px-3 py-2 focus-within:bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <span class="font-bold text-primary mr-2 text-xs">रु (Rs.)</span>
                  <input id="rental-price" required type="number" min="0" step="500" class="w-full bg-transparent text-slate-900 font-bold text-sm focus:outline-none" placeholder="25000" value="${existingListing?.price || ''}"/>
                </div>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-700" for="water-facility">
                  Water Facility (खानेपानी)
                </label>
                <input id="water-facility" class="input-interactive w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-900 text-xs sm:text-sm" placeholder="e.g. 24/7 Melamchi + Deep Boring" value="${existingListing?.water_facility || '24/7 Supply'}"/>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-700" for="bedrooms-input">Bedrooms</label>
                <input id="bedrooms-input" type="number" min="0" max="20" class="input-interactive w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-900 text-xs sm:text-sm" value="${existingListing?.bedrooms || 1}"/>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-700" for="bathrooms-input">Bathrooms</label>
                <input id="bathrooms-input" type="number" min="0" max="10" class="input-interactive w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-900 text-xs sm:text-sm" value="${existingListing?.bathrooms || 1}"/>
              </div>

              <div class="flex items-center pt-5">
                <label class="flex items-center gap-2 cursor-pointer select-none">
                  <input id="is-negotiable" type="checkbox" class="w-4 h-4 accent-primary rounded cursor-pointer" ${existingListing?.is_negotiable !== false ? 'checked' : ''}/>
                  <span class="text-xs font-semibold text-slate-700">Price Negotiable</span>
                </label>
              </div>
            </div>
          </section>

          <!-- 5. Property Photos (Supabase Storage) -->
          <section class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-3.5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <h2 class="text-sm font-bold text-slate-800">5. Property Photos (फोटोहरू)</h2>
              </div>
              <span class="text-[11px] text-slate-500 font-medium">Supabase Storage</span>
            </div>

            <!-- Upload Dropzone -->
            <div id="dropzone" class="border border-dashed border-primary/40 hover:border-primary rounded-xl p-6 text-center cursor-pointer bg-primary-light/40 hover:bg-primary-light/80 transition-all">
              <input type="file" id="photo-file-input" multiple accept="image/*" class="hidden"/>
              <div class="text-primary mb-1">
                ${getIcon('upload-cloud', { class: 'w-8 h-8 mx-auto' })}
              </div>
              <p class="text-xs sm:text-sm font-semibold text-slate-800">Click or Drag & Drop Property Images</p>
              <p class="text-[11px] text-slate-500 mt-0.5">Upload JPG, PNG, or WebP photos (Max 10MB each)</p>
            </div>

            <!-- Upload progress bar -->
            <div id="upload-status" class="hidden text-xs text-primary flex items-center gap-2">
              <div class="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span id="upload-status-text">Uploading photos to Supabase Storage...</span>
            </div>

            <!-- Thumbnails Container -->
            <div id="thumbnails-grid" class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <!-- Rendered dynamically -->
            </div>
          </section>

          <!-- 6. Direct Contact Channels -->
          <section class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-3.5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <h2 class="text-sm font-bold text-slate-800">6. Direct Contact Channels (सम्पर्क विवरण)</h2>
              </div>
              <span class="text-[11px] text-slate-500 font-medium">Direct tenant connection</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-700" for="contact-name">
                  Contact Person / Owner Name <span class="text-primary">*</span>
                </label>
                <input id="contact-name" required class="input-interactive w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-900 text-xs sm:text-sm" placeholder="e.g. Rameshwor Karki" value="${defaultContactName}"/>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-700" for="contact-phone">
                  Primary Mobile Number <span class="text-primary">*</span>
                </label>
                <div class="flex items-center bg-slate-50 rounded-lg border border-slate-200/80 px-3 py-2 focus-within:bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <span class="font-bold text-slate-500 mr-2 text-xs">+977</span>
                  <input id="contact-phone" required type="tel" maxlength="10" class="w-full bg-transparent text-slate-900 text-xs sm:text-sm focus:outline-none" placeholder="98XXXXXXXX" value="${defaultPhone}"/>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2 pt-1">
              <label class="text-xs font-semibold text-slate-700">Preferred Contact Method</label>
              <div class="flex flex-wrap gap-4">
                <label class="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="contact_method" value="call" class="accent-primary" ${(existingListing?.contact_method || 'call') === 'call' ? 'checked' : ''}/>
                  <span class="text-xs font-medium text-slate-700">Direct Call (फोन कल)</span>
                </label>
                <label class="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="contact_method" value="whatsapp" class="accent-primary" ${existingListing?.contact_method === 'whatsapp' ? 'checked' : ''}/>
                  <span class="text-xs font-medium text-slate-700">WhatsApp</span>
                </label>
                <label class="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="contact_method" value="viber" class="accent-primary" ${existingListing?.contact_method === 'viber' ? 'checked' : ''}/>
                  <span class="text-xs font-medium text-slate-700">Viber</span>
                </label>
              </div>
            </div>
          </section>

          <!-- 7. Confirmation & Submit -->
          <section class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-3.5">
            <label class="flex items-start gap-2.5 cursor-pointer select-none">
              <input type="checkbox" required class="mt-0.5 w-4 h-4 accent-primary rounded cursor-pointer" checked/>
              <span class="text-xs text-slate-600 leading-relaxed">
                I solemnly confirm that I am the authorized owner or representative of this property. All information and NPR rates are accurate according to Nepal Tenancy guidelines. (म यो सम्पत्तिको आधिकारिक धनी भएको प्रमाणित गर्दछु।)
              </span>
            </label>

            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <a href="#/my-listings" class="btn-interactive w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold text-center transition-colors">
                Cancel
              </a>
              <button id="submit-btn" type="submit" class="btn-interactive w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                ${getIcon('send', { class: 'w-4 h-4' })}
                <span>${editId ? 'Save Changes (अपडेट गर्नुहोस्)' : 'Publish Listing Now (पोस्ट गर्नुहोस्)'}</span>
              </button>
            </div>
          </section>
        </form>
      </div>
    `;

    // Render thumbnails helper
    function renderThumbnails() {
      const grid = document.getElementById('thumbnails-grid');
      if (!grid) return;

      if (uploadedPhotoUrls.length === 0) {
        grid.innerHTML = '<p class="col-span-full text-xs text-on-surface-variant italic">No photos added yet. Upload at least one photo of the room/flat.</p>';
        return;
      }

      grid.innerHTML = uploadedPhotoUrls.map((url, idx) => `
        <div class="relative group aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 shadow-xs border border-slate-200/80">
          <img src="${url}" class="w-full h-full object-cover"/>
          <button type="button" class="remove-photo-btn btn-interactive absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white flex items-center justify-center text-xs opacity-90 hover:opacity-100 shadow-xs transition-colors" data-index="${idx}" title="Remove photo">
            ${getIcon('x', { class: 'w-3 h-3' })}
          </button>
          ${idx === 0 ? '<span class="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-white/90 text-primary font-bold text-[10px] shadow-xs">Cover</span>' : ''}
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

    // File Upload handling
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('photo-file-input');
    const uploadStatus = document.getElementById('upload-status');
    const uploadStatusText = document.getElementById('upload-status-text');

    dropzone?.addEventListener('click', () => fileInput?.click());

    dropzone?.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('border-primary', 'bg-surface-container');
    });

    dropzone?.addEventListener('dragleave', () => {
      dropzone.classList.remove('border-primary', 'bg-surface-container');
    });

    dropzone?.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('border-primary', 'bg-surface-container');
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
        <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
          <span class="material-symbols-outlined text-[22px]">rocket_launch</span>
          <span>${editId ? 'Save Changes' : 'Publish Listing Now'}</span>
        `;
      }
    });
  }
};
