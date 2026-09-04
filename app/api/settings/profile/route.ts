import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { updateUserName } from "@/lib/users";

const profileSchema = z.object({ name: z.string().trim().min(1).max(100) });

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const parsed = profileSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  await updateUserName(session.user.id, parsed.data.name);
  return NextResponse.json({ ok: true });
}
