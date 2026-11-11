import { Quote, Mood } from '../types';

export interface ExportOptions {
  aspectRatio: '9:16' | '1:1';
  style: 'midnight-lime' | 'minimalist-white' | 'tattoo-script';
  fontSizeScale?: number;
}

export async function generateQuoteCardImage(
  quote: Quote,
  mood: Mood | undefined,
  options: ExportOptions
): Promise<string> {
  const isVertical = options.aspectRatio === '9:16';
  const width = isVertical ? 1080 : 1080;
  const height = isVertical ? 1920 : 1080;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not initialize canvas context');

  // Ensure fonts are loaded if possible
  if (document.fonts) {
    try {
      await document.fonts.ready;
    } catch (e) {
      // continue
    }
  }

  // 1. Background (Midnight Black 60% discipline)
  ctx.fillStyle = '#08090A';
  ctx.fillRect(0, 0, width, height);

  // Subtle luxury background gradient / vignette
  const radial = ctx.createRadialGradient(
    width / 2, height / 2, 80,
    width / 2, height / 2, width * 0.75
  );
  radial.addColorStop(0, '#11141B');
  radial.addColorStop(1, '#050608');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, width, height);

  // Decorative luxury border frame
  const margin = 50;
  ctx.strokeStyle = '#1F242F';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

  // Inner lime corner accents (10% budget)
  ctx.strokeStyle = '#C6F432';
  ctx.lineWidth = 2.5;
  const cornerLen = 36;
  
  // Top-left corner
  ctx.beginPath();
  ctx.moveTo(margin, margin + cornerLen);
  ctx.lineTo(margin, margin);
  ctx.lineTo(margin + cornerLen, margin);
  ctx.stroke();

  // Top-right corner
  ctx.beginPath();
  ctx.moveTo(width - margin - cornerLen, margin);
  ctx.lineTo(width - margin, margin);
  ctx.lineTo(width - margin, margin + cornerLen);
  ctx.stroke();

  // Bottom-left corner
  ctx.beginPath();
  ctx.moveTo(margin, height - margin - cornerLen);
  ctx.lineTo(margin, height - margin);
  ctx.lineTo(margin + cornerLen, height - margin);
  ctx.stroke();

  // Bottom-right corner
  ctx.beginPath();
  ctx.moveTo(width - margin - cornerLen, height - margin);
  ctx.lineTo(width - margin, height - margin);
  ctx.lineTo(width - margin, height - margin - cornerLen);
  ctx.stroke();

  // 2. Header: The Heritage Legacy Fancy Logo
  const startY = isVertical ? 260 : 160;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#C6F432';
  ctx.font = '700 24px "Cinzel Decorative", "The Heritage Legacy", serif';
  ctx.fillText('THE HERITAGE', width / 2, startY);

  // Mood subtitle / symbol
  ctx.fillStyle = '#A1A1AA';
  ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
  const moodLabel = mood ? `${mood.symbol} ${mood.name.toUpperCase()} · ${mood.archetype.toUpperCase()}` : 'DAILY APHORISM';
  ctx.fillText(moodLabel, width / 2, startY + 36);

  // Decorative divider
  ctx.strokeStyle = '#27272A';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 80, startY + 60);
  ctx.lineTo(width / 2 + 80, startY + 60);
  ctx.stroke();

  // 3. Main Quote: Paragone Fancy Aesthetic Serif
  const quoteFontSize = isVertical ? 46 : 38;
  ctx.font = `italic 400 ${quoteFontSize}px "Cormorant Garamond", "Paragone", Georgia, serif`;
  ctx.fillStyle = '#FFFFFF';

  // Word wrap function
  const maxWidth = width - 260;
  const words = quote.text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine + (currentLine ? ' ' : '') + words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  const lineHeight = quoteFontSize * 1.5;
  const totalTextHeight = lines.length * lineHeight;
  let quoteStartY = (height / 2) - (totalTextHeight / 2) - 30;
  if (!isVertical) quoteStartY = startY + 110;

  // Decorative opening quotation mark in lime green
  ctx.font = '700 70px "Cormorant Garamond", Georgia, serif';
  ctx.fillStyle = '#C6F432';
  ctx.fillText('“', width / 2, quoteStartY - 10);

  // Render quote lines in pure crisp white
  ctx.font = `italic 400 ${quoteFontSize}px "Cormorant Garamond", "Paragone", Georgia, serif`;
  ctx.fillStyle = '#FFFFFF';
  lines.forEach((line, idx) => {
    ctx.fillText(line, width / 2, quoteStartY + (idx * lineHeight) + 40);
  });

  // 4. Tattoo Script Tagline: Yosarosa Cursive Tattoo
  const tattooY = quoteStartY + (lines.length * lineHeight) + 90;
  ctx.font = '400 48px "Alex Brush", "Pinyon Script", "Yosarosa", cursive';
  ctx.fillStyle = '#C6F432';
  ctx.fillText(`“${quote.tattooTagline}”`, width / 2, tattooY);

  // 5. Author and Attribution
  const authorY = tattooY + 70;
  ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#F4F4F5';
  ctx.fillText(`— ${quote.author.toUpperCase()}`, width / 2, authorY);

  if (quote.source || quote.era) {
    ctx.font = '400 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#71717A';
    const sourceText = [quote.source, quote.era].filter(Boolean).join(' · ');
    ctx.fillText(sourceText, width / 2, authorY + 28);
  }

  // Footer seal
  const footerY = height - margin - 40;
  ctx.font = '400 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#52525B';
  ctx.fillText('ETCHED IN MIDNIGHT & LIME · THE HERITAGE', width / 2, footerY);

  return canvas.toDataURL('image/png');
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
