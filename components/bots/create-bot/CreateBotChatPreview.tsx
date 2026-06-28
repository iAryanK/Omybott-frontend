"use client"

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
} from "react"
import {
  ArrowUpIcon,
  GlobeIcon,
  ImageIcon,
  MessageCircleDashedIcon,
  PaperclipIcon,
  PlusIcon,
  RotateCwIcon,
  TelescopeIcon,
} from "lucide-react"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Spinner } from "@/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { sendPlaygroundChat } from "@/lib/actions/chat"
import { formatApiError } from "@/lib/api"
import { getInitial } from "@/utils/util"

import type { CreateBotFormData } from "./types"

type CreateBotChatPreviewProps = {
  formData: CreateBotFormData
  botId?: string
  interactive?: boolean
  showSampleConversation?: boolean
}

type PreviewMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

const SAMPLE_USER_MESSAGE = "What can you help me with?"
const SAMPLE_ASSISTANT_MESSAGE =
  "I can answer questions based on the knowledge you train me with. Try asking anything in the playground!"

function buildPreviewMessages(
  formData: CreateBotFormData,
  showSampleConversation: boolean,
): PreviewMessage[] {
  const messages: PreviewMessage[] = []
  const welcomeMessage = formData.welcomeMessage.trim()

  if (welcomeMessage) {
    messages.push({
      id: "welcome",
      role: "assistant",
      content: welcomeMessage,
    })
  }

  if (showSampleConversation) {
    messages.push(
      {
        id: "sample-user",
        role: "user",
        content: SAMPLE_USER_MESSAGE,
      },
      {
        id: "sample-assistant",
        role: "assistant",
        content: SAMPLE_ASSISTANT_MESSAGE,
      },
    )
  }

  return messages
}

function createMessageId() {
  return crypto.randomUUID()
}

type ChatMessageListProps = {
  messages: PreviewMessage[]
  botName: string
  primaryColor: string
  isSending?: boolean
}

