select "LGSTC_ACTL_DOCS"."PRMY_TRNS_CLSS",
       "LGSTC_ACTL_DOCS"."EVNT_DATE",
       "LGSTC_ACTL_DOCS"."DOC_NBR",
       "LGSTC_ACTL_DOCS"."ORDR_NBR",
       "LGSTC_ACTL_DOCS"."DFLT_STRM_CODE",
       "LGSTC_ACTL_DOCS"."DFLT_TO_STRM_CODE",
       "LGSTC_ACTL_DOCS"."TRUCK_FULL_NBR",
       "LGSTC_ACTL_DOCS"."DOC_RMRK",
       "LGSTC_ACTL_DOCS"."TRNS_STAT",
       "LGSTC_ACTL_DOCS"."FIRM_CODE",
       "LGSTC_ACTL_DOCS"."FREE_FLD_1",

        -- join doc
               "UNIT_NAMES"."UNIT_SHRT_NAME",
       "STRMS"."STRM_NAME",
       "STRMS_TO"."STRM_NAME",
       "DRIVERS"."DRIVER_NAME",
       "TRNS_CLSS_PARMS"."MAIN_SPAWN_SECND_TRNS",
       "LGSTC_TRNS_TIME"."LINE_NBR",
       "LGSTC_TRNS_TIME"."CRE_DATIME",



