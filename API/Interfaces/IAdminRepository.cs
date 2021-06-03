using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Entities.Admin;

namespace API.Interfaces
{
    public interface IAdminRepository
    {
         Task<IEnumerable<MstrLocation>> GetLocationAsync(MstrLocation loc);
         Task<int> SaveUserModule(List<UserModuleDto> userModuleDto);
         Task<int> DeleteUserModule(DeleteuserModDto deleteModDto);
         Task<IEnumerable<UserModuleDto>> GetUserModuleAsync(int userId);
         Task<IEnumerable<UserLocationDto>> GetUserLocAsync(MstrAgentModule userMod);
    }
}