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
       HOMEPAGE — DATA-DRIVEN SECTIONS
       Package teaser, service area and operating hours are all
       rendered from config.js so there is one source of truth.
       ========================================================= */
    function escapeHtml(value) {
        return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[ch];
        });
    }

    function renderPackageTeaser() {
        const grid = document.getElementById("packageGrid");
        const pricing = config.pricing;

        if (!grid || !pricing || !pricing.carWash) {
            return;
        }

        const currency = config.currency || "R";
        const services = pricing.carWash.services;

        grid.innerHTML = Object.keys(services).map(function (key) {
            const tier = services[key];
            const prices = Object.keys(tier.prices).map(function (k) { return tier.prices[k]; });
            const fromPrice = Math.min.apply(null, prices);

            return (
                '<div class="package-card">' +
                    '<h3>' + escapeHtml(tier.name) + '</h3>' +
                    '<p>' + escapeHtml(tier.description) + '</p>' +
                    '<div class="from-price">' + currency + fromPrice + ' <span>from</span></div>' +
                    '<a href="price.html" class="btn btn-secondary" style="border-color:var(--border);color:var(--forest)">View &amp; Book</a>' +
                '</div>'
            );
        }).join("");
    }

    function renderBrandGrid() {
        const grid = document.getElementById("brandGrid");
        if (!grid) {
            return;
        }

        const brands = (config.businessInfo && config.businessInfo.trustedBrands) || [];

        grid.innerHTML = brands.map(function (name) {
            const initials = name.split(/[\s-]/).map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase();
            return (
                '<div class="brand-tile">' +
                    '<div class="brand-badge" aria-hidden="true">' + escapeHtml(initials) + '</div>' +
                    '<span>' + escapeHtml(name) + '</span>' +
                '</div>'
            );
        }).join("");
    }

    function renderServiceArea() {
        const area = config.businessInfo && config.businessInfo.serviceArea;
        if (!area) {
            return;
        }

        const heading = document.getElementById("serviceAreaHeading");
        const body = document.getElementById("serviceAreaBody");
        const note = document.getElementById("serviceAreaNote");
        const grid = document.getElementById("areaGrid");

        if (heading) heading.textContent = area.heading;
        if (body) body.textContent = area.body;
        if (note) note.textContent = area.note;

        if (grid && area.towns) {
            grid.innerHTML = area.towns.map(function (town) {
                return '<div class="card"><strong>' + escapeHtml(town.name) + '</strong><span>' + escapeHtml(town.note) + '</span></div>';
            }).join("");
        }
    }

    function renderOperatingHours() {
        const list = document.getElementById("hoursList");
        const hours = config.businessInfo && config.businessInfo.operatingHours;

        if (!list || !hours) {
            return;
        }

        list.innerHTML = hours.map(function (row) {
            return '<div class="hours-row"><span>' + escapeHtml(row.day) + '</span><span>' + escapeHtml(row.hours) + '</span></div>';
        }).join("");
    }


    /* =========================================================
       IMAGE FALLBACK
       If a gallery/before-after image hasn't been uploaded yet,
       show a clean placeholder instead of a broken image icon.
       ========================================================= */
    function initImageFallback() {
        document.querySelectorAll(".carousel-slide img").forEach(function (img) {
            img.addEventListener("error", function () {
                img.hidden = true;
                const placeholder = img.nextElementSibling;
                if (placeholder && placeholder.classList.contains("slide-placeholder")) {
                    placeholder.hidden = false;
                }
            });
        });
    }


    /* =========================================================
       CAROUSEL — RECENT CARS
       ========================================================= */
    function initCarousel() {
        const track = document.getElementById("carouselTrack");
        const dotsBox = document.getElementById("carouselDots");
        const prevBtn = document.getElementById("carouselPrev");
        const nextBtn = document.getElementById("carouselNext");

        if (!track || !dotsBox) {
            return;
        }

        const slides = Array.from(track.children);
        let index = 0;

        dotsBox.innerHTML = slides.map(function (_, i) {
            return '<button aria-label="Go to slide ' + (i + 1) + '"></button>';
        }).join("");
        const dots = Array.from(dotsBox.children);

        function update() {
            track.style.transform = "translateX(-" + (index * 100) + "%)";
            dots.forEach(function (dot, i) {
                dot.classList.toggle("active", i === index);
            });
        }

        function goTo(i) {
            index = (i + slides.length) % slides.length;
            update();
        }

        if (prevBtn) prevBtn.addEventListener("click", function () { goTo(index - 1); });
        if (nextBtn) nextBtn.addEventListener("click", function () { goTo(index + 1); });
        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () { goTo(i); });
        });

        // Touch swipe
        let touchStartX = null;
        track.addEventListener("touchstart", function (e) {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        track.addEventListener("touchend", function (e) {
            if (touchStartX === null) return;
            const diff = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(diff) > 40) {
                goTo(diff < 0 ? index + 1 : index - 1);
            }
            touchStartX = null;
        });

        update();
    }


    /* =========================================================
       BEFORE / AFTER SLIDER
       ========================================================= */
    function initBeforeAfter() {
        const wrap = document.getElementById("baWrap");
        const beforeLayer = document.getElementById("baBeforeLayer");
        const handle = document.getElementById("baHandle");

        if (!wrap || !beforeLayer || !handle) {
            return;
        }

        function setPosition(percent) {
            const clamped = Math.max(0, Math.min(100, percent));
            beforeLayer.style.width = clamped + "%";
            handle.style.left = clamped + "%";
        }

        function positionFromEvent(clientX) {
            const rect = wrap.getBoundingClientRect();
            const percent = ((clientX - rect.left) / rect.width) * 100;
            setPosition(percent);
        }

        let dragging = false;

        function onDown(clientX) {
            dragging = true;
            positionFromEvent(clientX);
        }
        function onMove(clientX) {
            if (!dragging) return;
            positionFromEvent(clientX);
        }
        function onUp() {
            dragging = false;
        }

        handle.addEventListener("mousedown", function (e) { onDown(e.clientX); });
        window.addEventListener("mousemove", function (e) { onMove(e.clientX); });
        window.addEventListener("mouseup", onUp);

        handle.addEventListener("touchstart", function (e) { onDown(e.touches[0].clientX); }, { passive: true });
        wrap.addEventListener("touchmove", function (e) { onMove(e.touches[0].clientX); }, { passive: true });
        window.addEventListener("touchend", onUp);

        wrap.addEventListener("click", function (e) {
            if (e.target === handle || handle.contains(e.target)) return;
            positionFromEvent(e.clientX);
        });

        setPosition(50);
    }


    /* =========================================================
       FAQ ACCORDION
       ========================================================= */
    function initFAQ() {
        const items = document.querySelectorAll(".faq-item");

        items.forEach(function (item) {
            const question = item.querySelector(".faq-question");
            const answer = item.querySelector(".faq-answer");

            if (!question || !answer) return;

            question.addEventListener("click", function () {
                const isOpen = item.classList.contains("open");

                items.forEach(function (other) {
                    other.classList.remove("open");
                    const otherAnswer = other.querySelector(".faq-answer");
                    if (otherAnswer) otherAnswer.style.maxHeight = null;
                });

                if (!isOpen) {
                    item.classList.add("open");
                    answer.style.maxHeight = answer.scrollHeight + "px";
                }
            });
        });
    }


    /* =========================================================
       START
       ========================================================= */
    function start() {
        fillYear();
        initMobileMenu();
        initCookieConsent();
        initBookingForm();

        renderPackageTeaser();
        renderBrandGrid();
        renderServiceArea();
        renderOperatingHours();

        initImageFallback();
        initCarousel();
        initBeforeAfter();
        initFAQ();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }

})();
