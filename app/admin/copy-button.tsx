"use client";

import { useState } from "react";

export default function CopyButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
        copied
          ? "bg-[#4d9a51] text-white"
          : "bg-[#2b6fb3] text-white hover:bg-[#245e98]"
      }`}
    >
      {copied ? "Kopiert! ✓" : "Link kopieren"}
    </button>
  );
}
