/* jQuery.head - v1.0.3a - K Reeve aka BinaryKitten
*
*	makes a Head Request via XMLHttpRequest (ajax) and returns an object/array of headers returned from the server
*	$.head(url, [data], [callback])
*		url			The url to which to place the head request
*		data		(optional) any data you wish to pass - see $.post and $.get for more info
*		callback	(optional) Function to call when the head request is complete.
*					This function will be passed an object containing the headers with
*					the object consisting of key/value pairs where the key is the header name and the
*					value it's corresponding value
*
*	for discussion and info please visit: http://binarykitten.me.uk/jQHead
*
* ------------ Version History -----------------------------------
* v1.0.3b
* 	STH: Sten Hougaard, http://www.netsi.dk/
*   2010-11-8
*   - Fixed bug in MSIE where header was undefined key
*   - Changed to "push(..)" for adding headers to array
* v1.0.3a
* 	STH: Sten Hougaard, http://www.netsi.dk/
*   - head method:
*     Added extra headers to the "headers" returned:
*     'status', 'multipart', 'withCredentials'
*   NEW method added: exists(url, callback)
*     If the URL exists (no 404 status is returned) it returns true
* v1.0.3
* 	Fixed the zero-index issue with the for loop for the headers
* v1.0.2
* 	placed the function inside an enclosure
*
* v1.0.1
* 	The 1st version - based on $.post/$.get
*/

(function ($) {
  $.extend({
    /* STH: 2010-09-17, Added method "exists" which takes an URL and a callback function.
    If the URL exists (no 404 status is returned) it returns true */
    exists: function (url, callback) {
      /// <summary>Given a URL pointing to a file, this function will call the callback function with true if the file exists, otherwise the callback function will get false as parameter.</summary>
      /// <summary>NOTE: Cross domain scripting is not allowed, so if you specify an url which is not the same domain as where the page is located you will not get a valid result.</summary>
      /// <param name="url" type="String">An URL pointing to a file</param>
      /// <param name="callback" type="function">A callback function which will be called with true|false depending if the file exists</param>
      $.head(url, {}, function (headers) {
        if ($.isFunction(callback)) {
          callback(headers['status'] != '404');
        }
      });
    },
    head: function (url, data, callback) {
      if ($.isFunction(data)) {
        callback = data;
        data = {};
      }

      return $.ajax({
        type: "HEAD",
        url: url,
        data: data,
        complete: function (XMLHttpRequest, textStatus) {
          try {
            var headers = XMLHttpRequest.getAllResponseHeaders().split("\n");
            var extraHeaders = ['status', 'multipart', 'withCredentials'];
            var iEHl = extraHeaders.length;
            for (var iEH = 0; iEH < iEHl; iEH++) {
              var sHeader = extraHeaders[iEH];
              try {
                /* STH: 2010-09-17, Extended so that status is also returned */
                headers.push(sHeader + ': ' + XMLHttpRequest[sHeader]);
              } catch (e) {
                // Okay - just ignore, header not here
              }
            };

            var new_headers = {};
            var l = headers.length;
            for (var key = 0; key < l; key++) {
              if (headers[key].length > 1) {
                header = headers[key].split(": ");
                new_headers[header[0]] = header[1];
              }
            }
            if ($.isFunction(callback)) {
              callback(new_headers);
            }
          } catch (e) {
            alert('Error in jQuery.head: ' + e.Message + '\nAre you using URL outside your current domain?');
          }
        }
      });
    }
  });
})(jQuery);
