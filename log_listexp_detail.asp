<%
	if Request("lg")&"a" <> "a" then
		session("lang") = Request("lg")
	end if
%>
<!-- #include file="../style/AVEImgClass.asp"-->
<!-- #include file="../search/connect.asp"-->
<!-- #include file="../site/lang.asp" -->
<!-- #include file="../style/Functions.asp" -->
<!-- #include file="../style/class.json.asp" -->
<!-- #include file="../style/class.json.util.asp" -->
<%
	call updateDictionary()
	id_command = Request("id_command")
	typ_command = Request("typ_command")
	if ss_auto&"a"="a" and Request("r")&"a"="a" then
		response.end
	end if
	RefAccess = False
	RefId = noNull(array(request("r"),""))
	if (RefId&"a"<>"a" or id_command&"a"<>"a") and instr("[][0][1]","["&ss_auto&"]")>0 then
		RefAccess = True
	end if
	if RefAccess and RefId&"a"="a" then
		
	end if
	CW = LeDico("list")
	SK = LeDico("SkipperInfo")
	BH = LeDico("lg_cvskipper_01")
	AD = LeDico("AdditionnalInformation")
	CO = LeDico("CoskipperInfo")
	AM = LeDico("lg_arrivaltotheboat")
	EM = LeDico("lg_bi_comm_e")
	UP = LeDico("lg_upload")
	emp = Ledico("lg_empty_folder")
	date_today = fd(date(),session("lang"),1)
	liste_stat = liste_state()
	liste_country = liste_pays()
	txt_upload = array(LeDico("lg_upload_btn"),3,"bootstrap")
	txt_import_files = array(LeDico("lg_upload_import"),0,"bootstrap")
	id = Request.QueryString("id")
			Set JsState = jsArray()
			for inc=0 to ubound(liste_stat)
				zestat = split(liste_stat(inc),"¤")
				Set JsState(null) = jsObject()
						JsState(null)("names") = replace(zestat(0),chr(39),"[chr39]")
						JsState(null)("code") = zestat(1)
			next
			Set JsCountry = jsArray()
			for inc=0 to ubound(liste_country)
				zecountry = liste_country(inc)
				Set JsCountry(null) = jsObject()
						JsCountry(null)("names") = replace(zecountry,chr(39),"[chr39]")
			next
			
	Dim jLeDico
		Set jLeDico = jsObject()
		arrjLeDico = array("lg_upload")
		for inc=0 to ubound(arrjLeDico)
		 if dictionnaire.exists(arrjLeDico(inc)) then
		  ZeWord = LeDico(arrjLeDico(inc))
		  if arrjLeDico(inc)="lg_avezvousactualisersnd" then
		   ZeWord = replace(LeDico(arrjLeDico(inc)),"\n"," ")
		  end if
		  jLeDico(arrjLeDico(inc)) = ZeWord
		 end if
		next
		
	'##### START LINK DOCUMENT FOR CLIENT #####
	lnk = "https://client.sednasystem.com/doc.asp"
	if dev_local then lnk = sdna_local&"doc.asp"
