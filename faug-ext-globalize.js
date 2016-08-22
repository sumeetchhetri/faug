function FaugExtensionFactory(Faug) {
	var locale;
	var dateLibHonourLocale;
	var gI;
	var cb;
	var curr;
	
	this.registerLocale = function(plocale) {
		locale = plocale;
		locale = locale?locale:"en";
	};
	
	this.registerCurrency = function(pcurr) {
		curr = pcurr;
	};
	
	this.setInitCompleteCb = function(pcb) {
		cb = pcb;
		return true;
	};
	
	this.getDateLib = function(honourLocale) {
		dateLibHonourLocale = honourLocale;
		return ["resources/cldr/cldr.js", "resources/cldr/event.js", "resources/cldr/supplemental.js", 
		        "resources/globalize/globalize.js", "resources/globalize/number.js", "resources/globalize/plural.js",
		        "resources/globalize/currency.js", "resources/globalize/date.js", "resources/globalize/message.js", 
		        "resources/globalize/relative-time.js", "resources/globalize/unit.js"];
	};
	
	this.initDateLib = function(vars) {
	};
	
	this.formatDate = function(d, fmt) {
		fmt = Faug.is('Object')?fmt:{raw: fmt};
		if(fmt.raw.indexOf("D")!=-1) {
			fmt.raw = fmt.raw.replace(/D/g, "d");
		}
		d = (Faug.is('Date', d)?d:new Date());
		var rt = gI.formatDate(d, fmt);
		if(fmt.raw.indexOf("t")!=-1) {
			var l = (fmt.raw.match(/Dt/ig) || []).length;
			for(var i=0;i<l;i++) {
				rt = rt.replace("t", nth(d.getDate()));
			}
		}
		return rt;
	};
	
	function nth(d) {
	  if(d>3 && d<21) return 'th'; // thanks kennebec
	  switch (d % 10) {
	        case 1:  return "st";
	        case 2:  return "nd";
	        case 3:  return "rd";
	        default: return "th";
	    }
	};
	
	this.parseDate = function(ds, fmt) {
		fmt = Faug.is('Object')?fmt:{raw: fmt};
		if(fmt.raw.indexOf("D")!=-1) {
			fmt.raw = fmt.raw.replace(/D/g, "d");
		}
		if(fmt.raw.indexOf("Y")!=-1) {
			fmt.raw = fmt.raw.replace(/Y/g, "y");
		}
		return gI.parseDate(ds.substring(0, fmt.raw.length), fmt);
	};
	
	this.getNumCurrLib = function() {
	};
	
	this.initNumCurrLib = function(vars) {
	};
	
	this.formatNumber = function(n, currency, options) {
		if(currency) {
			return gI.formatCurrency(n, currency, options);
		} else {
			return gI.formatNumber(n, options);
		}
	};

	this.parseNumber = function(ds, options) {
		return gI.parseNumber(ds, options);
	};
	
	this.getUnitLib = function() {
	};
	
	this.initUnitLib = function(vars) {
	};
	
	this.formatUnit = function(v, unit, options) {
		return gI.formatUnit(v, unit, options);
	};
	
	this.getDateTimePickerLib = function(honourLocale) {
		return "resources/jquery.datetimepicker.js";
	};
	
	this.initDateTimePickerLib = function(vars) {
	};
	
	this.getIntlLib = function() {
	};
	
	this.initIntlLib = function(vars) {
		var cldrFiles = [["resources/data/cldr/supplemental/likelySubtags.json", "json", true],
		                 ["resources/data/cldr/main/"+locale+"/numbers.json", "json", true],
		                 ["resources/data/cldr/supplemental/numberingSystems.json", "json", true],
		                 ["resources/data/cldr/supplemental/plurals.json", "json", true],
		                 ["resources/data/cldr/supplemental/ordinals.json", "json", true],
		                 ["resources/data/cldr/main/"+locale+"/currencies.json", "json", true],
		                 ["resources/data/cldr/supplemental/currencyData.json", "json", true],
		                 ["resources/data/cldr/main/"+locale+"/ca-gregorian.json", "json", true],
		                 ["resources/data/cldr/main/"+locale+"/timeZoneNames.json", "json", true],
		                 ["resources/data/cldr/supplemental/timeData.json", "json", true],
		                 ["resources/data/cldr/supplemental/weekData.json", "json", true],
		                 ["resources/data/cldr/main/"+locale+"/dateFields.json", "json", true],
		                 ["resources/data/cldr/main/"+locale+"/units.json", "json", true]];
		if(!vars) {
			cldrFiles.push(["resources/data/"+locale+"/translation.json", "json", true]);
		}
		var cldrFileData = [,,,,,,,,,,,,];
		var func = function(data) {
			for(var i=0;i<cldrFiles.length;i++) {
				if(cldrFiles[i][0]==data[0]) {
					cldrFileData[i] = JSON.parse(data[1]);
				}
			}
		};
		$.fetchMultipleFiles(cldrFiles, func).done(function() {
			for(var i=0;i<cldrFileData.length;i++) {
				if(!vars && i==cldrFileData.length-1) {
					break;
				}
				Cldr.load(cldrFileData[i]);
			}
			if(!vars) {
				Globalize.loadMessages(cldrFileData[cldrFileData.length-1]);
			} else {
				Globalize.loadMessages(vars);
			}
			gI = Globalize(locale);
			if(cb) {
				cb();
			}
		}).fail(function(error) {
			alert("Problem loading globalize cldr data files");
		});
	};
	
	this.translate = function(key) {
		try{
			return gI.formatMessage(key);
		} catch(err) {
			return key;
		}
	};
	
	this.getDateFormats = function() {
		return {dateformat: "YYYY-MM-DD", datetimeformat: "YYYY-MM-DD HH:mm:ss", timeformat: "HH:mm:ss", timestampformat: { skeleton: "X" }};
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
