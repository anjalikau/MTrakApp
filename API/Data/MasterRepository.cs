using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.Data.SqlClient.Server;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MasterRepository : IMasterRepository
    {
        private readonly DataContext _context;
        //private readonly DataConnection _connection;
        public MasterRepository(DataContext context)
        {
            //_connection = connection;
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
                    .Select(p => new { p.iCategoryLevel })
                    .SingleOrDefaultAsync();

            return await _context.MstrAgentLevel
                    .Where(x => x.LevelPrority >= agentLevel.iCategoryLevel)
                    .ToListAsync();
        }

        public async Task<IEnumerable<MenuJoinList>> GetAuthMenuListAsync(int agentid)
        {
            var AgentId = new SqlParameter("AgentId", agentid);
            string StoredProc = "exec spMenuListAuthorize @AgentId";
            return await _context.MenuJoinList.FromSqlRaw(StoredProc , AgentId)
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

            // var tableSchema = new List<SqlMetaData>(3)
            // {
            //     new SqlMetaData("AgentId", SqlDbType.Int),
            //     new SqlMetaData("MenuId", SqlDbType.Int),
            //     new SqlMetaData("CreUserID", SqlDbType.Int)
            // }.ToArray();

            // var MenuUserDT = new List<SqlDataRecord>();

            // foreach (var item in menuList)
            // {
            //     var tableRow = new SqlDataRecord(tableSchema);
            //     tableRow.SetInt32(0, item.AgentId);
            //     tableRow.SetInt32(1, item.MenuId);
            //     tableRow.SetInt32(2, item.CreUserID);
            //     MenuUserDT.Add(tableRow);
            // }          

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

         

      
    }
}