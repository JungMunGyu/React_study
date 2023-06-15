import MapGL from 'react-map-gl';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Menu from '@constants/menu';
import { setCoordinatesOnMap } from '@store/map';
import { MAP_API_TOKEN, MAP_API_STYLE } from '@config/service';
import { updateLocation } from '@store/location';
import { changeQueryBounds } from '@utils/metadata';
import CustomMarker from './CustomMarker';
import '@styles/components/map.scss';
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
  const MapGLRef = useRef();

  const { accessToken } = useSelector((state) => state.accessToken);
  const { isSetLocation } = useSelector((state) => state.location);
  const changeCenter = useSelector((state) => state.map.center);
  const changeZoom = useSelector((state) => state.map.zoom);
  const marker = useSelector((state) => state.marker.marker);
  const userMarker = useSelector((state) => state.marker.userMarker);
  const menu = useSelector((state) => state.marker.menu);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!MapGLRef.current || changeCenter.length === 0) return;

    MapGLRef.current.flyTo({
      center: changeCenter,
      zoom: changeZoom,
      speed: 1.5,
      curve: 1.25,
      essential: true,
      easing(t) {
        return t;
      },
    });
  }, [changeCenter, changeZoom]);

  const setLocationHandler = useCallback(
    (e) => {
      const { lat, lng } = e.lngLat;
      dispatch(updateLocation({ lat, lng }));
    },
    [dispatch],
  );

  const onLoadHandler = useCallback(
    (e) => {
      // Default Info
      const viewType = 'region';
      const currentZoom = e.target.getZoom();
      const markerCount = 8;
      const bounds = e.target.getBounds();
      const polygon = changeQueryBounds(bounds);

      dispatch(
        setCoordinatesOnMap({ viewType, currentZoom, polygon, markerCount }),
      );
    },
    [dispatch],
  );

  const fetchData = useCallback(
    async (e) => {
      if (menu === Menu.ORDER) return;

      const currentZoom = e.target.getZoom();
      let viewType = 'region';
      let markerCount = 8;

      if (currentZoom >= 7) {
        viewType = 'city';
        markerCount = 15;
      }

      const bounds = e.target.getBounds();
      const polygon = changeQueryBounds(bounds);

      dispatch(
        setCoordinatesOnMap({
          viewType,
          currentZoom,
          markerCount,
          polygon,
        }),
      );
    },
    [dispatch, menu],
  );

  const onZoomEndHandler = useCallback(
    (e) => {
      fetchData(e);
    },
    [fetchData],
  );

  const onDragEndHandler = useCallback(
    (e) => {
      const currentZoom = e.target.getZoom();
      if (currentZoom < 7) return;

      fetchData(e);
    },
    [fetchData],
  );

  let markers = null;

  let userMarkers = null;

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

  if (menu === Menu.TRIP && userMarker && accessToken) {
    userMarkers = marker.map((mark) => {
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
        ref={MapGLRef}
        initialViewState={viewport}
        style={{ width: '100vw', height: '100vh' }}
        mapStyle={MAP_API_STYLE}
        mapboxAccessToken={MAP_API_TOKEN}
        onClick={isSetLocation && setLocationHandler}
        scrollZoom={accessToken} // accessToken ? true : false
        dragPan={accessToken} // accessToken ? true : false
        onLoad={onLoadHandler}
        onZoomEnd={onZoomEndHandler}
        onDragEnd={onDragEndHandler}
        {...zoom}
      >
        {markers}
        {userMarkers}
      </MapGL>
      <div className='ocean-container'></div>
    </div>
  );
};

export default Map;
