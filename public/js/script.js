const socket=io();
console.log('hey');

if(navigator.geolocation){
    console.log("yes geolocation is available in windowss");

    navigator.geolocation.watchPosition((position)=>{

        const {latitude,longitude}=position.coords;
        console.log({latitude,longitude});
        socket.emit("send-position",{latitude,longitude});
    }, (error)=>{
        console.log(error);
        
    }, {
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge:0,
    });
}

const map = L.map("map").setView([0, 0], 10);
L.tileLayer(`https://tile.openstreetmap.org/{z}/{x}/{y}.png`, {
    attribution: "© OpenStreetMap contributors",
}).addTo(map);


const markers={};


socket.on("receive-location",(data)=>{

    const {id, latitude,longitude}=data;

    map.setView([latitude,longitude],16);

    if(markers.id){
        markers[id]=setLatLang([latitude,longitude]);
    }
    markers[id]=L.marker([latitude,longitude]).addTo(map); 



});


socket.on("user-disconnected",(id)=>{
    if(markers(id)){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})