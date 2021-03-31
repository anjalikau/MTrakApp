using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace API.data.migrations
{
    public partial class agentcreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Master.AgentLevel",
                columns: table => new
                {
                    AutoId = table.Column<byte>(type: "tinyint", nullable: false)                    
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AgentLevel = table.Column<byte>(type: "tinyint", nullable: false),
                    LevelPrority = table.Column<byte>(type: "tinyint", nullable: false),
                    LevelDescription = table.Column<string>(type: "varchar(30)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Master.AgentLevel", x => x.AutoId);
                });

            migrationBuilder.CreateTable(
                name: "Master.Agents",
                columns: table => new
                {
                    idAgents = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    cAgentName = table.Column<string>(type: "varchar(20)", nullable: false),
                    cPassword = table.Column<string>(type: "varchar(24)", nullable: false),
                    Factory = table.Column<string>(type: "varchar(5)", nullable: false),
                    cDescription = table.Column<string>(type: "varchar(50)", nullable: true),
                    cEmail = table.Column<string>(type: "varchar(50)", nullable: true),
                    bActive = table.Column<int>(nullable: false),
                    passwordHash = table.Column<byte[]>(nullable: false),
                    passwordSalt = table.Column<byte[]>(nullable: false),
                    CreatedDateTime = table.Column<DateTime>(nullable: false),
                    FactoryId = table.Column<int>(nullable: false),
                    iCategoryLevel = table.Column<byte>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Master.Agents", x => x.idAgents);
                    table.ForeignKey(
                        name: "FK_Master.Agents_Master.Factory_FactoryId",
                        column: x => x.FactoryId,
                        principalTable: "Master.Factory",
                        principalColumn: "AutoId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Master.Agents_Master.AgentLevel_iCategoryLevel",
                        column: x => x.iCategoryLevel,
                        principalTable: "Master.AgentLevel",
                        principalColumn: "AutoId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Master.Agents_FactoryId",
                table: "Master.Agents",
                column: "FactoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Master.Agents_iCategoryLevel",
                table: "Master.Agents",
                column: "iCategoryLevel");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Master.Agents");

            migrationBuilder.DropTable(
                name: "Master.AgentLevel");
        }
    }
}
