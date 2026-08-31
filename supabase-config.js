/*
=========================================================
GREENCITY SUPABASE CONNECTION
=========================================================

This file connects the GreenCity website to Supabase.

config.js MUST load before this file.

The Supabase JavaScript library must also be loaded
before this file.
=========================================================
*/

(function () {

  const config = window.GREENCITY_CONFIG || {};

  /*
  Check that Supabase JavaScript library exists.
  */
  if (!window.supabase) {

    console.error(
      "GreenCity: Supabase JavaScript library was not loaded."
    );

    window.greenCitySupabase = null;

    return;
  }

  /*
  Check that the Supabase URL exists.
  */
  if (
    !config.SUPABASE_URL ||
    config.SUPABASE_URL.includes("PASTE_")
  ) {

    console.warn(
      "GreenCity: Supabase project URL has not been configured."
    );

    window.greenCitySupabase = null;

    return;
  }

  /*
  Check that the public Supabase key exists.
  */
  if (
    !config.SUPABASE_ANON_KEY ||
    config.SUPABASE_ANON_KEY.includes("PASTE_")
  ) {

    console.warn(
      "GreenCity: Supabase public anon/publishable key has not been configured."
    );

    window.greenCitySupabase = null;

    return;
  }

  /*
  Create the Supabase client.
  */
  try {

    window.greenCitySupabase =
      window.supabase.createClient(
        config.SUPABASE_URL,
        config.SUPABASE_ANON_KEY
      );

    console.log(
      "GreenCity: Supabase connected successfully."
    );

  } catch (error) {

    console.error(
      "GreenCity: Failed to create Supabase client.",
      error
    );

    window.greenCitySupabase = null;
  }

})();
