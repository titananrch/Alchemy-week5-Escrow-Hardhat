export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  approved,
  handleApprove,
  userAddress,
}) {
  const isArbiter = userAddress?.toLowerCase() === arbiter.toLowerCase();

  let buttonUI;

  if (approved) {
    buttonUI = (
      <span className="px-5 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm font-semibold">
        ✔ Approved
      </span>
    );
  } else if (isArbiter) {
    buttonUI = (
      <button
        onClick={handleApprove}
        className="w-full py-2 rounded-lg text-sm font-semibold text-center
          bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 cursor-pointer
          hover:from-indigo-500 hover:via-sky-500 hover:to-emerald-500"
      >
        Approve
      </button>
    );
  } else {
    buttonUI = (
      <span className="w-full text-center cursor-not-allowed px-3 py-2 rounded-lg text-sm bg-white/10 text-white/40">
        Waiting for arbiter…
      </span>
    );
  }

  return (
    <div
      className="
      p-4 rounded-xl border border-white/10
      bg-white/5 backdrop-blur-lg
      text-white font-mono
      hover:bg-white/10
    "
    >
      <div className="flex justify-between text-sm mb-2">
        <span className="text-white/60">Sender</span>
        <span>{address}</span>
      </div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-white/60">Arbiter</span>
        <span>{arbiter}</span>
      </div>

      <div className="flex justify-between text-sm mb-2">
        <span className="text-white/60">Beneficiary</span>
        <span>{beneficiary}</span>
      </div>

      <div className="flex justify-between text-sm mb-4">
        <span className="text-white/60">Value (ETH)</span>
        <span>{value}</span>
      </div>
      <div className="flex justify-end items-center pt-3">{buttonUI}</div>
    </div>
  );
}
