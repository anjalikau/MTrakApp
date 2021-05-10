using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities.Admin;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly IApplicationAdminDbContext _context;
        public UserRepository(IApplicationAdminDbContext context)
        {
            _context = context;
        }

        public async Task<MstrAgents> GetUserByIdAsync(int id)
        {
            return await _context.MstrAgents.FindAsync(id);
        }

        public async Task<IEnumerable<MstrAgentLevel>> AgentLevelsAsync(int agentid)
        {
            var agentLevel = await _context.MstrAgents
                    .Where(x => x.idAgents == agentid)
                    .Select(p => new { p.iCategoryLevel })
                    .SingleOrDefaultAsync();

            return await _context.MstrAgentLevel
                    .Where(x => x.LevelPrority >= agentLevel.iCategoryLevel)
                    .ToListAsync();
        }

        public async Task<IEnumerable<MstrAgents>> GetPermitedAgentsAsync(int agentid)
        {
            /// GET LOGGED USER CATEGORY LEVEL
            var agentLevel = await _context.MstrAgents
                    .Where(x => x.idAgents == agentid)
                    .Select(p => new { p.iCategoryLevel })
                    .SingleOrDefaultAsync();

            return await _context.MstrAgents
                    .Where(x => x.iCategoryLevel >= agentLevel.iCategoryLevel)
                    .ToListAsync();
        }

        public async Task<IEnumerable<MstrAgents>> GetUsersAsync()
        {
            return await _context.MstrAgents
                .Where(s => s.bActive == true).ToListAsync();
        }

        public async Task<MstrAgents> GetUserByUsernameAsync(string username)
        {
            return await _context.MstrAgents
                .SingleOrDefaultAsync(x => x.cAgentName == username);
        }

        public async Task<IEnumerable<SystemModule>> GetModuleAsync()
        {
            return await _context.SystemModule.ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync(default) > 0;
        }

        // public void Update(MstrAgents user)
        // {
        //     _context.Entry(user).State = EntityState.Modified;
        // }
    }
}