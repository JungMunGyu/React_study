import MapGL from 'react-map-gl';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { MAP_API_TOKEN, MAP_API_STYLE } from '@config/service';
import { updateLocation } from '@store/location';
import CustomMarker from './CustomMarker';
import '@styles/components/Map.scss';
import 'mapbox-gl/dist/mapbox-gl.css';

const viewport = {
  longitude: 131.1,
  latitude: 36.4395,
  zoom: 5.5, // Default
};
const zoom = {
  minZoom: 5.5,
  maxZoom: 10,
};

const Map = () => {
  const { accessToken } = useSelector((state) => state.accessToken);
  const { isSetLocation } = useSelector((state) => state.location);
  const marker = useSelector((state) => state.marker);
  const dispatch = useDispatch();

  const setLocationHandler = useCallback(
    (e) => {
      const { lat, lng } = e.lngLat;
      dispatch(updateLocation({ lat, lng }));
    },
    [dispatch],
  );

  let markers = null;

  if (marker && accessToken) {
    markers = marker.map((mark) => {
      if (!mark.coordinate) return null;

      const coordinateString = mark.coordinate
        .replace('POINT(', '')
        .replace(')', '');

      const [lat, lng] = coordinateString.split(' ');

      return (
        <CustomMarker
          key={mark.id}
          postId={mark.postId}
          lat={lat}
          lng={lng}
          imageURl={mark.imageUrl}
          order={mark.order}
        />
      );
    });
  }

  return (
    <div className='map-container'>
      <MapGL
        initialViewState={viewport}
        style={{ width: '100vw', height: '100vh' }}
        mapStyle={MAP_API_STYLE}
        mapboxAccessToken={MAP_API_TOKEN}
        onClick={isSetLocation && setLocationHandler}
        scrollZoom={accessToken} // accessToken ? true : false
        dragPan={accessToken} // accessToken ? true : false
        {...zoom}
      >
        {markers}
      </MapGL>
      <div className='ocean-container'></div>
    </div>
  );
};

export default Map;
