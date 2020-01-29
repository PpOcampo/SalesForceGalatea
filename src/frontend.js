let integration;
let MuteValue = false;
var timeCounter = "00:00:00";
var intervalCallQueue;
var secs = 0;
var acdId;

function connectToServer() {
  integration = new IntegrationEntryPoint.IntegrationApiFactory().buildClient();
  let server = "demo.nuxiba.com";
  let secureConnection = false;
  integration.WSParameters.server = server;
  integration.WSParameters.secureConnection = secureConnection;
  integration.connectToServer();
}
function disconnectToServer() {
  integration.disconnectToServer();
}
function getIpAddress() {
  let ipAddress = integration.getIpAddress();
  console.log(ipAddress);
  document.getElementById("ipAddress").value = ipAddress;
}
function login() {
  var user = document.getElementById("user").value;
  var password = document.getElementById("password").value;
  integration.login(user, password);
}
function logout() {
  integration.closeSession();
}

function makeManualCall() {
  var phoneNum = document.getElementById("phoneNumber").value;
  var clientName = document.getElementById("clientName").value;
  var campID = document.getElementById("Campaigns").value;
  var callKey = document.getElementById("callKey").value;

  integration.makeManualCall(phoneNum, campID, clientName, callKey);
}

function hangUp() {
  integration.HangUpCall();
}

function HangUpAndLeaveMessage() {
  integration.HangUpAndLeaveMessage();
}
function HangUpManualDial() {
  integration.HangUpManualDial();
}

function getUnavailables() {
  integration.getUnavailables();
}

function onUnavailableTypes(array) {
  document.getElementById("selectUnavailables").innerHTML = "";
  let notReadyList = document.getElementById("selectUnavailables");
  for (i = 0; i < array.length; i++) {
    if (array[i] !== undefined) {
      let option = document.createElement("option");
      option.text = array[i].TypeNotReadyId + "=" + array[i].Description;
      option.value = array[i].TypeNotReadyId;
      notReadyList.add(option);
    }
  }
}
function onAdministrators(array) {
  document.getElementById("selectAdmins").innerHTML = "";
  let notReadyList = document.getElementById("selectAdmins");
  for (i = 0; i < array.length; i++) {
    if (array[i] !== undefined) {
      let option = document.createElement("option");
      option.text = array[i].ID + "=" + array[i].Username;
      option.value = array[i].ID;
      notReadyList.add(option);
    }
  }
  console.log("array ", array);
}

function onChatMessage(chatMessage) {
  document.getElementById("messageArea").value =
    document.getElementById("messageArea").value +
    "\n" +
    chatMessage.administrator +
    ":  " +
    chatMessage.message;

  printToConsole(chatMessage.administrator, ": ", chatMessage.message);
}

