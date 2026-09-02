GREENCITY — WEBSITE SETUP

This is a simple static website. No backend, database, or
Supabase is required — everything runs in the browser.

FILES:
index.html        Homepage
booking.html       Booking form -> WhatsApp
price.html         Private price list (access-code gated)
admin.html          Internal booking confirmation / PDF tool (not linked
                    publicly — bookmark it yourself, keep the link private)
story.html          About / our story
privacy.html        Privacy Policy
cookies.html        Cookie Policy
terms.html          Terms & Conditions
returns.html        Returns & Refunds Policy
style.css           All site styling
script.js           All site behaviour (menu, cookies, booking form)
config.js           Business settings — WhatsApp number, price access
                    code, and the price list
README_SETUP.txt    This file
ASSETS-README.txt   Notes on the images/videos folders

GITHUB PAGES:
1. Create a repository in the GreenCity GitHub account.
2. Upload these files to the repository root, plus your
   images/ and videos/ folders (see ASSETS-README.txt).
3. Enable GitHub Pages from main / root.

CONFIGURATION (config.js):
- whatsappNumber: the number that receives bookings.
- priceAccessCode: the code you give customers on WhatsApp so
  they can view prices on price.html.
- pricing: the full private price catalogue — car wash tiers
  (Essential / Full / Premium) per vehicle type, wheelie bin
  sizes (single + monthly), travel/call-out fees, optional
  add-ons, and monthly plans. This is the ONLY place prices
  live — price.html renders everything from this object
  automatically, so changing a number here updates the whole
  site with no other file to touch.

BOOKING FLOW:
Customer -> booking.html -> fills details -> WhatsApp opens
with a formatted booking request -> GreenCity confirms
manually on WhatsApp.

PRIVATE PRICE FLOW:
GreenCity sends the customer the access code on WhatsApp.
Customer -> price.html -> enters the code -> the full pricing
catalogue appears (car wash tiers, bin cleaning, travel fees,
add-ons, monthly plans), all generated from config.js. The
unlock is remembered for that browser tab's session, so the
customer isn't asked for the code again on that visit. This is
a simple visibility gate, not real security — anyone who has
the code, or who reads the page source, can see the prices. It
only keeps prices off the public-facing pages.

CONFIRMATION / RECEIPT FLOW:
After GreenCity confirms a booking on WhatsApp, open
admin.html, fill in the confirmed details, click "Generate
Confirmation", then "Print / Save as PDF" and send the file
to the customer through WhatsApp. This page is for GreenCity's
own use — it is not linked from the public site and does not
store anything.
