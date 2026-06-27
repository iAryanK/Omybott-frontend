import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  const isAuthRoute = pathname === "/login" || pathname === "/register"
  const isProtectedRoute = pathname === "/"

  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl))
  }

  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL("/", req.nextUrl))
  }
})

export const config = {
  matcher: ["/", "/login", "/register"],
}
