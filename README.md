# Sistema de Gerenciamento de Oportunidades de Vagas

Este é um sistema simples para ajudar a rastrear e gerenciar oportunidades de vagas na área de testes de software (ou qualquer outra área), com dados persistidos na nuvem usando Firebase Firestore.

## Tecnologias Utilizadas

<p align="left">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase"/>
</p>

*   **HTML5:** Para a estrutura semântica da página.
*   **CSS3:** Para estilização e layout.
*   **JavaScript (ES6+):** Para a interatividade da página, manipulação do DOM e comunicação com o Firebase.
*   **Firebase Firestore:** Para persistência de dados na nuvem, permitindo que os dados sejam compartilhados e acessíveis de qualquer lugar.

## Como Usar

1.  **Acessar o Sistema:**
    *   Acesse a aplicação através do link do GitHub Pages:[ https://marcelo-om30.github.io/desafio-01-mentoria/]

2.  **Adicionar uma Nova Vaga:**
    *   No topo da página, você encontrará o formulário "Adicionar Nova Vaga".
    *   Preencha os campos com as informações da vaga.
    *   Após preencher os campos desejados, clique no botão "Adicionar Vaga à Tabela".
    *   A vaga será adicionada à tabela "Vagas Salvas" e salva no Firebase Firestore, ficando visível para todos os usuários com acesso à página.

3.  **Visualizar Vagas Salvas:**
    *   Todas as vagas adicionadas são listadas na tabela "Vagas Salvas".
    *   Os dados são carregados em tempo real do Firestore.

4.  **Excluir uma Vaga:**
    *   Em cada linha da tabela "Vagas Salvas", na coluna "Ações", há um botão "Excluir".
    *   Clique neste botão para remover permanentemente a vaga da tabela e do Firestore.

5.  **Exportar para CSV:**
    *   Clique no botão "Exportar para CSV" para baixar os dados da tabela visível em um arquivo CSV.

## Configuração do Firebase (Para Desenvolvedores)

Se você for clonar e configurar o projeto localmente ou em seu próprio Firebase:

1.  **Crie um Projeto no Firebase:** Acesse o [Console do Firebase](https://console.firebase.google.com/) e crie um novo projeto.
2.  **Adicione um App da Web:** No seu projeto Firebase, adicione um novo aplicativo da Web e copie o objeto de configuração `firebaseConfig`.
3.  **Configure o Firestore:**
    *   No console do Firebase, vá para "Build" -> "Firestore Database" e crie um banco de dados.
    *   Escolha a localização do seu banco de dados.
    *   Inicialize as regras de segurança. Para desenvolvimento inicial, você pode usar as regras em `firestore.rules` (que permitem leitura/escrita abertas). **Lembre-se de configurar regras mais seguras para produção.**
4.  **Atualize `scripts.js`:** Cole o seu objeto `firebaseConfig` no arquivo `scripts.js`.
5.  **Instale a Firebase CLI:** Se ainda não o fez, instale a Firebase CLI globalmente: `npm install -g firebase-tools`.
6.  **Login no Firebase:** Faça login com sua conta Google: `firebase login`.
7.  **Inicialize o Firebase no Projeto (se ainda não feito):** Na raiz do seu projeto local, execute `firebase init firestore`. Siga os prompts, selecionando seu projeto Firebase e aceitando os nomes de arquivo padrão para regras e índices.
8.  **Deploy das Regras do Firestore:** Após configurar `firestore.rules`, faça o deploy: `firebase deploy --only firestore:rules`.

## Estrutura dos Arquivos

*   `index.html`: O arquivo principal da aplicação, contendo a estrutura HTML e a inclusão dos SDKs do Firebase.
*   `styles.css`: Contém todos os estilos CSS para a aparência da página.
*   `scripts.js`: Contém o código JavaScript que gerencia a adição, exibição, e exclusão de vagas usando Firebase Firestore, além da lógica de exportação para CSV.
*   `images/mentoria-logo.png`: Imagem do logo utilizada na página.
*   `firestore.rules`: Arquivo de configuração das regras de segurança do Firestore.
*   `firebase.json`: Arquivo de configuração do Firebase para o projeto (gerado pela CLI).
*   `.firebaserc`: Arquivo de configuração do Firebase que associa o diretório local ao projeto Firebase (gerado pela CLI).

## Funcionalidades

*   Formulário para entrada de dados de vagas.
*   Exibição das vagas em uma tabela em tempo real.
*   Salvamento dos dados na nuvem (Firebase Firestore), compartilhados entre usuários.
*   Funcionalidade para excluir vagas individualmente.
*   Exportação dos dados da tabela para um arquivo CSV.
*   Tema escuro para melhor visualização.

---

Sinta-se à vontade para modificar e adaptar o sistema às suas necessidades!
