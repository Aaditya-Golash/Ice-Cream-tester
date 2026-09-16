import type { MatchResult, Preferences } from './matcher';
import { FLAVOUR_LABELS, PIECE_LABELS, RIBBON_LABELS } from './catalog';

function wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines = 4) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (context.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
      if (lines.length === maxLines) break;
    } else line = test;
  }
  if (lines.length < maxLines && line) lines.push(line);
  lines.forEach((item, index) => context.fillText(item, x, y + index * lineHeight));
  return y + lines.length * lineHeight;
}

export async function createFlavaCard(preferences: Preferences, result: MatchResult | null) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is unavailable.');

  const paper = '#f8edcf';
  const chocolate = '#3f2119';
  const orange = '#f26a2e';
  const berry = '#a32045';
  const mint = '#bfd7cd';
  context.fillStyle = paper;
  context.fillRect(0, 0, 1080, 1350);
  context.globalAlpha = .12;
  context.fillStyle = chocolate;
  for (let x = 18; x < 1080; x += 20) {
    for (let y = 18; y < 1350; y += 20) {
      context.beginPath();
      context.arc(x, y, 1.2, 0, Math.PI * 2);
      context.fill();
    }
  }
  context.globalAlpha = 1;
  context.fillStyle = orange;
  context.beginPath();
  context.ellipse(940, 126, 280, 190, -.25, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = berry;
  context.beginPath();
  context.ellipse(1010, 1160, 340, 220, .42, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = chocolate;
  context.lineWidth = 6;
  context.beginPath();
  context.roundRect(62, 62, 956, 1226, 18);
  context.stroke();

  context.fillStyle = chocolate;
  context.font = '900 28px Arial';
  context.fillText('FIND YA FLAVA', 106, 130);
  context.font = '800 17px Arial';
  context.fillText('MY SPOONFUL MATCH', 108, 166);
  context.fillStyle = berry;
  context.font = '900 22px Arial';
  context.fillText(result && result.score > 0 ? 'MY FLAVA IS' : 'MY FLAVOUR DIRECTION', 106, 270);
  context.fillStyle = chocolate;
  context.font = '900 82px Georgia';
  const title = result?.product.name ?? 'A new pint idea';
  const titleBottom = wrapText(context, title, 106, 360, 770, 88, 3);

  const palette = result?.product.palette ?? [orange, mint, berry];
  context.fillStyle = palette[1];
  context.beginPath();
  context.ellipse(550, 770, 335, 170, -.05, 0, Math.PI * 2);
  context.fill();
  context.stroke();
  context.fillStyle = palette[0];
  context.beginPath();
  context.moveTo(242, 790);
  context.bezierCurveTo(330, 620, 455, 620, 550, 690);
  context.bezierCurveTo(675, 610, 790, 660, 858, 795);
  context.closePath();
  context.fill();
  context.stroke();
  context.strokeStyle = palette[2];
  context.lineWidth = preferences.ribbonAmount === 'thick' ? 30 : 18;
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(285, 775);
  context.bezierCurveTo(390, 675, 475, 805, 585, 715);
  context.bezierCurveTo(675, 650, 760, 770, 818, 700);
  context.stroke();
  context.strokeStyle = chocolate;
  context.lineWidth = 34;
  context.beginPath();
  context.moveTo(826, 804);
  context.lineTo(990, 920);
  context.stroke();
  context.strokeStyle = '#d6e0dc';
  context.lineWidth = 22;
  context.beginPath();
  context.moveTo(826, 793);
  context.lineTo(990, 909);
  context.stroke();

  context.fillStyle = chocolate;
  context.font = '700 27px Arial';
  const flavourLine = preferences.flavours.length ? preferences.flavours.map((key) => FLAVOUR_LABELS[key]).join(' + ') : 'A first-bite flavour still to be named';
  wrapText(context, flavourLine, 106, Math.max(titleBottom + 42, 590), 820, 38, 2);

  const pieces = preferences.pieces.length ? preferences.pieces.map((key) => PIECE_LABELS[key]).join(', ') : 'No pieces selected';
  context.beginPath();
  context.roundRect(106, 1008, 868, 132, 12);
  context.fillStyle = '#fff8e7';
  context.fill();
  context.strokeStyle = chocolate;
  context.lineWidth = 4;
  context.stroke();
  context.fillStyle = berry;
  context.font = '900 16px Arial';
  context.fillText('THE BITE', 136, 1050);
  context.fillStyle = chocolate;
  context.font = '700 20px Arial';
  wrapText(context, `${pieces} · ${RIBBON_LABELS[preferences.ribbon]}`, 136, 1090, 790, 28, 2);
  context.fillStyle = paper;
  context.font = '900 19px Arial';
  context.fillText('BUILD YOUR SPOONFUL. FIND YOUR PINT.', 106, 1225);
  context.font = '600 14px Arial';
  context.fillText('Independent audition project by Aaditya Golash.', 106, 1257);

  return await new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Could not create the card.')), 'image/png'));
}

export async function downloadFlavaCard(preferences: Preferences, result: MatchResult | null) {
  const blob = await createFlavaCard(preferences, result);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `find-ya-flava-${result?.product.id ?? 'flavour-idea'}.png`;
  anchor.click();
  URL.revokeObjectURL(url);
}
