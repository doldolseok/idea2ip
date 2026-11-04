# Idea2IP

AI와 함께 만든 창작물의 제작 과정을 정리하고, 나의 창작적 기여를 저작권 등록 준비의 언어로 바꿔주는 AI 코파일럿 (4호선톤)

## 시작하기
```bash
npm install
cp .env.example .env
npm run dev
```

## 기술 스택
React · Vite · TypeScript · styled-components · React Router · TanStack Query · Zustand · React Hook Form

## 폴더 구조
```
src/
  pages/       라우트 단위 화면 (Home, Input, Journey, Interview, Structuring, Brief)
  components/  공용 UI 컴포넌트
  features/    기능별 로직/컴포넌트
  api/         API 호출
  hooks/       커스텀 훅
  store/       Zustand 스토어
  styles/      글로벌 스타일, 테마
  types/       공용 타입
```

## 브랜치 / 커밋 규칙
- `main`: 배포/데모용, 직접 push 금지 → PR로만 머지
- 작업 브랜치: `feat/기능명`, `fix/내용`, `chore/내용`
- 커밋: `feat: ...`, `fix: ...`, `style: ...`, `refactor: ...`, `docs: ...`, `chore: ...`
