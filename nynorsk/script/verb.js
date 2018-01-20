//jeg orket ikke å gjøre dette selv, så jeg bruker et eksternt bibliotek
var data = $.csv.toObjects(verb_data);
console.log("Data:", data);

//pointers
var verbtidEl = document.querySelector('#verbtid');
var verbEl = document.querySelector('#verb');
var riktigEl = document.querySelector('#riktig');
var feilEl = document.querySelector('#feil');
var inputEl = document.querySelector('#text_input');
var buttonEl = document.querySelector('#button');
var helpEl = document.querySelector('#help');
var mainGameEl = document.querySelector('#main_game');
var chooseVerbtidEl = document.querySelector('#choose_verbtid');
var playButtonEl = document.querySelector('#play');

//globale variabler
var verbtid;
var verb;
var valgte_verbtider;

var poeng = 0;
var feil = 0;
var wait_state = false;

var verbtider = ["presens", "preteritum", "presens perfektum"];

//Funksjoner for utprinting - --------------------------------------------------
//vi får hjelp dersom vi bøyer feil
function printHelp() {
  for (var i = 0; i < verbtider.length; i++) {
    //rad
    var rowEl = document.createElement("div");
    rowEl.classList.add("row");
    //vi vil at den valgte tiden skal bli markert
    if (verbtid == verbtider[i])
      rowEl.classList.add("highlight");
    //legg til verbtid og verb(ene)
    var data1El = document.createElement("div");
    var data2El = document.createElement("div");
    data1El.classList.add("col-4");
    data2El.classList.add("col-8");
    data1El.innerHTML = verbtider[i];
    //det kan hende vi har flere bøyningsformer
    for (var j = 0; j != verb.former; j++) {
      if (verb[verbtider[i] + j] != "") {
        if (j != 0)
          data2El.innerHTML += ' / ';
        data2El.innerHTML += verb[verbtider[i] + j];
      }
    }
    rowEl.appendChild(data1El);
    rowEl.appendChild(data2El);
    helpEl.appendChild(rowEl);
  }
}

//printer ut en tilfelidg verbtid og infinitvsformen(e) til det valgte verbet
function printSlide() {
  //velger en tilfeldig verbtid
  verbtid = verbtider[Math.floor(Math.random() *
    valgte_verbtider.length)];
  //og printer den til brukeren
  verbtidEl.innerHTML = verbtid;
  //vi kan ha flere varianter av infiinitvsformen
  for (var i = 0; i != verb.former; ++i) {
    if (verb["infinitiv" + i].length != 0) {
      if (i != 0)
        verbEl.innerHTML += ' / ';
      verbEl.innerHTML += verb["infinitiv" + i];
    }
  }
}

//reseter og lager en ny slide i "quizen"
function createSlide() {
  //noen ting vi må resete
  verbEl.innerHTML = '';
  verbtidEl.innerHTML = '';
  inputEl.removeAttribute('class');
  inputEl.disabled = false;
  inputEl.value = "";
  inputEl.focus();
  helpEl.innerHTML = '';
  //så hent tilfeldig verb fra datasettet
  verb = data[Math.floor(Math.random() * data.length)];
  //og lag ny slide med det
  printSlide();
}

//------------ funskjoner som har med fasitsjekking og poeng å gjøre -----------
//oppdaterer poengtellerne
function updatePoints() {
  riktigEl.innerHTML = poeng;
  feilEl.innerHTML = feil;
}

//gir poeng, og viser det
function correctAnswer() {
  ++poeng;
  inputEl.setAttribute('class', "riktig");
  //oppdater poeng
  updatePoints();
}

//gir feiloeng og viser det, samt print bøyningsrekke
function wrongAnswer() {
  ++feil;
  printHelp();
  inputEl.setAttribute('class', "fail");
  //oppdater poeng
  updatePoints();
}

//sjekker svar og gir enten feilmelding eller grønt lys
function checkResult() {
  //går rett til neste slide etter at brukeren har lest feilmelding
  if (wait_state) {
    wait_state = false;
    createSlide();
    return;
  }
  //ingen endring før brukeren går videre
  wait_state = true;
  inputEl.disabled = true;

  //shekk mot fasit og gjør tilsvarende
  var input = inputEl.value.toLowerCase();
  //vi går gjennom alle de mulige løsningene
  for (var i = 0; i != verb.former; i++) {
    if (verb[verbtid + i] != "") {
      if (input == verb[verbtid + i]) {
        correctAnswer();
        return;
      }
    }
  }
  wrongAnswer();
}

//eventlisteners
buttonEl.addEventListener('click', checkResult);
//dette er et must. Man har lyst på effektiv nynorsk øving
document.addEventListener('keypress', function (e) {
  var key = e.which || e.keyCode;
  if (key === 13)
    checkResult();
});

//funksjoner for menynavigering ------------------------------------------------
//vis verbtidvalgskjermen
function displayVerbtider() {
  mainGameEl.style.display = "none";
  chooseVerbtidEl.style.display = "block";
  valgte = [];
  playButtonEl.innerHTML = 'SPEL';
  playButtonEl.removeEventListener('click', displayVerbtider);
  playButtonEl.addEventListener('click', displayGame);
}

//vis spillet
function displayGame() {
  //reset poeng
  poeng = 0;
  feil = 0;
  updatePoints();
  //henter valgte verbtider i en array
  valgte_verbtider = [];
  var checkboxesEl = chooseVerbtidEl.querySelectorAll('input[type="checkbox"]');
  for (var i = 0; i < checkboxesEl.length; i++) {
    if (checkboxesEl[i].checked)
      valgte_verbtider.push(checkboxesEl[i].value);
  }
  if (valgte_verbtider.length == 0) return; // TODO: Legg til en feilmelding til brukeren
  //fjern valgskjermen og vis psillet
  mainGameEl.style.display = "block";
  chooseVerbtidEl.style.display = "none";
  createSlide();
  //oppdater knappen
  playButtonEl.innerHTML = 'TILBAKE';
  playButtonEl.removeEventListener('click', displayGame);
  playButtonEl.addEventListener('click', displayVerbtider);
}

//vi vil begynne på verbtidvalgskjermen
mainGameEl.style.display = "none";
playButtonEl.addEventListener('click', displayGame);
