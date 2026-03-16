-- Stage 1: Customer Transactions with Agents and Entities
-- עבור שורת כותרת
-- This stage combines CUSTS, VU_PARTS_TRNS, FIRMS, AGNTS, and ENTITIES tables
SELECT 
    -- CUSTS fields
    "CUSTS"."CUST_LONG_DSCR",-- שם לקוח
    "CUSTS"."CUST_CODE",-- קוד לקוח
    "CUSTS"."FIRM_CODE",
    "CUSTS"."CRE_DATE",-- תחילת עבודה
    "CUSTS"."ENT_CODE",-- קוד ישות
    "CUSTS"."AGNT_CODE",
    
    -- VU_PARTS_TRNS fields
    "VU_PARTS_TRNS"."PART_CODE",
    "VU_PARTS_TRNS"."TOT_AMNT",
    "VU_PARTS_TRNS"."CUST_CODE" as "VU_PARTS_TRNS_CUST_CODE",
    
    -- FIRMS fields
    "FIRMS"."FIRM_LONG_NAME",-- שם חברה
    "FIRMS"."FIRM_CODE" as "FIRMS_FIRM_CODE",-- קוד חברה
    
    -- AGNTS fields (סוכנים)
    "AGNTS"."CUST_LONG_DSCR" as "AGNT_CUST_LONG_DSCR",-- שם סוכן
    "AGNTS"."CUST_CODE" as "AGNT_CUST_CODE",-- קוד סוכן
    
    -- ENTITIES fields (יישויות)
    "ENTITIES"."ENT_LONG_NAME",-- שם יישות
    "ENTITIES"."ENT_CODE" as "ENTITIES_ENT_CODE"-- קוד יישות

FROM "DBTRANS"."CUSTS" "CUSTS" 
    INNER JOIN "DBTRANS"."VU_PARTS_TRNS" "VU_PARTS_TRNS" 
        ON ("CUSTS"."CUST_CODE"="VU_PARTS_TRNS"."CUST_CODE") 
        AND ("CUSTS"."FIRM_CODE"="VU_PARTS_TRNS"."FIRM_CODE")
    INNER JOIN "DBTRANS"."FIRMS" "FIRMS" 
        ON "CUSTS"."FIRM_CODE"="FIRMS"."FIRM_CODE"
    -- LEFT OUTER JOIN with AGNTS (סוכנים) - אופציונלי
    LEFT OUTER JOIN "DBTRANS"."CUSTS" "AGNTS" 
        ON ("CUSTS"."FIRM_CODE" = "AGNTS"."FIRM_CODE") 
        AND ("CUSTS"."AGNT_CODE" = "AGNTS"."CUST_CODE")
    -- LEFT OUTER JOIN with ENTITIES (יישויות) - אופציונלי
    LEFT OUTER JOIN "DBTRANS"."ENTITIES" "ENTITIES" 
        ON "CUSTS"."ENT_CODE" = "ENTITIES"."ENT_CODE"

WHERE 
--"VU_PARTS_TRNS"."TOT_AMNT" > 0 AND
     "CUSTS"."FIRM_CODE" = 21
    AND "CUSTS"."CUST_CODE" = '1'

ORDER BY "CUSTS"."CUST_LONG_DSCR";

-- ====================================================================

-- Stage 2: Parts Details (Depends on parts from Stage 1)
-- This stage gets PARTS, MODL_NAMES, and VU_CRSTL_PART_H95 details
SELECT 
    -- PARTS fields
    "PARTS"."PART_CODE",-- קוד פריט
    "PARTS"."ACTV_Y_N",
    "PARTS"."PART_LONG_NAME",-- שם פריט 
    "PARTS"."FIRM_CODE",
    
    -- VU_PARTS_TRNS fields
    "VU_PARTS_TRNS"."TOT_AMNT",
    "VU_PARTS_TRNS"."CUST_CODE",
    
    -- MODL_NAMES fields
    "MODL_NAMES"."MODL_CODE",
    "MODL_NAMES"."MODL_NAME",
    
    -- VU_CRSTL_PART_H95 fields
    "VU_CRSTL_PART_H95"."PART_H95_CODE"

FROM "DBTRANS"."PARTS" "PARTS"
    INNER JOIN "DBTRANS"."VU_PARTS_TRNS" "VU_PARTS_TRNS"
        ON ("PARTS"."PART_CODE" = "VU_PARTS_TRNS"."PART_CODE")
        AND ("PARTS"."FIRM_CODE" = "VU_PARTS_TRNS"."FIRM_CODE")
    LEFT OUTER JOIN "DBTRANS"."MODL_NAMES" "MODL_NAMES" 
        ON ("PARTS"."PART_CODE"="MODL_NAMES"."PART_CODE") 
        AND ("PARTS"."FIRM_CODE"="MODL_NAMES"."FIRM_CODE")
    LEFT OUTER JOIN "DBTRANS"."VU_CRSTL_PART_H95" "VU_CRSTL_PART_H95" 
        ON ("PARTS"."FIRM_CODE"="VU_CRSTL_PART_H95"."FIRM_CODE") 
        AND ("PARTS"."PART_CODE"="VU_CRSTL_PART_H95"."PART_CODE")

