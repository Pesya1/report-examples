
-- Headers
--------------------------
-- sysdate = 4/12/2025

3
from_prev_year_2
=DateSerial (year(CurrentDate) - 2,1,1 )
=ADD_MONTHS(SYSDATE, -24)
select TRUNC(ADD_MONTHS(SYSDATE, -24), 'YYYY') from dual;
-- results: 04/12/2023, 
--לפני שנתיים
4
from_prev_year_1
=DateSerial (year(CurrentDate) - 1,1,1 )
=ADD_MONTHS(SYSDATE, -12)
select TRUNC(ADD_MONTHS(SYSDATE, -12), 'YYYY') from dual;
-- results: 04/12/2024
-- לפני שנה
5
monthLastYear_2
=DateSerial(year(CurrentDate)-1,month(CurrentDate)-1 ,1-1)
=ADD_MONTHS(SYSDATE, -14)
-- results: 04/10/2024
-- לפני שנה וחודשיים
6
monthLastYear_1
=DateSerial (year(CurrentDate)-1,month(CurrentDate) ,1-1 )
=ADD_MONTHS(SYSDATE, -13)
-- results: 04/11/2024
-- לפני שנה וחודש
7
monthLastYear
=DateSerial (year(CurrentDate)-1,month(CurrentDate)+1 ,1-1)
=ADD_MONTHS(SYSDATE, -12)
-- results: 04/12/2024
-- לפני שנה
8
mnthPresent_2
=DateSerial (year(CurrentDate), month(CurrentDate)-1 , 1-1 )
=ADD_MONTHS(SYSDATE, -2)
-- results: 04/10/2025
-- לפני חודשיים
9
mnthPresent_1
=DateSerial (year(CurrentDate), month(CurrentDate) ,1-1)
=ADD_MONTHS(SYSDATE, -1)
-- results: 04/11/2025
-- לפני חודש
10
mnthPresent
=DateSerial (year(CurrentDate), month(CurrentDate)+1 , 1-1 )
=SYSDATE
-- results: 04/12/2025
-- עכשיו


---------------------------------------
1
{LGSTC_ACTL_DOCS.EVNT_DATE}

2 -
@line_qnty             // =LGSTC_ACTL_TRNS.QNTY_1
{LGSTC_ACTL_TRNS.QNTY_1} *
{LGSTC_ACTL_TRNS.LINE_SIGN} * (-1) *
{@unit_cnvr_fctr}


@unit_cnvr_fctr=''




3
qnty_prev_year_2=       // 0 || @line_qnty --> LGSTC_ACTL_TRNS.QNTY_1
if {LGSTC_ACTL_DOCS.EVNT_DATE} >= {@from_prev_year_2} and
        {LGSTC_ACTL_DOCS.EVNT_DATE} <= {@to_prev_year_2} then
    {@line_qnty}
else 0

@to_prev_year_2
=DateSerial (year(CurrentDate) - 2,12,31 )
=select ADD_MONTHS(TRUNC(SYSDATE, 'YYYY'), -12) -1 from dual;
-- results: 31/12/2023
-- סוף לפני שנתיים

4
qnty_prev_year_1=        // 0 || @line_qnty --> LGSTC_ACTL_TRNS.QNTY_1
if {LGSTC_ACTL_DOCS.EVNT_DATE} >= {@from_prev_year_1} and
        {LGSTC_ACTL_DOCS.EVNT_DATE} <= {@to_prev_year_1} then
    {@line_qnty}
else 0

@to_prev_year_1
=DateSerial (year(CurrentDate) - 1,12,31 )
=select TRUNC(SYSDATE, 'YYYY') - 1 from dual;
-- results: 31/12/2024
-- סוף השנה שעברה

5
qnty_mnth_7=
if 
DateSerial (year(CurrentDate)-1,month(CurrentDate)-1 ,1-1 )
         = {@sale_mnth} then
    {@line_qnty}
else 0
/*
monthLastYear_2
=DateSerial(year(CurrentDate)-1,month(CurrentDate)-1 ,1-1)
=ADD_MONTHS(SYSDATE, -14)
-- results: 04/10/2024
-- לפני שנה וחודשיים

*/


6
qnty_mnth_8=
if DateSerial (
        year(CurrentDate)-1,
        month(CurrentDate) ,
        1-1 ) = {@sale_mnth} then
    {@line_qnty}
else 0
/*
monthLastYear_1
=DateSerial (year(CurrentDate)-1,month(CurrentDate) ,1-1 )
=ADD_MONTHS(SYSDATE, -13)
-- results: 04/11/2024
-- לפני שנה וחודש
*/

7
qnty_mnth_9=
if DateSerial (
        year(CurrentDate)-1,
        month(CurrentDate)+1 ,
        1-1 ) = {@sale_mnth} then
    {@line_qnty}
else 0
/*
monthLastYear
=DateSerial (year(CurrentDate)-1,month(CurrentDate)+1 ,1-1)
=ADD_MONTHS(SYSDATE, -12)
-- results: 04/12/2024
-- לפני שנה
*/

