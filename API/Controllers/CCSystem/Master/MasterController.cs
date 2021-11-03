using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers.CCSystem.Master
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

        [HttpGet("Color")]
        public async Task<IActionResult> GetColor()
        { 
            var result = await _context.MstrColor
                .Select(x => new {x.AutoId , x.Code , x.Name }).ToListAsync();        
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

        #region Color Allocation

        [HttpGet("ColorAlloc/{id}")]
        public async Task<IActionResult> GetColorAllocationDetails(int id)
        {
            var result = await _masterRepository.GetColorAllocDetailsAsync(id);
            return Ok(result);
        }

        [HttpPost("SaveColorAll")]
        public async Task<IActionResult> SaveColorAllocation(List<MstrColorAllocCard> colorAlloc)
        {
            var result = await _masterRepository.SaveColorAllocationAsync(colorAlloc);
            return Ok(result);
        }

        [HttpPost("DelColorAll")]
        public async Task<IActionResult> DeleteColorAllocation(List<MstrColorAllocCard> colorAlloc)
        {
            var result = await _masterRepository.DeleteColorAllocationAsync(colorAlloc);
            return Ok(result);
        }

        #endregion Color Allocation


        #region Size Allocation

        [HttpGet("SizeAlloc/{id}")]
        public async Task<IActionResult> GetSizeAllocDetails(int id)
        {
            var result = await _masterRepository.GetSizeAllocDetailsAsync(id);
            return Ok(result);
        }

        [HttpPost("SaveSizeAll")]
        public async Task<IActionResult> SaveSizeAllocation(List<MstrSizeAllocCard> sizeAlloc)
        {
            var result = await _masterRepository.SaveSizeAllocationAsync(sizeAlloc);
            return Ok(result);
        }

        [HttpPost("DelSizeAll")]
        public async Task<IActionResult> DeleteSizeAllocation(List<MstrSizeAllocCard> sizeAlloc)
        {
            var result = await _masterRepository.DeleteSizeAllocationAsync(sizeAlloc);
            return Ok(result);
        }

        #endregion Size Allocation


        #region "Size"

        [HttpGet("SizeCard")]
        public async Task<IActionResult> GetSizeCard()
        {
            var result = await _context.MstrSizeCard.ToListAsync();
            return Ok(result);
        }

        [HttpGet("Size")]
        public async Task<IActionResult> GetSize()
        {
            var result = await _context.MstrSize.ToListAsync();
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
                .Join (_context.MstrUnits , au => au.a.StorageUnitId , u => u.AutoId ,
                    (au , u) => new { au , u })
                .Join(_context.MstrProductType , ap => ap.au.a.ProTypeId , p => p.AutoId,
                    (ap , p) => new { ap , p})
                .Join(_context.MstrProductGroup, aps => aps.ap.au.a.ProGroupId , s => s.AutoId , 
                    ( aps , s) => new { aps, s})                
                .Join(_context.MstrUnits , am => am.aps.ap.au.a.MeasurementId , m => m.AutoId
                    ,(am , m) =>
                    new 
                    {
                        autoId = am.aps.ap.au.a.AutoId,
                        unitCode = am.aps.ap.u.Code,
                        catCode = am.aps.ap.au.c.Code,
                        prodTypeCode = am.aps.p.ProdTypeCode,
                        prodGroupCode = am.s.ProdGroupCode,
                        unitId = am.aps.ap.au.a.StorageUnitId,
                        measurementId = am.aps.ap.au.a.MeasurementId,
                        measurement = m.Code,
                        categoryId = am.aps.ap.au.a.CategoryId,
                        proTypeId = am.aps.ap.au.a.ProTypeId,
                        proGroupId = am.aps.ap.au.a.ProGroupId,
                        articleName = am.aps.ap.au.a.ArticleName,
                        stockCode = am.aps.ap.au.a.StockCode,
                        // height = am.aps.ap.au.a.Height,
                        // width = am.aps.ap.au.a.Width,
                        // length = am.aps.ap.au.a.Length,
                        // GSM = am.aps.ap.au.a.GSM,                        
                        // rollWidth = am.aps.ap.au.a.RollWidth,
                        description1 = am.aps.ap.au.a.Description1,
                        description2 = am.aps.ap.au.a.Description2,
                        avgCostPrice = am.aps.ap.au.a.AvgCostPrice,
                        maxCostPrice = am.aps.ap.au.a.MaxCostPrice,
                        lastCostPrice = am.aps.ap.au.a.LastCostPrice,
                    })
                .ToListAsync();
                
            return Ok(articleList);
        }

        [HttpGet("CCArticle")]
        public async Task<IActionResult> GetCCardArticle() 
        {
            var result = await _context.MstrArticle
                .Where(x => x.ColorCardId > 0)
                .Join( _context.MstrColorCard , x => x.ColorCardId , c => c.AutoId 
                , (x , c) => new {
                    autoId = x.AutoId , 
                    articleName = x.ArticleName , 
                    stockCode = x.StockCode , 
                    colorCardId = x.ColorCardId,
                    colorCard = c.Name
                }).ToListAsync();
            return Ok(result);
        }

        [HttpGet("SCArticle")]
        public async Task<IActionResult> GetSCardArticle() 
        {
            var result = await _context.MstrArticle
                .Where(x => x.SizeCardId > 0)
                .Join( _context.MstrSizeCard , x => x.SizeCardId , s => s.AutoId 
                , (x , s) => new {
                    autoId = x.AutoId , 
                    articleName = x.ArticleName , 
                    stockCode = x.StockCode , 
                    sizeCardId = x.SizeCardId,
                    sizeCard = s.Name
                }).ToListAsync();
            return Ok(result);
        }


        [HttpPost("ArtProdWise")]
        public async Task<IActionResult> GetArticleDetails(ArticleSerchDto article)
        {
            var articleList = await _masterRepository.GetArtileDetailsAsync(article);
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

        [HttpPost("SaveArticle")]
        public async Task<IActionResult> SaveArticle(SaveArticleDto article)
        {
            var result = await _masterRepository.SaveArticleAsync(article);
            return Ok(result);
        }

        [HttpGet("ArtPrice/{id}")]
        public async Task<IActionResult> GetArticlePriceList(int id) 
        {
            var result = await _context.MstrArticle
                .Where(x => x.AutoId == id)
                .Select(x => new {x.AvgCostPrice , x.LastCostPrice , x.MaxCostPrice , x.SalesPrice})
                .SingleOrDefaultAsync();

            return Ok(result);
        }

        #endregion "Article"


        #region Assign Article Color

        [HttpGet("GetAtiClr/{id}")]
        public async Task<IActionResult> getArtColorPermitDt(int id) 
        {
            var result = await _masterRepository.getArtColorPermitDtAsync(id);
            return Ok(result);
        }

        [HttpPost("SaveArtColor")]
        public async Task<IActionResult> SaveArticleColor(List<MstrArticleColor> colors) 
        {
            var result = await _masterRepository.SaveArticleColorAsync(colors);
            return Ok(result);
        }

        [HttpPost("DelArtColor")]
        public async Task<IActionResult> DeleteArticleColor(List<MstrArticleColor> colors) 
        {
            var result = await _masterRepository.DeleteArticleColorAsync(colors);
            return Ok(result);
        }

        #endregion Assign Article Color

         #region Assign Article Size

        [HttpGet("GetAtiSize/{id}")]
        public async Task<IActionResult> getArtSizePermitDt(int id) 
        {
            var result = await _masterRepository.getArtSizePermitDtAsync(id);
            return Ok(result);
        }

        [HttpPost("SaveArtSize")]
        public async Task<IActionResult> SaveArticleSize(List<MstrArticleSize> size) 
        {
            var result = await _masterRepository.SaveArticleSizeAsync(size);
            return Ok(result);
        }

        [HttpPost("DelArtSize")]
        public async Task<IActionResult> DeleteArticleSize(List<MstrArticleSize> size) 
        {
            var result = await _masterRepository.DeleteArticleSizeAsync(size);
            return Ok(result);
        }

        #endregion Assign Article Size


        #region "Article UOM Conversion"

        [HttpGet("ArtBase/{id}")]
        public async Task<IActionResult> GetArticleUOMConversion(int id) 
        {
            var result = await _context.MstrArticleUOMConversion
                .Where(x => x.ArticleId == id && x.IsActive == true)
                .Select(x => new { x.AutoId , x.ArticleId , x.UnitId , x.Value , x.Version})
                .ToListAsync();

            return Ok(result);
        }

        [HttpGet("ArtBaseAll/{id}")]
        public async Task<IActionResult> GetArticleUOMConversionAll(int id) 
        {
            var result = await _context.MstrArticleUOMConversion
                .Where(x => x.ArticleId == id)
                .Join(_context.MstrArticle , u => u.ArticleId , a => a.AutoId , (u,a) => new {u,a})
                .Join(_context.MstrUnits , x => x.u.UnitId , b => b.AutoId , (x,b) =>
                    new {
                        articleName = x.a.ArticleName,
                        autoId = x.u.AutoId,
                        articleId = x.u.ArticleId,
                        unitId = x.u.UnitId,
                        value = x.u.Value,
                        version = x.u.Version,
                        isActive = x.u.IsActive,
                        unit = b.Code
                    })
                .ToListAsync();

            return Ok(result);
        }

        [HttpPost("SaveAUOM")]
        public async Task<IActionResult> SaveArticleUOMConv(MstrArticleUOMConversion uOMConversion)
        {
            var result = await _masterRepository.SaveArticleUOMConvAsync(uOMConversion);
            return Ok(result);
        }

        [HttpPost("ActiveAUOM")]
        public async Task<IActionResult> ActiveArticleUOMConv(MstrArticleUOMConversion uOMConversion)
        {
            var result = await _masterRepository.ActiveArticleUOMConvAsync(uOMConversion);
            return Ok(result);
        }

        #endregion "Article UOM Conversion"


        #region "Special Instruction"

        [HttpGet("SpeInst")]
        public async Task<IActionResult> GetSpecialInstruction() 
        {
            var result = await _context.MstrSpecialInstruction
                    .Select(x => new { x.AutoId , x.Description })
                    .ToListAsync();
            return Ok(result);
        }

        #endregion "Special Instruction"


        #region "CodeDefinition"

        [HttpPost("CodeDef")]
        public async Task<IActionResult> GetCodeSettingDetails(MstrCodeDefinition codeDef) 
        {
            var result = await _context.MstrCodeDefinition
                .Where(x => x.CategoryId == codeDef.CategoryId && x.ProdTypeId == codeDef.ProdTypeId 
                            && x.ProdGroupId == codeDef.ProdGroupId)
                .Select(x => new { x.AutoId , x.FlexFieldId , x.FieldName , x.IsCode 
                    , x.IsCounter , x.IsName , x.IsValue , x.IsSeperator , x.Seperator , x.CounterPad , x.CounterStart
                    , x.IsProductField , x.SeqNo , x.SortOrder})
                .ToListAsync();
            return Ok(result);
        }

        [HttpPost("SaveCDef")]
        public async Task<IActionResult> SaveCodeDefinition(MstrCodeDefinition codeDefinition)
        {
            var result = await _masterRepository.SaveCodeDefinitionAsync(codeDefinition);
            return Ok(result);
        }

        [HttpPost("DeleteCDef")]
        public async Task<IActionResult> DeleteCodeDefinition(MstrCodeDefinition codeDefinition)
        {
            var result = await _masterRepository.DeleteCodeDefinitionAsync(codeDefinition);
            return Ok(result);
        }

        #endregion "CodeDefinition"

   
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

        [HttpPost("SaveCusC")]  
        public async Task<IActionResult> SaveCusCurrency(MstrCustomerCurrency cusCurrency)
        {
            var result = await _masterRepository.SaveCustomerCurrencyAsync(cusCurrency);
            return Ok(result);
        }  

        [HttpPost("DeleteCusC")]  
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

        [HttpPost("SaveCB")]
        public async Task<IActionResult> SaveCustomerBrand(MstrCustomerBrand cusBrand)
        {
            var result = await _masterRepository.SaveCustomerBrandAsync(cusBrand);
            return Ok(result);
        }

        [HttpPost("DeleteCB")]
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

        [HttpPost("SaveCD")]
        public async Task<IActionResult> SaveCustomerDivision(MstrCustomerDivision cusDivision)
        {
            var result = await _masterRepository.SaveCustomerDivisionAsync(cusDivision);
            return Ok(result);
        }

        [HttpPost("DisableCD")]
        public async Task<IActionResult> DisableCustomerDivision(MstrCustomerDivision cusDivision)
        {
            var result = await _masterRepository.DisableCusDivisionAsync(cusDivision);
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

        [HttpPost("SaveAddType")]
        public async Task<ActionResult> SaveAddressType(MstrAddressType addressType)
        {
            var result = await _masterRepository.SaveAddressTypeAsync(addressType);
            return Ok(result);
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

        #region "Unit Conversion"

        [HttpGet("UnitConv")]
        public async Task<ActionResult> GetUnitConversionDt()
        {
            var result = await _context.UnitConversion
                .Join(_context.MstrUnits , c => c.FromUnitId , f => f.AutoId ,
                    (c , f) => new {c,f})
                .Join(_context.MstrUnits , tc => tc.c.ToUnitId ,  t => t.AutoId ,
                    ( tc , t) => new 
                    {
                        autoId = tc.c.AutoId,
                        toUnit = t.Code,
                        fromUnitId = tc.c.FromUnitId,
                        toUnitId = tc.c.ToUnitId,
                        fromUnit = tc.f.Code,
                        value = tc.c.Value
                    }).ToListAsync();

            return Ok(result);
        }

        [HttpPost("SaveUC")]
        public async Task<ActionResult> SaveUnitConversion(MstrUnitConversion unitConv)
        {
            var result = await _masterRepository.SaveUnitConversionAsync(unitConv);
            return Ok(result);
        }

        #endregion "Unit Conversion"

        #region "Flute Type"

        [HttpPost("SaveFT")]
        public async Task<ActionResult> SaveFluteType(MstrFluteTypes fluteTypes)
        {
            var result = await _masterRepository.SaveFluteTypeAsync(fluteTypes);
            return Ok(result);
        }

        #endregion "FLute Type"

        #region "Process"

        [HttpPost("SaveProcess")]
        public async Task<ActionResult> saveProcess(MstrProcess MstrProcess)
        {
            var result = await _masterRepository.SaveProcessAsync(MstrProcess);
            return Ok(result);
        }

        [HttpGet("Process/{id}")]
        public async Task<IActionResult> GetProcess(int id)
        {
            var result = await _context.MstrProcess
                .Select(x => new {x.AutoId , x.Process , x.LocationId})
                .Where(x => x.LocationId == id)
                .ToListAsync();
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
            var result = await _context.MstrBrandCode
            .Select(x => new { x.AutoId , x.BrandId , x.Name}).ToListAsync();
            return Ok(result);            
        }

        [HttpGet("BrandCode/{id}")]
        public async Task<IActionResult> GetBrandCode(int id)
        { 
            var result = await _context.MstrBrandCode
                .Select(x => new { x.AutoId , x.BrandId , x.Name})
                .Where(e => e.BrandId == id).ToListAsync();        
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

        [HttpPost("SavePT")]
        public async Task<IActionResult> SavePaymentTerms(MstrPaymentTerm paymentTerm)
        {
            var result = await _masterRepository.SavePaymentTermsAsync(paymentTerm);
            return Ok(result);
        }


        #endregion "PaymentTerms" 


        #region "Countries"

        [HttpGet("Countries")]
        public async Task<IActionResult> GetCountries()
        {
            var countryList = await _context.MstrCountries
                .Select(x => new {x.Name , x.Code , x.AutoId , x.Alpha3Code , x.Alpha2Code , x.Numeric})
                .ToListAsync();
          
            return Ok(countryList);
        }

        [HttpPost("SaveCou")]
        public async Task<IActionResult> SaveCountries(MstrCountries countries)
        {
            var result = await _masterRepository.SaveCountriesAsync(countries);
            return Ok(result);
        }

        #endregion "Countries"


        #region "Currency"

        [HttpGet("Currency")]
        public async Task<IActionResult> GetCurrency()
        {
            var currencyList = await _context.MstrCurrency
            .Select(x => new {x.AutoId , x.Code , x.Name , x.Symbol})
            .ToListAsync();

            return Ok(currencyList);
        }

        [HttpPost("SaveCurr")]
        public async Task<IActionResult> SaveCurrency(MstrCurrency currency)
        {
            var result = await _masterRepository.SaveCurrencyAsync(currency);
            return Ok(result);
        }

        #endregion "Currency"


        #region "SalesAgent"

        [HttpGet("SalesAgent/{id}")]
        public async Task<IActionResult> GetSalesAgent(int id)
        {
            var result = await _context.MstrSalesAgent
                .Where(x => x.LocationId == id)
                .Select(x => new {x.Name , x.AutoId , x.Email , x.bActive})
                .ToListAsync();

            return Ok(result);
        }

        [HttpPost("SaveSA")]
        public async Task<IActionResult> SaveSalesAgent(MstrSalesAgent salesAgent)
        {
            var result = await _masterRepository.SaveSalesAgentAsync(salesAgent);
            return Ok(result);
        }

        #endregion "SalesAgent"

        
        #region "ProductionDefinition"

        [HttpGet("ProdDefDt/{id}")]
        public async Task<ActionResult> GetProdDefinition(byte id)
        {
            var ProdDefList = await _masterRepository.GetProdDefinitionAsync(id);
            return Ok(ProdDefList);
        }

        [HttpGet("ProdDefList")]
        public async Task<ActionResult> GetProdDefinitionList()
        {
            var ProdDefList = await _context.MstrProdDefinitionHd
                .Select(x => new {x.AutoId , x.PDName}).ToListAsync();
            return Ok(ProdDefList);
        }

        [HttpPost("SaveProdDef")]
        public async Task<ActionResult> SaveProdDefinition(ProdDefinitionDto prodDefinitionDt)
        {
            var result = await _masterRepository.SaveProdDefinitionAsync(prodDefinitionDt);
            return Ok(result);
        }

        [HttpPost("DeleteProdDef")]
        public async Task<ActionResult> DeleteProdDefinition(ProdDefinitionDto prodDefinitionDt)
        {
            var result = await _masterRepository.DeleteProdDefinitionAsync(prodDefinitionDt);
            return Ok(result);
        }

        #endregion "ProductionDefinition"


        #region "Product Type"        

        [HttpGet("ProdType")]
        public async Task<ActionResult> GetProductTypeAll()
        {
            var ProdTypeList = await _context.MstrProductType
                .Where(x => x.IsActive == true)
                .Select(x => new { x.AutoId , x.ProdTypeCode , x.ProdTypeName , x.IsActive , x.bAutoArticle})
                .ToListAsync();
            return Ok(ProdTypeList);
        }

        [HttpGet("ProdType/{catId}")]
        public async Task<IActionResult> GetProcuctType(int catId)
        {
            var prodTypeList = await _context.MstrCatProductType
                .Where(x => x.CategoryId == catId)
                .Join(_context.MstrProductType , c => c.ProdTypeId , p => p.AutoId ,
                    (c , p) => new {c , p})
                .Join(_context.MstrCategory , y => y.c.CategoryId , l => l.AutoId 
                    , (y, l) => new {
                        autoId = y.p.AutoId,
                        bAutoArticle = y.p.bAutoArticle,
                        categoryId = y.c.CategoryId,
                        prodTypeCode = y.p.ProdTypeCode,
                        prodTypeName = y.p.ProdTypeName,
                        isActive = y.p.IsActive,
                        categoryName = l.Name
                    })
                .ToListAsync();
            return Ok(prodTypeList);
        }

        [HttpPost("SaveProdType")]
        public async Task<ActionResult> SaveProductType(MstrProductType MstrProductType)
        {
            var result = await _masterRepository.SaveProductTypeAsync(MstrProductType);
            return Ok(result);
        }

        [HttpPost("Deactive/ProdType")]
        public async Task<ActionResult> DeactProductType(MstrProductType MstrProductType)
        {
            var result = await _masterRepository.DeactProductTypeAsync(MstrProductType);
            return Ok(result);
        }

        [HttpGet("CatProdT/{catId}")]
        public async Task<ActionResult> GetCatProdTypeDetails(int catId)
        {
            var result = await _masterRepository.GetCatProductTypeDtAsync(catId);
            return Ok(result);
        }

        [HttpPost("DeleteCatPT")]
        public async Task<ActionResult> DeleteCatProdType(List<MstrCatProductType> prod)
        {
            var result = await _masterRepository.DeleteCatProdTypeAsync(prod);
            return Ok(result);
        }
        
        [HttpPost("AssignCatPT")]
        public async Task<ActionResult> AssignCatProdType(List<MstrCatProductType> prod) 
        {
            var result = await _masterRepository.AssignCatProdTypeAsync(prod);
            return Ok(result);
        }

        #endregion "Product Type"


        #region "Product Group"

        [HttpGet("PGroup/{id}")]
        public async Task<ActionResult> GetProductGroup(int id)
        {
            var ProdGroupList = await _masterRepository.GetProductGroupAsync(id);
            return Ok(ProdGroupList);
        }

        [HttpGet("PTGroup/{id}")]
        public async Task<ActionResult> GetProdTypeGroup(int id)
        {
            var ProdGroupList = await _masterRepository.GetProdTypeGroupAsync(id);
            return Ok(ProdGroupList);
        }

        [HttpPost("AssignPGroup")]
        public async Task<IActionResult> AssignProdTypeGroup(List<MstrProdTypeGroup> prod) 
        {
            var result = await _masterRepository.AssignProdTypeGroupAsync(prod);
            return Ok(result);
        }

        [HttpPost("DeletePGroup")]
        public async Task<IActionResult> DeleteProdTypeGroup(List<MstrProdTypeGroup> prod) 
        {
            var result = await _masterRepository.DeleteProdTypeGroupAsync(prod);
            return Ok(result);
        }


        [HttpGet("ProdGroup")]
        public async Task<IActionResult> GetProcuctGroupAll()
        {
            var result = await _context.MstrProductGroup
                // .Where(x => x.IsActive == true)
                .Select(x => new {x.AutoId , x.ProdGroupName , x.ProdGroupCode , x.IsActive , x.SerialNo})
                .ToListAsync();
            return Ok(result);
        }

        [HttpPost("SaveProdGroup")]
        public async Task<ActionResult> SaveProductGroup(MstrProductGroup MstrProductGroup)
        {
            var result = await _masterRepository.SaveProductGroupAsync(MstrProductGroup);
            return Ok(result);
        }  

        [HttpPost("Deactive/ProdGroup")]
        public async Task<ActionResult> DeactiveProdGroup(MstrProductGroup MstrProductGroup)
        {
            var result = await _masterRepository.DeactiveProdGroupAsync(MstrProductGroup);
            return Ok(result);
        }   

        #endregion "Product Group"


        #region "Product Sub Category"

        [HttpGet("PSubCat/{id}")]
        public async Task<ActionResult> GetProdSubCategory(int id)
        {
            var ProdSubCatList = await _masterRepository.GetProductSubCatAsync(id);            
            return Ok(ProdSubCatList);
        }    

        // [HttpGet("ProdSubCat")]
        // public async Task<IActionResult> GetProductSubCat()
        // {
        //     var result = await _context.MstrProductSubCat.ToListAsync();
        //     return Ok(result);
        // }

        [HttpPost("SaveProdSubCat")]
        public async Task<ActionResult> SaveProductSubCat(MstrProductSubCat MstrProductSubCat)
        {
            var result = await _masterRepository.SaveProductSubCatAsync(MstrProductSubCat);
            return Ok(result);
        }

        [HttpPost("Deactive/PSubCat")]
        public async Task<ActionResult> DeactiveProdSubCat(MstrProductSubCat MstrProductSubCat)
        {
            var result = await _masterRepository.DeactiveProdSubCatAsync(MstrProductSubCat);
            return Ok(result);
        }

        #endregion "Product Sub Category"    


        #region "Costing Group"

        [HttpPost("SaveCostGroup")]
        public async Task<ActionResult> SaveCostingGroup(MstrCostingGroup MstrCostingGroup)
        {
            var result = await _masterRepository.SaveCostGroupAsync(MstrCostingGroup);
            return Ok(result);
        }

        [HttpGet("CostingGroup/{locId}")]
        public async Task<IActionResult> GetCostingGroup(int locId)
        {
            var result = await _context.MstrCostingGroup
                .Where(x => x.LocationId == locId)
                .Select(x => new { x.AutoId , x.IsMaterialAllocated , x.Name }).ToListAsync();
            return Ok(result);
        }       
       
        #endregion "Costing Group"    


        #region "Flute Type"

        [HttpGet("FluteType/{id}")]
        public async Task<IActionResult> GetFluteTypeDt(int id)
        {
            var result = await _context.MstrFluteTypes
                .Where(x => x.LocationId == id && x.IsActive == true)
                .Select(x => new {x.AutoId ,x.Code , x.Factor})
                .ToListAsync();

            return Ok(result);            
        }

        #endregion "Flute Type"   


        #region "Sequence Settings"

        [HttpGet("SeqSettDt/{locId}")]
        public async Task<IActionResult> GetSequenceSettings(int locId)
        {
            var result = await _context.TransSequenceSettings                
                .Where(x => x.LocationId == locId)
                .Select(x => new {x.TransType , x.Prefix , x.SeqLength , x.SeqNo , x.CurrentYear , x.AutoId}) .ToListAsync();
            return Ok(result);
        }
        
        [HttpPost("SaveSeqSett")]
        public async Task<ActionResult> SaveSequenceSettings(TransSequenceSettings sequenceSett)
        {
            var result = await _masterRepository.SaveSequenceSetAsync(sequenceSett);
            return Ok(result);
        }

        #endregion "Sequence Settings"
       
         // [HttpGet("ProductionDefinition")]
        // public async Task<IActionResult> getProductionDefinition()
        // {
        //     var result = await _context.MstrProductionDefinition.ToListAsync();
        //     return Ok(result);

        // }  

        #region Flex Field Details

        [HttpPost("SaveFlexFDt")]
        public async Task<IActionResult> SaveFlexFieldDetails(MstrFlexFieldDetails flexFieldDt)
        {
            var result = await _masterRepository.SaveFlexFieldDetailsAsync(flexFieldDt);
            return Ok(result);
        }

        [HttpGet("FlexFieldDt/{id}")]
        public async Task<IActionResult> GetFlexFieldDetails(int id)
        {
            var flexFieldDt = await _masterRepository.GetFlexFieldDtAsync(id);
            return Ok(flexFieldDt);
        }

        /// GET FLEX FIELD LIST RELATED TO CATEGORY AND PROD TYPE
        [HttpPost("FFListCatPT")]
        public async Task<IActionResult> GetFlexFieldCatTypeWise(MstrFlexFieldDetails ffDetails)
        {
            var result = await _context.MstrFlexFieldDetails            
                .Where(x => x.CategoryId == ffDetails.CategoryId && x.ProdTypeId == ffDetails.ProdTypeId && x.isActive == true)
                .Select(x => new {
                    x.AutoId , x.FlexFieldCode , x.FlexFieldName , x.Mandatory 
                    , x.ModuleId , x.ValueList , x.DataType 
                    })
                .ToListAsync();

            return Ok(result);
        }

        //// GET ONLY VALUE LISTED FLEX FIELD LIST
        [HttpGet("FlexFldDt/Val")]
        public async Task<IActionResult> GetFlexFieldList()
        {
            var flexFieldDt = await _context.MstrFlexFieldDetails
                .Select(x => new { x.AutoId , x.FlexFieldCode , x.FlexFieldName , x.ValueList})
                .Where(x => x.ValueList == true).ToListAsync();
            return Ok(flexFieldDt);
        }

        [HttpPost("Deactive/FlexFldDt")]
        public async Task<IActionResult> DeactiveFlexFieldDt(MstrFlexFieldDetails flexFieldDt)
        {
            var result = await _masterRepository.DeactiveFlexFieldDtAsync(flexFieldDt);
            return Ok(result);
        }
            
        #endregion


        #region Flex Field ValueList

        [HttpGet("FFValList/{id}")]
        public async Task<IActionResult> GetFlexFieldValueList(int id)
        {
            var result = await _context.MstrFlexFieldValueList
                .Where(x => x.FlexFieldId == id)
                .Join(_context.MstrFlexFieldDetails , v => v.FlexFieldId , d => d.AutoId ,
                   (v , d) => new 
                   {
                       autoId = v.AutoId,
                       flexFieldId = v.FlexFieldId,
                       flexFeildVlaue = v.FlexFeildVlaue
                   }).ToListAsync();                
            return Ok(result);
        }

        [HttpPost("SaveFFValList")]
        public async Task<IActionResult> SaveFlexFieldValueList(MstrFlexFieldValueList flexFieldval)
        {
            var result = await _masterRepository.SaveFlexFieldValListAsync(flexFieldval);
            return Ok(result);
        }

        [HttpPost("DeleteFFValList")]
        public async Task<IActionResult> DeleteFlexFieldValList(MstrFlexFieldValueList flexFieldval)
        {
            var result = await _masterRepository.DeleteFlexFieldValListAsync(flexFieldval);
            return Ok(result);
        }
            
        #endregion
       

        #region  Reject Reason

        [HttpGet("RejReason/{id}")]
        public async Task<IActionResult> GetRejectReason(int id)
        {
            var rejReasonList = await _context.MstrRejeReasons
                .Where(x => x.LocationId == id )
                .Select(x => new { x.AutoId , x.Details , x.IsActive})
                .ToListAsync();

            return Ok(rejReasonList);
        }

        [HttpPost("SaveRReason")]
        public async Task<IActionResult> SaveRejectReason(MstrRejectionReasons rejReason)
        {
            var result = await _masterRepository.SaveRejectReasonAsync(rejReason);
            return Ok(result);
        }

        #endregion Reject Reason

    }
}