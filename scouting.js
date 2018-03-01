/***Global variables***/
var countSpeed = 1; //10
var usrName =""
var usrPosition = "";
var positionText = "";
var teamColor = "";
var numRamps = 0;

var teamNumber = "";

var matchNumber = 1;

var timerValue = 0;
var timer;
var timer_is_on = 0;
var timerStartValue = 10000;

var outputArray = [];

var usrRequest = false;
var usrMessage = ""

var cubeState = 1; // 0 = not holding cube, 1 = holding cube, 3 = climbing
/***Page elements***/
var header = document.getElementById('header');
var timerArea = document.getElementById('timerArea'); //timer
var page1 = document.getElementById('p1'); //scout info form
var page2 = document.getElementById('p2'); //Match info form
var autoButtons = document.getElementById('autoButtons'); //Main scouting page with all the buttons and stuff
var placeButtons = document.getElementById('placeButtons');
var collectButtons = document.getElementById('collectButtons');
var autoButtons = document.getElementById('autoButtons');
var climbButtons = document.getElementById('climbButtons');
var gameField = document.getElementById('map');
var undoButton = document.getElementById('undoButton');
var droppedCube = document.getElementById('droppedCube');
var postMatch = document.getElementById('postMatch');
var requestReplacement = document.getElementById('requestReplacement');
//Text
var redPlaceButtons = " <div align=\'center\'> <button id=RE onclick=\"logValue(\'redExchange\')\"> Red exchange </button> <button id=RS onclick=\"logValue(\'redSwitch\')\"> Red switch </button> <button id=S onclick=\"logValue(\'scale\')\"> Scale </button> <button id= BS onclick=\"logValue(\'blueSwitch\')\"> Blue switch </button> </div>";
var bluePlaceButtons= " <div align=\'center\'> <button id=RS onclick=\"logValue(\'redSwitch\')\"> Red switch </button> <button id=S onclick=\"logValue(\'scale\')\"> Scale </button> <button id= BS onclick=\"logValue(\'blueSwitch\')\"> Blue switch </button> <button id=BE onclick=\"logValue(\'blueExchange\')\"> Blue exchange </button> </div>";
var textCollectButtons = " <div align=\'center\'> <button id=\"CRS\" onclick=\"logValue(\'redCollect\')\">Collect from red side </button> <button id=\"CBS\" onclick=\"logValue(\'blueCollect\')\">Collect from blue side </button> </div>";
var textAutoButtons = " <button id=\'autoButtonSuccess\' onclick=\"autoSuccess()\">Crossed the baseline in auto</button> <button id=\'autoButtonFail\' onclick=\"autoFailed()\">Did not cross the baseline in auto</button>";
var textUndoButton = "<button id=\"undo\" onclick=\"undo()\">Undo last action</button>";
var textDroppedCube = "<button id=\"droppedCubeButton\" onclick=\"drop()\">Dropped cube</button>";
var textSubmitButton = "<button id=\'submitButton\' onclick=\'submit()\'> Submit results</button>";
var climbPhase1 = "<button id=\"parked\" onclick=\"parked()\">Parked on platform</button>";
var climbPhase2 = " <button id=\"climbAttempt\" onclick=\"climbAttempt()\">Begins climbing</button> <button id=\"deployRamps\" onclick=\"deployRamps()\">Deployed ramp(s)</button> <button id=\"leaveParked\" onclick=\"leaveParked()\">Drove off platform</button>";
var climbPhaseClimb = "<button id=\"climbSuccess\" onclick=\"climbSuccess()\">Climbed above 12 inches</button> <button id=\"returnToParked\" onclick=\"returnToParked()\">Returned to platform</button>";
var climbPhaseScoring = "<button id=\"climbFailed\" onclick=\"climbFailed()\">Fell down below 12 inches</button>";
var climbPhaseRamps = "<button id=\"climbAttempt\" onclick=\"climbAttempt()\">Begins climbing</button><button id=\"oneRamp\" onclick=\"oneRamp()\">One ramp</button> <button id=\"twoRamp\" onclick=\"twoRamp()\">Two ramps</button> <button id=\"undoRamp\" onclick=\"undoRamp()\">Retracted ramp(s)</button>";
var climbPhasePostRamps = "<button id=\"climbAttempt\" onclick=\"climbAttempt()\">Begins climbing</button><button id=\"undoRamp\" onclick=\"undoRamp()\">Retracted ramp(s)</button>";
var imgUrl = "https://lh3.googleusercontent.com/-MA8oTcG8lk8/WnYZYrugPRI/AAAAAAAAGDM/T1EeMn55aHMb_0_6QKVtZrWcK9iny_2_wCL0BGAYYCw/h522/2018-02-03.png"
//"https://lh3.googleusercontent.com/-qmsbMrdXy00/WnYRRtDWMpI/AAAAAAAAGCk/Ow_60eeZQWURPEq2GPIiV-_2pOnPIxPVgCL0BGAYYCw/h261/gavin%2Bhere.png";
var textGameField = "<img id=img src= " + imgUrl + ">";
//"<img id=img src= \'https://serving.photos.photobox.com/7852832932b4eb0b0d243a87786ab6d5dca02ff72c12a75512c4ef79887aed8829d26fc3.jpg\'>";
var textPostMatch = "<div align=\'center\'> Welcome to the post match screen :) <br><br> <form id=\"feedback\"> Send a message to the leads: <input type=\'text\' name=\'message\'/><br> </form> <button id=\'continueButton\' onclick=\'resetScouting()\'>Continue</button> </div>";

