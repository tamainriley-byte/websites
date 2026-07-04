"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const COOKIE_NAME = "admin_auth"

export async function isAuthed() {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return false
  const store = await cookies()
  return store.get(COOKIE_NAME)?.value === password
}

export async function login(_prevState: unknown, formData: FormData) {
  const password = process.env.ADMIN_PASSWORD
  const submitted = String(formData.get("password") ?? "")

  if (!password) {
    return { error: "ADMIN_PASSWORD is not configured." }
  }
  if (submitted !== password) {
    return { error: "Incorrect password." }
  }

  const store = await cookies()
  store.set(COOKIE_NAME, password, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  redirect("/admin")
}

export async function logout() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
  redirect("/admin")
}
