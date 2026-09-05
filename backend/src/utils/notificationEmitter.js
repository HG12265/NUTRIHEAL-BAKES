const EventEmitter = require('events');

class NotificationEmitter extends EventEmitter {}

const notificationEmitter = new NotificationEmitter();

// Increase max listeners for multiple admin connections
notificationEmitter.setMaxListeners(50);

module.exports = notificationEmitter;
