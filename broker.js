var sys = require('sys');
var net = require('net');
var mqtt = require('mqtt');
var io  = require('socket.io').listen(8080);
var client = mqtt.connect('mqtt://aignacio.com');
var jsonfile = require('jsonfile');
var util = require('util');
var file = 'log.json';

var restore_data;
var message_mqtt = { messages :[{ topic:'' , message: '', timestamp: ''}]};

io.sockets.on('connection', function (socket) {
	socket.on('subscribe_main', function (data) {
    	console.log('New client/monitor connected to Socket IO!');
    	client.subscribe(data.topic);
  		jsonfile.readFile(file, function(err, obj) {
			io.sockets.emit('restore_mqtt',obj);
		});
  	});

  	socket.on('subscribe_status', function (data) {
  		client.subscribe(data.topic);
  	});
});

client.on('message', function (topic, message) {
	var topic_m = String(topic);
  	if(topic_m.indexOf("SYS") > -1){
	  	io.sockets.emit('mqtt_status',{'topic':String(topic),'payload':String(message),'timestamp':String(Date())});
	}	
	else{
		io.sockets.emit('mqtt',{'topic':String(topic),'payload':String(message),'timestamp':String(Date())});
	  	SaveLog(topic,message);
	}
});
 
function SaveLog(topic,message) {
	message_mqtt.messages.push({topic: String(topic), message: String(message), timestamp: String(Date())});
	jsonfile.writeFile(file, message_mqtt, function (err) {
	});
}