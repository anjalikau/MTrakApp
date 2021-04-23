using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class AgentsController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly DataContext _context;

        public AgentsController(IUserRepository userRepository, IMapper mapper, DataContext context)
        {
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

        [HttpGet("name/{username}")]
        public async Task<ActionResult<RegisterDto>> GetUserByName(string username)
        {
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
        public async Task<ActionResult<bool>> ChangePassword(string username,UserUpdateDto updateDto)
        {
             if(username != User.FindFirst(ClaimTypes.NameIdentifier).Value)
                return Unauthorized();

            var userFormRepo = await _userRepository.GetUserByUsernameAsync(username);

            using var hmac = new HMACSHA512();
            updateDto.passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(updateDto.cPassword));
            updateDto.passwordSalt = hmac.Key;
            
            _mapper.Map(updateDto,userFormRepo);

            if(await _userRepository.SaveAllAsync())
                return NoContent();
                
            throw new Exception($"Updating user {username} failed on server");
        }

        private async Task<bool> UserExists(string username)
        {
            return await _context.MstrAgents.AnyAsync(x => x.cAgentName == username.ToLower());
        }

        // [HttpGet("{username}")]
        // public async Task<ActionResult<MstrAgents>> GetUser(string username)
        // {
        //     return await _userRepository.GetUserByUsernameAsync(username);
        // }
    }
}