import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ApiError, apiErrorResponse, requireUserId } from "@/lib/api-error";
import { dbPromise } from "@/lib/db";
import { JobApplicationModel } from "@/lib/models/JobApplication";
import { jobApplicationUpdateSchema } from "@/lib/validation/jobApplication";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await dbPromise;
    const session = await auth();
    const userId = requireUserId(session?.user?.id);

    const { id } = await params;
    const application = await JobApplicationModel.findOne({ _id: id, userId });
    if (!application) throw new ApiError(404, "Job application not found");
    return NextResponse.json(application);
  } catch (err) {
    return apiErrorResponse(err);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await dbPromise;
    const session = await auth();
    const userId = requireUserId(session?.user?.id);

    const { id } = await params;
    const body = await req.json();
    const data = jobApplicationUpdateSchema.parse(body);
    const application = await JobApplicationModel.findOneAndUpdate({ _id: id, userId }, data, {
      new: true,
      runValidators: true,
    });
    if (!application) throw new ApiError(404, "Job application not found");
    return NextResponse.json(application);
  } catch (err) {
    return apiErrorResponse(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await dbPromise;
    const session = await auth();
    const userId = requireUserId(session?.user?.id);

    const { id } = await params;
    const application = await JobApplicationModel.findOneAndDelete({ _id: id, userId });
    if (!application) throw new ApiError(404, "Job application not found");
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return apiErrorResponse(err);
  }
}
