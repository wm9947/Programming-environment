var websocket;
var debugLevel = 2;
var MessageData = 'default';
var jointpos;

new(function() {

    websocket = null;
    var ext = this;
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {
            status: 2,
            msg: 'Ready'
        };
    };

    // Functions for block with type 'w' will get a callback function as the
    // final argument. This should be called to indicate that the block can
    // stop waiting.
    ext.wait_time = function(callback) {
        wait = 0.5;
        console.log('Waiting for ' + wait + ' seconds');
        window.setTimeout(function() {
            callback();
        }, wait * 1000);
    };

    ext.setconnection = function(callback) {
        var timeoutID; // need to set a timeout when a socket is created because we are using a 'wait' block
        // Check to make sure that this board was not entered previously
        wsUri = 'ws://' + '127.0.0.1' + ':' + '8000';
        websocket = new WebSocket(wsUri);
        timeoutID = window.setTimeout(noServerAlert, 2000);

        websocket.onopen = function(evt) {
            window.clearTimeout(timeoutID);
            if (debugLevel >= 1)
                console.log('onopen message received');
            doSend("WebSocket Open");
        };
        function noServerAlert() {
            console.log('noServerAlert!');
            boardStatus = 0;
        }
        websocket.onmessage = function(evt) {
            onMessage(evt)
        };
    };
    
    ext.send_data = function(t_message, callback) {
        doSend('message/' + t_message);
        callback();
    };

    ext.body_position_x = function(body) {
        switch (body) {
            case 'head':
                return jointpos[0];
                break;
            case 'neck':
                return jointpos[2];
                break;
            case 'l_shoulder':
                return jointpos[4];
                break;
            case 'r_shoulder':
                return jointpos[6];
                break;
            case 'l_elbow':
                return jointpos[8];
                break;
            case 'r_elbow':
                return jointpos[10];
                break;
            case 'l_hand':
                return jointpos[12];
                break;
            case 'r_hand':
                return jointpos[14];
                break;
            case 'torso':
                return jointpos[16];
                break;
            case 'l_hip':
                return jointpos[18];
                break;
            case 'r_hip':
                return jointpos[20];
                break;
            case 'l_knee':
                return jointpos[22];
                break;
            case 'r_knee':
                return jointpos[24];
                break;
            case 'l_foot':
                return jointpos[26];
                break;
            case 'r_foot':
                return jointpos[28];
                break;
        }
        return 0;
    }
    
    ext.body_position_y = function(body) {
        switch (body) {
            case 'head':
                return jointpos[1];
                break;
            case 'neck':
                return jointpos[3];
                break;
            case 'l_shoulder':
                return jointpos[5];
                break;
            case 'r_shoulder':
                return jointpos[7];
                break;
            case 'l_elbow':
                return jointpos[9];
                break;
            case 'r_elbow':
                return jointpos[11];
                break;
            case 'l_hand':
                return jointpos[13];
                break;
            case 'r_hand':
                return jointpos[15];
                break;
            case 'torso':
                return jointpos[17];
                break;
            case 'l_hip':
                return jointpos[19];
                break;
            case 'r_hip':
                return jointpos[21];
                break;
            case 'l_knee':
                return jointpos[23];
                break;
            case 'r_knee':
                return jointpos[25];
                break;
            case 'l_foot':
                return jointpos[27];
                break;
            case 'r_foot':
                return jointpos[29];
                break;
        }
        return 0;
    }
    
    ext.message = function() {
        return MessageData;
    };
    
    ext.gesture = function(motion) {
        var r_handy = jointpos[15];
        var r_handx = jointpos[14];
        var l_handy = jointpos[13];
        var l_handx = jointpos[12];
        var headx = jointpos[0];
        var heady = jointpos[1];
        var l_shoulderx = jointpos[4];
        var l_shouldery = jointpos[5];
        var r_shoulderx = jointpos[6];
        var r_shouldery = jointpos[7];
        var l_elbowx = jointpos[8];
        var l_elbowy = jointpos[9];
        var r_elbowx = jointpos[10];
        var r_elbowy = jointpos[11];

        var condition = false;
        switch (motion) {
            case 'Right Hand up':
                if (r_shouldery < r_handy && l_shouldery > l_handy)
                    condition = true;
                else
                    condition = false;
                break;
            case 'Left Hand up':
                if (r_shouldery > r_handy && l_shouldery < l_handy)
                    condition = true;
                else
                    condition = false;
                break;
            case 'V':
                if (r_handy > heady && l_handy > heady && l_elbowy > l_shouldery && r_elbowy > r_shouldery && r_handx > r_elbowx && l_handy < l_elbowy && r_elbowx > r_shoulderx && l_elbowx < l_shoulderx)
                    condition = true;
                else
                    condition = false;
                break;
            case 'O':
                if (r_handy > heady && l_handy > heady && l_elbowy > l_shouldery && r_elbowy > r_shouldery && r_handx < r_elbowx && l_handx > l_elbowx && r_elbowx > r_shoulderx && l_elbowx < l_shoulderx)
                    condition = true;
                else
                    condition = false;
                break;
        }
        return condition;
    };
    
    ext.action = function(act, callback) {
        
        switch (act) {
            case 'Action A':
                doSend("A");
                break;
            case 'Action B':
                doSend("B");
                break;
            case 'Action C':
                doSend("C");
                break;
        }
        callback();
    };
    
    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['f', 'Server Connect', 'setconnection'],
            ['w', 'Wait for time', 'wait_time'],
            ['w', 'Message Send: %s', 'send_data', 'default'],
            ['w', 'Run %m.actions', 'action', 'Action A'],
            ['r', '%m.bodys Xpos', 'body_position_x', 'head'],
            ['r', '%m.bodys Ypos', 'body_position_y', 'head'],
            ['b', '%m.motions motion', 'gesture', 'Right Hand up'],
            ['r', 'Message', 'message']
        ],
        menus: {
            bodys: ['head', 'neck', 'l_shoulder', 'r_shoulder', 'l_elbow', 'r_elbow', 'l_hand', 'r_hand', 'torso', 'l_hip', 'r_hip', 'l_knee', 'r_knee', 'l_foot', 'r_foot'],
            motions: ['Right Hand up', 'Left Hand up', 'O'],
            actions: ['Action A', 'Action B', 'Action C']
        }
    };

    // Register the extension
    ScratchExtensions.register('Websocket extension', descriptor, ext);
})();


