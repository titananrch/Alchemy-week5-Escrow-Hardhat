import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function PanelWrapper({ active, children, direction }) {
  const ref = useRef(null);

  useEffect(() => {
    if (active) {
      // ENTER animation
      gsap.fromTo(
        ref.current,
        {
          opacity: 0,
          x: direction === "left" ? -60 : 60,
          pointerEvents: "none",
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.45,
          ease: "power3.out",
          pointerEvents: "auto",
        }
      );
    } else {
      // EXIT animation
      gsap.to(ref.current, {
        opacity: 0,
        x: direction === "left" ? 60 : -60,
        duration: 0.35,
        ease: "power3.in",
        pointerEvents: "none",
      });
    }
  }, [active, direction]);

  return (
    <div
      ref={ref}
      className="absolute w-full flex justify-center"
      style={{
        visibility: active ? "visible" : "hidden",
      }}
    >
      {children}
    </div>
  );
}
