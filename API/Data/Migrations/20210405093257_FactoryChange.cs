using Microsoft.EntityFrameworkCore.Migrations;

namespace API.data.Migrations
{
    public partial class FactoryChange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TimeZone",
                table: "Master.Factory",
                nullable: false,
                defaultValue: 1);

            // migrationBuilder.AlterColumn<byte>(
            //     name: "AutoId",
            //     table: "Master.AgentLevel",
            //     type: "tinyint",
            //     nullable: false,
            //     oldClrType: typeof(byte),
            //     oldType: "tinyint")
            //     .OldAnnotation("SqlServer:Identity", "1, 1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TimeZone",
                table: "Master.Factory");

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
