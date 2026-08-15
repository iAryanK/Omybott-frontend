"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
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
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { registerUser } from "@/lib/api"
import Logo from "../shared/Logo"

type SignupFormValues = {
  name: string
  email: string
  password: string
}

const SignupForm = () => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>()

  const onSubmit = async (values: SignupFormValues) => {
    try {
      await registerUser(values)

      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Account created but sign in failed. Please log in.")
        return
      }

      router.push("/")
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to sign up",
      )
    }
  }

  return (
    <Card className="w-full max-w-xs ring-0 bg-transparent">
      <CardHeader>
        <div className="pb-4"><Logo /></div>
        <CardTitle>Welcome</CardTitle>
        <CardDescription>Register yourself on Omybott</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="Aryan"
                autoComplete="name"
                aria-invalid={!!errors.name}
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
              />
              <FieldError errors={[errors.name]} />
            </Field>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              <FieldError errors={[errors.email]} />
            </Field>
            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <FieldError errors={[errors.password]} />
            </Field>
          </FieldGroup>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Signing up..." : "Sign up"}
          </Button>

          <FieldSeparator>Or continue with</FieldSeparator>

          <Button 
          type="button" 
          variant="outline" 
          className="w-full" size="lg"
          onClick={() => {
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/oauth2/authorization/google`
          }}>
            <Image src={"/google-icon.svg"} alt="Google" className="w-4 h-4" width={"50"} height={"50"} />
            Continue with Google
          </Button>
        </form>

        <p className="mt-4 text-center text-xs/relaxed text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

export default SignupForm
