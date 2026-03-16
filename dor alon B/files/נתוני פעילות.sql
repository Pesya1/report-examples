-- all


select 
  -- חוב בפיגןור
 acnt_pmnt_blnc_func_cog ( CUSTS.FIRM_CODE ,CUSTS.ACNT_CODE,CUSTS.CUR_CODE,sysdate) as debt,

    
     -- חוב מזומן
    ACNTS.BILLS_EDEBIT_IN_ACUR * -1 AS cash_debt,

-- אובליגו מנוצל
    --fu_amnt_open_blnc(CUSTS.FIRM_CODE, CUSTS.ACNT_CODE, CUSTS.CUR_CODE) as acnt_pmnt_blnc,
    --   get_cheques_fnc_cog(FIRMS.FIRM_CODE, CUSTS.ACNT_CODE, SYSDATE) as acnt_chq,
        
        
        
        ACNTS.BILLS_EDEBIT_IN_FCUR as open_ship_amnt



from custs 
left join ACNTS on CUSTS.FIRM_CODE=ACNTS.FIRM_CODE and CUSTS.ACNT_CODE=ACNTS.ACNT_CODE
where CUSTS.FIRM_CODE=21
 and CUSTS.CUST_CODE='1';






-- חוב בפיגןור

select   acnt_pmnt_blnc_func_cog ( "CUSTS"."FIRM_CODE" ,"CUSTS"."ACNT_CODE","CUSTS"."CUR_CODE",sysdate) as debt
from custs 
left join ACNTS on CUSTS.FIRM_CODE=ACNTS.FIRM_CODE and CUSTS.ACNT_CODE=ACNTS.ACNT_CODE
where CUSTS.FIRM_CODE=21
 and CUSTS.CUST_CODE='1';




 



-- חוב מזומן
    ACNTS.BILLS_EDEBIT_IN_ACUR * -1 AS cash_debt

-- orginal:

if {CUSTS.VAT_TYPE}='ח' then

{ACNTS.BILLS_EDEBIT_IN_ACUR}*(-1)*(1+{@vat})

else

{ACNTS.BILLS_EDEBIT_IN_ACUR}*(-1)


@vat=0
if {@is_func_enbl}=1 then
ToNumber(GetVatPcnt(ToText(1),ToText(1),ToText(CurrentDate),ToText(0) ))/100
else 0
 
@is_func_enbl=0



 


-- אובליגו מנוצל עם סינון חברה ולקוח
SELECT
        fu_amnt_open_blnc(CUSTS.FIRM_CODE, CUSTS.ACNT_CODE, CUSTS.CUR_CODE) as acnt_pmnt_blnc,
        get_cheques_fnc_cog(FIRMS.FIRM_CODE, CUSTS.ACNT_CODE, SYSDATE) as acnt_chq,
        ACNTS.BILLS_EDEBIT_IN_FCUR as open_ship_amnt
FROM CUSTS
JOIN FIRMS ON CUSTS.FIRM_CODE = FIRMS.FIRM_CODE
LEFT JOIN ACNTS ON CUSTS.FIRM_CODE = ACNTS.FIRM_CODE AND CUSTS.ACNT_CODE = ACNTS.ACNT_CODE
WHERE CUSTS.FIRM_CODE = 40
    AND CUSTS.CUST_CODE = '03220174';

{%acnt_pmnt_blnc}=fu_amnt_open_blnc ( "CUSTS"."FIRM_CODE" ,"CUSTS"."ACNT_CODE","CUSTS"."CUR_CODE")

@acnt_chq=get_cheques_fnc_cog (   "FIRMS"."FIRM_CODE",  "CUSTS"."ACNT_CODE",   SYSDATE)

 

{@open_ship_amnt}=if (isNull({%vat_prcnt}) or {%vat_prcnt} = 0) then  {ACNTS.BILLS_EDEBIT_IN_FCUR} else {ACNTS.BILLS_EDEBIT_IN_FCUR}*(100+{%vat_prcnt})/100

 
vat_prcnt=0
 


 --
 select
 fu_amnt_open_blnc ( "CUSTS"."FIRM_CODE" ,"CUSTS"."ACNT_CODE","CUSTS"."CUR_CODE")
 from custs
 where CUSTS.FIRM_CODE=21
  and CUSTS.CUST_CODE='1';

 
select "PRMNT_ACNTNG_TRNS"."CONTRA_ACNT", "PRMNT_ACNTNG_TRNS"."FIRM_CODE", "PRMNT_ACNTNG_TRNS"."DOC_NBR", 
"PRMNT_ACNTNG_TRNS"."BLNC_YEAR", "PRMNT_ACNTNG_TRNS"."EVNT_DATE", "PRMNT_ACNTNG_TRNS"."AMNT", 
"ACNTS"."ACNT_SHRT_NAME", "PRMNT_ACNTNG_TRNS"."CONTRA_ACNT", "PRMNT_ACNTNG_TRNS"."DTLS", 
"PRMNT_ACNTNG_TRNS"."DTLS2" from "PRMNT_ACNTNG_TRNS" inner join "ACNTS"
 on ("PRMNT_ACNTNG_TRNS"."FIRM_CODE" = "ACNTS"."FIRM_CODE" and "PRMNT_ACNTNG_TRNS"."CONTRA_ACNT" = "ACNTS"."ACNT_CODE") 
 inner join "CUSTS" on ("PRMNT_ACNTNG_TRNS"."FIRM_CODE" = "CUSTS"."FIRM_CODE" and "PRMNT_ACNTNG_TRNS"."ACNT_CODE" = "CUSTS"."ACNT_CODE") 
 where "PRMNT_ACNTNG_TRNS"."FIRM_CODE" = 40 and "PRMNT_ACNTNG_TRNS"."PRMY_TRNS_CLSS" in (217, 222) and "PRMNT_ACNTNG_TRNS"."LINE_SIGN" = 1
 and "CUSTS"."CUST_CODE" ='03220174'
  order by "PRMNT_ACNTNG_TRNS"."FIRM_CODE" asc, "PRMNT_ACNTNG_TRNS"."BLNC_YEAR" asc, "PRMNT_ACNTNG_TRNS"."DOC_NBR" asc
 
 
  bindings: [ 18, 217, 222, 1, '1' ]
}