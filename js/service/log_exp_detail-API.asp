<!-- #include file="../style/AVEImgClass.asp"-->
<!-- #include file="../search/connect.asp"-->
<!-- #include file="../site/lang.asp" -->
<!-- #include file="../style/functions.asp"	 -->
<!-- #include file="../style/class.json.asp" -->
<!-- #include file="../style/class.json.util.asp" -->
<%
	call updateDictionary()
	
	Set oImg = New AVEImgClass
	cs_nid=request("cs_nid")
	cs_idc=request("cs_idc")
	cs_etf=request("cs_etf")
	cs_act=request("cs_act")
	cs_typ=request("cs_typ")
	cs_mor=request("cs_mor")
	if cs_idc<>"" then
	  id_sagt=request("id_sagt")
	  id_baseop=request("id_baseop")
	end if
	
	coskip              = request("coskip")
	typ_command         = request("typ_command")
	SQL_TYP             = request("SQL_TYP")
	id_command          = request("id_command")
	id_commandAGT       = request("id_commandAGT")
	id_command_import   = request("id_command_import")
	id_expNautic_import = request("id_expNautic_import")
	typ_table           = request("typ_table")
	nam                 = request("nam")
	
	value         = FromUTF8(base64_decode(request("val")))
	id_expNautic  = request("id_expNautic")
	id_client     = request("id_client")
	refcom        = request("refcom")
	method        = request("method")
	id_ope_com    = request("id_ope_com")
	id_client     = request("id_client")
	
	ss_id_ope     = request("ss_id_ope")
	affich_access = request("affich_access")
	typ           = request("typ")
	path          = request("dir")
	path_import   = request("path_import")
	up_com        = request("value")
	from          = request("from")

	catamaran_fleet = false
	if id_ope_com = "196" then
		catamaran_fleet = true
	end if
' ###Set Destination Function
	if typ = "importSK" then
		GetImportSkipper()
	elseif typ = "importSK_196" then
		GetImportSkipper_196()
	elseif typ = "update" then
		UpdateSkipper()
	elseif typ = "testpdf" then
		CreatePDF()
	elseif typ = "get" then
	
'		if id_ope_com = "196" then
'			GetSkipper196()
'		else
'			GetSkipper()
'		end if
		if method="export" then
			id_comm=request("id_comm")
			save_path=base64_decode(request("save_path"))
			sk_length=request("sk")
			bh_length=request("bh")
			co_length=request("co")
			am_length=request("am")
			em_length=request("em")
			
			Row1=request("Row1")
			Row2=request("Row2")
			Row3=request("Row3")
			Row4=request("Row4")
			Row1_co=request("Row1_co")
			Row2_co=request("Row2_co")
			Row3_co=request("Row3_co")
			Row4_co=request("Row4_co")		
		end if
		GetSkipper()
	elseif typ = "get_co" then
		GetSkipper196()
	elseif typ = "files" then
		GetFiles(path)
	elseif typ = "delete" then
		DeleteFiles(path)
	elseif typ = "copy" then
		CopyFiles(path)
	elseif typ = "update_command" then
		UpdateCommand()
	elseif typ = "updateRow" then
		UpdateImport()
	elseif typ = "update196" then
		UpdateImport196()
	elseif typ = "contrat" then
		Contrat_sign()
	elseif typ = "update_contrat" then
		UpdateContrat()
	end if

Function GetImportSkipper_196()

		SQL = "SELECT * "&_
					"FROM ( "&_
								   "SELECT Name, id_command, id_client, id_exp196, coskip, 0 AS typ "&_
								   "FROM ExpNautic196 "&_
								   "WHERE id_client IN ( "&id_client&" ) AND coskip="& coskip &_
						    ") AS skipper INNER JOIN ( "&_
						    "SELECT C.RefCom , C.paxlist , C.skipper , C.id_command , B.crew , CL.name , B.model , B.name2 , C.datestart , C.dateend , "&_
						    	"C.id_cab , B.id_boat , CL.id_ope , CL.id_agt , A.Company AS company_agt , O.company AS company_ope , 0 AS typ "&_
						    "FROM Command AS C INNER JOIN CommandInfo AS CI ON CI.id_command = C.id_command "&_
						                    "INNER JOIN Boat AS B ON B.id_boat = C.id_boat "&_
						                    "INNER JOIN Client AS CL ON CL.id_client = C.id_client "&_
						                    "LEFT OUTER JOIN Agent AS A ON A.id_agt = CL.id_agt "&_
						                    "INNER JOIN Operator AS O ON O.id_ope = C.id_ope "&_
						    "WHERE C.id_client = '"&id_client&"' AND C.etatfiche IN ( 0 , 4 , 6 , 16) "&_
						    ") AS Cmd ON ( Cmd.id_command = skipper.id_command AND skipper.typ = Cmd.typ ) "&_
					"WHERE datestart<getdate() "&_
					"ORDER BY cmd.dateend DESC; "
		
		if 0 then
			'response.write SQL
			'response.end
		end if
			
		rs.open SQL,cn
			if not rs.eof then
				arrTable = rs.getRows()
				cntTable = ubound(arrTable,2)
			else
				cntTable = -1
			end if
		rs.close
		
		Set	JsImport = jsArray()
		for inc = 0 to cntTable	
			Set	JsImport(null) = jsObject()
			'JsImport(null)("SQL") = SQL
			JsImport(null)("name") = noNull(array(arrTable(0,inc),""))
			JsImport(null)("id_command") = noNull(array(arrTable(1,inc),""))
			JsImport(null)("id_client") = noNull(array(arrTable(2,inc),""))
			JsImport(null)("id_expNautic") = arrTable(3,inc)
			JsImport(null)("co_skip") = noNull(array(arrTable(4,inc),""))
			JsImport(null)("boat_model") = noNull(array(arrTable(12,inc),""))
			JsImport(null)("date_start") = noNull(array(arrTable(14,inc),""))
			JsImport(null)("date_end") = noNull(array(arrTable(15,inc),""))
		next
		JsImport.Flush

end Function

Function GetImportSkipper()

		SQL = "SELECT * "&_
					"FROM ( "&_
								   "SELECT Name_skipper, FirstName_skipper, Name_equipier, FirstName_equipier, id_Command , id_expNautic, 0 AS typ "&_
								   "FROM ExpNautic "&_
								   "WHERE id_client IN ( "&id_client&" ) "&_
								   "UNION "&_
								   "SELECT Name_skipper, FirstName_skipper, Name_equipier, FirstName_equipier, id_Command , id_expNautic, 1 AS typ "&_
								   "FROM ExpNauticAgt "&_
								   "WHERE id_client IN ( "&id_client&" ) "&_
						    ") AS skipper INNER JOIN ( "&_
						    "SELECT C.RefCom , C.paxlist , C.skipper , C.id_command , B.crew , CL.name , B.model , B.name2 , C.datestart , C.dateend , "&_
						    	"C.id_cab , B.id_boat , CL.id_ope , CL.id_agt , A.Company AS company_agt , O.company AS company_ope , 0 AS typ "&_
						    "FROM Command AS C INNER JOIN CommandInfo AS CI ON CI.id_command = C.id_command "&_
						                    "INNER JOIN Boat AS B ON B.id_boat = C.id_boat "&_
						                    "INNER JOIN Client AS CL ON CL.id_client = C.id_client "&_
						                    "LEFT OUTER JOIN Agent AS A ON A.id_agt = CL.id_agt "&_
						                    "INNER JOIN Operator AS O ON O.id_ope = C.id_ope "&_
						    "WHERE C.id_client = '"&id_client&"' AND C.etatfiche IN ( 0 , 4 , 6 , 16) "&_
						    "UNION "&_
						    "SELECT C.RefCom , C.paxlist , C.skipper , C.id_command , B.crew , CL.name , B.model , B.name2 , C.datestart , C.dateend , "&_
						    	"C.id_cab , B.id_boat , CL.id_ope , CL.id_agt , A.Company AS company_agt , O.company AS company_ope , 1 AS typ "&_
						    "FROM CommandAgt AS C INNER JOIN CommandInfoAgt AS CI ON CI.id_command = C.id_command "&_
						                        "INNER JOIN Boat AS B ON B.id_boat = C.id_boat "&_
						                        "INNER JOIN Client AS CL ON CL.id_client = C.id_client "&_
						                        "LEFT OUTER JOIN Agent AS A ON A.id_agt = CL.id_agt "&_
						                        "INNER JOIN Operator AS O ON O.id_ope = C.id_ope "&_
						    "WHERE C.id_client = '"&id_client&"' AND C.etatfiche IN ( 0 , 4 , 6 , 16 ) "&_
						    ") AS Cmd ON ( Cmd.id_command = skipper.id_command AND skipper.typ = Cmd.typ ) "&_
					"WHERE datestart<getdate() "&_
					"ORDER BY cmd.dateend DESC; "
					
		if 0 then
			response.write "<textarea>" & SQL & "</textarea>"
			response.end
		end if
		
		rs.open SQL,cn
			if not rs.eof then
				arrTable = rs.getRows()
				cntTable = ubound(arrTable,2)
			else
				cntTable = -1
			end if
		rs.close
		
		Set	JsImport = jsArray()
		for inc = 0 to cntTable	
			if arrTable(6,inc) = "0" then
				typ_import = "ope"
			elseif arrTable(6,inc) = "1" then
				typ_import = "agt"
			end if
			Set	JsImport(null) = jsObject()
			'JsImport(null)("SQL") = SQL
			JsImport(null)("lastname_skipper") = noNull(array(arrTable(0,inc),""))
			JsImport(null)("firstname_skipper") = noNull(array(arrTable(1,inc),""))
			JsImport(null)("lastname_coskipper") = noNull(array(arrTable(2,inc),""))
			JsImport(null)("firstname_coskipper") = noNull(array(arrTable(3,inc),""))
			JsImport(null)("id_command") = noNull(array(arrTable(4,inc),""))
			JsImport(null)("id_expNautic") = arrTable(5,inc)
			JsImport(null)("typ") = typ_import
			JsImport(null)("boat_model") = noNull(array(arrTable(13,inc),""))
			JsImport(null)("date_start") = fd(arrTable(15,inc),session("lang"),1)
			JsImport(null)("date_end") = fd(arrTable(16,inc),session("lang"),1)
		next
		JsImport.Flush
		
End function	

Function UpdateImport196()
	if coskip&"a"="a" then coskip="0"
	if id_expNautic = "" then

		SQL = " INSERT INTO expnautic196 (id_command, Name, SkName, DDate, Q1a, Q1b, Q1c, Q1d, Q3, Q3a1, Q3b1, Q3c1, Q3d1, Q3e1, Q3f1, Q3a2, Q3b2, Q3c2, Q3d2, Q3e2, Q3f2, Q3a3, Q3b3, Q3c3, Q3d3, Q3e3, Q3f3, Q3a4, Q3b4, Q3c4, Q3d4, Q3e4, "&_
                     "Q3f4, Q4a, Q4b, Q4c, Q4d, Q5a, Q5b, Q6, Q7a, Q7b, Q7c, Q8, Q9, Q10, Q11a, Q11b, Q12, Q13a1, Q13b1, Q13c1, Q13a2, Q13b2, Q13c2, Q14a, Q14b, Q14c, Q14d, id_client, coskip) "&_
          " output inserted.id_exp196, inserted.coskip "&_
					" SELECT " & id_command & ", Name, SkName, DDate, Q1a, Q1b, Q1c, Q1d, Q3, Q3a1, Q3b1, Q3c1, Q3d1, Q3e1, Q3f1, Q3a2, Q3b2, Q3c2, Q3d2, Q3e2, Q3f2, Q3a3, Q3b3, Q3c3, Q3d3, Q3e3, Q3f3, Q3a4, Q3b4, Q3c4, Q3d4, Q3e4, "&_
                     "Q3f4, Q4a, Q4b, Q4c, Q4d, Q5a, Q5b, Q6, Q7a, Q7b, Q7c, Q8, Q9, Q10, Q11a, Q11b, Q12, Q13a1, Q13b1, Q13c1, Q13a2, Q13b2, Q13c2, Q14a, Q14b, Q14c, Q14d, id_client, coskip "&_
					" FROM expnautic196"&_
		 			" WHERE id_command in (" & id_command_import & ") "&_
		 			" AND coskip = " & coskip 
		'response.write SQL : response.end
		set rs = cn.Execute(SQL)
		if not rs.eof then
			id_expNautic = rs(0)
			coskip = rs(1)
		end if
		
	else
		
		SQL = " UPDATE e1"&_
					" SET"&_
							  " e1.Name = e2.Name, e1.SkName = e2.SkName, e1.DDate = e2.DDate, e1.Q1a = e2.Q1a, e1.Q1b = e2.Q1b, "&_
							  " e1.Q1c = e2.Q1c, e1.Q1d = e2.Q1d, e1.Q3 = e2.Q3, e1.Q3a1 = e2.Q3a1, "&_
							  " e1.Q3b1 = e2.Q3b1, e1.Q3c1 = e2.Q3c1, e1.Q3d1 = e2.Q3d1, e1.Q3e1 = e2.Q3e1, "&_
								" e1.Q3f1 = e2.Q3f1, e1.Q3a2 = e2.Q3a2, e1.Q3b2 = e2.Q3b2, e1.Q3c2 = e2.Q3c2, "&_
								" e1.Q3d2 = e2.Q3d2, e1.Q3e2 = e2.Q3e2, e1.Q3f2 = e2.Q3f2, e1.Q3a3 = e2.Q3a3, "&_
								" e1.Q3b3 = e2.Q3b3, e1.Q3c3 = e2.Q3c3, e1.Q3d3 = e2.Q3d3, e1.Q3e3 = e2.Q3e3, "&_
								" e1.Q3f3 = e2.Q3f3, e1.Q3a4 = e2.Q3a4, e1.Q3b4 = e2.Q3b4, e1.Q3c4 = e2.Q3c4, "&_
								" e1.Q3d4 = e2.Q3d4, e1.Q3e4 = e2.Q3e4, e1.Q3f4 = e2.Q3f4, e1.Q4a = e2.Q4a, "&_
								" e1.Q4b = e2.Q4b, e1.Q4c = e2.Q4c, e1.Q4d = e2.Q4d, e1.Q5a = e2.Q5a, "&_
								" e1.Q5b = e2.Q5b, e1.Q6 = e2.Q6, e1.Q7a = e2.Q7a, e1.Q7b = e2.Q7b, "&_
								" e1.Q7c = e2.Q7c, e1.Q8 = e2.Q8, e1.Q9 = e2.Q9, "&_
								" e1.Q10 = e2.Q10, e1.Q11a = e2.Q11a, e1.Q11b = e2.Q11b, e1.Q12 = e2.Q12, "&_
								" e1.Q13a1 = e2.Q13a1, e1.Q13b1 = e2.Q13b1, e1.Q13c1 = e2.Q13c1, e1.Q13a2 = e2.Q13a2, "&_
								" e1.Q13b2 = e2.Q13b2, e1.Q13c2 = e2.Q13c2, e1.Q14a = e2.Q14a, e1.Q14b = e2.Q14b, "&_
								" e1.Q14c = e2.Q14c, e1.Q14d = e2.Q14d, e1.id_client = e2.id_client "&_
					" FROM "&_
						    " ExpNautic196 AS e1 "&_
						    " INNER JOIN ExpNautic196 AS e2 "&_
						        "ON (e2.id_exp196= " & id_expNautic_import & ")"&_
					" WHERE "&_
					    	" e1.id_exp196 = " & id_expNautic &_
					" AND e1.coskip = " & coskip
		cn.Execute(SQL)
		
	end if
	Set JsValue = jsObject()
			'JsValue("SQL") = SQL
			JsValue("coskip") = coskip
			if coskip = 1 then
				JsValue("id_expNautic") = id_expNautic
			elseif coskip = 0 then
				JsValue("id_expNautic") = id_expNautic
			end if
			JsValue.Flush
	
end Function

