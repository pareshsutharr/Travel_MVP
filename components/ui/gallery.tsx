"use client";

import { Ref, forwardRef, useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { motion, useMotionValue } from "framer-motion";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* ─── Types ───────────────────────────────────────────────── */
export type Testimonial = {
  id: string;
  name: string;
  role?: string | null;
  location: string;
  destination: string;
  quote: string;
  rating: number;
  avatar_url: string;
};

type Direction = "left" | "right";

/* ─── Fixed fan positions for up to 5 photos ─────────────── */
const POSITIONS: Array<{
  x: string;
  y: string;
  zIndex: number;
  direction: Direction;
  order: number;
}> = [
  { x: "-320px", y: "15px", zIndex: 50, direction: "left",  order: 0 },
  { x: "-160px", y: "32px", zIndex: 40, direction: "left",  order: 1 },
  { x:    "0px", y:  "8px", zIndex: 30, direction: "right", order: 2 },
  { x:  "160px", y: "22px", zIndex: 20, direction: "right", order: 3 },
  { x:  "320px", y: "44px", zIndex: 10, direction: "left",  order: 4 },
];

/* ─── MotionImage helper ──────────────────────────────────── */
const MotionImage = motion(
  forwardRef(function NextImage(
    props: ImageProps,
    ref: Ref<HTMLImageElement>
  ) {
    return <Image ref={ref} {...props} />;
  })
);

/* ─── Individual draggable photo ─────────────────────────── */
function getRandomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function Photo({
  src,
  alt,
  className,
  direction,
  width,
  height,
  isSelected,
  onClick,
}: {
  src: string;
  alt: string;
  className?: string;
  direction?: Direction;
  width: number;
  height: number;
  isSelected?: boolean;
  onClick?: () => void;
}) {
  const [rotation, setRotation] = useState(0);
  const x = useMotionValue(200);
  const y = useMotionValue(200);

  useEffect(() => {
    setRotation(getRandomInRange(1, 4) * (direction === "left" ? -1 : 1));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileTap={{ scale: 1.2, zIndex: 9999 }}
      whileHover={{ scale: 1.1, rotateZ: 2 * (direction === "left" ? -1 : 1), zIndex: 9999 }}
      whileDrag={{ scale: 1.1, zIndex: 9999 }}
      initial={{ rotate: 0 }}
      animate={{ rotate: rotation }}
      onClick={onClick}
      style={{
        width,
        height,
        perspective: 400,
        zIndex: 1,
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        touchAction: "none",
      }}
      className={cn(
        "relative mx-auto shrink-0 cursor-grab active:cursor-grabbing",
        className
      )}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(200); y.set(200); }}
      draggable={false}
      tabIndex={0}
    >
      <div
        className={cn(
          "relative h-full w-full overflow-hidden rounded-3xl shadow-md transition-all duration-300",
          isSelected && "ring-4 ring-[#D4AF35] ring-offset-2 shadow-[0_0_30px_rgba(212,175,53,0.45)]"
        )}
      >
        <MotionImage
          className="rounded-3xl object-cover"
          fill
          src={src}
          alt={alt}
          draggable={false}
        />
      </div>
    </motion.div>
  );
}

