using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Entities.Admin;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers.Master
{
    [Authorize]
    public class MasterController : BaseApiController
    {
        private readonly IMasterRepository _masterRepository;
        private readonly IMapper _mapper;
        private readonly IApplicationCartonDbContext _context;
        public MasterController(IMasterRepository masterRepository, IApplicationCartonDbContext context , IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
            _masterRepository = masterRepository;
        }

        #region "MenuList"
        // [HttpPost("AuthMenus")]
        // public async Task<ActionResult<IEnumerable<MenuJoinList>>> GetAuthMenuList(UserDto userDto)
        // {
        //     var menuList = await _masterRepository.GetAuthMenuListAsync(userDto);
        //     return Ok(menuList);
        // }        

        [HttpGet("Menulist")]
        public async Task<ActionResult<IEnumerable<MenuJoinList>>> GetMenuList()
        {
            var menuList = await _masterRepository.GetMenuListAsync();
            return Ok(menuList);
        }   

        // [HttpPost("User/Location")]
        // public async Task<ActionResult<IEnumerable<MstrUserLocation>>> GetUserLoction(MstrAgentModule userMod)
        // {
        //     var loc = _context.MstrUserLocation.Include(x => x.Location).AsNoTracking().ToList();
        //     return Ok(loc);
        //     // var location = await _adminRepository.GetUserLocAsync(userMod);
        //     // var locationToReturn = _mapper.Map<IEnumerable<UserLocationDto>>(location);
        //     // return Ok(locationToReturn);
        // }     

        [HttpGet("UserMenus/{id}")]
        public async Task<ActionResult<IEnumerable<UserMenuList>>> GetUserMenuList(int id)
        {
            var menuList = await _masterRepository.GetUserMenuList(id);
            return Ok(menuList);
        }

        #endregion "MenuList"


        #region "UserLocation"

        [HttpPost("Loc/SetDefault")]
        public async Task<IActionResult> SetDefaultLocation(MstrUserLocation userLoc)
        {
             var result = await _masterRepository.SetDefaultLocationAsync(userLoc);
             return Ok(result);
        }

        #endregion "UserLocation"


        #region "Color"

        [HttpGet("Color/{id}")]
        public async Task<IActionResult> GetColor(int id)
        { 
            var result = await _context.MstrColor.Where(e => e.LinkColorCard == id).ToListAsync();        
            return Ok(result);
        }

        [HttpPost("Color")]
        public async Task<ActionResult> SaveColor(MstrColor color)
        {
            var result = await _masterRepository.SaveColorAsync(color);
            return Ok(result);
        }

        [HttpGet("ColorCard")]
        public async Task<IActionResult> GetColorCard()
        {
            var result = await _context.MstrColorCard.ToListAsync();
            return Ok(result);
        }

        [HttpPost("ColorCard")]
        public async Task<ActionResult> SaveColorCard(MstrColorCard colorCard)
        {           
            var result = await _masterRepository.SaveColorCardAsync(colorCard); 
            return Ok(result);
        }

        [HttpPost("ColorCard/Deactive")]
        public async Task<ActionResult> DeactiveColorCard(MstrColorCard colorCard)
        {           
            var result = await _masterRepository.DeactiveColorCardAsync(colorCard); 
            return Ok(result);
        }

        #endregion "Color"


        #region "Size"

        [HttpGet("SizeCard")]
        public async Task<IActionResult> GetSizeCard()
        {
            var result = await _context.MstrSizeCard.ToListAsync();
            return Ok(result);
        }

        [HttpGet("Size/{id}")]
        public async Task<IActionResult> GetSize(int id)
        {
            var result = await _context.MstrSize.Where(e => e.LinkSizeCard == id).ToListAsync();
            return Ok(result);
        }

        [HttpPost("SizeCard/Deactive")]
        public async Task<ActionResult> DeactiveSizeCard(MstrSizeCard sizeCard)
        {           
            var result = await _masterRepository.DeactiveSizeCardAsync(sizeCard); 
            return Ok(result);
        }

        [HttpPost("SizeCard")]
        public async Task<ActionResult> SaveSizeCard(MstrSizeCard sizeCard)
        {
            var result = await _masterRepository.SaveSizeCardAsync(sizeCard);
            return Ok(result);
        }

        [HttpPost("Size")]
        public async Task<ActionResult> SaveSize(MstrSize size)
        {
            var result = await _masterRepository.SaveSizeAsync(size);
            return Ok(result);
        }

        #endregion "Size"


        #region "Company"

        [HttpGet("Company/{id}")]
        public async Task<IActionResult> GetCompany(int id)
        {
            var result = await _context.MstrCompany.ToListAsync();
            return Ok(result);
        }

        #endregion "Company"


        #region  "Article"

        [HttpGet("Articles")]
        public async Task<IActionResult> GetArticles()
        {
            var articleList = await _context.MstrArticle
                .Join(_context.MstrCategory, a => a.CategoryId , c => c.AutoId
                    , (a, c) => new { a , c })
                .Join(_context.MstrMaterialType , am => am.a.MaterialId , m => m.AutoId
                    ,(am , m) => new {am , m })
                .Join (_context.MstrUnits , au => au.am.a.UnitId , u => u.AutoId ,
                    (au , u) => new { au , u })
                .Join(_context.MstrProductType , ap => ap.au.am.a.ProTypeId , p => p.AutoId,
                    (ap , p) => new { ap , p})
                .Join(_context.MstrProductSubCat, aps => aps.ap.au.am.a.SubCatId , s => s.AutoId , 
                    ( aps , s) => 
                    new 
                    {
                        autoId = aps.ap.au.am.a.AutoId,
                        unitCode = aps.ap.u.Code,
                        materialCode = aps.ap.au.m.Code,
                        catCode = aps.ap.au.am.c.Code,
                        prodTypeCode = aps.p.ProdTypeCode,
                        subCatCode = s.ProdSubCatCode,
                        unitId = aps.ap.au.am.a.UnitId,
                        materialId = aps.ap.au.am.a.MaterialId,
                        categoryId = aps.ap.au.am.a.CategoryId,
                        proTypeId = aps.ap.au.am.a.ProTypeId,
                        subCatId = aps.ap.au.am.a.SubCatId,
                        articleName = aps.ap.au.am.a.ArticleName,
                        stockCode = aps.ap.au.am.a.StockCode,
                        height = aps.ap.au.am.a.Height,
                        width = aps.ap.au.am.a.Width,
                        length = aps.ap.au.am.a.Length,
                        description1 = aps.ap.au.am.a.Description1,
                        description2 = aps.ap.au.am.a.Description2
                    })
                .ToListAsync();
                
            return Ok(articleList);
        }

        [HttpGet("ArtiColor/{id}")]
        public async Task<IActionResult> GetArticleColor(int id)
        {            
            var colorList = await _masterRepository.GetArticlColorAsync(id);
            return Ok(colorList);
        }

        [HttpGet("ArtiSize/{id}")]
        public async Task<IActionResult> GetArticleSize(int id)
        {            
            var sizeList = await _masterRepository.GetArticlSizeAsync(id);
            return Ok(sizeList);
        }

        #endregion "Article"


        #region "CustomerHeader"

        [HttpGet("Customer/{locId}")]
        public async Task<IActionResult> GetCustomer(int locId)
        {
            var customerList = await _context.MstrCustomerHeader
                .Where(x => x.LocationId == locId)
                .Select(x => new {x.ShortCode , x.Name , x.AutoId})
                .ToListAsync();
            return Ok(customerList);
        }

        [HttpGet("CustomerHd/All/{LocId}")]
        public async Task<IActionResult> GetCustomerHeaderAll(int LocId)
        {
            var result = await _masterRepository.GetCustomerHdAllAsync(LocId);
            return Ok(result);
        }  
        
        [HttpPost("CustHdDeactive")]
        public async Task<ActionResult> DeactiveCustomerHeader(MstrCustomerHeader mstrCustomerHeader)
        {           
            var result = await _masterRepository.DeactiveCustomerHdAsync(mstrCustomerHeader); 
            return Ok(result);
        }

        [HttpPost("SaveCustomerHd")]
        public async Task<ActionResult> SaveCustomerHeader(MstrCustomerHeader MstrCustomerHeader)
        {
            var result = await _masterRepository.SaveCustomerHdAsync(MstrCustomerHeader);
            return Ok(result);
        }        

        #endregion "CustomerHeader"


        #region "CustomerLocation"       
  

        [HttpGet("CustomerLoc/{id}")]
        public async Task<IActionResult> GetCustomerLoc(int id)
        {
            var customerList = await _context.MstrCustomerLocation
                    .Where(x => x.CustomerId == id)
                    //.Select(x => new {x.ShortCode , x.Name , x.AutoId})
                    .ToListAsync();
            return Ok(customerList);
        }       

        // [HttpPost("CustomerLoc/Deactive")]
        // public async Task<ActionResult> DeactiveCustomerLocation(MstrCustomerLocation customerLoc)
        // {           
        //     var result = await _masterRepository.DeactiveCusLocAsync(customerLoc); 
        //     return Ok(result);
        // }        
         
        [HttpPost("SaveCustomerLoc")]
        public async Task<ActionResult> SaveCustomerLoc(MstrCustomerLocation customerLoc)
        {
            var result = await _masterRepository.SaveCustomerLocAsync(customerLoc);
            return Ok(result);
        }  
        
        #endregion "CustomerLocation"


        #region "CustomerUser"

        [HttpGet("CustomerUser/{id}")]
        public async Task<IActionResult> GetCustomerUser(int id)
        {
            var customerList = await _context.MstrCustomerUsers
                    .Where(x => x.CustomerId == id)
                    .Select(x => new {Name = x.Title + ' ' + x.FirstName +' ' + x.LastName , x.AutoId})
                    .ToListAsync();
            return Ok(customerList);
        } 

        [HttpGet("CustomerUser/All/{id}")]
        public async Task<IActionResult> GetCustomerUserAllDt(int id)
        {
            var customerList = await _context.MstrCustomerUsers
                    .Where(x => x.CustomerId == id)
                    .ToListAsync();
            return Ok(customerList);
        }   

        [HttpPost("SaveCusUser")]
        public async Task<IActionResult> SaveCustomerUser(MstrCustomerUsers customerUser)
        {
            var result = await _masterRepository.SaveCustomerUserAsync(customerUser);
            return Ok(result);
        }

        [HttpPost("CusUser/Deactive")]
        public async Task<IActionResult> DeactiveCustomerUser(MstrCustomerUsers cusUser)
        {
            var result = await _masterRepository.DeactiveCustomerUserAsync(cusUser);
            return Ok(result);
        }

        #endregion "CustomerUser"


        #region "CustomerCurrency"

        [HttpGet("CusCurrency/{id}")]
        public async Task<IActionResult> GetCusCurrency(int id)
        {
            var currencyList = await _context.MstrCustomerCurrency
                .Where(x => x.CustomerId == id)
                .Join(_context.MstrCurrency, m => m.CurrencyId, c => c.AutoId
                    , (m, c) =>
                    new
                    {
                        autoId = m.AutoId,
                        currencyId = m.CurrencyId,
                        code = c.Code,
                        name = c.Name,
                        symbol = c.Symbol                        
                    })                
                .ToListAsync();
          
            return Ok(currencyList);
        } 

        [HttpPost("SaveCusCurrency")]  
        public async Task<IActionResult> SaveCusCurrency(MstrCustomerCurrency cusCurrency)
        {
            var result = await _masterRepository.SaveCustomerCurrencyAsync(cusCurrency);
            return Ok(result);
        }  

        [HttpPost("DeleteCusCurrency")]  
        public async Task<IActionResult> DeleteCusCurrency(MstrCustomerCurrency cusCurrency)
        {
            var result = await _masterRepository.DeleteCusCurrencyAsync(cusCurrency);
            return Ok(result);
        }    

        #endregion "CustomerCurrency"


        #region "CustomerBrand"

        [HttpGet("CusBrand/{customerId}")]
        public async Task<IActionResult> GetCustomerBrand(int customerId)
        {
            var brandList = await _context.MstrCustomerBrand
                .Where(x => x.CustomerId == customerId)
                .Join(_context.MstrBrand , c => c.BrandId , b => b.AutoId 
                    , (c , b) => 
                    new {
                        autoId = c.AutoId,
                        brand = b.Name,
                        brandId = c.BrandId                        
                    })                
                .ToListAsync();
            return Ok(brandList);
        }

        [HttpPost("Save/CusBrand")]
        public async Task<IActionResult> SaveCustomerBrand(MstrCustomerBrand cusBrand)
        {
            var result = await _masterRepository.SaveCustomerBrandAsync(cusBrand);
            return Ok(result);
        }

        [HttpPost("Delete/CusBrand")]
        public async Task<IActionResult> DeleteCusBrand(MstrCustomerBrand cusBrand)
        {
            var result = await _masterRepository.DeleteCusBrandAsync(cusBrand);
            return Ok(result);
        }


        #endregion "CustomerBrand"


        #region "CustomerDivision"

        [HttpGet("CusDivision/{id}")]
        public async Task<IActionResult> GetCustomerDivision(int id)
        {
            var divisionList = await _context.MstrCustomerDivision
                .Where(x => x.CustomerId == id)
                .Select(x => new {x.Details , x.AutoId , x.bActive})
                .ToListAsync();

            return Ok(divisionList);
        }

        [HttpPost("SaveCusDivision")]
        public async Task<IActionResult> SaveCustomerDivision(MstrCustomerDivision cusDivision)
        {
            var result = await _masterRepository.SaveCustomerDivisionAsync(cusDivision);
            return Ok(result);
        }

        #endregion "CustomerDivision"


        #region "CustomerAddressList"

        [HttpPost("SaveCusAddress")]
        public async Task<IActionResult> SaveCustomerAddressList(MstrCustomerAddressList cusAddressList)
        {
            var result = await _masterRepository.SaveCusAddressAsync(cusAddressList);
            return Ok(result);
        }

        [HttpGet("CusAddress/{customerId}")]
        public async Task<IActionResult> GetCustomerAddressList(int customerId)
        {
            var result = await _masterRepository.GetCustomerAddressAsync(customerId);
            return Ok(result);
        }

        #endregion "CustomerAddressList"

        #region "AddressType"

        [HttpGet("AddressType")]
        public async Task<IActionResult> GetAddressType()
        {
            var addressList = await _context.MstrAddressType
                .Select(x => new {x.AddressCode , x.AddressCodeName , x.AutoId})
                .ToListAsync();
            return Ok(addressList);
        }

        #endregion "AddressType"

        #region "Unit"

        [HttpPost("Editunits")]
        public async Task<ActionResult> saveUnits(MstrUnits units)
        {
            var result = await _masterRepository.SaveUnitAsync(units);
            return Ok(result);
        }

        [HttpGet("Units")]
        public async Task<IActionResult> GetUnit()
        {
            var result = await _context.MstrUnits.ToListAsync();
            return Ok(result);            
        }

        [HttpPost("saveunits")]
        public async Task<ActionResult> Register(MstrUnitsDto MstrUnitsDto)
        {
            var user = _mapper.Map<MstrUnits>(MstrUnitsDto);

            user.Code = MstrUnitsDto.Code;
            user.Name = MstrUnitsDto.Name; 
            
            _context.MstrUnits.Add(user);
            await _context.SaveChangesAsync(default);           

            return Ok();
        }

        #endregion "Unit"

        #region "Process"

        [HttpPost("SaveProcess")]
        public async Task<ActionResult> saveProcess(MstrProcess MstrProcess)
        {
            var result = await _masterRepository.SaveProcessAsync(MstrProcess);
            return Ok(result);
        }

        [HttpGet("Process")]
        public async Task<IActionResult> GetProcess()
        {
            var result = await _context.MstrProcess.ToListAsync();
            return Ok(result);            
        }

        #endregion "Process"

        #region "StoreSite"

        [HttpPost("SaveStoreSite")]
        public async Task<ActionResult> saveStoreSite(MstrStoreSite MstrStoreSite)
        {
            var result = await _masterRepository.SaveStoresiteAsync(MstrStoreSite);
            return Ok(result);
        }

        [HttpGet("Storesite")]
        public async Task<IActionResult> GetStoresite()
        {
            var result = await _context.MstrStoreSite.ToListAsync();
            return Ok(result);            
        }

       #endregion "StoreSite"


        #region  "Location"

        [HttpGet("MasterLocation")]
        public async Task<IActionResult> GetMstrLocation()
        {
            var result = await _context.MstrLocation.ToListAsync();
            return Ok(result);            
        }  

        #endregion "Location"


        #region "Category"

        [HttpPost("SaveCategory")]
        public async Task<ActionResult> saveCategory(MstrCategory Category)
        {
            var result = await _masterRepository.SaveCategoryAsync(Category);
            return Ok(result);
        }   

        [HttpGet("Category")]
        public async Task<IActionResult> GetCategory()
        {
            var result = await _context.MstrCategory.ToListAsync();
            return Ok(result);            
        } 

        #endregion "Category"   


        #region "MaterialType"   

        [HttpGet("MaterialType")]
        public async Task<IActionResult> GetMaterialType()
        {
            var result = await _context.MstrMaterialType.ToListAsync();
            return Ok(result);            
        }

        [HttpPost("SaveMaterialType")]
        public async Task<ActionResult> SaveMaterialType(MstrMaterialType MaterialType)
        {
            var result = await _masterRepository.SaveMaterialTypeAsync(MaterialType);
            return Ok(result);
        }

        #endregion "MaterialType"


        #region "Brand"

        /// GET LOCATION BAESED BRAND ONLY
        [HttpGet("Brand/{LocId}")]
        public async Task<IActionResult> GetBrand(int LocId)
        {
            var result = await _context.MstrBrand
                    .Where(x => x.LocationId == LocId)
                    .ToListAsync();
            return Ok(result);            
        }

        [HttpPost("SaveBrand")]
        public async Task<ActionResult> saveProcess(MstrBrand MstrBrand)
        {
            var result = await _masterRepository.SaveBrandAsync(MstrBrand);
            return Ok(result);
        }
        
        [HttpGet("BrandCode")]
        public async Task<IActionResult> GetBrandCode()
        {
            var result = await _context.MstrBrandCode.ToListAsync();
            return Ok(result);            
        }

        [HttpGet("BrandCode/{id}")]
        public async Task<IActionResult> GetBrandCode(int id)
        { 
            var result = await _context.MstrBrandCode.Where(e => e.BrandId == id).ToListAsync();        
            return Ok(result);
        }

        [HttpPost("SaveBrandCode")]
        public async Task<ActionResult> saveProcess(MstrBrandCode MstrBrandCode)
        {
            var result = await _masterRepository.SaveBrandCodeAsync(MstrBrandCode);
            return Ok(result);
        }

        #endregion "Brand"
      

        #region "SalesCategory"

        [HttpGet("SalesCat")]
        public async Task<IActionResult> GetSalesCategory()
        {
            var customerList = await _context.MstrSalesCategory
                    .Select(x => new {x.Name , x.Code , x.AutoId})
                    .ToListAsync();
            return Ok(customerList);
        }   

        #endregion "SalesCategory"     


        #region "PaymentTerms"

        [HttpGet("PayTerms")]
        public async Task<IActionResult> GetPaymentTerms()
        {
            var payTermList = await _context.MstrPaymentTerm
                .Select(x => new {x.Name , x.Code , x.AutoId})
                .ToListAsync();
          
            return Ok(payTermList);
        }

        #endregion "PaymentTerms" 


        #region "Countries"

        [HttpGet("Countries")]
        public async Task<IActionResult> GetCountries()
        {
            var countryList = await _context.MstrCountries
                .Select(x => new {x.Name , x.Code , x.AutoId})
                .ToListAsync();
          
            return Ok(countryList);
        }

        #endregion "Countries"


        #region "Currency"

        [HttpGet("Currency")]
        public async Task<IActionResult> GetCurrency()
        {
            var currencyList = await _context.MstrCurrency
            .Select(x => new {x.AutoId , x.Code , x.Name})
            .ToListAsync();

            return Ok(currencyList);
        }

        #endregion "Currency"


        #region "SalesAgent"

        [HttpGet("SalesAgent")]
        public async Task<IActionResult> GetSalesAgent()
        {
            var agentList = await _context.MstrSalesAgent
                .Select(x => new {x.Name , x.AutoId})
                .ToListAsync();

            return Ok(agentList);
        }

        #endregion "SalesAgent"

        // private async Task<bool> ColorExists(MstrColor color)
        // {
        //     return await _context.MstrColor
        //         .AnyAsync(x => x.Name.ToLower() == color.Name.ToLower() && x.Code.ToLower() == color.Code.ToLower());
        // }

        // private async Task<bool> SizeExists(MstrSize size)
        // {
        //     return await _context.MstrSize
        //         .AnyAsync(x => x.Name.ToLower() == size.Name.ToLower() && x.Code.ToLower() == size.Code.ToLower());
        // }

        // private async Task<bool> SizeCardExists(string sizeCard)
        // {
        //     return await _context.MstrSizeCard.AnyAsync(x => x.Name.ToLower() == sizeCard.ToLower());
        // }
        // private async Task<bool> ColorCardExists(string colorCard)
        // {
        //     return await _context.MstrColorCard.AnyAsync(x => x.Name.ToLower() == colorCard.ToLower());
        // }
        
    }
}