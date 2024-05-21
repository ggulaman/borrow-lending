import { useSDK } from "@metamask/sdk-react";
import { useState, useEffect, useCallback } from "react";
import { fetchUserBalance, fetchUserDepositedNFT, fetchUserOwnsNFT, fetchNFTAvailable, fetchUserHasERC721Allowance, fetchUserHasERC20Allowance } from "./api";
import { ethers, BrowserProvider, Eip1193Provider } from "ethers";
import { useWeb3 } from './hooks/useWeb3';

const LINEA_NETWORKS = {
  // '0xe708': "Linea",
  '0xe705': "Linea Sepolia",
  //'0xaa36a7': "Sepolia"
}

const App = () => {
  // state
  const [account, setAccount] = useState<string>();
  const [provider, setProvider] = useState<BrowserProvider>();
  const [connectToLinea, setConnectedToLinea] = useState<boolean>();
  const [network, setNetwork] = useState<'linea-sepolia'>('linea-sepolia');
  const { sdk, connected, chainId } = useSDK();
  const [userDepositedNFT, setUserDepositedNFT] = useState<boolean>(false);
  const [userOwnsNFT, setUserOwnsNFT] = useState<boolean>(false);
  const [isNFTAvailable, setIsNFTAvailable] = useState<boolean>(false);
  const [isERC721Allowance, setIsERC721Allowance] = useState<boolean>(false);
  const [isERC20Allowance, setIsERC20Allowance] = useState<boolean>(false);

  const { mintNFT, approveNFTTransfer, depositNFT, approveERC20Transfer, depositERC20 } = useWeb3();

  const connectToMetamaskProvider = useCallback(async () => {
    try {
      const accounts = await sdk?.connect();
      Array.isArray(accounts) && setAccount(accounts?.[0]);
      setProvider(new ethers.BrowserProvider(window.ethereum as Eip1193Provider));
    } catch (err) {
      console.warn("failed to connect..", err);
    }
  }, [sdk]);

  // callbacks
  const callMintNFT = async () => {
    provider && await mintNFT(provider);
    account && fetchUserOwnsNFT(account)
      .then(userOwnsNFT =>
        setUserOwnsNFT(!!userOwnsNFT)
      )
      .catch(
        error => console.error("Error fetching if user owns NFT:", error)
      )
  }

  const callApproveNFTTransfer = async () => {
    provider && await approveNFTTransfer(provider);
    account && fetchUserHasERC721Allowance(account)
      .then(allowance =>
        setIsERC721Allowance(!!allowance)
      )
      .catch(
        error => console.error("Error fetching fetchUserHasERC721Allowance:", error)
      )
  }

  const callDepositNFT = async () => {
    provider && await depositNFT(provider);
    account && setUserOwnsNFT(false);
    account && setIsERC20Allowance(false);
    account && fetchUserDepositedNFT(account)
      .then(userDepositedNFT =>
        setUserDepositedNFT(!!userDepositedNFT)
      )
      .catch(
        error => console.error("Error fetching if user deposited NFT:", error)
      )
  }

  const callApproveERC20Transfer = async () => {
    provider && await approveERC20Transfer(provider);
    account && fetchUserHasERC20Allowance(account)
      .then(allowance =>
        setIsERC20Allowance(!!allowance)
      )
      .catch(
        error => console.error("Error fetching fetchUserHasERC20Allowance:", error)
      )
  }


  const callDepositERC20 = async () => {
    provider && await depositERC20(provider);
    account && fetchUserOwnsNFT(account)
      .then(userDepositedNFT =>
        setUserOwnsNFT(!!userDepositedNFT)
      )
      .catch(
        error => console.error("Error fetching if user deposited NFT:", error)
      )
  }

  // useEffects
  useEffect(() => {
    setConnectedToLinea(Object.keys(LINEA_NETWORKS).includes(chainId ?? ''))
    Object.keys(LINEA_NETWORKS).includes(chainId ?? '') && setNetwork('linea-sepolia');
  }, [chainId, connected]
  )

  useEffect(() => {
    // Fetch user balance if connected to Linea and account is set
    if (connectToLinea && account) {
      fetchUserBalance(account, network)
        .catch(error => console.error("Error fetching user balance:", error));

      fetchUserDepositedNFT(account)
        .then(userDepositedNFT =>
          setUserDepositedNFT(!!userDepositedNFT)
        )
        .catch(
          error => console.error("Error fetching if user deposited NFT:", error)
        )

      fetchUserOwnsNFT(account)
        .then(userOwnsNFT =>
          setUserOwnsNFT(!!userOwnsNFT)
        )
        .catch(
          error => console.error("Error fetching if user owns NFT:", error)
        )

      fetchNFTAvailable()
        .then(nftAvailable => setIsNFTAvailable(!!nftAvailable))
        .catch(
          error => console.error("Error fetching if NFT Availability:", error)
        )

      fetchUserHasERC721Allowance(account)
        .then(allowance =>
          setIsERC721Allowance(!!allowance)
        )
        .catch(
          error => console.error("Error fetching fetchUserHasERC721Allowance:", error)
        )

      fetchUserHasERC20Allowance(account)
        .then(allowance =>
          setIsERC20Allowance(!!allowance)
        )
        .catch(
          error => console.error("Error fetching fetchUserHasERC721Allowance:", error)
        )
    }
  }, [connectToLinea, account, network]);

  //JSX
  const MintComponent = () => (
    <div style={{ padding: 10, marginRight: 10, marginTop: 20 }}>
      <hr />
      {
        isNFTAvailable ?
          <div>
            <div>
              Congratulations, you still can mint a ABC ERC721 token to access the Lending platform
            </div>

            <button style={{ padding: 10, marginTop: 10 }} onClick={callMintNFT}>
              Mint ABC ERC721
            </button>
          </div> :
          <div>
            Sorry, all ABC NFT were minted
          </div>
      }

    </div>
  )

  const LendingProtocolComponent = () => (
    <div style={{ padding: 10, marginRight: 10, marginTop: 20 }}>
      <hr />
      {
        userOwnsNFT ?
          <div>
            <div>
              You can borrow ERC20 depositing your ABC NFT as collateral
            </div>

            {!isERC721Allowance ? <button style={{ padding: 10, marginTop: 10 }} onClick={callApproveNFTTransfer}>
              Approve deposit
            </button> :

              <button style={{ padding: 10, marginTop: 10 }} onClick={callDepositNFT}>
                Borrow ERC20
              </button>
            }
          </div> : userDepositedNFT ?
            <div>
              <div>
                You can withdraw your ABC NFT by depositing the ERC20 borrowed amount
              </div>

              {!isERC20Allowance ?
                <button style={{ padding: 10, marginTop: 10 }} onClick={callApproveERC20Transfer}>
                  Approve ERC20 Desposit
                </button> :

                <button style={{ padding: 10, marginTop: 10 }} onClick={callDepositERC20}>
                  Withdraw NFT
                </button>
              }
            </div> :
            <></>
      }

    </div>
  )

  return (
    <div className="App">
      <button style={{ padding: 10, margin: 20 }} onClick={connectToMetamaskProvider}>
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
          <div>You're on the wrong network. Please switch to Linea Sepolia.</div>
        ) : (
          <div>Please connect your wallet to either Linea Sepolia network.</div>
        )}
      </div>
      {connectToLinea && account && ((userOwnsNFT || userDepositedNFT) ?
        <LendingProtocolComponent /> :
        <MintComponent />
      )

      }
    </div>
  );
};


export default App;