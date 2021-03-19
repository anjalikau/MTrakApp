using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        public UserRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<MstrAgents> GetUserByIdAsync(int id)
        {
            return await _context.MstrAgents.FindAsync(id);
        }

        public async Task<IEnumerable<MstrAgents>> GetUsersAsync()
        {
            return await _context.MstrAgents
                .Where(s => s.bActive == 1).ToListAsync();
        }

        public async Task<MstrAgents> GetUserByUsernameAsync(string username)
        {
            return await _context.MstrAgents
                .SingleOrDefaultAsync(x => x.cAgentName == username);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(MstrAgents user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }
    }
}