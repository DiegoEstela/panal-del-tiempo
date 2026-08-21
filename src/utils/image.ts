const MAX_BYTES = 700_000;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo leer la imagen'));
    };
    image.src = url;
  });
}

function drawToCanvas(image: HTMLImageElement, maxDimension: number): HTMLCanvasElement {
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No se pudo procesar la imagen');
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function estimateDataUrlBytes(dataUrl: string): number {
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
  return Math.round((base64.length * 3) / 4);
}

/**
 * Redimensiona y comprime una foto en el navegador (sin subirla a ningún
 * lado) para poder guardarla como data URL directo en el documento del
 * recuerdo, sin necesitar Firebase Storage.
 */
export async function resizeAndCompressImage(file: File, maxDimension = 900, quality = 0.72): Promise<string> {
  const image = await loadImage(file);
  const canvas = drawToCanvas(image, maxDimension);

  let dataUrl = canvas.toDataURL('image/jpeg', quality);
  if (estimateDataUrlBytes(dataUrl) > MAX_BYTES) {
    dataUrl = canvas.toDataURL('image/jpeg', quality * 0.6);
  }
  return dataUrl;
}
