import React, { useEffect } from 'react';

const GoogleTranslateCustom = () => {
  useEffect(() => {
    // Load Google Translate script
    const addScript = () => {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    };

    // Initialize only once
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,es,fr,de,it,pt,ru,zh-CN,ja,ko',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          'google_translate_element'
        );
      };
      addScript();
    }

    return () => {
      // Cleanup
      const iframes = document.querySelectorAll('.goog-te-banner-frame, .goog-te-menu-frame');
      iframes.forEach(iframe => iframe.remove());
    };
  }, []);

  return (
    // <div className="translate-container">
      <div id="google_translate_element" style={{
        width: 'auto',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '5px',
        position: 'fixed',
        zIndex: '9999',
      }}></div>
    // </div>
  );
};

export default GoogleTranslateCustom;