export function renderFooter() {
  const container = document.getElementById('footer-container');
  if (!container) return;

  container.innerHTML = `
    <footer class="bg-surface-container-low border-t border-surface-container-high py-12 mt-16">
      <div class="max-w-7xl mx-auto px-margin-sm lg:px-margin flex flex-col md:flex-row justify-between gap-8">
        <div class="max-w-sm">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-2xl">🏠</span>
            <span class="font-headline-sm text-headline-sm text-primary font-extrabold">GharBhada</span>
            <span class="font-label-sm text-label-sm text-on-surface-variant">घरभाडा नेपाल</span>
          </div>
          <p class="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-4">
            Nepal's direct rental marketplace connecting tenants and verified property owners across Kathmandu Valley, Pokhara, Chitwan, and beyond with 100% Zero Broker Commission.
          </p>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
            <span class="material-symbols-outlined text-[16px]">verified</span>
            <span>Zero Brokerage Guarantee</span>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div>
            <h4 class="font-label-lg text-label-lg text-on-surface font-bold mb-3">Popular Locations</h4>
            <ul class="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
              <li><a href="#/?area=Baneshwor" class="hover:text-primary transition-colors">New Baneshwor</a></li>
              <li><a href="#/?area=Jhamsikhel" class="hover:text-primary transition-colors">Jhamsikhel / Sanepa</a></li>
              <li><a href="#/?area=Pulchowk" class="hover:text-primary transition-colors">Pulchowk, Lalitpur</a></li>
              <li><a href="#/?area=Lakeside" class="hover:text-primary transition-colors">Lakeside Pokhara</a></li>
              <li><a href="#/?area=Baluwatar" class="hover:text-primary transition-colors">Baluwatar / Maharajgunj</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-label-lg text-label-lg text-on-surface font-bold mb-3">Categories</h4>
            <ul class="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
              <li><a href="#/?cat=room" class="hover:text-primary transition-colors">Rooms (कोठा)</a></li>
              <li><a href="#/?cat=flat" class="hover:text-primary transition-colors">Flats & Apartments</a></li>
              <li><a href="#/?cat=commercial" class="hover:text-primary transition-colors">Shutters & Office</a></li>
              <li><a href="#/?cat=land" class="hover:text-primary transition-colors">Land / Plot (जग्गा)</a></li>
              <li><a href="#/?cat=vehicle" class="hover:text-primary transition-colors">Vehicle Rentals</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-label-lg text-label-lg text-on-surface font-bold mb-3">Direct Contact</h4>
            <ul class="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
              <li class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px] text-primary">support_agent</span>
                <span>Support: Namaste@gharbhada.np</span>
              </li>
              <li class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px] text-[#25D366]">chat</span>
                <span>WhatsApp Helpline</span>
              </li>
              <li class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px] text-secondary">security</span>
                <span>Verified Landlords Only</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-margin-sm lg:px-margin mt-8 pt-6 border-t border-surface-container-high/60 flex flex-col sm:flex-row items-center justify-between text-on-surface-variant text-label-sm font-label-sm gap-4">
        <div>© 2026 GharBhada Nepal (घरभाडा). All rights reserved. Direct peer-to-peer tenancy.</div>
        <div class="flex items-center gap-4">
          <a href="#/" class="hover:underline">Terms of Service</a>
          <span>•</span>
          <a href="#/" class="hover:underline">Privacy Policy</a>
          <span>•</span>
          <a href="#/" class="hover:underline">Safety Guidelines (भाडामा बस्ने सल्लाह)</a>
        </div>
      </div>
    </footer>
  `;
}
