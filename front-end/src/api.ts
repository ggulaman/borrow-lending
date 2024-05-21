import axios from 'axios';

export const fetchUserBalance = async (userAddress: string, network: 'sepolia' | 'linea-sepolia'): Promise<any> => {
  const response = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/balance/${network}/${userAddress}`);
  return response.data;
};

export const fetchUserERC20Balance = async (userAddress: string, network: 'sepolia' | 'linea-sepolia', tokenContractAddress: string): Promise<any> => {
  const response = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/ERC20balance/${network}/${userAddress}/${tokenContractAddress}`);
  return response.data;
};

export const fetchUserERC721Balance = async (userAddress: string, network: 'sepolia' | 'linea-sepolia', tokenContractAddress: string): Promise<any> => {
  const response = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/ERC721balance/${network}/${userAddress}/${tokenContractAddress}`);
  return response.data;
};

export const fetchUserDepositedNFT = async (userAddress: string): Promise<any> => {
  const response = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/userdepositednft/${userAddress}`);
  return response.data;
};

export const fetchUserOwnsNFT = async (userAddress: string): Promise<any> => {
  const response = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/userownsnft/${userAddress}`);
  return response.data;
};

export const fetchNFTAvailable = async (): Promise<any> => {
  const response = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/availablenfts/`);
  return response.data;
};

export const fetchUserHasERC20Allowance = async (userAddress: string): Promise<any> => {
  const response = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/hasERC20allowance/${userAddress}/${process.env.REACT_APP_FACTORY_LOAN_TOKEN_ADDRESS}`);
  return response.data;
};

export const fetchUserHasERC721Allowance = async (userAddress: string): Promise<any> => {
  const response = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/hasERC721allowance/${userAddress}`);
  return response.data;
};