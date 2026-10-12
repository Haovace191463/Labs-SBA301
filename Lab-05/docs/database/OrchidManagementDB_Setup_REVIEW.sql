-- ============================================================================
-- SBA301 Lab 05 - Orchid_Mgnt_V5
-- Target Database Setup Script (REVIEW ONLY - DO NOT EXECUTE AUTOMATICALLY)
-- Target Database: OrchidManagementDB
-- Target Table: dbo.Orchid (Exact 7-column schema)
-- Source Specifications: SQLQuery1.sql, SQLQuery2.sql, Teacher Guide v1
-- Safety Guarantee: Non-destructive (NO DROP, NO TRUNCATE, NO DELETE, NO UPDATE)
--
-- EXECUTION & ENVIRONMENT PREREQUISITES:
-- 1. SQL Server Authentication & Permissions:
--    - Requires CREATE DATABASE permissions in the 'master' database (e.g. 'sa', 'sysadmin', or 'dbcreator' role).
--    - Requires DDL permissions in OrchidManagementDB (CREATE TABLE) and DML permissions (INSERT, SELECT).
--    - If executed by a restricted SQL login lacking CREATE DATABASE rights, Step 1 will fail with Error 262.
--
-- 2. Physical Storage & Server Side Effects:
--    - When creating OrchidManagementDB, SQL Server allocates primary data (.mdf) and transaction
--      log (.ldf) files in the server's default data directory (~16MB initial allocation).
--    - The database inherits the server's default collation and the 'model' database recovery model.
--    - IF DB_ID('OrchidManagementDB') IS NULL ensures the database is created only if missing;
--      any existing database with this name is preserved untouched.
--
-- 3. Client Execution Behavior across Batch Boundaries (GO):
--    - 'GO' is a client-side command (SSMS, Azure Data Studio, sqlcmd), NOT a T-SQL engine statement.
--    - In SSMS: By default, SSMS executes batches sequentially. If batch N encounters THROW or
--      RAISERROR, batch N terminates immediately; however, SSMS does NOT stop subsequent batches
--      separated by 'GO'. Neither THROW nor RETURN in a previous batch acts as a global stop in SSMS.
--    - In sqlcmd: Subsequent batches will execute unless sqlcmd is run with the '-b' flag
--      (e.g., sqlcmd -S <server> -d master -b -i OrchidManagementDB_Setup_REVIEW.sql) or ':on error exit'.
--    - Script Protection Strategy:
--      * Step 4 (Comprehensive Schema Validation) and Step 5 (Seed Insertion) are consolidated
--        into the SAME BATCH.
--      * Seed INSERT statements are encapsulated in dynamic SQL (sp_executesql @SeedSql).
--        Because dynamic SQL is parsed and compiled only when sp_executesql is executed at runtime,
--        SQL Server's query compiler will NEVER attempt compile-time column resolution against
--        an incompatible table if validation fails.
--      * If schema validation detects any column type, nullability, length, identity, or PK mismatch,
--        THROW 51000 halts the batch immediately before sp_executesql is ever called.
--      * Step 6 (Verification Summary) is dynamically guarded so that even if SSMS dispatches
--        subsequent batches after an error in Step 4, it will not fail with compilation errors.
--
-- 4. Duplicate Prevention & Re-run Limitation:
--    - Seed records are matched on the composite key (OrchidName, OrchidCategory, OrchidURL).
--    - Documented Re-run Behavior: If an existing teacher seed row is modified by an application
--      user (e.g., name, category, or URL changed in UI) or deleted, running this script again
--      will detect that original triple as absent and reinsert the original seed row.
--
-- 5. Proposed Backend Configuration Notes (chapter15api/src/main/resources/application.properties):
--    - spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=OrchidManagementDB;encrypt=true;trustServerCertificate=true
--    - spring.datasource.username=${DB_USERNAME:sa}
--    - spring.datasource.password=${DB_PASSWORD}  -- Redacted from Git; passed via environment variable
--    - spring.jpa.hibernate.ddl-auto=validate    -- Hibernate validates schema against 7-column entity at startup
-- ============================================================================

-- STEP 1: Idempotent Database Creation
IF DB_ID(N'OrchidManagementDB') IS NULL
BEGIN
    PRINT N'[INFO] Creating database OrchidManagementDB...';
    CREATE DATABASE OrchidManagementDB;
    PRINT N'[INFO] Database OrchidManagementDB created successfully.';
