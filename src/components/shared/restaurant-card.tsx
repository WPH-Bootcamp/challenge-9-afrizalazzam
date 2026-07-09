"use client";

import Image from "next/image";
import { useState } from "react";

type RestaurantCardProps = {
  name: string;
  rating: number;
  location: string;
  distance?: string;
  logo: string;
};

const FALLBACK_LOGO = "/images/restaurant-placeholder.png";

export function RestaurantCard({
  name,
  rating,
  location,
  distance,
  logo,
}: RestaurantCardProps) {
  const [imgSrc, setImgSrc] = useState(logo);

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
        <Image
          src={imgSrc}
          alt={name}
          fill
          sizes="64px"
          className="object-cover"
          onError={() => setImgSrc(FALLBACK_LOGO)}
        />
      </div>
      <div className="min-w-0">
        <h3 className="truncate font-semibold text-neutral-900">{name}</h3>
        <div className="mt-1 flex items-center gap-1 text-sm text-neutral-700">
          <StarIcon />
          <span>{rating}</span>
        </div>
        <p className="mt-1 truncate text-sm text-neutral-500">
          {location}
          {distance ? ` · ${distance}` : ""}
        </p>
      </div>
    </div>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-accent-yellow">
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.2 22 12 18.27 5.8 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
    </svg>
  );
}
