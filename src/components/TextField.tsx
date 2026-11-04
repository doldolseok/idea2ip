import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import styled from 'styled-components';
import { colors } from '../styles/theme';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** 라벨 옆 빨간 * 표시 (기본 true) */
  required?: boolean;
}

const TextField = forwardRef<HTMLInputElement, Props>(function TextField(
  { label, required = true, id, ...rest },
  ref,
) {
  const inputId = id ?? rest.name;

  return (
    <div>
      <Label htmlFor={inputId}>
        {label}
        {required && <Star aria-hidden="true">*</Star>}
      </Label>
      <Input id={inputId} ref={ref} {...rest} />
    </div>
  );
});

export default TextField;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 600;
  color: ${colors.text};
`;

const Star = styled.span`
  color: ${colors.required};
`;

const Input = styled.input`
  width: 100%;
  height: 46px;
  padding: 0 14px;
  font-size: 16px;
  color: ${colors.text};
  background: ${colors.inputBg};
  border: 1px solid ${colors.border};
  border-radius: 10px;
  outline: none;
  transition:
    border-color 0.15s,
    background 0.15s;

  &::placeholder {
    color: ${colors.muted};
  }

  &:focus {
    background: ${colors.card};
    border-color: ${colors.primary};
  }
`;
