// Nut Start //
//'use strict';

var droits,url,row,check,sel,imp,DDate,catama,id_exp_co,contrat,bh_tab,pass;
var CheckEl = {}, ValueObj = {},QueueCallFunction={};
var AjaxQueueNut=[],AjaxSkipper=[],InputnameSK=[],SelectnameSK=[],InputnameBH=[],InputnameCO=[],SelectnameCO=[],InputnameAll=[],SelectnameAll=[],importfile=[];
window.StateObj = jQuery.parseJSON(window.State);
window.CountryObj = jQuery.parseJSON(window.Country);

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
if(dd<10) {dd='0'+dd} 
if(mm<10) {mm='0'+mm} 
today = mm+'/'+dd+'/'+yyyy;

var delay = (function(){
  						var timer = 0;
								return function(callback, ms){
  								clearTimeout (timer);
  								timer = setTimeout(callback, ms);
								};
						})();						
var FunctionQueue = (function(){
	var queue = [];
	var add = function(fnc){
	 queue.push(fnc);
	};
	var goNext = function(){
	    var fnc = queue.shift();
	    fnc();
	};
	return {
	    add:add,
	    goNext:goNext
	};
}());

$('body').tooltip({
	selector: '[data-toggle="tooltip"]'
});
			
	function Call_ListExpRight(){
		var data = {"id_command":id_command,"typ_command":typ_command};
		if(id_command == "" || typ_command == ""){
			var data = {"RefId":RefId};
			$('a.for_stour').attr("page","log_listexp_detail_client");	
			
		}else{
			$('a.for_stour').attr("page","log_listexp_detail");
		}
		Pace.on("done", function(){
			$('#DocCont').fadeIn(1000);
			$('#icon-nav').fadeIn(1000);
			$('#prog-nav').fadeIn(1000);
		});
		return Pace.track(function(){
			return $.ajax({
				url: '../search/log_listexp_right.asp',
				type: 'POST',
				data:data,
				dataType:'json',
				async: false
			});		
		});
	}
	
	function SetUploadFile(id_command){
			
			if(ss_auto == ""){//When no ss_auto
				ss_auto = (StatObj.ss_styl).slice(0,1) == "A" ? 6 : 2 ;
			}
			
			if( (ss_auto == "6") || ( StatObj.CheckCommandLink.SQL_TYP == "agt" && ( ss_auto == "0" || ss_auto == "" ) ) ){
				 path = "../search/SkipperInfo/agt/";
				 path += id_command + "/";
				 dir = "../search/SkipperInfo/agt/";
				 dir += id_command + "/";
			}else if( ss_auto == "2" || ( StatObj.CheckCommandLink.SQL_TYP == "" && ( ss_auto == "0" || ss_auto == "" ) ) ){
				 path = "../search/SkipperInfo/ope/";
				 path += id_command + "/";
				 dir = "../search/SkipperInfo/ope/";
				 dir += id_command + "/";
			}
			// Upload Files //
			$("#fade-upload").sdn_upload({
				path_upload : '../upload/upload_simple.php',
		    folder:path,
		    //btnUpload:1,
		    FileExist : 0,
		    deleteFile : 1,
		    maxSize : 14,
		    maxFile : 0, //0 = any, 1 = one file
		    limitFile : {"img":["gif","jpg", "png", "jpeg"], "doc":["docx", "pdf", "xls", "xlsx", "txt", "pptx"]},
		   	onHidden: function(){
		   		ListFiles(dir,empty);
		   	}
		  });
	}
	
	function PreferanceSheet_upload(){
		// Preferance Sheet //
		var path = '../search/SkipperInfo/'+droits.typ_command+'/'+droits.id_command+'/pref/';
		$("#PreferanceSheet").sdn_upload({
			path_upload : '../upload/upload_simple.php',
	    folder: path,
	    FileExist : 0,
	    deleteFile : 1,
	    maxSize : 14,
	    maxFile : 0, //0 = any, 1 = one file
	    limitFile : {"img":[], "doc":["doc","docx", "pdf", "xls", "xlsx"]},
	   	onHidden: function(){
	   		PreferanceSheet_Contains(path,empty);
	   	}
	  });
	  return path;
	}
	
	function PreferanceSheet_Contains(path,empty){
		var dir = path;
		var empty = empty;
		return $.ajax({
			url: "log_exp_detail-API.asp",
			dataType: "json",
			type: "POST",
			data: {
				dir : dir,
				typ : 'files'
			},
			success:function(data){
				var objFiEx = data;
				var check = data.list_file;
				if(check.length > 0){
					$('#PreferanceSheet').hide();	
				}else if(check.length == 0){
					$('#PreferanceSheet').show();	
				}
				//var tai;
				if (jQuery.isEmptyObject(objFiEx.list_file)){
	   				$('#PreferanceSheet_ListFiles').html("<div class=\"alert alert-warning text-center\" role=\"alert\">"+
																 "<b><i class=\"fa fa-folder-open-o\"></i> "+empty+"</b>"+
																	"</div>");
				}else{
					$('#PreferanceSheet_ListFiles').empty();
					$.each(objFiEx.list_file, function(key,value){
						var typDoc = value.name;
								typDoc = typDoc.split(".");
						var typFile = typDoc[typDoc.length-1];
						url = value.folder+value.name;
						$('#PreferanceSheet_ListFiles').append(
							"<div class=\"row\" id=\""+key+"\">"+
								"<div class=\"col-md-7\">"+
									"<a href="+url+" target=\"_blank\">"+value.name+"</a>"+
								"</div>"+
								"<div class=\"col-md-2\">"+CalSizeFile(value.size)+"</div>"+
								"<div class=\"col-md-3 text-right\"><button type=\"button\" role=\"button\" class=\"sdn-upload-item-click btn btn-primary\" onClick=\"PreferanceSheet_DelFilesExist('"+key+"','"+url+"', '"+dir+"', '"+empty+"')\" rowDel=\""+key+"\" name=\""+ value.name +"\" id=\"delete\"><i class=\"fa fa-trash-o\"></i> "+row.lg_delete_file+"</button></div>"+
							"</div><br>"
						);
					});
				}
			}
		});
	}
	
	function PreferanceSheet_DelFilesExist(rowDel,file,dir,empty){
		var Btn = ConfirmModal();
		$(Btn).click(function(){
			$.ajax({
				type:"POST",
				url:"log_exp_detail-API.asp",
				dataType:"json",
				data:{dir:file, typ:'delete'},
				success:function(data){
					PreferanceSheet_Contains(dir,empty);
				},
				error:function(){
					
				}
			});
		});
	}
	
	function BigBang(){
		var ListExpRight = Call_ListExpRight();
				ListExpRight.success(function(data){
					StatObj = data.CrewList;
					droits  = data.Skipper;
					Progress = data.Progress;
					SetUploadFile(data.Skipper.id_command);
					if(RefId==''){
						RefId=((droits.typ_command == 'agt') ? 'A' : 'O') + data.Skipper.refcom
					}
					
				}).promise().done(function(data){//The Router
					if(data.code=='505'){
						$('body').empty();
						$('body').append(data.message);
					}else{
						var GetViewMode = ManageViewMode(CheckWindowSize());
						
						if(GetViewMode != ViewMode ){
							ViewMode = GetViewMode;
							Skipper_Construct(ViewMode);	
						}
						
						if(RefAccess == "False"){
							$("#AccessDocument").show();
							Crewlist_Construct();
						}else{
							Crewlist_Construct();
							$('#DocInfo').show();
							DocumentInfo.do("get",RefId);
							//Crewlist_Construct();
						}
						var crew = droits.crew;
						if((crew.toLowerCase() == 'crewed' && id_ope_com == '192') || (droits.typ_command == 'agt')  ){
							var path = PreferanceSheet_upload();	
							PreferanceSheet_Contains(path,empty)
						}else{
							$('#myTab > li a[href=#PS]').hide();
							$('#PreSheet').hide();
						}
					}
				});
	}
	
var DocumentInfo = (function(){
	var init = function(typ,ref){
		CallAjax = ajax(typ,ref);
		CallAjax.success(function(data){
			//$('.row-docinfo').tooltip();
			ul_comm 		= $("<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'>");
			fleet_name 	= $('<div class="row row-docinfo">').append(
											$('<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">').html('<i class="fa fa-university" data-toggle="tooltip" data-placement="left" title="'+row.inc_societe+'"></i> '+data.Care_Company)
										 );
			fleet_addr 	= $('<div class="row row-docinfo">').append(
											$('<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">').html('<i class="fa fa-map-marker" data-toggle="tooltip" data-placement="left" title="'+row.Address+'"></i> '+data.Care_address+", "+data.Care_zipcode+", "+data.Care_city+", "+data.Care_country)
										 );
			fleet_tel 	= $("<div class='row row-docinfo'>").append(
											$('<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">').html('<i class="fa fa-phone" data-toggle="tooltip" data-placement="left" title="'+row.lg_phone_number+'"></i> '+data.Care_Tel)
										 );
			fleet_site 	= $("<div class='row row-docinfo'>").append(
											$('<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">').html('<i class="fa fa-globe" data-toggle="tooltip" data-placement="left" title="'+row.WebSite+'"></i> '+"<a href='"+data.Site+"' target='_blank'>"+data.Site+"</a>")
										 );
			fleet_email = $("<div class='row row-docinfo'>").append(
											$('<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">').html('<i class="fa fa-envelope-o" data-toggle="tooltip" data-placement="left" title="'+row.lg_email+'"></i> '+"<a href='"+data.Care_email+"' target='_blank'>"+data.Care_email+"</a>")
										 );
			commercial 	= $(ul_comm).append(fleet_name,fleet_addr,fleet_tel,fleet_site,fleet_email);
			$('#CommercalComtact').html(commercial);
			
			IconBoat = ['<i class="sdn sdn-cata"></i>','<i class="sdn sdn-monohull"></i>','<i class="fa fa-ship"></i>'];
			IconIndex = 2;
			if(data.TypeBoat == "Catamaran"){
				IconIndex = 0 ;
			}else if(data.TypeBoat == "Monohull"){
				IconIndex = 1 ;
			}
			$('#icon-boat').html(IconBoat[IconIndex]);
			$('#comm-boat').text(data.idComm);
			$('#model-boat').text(data.Model);
			$('#width-boat').html(data.WidthBoat);
			$('#port-in').text(data.Port_in);
			$('#port-out').text(data.Port_out);
			$('#DateStart').text(data.DateStart);
			$('#DateEnd').text(data.DateEnd);
			
			$('#bed-boat').text(data.NbDouCabin);
			$('#heads-boat').text(data.Heads);
			$('#pax-boat').text(data.NbBerths);
			$('#year-boat').text(data.BuildYear);
			keepref = window.location.search.split("&");
			$.each(data.btnleng,function(index,value){
				$("#btnlang").append($("<a>").attr("href",window.location.origin+window.location.pathname+keepref[0]+"&lg="+index).html(value).css("margin-right","5px"));
			});
		});
	};
	var ajax = function(typ,ref){
		return $.ajax({
   		url:"../API/GetDocumentCharter.asp",
   		dataType: "json",
			type: "POST",
			data: {typ:typ,"ref":ref,"SQL_TYP":StatObj.CheckCommandLink.SQL_TYP}
		});
	};
	return {do:init}
}());
	
var SendRequest = (function(){
	var init = function(typ){
		var Modal = BootstrapModal();
				Modal.header.html('<i class="fa fa-envelope-o" aria-hidden="true"></i> '+'<span id="SendRequest"></span>'+
													'<button data-dismiss="modal" class="close" type="button">'+
														'<i class="fa fa-times"></i>'+
													'</button>'
												 );
				Modal.body.html(
					'<div class="alert alert-info" role="alert" style="margin: 5px; font-size: 15px; text-align: center;">'+
					'<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> <b>Loading...</b>'
				);
				Modal.do();
		CallAjax = ajax(typ);
		CallAjax.success(function(data){
			var Words = data.words;
			$("#SendRequest",Modal.header).html(Words.lg_reqEmail_sendrequest);
			Modal.body.html(form(Words));
			Modal.footer.html('<button style="margin-bottom: 0px;" class="btn btn-primary" type="button" id="SendRequest">'+
														'<i class="fa fa-check" aria-hidden="true"></i>'+
															Words.Send+
													'</button> '+
													'<button style="margin-bottom: 0px;" class="btn btn-primary" data-dismiss="modal" type="button">'+
														'<i class="fa fa-times"></i> '+
														Words.lg_close+
													'</button>');
			
			$('#EndEmail',Modal.body).html(data.footer);
			$('#FromEmail',Modal.body).val(data.from);
			
			var to_arr   = JSON.parse(data.to);
			var ul_list  = $('#list_to > ul',Modal.body);
			var to_input = $("#ToEmail",Modal.body);
			var to_btn   = $('#btn_to',Modal.body);
			var body_arr = JSON.parse(data.body);
			$.each(to_arr,function(index,obj){
				var li_html = '<i class="fa '+obj.icon+'"></i> '+obj.word;
				
				var Dir_Link = $("input[name=DirectLink]").val();
				var Body = atob(body_arr[index].body).replace('<a>','<a href="'+Dir_Link+'">');
				if(!index){
					to_input.val(obj.email);
					to_btn.html(li_html+' <span class="caret"></span>');
					$('#BodyEmail',Modal.body).html(Body);
				}
				var li = $('<li>').html($('<a href="#">').html(li_html+" : "+obj.email))
									.click(function(){
										to_input.val(obj.email);
										to_btn.html(li_html+' <span class="caret"></span>');
										$('#BodyEmail',Modal.body).html(Body);
									});
				ul_list.append(li);
			});
			ConfirmModal(Modal,Words);
		});
	};
	var ConfirmModal = function(InitModal,Words){
		var CloseBtn = $('<button style="margin-bottom: 0px;" class="btn btn-primary" data-dismiss="modal" type="button">'+
											'<i class="fa fa-times"></i> '+Words.lg_no+
									 '</button>');
		var ConfirmBtn = $('<button style="margin-bottom: 0px;" class="btn btn-primary" type="button">'+
											'<i class="fa fa-check" aria-hidden="true"></i> '+Words.lg_ye+
										 '</button> ');
		var Modal = BootstrapModal();
				Modal.header.html('<i class="fa fa-envelope-o" aria-hidden="true"></i> '+Words.lg_reqEmail_Confirm_Send_Request);
				Modal.body.html(send_request);
				Modal.footer.append(ConfirmBtn,CloseBtn);
				$("#SendRequest",InitModal.footer).click(function(){
					$(InitModal.main).modal('hide');
					Modal.do();
					$(CloseBtn).click(function(){
						$(InitModal.main).modal('show');
					});
					$(ConfirmBtn).click(function(){
						Modal.footer.empty();
						Modal.body.html('<div class="alert alert-info" role="alert">'+
																'<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> '+
																'<b>Please wait,</b> '+
															'We are sending the request.'+
															'</div>'
														);
						CallAjax = ajax("send",InitModal);
						CallAjax.success(function(data){
							$(".alert",Modal.body)
							.removeClass("alert-info")
							.addClass("alert-success")
							.html('<i class="fa fa-check" aria-hidden="true"></i> <b>Success,</b> The request had been sended.');
							setTimeout(function(){ $(Modal.main).modal('hide'); }, 1200);
						});
					});
				});
	};
	var form = function(Words){
		main = $('<div class="container-fluid">').attr("id","ReqForm");
		input_group = $('<div class="input-group">');
		span = $('<span class="input-group-addon">');
		input = $('<input type="text" class="form-control">');
		textarea = $('<textarea class="form-control">');
		row = $('<div class="row">').css("margin-bottom","5px");
		grid_12 = $('<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">');
		
		select_list = '<div class="input-group-btn" style="height: 24px !important;border-right: 0px !important;" id="list_to">'+
'        <button type="button" id="btn_to" class="btn btn-primary dropdown-toggle" data-toggle="dropdown"></button>'+
'        <ul class="dropdown-menu">'+
'        </ul>'+
'      </div>'
		
		from = input_group.clone().append(span.clone().html('<i class="fa fa-user"></i> '+Words.prop_du),input.clone().attr("id","FromEmail"));
		to = input_group.clone().append(select_list,input.clone().attr({"id":"ToEmail"}));
		contain = textarea.clone().css("height","300px").attr("id","BodyEmail");
		end = textarea.clone().css("height","175px").attr("id","EndEmail");
		return main.append(
			row.clone().html(grid_12.clone().html(from)),
			row.clone().html(grid_12.clone().html(to)),
			row.clone().html(grid_12.clone().html(contain)),
			row.clone().html(grid_12.clone().html(end))
		);
	};
	var ajax = function(typ,Modal){
		if(typ == "send"){
			data = {
				FromEmail:$("#FromEmail",Modal.body).val(),
				ToEmail:$("#ToEmail",Modal.body).val(),
				BodyEmail:$("#BodyEmail",Modal.body).val().replace(/(?:\r\n|\r|\n)/g, '<br />').replace(/“|”/g, '"'),
				EndEmail:$("#EndEmail",Modal.body).val().replace(/(?:\r\n|\r|\n)/g, '<br />').replace(/“|”/g, '"'),
				id_command : StatObj.CheckCommandLink.id_command,
				id_ope:droits.id_ope_com,
				typ : typ
			}
		}else if(typ  == "askAccess"){
			data = {
				id_command : StatObj.CheckCommandLink.id_command,
				typ_command : StatObj.CheckCommandLink.typ_command,
				SQL_TYP : StatObj.CheckCommandLink.SQL_TYP,
				id_client:droits.id_client,
				id_agt:droits.ss_id_agt,
				id_ope:droits.id_ope_com,
				typ : typ
			};
		}else if(typ  == "sendLink"){
			
			var id_agt = droits.ss_id_agt;
			if(droits.ss_id_agt == "0"){
				id_agt = droits.id_agt_com
			}
			
			data = {
				id_command : StatObj.CheckCommandLink.id_command,
				typ_command : StatObj.CheckCommandLink.typ_command,
				SQL_TYP : StatObj.CheckCommandLink.SQL_TYP,
				id_client:droits.id_client,
				id_agt:id_agt,
				id_ope:droits.id_ope_com,
				id_ope:droits.id_ope_com,
				ss_auto:ss_auto,
				link_client:$("input[name=DirectLink]").val(),
				typ:typ
			};
		}
		return $.ajax({
   		url:"../API/SendRequest.asp",
   		dataType: "json",
			type: "POST",
			data: data
		});
	}
	return {init:init}
}());
	
function FormPototype(amount,Passdata){
	FormStorge = Passdata;
	$('#pototypeform').empty();
	if (droits.catamaran_fleet && 0) { //Nut add 08/06/2017
		var BtnYes = $('<button type="button" class="btn btn-default">').attr({"name":"ATM_Taxi","id":"ArrYes"}).val(1)
					.html('<i class="fa fa-check" aria-hidden="true"></i> '+ledico_yes),
				BtnNo = $('<button type="button" class="btn btn-default">').attr({"name":"ATM_Taxi","id":"ArrNo"}).val(0)
					.html('<i class="fa fa-times" aria-hidden="true"></i> '+ledico_no);
					
		if(ArrToMar["ATM_Taxi"] == 1 ){
			$(BtnYes).removeClass('btn-default').addClass("btn-success");
		}else{
			$(BtnNo).removeClass('btn-default').addClass("btn-danger");
		}
		var RequireArrivalTransfer = $('<div class="btn-group" role="group" aria-label="Second group">').attr("id","RegArrTra").append(BtnYes,BtnNo);
		$('#pototypeform').append('Transportation needed: ', RequireArrivalTransfer);
		$('#pototypeform').on({
			"click":function(event){
				event.preventDefault();
				var El = $(this);
				$('button[name=ATM_Taxi]').removeClass('active');
				$(this).addClass('active');
				if($(this).attr("id") == "ArrYes"){
					$('#ArrYes').parent().find('#ArrNo').removeClass('btn-danger').addClass('btn-default')
					$(this).removeClass('btn-default').addClass("btn-success");
				}else{
					$('#ArrYes').parent().find('#ArrYes').removeClass('btn-success').addClass('btn-default')
					$(this).removeClass('btn-default').addClass("btn-danger");
				}
				if($(El).val() != ArrToMar.ATM_Taxi ){
					QueueChangeArriveToMarina.add(El,function(data,idObj,idAjax){
						WaitInsertPassInfo("success",StatObj.id_info);
						ArrToMar["ATM_Taxi"] = data.mass;
						UpdateIdInfo(data);
						ArrivalMarinaProgressManage("success",this.idAjax);
						WaitInsertPassInfo("success",this.idAjax);
						QueueChangeArriveToMarina.next();
					});
				}
				
		}},'button[name=ATM_Taxi]');
	}
	for (i = 0; i < amount; i++) {
		var inputEl = $('<input>').attr({class:"form-control pass",type:"text"});
		var NumberBtn = $('<div>').addClass('input-group-addon labelNo');
		var Pass_LastName="",
				Pass_FirstName="",
				Pass_PlaceOfBirth="",
				Pass_Gender="",
				
				Pass_EmailOpe = "",
				Pass_AddressOpe = "",
				
				Pass_Email="",
				Pass_Address="",
				
				Pass_Age="",
				Pass_DateOfBirth="",
				Pass_Nationality="",
				Pass_Residence="", //Nut add 31/05/2017
				Pass_typeCrew="", //Nut add 08/06/2017
				Pass_City="", //Nut add 08/06/2017
				Pass_State="", //Nut add 08/06/2017
				Pass_Zipcode="", //Nut add 08/06/2017
				Pass_Country="", //Nut add 08/06/2017
				Pass_BirthDate="", //Nut add 08/06/2017
				Pass_DateArrival="", //Nut add 08/06/2017
				Pass_AirNum="", //Nut add 08/06/2017
				Pass_AirTime="", //Nut add 08/06/2017
				Pass_FerryNum="", //Nut add 08/06/2017
				Pass_FerryTime="", //Nut add 08/06/2017
				Pass_WestEnd="", //Nut add 08/06/2017
				Pass_RoadTown="", //Nut add 08/06/2017
				Pass_Passport ="",
				Pass_Expiration = "",
				Pass_ShoeSize = "",
				Pass_Mobile="",
				Pass_SailingExp="",
				Pass_id="new",
				Pass_KinName ="" ,
				Pass_KinPhone ="",
				Pass_KinRelationship = "",
				DeleteBtn = "",
				Copyinfo = "";
				
		if(Passdata[i]){
			Pass_LastName = Passdata[i].nom;
			Pass_FirstName = Passdata[i].Prenom;
			Pass_PlaceOfBirth = Passdata[i].BirthPlace;
			
			Pass_Gender = Passdata[i].sex;
			
			Pass_EmailOpe = Passdata[i].EmailOpe;
			Pass_AddressOpe = Passdata[i].AddressOpe;
			
			Pass_Email = Passdata[i].Email;
			Pass_Address = Passdata[i].address;
				
			Pass_Age = Passdata[i].Age;
			Pass_DateOfBirth = Passdata[i].BirthDate;
			Pass_Nationality = Passdata[i].Nation;
			Pass_Residence = Passdata[i].residence; //Nut add 31/05/2017
			Pass_typeCrew = Passdata[i].crew_type; //Nut add 01/06/2017
			Pass_City = Passdata[i].City; //Nut add 08/06/2017
			Pass_State = Passdata[i].State; //Nut add 08/06/2017
			Pass_Zipcode = Passdata[i].Zipcode; //Nut add 08/06/2017
			Pass_Country = Passdata[i].Country; //Nut add 08/06/2017
			Pass_BirthDate = Passdata[i].BirthDate; //Nut add 08/06/2017
			Pass_DateArrival = Passdata[i].DateArrival; //Nut add 08/06/2017
			Pass_AirNum = Passdata[i].AirNum; //Nut add 08/06/2017
			Pass_AirTime = Passdata[i].AirTime; //Nut add 08/06/2017
			Pass_FerryNum = Passdata[i].FerryNum; //Nut add 08/06/2017
			Pass_FerryTime = Passdata[i].FerryTime; //Nut add 08/06/2017
			Pass_WestEnd = Passdata[i].WestEnd; //Nut add 08/06/2017
			Pass_RoadTown = Passdata[i].RoadTown; //Nut add 08/06/2017
			Pass_Passport =  Passdata[i].PassPort;
			Pass_Expiration = Passdata[i].Validity;
			Pass_ShoeSize = Passdata[i].Pointure;
			Pass_Mobile = Passdata[i].Mobile;
			Pass_SailingExp = Passdata[i].SailingExp;
			Pass_KinName = Passdata[i].kin_name;
			Pass_KinPhone = Passdata[i].kin_phone;
			Pass_KinRelationship = Passdata[i].kin_relation;
			Pass_id = Passdata[i].id_pass;
			
			DeleteBtn = $('<button type="button" class="btn btn-primary delBtn"><i class="fa fa-trash"></i></button>');	
			Copyinfo = $('<button type="button" class="btn btn-primary copyBtn"><i class="fa fa-clone"></i><i class="fa fa-stop-circle" style="display: none"></i></button>');
			
		}
		if (droits.catamaran_fleet && 0) {
			var InputGroup = $('<div>').addClass('input-group').css({"width":"100%","margin-top":"5px"});
			var InputGroupAddon = $('<div>').addClass('input-group-addon');
			var div_col6 = $('<div>').addClass('col-lg-6 col-md-6 col-sm-6 col-xs-6'), div_col12 = $('<div>').addClass('col-lg-12 col-md-12 col-sm-12 col-xs-12'), El='',selectstate='', OptionState = '';
			$.each(window.StateObj, function(key,value) {
				var valueN = value.names.replace("[chr39]", "'");
				((Pass_State==value.code || Pass_State==valueN) ? sel = "selected" : sel = '');
				OptionState += '<option value="'+value.code+'" '+sel+'>'+value.code+' - '+valueN+'</option>';
			});
			var StateSel = '<select class="form-control pass">' +
											'<option value="">Only U.S. resident</option>' +
											OptionState +
										'</select>';
			
			var OptionCountry = '';
			$.each(window.CountryObj, function(key,value) {
				var valueN = value.names.replace("[chr39]", "'");
				((Pass_Country==value.names) ? sel = "selected" : sel = '');
				OptionCountry += '<option value="'+value.names+'" '+sel+'>'+valueN+'</option>';
			});
			var CountrySel = '<select class="form-control pass">' +
												'<option value="">Only U.S. resident</option>' +
												OptionCountry +
											'</select>';
			(Pass_WestEnd == 1) ? WEchecked = 'checked' : WEchecked = '';
			(Pass_RoadTown == 1) ? RTchecked = 'checked' : RTchecked = '';
			
			var Nom = $(div_col12).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-users" aria-hidden="true"></i> '+row.Nom),
							$(inputEl).clone().addClass("input-padding-right").val(Pass_LastName).data('<i class="fa fa-h-square" aria-hidden="true"></i> KeepValue',Pass_LastName).attr({"name":"LastName"})
						)
					),
					Address = $(div_col12).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.Address),
							$(inputEl).clone().addClass("input-padding-right").val(Pass_Address).data("KeepValue",Pass_Address).attr({"name":"Address"})
						)
					),
					AddressOpe = $(div_col12).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.Address),
							$(inputEl).clone().addClass("input-padding-right").val(Pass_AddressOpe).data("KeepValue",Pass_AddressOpe).attr({"name":"AddressOPE"})
						)
					),
					City = $(div_col6).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.City),
							$(inputEl).clone().addClass("input-padding-right").val(Pass_City).data("KeepValue",Pass_City).attr({"name":"City"})
						)
					),
					State = $(div_col6).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.State),
							$(StateSel).addClass("input-padding-right").val(Pass_State).data("KeepValue",Pass_State).attr({"name":"State"})
						)
					),
					Zipcode = $(div_col6).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.Zipcode),
							$(inputEl).clone().addClass("input-padding-right").val(Pass_Zipcode).data("KeepValue",Pass_Zipcode).attr({"name":"Zipcode"})
						)
					),
					Country = $(div_col6).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.Country),
							$(CountrySel).addClass("input-padding-right").val(Pass_Country).data("KeepValue",Pass_Country).attr({"name":"Country"})
						)
					),
					Email = $(div_col6).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-envelope" aria-hidden="true"></i> '+row.lg_email),
							$(inputEl).clone().addClass("input-padding-right").val(Pass_Email).data("KeepValue",Pass_Email).attr({"name":"Email"})
						)
					),
					EmailOpe = $(div_col6).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-envelope" aria-hidden="true"></i> '+row.lg_email),
							$(inputEl).clone().addClass("input-padding-right").val(Pass_EmailOpe).data("KeepValue",Pass_EmailOpe).attr({"name":"EmailOPE"})
						)
					),
					BirthDate = $(div_col6).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html("<i class='fa fa-gift'></i> "+row.Birthdate),
							$(inputEl).clone().val(Pass_BirthDate).data("KeepValue",Pass_BirthDate).attr({"name":"BirthDate"})
						)
					),
					DateArrival = $(div_col12).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.lg_ard),
							$(inputEl).clone().addClass("input-padding-right").val(Pass_DateArrival).data("KeepValue",Pass_DateArrival).attr({"name":"DateArrival"})
						)
					),
					AirNum = $(div_col6).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html("<i class='fa fa-plane'></i> Airline a Fligh#"),
							$(inputEl).clone().val(Pass_AirNum).data("KeepValue",Pass_AirNum).attr({"name":"AirNum"})
						)
					),
					AirTime = $(div_col6).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html("<i class='fa fa-location-arrow'></i> Arrival Time"),
							$(inputEl).clone().val(Pass_AirTime).data("KeepValue",Pass_AirTime).attr({"name":"AirTime"})
						)
					),
					FerryNum = $(div_col6).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html("<i class='fa fa-ship'></i> Ferry carrier"),
							$(inputEl).clone().val(Pass_FerryNum).data("KeepValue",Pass_FerryNum).attr({"name":"FerryNum"})
						)
					),
					FerryTime = $(div_col6).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html("<i class='fa fa-location-arrow'></i> Departure Time SST"),
							$(inputEl).clone().val(Pass_FerryTime).data("KeepValue",Pass_FerryTime).attr({"name":"FerryTime"})
						)
					),
					TravelTime = $(div_col12).clone().append(
						'(Travel time 1 hour) West End ',
						$('<input type="checkbox" value="1" ' + WEchecked + '>').data("KeepValue",Pass_WestEnd).attr({"name":"WestEnd"}),
						' Road Town ',
						$('<input type="checkbox" value="1" ' + RTchecked + '>').data("KeepValue",Pass_WestEnd).attr({"name":"RoadTown"})
					),
					BtnDel_BtnCopy = $('<div class="btn-group" data-toggle="buttons">')
						.css({"display":"flex","margin-top":"5px"})
						.append(
							$('<div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">')
								.append('<button type="button" class="btn"><i class="fa fa-hashtag" aria-hidden="true"></i>  <span class="listNumber">'+(i+1)+'</span>.</button>',"<br>"),
							$('<div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">'),
							$('<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 colDel">')
								.append($('<div role="group">').append(DeleteBtn,Copyinfo))
					);
			
			if (ss_id_ope == id_ope_com) { Email = ''; Address = ''; } else { EmailOpe = ''; AddressOpe = ''; }
			if (!StatObj.affich_ferry) { FerryNum = ''; FerryTime = ''; }
			if (!StatObj.affich_roadtown) { TravelTime = ''; }
			
			var RowPass = $(div_col6).clone().append(Nom, Address, AddressOpe, City, State, Zipcode, Country, Email, EmailOpe, BirthDate);
			var RowArrival = $(div_col6).clone().append(DateArrival, AirNum, AirTime, FerryNum, FerryTime, TravelTime);
			var Row = $('<div>').attr({"class":"row","pass":Pass_id,"listpass":""}).css({"height":"200px","margin-bottom":"5px"});
			var PrintnewRow = $(Row).append(BtnDel_BtnCopy, RowPass, RowArrival);
			$('#pototypeform').append(PrintnewRow);
		} else {
			//Nut add 23/06/2017
			$.each(StateObj, function(key,value) {
				var valueN = value.names.replace("[chr39]", "'");
				((Pass_State==value.code || Pass_State==valueN) ? sel = "selected" : sel = '');
				OptionState += '<option value="'+value.code+'" '+sel+'>'+value.code+' - '+valueN+'</option>';
			});
			var StateSel = '<select class="form-control pass">' +
											'<option value="">Only U.S. resident</option>' +
											OptionState +
										'</select>';
			
			var OptionCountry = '';
			$.each(CountryObj, function(key,value) {
				var valueN = value.names.replace("[chr39]", "'");
				((Pass_Country==value.names) ? sel = "selected" : sel = '');
				OptionCountry += '<option value="'+value.names+'" '+sel+'>'+valueN+'</option>';
			});
			var CountrySel = '<select class="form-control pass">' +
												'<option value="">Only U.S. resident</option>' +
												OptionCountry +
											'</select>';
			(Pass_WestEnd == 1) ? WEchecked = 'checked' : WEchecked = '';
			(Pass_RoadTown == 1) ? RTchecked = 'checked' : RTchecked = '';
			// end nut
			var groupBtnLastname = $('<div>')
															.addClass('input-group')
															.css('width','100%')
															.append(
																NumberBtn,
																$(inputEl).clone().val(Pass_LastName).attr({"name":"LastName"})
															);
			
			var Male = $('<label class="btn btn-primary GenderMan Gender" name="Gender" autocomplete="off">').val(0).append($('<input type="radio">'),$('<i class="fa fa-male"></i>').css({"font-size":"15px"}));
			var Female = $('<label class="btn btn-primary GenderWomen Gender" name="Gender" autocomplete="off">').val(1).append($('<input type="radio">'),$('<i class="fa fa-female"></i>').css({"font-size":"15px"}));
			
			if(Pass_Gender == "0"){
				$(Male).addClass("active");
			}else if(Pass_Gender == "1"){
				$(Female).addClass("active");
			}
			var groupBtn_Gender = $('<div class="btn-group" data-toggle="buttons">').css({"display":"flex","margin-top":"5px"}).append('<button type="button" class="btn"><i class="fa fa-venus-mars" aria-hidden="true"></i> '+lg_gender+': </button>',Male,Female);
																
					var AllStat = CheckAllStat();
					if(AllStat){
						var ClassCol = "col-lg-5 col-md-5 col-sm-5 col-xs-5";
					}else{
						var ClassCol = "col-lg-5 col-md-5 col-sm-5 col-xs-5";
					}		
					
			var InputGroup = $('<div>').addClass('input-group').css({"width":"100%","margin-top":"5px"});
			var InputGroupAddon = $('<div>').addClass('input-group-addon');
			
			//Nut add 31/05/2017
			typeCrew = ""
			if (StatObj.clss_typecrew == '') {
				var typeCrew = $('<select name="typeCrew">')
													.addClass('form-control typeCrew')
													.append(
														$('<option></option>')
				                    .attr('value','1')
				                    .text('Skipper'),
				                    $('<option></option>')
				                    .attr('value','2')
				                    .text('Cook'),
				                    $('<option></option>')
				                    .attr('value','0')
				                    .text('Crew')
				                  ).css("width","20%px");
				typeCrew = $(InputGroup).clone().append(
					$('<div class="input-group-addon labelNo">').append('<i class="fa fa-street-view" aria-hidden="true"></i> Type of crew'),
					typeCrew
				)	  
			}
			
			var BtnDel_BtnCopy = $('<div class="btn-group" data-toggle="buttons">')
																				.css({"display":"flex","margin-top":"5px"})
																				.append(
																				$('<div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">').append('<button type="button" class="btn"><i class="fa fa-hashtag" aria-hidden="true"></i>  <span class="listNumber">'+(i+1)+'</span>.</button>',typeCrew),
																				$('<div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">'),
																				$('<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 colDel">')
																					.append($('<div role="group">').append(DeleteBtn,Copyinfo))
																				);
			
			var LastName = $('<div class="'+ClassCol+'" >').append(
						$(InputGroup).clone().append(
							$(NumberBtn).append('<i class="fa fa-users" aria-hidden="true"></i> LastName'),
							$(inputEl).clone().val(Pass_LastName).attr({"name":"LastName"})
						)
					),
					FirstName = $('<div class="'+ClassCol+'" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-user" aria-hidden="true"></i> FirstName'),
							$(inputEl).clone().val(Pass_FirstName).data("KeepValue",Pass_FirstName).attr({"name":"FirstName"})
						)
					),
					PlaceOfBirth = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html("<i class='fa fa-location-arrow'></i> Place Of Birth"),
							$(inputEl).clone().val(Pass_PlaceOfBirth).data("KeepValue",Pass_PlaceOfBirth).attr({"name":"PlaceOfBirth"})
						)
					),
					Gender = $('<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" >').append(groupBtn_Gender),
					Email = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-envelope" aria-hidden="true"></i> Email'),
							$(inputEl).clone().val(Pass_Email).data('<i class="fa fa-h-square" aria-hidden="true"></i> KeepValue',Pass_Email).attr({"name":"Email"})
						)
					),/*Broker Email*/
					Address = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> Address'),
							$(inputEl).clone().val(Pass_Address).data("KeepValue",Pass_Address).attr({"name":"Address"})
						)
					),/*Broker Address*/
					EmailOpe = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-envelope" aria-hidden="true"></i> EmailOPE'),
							$(inputEl).clone().val(Pass_EmailOpe).data("KeepValue",Pass_EmailOpe).attr({"name":"EmailOPE"})
						)
					),/*Ope Email*/
					AddressOpe = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> AddressOPE'),
							$(inputEl).clone().val(Pass_AddressOpe).data("KeepValue",Pass_AddressOpe).attr({"name":"AddressOPE"})
						)	
					),/*Ope Address*/
					Age = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-odnoklassniki" aria-hidden="true"></i> Age'),
							$(inputEl).clone().val(Pass_Age).data("KeepValue",Pass_Age).attr({"name":"Age"})
						)
					),
					DateOfBirth = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-birthday-cake" aria-hidden="true"></i> Date of Birth'),
							$(inputEl).clone().val(Pass_DateOfBirth).data("KeepValue",Pass_DateOfBirth).attr({"name":"Date"})
						)
					),
					Nationality = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-globe" aria-hidden="true"></i> Nationality'),
							$(inputEl).clone().val(Pass_Nationality).data("KeepValue",Pass_Nationality).attr({"name":"Nationality"})
						)
					),
					Residence = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append( //Nut add 31/05/2017
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-home" aria-hidden="true"></i> Residence'),
							$(inputEl).clone().val(Pass_Residence).data("KeepValue",Pass_Residence).attr({"name":"Residence"})
						)
					),
					PassPort = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-ticket" aria-hidden="true"></i> Passport'),
							$(inputEl).clone().val(Pass_Passport).data("KeepValue",Pass_Passport).attr({"name":"PassPort"})
						)
					),
					Expiration = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-expeditedssl" aria-hidden="true"></i> Expiration date'),
							$(inputEl).clone().val(Pass_Expiration).data("KeepValue",Pass_Expiration).attr({"name":"Expiration"})
						)
					),
					ShoeSize = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-arrows-h" aria-hidden="true"> Shoe size'),
							$(inputEl).clone().val(Pass_ShoeSize).data("KeepValue",Pass_ShoeSize).attr({"name":"shoesize"})
						)
					),
					Mobile = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-mobile" aria-hidden="true"></i> Mobile'),
							$(inputEl).clone().val(Pass_Mobile).data("KeepValue",Pass_Mobile).attr({"name":"Mobile"})
						)	
					),
					SailingExp = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-ship" aria-hidden="true"></i> SailingExp'),
							$(inputEl).clone().val(Pass_SailingExp).data("KeepValue",Pass_SailingExp).attr({"name":"SailingExp"})
						)
					),
					KinName = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-user" aria-hidden="true"></i> KinName'),
							$(inputEl).clone().val(Pass_KinName).data("KeepValue",Pass_KinName).attr({"name":"KinName"})
						)	
					),
					KinPhone = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-phone" aria-hidden="true"></i> KinPhone'),
							$(inputEl).clone().val(Pass_KinPhone).data("KeepValue",Pass_KinPhone).attr({"name":"KinPhone"})
						)	
					),
					KinRelationship = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-heart" aria-hidden="true"></i> Kin Relationship'),
							$(inputEl).clone().val(Pass_KinRelationship).data("KeepValue",Pass_KinRelationship).attr({"name":"KinRelationship"})
						)
					),
					City = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.City),
							$(inputEl).clone().addClass("input-padding-right").val(Pass_City).data("KeepValue",Pass_City).attr({"name":"City"})
						)
					),
					State = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.State),
							$(StateSel).addClass("input-padding-right").val(Pass_State).data("KeepValue",Pass_State).attr({"name":"State"})
						)
					),
					Zipcode = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.Zipcode),
							$(inputEl).clone().addClass("input-padding-right").val(Pass_Zipcode).data("KeepValue",Pass_Zipcode).attr({"name":"Zipcode"})
						)
					),
					Country = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.Country),
							$(CountrySel).addClass("input-padding-right").val(Pass_Country).data("KeepValue",Pass_Country).attr({"name":"Country"})
						)
					),
					DateArrival = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.lg_ard),
							$(inputEl).clone().addClass("input-padding-right").val(Pass_DateArrival).data("KeepValue",Pass_DateArrival).attr({"name":"DateArrival"})
						)
					),
					AirNum = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html("<i class='fa fa-plane'></i> Airline a Fligh#"),
							$(inputEl).clone().val(Pass_AirNum).data("KeepValue",Pass_AirNum).attr({"name":"AirNum"})
						)
					),
					AirTime = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html("<i class='fa fa-location-arrow'></i> Arrival Time"),
							$(inputEl).clone().val(Pass_AirTime).data("KeepValue",Pass_AirTime).attr({"name":"AirTime"})
						)
					),
					FerryNum = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html("<i class='fa fa-ship'></i> Ferry carrier"),
							$(inputEl).clone().val(Pass_FerryNum).data("KeepValue",Pass_FerryNum).attr({"name":"FerryNum"})
						)
					),
					FerryTime = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html("<i class='fa fa-location-arrow'></i> Departure Time SST"),
							$(inputEl).clone().val(Pass_FerryTime).data("KeepValue",Pass_FerryTime).attr({"name":"FerryTime"})
						)
					),
					TravelTime = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						'(Travel time 1 hour) West End ',
						$('<input type="checkbox" value="1" ' + WEchecked + '>').data("KeepValue",Pass_WestEnd).attr({"name":"WestEnd"}).addClass('chck196'),
						' Road Town ',
						$('<input type="checkbox" value="1" ' + RTchecked + '>').data("KeepValue",Pass_WestEnd).attr({"name":"RoadTown"}).addClass('chck196')
					);
					
					if (!StatObj.Address){Email = ''}
					if (!StatObj.Address){Address = ''}
					if (!StatObj.EmailOpe){EmailOpe = ''}
					if (!StatObj.AddressOpe){AddressOpe = ''}
					if (StatObj.clss_city == "none"){City = ''} //Nut add 23/06/2017
					if (StatObj.clss_state == "none"){State = ''} //Nut add 23/06/2017
					if (StatObj.clss_zipcode == "none"){Zipcode = ''} //Nut add 23/06/2017
					if (StatObj.clss_country == "none"){Country = ''} //Nut add 23/06/2017
					
					if (StatObj.clss_sexual == "none"){Gender = ''}
					if (StatObj.clss_birthplace == "none"){PlaceOfBirth = ''}
					if (StatObj.clss_nation == "none"){Nationality = ''}
					if (StatObj.clss_residence == "none"){Residence = ''} //Nut add 31/05/2017
					if (StatObj.clss_passpo == "none"){PassPort = ''}
					if (StatObj.clss_validi == "none"){Expiration = ''}
					if (StatObj.clss_pointu == "none"){ShoeSize = ''}
					if (StatObj.clss_mobile == "none"){Mobile = ''}
					
					if (StatObj.clss_sailng == "none"){SailingExp = ''}
					if (StatObj.clss_kname == "none"){KinName = ''}
					if (StatObj.clss_kphone == "none"){KinPhone = ''}
					if (StatObj.clss_krelation == "none"){KinRelationship = ''}
					if (StatObj.clss_ageage == "none"){Age = ''}
					if (StatObj.clss_birfda == "none"){DateOfBirth = ''}
					
			if (droits.catamaran_fleet) {
				var Row = $('<div>').attr({"class":"row","pass":Pass_id,"listpass":""}).css({"height":"220px","margin-bottom":"5px"});
				var PrintnewRow = $(Row).append(
					BtnDel_BtnCopy,LastName,FirstName,Gender,Email,Address,City,State,Zipcode,Country,EmailOpe,AddressOpe,DateOfBirth,PlaceOfBirth,Age,Nationality,Residence,PassPort,Expiration,ShoeSize,Mobile,SailingExp,KinName,KinPhone,KinRelationship,
					$('<div class="col-lg-12">').css('margin-top','10px').append('<b><i class="fa fa-bus"></i>'+row.lg_Transporation+'</b>'),
					DateArrival, AirNum, AirTime, FerryNum, FerryTime, TravelTime
				);
			} else {
				var Row = $('<div>').attr({"class":"row","pass":Pass_id,"listpass":""}).css({"height":"155px","margin-bottom":"5px"});
				var PrintnewRow = $(Row).append(BtnDel_BtnCopy,LastName,FirstName,Gender,Email,Address,EmailOpe,AddressOpe,DateOfBirth,PlaceOfBirth,Age,Nationality,Residence,PassPort,Expiration,ShoeSize,Mobile,SailingExp,KinName,KinPhone,KinRelationship);
			}
			$('#pototypeform').append(PrintnewRow);
			GetCrewListElement();
		}
	}
}
	
	function Crewlist_Construct(){
		//##### Start Create Pototype Form #####
		FormPototype(1,"")
		//##### End Create Ptotype Form #####
		
		GetStatusAccess = CallPassAccess();
		GetStatusAccess.success(function(data){
			if(StatObj.CheckCommandLink.typ_command == "agt"){
				TypRef = "?idc=A";
			}else{
				TypRef = "?idc=O";
			}
			
			$('#LinkAccess input[name=DirectLink]').val(direct_lnk+TypRef+droits.refcom+"&d=Nwgdcr");
			
			RenderDocumentAccess(data);
			if(data.DirectClient == "agt" && data.PS == "1" && data.Style == "2"){
				MassAccess = '<div class="alert alert-danger" role="alert" style="margin: 5px;font-size: 25px;text-align: center;"><i class="fa fa-meh-o" aria-hidden="true"></i> <b>Not allow!</b> You can not access. <br><a href="#" class="btn btn-primary" id="SendRequest"><i class="fa fa-envelope-o" aria-hidden="true"></i>  Send request now!</a></div>';
				$('#skipper-info .panel-body').empty().html(MassAccess);
							if(Object.keys(Progress).length != 0){
								CrewListProgress.animate((Progress.CW/100));
								SkipperInfoProgress.animate((Progress.SK/100));
								Co_SkipperInfoProgress.animate((Progress.CO/100));
								ArrToMariProgress.animate((Progress.AM/100));
								EmergentcyProgress.animate((Progress.EM/100));
								UploadProgress.animate((Progress.UP/100));	
							}
							$("#SendRequest").click(function(){
								SendRequest.init("askAccess");
							});
			}else{
				$('#taptool').show();
				/*##### START Create List of Passengers #####*/
					AllStat = CheckAllStat();
					if(AllStat){//All true
						OPEBK = CallListPass_OPEBK();
						OPEBK.success(function(data){
							ManageRowPassList(data);
							DisplayDelAllPassBtn();
						});
						
					}else{
						
						NormalDisplay = CallListPass();
						NormalDisplay.success(function(data){
							pass = data;
							ManageRowPassList(data);
							DisplayDelAllPassBtn();
						});
					}
					/*##### END Create List of Passengers #####*/
					var PassInfo = CallPassInfo();
					PassInfo.success(function(data){
						EMData["EmName"] = data.EM_Name;
						EMData["EmRalationship"] = data.EM_Relationship;
						EMData["EmAddress"] = data.EM_Address;
						EMData["EmCity"] = data.EM_City;
						EMData["EmPhone1"] = data.EM_Phone;
						EMData["EmPhone2"] = data.EM_Phone2;
						EMData["Id_Info"] = data.Id_Info;
						
						ArrToMar["ATM_Access"] = data.ATM_Access;
						ArrToMar["ATM_AmountCrew"] = data.ATM_AmountCrew;
						ArrToMar["ATM_Arrival_Time"] = data.ATM_Arrival_Time;
						ArrToMar["ATM_DateStart"] = data.ATM_DateStart;
						ArrToMar["ATM_Flight_From"] = data.ATM_Flight_From;
						ArrToMar["ATM_Flight_Number"] = data.ATM_Flight_Number;
						ArrToMar["ATM_Flight_To"] = data.ATM_Flight_To;
						ArrToMar["ATM_Taxi"] = data.ATM_Taxi;
						ArrToMar["HotelPrior"] = data.Hotel;
						ArrToMar["Vberths"] = data.Vberths;
						
						CommentData["Comment"] = data.Comment;
						if (droits.catamaran_fleet) { //Nut add 08/06/2017
							if(ArrToMar.ATM_Taxi == '1'){
								$('#RegArrTra').find('#ArrYes').removeClass('btn-default').addClass("btn-success");
							}else{
								$('#RegArrTra').find('#ArrNo').removeClass('btn-default').addClass("btn-danger");
							}
						}
						CreatePassInfoForm(data);
					});
			}
		});	
			
	}
	
	function Skipper_Construct(){
		var Query = call_query(droits.typ_command,droits.SQL_TYP,droits.id_command,droits.id_ope_com,droits.id_client,droits.ss_id_ope,droits.affich_access,droits.refcom);
			Query.success(function(data){
				if(ss_auto=="2" && droits.clt_style != "A2326" && droits.skipper == 1 && (droits.ss_styl != droits.clt_style)){
					MassAccess = '<div class="alert alert-danger" role="alert" style="margin: 5px;font-size: 25px;text-align: center;"><i class="fa fa-meh-o" aria-hidden="true"></i> <b>Not allow!</b> You can not access.</div>';
					$('#Import_SK').hide();
					$('#Import_BH').hide();
					$('#Import_CO').hide();
					$('#SkipperInfo').show().html(MassAccess);
					$('#BoatHistory').show().html(MassAccess);
					$('#Co-SkipperInfo').show().html(MassAccess);
					$('#UploadInfo').show().html(MassAccess);
				}else{
					typ_command = droits.typ_command;
					SQL_TYP = droits.SQL_TYP;
					id_command = droits.id_command
					id_ope_com = droits.id_ope_com;
					id_agt_com = droits.id_agt_com;
					id_client = droits.id_client;
					ss_id_ope = droits.ss_id_ope;
					affich_access = droits.affich_access;
					refcom = droits.refcom;
					id_expNautic = row.id_expNautic;
					if(id_expNautic==null){
						id_expNautic = '';
					}

					if(droits.catamaran_fleet){
						$('#BH').hide();
						$('#UP').hide();
//						$('#myTab li a[href=#BH], #myTab li a[href=#AM], #myTab li a[href=#UP]').hide();
						$('#myTab li a[href=#BH],[href=#UP]').hide();
						var GetContrat = Contrat_sign();
						GetContrat.success(function(data){
							contrat = data;
							SkipperInfo();
						});
						if(droits.affich_coskipper){
							var GetCo = GetCoSkipper('1');
							GetCo.success(function(data){
								id_exp_co = data.id_expNautic;
								CoSkipperInfo();
							});
						}else{
							$('#Co_SkipperInfoProg').parent().parent().hide()
							$('#CO').hide();
							$('#myTab li a[href="#CO"]').hide();
						}
						
					}else{
						Boating_history_02 = GetCondition_BH_tab(id_ope_com,"[262][2]"); 
						Boating_history_04 = GetCondition_BH_tab(id_ope_com,"[O332]"); 
						Boating_history_06 = GetCondition_BH_tab(id_ope_com,"[O192][O479][O567]"); 
						Checkfor_BH_tab(Boating_history_01,Boating_history_02,Boating_history_03,Boating_history_04,Boating_history_05,Boating_history_06);
						SkipperInfo(jQuery.parseJSON(State),jQuery.parseJSON(Country),Salutation_skipper_01,Salutation_skipper_02);
						BoatingHistory(Boating_history_01,Boating_history_02,Boating_history_03,Boating_history_04,Boating_history_05,Boating_history_06,Boating_history_07);
						if(droits.affich_coskipper){
							CoSkipperInfo(jQuery.parseJSON(State),jQuery.parseJSON(Country),Salutation_equipier_01,Salutation_equipier_02);
						}else{
							$('#myTab li a[href="#CO"]').hide();
						}
						
//						if (id_ope_com == '567') {
//							$('#myTab > li a[href=#AM]').hide();
//						}
						ListFiles(dir,empty);
						ImportFiles();
					}					
					MarkSkipper(droits.skipper);
				}
			});		
	}

function ConfirmErorModal(err_text){
	var BtnConf = $('<button type="button" class="btn btn-primary Confdel" data-dismiss="modal"><i name="delup" class="fa fa fa-ok fa-lg"></i>Ok</button>');
	var Massage = $('<div class="alert alert-danger" role="alert">'+
									  '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'+
									  '<span class="sr-only">Error:</span>'+
									  'This text ("'+err_text+'") is not correct,please change the new one.'+
									'</div>');
	
	var Mainmodal = $("<div>").attr({id:"ComfirmError",class:"modal fade",role:"dialog"}).css("margin","0 auto");
	var Dia_modal = $("<div>").attr("class","modal-dialog");
	var Con_modal = $("<div>").attr("class","modal-content");
	var Hea_modal = $("<div>").attr("class","modal-header").html('<button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title"> <i class="fa fa fa-remove fa-lg"></i>'+close_btn+'</h4>');
	var Bod_modal = $("<div>").attr("class","modal-body").html(Massage);
	var Foo_modal = $("<div>").attr("class","modal-footer").append(BtnConf);
			
	Mainmodal.append(Dia_modal,Con_modal);
	Con_modal.append(Hea_modal,Bod_modal,Foo_modal);
	Dia_modal.append(Con_modal);
			
	$(Mainmodal).modal('show').promise().done(function(){

//		$(Mainmodal).on('hidden.bs.modal', function () {
//			//$(this).data('bs.modal', null).remove();
//		});
		
		$(Mainmodal).on('shown.bs.modal', function () {
		});

	});
	return Mainmodal;
}

function ErorModal(err_text){
	var BtnConf = $('<button type="button" class="btn btn-primary Confdel" data-dismiss="modal"><i name="delup" class="fa fa fa-ok fa-lg"></i>Ok</button>');
	var Massage = $('<div class="alert alert-danger" role="alert">'+
									  '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'+
									  '<span class="sr-only">Error:</span>'+
									  err_text+',please try again later.'+
									'</div>');
	
	var Mainmodal = $("<div>").attr({id:"ComfirmError",class:"modal fade",role:"dialog"}).css("margin","0 auto");
	var Dia_modal = $("<div>").attr("class","modal-dialog");
	var Con_modal = $("<div>").attr("class","modal-content");
	var Hea_modal = $("<div>").attr("class","modal-header").html('<button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title"> <i class="fa fa fa-remove fa-lg"></i>'+close_btn+'</h4>');
	var Bod_modal = $("<div>").attr("class","modal-body").html(Massage);
	var Foo_modal = $("<div>").attr("class","modal-footer").append(BtnConf);
			
	Mainmodal.append(Dia_modal,Con_modal);
	Con_modal.append(Hea_modal,Bod_modal,Foo_modal);
	Dia_modal.append(Con_modal);
			
	$(Mainmodal).modal('show').promise().done(function(){

//		$(Mainmodal).on('hidden.bs.modal', function () {
//			//$(this).data('bs.modal', null).remove();
//		});
		
		$(Mainmodal).on('shown.bs.modal', function () {
		});

	});
	return Mainmodal;
}

function DisableInput_SK_SKCO(name,inputclass,val){
	var ElOfName;
	switch (name) {
    case "mylicence":
        ElOfName = ["mylicence_type","mylicence_num","mylicence_off","mylicence_date","mylicence_until","mylicence_for","myNb_year","myNb_day"];
        IdParrent = "#SkipperInfo"
        break;
    case "myhave_boat":
        ElOfName = ["mytype_boat","mylong_boat","myplace_boat"];
        IdParrent = "#SkipperInfo"
        break;
    case "myhave_boat_equipier":
			ElOfName = ["mytype_boat_equipier","mylong_boat_equipier","myplace_boat_equipier"];
			break;
    default:
			ElOfName = "";
       IdParrent = "#Co-SkipperInfo"
	}
	
	$.each(ElOfName,function(index,value){
		if(val == "yes"){
			$('input.'+inputclass+'[name='+value+']')
			.val("")
			.removeAttr("disabled")
			$('input.'+inputclass+'[name='+value+']').parents(IdParrent+" div.row div.row").slideDown(500)
		}else{
			$('input.'+inputclass+'[name='+value+']')
			.val("")
			.attr("disabled","")
			$('input.'+inputclass+'[name='+value+']').parents(IdParrent+" div.row div.row").slideUp(500)
		}
	});
	
}
	
var QueueSkipper = [];
var QueueUpdateSkipper = (function(){
    var add = function(id_command,id_commandAGT,nam,val,id_expNautic,id_client,KeepSuccess,ThisEl){
      AjaxQueueProgress();
    		var data = {"id_command":id_command,"id_commandAGT":id_commandAGT,"nam":nam,"val":val,"id_expNautic":id_expNautic,"id_client":id_client,"KeepSuccess":KeepSuccess};
	    QueueSkipper.push([data]);
	    if(QueueSkipper.length == 1){//Start
	     doAjax(ThisEl);
	    }
    };
    var next = function(ThisEl){
        var old = QueueSkipper[0];//old
        if(deleteObj()){
         var idObj = QueueSkipper[0];//Next
         if(typeof idObj != 'undefined' ){
          doAjax(ThisEl);
         }
        } 
    };
    var doAjax = function(ThisEl){
    	try{
				var value =  window.btoa(unescape(encodeURIComponent(QueueSkipper[0][0].val)));
				var Ajax = UpdateSkipper(QueueSkipper[0][0].id_command,QueueSkipper[0][0].id_commandAGT,QueueSkipper[0][0].nam,QueueSkipper[0][0].val,QueueSkipper[0][0].id_expNautic,QueueSkipper[0][0].id_client);
	      Ajax.success(QueueSkipper[0][0].KeepSuccess);
	      Ajax.error(function(xhr, status, error){
	      	window.fail = "fail";
	      	ProgressManage("danger",this.idAjax);
	      	StatUpdate.options({
						el:ThisEl,
						typ:"error"
					})
					QueueUpdateSkipper.next(ThisEl);
					window.fail = "";
	      });
			}catch(e){
				window.fail = "fail";
				ProgressManage("danger",this.idAjax);
				var Btn = ConfirmErorModal(QueueSkipper[0][0].val);
				$(Btn).on('hidden.bs.modal', function(e) {
				  QueueUpdateSkipper.next(ThisEl);
				  window.fail = "";
				});
			}
    };
    var deleteObj = function(){
     QueueSkipper.shift();//Delete
     AjaxQueueProgress();
     return true;
    }
    return {
      add:add,
      next:next,
      deleteObj:deleteObj
    };
}());
			
$('#SK').on({
	'keydown keyup':function(ev){
		var nam = $(this).attr("name");
		var val = $(this).val();
		var ThisEl = $(this);
		var type = ev.target.type;
		if(ev.keyCode == 8 || ev.keyCode == 46 && ev.keyCode != 86 ){//When press SPACE and DELETE button and 86 Check V
			delay(function(){//When stop typing and wait then save.
				if(CheckEl[$(ThisEl).attr("name")] != $(ThisEl).val()){
					$(ThisEl).change(function(event){
						$(ThisEl).unbind();
						ev.stopPropagation();
					});
					val = val.replace(/'+/g,"''");
					StatUpdate.options({
							el:ThisEl,
							typ:"inprogress"
					})
					QueueUpdateSkipper.add(id_command,id_commandAGT,nam,val,id_expNautic,id_client,function(data){
						CheckEl[$(ThisEl).attr("name")] = data.mass;
						UpdateSuccess(ThisEl,data);
						id_expNautic = data.id_expNautic;
						if(row.coskip==''){ row.coskip = data.coskip; }
						if(type=='textarea'){
							$(ThisEl).html(data.mass);
						}else{
							$(ThisEl).attr({"value":data.mass});
						}
						StatUpdate.options({
							el:ThisEl,
							typ:"success"
						})
						ProgressManage("success",this.idAjax);
						QueueUpdateSkipper.next(ThisEl);
						GetSkipperElement();
					},ThisEl);
				}
			},300);
		}else{
			var Empty = ($(ThisEl).val().replace(/\s+/g, '') == "");
			if(!Empty){
				delay(function(){//When stop typing and wait then save.
					if(ev.keyCode != 17 && ev.keyCode != 9){//Check for v		
						if(CheckEl[$(ThisEl).attr("name")] != $(ThisEl).val()){
							$(ThisEl).change(function(event){
								$(ThisEl).unbind();
								event.stopPropagation();
							});
							val = val.replace(/'+/g,"''");
							StatUpdate.options({
								el:ThisEl,
								typ:"inprogress"
							})
							QueueUpdateSkipper.add(id_command,id_commandAGT,nam,val,id_expNautic,id_client,function(data){
								CheckEl[$(ThisEl).attr("name")] = data.mass;
								UpdateSuccess(ThisEl,data);
								id_expNautic = data.id_expNautic;
								if(row.coskip==''){ row.coskip = data.coskip; }
								if(type=='textarea'){
									$(ThisEl).html(data.mass);
								}else{
									$(ThisEl).attr({"value":data.mass});
								}
								StatUpdate.options({
									el:ThisEl,
									typ:"success"
								})
								ProgressManage("success",this.idAjax);
								QueueUpdateSkipper.next(ThisEl);
								GetSkipperElement();
							},ThisEl);
						}
					}
				},700);
			}
		}
	},
	'change':function(ev){
		var nam = $(this).attr("name");
		var val = $(this).val();
		var ThisEl = $(this);
		var type = ev.target.type;
		if(type == "radio"){
			
			DisableInput_SK_SKCO(nam,ThisEl.attr("class"),val);
			setTimeout(function(){GetSkipperElement(); }, 800);
			
		}
		var Empty = ($(ThisEl).val().replace(/\s+/g, '') == "");
		if(CheckEl[$(ThisEl).attr("name")] != $(ThisEl).val()){
			$(ThisEl).keyup(function(event){
				$(ThisEl).unbind();
				event.stopPropagation();
			});
			val = val.replace(/'+/g,"''");
			StatUpdate.options({
				el:ThisEl,
				typ:"inprogress"
			})
				QueueUpdateSkipper.add(id_command,id_commandAGT,nam,val,id_expNautic,id_client,function(data){
					CheckEl[$(ThisEl).attr("name")] = data.mass;
					UpdateSuccess(ThisEl,data);
					id_expNautic = data.id_expNautic;
					if(row.coskip==''){ row.coskip = data.coskip; }
					if(type=='textarea'){
						$(ThisEl).html(data.mass);
					}else{
						$(ThisEl).attr({"value":data.mass});
					}
					StatUpdate.options({
						el:ThisEl,
						typ:"success"
					})
					ProgressManage("success",this.idAjax);
					QueueUpdateSkipper.next(ThisEl);
					GetSkipperElement();
				},ThisEl);
		}
	},
	'paste':function(ev){
		var nam = $(this).attr("name");
		var val = $(this).val();
		var ThisEl = $(this);
		var type = ev.target.type;
			if(CheckEl[$(ThisEl).attr("name")] != $(ThisEl).val()){
				var Empty = ($(ThisEl).val().replace(/\s+/g, '') == "");
				if(!Empty){
					val = val.replace(/'+/g,"''");
					StatUpdate.options({
						el:ThisEl,
						typ:"inprogress"
					})
					QueueUpdateSkipper.add(id_command,id_commandAGT,nam,val,id_expNautic,id_client,function(data){
						CheckEl[$(ThisEl).attr("name")] = data.mass;
						UpdateSuccess(ThisEl,data);
						id_expNautic = data.id_expNautic;
						if(row.coskip==''){ row.coskip = data.coskip; }
						if(type=='textarea'){
							$(ThisEl).html(data.mass);
						}else{
							$(ThisEl).attr({"value":data.mass});
						}
						StatUpdate.options({
							el:ThisEl,
							typ:"success"
						})
						ProgressManage("success",this.idAjax);
						QueueUpdateSkipper.next(ThisEl);
						GetSkipperElement();
					},ThisEl);
				}
			}
	}
},'.skipper');

var QueueCoSkipper = [];
var QueueUpdateCoSkipper = (function(){
    var add = function(id_command,id_commandAGT,nam,val,id_expNautic,id_client,KeepSuccess,ThisEl){
      AjaxQueueProgress();
        var data = {"id_command":id_command,"id_commandAGT":id_commandAGT,"nam":nam,"val":val,"id_expNautic":id_expNautic,"id_client":id_client,"KeepSuccess":KeepSuccess};
	    QueueCoSkipper.push([data]);
	    if(QueueCoSkipper.length == 1){//Start
	     doAjax(ThisEl);
	    }
    };
    var next = function(ThisEl){
        var old = QueueCoSkipper[0];//old
        if(deleteObj()){
         var idObj = QueueCoSkipper[0];//Next
         if(typeof idObj != 'undefined' ){
          doAjax(ThisEl);
         }
        } 
    };
    var doAjax = function(ThisEl){
    	try{
				var value =  window.btoa(unescape(encodeURIComponent(QueueCoSkipper[0][0].val)))//window.btoa(QueueCoSkipper[0][0].val);
	    	var Ajax = UpdateCoSkipper(QueueCoSkipper[0][0].id_command,QueueCoSkipper[0][0].id_commandAGT,QueueCoSkipper[0][0].nam,QueueCoSkipper[0][0].val,QueueCoSkipper[0][0].id_expNautic,QueueCoSkipper[0][0].id_client);
		        Ajax.success(QueueCoSkipper[0][0].KeepSuccess);
						Ajax.error(function(xhr, status, error){
			      	window.fail = "fail";
			      	ProgressManage("danger",this.idAjax);
			      	StatUpdate.options({
								el:ThisEl,
								typ:"error"
							})
							QueueUpdateCoSkipper.next(ThisEl);
							window.fail = "";
						});
		  }catch(e){
				window.fail = "fail";
				ProgressManage("danger",this.idAjax);
				var Btn = ConfirmErorModal(QueueCoSkipper[0][0].val);
				$(Btn).on('hidden.bs.modal', function(e) {
				  QueueUpdateCoSkipper.next(ThisEl);
				  window.fail = "";
				})
			}
    };
    var deleteObj = function(){
		   QueueCoSkipper.shift();//Delete
		   AjaxQueueProgress();
		   return true;
    }
    return {
        add:add,
        next:next,
        deleteObj:deleteObj
    };
}());

$('#CO').on({
	'keydown keyup':function(ev){
		var nam = $(this).attr("name");
		var val = $(this).val();
		var ThisEl = $(this);
		var type = ev.target.type;
		if(nam != "myBoat_equipier"){
			if(ev.keyCode == 8 || ev.keyCode == 46 && ev.keyCode != 86 ){//When press SPACE and DELETE button and 86 Check V
				delay(function(){//When stop typing and wait then save.
					if(CheckEl[$(ThisEl).attr("name")] != $(ThisEl).val()){
						$(ThisEl).change(function(event){
							$(ThisEl).unbind();
							event.stopPropagation();
						});
						val = val.replace(/'+/g,"''");
						if(droits.catamaran_fleet){ id_expNautic = catama.id_expNautic; }
						StatUpdate.options({
							el:ThisEl,
							typ:"inprogress"
						})
						QueueUpdateCoSkipper.add(id_command,id_commandAGT,nam,val,id_expNautic,id_client,function(data){
							CheckEl[$(ThisEl).attr("name")] = data.mass;
							UpdateSuccess(ThisEl,data);
							id_expNautic = data.id_expNautic;
							if(droits.catamaran_fleet){
								if(catama.coskip==''){ catama.coskip = data.coskip; }
								if(catama.id_expNautic==''){ catama.id_expNautic = data.id_expNautic; id_exp_co = data.id_expNautic; }
							}
							if(type=='textarea'){
								$(ThisEl).html(data.mass);
							}else{
								$(ThisEl).attr({"value":data.mass});
							}
							StatUpdate.options({
								el:ThisEl,
								typ:"success"
							})
							ProgressManage("success",this.idAjax);
							QueueUpdateCoSkipper.next();
							GetCoSkipperElement();
						},ThisEl);
					}
				},300);
			}else{
				var Empty = ($(ThisEl).val().replace(/\s+/g, '') == "");
				if(!Empty){
					delay(function(){//When stop typing and wait then save.
						if(ev.keyCode != 17 && ev.keyCode != 9){//Check for v
							if(CheckEl[$(ThisEl).attr("name")] != $(ThisEl).val()){
								$(ThisEl).change(function(event){
									$(ThisEl).unbind();
									event.stopPropagation();
								});
								val = val.replace(/'+/g, "''");//replace single-code by double-code
								if(droits.catamaran_fleet){ id_expNautic = catama.id_expNautic; }
								StatUpdate.options({
									el:ThisEl,
									typ:"inprogress"
								})
								QueueUpdateCoSkipper.add(id_command,id_commandAGT,nam,val,id_expNautic,id_client,function(data){
									CheckEl[$(ThisEl).attr("name")] = data.mass;
									UpdateSuccess(ThisEl,data);
									id_expNautic = data.id_expNautic;
									if(droits.catamaran_fleet){
										if(catama.coskip==''){ catama.coskip = data.coskip; }
										if(catama.id_expNautic==''){ catama.id_expNautic = data.id_expNautic; id_exp_co = data.id_expNautic; }
									}
									if(type=='textarea'){
										$(ThisEl).html(data.mass);
									}else{
										$(ThisEl).attr({"value":data.mass});
									}
									StatUpdate.options({
										el:ThisEl,
										typ:"success"
									})
									ProgressManage("success",this.idAjax);
									QueueUpdateCoSkipper.next();
									GetCoSkipperElement();
								},ThisEl);
							}
						}
						
					},700);
				}
			}
		}
	},
	'change':function(ev){
		var newval = '';
		var nam = $(this).attr("name");
		var val = $(this).val();
		var ThisEl = $(this);
		var type = ev.target.type;
		if(type == "radio"){
			DisableInput_SK_SKCO(nam,ThisEl.attr("class"),val);
			setTimeout(function(){GetCoSkipperElement();}, 800);
		}
		var Empty = ($(ThisEl).val().replace(/\s+/g, '') == "");
		if(nam == "myBoat_equipier"){//Keep checkbox value to Array
			$(ThisEl).keyup(function(event){
				$(ThisEl).unbind();
				event.stopPropagation();
			});
			var arr = $('input[name="myBoat_equipier"]').serializeArray();
			var arrGo = [];
			$.each(arr,function(value,value_arr){
				arrGo.push(value_arr.value);
			});
			var str = "";
			$.each(arrGo,function(value,value_arr){
				if(value == 0){
			    str += value_arr;
			  }else if(value == 1){
			    str += ","+value_arr;
			  }else if(value == 2){
			    str += ","+value_arr;
			  }
			});
			val = str
			val = val.replace(/'+/g, "''");//replace single-code by double-code
			if(droits.catamaran_fleet){ id_expNautic = catama.id_expNautic; }
			StatUpdate.options({
				el:ThisEl,
				typ:"inprogress"
			})
			QueueUpdateCoSkipper.add(id_command,id_commandAGT,nam,val,id_expNautic,id_client,function(data){
				CheckEl[$(ThisEl).attr("name")] = data.mass;
				UpdateSuccess(ThisEl,data);
				id_expNautic = data.id_expNautic;
				if(droits.catamaran_fleet){
					if(catama.coskip==''){ catama.coskip = data.coskip; }
					if(catama.id_expNautic==''){ catama.id_expNautic = data.id_expNautic; id_exp_co = data.id_expNautic; }
				}
				StatUpdate.options({
					el:ThisEl,
					typ:"success"
				})
				ProgressManage("success",this.idAjax);
				QueueUpdateCoSkipper.next();
				GetCoSkipperElement();
			},ThisEl);
   	}else{
			if(CheckEl[$(ThisEl).attr("name")] != $(ThisEl).val()){
				$(ThisEl).keyup(function(event){
					$(ThisEl).unbind();
					event.stopPropagation();
				});
				val = val.replace(/'+/g,"''");
				//val = window.btoa(val);//encode Character
				if(droits.catamaran_fleet){ id_expNautic = catama.id_expNautic; }
					StatUpdate.options({
						el:ThisEl,
						typ:"inprogress"
					})
					QueueUpdateCoSkipper.add(id_command,id_commandAGT,nam,val,id_expNautic,id_client,function(data){
						CheckEl[$(ThisEl).attr("name")] = data.mass;
						UpdateSuccess(ThisEl,data);
						id_expNautic = data.id_expNautic;
						if(droits.catamaran_fleet){
							if(catama.coskip==''){ catama.coskip = data.coskip; }
							if(catama.id_expNautic==''){ catama.id_expNautic = data.id_expNautic; id_exp_co = data.id_expNautic; }
						}
						if(type=='textarea'){
							$(ThisEl).html(data.mass);
						}else{
							$(ThisEl).attr({"value":data.mass});
						}
						StatUpdate.options({
							el:ThisEl,
							typ:"success"
						})
						ProgressManage("success",this.idAjax);
						QueueUpdateCoSkipper.next();
						GetCoSkipperElement();
					},ThisEl);
			}
   	}
	},
	'paste':function(ev){
		var nam = $(this).attr("name");
		var val = $(this).val();
		var ThisEl = $(this);
		var type = ev.target.type;
		delay(function(){//When paste and wait then save.
			if(CheckEl[$(ThisEl).attr("name")] != $(ThisEl).val()){
				var Empty = ($(ThisEl).val().replace(/\s+/g, '') == "");
				if(!Empty){
					val = val.replace(/'+/g, "''");//replace single-code by double-code
					if(droits.catamaran_fleet){ id_expNautic = catama.id_expNautic; }
					StatUpdate.options({
						el:ThisEl,
						typ:"inprogress"
					})
					QueueUpdateCoSkipper.add(id_command,id_commandAGT,nam,val,id_expNautic,id_client,function(data){
						CheckEl[$(ThisEl).attr("name")] = data.mass;
						UpdateSuccess(ThisEl,data);
						id_expNautic = data.id_expNautic;
						if(droits.catamaran_fleet){
							if(catama.coskip==''){ catama.coskip = data.coskip; }
							if(catama.id_expNautic==''){ catama.id_expNautic = data.id_expNautic; id_exp_co = data.id_expNautic; }
						}
						if(type=='textarea'){
							$(ThisEl).html(data.mass);
						}else{
							$(ThisEl).attr({"value":data.mass});
						}
						StatUpdate.options({
							el:ThisEl,
							typ:"success"
						})
						ProgressManage("success",this.idAjax);
						QueueUpdateCoSkipper.next();
						GetCoSkipperElement();
					},ThisEl);
				}
			}
		},200);
	}
},'.co-skipper');

var QueueBoatingHistory = [];
var QueueUpdateBoatingHistory = (function(){
    var add = function(id_command,id_commandAGT,nam,val,id_expNautic,id_client,KeepSuccess){
      AjaxQueueProgress();
        var data = {"id_command":id_command,"id_commandAGT":id_commandAGT,"nam":nam,"val":val,"id_expNautic":id_expNautic,"id_client":id_client,"KeepSuccess":KeepSuccess};
	    QueueBoatingHistory.push([data]);
	    if(QueueBoatingHistory.length == 1){//Start
	     doAjax();
	    }
    };
    var next = function(){
        var old = QueueBoatingHistory[0];//old
        if(deleteObj()){
         var idObj = QueueBoatingHistory[0];//Next
         if(typeof idObj != 'undefined' ){
          doAjax();
         }
        } 
    };
    var doAjax = function(){
    	try{
				var value =  window.btoa(unescape(encodeURIComponent(QueueBoatingHistory[0][0].val)))//window.btoa(QueueBoatingHistory[0][0].val);
	     	var Ajax = UpdateBoatingHistory(QueueBoatingHistory[0][0].id_command,QueueBoatingHistory[0][0].id_commandAGT,QueueBoatingHistory[0][0].nam,QueueBoatingHistory[0][0].val,QueueBoatingHistory[0][0].id_expNautic,QueueBoatingHistory[0][0].id_client);
	      Ajax.success(QueueBoatingHistory[0][0].KeepSuccess);
	     	Ajax.error(function(xhr, status, error){
	      	window.fail = "fail";
	      	ProgressManage("danger",this.idAjax);
	      	var Btn = ErorModal(error);
	      	$(Btn).on('hidden.bs.modal', function(e) {
					  QueueUpdateBoatingHistory.next();
					  window.fail = "";
					});
				});
			}catch(e){
				window.fail = "fail";
				ProgressManage("danger",this.idAjax);
				var Btn = ConfirmErorModal(QueueBoatingHistory[0][0].val);
				$(Btn).on('hidden.bs.modal', function(e) {
					//$('input[name='+QueueBoatingHistory[0][0].nam+']').val(CheckEl[QueueBoatingHistory[0][0].nam]);
				  QueueUpdateBoatingHistory.next();
				  window.fail = "";
				});
			}
    };
    var deleteObj = function(){
     	QueueBoatingHistory.shift();//Delete
     	AjaxQueueProgress();
     	return true;
    }
    return {
      add:add,
      next:next,
      deleteObj:deleteObj
    };
}());

$('#BH').on({
	'keydown keyup':function(ev){
		var nam = $(this).attr("name");
		var type = ev.target.type;
		var val = $(this).val();
		var ThisEl = $(this);
		if(nam != "fld_char_02" && nam != "fld_char_03" && nam != "fld_char_04" && nam != "fld_char_05" && type != "radio"){
			if(ev.keyCode == 8 || ev.keyCode == 46 && ev.keyCode != 86 ){//When press SPACE and DELETE button and 86 Check V
				delay(function(){//When stop typing and wait then save.
					if(CheckEl[$(ThisEl).attr("name")] != $(ThisEl).val()){
						$(ThisEl).change(function(event){
							$(ThisEl).unbind();
							event.stopPropagation();
						});
						val = val.replace(/'+/g,"''");
						//val = window.btoa(val);//encode Character
						QueueUpdateBoatingHistory.add(id_command,id_commandAGT,nam,val,id_expNautic,id_client,function(data){
							CheckEl[$(ThisEl).attr("name")] = data.mass;
							UpdateSuccess(ThisEl,data);
							id_expNautic = data.id_expNautic;
							if(type=='textarea'){
								$(ThisEl).html(data.mass);
							}else{
								$(ThisEl).attr({"value":data.mass});
							}
							ProgressManage("success",this.idAjax);
							QueueUpdateBoatingHistory.next();
						});
					}
				},300);
			}else{
				var Empty = ($(ThisEl).val().replace(/\s+/g, '') == "");
				if(!Empty){
					delay(function(){//When stop typing and wait then save.
						if(ev.keyCode != 17 && ev.keyCode != 9){//Check for v
								//val = val.replace("'", "''");//replace single-code by double-code
							if(CheckEl[$(ThisEl).attr("name")] != $(ThisEl).val()){
								$(ThisEl).change(function(event){
									$(ThisEl).unbind();
									event.stopPropagation();
								});
								val = val.replace(/'+/g, "''");//replace single-code by double-code
								//val = window.btoa(val);//encode Character
								QueueUpdateBoatingHistory.add(id_command,id_commandAGT,nam,val,id_expNautic,id_client,function(data){
									CheckEl[$(ThisEl).attr("name")] = data.mass;
									UpdateSuccess(ThisEl,data);
									id_expNautic = data.id_expNautic;
									if(type=='textarea'){
										$(ThisEl).html(data.mass);
									}else{
										$(ThisEl).attr({"value":data.mass});
									}
									ProgressManage("success",this.idAjax);
									QueueUpdateBoatingHistory.next();
								});
							}
						}
						
					},700);
				}
			}
		}
	},
	'change':function(ev){
		var newval = '';
		var nam = $(this).attr("name");
		var type = ev.target.type;
		var val = $(this).val();
		var ThisEl = $(this);
		var Empty = ($(ThisEl).val().replace(/\s+/g, '') == "");
		if(nam == "fld_char_02" || nam == "fld_char_03" || nam == "fld_char_04" || nam == "fld_char_05"){//Keep checkbox value to Array
			if(type!="select"){
				$(ThisEl).keyup(function(event){
					$(ThisEl).unbind();
					event.stopPropagation();
				});
				var arr = $('input[name="'+nam+'"]').serializeArray();
				var arrGo = [];
				$.each(arr,function(value,value_arr){
					arrGo.push(value_arr.value);
				});
				var str = "";
				$.each(arrGo,function(value,value_arr){
					if(value == 0){
				    str += value_arr;
				  }else if(value == 1){
				    str += ","+value_arr;
				  }else if(value == 2){
				    str += ","+value_arr;
				  }else if(value == 3){
				  	str += ","+value_arr;
				  }else if(value == 4){
				  	str += ","+value_arr;
				  }
				});
				val = str
				val = val.replace(/'+/g, "''");//replace single-code by double-code
				//val = window.btoa(val);//encode Character
				QueueUpdateBoatingHistory.add(id_command,id_commandAGT,nam,val,id_expNautic,id_client,function(data){
					CheckEl[$(ThisEl).attr("name")] = data.mass;
					UpdateSuccess(ThisEl,data);
					id_expNautic = data.id_expNautic;
					ProgressManage("success",this.idAjax);
					QueueUpdateBoatingHistory.next();
				});
			}
   	}else{
			if(CheckEl[$(ThisEl).attr("name")] != $(ThisEl).val()){
				$(ThisEl).keyup(function(event){
					$(ThisEl).unbind();
					event.stopPropagation();
				});
				val = val.replace(/'+/g,"''");
				//val = window.btoa(val);//encode Character
					QueueUpdateBoatingHistory.add(id_command,id_commandAGT,nam,val,id_expNautic,id_client,function(data){
						CheckEl[$(ThisEl).attr("name")] = data.mass;
						UpdateSuccess(ThisEl,data);
						id_expNautic = data.id_expNautic;
						if(type=='textarea'){
							$(ThisEl).html(data.mass);
						}else{
							$(ThisEl).attr({"value":data.mass});
						}
						ProgressManage("success",this.idAjax);
						QueueUpdateBoatingHistory.next();
					});
			}
   	}
	},
	'paste':function(ev){
		var nam = $(this).attr("name");
		var val = $(this).val();
		var ThisEl = $(this);
		var type = ev.target.type;
		delay(function(){//When paste and wait then save.
			if(CheckEl[$(ThisEl).attr("name")] != $(ThisEl).val()){
				var Empty = ($(ThisEl).val().replace(/\s+/g, '') == "");
				if(!Empty){
					val = val.replace(/'+/g, "''");//replace single-code by double-code
					QueueUpdateBoatingHistory.add(id_command,id_commandAGT,nam,val,id_expNautic,id_client,function(data){
						CheckEl[$(ThisEl).attr("name")] = data.mass;
						UpdateSuccess(ThisEl,data);
						id_expNautic = data.id_expNautic;
						if(type=='textarea'){
							$(ThisEl).html(data.mass);
						}else{
							$(ThisEl).attr({"value":data.mass});
						}
						ProgressManage("success",this.idAjax);
						QueueUpdateBoatingHistory.next();
					});
				}
			}
		},200);
	},
	'click':function(ev){
		var nam = $(this).attr("name");
		var type = ev.target.type;
		var val = $(this).val();
		var ThisEl = $(this);
		var id = '';
		if(CheckEl[$(ThisEl).attr("name")] != $(ThisEl).val() && type != "checkbox"){
				$(ThisEl).change(function(event){
					$(ThisEl).unbind();
					event.stopPropagation();
				});
				if(type=="radio"){
					if (val=='yes'){
						id = '#row_'+nam;
						$(id).show();
					}else{
						id = '#row_'+nam;
						$(id).hide();
					}
				}
				val = val.replace(/'+/g,"''");
					QueueUpdateBoatingHistory.add(id_command,id_commandAGT,nam,val,id_expNautic,id_client,function(data){
						CheckEl[$(ThisEl).attr("name")] = data.mass;
						UpdateSuccess(ThisEl,data);
						id_expNautic = data.id_expNautic;
						if(type=='textarea'){
							$(ThisEl).html(data.mass);
						}else{
							$(ThisEl).attr({"value":data.mass});
						}
						ProgressManage("success",this.idAjax);
						QueueUpdateBoatingHistory.next();
					});
		}
	}
},'.boating-history');

$('body').on('click','#mark-skipper input',function(val){
	var nam = $('#mark_skip').attr("name");
	if (nam=='mark_not'){
		var val = '0';
	}else{
		var val = '2';
	}
	var update = UpdateCommand(val,SQL_TYP,id_command);
	update.success(function(data){
		ProgressManage("success",this.idAjax);
		MarkSkipper(data.skipper);
	});
});

$('body').on('click','#chkcs_skipper',function(val){
	if($(this).is(":checked")) {
	   $('#confrm_btn').prop('disabled', false);
	}
	else{
		$('#confrm_btn').prop('disabled', true);
	}
});

$('body').on('click','#confrm_btn',function(val){
	var checkbox=document.getElementById('chkcs_'+contrat.lcase_step_blocks).checked;
	var text_value=document.getElementById('txtcs_'+contrat.lcase_step_blocks).value;
	if(checkbox && text_value!=''){
		var div = contrat.lcase_step_blocks; var fil = contrat.cs_path;
		var cs_nid = 0; var cs_idc = id_command; var cs_etf = contrat.cs_new_etat;
		if($(this).attr("name")=="btn") var cs_act = contrat.cs_act;
		if($(this).attr("name")=="btn_0") var cs_act = contrat.cs_act[0];
		if($(this).attr("name")=="btn_1") var cs_act = contrat.cs_act[1];
		var cs_typ = contrat.lcase_step_blocks; var cs_mor = text_value;
		var id_sagt = contrat.id_sagt; var id_baseop = contrat.id_baseop;
		
		//Send Ajax
		var Update = ContratSign(div,fil,cs_nid,cs_idc,cs_etf,cs_act,cs_typ,cs_mor,id_sagt,id_baseop);
		Update.success(function(data){
			var GetContrat = Contrat_sign();
			GetContrat.success(function(data){
				contrat = data;
				$('#SkipperInfo').empty();
				SkipperInfo();
			})
			ContratSign_modal.hide();
		})
	}
});

$('body').on('click','#exp_pdf',function(val){
	if(window.clickstt){
		var sk = $('#SkipperInfo').find(':input[value!=""]:not(:radio):not(select):not(textarea),:radio:checked,select option[value!=""]:selected,textarea:not(:empty)').length;
		var bh = $('#BoatHistory').find(':input[value!=""]:not(:radio):not(textarea):not(:checkbox):not(select),textarea:not(:empty),:radio:checked,:checkbox:checked,select option[value!=0]:selected').length;
		var co = $('#Co-SkipperInfo').find(':input[value!=""]:not(:radio):not(select):not(textarea):not(:checkbox),:radio:checked,select option[value!=""]:selected,textarea:not(:empty),:checkbox:checked').length;
		var exportpdf = ExportPDF(sk,bh,co);
		exportpdf.success(function(){
			export_modal.hide();
		}).promise();
		exportpdf.promise().done(function(data){
			var Modal = BootstrapModal();
						Modal.main.attr("id","exportModel");
						Modal.header.append('<button type="button" class="close" data-dismiss="modal"><i class="fa fa-times"></i></button>','<i class="fa fa-download"></i> Export PDF file');
						Modal.OnHide(function(){
							//hide
						});
						Modal.OnShown(function(){
							var ItemEl = "";
							var show = "";
							var BtnAddAll;
							if(data.length == 0){
								Modal.body.append('<div class="alert alert-warning" role="alert">'+
																		'<span style="font-size: 25px;font-weight: bold;">'+
																		'<i class="fa fa-meh-o" aria-hidden="true"></i>'+
																		' Oops! Sorry export not complete.'+
																		'</span>'+
																	'</div>').css("width","auto");	
							}else{
								Modal.dialog.css("width","50%");
									var media = $('<div>').addClass('media ExportPDF');
									var content = $('<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">').append($('<div class="text-center"><h3>Your file was export do you want to see it?</h3>'));
									if(data.file!="Fail"){
										var btn = $('<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">').append($('<a href="'+window.atob(data.file)+'" target="_blank" class="btn btn-primary" id="view_file"><i class="fa fa-ok"></i>'+row.lg_viewfile+'</a>'));
									}else{
										var btn = $('<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">').append($(data.file));
									}
											row1 = $('<div>').addClass('row').append(content);
											row2 = $('<div>').addClass('row').append(btn);
									// append
									var mediaBody = $('<div>').addClass('media-body').append(row1,row2);
											ItemEl = mediaBody;
											Modal.body.addClass('alert alert-success').append($(media).append(mediaBody));	
											Modal.footer.addClass('bg-success');
							}
								
							$(Modal.main).on({
								"click":function(){
									$(Modal.main).modal("hide");
								}	
							},'#view_file');
							
						});
						Modal.do();
		});
	}else{
		return false;
	}
});

var export_modal = (function(){
	var Modal = BootstrapModal();
	var openModal = function (){
		$(Modal.main).modal({backdrop: 'static', keyboard: false});
		Modal.dialog.css({"max-width":"30%"});
		Modal.header.html(
			'<i class="fa fa-download"></i> Export PDF file'
		);
		Modal.body.html(
			'<div class="alert alert-info" role="alert" style="'+
    		'width: 100%;'+
    		'display: inline-flex;'+
    		'line-height: 44px;'+
			'">'+
			'<div style="height: 71px;width: 78px;padding: 5px 5px 5px 5px;">'+
			'<i class="fa fa-user fa-5x" aria-hidden="true" style="color: #7799CC;"></i>'+
			'<i class="fa fa-circle-o-notch fa-spin" aria-hidden="true" style="position: absolute;left: 45px;top: 38px;color: #7799C;color: #FFFFFF;"></i>'+
			'</div>'+
			'<span style="'+
    		'line-height: 71px;'+
        '">'+"<b>Please wait!</b>, we are exporting your PDF file."+'</span>'+
        '</div>');
		Modal.do();
	};
	var hideModal = function (){
		$('div',Modal.body).attr("class","alert alert-success");
		$('span',Modal.body).empty().html("<b>Success!</b>, Your PDF file has been export.");
		setTimeout(function(){
			Modal.OnHide(function(){});
			$(Modal.main).modal("hide");	
		}, 300);
		
	};
	return {
		do:openModal,
		hide:hideModal	
	}
}());

function ExportPDF(sk,bh,co){
	if (id_command==""){
		id_command = StatObj.CheckCommandLink.id_command;
	}
	export_modal.do();
	if(droits.catamaran_fleet){
		var Row1 = $('#SkipperInfo').find(':input[value!=""][name=fld_09],[name=fld_13][value!=""],[name=fld_17][value!=""],[name=fld_21][value!=""],[name=fld_25][value!=""],[name=fld_29][value!=""]').length;
		var Row2 = $('#SkipperInfo').find(':input[value!=""][name=fld_10],[name=fld_14][value!=""],[name=fld_18][value!=""],[name=fld_22][value!=""],[name=fld_26][value!=""],[name=fld_30][value!=""]').length;
		var Row3 = $('#SkipperInfo').find(':input[value!=""][name=fld_11],[name=fld_15][value!=""],[name=fld_19][value!=""],[name=fld_23][value!=""],[name=fld_27][value!=""],[name=fld_31][value!=""]').length;
		var Row4 = $('#SkipperInfo').find(':input[value!=""][name=fld_12],[name=fld_16][value!=""],[name=fld_20][value!=""],[name=fld_24][value!=""],[name=fld_28][value!=""],[name=fld_32][value!=""]').length;
		var Row1_co = $('#Co-SkipperInfo').find(':input[value!=""][name=fld_09],[name=fld_13][value!=""],[name=fld_17][value!=""],[name=fld_21][value!=""],[name=fld_25][value!=""],[name=fld_29][value!=""]').length;
		var Row2_co = $('#Co-SkipperInfo').find(':input[value!=""][name=fld_10],[name=fld_14][value!=""],[name=fld_18][value!=""],[name=fld_22][value!=""],[name=fld_26][value!=""],[name=fld_30][value!=""]').length;
		var Row3_co = $('#Co-SkipperInfo').find(':input[value!=""][name=fld_11],[name=fld_15][value!=""],[name=fld_19][value!=""],[name=fld_23][value!=""],[name=fld_27][value!=""],[name=fld_31][value!=""]').length;
		var Row4_co = $('#Co-SkipperInfo').find(':input[value!=""][name=fld_12],[name=fld_16][value!=""],[name=fld_20][value!=""],[name=fld_24][value!=""],[name=fld_28][value!=""],[name=fld_32][value!=""]').length;
	}
	if(typ_command=="ope"){
		var save_path = '../DossierClient/Uploads/'+typ_command+'/'+droits.id_ope_com;
	}else if(typ_command=="agt"){
		var save_path = '../DossierClient/Uploads/'+typ_command+'/'+droits.id_agt_com;
	}else{
		alert("Not Available now.");
	}
	return $.ajax({
		url: "log_exp_detail-API.asp",
		dataType: "json",
		type: "POST",
		data: {
			sk : sk,
			bh : bh,
			co : co,
			Row1 : Row1,
			Row2 : Row2,
			Row3 : Row3,
			Row4 : Row4,
			Row1_co : Row1_co,
			Row2_co : Row2_co,
			Row3_co : Row3_co,
			Row4_co : Row4_co,
			typ_command : typ_command,
			SQL_TYP : droits.SQL_TYP,
			id_command : id_command,
			id_ope_com : droits.id_ope_com,
			id_client : id_client,
			refcom : droits.refcom,
			save_path : window.btoa(unescape(encodeURIComponent(save_path))),
			typ : 'get',
			method : 'export',
		},
	});
}

var ContratSign_modal = (function(){
	var Modal = BootstrapModal();
	var openModal = function (){
		$(Modal.main).modal({backdrop: 'static', keyboard: false});
		Modal.dialog.css({"max-width":"30%"});
		Modal.header.html(
			'<i class="fa fa-download"></i> Addition Skipper'
		);
		Modal.body.html(
			'<div class="alert alert-info" role="alert" style="'+
    		'width: 100%;'+
    		'display: inline-flex;'+
    		'line-height: 44px;'+
			'">'+
			'<div style="height: 71px;width: 78px;padding: 5px 5px 5px 5px;">'+
			'<i class="fa fa-user fa-5x" aria-hidden="true" style="color: #7799CC;"></i>'+
			'<i class="fa fa-circle-o-notch fa-spin" aria-hidden="true" style="position: absolute;left: 45px;top: 38px;color: #7799C;color: #FFFFFF;"></i>'+
			'</div>'+
			'<span style="'+
    		'line-height: 71px;'+
        '">'+"<b>Please wait!</b>, we are adding your contact sign."+'</span>'+
        '</div>');
		Modal.do();
	};
	var hideModal = function (){
		$('div',Modal.body).attr("class","alert alert-success");
		$('span',Modal.body).empty().html("<b>Success!</b>, Your Contact sign has been complete.");
		setTimeout(function(){
			Modal.OnHide(function(){});
			$(Modal.main).modal("hide");	
		}, 1500);
		
	};
	return {
		do:openModal,
		hide:hideModal	
	}
}());

function ContratSign(div,fil,cs_nid,cs_idc,cs_etf,cs_act,cs_typ,cs_mor,id_sagt,id_baseop){
	ContratSign_modal.do();
		return $.ajax({
		url: "log_exp_detail-API.asp",
		dataType: "json",
		type: "POST",
		data: {
			id_ope_com : id_ope_com,
			cs_nid : cs_nid,
			cs_idc : cs_idc,
			cs_etf : cs_etf,
			cs_act : cs_act,
			cs_typ : cs_typ,
			cs_mor : cs_mor,
			id_sagt : id_sagt,
			id_baseop : id_baseop,
			typ : 'update_contrat'
		},
		idAjax:Math.floor((Math.random() * 1000000) + 1),
		beforeSend:function(jqXHR){
			AjaxSkipper.push({"this":this,"JqXHR":jqXHR});
			ProgressManage("info");
		},
		}).done(function(data){
			$.each( data, function( key, value ) {
			});
		});
	
}

function UpdateSuccess(ThisEl,data){
	CheckEl[$(ThisEl).attr("name")] = data.mass;//Update Change
}

function ResultTemplate(massage,typ){
	var ElMassager;
	if(typ == "success"){
		ElMassager = $('<div class="alert alert-success" role="alert">');	
	}else if(typ == "info"){
		ElMassager = $('<div class="alert alert-info" role="alert">');	
	}else if(typ == "warning"){
		ElMassager = $('<div class="alert alert-warning" role="alert">');	
	}else if(typ == "danger"){
		ElMassager = $('<div class="alert alert-danger" role="alert">');	
	}
	return $(ElMassager).append(massage);
}

function call_query(typ_com,sql_typ,id_com,id_ope,id_cli,ss_ope,af_acc,refcom){
	var typ_command = typ_com;
	var SQL_TYP = sql_typ;
	var id_command = id_com;
	var id_ope_com = id_ope;
	var id_client = id_cli;
	var ss_id_ope = ss_ope;
	var affich_access = af_acc;
	return $.ajax({
		url: "log_exp_detail-API.asp",
		dataType: "json",
		type: "POST",
		data: {
			typ_command : typ_command,
			SQL_TYP : SQL_TYP,
			id_command : id_command,
			id_ope_com : id_ope_com,
			id_client : id_client,
			ss_id_ope : ss_id_ope,
			ss_id_agt : droits.ss_id_agt,
			ss_id_log : droits.ss_id_log,
			ss_id_cli : ss_id_cli,
			ss_auto : droits.ss_auto,
			ss_styl : droits.ss_styl,
			affich_access : affich_access,
			refcom : refcom,
			typ : 'get',
		},
		async: false
	}).done(function(data){
			$.each( data, function( key, value ) {
			});
			row = data;
			CheckEl = data;
	});
}

function GetCoSkipper(coskip){
	return $.ajax({
		url: "log_exp_detail-API.asp",
		dataType: "json",
		type: "POST",
		data: {
			id_command : id_command,
			id_ope_com : id_ope_com,
			coskip : coskip,
			typ : 'get_co'
		}
	}).done(function(data){
			$.each( data, function( key, value ) {
			});
			catama = data;
	});
}

function UpdateCommand(val,sql_typ,id_command){
	return $.ajax({
		url: "log_exp_detail-API.asp",
		dataType: "json",
		type: "POST",
		data: {
			sql_typ : sql_typ,
			value : val,
			id_command : id_command,
			typ : 'update_command'
		},
		idAjax:Math.floor((Math.random() * 1000000) + 1),
		beforeSend:function(jqXHR){
			AjaxSkipper.push({"this":this,"JqXHR":jqXHR});
			ProgressManage("info");
		},
	}).done(function(data){
	});
}

function UpdateSkipper(id_command,id_commandAGT,nam,val,id_exp,id_client){
	if( id_exp == ""){
		StatOfAjax = "Stop";
		WaitForApi("wait","<b>Please wait...</b> We are adding the new Skipper.");
		$.each(AjaxQueue,function(key,value){
			AjaxQueue[key].JqXHR.abort();
		});
	}
	return $.ajax({
		url : 'log_exp_detail-API.asp',
		dataType : 'json',
		type : 'POST',
		data : {
			typ_command : droits.typ_command,
			id_commandAGT : id_commandAGT,
			SQL_TYP : droits.SQL_TYP,
			id_command : droits.id_command,
			nam : nam,
			val : window.btoa(unescape(encodeURIComponent(val))),
			id_expNautic : id_exp,
			id_client : id_client,
			id_ope_com: id_ope_com,
			coskip: row.coskip,
			typ : 'update'
 		},
		idAjax:Math.floor((Math.random() * 1000000) + 1),
		beforeSend:function(jqXHR){
			AjaxSkipper.push({"this":this,"JqXHR":jqXHR});
			ProgressManage("info");
		},
	}).done(function(){
		WaitForApi("success","<b> well done!</b> The Skipper has been added.");		
	}).fail(function(data){
		$('#Message').html(StatusProgress("fail",'<i class="fa fa-check-circle"></i> <b>Fail!</b> Your changes are not update.'));	
	})
	
}

function UpdateBoatingHistory(id_command,id_commandAGT,nam,val,id_exp,id_client){
	if( id_exp == ""){
		StatOfAjax = "Stop";
		WaitForApi("wait","<b>Please wait...</b> We are adding the new Boating History.");
		$.each(AjaxQueue,function(key,value){
			AjaxQueue[key].JqXHR.abort();
		});
	}
	return $.ajax({
		url : 'log_exp_detail-API.asp',
		dataType : 'json',
		type : 'POST',
		data : {
			typ_command : droits.typ_command,
			id_commandAGT : id_commandAGT,
			SQL_TYP : droits.SQL_TYP,
			id_command : droits.id_command,
			nam : nam,
			val : window.btoa(unescape(encodeURIComponent(val))),
			id_expNautic : id_exp,
			id_client : id_client,
			typ : 'update'
		},
		idAjax:Math.floor((Math.random() * 1000000) + 1),
		beforeSend:function(jqXHR){
			AjaxSkipper.push({"this":this,"JqXHR":jqXHR});
			ProgressManage("info");
		},
	}).done(function(){
		WaitForApi("success","<b> well done!</b> The Boating History has been added.");
	}).fail(function(data){
		$('#Message').html(StatusProgress("fail",'<i class="fa fa-check-circle"></i> <b>Fail!</b> Your changes are not update.'));	
	})
}

function UpdateCoSkipper(id_command,id_commandAGT,nam,val,id_exp,id_client){
	if( id_exp == ""){
		StatOfAjax = "Stop";
		WaitForApi("wait","<b>Please wait...</b> We are adding the new Co-Skipper.");
		$.each(AjaxQueue,function(key,value){
			AjaxQueue[key].JqXHR.abort();
		});
	}
	return $.ajax({
		url : 'log_exp_detail-API.asp',
		dataType : 'json',
		type : 'POST',
		data : {
			typ_command : droits.typ_command,
			id_commandAGT : id_commandAGT,
			SQL_TYP : droits.SQL_TYP,
			id_command : droits.id_command,
 			nam : nam,
 			val : window.btoa(unescape(encodeURIComponent(val))),
 			id_expNautic : id_exp,
 			id_ope_com : id_ope_com,
 			id_client : id_client,
 			coskip : '1',
 			typ : 'update'
 		},
		idAjax:Math.floor((Math.random() * 1000000) + 1),
		beforeSend:function(jqXHR){
			AjaxSkipper.push({"this":this,"JqXHR":jqXHR});
			ProgressManage("info");
		},
	}).done(function(){
		WaitForApi("success","<b> well done!</b> The Co-Skipper has been added.");		
	}).fail(function(data){
		$('#Message').html(StatusProgress("fail",'<i class="fa fa-check-circle"></i> <b>Fail!</b> Your changes are not update.'));	
	})
}

function ProgressManage(typ,idAjax){
	$.each(AjaxSkipper,function(index,ObjXHR){
		if(typeof ObjXHR != "undefined"){
			if(ObjXHR.this.idAjax == idAjax){
				if(AjaxSkipper.length != 1){
					AjaxSkipper.splice(index, 1);//Delete Ajax that Done	
				}else if(AjaxSkipper.length == 1){
					AjaxSkipper = [];
				}
			}
		}
	});
	if(typ == "success" && AjaxSkipper.length == 0 ){
		AjaxQueueProgress();
	}else{
		$('#Message .alert-info span.Inqueue').html(AjaxSkipper.length);
		AjaxQueueProgress();
	}
}

function StatusProgress(typ,massage){
	var ElMassager;
	if(typ == "success"){
		ElMassager = $('<div class="alert alert-success" role="alert">');	
	}else if(typ == "info"){
		ElMassager = $('<div class="alert alert-info" role="alert">');	
	}else if(typ == "warning"){
		ElMassager = $('<div class="alert alert-warning" role="alert">');	
	}else if(typ == "danger"){
		ElMassager = $('<div class="alert alert-danger" role="alert">');	
	}
	return $(ElMassager).append(massage);
}

function ImportSkipper(){
	var ImportSK = CallImportSK();
			ImportSK.success().promise().done(function(data){
				var Modal = BootstrapModal();
						Modal.main.attr("id","importModel");
						Modal.header.append('<button type="button" class="close" data-dismiss="modal"><i class="fa fa-times"></i></button>','<i class="fa fa-download"></i> '+row.lg_skipperbtn_import);
						Modal.footer.html('<button type="button" data-dismiss="modal" class="btn btn-primary" style="margin-bottom: 0px;"><i class="fa fa-times"></i> '+row.lg_close+'</button>');
						Modal.OnHide(function(){
							//hide
						});
						Modal.OnShown(function(){
							var BoatCoskip = "";
							var BoatModel = "";
							var BoatModelDate = "";
							var ItemEl = "";
							var skipper = "";
							var GroupSkipper = [];
							var BtnAddAll;
						if(data.length == 0){
							Modal.body.append('<div class="alert alert-warning" role="alert">'+
																	'<span style="font-size: 25px;font-weight: bold;">'+
																	'<i class="fa fa-meh-o" aria-hidden="true"></i>'+
																	' Oops! No any Skipper from last booking.'+
																	'</span>'+
																'</div>').css("width","auto");	
						}else{
							Modal.dialog.css("width","90%");
							$.each(data,function(key,value){
								if(value.boat_model != BoatModel && value.date_start != BoatModelDate){
									BoatModel = value.boat_model;
									BoatModelDate = value.date_end;
									GroupSkipper = [];
									GroupSkipper.push(value);
									BtnAddAll = $('<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">').append($('<button type="button" class="btn btn-primary pull-right" id="addallsk"><i class="fa fa-users"></i> '+row.lg_addall+' ( <span class="AmountSkipper"></span> )</button>').data('info',GroupSkipper));

									$(BtnAddAll).find('.AmountSkipper').html($(BtnAddAll).find('button').data('info').length);//Amount of Skipper
									var Boat = $('<div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">').append('<i class="fa fa-ship"></i> '+value.boat_model);
									var Date = $('<div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">').append('<i class="fa fa-calendar"></i> '+value.date_start+' To '+value.date_end);
									var head = $('<div class="row">').append(Boat,Date,BtnAddAll);
									var media = $('<div>').addClass('media Importpass');
								// Skipper
									var listnameskipper = $('<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">')
																			.append($('<div class="input-group"><span class="input-group-addon">'+row.lg_OptionSkipper+'</span><span type="text" class="form-control">'+value.firstname_skipper+" "+value.lastname_skipper+'</span>')
																			.append($('<span class="btn btn-primary input-group-addon" id="import-sk"><i class="fa fa-plus"></i> </span>').data('info',value)));
									
											skipper = $('<div>').addClass('row').append(listnameskipper);
								// Boatinghistory
									var listnameboating = $('<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">')
																			.append($('<div class="input-group"><span class="input-group-addon">'+row.lg_cvskipper_01+'</span><span type="text" class="form-control"></span>')
																			.append($('<span class="btn btn-primary input-group-addon" id="import-bh"><i class="fa fa-plus"></i> </span>').data('info',value)));
									
											boatinghistory = $('<div>').addClass('row').css({"margin-top":"10px"}).append(listnameboating);
								// Co-Skipper
									var listnamecoskip = $('<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">')
																			.append($('<div class="input-group"><span class="input-group-addon">'+row.CoSkipper+'</span><span type="text" class="form-control">'+value.firstname_coskipper+" "+value.lastname_coskipper+'</span>')
																			.append($('<span class="btn btn-primary input-group-addon" id="import-co"><i class="fa fa-plus"></i> </span>').data('info',value)));
									
											coskipper = $('<div>').addClass('row').css({"margin-top":"10px"}).append(listnamecoskip);
								// append
									var mediaBody = $('<div>').addClass('media-body').append(head,skipper,boatinghistory,coskipper);
											ItemEl = mediaBody;
											Modal.body.append($(media).append(mediaBody));
								}
							});
						}
							
							$(Modal.main).on({
								"click":function(){
									UpdateImport("0",id_command,$(this).data('info').id_command,$(this).data('info').id_expNautic,$(this).data('info').typ);
								}	
							},'#import-sk');
							
							$(Modal.main).on({
								"click":function(){
									UpdateImport("1",id_command,$(this).data('info').id_command,$(this).data('info').id_expNautic,$(this).data('info').typ);
								}	
							},'#import-co');
							
							$(Modal.main).on({
								"click":function(){
									UpdateImport("2",id_command,$(this).data('info').id_command,$(this).data('info').id_expNautic,$(this).data('info').typ);
								}	
							},'#import-bh');
							
							$(Modal.main).on({
								"click":function(){
									UpdateImport("3",id_command,$(this).data('info')[0].id_command,$(this).data('info')[0].id_expNautic,$(this).data('info')[0].typ);
								}
							},'#addallsk');
							
						});
						Modal.do();
			});
}

function ImportSkipper_196(coskip){
	var ImportSK = CallImportSK_196(coskip);
			ImportSK.success().promise().done(function(data){
				var Modal = BootstrapModal();
						Modal.main.attr("id","importModel");
						Modal.header.append('<button type="button" class="close" data-dismiss="modal"><i class="fa fa-times"></i></button>','<i class="fa fa-download"></i> '+row.lg_skipperbtn_import);
						Modal.footer.html('<button type="button" data-dismiss="modal" class="btn btn-primary" style="margin-bottom: 0px;"><i class="fa fa-times"></i> '+row.lg_close+'</button>');
						Modal.OnHide(function(){
							//hide
						});
						Modal.OnShown(function(){
							var BoatCoskip = "";
							var BoatModel = "";
							var BoatModelDate = "";
							var ItemEl = "";
							var skipper = "";
							var GroupSkipper = [];
							var BtnAddAll;
						if(data.length == 0){
							Modal.body.append('<div class="alert alert-warning" role="alert">'+
																	'<span style="font-size: 25px;font-weight: bold;">'+
																	'<i class="fa fa-meh-o" aria-hidden="true"></i>'+
																	' Oops! No any Skipper from last booking.'+
																	'</span>'+
																'</div>').css("width","auto");	
						}else{
							Modal.dialog.css("width","90%");
							$.each(data,function(key,value){
										BoatModel = value.boat_model;
										BoatModelDate = value.date_end;
										GroupSkipper = [];
										GroupSkipper.push(value);
										
										var Boat = $('<div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">').append('<i class="fa fa-ship"></i> '+value.boat_model);
										var Date = $('<div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">').append('<i class="fa fa-calendar"></i> '+value.date_start+' To '+value.date_end+'<br><br>');
										var head = $('<div class="row">').append(Boat,Date);
										var media = $('<div>').addClass('media Importpass');
									// Skipper
										var listnameskipper = $('<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">')
																				.append($('<div class="input-group"><span class="input-group-addon">Name</span><span type="text" class="form-control">'+value.name+'</span>')
																				.append($('<span class="btn btn-primary input-group-addon" id="import-sk"><i class="fa fa-plus"></i> </span>').data('info',value)));
										
												skipper = $('<div>').addClass('row').append(listnameskipper);
									// append
										var mediaBody = $('<div>').addClass('media-body').append(head,skipper);
												ItemEl = mediaBody;
												Modal.body.append($(media).append(mediaBody));	
							});
						}
							
							$(Modal.main).on({
								"click":function(){
									UpdateImport_196($(this).data('info').co_skip,id_command,$(this).data('info').id_command,$(this).data('info').id_expNautic);
								}	
							},'#import-sk');
							
							$(Modal.main).on({
								"click":function(){
									UpdateImport_196($(this).data('info').co_skip,id_command,$(this).data('info').id_command,$(this).data('info').id_expNautic);
								}	
							},'#import-co');
							
						});
						Modal.do();
			});
}

function CallImportSK(){
	return $.ajax({
		url : 'log_exp_detail-API.asp',
		type: 'POST',
		data:{"id_client":droits.id_client, "typ":"importSK"},
		dataType:'json'
	});
}

function CallImportSK_196(coskip){
	return $.ajax({
		url : 'log_exp_detail-API.asp',
		type: 'POST',
		data:{"id_client":id_client, "coskip":coskip, "typ":"importSK_196"},
		dataType:'json'
	});
}

function UpdateImport_196(coskip,id_command,id_command_import,id_expNautic_import){
	if(coskip==0){
		var id_exp196 = id_expNautic;
	}else{
		var id_exp196 = id_exp_co;
	}
		UpdateSkipper_modal.do();
	return $.ajax({
		url: 'log_exp_detail-API.asp',
		type: 'POST',
		data: {
			"coskip":coskip, "id_command":id_command, "id_command_import":id_command_import,"id_expNautic_import":id_expNautic_import,
			"id_expNautic":id_exp196, "id_client":id_client, "typ":"update196",
		},
		Async: 'false',
		dataType:'json',
		success:function(data){
			if (data.coskip == '0') {
			  id_expNautic = data.id_expNautic;
			}else if(data.coskip == '1'){
				id_exp_co = data.id_exp_co;
			}
			var Query = call_query(droits.typ_command,droits.SQL_TYP,droits.id_command,droits.id_ope_com,droits.id_client,droits.ss_id_ope,droits.affich_access);
			Query.success(function(data){
				$('#SkipperInfo').empty();
				row = data;
				SkipperInfo();
				if(droits.affich_coskipper){
					var GetCo = GetCoSkipper('1');
					GetCo.success(function(data){
						id_exp_co = data.id_expNautic;
						$('#Co-SkipperInfo').empty();
						CoSkipperInfo();
					});
				}else{
					$('#Co_SkipperInfoProg').parent().parent().hide()
					$('#CO').hide();
					$('#myTab li a[href="#CO"]').hide();
				}
				UpdateSkipper_modal.hide();
			});
		},
		error:function(){
		}
	});
}

var UpdateSkipper_modal = (function(){
	var Modal = BootstrapModal();
	var openModal = function (){
		$(Modal.main).modal({backdrop: 'static', keyboard: false});
		Modal.dialog.css({"max-width":"30%"});
		Modal.header.html(
			'<i class="fa fa-download"></i> Addition Skipper'
		);
		Modal.body.html(
			'<div class="alert alert-info" role="alert" style="'+
    		'width: 100%;'+
    		'display: inline-flex;'+
    		'line-height: 44px;'+
			'">'+
			'<div style="height: 71px;width: 78px;padding: 5px 5px 5px 5px;">'+
			'<i class="fa fa-user fa-5x" aria-hidden="true" style="color: #7799CC;"></i>'+
			'<i class="fa fa-circle-o-notch fa-spin" aria-hidden="true" style="position: absolute;left: 45px;top: 38px;color: #7799C;color: #FFFFFF;"></i>'+
			'</div>'+
			'<span style="'+
    		'line-height: 71px;'+
        '">'+"<b>Please wait!</b>, we are importing the information."+'</span>'+
        '</div>');
		Modal.do();
	};
	var hideModal = function (){
		$('div',Modal.body).attr("class","alert alert-success");
		$('span',Modal.body).empty().html("<b>Success!</b>, The information has been imported.");
		setTimeout(function(){
			Modal.OnHide(function(){});
			$(Modal.main).modal("hide");	
		}, 1500);
	};
	return {
		do:openModal,
		hide:hideModal	
	}
}());

function UpdateImport(typ_command,id_command,id_command_import,id_expNautic_import,typ_table){
	UpdateSkipper_modal.do();
	return $.ajax({
		url: 'log_exp_detail-API.asp',
		type: 'POST',
		data: {
			"typ_command":typ_command, "id_command":id_command, "id_command_import":id_command_import,"id_expNautic_import":id_expNautic_import,
			 "typ_table":typ_table, "id_expNautic":id_expNautic, "id_client":id_client, "typ":"updateRow",
		},
		Async: 'false',
		dataType:'json',
		success:function(data){
			var typ_import = data.typ_command;
			id_expNautic = data.id_expNautic;
			var call_skipper = call_query(droits.typ_command,droits.SQL_TYP,droits.id_command,droits.id_ope_com,droits.id_client,droits.ss_id_ope,droits.affich_access);
			call_skipper.success(function(data){
				if(typ_import=="0"){
					$('#SkipperInfo').empty();
					SkipperInfo(jQuery.parseJSON(State),jQuery.parseJSON(Country),Salutation_skipper_01,Salutation_skipper_02);
				}else if(typ_import=="1"){
					$('#Co-SkipperInfo').empty();
					CoSkipperInfo(jQuery.parseJSON(State),jQuery.parseJSON(Country),Salutation_equipier_01,Salutation_equipier_02);
				}else if(typ_import=="2"){
					$('#BoatHistory').empty();
					BoatingHistory(Boating_history_01,Boating_history_02,Boating_history_03,Boating_history_04,Boating_history_05,Boating_history_06,Boating_history_07);
				}else if(typ_import=="3"){
					$('#SkipperInfo').empty();
					SkipperInfo(jQuery.parseJSON(State),jQuery.parseJSON(Country),Salutation_skipper_01,Salutation_skipper_02);
					$('#Co-SkipperInfo').empty();
					CoSkipperInfo(jQuery.parseJSON(State),jQuery.parseJSON(Country),Salutation_equipier_01,Salutation_equipier_02);
					$('#BoatHistory').empty();
					BoatingHistory(Boating_history_01,Boating_history_02,Boating_history_03,Boating_history_04,Boating_history_05,Boating_history_06,Boating_history_07);
				}
				UpdateSkipper_modal.hide();
			})
		},
		error:function(){
		}
	});
}

function Contrat_sign(){
	return $.ajax({
		url : 'log_exp_detail-API.asp',
		type: 'POST',
		data:{"id_command":id_command, "id_ope_com":id_ope_com, "typ_command":typ_command, "typ":"contrat"},
		dataType:'json'
	});
}

function SkipperInfo(state,country,con1,con2){
	
	var disable = row.disabled
	var InputRadio = $('<input>').attr({type:"radio"}).addClass("skipper");
	var InputText = $('<input>').attr({type:"text"}).addClass('form-control boxtext skipper');
	var InputTextarea = $('<textarea>').attr({"rows":"5"}).addClass('form-control skipper').css({"resize":"none"});
	var Row = $('<div>').addClass('row').css({"margin-bottom":"10px"});
	var col2 = $('<div>').addClass('col-lg-2 col-md-2 col-sm-6 col-xs-6');
	var col3 = $('<div>').addClass('col-lg-3 col-md-3 col-sm-6 col-xs-6');
	var col4 = $('<div>').addClass('col-lg-4 col-md-4 col-sm-6 col-xs-6');
	var col6 = $('<div>').addClass('col-lg-6 col-md-6 col-sm-6 col-xs-6');
	var col12 = $('<div>').addClass('col-lg-12 col-md-12 col-sm-12 col-xs-12');	
	var InputG = $('<div>').addClass('input-group');
	var span = $('<span>').addClass('input-group-addon');
	var span2 = $('<span>').addClass('input-group-addon2');
	
	if(droits.catamaran_fleet){
		//txt_01
		var txt_01 = "We will require suitable prior SKIPPERING experience on a COMPARABLY SIZE VESSEL (e.g same size or bigger vessel as the one you wish to charter) and for a COMPARABLE  journey <br>(ex: more than a couple continuous days/nights skippering experience); skippering experience on a smaller vessel or crewing experience on comparable vessel WILL NOT QUALIFY YOU. Boat Certification or License will not automatically qualify you. This is especially true of our largest cats like the Lagoon 500's. and 52's for which you will be required STRONG experience.";
		var FirstRow = $(Row).clone().append($(col12).clone().append($('<label>').attr({"id":"txt_01"}).append(txt_01)));
		// leader_name & skipper_name
		var leader_txt = $(span).clone().append("Party Leader's name");
		var leader_el = $(InputText).clone().attr({"name":"fld_01","value":row.Name});
									 
		var skipper_txt = $(span).clone().append('Skipper name');
		var skipper_el = $(InputText).clone().attr({"name":"fld_02","value":row.SkName});
									
		var SecondRow = $(Row).clone().append(
										 	$(col6).clone().append(
											 	$(InputG).clone().attr({"id":"leader_name"}).append(leader_txt,leader_el)
											),
										 	$(col6).clone().append(
											 	$(InputG).clone().attr({"id":"skipper_name"}).append(skipper_txt,skipper_el)
											)
									 );
		// Date
		if(ss_auto=='2'){
			var date_txt = $(span).clone().append("Date");
		}else{
			var date_txt = $(span).clone().append("");
		}
		if(row.DDate==""){ DDate = today } else{ DDate = row.DDate }
//		var date_el = $(InputText).clone().attr({"name":"fld_03","value":''+DDate+'',"readonly":"readonly"});
		var date_el = $(InputText).clone().attr({"name":"fld_03","value":'',"readonly":"readonly"});
		var ThirdRow = $(Row).clone().append(
										 	$(col6).clone().append(
											 	$(InputG).clone().attr({"id":"date"}).append(date_txt,date_el)
											)
									 );	 
		//txt_02
		var txt_02 = "It is very important that we receive this information from all charterers.";
		var FourthRow = $(Row).clone().append($(col12).clone().addClass("text-center").append($('<label>').attr({"id":"txt_02"}).append(txt_02)));
		// As_skipper
		var AsSkipper_txt = $(span).clone().append("1. Have you ever chartered with us before as SKIPPER?");
		var AsSkipper_el = $(InputText).clone().attr({"name":"fld_04","value":row.Q1a});
		var FifthRow = $(Row).clone().append(
										 	$(col6).clone().append(
											 	$(InputG).clone().attr({"id":"As_skipper"}).append(AsSkipper_txt,AsSkipper_el)
											)
									 );
		// boat_type
		var boat_type_txt = $(span).clone().append("Boat Type/Feet");
		var boat_type_el = $(InputText).clone().attr({"name":"fld_05","value":row.Q1b});
		// Location
		var Location_txt = $(span).clone().append("Location");
		var Location_el = $(InputText).clone().attr({"name":"fld_06","value":row.Q1c});
		//Date_2
		var date_2_txt = $(span).clone().append("Date");
		var date_2_el = $(InputText).clone().attr({"name":"fld_07","value":row.Q1d});
		
		var SixRow = $(Row).clone().append(
										 	$(col4).clone().append(
											 	$(InputG).clone().attr({"id":"boat_type"}).append(boat_type_txt,boat_type_el)
											),
											$(col4).clone().append(
											 	$(InputG).clone().attr({"id":"location"}).append(Location_txt,Location_el)
											),
											$(col4).clone().append(
											 	$(InputG).clone().attr({"id":"date_2"}).append(date_2_txt,date_2_el)
											)
									 );
		//txt_03
		var txt_03 = "2. If your answer to question 1 was yes" +
								 "<span style=\"color:red;\">AND less than 3 years AND on boat same size or bigger</span>, skip steps 3 through 14, submit "+
								 "this form and proceed to the next form, PAYMENT TERMS AND CONDITIONS, otherwise please complete the resume below.";
		var SevenRow = $(Row).clone().append($(col12).clone().append($('<label>').attr({"id":"txt_03"}).append(txt_03)));
		// chartered
		var chartered_txt = $(span).clone().append("3. Have you ever chartered before?");
		var chartered_el = $(InputText).clone().attr({"name":"fld_08","value":row.Q3});
		var EightRow = $(Row).clone().append(
										 	$(col6).clone().append(
											 	$(InputG).clone().attr({"id":"chartered"}).append(chartered_txt,chartered_el)
											),
											$(col6).clone().append(
											 	$('<div>').append("If yes, please fill out the table below.")
											)
									 );
		var chartered_btm_txt = "<span style=\"color:red;font-weight:bold;\">We require to see all SKIPPERING experience on COMPARABLY SIZED SAILING VESSELS "+
														"(e.g. same length OR bigger vessel) TO THE VESSEL YOU WISH TO CHARTER with details<br> (type of journey, length etc). Skippering a smaller vessel "+
														"or sailing/crewing on a comparable or bigger vessel will NOT qualify you."+
														"Resumes will not be approved without suitable experience being listed.</span>"+
														"If the charter was a bareboat charter, indicate whether you were captain or crew.";
		var NineRow = $(Row).clone().append($(col12).clone().append(chartered_btm_txt));
		// Yacht_type 
		var yacht_type_txt = $(span2).clone().append('YACHT BRAND & TYPE');
		var yacht_type_el1 = $(InputText).clone().attr({"name":"fld_09","value":row.Q3a1});
		var yacht_type_el2 = $(InputText).clone().attr({"name":"fld_10","value":row.Q3a2});
		var yacht_type_el3 = $(InputText).clone().attr({"name":"fld_11","value":row.Q3a3});
		var yacht_type_el4 = $(InputText).clone().attr({"name":"fld_12","value":row.Q3a4});
		// Where
		var where_txt = $(span2).clone().append('WHERE');
		var where_el1 = $(InputText).clone().attr({"name":"fld_13","value":row.Q3b1});
		var where_el2 = $(InputText).clone().attr({"name":"fld_14","value":row.Q3b2});
		var where_el3 = $(InputText).clone().attr({"name":"fld_15","value":row.Q3b3});
		var where_el4 = $(InputText).clone().attr({"name":"fld_16","value":row.Q3b4});
		// Charter_company
		var company_txt = $(span2).clone().append('CHARTER COMPANY');
		var company_el1 = $(InputText).clone().attr({"name":"fld_17","value":row.Q3c1});
		var company_el2 = $(InputText).clone().attr({"name":"fld_18","value":row.Q3c2});
		var company_el3 = $(InputText).clone().attr({"name":"fld_19","value":row.Q3c3});
		var company_el4 = $(InputText).clone().attr({"name":"fld_20","value":row.Q3c4});
		// Yacht_length
		var length_txt = $(span2).clone().append('YACHT LENGTH');
		var length_el1 = $(InputText).clone().attr({"name":"fld_21","value":row.Q3d1});
		var length_el2 = $(InputText).clone().attr({"name":"fld_22","value":row.Q3d2});
		var length_el3 = $(InputText).clone().attr({"name":"fld_23","value":row.Q3d3});
		var length_el4 = $(InputText).clone().attr({"name":"fld_24","value":row.Q3d4});
		// Skipper_Crew
		var crew_txt = $(span2).clone().append('SKIPPER/CREW');
		var crew_el1 = $(InputText).clone().attr({"name":"fld_25","value":row.Q3e1});
		var crew_el2 = $(InputText).clone().attr({"name":"fld_26","value":row.Q3e2});
		var crew_el3 = $(InputText).clone().attr({"name":"fld_27","value":row.Q3e3});
		var crew_el4 = $(InputText).clone().attr({"name":"fld_28","value":row.Q3e4});
		// Month_Year
		var year_txt = $(span2).clone().append('MONTH/YEAR');
		var year_el1 = $(InputText).clone().attr({"name":"fld_29","value":row.Q3f1});
		var year_el2 = $(InputText).clone().attr({"name":"fld_30","value":row.Q3f2});
		var year_el3 = $(InputText).clone().attr({"name":"fld_31","value":row.Q3f3});
		var year_el4 = $(InputText).clone().attr({"name":"fld_32","value":row.Q3f4});
		
		var TenRow =  $(Row).clone().append(
										$(col2).clone().css("margin-bottom","10px").attr({"id":"Yacht_type"}).append(yacht_type_txt,yacht_type_el1,yacht_type_el2,yacht_type_el3,yacht_type_el4),
								 		$(col2).clone().css("margin-bottom","10px").attr({"id":"Where"}).append(where_txt,where_el1,where_el2,where_el3,where_el4),
								 		$(col2).clone().css("margin-bottom","10px").attr({"id":"Charter_company"}).append(company_txt,company_el1,company_el2,company_el3,company_el4),
								 		$(col2).clone().css("margin-bottom","10px").attr({"id":"Yacht_length"}).append(length_txt,length_el1,length_el2,length_el3,length_el4),
								 		$(col2).clone().css("margin-bottom","10px").attr({"id":"Skipper_Crew"}).append(crew_txt,crew_el1,crew_el2,crew_el3,crew_el4),
								 		$(col2).clone().css("margin-bottom","10px").attr({"id":"Month_Year"}).append(year_txt,year_el1,year_el2,year_el3,year_el4)
									);
		//txt_04
		var txt_04 = "4. List any yachts that you have owned (type, length, displacement, years owned).";
		var ElevenRow = $(Row).clone().append($(col12).clone().append($('<div>').attr({"id":"txt_04"}).append(txt_04)));
		// yacht_model
		var YachtModel_txt = $(span).clone().append("Yacht Type/Model ");
		var YachtModel_el = $(InputText).clone().attr({"name":"fld_33","value":row.Q4a});
		// LOA
		var LOA_txt = $(span).clone().append("LOA");
		var LOA_el = $(InputText).clone().attr({"name":"fld_34","value":row.Q4b});
		// Displacement
		var displace_txt = $(span).clone().append("Displacement");
		var displace_el = $(InputText).clone().attr({"name":"fld_35","value":row.Q4c});
		// Years_Owned
		var YearOwn_txt = $(span).clone().append("Years Owned");
		var YearOwn_el = $(InputText).clone().attr({"name":"fld_36","value":row.Q4d});
		
		var TwelveRow = $(Row).clone().append(
									 	$(col3).clone().append(
										 	$(InputG).clone().attr({"id":"Yacht_Model"}).append(YachtModel_txt,YachtModel_el)
										),
										$(col3).clone().append(
										 	$(InputG).clone().attr({"id":"LOA"}).append(LOA_txt,LOA_el)
										),
										$(col3).clone().append(
										 	$(InputG).clone().attr({"id":"Displacement"}).append(displace_txt,displace_el)
										),
										$(col3).clone().append(
										 	$(InputG).clone().attr({"id":"Years_Owned"}).append(YearOwn_txt,YearOwn_el)
										)
								 );
		// multihull
		var multihull_txt = $(span).clone().append("5. Have you ever skippered a multihull? If yes, what type/size?");
		var multihull_el = $(InputText).clone().attr({"name":"fld_37","value":row.Q5a});
		var ThirteenRow = $(Row).clone().append(
										 	$(col12).clone().append(
											 	$(InputG).clone().attr({"id":"multihull"}).append(multihull_txt,multihull_el)
											)
									 );
		// monohull
		var monohull_txt = $(span).clone().append("If no, have you ever skippered a monohull? If yes, what size/type?");
		var monohull_el = $(InputText).clone().attr({"name":"fld_38","value":row.Q5b});
		var FourteenRow = $(Row).clone().append(
										 	$(col12).clone().append(
											 	$(InputG).clone().attr({"id":"monohull"}).append(monohull_txt,monohull_el)
											)
									 );
		// txt_06
		var txt_06 = $(span).clone().append("6. How many times have you anchored a yacht larger than 30 Ft. in length?");
		var fld_39 = $(InputText).clone().attr({"name":"fld_39","value":row.Q6});
		var FifthteenRow = $(Row).clone().append(
										 	$(col12).clone().append(
											 	$(InputG).clone().attr({"id":"txt_06"}).append(txt_06,fld_39)
											)
									 );
		// txt_07
		var txt_07 = $(span).clone().append("7. How many days do you sail per year?");
		var fld_40 = $(InputText).clone().attr({"name":"fld_40","value":row.Q7a});
		
		var txt_07_2 = $(span).clone().append("In the last 2 years?");
		var fld_41 = $(InputText).clone().attr({"name":"fld_41","value":row.Q7b});
		
		var txt_07_3 = $(span).clone().append("How many years have you been sailing?");
		var fld_42 = $(InputText).clone().attr({"name":"fld_42","value":row.Q7c});
		var SixteenRow = $(Row).clone().append(
										 	$(col4).clone().attr({"id":"txt_07"}).append(
											 	$(InputG).clone().append(txt_07,fld_40)
											),
											$(col4).clone().append(
											 	$(InputG).clone().append(txt_07_2,fld_41)
											),
											$(col4).clone().append(
											 	$(InputG).clone().append(txt_07_3,fld_42)
											)
									 );
		// txt_08
		var txt_08 = $(span).clone().append("8. Where do you do most of your sailing?");
		var fld_43 = $(InputText).clone().attr({"name":"fld_43","value":row.Q8});
		var SeventeenRow = $(Row).clone().append(
										 	$(col12).clone().append(
											 	$(InputG).clone().attr({"id":"txt_08"}).append(txt_08,fld_43)
											)
									 );
		//txt_09
		var txt_09 = "9. Have you ever sailed in the Caribbean Islands? If yes, which island(s)?";
		var EightteenRow = $(Row).clone().append($(col12).clone().append($('<div>').attr({"id":"txt_09"}).append(txt_09)));
		//fld_44
		var fld_44 = $(InputTextarea).clone().attr({"name":"fld_44","id":"fld_44"});
		var NineteenRow = $(Row).clone().append(
											 	$(col12).clone().append(fld_44.append(row.Q9))
										 );
		//txt_10
		var txt_10 = "10. Please describe any long distance or offshore sailing experience(s):";
		var TwentyRow = $(Row).clone().append($(col12).clone().append($('<div>').attr({"id":"txt_10"}).append(txt_10)));
		//fld_45
		var fld_45 = $(InputTextarea).clone().attr({"name":"fld_45","id":"fld_45"});
		var TwentyOneRow = $(Row).clone().append(
												 	$(col12).clone().append(fld_45.append(row.Q10))
											 );
		//txt_11
		var txt_11 = "11. Are you familiar with piloting (coastal navigation with use of charts, compass, parallel rules and onboard electronics)?  ";
		var check = "";
		if(row.Q11a == "1"){ check="checked" }else{ check="" }
		var fld_46 = $(InputRadio).clone().attr({"name":"fld_46","value":"1"}).prop({"checked":check});
		if(row.Q11a == "0"){ check="checked" }else{ check="" }
		var fld_47 = $(InputRadio).clone().attr({"name":"fld_46","value":"0"}).prop({"checked":check});
		var TwentyTwoRow = $(Row).clone().append($(col12).clone().append($('<div>').attr({"id":"txt_11"}).append(txt_11,fld_46,"  Yes  ",fld_47,"  No")));
		//txt_12
		var txt_12 = "If yes, please describe your experience(s)";
		var TwentyThreeRow = $(Row).clone().append($(col12).clone().append($('<div>').attr({"id":"txt_12"}).append(txt_12)));
		//fld_48
		var fld_48 = $(InputTextarea).clone().attr({"name":"fld_48","id":"fld_48"});
		var TwentyFourRow = $(Row).clone().append(
												 	$(col12).clone().append(fld_48.append(row.Q11b))
											 );
		//txt_13
		var txt_13 = "12. List any piloting/navigation courses which you have successfully completed";
		var TwentyFiveRow = $(Row).clone().append($(col12).clone().append($('<div>').attr({"id":"txt_13"}).append(txt_13)));
		//fld_49
		var fld_49 = $(InputTextarea).clone().attr({"name":"fld_49","id":"fld_49"});
		var TwentySixRow = $(Row).clone().append(
												 	$(col12).clone().append(fld_49.append(row.Q12))
											 );	
		//txt_14
		var txt_14 = "<b>Many competent yachtsmen have never owned their own yachts or have not chartered before. "+
								"If you have recently acted in a position of responsibility as a skipper/crew, please give all details on a separate sheet of paper."+
								"list any additional information which you feel is pertinent or may be helpful in assisting us in evaluating your experience"+
								"and he experience of your crew so that we may ensure a safe and enjoyable vacation for your charter party.</b><br>"+
								"If you wish to spend your first day on charter with one of our qualified captains, please ask your charter consultant.";
		var TwentySevenRow = $(Row).clone().append($(col12).clone().append($('<div>').attr({"id":"txt_14"}).append(txt_14)));
		//txt_15
		var txt_15 = "13. Yachting/Personal references (other than family or crew members)";
		var TwentyEightRow = $(Row).clone().append($(col12).clone().append($('<div>').attr({"id":"txt_15"}).append(txt_15)));
		// fld_50
		var txt_50 = $(span).clone().append("Name");
		var fld_50 = $(InputText).clone().attr({"name":"fld_50","value":row.Q13a1});
		// fld_51
		var txt_51 = $(span).clone().append("Address");
		var fld_51 = $(InputText).clone().attr({"name":"fld_51","value":row.Q13b1});
		// fld_52
		var txt_52 = $(span).clone().append("Phone#");
		var fld_52 = $(InputText).clone().attr({"name":"fld_52","value":row.Q13c1});
		
		var TwentyNineRow = $(Row).clone().append(
										 	$(col4).clone().append(
											 	$(InputG).clone().append(txt_50,fld_50)
											),
											$(col4).clone().append(
											 	$(InputG).clone().append(txt_51,fld_51)
											),
											$(col4).clone().append(
											 	$(InputG).clone().append(txt_52,fld_52)
											)
									 );
		// fld_53
		var txt_53 = $(span).clone().append("Name");
		var fld_53 = $(InputText).clone().attr({"name":"fld_53","value":row.Q13a2});
		// fld_54
		var txt_54 = $(span).clone().append("Address");
		var fld_54 = $(InputText).clone().attr({"name":"fld_54","value":row.Q13b2});
		// fld_55
		var txt_55 = $(span).clone().append("Phone#");
		var fld_55 = $(InputText).clone().attr({"name":"fld_55","value":row.Q13c2});
		
		var ThirtyRow = $(Row).clone().append(
										 	$(col4).clone().append(
											 	$(InputG).clone().append(txt_53,fld_53)
											),
											$(col4).clone().append(
											 	$(InputG).clone().append(txt_54,fld_54)
											),
											$(col4).clone().append(
											 	$(InputG).clone().append(txt_55,fld_55)
											)
									 );
		//txt_16
		var txt_16 = "14. Crew list (Please list all members of your charter party).";
		var ThirtyOneRow = $(Row).clone().append($(col12).clone().append($('<div>').attr({"id":"txt_16"}).append(txt_16)));
		//txt_17
		var txt_17 = "<b>NAME.</b>";
		var txt_18 = "<b>BRIEF EXPERIENCE(Specific)</b>";
		var ThirtyTwoRow = $(Row).clone().append(
													$(col6).clone().append($('<div>').addClass("text-center").append(txt_17)),
													$(col6).clone().append($('<div>').addClass("text-center").append(txt_18))
											);
		// fld_57
		var txt_56 = $(span).clone().append("Skipper");
		var fld_56 = $(InputText).clone().attr({"name":"fld_56","value":row.Q14a});
		var fld_57 = $(InputTextarea).clone().attr({"name":"fld_57","id":"fld_57","rows":"2"});
		var ThirtyThreeRow = $(Row).clone().append(
												 	$(col6).clone().append(
													 	$(InputG).clone().css({"margin-top":"10px"}).append(txt_56,fld_56)
													),
													$(col6).clone().append(fld_57.append(row.Q14b))
											 );
		// fld_59
		var txt_58 = $(span).clone().append("Skipper");
		var fld_58 = $(InputText).clone().attr({"name":"fld_58","value":row.Q14c});
		var fld_59 = $(InputTextarea).clone().attr({"name":"fld_59","id":"fld_59","rows":"2"});
		var ThirtyFourRow = $(Row).clone().append(
												 	$(col6).clone().append(
													 	$(InputG).clone().css({"margin-top":"10px"}).append(txt_58,fld_58)
													),
													$(col6).clone().append(fld_59.append(row.Q14d))
											 );
		var txt_submittal = "<b>Lagoon 500 & 52 Resume Submittal:</b> "+
												"<ul><li style='padding-top:5px'>Upon deposit received, customer has 7 days to return the resume. Detailed Captain Resume along with first mate resume must be submitted.</li>"+
												"<li style='padding-top:5px'>If chartered the Lagoon 500 or 52 prior – resume is already approved.</li>"+
												"<li style='padding-top:5px'>If customer is not qualified to skipper the Lagoon 500/52 the customer must hire a skipper for part, or the duration of the charter."+
												"The duration of the skipper is dependent on the decision of the BareboatManager, from the experience outlined in the resume.</li>"+
												"<li style='padding-top:5px'>If customer disagrees and will not hire skipper then customer must cancel or downgrade to a smaller catamaran.</li>"+
												"<li style='padding-top:5px'>Normal cancellation terms will apply if customer cancels.</li>"+
												"<li style='padding-top:5px'>We will provide a guarantee that the resume will be looked at and the decision to approve or deny will be made within 10 days."+
												"At that point, a part or full time skipper can be decided upon at the"+
												"charterer’s cost, or charter must be cancelled.</li></ul>";
		var ThirtyFiveRow =  $(Row).clone().append(
													 	$(col12).clone().append(
														 	$('<div>').clone().append(txt_submittal)
														)
												 );
		// Contrat_sign
		if(contrat.tcg_tp=="own"){
			if(contrat.st_cs_cg != "0"){
				var before_sign = $('<label>').append(contrat.lg_signedbytheclient);
			}else{
				var before_sign = $('<label>').append(contrat.lg_notsignedbytheclient);
			}
		}
		
		if(contrat.cs_cg != "0"){
				//var txt_sign = $('<label>').append(contrat.icon);	
		}
		
		if(contrat.cs_dt_con){
			var txt_btn = $(Row).clone().append(contrat.txt_complete);
		}else{
			var txt_btn = $('<label>').append(contrat.cs_mr+" "+contrat.lg_alreadyfilled);
		}

		if(contrat.cs_cg=='0' || contrat.lcase_step_blocks=='skipval' || contrat.lcase_step_blocks=='coskval'){
			var icon_sign = $('<label>').append(contrat.icon2);	
			var sign = $('<input>').attr({"type":"checkbox","name":""+contrat.checkbox_name+"","id":""+contrat.checkbox_name+"","value":"1"});
			if(contrat.AffInput=='ok'){
				var txt_box_sign = $('<label>').append(contrat.lg_votrenom);
				txt_box_sign += $(InputText).clone().attr({"name":"txtcs_"+contrat.lcase_step_blocks, "id":"txtcs_"+contrat.lcase_step_blocks,"value":''});
			}else{
				var txt_box_sign = $('<input>').attr({"type":"hidden","value":"ok","name":"txtcs_"+contrat.lcase_step_blocks,"id":"txtcs_"+contrat.lcase_step_blocks})
			}
			var AffPhrase1 = $('<label>').append(contrat.AffPhrase1);
			if(contrat.AffPhrase2_instr > 0){
				contrat.AffPhrase2_instr = contrat.AffPhrase2_split;
				contrat.cs_act = contrat.cs_act_split;
				var btn_1 = $('<input>').attr({"name":"btn_0","value":contrat.AffPhrase2[0]}).addClass("btn btn-danger");
				var btn_2 = $('<input>').attr({"name":"btn_1","value":contrat.AffPhrase2[1]}).addClass("btn btn-danger");
			}else{
				var btn_3 = $('<input>').attr({"name":"btn","value":contrat.AffPhrase2, "title":"please check before confirm","id":"confrm_btn"}).addClass("btn btn-danger").prop('disabled', true);
			}
		}
		
		if(contrat.tcg_tp=="own"){
			var ThirtySixRow = $(Row).clone().append(
													 	$(col6).clone().addClass("text-right").append('&nbsp;'),
														$(col6).clone().append(before_sign)
												 );
		}
		
		if(contrat.cs_cg != "0"){
			var ThirtySevenRow = $(Row).clone().append(
														 	$(col6).clone().addClass("text-right pull-right").append(/*txt_sign,*/txt_btn)
													 );
		}
		var ThirtyEightRow = $(Row).clone().append(
												 	$(col6).clone().addClass("text-right pull-right").append(icon_sign,"  ",sign,"  ",txt_box_sign,"  ",AffPhrase1,"  ",btn_1,"  ",btn_2,"  ",btn_3)
												 );
		// ImportSK_196
		var import_button = '<button type="button" class="btn btn-primary" id="ImportSK_196"><i class="fa fa-download"></i>'+row.lg_skipper_import+'</button>'
		//Before Append// 									
		var SkipperInfo = $(Row).clone().css({"margin-top":"15px","margin-left":"5px","margin-right":"5px"})
											.append(
												$(col12).clone()
												.append(
													FirstRow,SecondRow,ThirdRow,FourthRow
													,FifthRow,SixRow,SevenRow,EightRow,NineRow
													,TenRow,ElevenRow,TwelveRow,ThirteenRow
													,FourteenRow,FifthteenRow,SixteenRow
													,SeventeenRow,EightteenRow,NineteenRow,TwentyRow
													,TwentyOneRow,TwentyTwoRow,TwentyThreeRow,TwentyFourRow
													,TwentyFiveRow,TwentySixRow,TwentySevenRow,TwentyEightRow
													,TwentyNineRow,ThirtyRow,ThirtyOneRow,ThirtyTwoRow,ThirtyThreeRow
													,ThirtyFourRow,ThirtyFiveRow,ThirtySixRow,ThirtySevenRow,ThirtyEightRow
												)
											);
		//append			
		$('#SkipperInfo').append(SkipperInfo); //Append On Page
		$('#Import_SK').html(import_button);
	}else{
		// TitleName //
		if(con1 == "True"){
			var	result = '<input type="hidden" name="Salutation_skipper" value="2">';
			$('#SkipperInfo').append(result);	
		}else if(con2 == "True"){
			var	result = '<input type="hidden" name="Salutation_skipper" value="">';	
			$('#SkipperInfo').append(result);	
		}else{
									if(row.mySalutation_skipper=="0"){check = "checked"}else{check = "" }
			var	ms 	 =	$('<label>').append(
									$(InputRadio).clone().attr({"name":"mySalutation_skipper","value":"0","id":"Salutation_skipper"}).prop({"checked":check,"disabled":row.disabled}),
										row.Mrs+'&nbsp;&nbsp;'
									)/*.text('&nbsp;<%=Dic("Mrs")%>&nbsp;')*/;
									if(row.mySalutation_skipper=="1"){check = "checked"}else{check = "" }
			var	miss = 	$('<label>').append(
										$(InputRadio).clone().attr({"name":"mySalutation_skipper","value":"1","id":"Salutation_skipper"}).prop({"checked":check,"disabled":row.disabled}),
										row.Miss+'&nbsp;&nbsp;'
									);
									if(row.mySalutation_skipper=="2"){check = "checked"}else{check = "" }
			var	mr 	 =  $('<label>').append(
										$(InputRadio).clone().attr({"name":"mySalutation_skipper","value":"2","id":"Salutation_skipper"}).prop({"checked":check,"disabled":row.disabled}),
										row.Mr+''
									);
			var salutation = $(Row).clone().css({"margin-top":"10px"}).append($(col12).clone().append(ms,miss,mr));		
		}
		// Lastname & Firstname //
		var NameSkip = $(span).clone().append(row.lg_LastName);
		var NameSkipEl = $(InputText).clone().addClass('lastname').attr({"name":"myName_skipper","value":row.myName_skipper,"id":"Name_skipper"}).prop({"disabled":disable});
									 
		var FName = $(span).clone().append(row.Prenom);
		var FNameEl = $(InputText).clone().attr({"name":"myFirstName_skipper","value":row.myFirstName_skipper,"id":"FirstName_skipper"}).prop({"disabled":disable});
									
		var FirstRow = $(Row).clone().append(
										 	$(col6).clone().append(
											 	$(InputG).clone().append(NameSkip,NameSkipEl)
											),
										 	$(col6).clone().append(
											 	$(InputG).clone().append(FName,FNameEl)
											)
									 );		 
		// Bithdate & PlaceBirth //
		if(droits.clss_date_naiss_skipper==''){
			var DateB = $(span).clone().append(row.Birthdate);
			var DateBEl = $(InputText).clone().attr({"name":"myDate_naiss_skipper","value":row.myDate_naiss_skipper,"id":"Date_naiss_skipper"}).prop({"disabled":disable});
		}
		if(droits.clss_lieu_naiss_skipper==''){
			var PlaceB = $(span).clone().append(row.lg_placeofbirth);
			var PlaceBEl = $(InputText).clone().attr({"name":"myLieu_naiss_skipper","value":row.myLieu_naiss_skipper,"id":"Lieu_naiss_skipper"}).prop({"disabled":disable});
		}
		if(DateB && PlaceB){
			var SecondRow = $(Row).clone().append(
											 	$(col6).clone().append(
												 	$(InputG).clone().append(DateB,DateBEl)
												),
											 	$(col6).clone().append(
												 	$(InputG).clone().append(PlaceB,PlaceBEl)
												)
									 		);
		}else if(DateB && !PlaceB){
			var SecondRow = $(Row).clone().append(
											 	$(col12).clone().append(
												 	$(InputG).clone().append(DateB,DateBEl)
												)
											);
		}else if(!DateB && PlaceB){
			var SecondRow = $(Row).clone().append(
											 	$(col12).clone().append(
												 	$(InputG).clone().append(PlaceB,PlaceBEl)
												)
									 		);
		}
		// Address //
		if(droits.clss_address_skipper==''){
			var Address1 = $(span).clone().append(row.Address);
			if(droits.affich_addressOPE){
				var Address1El = $(InputText).clone().attr({"name":"myAddress_skipperOPE","value":row.myAddress_skipperOPE,"id":"Address_skipperOPE"}).prop({"disabled":disable});
			}else{
				var Address1El = $(InputText).clone().attr({"name":"myAddress_skipper","value":row.myAddress_skipper,"id":"Address_skipper"}).prop({"disabled":disable});
			}
			var ThirdRow = $(Row).clone().append(
											 	$(col12).clone().append(
												 	$(InputG).clone().append(Address1,Address1El)
												)
										 );
		}
		// Address2 //
		if(droits.clss_address2_skipper==''){						 
			var Address2 = $(span).clone().append(row.Address+' 2');
			if(droits.affich_addressOPE){
				var Address2El = $(InputText).clone().attr({"name":"myAddress2_skipperOPE","value":row.myAddress2_skipperOPE,"id":"Address2_skipperOPE"}).prop({"disabled":disable});
			}else{
				var Address2El = $(InputText).clone().attr({"name":"myAddress2_skipper","value":row.myAddress2_skipper,"id":"Address2_skipper"}).prop({"disabled":disable});
			}								
			var FourthRow = $(Row).clone().append(
												 	$(col12).clone().append(
													 	$(InputG).clone().append(Address2,Address2El)
													)
											 );
		}
		// City & Zipcode //
		if(droits.clss_city_skipper==''){
			var City = $(span).clone().append(row.City);
			if(droits.affich_addressOPE){
				var CityEl = $(InputText).clone().attr({"name":"myCity_skipperOPE","value":row.myCity_skipperOPE,"id":"City_skipperOPE"}).prop({"disabled":disable});
			}else{
				var CityEl = $(InputText).clone().attr({"name":"myCity_skipper","value":row.myCity_skipper,"id":"City_skipper"}).prop({"disabled":disable});
			}
		}
		if(droits.clss_zipcode_skipper==''){													 
			var ZipCode = $(span).clone().append(row.Zipcode);
			if(droits.affich_addressOPE){
				var ZipCodeEl = $(InputText).clone().attr({"name":"myZipCode_skipperOPE","value":row.myZipCode_skipperOPE,"id":"ZipCode_skipperOPE"}).prop({"disabled":disable});
			}else{
				var ZipCodeEl = $(InputText).clone().attr({"name":"myZipCode_skipper","value":row.myZipCode_skipper,"id":"ZipCode_skipper"}).prop({"disabled":disable});
			}
		}	
		if(City && ZipCode){
			var FifthRow = $(Row).clone().append(
											 	$(col6).clone().append(
												 	$(InputG).clone().append(City,CityEl)
												),
											 	$(col6).clone().append(
												 	$(InputG).clone().append(ZipCode,ZipCodeEl)
												)
										 );		
		}else if(City && !ZipCode){
			var FifthRow = $(Row).clone().append(
										 	$(col12).clone().append(
											 	$(InputG).clone().append(City,CityEl)
											)
									 );
		}else if(!City && ZipCode){
			var FifthRow = $(Row).clone().append(
										 		$(col12).clone().append(
												 	$(InputG).clone().append(ZipCode,ZipCodeEl)
												)
									 );
		}
		// Country & State //
		if (droits.clss_country_skipper==''){
			var Country = $(span).clone().append(row.Country);
			if (droits.affich_addressOPE){
				var	l_nam = "myCountry_skipperOPE"
				var l_val = row.myCountry_skipperOPE
			}else{
				var	l_nam = "myCountry_skipper"
				var l_val = row.myCountry_skipper
			}
			var selectcountry = '';
			var CountryEl = '<select name="'+l_nam+'" class="form-control skipper" id="'+l_nam+'" '+disable+'>'+
											'<option value="">Other</option>';				
											$.each(country,function(key,value){
												var valueN = value.names.replace("[chr39]", "'");
												((l_val==valueN) ? sel = "selected" : sel = '')
												selectcountry = selectcountry + '<option value="'+valueN+'" '+sel+'>'+valueN+'</option>';
											});
			var CountryEnd = '</select>';
										//$('#'+l_nam+'').prop("disabled",true);
		}
		if (droits.clss_state_skipper==''){
			var State = $(span).clone().append(row.State);
			if (droits.affich_addressOPE){
				var	l_nam = "myState_skipperOpe"
				var l_val = row.myState_skipperOpe
			}else{
				var	l_nam = "myState_skipper"
				var l_val = row.myState_skipper
			}
			var selectstate = '';
			var StateEl = '<select name="'+l_nam+'" class="form-control skipper" id="'+l_nam+'" '+disable+'>'+
										'<option value="">Only U.S. resident</option>';				
										$.each(state,function(key,value){
											var valueN = value.names.replace("[chr39]", "'");
											((l_val==value.code || l_val==valueN) ? sel = "selected" : sel = '')
											selectstate = selectstate + '<option value="'+value.code+'" '+sel+'>'+value.code+' - '+valueN+'</option>';
										});
			var StateElEnd = '</select>';
		}
		var SixRow = $(Row).clone().append(
									 	$(col6).clone().append(
										 	$(InputG).clone().append(Country,CountryEl+selectcountry+CountryEnd)
										),
									 	$(col6).clone().append(
										 	$(InputG).clone().append(State,StateEl+selectstate+StateElEnd)
										)
								 );
		// Phone & Mobile //
		if (droits.clss_tel_skipper==''){
			var Phone = $(span).clone().append(row.Phone);
			var PhoneEl = $(InputText).clone().attr({"name":"myTel_skipper","value":row.myTel_skipper,"id":"Tel_skipper"}).prop({"disabled":disable});
		}
		if (droits.clss_mob_skipper==''){
			var Mobile = $(span).clone().append(row.Mobile);
			var MobileEl = $(InputText).clone().attr({"name":"myMob_skipper","value":row.myMob_skipper,"id":"Mob_skipper"}).prop({"disabled":disable});
		}
		if(Phone && Mobile){
			var SevenRow = $(Row).clone().append(
											 	$(col6).clone().append(
												 	$(InputG).clone().append(Phone,PhoneEl)
												),
											 	$(col6).clone().append(
												 	$(InputG).clone().append(Mobile,MobileEl)
												)
										 );	
		}else if(Phone && !Mobile){
			var SevenRow = $(Row).clone().append(
										 	$(col12).clone().append(
											 	$(InputG).clone().append(Phone,PhoneEl)
											)
									 );
		}else if(!Phone && Mobile){
			var SevenRow = $(Row).clone().append(
										 		$(col12).clone().append(
												 	$(InputG).clone().append(Mobile,MobileEl)
												)
									 );
		}
		// Fax & Email//
		if (droits.clss_fax_skipper==''){
			var Fax = $(span).clone().append(row.lg_fax);
			var FaxEl = $(InputText).clone()
									.attr({"name":"myFax_skipper","value":row.myFax_skipper,"id":"Fax_skipper"}).prop({"disabled":disable});
		}
		if (droits.clss_email_skipper==''){
			var Email = $(span).clone().append(row.lg_email);
			if(droits.affich_addressOPE){
				var EmailEl = $(InputText).clone().attr({"name":"myEmail_skipperOpe","value":row.myEmail_skipperOpe,"id":"Email_skipperOPE"}).prop({"disabled":disable});
			}else{
				var EmailEl = $(InputText).clone().attr({"name":"myEmail_skipper","value":row.myEmail_skipper,"id":"Email_skipper"}).prop({"disabled":disable});
			}
		}
		if(Fax && Email){
			var EightRow = $(Row).clone().append(
											 	$(col6).clone().append(
												 	$(InputG).clone().append(Fax,FaxEl)
												),
											 	$(col6).clone().append(
												 	$(InputG).clone().append(Email,EmailEl)
												)
										 );
		}else if(Fax && !Email){
			var EightRow = $(Row).clone().append(
										 	$(col12).clone().append(
											 	$(InputG).clone().append(Fax,FaxEl)
											)
									 );
		}else if(!Fax && Email){
			var EightRow = $(Row).clone().append(
										 		$(col12).clone().append(
												 	$(InputG).clone().append(Email,EmailEl)
												)
									 );
		}
		// Passport & Nationality //
		if (droits.clss_identnum_skipper==''){
			var Passport = $(span).clone().append(row.lg_passport_no);
			var PassportEl = $(InputText).clone().attr({"name":"myIdentNum_skipper","value":row.myIdentNum_skipper,"id":"IdentNum_skipper"}).prop({"disabled":disable});
		}
		if (droits.clss_nation_skipper==''){
			var Nation = $(span).clone().append(row.nation);
			var NationEl = $(InputText).clone().attr({"name":"myNation_skipper","value":row.myNation_skipper,"id":"Nation_skipper"}).prop({"disabled":disable});
		}
		if(Passport && Nation){
			var NineRow = $(Row).clone().append(
											 	$(col6).clone().append(
												 	$(InputG).clone().append(Passport,PassportEl)
												),
											 	$(col6).clone().append(
												 	$(InputG).clone().append(Nation,NationEl)
												)
										 );
		}else if(Passport && !Nation){
			var NineRow = $(Row).clone()
									 .append(
										 	$(col12).clone().append(
											 	$(InputG).clone().append(Passport,PassportEl)
											)
									 );
		}else if(!Passport && Nation){
			var NineRow = $(Row).clone()
									 .append(
										 	$(col12).clone().append(
													$(InputG).clone().append(Nation,NationEl)
												)
									 );
		}
		// Comment_skipper //
		if (droits.clss_experience2==''){
			var comment = $('<div>').attr({"id":"Indicate"}).append(row.commentss);
			var commentEl = $(InputTextarea).clone().attr({"name":"myComment_skipper","id":"Comment_skipper"}).prop({"disabled":disable});
			var TenRow = $(Row).clone().append(
									 		$(col12).clone().append(comment)
									 );
			var ElevenRow = $(Row).clone().append(
												 	$(col12).clone().append(commentEl.append(row.myComment_skipper))
											 );
		}
		// SailLicence //
		if (droits.clss_licence==''){
			var Licence = $('<span>').append(row.SailLicence);
											 if(row.mylicence=="yes"){ check="checked", hiderow = "block" }else{ check='', hiderow = ""}
			var LicenceEl1 = $('<label>').append(
												$(InputRadio).clone().attr({"name":"mylicence","value":"yes","id":"licence"}).prop({"checked":check,"disabled":disable}),'&nbsp;'+row.lg_ye+'&nbsp;'
											);
											if(row.mylicence=="no"){ check="checked", hiderow = "none" }else{ check='', hiderow = ""}
			var LicenceEl2 = $('<label>').append(
													$(InputRadio).clone().attr({"name":"mylicence","value":"no","id":"licence"}).prop({"checked":check,"disabled":disable}),'&nbsp;'+row.lg_no+''
											 );
		 var TwelveRow = $(Row).clone().append(
			 								 	$(col12).clone().append(
			 								 		$(InputG).clone().append(Licence,LicenceEl1,LicenceEl2)
			 								 	)
		 								 );
		}
		// LicenceType //
		if (droits.clss_licence_type==''){
			var WhichOne = $(span).clone().append(row.WhichOne);
			var WhichOneEl = $(InputText).clone().attr({"name":"mylicence_type","value":row.mylicence_type,"id":"licence_type"}).prop({"disabled":disable});	
			var ThirteenRow = $(Row).clone().append(
			 								 		$(col12).clone().append(
				 								 		$(InputG).clone().append(WhichOne,WhichOneEl)
				 								 	)
			 								 	).css("display",hiderow);
		}
		// LicenceNum //
		if (droits.clss_licence_num==''){
			var LicenceNum = $(span).clone().append(row.lg_licencenum);
			var LicenceNumEl = $(InputText).clone().attr({"name":"mylicence_num","value":row.mylicence_num,"id":"licence_num"}).prop({"disabled":disable});
			var FourteenRow = $(Row).clone().append(
				 								 	$(col12).clone().append(
				 								 		$(InputG).clone().append(LicenceNum,LicenceNumEl)
				 								 	)
			 									).css("display",hiderow);
		}
		// LicenceOff //
		if (droits.clss_licence_off==''){
			var LicenceOff = $(span).clone().append(row.lg_gni_capdiporto);
			var LicenceOffEl = $(InputText).clone().attr({"name":"mylicence_off","value":row.mylicence_off,"id":"licence_off"}).prop({"disabled":disable});
			var FifthteenRow = $(Row).clone().append(
					 								 	$(col12).clone().append(
					 								 		$(InputG).clone().append(LicenceOff,LicenceOffEl)
					 								 	)
				 								 ).css("display",hiderow);
		}
		// LiceneceDate //
		if (droits.clss_licence_date==''){
			var LicenceDate = $(span).clone().append(row.lg_gni_entroleore);
			var LicenceDateEl = $(InputText).clone().attr({"name":"mylicence_date","value":row.mylicence_date,"id":"licence_date"}).prop({"disabled":disable});
			var SixteenRow = $(Row).clone().append(
				 								 	$(col12).clone().append(
				 								 		$(InputG).clone().append(LicenceDate,LicenceDateEl)
				 								 	)
			 								 ).css("display",hiderow);
		}
		// LicenceUntill //
		if (droits.clss_licence_until==''){
			var LicenceUntill = $(span).clone().append(row.lg_gni_valida);
			var LicenceUntillEl = $(InputText).clone().attr({"name":"mylicence_until","value":row.mylicence_until,"id":"licence_until"}).prop({"disabled":disable});
			var SeventeenRow = $(Row).clone().append(
				 								 		$(col12).clone().append(
				 								 			$(InputG).clone().append(LicenceUntill,LicenceUntillEl)
				 								 		)
				 									).css("display",hiderow);
		}
	
		// LicenceFor //
		if (droits.clss_licence_for==''){
			var LicenceFor = $(span).clone().append(row.For_navigation);
			var LicenceForEl = $(InputText).clone().attr({"name":"mylicence_for","value":row.mylicence_for,"id":"licence_for"}).prop({"disabled":disable});
			var EightteenRow = $(Row).clone().append(
					 								 	$(col12).clone().append(
					 								 		$(InputG).clone().append(LicenceFor,LicenceForEl)
					 								 	)
			 									 ).css("display",hiderow);
		}
		
		// VHF certificate //
		if (droits.clss_vhf_radio==''){
			var Vhf = $(span).clone().append(row.lg_cvskipper_57);
			var VhfEl = $(InputText).clone().attr({"name":"Vhf_radio","value":row.myVhf_radio,"id":"Vhf_radio"}).prop({"disabled":disable});
			var VhfRow = $(Row).clone().append(
					 								 	$(col12).clone().append(
					 								 		$(InputG).clone().append(Vhf,VhfEl)
					 								 	)
			 									 ).css("display",hiderow);
		}
				
		// NavigationExp //
		if (droits.clss_eric==''){
				var NavigationExp = $(span).clone().append(row.NavigationExp);
				var NavigationExpEl = $(InputText).clone().attr({"name":"myNb_year","value":row.myNb_year,"id":"Nb_year"}).prop({"disabled":disable});
				var NineteenRow = $(Row).clone().append(
					 								 	$(col12).clone().append(
					 								 		$(InputG).clone().append(NavigationExp,NavigationExpEl)
					 								 	)
				 									).css("display",hiderow);
			
		
			// NumOfDay //
			if (droits.clss_Nb_day==''){
				var NumOfDay = $(span).clone().append(row.NumOfDay);
				var NumOfDayEl = $(InputText).clone().attr({"name":"myNb_day","value":row.myNb_day,"id":"Nb_day"}).prop({"disabled":disable});
				var TwentyRow = $(Row).clone().append(
			 								 		$(col12).clone().append(
			 								 			$(InputG).clone().append(NumOfDay,NumOfDayEl)
			 								 		)
				 								).css("display",hiderow);
			}
			if(row.mylicence == "no"){
				$(WhichOneEl).val("").attr("disabled","");
				$(LicenceNumEl).val("").attr("disabled","");
				$(LicenceOffEl).val("").attr("disabled","");
				$(LicenceDateEl).val("").attr("disabled","");
				$(LicenceUntillEl).val("").attr("disabled","");
				$(LicenceForEl).val("").attr("disabled","");
				$(NavigationExpEl).val("").attr("disabled","");
				$(NumOfDayEl).val("").attr("disabled","");
			}
			// HaveYouEver //
			if (droits.clss_haveyouever==''){
				var SansEquipage = $('<span>').append(row.HaveYouEver);
															((row.mysans_equipage=="yes") ? check="checked" : check='')
				var SansEquipageEl1 = $('<label>').append(
																$(InputRadio).clone().attr({"name":"mysans_equipage","value":"yes","id":"sans_equipage"}).prop({"checked":check,"disabled":disable}),''+row.Yes+'&nbsp;'
															);
															((row.mysans_equipage=="no") ? check="checked" : check='')
				var SansEquipageEl2 = $('<label>').append(
																$(InputRadio).clone().attr({"name":"mysans_equipage","value":"no","id":"sans_equipage"}).prop({"checked":check,"disabled":disable}),''+row.No+''
															);
				var TwentyOneRow = $(Row).clone().append(
						 								 	$(col12).clone().append(
						 								 		$(InputG).clone().append(SansEquipage,SansEquipageEl1,SansEquipageEl2)
						 								 	)
			 								 		 );
			}
			// AreYouOwner //
			var check;
			var HaveBoat = $('<span>').append(row.AreYouOwner);
											if(row.myhave_boat=="yes"){check = "checked", hiderow="block"}else{check = "", hiderow=""}
											
			var HaveBoat1 = $('<label>').append(
												$(InputRadio).clone().attr({"name":"myhave_boat","value":"yes","id":"have_boat"}).prop({"checked":check,"disabled":disable}),''+row.Yes+'&nbsp;'
											);
											if(row.myhave_boat=="no"){check = "checked", hiderow="none"}else{check = "", hiderow=""}
												
			var HaveBoat2 = $('<label>').append(
												$(InputRadio).clone().attr({"name":"myhave_boat","value":"no","id":"have_boat"}).prop({"checked":check,"disabled":disable}),''+row.No+''
											);
			var TwentyTwoRow = $(Row).clone().append(
					 								 	$(col12).clone().append(
					 								 		$(InputG).clone().append(HaveBoat,HaveBoat1,HaveBoat2)
					 								 	)
		 								 		 );
			// BoatType //
			if (droits.clss_boattype==''){
				var TypeBoat = $(span).clone().append(row.BoatType);
				var TypeBoatEl = $(InputText).clone().attr({"name":"mytype_boat","value":row.mytype_boat,"id":"type_boat"}).prop({"disabled":disable});
				var TwentyThreeRow = $(Row).clone().append(
						 								 		$(col12).clone().append(
						 								 			$(InputG).clone().append(TypeBoat,TypeBoatEl)
						 								 		)
						 								 ).css("display",hiderow);
			}
			// LongBoat //
			if (droits.ss_styl=='O356'){
				var LengthText = ''+row.lg_dequelletaille+'';
			}else{
				var LengthText = ''+row.Length+'';
			}
			var Length = $(span).clone().append(LengthText);
			var LengthEl = $(InputText).clone().attr({"name":"mylong_boat","value":row.mylong_boat,"id":"long_boat"}).prop({"disabled":disable});
			var TwentyFourRow = $(Row).clone().append(
				 								 		$(col12).clone().append(
				 								 			$(InputG).clone().append(Length,LengthEl)
				 								 		)
				 									).css("display",hiderow);	
		
			// PlaceBoat //
			if (droits.ss_styl != 'O356'){
				var BoatPlace = $(span).clone().append(row.Place);
				var BoatPlaceEl = $(InputText).clone().attr({"name":"myplace_boat","value":row.myplace_boat,"id":"place_boat"}).prop({"disabled":disable});
				var TwentyFiveRow = $(Row).clone().append(
					 								 		$(col12).clone().append(
					 								 			$(InputG).clone().append(BoatPlace,BoatPlaceEl)
					 								 		)
					 									).css("display",hiderow);
			}
		}
		if(row.myhave_boat == "no"){
			$(TypeBoatEl).val("").attr("disabled","");
			$(LengthEl).val("").attr("disabled","");
			$(BoatPlaceEl).val("").attr("disabled","");
		}
		// AdditionalComment //
		if (droits.clss_comment==''){
			if (ss_id_ope == '625') {
				text_addiComment = 'Additional comments and sailing itinerary';
			} else {
				text_addiComment = row.lg_AdditionalComment
			}
			var AddiComment = $('<div>').attr({"id":"Indicate"}).append(text_addiComment);
			var AddiCommentEl = $(InputTextarea).clone().attr({"name":"mycomment"}).prop({"disabled":disable});
			var TwentySixRow = $(Row).clone().append(
												 		$(col12).clone().append(AddiComment)
												 );
			var TwentySevenRow = $(Row).clone().append(
														 	$(col12).clone().append(AddiCommentEl.append(row.mycomment))
													 );
		}
		
		if (droits.affich_addressOPE){
			var BtmText = 	$(Row).clone().append(
												$(col12).clone().append(
														$('<Span>').css({"color":"red"}).append(row.lg_visibleuniquement.replace(/<br>/g, " "))
												)
											);
		}
		//Before Append// 									
		var SkipperInfo = $(Row).clone()
										.append(
											$(col12).clone()
											.append(
												salutation,FirstRow,SecondRow,ThirdRow,FourthRow
												,FifthRow,SixRow,SevenRow,EightRow,NineRow
												,TenRow,ElevenRow,TwelveRow,ThirteenRow
												,FourteenRow,FifthteenRow,SixteenRow
												,SeventeenRow,EightteenRow,VhfRow,NineteenRow
												,TwentyRow,TwentyOneRow,TwentyTwoRow,TwentyThreeRow
												,TwentyFourRow,TwentyFiveRow,TwentySixRow,TwentySevenRow,BtmText
											)
										);
		var btn_import = '<button type="button" class="btn btn-primary" id="ImportSK"><i class="fa fa-download"></i> '+row.lg_skipper_import+'</button>';
		var btn_upload = '<button type="button" class="btn btn-primary" onclick="DirecToUpload()" ><i class="fa fa-upload"></i> '+UP+'</button>';
		if(disable=="disabled"){  $('#ImportSK').attr("disabled", true); }
		$('#SkipperInfo').append(SkipperInfo);
		$('#Import_SK').append(btn_import," ",btn_upload,"<br>");
	}
	GetSkipperElement();
}

function DirecToUpload(){
	$('#myTab > li > a[href=#UP]').click();
}

function BoatingHistory(condition_01,condition_02,condition_03,condition_04,condition_05,condition_06,condition_07){
	var check = '';
	var InputRadio = $('<input>').attr({type:"radio"}).addClass("boating-history");
	var InputText = $('<input>').attr({type:"text"}).addClass('form-control boating-history');
	var InputTextarea = $('<textarea>').attr({"rows":"5"}).addClass('form-control boating-history').css({"resize":"none"});
	var InputCheckbox = $('<input>').attr({type:"checkbox"}).addClass('boating-history');
	var Row = $('<div>').addClass('row')/*.css({"margin-bottom":"10px"})*/;
	var Row2 = $('<div>').addClass('row');
	var col3 = $('<div>').addClass('col-lg-3 col-md-3 col-sm-6 col-xs-12');
	var col4 = $('<div>').addClass('col-lg-4 col-md-4 col-sm-6 col-xs-12');
	var col6 = $('<div>').addClass('col-lg-6 col-md-6 col-sm-12 col-xs-12');
	var col11 = $('<div>').addClass('col-lg-11 col-md-11 col-sm-11 col-xs-11');	
	var col12 = $('<div>').addClass('col-lg-12 col-md-12 col-sm-12 col-xs-12');	
	var InputG = $('<div>').addClass('input-group');
	var span = $('<span>').addClass('input-group-addon');
	var span2 = $('<span>').addClass('input-group-addon2');
	var dis_nb;
	var number='';
	var display='';
	if(condition_01=='TRUE' || condition_02 > 0){
		bh_tab = 1;
		// title_01 //
			var FirstTitle = $('<div>').attr({"id":"title_01"}).append('<b>'+row.lg_cvskipper_02+'</b>');
			
			var FirstRow = $(Row).clone().css({"margin-top":"10px","margin-bottom":"10px"}).append(
									 		 $(col12).clone().append(FirstTitle)
									 	 );
									 	 
		// fld_int_01 //
			var fld_int_01 = $('<span>').append(row.Monohull);
		
			((row.fld_int_01=="0") ? check="checked" : check='')
			var fld_int_01El1 = $('<label>').append(
															$(InputRadio).clone().attr({"name":"fld_int_01","value":"0"}).prop({"checked":check}),' 0 '+row.lg_cvskipper_03+'&nbsp;&nbsp;'
														);
														
			((row.fld_int_01=="1") ? check="checked" : check='')
			var fld_int_01El2 = $('<label>').append(
															$(InputRadio).clone().attr({"name":"fld_int_01","value":"1"}).prop({"checked":check}),' 1-4 '+row.lg_cvskipper_03+'&nbsp;&nbsp;'
														);
														
			((row.fld_int_01=="2") ? check="checked" : check='')
			var fld_int_01El3 = $('<label>').append(
															$(InputRadio).clone().attr({"name":"fld_int_01","value":"2"}).prop({"checked":check}),' 5+ '+row.lg_cvskipper_03+''
														);
														
			var SecondRow = $(Row).clone().css({"margin-bottom":"10px","margin-left":"15px","margin-right":"15px"}).append(
			 								 	$(col12).clone().append(
			 								 		$(InputG).clone().attr({"id":"fld_int_01"}).append(fld_int_01,fld_int_01El1,fld_int_01El2,fld_int_01El3)
			 								 	)
								 		 	);
								 		 
		// fld_int_02 //
			var fld_int_02 = $('<span>').append(row.Catamaran);
		
			((row.fld_int_02=="0") ? check="checked" : check='')
			var fld_int_02El1 = $('<label>').append(
															$(InputRadio).clone().attr({"name":"fld_int_02","value":"0"}).prop({"checked":check}),' 0 '+row.lg_cvskipper_03+'&nbsp;&nbsp;'
														);
														
			((row.fld_int_02=="1") ? check="checked" : check='')
			var fld_int_02El2 = $('<label>').append(
															$(InputRadio).clone().attr({"name":"fld_int_02","value":"1"}).prop({"checked":check}),' 1-4 '+row.lg_cvskipper_03+'&nbsp;&nbsp;'
														);
														
			((row.fld_int_02=="2") ? check="checked" : check='')
			var fld_int_02El3 = $('<label>').append(
															$(InputRadio).clone().attr({"name":"fld_int_02","value":"2"}).prop({"checked":check}),' 5+ '+row.lg_cvskipper_03+''
														);
														
			var ThirdRow = $(Row).clone().css({"margin-bottom":"10px","margin-left":"15px","margin-right":"15px"}).append(
			 								 	$(col12).clone().append(
			 								 		$(InputG).clone().attr({"id":"fld_int_02"}).append(fld_int_02,fld_int_02El1,fld_int_02El2,fld_int_02El3)
			 								 	)
								 		 );
		
		// fld_char_01 //
			var fld_char_01 = $(span).clone().append(row.lg_cvskipper_04);
			
			var fld_char_01El = $(InputText).clone().attr({"name":"fld_char_01","value":''+row.fld_char_01+''});
	
			var FourthRow = $(Row).clone().css({"margin-left":"15px","margin-right":"15px"}).append(
											 	$(col12).clone().append(
												 	$(InputG).clone().attr({"id":"fld_char_01"}).append(fld_char_01,fld_char_01El)
												)
										 	);
		
		// title_02 //
			var SecondTitle = $('<div>').attr({"id":"title_02"}).append('<b>'+row.lg_cvskipper_05+'</b>');
			
			var FifthRow = $(Row).clone().css({"margin-top":"25px","margin-bottom":"10px"}).append(
									 		 $(col12).clone().append(SecondTitle)
									 	 );
			
		// fld_int_03 //
			var fld_int_03 = $('<span>').append(row.Monohull);
		
			((row.fld_int_03=="0") ? check="checked" : check='')
			var fld_int_03El1 = $('<label>').append(
															$(InputRadio).clone().attr({"name":"fld_int_03","value":"0"}).prop({"checked":check}),' 0 '+row.lg_days+'&nbsp;&nbsp;'
														);
														
			((row.fld_int_03=="1") ? check="checked" : check='')
			var fld_int_03El2 = $('<label>').append(
															$(InputRadio).clone().attr({"name":"fld_int_03","value":"1"}).prop({"checked":check}),' 1-4 '+row.lg_days+'&nbsp;&nbsp;'
														);
														
			((row.fld_int_03=="2") ? check="checked" : check='')
			var fld_int_03El3 = $('<label>').append(
															$(InputRadio).clone().attr({"name":"fld_int_03","value":"2"}).prop({"checked":check}),' 5+ '+row.lg_days+''
														);
														
			var SixRow = $(Row).clone().css({"margin-bottom":"10px","margin-left":"15px","margin-right":"15px"}).append(
			 								 	$(col12).clone().append(
			 								 		$(InputG).clone().attr({"id":"fld_int_03"}).append(fld_int_03,fld_int_03El1,fld_int_03El2,fld_int_03El3)
			 								 	)
								 		 	);
								 		 	
		// fld_int_03 //
			var fld_int_04 = $('<span>').append(row.Catamaran);
		
			((row.fld_int_04=="0") ? check="checked" : check='')
			var fld_int_04El1 = $('<label>').append(
															$(InputRadio).clone().attr({"name":"fld_int_04","value":"0"}).prop({"checked":check}),' 0 '+row.lg_days+'&nbsp;&nbsp;'
														);
														
			((row.fld_int_04=="1") ? check="checked" : check='')
			var fld_int_04El2 = $('<label>').append(
															$(InputRadio).clone().attr({"name":"fld_int_04","value":"1"}).prop({"checked":check}),' 1-4 '+row.lg_days+'&nbsp;&nbsp;'
														);
														
			((row.fld_int_04=="2") ? check="checked" : check='')
			var fld_int_04El3 = $('<label>').append(
															$(InputRadio).clone().attr({"name":"fld_int_04","value":"2"}).prop({"checked":check}),' 5+ '+row.lg_days+''
														);
														
			var SevenRow = $(Row).clone().css({"margin-bottom":"10px","margin-left":"15px","margin-right":"15px"}).append(
			 								 	$(col12).clone().append(
			 								 		$(InputG).clone().attr({"id":"fld_int_04"}).append(fld_int_04,fld_int_04El1,fld_int_04El2,fld_int_04El3)
			 								 	)
								 		 	);
								 		 	
		// fld_char_40 //
			var fld_char_40 = $(span).clone().append(row.lg_cvskipper_06);
			
			var fld_char_40El = $(InputText).clone().attr({"name":"fld_char_40","value":''+row.fld_char_40+''});
	
			var EightRow = $(Row).clone().css({"margin-left":"15px","margin-right":"15px"}).append(
											 	$(col12).clone().append(
												 	$(InputG).clone().attr({"id":"fld_char_40"}).append(fld_char_40,fld_char_40El)
												)
										 	);
		//title_03 //
			var ThirdTitle = $('<div>').attr({"id":"title_03"}).append('<b>'+row.lg_cvskipper_07+'</b>');
			
			var NineRow = $(Row).clone().css({"margin-top":"25px","margin-bottom":"10px"}).append(
									 		 $(col12).clone().append(ThirdTitle)
									 	 );
			
		// fld_char_02 //
			var fld_char_zero = row.fld_char_02.indexOf("0");
			var fld_char_one = row.fld_char_02.indexOf("1");
			var fld_char_two = row.fld_char_02.indexOf("2");
			
			var fld_char_02 = $('<span>').append(row.Monohull);
			
			if(fld_char_zero > -1){ check = 'checked'; }else{ check = '';}
			var fld_char_02El1 = $(InputCheckbox).clone().attr({"name":"fld_char_02","value":"0"}).prop({"checked":check})/*,"0-21'&nbsp;&nbsp;"*/;	
			
			if(fld_char_one > -1){ check = 'checked'; }else{ check = '';}
			var fld_char_02El2 = $(InputCheckbox).clone().attr({"name":"fld_char_02","value":"1"}).prop({"checked":check})/*,"22-41'"*/;
			
			if(fld_char_two > -1){ check = 'checked'; }else{ check = '';}
			var fld_char_02El3 = $(InputCheckbox).clone().attr({"name":"fld_char_02","value":"2"}).prop({"checked":check})/*,"42'+&nbsp;&nbsp;"*/;	
			
			var TenRow = $(Row).clone().css({"margin-bottom":"10px","margin-left":"15px","margin-right":"15px"}).append(
		 								 		$(col12).clone().append(
			 								 		$(InputG).attr({"id":"fld_char_02"}).clone().append(fld_char_02,fld_char_02El1,"0-21'&nbsp;&nbsp;",fld_char_02El2,"22-41'&nbsp;&nbsp;",fld_char_02El3,"42'+&nbsp;&nbsp;")
			 								 	)
			 								);
		 								
		// fld_char_03 //
			fld_char_zero = row.fld_char_03.indexOf("0");
			fld_char_one = row.fld_char_03.indexOf("1");
			fld_char_two = row.fld_char_03.indexOf("2");
			
			var fld_char_03 = $('<span>').append(row.Catamaran+'&nbsp;');
			
			if(fld_char_zero > -1){ check = 'checked'; }else{ check = '';}
			var fld_char_03El1 = $(InputCheckbox).clone().attr({"name":"fld_char_03","value":"0"}).prop({"checked":check})/*,"0-21'&nbsp;&nbsp;"*/;	
			
			if(fld_char_one > -1){ check = 'checked'; }else{ check = '';}
			var fld_char_03El2 = $(InputCheckbox).clone().attr({"name":"fld_char_03","value":"1"}).prop({"checked":check})/*,"22-41'"*/;
			
			if(fld_char_two > -1){ check = 'checked'; }else{ check = '';}
			var fld_char_03El3 = $(InputCheckbox).clone().attr({"name":"fld_char_03","value":"2"}).prop({"checked":check})/*,"42'+&nbsp;&nbsp;"*/;	
			
			var ElevenRow = $(Row).clone().css({"margin-bottom":"10px","margin-left":"15px","margin-right":"15px"}).append(
		 								 		$(col12).clone().append(
			 								 		$(InputG).attr({"id":"fld_char_03"}).clone().append(fld_char_03,fld_char_03El1,"0-21'&nbsp;&nbsp;",fld_char_03El2,"22-41'&nbsp;&nbsp;",fld_char_03El3,"42'+&nbsp;&nbsp;")
			 								 	)
			 								);
			
		//title_04 //
			var FourTitle = $('<div>').attr({"id":"title_04"}).append('<b>'+row.lg_cvskipper_08+'</b>');
			
			var TwelveRow = $(Row).clone().css({"margin-top":"25px","margin-bottom":"10px"}).append(
									 		 $(col12).clone().append(FourTitle)
									 	 );
									 	 
		// Manufacturer, Type, Displacement, Dates_Owned //
			// Manufacturer 
			var lg_cvskipper_09 = $(span2).clone().append(row.lg_cvskipper_09);
			var fld_char_08 = $(InputText).clone().attr({"name":"fld_char_08","value":row.fld_char_08});
			var fld_char_12 = $(InputText).clone().attr({"name":"fld_char_12","value":row.fld_char_12});
			var fld_char_16 = $(InputText).clone().attr({"name":"fld_char_16","value":row.fld_char_16});
		
			// Type
			var lg_bd_title04 = $(span2).clone().append(row.lg_bd_title04);
			var fld_char_09 = $(InputText).clone().attr({"name":"fld_char_09","value":row.fld_char_09});
			var fld_char_13 = $(InputText).clone().attr({"name":"fld_char_13","value":row.fld_char_13});
			var fld_char_17 = $(InputText).clone().attr({"name":"fld_char_17","value":row.fld_char_17});
			
			// Displacement
			var lg_cvskipper_10 = $(span2).clone().append(row.lg_cvskipper_10);
			var fld_char_10 = $(InputText).clone().attr({"name":"fld_char_10","value":row.fld_char_10});
			var fld_char_14 = $(InputText).clone().attr({"name":"fld_char_14","value":row.fld_char_14});
			var fld_char_18 = $(InputText).clone().attr({"name":"fld_char_18","value":row.fld_char_18});
			
			// Dates_Owned
			var lg_cvskipper_11 = $(span2).clone().append(row.lg_cvskipper_11);
			var fld_char_11 = $(InputText).clone().attr({"name":"fld_char_11","value":row.fld_char_11});
			var fld_char_15 = $(InputText).clone().attr({"name":"fld_char_15","value":row.fld_char_15});
			var fld_char_19 = $(InputText).clone().attr({"name":"fld_char_19","value":row.fld_char_19});
			
			var ThirteenRow =  $(Row).clone().css("margin-left","15px").css("margin-right","15px").append(
															$(col3).clone().css("margin-bottom","10px").attr({"id":"Manufacturer"}).append(lg_cvskipper_09,fld_char_08,fld_char_12,fld_char_16),
													 		$(col3).clone().css("margin-bottom","10px").attr({"id":"Type"}).append(lg_bd_title04,fld_char_09,fld_char_13,fld_char_17),
													 		$(col3).clone().css("margin-bottom","10px").attr({"id":"Displacement"}).append(lg_cvskipper_10,fld_char_10,fld_char_14,fld_char_18),
													 		$(col3).clone().css("margin-bottom","10px").attr({"id":"Dates_Owned"}).append(lg_cvskipper_11,fld_char_11,fld_char_15,fld_char_19)
														);
		// fld_char_41 //
			var FifthTitle = $(span).clone().append('<b>'+row.lg_cvskipper_12+'</b>&nbsp;&nbsp;');
			//var FifthTitle = $('<label>').append('<b>'+row.lg_cvskipper_12+'</b>&nbsp;&nbsp;');
			var fld_char_41 = $(InputText).clone().attr({"name":"fld_char_41","value":''+row.fld_char_41+''});
			//var lg_cvskipper_13 = $(span).clone().append('<b>'+row.lg_cvskipper_13+'</b>');
			var lg_cvskipper_13 = $('<label>').css({"color":"red"}).append('<b>'+row.lg_cvskipper_13+'</b>');
			
			var FourteenRow =	$(Row).clone().css({"margin-top":"25px","margin-bottom":"10px"}).append(
													$(col6).clone().append(
				 								 		$(InputG).attr({"id":"fld_char_41"}).clone()
				 								 		.append(FifthTitle,fld_char_41)
				 								 	),
				 								 	$(col6).clone().append(
				 								 		$(InputG).attr({"id":"fld_char_41"}).clone()
				 								 		.append(lg_cvskipper_13)
				 								 	)
				 								);
	
		// Charter_Company, BoatType, Charter_dates, Captain_Crew //
			// Charter_Company 
			var lg_cvskipper_14 = $(span2).clone().append(row.lg_cvskipper_14);
			var fld_char_20 = $(InputText).clone().attr({"name":"fld_char_20","value":row.fld_char_20});
			var fld_char_24 = $(InputText).clone().attr({"name":"fld_char_24","value":row.fld_char_24});
			var fld_char_28 = $(InputText).clone().attr({"name":"fld_char_28","value":row.fld_char_28});
		
			// BoatType
			var BoatType = $(span2).clone().append(row.BoatType);
			var fld_char_21 = $(InputText).clone().attr({"name":"fld_char_21","value":row.fld_char_21});
			var fld_char_25 = $(InputText).clone().attr({"name":"fld_char_25","value":row.fld_char_25});
			var fld_char_29 = $(InputText).clone().attr({"name":"fld_char_29","value":row.fld_char_29});
			
			// Charter_dates
			var lg_charterdates = $(span2).clone().append(row.lg_charterdates);
			var fld_char_22 = $(InputText).clone().attr({"name":"fld_char_22","value":row.fld_char_22});
			var fld_char_26 = $(InputText).clone().attr({"name":"fld_char_26","value":row.fld_char_26});
			var fld_char_30 = $(InputText).clone().attr({"name":"fld_char_30","value":row.fld_char_30});
			
			// Captain_Crew
			var lg_cvskipper_15 = $(span2).clone().append(row.lg_cvskipper_15);
			var fld_char_23 = $(InputText).clone().attr({"name":"fld_char_23","value":row.fld_char_23});
			var fld_char_27 = $(InputText).clone().attr({"name":"fld_char_27","value":row.fld_char_27});
			var fld_char_31 = $(InputText).clone().attr({"name":"fld_char_31","value":row.fld_char_31});
			
			var FifthteenRow =  $(Row).clone().css({"margin-bottom":"10px","margin-left":"15px","margin-right":"15px"}).append(
															$(col3).clone().css({"margin-bottom":"10px"}).attr({"id":"Charter_Company"}).append(lg_cvskipper_14,fld_char_20,fld_char_24,fld_char_28),
													 		$(col3).clone().css({"margin-bottom":"10px"}).attr({"id":"BoatType"}).append(BoatType,fld_char_21,fld_char_25,fld_char_29),
													 		$(col3).clone().css({"margin-bottom":"10px"}).attr({"id":"Charter_dates"}).append(lg_charterdates,fld_char_22,fld_char_26,fld_char_30),
													 		$(col3).clone().css({"margin-bottom":"10px"}).attr({"id":"Captain_Crew"}).append(lg_cvskipper_15,fld_char_23,fld_char_27,fld_char_31)
														);
			
		// fld_char_32, fld_char_33 //
			var str = "[113][156]";
		  var id_country_con = str.indexOf(droits.id_country);
			if (id_country_con > 0 ){
				var fld_char_32 = $(span).clone().append('<b>'+row.lg_cvskipper_26+'</b>&nbsp;');
				var fld_char_32El = $(InputText).clone().attr({"name":"fld_char_32","value":''+row.fld_char_32+''});
				
				var fld_char_33 = $(span).clone().append('<b>'+row.lg_cvskipper_27+'</b>&nbsp;');
				var fld_char_33El = $(InputText).clone().attr({"name":"fld_char_33","value":''+row.fld_char_33+''});
				
				var Chesapeake = $(Row).clone().css({"margin-top":"25px","margin-bottom":"10px"}).append(
											 		 $(col6).clone().append(
											 		 	$(InputG).clone().css({"margin-bottom":"10px"}).attr({"id":"fld_char_32"}).append(fld_char_32,fld_char_32El)
											 		 ),
											 		 $(col6).clone().append(
											 		 	$(InputG).clone().css({"margin-bottom":"10px"}).attr({"id":"fld_char_33"}).append(fld_char_33,fld_char_33El)
											 		 )
											 	 );
			}	
			
		//title_06 //
			var SixTitle = $('<div>').attr({"id":"title_06"}).append('<b>'+row.lg_exp_nautique+'</b>');
			
			var SixteenRow = $(Row).clone().css("margin-top","25px").append(
									 		 $(col12).clone().append(SixTitle)
									 	 );
									 	 
		//title_07 //
			var SevenTitle = $('<div>').attr({"id":"title_07"}).append('<b>'+row.lg_cvskipper_16+'</b>');
			
			var SeventeenRow = $(Row).clone().css({"margin-top":"25px","margin-bottom":"10px"}).append(
									 		 $(col12).clone().append(SevenTitle)
									 	 );
		
		// fld_char_04 //
			var fld_char_three ='';
			var fld_char_four ='';
				fld_char_zero = row.fld_char_04.indexOf("0");
				fld_char_one = row.fld_char_04.indexOf("1");
				fld_char_two = row.fld_char_04.indexOf("2");
				fld_char_three = row.fld_char_04.indexOf("3");
				fld_char_four = row.fld_char_04.indexOf("4");
				
				var fld_char_04 = $('<span>').append(row.lg_cvskipper_17+'&nbsp;');
				
				if(fld_char_zero > -1){ check = 'checked'; }else{ check = '';}
				var fld_char_04El1 = $(InputCheckbox).clone().attr({"name":"fld_char_04","value":"0"}).prop({"checked":check});	
				
				if(fld_char_one > -1){ check = 'checked'; }else{ check = '';}
				var fld_char_04El2 = $(InputCheckbox).clone().attr({"name":"fld_char_04","value":"1"}).prop({"checked":check});
				
				if(fld_char_two > -1){ check = 'checked'; }else{ check = '';}
				var fld_char_04El3 = $(InputCheckbox).clone().attr({"name":"fld_char_04","value":"2"}).prop({"checked":check});	
				
				if(fld_char_three > -1){ check = 'checked'; }else{ check = '';}
				var fld_char_04El4 = $(InputCheckbox).clone().attr({"name":"fld_char_04","value":"3"}).prop({"checked":check});	
				
				if(fld_char_four > -1){ check = 'checked'; }else{ check = '';}
				var fld_char_04El5 = $(InputCheckbox).clone().attr({"name":"fld_char_04","value":"4"}).prop({"checked":check});	
				
				var EightteenRow = $(Row).clone().css({"margin-bottom":"10px","margin-left":"15px","margin-right":"15px"}).append(
			 								 		$(col12).clone().append(
				 								 		$(InputG).attr({"id":"fld_char_04"}).clone().append(fld_char_04,fld_char_04El1,row.lg_cvskipper_19,'&nbsp;',fld_char_04El2,row.lg_cvskipper_20,'&nbsp;',fld_char_04El3,row.lg_cvskipper_21,'&nbsp;',fld_char_04El4,row.lg_cvskipper_22,'&nbsp;',fld_char_04El5,row.lg_cvskipper_23)
				 								 	)
				 								);
			 								
		// fld_char_05 //
			fld_char_zero = row.fld_char_05.indexOf("0");
			fld_char_one = row.fld_char_05.indexOf("1");
			fld_char_two = row.fld_char_05.indexOf("2");
			fld_char_three = row.fld_char_05.indexOf("3");
			fld_char_four = row.fld_char_05.indexOf("4");
			
			var fld_char_05 = $('<span>').append(row.lg_cvskipper_18+'&nbsp;');
			
			if(fld_char_zero > -1){ check = 'checked'; }else{ check = '';}
			var fld_char_05El1 = $(InputCheckbox).clone().attr({"name":"fld_char_05","value":"0"}).prop({"checked":check});	
			
			if(fld_char_one > -1){ check = 'checked'; }else{ check = '';}
			var fld_char_05El2 = $(InputCheckbox).clone().attr({"name":"fld_char_05","value":"1"}).prop({"checked":check});
			
			if(fld_char_two > -1){ check = 'checked'; }else{ check = '';}
			var fld_char_05El3 = $(InputCheckbox).clone().attr({"name":"fld_char_05","value":"2"}).prop({"checked":check});	
			
			if(fld_char_three > -1){ check = 'checked'; }else{ check = '';}
			var fld_char_05El4 = $(InputCheckbox).clone().attr({"name":"fld_char_05","value":"3"}).prop({"checked":check});	
			
			if(fld_char_four > -1){ check = 'checked'; }else{ check = '';}
			var fld_char_05El5 = $(InputCheckbox).clone().attr({"name":"fld_char_05","value":"4"}).prop({"checked":check});	
			
			var NineteenRow = $(Row).clone().css({"margin-bottom":"10px","margin-left":"15px","margin-right":"15px"}).append(
		 								 		$(col12).clone().append(
			 								 		$(InputG).attr({"id":"fld_char_05"}).clone().append(fld_char_05,fld_char_05El1,row.lg_cvskipper_19,'&nbsp;',fld_char_05El2,row.lg_cvskipper_20,'&nbsp;',fld_char_05El3,row.lg_cvskipper_21,'&nbsp;',fld_char_05El4,row.lg_cvskipper_22,'&nbsp;',fld_char_05El5,row.lg_cvskipper_23)
			 								 	)
			 								);
			 								
		//title_08 //
			var EightTitle = $('<div>').attr({"id":"title_08"}).append('<b>'+row.lg_cvskipper_24+'</b>');
			
			var TwentyRow = $(Row).clone().css({"margin-top":"25px","margin-bottom":"10px"}).append(
									 		 $(col12).clone().append(EightTitle)
									 	 );
									 	 
		// fld_text_01 //
			var fld_text_01El = $(InputTextarea).clone().attr({"name":"fld_text_01","value":row.fld_text_01}).append(row.fld_text_01);
			var TwentyOneRow = $(Row).clone().css({"margin-bottom":"10px","margin-left":"15px","margin-right":"15px"}).append(
												 		$(col12).clone().append(fld_text_01El)
												 );
		
		//title_09 //
			var NineTitle = $('<div>').attr({"id":"title_09"}).append('<b>'+row.lg_cvskipper_25+'</b>');
			
			var TwentyTwoRow = $(Row).clone().css({"margin-top":"25px","margin-bottom":"10px"}).append(
									 		 		$(col12).clone().append(NineTitle)
									 		 );
		// Nom, lg_tel, lg_email//
			// Nom 
			var Nom = $(span2).clone().append(row.Nom);
			var fld_char_34 = $(InputText).clone().attr({"name":"fld_char_34","value":row.fld_char_34});
			var fld_char_37 = $(InputText).clone().attr({"name":"fld_char_37","value":row.fld_char_37});
		
			// Tel
			var lg_tel = $(span2).clone().append(row.lg_tel);
			var fld_char_35 = $(InputText).clone().attr({"name":"fld_char_35","value":row.fld_char_35});
			var fld_char_38 = $(InputText).clone().attr({"name":"fld_char_38","value":row.fld_char_38});
			
			// Email
			var lg_email = $(span2).clone().append(row.lg_email);
			var fld_char_36 = $(InputText).clone().attr({"name":"fld_char_36","value":row.fld_char_36});
			var fld_char_39 = $(InputText).clone().attr({"name":"fld_char_39","value":row.fld_char_39});
			
			var TwentyThreeRow =  $(Row).clone().css({"margin-bottom":"10px","margin-left":"15px","margin-right":"15px"}).append(
															$(col4).clone().css({"margin-bottom":"10px"}).attr({"id":"Nom"}).append(Nom,fld_char_34,fld_char_37),
													 		$(col4).clone().css({"margin-bottom":"10px"}).attr({"id":"Tel"}).append(lg_tel,fld_char_35,fld_char_38),
													 		$(col4).clone().css({"margin-bottom":"10px"}).attr({"id":"Email"}).append(lg_email,fld_char_36,fld_char_39)
														);
	
		//Before Append// 									
			var BoatHistory = $(Row).clone()
												.append(
													$(col12).clone().append(
														FirstRow,SecondRow,ThirdRow,FourthRow
														,FifthRow,SixRow,SevenRow,EightRow,NineRow
														,TenRow,ElevenRow,TwelveRow,ThirteenRow
														,FourteenRow,FifthteenRow,Chesapeake,SixteenRow
														,SeventeenRow,EightteenRow,NineteenRow
														,TwentyRow,TwentyOneRow,TwentyTwoRow,TwentyThreeRow
													)
												);
			
	}
	else if (condition_03=='TRUE' || condition_04 > 0){
		bh_tab = 2;
		var selected;
		// title //
			var Title = $('<div>').attr({"id":"title"}).append('<b>'+row.lg_cvskipper_28+'</b>');
			
			var FirstRow = $(Row2).clone().css("margin-top","25px").append(
									 		 $(col12).clone().append(Title)
									 	 );
			
		// fld_int_01 //
			var lg_cvskipper_29 = $(span).clone().append(row.lg_cvskipper_29);
			var fld_int_01 = '<select name="fld_int_01" class="form-control boating-history">';
											for (i = 0; i < 100; i++) { 
												((row.fld_int_01==i) ? selected = "selected" : selected = '')
												fld_int_01 += '<option value="'+i+'"'+selected+'>'+i+'</option>';
											}
					fld_int_01 += '</select>';
		
		// fld_int_02 //
			var lg_cvskipper_30 = $(span).clone().append(row.lg_cvskipper_30);
			var fld_int_02 = '<select name="fld_int_02" class="form-control boating-history">';
											for (i = 0; i < 100; i++) { 
												((row.fld_int_02==i) ? selected = "selected" : selected = '')
												fld_int_02 += '<option value="'+i+'"'+selected+'>'+i+'</option>';
											}
					fld_int_02 += '</select>';

		
			var SecondRow = $(Row2).clone().append(
											 	$(col6).clone().append(
											 		$(InputG).clone().css("margin-top","10px").attr({"id":"fld_int_01"}).append(lg_cvskipper_29,fld_int_01)
											 	),
											 	$(col6).clone().append(
												 	$(InputG).clone().css("margin-top","10px").attr({"id":"fld_int_02"}).append(lg_cvskipper_30,fld_int_02)
												)
										 	);

		// fld_int_03 //
			var lg_cvskipper_31 = $(span).clone().append(row.lg_cvskipper_31);
			var fld_int_03 = '<select name="fld_int_03" class="form-control boating-history">';
											for (i = 0; i < 100; i++) { 
												((row.fld_int_03==i) ? selected = "selected" : selected = '')
												fld_int_03 += '<option value="'+i+'"'+selected+'>'+i+'</option>';
											}
					fld_int_03 += '</select>';
			
		// fld_int_04 //
			var lg_cvskipper_32 = $(span).clone().append(row.lg_cvskipper_32);
			var fld_int_04 = '<select name="fld_int_04" class="form-control boating-history">';
											for (i = 0; i < 100; i++) { 
												((row.fld_int_04==i) ? selected = "selected" : selected = '')
												fld_int_04 += '<option value="'+i+'"'+selected+'>'+i+'</option>';
											}
					fld_int_04 += '</select>';
			
			var ThirdRow = $(Row2).clone().append(
											 	$(col6).clone().append(
											 		$(InputG).clone().css("margin-top","10px").attr({"id":"fld_int_03"}).append(lg_cvskipper_31,fld_int_03)
											 	),
											 	$(col6).clone().append(
												 	$(InputG).clone().css("margin-top","10px").attr({"id":"fld_int_04"}).append(lg_cvskipper_32,fld_int_04)
												)
										 	);

		// fld_char_01 //
			var lg_cvskipper_33 = $(span).clone().append(row.lg_cvskipper_33);
			var fld_char_01 = '<select name="fld_char_01" class="form-control boating-history">';
											for (i = 0; i < 100; i++) { 
												((row.fld_char_01==i) ? selected = "selected" : selected = '')
												fld_char_01 += '<option value="'+i+'"'+selected+'>'+i+'</option>';
											}
					fld_char_01 += '</select>';
			
		// fld_char_02 //
			var lg_cvskipper_34 = $(span).clone().append(row.lg_cvskipper_34);
			var fld_char_02 = '<select name="fld_char_02" class="form-control boating-history">';
											for (i = 0; i < 100; i++) { 
												((row.fld_char_02==i) ? selected = "selected" : selected = '')
												fld_char_02 += '<option value="'+i+'"'+selected+'>'+i+'</option>';
											}
					fld_char_02 += '</select>';
			
			var FourthRow = $(Row2).clone().append(
											 	$(col6).clone().append(
											 		$(InputG).clone().css("margin-top","10px").attr({"id":"fld_char_01"}).append(lg_cvskipper_33,fld_char_01)
											 	),
											 	$(col6).clone().append(
												 	$(InputG).clone().css("margin-top","10px").attr({"id":"fld_char_02"}).append(lg_cvskipper_34,fld_char_02)
												)
										 	);
										 	
		// fld_char_03 //
			var lg_cvskipper_35 = $(span).clone().append(row.lg_cvskipper_35);
			var fld_char_03 = '<select name="fld_char_03" class="form-control boating-history">';
											for (i = 0; i < 100; i++) { 
												((row.fld_char_03==i) ? selected = "selected" : selected = '')
												fld_char_03 += '<option value="'+i+'"'+selected+'>'+i+'</option>';
											}
					fld_char_03 += '</select>';
			
		// fld_char_04 //
			var lg_cvskipper_36 = $(span).clone().append(row.lg_cvskipper_36);
			var fld_char_04 = '<select name="fld_char_04" class="form-control boating-history">';
											for (i = 0; i < 100; i++) {
												((row.fld_char_04==i) ? selected = "selected" : selected = '')
												fld_char_04 += '<option value="'+i+'"'+selected+'>'+i+'</option>';
											}
					fld_char_04 += '</select>';
			
			var FifthRow = $(Row2).clone().append(
											 	$(col6).clone().append(
											 		$(InputG).clone().css("margin-top","10px").attr({"id":"fld_char_03"}).append(lg_cvskipper_35,fld_char_03)
											 	),
											 	$(col6).clone().append(
												 	$(InputG).clone().css("margin-top","10px").attr({"id":"fld_char_04"}).append(lg_cvskipper_36,fld_char_04)
												)
										 	);
										 	
		// fld_char_05 //
			var lg_cvskipper_37 = $(span).clone().append(row.lg_cvskipper_37);
			var fld_char_05 = '<select name="fld_char_05" class="form-control boating-history">';
											for (i = 0; i < 100; i++) { 
												((row.fld_char_05==i) ? selected = "selected" : selected = '')
												fld_char_05 += '<option value="'+i+'"'+selected+'>'+i+'</option>';
											}
					fld_char_05 += '</select>';
			
		// fld_char_06 //
			var lg_cvskipper_38 = $(span).clone().append(row.lg_cvskipper_38);
			var fld_char_06 = '<select name="fld_char_06" class="form-control boating-history">';
											for (i = 0; i < 100; i++) { 
												((row.fld_char_06==i) ? selected = "selected" : selected = '')
												fld_char_06 += '<option value="'+i+'"'+selected+'>'+i+'</option>';
											}
					fld_char_06 += '</select>';
			
			var SixRow = $(Row2).clone().append(
											 	$(col6).clone().append(
											 		$(InputG).clone().css("margin-top","10px").attr({"id":"fld_char_05"}).append(lg_cvskipper_37,fld_char_05)
											 	),
											 	$(col6).clone().append(
												 	$(InputG).clone().css("margin-top","10px").attr({"id":"fld_char_06"}).append(lg_cvskipper_38,fld_char_06)
												)
										 	);
										 	
		// fld_char_07 //
			var lg_cvskipper_39 = $(span).clone().append(row.lg_cvskipper_39);
			var fld_char_07 = '<select name="fld_char_07" class="form-control boating-history">';
											for (i = 0; i < 100; i++) { 
												((row.fld_char_07==i) ? selected = "selected" : selected = '')
												fld_char_07 += '<option value="'+i+'"'+selected+'>'+i+'</option>';
											}
					fld_char_07 += '</select>';
			
		// fld_char_08 //
			var lg_cvskipper_40 = $(span).clone().append(row.lg_cvskipper_40);
			var fld_char_08 = '<select name="fld_char_08" class="form-control boating-history">';
											for (i = 0; i < 100; i++) { 
												((row.fld_char_08==i) ? selected = "selected" : selected = '')
												fld_char_08 += '<option value="'+i+'"'+selected+'>'+i+'</option>';
											}
					fld_char_08 += '</select>';
			
			var SevenRow = $(Row2).clone().append(
											 	$(col6).clone().append(
											 		$(InputG).clone().css("margin-top","10px").attr({"id":"fld_char_07"}).append(lg_cvskipper_39,fld_char_07)
											 	),
											 	$(col6).clone().append(
												 	$(InputG).clone().css("margin-top","10px").attr({"id":"fld_char_08"}).append(lg_cvskipper_40,fld_char_08)
												)
										 	);
										 	
		// fld_char_09 //
			var lg_cvskipper_41 = $(span).clone().append(row.lg_cvskipper_41);
			var fld_char_09 = '<select name="fld_char_09" class="form-control boating-history">';
											for (i = 0; i < 100; i++) { 
												((row.fld_char_09==i) ? selected = "selected" : selected = '')
												fld_char_09 += '<option value="'+i+'"'+selected+'>'+i+'</option>';
											}
					fld_char_09 += '</select>';
			
		// fld_char_10 //
			var lg_cvskipper_42 = $(span).clone().append(row.lg_cvskipper_42);
			var fld_char_10 = '<select name="fld_char_10" class="form-control boating-history">';
											for (i = 0; i < 100; i++) { 
												((row.fld_char_10==i) ? selected = "selected" : selected = '')
												fld_char_10 += '<option value="'+i+'"'+selected+'>'+i+'</option>';
											}
					fld_char_10 += '</select>';
			
			var EightRow = $(Row2).clone().append(
											 	$(col6).clone().append(
											 		$(InputG).clone().css("margin-top","10px").attr({"id":"fld_char_09"}).append(lg_cvskipper_41,fld_char_09)
											 	),
											 	$(col6).clone().append(
												 	$(InputG).clone().css("margin-top","10px").attr({"id":"fld_char_10"}).append(lg_cvskipper_42,fld_char_10)
												)
										 	);

		// Year, Yacht_type, As_skipper, Area //
			// Year 
			var Annee = $(span2).clone().append(row.Annee);
			var fld_char_11 = $(InputText).clone().attr({"name":"fld_char_11","value":row.fld_char_11});
			var fld_char_15 = $(InputText).clone().attr({"name":"fld_char_15","value":row.fld_char_15});
			var fld_char_19 = $(InputText).clone().attr({"name":"fld_char_19","value":row.fld_char_19});
		
			// Yacht type
			var lg_cvskipper_43 = $(span2).clone().append(row.lg_cvskipper_43);
			var fld_char_12 = $(InputText).clone().attr({"name":"fld_char_12","value":row.fld_char_12});
			var fld_char_16 = $(InputText).clone().attr({"name":"fld_char_16","value":row.fld_char_16});
			var fld_char_20 = $(InputText).clone().attr({"name":"fld_char_20","value":row.fld_char_20});
			
			// As_skipper
			var lg_cvskipper_44 = $(span2).clone().append(row.lg_cvskipper_44);
			var fld_char_13 = $(InputText).clone().attr({"name":"fld_char_13","value":row.fld_char_13});
			var fld_char_17 = $(InputText).clone().attr({"name":"fld_char_17","value":row.fld_char_17});
			var fld_char_21 = $(InputText).clone().attr({"name":"fld_char_21","value":row.fld_char_21});
			
			// Area
			var lg_cvskipper_45 = $(span2).clone().append(row.lg_cvskipper_45);
			var fld_char_14 = $(InputText).clone().attr({"name":"fld_char_14","value":row.fld_char_14});
			var fld_char_18 = $(InputText).clone().attr({"name":"fld_char_18","value":row.fld_char_18});
			var fld_char_22 = $(InputText).clone().attr({"name":"fld_char_22","value":row.fld_char_22});
			
			var NineRow =  $(Row2).clone().append(
															$(col3).clone().attr({"id":"Year"}).css("margin-top","10px").append(Annee,fld_char_11,fld_char_15,fld_char_19),
													 		$(col3).clone().attr({"id":"Yacht_type"}).css("margin-top","10px").append(lg_cvskipper_43,fld_char_12,fld_char_16,fld_char_20),
													 		$(col3).clone().attr({"id":"As_skipper"}).css("margin-top","10px").append(lg_cvskipper_44,fld_char_13,fld_char_17,fld_char_21),
													 		$(col3).clone().attr({"id":"Area"}).css("margin-top","10px").append(lg_cvskipper_45,fld_char_14,fld_char_18,fld_char_22)
														);

		//Before Append// 									
			var BoatHistory = $(Row).clone()
												.append(
													$(col12).clone().append(
														FirstRow,SecondRow,ThirdRow,FourthRow
														,FifthRow,SixRow,SevenRow,EightRow,NineRow
													)
												);
											
	}
	else if (condition_05=='TRUE' || condition_06 > 0){
		bh_tab = 3;
		dis_nb = false;
		if (condition_07=='TRUE'){ dis_nb = true; }
		
		// vc_chp_01
			if (dis_nb){ number = "1."; }
			var lg_cvskipper_46 = $('<span>').append('<b>'+number+row.lg_cvskipper_46+'</b>&nbsp;');
			
			((row.vc_chp_01=="yes") ? check="checked" : check='')
			var vc_chp_01El1 = $('<label>').append(
														$(InputRadio).clone().attr({"name":"vc_chp_01","value":"yes"}).prop({"checked":check}),'&nbsp;'+row.lg_ye+'&nbsp;'
												 );
												 
			((row.vc_chp_01=="no") ? check="checked" : check='')
			var vc_chp_01El2 = $('<label>').append(
														$(InputRadio).clone().attr({"name":"vc_chp_01","value":"no"}).prop({"checked":check}),'&nbsp;'+row.lg_no+''
											 	 );
											 	 
			var FirstRow = $(Row2).clone().css("margin-top","25px").append(
			 								 	$(col12).clone().append(
			 								 		$(InputG).clone().attr("id","vc_chp_01").append(lg_cvskipper_46,vc_chp_01El1,vc_chp_01El2)
			 								 	)
										 );
		
		// row_vc_chp_01
			var lg_cvskipper_47 = $('<div>').append(row.lg_cvskipper_47);
			var vc_chp_02 = $(InputTextarea).clone().attr({"name":"vc_chp_02"});
			
			
			var text_vc_chp_02 = $(Row).clone().append(
													 		$(col12).clone().append(lg_cvskipper_47)
													 );
			var El_vc_chp_02 = $(Row).clone().append(
													 	$(col12).clone().append(vc_chp_02.append(row.vc_chp_02))
												 );
			if(row.vc_chp_01=='yes'){
				 var SecondRow = $(Row).clone().attr("id","row_vc_chp_01").css({"margin-left":"25px"}).css({"margin-right":"25px"}).append(
												$(col12).clone().append(text_vc_chp_02,El_vc_chp_02)
											).show(); 
			}else{ 
				var SecondRow = $(Row).clone().attr("id","row_vc_chp_01").css({"margin-left":"25px"}).css({"margin-right":"25px"}).append(
												$(col12).clone().append(text_vc_chp_02,El_vc_chp_02)
											).hide();
			}
			

		// vc_chp_03
			if (dis_nb){ number = "2."; }
			var lg_cvskipper_48 = $('<span>').append('<b>'+number+row.lg_cvskipper_48+'</b>&nbsp;');
			
			((row.vc_chp_03=="yes") ? check="checked" : check='')
			var vc_chp_03El1 = $('<label>').append(
														$(InputRadio).clone().attr({"name":"vc_chp_03","value":"yes"}).prop({"checked":check}),'&nbsp;'+row.lg_ye+'&nbsp;'
												 );
												 
			((row.vc_chp_03=="no") ? check="checked" : check='')
			var vc_chp_03El2 = $('<label>').append(
														$(InputRadio).clone().attr({"name":"vc_chp_03","value":"no"}).prop({"checked":check}),'&nbsp;'+row.lg_no+''
											 	 );
											 	 
			var ThirdRow = $(Row).clone().append(
			 								 	$(col12).clone().append(
			 								 		$(InputG).clone().attr("id","vc_chp_03").append(lg_cvskipper_48,vc_chp_03El1,vc_chp_03El2)
			 								 	)
										 );
									 
		// vc_chp_04
			if (dis_nb){ number = "3."; }
			var lg_cvskipper_49 = $('<div>').append('<b>'+number+row.lg_cvskipper_49+'</b>');
			var vc_chp_04 = $(InputTextarea).clone().attr({"name":"vc_chp_04"});
			
			var text_vc_chp_04 = $(Row).clone().append(
													 		$(col12).clone().append(lg_cvskipper_49)
													 );
			var El_vc_chp_04 = $(Row).clone().css({"margin-left":"25px"}).css({"margin-right":"25px"}).append(
													 	$(col12).clone().append(vc_chp_04.append(row.vc_chp_04))
												 );
			
			var FourthRow = $(Row).clone().append(
												$(col12).clone().attr("id","vc_chp_04").append(text_vc_chp_04,El_vc_chp_04)
											);
											
		// vc_chp_05
			if (dis_nb){ number = "4."; }
			var lg_cvskipper_50 = $('<span>').append('<b>'+number+row.lg_cvskipper_50+'</b>&nbsp;');
			
			((row.vc_chp_05=="yes") ? check="checked" : check='')
			var vc_chp_05El1 = $('<label>').append(
														$(InputRadio).clone().attr({"name":"vc_chp_05","value":"yes"}).prop({"checked":check}),'&nbsp;'+row.lg_ye+'&nbsp;'
												 );
												 
			((row.vc_chp_05=="no") ? check="checked" : check='')
			var vc_chp_05El2 = $('<label>').append(
														$(InputRadio).clone().attr({"name":"vc_chp_05","value":"no"}).prop({"checked":check}),'&nbsp;'+row.lg_no+''
											 	 );
											 	 
			var FifthRow = $(Row2).clone().append(
			 								 	$(col12).clone().append(
			 								 		$(InputG).clone().attr("id","vc_chp_05").append(lg_cvskipper_50,vc_chp_05El1,vc_chp_05El2)
			 								 	)
										 );
											
		// row_vc_chp_05
			var lg_cvskipper_51 = $('<div>').append(row.lg_cvskipper_51);
			var vc_chp_06 = $(InputTextarea).clone().attr({"name":"vc_chp_06"});
			
			if(row.vc_chp_05=='yes'){ display = '' }else{ display = 'none' }
			var text_vc_chp_06 = $(Row).clone().append(
													 		$(col12).clone().append(lg_cvskipper_51)
													 );
			var El_vc_chp_06 = $(Row).clone().append(
													 	$(col12).clone().append(vc_chp_06.append(row.vc_chp_06))
												 );
												 
			if(row.vc_chp_05=='yes'){
				 var SixRow = $(Row).clone().attr("id","row_vc_chp_05").css({"margin-left":"25px"}).css({"margin-right":"25px"}).append(
												$(col12).clone().append(text_vc_chp_06,El_vc_chp_06)
											).show();
			}else{ 
				var SixRow = $(Row).clone().attr("id","row_vc_chp_05").css({"margin-left":"25px"}).css({"margin-right":"25px"}).append(
												$(col12).clone().append(text_vc_chp_06,El_vc_chp_06)
											).hide();
			}
			
											
		// vc_chp_12
			if (dis_nb){ number = "5."; }
			var lg_cvskipper_52 = $('<div>').append('<b>'+number+row.lg_cvskipper_52+'</b>');
			var vc_chp_12 = $(InputTextarea).clone().attr({"name":"vc_chp_12"});
			
			var text_vc_chp_12 = $(Row).clone().append(
													 		$(col12).clone().append(lg_cvskipper_52)
													 );
			var El_vc_chp_12 = $(Row).clone().css({"margin-left":"25px"}).css({"margin-right":"25px"}).append(
													 	$(col12).clone().append(vc_chp_12.append(row.vc_chp_12))
												 );
			
			var SevenRow = $(Row).clone().append(
												$(col12).clone().attr("id","vc_chp_12").append(text_vc_chp_12,El_vc_chp_12)
											);

		// vc_chp_07
			if (dis_nb){ number = "6."; }
			var lg_cvskipper_53 = $('<span>').append('<b>'+number+row.lg_cvskipper_53+'</b>&nbsp;');
			
			((row.vc_chp_07=="yes") ? check="checked" : check='')
			var vc_chp_07El1 = $('<label>').append(
														$(InputRadio).clone().attr({"name":"vc_chp_07","value":"yes"}).prop({"checked":check}),'&nbsp;'+row.lg_ye+'&nbsp;'
												 );
												 
			((row.vc_chp_07=="no") ? check="checked" : check='')
			var vc_chp_07El2 = $('<label>').append(
														$(InputRadio).clone().attr({"name":"vc_chp_07","value":"no"}).prop({"checked":check}),'&nbsp;'+row.lg_no+''
											 	 );
											 	 
			var EightRow = $(Row2).clone().append(
			 								 	$(col12).clone().append(
			 								 		$(InputG).clone().attr("id","vc_chp_07").append(lg_cvskipper_53,vc_chp_07El1,vc_chp_07El2)
			 								 	)
										 );

		// row_vc_chp_07
			var lg_cvskipper_51 = $('<div>').append(row.lg_cvskipper_51);
			var vc_chp_08 = $(InputTextarea).clone().attr({"name":"vc_chp_08"});
			
			
			var text_vc_chp_08 = $(Row).clone().append(
													 		$(col12).clone().append(lg_cvskipper_51)
													 );
			var El_vc_chp_08 = $(Row).clone().append(
													 	$(col12).clone().append(vc_chp_08.append(row.vc_chp_08))
												 );
			
			if(row.vc_chp_07=='yes'){ 
				var NineRow = $(Row).clone().attr("id","row_vc_chp_07").css({"margin-left":"25px"}).css({"margin-right":"25px"}).css({"display":display}).append(
												$(col12).clone().append(text_vc_chp_08,El_vc_chp_08)
											).show();
			}else{ 
				var NineRow = $(Row).clone().attr("id","row_vc_chp_07").css({"margin-left":"25px"}).css({"margin-right":"25px"}).css({"display":display}).append(
												$(col12).clone().append(text_vc_chp_08,El_vc_chp_08)
											).hide(); 
			}
			

		// vc_chp_09
			if (dis_nb){ number = "7."; }
			var lg_cvskipper_54 = $('<span>').append('<b>'+number+row.lg_cvskipper_54+'</b>&nbsp;');
			
			((row.vc_chp_09=="yes") ? check="checked" : check='')
			var vc_chp_09El1 = $('<label>').append(
														$(InputRadio).clone().attr({"name":"vc_chp_09","value":"yes"}).prop({"checked":check}),'&nbsp;'+row.lg_ye+'&nbsp;'
												 );
												 
			((row.vc_chp_09=="no") ? check="checked" : check='')
			var vc_chp_09El2 = $('<label>').append(
														$(InputRadio).clone().attr({"name":"vc_chp_09","value":"no"}).prop({"checked":check}),'&nbsp;'+row.lg_no+''
											 	 );
											 	 
			var TenRow = $(Row2).clone().append(
			 								 	$(col12).clone().append(
			 								 		$(InputG).clone().attr("id","vc_chp_09").append(lg_cvskipper_54,vc_chp_09El1,vc_chp_09El2)
			 								 	)
										 );

		// row_vc_chp_09
			var lg_cvskipper_55 = $('<div>').append(row.lg_cvskipper_55);
			var vc_chp_10 = $(InputTextarea).clone().attr({"name":"vc_chp_10"});
			
			
			var text_vc_chp_10 = $(Row).clone().append(
													 		$(col12).clone().append(lg_cvskipper_55)
													 );
			var El_vc_chp_10 = $(Row).clone().append(
													 	$(col12).clone().append(vc_chp_10.append(row.vc_chp_10))
												 );
			
			if(row.vc_chp_09=='yes'){ 
				var ElevenRow = $(Row).clone().attr("id","row_vc_chp_09").css({"margin-left":"25px"}).css({"margin-right":"25px"}).css({"display":display}).append(
												$(col12).clone().append(text_vc_chp_10,El_vc_chp_10)
											).show();
			}else{
				var ElevenRow = $(Row).clone().attr("id","row_vc_chp_09").css({"margin-left":"25px"}).css({"margin-right":"25px"}).css({"display":display}).append(
												$(col12).clone().append(text_vc_chp_10,El_vc_chp_10)
											).hide();
			}
			

		//vc_chp_11
			if (dis_nb){ number = "8."; }
			var lg_cvskipper_56 = $('<span>').append('<b>'+number+row.lg_cvskipper_56+'</b>&nbsp;');
			
			((row.vc_chp_11=="yes") ? check="checked" : check='')
			var vc_chp_11El1 = $('<label>').append(
														$(InputRadio).clone().attr({"name":"vc_chp_11","value":"yes"}).prop({"checked":check}),'&nbsp;'+row.lg_ye+'&nbsp;'
												 );
												 
			((row.vc_chp_11=="no") ? check="checked" : check='')
			var vc_chp_11El2 = $('<label>').append(
														$(InputRadio).clone().attr({"name":"vc_chp_11","value":"no"}).prop({"checked":check}),'&nbsp;'+row.lg_no+''
											 	 );
											 	 
			var TwelveRow = $(Row2).clone().append(
			 								 	$(col12).clone().append(
			 								 		$(InputG).clone().attr("id","vc_chp_11").append(lg_cvskipper_56,vc_chp_11El1,vc_chp_11El2)
			 								 	)
										 );

		//Before Append// 									
			var BoatHistory = $(Row).clone()
												.append(
													$(col12).clone().append(
														FirstRow,SecondRow,ThirdRow,FourthRow
														,FifthRow,SixRow,SevenRow,EightRow,NineRow
														,TenRow,ElevenRow,TwelveRow
													)
												);
	}
	else{
		bh_tab = '';
		$('#BH').hide();
		$('#myTab li a[href="#BH"]').hide();
	}
		var btn_import = '<button type="button" class="btn btn-primary" id="ImportBH"><i class="fa fa-download"></i>'+row.lg_boatinghistory_import+'</button>';
	// append //
		$('#BoatHistory').append(BoatHistory); //Append On Page
		$('#Import_BH').html(btn_import);
}

function CoSkipperInfo(state,country,con1,con2){
	var disable = row.disabled;
	var InputRadio = $('<input>').attr({type:"radio"}).addClass("co-skipper");
	var InputText = $('<input>').attr({type:"text"}).addClass('form-control boxtext co-skipper');
	var InputTextarea = $('<textarea>').attr({"rows":"5"}).addClass('form-control co-skipper').css({"resize":"none"});
	var InputCheckbox = $('<input>').attr({type:"checkbox"}).addClass('co-skipper');
	var Row = $('<div>').addClass('row').css({"margin-bottom":"10px"});
	var col2 = $('<div>').addClass('col-lg-2 col-md-2 col-sm-6 col-xs-6');
	var col3 = $('<div>').addClass('col-lg-3 col-md-3 col-sm-6 col-xs-6');
	var col4 = $('<div>').addClass('col-lg-4 col-md-4 col-sm-6 col-xs-6');
	var col6 = $('<div>').addClass('col-lg-6 col-md-6 col-sm-6 col-xs-6');
	var col12 = $('<div>').addClass('col-lg-12 col-md-12 col-sm-12 col-xs-12');	
	var InputG = $('<div>').addClass('input-group');
	var span = $('<span>').addClass('input-group-addon');
	var span2 = $('<span>').addClass('input-group-addon2');
	
	if(droits.catamaran_fleet){
		//txt_01
		var txt_01 = "We will require suitable prior SKIPPERING experience on a COMPARABLY SIZE VESSEL (e.g same size or bigger vessel as the one you wish to charter) and for a COMPARABLE  journey <br>(ex: more than a couple continuous days/nights skippering experience); skippering experience on a smaller vessel or crewing experience on comparable vessel WILL NOT QUALIFY YOU. Boat Certification or License will not automatically qualify you. This is especially true of our largest cats like the Lagoon 500's. and 52's for which you will be required STRONG experience.";
		var FirstRow = $(Row).clone().append($(col12).clone().append($('<label>').attr({"id":"txt_01"}).append(txt_01)));
		// leader_name & skipper_name
		var leader_txt = $(span).clone().append("Party Leader's name");
		var leader_el = $(InputText).clone().attr({"name":"fld_01","value":catama.Name});
									 
		var skipper_txt = $(span).clone().append('Skipper name');
		var skipper_el = $(InputText).clone().attr({"name":"fld_02","value":catama.SkName});
									
		var SecondRow = $(Row).clone().append(
										 	$(col6).clone().append(
											 	$(InputG).clone().attr({"id":"leader_name"}).append(leader_txt,leader_el)
											),
										 	$(col6).clone().append(
											 	$(InputG).clone().attr({"id":"skipper_name"}).append(skipper_txt,skipper_el)
											)
									 );
		// Date
		var date_txt = $(span).clone().append("Date");
		if(catama.DDate==""){ DDate = today } else{ DDate = catama.DDate }
//		var date_el = $(InputText).clone().attr({"name":"fld_03","value":''+DDate+'',"readonly":"readonly"});
		var date_el = $(InputText).clone().attr({"name":"fld_03","value":'',"readonly":"readonly"});
		var ThirdRow = $(Row).clone().append(
										 	$(col6).clone().append(
											 	$(InputG).clone().attr({"id":"date"}).append(date_txt,date_el)
											)
									 );	 
		//txt_02
		var txt_02 = "It is very important that we receive this information from all charterers.";
		var FourthRow = $(Row).clone().append($(col12).clone().addClass("text-center").append($('<label>').attr({"id":"txt_02"}).append(txt_02)));
		// As_skipper
		var AsSkipper_txt = $(span).clone().append("1. Have you ever chartered with us before as SKIPPER?");
		var AsSkipper_el = $(InputText).clone().attr({"name":"fld_04","value":catama.Q1a});
		var FifthRow = $(Row).clone().append(
										 	$(col6).clone().append(
											 	$(InputG).clone().attr({"id":"As_skipper"}).append(AsSkipper_txt,AsSkipper_el)
											)
									 );
		// boat_type
		var boat_type_txt = $(span).clone().append("Boat Type/Feet");
		var boat_type_el = $(InputText).clone().attr({"name":"fld_05","value":catama.Q1b});
		// Location
		var Location_txt = $(span).clone().append("Location");
		var Location_el = $(InputText).clone().attr({"name":"fld_06","value":catama.Q1c});
		//Date_2
		var date_2_txt = $(span).clone().append("Date");
		var date_2_el = $(InputText).clone().attr({"name":"fld_07","value":catama.Q1d});
		
		var SixRow = $(Row).clone().append(
										 	$(col4).clone().append(
											 	$(InputG).clone().attr({"id":"boat_type"}).append(boat_type_txt,boat_type_el)
											),
											$(col4).clone().append(
											 	$(InputG).clone().attr({"id":"location"}).append(Location_txt,Location_el)
											),
											$(col4).clone().append(
											 	$(InputG).clone().attr({"id":"date_2"}).append(date_2_txt,date_2_el)
											)
									 );
		//txt_03
		var txt_03 = "2. If your answer to question 1 was yes" +
								 "<span style=\"color:red;\">AND less than 3 years AND on boat same size or bigger</span>, skip steps 3 through 14, submit "+
								 "this form and proceed to the next form, PAYMENT TERMS AND CONDITIONS, otherwise please complete the resume below.";
		var SevenRow = $(Row).clone().append($(col12).clone().append($('<label>').attr({"id":"txt_03"}).append(txt_03)));
		// chartered
		var chartered_txt = $(span).clone().append("3. Have you ever chartered before?");
		var chartered_el = $(InputText).clone().attr({"name":"fld_08","value":catama.Q3});
		var EightRow = $(Row).clone().append(
										 	$(col6).clone().append(
											 	$(InputG).clone().attr({"id":"chartered"}).append(chartered_txt,chartered_el)
											),
											$(col6).clone().append(
											 	$('<div>').append("If yes, please fill out the table below.")
											)
									 );
		var chartered_btm_txt = "<span style=\"color:red;font-weight:bold;\">We require to see all SKIPPERING experience on COMPARABLY SIZED SAILING VESSELS "+
														"(e.g. same length OR bigger vessel) TO THE VESSEL YOU WISH TO CHARTER with details<br> (type of journey, length etc). Skippering a smaller vessel "+
														"or sailing/crewing on a comparable or bigger vessel will NOT qualify you."+
														"Resumes will not be approved without suitable experience being listed.</span>"+
														"If the charter was a bareboat charter, indicate whether you were captain or crew.";
		var NineRow = $(Row).clone().append($(col12).clone().append(chartered_btm_txt));
		// Yacht_type 
		var yacht_type_txt = $(span2).clone().append('YACHT BRAND & TYPE');
		var yacht_type_el1 = $(InputText).clone().attr({"name":"fld_09","value":catama.Q3a1});
		var yacht_type_el2 = $(InputText).clone().attr({"name":"fld_10","value":catama.Q3a2});
		var yacht_type_el3 = $(InputText).clone().attr({"name":"fld_11","value":catama.Q3a3});
		var yacht_type_el4 = $(InputText).clone().attr({"name":"fld_12","value":catama.Q3a4});
		// Where
		var where_txt = $(span2).clone().append('WHERE');
		var where_el1 = $(InputText).clone().attr({"name":"fld_13","value":catama.Q3b1});
		var where_el2 = $(InputText).clone().attr({"name":"fld_14","value":catama.Q3b2});
		var where_el3 = $(InputText).clone().attr({"name":"fld_15","value":catama.Q3b3});
		var where_el4 = $(InputText).clone().attr({"name":"fld_16","value":catama.Q3b4});
		// Charter_company
		var company_txt = $(span2).clone().append('CHARTER COMPANY');
		var company_el1 = $(InputText).clone().attr({"name":"fld_17","value":catama.Q3c1});
		var company_el2 = $(InputText).clone().attr({"name":"fld_18","value":catama.Q3c2});
		var company_el3 = $(InputText).clone().attr({"name":"fld_19","value":catama.Q3c3});
		var company_el4 = $(InputText).clone().attr({"name":"fld_20","value":catama.Q3c4});
		// Yacht_length
		var length_txt = $(span2).clone().append('YACHT LENGTH');
		var length_el1 = $(InputText).clone().attr({"name":"fld_21","value":catama.Q3d1});
		var length_el2 = $(InputText).clone().attr({"name":"fld_22","value":catama.Q3d2});
		var length_el3 = $(InputText).clone().attr({"name":"fld_23","value":catama.Q3d3});
		var length_el4 = $(InputText).clone().attr({"name":"fld_24","value":catama.Q3d4});
		// Skipper_Crew
		var crew_txt = $(span2).clone().append('SKIPPER/CREW');
		var crew_el1 = $(InputText).clone().attr({"name":"fld_25","value":catama.Q3e1});
		var crew_el2 = $(InputText).clone().attr({"name":"fld_26","value":catama.Q3e2});
		var crew_el3 = $(InputText).clone().attr({"name":"fld_27","value":catama.Q3e3});
		var crew_el4 = $(InputText).clone().attr({"name":"fld_28","value":catama.Q3e4});
		// Month_Year
		var year_txt = $(span2).clone().append('MONTH/YEAR');
		var year_el1 = $(InputText).clone().attr({"name":"fld_29","value":catama.Q3f1});
		var year_el2 = $(InputText).clone().attr({"name":"fld_30","value":catama.Q3f2});
		var year_el3 = $(InputText).clone().attr({"name":"fld_31","value":catama.Q3f3});
		var year_el4 = $(InputText).clone().attr({"name":"fld_32","value":catama.Q3f4});
		
		var TenRow =  $(Row).clone().append(
										$(col2).clone().css("margin-bottom","10px").attr({"id":"Yacht_type"}).append(yacht_type_txt,yacht_type_el1,yacht_type_el2,yacht_type_el3,yacht_type_el4),
								 		$(col2).clone().css("margin-bottom","10px").attr({"id":"Where"}).append(where_txt,where_el1,where_el2,where_el3,where_el4),
								 		$(col2).clone().css("margin-bottom","10px").attr({"id":"Charter_company"}).append(company_txt,company_el1,company_el2,company_el3,company_el4),
								 		$(col2).clone().css("margin-bottom","10px").attr({"id":"Yacht_length"}).append(length_txt,length_el1,length_el2,length_el3,length_el4),
								 		$(col2).clone().css("margin-bottom","10px").attr({"id":"Skipper_Crew"}).append(crew_txt,crew_el1,crew_el2,crew_el3,crew_el4),
								 		$(col2).clone().css("margin-bottom","10px").attr({"id":"Month_Year"}).append(year_txt,year_el1,year_el2,year_el3,year_el4)
									);
		//txt_04
		var txt_04 = "4. List any yachts that you have owned (type, length, displacement, years owned).";
		var ElevenRow = $(Row).clone().append($(col12).clone().append($('<div>').attr({"id":"txt_04"}).append(txt_04)));
		// yacht_model
		var YachtModel_txt = $(span).clone().append("Yacht Type/Model ");
		var YachtModel_el = $(InputText).clone().attr({"name":"fld_33","value":catama.Q4a});
		// LOA
		var LOA_txt = $(span).clone().append("LOA");
		var LOA_el = $(InputText).clone().attr({"name":"fld_34","value":catama.Q4b});
		// Displacement
		var displace_txt = $(span).clone().append("Displacement");
		var displace_el = $(InputText).clone().attr({"name":"fld_35","value":catama.Q4c});
		// Years_Owned
		var YearOwn_txt = $(span).clone().append("Years Owned");
		var YearOwn_el = $(InputText).clone().attr({"name":"fld_36","value":catama.Q4d});
		
		var TwelveRow = $(Row).clone().append(
									 	$(col3).clone().append(
										 	$(InputG).clone().attr({"id":"Yacht_Model"}).append(YachtModel_txt,YachtModel_el)
										),
										$(col3).clone().append(
										 	$(InputG).clone().attr({"id":"LOA"}).append(LOA_txt,LOA_el)
										),
										$(col3).clone().append(
										 	$(InputG).clone().attr({"id":"Displacement"}).append(displace_txt,displace_el)
										),
										$(col3).clone().append(
										 	$(InputG).clone().attr({"id":"Years_Owned"}).append(YearOwn_txt,YearOwn_el)
										)
								 );
		// multihull
		var multihull_txt = $(span).clone().append("5. Have you ever skippered a multihull? If yes, what type/size?");
		var multihull_el = $(InputText).clone().attr({"name":"fld_37","value":catama.Q5a});
		var ThirteenRow = $(Row).clone().append(
										 	$(col12).clone().append(
											 	$(InputG).clone().attr({"id":"multihull"}).append(multihull_txt,multihull_el)
											)
									 );
		// monohull
		var monohull_txt = $(span).clone().append("If no, have you ever skippered a monohull? If yes, what size/type?");
		var monohull_el = $(InputText).clone().attr({"name":"fld_38","value":catama.Q5b});
		var FourteenRow = $(Row).clone().append(
										 	$(col12).clone().append(
											 	$(InputG).clone().attr({"id":"monohull"}).append(monohull_txt,monohull_el)
											)
									 );
		// txt_06
		var txt_06 = $(span).clone().append("6. How many times have you anchored a yacht larger than 30 Ft. in length?");
		var fld_39 = $(InputText).clone().attr({"name":"fld_39","value":catama.Q6});
		var FifthteenRow = $(Row).clone().append(
										 	$(col12).clone().append(
											 	$(InputG).clone().attr({"id":"txt_06"}).append(txt_06,fld_39)
											)
									 );
		// txt_07
		var txt_07 = $(span).clone().append("7. How many days do you sail per year?");
		var fld_40 = $(InputText).clone().attr({"name":"fld_40","value":catama.Q7a});
		
		var txt_07_2 = $(span).clone().append("In the last 2 years?");
		var fld_41 = $(InputText).clone().attr({"name":"fld_41","value":catama.Q7b});
		
		var txt_07_3 = $(span).clone().append("How many years have you been sailing?");
		var fld_42 = $(InputText).clone().attr({"name":"fld_42","value":catama.Q7c});
		var SixteenRow = $(Row).clone().append(
										 	$(col4).clone().attr({"id":"txt_07"}).append(
											 	$(InputG).clone().append(txt_07,fld_40)
											),
											$(col4).clone().append(
											 	$(InputG).clone().append(txt_07_2,fld_41)
											),
											$(col4).clone().append(
											 	$(InputG).clone().append(txt_07_3,fld_42)
											)
									 );
		// txt_08
		var txt_08 = $(span).clone().append("8. Where do you do most of your sailing?");
		var fld_43 = $(InputText).clone().attr({"name":"fld_43","value":catama.Q8});
		var SeventeenRow = $(Row).clone().append(
										 	$(col12).clone().append(
											 	$(InputG).clone().attr({"id":"txt_08"}).append(txt_08,fld_43)
											)
									 );
		//txt_09
		var txt_09 = "9. Have you ever sailed in the Caribbean Islands? If yes, which island(s)?";
		var EightteenRow = $(Row).clone().append($(col12).clone().append($('<div>').attr({"id":"txt_09"}).append(txt_09)));
		//fld_44
		var fld_44 = $(InputTextarea).clone().attr({"name":"fld_44","id":"fld_44"});
		var NineteenRow = $(Row).clone().append(
											 	$(col12).clone().append(fld_44.append(catama.Q9))
										 );
		//txt_10
		var txt_10 = "10. Please describe any long distance or offshore sailing experience(s):";
		var TwentyRow = $(Row).clone().append($(col12).clone().append($('<div>').attr({"id":"txt_10"}).append(txt_10)));
		//fld_45
		var fld_45 = $(InputTextarea).clone().attr({"name":"fld_45","id":"fld_45"});
		var TwentyOneRow = $(Row).clone().append(
												 	$(col12).clone().append(fld_45.append(catama.Q10))
											 );
		//txt_11
		var txt_11 = "11. Are you familiar with piloting (coastal navigation with use of charts, compass, parallel rules and onboard electronics)?  ";
		var check = "";
		if(catama.Q11a == "1"){ check="checked" }else{ check="" }
		var fld_46 = $(InputRadio).clone().attr({"name":"fld_46","value":"1"}).prop({"checked":check});
		if(catama.Q11a == "0"){ check="checked" }else{ check="" }
		var fld_47 = $(InputRadio).clone().attr({"name":"fld_46","value":"0"}).prop({"checked":check});
		var TwentyTwoRow = $(Row).clone().append($(col12).clone().append($('<div>').attr({"id":"txt_11"}).append(txt_11,fld_46,"  Yes  ",fld_47,"  No")));
		//txt_12
		var txt_12 = "If yes, please describe your experience(s)";
		var TwentyThreeRow = $(Row).clone().append($(col12).clone().append($('<div>').attr({"id":"txt_12"}).append(txt_12)));
		//fld_48
		var fld_48 = $(InputTextarea).clone().attr({"name":"fld_48","id":"fld_48"});
		var TwentyFourRow = $(Row).clone().append(
												 	$(col12).clone().append(fld_48.append(catama.Q11b))
											 );
		//txt_13
		var txt_13 = "12. List any piloting/navigation courses which you have successfully completed";
		var TwentyFiveRow = $(Row).clone().append($(col12).clone().append($('<div>').attr({"id":"txt_13"}).append(txt_13)));
		//fld_49
		var fld_49 = $(InputTextarea).clone().attr({"name":"fld_49","id":"fld_49"});
		var TwentySixRow = $(Row).clone().append(
												 	$(col12).clone().append(fld_49.append(catama.Q12))
											 );	
		//txt_14
		var txt_14 = "<b>Many competent yachtsmen have never owned their own yachts or have not chartered before. "+
								"If you have recently acted in a position of responsibility as a skipper/crew, please give all details on a separate sheet of paper."+
								"list any additional information which you feel is pertinent or may be helpful in assisting us in evaluating your experience"+
								"and he experience of your crew so that we may ensure a safe and enjoyable vacation for your charter party.</b><br>"+
								"If you wish to spend your first day on charter with one of our qualified captains, please ask your charter consultant.";
		var TwentySevenRow = $(Row).clone().append($(col12).clone().append($('<div>').attr({"id":"txt_14"}).append(txt_14)));
		//txt_15
		var txt_15 = "13. Yachting/Personal references (other than family or crew members)";
		var TwentyEightRow = $(Row).clone().append($(col12).clone().append($('<div>').attr({"id":"txt_15"}).append(txt_15)));
		// fld_50
		var txt_50 = $(span).clone().append("Name");
		var fld_50 = $(InputText).clone().attr({"name":"fld_50","value":catama.Q13a1});
		// fld_51
		var txt_51 = $(span).clone().append("Address");
		var fld_51 = $(InputText).clone().attr({"name":"fld_51","value":catama.Q13b1});
		// fld_52
		var txt_52 = $(span).clone().append("Phone#");
		var fld_52 = $(InputText).clone().attr({"name":"fld_52","value":catama.Q13c1});
		
		var TwentyNineRow = $(Row).clone().append(
										 	$(col4).clone().append(
											 	$(InputG).clone().append(txt_50,fld_50)
											),
											$(col4).clone().append(
											 	$(InputG).clone().append(txt_51,fld_51)
											),
											$(col4).clone().append(
											 	$(InputG).clone().append(txt_52,fld_52)
											)
									 );
		// fld_53
		var txt_53 = $(span).clone().append("Name");
		var fld_53 = $(InputText).clone().attr({"name":"fld_53","value":catama.Q13a2});
		// fld_54
		var txt_54 = $(span).clone().append("Address");
		var fld_54 = $(InputText).clone().attr({"name":"fld_54","value":catama.Q13b2});
		// fld_55
		var txt_55 = $(span).clone().append("Phone#");
		var fld_55 = $(InputText).clone().attr({"name":"fld_55","value":catama.Q13c2});
		
		var ThirtyRow = $(Row).clone().append(
										 	$(col4).clone().append(
											 	$(InputG).clone().append(txt_53,fld_53)
											),
											$(col4).clone().append(
											 	$(InputG).clone().append(txt_54,fld_54)
											),
											$(col4).clone().append(
											 	$(InputG).clone().append(txt_55,fld_55)
											)
									 );
		//txt_16
		var txt_16 = "14. Crew list (Please list all members of your charter party).";
		var ThirtyOneRow = $(Row).clone().append($(col12).clone().append($('<div>').attr({"id":"txt_16"}).append(txt_16)));
		//txt_17
		var txt_17 = "NAME.";
		var txt_18 = "BRIEF EXPERIENCE(Specific)";
		var ThirtyTwoRow = $(Row).clone().append(
													$(col6).clone().append($('<div>').addClass("text-center").append(txt_17)),
													$(col6).clone().append($('<div>').addClass("text-center").append(txt_18))
											);
		// fld_57
		var txt_56 = $(span).clone().append("Skipper");
		var fld_56 = $(InputText).clone().attr({"name":"fld_56","value":catama.Q14a});
		var fld_57 = $(InputTextarea).clone().attr({"name":"fld_57","id":"fld_57","rows":"2"});
		var ThirtyThreeRow = $(Row).clone().append(
												 	$(col6).clone().append(
													 	$(InputG).clone().css({"margin-top":"10px"}).append(txt_56,fld_56)
													),
													$(col6).clone().append(fld_57.append(catama.Q14b))
											 );
		// fld_59
		var txt_58 = $(span).clone().append("Skipper");
		var fld_58 = $(InputText).clone().attr({"name":"fld_58","value":catama.Q14c});
		var fld_59 = $(InputTextarea).clone().attr({"name":"fld_59","id":"fld_59","rows":"2"});
		var ThirtyFourRow = $(Row).clone().append(
												 	$(col6).clone().append(
													 	$(InputG).clone().css({"margin-top":"10px"}).append(txt_58,fld_58)
													),
													$(col6).clone().append(fld_59.append(catama.Q14d))
											 );
		var txt_submittal = "<b>Lagoon 500 & 52 Resume Submittal:</b> "+
												"<ul><li>Upon deposit received, customer has 7 days to return the resume. Detailed Captain Resume along with first mate resume must be submitted.</li>"+
												"<li>If chartered the Lagoon 500 or 52 prior – resume is already approved.</li>"+
												"<li>If customer is not qualified to skipper the Lagoon 500/52 the customer must hire a skipper for part, or the duration of the charter."+
												"The duration of the skipper is dependent on the decision of the BareboatManager, from the experience outlined in the resume.</li>"+
												"<li>If customer disagrees and will not hire skipper then customer must cancel or downgrade to a smaller catamaran.</li>"+
												"<li>Normal cancellation terms will apply if customer cancels.</li>"+
												"<li>We will provide a guarantee that the resume will be looked at and the decision to approve or deny will be made within 10 days."+
												"At that point, a part or full time skipper can be decided upon at the"+
												"charterer’s cost, or charter must be cancelled.</li></ul>";
		var ThiretyFiveRow =  $(Row).clone().append(
													 	$(col12).clone().append(
														 	$('<div>').clone().append(txt_submittal)
														)
												 );
		var import_btn = '<button type="button" class="btn btn-primary" id="ImportCO_196"><i class="fa fa-download"></i>'+row.lg_coskipper_import+'</button>';
		//Before Append// 									
		var CoSkipperInfo = $(Row).clone().css({"margin-top":"15px","margin-left":"5px","margin-right":"5px"})
										.append(
											$(col12).clone()
											.append(
												FirstRow,SecondRow,ThirdRow,FourthRow
												,FifthRow,SixRow,SevenRow,EightRow,NineRow
												,TenRow,ElevenRow,TwelveRow,ThirteenRow
												,FourteenRow,FifthteenRow,SixteenRow
												,SeventeenRow,EightteenRow,NineteenRow,TwentyRow
												,TwentyOneRow,TwentyTwoRow,TwentyThreeRow,TwentyFourRow
												,TwentyFiveRow,TwentySixRow,TwentySevenRow,TwentyEightRow
												,TwentyNineRow,ThirtyRow,ThirtyOneRow,ThirtyTwoRow,ThirtyThreeRow
												,ThirtyFourRow,ThiretyFiveRow
											)
										);
		//append			
		$('#Co-SkipperInfo').append(CoSkipperInfo); //Append On Page
		$('#Import_CO').html(import_btn);
	}else{
		// Salutation_skipper //
			if(con1 == "True"){
			var	result = '<input type="hidden" name="Salutation_equipier" value="2">';
			$('#Co-SkipperInfo').append(result);	
			}else if(con2 == "True"){
			var	result = '<input type="hidden" name="Salutation_equipier" value="">';	
			$('#Co-SkipperInfo').append(result);	
			}else{
				if(row.mySalutation_equipier=="0"){check = "checked"}else{check = "" }
				var	ms 	 =	$('<label>').append(
										$(InputRadio).clone().attr({"name":"mySalutation_equipier","value":"0"}).prop({"checked":check,"disabled":row.disabled}),
											row.Mrs+'&nbsp;&nbsp;'
										);
										
				if(row.mySalutation_equipier=="1"){check = "checked"}else{check = "" }
				var	miss = 	$('<label>').append(
											$(InputRadio).clone().attr({"name":"mySalutation_equipier","value":"1"}).prop({"checked":check,"disabled":row.disabled}),
											row.Miss+'&nbsp;&nbsp;'
										);
										
				if(row.mySalutation_equipier=="2"){check = "checked"}else{check = "" }
				var	mr 	 =  $('<label>').append(
											$(InputRadio).clone()
											.attr({"name":"mySalutation_equipier","value":"2","disabled":''+row.disabled+''}).prop({"checked":check,"disabled":row.disabled}),
											row.Mr+''
										);
										
				var result = $(Row).clone().css({"margin-top":"10px"}).append($(col12).clone().append(ms,miss,mr));	
			}
		// ---Salutation_skipper //
		// Lastname & Firstname //
			var NameSkip = $(span).clone().append(row.lg_LastName);
			var NameSkipEl = $(InputText).clone().addClass('lastname').attr({"name":"myName_equipier","value":row.myName_equipier,"id":"Name_equipier2"}).prop({"disabled":disable});
										 
			var FName = $(span).clone().append(row.Prenom);
			var FNameEl = $(InputText).clone().attr({"name":"myFirstName_equipier","value":row.myFirstName_equipier,"id":"FirstName_equipier2"}).prop({"disabled":disable});
										
			var FirstRow = $(Row).clone().append(
											 	$(col6).clone().append(
												 	$(InputG).clone().append(NameSkip,NameSkipEl)
												),
											 	$(col6).clone().append(
												 	$(InputG).clone().append(FName,FNameEl)
												)
										 );
		// ---Lastname & Firstname //
		// Bithdate & PlaceBirth //
			if(droits.clss_date_naiss_equipier==''){
				var DateB = $(span).clone().append(row.Birthdate);
				var DateBEl = $(InputText).clone().attr({"name":"myDate_naiss_equipier","value":row.myDate_naiss_equipier,"id":"Date_naiss_equipier"}).prop({"disabled":disable});
			}
			if(droits.clss_lieu_naiss_equipier==''){
				var PlaceB = $(span).clone().append(row.lg_placeofbirth);
				var PlaceBEl = $(InputText).clone().attr({"name":"myLieu_naiss_equipier","value":row.myLieu_naiss_equipier,"id":"Lieu_naiss_equipier"}).prop({"disabled":disable});
			}
			if(DateB && PlaceB){
				var SecondRow = $(Row).clone().append(
												 	$(col6).clone().append(
													 	$(InputG).clone().append(DateB,DateBEl)
													),
												 	$(col6).clone().append(
													 	$(InputG).clone().append(PlaceB,PlaceBEl)
													)
										 		);
			}else if(DateB && !PlaceB){
				var SecondRow = $(Row).clone().append(
												 	$(col12).clone().append(
													 	$(InputG).clone().append(DateB,DateBEl)
													)
												);
			}else if(!DateB && PlaceB){
				var SecondRow = $(Row).clone().append(
												 	$(col12).clone().append(
													 	$(InputG).clone().append(PlaceB,PlaceBEl)
													)
										 		);
			}
		// ---Bithdate & PlaceBirth //
		// Address //
			if(droits.clss_address_equipier==''){
				var Address1 = $(span).clone().append(row.Address);
				if(droits.affich_addressOPE){
					var Address1El = $(InputText).clone().attr({"name":"myAddress_equipierOPE","value":row.myAddress_equipierOPE,"id":"Address_equipierOPE"}).prop({"disabled":disable});
				}else{
					var Address1El = $(InputText).clone().attr({"name":"myAddress_equipier","value":row.myAddress_equipier,"id":"Address_equipier"}).prop({"disabled":disable});
				}
				var ThirdRow = $(Row).clone().append(
												 	$(col12).clone().append(
													 	$(InputG).clone().append(Address1,Address1El)
													)
											 );
			}
		// ---Address //
		// Address2 //
			if(droits.clss_address2_equipier==''){						 
				var Address2 = $(span).clone().append(row.Address+' 2');
				if(droits.affich_addressOPE){
					var Address2El = $(InputText).clone().attr({"name":"myAddress2_equipierOPE","value":row.myAddress2_equipierOPE,"id":"Address2_equipierOPE"}).prop({"disabled":disable});
				}else{
					var Address2El = $(InputText).clone().attr({"name":"myAddress2_equipier","value":row.myAddress2_equipier,"id":"Address2_equipier"}).prop({"disabled":disable});
				}								
				var FourthRow = $(Row).clone().append(
													 	$(col12).clone().append(
														 	$(InputG).clone().append(Address2,Address2El)
														)
												 );
			}
		// ---Address2 //
		// City & Zipcode //
			if(droits.clss_city_equipier==''){
				var City = $(span).clone().append(row.City);
				if(droits.affich_addressOPE){
					var CityEl = $(InputText).clone().attr({"name":"myCity_equipierOPE","value":row.myCity_equipierOPE,"id":"City_equipierOPE"}).prop({"disabled":disable});
				}else{
					var CityEl = $(InputText).clone().attr({"name":"myCity_equipier","value":row.myCity_equipier,"id":"City_equipier"}).prop({"disabled":disable});
				}
			}
			if(droits.clss_zipcode_equipier==''){													 
				var ZipCode = $(span).clone().append(row.Zipcode);
				if(droits.affich_addressOPE){
					var ZipCodeEl = $(InputText).clone().attr({"name":"myZipCode_equipierOPE","value":row.myZipCode_equipierOPE,"id":"ZipCode_equipierOPE"}).prop({"disabled":disable});
				}else{
					var ZipCodeEl = $(InputText).clone().attr({"name":"myZipCode_equipier","value":row.myZipCode_equipier,"id":"ZipCode_equipier"}).prop({"disabled":disable});
				}
			}	
			if(City && ZipCode){
				var FifthRow = $(Row).clone().append(
												 	$(col6).clone().append(
													 	$(InputG).clone().append(City,CityEl)
													),
												 	$(col6).clone().append(
													 	$(InputG).clone().append(ZipCode,ZipCodeEl)
													)
											 );		
			}else if(City && !ZipCode){
				var FifthRow = $(Row).clone().append(
											 	$(col12).clone().append(
												 	$(InputG).clone().append(City,CityEl)
												)
										 );
			}else if(!City && ZipCode){
				var FifthRow = $(Row).clone().append(
											 		$(col12).clone().append(
													 	$(InputG).clone().append(ZipCode,ZipCodeEl)
													)
										 );
			}
		// --City & Zipcode //
		// Country & State //
			if (droits.clss_country_equipier==''){
				var Country = $(span).clone().append(row.Country);
				if (droits.affich_addressOPE){
					var	l_nam = "myCountry_equipierOPE"
					var l_val = row.myCountry_equipierOPE
				}else{
					var	l_nam = "myCountry_equipier"
					var l_val = row.myCountry_equipier
				}
				var selectcountry = '';
				var CountryEl = '<select name="'+l_nam+'" class="form-control co-skipper" id="'+l_nam+'" '+disable+'>'+
												'<option value="">Other</option>';				
												$.each(country,function(key,value){
													var valueN = value.names.replace("[chr39]", "'");
													((l_val==valueN) ? sel = "selected" : sel = '')
													selectcountry = selectcountry + '<option value="'+valueN+'" '+sel+'>'+valueN+'</option>';
												});
				var CountryEnd = '</select>';
			}
			if (droits.clss_state_equipier==''){
				var State = $(span).clone().append(row.State);
				if (droits.affich_addressOPE){
					var	l_nam = "myState_equipierOPE"
					var l_val = row.myState_equipierOPE
				}else{
					var	l_nam = "myState_equipier"
					var l_val = row.myState_equipier
				}
				var selectstate = '';
				var StateEl = '<select name="'+l_nam+'" class="form-control co-skipper" id="'+l_nam+'" '+disable+'>'+
											'<option value="">Only U.S. resident</option>';				
											$.each(state,function(key,value){
												var valueN = value.names.replace("[chr39]", "'");
												((l_val==value.code || l_val==valueN) ? sel = "selected" : sel = '')
												selectstate = selectstate + '<option value="'+value.code+'" '+sel+'>'+value.code+' - '+valueN+'</option>';
											});
				var StateElEnd = '</select>';
			}
				var SixRow = $(Row).clone().append(
											 	$(col6).clone().append(
												 	$(InputG).clone().append(Country,CountryEl+selectcountry+CountryEnd)
												),
											 	$(col6).clone().append(
												 	$(InputG).clone().append(State,StateEl+selectstate+StateElEnd)
												)
										 );
		// ---Country & State //
		// Phone & Mobile //
			if (droits.clss_tel_equipier==''){
				var Phone = $(span).clone().append(row.Phone);
				var PhoneEl = $(InputText).clone().attr({"name":"myTel_equipier","value":row.myTel_equipier,"id":"Tel_equipier"}).prop({"disabled":disable});
			}
			if (droits.clss_mob_equipier==''){
				var Mobile = $(span).clone().append(row.Mobile);
				var MobileEl = $(InputText).clone().attr({"name":"myMob_equipier","value":row.myMob_equipier,"id":"Mob_equipier"}).prop({"disabled":disable});
			}
			if(Phone && Mobile){
				var SevenRow = $(Row).clone().append(
												 	$(col6).clone().append(
													 	$(InputG).clone().append(Phone,PhoneEl)
													),
												 	$(col6).clone().append(
													 	$(InputG).clone().append(Mobile,MobileEl)
													)
											 );	
			}else if(Phone && !Mobile){
				var SevenRow = $(Row).clone().append(
											 	$(col12).clone().append(
												 	$(InputG).clone().append(Phone,PhoneEl)
												)
										 );
			}else if(!Phone && Mobile){
				var SevenRow = $(Row).clone().append(
											 		$(col12).clone().append(
													 	$(InputG).clone().append(Mobile,MobileEl)
													)
										 );
			}
		// ---Phone & Mobile //
		// Fax & Email//
			if (droits.clss_fax_equipier==''){
				var Fax = $(span).clone().append(row.lg_fax);
				var FaxEl = $(InputText).clone()
										.attr({"name":"myFax_equipier","value":row.myFax_equipier,"id":"Fax_equipier"}).prop({"disabled":disable});
			}
			if (droits.clss_email_equipier==''){
				var Email = $(span).clone().append(row.lg_email);
				var EmailEl = $(InputText).clone().attr({"name":"myEmail_equipier","value":row.myEmail_equipier,"id":"Email_equipier"}).prop({"disabled":disable});
			}
			if(Fax && Email){
				var EightRow = $(Row).clone().append(
												 	$(col6).clone().append(
													 	$(InputG).clone().append(Fax,FaxEl)
													),
												 	$(col6).clone().append(
													 	$(InputG).clone().append(Email,EmailEl)
													)
											 );
			}else if(Fax && !Email){
				var EightRow = $(Row).clone().append(
											 	$(col12).clone().append(
												 	$(InputG).clone().append(Fax,FaxEl)
												)
										 );
			}else if(!Fax && Email){
				var EightRow = $(Row).clone().append(
											 		$(col12).clone().append(
													 	$(InputG).clone().append(Email,EmailEl)
													)
										 );
			}
		// ---Fax & Email//
		// Passport & Nationality //
			if (droits.clss_identnum_equipier==''){
				var Passport = $(span).clone().append(row.lg_passport_no);
				var PassportEl = $(InputText).clone().attr({"name":"myIdentNum_equipier","value":row.myIdentNum_equipier,"id":"IdentNum_equipier"}).prop({"disabled":disable});
			}
			if (droits.clss_nation_equipier==''){
				var Nation = $(span).clone().append(row.nation);
				var NationEl = $(InputText).clone().attr({"name":"myNation_equipier","value":row.myNation_equipier,"id":"Nation_equipier"}).prop({"disabled":disable});
			}
			if(Passport && Nation){
				var NineRow = $(Row).clone().append(
												 	$(col6).clone().append(
													 	$(InputG).clone().append(Passport,PassportEl)
													),
												 	$(col6).clone().append(
													 	$(InputG).clone().append(Nation,NationEl)
													)
											 );
			}else if(Passport && !Nation){
				var NineRow = $(Row).clone()
										 .append(
											 	$(col12).clone().append(
												 	$(InputG).clone().append(Passport,PassportEl)
												)
										 );
			}else if(!Passport && Nation){
				var NineRow = $(Row).clone()
										 .append(
											 	$(col12).clone().append(
														$(InputG).clone().append(Nation,NationEl)
													)
										 );
			}
		// ---Passport & Nationality //
		// NavigationExp //
			if (droits.clss_nb_year_equipier==''){
				var Exp = $(span).clone().append(row.NavigationExp);
				var ExpEl = $(InputText).clone().attr({"name":"myNb_year_equipier","value":row.myNb_year_equipier,"id":"Nb_year_equipier"}).prop({"disabled":disable});	
				var TenRow = $(Row).clone().append(
				 								 		$(col12).clone().append(
					 								 		$(InputG).clone().append(Exp,ExpEl)
					 								 	)
				 								 	);
			}
		// ---NavigationExp //
		// Small_boats && Coast && Off_shore //
			if (droits.clss_boat_equipier==''){
				var check;
				var Boat = $('<span>').append(row.Small_boats+' (dinghy)&nbsp;');
				var index_a = row.myBoat_equipier.indexOf("a");
				var index_b = row.myBoat_equipier.indexOf("b");
				var index_c = row.myBoat_equipier.indexOf("c");
				if(index_a > -1){ check = 'checked'; }else{ check = '';}
				var BoatEl = $(InputCheckbox).clone().attr({"name":"myBoat_equipier","value":"a","id":"Boat_equipier"}).prop({"disabled":disable,"checked":check});	
				var ElevenRow = $(Row).clone().append(
				 								 		$(col12).clone().append(
					 								 		$(InputG).clone().append(Boat,BoatEl)
					 								 	)
				 								 	);
				 								 	
				var Coast = $('<span>').append(row.Coast+'&nbsp;');
				if(index_b > -1){ check = 'checked'; }else{ check = '';}
				var CoastEl = $(InputCheckbox).clone().attr({"name":"myBoat_equipier","value":"b","id":"Boat_equipier"}).prop({"disabled":disable,"checked":check});	
				var TwelveRow = $(Row).clone().append(
				 								 		$(col12).clone().append(
					 								 		$(InputG).clone().append(Coast,CoastEl)
					 								 	)
				 								 	);
				 								 	
				var Shore = $('<span>').append(row.Off_shore+'&nbsp;');
				if(index_c > -1){ check = 'checked'; }else{ check = '';}
				var ShoreEl = $(InputCheckbox).clone().attr({"name":"myBoat_equipier","value":"c","id":"Boat_equipier"}).prop({"disabled":disable,"checked":check});	
				var ThirteenRow = $(Row).clone().append(
				 								 		$(col12).clone().append(
					 								 		$(InputG).clone().append(Shore,ShoreEl)
					 								 	)
				 								 	);
			}
		// ---Small_boats && Coast && Off_shore //
		// AreYouOwner //
			if(droits.clss_have_boat_equipier==''){
				
				var check;
				var HaveBoat = $('<span>').append(row.AreYouOwner+'&nbsp;');
												if(row.myhave_boat_equipier=="yes"){check = "checked" ,hiderow="block"}else{check = "" ,hiderow=''}
				var HaveBoat1 = $('<label>').append(
													$(InputRadio).clone().attr({"name":"myhave_boat_equipier","value":"yes","id":"have_boat_equipier"}).prop({"checked":check,"disabled":disable}),''+row.Yes+'&nbsp;'
												);
												if(row.myhave_boat_equipier=="no"){check = "checked" ,hiderow="none"}else{check = "" ,hiderow=''}
				var HaveBoat2 = $('<label>').append(
													$(InputRadio).clone().attr({"name":"myhave_boat_equipier","value":"no","id":"have_boat_equipier"}).prop({"checked":check,"disabled":disable}),''+row.No+''
												);
				var FourteenRow = $(Row).clone().append(
						 								 	$(col12).clone().append(
						 								 		$(InputG).clone().append(HaveBoat,HaveBoat1,HaveBoat2)
						 								 	)
			 								 		 );
			}
			
			// ---AreYouOwner //
			// BoatType //
				if (droits.clss_type_boat_equipier==''){
					var TypeBoat = $(span).clone().append(row.BoatType+'');
					var TypeBoatEl = $(InputText).clone().attr({"name":"mytype_boat_equipier","value":row.mytype_boat_equipier,"id":"type_boat_equipier3"}).prop({"disabled":disable});
					var FifthteenRow = $(Row).clone().append(
							 								 		$(col12).clone().append(
							 								 			$(InputG).clone().append(TypeBoat,TypeBoatEl)
							 								 		)
							 								 ).css("display",hiderow);
				}
		// ---BoatType //
		// LongBoat //
			if (droits.clss_long_boat_equipier==''){
				var Length = $(span).clone().append(row.Length);
				var LengthEl = $(InputText).clone().attr({"name":"mylong_boat_equipier","value":row.mylong_boat_equipier,"id":"long_boat_equipier"}).prop({"disabled":disable});
				var SixteenRow = $(Row).clone().append(
					 								 		$(col12).clone().append(
					 								 			$(InputG).clone().append(Length,LengthEl)
					 								 		)
					 									).css("display",hiderow);	
			}
		// ---LongBoat //
		// PlaceBoat //
			if (droits.clss_place_boat_equipier == ''){
				var BoatPlace = $(span).clone().append(row.Place+'');
				var BoatPlaceEl = $(InputText).clone().attr({"name":"myplace_boat_equipier","value":row.myplace_boat_equipier,"id":"place_boat_equipier"}).prop({"disabled":disable});
				var SeventeenRow = $(Row).clone().append(
					 								 		$(col12).clone().append(
					 								 			$(InputG).clone().append(BoatPlace,BoatPlaceEl)
					 								 		)
					 									).css("display",hiderow);
			}
			if(row.myhave_boat_equipier == "no"){
				$(TypeBoatEl).val("").attr("disabled","");
				$(LengthEl).val("").attr("disabled","");
				$(BoatPlaceEl).val("").attr("disabled","");
			}
			var btn_import = '<button type="button" class="btn btn-primary" id="ImportCO"><i class="fa fa-download"></i>'+row.lg_coskipper_import+'</button>';
			var btn_upload = '<button type="button" class="btn btn-primary" onclick="DirecToUpload()" ><i class="fa fa-upload"></i> '+UP+'</button>';
		//Before Append// 									
			var CoSkipperInfo = $(Row).clone()
											.append(
												$(col12).clone()
												.append(
													result,FirstRow,SecondRow,ThirdRow,FourthRow
													,FifthRow,SixRow,SevenRow,EightRow,NineRow
													,TenRow,ElevenRow,TwelveRow,ThirteenRow
													,FourteenRow,FifthteenRow,SixteenRow
													,SeventeenRow
												)
											);
											
			if(disable=="disabled"){  $('#ImportCO').attr("disabled", true); }
			$('#Co-SkipperInfo').append(CoSkipperInfo); //Append On Page
			$('#Import_CO').append(btn_import," ",btn_upload,"<br>");
			if(!droits.affich_coskipper){ $('#myTab li a[href="#CO"]').hide(); }
	}
	GetCoSkipperElement();
}

function MarkSkipper(sk){
	// Mark Skipper //
	$('#mark-skipper').empty();
	var skipper = sk;
	if(droits.affich_bt_mark){
		if(skipper==2){
			var mark_skipper = "<input type=\"button\" class=\"btn btn-primary\" name=\"mark_not\" id=\"mark_skip\" value=\""+row.lg_markskippernotfilled+"\" >";
		}else{
			var mark_skipper = "<input type=\"button\" class=\"btn btn-primary\" name=\"mark_fill\" id=\"mark_skip\" value=\""+row.lg_markskipperfilled+"\" >";
		}
	}
	
	$('#mark-skipper').append(mark_skipper);
}

function ListFiles(path,empty){
	var dir = path;
	var empty = empty;
	return $.ajax({
		url: "log_exp_detail-API.asp",
		dataType: "json",
		type: "POST",
		data: {
			dir : dir,
			typ : 'files'
		},
		success:function(data){
			var objFiEx = data;
			if (jQuery.isEmptyObject(objFiEx.list_file)){
   				$('#ListFiles').html("<div class=\"alert alert-warning text-center\" role=\"alert\">"+
															 "<b><i class=\"fa fa-folder-open-o\"></i> "+empty+"</b>"+
																"</div>");
			}else{
				$('#ListFiles').empty();
				$.each(objFiEx.list_file, function(key,value){
					var typDoc = value.name;
							typDoc = typDoc.split(".");
					var typFile = typDoc[typDoc.length-1];
					url = value.folder+value.name;
					$('#ListFiles').append(
						"<div class=\"row\" id=\""+key+"\">"+
							"<div class=\"col-md-7\">"+
								"<a href="+url+" target=\"_blank\">"+value.name+"</a>"+
							"</div>"+
							"<div class=\"col-md-2\">"+CalSizeFile(value.size)+"</div>"+
							"<div class=\"col-md-3 text-right\"><button type=\"button\" role=\"button\" class=\"sdn-upload-item-click btn btn-primary\" onClick=\"DelFilesExist('"+key+"','"+url+"', '"+dir+"', '"+empty+"')\" rowDel=\""+key+"\" name=\""+ value.name +"\" id=\"delete\"><i class=\"fa fa-trash-o\"></i> "+row.lg_delete_file+"</button></div>"+
						"</div><br>"
					);
				});
			}
		}
	});
}

function ImportFiles(){
	var ImportUP = CallImportSK();
	ImportUP.success().promise().done(function(data){
		if(data.length != 0){
			imp = data;
			$.each(imp, function(name,column){
				var path_import = "../search/SkipperInfo/"+column.typ+"/"+column.id_command+"/";
				importfile.push(path_import);
			})
			$.ajax({
				url: "log_exp_detail-API.asp",
				dataType: "json",
				type: "POST",
				data: {
								dir : ''+importfile+'',
								typ : 'files'
							},
				success:function(data){
					if(jQuery.isEmptyObject(data.list_file)){
						$('#txt-import').html("<div class=\"alert alert-danger text-center\" role=\"alert\">"+
															 			"<b><i class=\"fa fa-folder-open-o\"></i> "+row.lg_no_file+"</b>"+
																	"</div>");
					}else{
						var BoatModel = "";
						var BoatModelDate = "";
						//$('#txt-import').hide();
						$('#Import_UP').empty();
						$('#txt-import').html("<div class=\"alert alert-success text-center\" role=\"alert\">"+
															 			"<b><i class=\"fa fa-folder-open-o\"></i> "+row.lg_file_last_book+"</b>"+
																	"</div>");
						$.each(imp, function(name,column){
							$.each(data.list_file, function(key,value){
								if(column.id_command==value.id){
									if(column.boat_model != BoatModel && column.date_start != BoatModelDate){
										BoatModel = column.boat_model;
										BoatModelDate = column.date_start;
										var url_import = value.folder+value.name;
										$('#Import_UP').append(
											"<div class=\"row\" id=\""+key+"\" style=\"margin-top:10px\">"+
												"<div class=\"col-md-7 text-center\">"+
												"<i class=\"fa fa-ship\"></i>  <b>"+column.boat_model+"</b>"+
												"</div>"+
												"<div class=\"col-md-2 text-center\"><b><i class=\"fa fa-calendar\"></i>  "+column.date_start+"  To  "+column.date_end+"</b></div>"+
											"</div><br>",
											"<div class=\"row\" id=\""+key+"\">"+
												"<div class=\"col-md-7 text-center\">"+
													"<a href="+url_import+" target=\"_blank\">"+value.name+"</a>"+
												"</div>"+
												"<div class=\"col-md-2 text-center\">"+CalSizeFile(value.size)+"</div>"+
											"</div><br>"
			//									"<div class=\"col-md-3 text-right\"><button type=\"button\" role=\"button\" class=\"btn btn-primary\" onClick=\"CopyFiles('"+url_import+"','"+value.name+"')\" rowDel=\""+key+"\" name=\""+ value.name +"\" id=\"delete\"><i class=\"fa fa-plus\"></i> Import file</button></div>"+
										);
									}else if (column.boat_model == BoatModel && column.date_start == BoatModelDate){
										var url_import = value.folder+value.name;
										$('#Import_UP').append(
											"<div class=\"row\" id=\""+key+"\">"+
												"<div class=\"col-md-7 text-center\">"+
													"<a href="+url_import+" target=\"_blank\">"+value.name+"</a>"+
												"</div>"+
												"<div class=\"col-md-2 text-center\">"+CalSizeFile(value.size)+"</div>"+
											"</div><br>"
			//									"<div class=\"col-md-3 text-right\"><button type=\"button\" role=\"button\" class=\"btn btn-primary\" onClick=\"CopyFiles('"+url_import+"','"+value.name+"')\" rowDel=\""+key+"\" name=\""+ value.name +"\" id=\"delete\"><i class=\"fa fa-plus\"></i> Import file</button></div>"+
										);
									}
								}
							});
						});
					}
				}
			});
		}else{
			$('#txt-import').html("<div class=\"alert alert-danger text-center\" role=\"alert\">"+
													 	"<b><i class=\"fa fa-folder-open-o\"></i> No any files upload from last booking.</b>"+
														"</div>");
		}
	});
}

function CopyFiles(path_import,file_name){
	var copy_to = path+file_name;
		$.ajax({
			type:"POST",
			url:"log_exp_detail-API.asp",
			dataType:"json",
			data:{dir:copy_to, path_import:path_import, typ:'copy'},
			success:function(data){
				ListFiles(dir,empty);
			},
			error:function(){
			}
		});
}

function CalSizeFile(sF){
	if(sF > 1024000){
		sF = sF/1024000;
		return sF.toFixed(2).replace(".",",")+" Mo";
	}else{
		sF = sF/1024;
		return sF.toFixed(2).replace(".",",")+" Ko";
	}
}

function DelFilesExist(rowDel,file,dir,empty){
	var Btn = ConfirmModal();
	$(Btn).click(function(){
		$.ajax({
			type:"POST",
			url:"log_exp_detail-API.asp",
			dataType:"json",
			data:{dir:file, typ:'delete'},
			success:function(data){
				ListFiles(dir,empty);
			},
			error:function(){
			}
		});
	});
}

function ConfirmModal(){
	var BtnConf = $('<button type="button" class="btn btn-primary Confdel" data-dismiss="modal"><i name="delup" class="fa fa fa-trash-o fa-lg"></i>'+delete_btn+'</button>');
	var BtnCanc = $('<button type="button" class="btn btn-primary" data-dismiss="modal" style="margin-bottom: 0px;"><i class="fa fa-times"></i>'+close_btn+'</button>');
	var Massage = $('<div class="alert alert-danger" role="alert">'+
									  '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'+
									  '<span class="sr-only">Error:</span>'+
									  confirm_delete+
									'</div>');
	
	var Mainmodal = $("<div>").attr({id:"DelItemModal",class:"modal fade",role:"dialog"}).css("margin","0 auto");
	var Dia_modal = $("<div>").attr("class","modal-dialog");
	var Con_modal = $("<div>").attr("class","modal-content");
	var Hea_modal = $("<div>").attr("class","modal-header").html('<button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title"> <i class="fa fa fa-trash-o fa-lg"></i>'+close_btn+'</h4>');
	var Bod_modal = $("<div>").attr("class","modal-body").html(Massage);
	var Foo_modal = $("<div>").attr("class","modal-footer").append(BtnCanc,BtnConf);
			
	Mainmodal.append(Dia_modal,Con_modal);
	Con_modal.append(Hea_modal,Bod_modal,Foo_modal);
	Dia_modal.append(Con_modal);
			
	$(Mainmodal).modal('show').promise().done(function(){

		$(Mainmodal).on('hidden.bs.modal', function () {
			$(this).data('bs.modal', null).remove();
		});
		
		$(Mainmodal).on('shown.bs.modal', function () {
		});

	});
	return BtnConf;
}

function GetCondition_BH_tab(id_ope,ope_con){ // Get Condition For if else in BoatingHistory()
  var condition = ope_con.indexOf(id_ope);
 	return condition;
}

function Checkfor_BH_tab(con1,con2,con3,con4,con5,con6){ // Check for Show or Hide BH tab
	if ( (con1=='TRUE' || con2 > 0) || (con3=='TRUE' || con4 > 0) || (con5=='TRUE' || con6 > 0) ){
  	$('#myTab li a[href="#BH"]').show();
  }else{
  	$('#myTab li a[href="#BH"]').hide();
  }
}
// Nut End 

// #### START Ham ####
	var delay = (function(){
  						var timer = 0;
  								return function(callback, ms){
    								clearTimeout (timer);
    								timer = setTimeout(callback, ms);
  								};
						})();

var StatObj={};
var Progress;
var SetloopCheck;
var ViewMode;
var FormStorge,RestData,StatOfAjax="";
var EMData={},ArrToMar={},CommentData={};
var AjaxQueue=[],AjaxQueueEmergency=[],AjaxMarina=[],AjaxComment=[],AjaxAccess=[];

var ImportExcel = (function(){
		var KeepOrder = {};
		var AllDataImport = [];
		var a = 1;
		var MainModal = "";
				
		var Call = function(){
		var TextArea = $('<textarea>').addClass("form-control").attr({"id":"TextExcel"}).css({"width":"100%","height":"470px"});
		  	TextArea = $("<div>").append(TextArea).css("margin-top","5px");
		var ContMatch = $('<div>').attr({"id":"ContMatch"});
		var BtnMatch = $('<button type="button" class="btn btn-primary" id="Match" disabled ><i class="fa fa-check"></i> '+row.lg_Match+'</button>');
		var AmountFound = 0;
		
		var LabelHeader = $('<button type="button" class="btn">').html('<i class="fa fa-question-circle" aria-hidden="true"></i> '+row.lg_import_header);
		var YesHeader = $('<button type="button" class="btn btn-primary header active">').val(1).html('<i class="fa fa-check" aria-hidden="true"></i> '+row.Yes);
		var NoHeader = $('<button type="button" class="btn btn-primary header">').val(0).html('<i class="fa fa-times" aria-hidden="true"></i> '+row.No);
		var BtnHeaser = $('<div class="btn-group pull-left" role="group">').attr("id","question").append(LabelHeader,YesHeader,NoHeader);
				MainModal = new BootstrapModal();
				MainModal.main.modal({backdrop: 'static', keyboard: false});//Set Modal no close when click outside or by keyboard
				MainModal.dialog.css({"min-width":"665px","max-width":"748px"});
				MainModal.header.append(
					'<button type="button" class="close" data-dismiss="modal"><i class="fa fa-times"></i></button>',
					'<i class="fa fa-download"></i> '+row.lg_excel_import
				);
				MainModal.body.append(
						$('<div>').addClass('row').append(
							$('<div>').attr("id","left")
								.addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12")
								.append(crew_info1,TextArea).show(),
							$('<div>').attr("id","right")
								.addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12")
								.append(ContMatch).hide()
						)).css("height","539px");
				
				var Import = $('<button type="button" class="btn btn-primary">')
											.attr({"id":"ConfiemImportExcel","disabled":""})
											.html('<i class="fa fa-download"></i> '+row.lg_Import)
											.hide();
				var Back = $('<button type="button" class="btn btn-primary" id="back"><i class="fa fa-arrow-circle-left"></i> '+row.Back+'</button>')
										.hide();
			
				var CloseBtn = '<button type="button" data-dismiss="modal" id="exit" class="btn btn-primary" style="margin-bottom: 0px;"><i class="fa fa-times"></i> '+row.lg_close+'</button>';
				MainModal.footer.append(
					$('<span>').attr("id","BtnFooter").append(BtnHeaser,Back,Import,BtnMatch).css("padding-right","5px"),
					$('<span>').append(CloseBtn));
				MainModal.do();
				Bind(MainModal);
	};
	var Exceute = function(Modal,stat){
			$("#ContMatch",Modal.body).empty();
				
			if(stat == 1){
				var row1 = $('#TextExcel',Modal.body).val().split("\n")[0];
				var row2 = $('#TextExcel',Modal.body).val().split("\n")[1];
			}else if(stat == 0){
				var row1 = $('#TextExcel',Modal.body).val().split("\n")[1];
				var row2 = $('#TextExcel',Modal.body).val().split("\n")[2];
			}
			
			if(typeof row1 != "undefined"){
				var Cells1 = row1.split("\t");
			}else{
				$('#ContMatch',Modal.body).html(crew_info2);
			}
			
			if(typeof row2 != "undefined"){
				var Cells2 = row2.split("\t");	
			}else{
				$('#ContMatch',Modal.body).html(crew_info2);
			}
			
			
			var GetVal = $('#TextExcel',Modal.body).val();
					GetVal = GetVal.replace(/(^[ \t]*\n)/gm, "");//.replace(/ /gm, "");
			if(GetVal != ""){
				var AllText = GetVal.split("\n");	
				$.each(AllText,function(index,value){
					if(value.replace(/\t/g, "") != ""){//Cut empty line
						AllDataImport.push(value.split("\t"));	
					}
				});
			}
			
			AmountFound = AllDataImport.length;
			if(stat == 1){
				AmountFound--;
			}
			
			if(AmountFound > 0 && typeof row1 != "undefined" && typeof row2 != "undefined"){
			var PassengerForm = $('#pototypeform div.row[pass]:first');
			var TextLabel = $(PassengerForm).find('.input-group-addon');
			var InputEl = $(PassengerForm).find("input[type=text]");
			var SelectEl = $(PassengerForm).find("select");
					InputEl = $.merge($(PassengerForm).find("select"), $(PassengerForm).find("input[type=text]"));
			var Arr = [];
			var i = 0;
			$.each(InputEl,function(key,el){
					var InputAddon = $('<div>').addClass("input-group-addon").html($(TextLabel[i]).html());
					var option = '<option value="-1"></option>';
					$.each(Cells2,function(index,value){
						option += "<option value="+index+">"+Cells1[index]+" - "+value+"</option>";
					});
					var SelectEl = $('<select>').addClass("form-control").attr("name",$(el).attr("name")).html(option);
					KeepOrder[$(el).attr("name")] = -1;
					var InputGroup = $("<div>").addClass("input-group").css({"width":"100%","margin-top":"5px"}).append(InputAddon,SelectEl);
					$("#ContMatch",Modal.body).append(InputGroup);
				i++;
			});
			
			$('#ContMatch',Modal.body).prepend(
				$('<div>')
					.addClass("alert alert-info")
					.append('<i class="fa fa-info-circle" aria-hidden="true"></i> We found <b>[ '+AmountFound+' ]</b> to import, please match the column from your import with our crew list data.')
			);
		}
	};
	var Clear = function(){
		AllDataImport = [];
		DataToSend = {};
		KeepOrder = {};
		AmountFound= 0;
	};
	var ClearModal = function(){
		MainModal = BootstrapModal();
	};
	var GoImport = function(stat){
		Modal = BootstrapModal();
		Modal.main.modal({backdrop: 'static', keyboard: false});//Set Modal no close when click outside or by keyboard
		Modal.body.html('<div class="alert alert-warning" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span> '+row.lg_confirm_import+'</div>');
		Modal.footer.html(
			'<button type="button" data-dismiss="modal" class="btn btn-primary" id="BtnCloseImport" style="margin-bottom: 0px;"><i class="fa fa-times"></i> '+row.No+'</button>'+
			'<button type="button" data-dismiss="modal" class="btn btn-primary" id="BtnConfirmImport" style="margin-bottom: 0px;"><i class="fa fa-check"></i> '+row.Yes+'</button>'
		);
		
		setTimeout(function(){
			Modal.do();	
		}, 200);
		
			$('#BtnConfirmImport',Modal.footer).click(function(){
				DoAjax(stat);
				MainModal.main.modal("hide");
			});
			$('#BtnCloseImport',Modal.footer).click(function(){
				MainModal.main.modal("show");
			});
		
		
	};
	var Ajax = function(InputValueObj){
			InputValueObj['id_command'] = StatObj.CheckCommandLink.id_command;
			InputValueObj['typ_command'] = StatObj.CheckCommandLink.typ_command;
			InputValueObj['SQL_TYP'] = StatObj.CheckCommandLink.SQL_TYP;
			InputValueObj['typ'] = "updaterow";
			InputValueObj['id_client'] = StatObj["id_client"];
	
			return $.ajax({
				url: '../API/ListPassengers.asp',
				type: 'POST',
				data: InputValueObj,
				Async: 'false',
				dataType:'json'
			});
	};
	var DoAjax = function(stat){
		Modal = BootstrapModal();
		Modal.main.modal({backdrop: 'static', keyboard: false});//Set Modal no close when click outside or by keyboard
		var alramEl = $('<div class="alert alert-info" role="alert" style="'+
					    			'width: 100%;'+
					    			'display: inline-flex;'+
					    			'line-height: 44px;'+
									'">'+
									'<div style="height: 71px;width: 78px;padding: 5px 5px 5px 5px;">'+
									'<i class="fa fa-user fa-5x" aria-hidden="true" style="color: #7799CC;"></i>'+
									'<i class="fa fa-circle-o-notch fa-spin" aria-hidden="true" style="position: absolute;left: 45px;top: 38px;color: #7799C;color: #FFFFFF;"></i>'+
									'</div>'+
									'<span style="'+
						    		'line-height: 71px;'+
						        '">'+"The passanger import is progressing."+'</span>'+
						        ' <span id="added" style="line-height: 71px;"></span>'+
        				'</div>');
		var DataToSend = {};
		var index = 0;
		if(stat == 1){//avoid if have header titles 
			index = 1;
		}
		var Amount = AllDataImport.length;
		var AmountAdded = 0;
		var DoData = function(index){//prepare passenger info
				var Passenger = AllDataImport[index];
				if(typeof Passenger != "undefined"){
					$.each(KeepOrder,function(key,MatchingIndex){
						if(typeof Passenger[MatchingIndex] != "undefined"){
							DataToSend[key] = window.btoa(unescape(encodeURIComponent(Passenger[MatchingIndex])))
						}
					});	
				}
				return DataToSend;
		}
		var SuccFunc = function(){
				AmountAdded++;
				$('#added',alramEl).html("&nbsp We have been added [ "+AmountAdded+" ] in "+AmountFound+".");
				index++;//next queue
				if(index < Amount){
					var SendAjax = Ajax(DoData(index));
					SendAjax.success(SuccFunc);
				}else{
					Clear();
					ClearModal();	
					var GetViewMode = ManageViewMode(CheckWindowSize());
					if(GetViewMode != ViewMode ){
						ViewMode = GetViewMode;
						Skipper_Construct(ViewMode);	
					}
					Crewlist_Construct();
					$(alramEl).addClass("alert-success").removeClass("alert-info");
					$('#added',alramEl).empty().html("&nbsp <b>Success!</b>, we imported <b>[ "+AmountAdded+" ]</b> crew.");
					setTimeout(function(){
						Modal.main.modal("hide");
						$('.modal ').modal("hide");
					}, 2000);
					MainModal = BootstrapModal();
				}
		}
		
		Modal.do();
		Modal.body.html(alramEl);
		var SendAjax = Ajax(DoData(index));//Start
				SendAjax.success(SuccFunc);
	};
	var Bind = function(Modal){
		
		$(document).ready(function(){
			$("#TextExcel",Modal.body).bind('input propertychange', function(){
				var GetVal = $(this).val();
						GetVal = GetVal.replace(/(^[ \t]*\n)/gm, "").replace(/ /gm, "");
				if(GetVal == ""){
					$("#Match",Modal.footer).attr("disabled","");
				}else{
					$("#Match",Modal.footer ).removeAttr("disabled");
				}
			});
		});
		
		$('#Match',Modal.footer).click(function(){
			$('#right',Modal.body).show(200);
    	$('#left',Modal.body).hide();
    	
    	$('#Match',Modal.footer).hide();
    	$('#question',Modal.footer).hide();
    	$('#ConfiemImportExcel',Modal.footer).show(200).attr("disabled","");
    	$('#back',Modal.footer).show(200);
			Exceute(Modal,$('.header.active',Modal.footer).val());
		});
		
		$(Modal.footer).on({
			"click":function(){
			$('#right',Modal.body).hide();
    	$('#left',Modal.body).show(200);
    	
    	$('#Match',Modal.footer).show(200);
    	$('#question',Modal.footer).show(200);
    	$('#ConfiemImportExcel',Modal.footer).hide();
    	$('#back',Modal.footer).hide();
    	Clear();
		}},'#back');
		
		$(Modal.body).on({
			"change":function(){
				$(this).addClass("Select-Active");
				if(parseInt($(this).val()) == -1 ){
					$(this).removeClass("Select-Active");
				}
				KeepOrder[$(this).attr("name")] = parseInt($(this).val());
				var FindClass = $(Modal.body).find(".Select-Active").length;
				if(FindClass > 0){
					$("#ConfiemImportExcel",Modal.footer).removeAttr("disabled");
				}else if(FindClass <= 0){
					$("#ConfiemImportExcel",Modal.footer).attr("disabled","");
				}
		}},'select');
		
		$(Modal.footer).on({
			"click":function(){
				$('button.header').removeClass("active");
				$(this).toggleClass("active");
		}},'button.header');
		
		$(Modal.footer).on({
			"click":function(){
				GoImport($('button.header.active',Modal.footer).val());
				MainModal.main.modal("hide");
		}},'#ConfiemImportExcel'); 
		
		$(Modal.footer).on({
			"click":function(){
				Clear();
				ClearModal();		
		}},'#exit'); 
		
	};
	
		
	return {Call:Call};
})();

/* ################## START ReSze ################*/
		$(window).resize(function(){
			var GetViewMode = ManageViewMode(CheckWindowSize());
			if(GetViewMode != ViewMode ){
				ViewMode = GetViewMode;
				Crewlist_Construct(ViewMode);	
			}
		}); 
/* ################## END ReSze ################*/

function CreatePassInfoForm(data){
	/*##### START Create Emergency Contacts  #####*/
									//if(StatObj.Emergenc){
										EmergencyContacts(data);
										//$('a[href="#EM"]').parent().show();
									//}else{
										//$('#EmergencyContain').hide();
										//$('#myTab li a[href="#EM"]').hide();
									//}
								/*##### END Create Emergency Contacts  #####*/
								
								/*##### START Arrival to the Marina #####*/
								if(StatObj.clss_ArrivalToMarina == ""){
									ArrivalMarinaForm(data);
								}else{
									$('#myTab > li a[href=#AM]').hide();
									$('#Main-ArriveToMarina').hide()
								}
								/*##### END Arrival to the Marina #####*/	
								
								/*##### START Comment #####*/
								 PassInfoCommment(data);
								 /*##### END Comment #####*/	
}

function CheckAllStat(){
 return  (StatObj["Access"]&&
				 StatObj["Address"]&&
				 StatObj["AddressOpe"]&&
				 StatObj["Cl_Ind"]&&
				 StatObj["Cl_Info"]&&
				 StatObj["Cl_ListPass"]&&
				 StatObj["EmailOpe"]&&
				 StatObj["Emergenc"]&&
				 StatObj["ImportOld"]&&
				 StatObj["PolygLot"]&&
				 StatObj["VDate"]);
}

function CallPassAccess(){
	return $.ajax({
		url: '../API/ListPassenger_access.asp',
		type: 'POST',
		data:{
			"id_command":StatObj.CheckCommandLink.id_command,
			"typ_command":StatObj.CheckCommandLink.typ_command,
			"SQL_TYP":StatObj.CheckCommandLink.SQL_TYP,
			"typ":"get",
			"id_client":StatObj.id_client},
		dataType:'json'
	});	
}

function ChangePassAccess(text,ACC_TYP){
	return $.ajax({
		url: '../API/ListPassenger_access.asp',
		type: 'POST',
		data:{
			"id_command":StatObj.CheckCommandLink.id_command,
			"typ_command":StatObj.CheckCommandLink.typ_command,
			"SQL_TYP":StatObj.CheckCommandLink.SQL_TYP,
			"typ":"update",
			"text":text,
			"ACC_TYP":ACC_TYP
		},
		dataType:'json',
		idAjax:Math.floor((Math.random() * 1000000) + 1),
		beforeSend:function(jqXHR){
			AjaxAccess.push({"this":this,"JqXHR":jqXHR});
			DocumentAccessManage("info");
		},
	});	
}

function CallListPass(){
	return $.ajax({
		url: '../API/ListPassengers.asp',
		type: 'POST',
		data:{"id_command":""+StatObj.CheckCommandLink.id_command+"","typ_command":""+StatObj.CheckCommandLink.typ_command+"","SQL_TYP":""+StatObj.CheckCommandLink.SQL_TYP+"","typ":"get","EmailOpe":""+StatObj.EmailOpe+""},
		dataType:'json'
	});
}

function CallListPass_OPEBK(){
	return $.ajax({
		url: '../API/ListPassengers.asp',
		type: 'POST',
		data:{"id_command":""+StatObj.CheckCommandLink.id_command+"","typ_command":""+StatObj.CheckCommandLink.typ_command+"","SQL_TYP":""+StatObj.CheckCommandLink.SQL_TYP+"","typ":"OPEBK"},
		dataType:'json'
	});
}

function CallImportPass(){
	return $.ajax({
		url: '../API/ImportPass.asp',
		type: 'POST',
		data:{"id_client":""+StatObj["id_client"]},
		dataType:'json'
	});
}

function CallPassInfo(){
	return $.ajax({
		url: '../API/PassInfo.asp',
		type: 'POST',
		data:{"id_command":""+StatObj.CheckCommandLink.id_command+"","typ_command":""+StatObj.CheckCommandLink.typ_command+"","SQL_TYP":""+StatObj.CheckCommandLink.SQL_TYP+"","Id_Info":StatObj.id_info,"typ":"get"},
		dataType:'json',
		Async: 'false',
	});
}

function ChangeEmergencyInfo(El){
	return $.ajax({
		url: '../API/PassInfo.asp',
		type: 'POST',
		data:{"id_command":""+StatObj.CheckCommandLink.id_command+"","typ_command":""+StatObj.CheckCommandLink.typ_command+"","SQL_TYP":""+StatObj.CheckCommandLink.SQL_TYP+"","Id_Info":StatObj.id_info,"typ":"changeEm","name":$(El).attr("name"),"text":window.btoa(unescape(encodeURIComponent($(El).val())))},
		dataType:'json',
		idAjax:Math.floor((Math.random() * 1000000) + 1),
		beforeSend:function(jqXHR){
			AjaxQueueEmergency.push({"this":this,"JqXHR":jqXHR});
			EmergencyProgressManage("info");
			WaitInsertPassInfo("wait",StatObj.id_info);
		},
	});
}

var QueueArriveToMarina = [];
var QueueChangeArriveToMarina = (function(){
    var add = function(El,KeepSuccess){
        var data = {"El":El,"KeepSuccess":KeepSuccess};
				QueueArriveToMarina.push([data]);
				ArrivalMarinaProgressManage("info");
				if(QueueArriveToMarina.length == 1){//Start
					doAjax(El);
				}
    };
    var next = function(El){
        var old = QueueArriveToMarina[0];//old
        StatDelete = deleteObj(old);
        if(StatDelete){
        	ArrivalMarinaProgressManage("info");
        	var idObj = QueueArriveToMarina[0];//Next
	       	if(typeof idObj != 'undefined' ){
	       		doAjax();
	       	}
        } 
    };
    var doAjax = function(El){
    	try{
	    	var value =	window.btoa(unescape(encodeURIComponent($(QueueArriveToMarina[0][0].El).val())))//window.btoa($(QueueArriveToMarina[0][0].El).val());
	    	var Ajax = ChangeArrivalToMarina(QueueArriveToMarina[0][0].El);
	      	Ajax.success(QueueArriveToMarina[0][0].KeepSuccess);
	      	Ajax.error(function(xhr, status, error){
		      	window.fail = "fail";
		      	ProgressManage("danger",this.idAjax);
		      	StatUpdate.options({
 							el:El,
 							typ:"error"
						})
						QueueChangeArriveToMarina.next(El);
						window.fail = "";
					});
	    }catch(e){
	    	window.fail = "fail";
				ProgressManage("danger",this.idAjax);
				StatUpdate.options({
 					el:El,
 					typ:"error"
				})
				QueueChangeArriveToMarina.next(El);
				window.fail = "";
	    };
    };
    var deleteObj = function(old){
    	AjaxQueueProgress();
    	QueueArriveToMarina.shift();//Delete
    	return true;
    }
    return {
        add:add,
        next:next,
        deleteObj:deleteObj
    };
}());

function ChangeArrivalToMarina(El){
	
	return $.ajax({
		url: '../API/PassInfo.asp',
		type: 'POST',
		data:{"id_command":""+StatObj.CheckCommandLink.id_command+"","typ_command":""+StatObj.CheckCommandLink.typ_command+"","SQL_TYP":""+StatObj.CheckCommandLink.SQL_TYP+"","Id_Info":StatObj.id_info,"typ":"changeAtm","name":$(El).attr("name"),"text":window.btoa(unescape(encodeURIComponent($(El).val())))},
		dataType:'json',
		idAjax:Math.floor((Math.random() * 1000000) + 1),
		beforeSend:function(jqXHR){
			AjaxMarina.push({"this":this,"JqXHR":jqXHR});
			ArrivalMarinaProgressManage("info");
			WaitInsertPassInfo("wait",StatObj.id_info);
		},
	});
}

function ChangePassInfoComment(El){
	return $.ajax({
		url: '../API/PassInfo.asp',
		type: 'POST',
		data:{"id_command":""+StatObj.CheckCommandLink.id_command+"","typ_command":""+StatObj.CheckCommandLink.typ_command+"","SQL_TYP":""+StatObj.CheckCommandLink.SQL_TYP+"","Id_Info":StatObj.id_info,"typ":"changeComment","name":$(El).attr("name"),"text":window.btoa(unescape(encodeURIComponent($(El).val())))},
		dataType:'json',
		idAjax:Math.floor((Math.random() * 1000000) + 1),
		beforeSend:function(jqXHR){
			AjaxComment.push({"this":this,"JqXHR":jqXHR});
			PassInfoCommmentProgressManage("info");
			WaitInsertPassInfo("wait",StatObj.id_info);
		},
	});
}

function RenderDocumentAccess(data){
	//console.log('RenderDocumentAccess: ',data);
	statePS = false, statePK = false, FilledPS = false, FilledPK = false, ReadonlyPS = false, ReadonlyPK = true;
	
	if(data.PS == 2){
		statePS = true;
		FilledPS = true;
	}else if(data.PS == 1){
		FilledPS = true;
	}else if(data.PS == 0){
		statePS = false;
		FilledPS = false;
	}
	
	if(data.SK == 2){
		statePK = true;
		FilledPK = true;
	}else if(data.SK == 1){
		FilledPK = true;
	}else if(data.SK == 0){
		statePK = false;
		FilledPK = false;
	}
	
	if(data.DirectClient == "ope" && data.Style == "6"){
		ReadonlyPK = true;
	}else if(data.DirectClient == "agt" && data.Style == "2"){
		if(data.PS == 1){
			$('#ListOfpass').hide().empty();
			$('#EmergencyContain').hide().empty();
			$('#ArrivalMarinaContain').hide().empty();
		}
	}else if(data.DirectClient == "ope" && data.Style == "2"){
		 ReadonlyPK = true
		 $('#accessText').html("Validated");
	}else if(data.DirectClient == "agt" && data.Style == "6"){
		 ReadonlyPK = false;
	}
	
	var Confirm_EmailAccess = (function(){
		var init = function(state,Target){
			$(Target).bootstrapSwitch('state', !state, true);
			var Modal = BootstrapModal();
					$(Modal.main).on('hidden.bs.modal', function (e) {
					  $(Target).bootstrapSwitch('disabled',false);
					})
					$(Modal.main).modal({backdrop: 'static', keyboard: false});
					Modal.header.html('<button type="button" class="close" data-dismiss="modal"><i class="fa fa-times"></i></button><i class="fa fa-envelope" aria-hidden="true"></i> '+lg_HeadModal_Confirm_Email_Access);
					Modal.body.append(Confirm_email);
					Modal.footer.append(
						'<button type="button" id="yes_send" class="btn btn-primary" style="margin-bottom: 0px;"><i class="fa fa-check"></i>  '+ledico_yes+'</button>',
						'<button type="button" data-dismiss="modal" id="no_send" class="btn btn-primary" style="margin-bottom: 0px;"></i><i class="fa fa-times"></i>  '+ledico_no+'</button>',
						'<button type="button" data-dismiss="modal" class="btn btn-primary" style="margin-bottom: 0px;"><i class="fa fa-times"></i>  '+close_btn+'</button>'
					);
					Modal.do();
					$('#yes_send',Modal.footer).click(function(){
						$('.close',Modal.header).hide();
	    			QueueAccessSwitch(state,Target,Modal,"send");
					});
					$('#no_send',Modal.footer).click(function(){
						$('.close',Modal.header).hide();
	    			QueueAccessSwitch(state,Target,Modal,"notsend")
					});
		};
		var QueueAccessSwitch = function(state,Target,Model,sendEmail){
			var text = 1;
			if(state == true){
				text = 2;
			}
			$(Target).bootstrapSwitch('disabled',true);
			AjaxQueueProgress();
			// ##### Start Massage #####
			Model.body.html(Update_Access_sending);
			Model.footer.empty();
			// ##### End Massage #####
			ChangeAccess = ChangePassAccess(text,$(Target).attr("name"));
			ChangeAccess.success(function(data){
				$(Target).bootstrapSwitch('disabled',false);
				$(Target).bootstrapSwitch('toggleState', true,true);//change the switch ##toggleState##
				DocumentAccessManage("success",this.idAjax);
				AjaxQueueProgress();
				// ##### Start Massage #####
				Model.body.html(Update_Access_success+"<br>");
				// ##### End Massage #####
				delay(function(){
					if(sendEmail == "send"){
						var Send = SendEmail(sendEmail,Model,$(Target).attr("name"),state);
					}else{
						delay(function(){
		    			$(Model.main).modal('hide');	
						},1000);	
					}
				},1000);
			});
			ChangeAccess.error(function(){
				$('#Message').empty();
				Model.body.html(Update_Access_error+"<br>");
				Model.footer.html(
					'<button type="button" id="retry" class="btn btn-primary" style="margin-bottom: 0px;"><i class="fa fa-repeat"></i>  '+lg_retry+'</button>'
				 	+'<button type="button" data-dismiss="modal" class="btn btn-primary" style="margin-bottom: 0px;"><i class="fa fa-times"></i>  '+close_btn+'</button>'
				);
				var idAjax = this.idAjax;
				$.each(AjaxAccess,function(index,ObjXHR){
					if(typeof ObjXHR != "undefined"){
						if(ObjXHR.this.idAjax == idAjax){
							if(AjaxAccess.length != 1){
								AjaxAccess.splice(index, 1);//Delete Ajax that Done	
							}else if(AjaxAccess.length == 1){
								AjaxAccess = [];
							}
						}
					}
				});
				$('#retry',Model.footer).unbind();
				$('#retry',Model.footer).click(function(){
					QueueAccessSwitch(state,Target,Model,sendEmail);
				});
			});
		};
		var SendEmail = function(typ,Model,Target,state){
			// ##### Start Massage #####
				var mass_error = $(Update_Access_Email_sending);
			// ##### End Massage #####
			Model.body.append(mass_error);
			return $.ajax({
				url:"../API/SendEmailAccess.asp",
				data:{
					id_agt:droits.ss_id_agt,
					id_ope:droits.id_ope_com,
					typ:typ,
					id_command:StatObj.CheckCommandLink.id_command,
					typ_command:StatObj.CheckCommandLink.typ_command,
					Target:Target,
					state:state,//Access or not Access
					id_client:StatObj.id_client
				},
				type:"POST",
				dataType:"json",
				success:function(data){
		    	// ##### Start Massage #####
		    	$(mass_error,Model.body).remove();
		    	Model.body.append(Update_Access_Email_success);
		    	//##### End Massage #####
		    	delay(function(){
		    		$(Model.main).modal('hide');	
					},1000);
		    },	
		    error:function(){
 					$(mass_error,Model.body).remove();
 					var Email_error_el = $(Update_Access_Email_error);
 					Model.body.append(Email_error_el);
 					Model.footer.html(
						'<button type="button" id="retry" class="btn btn-primary" style="margin-bottom: 0px;"><i class="fa fa-repeat"></i>  '+lg_retry+'</button>'
					 	+'<button type="button" data-dismiss="modal" class="btn btn-primary" style="margin-bottom: 0px;"><i class="fa fa-times"></i>  '+close_btn+'</button>'
					);
					$('#retry',Model.footer).unbind();
					$('#retry',Model.footer).click(function(){
						$(Email_error_el,Model.body).remove();
						SendEmail(typ,Model,Target,state);
					});
		    }
			});
		};
		return {params:init};
	}());
	
	$("[name='PS']").bootstrapSwitch({
		size:"mini",
		onColor:"success",
		offColor:"danger",
		onText:'<i class="fa fa-eye" aria-hidden="true"></i> '+ledico_yes,
		offText:'<i class="fa fa-eye-slash" aria-hidden="true"></i> '+ledico_no,
		readonly:ReadonlyPK,
		state:statePS,
		onSwitchChange:function(event, state){
			if(ss_auto == "6"){
				Confirm_EmailAccess.params(state,event.currentTarget);
			}
		}
	});
			
	$("[name='SK']").bootstrapSwitch({
		size:"mini",
		onColor:"success",
		offColor:"danger",
		onText:'<i class="fa fa-eye" aria-hidden="true"></i> '+ledico_yes,
		offText:'<i class="fa fa-eye-slash" aria-hidden="true"></i> '+ledico_no,
		readonly:ReadonlyPK,
		state:statePK,
		onSwitchChange:function(event, state){
			if(ss_auto == "6"){
				Confirm_EmailAccess.params(state,event.currentTarget);
			}
		}
	});
	
	$("[name='FilledPS']").bootstrapSwitch({
		size:"mini",
		onColor:"success",
		offColor:"danger",
		onText:'<i class="fa fa-check" aria-hidden="true"></i> '+ledico_yes,
		offText:'<i class="fa fa-times" aria-hidden="true"></i> '+ledico_no,
		readonly: true,
		state:FilledPS,
		onSwitchChange:function(event, state){}
	});
	
	$("[name='FilledSK']").bootstrapSwitch({
		size:"mini",
		onColor:"success",
		offColor:"danger",
		onText:'<i class="fa fa-check" aria-hidden="true"></i> '+ledico_yes,
		offText:'<i class="fa fa-times" aria-hidden="true"></i> '+ledico_no,
		readonly: true,
		state:FilledPK,
		onSwitchChange:function(event, state){}
	});
		
}

function DocumentAccessManage(typ,idAjax){
	$.each(AjaxAccess,function(index,ObjXHR){
		if(typeof ObjXHR != "undefined"){
			if(ObjXHR.this.idAjax == idAjax){
				if(AjaxAccess.length != 1){
					AjaxAccess.splice(index, 1);//Delete Ajax that Done	
				}else if(AjaxAccess.length == 1){
					AjaxAccess = [];
				}
			}
		}
	});
	if(typ == "success" && AjaxAccess.length == 0 ){
		AjaxQueueProgress();
	}else{
		$('#ArrivalMarinaProgress .alert-info span.Inqueue').html(AjaxAccess.length);
		AjaxQueueProgress();
	}
}

function ImportPass(){
	var Import = CallImportPass();
			Import.success().promise().done(function(data){
				
				var Modal = BootstrapModal();
						Modal.main.attr("id","importModel");
						Modal.header.append('<button type="button" class="close" data-dismiss="modal"><i class="fa fa-times"></i></button>','<i class="fa fa-download"></i> '+row.lg_passbtn_import);
						Modal.footer.html('<button type="button" data-dismiss="modal" class="btn btn-primary" style="margin-bottom: 0px;"><i class="fa fa-times"></i> '+row.lg_close+'</button>');
						Modal.OnHide(function(){
							//hide
						});
						Modal.OnShown(function(){
							var BoatModel = "";
							var BoatModelDate = "";
							var ItemEl = "";
							var pass = "";
							var GroupPassengers = [];
							var BtnAddAll;
							var NumberPass = 1;
						if(data.length == 0){
							Modal.body.append('<div class="alert alert-warning" role="alert">'+
																	'<span style="font-size: 25px;font-weight: bold;">'+
																	'<i class="fa fa-meh-o" aria-hidden="true"></i>'+
																	' Oops! No any Passenger from last booking.'+
																	'</span>'+
																'</div>').css("width","auto");	
						}else{
							Modal.dialog.css("width","90%");
							$.each(data,function(key,value){	
								if(value.id_command != StatObj.CheckCommandLink.id_command){
									if(value.model != BoatModel && value.datestart != BoatModelDate){
											BoatModel = value.model;
											BoatModelDate = value.datestart;
											GroupPassengers = [];
											GroupPassengers.push(value);
											BtnAddAll = $('<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">').append($('<button type="button" class="btn btn-primary addAllPass pull-right"><i class="fa fa-users"></i> '+row.lg_addall+' ( <span class="AmountPass"></span> )</button>').data('info',GroupPassengers));
											NumberPass = 1;
											
											$(BtnAddAll).find('.AmountPass').html($(BtnAddAll).find('button').data('info').length);//Amount of Passengers
											var Boat = $('<div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">').append('<i class="fa fa-ship"></i> '+value.model);
											var Date = $('<div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">').append('<i class="fa fa-calendar"></i> '+value.datestart+' To '+value.dateend);
											var head = $('<div class="row">').append(Boat,Date,BtnAddAll);
											var media = $('<div>').addClass('media ImportList');
											Firstname = "";
											if(value.Firstname !== null){
												Firstname = value.Firstname;
											}
											Lastname = "";
											if(value.Name !== null){
												Lastname = value.Name;
											}
		
											var listNamePass = $('<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 listNamePass">')
																					.append($('<div class="input-group"><span class="input-group-addon">'+NumberPass+'. </span><span type="text" class="form-control">'+Firstname+" "+Lastname+'</span>')
																					.append($('<span class="btn btn-primary input-group-addon addPass" id="basic-addon1"><i class="fa fa-user-plus"></i></span>').data('info',value)));
											
													pass = $('<div>').addClass('row').append(listNamePass);
											
											var mediaBody = $('<div>').addClass('media-body').append(head,pass);
													ItemEl = mediaBody;
													Modal.body.append($(media).append(mediaBody));
											
									}else if (value.model == BoatModel && value.datestart == BoatModelDate){
										if(value.Firstname !== null){
											Firstname = value.Firstname;
										}
										Lastname = "";
										if(value.Name !== null){
											Lastname = value.Name;
										}
										GroupPassengers.push(value);
										NumberPass++;
										$(BtnAddAll).find('.AmountPass').html($(BtnAddAll).find('button').data('info').length);//Amount of Passengers
										var listNamePass = $('<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 listNamePass">')
																				.append($('<div class="input-group"><span class="input-group-addon">'+NumberPass+'. </span><span type="text" class="form-control">'+Firstname+" "+Lastname+'</span>')
																				.append($('<span class="btn btn-primary input-group-addon addPass" id="basic-addon1"><i class="fa fa-user-plus"></i></span>').data('info',value)));										
										$(pass).append(listNamePass);
									}
								}
							});
						}
							$(Modal.main).on({
								"click":function(){
									
									if($("#PassForm div[pass]").length == 0){//When no have passenger
										CreatePassFormListSpecial(1,"");	
										var RowPaste = $("#PassForm div[pass]")[0];
									}else{
										var RowPaste = addOncrow();	
									}
								
								var InputsToPaste_AllInPuts = $(RowPaste).find('input');
								var InputsToPaste = $(RowPaste);
										if (droits.catamaran_fleet && 0) { //Nut add 08/06/2017
											$(InputsToPaste).find('input[name="LastName"]').val($(this).data('info').Name);
											$(InputsToPaste).find('input[name="Address"]').val($(this).data('info').Address);
											$(InputsToPaste).find('input[name="AddressOPE"]').val($(this).data('info').AddressOpe);
											$(InputsToPaste).find('input[name="City"]').val($(this).data('info').AddressOpe);
											$(InputsToPaste).find(':input[name=State]').val($(this).data('info').state);
											$(InputsToPaste).find('input[name="Zipcode"]').val($(this).data('info').zip);
											$(InputsToPaste).find(':input[name=Country]').val($(this).data('info').country);
											$(InputsToPaste).find('input[name="Email"]').val($(this).data('info').Email);
											$(InputsToPaste).find('input[name="EmailOPE"]').val($(this).data('info').EmailOpe);
											$(InputsToPaste).find('input[name="Date"]').val($(this).data('info').Birthdate);
											$(InputsToPaste).find('input[name="DateArrival"]').val($(this).data('info').dat_arrival);
											$(InputsToPaste).find('input[name="AirNum"]').val($(this).data('info').air_num);
											$(InputsToPaste).find('input[name="AirTime"]').val($(this).data('info').air_time);
											$(InputsToPaste).find('input[name="FerryNum"]').val($(this).data('info').ferry_num);
											$(InputsToPaste).find('input[name="FerryTime"]').val($(this).data('info').ferry_time);
											$(InputsToPaste).find('input[name="WestEnd"][value=' + $(this).data('info').west_end + ']').prop('checked', true);
											$(InputsToPaste).find('input[name="RoadTown"][value=' + $(this).data('info').road_town + ']').prop('checked', true);
										} else {
											$(InputsToPaste).find('input[name="LastName"]').val($(this).data('info').Name);
											$(InputsToPaste).find('input[name="FirstName"]').val($(this).data('info').Firstname);
											$(InputsToPaste).find('input[name="Email"]').val($(this).data('info').Email);
											$(InputsToPaste).find('input[name="Address"]').val($(this).data('info').Address);
											$(InputsToPaste).find('input[name="EmailOPE"]').val($(this).data('info').EmailOpe);
											$(InputsToPaste).find('input[name="EmailOPE"]').val($(this).data('info').AddressOpe);
											$(InputsToPaste).find('input[name="Date"]').val($(this).data('info').Birthdate);
											$(InputsToPaste).find('input[name="Nationality"]').val($(this).data('info').Nation);
											$(InputsToPaste).find('input[name="PassPort"]').val($(this).data('info').Passport);
											$(InputsToPaste).find('input[name="Expiration"]').val($(this).data('info').Expiration);
											$(InputsToPaste).find('input[name="shoesize"]').val($(this).data('info').Shoesize);
											$(InputsToPaste).find('input[name="Residence"]').val($(this).data('info').residence); //Nut add 31/05/2017
											$(InputsToPaste).find(':input[name="typeCrew"]').val($(this).data('info').crew_type); //Nut add 08/06/2017
										}
										var InputValueObj = {};
										$.each(InputsToPaste_AllInPuts,function(key,value){
											InputValueObj[$(this).attr('name')] = window.btoa(unescape(encodeURIComponent($(this).val())))
										});
										
										UpdateAllRowListPass(InputValueObj,RowPaste);
							}},'.addPass');
							
							$(Modal.main).on({
								"click":function(){
									ImportAllPass($(this).data('info')[0].id_command,$(this).data('info')[0].typ);
							}},'.addAllPass');
							
						});
						Modal.do();
			});
}

function ImportAllPass(old_id_command,Old_typ){
	UpdateAllRowListPass_modal.do();
	$.ajax({
		url: '../API/ListPassengers.asp',
		type: 'POST',
		data:{
			"id_command":""+StatObj.CheckCommandLink.id_command+"",
			"typ_command":""+StatObj.CheckCommandLink.typ_command+"",
			"SQL_TYP":""+StatObj.CheckCommandLink.SQL_TYP+"",
			"typ":"importall",
			"old_id_command":old_id_command,
			"Old_typ":Old_typ
		},
		Async: 'false',
		dataType:'json',
		success:function( data ){
			var GetViewMode = ManageViewMode(CheckWindowSize());
			if(GetViewMode != ViewMode ){
				ViewMode = GetViewMode;
				Skipper_Construct(ViewMode);	
			}
			
			Crewlist_Construct();
			UpdateAllRowListPass_modal.hide();
			GetCrewListElement();
		},
		error:function(){
			//flase
		}
	});
}

var QueueUpdateListPass = (function(){
		var add = function(id_command,ThisEl){
				Id_pass = $(ThisEl).parents("div.row[listpass]").attr("pass");
				
		    var data = {"id_command":id_command,"ThisEl":ThisEl};
				var idObj = Math.floor((Math.random() * 1000000) + 1);
				QueueCallFunction[idObj] = data;
				if(Object.keys(QueueCallFunction).length == 1 || Id_pass == "new" ){//Start
					try{
						var value =	window.btoa(unescape(encodeURIComponent($(QueueCallFunction[idObj].ThisEl).val())));
						UpdateListPass(QueueCallFunction[idObj].id_command,QueueCallFunction[idObj].ThisEl,idObj);
					}catch(e){
						window.fail = "fail";
						ProgressManage("danger",this.idAjax);
						var Btn = ConfirmErorModal($(QueueCallFunction[idObj].ThisEl).val());
						$(Btn).on('hidden.bs.modal', function(e) {
						  QueueUpdateListPass.deleteObj(idObj);
						  QueueUpdateListPass.next();
						  window.fail = "";
						});
					}
				}
		};
		var next = function(){
		    var NextQueue = Object.keys(QueueCallFunction)[0];
		   	if(typeof NextQueue != 'undefined' ){
		   		try{
		   			var value =	window.btoa(unescape(encodeURIComponent($(QueueCallFunction[NextQueue].ThisEl).val())))//window.btoa($(QueueCallFunction[NextQueue].ThisEl).val());
		    		UpdateListPass(QueueCallFunction[NextQueue].id_command,QueueCallFunction[NextQueue].ThisEl,NextQueue);	
		    	}catch(e){
		    		window.fail = "fail";
						ProgressManage("danger",this.idAjax);
						var Btn = ConfirmErorModal($(QueueCallFunction[NextQueue].ThisEl).val());
						$(Btn).on('hidden.bs.modal', function(e) {
						  QueueUpdateListPass.deleteObj(NextQueue);
						  QueueUpdateListPass.next();
						  window.fail = "";
						});
		    	}
		    }
		};
		var deleteObj = function(idObj){
			delete QueueCallFunction[idObj];
		}
		return {
		  add:add,
		  next:next,
		  deleteObj:deleteObj
		};
}());

function UpdateListPass(id_command,ThisEl,idObj){
	var ThisEl = $(ThisEl);
	/* Nut add 22/06/2017 */
	if (droits.catamaran_fleet && 0) {
		if ($(ThisEl).attr('name') == 'RoadTown' || $(ThisEl).attr('name') == 'WestEnd') {
			if ($(ThisEl).is(':checked')) {
				TextValue = '1';
			} else {
				TextValue = '0';
			}
		} else {
			TextValue = $(ThisEl).val();
		}
	} else {
		TextValue = $(ThisEl).val();
	}
	/* End Nut */
	var Id_pass = $(ThisEl).parents("div.row[listpass]").attr("pass"),
			typUpdate = $(ThisEl).attr("name");
			
	if( Id_pass == "new"){
		StatOfAjax = "Stop";
		WaitForApi("wait","<b>Please wait...</b> We are adding the new Passenger.");
		$.each(AjaxQueue,function(key,value){
			AjaxQueue[key].JqXHR.abort();
		});
	}
	
	if($(ThisEl).attr("name") == "Gender"){
		$(ThisEl).parents('.btn-group').find("label").attr("disabled","").css("pointerEvents","none");
	}
	
	$.ajax({
	url: '../API/ListPassengers.asp',
	type: 'POST',
	data:{"id_command":""+StatObj.CheckCommandLink.id_command+"","typ_command":""+StatObj.CheckCommandLink.typ_command+"","SQL_TYP":""+StatObj.CheckCommandLink.SQL_TYP+"","typ":"update","TextValue":""+window.btoa(unescape(encodeURIComponent(TextValue)))+"","Id_pass":""+Id_pass+"","typUpdate":""+typUpdate+"","EmailOpe":""+StatObj.EmailOpe+"","id_client":""+StatObj.id_client+""},
	dataType:'json',
	idAjax:Math.floor((Math.random() * 1000000) + 1),
	Elinput:ThisEl,
	beforeSend:function(jqXHR){
			if( Id_pass != "new" && StatOfAjax != "Stop"){//StatOfAjax for dont let the ajax that have stoped push itself agant.
				AjaxQueue.push({"this":this,"JqXHR":jqXHR});
				 AjaxQueueProgress();
			}
	},
	success:function(data){
		var ThisAjax = this;
		if(AjaxQueue.length > 0){
			$.each(AjaxQueue,function(index,ObjXHR){
				if(typeof ObjXHR != "undefined"){
					
					if(ObjXHR.this.idAjax == ThisAjax.idAjax){
						if(AjaxQueue.length != 1){
							AjaxQueue.splice(index, 1);//Delete Ajax that Done	
						}else if(AjaxQueue.length == 1){
							AjaxQueue = [];
						}
					}
				}
			});
			
			if( Id_pass == "new"){
				//ResendAjax(this.idAjax);	
			}
		}
		if(data.mass){
			if( Id_pass == "new" ){
				PutBtnDeleteAndCopy(data,$(ThisEl));
				addOncrow();
				//$(ThisAjax.Elinput).attr("style","");
				//$(ThisAjax.Elinput).data("stat","");
			}else{
				RestData = data.mass
				$(ThisEl).parents("div.row").find(".colDel > .delBtn").html('<i class="fa fa-trash"></i>');	
				//$(ThisAjax.Elinput).attr("style","");
				//$(ThisAjax.Elinput).data("stat","");	
			}
		}
			
		QueueUpdateListPass.deleteObj(idObj);
		QueueUpdateListPass.next();

		
		if($(ThisEl).attr("name") == "Gender"){
			$(ThisEl).parents('.btn-group').find("label").removeAttr("disabled","").css("pointerEvents","auto");
		}
	
		DisplayDelAllPassBtn();
		StatUpdate.options({
			el:ThisEl,
			typ:"success"
		})
		$(ThisEl).data("KeepValue",data.mass)
		AjaxQueueProgress();
		GetCrewListElement();
	},
	error:function(xhr, status, error){
		window.fail = "fail";
		StatUpdate.options({
			el:ThisEl,
			typ:"error"
		})
  	ProgressManage("danger",this.idAjax);
		QueueUpdateListPass.deleteObj(idObj);
		QueueUpdateListPass.next();
		window.fail = "";
	}
	}).done(function(){
		if(Id_pass == "new"){
			WaitForApi("success","<b> well done!</b> The Passenger has been added.");			
		}
		
	});
		
}

function ResendAjax(idAjax){
	$.each(AjaxQueue,function(key,value){//Resend Ajax in Queue Again
		if(AjaxQueue[key].JqXHR.statusText == "abort"){
			$.ajax(AjaxQueue[key].this);
		}
	});
}

var UpdateAllRowListPass_modal = (function(){
	var Modal = BootstrapModal();
	var openModal = function (){
		$(Modal.main).modal({backdrop: 'static', keyboard: false});
		Modal.dialog.css({"max-width":"30%"});
		Modal.header.html(
			'<i class="fa fa-download"></i> Addition Passenger'
		);
		Modal.body.html(
			'<div class="alert alert-info" role="alert" style="'+
    		'width: 100%;'+
    		'display: inline-flex;'+
    		'line-height: 44px;'+
			'">'+
			'<div style="height: 71px;width: 78px;padding: 5px 5px 5px 5px;">'+
			'<i class="fa fa-user fa-5x" aria-hidden="true" style="color: #7799CC;"></i>'+
			'<i class="fa fa-circle-o-notch fa-spin" aria-hidden="true" style="position: absolute;left: 45px;top: 38px;color: #7799C;color: #FFFFFF;"></i>'+
			'</div>'+
			'<span style="'+
    		'line-height: 71px;'+
        '">'+"<b>Please wait!</b>, we are adding the passenger."+'</span>'+
        '</div>');
		Modal.do();
	};
	var hideModal = function (){
		$('div',Modal.body).attr("class","alert alert-success");
		$('span',Modal.body).empty().html("<b>Success!</b>, The passenger has been added.");
		setTimeout(function(){
			Modal.OnHide(function(){});
			$(Modal.main).modal("hide");	
		}, 1500);
		
	};
	return {
		do:openModal,
		hide:hideModal	
	}
}());

function UpdateAllRowListPass(InputValueObj,ThisEl){
	InputValueObj['id_command'] = StatObj.CheckCommandLink.id_command;
	InputValueObj['typ_command'] = StatObj.CheckCommandLink.typ_command;
	InputValueObj['SQL_TYP'] = StatObj.CheckCommandLink.SQL_TYP;
	InputValueObj['typ'] = "updaterow";
	InputValueObj['id_client'] = StatObj["id_client"];
	
	UpdateAllRowListPass_modal.do();
		
	$.ajax({
		url: '../API/ListPassengers.asp',
		type: 'POST',
		data: InputValueObj,
		Async: 'false',
		dataType:'json',
		success:function( data ){
			if(ThisEl != ""){
				PutBtnDeleteAndCopy(data,ThisEl)
				DisplayDelAllPassBtn();
			}
			UpdateAllRowListPass_modal.hide();
			GetCrewListElement();
		},
		error:function(){
			//flase
		}
	});
	
}

function addOncrow(){//Add more a Empty Form for every Typeforms
	RowOfPass = $('div#PassForm .row[pass]');
	NumberOfNewPass = RowOfPass.length;
	GetRowElement = $('div#PassForm .row[pass]')[0];
	ReuseElement = $(GetRowElement).clone();
		$(ReuseElement).attr("pass","new");
		$(ReuseElement).find(".listNumber").text(NumberOfNewPass+1);
		$(ReuseElement).find(".colDel div[role]").empty();
	  $(ReuseElement).find("input.pass").val("");
	  $(ReuseElement).find(".Gender").removeClass("active");//When Spcialform have Gender button
	$('#PassForm').append(ReuseElement);
	return ReuseElement;
}

function DeleteListPass(Dellist){
	$.ajax({
		url: '../API/ListPassengers.asp',
		type: 'POST',
		data:{
			"id_command":StatObj.CheckCommandLink.id_command,
			"typ_command":StatObj.CheckCommandLink.typ_command,
			"SQL_TYP":StatObj.CheckCommandLink.SQL_TYP,
			"typ":"del",
			"Id_pass":Dellist,
			"EmailOpe":StatObj.EmailOpe
		},
		dataType:'json',
		success:function( data ){
			if(data){
				pass = data;
				ManageRowPassList(data);
			}
			DisplayDelAllPassBtn();
			GetCrewListElement();
			GetCrewListElement();
		},
		error:function(){
			//Flase
		}
	});	
}

function DeleteAllPass(){
	var GetAllIdPass = $('#PassForm div.row[pass]:not(div.row[pass=new])');
	var KeepAllId = "";
	$.each(GetAllIdPass,function(key,value){
		if(GetAllIdPass.length == key+1){
			KeepAllId = KeepAllId+$(value).attr("pass");
		}else{
			KeepAllId = KeepAllId+$(value).attr("pass")+",";
		}
	});
	DeleteListPass(KeepAllId);
}

function CreatePassFormList(amount,Passdata){
//	FormStorge = Passdata;
//	$('#PassForm').empty();
//	for (i = 0; i < amount; i++) {
//		var inputEl = $('<input>').attr({class:"form-control pass",type:"text"});
//		var NumberBtn = $('<div>').addClass('input-group-addon labelNo').append(i+1+".");
//		var Pass_LastName="",
//				Pass_FirstName="",
//				
//				Pass_EmailOpe = "",
//				Pass_AddressOpe = "",
//				
//				Pass_Email="",
//				Pass_Address="",
//				
//				Pass_BirthDate="",
//				Pass_Nationality="",
//				Pass_Residence="", //Nut add 31/05/2017
//				Pass_typeCrew="", //Nut add 08/06/2017
//				Pass_City="", //Nut add 08/06/2017
//				Pass_State="", //Nut add 08/06/2017
//				Pass_Zipcode="", //Nut add 08/06/2017
//				Pass_Country="", //Nut add 08/06/2017
//				Pass_BirthDate="", //Nut add 08/06/2017
//				Pass_DateArrival="", //Nut add 08/06/2017
//				Pass_AirNum="", //Nut add 08/06/2017
//				Pass_AirTime="", //Nut add 08/06/2017
//				Pass_FerryNum="", //Nut add 08/06/2017
//				Pass_FerryTime="", //Nut add 08/06/2017
//				Pass_WestEnd="", //Nut add 08/06/2017
//				Pass_RoadTown="", //Nut add 08/06/2017
//				Pass_Poart="",
//				Pass_Expiration="",
//				Pass_id="new",
//				Pass_ShoeSize ="" ,
//				DeleteBtn = "",
//				Copyinfo = "";
//		if(Passdata[i]){
//			Pass_LastName = Passdata[i].nom;
//			Pass_FirstName = Passdata[i].Prenom;
//			
//			Pass_EmailOpe = Passdata[i].EmailOpe;
//			Pass_AddressOpe = Passdata[i].AddressOpe;
//			
//			Pass_Email = Passdata[i].Email;
//			Pass_Address = Passdata[i].address;
//				
//			Pass_BirthDate = Passdata[i].BirthDate;
//			Pass_Nationality = Passdata[i].Nation;
//			Pass_Residence = Passdata[i].residence; //Nut add 31/05/2017
//			Pass_typeCrew = Passdata[i].crew_type; //Nut add 01/06/2017
//			Pass_City = Passdata[i].City; //Nut add 08/06/2017
//			Pass_State = Passdata[i].State; //Nut add 08/06/2017
//			Pass_Zipcode = Passdata[i].Zipcode; //Nut add 08/06/2017
//			Pass_Country = Passdata[i].Country; //Nut add 08/06/2017
//			Pass_BirthDate = Passdata[i].BirthDate; //Nut add 08/06/2017
//			Pass_DateArrival = Passdata[i].DateArrival; //Nut add 08/06/2017
//			Pass_AirNum = Passdata[i].AirNum; //Nut add 08/06/2017
//			Pass_AirTime = Passdata[i].AirTime; //Nut add 08/06/2017
//			Pass_FerryNum = Passdata[i].FerryNum; //Nut add 08/06/2017
//			Pass_FerryTime = Passdata[i].FerryTime; //Nut add 08/06/2017
//			Pass_WestEnd = Passdata[i].WestEnd; //Nut add 08/06/2017
//			Pass_RoadTown = Passdata[i].RoadTown; //Nut add 08/06/2017
//			Pass_Poart = Passdata[i].PassPort;
//			Pass_Expiration = Passdata[i].Validity;	
//			Pass_id = Passdata[i].id_pass;
//			Pass_ShoeSize = Passdata[i].Pointure ,
//			DeleteBtn = $('<button type="button" class="btn btn-primary delBtn"><i class="fa fa-trash"></i></button>');	
//			Copyinfo = $('<button type="button" class="btn btn-primary copyBtn"><i class="fa fa-clone"></i><i class="fa fa-stop-circle" style="display: none"></i></button>');	
//		}
//		var groupBtnLastname = $('<div>')
//														.addClass('input-group')
//														.css('width','100%')
//														.append(
//															NumberBtn,
//															$(inputEl).clone().val(Pass_LastName).attr({"name":"LastName"})
//														);
//
//		var groupBtn_ShoeSize_BtnDel = $('<div>')
//															.addClass('row')
//															.append(
//																$('<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">')
//																.append($(inputEl).clone().val(Pass_ShoeSize).attr({"name":"shoesize"})),
//																$('<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 colDel">')
//																.append($('<div role="group">').append($(DeleteBtn).css("width","45%"),$(Copyinfo).css("width","45%")))
//															);
//																									
//		var AllStat = CheckAllStat();
//			if(AllStat){
//				var ClassCol = "col-lg-1 col-md-1 col-sm-1 col-xs-1";
//			}else{
//				var ClassCol = "col-lg-2 col-md-2 col-sm-2 col-xs-2";
//			}
//											
//		var LastName     = $('<div class="'+ClassCol+'" >').append(groupBtnLastname),
//				FirstName    = $('<div class="'+ClassCol+'" >').append($(inputEl).clone().val(Pass_FirstName).data("KeepValue",Pass_FirstName).attr({"name":"FirstName"})),
//				PlaceOfBirth = $('<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1" >').append($(inputEl).clone().val(Pass_Expiration).data("KeepValue",Pass_Expiration).attr({"name":"Expiratio00n"})),
//				Email        = $('<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1" >').append($(inputEl).clone().val(Pass_Email).data("KeepValue",Pass_Email).attr({"name":"Email"})),/*Broker Email*/
//				Address      = $('<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1" >').append($(inputEl).clone().val(Pass_Address).data("KeepValue",Pass_Address).attr({"name":"Address"})),/*Broker Address*/
//				EmailOpe     = $('<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1" >').append($(inputEl).clone().val(Pass_EmailOpe).data("KeepValue",Pass_EmailOpe).attr({"name":"EmailOPE"})),/*Ope Email*/
//				AddressOpe   = $('<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1" >').append($(inputEl).clone().val(Pass_AddressOpe).data("KeepValue",Pass_AddressOpe).attr({"name":"AddressOPE"})),/*Ope Address*/
//				Date         = $('<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1" >').append($(inputEl).clone().addClass('datepicker').val(Pass_BirthDate).data("KeepValue",Pass_BirthDate).attr({"name":"Date"})),
//				Nationality  = $('<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1" >').append($(inputEl).clone().val(Pass_Nationality).data("KeepValue",Pass_Nationality).attr({"name":"Nationality"})),
//				Residence  	 = $('<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1" >').append($(inputEl).clone().val(Pass_Residence).data("KeepValue",Pass_Residence).attr({"name":"Residence"})), //Nut add 31/05/2017
//				PassPort     = $('<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1" >').append($(inputEl).clone().val(Pass_Poart).data("KeepValue",Pass_Poart).attr({"name":"PassPort"})),
//				Expiration   = $('<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1" >').append($(inputEl).clone().val(Pass_Expiration).data("KeepValue",Pass_Expiration).attr({"name":"Expiration"})),
//				Mobile       = $('<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1" >').append($(inputEl).clone().val(Pass_Expiration).data("KeepValue",Pass_Expiration).attr({"name":"Expiration33"})),
//				ShoeSize     = $('<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1" >').append($(inputEl).clone().val(Pass_ShoeSize).attr({"name":"shoesize"})),
//				DelAndCopy   = $('<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1" >').append($('<div role="group">').append($(DeleteBtn).css("width","45%"),$(Copyinfo).css("width","45%")));
//				
//				
//				if (!StatObj.Address){Email = ''}
//				if (!StatObj.Address){Address = ''}
//				if (!StatObj.EmailOpe){EmailOpe = ''}
//				if (!StatObj.AddressOpe){AddressOpe = ''}
//				if (StatObj.clss_birthplace == "none"){PlaceOfBirth = ''}
//				if (StatObj.clss_nation == "none"){Nationality = ''}
//				if (StatObj.clss_residence == "none"){Residence = ''} //Nut add 31/05/2017
//				if (StatObj.clss_passpo == "none"){PassPort = ''}
//				if (StatObj.clss_validi == "none"){Expiration = ''}
//				if (StatObj.clss_pointu == "none"){ShoeSize = ''}
//				if (StatObj.clss_mobile == "none"){Mobile = ''}
//				
//		var Row = $('<div>').attr({"class":"row","pass":Pass_id,"listpass":""});
//		var PrintnewRow = $(Row).append(LastName,FirstName,Email,Address,EmailOpe,AddressOpe,Date,PlaceOfBirth,Nationality,Residence,PassPort,Expiration,ShoeSize,Mobile,DelAndCopy);
//		$('#PassForm').append(PrintnewRow);
//	}
}

function CreatePassFormListSpecial(amount,Passdata){
	FormStorge = Passdata;
	$('#PassForm').empty();
	if (droits.catamaran_fleet && 0) {
		var BtnYes = $('<button type="button" class="btn btn-default">').attr({"name":"ATM_Taxi","id":"ArrYes"}).val(1)
					.html('<i class="fa fa-check" aria-hidden="true"></i> '+ledico_yes),
				BtnNo = $('<button type="button" class="btn btn-default">').attr({"name":"ATM_Taxi","id":"ArrNo"}).val(0)
					.html('<i class="fa fa-times" aria-hidden="true"></i> '+ledico_no);
		var RequireArrivalTransfer = $('<div class="btn-group" role="group" aria-label="Second group">').attr("id","RegArrTra").append(BtnYes,BtnNo);
		$('#PassForm').append(
			'<p>Please provide flight arrival information no later than four weeks prior to your departure.<br>' +
			'Without the information below we will <strong>NOT</strong> be able to guarantee transportation from the airport or ferry dock.<br>' +
			'Transportation costs are not included in the charter rate.</p>' +
			'<p><strong>NOTE: </strong>If using the ferry please include the name of the ferry service and the ferry’s departure time.</p>'
		);
		$('#PassForm').append('Transportation needed: ', RequireArrivalTransfer);
		$('button[name=ATM_Taxi]').on({
			"click":function(event){
				event.preventDefault();
				var El = $(this);
				$('button[name=ATM_Taxi]').removeClass('active');
				$(this).addClass('active');
				if($(this).attr("id") == "ArrYes"){
					$('#ArrYes').parent().find('#ArrNo').removeClass('btn-danger').addClass('btn-default')
					$(this).removeClass('btn-default').addClass("btn-success");
				}else{
					$('#ArrYes').parent().find('#ArrYes').removeClass('btn-success').addClass('btn-default')
					$(this).removeClass('btn-default').addClass("btn-danger");
				}
				if($(El).val() != ArrToMar.ATM_Taxi ){
					QueueChangeArriveToMarina.add(El,function(data,idObj,idAjax){
						WaitInsertPassInfo("success",StatObj.id_info);
						ArrToMar["ATM_Taxi"] = data.mass;
						UpdateIdInfo(data);
						ArrivalMarinaProgressManage("success",this.idAjax);
						WaitInsertPassInfo("success",this.idAjax);
						QueueChangeArriveToMarina.next();
					});
				}
				
		}});
	}
	for (i = 0; i < amount; i++) {
		var inputEl = $('<input>').attr({class:"form-control pass",type:"text"});
		var NumberBtn = $('<div>').addClass('input-group-addon labelNo');
		var Pass_LastName="",
				Pass_FirstName="",
				Pass_PlaceOfBirth="",
				Pass_Gender="",
				
				Pass_EmailOpe = "",
				Pass_AddressOpe = "",
				
				Pass_Email="",
				Pass_Address="",
				
				Pass_Age="",
				Pass_DateOfBirth="",
				Pass_Nationality="",
				Pass_Residence="", //Nut add 31/05/2017
				Pass_typeCrew="", //Nut add 08/06/2017
				Pass_City="", //Nut add 08/06/2017
				Pass_State="", //Nut add 08/06/2017
				Pass_Zipcode="", //Nut add 08/06/2017
				Pass_Country="", //Nut add 08/06/2017
				Pass_BirthDate="", //Nut add 08/06/2017
				Pass_DateArrival="", //Nut add 08/06/2017
				Pass_AirNum="", //Nut add 08/06/2017
				Pass_AirTime="", //Nut add 08/06/2017
				Pass_FerryNum="", //Nut add 08/06/2017
				Pass_FerryTime="", //Nut add 08/06/2017
				Pass_WestEnd="", //Nut add 08/06/2017
				Pass_RoadTown="", //Nut add 08/06/2017
				Pass_Passport ="",
				Pass_Expiration = "",
				Pass_ShoeSize = "",
				Pass_Mobile="",
				Pass_SailingExp="",
				Pass_id="new",
				Pass_KinName ="" ,
				Pass_KinPhone ="",
				Pass_KinRelationship = "",
				DeleteBtn = "",
				Copyinfo = "";
				
		if(Passdata[i]){
			Pass_LastName = Passdata[i].nom;
			Pass_FirstName = Passdata[i].Prenom;
			Pass_PlaceOfBirth = Passdata[i].BirthPlace;
			
			Pass_Gender = Passdata[i].sex;
			
			Pass_EmailOpe = Passdata[i].EmailOpe;
			Pass_AddressOpe = Passdata[i].AddressOpe;
			
			Pass_Email = Passdata[i].Email;
			Pass_Address = Passdata[i].address;
				
			Pass_Age = Passdata[i].Age;
			Pass_DateOfBirth = Passdata[i].BirthDate;
			Pass_Nationality = Passdata[i].Nation;
			Pass_Residence = Passdata[i].residence; //Nut add 31/05/2017
			Pass_typeCrew = Passdata[i].crew_type; //Nut add 01/06/2017
			Pass_City = Passdata[i].City; //Nut add 08/06/2017
			Pass_State = Passdata[i].State; //Nut add 08/06/2017
			Pass_Zipcode = Passdata[i].Zipcode; //Nut add 08/06/2017
			Pass_Country = Passdata[i].Country; //Nut add 08/06/2017
			Pass_BirthDate = Passdata[i].BirthDate; //Nut add 08/06/2017
			Pass_DateArrival = Passdata[i].DateArrival; //Nut add 08/06/2017
			Pass_AirNum = Passdata[i].AirNum; //Nut add 08/06/2017
			Pass_AirTime = Passdata[i].AirTime; //Nut add 08/06/2017
			Pass_FerryNum = Passdata[i].FerryNum; //Nut add 08/06/2017
			Pass_FerryTime = Passdata[i].FerryTime; //Nut add 08/06/2017
			Pass_WestEnd = Passdata[i].WestEnd; //Nut add 08/06/2017
			Pass_RoadTown = Passdata[i].RoadTown; //Nut add 08/06/2017
			Pass_Passport =  Passdata[i].PassPort;
			Pass_Expiration = Passdata[i].Validity;
			Pass_ShoeSize = Passdata[i].Pointure;
			Pass_Mobile = Passdata[i].Mobile;
			Pass_SailingExp = Passdata[i].SailingExp;
			Pass_KinName = Passdata[i].kin_name;
			Pass_KinPhone = Passdata[i].kin_phone;
			Pass_KinRelationship = Passdata[i].kin_relation;
			Pass_id = Passdata[i].id_pass;
			
			DeleteBtn = $('<button type="button" class="btn btn-primary delBtn"><i class="fa fa-trash"></i></button>');	
			Copyinfo = $('<button type="button" class="btn btn-primary copyBtn"><i class="fa fa-clone"></i><i class="fa fa-stop-circle" style="display: none"></i></button>');
			
		}
		if (droits.catamaran_fleet && 0) { //Nut add 16/06/2017
			var InputGroup = $('<div>').addClass('input-group').css({"width":"100%","margin-top":"5px"});
			var InputGroupAddon = $('<div>').addClass('input-group-addon');
			var div_col6 = $('<div>').addClass('col-lg-6 col-md-6 col-sm-6 col-xs-6'), div_col12 = $('<div>').addClass('col-lg-12 col-md-12 col-sm-12 col-xs-12'), El='',selectstate='', OptionState = '';
			$.each(StateObj, function(key,value) {
				var valueN = value.names.replace("[chr39]", "'");
				((Pass_State==value.code || Pass_State==valueN) ? sel = "selected" : sel = '');
				OptionState += '<option value="'+value.code+'" '+sel+'>'+value.code+' - '+valueN+'</option>';
			});
			var StateSel = '<select class="form-control pass">' +
											'<option value="">Only U.S. resident</option>' +
											OptionState +
										'</select>';
			
			var OptionCountry = '';
			$.each(CountryObj, function(key,value) {
				var valueN = value.names.replace("[chr39]", "'");
				((Pass_Country==value.names) ? sel = "selected" : sel = '');
				OptionCountry += '<option value="'+value.names+'" '+sel+'>'+valueN+'</option>';
			});
			var CountrySel = '<select class="form-control pass">' +
												'<option value="">Only U.S. resident</option>' +
												OptionCountry +
											'</select>';
			(Pass_WestEnd == 1) ? WEchecked = 'checked' : WEchecked = '';
			(Pass_RoadTown == 1) ? RTchecked = 'checked' : RTchecked = '';
			
			var Nom = $(div_col12).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-users" aria-hidden="true"></i> '+row.Nom),
							$(inputEl).clone().addClass("input-padding-right").val(Pass_LastName).data('<i class="fa fa-h-square" aria-hidden="true"></i> KeepValue',Pass_LastName).attr({"name":"LastName"})
						)
					),
					Address = $(div_col12).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.Address),
							$(inputEl).clone().addClass("input-padding-right").val(Pass_Address).data("KeepValue",Pass_Address).attr({"name":"Address"})
						)
					),
					AddressOpe = $(div_col12).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.Address),
							$(inputEl).clone().addClass("input-padding-right").val(Pass_AddressOpe).data("KeepValue",Pass_AddressOpe).attr({"name":"AddressOPE"})
						)
					),
					City = $(div_col6).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.City),
							$(inputEl).clone().addClass("input-padding-right").val(Pass_City).data("KeepValue",Pass_City).attr({"name":"City"})
						)
					),
					State = $(div_col6).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.State),
							$(StateSel).addClass("input-padding-right").val(Pass_State).data("KeepValue",Pass_State).attr({"name":"State"})
						)
					),
					Zipcode = $(div_col6).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.Zipcode),
							$(inputEl).clone().addClass("input-padding-right").val(Pass_Zipcode).data("KeepValue",Pass_Zipcode).attr({"name":"Zipcode"})
						)
					),
					Country = $(div_col6).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.Country),
							$(CountrySel).addClass("input-padding-right").val(Pass_Country).data("KeepValue",Pass_Country).attr({"name":"Country"})
						)
					),
					Email = $(div_col6).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-envelope" aria-hidden="true"></i> '+row.lg_email),
							$(inputEl).clone().addClass("input-padding-right").val(Pass_Email).data("KeepValue",Pass_Email).attr({"name":"Email"})
						)
					),
					EmailOpe = $(div_col6).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-envelope" aria-hidden="true"></i> '+row.lg_email),
							$(inputEl).clone().addClass("input-padding-right").val(Pass_EmailOpe).data("KeepValue",Pass_EmailOpe).attr({"name":"EmailOPE"})
						)
					),
					BirthDate = $(div_col6).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html("<i class='fa fa-gift'></i> "+row.Birthdate),
							$(inputEl).clone().val(Pass_BirthDate).data("KeepValue",Pass_BirthDate).attr({"name":"Date"})
						)
					),
					DateArrival = $(div_col12).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.lg_ard),
							$(inputEl).clone().addClass("input-padding-right").val(Pass_DateArrival).data("KeepValue",Pass_DateArrival).attr({"name":"DateArrival"})
						)
					),
					AirNum = $(div_col6).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html("<i class='fa fa-plane'></i> Airline a Fligh#"),
							$(inputEl).clone().val(Pass_AirNum).data("KeepValue",Pass_AirNum).attr({"name":"AirNum"})
						)
					),
					AirTime = $(div_col6).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html("<i class='fa fa-location-arrow'></i> Arrival Time"),
							$(inputEl).clone().val(Pass_AirTime).data("KeepValue",Pass_AirTime).attr({"name":"AirTime"})
						)
					),
					FerryNum = $(div_col6).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html("<i class='fa fa-ship'></i> Ferry carrier"),
							$(inputEl).clone().val(Pass_FerryNum).data("KeepValue",Pass_FerryNum).attr({"name":"FerryNum"})
						)
					),
					FerryTime = $(div_col6).clone().append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html("<i class='fa fa-location-arrow'></i> Departure Time SST"),
							$(inputEl).clone().val(Pass_FerryTime).data("KeepValue",Pass_FerryTime).attr({"name":"FerryTime"})
						)
					),
					TravelTime = $(div_col12).clone().append(
						'(Travel time 1 hour) West End ',
						$('<input type="checkbox" value="1" ' + WEchecked + '>').data("KeepValue",Pass_WestEnd).attr({"name":"WestEnd"}).addClass('chck196'),
						' Road Town ',
						$('<input type="checkbox" value="1" ' + RTchecked + '>').data("KeepValue",Pass_WestEnd).attr({"name":"RoadTown"}).addClass('chck196')
					),
					BtnDel_BtnCopy = $('<div class="btn-group" data-toggle="buttons">')
						.css({"display":"flex","margin-top":"5px"})
						.append(
							$('<div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">')
								.append('<button type="button" class="btn"><i class="fa fa-hashtag" aria-hidden="true"></i>  <span class="listNumber">'+(i+1)+'</span>.</button>',"<br>"),
							$('<div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">'),
							$('<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 colDel">')
								.append($('<div role="group">').append(DeleteBtn,Copyinfo))
					);
			
			if (ss_id_ope == id_ope_com) { Email = ''; Address = ''; } else { EmailOpe = ''; AddressOpe = ''; }
			if (!StatObj.affich_ferry) { FerryNum = ''; FerryTime = ''; }
			if (!StatObj.affich_roadtown) { TravelTime = ''; }
			
			var RowPass = $(div_col6).clone().append(Nom, Address, AddressOpe, City, State, Zipcode, Country, Email, EmailOpe, BirthDate);
			var RowArrival = $(div_col6).clone().append(DateArrival, AirNum, AirTime, FerryNum, FerryTime, TravelTime);
			var Row = $('<div>').attr({"class":"row","pass":Pass_id,"listpass":""}).css({"height":"200px","margin-bottom":"5px"});
			var PrintnewRow = $(Row).append(BtnDel_BtnCopy, RowPass, RowArrival);
			$('#PassForm').append(PrintnewRow);
			GetCrewListElement();
		} else {
			if (droits.catamaran_fleet) { //Nut add 23/06/2017
				$.each(StateObj, function(key,value) {
					var valueN = value.names.replace("[chr39]", "'");
					((Pass_State==value.code || Pass_State==valueN) ? sel = "selected" : sel = '');
					OptionState += '<option value="'+value.code+'" '+sel+'>'+value.code+' - '+valueN+'</option>';
				});
				var StateSel = '<select class="form-control pass">' +
												'<option value="">Only U.S. resident</option>' +
												OptionState +
											'</select>';
				
				var OptionCountry = '';
				$.each(CountryObj, function(key,value) {
					var valueN = value.names.replace("[chr39]", "'");
					((Pass_Country==value.names) ? sel = "selected" : sel = '');
					OptionCountry += '<option value="'+value.names+'" '+sel+'>'+valueN+'</option>';
				});
				var CountrySel = '<select class="form-control pass">' +
													'<option value="">Only U.S. resident</option>' +
													OptionCountry +
												'</select>';
				(Pass_WestEnd == 1) ? WEchecked = 'checked' : WEchecked = '';
				(Pass_RoadTown == 1) ? RTchecked = 'checked' : RTchecked = '';
			}
			
			var groupBtnLastname = $('<div>')
															.addClass('input-group')
															.css('width','100%')
															.append(
																NumberBtn,
																$(inputEl).clone().val(Pass_LastName).attr({"name":"LastName"})
															);
														
			var Male = $('<label class="btn btn-primary GenderMan Gender" name="Gender" autocomplete="off">').val(0).append($('<input type="radio">'),$('<i class="fa fa-male"></i>').css({"font-size":"15px"}));
			var Female = $('<label class="btn btn-primary GenderWomen Gender" name="Gender" autocomplete="off">').val(1).append($('<input type="radio">'),$('<i class="fa fa-female"></i>').css({"font-size":"15px"}));
			
			if(Pass_Gender == "0"){
				$(Male).addClass("active");
			}else if(Pass_Gender == "1"){
				$(Female).addClass("active");
			}
			var groupBtn_Gender = $('<div class="btn-group" data-toggle="buttons">').css({"display":"flex","margin-top":"5px"}).append('<button type="button" class="btn"><i class="fa fa-venus-mars" aria-hidden="true"></i> '+lg_gender+': </button>',Male,Female);
																
					var AllStat = CheckAllStat();
					if(AllStat){
						var ClassCol = "col-lg-5 col-md-5 col-sm-5 col-xs-5";
					}else{
						var ClassCol = "col-lg-5 col-md-5 col-sm-5 col-xs-5";
					}		
					
			var InputGroup = $('<div>').addClass('input-group').css({"width":"100%","margin-top":"5px"});
			var InputGroupAddon = $('<div>').addClass('input-group-addon');
			
			var tooptip_agt_email = '';
			var tooptip_ope_email = '';
			var tooptip_agt_addr = '';
			var tooptip_ope_addr = '';
			if(RefId == ""){//only agent and oparater not direct link
			 tooptip_agt_email = $('<span  data-toggle="tooltip" data-placement="bottom" title="'+policy_massage_agt+'">').addClass("info-input").html('<i class="fa fa-info-circle"></i>');
			 tooptip_ope_email = $('<span  data-toggle="tooltip" data-placement="bottom" title="'+policy_massage_ope+'">').addClass("info-input").html('<i class="fa fa-info-circle"></i>');
			 tooptip_agt_addr = $('<span  data-toggle="tooltip" data-placement="bottom" title="'+policy_massage_agt+'">').addClass("info-input").html('<i class="fa fa-info-circle"></i>');
			 tooptip_ope_addr = $('<span  data-toggle="tooltip" data-placement="bottom" title="'+policy_massage_ope+'">').addClass("info-input").html('<i class="fa fa-info-circle"></i>');	
			}
			
			//Nut add 31/05/2017
			typeCrew = ""
			if (StatObj.clss_typecrew == '') {
				var typeCrew = $('<select name="typeCrew">')
													.addClass('form-control typeCrew')
													.append(
														$('<option></option>')
				                    .attr('value','1')
				                    .text('Skipper'),
				                    $('<option></option>')
				                    .attr('value','2')
				                    .text('Cook'),
				                    $('<option></option>')
				                    .attr('value','0')
				                    .text('Crew')
				                  ).css("width","40%");
				typeCrew.find('option[value='+Pass_typeCrew+']').attr("selected","")
				typeCrew = $(InputGroup).clone().append(
					$('<div class="input-group-addon labelNo">').append('<i class="fa fa-street-view" aria-hidden="true"></i> Type of crew'),
					typeCrew
				)
			}
			
			var BtnDel_BtnCopy = $('<div class="btn-group" data-toggle="buttons">')
														.css({"display":"flex","margin-top":"5px"})
														.append(
															$('<div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">').append('<button type="button" class="btn"><i class="fa fa-hashtag" aria-hidden="true"></i>  <span class="listNumber">'+(i+1)+'</span>.</button>',"<br>",typeCrew),
															$('<div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">'),
															$('<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 colDel">')
															.append($('<div role="group">').append(DeleteBtn,Copyinfo))
														);
			
			var LastName = $('<div class="'+ClassCol+'" >').append(
						$(InputGroup).clone().append(
							$(NumberBtn).append('<i class="fa fa-users" aria-hidden="true"></i> '+row.lg_LastName),
							$(inputEl).clone().val(Pass_LastName).attr({"name":"LastName"})
						)
					),
					FirstName = $('<div class="'+ClassCol+'" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-user" aria-hidden="true"></i> '+row.Prenom),
							$(inputEl).clone().val(Pass_FirstName).data("KeepValue",Pass_FirstName).attr({"name":"FirstName"})
						)
					),
					PlaceOfBirth = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html("<i class='fa fa-location-arrow'></i> Place Of Birth"),
							$(inputEl).clone().val(Pass_PlaceOfBirth).data("KeepValue",Pass_PlaceOfBirth).attr({"name":"PlaceOfBirth"})
						)
					),
					Gender = $('<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" >').append(groupBtn_Gender),
					Email = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-envelope" aria-hidden="true"></i> '+row.lg_email),
							$(inputEl).clone().addClass("input-padding-right").val(Pass_Email).data('<i class="fa fa-h-square" aria-hidden="true"></i> KeepValue',Pass_Email).attr({"name":"Email"}),
							tooptip_agt_email
						)
					),/*Broker Email*/
					Address = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.Address),
							$(inputEl).clone().addClass("input-padding-right").val(Pass_Address).data("KeepValue",Pass_Address).attr({"name":"Address"}),
							tooptip_agt_addr
						)
					),/*Broker Address*/
					EmailOpe = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-envelope" aria-hidden="true"></i> '+row.lg_email),
							$(inputEl).clone().addClass("input-padding-right").val(Pass_EmailOpe).data("KeepValue",Pass_EmailOpe).attr({"name":"EmailOPE"}),
							tooptip_ope_email
						)
					),/*Ope Email*/
					AddressOpe = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.Address),
							$(inputEl).clone().addClass("input-padding-right").val(Pass_AddressOpe).data("KeepValue",Pass_AddressOpe).attr({"name":"AddressOPE"}),
							tooptip_ope_addr
						)	
					),/*Ope Address*/
					Age = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-odnoklassniki" aria-hidden="true"></i> '+row.lg_age),
							$(inputEl).clone().val(Pass_Age).data("KeepValue",Pass_Age).attr({"name":"Age"})
						)
					),
					DateOfBirth = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-birthday-cake" aria-hidden="true"></i> '+row.Birthdate),
							$(inputEl).clone().addClass('datepicker').val(Pass_DateOfBirth).data("KeepValue",Pass_DateOfBirth).attr({"name":"Date"})
						)
					),
					Nationality = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-globe" aria-hidden="true"></i> '+row.nation),
							$(inputEl).clone().val(Pass_Nationality).data("KeepValue",Pass_Nationality).attr({"name":"Nationality"})
						)
					),
					Residence = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append( //Nut add 31/05/2017
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-home" aria-hidden="true"></i> Residence'),
							$(inputEl).clone().val(Pass_Residence).data("KeepValue",Pass_Residence).attr({"name":"Residence"})
						)
					),
					PassPort = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-ticket" aria-hidden="true"></i> '+row.lg_passport),
							$(inputEl).clone().val(Pass_Passport).data("KeepValue",Pass_Passport).attr({"name":"PassPort"})
						)
					),
					Expiration = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-expeditedssl" aria-hidden="true"></i> '+row.dat),
							$(inputEl).clone().addClass('datepicker').val(Pass_Expiration).data("KeepValue",Pass_Expiration).attr({"name":"Expiration"})
						)
					),
					ShoeSize = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().addClass("drp").html('<i class="fa fa-arrows-h" aria-hidden="true"> '+row.Pointure),
							$(inputEl).clone().val(Pass_ShoeSize).addClass("get-drp").data("KeepValue",Pass_ShoeSize).attr({"name":"shoesize"})
						)
					),
					Mobile = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-mobile" aria-hidden="true"></i> '+row.Mobile),
							$(inputEl).clone().val(Pass_Mobile).data("KeepValue",Pass_Mobile).attr({"name":"Mobile"})
						)	
					),
					SailingExp = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-ship" aria-hidden="true"></i> '+row.lg_exp_nautique),
							$(inputEl).clone().val(Pass_SailingExp).data("KeepValue",Pass_SailingExp).attr({"name":"SailingExp"})
						)
					),
					KinName = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-user" aria-hidden="true"></i> '+row.lg_kinname),
							$(inputEl).clone().val(Pass_KinName).data("KeepValue",Pass_KinName).attr({"name":"KinName"})
						)	
					),
					KinPhone = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-phone" aria-hidden="true"></i> '+row.lg_kinphone),
							$(inputEl).clone().val(Pass_KinPhone).data("KeepValue",Pass_KinPhone).attr({"name":"KinPhone"})
						)	
					),
					KinRelationship = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-heart" aria-hidden="true"></i> '+row.lg_kinrelation),
							$(inputEl).clone().val(Pass_KinRelationship).data("KeepValue",Pass_KinRelationship).attr({"name":"KinRelationship"})
						)
					),
					City = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.City),
							$(inputEl).clone().addClass("input-padding-right").val(Pass_City).data("KeepValue",Pass_City).attr({"name":"City"})
						)
					),
					State = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.State),
							$(StateSel).addClass("input-padding-right").val(Pass_State).data("KeepValue",Pass_State).attr({"name":"State"})
						)
					),
					Zipcode = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.Zipcode),
							$(inputEl).clone().addClass("input-padding-right").val(Pass_Zipcode).data("KeepValue",Pass_Zipcode).attr({"name":"Zipcode"})
						)
					),
					Country = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.Country),
							$(CountrySel).addClass("input-padding-right").val(Pass_Country).data("KeepValue",Pass_Country).attr({"name":"Country"})
						)
					),
					DateArrival = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.lg_ard),
							$(inputEl).clone().addClass("input-padding-right").val(Pass_DateArrival).data("KeepValue",Pass_DateArrival).attr({"name":"DateArrival"})
						)
					),
					AirNum = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html("<i class='fa fa-plane'></i> Airline a Fligh#"),
							$(inputEl).clone().val(Pass_AirNum).data("KeepValue",Pass_AirNum).attr({"name":"AirNum"})
						)
					),
					AirTime = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html("<i class='fa fa-location-arrow'></i> Arrival Time"),
							$(inputEl).clone().val(Pass_AirTime).data("KeepValue",Pass_AirTime).attr({"name":"AirTime"})
						)
					),
					FerryNum = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html("<i class='fa fa-ship'></i> Ferry carrier"),
							$(inputEl).clone().val(Pass_FerryNum).data("KeepValue",Pass_FerryNum).attr({"name":"FerryNum"})
						)
					),
					FerryTime = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						$(InputGroup).clone().append(
							$(InputGroupAddon).clone().html("<i class='fa fa-location-arrow'></i> Departure Time SST"),
							$(inputEl).clone().val(Pass_FerryTime).data("KeepValue",Pass_FerryTime).attr({"name":"FerryTime"})
						)
					),
					TravelTime = $('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" >').append(
						'(Travel time 1 hour) West End ',
						$('<input type="checkbox" value="1" ' + WEchecked + '>').data("KeepValue",Pass_WestEnd).attr({"name":"WestEnd"}).addClass('chck196'),
						' Road Town ',
						$('<input type="checkbox" value="1" ' + RTchecked + '>').data("KeepValue",Pass_WestEnd).attr({"name":"RoadTown"}).addClass('chck196')
					);
			
					if (!droits.catamaran_fleet) { //Nut add 23/06/2017
						DateArrival = '';
						AirNum = '';
						AirTime = '';
						FerryNum = '';
						FerryTime = '';
						TravelTime = '';
					}
					if (!StatObj.Address){Email = ''}
					if (!StatObj.Address){Address = ''}
					if (!StatObj.EmailOpe){EmailOpe = ''}
					if (!StatObj.AddressOpe){AddressOpe = ''}
					if (StatObj.clss_city == "none"){City = ''} //Nut add 23/06/2017
					if (StatObj.clss_state == "none"){State = ''} //Nut add 23/06/2017
					if (StatObj.clss_zipcode == "none"){Zipcode = ''} //Nut add 23/06/2017
					if (StatObj.clss_country == "none"){Country = ''} //Nut add 23/06/2017
					
					if (StatObj.clss_sexual == "none"){Gender = ''}
					if (StatObj.clss_birthplace == "none"){PlaceOfBirth = ''}
					if (StatObj.clss_nation == "none"){Nationality = ''}
					if (StatObj.clss_residence == "none"){Residence = ''} //Nut add 31/05/2017
					if (StatObj.clss_passpo == "none"){PassPort = ''}
					if (StatObj.clss_validi == "none"){Expiration = ''}
					if (StatObj.clss_pointu == "none"){ShoeSize = ''}
					if (StatObj.clss_mobile == "none"){Mobile = ''}
					
					if (StatObj.clss_sailng == "none"){SailingExp = ''}
					if (StatObj.clss_kname == "none"){KinName = ''}
					if (StatObj.clss_kphone == "none"){KinPhone = ''}
					if (StatObj.clss_krelation == "none"){KinRelationship = ''}
					if (StatObj.clss_ageage == "none"){Age = ''}
					if (StatObj.clss_birfda == "none"){DateOfBirth = ''}
			
			if (droits.catamaran_fleet) {
				var Row = $('<div>').attr({"class":"row","pass":Pass_id,"listpass":""}).css({"height":"220px", "margin-bottom":"5px"});
				var PrintnewRow = $(Row).append(
					BtnDel_BtnCopy,LastName,FirstName,Gender,Email,Address,City,State,Zipcode,Country,EmailOpe,AddressOpe,DateOfBirth,PlaceOfBirth,Age,Nationality,Residence,PassPort,Expiration,ShoeSize,Mobile,SailingExp,KinName,KinPhone,KinRelationship,
					$('<div class="col-lg-12">').css('margin-top','10px').append('<b><i class="fa fa-bus"></i>'+row.lg_Transporation+'</b>'),
					DateArrival, AirNum, AirTime, FerryNum, FerryTime, TravelTime
				);
			} else {
				var Row = $('<div>').attr({"class":"row","pass":Pass_id,"listpass":""}).css({"height":"155px", "margin-bottom":"5px"});
				var PrintnewRow = $(Row).append(BtnDel_BtnCopy,LastName,FirstName,Gender,Email,Address,EmailOpe,AddressOpe,DateOfBirth,PlaceOfBirth,Age,Nationality,Residence,PassPort,Expiration,ShoeSize,Mobile,SailingExp,KinName,KinPhone,KinRelationship);
			}
			
			$('#PassForm').append(PrintnewRow);
			GetCrewListElement();
			$.each($(".datepicker",PrintnewRow),function(){
				if(CkeckDateFormat.date($(this).val())){
					CallDateRangePic_crewlist_Spec($(this));
				}else{//fixed if not good date from the pass 'Ham 21/07/2017
					$(this).val("01/01/1999");
					CallDateRangePic_crewlist_Spec($(this));
				}
			});
		
		
			if (StatObj.clss_typecrew == '') { //Nut add 01/06/2017
				if (Pass_typeCrew != '') {
					BtnDel_BtnCopy.find('select option[value=' + Pass_typeCrew + ']').prop('selected',true);
				} else {
					if (i == '0') {
						BtnDel_BtnCopy.find('select option[value="1"]').prop('selected',true);
					} else {
						BtnDel_BtnCopy.find('select option[value="0"]').prop('selected',true);
					}
				}
			}
		/*
			######## format that work for carlender ########
			M/d/yyyy
      M/d/yy
      MM/dd/yyyy
      MM/dd/yy
      
      M-d-yyyy
      M-d-yy
      MM-dd-yyyy
      MM-dd-yy
      
      M.d.yyyy
      M.d.yy
      MM.dd.yyyy
      MM.dd.yy
      
      d/M/yyyy
      d/M/yy
      dd/MM/yyyy
      dd/MM/yy
      
      d-M-yyyy
      d-M-yy
      dd-MM-yyyy
      dd-MM-yy
      
      d.M.yyyy
      d.M.yy
      dd.MM.yyyy
      dd.MM.yy
      ######## format that work for carlender ########
		*/
		}
	}
}
var CkeckDateFormat = (function(){
		var init = function(date){
			var objSim = CheckSimbol(date);
			if(objSim.status){
				if(objSim.arrdate.length != 3 ){
					return false;
				}
				var objDMY = CheckDMY(objSim.arrdate);	
				if(objDMY.stat){
					return true;
				}else{
					return false;
				}
			}
		};
		var CheckSimbol = function(date){
			var arrdate = [];
			var status = false;
			if(date.indexOf("-") > -1){
				arrdate = date.split("-");
				status = true;
			}else if(date.indexOf(".") > -1){
				arrdate = date.split(".");
				status = true;
			}else if(date.indexOf("/") > -1){
				arrdate = date.split("/");
				status = true;
			}else{
				status = false;
			}
			return {arrdate:arrdate,status:status};
		};
		var CheckDMY = function(arrdate){
			var arr1 = arrdate[0].split("");
			var arr2 = arrdate[1].split("");
			var arr3 = arrdate[2].split("");
			var stat1 = false,stat2 = false,stat3 = false;
			if(arr1.length == arr2.length){//date or month must same digits number
				if(arr1.length > 0 && arr1.length <= 2){
					stat1 = true;
				}
				if(arr2.length > 0 && arr2.length <= 2){
					stat2 = true;
				}	
			}
			if(arr3.length > 1 && arr3.length <= 4 && arr3.length != 3){
				stat3 = true;
			}
			var stat = (stat1&&stat2&&stat3);
			return {stat:stat};
		};
		return {date:init};
}());

function CallDateRangePic_crewlist_Spec(el){
	var year = (new Date).getFullYear();
	$(el).daterangepicker({
     singleDatePicker: true,
     showDropdowns: true,
     autoUpdateInput: false,
      minDate: new Date(year-100, 0, 1),
       maxDate: new Date(year+10, 11, 31),
     locale: {format: 'DD/MM/YYYY'},
     "drops": "up"
	});
	$(el).on('hide.daterangepicker', function(ev, picker) {
	  var ThisElB = $(this).val(picker.startDate.format('DD/MM/YYYY'));
		ev.stopPropagation();
		clearInterval(SetloopCheck);
		setTimeout(function (){
			var NotAlowNewEmpty = ($(ThisElB).val().replace(/\s+/g, '') == "" && $(ThisElB).parents("div.row[listpass]").attr("pass") == "new");
			if(!NotAlowNewEmpty && $(ThisElB).val() != $(ThisElB).data("KeepValue")){
				if($(ThisElB).parents("div.row[listpass]").attr("pass") != "new"){
					if($(ThisElB).data("stat") != "sending"){
						//$(ThisElB).data("stat","sending");
						QueueUpdateListPass.add(id_command,$(ThisElB));
						//UpdateListPass(id_command,$(ThisElB));	
					}
				}
			}
		},100);
});
}

function CallDateRangePic_crewlist(PrintnewRow){
	var year = (new Date).getFullYear();
	$(".datepicker",PrintnewRow).daterangepicker({
     singleDatePicker: true,
     showDropdowns: true,
     autoUpdateInput: false,
      minDate: new Date(year-100, 0, 1),
       maxDate: new Date(year+10, 11, 31),
     locale: {format: 'DD/MM/YYYY'},
     "drops": "up"
	});
	$(".datepicker",PrintnewRow).on('hide.daterangepicker', function(ev, picker) {
	  var ThisElB = $(this).val(picker.startDate.format('DD/MM/YYYY'));
		ev.stopPropagation();
		clearInterval(SetloopCheck);
		setTimeout(function (){
			var NotAlowNewEmpty = ($(ThisElB).val().replace(/\s+/g, '') == "" && $(ThisElB).parents("div.row[listpass]").attr("pass") == "new");
			if(!NotAlowNewEmpty && $(ThisElB).val() != $(ThisElB).data("KeepValue")){
				if($(ThisElB).parents("div.row[listpass]").attr("pass") != "new"){
					if($(ThisElB).data("stat") != "sending"){
						//$(ThisElB).data("stat","sending");
						QueueUpdateListPass.add(id_command,$(ThisElB));
						//UpdateListPass(id_command,$(ThisElB));	
					}
				}
			}
		},100);
});
}

function CreatePassFormListIpadMode(amount,Passdata){//Width 768px
	
	$('#PassForm').empty();
	for (i = 0; i < amount; i++) {
	var inputEl = $('<input>').attr({class:"form-control pass",type:"text"});
		var NumberBtn = $('<div>').addClass('input-group-addon labelNo').append('<i class="fa fa-user"></i> <span class="listNumber">'+(i+1)+"</span>. Last Name");
		var Pass_LastName="",
				Pass_FirstName="",
				
				Pass_EmailOpe = "",
				Pass_AddressOpe = "",
				
				Pass_Email="",
				Pass_Address="",
				
				Pass_BirthDate="",
				Pass_Nationality="",
				Pass_Poart="",
				Pass_Expiration="",
				Pass_id="new",
				Pass_ShoeSize ="" ,
				DeleteBtn = "",
				Copyinfo = "";
		if(Passdata[i]){
			Pass_LastName = Passdata[i].nom;
			Pass_FirstName = Passdata[i].Prenom;
			
			Pass_EmailOpe = Passdata[i].EmailOpe;
			Pass_AddressOpe = Passdata[i].AddressOpe;
			
			Pass_Email = Passdata[i].Email;
			Pass_Address = Passdata[i].address;
				
			Pass_BirthDate = Passdata[i].BirthDate;
			Pass_Nationality = Passdata[i].Nation;
			Pass_Poart = Passdata[i].PassPort;
			Pass_Expiration = Passdata[i].Validity;	
			Pass_id = Passdata[i].id_pass;
			Pass_ShoeSize = Passdata[i].Pointure ,
			DeleteBtn = $('<button type="button" class="btn btn-primary delBtn"><i class="fa fa-trash"></i></button>');	
			Copyinfo = $('<button type="button" class="btn btn-primary copyBtn"><i class="fa fa-clone"></i><i class="fa fa-stop-circle" style="display: none"></i></button>');	
		}
		
		var BtnDelete_BtnCopy = $('<div>').attr("role","group").append(DeleteBtn,Copyinfo);
		var MassageStat = $('<div>').addClass("MassageStat");
		var RowMassAndBtn = $("<div>").addClass("row RowMassageStat").append($("<div>").addClass("col-lg-7 col-md-7 col-sm-7 col-xs-7").append(MassageStat),$("<div>").addClass("col-lg-5 col-md-5 col-sm-5 col-xs-5").append(BtnDelete_BtnCopy));
		
		var groupBtnLastname = $('<div>')
														.addClass('input-group')
														.css({"width":"100%"}).css({"margin-top":"5px"})
														.append(
															NumberBtn,
															$(inputEl).clone().val(Pass_LastName).attr({"name":"LastName","placeholder":""})
														);
		var groupBtnFirstname = $('<div>')
														.addClass('input-group')
														.css({"width":"100%"}).css({"margin-top":"5px"})
														.append(
															$('<div>').addClass('input-group-addon').append('First Name'),
															$(inputEl).clone().val(Pass_FirstName).attr({"name":"FirstName","placeholder":""})
														);
														
		var groupBtnEmail = $('<div>')
														.addClass('input-group')
														.css({"width":"100%"}).css({"margin-top":"5px"})
														.append(
															$('<div>').addClass('input-group-addon').append('<i class="fa fa-envelope-o"></i> Email'),
															$(inputEl).clone().val(Pass_Email).attr({"name":"Email","placeholder":""})
														);
														
		var groupBtnAddress = $('<div>')
														.addClass('input-group')
														.css({"width":"100%"}).css({"margin-top":"5px"})
														.append(
															$('<div>').addClass('input-group-addon').append('<i class="fa fa-home"></i> Address'),
															$(inputEl).clone().val(Pass_Address).attr({"name":"Address","placeholder":""})
														);
		var groupBtnEmailOpe = $('<div>')
														.addClass('input-group')
														.css({"width":"100%"}).css({"margin-top":"5px"})
														.append(
															$('<div>').addClass('input-group-addon').append('<i class="fa fa-envelope-o"></i> EmailOPE'),
															$(inputEl).clone().val(Pass_EmailOpe).attr({"name":"EmailOPE","placeholder":""})
														);
														
		var groupBtnAddressOpe = $('<div>')
														.addClass('input-group')
														.css({"width":"100%"}).css({"margin-top":"5px"})
														.append(
															$('<div>').addClass('input-group-addon').append('<i class="fa fa-home"></i> AddressOPE'),
															$(inputEl).clone().val(Pass_AddressOpe).attr({"name":"AddressOPE","placeholder":""})
														);
														
		var groupBtnBDate = $('<div>')
														.addClass('input-group')
														.css({"width":"100%"}).css({"margin-top":"5px"})
														.append(
															$('<div>').addClass('input-group-addon').append('<i class="fa fa-birthday-cake"></i> Birthdate'),
															$(inputEl).clone().addClass('datepicker').val(Pass_BirthDate).attr({"name":"Date","placeholder":""})
														);
														
		var groupBtnNation = $('<div>')
														.addClass('input-group')
														.css({"width":"100%"}).css({"margin-top":"5px"})
														.append(
															$('<div>').addClass('input-group-addon').append('<i class="fa fa-flag"></i> Nationality'),
															$(inputEl).clone().val(Pass_Nationality).attr({"name":"Nationality","placeholder":""})
														);
														
		var groupBtnPassPort = $('<div>')
														.addClass('input-group')
														.css({"width":"100%"}).css({"margin-top":"5px"})
														.append(
															$('<div>').addClass('input-group-addon').append('<i class="fa fa-book"></i> Passport'),
															$(inputEl).clone().val(Pass_Poart).attr({"name":"PassPort","placeholder":""})
														);
														
		var groupBtnExpiration = $('<div>')
														.addClass('input-group')
														.css({"width":"100%"}).css({"margin-top":"5px"})
														.append(
															$('<div>').addClass('input-group-addon').append('<i class="fa fa-book"></i> Expiration'),
															$(inputEl).clone().val(Pass_Expiration).attr({"name":"Expiration","placeholder":""})
														);
														
		var groupBtnShoeSize = $('<div>')
														.addClass('input-group')
														.css({"width":"100%"}).css({"margin-top":"5px"})
														.append(
															$('<div>').addClass('input-group-addon').append('<i class="fa fa-crosshairs"></i> shoesize'),
															$(inputEl).clone().val(Pass_ShoeSize).attr({"name":"shoesize","placeholder":""})
														);
												
		var BtnGroup = $('<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 colDel" >').append(RowMassAndBtn),
				LastName = $('<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" >').append(groupBtnLastname),
				FirstName = $('<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" >').append(groupBtnFirstname),
				Email = $('<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" >').append(groupBtnEmail),/*Broker Email*/
				Address = $('<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8" >').append(groupBtnAddress),/*Broker Address*/
				EmailOpe = $('<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" >').append(groupBtnEmailOpe),/*Ope Email*/
				AddressOpe = $('<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8" >').append(groupBtnAddressOpe),/*Ope Address*/
				Date = $('<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" >').append(groupBtnBDate),
				Nationality = $('<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" >').append(groupBtnNation),
				PassPort = $('<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" >').append(groupBtnPassPort),
				Expiration = $('<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" >').append(groupBtnExpiration);
				ShoeSize = $('<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" >').append(groupBtnShoeSize);
				
				if (!StatObj.Address){Email = ''}
				if (!StatObj.Address){Address = ''}
				if (!StatObj.EmailOpe){EmailOpe = ''}
				if (!StatObj.AddressOpe){AddressOpe = ''}
				
		var Row = $('<div>')
							.attr({"class":"row","pass":Pass_id,"listpass":""})
							.css({
								"height":"177px",
								"background-color":"antiquewhite",
								"padding":"5px 5px 5px 5px",
								"margin-bottom":"5px"
							});
		var PrintnewRow = $(Row).append(BtnGroup,LastName,FirstName,Email,Address,EmailOpe,AddressOpe,Date,Nationality,PassPort,Expiration,ShoeSize);
		$('#PassForm').append(PrintnewRow);
	}
}

function CopyAndPastePass(El){
	var CloseBtn = $('<button type="button" data-dismiss="modal" class="btn btn-primary" style="margin-bottom: 0px;"><i class="fa fa-times"></i> '+row.lg_close+'</button>');
	var PasteBtn = $('<button type="button" data-dismiss="modal" class="btn btn-primary"><i class="fa fa-clipboard"></i> '+row.lg_paste+'</button>');
	Modal = BootstrapModal();
	Modal.dialog.css({"min-width":"30%","max-width":"30%"});
	Modal.header.append('<button type="button" class="close" data-dismiss="modal"><i class="fa fa-times"></i></button>'+
											'<i class="fa fa-clone" aria-hidden="true"></i>'+
											row.lg_copy_pass);
	Modal.body.append('<div class="alert alert-warning" role="alert">'+
											'<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'+
											'<span class="sr-only">Error:</span>'+
											row.lg_doYouWantToCopy+
										'</div>');
	Modal.footer.append(CloseBtn,PasteBtn);
	
	Modal.OnShown(function(){
		$(PasteBtn).click(function(){
			PassengerNumber(1)
			//########### Copy ###################
					
			var InputValueObj = {};
			var RowCopyEl = $(El).parents("div.row[listpass]");
//			var Inputs = $(RowCopyEl[0]).find('input:not([name=FirstName]):not([name=Date]):not([name=PassPort]):not([name=Expiration])');
			var Inputs = $(RowCopyEl[0]).find(':input:not([name=FirstName]):not([name=Date]):not([name=PassPort]):not([name=Expiration]):not(:button)');
				$.each(Inputs,function(key,value){
					InputValueObj[$(this).attr('name')] = $(this).val();
				});
			
			//########## END COPY #################
			
			//########### Paste ###################
					
			var RowPaste = addOncrow();
			var InputsToPaste = $(RowPaste[0]).find(':input');
				$.each(InputsToPaste,function(key,value){
					$(this).val(InputValueObj[$(value).attr('name')]);
				});
				
			$.each(Inputs,function(key,value){
					InputValueObj[$(this).attr('name')] = window.btoa(unescape(encodeURIComponent($(this).val())));//window.btoa($(this).val());
				});
				
			UpdateAllRowListPass(InputValueObj,RowPaste);		
			//########## END Paste #################
			
		});
	});
	Modal.do();
}

function OpenDeleteModal(){
	
	var BtnClose = $('<button type="button" data-dismiss="modal" class="btn btn-primary">')
									.html('<i class="fa fa-times"></i> '+row.lg_close+'</button>')
									.css({"margin-bottom": "0px"});
									
	var BtnDelete = $('<button type="button" data-dismiss="modal" class="btn btn-primary">')
									.html('<i class="fa fa-trash"></i> '+row.Delete+'</button>');
	
	var Modal = BootstrapModal();
			$(Modal.main).attr("id","DelPassModal");
			Modal.dialog.css({"min-width":"30%","max-width":"30%"});
			Modal.header.html('<button type="button" class="close" data-dismiss="modal"><i class="fa fa-times"></i></button><i class="fa fa fa-trash-o fa-lg"></i> '+row.Delete);
			Modal.body.html('<div class="alert alert-danger" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span> '+row.lg_DoYouWantToDelete+'</div>');
			Modal.footer.append(BtnClose,BtnDelete);
			Modal.OnHide(function(){
				//hide
			});
			Modal.OnShown(function(){
				//shown
			});
			Modal.do();
			
			return BtnDelete;
}

function StatusProgress(typ,massage){
	var ElMassager;
	if(typ == "success"){
		ElMassager = $('<div class="alert alert-success" role="alert">');	
	}else if(typ == "info"){
		ElMassager = $('<div class="alert alert-info" role="alert">');	
	}else if(typ == "warning"){
		ElMassager = $('<div class="alert alert-warning" role="alert">');	
	}else if(typ == "danger"){
		ElMassager = $('<div class="alert alert-danger" role="alert">');	
	}
	return $(ElMassager).append(massage);
}

function PassHead(){
	var PlaceOfBirth,Email,Address,EmailOpe,AddressOpe,StatLive="",Mobile,ShoeSize,DateOfBirth,Nation,Passport,Expirationdate;
	if (StatObj.Address){Email = '<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1" >Email</div>';}
	if (StatObj.Address){Address = '<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1" >Address</div>';}
	if (StatObj.clss_birthplace == ""){PlaceOfBirth = '<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1" >Place of birth</div>';}
	if (StatObj.EmailOpe){EmailOpe = '<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1" >EmailOpe</div>';}
	if (StatObj.AddressOpe){AddressOpe = '<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1" >AddressOpe</div>';}
	if (StatObj.StatLive == "broker" || StatObj.StatLive == "ope"){
		StatLive = $('<div>').addClass('col-lg-1 col-md-1 col-sm-1 col-xs-1')
								.append('<button type="button" class="btn btn-primary DeleteAll" style="width:91%"><i class="fa fa-trash"></i> '+row.All+'</button>');
		$('#taptool > #tebletDelAll').empty();
	}
	if (StatObj.clss_pointu == ""){ShoeSize = '<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">'+'Shoe Size'+'</div>';}
	if (StatObj.clss_mobile == ""){Mobile = '<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">'+'Mobile'+'</div>';}
	
	if (StatObj.clss_birfda == ""){DateOfBirth = '<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">'+'Date of birth'+'</div>';}
	if (StatObj.clss_nation == ""){Nation = '<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">'+'Nationality'+'</div>';}
	if (StatObj.clss_passpo == ""){Passport = '<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">'+'Passport'+'</div>';}
	if (StatObj.clss_validi == ""){Expirationdate = '<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">'+'Expiration date'+'</div>';}
	
	if(CheckAllStat()){
		var ClassCol = "col-lg-1 col-md-1 col-sm-1 col-xs-1";
	}else{
		var ClassCol = "col-lg-2 col-md-2 col-sm-2 col-xs-2";
	}	
	
	$('#PassHead').empty();
	$('#PassHead').append(
		'<div class="'+ClassCol+'" >LastName</div>',
		'<div class="'+ClassCol+'" >FirstName</div>',
		PlaceOfBirth,
		Email,
		Address,
		EmailOpe,
		AddressOpe,
		DateOfBirth,
		Nation,
		Passport,
		Expirationdate,
		ShoeSize,
		Mobile,
		StatLive
	);
	
	if(ViewMode == "tablet" || (StatObj.SpecilaCondition)){
			if(StatObj.SpecilaCondition){
				$('#taptool > #tebletDelAll').append($(StatLive).css("width","66%").addClass("pull-right"));
			}else{
				$('#taptool > #tebletDelAll').append($(StatLive).addClass("pull-right"));	
			}
			$('#PassHead').empty();
		}
}

function BootstrapModal(){
	var Modal = {
		main: $("<div>").attr({class:"modal fade",role:"dialog"}),
		dialog: $("<div>").attr("class","modal-dialog"),
		content: $("<div>").attr("class","modal-content"),
		header: $("<div>").attr("class","modal-header"),
		body: $("<div>").attr("class","modal-body"),
		footer: $("<div>").attr("class","modal-footer"),
		do:function(){
			Modal.main.append(Modal.dialog,Modal.content);
			Modal.content.append(Modal.header,Modal.body,Modal.footer);
			Modal.dialog.append(Modal.content);
			$(Modal.main).modal('show');
			
			$(Modal.main).modal('show').promise().done(function(){
				Modal.OnHide();
				Modal.OnShown();
			});
		},
		hide:function(e){
			return e;
		},
		show:function(e){
			return e;
		},
		OnHide:function(hide){
			if (typeof hide == "function"){
				$(Modal.main).on('hidden.bs.modal', function () {
					$(this).data('bs.modal', null).remove();
					Modal.hide(hide());
				});	
			}
		},
		OnShown:function(show){
			if (typeof show == "function"){
				$(Modal.main).on('shown.bs.modal', function () {
					
					Modal.show(show());
				});	
			}
		}
			
	}
		return Modal;
}

function CheckWindowSize(){
	return width = $(window).width();
}

function ManageViewMode(width){
	var Mode;
	if(width < 980){//tablets Mode
		Mode = "tablet";
	}else{//desktops Mode
		Mode = "desktop";
	}
	return Mode;
}

var AddPassengerByNumber = (function(){
	var init = function(){
		main = $('<div id="AddPassengerByNumber">');
		group = $("<div>").css("display","flex");
		input = $('<input type="text" class="form-control" placeholder="Number of passengers" id="PassNumber">');
		spanAdd = $('<button type="button" class="btn btn-primary" id="PassAddBtn" disabled>').html('<i class="fa fa-user-plus"></i> '+row.Add);
		varidatenum = $('<span id="varidatenum">');
		
		group = group.append(input,spanAdd);
		main = main.append(group,varidatenum);
		bind(main);
		return main;
	};
	var bind = function(main){
		$('input#PassNumber',main).on("keyup",function(event){
			var val = $(this).val();
			$("#varidatenum",main).empty();
			if(Math.floor(val) == val && $.isNumeric(val) && val <= 20 && val != 0){
			$("#varidatenum",main).html('<i class="fa fa-check"></i> All right!').css({"font-size":"15px","color":"green"});
			$('#PassAddBtn',main).removeAttr("disabled");
			}else{
				$(this).val("");
				if(val > 20){
					$("#varidatenum",main).html('<i class="fa fa-times"></i> Max 20 persons ').css({"font-size":"15px","color":"red"});
					$('#PassAddBtn',main).attr("disabled","");
				}else if(val <= 0){
					$("#varidatenum",main).html('<i class="fa fa-times"></i> Min 1 person').css({"font-size":"15px","color":"red"});
					$('#PassAddBtn',main).attr("disabled","");
				}else{
					$("#varidatenum",main).html('<i class="fa fa-times"></i> Allow only number.').css({"font-size":"15px","color":"red"});
					$('#PassAddBtn',main).attr("disabled","");
				}
			}
		});
		$('#PassAddBtn',main).click(function(){
			WaitForApi("wait","<b>Please wait...</b> We are adding the new passenger.");
			CallListPassengers = ajax($('input#PassNumber',main).val());
			CallListPassengers.success(function(data){
				Crewlist_Construct();
				WaitForApi("success","<b>successfully!</b> We have been added the new passenger.");
			});
		});
		
	};
	var ajax = function(amount){
		return $.ajax({
						url: '../API/ListPassengers.asp',
						type: 'POST',
						data:{typ:"addpassnum",num:amount,
									id_client:StatObj.id_client,
									id_command:StatObj.CheckCommandLink.id_command,
									SQL_TYP:StatObj.CheckCommandLink.SQL_TYP
						},
						dataType:'json'
		});			
	};
	return {init:init}
}());

function PassengerNumber(data){
	var Mode = typeof data;
	if(Mode == "object"){//This mode refer to length of object
		$('#PassNum').html(data.length)	
	}else if(Mode == "number"){//This mode add or remove by manual
		var add = Number(data)
		var num = Number($('#PassNum').html())
		$('#PassNum').html(Number(num+add))
	}
}

function ManageRowPassList(data){
	PassengerNumber(data)
	
	AmountList = data.length;
	/*##### End Amount of Passenger List #####*/
	/*##### Select Mode to display #####*/
	if(data.length == 0){
		var alertEmpty = $('<div class="alert alert-warning " role="alert" style="margin: 5px;font-size: 25px;text-align: center;">')
											.append(
												'<i class="fa fa-meh-o" aria-hidden="true"></i>',
												row.lg_pass_empty+'<br><br>',
											AddPassengerByNumber.init().css({"width":"20%","margin-left":"auto","margin-right":"auto"})
											);
											
		$('#PassForm').html(alertEmpty);
		$("#AddOneNewPass").hide();
	}else{
		if( ViewMode == "tablet"){
			$('#PassForm').empty();
			$('#PassHead').empty();
			if(StatObj.SpecilaCondition){//Check for Special form
				CreatePassFormListSpecial(AmountList,data);
			}else{
				CreatePassFormListIpadMode(AmountList,data);
			}
		}else if( ViewMode == "desktop"){
			$('#PassForm').empty();
			if(StatObj.SpecilaCondition){//Check for Special form
				CreatePassFormListSpecial(AmountList,data);
			}else{
				//CreatePassFormList(AmountList,data);		
				CreatePassFormListSpecial(AmountList,data);
			}
		}
		$('#AddOneNewPass').html('<button type="button" class="btn btn-primary" id="AddOneNewPassBtn">'+
														'<i class="fa fa-user-plus"></i> '+row.lg_add_new_pass+
													'</button>');
		$("#AddOneNewPass").show();
		AddNewPassenger();
	}
	
	/*##### End Select Mode to display #####*/	
}

function AddNewPassenger(){
	$("#AddOneNewPassBtn","#AddOneNewPass").click(function(){
		WaitForApi("wait","<b>Please wait...</b> We are adding the new passenger.");
		var AddNewPassengerAjax = $.ajax({
			url: '../API/ListPassengers.asp',
			type: 'POST',
			data:{
				typ:"addpassnum",num:1,
				id_client:StatObj.id_client,
				id_command:StatObj.CheckCommandLink.id_command,
				SQL_TYP:StatObj.CheckCommandLink.SQL_TYP
			},
			dataType:'json'
		});			
		AddNewPassengerAjax.success(function(data){
			getEl = addOncrow();
			Btn = '<div role="group"><button type="button" class="btn btn-primary delBtn"><i class="fa fa-trash"></i></button><button type="button" class="btn btn-primary copyBtn"><i class="fa fa-clone"></i><i class="fa fa-stop-circle" style="display: none"></i></button></div>';
			getEl.attr("Pass",data[0]);
			$('.colDel',getEl).html(Btn);
			CallDateRangePic_crewlist(getEl);
			WaitForApi("success","<b>successfully!</b> We have been added the new passenger.");
			PassengerNumber(1)
		});
	});
};

function PutBtnDeleteAndCopy(data,ThisEl){
	if($(ThisEl)[0].localName == "input" || $(ThisEl)[0].localName == "label"){
		RowBtn = $(ThisEl).parents("div.row")[0];
		$(RowBtn).attr("pass",data.mass);//Updata Row id
		if(ViewMode == "desktop"){
			$(RowBtn).find(".colDel").empty();
			$(RowBtn).find(".colDel")
							 .append('<div role="group"><button type="button" class="btn btn-primary delBtn"><i class="fa fa-trash"></i></button><button type="button" class="btn btn-primary copyBtn"><i class="fa fa-clone"></i><i class="fa fa-stop-circle" style="display: none"></i></button></div>');	
		}else if(ViewMode == "tablet"){
			$(RowBtn).find(".colDel .RowMassageStat div[role=group]")
						 	 .append('<div class="pull-right" style="width: 100%;"><button type="button" class="btn btn-primary delBtn"><i class="fa fa-trash"></i></button><button type="button" class="btn btn-primary copyBtn"><i class="fa fa-clone"></i><i class="fa fa-stop-circle" style="display: none"></i></button></div>');	
		}	
		
	}else{
		$(ThisEl).attr("pass",data.mass);//Updata Row id
		$(ThisEl).find(".colDel").empty();
		if(ViewMode == "desktop"){
			
			if(StatObj.SpecilaCondition){
				$(ThisEl).find(".colDel")
							 .append($('<div role="group">')
							 					.append($('<button type="button" class="btn btn-primary delBtn"><i class="fa fa-trash"></i></button>').css("width","49%"),
							 									$('<button type="button" class="btn btn-primary copyBtn"><i class="fa fa-clone"></i><i class="fa fa-stop-circle" style="display: none"></i></button>').css("width","49%")
							 					)
							 );	
			}else{
				$(ThisEl).find(".colDel")
							 .append($('<div role="group">')
							 					.append($('<button type="button" class="btn btn-primary delBtn"><i class="fa fa-trash"></i></button>').css("width","45%"),
							 									$('<button type="button" class="btn btn-primary copyBtn"><i class="fa fa-clone"></i><i class="fa fa-stop-circle" style="display: none"></i></button>').css("width","45%")
							 					)
							 );	
			}
			
			
							 
		}else if(ViewMode == "tablet"){
			$(ThisEl).find(".colDel")
							 .append($('<div role="group">')
							 					.append($('<button type="button" class="btn btn-primary delBtn"><i class="fa fa-trash"></i></button>').css("width","45%"),
							 									$('<button type="button" class="btn btn-primary copyBtn"><i class="fa fa-clone"></i><i class="fa fa-stop-circle" style="display: none"></i></button>').css("width","45%")
							 					)
							 );	
		}	
	}
}

function DisplayDelAllPassBtn(){
	if($('#PassForm > div.row[pass!="new"]').length == 0){
		$(".DeleteAll").delay(500).fadeOut();	
	}else{
		$(".DeleteAll").fadeIn();	
	}
}

function WaitInsertPassInfo(typ,stat){
	if( stat == "none"){
		if(typ == "success"){
			WaitForApi(typ,"success!");
		}else if(typ == "wait"){
			WaitForApi(typ,"wait!");
		}
	}
}

var ModalWaitApi = BootstrapModal();
function WaitForApi(typ,mass){
			$(ModalWaitApi.body).empty();
			ModalWaitApi.dialog.css({"min-width":"30%","max-width":"30%"});
			ModalWaitApi.header.hide();
			ModalWaitApi.footer.hide();
			
			ModalWaitApi.body.append(
			'<div class="alert alert-info" role="alert" style="'+
    		'width: 100%;'+
    		'display: inline-flex;'+
    		'line-height: 44px;'+
			'">'+
			'<div style="height: 71px;width: 78px;padding: 5px 5px 5px 5px;">'+
			'<i class="fa fa-user fa-5x" aria-hidden="true" style="color: #7799CC;"></i>'+
			'<i class="fa fa-circle-o-notch fa-spin" aria-hidden="true" style="position: absolute;left: 45px;top: 38px;color: #7799C;color: #FFFFFF;"></i>'+
			'</div>'+
			'<span style="'+
    		'line-height: 71px;'+
        '">'+mass+'</span>'+
        '</div>');
	if(typ == "wait"){
		$(ModalWaitApi.main).modal({backdrop: 'static', keyboard: false});//Set Modal no close when click outside or by keyboard
		ModalWaitApi.do();
		$('#PassForm input').attr("disabled","");	
	}else if(typ == "success"){
		$('#PassForm input').removeAttr("disabled","");
		$(ModalWaitApi.body).empty().append('<div class="alert alert-success" role="alert" style="width: 100%;display: inline-flex;line-height: 44px;"><div style="height: 71px;width: 78px;padding: 5px 5px 5px 5px;"><i class="fa fa-user fa-5x" aria-hidden="true" style="color: #7799CC;"></i></div><span style="line-height: 71px;"><i class="fa fa-check" aria-hidden="true" style="font-size: 25px;"></i>'+mass+'</span></div>');
		setTimeout(function(){
			$('.modal').modal('hide');	
		}, 1500);
	}
}

function EmergencyContacts(data){
	
	$('#EmergencyContacts').empty();
	var InputGroup = $('<div class="input-group" style="width:100%; margin-top:5px;">');
	var InputAddon = $('<div class="input-group-addon">');
	var InputForm = $('<input class="form-control" type="text">');
	
	var Name = $(InputGroup.clone()).append(
								$(InputAddon.clone()).append('<i class="fa fa-user" aria-hidden="true"></i> '+row.lg_boatbuilder2),
								InputForm.clone().attr("name","EmName").val(data.EM_Name)
							);
								
	var Relationship = $(InputGroup.clone()).append(
												$(InputAddon.clone()).append('<i class="fa fa-gratipay" aria-hidden="true"></i> '+row.lg_Relationship),
												InputForm.clone().attr("name","EmRalationship").val(data.EM_Relationship)
										);
										
	var Address = $(InputGroup.clone()).append(
										$(InputAddon.clone()).append('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.Address),
										InputForm.clone().attr("name","EmAddress").val(data.EM_Address)
								 );
								 
	var Country = $(InputGroup.clone()).append( //Nut add 01/06/2017
										$(InputAddon.clone()).append('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.Country),
										InputForm.clone().attr("name","EmCountry").val(data.EM_Country)
								 );
								
	var City = $(InputGroup.clone()).append(
												$(InputAddon.clone()).append('<i class="fa fa-map-marker" aria-hidden="true"></i> '+row.City+', '+row.State+', '+row.Zipcode+''),
												InputForm.clone().attr("name","EmCity").val(data.EM_City)
										);
	var Telephone1 = $(InputGroup.clone()).append(
												$(InputAddon.clone()).append('<i class="fa fa-phone" aria-hidden="true"></i> '+row.lg_phone_number+' 1'),
												InputForm.clone().attr("name","EmPhone1").val(data.EM_Phone)
										);
	var Telephone2 = $(InputGroup.clone()).append(
												$(InputAddon.clone()).append('<i class="fa fa-phone" aria-hidden="true"></i> '+row.lg_phone_number+' 2'),
												InputForm.clone().attr("name","EmPhone2").val(data.EM_Phone2)
										);
	if (StatObj.clss_emercountry == 'none') { Country = '' } //Nut add 01/06/2017
	$('#EmergencyContacts').append(Name,Relationship,Address,Country,City,Telephone1,Telephone2)
												 .promise()
												 .done(EventEmergencyContacts());
	GetEmergentcyElement();
	
}

function EmergencyProgressManage(typ,idAjax){
	
	$.each(AjaxQueueEmergency,function(index,ObjXHR){
		if(typeof ObjXHR != "undefined"){
			if(ObjXHR.this.idAjax == idAjax){
				if(AjaxQueueEmergency.length != 1){
					AjaxQueueEmergency.splice(index, 1);//Delete Ajax that Done	
				}else if(AjaxQueueEmergency.length == 1){
					AjaxQueueEmergency = [];
				}
			}
		}
	});
	if(typ == "success" && AjaxQueueEmergency.length == 0 ){
		AjaxQueueProgress();
	}else{
		$('#EmergencyProgress .alert-info span.Inqueue').html(AjaxQueueEmergency.length);
		AjaxQueueProgress();
	}
}

var QueueEmergency = [];
var QueueUpdateEmergency = (function(){
    var add = function(El,KeepSuccess){
    		AjaxQueueProgress();
        var data = {"El":El,"KeepSuccess":KeepSuccess};
				QueueEmergency.push([data]);
				if(QueueEmergency.length == 1){//Start
					doAjax(El);
				}
    };
    var next = function(El){
        var old = QueueEmergency[0];//old
        if(deleteObj()){
        	var idObj = QueueEmergency[0];//Next
	       	if(typeof idObj != 'undefined' ){
	       		doAjax(El);
	       	}
        } 
    };
    var doAjax = function(El){
    	try{
	    	var value =	window.btoa(unescape(encodeURIComponent($(QueueEmergency[0][0].El).val())))//window.btoa($(QueueEmergency[0][0].El).val())
	    	var Ajax = ChangeEmergencyInfo(QueueEmergency[0][0].El);
	      	Ajax.success(QueueEmergency[0][0].KeepSuccess);
	        Ajax.error(function(xhr, status, error){
		      	window.fail = "fail";
		      	StatUpdate.options({
 							el:El,
 							typ:"error"
						})
		      	ProgressManage("danger",this.idAjax);
						QueueUpdateEmergency.next(El);
						window.fail = "";
					});	
	    }catch(e){
	    	window.fail = "fail";
	    	StatUpdate.options({
 					el:El,
 					typ:"error"
				})
				ProgressManage("danger",this.idAjax);
				QueueUpdateEmergency.next(El);
				window.fail = "";
	    };
    };
    var deleteObj = function(){
    	QueueEmergency.shift();//Delete
    	AjaxQueueProgress();
    	return true;
    }
    return {
        add:add,
        next:next,
        deleteObj:deleteObj
    };
}());

function EventEmergencyContacts(){
	
//	$('#EmergencyContacts').on({
//		"keyup":function(ev){
//			var ThisEl = $(this);
//			if(ev.keyCode == 8 || ev.keyCode == 46 && ev.keyCode != 86){//When press SPACE and DELETE button and 86 Check for V
//				$(ThisEl).change(function(event){
//						$(ThisEl).unbind();
//						event.stopPropagation();
//					});
//				delay(function(){//When stop typing and wait then save.
//					if(EMData[$(ThisEl).attr("name")] != $(ThisEl).val()){
//						StatUpdate.options({
//					 		el:ThisEl,
//					 		typ:"inprogress"
//						})
//						QueueUpdateEmergency.add(ThisEl,function(data){
//							WaitInsertPassInfo("success",StatObj.id_info);
//							EMData[data.name] = data.mass;//Update Change
//							UpdateIdInfo(data);
//							StatUpdate.options({
//					 			el:ThisEl,
//					 			typ:"success"
//							})
//							EmergencyProgressManage("success",this.idAjax);
//							QueueUpdateEmergency.next(ThisEl);
//							GetEmergentcyElement();
//						});
//					}
//	    	},300);
//    	}else{
//				var NotAlowNewEmpty = ($(ThisEl).val().replace(/\s+/g, '') == "");
//				if(!NotAlowNewEmpty){
//					delay(function(){//When stop typing and wait then save.
//						if(ev.keyCode != 17){//Check for CTRL
//							if(EMData[$(ThisEl).attr("name")] != $(ThisEl).val()){
//								EMData[$(ThisEl).attr("name")] = $(ThisEl).val();
//								StatUpdate.options({
//					 				el:ThisEl,
//					 				typ:"inprogress"
//								})
//								QueueUpdateEmergency.add(ThisEl,function(data){
//									WaitInsertPassInfo("success",StatObj.id_info);
//									EMData[data.name] = data.mass;//Update Change
//									UpdateIdInfo(data);
//									StatUpdate.options({
//					 					el:ThisEl,
//					 					typ:"success"
//									})
//									EmergencyProgressManage("success",this.idAjax);
//									QueueUpdateEmergency.next(ThisEl);
//									GetEmergentcyElement();
//								});
//							}
//						}
//					},700);
//				}
//			}
//		},
//		"change":function(){
//			var ThisEl = $(this);
//			
//			var NotAlowNewEmpty = ($(ThisEl).val().replace(/\s+/g, '') == "");
//			if(EMData[$(ThisEl).attr("name")] != $(ThisEl).val() && !NotAlowNewEmpty){
//				
//				EMData[$(ThisEl).attr("name")] = $(ThisEl).val();
//						StatUpdate.options({
//					 		el:ThisEl,
//					 		typ:"inprogress"
//						})
//						QueueUpdateEmergency.add(ThisEl,function(data){
//							WaitInsertPassInfo("success",StatObj.id_info);
//							EMData[data.name] = data.mass;//Update Change
//							UpdateIdInfo(data);
//							StatUpdate.options({
//					 			el:ThisEl,
//					 			typ:"success"
//							})
//							EmergencyProgressManage("success",this.idAjax);
//							QueueUpdateEmergency.next(ThisEl);
//							GetEmergentcyElement();
//						});
//			}
//		},
//		"paste":function(){
//			var ThisEl = $(this);
//			
//			delay(function(){//When stop typing and wait then save.
//			if(EMData[$(ThisEl).attr("name")] != $(ThisEl).val()){
//				var NotAlowNewEmpty = ($(ThisEl).val().replace(/\s+/g, '') == "");
//				if(!NotAlowNewEmpty){
//					StatUpdate.options({
//					 el:ThisEl,
//					 typ:"inprogress"
//					})
//					QueueUpdateEmergency.add(ThisEl,function(data){
//							WaitInsertPassInfo("success",StatObj.id_info);
//							EMData[data.name] = data.mass;//Update Change
//							UpdateIdInfo(data);
//							StatUpdate.options({
//					 			el:ThisEl,
//					 			typ:"success"
//							})
//							EmergencyProgressManage("success",this.idAjax);
//							QueueUpdateEmergency.next(ThisEl);
//							GetEmergentcyElement();
//						});
//				}
//			}
//			}, 200 );
//		}
//	},'input');

	$('#EmergencyContacts').on({
		"keyup"	:function(ev){
			var ThisEl = $(this);
			if(ev.keyCode == 8 || ev.keyCode == 46 && ev.keyCode != 86 ){//When press SPACE and DELETE button and 86 Check for CTRL+V
				$(ThisEl).change(function(event){
						$(ThisEl).unbind();
						event.stopPropagation();
				});
				delay(function(){//When stop typing and wait then save.
					if(EMData[$(ThisEl).attr("name")] != $(ThisEl).val()){
						StatUpdate.options({
							el:ThisEl,
							typ:"inprogress"
						})
						QueueUpdateEmergency.add(ThisEl,function(data,idObj,idAjax){
							WaitInsertPassInfo("success",StatObj.id_info);
							EMData[data.name] = data.mass;//Update Change
							UpdateIdInfo(data);
							StatUpdate.options({
								el:ThisEl,
								typ:"success"
							})
							EmergencyProgressManage("success",this.idAjax);
							WaitInsertPassInfo("success",this.idAjax);
							QueueUpdateEmergency.next(ThisEl);
							GetEmergentcyElement()
						});
					}
	    	},300);
    	}else{
				
				var NotAlowNewEmpty = ($(ThisEl).val().replace(/\s+/g, '') == "");
				if(!NotAlowNewEmpty){
					
					delay(function(){//When stop typing and wait then save.
						if(ev.keyCode != 86){//Check for CTRL+V 
							if(EMData[$(ThisEl).attr("name")] != $(ThisEl).val()){
								StatUpdate.options({
									el:ThisEl,
									typ:"inprogress"
								})
								QueueUpdateEmergency.add(ThisEl,function(data,idObj,idAjax){
									WaitInsertPassInfo("success",StatObj.id_info);
									EMData[data.name] = data.mass;//Update Change
									UpdateIdInfo(data);
									StatUpdate.options({
										el:ThisEl,
										typ:"success"
									})
									EmergencyProgressManage("success",this.idAjax);
									WaitInsertPassInfo("success",this.idAjax);
									QueueUpdateEmergency.next(ThisEl);
									GetEmergentcyElement()
								});
							}
						}
					},700);
				}
			}
		},
		"change":function(){
			var ThisEl = $(this);
			
			var NotAlowNewEmpty = ($(ThisEl).val().replace(/\s+/g, '') == "");
			if(EMData[$(ThisEl).attr("name")] != $(ThisEl).val() && !NotAlowNewEmpty){
				StatUpdate.options({
					el:ThisEl,
					typ:"inprogress"
				})
				QueueUpdateEmergency.add(ThisEl,function(data,idObj,idAjax){
							WaitInsertPassInfo("success",StatObj.id_info);
							EMData[data.name] = data.mass;//Update Change
							UpdateIdInfo(data);
							StatUpdate.options({
								el:ThisEl,
								typ:"success"
							})
							EmergencyProgressManage("success",this.idAjax);
							WaitInsertPassInfo("success",this.idAjax);
							QueueUpdateEmergency.next(ThisEl);
							GetEmergentcyElement()
				});
			}
		},
		"paste":function(){
			var ThisEl = $(this);
			delay(function(){//When stop typing and wait then save.
			if(EMData[$(ThisEl).attr("name")] != $(ThisEl).val()){
				var NotAlowNewEmpty = ($(ThisEl).val().replace(/\s+/g, '') == "");
				if(!NotAlowNewEmpty){
					StatUpdate.options({
						el:ThisEl,
						typ:"inprogress"
					})
					QueueUpdateEmergency.add(ThisEl,function(data,idObj,idAjax){
							WaitInsertPassInfo("success",StatObj.id_info);
							EMData[data.name] = data.mass;//Update Change
							UpdateIdInfo(data);
							StatUpdate.options({
								el:ThisEl,
								typ:"success"
							})
							EmergencyProgressManage("success",this.idAjax);
							WaitInsertPassInfo("success",this.idAjax);
							QueueUpdateEmergency.next(ThisEl);
							GetEmergentcyElement()
						});
				}
			}
			}, 200 );
		}
	},'input');
	
}

function ArrivalMarinaForm(data){
	$('#ArrivalMarina').empty();
	$('#MoreDetailArr').empty();
	$('#PassInfoComment').empty();
	var DivRow = $('<div class="row">');
	var LableRequire = "";
	var Vehicle = [{id:1,icon:"<i class='fa fa-plane'></i> ",name:"Plane"},
								 {id:6,icon:"<i class='fa fa-hashtag' aria-hidden='true'></i><i class='fa fa-plane'> ",name:"STT"},
								 {id:7,icon:"<i class='fa fa-hashtag' aria-hidden='true'></i><i class='fa fa-plane'> ",name:"EIS"},
								 {id:2,icon:"<i class='fa fa-car'></i> ",name:"Car"},
								 {id:4,icon:"<i class='fa fa-ship'></i> ",name:"Ship"},
								 {id:5,icon:"<i class='fa fa-train'></i> ",name:"Train"},
								 {id:3,icon:"<i class='fa fa-ellipsis-h'></i> ",name:"Other"}
								];
							
	var VehicleContain = $('<div class="btn-group" role="group" aria-label="First group">').attr("id","VehicleContain");
	
	$.each(Vehicle,function(index,value){
		if( value.id == data.ATM_Access ){
			$(VehicleContain).append($('<button type="button" class="btn btn-primary" name="ATM_Access" typ="'+value.name+'">').val(value.id).addClass("active vehicle").html(value.icon+data.Vihecle[value.id].name));
		}else{
			if(data.Vihecle[value.id] && data.Vihecle[value.id].name != ""){
				$(VehicleContain).append($('<button type="button" class="btn btn-primary" name="ATM_Access" typ="'+value.name+'">').val(value.id).addClass("vehicle").html(value.icon+data.Vihecle[value.id].name));		
			}
		}
	});
	
	var BtnYes = $('<button type="button" class="btn btn-primary">').attr({"name":"ATM_Taxi","id":"ArrYes"}).val(1).html('<i class="fa fa-check" aria-hidden="true"></i> '+ledico_yes); 
	var BtnNo = $('<button type="button" class="btn btn-primary">').attr({"name":"ATM_Taxi","id":"ArrNo"}).val(0).html('<i class="fa fa-times" aria-hidden="true"></i> '+ledico_no);
	
	if(StatObj.clss_taxi_trans == "" && droits.ss_id_ope != "162"){
		if(data.ATM_Taxi == 1 ){
			$(BtnYes).addClass("active");
		}else{
			$(BtnNo).addClass("active");
		}
		LableRequire = $('<button type="button" class="btn">').html(row.lg_vtt);
	}else{
		BtnYes = "";
		BtnNo = "";
		LableRequire = "";
	}
	
	var RequireArrivalTransfer = $('<div class="btn-group" role="group" aria-label="Second group">').attr("id","RegArrTra").append(BtnYes,BtnNo);
	var VehicleEl =	$('<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">').append($('<button type="button" class="btn">').html('<i class="fa fa-bus" aria-hidden="true"></i> '+row.lg_arrive_by+' :'),VehicleContain);
	var ReqTranfer = $('<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">').append(LableRequire,RequireArrivalTransfer);
	
	var Row1 = $(DivRow).clone().append(VehicleEl,ReqTranfer);
	
	if(StatObj.SpecilaCondition){//Display Input Access_Comment
		var Input = $('<div class="input-group" style="width:100%; margin-top:5px;">').append(
			'<div class="input-group-addon"><i class="fa fa-clock-o"></i> '+row.lg_CommentACC+'</div>',
			$('<input class="form-control Arrmarina" type="text" name="ATMCommentACC"></div>').val(data.Access_Comment)
		); 
		var CommentACC = $('<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">').append(Input);
		var Row2 = $(DivRow).clone().append(CommentACC);	
	}else{//Don't Display Input Access_Comment
		var Row2 = "";
	}
	
	if(StatObj.clss_datestart == ""){//Display Input Arrival Date
		var Input = $('<div class="input-group" style="width:100%; margin-top:5px;">').append(
			'<div class="input-group-addon"><i class="fa fa-calendar"></i> '+row.DateEnd+'</div>',
			$('<input class="form-control Arrmarina" type="text" name="ATM_DateStart">').val(data.ATM_DateStart)
		);
		var ArrivalDate = $('<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">').append(Input);
	}else{//Don't Display Input Arrival Date
		ArrivalDate = "";
	}
	
	if(StatObj.clss_arrival_time == ""){//Display Input Arrival Time
		var Input = $('<div class="input-group" style="width:100%; margin-top:5px;">').append(
			'<div class="input-group-addon"><i class="fa fa-clock-o"></i> '+row.lg_at+'</div>',
			$('<input class="form-control Arrmarina" type="text" name="ATM_Arrival_Time"></div>').val(data.ATM_Arrival_Time)
		); 
		var ArrivalTime = $('<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">').append(Input);	
	}else{//Don't Display Input Arrival Time
		var ArrivalTime = "";
	}
	
	var Row3 = $(DivRow).clone().append(ArrivalDate,ArrivalTime);
	
	if(StatObj.clss_hotel_prior == ""){
		
		var YES = $('<label class="btn btn-primary">').attr({"name":"HotelPrior","autocomplete":"off"}).val(1).append($('<input type="radio">'),'<i class="fa fa-check" aria-hidden="true"></i> '+row.Yes),
				No = $('<label class="btn btn-primary">').attr({"name":"HotelPrior","autocomplete":"off"}).val(0).append($('<input type="radio">'),'<i class="fa fa-times" aria-hidden="true"></i> '+row.No),
				BtnGroup = $('<div class="btn-group" data-toggle="buttons">').attr("id","SpecilaArrivalToMarina1").append(YES,No).css("margin-left","5px"),
				Lable = $('<button type="button" class="btn">').html('<i class="fa fa-building-o" aria-hidden="true"></i> Will you be staying in a hotel prior to charter? :'),
				Row4 = $('<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">').append($(DivRow).clone().append(Lable,BtnGroup).css("margin-top","5px"));
				
		if(data.Hotel == "1"){
			$(YES).addClass("active");
		}else{
			$(No).addClass("active");
		}
				
	}else{
		var Row4 = "";
	}
	
	if(StatObj.clss_vberths == ""){
		
		var YES = $('<label class="btn btn-primary">').attr({"name":"Vberths","autocomplete":"off"}).val(1).append($('<input type="radio">'),'<i class="fa fa-check" aria-hidden="true"></i> '+row.Yes),
				No = $('<label class="btn btn-primary">').attr({"name":"Vberths","autocomplete":"off"}).val(0).append($('<input type="radio">'),'<i class="fa fa-times" aria-hidden="true"></i> '+row.No),
				BtnGroup = $('<div class="btn-group" data-toggle="buttons">').attr("id","SpecilaArrivalToMarina2").append(YES,No).css("margin-left","5px"),
				Lable = $('<button type="button" class="btn">').html('<i class="fa fa-bed" aria-hidden="true"></i>'+row.Vberths ).css("text-align","left"),
				Row5 = $('<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">').append($(DivRow).clone().append(Lable,BtnGroup).css("margin-top","5px"));
		
		if(data.Vberths == "1"){
			$(YES).addClass("active");
		}else{
			$(No).addClass("active");
		}
		
	}else{
		var Row5 = "";
	}
	
	$("#ArrivalMarina").append(Row1,Row2,$('#MoreDetailArr').append($(MoreDetailArrivalByVehicleForm(data))).hide(),Row3,Row4,Row5);
	
	ArrivalMarinaFormBinding(data);
	GetArriveToMarinaElement();
}

function ArrivalMarinaProgressManage(typ,idAjax){
	$.each(AjaxMarina,function(index,ObjXHR){
		if(typeof ObjXHR != "undefined"){
			if(ObjXHR.this.idAjax == idAjax){
				if(AjaxMarina.length != 1){
					AjaxMarina.splice(index, 1);//Delete Ajax that Done	
				}else if(AjaxMarina.length == 1){
					AjaxMarina = [];
				}
			}
		}
	});
	if(typ == "success" && AjaxMarina.length == 0 ){
		AjaxQueueProgress();
	}else{
		AjaxQueueProgress();
	}
}

function ArrivalMarinaFormBinding(data){
	
	if($('#VehicleContain > button[typ="Car"]').hasClass("active")){
		$('#RegArrTra button').attr('disabled','');
	}
	
	if($('#ArrYes').hasClass("active")){
		$('#MoreDetailArr').show();
	}
	
	$('#ArrivalMarina').on({
		"click":function(){
			var El = $(this);
			$('button.vehicle').removeClass("active");
			$(this).addClass("active");
			if($(this).attr('typ') == "Car"){
				$('#RegArrTra button').attr('disabled','');
				$('#MoreDetailArr').hide();
			}else{
				$('#RegArrTra button').removeAttr('disabled');
				if($('#ArrYes').hasClass("active")){
					$('#MoreDetailArr').show();
				}
			}
			
			if($(El).val() != ArrToMar.ATM_Access ){
				$("#VehicleContain button").attr("disabled","");
				QueueChangeArriveToMarina.add(El,function(data,idObj,idAjax){
							WaitInsertPassInfo("success",StatObj.id_info);
							ArrToMar["ATM_Access"] = data.mass;
							UpdateIdInfo(data);
							ArrivalMarinaProgressManage("success",this.idAjax);
							WaitInsertPassInfo("success",this.idAjax);
							$("#VehicleContain button").removeAttr("disabled","");
							QueueChangeArriveToMarina.next(El);
							GetArriveToMarinaElement()
						});
			}
			
	}},'button.vehicle');
	
	$('#ArrivalMarina').on({
		"click":function(){
			var El = $(this);
			$('button[name=ATM_Taxi]').removeClass('active');
			$(this).addClass('active');
			if($(this).attr("id") == "ArrYes"){
				$('#MoreDetailArr').slideDown();
				GetArriveToMarinaElement();
			}else{
				$('#MoreDetailArr').slideUp();
				setTimeout(function(){ GetArriveToMarinaElement(); }, 800);
				
			}
			if($(El).val() != ArrToMar.ATM_Taxi ){
				$("#RegArrTra button").attr("disabled","");
				QueueChangeArriveToMarina.add(El,function(data,idObj,idAjax){
							WaitInsertPassInfo("success",StatObj.id_info);
							ArrToMar["ATM_Taxi"] = data.mass;
							UpdateIdInfo(data);
							ArrivalMarinaProgressManage("success",this.idAjax);
							WaitInsertPassInfo("success",this.idAjax);
							$("#RegArrTra button").removeAttr("disabled","");
							QueueChangeArriveToMarina.next(El);
							GetArriveToMarinaElement()
						});
			}
			
	}},'button[name=ATM_Taxi]');
	
	$('#ArrContainer').on({
		"keyup"	:function(ev){
			var ThisEl = $(this);
			if(ev.keyCode == 8 || ev.keyCode == 46 && ev.keyCode != 86 ){//When press SPACE and DELETE button and 86 Check for CTRL+V
				$(ThisEl).change(function(event){
						$(ThisEl).unbind();
						event.stopPropagation();
				});
				delay(function(){//When stop typing and wait then save.
					if(ArrToMar[$(ThisEl).attr("name")] != $(ThisEl).val()){
						StatUpdate.options({
							el:ThisEl,
							typ:"inprogress"
						})
						QueueChangeArriveToMarina.add(ThisEl,function(data,idObj,idAjax){
							WaitInsertPassInfo("success",StatObj.id_info);
							ArrToMar[data.name] = data.mass;//Update Change
							UpdateIdInfo(data);
							StatUpdate.options({
								el:ThisEl,
								typ:"success"
							})
							ArrivalMarinaProgressManage("success",this.idAjax);
							WaitInsertPassInfo("success",this.idAjax);
							QueueChangeArriveToMarina.next(ThisEl);
							GetArriveToMarinaElement()
						});
					}
	    	},300);
    	}else{
				
				var NotAlowNewEmpty = ($(ThisEl).val().replace(/\s+/g, '') == "");
				if(!NotAlowNewEmpty){
					
					delay(function(){//When stop typing and wait then save.
						if(ev.keyCode != 86){//Check for CTRL+V 
							if(ArrToMar[$(ThisEl).attr("name")] != $(ThisEl).val()){
								StatUpdate.options({
									el:ThisEl,
									typ:"inprogress"
								})
								QueueChangeArriveToMarina.add(ThisEl,function(data,idObj,idAjax){
									WaitInsertPassInfo("success",StatObj.id_info);
									ArrToMar[data.name] = data.mass;//Update Change
									UpdateIdInfo(data);
									StatUpdate.options({
										el:ThisEl,
										typ:"success"
									})
									ArrivalMarinaProgressManage("success",this.idAjax);
									WaitInsertPassInfo("success",this.idAjax);
									QueueChangeArriveToMarina.next(ThisEl);
									GetArriveToMarinaElement()
								});
							}
						}
					},700);
				}
			}
		},
		"change":function(){
			var ThisEl = $(this);
			
			var NotAlowNewEmpty = ($(ThisEl).val().replace(/\s+/g, '') == "");
			if(ArrToMar[$(ThisEl).attr("name")] != $(ThisEl).val() && !NotAlowNewEmpty){
				StatUpdate.options({
					el:ThisEl,
					typ:"inprogress"
				})
				QueueChangeArriveToMarina.add(ThisEl,function(data,idObj,idAjax){
							WaitInsertPassInfo("success",StatObj.id_info);
							ArrToMar[data.name] = data.mass;//Update Change
							UpdateIdInfo(data);
							StatUpdate.options({
								el:ThisEl,
								typ:"success"
							})
							ArrivalMarinaProgressManage("success",this.idAjax);
							WaitInsertPassInfo("success",this.idAjax);
							QueueChangeArriveToMarina.next(ThisEl);
							GetArriveToMarinaElement()
				});
			}
		},
		"paste":function(){
			var ThisEl = $(this);
			delay(function(){//When stop typing and wait then save.
			if(ArrToMar[$(ThisEl).attr("name")] != $(ThisEl).val()){
				var NotAlowNewEmpty = ($(ThisEl).val().replace(/\s+/g, '') == "");
				if(!NotAlowNewEmpty){
					StatUpdate.options({
						el:ThisEl,
						typ:"inprogress"
					})
					QueueChangeArriveToMarina.add(ThisEl,function(data,idObj,idAjax){
							WaitInsertPassInfo("success",StatObj.id_info);
							ArrToMar[data.name] = data.mass;//Update Change
							UpdateIdInfo(data);
							StatUpdate.options({
								el:ThisEl,
								typ:"success"
							})
							ArrivalMarinaProgressManage("success",this.idAjax);
							WaitInsertPassInfo("success",this.idAjax);
							QueueChangeArriveToMarina.next(ThisEl);
							GetArriveToMarinaElement()
						});
				}
			}
			}, 200 );
		}
	},'.Arrmarina');
	
	$('#ArrivalMarina').on({
		"click":function(){
			var El = $(this);
			if($(El).val() != ArrToMar.HotelPrior ){
				$("#SpecilaArrivalToMarina1 label").attr("disabled","").css("pointerEvents","none");
				StatUpdate.options({
					el:ThisEl,
					typ:"inprogress"
				})
				QueueChangeArriveToMarina.add(El,function(data,idObj,idAjax){
							WaitInsertPassInfo("success",StatObj.id_info);
							ArrToMar["HotelPrior"] = data.mass;
							UpdateIdInfo(data);
							StatUpdate.options({
								el:ThisEl,
								typ:"success"
							})
							ArrivalMarinaProgressManage("success",this.idAjax);
							WaitInsertPassInfo("success",this.idAjax);
							$("#SpecilaArrivalToMarina1 label").removeAttr("disabled","").css("pointerEvents","auto");
							QueueChangeArriveToMarina.next(El);
							GetArriveToMarinaElement()
						});
			}
		}
	},'#SpecilaArrivalToMarina1 > label[name="HotelPrior"]');
	
	$('#ArrivalMarina').on({
		"click":function(){
			var El = $(this);
			if($(El).val() != ArrToMar.Vberths ){
				$("#SpecilaArrivalToMarina2 label").attr("disabled","").css("pointerEvents","none");
				StatUpdate.options({
					el:ThisEl,
					typ:"inprogress"
				})
				QueueChangeArriveToMarina.add(El,function(data,idObj,idAjax){
							WaitInsertPassInfo("success",StatObj.id_info);
							ArrToMar["Vberths"] = data.mass;
							UpdateIdInfo(data);
							StatUpdate.options({
								el:ThisEl,
								typ:"success"
							})
							ArrivalMarinaProgressManage("success",this.idAjax);
							WaitInsertPassInfo("success",this.idAjax);
							$("#SpecilaArrivalToMarina2 label").removeAttr("disabled","").css("pointerEvents","auto");
							QueueChangeArriveToMarina.next(El);
							GetArriveToMarinaElement()
				});
			}
		}
	},'#SpecilaArrivalToMarina2 > label[name="Vberths"]');
	
	
}

function MoreDetailArrivalByVehicleForm(data){
	
		var AmountPeople = $('<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">').append(
			$('<div class="input-group" style="width:100%; margin-top:5px;"><div class="input-group-addon"><i class="fa fa-users"></i> '+row.lg_pcp+'</div>')
			.append($('<input class="form-control Arrmarina" type="text" name="ATM_AmountCrew">').val(data.ATM_AmountCrew))
		);
		
		var FlightNo = $('<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">').append(
			$('<div class="input-group" style="width:100%; margin-top:5px;"><div class="input-group-addon"><i class="fa fa-hashtag"></i> '+row.lg_nva+'</div>')
			.append($('<input class="form-control Arrmarina" type="text" name="ATM_Flight_Number">').val(data.ATM_Flight_Number))
		);
		
		var From = $('<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">').append(
			$('<div class="input-group" style="width:100%; margin-top:5px;"><div class="input-group-addon"><i class="fa fa-level-up"></i> '+row.lg_de+'</div>')
			.append($('<input class="form-control Arrmarina" type="text" name="ATM_Flight_From">').val(data.ATM_Flight_From))
		);
		
		var To = $('<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">').append(
			$('<div class="input-group" style="width:100%; margin-top:5px;"><div class="input-group-addon"><i class="fa fa-level-down"></i> '+row.tvers+'</div>')
			.append($('<input class="form-control Arrmarina" type="text" name="ATM_Flight_To">').val(data.ATM_Flight_To))
		);
		
		var InputsForm = $('<div class="row" id="MoreDetail">').append(AmountPeople,FlightNo,From,To);
		
		return InputsForm;
}

function PassInfoCommment(data){
	var TextArea = $('<div class="form-group">').append(
		$('<button type="button" class="btn">').css("margin","5px 0px 5px 0px").html('<i class="fa fa-commenting-o" aria-hidden="true"></i> '+row.lg_comm1),
		$('<textarea class="form-control" rows="5" id="comment" name="Comment">').val(data.Comment)
	);
	$('#PassInfoComment').css("padding-top","5px").append(TextArea);
	PassInfoCommmentBinding(data);
	GetArriveToMarinaElement();
}

function PassInfoCommmentProgressManage(typ,idAjax){
	
	$.each(AjaxComment,function(index,ObjXHR){
		if(typeof ObjXHR != "undefined"){
			if(ObjXHR.this.idAjax == idAjax){
				if(AjaxComment.length != 1){
					AjaxComment.splice(index, 1);//Delete Ajax that Done	
				}else if(AjaxComment.length == 1){
					AjaxComment = [];
				}
			}
		}
	});
	if(typ == "success" && AjaxComment.length == 0 ){
		AjaxQueueProgress();
	}else{
		$('#ArrivalMarinaProgress .alert-info span.Inqueue').html(AjaxComment.length);
		AjaxQueueProgress();
	}
}

var QueueComment = [];
var QueueUpdateComment = (function(){
    var add = function(El,KeepSuccess){
        var data = {"El":El,"KeepSuccess":KeepSuccess};
				QueueComment.push([data]);
				ArrivalMarinaProgressManage("info");
				if(QueueComment.length == 1){//Start
					doAjax(El);
				}
    };
    var next = function(El){
        var old = QueueComment[0];//old
        StatDelete = deleteObj(old);
        if(StatDelete){
        	ArrivalMarinaProgressManage("info");
        	var idObj = QueueComment[0];//Next
	       	if(typeof idObj != 'undefined' ){
	       		doAjax(El);
	       	}
        } 
    };
    var doAjax = function(El){
    	try{
	    	var value =	window.btoa(unescape(encodeURIComponent($(QueueComment[0][0].El).val())))//window.btoa($(QueueComment[0][0].El).val())
	    	var Ajax = ChangePassInfoComment(QueueComment[0][0].El);
	      	Ajax.success(QueueComment[0][0].KeepSuccess);
	      	Ajax.error(function(xhr, status, error){
		      	window.fail = "fail";
		      	StatUpdate.options({
							el:El,
							typ:"error"
						})
		      	ProgressManage("danger",this.idAjax);
							QueueUpdateComment.next(El);
						  window.fail = "";
					});	
	    }catch(e){
	    	window.fail = "fail";
				ProgressManage("danger",this.idAjax);
				QueueUpdateComment.next(El);
				window.fail = "";
	    }
    };
    var deleteObj = function(old){
    	AjaxQueueProgress();
    	QueueComment.shift();//Delete
    	return true;
    }
    return {
        add:add,
        next:next,
        deleteObj:deleteObj
    };
}());

function PassInfoCommmentBinding(){
	
	$('#PassInfoComment').on({
		"keyup"	:function(ev){
			var ThisEl = $(this);
			if(ev.keyCode == 8 || ev.keyCode == 46 && ev.keyCode != 86 ){//When press SPACE and DELETE button and 86 Check for CTRL+V
				$(ThisEl).change(function(event){
						$(ThisEl).unbind();
						event.stopPropagation();
				});
				delay(function(){//When stop typing and wait then save.
					if(CommentData[$(ThisEl).attr("name")] != $(ThisEl).val()){
						AjaxQueueProgress();
						StatUpdate.options({
							el:ThisEl,
							typ:"inprogress"
						})
						QueueUpdateComment.add(ThisEl,function(data){
						WaitInsertPassInfo("success",StatObj.id_info);
						CommentData["Comment"] = data.Comment;
						UpdateIdInfo(data);
						StatUpdate.options({
							el:ThisEl,
							typ:"success"
						})
						PassInfoCommmentProgressManage("success",this.idAjax);
						AjaxQueueProgress();
						QueueUpdateComment.next(ThisEl);
						});
					}
	    	},300);
    	}else{
				
				var NotAlowNewEmpty = ($(ThisEl).val().replace(/\s+/g, '') == "");
				if(!NotAlowNewEmpty){
					
					delay(function(){//When stop typing and wait then save.
						if(ev.keyCode != 86){//Check for CTRL+V 
							if(CommentData[$(ThisEl).attr("name")] != $(ThisEl).val()){
								
								CommentData[$(ThisEl).attr("name")] = $(ThisEl).val();
								AjaxQueueProgress();
								StatUpdate.options({
									el:ThisEl,
									typ:"inprogress"
								})
								QueueUpdateComment.add(ThisEl,function(data){
									WaitInsertPassInfo("success",StatObj.id_info);
									CommentData["Comment"] = data.Comment;
									UpdateIdInfo(data);
									StatUpdate.options({
										el:ThisEl,
										typ:"success"
									})
									PassInfoCommmentProgressManage("success",this.idAjax);
									AjaxQueueProgress();
									QueueUpdateComment.next(ThisEl);
								});
							}
						}
					},700);
				}
			}
		},
		"change":function(){
				var ThisEl = $(this);
				
				var NotAlowNewEmpty = ($(ThisEl).val().replace(/\s+/g, '') == "");
				if(CommentData[$(ThisEl).attr("name")] != $(ThisEl).val() && !NotAlowNewEmpty){
					
					CommentData[$(ThisEl).attr("name")] = $(ThisEl).val();
					AjaxQueueProgress();
					StatUpdate.options({
						el:ThisEl,
						typ:"inprogress"
					})
					QueueUpdateComment.add(ThisEl,function(data){
						WaitInsertPassInfo("success",StatObj.id_info);
						CommentData["Comment"] = data.Comment;
						UpdateIdInfo(data);
						StatUpdate.options({
							el:ThisEl,
							typ:"success"
						})
						PassInfoCommmentProgressManage("success",this.idAjax);
						AjaxQueueProgress();
						QueueUpdateComment.next(ThisEl);
					});
				}
		},
		"paste":function(){
			var ThisEl = $(this);
			
			delay(function(){//When stop typing and wait then save.
			if(CommentData[$(ThisEl).attr("name")] != $(ThisEl).val()){
				var NotAlowNewEmpty = ($(ThisEl).val().replace(/\s+/g, '') == "");
				if(!NotAlowNewEmpty){
					
					AjaxQueueProgress();
					StatUpdate.options({
						el:ThisEl,
						typ:"inprogress"
					})
					QueueUpdateComment.add(ThisEl,function(data){
						WaitInsertPassInfo("success",StatObj.id_info);
						CommentData["Comment"] = data.Comment;
						UpdateIdInfo(data);
						StatUpdate.options({
							el:ThisEl,
							typ:"success"
						})
						PassInfoCommmentProgressManage("success",this.idAjax);
						AjaxQueueProgress();
						QueueUpdateComment.next(ThisEl);
					});
				}
			}
			}, 200 );
		}
	},'textarea#comment');
	
}

function UpdateIdInfo(data){
	if(typeof data.Add != "undefined"){
		StatObj["id_info"] = data.Add;
	}
}

function AjaxQueueProgress(){
	var AllQueue = Object.keys(QueueCallFunction).length+QueueEmergency.length+Object.keys(QueueArriveToMarina).length+AjaxComment.length+AjaxAccess.length+AjaxQueueNut.length+QueueCoSkipper.length+QueueSkipper.length+QueueBoatingHistory.length;
	if(window.fail=="fail"){
		$('title').text("Booking Detail (Fail!)")
		$('#Message').html(StatusProgress("danger",'<i class="fa fa-remove"></i> <b>Fail!</b> Your changes are not saved.'));	
	}else if(AllQueue > 0){
		$('title').text("Booking Detail ( "+AllQueue+" )")
		$('#Message').html(StatusProgress("info",'<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> <b>Please, wait...</b> Your changes are saving. '+'These are (<b>'+AllQueue+'</b>) in a queue.'));	
	}else if(AllQueue == 0){
		$('title').text("Booking Detail (Success!)")
		$('#Message').html(StatusProgress("success",'<i class="fa fa-check-circle"></i> <b>Success!</b> Your changes are saved.'));	
	}
}

function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text); 

    }else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}

var IconProg = (function(){
	var init = function(typ){
		var icon;
		if(typ == "CrewListProg"){
			icon = '<a href="#CW">'+'<i class="fa fa-th-list IconProg"></i>';
		}else if(typ == "SkipperInfoProg"){
			icon = '<a href="#SK">'+'<i class="fa fa-user IconProg"></i>';
		}else if(typ == "Co_SkipperInfoProg"){
			icon = '<a href="#CO">'+'<i class="fa fa-user IconProg"></i>';
		}else if(typ == "ArriveToMarinaProg"){
			icon = '<a href="#AM">'+'<i class="fa fa-bus IconProg"></i>';
		}else if(typ == "EmergentcyProg"){
			icon = '<a href="#EM">'+'<i class="fa fa-ambulance IconProg"></i>';
		}
		return icon;
	}
	return {get:init};	
}());

var CircleProgOption = {
  color: '#656565',
  strokeWidth: 4,
  trailWidth: 6,
  easing: 'easeInOut',
  duration: 1400,
  text: {
    autoStyleContainer: false
  },
  from: { color: '#7799CC', width: 4 },
  to: { color: '#7799CC', width: 4 },
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('<div  class="ProgressTitle">'+
      IconProg.get(circle._container.id)+
      	'<i class="fa fa-stack-1x TextProg">'+
      		'0%'+
      	'</i>'+
      '</a>'+
      '</div>');
    } else {
      circle.setText('<div class="ProgressTitle">'+
      IconProg.get(circle._container.id)+
      	'<i class="fa fa-stack-1x TextProg">'+
      		value+'%'+
      	'</i>'+
      '</a>'+
      '</div>');
    }

  }
};

var NavOption = {
	
  color: '#656565',
  strokeWidth: 4,
  trailWidth: 0,
  easing: 'easeInOut',
  duration: 1400,
  text: {
    autoStyleContainer: false
  },
  from: { color: '#7799CC', width: 0 },
  to: { color: '#7799CC', width: 0 },
  step: function(state, circle) {
  	
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);
		var icon = fa_icon;
    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('0%');
    } else {
      circle.setText(value+'%');
    }

  }
};

var CommandProgressAPI = (function(){	
	var Queue = [];
	var Ajax = function(typ,prog){
		Queue.push({"typ":typ,"prog":prog});
		if(Queue.length == 1){
			DoAjax(typ,prog);	
		}
	};
	var Next = function(){
		var old = Queue[0];//old
      if(Delete()&& typeof Queue[0] != "undefined"){
       DoAjax(Queue[0].typ,Queue[0].prog);//Next
      } 
	};
	var Delete = function(){
		 Queue.shift();//Delete
     return true;
	};
	var DoAjax = function(typ,prog){	
		return $.ajax({
			url: '../API/CommandProgress.asp',
			type: 'POST',
			data:{
				"id_command":StatObj.CheckCommandLink.id_command,
				"SQL_TYP":StatObj.CheckCommandLink.SQL_TYP,
				"typ":typ,
				"prog":prog
			},
			dataType:'json',
			success:function(data){
				Next();
			}
		});
	};
	return {
		Ajax:Ajax
	}
}());

var CrewListProgress = new ProgressBar.Circle(CrewListProg,CircleProgOption);
		CrewListProgress.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
		CrewListProgress.text.style.fontSize = '2rem';
var CrewListNav = new ProgressBar.Circle(progessbarCW,NavOption);
		CrewListNav.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
		CrewListNav.text.style.fontSize = '1.5rem';		
var SkipperInfoProgress = new ProgressBar.Circle(SkipperInfoProg,CircleProgOption);
		SkipperInfoProgress.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
		SkipperInfoProgress.text.style.fontSize = '2rem';
var SkipperNav = new ProgressBar.Circle(progessbarSK,NavOption);
		SkipperNav.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
		SkipperNav.text.style.fontSize = '1.5rem';		
var Co_SkipperInfoProgress = new ProgressBar.Circle(Co_SkipperInfoProg,CircleProgOption);
		Co_SkipperInfoProgress.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
		Co_SkipperInfoProgress.text.style.fontSize = '2rem';
var CoSkipperNav = new ProgressBar.Circle(progessbarCO,NavOption);
		CoSkipperNav.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
		CoSkipperNav.text.style.fontSize = '1.5rem';	
var ArrToMariProgress = new ProgressBar.Circle(ArriveToMarinaProg,CircleProgOption);
		ArrToMariProgress.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
		ArrToMariProgress.text.style.fontSize = '2rem';
var ArrToMariNav = new ProgressBar.Circle(progessbarAM,NavOption);
		ArrToMariNav.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
		ArrToMariNav.text.style.fontSize = '1.5rem';	
var EmergentcyProgress = new ProgressBar.Circle(EmergentcyProg,CircleProgOption);
		EmergentcyProgress.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
		EmergentcyProgress.text.style.fontSize = '2rem';
var EmergentcyNav = new ProgressBar.Circle(progessbarEM,NavOption);
		EmergentcyNav.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
		EmergentcyNav.text.style.fontSize = '1.5rem';
var UploadProgress = new ProgressBar.Circle(UploadProg,CircleProgOption);
		UploadProgress.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
		UploadProgress.text.style.fontSize = '2rem';
	
function GetCrewListElement(){
	var AllEl = $('#PassForm');
	var CrewEl = $('div.row[pass!=new]',AllEl);
	var TotalInput = CrewEl.find('input').length;
	var AmountInputFilled = 0;
	var AmountOfBtnActive = $('label[name=Gender].active',CrewEl).length;
	var AmountAllOfBtn = $('label[name=Gender]',CrewEl).length;
			AmountAllOfBtn = AmountAllOfBtn/2;
	$.each(CrewEl.find('input'),function(index,El){
			if($(El).val() != ""){
				AmountInputFilled++;
			}
	});
	AmountInputFilled = AmountInputFilled + AmountOfBtnActive;
	TotalInput = TotalInput + AmountAllOfBtn;
	var Prog = CalFilledForms(AmountInputFilled,TotalInput).toFixed(2);
	var CurrentPercent = parseInt(Prog*100);
	CrewListProgress.animate(Prog,{},function(){
		var LastPercent = Progress.CW;
		if(CurrentPercent != LastPercent){
			CommandProgressAPI.Ajax("updCW",CurrentPercent);
		}
		CountTotal(CurrentPercent,'cw');
		if (CurrentPercent >= 50 && droits.catamaran_fleet && RefAccess == 'True') { //Nut add 05/06/2017
			console.log('CurrentPercent: ', CurrentPercent);
			UpdateClientFilled();
		}
	});
	CrewListNav.animate(CalFilledNav(AmountInputFilled,TotalInput));
}

function UpdateClientFilled() { //Nut add 05/06/2017
	return $.ajax({
		url: '../API/ListPassengers.asp',
		type: 'POST',
		data:{
			"id_command":StatObj.CheckCommandLink.id_command,
			"typ":'UpdateClientFilled',
			"SQL_TYP":StatObj.CheckCommandLink.SQL_TYP,
			"refcom":refcom,
			"id_client":id_client
		},
		dataType:'json',
		success:function(data){
			//
		}
	});
}

function GetSkipperElement(){
	ElSk = $('#SkipperInfo');
	GetInputSk = $("input[type=text]:not(hidden)",ElSk);
	GetRadioSk_196 = $("input[type=radio][name=fld_46][value=1]",ElSk);
	GetRadioSk_1 = $("input[type=radio][name=mySalutation_skipper][value=0]",ElSk);
	GetRadioSk_2 = $("input[type=radio][name=mylicence][value=yes]",ElSk);
	GetRadioSk_3 = $("input[type=radio][name=mysans_equipage][value=yes]",ElSk);
	GetRadioSk_4 = $("input[type=radio][name=myhave_boat][value=yes]",ElSk);
	GetTextareaSk = $(ElSk).find(':input:not(:text):not(:radio):not(:checkbox)[name!=myState_skipperOpe][name!=myState_skipper][name!=txtcs_skipper]');

	TotalSk = GetInputSk.length+GetRadioSk_196.length+GetTextareaSk.length+GetRadioSk_1.length+GetRadioSk_2.length+GetRadioSk_3.length+GetRadioSk_4.length;
	AmountFilledSk = 0;
	FilledRadio = $( "input[type=radio]:checked",ElSk );
	$.each(GetInputSk,function(index,El){
		if($(El).val() != ""){
			AmountFilledSk++;
		}
	});
	$.each(FilledRadio,function(index,El){
		if($(El).val() != ""){
			AmountFilledSk++;
		}
	});
	$.each(GetTextareaSk,function(index,El){
		if($(El).val() != ""){
			AmountFilledSk++;
		}
	});
	var Prog = CalFilledForms(AmountFilledSk,TotalSk).toFixed(2);
	var CurrentPercent = parseInt(Prog*100);
	SkipperInfoProgress.animate(Prog,{},function(){
		var LastPercent = Progress.SK;
		if(CurrentPercent != LastPercent){
			CommandProgressAPI.Ajax("updSK",CurrentPercent);	
		}
		CountTotal(CurrentPercent,'sk');
	});
	SkipperNav.animate(CalFilledNav(AmountFilledSk,TotalSk));
	
}

function GetCoSkipperElement(){
	ElCo = $('#Co-SkipperInfo');
	GetInputCo = $("input[type=text]:not(hidden)",ElCo);
	GetRadioCo_196 = $("input[type=radio][name=fld_46][value=1]",ElCo);
	GetTextareaCo = $(ElCo).find(':input:not(:text):not(:radio):not(:checkbox)[name!=myState_equipierOPE][name!=myState_equipier]');
	GetRadioCo_1 = $("input[type=radio][name=mySalutation_equipier][value=0]",ElCo);
	GetRadioCo_2 = $("input[type=radio][name=myhave_boat_equipier][value=yes]",ElCo);
	
	TotalCo = GetInputCo.length+GetRadioCo_196.length+GetTextareaCo.length+GetRadioCo_1.length+GetRadioCo_2.length;
	AmountFilledCo = 0;
	FilledRadio = $( "input[type=radio]:checked",ElCo );
	$.each(GetInputCo,function(index,El){
		if($(El).val() != ""){
			AmountFilledCo++;
		}
	});
	$.each(FilledRadio,function(index,El){
		if($(El).val() != ""){
			AmountFilledCo++;
		}
	});
	$.each(GetTextareaCo,function(index,El){
		if($(El).val() != ""){
			AmountFilledCo++;
		}
	});
	var Prog = CalFilledForms(AmountFilledCo,TotalCo).toFixed(2);
	var CurrentPercent = parseInt(Prog*100);
	Co_SkipperInfoProgress.animate(Prog,{},function(){
		var LastPercent = Progress.CO;
		if(CurrentPercent != LastPercent){
			CommandProgressAPI.Ajax("updCO",CurrentPercent);	
		}
		CountTotal(CurrentPercent,'co');
	});
	CoSkipperNav.animate(CalFilledNav(AmountFilledCo,TotalCo));
}

function GetArriveToMarinaElement(){
	var El = $('#ArrivalMarinaContain');
	GetInput = $("input[type=text]:not(:hidden)",El);
	VehicleCont = $('#VehicleContain',El);
	SpecilaArrivalToMarina1 = $('#SpecilaArrivalToMarina1',El);
	SpecilaArrivalToMarina2 = $('#SpecilaArrivalToMarina2',El);
	RegArrTra = $('#RegArrTra',El);
	comment = $('#comment',El);
	AmountFilled = 0;
	$.each(GetInput,function(index,El){
		if($(El).val() != ""){
			AmountFilled++;
		}
	});
	if($(VehicleCont).children("button.active").length == 1){AmountFilled++;};
	if($(SpecilaArrivalToMarina1).length == 1){AmountFilled++;}
	if($(SpecilaArrivalToMarina2).length == 1){AmountFilled++;}
	if($("button.active",RegArrTra).length == 1){AmountFilled++;}
	if(comment.val() != ""){AmountFilled++;}
	Total = GetInput.length+VehicleCont.length+SpecilaArrivalToMarina1.length+SpecilaArrivalToMarina2.length+RegArrTra.length+comment.length;
	var Prog = CalFilledForms(AmountFilled,Total).toFixed(2);
	var CurrentPercent = parseInt(Prog*100);
	ArrToMariProgress.animate(Prog,{},function(){
		var LastPercent = Progress.AM;
		if(CurrentPercent != LastPercent){
			CommandProgressAPI.Ajax("updAM",CurrentPercent);	
		}
		CountTotal(CurrentPercent,'am');
	});
	ArrToMariNav.animate(CalFilledNav(AmountFilled,Total));
}

function GetEmergentcyElement(){
	ElEmergent = $('#EmergencyContain');
	GetInputEmergent = $("input[type=text]",ElEmergent);
	TotalEmergent = GetInputEmergent.length;
	AmountFilledEmergent = 0;
	$.each(GetInputEmergent,function(index,El){
		if($(El).val() != ""){
			AmountFilledEmergent++;
		}
	});
	var Prog = CalFilledForms(AmountFilledEmergent,TotalEmergent).toFixed(2);
	var CurrentPercent = parseInt(Prog*100);
	EmergentcyProgress.animate(Prog,{},function(){
		var LastPercent = Progress.EM;
		if(CurrentPercent != LastPercent){
			CommandProgressAPI.Ajax("updEM",CurrentPercent);	
		}
		CountTotal(CurrentPercent,'em');
	});
	EmergentcyNav.animate(CalFilledNav(AmountFilledEmergent,TotalEmergent));
}

function CalFilledForms(amount,total){
		var AmountInTotal = (amount/total);
		if(isNaN(AmountInTotal)){
			AmountInTotal = 0;
		}
		return AmountInTotal;
}

function CalFilledNav(amount,total){
		var AmountInTotal = (amount/total);
		if(isNaN(AmountInTotal)){
			AmountInTotal = 0;
		}
		return AmountInTotal;
}

var KeyTap;
function OpenTapByLink(key){
    $('html, body').animate({
     	scrollTop: $("#myTab li a[href="+key+"]").offset().top-100
    }, 1000);
		KeyTap = key;
		$("#myTab li a[href="+key+"]").click();
}

var KeyTapa;
function OpenTapByLinkA(key){
    $('html, body').animate({
     	scrollTop: $("#myTab li a[href="+key+"]").offset().top-50
    }, 1000);
		KeyTapa = key;
		$("#myTab li a[href="+key+"]").click();
}
// #### END Ham ####

// #### Export PDF Button
	function CountTotal(val,from){
		switch(from){
	    case "cw": cw_total = val; break;
	    case "sk": sk_total = val; break;
	    case "co": co_total = val; break;
	    case "am": am_total = val; break;
	    case "em": em_total = val; break;
		}
		if (droits.catamaran_fleet) {
			if(droits.affich_coskipper){
				sum_total = cw_total+em_total+sk_total+co_total;
				sum_count = sum_total/4;
			}else{
				sum_total = cw_total+em_total+sk_total;
				sum_count = sum_total/3;
			}
		} else {
			if(droits.affich_coskipper){
				sum_total = cw_total+am_total+em_total+sk_total+co_total;
				sum_count = sum_total/5;
			}else{
				sum_total = cw_total+am_total+em_total+sk_total;
				sum_count = sum_total/4;
			}
		}
		
		if(sum_count > 50 || 1==1){
			$('#exp_pdf').removeClass("disabled").attr("data-original-title",row.lg_exportpdf_off);
			window.clickstt = true;
		}else{
			$('#exp_pdf').addClass("disabled").attr("data-original-title",row.lg_exportpdf_on);
			window.clickstt = false;
		}
	}
	
// #### Status Update ####
var StatUpdate = (function(){
	var options = function(obj){
		var typ = obj.typ
		$(obj.el).parent().find('.StatUpdate').remove()
		init($(obj.el),typ)
	}
	var init = function(ThisEl,typ){
		typ === "success" ? success(ThisEl) : typ === "error" ? error(ThisEl) : typ === "inprogress" ? inprogress(ThisEl) : false;
	}
	var success = function(ThisEl){
		var SpcialClass = ThisEl[0].type === "textarea" ? "textarea-success" : "iconDone"
		var icon = $('<i class="fa '+SpcialClass+' iconDone StatUpdate"></i>')
		ThisEl.css({"border-color":"rgb(117, 189, 0)","padding-right":"2em"}).after(icon)
		setTimeout(function(){
			icon.remove()
			ThisEl.css({"padding-right":"0em"})
		 }, 2500);
	}
	var error = function(ThisEl){
		var SpcialClass = ThisEl[0].type === "textarea" ? "textarea-error" : "iconFail"
		var icon = $('<i class="fa '+SpcialClass+' iconFail StatUpdate"></i>')
		ThisEl.css({"border-color":"#a94442","padding-right":"2em"}).after(icon)
		setTimeout(function(){
			icon.remove()
			ThisEl.css({"padding-right":"0em"})
		 }, 2500);
	}
	var inprogress = function(ThisEl){
		var SpcialClass = ThisEl[0].type === "textarea" ? "textarea-wait" : "iconWait"
		var icon = $('<i class="fa '+SpcialClass+' fa-spin StatUpdate"></i>')
		ThisEl.css({"border-color":"bule","padding-right":"2em"}).after(icon)
	}
	return {options:options}
})()