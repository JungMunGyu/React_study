/**
 * 이름, 이메일, 닉네임, 비밀번호, 공백 체크를 위한 정규표현식
 */
const regExpName = /^[가-힣]{2,}$/;
const regExpEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regExpNickname =
  /^(?=.*[a-zA-Z0-9가-힣])(?=.*[`~_])[a-zA-Z0-9가-힣\d`~_]{2,8}$/;
const regExpPassword =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[`~!@#$%^&*()/])[A-Za-z\d`~!@#$%^&*()/]{8,16}$/;
const regExpSpace = /\s/;

export { regExpName, regExpEmail, regExpPassword, regExpNickname, regExpSpace };
