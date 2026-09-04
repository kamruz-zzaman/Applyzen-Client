import Link from "next/link";
import { Briefcase, DollarSign, KeyRound, ListChecks } from "lucide-react";

const FEATURES = [
  {
    icon: Briefcase,
    title: "Every detail, one row",
    description:
      "Company, location, LinkedIn profile, job title, date applied, and status — searchable and filterable.",
  },
  {
    icon: DollarSign,
    title: "Salary, tracked honestly",
    description: "Log the posted range alongside what you actually asked for, so you can see the pattern over time.",
  },
  {
    icon: ListChecks,
    title: "The whole pipeline",
    description: "Interview rounds, recruiter contacts, follow-up dates, and offer deadlines — not just a status label.",
  },
  {
    icon: KeyRound,
    title: "Sign in your way",
    description: "Google, Microsoft, GitHub, a passkey, or plain email and password. Your data, scoped to you alone.",
  },
];

const PREVIEW_ROWS = [
  { company: "Acme Corp", role: "Senior Frontend Engineer", status: "Interviewing", color: "bg-violet-400" },
  { company: "Globex Inc", role: "Platform Engineer", status: "Applied", color: "bg-blue-400" },
  { company: "Initech", role: "Backend Engineer", status: "Offer", color: "bg-emerald-400" },
];

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <header className="border-b border-white/10 bg-[#08080d]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <span className="text-base font-semibold tracking-tight text-white">Job Application Tracker</span>
          <div className="flex items-center gap-2">
            <Link href="/sign-in" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:text-white">
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#08080d]">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-10rem] h-[36rem] w-[56rem] -translate-x-1/2 rounded-full bg-indigo-600/30 blur-3xl"
        />
        <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-20 text-center sm:px-6 sm:pt-28">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Stop losing track of your job search
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-gray-400">
            One place for every application: who, where, what you asked for, and what happened next.
          </p>
          <div className="mt-9 flex items-center justify-center gap-3">
            <Link
              href="/sign-up"
              className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-colors hover:bg-indigo-400"
            >
              Get started free
            </Link>
            <Link
              href="/sign-in"
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Sign in
            </Link>
          </div>
        </div>

        <div className="relative mx-auto max-w-3xl px-4 pb-24 sm:px-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-2 shadow-2xl backdrop-blur">
            <div className="rounded-xl bg-[#0d0d15] p-5">
              <div className="mb-4 grid grid-cols-3 gap-3">
                {["Total", "Active", "Offers"].map((label, i) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="mt-1 text-xl font-semibold text-white">{[12, 5, 2][i]}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {PREVIEW_ROWS.map((row) => (
                  <div
                    key={row.company}
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`h-2 w-2 rounded-full ${row.color}`} />
                      <div>
                        <p className="text-sm font-medium text-white">{row.company}</p>
                        <p className="text-xs text-gray-500">{row.role}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-gray-300">{row.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl flex-1 px-4 py-20 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        Job Application Tracker — free to use, your data stays yours.
      </footer>
    </div>
  );
}
