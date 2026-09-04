"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { deleteApplication, fetchApplication, updateApplication } from "@/lib/api";
import { JobApplicationForm } from "@/components/JobApplicationForm";
import type { JobApplication, JobApplicationInput } from "@/lib/types";

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchApplication(id)
      .then(setApplication)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"));
  }, [id]);

  async function handleSubmit(data: Partial<JobApplicationInput>) {
    const updated = await updateApplication(id, data);
    setApplication(updated);
  }

  async function handleDelete() {
    if (!confirm("Delete this job application? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await deleteApplication(id);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
      setDeleting(false);
    }
  }

  if (error) {
    return <div className="mx-auto max-w-3xl px-4 py-8 text-sm text-red-700">{error}</div>;
  }

  if (!application) {
    return <div className="mx-auto max-w-3xl px-4 py-8 text-sm text-gray-500">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900">
          {application.jobTitle} @ {application.companyName}
        </h1>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <JobApplicationForm initial={application} onSubmit={handleSubmit} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