//"<img id=img src= \'https://preview.ibb.co/nxmqZ6/FIRST_POWER_UP_field.png\'>";

/*******************/

/***Shortcut functions***/
function setHtml(section, text)
{
  section.innerHTML = text
}

function readForm(formName,element) //returns form data
{
  var form = document.getElementById(formName);
  return form.elements[element].value;
}
/**********************/

/***Javascript***/
function submitScoutInfo()
{
  usrName = readForm('scoutInfo',0);
  usrPosition = readForm('scoutInfo',1);
  if (usrName != ""){toPage2();}
  if (!usrRequest){google.script.run.setRequest(usrPosition,"No");}

}
function loadMatch()
{
  teamNumber = readForm('matchInfo',0);
  matchNumber = readForm('matchInfo',1);
  if(teamNumber != "" && teamNumber != "" && !isNaN(teamNumber) && !isNaN(matchNumber)){toMatchPage();}
}
function logValue(item) //super important data logging function
{
  var itemArray = [timerValue,item,teamNumber,matchNumber];
  outputArray.push(itemArray);
  setHtml(undoButton,textUndoButton);
  if (item == "redExchange" || item == "redSwitch" || item == "scale" || item == "blueSwitch" || item == "blueExchange")
  {
    setHtml(placeButtons,"");
    setHtml(collectButtons,textCollectButtons);
    setHtml(droppedCube,"");
    cubeState = 0;
  }
  else if (item == "redCollect" || item == "blueCollect")
  {
    setHtml(collectButtons,"");
    setHtml(droppedCube,textDroppedCube);
    cubeState = 1
    if (teamColor == "red")
    {
      setHtml(placeButtons,redPlaceButtons);
    }
    else if (teamColor == "blue")
    {
      setHtml(placeButtons,bluePlaceButtons);
    }
  }
}

//submit
function submit()
{
  logValue('Match ended');
  google.script.run.doSubmit(usrName,usrPosition,teamNumber,teamColor,matchNumber,outputArray);
  google.script.run.doWeightedSubmit(usrName,usrPosition,teamNumber,teamColor,matchNumber,outputArray);
  setHtml(header,"");
  setHtml(timerArea,"");
  setHtml(autoButtons,"");
  setHtml(collectButtons,"");
  setHtml(placeButtons,"");
  setHtml(climbButtons,"");
  setHtml(gameField,"");
  setHtml(undoButton,"");
  setHtml(droppedCube,"");
  setHtml(postMatch,textPostMatch);
  if (usrRequest)
  {
    setHtml(requestReplacement,"<div align=\'center\'><button id=\'requestFalse\' onclick=\'undoRequest()\'>Cancel replacement request</button></div>")
  }
  else
  {
    setHtml(requestReplacement,"<div align=\'center\'><button id=\'requestTrue\' onclick=\'doRequest()\'>Request replacement</button></div>")
  }
}

function doRequest()
{
  usrRequest = true;
  setHtml(requestReplacement,"<div align=\'center\'><button id=\'requestFalse\' onclick=\'undoRequest()\'>Cancel replacement request</button></div>")
  google.script.run.setRequest(usrPosition,"Yes")
}
function undoRequest()
{
  usrRequest = false;
  setHtml(requestReplacement,"<div align=\'center\'><button id=\'requestTrue\' onclick=\'doRequest()\'>Request replacement</button></div>")
  google.script.run.setRequest(usrPosition,"No")
}

function resetScouting()
{
  var newMessage = readForm('feedback',0)
  if (newMessage != "")
  {
    usrMessage = newMessage;
  }
  var adminArray = [usrName,matchNumber,usrMessage]
  google.script.run.updateAdminSheet(usrPosition,adminArray);
  setHtml(postMatch,"");
  setHtml(requestReplacement,"");

  teamNumber = "";

  matchNumber++;

  timerValue = 0;
  timer_is_on = 0;
  cubeState = 1;
  numRamps = 0;

  outputArray = [];
  toPage2();
}
/****************/

