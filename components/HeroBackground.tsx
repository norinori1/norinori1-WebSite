"use client";

import { useEffect, useRef } from "react";

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Honour the OS "reduce motion" setting: draw nothing at all.
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
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

    // 小さい画面ではパーティクルを減らす（電力とスクロール性能のため）
    const particleCount = window.innerWidth < 768 ? 12 : 26;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * 2000 - 1000,
      y: Math.random() * 2000 - 1000,
      z: Math.random() * 2 + 1, // 奥行き（速度とパララックス強度に影響）
      size: Math.random() * 1.6 + 0.8,
    }));

    const draw = () => {
      // パララックスのターゲットオフセットを計算
      const targetOffsetX = mouseRef.current.x * 30;
      const targetOffsetY = mouseRef.current.y * 30;

      // 滑らかに追従（イージング）
      offsetRef.current.x += (targetOffsetX - offsetRef.current.x) * 0.05;
      offsetRef.current.y += (targetOffsetY - offsetRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // 1. グリッドの描画（設計図のような下地）
      const gridSize = 64;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.strokeStyle = "rgba(47, 111, 228, 0.055)";
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
      ctx.fillStyle = "rgba(47, 111, 228, 0.22)";
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

      animationFrameId = requestAnimationFrame(draw);
    };

    const start = () => {
      if (!animationFrameId) draw();
    };

    const stop = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
    };

    // 背面タブで回し続けない
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") stop();
      else start();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    start();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibility);
      stop();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}
