import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { apiErrorResponse, requireUserId } from "@/lib/api-error";
import { dbPromise } from "@/lib/db";
import { JobApplicationModel } from "@/lib/models/JobApplication";
import { jobApplicationInputSchema } from "@/lib/validation/jobApplication";

export async function GET(req: NextRequest) {
  try {
    await dbPromise;
    const session = await auth();
    const userId = requireUserId(session?.user?.id);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const sort = searchParams.get("sort") ?? "-dateApplied";

    const filter: Record<string, unknown> = { userId };
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { jobTitle: { $regex: search, $options: "i" } },
      ];
    }

    const applications = await JobApplicationModel.find(filter).sort(sort);
    return NextResponse.json(applications);
  } catch (err) {
    return apiErrorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbPromise;
    const session = await auth();
    const userId = requireUserId(session?.user?.id);

    const body = await req.json();
    const data = jobApplicationInputSchema.parse(body);
    const application = await JobApplicationModel.create({ ...data, userId });
    return NextResponse.json(application, { status: 201 });
  } catch (err) {
    return apiErrorResponse(err);
  }
}

export async function DELETE() {
  try {
    await dbPromise;
    const session = await auth();
    const userId = requireUserId(session?.user?.id);

    await JobApplicationModel.deleteMany({ userId });
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return apiErrorResponse(err);
  }
}
