using System.Collections.Generic;
using System.Reflection.Emit;
using Microsoft.EntityFrameworkCore;
using PontoTuristico.Domain.Entities; // Namespace onde ficará a sua entidade futuramente

namespace PontoTuristico.Data.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Esta propriedade representa a tabela que será criada no banco de dados
        public DbSet<PontoTuristicoEntity> PontosTuristicos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Demonstra postura Plena mapeando regras de negócio direto no banco de dados (Fluent API)
            modelBuilder.Entity<PontoTuristicoEntity>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Nome).IsRequired().HasMaxLength(150);
                entity.Property(e => e.Descricao).IsRequired().HasMaxLength(100); // Regra restrita do teste
                entity.Property(e => e.Localizacao).IsRequired().HasMaxLength(250);
                entity.Property(e => e.Cidade).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Estado).IsRequired().HasMaxLength(2);
                entity.Property(e => e.DataInclusao).IsRequired();
            });
        }
    }
}