Function UpdateImport()
	Dim IMPORT
	Dim IMPORT_TYP
	
	if typ_table = "ope" then 
		IMPORT_TYP = ""
	elseif typ_table = "agt" then
		IMPORT_TYP = "AGT"
	end if

	if typ_command = "0" then
		IMPORT = "skipper"
	elseif typ_command = "1" then
		IMPORT = "co-skipper"
	elseif typ_command = "2" then
		IMPORT = "boating-history"
	elseif typ_command = "3" then
		IMPORT = "all"
	end if
		
	if id_expNautic = "" then

			if IMPORT = "skipper" then
				SQL = " INSERT INTO expnautic" & SQL_TYP & " (id_command, Salutation_skipper, Name_skipper, FirstName_skipper, Date_naiss_skipper, Lieu_naiss_skipper, Address_skipper, ZipCode_skipper, City_skipper, Country_skipper, Tel_skipper, Mob_skipper, Fax_skipper, "&_
		                         " Email_skipper, Comment_skipper, IdentNum_skipper, Nation_skipper, licence, licence_type, licence_num, licence_off, licence_date, licence_until, licence_for, Nb_year, Nb_day, sans_equipage, have_boat, "&_
		                         " type_boat, long_boat, place_boat, address_skipperOPE, ZipCode_skipperOPE, City_skipperOPE, Country_skipperOPE, Email_skipperOPE, State_skipper, State_skipperOpe, Address2_skipper, "&_
		                         " Address2_skipperOpe, id_Client, Comment) "&_
		          " output inserted.id_expNautic "&_
							" SELECT " & id_command & ", Salutation_skipper, Name_skipper, FirstName_skipper, Date_naiss_skipper, Lieu_naiss_skipper, Address_skipper, ZipCode_skipper, City_skipper, Country_skipper, Tel_skipper, Mob_skipper, Fax_skipper, "&_
		                         " Email_skipper, Comment_skipper, IdentNum_skipper, Nation_skipper, licence, licence_type, licence_num, licence_off, licence_date, licence_until, licence_for, Nb_year, Nb_day, sans_equipage, have_boat, "&_
		                         " type_boat, long_boat, place_boat, address_skipperOPE, ZipCode_skipperOPE, City_skipperOPE, Country_skipperOPE, Email_skipperOPE, State_skipper, State_skipperOpe, Address2_skipper, "&_
		                         " Address2_skipperOpe, id_Client, Comment "&_
							" FROM expnautic" & IMPORT_TYP &_
				 			" WHERE id_command in (" & id_command_import & ") "
				 			
			elseif IMPORT = "co-skipper" then
				SQL =	" INSERT INTO expnautic" & SQL_TYP & " (id_Command, Salutation_equipier, Name_equipier, FirstName_equipier, Date_naiss_equipier, Address_equipier, ZipCode_equipier, City_equipier, Country_equipier, Tel_equipier, Fax_equipier, Email_equipier, "&_
									          " Mob_equipier, BoatOwn_Equipier, Comment_equipier, IdentNum_equipier, Nation_equipier, Nb_year_equipier, Boat_equipier, have_boat_equipier, type_boat_equipier, long_boat_equipier, place_boat_equipier, "&_
									          " address_equipierOPE, ZipCode_equipierOPE, Country_equipierOPE, Lieu_naiss_equipier, id_Client, State_equipier, State_equipierOpe, Address2_equipier, Address2_equipierOpe, City_equipierOPE) "&_
							" output inserted.id_expNautic "&_
							" SELECT " & id_command & ", Salutation_equipier, Name_equipier, FirstName_equipier, Date_naiss_equipier, Address_equipier, ZipCode_equipier, City_equipier, Country_equipier, Tel_equipier, Fax_equipier, Email_equipier, "&_
									          " Mob_equipier, BoatOwn_Equipier, Comment_equipier, IdentNum_equipier, Nation_equipier, Nb_year_equipier, Boat_equipier, have_boat_equipier, type_boat_equipier, long_boat_equipier, place_boat_equipier, "&_
									          " address_equipierOPE, ZipCode_equipierOPE, Country_equipierOPE, Lieu_naiss_equipier, id_Client, State_equipier, State_equipierOpe, Address2_equipier, Address2_equipierOpe, City_equipierOPE "&_
							" FROM expnautic" & IMPORT_TYP &_
				 			" WHERE id_command in (" & id_command_import & ") "
				 			
			elseif IMPORT = "boating-history" then
				SQL =	" INSERT INTO expnautic" & SQL_TYP & " (id_Command, id_Client, vc_chp_12, vc_chp_11, vc_chp_10, vc_chp_09, vc_chp_08, vc_chp_07, vc_chp_06, vc_chp_05, vc_chp_04, vc_chp_03, vc_chp_02, vc_chp_01, fld_int_01, fld_int_02, fld_int_03, "&_
	                         "fld_int_04, fld_text_01, fld_char_01, fld_char_02, fld_char_03, fld_char_04, fld_char_05, fld_char_06, fld_char_07, fld_char_08, fld_char_09, fld_char_10, fld_char_11, fld_char_12, fld_char_13, fld_char_14, "&_
	                         "fld_char_15, fld_char_16, fld_char_17, fld_char_18, fld_char_19, fld_char_20, fld_char_21, fld_char_22, fld_char_23, fld_char_24, fld_char_25, fld_char_26, fld_char_27, fld_char_28, fld_char_29, fld_char_30, "&_
	                         "fld_char_31, fld_char_32, fld_char_33, fld_char_34, fld_char_35, fld_char_36, fld_char_37, fld_char_38, fld_char_39, fld_char_40, fld_char_41) "&_
	            " output inserted.id_expNautic "&_
	            " SELECT " & id_command & ", id_Client, vc_chp_12, vc_chp_11, vc_chp_10, vc_chp_09, vc_chp_08, vc_chp_07, vc_chp_06, vc_chp_05, vc_chp_04, vc_chp_03, vc_chp_02, vc_chp_01, fld_int_01, fld_int_02, fld_int_03, "&_
	                         "fld_int_04, fld_text_01, fld_char_01, fld_char_02, fld_char_03, fld_char_04, fld_char_05, fld_char_06, fld_char_07, fld_char_08, fld_char_09, fld_char_10, fld_char_11, fld_char_12, fld_char_13, fld_char_14, "&_
	                         "fld_char_15, fld_char_16, fld_char_17, fld_char_18, fld_char_19, fld_char_20, fld_char_21, fld_char_22, fld_char_23, fld_char_24, fld_char_25, fld_char_26, fld_char_27, fld_char_28, fld_char_29, fld_char_30, "&_
	                         "fld_char_31, fld_char_32, fld_char_33, fld_char_34, fld_char_35, fld_char_36, fld_char_37, fld_char_38, fld_char_39, fld_char_40, fld_char_41 "&_
	            " FROM expnautic" & IMPORT_TYP &_
				 			" WHERE id_command in (" & id_command_import & ") "
				 			
			elseif IMPORT = "all" then
				SQL =	" INSERT INTO expnautic" & SQL_TYP & " (id_Command, Salutation_skipper, Name_skipper, FirstName_skipper, Date_naiss_skipper, Lieu_naiss_skipper, Address_skipper, ZipCode_skipper, City_skipper, Country_skipper, Tel_skipper, Mob_skipper, "&_
	                         " Fax_skipper, Email_skipper, Comment_skipper, IdentNum_skipper, Nation_skipper, Salutation_equipier, Name_equipier, FirstName_equipier, Date_naiss_equipier, Address_equipier, ZipCode_equipier, "&_
	                         " City_equipier, Country_equipier, Tel_equipier, Mob_equipier, Fax_equipier, Email_equipier, BoatOwn_Equipier, Comment_equipier, IdentNum_equipier, Nation_equipier, licence, licence_type, licence_num, "&_
	                         " licence_off, licence_date, licence_until, licence_for, Nb_year, Nb_year_equipier, Boat_equipier, Nb_day, sans_equipage, have_boat_equipier, type_boat_equipier, long_boat_equipier, place_boat_equipier, "&_
	                         " have_boat, type_boat, long_boat, place_boat, address_skipperOPE, ZipCode_skipperOPE, City_skipperOPE, Country_skipperOPE, Email_skipperOPE, address_equipierOPE, ZipCode_equipierOPE, "&_
	                         " City_equipierOPE, Country_equipierOPE, Comment, Lieu_naiss_equipier, id_Client, vc_chp_12, vc_chp_11, vc_chp_10, vc_chp_09, vc_chp_08, vc_chp_07, vc_chp_06, vc_chp_05, vc_chp_04, vc_chp_03, "&_
	                         " vc_chp_02, vc_chp_01, fld_int_01, fld_int_02, fld_int_03, fld_int_04, fld_text_01, fld_char_01, fld_char_02, fld_char_03, fld_char_04, fld_char_05, fld_char_06, fld_char_07, fld_char_08, fld_char_09, fld_char_10, "&_
	                         " fld_char_11, fld_char_12, fld_char_13, fld_char_14, fld_char_15, fld_char_16, fld_char_17, fld_char_18, fld_char_19, fld_char_20, fld_char_21, fld_char_22, fld_char_23, fld_char_24, fld_char_25, fld_char_26, "&_
	                         " fld_char_27, fld_char_28, fld_char_29, fld_char_30, fld_char_31, fld_char_32, fld_char_33, fld_char_34, fld_char_35, fld_char_36, fld_char_37, fld_char_38, fld_char_39, fld_char_40, fld_char_41, State_skipper, "&_
	                         " State_skipperOpe, Address2_skipper, Address2_skipperOpe, State_equipier, State_equipierOpe, Address2_equipier, Address2_equipierOpe) "&_
	            " output inserted.id_expNautic "&_
	            " SELECT " & id_command & ", Salutation_skipper, Name_skipper, FirstName_skipper, Date_naiss_skipper, Lieu_naiss_skipper, Address_skipper, ZipCode_skipper, City_skipper, Country_skipper, Tel_skipper, Mob_skipper, "&_
	                         " Fax_skipper, Email_skipper, Comment_skipper, IdentNum_skipper, Nation_skipper, Salutation_equipier, Name_equipier, FirstName_equipier, Date_naiss_equipier, Address_equipier, ZipCode_equipier, "&_
	                         " City_equipier, Country_equipier, Tel_equipier, Mob_equipier, Fax_equipier, Email_equipier, BoatOwn_Equipier, Comment_equipier, IdentNum_equipier, Nation_equipier, licence, licence_type, licence_num, "&_
	                         " licence_off, licence_date, licence_until, licence_for, Nb_year, Nb_year_equipier, Boat_equipier, Nb_day, sans_equipage, have_boat_equipier, type_boat_equipier, long_boat_equipier, place_boat_equipier, "&_
	                         " have_boat, type_boat, long_boat, place_boat, address_skipperOPE, ZipCode_skipperOPE, City_skipperOPE, Country_skipperOPE, Email_skipperOPE, address_equipierOPE, ZipCode_equipierOPE, "&_
	                         " City_equipierOPE, Country_equipierOPE, Comment, Lieu_naiss_equipier, id_Client, vc_chp_12, vc_chp_11, vc_chp_10, vc_chp_09, vc_chp_08, vc_chp_07, vc_chp_06, vc_chp_05, vc_chp_04, vc_chp_03, "&_
	                         " vc_chp_02, vc_chp_01, fld_int_01, fld_int_02, fld_int_03, fld_int_04, fld_text_01, fld_char_01, fld_char_02, fld_char_03, fld_char_04, fld_char_05, fld_char_06, fld_char_07, fld_char_08, fld_char_09, fld_char_10, "&_
	                         " fld_char_11, fld_char_12, fld_char_13, fld_char_14, fld_char_15, fld_char_16, fld_char_17, fld_char_18, fld_char_19, fld_char_20, fld_char_21, fld_char_22, fld_char_23, fld_char_24, fld_char_25, fld_char_26, "&_
	                         " fld_char_27, fld_char_28, fld_char_29, fld_char_30, fld_char_31, fld_char_32, fld_char_33, fld_char_34, fld_char_35, fld_char_36, fld_char_37, fld_char_38, fld_char_39, fld_char_40, fld_char_41, State_skipper, "&_
	                         " State_skipperOpe, Address2_skipper, Address2_skipperOpe, State_equipier, State_equipierOpe, Address2_equipier, Address2_equipierOpe "&_
	            " FROM expnautic" & IMPORT_TYP &_
				 			" WHERE id_command in (" & id_command_import & ") "
			end if
			
		set rs = cn.Execute(SQL)
		if not rs.eof then
			id_expNautic = rs(0)
		end if
		
	else
		
			if IMPORT = "skipper" then
				SQL = " UPDATE e1"&_
							" SET"&_
									  " e1.Salutation_skipper = e2.Salutation_skipper, e1.Name_skipper = e2.Name_skipper, "&_
										" e1.FirstName_skipper = e2.FirstName_skipper, e1.Date_naiss_skipper = e2.Date_naiss_skipper, "&_
										" e1.Lieu_naiss_skipper = e2.Lieu_naiss_skipper, e1.Address_skipper = e2.Address_skipper, "&_
										" e1.ZipCode_skipper = e2.ZipCode_skipper, e1.City_skipper = e2.City_skipper, "&_
										" e1.Country_skipper = e2.Country_skipper, e1.Tel_skipper = e2.Tel_skipper, "&_
										" e1.Mob_skipper = e2.Mob_skipper, e1.Fax_skipper = e2.Fax_skipper, "&_
										" e1.Email_skipper = e2.Email_skipper, e1.Comment_skipper = e2.Comment_skipper, "&_
										" e1.IdentNum_skipper = e2.IdentNum_skipper, e1.Nation_skipper = e2.Nation_skipper, "&_
										" e1.licence = e2.licence, e1.licence_type = e2.licence_type, "&_
										" e1.licence_num = e2.licence_num, e1.licence_off = e2.licence_off, "&_
										" e1.licence_date = e2.licence_date, e1.licence_until = e2.licence_until, "&_
										" e1.licence_for = e2.licence_for, e1.Nb_year = e2.Nb_year, "&_
										" e1.Nb_day = e2.Nb_day, e1.sans_equipage = e2.sans_equipage, "&_
										" e1.have_boat = e2.have_boat, e1.type_boat = e2.type_boat, "&_
										" e1.long_boat = e2.long_boat, e1.place_boat = e2.place_boat, "&_
										" e1.address_skipperOPE = e2.address_skipperOPE, e1.ZipCode_skipperOPE = e2.ZipCode_skipperOPE, "&_
										" e1.City_skipperOPE = e2.City_skipperOPE, e1.Country_skipperOPE = e2.Country_skipperOPE, "&_
										" e1.Email_skipperOPE = e2.Email_skipperOPE, e1.State_skipper = e2.State_skipper, "&_
										" e1.State_skipperOpe = e2.State_skipperOpe, e1.Address2_skipper = e2.Address2_skipper, "&_
										" e1.Address2_skipperOpe = e2.Address2_skipperOpe, e1.id_Client = e2.id_Client, "&_
										" e1.Comment = e2.Comment "&_
							" FROM "&_
								    " ExpNautic" & SQL_TYP & " AS e1 "&_
								    " INNER JOIN ExpNautic" & IMPORT_TYP & " AS e2 "&_
								        "ON (e2.id_expNautic= " & id_expNautic_import & ")"&_
							" WHERE "&_
							    	" e1.id_expNautic = " & id_expNautic
					
			elseif IMPORT = "co-skipper" then
				SQL = " UPDATE e1"&_
							" SET"&_
									  " e1.Salutation_equipier = e2.Salutation_equipier, e1.Name_equipier = e2.Name_equipier, "&_
										" e1.FirstName_equipier = e2.FirstName_equipier, e1.Date_naiss_equipier = e2.Date_naiss_equipier, "&_
										" e1.Address_equipier = e2.Address_equipier, e1.ZipCode_equipier = e2.ZipCode_equipier, "&_
										" e1.City_equipier = e2.City_equipier, e1.Country_equipier = e2.Country_equipier, "&_
										" e1.Tel_equipier = e2.Tel_equipier, e1.Fax_equipier = e2.Fax_equipier, "&_
										" e1.Email_equipier = e2.Email_equipier, e1.Mob_equipier = e2.Mob_equipier, "&_
										" e1.BoatOwn_Equipier = e2.BoatOwn_Equipier, e1.Comment_equipier = e2.Comment_equipier, "&_
										" e1.IdentNum_equipier = e2.IdentNum_equipier, e1.Nation_equipier = e2.Nation_equipier, "&_
										" e1.Nb_year_equipier = e2.Nb_year_equipier, e1.Boat_equipier = e2.Boat_equipier, "&_
										" e1.have_boat_equipier = e2.have_boat_equipier, e1.type_boat_equipier = e2.type_boat_equipier, "&_
										" e1.long_boat_equipier = e2.long_boat_equipier, e1.place_boat_equipier = e2.place_boat_equipier, "&_
										" e1.address_equipierOPE = e2.address_equipierOPE, e1.ZipCode_equipierOPE = e2.ZipCode_equipierOPE, "&_
										" e1.Country_equipierOPE = e2.Country_equipierOPE, e1.Lieu_naiss_equipier = e2.Lieu_naiss_equipier, "&_
										" e1.id_Client = e2.id_Client, e1.State_equipier = e2.State_equipier, "&_
										" e1.State_equipierOpe = e2.State_equipierOpe, e1.Address2_equipier = e2.Address2_equipier, "&_
										" e1.Address2_equipierOpe = e2.Address2_equipierOpe, e1.City_equipierOPE = e2.City_equipierOPE "&_
							" FROM "&_
								    " ExpNautic" & SQL_TYP & " AS e1 "&_
								    " INNER JOIN ExpNautic" & IMPORT_TYP & " AS e2 "&_
								        "ON (e2.id_expNautic= " & id_expNautic_import & ")"&_
							" WHERE "&_
							    	" e1.id_expNautic = " & id_expNautic
	
			elseif IMPORT = "boating-history" then
				SQL = " UPDATE e1"&_
							" SET"&_
									  " e1.vc_chp_12 = e2.vc_chp_12, e1.vc_chp_11 = e2.vc_chp_11, "&_
										" e1.vc_chp_10 = e2.vc_chp_10, e1.vc_chp_09 = e2.vc_chp_09, "&_
										" e1.vc_chp_08 = e2.vc_chp_08, e1.vc_chp_07 = e2.vc_chp_07, "&_
										" e1.vc_chp_06 = e2.vc_chp_06, e1.vc_chp_05 = e2.vc_chp_05, "&_
										" e1.vc_chp_04 = e2.vc_chp_04, e1.vc_chp_03 = e2.vc_chp_03, "&_
										" e1.vc_chp_02 = e2.vc_chp_02, e1.vc_chp_01 = e2.vc_chp_01, "&_
										" e1.fld_int_01 = e2.fld_int_01, e1.fld_int_02 = e2.fld_int_02, "&_
										" e1.fld_int_03 = e2.fld_int_03, e1.fld_int_04 = e2.fld_int_04, "&_
										" e1.fld_text_01 = e2.fld_text_01, e1.fld_char_01 = e2.fld_char_01, "&_
										" e1.fld_char_02 = e2.fld_char_02, e1.fld_char_03 = e2.fld_char_03, "&_
										" e1.fld_char_04 = e2.fld_char_04, e1.fld_char_05 = e2.fld_char_05, "&_
										" e1.fld_char_06 = e2.fld_char_06, e1.fld_char_07 = e2.fld_char_07, "&_
										" e1.fld_char_08 = e2.fld_char_08, e1.fld_char_09 = e2.fld_char_09, "&_
										" e1.fld_char_10 = e2.fld_char_10, e1.fld_char_11 = e2.fld_char_11, "&_
										" e1.fld_char_12 = e2.fld_char_12, e1.fld_char_13 = e2.fld_char_13, "&_
										" e1.fld_char_14 = e2.fld_char_14, e1.fld_char_15 = e2.fld_char_15, "&_
										" e1.fld_char_16 = e2.fld_char_16, e1.fld_char_17 = e2.fld_char_17, "&_
										" e1.fld_char_18 = e2.fld_char_18, e1.fld_char_19 = e2.fld_char_19, "&_
										" e1.fld_char_20 = e2.fld_char_20, e1.fld_char_21 = e2.fld_char_21, "&_
										" e1.fld_char_22 = e2.fld_char_22, e1.fld_char_23 = e2.fld_char_23, "&_
										" e1.fld_char_24 = e2.fld_char_24, e1.fld_char_25 = e2.fld_char_25, "&_
										" e1.fld_char_26 = e2.fld_char_26, e1.fld_char_27 = e2.fld_char_27, "&_
										" e1.fld_char_28 = e2.fld_char_28, e1.fld_char_29 = e2.fld_char_29, "&_
										" e1.fld_char_30 = e2.fld_char_30, e1.fld_char_31 = e2.fld_char_31, "&_
										" e1.fld_char_32 = e2.fld_char_32, e1.fld_char_33 = e2.fld_char_33, "&_
										" e1.fld_char_34 = e2.fld_char_34, e1.fld_char_35 = e2.fld_char_35, "&_
										" e1.fld_char_36 = e2.fld_char_36, e1.fld_char_37 = e2.fld_char_37, "&_
										" e1.fld_char_38 = e2.fld_char_38, e1.fld_char_39 = e2.fld_char_39, "&_
										" e1.fld_char_40 = e2.fld_char_40, e1.fld_char_41 = e2.fld_char_41, "&_
										" e1.id_Client = e2.id_Client "&_
							" FROM "&_
								    " ExpNautic" & SQL_TYP & " AS e1 "&_
								    " INNER JOIN ExpNautic" & IMPORT_TYP & " AS e2 "&_
								        "ON (e2.id_expNautic= " & id_expNautic_import & ")"&_
							" WHERE "&_
							    	" e1.id_expNautic = " & id_expNautic
   	
			elseif IMPORT = "all" then
				SQL = " UPDATE e1"&_
							" SET"&_
										" e1.Salutation_skipper = e2.Salutation_skipper, e1.Name_skipper = e2.Name_skipper, "&_
										" e1.FirstName_skipper = e2.FirstName_skipper, e1.Date_naiss_skipper = e2.Date_naiss_skipper, "&_
										" e1.Lieu_naiss_skipper = e2.Lieu_naiss_skipper, e1.Address_skipper = e2.Address_skipper, "&_
										" e1.ZipCode_skipper = e2.ZipCode_skipper, e1.City_skipper = e2.City_skipper, "&_
										" e1.Country_skipper = e2.Country_skipper, e1.Tel_skipper = e2.Tel_skipper, "&_
										" e1.Mob_skipper = e2.Mob_skipper, e1.Fax_skipper = e2.Fax_skipper, "&_
										" e1.Email_skipper = e2.Email_skipper, e1.Comment_skipper = e2.Comment_skipper, "&_
										" e1.IdentNum_skipper = e2.IdentNum_skipper, e1.Nation_skipper = e2.Nation_skipper, "&_
										" e1.licence = e2.licence, e1.licence_type = e2.licence_type, "&_
										" e1.licence_num = e2.licence_num, e1.licence_off = e2.licence_off, "&_
										" e1.licence_date = e2.licence_date, e1.licence_until = e2.licence_until, "&_
										" e1.licence_for = e2.licence_for, e1.Nb_year = e2.Nb_year, "&_
										" e1.Nb_day = e2.Nb_day, e1.sans_equipage = e2.sans_equipage, "&_
										" e1.have_boat = e2.have_boat, e1.type_boat = e2.type_boat, "&_
										" e1.long_boat = e2.long_boat, e1.place_boat = e2.place_boat, "&_
										" e1.address_skipperOPE = e2.address_skipperOPE, e1.ZipCode_skipperOPE = e2.ZipCode_skipperOPE, "&_
										" e1.City_skipperOPE = e2.City_skipperOPE, e1.Country_skipperOPE = e2.Country_skipperOPE, "&_
										" e1.Email_skipperOPE = e2.Email_skipperOPE, e1.State_skipper = e2.State_skipper, "&_
										" e1.State_skipperOpe = e2.State_skipperOpe, e1.Address2_skipper = e2.Address2_skipper, "&_
										" e1.Address2_skipperOpe = e2.Address2_skipperOpe, e1.Comment = e2.Comment, "&_
										" e1.Salutation_equipier = e2.Salutation_equipier, e1.Name_equipier = e2.Name_equipier, "&_
										" e1.FirstName_equipier = e2.FirstName_equipier, e1.Date_naiss_equipier = e2.Date_naiss_equipier, "&_
										" e1.Address_equipier = e2.Address_equipier, e1.ZipCode_equipier = e2.ZipCode_equipier, "&_
										" e1.City_equipier = e2.City_equipier, e1.Country_equipier = e2.Country_equipier, "&_
										" e1.Tel_equipier = e2.Tel_equipier, e1.Fax_equipier = e2.Fax_equipier, "&_
										" e1.Email_equipier = e2.Email_equipier, e1.Mob_equipier = e2.Mob_equipier, "&_
										" e1.BoatOwn_Equipier = e2.BoatOwn_Equipier, e1.Comment_equipier = e2.Comment_equipier, "&_
										" e1.IdentNum_equipier = e2.IdentNum_equipier, e1.Nation_equipier = e2.Nation_equipier, "&_
										" e1.Nb_year_equipier = e2.Nb_year_equipier, e1.Boat_equipier = e2.Boat_equipier, "&_
										" e1.have_boat_equipier = e2.have_boat_equipier, e1.type_boat_equipier = e2.type_boat_equipier, "&_
										" e1.long_boat_equipier = e2.long_boat_equipier, e1.place_boat_equipier = e2.place_boat_equipier, "&_
										" e1.address_equipierOPE = e2.address_equipierOPE, e1.ZipCode_equipierOPE = e2.ZipCode_equipierOPE, "&_
										" e1.Country_equipierOPE = e2.Country_equipierOPE, e1.Lieu_naiss_equipier = e2.Lieu_naiss_equipier, "&_
										" e1.State_equipier = e2.State_equipier, "&_
										" e1.State_equipierOpe = e2.State_equipierOpe, e1.Address2_equipier = e2.Address2_equipier, "&_
										" e1.Address2_equipierOpe = e2.Address2_equipierOpe, e1.City_equipierOPE = e2.City_equipierOPE, "&_
									  " e1.vc_chp_12 = e2.vc_chp_12, e1.vc_chp_11 = e2.vc_chp_11, "&_
										" e1.vc_chp_10 = e2.vc_chp_10, e1.vc_chp_09 = e2.vc_chp_09, "&_
										" e1.vc_chp_08 = e2.vc_chp_08, e1.vc_chp_07 = e2.vc_chp_07, "&_
										" e1.vc_chp_06 = e2.vc_chp_06, e1.vc_chp_05 = e2.vc_chp_05, "&_
										" e1.vc_chp_04 = e2.vc_chp_04, e1.vc_chp_03 = e2.vc_chp_03, "&_
										" e1.vc_chp_02 = e2.vc_chp_02, e1.vc_chp_01 = e2.vc_chp_01, "&_
										" e1.fld_int_01 = e2.fld_int_01, e1.fld_int_02 = e2.fld_int_02, "&_
										" e1.fld_int_03 = e2.fld_int_03, e1.fld_int_04 = e2.fld_int_04, "&_
										" e1.fld_text_01 = e2.fld_text_01, e1.fld_char_01 = e2.fld_char_01, "&_
										" e1.fld_char_02 = e2.fld_char_02, e1.fld_char_03 = e2.fld_char_03, "&_
										" e1.fld_char_04 = e2.fld_char_04, e1.fld_char_05 = e2.fld_char_05, "&_
										" e1.fld_char_06 = e2.fld_char_06, e1.fld_char_07 = e2.fld_char_07, "&_
										" e1.fld_char_08 = e2.fld_char_08, e1.fld_char_09 = e2.fld_char_09, "&_
										" e1.fld_char_10 = e2.fld_char_10, e1.fld_char_11 = e2.fld_char_11, "&_
										" e1.fld_char_12 = e2.fld_char_12, e1.fld_char_13 = e2.fld_char_13, "&_
										" e1.fld_char_14 = e2.fld_char_14, e1.fld_char_15 = e2.fld_char_15, "&_
										" e1.fld_char_16 = e2.fld_char_16, e1.fld_char_17 = e2.fld_char_17, "&_
										" e1.fld_char_18 = e2.fld_char_18, e1.fld_char_19 = e2.fld_char_19, "&_
										" e1.fld_char_20 = e2.fld_char_20, e1.fld_char_21 = e2.fld_char_21, "&_
										" e1.fld_char_22 = e2.fld_char_22, e1.fld_char_23 = e2.fld_char_23, "&_
										" e1.fld_char_24 = e2.fld_char_24, e1.fld_char_25 = e2.fld_char_25, "&_
										" e1.fld_char_26 = e2.fld_char_26, e1.fld_char_27 = e2.fld_char_27, "&_
										" e1.fld_char_28 = e2.fld_char_28, e1.fld_char_29 = e2.fld_char_29, "&_
										" e1.fld_char_30 = e2.fld_char_30, e1.fld_char_31 = e2.fld_char_31, "&_
										" e1.fld_char_32 = e2.fld_char_32, e1.fld_char_33 = e2.fld_char_33, "&_
										" e1.fld_char_34 = e2.fld_char_34, e1.fld_char_35 = e2.fld_char_35, "&_
										" e1.fld_char_36 = e2.fld_char_36, e1.fld_char_37 = e2.fld_char_37, "&_
										" e1.fld_char_38 = e2.fld_char_38, e1.fld_char_39 = e2.fld_char_39, "&_
										" e1.fld_char_40 = e2.fld_char_40, e1.fld_char_41 = e2.fld_char_41, "&_
										" e1.id_Client = e2.id_Client "&_
							" FROM "&_
								    " ExpNautic" & SQL_TYP & " AS e1 "&_
								    " INNER JOIN ExpNautic" & IMPORT_TYP & " AS e2 "&_
								        "ON (e2.id_expNautic= " & id_expNautic_import & ")"&_
							" WHERE "&_
							    	" e1.id_expNautic = " & id_expNautic
			end if
		cn.Execute(SQL)
	end if
		Set JsValue = jsObject()
			'JsValue("SQL") = SQL
			JsValue("id_expNautic") = id_expNautic
			JsValue("typ_command") = typ_command
			JsValue.Flush
