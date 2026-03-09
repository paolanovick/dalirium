const ArtLoader = ({ text = 'Cargando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      {/* Atril con lienzo */}
      <svg
        width="120"
        height="130"
        viewBox="0 0 120 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-80"
      >
        {/* Patas del atril */}
        <line x1="60" y1="20" x2="20" y2="120" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
        <line x1="60" y1="20" x2="100" y2="120" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
        <line x1="60" y1="65" x2="40" y2="120" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>

        {/* Soporte horizontal */}
        <line x1="32" y1="75" x2="88" y2="75" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>

        {/* Lienzo */}
        <rect x="34" y="18" width="52" height="52" rx="2" fill="#1f2937" stroke="white" strokeWidth="2" opacity="0.9"/>

        {/* Pintura animada en el lienzo — líneas que aparecen */}
        <line x1="44" y1="38" x2="76" y2="38" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" opacity="0.8">
          <animate attributeName="stroke-dasharray" from="0 40" to="32 40" dur="1.2s" repeatCount="indefinite"/>
        </line>
        <line x1="44" y1="48" x2="68" y2="48" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" opacity="0.6">
          <animate attributeName="stroke-dasharray" from="0 30" to="24 30" dur="1.2s" begin="0.3s" repeatCount="indefinite"/>
        </line>
        <line x1="44" y1="58" x2="72" y2="58" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" opacity="0.4">
          <animate attributeName="stroke-dasharray" from="0 35" to="28 35" dur="1.2s" begin="0.6s" repeatCount="indefinite"/>
        </line>

        {/* Pincel */}
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 6,-3; 12,0; 6,3; 0,0"
            dur="2s"
            repeatCount="indefinite"
          />
          <line x1="82" y1="28" x2="96" y2="14" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
          <ellipse cx="96" cy="14" rx="4" ry="2.5" transform="rotate(-45 96 14)" fill="#f59e0b" opacity="0.9"/>
        </g>
      </svg>

      {/* Puntos de carga */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-amber-500/60 inline-block animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      {text && <p className="text-white/40 text-sm tracking-widest uppercase">{text}</p>}
    </div>
  );
};

export default ArtLoader;
