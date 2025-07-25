import { ComponentPropsWithoutRef, CSSProperties, FC, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface AnimatedShinyTextProps extends ComponentPropsWithoutRef<"span"> {
  shimmerWidth?: number;
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 500,
  ...props
}) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame: number;
    let pos = -shimmerWidth;
    const animate = () => {
      if (ref.current) {
        ref.current.style.backgroundPosition = `${pos}px 0`;
        pos += 1;
        if (pos > shimmerWidth * 10) pos = -shimmerWidth;
      }
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [shimmerWidth]);

  return (
    <span
      ref={ref}
      style={{
        backgroundImage:
          "linear-gradient(90deg, orange, rgba(0,0,0,0.75) 50%, transparent)",
        backgroundSize: `${shimmerWidth}px 100%`,
        WebkitBackgroundClip: "text",
        color: "transparent",
        display: "inline-block",
      } as CSSProperties}
      className={cn(
        "mx-auto max-w-md text-orange-900/70 dark:text-neutral-900",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
