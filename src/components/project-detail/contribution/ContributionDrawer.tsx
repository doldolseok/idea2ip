import type { ReactNode } from 'react';
import styled from 'styled-components';
import { Pill } from '../interview/interview.styles';
import SidePanel from '../SidePanel';
import EvidenceTag from '../EvidenceTag';
import type { ContributionEvidence } from '../../../types/contribution';
import { formatStepNumber } from '../../../utils/contribution';
import { colors, media } from '../../../styles/theme';

/** 패널에 표시할 단계 내용 (서버 단계 상세 응답에서 만듦) */
export interface ContributionDrawerView {
  kindLabel: string;
  title: string;
  /** 제목 아래 보조 문구 (등록 시각 / 검토 상태) */
  meta?: string;
  description: string;
  fileNames: string[];
  aiUsage: string[];
  humanContribution: string[];
  evidence: (ContributionEvidence & { href?: string; detail?: string })[];
}

interface Props {
  index: number;
  total: number;
  /** 단계 제목 (상세를 불러오기 전에도 표시) */
  title: string;
  kindLabel: string;
  /** 없으면 status 안내만 표시 (불러오는 중 / 오류) */
  view?: ContributionDrawerView;
  status?: ReactNode;
  /** 내용 아래 추가 버튼 (검토 결정, 디자인에 없음) */
  extra?: ReactNode;
  onClose: () => void;
  onMove: (index: number) => void;
  /** "제작 과정에서 보기 ↗" → 제작 과정 탭 */
  onViewProcess: () => void;
}

// 창작 기여 정리 단계 상세 패널 (화면 오른쪽, 배경 어둡게 처리 없음)
// 초기 스케치 / AI 활용 / 직접 수정 / 최종 작품 모두 이 컴포넌트 하나로 표시

export default function ContributionDrawer({
  index,
  total,
  title,
  kindLabel,
  view,
  status,
  extra,
  onClose,
  onMove,
  onViewProcess,
}: Props) {
  const hasPrev = index > 0;
  const hasNext = index < total - 1;

  return (
    <Drawer width={365} labelledBy="contribution-drawer-title" onClose={onClose}>
      <Top>
        <StageLabel>
          <Pill $tone="positive" $width={36}>
            {formatStepNumber(index)}
          </Pill>
          <KindLabel>{view?.kindLabel ?? kindLabel}</KindLabel>
        </StageLabel>
        <CloseButton type="button" aria-label="상세 패널 닫기" onClick={onClose}>
          ×
        </CloseButton>
      </Top>

      <Title id="contribution-drawer-title">{view?.title ?? title}</Title>
      {view?.meta && <DateText>{view.meta}</DateText>}

      {!view ? <StatusArea>{status}</StatusArea> : (
      <Sections>
        <DescriptionBox>
          <SectionTitle>단계 설명</SectionTitle>
          <Body>{view.description}</Body>
        </DescriptionBox>

        <Section $minHeight={154}>
          <SectionHead>
            <SectionTitle>연결 자료</SectionTitle>
            <LinkButton type="button" onClick={onViewProcess}>
              제작 과정에서 보기 ↗
            </LinkButton>
          </SectionHead>
          {view.fileNames.length > 0 ? (
            <Files>
              {view.fileNames.map((name, i) => (
                <FileRow key={`${name}-${i}`}>
                  <FileIcon aria-hidden="true">□</FileIcon>
                  <FileName title={name}>{name}</FileName>
                </FileRow>
              ))}
            </Files>
          ) : (
            <Body>연결된 파일이 없어요.</Body>
          )}
        </Section>

        <Section $minHeight={108}>
          <SectionTitle>AI 활용 내용</SectionTitle>
          <Bullets items={view.aiUsage} />
        </Section>

        <Section $minHeight={128}>
          <SectionTitle>직접 창작·수정한 부분</SectionTitle>
          <Bullets items={view.humanContribution} />
        </Section>

        <EvidenceSection>
          <EvidenceTitle>근거 및 출처</EvidenceTitle>
          {view.evidence.length === 0 && <Body>연결된 출처가 없어요.</Body>}
          {view.evidence.map((evidence, i) => (
            <EvidenceRow key={`${evidence.kind}-${evidence.source}-${i}`}>
              <EvidenceTag kind={evidence.kind} size="sm" />
              <EvidenceSource title={evidence.detail ?? evidence.source}>
                {evidence.href ? (
                  <a href={evidence.href} target="_blank" rel="noreferrer">{evidence.source}</a>
                ) : evidence.source}
              </EvidenceSource>
            </EvidenceRow>
          ))}
        </EvidenceSection>
      </Sections>
      )}

      {extra && <Extra>{extra}</Extra>}

      {/* 첫 단계: 다음만 / 중간: 이전·다음 / 마지막: 이전만 (하나면 가운데 정렬) */}
      <Nav $single={hasPrev !== hasNext}>
        {hasPrev && (
          <PrevButton type="button" onClick={() => onMove(index - 1)}>
            ← 이전 단계
          </PrevButton>
        )}
        {hasNext && (
          <NextButton type="button" onClick={() => onMove(index + 1)}>
            다음 단계 →
          </NextButton>
        )}
      </Nav>
    </Drawer>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <BulletList>
      {items.map((text, i) => (
        <li key={`${text}-${i}`}>• {text}</li>
      ))}
    </BulletList>
  );
}

