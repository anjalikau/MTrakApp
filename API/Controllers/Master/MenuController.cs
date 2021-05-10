using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Master
{
    [Authorize]
    public class MenuController : BaseApiController
    {
        //private readonly IApplicationCartonDbContext _context;
        private readonly IMasterRepository _masterRepository;
        public MenuController(IMasterRepository masterRepository)
        {
            _masterRepository = masterRepository;
            //_context = context;
        }

        [HttpPost("MenuSave")]
        public async Task<IActionResult> SaveMenuList(MenuListDto menuListDto)
        {
            var result = await _masterRepository.SaveMenuListAsync(menuListDto);
            return Ok(result);             
        }

        [HttpPost("MenuUserSave")]
        public async Task<IActionResult> SaveUserMenuList(List<MenuUserDto> menuList)
        {
            var result = await _masterRepository.SaveUserMenuListAsync(menuList);
            return Ok(result);             
        }

        [HttpPost("MenuUserDelete")]
        public async Task<IActionResult> DeleteUserMenuList(List<MenuUserDto> menuList)
        {
            var result = await _masterRepository.DeleteUserMenuListAsync(menuList);
            return Ok(result);             
        }
    }
}