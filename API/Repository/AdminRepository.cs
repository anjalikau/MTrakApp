using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.Admin;
using API.Interfaces;
using Dapper;
using Microsoft.Data.SqlClient;

namespace API.Repository
{
    public class AdminRepository : DbConnAdminRepositoryBase , IAdminRepository
    {
        public AdminRepository(IDbConnectionFactory dbConnectionFactory) : base(dbConnectionFactory)
        {
        }

        public async Task<IEnumerable<MstrLocation>> GetLocationAsync(MstrLocation loc)
        {
            IEnumerable<MstrLocation> locationList;
            DynamicParameters para = new DynamicParameters();

            para.Add("SysModuleId", loc.SysModuleId);
            para.Add("CompanyId", loc.CompanyId);
            //var values = new { SysModuleId = loc.SysModuleId };

            locationList = await DbConnection.QueryAsync<MstrLocation>("spSysModuleGetLocation"
            , para, commandType: CommandType.StoredProcedure);
            return locationList;
        } 

        public async Task<IEnumerable<UserLocationDto>> GetUserLocAsync(MstrAgentModule userMod)
        {
            IEnumerable<UserLocationDto> locationList;
            DynamicParameters para = new DynamicParameters();

            para.Add("SysModuleId", userMod.SysModuleId);
            para.Add("UserId", userMod.UserId);
            
            locationList = await DbConnection.QueryAsync<UserLocationDto>("spSysModuleGetUserLoc"
            , para, commandType: CommandType.StoredProcedure);
            return locationList;
        } 

        public async Task<IEnumerable<UserModuleDto>> GetUserModuleAsync(int userId)
        {
            IEnumerable<UserModuleDto> UserModList;
            var values = new { UserId = userId };

            UserModList = await DbConnection.QueryAsync<UserModuleDto>("spSysModuleGetSysMod"
            , values, commandType: CommandType.StoredProcedure);
            return UserModList;
        } 

        public async Task<int> SaveUserModule(List<UserModuleDto> userModuleDTO)
        {
            DynamicParameters para = new DynamicParameters();
            var dt = new DataTable();

            dt.Columns.Add("UserId", typeof(int));
            dt.Columns.Add("SysModuleId", typeof(int));
            dt.Columns.Add("LocationId", typeof(int));
            dt.Columns.Add("CompanyId", typeof(int));

            foreach (var item in userModuleDTO)
            {
                dt.Rows.Add(item.UserId,item.SysModuleId,item.LocationId,item.CompanyId);
            }            

            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);
            para.Add("@UserSysModuleDT", dt.AsTableValuedParameter("dbo.UserSysModuleType"));   

            var result = await DbConnection.ExecuteAsync("spSysModuleSave"
                //, new { UserSysModuleDT = dt.AsTableValuedParameter("dbo.UserSysModuleType") , Result = 0 }
                , para
                , commandType: CommandType.StoredProcedure);            

           return para.Get<int>("Result");
        } 

        public async Task<int> DeleteUserModule(DeleteuserModDto deleteModDto)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("UserId", deleteModDto.UserId);
            para.Add("UserModuleId", deleteModDto.UserModuleId);
            para.Add("UserLocId", deleteModDto.UserLocId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spSysModuleDelete", para
                , commandType: CommandType.StoredProcedure);            

           return para.Get<int>("Result");
        }                  
    }
}