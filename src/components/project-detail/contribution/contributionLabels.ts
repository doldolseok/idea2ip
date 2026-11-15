// 창작 기여 정리 서버 상태 → 화면 문구 (ContributionTab에 있던 값을 여러 컴포넌트에서 쓰도록 모음)

export const CONTRIBUTION_REVIEW_LABELS = { NOT_STARTED: '검토 전', IN_REVIEW: '검토 중', CONFIRMED: '확정' } as const;
export const CONTRIBUTION_KIND_LABELS = { MATERIAL: '창작 자료', FINAL_ARTWORK: '최종 작품', INTERVIEW_STATEMENT: '인터뷰 진술' } as const;
export const CONTRIBUTION_STEP_REVIEW_LABELS = { UNREVIEWED: '미검토', EDITED: '수정됨', CONFIRMED: '확정', EXCLUDED: '제외됨' } as const;
export const CONTRIBUTION_GENERATION_LABELS = { QUEUED: '생성 대기', RUNNING: '생성 중', SUCCEEDED: '생성 완료', FAILED: '생성 실패' } as const;
