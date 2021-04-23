using Microsoft.EntityFrameworkCore.Migrations;

namespace API.data.migrations
{
    public partial class MenuUserList : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // migrationBuilder.AlterColumn<byte>(
            //     name: "AutoId",
            //     table: "Master.AgentLevel",
            //     type: "tinyint",
            //     nullable: false,
            //     oldClrType: typeof(byte),
            //     oldType: "tinyint")
            //     .OldAnnotation("SqlServer:Identity", "1, 1");

            migrationBuilder.CreateTable(
                name: "Master.MenuUser",
                columns: table => new
                {
                    AutoId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(nullable: false),
                    MenuId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Master.MenuUser", x => x.AutoId);
                    table.ForeignKey(
                        name: "FK_Master.MenuUser_Master.MenuList_MenuId",
                        column: x => x.MenuId,
                        principalTable: "Master.MenuList",
                        principalColumn: "AutoIdx",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Master.MenuUser_Master.Agents_UserId",
                        column: x => x.UserId,
                        principalTable: "Master.Agents",
                        principalColumn: "idAgents",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Master.MenuUser_MenuId",
                table: "Master.MenuUser",
                column: "MenuId");

            migrationBuilder.CreateIndex(
                name: "IX_Master.MenuUser_UserId",
                table: "Master.MenuUser",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Master.MenuUser");

            // migrationBuilder.AlterColumn<byte>(
            //     name: "AutoId",
            //     table: "Master.AgentLevel",
            //     type: "tinyint",
            //     nullable: false,
            //     oldClrType: typeof(byte),
            //     oldType: "tinyint")
            //     .Annotation("SqlServer:Identity", "1, 1");
        }
    }
}