8
qnty_mnth_10=
if DateSerial (
        year(CurrentDate),
        month(CurrentDate)-1 ,
        1-1 ) = {@sale_mnth} then
    {@line_qnty}
else 0
/*
mnthPresent_2
=DateSerial (year(CurrentDate), month(CurrentDate)-1 , 1-1 )
=ADD_MONTHS(SYSDATE, -2)
-- results: 04/10/2025
-- לפני חודשיים
*/

9
qnty_mnth_11=
if DateSerial (
        year(CurrentDate),
        month(CurrentDate) ,
        1-1 ) = {@sale_mnth} then
    {@line_qnty}
else 0
/*
mnthPresent_1
=DateSerial (year(CurrentDate), month(CurrentDate) ,1-1)
=ADD_MONTHS(SYSDATE, -1)
-- results: 04/11/2025
-- לפני חודש
*/

10
qnty_mnth_12=
if DateSerial (
        year(CurrentDate),
        month(CurrentDate)+1 ,
        1-1 ) = {@sale_mnth} then
    {@line_qnty}
else 0
/*
mnthPresent
=DateSerial (year(CurrentDate), month(CurrentDate)+1 , 1-1 )
=SYSDATE
-- results: 04/12/2025
-- עכשיו
*/

@sale_mnth=
DateSerial (
    year({LGSTC_ACTL_DOCS.EVNT_DATE}),
    month({LGSTC_ACTL_DOCS.EVNT_DATE}) + 1,
    1 - 1)
--

prev_year_2=Sum ({@qnty_prev_year_2}, {@sort_part_dscr})
prev_year_1=Sum ({@qnty_prev_year_1}, {@sort_part_dscr})
month_7=Sum ({@qnty_mnth_7}, {@sort_part_dscr})
month_8=Sum ({@qnty_mnth_8}, {@sort_part_dscr})
month_9=Sum ({@qnty_mnth_9}, {@sort_part_dscr})
month_10=Sum ({@qnty_mnth_10}, {@sort_part_dscr})
month_11=Sum ({@qnty_mnth_11}, {@sort_part_dscr})
month_12=Sum ({@qnty_mnth_12}, {@sort_part_dscr})


