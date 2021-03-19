using System.Collections.Generic;
using System.Threading.Tasks;
using API.Entities;

namespace API.Interfaces
{
    public interface IUserRepository
    {
         void Update(MstrAgents user);

         Task<bool> SaveAllAsync();

         Task<IEnumerable<MstrAgents>> GetUsersAsync();

         Task<MstrAgents> GetUserByIdAsync(int id);

         Task<MstrAgents> GetUserByUsernameAsync(string username);


         
    }
}