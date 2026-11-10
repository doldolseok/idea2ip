import { useEffect, useRef, useState } from 'react';
import type { FormEvent, RefObject } from 'react';
import styled from 'styled-components';
import ModalShell from '../modal/ModalShell';
import ImageUploadBox from '../modal/ImageUploadBox';
import {
  CancelButton,
  Field,
  FieldLabel,
  ModalActions,
  SubmitButton,
  TextArea,
  TextInput,
  ToastAnchor,
} from '../modal/modalForm.styles';
import { useAlertModal } from '../../hooks/useAlertModal';
import { DEFAULT_MATERIAL_TYPE, MATERIAL_TYPES } from '../../constants/materialTypes';
import type { MaterialType } from '../../constants/materialTypes';
import { useProjectStore } from '../../store/projectStore';
import type { ProcessMaterial } from '../../types/project';
import { formatDate, parseDotDate } from '../../utils/formatDate';
import { colors } from '../../styles/theme';

interface Props {
  projectId: string;
  /** 넘기면 수정 모드 (기존 값으로 채워서 열림), 없으면 추가 모드 */
  material?: ProcessMaterial;
  onClose: () => void;
}

const EMPTY_DETAILS: Record<MaterialType, string> = { ai: '', manual: '', sketch: '' };

// 제작 과정 탭의 제작자료 추가 / 수정 모달
// - "+ 새 제작자료" → 추가 모드: 열릴 때마다 새로 마운트되므로 항상 기본값(AI 활용 자료)으로 시작
// - 타임라인 항목 "수정" → 수정 모드: 해당 자료 값으로 채워서 시작, 저장하면 같은 자리에서 교체

