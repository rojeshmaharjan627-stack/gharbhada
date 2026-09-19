// Reactive bilingual dictionary for English and Nepali (Devanagari)
const STORAGE_KEY = 'gharbhada_lang';

export const translations = {
  en: {
    // Brand & Header
    brandTitle: 'GharBhada',
    brandSubtitle: 'Nepal Direct Rental Marketplace',
    locationBadge: 'Nepal (All Cities)',
    browseRentals: 'Browse Rentals',
    myListings: 'My Listings',
    postRental: '+ Post a Rental',
    signIn: 'Sign In / Login',
    signOut: 'Sign Out',
    langToggle: 'नेपाली',

    // Hero & Trust
    heroTagline: '0% Broker Commission • Direct Owner Contact',
    heroTitlePrefix: 'Rent Direct from Owners in',
    heroTitleSuffix: 'Nepal',
    heroSubtitle: 'Find verified rooms, flats, houses, shutters, and land across Kathmandu Valley, Pokhara, and major cities with zero brokerage charges.',
    searchPlaceholder: 'Area or Landmark (e.g. Baneshwor, Jhamsikhel, Lakeside...)',
    categoryAll: 'All Categories',
    priceAny: 'Any Budget',
    priceUpTo15k: 'Up to Rs. 15,000',
    price15kTo30k: 'Rs. 15,000 – 30,000',
    price30kTo60k: 'Rs. 30,000 – 60,000',
    priceAbove60k: 'Rs. 60,000+',
    searchBtn: 'Search Rentals',
    hotAreasLabel: 'Popular Hubs:',

    // Category Tiles
    catRoom: 'Single Room',
    catRoomSub: '1 BHK / Rooms',
    catFlat: 'Full Flat',
    catFlatSub: '2–3 BHK Flats',
    catHouse: 'Full House',
    catHouseSub: 'Independent Bungalow',
    catCommercial: 'Shutter & Office',
    catCommercialSub: 'Commercial Space',
    catLand: 'Land / Plot',
    catLandSub: 'Open Plots for Lease',
    catVehicle: 'Vehicle Rental',
    catVehicleSub: 'Bike / Scooter / Car',

    // How It Works
    howTitle: 'Why GharBhada is 100% Free & Broker-Free',
    howStep1Title: '1. Browse Verified Listings',
    howStep1Desc: 'Every listing is reviewed with verified owner numbers and zero duplicate broker spam.',
    howStep2Title: '2. One-Tap Direct Contact',
    howStep2Desc: 'Connect straight with the property owner via WhatsApp, Viber, or Direct Phone Call.',
    howStep3Title: '3. Inspect & Move In',
    howStep3Desc: 'Meet in person, verify documents, agree on fair terms, and pay exactly Rs 0 in commission.',

    // Grid & Listings
    featuredHeading: 'Curated Rentals in Nepal',
    sortNewest: 'Newest First',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    filterBtn: 'Filters',
    clearFilters: 'Clear All',
    perMonth: '/ month',
    negotiable: 'Price Negotiable',
    fixedPrice: 'Fixed Price',
    verifiedLandlord: 'Verified Landlord',
    directOwner: 'Direct Owner',
    photosCount: 'Photos',
    callNow: 'Call',
    chatWhatsApp: 'WhatsApp',
    connectViber: 'Viber',
    viewDetails: 'View Details',
    noResultsTitle: 'No rentals match your search',
    noResultsDesc: 'Try widening your budget, selecting another category, or clearing the area search.',
    resetFiltersBtn: 'Reset All Filters',

    // Detail View
    propertyOverview: 'Property Overview',
    bedrooms: 'Bedrooms',
    bathrooms: 'Bathrooms',
    waterSupply: 'Water Facility',
    aboutSpace: 'About This Property',
    amenitiesTitle: 'Amenities & Highlights',
    neighborhoodTitle: 'Neighborhood & Location',
    openMaps: 'Open in Google Maps',
    rentAmount: 'Monthly Rent',
    immediatelyAvailable: 'Available Immediately',
    landlordVerified: 'ID & Phone Verified',
    renterSafetyTipTitle: 'Renter Safety Note:',
    renterSafetyTipBody: 'Never transfer advance money without meeting the landlord and viewing the property in person. GharBhada has 100% zero broker charges.',

    // Post Rental Steps
    postTitle: 'Post a Rental Property',
    postSubtitle: 'Connect directly with tens of thousands of verified tenants across Nepal without paying any broker fees.',
    step1: '1. Category & Type',
    step2: '2. Location & Rent',
    step3: '3. Specs & Photos',
    step4: '4. Contact & Submit',
    nextBtn: 'Next Step →',
    backBtn: '← Previous',
    publishBtn: 'Publish Listing Now 🚀',
    photoUploadNudge: 'Upload at least 1 clear photo. Listings with real photos get 5x more inquiries!',
    authorizedOwnerCheck: 'I confirm that I am the authorized owner or representative of this rental property.'
  },

  ne: {
    // Brand & Header
    brandTitle: 'घरभाडा',
    brandSubtitle: 'नेपालको प्रत्यक्ष भाडा बजार',
    locationBadge: 'नेपाल (सबै शहर)',
    browseRentals: 'घरभाडा खोज्नुहोस्',
    myListings: 'मेरो लिस्टिङ',
    postRental: '+ घरभाडा पोस्ट गर्नुहोस्',
    signIn: 'लगइन / नयाँ खाता',
    signOut: 'बाहिरिनुहोस्',
    langToggle: 'English',

    // Hero & Trust
    heroTagline: '०% ब्रोकर शुल्क • सिधै घरधनीसँग सम्पर्क',
    heroTitlePrefix: 'नेपालभर घरधनीसँग सिधै कोठा, फ्ल्याट र सटर भाडामा लिनुहोस्',
    heroTitleSuffix: '',
    heroSubtitle: 'काठमाडौँ उपत्यका, पोखरा, चितवन लगायतका प्रमुख शहरहरूमा दलाल बिना निःशुल्क घरभाडा पाउनुहोस्।',
    searchPlaceholder: 'टोल वा ठाउँ (जस्तै: बानेश्वर, झम्सीखेल, लेकसाइड...)',
    categoryAll: 'सबै वर्ग',
    priceAny: 'सबै बजेट',
    priceUpTo15k: 'रु १५,००० सम्म',
    price15kTo30k: 'रु १५,००० – ३०,०००',
    price30kTo60k: 'रु ३०,००० – ६०,०००',
    priceAbove60k: 'रु ६०,००० माथि',
    searchBtn: 'भाडा खोज्नुहोस्',
    hotAreasLabel: 'चर्चित स्थानहरू:',

    // Category Tiles
    catRoom: 'कोठा / रुम',
    catRoomSub: '१ BHK वा सिंगल कोठा',
    catFlat: 'फ्ल्याट / अपार्टमेन्ट',
    catFlatSub: '२–३ BHK फ्ल्याट',
    catHouse: 'पूरै घर',
    catHouseSub: 'स्वतन्त्र बङ्गला / घर',
    catCommercial: 'सटर तथा अफिस',
    catCommercialSub: 'व्यापारिक स्थल',
    catLand: 'जग्गा / प्लट',
    catLandSub: 'भाडामा खुला जग्गा',
    catVehicle: 'सवारी साधन',
    catVehicleSub: 'बाइक / स्कुटर / गाडी',

    // How It Works
    howTitle: 'घरभाडा किन १००% निःशुल्क र दलालीमुक्त छ?',
    howStep1Title: '१. प्रमाणित लिस्टिङ खोज्नुहोस्',
    howStep1Desc: 'घरधनीको प्रमाणित फोन नम्बर सहित वास्तविक तस्बिर र विवरण हेर्नुहोस्।',
    howStep2Title: '२. एक ट्यापमै सिधा सम्पर्क',
    howStep2Desc: 'WhatsApp, Viber वा फोन कल मार्फत बिचौलिया बिना सिधै घरधनीसँग कुरा गर्नुहोस्।',
    howStep3Title: '३. हेर्नुहोस् र सर्नुहोस्',
    howStep3Desc: 'घर हेरेर सर्त मिलाउनुहोस् र ० रुपैयाँ ब्रोकर शुल्क तिरेर निर्धक्क सर्नुहोस्।',

    // Grid & Listings
    featuredHeading: 'नेपालभरका सिफारिस गरिएका घरभाडाहरू',
    sortNewest: 'नयाँ लिस्टिङ पहिला',
    sortPriceAsc: 'भाडा: सस्तो देखि महँगो',
    sortPriceDesc: 'भाडा: महँगो देखि सस्तो',
    filterBtn: 'फिल्टरहरू',
    clearFilters: 'सबै हटाउनुहोस्',
    perMonth: '/ महिना',
    negotiable: 'छलफल गर्न सकिने',
    fixedPrice: 'निश्चित भाडा',
    verifiedLandlord: 'प्रमाणित घरधनी',
    directOwner: 'सिधा घरधनी',
    photosCount: 'फोटोहरू',
    callNow: 'फोन कल',
    chatWhatsApp: 'ह्वाट्सएप',
    connectViber: 'भाइबर',
    viewDetails: 'विस्तृत विवरण',
    noResultsTitle: 'कुनै पनि लिस्टिङ भेटिएन',
    noResultsDesc: 'कृपया बजेट वा वर्ग परिवर्तन गर्नुहोस्, अथवा अन्य टोलमा खोज्नुहोस्।',
    resetFiltersBtn: 'फिल्टर खाली गर्नुहोस्',

    // Detail View
    propertyOverview: 'सम्पत्तिको मुख्य विवरण',
    bedrooms: 'सुत्ने कोठा (Bedrooms)',
    bathrooms: 'शौचालय (Bathrooms)',
    waterSupply: 'खानेपानी सुविधा',
    aboutSpace: 'सम्पत्तिको विस्तृत विवरण',
    amenitiesTitle: 'सुविधा तथा विशेषताहरू',
    neighborhoodTitle: 'स्थान र टोलको विवरण',
    openMaps: 'गुगल म्यापमा हेर्नुहोस्',
    rentAmount: 'मासिक भाडा दर',
    immediatelyAvailable: 'तुरुन्त खाली छ',
    landlordVerified: 'नागरिकता र फोन प्रमाणित',
    renterSafetyTipTitle: 'भाडामा बस्नेका लागि सल्लाह:',
    renterSafetyTipBody: 'घरधनीलाई नभेटी र सम्पत्ति नहेरी कहिल्यै पनि अनलाइन बैंकिङबाट एड्भान्स नपठाउनुहोस्। घरभाडामा कुनै ब्रोकर कमिसन लाग्दैन।',

    // Post Rental Steps
    postTitle: 'सम्पत्ति भाडामा पोस्ट गर्नुहोस्',
    postSubtitle: 'नेपालभरका हजारौं खोजकर्ताहरूसँग ब्रोकर शुल्क बिना सिधै जोडिनुहोस्।',
    step1: '१. वर्ग र शीर्षक',
    step2: '२. ठेगाना र भाडा',
    step3: '३. विवरण र फोटो',
    step4: '४. सम्पर्क र पुष्टि',
    nextBtn: 'अर्को चरण →',
    backBtn: '← अघिल्लो',
    publishBtn: 'लिस्टिङ पोस्ट गर्नुहोस् 🚀',
    photoUploadNudge: 'कम्तीमा एउटा फोटो अनिवार्य अपलोड गर्नुहोस्। फोटो भएको लिस्टिङमा ५ गुणा बढी सम्पर्क आउँछ!',
    authorizedOwnerCheck: 'म यो सम्पत्तिको आधिकारिक धनी वा प्रतिनिधि भएको प्रमाणित गर्दछु।'
  }
};

