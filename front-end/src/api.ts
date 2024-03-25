import axios from 'axios';

export const fetchUserBalance = async (userAddress: string, network: 'linea' | 'linea-goerli'): Promise<any> => {
  const response = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/balance/${network}/${userAddress}`);
  return response.data;
};

export const fetchUserERC20Balance = async (userAddress: string, network: 'linea' | 'linea-goerli', tokenContractAddress: string): Promise<any> => {
  const response = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/ERC20balance/${network}/${userAddress}/${tokenContractAddress}`);
  return response.data;
};

export const fetchUserERC721Balance = async (userAddress: string, network: 'linea' | 'linea-goerli', tokenContractAddress: string): Promise<any> => {
  const response = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/ERC721balance/${network}/${userAddress}/${tokenContractAddress}`);
  return response.data;
};