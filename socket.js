$(document).ready(function() {
    var load_data = 1;
    var obj_old, i;

    console.log("Javascript Loaded!");
    var socket = io.connect('http://aignacio.com:8080');
    
    socket.on('connect', function () {
        socket.emit('subscribe_main',{topic:'#'});
        socket.emit('subscribe_status',{topic:'\$SYS/broker/clients/connected'});
        socket.emit('subscribe_status',{topic:'\$SYS/broker/clients/total'});
        socket.emit('subscribe_status',{topic:'\$SYS/broker/messages/received'});
        socket.emit('subscribe_status',{topic:'\$SYS/broker/messages/publish/received'});
        socket.emit('subscribe_status',{topic:'\$SYS/broker/messages/retained/count'});
        socket.emit('subscribe_status',{topic:'\$SYS/broker/clients/maximum'});
        socket.emit('subscribe_status',{topic:'\$SYS/broker/subscriptions/count'});
        socket.emit('subscribe_status',{topic:'\$SYS/broker/uptime'});     

        socket.on('mqtt', function (msg) {
            PrintMessage(msg);
        });

        socket.on('mqtt_status', function (msg) {
            PrintStatus(msg);
        });

        socket.on('restore_mqtt', function (msg) {
            if(load_data){ //Guarantee that with just post one time older posts if someone enter in the monitor
                load_data = 0;
                console.log(msg);
                // console.log(msg.messages.length);
                for(i=(msg.messages.length - 1); i > 1; i--){
                    var data_m = msg.messages[i].timestamp.split(' ');
                    // console.log(data_m[0]);
                    $('#timestamp').prepend(data_m[2] + '/' + data_m[1] + '/' + data_m[3] + '-' + data_m[4] +'</br>');
                    $('#topics_messages').append('<b>' + msg.messages[i].topic + '</b> = ' + msg.messages[i].message + '</br>');
                }
            }
        });
    });
});

function PrintMessage(msg){
    var data_m = msg.timestamp.split(' ');
    // console.log(data_m[0]);
    $('#timestamp').prepend(data_m[2] + '/' + data_m[1] + '/' + data_m[3] + '-' + data_m[4] +'</br>');
    $('#topics_messages').prepend('<b>' + msg.topic + '</b> = ' + msg.payload + '</br>');         
    $('#topics_messages').fadeTo(100, 0.1).fadeTo(200, 1.0);
}

function PrintStatus(msg){
    var topic_m = String(msg.topic)
    if(topic_m.indexOf('clients/connected') > -1){
        $('#clients_connected').html('<b>Clients connected:'+String(msg.payload)+'</b>');
        $("#clients_connected").fadeTo(100, 0.1).fadeTo(200, 1.0);
    }
    else if(topic_m.indexOf('clients/total') > -1){
        $('#clients_total').html('<b>Clients total:'+String(msg.payload)+'</b>'); 
        $("#clients_total").fadeTo(100, 0.1).fadeTo(200, 1.0);
    }
    else if(topic_m.indexOf('messages/received') > -1){
        $('#messages_received').html('<b>Messages received:'+String(msg.payload)+'</b>'); 
        $("#messages_received").fadeTo(100, 0.1).fadeTo(200, 1.0);
    }
    else if(topic_m.indexOf('publish/received') > -1){
        $('#publish_received').html('<b>Publishes received:'+String(msg.payload)+'</b>');
        $("#publish_received").fadeTo(100, 0.1).fadeTo(200, 1.0); 
    } 
    else if(topic_m.indexOf('retained/count') > -1){
        $('#retained_count').html('<b>Retained count:'+String(msg.payload)+'</b>'); 
        $("#retained_count").fadeTo(100, 0.1).fadeTo(200, 1.0);
    } 
    else if(topic_m.indexOf('subscriptions/count') > -1){
        $('#subscriptions_count').html('<b>Subscriptions count:'+String(msg.payload)+'</b>'); 
        $("#subscriptions_count").fadeTo(100, 0.1).fadeTo(200, 1.0);
    } 
    else if(topic_m.indexOf('uptime') > -1){
        $('#uptime').html('<b>Uptime:'+String(msg.payload)+'</b>'); 
        $("#uptime").fadeTo(100, 0.1).fadeTo(200, 1.0);
    }
}
