using System.Data;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Interfaces;
using Dapper;

namespace API.Repository
{
    public class FinanceRepository : DbConnCartonRepositoryBase, IFinanceRepository
    {
        private readonly IApplicationCartonDbContext _context;
        public FinanceRepository(IApplicationCartonDbContext context, IDbConnectionFactory dbConnectionFactory) : base(dbConnectionFactory)
        {
            _context = context;
        }

        public async Task<int> SaveExchageRateAsync(TransExchangeRate exchangeRate)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId", exchangeRate.AutoId);
            para.Add("CurrencyFId", exchangeRate.CurrencyFId);
            para.Add("CurrencyTId", exchangeRate.CurrencyTId);
            para.Add("Rate", exchangeRate.Rate);
            para.Add("ValidFrom", exchangeRate.ValidFrom);
            para.Add("ValidTo", exchangeRate.ValidTo);
            para.Add("UserId", exchangeRate.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spTransExchangeRateSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<int> SaveTaxAsync(MstrTax tax)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId", tax.AutoId);
            para.Add("Description", tax.Description);
            para.Add("Rate", tax.Rate);
            para.Add("UserId", tax.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrTaxSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

    }
}