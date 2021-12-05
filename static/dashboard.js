var socket = io();

let connectedClients = {};
let selectedClient = null;
let gyroDataElement ;
let aclerometerDataElement ;

socket.on("connect", () => {
    console.log("connected");

    socket.on("sensor-data", (clientData) => {
        connectedClients[clientData.id] = clientData;
    });

    socket.on("client-connect", (clientID) => {
        clientID !== socket.id && console.log("Client Connected", clientID);
        clientID !== socket.id && (connectedClients[clientID] = {});
        console.log("CC", connectedClients);
        updateClients()
    });

    socket.on("client-disconnect", (clientID) => {
        clientID !== socket.id && console.log("Client Disconnected", clientID);
        clientID !== socket.id && delete connectedClients[clientID];
        console.log("CD", connectedClients);
        updateClients()
    });
});

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x181d25);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.BoxGeometry(2, 0.5, 4);
const material = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function updateCube(quaternion) {
    cube.quaternion.fromArray([quaternion[0], quaternion[2], -quaternion[1], quaternion[3]]);
}

const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 10);
scene.add(light);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    if(selectedClient && connectedClients[selectedClient]) {
        if(connectedClients[selectedClient].absoluteSensorData){
            updateCube(connectedClients[selectedClient].absoluteSensorData);
        }
    }

    displayAclData();
    displayGyroData();
}

let clientListContainer;

window.onload = () => {
    clientListContainer = document.querySelector(".client-list");
    document.body.appendChild(renderer.domElement);
    animate();

    gyroDataElement = document.querySelector(".gyro-data");
    aclerometerDataElement = document.querySelector(".acl-data");
};

function updateClients() {
    clientListContainer.innerHTML = "";
    Object.keys(connectedClients).forEach((cid) => {
        let html = `
        <div class="item" id="${cid}" onClick="select(event,'${cid}')">
            <div class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                        <path d="M12 18h.01"></path>
                    </g>
                </svg>
            </div>
            <div class="name">${cid}</div>
        </div>`;
        clientListContainer.innerHTML += html;
    });
}

function select(e,cid){
    [...document.querySelectorAll(".active")].forEach(c => {
        c.classList.remove("active");
    })
    document.getElementById(cid).classList.add("active")
    selectedClient = cid ;
}

function displayAclData(){
    if(selectedClient && connectedClients[selectedClient]) {
        if(connectedClients[selectedClient].aclData){
            let d = connectedClients[selectedClient].aclData;
            aclerometerDataElement.innerHTML = `
            <div>x : ${d.x.toFixed(4)}</div>
            <div>y : ${d.y.toFixed(4)}</div>
            <div>z : ${d.z.toFixed(4)}</div>`
        }
    }
}

function displayGyroData(){
    if(selectedClient && connectedClients[selectedClient]) {
        if(connectedClients[selectedClient].gyroData){
            let d = connectedClients[selectedClient].gyroData;
            gyroDataElement.innerHTML = `
            <div>x : ${d.x.toFixed(4)}</div>
            <div>y : ${d.y.toFixed(4)}</div>
            <div>z : ${d.z.toFixed(4)}</div>`
        }
    }
}
