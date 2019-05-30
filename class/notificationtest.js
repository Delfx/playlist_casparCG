const notifier = require('node-notifier');



class Notification2 {
    notification(title, name) {
        notifier.notify({
            title: title,
            message: name
        });
    }
}



const noti = new Notification2();

noti.notification("test", "test");

