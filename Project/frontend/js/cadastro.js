// Configuração da URL da API ativa no Visual Studio (Porta 7271)
const API_URL = "https://localhost:7271/api/pontosturisticos";

// Inicialização dos eventos assim que a página carrega
document.addEventListener("DOMContentLoaded", () => {
    carregarEstadosIBGE();

    // Captura o evento de envio (submit) do formulário
    document.getElementById("formCadastro").addEventListener("submit", cadastrarPontoTuristico);

    // Evento para carregar cidades assim que o usuário selecionar um estado
    document.getElementById("selectEstado").addEventListener("change", (e) => {
        carregarCidadesIBGE(e.target.value);
    });
});

// 🏛️ 1. Busca os estados brasileiros na API pública do IBGE (Ordenado por Nome)
async function carregarEstadosIBGE() {
    const selectEstado = document.getElementById("selectEstado");
    
    try {
        const response = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
        if (!response.ok) throw new Error("Erro ao buscar estados.");

        const estados = await response.json();

        estados.forEach(est => {
            const option = document.createElement("option");
            option.value = est.id; // Envia a sigla de 2 caracteres (Ex: SP) cumprindo a regra do banco
            option.textContent = est.nome; // Exibe o nome completo para o usuário (Ex: São Paulo)
            selectEstado.appendChild(option);
        });
    } catch (error) {
        console.error("Erro na integração com o IBGE:", error);
        selectEstado.innerHTML = '<option value="">Erro ao carregar estados</option>';
    }
}

// 🏙️ 2. Carrega as cidades dinamicamente com base na UF selecionada
async function carregarCidadesIBGE(uf) {
    const selectCidade = document.getElementById("selectCidade");
    
    // Limpa o select de cidades e coloca estado de carregamento
    selectCidade.innerHTML = '<option value="">Carregando cidades...</option>';
    selectCidade.disabled = true;

    if (!uf) {
        selectCidade.innerHTML = '<option value="">Selecione um Estado primeiro</option>';
        return;
    }

    try {
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
        if (!response.ok) throw new Error("Erro ao buscar cidades.");

        const cidades = await response.json();
        selectCidade.innerHTML = '<option value="">Selecione uma Cidade</option>';
        selectCidade.disabled = false;

        cidades.forEach(cid => {
            const option = document.createElement("option");
            option.value = cid.nome;
            option.textContent = cid.nome;
            selectCidade.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao buscar cidades no IBGE:", error);
        selectCidade.innerHTML = '<option value="">Erro ao carregar cidades</option>';
    }
}

// 💾 3. Envia os dados estruturados do formulário via POST para a API em C#
async function cadastrarPontoTuristico(e) {
    // Impede o recarregamento padrão da página HTML
    e.preventDefault();

    const txtDescricao = document.getElementById("txtDescricao").value;

    // Validação de segurança no Front-end (Regra estrita do teste)
    if (txtDescricao.trim().length > 100) {
        alert("Erro: A descrição não pode ultrapassar o limite de 100 caracteres.");
        return;
    }

    // Monta o objeto exatamente no padrão esperado pela PontoTuristicoEntity do C#
    const dadosFormulario = {
        nome: document.getElementById("txtNome").value,
        descricao: txtDescricao,
        localizacao: document.getElementById("txtLocalizacao").value,
        estado: document.getElementById("selectEstado").value,
        cidade: document.getElementById("selectCidade").value
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosFormulario)
        });

        if (response.ok) {
            alert("Ponto turístico cadastrado com sucesso! 🎉");
            // Redireciona o usuário de volta para a tela inicial de listagem
            window.location.href = "index.html";
        } else {
            // Captura o erro amigável retornado pelas validações do nosso Controller
            const erroApi = await response.json();
            alert(`Falha no cadastro: ${erroApi.mensagem || "Verifique os dados enviados."}`);
        }
    } catch (error) {
        console.error("Erro na requisição POST:", error);
        alert("Erro crítico: Não foi possível conectar ao servidor backend. Certifique-se de que a API C# está rodando.");
    }
}