WHERE "VU_PARTS_TRNS"."TOT_AMNT" > 0
    AND "PARTS"."FIRM_CODE" = 21
    -- This can be filtered by specific customer if needed:
     AND "VU_PARTS_TRNS"."CUST_CODE" = '1'

ORDER BY "PARTS"."PART_CODE", "MODL_NAMES"."MODL_CODE";

-- ====================================================================

-- ORIGINAL QUERY (formatted for readability):
-- השאילתה המקורית מחולקת לשורות קריאות

SELECT 
    -- Fields from CUSTS (לקוחות)
    "CUSTS"."CUST_LONG_DSCR",              -- שם לקוח
    "CUSTS"."CUST_CODE",                   -- קוד לקוח
    "CUSTS"."FIRM_CODE",                   -- קוד חברה 
    "CUSTS"."CRE_DATE",                    -- תאריך עבודה
    "CUSTS"."ENT_CODE",                    -- קוד יישות
    
    -- Fields from AGNTS (סוכנים)
    "AGNTS"."CUST_LONG_DSCR",             -- שם סוכן
    
    -- Fields from FIRMS (חברות)
    "FIRMS"."FIRM_LONG_NAME",              -- שם חברה
    "FIRMS"."FIRM_CODE",                   -- קוד חברה
    
    -- Fields from ENTITIES (יישויות)
    "ENTITIES"."ENT_LONG_NAME",            -- שם יישות
    
    -- Fields from PARTS (פריטים)
    "PARTS"."PART_CODE",                   -- קוד פריט
    "PARTS"."ACTV_Y_N",                    -- פעיל כן/לא
    "PARTS"."PART_LONG_NAME",              -- שם פריט
    
    -- Fields from VU_PARTS_TRNS (עסקאות פריטים)
    "VU_PARTS_TRNS"."PART_CODE",          -- קוד פריט מעסקאות
    "VU_PARTS_TRNS"."TOT_AMNT",           -- סכום כולל
    
    -- Fields from MODL_NAMES (שמות דגמים)
    "MODL_NAMES"."MODL_CODE",             -- קוד דגם
    "MODL_NAMES"."MODL_NAME",             -- שם דגם
    
    -- Fields from VU_CRSTL_PART_H95
    "VU_CRSTL_PART_H95"."PART_H95_CODE"   -- קוד H95

FROM 
    -- Main table: CUSTS (לקוחות)
    "DBTRANS"."CUSTS" "CUSTS" 
    
    -- INNER JOIN with VU_PARTS_TRNS (עסקאות פריטים) - חיובי
    INNER JOIN "DBTRANS"."VU_PARTS_TRNS" "VU_PARTS_TRNS" 
        ON ("CUSTS"."CUST_CODE" = "VU_PARTS_TRNS"."CUST_CODE") 
        AND ("CUSTS"."FIRM_CODE" = "VU_PARTS_TRNS"."FIRM_CODE")
    
    -- INNER JOIN with FIRMS (חברות) - חיובי  
    INNER JOIN "DBTRANS"."FIRMS" "FIRMS" 
        ON "CUSTS"."FIRM_CODE" = "FIRMS"."FIRM_CODE"
    
    -- LEFT OUTER JOIN with AGNTS (סוכנים) - אופציונלי
    LEFT OUTER JOIN "DBTRANS"."CUSTS" "AGNTS" 
        ON ("CUSTS"."FIRM_CODE" = "AGNTS"."FIRM_CODE") 
        AND ("CUSTS"."AGNT_CODE" = "AGNTS"."CUST_CODE")
    
    -- LEFT OUTER JOIN with ENTITIES (יישויות) - אופציונלי
    LEFT OUTER JOIN "DBTRANS"."ENTITIES" "ENTITIES" 
        ON "CUSTS"."ENT_CODE" = "ENTITIES"."ENT_CODE"
    
    -- INNER JOIN with PARTS (פריטים) - חיובי
    INNER JOIN "DBTRANS"."PARTS" "PARTS" 
        ON ("VU_PARTS_TRNS"."FIRM_CODE" = "PARTS"."FIRM_CODE") 
        AND ("VU_PARTS_TRNS"."PART_CODE" = "PARTS"."PART_CODE")
    
    -- LEFT OUTER JOIN with MODL_NAMES (שמות דגמים) - אופציונלי
    LEFT OUTER JOIN "DBTRANS"."MODL_NAMES" "MODL_NAMES" 
        ON (("VU_PARTS_TRNS"."MODL_CODE" = "MODL_NAMES"."MODL_CODE") 
        AND ("VU_PARTS_TRNS"."PART_CODE" = "MODL_NAMES"."PART_CODE")) 
        AND ("VU_PARTS_TRNS"."FIRM_CODE" = "MODL_NAMES"."FIRM_CODE")
    
    -- LEFT OUTER JOIN with VU_CRSTL_PART_H95 - אופציונלי
    LEFT OUTER JOIN "DBTRANS"."VU_CRSTL_PART_H95" "VU_CRSTL_PART_H95" 
        ON ("PARTS"."FIRM_CODE" = "VU_CRSTL_PART_H95"."FIRM_CODE") 
        AND ("PARTS"."PART_CODE" = "VU_CRSTL_PART_H95"."PART_CODE")

