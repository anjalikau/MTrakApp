﻿// <auto-generated />
using System;
using API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace API.Data.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("API.Entities.ErrorLog", b =>
                {
                    b.Property<int>("ErrorLogID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("ErrorLine")
                        .HasColumnType("int");

                    b.Property<string>("ErrorMessage")
                        .HasColumnType("varchar(max)");

                    b.Property<int>("ErrorNumber")
                        .HasColumnType("int");

                    b.Property<string>("ErrorProcedure")
                        .HasColumnType("varchar(150)");

                    b.Property<int>("ErrorSeverity")
                        .HasColumnType("int");

                    b.Property<int>("ErrorState")
                        .HasColumnType("int");

                    b.Property<DateTime>("ErrorTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("Module")
                        .HasColumnType("varchar(30)");

                    b.Property<string>("UserName")
                        .HasColumnType("varchar(20)");

                    b.HasKey("ErrorLogID");

                    b.ToTable("Trans.ErrorLog");
                });

            modelBuilder.Entity("API.Entities.MenuJoinList", b =>
                {
                    b.Property<int>("AutoIdx")
                        .HasColumnType("int");

                    b.Property<string>("GroupName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LevelDescription")
                        .HasColumnType("nvarchar(max)");

                    b.Property<byte>("LevelPrority")
                        .HasColumnType("tinyint");

                    b.Property<string>("MenuDescription")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("MenuName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("MenuType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<byte>("iCategoryLevel")
                        .HasColumnType("tinyint");

                    b.Property<string>("mType")
                        .HasColumnType("nvarchar(max)");

                    b.ToTable("MenuJoinList");
                });

            modelBuilder.Entity("API.Entities.MstrAgentLevel", b =>
                {
                    b.Property<byte>("AutoId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("tinyint");

                    b.Property<byte>("AgentLevel")
                        .HasColumnType("tinyint");

                    b.Property<string>("LevelDescription")
                        .IsRequired()
                        .HasColumnType("varchar(30)");

                    b.Property<byte>("LevelPrority")
                        .HasColumnType("tinyint");

                    b.HasKey("AutoId");

                    b.ToTable("Master.AgentLevel");
                });

            modelBuilder.Entity("API.Entities.MstrAgents", b =>
                {
                    b.Property<int>("idAgents")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("CreatedDateTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("Factory")
                        .IsRequired()
                        .HasColumnType("varchar(5)");

                    b.Property<int>("FactoryId")
                        .HasColumnType("int");

                    b.Property<int>("bActive")
                        .HasColumnType("int");

                    b.Property<string>("cAgentName")
                        .IsRequired()
                        .HasColumnType("varchar(20)");

                    b.Property<string>("cDescription")
                        .HasColumnType("varchar(50)");

                    b.Property<string>("cEmail")
                        .HasColumnType("varchar(50)");

                    b.Property<string>("cPassword")
                        .IsRequired()
                        .HasColumnType("varchar(24)");

                    b.Property<byte>("iCategoryLevel")
                        .HasColumnType("tinyint");

                    b.Property<byte[]>("passwordHash")
                        .IsRequired()
                        .HasColumnType("varbinary(max)");

                    b.Property<byte[]>("passwordSalt")
                        .IsRequired()
                        .HasColumnType("varbinary(max)");

                    b.HasKey("idAgents");

                    b.HasIndex("FactoryId");

                    b.HasIndex("iCategoryLevel");

                    b.ToTable("Master.Agents");
                });

            modelBuilder.Entity("API.Entities.MstrBuyer", b =>
                {
                    b.Property<int>("AutoIdx")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("BuyerCompanyCode")
                        .HasColumnType("int");

                    b.Property<string>("CompanyName")
                        .IsRequired()
                        .HasColumnType("varchar(100)");

                    b.Property<string>("CompanyShortName")
                        .IsRequired()
                        .HasColumnType("varchar(20)");

                    b.HasKey("AutoIdx");

                    b.ToTable("Master.Buyer");
                });

            modelBuilder.Entity("API.Entities.MstrDivision", b =>
                {
                    b.Property<int>("AutoIdx")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("DivisionName")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.HasKey("AutoIdx");

                    b.ToTable("Master.Division");
                });

            modelBuilder.Entity("API.Entities.MstrFactory", b =>
                {
                    b.Property<int>("AutoId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.Property<string>("Factory")
                        .IsRequired()
                        .HasColumnType("varchar(5)");

                    b.Property<int>("TimeZone")
                        .HasColumnType("int");

                    b.HasKey("AutoId");

                    b.ToTable("Master.Factory");
                });

            modelBuilder.Entity("API.Entities.MstrMenuLevel", b =>
                {
                    b.Property<int>("AutoIdx")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("MenuID")
                        .HasColumnType("int");

                    b.Property<byte>("iCategoryLevel")
                        .HasColumnType("tinyint");

                    b.HasKey("AutoIdx");

                    b.HasIndex("MenuID");

                    b.HasIndex("iCategoryLevel");

                    b.ToTable("Master.MenuLevel");
                });

            modelBuilder.Entity("API.Entities.MstrMenuList", b =>
                {
                    b.Property<int>("AutoIdx")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("CreateDateTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("CreateUserID")
                        .HasColumnType("int");

                    b.Property<string>("GroupName")
                        .IsRequired()
                        .HasColumnType("varchar(20)");

                    b.Property<string>("MenuDescription")
                        .IsRequired()
                        .HasColumnType("varchar(100)");

                    b.Property<string>("MenuName")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.Property<int?>("MstrAgentsidAgents")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdateDateTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("UpdateUserID")
                        .HasColumnType("int");

                    b.Property<string>("mType")
                        .IsRequired()
                        .HasColumnType("char(1)");

                    b.HasKey("AutoIdx");

                    b.HasIndex("MstrAgentsidAgents");

                    b.ToTable("Master.MenuList");
                });

            modelBuilder.Entity("API.Entities.MstrMenuUser", b =>
                {
                    b.Property<int>("AutoId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("MenuId")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("AutoId");

                    b.HasIndex("MenuId");

                    b.HasIndex("UserId");

                    b.ToTable("Master.MenuUser");
                });

            modelBuilder.Entity("API.Entities.MstrProduct", b =>
                {
                    b.Property<int>("AutoIdx")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ProductName")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.HasKey("AutoIdx");

                    b.ToTable("Master.Product");
                });

            modelBuilder.Entity("API.Entities.MstrSeason", b =>
                {
                    b.Property<int>("AutoIdx")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Season")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.HasKey("AutoIdx");

                    b.ToTable("Master.Season");
                });

            modelBuilder.Entity("API.Entities.MstrStyle", b =>
                {
                    b.Property<int>("AutoIdx")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Description")
                        .HasColumnType("varchar(200)");

                    b.Property<int>("Link_BuyerId")
                        .HasColumnType("int");

                    b.Property<int>("Link_ProductID")
                        .HasColumnType("int");

                    b.Property<string>("StyleName")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.HasKey("AutoIdx");

                    b.HasIndex("Link_BuyerId");

                    b.HasIndex("Link_ProductID");

                    b.ToTable("Master.Style");
                });

            modelBuilder.Entity("API.Entities.MstrAgents", b =>
                {
                    b.HasOne("API.Entities.MstrFactory", "Factory_Link")
                        .WithMany()
                        .HasForeignKey("FactoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Entities.MstrAgentLevel", "Category_Link")
                        .WithMany("Users")
                        .HasForeignKey("iCategoryLevel")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("API.Entities.MstrMenuLevel", b =>
                {
                    b.HasOne("API.Entities.MstrMenuList", "MenuList")
                        .WithMany()
                        .HasForeignKey("MenuID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Entities.MstrAgentLevel", "Level")
                        .WithMany()
                        .HasForeignKey("iCategoryLevel")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("API.Entities.MstrMenuList", b =>
                {
                    b.HasOne("API.Entities.MstrAgents", null)
                        .WithMany("Menus")
                        .HasForeignKey("MstrAgentsidAgents");
                });

            modelBuilder.Entity("API.Entities.MstrMenuUser", b =>
                {
                    b.HasOne("API.Entities.MstrMenuList", "Menu")
                        .WithMany()
                        .HasForeignKey("MenuId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Entities.MstrAgents", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("API.Entities.MstrStyle", b =>
                {
                    b.HasOne("API.Entities.MstrBuyer", "Buyers")
                        .WithMany("Styles")
                        .HasForeignKey("Link_BuyerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Entities.MstrProduct", "Products")
                        .WithMany("Styles")
                        .HasForeignKey("Link_ProductID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
