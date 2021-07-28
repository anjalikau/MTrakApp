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
        public DbSet<MstrCustomerLocation> MstrCustomerLocation { get;  set; }
        public DbSet<MstrUnits> MstrUnits { get;  set ; }       
        public DbSet<MstrStoreSite> MstrStoreSite { get;  set ; }
        public DbSet<MstrProcess> MstrProcess { get;  set ; }
        public DbSet<MstrBrand> MstrBrand { get;  set ; }
        public DbSet<MstrBrandCode> MstrBrandCode { get;  set ; }
        public DbSet<MstrMaterialType> MstrMaterialType { get;  set ; }
        public DbSet<MstrCategory> MstrCategory { get;  set ; }
        public DbSet<TransCostHeader> TransCostHeader { get;  set ; }
        public DbSet<MstrCombination> MstrCombination { get;  set ; }
        public DbSet<MstrCustomerUsers> MstrCustomerUsers { get;  set ; }
        public DbSet<MstrSalesCategory> MstrSalesCategory { get;  set ; }
        public DbSet<MstrCustomerCurrency> MstrCustomerCurrency { get;  set ; }
        public DbSet<MstrCurrency> MstrCurrency { get;  set ; }
        public DbSet<MstrCountries> MstrCountries { get;  set ; }
        public DbSet<MstrPaymentTerm> MstrPaymentTerm { get;  set ; }
        public DbSet<MstrProductType> MstrProductType { get;  set ; }
        public DbSet<MstrProductGroup> MstrProductGroup { get;  set ; }
        public DbSet<MstrProductSubCat> MstrProductSubCat { get;  set ; }
        public DbSet<MstrProductionDefinitionDt> MstrProdDefinitionDt { get;  set ; }
        public DbSet<MstrProductionDefinitionHd> MstrProdDefinitionHd { get;  set ; }
        public DbSet<MstrSalesAgent> MstrSalesAgent { get;  set ; }
        public DbSet<MstrCustomerDivision> MstrCustomerDivision { get;  set ; }
        public DbSet<MstrCustomerBrand> MstrCustomerBrand { get;  set ; }
        public DbSet<MstrAddressType> MstrAddressType { get;  set ; }
        public DbSet<MstrCustomerAddressList> MstrCustomerAddressList { get;  set ; }
        public DbSet<MstrStatus> MstrStatus { get;  set ; }
        public DbSet<TransFtyProductionOrder> TransFtyProductionOrder { get;  set ; }
        public DbSet<TransFtyProductionOrderDt> TransFtyProductionOrderDt { get;  set ; }
        public DbSet<TransFtyProductionProcessOrder> TransFtyProdProcessOrder { get;  set ; }        
        public DbSet<TransFtyProductionProcessOrderDt> TransFtyProdProcessOrderDt { get;  set ; }
        public DbSet<MstrCostingGroup> MstrCostingGroup { get;  set ; }
        public DbSet<MstrSerialNoDetails> MstrSerialNoDetails { get;  set ; }
        public DbSet<MstrFlexFieldDetails> MstrFlexFieldDetails { get;  set ; }
        public DbSet<MstrFlexFieldValueList> MstrFlexFieldValueList { get;  set ; }

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
            modelBuilder.Entity<MstrCustomerLocation>()
                .Ignore(c => c.MstrCustomerHeader );
            modelBuilder.Entity<MstrCustomerHeader>()
                .Ignore(c => c.Location)
                .Ignore(c => c.MstrCurrency)
                .Ignore(c => c.MstrCountries);
            modelBuilder.Entity<MstrBrand>()
                .Ignore(c => c.UserLocation);
            // modelBuilder.Entity<MstrColor>(a => {
            //     a.HasKey(a => a.LinkColorCard);                
            //     a.Property(e => e.LinkColorCard).HasColumnType("tinyint");
            // });
            
        }

    }
}