/***Setting page***/
//first one set on page load
setHtml(page1,"<form id=\"scoutInfo\"> Name: <input type=\'text\' name=\'name\'/><br> Position: <select> <option value=\'redTop\'> Red top</option> <option value=\'redMid\'> Red mid </option> <option value=\'redBot\'> Red bot </option> <option value=\'blueTop\'> Blue top</option> <option value=\'blueMid\'> Blue mid </option> <option value=\'blueBot\'> Blue bot </option> </select> </form> <br> <button onclick=\'submitScoutInfo()\'> Continue </button>");
setHtml(header,"Enter your name and scouting position");
function toPage2()
{
    switch (usrPosition)
    {
      case "redTop":
      positionText = "Red top";
      teamColor = "red"
      break;
      case "redMid":
      positionText = "Red mid";
      teamColor = "red"
      break;
      case "redBot":
      positionText = "Red Bot";
      teamColor = "red"
      break;
      case "blueTop":
      positionText = "Blue top";
      teamColor = "blue"
      break;
      case "blueMid":
      positionText = "Blue mid";
      teamColor = "blue"
      break;
      case "blueBot":
      positionText = "Blue bot";
      teamColor = "blue"
      break;
    }

  var headerText = usrName + " | " + positionText;
  setHtml(page1,"");
  setHtml(header,headerText);
  setHtml(page2,"<form id=\"matchInfo\"> Team number: <input type=\'text\' name=\'teamNumber\'/><br> Match number: <input type=\'text\' id=\'matchNumber\' value=\'"+ matchNumber +"\' /> </form> <button onclick=\'loadMatch()\'> Load match! </button>");
}
function toMatchPage()
{
  setHtml(page2,"");
  var headerText = usrName + " | " + positionText + " | Team " + teamNumber + " | Match " + matchNumber;
  setHtml(header, headerText);
  setHtml(timerArea,"<button id='timerButton' onclick='startMatch()'> Start match! </button>")
  setHtml(gameField,textGameField);
}
function placeAutoButtons()
{
  setHtml(autoButtons,textAutoButtons)
}
function clearAutoButtons()
{
  setHtml(autoButtons,"");
}
function autoSuccess() //Successfully cross baseline
{
  clearAutoButtons();
  logValue('autoSuccess');
}
function autoFailed() //failed crossing baseline
{
  clearAutoButtons();
  logValue('autoFailed');
}

//Start climbing area
function showClimb1()
{
  setHtml(climbButtons,climbPhase1);
}
function showClimb2()
{
  setHtml(climbButtons,climbPhase2);
  setHtml(placeButtons,"");
  setHtml(collectButtons,"");
  setHtml(droppedCube,"");

}
function showClimbClimb()
{
  setHtml(climbButtons,climbPhaseClimb);
}
function showClimbScoring()
{
  setHtml(climbButtons,climbPhaseScoring);
}
function showClimbRamps()
{
  setHtml(climbButtons,climbPhaseRamps);
}
function showClimbPostRamps()
{
  setHtml(climbButtons,climbPhasePostRamps);
}
function clearClimb()
{
  setHtml(climbButtons,"");
}

//Logging
function parked() //page 1 to 2
{
  logValue('parked');
  showClimb2()
}
function climbAttempt()  //page 2 to 3 (climb)
{
  logValue('climbAttempt');
  showClimbClimb();
}
function deployRamps() //page 2 to 3 (ramps)
{
  logValue('deployRamps');
  numRamps = .5;
  showClimbRamps();
}
function leaveParked() //page 2 to 1
{
  logValue('leaveParked');
  showClimb1();
  showCubeButtons();

}
//putting buttons back
function showCubeButtons()
{
  if (teamColor == "red")
  {
    if (cubeState == 0)
    {
      setHtml(collectButtons,textCollectButtons);
    }
    else if (cubeState == 1)
    {
      setHtml(placeButtons,redPlaceButtons);
      setHtml(droppedCube,textDroppedCube);
    }
  }
  else if (teamColor == "blue")
  {
    if (cubeState == 0)
    {
      setHtml(collectButtons,textCollectButtons);
    }
    else if (cubeState == 1)
    {
      setHtml(placeButtons,bluePlaceButtons);
      setHtml(droppedCube,textDroppedCube);
    }
  }
}
function climbSuccess() //page 3 (climb) to 4 (climb validation and undo)
{
  logValue('climbSuccess');
  showClimbScoring();
}
function returnToParked()
{
  logValue('returnToParked')

  if (numRamps == 0){showClimb2();}
  else if (numRamps == .5){showClimbRamps();}
  else if (numRamps >= 1){showClimbPostRamps();}
  else {showClimb2();}

}
function climbFailed() //page 4 to 3
{
  logValue('climbFailed');
  showClimbClimb();
}
function oneRamp()
{
  logValue('oneRamp');
  numRamps = 1
  showClimbPostRamps();
}
function twoRamp()
{
  logValue('twoRamp');
  numRamps = 2;
  showClimbPostRamps();
}
function undoRamp()
{
  logValue('undoRamp');
  numRamps = 0;
  showClimb2();
}






