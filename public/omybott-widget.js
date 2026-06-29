;(function () {
  "use strict"

  var STYLES =
    "*{box-sizing:border-box;margin:0;padding:0}" +
    ":host{all:initial;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;font-size:12px;line-height:1.625;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}" +
    ".omybott-launcher{position:fixed;bottom:24px;right:24px;z-index:2147483646;width:52px;height:52px;border:none;border-radius:9999px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.06),0 4px 16px rgba(0,0,0,.14);transition:transform .2s ease,box-shadow .2s ease}" +
    ".omybott-launcher:hover{transform:translateY(-1px);box-shadow:0 0 0 1px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.18)}" +
    ".omybott-launcher:active{transform:translateY(0)}" +
    ".omybott-launcher svg{width:22px;height:22px}" +
    ".omybott-panel{position:fixed;bottom:88px;right:24px;z-index:2147483645;width:min(380px,calc(100vw - 32px));height:min(540px,calc(100vh - 112px));display:flex;flex-direction:column;overflow:hidden;background:#fff;color:#0a0a0a;border-radius:10px;box-shadow:0 0 0 1px rgba(0,0,0,.08),0 16px 48px rgba(0,0,0,.12);opacity:0;transform:translateY(10px) scale(.98);pointer-events:none;transition:opacity .22s ease,transform .22s ease}" +
    ".omybott-panel.open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}" +
    ".omybott-header{display:grid;grid-template-columns:1fr auto;grid-template-rows:auto auto;align-items:start;gap:2px 8px;padding:16px 16px 14px;border-bottom:1px solid rgba(0,0,0,.08)}" +
    ".omybott-header h2{grid-column:1;grid-row:1;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;font-size:14px;font-weight:700;line-height:1.4;color:#0a0a0a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-.01em}" +
    ".omybott-header p{grid-column:1;grid-row:2;font-size:12px;line-height:1.625;color:#737373;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    ".omybott-reset{grid-column:2;grid-row:1 / span 2;align-self:center;width:32px;height:32px;border:1px solid rgba(0,0,0,.1);border-radius:8px;background:#fff;color:#404040;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s ease,color .15s ease}" +
    ".omybott-reset:hover{background:#f5f5f5;color:#0a0a0a}" +
    ".omybott-reset:disabled{opacity:.4;cursor:not-allowed}" +
    ".omybott-reset svg{width:15px;height:15px}" +
    ".omybott-body{flex:1;min-height:0;display:flex;flex-direction:column}" +
    ".omybott-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}" +
    ".omybott-messages::-webkit-scrollbar{width:5px}" +
    ".omybott-messages::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:9999px}" +
    ".omybott-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 24px;text-align:center}" +
    ".omybott-empty-icon{width:40px;height:40px;border-radius:10px;background:#f5f5f5;color:#737373;display:flex;align-items:center;justify-content:center}" +
    ".omybott-empty-icon svg{width:20px;height:20px}" +
    ".omybott-empty h3{margin-top:14px;font-size:14px;font-weight:700;line-height:1.4;color:#0a0a0a}" +
    ".omybott-empty p{margin-top:6px;font-size:12px;line-height:1.625;color:#737373;max-width:240px}" +
    ".omybott-msg{display:flex;width:100%;min-width:0;gap:6px;align-items:flex-end}" +
    ".omybott-msg.user{flex-direction:row-reverse}" +
    ".omybott-avatar{width:28px;height:28px;min-width:28px;border-radius:9999px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;line-height:1;color:#fff;overflow:hidden}" +
    ".omybott-bubble-wrap{display:flex;flex-direction:column;min-width:0;max-width:80%}" +
    ".omybott-msg.user .omybott-bubble-wrap{align-items:flex-end}" +
    ".omybott-bubble{display:inline-block;max-width:100%;padding:6px 10px;border-radius:8px;font-size:12px;line-height:1.625;word-break:break-word;white-space:pre-wrap}" +
    ".omybott-bubble.assistant{background:#f5f5f5;color:#0a0a0a;border:1px solid transparent}" +
    ".omybott-bubble.user{color:#fff;border:1px solid transparent}" +
    ".omybott-bubble.loading{display:inline-flex;align-items:center;gap:8px;color:#737373}" +
    ".omybott-spinner{width:14px;height:14px;border:2px solid #e5e5e5;border-top-color:#737373;border-radius:9999px;animation:omybott-spin .65s linear infinite;flex-shrink:0}" +
    "@keyframes omybott-spin{to{transform:rotate(360deg)}}" +
    ".omybott-footer{padding:0 16px 16px}" +
    ".omybott-input-group{position:relative;display:flex;flex-direction:column;border:1px solid rgba(0,0,0,.12);border-radius:8px;background:rgba(0,0,0,.02);transition:border-color .15s ease,box-shadow .15s ease}" +
    ".omybott-input-group:focus-within{border-color:rgba(0,0,0,.2);box-shadow:0 0 0 2px rgba(0,0,0,.06)}" +
    ".omybott-input{width:100%;border:none;outline:none;resize:none;font:inherit;font-size:12px;line-height:1.625;min-height:56px;max-height:120px;padding:12px 12px 4px;color:#0a0a0a;background:transparent}" +
    ".omybott-input::placeholder{color:#a3a3a3}" +
    ".omybott-input:disabled{opacity:.6;cursor:not-allowed}" +
    ".omybott-input-actions{display:flex;justify-content:flex-end;padding:4px 8px 8px}" +
    ".omybott-send{width:28px;height:28px;border:none;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;transition:opacity .15s ease,transform .1s ease}" +
    ".omybott-send:not(:disabled):hover{opacity:.9}" +
    ".omybott-send:not(:disabled):active{transform:scale(.96)}" +
    ".omybott-send:disabled{opacity:.4;cursor:not-allowed}" +
    ".omybott-send svg{width:15px;height:15px}" +
    ".omybott-error{margin-top:8px;font-size:12px;line-height:1.5;color:#dc2626}" +
    "@media(max-width:480px){.omybott-panel{right:12px;bottom:80px;width:calc(100vw - 24px);height:min(520px,calc(100vh - 96px))}.omybott-launcher{right:16px;bottom:16px}}"

  var MESSAGE_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
  var CLOSE_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
  var RESET_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>'
  var SEND_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>'
  var EMPTY_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>'

  function getInitial(name) {
    var trimmed = (name || "").trim()
    return trimmed ? trimmed.charAt(0).toUpperCase() : "B"
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
  }

  function createWidget(config) {
    if (!config.apiKey) throw new Error("Omybott: apiKey is required")
    if (!config.apiUrl) throw new Error("Omybott: apiUrl is required")

    var botName = config.botName || "Chat"
    var botDescription = config.botDescription || "How can I help you today?"
    var primaryColor = config.primaryColor || "#2563eb"
    var welcomeMessage = (config.welcomeMessage || "").trim()
    var apiUrl = config.apiUrl.replace(/\/$/, "")

    var isOpen = false
    var isSending = false
    var conversationId = null
    var messages = []

    var host = document.createElement("div")
    host.id = "omybott-widget-host"
    document.body.appendChild(host)

    var shadow = host.attachShadow({ mode: "open" })
    var style = document.createElement("style")
    style.textContent = STYLES
    shadow.appendChild(style)

    var launcher = document.createElement("button")
    launcher.className = "omybott-launcher"
    launcher.type = "button"
    launcher.setAttribute("aria-label", "Open chat")
    launcher.style.backgroundColor = primaryColor
    launcher.innerHTML = MESSAGE_ICON

    var panel = document.createElement("div")
    panel.className = "omybott-panel"
    panel.setAttribute("role", "dialog")
    panel.setAttribute("aria-label", botName + " chat")

    panel.innerHTML =
      '<header class="omybott-header">' +
      "<h2>" +
      escapeHtml(botName) +
      "</h2>" +
      "<p>" +
      escapeHtml(botDescription) +
      "</p>" +
      '<button type="button" class="omybott-reset" aria-label="Reset conversation">' +
      RESET_ICON +
      "</button>" +
      "</header>" +
      '<div class="omybott-body">' +
      '<div class="omybott-messages"></div>' +
      "</div>" +
      '<footer class="omybott-footer">' +
      '<form class="omybott-form">' +
      '<div class="omybott-input-group">' +
      '<textarea class="omybott-input" rows="2" placeholder="Ask your bot anything..."></textarea>' +
      '<div class="omybott-input-actions">' +
      '<button type="submit" class="omybott-send" aria-label="Send message">' +
      SEND_ICON +
      "</button>" +
      "</div>" +
      "</div>" +
      '<p class="omybott-error" hidden></p>' +
      "</form>" +
      "</footer>"

    shadow.appendChild(panel)
    shadow.appendChild(launcher)

    var messagesEl = panel.querySelector(".omybott-messages")
    var resetBtn = panel.querySelector(".omybott-reset")
    var form = panel.querySelector(".omybott-form")
    var input = panel.querySelector(".omybott-input")
    var sendBtn = panel.querySelector(".omybott-send")
    var errorEl = panel.querySelector(".omybott-error")

    sendBtn.style.backgroundColor = primaryColor

    function setOpen(open) {
      isOpen = open
      panel.classList.toggle("open", open)
      launcher.innerHTML = open ? CLOSE_ICON : MESSAGE_ICON
      launcher.setAttribute("aria-label", open ? "Close chat" : "Open chat")
      if (open) {
        window.setTimeout(function () {
          input.focus()
        }, 80)
      }
    }

    function setError(message) {
      if (message) {
        errorEl.textContent = message
        errorEl.hidden = false
      } else {
        errorEl.textContent = ""
        errorEl.hidden = true
      }
    }

    function scrollToBottom() {
      messagesEl.scrollTop = messagesEl.scrollHeight
    }

    function renderMessages() {
      var hasContent = messages.length > 0 || isSending

      if (!hasContent) {
        var emptyText = welcomeMessage
          ? welcomeMessage
          : "Send a message to start chatting with your bot."
        messagesEl.innerHTML =
          '<div class="omybott-empty">' +
          '<div class="omybott-empty-icon">' +
          EMPTY_ICON +
          "</div>" +
          "<h3>" +
          escapeHtml(botName) +
          "</h3>" +
          "<p>" +
          escapeHtml(emptyText) +
          "</p>" +
          "</div>"
        resetBtn.disabled = true
        return
      }

      resetBtn.disabled = false
      var html = ""

      for (var i = 0; i < messages.length; i++) {
        html += renderMessage(messages[i])
      }

      if (isSending) {
        html +=
          '<div class="omybott-msg">' +
          '<div class="omybott-avatar" style="background-color:' +
          escapeHtml(primaryColor) +
          '">' +
          escapeHtml(getInitial(botName)) +
          "</div>" +
          '<div class="omybott-bubble-wrap">' +
          '<div class="omybott-bubble assistant loading">' +
          '<span class="omybott-spinner"></span>Thinking...' +
          "</div>" +
          "</div>" +
          "</div>"
      }

      messagesEl.innerHTML = html
      scrollToBottom()
    }

    function renderMessage(message) {
      if (message.role === "user") {
        return (
          '<div class="omybott-msg user">' +
          '<div class="omybott-bubble-wrap">' +
          '<div class="omybott-bubble user" style="background-color:' +
          escapeHtml(primaryColor) +
          '">' +
          escapeHtml(message.content) +
          "</div>" +
          "</div>" +
          "</div>"
        )
      }

      return (
        '<div class="omybott-msg">' +
        '<div class="omybott-avatar" style="background-color:' +
        escapeHtml(primaryColor) +
        '">' +
        escapeHtml(getInitial(botName)) +
        "</div>" +
        '<div class="omybott-bubble-wrap">' +
        '<div class="omybott-bubble assistant">' +
        escapeHtml(message.content) +
        "</div>" +
        "</div>" +
        "</div>"
      )
    }

    function updateSendState() {
      var canSend = input.value.trim().length > 0 && !isSending
      sendBtn.disabled = !canSend
      input.disabled = isSending
    }

    function resetConversation() {
      messages = welcomeMessage
        ? [{ role: "assistant", content: welcomeMessage }]
        : []
      conversationId = null
      isSending = false
      setError(null)
      input.value = ""
      updateSendState()
      renderMessages()
    }

    async function sendMessage() {
      var text = input.value.trim()
      if (!text || isSending) return

      var userMessage = { role: "user", content: text }
      messages.push(userMessage)
      input.value = ""
      setError(null)
      isSending = true
      updateSendState()
      renderMessages()

      try {
        var controller = new AbortController()
        var timeoutId = window.setTimeout(function () {
          controller.abort()
        }, 120000)

        var response = await fetch(apiUrl + "/public/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Omybott-Key": config.apiKey,
          },
          body: JSON.stringify({
            message: text,
            conversationId: conversationId,
          }),
          signal: controller.signal,
        })

        window.clearTimeout(timeoutId)

        var body = await response.json()
        var payload = body.data !== undefined ? body.data : body

        if (!response.ok || body.error) {
          var errorMessage =
            body.error?.message ||
            body.error?.subErrors?.join(", ") ||
            "Failed to send message. Please try again."
          throw new Error(errorMessage)
        }

        if (payload.conversationId) {
          conversationId = payload.conversationId
        }

        messages.push({
          role: "assistant",
          content: payload.response || "",
        })
      } catch (error) {
        messages = messages.filter(function (message) {
          return message !== userMessage
        })
        input.value = text
        setError(
          error instanceof Error
            ? error.name === "AbortError"
              ? "Request timed out. Please try again."
              : error.message
            : "Failed to send message. Please try again.",
        )
      } finally {
        isSending = false
        updateSendState()
        renderMessages()
      }
    }

    launcher.addEventListener("click", function () {
      setOpen(!isOpen)
    })

    resetBtn.addEventListener("click", function () {
      resetConversation()
    })

    form.addEventListener("submit", function (event) {
      event.preventDefault()
      void sendMessage()
    })

    input.addEventListener("input", updateSendState)

    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault()
        void sendMessage()
      }
    })

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen) {
        setOpen(false)
      }
    })

    if (welcomeMessage) {
      messages.push({ role: "assistant", content: welcomeMessage })
    }

    updateSendState()
    renderMessages()

    return {
      open: function () {
        setOpen(true)
      },
      close: function () {
        setOpen(false)
      },
      destroy: function () {
        host.remove()
      },
    }
  }

  window.OmybottWidget = {
    init: function (config) {
      return createWidget(config || {})
    },
  }
})()
