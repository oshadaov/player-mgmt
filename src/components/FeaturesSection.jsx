import React from "react";
import FeaturesBg from "../assets/back.jpg";

const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="border-t border-slate-800 bg-slate-950/90 py-14"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(8, 15, 32, 0.94), rgba(10, 14, 21, 0.98)), url(${FeaturesBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
            What the portal delivers
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-50 sm:text-4xl">
            Powerful club and player tools for every team.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
            Designed to keep your roster, fixtures and performance analytics
            elegant, responsive and easy to use from phone to desktop.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon="🧑‍💼"
            title="For Players"
            description="Build a standout profile, connect with clubs, and manage your availability."
            items={[
              "Performance tracking",
              "Match & availability updates",
              "Profile and skill showcase",
            ]}
          />

          <FeatureCard
            icon="🏟️"
            title="For Clubs"
            description="Run your squad, fixtures, and communications in one beautiful dashboard."
            items={[
              "Player registration",
              "Squad and fixture management",
              "Club approvals and updates",
            ]}
          />

          <FeatureCard
            icon="📊"
            title="For Coaches"
            description="Plan matchday lineups, review player form, and keep the squad informed."
            items={[
              "Availability insights",
              "Injury and training notes",
              "Team readiness overview",
            ]}
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description, items }) => (
  <div className="rounded-[2rem] border border-slate-800/80 bg-gradient-to-br from-slate-900/90 via-slate-950/80 to-slate-900/95 p-6 shadow-2xl shadow-slate-950/20 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-emerald-500/20">
    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-500/15 text-lg">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-slate-50">{title}</h3>
    <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
    <ul className="mt-5 space-y-2 text-sm text-slate-300">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2">
          <span className="text-emerald-400">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default FeaturesSection;
