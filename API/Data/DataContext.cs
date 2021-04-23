using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<MstrSeason> MstrSeason { get; set; }
        public DbSet<MstrAgents> MstrAgents { get; set; }
        public DbSet<MstrBuyer> MstrBuyer { get; set; }
        public DbSet<MstrDivision> MstrDivision { get; set; }
        public DbSet<MstrProduct> MstrProduct { get; set; }
        //public DbSet<MstrStyle> MstrStyle { get; set; }
        public DbSet<MstrFactory> MstrFactory {get; set;}        
        public DbSet<MstrAgentLevel> MstrAgentLevel {get; set;}
        public DbSet<MstrMenuList> MstrMenuList { get; set; }
        public DbSet<MstrMenuLevel> MstrMenuLevel { get; set; }
        public DbSet<ErrorLog> ErrorLog { get; set; }
        public DbSet<MenuJoinList> MenuJoinList { get; set; }
        public DbSet<MstrMenuUser> MstrMenuUser{ get; set; }
        public DbSet<UserMenuList> UserMenuList {get; set;}

        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MenuJoinList>().HasNoKey();
            modelBuilder.Entity<UserMenuList>().HasNoKey();
        }
            


    }
}