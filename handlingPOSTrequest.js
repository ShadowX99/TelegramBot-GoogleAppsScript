//simple basic example of handling updates from Telegram bot by Google Apps Script
function doPost(e) {
  
  if (typeof e !== 'undefined') {
    Logger.log(e);
  
    var bot_token = 'XXXXX'; //Telegram bot token 
    var google_doc_id='XXXXX'; //ID of the spreadsheet
    var admin_chat_id='XXXXXX'; // id of the chat of bot owner with bot
  
    var update = JSON.parse(e.postData.contents);
    
    if (update.hasOwnProperty('message')) { //check if bot received a message
      var message = update.message;
      var chatId = message.chat.id; //from what chat update received
      var username=message.from.username;  //user sent the message
      var receivedtext=message.text;  //message text
      var receivedAt=message.date; //time when user sent the message
    
      var google_sheet=SpreadsheetApp.openById(google_doc_id).getSheets()[0]; //get the first sheet in google spreadsheet
      var lastRowFilled=google_sheet.getLastRow()+1;
      google_sheet.getRange('A'+String(lastRowFilled)).setValue(receivedAt);
      google_sheet.getRange('B'+String(lastRowFilled)).setValue(username);
      google_sheet.getRange('C'+String(lastRowFilled)).setValue(receivedtext);
      
      var messageToAdmin='update received from '+String(username);
      
      //form payload to be sent to bot owner
      var payload = {
         'method': 'sendMessage',
         'chat_id': String(admin_chat_id),
         'text': messageToAdmin,
         'parse_mode': 'HTML'
      }     
      var data = {
         'method': 'post',
         'payload': payload
      }
      
      //notify bot owner about received update
      var response=UrlFetchApp.fetch('https://api.telegram.org/bot' + bot_token+'/', data);   
      Logger.log(response);
    }
    
    
  }
  //mandatory part: respond to Telegram server with HTTP 200
  return HtmlService.createHtmlOutput();
  
}