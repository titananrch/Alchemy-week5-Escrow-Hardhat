import Escrow from "./Escrow";

export default function ExistingContracts({ escrows }) {
  return (
    <div
      className="
      w-full max-w-xl bg-transparent border border-white/30
      rounded-2xl px-6 pb-10 pt-14
      backdrop-hue-rotate-15 backdrop-blur-2xl
      min-h-[500px]
      flex flex-col
    ">
      <h1 className="text-2xl text-center font-black mb-8 text-white">
        Existing Contracts
      </h1>

      {/* Scrollable content area */}
      <div
        className="
        flex-1 overflow-y-auto pr-2
        space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent
      ">
        {escrows.length === 0 && (
          <div className="text-center text-white/50 italic py-20">
            No contracts deployed yet…
          </div>
        )}

        {escrows.map((escrow) => (
          <Escrow key={escrow.address} {...escrow} />
        ))}
      </div>
    </div>
  );
}