export default function MaterialModal({ projectId, material, onClose }: Props) {
  const isEdit = !!material;
  const addMaterial = useProjectStore((state) => state.addMaterial);
  const updateMaterial = useProjectStore((state) => state.updateMaterial);
  const { showAlert, alertNode } = useAlertModal(1800, 'subtle');

  const [type, setType] = useState<MaterialType>(material?.type ?? DEFAULT_MATERIAL_TYPE);
  // 공통 칸 (유형을 바꿔도 유지)
  // 수정 모드에서 새 파일을 고르지 않으면 기존 이미지를 그대로 사용
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState(material?.title ?? '');
  const [date, setDate] = useState(material ? formatDate(material.createdAt) : '');
  // 유형별 칸 (유형마다 따로 보관 → 다시 돌아오면 입력값 그대로)
  const [details, setDetails] = useState(() =>
    material ? { ...EMPTY_DETAILS, [material.type]: material.description } : EMPTY_DETAILS,
  );
  const [aiTool, setAiTool] = useState(material?.aiTool ?? '');
  const hasExistingImage = !!material?.thumbnailUrl;

  const titleRef = useRef<HTMLInputElement>(null);
  const detailRef = useRef<HTMLTextAreaElement>(null);
  const aiToolRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  const config = MATERIAL_TYPES.find((t) => t.value === type) ?? MATERIAL_TYPES[0];
  const detail = details[type];

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  /** 화면 위에서부터 순서대로 첫 번째 문제 하나만 안내 */
  const validate = (): { message: string; ref?: RefObject<HTMLElement | null> } | null => {
    if (!image && !hasExistingImage) return { message: '이미지 파일을 등록해 주세요.' };
    if (!title.trim()) return { message: '자료 제목을 입력해 주세요.', ref: titleRef };
    if (!detail.trim()) return { message: `${config.detailLabel}을 입력해 주세요.`, ref: detailRef };
    if (config.hasAiTool && !aiTool.trim())
      return { message: '사용한 AI 도구를 입력해 주세요.', ref: aiToolRef };
    if (!parseDotDate(date))
      return { message: '실제 제작 날짜를 YYYY.MM.DD 형식으로 입력해 주세요.', ref: dateRef };
    return null;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      showAlert(error.message);
      error.ref?.current?.focus();
      return;
    }

    // 서버 업로드 없이 브라우저 미리보기 URL을 썸네일로 사용 (새로고침하면 사라짐)
    let thumbnailUrl = material?.thumbnailUrl;
    if (image) {
      if (thumbnailUrl?.startsWith('blob:')) URL.revokeObjectURL(thumbnailUrl); // 바꾼 이미지의 이전 미리보기 해제
      thumbnailUrl = URL.createObjectURL(image);
    }

    const saved: ProcessMaterial = {
      id: material?.id ?? crypto.randomUUID(),
      type,
      title: title.trim(),
      description: detail.trim(),
      aiTool: config.hasAiTool ? aiTool.trim() : undefined,
      createdAt: parseDotDate(date)!.toISOString(),
      thumbnailUrl,
      imageName: image?.name ?? material?.imageName,
    };

    if (isEdit) updateMaterial(projectId, saved);
    else addMaterial(projectId, saved);
    onClose();
  };

  return (
    <ModalShell
      titleId="material-modal-title"
      title={isEdit ? '제작 과정 자료 수정' : '제작 과정 자료 추가'}
      subtitle={
        isEdit
          ? '등록한 자료의 내용을 수정해 주세요.'
          : '창작 과정에서 사용하거나 제작한 자료를 등록해 주세요.'
      }
      width={598}
      shadow
      onClose={onClose}
    >
      <Form onSubmit={handleSubmit} noValidate>
        <Body>
          <Field role="group" aria-labelledby="material-type-label">
            <TypeLabel as="p" id="material-type-label">
              자료 유형
            </TypeLabel>
            <Chips>
              {MATERIAL_TYPES.map(({ value, label, chipWidth }) => (
                <Chip
                  key={value}
                  type="button"
                  aria-pressed={type === value}
                  $active={type === value}
                  style={{ width: chipWidth }}
                  onClick={() => setType(value)}
                >
                  {label}
                </Chip>
              ))}
            </Chips>
          </Field>

          <Fields>
            <ImageUploadBox
              file={image}
              existingName={
                hasExistingImage ? (material?.imageName ?? '등록된 이미지') : undefined
              }
              onChange={setImage}
              onInvalid={() => showAlert('지원하지 않는 이미지 형식입니다.')}
            />

            <Field>
              <FieldLabel htmlFor="material-title">자료 제목</FieldLabel>
              <TextInput
                ref={titleRef}
                id="material-title"
                autoComplete="off"
                placeholder="예: 캐릭터 초기 스케치"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="material-detail">{config.detailLabel}</FieldLabel>
              <TextArea
                ref={detailRef}
                id="material-detail"
                placeholder={config.detailPlaceholder}
                value={detail}
                onChange={(e) => setDetails((prev) => ({ ...prev, [type]: e.target.value }))}
              />
            </Field>

            {config.hasAiTool && (
              <Field>
                <FieldLabel htmlFor="material-ai-tool">사용한 AI 도구</FieldLabel>
                <TextInput
                  ref={aiToolRef}
                  id="material-ai-tool"
                  autoComplete="off"
                  placeholder="예: ChatGPT"
                  value={aiTool}
                  onChange={(e) => setAiTool(e.target.value)}
                />
              </Field>
            )}

            <DateField>
              <FieldLabel htmlFor="material-date">실제 제작 날짜</FieldLabel>
              <DateInput
                ref={dateRef}
                id="material-date"
                autoComplete="off"
                inputMode="numeric"
                maxLength={10}
                placeholder="YYYY.MM.DD"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </DateField>
          </Fields>
        </Body>

        <ModalActions>
          <ToastAnchor>{alertNode}</ToastAnchor>
          <CancelButton type="button" onClick={onClose}>
            취소
          </CancelButton>
          <AddButton type="submit">{isEdit ? '수정 완료' : '자료 추가'}</AddButton>
        </ModalActions>
      </Form>
    </ModalShell>
  );
}

/* 제목 영역 아래 18px, 내용과 버튼 사이 14px, 아래 여백 14px (Figma) */
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 18px;
  padding-bottom: 14px;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TypeLabel = styled(FieldLabel)`
  margin-bottom: 14px;
`;

const Chips = styled.div`
  display: flex;
  gap: 10px;
`;

const Chip = styled.button<{ $active: boolean }>`
  height: 28px;
  padding: 0;
  color: ${({ $active }) => ($active ? colors.selected : colors.muted)};
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  background: ${({ $active }) => ($active ? colors.selectedBg : '#f5f7fc')};
  border: 0;
  border-radius: 14px;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;

  &:hover {
    color: ${colors.selected};
  }
`;

const DateField = styled(Field)`
  width: 194px;
`;

const DateInput = styled(TextInput)`
  padding: 0 16px;
  border-radius: 9px;
`;

const AddButton = styled(SubmitButton)`
  width: 148px;
`;
