var characters = ["’", "“", "”", "…", "–", "È", "É", "À", "Ì", "Ù", "Ò"]; // SET MANUALLY
var n_columns_per_row = 6; // SET MANUALLY


var n_characters = 0; // Don't change this (it's set automatically later)
var url_transvision = "https://transvision.mozfr.org/?repo=gecko_strings&sourcelocale=en-US&=en-US&locale=it&=it&search_type=strings_entities&=strings_entities&recherche={*{key}*}"; // Don't change {*{key}*}, it indicates the value of the search (it's replaced in a function)

function copyCharacter(text)
{
	document.getElementById("text_to_copy").style.display="block";
	document.getElementById("text_to_copy").value = text;
	var copyText=document.getElementById("text_to_copy");
	copyText.select();
	document.execCommand("copy");
	document.getElementById("text_to_copy").style.display="none";
}

function setCharacters()
{
	n_characters = characters.length;
	for(var i=0;i<n_characters;i++)
	{
		document.getElementById("characters").innerHTML += "<input type=\"button\" class=\"character\" value=\""+characters[i]+"\" />";
	}
}

function setWidthHeight()
{
	var n_elements_width = n_columns_per_row; // SET MANUALLY: number of the elements in a single row ("number of columns")

	var width = n_elements_width * 47;
	var n_elements_height = (n_characters - (n_characters % n_elements_width)) / n_elements_width;
	if(n_characters % n_elements_width != 0)
	{
		n_elements_height += 1;
	}
	var height = n_elements_height * 47 + 40; // Add "40px" because there is alse the "search-box" element
	document.body.style.width = width + 2 + "px";
	document.body.style.height = height + 2 + "px";
	document.getElementById("popup-content").style.width = width + 2 + "px";
	document.getElementById("popup-content").style.height = height + 2 + "px";
}

function checkSearch()
{
	var value = document.getElementById("key").value;
	if(value.replace(" ","") != "")
	{
		value = value.replace("%","%25").replace(" ","%20").replace("&","%26").replace("+","%2B").replace("=","%3D").replace("?","3F"); // replace: %, [space], &, +, =, ?
		openTransvision(value);
	}
}

function openTransvision(value)
{
	var creating = browser.tabs.create({
		url:url_transvision.replace("{*{key}*}",value)
	})
}

setCharacters();
setWidthHeight();

for(var i=0;i<n_characters;i++)
{
	document.getElementsByClassName("character")[i].onclick = function(e){copyCharacter(this.value);};
}

document.getElementById("key").onkeypress = function(e){if(e.charCode == 13){checkSearch();}} // Catch the Enter event
document.getElementById("key").focus(); // Set focus on SearchBox when the popup appears