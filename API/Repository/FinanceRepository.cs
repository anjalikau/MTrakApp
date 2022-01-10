using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
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

        public async Task<int> SaveBankAsync(MstrBank bank)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId", bank.AutoId);
            para.Add("Name", bank.Name);
            para.Add("Branch", bank.Branch);
            para.Add("AccountNo", bank.AccountNo);
            para.Add("CurrencyId", bank.CurrencyId);
            para.Add("NextChequeNo", bank.NextChequeNo);
            para.Add("UserId", bank.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrBankSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<IEnumerable<PendInvoiceDto>> GetInvoicePendDtAsync(int CustomerId)
        {
            IEnumerable<PendInvoiceDto> pendDetails;
            DynamicParameters para = new DynamicParameters();

            para.Add("CustomerId" , CustomerId);  

            pendDetails = await DbConnection.QueryAsync<PendInvoiceDto>("spTransInvoiceGetPendDt" , para
                    , commandType: CommandType.StoredProcedure);
            return pendDetails;
        }

        public async Task<ReturnDto> SaveInvoiceAsync(SavedInvoiceDto invoiceDto)
        {
            DataTable InvoiceDT = new DataTable();

            DynamicParameters para = new DynamicParameters();          

            ///////////----------- INVOICE HEADER ------------------------
            para.Add("AutoId", invoiceDto.InvoiceHeader.AutoId);
            para.Add("InvoiveNo", invoiceDto.InvoiceHeader.InvoiceNo);
            para.Add("LocationId", invoiceDto.InvoiceHeader.LocationId);
            para.Add("CustomerId", invoiceDto.InvoiceHeader.CustomerId);
            para.Add("PaymentDue", invoiceDto.InvoiceHeader.PaymentDueDate);
            para.Add("CustomerAddId", invoiceDto.InvoiceHeader.CustomerAddId);
            para.Add("InvCurrencyId", invoiceDto.InvoiceHeader.InvCurrencyId);
            para.Add("BaseCurrencyId", invoiceDto.InvoiceHeader.BaseCurrencyId);
            para.Add("ExchangeRate", invoiceDto.InvoiceHeader.ExchangeRate);
            para.Add("Attention", invoiceDto.InvoiceHeader.Attention);
            para.Add("TaxNo", invoiceDto.InvoiceHeader.TaxNo);
            para.Add("VatNo", invoiceDto.InvoiceHeader.VatNo);
            para.Add("TotalAmount", invoiceDto.InvoiceHeader.TotalAmount);
            para.Add("TaxAmount", invoiceDto.InvoiceHeader.TaxAmount);
            para.Add("GrossAmount", invoiceDto.InvoiceHeader.GrossAmount);
            para.Add("DiscountAmount", invoiceDto.InvoiceHeader.DiscountAmount);
            para.Add("NBTRate", invoiceDto.InvoiceHeader.NBTRate);
            para.Add("NBTAmount", invoiceDto.InvoiceHeader.NBTAmount);
            para.Add("NetAmount", invoiceDto.InvoiceHeader.NetAmount);
            para.Add("NetValue", invoiceDto.InvoiceHeader.NetValue);
            para.Add("TaxValue", invoiceDto.InvoiceHeader.TaxValue);
            para.Add("UserId", invoiceDto.InvoiceHeader.CreateUserId);

            /////// ---------- INVOICE DETAILS ------------------
            InvoiceDT.Columns.Add("DispatchDtId", typeof(long));
            InvoiceDT.Columns.Add("SOItemDtId", typeof(long));
            InvoiceDT.Columns.Add("Qty", typeof(int));
            InvoiceDT.Columns.Add("UOM", typeof(int));
            InvoiceDT.Columns.Add("UnitPrice", typeof(decimal));
            InvoiceDT.Columns.Add("Value", typeof(decimal));
            InvoiceDT.Columns.Add("TaxId", typeof(int));
            InvoiceDT.Columns.Add("TaxRate", typeof(decimal));
            InvoiceDT.Columns.Add("TaxAmount", typeof(decimal));
            InvoiceDT.Columns.Add("GrossAmount", typeof(decimal));
            InvoiceDT.Columns.Add("DiscountP", typeof(decimal));
            InvoiceDT.Columns.Add("DiscountA", typeof(decimal));
            InvoiceDT.Columns.Add("NetAmount", typeof(decimal));   

            foreach (var item in invoiceDto.InvoiceDetails)
            {
                InvoiceDT.Rows.Add(item.DispatchDtId, 
                                item.SOItemDtId ,
                                item.Qty,
                                item.UOM,
                                item.UnitPrice,
                                item.Value,
                                item.TaxId,
                                item.TaxRate,
                                item.TaxAmount,
                                item.GrossAmount,
                                item.DiscountP,
                                item.DiscountA,
                                item.NetAmount);
            }   
           
            para.Add("InvoiceDT", InvoiceDT.AsTableValuedParameter("InvoiceDTType"));

            var result = await DbConnection.QueryFirstOrDefaultAsync<ReturnDto>("spTransInvoiceSave", para
                , commandType: CommandType.StoredProcedure);

            return result;
        }

        public async Task<InvoiceDto> GetInvoiceDetailsAsync(string invoiceNo)
        {
            InvoiceDto invoice = new InvoiceDto();
            DynamicParameters para = new DynamicParameters();

            para.Add("InvoiceNo", invoiceNo);

            using (var multi = await DbConnection.QueryMultipleAsync("spTransInvoiceGetDt", para, commandType: CommandType.StoredProcedure))
            {
                invoice.InvoiceHeader = multi.Read<TransInvoiceHeader>();
                invoice.InvoiceDetails = multi.Read<InvoiceDetailsDto>();
            }
            return invoice;
        }

        public async Task<int> ApproveInvoiceAsync(TransInvoiceHeader invoiceHd)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("InvoiceHdId", invoiceHd.AutoId);
            para.Add("UserId", invoiceHd.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spTransInvoiceApprove", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<IEnumerable<InvoiceNoListDto>> GetInvoiceListAsync(string customerRef)
        {
            IEnumerable<InvoiceNoListDto> invoiceList;
            DynamicParameters para = new DynamicParameters();

            para.Add("CustomerRef" , customerRef);

            invoiceList = await DbConnection.QueryAsync<InvoiceNoListDto>("spTransInvoiceGetList" , para
                    , commandType: CommandType.StoredProcedure);
            return invoiceList;
        }

    }
}