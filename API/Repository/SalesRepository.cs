using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace API.Repository
{
    public class SalesRepository : DbConnCartonRepositoryBase, ISalesRepository
    {
        private readonly IApplicationCartonDbContext _context;
        public SalesRepository(IApplicationCartonDbContext context, IDbConnectionFactory dbConnectionFactory) : base(dbConnectionFactory)
        {
            _context = context;
        }

        public async Task<TransSalesOrderHd> GetSalesOrderRefAsync()
        {
            TransSalesOrderHd SOHeader;
            SOHeader = await DbConnection.QueryFirstAsync<TransSalesOrderHd>("spSalesOrderGetCustRef", null
                , commandType: CommandType.StoredProcedure);

            return SOHeader;
        }

        public async Task<IEnumerable<SalesOrderRetDto>> GetSalesOrderAsync(string SORefNo)
        {   
            IEnumerable<SalesOrderRetDto> salOrderList;
            DynamicParameters para = new DynamicParameters();

            para.Add("SORefNo" , SORefNo);

            salOrderList = await DbConnection.QueryAsync<SalesOrderRetDto>("spSalesOrderGetSODetails" , para
                    , commandType: CommandType.StoredProcedure);
            
            return salOrderList;
        } 

        
        public async Task<ReturnDto> SaveSalesOrderAsync(List<SalesOrderRecDto> salesOrder)
        {
            DataTable SOHeader = new DataTable();
            DataTable SOItem = new DataTable();
            DataTable SODelivery = new DataTable();
            DynamicParameters para = new DynamicParameters();

            SOHeader.Columns.Add("autoId", typeof(int));
            SOHeader.Columns.Add("UserId", typeof(int));
            SOHeader.Columns.Add("customerDtId", typeof(int));
            SOHeader.Columns.Add("customerId", typeof(int));
            SOHeader.Columns.Add("customerRef", typeof(string));
            SOHeader.Columns.Add("delDate", typeof(string));
            SOHeader.Columns.Add("orderRef", typeof(string));

            SOItem.Columns.Add("autoId", typeof(int));
            SOItem.Columns.Add("articleId", typeof(int));
            SOItem.Columns.Add("colorId", typeof(int));
            SOItem.Columns.Add("sizeId", typeof(int));
            SOItem.Columns.Add("qty", typeof(int));
            SOItem.Columns.Add("costingId", typeof(int));
            SOItem.Columns.Add("isIntendCreated", typeof(bool));

            SODelivery.Columns.Add("autoId", typeof(int));
            SODelivery.Columns.Add("deliveryDate", typeof(string));
            SODelivery.Columns.Add("deliveryRef", typeof(string));
            SODelivery.Columns.Add("soItemDtId", typeof(int));
            SODelivery.Columns.Add("articleId", typeof(int));
            SODelivery.Columns.Add("colorId", typeof(int));
            SODelivery.Columns.Add("sizeId", typeof(int));
            SODelivery.Columns.Add("qty", typeof(int));

            foreach (var item in salesOrder)
            {
                if (item.status == "H")
                {
                    SOHeader.Rows.Add(
                        item.AutoId
                        , item.UserId
                        , item.CustomerDtId
                        , item.CustomerId
                        , item.CustomerRef.ToUpper().Trim()
                        , item.DelDate
                        , item.OrderRef.Trim());
                }
                else if (item.status == "I")
                {
                    SOItem.Rows.Add(item.AutoId
                        , item.ArticleId
                        , item.ColorId
                        , item.SizeId
                        , item.Qty
                        , item.CostingId
                        , item.IsIntendCreated);
                }
                else if (item.status == "D")
                {
                    SODelivery.Rows.Add(item.AutoId
                        , item.DeliveryDate
                        , item.DeliveryRef
                        , item.SOItemDtId
                        , item.ArticleId
                        , item.ColorId
                        , item.SizeId
                        , item.Qty);
                }
            }           

            para.Add("SOHeader", SOHeader.AsTableValuedParameter("SOHeaderType"));
            para.Add("SOItem", SOItem.AsTableValuedParameter("SOItemType"));
            para.Add("SODelivery", SODelivery.AsTableValuedParameter("SODeliveryType"));

            var result = await DbConnection.QueryFirstOrDefaultAsync<ReturnDto>("spSalesOrderSave", para
                , commandType: CommandType.StoredProcedure);            

            return result;
        }


    }
}