'	if typ_command="agt" then 
'		direct_lnk = lnk & "?idc=A"
'	else
'		direct_lnk = lnk & "?idc=O"
'	end if
	direct_lnk = lnk
	'##### END LINK DOCUMENT FOR CLIENT #####
	
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Crew List / Skipper</title>
  <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <%
	  call initJquerySednaicons( array() )
	  call initJquery( array("","","072014") )
	  call initJqueryUi( array("","","","072014") )
	  call initBootstrap( array("072015","","home") )
  %>
    
	<link rel="stylesheet" href="../style/plugin/sdn-upload/sdn-upload.css">
	<link rel="stylesheet" href="../style/plugin/bootstrap-switch/bootstrap-switch.min.css">
  <script type="text/javascript" src="../style/plugin/bootstrap-switch/bootstrap-switch.min.js"></script>
  <script type="text/javascript" src="../style/plugin/progressbar/progressbar.js"></script>
  <script type="text/javascript"  src="../Style/plugin/pace/js/pace.min.js"></script>
  <link href="../Style/plugin/pace/css/pace.css" rel="stylesheet" type="text/css"/>
  <link rel="stylesheet" href="css/log_listexp_detail.css">
  
  <script type="text/javascript" src="../style/plugin/moment/js/moment.min.js"></script>
	<link rel="stylesheet" href="../style/plugin/daterangepicker/css/daterangepicker.min.css">
  <script type="text/javascript" src="../style/plugin/daterangepicker/js/daterangepicker.min.js"></script>
  
  <script>	
  	var LeDico = <%jLeDico.Flush%>;
	</script>
  <script src="../style/plugin/sdn-upload/sdn-upload.js"></script>
  <script>
 	var date_today = '<%=date_today%>';
  var ss_lang = '<%=session("lang")%>';
  var RefId = '<%=RefId%>';
  var direct_lnk = '<%=direct_lnk%>';
  var crew_info1 = '<%=errbox2(array(LeDico("lg_paste_import"),3,"bootstrap"))%>';
  var crew_info2 = '<%=errbox2(array("Sorry, we can not match your import. Click <i class=""fa fa-arrow-circle-left""></i> Back and check the import again",2,"bootstrap"))%>';
  var send_request = '<%=errbox2(array(LeDico("lg_send_request"),3,"bootstrap"))%>';
  var Clipbord = '<%=errbox2(array("The link has been copied to <i class=""fa fa-clipboard""></i> clipboard.",3,"bootstrap"))%>';
  
  var Confirm_email = '<%=errbox2(array(LeDico("lg_Confirm_email"),3,"bootstrap"))%>';
  var Update_Access_sending = '<%=errbox2(array(LeDico("lg_Update_Access_sending"),3,"bootstrap"))%>';
  var Update_Access_success = '<%=errbox2(array(LeDico("lg_Update_Access_success"),0,"bootstrap"))%>';
  var Update_Access_error = '<%=errbox2(array(LeDico("lg_Update_Access_error"),2,"bootstrap"))%>';
  var Update_Access_Email_sending = '<%=errbox2(array(LeDico("lg_Update_Access_Email_sending"),3,"bootstrap"))%>';
  var Update_Access_Email_success = '<%=errbox2(array(LeDico("lg_Update_Access_Email_success"),0,"bootstrap"))%>';
  var Update_Access_Email_error = '<%=errbox2(array(LeDico("lg_Update_Access_Email_error"),2,"bootstrap"))%>';
  var lg_HeadModal_Confirm_Email_Access = '<%=LeDico("lg_HeadModal_Confirm_Email_Access")%>';
  var lg_retry = '<%=LeDico("lg_retry")%>';
	var delete_pass = '<%=LeDico("lg_delete_pass")%>';
	var ledico_yes = '<%=LeDico("Yes")%>';
	var ledico_no = '<%=LeDico("No")%>';
	var delete_all = '<%=LeDico("lg_delete_all")%>';
	var lg_close = '<%=LeDico("lg_no")%>';
  var SQL_TYP, id_command, id_ope_com, id_agt_com, id_expNautic, id_client, id_commandAGT, dir, path, refcom, cw_total, sk_total, co_total, bh_total, am_total, em_total;
 	var Salutation_skipper_01 = '<%=verifliste(" A619, A7, A9, A103, A2326,",ss_styl)%>';
	var Salutation_skipper_02 = '<%=verifliste(" O192, O356, O479, O567,",ss_styl)%>';
	var Salutation_equipier_01 = '<%=verifliste(" A619, A7, A9, A103,",ss_styl)%>';
	var Salutation_equipier_02 = '<%=verifliste(" O192, O479, O567,",ss_styl)%>';
	var Boating_history_01 = '<%=verifliste(" O262, O2,",ss_styl)%>';
	var Boating_history_02 = '';
	var Boating_history_03 = '<%=verifliste(" O332,",ss_styl)%>';
	var Boating_history_04 = '';
	var Boating_history_05 = '<%=verifliste(" O192, O479, O567,",ss_styl)%>';
	var Boating_history_06 = '';
	var Boating_history_07 = '<%=verifListe(" O192,",ss_styl)%>';
	var fa_icon = '';
	var ss_id_cli = '<%=ss_id_cli%>';
	var State = '<%JsState.Flush%>';
	var Country = '<%JsCountry.Flush%>';
	var dev_local = '<%=dev_local%>';
	var id_command = '<%=id_command%>';
	var tab_id = '';
	var typ_command = '<%=typ_command%>';
	var ss_auto = "<%=ss_auto%>";
	var txt_import = '<%=errbox2(txt_import_files)%>';
	var lg_gender = '<%=LeDico("lg_gender")%>'
	var CW = "<%=CW%>";
	var SK = "<%=SK%>";
	var AD = "<%=AD%>";
	var BH = "<%=BH%>";
	var CO = "<%=CO%>";
	var AM = "<%=AM%>";
	var EM = "<%=EM%>";
	var UP = "<%=UP%>";
	var empty = "<%=emp%>";
	var confirm_delete = "<%=LeDico("lg_DoYouWantToDelete")%>";
	var delete_btn = "<%=LeDico("Delete")%>";
	var close_btn = "<%=LeDico("lg_close")%>";
	var RefAccess = "<%=RefAccess%>";
	var policy_massage_ope = "<%=LeDico("lg_visibleuniquement_tooltip")%>";
	var policy_massage_agt = "<%=LeDico("lg_visibleuniquementagt_tooltip")%>";
	$(document).ready(function(){
		BigBang();
		// Stay on same tab when refresh page //
			$('#myTab a').click(function(e) {
		  	e.preventDefault();
			  $(this).tab('show');
			});
			
			// store the currently selected tab in the hash value //
			$("ul.nav-tabs > li > a").on("shown.bs.tab", function(e) {
			  var id = $(e.target).attr("href").substr(1);
				if(id=='SK'){// Change Heading Panel
			  	$('#heading').html('<i class="fa fa-user"></i> '+SK);
			  	$('#mark-skipper').show();
				}else if(id=='BH'){
					if(ss_auto==2){
						$('#heading').html('<i class="fa fa-bullhorn"></i> '+AD);
					}else{
						$('#heading').html('<i class="fa fa-bullhorn"></i> '+BH);
					}
					$('#mark-skipper').show();
				}else if(id=='CO'){
					$('#heading').html('<i class="fa fa-user"></i> '+CO);
					$('#mark-skipper').show();
				}else if(id=='UP'){
					$('#heading').html('<i class="fa fa-upload"></i> '+UP);
					$('#mark-skipper').show();
				}else if(id=='CW'){
					$('#heading').html('<i class="fa fa-th-list"></i> '+CW);
					$('#mark-skipper').hide();
				}else if(id=='AM'){
					$('#heading').html('<i class="fa fa-bus"></i> '+AM);
					$('#mark-skipper').hide();
				}else if(id=='EM'){
					$('#heading').html('<i class="fa fa-ambulance"></i> '+EM);
					$('#mark-skipper').hide();
				}
				tab_id = id;
				if(tab_id=='CW'){	$('#progessbarSK,#progessbarCO,#progessbarAM,#progessbarEM').hide(); $('#progessbarCW').show(); fa_icon = 'fa-th-list'; $('#icon-nav').html('<i class="fa '+fa_icon+' fa-2x"></i>'); }//GetCrewListElement(); }
				else if(tab_id=='SK'){ $('#progessbarCW,#progessbarCO,#progessbarAM,#progessbarEM').hide(); $('#progessbarSK').show(); fa_icon = 'fa-user'; $('#icon-nav').html('<i class="fa '+fa_icon+' fa-2x"></i>'); }//GetSkipperElement(); }
  			else if(tab_id=='CO'){ $('#progessbarCW,#progessbarSK,#progessbarAM,#progessbarEM').hide(); $('#progessbarCO').show(); fa_icon = 'fa-user'; $('#icon-nav').html('<i class="fa '+fa_icon+' fa-2x"></i>'); }//GetCoSkipperElement(); }
  			else if(tab_id=='AM'){ $('#progessbarCW,#progessbarSK,#progessbarCO,#progessbarEM').hide(); $('#progessbarAM').show(); fa_icon = 'fa-bus'; $('#icon-nav').html('<i class="fa '+fa_icon+' fa-2x"></i>'); }//GetArriveToMarinaElement(); }
  			else if(tab_id=='EM'){ $('#progessbarCW,#progessbarSK,#progessbarAM,#progessbarCO').hide(); $('#progessbarEM').show(); fa_icon = 'fa-ambulance'; $('#icon-nav').html('<i class="fa '+fa_icon+' fa-2x"></i>'); }//GetEmergentcyElement(); }
  			else{ $('#progessbarCW,#progessbarSK,#progessbarCO,#progessbarAM,#progessbarEM').hide(); $('#icon-nav').empty();}
			  window.location.hash = id;
			  OpenTapByLinkA("#"+id);
				//window.scrollTo(0, 0);// Stay On the top of page
			});
			
			// on load of the page: switch to the currently selected tab //
			var hash = window.location.hash;
			if(!hash){
				hash = '#CW';
				$('#myTab a[href="' + hash + '"]').tab('show');
			}else{
				$('#myTab a[href="' + hash + '"]').tab('show');
			}
			
		  /* #### STAT Ham ####*/
			$('#PassForm').on({//Ham Fixed 14/06/2017
				"keyup":function(ev){
					var ThisEl = $(this);
					if(ev.keyCode == 8 || ev.keyCode == 46 && ev.keyCode != 86){//When press SPACE and DELETE button and 86 Check for V
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
								QueueUpdateListPass.add(id_command,$(ThisEl));
							}
			    	},300);
		    	}else{
						var NotAlowNewEmpty = ($(ThisEl).val().replace(/\s+/g, '') != "" && $(ThisEl).data("KeepValue") != $(ThisEl).val());
						if(NotAlowNewEmpty){
							delay(function(){//When stop typing and wait then save.
								if(ev.keyCode != 17){//Check for CTRL
									StatUpdate.options({
										el:ThisEl,
										typ:"inprogress"
									})
									QueueUpdateListPass.add(id_command,$(ThisEl));
								}
							},700);
						}
					}
				},
				"change":function(){
					var ThisEl = $(this);
					var NotAlowNewEmpty = ($(ThisEl).val().replace(/\s+/g, '') != "" && $(ThisEl).data("KeepValue") != $(ThisEl).val() );
					if(NotAlowNewEmpty ){
						StatUpdate.options({
							el:ThisEl,
							typ:"inprogress"
						})
						QueueUpdateListPass.add(id_command,$(ThisEl));
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
							QueueUpdateListPass.add(id_command,$(ThisEl));
						}
					}
					}, 200 );
				}
			},'.pass');
			
			$('#PassForm').on({
				"focus":function(){
					var ThisElFocus = $(this);
							$(ThisElFocus).unbind();
					SetloopCheck = setInterval(function(){
					var NotAlowNewEmpty = ($(ThisElFocus).val().replace(/\s+/g, '') == "" && $(ThisElFocus).parents("div.row[listpass]").attr("pass") == "new");
						if(!NotAlowNewEmpty  && $(ThisElFocus).val() != $(ThisElFocus).data("KeepValue") && typeof $(ThisElFocus).data("KeepValue") != "undefined"){
							delay(function(){//When stop typing and wait then save.
								clearInterval(SetloopCheck);
								StatUpdate.options({
									el:ThisElFocus,
									typ:"inprogress"
								})
								QueueUpdateListPass.add(id_command,$(ThisElFocus));
    					}, 100 );
						}
					}, 800);
				},
				"focusout":function(){
					clearInterval(SetloopCheck);
				}
			},'input[name="Email"]');

			$('#PassForm').on({
				"click":function(){
					var BtnDelete = OpenDeleteModal();
					var Dellist = $(this).parents("div.row[listpass]").attr("pass");
					$(BtnDelete).click(function(){
						DeleteListPass(Dellist);
					});
				}
			},'.delBtn');

			$('#PassForm').on({
				"click":function(){
					var ThisEl = $(this);
					var Parents = $(ThisEl).parents('.btn-group');
					if($(this).val() != $(Parents).find("label.active").val()){
						StatUpdate.options({
							el:ThisEl,
							typ:"inprogress"
						})
						QueueUpdateListPass.add(id_command,$(ThisEl));
					}
					
			}},'.Gender');
			
			$('#PassForm').on({
				"click":function(){
					CopyAndPastePass($(this));
			}},'.copyBtn');
			
			$('#ImportPass').click(function(){
				ImportPass();
			});
			
			$('#ImportExcel').click(function(){
				ImportExcel.Call();
			});
			
			//Nut add 08/06/2017
			$('#PassForm').on({
				"click":function(){
					var ThisEl = $(this);
					QueueUpdateListPass.add(id_command,$(ThisEl));
			}},'.chck196');;
			//End Nut
			
			$('body').on('click','#ImportSK, #ImportBH, #ImportCO',function(){
				ImportSkipper("0");
			});
			
			$('body').on('click','#ImportSK_196',function(){
				ImportSkipper_196("0");
			});
			
			$('body').on('click','#ImportCO_196',function(){
				ImportSkipper_196("1");
			});
			
			$('#PassHead, #taptool').on({
				"click"	:function(){
					var CloseBtn = $('<button type="button" data-dismiss="modal" class="btn btn-primary" style="margin-bottom: 0px;"><i class="fa fa-times"></i> '+lg_close+'</button>');
					var OkBtn = $('<button type="button" data-dismiss="modal" class="btn btn-primary"><i class="fa fa-trash"></i> '+delete_all+'</button>');
					var Modal = BootstrapModal();
							Modal.dialog.css({"min-width":"30%","max-width":"80%"});
							Modal.header.append('<button type="button" class="close" data-dismiss="modal"><i class="fa fa-times"></button></i><i class="fa fa fa-trash-o fa-lg"></i> '+delete_pass+'</button>');
							Modal.body.append('<div class="alert alert-danger" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span> '+confirm_delete+'</div>');
							Modal.footer.append(CloseBtn,OkBtn);
							Modal.do();
							$(OkBtn).click(function(){
								DeleteAllPass();
							});
					
			}},'.DeleteAll');		
			
			$('#CopyClipBoard').click(function(){
				copyToClipboard($('input[name=DirectLink]').val());
				var Modal = BootstrapModal();
						//Modal.main.modal({backdrop:0});
						Modal.main.addClass("modal fade");
						Modal.dialog.addClass("modal-sm");
						Modal.body.html(Clipbord);
						Modal.header.html('<i class="fa fa-clipboard"></i>  Copy the link');
						setTimeout(function(){ Modal.do(); }, 100);
						setTimeout(function(){ Modal.main.modal("hide"); }, 1500);
			});
			KeyTap = $("#myTab li.active a").attr("href");
			
			$("#ProgressCont").on({
				click:function(){
				OpenTapByLink($(this).attr("href"))
			}},".ProgressTitle a");
			
			$("#SendByEmail").click(function(){
				SendRequest.init("sendLink");
			});
			/* #### END Ham ####*/
			
			//Nut add 01/06/2017
			$('#PassForm').on({
				"change":function(){
					var ThisEl = $(this);
					StatUpdate.options({
						el:ThisEl,
						typ:"inprogress"
					})
					QueueUpdateListPass.add(id_command,$(ThisEl));
					
			}},'.typeCrew');
			//End Nut
	});
	
