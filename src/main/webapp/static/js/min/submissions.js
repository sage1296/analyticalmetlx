var Submissions=function(){var c={},k={},l={},h={},d=[],e={};$(function(){c=$("#submissionListing");k=c.find(".submissionSummary").clone();h=$("#currentSubmission");l=h.find(".submissionContainer").clone();c.empty();$("#submissions").click(function(){showBackstage("submissions")});var a=$("<div />",{id:"submissionCount","class":"icon-txt"});$("#feedbackStatus").prepend(a);a.click(function(){showBackstage("submissions")});m()});var m=function(){var a=_.size(_.filter(d,f));0<a?1==a?($("#submissionCount").text(sprintf("%s submission",
a)),$("#dedicatedSubmissionCount").text("This conversation has 1 submission")):($("#submissionCount").text(sprintf("%s submissions",a)),$("#dedicatedSubmissionCount").text(sprintf("This conversation has %s submissions",a))):($("#submissionCount").text(""),$("#dedicatedSubmissionCount").text(sprintf("This conversation has %s submissions",a)))},f=function(a){return Conversations.shouldModifyConversation()||a.author.toLowerCase()==UserSettings.getUsername().toLowerCase()},n=function(){d=[];e={};$("#submissionCount").text("")},
q=function(){c.empty();_.filter(d,f).map(function(a){t(a)});h.html(p(e));m()},t=function(a){if("type"in a&&"submission"==a.type){var b=k.clone();c.append(b);b.find(".submissionDescription").text(sprintf("submitted by %s at %s %s",a.author,(new Date(a.timestamp)).toDateString(),(new Date(a.timestamp)).toLocaleTimeString()));b.find(".submissionImageThumb").attr("src",sprintf("/submissionProxy/%s/%s/%s",Conversations.getCurrentConversationJid(),a.author,a.identity));b.find(".viewSubmissionButton").attr("id",
sprintf("viewSubmissionButton_%s",a.identity)).on("click",function(){e=a;h.html(p(e))})}},p=function(a){var b=$("<div />");if("type"in a&&"submission"==a.type)if(b=l.clone(),b.attr("id",sprintf("submission_%s",a.identity)),b.find(".submissionDescription").text(sprintf("submitted by %s at %s",a.author,a.timestamp)),b.find(".submissionImage").attr("src",sprintf("/submissionProxy/%s/%s/%s",Conversations.getCurrentConversationJid(),a.author,a.identity)),Conversations.shouldModifyConversation())b.find(".displaySubmissionOnNextSlide").on("click",
function(){addSubmissionSlideToConversationAtIndex(Conversations.getCurrentConversationJid(),Conversations.getCurrentSlide().index+1,a.identity)});else b.find("submissionTeacherControls").hide();return b},r=function(a,b){try{"target"in a&&"submission"==a.target&&f(a)&&(d.push(a),b||q())}catch(g){console.log("Submissions.stanzaReceivedFunction",g)}};Progress.onConversationJoin.Submissions=n;Progress.historyReceived.Submissions=function(a){try{"type"in a&&"history"==a.type&&(n(),_.forEach(a.submissions,
function(a){r(a,!0)}),q())}catch(b){console.log("Submissions.historyReceivedFunction",b)}};return{getAllSubmissions:function(){return _.filter(d,f)},getCurrentSubmission:function(){return e},processSubmission:r,sendSubmission:function(){WorkQueue.pause();var a=$("<canvas />"),b=board[0].width,g=board[0].height;a.width=b;a.height=g;a.attr("width",b);a.attr("height",g);a.css({width:b,height:g});var c=a[0].getContext("2d");c.fillStyle="white";c.fillRect(0,0,b,g);c.drawImage(board[0],0,0,b,g);var a=a[0].toDataURL("image/jpeg",
.4),d=(new Date).getTime(),e=UserSettings.getUsername(),h=Conversations.getCurrentSlide().id,b=Conversations.getCurrentConversation().jid,f=sprintf("submission%s%s.jpg",e,d.toString()),k=sprintf("%s:%s:%s",b,f,d),b=sprintf("/uploadDataUri?jid=%s&filename=%s",b.toString(),encodeURI(k));$.ajax({url:b,type:"POST",success:function(a){a=$(a).find("resourceUrl").text();a={audiences:[],author:e,blacklist:[],identity:k,privacy:Privacy.getCurrentPrivacy(),slide:h,target:"submission",timestamp:d,title:f,type:"submission",
url:a};console.log(a);sendStanza(a);WorkQueue.gracefullyResume();successAlert("submission sent","your submission has been sent to the instructor")},error:function(a){console.log(a);errorAlert("Submission failed","This image cannot be processed, either because of image protocol issues or because it exceeds the maximum image size.");WorkQueue.gracefullyResume()},data:a,cache:!1,contentType:!1,processData:!1})},requestServerSideSubmission:function(){if("Conversations"in window){var a=Conversations.getCurrentConversation(),
b=Conversations.getCurrentSlideJid();"jid"in a&&submitScreenshotSubmission(a.jid.toString(),b)}}}}();
