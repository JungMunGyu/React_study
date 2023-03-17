import React from 'react';
import { Link } from 'react-router-dom';
import loadable from '@loadable/component';
import Button from '@components/Button';

const Register = loadable(() => import('@pages/register/Index'));

const Login = ({ form, onInput, onLogin, error }) => {
  const { email, password } = form;

  const onRegisterLoad = () => Register.preload();

  return (
    <form className='login_index' method='post' onSubmit={onLogin}>
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
      <Button type='submit' className='loginbtn' content='로그인' />

      <Link to='/register' onMouseEnter={onRegisterLoad}>
        <Button type='button' className='gosignupbtn' content='회원 가입' />
      </Link>
      <div style={{ marginTop: '15px' }}>
        {error && (
          <span className='error_login_text'>
            로그인 정보가 일치하지 않습니다!
          </span>
        )}
      </div>
    </form>
  );
};

export default Login;
