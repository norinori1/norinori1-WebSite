"use client";

import { useEffect, useRef } from "react";

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      // マウス座標を -1.0 〜 1.0 の範囲に正規化
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    resize();

    // パーティクルの初期化
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * 2000 - 1000,
      y: Math.random() * 2000 - 1000,
      z: Math.random() * 2 + 1, // 奥行き（速度とパララックス強度に影響）
      size: Math.random() * 2 + 1,
    }));

    const draw = () => {
      // パララックスのターゲットオフセットを計算
      const targetOffsetX = mouseRef.current.x * 30;
      const targetOffsetY = mouseRef.current.y * 30;

      // 滑らかに追従（イージング）
      offsetRef.current.x += (targetOffsetX - offsetRef.current.x) * 0.05;
      offsetRef.current.y += (targetOffsetY - offsetRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // 1. グリッドの描画
      const gridSize = 60;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.strokeStyle = "rgba(59, 130, 246, 0.12)";
      ctx.lineWidth = 1;

      // 縦線
      for (let x = -gridSize * 20; x <= gridSize * 20; x += gridSize) {
        const drawX = centerX + x - offsetRef.current.x * 0.5;
        if (drawX < 0 || drawX > width) continue;
        ctx.beginPath();
        ctx.moveTo(drawX, 0);
        ctx.lineTo(drawX, height);
        ctx.stroke();
      }

      // 横線
      for (let y = -gridSize * 20; y <= gridSize * 20; y += gridSize) {
        const drawY = centerY + y - offsetRef.current.y * 0.5;
        if (drawY < 0 || drawY > height) continue;
        ctx.beginPath();
        ctx.moveTo(0, drawY);
        ctx.lineTo(width, drawY);
        ctx.stroke();
      }

      // 2. パーティクルの描画
      ctx.fillStyle = "rgba(59, 130, 246, 0.4)";
      particles.forEach((p) => {
        // 奥行きに応じたパララックス
        const px = centerX + p.x - offsetRef.current.x * p.z;
        const py = centerY + p.y - offsetRef.current.y * p.z;

        // 画面内にある場合のみ描画
        if (px > 0 && px < width && py > 0 && py < height) {
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // ゆっくり移動
        p.y -= 0.2 * p.z;
        if (p.y < -1000) p.y = 1000;
      });

      // 3. スキャンライン（水平に走る光の線）
      const scanTime = Date.now() * 0.001;
      const scanY = (scanTime * 100) % (height + 200) - 100;
      const grad = ctx.createLinearGradient(0, scanY - 50, 0, scanY);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(1, "rgba(59, 130, 246, 0.03)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 50, width, 50);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ z-index: 0 }}
    />
  );
}
