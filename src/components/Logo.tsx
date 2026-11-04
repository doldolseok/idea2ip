import logoImage from '../assets/LogoImage.png';

export default function Logo({ width = 222 }: { width?: number }) {
  return <img src={logoImage} alt="Idea2IP" width={width} />;
}
