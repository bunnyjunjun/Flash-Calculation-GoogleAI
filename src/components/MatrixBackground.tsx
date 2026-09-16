import React, { useEffect, useRef } from 'react';

interface MatrixBackgroundProps {
  density?: 'low' | 'normal' | 'high';
  opacity?: number;
  highlightSpeed?: boolean;
}

export const MatrixBackground: React.FC<MatrixBackgroundProps> = ({
  density = 'normal',
  opacity = 0.45,
  highlightSpeed = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const characters =
      '0123456789+-=*/%0123456789ｱｲｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾔﾕﾗﾘﾜXYZΣπΩ';
    const charArray = characters.split('');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const fontSize = density === 'high' ? 14 : density === 'low' ? 20 : 16;
    let columns = Math.floor(width / fontSize);
    let drops: number[] = new Array(columns).fill(1).map(() => Math.floor(Math.random() * -50));
    let speeds: number[] = new Array(columns).fill(1).map(() => (Math.random() * 0.8 + 0.6) * (highlightSpeed ? 1.6 : 1));

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(1).map(() => Math.floor(Math.random() * -50));
      speeds = new Array(columns).fill(1).map(() => (Math.random() * 0.8 + 0.6) * (highlightSpeed ? 1.6 : 1));
    };

    window.addEventListener('resize', handleResize);

    let lastTime = 0;
    const fps = 32;
    const interval = 1000 / fps;

    const draw = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(draw);

      const delta = currentTime - lastTime;
      if (delta < interval) return;
      lastTime = currentTime - (delta % interval);

      // Fade canvas slightly for matrix trail persistence in dark purple void
      ctx.fillStyle = 'rgba(6, 2, 12, 0.12)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Render head glyph in bright lavender/white
        ctx.fillStyle = '#f5d0fe';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#e879f9';
        ctx.fillText(text, x, y);

        // Render body glyphs in purple gradient
        if (drops[i] > 1) {
          const prevText = charArray[Math.floor(Math.random() * charArray.length)];
          ctx.fillStyle = '#a855f7';
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#7e22ce';
          ctx.fillText(prevText, x, y - fontSize);
        }

        ctx.shadowBlur = 0;

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i] += speeds[i];
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [density, highlightSpeed]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ opacity }}
      />
      {/* Subtle vignette + CRT Scanline layer */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#06020c]/40 to-[#06020c]/90 pointer-events-none" />
      <div className="absolute inset-0 crt-scanlines pointer-events-none opacity-40" />
    </div>
  );
};
