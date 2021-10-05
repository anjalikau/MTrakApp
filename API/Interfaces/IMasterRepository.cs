using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Entities.Admin;

namespace API.Interfaces
{
    public interface IMasterRepository    
    {        
        Task<IEnumerable<MenuJoinList>> GetMenuListAsync();
        Task<int> SaveMenuListAsync(MenuListDto menuListDto);        
        Task<IEnumerable<UserMenuList>> GetUserMenuList(int userId);
        Task<int> SaveUserMenuListAsync(List<MenuUserDto> menuList);
        Task<int> DeleteUserMenuListAsync(List<MenuUserDto> menuList);
        Task<IEnumerable<PermitMenuDto>> GetAuthMenuListAsync(UserDto userDto);
        //Task<IEnumerable<ResultSet>> SaveMenuListAsync(MenuListDto menuListDto);
        Task<MstrUserLocation> GetDefaultLocForUser(int userId);
        Task<int> SetDefaultLocationAsync(MstrUserLocation userLoc);
        Task<int> SaveColorCardAsync(MstrColorCard mstrccard);
        Task<int> SaveSizeCardAsync(MstrSizeCard mstrscard);
        Task<int> SaveSizeAsync(MstrSize mstrSize);
        Task<int> SaveColorAsync(MstrColor mstrColor);
        Task<int> DeactiveSizeCardAsync(MstrSizeCard mstrscard);
        Task<int> DeactiveColorCardAsync(MstrColorCard mstrccard);
        Task<IEnumerable<MstrColor>> GetArticlColorAsync(int articleId);
        Task<IEnumerable<MstrSize>> GetArticlSizeAsync(int articleId);
        Task<int> SaveUnitAsync(MstrUnits mstrUnits);
        Task<int> SaveProcessAsync(MstrProcess mstrProcess);
        Task<int> SaveStoresiteAsync(MstrStoreSite mstrStoreSite);        
        Task<int> SaveMaterialTypeAsync(MstrMaterialType MstrMaterialType);
        Task<int> SaveCategoryAsync(MstrCategory MstrCategory);
        Task<int> SaveBrandCodeAsync(MstrBrandCode MstrBrandCode);
        Task<int> SaveBrandAsync(MstrBrand MstrBrand);
        Task<int> DeactiveCustomerHdAsync(MstrCustomerHeader mstrCustomerHeader);   
        Task<IEnumerable<ReturnCustomerHdDto>> GetCustomerHdAllAsync(int LocId);     
        Task<int> SaveCustomerHdAsync(MstrCustomerHeader MstrCustomerHeader);
        Task<int> SaveCustomerLocAsync(MstrCustomerLocation customerLocation);
        Task<int> SaveCustomerUserAsync(MstrCustomerUsers customerUser);
        Task<int> DeactiveCustomerUserAsync(MstrCustomerUsers cusUser);
        Task<int> SaveCustomerBrandAsync(MstrCustomerBrand customerBrand);
        Task<int> DeleteCusCurrencyAsync(MstrCustomerCurrency customerCurrency);
        Task<int> SaveCustomerCurrencyAsync(MstrCustomerCurrency customercurrency);
        Task<int> SaveCusAddressAsync(MstrCustomerAddressList cusAddressList);
        Task<int> DeleteCusBrandAsync(MstrCustomerBrand customerBrand);
        Task<IEnumerable<ReturnCustomerAddDto>> GetCustomerAddressAsync(int customerId);
        Task<int> SaveCustomerDivisionAsync(MstrCustomerDivision cusDivision);
        // Task<int> DeactiveCusLocAsync(MstrCustomerLocation mstrCustomerDetails);
        Task<ReturnDto> SaveProdDefinitionAsync(ProdDefinitionDto prodDefinitionDto);
        Task<int> DeleteProdDefinitionAsync(ProdDefinitionDto prodDefDto);
        Task<IEnumerable<ProdDefinitionDto>> GetProdDefinitionAsync(byte ProdHeaderId);
        Task<int> SaveProductGroupAsync(MstrProductGroup MstrProductGroup);
        Task<IEnumerable<ProdGroupDto>> GetProductGroupAsync(int ProdTypeId);
        Task<int> DeactiveProdGroupAsync(MstrProductGroup MstrProductGroup);
        Task<int> SaveProductTypeAsync(MstrProductType MstrProductType);
        // Task<IEnumerable<ProductTypeDto>> ProductTypeGetAsync();
        Task<int> DeactProductTypeAsync(MstrProductType MstrProductType);
        Task<int> SaveProductSubCatAsync(MstrProductSubCat MstrProductSubCat);
        Task<IEnumerable<ProductSubCatDto>> GetProductSubCatAsync(int ProdGroupId); 
        Task<int> DeactiveProdSubCatAsync(MstrProductSubCat MstrProductSubCat);       
        Task<int> SaveCostGroupAsync(MstrCostingGroup MstrCostingGroup);        
        Task<int> SaveSerialNoDtAsync(MstrSerialNoDetails MstrSerialNoD);
        Task<int> SaveFlexFieldDetailsAsync(MstrFlexFieldDetails flexDetails); 
        Task<IEnumerable<FlexFieldReturnDto>> GetFlexFieldDtAsync(int CategoryId);
        Task<int> DeactiveFlexFieldDtAsync(MstrFlexFieldDetails flexFieldDt);
        Task<int> SaveFlexFieldValListAsync(MstrFlexFieldValueList flexDetailsVal);
        Task<int> DeleteFlexFieldValListAsync(MstrFlexFieldValueList flexDetailsVal);
        Task<ArticleReturnDto> SaveArticleAsync(MstrArticle article);
        Task<IEnumerable<ArticleDetailDto>> GetArtileDetailsAsync(ArticleSerchDto article);
        Task<IEnumerable<CatProdTypeDto>> GetCatProductTypeDtAsync(int catId);
        Task<int> AssignCatProdTypeAsync(List<MstrCatProductType> prod);
        Task<int> DeleteCatProdTypeAsync(List<MstrCatProductType> prod);
        Task<IEnumerable<ProdTypeGroupDto>> GetProdTypeGroupAsync(int prodTypeId);
        Task<int> AssignProdTypeGroupAsync(List<MstrProdTypeGroup> prod);
        Task<int> DeleteProdTypeGroupAsync(List<MstrProdTypeGroup> prod);   
        Task<IEnumerable<ColorAllocationDto>> GetColorAllocDetailsAsync(int ColorCardId);
        Task<int> SaveColorAllocationAsync(List<MstrColorAllocCard> colorAlloc);
        Task<int> DeleteColorAllocationAsync(List<MstrColorAllocCard> colorAlloc);  
        Task<IEnumerable<SizeAllocationDto>> GetSizeAllocDetailsAsync(int SizeCardId);
        Task<int> SaveSizeAllocationAsync(List<MstrSizeAllocCard> sizeAlloc); 
        Task<int> DeleteSizeAllocationAsync(List<MstrSizeAllocCard> sizeAlloc);       

    }
}