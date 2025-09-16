'use client';

import { useEffect, useRef } from 'react';

interface SimpleHueModelProps {
  isTalking: boolean;
}

export default function SimpleHueModel({ isTalking }: SimpleHueModelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Simple 2D representation of Hue
    let time = 0;
    const animate = () => {
      time += 0.02;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
      
      const centerX = canvas.width / (2 * window.devicePixelRatio);
      const centerY = canvas.height / (2 * window.devicePixelRatio);
      
      // Main body with breathing animation - more 3D looking
      const breathScale = 1 + Math.sin(time * 2) * 0.08;
      const radius = 70 * breathScale;
      
      // Create more sophisticated 3D-looking gradient
      const gradient = ctx.createRadialGradient(centerX - 20, centerY - 20, 0, centerX, centerY, radius);
      gradient.addColorStop(0, isTalking ? '#A855F7' : '#6366F1'); // Lighter highlight
      gradient.addColorStop(0.3, isTalking ? '#8B5CF6' : '#4F46E5'); // Main color
      gradient.addColorStop(0.8, isTalking ? '#7C3AED' : '#3730A3'); // Mid shadow
      gradient.addColorStop(1, isTalking ? '#5B21B6' : '#1E1B4B'); // Deep shadow
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Add subtle rim lighting effect
      const rimGradient = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius);
      rimGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      rimGradient.addColorStop(0.9, 'rgba(255, 255, 255, 0)');
      rimGradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
      
      ctx.fillStyle = rimGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Eyes - more 3D and expressive
      const eyeOffset = 25;
      const eyeY = centerY - 15;
      const eyeRadius = 12;
      const blinkPhase = Math.sin(time * 0.3) > 0.95 ? 0.3 : 1; // Occasional blinking
      
      // Left eye with 3D gradient
      const leftEyeGrad = ctx.createRadialGradient(centerX - eyeOffset - 3, eyeY - 3, 0, centerX - eyeOffset, eyeY, eyeRadius);
      leftEyeGrad.addColorStop(0, '#FFFFFF');
      leftEyeGrad.addColorStop(0.7, '#F8FAFC');
      leftEyeGrad.addColorStop(1, '#E2E8F0');
      
      ctx.fillStyle = leftEyeGrad;
      ctx.beginPath();
      ctx.ellipse(centerX - eyeOffset, eyeY, eyeRadius, eyeRadius * blinkPhase, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Right eye with 3D gradient
      const rightEyeGrad = ctx.createRadialGradient(centerX + eyeOffset - 3, eyeY - 3, 0, centerX + eyeOffset, eyeY, eyeRadius);
      rightEyeGrad.addColorStop(0, '#FFFFFF');
      rightEyeGrad.addColorStop(0.7, '#F8FAFC');
      rightEyeGrad.addColorStop(1, '#E2E8F0');
      
      ctx.fillStyle = rightEyeGrad;
      ctx.beginPath();
      ctx.ellipse(centerX + eyeOffset, eyeY, eyeRadius, eyeRadius * blinkPhase, 0, 0, Math.PI * 2);
      ctx.fill();
      
      if (blinkPhase > 0.5) { // Only draw pupils when eyes are open
        // Eye pupils with slight movement and 3D effect
        const pupilOffset = Math.sin(time * 0.5) * 3;
        const pupilRadius = 6;
        
        // Left pupil
        const leftPupilGrad = ctx.createRadialGradient(centerX - eyeOffset + pupilOffset - 2, eyeY - 2, 0, centerX - eyeOffset + pupilOffset, eyeY, pupilRadius);
        leftPupilGrad.addColorStop(0, '#4B5563');
        leftPupilGrad.addColorStop(1, '#1F2937');
        
        ctx.fillStyle = leftPupilGrad;
        ctx.beginPath();
        ctx.arc(centerX - eyeOffset + pupilOffset, eyeY, pupilRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Right pupil
        const rightPupilGrad = ctx.createRadialGradient(centerX + eyeOffset + pupilOffset - 2, eyeY - 2, 0, centerX + eyeOffset + pupilOffset, eyeY, pupilRadius);
        rightPupilGrad.addColorStop(0, '#4B5563');
        rightPupilGrad.addColorStop(1, '#1F2937');
        
        ctx.fillStyle = rightPupilGrad;
        ctx.beginPath();
        ctx.arc(centerX + eyeOffset + pupilOffset, eyeY, pupilRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye highlights for life-like appearance
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(centerX - eyeOffset + pupilOffset - 2, eyeY - 2, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(centerX + eyeOffset + pupilOffset - 2, eyeY - 2, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Mouth/talking indicator
      if (isTalking) {
        const mouthY = centerY + 15;
        const mouthWidth = 20 + Math.sin(time * 8) * 5;
        
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(centerX, mouthY, mouthWidth, 8, 0, 0, Math.PI);
        ctx.stroke();
      }
      
      // Floating particles around Hue
      for (let i = 0; i < 5; i++) {
        const angle = (time + i * 1.2) * 0.5;
        const distance = 80 + Math.sin(time + i) * 10;
        const particleX = centerX + Math.cos(angle) * distance;
        const particleY = centerY + Math.sin(angle) * distance;
        
        ctx.fillStyle = `rgba(99, 102, 241, ${0.3 + Math.sin(time + i) * 0.2})`;
        ctx.beginPath();
        ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isTalking]);

  return (
    <div className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-2xl"
        style={{ background: 'transparent' }}
      />
      <div className="absolute bottom-4 left-4 text-xs text-gray-500">
        {isTalking ? 'Speaking...' : 'Listening'}
      </div>
    </div>
  );
}
