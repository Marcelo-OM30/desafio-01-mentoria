document.addEventListener('DOMContentLoaded', () => {
    const addJobForm = document.getElementById('addJobForm');
    const jobTableBody = document.getElementById('jobTableBody');
    const exportCsvButton = document.getElementById('exportCsvButton');
    const salarioInput = document.getElementById('salario'); // Seleciona o campo de salário

    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyA49jFTJ1rj17DaVHS0cVqRFvhOTuAvDOg",
        authDomain: "rastreador-vagas-qa.firebaseapp.com",
        projectId: "rastreador-vagas-qa",
        storageBucket: "rastreador-vagas-qa.firebasestorage.app", // Corrigido para .app e não .firebasestorage.app
        messagingSenderId: "356952246651",
        appId: "1:356952246651:web:775adfdfd6d746d85895de"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const vagasCollection = db.collection('vagas');

    // Carrega os dados do Firestore ao iniciar
    loadJobsFromFirestore();

    // Máscara para o campo de salário
    salarioInput.addEventListener('input', function(e) {
        let value = e.target.value;
        let digits = value.replace(/\D/g, ''); // Remove todos os não-dígitos

        if (digits === '') {
            e.target.value = '';
            return;
        }

        let number = parseInt(digits, 10);
        let reais = Math.floor(number / 100);
        let cents = (number % 100).toString().padStart(2, '0');

        let formattedReais = reais.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        
        e.target.value = formattedReais + ',' + cents; // Removido 'R$ '
    });

    addJobForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Validação de campos obrigatórios
        const requiredFields = [
            { inputId: 'link', labelText: 'Link da Vaga' },
            { inputId: 'cargo', labelText: 'Cargo' },
            { inputId: 'senioridade', labelText: 'Senioridade' },
            { inputId: 'empresa', labelText: 'Empresa' },
            { inputId: 'qaEmpresa', labelText: 'QA da Empresa (Nome/Contato)' },
            { inputId: 'rhEmpresa', labelText: 'RH da Empresa (Nome/Contato)' },
            { inputId: 'habilidades', labelText: 'Principais habilidades requeridas' },
            { inputId: 'quemIndica', labelText: 'Quem Indica' },
            { inputId: 'salario', labelText: 'Salário no Glassdoor (ou estimativa)' }
        ];

        for (const field of requiredFields) {
            const inputElement = document.getElementById(field.inputId);
            if (!inputElement.value.trim()) {
                // Remove o asterisco da labelText para a mensagem de erro
                const cleanLabelText = field.labelText.replace(/\s*<span class="required-asterisk">\*<\/span>$/i, '').replace(/:$/, '');
                alert(`${cleanLabelText} não pode ficar em branco.`);
                inputElement.focus(); // Foca no campo inválido
                return; // Impede o envio do formulário
            }
        }

        const editingJobId = this.getAttribute('data-editing-id');

        // Limpa e formata o valor do salário antes de salvar
        let salarioValue = this.salario.value;
        let cleanedSalario = '';
        if (salarioValue) {
            const digitsOnly = salarioValue.replace(/\D/g, '');
            if (digitsOnly) {
                const numberValue = parseInt(digitsOnly, 10);
                cleanedSalario = (numberValue / 100).toFixed(2); // Formato "XXXX.XX"
            }
        }

        const jobData = {
            link: this.link.value || '-',
            cargo: this.cargo.value || '-',
            senioridade: this.senioridade.value || '-',
            empresa: this.empresa.value || '-',
            qaEmpresa: this.qaEmpresa.value || '-',
            rhEmpresa: this.rhEmpresa.value || '-',
            habilidades: this.habilidades.value || '-',
            quemIndica: this.quemIndica.value || '-',
            salario: cleanedSalario, // Salva o valor limpo
        };

        try {
            if (editingJobId) {
                // Modo de Edição: Atualizar vaga existente
                await vagasCollection.doc(editingJobId).update(jobData);
                this.removeAttribute('data-editing-id'); // Limpa o ID de edição
                alert('Vaga atualizada com sucesso!'); // Mensagem de sucesso para atualização
            } else {
                // Modo de Adição: Adicionar nova vaga
                // Adicionamos um timestamp para ordenação, se necessário no futuro
                jobData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                const docRef = await vagasCollection.add(jobData);
                alert('Vaga adicionada com sucesso!'); // Mensagem de sucesso para criação
                // Não precisamos chamar addJobToTable aqui se usarmos o listener onSnapshot
            }
            this.reset(); // Limpa o formulário
            this.querySelector('button[type="submit"]').textContent = 'Adicionar Vaga à Tabela'; // Restaura o texto do botão
        } catch (error) {
            console.error('Erro ao salvar vaga:', error);
            alert('Falha ao salvar vaga. Verifique o console para mais detalhes.');
        }
    });

    function addJobToTable(job) {
        const row = jobTableBody.insertRow();
        row.setAttribute('data-id', job.id); // Usamos o ID do documento Firestore

        // Preenche as células da linha com os dados da vaga
        const linkCell = row.insertCell();
        linkCell.textContent = job.link;
        linkCell.classList.add('truncate-link'); // Adiciona classe para truncar
        linkCell.setAttribute('title', job.link); // Mostra o link completo no hover

        row.insertCell().textContent = job.cargo;
        row.insertCell().textContent = job.senioridade;
        row.insertCell().textContent = job.empresa;
        row.insertCell().textContent = job.qaEmpresa;
        row.insertCell().textContent = job.rhEmpresa;

        const habilidadesCell = row.insertCell();
        const habilidadesArray = job.habilidades
            .split(/\n|,\s*|\.\.|\.\s\./g) // Divide por nova linha, vírgula (com ou sem espaço), "..", ou ". ."
            .map(skill => skill.trim()) // Remove espaços em branco extras de cada habilidade
            .filter(skill => skill.length > 0); // Remove habilidades vazias

        if (habilidadesArray.length > 0) {
            habilidadesCell.innerHTML = `<ul>${habilidadesArray.map(skill => `<li>${skill}</li>`).join('')}</ul>`;
        } else {
            habilidadesCell.textContent = '-'; // Se não houver habilidades, exibe um traço
        }

        row.insertCell().textContent = job.quemIndica;
        row.insertCell().textContent = job.salario;
        
        const actionsCell = row.insertCell();

        // Botão Editar
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.classList.add('edit-btn'); // Adicionar classe para estilização, se necessário
        editButton.onclick = function() {
            // Preenche o formulário com os dados da vaga para edição
            addJobForm.link.value = job.link;
            addJobForm.cargo.value = job.cargo;
            addJobForm.senioridade.value = job.senioridade;
            addJobForm.empresa.value = job.empresa;
            addJobForm.qaEmpresa.value = job.qaEmpresa;
            addJobForm.rhEmpresa.value = job.rhEmpresa;
            addJobForm.habilidades.value = job.habilidades;
            addJobForm.quemIndica.value = job.quemIndica;

            // Formata o salário do Firestore para exibição no input
            addJobForm.salario.value = ''; // Limpa primeiro
            const salarioFromStore = job.salario; // Deve estar no formato "XXXX.XX"
            if (salarioFromStore && /^\d+\.\d{2}$/.test(salarioFromStore)) {
                let [reaisDigits, centsDigits] = salarioFromStore.split('.');
                let formattedReaisDisplay = reaisDigits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                addJobForm.salario.value = formattedReaisDisplay + ',' + centsDigits; // Removido 'R$ '
            } else if (salarioFromStore) { // Fallback se não estiver no formato esperado
                const digits = salarioFromStore.toString().replace(/\D/g, '');
                if (digits) {
                    const number = parseInt(digits, 10);
                    const reaisInt = Math.floor(number / 100);
                    const centsStr = (number % 100).toString().padStart(2, '0');
                    const formattedReaisStr = reaisInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                    addJobForm.salario.value = formattedReaisStr + ',' + centsStr; // Removido 'R$ '
                }
            }

            // Salva o ID da vaga que está sendo editada
            addJobForm.setAttribute('data-editing-id', job.id);

            // Altera o texto do botão de submit do formulário para indicar edição
            addJobForm.querySelector('button[type="submit"]').textContent = 'Salvar Alterações';

            // Rola a página para o topo onde o formulário está
            window.scrollTo({ top: addJobForm.offsetTop - 20, behavior: 'smooth' }); 
        };
        actionsCell.appendChild(editButton);

        // Botão Excluir (existente)
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.classList.add('delete-btn');
        deleteButton.onclick = async function() {
            await deleteJobFromFirestore(job.id, row);
        };
        actionsCell.appendChild(deleteButton);
    }

    // Usar onSnapshot para ouvir atualizações em tempo real
    function loadJobsFromFirestore() {
        vagasCollection.orderBy("createdAt", "desc").onSnapshot(snapshot => {
            jobTableBody.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados
            snapshot.forEach(doc => {
                const job = doc.data();
                job.id = doc.id; // Adiciona o ID do documento ao objeto job
                addJobToTable(job);
            });
        }, error => {
            console.error('Erro ao carregar vagas do Firestore:', error);
            alert('Falha ao carregar vagas. Verifique o console para mais detalhes.');
        });
    }

    async function deleteJobFromFirestore(jobId, rowElement) {
        try {
            await vagasCollection.doc(jobId).delete();
            // A remoção da linha da tabela será tratada pelo onSnapshot
            // Se não usarmos onSnapshot: rowElement.remove();
            // alert('Vaga excluída com sucesso!'); // Opcional
        } catch (error) {
            console.error('Erro ao excluir vaga do Firestore:', error);
            alert(`Falha ao excluir vaga: ${error.message}`);
        }
    }

    // Função para exportar dados da tabela para CSV
    function exportTableToCSV(filename) {
        let csv = [];
        const rows = document.querySelectorAll("table tr");
        const BOM = "\uFEFF"; // Adiciona o BOM para UTF-8

        if (rows.length === 0) {
            alert("Não há dados para exportar.");
            return;
        }

        let headerRowData = [];
        const headerCols = rows[0].querySelectorAll("th");
        let actionsColumnIndex = -1;

        // Processa cabeçalhos e encontra o índice da coluna "Ações"
        headerCols.forEach((headerCol, index) => {
            const headerText = headerCol.innerText.trim();
            if (headerText === "Ações") {
                actionsColumnIndex = index;
            } else {
                headerRowData.push('"' + headerText.replace(/"/g, '""') + '"');
            }
        });
        csv.push(headerRowData.join(";"));

        // Processa linhas de dados
        for (let i = 1; i < rows.length; i++) { // Começa de 1 para pular a linha do cabeçalho
            let rowData = [];
            const cols = rows[i].querySelectorAll("td");
            
            cols.forEach((col, index) => {
                if (index === actionsColumnIndex) {
                    return; // Pula a coluna de ações
                }

                let cellText = '';
                const skillsList = col.querySelector('ul'); // Verifica se é a célula de habilidades

                if (skillsList) {
                    const items = [];
                    skillsList.querySelectorAll('li').forEach(li => {
                        items.push(li.textContent.trim());
                    });
                    cellText = items.join(', '); // Junta habilidades com ", "
                } else {
                    cellText = col.innerText.trim(); // Para outras células, usa innerText
                }
                rowData.push('"' + cellText.replace(/"/g, '""') + '"');
            });
            
            if (rowData.length > 0) {
                csv.push(rowData.join(";"));
            }
        }

        if (csv.length <= 1 && headerRowData.length === 0) { // Apenas BOM e cabeçalho vazio, ou só BOM
             alert("Não há dados válidos para exportar após remover a coluna de ações.");
             return;
        }
        if (csv.length === 1 && csv[0] === headerRowData.join(";") && headerRowData.length > 0 && rows.length <=1 ) { // Apenas cabeçalho, sem linhas de dados
            alert("Não há linhas de dados para exportar.");
            return;
        }

        downloadCSV(BOM + csv.join("\n"), filename);
    }

    // Função para fazer o download do arquivo CSV
    function downloadCSV(csv, filename) {
        const csvFile = new Blob([csv], { type: "text/csv;charset=utf-8;" }); // Especifica charset
        const downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    // Event listener para o botão de exportar CSV
    exportCsvButton.addEventListener('click', function() {
        exportTableToCSV('vagas_salvas.csv');
    });
});
