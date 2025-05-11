var map = L.map('map').setView([-23.46992851196506, -47.429478807891364], 17); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

  map.locate({setView: true, maxZoom: 16});

  map.on('locationfound', function(e) {
    var radius = e.accuracy / 2;
    L.marker(e.latlng).addTo(map)
      .bindPopup("Você está a " + radius + " metros daqui")
      .openPopup();
    L.circle(e.latlng, radius).addTo(map);
  });