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
var pulsingIconProgramDisi;
var program;
var ilceSinir;
var geojson;
var kayitliDurum;
var yapiKayit;
var tescil;

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
    
    
    /*
    ObjOverlays ={
        "Belediye ve Mücavir Alan Sınırı " : ellikm, 
        "Program Durumu " : markerIsim
    }
    */
    // L.control.layers(baseLayers, ObjOverlays).addTo(map);

    // Program.js - Pulse Icon 
    pulsingIconProgramDevam = L.icon.pulse({iconSize:[20,20],color:'red',fillColor:'red',animate:true});
    pulsingIconProgramBitti = L.icon.pulse({iconSize:[20,20],color:'#1d91c0',fillColor:'#DFFF00',animate:false});
    pulsingIconProgramDisi = L.icon.pulse({iconSize:[10,10],color:'#1d91c0',fillColor:'#00e640',animate:false});
    pulsingIconYapiKayit = L.icon.pulse({iconSize:[10,10],color:'#1d91c0',fillColor:'#8c14fc',animate:false});
    pulsingIconTescil = L.icon.pulse({iconSize:[10,10],color:'#1d91c0',fillColor:'black',animate:false});
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
                layer.bindTooltip('<b>'+ feature.properties.ilce + ' / ' + feature.properties.mahalle + '</b><br><table style="width:100%"><tr align="left"><td>Programa Alınan Taşınmaz Sayısı : </td><td align="right">'+feature.properties.tespitiYapilacak+'</td></tr><tr><td align="left">Tespiti Yapılan : </td><td align="right">'+ feature.properties.tespitiYapilan+'</td></tr><tr><td align="left">Tamamlanma Durumu : </td><td align="right"><b> % '+ Math.round((feature.properties.tespitiYapilan*100)/feature.properties.tespitiYapilacak) +'</b></td></tr></table><br /><small>(Son Güncelleme : 25.10.2021)</small>');
            }
            else if(feature.geometry.type==='Point' && feature.properties.program==='bitti'){
                layer.setIcon(pulsingIconProgramBitti)
                layer.bindTooltip('<b>'+ feature.properties.ilce + ' / ' + feature.properties.mahalle + '</b><br><table style="width:100%"><tr align="left"><td>Programa Alınan Taşınmaz Sayısı : </td><td align="right">'+feature.properties.tespitiYapilacak+'</td></tr><tr><td align="left">Tespiti Yapılan : </td><td align="right">'+ feature.properties.tespitiYapilan+'</td></tr><tr><td align="left">Tamamlanma Durumu : </td><td align="right"><b> % '+ Math.round((feature.properties.tespitiYapilan*100)/feature.properties.tespitiYapilacak) +'</b></td></tr></table><br /><small>(25.10.2021 tarihi itibariyle)</small>');
            }
        }
    }).addTo(map);

    kayitliDurum = L.geoJSON(kayitliDurum,{
        style: function(feature){
            return {
                color:'#000',
                weight:0.5
            }
        },
        onEachFeature: function(feature, layer){
            if(feature.geometry.type==='Point' && feature.properties.program==='Program Dışı'){
                layer.setIcon(pulsingIconProgramDisi)
                layer.bindTooltip('<b>'+ feature.properties.ilce + ' / ' + feature.properties.mahalle + '</b><br><table style="width:100%"><tr><th align="left">Tespiti Yapılan Taşınmazın Tipi&nbsp;&nbsp;</th><th align="right">&nbsp;Adet </th></tr><tr><td align="left">DHTA :</td><td align="right">'+ feature.properties.DHTA+'</td></tr><tr><td align="left">İlişik :</td><td align="right">'+ feature.properties.ilisik+'</td></tr><tr><td align="left">Tescilli :</td><td align="right">'+ feature.properties.tescilli+'</td></tr><tr><td align="left"><b>Toplam :</b></td><td align="right"><b>'+ (feature.properties.DHTA +feature.properties.ilisik+feature.properties.tescilli)+'</b></td></tr></table><br /><small>(27.10.2021 tarihi itibariyle)</small>');
            }
        }
    }).addTo(map);

    yapiKayit = L.geoJSON(yapiKayit,{
        style: function(feature){
            return {
                color:'#000',
                weight:0.5
            }
        },
        onEachFeature: function(feature, layer){
            if(feature.geometry.type==='Point' && feature.properties.program==='Yapı Kayıt'){
                layer.setIcon(pulsingIconYapiKayit)
                layer.bindTooltip('<b>'+ feature.properties.ilce + ' / ' + feature.properties.mahalle + '</b><br><table style="width:100%"><tr><td align="left">Tespiti Yapılan Yapı Kayıt Belgesi Sayısı : </td><td align="right">'+ feature.properties.adet+'</td></tr></table><br /><small>(25.10.2021 tarihi itibariyle)</small>');
            }
        }
    }).addTo(map);

    tescil = L.geoJSON(tescil,{
        style: function(feature){
            return {
                color:'#000',
                weight:0.5
            }
        },
        onEachFeature: function(feature, layer){
            if(feature.geometry.type==='Point' && feature.properties.program==='Tescil'){
                layer.setIcon(pulsingIconTescil)
                layer.bindTooltip('<b>'+ feature.properties.ilce + ' / ' + feature.properties.mahalle + '</b><br><table style="width:100%"><tr><td align="left">Tescil İncelemesi Yapılan Taşınmaz Sayısı : </td><td align="right">'+ feature.properties.adet+'</td></tr></table><br /><small>(25.10.2021 tarihi itibariyle)</small>');
            }
        }
    }).addTo(map);

    ilceSinir = L.geoJson(ilce, {fill:false, weight:1.5}).addTo(map);

    geojson = L.geoJson(tasinmazBilgileri, {
        style: style,
        onEachFeature: onEachFeature
      }).bindPopup(function(layer){
        return ('<h4>'+layer.feature.properties.name+'</h4>' + '<br>' +
        '<table style="width:100%"><tr align="left"><th><u>Taşınmaz Tipi</u></th><th align="right"><u>Adet</u></th></tr><tr align="left"><td>DHTA           : </td><td align="right">'+layer.feature.properties.tasinmazSayilari.DHTA+'</td></tr><tr><td align="left">İlişikli       : </td><td align="right">'+ layer.feature.properties.tasinmazSayilari.ilisikli +'</td></tr><tr><td align="left">Tescilli       : </td><td align="right">'+ layer.feature.properties.tasinmazSayilari.tescilli +'</td></tr><tr><td align="left"><b>Genel Toplam : </b></td><td align="right"><b>'+ layer.feature.properties.tasinmazSayilari.genelToplam +'</b></td></tr></table>'+'<br><small>'+'(21.09.2021 tarihi itibariyle)</small>');
      }).addTo(map);
   
    function getColor(d) {
        return d > 10000 ? '#800026' :
                d > 9000  ? '#bd0026' :
                d > 8000  ? '#e31a1c' :
                d > 7000  ? '#fc4e2a' :
                d > 6000  ? '#fd8d3c' :
                d > 5000  ? '#feb24c' :
                d > 4000  ? '#fed976' :
                d > 3000  ? '#ffeda0' :
                d > 2000  ? '#FFEDA0' :
                            '#ffffcc';
    }
    function style(feature) {
        return {
            weight: 2,
            opacity: 1,
            color: 'blue',
            dashArray: '3',
            fillOpacity: 0.7,
            fillColor: getColor(feature.properties.tasinmazSayilari.genelToplam)
        };
    }
    function highlightFeature(e) {
        var layer = e.target;
      
        layer.setStyle({
          weight: 5,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.7,
        });
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          layer.bringToFront();
        }
    }
    function resetHighlight(e) {
        geojson.resetStyle(e.target);
    }
    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }

    ellikm = L.circle([39.94185302152969,32.854474782943726], {radius:50000, color:"red", weight:2, fill:false}).bindPopup("Belediye ve Mücavir Alan Sınırı").openPopup().bringToFront().addTo(map);
    
    ObjOverlays ={
        "Belediye ve Mücavir Alan Sınırı " : ellikm, 
        "<b>Program Durumu </b>"           : program,
        "Tespiti Yapılan Taşınmazlar "     : kayitliDurum,
        "İlçe Sınırları "                  : ilceSinir,
        "Aktif Taşınmaz Sayıları"          : geojson,
        "Yapı Kayıt Belgesi Tespitleri"    : yapiKayit,
        "Tescil İncelemesi"                : tescil
    }

    L.control.layers(baseLayers, ObjOverlays).addTo(map);
});


 