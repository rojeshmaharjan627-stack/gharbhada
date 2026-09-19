import { getIcon } from '../lib/icons.js';
import { t, getLanguage } from '../lib/i18n.js';

export function renderFooter() {
  const container = document.getElementById('footer-container');
  if (!container) return;

  const lang = getLanguage();

  container.innerHTML = `
    <footer class="bg-white border-t border-slate-200 py-14 mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Top Row: Brand & Mission -->
        <div class="flex flex-col md:flex-row justify-between gap-10 pb-12 border-b border-slate-100">
          <div class="max-w-md">
            <div class="flex items-center gap-2.5 mb-3">
              <div class="w-9 h-9 rounded-xl bg-[#1E40AF] text-white flex items-center justify-center shadow-xs">
                ${getIcon('home', { class: 'w-5 h-5 text-white' })}
              </div>
              <div class="flex flex-col">
                <span class="text-lg font-extrabold text-slate-900 tracking-tight leading-none">GharBhada</span>
                <span class="text-[11px] text-slate-500 font-semibold tracking-wide">घरभाडा नेपाल • Direct Rentals</span>
              </div>
            </div>
            <p class="text-xs text-slate-500 leading-relaxed mb-4">
              ${lang === 'ne' 
                ? 'नेपालको पहिलो प्रत्यक्ष भाडा प्लेटफर्म। काठमाडौँ, ललितपुर, भक्तपुर र पोखरामा ०% ब्रोकर शुल्कमा सिधै घरधनीसँग जोडिनुहोस्।' 
                : "Nepal's trusted direct rental marketplace connecting tenants and verified property owners across Kathmandu, Lalitpur, Bhaktapur, and Pokhara with 100% Zero Broker Commission."}
            </p>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-[#1E40AF] text-xs font-bold border border-blue-100">
              ${getIcon('shield-check', { class: 'w-4 h-4 text-[#1E40AF]' })}
              <span>100% Broker-Free Guarantee • ०% दलाली शुल्क</span>
            </div>
          </div>

          <!-- Quick Value-Add Utility Shortcuts -->
          <div class="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 max-w-sm w-full flex flex-col justify-between">
            <div>
              <span class="text-[10px] font-extrabold uppercase tracking-wider text-[#1E40AF]">Rental Tools & Calculators</span>
              <h4 class="text-sm font-bold text-slate-900 mt-1 mb-1.5">Free Landlord & Tenant Toolkit</h4>
              <p class="text-xs text-slate-500">Generate legally-backed rent receipts, calculate deposit requirements, and estimate affordability instantly.</p>
            </div>
            <div class="flex items-center gap-2 mt-4">
              <a href="#/" class="btn-brand text-xs py-2 px-4 rounded-xl shadow-xs">
                Launch Tools
              </a>
              <span class="text-[11px] text-slate-400 font-medium">Free • No Login Req.</span>
            </div>
          </div>
        </div>

        <!-- Middle Row: Programmatic SEO Links (Kathmandu, Lalitpur, Pokhara Localities) -->
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 py-10">
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5 flex items-center gap-1.5">
              ${getIcon('map-pin', { class: 'w-3.5 h-3.5 text-[#1E40AF]' })}
              <span>Kathmandu Localities</span>
            </h4>
            <ul class="space-y-2.5 text-xs text-slate-600 font-medium">
              <li><a href="#/?area=Baneshwor" class="hover:text-[#1E40AF] transition-colors">Rentals in New Baneshwor</a></li>
              <li><a href="#/?area=Baluwatar" class="hover:text-[#1E40AF] transition-colors">Flats in Baluwatar</a></li>
              <li><a href="#/?area=Maharajgunj" class="hover:text-[#1E40AF] transition-colors">Rooms in Maharajgunj</a></li>
              <li><a href="#/?area=Koteshwor" class="hover:text-[#1E40AF] transition-colors">Houses in Koteshwor</a></li>
              <li><a href="#/?area=Thamel" class="hover:text-[#1E40AF] transition-colors">Commercial in Thamel</a></li>
              <li><a href="#/?area=Kalanki" class="hover:text-[#1E40AF] transition-colors">Apartments in Kalanki</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5 flex items-center gap-1.5">
              ${getIcon('map-pin', { class: 'w-3.5 h-3.5 text-[#1E40AF]' })}
              <span>Lalitpur & Pokhara</span>
            </h4>
            <ul class="space-y-2.5 text-xs text-slate-600 font-medium">
              <li><a href="#/?area=Jhamsikhel" class="hover:text-[#1E40AF] transition-colors">Flats in Jhamsikhel</a></li>
              <li><a href="#/?area=Pulchowk" class="hover:text-[#1E40AF] transition-colors">Studio in Pulchowk</a></li>
              <li><a href="#/?area=Sanepa" class="hover:text-[#1E40AF] transition-colors">Bungalows in Sanepa</a></li>
              <li><a href="#/?area=Kupondole" class="hover:text-[#1E40AF] transition-colors">Office in Kupondole</a></li>
              <li><a href="#/?area=Lakeside" class="hover:text-[#1E40AF] transition-colors">Rentals in Lakeside Pokhara</a></li>
              <li><a href="#/?area=Suryabinayak" class="hover:text-[#1E40AF] transition-colors">Houses in Bhaktapur</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5 flex items-center gap-1.5">
              ${getIcon('home', { class: 'w-3.5 h-3.5 text-[#1E40AF]' })}
              <span>Property Categories</span>
            </h4>
            <ul class="space-y-2.5 text-xs text-slate-600 font-medium">
              <li><a href="#/?cat=room" class="hover:text-[#1E40AF] transition-colors">Single Rooms (कोठा भाडामा)</a></li>
              <li><a href="#/?cat=flat" class="hover:text-[#1E40AF] transition-colors">Flats & 2BHK Apartments</a></li>
              <li><a href="#/?cat=house" class="hover:text-[#1E40AF] transition-colors">Independent Houses & Villas</a></li>
              <li><a href="#/?cat=commercial" class="hover:text-[#1E40AF] transition-colors">Shutters & Retail Spaces</a></li>
              <li><a href="#/?cat=land" class="hover:text-[#1E40AF] transition-colors">Open Plots & Commercial Land</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5 flex items-center gap-1.5">
              ${getIcon('headphones', { class: 'w-3.5 h-3.5 text-[#1E40AF]' })}
              <span>Direct Support</span>
            </h4>
            <ul class="space-y-2.5 text-xs text-slate-600 font-medium">
              <li class="flex items-center gap-2">
                <span>Support: support@gharbhada.np</span>
              </li>
              <li class="flex items-center gap-2">
                ${getIcon('message-circle', { class: 'w-3.5 h-3.5 text-[#25D366]' })}
                <span>WhatsApp Landlord Helpdesk</span>
              </li>
              <li class="flex items-center gap-2">
                ${getIcon('shield-check', { class: 'w-3.5 h-3.5 text-[#1E40AF]' })}
                <span>Verified Direct Landlords</span>
              </li>
              <li class="pt-2">
                <a href="#/post" class="btn-brand w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold">
                  <span>+ Post Your Property</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Row: Copyright & Legal -->
        <div class="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-xs gap-3">
          <div>© 2026 GharBhada Nepal (घरभाडा). All rights reserved. Peer-to-peer verified rentals.</div>
          <div class="flex items-center gap-4">
            <a href="#/" class="hover:text-slate-600 transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#/" class="hover:text-slate-600 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#/" class="hover:text-slate-600 transition-colors">Nepali Tenancy Guidelines (भाडा सम्झौता नियम)</a>
          </div>
        </div>

      </div>
    </footer>
  `;
}

window.addEventListener('gharbhada:languageChange', renderFooter);
