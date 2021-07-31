var characters = {
    "‘": "Virgoletta singola (iniziale)",
    "’": "Apostrofo oppure virgoletta singola (finale)",
    "“": "Virgoletta doppia (iniziale)",
    "”": "Virgoletta doppia (finale)",
    "…": "Puntini di sospensione",
    "–": "Trattino alto",
    "È": "Lettera e accentata grave",
    "É": "Lettera e accentata acuto (Es. perché, poiché, né)",
    "À": "Lettera à accentata",
    "Ì": "Lettera i accentata",
    "Ù": "Lettera ù accentata",
    "Ò": "Lettera o accentata"
}; // SET MANUALLY
var n_columns_per_row = 8; // SET MANUALLY


var n_characters = 0; // Don't change this (it's set automatically later)
// Don't change {{key}}, it indicates the value of the search (it's replaced in a function)
// [0->Transvision]
var url = ["https://transvision.mozfr.org/?repo=gecko_strings&sourcelocale=en-US&=en-US&locale=it&=it&search_type=strings_entities&=strings_entities&recherche={{key}}", "https://www.microsoft.com/en-us/language/Search?&searchTerm={{key}}&langID=408&Source=true&productid=0", "https://pontoon.mozilla.org/it/all-projects/all-resources/?search={{key}}"];

var selectedSearchEngine = 0;
var char_copied_n = 0;
var text_to_copy = "";

getSettings();

function copyCharacter(text) {
    let copyText = document.getElementById("text_to_copy");
    copyText.style.display = "block";
    text_to_copy = copyText.value + " " + text;
    copyText.value = text_to_copy;
    copyText.select();
    document.execCommand("copy");
    document.getElementById("text_to_copy").style.display = "none";
    console.log(text_to_copy.split(" "));
    if (text_to_copy.split(" ").length - 1 > 1) {
        showMessage("<span class='characters-copied'>" + text_to_copy + "</span> copiati ✔");
    } else {
        showMessage("<span class='characters-copied'>" + text_to_copy + "</span> copiato ✔");
    }
}

function setCharacters() {
    n_characters = Object.keys(characters).length;
    for (let char in characters) {
        document.getElementById("characters").innerHTML += "<input type='button' class='character' value='" + char + "' title='" + characters[char] + "' />";
    }

    for (let i = 0; i < n_characters; i++) {
        document.getElementsByClassName("character")[i].onclick = function (e) {
            copyCharacter(this.value);
        };
    }
}

function getSettings() {
    browser.storage.sync.get("search-engine", function (value) {
        selectedSearchEngine = 0;
        if (value["search-engine"] != undefined) {
            //already exist, so set the array at saved status
            selectedSearchEngine = value["search-engine"];
        }
        setSearchEngine(selectedSearchEngine);
    });
}

function setSettings(search_engine) {
    selectedSearchEngine = search_engine;
    browser.storage.sync.set({"search-engine": selectedSearchEngine}, function () {
    });
}

function setWidthHeight() {
    var n_elements_width = n_columns_per_row; // SET MANUALLY: number of the elements in a single row ("number of columns")

    var width = n_elements_width * 47;
    var n_elements_height = (n_characters - (n_characters % n_elements_width)) / n_elements_width;
    if (n_characters % n_elements_width != 0) {
        n_elements_height += 1;
    }
    var height = n_elements_height * 47 + 98; // Add "47px" because there is also the "search-box" element
    document.body.style.width = width + 4 + "px";
    document.body.style.height = height + 2 + "px";

    for (let i = 0; i < url.length; i++) {
        document.getElementsByClassName("tab")[i].onclick = function (e) {
            setSearchEngine(i);
        };
    }
    document.getElementById("search-submit").onclick = function (e) {
        checkSearch();
    };

    document.getElementById("help-button").onclick = function () {
        showMessage("Premi sul carattere che ti interessa e sarà copiato negli appunti.<br>Puoi copiare più caratteri in una singola sessione.", "3px", "3px", 6000);
    }

    document.getElementById("key").onkeypress = function (e) {
        // Catch the Enter event
        if (e.charCode == 13) {
            checkSearch();
        }
    }
}

function checkSearch() {
    var value = document.getElementById("key").value;
    if (value.replace(" ", "") != "") {
        value = value.replace("%", "%25").replace(" ", "%20").replace("&", "%26").replace("+", "%2B").replace("=", "%3D").replace("?", "3F"); // replace: %, [space], &, +, =, ?
        openResults(value, selectedSearchEngine);
    }
}

function openResults(value, searchEngine) {
    browser.tabs.create({
        url: url[searchEngine].replace("{{key}}", value)
    });
    window.close();
}

function setSearchEngine(index = 0) {
    setSettings(index);
    for (var i = 0; i < url.length; i++) {
        let temp_element = document.getElementsByClassName("tab")[i];
        temp_element.classList.remove("tab-selected");
    }
    document.getElementsByClassName("tab")[index].classList.add("tab-selected");
}

setCharacters();
setWidthHeight();

setSearchEngine(0);


document.getElementById("key").focus(); // Set focus on SearchBox when the popup appears

function showMessage(text = "", left = "30%", right = "30%", time = 1500) {
    let textToUse = text;
    if (textToUse == "") textToUse = "Copiato ✔";
    let index_to_use = char_copied_n;
    char_copied_n++;
    let new_b_element = document.createElement("b");
    new_b_element.className = "character-copied";
    new_b_element.id = "character-copied-" + index_to_use;
    new_b_element.innerHTML = textToUse;
    new_b_element.style.left = left;
    new_b_element.style.right = right;
    document.getElementById("popup-content").append(new_b_element);
    //document.getElementById("character-copied-"+index_to_use).style.display = "block";
    setTimeout(function () {
        hideMessage(index_to_use);
    }, time);
}

function hideMessage(index_to_use) {
    document.getElementById("character-copied-" + index_to_use).style.display = "none";
}