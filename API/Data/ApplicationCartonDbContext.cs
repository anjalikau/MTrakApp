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
        public DbSet<MstrUserLocation> MstrUserLocation { get;  set;  }

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
            // modelBuilder.Entity<MstrColor>(a => {
            //     a.HasKey(a => a.LinkColorCard);                
            //     a.Property(e => e.LinkColorCard).HasColumnType("tinyint");
            // });
            
        }

    }
}