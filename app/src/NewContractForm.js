export default function NewContractForm({ newContract }) {
  return (
    <div
      className="
      w-full max-w-xl bg-transparent border border-white/30
      rounded-2xl px-10 pb-20 pt-14
      backdrop-hue-rotate-15 backdrop-blur-2xl
    ">
      <h1 className="text-2xl text-center font-black mb-8 text-white">
        New Contract
      </h1>

      {/* Arbiter */}
      <label className="flex flex-col mb-6 text-sm text-white font-mono">
        Arbiter Address
        <input
          type="text"
          id="arbiter"
          className="mt-2 bg-white/20 hover:bg-white/30 text-white 
          border border-white/20 rounded-lg px-3 py-2 
          focus:ring-1 focus:ring-white outline-none"
        />
      </label>

      {/* Beneficiary */}
      <label className="flex flex-col mb-6 text-sm text-white font-mono">
        Beneficiary Address
        <input
          type="text"
          id="beneficiary"
          className="mt-2 bg-white/20 hover:bg-white/30 text-white 
          border border-white/20 rounded-lg px-3 py-2 
          focus:ring-1 focus:ring-white outline-none"
        />
      </label>

      {/* Deposit */}
      <label className="flex flex-col text-sm text-white font-mono">
        Deposit Amount (ETH)
        <input
          type="text"
          id="eth"
          className="mt-2 bg-white/20 hover:bg-white/30 text-white 
          border border-white/20 rounded-lg px-3 py-2 
          focus:ring-1 focus:ring-white outline-none"
        />
      </label>

      {/* Deploy button */}
      <div
        onClick={newContract}
        className="
        w-full text-center text-white text-sm
        bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600
        hover:from-indigo-500 hover:via-sky-500 hover:to-emerald-500
        mt-10 py-3 font-semibold rounded-xl cursor-pointer
        transition-all
      ">
        Deploy
      </div>
    </div>
  );
}
