import LoginButton from './LoginButton';
import React, { useCallback } from 'react';
import { useInitialState } from '@hooks/useInitialState';
import { regExpSpace } from '@constants/regExp';

const Login = ({ onLogin }) => {
  const [form, setForm, resetForm] = useInitialState({
    email: '',
    password: '',
  });
  const { email, password } = form;

  // form 상태 입력
  const onInput = useCallback(
    (e) => {
      // 입력한 값이 공백이 아닌 경우에만
      if (!regExpSpace.test(e.target.value)) {
        setForm((form) => ({
          ...form,
          [e.target.name]: e.target.value,
        }));
      }
    },
    [setForm],
  );

  // 회원가입시
  const handleSubmit = useCallback(
    (e) => {
      // 페이지 이동 막기
      e.preventDefault();

      // 상위 컴포넌트로 로그인 정보 전달
      onLogin(form);

      // form 상태 초기화
      resetForm();
    },
    [onLogin, form, resetForm],
  );

  return (
    <form className='login_index' method='post' onSubmit={handleSubmit}>
      <input
        className='logintext'
        name='email'
        value={email}
        placeholder='사용자 이메일 또는 아이디'
        onChange={onInput}
      />
      <input
        className='logintext'
        name='password'
        value={password}
        placeholder='비밀번호'
        onChange={onInput}
      />

      <LoginButton />
    </form>
  );
};

export default Login;