function errorOnChatAdministratorsList(error) {
  printToConsole("errorOnChatAdministratorsList");
  printToConsole("    " + error.code + "-" + error.message);
}
function sendClientChatMessage() {
  var chatID = document.getElementById("selectAdmins").value;
  var message = document.getElementById("messageToSend").value;

  console.log("AdminChat ", chatID);
  integration.sendClientChatMessage(chatID, message);
  document.getElementById("messageArea").value =
    document.getElementById("messageArea").value + "\nme: " + message;
  document.getElementById("messageToSend").value = "";
}
function setUnavailable() {
  var unavailableID = document.getElementById("selectUnavailables").value;
  integration.setOnUnavailableStatus(unavailableID);
}
function SetReady() {
  integration.SetAvailable();
}
function onAgentStatus(agentStatus) {
  var state = agentStatus.currentState;
  let text = document.getElementById("status");
  text.value = state;
}
function onSecondCallConected() {
  printToConsole("prueba onSecondCallConected:");
}
function onSecondCall(phone) {
  printToConsole("prueba onSecondCall phone:", phone);
}
function onSecondCallHangUp() {
  printToConsole("prueba onSecondCallHangUp:");
}
function getLastCallData() {
  let arrayx = integration.getLastCallData();

  if (arrayx) {
    let arrayCallData = arrayx.DataContact;
    console.log("Getting call data", arrayx);
    arrayx.CallId
      ? (document.getElementById("callIdTxt").value = arrayx.CallId)
      : (document.getElementById("callIdTxt").value = "");
    arrayx.IsQueueCall
      ? (document.getElementById("queuedTxt").value = arrayx.IsQueueCall)
      : (document.getElementById("queuedTxt").value = "");

    arrayx.Id
      ? (document.getElementById("camIdTxt").value = arrayx.Id)
      : (document.getElementById("camIdTxt").value = "");
    arrayx.HoldTime
      ? (document.getElementById("holdTxt").value = arrayx.HoldTime)
      : (document.getElementById("holdTxt").value = "");

    arrayx.DNIS
      ? (document.getElementById("dnisTxt").value = arrayx.DNIS)
      : (document.getElementById("dnisTxt").value = "");
    arrayx.Phone
      ? (document.getElementById("phoneTxt").value = arrayx.Phone)
      : (document.getElementById("phoneTxt").value = "");

    arrayx.CalKey
      ? (document.getElementById("calKeyTxt").value = arrayx.CalKey)
      : (document.getElementById("calKeyTxt").value = "");
    arrayx.Port
      ? (document.getElementById("portTxt").value = arrayx.Port)
      : (document.getElementById("portTxt").value = "");

    arrayx.CallType
      ? (document.getElementById("callTypeTxt").value = arrayx.CallType)
      : (document.getElementById("callTypeTxt").value = "");
    arrayx.WrapUpTime
      ? (document.getElementById("wrapupTimeTxt").value = arrayx.WrapUpTime)
      : (document.getElementById("wrapupTimeTxt").value = "");

    arrayx.CallOutId
      ? (document.getElementById("calloutTxt").value = arrayx.CallOutId)
      : (document.getElementById("calloutTxt").value = "");

    if (arrayCallData.length === 5) {
      arrayCallData[0]
        ? (document.getElementById("data1Txt").value = arrayCallData[0])
        : (document.getElementById("data1Txt").value = "");
      arrayCallData[1]
        ? (document.getElementById("data2Txt").value = arrayCallData[1])
        : (document.getElementById("data2Txt").value = "");
      arrayCallData[2]
        ? (document.getElementById("data3Txt").value = arrayCallData[2])
        : (document.getElementById("data3Txt").value = "");
      arrayCallData[3]
        ? (document.getElementById("data4Txt").value = arrayCallData[3])
        : (document.getElementById("data4Txt").value = "");
      arrayCallData[4]
        ? (document.getElementById("data5Txt").value = arrayCallData[4])
        : (document.getElementById("data5Txt").value = "");
    }
  }
}
function onClickUpdateCallData() {
  let callOutID, data1, data2, data3, data4, data5;
  callOutID = document.getElementById("calloutTxt").value;
  data1 = document.getElementById("data1Txt").value;
  data2 = document.getElementById("data2Txt").value;
  data3 = document.getElementById("data3Txt").value;
  data4 = document.getElementById("data4Txt").value;
  data5 = document.getElementById("data5Txt").value;
  integration.updateCallData(callOutID, data1, data2, data3, data4, data5);
}

