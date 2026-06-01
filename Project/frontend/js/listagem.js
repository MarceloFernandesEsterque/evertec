// Configuração da URL da API ativa no Visual Studio (Porta 7271)
const API_URL = "https://localhost:7271/api/pontosturisticos";
let paginaAtual = 1;
const TAMANHO_PAGINA = 5; // Limite de registros por página

// Inicialização dos eventos ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    carregarPontos();

    // Evento do botão Buscar
    document.getElementById("btnBuscar").addEventListener("click", () => {
        paginaAtual = 1; // Reinicia para a primeira página em uma nova busca
        carregarPontos();
    });

    // Permite buscar também ao apertar a tecla "Enter" no campo de texto
    document.getElementById("txtBusca").addEventListener("keypress", (e) => {
        if (e.key === 'Enter') {
            paginaAtual = 1;
            carregarPontos();
        }
    });
});

// Função principal que consome a API C# via Fetch
async function carregarPontos() {
    const termoBusca = document.getElementById("txtBusca").value;
    const container = document.getElementById("listaPontos");
    
    container.innerHTML = '<p class="status-mensagem">Buscando pontos turísticos...</p>';

    // Monta a URL com os parâmetros de QueryString para paginação e busca
    const url = `${API_URL}?busca=${encodeURIComponent(termoBusca)}&pagina=${paginaAtual}&tamanhoPagina=${TAMANHO_PAGINA}`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error("Erro na comunicação com o servidor.");
        }

        const resultado = await response.json();
        container.innerHTML = "";

        // Caso a busca não retorne nenhum registro do banco
        if (!resultado.dados || resultado.dados.length === 0) {
            container.innerHTML = '<p class="status-mensagem">Nenhum ponto turístico encontrado para esta pesquisa. 🙁</p>';
            document.getElementById("botoesPaginacao").innerHTML = "";
            return;
        }

        // Renderiza cada registro respeitando a regra: apenas Nome e Localização na index
        resultado.dados.forEach(ponto => {
            const div = document.createElement("div");
            div.className = "card-ponto";
            div.innerHTML = `
                <div class="card-ponto-info">
                    <h3>${ponto.nome}</h3>
                    <p>📍 ${ponto.localizacao}</p>
                </div>
                <button class="btn-detalhes" onclick="verDetalhes(${ponto.id})">Ver detalhes</button>
            `;
            container.appendChild(div);
        });

        // Atualiza a barra de paginação inferior
        renderizarBotoesPaginacao(resultado.totalPaginas);

    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        container.innerHTML = '<p class="status-mensagem" style="color: #ef4444; border-color: #fca5a5;">Não foi possível conectar à API. Certifique-se de que o projeto C# está rodando.</p>';
    }
}

// Cria os controles de avançar e voltar dinamicamente
function renderizarBotoesPaginacao(totalPaginas) {
    const nav = document.getElementById("botoesPaginacao");
    nav.innerHTML = "";

    // Se houver apenas 1 página, não precisa renderizar botões
    if (totalPaginas <= 1) return;

    // Botão Voltar
    const btnAnterior = document.createElement("button");
    btnAnterior.textContent = "◀ Voltar";
    btnAnterior.disabled = (paginaAtual === 1);
    btnAnterior.onclick = () => {
        paginaAtual--;
        carregarPontos();
    };
    nav.appendChild(btnAnterior);

    // Texto indicador de página atual (Ex: "Página 1 de 3")
    const indicador = document.createElement("span");
    indicador.textContent = ` Página ${paginaAtual} de ${totalPaginas} `;
    indicador.style.alignSelf = "center";
    indicador.style.color = "#64748b";
    indicador.style.fontWeight = "600";
    nav.appendChild(indicador);

    // Botão Avançar
    const btnProximo = document.createElement("button");
    btnProximo.textContent = "Avançar ▶";
    btnProximo.disabled = (paginaAtual === totalPaginas);
    btnProximo.onclick = () => {
        paginaAtual++;
        carregarPontos();
    };
    nav.appendChild(btnProximo);
}

// Redireciona o usuário para a tela de detalhes passando o ID na URL
function verDetalhes(id) {
    window.location.href = `detalhes.html?id=${id}`;
}
