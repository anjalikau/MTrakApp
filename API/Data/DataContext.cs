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
        public DbSet<MstrStyle> MstrStyle { get; set; }
        

    }
}