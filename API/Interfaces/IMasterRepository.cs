using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Entities.Admin;

namespace API.Interfaces
{
    public interface IMasterRepository    
    {        
        Task<IEnumerable<MenuJoinList>> GetMenuListAsync();
        Task<int> SaveMenuListAsync(MenuListDto menuListDto);        
        Task<IEnumerable<UserMenuList>> GetUserMenuList(int userId);
        Task<int> SaveUserMenuListAsync(List<MenuUserDto> menuList);
        Task<int> DeleteUserMenuListAsync(List<MenuUserDto> menuList);
        Task<IEnumerable<MenuJoinList>> GetAuthMenuListAsync(UserDto userDto);
        //Task<IEnumerable<ResultSet>> SaveMenuListAsync(MenuListDto menuListDto);
        Task<MstrUserLocation> GetDefaultLocForUser(int userId);
        Task<int> SetDefaultLocationAsync(MstrUserLocation userLoc);
        Task<int> SaveColorCardAsync(MstrColorCard mstrccard);
        Task<int> SaveSizeCardAsync(MstrSizeCard mstrscard);
        Task<int> SaveSizeAsync(MstrSize mstrSize);
        Task<int> SaveColorAsync(MstrColor mstrColor);
        Task<int> DeactiveSizeCardAsync(MstrSizeCard mstrscard);
        Task<int> DeactiveColorCardAsync(MstrColorCard mstrccard);
    }
}