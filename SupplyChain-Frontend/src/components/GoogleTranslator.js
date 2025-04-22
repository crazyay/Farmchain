import React, { useEffect } from "react";

const GoogleTranslator = () => {
  useEffect(() => {
    // Prevent multiple script injections
    if (document.getElementById("google-translate-script")) return;

    // Set up global init function only once
    window.googleTranslateElementInit = () => {
      if (!window.google || document.querySelector(".goog-te-combo")) return;

      new window.google.translate.TranslateElement(
        { pageLanguage: "en" },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Optional cleanup: remove script and translator instance if needed
    };
  }, []);

  return (
    <div className="w-28 h-2 overflow-hidden">
      <div
        id="google_translate_element"
        className="w-40 border-2 bg-black rounded-md border-black h-2 font-bold overflow-hidden relative z-50 top-2 sm:right-10"
      />
    </div>
  );
};

export default GoogleTranslator;
