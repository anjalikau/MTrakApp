using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers.CCSystem.Transaction
{
    public class FinanceController : BaseApiController
    {
        private readonly IApplicationCartonDbContext _context;
        private readonly IFinanceRepository _financeRepository;
        public FinanceController(IApplicationCartonDbContext context, IFinanceRepository financeRepository)
        {
            _financeRepository = financeRepository;
            _context = context;
        }

        [HttpPost("SaveExR")]
        public async Task<IActionResult> SaveExchangeRate(TransExchangeRate exchangeRate) 
        {
            var result = await _financeRepository.SaveExchageRateAsync(exchangeRate);
            return Ok(result);
        }

        [HttpGet("ExRate")]
        public async Task<IActionResult> GetExchangeRate() 
        {
            var result = await _context.TransExchangeRate
                .Join(_context.MstrCurrency , e => e.CurrencyFId , f => f.AutoId , (e,f) => new  {e,f} )
                .Join(_context.MstrCurrency , a => a.e.CurrencyTId , t => t.AutoId , (a,t) =>
                 new {
                    autoId = a.e.AutoId,
                    currencyFId = a.e.CurrencyFId,
                    currencyTId = a.e.CurrencyTId,
                    validFrom = a.e.ValidFrom,
                    validTo = a.e.ValidTo,
                    rate = a.e.Rate,
                    currencyFrom = a.f.Code,
                    currencyTo = t.Code
                 }).ToListAsync();

            return Ok(result);
        }

        [HttpGet("Rate")]
        public async Task<IActionResult> GetRate() 
        {
            var result = await _context.MstrTax
                    .Select(x => new { x.AutoId , x.Description , x.Rate })
                    .ToListAsync();

            return Ok(result);
        }

        [HttpPost("SaveTax")]
        public async Task<IActionResult> SaveTax(MstrTax tax) 
        {
            var result = await _financeRepository.SaveTaxAsync(tax);
            return Ok(result);
        }

        [HttpGet("Bank")]
        public async Task<IActionResult> GetBank() 
        {
            var result = await _context.MstrBank
                    .Join(_context.MstrCurrency , b => b.CurrencyId , c => c.AutoId ,
                    (b, c) => new {
                        autoId = b.AutoId,
                        name = b.Name,
                        accountNo = b.AccountNo,
                        branch = b.Branch,
                        nextChequeNo = b.NextChequeNo,
                        currencyId = b.CurrencyId,
                        // Symbol = c.Symbol,
                        currency = c.Code
                    })               
                    .ToListAsync();

            return Ok(result);
        }

        [HttpPost("SaveBank")]
        public async Task<IActionResult> SaveBank(MstrBank bank) 
        {
            var result = await _financeRepository.SaveBankAsync(bank);
            return Ok(result);
        }

        [HttpGet("PInvoice/{customerId}")]
        public async Task<IActionResult> GetInvoicePendDt(int customerId) 
        {
            var result = await _financeRepository.GetInvoicePendDtAsync(customerId);
            return Ok(result);
        }

        [HttpPost("SaveInvoice")]
        public async Task<IActionResult> SaveInvoice(SavedInvoiceDto invoiceDto) 
        {
            var result = await _financeRepository.SaveInvoiceAsync(invoiceDto);
            return Ok(result);
        }

        [HttpGet("GetInvDt/{invoiceNo}")]
        public async Task<IActionResult> GetInvoiceDetails(string invoiceNo) 
        {
            var result = await _financeRepository.GetInvoiceDetailsAsync(invoiceNo);
            return Ok(result);
        }

        [HttpGet("InvList/{cusRef}")]
        public async Task<IActionResult> GetInvoiceList(string cusRef) 
        {
            var result = await _financeRepository.GetInvoiceListAsync(cusRef);
            return Ok(result);
        }

    }
}