END
ELSE
BEGIN
    PRINT N'[INFO] Database OrchidManagementDB already exists. Preserving database.';
END
GO

-- STEP 2: Set Database Context
USE OrchidManagementDB;
GO

-- STEP 3: Idempotent Table Creation (Exact 7-column schema)
IF OBJECT_ID(N'dbo.Orchid', N'U') IS NULL
BEGIN
    PRINT N'[INFO] Creating table dbo.Orchid (7-column schema)...';
    CREATE TABLE dbo.Orchid (
        OrchidID INT IDENTITY(1,1) PRIMARY KEY,
        OrchidName NVARCHAR(100) NOT NULL,
        IsNatural BIT NOT NULL,
        OrchidDescription NVARCHAR(500) NULL,
        OrchidCategory NVARCHAR(100) NULL,
        IsAttractive BIT NOT NULL,
        OrchidURL NVARCHAR(500) NULL
    );
    PRINT N'[INFO] Table dbo.Orchid created successfully.';
END
ELSE
BEGIN
    PRINT N'[INFO] Table dbo.Orchid already exists. Performing comprehensive schema validation...';
END
GO

-- STEP 4 & 5: Comprehensive Schema Validation & Safe Dynamic Seed Execution
-- Validation and seed insertion are executed in the SAME BATCH to guarantee that seed
-- statements cannot be compiled or run if validation fails.
-- Dynamic SQL ensures the query optimizer never attempts compile-time resolution of columns
-- against an incompatible table structure.

DECLARE @ValidationFailed BIT = 0;
DECLARE @FailureReason NVARCHAR(MAX) = N'';

-- Check 1: Column count must be exactly 7
DECLARE @ColCount INT;
SELECT @ColCount = COUNT(*)
FROM sys.columns
WHERE object_id = OBJECT_ID(N'dbo.Orchid', N'U');

IF @ColCount <> 7
BEGIN
    SET @ValidationFailed = 1;
    SET @FailureReason = @FailureReason + N'[Column count: expected 7, found ' + CAST(ISNULL(@ColCount, 0) AS NVARCHAR(10)) + N'] ';
END

-- Check 2: OrchidID (int, NOT NULL, IDENTITY, Primary Key)
-- sys.columns: TYPE_NAME = 'int', max_length = 4 bytes, is_nullable = 0, is_identity = 1
IF NOT EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE object_id = OBJECT_ID(N'dbo.Orchid', N'U')
      AND name = N'OrchidID'
      AND TYPE_NAME(user_type_id) = N'int'
      AND max_length = 4
      AND is_nullable = 0
      AND is_identity = 1
)
BEGIN
    SET @ValidationFailed = 1;
    SET @FailureReason = @FailureReason + N'[OrchidID: must be int NOT NULL IDENTITY] ';
END

-- Check Primary Key constraint: OrchidID must be the sole PK column
IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes i
    INNER JOIN sys.index_columns ic
        ON i.object_id = ic.object_id AND i.index_id = ic.index_id
    INNER JOIN sys.columns c
        ON ic.object_id = c.object_id AND ic.column_id = c.column_id
    WHERE i.object_id = OBJECT_ID(N'dbo.Orchid', N'U')
      AND i.is_primary_key = 1
      AND c.name = N'OrchidID'
      AND (
          SELECT COUNT(*)
          FROM sys.index_columns ic2
          WHERE ic2.object_id = i.object_id AND ic2.index_id = i.index_id
      ) = 1
)
BEGIN
    SET @ValidationFailed = 1;
    SET @FailureReason = @FailureReason + N'[OrchidID: must be the sole Primary Key column] ';
END

-- Check 3: OrchidName (nvarchar(100), NOT NULL)
-- sys.columns: TYPE_NAME = 'nvarchar', max_length = 200 bytes (100 unicode chars * 2 bytes/char), is_nullable = 0
IF NOT EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE object_id = OBJECT_ID(N'dbo.Orchid', N'U')
      AND name = N'OrchidName'
      AND TYPE_NAME(user_type_id) = N'nvarchar'
      AND max_length = 200
      AND is_nullable = 0
)
BEGIN
    SET @ValidationFailed = 1;
    SET @FailureReason = @FailureReason + N'[OrchidName: must be nvarchar(100) (max_length=200 bytes) NOT NULL] ';
