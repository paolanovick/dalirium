import { useRef, useState } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import "./DaliDisruptionSection.css";

const pieces = [
  {
    className: "piece-one",
    video: "/videocanva1.mp4",
    poster: "/IMG_2507.JPG",
  },
  {
    className: "piece-two",
    video: "/videocanva2.mp4",
    poster: "/IMG_2475.JPG",
  },
  {
    className: "piece-three",
    video: "/videocanva3.mp4",
    poster: "/IMG_2610.JPG",
  },
];

const RecomposeVideoPiece = ({ piece, style }) => {
  const [isResolving, setIsResolving] = useState(false);

  const handleTimeUpdate = (event) => {
    const video = event.currentTarget;
    const duration = video.duration;

    if (!Number.isFinite(duration) || duration <= 0) {
      return;
    }

    const resolveWindow = Math.min(1.6, duration * 0.32);
    setIsResolving(duration - video.currentTime <= resolveWindow);
  };

  return (
    <motion.figure
      className={`dali-disruption-piece ${piece.className} ${isResolving ? "is-resolving" : ""}`}
      style={style}
    >
      <img className="piece-source" src={piece.poster} alt="" />
      <div className="piece-video-frame">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={piece.poster}
          onTimeUpdate={handleTimeUpdate}
          onSeeked={handleTimeUpdate}
        >
          <source src={piece.video} type="video/mp4" />
        </video>
        <div className="piece-resolution" aria-hidden="true">
          <img className="piece-resolution-image" src={piece.poster} alt="" />
          <span className="piece-resolution-pixels" />
        </div>
      </div>
    </motion.figure>
  );
};

const DaliDisruptionSection = () => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 24,
    mass: 0.32,
    restDelta: 0.001,
  });

  const backdropY = useTransform(smoothProgress, [0, 1], ["-5%", "7%"]);
  const backdropScale = useTransform(smoothProgress, [0, 1], [1.08, 1.16]);
  const textY = useTransform(smoothProgress, [0, 0.55, 1], [38, 0, -24]);
  const pieceOneY = useTransform(smoothProgress, [0, 1], ["8%", "-10%"]);
  const pieceOneRotate = useTransform(smoothProgress, [0, 1], [-4, 3]);
  const pieceTwoY = useTransform(smoothProgress, [0, 1], ["-10%", "12%"]);
  const pieceTwoRotate = useTransform(smoothProgress, [0, 1], [5, -5]);
  const pieceThreeY = useTransform(smoothProgress, [0, 1], ["12%", "-6%"]);
  const pieceThreeRotate = useTransform(smoothProgress, [0, 1], [2, -4]);

  const pieceStyles = [
    { y: pieceOneY, rotate: pieceOneRotate },
    { y: pieceTwoY, rotate: pieceTwoRotate },
    { y: pieceThreeY, rotate: pieceThreeRotate },
  ];

  return (
    <section
      ref={sectionRef}
      className="dali-disruption-section"
      aria-labelledby="dali-disruption-title"
    >
      <motion.div
        className="dali-disruption-backdrop"
        style={{ y: backdropY, scale: backdropScale }}
        aria-hidden="true"
      >
        <video autoPlay muted loop playsInline preload="metadata" poster="/IMG_2475.JPG">
          <source src="/videocanva2.mp4" type="video/mp4" />
        </video>
        <img className="backdrop-still still-one" src="/IMG_2507.JPG" alt="" />
        <img className="backdrop-still still-two" src="/IMG_2475.JPG" alt="" />
        <img className="backdrop-still still-three" src="/IMG_2610.JPG" alt="" />
      </motion.div>

      <div className="dali-disruption-stage">
        <motion.div className="dali-disruption-copy" style={{ y: textY }}>
          <p className="dali-disruption-kicker">Colecciones</p>
          <h2 id="dali-disruption-title" className="dali-disruption-title">
            La obra se transforma. La colección aparece.
          </h2>
          <p className="dali-disruption-text">
            Entrá a ver las colecciones: cada pieza vuelve completa y abre
            otra puerta al delirio de Dalí.
          </p>
          <Link to="/colecciones" className="dali-disruption-link">
            Ver colecciones
          </Link>
        </motion.div>

        <div className="dali-disruption-gallery" aria-hidden="true">
          {pieces.map((piece, index) => (
            <RecomposeVideoPiece
              key={piece.video}
              piece={piece}
              style={pieceStyles[index]}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DaliDisruptionSection;