End function

Function Contrat_sign()
	if cs_nid&"a"="a" or isNull(cs_nid) then cs_nid=""
	if cs_idc&"a"="a" or isNull(cs_idc) then cs_idc=""
	if cs_etf&"a"="a" or isNull(cs_etf) then cs_etf=""
	if cs_act&"a"="a" or isNull(cs_act) then cs_act=""
	if cs_mor&"a"="a" or isNull(cs_mor) then cs_mor=""
	if bt_Model&"" = "" then bt_Model = ""
	if id_sagt&"" = "" then id_sagt = "0"
	if id_baseop&"" = "" then id_baseop = "0"
	
	if id_cab&"" = "" then id_cab="0"
		
	'if request("id_cab")<>"" then id_cab = request("")
	
	cs_path = FindPath()
	
	if id_lang_cli&""="" then id_lang_cli=session("lang")
		
	Set d = server.CreateObject("Scripting.Dictionary")

	cs_from_page = request.ServerVariables("PATH_INFO")
	cs_from_page = lcase(mid(cs_from_page,instrrev(cs_from_page,"/")+1))
	
	d.add "skipper_ne", "2"
	d.add "skipper_ac", "32"
	d.add "skipper_p1", "I completed the client's skipper resume."		
	d.add "skipper_p2", ledico("lg_iconfirm")
	d.add "skipper_ok", ""
	cs_blocks= array("skipper")
	
	if dev_local then ico_adr="http://"&serv_local&"/sdndev/" else ico_adr="http://www.proce2.net/" end if
	ico_img = "<img src="""&ico_adr&"/img/vb/[ext]"" border=0 align=absmiddle>"
	cntIco = -1
	rs.open "select id_actl, icon FROM Action_Libelle WHERE icon is not null ",cn
		if not rs.eof then
			arrIco = rs.getrows()
			cntIco = ubound(arrIco,2)
		end if
	rs.close
	if cntIco>-1 then
		for incIco=0 to cntIco
			d.add "ico"&arrIco(0,incIco), arrIco(1,incIco)
		next
	end if
	
	for cs_inc=0 to ubound(cs_blocks)
		step_blocks = cs_blocks(cs_inc)
		if step_blocks&"a"="a" then 
			exit for
		end if
		
		cs_new_etat	 = d(lcase(step_blocks)&"_ne")
		cs_act			 = d(lcase(step_blocks)&"_ac")
		AffPhrase1	 = d(lcase(step_blocks)&"_p1")
		AffPhrase2	 = d(lcase(step_blocks)&"_p2")
		AffPhraseOk	 = d(lcase(step_blocks)&"_ok")
		AffInput		 = d(lcase(step_blocks)&"_ip")

		cs_cg="0"
		if typ_command="agt" then
			tabComm = "CommandAgt"
			tabInfo = "commandInfoAgt"
		else
			tabComm = "Command"
			tabInfo = "commandInfo"
		end if
	if lcase(step_blocks)="skipper" then	
		if catamaran_fleet and typ_command="ope" then
			sql = "SELECT TOP 1 id_actl, dateauto, id_log, MoreInfo  FROM Action A "&_
						" WHERE id_actl in (32) AND id_command IN ("&id_command&") ORDER BY a.id_action DESC "
		else
			sql = "SELECT C.skipper, A.dateauto, A.id_log, A.MoreInfo  FROM "&tabComm&" C LEFT OUTER JOIN Action A "&_
						" ON (A.id_command=C.id_command AND A.id_actl in (32) and typ_command='"&typ_command&"' ) "&_
						" WHERE C.id_command IN ("&id_command&") ORDER BY a.id_action DESC "
		end if
	end if
		if (dev_ligne and 0) or (dev_local and 0) then
			response.flush
			response.write "<br>"&sql
		response.end
		end if
		
		rs.open sql,cn
			if not rs.eof then
				cs_cg = rs(0)
				cs_dt = rs(1)
				cs_lg = rs(2)
				cs_mr = rs(3)
			end if
		rs.close
		
		if cs_cg&"a"="a" or isNull(cs_cg) then cs_cg="0"
			
		icon = "&nbsp;"
		if d.exists("ico"&cs_act) then icon = replace(ico_img,"[ext]",d("ico"&cs_act))
		
		if tcg_tp&"" = "own" then
				sql = "SELECT CI.cg, A.dateauto, A.id_log, A.MoreInfo FROM "&tabInfo&" CI LEFT OUTER JOIN Action A "&_
							" ON (A.id_command=CI.id_command AND A.id_actl in (28,29) and typ_command='"&typ_command&"' ) "&_
							" WHERE CI.id_command IN ("&id_command&") ORDER BY a.id_action DESC "
				rs.open sql,cn
					if not rs.eof then
						st_cs_cg = rs(0)
						st_cs_dt = rs(1)
						st_cs_lg = rs(2)
						st_cs_mr = rs(3)
					end if
				rs.close
				if st_cs_cg&"a"="a" or isNull(st_cs_cg) then st_cs_cg="0"
		end if
		
		if (cs_cg&""<>"0") then
				if d.exists("ico"&cs_cg) and (lcase(step_blocks)="skipval" OR (lcase(step_blocks)="coskval")) then icon = replace(ico_img,"[ext]",d("ico"&cs_cg))
				if cs_mr&"a"="a" or isNull(cs_mr) or cs_mr&""="ok" then cs_mr="" else cs_mr="<em>"&cs_mr&"</em> - "
								
				if cs_lg&"a"="a" or isNull(cs_lg) then cs_lg="0"
				cs_lg = replace(Log_detail2(cs_lg),"&nbsp;","")
				if trim(cs_lg)&"a"<>"a" and isNull(cs_lg)=false then cs_lg=" by <strong>"&cs_lg&"</strong>"	
		end if
		icon2 = "&nbsp;"
		if d.exists("ico"&cs_act) then icon2 = replace(ico_img,"[ext]",d("ico"&cs_act))
	next
	Set JsValue = jsObject()
			'JsValue("SQL") = SQL
			JsValue("lg_signedbytheclient") = LeDico("lg_signedbytheclient")
			JsValue("lg_notsignedbytheclient") = LeDico("lg_notsignedbytheclient")
			JsValue("lg_alreadyfilled") = LeDico("lg_alreadyfilled")
			JsValue("tcg_tp") = noNull(array(tcg_tp,""))
			JsValue("st_cs_cg") = noNull(array(st_cs_cg,""))
			JsValue("cs_cg") = cs_cg
			JsValue("icon") = icon
			JsValue("icon2") = icon2
			JsValue("cs_mr") = noNull(array(cs_mr,""))
			JsValue("cs_lg") = noNull(array(cs_lg,""))
			JsValue("cs_dt_con") = isDate(cs_dt)
			JsValue("AffPhraseOk") = AffPhraseOk
			JsValue("cs_dt") = noNull(array(cs_dt,""))
			JsValue("lcase_step_blocks") = lcase(step_blocks)
			JsValue("checkbox_name") = "chkcs_" & lcase(step_blocks)
			JsValue("AffInput") = noNull(array(AffInput,""))
			JsValue("txt_complete") = errbox2(array("<label>"&cs_mr&""&AffPhraseOk&" On <strong>"&cs_dt&"</strong> "&cs_lg&"</label>",0,"bootstrap"))
			JsValue("lg_votrenom") = LeDico("lg_votrenom")
			JsValue("AffPhrase1") = AffPhrase1
			JsValue("AffPhrase2") = AffPhrase2
			JsValue("AffPhrase2_instr") = instr(AffPhrase2,"¤")
			JsValue("AffPhrase2_split") = split(AffPhrase2,"¤")
			JsValue("cs_act") = cs_act
			JsValue("cs_act_split") = split(cs_act,"¤")
			JsValue("cs_path") = cs_path&"operator/special/196/contrat_sign-ajax.asp"
			JsValue("cs_new_etat") = cs_new_etat
			JsValue("id_sagt") = id_sagt
			JsValue("id_baseop") = id_baseop

	JsValue.Flush
