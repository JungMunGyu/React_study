import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPreSignedUrl, uploadFileToS3 } from '@services/image';
import { createPost } from '@services/post';
import { insert } from '@store/marker';

import Menu from '@constants/menu';
import FirstWritePage from './FirstWritePage';
import SecondWritePage from './SecondWritePage';
import ThirdWritePage from './ThirdWritePage';
import '@styles/home/Write.scss';

const Write = ({ onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [routes, setRoutes] = useState([]);
  const { accessToken } = useSelector((state) => state.accessToken);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentPage === 0) {
      setPhotos([]);
      setRoutes([]);
    }
  }, [currentPage]);

  const onMovePage = useCallback(async (move) => {
    setCurrentPage((prevPage) => prevPage + move);
  }, []);

  const uploadWriteHandler = useCallback(
    async (article) => {
      // url 받아오기
      const fileNames = photos.map((photo) => photo.fileName);
      const urls = await getPreSignedUrl(fileNames);

      // pre-signed url에 사진 파일 전송하기
      const newPhotos = await Promise.all(
        photos.map(async (photo, index) => {
          const data = await fetch(photo.url);
          const blob = await data.blob();
          const file = new File([blob], `${Date.now()}-image.jpg`, {
            type: 'image/jpeg',
          });

          const formData = new FormData();
          formData.append('file', file);

          await uploadFileToS3(formData.get('file'), urls[index]).catch(
            // eslint-disable-next-line no-console
            (e) => console.log(e.message),
          );

          const { url, ...newPhoto } = photo;
          return newPhoto;
        }),
      );

      // 서버로 데이터 전송하기
      const post = {
        newPhotos,
        routes,
        article,
      };

      try {
        const { data, message } = await createPost(accessToken, post);
        dispatch(insert(data));
        onClose(Menu.TRIP, message);
      } catch (e) {
        alert(e.message);
      }
    },
    [dispatch, onClose, accessToken, photos, routes],
  );

  const updateCoordinateHandler = useCallback(
    (newPhoto) => {
      const { updatedFileName, updatedLatitude, updatedLongitude } = newPhoto;
      const updatedPhotos = photos.map((photo) =>
        photo.fileName === updatedFileName
          ? { ...photo, latitude: updatedLatitude, longitude: updatedLongitude }
          : photo,
      );

      setPhotos(updatedPhotos);
    },
    [photos],
  );

  let content = '';
  switch (Number(currentPage)) {
    case 0:
      content = (
        <FirstWritePage onMovePage={onMovePage} onUploadPhotos={setPhotos} />
      );
      break;
    case 1:
      content = (
        <SecondWritePage
          photos={photos}
          prevRoutes={routes}
          setRoutes={setRoutes}
          onMovePage={onMovePage}
          updateCoordinate={updateCoordinateHandler}
        />
      );
      break;
    case 2:
      content = (
        <ThirdWritePage
          onMovePage={onMovePage}
          onUploadWrite={uploadWriteHandler}
        />
      );
      break;
    default:
      break;
  }

  return (
    <div className='Main_content'>
      <div className='Content_box'>{content}</div>
    </div>
  );
};

export default Write;
