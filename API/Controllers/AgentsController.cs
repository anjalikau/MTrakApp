using System.Collections.Generic;
using System.Linq;
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

        public AgentsController(IUserRepository userRepository, IMapper mapper)
        {
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

        [HttpGet("{id}")]
        public async Task<ActionResult<RegisterDto>> GetUser(int id)
        {
            var user =  await _userRepository.GetUserByIdAsync(id);
            return _mapper.Map<RegisterDto>(user);
        }

        // [HttpGet("{username}")]
        // public async Task<ActionResult<MstrAgents>> GetUser(string username)
        // {
        //     return await _userRepository.GetUserByUsernameAsync(username);
        // }
    }
}