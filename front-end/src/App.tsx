import { useSDK } from "@metamask/sdk-react";
import { useState, useEffect, useCallback } from "react";


const LINEA_NETWORKS = {
  '0xe708': "Linea",
  '0xe704': "Linea Goerli"
}

const App = () => {
  const [account, setAccount] = useState<string>();
  const [connectToLinea, setConnectedToLinea] = useState<boolean>();
  const { sdk, connected, connecting, provider, chainId } = useSDK();

  const connectToMetamaskProvider = useCallback(async () => {
    try {
      const accounts = await sdk?.connect();
      Array.isArray(accounts) && setAccount(accounts?.[0]);
    } catch (err) {
      console.warn("failed to connect..", err);
    }
  }, [sdk]);

  useEffect(() =>
    setConnectedToLinea(Object.keys(LINEA_NETWORKS).includes(chainId ?? ''))
    , [chainId, connected]
  )

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
      {connectToLinea && account && (
        <div style={{ padding: 10, margin: 10 }}>
          <div>Network details: the gasPrice is 1 WEI</div>
          <p />
          <div>User balance is 0.1 ETH</div>
          <p />
          <div>User has 5 NFTs</div>
        </div>
      )}
    </div>
  );
};


export default App;