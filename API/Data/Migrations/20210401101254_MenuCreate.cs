using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class MenuCreate : Migration
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
                name: "Master.MenuList",
                columns: table => new
                {
                    AutoIdx = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MenuName = table.Column<string>(type: "varchar(50)", nullable: false),
                    MenuDescription = table.Column<string>(type: "varchar(100)", nullable: false),
                    GroupName = table.Column<string>(type: "varchar(20)", nullable: false),
                    mType = table.Column<string>(type: "char(1)", nullable: false),
                    CreateUserID = table.Column<int>(nullable: true),
                    CreateDateTime = table.Column<DateTime>(nullable: true),
                    UpdateUserID = table.Column<int>(nullable: true),
                    UpdateDateTime = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Master.MenuList", x => x.AutoIdx);
                });

            migrationBuilder.CreateTable(
                name: "Master.MenuLevel",
                columns: table => new
                {
                    AutoIdx = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    iCategoryLevel = table.Column<byte>(type: "tinyint", nullable: false),
                    MenuID = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Master.MenuLevel", x => x.AutoIdx);
                    table.ForeignKey(
                        name: "FK_Master.MenuLevel_Master.MenuList_MenuID",
                        column: x => x.MenuID,
                        principalTable: "Master.MenuList",
                        principalColumn: "AutoIdx",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Master.MenuLevel_Master.AgentLevel_iCategoryLevel",
                        column: x => x.iCategoryLevel,
                        principalTable: "Master.AgentLevel",
                        principalColumn: "AutoId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Master.MenuLevel_MenuID",
                table: "Master.MenuLevel",
                column: "MenuID");

            migrationBuilder.CreateIndex(
                name: "IX_Master.MenuLevel_iCategoryLevel",
                table: "Master.MenuLevel",
                column: "iCategoryLevel");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Master.MenuLevel");

            migrationBuilder.DropTable(
                name: "Master.MenuList");

            migrationBuilder.AlterColumn<byte>(
                name: "AutoId",
                table: "Master.AgentLevel",
                type: "tinyint",
                nullable: false,
                oldClrType: typeof(byte),
                oldType: "tinyint")
                .Annotation("SqlServer:Identity", "1, 1");
        }
    }
}
