# GreenCity Database Setup

## 1. Create the project
Create a fresh GreenCity project in Supabase.

## 2. Create the database
Open SQL Editor and run `supabase-schema.sql` as one complete script.

The script creates:
- `bookings`
- `prices`
- `price_access_codes`
- secure RPC functions for price-code verification and appointment lookup
- the public booking INSERT policy

## 3. Connect the website
Open `config.js` and replace:

`PASTE_YOUR_SUPABASE_PROJECT_URL_HERE`

with your Supabase Project URL.

Replace:

`PASTE_YOUR_SUPABASE_ANON_KEY_HERE`

with the PUBLIC/ANON key.

Never use the service_role/secret key in the website.

## 4. Test
Open `booking.html`.
Complete a test booking.
The booking should be saved to `bookings` and WhatsApp should open.

Then test:
- `price.html` using the temporary code `GC2026`
- `appointment.html` using the appointment number from the booking

After testing, change the example price list and replace the temporary access code.
