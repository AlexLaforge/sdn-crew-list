<!-- #include file="../style/AVEImgClass.asp"-->
<!-- #include file="../search/connect.asp"-->
<!-- #include file="../site/lang.asp" -->
<!-- #include file="../style/Functions.asp" -->
<!-- #include file="../style/class.json.asp" -->
<!-- #include file="../style/class.json.util.asp" -->
<%

	SQL_TYP     	= noNull(array(Request("SQL_TYP"),""))
	id_command 	  = request("id_command")
	typ_command   = request("typ_command")
	id_client 		= request("id_client")
	ACC_TYP  			= request("ACC_TYP")
	text    			= request("text")
	typ    				= request("typ")
	
	if typ = "get" then
		'[START] Check Virtual Fleet Ham 24/07/2017
		if CheckBooking_VirtualFleet() = 1 and 1 then
			'### if it's is Virtual Fleet update autometic give Access Crew-list and Skipper info
			text = 2 'Access
			ACC_TYP = "PS"
			UpdateAccess("response-off")
			ACC_TYP = "SK"
			UpdateAccess("response-off")
		end if
		'[END] Check Virtual Fleet
		
		SelectAccess()
	elseif typ = "update"  then
		UpdateAccess("json")
	end if
	
	Function CheckBooking_VirtualFleet()'Fucntion Check Virtual Fleet Ham 24/07/2017
		Status = 0
		SQL = "SELECT id_ope,paxlist,skipper FROM Command"&SQL_TYP&" WHERE id_command = '"&id_command&"'"
		rs.open SQL,cn
			if not rs.eof then
				arr = rs.GetRows()
				id_agt  = arr(0,0)
				paxlist = arr(1,0)
				skipper = arr(2,0)
			end if
		rs.close
		
		if id_agt = "86" and (paxlist = "1" or skipper = "1") then'if not have access
			Status = 1
		end if
		'### Status = 1 'if Virtual Fleet and crew-list or skiper have no access
		'### Status = 0 'it's not Virtual Fleet or it's Virtual Fleet crew-list and skiper info have access
		CheckBooking_VirtualFleet = Status
	End Function
	
	Function SelectAccess()
		SQL = "SELECT paxlist,skipper FROM Command"&SQL_TYP&" WHERE id_command="&id_command
		'response.write SQL
		set rs = cn.Execute(SQL)	
					if not rs.eof then
						SQL = "SELECT id_agt, id_ope, id_opeagt FROM client where id_client ="&id_client
						set rs2 = cn.Execute(SQL)	
						
						DirectClient = ""
						if rs2(0) <> "0" and  rs2(1) = "0" then 
							DirectClient = "agt"
						elseif rs2(0) = "0" and  rs2(1) <> "0" then
							DirectClient = "ope"
						end if
						
						
						Set	JsMass = jsObject()
								JsMass("PS") = rs(0)
								JsMass("SK") = rs(1)
								JsMass("DirectClient") = DirectClient
								JsMass("Style") = session("auto")
								JsMass("rs2(0)") = rs2(0)
								JsMass("rs2(1)") = rs2(1)
								JsMass.Flush	
					end if			
	End Function
	
	Function UpdateAccess(typ)
		AccTable = ""
		doc_access = ""
		if ACC_TYP&"" = "PS" then
			AccTable = "paxlist"
			doc_access = "crewlist"
		elseif ACC_TYP&"" = "SK" then
			AccTable = "skipper"
			doc_access = "skipper"
		end if
		
		SQL = "UPDATE Command"&SQL_TYP&" SET "&AccTable&"="&text&" WHERE id_command="&id_command
		'response.write SQL
		cn.Execute(SQL)	
		SQL = " INSERT INTO HistoryCrewlistAccess (id_command,typ_command,id_log,access,doc_access,dateauto_historyaccess) "&_
					"VALUES ("&id_command&",'"&typ_command&"',"&ss_id_log&","&text&",'"&doc_access&"',getDate())"
		'response.write SQL
		cn.Execute(SQL)
		
		if typ = "json" then
			Set	JsMass = jsObject()
					JsMass("mass") = text
					JsMass.Flush	
		end if
		
	End Function

%>
<!-- #include file="../site/deconnect.asp" -->