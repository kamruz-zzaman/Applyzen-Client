import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { deletePasskey } from "@/lib/security";

export async function DELETE(_request: Request, { params }: { params: Promise<{ credentialId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { credentialId } = await params;
  const deleted = await deletePasskey(session.user.id, decodeURIComponent(credentialId));
  if (!deleted) {
    return NextResponse.json({ error: "Passkey not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