select 
part_code,part_shrt_name,
sum(qnty_prev_year_2)/100 as prev_year_2,
sum(qnty_prev_year_1)/100 as prev_year_1,
sum(qnty_mnth_7)/1000 as month_7,
sum(qnty_mnth_8)/1000 as month_8,
sum(qnty_mnth_9)/1000 as month_9,
sum(qnty_mnth_10)/1000 as month_10,
sum(qnty_mnth_11)/1000 as month_11,
sum(qnty_mnth_12)/1000 as month_12
from
(select
 EVNT_DATE,PART_SHRT_NAME,PART_CODE,QNTY_1,LINE_SIGN,line_qnty,
    -- qnty_prev_year_2
    CASE WHEN EVNT_DATE >= ADD_MONTHS(SYSDATE, -24) 
         AND EVNT_DATE <= ADD_MONTHS(TRUNC(SYSDATE, 'YYYY'), -12) -1
         THEN line_qnty 
         ELSE 0 END AS qnty_prev_year_2,
    -- qnty_prev_year_1  
    CASE WHEN EVNT_DATE >= ADD_MONTHS(SYSDATE, -12)
         AND EVNT_DATE <= TRUNC(SYSDATE, 'YYYY') - 1
         THEN line_qnty 
         ELSE 0 END AS qnty_prev_year_1,
    -- qnty_mnth_7 
    CASE WHEN TRUNC(EVNT_DATE, 'MM') = TRUNC(ADD_MONTHS(SYSDATE, -14), 'MM')
         THEN line_qnty 
         ELSE 0 END AS qnty_mnth_7,
    -- qnty_mnth_8 
    CASE WHEN TRUNC(EVNT_DATE, 'MM') = TRUNC(ADD_MONTHS(SYSDATE, -13), 'MM')
         THEN line_qnty 
         ELSE 0 END AS qnty_mnth_8,
    -- qnty_mnth_9 
    CASE WHEN TRUNC(EVNT_DATE, 'MM') = TRUNC(ADD_MONTHS(SYSDATE, -12), 'MM')
         THEN line_qnty 
         ELSE 0 END AS qnty_mnth_9,
    -- qnty_mnth_10 
    CASE WHEN TRUNC(EVNT_DATE, 'MM') = TRUNC(ADD_MONTHS(SYSDATE, -2), 'MM')
         THEN line_qnty 
         ELSE 0 END AS qnty_mnth_10,
    -- qnty_mnth_11 
    CASE WHEN TRUNC(EVNT_DATE, 'MM') = TRUNC(ADD_MONTHS(SYSDATE, -1), 'MM')
         THEN line_qnty 
         ELSE 0 END AS qnty_mnth_11,
    -- qnty_mnth_12 
    CASE WHEN TRUNC(EVNT_DATE, 'MM') = TRUNC(ADD_MONTHS(SYSDATE,0), 'MM')
         THEN line_qnty 
         ELSE 0 END AS  qnty_mnth_12

 from (
-- Stage 3: Retrieve Logistic Transaction and Part Details
-- This stage retrieves data from the LGSTC_ACTL_TRNS and PARTS tables, which depend on logistic documents and transactions
SELECT
    -- Fields from LGSTC_ACTL_TRNS table
    (LGSTC_ACTL_TRNS.QNTY_1 * LGSTC_ACTL_TRNS.LINE_SIGN * -1) as line_qnty,
    "LGSTC_ACTL_TRNS"."LINE_TRNS_STAT",
    "LGSTC_ACTL_TRNS"."LINE_SIGN",
    "LGSTC_ACTL_TRNS"."QNTY_1",
    "LGSTC_ACTL_TRNS"."PART_CODE",
    "LGSTC_ACTL_TRNS"."PRMY_TRNS_CLSS",
    "LGSTC_ACTL_TRNS"."DOC_NBR",
    -- Fields from PARTS table
    --"PARTS"."PART_CODE" as part_part_code,
    "PARTS"."PART_SHRT_NAME",
    "PARTS"."PART_LONG_NAME",
    "LGSTC_ACTL_DOCS"."EVNT_DATE"
FROM
    "DBTRANS"."LGSTC_ACTL_TRNS" "LGSTC_ACTL_TRNS"
    INNER JOIN "DBTRANS"."PARTS" "PARTS"
        ON "LGSTC_ACTL_TRNS"."FIRM_CODE" = "PARTS"."FIRM_CODE"
        AND "LGSTC_ACTL_TRNS"."PART_CODE" = "PARTS"."PART_CODE"
    left join "DBTRANS"."LGSTC_ACTL_DOCS" "LGSTC_ACTL_DOCS"
        ON "LGSTC_ACTL_TRNS"."FIRM_CODE" = "LGSTC_ACTL_DOCS"."FIRM_CODE"
        AND "LGSTC_ACTL_TRNS"."PRMY_TRNS_CLSS" = "LGSTC_ACTL_DOCS"."PRMY_TRNS_CLSS"
        AND "LGSTC_ACTL_TRNS"."DOC_NBR" = "LGSTC_ACTL_DOCS"."DOC_NBR"
WHERE
    "LGSTC_ACTL_TRNS"."FIRM_CODE" = 40 -- External parameter for filtering by firm_code
    AND "LGSTC_ACTL_DOCS"."CUST_CODE" = '01010405' -- External parameter for filtering by cust_code
    AND ("LGSTC_ACTL_TRNS"."LINE_TRNS_STAT" >= 20 AND "LGSTC_ACTL_TRNS"."LINE_TRNS_STAT" <= 40)
    AND ("LGSTC_ACTL_DOCS"."PRMY_TRNS_CLSS" = 323 OR "LGSTC_ACTL_DOCS"."PRMY_TRNS_CLSS" = 325)
    AND ("LGSTC_ACTL_DOCS"."TRNS_STAT" >= 20 AND "LGSTC_ACTL_DOCS"."TRNS_STAT" <= 40)
    AND "LGSTC_ACTL_DOCS"."EVNT_DATE" >= TO_DATE('01-01-2007 00:00:00', 'DD-MM-YYYY HH24:MI:SS')
    AND ("LGSTC_ACTL_DOCS"."FREE_FLD_1" = '1' OR "LGSTC_ACTL_DOCS"."FREE_FLD_1" = '2')
)
) 
t group by part_code,part_shrt_name;


--










select 
   TO_CHAR(TRUNC(ADD_MONTHS(SYSDATE, -24), 'YYYY'), 'YYYY') AS from_prev_year_2,
    TO_CHAR(TRUNC(ADD_MONTHS(SYSDATE, -12), 'YYYY'), 'YYYY') AS from_prev_year_1,
    TO_CHAR(ADD_MONTHS(SYSDATE, -14), 'MM/YYYY') AS monthLastYear_2,
    TO_CHAR(ADD_MONTHS(SYSDATE, -13), 'MM/YYYY') AS monthLastYear_1,
    TO_CHAR(ADD_MONTHS(SYSDATE, -12), 'MM/YYYY') AS monthLatYear,
    TO_CHAR(ADD_MONTHS(SYSDATE, -2), 'MM/YYYY') AS monthPresent_2,
    TO_CHAR(ADD_MONTHS(SYSDATE, -1), 'MM/YYYY') AS monthPresent_1,
    TO_CHAR(SYSDATE, 'MM/YYYY') AS monthPresent
    -- -------------------
    -- TRUNC(SYSDATE, 'YYYY') - 1 as to_prev_year_1,
    -- ADD_MONTHS(TRUNC(SYSDATE, 'YYYY'), -12) -1 as to_prev_year_2
    from dual;