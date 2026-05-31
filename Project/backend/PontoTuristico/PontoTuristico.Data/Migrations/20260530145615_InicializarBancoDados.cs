using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PontoTuristico.Data.Migrations
{
    /// <inheritdoc />
    public partial class InicializarBancoDados : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PontosTuristicos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    Descricao = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Localizacao = table.Column<string>(type: "TEXT", maxLength: 250, nullable: false),
                    Cidade = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Estado = table.Column<string>(type: "TEXT", maxLength: 2, nullable: false),
                    DataInclusao = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PontosTuristicos", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PontosTuristicos");
        }
    }
}
