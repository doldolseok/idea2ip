import { useCallback, useEffect, useState } from 'react';
import AlertModal from '../components/AlertModal';
import type { AlertVariant } from '../components/AlertModal';

/**
 * const { showAlert, alertNode } = useAlertModal();
 * showAlert('아이디를 입력해주세요.');  → 1.8초 뒤 자동으로 사라짐
 * JSX 안에서 {alertNode} 를 AlertSlot 안에 넣어서 사용
 */
export function useAlertModal(duration = 1800, variant: AlertVariant = 'default') {
  const [alert, setAlert] = useState<{ id: number; text: string } | null>(null);

  useEffect(() => {
    if (!alert) return;
    const timer = window.setTimeout(() => setAlert(null), duration);
    return () => window.clearTimeout(timer);
  }, [alert, duration]);

  const showAlert = useCallback((text: string) => {
    // id를 바꿔서 같은 메시지를 연속으로 띄워도 타이머가 다시 시작되게 함
    setAlert({ id: Date.now(), text });
  }, []);

  const alertNode = alert ? (
    <AlertModal
      key={alert.id}
      message={alert.text}
      variant={variant}
      onClose={() => setAlert(null)}
    />
  ) : null;

  return { showAlert, alertNode };
}