END

-- Check 4: IsNatural (bit, NOT NULL)
-- sys.columns: TYPE_NAME = 'bit', max_length = 1 byte, is_nullable = 0
IF NOT EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE object_id = OBJECT_ID(N'dbo.Orchid', N'U')
      AND name = N'IsNatural'
      AND TYPE_NAME(user_type_id) = N'bit'
      AND max_length = 1
      AND is_nullable = 0
)
BEGIN
    SET @ValidationFailed = 1;
    SET @FailureReason = @FailureReason + N'[IsNatural: must be bit NOT NULL] ';
END

-- Check 5: OrchidDescription (nvarchar(500), NULL)
-- sys.columns: TYPE_NAME = 'nvarchar', max_length = 1000 bytes (500 unicode chars * 2 bytes/char), is_nullable = 1
IF NOT EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE object_id = OBJECT_ID(N'dbo.Orchid', N'U')
      AND name = N'OrchidDescription'
      AND TYPE_NAME(user_type_id) = N'nvarchar'
      AND max_length = 1000
      AND is_nullable = 1
)
BEGIN
    SET @ValidationFailed = 1;
    SET @FailureReason = @FailureReason + N'[OrchidDescription: must be nvarchar(500) (max_length=1000 bytes) NULL] ';
END

-- Check 6: OrchidCategory (nvarchar(100), NULL)
-- sys.columns: TYPE_NAME = 'nvarchar', max_length = 200 bytes (100 unicode chars * 2 bytes/char), is_nullable = 1
IF NOT EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE object_id = OBJECT_ID(N'dbo.Orchid', N'U')
      AND name = N'OrchidCategory'
      AND TYPE_NAME(user_type_id) = N'nvarchar'
      AND max_length = 200
      AND is_nullable = 1
)
BEGIN
    SET @ValidationFailed = 1;
    SET @FailureReason = @FailureReason + N'[OrchidCategory: must be nvarchar(100) (max_length=200 bytes) NULL] ';
END

-- Check 7: IsAttractive (bit, NOT NULL)
-- sys.columns: TYPE_NAME = 'bit', max_length = 1 byte, is_nullable = 0
IF NOT EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE object_id = OBJECT_ID(N'dbo.Orchid', N'U')
      AND name = N'IsAttractive'
      AND TYPE_NAME(user_type_id) = N'bit'
      AND max_length = 1
      AND is_nullable = 0
)
BEGIN
    SET @ValidationFailed = 1;
    SET @FailureReason = @FailureReason + N'[IsAttractive: must be bit NOT NULL] ';
END

-- Check 8: OrchidURL (nvarchar(500), NULL)
-- sys.columns: TYPE_NAME = 'nvarchar', max_length = 1000 bytes (500 unicode chars * 2 bytes/char), is_nullable = 1
IF NOT EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE object_id = OBJECT_ID(N'dbo.Orchid', N'U')
      AND name = N'OrchidURL'
      AND TYPE_NAME(user_type_id) = N'nvarchar'
      AND max_length = 1000
      AND is_nullable = 1
)
BEGIN
    SET @ValidationFailed = 1;
    SET @FailureReason = @FailureReason + N'[OrchidURL: must be nvarchar(500) (max_length=1000 bytes) NULL] ';
END

-- EVALUATE VALIDATION RESULT:
IF @ValidationFailed = 1
BEGIN
    PRINT N'[FATAL ERROR] Existing table dbo.Orchid schema validation failed:';
    PRINT N'              ' + @FailureReason;
    PRINT N'[FATAL ERROR] Script execution halted. No seed data will be inserted.';
    THROW 51000, N'Incompatible schema detected in dbo.Orchid. Setup aborted.', 1;
END

PRINT N'[INFO] Comprehensive schema validation passed: dbo.Orchid satisfies all 7 column specifications.';

-- STEP 5: Safe Seed Data Execution via Dynamic SQL
-- Seed data is executed via sp_executesql ONLY after validation passes.
-- If validation had failed, THROW 51000 above terminated the batch before this code was reached.
PRINT N'[INFO] Proceeding to insert teacher seed records (13 records total)...';

