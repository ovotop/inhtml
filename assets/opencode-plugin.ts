import type { Plugin } from "@opencode-ai/plugin"

const IN_HTML_PORT = process.env.IN_HTML_PORT || "7654"
const IN_HTML_URL = `http://localhost:${IN_HTML_PORT}/~hook`

const messages = new Map<string, { role: string; text: string; sent: boolean }>()
let currentAssistantId: string | null = null

async function postEvent(event: string, data: Record<string, string>) {
  try {
    await fetch(IN_HTML_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, ...data }),
    })
  } catch {
    // server not running, silently ignore
  }
}

export const InHtmlSync: Plugin = async () => {
  return {
    event: async ({ event }) => {

      // Track message metadata
      if (event.type === "message.updated") {
        const msg = event.properties?.info
        if (!msg?.id) return

        const existing = messages.get(msg.id)
        if (!existing) {
          messages.set(msg.id, {
            role: msg.role,
            text: "",
            sent: false,
          })
        }
      }

      // Track message parts (content)
      if (event.type === "message.part.updated") {
        const part = event.properties?.part
        if (!part?.messageID) return

        const msg = messages.get(part.messageID)
        if (!msg) {
          messages.set(part.messageID, {
            role: "assistant",
            text: "",
            sent: false,
          })
        }

        const entry = messages.get(part.messageID)!

        // User messages: send immediately
        if (entry.role === "user" && part.type === "text" && part.text && !entry.sent) {
          entry.sent = true
          postEvent("user_prompt", { text: part.text.slice(0, 2000) })
        }

        // Assistant text: stream live update for current message
        if (entry.role === "assistant" && part.type === "text" && part.text) {
          entry.text = part.text

          // If this is a new assistant message, replace current
          if (currentAssistantId !== part.messageID) {
            // Discard previous unsent assistant message
            if (currentAssistantId) {
              const prev = messages.get(currentAssistantId)
              if (prev && !prev.sent) {
                prev.sent = true
              }
            }
            currentAssistantId = part.messageID
          }

          // Send live update (not persisted, browser-only)
          postEvent("ai_update", {
            messageId: part.messageID,
            text: part.text.slice(0, 2000),
          })
        }
      }

      // Finalize on idle
      if (event.type === "session.idle") {
        if (currentAssistantId) {
          const msg = messages.get(currentAssistantId)
          if (msg && msg.text && !msg.sent) {
            msg.sent = true
            postEvent("ai_response", {
              messageId: currentAssistantId,
              text: msg.text.slice(0, 2000),
            })
          }
          currentAssistantId = null
        }

        // Cleanup old messages
        if (messages.size > 200) {
          const ids = Array.from(messages.keys())
          for (let i = 0; i < ids.length - 50; i++) messages.delete(ids[i])
        }
      }
    },

    "tool.execute.after": async (input, _output) => {
      const tool = input.tool
      const filePath = input.args?.filePath || input.args?.path || ""
      if (tool === "write" && typeof filePath === "string" && filePath.includes(".inhtml/artifacts/") && filePath.endsWith(".html")) {
        const artifactId = filePath.split("/").pop()?.replace(".html", "") || ""
        if (artifactId) {
          postEvent("artifact_created", { artifactId })
        }
      }
    },
  }
}
