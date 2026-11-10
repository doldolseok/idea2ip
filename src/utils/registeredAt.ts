/**
 * 등록 시각 처리 (제작 자료 추가 / 최종 작품 저장 시점)
 * 지금은 브라우저 현재 시각을 쓰고, 서버 연동 시 이 파일만 서버 기록 값으로 바꾸면 됨.
 */

/** 새로 등록할 때 저장할 시각 */
// TODO: 서버 연동 시 서버가 내려준 등록 시각으로 교체
export const createRegisteredAt = () => new Date().toISOString();

/**
 * 저장된 등록 시각 (예전에 저장돼서 등록 시각이 없는 데이터는 기존 날짜로 대신)
 * @param fallback 제작 자료는 실제 제작 날짜(createdAt), 최종 작품은 저장 시각(updatedAt)
 */
export const resolveRegisteredAt = (item: { registeredAt?: string }, fallback: string) =>
  item.registeredAt ?? fallback;
