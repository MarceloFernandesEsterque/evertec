const API_URL = "https://localhost:7001/api/pontosturisticos";
let paginaAtual = 1;

document.addEventListener("DOMContentLoaded", () => {
    carregarPontos();
    document.getElementById("btnBuscar").addEventListener("click", () => {
        paginaAtual = 1; // Reinicia a paginação na nova busca
        carregarPontos();
    });
});

async function carregarPontos() {
    const termoBusca = document.getElementById("txtBusca").value;
    const container = document.getElementById("listaPontos");
    
    // Constrói a URL com os filtros necessários
    const url = `${API_URL}?busca=${encodeURIComponent(termoBusca)}&pagina=${paginaAtual}&tamanhoPagina=5`;

    try {
        const response = await fetch(url);
        const resultado = await response.json();

        container.innerHTML = "";

        if (resultado.dados.length === 0) {
            container.innerHTML = "<p>Não encontrei nenhum resultado para a sua busca :(</p>";
            document.getElementById("botoesPaginacao").innerHTML = "";
            return;
        }

        // Renderiza cada ponto conforme o mockup (Nome e Localização)
        resultado.dados.forEach(ponto => {
            const div = document.createElement("div");
            div.className = "card-ponto";
            div.innerHTML = `
                <h3>${ponto.nome}</h3>
                <p><strong>Localização:</strong> ${ponto.localizacao}</p>
                <button onclick="verDetalhes(${ponto.id})">ver detalhes</button>
                <hr>
            `;
            container.appendChild(div);
        });

        renderizarBotoesPaginacao(resultado.totalPaginas);
    } catch (error) {
        console.error("Erro na busca de dados:", error);
    }
}

function renderizarBotoesPaginacao(totalPaginas) {
    const nav = document.getElementById("botoesPaginacao");
    nav.innerHTML = "";

    if (paginaAtual > 1) {
        let btnAnterior = document.createElement("button");
        btnAnterior.textContent = "Voltar";
        btnAnterior.onclick = () => { paginaAtual--; carregarPontos(); };
        nav.appendChild(btnAnterior);
    }

    if (paginaAtual < totalPaginas) {
        let btnAvancar = document.createElement("button");
        btnAvancar.textContent = "Avançar";
        btnAvancar.onclick = () => { paginaAtual++; carregarPontos(); };
        nav.appendChild(btnAvancar);
    }
}

function verDetalhes(id) {
    // Redireciona para a página de detalhes passando o ID na URL
    window.location.href = `detalhes.html?id=${id}`;
}
