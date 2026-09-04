import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { updateUserImage } from "@/lib/users";

// The client resizes to a small square before sending, so this is a generous
// ceiling against abuse rather than the expected size.
const MAX_DATA_URL_LENGTH = 400_000;

const avatarSchema = z.object({
  image: z
    .string()
    .startsWith("data:image/", "Must be an image")
    .max(MAX_DATA_URL_LENGTH, "Image is too large"),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const parsed = avatarSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid image" }, { status: 400 });
  }

  await updateUserImage(session.user.id, parsed.data.image);
  return NextResponse.json({ ok: true });
}
