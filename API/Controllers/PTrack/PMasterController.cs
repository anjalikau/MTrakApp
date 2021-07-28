using System.Linq;
using System.Threading.Tasks;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers.PTrack
{
    [Authorize]
    public class PMasterController : BaseApiController
    {
        private readonly IApplicationPTrackDbContext _context;
        private readonly IPTrackMasterRepository _pTrackMasterRepository;

        public PMasterController(IApplicationPTrackDbContext context, IPTrackMasterRepository pTrackMasterRepository)
        {
            _pTrackMasterRepository = pTrackMasterRepository;
            _context = context;
        }

        [HttpGet("ReportList")]
        public async Task<IActionResult> GetReportMenuList() 
        {
            var result = await _pTrackMasterRepository.GetReportMenuListAsync();
            return Ok(result);
        }
    }
}