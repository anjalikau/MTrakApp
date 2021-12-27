using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface ISalesRepository
    {
         Task<TransSalesOrderHd> GetSalesOrderRefAsync();
         Task<ReturnDto> SaveSalesOrderAsync(List<SalesOrderDeliveryDto> salesOrder);
         Task<IEnumerable<SalesOrderRetDto>> GetSalesOrderAsync(string SORefNo);
         Task<IEnumerable<PendingOrderItemsDto>> GetPendOrderItemsAsync(int custometId);
         Task<IEnumerable<PendingDelivOrderDto>> GetPendDelivOrderAsync(PendingOrderItemsDto items);
         Task<RefNumDto> GetRefNumberAsync(string TransType);
         Task<ReturnDto> SaveJobCardAsync(List<TransJobDetail> trnsJob);
         Task<IEnumerable<ReturnJobCardDto>> GetJobCardDetailsAsync(string jobNo);
         Task<IEnumerable<TransJobHeader>> GetFPOPendingJobsAsync();
         Task<IEnumerable<PendJobDetailsDto>> GetFPOPendingJobDtAsync(int JobId);
         Task<ReturnDto> SaveFPOAsync(List<FacProdOrderDto> facProdOrderDtos);
         Task<IEnumerable<ReturnFPODetailsDto>> GetFPODetailsAsync(string FPONo);
         Task<int> DeleteFPOAsync(DeleteFPODto fPODto);
         Task<FPPOProductionDto> GetFPPOInDetailsAsync(int FPPODId);
         Task<int> SaveFPPOInAsync(TransProductionDetails prodDetails);
         Task<IEnumerable<TransProductionTotalDto>> GetTransProductionTotAsync();
         Task<FPPOProductionDto> GetFPPOOutDetailsAsync(int FPPODId);
         Task<int> SaveFPPOOutAsync(TransProductionDetails prodDetails);
         Task<int> SaveFPPORejectAsync(List<TransProdDetailsDto> prodDetails);
         Task<IEnumerable<PendDispatchDto>> GetPendDispatchDtAsync(PendDispatchDto prod);
         Task<ReturnDto> SaveDispatchedDtAsync(List<TransDispatchDetails> dispatch);
         Task<IEnumerable<DispatchedDetDto>> GetDispatchDetails(string dispatchNo);
         Task<int> CancelDispatchDtAsync(TransDispatchHeader dispHd);
         Task<ReturnDto> SaveCostingAsync(List<SavedCostingDto> costDt);
         Task<CostingSheetDto> GetCostingDetailsAsync(long costHearderId);
         Task<IEnumerable<SalesItemDto>> GetPendSalesOrderItemAsync(int SOHeaderId);
         Task<IEnumerable<CostHeaderDto>> GetCostHeaderAsync(long ArticleColorSizeId);
         Task<int> AttachCostSheetSOAsync(TransSalesOrderItemDt soItemDt);
         Task<int> RemoveCostSheetSOAsync(TransSalesOrderItemDt soItemDt);
         Task<IEnumerable<CostHeaderDto>> GetCostHeaderListAsync(long CustomerId);
    }
}