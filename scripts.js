document.addEventListener('DOMContentLoaded', () => {
    const addJobForm = document.getElementById('addJobForm');
    const jobTableBody = document.getElementById('jobTableBody');
    const exportCsvButton = document.getElementById('exportCsvButton'); // Botão de exportar CSV
    const storageKey = 'jobOpportunitiesData_v2'; // Nova chave para evitar conflitos com a versão antiga

    // Carrega os dados do Local Storage ao iniciar
    loadJobsFromStorage();

    addJobForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const newJob = {
            link: this.link.value,
            cargo: this.cargo.value,
            senioridade: this.senioridade.value,
            empresa: this.empresa.value,
            qaEmpresa: this.qaEmpresa.value,
            rhEmpresa: this.rhEmpresa.value,
            habilidades: this.habilidades.value,
            quemIndica: this.quemIndica.value,
            salario: this.salario.value,
            id: Date.now() // ID simples baseado no timestamp para exclusão
        };

        addJobToTable(newJob);
        saveJobToStorage(newJob);
        this.reset(); // Limpa o formulário
    });

    function addJobToTable(job) {
        const row = jobTableBody.insertRow();
        row.setAttribute('data-id', job.id);

        row.insertCell().textContent = job.link ? job.link : '-';
        row.insertCell().textContent = job.cargo ? job.cargo : '-';
        row.insertCell().textContent = job.senioridade ? job.senioridade : '-';
        row.insertCell().textContent = job.empresa ? job.empresa : '-';
        row.insertCell().textContent = job.qaEmpresa ? job.qaEmpresa : '-';
        row.insertCell().textContent = job.rhEmpresa ? job.rhEmpresa : '-';
        row.insertCell().textContent = job.habilidades ? job.habilidades : '-';
        row.insertCell().textContent = job.quemIndica ? job.quemIndica : '-';
        row.insertCell().textContent = job.salario ? job.salario : '-';
        
        const actionsCell = row.insertCell();
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.classList.add('delete-btn');
        deleteButton.onclick = function() {
            deleteJob(job.id, row);
        };
        actionsCell.appendChild(deleteButton);
    }

    function saveJobToStorage(job) {
        let jobs = getJobsFromStorage();
        jobs.push(job);
        localStorage.setItem(storageKey, JSON.stringify(jobs));
    }

    function loadJobsFromStorage() {
        let jobs = getJobsFromStorage();
        jobs.forEach(job => addJobToTable(job));
    }

    function getJobsFromStorage() {
        const jobsJson = localStorage.getItem(storageKey);
        return jobsJson ? JSON.parse(jobsJson) : [];
    }

    function deleteJob(jobId, rowElement) {
        let jobs = getJobsFromStorage();
        jobs = jobs.filter(job => job.id !== jobId);
        localStorage.setItem(storageKey, JSON.stringify(jobs));
        rowElement.remove();
        // alert('Vaga excluída!'); // Opcional: feedback ao usuário
    }

    // Função para exportar dados da tabela para CSV
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
