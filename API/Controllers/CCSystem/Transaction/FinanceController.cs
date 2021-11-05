using System.Linq;
using System.Threading.Tasks;
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
                .Join(_context.MstrUnits , e => e.CurrencyFId , f => f.AutoId , (e,f) => new  {e,f} )
                .Join(_context.MstrUnits , a => a.e.CurrencyTId , t => t.AutoId , (a,t) =>
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
    }
}