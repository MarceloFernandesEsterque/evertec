using System;
using Microsoft.EntityFrameworkCore;
using PontoTuristico.Data.Context;       // Ajuste com o namespace real do seu DbContext
using PontoTuristico.Data.Repositories;  // Ajuste com o namespace dos seus repositórios
using PontoTuristico.Domain.Interfaces;  // Ajuste com o namespace das suas interfaces
using PontoTuristico.Data.Context;

var builder = WebApplication.CreateBuilder(args);

// -----------------------------------------------------------------------------
// 1. CONFIGURAÇÃO DOS SERVIÇOS (Injeção de Dependência)
// -----------------------------------------------------------------------------

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // Mantido para facilitar os seus testes locais de endpoint

// Configuração do Banco de Dados (SQLite)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Injeção de Dependência das camadas (Padrão de Repositório exigido no perfil Pleno)
builder.Services.AddScoped<IPontoTuristicoRepository, PontoTuristicoRepository>();

// Configuração do CORS (Crucial para permitir que seu HTML/JS acesse a API)
const string PoliticaCorsFronEnd = "_politicaCorsFrontEnd";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: PoliticaCorsFronEnd,
        policy =>
        {
            policy.WithOrigins("http://localhost:5500", "http://127.0.0.1:5500") // Portas comuns do Live Server (VS Code)
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// -----------------------------------------------------------------------------
// 2. CONFIGURAÇÃO DO PIPELINE DE REQUISIÇÕES (Middlewares)
// -----------------------------------------------------------------------------

// Ativa o Swagger em ambiente de Desenvolvimento
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Importante: O CORS deve ser ativado ANTES da autorização e do mapeamento de rotas
app.UseCors(PoliticaCorsFronEnd);

app.UseAuthorization();

// Permite que a API sirva arquivos estáticos (HTML/CSS/JS) caso decida deixá-los na pasta wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

// Mapeia os endpoints criados nos seus Controllers
app.MapControllers();

// Força a criação do banco de dados SQLite e aplicação das migrações ao iniciar a API
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        //context.Database.Migrate(); // Cria o arquivo .db e as tabelas automaticamente
        context.Database.EnsureCreated(); // Cria o arquivo de forma imediata assim que der Play
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Ocorreu um erro ao inicializar e migrar o banco de dados.");
    }
}

app.Run();
