importScripts("resources/plainAjax.js");
addEventListener('message', function(e) {
	var apiArr = e.data;
	var meth = apiArr[0], url = apiArr[1], contType = apiArr[2], content = apiArr[3], 
		vheaders = apiArr[4], sfunc = apiArr[5], efunc = apiArr[6], spars = apiArr[7], 
		epars = apiArr[8], cache = apiArr[9], isAsync = false;
	var result = [];
	var su = function(jqXhr) {
		var data = jqXhr.responseType=="json"?jqXhr.response:undefined;
		if(!data) {
			try
			{
				data = JSON.parse(jqXhr.responseText);
			}
			catch (err)
			{
				data = jqXhr.responseText;
			}
		}
		if(sfunc)
		{
			if(spars) {
				spars.push(data);
			} else {
				spars = [data];
			}
		}
		result.push(true);
		result.push(sfunc);
		result.push(spars);
		postMessage(result);
	};
	var er = function(jqXhr) {
		var data = jqXhr.responseType=="json"?jqXhr.response:undefined;
		if(!data) {
			try
			{
				data = JSON.parse(jqXhr.responseText);
			}
			catch (err)
			{
				data = jqXhr.responseText;
			}
		}
		if(efunc)
		{
			if(epars) {
				epars.unshift(data);
			} else {
				epars = [data];
			}
		}
		result.push(false);
		result.push(efunc);
		result.push(epars);
		postMessage(result);
	};
	ajaxCall(meth, url, contType, content, vheaders, isAsync, su, er);
}, false);