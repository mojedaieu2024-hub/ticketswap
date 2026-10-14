"use client";

import { useState, type FormEvent } from "react";
import { deleteTicket, postTicket } from "@/app/app/actions";

export type Ticket = {
  id: string;
  user_id: string;
  description: string;
  contact: string;
  created_at: string;
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Madrid",
});

export default function TicketBoard({
  userId,
  initialTickets,
  loadError,
}: {
  userId: string;
  initialTickets: Ticket[];
  loadError: string | null;
}) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState<string | null>(loadError);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = description.trim();
    if (!text) {
      setError("Describe your ticket first.");
      return;
    }
    setError(null);
    setBusy(true);

    const result = await postTicket(text, contact);

    setBusy(false);
    if (result.error !== null) {
      setError(result.error);
      return;
    }
    const ticket = result.data;
    setTickets((prev) => [ticket, ...prev]);
    setDescription("");
    setContact("");
  }

  async function handleDelete(id: string) {
    const { error } = await deleteTicket(id);
    if (error) {
      setError(error);
      return;
    }
    setTickets((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="board">
      <section className="card post-card" aria-labelledby="post-title">
        <h1 id="post-title" className="board-title">
          Sell a ticket
        </h1>
        <form onSubmit={handleSubmit} className="form">
          <label className="field">
            <span className="label">Event, price, perks and date</span>
            <textarea
              data-testid="core-input"
              name="description"
              rows={2}
              maxLength={500}
              placeholder="Houdini, €20, includes 1 drink, this Friday"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label className="field">
            <span className="label">
              How to reach you <span className="optional">(optional)</span>
            </span>
            <input
              type="text"
              name="contact"
              maxLength={100}
              placeholder="e.g. Instagram @handle"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </label>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button
            data-testid="core-submit"
            type="submit"
            className="btn btn-primary btn-block"
            disabled={busy}
          >
            {busy ? "Posting…" : "Post ticket"}
          </button>
        </form>
      </section>

      <section aria-labelledby="list-title">
        <h2 id="list-title" className="section-title">
          Tickets on sale <span className="count">{tickets.length}</span>
        </h2>
        {tickets.length === 0 ? (
          <p className="empty card">No tickets yet. Be the first to post one!</p>
        ) : (
          <ul className="ticket-list">
            {tickets.map((t) => {
              const mine = t.user_id === userId;
              return (
                <li key={t.id} data-testid="core-item" className="card ticket">
                  <p className="ticket-text">{t.description}</p>
                  <div className="ticket-footer">
                    <span className="ticket-meta">
                      {mine && <span className="badge">You</span>}
                      {dateFormat.format(new Date(t.created_at))}
                      {t.contact && <> · {t.contact}</>}
                    </span>
                    {mine && (
                      <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => handleDelete(t.id)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
