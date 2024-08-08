import { useEffect, useState } from "react";
import Web3 from "web3";

const App = () => {
  const infuraUrl =
    "https://sepolia.infura.io/v3/dd93d90dc8ae4f6d8d022375e9b4200a";
  const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));
  const [block, setBlock] = useState(null);
  const [walletAddress, setwalletAddress] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [calculator, setCalculator] = useState("ether");

  useEffect(() => {
    web3.eth
      .getBlockNumber()
      .then((blockNumber) => {
        console.log("Block number:", blockNumber); // Log block number
        setBlock(blockNumber);
      })
      .catch((error) => {
        console.error("Error fetching block number:", error); // Log error
      });
  }, []);
  const getDetail = async (walletAddress) => {
    console.log("wall", walletAddress);
    try {
      const balance = await web3.eth.getBalance(walletAddress);
      console.log("balace", balance);
      const tempaccountBalance = web3.utils.fromWei(balance, calculator);
      console.log("tempcaccountbalace", tempaccountBalance);
      setAccountBalance(tempaccountBalance);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div>
      <h1>First Dapp</h1>
      <p>
        {block !== null ? `Block Number: ${block}` : "Loading block number..."}
      </p>
      <p>
        {accountBalance !== ""
          ? `Account Balance in ether is : ${accountBalance}${calculator}`
          : "please provide any address to get account balance..."}
      </p>
      <select
        onChange={(e) => {
          setCalculator(e.target.value);
          getDetail(walletAddress);
        }}
        value={calculator}
      >
        <option value="ether">ETHER</option>
        <option value="gwei">GWEI</option>
        <option value="wei">WEi</option>
      </select>
      <input
        type="text"
        value={walletAddress}
        onChange={(e) => setwalletAddress(e.target.value)}
      />
      <button onClick={() => getDetail(walletAddress)}>
        Get transaction details
      </button>
    </div>
  );
};

export default App;
