var characters = ["’", "“", "”", "…", "–", "È", "É", "À", "Ì", "Ù", "Ò"]; // SET MANUALLY
var n_columns_per_row = 6; // SET MANUALLY


var n_characters = 0; // Don't change this (it's set automatically later)
// Don't change {*{key}*}, it indicates the value of the search (it's replaced in a function)
// [0->Transvision]
var url = ["https://transvision.mozfr.org/?repo=gecko_strings&sourcelocale=en-US&=en-US&locale=it&=it&search_type=strings_entities&=strings_entities&recherche={*{key}*}"];

var char_copied_n = 0;

function copyCharacter(text) {
    document.getElementById("text_to_copy").style.display = "block";
    document.getElementById("text_to_copy").value = text;
    var copyText = document.getElementById("text_to_copy");
    copyText.select();
    document.execCommand("copy");
    document.getElementById("text_to_copy").style.display = "none";
    showCopied();
}

function setCharacters() {
    n_characters = characters.length;
    for (var i = 0; i < n_characters; i++) {
        document.getElementById("characters").innerHTML += "<input type=\"button\" class=\"character\" value=\"" + characters[i] + "\" />";
    }
}

function setWidthHeight() {
    var n_elements_width = n_columns_per_row; // SET MANUALLY: number of the elements in a single row ("number of columns")

    var width = n_elements_width * 47;
    var n_elements_height = (n_characters - (n_characters % n_elements_width)) / n_elements_width;
    if (n_characters % n_elements_width != 0) {
        n_elements_height += 1;
    }
    var height = n_elements_height * 47 + 94; // Add "40px" because there is alse the "search-box" element
    document.body.style.width = width + 4 + "px";
    document.body.style.height = height + 2 + "px";
    document.getElementById("popup-content").style.width = width + 4 + "px";
    document.getElementById("popup-content").style.height = height + 2 + "px";
}

function checkSearch() {
    var value = document.getElementById("key").value;
    if (value.replace(" ", "") != "") {
        value = value.replace("%", "%25").replace(" ", "%20").replace("&", "%26").replace("+", "%2B").replace("=", "%3D").replace("?", "3F"); // replace: %, [space], &, +, =, ?
        openResults(value, 0);
    }
}

function openResults(value, searchEngine) {
    browser.tabs.create({
        url: url[searchEngine].replace("{*{key}*}", value)
    });
    window.close();
}

setCharacters();
setWidthHeight();

for (var i = 0; i < n_characters; i++) {
    document.getElementsByClassName("character")[i].onclick = function (e) {
        copyCharacter(this.value);
    };
}
document.getElementById("search-submit").onclick = function (e) {
    checkSearch();
};

document.getElementById("key").onkeypress = function (e) {
    if (e.charCode == 13) {
        checkSearch();
    }
} // Catch the Enter event
document.getElementById("key").focus(); // Set focus on SearchBox when the popup appears

function showCopied() {
    let index_to_use = char_copied_n;
    char_copied_n++;
    // <b>Copiato ✔️</b>
    let new_b_element = document.createElement("b");
    new_b_element.className = "character-copied";
    new_b_element.id = "character-copied-" + index_to_use;
    new_b_element.innerHTML = "Copiato ✔";
    document.getElementById("popup-content").append(new_b_element);
    //document.getElementById("character-copied-"+index_to_use).style.display = "block";
    setTimeout(function () {
        hideCopied(index_to_use);
    }, 1500);
}

function hideCopied(index_to_use) {
    document.getElementById("character-copied-" + index_to_use).style.display = "none";
}