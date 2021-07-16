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
            SOHeader = await DbConnection.QueryFirstAsync<TransSalesOrderHd>("spTransSalesOrderGetCustRef", null
                , commandType: CommandType.StoredProcedure);

            return SOHeader;
        }

        public async Task<IEnumerable<SalesOrderRetDto>> GetSalesOrderAsync(string SORefNo)
        {   
            IEnumerable<SalesOrderRetDto> salOrderList;
            DynamicParameters para = new DynamicParameters();

            para.Add("SORefNo" , SORefNo);

            salOrderList = await DbConnection.QueryAsync<SalesOrderRetDto>("spTransSalesOrderGetSODetails" , para
                    , commandType: CommandType.StoredProcedure);
            
            return salOrderList;
        } 
        
        public async Task<ReturnDto> SaveSalesOrderAsync(List<SalesOrderDeliveryDto> salesOrder)
        {
            DataTable SOHeader = new DataTable();
            DataTable SOItem = new DataTable();
            DataTable SODelivery = new DataTable();
            DynamicParameters para = new DynamicParameters();

            SOHeader.Columns.Add("autoId", typeof(int));
            SOHeader.Columns.Add("UserId", typeof(int));
            SOHeader.Columns.Add("customerLocId", typeof(int));
            SOHeader.Columns.Add("customerId", typeof(int));
            SOHeader.Columns.Add("customerRef", typeof(string));
            SOHeader.Columns.Add("delDate", typeof(string));
            SOHeader.Columns.Add("orderRef", typeof(string));
            SOHeader.Columns.Add("customerUserId", typeof(int));
            SOHeader.Columns.Add("salesCategoryId", typeof(int));
            SOHeader.Columns.Add("salesAgentId", typeof(int));
            SOHeader.Columns.Add("currencyId", typeof(int));
            SOHeader.Columns.Add("countryId", typeof(int));
            SOHeader.Columns.Add("paymentTermId", typeof(int));
            SOHeader.Columns.Add("customerDiviId", typeof(int));
            SOHeader.Columns.Add("isChargeable", typeof(bool));
            SOHeader.Columns.Add("articleId", typeof(int));

            SOItem.Columns.Add("autoId", typeof(int));
            SOItem.Columns.Add("articleId", typeof(int));
            SOItem.Columns.Add("colorId", typeof(int));
            SOItem.Columns.Add("sizeId", typeof(int));
            SOItem.Columns.Add("qty", typeof(int));
            SOItem.Columns.Add("costingId", typeof(int));
            SOItem.Columns.Add("isIntendCreated", typeof(bool));
            SOItem.Columns.Add("price", typeof(decimal));

            SODelivery.Columns.Add("autoId", typeof(int));
            SODelivery.Columns.Add("deliveryDate", typeof(string));
            SODelivery.Columns.Add("deliveryRef", typeof(string));
            SODelivery.Columns.Add("soItemDtId", typeof(int));
            SODelivery.Columns.Add("qty", typeof(int));
            SODelivery.Columns.Add("customerLocId", typeof(int));

            foreach (var item in salesOrder)
            {
                if (item.SalesOrderHd != null)
                {
                    SOHeader.Rows.Add(
                        item.SalesOrderHd.AutoId
                        , item.SalesOrderHd.CreateUserId
                        , item.SalesOrderHd.CustomerLocId
                        , item.SalesOrderHd.CustomerId
                        , item.SalesOrderHd.CustomerRef.ToUpper().Trim()
                        , item.SalesOrderHd.DelDate
                        , item.SalesOrderHd.OrderRef.ToUpper().Trim()
                        , item.SalesOrderHd.CustomerUserId
                        , item.SalesOrderHd.SalesCategoryId
                        , item.SalesOrderHd.SalesAgentId
                        , item.SalesOrderHd.CusCurrencyId
                        , item.SalesOrderHd.CountryId
                        , item.SalesOrderHd.PaymentTermId
                        , item.SalesOrderHd.CustomerDivId
                        , item.SalesOrderHd.IsChargeable
                        , item.SalesOrderHd.ArticleId );
                }
                else if (item.SalesItemDt != null)
                {
                    foreach (var dt in item.SalesItemDt)
                    {
                        SOItem.Rows.Add(dt.AutoId
                        , dt.ArticleId
                        , dt.ColorId
                        , dt.SizeId
                        , dt.Qty
                        , dt.CostingId
                        , dt.IsIntendCreated
                        , dt.Price);
                    }
                }
                else
                {
                    SODelivery.Rows.Add(item.AutoId
                        , item.DeliveryDate
                        , item.DeliveryRef
                        , item.SOItemDtId
                        , item.Qty
                        , item.CustomerLocId
                    );
                }
            }           

            para.Add("SOHeader", SOHeader.AsTableValuedParameter("SOHeaderType"));
            para.Add("SOItem", SOItem.AsTableValuedParameter("SOItemType"));
            para.Add("SODelivery", SODelivery.AsTableValuedParameter("SODeliveryType"));

            var result = await DbConnection.QueryFirstOrDefaultAsync<ReturnDto>("spTransSalesOrderSave", para
                , commandType: CommandType.StoredProcedure);            

            return result;
        }

        public async Task<IEnumerable<PendingOrderItemsDto>> GetPendOrderItemsAsync(int custometId)
        {
            IEnumerable<PendingOrderItemsDto> PendItemList;
            DynamicParameters para = new DynamicParameters();

            para.Add("CustomerId" , custometId);

            PendItemList = await DbConnection.QueryAsync<PendingOrderItemsDto>("spTransJobCardGetPendingItems" , para
                    , commandType: CommandType.StoredProcedure);
            
            return PendItemList;
        }

        public async Task<IEnumerable<PendingDelivOrderDto>> GetPendDelivOrderAsync(PendingOrderItemsDto items)
        {
            IEnumerable<PendingDelivOrderDto> PendDelivList;
            DynamicParameters para = new DynamicParameters();

            para.Add("CombinId" , items.CombinId);
            para.Add("CustomerId" , items.CustomerId);
            para.Add("ArticleId" , items.ArticleId);
            para.Add("ColorId" , items.ColorId);
            para.Add("SizeId" , items.SizeId);

            PendDelivList = await DbConnection.QueryAsync<PendingDelivOrderDto>("spTransJobCardGetPendingOrders" , para
                    , commandType: CommandType.StoredProcedure);
            
            return PendDelivList;
        }

        public async Task<RefNumDto> GetRefNumberAsync(string TransType)
        {
            RefNumDto refNum;
            DynamicParameters para = new DynamicParameters();

            para.Add("TransType" , TransType); 

            refNum = await DbConnection.QuerySingleAsync<RefNumDto>("spTransGetRefNumber" , para
                    , commandType: CommandType.StoredProcedure);
            return refNum;
        }

        public async Task<IEnumerable<ReturnJobCardDto>> GetJobCardDetailsAsync(string jobNo)
        {
            IEnumerable<ReturnJobCardDto> jobCardDto;
            DynamicParameters para = new DynamicParameters();

            para.Add("JobNo" , jobNo);  

            jobCardDto = await DbConnection.QueryAsync<ReturnJobCardDto>("spTransJobCardGetSavedJobs" , para
                    , commandType: CommandType.StoredProcedure);
            return jobCardDto;
        }

        public async Task<ReturnDto> SaveJobCardAsync(List<TransJobDetail> trnsJob)
        {
            DataTable JobHeader = new DataTable();
            DataTable JobDetails = new DataTable();

            DynamicParameters para = new DynamicParameters();

            JobHeader.Columns.Add("JobNo", typeof(string));
            JobHeader.Columns.Add("CustomerId", typeof(int));                       
            JobHeader.Columns.Add("ArticleId", typeof(int));
            JobHeader.Columns.Add("ColorId", typeof(int));
            JobHeader.Columns.Add("SizeId", typeof(int));
            JobHeader.Columns.Add("CombinId", typeof(int));
            JobHeader.Columns.Add("DelivLocationId", typeof(int)); 
            JobHeader.Columns.Add("TotQty", typeof(int));
            JobHeader.Columns.Add("PlanQty", typeof(int));
            JobHeader.Columns.Add("LocationId", typeof(int));
            JobHeader.Columns.Add("UserId", typeof(int));
            JobHeader.Columns.Add("PlanDate", typeof(string));

            JobDetails.Columns.Add("JobHeaderId", typeof(int));
            JobDetails.Columns.Add("SOItemDtId", typeof(int));
            JobDetails.Columns.Add("SODelivDtId", typeof(int));
            JobDetails.Columns.Add("OrderQty", typeof(int));    
            JobDetails.Columns.Add("JobQty", typeof(int));       

            foreach (var item in trnsJob)
            {
                if (item.JobHeader != null)
                {
                    JobHeader.Rows.Add(
                        item.JobHeader.JobNo.Trim()
                        , item.JobHeader.CustomerId
                        , item.JobHeader.ArticleId
                        , item.JobHeader.ColorId
                        , item.JobHeader.SizeId
                        , item.JobHeader.CombinId
                        , item.JobHeader.DelivLocationId
                        , item.JobHeader.TotQty
                        , item.JobHeader.PlanQty
                        , item.JobHeader.LocationId
                        , item.JobHeader.CreateUserId
                        , item.JobHeader.PlanDate);
                }
                else 
                {
                    JobDetails.Rows.Add(item.JobHeaderId
                        , item.SOItemDtId
                        , item.SODelivDtId
                        , item.OrderQty
                        , item.JobQty);
                }
            }           

            para.Add("JobHeaderDT", JobHeader.AsTableValuedParameter("JobHeaderType"));
            para.Add("JobDetailDT", JobDetails.AsTableValuedParameter("JobDetailType"));

            var result = await DbConnection.QueryFirstOrDefaultAsync<ReturnDto>("spTransJobCardSave", para
                , commandType: CommandType.StoredProcedure);            

            return result;
        }
        public async Task<IEnumerable<TransJobHeader>> GetFPOPendingJobsAsync()
        {
            IEnumerable<TransJobHeader> jobList;
            //DynamicParameters para = new DynamicParameters();

            jobList = await DbConnection.QueryAsync<TransJobHeader>("spTransFtyProdOrderGetPendJobs" , null
                    , commandType: CommandType.StoredProcedure);
            return jobList;
        }
        public async Task<IEnumerable<PendJobDetailsDto>> GetFPOPendingJobDtAsync(int JobId)
        {
            IEnumerable<PendJobDetailsDto> jobList;
            DynamicParameters para = new DynamicParameters();

            para.Add("JobId" , JobId);  

            jobList = await DbConnection.QueryAsync<PendJobDetailsDto>("spTransFtyProdOrderGetPendJobDt" , para
                    , commandType: CommandType.StoredProcedure);
            return jobList;
        }
        
        public async Task<ReturnDto> SaveFPOAsync(List<FacProdOrderDto> facProdOrderDtos)
        {
            DataTable FPOHeader = new DataTable();
            DataTable FPODetails = new DataTable();

            DynamicParameters para = new DynamicParameters();

            FPOHeader.Columns.Add("AutoId", typeof(long));
            FPOHeader.Columns.Add("JobHeaderId", typeof(long));
            FPOHeader.Columns.Add("FPONo", typeof(string));
            FPOHeader.Columns.Add("StartDate", typeof(string));
            FPOHeader.Columns.Add("EndDate", typeof(string));
            // FPOHeader.Columns.Add("StatusId", typeof(byte));
            FPOHeader.Columns.Add("Remarks", typeof(string));
            FPOHeader.Columns.Add("Qty", typeof(int));
            FPOHeader.Columns.Add("UserId", typeof(int));

            FPODetails.Columns.Add("SODelivDtId" , typeof(long));
            FPODetails.Columns.Add("SOItemDtId" , typeof(long));
            FPODetails.Columns.Add("Qty" , typeof(int));

            foreach (var item in facProdOrderDtos)
            {
                if (item.FtyProductionOrderHd != null)
                {
                    FPOHeader.Rows.Add( item.FtyProductionOrderHd.AutoId
                        , item.FtyProductionOrderHd.JobHeaderId
                        , item.FtyProductionOrderHd.FPONo.Trim()
                        , item.FtyProductionOrderHd.StartDate
                        , item.FtyProductionOrderHd.EndDate
                        // , item.FtyProductionOrderHd.StatusId
                        , item.FtyProductionOrderHd.Remarks.Trim()
                        , item.FtyProductionOrderHd.Qty
                        , item.FtyProductionOrderHd.CreateUserId);
                }
                else 
                {
                    FPODetails.Rows.Add( item.SODelivDtId
                        , item.SOItemDtId
                        , item.Qty);
                }
            }           

            para.Add("FPOHeaderDT", FPOHeader.AsTableValuedParameter("FPOHeaderType"));
            para.Add("FPODetailDT", FPODetails.AsTableValuedParameter("FPODeailType"));

            var result = await DbConnection.QueryFirstOrDefaultAsync<ReturnDto>("spTransFtyProdOrderSave", para
                , commandType: CommandType.StoredProcedure);            

            return result;
        }

        public async Task<IEnumerable<ReturnFPODetailsDto>> GetFPODetailsAsync(string FPONo)
        {
            IEnumerable<ReturnFPODetailsDto> fPODetails;
            DynamicParameters para = new DynamicParameters();

            para.Add("FPONo" , FPONo);  

            fPODetails = await DbConnection.QueryAsync<ReturnFPODetailsDto>("spTransFtyProdOrderGetDetails" , para
                    , commandType: CommandType.StoredProcedure);
            return fPODetails;
        }
    
        public async Task<int> DeleteFPOAsync(DeleteFPODto fPODto)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("UserId", fPODto.UserId);
            para.Add("FPOId", fPODto.FPOId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spTransFtyProdOrderDelete", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }
    }
}