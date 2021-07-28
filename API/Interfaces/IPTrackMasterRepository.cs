using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;

namespace API.Interfaces
{
    public interface IPTrackMasterRepository
    {
         Task<IEnumerable<ReportListDto>> GetReportMenuListAsync();
    }
}