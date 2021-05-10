using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities.Admin;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers.Admin
{
    [Authorize]
    public class AgentsController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IApplicationAdminDbContext _context;
        private readonly IAdminRepository _adminRepository;

        public AgentsController(IUserRepository userRepository, IMapper mapper , IApplicationAdminDbContext context
            , IAdminRepository adminRepository)
        {
            _adminRepository = adminRepository;
            _context = context;
            _mapper = mapper;
            _userRepository = userRepository;
        }

        //[AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RegisterDto>>> GetUsers()
        {
            var users = await _userRepository.GetUsersAsync();
            var usersToReturn = _mapper.Map<IEnumerable<RegisterDto>>(users);
            return Ok(usersToReturn);
        }

        [HttpGet("Location/{id}")]
        public async Task<ActionResult<IEnumerable<LocationDto>>> GetLocation(int id)
        {
            var factories = await _adminRepository.GetLocationAsync(id);
            var factoryToReturn = _mapper.Map<IEnumerable<LocationDto>>(factories);
            return Ok(factoryToReturn);
        }

        [HttpGet("name/{username}")]
        public async Task<ActionResult<RegisterDto>> GetUserByName(string username)
        {
            if (!await UserExists(username)) return BadRequest("User not exists");
            var user = await _userRepository.GetUserByUsernameAsync(username);
            return _mapper.Map<RegisterDto>(user);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RegisterDto>> GetUserById(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            return _mapper.Map<RegisterDto>(user);
        }

        [HttpPut("{username}")]
        public async Task<ActionResult<bool>> ChangePassword(string username, UserUpdateDto updateDto)
        {
            if (username != User.FindFirst(ClaimTypes.NameIdentifier).Value)
                return Unauthorized();

            var userFormRepo = await _userRepository.GetUserByUsernameAsync(username);

            using var hmac = new HMACSHA512();
            updateDto.passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(updateDto.cPassword));
            updateDto.passwordSalt = hmac.Key;

            _mapper.Map(updateDto, userFormRepo);

            if (await _userRepository.SaveAllAsync())
                return NoContent();

            throw new Exception($"Updating user {username} failed on server");
        }

        [AllowAnonymous]
        [HttpGet("Module")]
        public async Task<IEnumerable<SystemModule>> GetModules()
        {
            return await _userRepository.GetModuleAsync();
        }

        private async Task<bool> UserExists(string username)
        {
            return await _context.MstrAgents.AnyAsync(x => x.cAgentName == username.ToLower());
        }

        [HttpGet("AgentLevel/{id}")]
        public async Task<ActionResult<IEnumerable<UserLevelDto>>> GetAgentLevel(int id)
        {
            var levels = await _userRepository.AgentLevelsAsync(id);
            var levelToReturn = _mapper.Map<IEnumerable<UserLevelDto>>(levels);
            return Ok(levelToReturn);
        }

        [HttpGet("Users/{id}")]
        public async Task<ActionResult<IEnumerable<PermitedUserDto>>> GetPermittedUser(int id)
        {
            var userList = await _userRepository.GetPermitedAgentsAsync(id);
            var usersToReturn = _mapper.Map<IEnumerable<PermitedUserDto>>(userList);
            return Ok(usersToReturn);
        }

        [HttpGet("Users/Module/{id}")]
        public async Task<ActionResult<IEnumerable<UserModuleDto>>> GetUserModuleAsync(int id)
        {
            var moduleList = await _adminRepository.GetUserModuleAsync(id);
            return Ok(moduleList);
        }


        [HttpPost("UserModSave")]
        public async Task<IActionResult> SaveUserModule(List<UserModuleDto> userModList)
        {
            var result = await _adminRepository.SaveUserModule(userModList);
            return Ok(result);             
        }

        [HttpPost("UserModDelete")]
        public async Task<IActionResult> DeleteUserModule(DeleteuserModDto DeleteuserModDto)
        {
            var result = await _adminRepository.DeleteUserModule(DeleteuserModDto);
            return Ok(result);             
        }

       
    }
}