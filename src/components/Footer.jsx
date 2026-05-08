import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/90 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-1 text-center sm:text-left">
          <p className="text-slate-200">Sports Portal</p>
          <p className="text-xs text-slate-500">
            Manage your club, roster, and fixtures with clarity and style.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 sm:justify-end">
          <button className="transition hover:text-emerald-300">Terms</button>
          <button className="transition hover:text-emerald-300">Privacy</button>
          <button className="transition hover:text-emerald-300">Support</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
