using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.Admin;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers.Admin
{
    public class AccountController : BaseApiController
    {
        private readonly IApplicationAdminDbContext _context;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly IMasterRepository _masterRepository;

        public AccountController(IApplicationAdminDbContext context, ITokenService tokenService, IMapper mapper
            , IMasterRepository masterRepository)
        {
            _mapper = mapper;
            _tokenService = tokenService;
            _context = context;
            _masterRepository = masterRepository;
        }

        [Authorize]
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.cAgentName)) return BadRequest("Username is taken");

            var user = _mapper.Map<MstrAgents>(registerDto);

            using var hmac = new HMACSHA512();

            //var moduleName = await GetFactoryName(registerDto.SysModuleId);           
            user.cAgentName = registerDto.cAgentName;
            user.iCategoryLevel = registerDto.iCategoryLevel;
            user.bActive = true;
            user.cPassword = registerDto.cPassword;
            user.passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.cPassword));
            user.passwordSalt = hmac.Key;     
            
            _context.MstrAgents.Add(user);
            await _context.SaveChangesAsync(default);           

            return Ok();
        }

        [Authorize]
        [HttpPost("RegModule")]
        public async Task<ActionResult> RegisterModule(List<MstrAgentModule> userModule)
        {
            var saveExists = false;

              foreach (var item in userModule)
              {
                  if(await UserModuleExists(item))
                  {
                    continue;
                  }
                  else
                  {
                    _context.MstrAgentModule.Add(item);
                    saveExists = true;
                  }
              } 

            if (saveExists) 
                await _context.SaveChangesAsync(default);
            else 
                return BadRequest("User Module Exists");

              return Ok(); 
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            IEnumerable<PermitMenuDto> menuList = Enumerable.Empty<PermitMenuDto>();
            var user = await _context.MstrAgents
                .SingleOrDefaultAsync(x => x.cAgentName == loginDto.cAgentName);

            if (user == null) return Unauthorized("Invalid Username");

            using var hmac = new HMACSHA512(user.passwordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.cPassword));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.passwordHash[i]) return Unauthorized("Invalid Password");
            }

            int userId = int.Parse(user.idAgents.ToString());
            int moduleId = int.Parse(loginDto.ModuleId.ToString());

            var usermod = await _context.MstrAgentModule
                    .SingleOrDefaultAsync(x => x.UserId == userId && x.SysModuleId == moduleId);

            if(usermod == null) return Unauthorized("Invalid Module");   
            else {
                /// GET PERMITED MENU LIST FOR LOGGED USER
                UserDto userDto = new UserDto();

                userDto.UserId = user.idAgents ;
                userDto.ModuleId = usermod.SysModuleId;

                menuList = await _masterRepository.GetAuthMenuListAsync(userDto);
            }     

            return new UserDto
            {
                ModuleId = usermod.SysModuleId,
                UserId = user.idAgents,
                UserName = user.cAgentName,
                Token = _tokenService.CreateToken(user),
                permitMenus = menuList
            };
        }

        // private async Task<string> GetFactoryName(int id)
        // {
        //     var factory = await _context.MstrFactory
        //             .Where(x => x.AutoId == id)
        //             .Select(p => new {p.Factory})
        //             .SingleOrDefaultAsync();
        //     return factory.Factory;
        // }

        private async Task<bool> UserModuleExists(MstrAgentModule userModule)
        {
            return await _context.MstrAgentModule.AnyAsync(x => x.UserId == userModule.UserId && x.SysModuleId == userModule.SysModuleId);
        }

        private async Task<bool> UserExists(string username)
        {
            return await _context.MstrAgents.AnyAsync(x => x.cAgentName == username.ToLower());
        }

    }
}