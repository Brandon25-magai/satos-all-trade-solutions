class ServiceAreaCalculator {
    constructor() {
        // Center points for your service areas
        this.locations = {
            lena: { lat: 42.3776, lng: -89.8226 }, // Lena, IL
            madison: { lat: 43.0731, lng: -89.4012 } // Madison, WI
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
            center: centerPoint
        });

        // Add service area circles
        this.addServiceCircle(map, this.locations.lena, '#ff8c00', 'Lena Service Area');
        this.addServiceCircle(map, this.locations.madison, '#ff8c00', 'Madison Service Area');

        // Add markers for main locations
        this.addMarker(map, this.locations.lena, 'Sato\'s All Trade Solutions - Lena');
        this.addMarker(map, this.locations.madison, 'Madison Service Area');
    }

    addServiceCircle(map, center, color, title) {
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
    }

    addMarker(map, position, title) {
        new google.maps.Marker({
            position,
            map,
            title
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
                this.checkServiceAvailability(place.geometry.location);
            }
        });
    }

    checkServiceAvailability(location) {
        const lenaDistance = this.calculateDistance(location, this.locations.lena);
        const madisonDistance = this.calculateDistance(location, this.locations.madison);

        const result = document.getElementById('availabilityResult');
        const minDistance = Math.min(lenaDistance, madisonDistance);

        if (minDistance <= 25) {
            result.innerHTML = '<span class="available">✓ Location is within our standard service area</span>';
        } else if (minDistance <= 50) {
            result.innerHTML = '<span class="extended">Location is in our extended service area (additional travel fee may apply)</span>';
        } else {
            result.innerHTML = '<span class="unavailable">✕ Location is outside our current service area</span>';
        }
    }

    calculateDistance(point1, point2) {
        const R = 3959; // Earth's radius in miles
        const lat1 = this.toRadians(point1.lat());
        const lat2 = this.toRadians(point2.lat);
        const dLat = this.toRadians(point2.lat - point1.lat());
        const dLon = this.toRadians(point2.lng - point1.lng());

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
