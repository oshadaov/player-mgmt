import React from "react";
import FeaturesBg from "../assets/back.jpg" 

const FeaturesSection = () => {
  return (
     <section
      id="features"
      className="border-t border-slate-800 bg-slate-950 py-10"
      style={{
        backgroundImage: `linear-gradient(rgba(5, 10, 30, 0.35), rgba(5, 10, 30, 0.7)), url(${FeaturesBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold md:text-3xl">
            Everything you need in one portal
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Built for players, clubs, and coaches to stay organised and connected.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Players */}
          <FeatureCard
            icon="🧑‍💼"
            title="For Players"
            description="Create your profile, connect with clubs, and showcase your skills and stats."
            items={[
              "Centralised player profile",
              "Track fixtures and performance",
              "Stay updated on club activities",
            ]}
          />

          {/* Clubs */}
          <FeatureCard
            icon="🏟️"
            title="For Clubs"
            description="Manage your squad, fixtures, and communication with players in one system."
            items={[
              "Register and manage clubs",
              "Maintain squad & staff details",
              "Communicate with players easily",
            ]}
          />

          {/* Coaches */}
          <FeatureCard
            icon="📊"
            title="For Coaches"
            description="Keep an eye on player availability, injuries, and match preparation."
            items={[
              "Monitor player status",
              "Prepare for upcoming fixtures",
              "Make better squad decisions",
            ]}
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description, items }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-emerald-500/20">
    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-lg">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-slate-50">{title}</h3>
    <p className="mt-2 text-sm text-slate-400">{description}</p>
    <ul className="mt-3 space-y-1 text-xs text-slate-300">
      {items.map((item) => (
        <li key={item}>• {item}</li>
      ))}
    </ul>
  </div>
);

export default FeaturesSection;