/* Figma: 오른쪽에 붙은 365px 카드, 화면 높이만큼, 오버레이 없음 */
const Drawer = styled(SidePanel)`
  padding: 34px 38px 27px 37px;

  ${media.mobile} {
    padding: 24px 16px;
  }
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 34px;
  flex-shrink: 0;
`;

const StageLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const KindLabel = styled.span`
  color: ${colors.contributionMuted};
  font-size: 9px;
  font-weight: 500;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  color: ${colors.contributionMuted};
  font-size: 18px;
  font-weight: 500;
  line-height: 1;
  background: ${colors.bg};
  border: 0;
  border-radius: 14px;
  cursor: pointer;

  &:hover {
    background: ${colors.rowBg};
  }

  /* 모바일: 터치하기 쉬운 크기 */
  ${media.mobile} {
    width: 40px;
    height: 40px;
    border-radius: 20px;
  }
`;

const Title = styled.h3`
  margin: 16px 0 0;
  color: ${colors.textStrong};
  font-size: 23px;
  font-weight: 700;
  line-height: normal;
`;

const DateText = styled.p`
  margin: 14px 0 0;
  color: ${colors.contributionMuted};
  font-size: 10px;
  line-height: normal;
`;

/* 섹션 사이 간격은 4개 프레임마다 달라서 14px로 통일 */
const Sections = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 13px;
`;

const Section = styled.section<{ $minHeight: number }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: ${({ $minHeight }) => $minHeight}px;
  padding: 16px;
  line-height: normal;
  border: 1px solid ${colors.contributionBorder};
  border-radius: 10px;
`;

const DescriptionBox = styled(Section).attrs({ $minHeight: 112 })`
  background: ${colors.bg};
  border-color: transparent;
`;

const SectionHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`;

const SectionTitle = styled.h4`
  margin: 0;
  color: ${colors.textStrong};
  font-size: 12px;
  font-weight: 600;
`;

const Body = styled.p`
  margin: 0;
  color: ${colors.contributionMuted};
  font-size: 10px;
  line-height: normal;
  word-break: keep-all;
`;

const LinkButton = styled.button`
  padding: 0;
  color: ${colors.primary};
  font-size: 10px;
  font-weight: 600;
  line-height: 14px;
  background: transparent;
  border: 0;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  ${media.mobile} {
    min-height: 40px;
    font-size: 12px;
  }
`;

const Files = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const FileRow = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 28px;
`;

const FileIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  color: ${colors.primary};
  font-size: 10px;
  font-weight: 500;
  background: ${colors.chipPositiveBg};
  border-radius: 7px;
`;

const FileName = styled.span`
  overflow: hidden;
  color: ${colors.textStrong};
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const BulletList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  color: ${colors.contributionMuted};
  font-size: 10px;
  line-height: normal;
  list-style: none;
  word-break: keep-all;
`;

const EvidenceSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-height: 102px;
  padding: 9px 10px;
  border: 1px solid ${colors.contributionBorder};
  border-radius: 10px;
`;

const EvidenceTitle = styled.h4`
  margin: 0;
  color: ${colors.textStrong};
  font-size: 10px;
  font-weight: 600;
  line-height: 14px;
`;

const EvidenceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 22px;
`;

const EvidenceSource = styled.span`
  a {
    color: ${colors.primary};
  }

  min-width: 0;
  overflow: hidden;
  color: ${colors.contributionMuted};
  font-size: 9px;
  line-height: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/* 버튼이 하나면 가운데, 둘이면 양 끝 (Figma 마지막 단계의 위치 차이는 통일) */
const Nav = styled.div<{ $single: boolean }>`
  display: flex;
  justify-content: ${({ $single }) => ($single ? 'center' : 'space-between')};
  margin-top: auto;
  padding-top: 24px;
`;

const NavButton = styled.button`
  height: 40px;

  ${media.mobile} {
    height: 44px;
    font-size: 13px;
  }

  font-size: 11px;
  line-height: normal;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s;
`;

const PrevButton = styled(NavButton)`
  width: 132px;
  color: ${colors.contributionMuted};
  font-weight: 500;
  background: ${colors.bg};

  &:hover {
    background: ${colors.rowBg};
  }
`;

const NextButton = styled(NavButton)`
  width: 142px;
  color: #fff;
  font-weight: 600;
  background: ${colors.primary};

  &:hover {
    background: ${colors.primaryHover};
  }
`;

const StatusArea = styled.div`
  margin-top: 24px;
`;

const Extra = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 14px;
`;