/* ─── Main exported component ─────────────────────────────── */
export function TestimonialGallery({
  testimonials,
  animationDelay = 0.5,
}: {
  testimonials: Testimonial[];
  animationDelay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(testimonials[0]?.id ?? "");

  useEffect(() => {
    const v = setTimeout(() => setIsVisible(true), animationDelay * 1000);
    const a = setTimeout(() => setIsLoaded(true), (animationDelay + 0.4) * 1000);
    return () => { clearTimeout(v); clearTimeout(a); };
  }, [animationDelay]);

  const displayPhotos = testimonials.slice(0, 5).map((t, i) => ({
    ...POSITIONS[i],
    id: t.id,
    src: t.avatar_url,
    name: t.name,
  }));

  const selected = testimonials.find((t) => t.id === selectedId) ?? testimonials[0];

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const photoVariants = {
    hidden: () => ({ x: 0, y: 0, rotate: 0, scale: 1 }),
    visible: (custom: { x: string; y: string; order: number }) => ({
      x: custom.x,
      y: custom.y,
      rotate: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 70,
        damping: 12,
        mass: 1,
        delay: custom.order * 0.15,
      },
    }),
  };

  return (
    <div className="relative mt-8">
      {/* Subtle grid background */}
      <div className="absolute inset-0 max-md:hidden top-[180px] -z-10 h-[300px] w-full bg-[linear-gradient(to_right,#BFDDE7_1px,transparent_1px),linear-gradient(to_bottom,#BFDDE7_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Eyebrow */}
      <p className="my-2 text-center text-[11px] font-bold uppercase tracking-[0.22em] text-[#D4AF35]">
        A Journey Through Visual Stories
      </p>

      {/* Heading */}
      <h3 className="z-20 mx-auto max-w-2xl text-center py-2 text-[clamp(32px,5vw,60px)] font-black leading-tight text-[#2D2F33]">
        What Our{" "}
        <span className="text-[#D4AF35]">Travelers Say</span>
      </h3>

      {/* Hint text */}
      <p className="text-center text-[13px] text-[#6B7A80] mt-2">
        Click any photo to read their story
      </p>

      {/* Photo fan */}
      <div className="relative mb-8 h-[350px] w-full items-center justify-center lg:flex">
        <motion.div
          className="relative mx-auto flex w-full max-w-7xl justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className="relative flex w-full justify-center"
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            <div className="relative h-[220px] w-[220px]">
              {[...displayPhotos].reverse().map((photo) => (
                <motion.div
                  key={photo.id}
                  className="absolute left-0 top-0"
                  style={{ zIndex: photo.zIndex }}
                  variants={photoVariants}
                  custom={{ x: photo.x, y: photo.y, order: photo.order }}
                >
                  <Photo
                    width={220}
                    height={220}
                    src={photo.src}
                    alt={photo.name}
                    direction={photo.direction}
                    isSelected={selectedId === photo.id}
                    onClick={() => setSelectedId(photo.id)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Active testimonial card */}
      {selected && (
        <div className="mx-auto max-w-2xl px-4">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="rounded-3xl bg-white border border-[#BFDDE7] shadow-[0_8px_40px_rgba(45,47,51,0.08)] p-8"
          >
            {/* Stars */}
            <div className="flex gap-1 mb-5">
              {Array.from({ length: selected.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-[#D4AF35] text-[#D4AF35]" />
              ))}
            </div>

            {/* Decorative quote mark */}
            <div
              className="text-[70px] font-black leading-none text-[#D4AF35] -mt-4 -mb-4 select-none"
              style={{ opacity: 0.12 }}
              aria-hidden
            >
              &ldquo;
            </div>

            {/* Quote */}
            <p
              className="text-lg italic leading-[1.85] text-[#2D2F33]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {selected.quote}
            </p>

            {/* Author row */}
            <div className="mt-6 flex items-center gap-3 border-t border-[#F0F4F5] pt-5">
              <img
                src={selected.avatar_url}
                alt={selected.name}
                className="h-12 w-12 rounded-full border-2 border-[#D4AF35] object-cover"
              />
              <div>
                <p className="font-bold text-[#2D2F33]">{selected.name}</p>
                <p className="text-[13px] text-[#6B7A80]">
                  {selected.destination}
                  {selected.location ? ` · ${selected.location}` : ""}
                </p>
                {selected.role && (
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#D4AF35] mt-0.5">
                    {selected.role}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Dot indicators */}
          <div className="mt-5 flex items-center justify-center gap-2">
            {testimonials.slice(0, 5).map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedId(t.id)}
                aria-label={`Select ${t.name}`}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  t.id === selectedId ? "w-6 bg-[#D4AF35]" : "w-2 bg-[#BFDDE7] hover:bg-[#D4AF35]/50"
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="flex w-full justify-center mt-8">
        <Button className="rounded-full font-bold px-8 py-2.5">
          View All Stories
        </Button>
      </div>
    </div>
  );
}

/* Keep PhotoGallery export for backwards-compatibility */
export const PhotoGallery = TestimonialGallery;
