/*
===========================================================
GREENCITY - MAIN SCRIPT
===========================================================
Handles:
- Supabase connection
- Booking database storage
- WhatsApp booking message
- Shared GreenCity configuration
===========================================================
*/

(function () {

    "use strict";

    /*
    =======================================================
    CONFIGURATION
    =======================================================
    */

    const config =
        window.GREENCITY_CONFIG || {};

    const SUPABASE_URL =
        config.SUPABASE_URL || "";

    const SUPABASE_ANON_KEY =
        config.SUPABASE_ANON_KEY || "";

    const WHATSAPP_NUMBER =
        config.WHATSAPP_NUMBER || "";

    const BOOKING_TABLE =
        config.BOOKING_TABLE || "bookings";


    /*
    =======================================================
    BASIC HELPERS
    =======================================================
    */

    function getElement(id) {
        return document.getElementById(id);
    }


    function cleanPhone(phone) {

        return String(phone || "")
            .trim()
            .replace(/[^\d+]/g, "");

    }


    function createAppointmentNumber() {

        return (
            "GC-" +
            Math.floor(
                100000 +
                Math.random() * 900000
            )
        );

    }


    function showMessage(message, type) {

        let box =
            getElement("greencityMessage");

        if (!box) {

            box =
                document.createElement("div");

            box.id =
                "greencityMessage";

            box.style.marginTop =
                "15px";

            box.style.padding =
                "14px";

            box.style.borderRadius =
                "10px";

            box.style.fontSize =
                "14px";

            const form =
                getElement("bookingForm");

            if (form) {
                form.appendChild(box);
            } else {
                document.body.appendChild(box);
            }

        }

        box.textContent =
            message;

        if (type === "error") {

            box.style.background =
                "#fbeaea";

            box.style.color =
                "#8a1f1f";

        } else {

            box.style.background =
                "#edf6ef";

            box.style.color =
                "#315f3e";

        }

    }


    /*
    =======================================================
    CHECK CONFIGURATION
    =======================================================
    */

    function configurationIsReady() {

        if (!SUPABASE_URL) {
            console.error(
                "GreenCity: SUPABASE_URL is missing."
            );
            return false;
        }

        if (!SUPABASE_ANON_KEY) {
            console.error(
                "GreenCity: SUPABASE_ANON_KEY is missing."
            );
            return false;
        }

        if (!WHATSAPP_NUMBER) {
            console.error(
                "GreenCity: WHATSAPP_NUMBER is missing."
            );
            return false;
        }

        return true;

    }


    /*
    =======================================================
    CREATE SUPABASE CLIENT
    =======================================================
    */

    let supabaseClient = null;

    function createSupabaseClient() {

        if (
            typeof window.supabase ===
            "undefined"
        ) {

            console.error(
                "GreenCity: Supabase library was not loaded."
            );

            return null;

        }

        if (
            !SUPABASE_URL ||
            !SUPABASE_ANON_KEY
        ) {

            return null;

        }

        try {

            return window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_ANON_KEY
            );

        } catch (error) {

            console.error(
                "GreenCity: Could not create Supabase client.",
                error
            );

            return null;

        }

    }


    /*
    =======================================================
    SAVE BOOKING TO SUPABASE
    =======================================================
    */

    async function saveBookingToSupabase(
        booking
    ) {

        if (!supabaseClient) {

            console.warn(
                "GreenCity: Supabase client unavailable."
            );

            return {
                success: false,
                error:
                    "Database connection is unavailable."
            };

        }

        try {

            const { data, error } =
                await supabaseClient
                    .from(BOOKING_TABLE)
                    .insert([
                        {
                            appointment_number:
                                booking.appointmentNumber,

                            customer_name:
                                booking.customerName,

                            customer_phone:
                                booking.customerPhone,

                            service_type:
                                booking.serviceType,

                            vehicle:
                                booking.vehicle,

                            area:
                                booking.area,

                            address:
                                booking.address,

                            date:
                                booking.date,

                            time:
                                booking.time,

                            notes:
                                booking.notes,

                            status:
                                booking.status,

                            service_price:
                                booking.servicePrice,

                            tip:
                                booking.tip,

                            total:
                                booking.total,

                            created_at:
                                booking.createdAt
                        }
                    ])
                    .select();


            if (error) {

                console.error(
                    "GreenCity Supabase booking error:",
                    error
                );

                return {
                    success: false,
                    error: error
                };

            }

            return {
                success: true,
                data: data
            };

        } catch (error) {

            console.error(
                "GreenCity database error:",
                error
            );

            return {
                success: false,
                error: error
            };

        }

    }


    /*
    =======================================================
    CREATE WHATSAPP MESSAGE
    =======================================================
    */

    function createWhatsAppMessage(
        booking
    ) {

        return (
`🌿 GREENCITY NEW BOOKING REQUEST

━━━━━━━━━━━━━━━━━━

APPOINTMENT
${booking.appointmentNumber}

CUSTOMER
Name: ${booking.customerName}
WhatsApp: ${booking.customerPhone}

SERVICE
${booking.serviceType}

VEHICLE / BIN
${booking.vehicle}

AREA
${booking.area}

ADDRESS
${booking.address}

PREFERRED DATE
${booking.date}

PREFERRED TIME
${booking.time}

ADDITIONAL NOTES
${booking.notes || "None"}

━━━━━━━━━━━━━━━━━━

STATUS
PENDING

Please review this booking and reply with the next instructions.`
        );

    }


    /*
    =======================================================
    OPEN WHATSAPP
    =======================================================
    */

    function openWhatsApp(
        message
    ) {

        const number =
            String(
                WHATSAPP_NUMBER
            )
                .replace(/\D/g, "");

        if (!number) {

            showMessage(
                "GreenCity WhatsApp number has not been configured yet.",
                "error"
            );

            return false;

        }

        const url =
            "https://wa.me/" +
            number +
            "?text=" +
            encodeURIComponent(
                message
            );

        window.location.href =
            url;

        return true;

    }


    /*
    =======================================================
    GET BOOKING FORM
    =======================================================
    */

    function setupBookingForm() {

        const form =
            getElement("bookingForm");

        if (!form) {

            return;

        }


        const serviceType =
            getElement("serviceType");

        const serviceInfo =
            getElement("serviceInfo");

        const dateInput =
            getElement("date");

        const bookingButton =
            getElement("bookingButton");


        /*
        ---------------------------------------------------
        DATE
        ---------------------------------------------------
        */

        if (dateInput) {

            const today =
                new Date();

            const localToday =
                new Date(
                    today.getTime() -
                    today.getTimezoneOffset() *
                    60000
                )
                    .toISOString()
                    .split("T")[0];

            dateInput.min =
                localToday;

        }


        /*
        ---------------------------------------------------
        SERVICE INFORMATION
        ---------------------------------------------------
        */

        if (
            serviceType &&
            serviceInfo
        ) {

            serviceType.addEventListener(
                "change",
                function () {

                    if (
                        serviceType.value ===
                        "Car Wash"
                    ) {

                        serviceInfo.style.display =
                            "block";

                        serviceInfo.innerHTML =
                            "<strong>Car Wash:</strong> " +
                            "Enter your vehicle make and model. " +
                            "GreenCity will confirm the exact service and price.";

                    }

                    else if (
                        serviceType.value ===
                        "Wheelie Bin Cleaning"
                    ) {

                        serviceInfo.style.display =
                            "block";

                        serviceInfo.innerHTML =
                            "<strong>Bin Cleaning:</strong> " +
                            "Enter your bin size, for example 120L, 240L or 360L.";

                    }

                    else {

                        serviceInfo.style.display =
                            "none";

                        serviceInfo.innerHTML =
                            "";

                    }

                }
            );

        }


        /*
        ---------------------------------------------------
        FORM SUBMISSION
        ---------------------------------------------------
        */

        form.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                /*
                VALIDATION
                */

                if (
                    !form.checkValidity()
                ) {

                    form.reportValidity();

                    return;

                }


                /*
                PREVENT DOUBLE SUBMISSION
                */

                if (
                    bookingButton
                ) {

                    bookingButton.disabled =
                        true;

                    bookingButton.textContent =
                        "Sending...";

                }


                /*
                GET FORM VALUES
                */

                const customerName =
                    (
                        getElement(
                            "customerName"
                        )?.value || ""
                    )
                        .trim();


                const customerPhone =
                    cleanPhone(
                        getElement(
                            "customerPhone"
                        )?.value || ""
                    );


                const service =
                    serviceType
                        ? serviceType.value
                        : "";


                const vehicle =
                    (
                        getElement(
                            "vehicle"
                        )?.value || ""
                    )
                        .trim();


                const area =
                    (
                        getElement(
                            "area"
                        )?.value || ""
                    )
                        .trim();


                const address =
                    (
                        getElement(
                            "address"
                        )?.value || ""
                    )
                        .trim();


                const date =
                    dateInput
                        ? dateInput.value
                        : "";


                const time =
                    (
                        getElement(
                            "time"
                        )?.value || ""
                    );


                const notes =
                    (
                        getElement(
                            "notes"
                        )?.value || ""
                    )
                        .trim();


                /*
                CREATE BOOKING
                */

                const booking = {

                    appointmentNumber:
                        createAppointmentNumber(),

                    customerName:
                        customerName,

                    customerPhone:
                        customerPhone,

                    serviceType:
                        service,

                    vehicle:
                        vehicle,

                    area:
                        area,

                    address:
                        address,

                    date:
                        date,

                    time:
                        time,

                    notes:
                        notes,

                    status:
                        "Pending",

                    servicePrice:
                        0,

                    tip:
                        0,

                    total:
                        0,

                    createdAt:
                        new Date()
                            .toISOString()

                };


                /*
                SAVE TO LOCAL STORAGE
                */

                try {

                    localStorage.setItem(
                        "greencityBooking",
                        JSON.stringify(
                            booking
                        )
                    );

                } catch (error) {

                    console.warn(
                        "GreenCity local storage error:",
                        error
                    );

                }


                /*
                SAVE TO SUPABASE
                */

                const databaseResult =
                    await saveBookingToSupabase(
                        booking
                    );


                /*
                CREATE WHATSAPP MESSAGE
                */

                const message =
                    createWhatsAppMessage(
                        booking
                    );


                /*
                DATABASE ERROR
                */

                if (
                    !databaseResult.success
                ) {

                    console.warn(
                        "GreenCity booking was not saved to Supabase.",
                        databaseResult.error
                    );

                }


                /*
                OPEN WHATSAPP
                */

                const opened =
                    openWhatsApp(
                        message
                    );


                if (!opened) {

                    if (
                        bookingButton
                    ) {

                        bookingButton.disabled =
                            false;

                        bookingButton.textContent =
                            "Book Now on WhatsApp";

                    }

                    return;

                }


                /*
                SUCCESS MESSAGE
                */

                const successMessage =
                    getElement(
                        "successMessage"
                    );

                if (
                    successMessage
                ) {

                    successMessage.style.display =
                        "block";

                }

            }
        );

    }


    /*
    =======================================================
    START GREENCITY
    =======================================================
    */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            configurationIsReady();

            supabaseClient =
                createSupabaseClient();

            setupBookingForm();

        }
    );


})();
