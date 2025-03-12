const API_URL = 'http://localhost:8080/api/tarefas';

document.addEventListener('DOMContentLoaded', () => {
    carregarTarefas();
    document.getElementById('salvarTarefa').addEventListener('click', salvarTarefa);
    document.getElementById('confirmarDeletar').addEventListener('click', deletarTarefa);
});

function carregarTarefas() {
    const filtroStatus = document.getElementById('filtroStatus').value;
    let url = API_URL;
    if (filtroStatus) {
        url += `/status/${filtroStatus}`;
    }
    
    fetch(url)
        .then(response => response.json())
        .then(tarefas => {
            const tabelaTarefas = document.getElementById('listaTarefas');
            tabelaTarefas.innerHTML = ''; // Limpar a tabela antes de preencher
            
            tarefas.forEach(tarefa => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${tarefa.descricao}</td>
                    <td>${tarefa.dataInicio}</td>
                    <td>${tarefa.dataFim}</td>
                    <td>${tarefa.status}</td>
                    <td class="max-auto">
                        <button class="btn btn-sm btn-primary" onclick="abrirModalEditar(${tarefa.id}, '${tarefa.descricao}', '${tarefa.dataInicio}', '${tarefa.dataFim}', '${tarefa.status}')">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="abrirModalDeletar(${tarefa.id})">Deletar</button>
                    </td>
                `;
                tabelaTarefas.appendChild(tr);
            });
        });
}

function titleForm(action) {
    const titleForm = document.getElementById('titleForm');
    
    if (action === 'criar') {
        titleForm.innerHTML = 'Adicionar Tarefa';
    } else if (action === 'editar') {
        titleForm.innerHTML = 'Editar Tarefa';
    }
}

function abrirModalCriar() {
    titleForm('criar');
    document.getElementById('idTarefa').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('dataInicio').value = '';
    document.getElementById('dataFim').value = '';
    document.getElementById('status').value = 'PENDENTE';
}

function abrirModalEditar(id, descricao, dataInicio, dataFim, status) {
    titleForm('editar');
    document.getElementById('idTarefa').value = id;
    document.getElementById('descricao').value = descricao;
    document.getElementById('dataInicio').value = dataInicio;
    document.getElementById('dataFim').value = dataFim;
    document.getElementById('status').value = status;
    $('#modalTarefa').modal('show');
}

function salvarTarefa() {
    const id = document.getElementById('idTarefa').value;
    const tarefa = {
        descricao: document.getElementById('descricao').value,
        dataInicio: document.getElementById('dataInicio').value,
        dataFim: document.getElementById('dataFim').value,
        status: document.getElementById('status').value
    };
    
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;
    
    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tarefa)
    }).then(() => {
        $('#modalTarefa').modal('hide');
        carregarTarefas();
    });
}

function abrirModalDeletar(id) {
    document.getElementById('confirmarDeletar').setAttribute('data-id', id);
    $('#modalDeletar').modal('show');
}

function deletarTarefa() {
    const id = document.getElementById('confirmarDeletar').getAttribute('data-id');
    fetch(`${API_URL}/${id}`, { method: 'DELETE' }).then(() => {
        $('#modalDeletar').modal('hide');
        carregarTarefas();
    });
}
