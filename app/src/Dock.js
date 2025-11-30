import { createRef ,useRef } from "react";
import { gsap } from "gsap";

export default function Dock({ activePanel, setActivePanel }) {
  const icons = [
    { id: "new", label: "New Contract", emoji: "📝" },
    { id: "existing", label: "Existing", emoji: "📄" },
  ];

  // Create refs for each icon
  const iconRefs = useRef(icons.map(() => createRef()));

  const handleHover = (index, scale) => {
    gsap.to(iconRefs.current[index].current, {
      scale,
      duration: 0.1,
      ease: "power4.in",
    });
  };

  return (
    <div className="
      fixed bottom-6 left-1/2 -translate-x-1/2
      flex items-end gap-6
      bg-transparent backdrop-blur-xl
      py-4 px-8 border border-white/30 rounded-2xl
      z-50
    ">
      {icons.map((icon, index) => (
        <div
          key={icon.id}
          ref={iconRefs.current[index]}
          onMouseEnter={() => handleHover(index, 1.3)}
          onMouseLeave={() => handleHover(index, 1)}
          onClick={() => setActivePanel(icon.id)}
          className={`
            text-4xl cursor-pointer transition-all select-none
            ${activePanel === icon.id ? "drop-shadow-[0_5px_10px_rgba(5,150,105,1)]" : ""}
          `}
        >
          {icon.emoji}
        </div>
      ))}
    </div>
  );
}