/******************/

/***TIMER***/
function startMatch() //start the match
{
  startTimer();
  if (teamColor == "red")
  {
    setHtml(placeButtons,redPlaceButtons);
  }
  else if (teamColor == "blue")
  {
    setHtml(placeButtons,bluePlaceButtons);
  }
  setHtml(collectButtons,textCollectButtons);
  placeAutoButtons();
  setHtml(droppedCube,textDroppedCube);
}


function startTimer()
{
  timerValue = timerStartValue;
  if (!timer_is_on)
  {
    timer_is_on = 1;
    count();

  }

}
function stopTimer()
{
  clearTimeout(timer);
  timer_is_on = 0;
}
function count()
{
  timerValue++
  if (timerValue < 1500)
  {
    var num = 1500 - timerValue;
    num = num/100
    num = num.toFixed(2)
    timerArea.innerHTML = num;
  }
  else
  {
    var num = 15000 - timerValue;
    num = num/100
    num = num.toFixed(2)
    timerArea.innerHTML = num;
    if (timerValue == 12000)
    {
      showClimb1();
    }
    if (timerValue == 15000)
    {
      setHtml(timerArea,textSubmitButton);
      var headerText = usrName + " | " + positionText + " | Team " + teamNumber + " | Match " + matchNumber + " finished!";
      setHtml(header, headerText);
      stopTimer();
    }
  }
  if (timerValue < 15000)
  {
    timer = setTimeout(function(){ count() }, countSpeed);
  }
}
/***END TIMER***/

function undo()
{
  var removedLog
  removedLog = outputArray.pop()
  var item = removedLog[1]
  if (outputArray.length > 0){var lastItem = outputArray[outputArray.length - 1][1]}

  if (item == "redCollect" || item == "blueCollect")
  {
    setHtml(placeButtons,"");
    setHtml(collectButtons,textCollectButtons);
    setHtml(droppedCube,"");
  }
  else if (item == "redExchange" || item == "redSwitch" || item == "scale" || item == "blueSwitch" || item == "blueExchange" || item == "droppedCube")
  {
    setHtml(collectButtons,"");
    setHtml(droppedCube,textDroppedCube);
    if (teamColor == "red")
    {
      setHtml(placeButtons,redPlaceButtons);
    }
    else if (teamColor == "blue")
    {
      setHtml(placeButtons,bluePlaceButtons);
    }
  }
  if (outputArray.length == 0)
  {
    if (teamColor == "red")
    {
      setHtml(placeButtons,redPlaceButtons);
    }
    else if (teamColor == "blue")
    {
      setHtml(placeButtons,bluePlaceButtons);
    }
    setHtml(droppedCube,textDroppedCube);
    setHtml(collectButtons,textCollectButtons);
  }

  switch (item)
  {
    case "autoSuccess":
    placeAutoButtons();
    break;
    case "autoFailed":
    placeAutoButtons();
    break;
    case "parked":
    showClimb1();
    showCubeButtons();
    break;
    case "climbAttempt":

    if (numRamps == .5)
    {
      showClimbRamps();
    }
    else if (numRamps >= 1)
    {
      showClimbPostRamps();
    }
    else
    {
      showClimb2();
    }
    break;
    case "deployRamps":
    showClimb2();
    numRamps = 0;
    break;
    case "leaveParked":
    showClimb2();
    break;
    case "climbSuccess":
    showClimbClimb();
    break;
    case "returnToParked":
    showClimbClimb();
    break;
    case "climbFailed":
    showClimbScoring();
    break;
    case "oneRamp":
    showClimbRamps();
    numRamps = .5
    break;
    case "twoRamp":
    showClimbRamps();
    numRamps = .5
    break;
    case "undoRamp":
    if (lastItem == "deployRamps")
    {
      showClimbRamps();
    }
    else
    {
      showClimbPostRamps();
    }
    numRamps = 1.5
    break;
    case "droppedCube":
    setHtml(droppedCube,textDroppedCube);
    break;



  }
  setHtml(undoButton,"");
}

function drop()
{
  logValue('droppedCube');
  setHtml(droppedCube,"");
  setHtml(collectButtons,textCollectButtons);
  setHtml(placeButtons,"");
  cubeState = 0;
}
