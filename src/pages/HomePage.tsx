import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import plusIcon from '../assets/Vector.svg';
import emptyFolderIcon from '../assets/empty-folder.svg';

// TODO: 백엔드 API 연동 시 TanStack Query(useQuery)로 교체
const projects: unknown[] = [];

const Header = styled.section`
  padding: 80px 50px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 50px;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Title = styled.h1`
  margin: 0;
  color: #131c33;
  font-family: Pretendard, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 39.2px;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #68758d;
  font-family: Pretendard, sans-serif;
  font-size: 18px;
  font-weight: 500;
  line-height: 25.2px;
`;

const NewProjectButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 40px;
  border: none;
  border-radius: 10px;
  background: #3569eb;
  color: #ffffff;
  font-family: Pretendard, sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: 25.2px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #2c5bd4;
  }
`;

const PlusImg = styled.img`
  width: 14px;
  height: 14px;
`;

const EmptyState = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 17px;
  pointer-events: none;
`;

const EmptyIcon = styled.img`
  width: 109px;
  height: 109px;
`;

const EmptyText = styled.p`
  margin: 0;
  color: rgba(104, 117, 141, 0.3);
  font-family: Pretendard, sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 33.6px;
  white-space: nowrap;
`;

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <Header>
        <TitleGroup>
          <Title>반가워요! 창작의 과정을 정리해볼까요?</Title>
          <Subtitle>나의 창작을 권리로 정리하세요.</Subtitle>
        </TitleGroup>
        <NewProjectButton type="button" onClick={() => navigate('/projects/new')}>
          <PlusImg src={plusIcon} alt="" />새 프로젝트
        </NewProjectButton>
      </Header>

      {projects.length === 0 && (
        <EmptyState>
          <EmptyIcon src={emptyFolderIcon} alt="" />
          <EmptyText>아직 등록된 프로젝트가 없어요</EmptyText>
        </EmptyState>
      )}

      {/* TODO: projects.length > 0 일 때 프로젝트 카드 그리드 */}
    </>
  );
}
