using System;
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

        #endregion User Menu List


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

        #endregion Location

        #region Article Color Allocation

        public async Task<IEnumerable<ColorAllocationDto>> getArtColorPermitDtAsync(int ArticleId)
        {
            IEnumerable<ColorAllocationDto> colorList;
            DynamicParameters para = new DynamicParameters();

            para.Add("ArticleId" , ArticleId);
           
            return colorList = await DbConnection.QueryAsync<ColorAllocationDto>("spMstrArticleColorGetPColor" , para
                    , commandType: CommandType.StoredProcedure);            
        }

        public async Task<int> SaveArticleColorAsync(List<MstrArticleColor> articleColor)
        {
            DataTable artColorDt = new DataTable();
            DynamicParameters para = new DynamicParameters();

            artColorDt.Columns.Add("ArticleId" , typeof(long));
            artColorDt.Columns.Add("ColorId" , typeof(int));
            artColorDt.Columns.Add("UserId" , typeof(int));

            foreach (var item in articleColor)
            {
                artColorDt.Rows.Add( item.ArticleId
                       , item.ColorId
                       , item.CreateUserId);                
            }   

            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 
            para.Add("ArtColorTypeDT", artColorDt.AsTableValuedParameter("ArtColorType"));

            var result = await DbConnection.ExecuteAsync("spMstrArticleColorSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

           public async Task<int> DeleteArticleColorAsync(List<MstrArticleColor> articleColor)
        {
            DataTable artColorDt = new DataTable();
            DynamicParameters para = new DynamicParameters();

            artColorDt.Columns.Add("ArticleId" , typeof(long));
            artColorDt.Columns.Add("ColorId" , typeof(int));
            artColorDt.Columns.Add("UserId" , typeof(int));

            foreach (var item in articleColor)
            {
                artColorDt.Rows.Add( item.ArticleId
                       , item.ColorId
                       , item.CreateUserId);                
            }   

            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 
            para.Add("ArtColorTypeDT", artColorDt.AsTableValuedParameter("ArtColorType"));

            var result = await DbConnection.ExecuteAsync("spMstrArticleColorDelete", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        #endregion Article Color
        
        #region Article Size Allocation

        public async Task<IEnumerable<SizeAllocationDto>> getArtSizePermitDtAsync(int ArticleId)
        {
            IEnumerable<SizeAllocationDto> sizeList;
            DynamicParameters para = new DynamicParameters();

            para.Add("ArticleId" , ArticleId);
           
            return sizeList = await DbConnection.QueryAsync<SizeAllocationDto>("spMstrArticleSizeGetPSize" , para
                    , commandType: CommandType.StoredProcedure);            
        }

        public async Task<int> SaveArticleSizeAsync(List<MstrArticleSize> articleSize)
        {
            DataTable artColorDt = new DataTable();
            DynamicParameters para = new DynamicParameters();

            artColorDt.Columns.Add("ArticleId" , typeof(long));
            artColorDt.Columns.Add("SizeId" , typeof(int));
            artColorDt.Columns.Add("UserId" , typeof(int));

            foreach (var item in articleSize)
            {
                artColorDt.Rows.Add( item.ArticleId
                       , item.SizeId
                       , item.CreateUserId);                
            }   

            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 
            para.Add("ArtSizeTypeDT", artColorDt.AsTableValuedParameter("ArtSizeType"));

            var result = await DbConnection.ExecuteAsync("spMstrArticleSizeSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<int> DeleteArticleSizeAsync(List<MstrArticleSize> articleSize)
        {
            DataTable artColorDt = new DataTable();
            DynamicParameters para = new DynamicParameters();

            artColorDt.Columns.Add("ArticleId" , typeof(long));
            artColorDt.Columns.Add("SizeId" , typeof(int));
            artColorDt.Columns.Add("UserId" , typeof(int));

            foreach (var item in articleSize)
            {
                artColorDt.Rows.Add( item.ArticleId
                       , item.SizeId
                       , item.CreateUserId);                
            }   

            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 
            para.Add("ArtSizeTypeDT", artColorDt.AsTableValuedParameter("ArtSizeType"));

            var result = await DbConnection.ExecuteAsync("spMstrArticleSizeDelete", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        #endregion Article Size

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
            // para.Add("LinkColor", mstrColor.LinkColorCard);
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

        #region Color Allocation

        public async Task<IEnumerable<ColorAllocationDto>> GetColorAllocDetailsAsync(int ColorCardId)
        {
            IEnumerable<ColorAllocationDto> colorList;
            DynamicParameters para = new DynamicParameters();

            para.Add("ColorCardId" , ColorCardId);
           
            return colorList = await DbConnection.QueryAsync<ColorAllocationDto>("spMstrColorGetAllocDetails" , para
                    , commandType: CommandType.StoredProcedure);            
        }

        [System.Obsolete]
        public async Task<int> SaveColorAllocationAsync(List<MstrColorAllocCard> colorAlloc)
        {
            DataTable ColorAllocDT = new DataTable();

            ColorAllocDT.Columns.Add("ColorCardId",typeof(byte));
            ColorAllocDT.Columns.Add("ColorId",typeof(int));
            ColorAllocDT.Columns.Add("UserID",typeof(int));

            foreach (var item in colorAlloc)
            {
                ColorAllocDT.Rows.Add( item.ColorCardId
                        , item.ColorId
                        , item.CreateUserId);
            }         

            var ColorAllocDetails = new SqlParameter("@ColorAllocDT", SqlDbType.Structured); 
            ColorAllocDetails.Value = ColorAllocDT;
            ColorAllocDetails.TypeName = "[dbo].[ColorAllocType]";

            var Result = new SqlParameter("@Result", SqlDbType.Int);
            Result.Direction = ParameterDirection.Output;            

             await _context.Database
            .ExecuteSqlCommandAsync(@"exec spMstrColorAllocationSave @ColorAllocDT,@Result out" 
                ,ColorAllocDetails,Result );

            return int.Parse(Result.Value.ToString());  
        }

        [System.Obsolete]
        public async Task<int> DeleteColorAllocationAsync(List<MstrColorAllocCard> colorAlloc)
        {
            DataTable ColorAllocDT = new DataTable();

            ColorAllocDT.Columns.Add("ColorCardId",typeof(byte));
            ColorAllocDT.Columns.Add("ColorId",typeof(int));
            ColorAllocDT.Columns.Add("UserID",typeof(int));

            foreach (var item in colorAlloc)
            {
                ColorAllocDT.Rows.Add( item.ColorCardId
                        , item.ColorId
                        , item.CreateUserId);
            }         

            var ColorAllocDetails = new SqlParameter("@ColorAllocDT", SqlDbType.Structured); 
            ColorAllocDetails.Value = ColorAllocDT;
            ColorAllocDetails.TypeName = "[dbo].[ColorAllocType]";

            var Result = new SqlParameter("@Result", SqlDbType.Int);
            Result.Direction = ParameterDirection.Output;            

             await _context.Database
            .ExecuteSqlCommandAsync(@"exec spMstrColorAllocationDelete @ColorAllocDT,@Result out" 
                ,ColorAllocDetails,Result );

            return int.Parse(Result.Value.ToString());  
           
        }

        #endregion Color Allocation


        #region Size to Size Card Allocation

        public async Task<IEnumerable<SizeAllocationDto>> GetSizeAllocDetailsAsync(int SizeCardId)
        {
            IEnumerable<SizeAllocationDto> sizeList;
            DynamicParameters para = new DynamicParameters();

            para.Add("SizeCardId" , SizeCardId);
           
            return sizeList = await DbConnection.QueryAsync<SizeAllocationDto>("spMstrSizeGetAllocDetails" , para
                    , commandType: CommandType.StoredProcedure);            
        }

        [System.Obsolete]
        public async Task<int> SaveSizeAllocationAsync(List<MstrSizeAllocCard> sizeAlloc)
        {
            DataTable SizeAllocDT = new DataTable();

            SizeAllocDT.Columns.Add("SizeCardId",typeof(byte));
            SizeAllocDT.Columns.Add("SizeId",typeof(int));
            SizeAllocDT.Columns.Add("UserID",typeof(int));

            foreach (var item in sizeAlloc)
            {
                SizeAllocDT.Rows.Add( item.SizeCardId
                        , item.SizeId
                        , item.CreateUserId);
            }         

            var sizeAllocDetails = new SqlParameter("@SizeAllocDT", SqlDbType.Structured); 
            sizeAllocDetails.Value = SizeAllocDT;
            sizeAllocDetails.TypeName = "[dbo].[SizeAllocType]";

            var Result = new SqlParameter("@Result", SqlDbType.Int);
            Result.Direction = ParameterDirection.Output;            

             await _context.Database
            .ExecuteSqlCommandAsync(@"exec spMstrSizeAllocationSave @SizeAllocDT,@Result out" 
                ,sizeAllocDetails,Result );

            return int.Parse(Result.Value.ToString());  
        }

        [System.Obsolete]
        public async Task<int> DeleteSizeAllocationAsync(List<MstrSizeAllocCard> sizeAlloc)
        {
            DataTable SizeAllocDT = new DataTable();

            SizeAllocDT.Columns.Add("SizeCardId",typeof(byte));
            SizeAllocDT.Columns.Add("SizeId",typeof(int));
            SizeAllocDT.Columns.Add("UserID",typeof(int));

            foreach (var item in sizeAlloc)
            {
                SizeAllocDT.Rows.Add( item.SizeCardId
                        , item.SizeId
                        , item.CreateUserId);
            }         

            var sizeAllocDetails = new SqlParameter("@SizeAllocDT", SqlDbType.Structured); 
            sizeAllocDetails.Value = SizeAllocDT;
            sizeAllocDetails.TypeName = "[dbo].[SizeAllocType]";

            var Result = new SqlParameter("@Result", SqlDbType.Int);
            Result.Direction = ParameterDirection.Output;            

             await _context.Database
            .ExecuteSqlCommandAsync(@"exec spMstrSizeAllocationDelete @SizeAllocDT,@Result out" 
                ,sizeAllocDetails,Result );

            return int.Parse(Result.Value.ToString());   
           
        }

        #endregion Size to Size Card Allocation


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
            // para.Add("LinkSize", mstrSize.LinkSizeCard);
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

        public async Task<ArticleReturnDto> SaveArticleAsync(SaveArticleDto article)
        {
            DataTable flexField = new DataTable();
            DynamicParameters para = new DynamicParameters();

            flexField.Columns.Add("FieldId", typeof(int));
            flexField.Columns.Add("FieldCode", typeof(string));
            flexField.Columns.Add("FieldName", typeof(string));
            flexField.Columns.Add("DataType", typeof(string));
            flexField.Columns.Add("ValueList", typeof(bool));
            flexField.Columns.Add("bFlexFieldValue", typeof(bool));
            flexField.Columns.Add("dFlexFieldValue", typeof(DateTime));
            flexField.Columns.Add("iFlexFeildValue", typeof(int));
            flexField.Columns.Add("fFlexFeildValue", typeof(decimal));
            flexField.Columns.Add("cFlexFeildValue", typeof(string));

            para.Add("AutoId" , article.Article.AutoId);
            para.Add("StockCode", article.Article.StockCode.Trim());
            para.Add("ArticleName", article.Article.ArticleName.Trim());
            para.Add("Description1", article.Article.Description1.Trim());
            para.Add("Description2", article.Article.Description2.Trim());
            para.Add("CategoryId", article.Article.CategoryId);
            para.Add("ProTypeId", article.Article.ProTypeId);
            para.Add("ProGroupId", article.Article.ProGroupId);
            para.Add("ItemType", article.Article.ItemType);
            para.Add("UnitId", article.Article.StorageUnitId);
            para.Add("MeasurementId", article.Article.MeasurementId);
            para.Add("ColorCardId", article.Article.ColorCardId);
            para.Add("SizeCardId", article.Article.SizeCardId);
            para.Add("SalesPrice", article.Article.SalesPrice);
            para.Add("AvgCostPrice", article.Article.AvgCostPrice);
            para.Add("LastCostPrice", article.Article.LastCostPrice);
            para.Add("MaxCostPrice", article.Article.MaxCostPrice);
            // para.Add("LoactionId", article.LocationId);
            para.Add("UserId", article.Article.CreateUserId);

            foreach (var item in article.FlexField)
            {
                flexField.Rows.Add(item.FlexFieldId,
                                    item.FlexFieldCode ,
                                    item.FlexFieldName ,
                                    item.DataType ,
                                    item.ValueList,
                                    item.bFlexFieldValue,
                                    item.dFlexFieldValue,
                                    item.iFlexFeildValue,
                                    item.fFlexFeildValue,
                                    item.cFlexFeildValue);
            } 

            para.Add("FlexFieldDT", flexField.AsTableValuedParameter("FlexFieldType"));       

            var result = await DbConnection.QueryFirstOrDefaultAsync<ArticleReturnDto>("spMstrArticleSave", para
                , commandType: CommandType.StoredProcedure);            

            return result;
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


        #region Unit Conversion

        public async Task<int> SaveUnitConversionAsync(MstrUnitConversion unitConv)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , unitConv.AutoId);
            para.Add("FromUnitId", unitConv.FromUnitId);
            para.Add("ToUnitId", unitConv.ToUnitId);
            para.Add("Value", unitConv.Value);
            para.Add("UserId", unitConv.CreateUserId);            
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrUnitConversionSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }


        #endregion Unit Conversion

        #region Flute Type

        public async Task<int> SaveFluteTypeAsync(MstrFluteTypes fluteTypes)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , fluteTypes.AutoId);
            para.Add("Factor", fluteTypes.Factor);
            para.Add("Code", fluteTypes.Code.ToUpper());
            para.Add("LocationId", fluteTypes.LocationId);
            para.Add("UserId", fluteTypes.CreateUserId);            
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrFluteTypesSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        #endregion Flute Type

        #region Sales Agent

        public async Task<int> SaveSalesAgentAsync(MstrSalesAgent salesAgent)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , salesAgent.AutoId);
            para.Add("Name", salesAgent.Name);
            para.Add("Email", salesAgent.Email);
            para.Add("LocationId", salesAgent.LocationId);
            para.Add("UserId", salesAgent.CreateUserId);            
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrSalesAgentSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        #endregion Sales Agent

        #region Currency

        public async Task<int> SaveCurrencyAsync(MstrCurrency currency)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , currency.AutoId);
            para.Add("Name", currency.Name);
            para.Add("Code", currency.Code.ToUpper());
            para.Add("Symbol", currency.Symbol);
            para.Add("UserId", currency.CreateUserId);            
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrCurrencySave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        #endregion Currency

        #region Address Type

        public async Task<int> SaveAddressTypeAsync(MstrAddressType addressType)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , addressType.AutoId);
            para.Add("AddressCode", addressType.AddressCode.ToUpper().Trim());
            para.Add("AddressName", addressType.AddressCodeName);
            para.Add("UserId", addressType.CreateUserId);            
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrAddressTypeSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        #endregion Address Type

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

        #region Code Definition
                   
        public async Task<int> SaveCodeDefinitionAsync(MstrCodeDefinition codeDefinition)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , codeDefinition.AutoId);
            para.Add("CategoryId", codeDefinition.CategoryId);
            para.Add("ProdTypeId", codeDefinition.ProdTypeId);
            para.Add("ProdGroupId", codeDefinition.ProdGroupId);
            para.Add("SortOrder", codeDefinition.SortOrder);
            para.Add("IsProductField", codeDefinition.IsProductField);
            para.Add("FlexFieldId", codeDefinition.FlexFieldId);
            para.Add("FieldName", codeDefinition.FieldName);
            para.Add("IsCode", codeDefinition.IsCode);
            para.Add("IsName", codeDefinition.IsName);
            para.Add("IsCounter", codeDefinition.IsName);
            para.Add("IsValue", codeDefinition.IsValue);
            para.Add("CounterPad", codeDefinition.CounterPad);
            para.Add("CounterStart", codeDefinition.CounterStart);
            para.Add("SeqNo", codeDefinition.SeqNo);
            para.Add("IsSeperator", codeDefinition.IsSeperator);
            para.Add("Seperator", codeDefinition.Seperator);
            para.Add("UserId", codeDefinition.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrCodeDefinitionSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        public async Task<int> DeleteCodeDefinitionAsync(MstrCodeDefinition codeDefinition)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , codeDefinition.AutoId);            
            para.Add("UserId", codeDefinition.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrCodeDefinitionDelete", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        #endregion Code Definition


        #region Reject Reason
                   
        public async Task<int> SaveRejectReasonAsync(MstrRejectionReasons rejReasons)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , rejReasons.AutoId);
            para.Add("Details", rejReasons.Details.Trim());
            para.Add("UserId", rejReasons.CreateUserId);
            para.Add("LocationId", rejReasons.LocationId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrRejectReasonSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        #endregion Reject Reason


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

        #region Countries
                  
        public async Task<int> SaveCountriesAsync(MstrCountries countries)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , countries.AutoId);
            para.Add("Code", countries.Code.ToUpper().Trim());
            para.Add("Name", countries.Name.Trim());
            para.Add("Alpha2Code", countries.Alpha2Code.ToUpper().Trim());
            para.Add("Alpha3Code", countries.Alpha3Code.ToUpper().Trim());
            para.Add("Numeric", countries.Numeric);
            para.Add("UserId", countries.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrCountriesSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        #endregion Countries

        #region Payment Terms
                  
        public async Task<int> SavePaymentTermsAsync(MstrPaymentTerm paymentTerm)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , paymentTerm.AutoId);
            para.Add("Code", paymentTerm.Code.ToUpper().Trim());
            para.Add("Name", paymentTerm.Name.Trim());
            para.Add("UserId", paymentTerm.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spMstrPaymentTermsSave", para
                , commandType: CommandType.StoredProcedure);            

            return para.Get<int>("Result");
        }

        #endregion Payment Terms


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

        public async Task<int> SaveSequenceSetAsync(TransSequenceSettings seqSettings)
        {
            DynamicParameters para = new DynamicParameters();

            para.Add("AutoId" , seqSettings.AutoId);
            para.Add("TransType", seqSettings.TransType);
            para.Add("Prefix", seqSettings.Prefix.Trim().ToUpper());
            para.Add("SeqLength", seqSettings.SeqLength);
            para.Add("SeqNo", seqSettings.SeqNo);
            // para.Add("CurrentYea", seqSettings.CurrentYear);
            para.Add("LocationId", seqSettings.LocationId);
            para.Add("UserId", seqSettings.CreateUserId);
            para.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 

            var result = await DbConnection.ExecuteAsync("spTransSequenceSettingsSave", para 
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