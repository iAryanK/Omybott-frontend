"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Logo from "../shared/Logo"
import Image from "next/image"

const LoginForm = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <Card className="w-full max-w-xs ring-0 bg-transparent">
      <CardHeader>
        <div className="pb-4"><Logo /></div>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your Omybott account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </Field>
          </FieldGroup>

          <Button type="submit" className="w-full" size="lg">
            Sign in
          </Button>

          <FieldSeparator>Or continue with</FieldSeparator>

          <Button type="button" variant="outline" className="w-full" size="lg">
            <Image src={"/google-icon.svg"} alt="Google" className="w-4 h-4" width={"50"} height={"50"} />
            Continue with Google
          </Button>
        </form>

        <p className="mt-4 text-center text-xs/relaxed text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

export default LoginForm
