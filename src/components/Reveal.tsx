import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";
import { cn } from "../utils/cn";

/** Generic scroll reveal. */
export function Reveal({
  children,
  className,
  delay = 0,
  as,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.13, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn("reveal", on && "is-visible", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

/**
 * Holographic depth reveal — panels materialise out of Z space
 * (translateZ + rotateX) rather than just fading up.
 */
export function HoloIn({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -4% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn("holo-in", on && "arrived", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

/** Section header with tracking ID, callsign and status LED. */
export function DeckHeader({
  tracking,
  channel,
  title,
  accent,
  intro,
}: {
  tracking: string;
  channel: string;
  title: string;
  accent?: string;
  intro?: string;
}) {
  return (
    <div className="max-w-2xl">
      <Reveal className="eyebrow">
        <span className="text-ink3">{tracking}</span>
        <span aria-hidden className="h-px w-7 bg-line2" />
        {channel}
        <span aria-hidden className="led h-1.5 w-1.5 rounded-full bg-bio" />
      </Reveal>
      <Reveal delay={70}>
        <h2 className="mt-4 font-display text-[clamp(1.8rem,1.1rem+2.7vw,3rem)] font-bold leading-[1.08] tracking-tight text-ink">
          {title} {accent && <span className="text-bio">{accent}</span>}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={130}>
          <p className="mt-4 text-[15px] leading-relaxed text-ink2">{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
