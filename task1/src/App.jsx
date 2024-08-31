import { useEffect, useState, useCallback } from "react";
import Web3 from "web3";

const infuraUrl =
  "https://sepolia.infura.io/v3/dd93d90dc8ae4f6d8d022375e9b4200a";
const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));

const App = () => {
  const [block, setBlock] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [calculator, setCalculator] = useState("ether");
  const [loading, setLoading] = useState(false);

  // Fetch the latest block number
  useEffect(() => {
    const fetchBlockNumber = async () => {
      setLoading(true);
      try {
        const blockNumber = await web3.eth.getBlockNumber();
        setBlock(blockNumber);
      } catch (error) {
        console.error("Error fetching block number:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlockNumber();
  }, []);

  // Fetch account details
  const getDetail = useCallback(
    async (address) => {
      if (!address) return;
      console.log("calculattor", calculator);
      setLoading(true);
      try {
        const balance = await web3.eth.getBalance(address);
        const formattedBalance = web3.utils.fromWei(balance, calculator);
        setAccountBalance(formattedBalance);
      } catch (error) {
        console.error("Error fetching account details:", error);
      } finally {
        setLoading(false);
      }
    },
    [calculator]
  );

  // Handle address change
  const handleAddressChange = (e) => {
    const address = e.target.value;
    setWalletAddress(address);
    // Delay fetching balance until user stops typing
    if (address) {
      getDetail(address);
    } else {
      setAccountBalance("");
    }
  };

  // Handle currency unit change
  const handleUnitChange = (e) => {
    const unit = e.target.value;
    setCalculator(unit);
    if (walletAddress) {
      getDetail(walletAddress);
    }
  };

  return (
    <div>
      <h1>First Dapp</h1>
      {loading && <p>Loading...</p>}
      <p>
        {block !== null ? `Block Number: ${block}` : "Fetching block number..."}
      </p>
      <p>
        {accountBalance
          ? `Account Balance in ${calculator}: ${accountBalance}`
          : "Please provide an address to get account balance..."}
      </p>
      <select onChange={handleUnitChange} value={calculator}>
        <option value="ether">ETHER</option>
        <option value="gwei">GWEI</option>
        <option value="wei">WEI</option>
      </select>
      <input
        type="text"
        value={walletAddress}
        onChange={handleAddressChange}
        placeholder="Enter wallet address"
      />
    </div>
  );
};

export default App;
