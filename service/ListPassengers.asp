<!-- #include file="../style/AVEImgClass.asp"-->
<!-- #include file="../search/connect.asp"-->
<!-- #include file="../site/lang.asp" -->
<!-- #include file="../style/Functions.asp" -->
<!-- #include file="../style/class.json.asp" -->
<!-- #include file="../style/class.json.util.asp" -->
<%
'response.end
	Set oImg = New AVEImgClass
	id_log = ss_auto
	id_command = request("id_command")
	typ_command = request("typ_command")
	SQL_TYP = noNull(array(Request("SQL_TYP"),""))
	typ = request("typ")
	TextValue = FromUTF8(Replace(base64_decode(request("TextValue")),"'","''"))
	Id_pass = request("Id_pass")
	TypUpdate = request("typUpdate")
	id_client = request("id_client")
	Stat_EmailOpe = request("EmailOpe")
	old_id_command = request("old_id_command")
	Old_typ = request("Old_typ")
	Refcom = request("refcom")
	
	
	if dev_local and 0 then
		for i=0 to 80000000
		
		next
	end if
	
	if typ = "get" then
		GetPassengers()
	elseif typ = "update" then
		UpdateOrInsertPassengers()
	elseif typ = "del" then
		DeletePassengers()
	elseif typ = "updaterow" then
		UpdateRowPassengers()
	elseif typ = "OPEBK" then
		GetPassengers_OPEBK()
	elseif typ = "importall" then
		importall()
	elseif typ = "addpassnum" then
		InsrtByNumPass()
	elseif typ = "UpdateClientFilled" then 'Nut add 05/06/2017
		UpdateClientFilled()
	end if	
	
	Function InsrtByNumPass()
		num = request("num")
		for i = 1 to num
			valueStr1 = valueStr1&"(NULL,'"&id_client&"')"
		next
		SQL = "INSERT INTO Pass (Nom,id_client) output inserted.id_pass values "&Replace(valueStr1,")(","),(")
			set rs = cn.Execute(SQL)	
				if not rs.eof then
					arrTable = rs.getRows()
					cntTable = ubound(arrTable,2)
					for inc = 0 to cntTable
						valueStr2 = valueStr2&"("&id_command&",'"&arrTable(0,inc)&"')"
					next
					SQL = "INSERT INTO listpass"&SQL_TYP&" (id_command,id_Pass) output inserted.id_pass values "&Replace(valueStr2,")(","),(")
					set rs = cn.Execute(SQL)	
					if not rs.eof then
						arrTable = rs.getRows()
						cntTable = ubound(arrTable,2)
						Set	JsMass = jsArray()
						for inc = 0 to cntTable
							JsMass(null) = arrTable(0,inc)
						next
						JsMass.Flush	
					end if
				end if
	End function
	
	Function GetPassengers()
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
		'response.write sql
		rs.open SQl,cn
			if not rs.eof then
				arrTable = rs.getRows()
				cntTable = ubound(arrTable,2)
			else
				cntTable = -1
			end if
		rs.close
		
		Set	JsPass = jsArray()
		for inc = 0 to cntTable
			Set	JsPass(null) = jsObject()
			JsPass(null)("id_pass") = arrTable(0,inc)
			JsPass(null)("nom") = arrTable(1,inc)
			JsPass(null)("Prenom") = arrTable(2,inc)
			JsPass(null)("sex") = arrTable(3,inc)
			JsPass(null)("Email") = arrTable(4,inc)
			JsPass(null)("address") = arrTable(5,inc)
			JsPass(null)("EmailOpe") = arrTable(6,inc)
			JsPass(null)("AddressOpe") = arrTable(7,inc)
			JsPass(null)("Age") = arrTable(8,inc)
			JsPass(null)("BirthDate") = arrTable(9,inc)
			JsPass(null)("BirthPlace") = arrTable(10,inc)
			JsPass(null)("Nation") = arrTable(11,inc)
			JsPass(null)("PassPort") = arrTable(12,inc)
			JsPass(null)("Validity") = arrTable(13,inc)
			JsPass(null)("Pointure") = arrTable(14,inc)
			JsPass(null)("Mobile") = arrTable(15,inc)
			JsPass(null)("SailingExp") = arrTable(16,inc)
			JsPass(null)("kin_name") = arrTable(17,inc)
			JsPass(null)("kin_phone") = arrTable(18,inc)
			JsPass(null)("kin_relation") = arrTable(19,inc)
			JsPass(null)("residence") = arrTable(20,inc) 'Nut add 31/05/2017
			JsPass(null)("crew_type") = arrTable(21,inc) 'Nut add 01/06/2017
			JsPass(null)("City") = arrTable(22,inc) 'Nut add 08/06/2017
			JsPass(null)("State") = arrTable(23,inc) 'Nut add 08/06/2017
			JsPass(null)("Zipcode") = arrTable(24,inc) 'Nut add 08/06/2017
			JsPass(null)("Country") = arrTable(25,inc) 'Nut add 08/06/2017
			JsPass(null)("DateArrival") = arrTable(26,inc) 'Nut add 08/06/2017
			JsPass(null)("AirNum") = arrTable(27,inc) 'Nut add 08/06/2017
			JsPass(null)("AirTime") = arrTable(28,inc) 'Nut add 08/06/2017
			JsPass(null)("FerryNum") = arrTable(29,inc) 'Nut add 08/06/2017
			JsPass(null)("FerryTime") = arrTable(30,inc) 'Nut add 08/06/2017
			JsPass(null)("WestEnd") = arrTable(31,inc) 'Nut add 08/06/2017
			JsPass(null)("RoadTown") = arrTable(32,inc) 'Nut add 08/06/2017
		next
		JsPass.Flush	
	End Function
	
	Function GetPassengers_OPEBK()'Get Email and Address of OPE and Agent
		SQL = "SELECT P.id_pass, P.nom, P.Prenom, P.sex, P.Email, P.address, P.EmailOpe, P.AddressOpe, P.Age, P.BirthDate, P.BirthPlace, P.Nation, P.PassPort, P.Validity, P.Pointure, P.Mobile, P.SailingExp, P.kin_name, P.kin_phone, P.kin_relation, P.residence, P.crew_type FROM Pass P INNER JOIN listpass"&SQL_TYP&" LP ON LP.id_pass=P.id_pass WHERE LP.id_command="&id_command 
		rs.open SQl,cn
			if not rs.eof then
				arrTable = rs.getRows()
				cntTable = ubound(arrTable,2)
			else
				cntTable = -1
			end if
		rs.close
		
		Set	JsPass = jsArray()
		for inc = 0 to cntTable
			Set	JsPass(null) = jsObject()
			JsPass(null)("id_pass") = arrTable(0,inc)
			JsPass(null)("nom") = arrTable(1,inc)
			JsPass(null)("Prenom") = arrTable(2,inc)
			JsPass(null)("sex") = arrTable(3,inc)
			JsPass(null)("EmailOpe") = arrTable(6,inc)
			JsPass(null)("AddressOpe") = arrTable(7,inc)
			JsPass(null)("Email") = arrTable(4,inc)
			JsPass(null)("address") = arrTable(5,inc)
			JsPass(null)("Age") = arrTable(8,inc)
			JsPass(null)("BirthDate") = arrTable(9,inc)
			JsPass(null)("BirthPlace") = arrTable(10,inc)
			JsPass(null)("Nation") = arrTable(11,inc)
			JsPass(null)("PassPort") = arrTable(12,inc)
			JsPass(null)("Validity") = arrTable(13,inc)
			JsPass(null)("Pointure") = arrTable(14,inc)
			JsPass(null)("Mobile") = arrTable(15,inc)
			JsPass(null)("SailingExp") = arrTable(16,inc)
			JsPass(null)("kin_name") = arrTable(17,inc)
			JsPass(null)("kin_phone") = arrTable(18,inc)
			JsPass(null)("kin_relation") = arrTable(19,inc)
			JsPass(null)("residence") = arrTable(20,inc) 'Nut add 31/05/2017
			JsPass(null)("crew_type") = arrTable(21,inc) 'Nut add 01/06/2017
		next
		JsPass.Flush	
	End Function
	
	Function UpdateOrInsertPassengers()
		'TextValue
		'Id_pass
		'TypUpdate
		if TypUpdate = "LastName" then 'LastName
			typTable = "nom"
		elseif TypUpdate = "FirstName" then'FirstName
			typTable = "Prenom"
		elseif TypUpdate = "PlaceOfBirth" then'KinPhone 
			typTable = "BirthPlace"	
		elseif TypUpdate = "Email" then'Email
			typTable = "Email"
		elseif TypUpdate = "Address" then'Address
			typTable = "address"
		elseif TypUpdate = "EmailOPE" then'EmailOPE
			typTable = "EmailOpe"
		elseif TypUpdate = "AddressOPE" then'AddressOPE
			typTable = "addressOpe"
		elseif TypUpdate = "Date" then'Date
			typTable = "BirthDate"
		elseif TypUpdate = "Nationality" then'Nationality
			typTable = "Nation"
		elseif TypUpdate = "Residence" then'residence  'Nut add 31/05/2017
			typTable = "residence"
		elseif TypUpdate = "PassPort" then'PassPort
			typTable = "PassPort"
		elseif TypUpdate = "Expiration" then'Expiration
			typTable = "Validity"	
		elseif TypUpdate = "shoesize" then'shoesize
			typTable = "Pointure"	
		elseif TypUpdate = "Gender" then'Gender
			typTable = "Sex"
		elseif TypUpdate = "Age" then'Age
			typTable = "Age"
		elseif TypUpdate = "Mobile" then'Mobile
			typTable = "Mobile"	
		elseif TypUpdate = "SailingExp" then'SailingExp  
			typTable = "SailingExp"	
		elseif TypUpdate = "KinName" then'KinName
			typTable = "kin_name"	
		elseif TypUpdate = "KinPhone" then'KinPhone 
			typTable = "kin_phone"
		elseif TypUpdate = "KinRelationship" then'KinPhone
			typTable = "kin_relation"	
		elseif TypUpdate = "typeCrew" then'Nut add 01/06/2017
			typTable = "crew_type"	
		elseif TypUpdate = "City" then'Nut add 08/06/2017
			typTable = "city"	
		elseif TypUpdate = "State" then'Nut add 08/06/2017
			typTable = "state"	
		elseif TypUpdate = "Zipcode" then'Nut add 08/06/2017
			typTable = "zip"	
		elseif TypUpdate = "Country" then'Nut add 08/06/2017
			typTable = "country"
		elseif TypUpdate = "DateArrival" then'Nut add 08/06/2017
			typTable = "dat_arrival"
		elseif TypUpdate = "AirNum" then'Nut add 08/06/2017
			typTable = "air_num"
		elseif TypUpdate = "AirTime" then'Nut add 08/06/2017
			typTable = "air_time"
		elseif TypUpdate = "FerryNum" then'Nut add 08/06/2017
			typTable = "ferry_num"
		elseif TypUpdate = "FerryTime" then'Nut add 08/06/2017
			typTable = "ferry_time"
		elseif TypUpdate = "WestEnd" then'Nut add 08/06/2017
			typTable = "west_end"
		elseif TypUpdate = "RoadTown" then'Nut add 08/06/2017
			typTable = "road_town"
		End if
			
		if Id_pass = "new" then 'add a new Passenger
			SQL = "INSERT INTO Pass ("&typTable&",id_client) output inserted.id_pass values ('"&TextValue&"','"&id_client&"')"
			set rs = cn.Execute(SQL)	
				if not rs.eof then
					return_id_pass = rs(0)
					SQL = "INSERT INTO listpass"&SQL_TYP&" (id_command,id_Pass) output inserted.id_pass values ('"&id_command&"','"&return_id_pass&"')"
					set rs = cn.Execute(SQL)	
					if not rs.eof then
						Set	JsMass = jsObject()
								JsMass("mass") = return_id_pass
								JsMass.Flush	
					end if
				end if
		else 'update a Passenger
			SQL = "UPDATE Pass SET "&typTable&" = '"&TextValue&"' WHERE id_pass = "&Id_pass
			cn.Execute(SQL)	
			Set	JsMass = jsObject()
					JsMass("mass") = TextValue
					JsMass.Flush	
		End if	
	End Function

	Function DeletePassengers()
		'SQL = "DELETE FROM Pass WHERE id_pass in ("&Id_pass&")"
		'cn.Execute(SQL)
		SQL = "DELETE FROM listpass"&SQL_TYP&" WHERE id_Pass in ("&Id_pass&") AND id_command="&id_command
		cn.Execute(SQL)
		GetPassengers()
	End Function
	
	Function UpdateRowPassengers()
		
		LastName = FromUTF8(Replace(base64_decode(request("LastName")),"'","''"))
		FirstName = FromUTF8(Replace(base64_decode(request("FirstName")),"'","''") )
		Email = FromUTF8(Replace(base64_decode(request("Email")),"'","''") )
		Address = FromUTF8(Replace(base64_decode(request("Address")),"'","''") )
		EmailOPE = FromUTF8(Replace(base64_decode(request("EmailOPE")),"'","''") )
		AddressOPE = FromUTF8(Replace(base64_decode(request("AddressOPE")),"'","''"))
		BirthDate = FromUTF8(Replace(base64_decode(request("Date")),"'","''") )
		Nationality = FromUTF8(Replace(base64_decode(request("Nationality")),"'","''") )
		PassPort = FromUTF8(Replace(base64_decode(request("PassPort")),"'","''") )
		Expiration = FromUTF8(Replace(base64_decode(request("Expiration")),"'","''") )
		shoesize = FromUTF8(Replace(base64_decode(request("shoesize")),"'","''") )
		residence = FromUTF8(Replace(base64_decode(request("Residence")),"'","''"))  'Nut add 31/05/2017
		typeCrew = FromUTF8(Replace(base64_decode(request("typeCrew")),"'","''"))  'Ham add 05/06/2017
		
		City = FromUTF8(Replace(base64_decode(request("City")),"'","''"))  'Nut add 16/06/2017
		State = FromUTF8(Replace(base64_decode(request("State")),"'","''"))  'Nut add 16/06/2017
		Zipcode = FromUTF8(Replace(base64_decode(request("Zipcode")),"'","''"))  'Nut add 16/06/2017
		Country = FromUTF8(Replace(base64_decode(request("Country")),"'","''"))  'Nut add 16/06/2017
		DateArrival = FromUTF8(Replace(base64_decode(request("DateArrival")),"'","''"))  'Nut add 16/06/2017
		AirNum = FromUTF8(Replace(base64_decode(request("AirNum")),"'","''"))  'Nut add 16/06/2017
		AirTime = FromUTF8(Replace(base64_decode(request("AirTime")),"'","''"))  'Nut add 16/06/2017
		FerryNum = FromUTF8(Replace(base64_decode(request("FerryNum")),"'","''"))  'Nut add 16/06/2017
		FerryTime = FromUTF8(Replace(base64_decode(request("FerryTime")),"'","''"))  'Nut add 16/06/2017
		WestEnd = FromUTF8(Replace(base64_decode(request("WestEnd")),"'","''"))  'Nut add 16/06/2017
		RoadTown = FromUTF8(Replace(base64_decode(request("RoadTown")),"'","''"))  'Nut add 16/06/2017

		SQL = "INSERT INTO Pass (nom,Prenom,Email,Address,EmailOPE,addressOPE,BirthDate,Nation,PassPort,Validity,Pointure,id_client,residence,crew_type, city, state, zip, country, dat_arrival, air_num, air_time, ferry_num, ferry_time, west_end, road_town) output inserted.id_pass "&_
					"values ('"&LastName&"','"&FirstName&"','"&Email&"','"&Address&"','"&EmailOPE&"','"&AddressOPE&"','"&BirthDate&"','"&Nationality&"','"&PassPort&"','"&Expiration&"','"&shoesize&"','"&id_client&"','"&residence&"','"&typeCrew&"'," &_
					" '"&City&"', '"&State&"', '"&Zipcode&"', '"&Country&"', '"&DateArrival&"', '"&AirNum&"', '"&AirTime&"', '"&FerryNum&"', '"&FerryTime&"', '"&WestEnd&"', '"&RoadTown&"')"
		'response.write SQL : response.end
			set rs = cn.Execute(SQL)	
			if not rs.eof then
				return_id_pass = rs(0)
				SQL = "INSERT INTO listpass"&SQL_TYP&" (id_command,id_Pass) output inserted.id_pass values ('"&id_command&"','"&return_id_pass&"')"
				set rs = cn.Execute(SQL)	
				if not rs.eof then
					Set	JsMass = jsObject()
							JsMass("mass") = return_id_pass
							JsMass("birtDate") = BirthDate
							JsMass.Flush	
				end if
			end if
	End Function
	
	Function importall()
		
		SQL_OLD_TYP = ""
		if Old_typ = "agt" then
			SQL_OLD_TYP = "agt"
		end if
		
		SQL = "insert into listpass"&SQL_TYP&" (id_command, id_pass) "&_
					"SELECT "&id_command&", id_pass from listpass"&SQL_OLD_TYP&" where id_command in ("&old_id_command&")"
					
		set rs = cn.Execute(SQL)
		Set	JsMass = jsObject()
				JsMass("mass") = "ok"
				JsMass.Flush
	End Function
	
	Function UpdateClientFilled() 'Nut add 07/06/2017
		if session("auto")="2" then
			SQL = "UPDATE Command"&SQL_TYP&" SET paxlist=2 WHERE id_command="&id_command
		else
			sql = "SELECT id_ope,id_agt FROM Client WHERE id_client in ("&id_client&")"
			rs.open sql,cn,3
				id_ope_cli = rs("id_ope")
				id_agt_cli = rs("id_agt")
			rs.close
			if id_agt_cli&"a"="a" or id_agt_cli&""="0" or isNull(id_agt_cli) then
				SQL = "UPDATE Command"&SQL_TYP&" SET paxlist=2 WHERE id_command="&id_command
			else
				SQL = "UPDATE Command"&SQL_TYP&" SET paxlist=1 WHERE id_command="&id_command
			end if
		end if
		'response.write SQL : response.end
		cn.execute SQL
		Set	JsMass = jsObject()
				JsMass("mass") = "ok"
				JsMass.Flush
	End Function
%>
<!-- #include file="../site/deconnect.asp" -->
