import { useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform } from 'framer-motion';
import './ScrollGallery.css';

const ScrollGallery = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Transform para la imagen central
  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    [2.5, 1]
  );

  // Transforms para Layer 1
  const layer1Opacity = useTransform(
    scrollYProgress,
    [0, 0.4, 0.7],
    [0, 0, 1]
  );
  const layer1Scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.7],
    [0, 0, 1]
  );

  // Transforms para Layer 2
  const layer2Opacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.75],
    [0, 0, 1]
  );
  const layer2Scale = useTransform(
    scrollYProgress,
    [0, 0.15, 0.75],
    [0, 0, 1]
  );

  // Transforms para Layer 3
  const layer3Opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.8],
    [0, 0, 1]
  );
  const layer3Scale = useTransform(
    scrollYProgress,
    [0, 0.1, 0.8],
    [0, 0, 1]
  );

  // Layer 1: Outer edges (6 images)
  const layer1Images = [
    '/scroll/IMG_2447.JPG',
    '/scroll/IMG_2457.JPG',
    '/scroll/IMG_2467.JPG',
    '/scroll/IMG_2479.JPG',
    '/scroll/IMG_2483.JPG',
    '/scroll/IMG_2512.JPG'
  ];

  // Layer 2: Inner columns (6 images)
  const layer2Images = [
    '/scroll/IMG_2549.JPG',
    '/scroll/IMG_2631.JPG',
    '/scroll/IMG_2653.JPG',
    '/scroll/IMG_2710.JPG',
    '/scroll/IMG_2728.JPG',
    '/scroll/IMG_2739.JPG'
  ];

  // Layer 3: Center column top and bottom (2 images)
  const layer3Images = [
    '/scroll/IMG_2743.JPG',
    '/scroll/IMG_2749.JPG'
  ];

  return (
    <section ref={sectionRef} className="scroll-gallery-section">
      <div className="scroll-content">
        <div className="grid">
          {/* Layer 1: Outer edges */}
          <motion.div 
            className="layer"
            style={{
              opacity: layer1Opacity,
              scale: layer1Scale
            }}
          >
            {layer1Images.map((src, idx) => (
              <div key={idx}>
                <img src={src} alt="" />
              </div>
            ))}
          </motion.div>

          {/* Layer 2: Inner columns */}
          <motion.div 
            className="layer"
            style={{
              opacity: layer2Opacity,
              scale: layer2Scale
            }}
          >
            {layer2Images.map((src, idx) => (
              <div key={idx}>
                <img src={src} alt="" />
              </div>
            ))}
          </motion.div>

          {/* Layer 3: Center column */}
          <motion.div 
            className="layer"
            style={{
              opacity: layer3Opacity,
              scale: layer3Scale
            }}
          >
            {layer3Images.map((src, idx) => (
              <div key={idx}>
                <img src={src} alt="" />
              </div>
            ))}
          </motion.div>

          {/* Center scaler image */}
          <div className="scaler">
            <motion.img 
              ref={imageRef}
              src="/IMG_2763.JPG" 
              alt="Center focal image"
              style={{
                scale: imageScale
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollGallery;