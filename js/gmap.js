"use strict";
let map;

function initProductFinderMap() {
    map = new google.maps.Map(document.getElementById('productFinderMap'), {
        //Utrecht coords
        center: { lat: 52.0841868, lng: 5.0824915 },
        zoom: 8,
        disableDefaultUI: true
    });

    const icon = {
        url: 'images/pointer.svg',
        scaledSize: new google.maps.Size(24, 34),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 36)
    },
        iconActive = {
            url: 'images/pointer-active.svg',
            scaledSize: new google.maps.Size(24, 34),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 36)
        };

    const infoWindow = new google.maps.InfoWindow;

    downloadUrl('js/map-markers-demo.xml', function (data) {
        const xml = data.responseXML,
            markers = xml.documentElement.getElementsByTagName('marker');
        let mapMarkers = [];

        Array.prototype.forEach.call(markers, function (markerElem) {
            const id = markerElem.getAttribute('id'),
                name = markerElem.getAttribute('name'),
                address = markerElem.getAttribute('address'),
                email = markerElem.getAttribute('email'),
                website = markerElem.getAttribute('website'),
                point = new google.maps.LatLng(
                    parseFloat(markerElem.getAttribute('lat')),
                    parseFloat(markerElem.getAttribute('lng'))),
                infowincontent = document.createElement('div'),
                strong = document.createElement('strong'),
                emailLink = document.createElement('a'),
                websiteLink = document.createElement('a');

            emailLink.className = 'text-underline';
            emailLink.setAttribute('href', 'mailto:' + email);

            if (email !== null) {
                emailLink.textContent = email;
            }
            websiteLink.className = 'text-underline';
            websiteLink.setAttribute('href', 'http://' + website);
            if (website !== null) {
                websiteLink.textContent = website;
            }
            strong.textContent = name;
            infowincontent.appendChild(strong);
            infowincontent.appendChild(document.createElement('br'));

            const text = document.createElement('span');
            text.textContent = address;
            infowincontent.appendChild(text);
            infowincontent.appendChild(document.createElement('br'));

            infowincontent.appendChild(emailLink);
            infowincontent.appendChild(document.createElement('br'));

            infowincontent.appendChild(websiteLink);

            const marker = new google.maps.Marker({
                map: map,
                position: point,
                icon: icon,
                zIndex: 9
            });

            marker.addListener('click', function () {
                mapMarkers.filter(function (mapMarker) {
                    return mapMarker.setIcon(icon);
                });
                mapMarkers.filter(function (mapMarker) {
                    return mapMarker.setZIndex(9);
                });
                infoWindow.setContent(infowincontent);
                infoWindow.open(map, marker);
                marker.setIcon(iconActive);
                marker.setZIndex(99);
            });

            mapMarkers.push(marker);
        });

        infoWindow.addListener('closeclick', function () {
            mapMarkers.filter(function (mapMarker) {
                return mapMarker.setIcon(icon);
            });
            mapMarkers.filter(function (mapMarker) {
                return mapMarker.setZIndex(9);
            });
        });
    });
}

function downloadUrl(url, callback) {
    let request = window.ActiveXObject ?
        new ActiveXObject('Microsoft.XMLHTTP') :
        new XMLHttpRequest;

    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            request.onreadystatechange = doNothing;
            callback(request, request.status);
        }
    };

    request.open('GET', url, true);
    request.send(null);
}

function doNothing() { }