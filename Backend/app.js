
// Headere si importuri necesare
var SerialPort = require("serialport");
var portName = 'COM8';
const express = require("express");
const http = require("http");
const socketIo = require("socket.io")
const port = 8000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: '*',
    }
  });


// Socket prin care conectam real-time server-ul de website
io.on("connection", (socket) => {
    console.log("New client connected");

    // Initializam portul de Arduino
    var arduinoSerialPort = new SerialPort(portName, {  
        baudRate: 9600
       });
    
    // Deschidem portul de Arduino
    arduinoSerialPort.on('open',function() {
        console.log('Serial Port ' + portName + ' is opened.');
    });

    // Trimitem informatii prin socket cand primim de la Arduino
    arduinoSerialPort.on('data', function (data) {
        // Valoarea curenta
        let currentValue = Number(data.toString());
        
        // Daca valoarea curenta e mai mare de 10 (evitam spamul), trimitem spre website
        if (currentValue > 20) {
            socket.emit('FromAPI', currentValue);
        }
    })

    // Cand deconectam socketul eliberam portul ca sa il putem refolosi
    socket.on("disconnect", () => {
      console.log("Client disconnected");
      arduinoSerialPort.close();
    });
  });

  server.listen(port, () => console.log(`Listening on port ${port}`));


