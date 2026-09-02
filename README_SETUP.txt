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
- WHATSAPP_NUMBER: the number that receives bookings.
- PRICE_ACCESS_CODE: the code you give customers on WhatsApp
  so they can view prices on price.html.
- PRICES: the list shown once the code is entered. This is
  the only place prices live — edit this array to update
  pricing anywhere on the site.

BOOKING FLOW:
Customer -> booking.html -> fills details -> WhatsApp opens
with a formatted booking request -> GreenCity confirms
manually on WhatsApp.

PRIVATE PRICE FLOW:
GreenCity sends the customer the access code on WhatsApp.
Customer -> price.html -> enters the code -> prices appear.
This is a simple visibility gate, not real security — anyone
who has the code, or who reads the page source, can see the
prices. It only keeps prices off the public-facing pages.

CONFIRMATION / RECEIPT FLOW:
After GreenCity confirms a booking on WhatsApp, open
admin.html, fill in the confirmed details, click "Generate
Confirmation", then "Print / Save as PDF" and send the file
to the customer through WhatsApp. This page is for GreenCity's
own use — it is not linked from the public site and does not
store anything.
