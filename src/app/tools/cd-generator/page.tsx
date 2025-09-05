'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { ArrowLeft, Download, Disc, Upload } from 'lucide-react';

export default function CDGenerator() {
  const [cdText, setCdText] = useState({
    title: 'plaza',
    artist: 'mixtape',
    year: '2024'
  });
  const [backgroundType, setBackgroundType] = useState('holographic');
  const [background, setBackground] = useState('radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 100%)');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isPopupActive, setIsPopupActive] = useState(false);
  const cdRef = useRef<HTMLDivElement>(null);

  const handleBackgroundTypeChange = (type: string) => {
    setBackgroundType(type);
    if (type === 'holographic') {
      setBackground('radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 100%)');
      setUploadedImage(null);
    }
  };

  const handleColorChange = (color: string) => {
    setBackground(color);
    setUploadedImage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const generateRandomGradient = () => {
    const randomColor1 = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const randomColor2 = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const angle = Math.floor(Math.random() * 360);
    setBackground(`linear-gradient(${angle}deg, ${randomColor1}, ${randomColor2})`);
    setUploadedImage(null);
  };

  const downloadCD = async () => {
    if (cdRef.current) {
      const canvas = await html2canvas(cdRef.current, {
        backgroundColor: null,
      });
      const link = document.createElement('a');
      link.download = 'plaza-cd-design.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between p-4 sm:p-6">
      {/* Header */}
      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center justify-between mb-6 sm:mb-8 space-y-4 lg:space-y-0">
        <a href="/tools" className="flex items-center space-x-3 hover:text-black/60 transition-colors self-start lg:self-center">
          <ArrowLeft className="w-5 h-5" />
          <span className="mono-text text-sm uppercase tracking-wide">back to tools</span>
        </a>
        <h1 className="heading-lg lg:heading-xl text-black">cd generator</h1>
        <div className="hidden lg:block w-32" /> {/* Spacer */}
      </div>

      {/* CD Display */}
      <div 
        ref={cdRef}
        onClick={() => setIsPopupActive(true)}
        className="w-56 h-56 sm:w-64 sm:h-64 lg:w-80 lg:h-80 relative cursor-pointer aspect-square mb-6 sm:mb-8"
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Main CD Circle with Holographic Effect */}
        <div 
          className="w-full h-full rounded-full absolute animate-spin-slow"
          style={{
            background: uploadedImage 
              ? `url('${uploadedImage}') center/cover no-repeat`
              : backgroundType === 'holographic'
                ? `linear-gradient(135deg, 
                    rgba(255,255,255,0.4) 0%, 
                    rgba(255,255,255,0.2) 25%, 
                    rgba(255,255,255,0.6) 50%, 
                    rgba(255,255,255,0.2) 75%, 
                    rgba(255,255,255,0.4) 100%)`
                : background,
            boxShadow: '0 0 30px rgba(0,0,0,0.2), inset 0 0 50px rgba(255,255,255,0.3)',
            transform: 'rotateX(20deg)',
            filter: backgroundType === 'holographic' 
              ? 'hue-rotate(calc(var(--hue, 0) * 1deg))'
              : 'none',
          }}
        >
          {/* Holographic Overlay when image is present */}
          {uploadedImage && (
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(255,255,255,0.4) 0%, 
                  rgba(255,255,255,0.1) 25%, 
                  rgba(255,255,255,0.3) 50%, 
                  rgba(255,255,255,0.1) 75%, 
                  rgba(255,255,255,0.4) 100%)`,
                mixBlendMode: 'overlay',
                opacity: 0.7,
              }}
            />
          )}

          {/* Center Ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-b from-gray-200 to-gray-400">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white"></div>
          </div>

          {/* Rainbow Reflection Effect */}
          <div 
            className="absolute inset-0 rounded-full opacity-20"
            style={{
              background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.9) 35%, rgba(255,255,255,0.5) 50%, transparent 65%)',
              animation: 'moveLight 8s linear infinite',
              mixBlendMode: 'soft-light',
            }}
          />

          {/* Text Layer */}
          <div className="absolute inset-0" style={{ zIndex: 10 }}>
            <div className="absolute top-[20%] left-0 right-0 text-center">
              <div className="text-xl font-normal text-white drop-shadow-lg">{cdText.title}</div>
            </div>
            <div className="absolute bottom-[20%] left-0 right-0 text-center">
              <div className="text-lg font-medium text-white drop-shadow-lg">{cdText.artist}</div>
            </div>
            <div className="absolute top-1/2 right-[20%] -translate-y-1/2">
              <div className="text-base font-medium text-white drop-shadow-lg transform rotate-90">{cdText.year}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="w-full max-w-md space-y-6">
        <div className="glass-panel rounded-3xl p-6">
          <h3 className="heading-md text-black mb-6">customize design</h3>
          
          <div className="space-y-4">
            <div>
              <label className="mono-text text-sm text-black/60 mb-2 block">BACKGROUND TYPE</label>
              <select
                className="w-full bg-white/60 border-brutal border-black rounded-2xl p-3 mono-text text-sm outline-none"
                onChange={(e) => handleBackgroundTypeChange(e.target.value)}
                value={backgroundType}
              >
                <option value="holographic">HOLOGRAPHIC</option>
                <option value="solid">SOLID COLOR</option>
                <option value="gradient">GRADIENT</option>
                <option value="image">IMAGE</option>
              </select>
            </div>

            {backgroundType === 'solid' && (
              <div>
                <label className="mono-text text-sm text-black/60 mb-2 block">COLOR</label>
                <input
                  type="color"
                  className="w-full h-12 rounded-2xl border-brutal border-black"
                  onChange={(e) => handleColorChange(e.target.value)}
                />
              </div>
            )}

            {backgroundType === 'gradient' && (
              <button
                onClick={generateRandomGradient}
                className="btn-brutal-outline w-full"
              >
                GENERATE RANDOM GRADIENT
              </button>
            )}

            {backgroundType === 'image' && (
              <div>
                <label className="mono-text text-sm text-black/60 mb-2 block">UPLOAD IMAGE</label>
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="border-brutal border-black border-dashed rounded-2xl p-6 text-center cursor-pointer hover:bg-black/5 transition-colors">
                    <Upload className="w-8 h-8 text-black mx-auto mb-2" />
                    <span className="mono-text text-sm text-black/60">CLICK TO UPLOAD</span>
                  </div>
                </label>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={downloadCD}
          className="btn-brutal w-full flex items-center justify-center space-x-3"
        >
          <Download className="w-5 h-5" />
          <span>DOWNLOAD DESIGN</span>
        </button>
      </div>

      {/* Text Edit Popup */}
      {isPopupActive && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsPopupActive(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md glass-panel-strong rounded-3xl p-4 sm:p-6 lg:p-8">
            <h2 className="heading-md text-black mb-6">edit cd text</h2>
            <div className="space-y-4">
              <div>
                <label className="mono-text text-sm text-black/60 mb-2 block">ALBUM TITLE</label>
                <input
                  type="text"
                  placeholder="Album title"
                  value={cdText.title}
                  onChange={(e) => setCdText(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-white/60 border-brutal border-black rounded-2xl p-3 outline-none focus:bg-white/80 transition-colors body-text"
                />
              </div>
              <div>
                <label className="mono-text text-sm text-black/60 mb-2 block">ARTIST NAME</label>
                <input
                  type="text"
                  placeholder="Artist name"
                  value={cdText.artist}
                  onChange={(e) => setCdText(prev => ({ ...prev, artist: e.target.value }))}
                  className="w-full bg-white/60 border-brutal border-black rounded-2xl p-3 outline-none focus:bg-white/80 transition-colors body-text"
                />
              </div>
              <div>
                <label className="mono-text text-sm text-black/60 mb-2 block">YEAR</label>
                <input
                  type="text"
                  placeholder="Year"
                  value={cdText.year}
                  onChange={(e) => setCdText(prev => ({ ...prev, year: e.target.value }))}
                  className="w-full bg-white/60 border-brutal border-black rounded-2xl p-3 outline-none focus:bg-white/80 transition-colors body-text"
                />
              </div>
            </div>
            <button
              onClick={() => setIsPopupActive(false)}
              className="btn-brutal w-full mt-6"
            >
              SAVE CHANGES
            </button>
            </div>
          </div>
        </>
      )}

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes moveLight {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes spin-slow {
          from { transform: rotateX(20deg) rotateZ(0deg); }
          to { transform: rotateX(20deg) rotateZ(360deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
} 