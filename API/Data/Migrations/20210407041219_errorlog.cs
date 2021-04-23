using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace API.data.migrations
{
    public partial class errorlog : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {           

            migrationBuilder.CreateTable(
                name: "Trans.ErrorLog",
                columns: table => new
                {
                    ErrorLogID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ErrorTime = table.Column<DateTime>(nullable: false),
                    UserName = table.Column<string>(type: "varchar(20)", nullable: true),
                    ErrorNumber = table.Column<int>(nullable: false),
                    ErrorSeverity = table.Column<int>(nullable: false),
                    ErrorState = table.Column<int>(nullable: false),
                    ErrorProcedure = table.Column<string>(type: "varchar(150)", nullable: true),
                    ErrorLine = table.Column<int>(nullable: false),
                    ErrorMessage = table.Column<string>(type: "varchar(max)", nullable: true),
                    Module = table.Column<string>(type: "varchar(30)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trans.ErrorLog", x => x.ErrorLogID);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Trans.ErrorLog");
        }
    }
}
