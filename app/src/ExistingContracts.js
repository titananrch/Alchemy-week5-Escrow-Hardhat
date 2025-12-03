import Escrow from "./Escrow";

export default function ExistingContracts({ escrows }) {
  return (
    <div
      className="
      w-full max-w-xl
      bg-transparent border border-white/30
      rounded-2xl
      backdrop-hue-rotate-15 backdrop-blur-2xl
      h-[75vh]
      flex flex-col
      mx-auto
      relative
    "
    >
      {/* Header */}
      <div className="rounded-t-2xl bg-white/10 backdrop-blur-2xl py-6 px-8 shrink-0">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Deployed Contract Registry
        </h1>
        <p className="text-md text-white/60 font-light mt-1">
          Browse on-chain contract entries and manage approvals.
        </p>
      </div>
      {/* Scrollable content */}
      <div
        className="
          flex-1
          h-full
          overflow-y-auto pr-2 mx-2 my-2
          rounded-xl
          space-y-4
          scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent
        "
      >
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
