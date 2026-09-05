import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function requireUserId(userId: string | undefined | null): string {
  if (!userId) throw new ApiError(401, "Not authenticated");
  return userId;
}

export function apiErrorResponse(err: unknown) {
  if (err instanceof ZodError) {
    return NextResponse.json({ error: "Validation failed", details: err.flatten() }, { status: 400 });
  }
  if (err instanceof ApiError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error(err);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
