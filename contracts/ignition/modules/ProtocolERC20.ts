import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ProtocolERC20Module = buildModule("ProtocolERC20", (m) => {
  const totalSupply = (10 ** 9).toString()

  const offeredERC20 = m.contract("ProtocolERC20", [totalSupply]);

  return { offeredERC20 };
});

export default ProtocolERC20Module;