</script>
  <style>
  .iconDone:before{
		content: "\f058";
	}
	.iconDone{
		animation-name: floating;
		-webkit-animation-name: floating;
		animation-iteration-count: infinite;
		-webkit-animation-iteration-count: infinite;
		animation-timing-function: linear;
		-webkit-animation-timing-function: linear;
		animation-duration: 3s;
		font-size:20px;
		position:absolute;
		z-index:999;
		color:rgb(117, 189, 0);
    right: 3px;
    top:2px;
	}
	@keyframes floating {
		100% {
			opacity: 0;
		}
		90% {
			opacity: 0;
		}
		50% {
			opacity: 0;
		}
		0% {
			opacity: 1;
		}			
	}
	 .iconWait:before{
		content: "\f1ce";
	}
	.iconWait{
		font-size:18px;
		position:absolute;
		z-index:999;
		color:#31708f;
    right: 3px;
    top:3px;
	}
	.iconFail:before{
		content: "\f00d";
	}
	.iconFail{
		animation-name: floating;
		-webkit-animation-name: floating;
		animation-iteration-count: infinite;
		-webkit-animation-iteration-count: infinite;
		animation-timing-function: linear;
		-webkit-animation-timing-function: linear;
		animation-duration: 3s;
		font-size:18px;
		position:absolute;
		z-index:999;
		color:#a94442;
    right: 3px;
    top:3px;
	}
	
	.textarea-success{
		color:#31708f;
		float: right;
		padding: 5px;
		top: -108px;
    position: relative;
	}
	.textarea-success:before{
		content: "\f058";
	}
	.textarea-success:after{
		position:absolute;
    z-index:9999;
    right: 3px;
    bottom: 6px;
	}
	
	.textarea-wait{
		color:#31708f;
		float: right;
		padding: 5px;
		top: -108px;
    position: relative;
	}
	.textarea-wait:before{
		content: "\f1ce";
	}
	.textarea-wait:after{
		position:absolute;
    z-index:9999;
    right: 3px;
    bottom: 6px;
	}
	
	.textarea-error{
		color:#a94442;
		float: right;
		padding: 5px;
		top: -108px;
    position: relative;
	}
	.textarea-error:before{
		content: "\f00d";
	}
	.textarea-error:after{
		position:absolute;
    z-index:9999;
    right: 3px;
    bottom: 6px;
	}
	
  </style>
