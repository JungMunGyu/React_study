import Login from './Login';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../../store/user';
import { login } from '../../services/user';

const LoginContainer = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onInput = useCallback(
    (e) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    },
    [form],
  );

  const onLogin = useCallback(
    async (e, errorText) => {
      e.preventDefault();

      try {
        const { status, accessToken, refreshToken, message } = await login(
          form,
        );

        if (status) {
          // accessToken, refreshToken 저장
          dispatch(setToken({ status: true }));
          navigate('/');
        } else {
          errorText.current.textContent = '유저 정보가 일치하지 않습니다.';
          setForm({
            email: '',
            password: '',
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    [form, dispatch, navigate],
  );

  return <Login form={form} onInput={onInput} onLogin={onLogin} />;
};

export default LoginContainer;
