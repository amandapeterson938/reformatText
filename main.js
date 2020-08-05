/* Function that if sqlFormat is requested it will show the div tag with id showMe that allows user to put prefix in front of in clause. */
function check_dd()
{
	if(document.getElementById('operator').value == "sqlFormat")
	{
		document.getElementById('showMe').style.display = 'block'; 
	}
	else
	{
		document.getElementById('showMe').style.display = 'none';  
	}
}
function calc() 
{
	//pass in input from reformat.html
	var a = document.querySelector("#value1").value;
	var op = document.querySelector("#operator").value; 
	
	//replace white space
	while(a.includes('\t'))
	{
		a = a.replace('\t', ' '); 
	}
	a = a.replace(/(\r\n|\n|\r)/gm, " ");
	a = a.replace(/\s/g, ' '); 
	a = a.replace("\n", " ");
	a = a.replace("\t", ""); 
	a = a.replace(/  +/g, ' ');
	
	
	//split text input to an array
	var userTextArray = a.replace("\\s+", " ").split(" ")
	
	//if there is white space in the beginning shift array up
	if(userTextArray[0] == "")
	{
		userTextArray.shift(); 
	}
	//if there is white space in the end pop end of array
	if(userTextArray[userTextArray.length-1] == "")
	{
		userTextArray.pop();
	}
	
	//where the output will go in to
	var finalArray = new Array(userTextArray.length); 
	//final array will be passed into this string to be the output on index.html
	var result = ""; 
	
	//if the user select java array it will put the input in the format of {"word", "word", ..., "word"}
	if(op == "Java Array")
	{
		var firstFormat = "{\"example\","
		var middleFormat = "\"example\","
		var lastFormat = "\"example\"}"
		
		
		finalArray[0] = firstFormat.replace("example", userTextArray[0]); 
		finalArray[userTextArray.length-1] = lastFormat.replace("example", userTextArray[userTextArray.length-1]); 
		
		if(userTextArray.length >= 3)
		{	
			var j; 
			for(j = 1;  j < (userTextArray.length-1); j++)
			{
			finalArray[j] = middleFormat.replace("example", userTextArray[j]);			
			}
		}
		
	}
	
	//if the user selects sql it will put the input in the format of in ('word', 'word', ..., 'word')
	//if user inputs over 1000 it will separate it with an or clause because of the maximum size in sql. 
	else if(op == "sqlFormat")
	{
		var firstFormat = "(\'example\',"
		var middleFormat = "\'example\',"
		var lastFormat = "\'example\')"
		
		//if greater than 1000 it will split into groups of 1000
		var maxAmount = 1000
		if(userTextArray.length > maxAmount)
		{
			//loopAmount is the number of times it needs to loop the max number of times
			//remainder is the remaining
			var remainder = userTextArray.length % maxAmount; 
			
			var loopAmount = Math.floor(userTextArray.length / maxAmount); 

			
			var userTextNumPull = 0; 
			
			var j; 
			for(j = 0; j < loopAmount; j++)
			{	
				finalArray[userTextNumPull] = firstFormat.replace("example", userTextArray[userTextNumPull]); 
				userTextNumPull++; 
				
				var h; 
				for(h = 1; h < (maxAmount - 1); h++)
				{
					finalArray[userTextNumPull] = middleFormat.replace("example", userTextArray[userTextNumPull]);
					userTextNumPull++; 
				}
				
				finalArray[userTextNumPull] = lastFormat.replace("example", userTextArray[userTextNumPull]); 
				userTextNumPull++; 
				
			}
			//if remainder one ('example')
			if(remainder == 1)
			{
				finalArray[userTextNumPull] = "(\'example\')".replace("example", userTextArray[userTextNumPull]); 
				userTextNumPull++; 
			}
			//if remainder two ('example', 'example')
			else if(remainder == 2)
			{
				finalArray[userTextNumPull] = firstFormat.replace("example", userTextArray[userTextNumPull]); 
				userTextNumPull++; 
				finalArray[userTextNumPull] = lastFormat.replace("example", userTextArray[userTextNumPull]); 
				userTextNumPull++; 
			}
			//if remainder is greater than three it will tackle the first one then the middle then the end. 
			else if(remainder >= 3)
			{
				finalArray[userTextNumPull] = firstFormat.replace("example", userTextArray[userTextNumPull]); 
				userTextNumPull++; 
				
				var i; 
				for(i = 1; i < (remainder -1); i++)
				{
					finalArray[userTextNumPull] = middleFormat.replace("example", userTextArray[userTextNumPull]);	
					userTextNumPull++; 
				}
				
				finalArray[userTextNumPull] = lastFormat.replace("example", userTextArray[userTextNumPull]); 
				userTextNumPull++; 
			}
			
				
			
		}
		//if the user input is less than 1000 words then it will be handled normally like in the Java Array but in the SQL format
		else
		{	if(userTextArray.length >= 2)
			{
				finalArray[0] = firstFormat.replace("example", userTextArray[0]); 
				finalArray[userTextArray.length-1] = lastFormat.replace("example", userTextArray[userTextArray.length-1]); 
		
				if(userTextArray.length >= 3)
				{		
					var j; 
					for(j = 1;  j < (userTextArray.length-1); j++)
					{
						finalArray[j] = middleFormat.replace("example", userTextArray[j]);			
					}
				}
			}
			else
			{
				finalArray[0] = "(\'example\')".replace("example", userTextArray[0]); 
			}
		}
	}

	
	
	if(op == "sqlFormat")
	{
		//left parenthesis surrounding entire SQL result
		result = result + "(" + "\n";  
		
		//get input from reformat.html
		var pre = document.querySelector("#inPrefix").value; 
		
		//loop that adds the appropriate parenthesis and adds finalArray to string result; 
		var i; 
		for(i =0; i < userTextArray.length; i++)
		{
			if(finalArray[i].includes("('"))
			{
				result = result + pre + " ";
			}
			if(finalArray[i].includes("')"))
			{
				if(i == (userTextArray.length -1))
				{
					result = result + finalArray[i];
				}
				else
				{
					result = result + finalArray[i] + "\nOR\n";
				}
			}
			else
			{
				result = result + finalArray[i] + " "; 
			}
		}
		result = result + "\n" + ")"; 
	}
	else //Since the user only has two options at the moment the default is to put it in Java Statements
	{
		var i; 
		for(i =0; i < userTextArray.length; i++)
		{
			result = result + finalArray[i] + " "; 
		}
	}

	//output the result
	var temp = document.getElementById('outputResult'); 
    temp.value = result; 
}


//Copy the output text box. 
function copy()
{
	let textarea = document.getElementById("outputResult");
	textarea.select(); 
	document.execCommand("copy"); 
}