End Function

Function UpdateContrat()
	if cs_idc<>"0" and cs_idc<>"" then
			
		id_command  = cs_idc
		typ_command = "ope"

		cn.execute "UPDATE Command SET skipper='"&cs_etf&"' WHERE id_command="&cs_idc

		if catamaran_fleet then
      ' On cherche la monnaie ici, car dans finagt_edition.asp, la monnaie ne passe pas 04/05/2012 BRUNO
      signcurr = "EUR"
      SQL = "SELECT D.signe FROM Devise D INNER JOIN COMMAND C ON D.id_devise=C.id_devise WHERE C.id_command = '" & cs_idc & "'"
      rs2.open SQL,cn
        if not rs2.eof then
          ZeMoney  = rs2(0)
          signcurr = ZeMoney
        end if
      rs2.close
      CVmarin_from = "CONFIRM BUTTON"
			alert_CVMarinCatCO(Array())
		end if
		
		call LogAction(cs_act,cs_mor)
		Set JsValue = jsObject()
				'JsValue("SQL") = SQL
				JsValue("result") = errbox2(array("Request ok.",0,"bootstrap"))
				JsValue("signcurr") = signcurr
				JsValue.Flush
	else
		response.write "erreur=cache[4]"
	end if
End Function

Function GetSkipper196()
	
	if coskip&"a"="a" then coskip="0"
	SQL = "SELECT * FROM ExpNautic196 WHERE id_command=" & id_command &" AND coskip="&coskip
	'response.write(SQL)
	rs.open SQl,cn
	if not rs.eof then 
		id_client    = rs("id_client")
		id_command   = rs("id_command")
		id_expNautic = rs("id_exp196")
		co_skip = rs("coskip")
		Name = rs("Name")
		SkName = rs("SkName")
		DDate = rs("DDate")
		Q1a = rs("Q1a")
		Q1b = rs("Q1b")
		Q1c = rs("Q1c")
		Q1d  = rs("Q1d")
		Q3   = rs("Q3")
		Q3a1 = rs("Q3a1")
		Q3a2 = rs("Q3a2")
		Q3a3 = rs("Q3a3")
		Q3a4 = rs("Q3a4")
		Q3b1 = rs("Q3b1")
		Q3b2 = rs("Q3b2")
		Q3b3 = rs("Q3b3")
		Q3b4 = rs("Q3b4")
		Q3c1 = rs("Q3c1")
		Q3c2 = rs("Q3c2")
		Q3c3 = rs("Q3c3")
		Q3c4 = rs("Q3c4")
		Q3d1 = rs("Q3d1")
		Q3d2 = rs("Q3d2")
		Q3d3 = rs("Q3d3")
		Q3d4 = rs("Q3d4")
		Q3e1 = rs("Q3e1")
		Q3e2 = rs("Q3e2")
		Q3e3 = rs("Q3e3")
		Q3e4 = rs("Q3e4")
		Q3f1 = rs("Q3f1")
		Q3f2 = rs("Q3f2")
		Q3f3 = rs("Q3f3")
		Q3f4 = rs("Q3f4")
		Q4a  = rs("Q4a")
		Q4b  = rs("Q4b")
		Q4c  = rs("Q4c")
		Q4d  = rs("Q4d")
		Q5a  = rs("Q5a")
		Q5b  = rs("Q5b")
		Q6   = rs("Q6")
		Q7a  = rs("Q7a")
		Q7b  = rs("Q7b")
		Q7c  = rs("Q7c")
		Q8   = rs("Q8")
		Q9   = rs("Q9")
		Q10  = rs("Q10")
		Q11a = rs("Q11a")
		Q11b = rs("Q11b")
		Q12   = rs("Q12")
		Q13a1 = rs("Q13a1")
		Q13a2 = rs("Q13a2")
		Q13b1 = rs("Q13b1")
		Q13b2 = rs("Q13b2")
		Q13c1 = rs("Q13c1")
		Q13c2 = rs("Q13c2")
		Q14a = rs("Q14a")
		Q14b = rs("Q14b")
		Q14c = rs("Q14c")
		Q14d = rs("Q14d")
	end if
		Set JsValue = jsObject()
				'JsValue("SQL") = SQL
				JsValue("id_expNautic") = noNull(array(id_expNautic,""))
				JsValue("id_client") = noNull(array(id_client,""))
				JsValue("id_command") = id_command
				JsValue("coskip") = noNull(array(co_skip,""))
				JsValue("Name") = noNull(array(Name,""))
				JsValue("SkName") = noNull(array(SkName,""))
				JsValue("DDate") = noNull(array(DDate,""))
				JsValue("Q1a") = noNull(array(Q1a,""))
				JsValue("Q1b") = noNull(array(Q1b,""))
				JsValue("Q1c") = noNull(array(Q1c,""))
				JsValue("Q1d") = noNull(array(Q1d,""))
				JsValue("Q3") = noNull(array(Q3,""))
				JsValue("Q3a1") = noNull(array(Q3a1,""))
				JsValue("Q3a2") = noNull(array(Q3a2,""))
				JsValue("Q3a3") = noNull(array(Q3a3,""))
				JsValue("Q3a4") = noNull(array(Q3a4,""))
				JsValue("Q3b1") = noNull(array(Q3b1,""))
				JsValue("Q3b2") = noNull(array(Q3b2,""))
				JsValue("Q3b3") = noNull(array(Q3b3,""))
				JsValue("Q3b4") = noNull(array(Q3b4,""))
				JsValue("Q3c1") = noNull(array(Q3c1,""))
				JsValue("Q3c2") = noNull(array(Q3c2,""))
				JsValue("Q3c3") = noNull(array(Q3c3,""))
				JsValue("Q3c4") = noNull(array(Q3c4,""))
				JsValue("Q3d1") = noNull(array(Q3d1,""))
				JsValue("Q3d2") = noNull(array(Q3d2,""))
				JsValue("Q3d3") = noNull(array(Q3d3,""))
				JsValue("Q3d4") = noNull(array(Q3d4,""))
				JsValue("Q3e1") = noNull(array(Q3e1,""))
				JsValue("Q3e2") = noNull(array(Q3e2,""))
				JsValue("Q3e3") = noNull(array(Q3e3,""))
				JsValue("Q3e4") = noNull(array(Q3e4,""))
				JsValue("Q3f1") = noNull(array(Q3f1,""))
				JsValue("Q3f2") = noNull(array(Q3f2,""))
				JsValue("Q3f3") = noNull(array(Q3f3,""))
				JsValue("Q3f4") = noNull(array(Q3f4,""))
				JsValue("Q4a") = noNull(array(Q4a,""))
				JsValue("Q4b") = noNull(array(Q4b,""))
				JsValue("Q4c") = noNull(array(Q4c,""))
				JsValue("Q4d") = noNull(array(Q4d,""))
				JsValue("Q5a") = noNull(array(Q5a,""))
				JsValue("Q5b") = noNull(array(Q5b,""))
				JsValue("Q6") = noNull(array(Q6,""))
				JsValue("Q7a") = noNull(array(Q7a,""))
				JsValue("Q7b") = noNull(array(Q7b,""))
				JsValue("Q7c") = noNull(array(Q7c,""))
				JsValue("Q8") = noNull(array(Q8,""))
				JsValue("Q9") = noNull(array(Q9,""))
				JsValue("Q10") = noNull(array(Q10,""))
				JsValue("Q11a") = noNull(array(Q11a,""))
				JsValue("Q11b") = noNull(array(Q11b,""))
				JsValue("Q12") = noNull(array(Q12,""))
				JsValue("Q13a1") = noNull(array(Q13a1,""))
				JsValue("Q13a2") = noNull(array(Q13a2,""))
				JsValue("Q13b1") = noNull(array(Q13b1,""))
				JsValue("Q13b2") = noNull(array(Q13b2,""))
				JsValue("Q13c1") = noNull(array(Q13c1,""))
				JsValue("Q13c2") = noNull(array(Q13c2,""))
				JsValue("Q14a") = noNull(array(Q14a,""))
				JsValue("Q14b") = noNull(array(Q14b,""))
				JsValue("Q14c") = noNull(array(Q14c,""))
				JsValue("Q14d") = noNull(array(Q14d,""))
				JsValue("lg_markskippernotfilled") = LeDico("lg_markskippernotfilled")
				JsValue("lg_markskipperfilled") = LeDico("lg_markskipperfilled")
				JsValue("lg_skipper_import") = LeDico("lg_skipper_import")
				JsValue("lg_coskipper_import") = LeDico("lg_coskipper_import")
				JsValue.Flush
				
end function

Function GetSkipper()
'	if typ_command="ope" then 
'		SQL = "SELECT id_commandAgt,skipper,paxlist,CA.refcom FROM CommandLink as CL "&_
'		" INNER JOIN CommandAGt as CA ON CA.id_command = CL.id_commandagt "&_
'		" WHERE id_commandOpe = " & id_command &_
'		" UNION "&_
'		"SELECT id_commandAgt,skipper,paxlist,CA.refcom FROM CommandLink as CL "&_
'		" INNER JOIN CommandAGt as CA ON CA.id_command = CL.id_commandagt "&_
'		" WHERE id_commandOpe2 = " & id_command 
'		rs.open SQl,cn
'		if not rs.eof then 
'		id_command  = rs("id_commandAgt")
'		SQL_TYP     = "agt"
'		skipper     = rs("skipper")
'		paxlist     = rs("paxlist")
'		typ_command = "agt"
'		refcom      = rs("refcom")
'		end if
'		rs.close
'	end if
	
	if method = "export" then
		'SQL = "SELECT P.id_pass, P.nom, P.Prenom, P.sex, P.Email, P.address, P.EmailOpe, P.AddressOpe, P.Age, P.BirthDate, P.BirthPlace, P.Nation, P.PassPort, P.Validity, P.Pointure, P.Mobile, P.SailingExp, P.kin_name, P.kin_phone, P.kin_relation, P.residence, P.crew_type FROM Pass P INNER JOIN listpass"&SQL_TYP&" LP ON LP.id_pass=P.id_pass WHERE LP.id_command="&id_command
		SQL = "SELECT P.id_pass, " &_
					"       P.nom, P.Prenom, P.sex, P.Email, P.address, " &_
					"       P.EmailOpe, P.AddressOpe, P.Age, P.BirthDate, " &_
					"       P.BirthPlace, P.Nation, P.PassPort, P.Validity, " &_
					"       P.Pointure, P.Mobile, P.SailingExp, P.kin_name, " &_
					"       P.kin_phone, P.kin_relation, P.residence, P.crew_type, " &_
					"				P.city, P.state, P.zip, P.country, " &_
					"				P.dat_arrival, P.air_num, P.air_time, P.ferry_num, " &_
					"				P.ferry_time, P.west_end, P.road_town " &_
					" FROM Pass P " &_
					"     INNER JOIN listpass"&SQL_TYP&" LP ON LP.id_pass = P.id_pass " &_
					" WHERE LP.id_command = " & id_command
		'response.write sql : response.end
		rs.open SQl,cn
		if not rs.eof then
			pass = rs.getRows()
			pass_count = ubound(pass,2)
		else
			pass_count = -1
		end if
		rs.close

		SQL = "SELECT * FROM PassInfo"&SQL_TYP&" WHERE id_command='"&id_command&"'"
