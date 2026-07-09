"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function HomeSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/resto?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 rounded-full bg-white px-5 py-4 shadow-lg"
    >
      <SearchIcon />
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search restaurants, food and drink"
        className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
      />
    </form>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0 text-neutral-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
