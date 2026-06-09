// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AcademiChainToken
 * @dev Contrato do token AcademiChainToken (ACAD). ERC-20 com função de mint restrita ao dono (Owner).
 * Utilizado para recompensar alunos por atividades extracurriculares e monitorias validadas.
 */
contract AcademiChainToken is ERC20, Ownable {
    
    // Evento emitido quando tokens são cunhados para um aluno como recompensa
    event RewardMinted(address indexed student, uint256 amount, string activityType);

    /**
     * @dev Construtor que inicializa o token ACAD e define o proprietário inicial.
     * @param initialOwner Endereço do administrador (proprietário inicial) do contrato.
     */
    constructor(address initialOwner) 
        ERC20("AcademiChainToken", "ACAD") 
        Ownable(initialOwner) 
    {}

    /**
     * @dev Função padrão para cunhar novos tokens.
     * Restrita ao Owner (administrador).
     * @param to Endereço de destino para os novos tokens.
     * @param amount Quantidade de tokens a ser cunhada (em wei).
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "AcademiChainToken: endereco de destino invalido");
        require(amount > 0, "AcademiChainToken: quantidade deve ser maior que zero");
        _mint(to, amount);
    }

    /**
     * @dev Função específica para cunhar novos tokens como recompensa para alunos.
     * Restrita ao Owner (administrador).
     * @param student Endereço da carteira do aluno.
     * @param amount Quantidade de tokens a ser cunhada (em wei).
     * @param activityType Descrição ou identificador da atividade validada (ex: "Monitoria", "Palestra").
     */
    function mintReward(
        address student, 
        uint256 amount, 
        string calldata activityType
    ) external onlyOwner {
        require(student != address(0), "AcademiChainToken: endereco do aluno invalido");
        require(amount > 0, "AcademiChainToken: quantidade deve ser maior que zero");
        
        _mint(student, amount);
        
        emit RewardMinted(student, amount, activityType);
    }
}