function assistedDialNumber() {
  var phone = document.getElementById("phone").value;
  integration.assistedDialNumber(phone);
}
function assistedXFerUseMainCall() {
  integration.assistedXFerUseMainCall();
}
function assistedXFerUseSecondCall() {
  integration.assistedXFerUseSecondCall();
}
function assistedXFerHangUP() {
  integration.assistedXFerHangUP();
}
function assistedXFerTransferCalls() {
  integration.assistedXFerTransferCalls();
}
function assistedXFerDropFirstCall() {
  integration.assistedXFerDropFirstCall();
}
function assistedXFerDropSecondCall() {
  integration.assistedXFerDropSecondCall();
}
function assistedXFerMakeConference() {
  integration.assistedXFerMakeConference();
}
function assistedXFerLeaveConference() {
  integration.assistedXFerLeaveConference();
}
function getSupervisorsToChat() {
  integration.getSupervisorsToChat();
}
function onClickGetTransfer() {
  integration.getTransfersOptions();
}
function onTransferOptions(data) {
  const Data = data.data;
  const acdList = Data[0];
  const phoneList = Data[1];
  const agentList = Data[2];

  if (acdList) {
    array = acdList;
    document.getElementById("transferCallACD").innerHTML = "";
    let transferCallACD = document.getElementById("transferCallACD");
    for (i = 0; i < array.length; i++) {
      if (array[i] !== undefined) {
        let option = document.createElement("option");
        option.text = array[i].name;
        option.value = array[i].inbound_id;
        transferCallACD.add(option);
      }
    }
  }
  if (phoneList) {
    array = phoneList;
    document.getElementById("transferCallPhone").innerHTML = "";
    let transferCallPhone = document.getElementById("transferCallPhone");
    for (i = 0; i < array.length; i++) {
      if (array[i] !== undefined) {
        let option = document.createElement("option");
        option.text = array[i].name;
        option.value = array[i].number;
        transferCallPhone.add(option);
      }
    }
  }
  if (agentList) {
    array = agentList;
    document.getElementById("transferCallAgent").innerHTML = "";
    let transferCallAgent = document.getElementById("transferCallAgent");
    for (i = 0; i < array.length; i++) {
      if (array[i] !== undefined) {
        let option = document.createElement("option");
        option.text = array[i].name;
        option.value = array[i].extid;
        transferCallAgent.add(option);
      }
    }
  }
}
function transferCallToACD() {
  var transferCallToACDid = document.getElementById("transferCallACD").value;
  integration.transferCallToACD(transferCallToACDid);
}
function transferCallToAgent() {
  var transferCallToAgentID = document.getElementById("transferCallAgent")
    .value;
  integration.transferCallToAgent(transferCallToAgentID);
}
function transferCallToPhoneNumber() {
  var transferCallToPhone = document.getElementById("transferCallPhone").value;
  integration.transferCallToPhoneNumber(transferCallToPhone);
}
function getunavalibaleHistory() {
  integration.getunavalibaleHistory();
}
function onUnavailableHistory(data) {
  let NotAvailableHistory = document.getElementById("NotAvailablesHistory");
  if (data) {
    array = data;
    NotAvailableHistory.innerHTML = "";
    for (i = 0; i < array.length; i++) {
      if (array[i] !== undefined) {
        let option = document.createElement("option");
        option.text = array[i].Description;
        //option.value = `Count: ${array[i].Count} Total: ${array[i].Total}`;

        option.value =
          "Count: " + array[i].Count + "  Total: " + array[i].Total;
        NotAvailableHistory.add(option);
      }
    }
  }
  let text = document.getElementById("NotAvailablesHist");
  text.value = NotAvailableHistory.value;
}
function changeHistory() {
  let text = document.getElementById("NotAvailablesHist");
  text.value = document.getElementById("NotAvailablesHistory").value;
}
function GetCampaignsRelated() {
  integration.GetCampaignsRelated();
}
function onCampaigns(data) {
  let Campaigns = document.getElementById("Campaigns");
  if (data) {
    array = data;
    Campaigns.innerHTML = "";
    for (var property in array) {
      if (array[property] !== undefined) {
        let option = document.createElement("option");
        option.text = array[property].Description;
        option.value = array[property].ID;
        Campaigns.add(option);
      }
    }
  }
}
function getCallHistory() {
  integration.getCallHistory();
}
function onCallHistory(data) {
  let callLogData = data.data;
  let callLogTable = "";
  document.getElementById("callLogTable").innerHTML = "";
  if (callLogData.length > 0) {
    for (i = 0; i < callLogData.length; i++) {
      callLogTable +=
        '<tr><th scope="col">' +
        callLogData[i].Hour +
        '</th><th scope="col">' +
        callLogData[i].Telephone +
        '</th><th scope="col">' +
        callLogData[i].Duration +
        '</th><th scope="col">' +
        callLogData[i].CallKey +
        '</th><th scope="col">' +
        callLogData[i].Description +
        '</th><th scope="col">' +
        callLogData[i].Disposition +
        "</th></tr>";
    }
    document.getElementById("callLogTable").innerHTML = callLogTable;
  }
}

