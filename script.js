/* =========================================================
   GREENCITY — SITE JAVASCRIPT
   Mobile menu, cookies, booking validation,
   Supabase booking storage and WhatsApp booking.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const cfg = window.GREENCITY_CONFIG || {};
  const db = window.greenCitySupabase || null;

  /* =========================
     MOBILE MENU
     ========================= */
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
      menuToggle.classList.toggle("active");
      menuToggle.setAttribute(
        "aria-expanded",
        mobileMenu.classList.contains("active") ? "true" : "false"
      );
    });
  }

  /* =========================
     FOOTER YEAR
     ========================= */
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  /* =========================
     COOKIE CONSENT
     ========================= */
  const cookieBanner = document.getElementById("cookieBanner");
  const savedConsent = localStorage.getItem("greencityCookieConsent");

  if (cookieBanner && !savedConsent) {
    cookieBanner.classList.add("show");
  }

  const acceptCookies = document.getElementById("acceptCookies");

  if (acceptCookies) {
    acceptCookies.addEventListener("click", () => {
      localStorage.setItem("greencityCookieConsent", "all");
      cookieBanner?.classList.remove("show");
    });
  }

  const necessaryCookies = document.getElementById("necessaryCookies");

  if (necessaryCookies) {
    necessaryCookies.addEventListener("click", () => {
      localStorage.setItem("greencityCookieConsent", "necessary");
      cookieBanner?.classList.remove("show");
    });
  }

  /* =========================
     DATE INPUT
     ========================= */
  document.querySelectorAll('input[type="date"]').forEach((input) => {
    const today = new Date();

    const localDate = new Date(
      today.getTime() - today.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 10);

    input.min = localDate;
  });

  /* =========================
     BOOKING FORM
     ========================= */
  const bookingForm = document.getElementById("bookingForm");

  if (!bookingForm) {
    return;
  }

  const serviceInputs = [
    ...bookingForm.querySelectorAll('input[name="service"]')
  ];

  const serviceType = document.getElementById("serviceType");
  const itemDetails = document.getElementById("itemDetails");

  function getValue(id) {
    const element = document.getElementById(id);

    if (!element) {
      return "";
    }

    return String(element.value || "").trim();
  }

  function getSelectedService() {
    const selectedRadio = bookingForm.querySelector(
      'input[name="service"]:checked'
    );

    if (selectedRadio?.value) {
      return selectedRadio.value;
    }

    return serviceType?.value || "";
  }

  function updateItemPlaceholder() {
    if (!itemDetails) {
      return;
    }

    if (getSelectedService() === "Wheelie Bin Cleaning") {
      itemDetails.placeholder = "e.g. 120L, 240L or 360L bin";
    } else {
      itemDetails.placeholder =
        "e.g. VW Polo, Toyota Corolla or Ford Ranger";
    }
  }

  serviceInputs.forEach((input) => {
    input.addEventListener("change", updateItemPlaceholder);
  });

  if (serviceType) {
    serviceType.addEventListener("change", updateItemPlaceholder);
  }

  updateItemPlaceholder();

  /* =========================
     BOOKING SUBMISSION
     ========================= */
  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const button = bookingForm.querySelector('button[type="submit"]');
    const message = document.getElementById("bookingMessage");

    const name = getValue("customerName");
    const phone = getValue("customerPhone");
    const service = getSelectedService();
    const item =
      getValue("itemDetails") ||
      getValue("vehicle") ||
      getValue("binDetails");

    const area = getValue("area");
    const address = getValue("address");
    const date = getValue("date");
    const time = getValue("time");
    const notes = getValue("notes");

    /* =========================
       VALIDATION
       ========================= */
    if (
      !name ||
      !phone ||
      !service ||
      !item ||
      !area ||
      !address ||
      !date ||
      !time
    ) {
      if (message) {
        message.textContent =
          "Please complete all required booking fields.";
        message.className = "notice error";
      }

      return;
    }

    if (button) {
      button.disabled = true;
      button.textContent = "Preparing booking…";
    }

    /* =========================
       APPOINTMENT NUMBER
       ========================= */
    let appointmentNumber =
      "GC-" + Math.floor(100000 + Math.random() * 900000);

    /* =========================
       SAVE TO SUPABASE
       ========================= */
    if (db) {
      try {
        const bookingData = {
          appointment_number: appointmentNumber,
          customer_name: name,
          customer_phone: phone,
          service_type: service,
          item_details: item,
          area: area,
          address: address,
          preferred_date: date,
          preferred_time: time,
          notes: notes || null,
          status: "pending"
        };

        const result = await db
          .from("bookings")
          .insert(bookingData)
          .select("appointment_number")
          .single();

        if (!result.error && result.data?.appointment_number) {
          appointmentNumber = result.data.appointment_number;
        }

        if (result.error) {
          console.warn(
            "GreenCity: Supabase booking could not be saved.",
            result.error
          );
        }
      } catch (error) {
        console.warn(
          "GreenCity: Supabase connection error.",
          error
        );
      }
    }

    /* =========================
       WHATSAPP MESSAGE
       ========================= */
    const whatsappMessage = [
      "🌿 GREENCITY BOOKING REQUEST",
      "",
      `Appointment: ${appointmentNumber}`,
      `Name: ${name}`,
      `WhatsApp: ${phone}`,
      `Service: ${service}`,
      `Car/Bin: ${item}`,
      `Area: ${area}`,
      `Address: ${address}`,
      `Date: ${date}`,
      `Time: ${time}`,
      `Notes: ${notes || "None"}`,
      "",
      "Status: PENDING",
      "",
      "Please confirm this appointment with GreenCity."
    ].join("\n");

    const whatsappNumber = String(
      cfg.WHATSAPP_NUMBER || ""
    ).replace(/[^\d]/g, "");

    if (!whatsappNumber) {
      if (message) {
        message.textContent =
          "GreenCity WhatsApp number has not been configured yet.";
        message.className = "notice error";
      }

      if (button) {
        button.disabled = false;
        button.textContent = "Book Now on WhatsApp";
      }

      return;
    }

    /* =========================
       SAVE APPOINTMENT LOCALLY
       ========================= */
    localStorage.setItem(
      "greencityLastAppointment",
      appointmentNumber
    );

    if (message) {
      message.textContent =
        "Booking prepared. Opening WhatsApp…";
      message.className = "notice success";
    }

    /* =========================
       OPEN WHATSAPP
       ========================= */
    const whatsappURL =
      "https://wa.me/" +
      whatsappNumber +
      "?text=" +
      encodeURIComponent(whatsappMessage);

    window.location.href = whatsappURL;
  });
});
