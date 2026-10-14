"use server";

import { createClient } from "@/lib/supabase/server";
import type { Ticket } from "@/components/TicketBoard";

type Result<T> = { data: T; error: null } | { data: null; error: string };

const COLUMNS = "id, user_id, description, contact, created_at";

// Writes run on the server with the same cookie session that renders /app,
// so the request always reaches Supabase as the logged-in user.
async function getUserClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

function explain(error: { code?: string; message: string }) {
  if (error.code === "42501") {
    return "The database refused access (permission denied). Run supabase/schema.sql again in Supabase → SQL Editor.";
  }
  return error.message;
}

export async function postTicket(description: string, contact: string): Promise<Result<Ticket>> {
  const text = description.trim();
  if (!text) return { data: null, error: "Describe your ticket first." };

  const { supabase, user } = await getUserClient();
  if (!user) return { data: null, error: "Your session expired. Please log in again." };

  const { data, error } = await supabase
    .from("tickets")
    .insert({ user_id: user.id, description: text.slice(0, 500), contact: contact.trim().slice(0, 100) })
    .select(COLUMNS)
    .single();

  if (error) return { data: null, error: explain(error) };
  return { data: data as Ticket, error: null };
}

export async function deleteTicket(id: string): Promise<Result<string>> {
  const { supabase, user } = await getUserClient();
  if (!user) return { data: null, error: "Your session expired. Please log in again." };

  const { error } = await supabase.from("tickets").delete().eq("id", id).eq("user_id", user.id);
  if (error) return { data: null, error: explain(error) };
  return { data: id, error: null };
}
