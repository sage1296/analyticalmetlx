var Conversation=function(){function d(){try{if(void 0!=c&&"jid"in c&&"slides"in c){var a=0,b=_.map($(".slideId"),function(b){var d=parseInt($(b).text());b=_.find(c.slides,function(a){return a.id==d?!0:!1});"groupSets"in b||(b.groupSets=[]);b.index=a;a+=1;return b});reorderSlidesOfCurrentConversation(c.jid.toString(),b);h=!1;e()}}catch(t){console.log("exception while reordering slides",t)}}var c={},f=[],n="",p={},k={},q={},l={},r={},h=!1,m=function(){h?p.show():p.hide();_.forEach($(".slideContainer"),
function(a){var b=$(a),c=$(b).next(".slideContainer"),d=$(b).prev(".slideContainer");a=b.find(".moveSlideBack");var e=b.find(".moveSlideForward");a.unbind("click");e.unbind("click");0==c.length?e.hide():(e.show(),e.on("click",function(){h=!0;b.detach();c.after(b);m()}));0==d.length?a.hide():(a.show(),a.on("click",function(){h=!0;b.detach();d.before(b);m()}))})},e=function(){l.html(_.map(_.sortBy(c.slides,"index"),function(a){var b=r.clone();b.find(".slideId").text(a.id);b.find(".slideIndex").text(a.index);
b.find(".slideAnchor").attr("href",sprintf("board?conversationJid=%s&slideId=%s&unique=true",c.jid.toString(),a.id.toString())).find(".slideThumbnail").attr("src",sprintf("/thumbnail/%s",a.id));b.find(".addSlideBeforeButton").on("click",function(){addSlideToConversationAtIndex(c.jid.toString(),a.index);e()});b.find(".duplicateSlideButton").on("click",function(){duplicateSlideById(c.jid.toString(),a.id);e()});b.find(".addSlideAfterButton").on("click",function(){addSlideToConversationAtIndex(c.jid.toString(),
a.index+1);e()});return b}));$("#sortableRoot").sortable({handle:".slideDragHandle",stop:function(a,b){h=!0;m()}}).disableSelection();"deleted"==c.subject?($("#unarchiveChallenge").show(),$("#archiveChallenge").hide(),$("#sharingContainer").hide()):($("#unarchiveChallenge").hide(),$("#archiveChallenge").show(),$("#sharingContainer").show());$(".conversationJid").text(c.jid);$(".conversationAuthor").text(c.author);$(".conversationCreated").text((new Date(c.creation)).toString());$(".conversationLastModified").text((new Date(c.lastAccessed)).toString());
$("#conversationTitleInput").val(c.title);$(".joinConversation").attr("href",sprintf("/board?conversationJid=%s&unique=true",c.jid));console.log("usergroups",f);k.html(_.map(_.groupBy(_.uniqBy(_.concat(f,[{ouType:"special",name:c.subject}]),"name"),function(a){return a.ouType}),function(a){var b=q.clone();b.find(".conversationSharingChoiceContainer").clone();var d=b.find(".conversationSharingChoiceContainer");b.find(".conversationSharingCategory").text(a[0].ouType);var h=d.find(".conversationSharingChoice").clone();
d.html(_.map(a,function(a){var b=_.uniqueId(),d=h.clone();d.find(".conversationSharingChoiceInputElement").attr("id",b).attr("type","radio").on("click",function(){"foreignRelationship"in a?changeSubjectOfConversation(c.jid.toString(),a.name,a.foreignRelationship.system,a.foreignRelationship.key):changeSubjectOfConversation(c.jid.toString(),a.name);e()}).prop("checked",c.subject==a.name);d.find(".conversationSharingChoiceLabel").attr("for",b).text(a.name);return d}));var f=!1,g=b.find(".conversationSharingCollapser").addClass(a[0].ouType);
g.on("click",function(){d.toggle();(f=!f)?(g.addClass("fa-toggle-right"),g.removeClass("fa-toggle-down")):(g.addClass("fa-toggle-down"),g.removeClass("fa-toggle-right"))});_.some(a,function(a){return a.name==c.subject})?(f=!0,d.show(),g.addClass("fa-toggle-right"),g.removeClass("fa-toggle-down")):(f=!1,d.hide(),g.addClass("fa-toggle-down"),g.removeClass("fa-toggle-right"));return b}));m()};$(function(){p=$("#reorderInProgress");k=$(".conversationSharing");q=k.find(".conversationSharingCategoryContainer").clone();
k.empty();l=$("#sortableRoot");r=l.find(".slideContainer").clone();l.empty();$("#reorderSlides").on("click",function(){d()});$("#cancelReorderSlides").on("click",function(){h=!1;e()});$(".backToConversations").attr("href","/conversationSearch");$("#conversationTitleInput").on("blur",function(){var a=$(this).val();renameConversation(c.jid.toString(),a)}).keyup(function(a){13==a.which&&(a.preventDefault(),a=$(this).val(),renameConversation(c.jid.toString(),a))});$("#archiveChallenge").on("click",function(){$.jAlert({type:"confirm",
confirmQuestion:"Are you sure you want to archive this conversation?  It will not be available in the application.  Participants' content will become unavailable.",confirmBtnText:"Archive",onConfirm:function(a,b){a.preventDefault();deleteConversation(c.jid.toString());window.location.href="/conversationSearch"},denyBtnText:"Cancel",onDeny:function(a,b){a.preventDefault()}})});$("#unarchiveChallenge").on("click",function(){$.jAlert({type:"confirm",confirmQuestion:"Are you sure you want to unarchive this conversation?  It will be unarchived, but set to share only with you.  If you wish to share this conversation with other participants, remember to change the sharing to an appropriate level.",
confirmBtnText:"Unarchive",onConfirm:function(a,b){a.preventDefault();changeSubjectOfConversation(c.jid.toString(),n)},denyBtnText:"Cancel",onDeny:function(a,b){a.preventDefault()}})});$("#duplicateChallenge").on("click",function(){$.jAlert({type:"confirm",confirmQuestion:"Are you sure you want to duplicate this conversation?  Only your content will be duplicated.  Content from other participants will not be duplicated.",confirmBtnText:"Duplicate",onConfirm:function(a,b){a.preventDefault();duplicateConversation(c.jid.toString())},
denyBtnText:"Cancel",onDeny:function(a,b){a.preventDefault()}})});e()});return{receiveUserGroups:function(a){f=a;e()},receiveUsername:function(a){n=a},receiveConversationDetails:function(a){c=a;e()},getConversationDetails:function(){return c},getUsername:function(){return n},getUserGroups:function(){return f}}}();function augmentArguments(d){d[_.size(d)]=(new Date).getTime();return d}function serverResponse(d){}function receiveUsername(d){Conversation.receiveUsername(d)}
function receiveUserGroups(d){Conversation.receiveUserGroups(d)}function receiveConversationDetails(d){Conversation.receiveConversationDetails(d)}function receiveNewConversationDetails(d){console.log("new conversation received")};
