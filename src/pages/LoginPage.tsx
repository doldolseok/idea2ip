import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import TextField from '../components/TextField';
import { AlertSlot, Fields, FooterLink, Form } from '../components/AuthForm.styles';
import { useAlertModal } from '../hooks/useAlertModal';
import { useNavigate } from 'react-router-dom';

// 로그인 페이지

export default function LoginPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const idRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);
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

    // TODO: 로그인 API 연동 (성공했을 때만 아래 이동 실행)
    navigate('/');
  };

  return (
    <AuthLayout>
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
            autoComplete="current-password"
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
        </Fields>
        <AlertSlot>{alertNode}</AlertSlot>
        <Button type="submit">로그인하기</Button>
        <FooterLink to="/signup">회원가입</FooterLink>
      </Form>
    </AuthLayout>
  );
}