'		response.write SQL
'		response.end
		rs.open SQl,cn
		if not rs.eof then
			marina = rs.getRows()
			marina_count = ubound(marina)
		else
			marina_count = -1
		end if
		rs.close
		
		if catamaran_fleet then
			SQL = "SELECT * FROM ExpNautic196 WHERE id_command=" & id_command &" AND coskip=1"
			'response.write SQL : response.end
			rs.open SQl,cn
			if not rs.eof then
				coskip196 = rs.getRows()
				coskip_count = ubound(coskip196)
			else
				coskip_count = -1
			end if
			rs.close
		end if
	end if 'if method = "export"
	
	if catamaran_fleet then
		if coskip&"a"="a" then coskip="0"
		SQL = "SELECT * FROM ExpNautic196 WHERE id_command=" & id_command &" AND coskip="&coskip
		'response.write(SQL)
		rs.open SQl,cn
			if not rs.eof then 
				id_client    = rs("id_client")
				id_command   = rs("id_command")
				id_expNautic = rs("id_exp196")
				co_skip = rs("coskip")
				Name = rs("Name")
				SkName = rs("SkName")
				DDate = rs("DDate")
				Q1a = rs("Q1a")
				Q1b = rs("Q1b")
				Q1c = rs("Q1c")
				Q1d  = rs("Q1d")
				Q3   = rs("Q3")
				Q3a1 = rs("Q3a1")
				Q3a2 = rs("Q3a2")
				Q3a3 = rs("Q3a3")
				Q3a4 = rs("Q3a4")
				Q3b1 = rs("Q3b1")
				Q3b2 = rs("Q3b2")
				Q3b3 = rs("Q3b3")
				Q3b4 = rs("Q3b4")
				Q3c1 = rs("Q3c1")
				Q3c2 = rs("Q3c2")
				Q3c3 = rs("Q3c3")
				Q3c4 = rs("Q3c4")
				Q3d1 = rs("Q3d1")
				Q3d2 = rs("Q3d2")
				Q3d3 = rs("Q3d3")
				Q3d4 = rs("Q3d4")
				Q3e1 = rs("Q3e1")
				Q3e2 = rs("Q3e2")
				Q3e3 = rs("Q3e3")
				Q3e4 = rs("Q3e4")
				Q3f1 = rs("Q3f1")
				Q3f2 = rs("Q3f2")
				Q3f3 = rs("Q3f3")
				Q3f4 = rs("Q3f4")
				Q4a  = rs("Q4a")
				Q4b  = rs("Q4b")
				Q4c  = rs("Q4c")
				Q4d  = rs("Q4d")
				Q5a  = rs("Q5a")
				Q5b  = rs("Q5b")
				Q6   = rs("Q6")
				Q7a  = rs("Q7a")
				Q7b  = rs("Q7b")
				Q7c  = rs("Q7c")
				Q8   = rs("Q8")
				Q9   = rs("Q9")
				Q10  = rs("Q10")
				Q11a = rs("Q11a")
				Q11b = rs("Q11b")
				Q12   = rs("Q12")
				Q13a1 = rs("Q13a1")
				Q13a2 = rs("Q13a2")
				Q13b1 = rs("Q13b1")
				Q13b2 = rs("Q13b2")
				Q13c1 = rs("Q13c1")
				Q13c2 = rs("Q13c2")
				Q14a = rs("Q14a")
				Q14b = rs("Q14b")
				Q14c = rs("Q14c")
				Q14d = rs("Q14d")
			else
				p_count = -1
			end if
		rs.close
	elseif not(catamaran_fleet) then
		SQL = "Select Exp.* From ExpNautic" & SQL_TYP & " Exp INNER JOIN Command"& SQL_TYP &" Cmd ON Cmd.id_command=Exp.id_command WHERE Exp.id_client='" & id_client &"' AND Exp.id_Command='"& id_command &"' ORDER BY Exp.id_expNautic DESC"
		rs.Open SQL,cn
			if not rs.eof then
				mySalutation_skipper  = rs("Salutation_skipper")
				myName_skipper        = rs("Name_skipper")
				myFirstName_skipper   = rs("FirstName_skipper")
				myDate_naiss_skipper  = rs("Date_naiss_skipper")
				myLieu_naiss_skipper  = rs("Lieu_naiss_skipper")
				myAddress_skipper     = rs("Address_skipper")
				myZipCode_skipper     = rs("ZipCode_skipper")
				myCity_skipper        = rs("City_skipper")
				myCountry_skipper     = rs("Country_skipper")
				myTel_skipper         = rs("Tel_skipper")
				myMob_skipper         = rs("Mob_skipper")
				myFax_skipper         = rs("Fax_skipper")
				myEmail_skipper       = rs("Email_skipper")
				myComment_skipper     = rs("Comment_skipper")
				myIdentNum_skipper    = rs("IdentNum_skipper")
				myNation_skipper      = rs("Nation_skipper")
				mySalutation_equipier = rs("Salutation_equipier")
				myName_equipier       = rs("Name_equipier")
				myFirstName_equipier  = rs("FirstName_equipier")
				myDate_naiss_equipier = rs("Date_naiss_equipier")
				myAddress_equipier    = rs("Address_equipier")
				myAddress2_equipier		= rs("Address2_equipier")
				myZipCode_equipier    = rs("ZipCode_equipier")
				myCity_equipier       = rs("City_equipier")
				myCountry_equipier    = rs("Country_equipier")
				myTel_equipier        = rs("Tel_equipier")
				myMob_equipier        = rs("Mob_equipier")
				myFax_equipier        = rs("Fax_equipier")
				myEmail_equipier      = rs("Email_equipier")
				myBoatOwn_Equipier    = rs("BoatOwn_Equipier")
				myComment_equipier    = rs("Comment_equipier")
				myIdentNum_equipier   = rs("IdentNum_equipier")
				myNation_equipier     = rs("Nation_equipier")
				myLieu_naiss_equipier = rs("Lieu_naiss_equipier")
				mylicence             = rs("licence")
				mylicence_type        = rs("licence_type")
				mylicence_num         = rs("licence_num")
				mylicence_off         = rs("licence_off")
				mylicence_date        = rs("licence_date")
				mylicence_until       = rs("licence_until")
				mylicence_for         = rs("licence_for")
				myVhf_radio						= rs("Vhf_radio")
				myNb_year             = rs("Nb_year")
				myNb_year_equipier    = rs("Nb_year_equipier")
				myBoat_equipier       = rs("Boat_equipier")
				myNb_day              = rs("Nb_day")
				mysans_equipage       = rs("sans_equipage")
				mycomment             = rs("comment")
				myhave_boat_equipier  = rs("have_boat_equipier")
				mytype_boat_equipier  = rs("type_boat_equipier")
				mylong_boat_equipier  = rs("long_boat_equipier")
				myplace_boat_equipier = rs("place_boat_equipier")
				myhave_boat           = rs("have_boat")
				mytype_boat           = rs("type_boat")
				mylong_boat           = rs("long_boat")
				myplace_boat          = rs("place_boat")
				myid_Client           = rs("id_Client")
	
				myAddress_skipperOPE  = rs("Address_skipperOPE")
				myZipCode_skipperOPE  = rs("ZipCode_skipperOPE")
				myCity_skipperOPE     = rs("City_skipperOPE")
				myCountry_skipperOPE  = rs("Country_skipperOPE")
				myEmail_skipperOpe    = rs("Email_skipperOPE")
				myState_equipier		  = rs("State_equipier")
				myState_equipierOpe		= rs("State_equipierOpe")
				myAddress_equipierOPE = rs("Address_equipierOPE")
				myAddress2_equipierOPE= rs("Address2_equipierOPE")
				myZipCode_equipierOPE = rs("ZipCode_equipierOPE")
				myCity_equipierOPE    = rs("City_equipierOPE")
				myCountry_equipierOPE = rs("Country_equipierOPE")
	
	
				vc_chp_01          = rs("vc_chp_01")
				vc_chp_02          = rs("vc_chp_02")
				vc_chp_03          = rs("vc_chp_03")
				vc_chp_04          = rs("vc_chp_04")
				vc_chp_05          = rs("vc_chp_05")
				vc_chp_06          = rs("vc_chp_06")
				vc_chp_07          = rs("vc_chp_07")
				vc_chp_08          = rs("vc_chp_08")
				vc_chp_09          = rs("vc_chp_09")
				vc_chp_10          = rs("vc_chp_10")
				vc_chp_11          = rs("vc_chp_11")
				vc_chp_12          = rs("vc_chp_12")
	
				myState_skipper			 = rs("State_skipper")
				myState_skipperOpe		 = rs("State_skipperOpe")
				myAddress2_skipper		 = rs("Address2_skipper")
				myAddress2_skipperOpe	 = rs("Address2_skipperOpe")
	
	
				fld_int_01          = rs("fld_int_01")
				fld_int_02          = rs("fld_int_02")
				fld_int_03          = rs("fld_int_03")
				fld_int_04          = rs("fld_int_04")
	
				fld_char_01          = rs("fld_char_01")
				fld_char_02          = rs("fld_char_02")
				fld_char_03          = rs("fld_char_03")
				fld_char_04          = rs("fld_char_04")
				fld_char_05          = rs("fld_char_05")
				fld_char_06          = rs("fld_char_06")
				fld_char_07          = rs("fld_char_07")
				fld_char_08          = rs("fld_char_08")
				fld_char_09          = rs("fld_char_09")
				fld_char_10          = rs("fld_char_10")
				fld_char_11          = rs("fld_char_11")
				fld_char_12          = rs("fld_char_12")
				fld_char_13          = rs("fld_char_13")
				fld_char_14          = rs("fld_char_14")
				fld_char_15          = rs("fld_char_15")
				fld_char_16          = rs("fld_char_16")
				fld_char_17          = rs("fld_char_17")
				fld_char_18          = rs("fld_char_18")
				fld_char_19          = rs("fld_char_19")
				fld_char_20          = rs("fld_char_20")
				fld_char_21          = rs("fld_char_21")
				fld_char_22          = rs("fld_char_22")
				fld_char_23          = rs("fld_char_23")
				fld_char_24          = rs("fld_char_24")
				fld_char_25          = rs("fld_char_25")
				fld_char_26          = rs("fld_char_26")
				fld_char_27          = rs("fld_char_27")
				fld_char_28          = rs("fld_char_28")
				fld_char_29          = rs("fld_char_29")
				fld_char_30          = rs("fld_char_30")
				fld_char_31          = rs("fld_char_31")
				fld_char_32          = rs("fld_char_32")
				fld_char_33          = rs("fld_char_33")
				fld_char_34          = rs("fld_char_34")
				fld_char_35          = rs("fld_char_35")
				fld_char_36          = rs("fld_char_36")
				fld_char_37          = rs("fld_char_37")
				fld_char_38          = rs("fld_char_38")
				fld_char_39          = rs("fld_char_39")
				fld_char_40          = rs("fld_char_40")
				fld_char_41          = rs("fld_char_41")
				fld_text_01          = rs("fld_text_01")	
	
				if request("ZeEtape")<>"Add" and request("ZeEtape")<>"AddKan" and request("ZeEtape")<>"SupKad" then
				ss_Croisiere  = rs("Croisiere")
				ss_Croisiereb = rs("Croisiereb")
				end if
				if not(newid_EN) then id_expNautic          = rs("id_expNautic")
			else
				p_count = -1
			end if
		rs.close
	end if
			message = ""

				select case skipper
					case "0" ' Fiche pas remplie
					message = "<font color=red  style=""font-size:15pt;"" >" & ZeDico("ficheskipper",ss_lang)  & "</font>"
					case "1" ' Fiche remplie
					message = "<font color=green style=""font-size:15pt;"" >" & ZeDico("ficheskipper7",ss_lang) & "</font>"
					case "2" ' Pas besoin car dossier crewed ou avec skipper
					message = "<font color=green style=""font-size:15pt;"" >" & ZeDico("ficheskipper9",ss_lang) & "</font>"
				end select

	if myMob_skipper      & "a" = "a" then myMob_skipper      = ""
	if myMob_equipier     & "a" = "a" then myMob_equipier     = ""
	if myIdentNum_skipper & "a" = "a" then myIdentNum_skipper = ""
	if disnocoskip    & "a" = "a" then disnocoskip    = false

	name_CG = recupNameCG()

	if ss_id_ope="73" then name_CG=""
	disabled = ""
	if not(affich_access) then 
	disabled = "disabled"
	affich_addressOPE = false
	end if

	SQL = "SELECT CL.name,B.name2,B.model,C.id_ope,CL.id_agt,CL.id_ope,C.datestart,C.dateend,C.id_start,C.id_end,C.id_baseop,C.id_command,CL.id_opeagt FROM command" & SQL_TYP & " as C INNER JOIN client as CL ON CL.id_client=C.id_client INNER JOIN Boat as B ON B.id_boat=C.id_boat WHERE C.RefCom = '" & refcom & "'  order by etatfiche,id_command ASC"
			rs.open SQL,cn
					if not rs.eof then	
						ClientName = rs(0)
						boatname   = rs(1)
						modelname  = rs(2)
						id_ope_com = rs(3)
						id_agt_cli = rs(4)
						id_ope_cli = rs(5)
						Datestart  = rs(6)
						Dateend    = rs(7)
						id_start   = rs(8)
						id_end     = rs(9)
						id_baseop  = rs(10)
						id_command = rs(11)
						id_opeagt  = rs(12)
					end if
			rs.close

			resID = getIDsFromLogin(array(id_agt_cli,id_ope_cli,id_opeagt))
			
			id_agt_cli = resID(0)
			id_ope_cli = resID(1)

			ResPorts = GetPorts(session("lang"),id_baseop,id_start,id_end)

			baseop_name  = ResPorts(11)
			Departport   = ResPorts(0)
			Endport      = ResPorts(1)
	if method = "export" then
		%>
		<!-- #include file="log_listexp_export.asp" -->
		<%
	else
			Set JsQuery = jsObject()
			if catamaran_fleet then
				JsQuery("id_expNautic") = noNull(array(id_expNautic,""))
				JsQuery("id_client") = noNull(array(id_client,""))
				JsQuery("id_command") = id_command
				JsQuery("coskip") = noNull(array(co_skip,""))
				JsQuery("Name") = noNull(array(Name,""))
				JsQuery("SkName") = noNull(array(SkName,""))
				JsQuery("DDate") = noNull(array(DDate,""))
				JsQuery("Q1a") = noNull(array(Q1a,""))
				JsQuery("Q1b") = noNull(array(Q1b,""))
				JsQuery("Q1c") = noNull(array(Q1c,""))
				JsQuery("Q1d") = noNull(array(Q1d,""))
				JsQuery("Q3") = noNull(array(Q3,""))
				JsQuery("Q3a1") = noNull(array(Q3a1,""))
				JsQuery("Q3a2") = noNull(array(Q3a2,""))
				JsQuery("Q3a3") = noNull(array(Q3a3,""))
				JsQuery("Q3a4") = noNull(array(Q3a4,""))
				JsQuery("Q3b1") = noNull(array(Q3b1,""))
				JsQuery("Q3b2") = noNull(array(Q3b2,""))
				JsQuery("Q3b3") = noNull(array(Q3b3,""))
				JsQuery("Q3b4") = noNull(array(Q3b4,""))
				JsQuery("Q3c1") = noNull(array(Q3c1,""))
				JsQuery("Q3c2") = noNull(array(Q3c2,""))
				JsQuery("Q3c3") = noNull(array(Q3c3,""))
				JsQuery("Q3c4") = noNull(array(Q3c4,""))
				JsQuery("Q3d1") = noNull(array(Q3d1,""))
				JsQuery("Q3d2") = noNull(array(Q3d2,""))
				JsQuery("Q3d3") = noNull(array(Q3d3,""))
				JsQuery("Q3d4") = noNull(array(Q3d4,""))
				JsQuery("Q3e1") = noNull(array(Q3e1,""))
				JsQuery("Q3e2") = noNull(array(Q3e2,""))
				JsQuery("Q3e3") = noNull(array(Q3e3,""))
				JsQuery("Q3e4") = noNull(array(Q3e4,""))
				JsQuery("Q3f1") = noNull(array(Q3f1,""))
				JsQuery("Q3f2") = noNull(array(Q3f2,""))
				JsQuery("Q3f3") = noNull(array(Q3f3,""))
				JsQuery("Q3f4") = noNull(array(Q3f4,""))
				JsQuery("Q4a") = noNull(array(Q4a,""))
				JsQuery("Q4b") = noNull(array(Q4b,""))
				JsQuery("Q4c") = noNull(array(Q4c,""))
				JsQuery("Q4d") = noNull(array(Q4d,""))
				JsQuery("Q5a") = noNull(array(Q5a,""))
				JsQuery("Q5b") = noNull(array(Q5b,""))
				JsQuery("Q6") = noNull(array(Q6,""))
				JsQuery("Q7a") = noNull(array(Q7a,""))
				JsQuery("Q7b") = noNull(array(Q7b,""))
				JsQuery("Q7c") = noNull(array(Q7c,""))
				JsQuery("Q8") = noNull(array(Q8,""))
				JsQuery("Q9") = noNull(array(Q9,""))
				JsQuery("Q10") = noNull(array(Q10,""))
				JsQuery("Q11a") = noNull(array(Q11a,""))
				JsQuery("Q11b") = noNull(array(Q11b,""))
				JsQuery("Q12") = noNull(array(Q12,""))
				JsQuery("Q13a1") = noNull(array(Q13a1,""))
				JsQuery("Q13a2") = noNull(array(Q13a2,""))
				JsQuery("Q13b1") = noNull(array(Q13b1,""))
				JsQuery("Q13b2") = noNull(array(Q13b2,""))
				JsQuery("Q13c1") = noNull(array(Q13c1,""))
				JsQuery("Q13c2") = noNull(array(Q13c2,""))
				JsQuery("Q14a") = noNull(array(Q14a,""))
				JsQuery("Q14b") = noNull(array(Q14b,""))
				JsQuery("Q14c") = noNull(array(Q14c,""))
				JsQuery("Q14d") = noNull(array(Q14d,""))
			else
				JsQuery("id_expNautic") = id_expNautic
				JsQuery("disabled") = disabled
				JsQuery("mySalutation_skipper") = repl34(mySalutation_skipper)
				JsQuery("myName_skipper") = repl34(myName_skipper)
				JsQuery("myFirstName_skipper") = repl34(myFirstName_skipper)
				JsQuery("myDate_naiss_skipper") = repl34(myDate_naiss_skipper)
				JsQuery("myLieu_naiss_skipper") = repl34(myLieu_naiss_skipper)
				JsQuery("myAddress_skipperOPE") = repl34(myAddress_skipperOPE)
				JsQuery("myAddress_skipper") = repl34(myAddress_skipper)
				JsQuery("myAddress2_skipperOPE") = repl34(myAddress2_skipperOPE)
				JsQuery("myAddress2_skipper") = repl34(myAddress2_skipper)
				JsQuery("myCity_skipperOPE") = repl34(myCity_skipperOPE)
				JsQuery("myCountry_skipper") = myCountry_skipper
				JsQuery("myCountry_skipperOPE") = myCountry_skipperOPE
				JsQuery("myCity_skipper") = repl34(myCity_skipper)
				JsQuery("myZipCode_skipperOPE") = repl34(myZipCode_skipperOPE)
				JsQuery("myZipCode_skipper") = repl34(myZipCode_skipper)
				JsQuery("myState_skipper") = repl34(myState_skipper)
				JsQuery("myState_skipperOpe") = repl34(myState_skipperOpe)
				JsQuery("myTel_skipper") = repl34(myTel_skipper)
				JsQuery("myMob_skipper") = repl34(myMob_skipper)
				JsQuery("myFax_skipper") = repl34(myFax_skipper)
				JsQuery("myEmail_skipperOpe") = repl34(myEmail_skipperOpe)
				JsQuery("myEmail_skipper") = repl34(myEmail_skipper)
				JsQuery("myIdentNum_skipper") = repl34(myIdentNum_skipper)
				JsQuery("myNation_skipper") = repl34(myNation_skipper)
				JsQuery("myComment_skipper") = repl34(myComment_skipper)
				JsQuery("mylicence") = repl34(mylicence)
				JsQuery("mylicence_type") = repl34(mylicence_type)
				JsQuery("mylicence_num") = repl34(mylicence_num)
				JsQuery("mylicence_off") = repl34(mylicence_off)
				JsQuery("mylicence_date") = repl34(mylicence_date)
				JsQuery("mylicence_until") = repl34(mylicence_until)
				JsQuery("mylicence_for") = repl34(mylicence_for)
				JsQuery("myVhf_radio") = repl34(myVhf_radio)
				JsQuery("myNb_year") = repl34(myNb_year)
				JsQuery("myNb_day") = repl34(myNb_day)
				JsQuery("mysans_equipage") = repl34(mysans_equipage)
				JsQuery("myhave_boat") = repl34(myhave_boat)
				JsQuery("mytype_boat") = repl34(mytype_boat)
				JsQuery("mylong_boat") = repl34(mylong_boat)
				JsQuery("myplace_boat") = repl34(myplace_boat)
				JsQuery("mycomment") = repl34(mycomment)
				
				JsQuery("fld_text_01") = noNull(array(fld_text_01,""))
				JsQuery("fld_int_01") = noNull(array(fld_int_01,""))
				JsQuery("fld_int_02") = noNull(array(fld_int_02,""))
				JsQuery("fld_int_03") = noNull(array(fld_int_03,""))
				JsQuery("fld_int_04") = noNull(array(fld_int_04,""))	
				JsQuery("fld_char_01") = noNull(array(fld_char_01,""))
				JsQuery("fld_char_02") = noNull(array(fld_char_02,""))
				JsQuery("fld_char_03") = noNull(array(fld_char_03,""))
				JsQuery("fld_char_04") = noNull(array(fld_char_04,""))
				JsQuery("fld_char_05") = noNull(array(fld_char_05,""))
				JsQuery("fld_char_06") = noNull(array(fld_char_06,""))
				JsQuery("fld_char_07") = noNull(array(fld_char_07,""))
				JsQuery("fld_char_08") = noNull(array(fld_char_08,""))
				JsQuery("fld_char_09") = noNull(array(fld_char_09,""))
				JsQuery("fld_char_10") = noNull(array(fld_char_10,""))
				JsQuery("fld_char_11") = noNull(array(fld_char_11,""))
				JsQuery("fld_char_12") = noNull(array(fld_char_12,""))
				JsQuery("fld_char_13") = noNull(array(fld_char_13,""))
				JsQuery("fld_char_14") = noNull(array(fld_char_14,""))
				JsQuery("fld_char_15") = noNull(array(fld_char_15,""))
				JsQuery("fld_char_16") = noNull(array(fld_char_16,""))
				JsQuery("fld_char_17") = noNull(array(fld_char_17,""))
				JsQuery("fld_char_18") = noNull(array(fld_char_18,""))
				JsQuery("fld_char_19") = noNull(array(fld_char_19,""))
				JsQuery("fld_char_20") = noNull(array(fld_char_20,""))
				JsQuery("fld_char_21") = noNull(array(fld_char_21,""))
				JsQuery("fld_char_22") = noNull(array(fld_char_22,""))
				JsQuery("fld_char_23") = noNull(array(fld_char_23,""))
				JsQuery("fld_char_24") = noNull(array(fld_char_24,""))
				JsQuery("fld_char_25") = noNull(array(fld_char_25,""))
				JsQuery("fld_char_26") = noNull(array(fld_char_26,""))
				JsQuery("fld_char_27") = noNull(array(fld_char_27,""))
				JsQuery("fld_char_28") = noNull(array(fld_char_28,""))
				JsQuery("fld_char_29") = noNull(array(fld_char_29,""))
				JsQuery("fld_char_30") = noNull(array(fld_char_30,""))
				JsQuery("fld_char_31") = noNull(array(fld_char_31,""))
				JsQuery("fld_char_32") = noNull(array(fld_char_32,""))
				JsQuery("fld_char_33") = noNull(array(fld_char_33,""))
				JsQuery("fld_char_34") = noNull(array(fld_char_34,""))
				JsQuery("fld_char_35") = noNull(array(fld_char_35,""))
				JsQuery("fld_char_36") = noNull(array(fld_char_36,""))
				JsQuery("fld_char_37") = noNull(array(fld_char_37,""))
				JsQuery("fld_char_38") = noNull(array(fld_char_38,""))
				JsQuery("fld_char_39") = noNull(array(fld_char_39,""))
				JsQuery("fld_char_40") = noNull(array(fld_char_40,""))
				JsQuery("fld_char_41") = noNull(array(fld_char_41,""))		
				JsQuery("vc_chp_01") = noNull(array(vc_chp_01,""))
				JsQuery("vc_chp_02") = noNull(array(vc_chp_02,""))
				JsQuery("vc_chp_03") = noNull(array(vc_chp_03,"")) 
				JsQuery("vc_chp_04") = noNull(array(vc_chp_04,""))
				JsQuery("vc_chp_05") = noNull(array(vc_chp_05,""))
				JsQuery("vc_chp_06") = noNull(array(vc_chp_06,""))
				JsQuery("vc_chp_07") = noNull(array(vc_chp_07,""))
				JsQuery("vc_chp_08") = noNull(array(vc_chp_08,""))
				JsQuery("vc_chp_09") = noNull(array(vc_chp_09,""))
				JsQuery("vc_chp_10") = noNull(array(vc_chp_10,""))
				JsQuery("vc_chp_11") = noNull(array(vc_chp_11,""))
				JsQuery("vc_chp_12") = noNull(array(vc_chp_12,""))
				
				JsQuery("mySalutation_equipier") = noNull(array(mySalutation_equipier,""))
				JsQuery("myName_equipier") = noNull(array(myName_equipier,""))
				JsQuery("myFirstName_equipier") = noNull(array(myFirstName_equipier,""))
				JsQuery("myDate_naiss_equipier") = noNull(array(myDate_naiss_equipier,""))
				JsQuery("myLieu_naiss_equipier") = noNull(array(myLieu_naiss_equipier,""))
				JsQuery("myAddress_equipierOPE") = noNull(array(myAddress_equipierOPE,""))
				JsQuery("myAddress_equipier") = noNull(array(myAddress_equipier,""))
				JsQuery("myAddress2_equipierOPE") = noNull(array(myAddress2_equipierOPE,""))
				JsQuery("myAddress2_equipier") = noNull(array(myAddress2_equipier,""))
				JsQuery("myCity_equipierOPE") = noNull(array(myCity_equipierOPE,""))
				JsQuery("myCity_equipier") = noNull(array(myCity_equipier,""))
				JsQuery("myZipCode_equipierOPE") = noNull(array(myZipCode_equipierOPE,""))
				JsQuery("myZipCode_equipier") = noNull(array(myZipCode_equipier,""))
				JsQuery("myCountry_equipierOPE") = noNull(array(myCountry_equipierOPE,""))
				JsQuery("myCountry_equipier") = noNull(array(myCountry_equipier,""))
				JsQuery("myTel_equipier") = noNull(array(myTel_equipier,""))
				JsQuery("myMob_equipier") = noNull(array(myMob_equipier,""))
				JsQuery("myIdentNum_equipier") = noNull(array(myIdentNum_equipier,""))
				JsQuery("myNation_equipier") = noNull(array(myNation_equipier,""))
				JsQuery("myBoat_equipier") = noNull(array(myBoat_equipier,""))
				JsQuery("myhave_boat_equipier") = noNull(array(myhave_boat_equipier,""))
				JsQuery("mytype_boat_equipier") = noNull(array(mytype_boat_equipier,""))
				JsQuery("mylong_boat_equipier") = noNull(array(mylong_boat_equipier,""))
				JsQuery("myplace_boat_equipier") = noNull(array(myplace_boat_equipier,""))
				JsQuery("myFax_equipier") = noNull(array(myFax_equipier,""))
				JsQuery("myEmail_equipier") = noNull(array(myEmail_equipier,""))
				JsQuery("myState_equipier") = noNull(array(myState_equipier,""))
				JsQuery("myState_equipierOPE") = noNull(array(myState_equipierOpe,""))
				JsQuery("myNb_year_equipier") = noNull(array(myNb_year_equipier,""))
			end if
				JsQuery("clientname") = ClientName
				JsQuery("datestart") = Datestart
				JsQuery("dateend") = Dateend
				JsQuery("modelname") = modelname
				JsQuery("departport") = Departport
				JsQuery("endport") = Endport
				JsQuery("Vberths") = LeDico("Vberths")
				JsQuery("lg_exportpdf_off") = LeDico("lg_exportpdf_off")
				JsQuery("lg_exportpdf_on") = LeDico("lg_exportpdf_on")
				JsQuery("lg_viewfile") = LeDico("lg_viewfile")
				JsQuery("lg_age") = LeDico("lg_age")
				JsQuery("nation") = LeDico("nation")
				JsQuery("dat") = LeDico("dat")
				JsQuery("lg_passport") = LeDico("lg_passport")
				JsQuery("Pointure") = LeDico("Pointure")
				JsQuery("lg_kinname") = LeDico("lg_kinname")
				JsQuery("lg_kinphone") = LeDico("lg_kinphone")
				JsQuery("lg_kinrelation") = LeDico("lg_kinrelation")
				JsQuery("All") = LeDico("All")
				JsQuery("lg_passbtn_import") = LeDico("lg_passbtn_import")
				JsQuery("lg_close") = LeDico("lg_close")
				JsQuery("lg_at") = LeDico("lg_at")
				JsQuery("DateEnd") = LeDico("DateEnd")
				JsQuery("lg_Match") = LeDico("lg_Match")
				JsQuery("lg_import_header") = LeDico("lg_import_header")
				JsQuery("Back") = LeDico("Back")
				JsQuery("lg_Import") = LeDico("lg_Import")
				JsQuery("lg_excel_import") = LeDico("lg_excel_import")
				JsQuery("lg_confirm_import") = LeDico("lg_confirm_import")
				JsQuery("lg_arrive_by") = LeDico("lg_arrive_by")
				JsQuery("lg_CommentACC") = LeDico("lg_CommentACC")
				JsQuery("lg_vtt") = LeDico("lg_vtt")
				JsQuery("lg_comm1") = LeDico("lg_comm1")
				JsQuery("lg_pcp") = LeDico("lg_pcp")
				JsQuery("lg_nva") = LeDico("lg_nva")
				JsQuery("lg_de") = LeDico("lg_de")
				JsQuery("tvers") = LeDico("tvers")
				JsQuery("lg_boatbuilder2") = LeDico("lg_boatbuilder2")
				JsQuery("lg_Relationship") = LeDico("lg_Relationship")
				JsQuery("lg_phone_number") = LeDico("lg_phone_number")
				JsQuery("lg_add_new_pass") = LeDico("lg_add_new_pass")
				JsQuery("lg_pass_empty")  = LeDico("lg_pass_empty")
				JsQuery("Add") = LeDico("Add")
				JsQuery("Delete") = LeDico("Delete")
				JsQuery("lg_DoYouWantToDelete") = LeDico("lg_DoYouWantToDelete")
				JsQuery("lg_paste") = LeDico("lg_paste")
				JsQuery("lg_doYouWantToCopy") = LeDico("lg_doYouWantToCopy")
				JsQuery("lg_copy_pass") = LeDico("lg_copy_pass")
				JsQuery("lg_gender") = LeDico("lg_gender")
				JsQuery("lg_no_file") = LeDico("lg_no_file")
				JsQuery("lg_file_last_book") = LeDico("lg_file_last_book")
				JsQuery("lg_delete_file") = LeDico("lg_delete_file")
				JsQuery("lg_addall") = LeDico("lg_addall")
				JsQuery("lg_skipper_import") = LeDico("lg_skipper_import")
				JsQuery("lg_boatinghistory_import") = LeDico("lg_boatinghistory_import")
				JsQuery("lg_coskipper_import") = LeDico("lg_coskipper_import")
				JsQuery("Mrs") = LeDico("Mrs")
				JsQuery("Miss") = LeDico("Miss")
				JsQuery("Mr") = LeDico("Mr")
				JsQuery("For_navigation") = LeDico("lg_LogExp_navigation")
				JsQuery("lg_LastName") = LeDico("lg_LastName")
				JsQuery("Prenom") = LeDico("Prenom")
				JsQuery("Birthdate") = LeDico("Birthdate")
				JsQuery("lg_placeofbirth") = LeDico("lg_placeofbirth")
				JsQuery("Address") = LeDico("Address")
				JsQuery("City") = LeDico("City")
				JsQuery("Zipcode") = LeDico("Zipcode")
				JsQuery("Country") = LeDico("Country")
				JsQuery("State") = LeDico("lg_State")
				JsQuery("Phone") = LeDico("Phone")
				JsQuery("Mobile") = LeDico("Mobile")
				JsQuery("lg_fax") = LeDico("lg_fax")
				JsQuery("lg_email") = LeDico("lg_email")
				JsQuery("lg_passport_no") = LeDico("lg_passport_no")
				JsQuery("nation") = LeDico("nation")
				JsQuery("commentss") = LeDico("commentss")
				JsQuery("SailLicence") = LeDico("SailLicence")
				JsQuery("lg_ye") = LeDico("lg_ye")
				JsQuery("lg_no") = LeDico("lg_no")
				JsQuery("WhichOne") = LeDico("WhichOne")
				JsQuery("lg_licencenum") = LeDico("lg_licencenum")
				JsQuery("lg_gni_capdiporto") = LeDico("lg_gni_capdiporto")
				JsQuery("lg_gni_entroleore") = LeDico("lg_gni_entroleore")
				JsQuery("lg_gni_valida") = LeDico("lg_gni_valida")
				JsQuery("NavigationExp") = LeDico("NavigationExp")
				JsQuery("NumOfDay") = LeDico("NumOfDay")
				JsQuery("HaveYouEver") = LeDico("HaveYouEver")
				JsQuery("AreYouOwner") = LeDico("AreYouOwner")
				JsQuery("Yes") = LeDico("Yes")
				JsQuery("No") = LeDico("No")
				JsQuery("BoatType") = LeDico("BoatType")
				JsQuery("lg_dequelletaille") = LeDico("lg_dequelletaille")
				JsQuery("Length") = LeDico("Length")
				JsQuery("lg_AdditionalComment") = LeDico("lg_AdditionalComment")
				JsQuery("lg_markskippernotfilled") = LeDico("lg_markskippernotfilled")
				JsQuery("lg_markskipperfilled") = LeDico("lg_markskipperfilled")
				JsQuery("Place") = LeDico("Place")
				JsQuery("lg_visibleuniquement") = LeDico("lg_visibleuniquement")
				JsQuery("lg_skipperbtn_import") = LeDico("lg_skipperbtn_import")
				JsQuery("lg_cvskipper_01") = LeDico("lg_cvskipper_01")
				JsQuery("lg_cvskipper_02") = LeDico("lg_cvskipper_02")
				JsQuery("lg_cvskipper_03") = LeDico("lg_cvskipper_03")
				JsQuery("lg_cvskipper_04") = LeDico("lg_cvskipper_04")
				JsQuery("lg_cvskipper_05") = LeDico("lg_cvskipper_05")
				JsQuery("lg_cvskipper_06") = LeDico("lg_cvskipper_06")
				JsQuery("lg_cvskipper_07") = LeDico("lg_cvskipper_07")
				JsQuery("lg_cvskipper_08") = LeDico("lg_cvskipper_08")
				JsQuery("lg_cvskipper_09") = LeDico("lg_cvskipper_09")
				JsQuery("lg_cvskipper_10") = LeDico("lg_cvskipper_10")
				JsQuery("lg_cvskipper_11") = LeDico("lg_cvskipper_11")
				JsQuery("lg_cvskipper_12") = LeDico("lg_cvskipper_12")
				JsQuery("lg_cvskipper_13") = LeDico("lg_cvskipper_13")
				JsQuery("lg_cvskipper_14") = LeDico("lg_cvskipper_14")
				JsQuery("lg_cvskipper_15") = LeDico("lg_cvskipper_15")
				JsQuery("lg_cvskipper_16") = LeDico("lg_cvskipper_16")
				JsQuery("lg_cvskipper_17") = LeDico("lg_cvskipper_17")
				JsQuery("lg_cvskipper_18") = LeDico("lg_cvskipper_18")
				JsQuery("lg_cvskipper_19") = LeDico("lg_cvskipper_19")
				JsQuery("lg_cvskipper_20") = LeDico("lg_cvskipper_20")
				JsQuery("lg_cvskipper_21") = LeDico("lg_cvskipper_21")
				JsQuery("lg_cvskipper_22") = LeDico("lg_cvskipper_22")
				JsQuery("lg_cvskipper_23") = LeDico("lg_cvskipper_23")
				JsQuery("lg_cvskipper_24") = LeDico("lg_cvskipper_24")
				JsQuery("lg_cvskipper_25") = LeDico("lg_cvskipper_25")
				JsQuery("lg_cvskipper_26") = LeDico("lg_cvskipper_26")
				JsQuery("lg_cvskipper_27") = LeDico("lg_cvskipper_27")
				JsQuery("lg_cvskipper_28") = LeDico("lg_cvskipper_28")
				JsQuery("lg_cvskipper_29") = LeDico("lg_cvskipper_29")
				JsQuery("lg_cvskipper_30") = LeDico("lg_cvskipper_30")
				JsQuery("lg_cvskipper_31") = LeDico("lg_cvskipper_31")
				JsQuery("lg_cvskipper_32") = LeDico("lg_cvskipper_32")
				JsQuery("lg_cvskipper_33") = LeDico("lg_cvskipper_33")
				JsQuery("lg_cvskipper_34") = LeDico("lg_cvskipper_34")
				JsQuery("lg_cvskipper_35") = LeDico("lg_cvskipper_35")
				JsQuery("lg_cvskipper_36") = LeDico("lg_cvskipper_36")
				JsQuery("lg_cvskipper_37") = LeDico("lg_cvskipper_37")
				JsQuery("lg_cvskipper_38") = LeDico("lg_cvskipper_38")
				JsQuery("lg_cvskipper_39") = LeDico("lg_cvskipper_39")
				JsQuery("lg_cvskipper_40") = LeDico("lg_cvskipper_40")
				JsQuery("lg_cvskipper_41") = LeDico("lg_cvskipper_41")
				JsQuery("lg_cvskipper_42") = LeDico("lg_cvskipper_42")
				JsQuery("lg_cvskipper_43") = LeDico("lg_cvskipper_43")
				JsQuery("lg_cvskipper_44") = LeDico("lg_cvskipper_44")
				JsQuery("lg_cvskipper_45") = LeDico("lg_cvskipper_45")
				JsQuery("lg_cvskipper_46") = LeDico("lg_cvskipper_46")
				JsQuery("lg_cvskipper_47") = LeDico("lg_cvskipper_47")
				JsQuery("lg_cvskipper_48") = LeDico("lg_cvskipper_48")
				JsQuery("lg_cvskipper_49") = LeDico("lg_cvskipper_49")
				JsQuery("lg_cvskipper_50") = LeDico("lg_cvskipper_50")
				JsQuery("lg_cvskipper_51") = LeDico("lg_cvskipper_51")
				JsQuery("lg_cvskipper_52") = LeDico("lg_cvskipper_52")
				JsQuery("lg_cvskipper_53") = LeDico("lg_cvskipper_53")
				JsQuery("lg_cvskipper_54") = LeDico("lg_cvskipper_54")
				JsQuery("lg_cvskipper_55") = LeDico("lg_cvskipper_55")
				JsQuery("lg_cvskipper_56") = LeDico("lg_cvskipper_56")
				JsQuery("lg_cvskipper_57") = LeDico("lg_cvskipper_57")
				JsQuery("Annee") = LeDico("Annee")
				JsQuery("lg_charterdates") = LeDico("lg_charterdates")
				JsQuery("Nom") = LeDico("Nom")
				JsQuery("lg_tel") = LeDico("lg_tel")
				JsQuery("lg_days") = LeDico("lg_days")
				JsQuery("Catamaran") = LeDico("Catamaran")
				JsQuery("lg_bd_title04") = LeDico("lg_bd_title04")
				JsQuery("Monohull") = LeDico("Monohull")
				JsQuery("lg_exp_nautique") = LeDico("lg_exp_nautique")
				JsQuery("lg_OptionSkipper") = LeDico("lg_OptionSkipper")
				JsQuery("CoSkipper") = LeDico("CoSkipper")
				JsQuery("Small_boats") = LeDico("Small_boats")
				JsQuery("Coast") = LeDico("Coast")
				JsQuery("Off_shore") = LeDico("Off_shore")
				
				JsQuery("lg_chartercode") = LeDico("lg_chartercode")
				JsQuery("BoatType") = LeDico("BoatType")
				JsQuery("lg_numberofcabins") = LeDico("lg_numberofcabins")
				JsQuery("lg_numberoftoilet") = LeDico("lg_numberoftoilet")
				JsQuery("lg_paxmaxpla") = LeDico("lg_paxmaxpla")
				JsQuery("lg_portin") = LeDico("lg_portin")
				JsQuery("lg_portout") = LeDico("lg_portout")
				JsQuery("lg_fax") = LeDico("lg_fax")
				JsQuery("WebSite") = LeDico("WebSite")
				JsQuery("lg_email") = LeDico("lg_email")
				JsQuery("lg_phone_number") = LeDico("lg_phone_number")
				JsQuery("Zipcode") = LeDico("Zipcode")
				JsQuery("City") = LeDico("City")
				JsQuery("Country") = LeDico("Country")
				JsQuery("Address") = LeDico("Address")
				JsQuery("inc_societe") = LeDico("inc_societe")
				JsQuery("lg_ard") = LeDico("lg_ard")
				JsQuery("lg_plattensailing_l39cG") = LeDico("lg_plattensailing_l39cG")
				JsQuery("lg_timeofarrival") = LeDico("lg_timeofarrival")
				JsQuery("lg_Transporation") = LeDico("lg_Transporation")
				
			JsQuery.Flush
	end if
