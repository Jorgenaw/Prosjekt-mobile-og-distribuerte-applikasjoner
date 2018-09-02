

var     conversationNumber = 1,
        conversationList = document.getElementById("conversationlist"),
        addConversation = document.getElementById('addconversation'),
        sendMessage = document.getElementById("sendmessage"),
        messageArea = document.getElementById("messagecontent"),
        currentConvNumber = 0,
        messageList = document.getElementById("messagelist0")
        conversationButtons = [document.getElementById("0")],
        addPicture = document.getElementById("addpicture");
        
      



function getMessageContent() {
    messageContent = document.getElementById("messagecontent").value;
    return messageContent;
}

function sendTheMessage() {
    
    var messageContent = getMessageContent();

    var e = document.createElement("LI");
    e.className = "sentmessage";
    e.textContent = messageContent;
    
    messageList.append(e);
    
    clearContents(messageArea);
}

function toggleConversation(conversationId) {
    var x = document.getElementById(conversationId);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function clearContents(element) {
    element.value = "";
}

function changeConversation(nextConvNumber) {
    toggleConversation(nextConvNumber);
    toggleConversation(currentConvNumber);
    
}


var img = new Image();
var div = document.getElementById('test');
 
 
img.onload = function() {
 
  div.innerHTML += '<img src="'+img.src+'" />'; 
 
};

 

addConversation.addEventListener('click', function makeConversation() {

    var e = document.createElement("LI");
    e.id = "convnum" + conversationNumber;    
    conversationList.append(e);
    
    
    var el = document.createElement("BUTTON");
    el.id = conversationNumber;
    el.className = "conversation";
    el.textContent = "Conversation " + conversationNumber;
    
    document.getElementById("convnum"+conversationNumber).append(el);
    
    conversationButtons.push(document.getElementById(conversationNumber));
    
    conversationNumber++;
    
});

sendMessage.addEventListener('click', sendTheMessage());

messageArea.addEventListener('keydown', function (event) {
    if((event.keyCode || event.charCode) !== 13) return true;
    sendTheMessage();
    return false;
  });


conversationButtons.addEventListener('click', changeConversation());