DECLARE @SeedSql NVARCHAR(MAX) = N'
-- 1. Taichung Beauty (SQLQuery1.sql)
IF NOT EXISTS (SELECT 1 FROM dbo.Orchid WHERE OrchidName = N''Taichung Beauty'' AND OrchidCategory = N''Cattleya'' AND OrchidURL = N''https://example.com/orchid1.jpg'')
BEGIN
    INSERT INTO dbo.Orchid (OrchidName, IsNatural, OrchidDescription, OrchidCategory, IsAttractive, OrchidURL)
    VALUES (N''Taichung Beauty'', 1, N''Popular Cattleya orchid'', N''Cattleya'', 1, N''https://example.com/orchid1.jpg'');
END;

-- 2. Phalaenopsis White (SQLQuery1.sql)
IF NOT EXISTS (SELECT 1 FROM dbo.Orchid WHERE OrchidName = N''Phalaenopsis White'' AND OrchidCategory = N''Phalaenopsis'' AND OrchidURL = N''https://example.com/orchid2.jpg'')
BEGIN
    INSERT INTO dbo.Orchid (OrchidName, IsNatural, OrchidDescription, OrchidCategory, IsAttractive, OrchidURL)
    VALUES (N''Phalaenopsis White'', 1, N''White moth orchid'', N''Phalaenopsis'', 1, N''https://example.com/orchid2.jpg'');
END;

-- 3. Dendrobium Purple (SQLQuery1.sql)
IF NOT EXISTS (SELECT 1 FROM dbo.Orchid WHERE OrchidName = N''Dendrobium Purple'' AND OrchidCategory = N''Dendrobium'' AND OrchidURL = N''https://example.com/orchid3.jpg'')
BEGIN
    INSERT INTO dbo.Orchid (OrchidName, IsNatural, OrchidDescription, OrchidCategory, IsAttractive, OrchidURL)
    VALUES (N''Dendrobium Purple'', 1, N''Purple dendrobium orchid'', N''Dendrobium'', 0, N''https://example.com/orchid3.jpg'');
END;

-- 4. White Phalaenopsis (SQLQuery2.sql)
IF NOT EXISTS (SELECT 1 FROM dbo.Orchid WHERE OrchidName = N''White Phalaenopsis'' AND OrchidCategory = N''Phalaenopsis'' AND OrchidURL = N''https://upload.wikimedia.org/wikipedia/commons/4/49/Phalaenopsis_Orchid.jpg'')
BEGIN
    INSERT INTO dbo.Orchid (OrchidName, IsNatural, OrchidDescription, OrchidCategory, IsAttractive, OrchidURL)
    VALUES (N''White Phalaenopsis'', 1, N''White Phalaenopsis moth orchid with a dark pink and yellow center.'', N''Phalaenopsis'', 1, N''https://upload.wikimedia.org/wikipedia/commons/4/49/Phalaenopsis_Orchid.jpg'');
END;

-- 5. Cattleya Trianaei (SQLQuery2.sql)
IF NOT EXISTS (SELECT 1 FROM dbo.Orchid WHERE OrchidName = N''Cattleya Trianaei'' AND OrchidCategory = N''Cattleya'' AND OrchidURL = N''https://cdn.shopify.com/s/files/1/0959/4313/1445/files/75c23c75-bbc0-4990-89e7-880ca1ae398a__83491.jpg?v=1774571823'')
BEGIN
    INSERT INTO dbo.Orchid (OrchidName, IsNatural, OrchidDescription, OrchidCategory, IsAttractive, OrchidURL)
    VALUES (N''Cattleya Trianaei'', 1, N''Large pale lavender Cattleya orchid with a ruffled magenta and yellow lip.'', N''Cattleya'', 1, N''https://cdn.shopify.com/s/files/1/0959/4313/1445/files/75c23c75-bbc0-4990-89e7-880ca1ae398a__83491.jpg?v=1774571823'');
END;

-- 6. Pink Dendrobium (SQLQuery2.sql)
IF NOT EXISTS (SELECT 1 FROM dbo.Orchid WHERE OrchidName = N''Pink Dendrobium'' AND OrchidCategory = N''Dendrobium'' AND OrchidURL = N''https://4.bp.blogspot.com/-_Ny7GGEcHVM/Vh0DIHcewVI/AAAAAAAAAN8/lT07yDlah8Q/s1600/Dendrobium%2BOrchid%2BCare.jpg'')
BEGIN
    INSERT INTO dbo.Orchid (OrchidName, IsNatural, OrchidDescription, OrchidCategory, IsAttractive, OrchidURL)
    VALUES (N''Pink Dendrobium'', 1, N''Pink and white Dendrobium orchid with clusters of flowers along the stem.'', N''Dendrobium'', 1, N''https://4.bp.blogspot.com/-_Ny7GGEcHVM/Vh0DIHcewVI/AAAAAAAAAN8/lT07yDlah8Q/s1600/Dendrobium%2BOrchid%2BCare.jpg'');
END;

-- 7. Cooktown Orchid (SQLQuery2.sql)
IF NOT EXISTS (SELECT 1 FROM dbo.Orchid WHERE OrchidName = N''Cooktown Orchid'' AND OrchidCategory = N''Dendrobium'' AND OrchidURL = N''https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Cooktown_orchids_and_bud.jpg/500px-Cooktown_orchids_and_bud.jpg'')
BEGIN
    INSERT INTO dbo.Orchid (OrchidName, IsNatural, OrchidDescription, OrchidCategory, IsAttractive, OrchidURL)
    VALUES (N''Cooktown Orchid'', 1, N''Purple Cooktown orchid, also known as Dendrobium bigibbum.'', N''Dendrobium'', 1, N''https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Cooktown_orchids_and_bud.jpg/500px-Cooktown_orchids_and_bud.jpg'');
END;

-- 8. Lady Slipper Orchid (SQLQuery2.sql)
IF NOT EXISTS (SELECT 1 FROM dbo.Orchid WHERE OrchidName = N''Lady Slipper Orchid'' AND OrchidCategory = N''Paphiopedilum'' AND OrchidURL = N''https://secretgarden.ro/cdn/shop/products/image_71cd5445-7480-42e6-a6ad-c091e4097dd4.jpg?v=1676106611&width=3840'')
BEGIN
    INSERT INTO dbo.Orchid (OrchidName, IsNatural, OrchidDescription, OrchidCategory, IsAttractive, OrchidURL)
    VALUES (N''Lady Slipper Orchid'', 1, N''Paphiopedilum orchid characterized by its distinctive slipper-shaped pouch.'', N''Paphiopedilum'', 1, N''https://secretgarden.ro/cdn/shop/products/image_71cd5445-7480-42e6-a6ad-c091e4097dd4.jpg?v=1676106611&width=3840'');
END;

-- 9. Dancing Lady Orchid (SQLQuery2.sql)
IF NOT EXISTS (SELECT 1 FROM dbo.Orchid WHERE OrchidName = N''Dancing Lady Orchid'' AND OrchidCategory = N''Oncidium'' AND OrchidURL = N''https://images.squarespace-cdn.com/content/v1/64c524cb6ca49752316125a9/a2f5f5f8-1a23-4289-a9fc-f974043c9431/Oncidium%2BAlliance.jpg?format=2500w'')
BEGIN
    INSERT INTO dbo.Orchid (OrchidName, IsNatural, OrchidDescription, OrchidCategory, IsAttractive, OrchidURL)
    VALUES (N''Dancing Lady Orchid'', 1, N''Yellow Oncidium orchid whose flowers resemble dancing ladies.'', N''Oncidium'', 1, N''https://images.squarespace-cdn.com/content/v1/64c524cb6ca49752316125a9/a2f5f5f8-1a23-4289-a9fc-f974043c9431/Oncidium%2BAlliance.jpg?format=2500w'');
END;

-- 10. Orange Epidendrum (SQLQuery2.sql)
IF NOT EXISTS (SELECT 1 FROM dbo.Orchid WHERE OrchidName = N''Orange Epidendrum'' AND OrchidCategory = N''Epidendrum'' AND OrchidURL = N''https://media.casaegiardino.it/images/2024/09/epidendrum-07.jpg'')
BEGIN
    INSERT INTO dbo.Orchid (OrchidName, IsNatural, OrchidDescription, OrchidCategory, IsAttractive, OrchidURL)
    VALUES (N''Orange Epidendrum'', 1, N''Orange Epidendrum orchid with clusters of vivid orange and yellow flowers.'', N''Epidendrum'', 1, N''https://media.casaegiardino.it/images/2024/09/epidendrum-07.jpg'');
END;

-- 11. Miltonia Pansy Orchid (SQLQuery2.sql)
IF NOT EXISTS (SELECT 1 FROM dbo.Orchid WHERE OrchidName = N''Miltonia Pansy Orchid'' AND OrchidCategory = N''Miltonia'' AND OrchidURL = N''https://www.mainau.de/sites/default/files/styles/squared_small/public/2025-03/5-miltonia-vko.jpg.webp?itok=-Ehee3V5'')
BEGIN
    INSERT INTO dbo.Orchid (OrchidName, IsNatural, OrchidDescription, OrchidCategory, IsAttractive, OrchidURL)
    VALUES (N''Miltonia Pansy Orchid'', 1, N''Magenta and white Miltonia orchid commonly known as the pansy orchid.'', N''Miltonia'', 1, N''https://www.mainau.de/sites/default/files/styles/squared_small/public/2025-03/5-miltonia-vko.jpg.webp?itok=-Ehee3V5'');
END;

-- 12. Yellow Cymbidium (SQLQuery2.sql)
IF NOT EXISTS (SELECT 1 FROM dbo.Orchid WHERE OrchidName = N''Yellow Cymbidium'' AND OrchidCategory = N''Cymbidium'' AND OrchidURL = N''https://www.trianglenursery.co.uk/pictures/products/medium/CYMBIDIUM-ORCHID-COOKSBRIDGE-60cm.jpg'')
BEGIN
    INSERT INTO dbo.Orchid (OrchidName, IsNatural, OrchidDescription, OrchidCategory, IsAttractive, OrchidURL)
    VALUES (N''Yellow Cymbidium'', 1, N''Yellow Cymbidium orchid with deep red markings on the flower lip.'', N''Cymbidium'', 1, N''https://www.trianglenursery.co.uk/pictures/products/medium/CYMBIDIUM-ORCHID-COOKSBRIDGE-60cm.jpg'');
END;

-- 13. Pink Veined Phalaenopsis (SQLQuery2.sql)
IF NOT EXISTS (SELECT 1 FROM dbo.Orchid WHERE OrchidName = N''Pink Veined Phalaenopsis'' AND OrchidCategory = N''Phalaenopsis Hybrid'' AND OrchidURL = N''https://www.biosphaere-potsdam.de/fileadmin/_processed_/b/b/csm_Online-Ratespiel_Motiv-Phalaenopsis_1500px_0678bbccf0.jpg'')
BEGIN
    INSERT INTO dbo.Orchid (OrchidName, IsNatural, OrchidDescription, OrchidCategory, IsAttractive, OrchidURL)
    VALUES (N''Pink Veined Phalaenopsis'', 0, N''Cultivated Phalaenopsis hybrid with pink veins and a deep magenta center.'', N''Phalaenopsis Hybrid'', 1, N''https://www.biosphaere-potsdam.de/fileadmin/_processed_/b/b/csm_Online-Ratespiel_Motiv-Phalaenopsis_1500px_0678bbccf0.jpg'');
END;
';

EXEC sp_executesql @SeedSql;
PRINT N'[INFO] Seed insertion batch finished successfully.';
GO

-- STEP 6: Final Verification (Read-Only)
-- Guarded dynamically so that client tools like SSMS that advance past an error in Step 4
-- will not fail with a query compilation error if the table or columns are missing.
IF OBJECT_ID(N'dbo.Orchid', N'U') IS NOT NULL
   AND COL_LENGTH(N'dbo.Orchid', N'IsNatural') IS NOT NULL
   AND COL_LENGTH(N'dbo.Orchid', N'IsAttractive') IS NOT NULL
BEGIN
    PRINT N'============================================================================';
    PRINT N'[SUMMARY] Setup complete. Current dbo.Orchid dataset status:';
    EXEC sp_executesql N'
    SELECT
        COUNT(*) AS TotalOrchids,
        SUM(CASE WHEN IsNatural = 1 THEN 1 ELSE 0 END) AS NaturalCount,
        SUM(CASE WHEN IsNatural = 0 THEN 1 ELSE 0 END) AS HybridCount,
        SUM(CASE WHEN IsAttractive = 1 THEN 1 ELSE 0 END) AS AttractiveCount
    FROM dbo.Orchid;';
    PRINT N'============================================================================';
END
ELSE
BEGIN
    PRINT N'[WARNING] Summary skipped: dbo.Orchid table is missing or schema is incompatible.';
END
GO
