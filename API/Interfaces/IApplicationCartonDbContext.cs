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
        DbSet<MstrCustomerLocation> MstrCustomerLocation { get;  set; }
        DbSet<MstrUnits> MstrUnits { get;  set ; }       
        DbSet<MstrStoreSite> MstrStoreSite { get;  set ; }
        DbSet<MstrProcess> MstrProcess { get;  set ; }
        DbSet<MstrBrand> MstrBrand { get;  set ; }
        DbSet<MstrBrandCode> MstrBrandCode { get;  set ; }
        DbSet<MstrMaterialType> MstrMaterialType { get;  set ; }
        DbSet<MstrCategory> MstrCategory { get;  set ; }
        DbSet<TransCostingHeader> TransCostingHeader { get;  set ; }
        DbSet<MstrCombination> MstrCombination { get;  set ; }
        DbSet<MstrCustomerUsers> MstrCustomerUsers { get;  set ; }
        DbSet<MstrSalesCategory> MstrSalesCategory { get;  set ; }
        DbSet<MstrCustomerCurrency> MstrCustomerCurrency { get;  set ; }
        DbSet<MstrCurrency> MstrCurrency { get;  set ; }        
        DbSet<MstrCountries> MstrCountries { get;  set ; }
        DbSet<MstrPaymentTerm> MstrPaymentTerm { get;  set ; }
        DbSet<MstrProductType> MstrProductType { get;  set ; }
        DbSet<MstrProductGroup> MstrProductGroup { get;  set ; }
        DbSet<MstrProductSubCat> MstrProductSubCat { get;  set ; }
        DbSet<MstrProductionDefinitionDt> MstrProdDefinitionDt { get;  set ; }
        DbSet<MstrProductionDefinitionHd> MstrProdDefinitionHd { get;  set ; }
        DbSet<MstrSalesAgent> MstrSalesAgent { get;  set ; }
        DbSet<MstrCustomerDivision> MstrCustomerDivision { get;  set ; }
        DbSet<MstrCustomerBrand> MstrCustomerBrand { get;  set ; }
        DbSet<MstrAddressType> MstrAddressType { get;  set ; }
        DbSet<MstrCustomerAddressList> MstrCustomerAddressList { get;  set ; }
        DbSet<MstrStatus> MstrStatus { get;  set ; }
        DbSet<TransFtyProductionOrder> TransFtyProductionOrder { get;  set ; }
        DbSet<TransFtyProductionOrderDt> TransFtyProductionOrderDt { get;  set ; }
        DbSet<TransFtyProductionProcessOrder> TransFtyProdProcessOrder { get;  set ; }        
        DbSet<TransFtyProductionProcessOrderDt> TransFtyProdProcessOrderDt { get;  set ; }
        DbSet<MstrCostingGroup> MstrCostingGroup { get;  set ; }
        DbSet<TransSequenceSettings> TransSequenceSettings { get;  set ; }
        DbSet<MstrFlexFieldDetails> MstrFlexFieldDetails { get;  set ; }
        DbSet<MstrFlexFieldValueList> MstrFlexFieldValueList { get;  set ; }
        DbSet<MstrCatProductType> MstrCatProductType { get;  set ; }
        DbSet<MstrProdTypeGroup> MstrProdTypeGroup { get;  set ; }
        DbSet<MstrCodeDefinition> MstrCodeDefinition {get; set;}
        DbSet<MstrRejectionReasons> MstrRejeReasons {get; set;}
        DbSet<TransDispatchHeader> TransDispatchHeader {get; set;}
        DbSet<TransDispatchDetails> TransDispatchDetails {get; set;}
        DbSet<MstrDispatchSite> MstrDispatchSite {get; set;}
        DbSet<MstrUnitConversion> UnitConversion {get; set;}
        DbSet<MstrFluteTypes> MstrFluteTypes {get; set;}        
        DbSet<MstrSpecialInstruction> MstrSpecialInstruction {get; set;}
        DbSet<MstrArticleUOMConversion> MstrArticleUOMConversion {get; set;}
        DbSet<TransSalesOrderHd> TransSalesOrderHeader { get; set;}
        DbSet<TransSalesOrderItemDt> TransSalesOrderItemDt { get; set;}
        DbSet<TransExchangeRate> TransExchangeRate { get; set;}
        DbSet<MstrTax> MstrTax { get; set;}
        DbSet<MstrBank> MstrBank { get; set;}

    }
}