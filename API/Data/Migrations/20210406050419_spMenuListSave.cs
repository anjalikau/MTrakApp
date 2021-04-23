using Microsoft.EntityFrameworkCore.Migrations;

namespace API.data.Migrations
{
    public partial class spMenuListSave : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            string procedure = @"CREATE PROCEDURE [dbo].[spMenuListSave]
                @mId INT = NULL,
                @mName VARCHAR(50) = NULL,
                @mDescription VARCHAR(100) = NULL,
                @mType CHAR(1) = NULL,
                @GroupName VARCHAR(20) = NULL,
                @AgentLevel TINYINT = NULL,
                @AgentId INT = NULL,
                @Result INT OUT
            AS
            BEGIN TRY
                BEGIN TRAN

                DECLARE @TimeZone INT, @TransDateTime DATETIME

                ------======== GET TIME ZONE ACCORDING TO THE FACTORY =========================------------
                SELECT @TimeZone = TimeZone FROM [Master.Factory] WITH(NOLOCK)
                WHERE AutoId = (SELECT [FactoryId] FROM [dbo].[Master.Agents] WITH(NOLOCK) WHERE idAgents = @AgentId)

                SET @TransDateTime = [dbo].[GetZoneDateTime] (@TimeZone)
                
                IF (@mId = 0)
                BEGIN
                    IF NOT EXISTS (SELECT AutoIdx FROM [dbo].[Master.MenuList] WITH(NOLOCK) WHERE MenuName = @mName)
                    BEGIN
                        INSERT INTO [dbo].[Master.MenuList] ([MenuName] ,[MenuDescription],[GroupName],[mType] ,[CreateUserID],[CreateDateTime])
                        VALUES (@mName,@mDescription,@mType,@GroupName,@AgentId,@TransDateTime);

                        SET @mId = SCOPE_IDENTITY();

                        INSERT INTO [dbo].[Master.MenuLevel] (iCategoryLevel,MenuID)
                        VALUES(@AgentLevel,@mId);

                        SET @Result = 1
                    END
                    ELSE
                    BEGIN 
                        SET @Result = -1
                    END
                END
                ELSE
                BEGIN
                    UPDATE [dbo].[Master.MenuList] 
                    SET MenuName = @mName, MenuDescription = @mDescription , mType = @mType, GroupName = @GroupName
                        , UpdateUserID = @AgentId , UpdateDateTime = @TransDateTime
                    WHERE AutoIdx = @mId

                    SET @Result = 1
                END

                COMMIT TRAN
            END TRY 
            BEGIN CATCH
                ROLLBACK TRAN

                SELECT ERROR_NUMBER() AS ErrorNumber
                    , ERROR_SEVERITY() AS ErrorSeverity
                    , ERROR_STATE() AS ErrorState
                    , ERROR_PROCEDURE() AS ErrorProcedure
                    , ERROR_LINE() AS ErrorLine
                    , ERROR_MESSAGE() AS ErrorMessage
                    , '0' AS Result;

                --INSERT INTO dbo.ErrorLog (UserName,ErrorNumber,ErrorSeverity,ErrorState,ErrorProcedure,ErrorLine,ErrorMessage,cModule)
                --VALUES (@@SERVERNAME,ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),'AGENT SAVE')
            END CATCH
            " ;

            migrationBuilder.Sql(procedure);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
           string procedure = @"DROP PROCEDURE [dbo].[spMenuListSave]";
            migrationBuilder.Sql(procedure);
        }
    }
}