export function getLanguage() {
  return localStorage.getItem(STORAGE_KEY) || 'en';
}

export function setLanguage(lang) {
  if (lang !== 'en' && lang !== 'ne') lang = 'en';
  localStorage.setItem(STORAGE_KEY, lang);
  window.dispatchEvent(new CustomEvent('gharbhada:languageChange', { detail: { lang } }));
}

export function toggleLanguage() {
  const current = getLanguage();
  const next = current === 'en' ? 'ne' : 'en';
  setLanguage(next);
  return next;
}

export function t(key) {
  const lang = getLanguage();
  return translations[lang]?.[key] || translations['en']?.[key] || key;
}

export function formatNPR(num, lang = getLanguage()) {
  const formatted = Number(num || 0).toLocaleString('en-IN');
  if (lang === 'ne') {
    const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    const nepaliFormatted = formatted.replace(/[0-9]/g, d => devanagariDigits[Number(d)]);
    return `रु ${nepaliFormatted}`;
  }
  return `Rs. ${formatted}`;
}

export function getRelativeTime(timestamp, lang = getLanguage()) {
  if (!timestamp) return lang === 'ne' ? 'भर्खरै' : 'Recently';
  const now = new Date();
  const posted = new Date(timestamp);
  const diffHours = Math.floor((now - posted) / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (lang === 'ne') {
    if (diffHours < 1) return 'भर्खरै';
    if (diffHours < 24) return `${diffHours} घण्टा अघि`;
    if (diffDays === 1) return 'हिजो';
    if (diffDays < 30) return `${diffDays} दिन अघि`;
    return '१ महिना अघि';
  } else {
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    return '1mo ago';
  }
}
