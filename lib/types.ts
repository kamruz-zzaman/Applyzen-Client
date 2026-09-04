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

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
export type JobType = (typeof JOB_TYPES)[number];
export type WorkMode = (typeof WORK_MODES)[number];
export type Source = (typeof SOURCES)[number];
export type Priority = (typeof PRIORITIES)[number];

export interface InterviewRound {
  round: string;
  date?: string;
  notes?: string;
}

export interface JobApplication {
  _id: string;
  companyName: string;
  companyLocation?: string;
  companyLinkedIn?: string;

  jobTitle: string;
  jobPostingUrl?: string;
  jobType: JobType;
  workMode: WorkMode;

  dateApplied: string;
  source: Source;
  status: ApplicationStatus;
  priority: Priority;

  salaryRangeMin?: number;
  salaryRangeMax?: number;
  proposedSalary?: number;
  salaryCurrency: string;

  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  referredBy?: string;

  resumeVersion?: string;
  coverLetterUsed: boolean;

  interviewRounds: InterviewRound[];
  nextFollowUpDate?: string;
  offerDeadline?: string;
  rejectionReason?: string;

  tags: string[];
  notes?: string;

  createdAt: string;
  updatedAt: string;
}

export type JobApplicationInput = Omit<
  JobApplication,
  "_id" | "createdAt" | "updatedAt" | "coverLetterUsed" | "interviewRounds" | "tags"
> & {
  coverLetterUsed?: boolean;
  interviewRounds?: InterviewRound[];
  tags?: string[];
};

export interface StatsResponse {
  total: number;
  byStatus: { _id: ApplicationStatus; count: number }[];
}
