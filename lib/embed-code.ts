export type EmbedBotConfig = {
  apiKey: string
  apiBaseUrl: string
  widgetBaseUrl: string
  botName: string
  botDescription: string
  primaryColor: string
  welcomeMessage: string
}

export type EmbedFormat = "html" | "react" | "angular"

function buildWidgetConfig(config: EmbedBotConfig) {
  return {
    apiKey: config.apiKey,
    apiUrl: config.apiBaseUrl,
    botName: config.botName,
    botDescription: config.botDescription,
    primaryColor: config.primaryColor,
    welcomeMessage: config.welcomeMessage,
  }
}

function stringifyConfig(config: EmbedBotConfig) {
  return JSON.stringify(buildWidgetConfig(config), null, 2)
}

export function getWidgetScriptUrl(widgetBaseUrl: string) {
  return `${widgetBaseUrl.replace(/\/$/, "")}/omybott-widget.js`
}

export function buildHtmlEmbed(config: EmbedBotConfig): string {
  const scriptUrl = getWidgetScriptUrl(config.widgetBaseUrl)
  const initConfig = stringifyConfig(config)

  return `<!-- Omybott chat widget -->
<script id="omybott-widget-script" src="${scriptUrl}"></script>
<script>
  document.getElementById("omybott-widget-script").addEventListener("load", function () {
    OmybottWidget.init(${initConfig});
  });
</script>`
}

export function buildReactEmbed(config: EmbedBotConfig): string {
  const scriptUrl = getWidgetScriptUrl(config.widgetBaseUrl)
  const initConfig = stringifyConfig(config)

  return `import { useEffect } from "react";

const OMYBOTT_CONFIG = ${initConfig};
const OMYBOTT_SCRIPT = "${scriptUrl}";

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
}`
}

export function buildAngularEmbed(config: EmbedBotConfig): string {
  const scriptUrl = getWidgetScriptUrl(config.widgetBaseUrl)
  const initConfig = stringifyConfig(config)

  return `import { Component, OnDestroy, OnInit } from "@angular/core";

declare global {
  interface Window {
    OmybottWidget?: {
      init: (config: Record<string, string>) => { destroy: () => void };
    };
  }
}

const OMYBOTT_CONFIG = ${initConfig};
const OMYBOTT_SCRIPT = "${scriptUrl}";

@Component({
  selector: "app-omybott-chat",
  template: "",
})
export class OmybottChatComponent implements OnInit, OnDestroy {
  private widget?: { destroy: () => void };
  private script?: HTMLScriptElement;

  ngOnInit(): void {
    if (window.OmybottWidget) {
      this.widget = window.OmybottWidget.init(OMYBOTT_CONFIG);
      return;
    }

    this.script = document.createElement("script");
    this.script.src = OMYBOTT_SCRIPT;
    this.script.async = true;
    this.script.onload = () => {
      this.widget = window.OmybottWidget?.init(OMYBOTT_CONFIG);
    };
    document.body.appendChild(this.script);
  }

  ngOnDestroy(): void {
    this.widget?.destroy();
    this.script?.remove();
  }
}`
}

export function buildEmbedSnippet(
  format: EmbedFormat,
  config: EmbedBotConfig,
): string {
  switch (format) {
    case "react":
      return buildReactEmbed(config)
    case "angular":
      return buildAngularEmbed(config)
    default:
      return buildHtmlEmbed(config)
  }
}

export function getClientEmbedUrls() {
  const widgetBaseUrl =
    typeof window !== "undefined" ? window.location.origin : ""
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

  return { widgetBaseUrl, apiBaseUrl }
}
