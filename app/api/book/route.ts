import { bookSlot, toAssistantErrorResponse } from "../_lib/portfolio-assistant";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    slot?: unknown;
    name?: unknown;
    contact?: unknown;
  } | null;
  const slot = typeof body?.slot === "string" ? body.slot.trim() : "";
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const contact = typeof body?.contact === "string" ? body.contact.trim() : "";

  if (!slot || !name) {
    return Response.json(
      { ok: false, message: "A slot and a name are needed." },
      { status: 400 },
    );
  }

  try {
    const confirmation = await bookSlot(slot, name, contact);
    return Response.json({ ok: true, confirmation });
  } catch (error) {
    return toAssistantErrorResponse(error, "Booking");
  }
}
