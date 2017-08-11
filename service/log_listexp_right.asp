<!-- #include file="../style/AVEImgClass.asp"-->
<!-- #include file="../search/connect.asp"-->
<!-- #include file="../site/lang.asp" -->
<!--#include file="../style/functions.asp"	 -->
<!-- #include file="../style/class.json.asp" -->
<!-- #include file="../style/class.json.util.asp" -->

<%
'##### START Crew-list need Parameters #####
'ss_styl
'clt_style
'ss_auto
'id_ope_com
'typ_command
'd_agt_cli
'##### END Crew-list need Parameters #####
	
	id_command = Request("id_command")
	typ_command = noNull(array(Request("typ_command"),"ope"))
	RefId = Request("RefId")
	ss_styl	= noNull(array(ss_styl,session("style")))
	SQL_TYP = ""
	if typ_command="agt" then SQL_TYP = "agt" else SQL_TYP=""

	Set	Jsdroits = jsObject()'Crew-list jsObj The Right
	Set JsAccess = jsObject()'Skipper jsObj The Right
	Set	JsProgress = jsObject()'All Progress of Command

	if id_command&"a" = "a" and typ_command = "ope" then
		ss_styl = ""
		SelectByRefId()
		Skipper_Right()
		VerifyAccess()
		CheckCommandLink()
		CrewList_Right()
		GetProg()
	else 
		VerifyAccess()
		Skipper_Right()
		id_command = Request("id_command")
	  typ_command = noNull(array(Request("typ_command"),"ope"))
		if typ_command="agt" then SQL_TYP = "agt" else SQL_TYP=""
	  CheckCommandLink()
		CrewList_Right()
		GetProg()
	end if
	
	
	Response.write "{""CrewList"":"
		Jsdroits.Flush
	Response.write ",""Skipper"":"
		JsAccess.Flush
	Response.write ",""Progress"":"
		JsProgress.Flush
	Response.write "}"
	
	Function VerifyAccess()
		if id_command&"a"<>"a" then
			if (ss_auto="2" or ss_auto="6" or ss_auto="1") then
				arr_access = VerifAxxCommand2(array(id_command,typ_command,ss_id_ope,ss_id_agt,ss_id_log,ss_id_cli,ss_auto,ss_styl,"0/1"))
			else
				arr_access = array(true)
			end if
			if not(dev_alex) then
				access = arr_access(0)
				if access=false then
					cod = "505"
					msg = arr_access(1)
				end if
			end if
			if not(access) then
				'Access Denied
				Set jsnObj = jsObject()
				jsnObj("code") = cod
				jsnObj("message") = msg
			if corscb&"a"<>"a" then	'corscb
				response.write corscb&"("
			end if
				jsnObj.flush
			if corscb&"a"<>"a" then	'corscb
				response.write ")"
			end if
				response.end
			end if
		else
			'Access Denied
			response.end
		end if
	End Function
	
	Function GetProg()
		SQL = "SELECT * FROM CommandProgress"&SQL_TYP&" WHERE id_command='"&id_command&"'"
		set rs = cn.Execute(SQL)	
				if not rs.eof then
					JsProgress("CW") = noNull(array(rs(0),0))
					JsProgress("SK") = noNull(array(rs(1),0))
					JsProgress("CO") = noNull(array(rs(2),0))
					JsProgress("AM") = noNull(array(rs(3),0))
					JsProgress("EM") = noNull(array(rs(4),0))
					JsProgress("UP") = noNull(array(rs(5),0))
					JsProgress("BH") = noNull(array(rs(6),0))	
				end if
	End Function
	
	Function SelectByRefId()
		typ_idc = Mid(RefId,1,1)
		RefId = Mid(RefId,2,Len(RefId))
		SQL_TYP = ""
		typ_command = "ope"
		if typ_idc = "A" then
			SQL_TYP = "AGT"
			typ_command = "agt"
		end if
		SQL = "SELECT id_command FROM Command"&SQL_TYP&" WHERE RefCom = '"&RefId&"'"
		'Response.write SQL
		'Response.end
		rs.open SQL,cn
				if not rs.eof then id_command = rs("id_command")
		rs.close

	End Function
	
	Function CheckCommandLink()
		if typ_command = "ope" then
			rs.open "SELECT id_commandAgt,skipper,paxlist,CA.refcom FROM CommandLink as CL "&_
									" INNER JOIN CommandAGt as CA ON CA.id_command = CL.id_commandagt "&_
									" WHERE id_commandOpe = " & id_command &_
									" UNION "&_
							"SELECT id_commandAgt,skipper,paxlist,CA.refcom FROM CommandLink as CL "&_
								" INNER JOIN CommandAGt as CA ON CA.id_command = CL.id_commandagt "&_
								" WHERE id_commandOpe2 = " & id_command ,cn
				if not rs.eof then 
						id_command  = rs("id_commandAgt")
						SQL_TYP     = "agt"
						skipper     = rs("skipper")
						paxlist     = rs("paxlist")
						typ_command = "agt"
						refcom      = rs("refcom")
				end if
			rs.close
			
		end if
		if typ_command="agt"   then SQL_TYP = "AGT"
	End Function
	
	Function CrewList_Right()
	
		SQL = "SELECT id_info FROM PassInfo"&SQL_TYP&" WHERE id_command='"&id_command&"'" 'Check row PassInfo
			'response.write SQL
			rs.open SQL,cn
				if not rs.eof then
					id_info = rs("id_info")
				end if
			rs.close
	
		SQL = "SELECT C.EtatFiche,C.skipper,C.paxlist,C.datestart,C.dateend,C.pax,C.refcom,C.id_client,CL.id_ope,CL.id_agt,CL.Salutation,CL.Name,CL.FirstName, "&_
	      " c.id_ope as id_ope_com, c.id_baseop, c.id_start, c.id_end, b.crew, B.id_owner, B.nbper, A.company, CL.id_opeagt, C.id_boat, C.id_cab, C.idcomm "&_
				"FROM Command" &SQL_TYP& " as C FULL OUTER JOIN CLIENT CL ON C.id_client = CL.id_client  FULL OUTER JOIN Boat B ON B.id_boat = C.id_boat LEFT OUTER JOIN Agent A ON CL.id_agt=A.id_agt WHERE id_command='"&id_command&"'"
		rs.open SQL,cn
			if not rs.eof then
				EtatFiche      = rs(0)
				skipper        = rs(1)
				paxlist        = rs(2)
				DateStart      = rs(3)
				DateEnd        = rs(4)
				pax 	         = rs(5)
				RefCom	       = rs(6)
				id_client      = rs(7)' used
				id_ope_cli     = rs(8)
				id_agt_cli     = rs(9) 'used
				Clt_Salutation = rs(10)
				Clt_Name	     = rs(11)
				Clt_FirstName	 = rs(12)
				id_ope_com	 	 = rs(13)'used
				id_baseop	 		 = rs(14)
				id_start	 		 = rs(15)
				id_end		 		 = rs(16)
				boatCrewed     = rs(17)
				id_owner       = rs(18)
				bt_NbPer       = rs(19)
				agt_comp       = rs(20)
				id_opeagt      = rs(21)
				id_boat        = rs(22)
				id_cab         = rs(23)
				idcomm         = rs(24)
			end if
		rs.close
		
			'++++++++ Check logic later
			if ss_styl&""="" then
				if id_ope_cli&""<>"0" then
					typ_idc = "O"&id_ope_cli
				else
					typ_idc = "A"&id_agt_cli
				end if
				ss_styl = typ_idc	
			end if
			'++++++++ Check logic later
	%>
	<!-- #include file = "../search/log_list_droits.asp" -->
	<%
		ss_auto = session("auto")
		if ss_auto&"" <> "" then
			if ss_auto = 6 then
				stat_user = "broker"
			elseif ss_auto = 2 then
				stat_user = "ope"
				else
				stat_user = false
			end if
		end if
		
		'Nut add 23/06/2017
		clss_city = "none"
		clss_state = "none"
		clss_zipcode = "none"
		clss_country = "none"
		
		if id_ope_com = "196" then
			clss_kname = "none"
			clss_kphone = "none"
			clss_krelation = "none"
			clss_sailng = "none"
			clss_mobile = "none"
			
			clss_city = ""
			clss_state = ""
			clss_zipcode = ""
			clss_country = ""
			
			if id_info&"" = "" then clss_ArrivalToMarina = "none"
			affich_ferry    = true
			affich_roadtown = true
			abrev_base      = "SST"
			affich_departt  = true
			
			if id_cab<>"0" then
				select case id_base_depart
					case 1359 ' St Martin
						affich_ferry    = false
						abrev_base      = "SXM"
						affich_roadtown = false
					case 1416,1417 ' Abacos
						affich_ferry = false
						abrev_base   = "MHH"
					case 1508 ' Cancun
						affich_ferry = false			
						abrev_base   = "CUN"
				end select
			end if
			
			if id_owner=517 then 
				affich_roadtown = false
				affich_departt  = false
			end if
			
			if id_ope_com&""="333" then
				affich_roadtown = false
			end if 
		end if
		'End Nut 23/06/2017
		
		'Set	Jsdroits = jsObject()
				Jsdroits("Access") = affich_access
				Jsdroits("Address") = affich_address
				Jsdroits("AddressOpe") = affich_addressOPE
				Jsdroits("EmailOpe") = affich_addmailOPE
				Jsdroits("Cl_Ind") = affich_clientind
				Jsdroits("Cl_Info") = affich_cl_info
				Jsdroits("VDate") = affich_vdate
				Jsdroits("Cl_ListPass") = affich_cl_listp
				Jsdroits("PolygLot") = affich_polyglot
				Jsdroits("Emergenc") = affich_emergenc
				Jsdroits("ImportOld") = affich_import_old
				Jsdroits("StatLive") = stat_user
				Jsdroits("id_client") = id_client
				Jsdroits("ss_styl") = ss_styl
				Jsdroits("affich_ferry")    = affich_ferry
				Jsdroits("affich_roadtown") = affich_roadtown
				Jsdroits("abrev_base")      = abrev_base
				Jsdroits("affich_departt")  = affich_departt
				
				Jsdroits("clss_taxi_trans") = clss_taxi_trans
				Jsdroits("clss_pointure") = clss_pointure    
				Jsdroits("clss_validity") = clss_validity    
				Jsdroits("clss_mobile") = clss_mobile      
				Jsdroits("clss_birthplace") = clss_birthplace  
				Jsdroits("clss_dep_time") = clss_dep_time    
				Jsdroits("clss_basedep_time") = clss_basedep_time
				Jsdroits("clss_dep_trans") = clss_dep_trans   
				Jsdroits("clss_polyglot") = clss_polyglot    
				Jsdroits("clss_Enprovde") = clss_Enprovde    
				Jsdroits("clss_Adestde") = clss_Adestde     
				Jsdroits("clss_datestart") = clss_datestart	
				Jsdroits("clss_arrival_time") = clss_arrival_time	
				Jsdroits("clss_phr_arr_time") = clss_phr_arr_time
				Jsdroits("clss_nbpers") = clss_nbpers				
				Jsdroits("clss_arrfligNumb") = clss_arrfligNumb
				Jsdroits("clss_hotel_prior") = clss_hotel_prior
				Jsdroits("clss_vberths") = clss_vberths		
				
				Jsdroits("clss_nation") = clss_nation
				Jsdroits("clss_residence") = clss_residence 'Nut add 31/05/2017
				Jsdroits("clss_typecrew") = clss_typecrew 'Nut add 31/05/2017
				Jsdroits("clss_city") = clss_city
				Jsdroits("clss_state") = clss_state
				Jsdroits("clss_zipcode") = clss_zipcode
				Jsdroits("clss_country") = clss_country
				Jsdroits("clss_passpo") = clss_passpo
				Jsdroits("clss_validi") = clss_validi
				Jsdroits("clss_pointu") = clss_pointu
				Jsdroits("clss_birfda") = clss_birfda
				Jsdroits("clss_ageage") = clss_ageage
				Jsdroits("clss_sailng") = clss_sailng
				Jsdroits("clss_sexual") = clss_sexual
				Jsdroits("clss_kname") = clss_kname
				Jsdroits("clss_kphone") = clss_kphone
				Jsdroits("clss_krelation") = clss_krelation
				
				Jsdroits("clss_emercountry") = clss_emercountry 'Nut add 01/06/2017
				
				Jsdroits("clss_button_print") = clss_button_print
				Jsdroits("button_print_v2") = button_print_v2
				Jsdroits("SpecilaCondition") = SpecilaArrivalToMarina
				
				Jsdroits("clss_ArrivalToMarina") = clss_ArrivalToMarina
				
				Jsdroits("id_info") =  noNull(array(id_info,"none"))
				
			Set Jsdroits("CheckCommandLink") = jsObject()
					Jsdroits("CheckCommandLink")("id_command") = id_command
					Jsdroits("CheckCommandLink")("typ_command") = typ_command
					Jsdroits("CheckCommandLink")("SQL_TYP") = SQL_TYP
					'Jsdroits.Flush
					
	End function	
	
	Function Skipper_Right()
		call TrackingAdd("Booking - Sailing experience")
		id_ListPas  = request("id_ListPas")
		HideAdmin   = request("HideAdmin")

