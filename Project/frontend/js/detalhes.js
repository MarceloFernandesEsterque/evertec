// Configuração da URL da API ativa no Visual Studio (Porta 7271)
const API_URL = "https://localhost:7271/api/pontosturisticos";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Captura o parâmetro '?id=X' que foi injetado na URL da página
    const urlParams = new URLSearchParams(window.location.search);
    const pontoId = urlParams.get('id');

    // Validação de segurança estrutural caso acessem a tela sem passar o id
    if (!pontoId) {
        exibirMensagemErro("Parâmetro de identificação ausente na requisição.");
        return;
    }

    carregarDetalhesDoPonto(pontoId);
});

// 2. Realiza a busca assíncrona do ID selecionado diretamente na API C#
async function carregarDetalhesDoPonto(id) {
    const painel = document.getElementById("painelDetalhes");

    try {
        const response = await fetch(`${API_URL}/${id}`);
        
        if (response.status === 404) {
            exibirMensagemErro("O ponto turístico solicitado não foi encontrado no banco de dados.");
            return;
        }
        
        if (!response.ok) throw new Error("Erro de comunicação interna.");

        const ponto = await response.json();

        // 3. Renderiza os dados no padrão do teste: Nome, Descrição e Localização completos
        painel.innerHTML = `
            <div class="detalhe-item">
                <label>Nome do Ponto Turístico</label>
                <h1>${ponto.nome}</h1>
            </div>

            <div class="detalhe-item">
                <label>Descrição do Local</label>
                <p class="descricao-texto">${ponto.descricao}</p>
            </div>

            <div class="detalhe-item">
                <label>Localização / Endereço</label>
                <p class="localizacao-texto">📍 ${ponto.localizacao} — ${ponto.cidade} / ${ponto.estado}</p>
            </div>
            
            <div class="detalhe-item-data">
                <span>Registrado no sistema em: ${new Date(ponto.dataInclusao).toLocaleDateString('pt-BR')}</span>
            </div>
        `;

    } catch (error) {
        console.error("Erro na busca de detalhes:", error);
        exibirMensagemErro("Falha crítica ao conectar com a API. Verifique se o servidor C# está ativo.");
    }
}

function exibirMensagemErro(mensagem) {
    const painel = document.getElementById("painelDetalhes");
    painel.innerHTML = `<p class="status-mensagem" style="color: #ef4444; border-color: #fca5a5;">⚠️ ${mensagem}</p>`;
}
