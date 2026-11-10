import { useCallback, useState } from 'react';
import styled from 'styled-components';
import MaterialModal from './MaterialModal';
import type { ProcessMaterial } from '../../types/project';
import plusIcon from '../../assets/plus-small.svg';
import emptyMaterialsIcon from '../../assets/empty-materials.svg';
import DetailCard from './DetailCard';
import TimelineItem from './TimelineItem';
import PrimaryButton from '../PrimaryButton';
import { useProjectMaterials } from '../../store/projectStore';
import { colors } from '../../styles/theme';

// 프로젝트 상세 > "제작 과정" 탭: 창작 과정 타임라인
// - 제작자료 있음: 오른쪽 위 "새 제작자료" 버튼 + 타임라인 목록
// - 제작자료 없음: 가운데 안내 문구 + "새 제작자료" 버튼 (오른쪽 위 버튼은 숨김)

export default function ProcessTab({ projectId }: { projectId: string }) {
  // TODO: 제작자료 API 연동 시 projectId 기준 조회로 교체
  const materials = useProjectMaterials(projectId);
  const isEmpty = materials.length === 0;
  // null: 닫힘 / { material: undefined }: 추가 / { material }: 해당 자료 수정
  const [modal, setModal] = useState<{ material?: ProcessMaterial } | null>(null);
  const openModal = () => setModal({});
  const openEditModal = (material: ProcessMaterial) => setModal({ material });
  const closeModal = useCallback(() => setModal(null), []);

  return (
    <DetailCard>
      <Header>
        <TitleGroup>
          <Title>창작 과정 타임라인</Title>
          <Subtitle>자료별 제작 과정과 역할을 연결할 수 있어요.</Subtitle>
        </TitleGroup>
        {!isEmpty && <NewMaterialButton onClick={openModal} />}
      </Header>

      {isEmpty ? (
        <EmptyState>
          <EmptyMessage>
            <EmptyIcon>
              <img src={emptyMaterialsIcon} alt="" width={60} height={60} />
            </EmptyIcon>
            <EmptyText>
              제작 자료를 등록해 주세요.
              <EmptySubText>
                초기 스케치, AI 생성 이미지, 수정본 등을 자유롭게 추가할 수 있어요.
              </EmptySubText>
            </EmptyText>
          </EmptyMessage>
          <NewMaterialButton onClick={openModal} />
        </EmptyState>
      ) : (
        <Timeline>
          {materials.map((material, index) => (
            <TimelineItem
              key={material.id}
              index={index}
              material={material}
              onEdit={openEditModal}
            />
          ))}
        </Timeline>
      )}

      {modal && (
        <MaterialModal projectId={projectId} material={modal.material} onClose={closeModal} />
      )}
    </DetailCard>
  );
}

function NewMaterialButton({ onClick }: { onClick: () => void }) {
  return (
    <PrimaryButton type="button" $size="md" onClick={onClick}>
      <img src={plusIcon} alt="" width={14} height={14} />새 제작자료
    </PrimaryButton>
  );
}

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Title = styled.h2`
  margin: 0;
  color: #000;
  font-size: 22px;
  font-weight: 600;
  line-height: normal;
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${colors.textSecondary};
  font-size: 14px;
  line-height: 1.4;
`;

/* 번호 뱃지가 카드 왼쪽 여백 안쪽으로 들어가도록 (Figma 기준 -23px) */
const Timeline = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 22px;
  margin: 31px 0 0 -23px;
  padding: 0;
  list-style: none;
`;

/* Figma: 카드 위쪽에서 147px 지점부터 높이 318px 영역, 내용은 세로 가운데 */
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 36px;
  min-height: 318px;
  margin: 51px 0 36px;
`;

const EmptyMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
`;

/* Figma 레이아웃 박스는 50px, 원형 아이콘(60px)은 박스 밖으로 살짝 넘침 */
const EmptyIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;

  img {
    display: block;
    flex-shrink: 0;
  }
`;

const EmptyText = styled.p`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 10px;
  color: ${colors.textMuted};
  font-size: 18px;
  font-weight: 500;
  line-height: 1.4;
  text-align: center;
`;

const EmptySubText = styled.span`
  color: rgba(152, 163, 181, 0.6);
`;
