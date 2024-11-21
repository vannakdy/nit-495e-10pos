-- Show Foreign Keys in a Table

SELECT 
    CONSTRAINT_NAME AS fk_name,
    TABLE_NAME AS table_name,
    COLUMN_NAME AS column_name,
    REFERENCED_TABLE_NAME AS referenced_table,
    REFERENCED_COLUMN_NAME AS referenced_column
FROM 
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE 
    TABLE_SCHEMA = 'pos-nit' 
    --AND TABLE_NAME = 'order_detail'
    AND REFERENCED_TABLE_NAME IS NOT NULL;
