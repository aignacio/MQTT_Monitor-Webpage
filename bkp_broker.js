var sys = require('sys');
var net = require('net');
var mqtt = require('mqtt');
var fs = require('fs');

var io  = require('socket.io').listen(8080);
var client = mqtt.connect('mqtt://aignacio.com');
var log = fs.createWriteStream('log.json', {'flags': 'a'});

var text = fs.readFileSync('log.txt','utf8')

io.sockets.on('connection', function (socket) {
  socket.on('subscribe', function (data) {
    console.log('Subscribing to '+data.topic);
    client.subscribe(data.topic);
    io.sockets.emit('restore_mqtt',text);
  });
});

client.on('message', function (topic, message) {
  sys.puts(topic+'='+message);
  io.sockets.emit('mqtt',{'topic':String(topic),
    'payload':String(message)});
  console.log(message.toString());
  log.write(topic+'='+message+'\n');
  // client.end();
});
 
// client.addListener('mqttData', function(topic, payload){
  
// });