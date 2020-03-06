var Grades=function(){var d={},B={},t={},n={},D={},J={},K={},L={},C=[],q=function(){},G=function(){},b=function(R,b){$(R).prop("disabled",b);$(".grades.blocker").toggle(b)},M=function(){B={};t={};n={};q()},z=function(b,v){try{if("type"in b){switch(b.type){case "grade":var k=B[b.id];if(void 0==k||k.timestamp<b.timestamp)B[b.id]=b,!v&&k&&"visible"in k&&0==k.visible&&"visible"in b&&1==b.visible&&getHistory(Conversations.getCurrentSlideJid());break;case "numericGradeValue":case "booleanGradeValue":case "textGradeValue":var d=
t[b.gradeId]||{};t[b.gradeId]=d;var n=d[b.gradedUser];if(!n||n.timestamp<b.timestamp)d[b.gradedUser]=b,Progress.call("gradeValueReceived",[b])}v||q()}}catch(p){console.log("Grades.stanzaReceived",p)}};Progress.onConversationJoin.Grades=M;Progress.historyReceived.Grades=function(b){try{"type"in b&&"history"==b.type&&(M(),_.forEach(b.grades,function(b){z(b,!0)}),_.forEach(b.gradeValues,function(b){z(b,!0)}),q())}catch(d){console.log("Grades.historyReceivedFunction",d)}};Progress.stanzaReceived.Grades=
z;$(function(){$.getJSON("/getExternalGradebooks",function(b){C=b});console.log("Conv state:",Conversations.getCurrentConversationJid(),Conversations.shouldModifyConversation(),Conversations.getCurrentConversation());var z=function(){d=$("#gradesDatagrid");J=d.find(".gradeActionsContainer").clone();K=d.find(".gradeEditContainer").clone();L=d.find(".gradeAssessContainer").clone();d.empty();D=$("#createGradeButton");var k=function(b){jsGrid.Field.call(this,b)};k.prototype=new jsGrid.Field({sorter:function(b,
c){return new Date(b)-new Date(c)},itemTemplate:function(b){return(new Date(b)).toLocaleString()},insertTemplate:function(b){return""},editTemplate:function(b){return""},insertValue:function(){return""},editValue:function(){return""}});jsGrid.fields.dateField=k;var k=[{name:"name",type:"text",title:"Name",readOnly:!0,sorting:!0},{name:"description",type:"text",title:"Description",readOnly:!0,sorting:!0},{name:"location",type:"text",title:"Location",readOnly:!0,sorting:!0},{name:"timestamp",type:"dateField",
title:"When",readOnly:!0,itemTemplate:function(b){return 0==b?"":moment(b).format("MMM Do YYYY, h:mm a")}}],v=[{name:"gradeType",type:"text",title:"Type",readOnly:!0,sorting:!0},{name:"identity",type:"text",title:"Actions",readOnly:!0,sorting:!1,itemTemplate:function(d,c){if(c.author==UserSettings.getUsername()){var k=J.clone(),a=_.cloneDeep(c),u=function(){var c=_.uniqueId(),d=$("<div/>",{id:c}),k=$.jAlert({title:"Edit grade",width:"50%",content:d[0].outerHTML}),f=K.clone(),d=sprintf("gradeName_%s",
c),p=f.find(".gradeNameInputBox");p.attr("id",d).unbind("blur").on("blur",function(b){a.name=p.val()}).val(a.name);f.find(".gradeNameLabel").attr("for",d);var d=sprintf("gradeDesc_%s",c),H=f.find(".gradeDescriptionInputBox");H.attr("id",d).unbind("blur").on("blur",function(b){a.description=H.val()}).val(a.description);f.find(".gradeDescriptionLabel").attr("for",d);var d=sprintf("gradeType_%s",c),w=f.find(".gradeTypeSelect"),E=f.find(".numericMinTextbox"),F=f.find(".numericMaxTextbox"),h=sprintf("numericMin_%s",
c),O=sprintf("numericMax_%s",c);f.find(".numericMinLabel").attr("for",h);f.find(".numericMaxLabel").attr("for",O);E.unbind("blur").on("blur",function(b){"numeric"==a.gradeType?a.numericMinimum=parseFloat(E.val()):delete a.numericMinimum}).attr("id",h);F.unbind("blur").on("blur",function(b){"numeric"==a.gradeType?a.numericMaximum=parseFloat(F.val()):delete a.numericMaximum}).attr("id",O);var P=function(){"foreignRelationship"in a&&(E.prop("disabled",!0),F.prop("disabled",!0),w.prop("disabled",!0));
w.val(a.gradeType);switch(a.gradeType){case "numeric":f.find(".numericOptions").show();void 0===a.numericMinimum&&(a.numericMinimum=0);void 0===a.numericMaximum&&(a.numericMaximum=100);E.val(a.numericMinimum);F.val(a.numericMaximum);break;default:f.find(".numericOptions").hide()}};w.attr("id",d).unbind("change").on("change",function(){a.gradeType=w.val();P()}).val(a.gradeType);f.find(".gradeTypeLabel").attr("for",d);d=sprintf("gradeVisible_%s",c);f.find(".gradeVisibleLabel").attr("for",d);var n=f.find(".gradeVisibleCheckbox");
n.attr("id",d).prop("checked",a.visible).unbind("change").on("change",function(b){a.visible=n.prop("checked")});var m=void 0,x=void 0,e=void 0,A=function(){var g=f.find(".associateController");b(g,!1);if("foreignRelationship"in a){g.find(".createAssociation").hide();var c=a.foreignRelationship.sys,l=a.foreignRelationship.key.split("_"),d=l[0],h=l[1];g.find(".associationSystem").text(c);g.find(".associationOrgUnit").text(d);g.find(".associationGradeId").text(h);g.find(".requestRefreshAssociation").unbind("click").on("click",
function(){b(g,!0);$.getJSON(sprintf("/getExternalGrade/%s/%s/%s",c,d,h),function(g){a.description=g.description;a.name=g.name;a.gradeType=g.gradeType;a.numericMinimum=g.numericMinimum;a.numericMaximum=g.numericMaximum;k.closeAlert();u();b(this,!1)}).fail(function(a,c,e){b(g,!1);console.log(c,e);alert(sprintf("Error: %s \r\n %s",c,e))})});g.find(".disassociateGrade").unbind("click").on("click",function(){delete a.foreignRelationship;a.timestamp=0;sendStanza(a);k.closeAlert();u()});g.find(".refreshAssociation").show()}else if(g.find(".refreshAssociation").hide(),
g.find(".createAssociation").show(),g.find(".associationPhase").hide(),void 0===m)g.find(".requestAssocPhase1").show(),g.find(".requestAssociation").unbind("click").on("click",function(){m=!0;1==C.length&&(x=C[0].id);A()});else if(void 0==x)x=C[0].id,g.find(".chooseGradebook").html(_.map(C,function(a){return $("<option/>",{value:a.id,text:a.name})})).unbind("change").on("change",function(a){x=$(this).val()}),g.find(".commitGradebook").unbind("click").on("click",function(){b(this,!0);A()}),g.find(".requestAssocPhase2").show();
else if(void 0===e)b(g,!0),$.getJSON(sprintf("/getExternalGradebookOrgUnits/%s",x),function(a){console.log("requestedOrgUnits:",a);a&&a.length?(e=a[0].foreignRelationship.key,g.find(".chooseOrgUnit").html(_.map(a,function(a){return $("<option/>",{value:a.foreignRelationship.key,text:a.name})})).unbind("change").on("change",function(a){e=$(this).val()}),g.find(".commitOrgUnit").unbind("click").on("click",function(){A()}),g.find(".requestAssocPhase3").show()):(console.log("found no data:",a),g.text("No gradebooks found"));
b(g,!1)}).fail(function(a,c,e){b(g,!1);console(sprintf("error: %s \r\n %s",c,e));alert(sprintf("error: %s \r\n %s",c,e))});else{g.find(".requestAssocPhase4").show();b(g,!0);var y=g.find(".linkGrade"),Q=[],I=g.find("#chooseExistingGradeSelectBox"),r=void 0;y.unbind("click").on("click",function(){void 0!==r&&"foreignRelationship"in r&&"sys"in r.foreignRelationship&&"key"in r.foreignRelationship?(a.foreignRelationship={sys:r.foreignRelationship.sys,key:r.foreignRelationship.key},a.gradeType=r.gradeType,
a.numericMinimum=r.numericMinimum,a.numericMaximum=r.numericMaximum,a.name=r.name,p.val(a.name),a.description=r.description,H.val(a.description),sendStanza(a),A(),P()):alert("no pre-existing grade chosen")}).prop("disabled",!0);I.unbind("change").on("change",function(a){var b=$(this).val();void 0!==b&&"no-choice"!==b?(r=_.find(Q,function(a){return"foreignRelationship"in a&&"key"in a.foreignRelationship&&a.foreignRelationship.key==b}),void 0!==r?y.prop("disabled",!1):y.prop("disabled",!0)):(r=void 0,
y.prop("disabled",!0))});$.ajax({type:"GET",url:sprintf("/getExternalGrades/%s/%s",x,e),success:function(a){Q=a;a.length?I.html(_.map([{text:"",foreignRelationship:{system:"no-system",key:"no-choice"}}].concat(a),function(a){return $("<option/>",{text:a.name,value:a.foreignRelationship.key})})):(I.hide(),y.prop("disabled",!0),y.hide());b(g,!1)},dataType:"json"}).fail(function(a,c,e){b(g,!1);alert(sprintf("error - could not fetch existing grades from remote gradebook: %s \r\n %s",c,e))});g.find(".createGrade").unbind("click").on("click",
function(){b(g,!0);$.ajax({type:"POST",url:sprintf("/createExternalGrade/%s/%s",x,e),data:JSON.stringify(a),success:function(g){a.foreignRelationship={sys:g.foreignRelationship.sys,key:g.foreignRelationship.key};sendStanza(a);A();b(this,!1)},contentType:"application/json",dataType:"json"}).fail(function(a,c,e){b(g,!1);alert("Could not create remote grade.  Please ensure that the grade has a non-blank name which will be unique within the remote system")})})}},l=f.find(".fixGradeTypeErrorsContainer"),
y=l.clone();l.empty();A();f.find(".cancelGradeEdit").unbind("click").on("click",function(){k.closeAlert()});f.find(".submitGradeEdit").unbind("click").on("click",function(){sendStanza(a);var b=sprintf("%sGradeValue",a.gradeType);console.log("gradeFilter:",b,t[a.id]);var c=_.filter(t[a.id],function(a){return a.type!=b&&"gradeValue"in a});k.closeAlert();if(0<_.size(c)){var e=_.uniqueId(),m=$("<div/>",{id:e}),x=$.jAlert({title:"Fix grade values after grade type change",width:"auto",content:m[0].outerHTML,
onClose:function(){q()}}),m=y.clone();$("#"+e).append(m);l.show();var e=m.find(".individualFixesContainer"),d=e.find(".individualFix").clone();e.html(_.map(c,function(e){var m=_.cloneDeep(e),l=d.clone();l.find(".individualFixGradedUser").text(m.gradedUser.toString());l.find(".individualFixOldValue").text(m.gradeValue.toString());var f=void 0;switch(a.gradeType){case "numeric":switch(m.type){case "textGradeValue":e=parseInt(m.gradeValue);f="numericMinimum"in a&&!isNaN(a.numericMinimum)&&"numericMaximum"in
a&&!isNaN(a.numericMaximum)?isNaN(e)?a.numericMinimum:Math.min(a.numericMaximum,Math.max(e,a.numericMinimum)):isNaN(e)?0:e;break;case "booleanGradeValue":f=m.gradeValue?a.numericMaximum:a.numericMinimum}break;case "text":switch(m.type){case "numericGradeValue":f=m.gradeValue.toString();break;case "booleanGradeValue":f=m.gradeValue.toString()}break;case "boolean":switch(m.type){case "numericGradeValue":f=0!=m.gradeValue;break;case "textGradeValue":e=m.gradeValue.toLowerCase().trim(),f=!("false"==e||
"0"==e||"no"==e||""==e||"n"==e)}}l.find(".individualFixNewValue").text(f.toString());l.find(".commitIndividualFix").unbind("click").on("click",function(){m.type=b;m.gradeValue=f;sendStanza(m);c=_.filter(c,function(a){return a.gradedUser!=m.gradedUser});l.unbind("click");l.remove();1>_.size(c)&&x.closeAlert()});return l}));m.find(".closeIndividualFixesPopup").on("click",function(){x.closeAlert()})}});$("#"+c).append(f)};k.find(".editGradeButton").unbind("click").on("click",u);k.find(".assessGradeButton").unbind("click").on("click",
function(){var a=_.uniqueId(),d=$("<div/>",{id:a});$.jAlert({title:"Assess grade",width:"auto",content:d[0].outerHTML,onClose:function(){G=function(){};q()}});var k={},f=L.clone();$("#"+a).append(f);b(f,!0);var p=f.find(".gradebookDatagrid"),k=f.find(".gradeValueEditPopup").clone();p.find(".gradeUserContainer").clone();p.empty();var u=function(a){var d=t[c.id],h={};void 0===d?t[c.id]=h:h=_.cloneDeep(d);var k=sprintf("%sGradeValue",c.gradeType),p=Participants.getPossibleParticipants();if("foreignRelationship"in
c){var d=c.foreignRelationship.sys,u=c.foreignRelationship.key.split("_")[0];$.getJSON(sprintf("/getExternalGradebookOrgUnitClasslist/%s/%s",d,u),function(b){_.forEach(b,function(a){a=a.UserName;void 0!==a&&p.push(a)});p=_.uniq(p);_.forEach(p,function(a){var b=h[a];if(void 0===b||b.type!=k)h[a]={type:k,gradeId:c.id,gradedUser:a,gradePrivateComment:"",gradeComment:"",author:c.author,timestamp:0,audiences:[]}});h=_.values(h);h=_.filter(h,function(a){return a.type==k});a(h)}).fail(function(a,c,e){b(f,
!1);console.log("error",c,e)})}else _.forEach(p,function(a){var b=h[a];if(void 0===b||b.type!=k)h[a]={type:k,gradeId:c.id,gradedUser:a,author:c.author,gradePrivateComment:"",gradeComment:"",timestamp:0,audiences:[]}}),h=_.values(h),h=_.filter(h,function(a){return a.type==k}),a(h)},w=function(a){var d=function(a){var b=sprintf("changeGvPopup_%s",_.uniqueId()),e=$("<div/>",{id:b}),d=$.jAlert({type:"modal",content:e[0].outerHTML,title:sprintf("Change score for %s",a.gradedUser)}),b=$("#"+b),e=k.clone(),
l=e.find(".changeGradeContainer"),f=l.find(".numericScore"),g=l.find(".booleanScore"),h=l.find(".booleanScoreLabel"),p=l.find(".textScore"),n=_.cloneDeep(a);switch(c.gradeType){case "numeric":l=function(a){n.gradeValue=parseFloat(f.val())};f.val(a.gradeValue).attr("min",c.numericMinimum).attr("max",c.numericMaximum).unbind("blur").on("blur",l);g.remove();h.remove();p.remove();break;case "text":f.remove();l=function(a){n.gradeValue=p.val()};p.val(a.gradeValue).unbind("blur").on("blur",l);h.remove();
g.remove();break;case "boolean":f.remove();var q=sprintf("booleanScoreId_%s",_.uniqueId()),l=function(a){n.gradeValue=g.prop("checked")};g.unbind("change").on("change",l).prop("checked",a.gradeValue).attr("id",q);h.attr("for",q);p.remove();break;default:f.remove(),g.remove(),h.remove(),p.remove()}h=sprintf("privateComment_%s",_.uniqueId);e.find(".gradeValueCommentTextbox").val(a.gradeComment).attr("id",h).unbind("blur").on("blur",function(){n.gradeComment=$(this).val()});e.find(".gradeValueCommentTextboxLabel").attr("for",
h);h=sprintf("privateComment_%s",_.uniqueId);e.find(".gradeValuePrivateCommentTextbox").val(a.gradePrivateComment).attr("id",h).unbind("blur").on("blur",function(){n.gradePrivateComment=$(this).val()});e.find(".gradeValuePrivateCommentTextboxLabel").attr("for",h);e.find(".submitGradeValueChange").unbind("click").on("click",function(){var b=_.cloneDeep(n);delete b.remoteGrade;delete b.remoteComment;delete b.remotePrivateComment;sendStanza(b);a.gradeValue=n.gradeValue;a.gradeComment=n.gradeComment;
a.gradePrivateComment=n.gradePrivateComment;t[c.id][n.gradedUser]=n;d.closeAlert();u(w)});e.find(".cancelGradeValueChange").unbind("click").on("click",function(){d.closeAlert()});b.append(e)},h=[{name:"gradedUser",type:"text",title:"Who",readOnly:!0,sorting:!0},{name:"timestamp",type:"dateField",title:"When",readOnly:!0,itemTemplate:function(a){return 0==a?"":moment(a).format("MMM Do YYYY, h:mm a")}},{name:"gradeValue",type:"text",title:"Score",readOnly:!0,sorting:!0},{name:"gradeComment",type:"text",
title:"Comment",readOnly:!0,sorting:!0},{name:"gradePrivateComment",type:"text",title:"Private comment",readOnly:!0,sorting:!0}];"foreignRelationship"in c&&h.push({name:"remoteGrade",type:"text",title:"Remote score",readOnly:!0,sorting:!0},{name:"remoteComment",type:"text",title:"Remote comment",readOnly:!0,sorting:!0},{name:"remotePrivateComment",type:"text",title:"Remote private comment",readOnly:!0,sorting:!0});p.jsGrid({width:"100%",height:"auto",inserting:!1,editing:!1,sorting:!0,paging:!0,rowClick:function(a){d(a.item)},
noDataContent:"No gradeable users",controller:{loadData:function(b){_.forEach(a,function(a){if("foreignRelationship"in c&&c.id in n){var b=_.find(n[c.id],function(b){return b.gradedUser==a.gradedUser});void 0!=b&&("gradeValue"in b&&!("remoteGradeValue"in a)&&(a.remoteGrade=b.gradeValue),"gradeComment"in b&&!("remoteComment"in a)&&(a.remoteComment=b.gradeComment),"gradePrivateComment"in b&&!("remotePrivateComment"in a)&&(a.remotePrivateComment=b.gradePrivateComment))}});if("sortField"in b){var d=_.sortBy(a,
function(a){return a[b.sortField]});"sortOrder"in b&&"desc"==b.sortOrder&&(d=_.reverse(d));return d}return a}},pageLoading:!1,fields:h});p.jsGrid("loadData");p.jsGrid("sort",{field:"gradedUser",order:"desc"});if("foreignRelationship"in c){var q=c.foreignRelationship.sys,h=c.foreignRelationship.key.split("_"),N=h[0],v=h[1];f.find(".getRemoteData").unbind("click").on("click",function(){var a=this;b(a,!0);$.getJSON(sprintf("/getExternalGradeValues/%s/%s/%s",q,N,v),function(d){n[c.id]=d;u(function(c){_.forEach(c,
function(c){var e=_.find(d,function(a){return a.gradedUser==c.gradedUser});void 0!==e&&("gradeValue"in e&&(c.remoteGrade=e.gradeValue),"gradeComment"in e&&(c.remoteComment=e.gradeComment),"gradePrivateComment"in e&&(c.remotePrivateComment=e.gradePrivateComment));b(a,!1)});return w(c)})}).fail(function(c,e,d){b(a,!1);console.log("error",e,d)})});f.find(".sendGradesToRemote").unbind("click").on("click",function(){var a=this;b(a,!0,function(a){return $(a).find("span")});var d=_.filter(t[c.id],function(a){return void 0!=
a.gradeValue});$.ajax({type:"POST",data:JSON.stringify(d),dataType:"json",success:function(e){n[c.id]=e;var f=_.filter(d,function(a){return void 0===_.find(e,function(b){return b.gradedUser==a.gradedUser&&b.gradeValue==a.gradeValue&&(void 0===a.gradeComment||b.gradeComment==a.gradeComment)&&(void 0===a.gradePrivateComment||b.gradePrivateComment==a.gradePrivateComment)})});f.length&&errorAlert("External grade synchronization failed",sprintf("<div><div>Some grades failed to synchronize to the external gradebook:</div><div><ul>%s</ul></div><div>This might be because these users aren't available in the external gradebook to be assessed.</div><div>These grades are still available in this gradebook, but may not be available in the external gradebook.</div>",
_.map(f,function(a){return sprintf("<li>%s</li>",a.gradedUser)}).join("")));u(function(c){_.forEach(c,function(a){var b=_.find(e,function(b){return b.gradedUser==a.gradedUser});void 0!==b&&("gradeValue"in b&&(a.remoteGrade=b.gradeValue),"gradeComment"in b&&(a.remoteComment=b.gradeComment),"gradePrivateComment"in b&&(a.remotePrivateComment=b.gradePrivateComment))});b(a,!1);return w(c)})},url:sprintf("/updateExternalGradeValues/%s/%s/%s",q,N,v),contentType:"application/json"}).fail(function(c,d,f){b(a,
!1);console.log("error",d,f)})})}else f.find(".gradeSyncActions").remove();b(f,!1)};G=function(){u(w)};u(w)});return k}return $("<span/>")}}],z=[{name:"myGradeValue",type:"text",title:"Score",readOnly:!0,sorting:!0},{name:"myGradeComment",type:"text",title:"Comment",readOnly:!0,sorting:!0}],k=Conversations.shouldModifyConversation()?_.concat(k,v):_.concat(k,z);d.jsGrid({width:"100%",height:"auto",inserting:!1,editing:!1,sorting:!0,paging:!0,noDataContent:"No grades",controller:{loadData:function(b){var c=
Conversations.shouldModifyConversation(),d=_.map(_.filter(B,function(a){return c||a.visible}),function(a){var b=t[a.id];void 0!==b&&(b=b[UserSettings.getUsername()],void 0!==b&&(a.myGradeValue=b.gradeValue,a.myGradeComment=b.gradeComment));return a});"sortField"in b&&(d=_.sortBy(d,function(a){return a[b.sortField]}),"sortOrder"in b&&"desc"==b.sortOrder&&(d=_.reverse(d)));return d}},pageLoading:!1,fields:k});d.jsGrid("sort",{field:"timestamp",order:"desc"});q=function(){void 0!=WorkQueue&&WorkQueue.enqueue(function(){d.jsGrid("loadData");
var b=d.jsGrid("getSorting");"field"in b&&d.jsGrid("sort",b);D.unbind("click");Conversations.shouldModifyConversation()?D.unbind("click").on("click",function(){console.log("clicked createButton");if(Conversations.shouldModifyConversation()){var b=Conversations.getCurrentSlideJid(),d=UserSettings.getUsername(),b={type:"grade",name:"",description:"",audiences:[],author:d,location:b,id:sprintf("%s_%s_%s",b,d,(new Date).getTime().toString()),gradeType:"numeric",numericMinimum:0,numericMaximum:100,visible:!1,
timestamp:0};sendStanza(b)}}).show():D.hide();G()})};q()},v=function(){"jid"in Conversations.getCurrentConversation()?z():_.delay(v,500)};v()});return{getGrades:function(){return B},getGradeValues:function(){return t},reRender:q}}();
