import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CollateralERC20Module = buildModule("ProtocolERC20", (m) => {
  const totalSupply = (10 ** 9).toString()

  const collateralERC20 = m.contract("ProtocolERC20", [totalSupply]);

  return { collateralERC20 };
});

export default CollateralERC20Module;
