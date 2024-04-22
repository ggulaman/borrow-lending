import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ProtocolERC20Module = buildModule("ProtocolERC20", (m) => {
  const totalSupply = (10 ** 9).toString()
  const protocolERC20 = m.contract("ProtocolERC20", [totalSupply]);
  const protocolERC20Deploy = m.call(protocolERC20, "deploy");
  const protocolERC20DeployAddress = m.readEventArgument(protocolERC20Deploy, "Deployed", "addr");

  console.log(`ERC20 deployed at ${protocolERC20DeployAddress}`)

  return { protocolERC20 };
});

export default ProtocolERC20Module;