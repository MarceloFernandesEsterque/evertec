using PontoTuristico.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PontoTuristico.Domain.Interfaces
{
    public interface IPontoTuristicoRepository
    {
        Task<IEnumerable<PontoTuristicoEntity>> ObterTodosPaginadosAsync(string? busca, int pagina, int tamanhoPagina);
        Task<int> ContarTotalAsync(string? busca);
        Task<PontoTuristicoEntity?> ObterPorIdAsync(int id);
        Task AdicionarAsync(PontoTuristicoEntity pontoTuristico);
    }
}
