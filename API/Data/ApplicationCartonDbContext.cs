using System.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class ApplicationCartonDbContext : DbContext, IApplicationCartonDbContext
    {
        public ApplicationCartonDbContext(DbContextOptions<ApplicationCartonDbContext> options) : base(options)
        {
        }

        public IDbConnection Connection => Database.GetDbConnection();   
        public DbSet<MstrLocation> MstrLocation {get; set;} 
        public DbSet<MstrMenuList> MstrMenuList { get; set; }
        public DbSet<MstrMenuLevel> MstrMenuLevel { get; set; }
        public DbSet<ErrorLog> ErrorLog { get; set; }
        public DbSet<MenuJoinList> MenuJoinList { get; set; }
        public DbSet<MstrMenuUser> MstrMenuUser{ get; set; }
        public DbSet<UserMenuList> UserMenuList {get; set;}  
        public DbSet<MstrColorCard> MstrColorCard { get; set;  }
        public DbSet<MstrSizeCard> MstrSizeCard { get;  set ; }
        public DbSet<MstrColor> MstrColor { get;  set;  }
        public DbSet<MstrSize> MstrSize { get;  set;  }
        public DbSet<MstrUserLocation> MstrUserLocation { get;  set; }
        public DbSet<MstrCompany> MstrCompany { get;  set; }
        public DbSet<MstrArticle> MstrArticle { get;  set; }
        public DbSet<MstrArticleColor> MstrArticleColor { get;  set; }
        public DbSet<MstrArticleSize> MstrArticleSize { get;  set; }
        public DbSet<MstrCustomerHeader> MstrCustomerHeader { get;  set; }
        public DbSet<MstrCustomerDetails> MstrCustomerDetails { get;  set; }
        public DbSet<MstrUnits> MstrUnits { get;  set ; }       
        public DbSet<MstrStoreSite> MstrStoreSite { get;  set ; }
        public DbSet<MstrProcess> MstrProcess { get;  set ; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MenuJoinList>().HasNoKey();
            modelBuilder.Entity<UserMenuList>().HasNoKey();
            modelBuilder.Entity<MstrColorCard>(a => {
                a.HasKey(a => a.AutoId);
                a.Property(e => e.AutoId).HasColumnType("tinyint");
            });
            modelBuilder.Entity<MstrSizeCard>(a => {
                a.HasKey(a => a.AutoId);
                a.Property(e => e.AutoId).HasColumnType("tinyint");
            });
            modelBuilder.Entity<MstrCompany>(a => {
                a.HasKey(a => a.AutoId);
                a.Property(e => e.AutoId).HasColumnType("tinyint");
            });
            modelBuilder.Entity<MstrCustomerDetails>()
                .Ignore(c => c.MstrCustomerHeader);
            modelBuilder.Entity<MstrCustomerHeader>()
                .Ignore(c => c.Location);
            // modelBuilder.Entity<MstrColor>(a => {
            //     a.HasKey(a => a.LinkColorCard);                
            //     a.Property(e => e.LinkColorCard).HasColumnType("tinyint");
            // });
            
        }

    }
}