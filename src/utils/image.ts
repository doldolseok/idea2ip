/** 업로드 가능한 이미지: PNG, JPG */
const SUPPORTED_MIME_TYPES = ['image/png', 'image/jpeg'];
const SUPPORTED_EXTENSIONS = /\.(png|jpe?g)$/i;

export const SUPPORTED_IMAGE_ACCEPT = 'image/png, image/jpeg';

// MIME 타입이 비어 있는 경우(일부 OS/브라우저)를 대비해 확장자도 함께 확인
export function isSupportedImage(file: File) {
  return file.type ? SUPPORTED_MIME_TYPES.includes(file.type) : SUPPORTED_EXTENSIONS.test(file.name);
}
