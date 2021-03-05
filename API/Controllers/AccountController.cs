using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        public AccountController(DataContext context, ITokenService tokenService)
        {
            _tokenService = tokenService;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.cAgentName)) return BadRequest("Username is taken");

            using var hmac = new HMACSHA512();

            var user = new MstrAgents
            {
                cAgentName = registerDto.cAgentName,
                Factory = registerDto.Factory,
                iCategoryLevel = registerDto.iCategoryLevel,
                bActive = 1,
                cPassword = registerDto.cPassword,
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.cPassword)),
                passwordSalt = hmac.Key
            };

            _context.MstrAgents.Add(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                UserName = user.cAgentName,
                Token = _tokenService.CreateToken(user)
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _context.MstrAgents
                .SingleOrDefaultAsync(x => x.cAgentName == loginDto.cAgentName);

            if (user == null) return Unauthorized("Invalid Username");

            using var hmac = new HMACSHA512(user.passwordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.cPassword));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.passwordHash[i]) return Unauthorized("Invalid Password");
            }

            return new UserDto
            {
                UserName = user.cAgentName,
                Token = _tokenService.CreateToken(user)
            };
        }

        private async Task<bool> UserExists(string username)
        {
            return await _context.MstrAgents.AnyAsync(x => x.cAgentName == username.ToLower());
        }

    }
}