(function () {
    "use strict";

    const config = window.GREENCITY_CONFIG || {};

    const WHATSAPP_NUMBER =
        String(config.WHATSAPP_NUMBER || "27664926146")
            .replace(/\D/g, "");

    const SUPABASE_URL =
        config.SUPABASE_URL || "";

    const SUPABASE_ANON_KEY =
        config.SUPABASE_ANON_KEY || "";

    const BOOKING_TABLE =
        config.BOOKING_TABLE || "bookings";


    function showMessage(message) {
        const box = document.getElementById("bookingMessage");

        if (box) {
            box.textContent = message;
            box.style.display = "block";
        }
    }


    function makeBookingNumber() {
        return "GC-" + Date.now();
    }


    function getValue(id) {
        const element = document.getElementById(id);
        return element ? element.value.trim() : "";
    }


    function getSelectedService() {
        const selected =
            document.querySelector(
                'input[name="service"]:checked'
            );

        return selected ? selected.value : "";
    }


    async function saveToSupabase(booking) {

        if (
            !SUPABASE_URL ||
            !SUPABASE_ANON_KEY ||
            typeof window.supabase === "undefined"
        ) {
            console.warn(
                "GreenCity: Supabase is not available."
            );

            return false;
        }

        try {

            const client =
                window.supabase.createClient(
                    SUPABASE_URL,
                    SUPABASE_ANON_KEY
                );

            const { error } =
                await client
                    .from(BOOKING_TABLE)
                    .insert([booking]);

            if (error) {
                console.error(
                    "GreenCity Supabase error:",
                    error
                );

                return false;
            }

            return true;

        } catch (error) {

            console.error(
                "GreenCity database error:",
                error
            );

            return false;
        }
    }


    function sendToWhatsApp(booking) {

        /*
         * The number is also kept as the configured
         * GreenCity number here so the booking cannot
         * fail simply because config.js was not loaded.
         */

        const number =
            WHATSAPP_NUMBER || "27664926146";

        const message =
`🌿 GREENCITY BOOKING REQUEST

Appointment: ${booking.appointment_number}

CUSTOMER
Name: ${booking.customer_name}
WhatsApp: ${booking.customer_phone}

SERVICE
${booking.service}

SERVICE DETAILS
${booking.item_details}

LOCATION
Area: ${booking.area}
Address: ${booking.address}

APPOINTMENT
Date: ${booking.date}
Time: ${booking.time}

NOTES
${booking.notes || "None"}

Status: Pending`;

        const whatsappURL =
            "https://wa.me/" +
            number +
            "?text=" +
            encodeURIComponent(message);

        window.location.href = whatsappURL;
    }


    async function handleBooking(event) {

        event.preventDefault();

        const form =
            document.getElementById("bookingForm");

        const button =
            document.getElementById("bookBtn");

        if (!form) {
            return;
        }


        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }


        if (button) {
            button.disabled = true;
            button.textContent = "Processing...";
        }


        const booking = {

            appointment_number:
                makeBookingNumber(),

            customer_name:
                getValue("customerName"),

            customer_phone:
                getValue("customerPhone"),

            service:
                getSelectedService(),

            item_details:
                getValue("itemDetails"),

            area:
                getValue("area"),

            address:
                getValue("address"),

            date:
                getValue("date"),

            time:
                getValue("time"),

            notes:
                getValue("notes"),

            status:
                "Pending",

            created_at:
                new Date().toISOString()
        };


        /*
         * Save booking to Supabase.
         * WhatsApp is still opened even if the database
         * temporarily fails, so the customer isn't trapped.
         */

        await saveToSupabase(booking);


        /*
         * Send booking to GreenCity WhatsApp.
         */

        sendToWhatsApp(booking);
    }


    function start() {

        const form =
            document.getElementById("bookingForm");

        if (!form) {
            return;
        }


        /*
         * Set minimum booking date to today.
         */

        const date =
            document.getElementById("date");

        if (date) {

            const today =
                new Date();

            const year =
                today.getFullYear();

            const month =
                String(
                    today.getMonth() + 1
                ).padStart(2, "0");

            const day =
                String(
                    today.getDate()
                ).padStart(2, "0");

            date.min =
                `${year}-${month}-${day}`;
        }


        form.addEventListener(
            "submit",
            handleBooking
        );
    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            start
        );

    } else {

        start();
    }

})();
