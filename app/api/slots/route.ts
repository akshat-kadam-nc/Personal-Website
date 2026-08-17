import { listOpenSlots, toAssistantErrorResponse } from "../_lib/portfolio-assistant";

export async function GET() {
  try {
    const slots = await listOpenSlots();
    return Response.json({ ok: true, slots });
  } catch (error) {
    return toAssistantErrorResponse(error, "Open slots");
  }
}
