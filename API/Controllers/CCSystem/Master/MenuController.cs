using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers.CCSystem.Master
{
    [Authorize]
    public class MenuController : BaseApiController
    {
        private readonly IApplicationCartonDbContext _context;
        private readonly IMasterRepository _masterRepository;
        public MenuController(IMasterRepository masterRepository , IApplicationCartonDbContext context)
        {
            _masterRepository = masterRepository;
            _context = context;
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

        [HttpGet("UserAM/{userId}")]
        public async Task<IActionResult> GetUserAppModuleList(int userId)
        {
            var result = await _masterRepository.GetUserAppModuleDtAsync(userId);
            return Ok(result);             
        }

        [HttpGet("Modules")]
        public async Task<IActionResult> GetModuleList()
        {
            var result = await _context.MstrMenuList
                .Select(x => new {x.MenuName , x.AutoIdx , x.mType , x.GroupName})
                .Where(x => x.mType == "F" && x.GroupName != "Admin" && x.GroupName != "Master")
                .ToListAsync();
            return Ok(result);             
        }

        [HttpPost("ARMSave")]
        public async Task<IActionResult> SaveApproveRouteModule(TransApprovalRoutingModules routeModule)
        {
            var result = await _masterRepository.SaveApproveRouteModuleAsync(routeModule);
            return Ok(result);             
        }

        [HttpGet("AppUsers/{ARMId}")]
        public async Task<IActionResult> GetApproveUsers(int ARMId)
        {
            var result = await _masterRepository.GetApproveUsersAsync(ARMId);
            return Ok(result);          
        }

        [HttpPost("AppUserSave")]
        public async Task<IActionResult> SaveApproveUser(TransApproversByModule appUser)
        {
            var result = await _masterRepository.SaveApproveUserAsync(appUser);
            return Ok(result);             
        }

        [HttpPost("AppModDelete")]
        public async Task<IActionResult> DeleteApproveModule(TransApprovalRoutingModules appModule)
        {
            var result = await _masterRepository.DeleteApproveModuleAsync(appModule);
            return Ok(result);             
        }

        [HttpPost("AppUserDelete")]
        public async Task<IActionResult> DeleteApproveUsers(TransApproversByModule appUsers)
        {
            var result = await _masterRepository.DeleteApproveUsersAsync(appUsers);
            return Ok(result);             
        }
    }
}