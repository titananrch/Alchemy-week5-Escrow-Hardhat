export default function Toast({ message, show }) {
  return (
    <div
      className={`
        fixed top-4 left-1/2 transform -translate-x-1/2
        px-4 py-2 rounded-lg text-white text-sm
        backdrop-blur-xl bg-white/10 border border-white/20
        transition-all duration-500
        ${show ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}
      `}
    >
      {message}
    </div>
  );
}
