using System.Threading.Tasks;
using API.Entities;

namespace API.Interfaces
{
    public interface IFinanceRepository
    {
         Task<int> SaveExchageRateAsync(TransExchangeRate exchangeRate);
    }
}