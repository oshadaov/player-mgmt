import React from "react";

const ActivitySection = () => {
  const upcomingMatches = [
    {
      id: 1,
      home: "Eagle FC",
      away: "Tiger United",
      date: "Sun 19:30",
      venue: "Main Stadium",
    },
    {
      id: 2,
      home: "City Lions",
      away: "Green Rovers",
      date: "Wed 17:00",
      venue: "Training Ground",
    },
  ];

  const latestUpdates = [
    {
      id: 1,
      title: "New player trial window opened",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Eagle FC added 3 new players",
      time: "Yesterday",
    },
    {
      id: 3,
      title: "Matchday schedule updated for next week",
      time: "2 days ago",
    },
  ];

  return (
    <section className="border-t border-slate-800 bg-slate-950 py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
            Live portal activity
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-50 sm:text-4xl">
            Match updates and team news in one place.
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-800/90 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-50">
                  Upcoming Matches
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Stay prepared for the next fixtures.
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-2 text-xs uppercase tracking-[0.25em] text-emerald-200">
                Coming soon
              </span>
            </div>
            <div className="mt-6 space-y-4">
              {upcomingMatches.map((match) => (
                <div
                  key={match.id}
                  className="rounded-3xl border border-slate-800/90 bg-slate-950/70 p-4 transition hover:-translate-y-0.5"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-slate-50">
                        {match.home}
                        <span className="mx-2 text-emerald-300">vs</span>
                        {match.away}
                      </p>
                      <p className="text-sm text-slate-400">{match.venue}</p>
                    </div>
                    <span className="rounded-full bg-slate-800/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                      {match.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800/90 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-50">
                  Latest Updates
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Recent activity across the portal.
                </p>
              </div>
              <span className="rounded-full bg-sky-500/15 px-3 py-2 text-xs uppercase tracking-[0.25em] text-sky-200">
                Newsfeed
              </span>
            </div>
            <div className="mt-6 space-y-4">
              {latestUpdates.map((update) => (
                <div
                  key={update.id}
                  className="rounded-3xl border border-slate-800/90 bg-slate-950/70 p-4"
                >
                  <p className="font-medium text-slate-50">{update.title}</p>
                  <p className="mt-2 text-xs text-slate-400">{update.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActivitySection;
