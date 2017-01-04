var Plugins=function(){return{Chat:function(){var e={},h={},b={},m={},f=sprintf("chatbox_%s",_.uniqueId()),t=$("<div />",{id:f}),l=function(a,b,d,c){c=m.clone();UserSettings.getUsername();var r=c.find(".chatMessageAuthor");r.text(a.author);c.find(".chatMessageTimestamp").text((new Date(a.timestamp)).toISOString());var k=c.find(".chatMessageContent");switch(a.contentType){case "text":k.text(a.content);break;case "html":k.html(a.content)}if(b&&d)switch(b){case "whisperTo":k.addClass("whisper");r.text(sprintf("to %s",
d));break;case "whisperFrom":k.addClass("whisper");r.text(sprintf("from %s",d));break;case "groupChatTo":k.addClass("groupChat");r.text(sprintf("to %s",d));break;case "groupChatFrom":k.addClass("groupChat"),r.text(sprintf("from %s",d))}return c},g=function(a){if(a&&"type"in a&&"chatMessage"==a.type&&"identity"in a&&!(a.identity in e)){e[a.identity]=a;var q=UserSettings.getUsername(),d=_.flatten(_.flatten(_.map(Conversations.getCurrentConversation().slides,function(a){return _.map(a.groupSets,function(a){return a.groups})})));
boardContent.chatMessages.push(a);if(a.audiences.length){var c=_.find(a.audiences,function(a){return"user"==a.type||"group"==a.type});a.author==q?c&&"user"==c.type?(b.append(l(a,"whisperTo",c.name)),b.scrollTop(b[0].scrollHeight)):c&&"group"==c.type&&(b.append(l(a,"groupChatTo",c.name)),b.scrollTop(b[0].scrollHeight)):c&&"user"==c.type&&c.name==q?(b.append(l(a,"whisperFrom",a.author)),b.scrollTop(b[0].scrollHeight)):c&&"group"==c.type&&_.some(d,function(a){return a.name==c.name&&_.some(a.members,
function(a){return a.name==q})})&&(b.append(l(a,"groupChatFrom",a.author,c.name)),b.scrollTop(b[0].scrollHeight))}else b.append(l(a)),b.scrollTop(b[0].scrollHeight)}},n=function(a){_.forEach(a.chatMessages,g)},p=function(a){if(a&&a.length){var b=[],d;if(a.startsWith("/w"))if(d=a.split(" "),d.length&&2<=d.length)b.push({domain:"metl",name:d[1],type:"user",action:"read"}),d=_.drop(d,2).join(" ");else return a;else if(a.startsWith("/g"))if(d=a.split(" "),d.length&&2<=d.length)b.push({domain:"metl",name:d[1],
type:"group",action:"read"}),d=_.drop(d,2).join(" ");else return a;else d=a;a=sendStanza;var c=UserSettings.getUsername(),e=Conversations.getCurrentSlideJid(),k=(new Date).getTime(),f=sprintf("%s_%s_%s",c,e,k),b={type:"chatMessage",author:c,timestamp:k,identity:f,contentType:"text",content:d,context:e,audiences:b||[]};console.log("created chat message:",b);a(b);return""}return a};return{style:".chatMessage {color:black}.chatMessageContainer {overflow-y:auto; height:110px;}.chatContainer {margin-left:1em;width:320px;height:140px;}.chatMessageAuthor {color:slategray;margin-right:1em;}.chatMessageTimestamp {color:red;font-size:small;display:none;}.chatboxContainer {display:flex;}.chatboxContainer input{flex-grow:1;}.chatbox {background-color:white;color:black; display:inline-block; padding:0px; margin:0px;}.chatboxSend {display:inline-block; background:white; color:black; padding:0px; margin:0px;}.groupChat {color:darkorange}.whisper {color:darkblue}",
load:function(a,b){a.stanzaReceived.Chatbox=g;a.historyReceived.Chatbox=n;t.append('<div class="chatContainer" ><div class="chatMessageContainer" ><div class="chatMessage" ><span class="chatMessageTimestamp" ></span><span class="chatMessageAuthor" ></span><span class="chatMessageContent"></span></div></div><div class="chatboxContainer"><input type="text" class="chatbox"></input><button class="chatboxSend">Send</button></div></div>');return t},initialize:function(){h=$("#"+f);b=h.find(".chatMessageContainer");
m=b.find(".chatMessage").clone();b.empty();var a=h.find(".chatboxContainer .chatbox").on("keydown",function(a){13==a.keyCode&&(a=$(this),a.val(p(a.val())))});h.find(".chatboxContainer .chatboxSend").on("click",function(){a.val(p(a.val()))})}}}(),"Face to face":function(){var e=$("<div />");return{style:".publishedStream {background:green;} .subscribedStream {background:red;} .videoConfStartButton, .videoConfSubscribeButton, .videoConfPermitStudentBroadcastButton {background:white;margin:1px;} .videoConfSessionContainer, .videoConfStartButtonContainer, .videoConfContainer, .videoConfPermitStudentBroadcastContainer{display:flex;} .videoConfStartButtonContainer, .videoConfPermitStudentBroadcastContainer{flex-direction:row;} .videoConfStartButton, .videoConfPermitStudentBroadcastButton{padding:0 1em;font-size:1rem;} #videoConfSessionsContainer{display:flex;} .videoContainer{display:flex;} .context, .publisherName{font-size:1rem;} .thumbWide{width:160px;} .broadcastContainer{display:none;}",
load:function(h,b){e.append('<span id="videoConfSessionsContainer"><div class="videoConfSessionContainer"><div class="thumbWide"><div class="videoConfStartButtonContainer"><button class="videoConfStartButton"><div>Start sending</div></button><span class="context"></span></div><div class="videoConfPermitStudentBroadcastContainer"><button class="videoConfPermitStudentBroadcastButton"><div>Permit students to broadcast</div></button><span class="context"></span></div><div class="viewscreen"></div></div><div class="broadcastContainer"><a class="floatingToolbar btn-menu fa fa-television btn-icon broadcastLink"><div class="icon-txt">Watch class</div></a></div><div class="videoSubscriptionsContainer"></div><div class="videoConfContainer"><span class="videoContainer thumbWide"><button class="videoConfSubscribeButton"><div>Toggle</div></button><span class="publisherName"></span></span></div></div></span>');
return e},initialize:TokBox.initialize}}(),Groups:function(){var e=$("<div />"),h=function(b,e,f){b=$("<button />",{"class":sprintf("%s btn-icon fa",b),click:f});$("<div />",{"class":"icon-txt",text:e}).appendTo(b);return b};return{style:".groupsPluginMember{margin-left:0.5em;display:flex;} .groupsPluginGroupContainer{display:flex;margin-right:1em;} .groupsPluginGroup{display:inline-block;text-align:center;vertical-align:top;} .groupsPluginGroupGrade button, .groupsPluginGroupGrade .icon-txt{padding:0;margin-top:0;} .groupsPluginGroupControls button, .groupsPluginGroupControls .icon-txt{padding:0;margin-top:0;} .isolateGroup label{margin-top:1px;} .isolateGroup{margin-top:0.8em;} .memberCurrentGrade{color:black;background-color:white;margin-right:0.5em;padding:0 .5em;} .groupsPluginGroupControls{display:flex;} .groupsPluginGroupGrade{background-color:white;color:black;margin:2px;padding:0 0.3em;height:3em;display:inline;} .groupsPluginAllGroupsControls{margin-bottom:0.5em;border-bottom:0.5px solid white;padding-left:1em;display:flex;}",
load:function(b,m){var f=function(){try{e.empty();var b=Conversations.getCurrentGroups();if(Conversations.shouldModifyConversation()){var f=Conversations.getCurrentSlide();if(f&&b.length){var g=sprintf("groupWork_%s",f.id),n=_.find(Grades.getGrades(),function(a){return a.location==g});if(n)var p=Grades.getGradeValues()[n.id];var a=0;$("<div />",{"class":"groupsPluginAllGroupsControls"}).on("mousedown",function(){a=$("#masterFooter").scrollLeft()}).append($("<input />",{type:"radio",name:"groupView",
id:"showAll"}).click(function(){_.each(b,function(a){ContentFilter.setFilter(a.id,!0)});ContentFilter.clearAudiences();blit();$("#masterFooter").scrollLeft(a)})).append($("<label />",{"for":"showAll"}).css({"flex-grow":0}).append($("<span />",{"class":"icon-txt",text:"Show all"}).css({"margin-top":"3px"}))).appendTo(e);var q=$("<div />").css({display:"flex"}).appendTo(e);_.each(b,function(c){var d=$("<div />",{"class":"groupsPluginGroupContainer"}).appendTo(q),e=$("<div />",{"class":"groupsPluginGroup"}).css({display:"block"});
_.each(["A","B","C","D","F"],function(a){$("<div />",{text:a,"class":"groupsPluginGroupGrade"}).appendTo(e).on("click",function(){void 0!=n&&_.each(c.members,function(b){b={type:"textGradeValue",gradeId:n.id,gradeValue:a,gradedUser:b,author:UserSettings.getUsername(),timestamp:0,audiences:[]};sendStanza(b)})})});var f=$("<div />").appendTo(d);$("<span />",{text:sprintf("Group %s",c.title),"class":"ml"}).appendTo(f);var l=$("<div />",{"class":"groupsPluginGroupControls"}).appendTo(f);h("fa-share-square",
"",function(){m.find("input").prop("checked",!0).change();console.log("Isolating and screenshotting",m);_.defer(Submissions.sendSubmission)}).appendTo(l);var g=sprintf("isolateGroup_%s",c.title),m=$("<div />",{"class":"isolateGroup"}).on("mousedown",function(){a=$("#masterFooter").scrollLeft()}).append($("<input />",{type:"radio",name:"groupView",id:g}).change(function(){console.log("masterFooter",a);_.each(b,function(a){ContentFilter.setFilter(a.id,!1)});ContentFilter.setFilter(c.id,!0);ContentFilter.setAudience(c.id);
blit();$("#masterFooter").scrollLeft(a)})).append($("<label />",{"for":g}).append($("<span />",{"class":"icon-txt",text:"Isolate"}).css({"margin-top":"5px"}))).appendTo(l),u=$("<div />",{"class":"groupsPluginGroup"}).prependTo(d);_.each(c.members,function(a){var b=$("<div />",{text:a,"class":"groupsPluginMember"}).appendTo(u);p&&a in p&&$("<span />",{"class":"memberCurrentGrade",text:p[a].gradeValue}).prependTo(b)});e.appendTo(f)})}}else{var d=$("<div />").css({display:"flex"}).appendTo(e);_.each(b,
function(a){if(_.find(Conversations.getCurrentGroup(),a)){var b=$("<div />",{"class":"groupsPluginGroupContainer"}).appendTo(d);sprintf("isolateGroup_%s",a.title);var e=$("<div />").appendTo(b);_.each(a.members,function(a){$("<div />",{text:a}).appendTo(e)});$("<div />",{text:sprintf("Group %s",a.title)}).prependTo(e)}})}}catch(c){console.log("Groups plugin render e",c)}};b.gradeValueReceived["Groups plugin"]=function(b){var e=sprintf("groupWork_%s",Conversations.getCurrentSlideJid()),g=_.find(Grades.getGrades(),
function(b){return b.location==e});g&&b.gradeId==g.id&&f()};b.currentSlideJidReceived["Groups plugin"]=f;b.conversationDetailsReceived["Groups plugin"]=f;return e},initialize:function(){}}}()}}();$(function(){var e=$("#pluginBar"),h=$("<style></style>").appendTo($("body"));_.each(Plugins,function(b,m){var f=$("<div />",{"class":"plugin translucent"});b.load(Progress).appendTo(f);h.append(b.style);f.appendTo(e);b.initialize()})});
