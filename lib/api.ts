import type { JobApplication, JobApplicationInput, StatsResponse } from "./types";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api/job-applications${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? "Request failed");
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function fetchApplications(params?: { status?: string; search?: string }) {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.search) query.set("search", params.search);
  const qs = query.toString();
  return request<JobApplication[]>(`${qs ? `?${qs}` : ""}`);
}

export function fetchApplication(id: string) {
  return request<JobApplication>(`/${id}`);
}

export function createApplication(data: Partial<JobApplicationInput>) {
  return request<JobApplication>("", { method: "POST", body: JSON.stringify(data) });
}

export function updateApplication(id: string, data: Partial<JobApplicationInput>) {
  return request<JobApplication>(`/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export function deleteApplication(id: string) {
  return request<void>(`/${id}`, { method: "DELETE" });
}

export function fetchStats() {
  return request<StatsResponse>("/stats");
}
