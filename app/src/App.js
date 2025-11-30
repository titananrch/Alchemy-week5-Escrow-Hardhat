import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Prism from './Prism';
import Dock from './Dock';
import NewContractForm from './NewContractForm';
import ExistingContracts from './ExistingContracts';
import deploy from './deploy';

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [escrows, setEscrows] = useState([]);
  const [activePanel, setActivePanel] = useState("new");

  useEffect(() => {
    async function initWallet() {
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }
    initWallet();
  }, []);

  // --- Create a new contract instance ---
  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const eth = document.getElementById('eth').value;

    const value = ethers.utils.parseEther(eth); 

    const escrowContract = await deploy(signer, arbiter, beneficiary, value);

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: eth,
      handleApprove: async () => {
        escrowContract.on("Approved", () => {
          document.getElementById(escrowContract.address).className = "complete";
          document.getElementById(escrowContract.address).innerText =
            "It's been approved!";
        });

        await approve(escrowContract, signer);
        console.log(account);
      },
    };

    setEscrows((prev) => [...prev, escrow]);
  }

  // --- Render ---
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
      <main className="mt-20 mb-40 w-full flex justify-center px-6">
        
        {activePanel === "new" && (
          <NewContractForm newContract={newContract} />
        )}

        {activePanel === "existing" && (
          <ExistingContracts escrows={escrows} />
        )}
      </main>

      {/* Dock */}
      <Dock activePanel={activePanel} setActivePanel={setActivePanel} />

    </div>
  );
}

export default App;
