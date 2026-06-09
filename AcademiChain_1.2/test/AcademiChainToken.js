const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AcademiChainToken", function () {
  let token;
  let owner;
  let student;
  let otherAccount;

  beforeEach(async function () {
    // Obter contas de teste do Hardhat
    [owner, student, otherAccount] = await ethers.getSigners();

    // Obter a Factory e implantar o contrato
    const TokenFactory = await ethers.getContractFactory("AcademiChainToken");
    token = await TokenFactory.deploy(owner.address);
    if (token.waitForDeployment) {
      await token.waitForDeployment();
    }
  });

  describe("Implantação (Deployment)", function () {
    it("Deve definir o nome e símbolo corretos", async function () {
      expect(await token.name()).to.equal("AcademiChainToken");
      expect(await token.symbol()).to.equal("ACAD");
    });

    it("Deve definir o proprietário (owner) correto", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });

    it("Deve começar com o suprimento total igual a zero", async function () {
      expect(await token.totalSupply()).to.equal(0);
    });
  });

  describe("Cunhagem Padrão (Standard Minting)", function () {
    it("Deve permitir que o Owner minte novos tokens para um endereço", async function () {
      const amount = ethers.parseEther("500");
      await token.mint(student.address, amount);

      expect(await token.balanceOf(student.address)).to.equal(amount);
      expect(await token.totalSupply()).to.equal(amount);
    });

    it("Não deve permitir que não-owner minte novos tokens", async function () {
      const amount = ethers.parseEther("100");
      await expect(
        token.connect(otherAccount).mint(student.address, amount)
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
       .withArgs(otherAccount.address);
    });
  });

  describe("Cunhagem de Recompensas (Minting Rewards)", function () {
    it("Deve permitir que o Owner minte tokens de recompensa para alunos", async function () {
      const amount = ethers.parseEther("100"); // 100 ACAD
      const activity = "Monitoria de Algoritmos";

      // Executa o mint e valida a emissão do evento
      await expect(token.mintReward(student.address, amount, activity))
        .to.emit(token, "RewardMinted")
        .withArgs(student.address, amount, activity);

      // Valida o saldo do aluno
      expect(await token.balanceOf(student.address)).to.equal(amount);
      
      // Valida o suprimento total
      expect(await token.totalSupply()).to.equal(amount);
    });

    it("Não deve permitir que outra conta (não-owner) minte tokens", async function () {
      const amount = ethers.parseEther("50");
      const activity = "Participacao em Palestra";

      // Tenta mintar usando outra conta e valida reversão
      await expect(
        token.connect(otherAccount).mintReward(student.address, amount, activity)
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
       .withArgs(otherAccount.address);
    });

    it("Não deve permitir mintar para o endereço zero", async function () {
      const amount = ethers.parseEther("10");
      
      await expect(
        token.mintReward(ethers.ZeroAddress, amount, "Atividade Invalida")
      ).to.be.revertedWith("AcademiChainToken: endereco do aluno invalido");
    });

    it("Não deve permitir mintar quantidade zero de tokens", async function () {
      await expect(
        token.mintReward(student.address, 0, "Atividade Invalida")
      ).to.be.revertedWith("AcademiChainToken: quantidade deve ser maior que zero");
    });
  });
});
