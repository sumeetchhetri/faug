var Number2Words = function(number) {
	var ones_teens = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
	var tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
	var bigs = ['Crore', 'Lakh', 'Thousand', 'Hundred'];
	
	function nw(n) {
	  var tn = n*1;
	  var stn = tn+"";
	  var len = stn.length;
	  var parts = [];
	  while(len>0) {
	    //console.log(stn);
	    if(len>7) {      
	      var t = stn.substring(0, len-7);
	      stn = stn.substring(len-7);      
	      parts = nw(t).concat(parts);
	      parts.push(bigs[0]);
	    } else {
	      if(len==7 || len==6) {
	        var hm = len==7?2:1;
	        var np = stn.substring(0,hm);
	        if(np*1>0) {
	          if(hm==2) {
	            if(np*1>19) {
	              parts.push(tens[np[0]*1]);
                  if(np[1]*1>0) { 
	                parts.push(ones_teens[np[1]*1]);
                  }
	            } else {
	              parts.push(ones_teens[np*1]);          
	            }
	          } else {
	            parts.push(ones_teens[np[0]]);
	          }          
	          parts.push(bigs[1]);
	        }
	        stn = stn.substring(hm);
	      } else if(len==5 || len==4) {
	        var hm = len==5?2:1;
	        var np = stn.substring(0,hm);
	        if(np*1>0) {
	          if(hm==2) {
	            if(np*1>19) {
	              parts.push(tens[np[0]*1]);
                  if(np[1]*1>0) { 
	                parts.push(ones_teens[np[1]*1]);
                  }
	            } else {
	              parts.push(ones_teens[np*1]);          
	            }
	          } else {
	            parts.push(ones_teens[np[0]]);
	          } 
	          parts.push(bigs[2]);
	        }
	        stn = stn.substring(hm);
	      } else if(len==3) {
	        var hm = 1;
	        var np = stn.substring(0,hm)*1;
	        if(np>0) {
	          parts.push(ones_teens[np]);
	          parts.push(bigs[3]);
	        }
	        stn = stn.substring(hm);
	      } else if(len>1) {
	        var hm = 2;
	        var np = stn.substring(0,hm);
            if(np*1>0) {
	          if(np*1>19) {
	            parts.push(tens[np[0]*1]);
                if(np[1]*1>0) { 
	              parts.push(ones_teens[np[1]*1]);
                }
	          } else {
	            parts.push(ones_teens[np*1]);          
	          }
            }
	        stn = stn.substring(hm);
	      } else {
            if(stn*1>0) {
	          parts.push(ones_teens[stn]);
            }
	        stn = "";
	      }
	    }
	    len = stn.length;
	    //console.log(len);
	  }
	  //console.log(parts.join(" "));
	  return parts;
	}
	
	return function(n) {
	  n = n.toFixed(2);
	  var isneg = false;
	  if(n<0) {
		  isneg = true;
		  n *= -1;
	  }
	  var dp = (n+"").split(".");
	  var pr = nw(dp[0]);
	  var p1 = "";
	  //console.log(dp[1]);
	  if(dp.length>1 && dp[1]*1>0) {
	    p1 = pr.join(" ");
	    p1 += /*" and" + */ " " + nw(dp[1]).join(" ") + " paise";
	  } else {
        //console.log(pr);
	    //pr.splice(pr.length-1, 0, "and");
	    p1 = pr.join(" ");
	  }
	  //console.log(p1);
      if(p1.endsWith("and ")) {
        p1 = p1.substring(0, p1.length-5);
      }
	  return Fg.g("currency_Indian") + p1.replace(/\s+/g, ' ');
	}(number);
};