function DTMFDigit(digit) {
  integration.DTMFDigit(digit);
}

function SetMute() {
  this.MuteValue = !this.MuteValue;
  integration.SetMute(this.MuteValue);
}

function HoldCall() {
  integration.HoldCall();
}

function speakerVolume() {
  integration.volumeControl(
    0,
    document.getElementById("speakerVolumeTxt").value
  );
}

function microphoneVolume() {
  integration.volumeControl(
    1,
    document.getElementById("microphoneVolumeTxt").value
  );
}

function addMark() {
  integration.addMark();
}

function disposeCampaingCall() {
  // getLastCallData();
  let dispositionId, camId, callID, subId;
  dispositionId = document.getElementById("selectDisposition").value;
  camId = document.getElementById("camIdTxt").value;
  callID = document.getElementById("callIdTxt").value;
  subId = document.getElementById("selectSubDisposition").value;

  integration.disposeCampaingCall(dispositionId, camId, callID, subId);
}
function errorOnDispose(error) {
  printToConsole("errorOnDispose ");
  printToConsole(error.code + "-" + error.message);
}
function onDisposeApplied() {
  printToConsole("Disposition Applied");
}
function saveDispositions() {
  getLastCallData();
  if (document.getElementById("callTypeTxt").value == 2) {
    this.disposeCampaingCall();
  } else {
    this.disposeACDCall();
  }
}
function getDispositions() {
  getLastCallData();
  if (document.getElementById("callTypeTxt").value == 2) {
    getCampaignDispositions();
  } else {
    getACDDispositions();
  }
}

function getACDDispositions() {
  var acdId = document.getElementById("camIdTxt").value;
  integration.getACDDispositions(acdId);
}
function getCampaignDispositions() {
  var campaignId = document.getElementById("camIdTxt").value;
  console.log("campaignId", campaignId);
  integration.getCampaignDispositions(campaignId);
}

function disposeACDCall() {
  //getLastCallData();
  let dispositionId, callID, subId;
  dispositionId = document.getElementById("selectDisposition").value;
  callID = document.getElementById("callIdTxt").value;
  subId = document.getElementById("selectSubDisposition").value;

  integration.dispositionACDCall(dispositionId, callID, subId);
}
function onDispositions(disposition) {
  document.getElementById("selectDisposition").innerHTML = "";
  let dispositionList = document.getElementById("selectDisposition");

  let option = document.createElement("option");
  option.text = "Select Disposition";
  dispositionList.add(option);

  for (i = 0; i < disposition.length; i++) {
    if (disposition[i] !== undefined) {
      let option = document.createElement("option");
      option.text = disposition[i].Description;
      option.value = disposition[i].Id;
      option.canreprogram = disposition[i].CanReprogram;
      dispositionList.add(option);
    }
  }

  dispositionList.addEventListener("change", function(event) {
    var dispositionId = event.target.value;
    var sub;
    for (i = 0; i < disposition.length; i++) {
      if (disposition[i] !== null && disposition[i].Id == dispositionId) {
        sub = disposition[i].SubDisposition;
        break;
      }
    }
    let subDispositionList = document.getElementById("selectSubDisposition");
    document.getElementById("selectSubDisposition").innerHTML = "";

    let option = document.createElement("option");
    option.text = "Select SubDisposition";
    subDispositionList.add(option);

    if (sub !== null) {
      for (var key in sub) {
        if (sub.hasOwnProperty(key)) {
          let option = document.createElement("option");
          option.text = sub[key].Description;
          option.value = sub[key].Id;
          subDispositionList.add(option);
        }
      }
    }
  });
}
function wrongNumber(phoneNumber) {
  printToConsole("Wrong Number:" + phoneNumber);
  console.log("prueba wrongNumber phoneNumber", phoneNumber);
}

