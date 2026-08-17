import { generateNudges, toAssistantErrorResponse } from "../_lib/portfolio-assistant";

export async function GET() {
  try {
    const nudges = await generateNudges();
    return Response.json({ ok: true, nudges });
  } catch (error) {
    return toAssistantErrorResponse(error, "The suggested questions");
  }
}
