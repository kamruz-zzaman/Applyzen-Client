import { z } from "zod";
import {
  APPLICATION_STATUSES,
  JOB_TYPES,
  PRIORITIES,
  SOURCES,
  WORK_MODES,
} from "@/lib/models/JobApplication";

const interviewRoundSchema = z.object({
  round: z.string().trim().min(1),
  date: z.coerce.date().optional(),
  notes: z.string().trim().optional(),
});

export const jobApplicationInputSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required"),
  companyLocation: z.string().trim().optional(),
  companyLinkedIn: z.string().trim().url("Must be a valid URL").optional().or(z.literal("")),

  jobTitle: z.string().trim().min(1, "Job title is required"),
  jobPostingUrl: z.string().trim().url("Must be a valid URL").optional().or(z.literal("")),
  jobType: z.enum(JOB_TYPES).optional(),
  workMode: z.enum(WORK_MODES).optional(),

  dateApplied: z.coerce.date({ required_error: "Date applied is required" }),
  source: z.enum(SOURCES).optional(),
  status: z.enum(APPLICATION_STATUSES).optional(),
  priority: z.enum(PRIORITIES).optional(),

  salaryRangeMin: z.coerce.number().min(0).optional(),
  salaryRangeMax: z.coerce.number().min(0).optional(),
  proposedSalary: z.coerce.number().min(0).optional(),
  salaryCurrency: z.string().trim().optional(),

  contactName: z.string().trim().optional(),
  contactEmail: z.string().trim().email().optional().or(z.literal("")),
  contactPhone: z.string().trim().optional(),
  referredBy: z.string().trim().optional(),

  resumeVersion: z.string().trim().optional(),
  coverLetterUsed: z.coerce.boolean().optional(),

  interviewRounds: z.array(interviewRoundSchema).optional(),
  nextFollowUpDate: z.coerce.date().optional(),
  offerDeadline: z.coerce.date().optional(),
  rejectionReason: z.string().trim().optional(),

  tags: z.array(z.string().trim()).optional(),
  notes: z.string().trim().optional(),
});

export const jobApplicationUpdateSchema = jobApplicationInputSchema.partial();
