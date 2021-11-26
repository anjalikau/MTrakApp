using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IFinanceRepository
    {
        Task<int> SaveExchageRateAsync(TransExchangeRate exchangeRate);
        Task<int> SaveTaxAsync(MstrTax tax);
        Task<int> SaveBankAsync(MstrBank bank);
        Task<IEnumerable<PendInvoiceDto>> GetInvoicePendDtAsync(int CustomerId);
        Task<ReturnDto> SaveInvoiceAsync(SavedInvoiceDto invoiceDto);
        Task<InvoiceDto> GetInvoiceDetailsAsync(string invoiceNo);
        Task<int> ApproveInvoiceAsync(TransInvoiceHeader invoiceHd);
    }
}