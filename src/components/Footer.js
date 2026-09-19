import { getIcon } from '../lib/icons.js';
import { t, getLanguage } from '../lib/i18n.js';

export function renderFooter() {
  const container = document.getElementById('footer-container');
  if (!container) return;

  const lang = getLanguage();

  container.innerHTML = `
    <footer class="bg-white border-t border-slate-200/80 py-14 mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between gap-10">
        <div class="max-w-sm">
          <div class="flex items-center gap-2.5 mb-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#F04D36] to-[#FB923C] text-white flex items-center justify-center shadow-xs">
              ${getIcon('home', { class: 'w-4 h-4 text-white' })}
            </div>
            <span class="text-base font-extrabold text-slate-900 tracking-tight">GharBhada</span>
            <span class="text-xs text-slate-500 font-semibold">घरभाडा नेपाल</span>
          </div>
          <p class="text-xs text-slate-500 leading-relaxed mb-4">
            ${lang === 'ne' 
              ? 'नेपालको प्रत्यक्ष भाडा बजार: काठमाडौँ उपत्यका, पोखरा, चितवन लगायतका शहरहरूमा ०% ब्रोकर शुल्कमा सिधै घरधनीसँग सम्पर्क।' 
              : "Nepal's direct rental marketplace connecting tenants and verified property owners across Kathmandu Valley, Pokhara, Chitwan, and beyond with 100% Zero Broker Commission."}
          </p>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            ${getIcon('check-circle', { class: 'w-3.5 h-3.5 text-emerald-600' })}
            <span>Zero Brokerage Guarantee • १००% निःशुल्क</span>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Popular Locations</h4>
            <ul class="space-y-2.5 text-xs text-slate-600 font-medium">
              <li><a href="#/?area=Baneshwor" class="hover:text-[#F04D36] transition-colors">New Baneshwor</a></li>
              <li><a href="#/?area=Jhamsikhel" class="hover:text-[#F04D36] transition-colors">Jhamsikhel / Sanepa</a></li>
              <li><a href="#/?area=Pulchowk" class="hover:text-[#F04D36] transition-colors">Pulchowk, Lalitpur</a></li>
              <li><a href="#/?area=Lakeside" class="hover:text-[#F04D36] transition-colors">Lakeside Pokhara</a></li>
              <li><a href="#/?area=Baluwatar" class="hover:text-[#F04D36] transition-colors">Baluwatar / Maharajgunj</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Categories</h4>
            <ul class="space-y-2.5 text-xs text-slate-600 font-medium">
              <li><a href="#/?cat=room" class="hover:text-[#F04D36] transition-colors">Rooms (कोठा)</a></li>
              <li><a href="#/?cat=flat" class="hover:text-[#F04D36] transition-colors">Flats & Apartments</a></li>
              <li><a href="#/?cat=commercial" class="hover:text-[#F04D36] transition-colors">Shutters & Office</a></li>
              <li><a href="#/?cat=land" class="hover:text-[#F04D36] transition-colors">Land / Plot (जग्गा)</a></li>
              <li><a href="#/?cat=vehicle" class="hover:text-[#F04D36] transition-colors">Vehicle Rentals</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Direct Contact</h4>
            <ul class="space-y-2.5 text-xs text-slate-600 font-medium">
              <li class="flex items-center gap-2">
                ${getIcon('headphones', { class: 'w-3.5 h-3.5 text-[#F04D36]' })}
                <span>Support: namaste@gharbhada.np</span>
              </li>
              <li class="flex items-center gap-2">
                ${getIcon('message-circle', { class: 'w-3.5 h-3.5 text-[#25D366]' })}
                <span>WhatsApp Helpline</span>
              </li>
              <li class="flex items-center gap-2">
                ${getIcon('shield-check', { class: 'w-3.5 h-3.5 text-emerald-600]' })}
                <span>Verified Landlords Only</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-xs gap-3">
        <div>© 2026 GharBhada Nepal (घरभाडा). All rights reserved. Direct peer-to-peer tenancy.</div>
        <div class="flex items-center gap-4">
          <a href="#/" class="hover:text-slate-600 transition-colors">Terms of Service</a>
          <span>•</span>
          <a href="#/" class="hover:text-slate-600 transition-colors">Privacy Policy</a>
          <span>•</span>
          <a href="#/" class="hover:text-slate-600 transition-colors">Safety Guidelines (भाडामा बस्ने सल्लाह)</a>
        </div>
      </div>
    </footer>
  `;
}

window.addEventListener('gharbhada:languageChange', renderFooter);
