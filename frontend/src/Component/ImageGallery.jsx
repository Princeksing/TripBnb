import React, { useState } from 'react'
import { RxCross2 } from 'react-icons/rx'

function ImageGallery({ images = [], title = 'Property' }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (!images.length) return null

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden h-[280px] md:h-[450px]">
        <button
          type="button"
          className="md:col-span-2 md:row-span-2 relative group"
          onClick={() => { setActiveIndex(0); setLightboxOpen(true) }}
        >
          <img src={images[0]} alt={title} className="w-full h-full object-cover" />
          <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </button>
        {images.slice(1, 5).map((img, i) => (
          <button
            key={i}
            type="button"
            className="hidden md:block relative group overflow-hidden"
            onClick={() => { setActiveIndex(i + 1); setLightboxOpen(true) }}
          >
            <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            {i === 3 && images.length > 5 && (
              <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold">
                +{images.length - 5} photos
              </span>
            )}
          </button>
        ))}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide md:hidden">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden ${activeIndex === i ? 'ring-2 ring-brand-pink' : ''}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-fade-in">
          <button
            type="button"
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full z-10"
            onClick={() => setLightboxOpen(false)}
          >
            <RxCross2 className="w-8 h-8" />
          </button>
          <button
            type="button"
            className="absolute left-4 text-white text-3xl hover:bg-white/10 w-12 h-12 rounded-full"
            onClick={() => setActiveIndex((i) => (i > 0 ? i - 1 : images.length - 1))}
          >
            ‹
          </button>
          <img
            src={images[activeIndex]}
            alt={title}
            className="max-w-[90vw] max-h-[85vh] object-contain cursor-zoom-in"
            onClick={() => setActiveIndex((i) => (i + 1) % images.length)}
          />
          <button
            type="button"
            className="absolute right-4 text-white text-3xl hover:bg-white/10 w-12 h-12 rounded-full"
            onClick={() => setActiveIndex((i) => (i + 1) % images.length)}
          >
            ›
          </button>
          <span className="absolute bottom-6 text-white text-sm">
            {activeIndex + 1} / {images.length}
          </span>
        </div>
      )}
    </>
  )
}

export default ImageGallery
