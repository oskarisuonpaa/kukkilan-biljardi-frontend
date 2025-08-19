// app/reserve/tables/[slug]/page.tsx
interface ReserveTableDetailPageProps {
  params: { slug: string };
}

const ReserveTableDetailPage = async ({
  params,
}: ReserveTableDetailPageProps) => {
  const { slug } = params;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <section className="rounded-xl border border-[var(--border)]/60 bg-[var(--bg-secondary)] p-6 shadow-sm">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-[var(--text-main)]">
            Reserve Table:{" "}
            <span className="text-[var(--secondary)]">{slug}</span>{" "}
            <span className="text-[var(--text-secondary)]">
              (Korvataan pöydän nimellä)
            </span>
          </h1>
        </header>

        <div className="flex flex-col gap-8 md:flex-row">
          {/* Calendar placeholder */}
          <div id="calendar" className="md:w-1/2">
            <div className="flex h-80 items-center justify-center rounded-lg border border-[var(--border)]/60 bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
              {/* Calendar here */}
              Calendar coming soon
            </div>
          </div>

          {/* Form */}
          <div className="md:flex-1">
            <form className="flex flex-col gap-4">
              {/* Time slot(s) */}
              <div className="flex flex-col gap-2">
                <label className="text-[var(--text-main)]" htmlFor="timeslots">
                  Time slot(s)
                </label>
                <input
                  id="timeslots"
                  name="timeslots"
                  type="text"
                  readOnly
                  aria-readonly="true"
                  placeholder="Choose slot(s) from the calendar"
                  className="w-full rounded-lg border border-[var(--border)]/60 bg-[var(--bg-secondary)] p-2 text-[var(--text-main)]
                             placeholder:text-[var(--text-secondary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-subtle)]"
                />
                <div className="flex items-center gap-3 text-sm">
                  <a
                    href="#calendar"
                    className="underline text-[var(--secondary)] hover:text-[var(--secondary-hover)]"
                  >
                    Select from calendar
                  </a>
                  <span className="text-[var(--text-secondary)]">
                    Slots will appear here after selection.
                  </span>
                </div>
              </div>

              {/* Name */}
              <div className="flex flex-col gap-2">
                <label className="text-[var(--text-main)]" htmlFor="name">
                  Name
                </label>
                <input
                  className="w-full rounded-lg border border-[var(--border)]/60 bg-[var(--bg-secondary)] p-2 text-[var(--text-main)] placeholder:text-[var(--text-secondary)]
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-subtle)]"
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  required
                  autoComplete="name"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-[var(--text-main)]" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full rounded-lg border border-[var(--border)]/60 bg-[var(--bg-secondary)] p-2 text-[var(--text-main)] placeholder:text-[var(--text-secondary)]
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-subtle)]"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2">
                <label className="text-[var(--text-main)]" htmlFor="phone">
                  Phone
                </label>
                <input
                  className="w-full rounded-lg border border-[var(--border)]/60 bg-[var(--bg-secondary)] p-2 text-[var(--text-main)] placeholder:text-[var(--text-secondary)]
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-subtle)]"
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  required
                  autoComplete="tel"
                />
              </div>

              {/* Details */}
              <div className="flex flex-col gap-2">
                <label className="text-[var(--text-main)]" htmlFor="details">
                  Details
                </label>
                <textarea
                  className="min-h-28 w-full rounded-lg border border-[var(--border)]/60 bg-[var(--bg-secondary)] p-2 text-[var(--text-main)] placeholder:text-[var(--text-secondary)]
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-subtle)]"
                  id="details"
                  name="details"
                  placeholder="Enter reservation details (players, time window, notes)"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-lg border border-transparent bg-[var(--primary)] px-4 py-2 font-medium text-[var(--text-main)]
                             transition-colors hover:bg-[var(--primary-hover)]
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-subtle)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)]"
                >
                  Reserve
                </button>
                <p className="mt-3 text-sm text-[var(--text-secondary)]">
                  By reserving, you agree to our{" "}
                  <a
                    href="/privacy"
                    className="underline text-[var(--secondary)] hover:text-[var(--secondary-hover)]"
                  >
                    privacy policy
                  </a>
                  .
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ReserveTableDetailPage;
