using System.Data;
using System.Threading;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace API.Interfaces
{
    public interface IApplicationCartonDbContext
    {       
        IDbConnection Connection { get; }
        DatabaseFacade Database { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
        DbSet<MstrLocation> MstrLocation {get; set;}        
        DbSet<MstrMenuList> MstrMenuList { get; set; }
        DbSet<MstrMenuLevel> MstrMenuLevel { get; set; }
        DbSet<ErrorLog> ErrorLog { get; set; }
        DbSet<MenuJoinList> MenuJoinList { get; set; }
        DbSet<MstrMenuUser> MstrMenuUser{ get; set; }
        DbSet<UserMenuList> UserMenuList {get; set;}
        DbSet<MstrColorCard> MstrColorCard {get; set;}
        DbSet<MstrSizeCard> MstrSizeCard {get; set;}
        DbSet<MstrColor> MstrColor {get; set;}
        DbSet<MstrSize> MstrSize {get; set;}
        DbSet<MstrUserLocation> MstrUserLocation { get;  set; }
        DbSet<MstrCompany> MstrCompany { get;  set; }
        DbSet<MstrArticle> MstrArticle { get;  set; }
        DbSet<MstrArticleColor> MstrArticleColor { get;  set; }
        DbSet<MstrArticleSize> MstrArticleSize { get;  set; }
        DbSet<MstrCustomerHeader> MstrCustomerHeader { get;  set; }
        DbSet<MstrCustomerDetails> MstrCustomerDetails { get;  set; }
        DbSet<MstrUnits> MstrUnits { get;  set ; }       
        DbSet<MstrStoreSite> MstrStoreSite { get;  set ; }
        DbSet<MstrProcess> MstrProcess { get;  set ; }

    }
}