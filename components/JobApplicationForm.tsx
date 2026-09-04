"use client";

import { useState, type FormEvent } from "react";
import {
  APPLICATION_STATUSES,
  JOB_TYPES,
  PRIORITIES,
  SOURCES,
  WORK_MODES,
  type JobApplication,
  type JobApplicationInput,
} from "@/lib/types";

type FormValues = Partial<JobApplicationInput>;

const EMPTY_VALUES: FormValues = {
  companyName: "",
  companyLocation: "",
  companyLinkedIn: "",
  jobTitle: "",
  jobPostingUrl: "",
  jobType: "Full-time",
  workMode: "Remote",
  dateApplied: new Date().toISOString().slice(0, 10),
  source: "LinkedIn",
  status: "Applied",
  priority: "Medium",
  salaryCurrency: "USD",
  coverLetterUsed: false,
};

function toFormValues(app?: JobApplication): FormValues {
  if (!app) return EMPTY_VALUES;
  return {
    ...app,
    dateApplied: app.dateApplied?.slice(0, 10),
    nextFollowUpDate: app.nextFollowUpDate?.slice(0, 10),
    offerDeadline: app.offerDeadline?.slice(0, 10),
  };
}

export function JobApplicationForm({
  initial,
  onSubmit,
  submitLabel = "Save",
}: {
  initial?: JobApplication;
  onSubmit: (data: FormValues) => Promise<void>;
  submitLabel?: string;
}) {
  const [values, setValues] = useState<FormValues>(toFormValues(initial));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-stone-900">Company & Role</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Company name" required>
            <input
              required
              className="input"
              value={values.companyName ?? ""}
              onChange={(e) => set("companyName", e.target.value)}
            />
          </Field>
          <Field label="Company location">
            <input
              className="input"
              placeholder="e.g. Remote / New York, NY"
              value={values.companyLocation ?? ""}
              onChange={(e) => set("companyLocation", e.target.value)}
            />
          </Field>
          <Field label="Company LinkedIn profile">
            <input
              type="url"
              className="input"
              placeholder="https://linkedin.com/company/..."
              value={values.companyLinkedIn ?? ""}
              onChange={(e) => set("companyLinkedIn", e.target.value)}
            />
          </Field>
          <Field label="Job posting URL">
            <input
              type="url"
              className="input"
              value={values.jobPostingUrl ?? ""}
              onChange={(e) => set("jobPostingUrl", e.target.value)}
            />
          </Field>
          <Field label="Job title" required>
            <input
              required
              className="input"
              value={values.jobTitle ?? ""}
              onChange={(e) => set("jobTitle", e.target.value)}
            />
          </Field>
          <Field label="Job type">
            <select
              className="input"
              value={values.jobType}
              onChange={(e) => set("jobType", e.target.value as FormValues["jobType"])}
            >
              {JOB_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Work mode">
            <select
              className="input"
              value={values.workMode}
              onChange={(e) => set("workMode", e.target.value as FormValues["workMode"])}
            >
              {WORK_MODES.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-stone-900">Application</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Date applied" required>
            <input
              required
              type="date"
              className="input"
              value={values.dateApplied ?? ""}
              onChange={(e) => set("dateApplied", e.target.value)}
            />
          </Field>
          <Field label="Source">
            <select
              className="input"
              value={values.source}
              onChange={(e) => set("source", e.target.value as FormValues["source"])}
            >
              {SOURCES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select
              className="input"
              value={values.status}
              onChange={(e) => set("status", e.target.value as FormValues["status"])}
            >
              {APPLICATION_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Priority / interest">
            <select
              className="input"
              value={values.priority}
              onChange={(e) => set("priority", e.target.value as FormValues["priority"])}
            >
              {PRIORITIES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </Field>
          <Field label="Next follow-up date">
            <input
              type="date"
              className="input"
              value={values.nextFollowUpDate ?? ""}
              onChange={(e) => set("nextFollowUpDate", e.target.value)}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-stone-900">Compensation</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Field label="Salary range min">
            <input
              type="number"
              min={0}
              className="input"
              value={values.salaryRangeMin ?? ""}
              onChange={(e) => set("salaryRangeMin", e.target.value ? Number(e.target.value) : undefined)}
            />
          </Field>
          <Field label="Salary range max">
            <input
              type="number"
              min={0}
              className="input"
              value={values.salaryRangeMax ?? ""}
              onChange={(e) => set("salaryRangeMax", e.target.value ? Number(e.target.value) : undefined)}
            />
          </Field>
          <Field label="Your proposed salary">
            <input
              type="number"
              min={0}
              className="input"
              value={values.proposedSalary ?? ""}
              onChange={(e) => set("proposedSalary", e.target.value ? Number(e.target.value) : undefined)}
            />
          </Field>
          <Field label="Currency">
            <input
              className="input"
              value={values.salaryCurrency ?? "USD"}
              onChange={(e) => set("salaryCurrency", e.target.value)}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-stone-900">Contact & Resume</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Contact name">
            <input
              className="input"
              value={values.contactName ?? ""}
              onChange={(e) => set("contactName", e.target.value)}
            />
          </Field>
          <Field label="Contact email">
            <input
              type="email"
              className="input"
              value={values.contactEmail ?? ""}
              onChange={(e) => set("contactEmail", e.target.value)}
            />
          </Field>
          <Field label="Contact phone">
            <input
              className="input"
              value={values.contactPhone ?? ""}
              onChange={(e) => set("contactPhone", e.target.value)}
            />
          </Field>
          <Field label="Referred by">
            <input
              className="input"
              value={values.referredBy ?? ""}
              onChange={(e) => set("referredBy", e.target.value)}
            />
          </Field>
          <Field label="Resume version">
            <input
              className="input"
              placeholder="e.g. resume_v3_frontend.pdf"
              value={values.resumeVersion ?? ""}
              onChange={(e) => set("resumeVersion", e.target.value)}
            />
          </Field>
          <div className="flex items-center gap-2 pt-6">
            <input
              id="coverLetterUsed"
              type="checkbox"
              checked={values.coverLetterUsed ?? false}
              onChange={(e) => set("coverLetterUsed", e.target.checked)}
            />
            <label htmlFor="coverLetterUsed" className="text-sm text-stone-700">
              Cover letter submitted
            </label>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-stone-900">Notes</legend>
        <Field label="Rejection reason (if applicable)">
          <input
            className="input"
            value={values.rejectionReason ?? ""}
            onChange={(e) => set("rejectionReason", e.target.value)}
          />
        </Field>
        <Field label="Notes">
          <textarea
            className="input"
            rows={4}
            value={values.notes ?? ""}
            onChange={(e) => set("notes", e.target.value)}
          />
        </Field>
      </fieldset>

      <div className="flex justify-end gap-3">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-stone-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
