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
    <section className="border-t border-slate-800 bg-slate-950 py-10">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Upcoming Matches */}
          <div>
            <h2 className="text-xl font-semibold text-slate-50">
              Upcoming Matches
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Stay prepared for the next fixtures.
            </p>

            <div className="mt-4 space-y-3">
              {upcomingMatches.map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm"
                >
                  <div>
                    <p className="font-semibold text-slate-50">
                      {match.home} <span className="text-emerald-400">vs</span>{" "}
                      {match.away}
                    </p>
                    <p className="text-xs text-slate-400">
                      {match.venue}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs text-emerald-300">
                    {match.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Updates */}
          <div>
            <h2 className="text-xl font-semibold text-slate-50">
              Latest Updates
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Recent activity across the portal.
            </p>

            <div className="mt-4 space-y-3">
              {latestUpdates.map((update) => (
                <div
                  key={update.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm"
                >
                  <p className="font-medium text-slate-50">
                    {update.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {update.time}
                  </p>
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
