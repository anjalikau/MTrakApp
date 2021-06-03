using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface ISalesRepository
    {
         Task<TransSalesOrderHd> GetSalesOrderRefAsync();
         Task<ReturnDto> SaveSalesOrderAsync(List<SalesOrderRecDto> salesOrder);
         Task<IEnumerable<SalesOrderRetDto>> GetSalesOrderAsync(string SORefNo);
    }
}