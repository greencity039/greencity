GREENCITY — FRESH WEBSITE SETUP

IMPORTANT:
This refresh keeps the GreenCity forest/cream visual direction, service pages,
WhatsApp booking flow, private price preview and appointment pages together.

FILES:
index.html
booking.html
price.html
appointment.html
admin.html
story.html
privacy.html
cookies.html
terms.html
returns.html
style.css
script.js
config.js
supabase-config.js
supabase-schema.sql
README_SETUP.txt
ASSETS-README.txt
GREENCITY-DATABASE-SETUP.md

GITHUB:
1. Create a NEW empty public repository in the GreenCity GitHub account.
2. Upload these files to the repository root.
3. Upload the existing images folder.
4. Upload the existing videos folder if you have the original bin-washing video.
5. Enable GitHub Pages from main / root.

SUPABASE:
1. Create the NEW GreenCity Supabase project.
2. Open SQL Editor.
3. Paste the COMPLETE supabase-schema.sql file.
4. Run it once.
5. Get Project URL and PUBLIC/ANON key.
6. Put them into config.js.
7. NEVER put a service_role/secret key into config.js.

BOOKING FLOW:
Customer -> booking.html -> fills details -> booking saved to Supabase (when configured)
-> WhatsApp opens with the booking message -> GreenCity confirms manually.

PRIVATE PRICE FLOW:
GreenCity sends the customer a secret code through WhatsApp.
Customer -> price.html -> code -> vehicle/bin search -> price appears.

APPOINTMENT:
Customer can use appointment.html with the appointment number.

IMPORTANT SECURITY:
admin.html is NOT a secure private admin login. Do not treat it as secure
customer management until Supabase Auth/RLS is added for the owner.
