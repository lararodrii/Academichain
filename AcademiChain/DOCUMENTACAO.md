# ⛓️ AcademiChain - Guia Oficial de Onboarding (Hackathon)

Bem-vindo à documentação oficial do **AcademiChain**! Este guia foi elaborado para alinhar a equipe de desenvolvimento e design sobre a estrutura, o progresso atual e os próximos passos para o nosso MVP do Hackathon.

---

## 📌 1. Visão Geral do Projeto

O **AcademiChain** é um sistema descentralizado de incentivo e engajamento estudantil que recompensa alunos com o token utilitário **$ACAD** (padrão ERC-20) por monitorias, projetos de pesquisa e atividades extracurriculares validadas. 

A proposta de valor é transformar a validação de horas acadêmicas em um processo transparente, imutável e gamificado, integrando a coordenação da instituição (administradores do contrato) com as carteiras digitais dos alunos.

---

## 🛠️ 2. Status Atual (O que já foi feito)

O projeto encontra-se em estágio avançado de MVP, com a infraestrutura básica e a comunicação Web3 já desenhadas:

* **Ambiente Smart Contracts (Hardhat):** Estrutura inicializada com suporte a testes unitários (Mocha/Chai) e compilação na versão `0.8.28` do Solidity.
* **Smart Contract (`AcademiChainToken.sol`):** Token ERC-20 padrão da OpenZeppelin (v5) criado sob a sigla **ACAD**. O contrato conta com restrição de acesso via módulo `Ownable`, permitindo que apenas o proprietário (`Owner` / Administrador) execute a emissão padrão de tokens (`mint`) e a emissão especial com registro de atividades (`mintReward`).
* **Suite de Testes:** 9 testes unitários criados e passando com sucesso (verificando a segurança, emissão, propriedade e validação de parâmetros).
* **Interface Frontend (React + Vite + Ethers.js):**
  * Dashboard de Tecnologia Acadêmica responsivo construído em CSS puro (estilo dark premium com suporte para desktop e mobile).
  * Lógica de conexão com carteiras Web3 (como MetaMask) integrada através da biblioteca `ethers` (v6) com monitoramento automático de mudança de contas/redes.
  * Formulário de cunhagem de tokens e tabela de histórico visualmente estruturados.

---

## 📁 3. Arquitetura de Pastas

Abaixo está a disposição dos principais diretórios e arquivos relevantes no repositório:

```text
AcademiChain/
├── contracts/
│   └── AcademiChainToken.sol       # Código-fonte Solidity do Token ERC-20
├── ignition/
│   └── modules/
│       └── AcademiChainToken.js    # Script para deploy automático via Hardhat Ignition
├── test/
│   └── AcademiChainToken.js        # Arquivo de testes unitários em Javascript
├── frontend/                       # Código-fonte da aplicação do Usuário (dApp)
│   ├── src/
│   │   ├── App.jsx                 # Lógica de interface e interações Web3
│   │   ├── App.css                 # CSS responsivo e estilização visual
│   │   └── main.jsx                # Ponto de entrada React
│   ├── package.json                # Dependências do front-end (React, Vite, Ethers)
│   └── index.html
├── hardhat.config.js               # Configurações do compilador e redes do Hardhat
├── package.json                    # Dependências de smart contracts e desenvolvimento
└── DOCUMENTACAO.md                 # Este documento
```

---

## 🚀 4. Próximos Passos (Backlog)

Para finalizarmos o MVP de forma redonda para a apresentação do Hackathon, precisamos focar nas seguintes tarefas:

1. **Deploy do Contrato na Rede Local:**
   * Iniciar a blockchain local do Hardhat: `npx hardhat node`
   * Executar o deploy do contrato AcademiChainToken apontando para a rede local utilizando o Hardhat Ignition.
   
2. **Extração e Integração de ABI no Frontend:**
   * Copiar o arquivo compilado JSON (ABI) gerado pelo Hardhat em `artifacts/contracts/AcademiChainToken.sol/AcademiChainToken.json` para dentro da pasta `frontend/src/` para habilitar a chamada das funções do smart contract na interface.
   
3. **Conexão Real Frontend ➡️ Contrato:**
   * Atualizar a variável de endereço do contrato no input do painel.
   * Garantir que, ao preencher o formulário do painel administrativo, a função `mintReward` seja disparada na MetaMask e envie de fato os tokens $ACAD na rede de testes para a carteira do aluno inserida.
   * Ler o saldo real de tokens $ACAD do usuário conectado através da chamada do método `balanceOf` do contrato e mostrá-lo na tela no lugar dos mocks atuais.
   
4. **Lapidação do Roteiro e Slides do Pitch:**
   * Estruturar a apresentação de 3 a 5 minutos, focando no problema (burocracia nas horas complementares), na solução (AcademiChain), na demonstração do dApp e na escalabilidade do projeto.
