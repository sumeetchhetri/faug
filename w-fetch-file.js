importScripts("resources/plainAjax.js");
addEventListener('message', function(e) {
	var fileArr = e.data;
	for(var i=0;i<fileArr.length;i++)
	{
		var scr = fileArr[i];
		var url = scr[0];
		var dataType = scr.length>1?scr[1]:"";
		if(dataType=='') {
			if(/\.json/.test(scr[0])) {
				dataType = "json";
			} else if(/\.html/.test(scr[0])) {
				dataType = "html";
			} else if(/\.js/.test(scr[0])) {
				dataType = "script";
			}
		}
		var cache = scr.length>2?scr[2]:true;
		var suer = function(jqXhr) {
			postMessage([url, jqXhr.responseText, dataType, scr.slice(3)]);
		};
		ajaxCall("GET", url, null, null, null, false, suer, suer);
	}
	postMessage(1);
}, false);