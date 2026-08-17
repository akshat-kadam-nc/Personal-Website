type BookingConfirmation = string;

function notBuilt(what: string): never {
  throw new Error(`NOT_BUILT:${what}`);
}

/**
 * Server-only assistant configuration. Environment variables are never
 * imported by, serialized to, or returned from client components.
 */
function getAssistantConfig() {
  return {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.MODEL ?? "gemini-3.5-flash",
  };
}

function configurationError() {
  return new Error(
    "The portfolio assistant is not configured. Set GEMINI_API_KEY on the server.",
  );
}

export function toAssistantErrorResponse(error: unknown, what: string) {
  const message = error instanceof Error ? error.message : "Unexpected error";

  if (message.startsWith("NOT_BUILT:")) {
    return Response.json(
      {
        ok: false,
        todo: true,
        message: `${what} is not built yet. Follow the class prompt chain to build it.`,
      },
      { status: 501 },
    );
  }

  return Response.json({ ok: false, message }, { status: 500 });
}

export async function generateReply(visitorMessage: string): Promise<string> {
  const config = getAssistantConfig();
  void visitorMessage;

  if (!config.apiKey) throw configurationError();
  void config.model;

  // The source assistant currently leaves the model call as a class exercise.
  notBuilt("The chat reply");
}

export async function generateNudges(): Promise<string[]> {
  const config = getAssistantConfig();
  if (!config.apiKey) throw configurationError();
  void config.model;

  // The source assistant currently leaves the model call as a class exercise.
  notBuilt("The suggested questions");
}

export async function listOpenSlots(): Promise<string[]> {
  // The source assistant currently leaves calendar integration as a class exercise.
  notBuilt("Open slots");
}

export async function bookSlot(
  slotStartIso: string,
  name: string,
  contact: string,
): Promise<BookingConfirmation> {
  void slotStartIso;
  void name;
  void contact;

  // The source assistant currently leaves calendar integration as a class exercise.
  notBuilt("Booking");
}
