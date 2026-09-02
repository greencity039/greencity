/* =========================================================
   GREENCITY — SITE CONFIGURATION
   Edit the values below to update site-wide settings.
   No backend, database, or Supabase required.
   ========================================================= */

window.GREENCITY_CONFIG = {

  /* WhatsApp number that receives bookings. Digits only,
     country code first, no + or spaces. */
  WHATSAPP_NUMBER: "27664926146",

  /* Private access code GreenCity gives to customers on
     WhatsApp so they can view prices on price.html.
     This is a simple visibility gate, not real security —
     anyone with the code (or the page source) can see the
     prices below. Change it any time by editing this line. */
  PRICE_ACCESS_CODE: "GC-PRICES-2026",

  /* Private price list shown on price.html once the access
     code is entered. Add, remove or edit rows freely —
     this is the only place prices live on the whole site. */
  PRICES: [
    { item: "Small Vehicle Wash (Hatchback / Sedan)", price: 250 },
    { item: "SUV / Bakkie Wash", price: 320 },
    { item: "Large Vehicle / Van Wash", price: 380 },
    { item: "Wheelie Bin Cleaning — 120L", price: 150 },
    { item: "Wheelie Bin Cleaning — 240L", price: 180 },
    { item: "Wheelie Bin Cleaning — Business / Bulk Bin", price: 280 }
  ]

};
