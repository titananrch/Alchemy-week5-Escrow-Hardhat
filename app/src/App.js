import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Prism from "./Prism";
import Dock from "./Dock";
import NewContractForm from "./NewContractForm";
import ExistingContracts from "./ExistingContracts";
import PanelWrapper from "./PanelWrapper";
import deploy from "./deploy";
import EscrowArtifact from "./artifacts/contracts/Escrow.sol/Escrow.json";

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [escrows, setEscrows] = useState([]);
  const [activePanel, setActivePanel] = useState("new");
  const [hasRestored, setHasRestored] = useState(false);

  useEffect(() => {
    async function initWallet() {
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }
    initWallet();
  }, []);

  useEffect(() => {
    if (!signer) return;

    async function restoreEscrows() {
      const saved = JSON.parse(localStorage.getItem("escrows") || "[]");

      if (!Array.isArray(saved)) return;

      const restored = await Promise.all(
        saved.map(async (e) => {
          try {
            const contract = new ethers.Contract(
              e.address,
              EscrowArtifact.abi,
              signer
            );

            const arbiter = await contract.arbiter();
            const beneficiary = await contract.beneficiary();
            const isApproved = await contract.isApproved();

            return {
              address: e.address,
              arbiter,
              beneficiary,
              value: e.value,
              approved: isApproved,
              handleApprove: async () => {
                contract.on("Approved", () => {
                  setEscrows((prev) =>
                    prev.map((x) =>
                      x.address === e.address ? { ...x, approved: true } : x
                    )
                  );
                });
                await approve(contract, signer);
              },
            };
          } catch (err) {
            console.error("Restore failed for:", e.address, err);
            return null;
          }
        })
      );

      setEscrows(restored.filter(Boolean));
      setHasRestored(true);
    }

    restoreEscrows();
  }, [signer]);

  useEffect(() => {
    if (!hasRestored) return;

    const minimalData = escrows.map((e) => ({
      address: e.address,
      arbiter: e.arbiter,
      beneficiary: e.beneficiary,
      value: e.value,
      approved: e.approved,
    }));

    localStorage.setItem("escrows", JSON.stringify(minimalData));
  }, [escrows, hasRestored]);

  async function newContract() {
    const beneficiary = document.getElementById("beneficiary").value;
    const arbiter = document.getElementById("arbiter").value;
    const eth = document.getElementById("eth").value;

    const value = ethers.utils.parseEther(eth);

    const escrowContract = await deploy(signer, arbiter, beneficiary, value);

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: eth,
      approved: false,
      handleApprove: async () => {
        escrowContract.on("Approved", () => {
          const elem = document.getElementById(escrowContract.address);
          if (elem) {
            elem.className = "complete";
            elem.innerText = "It's been approved!";
          }
        });

        await approve(escrowContract, signer);
      },
    };

    setEscrows((prev) => [...prev, escrow]);
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      {/* Background */}
      <div className="fixed top-0 left-0 bg-gradient-to-br from-black to-blue-950 w-full h-full -z-50">
        <Prism
          animationType="rotate"
          timeScale={0.3}
          height={7}
          baseWidth={7}
          scale={3}
          hueShift={0}
          colorFrequency={1}
          noise={0}
          glow={1}
        />
      </div>

      {/* Panels */}
      <main className="fixed mt-20 mb-40 w-full flex justify-center">
        <PanelWrapper active={activePanel === "new"} direction="left">
          <NewContractForm newContract={newContract} />
        </PanelWrapper>

        <PanelWrapper active={activePanel === "existing"} direction="right">
          <ExistingContracts escrows={escrows} />
        </PanelWrapper>
      </main>

      {/* Dock */}
      <Dock
        items={[
          { icon: "📝", label: "New", onClick: () => setActivePanel("new") },
          {
            icon: "📄",
            label: "Contracts",
            onClick: () => setActivePanel("existing"),
          },
        ]}
        magnification={90}
        baseItemSize={42}
      />
    </div>
  );
}

export default App;
