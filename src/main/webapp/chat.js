

var     conversationNumber = 1,
        conversationName = 'Conversation',
        conversationList = $("#conversationlist"),
        addConversation = document.getElementById('addconversation'),
        sendMessage = document.getElementById("sendmessage"),
        messageList = $("#messagelist"),
        messageArea = document.getElementById("messagecontent");
        
      



function getMessageContent() {
    messageContent = document.getElementById("messagecontent").value;
    return messageContent;
}

function sendTheMessage() {
    //var messageContent = document.getElementById("messagecontent");
    var messageContent = getMessageContent();
    var messageEl = $("<li class='sentmessage'>"
            + messageContent
            +"</li>"
            );
    
    messageList.append(messageEl);
}


addConversation.addEventListener('click', function makeConversation() {
    var conversationEl = $("<li class='conversation'>"
            + "<button id="
            + conversationName + conversationNumber
            + ">"
            + conversationName + " " +conversationNumber
            + "</button>"
            +'</li>');
    
    conversationList.append(conversationEl);
    
    conversationNumber++;
    
});

sendMessage.addEventListener('click', sendTheMessage());

messageArea.addEventListener('keydown', function (event) {
    if((event.keyCode || event.charCode) !== 13) return true;
    sendTheMessage();
    return false;
  });
