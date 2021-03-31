using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MasterRepository : IMasterRepository
    {
        private readonly DataContext _context;
        public MasterRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MstrFactory>> FactoriesAsync()
        {
            return await _context.MstrFactory.ToListAsync();
        }

        public async Task<IEnumerable<MstrAgentLevel>> AgentLevelsAsync(int agentid)
        {
            var agentLevel = await _context.MstrAgents
                    .Where(x => x.idAgents == agentid)
                    .Select(p => new {p.iCategoryLevel})
                    .SingleOrDefaultAsync();

            return await _context.MstrAgentLevel
                    .Where(x => x.LevelPrority >= agentLevel.iCategoryLevel)
                    .ToListAsync();
        }

        // public async Task<IEnumerable<MstrFactory>> GetFactoriesAsync()
        // {
        //     return await _context.MstrFactory.ToListAsync();
        // }
    }
}