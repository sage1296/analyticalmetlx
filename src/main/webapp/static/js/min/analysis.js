var Analytics=function(){Chart.defaults.global.defaultFontColor="#FFF";var c=function(){var b={};d3.scaleLinear().range([8,25]);var d={};return{reset:function(){b={}},counts:function(){return b},stop:function(a){var b="a also am an and as are be do did done for in is it its it's i i'd of that the they them this was".split(" ");b.push(" ");var c=_.clone(a);_.each(b,function(a){delete c[a]});return c},pairs:function(a){return _.map(a,function(a,b){return{key:b,value:a}})},typo:function(){},incorporate:function(a){a=
a.replace(/[\W_]+/g,"");a in d||(a in b||(b[a]=0),b[a]++)},cloudData:function(){return _.sortBy(c.pairs(c.stop(c.counts())),function(a){return a.key})},cloud:function(a){WordCloud(c.cloudData(),_.extend({w:$("#lang").width(),h:$("#lang").height()},a))}}}();return{word:c}}();
