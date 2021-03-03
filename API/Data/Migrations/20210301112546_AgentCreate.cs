using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class AgentCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_MstrAgents",
                table: "MstrAgents");

            migrationBuilder.RenameTable(
                name: "MstrAgents",
                newName: "Agents");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Agents",
                table: "Agents",
                column: "idAgents");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Agents",
                table: "Agents");

            migrationBuilder.RenameTable(
                name: "Agents",
                newName: "MstrAgents");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MstrAgents",
                table: "MstrAgents",
                column: "idAgents");
        }
    }
}