-- trans
       "LGSTC_ACTL_TRNS"."LINE_TRNS_STAT",
       "LGSTC_ACTL_TRNS"."PART_CODE",
       "LGSTC_ACTL_TRNS"."LINE_NBR",
       "LGSTC_ACTL_TRNS"."QNTY_1",
       "LGSTC_ACTL_TRNS"."FIRM_CODE",
       "LGSTC_ACTL_TRNS"."ORDR_NBR",
       "LGSTC_ACTL_TRNS"."ORDR_LINE_NBR",
       "LGSTC_ACTL_TRNS"."PRMY_TRNS_CLSS",
       "LGSTC_ACTL_TRNS"."DOC_NBR",
       "LGSTC_ACTL_TRNS"."LOT_NBR",
       get_part_dscr(
	       "LGSTC_ACTL_TRNS"."FIRM_CODE",
	       "LGSTC_ACTL_TRNS"."PART_CODE",
	       "LGSTC_ACTL_TRNS"."PRMY_TRNS_CLSS",
	       "LGSTC_ACTL_TRNS"."DOC_NBR",
	       "LGSTC_ACTL_TRNS"."LINE_NBR",
	       'XH',
	       '*',
	       '*'
       ) as part_xh,
       get_part_dscr(
	       "LGSTC_ACTL_TRNS"."FIRM_CODE",
	       "LGSTC_ACTL_TRNS"."PART_CODE",
	       "LGSTC_ACTL_TRNS"."PRMY_TRNS_CLSS",
	       "LGSTC_ACTL_TRNS"."DOC_NBR",
	       "LGSTC_ACTL_TRNS"."LINE_NBR",
	       'R',
	       "LGSTC_ACTL_TRNS"."SPLR_CODE",
	       "LGSTC_ACTL_TRNS"."CUST_CODE"
       ) as part_r
    --    fu_ys_towed_doc_data(
	--        "LGSTC_ACTL_TRNS"."FIRM_CODE",
	--        "LGSTC_ACTL_TRNS"."PRMY_TRNS_CLSS",
	--        "LGSTC_ACTL_TRNS"."DOC_NBR",
	--        "LGSTC_ACTL_TRNS"."LINE_NBR",
	--        "LGSTC_ACTL_TRNS"."PRMY_TRNS_CLSS"
    --    ),


  from (
	(
		(
			(
				(
					(
						(
							     "DBTRANS"."LGSTC_ACTL_DOCS" "LGSTC_ACTL_DOCS"

                                --  join trans
							 inner join "DBTRANS"."LGSTC_ACTL_TRNS" "LGSTC_ACTL_TRNS"
							on ( ( "LGSTC_ACTL_DOCS"."FIRM_CODE" = "LGSTC_ACTL_TRNS"."FIRM_CODE" )
							   and ( "LGSTC_ACTL_DOCS"."PRMY_TRNS_CLSS" = "LGSTC_ACTL_TRNS"."PRMY_TRNS_CLSS" ) )
							   and ( "LGSTC_ACTL_DOCS"."DOC_NBR" = "LGSTC_ACTL_TRNS"."DOC_NBR" )
						)
                        -- join streams
						  left outer join "DBTRANS"."STRMS" "STRMS"
						on ( "LGSTC_ACTL_DOCS"."FIRM_CODE" = "STRMS"."FIRM_CODE" )
						   and ( "LGSTC_ACTL_DOCS"."DFLT_STRM_CODE" = "STRMS"."STRM_CODE" )
					)
                    -- join streams_to
					 inner join "DBTRANS"."STRMS" "STRMS_TO"
					on ( "LGSTC_ACTL_DOCS"."FIRM_CODE" = "STRMS_TO"."FIRM_CODE" )
					   and ( "LGSTC_ACTL_DOCS"."DFLT_TO_STRM_CODE" = "STRMS_TO"."STRM_CODE" )
				)
                -- join deliveries
				  left outer join "DBTRANS"."DRIVERS" "DRIVERS"
				on "LGSTC_ACTL_DOCS"."DRIVER_CODE" = "DRIVERS"."DRIVER_CODE"
			)
            -- join TRNS_CLSS_PARMS
			 inner join "DBTRANS"."TRNS_CLSS_PARMS" "TRNS_CLSS_PARMS"
			on ( ( "LGSTC_ACTL_DOCS"."FIRM_CODE" = "TRNS_CLSS_PARMS"."FIRM_CODE" )
			   and ( "LGSTC_ACTL_DOCS"."PRMY_TRNS_CLSS" = "TRNS_CLSS_PARMS"."PRMY_TRNS_CLSS" ) )
			   and ( "LGSTC_ACTL_DOCS"."SECND_TRNS_CLSS" = "TRNS_CLSS_PARMS"."SECND_TRNS_CLSS" )
		)

        -- join LGSTC_TRNS_TIME
		 inner join "DBTRANS"."LGSTC_TRNS_TIME" "LGSTC_TRNS_TIME"
		on ( ( "LGSTC_ACTL_DOCS"."FIRM_CODE" = "LGSTC_TRNS_TIME"."FIRM_CODE" )
		   and ( "LGSTC_ACTL_DOCS"."PRMY_TRNS_CLSS" = "LGSTC_TRNS_TIME"."PRMY_TRNS_CLSS" ) )
		   and ( "LGSTC_ACTL_DOCS"."DOC_NBR" = "LGSTC_TRNS_TIME"."DOC_NBR" )
	)
   
   
-- ---   for trans--------------------------------------------------------

    -- join PARTS
	 inner join "DBTRANS"."PARTS" "PARTS"
	on ( "LGSTC_ACTL_TRNS"."FIRM_CODE" = "PARTS"."FIRM_CODE" )
	   and ( "LGSTC_ACTL_TRNS"."PART_CODE" = "PARTS"."PART_CODE" )
)
-- join UNIT_NAMES
 inner join "DBTRANS"."UNIT_NAMES" "UNIT_NAMES"
on "PARTS"."UNIT_CODE" = "UNIT_NAMES"."UNIT_CODE"
 where 
-- doc
  "LGSTC_ACTL_DOCS"."PRMY_TRNS_CLSS" = 331
   and "LGSTC_ACTL_DOCS"."TRNS_STAT" < 50
   and "LGSTC_ACTL_DOCS"."DOC_NBR" = 3138
 
--  trans
   and "LGSTC_ACTL_TRNS"."LINE_TRNS_STAT" < 50
   and "LGSTC_ACTL_TRNS"."LINE_NBR" > 0
   and "LGSTC_TRNS_TIME"."LINE_NBR" = 1
 order by "LGSTC_ACTL_DOCS"."DOC_NBR",
          "LGSTC_ACTL_TRNS"."LINE_NBR";