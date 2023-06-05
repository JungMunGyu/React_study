import { useState, useCallback, useEffect } from 'react';
import loadable from '@loadable/component';

import Modal from '@components/wrapper/Modal';
import Menu from '@constants/menu';
import HomeMenu from './HomeMenu';
import HomeLogo from './HomeLogo';
import HomeProfile from './HomeProfile';
import Write from './write/Write';
import Trip from './trip/Trip';
import '@styles/components/modalMessage.scss';

const Map = loadable(() => import('@components/map/Map'));

const Index = () => {
  const [selectedMenu, setSelectedMenu] = useState(Menu.TRIP);
  const [showMessage, setShowMessage] = useState('');

  // 메시지 애니메이션
  useEffect(() => {
    if (showMessage) {
      setTimeout(() => {
        setShowMessage('');
      }, 1000);
    }
  }, [showMessage]);

  const onClickMenuHandler = useCallback((clickedMenu, message) => {
    if (message) setShowMessage(message);

    setSelectedMenu(clickedMenu);
  }, []);

  let content = '';
  switch (selectedMenu) {
    case Menu.TRIP:
      content = <Trip />;
      break;
    case Menu.ROUTE:
      content = '';
      break;
    case Menu.LOG:
      content = '';
      break;
    case Menu.WRITE:
      content = <Write onClose={onClickMenuHandler} />;
      break;
    default:
      break;
  }

  return (
    <>
      <HomeLogo />

      <HomeMenu selectedMenu={selectedMenu} onClickMenu={onClickMenuHandler} />
      <HomeProfile />

      {content}

      <Map />

      {showMessage && (
        <Modal className='modal'>
          <div className='modal-message'>
            <p>{showMessage}</p>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Index;
