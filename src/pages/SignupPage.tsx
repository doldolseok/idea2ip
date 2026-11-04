import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import TextField from '../components/TextField';
import { AlertSlot, Fields, Form } from '../components/AuthForm.styles';
import { useAlertModal } from '../hooks/useAlertModal';

// 회원가입 페이지

export default function SignupPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const idRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  const pwCheckRef = useRef<HTMLInputElement>(null);
  const { showAlert, alertNode } = useAlertModal();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!id.trim()) {
      showAlert('아이디를 입력해주세요.');
      idRef.current?.focus();
      return;
    }
    if (!password) {
      showAlert('비밀번호를 입력해주세요.');
      pwRef.current?.focus();
      return;
    }
    if (!passwordCheck) {
      showAlert('비밀번호 확인을 입력해주세요.');
      pwCheckRef.current?.focus();
      return;
    }
    if (password !== passwordCheck) {
      showAlert('비밀번호가 일치하지 않습니다.');
      pwCheckRef.current?.focus();
      return;
    }

    // TODO: 회원가입 API 연동 (성공했을 때만 아래 이동 실행)
    navigate('/login');
  };

  return (
    <AuthLayout logoInCard>
      <Form onSubmit={handleSubmit} noValidate>
        <Fields>
          <TextField
            ref={idRef}
            label="아이디"
            name="id"
            autoComplete="username"
            placeholder="아이디를 입력해주세요."
            value={id}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setId(e.target.value)}
          />
          <TextField
            ref={pwRef}
            label="비밀번호"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
          <TextField
            ref={pwCheckRef}
            label="비밀번호 확인"
            name="passwordCheck"
            type="password"
            autoComplete="new-password"
            placeholder="비밀번호를 다시 입력해주세요."
            value={passwordCheck}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPasswordCheck(e.target.value)}
          />
        </Fields>
        <AlertSlot>{alertNode}</AlertSlot>
        <SubmitButton type="submit">회원가입하기</SubmitButton>
      </Form>
    </AuthLayout>
  );
}

const SubmitButton = styled(Button)`
  margin-top: 64px;
  margin-bottom: 14px;
`;
