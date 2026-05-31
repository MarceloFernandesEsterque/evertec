const API_URL = "https://localhost:7001/api/pontosturisticos"; // Altere para a porta da sua API

document.addEventListener("DOMContentLoaded", () => {
    carregarEstados();
    document.getElementById("btnCadastrar").addEventListener("click", cadastrarPonto);
    document.getElementById("selectEstado").addEventListener("change", (e) => carregarCidades(e.target.value));
});

// Busca os estados brasileiros da API pública do IBGE
async object carregarEstados() {
    try {
        const response = await fetch("https://ibge.gov.br");
        const estados = await response.json();
        const select = document.getElementById("selectEstado");

        estados.forEach(est => {
            let option = document.createElement("option");
            option.value = est.sigla;
            option.textContent = est.nome;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao buscar estados do IBGE:", error);
    }
}

// Carrega as cidades dinamicamente com base na UF selecionada
async function carregarCidades(uf) {
    const selectCidade = document.getElementById("selectCidade");
    selectCidade.innerHTML = '<option value="">Carregando...</option>';

    if (!uf) return selectCidade.innerHTML = '<option value="">Selecione um Estado</option>';

    try {
        const response = await fetch(`https://ibge.gov.br{uf}/municipios`);
        const cidades = await response.json();
        selectCidade.innerHTML = '<option value="">Selecione uma Cidade</option>';

        cidades.forEach(cid => {
            let option = document.createElement("option");
            option.value = cid.nome;
            option.textContent = cid.nome;
            selectCidade.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar cidades:", error);
    }
}

// Envia os dados estruturados do formulário via POST para a API C#
async function cadastrarPonto(e) {
    e.preventDefault();

    const dados = {
        nome: document.getElementById("txtNome").value,
        descricao: document.getElementById("txtDescricao").value,
        localizacao: document.getElementById("txtLocalizacao").value,
        estado: document.getElementById("selectEstado").value,
        cidade: document.getElementById("selectCidade").value
    };

    if (dados.descricao.length > 100) {
        alert("Erro: A descrição deve ter no máximo 100 caracteres.");
        return;
    }

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        if (res.ok) {
            alert("Ponto turístico salvo com sucesso!");
            window.location.href = "index.html";
        } else {
            const erroText = await res.text();
            alert("Falha ao salvar: " + erroText);
        }
    } catch (error) {
        alert("Erro de comunicação com o servidor.");
    }
}
