function fillObservations() {
  var caseArbitreSamedi = 7;
  var caseArbitreDimanche = 8; //Case dans la sheet Arbitres

  var samedi = nextDay("saturday");
  var dimanche = nextDay("sunday");
  
  Logger.log(samedi);
  Logger.log(dimanche);
  
  var ObsSamedi = getObservateursDate(samedi);
  var ObsDimanche = getObservateursDate(dimanche);
  
  Logger.log(ObsSamedi);
  Logger.log(ObsDimanche);
  
  var arbitresSamedi = getArbitres(caseArbitreSamedi-1, ObsSamedi.length);
  var arbitresDimanche = getArbitres(caseArbitreDimanche-1, ObsDimanche.length);
  
  Logger.log(arbitresSamedi);
  Logger.log(arbitresDimanche);  
  var tableau = creerTableau(ObsSamedi, arbitresSamedi);
  var tableau2 = creerTableau(ObsDimanche, arbitresDimanche);

  Logger.log(tableau);
  Logger.log(tableau2);
  
  
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Next");
  var histo = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Historique");
  sheet.clear()
  sheet.getRange("B3:B3").setValue("Prochaines observations");
  for(var j=0;j<tableau.length;j++) {
    sheet.getRange(4+j, 2, 1, 4).setValues([[samedi, tableau[j][0], tableau[j][1], tableau[j][2]]]);
    histo.appendRow([samedi, tableau[j][0], tableau[j][1], tableau[j][2]]);
  }
  for(var z=0;z<tableau2.length;z++) {
    sheet.getRange(4+j+z, 2, 1, 4).setValues([[dimanche, tableau2[z][0], tableau2[z][1], tableau2[z][2]]]);
    histo.appendRow([dimanche, tableau2[z][0], tableau2[z][1], tableau2[z][2]]);
  }
  
}

function getObservateursDate(dateJour) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Observateurs");
  var dates = sheet.getRange("1:1").getValues()[0];
  var result = [];
  for (var i = 0 ; i<dates.length ; i++) {
    if(dates[i].valueOf() == dateJour.valueOf()) 
      break;
  }
  var observateurs = sheet.getRange("A1:E50").getValues();
  for each(observateur in observateurs) {
    if(observateur[i] == "OUI")
      result.push(observateur);
  }
  return result;
}

function getArbitres(day, number) {
  var result = [];
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("JAD");
    var arbitres = sheet.getRange("A2:I102").getValues();
    var prio = 0;
    var index = 1;
  while (prio < 5) {
    for each (arbitre in arbitres) {
      // Si on atteint la limite on sort
      if(result.length >= number)
        return result;
      //Si dispo ce jour + gestion prio + encore obs à faire
      if(arbitre[day] == 'OUI' && arbitre[3] == prio && arbitre[5] < arbitre[4] && arbitre[8] != "OUI") {
        arbitre[8] = "OUI";
        arbitre[5]++;
        Logger.log(arbitre);
        //Logger.log(sheet.getRange(index+2, 1, 1, 9).getA1Notation());
        sheet.getRange(index+2, 1, 1, 9).setValues([arbitre]);
        result.push(arbitre);
      }
      index++;
    }
    prio++;
    index=0;
  }
  return result;
}

function creerTableau(Obs, arbitres) {
  var tableau = [];
  if(Obs.length > 0 && arbitres.length > 0) {
    for(var i=0; i<Math.min(Obs.length,arbitres.length); i++) {
      tableau.push([Obs[i][0] + " " + Obs[i][1], arbitres[i][0] + " " + arbitres[i][1], arbitres[i][2]]);
    }
  }
  return tableau;
}

function nextDay(weekDay) {
  var d = new Date();
  var awd = {"sunday":1, "monday":2, "tuesday":3, "wednesday":4, "thursday":5, "friday":6, "saturday":7}
  var offset = awd[  weekDay ]  ; 
  if(d.getDay() == awd[weekDay]-1)
     offset = offset + 7;
  d.setDate( d.getDate()-d.getDay()-1+offset ) ;
  d.setHours(0,0,0,0);
  return offset?d:weekDay+ ': not a valid weekday name'  ;    
}

