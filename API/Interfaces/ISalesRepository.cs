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
         Task<RefNumDto> GetJobRefNumberAsync();
         Task<ReturnDto> SaveJobCardAsync(List<TransJobDetail> trnsJob);
         Task<IEnumerable<ReturnJobCardDto>> GetJobCardDetailsAsync(string jobNo);
    }
}