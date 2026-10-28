/*
    Slot 20 Orchid House database schema
    Matches backend/src/main/java/com/orchidhouse/model/Category.java
    and backend/src/main/java/com/orchidhouse/model/Orchid.java.

    Run this script in SQL Server Management Studio or sqlcmd.
    The Spring Boot local profile can then connect to database orchid_management.
*/

USE [master];
GO

IF DB_ID(N'orchid_management') IS NULL
BEGIN
    EXEC(N'CREATE DATABASE [orchid_management]');
END;
GO

USE [orchid_management];
GO

IF OBJECT_ID(N'dbo.categories', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[categories]
    (
        [category_id] BIGINT IDENTITY(1,1) NOT NULL,
        [category_name] NVARCHAR(80) NOT NULL,
        CONSTRAINT [PK_categories] PRIMARY KEY CLUSTERED ([category_id]),
        CONSTRAINT [UK_categories_category_name] UNIQUE ([category_name])
    );
END;
GO

IF OBJECT_ID(N'dbo.orchids', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[orchids]
    (
        [orchid_id] BIGINT IDENTITY(1,1) NOT NULL,
        [orchid_name] NVARCHAR(120) NOT NULL,
        [orchid_description] NVARCHAR(1000) NULL,
        [orchid_url] NVARCHAR(500) NULL,
        [price] DECIMAL(12,2) NOT NULL,
        [is_natural] BIT NOT NULL,
        [category_id] BIGINT NOT NULL,
        CONSTRAINT [PK_orchids] PRIMARY KEY CLUSTERED ([orchid_id]),
        CONSTRAINT [FK_orchids_categories]
            FOREIGN KEY ([category_id]) REFERENCES [dbo].[categories] ([category_id])
    );
END;
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes
    WHERE [name] = N'IX_orchids_category_id'
      AND [object_id] = OBJECT_ID(N'dbo.orchids')
)
BEGIN
    CREATE INDEX [IX_orchids_category_id] ON [dbo].[orchids] ([category_id]);
END;
GO
