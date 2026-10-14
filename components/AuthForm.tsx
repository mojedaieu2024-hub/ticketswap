"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

type Mode = "signup" | "login";

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isSignup = mode === "signup";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const supabase = createClient();

    const { data, error } = isSignup
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }

    if (!data.session) {
      // Only happens if "Confirm email" is still enabled in Supabase.
      setError(
        "Account created, but no session was returned. Turn off “Confirm email” in Supabase → Authentication → Sign In / Providers → Email."
      );
      setBusy(false);
      return;
    }

    router.push("/app");
    router.refresh();
  }

  return (
    <div className="auth-card card">
      <h1 className="auth-title">{isSignup ? "Create your account" : "Welcome back"}</h1>
      <p className="muted">
        {isSignup
          ? "Free for IE students. Post or find a ticket in under a minute."
          : "Log in to see every ticket on sale."}
      </p>

      <form onSubmit={handleSubmit} className="form" noValidate={false}>
        <label className="field">
          <span className="label">Email</span>
          <input
            data-testid={`${mode}-email`}
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@student.ie.edu"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="field">
          <span className="label">Password</span>
          <input
            data-testid={`${mode}-password`}
            type="password"
            name="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            placeholder={isSignup ? "At least 6 characters" : "Your password"}
            minLength={6}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        <button
          data-testid={`${mode}-submit`}
          type="submit"
          className="btn btn-primary btn-block"
          disabled={busy}
        >
          {busy ? "Please wait…" : isSignup ? "Sign up" : "Log in"}
        </button>
      </form>

      <p className="auth-switch muted">
        {isSignup ? (
          <>
            Already have an account? <Link href="/login">Log in</Link>
          </>
        ) : (
          <>
            New here? <Link href="/signup">Create an account</Link>
          </>
        )}
      </p>
    </div>
  );
}
