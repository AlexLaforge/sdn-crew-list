<!-- #include file="../style/AVEImgClass.asp"-->
<!-- #include file="../search/connect.asp"-->
<!-- #include file="../site/lang.asp" -->
<!-- #include file="../style/Functions.asp" -->
<!-- #include file="../style/class.json.asp" -->
<!-- #include file="../style/class.json.util.asp" -->
<%
	id_command  = request("id_command")
	typ_command = request("typ_command")
	SQL_TYP = noNull(array(Request("SQL_TYP"),""))
	typ     = request("typ")
	Id_Info = request("Id_Info")
	name    = request("name")
	text    = FromUTF8(Replace(base64_decode(request("text")),"'","''"))
	
	if typ = "get" then
		if Id_Info <> "none"  then
			GetEmergencyInfo()
		else
			FakeInfo()
		end if
	elseif typ = "changeEm" then
		if Id_Info <> "none"  then
			UpdateEmergencyInfo()
		else
			InsetPassInfo()
		end if
	elseif typ = "changeAtm" then
		if Id_Info <> "none"  then
			UpdateArrivalToMarina()
		else
			InsetPassInfo()
		end if
	elseif typ = "changeComment" then
		if Id_Info <> "none"  then
			UpdateComment()
		else
			InsetPassInfo()
		end if
	end if
	
	Function InsetPassInfo()
		if name = "EmName" then
			ColumnName = "pi_emer_name"
		elseif name = "EmRalationship" then
			ColumnName = "pi_emer_relationship"
		elseif name = "EmAddress" then
			ColumnName = "pi_emer_address"
		elseif name = "EmCountry" then'Nut add 01/06/2017
			ColumnName = "pi_emer_country"
		elseif name = "EmCity" then
			ColumnName = "pi_emer_city"
		elseif name = "EmPhone1" then
			ColumnName = "pi_emer_phone"
		elseif name = "EmPhone2" then
			ColumnName = "pi_emer_phone2"
		elseif name = "ATM_Access" then
			ColumnName = "acces"
		elseif name = "ATM_Taxi" then 
			ColumnName = "taxi_trans"
		elseif name = "ATM_DateStart" then
			ColumnName = "datestart"
		elseif name = "ATM_Arrival_Time" then
			ColumnName = "arrival_time"
		elseif name = "ATM_Flight_From" then
			ColumnName = "Enprovde"
		elseif name = "ATM_Flight_Number" then
			ColumnName = "arrfligNumb"
		elseif name = "ATM_Flight_To" then
			ColumnName = "Adestde"
		elseif name = "ATM_AmountCrew" then
			ColumnName = "nbpers"
		elseif name = "ATMCommentACC" then
			ColumnName = "acces_comment"
		elseif name = "HotelPrior" then 
			ColumnName = "hotel_prior"
		elseif name = "Vberths" then 
			ColumnName = "vberths"
		elseif name = "Comment" then
			ColumnName = "comment"
		end if
		
		SQL = "INSERT INTO PassInfo"&SQL_TYP&"  ("&ColumnName&",id_command) OUTPUT inserted.id_info values('"&text&"','"&id_command&"')"
		'response.write SQL
		'response.end
		set rs = cn.Execute(SQL)	
					if not rs.eof then
						Set	JsMass = jsObject()
								JsMass("Add") = rs(0)
								JsMass.Flush	
					end if
	End Function
	
	Function FakeInfo()
		Set	JsPass = jsObject()
				JsPass("ATM_Access") =""
				JsPass("Access_Comment") = ""
				JsPass("Comment") = ""
				JsPass("ATM_Taxi") = ""
				JsPass("ATM_AmountCrew") = ""
				JsPass("ATM_DateStart") = ""
				JsPass("ATM_Arrival_Time") =""
				JsPass("ATM_Flight_Number") =""
				JsPass("ATM_Flight_From") = ""
				JsPass("ATM_Flight_To") =""
				JsPass("Vberths") =""
				JsPass("Hotel") =""
				JsPass("DepTran") =""
				JsPass("DepTime") =""
				JsPass("BaseDepTime") = ""
				JsPass("EM_Name") = ""
				JsPass("EM_Relationship") =""
				JsPass("EM_Address") =""
				JsPass("EM_City") =""
				JsPass("EM_Phone") = ""
				JsPass("EM_Phone2") = ""
				JsPass("Id_Comm") = ""
				JsPass("Id_Command") =""
				JsPass("Id_Info") =""
		Set JsPass("Vihecle") = jsArray()
				Vihecle = getAccesCrewList(array())
				
				for inc = 0 to ubound(Vihecle)
					Set JsPass("Vihecle")(null) = jsObject()
							JsPass("Vihecle")(null)("id") = inc
							JsPass("Vihecle")(null)("name") = Vihecle(inc)
				next				
		
		JsPass.Flush
	End Function
	
	Function GetEmergencyInfo()
		if name = "EmName" then
			ColumnName = "pi_emer_name"
		elseif name = "EmRalationship" then
			ColumnName = "pi_emer_relationship"
		elseif name = "EmAddress" then
			ColumnName = "pi_emer_address"
		elseif name = "EmCountry" then'Nut add 01/06/2017
			ColumnName = "pi_emer_country"
		elseif name = "EmCity" then
			ColumnName = "pi_emer_city"
		elseif name = "EmPhone1" then
			ColumnName = "pi_emer_phone"
		elseif name = "EmPhone2" then
			ColumnName = "pi_emer_phone2"
		elseif name = "ATM_Access" then
			ColumnName = "acces"
		elseif name = "ATM_Taxi" then 
			ColumnName = "taxi_trans"
		elseif name = "ATM_DateStart" then
			ColumnName = "datestart"
		elseif name = "ATM_Arrival_Time" then
			ColumnName = "arrival_time"
		elseif name = "ATM_Flight_From" then
			ColumnName = "Enprovde"
		elseif name = "ATM_Flight_Number" then
			ColumnName = "arrfligNumb"
		elseif name = "ATM_Flight_To" then
			ColumnName = "Adestde"
		elseif name = "ATM_AmountCrew" then
			ColumnName = "nbpers"
		elseif name = "ATMCommentACC" then
			ColumnName = "acces_comment"
		elseif name = "HotelPrior" then 
			ColumnName = "hotel_prior"
		elseif name = "Vberths" then 
			ColumnName = "vberths"
		elseif name = "Comment" then
			ColumnName = "comment"
		end if
		
	SQL = "SELECT * FROM PassInfo"&SQL_TYP&" WHERE id_command='"&id_command&"'"
	'response.write SQL
	rs.open SQl,cn
			if not rs.eof then
				arrTable = rs.getRows()
				cntTable = ubound(arrTable)
			else
				cntTable = 0
			end if
	rs.close
	'response.write cntTable
	Set	JsPass = jsObject()
		if cntTable <> 0 then
				JsPass("ATM_Access") = arrTable(0,0)
				JsPass("Access_Comment") = arrTable(1,0)
				JsPass("Comment") = arrTable(2,0)
				JsPass("ATM_Taxi") = arrTable(3,0)
				JsPass("ATM_AmountCrew") = arrTable(4,0)
				JsPass("ATM_DateStart") = arrTable(5,0)
				JsPass("ATM_Arrival_Time") = arrTable(6,0)
				JsPass("ATM_Flight_Number") = arrTable(7,0)
				JsPass("ATM_Flight_From") = arrTable(8,0)
				JsPass("ATM_Flight_To") = arrTable(9,0)
				JsPass("Vberths") = arrTable(10,0)
				JsPass("Hotel") = arrTable(11,0)
				JsPass("DepTran") = arrTable(12,0)
				JsPass("DepTime") = arrTable(13,0)
				JsPass("BaseDepTime") = arrTable(14,0)
				JsPass("EM_Name") = arrTable(15,0)
				JsPass("EM_Relationship") = arrTable(16,0)
				JsPass("EM_Address") = arrTable(17,0)
				JsPass("EM_City") = arrTable(18,0)
				JsPass("EM_Phone") = arrTable(19,0)
				JsPass("EM_Phone2") = arrTable(20,0)
				JsPass("Id_Comm") = arrTable(21,0)
				JsPass("Id_Command") = arrTable(22,0)
				JsPass("Id_Info") = arrTable(23,0)
				JsPass("EM_Country") = arrTable(24,0)'Nut add 01/06/2017
		Set JsPass("Vihecle") = jsArray()
				Vihecle = getAccesCrewList(array())
				
				for inc = 0 to ubound(Vihecle)
					Set JsPass("Vihecle")(null) = jsObject()
							JsPass("Vihecle")(null)("id") = inc
							JsPass("Vihecle")(null)("name") = Vihecle(inc)
				next				
		end if
		JsPass.Flush
	End  Function
	
	Function UpdateEmergencyInfo()
		
		if name = "EmName" then
			ColumnName = "pi_emer_name"
		elseif name = "EmRalationship" then
			ColumnName = "pi_emer_relationship"
		elseif name = "EmAddress" then
			ColumnName = "pi_emer_address"
		elseif name = "EmCountry" then'Nut add 01/06/2017
			ColumnName = "pi_emer_country"
		elseif name = "EmCity" then
			ColumnName = "pi_emer_city"
		elseif name = "EmPhone1" then
			ColumnName = "pi_emer_phone"
		elseif name = "EmPhone2" then
			ColumnName = "pi_emer_phone2"
		end if
		
		SQL = "UPDATE PassInfo"&SQL_TYP&_
					" SET "&ColumnName&" ='"&text&"'"&_
					" WHERE id_info = '"&Id_Info&"'"
					'response.write SQL
					'response.end
		cn.Execute(SQL)	
			Set	JsMass = jsObject()
					JsMass("mass") = text
					JsMass("name") = name
					JsMass.Flush	
	End Function
	
	Function UpdateArrivalToMarina()
		
		if name = "ATM_Access" then
			ColumnName = "acces"
		elseif name = "ATM_Taxi" then 
			ColumnName = "taxi_trans"
		elseif name = "ATM_DateStart" then
			ColumnName = "datestart"
		elseif name = "ATM_Arrival_Time" then
			ColumnName = "arrival_time"
		elseif name = "ATM_Flight_From" then
			ColumnName = "Enprovde"
		elseif name = "ATM_Flight_Number" then
			ColumnName = "arrfligNumb"
		elseif name = "ATM_Flight_To" then
			ColumnName = "Adestde"
		elseif name = "ATM_AmountCrew" then
			ColumnName = "nbpers"
		elseif name = "ATMCommentACC" then
			ColumnName = "acces_comment"
		elseif name = "HotelPrior" then 
			ColumnName = "hotel_prior"
		elseif name = "Vberths" then 
			ColumnName = "vberths"
		end if
		
		SQL = "UPDATE PassInfo"&SQL_TYP&_
					" SET "&ColumnName&" ='"&text&"'"&_
					" WHERE id_info = '"&Id_Info&"'"
					'response.write SQL
					'response.end
		cn.Execute(SQL)	
		
		Set JsMass = jsObject()
				JsMass("mass") = text
				JsMass("name") = name
				JsMass.Flush
	End Function
	
	Function UpdateComment()
		if name = "Comment" then
			ColumnName = "comment"
		end if
		
		SQL = "UPDATE PassInfo"&SQL_TYP&_
					" SET "&ColumnName&" ='"&text&"'"&_
					" WHERE id_info = '"&Id_Info&"'"
					'response.write SQL
					'response.end
		cn.Execute(SQL)	
		
		Set JsMass = jsObject()
				JsMass("mass") = text
				JsMass("name") = name
				JsMass.Flush
	End Function
	
%>
<!-- #include file="../site/deconnect.asp" -->
