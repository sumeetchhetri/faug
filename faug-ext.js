function FaugExtensionFactory(Faug) {
	var locale;
	var dateLibHonourLocale;
	var curr;
	
	this.registerLocale = function(locale) {
		this.locale = locale;
		this.locale = this.locale?this.locale:"en";
	};
	
	this.registerCurrency = function(currency) {
		this.curr = curr;
	};
	
	this.setInitCompleteCb = function(cb) {
		return false;
	};
	
	this.getDateLib = function(honourLocale) {
		dateLibHonourLocale = honourLocale;
		if(dateLibHonourLocale===true) {
			return "resources/moment-with-locales.min.js";
		}
		return "resources/moment.min.js";
	};
	
	this.initDateLib = function(vars) {
		if(dateLibHonourLocale===true) {
			moment.locale(locale);
		}
		return [moment.localeData().longDateFormat('L'), moment.localeData().longDateFormat('LTS')];
	};
	
	this.formatDate = function(d, fmt) {
		return moment(Faug.is('Date', d)?d:new Date()).format(fmt);
	};
	
	this.parseDate = function(ds, fmt) {
		return moment(ds, fmt).toDate(); 
	};
	
	this.getNumCurrLib = function() {
	};
	
	this.initNumCurrLib = function(vars) {
	};
	
	this.formatNumber = function(n, currency) {
	};

	this.parseNumber = function(ds) {
	};
	
	this.getUnitLib = function() {
	};
	
	this.initUnitLib = function(vars) {
	};
	
	this.getDateTimePickerLib = function(honourLocale) {
		return "resources/jquery.datetimepicker.js";
	};
	
	this.initDateTimePickerLib = function(vars) {
	};
	
	this.getIntlLib = function() {
		return ["resources/i18next.min.js", "resources/i18nextXHRBackend.min.js"];
	};
	
	this.initIntlLib = function(vars) {
		if(vars) {
			i18next.init({debug:!1, lng:locale, resources: vars});
		} else {
			i18next.use(i18nextXHRBackend).init({debug:!1, lng:locale});
		}
	};
	
	this.translate = function(key) {
		return i18next.t(key);
	};
	
	this.getDateFormats = function() {
		return {dateformat: "YYYY-MM-DD", datetimeformat: "YYYY-MM-DD HH:mm:ss", timeformat: "HH:mm:ss", timestampformat: "X"};
	};
	
	this.decorateDateTimePicker = function(ele, fmt, val, showTime) {
		ele.datetimepicker({format: fmt, step:1, validateOnBlur: false, value: val, timepicker: showTime});
	};
	
	this.configureDateTimePicker = function(ele, config, faugIntFunc, event, fmt, val, showTime) {
		var tconfig = $.extend(true, {}, config);
		if(tconfig["callbacks"]) {
			for(var cbn in tconfig["callbacks"]) {
				if(tconfig["callbacks"].hasOwnProperty(cbn) && cbn.toLowerCase().indexOf("on")==0) {
					var tcbctrlev = tconfig["callbacks"][cbn];
					var tcb = function(tcbctrlev, event, autoClose) {
						return function(current_time, $input, event)
						{
							faugIntFunc(tcbctrlev)(event, $input, [current_time]);
							if(!autoClose) {
								autoClose = true;
							}
							if(autoClose) {
								$input.datetimepicker('hide');
							}
						};
					}(tcbctrlev, event, tconfig["autoClose"]);
					tconfig[cbn] = tcb;
				}
			}
			tconfig["callbacks"] = undefined;
		}
		if(fmt && !tconfig["format"]) {
			tconfig["format"] = fmt;
		}
		if(val && !tconfig["value"]) {
			tconfig["value"] = val;
		}
		if(showTime!==undefined && !tconfig["timepicker"]) {
			tconfig["timepicker"] = showTime;
		}
		ele.datetimepicker(tconfig);
	};
	
	this.getDialogLib = function() {
		return "resources/bootbox.min.js";
	};
	
	this.initDialogLib = function() {
	};
	
	this.getDialog = function(ctrlev, faugIntFunc)
	{
		if(!ctrlev["alert"] && !ctrlev["confirm"] && !ctrlev["prompt"] && !ctrlev["dialog"])return undefined;
		
		return function(event, thsele)
		{
			var type, status = true;
			if(ctrlev["alert"]) {
				type = "alert";
			} else if(ctrlev["confirm"]) {
				type = "confirm";
			} else if(ctrlev["prompt"]) {
				type = "prompt";
			} else if(ctrlev["dialog"]) {
				type = "dialog";
			}
			
			var bbcnf;
			
			if(Faug.is('Object', ctrlev[type])) {
				bbcnf = ctrlev[type];
			} else if(Faug.is('String', ctrlev[type])) {
				bbcnf = {};
				bbcnf["message"] = ctrlev[type];
			}
			
			if(!bbcnf) {
				return undefined;
			}
			
			if(type!="alert" && bbcnf["status"]) {
				status = bbcnf["status"];
			}
			
			var flag = false;
			if(ctrlev[type]["callbacks"]) {
				status = undefined;
				for(var buttonName in ctrlev[type]["callbacks"]) {
					if(ctrlev[type]["callbacks"].hasOwnProperty(buttonName) && bbcnf["buttons"] && bbcnf["buttons"][buttonName]) {
						var tcbctrlev = ctrlev[type]["callbacks"][buttonName];
						var tcb = function(tcbctrlev, event, thsele, status) {
							return function(result)
							{
								if(event && !thsele) {
									thsele = event.currentTarget;
								}
								if((status && result == status) || !status) {
									faugIntFunc(tcbctrlev)(event, thsele, [result]);
								}
							};
						}(tcbctrlev, event, thsele, status);
						bbcnf["buttons"][buttonName]["callback"] = tcb;
						flag = true;
					}
				}
				ctrlev[type]["callbacks"] = undefined;
			}
			
			if(!flag) {
				bbcnf["callback"] = function(ctrlev, event, thsele, status) {
					return function(result)
					{
						if(event && !thsele) {
							thsele = $(event.currentTarget);
						}
						if((status && result == status) || !status) {
							faugIntFunc(ctrlev)(event, thsele, [result]);
						}
					};
				}(ctrlev, event, thsele, status);
			}
			
			bootbox[type](bbcnf);
		};
	};
	
	this.getDialogConfirm = function(msg, func) {
		bootbox.confirm(msg, func);
	};
	
	this.getDialogAlert = function(msg, func) {
		bootbox.alert(msg, func);
	};
	
	this.getTemplateEngineLib = function() {
	};
	
	this.initTemplateEngineLib = function() {
	};
	
	/*
	 * The default template engine
	 */
	this.templateEngine = function(html, options, retFunc, isVarFromOptions) {
		if(!html) {
			if(retFunc) {
				return Function.apply(null, ["arg", "return '';"]);
			} else {
				return Function.apply(null, ["arg", "return '';"]).apply(null, [options]);
			}
		}
		
		isVarFromOptions = (!isVarFromOptions)?false:true;
		var re = /<%(.*?)%>/g, reExp = /^#(.*)/g, reExpr = /^#(.*)/g, code = '', cursor = 0, match;
		var mulre = /##([\s\S]*?)##/g;
		var incre = /!!([a-zA-Z0-9_\-\.\s\/()]+)!!/g;
		var varnamere = /^[^a-zA-Z_$]|[^\\w$]/;
		
		var nhtml = '';
		while(match = mulre.exec(html)) {
			nhtml += html.slice(cursor, match.index);
			var htmlines = match[1].split("\n");
			for(var i=0;i<htmlines.length;i++)
			{
				if(htmlines[i].trim()!="") {
					nhtml += "#" + htmlines[i] + "\n";
				}
			}
			cursor = match.index + match[0].length;
		}
		nhtml += html.substr(cursor, html.length - cursor);
		cursor = 0;
		html = nhtml;
		
		var add = function(line, js) {
			if(line!="")
			{
				var isvar = line.trim().match(reExpr);
				var tl = line;
				if(!isvar) {
					if(incre.test(line)) {
						code += line + '\n';
					} else if(js && isVarFromOptions && varnamere.test(tl) && options.hasOwnProperty(tl)) {
						line = 'arg["' + tl + '"]';
						code += isvar ? (line + '\n') : ('____r_____.push(' + line + ');\n');
					} else {
						line = js?tl:('"'+tl.replace(/"/g, '\\"')+'"');
						code += isvar ? (line + '\n') : ('____r_____.push(' + line + ');\n');
					}
				}
				else if(incre.test(line)) {
					code += line + '\n';
				} else {
					code += isvar ? (line + '\n') : ('____r_____.push(' + line + ');\n');
				}
				incre.lastIndex = 0;
			}
			return add;
		};
		var htmlines = html.split("\n");
		for(var i=0;i<htmlines.length;i++)
		{
			cursor = 0;
			var htm = htmlines[i];
			while(match = re.exec(htm)) {
				add(htm.slice(cursor, match.index))(match[1], true);
				cursor = match.index + match[0].length;
			}
			add(htm.substr(cursor, htm.length - cursor));
		}
		
		var addf = function(line, js) {
			if(line!='') {
				if(js || incre.test(line)) {
					code += line + '\n';
				} else {
					if(line.indexOf('____r_____.push(')==0) {
						code += line + "\n";
					} else {
						code += '____r_____.push("' + line.replace(/"/g, '\\"') + '");\n';
					}
				}
				incre.lastIndex = 0;
			}
			return addf;
		};
		var ncode = code, code = '';
		htmlines = ncode.split("\n");
		for(var i=0;i<htmlines.length;i++)
		{
			cursor = 0;
			var htm = htmlines[i].trim();
			while(match = reExp.exec(htm)) {
				addf(htm.slice(cursor, match.index), false)(match[1], true);
				cursor = match.index + match[0].length;
			}
			addf(htm.substr(cursor, htm.length - cursor), false);
		}
		var fcode = 'var ____r_____=[];\n';
		if(!isVarFromOptions)
		{
			for(var k in options) {
				if(options.hasOwnProperty(k)) {
					fcode += 'var ' + k + '=' + 'arg["'+k+'"];\n';
				}
			}
		}
		
		var addI = function(line, ismatch) {
			if(line!="")
			{
				if(ismatch) {
					line = line.trim();
					var cmps = line.split(" ");
					code += "var _exttargs = {};\n";
					line = cmps[0];
					for(var i=1;i<cmps.length;i++) {
						var t = cmps[i].trim();
						if(t.indexOf("(")==0 && t.indexOf(")")==t.length-1) {
							t = t.substr(1, t.length-2);
						}
						t = t.trim();
						if(t!="") {
							code += 'if(typeof('+t+') !== "undefined")_exttargs["'+t+'"] = '+t+';\n';
						}
					}
					code += ('____r_____.push(Faug.includeTemplate(\"' + line.trim() + '\", _exttargs));\n');
				} else {
					code += line + '\n';
				}
			}
			return addI;
		};
		var ncode = code, code = '';
		htmlines = ncode.split("\n");
		for(var i=0;i<htmlines.length;i++)
		{
			cursor = 0;
			var htm = htmlines[i];
			while(match = incre.exec(htm)) {
				addI(htm.slice(cursor, match.index))(match[1], true);
				cursor = match.index + match[0].length;
			}
			addI(htm.substr(cursor, htm.length - cursor));
		}
		
		code = fcode + code + 'return ____r_____.join("");\n';
		code = code.replace(/[\r\t\n]/g, '');
		if(retFunc) {
			return Function.apply(null, ["arg", code]);
		} else {
			return Function.apply(null, ["arg", code]).apply(null, [options]);
		}
	};
	
	return this;
};
