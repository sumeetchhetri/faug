var Number2Words = function(number) {
	// Author		: Harish Narayanan
	// Date 		: 15 May 2015
	// Description 	: Code to convert number to words
	// Update		: 16 May 2015 - re-wrote code to utilize higher order functions and arrays effectively

	var ones_teens 	= ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 
						'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
	var tens 		= ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
	var scales 		= ['', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion', 
						'Sextillion', 'Septillion', 'Octillion', 'Nonillion', 'Decillion'];

	function toWords(n) {	
		var line;
		if (isNaN(n) || n > 999) { return null; }

		if (n === 0) { line = ""; }
		else if (n < 20) { line = ones_teens[n]; }
		else if (n < 100) {
			line = tens[(n / 10) | 0]; 
			if (n%10) {
				line += " " + ones_teens[n % 10];
			}
		} else { line = ones_teens[(n / 100) | 0] + " Hundred " + toWords(n % 100); }

		return line.trim();
	}

	function chunkify(n) {
		var numbers = [];
		if (n > Number.MAX_SAFE_INTEGER) { return numbers; }
		while (n > 0) {
			numbers[numbers.length] = n % 1000;
			n = Math.floor(n / 1000);
		}
		return numbers;
	}

	function scalify(item, index) {
		if (item) {return item + " " + scales[index];}
		return "";
	}

	function notEmpty(item) {
		return !!item; // using double ! returns boolean value. !!item is not same as item.
	}
	
	return function(n) {
	    var asString =  chunkify(n*1).map(toWords).map(scalify).filter(notEmpty).reverse().join(" ");
	    if (n < 0) {
	        asString = "negative " + asString;
	    }
	    return asString;
	}(number);
};