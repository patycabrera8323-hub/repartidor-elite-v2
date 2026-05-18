import { useEffect, useRef, useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Order } from '../types';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';

interface OrderMapProps {
  order: Order;
  driverLocation?: { lat: number, lng: number };
}

function RouteDisplay({ origin, destination }: {
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!routesLib || !map || !origin || !destination) return;
    
    // Clear previous route
    polylinesRef.current.forEach(p => p.setMap(null));

    routesLib.Route.computeRoutes({
      origin,
      destination,
      travelMode: 'DRIVING' as any,
      fields: ['path', 'viewport'],
    }).then(({ routes }) => {
      if (routes?.[0]) {
        const newPolylines = routes[0].createPolylines();
        newPolylines.forEach(p => {
          p.setOptions({
            strokeColor: '#00ffff', // neon-cyan
            strokeWeight: 6,
            strokeOpacity: 0.8
          });
          p.setMap(map);
        });
        polylinesRef.current = newPolylines;
        if (routes[0].viewport) map.fitBounds(routes[0].viewport, 50);
      }
    }).catch(err => console.error("Error computing route", err));

    return () => polylinesRef.current.forEach(p => p.setMap(null));
  }, [routesLib, map, origin.lat, origin.lng, destination.lat, destination.lng]);

  return null;
}

export default function OrderMap({ order, driverLocation }: OrderMapProps) {
  const [center] = useState(order.deliveryLocation);

  if (!API_KEY) {
    return (
      <div className="w-full h-full glass rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center p-6 text-center space-y-3">
        <div className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white/10">
           <Pin background="transparent" glyphColor="currentColor" />
        </div>
        <p className="text-white/30 text-[8px] font-black uppercase tracking-[0.15em] leading-relaxed max-w-[240px] mx-auto">
          Sistema Cartográfico Desconectado<br />
          <span className="text-white/20 font-medium normal-case">(Falta llave de acceso a mapas)</span>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full glass rounded-[3rem] border border-white/10 overflow-hidden relative shadow-2xl">
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={center}
          defaultZoom={15}
          mapId="DRIVER_APP_MAP"
          disableDefaultUI={true}
          style={{ width: '100%', height: '100%' }}
          gestureHandling={'greedy'}
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          styles={[
            {
              "elementType": "geometry",
              "stylers": [{ "color": "#050505" }]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#ffffff" }, { "opacity": 0.2 }]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [{ "color": "#000000" }]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [{ "color": "#1a1a1a" }]
            },
            {
              "featureType": "road",
              "elementType": "geometry.stroke",
              "stylers": [{ "color": "#00ffff" }, { "opacity": 0.05 }]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [{ "color": "#000000" }]
            }
          ]}
        >
          <AdvancedMarker position={order.deliveryLocation} title="Destino">
            <div className="w-10 h-10 glass rounded-full flex items-center justify-center border-2 border-neon-pink shadow-[0_0_15px_rgba(255,0,127,0.5)]">
              <div className="w-3 h-3 bg-neon-pink rounded-full animate-pulse" />
            </div>
          </AdvancedMarker>

          {driverLocation && (
            <>
              <AdvancedMarker position={driverLocation} title="Tu ubicación">
                <div className="w-10 h-10 glass rounded-full flex items-center justify-center border-2 border-neon-cyan shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                  <div className="w-3 h-3 bg-neon-cyan rounded-full animate-ping" />
                </div>
              </AdvancedMarker>
              <RouteDisplay origin={driverLocation} destination={order.deliveryLocation} />
            </>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}
