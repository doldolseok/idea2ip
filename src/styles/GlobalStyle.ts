import { createGlobalStyle } from 'styled-components';
import { colors, media, sidebarWidths } from './theme';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  /* 사이드바 너비: 메인 영역만 덮는 모달/패널 오버레이가 이 값만큼 왼쪽을 비움 */
  :root {
    --sidebar-width: ${sidebarWidths.desktop}px;

    ${media.tablet} {
      --sidebar-width: ${sidebarWidths.tablet}px;
    }

    ${media.mobile} {
      --sidebar-width: ${sidebarWidths.mobile}px;
    }
  }

  html, body, #root {
    min-height: 100%;
  }

  body {
    margin: 0;
    font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont,
      'Noto Sans KR', 'Segoe UI', sans-serif;
    background: ${colors.bg};
    color: ${colors.text};
    -webkit-font-smoothing: antialiased;
  }

  button, input, textarea, select {
    font-family: inherit;
  }
`;
