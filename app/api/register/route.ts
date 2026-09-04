import { NextResponse } from "next/server";
import { z } from "zod";
import { createUserWithPassword } from "@/lib/users";

const registerSchema = z.object({
  name: z.string().trim().min(1).optional().or(z.literal("")),
  email: z.string().trim().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  try {
    await createUserWithPassword(parsed.data.email, parsed.data.password, parsed.data.name || undefined);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create account";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
