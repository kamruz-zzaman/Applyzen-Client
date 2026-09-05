import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { apiErrorResponse, requireUserId } from "@/lib/api-error";
import { dbPromise } from "@/lib/db";
import { JobApplicationModel } from "@/lib/models/JobApplication";

export async function GET() {
  try {
    await dbPromise;
    const session = await auth();
    const userId = requireUserId(session?.user?.id);

    const byStatus = await JobApplicationModel.aggregate([
      { $match: { userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const total = await JobApplicationModel.countDocuments({ userId });

    return NextResponse.json({ total, byStatus });
  } catch (err) {
    return apiErrorResponse(err);
  }
}
