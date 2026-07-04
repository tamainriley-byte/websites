"use client"

import { useActionState } from "react"
import { login } from "@/app/admin/actions"

const initialState = { error: "" }

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-5 text-left">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-sm font-medium tracking-wide text-foreground"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="min-h-12 rounded-2xl border border-border bg-card px-4 py-3 text-base text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
          required
        />
      </div>

      {state?.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-7 py-3 text-base font-medium text-primary-foreground shadow-lg transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Checking..." : "Sign in"}
      </button>
    </form>
  )
}