WHERE 
    "VU_PARTS_TRNS"."TOT_AMNT" > 0         -- רק עסקאות עם סכום חיובי

ORDER BY 
    "CUSTS"."CUST_LONG_DSCR",              -- מיון לפי שם לקוח
    "PARTS"."PART_CODE",                   -- ואז לפי קוד פריט
    "MODL_NAMES"."MODL_CODE";              -- ואז לפי קוד דגם

-- ====================================================================

-- ORIGINAL QUERY (compact version for reference):
/*
SELECT "CUSTS"."CUST_LONG_DSCR", "CUSTS"."CUST_CODE", "PARTS"."PART_CODE", "CUSTS"."FIRM_CODE", "AGNTS"."CUST_LONG_DSCR", "VU_CRSTL_PART_H95"."PART_H95_CODE", "CUSTS"."CRE_DATE", "FIRMS"."FIRM_LONG_NAME", "CUSTS"."ENT_CODE", "ENTITIES"."ENT_LONG_NAME", "PARTS"."ACTV_Y_N", "VU_PARTS_TRNS"."PART_CODE", "VU_PARTS_TRNS"."TOT_AMNT", "MODL_NAMES"."MODL_CODE", "PARTS"."PART_LONG_NAME", "MODL_NAMES"."MODL_NAME", "FIRMS"."FIRM_CODE"
FROM   (((((("DBTRANS"."CUSTS" "CUSTS" INNER JOIN "DBTRANS"."VU_PARTS_TRNS" "VU_PARTS_TRNS" ON ("CUSTS"."CUST_CODE"="VU_PARTS_TRNS"."CUST_CODE") AND ("CUSTS"."FIRM_CODE"="VU_PARTS_TRNS"."FIRM_CODE")) INNER JOIN "DBTRANS"."FIRMS" "FIRMS" ON "CUSTS"."FIRM_CODE"="FIRMS"."FIRM_CODE") LEFT OUTER JOIN "DBTRANS"."CUSTS" "AGNTS" ON ("CUSTS"."FIRM_CODE"="AGNTS"."FIRM_CODE") AND ("CUSTS"."AGNT_CODE"="AGNTS"."CUST_CODE")) LEFT OUTER JOIN "DBTRANS"."ENTITIES" "ENTITIES" ON "CUSTS"."ENT_CODE"="ENTITIES"."ENT_CODE") INNER JOIN "DBTRANS"."PARTS" "PARTS" ON ("VU_PARTS_TRNS"."FIRM_CODE"="PARTS"."FIRM_CODE") AND ("VU_PARTS_TRNS"."PART_CODE"="PARTS"."PART_CODE")) LEFT OUTER JOIN "DBTRANS"."MODL_NAMES" "MODL_NAMES" ON (("VU_PARTS_TRNS"."MODL_CODE"="MODL_NAMES"."MODL_CODE") AND ("VU_PARTS_TRNS"."PART_CODE"="MODL_NAMES"."PART_CODE")) AND ("VU_PARTS_TRNS"."FIRM_CODE"="MODL_NAMES"."FIRM_CODE")) LEFT OUTER JOIN "DBTRANS"."VU_CRSTL_PART_H95" "VU_CRSTL_PART_H95" ON ("PARTS"."FIRM_CODE"="VU_CRSTL_PART_H95"."FIRM_CODE") AND ("PARTS"."PART_CODE"="VU_CRSTL_PART_H95"."PART_CODE")
WHERE  "VU_PARTS_TRNS"."TOT_AMNT">0
ORDER BY "CUSTS"."CUST_LONG_DSCR", "PARTS"."PART_CODE", "MODL_NAMES"."MODL_CODE"
*/
