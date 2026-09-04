import type { JobApplication, JobApplicationInput, StatsResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function getApiToken(): Promise<string> {
  const res = await fetch("/api/auth-token");
  if (!res.ok) throw new Error("Not authenticated");
  const { token } = (await res.json()) as { token: string };
  return token;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await getApiToken();

  const res = await fetch(`${API_URL}/api/job-applications${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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
