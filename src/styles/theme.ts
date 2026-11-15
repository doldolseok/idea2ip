export const colors = {
  bg: '#F7F9FC',
  card: '#FFFFFF',
  text: '#131C33',
  muted: '#637394',
  required: '#FA625D',
  inputBg: '#F7F9FC',
  border: '#DBE3F0',
  primary: '#3569EB',
  primaryHover: '#2A5AD6', // Figma에 없어서 내가 정한 hover 색
  textSecondary: '#68758D',
  textTertiary: '#8795AA',
  cardBorder: '#E7ECF4',
  primarySoft: '#EDF2FF',
  cardActiveBorder: '#90A6E9', // 카드 hover/선택 테두리
  textStrong: '#17213A', // 타임라인 항목 제목
  textMuted: '#98A3B5',
  textHint: '#66758F', // 최종 작품 탭 안내/요약 문구
  softBlueBorder: '#D5E0FA', // 드롭 영역 점선, 작품 교체 등 흰색 보조 버튼 테두리
  softBlueBg: '#F7F9FF', // 드롭 영역, 이미지 미리보기 배경
  // AI 인터뷰
  panelBorder: '#DFE7F2', // 시작 전 화면 카드 테두리
  rowBg: '#F6F8FC', // 필드/자료 행 배경, 보완 필요 칩, 비활성 버튼
  chipPositiveBg: '#EEF3FF', // 완료/준비됨 칩
  disabledText: '#98A5B9',
  userBubbleBg: '#F0F4FF',
  // 사용 가이드
  guideMuted: '#7888A2', // 단계 부제, "자주 묻는 질문" 제목
  guideText: '#17243B', // 안내 항목, 질문/답변
  // 창작 기여 정리
  contributionMuted: '#6F7A90', // 보조 문구
  contributionBorder: '#E2E8F2', // 타임라인/패널 카드 테두리
  chevron: '#A0A9B9',
  tabBarBg: '#F3F6FB',
  tabBarBorder: '#E4EAF3',
  tabActiveBorder: '#DDE6F5',
  chipInactiveBg: 'rgba(219, 227, 240, 0.4)',
  chipInactiveText: '#98A3B5',
  selected: '#3063ED', // 모달 선택/생성 버튼 색 (Figma 기준, primary와 살짝 다름)
  selectedBg: '#ECF1FF',
  overlay: 'rgba(13, 20, 38, 0.22)',
  overlayLight: 'rgba(23, 33, 58, 0.08)', // 리포트 편집 모달 / PDF 저장 패널 배경
} as const;

/**
 * 반응형 기준 너비 (Figma는 데스크톱만 있어서 여기 값으로 줄임)
 * - 데스크톱: 1280px 이상 (Figma 그대로)
 * - 태블릿: 768px ~ 1279px
 * - 모바일: 767px 이하
 */
export const breakpoints = {
  tablet: 768,
  desktop: 1280,
} as const;

/** styled-components 안에서 쓰는 미디어 쿼리 도우미 (예: `${media.mobile} { ... }`) */
export const media = {
  /** 태블릿 이하 (1279px 이하) */
  tablet: `@media (max-width: ${breakpoints.desktop - 1}px)`,
  /** 모바일 (767px 이하) */
  mobile: `@media (max-width: ${breakpoints.tablet - 1}px)`,
  /** 태블릿만 (768px ~ 1279px) */
  tabletOnly: `@media (min-width: ${breakpoints.tablet}px) and (max-width: ${breakpoints.desktop - 1}px)`,
  /** 데스크톱 (1280px 이상) */
  desktop: `@media (min-width: ${breakpoints.desktop}px)`,
} as const;

/** 사이드바 너비 (데스크톱 / 태블릿 아이콘 메뉴 / 모바일은 상단 바) */
export const sidebarWidths = {
  desktop: 276,
  tablet: 88,
  mobile: 0,
} as const;

/** 모바일 상단 바 높이 */
export const MOBILE_TOP_BAR_HEIGHT = 56;

/** 페이지 바깥 여백 (데스크톱: 제목 위 80px · 사이드바와 50px · 아래 60px) */
export const pagePadding = `
  padding: 80px 50px 60px;

  ${media.tablet} {
    padding: 48px 32px 48px;
  }

  ${media.mobile} {
    padding: 24px 16px 40px;
  }
`;
