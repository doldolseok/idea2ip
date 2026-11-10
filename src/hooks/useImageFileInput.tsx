import { useRef } from 'react';
import { SUPPORTED_IMAGE_ACCEPT, isSupportedImage } from '../utils/image';

interface Options {
  /** JPG/PNG 파일을 골랐을 때 */
  onSelect: (file: File) => void;
  /** 지원하지 않는 형식을 골랐을 때 (경고 표시용) */
  onInvalid: () => void;
}

/**
 * 숨겨진 파일 입력 + 이미지 형식 검사 (파일선택 버튼 / 드래그 앤 드롭 공통)
 * const { openPicker, handleFile, fileInput } = useImageFileInput({ onSelect, onInvalid });
 * <button onClick={openPicker}>파일 선택</button> {fileInput}
 * 드롭 영역에서는 handleFile(e.dataTransfer.files[0])
 */
export function useImageFileInput({ onSelect, onInvalid }: Options) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null | undefined) => {
    if (!file) return; // 파일 선택 창에서 취소한 경우 기존 선택 유지
    if (!isSupportedImage(file)) {
      onInvalid();
      return;
    }
    onSelect(file);
  };

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept={SUPPORTED_IMAGE_ACCEPT}
      hidden
      onChange={(e) => {
        handleFile(e.target.files?.[0]);
        e.target.value = ''; // 같은 파일을 다시 골라도 onChange가 다시 실행되게
      }}
    />
  );

  return { openPicker: () => inputRef.current?.click(), handleFile, fileInput };
}
