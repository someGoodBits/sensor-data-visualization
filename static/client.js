var socket = io();

let absoluteSensorData = null;
let aclData = null;
let gyroData = null;
let clock ;

socket.on("connect", () => {

    let cliendIDElement = document.querySelector(".client-id");
    
    cliendIDElement.innerHTML = `Connected as ${socket.id}`;

    const sensorAbs = new AbsoluteOrientationSensor({ frequency: 60 });
    let acl = new Accelerometer({ frequency: 60 });
    let gyroscope = new Gyroscope({ frequency: 60 });

    gyroscope.start();
    sensorAbs.start();
    acl.start();

    gyroscope.addEventListener("reading", () => {
        gyroData = {
            x: gyroscope.x,
            y: gyroscope.y,
            z: gyroscope.z,
        };
    });
    
    sensorAbs.onreading = () => {
        absoluteSensorData = sensorAbs.quaternion;
    };
    
    acl.onreading = () => {
        aclData = { x: acl.x, y: acl.y, z: acl.z };
    };

    setInterval(()=>{
        socket.emit("sensor-data",{
            absoluteSensorData,
            gyroData,
            aclData,
            id : socket.id
        })
    },30)
});
