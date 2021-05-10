using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
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

        public async Task<IEnumerable<MstrLocation>> GetLocationAsync(int sysModuleId)
        {
            IEnumerable<MstrLocation> locationList;
            var values = new { SysModuleId = sysModuleId };

            locationList = await DbConnection.QueryAsync<MstrLocation>("spSysModuleGetLocation"
            , values, commandType: CommandType.StoredProcedure);
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

            foreach (var item in userModuleDTO)
            {
                dt.Rows.Add(item.UserId,item.SysModuleId,item.LocationId);
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