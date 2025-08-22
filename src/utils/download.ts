export function downloadSvg(svg: SVGSVGElement, filename: string) {
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);

  const blob = new Blob([source], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

export function downloadPng(svg: SVGSVGElement, filename: string) {
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);

  const canvas = document.createElement('canvas');
  canvas.width = svg.width.baseVal.value;
  canvas.height = svg.height.baseVal.value;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }

  const img = new Image();
  img.onload = () => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const url = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(source)))}`;
}