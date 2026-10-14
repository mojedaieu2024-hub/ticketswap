import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <section className="hero">
        <p className="eyebrow">For IE University students</p>
        <h1 className="hero-title">
          Can&apos;t make it to the event?
          <br />
          <span className="accent">Don&apos;t lose your money.</span>
        </h1>
        <p className="hero-sub">
          TicketSwap lets IE students resell the event tickets they can&apos;t use — to other IE
          students who want to go.
        </p>
        <div className="hero-cta">
          {user ? (
            <Link href="/app" className="btn btn-primary btn-lg">
              Go to tickets
            </Link>
          ) : (
            <>
              <Link href="/signup" className="btn btn-primary btn-lg">
                Sign up — it&apos;s free
              </Link>
              <Link href="/login" className="btn btn-ghost btn-lg">
                Log in
              </Link>
            </>
          )}
        </div>

        <div className="ticket-preview" aria-label="Example ticket post">
          <span className="ticket-tag">Example post</span>
          <p className="ticket-text">Houdini, €20, includes 1 drink, this Friday</p>
          <p className="ticket-meta">Contact: @maria.ie</p>
        </div>
      </section>

      <section className="steps" aria-labelledby="how">
        <h2 id="how" className="section-title">
          How it works
        </h2>
        <ol className="steps-list">
          <li className="card step">
            <span className="step-num">1</span>
            <h3>Sign up</h3>
            <p className="muted">Email and password. No forms, no waiting.</p>
          </li>
          <li className="card step">
            <span className="step-num">2</span>
            <h3>Post your ticket</h3>
            <p className="muted">One line: event, price, perks, date.</p>
          </li>
          <li className="card step">
            <span className="step-num">3</span>
            <h3>Get your money back</h3>
            <p className="muted">Classmates see it and reach out to buy.</p>
          </li>
        </ol>
      </section>
    </>
  );
}
