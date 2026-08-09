"use client"

import { useMemo, useState, type FormEvent, type KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowUpIcon,
  MessageCircleDashedIcon,
  RotateCwIcon,
  SparklesIcon,
} from "lucide-react"

import { formatApiError } from "@/lib/api"
import { sendAgentChat } from "@/lib/api-client"
import { toast } from "sonner"
import { MarkdownMessage } from "@/components/shared/MarkdownMessage"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Spinner } from "@/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type AgentMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

type AgentModeSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function createMessageId() {
  return crypto.randomUUID()
}

export function AgentModeSheet({ open, onOpenChange }: AgentModeSheetProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isSending, setIsSending] = useState(false)

  const canSend = inputValue.trim().length > 0 && !isSending

  const welcomeMessage = useMemo(
    () =>
      "Hi! I can help you create and manage workspaces and bots. What would you like to do?",
    [],
  )

  const handleReset = () => {
    setMessages([])
    setInputValue("")
  }

  const handleSend = async () => {
    if (isSending) {
      return
    }

    const trimmedMessage = inputValue.trim()
    if (!trimmedMessage) {
      return
    }

    const userMessage: AgentMessage = {
      id: createMessageId(),
      role: "user",
      content: trimmedMessage,
    }

    setMessages((current) => [...current, userMessage])
    setInputValue("")
    setIsSending(true)

    const result = await sendAgentChat(trimmedMessage)

    if (!result.success) {
      toast.error(formatApiError(result.error))
      setMessages((current) =>
        current.filter((message) => message.id !== userMessage.id),
      )
      setInputValue(trimmedMessage)
      setIsSending(false)
      return
    }

    setMessages((current) => [
      ...current,
      {
        id: createMessageId(),
        role: "assistant",
        content: result.data,
      },
    ])
    setIsSending(false)
    router.refresh()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void handleSend()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      void handleSend()
    }
  }

  const hasMessages = messages.length > 0

  return (
    <MessageScrollerProvider>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-full gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-b px-4 py-4 pr-12">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <SheetTitle className="flex items-center gap-2">
                  <SparklesIcon className="size-4 text-primary" />
                  Agent mode
                </SheetTitle>
                <SheetDescription>
                  Manage workspaces and bots with natural language.
                </SheetDescription>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    aria-label="Reset conversation"
                    onClick={handleReset}
                    disabled={!hasMessages && !isSending}
                  >
                    <RotateCwIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset conversation</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </SheetHeader>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {!hasMessages && !isSending ? (
              <Empty className="flex-1 border-0">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <MessageCircleDashedIcon />
                  </EmptyMedia>
                  <EmptyTitle>Start a conversation</EmptyTitle>
                  <EmptyDescription>{welcomeMessage}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <MessageScroller className="min-h-0 flex-1">
                <MessageScrollerViewport>
                  <MessageScrollerContent className="px-4 py-4">
                    {messages.map((message) => (
                      <MessageScrollerItem
                        key={message.id}
                        scrollAnchor={message.role === "user"}
                      >
                        <Message align={message.role === "user" ? "end" : "start"}>
                          <MessageContent>
                            {message.role === "user" ? (
                              <Bubble variant="default">
                                <BubbleContent>{message.content}</BubbleContent>
                              </Bubble>
                            ) : (
                              <Bubble variant="secondary">
                                <BubbleContent>
                                  <MarkdownMessage content={message.content} />
                                </BubbleContent>
                              </Bubble>
                            )}
                          </MessageContent>
                        </Message>
                      </MessageScrollerItem>
                    ))}

                    {isSending ? (
                      <MessageScrollerItem scrollAnchor>
                        <Message align="start">
                          <MessageAvatar className="size-7 bg-primary text-primary-foreground">
                            <SparklesIcon className="size-3.5" />
                          </MessageAvatar>
                          <MessageContent>
                            <Bubble variant="secondary">
                              <BubbleContent className="flex items-center gap-2">
                                <Spinner className="size-3.5" />
                                Thinking...
                              </BubbleContent>
                            </Bubble>
                          </MessageContent>
                        </Message>
                      </MessageScrollerItem>
                    ) : null}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            )}
          </div>

          <SheetFooter className="border-t p-4">
            <form onSubmit={handleSubmit} className="w-full">
              <InputGroup>
                <InputGroupTextarea
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. Create a workspace called Marketing"
                  rows={2}
                  disabled={isSending}
                  className="min-h-14"
                />
                <InputGroupAddon align="block-end" className="pt-1">
                  <InputGroupButton
                    type="submit"
                    variant="default"
                    size="icon-sm"
                    disabled={!canSend}
                    className="ml-auto"
                  >
                    {isSending ? <Spinner /> : <ArrowUpIcon />}
                    <span className="sr-only">Send</span>
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </form>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </MessageScrollerProvider>
  )
}
