import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const exploreLinks = [
  "All Food",
  "Nearby",
  "Discount",
  "Best Seller",
  "Delivery",
  "Lunch",
];

const helpLinks = [
  "How to Order",
  "Payment Methods",
  "Track My Order",
  "FAQ",
  "Contact Us",
];

const socials: { label: string; icon: ReactNode }[] = [
  { label: "Facebook", icon: <FacebookIcon /> },
  { label: "Instagram", icon: <InstagramIcon /> },
  { label: "LinkedIn", icon: <LinkedinIcon /> },
  { label: "TikTok", icon: <TiktokIcon /> },
];

export function Footer() {
  return (
    <footer className="bg-neutral-950 px-6 py-12 text-white sm:px-12">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-3">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Foody logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-2xl font-bold">Foody</span>
          </Link>

          <p className="mt-4 max-w-sm text-sm text-white/70">
            Enjoy homemade flavors &amp; chef&apos;s signature dishes, freshly
            prepared every day. Order online or visit our nearest branch.
          </p>

          <h3 className="mt-8 text-sm font-semibold">Follow on Social Media</h3>
          <div className="mt-3 flex items-center gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 lg:contents">
          <div>
            <h3 className="text-sm font-semibold">Explore</h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-white/70">
              {exploreLinks.map((label) => (
                <li key={label}>
                  <a href="#" className="transition hover:text-white">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Help</h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-white/70">
              {helpLinks.map((label) => (
                <li key={label}>
                  <a href="#" className="transition hover:text-white">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
      <path d="M13.5 9H15V6.5h-1.5C11.6 6.5 10 8.1 10 10.2V12H8v2.5h2V21h2.5v-6.5H15l.5-2.5h-3v-1.6c0-.6.4-1.4 1-1.4Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="white"
      strokeWidth="1.8"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="17" cy="7" r="1" fill="white" stroke="none" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
      <path d="M6.94 8.5H4.06V20h2.88V8.5ZM5.5 4a1.75 1.75 0 1 0 0 3.5A1.75 1.75 0 0 0 5.5 4ZM20 13.3c0-3-1.6-4.4-3.75-4.4a3.24 3.24 0 0 0-2.94 1.62V8.5H10.4c.04.86 0 11.5 0 11.5h2.9v-6.42c0-.34.02-.68.12-.93.28-.68.9-1.4 1.96-1.4 1.38 0 1.94 1.06 1.94 2.6V20H20v-6.7Z" />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
      <path d="M16.5 3c.3 1.9 1.5 3.4 3.5 3.7v2.6c-1.3 0-2.5-.4-3.5-1.1v6.4a5.4 5.4 0 1 1-4.6-5.3v2.7a2.7 2.7 0 1 0 1.9 2.6V3h2.7Z" />
    </svg>
  );
}
