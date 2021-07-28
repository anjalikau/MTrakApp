using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Interfaces;
using Dapper;

namespace API.Repository
{
    public class PTrackMasterRepository : DbConnPTrackRepositoryBase, IPTrackMasterRepository
    {
        private readonly IApplicationPTrackDbContext _context;
        public PTrackMasterRepository(IApplicationPTrackDbContext context, IDbConnectionFactory dbConnectionFactory) : base(dbConnectionFactory)
        {
            _context = context;
        }

        public async Task<IEnumerable<ReportListDto>> GetReportMenuListAsync()
        {   
            IEnumerable<ReportListDto> coloList;
            // DynamicParameters para = new DynamicParameters();

            // para.Add("ArticleId" , articleId);
            //para.Add("LocationId", articleDto.LocationId);

            coloList = await DbConnection.QueryAsync<ReportListDto>("spMPlusReportGetDetails" , null
                    , commandType: CommandType.StoredProcedure);
            
            return coloList;
        } 
    }
}