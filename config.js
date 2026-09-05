/* =========================================================
   GREENCITY — SITE CONFIGURATION
   Single source of truth for business info and pricing.
   No backend, database, or Supabase required.
   ========================================================= */

window.GREENCITY_CONFIG = {

  businessName: "GreenCity",

  slogan: "Cleaner Spaces. Better Living.",

  currency: "R",

  /* WhatsApp number that receives bookings. Digits only,
     country code first, no + or spaces. */
  whatsappNumber: "27664926146",

  /* Private access code GreenCity gives to customers on
     WhatsApp so they can view prices on price.html.
     This is a simple visibility gate, not real server-side
     security — anyone with the code can see the prices below.
     Change it any time by editing this line. */
  priceAccessCode: "GC-PRICES-2026",

  // ==============================
  // GREENCITY PRIVATE PRICING
  // EDIT PRICES HERE
  // ==============================
  pricing: {

    carWash: {

      title: "Mobile Car Wash",

      vehicleTypes: {
        hatchback: "Hatchback",
        sedan: "Sedan",
        suv: "SUV / Crossover",
        bakkie: "Bakkie / Double Cab",
        sevenSeater: "7-Seater / Large SUV",
        minibus: "Minibus / Taxi"
      },

      services: {

        essential: {
          name: "Essential Wash",
          description: "Exterior wash and basic finishing.",
          includes: [
            "Exterior wash",
            "Wheels/rims cleaned",
            "Tyres cleaned",
            "Hand dry",
            "Windows/mirrors"
          ],
          prices: {
            hatchback: 150,
            sedan: 170,
            suv: 200,
            bakkie: 220,
            sevenSeater: 230,
            minibus: 280
          }
        },

        full: {
          name: "Full Inside & Outside",
          description: "Interior and exterior cleaning.",
          includes: [
            "Exterior wash",
            "Wheels",
            "Tyres",
            "Interior vacuum",
            "Dashboard/console cleaning",
            "Interior windows",
            "Mats",
            "Door panels",
            "Tyre dressing"
          ],
          prices: {
            hatchback: 250,
            sedan: 280,
            suv: 320,
            bakkie: 350,
            sevenSeater: 380,
            minibus: 450
          }
        },

        premium: {
          name: "Premium Detail",
          description: "More detailed interior and exterior treatment.",
          note: "Premium Detail prices are starting prices and may vary depending on vehicle condition.",
          includes: [
            "Everything in Full Wash",
            "Deeper interior cleaning",
            "Detailed interior surfaces",
            "Stain treatment where appropriate",
            "Enhanced exterior finish",
            "Final inspection"
          ],
          prices: {
            hatchback: 450,
            sedan: 500,
            suv: 550,
            bakkie: 600,
            sevenSeater: 650,
            minibus: 750
          }
        }

      }

    },

    binCleaning: {

      title: "Wheelie Bin Cleaning",

      note: "Commercial or unusually large-volume requirements may require a custom quotation.",

      bins: [
        { size: "80",   name: "80L / Small", single: 50,  monthly: 160 },
        { size: "120",  name: "120L",        single: 60,  monthly: 200 },
        { size: "240",  name: "240L",        single: 75,  monthly: 260 },
        { size: "360",  name: "360L",        single: 90,  monthly: 320 },
        { size: "660",  name: "660L",        single: 150, monthly: 550 },
        { size: "770",  name: "770L",        single: 180, monthly: 650 },
        { size: "1100", name: "1,100L",      single: 250, monthly: 900 }
      ]

    },

    travel: {

      title: "Travel / Call-Out",

      note: "Travel fees may apply depending on service location. Final travel cost will be confirmed before the appointment is confirmed.",

      fees: [
        { distance: "0–10 km",  price: 0,    label: "FREE" },
        { distance: "11–20 km", price: 50 },
        { distance: "21–30 km", price: 80 },
        { distance: "31–40 km", price: 120 },
        { distance: "41–50 km", price: 160 },
        { distance: "50 km+",   price: null, label: "QUOTE" }
      ]

    },

    addOns: {

      title: "Optional Add-Ons",

      note: "Add-on pricing marked \u201cFrom\u201d may vary depending on the condition and size of the vehicle.",

      items: [
        { name: "Heavy Dirt Surcharge",   price: 50,  priceType: "from" },
        { name: "Excessive Pet Hair",     price: 80,  priceType: "from" },
        { name: "Deep Stain Treatment",   price: 80,  priceType: "from" },
        { name: "Seat Deep-Cleaning",     price: 150, priceType: "from" },
        { name: "Boot Deep-Cleaning",     price: 80,  priceType: "from" },
        { name: "Engine-Bay Cleaning",    price: 120, priceType: "from" },
        { name: "Tyre / Rim Deep Clean",  price: 50,  priceType: "fixed" }
      ]

    },

    monthlyPlans: {

      title: "GreenCity Monthly Plans",

      note: "Monthly plans are subject to availability and service-area requirements. GreenCity will confirm plan eligibility before activation.",

      plans: [
        { name: "GreenCity Clean",   price: 499, description: "2 Essential washes per month." },
        { name: "GreenCity Plus",    price: 699, description: "2 Full Inside & Outside washes per month." },
        { name: "GreenCity Premium", price: 999, description: "2 Premium Detail washes per month." }
      ]

    }

  },

  // ==============================
  // BUSINESS INFO — EDIT HERE
  // Operating hours and service area, centrally controlled
  // so index.html always shows the current values.
  // ==============================
  businessInfo: {

    operatingHours: [
      { day: "Monday", hours: "9:30 AM – 5:00 PM" },
      { day: "Tuesday – Saturday", hours: "9:30 AM – 7:30 PM" },
      { day: "Sunday", hours: "9:30 AM – 6:00 PM" }
    ],

    serviceArea: {
      heading: "Which areas do you cover?",
      body: "We are mobile and drive out across our Mpumalanga and Limpopo service area — Graskop, Thulamahashe, Lydenburg, Nelspruit, Polokwane, Hoedspruit and surrounds. Pop your suburb in the quote form and we will confirm we cover you.",
      towns: [
        { name: "Graskop", note: "Core Mpumalanga service area" },
        { name: "Thulamahashe", note: "Core Mpumalanga service area" },
        { name: "Lydenburg", note: "Core Mpumalanga service area" },
        { name: "Nelspruit", note: "Core Mpumalanga service area" },
        { name: "Polokwane", note: "Core Limpopo service area" },
        { name: "Hoedspruit", note: "Core Limpopo service area" }
      ],
      note: "Core-area appointments are mainly handled Monday to Friday. Customers outside our main service area may be scheduled on Saturday or Sunday, depending on distance and availability."
    },

    /* Brands shown in the "Owners trust us with cars like these"
       trust section. Real logo image files are not used here —
       see ASSETS-README.txt for why — this list only controls
       which brand names/initials appear. */
    trustedBrands: [
      "BMW", "Mercedes-Benz", "Audi", "Toyota", "Volkswagen", "Nissan",
      "Land Rover", "Ford", "Hyundai", "Kia", "Isuzu", "Volvo"
    ]

  }

};
