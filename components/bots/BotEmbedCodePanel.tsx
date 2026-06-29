"use client"

import { useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  buildEmbedSnippet,
  type EmbedBotConfig,
  type EmbedFormat,
} from "@/lib/embed-code"

type BotEmbedCodePanelProps = {
  config: EmbedBotConfig
  apiKeyPlaceholder?: boolean
}

const FORMATS: { value: EmbedFormat; label: string }[] = [
  { value: "html", label: "HTML" },
  { value: "react", label: "React" },
  { value: "angular", label: "Angular" },
]

const BotEmbedCodePanel = ({
  config,
  apiKeyPlaceholder = false,
}: BotEmbedCodePanelProps) => {
  const [format, setFormat] = useState<EmbedFormat>("html")
  const [copied, setCopied] = useState(false)

  const snippet = buildEmbedSnippet(format, config)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="text-sm font-medium">Embed on your website</p>
        <p className="text-xs text-muted-foreground">
          Paste this into your site to show the same chat UI. Works with plain
          HTML, React, Angular, and other frontends. Your site must be listed in
          allowed domains.
        </p>
        {apiKeyPlaceholder ? (
          <p className="text-xs text-amber-600 dark:text-amber-500">
            Replace <code className="font-mono">YOUR_API_KEY</code> with the key
            you saved when it was created.
          </p>
        ) : null}
      </div>

      <Tabs
        value={format}
        onValueChange={(value) => setFormat(value as EmbedFormat)}
      >
        <div className="flex items-center justify-between gap-2">
          <TabsList>
            {FORMATS.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button type="button" variant="outline" size="sm" onClick={() => void handleCopy()}>
            {copied ? (
              <>
                <CheckIcon data-icon="inline-start" />
                Copied
              </>
            ) : (
              <>
                <CopyIcon data-icon="inline-start" />
                Copy code
              </>
            )}
          </Button>
        </div>

        {FORMATS.map((item) => (
          <TabsContent key={item.value} value={item.value} className="mt-3">
            <pre className="max-h-64 overflow-auto rounded-lg border bg-muted/30 p-3 text-xs leading-relaxed">
              <code className="font-mono whitespace-pre-wrap">{snippet}</code>
            </pre>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default BotEmbedCodePanel
