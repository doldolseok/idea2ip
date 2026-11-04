import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Logo from './Logo';
import { colors } from '../styles/theme';

interface Props {
  children: ReactNode;
  /** true면 로고를 카드 안쪽 위에, false면 카드 바깥 위에 표시 */
  logoInCard?: boolean;
}

export default function AuthLayout({ children, logoInCard = false }: Props) {
  const logo = (
    <LogoLink to="/login" aria-label="Idea2IP">
      <Logo />
    </LogoLink>
  );

  return (
    <Page>
      {!logoInCard && <LogoOutside>{logo}</LogoOutside>}
      <Card>
        {logoInCard && <LogoInside>{logo}</LogoInside>}
        {children}
      </Card>
    </Page>
  );
}

const Page = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: ${colors.bg};
`;

const LogoLink = styled(Link)`
  display: inline-block;
  text-decoration: none;

  img {
    display: block;
  }
`;

const LogoOutside = styled.div`
  margin-bottom: 60px;
`;

const LogoInside = styled.div`
  margin: 16px 0 60px;
  text-align: center;
`;

const Card = styled.section`
  width: 100%;
  max-width: 460px;
  padding: 14px clamp(24px, 15%, 70px);
  background: ${colors.card};
  border-radius: 14px;
`;
