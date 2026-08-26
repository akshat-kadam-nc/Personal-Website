export function POST() {
  return Response.json(
    { ok: false, message: "The portfolio assistant is currently unavailable." },
    { status: 404 },
  );
}