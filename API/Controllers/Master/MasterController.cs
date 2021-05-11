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

namespace API.Controllers.Master
{
    [Authorize]
    public class MasterController : BaseApiController
    {
        private readonly IMasterRepository _masterRepository;
        private readonly IMapper _mapper;
        private readonly IApplicationCartonDbContext _context;
        public MasterController(IMasterRepository masterRepository, IMapper mapper, IApplicationCartonDbContext context)
        {
            _mapper = mapper;
            _context = context;
            _masterRepository = masterRepository;
        }

        [AllowAnonymous]
        [HttpPost("AuthMenus")]
        public async Task<ActionResult<IEnumerable<MenuJoinList>>> GetAuthMenuList(UserDto userDto)
        {
            var menuList = await _masterRepository.GetAuthMenuListAsync(userDto);
            return Ok(menuList);
        }        

        [HttpGet("Menulist")]
        public async Task<ActionResult<IEnumerable<MenuJoinList>>> GetMenuList()
        {
            var menuList = await _masterRepository.GetMenuListAsync();
            return Ok(menuList);
        }        

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