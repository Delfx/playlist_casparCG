const notifier = require('node-notifier');

class Notification {
    notification(title, name) {
        notifier.notify({
            title: title,
            message: name
        });
    }
}

module.exports = Notification;
