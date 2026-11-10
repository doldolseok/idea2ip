import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import styled from 'styled-components';
import ModalShell from './modal/ModalShell';
import ImageUploadBox from './modal/ImageUploadBox';
import {
  CancelButton,
  Field,
  FieldLabel,
  ModalActions,
  SubmitButton,
  TextInput,
  ToastAnchor,
} from './modal/modalForm.styles';
import { useAlertModal } from '../hooks/useAlertModal';
import { colors } from '../styles/theme';
import { WORK_TYPES } from '../constants/workTypes';
import type { WorkType } from '../constants/workTypes';

export interface NewProjectInput {
  name: string;
  image: File;
  workType: WorkType;
}

interface Props {
  onClose: () => void;
  onSubmit: (input: NewProjectInput) => void;
}

// 대시보드 / 내 프로젝트의 "새 프로젝트" 버튼으로 여는 생성 모달

export default function NewProjectModal({ onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [workType, setWorkType] = useState<WorkType>(WORK_TYPES[0].value);
  const nameRef = useRef<HTMLInputElement>(null);
  const { showAlert, alertNode } = useAlertModal(1800, 'subtle');

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showAlert('프로젝트 이름을 작성해 주세요.');
      nameRef.current?.focus();
      return;
    }
    if (!image) {
      showAlert('이미지를 등록해주세요.');
      return;
    }

    onSubmit({ name: name.trim(), image, workType });
  };

  return (
    <ModalShell titleId="new-project-title" title="새 프로젝트 시작" onClose={onClose}>
      <Form onSubmit={handleSubmit} noValidate>
        <Fields>
          <Field>
            <Label htmlFor="project-name">프로젝트 이름</Label>
            <NameInput
              ref={nameRef}
              id="project-name"
              name="name"
              autoComplete="off"
              placeholder="예: 달빛 정원 캐릭터"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>

          <ImageUploadBox
            file={image}
            onChange={setImage}
            onInvalid={() => showAlert('지원하지 않는 이미지 형식입니다.')}
          />

          <Field role="group" aria-labelledby="work-type-label">
            <Label as="p" id="work-type-label">
              작품 유형
            </Label>
            <TypeList>
              {WORK_TYPES.map(({ value, label, category }) => (
                <TypeCard
                  key={value}
                  type="button"
                  aria-pressed={workType === value}
                  $selected={workType === value}
                  onClick={() => setWorkType(value)}
                >
                  <TypeLabel>{label}</TypeLabel>
                  <TypeCategory>{category}</TypeCategory>
                </TypeCard>
              ))}
            </TypeList>
          </Field>
        </Fields>

        <ModalActions>
          <ToastAnchor>{alertNode}</ToastAnchor>
          <CancelButton type="button" onClick={onClose}>
            취소
          </CancelButton>
          <SubmitButton type="submit">프로젝트 만들기</SubmitButton>
        </ModalActions>
      </Form>
    </ModalShell>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: 14px;
  padding-bottom: 18px;
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Label = styled(FieldLabel)`
  margin-bottom: 15px;
  font-weight: 700;
`;

const NameInput = styled(TextInput)`
  border-radius: 9px;
`;

const TypeList = styled.div`
  display: flex;
  gap: 12px;
`;

const TypeCard = styled.button<{ $selected: boolean }>`
  flex: 1;
  height: 104px;
  padding: 17px 11px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 13px;
  text-align: left;
  line-height: normal;
  background: ${({ $selected }) => ($selected ? colors.selectedBg : colors.card)};
  border: 1px solid ${({ $selected }) => ($selected ? colors.selected : colors.border)};
  border-radius: 12px;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s;

  & > span:last-child {
    color: ${({ $selected }) => ($selected ? colors.selected : colors.muted)};
  }

  &:hover {
    border-color: ${colors.selected};
  }
`;

const TypeLabel = styled.span`
  color: ${colors.text};
  font-size: 14px;
  font-weight: 700;
`;

const TypeCategory = styled.span`
  font-size: 12px;
  font-weight: 400;
`;
