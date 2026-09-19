import { getIcon } from '../lib/icons.js';
import { t, getLanguage } from '../lib/i18n.js';

export function renderFooter() {
  const container = document.getElementById('footer-container');
  if (!container) return;

  const lang = getLanguage();

  container.innerHTML = `
    <footer class="bg-white border-t border-[#F0EBE3] py-12 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between gap-8">
        <div class="max-w-sm">
          <div class="flex items-center gap-2 mb-2.5">
            <span class="text-xl">🏠</span>
            <span class="text-base font-bold text-[#D97757] tracking-tight">GharBhada</span>
            <span class="text-xs text-[#6B6258] font-semibold">घरभाडा नेपाल</span>
          </div>
          <p class="text-xs text-[#6B6258] leading-relaxed mb-3.5">
            ${lang === 'ne' 
              ? 'नेपालको प्रत्यक्ष भाडा बजार: काठमाडौँ उपत्यका, पोखरा, चितवन लगायतका शहरहरूमा ०% ब्रोकर शुल्कमा सिधै घरधनीसँग सम्पर्क।' 
              : "Nepal's direct rental marketplace connecting tenants and verified property owners across Kathmandu Valley, Pokhara, Chitwan, and beyond with 100% Zero Broker Commission."}
          </p>
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-[#EEF4F0] text-[#5B8266] text-xs font-bold border border-[#5B8266]/20">
            ${getIcon('check-circle', { class: 'w-3.5 h-3.5 text-[#5B8266]' })}
            <span>Zero Brokerage Guarantee • १००% निःशुल्क</span>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-[#1F1B16] mb-3">Popular Locations</h4>
            <ul class="space-y-2 text-xs text-[#6B6258] font-medium">
              <li><a href="#/?area=Baneshwor" class="hover:text-[#D97757] transition-colors">New Baneshwor</a></li>
              <li><a href="#/?area=Jhamsikhel" class="hover:text-[#D97757] transition-colors">Jhamsikhel / Sanepa</a></li>
              <li><a href="#/?area=Pulchowk" class="hover:text-[#D97757] transition-colors">Pulchowk, Lalitpur</a></li>
              <li><a href="#/?area=Lakeside" class="hover:text-[#D97757] transition-colors">Lakeside Pokhara</a></li>
              <li><a href="#/?area=Baluwatar" class="hover:text-[#D97757] transition-colors">Baluwatar / Maharajgunj</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-[#1F1B16] mb-3">Categories</h4>
            <ul class="space-y-2 text-xs text-[#6B6258] font-medium">
              <li><a href="#/?cat=room" class="hover:text-[#D97757] transition-colors">Rooms (कोठा)</a></li>
              <li><a href="#/?cat=flat" class="hover:text-[#D97757] transition-colors">Flats & Apartments</a></li>
              <li><a href="#/?cat=commercial" class="hover:text-[#D97757] transition-colors">Shutters & Office</a></li>
              <li><a href="#/?cat=land" class="hover:text-[#D97757] transition-colors">Land / Plot (जग्गा)</a></li>
              <li><a href="#/?cat=vehicle" class="hover:text-[#D97757] transition-colors">Vehicle Rentals</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-[#1F1B16] mb-3">Direct Contact</h4>
            <ul class="space-y-2 text-xs text-[#6B6258] font-medium">
              <li class="flex items-center gap-1.5">
                ${getIcon('headphones', { class: 'w-3.5 h-3.5 text-[#D97757]' })}
                <span>Support: namaste@gharbhada.np</span>
              </li>
              <li class="flex items-center gap-1.5">
                ${getIcon('message-circle', { class: 'w-3.5 h-3.5 text-[#25D366]' })}
                <span>WhatsApp Helpline</span>
              </li>
              <li class="flex items-center gap-1.5">
                ${getIcon('shield-check', { class: 'w-3.5 h-3.5 text-[#7C9885]' })}
                <span>Verified Landlords Only</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-5 border-t border-[#F0EBE3] flex flex-col sm:flex-row items-center justify-between text-[#6B6258] text-xs gap-3">
        <div>© 2026 GharBhada Nepal (घरभाडा). All rights reserved. Direct peer-to-peer tenancy.</div>
        <div class="flex items-center gap-3">
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

window.addEventListener('gharbhada:languageChange', renderFooter);
