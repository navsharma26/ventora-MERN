import React, { useEffect, useRef } from 'react';
import { FaMapMarkerAlt, FaLocationArrow, FaExternalLinkAlt } from 'react-icons/fa';

const InteractiveMap = ({ lat, lng, title, locationName, userLat, userLng }) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!mapContainerRef.current || !window.L) return;

        const defaultLat = lat || 37.7749;
        const defaultLng = lng || -122.4194;

        // Cleanup previous instance if re-rendering
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        // Initialize Leaflet Map
        const map = window.L.map(mapContainerRef.current).setView([defaultLat, defaultLng], 13);
        mapInstanceRef.current = map;

        // OpenStreetMap Tile Layer
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Event Custom Marker Pin
        const eventIcon = window.L.divIcon({
            className: 'custom-map-icon',
            html: `<div style="background-color: #064e3b; color: #34d399; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3);"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path></svg></div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 36]
        });

        const eventMarker = window.L.marker([defaultLat, defaultLng], { icon: eventIcon }).addTo(map);
        eventMarker.bindPopup(`
            <div style="font-family: sans-serif; text-align: center; padding: 4px;">
                <strong style="color: #064e3b; font-size: 14px;">${title || 'Event Location'}</strong><br/>
                <span style="color: #666; font-size: 12px;">${locationName || ''}</span>
            </div>
        `).openPopup();

        // User Real-Time Geolocation Pin if available
        if (userLat && userLng) {
            const userIcon = window.L.divIcon({
                className: 'custom-user-icon',
                html: `<div style="background-color: #3b82f6; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 10px rgba(59,130,246,0.5); animate: pulse 2s infinite;"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="14" width="14" xmlns="http://www.w3.org/2000/svg"><path d="M448 256c0 106-86 192-192 192S64 362 64 256 150 64 256 64s192 86 192 192z"></path></svg></div>`,
                iconSize: [28, 28],
                iconAnchor: [14, 14]
            });
            window.L.marker([userLat, userLng], { icon: userIcon }).addTo(map).bindPopup('Your Current Location');

            // Fit bounds to show both pins
            const bounds = window.L.latLngBounds([[defaultLat, defaultLng], [userLat, userLng]]);
            map.fitBounds(bounds, { padding: [40, 40] });
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [lat, lng, title, locationName, userLat, userLng]);

    const openInGoogleMaps = () => {
        const defaultLat = lat || 37.7749;
        const defaultLng = lng || -122.4194;
        window.open(`https://www.google.com/maps/search/?api=1&query=${defaultLat},${defaultLng}`, '_blank');
    };

    return (
        <div className="bg-white rounded-2xl border border-jade-100 overflow-hidden shadow-sm">
            <div className="bg-jade-950 text-white px-5 py-3.5 flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-jade-300">
                    <FaMapMarkerAlt className="text-jade-400 text-sm" />
                    <span>Real-Time Interactive Venue Map</span>
                </div>
                <button
                    onClick={openInGoogleMaps}
                    className="text-xs font-bold text-jade-300 hover:text-white flex items-center gap-1.5 bg-jade-900 px-3 py-1 rounded-lg border border-jade-800 transition"
                >
                    <span>Google Maps</span>
                    <FaExternalLinkAlt className="text-[10px]" />
                </button>
            </div>

            <div className="relative h-64 sm:h-80 w-full bg-gray-100">
                <div ref={mapContainerRef} className="h-full w-full z-10"></div>

                {userLat && userLng && (
                    <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-jade-200 text-xs font-bold text-jade-950 shadow-md flex items-center gap-2">
                        <FaLocationArrow className="text-blue-600 animate-pulse" />
                        <span>GPS Track Active</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InteractiveMap;
