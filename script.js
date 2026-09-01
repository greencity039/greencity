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


    function makeBookingNumber() {
        return "GC-" + Date.now();
    }


    async function saveBooking(booking) {

        if (
            !SUPABASE_URL ||
            !SUPABASE_ANON_KEY ||
            typeof window.supabase === "undefined"
        ) {
            console.warn(
                "GreenCity: Supabase connection is unavailable."
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
Date: ${booking.appointment_date}
Time: ${booking.appointment_time}

NOTES
${booking.notes || "None"}

STATUS
Pending`;

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

        const messageBox =
            document.getElementById("bookingMessage");


        if (!form) {
            return;
        }


        if (!form.checkValidity()) {

            form.reportValidity();

            return;
        }


        if (button) {

            button.disabled = true;

            button.textContent =
                "Processing...";

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

            appointment_date:
                getValue("date"),

            appointment_time:
                getValue("time"),

            notes:
                getValue("notes"),

            status:
                "Pending",

            created_at:
                new Date().toISOString()
        };


        /*
         * Save to Supabase first.
         */

        const saved =
            await saveBooking(booking);


        /*
         * Tell the user if the database
         * accepted the booking.
         */

        if (messageBox) {

            if (saved) {

                messageBox.textContent =
                    "Booking received. Opening WhatsApp...";

            } else {

                messageBox.textContent =
                    "Opening WhatsApp...";

            }
        }


        /*
         * Then open WhatsApp.
         */

        sendToWhatsApp(booking);

    }


    function start() {

        const form =
            document.getElementById("bookingForm");

        if (!form) {
            return;
        }


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


        const yearElements =
            document.querySelectorAll(
                "[data-year]"
            );

        yearElements.forEach(
            function (element) {

                element.textContent =
                    new Date().getFullYear();

            }
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
