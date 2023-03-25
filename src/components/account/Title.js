import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@assets/Logo.png';
import styled from 'styled-components';

const StyledTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid black;
  text-align: center;
  padding: 50px 30px 50px 30px;

  .Go_before_page {
    display: flex;
    align-items: center;

    text-decoration: none;
    color: black;

    .logo {
      width: 100px;
      cursor: pointer;
    }
    .content {
      cursor: pointer;
      padding-left: 15px;
      font-size: 35px;
      font-weight: bold;
    }
  }
`;

const Title = ({ title }) => (
  <StyledTitle>
    <Link to='/' className='Go_before_page'>
      <img className='logo' src={Logo} alt='로고사진' />
      <span className='content'>{title}</span>
    </Link>
  </StyledTitle>
);

export default Title;
