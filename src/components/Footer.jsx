import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-xs text-slate-500 md:flex-row">
        <p>
          © {new Date().getFullYear()} Sports Portal. All rights reserved.
        </p>
        <div className="flex gap-4">
          <button className="hover:text-emerald-300">
            Terms
          </button>
          <button className="hover:text-emerald-300">
            Privacy
          </button>
          <button className="hover:text-emerald-300">
            Support
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
