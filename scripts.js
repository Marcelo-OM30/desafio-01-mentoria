document.addEventListener('DOMContentLoaded', () => {
    const addJobForm = document.getElementById('addJobForm');
    const jobTableBody = document.getElementById('jobTableBody');
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
});