End Function

Function UpdateSkipper()

	'for i=0 to 80000000
	'next
	column = GetColumnname(nam)
	if catamaran_fleet then
		if coskip&"a"="a" then coskip="0"
		If id_expNautic = "" then
					SQL = "INSERT INTO ExpNautic196 (" & column & ",id_Command,id_client,coskip) output inserted.id_exp196,inserted.coskip VALUES ('" & value & "', '" & id_Command & "' , '" & id_client & "', '" & coskip & "')"
					set rs = cn.Execute(SQL)	
					if not rs.eof then
						id_expNautic = rs(0)
						coskip = rs(1)
					end if
		else
				SQL = "UPDATE ExpNautic196 SET " & column & " = '" & value & "' WHERE id_Command = " & id_command & " AND coskip = " & coskip
				'response.write("<textarea>"&SQL&"</textarea>")
				cn.Execute(SQL)
				
		end if
		Set JsValue = jsObject()
				'JsValue("SQL") = SQL
				JsValue("coskip") = coskip
				JsValue("id_expNautic") = id_expNautic
				JsValue("nam") = nam
				JsValue("mass") = noNull(array(value,""))
				JsValue.Flush
	else
		
		If id_expNautic = "" then
					SQL = "INSERT INTO ExpNautic" & SQL_TYP & "(" & column & ",id_Command,id_client) output inserted.id_expNautic VALUES ('" & value & "', '" & id_Command & "' , '" & id_client & "')"
					set rs = cn.Execute(SQL)	
					if not rs.eof then
						id_expNautic = rs(0)
					end if
		else
				'if(SQL_TYP="agt") then id_command = id_commandAGT
				SQL = "UPDATE ExpNautic" & SQL_TYP & " SET " & column & " = '" & value & "' WHERE id_Command = " & id_command
				'response.write("<textarea>"&SQL&"</textarea>")
				cn.Execute(SQL)
	
		end if
		value = replace(value,"''","'")
		Set JsValue = jsObject()
				'JsValue("SQL") = SQL
				JsValue("id_expNautic") = id_expNautic
				JsValue("nam") = nam
				JsValue("mass") = noNull(array(value,""))
				JsValue.Flush
	end if
			
