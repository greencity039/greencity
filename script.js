(function () {
    "use strict";

    const config = window.GREENCITY_CONFIG || {};

    const WHATSAPP_NUMBER =
        String(config.whatsappNumber || "27664926146")
            .replace(/\D/g, "");


    /* =========================================================
       FOOTER YEAR
       Fills every [data-year] element with the current year.
       ========================================================= */
    function fillYear() {
        const yearElements = document.querySelectorAll("[data-year]");
        yearElements.forEach(function (element) {
            element.textContent = new Date().getFullYear();
        });
    }


    /* =========================================================
       MOBILE NAVIGATION
       Toggles the header nav on small screens.
       ========================================================= */
    function initMobileMenu() {
        const toggle = document.querySelector("[data-menu-toggle]");
        const menu = document.querySelector("[data-mobile-menu]");

        if (!toggle || !menu) {
            return;
        }

        toggle.addEventListener("click", function () {
            const isOpen = menu.classList.toggle("active");
            toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });

        menu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                menu.classList.remove("active");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    }


    /* =========================================================
       COOKIE CONSENT
       Remembers the customer's choice in localStorage so the
       banner only needs to be answered once per browser.
       ========================================================= */
    function initCookieConsent() {
        const banner = document.getElementById("cookieBanner");

        if (!banner) {
            return;
        }

        const STORAGE_KEY = "greencity_cookie_consent";
        const acceptBtn = document.getElementById("acceptCookies");
        const necessaryBtn = document.getElementById("necessaryCookies");

        function hideBanner() {
            banner.classList.remove("show");
        }

        function setConsent(value) {
            try {
                localStorage.setItem(STORAGE_KEY, value);
            } catch (error) {
                console.warn("GreenCity: could not save cookie preference.", error);
            }
            hideBanner();
        }

        let existingConsent = null;
        try {
            existingConsent = localStorage.getItem(STORAGE_KEY);
        } catch (error) {
            existingConsent = null;
        }

        if (!existingConsent) {
            banner.classList.add("show");
        }

        if (acceptBtn) {
            acceptBtn.addEventListener("click", function () {
                setConsent("all");
            });
        }

        if (necessaryBtn) {
            necessaryBtn.addEventListener("click", function () {
                setConsent("necessary");
            });
        }
    }


    /* =========================================================
       BOOKING FORM -> WHATSAPP
       ========================================================= */
    function getValue(id) {
        const element = document.getElementById(id);
        return element ? element.value.trim() : "";
    }

    function getSelectedService() {
        const selected = document.querySelector('input[name="service"]:checked');
        return selected ? selected.value : "";
    }

    function makeBookingNumber() {
        // Short, human-friendly reference e.g. GC-482731
        const random = Math.floor(100000 + Math.random() * 900000);
        return "GC-" + random;
    }

    function sendToWhatsApp(booking) {
        const number = WHATSAPP_NUMBER || "27664926146";

        const message =
`🌿 GREENCITY BOOKING REQUEST

Appointment: ${booking.appointment_number}

CUSTOMER
Name: ${booking.customer_name}
WhatsApp: ${booking.customer_phone}

SERVICE
${booking.service}

VEHICLE / BIN DETAILS
${booking.item_details}

LOCATION
Area: ${booking.area}
Service Address: ${booking.address}

APPOINTMENT
Preferred Date: ${booking.appointment_date}
Preferred Time: ${booking.appointment_time}

ADDITIONAL NOTES
${booking.notes || "None"}

STATUS
PENDING CONFIRMATION`;

        const whatsappURL =
            "https://wa.me/" + number + "?text=" + encodeURIComponent(message);

        window.location.href = whatsappURL;
    }

    function handleBooking(event) {
        event.preventDefault();

        const form = document.getElementById("bookingForm");
        const button = document.getElementById("bookBtn");
        const messageBox = document.getElementById("bookingMessage");

        if (!form) {
            return;
        }

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const booking = {
            appointment_number: makeBookingNumber(),
            customer_name: getValue("customerName"),
            customer_phone: getValue("customerPhone"),
            service: getSelectedService(),
            item_details: getValue("itemDetails"),
            area: getValue("area"),
            address: getValue("address"),
            appointment_date: getValue("date"),
            appointment_time: getValue("time"),
            notes: getValue("notes")
        };

        if (button) {
            button.disabled = true;
            button.textContent = "Opening WhatsApp…";
        }

        if (messageBox) {
            messageBox.hidden = false;
            messageBox.textContent =
                "Your reference is " + booking.appointment_number +
                ". Opening WhatsApp so you can send your request to GreenCity…";
        }

        // Give the user a moment to see the message, then hand off to WhatsApp.
        window.setTimeout(function () {
            sendToWhatsApp(booking);

            // Re-enable the button in case WhatsApp does not open
            // (e.g. no WhatsApp installed), so the customer isn't stuck.
            window.setTimeout(function () {
                if (button) {
                    button.disabled = false;
                    button.textContent = "Book Now on WhatsApp";
                }
            }, 4000);
        }, 400);
    }

    function initBookingForm() {
        const form = document.getElementById("bookingForm");

        if (!form) {
            return;
        }

        const date = document.getElementById("date");

        if (date) {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const day = String(today.getDate()).padStart(2, "0");
            date.min = `${year}-${month}-${day}`;
        }

        form.addEventListener("submit", handleBooking);
    }


    /* =========================================================
       START
       ========================================================= */
    function start() {
        fillYear();
        initMobileMenu();
        initCookieConsent();
        initBookingForm();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }

})();
