import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import styled from 'styled-components';
import { SIDEBAR_WIDTH } from './Sidebar';
import { useAlertModal } from '../hooks/useAlertModal';
import { colors } from '../styles/theme';
import { WORK_TYPES } from '../constants/workTypes';
import type { WorkType } from '../constants/workTypes';

/** 업로드 가능한 이미지: PNG, JPG */
const SUPPORTED_MIME_TYPES = ['image/png', 'image/jpeg'];
const SUPPORTED_EXTENSIONS = /\.(png|jpe?g)$/i;

// MIME 타입이 비어 있는 경우(일부 OS/브라우저)를 대비해 확장자도 함께 확인
function isSupportedImage(file: File) {
  return file.type
    ? SUPPORTED_MIME_TYPES.includes(file.type)
    : SUPPORTED_EXTENSIONS.test(file.name);
}

export interface NewProjectInput {
  name: string;
  image: File;
  workType: WorkType;
}

interface Props {
  onClose: () => void;
  onSubmit: (input: NewProjectInput) => void;
}

// 대시보드의 "새 프로젝트" 버튼으로 여는 생성 모달

export default function NewProjectModal({ onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [workType, setWorkType] = useState<WorkType>(WORK_TYPES[0].value);
  const nameRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { showAlert, alertNode } = useAlertModal(1800, 'subtle');

  // ESC로 닫기
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return; // 파일 선택 창에서 취소한 경우 기존 선택 유지

    if (!isSupportedImage(file)) {
      showAlert('지원하지 않는 이미지 형식입니다.');
      e.target.value = ''; // 같은 파일을 다시 골라도 onChange가 다시 실행되게
      setImage(null);
      return;
    }

    setImage(file);
  };

  return (
    <Overlay onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <Dialog role="dialog" aria-modal="true" aria-labelledby="new-project-title">
        <Header>
          <Title id="new-project-title">새 프로젝트 시작</Title>
          <Divider />
        </Header>

        <Form onSubmit={handleSubmit} noValidate>
          <Fields>
            <Field>
              <Label htmlFor="project-name">프로젝트 이름</Label>
              <Input
                ref={nameRef}
                id="project-name"
                name="name"
                autoComplete="off"
                placeholder="예: 달빛 정원 캐릭터"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>

            <UploadBox>
              <UploadText>
                <UploadTitle>이미지 파일 등록</UploadTitle>
                <UploadDesc>
                  {image ? image.name : 'PNG, JPG, 화면 캡처/렌더링 이미지 파일을 업로드 해주세요.'}
                </UploadDesc>
              </UploadText>
              <FileButton type="button" onClick={() => fileRef.current?.click()}>
                파일선택
              </FileButton>
              <HiddenInput
                ref={fileRef}
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
              />
            </UploadBox>

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

          <Actions>
            <ToastAnchor>{alertNode}</ToastAnchor>
            <CancelButton type="button" onClick={onClose}>
              취소
            </CancelButton>
            <SubmitButton type="submit">프로젝트 만들기</SubmitButton>
          </Actions>
        </Form>
      </Dialog>
    </Overlay>
  );
}

/* 사이드바는 가리지 않고 메인 영역만 어둡게 */
const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: ${SIDEBAR_WIDTH}px;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: ${colors.overlay};
`;

const Dialog = styled.div`
  width: 596px;
  max-width: 100%;
  max-height: 100%;
  overflow-y: auto;
  padding: 0 28px 18px;
  background: ${colors.card};
  border-radius: 18px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 0 14px;
`;

const Title = styled.h2`
  margin: 0;
  color: ${colors.text};
  font-size: 20px;
  font-weight: 600;
  line-height: normal;
`;

const Divider = styled.hr`
  width: 100%;
  height: 1px;
  margin: 0;
  border: 0;
  background: ${colors.border};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const Label = styled.label`
  display: block;
  margin: 0 0 15px;
  color: ${colors.text};
  font-size: 14px;
  font-weight: 700;
  line-height: normal;
`;

const Input = styled.input`
  width: 100%;
  height: 46px;
  padding: 0 13px;
  color: ${colors.text};
  font-size: 13px;
  background: ${colors.card};
  border: 1px solid ${colors.border};
  border-radius: 9px;
  outline: none;
  transition: border-color 0.15s;

  &::placeholder {
    color: ${colors.muted};
  }

  &:focus {
    border-color: ${colors.primary};
  }
`;

const UploadBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 10px 14px;
  background: #f9faff;
  border: 1px solid ${colors.border};
  border-radius: 10px;
`;

const UploadText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  line-height: normal;
`;

const UploadTitle = styled.p`
  margin: 0;
  color: #000;
  font-size: 14px;
  font-weight: 600;
`;

const UploadDesc = styled.p`
  margin: 0;
  overflow: hidden;
  color: ${colors.muted};
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileButton = styled.button`
  flex-shrink: 0;
  padding: 6px 16px;
  color: rgba(19, 28, 51, 0.8);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  background: transparent;
  border: 1px solid ${colors.border};
  border-radius: 15px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${colors.card};
  }
`;

const HiddenInput = styled.input`
  display: none;
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

const Actions = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;

/* 안내 토스트 기준점: 작품 유형 카드 바로 아래, 버튼 위에 살짝 겹치게 */
const ToastAnchor = styled.div`
  position: absolute;
  top: -21px;
  left: calc(50% + 42px);
  width: 0;
  height: 0;
`;

const ModalButton = styled.button`
  height: 46px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s;
`;

const CancelButton = styled(ModalButton)`
  width: 136px;
  color: ${colors.text};
  background: ${colors.card};
  border: 1px solid ${colors.border};

  &:hover {
    background: ${colors.bg};
  }
`;

const SubmitButton = styled(ModalButton)`
  width: 158px;
  color: #fff;
  background: ${colors.selected};
  border: 0;

  &:hover {
    background: ${colors.primaryHover};
  }
`;
