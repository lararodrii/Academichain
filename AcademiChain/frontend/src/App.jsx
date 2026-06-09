import { useState, useEffect } from 'react';
import { BrowserProvider, Contract, formatEther, parseEther } from 'ethers';
import './App.css';

// ABI mínimo para interagir com o token ERC-20 AcademiChainToken
const ACAD_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimal() view returns (uint8)",
  "function mintReward(address student, uint256 amount, string memory activityType) external"
];

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0.00");
  const [network, setNetwork] = useState("Desconectado");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Endereço do contrato do Token (pode ser configurado pelo usuário no painel)
  const [contractAddress, setContractAddress] = useState("");
  
  // Estados para o formulário de validação/mint
  const [studentAddress, setStudentAddress] = useState("");
  const [activityType, setActivityType] = useState("Monitoria");
  const [rewardAmount, setRewardAmount] = useState("50");
  const [txLoading, setTxLoading] = useState(false);
  const [txSuccess, setTxSuccess] = useState(null);

  // Lista de atividades (inicialmente com mock e atualizada dinamicamente)
  const [activities, setActivities] = useState([
    { id: 1, student: "0x7099...79C8", activity: "Monitoria de Algoritmos", amount: "100.00", date: "09/06/2026", status: "Validado" },
    { id: 2, student: "0x3C44...3079", activity: "Palestra Web3 e Solidity", amount: "50.00", date: "07/06/2026", status: "Validado" },
    { id: 3, student: "0x90F7...1970", activity: "Participação em Hackathon", amount: "250.00", date: "05/06/2026", status: "Validado" }
  ]);

  // Função para conectar carteira
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("MetaMask não encontrada. Por favor, instale a extensão MetaMask.");
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);
      
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const net = await provider.getNetwork();
      
      setAccount(accounts[0]);
      setNetwork(net.name === "unknown" ? `Localhost (${net.chainId})` : net.name);
      
      // Se houver endereço do contrato definido, busca o saldo
      if (contractAddress && accounts[0]) {
        fetchBalance(accounts[0], provider);
      }
    } catch (err) {
      console.error(err);
      setError("Falha ao conectar com o MetaMask. Verifique se a carteira está desbloqueada.");
    } finally {
      setIsConnecting(false);
    }
  };

  // Função para buscar saldo real de tokens ACAD
  const fetchBalance = async (userAddress, providerInstance) => {
    try {
      const provider = providerInstance || new BrowserProvider(window.ethereum);
      const tokenContract = new Contract(contractAddress, ACAD_TOKEN_ABI, provider);
      const bal = await tokenContract.balanceOf(userAddress);
      setBalance(formatEther(bal));
    } catch (err) {
      console.error("Erro ao buscar saldo do token:", err);
      // Mantém saldo mock ou zerado em caso de erro de leitura
    }
  };

  // Enviar transação de Mint (Cunhar Recompensa)
  const handleSubmitReward = async (e) => {
    e.preventDefault();
    if (!account) {
      setError("Por favor, conecte sua carteira primeiro.");
      return;
    }
    if (!contractAddress) {
      setError("Defina o endereço do contrato do Token ACAD para enviar transações.");
      return;
    }

    try {
      setTxLoading(true);
      setError(null);
      setTxSuccess(null);

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Cria instância do contrato com signer para enviar transação
      const tokenContract = new Contract(contractAddress, ACAD_TOKEN_ABI, signer);
      const weiAmount = parseEther(rewardAmount);
      
      const tx = await tokenContract.mintReward(studentAddress, weiAmount, activityType);
      await tx.wait(); // Aguarda a confirmação da transação
      
      setTxSuccess(`Sucesso! Recompensa de ${rewardAmount} ACAD enviada.`);
      
      // Atualiza lista local de atividades
      const newActivity = {
        id: Date.now(),
        student: formatAddress(studentAddress),
        activity: activityType,
        amount: parseFloat(rewardAmount).toFixed(2),
        date: new Date().toLocaleDateString('pt-BR'),
        status: "Validado"
      };
      setActivities(prev => [newActivity, ...prev]);
      
      // Atualiza o saldo do usuário atualizado
      fetchBalance(account, provider);
      
      // Limpa formulário
      setStudentAddress("");
    } catch (err) {
      console.error(err);
      setError(err.reason || "Erro ao processar transação. Verifique se você é o Owner do contrato.");
    } finally {
      setTxLoading(false);
    }
  };

  // Monitorar alterações no MetaMask
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          if (contractAddress) fetchBalance(accounts[0]);
        } else {
          setAccount(null);
          setBalance("0.00");
          setNetwork("Desconectado");
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, [contractAddress]);

  // Formatar endereço
  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span className="logo-icon">⛓️</span>
          <span className="logo-text">Academi<span>Chain</span></span>
        </div>
        
        <ul className="sidebar-menu">
          <li className="menu-item active">
            <a href="#dashboard">
              <span>📊</span> Dashboard
            </a>
          </li>
          <li className="menu-item">
            <a href="#contracts">
              <span>📝</span> Contratos
            </a>
          </li>
          <li className="menu-item">
            <a href="#rewards">
              <span>🏆</span> Recompensas
            </a>
          </li>
          <li className="menu-item">
            <a href="#settings">
              <span>⚙️</span> Configurações
            </a>
          </li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <div className="main-workspace">
        {/* Top Header */}
        <header className="top-navbar">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </button>
            <div className="page-title">
              <h1>Painel de Recompensas</h1>
              <p>Gerenciamento acadêmico descentralizado</p>
            </div>
          </div>

          <button 
            className={`connect-btn ${account ? 'connected' : ''}`}
            onClick={connectWallet}
            disabled={isConnecting}
          >
            <span className={`wallet-status-dot ${account ? 'green' : 'red'}`}></span>
            {account ? formatAddress(account) : "Conectar Carteira"}
          </button>
        </header>

        {/* Dashboard Panels */}
        <main className="dashboard-content">
          
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card balance">
              <div className="stat-header">
                <span className="stat-title">Saldo ACAD</span>
                <span className="stat-icon">🪙</span>
              </div>
              <div className="stat-value">{account ? balance : "--.--"} <span>ACAD</span></div>
              <div className="stat-footer">Equivalente às suas horas acadêmicas validadas</div>
            </div>

            <div className="stat-card hours">
              <div className="stat-header">
                <span className="stat-title">Monitorias / Extracurriculares</span>
                <span className="stat-icon">🎓</span>
              </div>
              <div className="stat-value">32h <span>/ 40h</span></div>
              <div className="stat-footer">Meta mínima para validação semestral</div>
            </div>

            <div className="stat-card network">
              <div className="stat-header">
                <span className="stat-title">Rede Blockchain</span>
                <span className="stat-icon">🌐</span>
              </div>
              <div className="stat-value" style={{ fontSize: '1.5rem', lineHeight: '2.5rem' }}>
                {account ? network : "Desconectado"}
              </div>
              <div className="stat-footer">Status da conexão da sua carteira</div>
            </div>
          </div>

          {/* Configuração do Contrato (Para testes rápidos) */}
          <div className="widget-card" style={{ padding: '1.25rem' }}>
            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <label style={{ margin: 0, whiteSpace: 'nowrap' }}>📝 Endereço do Contrato Token:</label>
              <input 
                type="text" 
                className="form-control" 
                style={{ flex: 1, minWidth: '250px' }}
                placeholder="Insira o endereço do AcademiChainToken implantado (ex: 0x5FbDB2315678afecb367f032d93F642f64180aa3)"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="alert-error">{error}</div>}
          {txSuccess && <div className="alert-error" style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>{txSuccess}</div>}

          {/* Main Dashboard Grid */}
          <div className="dashboard-grid">
            {/* Left Column: Form */}
            <section className="widget-card">
              <h3 className="widget-title">⚙️ Registrar Atividades (Apenas Administrador)</h3>
              <form className="activity-form" onSubmit={handleSubmitReward}>
                
                <div className="form-group">
                  <label htmlFor="student-wallet">Endereço da Carteira do Aluno</label>
                  <input 
                    type="text" 
                    id="student-wallet"
                    className="form-control" 
                    required
                    placeholder="0x..."
                    value={studentAddress}
                    onChange={(e) => setStudentAddress(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="activity-type">Tipo de Atividade</label>
                  <select 
                    id="activity-type" 
                    className="form-control"
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                  >
                    <option value="Monitoria">Monitoria Acadêmica</option>
                    <option value="Atividade Extracurricular">Atividade Extracurricular</option>
                    <option value="Palestra & Workshop">Palestra & Workshop</option>
                    <option value="Hackathon & Projetos">Hackathon & Projetos</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="reward-amount">Quantidade de Recompensa (ACAD)</label>
                  <input 
                    type="number" 
                    id="reward-amount"
                    className="form-control" 
                    min="1"
                    required
                    value={rewardAmount}
                    onChange={(e) => setRewardAmount(e.target.value)}
                  />
                </div>

                <button 
                  type="submit" 
                  className="submit-btn" 
                  disabled={txLoading}
                >
                  {txLoading ? "Validando Transação..." : "Cunhar & Enviar Recompensa"}
                </button>
              </form>
            </section>

            {/* Right Column: Transaction Log */}
            <section className="widget-card">
              <h3 className="widget-title">🔔 Recompensas Validadas</h3>
              <div className="transaction-list">
                {activities.map((act) => (
                  <div className="transaction-item" key={act.id}>
                    <div className="tx-info">
                      <span className="tx-title">{act.activity}</span>
                      <div className="tx-meta">
                        <span>Aluno: {act.student}</span>
                        <span>•</span>
                        <span>{act.date}</span>
                        <span>•</span>
                        <span className="tx-badge">{act.status}</span>
                      </div>
                    </div>
                    <div className="tx-value">+{act.amount} ACAD</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

        </main>

        <footer className="dashboard-footer">
          <p>&copy; {new Date().getFullYear()} AcademiChain. MVP Hackathon Smart Contracts.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
