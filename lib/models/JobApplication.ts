import { Schema, model, models, type InferSchemaType } from "mongoose";

export const APPLICATION_STATUSES = [
  "Applied",
  "Phone Screen",
  "Interviewing",
  "Technical Test",
  "Offer",
  "Accepted",
  "Rejected",
  "Withdrawn",
  "Ghosted",
] as const;

export const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"] as const;
export const WORK_MODES = ["Remote", "Hybrid", "Onsite"] as const;
export const SOURCES = [
  "LinkedIn",
  "Company Website",
  "Referral",
  "Indeed",
  "Recruiter",
  "Job Fair",
  "Other",
] as const;
export const PRIORITIES = ["Low", "Medium", "High"] as const;

const interviewRoundSchema = new Schema(
  {
    round: { type: String, required: true, trim: true },
    date: { type: Date },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const jobApplicationSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },

    companyName: { type: String, required: true, trim: true },
    companyLocation: { type: String, trim: true },
    companyLinkedIn: { type: String, trim: true },

    jobTitle: { type: String, required: true, trim: true },
    jobPostingUrl: { type: String, trim: true },
    jobType: { type: String, enum: JOB_TYPES, default: "Full-time" },
    workMode: { type: String, enum: WORK_MODES, default: "Remote" },

    dateApplied: { type: Date, required: true },
    source: { type: String, enum: SOURCES, default: "LinkedIn" },
    status: { type: String, enum: APPLICATION_STATUSES, default: "Applied" },
    priority: { type: String, enum: PRIORITIES, default: "Medium" },

    salaryRangeMin: { type: Number, min: 0 },
    salaryRangeMax: { type: Number, min: 0 },
    proposedSalary: { type: Number, min: 0 },
    salaryCurrency: { type: String, default: "USD", trim: true },

    contactName: { type: String, trim: true },
    contactEmail: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
    referredBy: { type: String, trim: true },

    resumeVersion: { type: String, trim: true },
    coverLetterUsed: { type: Boolean, default: false },

    interviewRounds: { type: [interviewRoundSchema], default: [] },
    nextFollowUpDate: { type: Date },
    offerDeadline: { type: Date },
    rejectionReason: { type: String, trim: true },

    tags: { type: [String], default: [] },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

jobApplicationSchema.index({ userId: 1, companyName: 1, jobTitle: 1 });
jobApplicationSchema.index({ userId: 1, status: 1 });
jobApplicationSchema.index({ userId: 1, dateApplied: -1 });

export type JobApplicationDoc = InferSchemaType<typeof jobApplicationSchema>;

// `models.JobApplication` guards against Next.js dev's hot-reload recompiling
// this module and re-registering the model on an already-connected mongoose instance.
export const JobApplicationModel =
  models.JobApplication ?? model("JobApplication", jobApplicationSchema);
