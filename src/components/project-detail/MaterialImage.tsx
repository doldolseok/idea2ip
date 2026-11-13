import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getMaterialImage } from '../../api/materials';
import { colors } from '../../styles/theme';

export default function MaterialImage({ materialId, fileId, fileName, compact = false }: {
  materialId: string; fileId: number; fileName: string; compact?: boolean;
}) {
  const [attempt, setAttempt] = useState(0);
  const key = `${materialId}/${fileId}/${attempt}`;
  const [result, setResult] = useState<{ key: string; url?: string; error?: string }>();
  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem('accessToken');
    let objectUrl: string | undefined;
    getMaterialImage(materialId, String(fileId), controller.signal).then((blob) => {
      if (controller.signal.aborted) return;
      if (localStorage.getItem('accessToken') !== token) {
        setResult({ key, error: '로그인 상태가 변경되었습니다.' });
        return;
      }
      objectUrl = URL.createObjectURL(blob);
      setResult({ key, url: objectUrl });
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setResult({ key, error: error instanceof Error ? error.message : '이미지 조회에 실패했습니다.' });
    });
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [materialId, fileId, key]);
  const current = result?.key === key ? result : undefined;
  if (current?.error) return <State role="alert" title={current.error} $compact={compact}>
    <span>{compact ? '이미지 오류' : current.error}</span>
    <RetryButton type="button" onClick={() => setAttempt((value) => value + 1)}>재시도</RetryButton>
  </State>;
  if (!current?.url) return <State role="status" $compact={compact}>이미지 로딩 중…</State>;
  return <Image src={current.url} alt={fileName} $compact={compact}
    onError={() => setResult({ key, error: '이미지를 표시할 수 없습니다.' })} />;
}

const State = styled.div<{ $compact: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 4px;
  color: ${colors.textSecondary};
  font-size: ${({ $compact }) => ($compact ? 11 : 14)}px;
  text-align: center;
`;

const RetryButton = styled.button`
  padding: 2px 8px;
  color: ${colors.primary};
  font-size: inherit;
  background: ${colors.card};
  border: 1px solid ${colors.softBlueBorder};
  border-radius: 9px;
  cursor: pointer;
`;

const Image = styled.img<{ $compact: boolean }>`
  display: block;
  max-width: 100%;
  max-height: ${({ $compact }) => ($compact ? '100%' : '360px')};
  object-fit: ${({ $compact }) => ($compact ? 'cover' : 'contain')};
`;
