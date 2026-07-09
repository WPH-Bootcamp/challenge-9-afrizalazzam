"use client";

import Image from "next/image";
import { useState } from "react";

const FALLBACK_IMAGE = "/images/restaurant-placeholder.png";

export function RestaurantGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const gallery = images.length > 0 ? images : [FALLBACK_IMAGE];

  return (
    <div>
      {/* Mobile: single-image carousel */}
      <div className="sm:hidden">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100">
          <Image
            src={gallery[activeIndex]}
            alt={`${name} ${activeIndex + 1}`}
            fill
            priority={activeIndex === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
        {gallery.length > 1 && (
          <div className="mt-3 flex justify-center gap-2">
            {gallery.map((image, index) => (
              <button
                key={image + index}
                type="button"
                aria-label={`Lihat foto ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`h-2 w-2 rounded-full transition ${
                  index === activeIndex ? "bg-primary-100" : "bg-neutral-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: big image + smaller grid */}
      <div className="hidden gap-3 sm:grid sm:grid-cols-2 sm:grid-rows-2">
        <div className="relative row-span-2 aspect-square overflow-hidden rounded-2xl bg-neutral-100 sm:aspect-auto">
          <Image
            src={gallery[0]}
            alt={`${name} 1`}
            fill
            priority
            sizes="(max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-neutral-100">
          <Image
            src={gallery[1] ?? gallery[0]}
            alt={`${name} 2`}
            fill
            sizes="(max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
            <Image
              src={gallery[2] ?? gallery[0]}
              alt={`${name} 3`}
              fill
              sizes="(max-width: 1024px) 25vw, 17vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
            <Image
              src={gallery[3] ?? gallery[0]}
              alt={`${name} 4`}
              fill
              sizes="(max-width: 1024px) 25vw, 17vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
