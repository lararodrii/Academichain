# AcademiChain Token (ACAD)

Este repositório contém o MVP do projeto **AcademiChain** para o Hackathon. É um ambiente Hardhat completo configurado para o desenvolvimento, teste e implantação do smart contract `AcademiChainToken`.

## 🪙 Sobre o Token

O `AcademiChainToken` (símbolo `ACAD`) é um token ERC-20 em Solidity estruturado sob a biblioteca padrão da **OpenZeppelin (v5)**.

* **Objetivo:** Premiar alunos por atividades extracurriculares e monitorias validadas.
* **Segurança:** Apenas o administrador (`Owner`) possui privilégios de criar e enviar novos tokens (`mintReward`) para carteiras de alunos.
* **Transparência:** Emite o evento `RewardMinted` registrando o aluno, valor e o tipo de atividade executada.

---

## 🛠️ Pré-requisitos

* [Node.js](https://nodejs.org/) (Compatível com v18+; Hardhat configurado para esta máquina)
* NPM (gerenciador de pacotes)

---

## 🚀 Como Executar

### 1. Instalar dependências
(Já executado na inicialização)
```bash
npm install
```

### 2. Compilar o Smart Contract
Compila o código Solidity do token usando o compilador Solidity configurado (`0.8.28`):
```bash
npx hardhat compile
```

### 3. Rodar Testes Unitários
A suíte de testes valida a implantação, a segurança da função de `mint` (apenas owner) e as regras de negócio:
```bash
npx hardhat test
```

### 4. Deploy Local (Simulação de Rede)
Para rodar uma blockchain local de testes em segundo plano:
```bash
npx hardhat node
```

E em outro terminal, para implantar o contrato na rede local simulada:
```bash
npx hardhat ignition deploy ./ignition/modules/AcademiChainToken.js --network localhost
```
