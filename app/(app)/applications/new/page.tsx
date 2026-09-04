"use client";

import { useRouter } from "next/navigation";
import { createApplication } from "@/lib/api";
import { JobApplicationForm } from "@/components/JobApplicationForm";
import type { JobApplicationInput } from "@/lib/types";

export default function NewApplicationPage() {
  const router = useRouter();

  async function handleSubmit(data: Partial<JobApplicationInput>) {
    const created = await createApplication(data);
    router.push(`/applications/${created._id}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-xl font-semibold tracking-tight text-gray-900">Add Job Application</h1>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <JobApplicationForm onSubmit={handleSubmit} submitLabel="Add Application" />
      </div>
    </div>
  );
}
