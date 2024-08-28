


   select   fu_ys_towed_doc_data(
	       "lgstc_actl_trns"."firm_code",
	       "lgstc_actl_trns"."prmy_trns_clss",
	       "lgstc_actl_trns"."doc_nbr",
	       "lgstc_actl_trns"."line_nbr",
	       "lgstc_actl_trns"."prmy_trns_clss"
       )
       from dual;


	   SELECT "LGSTC_ACTL_TRNS"."SPLR_CODE" FROM LGSTC_ACTL_TRNS;


	   select LINE_TRNS_STAT from xlgstc_frcst
	   where doc_nbr=133000134;


	     select LINE_TRNS_STAT from lgstc_frcst_trns
	   where doc_nbr=133000134;

	   	     select * from lgstc_frcst_docs
	   where doc_nbr=133000134;