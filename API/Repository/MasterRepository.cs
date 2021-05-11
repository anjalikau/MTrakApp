using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace API.Repository
{
    public class MasterRepository : DbConnCartonRepositoryBase , IMasterRepository
    {
         private readonly IApplicationCartonDbContext _context;
        //private readonly DataConnection _connection;

        public MasterRepository(IApplicationCartonDbContext context, IDbConnectionFactory dbConnectionFactory) : base(dbConnectionFactory)
        {
             _context = context;
        }

        public async Task<IEnumerable<MenuJoinList>> GetAuthMenuListAsync(UserDto userDto)
        {
            IEnumerable<MenuJoinList> menuJoinList = Enumerable.Empty<MenuJoinList>();
            var AgentId = new SqlParameter("AgentId", userDto.UserId);

            if (userDto.ModuleId == 1) {
                string StoredProc = "exec spMenuListAuthorize @AgentId";
                return await _context.MenuJoinList.FromSqlRaw(StoredProc , AgentId).ToListAsync();
            }
            return menuJoinList;
        }        

        public async Task<IEnumerable<MenuJoinList>> GetMenuListAsync()
        {
            string StoredProc = "exec spMenuListGet";
            return await _context.MenuJoinList.FromSqlRaw(StoredProc)
                                                   .ToListAsync();
        }

        [System.Obsolete]
        public async Task<int> SaveMenuListAsync(MenuListDto menuListDto)
        {            
            var AutoIdx = new SqlParameter("@mId", menuListDto.AutoIdx);
            var Name = new SqlParameter("@mName",menuListDto.MenuName);
            var Description = new SqlParameter("@mDescription",menuListDto.MenuDescription);
            var Type = new SqlParameter("@mType", menuListDto.mType);
            var GroupName = new SqlParameter("@GroupName",menuListDto.GroupName);            
            var AgentLevel = new SqlParameter("@AgentLevel",menuListDto.AgentLevelId);
            var AgentId = new SqlParameter("@AgentId",menuListDto.AgentId);
            var Result = new SqlParameter("@Result", SqlDbType.Int);

            Result.Direction = ParameterDirection.Output;
            // Description.SqlDbType = SqlDbType.VarChar;
       
            await _context.Database
            .ExecuteSqlCommandAsync(@"exec spMenuListSave @mId,@mName,@mDescription,@mType
                    ,@GroupName,@AgentId,@AgentLevel,@Result out" 
                ,AutoIdx ,Name ,Description ,Type ,GroupName ,AgentId ,AgentLevel,Result );

            return int.Parse(Result.Value.ToString());               
        
        }

        public async Task<IEnumerable<UserMenuList>> GetUserMenuList(int userId)
        {
            var AgentId = new SqlParameter("AgentId", userId);
            //string StoredProc = "exec spMenuUserGetList";
            return await _context.UserMenuList
                .FromSqlRaw("exec spMenuUserGetList @AgentId" , AgentId).ToListAsync();
        }

        [System.Obsolete]
        public async Task<int> SaveUserMenuListAsync(List<MenuUserDto> menuList)
        {
            DataTable MenuUserDT = new DataTable();

            MenuUserDT.Columns.Add("AgentId",typeof(int));
            MenuUserDT.Columns.Add("MenuId",typeof(int));
            MenuUserDT.Columns.Add("CreUserID",typeof(int));

            foreach (var item in menuList)
            {
                MenuUserDT.Rows.Add( item.AgentId
                        , item.MenuId
                        , item.CreUserID);
            }         

            var MenuUserDetails = new SqlParameter("@MenuUserDT", SqlDbType.Structured); 
            MenuUserDetails.Value = MenuUserDT;
            MenuUserDetails.TypeName = "[dbo].[MenuUserType]";

            var Result = new SqlParameter("@Result", SqlDbType.Int);
            Result.Direction = ParameterDirection.Output;            

             await _context.Database
            .ExecuteSqlCommandAsync(@"exec spMenuUserSave @MenuUserDT,@Result out" 
                ,MenuUserDetails,Result );

            return int.Parse(Result.Value.ToString());      

        }

        [System.Obsolete]
        public async Task<int> DeleteUserMenuListAsync(List<MenuUserDto> menuList)
        {
            DataTable MenuUserDT = new DataTable();

            MenuUserDT.Columns.Add("AgentId",typeof(int));
            MenuUserDT.Columns.Add("MenuId",typeof(int));
            MenuUserDT.Columns.Add("CreUserID",typeof(int));

            foreach (var item in menuList)
            {
                MenuUserDT.Rows.Add( item.AgentId
                        , item.MenuId
                        , item.CreUserID);
            }

            var MenuUserDetails = new SqlParameter("@MenuUserDT", SqlDbType.Structured); 
            MenuUserDetails.Value = MenuUserDT;
            MenuUserDetails.TypeName = "[dbo].[MenuUserType]";

            var Result = new SqlParameter("@Result", SqlDbType.Int);
            Result.Direction = ParameterDirection.Output;            

             await _context.Database
            .ExecuteSqlCommandAsync(@"exec spMenuUserDelete @MenuUserDT,@Result out" 
                ,MenuUserDetails,Result );

            return int.Parse(Result.Value.ToString());      

        }

        public async Task<MstrUserLocation> GetDefaultLocForUser(int userId)
        {
            return await _context.MstrUserLocation.Where(u => u.UserId == userId)
                .FirstOrDefaultAsync(p => p.IsDefault);
        }       
      
        public async Task<int> SetDefaultLocationAsync(MstrUserLocation userLoc)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("UserId", userLoc.UserId);
            para.Add("UserLocId", userLoc.AutoId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spUserLocSetDefault", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<int> SaveColorCardAsync(MstrColorCard mstrccard)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , mstrccard.AutoId);
            para.Add("Name", mstrccard.Name);
            para.Add("UserId", mstrccard.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrColorCardSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<int> SaveColorAsync(MstrColor mstrColor)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , mstrColor.AutoId);
            para.Add("Code", mstrColor.Code.ToUpper());
            para.Add("Name", mstrColor.Name.ToUpper());
            para.Add("LinkColor", mstrColor.LinkColorCard);
            para.Add("UserId", mstrColor.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrColorSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<int> SaveSizeCardAsync(MstrSizeCard mstrscard)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , mstrscard.AutoId);
            para.Add("Name", mstrscard.Name);
            para.Add("UserId", mstrscard.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrSizeCardSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<int> SaveSizeAsync(MstrSize mstrSize)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , mstrSize.AutoId);
            para.Add("Code", mstrSize.Code.ToUpper());
            para.Add("Name", mstrSize.Name.ToUpper());
            para.Add("LinkSize", mstrSize.LinkSizeCard);
            para.Add("UserId", mstrSize.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrSizeSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<int> DeactiveSizeCardAsync(MstrSizeCard mstrscard)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("SizeCardId" , mstrscard.AutoId);
            para.Add("IsActive" , mstrscard.IsActive);
            para.Add("UserId", mstrscard.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrSizeCardDeactive", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<int> DeactiveColorCardAsync(MstrColorCard mstrccard)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("ColorCardId" , mstrccard.AutoId);
            para.Add("IsActive", mstrccard.IsActive);
            para.Add("UserId", mstrccard.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrColorCardDeactive", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

      
    }
}