function ChatMessageList({
  messages,
  botName,
  primaryColor,
  isSending = false,
}: ChatMessageListProps) {
  return (
    <>
      {messages.map((message) => (
        <MessageScrollerItem
          key={message.id}
          scrollAnchor={message.role === "user"}
        >
          <Message align={message.role === "user" ? "end" : "start"}>
            {message.role === "assistant" ? (
              <MessageAvatar className="size-7">
                <div
                  className="flex size-full items-center justify-center text-[0.625rem] font-semibold text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  {getInitial(botName)}
                </div>
              </MessageAvatar>
            ) : null}
            <MessageContent>
              {message.role === "user" ? (
                <Bubble
                  variant="default"
                  className="[&_[data-slot=bubble-content]]:text-primary-foreground"
                  style={{ "--primary": primaryColor } as CSSProperties}
                >
                  <BubbleContent style={{ backgroundColor: primaryColor }}>
                    {message.content}
                  </BubbleContent>
                </Bubble>
              ) : (
                <Bubble variant="secondary">
                  <BubbleContent>{message.content}</BubbleContent>
                </Bubble>
              )}
            </MessageContent>
          </Message>
        </MessageScrollerItem>
      ))}

      {isSending ? (
        <MessageScrollerItem scrollAnchor>
          <Message align="start">
            <MessageAvatar className="size-7">
              <div
                className="flex size-full items-center justify-center text-[0.625rem] font-semibold text-white"
                style={{ backgroundColor: primaryColor }}
              >
                {getInitial(botName)}
              </div>
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
    </>
  )
}

const CreateBotChatPreview = ({
  formData,
  botId,
  interactive = false,
  showSampleConversation = false,
}: CreateBotChatPreviewProps) => {
  const [sampleDismissed, setSampleDismissed] = useState(false)
  const [chatMessages, setChatMessages] = useState<PreviewMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)

  useEffect(() => {
    setSampleDismissed(false)
  }, [showSampleConversation])

  useEffect(() => {
    if (!interactive) {
      setChatMessages([])
      setInputValue("")
      setChatError(null)
    }
  }, [interactive, botId])

  const botName = formData.name.trim() || "Your Bot"
  const botDescription =
    formData.description.trim() || "How can I help you today?"
  const welcomeMessage = formData.welcomeMessage.trim()

  const showSample = showSampleConversation && !sampleDismissed && !interactive

  const staticMessages = useMemo(
    () => buildPreviewMessages(formData, showSample),
    [formData, showSample],
  )

  const interactiveMessages = useMemo(() => {
    const messages: PreviewMessage[] = []

    if (welcomeMessage) {
      messages.push({
        id: "welcome",
        role: "assistant",
        content: welcomeMessage,
      })
    }

    return [...messages, ...chatMessages]
  }, [welcomeMessage, chatMessages])

  const messages = interactive ? interactiveMessages : staticMessages

  const handleReset = () => {
    if (interactive) {
      setChatMessages([])
      setInputValue("")
      setChatError(null)
      return
    }

    setSampleDismissed(true)
  }

  const handleSend = async () => {
    if (!interactive || !botId || isSending) {
      return
    }

    const trimmedMessage = inputValue.trim()
    if (!trimmedMessage) {
      return
    }

    const userMessage: PreviewMessage = {
      id: createMessageId(),
      role: "user",
      content: trimmedMessage,
    }

    setChatMessages((current) => [...current, userMessage])
    setInputValue("")
    setChatError(null)
    setIsSending(true)

    try {
      const result = await sendPlaygroundChat(botId, trimmedMessage)

      if (!result.success) {
        setChatError(formatApiError(result.error))
        setChatMessages((current) =>
          current.filter((message) => message.id !== userMessage.id),
        )
        setInputValue(trimmedMessage)
        return
      }

      setChatMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "assistant",
          content: result.data.response,
        },
      ])
    } catch (error) {
      setChatError(
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again.",
      )
      setChatMessages((current) =>
        current.filter((message) => message.id !== userMessage.id),
      )
      setInputValue(trimmedMessage)
    } finally {
      setIsSending(false)
    }
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

  const canSend = interactive && inputValue.trim().length > 0 && !isSending

  return (
    <MessageScrollerProvider>
      <div className="relative flex h-full min-h-112 flex-col lg:col-span-2">
        <Card className="mx-auto h-full w-full gap-0">
          <CardHeader className="gap-1 border-b">
            <CardTitle>{botName}</CardTitle>
            <CardDescription>{botDescription}</CardDescription>
            <CardAction>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Reset conversation"
                    onClick={handleReset}
                    disabled={messages.length === 0 && !isSending}
                  >
                    <RotateCwIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset</p>
                </TooltipContent>
              </Tooltip>
            </CardAction>
          </CardHeader>

          <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
            {messages.length === 0 && !isSending ? (
              <Empty className="h-full min-h-80">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <MessageCircleDashedIcon />
                  </EmptyMedia>
                  <EmptyTitle>{botName}</EmptyTitle>
                  <EmptyDescription>
                    {welcomeMessage
                      ? welcomeMessage
                      : interactive
                        ? "Send a message to start chatting with your bot."
                        : "Set a welcome message to preview your bot's first reply."}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <MessageScroller className="h-full min-h-80">
                <MessageScrollerViewport>
                  <MessageScrollerContent className="p-(--card-spacing)">
                    <ChatMessageList
                      messages={messages}
                      botName={botName}
                      primaryColor={formData.primaryColor}
                      isSending={isSending}
                    />
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            )}
          </CardContent>

          <CardFooter className="flex-col gap-2">
            {interactive ? (
              <form onSubmit={handleSubmit} className="w-full">
                <InputGroup>
                  <InputGroupTextarea
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask your bot anything..."
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
                      className="ml-auto text-primary-foreground"
                      style={{ backgroundColor: formData.primaryColor }}
                    >
                      {isSending ? <Spinner /> : <ArrowUpIcon />}
                      <span className="sr-only">Send</span>
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {chatError ? (
                  <p className="mt-2 text-xs text-destructive" role="alert">
                    {chatError}
                  </p>
                ) : null}
              </form>
            ) : (
              <form
                onSubmit={(event) => event.preventDefault()}
                className="w-full"
              >
                <InputGroup>
                  <div className="h-14 w-full px-3 py-2.5">
                    <span className="line-clamp-2 text-muted-foreground">
                      Preview only — finish setup on the left to test live chat.
                    </span>
                  </div>
                  <InputGroupAddon align="block-end" className="pt-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <InputGroupButton
                          aria-label="Add files"
                          type="button"
                          size="icon-sm"
                          variant="outline"
                          disabled
                        >
                          <PlusIcon />
                        </InputGroupButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        side="top"
                        className="w-44"
                      >
                        <DropdownMenuItem disabled>
                          <PaperclipIcon />
                          Add Photos & Files
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled>
                          <ImageIcon />
                          Create Image
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                          <TelescopeIcon />
                          Deep Research
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                          <GlobeIcon />
                          Web Search
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <InputGroupButton
                      type="submit"
                      variant="default"
                      size="icon-sm"
                      disabled
                      className="ml-auto text-primary-foreground"
                      style={{ backgroundColor: formData.primaryColor }}
                    >
                      <ArrowUpIcon />
                      <span className="sr-only">Send</span>
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </form>
            )}
          </CardFooter>
        </Card>

        <div className="px-0.5 pt-2 text-center text-xs text-muted-foreground">
          {interactive
            ? "Live playground chat."
            : "Preview only. Bot updates as you configure."}
        </div>
      </div>
    </MessageScrollerProvider>
  )
}

export default CreateBotChatPreview