'		if not(dejacharger) then
'			id_command    = request("id_command")
'			typ_command   = request("typ_command")
'		ss_styl = session("style")
'			form_action   = "log_exp.asp"
'		end if

		ss_id_agt	 = noNull(array(ss_id_agt,session("id_agt")))
		ss_id_ope	 = noNull(array(ss_id_ope,session("id_ope")))
		ss_themes	 = noNull(array(ss_themes,session("themes")))
		ss_auto		 = noNull(array(ss_auto,session("auto")))
		ss_lang		 = noNull(array(ss_lang,session("lang")))
		ss_Croisiere		 = noNull(array(noNull(array(ss_Croisiere,request("Croisiere"))),""))
		ss_Croisiereb		 = noNull(array(noNull(array(ss_Croisiereb,request("Croisiereb"))),""))
		
		disnocoskip    = request("disnocoskip")
		id_expNautic   = request("id_expNautic")
		
		if id_expNautic<>"" and id_command="" then
			SQL = "SELECT id_command FROM Expnautic" & SQL_TYP & " WHERE id_expNautic = " & id_expNautic
			rs.open SQL,cn
				if not rs.eof then id_command = rs("id_command")
			rs.close
		end if

		skipper  = "0"
		newid_EN = false

		'call verifIdURL(array(id_command))
		SQL = " SELECT CO.etatfiche,CO.skipper,CO.paxlist,CO.datestart,CO.id_client,CO.pax, CL.id_agt,CO.id_ope,CL.lang,CL.id_ope as id_ope_cli,CO.refcom, CO.id_boat, "&_
		" CO.id_baseop, CO.id_start, CO.id_end, CO.id_devise, CL.id_opeagt, CO.IdComm "&_
		" FROM Command" & SQL_TYP & " As CO FULL OUTER JOIN "&_
		" Client as CL ON CO.id_client=CL.id_client "&_
		" WHERE id_command='" & id_command & "' "
		rs.open SQL,cn
		if not rs.eof then 
				EtatFiche  = rs(0)
				skipper    = rs(1)
				paxlist    = rs(2)
				DateStart  = rs(3)
				id_client  = rs(4)
				pax        = rs(5)
				id_agt     = rs(6)
				id_ope_com = rs(7)
				clt_lang   = rs(8)
				id_agt_cli = rs(6)
				id_ope_cli = rs(9)
				refcom     = rs(10)
				id_boat	   = rs(11)
				
				id_baseop = rs(12)
				id_start 	= rs(13)
				id_end 		= rs(14)
				id_devise = rs(15)
		
				id_opeagt = rs(16)
				idcomm = rs(17)
				end if
		rs.close
		
		if getListAgtDirect(array(id_agt_cli)) and typ_command="ope" then
			resID = getIDsFromLogin(array(id_agt_cli,id_ope_cli,id_opeagt))
			id_agt_cli = resID(0)
			id_ope_cli = resID(1)
		end if			

		arrPorts = GetPorts(ss_lang,id_baseop,id_start,id_end)
		id_country = arrPorts(6)
		
		sql = "Select model,crew from boat where id_boat="&id_boat&""
		rs.open sql,cn
			if not rs.eof then
				TheBoatModel = rs("model")
				crew = rs("crew")
			end if
		rs.close

		if typ_command="ope" then 
			SQL = "SELECT id_commandAgt,skipper,paxlist,CA.refcom FROM CommandLink as CL "&_
						" INNER JOIN CommandAGt as CA ON CA.id_command = CL.id_commandagt "&_
						" WHERE id_commandOpe = " & id_command &_
						" UNION "&_
						"SELECT id_commandAgt,skipper,paxlist,CA.refcom FROM CommandLink as CL "&_
						" INNER JOIN CommandAGt as CA ON CA.id_command = CL.id_commandagt "&_
						" WHERE id_commandOpe2 = " & id_command
						
			rs.open SQl,cn
				if not rs.eof then 
					id_command  = rs("id_commandAgt")
					SQL_TYP     = "agt"
					skipper     = rs("skipper")
					paxlist     = rs("paxlist")
					typ_command = "agt"
					refcom      = rs("refcom")
				end if
			rs.close
		end if
		
		if request("ZeEtape")&""="" then
			id_agt = ss_id_agt
			call LogAction(42,"")
		end if
		
		'++++++++ Check logic later
		if ss_styl&""="" then
			if id_ope_cli&""<>"0" then
				typ_idc = "O"&id_ope_cli
			else
				typ_idc = "A"&id_agt_cli
			end if
			ss_styl = typ_idc	
		end if
		'++++++++ Check logic later
