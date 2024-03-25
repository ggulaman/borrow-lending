import { useSDK } from "@metamask/sdk-react";
import { useState, useEffect, useCallback } from "react";
import { fetchUserBalance, fetchUserERC20Balance, fetchUserERC721Balance } from "./api";

const LINEA_NETWORKS = {
  '0xe708': "Linea",
  '0xe704': "Linea Goerli"
}

const App = () => {
  const [account, setAccount] = useState<string>();
  const [connectToLinea, setConnectedToLinea] = useState<boolean>();
  const [network, setNetwork] = useState<'linea' | 'linea-goerli'>('linea');
  const { sdk, connected, chainId } = useSDK();
  const [userEthBalance, setUserEthBalance] = useState<number | null>(null); // State to hold user balance
  const [erc20Address, setERC20Address] = useState<string>(''); // State to hold ERC20 token address
  const [erc20Balance, setERC20Balance] = useState<number | null>(null); // State to hold ERC20 token balance
  const [erc721Address, setERC721Address] = useState<string>(''); // State to hold ERC721 token address
  const [erc721Balance, setERC721Balance] = useState<number | null>(null); // State to hold ERC721 token balance
  const connectToMetamaskProvider = useCallback(async () => {
    try {
      const accounts = await sdk?.connect();
      Array.isArray(accounts) && setAccount(accounts?.[0]);
    } catch (err) {
      console.warn("failed to connect..", err);
    }
  }, [sdk]);

  const handleFetchERC20Balance = useCallback(async () => {
    try {
      if (erc20Address && account && network) {
        const balance = await fetchUserERC20Balance(account, network, erc20Address);
        setERC20Balance(balance);
      }
    } catch (error) {
      console.error("Error fetching ERC20 balance:", error);
    }
  }, [erc20Address, account, network]);


  const handleFetchERC721Balance = useCallback(async () => {
    try {
      if (erc721Address && account && network) {
        const balance = await fetchUserERC721Balance(account, network, erc721Address);
        setERC721Balance(balance);
      }
    } catch (error) {
      console.error("Error fetching ERC721 balance:", error);
    }
  }, [erc721Address, account, network]);

  useEffect(() => {
    setConnectedToLinea(Object.keys(LINEA_NETWORKS).includes(chainId ?? ''))
    Object.keys(LINEA_NETWORKS).includes(chainId ?? '') && setNetwork(chainId === '0xe708' ? 'linea' : 'linea-goerli');
  }, [chainId, connected]
  )

  useEffect(() => {
    // Fetch user balance if connected to Linea and account is set
    if (connectToLinea && account) {
      fetchUserBalance(account, network)
        .then(balance => setUserEthBalance(balance))
        .catch(error => console.error("Error fetching user balance:", error));
    } else {
      setUserEthBalance(null); // Reset user balance if not connected to Linea or account is not set
    }
  }, [connectToLinea, account]);


  return (
    <div className="App">
      <button style={{ padding: 10, margin: 10 }} onClick={connectToMetamaskProvider}>
        Connect
      </button>
      <div style={{ padding: 10, margin: 10 }}>
        {connectToLinea ? (
          <>
            <div>{`Connected chain: ${Object.keys(LINEA_NETWORKS) ? Object.values(LINEA_NETWORKS)[0] : Object.values(LINEA_NETWORKS)[1]}`}</div>
            <p />
            <div>{account ? `Connected account: ${account}` : 'Please, click on Connect button'}</div>
          </>
        ) : connected ? (
          <div>You're on the wrong network. Please switch to Linea or Linea Goerli.</div>
        ) : (
          <div>Please connect your wallet to either Linea or Linea Goerli network.</div>
        )}
      </div>
      {account && connectToLinea &&
        <div style={{ padding: 10, margin: 10 }}>
          <div>{`User balance is ${userEthBalance} ETH`}</div>
          <br />
          <br />
          <br />
          <div>
            <button style={{ padding: 10, margin: 10 }} onClick={handleFetchERC20Balance}>
              Get ERC20 Balance
            </button>
            <input
              type="text"
              placeholder="Enter ERC20 address"
              value={erc20Address}
              onChange={(e) => setERC20Address(e.target.value)}
            />

            <p>{erc20Balance ? `User ERC20 balance is ${erc20Balance}` : 'User ERC20 balance is 0'}</p>
            <br />
            <br />
            <br />
            <button style={{ padding: 10, margin: 10 }} onClick={handleFetchERC721Balance}>
              Get ERC721 Balance
            </button>
            <input
              type="text"
              placeholder="Enter ERC721 address"
              value={erc721Address}
              onChange={(e) => setERC721Address(e.target.value)}
            />

            <p>{erc721Balance ? `User ERC721 balance is ${erc721Balance}` : 'User ERC721 balance is 0'}</p>
          </div>
        </div>
      }


    </div>
  );
};


export default App;