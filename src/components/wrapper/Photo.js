import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAddress } from '@services/image';

import { onLocation, offLocation } from '@store/photoLocation-store';
import Modal from './Modal';
import '@styles/components/modalMessage.scss';

const Photo = ({ photo, addRoute, clicked, updateCoordinate, id }) => {
  const { fileName, url, latitude, longitude } = photo;
  const [loading, setLoading] = useState(false);
  const [addressPoint, setAddressPint] = useState(undefined);
  const [isShowMessage, setIsShowMessage] = useState('');
  const [isSelectLocation, setIsSelectLocation] = useState(false);
  const dispatch = useDispatch();
  const {
    fileName: updatedFileName,
    latitude: updatedLatitude,
    longitude: updatedLongitude,
  } = useSelector((state) => state.photoLocation);

  useEffect(() => {
    if (!updatedLatitude) return;

    const update = async () => {
      const updatedInfo = {
        updatedFileName,
        updatedLatitude,
        updatedLongitude,
      };
      await updateCoordinate(updatedInfo);
      await dispatch(offLocation());
      setIsSelectLocation(false);
    };

    if (fileName === updatedFileName) update();
  }, [
    dispatch,
    updateCoordinate,
    fileName,
    updatedFileName,
    updatedLatitude,
    updatedLongitude,
  ]);

  useEffect(() => {
    // 좌표 정보 주소로 변환 받기
    const getAddressPoint = async () => {
      const address = await getAddress(latitude, longitude);
      setAddressPint(address);
      setLoading(true);
    };

    if (latitude && longitude) getAddressPoint().then(() => setLoading(true));
    else setLoading(true);
  }, [latitude, longitude]);

  const handleClick = useCallback(() => {
    addRoute(id, photo);
  }, [id, addRoute, photo]);

  const onClickLocationHandler = useCallback(() => {
    if (isSelectLocation) return;

    setIsSelectLocation(true);
    dispatch(onLocation(fileName));
    setIsShowMessage('지도에 위치를 설정해주세요!');
    setTimeout(() => {
      setIsShowMessage('');
    }, 2000);
  }, [dispatch, isSelectLocation, fileName]);

  if (!loading) {
    return <li className='List_piece'></li>;
  }

  return (
    <>
      <li className='List_piece'>
        <div className='img_box'>
          <img src={url} alt='img' />
          {clicked > 0 && <div className='click_img'>{clicked}</div>}
        </div>
        <table>
          <tbody>
            <tr>
              <th>{id}번 사진</th>
              <td>
                {latitude ? (
                  <button
                    type='button'
                    onClick={handleClick}
                    className={clicked ? 'select-location' : ''}
                  >
                    경로 표시
                  </button>
                ) : (
                  <button
                    type='button'
                    onClick={onClickLocationHandler}
                    disabled={isSelectLocation}
                    className={isSelectLocation ? 'select-location' : ''}
                  >
                    위치 설정
                  </button>
                )}
              </td>
            </tr>
            <tr>
              <td
                colSpan='2'
                style={{ color: `${addressPoint ? 'green' : 'red'}` }}
              >
                {addressPoint ? `${addressPoint}` : '위치를 설정해주세요!'}
              </td>
            </tr>
          </tbody>
        </table>
      </li>
      {isShowMessage && (
        <Modal className='modal' background='white'>
          <div className='modal-message'>
            <p>{isShowMessage}</p>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Photo;
