import { getIcon } from '../lib/icons.js';

export function renderFooter() {
  const container = document.getElementById('footer-container');
  if (!container) return;

  container.innerHTML = `
    <footer class="bg-white border-t border-slate-200/80 py-10 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between gap-8">
        <div class="max-w-sm">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xl">🏠</span>
            <span class="text-base font-bold text-primary tracking-tight">GharBhada</span>
            <span class="text-[11px] text-slate-500 font-medium">घरभाडा नेपाल</span>
          </div>
          <p class="text-xs text-slate-500 leading-relaxed mb-3">
            Nepal's direct rental marketplace connecting tenants and verified property owners across Kathmandu Valley, Pokhara, Chitwan, and beyond with 100% Zero Broker Commission.
          </p>
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200/60">
            ${getIcon('check-circle', { class: 'w-3 h-3 text-emerald-600' })}
            <span>Zero Brokerage Guarantee</span>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5">Popular Locations</h4>
            <ul class="space-y-1.5 text-xs text-slate-500">
              <li><a href="#/?area=Baneshwor" class="hover:text-primary transition-colors">New Baneshwor</a></li>
              <li><a href="#/?area=Jhamsikhel" class="hover:text-primary transition-colors">Jhamsikhel / Sanepa</a></li>
              <li><a href="#/?area=Pulchowk" class="hover:text-primary transition-colors">Pulchowk, Lalitpur</a></li>
              <li><a href="#/?area=Lakeside" class="hover:text-primary transition-colors">Lakeside Pokhara</a></li>
              <li><a href="#/?area=Baluwatar" class="hover:text-primary transition-colors">Baluwatar / Maharajgunj</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5">Categories</h4>
            <ul class="space-y-1.5 text-xs text-slate-500">
              <li><a href="#/?cat=room" class="hover:text-primary transition-colors">Rooms (कोठा)</a></li>
              <li><a href="#/?cat=flat" class="hover:text-primary transition-colors">Flats & Apartments</a></li>
              <li><a href="#/?cat=commercial" class="hover:text-primary transition-colors">Shutters & Office</a></li>
              <li><a href="#/?cat=land" class="hover:text-primary transition-colors">Land / Plot (जग्गा)</a></li>
              <li><a href="#/?cat=vehicle" class="hover:text-primary transition-colors">Vehicle Rentals</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5">Direct Contact</h4>
            <ul class="space-y-1.5 text-xs text-slate-500">
              <li class="flex items-center gap-1.5">
                ${getIcon('headphones', { class: 'w-3.5 h-3.5 text-primary' })}
                <span>Support: namaste@gharbhada.np</span>
              </li>
              <li class="flex items-center gap-1.5">
                ${getIcon('message-circle', { class: 'w-3.5 h-3.5 text-[#25D366]' })}
                <span>WhatsApp Helpline</span>
              </li>
              <li class="flex items-center gap-1.5">
                ${getIcon('shield-check', { class: 'w-3.5 h-3.5 text-secondary' })}
                <span>Verified Landlords Only</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 mt-8 pt-5 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[11px] gap-3">
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