%>
<!-- #include file="log_exp_droits.asp" -->
<%
		catamaran_fleet = false
		if id_ope_com = "196" then
			catamaran_fleet = true
			if lcase(TheBoatModel)=lcase("Lagoon 500") or lcase(TheBoatModel)=lcase("Lagoon 52") then
				affich_coskipper = true
			else
				affich_coskipper = false
			end if
		end if
		
		if typ_command&"" = "agt" then
			id_agt_com = id_agt_cli
		end if
					'Set JsAccess = jsObject()
							JsAccess("idcomm") = idcomm
							JsAccess("id_country") = id_country
							JsAccess("affich_coskipper") = affich_coskipper
							JsAccess("TheBoatModel") = TheBoatModel
							JsAccess("clt_style") = clt_style
							JsAccess("SQL_TYP") = SQL_TYP
							JsAccess("skipper") = skipper
							JsAccess("paxlist") = paxlist
							JsAccess("typ_command") = typ_command
							JsAccess("refcom") = refcom
							JsAccess("affich_access") = affich_access
							JsAccess("ss_id_ope") = ss_id_ope
							JsAccess("ss_id_agt") = ss_id_agt
							JsAccess("ss_id_log") = ss_id_log
							JsAccess("ss_auto") = ss_auto
							JsAccess("ss_styl") = ss_styl
							JsAccess("id_client") = id_client
							JsAccess("id_agt_com") = id_agt_com
							JsAccess("id_ope_com") = id_ope_com
							JsAccess("id_command") = id_command
							JsAccess("SQL_TYP") = ""+SQL_TYP+""
							JsAccess("clss_eric") = clss_eric
							JsAccess("clss_Nb_day") = clss_Nb_day
							JsAccess("clss_haveyouever") = clss_haveyouever
							JsAccess("clss_boattype") = clss_boattype
							JsAccess("clss_date_naiss_skipper") = clss_date_naiss_skipper
							JsAccess("clss_lieu_naiss_skipper") = clss_lieu_naiss_skipper
							JsAccess("clss_address_skipper") = clss_address_skipper
							JsAccess("clss_zipcode_skipper") = clss_zipcode_skipper
							JsAccess("clss_city_skipper") = clss_city_skipper
							JsAccess("clss_country_skipper") = clss_country_skipper
							JsAccess("clss_tel_skipper") = clss_tel_skipper
							JsAccess("clss_fax_skipper") = clss_fax_skipper
							JsAccess("clss_email_skipper") = clss_email_skipper
							JsAccess("clss_experience2") = clss_experience2
							JsAccess("clss_identnum_skipper") = clss_identnum_skipper
							JsAccess("clss_nation_skipper") = clss_nation_skipper
							JsAccess("clss_state_skipper") = clss_state_skipper
							JsAccess("clss_address2_skipper") = clss_address2_skipper
							JsAccess("clss_mob_skipper") = clss_mob_skipper
							JsAccess("affich_bt_mark") = affich_bt_mark
							
							JsAccess("clss_date_naiss_equipier") = clss_date_naiss_equipier
							JsAccess("clss_address_equipier") = clss_address_equipier
							JsAccess("clss_zipcode_equipier") = clss_zipcode_equipier
							JsAccess("clss_city_equipier") = clss_city_equipier
							JsAccess("clss_country_equipier") = clss_country_equipier
							JsAccess("clss_tel_equipier") = clss_tel_equipier
							JsAccess("clss_mob_equipier") = clss_mob_equipier
							JsAccess("clss_fax_equipier") = clss_fax_equipier
							JsAccess("clss_email_equipier") = clss_email_equipier
							JsAccess("clss_identnum_equipier") = clss_identnum_equipier
							JsAccess("clss_nation_equipier") = clss_nation_equipier
							JsAccess("clss_licence") = clss_licence
							JsAccess("clss_licence_type") = clss_licence_type
							JsAccess("clss_licence_num") = clss_licence_num
							JsAccess("clss_licence_off") = clss_licence_off
							JsAccess("clss_licence_date") = clss_licence_date
							JsAccess("clss_licence_until") = clss_licence_until
							JsAccess("clss_licence_for") = clss_licence_for
							JsAccess("clss_vhf_radio") = clss_vhf_radio
							JsAccess("clss_nb_year_equipier") = clss_nb_year_equipier
							JsAccess("clss_boat_equipier") = clss_boat_equipier
							JsAccess("clss_experience") = clss_experience
							JsAccess("clss_experience_equipier") = clss_experience_equipier
							JsAccess("clss_have_boat_equipier") = clss_have_boat_equipier
							JsAccess("clss_type_boat_equipier") = clss_type_boat_equipier
							JsAccess("clss_long_boat_equipier") = clss_long_boat_equipier
							JsAccess("clss_place_boat_equipier") = clss_place_boat_equipier
							JsAccess("clss_comment") = clss_comment
							JsAccess("clss_lieu_naiss_equipier") = clss_lieu_naiss_equipier
							JsAccess("clss_state_equipier") = clss_state_equipier
							JsAccess("clss_address2_equipier") =clss_address2_equipier 
							JsAccess("clss_equipier") = clss_equipier
							JsAccess("affich_addressOPE") = affich_addressOPE
							JsAccess("crew") = crew
							JsAccess("catamaran_fleet") = catamaran_fleet
							'JsAccess.Flush
							 'JsAccess.Flush
	End function
		
%>
<!-- #include file="../site/deconnect.asp" -->