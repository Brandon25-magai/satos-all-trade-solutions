document.addEventListener('DOMContentLoaded', function() {
    class ServiceAreaCalculator {
        constructor() {
            // Center points for your service areas
            this.locations = {
                lena: { lat: 42.3776, lng: -89.8226 },  // Lena, IL
                madison: { lat: 43.0731, lng: -89.4012 }  // Madison, WI
            };

            this.initMap();
            this.setupLocationInput();
        }

        initMap() {
            // Create the map centered between Lena and Madison
            const centerPoint = {
                lat: (this.locations.lena.lat + this.locations.madison.lat) / 2,
                lng: (this.locations.lena.lng + this.locations.madison.lng) / 2
            };

            const map = new google.maps.Map(document.getElementById('serviceAreaMap'), {
                zoom: 9,
                center: centerPoint,
                styles: [
                    {
                        "featureType": "all",
                        "elementType": "geometry",
                        "stylers": [{ "color": "#242f3e" }]
                    },
                    {
                        "featureType": "road",
                        "elementType": "geometry",
                        "stylers": [{ "color": "#38414e" }]
                    }
                ]
            });

            // Add service area circles
            this.addServiceCircle(map, this.locations.lena, '#ff8c00', 'Lena Service Area');
            this.addServiceCircle(map, this.locations.madison, '#ff8c00', 'Madison Service Area');

            // Add markers for main locations
            this.addMarker(map, this.locations.lena, 'Sato\'s All Trade Solutions - Lena HQ');
            this.addMarker(map, this.locations.madison, 'Madison Service Area');
        }

        addServiceCircle(map, center, color, title) {
            // Create primary service area (25 miles)
            new google.maps.Circle({
                strokeColor: color,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: color,
                fillOpacity: 0.1,
                map,
                center,
                radius: 40233.6, // 25 miles in meters
                title
            });

            // Create extended service area (50 miles)
            new google.maps.Circle({
                strokeColor: color,
                strokeOpacity: 0.4,
                strokeWeight: 1,
                fillColor: color,
                fillOpacity: 0.05,
                map,
                center,
                radius: 80467.2, // 50 miles in meters
            });
        }

        addMarker(map, position, title) {
            const marker = new google.maps.Marker({
                position,
                map,
                title,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: '#ff8c00',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2
                }
            });

            const infoWindow = new google.maps.InfoWindow({
                content: `<div style="color: #333; padding: 5px;">
                    <h3 style="margin: 0 0 5px;">${title}</h3>
                    <p style="margin: 0;">Click "Check If We Service Your Area" above to verify coverage.</p>
                </div>`
            });

            marker.addListener('click', () => {
                infoWindow.open(map, marker);
            });
        }

        setupLocationInput() {
            const input = document.getElementById('locationInput');
            const autocomplete = new google.maps.places.Autocomplete(input, {
                componentRestrictions: { country: 'US' }
            });

            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place.geometry) {
                    this.checkServiceAvailability({
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                    });
                }
            });
        }

        checkServiceAvailability(location) {
            const lenaDistance = this.calculateDistance(location, this.locations.lena);
            const madisonDistance = this.calculateDistance(location, this.locations.madison);

            const result = document.getElementById('availabilityResult');
            const minDistance = Math.min(lenaDistance, madisonDistance);

            if (minDistance <= 25) {
                result.innerHTML = `
                    <div style="background-color: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin-top: 10px;">
                        <strong>Great news!</strong> You're in our standard service area.
                        <br>No additional travel fees apply.
                    </div>`;
            } else if (minDistance <= 50) {
                result.innerHTML = `
                    <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; margin-top: 10px;">
                        <strong>You're in our extended service area.</strong>
                        <br>Additional travel fee may apply. Please call for details.
                    </div>`;
            } else {
                result.innerHTML = `
                    <div style="background-color: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin-top: 10px;">
                        <strong>Location is outside our service area.</strong>
                        <br>Please contact us to discuss special arrangements.
                    </div>`;
            }
        }

        calculateDistance(point1, point2) {
            const R = 3959; // Earth's radius in miles
            const lat1 = this.toRadians(point1.lat);
            const lat2 = this.toRadians(point2.lat);
            const dLat = this.toRadians(point2.lat - point1.lat);
            const dLon = this.toRadians(point2.lng - point1.lng);

            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(lat1) * Math.cos(lat2) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
        }

        toRadians(degrees) {
            return degrees * (Math.PI/180);
        }
    }

    // Initialize the service area calculator
    new ServiceAreaCalculator();
});
