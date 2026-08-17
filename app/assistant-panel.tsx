"use client";

import { FormEvent, useState } from "react";
import { AgeIssue } from "./age-issue";

type AssistantPanelProps = {
  apiBaseUrl?: string;
};

type Message = {
  id: number;
  role: "assistant" | "visitor";
  text: string;
};

type ChatResponse = {
  ok: boolean;
  reply?: string;
  message?: string;
};

function apiUrl(apiBaseUrl: string, path: string) {
  return `${apiBaseUrl.replace(/\/$/, "")}${path}`;
}

export function AssistantPanel({ apiBaseUrl }: AssistantPanelProps) {
  const baseUrl = apiBaseUrl ?? "";
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      text: "Welcome to the archive. Ask about Akshat’s work, ventures, or current chapter.",
    },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = message.trim();
    if (!question || isSending) return;

    const visitorMessage: Message = {
      id: Date.now(),
      role: "visitor",
      text: question,
    };

    setMessages((current) => [...current, visitorMessage]);
    setMessage("");
    setError(null);
    setIsSending(true);

    try {
      const response = await fetch(apiUrl(baseUrl, "/api/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });
      const data = (await response.json()) as ChatResponse;

      if (!response.ok || !data.ok) {
        setError(data.message ?? "The assistant could not answer right now.");
        return;
      }

      setMessages((current) => [
        ...current,
        { id: Date.now() + 1, role: "assistant", text: data.reply ?? "" },
      ]);
    } catch {
      setError("The assistant is unavailable right now. Please try again shortly.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      <button
        className="assistant-launcher"
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open portfolio assistant"
        aria-expanded={isOpen}
        aria-controls="portfolio-assistant"
      >
        <span aria-hidden="true">✦</span>
        Ask the editor
      </button>

      <div className={`assistant-backdrop${isOpen ? " is-open" : ""}`} onClick={() => setIsOpen(false)} />
      <aside
        className={`assistant-sidebar${isOpen ? " is-open" : ""}`}
        id="portfolio-assistant"
        aria-label="Portfolio assistant"
        aria-hidden={!isOpen}
      >
        <header className="assistant-sidebar-header">
          <div>
            <p className="assistant-overline">Issue <AgeIssue /> · archive desk</p>
            <h2>Ask the editor.</h2>
          </div>
          <button className="assistant-close" type="button" onClick={() => setIsOpen(false)} aria-label="Close assistant">
            ×
          </button>
        </header>

        <div className="assistant-context">
          Ask about the work, ventures, education, technology, current projects, or any chapter of the story.
        </div>

        <div className="assistant-messages" aria-live="polite">
          {messages.map((item) => (
            <p className={`assistant-message ${item.role}`} key={item.id}>{item.text}</p>
          ))}
          {isSending && <p className="assistant-typing">Thinking<span aria-hidden="true">...</span></p>}
        </div>

        <form className="assistant-composer" onSubmit={submit}>
          <label className="sr-only" htmlFor="assistant-question">Your question</label>
          <textarea
            id="assistant-question"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={apiBaseUrl ? "Ask a question…" : "Assistant is being connected…"}
            rows={2}
            disabled={!apiBaseUrl || isSending}
          />
          <button type="submit" disabled={!apiBaseUrl || !message.trim() || isSending}>Send <span aria-hidden="true">↑</span></button>
        </form>
        {error && <p className="assistant-error" role="alert">{error}</p>}
      </aside>
    </>
  );
}