function onOpen(evt) {
    window.clearTimeout(timeoutID);
    if (debugLevel >= 1)
        console.log('onopen message received');
    doSend("WebSocket rocks");
}

function onClose(evt) {
    console.log("DISCONNECTED");
}

function onMessage(evt) {
    var msg = evt.data.split('/');

    switch (msg[0]) {
        case 'body joint position':
            var temp_joint = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            var j = 1;
            for (var i = 0; i < msg.length; i++) {
                if (i % 2 == 0)
                    temp_joint[i] = msg[j] / 5;
                else
                    temp_joint[i] = msg[j] / 6;
                j++;
            }
            jointpos = temp_joint;
            if (debugLevel >= 2)
                console.log('joint data Receive: head x=' + jointpos[0] + 'y=' + jointpos[1]);
            break;
        case 'message':
            MessageData = msg[1];
            if (debugLevel >= 2)
                console.log('Message data Receive: ' + msg[1]);
            break;
        default:
            if (debugLevel >= 1)
                console.log('unknown message received:' + msg);
    }
}

function onError(evt) {
    if (debugLevel >= 1)
        console.log('<span style="color: red;">ERROR:</span> ' + evt.data);
    websocket.close();
}

function doSend(message) {
    if (debugLevel >= 1)
        console.log("SENT: " + message);
    websocket.send(message);
}

function noServerAlert() {
    if (debugLevel >= 1)
        console.log('WebSocket Timeout alert!!!!!');
}