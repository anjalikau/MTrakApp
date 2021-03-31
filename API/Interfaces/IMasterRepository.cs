using System.Collections.Generic;
using System.Threading.Tasks;
using API.Entities;

namespace API.Interfaces
{
    public interface IMasterRepository    {
        Task<IEnumerable<MstrFactory>> FactoriesAsync();
        Task<IEnumerable<MstrAgentLevel>> AgentLevelsAsync(int agentid);
    }
}