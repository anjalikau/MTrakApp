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

namespace API.Controllers.CCSystem.Transaction
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

        [HttpPost("SaSO")]
        public async Task<IActionResult> SaveSalesOrder(List<SalesOrderDeliveryDto> salesOrder)
        {
            var result = await _salesRepository.SaveSalesOrderAsync(salesOrder);
            return Ok(result);
        }

        [HttpGet("PendSO/{customerId}")]
        public async Task<IActionResult> GetPendCostSalesOrders(int customerId)
        {
            var result = await _context.TransSalesOrderHeader 
                .Where(x => x.CustomerId == customerId)               
                .Join(_context.TransSalesOrderItemDt , h => h.AutoId , d => d.SOHeaderId ,
                    (h , d ) => new {
                       autoId = h.AutoId,
                       orderRef = h.OrderRef,
                       costingId = d.CostingId
                    })
                .Where(d => d.costingId == 0).Distinct()
                .ToListAsync();
            return Ok(result);
        }

        [HttpGet("SOHead/{SOHeaderId}")]
        public async Task<IActionResult> GetPendSalesOrderItem(int SOHeaderId)
        {
            var saleOredrList = await _salesRepository.GetPendSalesOrderItemAsync(SOHeaderId);
            return Ok(saleOredrList);
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

        [HttpGet("RefNum/{TransType}")]
        public async Task<IActionResult> GetRefNumber(string TransType)
        {
           var refNum = await _salesRepository.GetRefNumberAsync(TransType);
           return Ok(refNum);
        }

        [HttpPost("CostComb")]
        public async Task<IActionResult> GetCostComination(PendingOrderItemsDto items)
        {
            var combin = await _context.TransCostingHeader
                .Where(x => x.CustomerId == items.CustomerId && x.ArticleId == items.ArticleId 
                    && x.ColorId == items.ColorId && x.SizeId == items.SizeId)
                .Join(_context.MstrCombination, h => h.CombinId, c => c.AutoId
                    , (h, c) =>
                    new
                    {
                        CombinId = c.AutoId,
                        Combination = c.Combination
                    }).Distinct().ToListAsync();
          
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

        [HttpPost("SaveFPO")]
        public async Task<IActionResult> SaveFPO(List<FacProdOrderDto> facProdOrderDto)
        {
            var result = await _salesRepository.SaveFPOAsync(facProdOrderDto);
            return Ok(result);
        }

        [HttpGet("FPODetails/{FPONo}")]
        public async Task<IActionResult> GetFPODetails(string FPONo)
        {
            var FPODetails = await _salesRepository.GetFPODetailsAsync(FPONo);
            return Ok(FPODetails);
        }

        [HttpPost("DeleteFPO")]
        public async Task<IActionResult> DeleteFPO(DeleteFPODto fpoDto)
        {
            var result = await _salesRepository.DeleteFPOAsync(fpoDto);
            return Ok(result);
        }

        [HttpGet("FPPOIn/{FPPODId}")]
        public async Task<IActionResult> GetFPPOInDetails(int FPPODId)
        {
            var result = await _salesRepository.GetFPPOInDetailsAsync(FPPODId);
            return Ok(result);
        }

        [HttpPost("SaveFPPOIn")]
        public async Task<IActionResult> SaveFPPOInDeails(TransProductionDetails prod)
        {
            var result = await _salesRepository.SaveFPPOInAsync(prod);
            return Ok(result);
        }

        [HttpGet("FPPOTot")]
        public async Task<IActionResult> GetTransProductionTot()
        {
            var result = await _salesRepository.GetTransProductionTotAsync();
            return Ok(result);
        }

        [HttpGet("FPPOOut/{FPPODId}")]
        public async Task<IActionResult> GetFPPOOutDetails(int FPPODId)
        {
            var result = await _salesRepository.GetFPPOOutDetailsAsync(FPPODId);
            return Ok(result);
        }

        [HttpPost("SaveFPPOOut")]
        public async Task<IActionResult> SaveFPPOOutDetails(TransProductionDetails prod)
        {
            var result = await _salesRepository.SaveFPPOOutAsync(prod);
            return Ok(result);
        }

        [HttpPost("SaveFPPORej")]
        public async Task<IActionResult> SaveFPPORejectDetails(List<TransProdDetailsDto> prodDetails)
        {
            var result = await _salesRepository.SaveFPPORejectAsync(prodDetails);
            return Ok(result);
        }

        [HttpGet("DispatchSite")]
        public async Task<IActionResult> GetDispatchSite()
        {
            var result = await _context.MstrDispatchSite
                .Join(_context.MstrStoreSite , d => d.DispatchId , s => s.AutoId ,
                 (d , s)  =>
                 new {
                     autoId = s.AutoId,
                     siteName = s.SiteName,
                     siteCode = s.SiteCode
                 }).ToListAsync();

            return Ok(result);
        }

        [HttpPost("PendDispatch")]
        public async Task<IActionResult> GetPendDispatchDetails(PendDispatchDto prod)
        {
            var result = await _salesRepository.GetPendDispatchDtAsync(prod);
            return Ok(result);
        }

        [HttpPost("SaveDispatch")]
        public async Task<IActionResult> SaveDispatchDetails(List<TransDispatchDetails> dispatch)
        {
            var result = await _salesRepository.SaveDispatchedDtAsync(dispatch);
            return Ok(result);
        }

        [HttpGet("DD/{dispatchNo}")]
        public async Task<IActionResult> GetDispatchDetails(string dispatchNo)
        {
            var result = await _salesRepository.GetDispatchDetails(dispatchNo);
            return Ok(result);
        }

        [HttpPost("CancelDD")]
        public async Task<IActionResult> CancelDispatchNote(TransDispatchHeader dispHd)
        {
            var result = await _salesRepository.CancelDispatchDtAsync(dispHd);
            return Ok(result);
        }

        [HttpPost("SaveCost")]
        public async Task<IActionResult> SaveCosting(List<SavedCostingDto> costDetails)
        {
            var result = await _salesRepository.SaveCostingAsync(costDetails);
            return Ok(result);
        }

        [HttpGet("CostList/{id}")]
        public async Task<IActionResult> GetCostHeaderList(long id) 
        {
            var result = await _salesRepository.GetCostHeaderListAsync(id);
            return Ok(result);
        }

        [HttpGet("CostHd/{id}")]
        public async Task<IActionResult> GetCostHeader(int id)
        {
            var result = await _salesRepository.GetCostHeaderAsync(id);
            return Ok(result);
        }  

        [HttpGet("CSDt/{id}")]
        public async Task<IActionResult> GetCostingDetails(long id)
        {
            var result = await _salesRepository.GetCostingDetailsAsync(id);
            return Ok(result);
        }    

        [HttpPost("AttachCS")]
        public async Task<IActionResult> AttachCostSheetSO(TransSalesOrderItemDt soItem)
        {
            var result = await _salesRepository.AttachCostSheetSOAsync(soItem);
            return Ok(result);
        }   

        [HttpPost("RemoveCS")]
        public async Task<IActionResult> RemoveCostSheetSO(TransSalesOrderItemDt soItem)
        {
            var result = await _salesRepository.RemoveCostSheetSOAsync(soItem);
            return Ok(result);
        }     

    }
}