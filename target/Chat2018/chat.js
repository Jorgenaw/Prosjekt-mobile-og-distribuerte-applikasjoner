class Controller {
    constructor() {
        // Domain datastructures
        let nils = new User('nils', 'Nils');
        let gunnar = new User('gunnar','Gunnar');
        let eva = new User('eva','Eva');
        let petra = new User('petra','Petra');
        this.contacts = new Set([nils,gunnar,eva,petra]);

        this.conversations = [
            new Conversation(uid,new Set(this.contacts),
                [new Message(uid, "Text 1", new Date()),
                 new Message(nils, "Text 2", new Date())]),
            new Conversation(uid,new Set([nils,gunnar]),
                [new Message(uid, "Text 3", new Date()),
                 new Message(gunnar, "Text 4", new Date())])
        ];

        // The selected conversation
        this.selectedConversation = null;

        // Setup Conversation-View
        this.conversation_view = document.getElementById('conversations-view');
        this.conversation_view.style.display = 'block';
        this.conversationsList = document.getElementById('conversations');
        document.getElementById('addconversation').onclick = event => this.addConversation();

        // Setup Message View
        this.contactList  = document.getElementById('contact-list');
        this.message_view = document.getElementById('messages-view');
        this.messagesList = document.getElementById('messages');
        document.getElementById('message-back').onclick = event => this.showConversation();

        // Message edit and send
        this.fileInput = document.getElementById('img-file');
        this.fileInput.onchange = event => this.onImageChange();
        this.image = document.getElementById('image');

        this.textInput = document.getElementById('text');
        this.textInput.onkeydown = event => {
            if(event.code === 'Enter') {
                this.sendMessage();
            }
        };
        document.getElementById('add-img').onclick = event => this.fileInput.click();
        document.getElementById('send').onclick = event => this.sendMessage();


        // Initialize conversations
        for(let i = 0; i < this.conversations.length; i++) {
            let li = this.createMessage(this.conversations[i].messages[0]);
            li.onclick = event => this.openConversation(this.conversations[i]);
            this.conversationsList.appendChild(li);
        }
    }


    /**
     *
     */
    addConversation() {
        this.selectedConversation = new Conversation(uid);
        this.conversations.push(this.selectedConversation);
        this.openConversation(this.selectedConversation);
    }


    /**
     *
     * @param conversation
     */
    openConversation(conversation) {
        this.selectedConversation = conversation;
        this.messagesList.innerHTML = '';
        for(let i = 0; i < this.selectedConversation.messages.length; i++) {
            let msg = this.selectedConversation.messages[i];
            this.messagesList.appendChild(this.createMessage(msg,true));
        }
        this.populateContacts(this.selectedConversation);
        this.showMessage();
    }


    /**
     *
     * @param conversation
     */
    populateContacts(conversation) {
        let to = document.getElementById('to');
        to.innerHTML = '';
        for(let contact of conversation.to) {
            let tag = document.createElement('span');
            tag.innerText = contact.name;
            to.appendChild(tag);
        }

        // Initialize contacts
        this.contactList.innerHTML = '';
        for(let contact of this.contacts) {
            let cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = conversation.to.has(contact);
            cb.id = `c${contact.uid}`;
            cb.onclick = event => {
                cb.checked ?  conversation.to.add(contact) : conversation.to.delete(contact);
                this.updateToField(conversation);
            };

            let label = document.createElement('label');
            label.setAttribute('for', `c${contact.uid}`);
            label.innerText = contact.name;

            let li = document.createElement('li');
            li.appendChild(cb);
            li.appendChild(label);

            this.contactList.appendChild(li);
        }
    }


    /**
     *
     * @param conversation
     */
    updateToField(conversation) {
        let to = document.getElementById('to');
        to.innerHTML = '';
        for(let contact of conversation.to) {
            let tag = document.createElement('span');
            tag.innerHTML = `${contact.name}`;
            to.appendChild(tag);
        }
    }


    /**
     *
     */
    showConversation() {
        this.conversation_view.style.display = 'block';
        this.message_view.style.display = 'none';

        this.clearTempImage();
        this.conversationsList.innerHTML = '';
        for(let i = 0; i < this.conversations.length; i++) {
            let first = this.conversations[i].messages[0];
            if(first === undefined) {
                first = new Message(uid,'',new Date());
            }
            let li = this.createMessage(first);
            li.onclick = event => this.openConversation(this.conversations[i]);
            this.conversationsList.appendChild(li);
        }
    }

    showMessage() {
        this.conversation_view.style.display = 'none';
        this.message_view.style.display = 'flex';
        this.clearTempImage();
        this.textInput.focus();
    }

    sendMessage() {
        if(this.textInput.value.length > 0 || this.hasImage()) {
            let msg = new Message(uid, this.textInput.value, new Date());
            this.selectedConversation.messages.push(msg);
            this.messagesList.appendChild(this.createMessage(msg,true));
            this.messagesList.scrollTop = this.messagesList.scrollHeight;
            this.textInput.value = '';
        }
    }

    onImageChange() {
        if(this.hasImage()) {
            let file = this.fileInput.files[0];
            let obj = new FileReader();
            obj.onload = data => this.image.src = data.target.result;
            obj.readAsDataURL(file);
        }
    }

    hasImage() {
        return this.fileInput.files && this.fileInput.files[0];
    }

    clearTempImage() {
        this.fileInput.value = '';
        this.image.src = '';
    }

    createMessage(msg, rightify = false) {
        let isRight = msg.sender === uid && rightify;
        let classes = 'account-icon material-icons';
        if(isRight) {
            classes += ' account-icon-right';
        }

        let li = document.createElement('li');
        li.setAttribute('class', isRight ? 'message message-right' : 'message');
        li.data = msg;
        li.innerHTML = `
             <i class="${classes}">account_circle</i>
             <div>
                <div>${msg.sender.name}</div>
                <div class="text">${msg.text}</div>
                <div class="date">
                    ${msg.date.toLocaleDateString('nb-NO')} ${msg.date.toLocaleTimeString('nb-NO')}
                </div>
            </div>`;

        // Add image if exist
        if(rightify && (msg.img || this.hasImage())) {
            let image = document.createElement('img');
            if(msg.img) {
                image.src = msg.img;
            } else {
                let reader = new FileReader();
                reader.onload = data => {
                    msg.img = data.target.result;
                    image.src = data.target.result;
                }
                reader.readAsDataURL(this.fileInput.files[0]);
                this.clearTempImage();
            }

            li.appendChild(image);
        }

        return li;
    }
}

class User {
    constructor(uid,name) {
        this.uid = uid;
        this.name = name;
    }
}

class Message {
    constructor(sender, text, date, img = null) {
        this.sender = sender;
        this.text = text;
        this.date = date;
        this.img = img;
    }
}

class Conversation {
    constructor(from, to = new Set(), messages = []) {
        this.from = from;
        this.to = to;
        this.messages = messages;
    }
}

/***
 * Setup application
 */
uid = new User('me','Me');
ctrl = null;
document.addEventListener('DOMContentLoaded', function() {
    this.ctrl = new Controller();
}, false);