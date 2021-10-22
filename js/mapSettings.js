var map;
var ellikm;
var ObjOverlays;
var enlem;
var boylam;
var programaAlinanMahalle;
var programaAlinanTasinmazAdet;
var markerIsim;
var iconDurum;
var pulsingIconProgramDevam;
var pulsingIconProgramBitti;
var program;

$(document).ready(function(){

    // config map
    let config = {
        minZoom: 3,
        maxZoom: 25,
        zoomControl: false, // zoom control off (sol tarafta + - butonunu iptal eder
        dragging: true, // false yazılırsa, mouse ile tutup çekme iptal eder.
        attributionControl:true // false yazılırsa, haritayı yukarı aşağı indirip yükseltme iptal eder. 
    };
    
    // magnification with which the map will start
    const zoom = 9;
    // co-ordinates
    const lat = 39.941974;
    const lng = 32.854371;
    
    // calling map
    map = L.map('map', config).setView([lat, lng], zoom);
    //  method fitBounds sets a map view                 

    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
        attribution: '&copy; ',
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });
    var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
        attribution: '&copy; ',
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });
    var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        attribution: '&copy; ',
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });
    var openTopo = L.tileLayer('https://tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; ',
        maxZoom: 16,
        subdomains:['mt0','mt1','mt2','mt3']
    });
    
    var baseLayers = {
        "Open Street Map": osm,
        "Open Topo Map"  : openTopo,
        "Google Sokak"   : googleStreets,
        "Google Hibrit"  : googleHybrid,
        "Google Uydu"    : googleSat
    };
    
    ellikm = L.circle([39.94185302152969,32.854474782943726], {radius:50000, color:"red", weight:2, fill:false}).bindPopup("Belediye ve Mücavir Alan Sınırı").openPopup().addTo(map);
    /*
    ObjOverlays ={
        "Belediye ve Mücavir Alan Sınırı " : ellikm, 
        "Program Durumu " : markerIsim
    }
    */
    // L.control.layers(baseLayers, ObjOverlays).addTo(map);

    // Program.js - Pulse Icon 
    pulsingIconProgramDevam = L.icon.pulse({iconSize:[20,20],color:'red',fillColor:'red',animate:true});
    pulsingIconProgramBitti = L.icon.pulse({iconSize:[20,20],color:'#1d91c0',fillColor:'#1d91c0',animate:false});

    console.log(program['features'].length);

    console.log(program['features'][0]['geometry']['coordinates'][0]);

    enlem = program.features[0].geometry.coordinates[0];
    boylam = program.features[0].geometry.coordinates[1];
    iconDurum = program.features[0].properties.program;
    console.log(iconDurum);
    console.log(enlem,boylam);
    console.log(program.features[0].properties.name);

    /*
    for(var i = 0; i < program.features.length; i++){
        enlem = program.features[i].geometry.coordinates[0];
        boylam = program.features[i].geometry.coordinates[1];
        programaAlinanMahalle = program.features[i].properties.name;
        programaAlinanTasinmazAdet = program.features[i].properties.adet;
        iconDurum = program.features[i].properties.program;
        if(iconDurum=='devam'){
            iconDurum = pulsingIconProgramDevam;
        }
        if(iconDurum=='bitti'){
            iconDurum = pulsingIconProgramBitti;
        }
        // markerIsim = 'marker'+'_'+i;
        console.log(markerIsim);
        markerIsim = L.marker([boylam,enlem],{icon:iconDurum}).bindTooltip('<b>'+ programaAlinanMahalle + '</b><br>' + 'Programa Alınan Taşınmaz Sayısı : ' +'<b>'+ programaAlinanTasinmazAdet + '</b><br>'+ 'Tespiti Yapılan : '+'<br>'+'Durum : '+ '<br><b>'+ ''+'</b>').addTo(map);
    }
    /* Katmana Ekle
        Belediye mücavir alan sınırları 
        Programa alınan Pulse Icon
    

        var myLines = [{
            "type": "LineString",
            "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
        }, {
            "type": "LineString",
            "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
        }];
        
        var myStyle = {
            "color": "#ff7800",
            "weight": 5,
            "opacity": 0.65
        };
        
        L.geoJSON(myLines, {
            style: myStyle
        }).addTo(map);
*/

        //var program2 = L.geoJSON(program, {style: pulsingIconProgramDevam}).addTo(map);

        var popup = L.popup();

    var blackIcon = L.icon({
        iconUrl: 'maps-and-flags.png',
        iconSize: [50,50],
        iconAnchor: [32,74],
        popupAnchor: [0,-50]
    });

    program = L.geoJSON(program,{
        style: function(feature){
            return {
                color:'#000',
                weight:0.5
            }
        },
        onEachFeature: function(feature, layer){
            if(feature.geometry.type==='Point' && feature.properties.program==='devam'){
                layer.setIcon(pulsingIconProgramDevam)
                layer.bindTooltip('<b>'+ feature.properties.name + '</b><br>' + 'Programa Alınan Taşınmaz Sayısı : ' +'<b>'+ feature.properties.adet + '</b><br>'+ 'Tespiti Yapılan : '+'<br>'+'Durum : '+ '<br><b>'+ ''+'</b>');
            }
            else if(feature.geometry.type==='Point' && feature.properties.program==='bitti'){
                layer.setIcon(pulsingIconProgramBitti)
                layer.bindTooltip('<b>'+ feature.properties.name + '</b><br>' + 'Programa Alınan Taşınmaz Sayısı : ' +'<b>'+ feature.properties.adet + '</b><br>'+ 'Tespiti Yapılan : '+'<br>'+'Durum : '+ '<br><b>'+ ''+'</b>');
            }
        }
    }).addTo(map);

    ObjOverlays ={
        "Belediye ve Mücavir Alan Sınırı " : ellikm, 
        "Program Durumu " : program
    }

    L.control.layers(baseLayers, ObjOverlays).addTo(map);
});


 