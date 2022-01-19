using System.Collections.Generic;
using System.Data;
using System.Linq;
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

        public async Task<IEnumerable<SalesItemDto>> GetPendSalesOrderItemAsync(int SOHeaderId)
        {   
            IEnumerable<SalesItemDto> salesItemList;
            DynamicParameters para = new DynamicParameters();

            para.Add("SOHeaderId" , SOHeaderId);

            salesItemList = await DbConnection.QueryAsync<SalesItemDto>("spTransSalesOrderPendItems" , para
                    , commandType: CommandType.StoredProcedure);
            
            return salesItemList;
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
            // SOHeader.Columns.Add("articleId", typeof(int));

            SOItem.Columns.Add("autoId", typeof(int));
            SOItem.Columns.Add("articleId", typeof(int));
            SOItem.Columns.Add("colorId", typeof(int));
            SOItem.Columns.Add("sizeId", typeof(int));
            SOItem.Columns.Add("qty", typeof(int));
            SOItem.Columns.Add("costingId", typeof(int));
            SOItem.Columns.Add("isIntendCreated", typeof(bool));
            SOItem.Columns.Add("price", typeof(decimal));
            SOItem.Columns.Add("brandCodeId", typeof(int));

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
                        , item.SalesOrderHd.IsChargeable);
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
                        , dt.Price
                        , dt.BrandCodeId);
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

            refNum = await DbConnection.QuerySingleAsync<RefNumDto>("spTransRefNumberGet" , para
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

        public async Task<IEnumerable<PendingOrderItemsDto>> GetJobCardListAsync(string CustomerRef)
        {
            IEnumerable<PendingOrderItemsDto> jobCardDto;
            DynamicParameters para = new DynamicParameters();

            para.Add("CustomerRef" , CustomerRef);  

            jobCardDto = await DbConnection.QueryAsync<PendingOrderItemsDto>("spTransJobCardGetList" , para
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

        public async Task<IEnumerable<FPONoListDto>> GetFPONoListAsync(string customerRef)
        {
            IEnumerable<FPONoListDto> fpoList;
            DynamicParameters para = new DynamicParameters();

            para.Add("CustomerRef" , customerRef);

            fpoList = await DbConnection.QueryAsync<FPONoListDto>("spTransFtyProdOrderGetList" , para
                    , commandType: CommandType.StoredProcedure);
            return fpoList;
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
    
        public async Task<FPPOProductionDto> GetFPPOInDetailsAsync(int FPPODId)
        {
            FPPOProductionDto fPPODetails;
            DynamicParameters para = new DynamicParameters();

            para.Add("FPPODId" , FPPODId);  

            fPPODetails = await DbConnection.QueryFirstOrDefaultAsync<FPPOProductionDto>("spTransProductionInGetDetails" , para
                    , commandType: CommandType.StoredProcedure);
            return fPPODetails;
        }

        public async Task<int> SaveFPPOInAsync(TransProductionDetails prodDetails)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("FPPODId" , prodDetails.FPPODId);
            para.Add("BalQty", prodDetails.ValidationQty);
            para.Add("InQty", prodDetails.Qty);
            para.Add("ReceiveSiteId", prodDetails.ReceiveSiteId);
            para.Add("DispatchId", prodDetails.DispatchId);            
            para.Add("UserId", prodDetails.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spTransProductionInSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<IEnumerable<TransProductionTotalDto>> GetTransProductionTotAsync()
        {
            IEnumerable<TransProductionTotalDto> totProd;
            totProd = await DbConnection.QueryAsync<TransProductionTotalDto>("spTransProductionGetTotal", null
                , commandType: CommandType.StoredProcedure);            

            return totProd;
        }

        public async Task<FPPOProductionDto> GetFPPOOutDetailsAsync(int FPPODId)
        {
            FPPOProductionDto fPPODetails;
            DynamicParameters para = new DynamicParameters();

            para.Add("FPPODId" , FPPODId);  

            fPPODetails = await DbConnection.QueryFirstOrDefaultAsync<FPPOProductionDto>("spTransProductionOutGetDetails" , para
                    , commandType: CommandType.StoredProcedure);
            return fPPODetails;
        }

        public async Task<int> SaveFPPOOutAsync(TransProductionDetails prodDetails)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("FPPODId" , prodDetails.FPPODId);
            para.Add("BalQty", prodDetails.ValidationQty);
            para.Add("OutQty", prodDetails.Qty);
            para.Add("ReceiveSiteId", prodDetails.ReceiveSiteId);
            para.Add("DispatchId", prodDetails.DispatchId);            
            para.Add("UserId", prodDetails.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spTransProductionOutSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<int> SaveFPPORejectAsync(List<TransProdDetailsDto> prodDetails)
        {
            DataTable DamageDT = new DataTable();
            DynamicParameters para = new DynamicParameters();
            
            DamageDT.Columns.Add("RejReasonId" , typeof(int));

            foreach (var item in prodDetails)
            {                
                DamageDT.Rows.Add(item.RejReasonId);
            }

            para.Add("FPPODId", prodDetails[0].FPPODId);
            para.Add("BalQty", prodDetails[0].ValidationQty);
            para.Add("RejectQty", prodDetails[0].Qty);
            para.Add("ReceiveSiteId", prodDetails[0].ReceiveSiteId);
            para.Add("DispatchId", prodDetails[0].DispatchId);
            para.Add("UserId", prodDetails[0].CreateUserId);

            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);
            para.Add("DamageDT", DamageDT.AsTableValuedParameter("DamageType"));

            var result = await DbConnection.ExecuteAsync("spTransProductionRejectSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<IEnumerable<PendDispatchDto>> GetPendDispatchDtAsync(PendDispatchDto prod)
        {
            IEnumerable<PendDispatchDto> prodDetails;
            DynamicParameters para = new DynamicParameters();

            para.Add("DispatchSiteId" , prod.DispatchSiteId); 
            para.Add("CustomerId", prod.CustomerId);

            prodDetails = await DbConnection.QueryAsync<PendDispatchDto>("spTransDispatchGetPendDetails" , para
                    , commandType: CommandType.StoredProcedure);
            return prodDetails;
        }

        public async Task<IEnumerable<DispatchNoListDto>> GetDispatchListAsync(string customerRef)
        {
            IEnumerable<DispatchNoListDto> dispatchList;
            DynamicParameters para = new DynamicParameters();

            para.Add("CustomerRef" , customerRef);

            dispatchList = await DbConnection.QueryAsync<DispatchNoListDto>("spTransDispatchGetList" , para
                    , commandType: CommandType.StoredProcedure);
            return dispatchList;
        }

        public async Task<ReturnDto> SaveDispatchedDtAsync(List<TransDispatchDetails> dispatch)
        {
            DataTable DispatchDT = new DataTable();
            DynamicParameters para = new DynamicParameters();
            
            DispatchDT.Columns.Add("SOItemId" , typeof(long));
            DispatchDT.Columns.Add("SODelivDtId" , typeof(long));
            DispatchDT.Columns.Add("ProducedQty" , typeof(int));
            DispatchDT.Columns.Add("DispatchedQty" , typeof(int));
            DispatchDT.Columns.Add("BalDispatchQty" , typeof(int));

            foreach (var item in dispatch)
            {  
                if(item.DispatchHeader != null) {              
                    para.Add("DispatchNo", item.DispatchHeader.DispatchNo);
                    para.Add("CustomerId", item.DispatchHeader.CustomerId);
                    para.Add("CusLocationId", item.DispatchHeader.CusLocationId);
                    para.Add("DispatchSiteId", item.DispatchHeader.DispatchSiteId);
                    para.Add("Reason", item.DispatchHeader.Reason);
                    para.Add("VehicleNo", item.DispatchHeader.VehicleNo);
                    para.Add("LoactionId", item.DispatchHeader.LocationId);
                    para.Add("UserId", item.DispatchHeader.CreateUserId);
                } else {
                    DispatchDT.Rows.Add(item.SOItemId,
                        item.SODelivDtId,
                        item.ProducedQty,
                        item.DispatchedQty,
                        item.BalDispatchQty);
                }
            }           

            // para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);
            para.Add("DispatchDT", DispatchDT.AsTableValuedParameter("DispatchDetType"));

            var result = await DbConnection.QueryFirstOrDefaultAsync<ReturnDto>("spTransDispatchSave", para
                , commandType: CommandType.StoredProcedure);            

            return result;
        }       

        public async Task<IEnumerable<DispatchedDetDto>> GetDispatchDetails(string dispatchNo)
        {
            IEnumerable<DispatchedDetDto> dispDetails;
            DynamicParameters para = new DynamicParameters();

            para.Add("DispatchNo" , dispatchNo);  

            dispDetails = await DbConnection.QueryAsync<DispatchedDetDto>("spTransDispatchGetDetails" , para
                    , commandType: CommandType.StoredProcedure);
            return dispDetails;
        }

        public async Task<int> CancelDispatchDtAsync(TransDispatchHeader dispHd)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("DispatchHdId" , dispHd.AutoId);  
            para.Add("UserId" , dispHd.CancelUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);

            var result = await DbConnection.ExecuteAsync("spTransDispatchCancel" , para
                    , commandType: CommandType.StoredProcedure);
                    
            return para.Get<int>("Result");
        }

        public async Task<ReturnDto> SaveCostingAsync(List<SavedCostingDto> costDt)
        {
            DataTable CostHeaderDT = new DataTable();
            DataTable CostDetailDT = new DataTable();
            DataTable CostSpeInsDT = new DataTable();

            DynamicParameters para = new DynamicParameters();

            CostHeaderDT.Columns.Add("CostHeaderId", typeof(long));
            CostHeaderDT.Columns.Add("UserId", typeof(int));
            CostHeaderDT.Columns.Add("RefNo", typeof(string));
            CostHeaderDT.Columns.Add("VersionControl", typeof(int));
            CostHeaderDT.Columns.Add("CustomerId", typeof(int));
            CostHeaderDT.Columns.Add("ArticleId", typeof(long));
            CostHeaderDT.Columns.Add("ColorId", typeof(int));
            CostHeaderDT.Columns.Add("SizeId", typeof(int));
            CostHeaderDT.Columns.Add("Combination", typeof(string));
            CostHeaderDT.Columns.Add("NoOfUps", typeof(int));
            CostHeaderDT.Columns.Add("BrandCodeId", typeof(int));
            CostHeaderDT.Columns.Add("PDHeaderId", typeof(int));
            CostHeaderDT.Columns.Add("BoardLength", typeof(decimal));
            CostHeaderDT.Columns.Add("BoardWidth", typeof(decimal));
            CostHeaderDT.Columns.Add("SQM", typeof(decimal));
            CostHeaderDT.Columns.Add("ReelSize", typeof(int));
            CostHeaderDT.Columns.Add("ActualReal", typeof(int));
            CostHeaderDT.Columns.Add("TrimWaste", typeof(decimal));
            CostHeaderDT.Columns.Add("TotNetWeight", typeof(decimal));
            CostHeaderDT.Columns.Add("TotGrossWeight", typeof(decimal));
            CostHeaderDT.Columns.Add("Tollerence", typeof(int));            
            CostHeaderDT.Columns.Add("TotalBoxCost", typeof(decimal));
            CostHeaderDT.Columns.Add("Markup", typeof(decimal));
            CostHeaderDT.Columns.Add("Commission", typeof(decimal));
            CostHeaderDT.Columns.Add("MOQCost", typeof(decimal));
            CostHeaderDT.Columns.Add("SellingPrice", typeof(decimal));
            CostHeaderDT.Columns.Add("TotMOQCost", typeof(decimal));
            CostHeaderDT.Columns.Add("ProfitMarkup", typeof(decimal));
            CostHeaderDT.Columns.Add("CommSelPrice", typeof(decimal));

            CostDetailDT.Columns.Add("CostGroupId", typeof(byte));
            CostDetailDT.Columns.Add("GroupOrder", typeof(int));
            CostDetailDT.Columns.Add("ArticleId", typeof(long));
            CostDetailDT.Columns.Add("ColorId", typeof(int));
            CostDetailDT.Columns.Add("SizeId", typeof(int));
            CostDetailDT.Columns.Add("UnitId", typeof(int));
            CostDetailDT.Columns.Add("GSM", typeof(int));
            CostDetailDT.Columns.Add("FluteId", typeof(int));
            CostDetailDT.Columns.Add("Cost", typeof(decimal));
            CostDetailDT.Columns.Add("Base", typeof(string));
            CostDetailDT.Columns.Add("BaseValue", typeof(decimal));
            CostDetailDT.Columns.Add("Westage", typeof(decimal));
            CostDetailDT.Columns.Add("ArtiUOMConvId", typeof(int));
            CostDetailDT.Columns.Add("NetCons", typeof(decimal));
            CostDetailDT.Columns.Add("GrossCons", typeof(decimal));
            CostDetailDT.Columns.Add("CostPcs", typeof(decimal));

            CostSpeInsDT.Columns.Add("SpeInsId", typeof(int));
            CostSpeInsDT.Columns.Add("Value", typeof(string));

            foreach (var item in costDt)
            {
                if (item.CostingHeader != null)
                {
                    CostHeaderDT.Rows.Add(
                        item.CostingHeader.AutoId,
                        item.CostingHeader.CreateUserId,
                        item.CostingHeader.RefNo,
                        item.CostingHeader.VersionControl,
                        item.CostingHeader.CustomerId,
                        item.CostingHeader.ArticleId,
                        item.CostingHeader.ColorId,
                        item.CostingHeader.SizeId,
                        item.CostingHeader.Combination,
                        item.CostingHeader.NoOfUps,
                        item.CostingHeader.BrandCodeId,
                        item.CostingHeader.PDHeaderId,
                        item.CostingHeader.BoardLength,
                        item.CostingHeader.BoardWidth,
                        item.CostingHeader.SQM,
                        item.CostingHeader.ReelSize,
                        item.CostingHeader.ActualReal,
                        item.CostingHeader.TrimWaste,
                        item.CostingHeader.TotNetWeight,
                        item.CostingHeader.TotGrossWeight,
                        item.CostingHeader.Tollerence,
                        item.CostingHeader.TotalBoxCost,
                        item.CostingHeader.Markup,
                        item.CostingHeader.Commission,
                        item.CostingHeader.MOQCost,
                        item.CostingHeader.SellingPrice,
                         item.CostingHeader.TotMOQCost,
                        item.CostingHeader.ProfitMarkup,
                        item.CostingHeader.CommSelPrice
                    );
                }
                else if (item.CostingDetails != null)
                {
                    foreach (var det in item.CostingDetails)
                    {
                        CostDetailDT.Rows.Add(det.CostGroupId,
                            det.GroupOrder,
                            det.ArticleId,
                            det.ColorId,
                            det.SizeId,
                            det.UnitId,
                            det.GSM,
                            det.FluteId,
                            det.Cost,
                            det.Base,
                            det.BaseValue,
                            det.Wastage,
                            det.ArtiUOMConvId,
                            det.NetCon,
                            det.GrossCon,
                            det.CostPcs);
                    }
                }
                else if (item.CostingSpecial != null)
                {
                    foreach (var spe in item.CostingSpecial)
                    {
                        CostSpeInsDT.Rows.Add(
                            spe.SpeInstId,
                            spe.Value
                        );
                    }
                }
            }
           
            para.Add("CostHeaderDT", CostHeaderDT.AsTableValuedParameter("CostHeaderType"));
            para.Add("CostDetailDT", CostDetailDT.AsTableValuedParameter("CostDetailsType"));
            para.Add("CostSpecialInsDT", CostSpeInsDT.AsTableValuedParameter("CostSpecialInsType"));

            var result = await DbConnection.QueryFirstOrDefaultAsync<ReturnDto>("spTransCostingSave", para
                , commandType: CommandType.StoredProcedure);

            return result;
        }

        public async Task<CostingSheetDto> GetCostingDetailsAsync(long costHearderId)
        {
            // IEnumerable<CostingDetailsDto> costDetails;
            // IEnumerable<CostingSpecialDto> costingSpecials;
            CostingSheetDto costSheet = new CostingSheetDto();
            DynamicParameters para = new DynamicParameters();

            para.Add("CostHeaderId", costHearderId);

            // using (var multi = DbConnection.QueryMultiple(sql, new {InvoiceID = 1}))
            using (var multi = await DbConnection.QueryMultipleAsync("spTransCostingGetDetails", para, commandType: CommandType.StoredProcedure))
            {
                costSheet.costHeader = multi.Read<CostingHeaderDto>();
                costSheet.costDetails = multi.Read<CostingDetailsDto>();
                costSheet.costSpecials = multi.Read<CostingSpecialDto>();
            }
            return costSheet;
        }

        public async Task<IEnumerable<CostHeaderDto>> GetCostHeaderAsync(CostHeaderDto costHead)
        {   
            IEnumerable<CostHeaderDto> costHeaderList;
            DynamicParameters para = new DynamicParameters();

            para.Add("ArticleColorSizeId" , costHead.ArtColorSizeId);
            para.Add("BrandCodeId" , costHead.BrandCodeId);

            costHeaderList = await DbConnection.QueryAsync<CostHeaderDto>("spTransCostingGetHeader" , para
                    , commandType: CommandType.StoredProcedure);
            
            return costHeaderList;
        }

        public async Task<IEnumerable<CostHeaderDto>> GetCostHeaderListAsync(long CustomerId)
        {   
            IEnumerable<CostHeaderDto> costHeaderList;
            DynamicParameters para = new DynamicParameters();

            para.Add("CustomerId" , CustomerId);

            costHeaderList = await DbConnection.QueryAsync<CostHeaderDto>("spTransCostingGetHdList" , para
                    , commandType: CommandType.StoredProcedure);
            
            return costHeaderList;
        }

        public async Task<int> AttachCostSheetSOAsync(TransSalesOrderItemDt soItemDt)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("SalesItemId" , soItemDt.AutoId); 
            para.Add("CostId" , soItemDt.CostingId);  
            para.Add("UserId" , soItemDt.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);

            var result = await DbConnection.ExecuteAsync("spTransSalesOrderAttachCS" , para
                    , commandType: CommandType.StoredProcedure);
                    
            return para.Get<int>("Result");
        } 

        public async Task<int> RemoveCostSheetSOAsync(TransSalesOrderItemDt soItemDt)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("SalesItemId" , soItemDt.AutoId);
            para.Add("UserId" , soItemDt.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);

            var result = await DbConnection.ExecuteAsync("spTransSalesOrderRemoveCS" , para
                    , commandType: CommandType.StoredProcedure);
                    
            return para.Get<int>("Result");
        } 

        public async Task<IEnumerable<ApprovalUsersDto>> GetApprovalRouteDetailsAsync(ApprovalUsersDto appUser)
        {   
            IEnumerable<ApprovalUsersDto> approveList;
            DynamicParameters para = new DynamicParameters();

            para.Add("UserId" , appUser.UserId);
            para.Add("Module" , appUser.Module);

            approveList = await DbConnection.QueryAsync<ApprovalUsersDto>("spTransApprovalRoutingDetails" , para
                    , commandType: CommandType.StoredProcedure);
            
            return approveList;
        }

        public async Task<int> SaveApproveCenterAsync(TransApprovalCenter appCenter)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , appCenter.AutoId);
            para.Add("Module" , appCenter.ModuleName);
            para.Add("AssignUser" , appCenter.AssigneUser);
            para.Add("RequestedBy" , appCenter.RequestedBy);
            para.Add("RefId" , appCenter.RefId);
            para.Add("RefNo" , appCenter.RefNo);
            para.Add("Remarks" , appCenter.Remarks);
            para.Add("Status" , appCenter.Status);
            para.Add("Details" , appCenter.Details);
            para.Add("IsFinal" ,  appCenter.IsFinal);
            para.Add("UserId" , appCenter.RequestedBy);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);

            var result = await DbConnection.ExecuteAsync("spTransApproveCenterSave" , para
                    , commandType: CommandType.StoredProcedure);
                    
            return para.Get<int>("Result");
        } 

        public async Task<IEnumerable<ApproveCenterDto>> GetApproveCenterDetailsAsync(int userId)
        {   
            IEnumerable<ApproveCenterDto> approveList;
            DynamicParameters para = new DynamicParameters();

            para.Add("UserId" , userId);

            approveList = await DbConnection.QueryAsync<ApproveCenterDto>("spTransApproveCenterGetDetails" , para
                    , commandType: CommandType.StoredProcedure);
            
            return approveList;
        }
       

    }
}