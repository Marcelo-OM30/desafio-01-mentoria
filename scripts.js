document.addEventListener('DOMContentLoaded', () => {
    const addJobForm = document.getElementById('addJobForm');
    const jobTableBody = document.getElementById('jobTableBody');
    const exportCsvButton = document.getElementById('exportCsvButton');

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

    addJobForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const newJobData = {
            link: this.link.value || '-',
            cargo: this.cargo.value || '-',
            senioridade: this.senioridade.value || '-',
            empresa: this.empresa.value || '-',
            qaEmpresa: this.qaEmpresa.value || '-',
            rhEmpresa: this.rhEmpresa.value || '-',
            habilidades: this.habilidades.value || '-',
            quemIndica: this.quemIndica.value || '-',
            salario: this.salario.value || '-',
            // Firestore gerará o ID automaticamente
            // Adicionamos um timestamp para ordenação, se necessário no futuro
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            const docRef = await vagasCollection.add(newJobData);
            // Não precisamos chamar addJobToTable aqui se usarmos o listener onSnapshot
            // Se não usarmos onSnapshot, chamamos: addJobToTable({...newJobData, id: docRef.id});
            this.reset(); // Limpa o formulário
        } catch (error) {
            console.error('Erro ao adicionar vaga:', error);
            alert('Falha ao adicionar vaga. Verifique o console para mais detalhes.');
        }
    });

    function addJobToTable(job) {
        const row = jobTableBody.insertRow();
        row.setAttribute('data-id', job.id); // Usamos o ID do documento Firestore

        row.insertCell().textContent = job.link;
        row.insertCell().textContent = job.cargo;
        row.insertCell().textContent = job.senioridade;
        row.insertCell().textContent = job.empresa;
        row.insertCell().textContent = job.qaEmpresa;
        row.insertCell().textContent = job.rhEmpresa;
        row.insertCell().textContent = job.habilidades;
        row.insertCell().textContent = job.quemIndica;
        row.insertCell().textContent = job.salario;
        
        const actionsCell = row.insertCell();
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

    // Função para exportar dados da tabela para CSV (permanece a mesma, pois lê do DOM)
    function exportTableToCSV(filename) {
        let csv = [];
        const rows = document.querySelectorAll("table tr");
        
        // Adiciona o BOM para UTF-8
        const BOM = "\uFEFF";
        let headerRow = [];
        const headerCols = rows[0].querySelectorAll("th");
        headerCols.forEach(headerCol => {
            // Remove a coluna de ações do cabeçalho
            if (!headerCol.querySelector('button.delete-btn')) {
                headerRow.push('"' + headerCol.innerText.replace(/"/g, '""') + '"');
            }
        });
        csv.push(headerRow.join(";"));

        for (let i = 1; i < rows.length; i++) { // Começa de 1 para pular a linha do cabeçalho já processada
            let rowData = [];
            const cols = rows[i].querySelectorAll("td");
            
            for (const col of cols) {
                // Trata o caso do botão de excluir para não incluir seu texto no CSV
                if (col.querySelector('button.delete-btn')) {
                    // Não adiciona nada para a coluna de ações, pois já foi omitida no cabeçalho
                } else {
                    rowData.push('"' + col.innerText.replace(/"/g, '""') + '"'); // Envolve cada célula com aspas duplas e escapa aspas internas
                }
            }
            if(rowData.length > 0) { // Adiciona a linha apenas se tiver dados (evita linhas vazias se a última coluna for de ações)
                csv.push(rowData.join(";"));  // Usa ponto e vírgula como delimitador
            }
        }

        downloadCSV(BOM + csv.join("\n"), filename); // Adiciona o BOM no início do arquivo
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
