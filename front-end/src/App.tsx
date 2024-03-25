import { useSDK } from "@metamask/sdk-react";
import { useState, useEffect, useCallback } from "react";


const LINEA_NETWORKS = {
  '0xe708': "Linea",
  '0xe704': "Linea Goerli"
}

const App = () => {
  const [account, setAccount] = useState<string>();
  const [connectToLinea, setConenctedToLinea] = useState<boolean>();
  const { sdk, connected, connecting, provider, chainId } = useSDK();

  const connectToMetamaskProvider = useCallback(async () => {
    try {
      const accounts = await sdk?.connect();
      Array.isArray(accounts) && setAccount(accounts?.[0]);
    } catch (err) {
      console.warn("failed to connect..", err);
    }
  }, [sdk, setAccount]);

  useEffect(() =>
    setConenctedToLinea(Object.keys(LINEA_NETWORKS).includes(chainId ?? ''))

    , [chainId, connected]
  )

  return (
    <div className="App">
      <button style={{ padding: 10, margin: 10 }} onClick={connectToMetamaskProvider}>
        Connect
      </button>
      <div style={{ padding: 10, margin: 10 }}>
        {connectToLinea ? (
          <div >
            <>
              {`Connected chain: ${chainId === Object.keys(LINEA_NETWORKS)[0] ? Object.values(LINEA_NETWORKS)[0] : Object.values(LINEA_NETWORKS)[1]}`}
              <p></p>
              {account ? `Connected account: ${account}` : 'Please, click on Connect button'}
            </>
          </div>
        ) :
          (connected ?
            <div>
              You're on the wrong on Linea or Linea Goerli Network. Please, swith to one of these two.
            </div>
            :
            <div>
              Please, connect your wallet to either Linea or Linea Goerli network
            </div>
          )
        }
      </div>
      {connectToLinea && account &&
        <button style={{ padding: 10, margin: 10 }} onClick={() => console.log(() => 'asdf')}>
          Get address details
        </button>
      }
    </div>
  );
};

export default App;