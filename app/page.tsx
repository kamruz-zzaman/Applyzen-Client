import Link from "next/link";
import { Logo } from "@/components/Logo";

const PREVIEW_ROWS = [
  { company: "Acme Corp", role: "Senior Frontend Engineer", status: "Interviewing", dot: "bg-violet-500" },
  { company: "Globex Inc", role: "Platform Engineer", status: "Applied", dot: "bg-blue-500" },
  { company: "Initech", role: "Backend Engineer", status: "Offer", dot: "bg-emerald-500" },
];

const FEATURES = [
  {
    n: "01",
    title: "Every detail, one row",
    description: "Company, location, LinkedIn profile, job title, date applied, and status — searchable and filterable.",
  },
  {
    n: "02",
    title: "Salary, tracked honestly",
    description: "Log the posted range alongside what you actually asked for, so you can see the pattern over time.",
  },
  {
    n: "03",
    title: "The whole pipeline",
    description: "A real Kanban board, not just a status label — drag applications between stages as things move.",
  },
  {
    n: "04",
    title: "Sign in your way",
    description: "Google, Microsoft, GitHub, a passkey, or plain email and password. Your data, scoped to you alone.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col bg-[var(--background)]">
      <header className="border-b border-stone-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
          <Logo />
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Link
              href="/sign-in"
              className="whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 sm:px-3"
            >
              Sign in
            </Link>
            <Link href="/sign-up" className="btn-primary whitespace-nowrap !px-3.5 !py-2 text-sm sm:!px-5 sm:!py-2.5">
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
            Stop losing track of{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10">your job search</span>
              <span aria-hidden className="absolute inset-x-0 bottom-1.5 z-0 h-3 bg-amber-300/60 sm:bottom-2 sm:h-4" />
            </span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-stone-600">
            One place for every application: who, where, what you asked for, and what happened next.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Link href="/sign-up" className="btn-primary">
              Get started free
            </Link>
            <Link href="/sign-in" className="btn-secondary">
              Sign in
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="rotate-2 rounded-2xl border border-stone-200 bg-white p-5 shadow-xl shadow-stone-900/5 transition-transform hover:rotate-0">
            <div className="mb-4 grid grid-cols-3 gap-3">
              {["Total", "Active", "Offers"].map((label, i) => (
                <div key={label} className="rounded-xl border border-stone-100 bg-stone-50 p-3">
                  <p className="text-xs text-stone-500">{label}</p>
                  <p className="mt-1 text-xl font-semibold text-stone-900">{[12, 5, 2][i]}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {PREVIEW_ROWS.map((row) => (
                <div
                  key={row.company}
                  className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50/60 px-3 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-2 w-2 rounded-full ${row.dot}`} />
                    <div>
                      <p className="text-sm font-medium text-stone-900">{row.company}</p>
                      <p className="text-xs text-stone-500">{row.role}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-stone-200/70 px-2.5 py-1 text-xs text-stone-600">{row.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div key={feature.n} className="flex gap-4">
                <span className="text-sm font-semibold text-amber-600">{feature.n}</span>
                <div>
                  <h3 className="text-base font-semibold text-stone-900">{feature.title}</h3>
                  <p className="mt-1.5 text-sm text-stone-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-stone-200 py-6 text-center text-sm text-stone-500">
        Applyzen — free to use, your data stays yours.
        <br className="sm:hidden" />
        <span className="hidden sm:inline"> · </span>
        Built by{" "}
        <a
          href="https://www.kamruz.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-stone-700 hover:text-amber-600"
        >
          Kamruz Zaman
        </a>
      </footer>
    </div>
  );
}
