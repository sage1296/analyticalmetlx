var renderOffsetX=0,renderOffsetY=0,loadSlidesAtNativeZoom,startMark,requestedViewboxX=0,requestedViewboxY=0,requestedViewboxWidth=320,requestedViewboxHeight=240;function loadSlide(a){startMark=Date.now();$("#targetSlide").text(sprintf("Loading %s",a));showSpinner();moveToSlide(a.toString())}
function receiveHistory(a,c,b){try{var e=void 0==c?boardContext:c;Date.now();a.multiWordTexts=_.pickBy(a.multiWordTexts,isUsable);a.images=_.pickBy(a.images,isUsable);a.inks=_.pickBy(a.inks,isUsable);boardContent=a;boardContent.minX=0;boardContent.minY=0;boardContent.maxX=boardWidth;boardContent.maxY=boardHeight;viewboxWidth=boardContent.maxX-boardContent.minX;viewboxHeight=boardContent.maxY-boardContent.minY;$.each(boardContent.inks,function(a,b){prerenderInk(b,!0)});Date.now();$.each(boardContent.highlighters,
function(a,b){prerenderInk(b,!0)});Date.now();$.each(boardContent.texts,function(a,b){isUsable(b)?prerenderText(b):delete boardContent.texts[b.id]});$.each(boardContent.videos,function(a,b){prerenderVideo(b)});Date.now();_.each(boardContent.multiWordTexts,function(a){isUsable(a)?prerenderMultiwordText(a):console.log("Not usable",a)});Date.now();boardContent.width=boardContent.maxX-boardContent.minX;boardContent.height=boardContent.maxY-boardContent.minY;var f=function(){Date.now();Progress.call("historyReceived",
[a]);Date.now();Infinity==boardContent.minX&&(boardContent.minX=0);Infinity==boardContent.minY&&(boardContent.minY=0);loadSlidesAtNativeZoom?(requestedViewboxY=requestedViewboxX=0,requestedViewboxWidth=boardWidth,requestedViewboxHeight=boardHeight):(requestedViewboxX=boardContent.minX,requestedViewboxY=boardContent.minY,requestedViewboxWidth=boardContent.width,requestedViewboxHeight=boardContent.height);IncludeView["default"]();hideBackstage();clearBoard(e,{x:0,y:0,w:boardWidth,h:boardHeight});blit();
Date.now();UserSettings.getIsInteractive()||zoomToFit();void 0!=b&&b()};if(0==_.keys(boardContent.images).length)_.defer(f);else{var d=0,g=_.keys(boardContent.images).length;$.each(boardContent.images,function(a,b){b.bounds=[b.x,b.y,b.x+b.width,b.y+b.height];incorporateBoardBounds(b.bounds);var c=new Image;b.imageData=c;var e=calculateImageSource(b,!0);c.onload=function(a){a=!1;0==b.width&&(b.width=c.naturalWidth,a=!0);0==b.height&&(b.height=c.naturalHeight,a=!0);a&&(b.bounds=[b.x,b.y,b.x+b.width,
b.y+b.height],incorporateBoardBounds(b.bounds));d+=1;prerenderImage(b);d>=g&&_.defer(f)};c.onerror=function(a){console.log("Data image load error",b,a);--g;console.log(sprintf("Preloaded %s/%s images",d,g));d>=g&&_.defer(f)};c.src=e})}}catch(h){console.log("receiveHistory exception",h)}}var lineDrawingThreshold=25;
function incorporateBoardBounds(a){isNaN(a[0])||(boardContent.minX=Math.min(boardContent.minX,a[0]));isNaN(a[1])||(boardContent.minY=Math.min(boardContent.minY,a[1]));isNaN(a[2])||(boardContent.maxX=Math.max(boardContent.maxX,a[2]));isNaN(a[3])||(boardContent.maxY=Math.max(boardContent.maxY,a[3]));boardContent.width=boardContent.maxX-boardContent.minX;boardContent.height=boardContent.maxY-boardContent.minY}
function mergeBounds(a,c){var b={};b.minX=Math.min(a[0],c[0]);b.minY=Math.min(a[1],c[1]);b.maxX=Math.max(a[2],c[2]);b.maxY=Math.max(a[3],c[3]);b.width=b.maxX-b.minX;b.height=b.maxY-b.minY;b.centerX=b.minX+b.width/2;b.centerY=b.minY+b.height/2;b[0]=b.minX;b[1]=b.minY;b[2]=b.maxX;b[3]=b.maxY;return b}var boardLimit=1E4;
function isUsable(a){var c=!_.some(a.bounds,function(a){return isNaN(a)}),b="size"in a?!isNaN(a.size):!0,e="text"in a?0<a.text.length:!0,f=_.map(Conversations.getCurrentGroup(),"id"),d=_.isEmpty(a.audiences)||Conversations.isAuthor()||_.some(a.audiences,function(a){return"whitelist"==a.action&&_.includes(f,a.name)}),g=a.author==UserSettings.getUsername();a=_.some(a.audiences,function(a){return"direct"==a.action&&a.name==UserSettings.getUsername()});return c&&b&&e&&(g||a||d)}
function usableStanzas(){return _.map(boardContent.multiWordTexts).map(function(a){return{identity:a.identity,usable:isUsable(a)}})}var leftPoint=function(a,c,b,e,f,d){return{x:c*b*d+e,y:a*b*-d+f}},rightPoint=function(a,c,b,e,f,d){return{x:c*b*-d+e,y:a*b*d+f}},determineCanvasConstants=_.once(function(){var a=DeviceConfiguration.getCurrentDevice(),c=32767,b=32767;"browser"!=a&&("iPad"==a?b=c=6144:"iPhone"==a?b=c=2048:"IE9"==a&&(b=c=8192));return{x:c,y:b}});
function determineScaling(a,c){var b=a,e=c,f=1,d=1,g=determineCanvasConstants(),h=g.x,g=g.y;a>h&&(f=h/a,b=a*f,d=f,e=c*f);e>g&&(d=g/e,e*=d,f=d,b*=d);return{width:b,height:e,scaleX:f,scaleY:d}}
function prerenderInk(a,c){if(!isUsable(a))return a.identity in boardContent.inks&&delete boardContent.inks[a.identity],a.identity in boardContent.highlighters&&delete boardContent.highlighters[a.identity],!1;calculateInkBounds(a);c&&incorporateBoardBounds(a.bounds);var b="PRIVATE"==a.privacy.toUpperCase(),e=determineScaling(a.bounds[2]-a.bounds[0]+a.thickness,a.bounds[3]-a.bounds[1]+a.thickness),f=$("<canvas />",{width:e.width,height:e.height})[0];a.canvas=f;var d=f.getContext("2d");f.width=e.width;
f.height=e.height;var g=a.points,f=[],h,l,k;for(k=0;k<g.length;k+=3)f.push(g[k]*e.scaleX),f.push(g[k+1]*e.scaleY),f.push(g[k+2]/256);var g=-1*(a.minX-a.thickness/2)*e.scaleX,m=-1*(a.minY-a.thickness/2)*e.scaleY,e=a.thickness*e.scaleX;if(b){b=f[0]+g;h=f[1]+m;d.lineWidth=e;d.lineCap="round";d.strokeStyle="red";d.globalAlpha=.3;d.moveTo(b,h);for(k=0;k<f.length;k+=3)d.beginPath(),d.moveTo(b,h),b=f[k]+g,h=f[k+1]+m,l=e*f[k+2],d.lineWidth=l+2,d.lineTo(b,h),d.stroke();d.globalAlpha=1}d.strokeStyle=a.color[0];
d.fillStyle=a.color[0];b=f[0]+g;h=f[1]+m;d.beginPath();d.moveTo(b,h);l=e*f[2];d.arc(b,h,l/2,0,2*Math.PI);d.fill();d.lineCap="round";for(k=0;k<f.length;k+=3)d.beginPath(),d.moveTo(b,h),b=f[k+0]+g,h=f[k+1]+m,l=e*f[k+2],d.lineWidth=l,d.lineTo(b,h),d.stroke();return!0}function alertCanvas(a,c){var b=a.toDataURL();window.open(b,c,sprintf("width=%s, height=%s",a.width,a.height))}var precision=Math.pow(10,3),round=function(a){return Math.round(a*precision)/precision};
function calculateImageBounds(a){a.bounds=[a.x,a.y,a.x+a.width,a.y+a.height]}function calculateVideoBounds(a){a.bounds=[a.x,a.y,a.x+a.width,a.y+a.height]}function urlEncodeSlideName(a){return btoa(a)}function calculateImageSource(a){var c="PRIVATE"==a.privacy.toUpperCase()?sprintf("%s%s",a.slide,a.author):a.slide;return sprintf("/proxyImageUrl/%s?source=%s",urlEncodeSlideName(c),encodeURIComponent(a.source.trim()))}
function calculateVideoSource(a){var c="PRIVATE"==a.privacy.toUpperCase()?sprintf("%s%s",a.slide,a.author):a.slide;return sprintf("/videoProxy/%s/%s",urlEncodeSlideName(c),encodeURIComponent(a.identity.trim()))}function calculateTextBounds(a){a.bounds=[a.x,a.y,a.x+a.width,a.y+a.runs.length*a.size*1.25]}
function calculateInkBounds(a){var c=Infinity,b=Infinity,e=-Infinity,f=-Infinity,d=[],g=a.points,h=a.thickness/2,l=a.thickness/2;if(6==g.length)c=g[0]-h,e=g[0]+h,b=g[1]-l,f=g[1]+l,d.push(g[2]);else for(var k=0;k<g.length;k+=3){var m=round(g[k]),p=round(g[k+1]);g[k]=m;g[k+1]=p;d.push(g[k+2]);c=Math.min(m-h,c);b=Math.min(p-l,b);e=Math.max(m+h,e);f=Math.max(p+l,f)}a.minX=c;a.minY=b;a.maxX=e;a.maxY=f;a.width=e-c;a.height=f-b;a.centerX=c+h;a.centerY=b+l;a.bounds=[c,b,e,f];a.widths=d}
function scale(){return Math.min(boardWidth/viewboxWidth,boardHeight/viewboxHeight)}function prerenderMultiwordText(a){var c=Modes.text.editorFor(a).doc;c.load(a.words);c.updateCanvas();incorporateBoardBounds(a.bounds)}
function prerenderImage(a){var c=$("<canvas/>")[0];a.canvas=c;c.width=a.width;c.height=a.height;var b=.1*c.width,e=.1*c.height;c.width=a.width+b;c.height=a.height+e;var f=c.getContext("2d");f.drawImage(a.imageData,b/2,e/2,a.width,a.height);"PRIVATE"==a.privacy.toUpperCase()&&(f.globalAlpha=.2,f.fillStyle="red",f.fillRect(0,0,c.width,c.height),f.globalAlpha=1);delete a.imageData}
function prerenderVideo(a){if(!("video"in a)){var c=$("<video/>",{src:calculateVideoSource(a)});a.video=c[0];a.getState=function(){return{paused:c[0].paused,ended:c[0].ended,currentTime:c[0].currentTime,duration:c[0].duration,muted:c[0].muted,volume:c[0].volume,readyState:c[0].readyState,played:c[0].played,buffered:c[0].buffered,playbackRate:c[0].playbackRate,loop:c[0].loop}};a.seek=function(b){c[0].currentTime=Math.min(c[0].duration,Math.max(0,b));c[0].paused&&a.play()};a.muted=function(a){void 0!=
a&&(c[0].muted=a);return c[0].muted};a.play=function(){var b=function(){if(a.video.paused||a.video.ended)return!1;requestAnimationFrame(function(){blit();b()});return!0};a.video.addEventListener("play",function(){b()},!1);(a.video.paused||a.video.ended)&&a.video.play()};a.destroy=function(){a.video.removeAttribute("src");a.video.load()};a.pause=function(){a.video.paused||a.video.pause()}}"bounds"in a||calculateVideoBounds(a)}
function prerenderText(a){function c(a){var b=a.font;"bold"==a.weight&&(b+=" bold");"italic"==a.style&&(b+=" italic");return b}var b=$("<canvas />")[0];a.canvas=b;var e=b.getContext("2d");e.strokeStyle=a.color;e.font=a.font;var f=/\n/;a.width||(a.width=Math.max.apply(Math,a.text.split(f).map(function(a){return e.measureText(a).width})));var d="",g=[],h=!1;$.each(a.text.split(""),function(b,c){c.match(f)?(g.push(""+d),d=""):h&&" "==c?(g.push(d),d=""):(h=e.measureText(d).width>=a.width-80,d+=c)});g.push(d);
g=g.map(function(a){return a.trim()});a.runs=g;calculateTextBounds(a);var l=a.bounds[3]-a.bounds[1],k=determineScaling(a.bounds[2]-a.bounds[0],l);b.width=k.width;b.height=k.height;a.height=l;"PRIVATE"==a.privacy.toUpperCase()&&(e.globalAlpha=.2,e.fillStyle="red",e.fillRect(0,0,k.width,k.height),e.globalAlpha=1);e.fillStyle=a.color[0];e.textBaseline="top";$.each(a.runs,function(b,d){var f=function(){var b=_.range(a.size,a.height,a.height/(a.height/(1.25*a.size)));_.each(b,function(b){e.beginPath();
e.strokeStyle=a.color[0];b=contentOffsetY+b;e.moveTo(contentOffsetX,b);e.lineTo(contentOffsetX+k.width,b);e.stroke()})},g=b*a.size*1.25;e.font=c(a);e.fillText(d,contentOffsetX*k.scaleX,(contentOffsetY+g)*k.scaleY,k.width);"underline"==a.decoration&&f()});incorporateBoardBounds(a.bounds)}
var boardContent={images:{},highlighters:{},texts:{},multiWordTexts:{},inks:{},themes:[]},pressureSimilarityThreshold=32,viewboxX=0,viewboxY=0,viewboxWidth=80,viewboxHeight=60,contentOffsetX=0,contentOffsetY=0,boardWidth=0,boardHeight=0,visibleBounds=[],renders={},renderInks=function(a,c,b,e){void 0!=a&&$.each(a,function(a,d){try{intersectRect(d.bounds,e)&&(drawInk(d,c),b.push(d))}catch(g){console.log("ink render failed for",g,d.canvas,d.identity,d)}})},renderRichTexts=function(a,c,b,e){a&&$.each(a,
function(a,c){c.doc&&(c.bounds||c.doc.invalidateBounds(),intersectRect(c.bounds,e)&&(drawMultiwordText(c),b.push(c)))})},renderVideos=function(a,c,b,e){a&&(Modes.clearCanvasInteractables("videos"),$.each(a,function(a,d){intersectRect(d.bounds,e)&&(drawVideo(d,c),Modes.pushCanvasInteractable("videos",videoControlInteractable(d)),b.push(d))}))},renderCanvasInteractables=function(a){_.each(Modes.canvasInteractables,function(c){_.each(c,function(b){void 0!=b&&"render"in b&&(a.save(),a.lineWidth=1,b.render(a),
a.restore())})})},renderTexts=function(a,c,b){$.each(a,function(a,f){intersectRect(f.bounds,b)&&(drawText(f,canvasContext),c.push(f))})},renderImmediateContent=function(a,c,b,e){renderVideos(c.videos,a,b,e);renderInks(c.highlighters,a,b,e);renderTexts(c.texts,b,e);renderRichTexts(c.multiWordTexts,a,b,e);renderInks(c.inks,a,b,e);Progress.call("postRender")},renderSelectionOutlines=function(a){a.save();a.lineWidth=1;var c=[];_.forEach(Modes.select.selected,function(b){_.forEach(b,function(b){b=b.bounds;
var d=worldToScreen(b[0],b[1]),e=worldToScreen(b[2],b[3]);c.push([d,e]);b&&(a.setLineDash([5]),a.strokeStyle="blue",a.strokeRect(d.x,d.y,e.x-d.x,e.y-d.y))})});var b=Modes.select.totalSelectedBounds();0<c.length&&(a.strokeStyle="blue",a.strokeWidth=3,a.strokeRect(b.tl.x,b.tl.y,b.br.x-b.tl.x,b.br.y-b.tl.y));a.restore()},renderContentIdentification=function(a,c){a.save();if(Modes.select.isAdministeringContent()){var b=_.groupBy(c,"author");_.each(b,function(b,c){var d=_.reduce(_.map(b,"bounds"),mergeBounds),
g=worldToScreen(d[0],d[1]);a.strokeStyle="black";a.lineWidth=.1;_.each(b,function(b){a.beginPath();a.moveTo(g.x,g.y);b=worldToScreen(b.bounds[0],b.bounds[1]);a.lineTo(b.x,b.y);a.stroke()});a.fillStyle="black";a.fillRect(g.x-3,g.y,a.measureText(c).width+6,14);a.fillStyle="white";a.fillText(c,g.x,g.y+10)})}a.restore()},renderSelectionGhosts=function(a){var c=Modes.select.marqueeWorldOrigin;if(Modes.select.dragging){a.save();scale();var c=worldToScreen(Modes.select.offset.x-c.x,Modes.select.offset.y-
c.y),b=worldToScreen(0,0);a.translate(c.x-b.x,c.y-b.y);a.globalAlpha=.7;_.forEach(Modes.select.selected,function(b,c){_.forEach(b,function(b){switch(c){case "images":drawImage(b,a);break;case "videos":drawVideo(b,a);break;case "texts":drawText(b,a);break;case "multiWordTexts":drawMultiwordText(b);break;case "inks":drawInk(b,a)}})});a.restore()}else if(Modes.select.resizing){var c=Modes.select.totalSelectedBounds(),e=(Modes.select.offset.x-c.x)/(c.x2-c.x),f=(Modes.select.offset.y-c.y)/(c.y2-c.y),d=
function(b,c,d){a.save();a.globalAlpha=.7;a.translate(b,c);a.scale(e,f);a.translate(-b,-c);d();a.restore()},g=function(){};_.forEach(Modes.select.selected,function(b,c){_.forEach(b,function(b){var f=b.bounds,h=worldToScreen(f[0],f[1]),n=h.x,h=h.y;switch(c){case "images":d(n,h,function(){drawImage(b,a)});break;case "videos":d(n,h,function(){drawVideo(b,a)});break;case "texts":d(n,h,function(){drawText(b,a)});break;case "multiWordTexts":Modes.select.aspectLocked?d(n,h,function(){drawMultiwordText(b,
a)}):(a.save(),a.translate(n,h),a.globalAlpha=.7,n=scale(),a.scale(n,n),n=carota.editor.create({querySelector:function(){return{addEventListener:g}},handleEvent:g},a,g,_.cloneDeep(b)),n.position={x:f[0],y:f[1]},n.load(b.doc.save()),delete n.canvas,n.documentRange(),f=Math.max(b.doc.width()*e,Modes.text.minimumWidth/scale()),n.width(f),n.updateCanvas(),carota.editor.paint(board[0],n),a.restore());break;case "inks":d(n,h,function(){drawInk(b,a)})}})})}},renderImages=function(a,c,b,e){$.each(a,function(a,
d){try{intersectRect(d.bounds,e)&&(drawImage(d,c),b.push(d))}catch(g){console.log("image render failed for",g,d.identity,d)}})};
function render(a,c,b,e){c=Math.floor(new Date/1E3);renders[c]||(renders[c]=0);renders[c]++;try{var f=(new Date).getTime();b=b||boardContext;if(a){Date.now();try{e=void 0==e?[viewboxX,viewboxY,viewboxX+viewboxWidth,viewboxY+viewboxHeight]:e,visibleBounds=[],c=[],Object.keys(a.images),clearBoard(b,{x:0,y:0,w:boardWidth,h:boardHeight}),renderImages(a.images,b,c,e),renderImmediateContent(b,a,c,e),renderSelectionOutlines(b),renderSelectionGhosts(b),renderContentIdentification(b,c),renderCanvasInteractables(b),
renderTint(b,{x:0,y:0,w:boardWidth,h:boardHeight})}catch(d){console.log("Render exception",d)}Progress.call("onViewboxChanged")}"HealthChecker"in window&&HealthChecker.addMeasure("render",!0,(new Date).getTime()-f)}catch(d){throw console.log(d),"HealthChecker"in window&&HealthChecker.addMeasure("render",!1,(new Date).getTime()-f),d;}}var blit=function(a,c){try{render(void 0==c?boardContent:c,!1,void 0==a?boardContext:a)}catch(b){console.log("exception in render:",b)}};
function pica(a){return a/128}function unpica(a){return Math.floor(128*a)}function px(a){return sprintf("%spx",a)}function unpix(a){return a.slice(0,a.length-2)}function updateConversationHeader(){$("#heading").text(Conversations.getCurrentConversation().title);var a=$("#currentGroupTitle").empty(),c=Conversations.getCurrentGroup();c.length&&a.text(sprintf("Group %s of",_.join(_.map(c,"title"),",")))}
function renderTint(a,c){if("HealthCheckViewer"in window&&!HealthCheckViewer.healthy()){var b=void 0==c?{x:0,y:0,w:boardWidth,h:boardHeight}:c;a.save();a.fillStyle="rgba(255, 0, 0, 0.1)";a.fillRect(b.x,b.y,b.w,b.h);a.restore()}}function clearBoard(a,c){try{var b=void 0==c?{x:0,y:0,w:boardWidth,h:boardHeight}:c;(void 0==a?boardContext:a).clearRect(b.x,b.y,b.w,b.h)}catch(e){console.log("exception while clearing board:",e,a,c)}}
var IncludeView=function(){var a=function(a,b,e,f,d){var g=!1,h=a;void 0==h?h=requestedViewboxX:(g=!0,requestedViewboxX=h);var l=b;void 0==l?l=requestedViewboxY:(g=!0,requestedViewboxY=l);var k=e;void 0==k?k=requestedViewboxWidth:(g=!0,requestedViewboxWidth=k);var m=f;void 0==m?m=requestedViewboxHeight:(g=!0,requestedViewboxHeight=m);h=Zoom.constrainRequestedViewbox({width:k,height:m,x:h,y:l});k=boardHeight/h.height;m=boardWidth/h.width;m>k?(l=h.height,k=h.width*m/k):(l=h.height/m*k,k=h.width);d=
_.every([a,b,e,f],function(a){return void 0==a})||d;TweenController.zoomAndPanViewbox(h.x,h.y,k,l,void 0,!g,d);Progress.call("onViewboxChanged")};return{specific:function(c,b,e,f,d){return a(c,b,e,f,d)},"default":function(){return a()}}}();
