import { supabase } from '../lib/supabase.js';
import { getCurrentUser } from '../lib/auth.js';
import { showToast } from '../lib/toast.js';
import { navigateTo } from '../lib/router.js';

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
      <div class="max-w-4xl mx-auto px-margin-sm lg:px-margin py-8 animate-fade-in">
        <!-- Header -->
        <div class="mb-8">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm font-bold mb-2">
            <span>🇳🇵</span>
            <span>${editId ? 'Edit Your Rental Listing (लिस्टिङ सम्पादन)' : 'Direct Owner Listing • Zero Broker Commission'}</span>
          </div>
          <h1 class="font-headline-lg text-headline-lg lg:text-[32px] font-black text-on-surface">
            ${editId ? 'Edit Rental Listing' : 'Post a Rental Property (घरभाडा पोस्ट गर्नुहोस्)'}
          </h1>
          <p class="font-body-md text-on-surface-variant mt-1">
            Connect directly with verified tenants across Nepal. No brokerage charges or intermediaries.
          </p>
        </div>

        <!-- Form -->
        <form id="post-rental-form" class="flex flex-col gap-8">
          
          <!-- 1. Category Selection -->
          <section class="bg-surface-container-lowest p-space-lg rounded-DEFAULT shadow-sm flex flex-col gap-4">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-primary"></span>
              <h2 class="font-headline-sm text-headline-sm font-bold text-on-surface">1. Property Category (सम्पत्तिको प्रकार)</h2>
            </div>
            
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
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
                    <div class="p-3 py-4 rounded-DEFAULT bg-surface-container-low peer-checked:bg-surface-container peer-checked:border-2 peer-checked:border-primary border-2 border-transparent transition-all flex flex-col items-center text-center gap-1.5 hover:bg-surface-container-high">
                      <span class="text-2xl">${cat.emoji}</span>
                      <span class="font-label-sm text-label-sm font-bold text-on-surface">${cat.label}</span>
                    </div>
                  </label>
                `;
              }).join('')}
            </div>
          </section>

          <!-- 2. Listing Title & Description -->
          <section class="bg-surface-container-lowest p-space-lg rounded-DEFAULT shadow-sm flex flex-col gap-4">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-primary"></span>
              <h2 class="font-headline-sm text-headline-sm font-bold text-on-surface">2. Title & Narrative (शीर्षक र विवरण)</h2>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="font-label-md text-label-md text-on-surface font-bold" for="listing-title">
                Catchy Listing Title <span class="text-primary">*</span>
              </label>
              <input id="listing-title" required maxlength="100" class="w-full px-4 py-3 rounded-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-all font-body-md" placeholder="e.g., 2 BHK Sunny Flat near Shankhamul Bridge with Car Parking" value="${existingListing?.title || ''}"/>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="font-label-md text-label-md text-on-surface font-bold" for="listing-description">
                Comprehensive Description (नेपाली वा English मा लेख्नुहोस्)
              </label>
              <textarea id="listing-description" rows="5" class="w-full p-4 rounded-2xl bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-all font-body-md" placeholder="Mention floor details, sunlight, water facility (Melamchi/Boring), electricity sub-meter, preferred tenant (family/bachelor), and nearby landmarks...">${existingListing?.description || ''}</textarea>
            </div>
          </section>

          <!-- 3. Location -->
          <section class="bg-surface-container-lowest p-space-lg rounded-DEFAULT shadow-sm flex flex-col gap-4">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-primary"></span>
              <h2 class="font-headline-sm text-headline-sm font-bold text-on-surface">3. Location (स्थान / ठेगाना)</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="font-label-md text-label-md text-on-surface font-bold" for="location-city">
                  District / City <span class="text-primary">*</span>
                </label>
                <select id="location-city" required class="w-full px-4 py-3 rounded-full bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-body-md cursor-pointer">
                  ${['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan', 'Butwal', 'Dharan', 'Other'].map(city => `
                    <option value="${city}" ${(existingListing?.location_city || 'Kathmandu') === city ? 'selected' : ''}>${city}</option>
                  `).join('')}
                </select>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="font-label-md text-label-md text-on-surface font-bold" for="location-area">
                  Neighborhood / Area (टोल / ठाउँ) <span class="text-primary">*</span>
                </label>
                <input id="location-area" required class="w-full px-4 py-3 rounded-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary font-body-md" placeholder="e.g. New Baneshwor, Jhamsikhel, Pulchowk" value="${existingListing?.location_area || ''}"/>
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="font-label-md text-label-md text-on-surface font-bold" for="location-landmark">
                Nearby Landmark / Street Access
              </label>
              <input id="location-landmark" class="w-full px-4 py-3 rounded-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary font-body-md" placeholder="e.g. Near Shankhamul Bridge, 50m inside ring road" value="${existingListing?.landmark || ''}"/>
            </div>
          </section>

          <!-- 4. Pricing & Specs -->
          <section class="bg-surface-container-lowest p-space-lg rounded-DEFAULT shadow-sm flex flex-col gap-4">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-primary"></span>
              <h2 class="font-headline-sm text-headline-sm font-bold text-on-surface">4. Pricing & Details (भाडा र विवरण)</h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="font-label-md text-label-md text-on-surface font-bold" for="rental-price">
                  Monthly Rent in NPR (नेपाली रुपैयाँ) <span class="text-primary">*</span>
                </label>
                <div class="flex items-center bg-surface-container-low rounded-full px-4 py-2.5 focus-within:ring-2 focus-within:ring-primary">
                  <span class="font-bold text-primary mr-2">रु (Rs.)</span>
                  <input id="rental-price" required type="number" min="0" step="500" class="w-full bg-transparent text-on-surface font-bold text-lg focus:outline-none" placeholder="25000" value="${existingListing?.price || ''}"/>
                </div>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="font-label-md text-label-md text-on-surface font-bold" for="water-facility">
                  Water Facility (खानेपानी)
                </label>
                <input id="water-facility" class="w-full px-4 py-3 rounded-full bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-body-md" placeholder="e.g. 24/7 Melamchi + Deep Boring" value="${existingListing?.water_facility || '24/7 Supply'}"/>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="font-label-md text-label-md text-on-surface font-bold" for="bedrooms-input">Bedrooms</label>
                <input id="bedrooms-input" type="number" min="0" max="20" class="w-full px-4 py-2.5 rounded-full bg-surface-container-low text-on-surface focus:outline-none font-body-md" value="${existingListing?.bedrooms || 1}"/>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="font-label-md text-label-md text-on-surface font-bold" for="bathrooms-input">Bathrooms</label>
                <input id="bathrooms-input" type="number" min="0" max="10" class="w-full px-4 py-2.5 rounded-full bg-surface-container-low text-on-surface focus:outline-none font-body-md" value="${existingListing?.bathrooms || 1}"/>
              </div>

              <div class="flex items-center pt-6">
                <label class="flex items-center gap-2 cursor-pointer select-none">
                  <input id="is-negotiable" type="checkbox" class="w-5 h-5 accent-primary rounded cursor-pointer" ${existingListing?.is_negotiable !== false ? 'checked' : ''}/>
                  <span class="font-label-md text-label-md font-bold text-on-surface">Price Negotiable</span>
                </label>
              </div>
            </div>
          </section>

          <!-- 5. Property Photos (Supabase Storage) -->
          <section class="bg-surface-container-lowest p-space-lg rounded-DEFAULT shadow-sm flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-primary"></span>
                <h2 class="font-headline-sm text-headline-sm font-bold text-on-surface">5. Property Photos (फोटोहरू)</h2>
              </div>
              <span class="font-label-sm text-label-sm text-secondary font-semibold">Supabase Storage</span>
            </div>

            <!-- Upload Dropzone -->
            <div id="dropzone" class="border-2 border-dashed border-primary/30 hover:border-primary rounded-2xl p-6 text-center cursor-pointer bg-surface-container-low/50 hover:bg-surface-container-low transition-all">
              <input type="file" id="photo-file-input" multiple accept="image/*" class="hidden"/>
              <span class="material-symbols-outlined text-4xl text-primary mb-2">cloud_upload</span>
              <p class="font-label-lg text-label-lg font-bold text-on-surface">Click or Drag & Drop Property Images</p>
              <p class="font-body-sm text-xs text-on-surface-variant mt-1">Upload high-res JPG, PNG, or WebP photos (Max 10MB each)</p>
            </div>

            <!-- Upload progress bar -->
            <div id="upload-status" class="hidden font-label-sm text-label-sm text-primary flex items-center gap-2">
              <div class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span id="upload-status-text">Uploading photos to Supabase Storage...</span>
            </div>

            <!-- Thumbnails Container -->
            <div id="thumbnails-grid" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <!-- Rendered dynamically -->
            </div>
          </section>

          <!-- 6. Direct Contact Channels -->
          <section class="bg-surface-container-lowest p-space-lg rounded-DEFAULT shadow-sm flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-primary"></span>
                <h2 class="font-headline-sm text-headline-sm font-bold text-on-surface">6. Direct Contact Channels (सम्पर्क विवरण)</h2>
              </div>
              <span class="font-label-sm text-label-sm text-secondary font-semibold">Tenants contact you directly</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="font-label-md text-label-md text-on-surface font-bold" for="contact-name">
                  Contact Person / Owner Name <span class="text-primary">*</span>
                </label>
                <input id="contact-name" required class="w-full px-4 py-3 rounded-full bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-body-md" placeholder="e.g. Rameshwor Karki" value="${defaultContactName}"/>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="font-label-md text-label-md text-on-surface font-bold" for="contact-phone">
                  Primary Mobile Number <span class="text-primary">*</span>
                </label>
                <div class="flex items-center bg-surface-container-low rounded-full px-4 py-2.5 focus-within:ring-2 focus-within:ring-primary">
                  <span class="font-bold text-secondary mr-2">+977</span>
                  <input id="contact-phone" required type="tel" maxlength="10" class="w-full bg-transparent text-on-surface font-body-md focus:outline-none" placeholder="98XXXXXXXX" value="${defaultPhone}"/>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2 pt-2">
              <label class="font-label-md text-label-md text-on-surface font-bold">Preferred Contact Method</label>
              <div class="flex flex-wrap gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="contact_method" value="call" class="accent-primary" ${(existingListing?.contact_method || 'call') === 'call' ? 'checked' : ''}/>
                  <span class="font-label-md text-label-md">Direct Call (फोन कल)</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="contact_method" value="whatsapp" class="accent-primary" ${existingListing?.contact_method === 'whatsapp' ? 'checked' : ''}/>
                  <span class="font-label-md text-label-md">WhatsApp</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="contact_method" value="viber" class="accent-primary" ${existingListing?.contact_method === 'viber' ? 'checked' : ''}/>
                  <span class="font-label-md text-label-md">Viber</span>
                </label>
              </div>
            </div>
          </section>

          <!-- 7. Confirmation & Submit -->
          <section class="bg-surface-container-lowest p-space-lg rounded-DEFAULT shadow-sm flex flex-col gap-4">
            <label class="flex items-start gap-3 cursor-pointer select-none">
              <input type="checkbox" required class="mt-1 w-5 h-5 accent-primary rounded cursor-pointer" checked/>
              <span class="font-body-sm text-body-sm text-on-surface">
                I solemnly confirm that I am the authorized owner or representative of this property. All information and NPR rates are accurate according to Nepal Tenancy guidelines. (म यो सम्पत्तिको आधिकारिक धनी भएको प्रमाणित गर्दछु।)
              </span>
            </label>

            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-surface-container-high">
              <a href="#/my-listings" class="w-full sm:w-auto px-6 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-center">
                Cancel
              </a>
              <button id="submit-btn" type="submit" class="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary hover:bg-surface-tint text-on-primary font-headline-sm text-headline-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-[22px]">rocket_launch</span>
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
        <div class="relative group aspect-[4/3] rounded-DEFAULT overflow-hidden bg-surface-container shadow-sm">
          <img src="${url}" class="w-full h-full object-cover"/>
          <button type="button" class="remove-photo-btn absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-error text-on-error flex items-center justify-center text-xs opacity-90 hover:opacity-100 shadow transition-opacity" data-index="${idx}" title="Remove photo">
            ✕
          </button>
          ${idx === 0 ? '<span class="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 text-primary font-bold text-[10px]">Cover</span>' : ''}
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
