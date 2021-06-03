

using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers.Transaction
{
    [Authorize]
    public class SalesOrderController : BaseApiController
    {
        private readonly IApplicationCartonDbContext _context;
        private readonly ISalesRepository _salesRepository;
        public SalesOrderController(IApplicationCartonDbContext context, ISalesRepository salesRepository)
        {
            _salesRepository = salesRepository;
            _context = context;
        }

        [HttpGet("SORefNo")]
        public async Task<IActionResult> GetSalesOrderRef()
        {
            var refNo = await _salesRepository.GetSalesOrderRefAsync();
            return Ok(refNo);
        }

        [HttpGet("SO/{orderRef}")]
        public async Task<IActionResult> GetSalesOrder(string orderRef)
        {
            var saleOredrList = await _salesRepository.GetSalesOrderAsync(orderRef);
            return Ok(saleOredrList);
        }

        [HttpPost("SOSave")]
        public async Task<IActionResult> SaveSalesOrder(List<SalesOrderRecDto> salesOrder)
        {
            var result = await _salesRepository.SaveSalesOrderAsync(salesOrder);
            return Ok(result);
        }

    }
}