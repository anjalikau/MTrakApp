﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class MasterCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Agents",
                columns: table => new
                {
                    idAgents = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    cAgentName = table.Column<string>(type: "varchar(20)", nullable: false),
                    cPassword = table.Column<string>(type: "varchar(24)", nullable: false),
                    Factory = table.Column<string>(type: "varchar(5)", nullable: false),
                    cDescription = table.Column<string>(type: "varchar(50)", nullable: true),
                    cEmail = table.Column<string>(type: "varchar(50)", nullable: true),
                    iCategoryLevel = table.Column<byte>(type: "tinyint", nullable: false),
                    bActive = table.Column<int>(nullable: false),
                    passwordHash = table.Column<byte[]>(nullable: false),
                    passwordSalt = table.Column<byte[]>(nullable: false),
                    CreatedDateTime = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Agents", x => x.idAgents);
                });

            migrationBuilder.CreateTable(
                name: "Master.Buyer",
                columns: table => new
                {
                    AutoIdx = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BuyerCompanyCode = table.Column<int>(nullable: false),
                    CompanyName = table.Column<string>(type: "varchar(100)", nullable: false),
                    CompanyShortName = table.Column<string>(type: "varchar(20)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Master.Buyer", x => x.AutoIdx);
                });

            migrationBuilder.CreateTable(
                name: "Master.Division",
                columns: table => new
                {
                    AutoIdx = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DivisionName = table.Column<string>(type: "varchar(50)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Master.Division", x => x.AutoIdx);
                });

            migrationBuilder.CreateTable(
                name: "Master.Product",
                columns: table => new
                {
                    AutoIdx = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductName = table.Column<string>(type: "varchar(50)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Master.Product", x => x.AutoIdx);
                });

            migrationBuilder.CreateTable(
                name: "Master.Season",
                columns: table => new
                {
                    AutoIdx = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Season = table.Column<string>(type: "varchar(50)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Master.Season", x => x.AutoIdx);
                });

            migrationBuilder.CreateTable(
                name: "Master.Style",
                columns: table => new
                {
                    AutoIdx = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StyleName = table.Column<string>(type: "varchar(50)", nullable: false),
                    Description = table.Column<string>(type: "varchar(200)", nullable: true),
                    Link_ProductID = table.Column<int>(nullable: false),
                    Link_BuyerId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Master.Style", x => x.AutoIdx);
                    table.ForeignKey(
                        name: "FK_Master.Style_Master.Buyer_Link_BuyerId",
                        column: x => x.Link_BuyerId,
                        principalTable: "Master.Buyer",
                        principalColumn: "AutoIdx",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Master.Style_Master.Product_Link_ProductID",
                        column: x => x.Link_ProductID,
                        principalTable: "Master.Product",
                        principalColumn: "AutoIdx",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Master.Style_Link_BuyerId",
                table: "Master.Style",
                column: "Link_BuyerId");

            migrationBuilder.CreateIndex(
                name: "IX_Master.Style_Link_ProductID",
                table: "Master.Style",
                column: "Link_ProductID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Agents");

            migrationBuilder.DropTable(
                name: "Master.Division");

            migrationBuilder.DropTable(
                name: "Master.Season");

            migrationBuilder.DropTable(
                name: "Master.Style");

            migrationBuilder.DropTable(
                name: "Master.Buyer");

            migrationBuilder.DropTable(
                name: "Master.Product");
        }
    }
}