End Function

Function UpdateCommand()
	SQL = "UPDATE Command" & SQL_TYP & " SET skipper='"&up_com&"' WHERE id_command='"&id_command&"'"
	cn.Execute SQL
	skipper=up_com
	
	Set JsValue = jsObject()
			JsValue("skipper") = skipper
			JsValue.Flush
			
End Function

Function GetFiles(dir)
set jsnObj = jsObject()
set jsnObj("list_file") = jsArray()
	My_folder=split(dir,",")
	i=0
	'my_id = split(My_folder(0),"/")
	For Each item In My_folder
	my_id = split(My_folder(i),"/")
	    Set fsodd = server.CreateObject("Scripting.FileSystemObject")
		if fsodd.FolderExists(server.mappath(item)) = true then
			 set folder = fsodd.GetFolder(server.mappath(item))
			'loop
			for each obj_file in folder.Files
				'create json
				typ = Split(obj_file.name,".")
				icon=GetFAIcon(typ(ubound(typ)))
				set jsnObj("list_file")(null) = jsObject()
				jsnObj("list_file")(null)("id") = my_id(4)
				jsnObj("list_file")(null)("folder") = item
				jsnObj("list_file")(null)("name") = obj_file.name
				jsnObj("list_file")(null)("size") = obj_file.size
			Next
		end if
		i=i+1
	Next
	FilesExist = jsnObj.flush
response.end
			Set fsodd = server.CreateObject("Scripting.FileSystemObject")
		if fsodd.FolderExists(server.mappath(dir)) = true then
			 set folder = fsodd.GetFolder(server.mappath(dir))
			'loop
			set jsnObj = jsObject()
			set jsnObj("list_file") = jsArray()
			for each obj_file in folder.Files
				'create json
				typ = Split(obj_file.name,".")
				icon=GetFAIcon(typ(ubound(typ)))
				set jsnObj("list_file")(null) = jsObject()
				jsnObj("list_file")(null)("folder") = dir
				jsnObj("list_file")(null)("name") = obj_file.name
				jsnObj("list_file")(null)("size") = obj_file.size
			Next
			FilesExist = jsnObj.flush
		end if
	
End Function

Function CopyFiles(dir)

	dim fs
	set fs = Server.CreateObject("Scripting.FileSystemObject")
	if fs.FileExists(server.mappath(path_import)) then
		'response.write("FileExists")
		 fs.CopyFile server.mappath(path_import),server.mappath(dir)
		'response.write("deleted")
		Set JsValue = jsObject()
			JsValue("success") = "success"
			JsValue.Flush
	end if

end Function

Function DeleteFiles(dir)
	dim fs
	'response.write("delete")
	Set fsodd = server.CreateObject("Scripting.FileSystemObject")
	if fsodd.FileExists(server.mappath(dir)) then
		'response.write("FileExists")
		 fsodd.DeleteFile(server.mappath(dir))
		'response.write("deleted")
		Set JsValue = jsObject()
			JsValue("success") = "success"
			JsValue.Flush
	end if

End Function

