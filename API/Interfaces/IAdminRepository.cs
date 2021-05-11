using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IAdminRepository
    {
         Task<IEnumerable<MstrLocation>> GetLocationAsync(MstrLocation loc);
         Task<int> SaveUserModule(List<UserModuleDto> userModuleDto);
         Task<int> DeleteUserModule(DeleteuserModDto deleteModDto);
         Task<IEnumerable<UserModuleDto>> GetUserModuleAsync(int userId);
    }
}