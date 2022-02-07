var key = config.SECRET_API_KEY;
var api_id = config.SECRET_API_ID;
var message_id = config.SECRET_MESSAGE_KEY;
var measure_id = config.SECRET_MEASURE_ID;



class Chatroom {
    constructor(room, username) {
        this.room = room;
        this.username = username;
        this.chats = db.collection('chats');
        this.unsub;
    }
    async addChat(message) {
        // format a chat object
        const now = new Date();
        const chat = {
            message,
            username: this.username,
            room: this.room,
            created_at: firebase.firestore.Timestamp.fromDate(now)
        };
        // save the chat document
        const response = await this.chats.add(chat);
        return response;
    }
    getChats(callback) {
        this.unsub = this.chats
            .where('room', '==', this.room)
            .orderBy('created_at')
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        //update the ui
                        callback(change.doc.data());
                    }
                });
            });
    }
    updateName(username) {
        this.username = username;
    }
    updateRoom(room) {
        this.room = room;
        console.log('room updated');
        if (this.unsub) {
            this.unsub();
        }
    }
}

const chatroom = new Chatroom('general', 'shaun');

chatroom.getChats((data) => {

    console.log(data);
});

setTimeout(() => {
    chatroom.updateRoom('gaming');
    chatroom.updateName('yoshi')
    chatroom.getChats((data) => {
        console.log(data);
    });
    chatroom.addChat('hello');
}, 3000);