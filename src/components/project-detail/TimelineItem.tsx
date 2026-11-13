import styled from 'styled-components';
import penIcon from '../../assets/pen.svg';
import type { ProcessMaterial } from '../../types/project';
import { formatDate } from '../../utils/formatDate';
import { colors, media } from '../../styles/theme';
import MaterialImage from './MaterialImage';

interface Props {
  index: number;
  material: ProcessMaterial;
  onEdit: (material: ProcessMaterial) => void;
  onView: (material: ProcessMaterial) => void;
}

// 창작 과정 타임라인 항목 (번호 뱃지 + 제작자료 카드)

export default function TimelineItem({ index, material, onEdit, onView }: Props) {
  const { title, description, createdAt, thumbnailUrl } = material;

  return (
    <Row>
      <NumberCol>
        <NumberBadge>{String(material.materialOrder ?? index + 1).padStart(2, '0')}</NumberBadge>
      </NumberCol>
      <Card>
        <Left>
          <Thumbnail>{material.files?.[0]
            ? <MaterialImage materialId={material.id} fileId={material.files[0].fileId} fileName={material.files[0].fileName} compact />
            : thumbnailUrl && <img src={thumbnailUrl} alt="" />}</Thumbnail>
          <Text>
            <TitleGroup>
              <Title>{title}</Title>
              <Desc>{description}</Desc>
            </TitleGroup>
            {/* 첨부 정보는 디자인에 없어 줄을 늘리지 않도록 제작 날짜 줄 뒤에 붙임 */}
            <DateText title={material.files?.map((file) => file.fileName).join(', ')}>
              제작 날짜 {material.productionDate === null ? '미입력' : formatDate(material.productionDate ?? createdAt)}
              {!!material.files?.length && ` · 첨부 ${material.files.length}개`}
            </DateText>
          </Text>
        </Left>
        <Actions>
          <EditButton type="button" aria-label={`${title} 상세 보기`} onClick={() => onView(material)}>상세 보기</EditButton>
          <EditButton type="button" aria-label={`${title} 수정`} onClick={() => onEdit(material)}>
            <img src={penIcon} alt="" width={16} height={16} />
            수정
          </EditButton>
        </Actions>
      </Card>
    </Row>
  );
}

const Row = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 8px;

  /* 모바일: 번호를 카드 위에 */
  ${media.mobile} {
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
  }
`;

const NumberCol = styled.div`
  padding: 4px 0;
  flex-shrink: 0;

  ${media.mobile} {
    align-self: flex-start;
    padding: 0;
  }
`;

const NumberBadge = styled.span`
  display: block;
  padding: 6px 14px;
  color: ${colors.primary};
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
  text-align: center;
  background: ${colors.primarySoft};
  border-radius: 25px;
`;

const Card = styled.article`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 14px 10px;
  border: 1px solid ${colors.cardBorder};
  border-radius: 15px;

  /* 태블릿 이하: 버튼을 내용 아래로 */
  ${media.tablet} {
    flex-wrap: wrap;
    gap: 12px;
  }

  ${media.mobile} {
    padding: 12px;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
  min-width: 0;

  ${media.tablet} {
    flex-basis: 100%;
  }

  ${media.mobile} {
    gap: 12px;
  }
`;

const Thumbnail = styled.div`
  width: 90px;
  height: 80px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #d9d9d9;
  border-radius: 15px;

  ${media.mobile} {
    width: 72px;
    height: 64px;
    border-radius: 12px;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
  min-width: 0;
  line-height: normal;

  ${media.mobile} {
    gap: 8px;
  }
`;

/* 직접 입력한 긴 제목/설명은 한 줄로 자르고 … 표시 */
const ellipsis = `
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h3`
  margin: 0;
  color: ${colors.textStrong};
  font-size: 16px;
  font-weight: 600;
  ${ellipsis}
`;

const Desc = styled.p`
  margin: 0;
  color: ${colors.textSecondary};
  font-size: 14px;
  font-weight: 500;
  ${ellipsis}
`;

const DateText = styled.p`
  margin: 0;
  color: ${colors.textMuted};
  font-size: 14px;
  font-weight: 500;
  ${ellipsis}
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;

  ${media.tablet} {
    width: 100%;
    justify-content: flex-end;
  }
`;

const EditButton = styled.button`
  display: inline-flex;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
  padding: 6px 16px;
  color: ${colors.textSecondary};
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
  background: transparent;
  border: 1px solid ${colors.border};
  border-radius: 15px;
  cursor: pointer;
  transition: background 0.15s;

  ${media.mobile} {
    flex: 1;
    justify-content: center;
    align-items: center;
    min-height: 40px;
  }

  &:hover {
    background: ${colors.bg};
  }

  img {
    display: block;
  }
`;
