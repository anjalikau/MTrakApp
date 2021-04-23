using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IMasterRepository    
    {
        Task<IEnumerable<MstrFactory>> FactoriesAsync();
        Task<IEnumerable<MstrAgentLevel>> AgentLevelsAsync(int agentid);
        Task<IEnumerable<MenuJoinList>> GetMenuListAsync();
        Task<int> SaveMenuListAsync(MenuListDto menuListDto);
        Task<IEnumerable<MstrAgents>> GetPermitedAgentsAsync(int agentid);
        Task<IEnumerable<UserMenuList>> GetUserMenuList(int userId);
        Task<int> SaveUserMenuListAsync(List<MenuUserDto> menuList);
        Task<int> DeleteUserMenuListAsync(List<MenuUserDto> menuList);
        Task<IEnumerable<MenuJoinList>> GetAuthMenuListAsync(int agentid);
        //Task<IEnumerable<ResultSet>> SaveMenuListAsync(MenuListDto menuListDto);
    }
}