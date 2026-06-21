import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface DestinationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  location: string;
  flag: string;
  stats: string;
  href: string;
  themeColor: string; // e.g. "150 50% 25%" — HSL without hsl()
}

const DestinationCard = React.forwardRef<HTMLDivElement, DestinationCardProps>(
  ({ className, imageUrl, location, flag, stats, href, themeColor, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{ "--theme-color": themeColor } as React.CSSProperties}
        className={cn("group w-full h-full", className)}
        {...props}
      >
        <a
          href={href}
          className="relative block w-full h-full rounded-2xl overflow-hidden shadow-lg
                     transition-all duration-500 ease-in-out
                     group-hover:scale-[1.03] group-hover:shadow-[0_0_60px_-15px_hsl(var(--theme-color)/0.6)]"
          aria-label={`Explore ${location}`}
          style={{ boxShadow: `0 0 40px -15px hsl(var(--theme-color) / 0.45)` }}
        >
          {/* Background image with zoom on hover */}
          <div
            className="absolute inset-0 bg-cover bg-center
                       transition-transform duration-700 ease-in-out group-hover:scale-110"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />

          {/* Themed gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, hsl(var(--theme-color) / 0.92), hsl(var(--theme-color) / 0.55) 35%, transparent 65%)`,
            }}
          />

          {/* Content */}
          <div className="relative flex flex-col justify-end h-full p-6 text-white">
            <h3 className="text-3xl font-black leading-tight tracking-tight">
              {location}
              <span className="ml-2 text-2xl">{flag}</span>
            </h3>
            <p className="text-sm text-white/75 mt-1 font-medium">{stats}</p>

            {/* Explore button */}
            <div
              className="mt-6 flex items-center justify-between rounded-xl px-4 py-3
                         backdrop-blur-md
                         transition-all duration-300
                         group-hover:bg-[hsl(var(--theme-color)/0.4)]
                         group-hover:border-[hsl(var(--theme-color)/0.55)]"
              style={{
                background: `hsl(var(--theme-color) / 0.18)`,
                border: `1px solid hsl(var(--theme-color) / 0.28)`,
              }}
            >
              <span className="text-sm font-bold tracking-wide">Explore Now</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </a>
      </div>
    );
  }
);
DestinationCard.displayName = "DestinationCard";

export { DestinationCard };
