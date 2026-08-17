import { generateReply, toAssistantErrorResponse } from "../_lib/portfolio-assistant";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { message?: unknown } | null;
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!message) {
    return Response.json({ ok: false, message: "Say something first." }, { status: 400 });
  }

  try {
    const reply = await generateReply(message);
    return Response.json({ ok: true, reply });
  } catch (error) {
    return toAssistantErrorResponse(error, "The chat reply");
  }
}
