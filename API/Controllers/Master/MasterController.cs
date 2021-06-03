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

        [HttpPost("Loc/SetDefault")]
        public async Task<IActionResult> SetDefaultLocation(MstrUserLocation userLoc)
        {
             var result = await _masterRepository.SetDefaultLocationAsync(userLoc);
             return Ok(result);
        }

        [HttpGet("ColorCard")]
        public async Task<IActionResult> GetColorCard()
        {
            var result = await _context.MstrColorCard.ToListAsync();
            return Ok(result);
        }

        [HttpGet("SizeCard")]
        public async Task<IActionResult> GetSizeCard()
        {
            var result = await _context.MstrSizeCard.ToListAsync();
            return Ok(result);
        }

        [HttpGet("Company/{id}")]
        public async Task<IActionResult> GetCompany(int id)
        {
            var result = await _context.MstrCompany.ToListAsync();
            return Ok(result);
        }

        [HttpGet("Size/{id}")]
        public async Task<IActionResult> GetSize(int id)
        {
            var result = await _context.MstrSize.Where(e => e.LinkSizeCard == id).ToListAsync();
            return Ok(result);
        }

        [HttpGet("Color/{id}")]
        public async Task<IActionResult> GetColor(int id)
        { 
            var result = await _context.MstrColor.Where(e => e.LinkColorCard == id).ToListAsync();        
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

        [HttpPost("Color")]
        public async Task<ActionResult> SaveColor(MstrColor color)
        {
            var result = await _masterRepository.SaveColorAsync(color);
            return Ok(result);
        }

        [HttpGet("Articles")]
        public async Task<IActionResult> GetArticles()
        {
            var articleList = await _context.MstrArticle.ToListAsync();
            return Ok(articleList);
        }

        [HttpGet("Customer/{locId}")]
        public async Task<IActionResult> GetCustomer(int locId)
        {
            var customerList = await _context.MstrCustomerHeader
                .Where(x => x.LocationId == locId).ToListAsync();
            return Ok(customerList);
        }

        [HttpGet("CustomerDt/{id}")]
        public async Task<IActionResult> GetCustomerDet(int id)
        {
            var customerList = await _context.MstrCustomerDetails
                    .Where(x => x.CustomerId == id).ToListAsync();
            return Ok(customerList);
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

        [HttpPost("Editunits")]
        public async Task<ActionResult> saveUnits(MstrUnits units)
        {
            var result = await _masterRepository.SaveUnitAsync(units);
            return Ok(result);
        }

        [HttpPost("SaveProcess")]
        public async Task<ActionResult> saveProcess(MstrProcess MstrProcess)
        {
            var result = await _masterRepository.SaveProcessAsync(MstrProcess);
            return Ok(result);
        }

        [HttpPost("SaveStoreSite")]
        public async Task<ActionResult> saveStoreSite(MstrStoreSite MstrStoreSite)
        {
            var result = await _masterRepository.SaveStoresiteAsync(MstrStoreSite);
            return Ok(result);
        }

        [HttpGet("Units")]
        public async Task<IActionResult> GetUnit()
        {
            var result = await _context.MstrUnits.ToListAsync();
            return Ok(result);            
        }

        [HttpGet("MasterLocation")]
        public async Task<IActionResult> GetMstrLocation()
        {
            var result = await _context.MstrLocation.ToListAsync();
            return Ok(result);            
        }

        [HttpGet("Storesite")]
        public async Task<IActionResult> GetStoresite()
        {
            var result = await _context.MstrStoreSite.ToListAsync();
            return Ok(result);            
        }

        [HttpGet("Process")]
        public async Task<IActionResult> GetProcess()
        {
            var result = await _context.MstrProcess.ToListAsync();
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