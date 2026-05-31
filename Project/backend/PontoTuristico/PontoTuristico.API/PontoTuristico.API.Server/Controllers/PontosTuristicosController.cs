using Microsoft.AspNetCore.Mvc;
using PontoTuristico.Domain.Entities;
using PontoTuristico.Domain.Interfaces;
using System;
using System.Threading.Tasks;

namespace PontoTuristico.API.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PontosTuristicosController : ControllerBase
    {
        private readonly IPontoTuristicoRepository _repository;

        // Injeção de dependência da interface de repositório
        public PontosTuristicosController(IPontoTuristicoRepository repository)
        {
            _repository = repository;
        }

        // GET: api/pontosturisticos?busca=termo&pagina=1&tamanhoPagina=5
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string? busca, [FromQuery] int pagina = 1, [FromQuery] int tamanhoPagina = 5)
        {
            try
            {
                if (pagina < 1) pagina = 1;
                if (tamanhoPagina < 1) tamanhoPagina = 5;

                // Executa a paginação e contagem através do repositório isolado
                var itens = await _repository.ObterTodosPaginadosAsync(busca, pagina, tamanhoPagina);
                var totalItens = await _repository.ContarTotalAsync(busca);

                var totalPaginas = (int)Math.Ceiling((double)totalItens / tamanhoPagina);

                return Ok(new
                {
                    TotalItens = totalItens,
                    PaginaAtual = pagina,
                    TamanhoPagina = tamanhoPagina,
                    TotalPaginas = totalPaginas,
                    Dados = itens
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = "Erro interno ao listar os pontos turísticos.", detalhe = ex.Message });
            }
        }

        // GET: api/pontosturisticos/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var ponto = await _repository.ObterPorIdAsync(id);

                if (ponto == null)
                    return NotFound(new { mensagem = "Ponto turístico não localizado." });

                return Ok(ponto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = "Erro interno ao buscar o detalhe do ponto turístico.", detalhe = ex.Message });
            }
        }

        // POST: api/pontosturisticos
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] PontoTuristicoEntity model)
        {
            try
            {
                // Validações robustas no Backend (Postura Pleno)
                if (model == null)
                    return BadRequest(new { mensagem = "Os dados enviados são inválidos." });

                if (string.IsNullOrWhiteSpace(model.Nome))
                    return BadRequest(new { mensagem = "O campo Nome é obrigatório." });

                if (string.IsNullOrWhiteSpace(model.Descricao) || model.Descricao.Length > 100)
                    return BadRequest(new { mensagem = "A descrição é obrigatória e deve ter no máximo 100 caracteres." });

                if (string.IsNullOrWhiteSpace(model.Localizacao))
                    return BadRequest(new { mensagem = "O campo Localização é obrigatório." });

                if (string.IsNullOrWhiteSpace(model.Estado) || string.IsNullOrWhiteSpace(model.Cidade))
                    return BadRequest(new { message = "Estado e Cidade são campos obrigatórios." });

                // Define os metadados antes de persistir
                model.DataInclusao = DateTime.UtcNow;

                await _repository.AdicionarAsync(model);

                return CreatedAtAction(nameof(GetById), new { id = model.Id }, model);
            }
            catch (Exception ex)
            {
                // Captura o erro real do banco de dados (InnerException) para exibir no Swagger
                var erroReal = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, new { mensagem = "Erro ao salvar o ponto turístico.", detalhe = erroReal });
            }
        }
    }
}
