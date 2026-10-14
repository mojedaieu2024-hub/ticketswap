import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TicketBoard, { type Ticket } from "@/components/TicketBoard";

export const metadata: Metadata = { title: "Tickets — TicketSwap" };
export const dynamic = "force-dynamic";

export default async function AppPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("tickets")
    .select("id, user_id, description, contact, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <TicketBoard
      userId={user.id}
      initialTickets={(data ?? []) as Ticket[]}
      loadError={error ? `Could not load tickets: ${error.message}` : null}
    />
  );
}
