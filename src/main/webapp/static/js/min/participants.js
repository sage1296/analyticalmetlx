var Participants=function(){var g={},q={},f={},m={inks:0,highlighters:0,texts:{},images:0,quizResponses:0,submissions:0,following:!0},r=function(c){return _.reduce(c.words,function(a,d,b){return a+d.text.length},0)},n=d3.scaleLinear().range([9,30]),p,v=function(c){p||(p=d3.select("#lang").style("margin-left","1em"));n.domain(d3.extent(_.map(c,"value")));$("#lang .word").remove();c=p.selectAll(".word").data(c,function(a){return a.key});c.enter().append("div").attr("class","word").style("margin-right",
"1em").style("display","inline-block").style("vertical-align","middle").text(function(a){return a.key}).style("font-size",function(a){console.log(a,n(a.value));return n(a.value)+"px"}).merge(c).sort(function(a,d){return d3.ascending(d.value,a.value)});c.exit().remove()},k={keyboarding:!0,handwriting:!0,imageRecognition:!0,imageTranscription:!0,conjugate:!0},h=function(){g.jsGrid("loadData");var c=g.jsGrid("getSorting");"field"in c&&g.jsGrid("sort",c);Analytics.word.reset();var a={};_.each(boardContent.themes,
function(d){_.each(d.text.split(" "),function(b){if(0<b.length){b=b.toLowerCase();k.conjugate&&(b=nlp_compromise.text(b).root());var l=d.origin;1==k[l]&&(Analytics.word.incorporate(b),b in a||(a[b]={}),l in a[b]||(a[b][l]=0),a[b][l]++)}})});v(Analytics.word.cloudData())},x=function(){showBackstage("participants");updateActiveMenu(this);w();h()},t=function(){Conversations.shouldModifyConversation()?($("#menuParticipants").off().on("click",x),$("#menuParticipants").show()):($("#menuParticipants").unbind("click"),
$("#menuParticipants").hide())},u=function(){t()},w=function(){_.each(k,function(c,a){var d=$(sprintf("#%s",a));d.attr("checked",k[a]);d.off("click").on("click",function(){k[a]=!k[a];h()})})};$(function(){t();g=$("#participantsDatagrid");q=g.find(".followControls").clone();g.empty();var c=function(a){jsGrid.Field.call(this,a)};c.prototype=new jsGrid.Field({sorter:function(a,d){return new Date(a)-new Date(d)},itemTemplate:function(a){return(new Date(a)).toLocaleString()},insertTemplate:function(a){return""},
editTemplate:function(a){return""},insertValue:function(){return""},editValue:function(){return""}});jsGrid.fields.dateField=c;g.jsGrid({width:"100%",height:"auto",inserting:!1,editing:!1,sorting:!0,paging:!0,noDataContent:"No participants",controller:{loadData:function(a){var d=_.map(_.keys(f),function(a){var d=f[a];return{name:a,following:d.following,attendances:_.size(d.attendances),images:d.images,inks:d.inks,texts:_.reduce(d.texts,function(a,b){return a+b},0),quizResponses:d.quizResponses,submissions:d.submissions,
highlighters:d.highlighters}});"sortField"in a&&(d=_.sortBy(d,function(b){return b[a.sortField]}),"sortOrder"in a&&"desc"==a.sortOrder&&(d=_.reverse(d)));return d}},pageLoading:!1,fields:[{name:"name",type:"text",title:"Follow",readOnly:!0,sorting:!0,itemTemplate:function(a,d){var b=q.clone(),c=sprintf("participant_%s",d.name);b.find(".followValue").attr("id",c).prop("checked",d.following).on("change",function(){f[d.name].following=$(this).is(":checked");blit();h()});b.find(".followLabel").attr("for",
c).text(d.name);return b}},{name:"attendances",type:"number",title:"Attendances",readOnly:!0},{name:"images",type:"number",title:"Images",readOnly:!0},{name:"inks",type:"number",title:"Inks",readOnly:!0},{name:"highlighters",type:"number",title:"Highlighters",readOnly:!0},{name:"texts",type:"number",title:"Texts",readOnly:!0},{name:"quizResponses",type:"number",title:"Poll responses",readOnly:!0},{name:"submissions",type:"number",title:"Submissions",readOnly:!0}]});g.jsGrid("sort",{field:"name",order:"desc"});
h()});Progress.stanzaReceived.participants=function(c){var a=!1;if("type"in c&&"author"in c){var d=c.author;if(!(d in f)){var b=_.clone(m);b.name=d;f[d]=b}b=f[d];switch(c.type){case "ink":b.inks+=1;a=!0;break;case "image":b.images+=1;a=!0;break;case "highlighter":b.highlighters+=1;a=!0;break;case "multiWordText":b.texts[c.identity]=r(c);a=!0;break;case "submission":b.submissions+=1;a=!0;break;case "quizResponse":b.quizResponses+=1,a=!0}f[d]=b}a&&h()};Progress.themeReceived.participants=function(){"participants"==
window.currentBackstage&&h()};Progress.historyReceived.participants=function(c){var a={};Analytics.word.reset();var d=function(b){return a[b]||_.cloneDeep(m)};_.each(_.groupBy(c.attendances,"author"),function(b){var c=b[0].author,e=d(m);e.name=c;e.attendances=b;a[c]=e});_.each(_.groupBy(c.inks,"author"),function(b,c){var e=d(c);e.inks+=_.size(b);a[c]=e});_.each(_.groupBy(c.highlighters,"author"),function(b,c){var e=d(c);e.highlighters+=_.size(b);a[c]=e});_.each(_.groupBy(c.images,"author"),function(b,
c){var e=d(c);e.images+=_.size(b);a[c]=e});_.each(_.groupBy(c.multiWordTexts,"author"),function(b,c){d(c);_.each(b,function(b){var d=r(b);a[c].texts[b.identity]=d})});_.each(_.groupBy(c.quizResponses,"author"),function(b,c){var e=d(c);e.quizResponses+=_.size(b);a[c]=e});f=a;h()};Progress.conversationDetailsReceived.participants=u;Progress.newConversationDetailsReceived.participants=u;return{getParticipants:function(){return Conversations.shouldModifyConversation()?f:{}},reRender:function(){h()},code:function(c){return _.keys(f).indexOf(c)}}}();
