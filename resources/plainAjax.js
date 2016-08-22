function ajaxCall(meth, url, contType, content, vheaders, isAsync, sfunc, efunc) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
    	if (xmlhttp.readyState === 4) {
            if( xmlhttp.status >= 200 && xmlhttp.status < 400 ) {
            	sfunc(xmlhttp);
            } else if( xmlhttp.status >= 500 ) {
            	efunc(xmlhttp);
            } else if ( xmlhttp.status >= 402 && xmlhttp.status <= 420 ) {
            	efunc(xmlhttp);
            } else if( xmlhttp.status == 400 || xmlhttp.status == 401 ) {
            	efunc(xmlhttp);
            }
        }
    };
    xmlhttp.open(meth, url, isAsync);
    if(contType) {
    	xmlhttp.setRequestHeader('Content-Type', contType);
    }
    for(var hn in vheaders) {
    	if(vheaders.hasOwnProperty(hn)) {
    		xmlhttp.setRequestHeader(hn, vheaders[hn]);
    	}
    }
    xmlhttp.send(content?content:"");
}