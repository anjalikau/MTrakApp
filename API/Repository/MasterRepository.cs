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
    public class MasterRepository : DbConnCartonRepositoryBase , IMasterRepository
    {
         private readonly IApplicationCartonDbContext _context;
        //private readonly DataConnection _connection;

        public MasterRepository(IApplicationCartonDbContext context, IDbConnectionFactory dbConnectionFactory) : base(dbConnectionFactory)
        {
             _context = context;
        }

        #region Menu List
        public async Task<IEnumerable<MenuJoinList>> GetMenuListAsync()
        {
            string StoredProc = "exec spMenuListGet";
            return await _context.MenuJoinList.FromSqlRaw(StoredProc)
                                                   .ToListAsync();
        }

        [System.Obsolete]
        public async Task<int> SaveMenuListAsync(MenuListDto menuListDto)
        {            
            var AutoIdx = new SqlParameter("@mId", menuListDto.AutoIdx);
            var Name = new SqlParameter("@mName",menuListDto.MenuName.Trim());
            var Description = new SqlParameter("@mDescription",menuListDto.MenuDescription.Trim());
            var Type = new SqlParameter("@mType", menuListDto.mType.Trim());
            var GroupName = new SqlParameter("@GroupName",menuListDto.GroupName.Trim());            
            var AgentLevel = new SqlParameter("@AgentLevel",menuListDto.AgentLevelId);
            var AgentId = new SqlParameter("@AgentId",menuListDto.AgentId);
            var Result = new SqlParameter("@Result", SqlDbType.Int);

            Result.Direction = ParameterDirection.Output;
            // Description.SqlDbType = SqlDbType.VarChar;
       
            await _context.Database
            .ExecuteSqlCommandAsync(@"exec spMenuListSave @mId,@mName,@mDescription,@mType
                    ,@GroupName,@AgentId,@AgentLevel,@Result out" 
                ,AutoIdx ,Name ,Description ,Type ,GroupName ,AgentId ,AgentLevel,Result );

            return int.Parse(Result.Value.ToString());               
        
        }


        #endregion


        #region User Menu List            
        
        public async Task<IEnumerable<PermitMenuDto>> GetAuthMenuListAsync(UserDto userDto)
        {
            IEnumerable<PermitMenuDto> menuList = Enumerable.Empty<PermitMenuDto>();
            DynamicParameters para = new DynamicParameters();

            para.Add("AgentId" , userDto.UserId);

            if (userDto.ModuleId == 1) {
               return menuList = await DbConnection.QueryAsync<PermitMenuDto>("spMenuListAuthorize" , para
                    , commandType: CommandType.StoredProcedure);
            }
            
            return menuList;

            // IEnumerable<MenuListDto> menuList = Enumerable.Empty<MenuListDto>();
            // var AgentId = new SqlParameter("AgentId", userDto.UserId);

            // if (userDto.ModuleId == 1) {
            //     string StoredProc = "exec spMenuListAuthorize @AgentId";
            //     return await _context.Database.(StoredProc , AgentId).ToListAsync();
            // }
            // return menuList;
        }        

        public async Task<IEnumerable<UserMenuList>> GetUserMenuList(int userId)
        {
            var AgentId = new SqlParameter("AgentId", userId);
            //string StoredProc = "exec spMenuUserGetList";
            return await _context.UserMenuList
                .FromSqlRaw("exec spMenuUserGetList @AgentId" , AgentId).ToListAsync();
        }

        [System.Obsolete]
        public async Task<int> SaveUserMenuListAsync(List<MenuUserDto> menuList)
        {
            DataTable MenuUserDT = new DataTable();

            MenuUserDT.Columns.Add("AgentId",typeof(int));
            MenuUserDT.Columns.Add("MenuId",typeof(int));
            MenuUserDT.Columns.Add("CreUserID",typeof(int));

            foreach (var item in menuList)
            {
                MenuUserDT.Rows.Add( item.AgentId
                        , item.MenuId
                        , item.CreUserID);
            }         

            var MenuUserDetails = new SqlParameter("@MenuUserDT", SqlDbType.Structured); 
            MenuUserDetails.Value = MenuUserDT;
            MenuUserDetails.TypeName = "[dbo].[MenuUserType]";

            var Result = new SqlParameter("@Result", SqlDbType.Int);
            Result.Direction = ParameterDirection.Output;            

             await _context.Database
            .ExecuteSqlCommandAsync(@"exec spMenuUserSave @MenuUserDT,@Result out" 
                ,MenuUserDetails,Result );

            return int.Parse(Result.Value.ToString());      

        }

        [System.Obsolete]
        public async Task<int> DeleteUserMenuListAsync(List<MenuUserDto> menuList)
        {
            DataTable MenuUserDT = new DataTable();

            MenuUserDT.Columns.Add("AgentId",typeof(int));
            MenuUserDT.Columns.Add("MenuId",typeof(int));
            MenuUserDT.Columns.Add("CreUserID",typeof(int));

            foreach (var item in menuList)
            {
                MenuUserDT.Rows.Add( item.AgentId
                        , item.MenuId
                        , item.CreUserID);
            }

            var MenuUserDetails = new SqlParameter("@MenuUserDT", SqlDbType.Structured); 
            MenuUserDetails.Value = MenuUserDT;
            MenuUserDetails.TypeName = "[dbo].[MenuUserType]";

            var Result = new SqlParameter("@Result", SqlDbType.Int);
            Result.Direction = ParameterDirection.Output;            

             await _context.Database
            .ExecuteSqlCommandAsync(@"exec spMenuUserDelete @MenuUserDT,@Result out" 
                ,MenuUserDetails,Result );

            return int.Parse(Result.Value.ToString());      

        }

        #endregion


        #region Location            
       
        public async Task<MstrUserLocation> GetDefaultLocForUser(int userId)
        {
            return await _context.MstrUserLocation.Where(u => u.UserId == userId)
                .FirstOrDefaultAsync(p => p.IsDefault);
        }       
      
        public async Task<int> SetDefaultLocationAsync(MstrUserLocation userLoc)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("UserId", userLoc.UserId);
            para.Add("UserLocId", userLoc.AutoId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrUserLocSetDefault", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        #endregion
        

        #region Color            
        
        public async Task<int> SaveColorCardAsync(MstrColorCard mstrccard)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , mstrccard.AutoId);
            para.Add("Name", mstrccard.Name.Trim());
            para.Add("UserId", mstrccard.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrColorCardSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<int> SaveColorAsync(MstrColor mstrColor)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , mstrColor.AutoId);
            para.Add("Code", mstrColor.Code.ToUpper().Trim());
            para.Add("Name", mstrColor.Name.ToUpper().Trim());
            para.Add("LinkColor", mstrColor.LinkColorCard);
            para.Add("UserId", mstrColor.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrColorSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<int> DeactiveColorCardAsync(MstrColorCard mstrccard)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("ColorCardId" , mstrccard.AutoId);
            para.Add("IsActive", mstrccard.IsActive);
            para.Add("UserId", mstrccard.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrColorCardDeactive", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        #endregion


        #region Size
                    
        public async Task<int> SaveSizeCardAsync(MstrSizeCard mstrscard)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , mstrscard.AutoId);
            para.Add("Name", mstrscard.Name.Trim());
            para.Add("UserId", mstrscard.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrSizeCardSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<int> SaveSizeAsync(MstrSize mstrSize)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , mstrSize.AutoId);
            para.Add("Code", mstrSize.Code.ToUpper().Trim());
            para.Add("Name", mstrSize.Name.ToUpper().Trim());
            para.Add("LinkSize", mstrSize.LinkSizeCard);
            para.Add("UserId", mstrSize.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrSizeSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<int> DeactiveSizeCardAsync(MstrSizeCard mstrscard)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("SizeCardId" , mstrscard.AutoId);
            para.Add("IsActive" , mstrscard.IsActive);
            para.Add("UserId", mstrscard.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrSizeCardDeactive", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        #endregion
       

        #region Article
            
        public async Task<IEnumerable<MstrColor>> GetArticlColorAsync(int articleId)
        {   
            IEnumerable<MstrColor> coloList;
            DynamicParameters para = new DynamicParameters();

            para.Add("ArticleId" , articleId);
            //para.Add("LocationId", articleDto.LocationId);

            coloList = await DbConnection.QueryAsync<MstrColor>("spMstrArticleColorGet" , para
                    , commandType: CommandType.StoredProcedure);
            
            return coloList;
        } 

        public async Task<IEnumerable<MstrSize>> GetArticlSizeAsync(int articleId)
        {   
            IEnumerable<MstrSize> sizeList;
            DynamicParameters para = new DynamicParameters();

            para.Add("ArticleId" , articleId);
            //para.Add("LocationId", articleDto.LocationId);

            sizeList = await DbConnection.QueryAsync<MstrSize>("spMstrArticleSizeGet" , para
                    , commandType: CommandType.StoredProcedure);
            
            return sizeList;
        } 

        public async Task<ArticleReturnDto> SaveArticleAsync(MstrArticle article)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , article.AutoId);
            para.Add("StockCode", article.StockCode.Trim());
            para.Add("ArticleName", article.ArticleName.Trim());
            para.Add("Description1", article.Description1.Trim());
            para.Add("Description2", article.Description2.Trim());
            para.Add("CategoryId", article.CategoryId);
            para.Add("ProTypeId", article.ProTypeId);
            para.Add("ProGroupId", article.ProGroupId);
            para.Add("ItemType", article.ItemType);
            para.Add("UnitId", article.UnitId);
            para.Add("MeasurementId", article.MeasurementId);
            para.Add("BoardLength", article.BoardLength);
            para.Add("BoardWidth", article.BoardWidth);
            para.Add("RollWidth", article.RollWidth);
            para.Add("ColorCardId", article.ColorCardId);
            para.Add("SizeCardId", article.SizeCardId);
            para.Add("SalesPrice", article.SalesPrice);
            para.Add("QtyInStock", article.QtyInStock);
            para.Add("AvgCostPrice", article.AvgCostPrice);
            para.Add("LastCostPrice", article.LastCostPrice);
            para.Add("MaxCostPrice", article.MaxCostPrice);
            para.Add("Width", article.Width);
            para.Add("Height", article.Height);
            para.Add("Length", article.Length);
            para.Add("PODate", article.PODate);
            para.Add("UserId", article.CreateUserId);
            // para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.QueryFirstOrDefaultAsync<ArticleReturnDto>("spMstrArticleSave", para
                , commandType: CommandType.StoredProcedure);            

            return result;
            // var result = await DbConnection.ExecuteAsync("spMstrArticleSave", para
            //     , commandType: CommandType.StoredProcedure);            

            // return para.Get<int>("Result");
        }

        public async Task<IEnumerable<ArticleDetailDto>> GetArtileDetailsAsync(ArticleSerchDto article) 
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("CategoryId", article.CategoryId);
            para.Add("ProTypeId", article.ProTypeId);
            para.Add("ProGroupId", article.ProGroupId);

            var result = await DbConnection.QueryAsync<ArticleDetailDto>("spMstrArticleGetDetails", para
                , commandType: CommandType.StoredProcedure);           

            return result;
        }

        #endregion Article


        #region Unit 
                    
        public async Task<int> SaveUnitAsync(MstrUnits mstrUnits)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , mstrUnits.AutoId);
            para.Add("Code", mstrUnits.Code.ToUpper().Trim());
            para.Add("Name", mstrUnits.Name.Trim());
            para.Add("UserId", mstrUnits.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrUnitsSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }
        
        #endregion Unit


        #region Process
                   
        public async Task<int> SaveProcessAsync(MstrProcess masterProcess)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , masterProcess.AutoId);
            para.Add("Process", masterProcess.Process.Trim());
            para.Add("UserId", masterProcess.CreateUserId);
            para.Add("LocationId", masterProcess.LocationId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrProcessSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        #endregion Process


        #region StoreSite
                  
        public async Task<int> SaveStoresiteAsync(MstrStoreSite masterStoreSite)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , masterStoreSite.AutoId);
            para.Add("Code", masterStoreSite.SiteCode.ToUpper().Trim());
            para.Add("Name", masterStoreSite.SiteName.Trim());
            para.Add("UserId", masterStoreSite.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrStoresiteSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        #endregion StoreSite


        #region Customer Header
            
        public async Task<int> DeactiveCustomerHdAsync(MstrCustomerHeader mstrCustomerHeader)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoID" , mstrCustomerHeader.AutoId);
            para.Add("bActive", mstrCustomerHeader.bActive);
            para.Add("UserId", mstrCustomerHeader.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrCustomerHeaderDeactive", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }
        
        // public async Task<int> DeactiveCusLocAsync(MstrCustomerLocation customerLocation)
        // {
        //     DynamicParameters para = new DynamicParameters();

        //     para.Add("AutoId" , customerLocation.AutoId);
        //     para.Add("bActive", customerLocation.bActive);
        //     para.Add("UserId", customerLocation.CreateUserId);
        //     para.Add("Name", customerLocation.Name.Trim());
        //     para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

        //     var result = await DbConnection.ExecuteAsync("spMstrCustomerLocationDeactive", para
        //         , commandType: CommandType.StoredProcedure);            

        //     return para.Get<int>("Result");
        // }

        public async Task<IEnumerable<ReturnCustomerHdDto>> GetCustomerHdAllAsync(int LocId)
        {
            IEnumerable<ReturnCustomerHdDto> customerList;
            DynamicParameters para = new DynamicParameters();

            para.Add("LocationId" , LocId);

            customerList = await DbConnection.QueryAsync<ReturnCustomerHdDto>("spMstrCustomerHeaderGetDetails" , para
                    , commandType: CommandType.StoredProcedure);
            
            return customerList;
        } 
               
        public async Task<int> SaveCustomerHdAsync(MstrCustomerHeader mstrCustomerHeader)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , mstrCustomerHeader.AutoId);
            para.Add("Name", mstrCustomerHeader.Name.Trim());
            para.Add("Address", mstrCustomerHeader.Address.Trim());
            para.Add("Email", mstrCustomerHeader.Email.Trim());
            para.Add("Tel", mstrCustomerHeader.Tel.Trim());
            para.Add("LocationId", mstrCustomerHeader.LocationId);
            para.Add("ShortCode" , mstrCustomerHeader.ShortCode.ToUpper().Trim());
            para.Add("CustomerID", mstrCustomerHeader.CustomerID);
            para.Add("City", mstrCustomerHeader.City.Trim());
            para.Add("CountryId", mstrCustomerHeader.CountryId);
            para.Add("CurrencyId", mstrCustomerHeader.CurrencyId);
            para.Add("VATNo", mstrCustomerHeader.VATNo.Trim());
            para.Add("TaxNo", mstrCustomerHeader.TaxNo.Trim());
            para.Add("TinNo", mstrCustomerHeader.TinNo.Trim());
            para.Add("ZipPostalCode", mstrCustomerHeader.ZipPostalCode.Trim());
            para.Add("CreditDays", mstrCustomerHeader.CreditDays);
            para.Add("UserId", mstrCustomerHeader.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrCustomerHeaderSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        #endregion Customer Header


        #region Customer Location
              
        public async Task<int> SaveCustomerLocAsync(MstrCustomerLocation customerLocation)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , customerLocation.AutoId);
            para.Add("Name", customerLocation.Name.Trim());
            para.Add("ShortCode", customerLocation.ShortCode.Trim().ToUpper());
            para.Add("Address", customerLocation.Address.Trim());
            para.Add("Email", customerLocation.Email.Trim());
            para.Add("Tel", customerLocation.Tel.Trim());
            para.Add("CustomerId", customerLocation.CustomerId);
            para.Add("UserId", customerLocation.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrCustomerLocationSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        #endregion Customer Location

        #region Customer User 

        public async Task<int> SaveCustomerUserAsync(MstrCustomerUsers customerUser)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , customerUser.AutoId);
            para.Add("Title", customerUser.Title);
            para.Add("FirstName", customerUser.FirstName.Trim());
            para.Add("LastName", customerUser.LastName.Trim());
            para.Add("Email", customerUser.Email.Trim());
            para.Add("Designation", customerUser.Designation.Trim());
            para.Add("CustomerId", customerUser.CustomerId);
            para.Add("UserId", customerUser.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrCustomerUserSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        #endregion Customer User

        #region Customer Address   

        public async Task<IEnumerable<ReturnCustomerAddDto>> GetCustomerAddressAsync(int customerId)
        {
            IEnumerable<ReturnCustomerAddDto> customeraddList;
            DynamicParameters para = new DynamicParameters();

            para.Add("CustomerId" , customerId);

            customeraddList = await DbConnection.QueryAsync<ReturnCustomerAddDto>("spMstrCustomerAddressGetDt" , para
                    , commandType: CommandType.StoredProcedure);
            
            return customeraddList;
        } 

        public async Task<int> SaveCusAddressAsync(MstrCustomerAddressList cusAddressList)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , cusAddressList.AutoId);
            para.Add("CustomerLocId", cusAddressList.CusLocationId);
            para.Add("AddressTypeId ", cusAddressList.AddressTypeId);
            para.Add("CustomerID", cusAddressList.CustomerId);
            para.Add("City", cusAddressList.City.Trim());
            para.Add("CountryId", cusAddressList.CountryId);
            para.Add("CurrencyId", cusAddressList.CurrencyId);
            para.Add("VATNo", cusAddressList.VatNo.Trim());
            para.Add("TaxNo", cusAddressList.TaxNo.Trim());
            para.Add("TinNo", cusAddressList.TinNo.Trim());
            para.Add("ZipPostalCode", cusAddressList.ZipPostalCode.Trim());
            para.Add("AddressTo", cusAddressList.AddressTo.Trim());
            para.Add("Address", cusAddressList.Address.Trim());
            para.Add("Email", cusAddressList.Email.Trim());
            para.Add("Tel", cusAddressList.Tel.Trim()); 
            para.Add("UserId", cusAddressList.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrCustomerAddressSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<int> DeactiveCustomerUserAsync(MstrCustomerUsers cusUser)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("CusUserId" , cusUser.AutoId);
            para.Add("IsActive", cusUser.IsActive);
            para.Add("UserId", cusUser.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrCustomerUserDeactive", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

         #endregion Customer Address

        #region Customer Division
            
        public async Task<int> SaveCustomerDivisionAsync(MstrCustomerDivision cusDivision)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , cusDivision.AutoId);
            para.Add("Details", cusDivision.Details.Trim());
            para.Add("CustomerId", cusDivision.CustomerId);
            para.Add("UserId", cusDivision.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrCustomerDivisionSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        #endregion Customer Division

        #region Customer Brand

        public async Task<int> SaveCustomerBrandAsync(MstrCustomerBrand customerBrand)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , customerBrand.AutoId);
            para.Add("BrandId", customerBrand.BrandId);
            para.Add("CustomerId", customerBrand.CustomerId);
            para.Add("UserId", customerBrand.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrCustomerBrandSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<int> DeleteCusBrandAsync(MstrCustomerBrand customerBrand)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , customerBrand.AutoId);
            para.Add("BrandId", customerBrand.BrandId);
            para.Add("UserId", customerBrand.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrCustomerBrandDelete", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }  

        #endregion Customer Brand

        #region Customer Currency
            
        public async Task<int> SaveCustomerCurrencyAsync(MstrCustomerCurrency customercurrency)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , customercurrency.AutoId);
            para.Add("CurrencyId", customercurrency.CurrencyId);
            para.Add("CustomerId", customercurrency.CustomerId);
            para.Add("UserId", customercurrency.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrCustomerCurrencySave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<int> DeleteCusCurrencyAsync(MstrCustomerCurrency customerCurrency)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , customerCurrency.AutoId);
            para.Add("CurrencyId", customerCurrency.CurrencyId);
            para.Add("UserId", customerCurrency.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrCustomerCurrencyDelete", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        #endregion Customer Currency

        
        #region Material Type
            
        public async Task<int> SaveMaterialTypeAsync(MstrMaterialType MstrMaterialType)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , MstrMaterialType.AutoId);
            para.Add("Code", MstrMaterialType.Code.ToUpper().Trim());
            para.Add("Name", MstrMaterialType.Name.Trim());
            para.Add("UserId", MstrMaterialType.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrMeterialTypeSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        #endregion Material Type
        

        #region Category

        public async Task<int> SaveCategoryAsync(MstrCategory MstrCategory)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , MstrCategory.AutoId);
            para.Add("Code", MstrCategory.Code.ToUpper().Trim());
            para.Add("Name", MstrCategory.Name.Trim());
            para.Add("UserId", MstrCategory.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrCategorySave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }
            
        #endregion Category
        
        
        #region Brand

        public async Task<int> SaveBrandAsync(MstrBrand MstrBrand)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , MstrBrand.AutoId);
            para.Add("Name", MstrBrand.Name.Trim());
            para.Add("UserId", MstrBrand.CreateUserId);
            para.Add("LocationId", MstrBrand.LocationId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrBrandSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<int> SaveBrandCodeAsync(MstrBrandCode MstrBrandCode)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , MstrBrandCode.AutoId);
            para.Add("Name", MstrBrandCode.Name.Trim());
            para.Add("UserId", MstrBrandCode.CreateUserId);
            para.Add("BrandId", MstrBrandCode.BrandId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrBrandCodeSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

            
        #endregion Brand

        #region Prod Definition

        public async Task<ReturnDto> SaveProdDefinitionAsync(ProdDefinitionDto prodDefinitionDto)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("PdHeaderId" , prodDefinitionDto.PDHeaderId);
            para.Add("ProcessId", prodDefinitionDto.ProcessId);
            para.Add("Name", prodDefinitionDto.PDName.Trim().ToUpper());
            para.Add("ReceiveSiteId", prodDefinitionDto.ReceiveSiteId);
            para.Add("DispatchSiteId", prodDefinitionDto.DispatchSiteId);
            para.Add("UserId", prodDefinitionDto.CreateUserId);
            //para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.QueryFirstOrDefaultAsync<ReturnDto>("spMstrProductDefinitionSave", para
                , commandType: CommandType.StoredProcedure);            

            return result;
        }

        public async Task<int> DeleteProdDefinitionAsync(ProdDefinitionDto prodDefDto)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("PdDetailId" , prodDefDto.AutoId);
            para.Add("PdHeaderId" , prodDefDto.PDHeaderId);
            para.Add("UserId", prodDefDto.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrProductDefinitionDelete", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<IEnumerable<ProdDefinitionDto>> GetProdDefinitionAsync(byte ProdHeaderId)
        {
            IEnumerable<ProdDefinitionDto> podDefiList;
            DynamicParameters para = new DynamicParameters();

            para.Add("ProdHeaderId" , ProdHeaderId);
            podDefiList = await DbConnection.QueryAsync<ProdDefinitionDto>("spMstrProductDefinationGet" , para
                    , commandType: CommandType.StoredProcedure);
            
            return podDefiList;
        }
            
        #endregion Prod Definition
        
        #region Product Group

        public async Task<int> SaveProductGroupAsync(MstrProductGroup MstrProductGroup)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , MstrProductGroup.AutoId);
            // para.Add("ProdTypeId", MstrProductGroup.ProdTypeId);
            para.Add("ProdGroupName", MstrProductGroup.ProdGroupName.Trim());
            para.Add("ProdGroupCode", MstrProductGroup.ProdGroupCode.Trim().ToUpper());
            //para.Add("SerialNo", MstrProductGroup.SerialNo);
            para.Add("UserId", MstrProductGroup.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrProductGroupSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<int> DeactiveProdGroupAsync(MstrProductGroup MstrProductGroup)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , MstrProductGroup.AutoId);  
            para.Add("IsActive" , MstrProductGroup.IsActive);         
            para.Add("UserId", MstrProductGroup.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrProductGroupDeactive", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<IEnumerable<ProdGroupDto>> GetProductGroupAsync(int ProdTypeId)
        {
            IEnumerable<ProdGroupDto> prodGroupList;
            DynamicParameters para = new DynamicParameters();

            para.Add("ProdTypeId" , ProdTypeId);
            
            prodGroupList = await DbConnection.QueryAsync<ProdGroupDto>("spMstrProductGroupGetDt" , para
                    , commandType: CommandType.StoredProcedure);
            
            return prodGroupList;
        }

        public async Task<IEnumerable<ProdTypeGroupDto>> GetProdTypeGroupAsync(int prodTypeId)
        {
            IEnumerable<ProdTypeGroupDto> prodGroupList;
            DynamicParameters para = new DynamicParameters();

            para.Add("ProdTypeId" , prodTypeId);

            prodGroupList = await DbConnection.QueryAsync<ProdTypeGroupDto>("spMstrProdTypeGroupGetDt" , para
                    , commandType: CommandType.StoredProcedure);
            
            return prodGroupList;
        }

        public async Task<int> AssignProdTypeGroupAsync(List<MstrProdTypeGroup> prod)
        {
            DynamicParameters para = new DynamicParameters();
            DataTable prodTypeDT = new DataTable();

            prodTypeDT.Columns.Add("UserId",typeof(int));
            prodTypeDT.Columns.Add("ProdTypeId",typeof(int));
            prodTypeDT.Columns.Add("ProdGroupId",typeof(int));

            foreach (var item in prod)
            {
                prodTypeDT.Rows.Add( item.CreateUserId
                        , item.ProdTypeId
                        , item.ProdGroupId);
            } 

            para.Add("ProdGroupDT", prodTypeDT.AsTableValuedParameter("ProdGroupList"));  
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);        

             var result = await DbConnection.ExecuteAsync("spMstrProdTypeGroupSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<int> DeleteProdTypeGroupAsync(List<MstrProdTypeGroup> prod)
        {
            DynamicParameters para = new DynamicParameters();
            DataTable prodTypeDT = new DataTable();

            prodTypeDT.Columns.Add("UserId",typeof(int));
            prodTypeDT.Columns.Add("ProdTypeId",typeof(int));
            prodTypeDT.Columns.Add("ProdGroupId",typeof(int));

            foreach (var item in prod)
            {
                prodTypeDT.Rows.Add( item.CreateUserId
                        , item.ProdTypeId
                        , item.ProdGroupId);
            } 

            para.Add("ProdGroupDT", prodTypeDT.AsTableValuedParameter("ProdGroupList"));  
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);        

             var result = await DbConnection.ExecuteAsync("spMstrProdTypeGroupDelete", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }
            
        #endregion Product Group

        #region Product Type

        public async Task<int> AssignCatProdTypeAsync(List<MstrCatProductType> prod)
        {
            DynamicParameters para = new DynamicParameters();
            DataTable prodTypeDT = new DataTable();

            prodTypeDT.Columns.Add("UserId",typeof(int));
            prodTypeDT.Columns.Add("CategoryId",typeof(int));
            prodTypeDT.Columns.Add("ProdTypeId",typeof(int));

            foreach (var item in prod)
            {
                prodTypeDT.Rows.Add( item.CreateUserId
                        , item.CategoryId
                        , item.ProdTypeId);
            } 

            para.Add("ProdTypeDT", prodTypeDT.AsTableValuedParameter("ProdTypeList"));  
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);        

             var result = await DbConnection.ExecuteAsync("spMstrCatProductTypeSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");     

        }

        public async Task<int> DeleteCatProdTypeAsync(List<MstrCatProductType> prod)
        {
            DynamicParameters para = new DynamicParameters();
            DataTable prodTypeDT = new DataTable();

            prodTypeDT.Columns.Add("UserId",typeof(int));
            prodTypeDT.Columns.Add("CategoryId",typeof(int));
            prodTypeDT.Columns.Add("ProdTypeId",typeof(int));

            foreach (var item in prod)
            {
                prodTypeDT.Rows.Add( item.CreateUserId
                        , item.CategoryId
                        , item.ProdTypeId);
            } 

            para.Add("ProdTypeDT", prodTypeDT.AsTableValuedParameter("ProdTypeList"));  
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);        

             var result = await DbConnection.ExecuteAsync("spMstrCatProductTypeDelete", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");     

        }

        public async Task<int> SaveProductTypeAsync(MstrProductType MstrProductType)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , MstrProductType.AutoId);
            // para.Add("CategoryId", MstrProductType.CategoryId);
            para.Add("ProdTypeName", MstrProductType.ProdTypeName.Trim());
            para.Add("ProdTypeCode", MstrProductType.ProdTypeCode.Trim().ToUpper());
            para.Add("AutoArticle", MstrProductType.bAutoArticle);
            para.Add("UserId", MstrProductType.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrProductTypeSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<IEnumerable<CatProdTypeDto>> GetCatProductTypeDtAsync(int catId)
        {
            IEnumerable<CatProdTypeDto> prodTypeList;
            DynamicParameters para = new DynamicParameters();

            para.Add("CategoryId" , catId);

            prodTypeList = await DbConnection.QueryAsync<CatProdTypeDto>("spMstrCatProductTypeGetDt" , para
                    , commandType: CommandType.StoredProcedure);
            
            return prodTypeList;
        }

        public async Task<int> DeactProductTypeAsync(MstrProductType MstrProductType)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , MstrProductType.AutoId);
            para.Add("IsActive", MstrProductType.IsActive);
            para.Add("UserId", MstrProductType.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrProductTypeDeactive", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

            
        #endregion Product Type

        #region Product SubCategory

        public async Task<int> SaveProductSubCatAsync(MstrProductSubCat MstrProductSubCat)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , MstrProductSubCat.AutoId);
            para.Add("ProdSubCatName", MstrProductSubCat.ProdSubCatName.Trim());
            para.Add("ProdSubCatCode", MstrProductSubCat.ProdSubCatCode.Trim().ToUpper());
            para.Add("ProdGroupId", MstrProductSubCat.ProdGroupId);
            para.Add("UserId", MstrProductSubCat.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrProductSubCategorySave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<int> DeactiveProdSubCatAsync(MstrProductSubCat MstrProductSubCat)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , MstrProductSubCat.AutoId);
            para.Add("IsActive" , MstrProductSubCat.IsActive);
            para.Add("UserId", MstrProductSubCat.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrProductSubCatDeactive", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<IEnumerable<ProductSubCatDto>> GetProductSubCatAsync(int ProdGroupId)
        {
            IEnumerable<ProductSubCatDto> prodSubCatList;
            DynamicParameters para = new DynamicParameters();

            para.Add("ProdGroupId" , ProdGroupId);

            prodSubCatList = await DbConnection.QueryAsync<ProductSubCatDto>("spMstrProductSubCategoryGetDt" , para
                    , commandType: CommandType.StoredProcedure);
            
            return prodSubCatList;
        }
            
        #endregion Product SubCategory

        #region Serial No Details

        public async Task<int> SaveSerialNoDtAsync(MstrSerialNoDetails serialNoDt)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , serialNoDt.AutoId);
            para.Add("ModuleId", serialNoDt.ModuleId);
            para.Add("Name", serialNoDt.Name.Trim());
            para.Add("Prefix", serialNoDt.Prefix.Trim().ToUpper());
            para.Add("NoOfDigits", serialNoDt.NoOfDigits);
            para.Add("Counter", serialNoDt.Counter);
            para.Add("LocationId", serialNoDt.LocationId);
            para.Add("UserId", serialNoDt.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrSerialNoDetailsSave", para 
                    , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }
            
        #endregion Serial No Details      


        #region CostGroup

        public async Task<int> SaveCostGroupAsync(MstrCostingGroup MstrCostingGroup)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , MstrCostingGroup.AutoId);
            para.Add("LocationId", MstrCostingGroup.LocationId);
            para.Add("Name", MstrCostingGroup.Name.Trim());
            para.Add("UserId", MstrCostingGroup.CreateUserId);
            para.Add("IsMaterialAlloc", MstrCostingGroup.IsMaterialAllocated);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrCostingGroupSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }
            
        #endregion CostGroup       

        
        #region Flex Field Details
            
        public async Task<int> SaveFlexFieldDetailsAsync(MstrFlexFieldDetails flexDetails)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , flexDetails.AutoId);
            para.Add("FieldCode", flexDetails.FlexFieldCode.ToUpper().Trim());
            para.Add("FieldName", flexDetails.FlexFieldName.Trim());
            para.Add("CategoryId", flexDetails.CategoryId);
            para.Add("ProdTypeId", flexDetails.ProdTypeId);
            para.Add("ModuleId", flexDetails.ModuleId);
            para.Add("DataType", flexDetails.DataType);
            para.Add("ValueList", flexDetails.ValueList);
            para.Add("Mandatory", flexDetails.Mandatory);
            para.Add("UserId", flexDetails.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrFlexFeildDetailsSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<IEnumerable<FlexFieldReturnDto>> GetFlexFieldDtAsync(int CategoryId)
        {
            IEnumerable<FlexFieldReturnDto> flexFieldList;
            DynamicParameters para = new DynamicParameters();

            para.Add("CategoryId" , CategoryId);

            flexFieldList = await DbConnection.QueryAsync<FlexFieldReturnDto>("spMstrFlexFeildDetailsGet" , para
                    , commandType: CommandType.StoredProcedure);
            
            return flexFieldList;
        }

        public async Task<int> DeactiveFlexFieldDtAsync(MstrFlexFieldDetails flexFieldDt)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , flexFieldDt.AutoId);
            para.Add("IsActive" , flexFieldDt.isActive);
            para.Add("UserId", flexFieldDt.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrFlexFeildDetailsDeactive", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        #endregion Flex Field Details

    
        #region Flex Field ValueList

        public async Task<int> SaveFlexFieldValListAsync(MstrFlexFieldValueList flexDetailsVal)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , flexDetailsVal.AutoId);
            para.Add("FlexFieldDtId", flexDetailsVal.FlexFieldId);
            para.Add("FlexFieldValue", flexDetailsVal.FlexFeildVlaue.Trim());           
            para.Add("UserId", flexDetailsVal.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrFlexFieldValueListSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<int> DeleteFlexFieldValListAsync(MstrFlexFieldValueList flexDetailsVal)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , flexDetailsVal.AutoId);          
            para.Add("UserId", flexDetailsVal.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrFlexFieldValueListDelete", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }
            
        #endregion Flex Field ValueList      
      
        
    }
}