var renderOffsetX=0,renderOffsetY=0,loadSlidesAtNativeZoom,startMark,requestedViewboxX=0,requestedViewboxY=0,requestedViewboxWidth=320,requestedViewboxHeight=240;function loadSlide(a){startMark=Date.now();$("#targetSlide").text(sprintf("Loading %s",a));showSpinner();moveToSlide(a.toString())}
function receiveHistory(a,c,b){try{var f=void 0==c?boardContext:c;console.log(a);Date.now();boardContent=a;boardContent.minX=0;boardContent.minY=0;boardContent.maxX=boardWidth;boardContent.maxY=boardHeight;$.each(boardContent.inks,function(a,b){prerenderInk(b)});Date.now();$.each(boardContent.highlighters,function(a,b){prerenderInk(b)});Date.now();$.each(boardContent.texts,function(a,b){isUsable(b)?prerenderText(b):delete boardContent.texts[b.id]});$.each(boardContent.videos,function(a,b){prerenderVideo(b)});
Date.now();_.each(boardContent.multiWordTexts,function(a,b){Modes.text.editorFor(a).doc.load(a.words);incorporateBoardBounds(a.bounds)});Date.now();boardContent.width=boardContent.maxX-boardContent.minX;boardContent.height=boardContent.maxY-boardContent.minY;var g=function(){Date.now();Progress.call("historyReceived",[a]);Date.now();Infinity==boardContent.minX&&(boardContent.minX=0);Infinity==boardContent.minY&&(boardContent.minY=0);loadSlidesAtNativeZoom?(requestedViewboxY=requestedViewboxX=0,requestedViewboxWidth=
boardWidth,requestedViewboxHeight=boardHeight):(requestedViewboxX=boardContent.minX,requestedViewboxY=boardContent.minY,requestedViewboxWidth=boardContent.width,requestedViewboxHeight=boardContent.height);IncludeView["default"]();hideBackstage();clearBoard(f,{x:0,y:0,w:boardWidth,h:boardHeight});blit();Date.now();UserSettings.getIsInteractive()||zoomToFit();void 0!=b&&b()};if(0==_.keys(boardContent.images).length)_.defer(g);else{var d=0,e=_.keys(boardContent.images).length;$.each(boardContent.images,
function(a,b){b.bounds=[b.x,b.y,b.x+b.width,b.y+b.height];incorporateBoardBounds(b.bounds);var c=new Image;b.imageData=c;var l=calculateImageSource(b,!0);c.onload=function(a){a=!1;0==b.width&&(b.width=c.naturalWidth,a=!0);0==b.height&&(b.height=c.naturalHeight,a=!0);a&&(b.bounds=[b.x,b.y,b.x+b.width,b.y+b.height],incorporateBoardBounds(b.bounds));d+=1;prerenderImage(b);d>=e&&_.defer(g)};c.onerror=function(a){console.log("Data image load error",b,a);--e;console.log(sprintf("Preloaded %s/%s images",
d,e));d>=e&&_.defer(g)};c.src=l})}}catch(h){console.log("receiveHistory exception",h)}}var lineDrawingThreshold=25;
function incorporateBoardBounds(a){isNaN(a[0])||(boardContent.minX=Math.min(boardContent.minX,a[0]));isNaN(a[1])||(boardContent.minY=Math.min(boardContent.minY,a[1]));isNaN(a[2])||(boardContent.maxX=Math.max(boardContent.maxX,a[2]));isNaN(a[3])||(boardContent.maxY=Math.max(boardContent.maxY,a[3]));boardContent.width=boardContent.maxX-boardContent.minX;boardContent.height=boardContent.maxY-boardContent.minY}
function mergeBounds(a,c){var b={};b.minX=Math.min(a[0],c[0]);b.minY=Math.min(a[1],c[1]);b.maxX=Math.max(a[2],c[2]);b.maxY=Math.max(a[3],c[3]);b.width=b.maxX-b.minX;b.height=b.maxY-b.minY;b.centerX=b.minX+b.width/2;b.centerY=b.minY+b.height/2;b[0]=b.minX;b[1]=b.minY;b[2]=b.maxX;b[3]=b.maxY;return b}var boardLimit=1E4;function isUsable(a){var c=!_.some(a.bounds,function(a){return isNaN(a)||a>boardLimit||a<-boardLimit}),b="size"in a?!isNaN(a.size):!0;a="text"in a?0<a.text.length:!0;return c&&b&&a}
var leftPoint=function(a,c,b,f,g,d){return{x:c*b*d+f,y:a*b*-d+g}},rightPoint=function(a,c,b,f,g,d){return{x:c*b*-d+f,y:a*b*d+g}},renderHull=function(a){if(!(6>a.points.length)){var c=a.canvas.getContext("2d"),b=Infinity,f=Infinity,g=a.points,d=[],e,h;for(e=0;e<g.length;e+=3)b=Math.min(b,g[e]),f=Math.min(f,g[e+1]);b-=a.thickness/2;f-=a.thickness/2;for(e=0;e<g.length;e+=3)d.push(g[e]-b),d.push(g[e+1]-f),d.push(g[e+2]);var m,k,l,n,q,r,t,u,y,z,w,x,b=[],f=[];try{for(e=0;e<d.length-3;e+=3){q=d[e];r=d[e+
1];y=d[e+2];t=d[e+3];u=d[e+4];z=d[e+5];var g=t-q,p=u-r;if(0!=g&&0!=p){var v=1/Math.sqrt(g*g+p*p);w=a.thickness/y*64;x=a.thickness/z*64;m=leftPoint(g,p,v,t,u,x);k=rightPoint(g,p,v,t,u,x);l=leftPoint(-g,-p,v,q,r,w);n=rightPoint(-g,-p,v,q,r,w);b.push(n);b.push(m);f.push(l);f.push(k)}}c.fillStyle=a.color[0];c.globalAlpha=a.color[1]/255;c.beginPath();var A=b[0];c.moveTo(A.x,A.y);for(e=0;e<b.length;e++)h=b[e],c.lineTo(h.x,h.y);for(e=f.length-1;0<=e;e--)h=f[e],c.lineTo(h.x,h.y);c.fill();c.closePath()}catch(B){console.log("Couldn't render hull for",
a.points)}}},determineCanvasConstants=_.once(function(){var a=DeviceConfiguration.getCurrentDevice(),c=2147483647,b=2147483647;"browser"!=a&&("iPad"==a?b=c=6144:"iPhone"==a?b=c=2048:"IE9"==a&&(b=c=8192));return{x:c,y:b}});function determineScaling(a,c){var b=a,f=c,g=1,d=1,e=determineCanvasConstants(),h=e.x,e=e.y;a>h&&(g=h/a,b=a*g);c>e&&(d=e/c,f=c*d);return{width:b,height:f,scaleX:g,scaleY:d}}
function prerenderInk(a){if(!isUsable(a))return a.identity in boardContent.inks&&delete boardContent.inks[a.identity],a.identity in boardContent.highlighters&&delete boardContent.highlighters[a.identity],!1;calculateInkBounds(a);incorporateBoardBounds(a.bounds);var c=$("<canvas />")[0];a.canvas=c;var b=c.getContext("2d"),f=0,g="PRIVATE"==a.privacy.toUpperCase();g&&(f=3);var d=a.bounds[2]-a.bounds[0]+a.thickness+2*f,e=a.bounds[3]-a.bounds[1]+a.thickness+2*f,h=determineScaling(d,e);c.width=h.width;
c.height=h.height;$(c).css({width:px(d),height:px(e)});c=a.points;d=[];for(e=0;e<c.length;e+=3)d.push(c[e]*h.scaleX),d.push(c[e+1]*h.scaleY),d.push(c[e+2]);var m=-1*(a.minX-a.thickness/2-f)*h.scaleX,k=-1*(a.minY-a.thickness/2-f)*h.scaleY,l,n;if(g){l=d[0]+m;n=d[1]+k;b.lineWidth=a.thickness+f;b.strokeStyle=a.color[0];b.fillStyle=a.color[0];b.moveTo(l,n);b.beginPath();for(e=0;e<d.length;e+=3)b.moveTo(l,n),l=d[e]+m,n=d[e+1]+k,b.lineTo(l,n);b.lineCap="round";b.stroke();b.closePath();b.strokeStyle="white";
b.fillStyle="white"}else b.strokeStyle=a.color[0],b.fillStyle=a.color[0];l=d[0]+m;n=d[1]+k;b.moveTo(l,n);b.beginPath();l=d[0]+m;n=d[1]+k;_.each(_.chunk(d,3),function(c){b.beginPath();b.moveTo(l,n);l=c[0]+m;n=c[1]+k;b.lineTo(l,n);b.lineWidth=c[2]/256*a.thickness;b.lineCap="round";b.stroke()});return!0}function alertCanvas(a,c){var b=a.toDataURL();window.open(b,c,sprintf("width=%s, height=%s",a.width,a.height))}var precision=Math.pow(10,3),round=function(a){return Math.round(a*precision)/precision};
function calculateImageBounds(a){a.bounds=[a.x,a.y,a.x+a.width,a.y+a.height]}function calculateVideoBounds(a){a.bounds=[a.x,a.y,a.x+a.width,a.y+a.height]}function calculateImageSource(a){var c="PRIVATE"==a.privacy.toUpperCase()?sprintf("%s%s",a.slide,a.author):a.slide;return sprintf("/proxyImageUrl/%s?source=%s",c,encodeURIComponent(a.source))}function calculateTextBounds(a){a.bounds=[a.x,a.y,a.x+a.width,a.y+a.runs.length*a.size*1.25]}
function calculateInkBounds(a){for(var c=Infinity,b=Infinity,f=-Infinity,g=-Infinity,d=[],e=a.points,h=0;h<e.length;h+=3){var m=round(e[h]),k=round(e[h+1]);e[h]=m;e[h+1]=k;d.push(e[h+2]);c=Math.min(m,c);b=Math.min(k,b);f=Math.max(m,f);g=Math.max(k,g)}a.minX=c;a.minY=b;a.maxX=f;a.maxY=g;a.width=f-c;a.height=g-b;a.centerX=c+a.width/2;a.centerY=b+a.height/2;a.bounds=[c,b,f,g];a.widths=d}function scale(){return Math.min(boardWidth/viewboxWidth,boardHeight/viewboxHeight)}
function prerenderImage(a){var c=$("<canvas/>")[0];a.canvas=c;c.width=a.width;c.height=a.height;var b=.1*c.width,f=.1*c.height;c.width=a.width+b;c.height=a.height+f;var g=c.getContext("2d");g.drawImage(a.imageData,b/2,f/2,a.width,a.height);"PRIVATE"==a.privacy.toUpperCase()&&(g.globalAlpha=.2,g.fillStyle="red",g.fillRect(0,0,c.width,c.height),g.globalAlpha=1);delete a.imageData}
function prerenderVideo(a){if(!("video"in a)){var c=$("<video/>",{src:sprintf("/videoProxy/%s/%s",a.slide,a.identity)});a.video=c[0];a.getState=function(){return{paused:c[0].paused,ended:c[0].ended,currentTime:c[0].currentTime,duration:c[0].duration,muted:c[0].muted,volume:c[0].volume,readyState:c[0].readyState,played:c[0].played,buffered:c[0].buffered,playbackRate:c[0].playbackRate,loop:c[0].loop}};a.seek=function(b){c[0].currentTime=Math.min(c[0].duration,Math.max(0,b));c[0].paused&&a.play()};a.muted=
function(a){void 0!=a&&(c[0].muted=a);return c[0].muted};a.play=function(){var b=function(){if(a.video.paused||a.video.ended)return!1;requestAnimationFrame(function(){blit();b()})};a.video.addEventListener("play",function(){b()},!1);(a.video.paused||a.video.ended)&&a.video.play()};a.pause=function(){a.video.paused||a.video.pause()}}"bounds"in a||calculateVideoBounds(a)}
function prerenderText(a){function c(a){var b=a.font;"bold"==a.weight&&(b+=" bold");"italic"==a.style&&(b+=" italic");return b}var b=$("<canvas />")[0];a.canvas=b;var f=b.getContext("2d");f.strokeStyle=a.color;f.font=a.font;var g=/\n/;a.width||(a.width=Math.max.apply(Math,a.text.split(g).map(function(a){return f.measureText(a).width})));var d="",e=[],h=!1;$.each(a.text.split(""),function(b,c){c.match(g)?(e.push(""+d),d=""):h&&" "==c?(e.push(d),d=""):(h=f.measureText(d).width>=a.width-80,d+=c)});e.push(d);
e=e.map(function(a){return a.trim()});a.runs=e;calculateTextBounds(a);var m=a.bounds[3]-a.bounds[1],k=determineScaling(a.bounds[2]-a.bounds[0],m);b.width=k.width;b.height=k.height;a.height=m;"PRIVATE"==a.privacy.toUpperCase()&&(f.globalAlpha=.2,f.fillStyle="red",f.fillRect(0,0,k.width,k.height),f.globalAlpha=1);f.fillStyle=a.color[0];f.textBaseline="top";$.each(a.runs,function(b,d){var e=function(){var b=_.range(a.size,a.height,a.height/(a.height/(1.25*a.size)));_.each(b,function(b){f.beginPath();
f.strokeStyle=a.color[0];b=contentOffsetY+b;f.moveTo(contentOffsetX,b);f.lineTo(contentOffsetX+k.width,b);f.stroke()})},g=b*a.size*1.25;f.font=c(a);f.fillText(d,contentOffsetX*k.scaleX,(contentOffsetY+g)*k.scaleY,k.width);"underline"==a.decoration&&e()});incorporateBoardBounds(a.bounds)}
var boardContent={images:{},highlighters:{},texts:{},multiWordTexts:{},inks:{},themes:[]},pressureSimilarityThreshold=32,viewboxX=0,viewboxY=0,viewboxWidth=80,viewboxHeight=60,contentOffsetX=0,contentOffsetY=0,boardWidth=0,boardHeight=0,visibleBounds=[];
function render(a,c,b,f){try{var g=(new Date).getTime(),d=b||boardContext;if(a){Date.now();try{var e=void 0==f?[viewboxX,viewboxY,viewboxX+viewboxWidth,viewboxY+viewboxHeight]:f;visibleBounds=[];var h=function(a){void 0!=a&&$.each(a,function(a,b){try{intersectRect(b.bounds,e)&&drawInk(b,d)}catch(c){console.log("ink render failed for",c,b.canvas,b.identity,b)}})},m=function(a){a&&$.each(a,function(a,b){b.bounds||b.doc.invalidateBounds();intersectRect(b.bounds,e)&&drawMultiwordText(b)})},k=function(a){a&&
(Modes.clearCanvasInteractables("videos"),$.each(a,function(a,b){intersectRect(b.bounds,e)&&(drawVideo(b,d),Modes.pushCanvasInteractable("videos",videoControlInteractable(b)))}))};Object.keys(a.images);clearBoard(d,{x:0,y:0,w:boardWidth,h:boardHeight});Date.now();$.each(a.images,function(a,b){try{intersectRect(b.bounds,e)&&drawImage(b,d)}catch(c){console.log("image render failed for",c,b.identity,b)}});Date.now();(function(){k(a.videos);h(a.highlighters);Date.now();$.each(a.texts,function(a,b){intersectRect(b.bounds,
e)&&drawText(b,d)});Date.now();m(a.multiWordTexts);Date.now();h(a.inks);Date.now();Progress.call("postRender");Date.now()})();(function(){d.save();var a=[];_.forEach(Modes.select.selected,function(b){_.forEach(b,function(b){b=b.bounds;var c=worldToScreen(b[0],b[1]),e=worldToScreen(b[2],b[3]);a.push([c,e]);b&&(d.setLineDash([5]),d.strokeStyle="blue",d.strokeRect(c.x,c.y,e.x-c.x,e.y-c.y))})});var b=Modes.select.totalSelectedBounds();0<a.length&&(d.strokeStyle="blue",d.strokeWidth=3,d.strokeRect(b.tl.x,
b.tl.y,b.br.x-b.tl.x,b.br.y-b.tl.y));d.restore()})();(function(){var a=Modes.select.marqueeWorldOrigin;if(Modes.select.dragging){d.save();scale();var a=worldToScreen(Modes.select.offset.x-a.x,Modes.select.offset.y-a.y),b=worldToScreen(0,0);d.translate(a.x-b.x,a.y-b.y);d.globalAlpha=.7;_.forEach(Modes.select.selected,function(a,b){_.forEach(a,function(a){switch(b){case "images":drawImage(a,d);break;case "videos":drawVideo(a,d);break;case "texts":drawText(a,d);break;case "multiWordTexts":drawMultiwordText(a);
break;case "inks":drawInk(a,d)}})});d.restore()}else if(Modes.select.resizing){var a=Modes.select.totalSelectedBounds(),c=(Modes.select.offset.x-a.x)/(a.x2-a.x),e=(Modes.select.offset.y-a.y)/(a.y2-a.y),f=function(a,b,f){d.save();d.globalAlpha=.7;d.translate(a,b);d.scale(c,e);d.translate(-a,-b);f();d.restore()},g=function(){};_.forEach(Modes.select.selected,function(a,b){_.forEach(a,function(a){var e=a.bounds,h=worldToScreen(e[0],e[1]),k=h.x,h=h.y;switch(b){case "images":f(k,h,function(){drawImage(a,
d)});break;case "videos":f(k,h,function(){drawVideo(a,d)});break;case "texts":f(k,h,function(){drawText(a,d)});break;case "multiWordTexts":d.save();d.globalAlpha=.7;k=carota.editor.create({querySelector:function(){return{addEventListener:g}},handleEvent:g},d,g,_.cloneDeep(a));k.position={x:e[0],y:e[1]};k.load(a.doc.save());e=k.documentRange();k.select(e.start,e.end);Modes.select.aspectLocked&&Modes.text.scaleEditor(k,c);k.width(Math.max(a.doc.width()*c,Modes.text.minimumWidth/scale()));carota.editor.paint(board[0],
k);d.restore();break;case "inks":f(k,h,function(){drawInk(a,d)})}})})}})();(function(){_.each(Modes.canvasInteractables,function(a){_.each(a,function(a){void 0!=a&&"render"in a&&(d.save(),a.render(d),d.restore())})})})();Date.now()}catch(l){console.log("Render exception",l)}Progress.call("onViewboxChanged")}"HealthChecker"in window&&HealthChecker.addMeasure("render",!0,(new Date).getTime()-g)}catch(l){throw"HealthChecker"in window&&HealthChecker.addMeasure("render",!1,(new Date).getTime()-g),l;}}
function lightBlueGradient(a,c,b){a=a.createLinearGradient(0,0,0,b);a.addColorStop(0,"#F5FAFF");a.addColorStop(.61,"#D0DEEF");a.addColorStop(.4,"#CADAED");a.addColorStop(1,"#E7F2FF");return a}function monashBlueGradient(a,c,b){a=a.createLinearGradient(0,0,0,b);a.addColorStop(1,"#C5D5F6");a.addColorStop(.65,"#87ACF2");a.addColorStop(.6,"#7AA3F4");a.addColorStop(0,"#C5D5F6");return a}
var blit=function(a,c){try{render(void 0==c?boardContent:c,!1,void 0==a?boardContext:a)}catch(b){console.log("exception in render:",b)}};function pica(a){return a/128}function unpica(a){return Math.floor(128*a)}function px(a){return sprintf("%spx",a)}function unpix(a){return a.slice(0,a.length-2)}function updateConversationHeader(){$("#heading").text(Conversations.getCurrentConversation().title)}
function clearBoard(a,c){try{var b=void 0==c?{x:0,y:0,w:boardWidth,h:boardHeight}:c;(void 0==a?boardContext:a).clearRect(b.x,b.y,b.w,b.h)}catch(f){console.log("exception while clearing board:",f,a,c)}}
var IncludeView=function(){var a=function(a,b,f,g,d){var e=!1,h=a;void 0==h?h=requestedViewboxX:(e=!0,requestedViewboxX=h);var m=b;void 0==m?m=requestedViewboxY:(e=!0,requestedViewboxY=m);var k=f;void 0==k?k=requestedViewboxWidth:(e=!0,requestedViewboxWidth=k);var l=g;void 0==l?l=requestedViewboxHeight:(e=!0,requestedViewboxHeight=l);h=Zoom.constrainRequestedViewbox({width:k,height:l,x:h,y:m});k=boardHeight/h.height;l=boardWidth/h.width;l>k?(m=h.height,k=h.width*l/k):(m=h.height/l*k,k=h.width);d=
_.every([a,b,f,g],function(a){return void 0==a})||d;TweenController.zoomAndPanViewbox(h.x,h.y,k,m,void 0,!e,d);Progress.call("onViewboxChanged")};return{specific:function(c,b,f,g,d){return a(c,b,f,g,d)},"default":function(){return a()}}}();
