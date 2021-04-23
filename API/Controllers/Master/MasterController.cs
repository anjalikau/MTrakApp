using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Master
{
    [Authorize]
    public class MasterController : BaseApiController
    {
        private readonly IMasterRepository _masterRepository;
        private readonly IMapper _mapper;
        public MasterController(IMasterRepository masterRepository, IMapper mapper)
        {
            _mapper = mapper;
            _masterRepository = masterRepository;
        }
        
        [HttpGet("Factory")]
        public async Task<ActionResult<IEnumerable<FactoryDto>>> GetFactories()
        {
            var factories = await _masterRepository.FactoriesAsync();
            var factoryToReturn = _mapper.Map<IEnumerable<FactoryDto>>(factories);
            return Ok(factoryToReturn);
        }

        [HttpGet("AuthMenus/{id}")]
        public async Task<ActionResult<IEnumerable<MenuJoinList>>> GetAuthMenuList(int id)
        {
            var menuList = await _masterRepository.GetAuthMenuListAsync(id);
            return Ok(menuList);
        }

        [HttpGet("AgentLevel/{id}")]
        public async Task<ActionResult<IEnumerable<UserLevelDto>>> GetAgentLevel(int id)
        {
            var levels = await _masterRepository.AgentLevelsAsync(id);
            var levelToReturn = _mapper.Map<IEnumerable<UserLevelDto>>(levels);
            return Ok(levelToReturn);
        }

        [HttpGet("Menulist")]
        public async Task<ActionResult<IEnumerable<MenuJoinList>>> GetMenuList()
        {
            var menuList = await _masterRepository.GetMenuListAsync();
            return Ok(menuList);
        }

        [HttpGet("Users/{id}")]
        public async Task<ActionResult<IEnumerable<PermitedUserDto>>> GetPermittedUser(int id) 
        {
            var userList = await _masterRepository.GetPermitedAgentsAsync(id);
            var usersToReturn = _mapper.Map<IEnumerable<PermitedUserDto>>(userList);
            return Ok(usersToReturn);
        }

        [HttpGet("UserMenus/{id}")]
        public async Task<ActionResult<IEnumerable<UserMenuList>>> GetUserMenuList(int id)
        {
            var menuList = await _masterRepository.GetUserMenuList(id);
            return Ok(menuList);
        }
    }
}