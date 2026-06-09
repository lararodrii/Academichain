const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("AcademiChainTokenModule", (m) => {
  // Obtém a conta padrão que fará o deploy (geralmente a conta 0 do hardhat)
  const deployer = m.getAccount(0);
  
  // Faz o deploy do contrato AcademiChainToken definindo o deployer como o proprietário inicial (initialOwner)
  const token = m.contract("AcademiChainToken", [deployer]);

  return { token };
});
