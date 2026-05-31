using Microsoft.EntityFrameworkCore;
using PontoTuristico.Data.Context;
using PontoTuristico.Domain.Entities;
using PontoTuristico.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PontoTuristico.Data.Repositories
{
    public class PontoTuristicoRepository : IPontoTuristicoRepository
    {
        private readonly AppDbContext _context;

        public PontoTuristicoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PontoTuristicoEntity>> ObterTodosPaginadosAsync(string? busca, int pagina, int tamanhoPagina)
        {
            var query = _context.PontosTuristicos.AsQueryable();

            if (!string.IsNullOrWhiteSpace(busca))
            {
                busca = busca.Trim().ToLower();
                query = query.Where(p => p.Nome.ToLower().Contains(busca)
                                      || p.Descricao.ToLower().Contains(busca)
                                      || p.Localizacao.ToLower().Contains(busca));
            }

            // Ordenação Decrescente (Mais recente primeiro) e Paginação
            return await query.OrderByDescending(p => p.DataInclusao)
                              .Skip((pagina - 1) * tamanhoPagina)
                              .Take(tamanhoPagina)
                              .ToListAsync();
        }

        public async Task<int> ContarTotalAsync(string? busca)
        {
            var query = _context.PontosTuristicos.AsQueryable();

            if (!string.IsNullOrWhiteSpace(busca))
            {
                busca = busca.Trim().ToLower();
                query = query.Where(p => p.Nome.ToLower().Contains(busca)
                                      || p.Descricao.ToLower().Contains(busca)
                                      || p.Localizacao.ToLower().Contains(busca));
            }

            return await query.CountAsync();
        }

        public async Task<PontoTuristicoEntity?> ObterPorIdAsync(int id)
        {
            return await _context.PontosTuristicos.FindAsync(id);
        }

        public async Task AdicionarAsync(PontoTuristicoEntity pontoTuristico)
        {
            await _context.PontosTuristicos.AddAsync(pontoTuristico);
            await _context.SaveChangesAsync();
        }
    }
}
