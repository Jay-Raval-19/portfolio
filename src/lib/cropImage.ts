import type { PixelCrop } from 'react-image-crop';

export type CroppedResult = {
  blob: Blob;
  width: number;
  height: number;
};

// Longest edge we keep. A 24MP crop stored raw is several MB per frame and the
// gallery never renders wider than one masonry column, so cap it on the way in.
const MAX_EDGE = 2400;

/**
 * Render `crop` (in displayed pixels) of an <img> element to a JPEG Blob,
 * downscaled so its longest edge is at most MAX_EDGE. Returns the blob plus its
 * pixel dimensions so the caller can store the exact aspect ratio.
 */
export async function getCroppedBlob(
  image: HTMLImageElement,
  crop: PixelCrop
): Promise<CroppedResult> {
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const nativeW = Math.max(1, Math.round(crop.width * scaleX));
  const nativeH = Math.max(1, Math.round(crop.height * scaleY));

  // Never upscale - only shrink when the crop exceeds the cap.
  const fit = Math.min(1, MAX_EDGE / Math.max(nativeW, nativeH));
  const width = Math.max(1, Math.round(nativeW * fit));
  const height = Math.max(1, Math.round(nativeH * fit));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    width,
    height
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Crop failed'))),
      'image/jpeg',
      0.85
    );
  });

  return { blob, width, height };
}
