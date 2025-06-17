const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'db.json');

// Middleware
app.use(cors());
app.use(express.json()); // Para parsear o corpo das requisições JSON

// Função para ler dados do db.json
const readData = () => {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao ler db.json:', error);
        return []; // Retorna array vazio se o arquivo não existir ou houver erro
    }
};

// Função para escrever dados no db.json
const writeData = (data) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Erro ao escrever em db.json:', error);
    }
};

// Rotas da API

// Obter todas as vagas
app.get('/api/jobs', (req, res) => {
    const jobs = readData();
    res.json(jobs);
});

// Adicionar uma nova vaga
app.post('/api/jobs', (req, res) => {
    const jobs = readData();
    const newJob = req.body;
    newJob.id = Date.now(); // Adiciona um ID único
    jobs.push(newJob);
    writeData(jobs);
    res.status(201).json(newJob);
});

// Excluir uma vaga
app.delete('/api/jobs/:id', (req, res) => {
    let jobs = readData();
    const jobId = parseInt(req.params.id, 10);
    const initialLength = jobs.length;
    jobs = jobs.filter(job => job.id !== jobId);

    if (jobs.length < initialLength) {
        writeData(jobs);
        res.status(200).json({ message: 'Vaga excluída com sucesso' });
    } else {
        res.status(404).json({ message: 'Vaga não encontrada' });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    // Inicializa db.json se não existir
    if (!fs.existsSync(DB_PATH)) {
        writeData([]);
    }
});
