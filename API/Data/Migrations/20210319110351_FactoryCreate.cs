using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class FactoryCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FactoryId",
                table: "Agents",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Master.Factory",
                columns: table => new
                {
                    AutoId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Factory = table.Column<string>(type: "varchar(5)", nullable: false),
                    Description = table.Column<string>(type: "varchar(50)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Master.Factory", x => x.AutoId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Agents_FactoryId",
                table: "Agents",
                column: "FactoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Agents_Master.Factory_FactoryId",
                table: "Agents",
                column: "FactoryId",
                principalTable: "Master.Factory",
                principalColumn: "AutoId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Agents_Master.Factory_FactoryId",
                table: "Agents");

            migrationBuilder.DropTable(
                name: "Master.Factory");

            migrationBuilder.DropIndex(
                name: "IX_Agents_FactoryId",
                table: "Agents");

            migrationBuilder.DropColumn(
                name: "FactoryId",
                table: "Agents");
        }
    }
}