function timeZoneNumber(number) {
  printToConsole("TimeZoneNumber " + number);
}
/**
 *  callResult.dialResult contiene el resultado de la marcacion manual realizada por el agente.
 *  1 -- SE CONTESTO LA LLAMADA
 *  2 ---NUMERO OCUPADO
 *  3 --- NUMERO MARCADO NO CONSTESTA
 *  4 --- EL NUMERO QUE SE MARCO FUE EL DE UN FAX
 *  5 --- NO HAY TONO  DE MARCADO
 *  8 --- EL AGENTE ESTA EN OTRO ESTADO
 *  10 --- NO HAY SERVICIO DE TELEFONIA
 *  11 --- CONTESTO UNA CONSTADORA AUTOMATICA
 *  12 --- EL AGENTE ESTA RECIBIENDO UNA TRANSFERENCIA/**
 **/
var DialResult = {
  1: "Answer",
  2: "Busy",
  3: "Not Answer",
  4: "Fax/Modem",
  5: "NoDialTone",
  8: "Other",
  10: "NoService",
  11: "VoiceMail/Machine",
  12: "Circut Busy",
  13: "Cancelled"
};

function onDialResult(callResult) {
  var descripResult;
  if (callResult.dialResult in DialResult) {
    descripResult = DialResult[callResult.dialResult];
  } else {
    descripResult = "Not Exists Result";
  }
  console.log("onDialResult id", callResult);
  printToConsole(descripResult);
}
function onLogin() {
  printToConsole("onLogin");
}
function onLogOut() {
  printToConsole("onLogOut");
}
function numberOnDoNotCallList() {
  printToConsole("prueba numberOnDoNotCallList");
}
function onCallRecieved(callData) {
  printToConsole("prueba onCallRecieved", callData);
}
function GetAgentID() {
  integration.GetAgentID();
}
function agentId(UserID) {
  document.getElementById("UserIDTxt").value = UserID.data;
}
function GetUserName() {
  integration.GetUserName();
}
function userName(Login) {
  document.getElementById("LoginTxt").value = Login.data;
}
function GetExtension() {
  integration.GetExtension();
}
function extension(Extension) {
  document.getElementById("ExtensionTxt").value = Extension.data;
}
function onCallEnds(message) {
  printToConsole(
    "Call completed with ${message.dialogTime} seconds of dialog time."
  );
}
function onDialingNumber(message) {
  printToConsole("Calling " + message.phoneNumber + "...");
}
function ChangePassword() {
  let currentPassword = document.getElementById("cpassword").value;
  let newPassword = document.getElementById("npassword").value;
  integration.ChangePassword(currentPassword, newPassword);
}
function onErrorPasswordUpdate(message) {
  console.log("prueba message", message);
  for (i = 0; i < message.length; i++) {
    if (message[i] !== undefined) {
      printToConsole(message[i].description);
    }
  }
}
function onPasswordUpdated() {
  printToConsole("On password update");
}
function printToConsole(message) {
  document.getElementById("txtConsole").value =
    document.getElementById("txtConsole").value + "\n" + message;
}
function getCampaignDispositionsAndNumbers() {
  getLastCallData();
  var idCampaign = document.getElementById("camIdTxt").value;
  var callOutID = document.getElementById("calloutTxt").value;
  integration.getCampaignDispositionsAndNumbers(idCampaign, callOutID);
}
function onPhoneNumbers(phoneNumbers) {
  console.log("prueba onPhoneNumbers", phoneNumbers);
  document.getElementById("selectNumbers").innerHTML = "";
  let NumberList = document.getElementById("selectNumbers");
  let option = document.createElement("option");
  option.text = "Select Number";
  NumberList.add(option);
  if (phoneNumbers) {
    for (i = 0; i < phoneNumbers.length; i++) {
      if (phoneNumbers[i] !== undefined && phoneNumbers[i] !== "") {
        let option = document.createElement("option");
        option.text = phoneNumbers[i];
        option.value = phoneNumbers[i];
        NumberList.add(option);
      }
    }
  }
}
function remoteLoginError(message) {
  printToConsole("remoteLoginError: " + message.code + " - " + message.message);
}
function onCallsOnQueue(CallOnQueue) {
  console.log("onCallsOnQueue:", CallOnQueue);
  timeCounter = secondsToFormat(++secs, true);
  secs = CallOnQueue.secondsOnQueue;
  if (intervalCallQueue !== undefined) {
    clearInterval(intervalCallQueue);
  }
  if (CallOnQueue.nQueue > 0) {
    intervalCallQueue = setInterval(onNextSecond, 1000);
  }
}
function secondsToFormat(seconds, hours) {
  var date = new Date(null);
  date.setSeconds(seconds);
  return hours
    ? date.toISOString().substr(11, 8)
    : date.toISOString().substr(14, 5);
}
function onNextSecond() {
  timeCounter = secondsToFormat(++secs, true);
  document.getElementById("queue").innerHTML =
    "IdACD:" + acdId + " Time:" + timeCounter;
}
function ReprogramCall() {
  getLastCallData();
  if (document.getElementById("callTypeTxt").value == 2) {
    this.reprogramCampaignCall();
  } else {
    this.callbackAcd();
  }
}
function reprogramCampaignCall() {
  let idCampaign,
    idDisposition,
    callID,
    dateCallBack,
    telephone,
    existingNumber,
    subId;
  idCampaign = document.getElementById("camIdTxt").value;
  idDisposition = document.getElementById("selectDisposition").value;
  callID = document.getElementById("callIdTxt").value;
  dateCallBack = document.getElementById("dateReschedule").value;
  dateCallBack = dateCallBack.replace(/-/g, "/");
  dateCallBack = dateCallBack.replace(/T/, " ");
  existingNumber = document.getElementById("existingOutCheck").checked;
  subId = document.getElementById("selectSubDisposition").value;

  if (existingNumber) {
    telephone = document.getElementById("phoneNumOutTxt").value;
  } else {
    telephone = document.getElementById("selectNumbers").value;
  }
  console.log("reprogramCampaignCall");
  integration.reprogramCampaignCall(
    idCampaign,
    idDisposition,
    callID,
    dateCallBack,
    telephone,
    existingNumber,
    subId
  );
}
function reprogramAcdCall() {
  getLastCallData();
  let idDisposition, callID, subId;
  idDisposition = document.getElementById("selectDisposition").value;
  callID = document.getElementById("callIdTxt").value;
  subId = document.getElementById("selectSubDisposition").value;
  integration.disposeACDCall(idDisposition, callID, subId);
}
function callbackAcd() {
  var existNum = document.getElementById("existingOutCheck").checked;
  var idCampaign = document.getElementById("camIdTxt").value;
  var idDisposition = document.getElementById("selectDisposition").value;
  var callID = document.getElementById("callIdTxt").value;
  var dateCallBack = document.getElementById("dateReschedule").value;
  dateCallBack = dateCallBack.replace(/-/g, "/");
  dateCallBack = dateCallBack.replace(/T/, " ");
  var telephone = existNum
    ? document.getElementById("phoneNumOutTxt").value
    : document.getElementById("selectNumbers").value;
  var callKey = document.getElementById("callKey").value;
  var data1 = document.getElementById("data1Txt").value;
  var data2 = document.getElementById("data2Txt").value;
  var data3 = document.getElementById("data3Txt").value;
  var data4 = document.getElementById("data4Txt").value;
  var data5 = document.getElementById("data5Txt").value;
  var subDis = document.getElementById("selectSubDisposition").value;
  integration.CallBackAcd(
    idCampaign,
    idDisposition,
    callID,
    dateCallBack,
    telephone,
    callKey,
    data1,
    data2,
    data3,
    data4,
    data5,
    existNum,
    subDis
  );
}
function saveReprogram() {
  this.reprogramCampaignCall();
  this.reprogramAcdCall();
}
function onReprogramCall(message) {
  printToConsole("onReprogramCall endDate: " + message.endDate);
  printToConsole("onReprogramCall defaultDate: " + message.defaultDate);
  printToConsole("onReprogramCall callBacks: " + message.callBacks);
  printToConsole("onReprogramCall startDate: " + message.startDate);
  printToConsole("onReprogramCall hasReprogram: " + message.hasReprogram);
  enbledReprogramCall(message);
}
function enbledReprogramCall(message) {
  if (message.hasReprogram) {
    var startDate = message.startDate.replace(new RegExp("/", "g"), "-");
    var endDate = message.endDate.replace(new RegExp("/", "g"), "-");
    document
      .getElementById("dateReschedule")
      .setAttribute("min", startDate + "T00:00");
    document
      .getElementById("dateReschedule")
      .setAttribute("max", endDate + "T00:00");
  }
}
function errorOnUnavailableStatus(data) {
  printToConsole(
    "errorOnUnavailableStatus: " + data.code + " - " + data.message
  );
}
function errorOnUnavailableStatusHistory(data) {
  printToConsole(
    "errorOnUnavailableStatusHistory: " + data.code + " - " + data.message
  );
}
function errorOnCampaignsRelated(data) {
  printToConsole(
    "errorOnCampaignsRelated: " + data.code + " - " + data.message
  );
}
function errorOnDialProcess(data) {
  printToConsole("errorOnDialProcess: " + data.code + " - " + data.message);
}

