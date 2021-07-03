import { ethers, Contract } from "ethers";
import PredictionMarket from "./contracts/PredictionMarket2.json";

const getBlockchain = () =>
  new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
      if (window.ethereum) {
        // await window.ethereum.enable();
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          //   .then(handleAccountsChanged)
          .catch((error) => {
            if (error.code === 4001) {
              // EIP-1193 userRejectedRequest error
              console.log("Please connect to MetaMask.");
            } else {
              console.error(error);
            }
          });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();

        const predictionMarket = new Contract(
          PredictionMarket.networks[window.ethereum.networkVersion].address,
          PredictionMarket.abi,
          signer
        );

        resolve({ signerAddress, predictionMarket });
      }
    });
  });

export default getBlockchain;
