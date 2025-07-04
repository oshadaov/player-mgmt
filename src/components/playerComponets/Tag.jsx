// src/components/Tag.jsx
import React from "react";

const Tag = ({ label }) => (
  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
    {label}
  </span>
);

export default Tag;
