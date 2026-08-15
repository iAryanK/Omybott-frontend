"use client"

import { Suspense, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { toast } from "sonner"

function OAuthCallbackHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const processedRef = useRef(false)

  useEffect(() => {
    if (processedRef.current) return
    processedRef.current = true

    const token = searchParams.get("token")
    const refreshToken = searchParams.get("refreshToken")

    if (!token || !refreshToken) {
      toast.error("OAuth authentication failed: Missing tokens.")
      router.push("/login")
      return
    }

    signIn("token-login", {
      accessToken: token,
      refreshToken: refreshToken,
      redirect: false,
    })
      .then((res) => {
        if (res?.error) {
          toast.error("Authentication failed!")
          router.push("/login")
        } else {
          router.push("/")
          router.refresh()
        }
      })
      .catch(() => {
        toast.error("Something went wrong!")
        router.push("/login")
      })
  }, [searchParams, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OAuthCallbackHandler />
    </Suspense>
  )
}
