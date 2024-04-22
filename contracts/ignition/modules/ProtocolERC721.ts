import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ProtocolERC721Module = buildModule("ProtocolERC721", (m) => {

  const protocolERC721 = m.contract("ProtocolERC721", []);

  return { protocolERC721 };
});

export default ProtocolERC721Module;