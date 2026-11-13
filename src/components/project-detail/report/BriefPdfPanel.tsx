import { useState } from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import SidePanel from '../SidePanel';
import { OutlineBlueButton } from './report.styles';
import { useAlertModal } from '../../../hooks/useAlertModal';
import type { BriefReport } from '../../../types/brief';
import { buildBriefFileName } from '../../../utils/brief';
import { formatDate } from '../../../utils/formatDate';
import { colors, media } from '../../../styles/theme';

const INCLUDED_ITEMS = [
  'Brief 본문',
  '출처 태그',
  '창작 과정 참고자료 목록',
  '추가 확인·보완사항',
  '법적 한계 안내',
] as const;

interface Props {
  projectTitle: string;
  report: BriefReport;
  /** 실제 PDF 다운로드 버튼 (서버 PDF, ReportPdfDownload) */
  downloadButton: ReactNode;
  onClose: () => void;
}

// 리포트 탭 5번: PDF 저장 패널 (오른쪽, 옅은 배경)
// 포함 항목 체크는 화면에서만 바뀌고, 실제 PDF 생성은 서버 연동 후

export default function BriefPdfPanel({ projectTitle, report, downloadButton, onClose }: Props) {
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(INCLUDED_ITEMS.map((item) => [item, true])),
  );
  const { alertNode } = useAlertModal(1800, 'subtle');

  return (
    <Panel width={374} overlay labelledBy="brief-pdf-title" onClose={onClose}>
      <Top>
        <Title id="brief-pdf-title">PDF 저장</Title>
        <CloseButton type="button" aria-label="PDF 저장 닫기" onClick={onClose}>
          ×
        </CloseButton>
      </Top>
      <Subtitle>Copyright Brief v{report.version} · 사용자 수정 내용 포함</Subtitle>

      <FileBox>
        <BoxLabel>파일 이름</BoxLabel>
        <FileName>{buildBriefFileName(projectTitle, report.version)}</FileName>
      </FileBox>

      <IncludedBox>
        <BoxTitle>PDF 포함 항목</BoxTitle>
        {INCLUDED_ITEMS.map((item) => (
          <CheckRow key={item}>
            <Checkbox
              type="button"
              role="checkbox"
              aria-checked={checked[item]}
              $checked={checked[item]}
              onClick={() => setChecked((prev) => ({ ...prev, [item]: !prev[item] }))}
            >
              {checked[item] ? '✓' : ''}
            </Checkbox>
            <CheckLabel>{item}</CheckLabel>
          </CheckRow>
        ))}
        <SourcesNote>
          <p>출처도 함께 저장</p>
          <p>사용자 진술 · 첨부자료 기반 · 미확인 상태 포함</p>
        </SourcesNote>
      </IncludedBox>

      <VersionBox>
        <BoxTitle>저장 버전</BoxTitle>
        <VersionText>
          v{report.version} · {formatDate(report.generatedAt)} · 현재 사용자 수정 내용 포함
        </VersionText>
        <VersionHint>이 문서는 등록 준비용 초안이며 법적 판단을 보장하지 않아요.</VersionHint>
      </VersionBox>

      <Actions>
        <ToastAnchor>{alertNode}</ToastAnchor>
        {/* 포함 항목 체크는 화면 표시용 (서버 PDF는 버전 전체를 내려받음) */}
        {downloadButton}
        <OutlineBlueButton type="button" onClick={onClose}>
          취소
        </OutlineBlueButton>
      </Actions>
    </Panel>
  );
}

/* Figma: 374px, 위 38 / 좌우 22 / 아래 74 */
const Panel = styled(SidePanel)`
  padding: 38px 22px 74px;

  ${media.mobile} {
    padding: 24px 16px 32px;
  }
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  height: 34px;
`;

const Title = styled.h3`
  margin: 0;
  color: ${colors.textStrong};
  font-size: 21px;
  font-weight: 700;
  line-height: 27px;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  color: ${colors.contributionMuted};
  font-size: 17px;
  font-weight: 500;
  line-height: 1;
  background: ${colors.rowBg};
  border: 0;
  border-radius: 14px;
  cursor: pointer;

  /* 모바일: 터치하기 쉬운 크기 */
  ${media.mobile} {
    width: 40px;
    height: 40px;
    border-radius: 20px;
  }
`;

const Subtitle = styled.p`
  margin: 14px 0 0;
  color: ${colors.contributionMuted};
  font-size: 10px;
  line-height: 16px;
`;

const Box = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
  border-radius: 10px;
`;

/* Figma: 부제 아래 큰 여백(약 90px) 후 파일 이름 */
const FileBox = styled(Box)`
  margin-top: 90px;

  ${media.mobile} {
    margin-top: 32px;
  }

  padding: 12px 14px;
  border: 1px solid ${colors.contributionBorder};
`;

const BoxLabel = styled.p`
  margin: 0;
  color: ${colors.contributionMuted};
  font-size: 10px;
  font-weight: 500;
  line-height: 14px;
`;

const FileName = styled.p`
  display: flex;
  align-items: center;
  height: 36px;
  margin: 0;
  padding: 0 10px;
  overflow: hidden;
  color: ${colors.textStrong};
  font-size: 10px;
  line-height: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: ${colors.rowBg};
  border-radius: 8px;
`;

const IncludedBox = styled(Box)`
  margin-top: 14px;
  padding: 14px;
  border: 1px solid ${colors.contributionBorder};
`;

const BoxTitle = styled.h4`
  margin: 0;
  color: ${colors.textStrong};
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
`;

const CheckRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 30px;
`;

const Checkbox = styled.button<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  color: ${colors.primary};
  font-size: 10px;
  font-weight: 600;
  background: ${({ $checked }) => ($checked ? colors.chipPositiveBg : colors.card)};
  border: 1px solid ${({ $checked }) => ($checked ? 'transparent' : colors.softBlueBorder)};
  border-radius: 6px;
  cursor: pointer;
`;

const CheckLabel = styled.span`
  color: ${colors.textStrong};
  font-size: 10px;
  line-height: 15px;
`;

const SourcesNote = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  line-height: 14px;

  p {
    margin: 0;
    color: ${colors.contributionMuted};
    font-size: 9px;
  }

  p:first-child {
    color: ${colors.primary};
    font-size: 10px;
    font-weight: 600;
  }
`;

const VersionBox = styled(Box)`
  margin-top: 14px;
  padding: 14px;
  background: ${colors.softBlueBg};

  h4 {
    font-size: 11px;
  }
`;

const VersionText = styled.p`
  margin: 0;
  color: ${colors.contributionMuted};
  font-size: 10px;
  line-height: 15px;
`;

const VersionHint = styled.p`
  margin: 0;
  color: ${colors.contributionMuted};
  font-size: 9px;
  line-height: 14px;
`;

const Actions = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
  padding-top: 24px;
`;

/* 알림 토스트: 버튼 바로 위 가운데 */
const ToastAnchor = styled.div`
  position: absolute;
  top: -28px;
  left: 50%;
  width: 0;
  height: 0;
`;
