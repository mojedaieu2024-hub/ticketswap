import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";

// Rendered on every page, so a logged-in user always sees the logout button.
export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="TicketSwap home">
          <span className="brand-mark" aria-hidden="true">🎟</span>
          TicketSwap
        </Link>
        <nav className="nav">
          {user ? (
            <>
              <Link href="/app" className="nav-link">
                Tickets
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="nav-link">
                Log in
              </Link>
              <Link href="/signup" className="btn btn-primary btn-sm">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
