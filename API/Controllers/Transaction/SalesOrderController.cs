

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;

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
        public async Task<IActionResult> SaveSalesOrder(List<SalesOrderDeliveryDto> salesOrder)
        {
            var result = await _salesRepository.SaveSalesOrderAsync(salesOrder);
            return Ok(result);
        }

        [HttpGet("JobPedItems/{id}")]
        public async Task<IActionResult> GetPendOrderItems(int id)
        {
            var pendOrderItems = await _salesRepository.GetPendOrderItemsAsync(id);
            return Ok(pendOrderItems);
        }

        [HttpPost("JobPedOrders")]
        public async Task<IActionResult> GetPendDelivOrder(PendingOrderItemsDto items)
        {
            var pendOrders = await _salesRepository.GetPendDelivOrderAsync(items);
            return Ok(pendOrders);
        }

        [HttpGet("JobNo")]
        public async Task<IActionResult> GetJobRefNumber()
        {
           var jobNo = await _salesRepository.GetJobRefNumberAsync();
           return Ok(jobNo);
        }

        [HttpPost("CostComb")]
        public async Task<IActionResult> GetCostComination(PendingOrderItemsDto items)
        {
            var combin = await _context.TransCostHeader
                .Where(x => x.CustomerId == items.CustomerId && x.ArticleId == items.ArticleId 
                    && x.ColorId == items.ColorId && x.SizeId == items.SizeId)
                .Join(_context.MstrCombination, h => h.CombinId, c => c.AutoId
                    , (h, c) =>
                    new
                    {
                        CombinId = c.AutoId,
                        Combination = c.Combination
                    }).ToListAsync();
          
            return Ok(combin);
        }

        [HttpPost("SaveJob")]
        public async Task<IActionResult> SaveJobCard(List<TransJobDetail> transJob) 
        {
            var result = await _salesRepository.SaveJobCardAsync(transJob);
            return Ok(result);
        }

        [HttpGet("JobCard/{jobNo}")]
        public async Task<IActionResult> GetJobCardDetails(string jobNo) 
        {
            var result = await _salesRepository.GetJobCardDetailsAsync(jobNo);
            return Ok(result);
        }

        [HttpGet("FPO/JobList")]
        public async Task<IActionResult> GetFPOPendingJobs() 
        {
            var jobList = await _salesRepository.GetFPOPendingJobsAsync();
            return Ok(jobList);
        }

        [HttpGet("FPO/JobList/{id}")]
        public async Task<IActionResult> GetFPOPendingJobDt(int id) 
        {
            var jobList = await _salesRepository.GetFPOPendingJobDtAsync(id);
            return Ok(jobList);
        }

    }
}