</head>
<body>
	<nav class="navbar navbar-default navbar-fixed-top" role="navigation">
      <div class="container">
      	<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding-left:0px;padding-right:0px;">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          
          <a class="navbar-brand hidden-sm hidden-md hidden-lg" href="../HomePage"><img src="../themes/default/images/logo_home.jpg"></a>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="navbar-collapse" id="navbar">
          <ul id="navbar-menu-tab" class="nav navbar-nav in">      
          	<li class="active" id="" idt="0" data-toggle="tooltip" data-placement="bottom" style="display:none;"></li>
             <li class="disabled" id="exp_pdf" idt="1" data-toggle="tooltip" data-placement="bottom">
             	<a>
             		<i class="fa fa-file-pdf-o" aria-hidden="true"></i> <%=LeDico("lg_exportpdf")%>
             	</a>
             </li> 	
          </ul>
          <ul class="nav navbar-nav navbar-right">
          	<li >
          		<div id="icon-nav" style="display:none;margin-top: 2px"></div>
          	</li>
          	<li id="prog-nav" style="display:none;width: 35px;margin-top: 10px;text-align: right;">
          		<div class="plate" style="margin-left: auto;margin-right:15px">
								<div class="CircleProg">
									<div id="progessbarCW" style="height:10px"></div>
									<div id="progessbarSK" style="height:10px"></div>
									<div id="progessbarCO" style="height:10px"></div>
									<div id="progessbarAM" style="height:10px"></div>
									<div id="progessbarEM" style="height:10px"></div>
								</div>
							</div>
          	</li>
          	<li>
	          		<div id="Message" class="col-lg-12 col-md-12"></div>
          	</li>
            <li><a class="for_stour" role="button" page="" href="#"><i class="fa fa-info-circle"></i> [Quick Tour]</a></li>
          </ul>
        </div><!-- /.navbar-collapse -->
        </div>
      </div><!-- /.container -->
  </nav>
  
	<div class="container"  style="margin-top:25px;">
		<div id="DocCont" class="row" style="display: none;">
			<!-- START Lang -->
			<div class="row" id="seelang" style="margin-top: 20px;"> <!--style="display:none;"-->
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<div id="btnlang" class="pull-right"></div>
				</div>
			</div>
			<!-- END Lang -->
			<!-- START COMMERCIAL CONTACT -->
			<div class="row" id="DocInfo" style="display:none;">
				<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
						<div class="panel panel-primary">
							<div class="panel-heading">
									<i class="fa fa-phone"></i> <%=LeDico("lg_cntacComm")%>
								</div>
								<div class="panel-body" class="container">
									<div id="CommercalComtact">
										
									</div>
								</div>
							</div>
					</div>
			<!-- END COMMERCIAL CONTACT -->
			
			<!-- START YOUR CHARTER -->
				<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
					<div class="panel panel-primary">
						
						<div class="panel-heading">
								<span data-toggle="tooltip" data-placement="bottom" title="" data-original-title="<%=LeDico("lg_chartercode")%>">
									<i class="fa fa-hashtag"></i> <span id="comm-boat"></span>
								</span>
						</div>
						
						<div class="panel-body" class="container">
							<div id="YourCharter">
								<div class="row" id="btnNumber1">
									<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12"  data-toggle="tooltip" data-placement="bottom" title="" data-original-title="<%=LeDico("BoatType")%>">
										<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
											<span id="icon-boat">-</span>
										</div>
										<div class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
											<span id="model-boat">-</span>
										</div>
									</div>
									<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12"  data-toggle="tooltip" data-placement="bottom" title="" data-original-title="<%=LeDico("lg_BoatSize")%>">
										<div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
											<i class="sdn sdn-boat-width"></i>
										</div>
										<div class="col-lg-7 col-md-7 col-sm-7 col-xs-7">
											<span id="width-boat">-</span>
										</div>
									</div>
								</div>
								
								<div class="row" id="btnNumber2">
									<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
										<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" style="height: 45px;line-height: 65px;text-align: center;border-right: rgba(0,0,0,.13) 1px solid;">
											<i class="fa fa-map-marker"></i>
										</div>
										<div class="col-lg-9 col-md-9 col-sm-9 col-xs-9" style="line-height: 24px;">
											<span id="port-in" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="<%=LeDico("lg_portin")%>" >-</span>
												<br>
											<span id="port-out" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="<%=LeDico("lg_portout")%>" >-</span>
										</div>
									</div>
									
									<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
										<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" style="height: 45px;line-height: 65px;text-align: center;border-right: rgba(0,0,0,.13) 1px solid;">
											<i class="fa fa-calendar"></i>
										</div>
										<div class="col-lg-9 col-md-9 col-sm-9 col-xs-9" style="line-height: 24px;">
											<span id="DateStart" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="<%=LeDico("lg_startdate")%>" >-</span>
												<br>
											<span id="DateEnd" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="<%=LeDico("lg_enddate")%>" >-</span>
										</div>
									</div>
								</div>
								
								<div class="row" id="btnNumber3">
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<div class="btn-group btn-group-justified" role="group" aria-label="...">
										  <div class="btn-group" role="group">
										    <button type="button" class="btn btn-default btn-docinfo" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="<%=LeDico("lg_numberofcabins")%>">
										    	<div class="icon-btn col-lg-4 col-md-4 col-sm-12 col-xs-12">
										    		<i class="sdn sdn-boat-cabin-double"></i>
										    	</div>
										    	<div class="number-boat col-lg-8 col-md-8 col-sm-12 col-xs-12">
										    		<span id="bed-boat">-</span>
										    	</div>
										    </button>
										  </div>
										  <div class="btn-group" role="group">
										    <button type="button" class="btn btn-default btn-docinfo" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="<%=LeDico("lg_numberoftoilet")%>">
										    	<div class="icon-btn col-lg-4 col-md-4 col-sm-12 col-xs-12">
										    		<i class="ssdn sdn-boat-head"></i>
										    	</div>
										    	<div class="number-boat col-lg-8 col-md-8 col-sm-12 col-xs-12">
										    		<span id="heads-boat">-</span>
										    	</div>	
										    </button>
										  </div>
										  <div class="btn-group" role="group">
										    <button type="button" class="btn btn-default btn-docinfo" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="<%=LeDico("lg_paxmaxpla")%>">
										    		<div class="icon-btn col-lg-4 col-md-4 col-sm-12 col-xs-12">
										    		<i class="sdn sdn-boat-paxmax"></i>
										    	</div>
										    	<div class="number-boat col-lg-8 col-md-8 col-sm-12 col-xs-12">
										    		<span id="pax-boat">-</span>
										    	</div>	
										    </button>
										  </div>
										  <div class="btn-group" role="group">
										    <button type="button" class="btn btn-default btn-docinfo" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="<%=LeDico("lg_Buildyear")%>">
										    		<div class="icon-btn col-lg-4 col-md-4 col-sm-12 col-xs-12">
										    		<i class="sdn sdn-boat-year"></i>
										    	</div>
										    	<div class="number-boat col-lg-8 col-md-8 col-sm-12 col-xs-12">
										    		<span id="year-boat">-</span>
										    	</div>	
										    </button>
										  </div>
										</div>
									</div>
								</div>
							</div>
						</div>
						
					</div>
				</div>
			</div>
		
			<!-- END YOUR CHARTER -->
			
			<!-- START ACCESS DOCUMENT -->
			 <div class="row" id="AccessDocument" style="display:none;">
					<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
						<div class="panel panel-primary">
							<div class="panel-heading">
									<i class="fa fa-eye" aria-hidden="true"></i> <%=LeDico("lg_doc_acc")%>
								</div>
								<div class="panel-body" class="container">
									<div id="DocumentAccess">
										
										<div class="row">
											<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"><%=LeDico("lg_document")%></div>
											<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"><%=LeDico("lg_filledbyclient")%></div>
											<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" id="accessText"><%=LeDico("lg_OpeAccess")%></div>
										</div>
										<div class="row">
											<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"><button type="button" class="btn"><%=LeDico("lg_listeequipage")%></button></div>
											<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"><input type="checkbox" name="FilledPS"></div>
											<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"><input type="checkbox" name="PS"></div>
										</div>
										<div class="row">
											<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"><button type="button" class="btn"><%=LeDico("infskip")%></button></div>
											<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"><input type="checkbox" name="FilledSK"></div>
											<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"><input type="checkbox" name="SK"></div>
										</div>
										
									</div>
								</div>
							</div>
					</div>
					
					<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
						<div class="panel panel-primary">
							<div class="panel-heading">
								<i class="fa fa-link" aria-hidden="true"></i> <%=LeDico("lg_send_link")%>
							</div>
							<div class="panel-body" class="container">
								<div id="LinkAccess">
									<div class="input-group" style="width: 100%; margin-top: 5px; margin-bottom: 9px;">
										<div class="input-group-addon">
											<i class="fa fa-link" aria-hidden="true"></i> <%=LeDico("lg_Link")%>
										</div>
										<input class="form-control" type="text" name="DirectLink" onClick="this.select();" readonly>
									</div>
									<div class="row">
										<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
											<span class="btn btn-primary pull-right" id="CopyClipBoard"><i class="fa fa-clipboard"></i> <%=LeDico("lg_copy_link")%></span>
										</div>
										<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
											<span class="btn btn-primary" id="SendByEmail"><i class="fa fa-envelope"></i> <%=LeDico("lg_send_by_mail")%></span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
			 </div>
		<!-- END ACCESS DOCUMENT -->
		<div class="row">
				<div class="panel panel-primary">
					<div class="panel-heading">
						<i class="fa fa-tasks" aria-hidden="true"></i> <%=LeDico("lg_doc_prog")%> 
					</div>
					<div class="panel-body">
						<div id="ProgressCont">
							<div class="plate" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="<%=LeDico("list")%>">
								<div class="CircleProg">
									<div id="CrewListProg"></div>	
								</div>
								<div class="ProgressTitle"></div>
							</div>
							<div class="plate" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="<%=LeDico("SkipperInfo")%>">
								<div class="CircleProg">
									<div id="SkipperInfoProg"></div>	
								</div>
								<div class="ProgressTitle"></div>
							</div>
							<div class="plate" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="<%=LeDico("CoskipperInfo")%>">
								<div class="CircleProg">
									<div id="Co_SkipperInfoProg"></div>	
								</div>
								<div class="ProgressTitle"></div>
							</div>
							<div class="plate" data-toggle="tooltip" id="Main-ArriveToMarina" data-placement="bottom" title="" data-original-title="<%=LeDico("lg_arrivaltotheboat")%>">
								<div class="CircleProg">
									<div id="ArriveToMarinaProg"></div>	
								</div>
								<div class="ProgressTitle"></div>
							</div>
							<div class="plate" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="<%=LeDico("lg_bi_comm_e")%>">
								<div class="CircleProg">
									<div id="EmergentcyProg"></div>	
								</div>
								<div class="ProgressTitle"></div>
							</div>
							<div class="plate" style="display: none;" data-toggle="tooltip" data-placement="bottom" title="" data-original-title=" [Number of cabins]">
								<div class="CircleProg">
									<div id="UploadProg"></div>	
								</div>
								<div class="ProgressTitle"><a href="#UP"><h4><i class="fa fa-upload"></i> Upload</h4></a></div>
								<div class="ProgressDesc"></div>
							</div>
						</div>
					</div>
				</div>
		</div>
		
		<div class="row"><!--Passenger Number-->
			<ul class="nav nav-pills pull-right" role="tablist">
  			<li style="font-size: 250%;"> <%=Ledico("lg_Passengers_CWL")%>: <span id="PassNum"></span></li>
			</ul>
		</div>
		
		<div class="row">
			<div class="tab-content">
				
					<div id="skipper-info">
						<div class="panel panel-primary">
							<div class="panel-heading">
								<div class="row" id="p-header">
									<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" id="heading"><i class="fa fa-user"></i><%response.write LeDico("infskip")%></div>
								</div>
							</div>
							<div class="panel-body">
								<ul class="nav nav-tabs" id="myTab">
									<li><a href="#CW"><i class="fa fa-th-list IconProgTap"></i><br><%=CW%></a></li>
                  <li><a href="#SK"><i class="fa fa-user IconProgTap"></i><br><%=SK%></a></li>
                  <li><a href="#BH"><i class="fa fa-bullhorn IconProgTap"></i><br><% if ss_auto="2" then response.write AD else response.write BH%></a></li>
  								<li><a href="#CO"><i class="fa fa-user IconProgTap"></i><br><%=CO%></a>
  								</li>
  								<li><a href="#AM"><i class="fa fa-bus IconProgTap"></i><br><%=AM%></a></li>
  								<li><a href="#EM"><i class="fa fa-ambulance IconProgTap"></i><br><%=EM%></a></li>
  								<li><a href="#UP"><i class="fa fa-upload IconProgTap"></i><br><%=UP%></a></li>
  								<li><a href="#PS"><i class="fa fa-paperclip IconProgTap"></i><br>Preference Sheet</a>
  								</li>
                </ul>
                <div class="tab-content col-lg-12 col-md-12">
                	<div id="CW" class="tab-pane fade in active col-lg-12 col-md-12">
										<div id="ListOfpass" style="padding: 5px;">
											<div class="row" id="taptool" style="margin-bottom: 5px; display: none;">
												<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
													<button type="button" class="btn btn-primary" id="ImportPass"><i class="fa fa-download"></i> <%=LeDico("lg_pass_import")%></button>
													<button type="button" class="btn btn-primary" id="ImportExcel"><i class="fa fa-download"></i> <%=LeDico("lg_excel_import")%></button>
													<div id="PassAdd" style="width: 20%;margin-left: auto;margin-right: auto; margin-bottom: 5px;">
													</div>
												</div>
												<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
													
												</div>
												<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" id="tebletDelAll">
													<% if dev_local and 1 then %>
													<button type="button" class="btn btn-primary DeleteAll pull-right" style="display:none;width:20%;"><i class="fa fa-trash"></i> <%=LeDico("All")%></button>
													<% end if %>
												</div>
											</div>
											<div class="row" id="PassHead"></div><!-- Head Passager Table -->
											<br>
											<div id="PassForm"></div>
											<div class="row">
												<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
													
												</div>
												<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="text-align: center;">
													<div id="AddOneNewPass" style="display: none;"></div>
												</div>
												<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
													
												</div>	
											</div>
											
										</div>
                	</div>
                	<div id="SK" class="tab-pane fade in active col-lg-12 col-md-12">
                		<div class="row">
											<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8" id="Import_SK" style="padding-bottom: 10px;">
												<!--<button type="button" class="btn btn-primary" id="ImportSK"><i class="fa fa-download"></i> <%=LeDico("lg_skipper_import")%></button>		!-->
											</div>
										</div>
										<div id="SkipperInfo"></div>
                	</div>
                	<div id="BH" class="tab-pane fade in active col-lg-12 col-md-12">
                		<div class="row">
											<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="Import_BH">
												<!--<button type="button" class="btn btn-primary" id="ImportBH"><i class="fa fa-download"></i> <%=LeDico("lg_boatinghistory_import")%></button>		!-->
											</div>
										</div>
										<div id="BoatHistory"></div>
                	</div>
                	<div id="CO" class="tab-pane fade col-lg-12 col-md-12">
                		<div class="row">
											<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="Import_CO" style="padding-bottom: 10px;">
												<!--<button type="button" class="btn btn-primary" id="ImportCO"><i class="fa fa-download"></i> <%=LeDico("lg_coskipper_import")%></button>		!-->
											</div>
										</div>
										<div id="Co-SkipperInfo"></div>
                	</div>
                	<div id="AM" class="tab-pane fade col-lg-12 col-md-12">
										<div id="ArrivalMarinaContain">
											
												<div id="ArrContainer" style="margin-top: 10px;">
													<div id="ArrivalMarina"></div>
													<div id="MoreDetailArr"></div>
													<div id="PassInfoComment"></div>
												</div>
											
										</div>
                	</div>
                	<div id="EM" class="tab-pane fade col-lg-12 col-md-12">
										<div id="EmergencyContain">
											<div id="EmergencyContacts"></div>
										</div>
                	</div>
                	<div id="UP" class="tab-pane fade col-lg-12 col-md-12">
                		<div id="UploadInfo">
	                		<div class="row">
	                			<div class="col-lg-6 col-md-6" id="txt-upload"><b><%=errbox2(txt_upload)%></b></div>
	                			<div class="col-lg-6 col-md-6" id="fade-upload"></div>
	                		</div>
	                		<div class="row">
	                			<div class="col-lg-12 col-md-12" id="ListFiles"></div>
	                		</div>
	                		<div id="importUP">
	                			<div class="row">
		                			<div class="col-lg-12 col-md-12" id="txt-import"></div>	
		                		</div>
	                			<div class="row">
		                			<div class="col-lg-12 col-md-12" id="Import_UP"></div>	
		                		</div>
	                		</div>
	                	</div>
                	</div>
                	<div id="PS" class="tab-pane fade col-lg-12 col-md-12">
                		<div id="PreSheet">
	                		<div class="row">
	                			<div class="col-lg-6 col-md-6" id="txt-upload"><b><%=errbox2(txt_upload)%></b></div>
	                			<div class="col-lg-6 col-md-6" id="PreferanceSheet"></div>
	                		</div>
	                		<div class="row">
	                			<div class="col-lg-12 col-md-12" id="PreferanceSheet_ListFiles"></div>
	                		</div>
	                	</div>
                	</div>
              		<div class="col-lg-12 col-md-12 text-center">
              			<div class="row" id="mark-skipper"></div>
              		</div>		
                </div>
							</div>
						</div>
					</div>			
				
			</div>
		</div>
			</div>
		</div>
	</div>
	<div id="pototypeform" style="display:none"></div>
	<div id="feedback"></div>
<script type="text/javascript" src="js/log_listexp_detail.js?v=20170625"></script>
<script type="text/javascript" src="../Offre_v4/js/tour.js"></script>
<script type="text/javascript" src="../Lycan/Plugins/vue/vue.js"></script>
<script type="text/javascript" src="../Lycan/Plugins/vue/vue-resource.js"></script>
<script type="text/javascript" src="../Lycan/Plugins/feedback/dist/buildStandAlone.min.js"></script>

<script>
	// Feedback Plugin //
	feedback_ins.init('#feedback', /*Element-id to display*/
										'83a392aae68f97b8a27c8a722b297da6', /*Api_key from Orangescrum*/
										'f5d44e1bb5f7eaef8f043f7bf220c6e2', /*Project_id from Orangescrum*/
										'<%=jsLedico("lg_feedback_trigger")%>', /*Dictionary to display on button*/
										false); /*Set TRUE if you want to point send feedback to localhost server*/
	// End Feedback Plugin //
</script>
</body>
</html>
<!-- #include file="../site/deconnect.asp" -->
