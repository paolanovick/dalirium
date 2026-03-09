import './ArtLoader.css';

const ArtLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      <svg className="svg-hw" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">

        {/* Marco exterior - bordes */}
        <rect id="path7050" x="10" y="10" width="230" height="230" rx="4" fill="#110a29" stroke="none"/>
        <rect id="path7062" x="10" y="10" width="230" height="18" fill="#291f6c"/>
        <rect id="path7064" x="10" y="222" width="230" height="18" fill="#520d4f"/>
        <rect id="path7065" x="10" y="10" width="18" height="230" fill="#691751"/>
        <rect id="path7066" x="222" y="10" width="18" height="230" fill="#8f335d"/>

        {/* Interior del lienzo */}
        <rect id="path7067" x="28" y="28" width="194" height="194" fill="#b90149"/>

        {/* Cielo / fondo */}
        <rect id="path7068" x="28" y="28" width="194" height="100" fill="#a70c29"/>
        <rect id="path7069" x="28" y="128" width="194" height="94" fill="#8d004c"/>

        {/* Sol */}
        <circle id="path7070" cx="195" cy="60" r="22" fill="#ad0f09"/>
        <circle id="path7071" cx="195" cy="60" r="15" fill="#6e064e"/>

        {/* Mesa / superficie */}
        <rect id="path7072" x="28" y="155" width="194" height="15" fill="#5c1561"/>
        <rect id="path7076" x="28" y="165" width="194" height="57" fill="#881754"/>

        {/* Reloj derretido - cuerpo */}
        <ellipse id="path7080" cx="90" cy="148" rx="38" ry="22" fill="#a71d67"/>
        <rect id="path7081" x="55" y="148" width="70" height="6" rx="2" fill="#891754"/>

        {/* Reloj colgando - gota */}
        <path id="path7086" d="M85 154 Q82 168 80 178 Q85 182 90 178 Q95 168 95 154 Z" fill="#a70b29"/>

        {/* Reloj 2 - sobre mesa */}
        <ellipse id="path7088" cx="160" cy="150" rx="30" ry="18" fill="#ed6708"/>
        <rect id="path7090" x="132" y="150" width="56" height="5" rx="2" fill="#f59c00"/>

        {/* Reloj 2 - gota derecha */}
        <path id="path7091" d="M155 155 Q152 166 150 174 Q158 177 165 173 Q163 163 158 155 Z" fill="#e84133"/>

        {/* Reloj 3 - pequeño colgado */}
        <ellipse id="path7092" cx="125" cy="100" rx="20" ry="12" fill="#eb5e57"/>
        <rect id="path7094" x="108" y="95" width="34" height="3" rx="1" fill="#e84133"/>

        {/* Soporte / rama */}
        <rect id="path7096" x="115" y="80" width="5" height="30" rx="2" fill="#f9b233"/>
        <path id="path7098" d="M110 80 Q125 70 140 80" stroke="#f18700" strokeWidth="3" fill="none"/>

        {/* Manecillas reloj 1 */}
        <line id="path7100" x1="90" y1="136" x2="90" y2="146" stroke="#ffd500" strokeWidth="2"/>
        <line id="path7101" x1="90" y1="136" x2="96" y2="141" stroke="#fab334" strokeWidth="2"/>

        {/* Manecillas reloj 2 */}
        <line id="path7102" x1="160" y1="140" x2="160" y2="148" stroke="#dedc00" strokeWidth="2"/>
        <line id="path7104" x1="160" y1="140" x2="166" y2="144" stroke="#f9b233" strokeWidth="2"/>

        {/* Sombra / figura fondo */}
        <ellipse id="path7105" cx="125" cy="210" rx="60" ry="12" fill="#ffd800" opacity="0.3"/>

        {/* Detalle mesa - sombra */}
        <rect id="path7106" x="28" y="170" width="194" height="3" fill="#00975f" opacity="0.4"/>

        {/* Horizonte */}
        <line id="path7107" x1="28" y1="155" x2="222" y2="155" stroke="#65b32e" strokeWidth="1"/>

        {/* Detalle fondo - montaña izq */}
        <path id="path7108" d="M28 155 L60 100 L90 145 Z" fill="#d3d800" opacity="0.5"/>

        {/* Detalle fondo - montaña der */}
        <path id="path7109" d="M180 155 L210 105 L222 145 Z" fill="#ffed00" opacity="0.5"/>

        {/* Sombra reloj 1 */}
        <ellipse id="path7110" cx="90" cy="176" rx="15" ry="4" fill="#00975f" opacity="0.4"/>

        {/* Sombra reloj 2 */}
        <ellipse id="path7111" cx="155" cy="174" rx="12" ry="3" fill="#bccf00" opacity="0.4"/>

        {/* Marco interior decorativo */}
        <rect id="path7112" x="18" y="18" width="214" height="214" rx="2" fill="none" stroke="#65b32f" strokeWidth="1.5" opacity="0.6"/>

        {/* Esquinas marco */}
        <rect id="path7114" x="10" y="10" width="10" height="10" fill="#87bd25"/>
        <rect id="path7116" x="230" y="10" width="10" height="10" fill="#00758c"/>
        <rect id="path7124" x="10" y="230" width="10" height="10" fill="#3363ac"/>
        <rect id="path7126" x="230" y="230" width="10" height="10" fill="#009bac"/>
      </svg>

      <div className="loading loading02">
        <span>C</span>
        <span>a</span>
        <span>r</span>
        <span>g</span>
        <span>a</span>
        <span>n</span>
        <span>d</span>
        <span>o</span>
      </div>
    </div>
  );
};

export default ArtLoader;
