'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { ArrowLeft, Download, Palette, Upload } from 'lucide-react';

export default function TshirtGenerator() {
  const [shirtText, setShirtText] = useState({
    title: 'plaza',
    subtitle: 'design',
    sideTitle: '2024'
  });
  const [backgroundType, setBackgroundType] = useState('solid');
  const [background, setBackground] = useState('#000000');
  const [isPopupActive, setIsPopupActive] = useState(false);
  const shirtRef = useRef<HTMLDivElement>(null);

  const handleBackgroundTypeChange = (type: string) => {
    setBackgroundType(type);
  };

  const handleColorChange = (color: string) => {
    setBackground(color);
  };

  const generateRandomGradient = () => {
    const randomColor1 = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const randomColor2 = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const angle = Math.floor(Math.random() * 360);
    setBackground(`linear-gradient(${angle}deg, ${randomColor1}, ${randomColor2})`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBackground(`url('${event.target.result}') no-repeat center/cover`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadTShirt = async () => {
    if (shirtRef.current) {
      const canvas = await html2canvas(shirtRef.current, {
        backgroundColor: null,
      });
      const link = document.createElement('a');
      link.download = 'plaza-tshirt-design.png';
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
        <h1 className="heading-lg lg:heading-xl text-black">t-shirt generator</h1>
        <div className="hidden lg:block w-32" /> {/* Spacer */}
      </div>

      {/* T-Shirt Display */}
      <div 
        ref={shirtRef}
        onClick={() => setIsPopupActive(true)}
        className="w-56 sm:w-64 lg:w-80 h-56 sm:h-64 lg:h-80 relative cursor-pointer flex items-center justify-center animate-gentle-wave glass-panel rounded-3xl"
        style={{
          background,
          WebkitMaskImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik01MCAzMEg3MEM3NSAzMCA4MCAyNSA4MCAyMEM4MCAyMCA4NSAxNSA5MCAyMEM5NSAyNSAxMDAgMzAgMTUwIDMwSDE1MEMxNTUgMzAgMTYwIDM1IDE2MCA0MFYxNjBDMTYwIDE2NSAxNTUgMTcwIDE1MCAxNzBINTBDNDUgMTcwIDQwIDE2NSA0MCAxNjBWNDBDNDAgMzUgNDUgMzAgNTAgMzBaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K')",
          WebkitMaskSize: '80%',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik01MCAzMEg3MEM3NSAzMCA4MCAyNSA4MCAyMEM4MCAyMCA4NSAxNSA5MCAyMEM5NSAyNSAxMDAgMzAgMTUwIDMwSDE1MEMxNTUgMzAgMTYwIDM1IDE2MCA0MFYxNjBDMTYwIDE2NSAxNTUgMTcwIDE1MCAxNzBINTBDNDUgMTcwIDQwIDE2NSA0MCAxNjBWNDBDNDAgMzUgNDUgMzAgNTAgMzBaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K')",
          maskSize: '80%',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
        }}
      >
        {/* Title - Above center */}
        <div className="absolute top-[20%] left-0 right-0 text-center">
          <div className="text-2xl font-normal text-white drop-shadow-lg">{shirtText.title}</div>
        </div>

        {/* Subtitle - Below center */}
        <div className="absolute bottom-[20%] left-0 right-0 text-center">
          <div className="text-lg font-medium text-white drop-shadow-lg">{shirtText.subtitle}</div>
        </div>

        {/* Side Title */}
        <div className="absolute top-1/2 right-[20%] -translate-y-1/2">
          <div className="text-base font-medium text-white drop-shadow-lg transform rotate-90">{shirtText.sideTitle}</div>
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
                  value={background}
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
          onClick={downloadTShirt}
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
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] sm:w-[90%] max-w-md glass-panel-strong rounded-3xl p-4 sm:p-6 lg:p-8 z-50">
            <h2 className="heading-md text-black mb-6">edit text</h2>
            <div className="space-y-4">
              <div>
                <label className="mono-text text-sm text-black/60 mb-2 block">TITLE</label>
                <input
                  type="text"
                  placeholder="Enter title"
                  value={shirtText.title}
                  onChange={(e) => setShirtText(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-white/60 border-brutal border-black rounded-2xl p-3 outline-none focus:bg-white/80 transition-colors body-text"
                />
              </div>
              <div>
                <label className="mono-text text-sm text-black/60 mb-2 block">SUBTITLE</label>
                <input
                  type="text"
                  placeholder="Enter subtitle"
                  value={shirtText.subtitle}
                  onChange={(e) => setShirtText(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full bg-white/60 border-brutal border-black rounded-2xl p-3 outline-none focus:bg-white/80 transition-colors body-text"
                />
              </div>
              <div>
                <label className="mono-text text-sm text-black/60 mb-2 block">SIDE TEXT</label>
                <input
                  type="text"
                  placeholder="Enter side text"
                  value={shirtText.sideTitle}
                  onChange={(e) => setShirtText(prev => ({ ...prev, sideTitle: e.target.value }))}
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
        </>
      )}

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes gentle-wave {
          0% { transform: scale(1) rotate(0deg) translateY(0px); }
          25% { transform: scale(1.01) rotate(0.5deg) translateY(-2px); }
          50% { transform: scale(1) rotate(-0.5deg) translateY(0px); }
          75% { transform: scale(0.99) rotate(0.25deg) translateY(2px); }
          100% { transform: scale(1) rotate(0deg) translateY(0px); }
        }

        .animate-gentle-wave {
          animation: gentle-wave 6s ease-in-out infinite;
          transform-origin: center center;
        }
      `}</style>
    </div>
  );
} 