function onError(data) {
  printToConsole("onError: " + data.code + " - " + data.message);
}
function errorOnDispositionList(data) {
  printToConsole("errorOnDispositionList: " + data.code + " - " + data.message);
}
function errorOnPasswordChange(message) {
  console.log("prueba message error de Integracion Pasada", message);
}
function onDispositionsAndNumbers(message) {
  onPhoneNumbers(message.phoneNumbers);
  onDispositions(message.dispositions);
}
function errorOnDispositionSelected(data) {
  printToConsole(
    "errorOnDispositionSelected: " + data.code + " - " + data.message
  );
}
function getPhoneNumbers() {
  getLastCallData();
  var callOutID = document.getElementById("calloutTxt").value;
  integration.getPhoneNumbers(callOutID);
}
function onReprogramSuccess() {
  printToConsole("onReprogramSuccess");
}
function errorOnDispositionsPhonesList(data) {
  printToConsole(
    "errorOnDispositionsPhonesList: " + data.code + " - " + data.message
  );
}
function recordingStopStart() {
  integration.recordingStopStart();
}
function errorOnPhoneNumbersList(data) {
  printToConsole(
    "errorOnPhoneNumbersList: " + data.code + " - " + data.message
  );
}
function errorOnCallHistory(data) {
  printToConsole("errorOnCallHistory: " + data.code + " - " + data.message);
}
function onIVRList(IVRList) {
  printToConsole("onIVRList");
  document.getElementById("IVRList").innerHTML = "";
  let tempIVRList = document.getElementById("IVRList");
  for (i = 0; i < IVRList.length; i++) {
    let option = document.createElement("option");
    option.text = IVRList[i].id + "=" + IVRList[i].name;
    option.value = IVRList[i].id;
    tempIVRList.add(option);
  }
}
function onIdleStart(IVRId) {
  printToConsole("onIdleStart: " + IVRId);
}
function onIdleEnd(IVRInput) {
  printToConsole("onIdleEnd: " + IVRInput);
}
function getIVRList() {
  integration.getIVRList();
}
function idleStart() {
  var IVRId = document.getElementById("IVRList").value;
  integration.idleStart(IVRId);
}
