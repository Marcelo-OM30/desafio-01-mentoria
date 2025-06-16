# Sistema de Gerenciamento de Oportunidades de Vagas

Este é um sistema simples para ajudar a rastrear e gerenciar oportunidades de vagas na área de testes de software (ou qualquer outra área).

## Tecnologias Utilizadas

<p align="left">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
</p>

*   **HTML5:** Para a estrutura semântica da página.
*   **CSS3:** Para estilização e layout, incluindo o tema escuro.
*   **JavaScript (ES6+):** Para a interatividade da página, manipulação do DOM, e gerenciamento de dados com o Local Storage.

## Como Usar

1.  **Abrir o Sistema:**
    *   Clone ou baixe os arquivos do projeto para o seu computador.
    *   Navegue até a pasta do projeto.
    *   Abra o arquivo `index.html` em qualquer navegador web moderno (Chrome, Firefox, Edge, Safari).

2.  **Adicionar uma Nova Vaga:**
    *   No topo da página, você encontrará o formulário "Adicionar Nova Vaga".
    *   Preencha os campos com as informações da vaga:
        *   Link da Vaga (URL)
        *   Cargo
        *   Senioridade
        *   Empresa
        *   QA da Empresa (Nome/Contato)
        *   RH da Empresa (Nome/Contato)
        *   Principais habilidades requeridas
        *   Quem Indica
        *   Salário no Glassdoor (ou estimativa)
    *   Após preencher os campos desejados, clique no botão "Adicionar Vaga à Tabela".
    *   A vaga será adicionada à tabela "Vagas Salvas" abaixo do formulário e também será salva automaticamente no Local Storage do seu navegador.

3.  **Visualizar Vagas Salvas:**
    *   Todas as vagas adicionadas são listadas na tabela "Vagas Salvas".
    *   Os dados persistirão mesmo que você feche e reabra o navegador, pois são salvos no Local Storage. (Nota: Limpar o cache ou os dados do site do navegador pode apagar as vagas salvas).

4.  **Excluir uma Vaga:**
    *   Em cada linha da tabela "Vagas Salvas", na coluna "Ações", há um botão "Excluir".
    *   Clique neste botão para remover permanentemente a vaga da tabela e do Local Storage.

## Estrutura dos Arquivos

*   `index.html`: O arquivo principal da aplicação, contendo a estrutura HTML.
*   `styles.css`: Contém todos os estilos CSS para a aparência da página (tema escuro aplicado).
*   `scripts.js`: Contém o código JavaScript que gerencia a adição, exibição, salvamento (Local Storage) e exclusão de vagas.
*   `images/mentoria-logo.png`: Imagem do logo utilizada na página e como marca d'água.

## Funcionalidades

*   Formulário para entrada de dados de vagas.
*   Exibição das vagas em uma tabela.
*   Salvamento automático dos dados no Local Storage do navegador.
*   Funcionalidade para excluir vagas individualmente.
*   Tema escuro para melhor visualização.
*   Logo e marca d'água personalizáveis.

---

Sinta-se à vontade para modificar e adaptar o sistema às suas necessidades!