Function GetColumnname(nam)

	' #### Start Skipper Info.
			if nam = "mySalutation_skipper" 	then column = "Salutation_skipper"
			if nam = "myName_skipper" 				then column = "Name_skipper"
			if nam = "myFirstName_skipper" 		then column = "FirstName_skipper"
			if nam = "myDate_naiss_skipper" 	then column = "Date_naiss_skipper"
			if nam = "myLieu_naiss_skipper" 	then column = "Lieu_naiss_skipper"
			if nam = "myAddress_skipperOPE"		then column = "Address_skipperOPE"
			if nam = "myAddress_skipper" 			then column = "Address_skipper"
			if nam = "myAddress2_skipperOPE" 	then column = "Address2_skipperOPE"
			if nam = "myAddress2_skipper" 		then column = "Address2_skipper"
			if nam = "myCity_skipperOPE" 			then column = "City_skipperOPE"
			if nam = "myCity_skipper" 				then column = "City_skipper"
			if nam = "myZipCode_skipperOPE" 	then column = "ZipCode_skipperOPE"
			if nam = "myZipCode_skipper" 			then column = "ZipCode_skipper"
			if nam = "myCountry_skipperOPE" 	then column = "Country_skipperOPE"
			if nam = "myCountry_skipper" 			then column = "Country_skipper"
			if nam = "myState_skipperOpe"			then column = "State_skipperOPE"
			if nam = "myState_skipper" 				then column = "State_skipper"
			if nam = "myTel_skipper" 					then column = "Tel_skipper"
			if nam = "myMob_skipper" 					then column = "Mob_skipper"
			if nam = "myFax_skipper" 					then column = "Fax_skipper"
			if nam = "myEmail_skipperOpe" 		then column = "Email_skipperOPE"
			if nam = "myEmail_skipper" 				then column = "Email_skipper"
			if nam = "myIdentNum_skipper" 		then column = "IdentNum_skipper"
			if nam = "myNation_skipper" 			then column = "Nation_skipper"
			if nam = "myComment_skipper" 			then column = "Comment_skipper"
			if nam = "mylicence" 							then column = "licence"
			if nam = "mylicence_type" 				then column = "licence_type"
			if nam = "mylicence_num" 					then column = "licence_num"
			if nam = "mylicence_off" 					then column = "licence_off"
			if nam = "mylicence_date" 				then column = "licence_date"
			if nam = "mylicence_until" 				then column = "licence_until"
			if nam = "mylicence_for" 					then column = "licence_for"
			if nam = "Vhf_radio"							then column = "Vhf_radio"
			if nam = "myNb_year" 							then column = "Nb_year"
			if nam = "myNb_day" 							then column = "Nb_day"
			if nam = "mysans_equipage" 				then column = "sans_equipage"
			if nam = "myhave_boat" 						then column = "have_boat"
			if nam = "mytype_boat" 						then column = "type_boat"
			if nam = "mylong_boat" 						then column = "long_boat"
			if nam = "myplace_boat" 					then column = "place_boat"
			if nam = "mycomment"							then column = "Comment"
	' #### End Skipper Info.
			
	' #### Start Boating History.
			if nam = "vc_chp_01"							then column = "vc_chp_01"
			if nam = "vc_chp_02"							then column = "vc_chp_02"
			if nam = "vc_chp_03"							then column = "vc_chp_03"
			if nam = "vc_chp_04"							then column = "vc_chp_04"
			if nam = "vc_chp_05"							then column = "vc_chp_05"
			if nam = "vc_chp_06"							then column = "vc_chp_06"	
			if nam = "vc_chp_07"							then column = "vc_chp_07"
			if nam = "vc_chp_08"							then column = "vc_chp_08"
			if nam = "vc_chp_09"							then column = "vc_chp_09"
			if nam = "vc_chp_10"							then column = "vc_chp_10"
			if nam = "vc_chp_11"							then column = "vc_chp_11"
			if nam = "vc_chp_12"							then column = "vc_chp_12"
			
			if nam = "fld_int_01"							then column = "fld_int_01"
			if nam = "fld_int_02"							then column = "fld_int_02"
			if nam = "fld_int_03"							then column = "fld_int_03"
			if nam = "fld_int_04"							then column = "fld_int_04"

			if nam = "fld_text_01"						then column = "fld_text_01"
			if nam = "fld_char_41"						then column = "fld_char_41"

			if nam = "fld_char_01"						then column = "fld_char_01"
			if nam = "fld_char_02"						then column = "fld_char_02"
			if nam = "fld_char_03"						then column = "fld_char_03"
			if nam = "fld_char_04"						then column = "fld_char_04"
			if nam = "fld_char_05"						then column = "fld_char_05"
			if nam = "fld_char_06"						then column = "fld_char_06"
			if nam = "fld_char_07"						then column = "fld_char_07"
			if nam = "fld_char_08"						then column = "fld_char_08"
			if nam = "fld_char_09"						then column = "fld_char_09"
			if nam = "fld_char_10"						then column = "fld_char_10"
			if nam = "fld_char_11"						then column = "fld_char_11"
			if nam = "fld_char_12"						then column = "fld_char_12"
			if nam = "fld_char_13"						then column = "fld_char_13"
			if nam = "fld_char_14"						then column = "fld_char_14"
			if nam = "fld_char_15"						then column = "fld_char_15"
			if nam = "fld_char_16"						then column = "fld_char_16"
			if nam = "fld_char_17"						then column = "fld_char_17"
			if nam = "fld_char_18"						then column = "fld_char_18"
			if nam = "fld_char_19"						then column = "fld_char_19"
			if nam = "fld_char_20"						then column = "fld_char_20"
			if nam = "fld_char_21"						then column = "fld_char_21"
			if nam = "fld_char_22"						then column = "fld_char_22"
			if nam = "fld_char_23"						then column = "fld_char_23"
			if nam = "fld_char_24"						then column = "fld_char_24"
			if nam = "fld_char_25"						then column = "fld_char_25"
			if nam = "fld_char_26"						then column = "fld_char_26"
			if nam = "fld_char_27"						then column = "fld_char_27"
			if nam = "fld_char_28"						then column = "fld_char_28"
			if nam = "fld_char_29"						then column = "fld_char_29"
			if nam = "fld_char_30"						then column = "fld_char_30"
			if nam = "fld_char_31"						then column = "fld_char_31"
			if nam = "fld_char_32"						then column = "fld_char_32"
			if nam = "fld_char_33"						then column = "fld_char_33"
			if nam = "fld_char_34"						then column = "fld_char_34"
			if nam = "fld_char_35"						then column = "fld_char_35"
			if nam = "fld_char_36"						then column = "fld_char_36"
			if nam = "fld_char_37"						then column = "fld_char_37"
			if nam = "fld_char_38"						then column = "fld_char_38"
			if nam = "fld_char_39"						then column = "fld_char_39"
			if nam = "fld_char_40"						then column = "fld_char_40"
	' #### End Boating History.
			
	' #### Start Co-Skipper Info.
			if nam = "mySalutation_equipier" 	then column = "Salutation_equipier"
			if nam = "myName_equipier" 				then column = "Name_equipier"
			if nam = "myFirstName_equipier" 	then column = "FirstName_equipier"
			if nam = "myDate_naiss_equipier" 	then column = "Date_naiss_equipier"
			if nam = "myLieu_naiss_equipier" 	then column = "Lieu_naiss_equipier"
			if nam = "myAddress_equipierOPE" 	then column = "Address_equipierOPE"
			if nam = "myAddress_equipier" 		then column = "Address_equipier"
			if nam = "myAddress2_equipierOPE" then column = "Address2_equipierOPE"
			if nam = "myAddress2_equipier"		then column = "Address2_equipier"
			if nam = "myCity_equipierOPE" 		then column = "City_equipierOPE"
			if nam = "myCity_equipier"				then column = "City_equipier"
			if nam = "myZipCode_equipierOPE" 	then column = "ZipCode_equipierOPE"
			if nam = "myZipCode_equipier" 		then column = "ZipCode_equipier"
			if nam = "myCountry_equipierOPE" 	then column = "Country_equipierOPE"
			if nam = "myCountry_equipier" 		then column = "Country_equipier"
			if nam = "myState_equipierOPE" 		then column = "State_equipierOPE"
			if nam = "myState_equipier" 			then column = "State_equipier"
			if nam = "myTel_equipier" 				then column = "Tel_equipier"
			if nam = "myMob_equipier" 				then column = "Mob_equipier"
			if nam = "myFax_equipier" 				then column = "Fax_equipier"
			if nam = "myEmail_equipier" 			then column = "Email_equipier"
			if nam = "myIdentNum_equipier" 		then column = "IdentNum_equipier"
			if nam = "myNation_equipier" 			then column = "Nation_equipier"
			if nam = "myNb_year_equipier" 		then column = "Nb_year_equipier"
			if nam = "myBoat_equipier" 				then column = "Boat_equipier"
			if nam = "myhave_boat_equipier" 	then column = "have_boat_equipier"
			if nam = "mytype_boat_equipier" 	then column = "type_boat_equipier"
			if nam = "mylong_boat_equipier" 	then column = "long_boat_equipier"
			if nam = "myplace_boat_equipier" 	then column = "place_boat_equipier"
	' #### End Co-Skipper Info.
	
	' #### Start Skipper196.
			if nam = "fld_01" 							then column = "Name"
			if nam = "fld_02"								then column = "SkName"
			if nam = "fld_03"								then column = "DDate"
			if nam = "fld_04"								then column = "Q1a"
			if nam = "fld_05"								then column = "Q1b"
			if nam = "fld_06"								then column = "Q1c"
			if nam = "fld_07"								then column = "Q1d"
			if nam = "fld_08"								then column = "Q3"
			if nam = "fld_09"								then column = "Q3a1"
			if nam = "fld_10"								then column = "Q3a2"
			if nam = "fld_11"								then column = "Q3a3"
			if nam = "fld_12"								then column = "Q3a4"
			if nam = "fld_13"								then column = "Q3b1"
			if nam = "fld_14"								then column = "Q3b2"
			if nam = "fld_15"								then column = "Q3b3"
			if nam = "fld_16"								then column = "Q3b4"
			if nam = "fld_17"								then column = "Q3c1"
			if nam = "fld_18"								then column = "Q3c2"
			if nam = "fld_19"								then column = "Q3c3"
			if nam = "fld_20"								then column = "Q3c4"
			if nam = "fld_21"								then column = "Q3d1"
			if nam = "fld_22"								then column = "Q3d2"
			if nam = "fld_23"								then column = "Q3d3"
			if nam = "fld_24"								then column = "Q3d4"
			if nam = "fld_25"								then column = "Q3e1"
			if nam = "fld_26"								then column = "Q3e2"
			if nam = "fld_27"								then column = "Q3e3"
			if nam = "fld_28"								then column = "Q3e4"
			if nam = "fld_29"								then column = "Q3f1"
			if nam = "fld_30"								then column = "Q3f2"
			if nam = "fld_31"								then column = "Q3f3"
			if nam = "fld_32"								then column = "Q3f4"
			if nam = "fld_33"								then column = "Q4a"
			if nam = "fld_34"								then column = "Q4b"
			if nam = "fld_35"								then column = "Q4c"
			if nam = "fld_36"								then column = "Q4d"
			if nam = "fld_37"								then column = "Q5a"
			if nam = "fld_38"								then column = "Q5b"
			if nam = "fld_39"								then column = "Q6"
			if nam = "fld_40"								then column = "Q7a"
			if nam = "fld_41"								then column = "Q7b"
			if nam = "fld_42"								then column = "Q7c"
			if nam = "fld_43"								then column = "Q8"
			if nam = "fld_44"								then column = "Q9"
			if nam = "fld_45"								then column = "Q10"
			if nam = "fld_46"								then column = "Q11a"
			if nam = "fld_48"								then column = "Q11b"
			if nam = "fld_49"								then column = "Q12"
			if nam = "fld_50"								then column = "Q13a1"
			if nam = "fld_51"								then column = "Q13b1"
			if nam = "fld_52"								then column = "Q13c1"
			if nam = "fld_53"								then column = "Q13a2"
			if nam = "fld_54"								then column = "Q13b2"
			if nam = "fld_55"								then column = "Q13c2"
			if nam = "fld_56"								then column = "Q14a"
			if nam = "fld_57"								then column = "Q14b"
			if nam = "fld_58"								then column = "Q14c"
			if nam = "fld_59"								then column = "Q14d"

		GetColumnname = column 'Return Column Name
End function

Function CreateElementGroup(size,id,name,value)
	if value<>"" then 
		element = "<tr class=""group""><td class=""strong"">"& name &"</td><td class=""val"">"&value&"</td></tr>"
	end if
	CreateElementGroup = element
End Function

Function CreateElementGroupComment(size,id,name,value)
	if value<>"" then 
		element = "<tr class=""group""><td class=""strong"" colspan=""2"">"& name &"</td></tr><tr class=""group""><td colspan=""2"" class=""val com"">"&value&"</td></tr>"
	end if
	CreateElementGroupComment = element
End Function

Function CreateElementGroupHeader(size,id,name)
	if name<>"" then 
		element = "<tr class=""group""><td class=""strong"" colspan=""2"">"& name &"</td></tr>"
	end if
	CreateElementGroupHeader = element
End Function

Function CreateTableWordBreak(text)
	element = "<table width='100%' cellspacing=""0"" cellpadding=""0""><thead>"&_
						"<th style='text-align:left'>"&text&"</th>"&_
						"</thead></table>"
	CreateTableWordBreak = element
End Function

Function CreateElement(size,id,name)
	if name<>"" then 
		element = "<div class='col-md-"&size&"'id='"&id&"'>"&name&"</div>"
	end if
	CreateElement = element
End Function

Function CreateTable196(Q3a1,Q3a2,Q3a3,Q3a4,Q3b1,Q3b2,Q3b3,Q3b4,Q3c1,Q3c2,Q3c3,Q3c4,Q3d1,Q3d2,Q3d3,Q3d4,Q3e1,Q3e2,Q3e3,Q3e4,Q3f1,Q3f2,Q3f3,Q3f4)
	Set d=Server.CreateObject("Scripting.Dictionary")
	d.Add "Row1",Row1
	d.Add "Row2",Row2
	d.Add "Row3",Row3
	d.Add "Row4",Row4
	d.Add "Q3a1",Q3a1
	d.Add "Q3a2",Q3a2
	d.Add "Q3a3",Q3a3
	d.Add "Q3a4",Q3a4
	d.Add "Q3b1",Q3b1
	d.Add "Q3b2",Q3b2
	d.Add "Q3b3",Q3b3
	d.Add "Q3b4",Q3b4
	d.Add "Q3c1",Q3c1
	d.Add "Q3c2",Q3c2
	d.Add "Q3c3",Q3c3
	d.Add "Q3c4",Q3c4
	d.Add "Q3d1",Q3d1
	d.Add "Q3d2",Q3d2
	d.Add "Q3d3",Q3d3
	d.Add "Q3d4",Q3d4
	d.Add "Q3e1",Q3e1
	d.Add "Q3e2",Q3e2
	d.Add "Q3e3",Q3e3
	d.Add "Q3e4",Q3e4
	d.Add "Q3f1",Q3f1
	d.Add "Q3f2",Q3f2
	d.Add "Q3f3",Q3f3
	d.Add "Q3f4",Q3f4
	if d.Item("Row1")>0 or d.Item("Row2")>0 or d.Item("Row3")>0 or d.Item("Row4")>0 then
		str = str & "<div class='col-md-12 table-responsive' style='margin-bottom:10px'>"
		str = str & "<table width='100%' align='center' id='table'>"
		str = str & "<thead><tr class='bg-info'>"
		str = str & "<th>YACHT BRAND & TYPE</th>"
		str = str & "<th>WHERE</th>"
		str = str & "<th>CHARTER COMPANY</th>"
		str = str & "<th>YACHT LENGTH</th>"
		str = str & "<th>SKIPPER/CREW</th>"
		str = str & "<th>MONTH/YEAR</th>"
		str = str & "</tr></thead><tbody>"
		for inc=1 to 4
			if d.Item("Row"&inc) > 0 then
				str = str & "<tr style='background-color:#FFFFFF'>"&_
										"<td class='text-center'>"&d.Item("Q3a"&inc)&"</td>"&_
										"<td class='text-center'>"&d.Item("Q3b"&inc)&"</td>"&_
										"<td class='text-center'>"&d.Item("Q3c"&inc)&"</td>"&_
										"<td class='text-center'>"&d.Item("Q3d"&inc)&"</td>"&_
										"<td class='text-center'>"&d.Item("Q3e"&inc)&"</td>"&_
										"<td class='text-center'>"&d.Item("Q3f"&inc)&"</td>"&_
										"</tr>"
			end if
		next
		str = str & "</tbody></table>"
		str = str & "</div>"
	end if
	set d = nothing
	
	CreateTable196 = str
End Function

Function CreateTable(title,value)
	str = str & "<div class='col-md-12 table-responsive' style=' margin-bottom:10px'>"
	str = str & "<table width='100%' id='table' align='center'>"
	str = str & "<thead><tr class='bg-info'>"
	for inc=1 to title.Count
		str = str & "<th>"&title.Item("Title"&inc)&"</th>"
	next
	str = str & "</tr></thead>"
	str = str & "<tbody>"
	for inc=1 to value.Count
		str = str & "<tr style='background-color:#FFFFFF;border:1px;'>"
		str = str & value.Item("Value"&inc)
		str = str & "</tr>"
	next
	str = str & "</tbody>"
	str = str & "</table>"
	str = str & "</div>"
	CreateTable = str
End Function

	Function CreatePDF()
		file_name = "SkipperInfo/pdf/"&refcom&".htm"
		Set fs = server.CreateObject("Scripting.FileSystemObject")
			if fs.FileExists(server.mappath(file_name)) Then
				Response.Redirect "create_pdf.php?file_name="&file_name&"&save_path="&save_path&"&refcom="&refcom&"&id_command="&id_command
			end if
	End Function
%>


<!-- #include file="../site/deconnect.asp" -->
