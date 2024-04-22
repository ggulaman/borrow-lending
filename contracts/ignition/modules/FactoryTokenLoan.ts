import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SPARE_ADDRESS = 'Ox';

const FactoryTokenLoanModule = buildModule("FactoryTokenLoanModule", (m) => {

  const factoryTokenLoan = m.contract("FactoryTokenLoan", []);

  return { factoryTokenLoan };
});

export default FactoryTokenLoanModule;
