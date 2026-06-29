"use client"

import { useEffect } from "react";

const OMYBOTT_CONFIG = {
  "apiKey": "omy_live_7U3J7HGdVTrorSkn",
  "apiUrl": "http://localhost:8080",
  "botName": "Banana ai",
  "botDescription": "Here to answer you about springboot",
  "primaryColor": "#a7b8ec",
  "welcomeMessage": "Hi! How can I help you dear?"
};
const OMYBOTT_SCRIPT = "http://localhost:3000/omybott-widget.js";

export function OmybottChatWidget() {
  useEffect(() => {
    let widget;

    function initWidget() {
      if (window.OmybottWidget) {
        widget = window.OmybottWidget.init(OMYBOTT_CONFIG);
      }
    }

    if (window.OmybottWidget) {
      initWidget();
      return () => widget?.destroy();
    }

    const script = document.createElement("script");
    script.src = OMYBOTT_SCRIPT;
    script.async = true;
    script.onload = initWidget;
    document.body.appendChild(script);

    return () => {
      widget?.destroy();
      script.remove();
    };
  }, []);

  return null;
}