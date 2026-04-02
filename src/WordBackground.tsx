import React, { useEffect, useRef } from 'react';

const WORDS = [
  /* ── Indian Languages (priority) ── */
  { text: 'अनुकूलता',       lang: 'Hindi',          script: 'Devanagari' },
  { text: 'સુસંગતતા',       lang: 'Gujarati',        script: 'Gujarati'   },
  { text: 'பொருந்துதல்',    lang: 'Tamil',           script: 'Tamil'      },
  { text: 'అనుకూలత',        lang: 'Telugu',          script: 'Telugu'     },
  { text: 'ಹೊಂದಾಣಿಕೆ',     lang: 'Kannada',         script: 'Kannada'    },
  { text: 'അනුയോജ്യത',     lang: 'Malayalam',       script: 'Malayalam'  },
  { text: 'সামঞ্জস্যতা',   lang: 'Bengali',         script: 'Bengali'    },
  { text: 'सुसंगतता',       lang: 'Marathi',         script: 'Devanagari' },
  { text: 'ਅਨੁਕੂਲਤਾ',      lang: 'Punjabi',         script: 'Gurmukhi'   },
  { text: 'ସୁସଂଗତତା',      lang: 'Odia',            script: 'Odia'       },
  { text: 'সামঞ্জস্য',     lang: 'Assamese',        script: 'Bengali'    },
  { text: 'अनुकूलता',       lang: 'Sanskrit',        script: 'Devanagari' },
  { text: 'مطابقت',          lang: 'Urdu',            script: 'Nastaliq'   },
  { text: 'अनुकूलता',       lang: 'Nepali (India)',  script: 'Devanagari' },
  { text: 'मेळ',             lang: 'Konkani',         script: 'Devanagari' },
  { text: 'مطابقت',          lang: 'Sindhi',          script: 'Perso-Arabic'},
  { text: 'مطابقت',          lang: 'Kashmiri',        script: 'Nastaliq'   },
  { text: 'अनुकूलता',       lang: 'Dogri',           script: 'Devanagari' },
  { text: 'अनुकूलता',       lang: 'Maithili',        script: 'Devanagari' },
  { text: 'मिलान',           lang: 'Bhojpuri',        script: 'Devanagari' },
  { text: 'मेल-जोल',        lang: 'Awadhi',          script: 'Devanagari' },
  { text: 'मिलान',           lang: 'Magahi',          script: 'Devanagari' },
  { text: 'मेल',             lang: 'Rajasthani',      script: 'Devanagari' },
  { text: 'मिलान',           lang: 'Chhattisgarhi',   script: 'Devanagari' },
  { text: 'मेल',             lang: 'Garhwali',        script: 'Devanagari' },
  { text: 'मेल',             lang: 'Kumaoni',         script: 'Devanagari' },
  { text: 'ಹೊಂದಾಣಿಕೆ',     lang: 'Tulu',            script: 'Kannada'    },
  { text: 'ಹೊಂದಾಣಿಕೆ',     lang: 'Kodava',          script: 'Kannada'    },
  { text: 'Bha hap',         lang: 'Khasi',           script: 'Latin'      },
  { text: 'মিল',             lang: 'Manipuri',        script: 'Bengali'    },
  { text: 'Inhmeh',          lang: 'Mizo',            script: 'Latin'      },
  { text: 'मेल',             lang: 'Bodo',            script: 'Devanagari' },
  { text: 'ᱵᱟᱱᱫᱷᱚ',        lang: 'Santhali',        script: 'Ol Chiki'   },
  { text: 'अनुकूलन',        lang: 'Haryanvi',        script: 'Devanagari' },
  { text: 'সংযুক্তি',      lang: 'Sylheti',         script: 'Bengali'    },
  { text: 'ملاپ',            lang: 'Saraiki',         script: 'Nastaliq'   },
  { text: 'ਮੇਲ',            lang: 'Dogri (Gurmukhi)',script: 'Gurmukhi'   },
  { text: 'सुसंगतता',       lang: 'Bundelkhandi',    script: 'Devanagari' },
  { text: 'ᱚᱫᱚᱜ',           lang: 'Mundari',         script: 'Ol Chiki'   },

  /* ── International Languages ── */
  { text: 'Compatibility',   lang: 'English',         script: 'Latin'      },
  { text: 'Compatibilité',   lang: 'French',          script: 'Latin'      },
  { text: 'Compatibilidad',  lang: 'Spanish',         script: 'Latin'      },
  { text: 'Kompatibilität',  lang: 'German',          script: 'Latin'      },
  { text: 'Compatibilità',   lang: 'Italian',         script: 'Latin'      },
  { text: 'Compatibilidade', lang: 'Portuguese',      script: 'Latin'      },
  { text: '兼容性',           lang: 'Chinese (S)',     script: 'CJK'        },
  { text: '互換性',           lang: 'Japanese',        script: 'Kana'       },
  { text: '호환성',           lang: 'Korean',          script: 'Hangul'     },
  { text: 'Совместимость',   lang: 'Russian',         script: 'Cyrillic'   },
  { text: 'Uyumluluk',       lang: 'Turkish',         script: 'Latin'      },
  { text: 'التوافق',         lang: 'Arabic',          script: 'Arabic'     },
  { text: 'سازگاری',         lang: 'Persian',         script: 'Arabic'     },
  { text: 'Uygunluk',        lang: 'Uzbek',           script: 'Latin'      },
  { text: 'Compatibilitate', lang: 'Romanian',        script: 'Latin'      },
  { text: 'Compatibiliteit', lang: 'Dutch',           script: 'Latin'      },
  { text: 'Kompatibilitet',  lang: 'Swedish',         script: 'Latin'      },
  { text: 'Yhteensopivuus',  lang: 'Finnish',         script: 'Latin'      },
  { text: 'Συμβατότητα',     lang: 'Greek',           script: 'Greek'      },
  { text: 'Uygunluk',        lang: 'Azerbaijani',     script: 'Latin'      },
  { text: 'Kompatibilnist',  lang: 'Ukrainian',       script: 'Cyrillic'   },
  { text: 'Kompatibność',    lang: 'Polish',          script: 'Latin'      },
  { text: 'Združljivost',    lang: 'Slovenian',       script: 'Latin'      },
  { text: 'Uyumluluk',       lang: 'Kazakh',          script: 'Latin'      },
  { text: 'Tương thích',     lang: 'Vietnamese',      script: 'Latin'      },
  { text: 'ความเข้ากัน',    lang: 'Thai',            script: 'Thai'       },
  { text: 'Sesuai',          lang: 'Malay',           script: 'Latin'      },
  { text: 'Kecocokan',       lang: 'Indonesian',      script: 'Latin'      },
  { text: 'Pagkakatugma',    lang: 'Filipino',        script: 'Latin'      },
  { text: 'Utangamano',      lang: 'Swahili',         script: 'Latin'      },
  { text: 'Uygunluk',        lang: 'Turkmen',         script: 'Latin'      },
  { text: 'Mjubu',           lang: 'Amharic',         script: 'Latin'      },
];

const OPACITY_MIN  = 0.07;
const OPACITY_MAX  = 0.20;
const SPEED_MIN    = 0.18;
const SPEED_MAX    = 0.55;
const WORD_COUNT   = 55;
const SIZE_MIN     = 13;
const SIZE_MAX     = 38;
const PARALLAX_STRENGTH = 18;
const DRIFT_MAX    = 0.15;

export function WordBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number;
    let isActive = true;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const activeCount = isMobile ? Math.min(WORD_COUNT, 28) : WORD_COUNT;

    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const makePool = () => [...WORDS].sort(() => Math.random() - 0.5);
    let wordPool = makePool();
    let poolIdx  = 0;
    
    function nextWord() {
      if (poolIdx >= wordPool.length) { wordPool = makePool(); poolIdx = 0; }
      return wordPool[poolIdx++];
    }

    interface Particle {
      el: HTMLSpanElement;
      x: number;
      y: number;
      speed: number;
      drift: number;
      opacity: number;
      fontSize: number;
      depth: number;
      exitY: number;
      width: number;
      height: number;
    }

    const particles: Particle[] = [];

    function checkOverlap(x: number, y: number, w: number, h: number, excludeIdx: number = -1) {
      const margin = 20; // Extra breathing room
      for (let i = 0; i < particles.length; i++) {
        if (i === excludeIdx) continue;
        const p = particles[i];
        if (
          x < p.x + p.width + margin &&
          x + w + margin > p.x &&
          y < p.y + p.height + margin &&
          y + h + margin > p.y
        ) return true;
      }
      return false;
    }

    function createParticle(forceOffscreen = false): Particle {
      const w  = window.innerWidth;
      const h  = window.innerHeight;
      const vw = nextWord();

      const fontSize  = Math.round(rnd(SIZE_MIN, SIZE_MAX));
      const opacity   = rnd(OPACITY_MIN, OPACITY_MAX);
      const speed     = reduceMotion ? 0 : rnd(SPEED_MIN, SPEED_MAX);
      const drift     = reduceMotion ? 0 : rnd(-DRIFT_MAX, DRIFT_MAX);
      
      const width = vw.text.length * fontSize * 0.65;
      const height = fontSize;

      let x = 0, y = 0;
      let attempts = 0;
      do {
        x = Math.random() < 0.5 ? rnd(0, w * 0.35 - width) : rnd(w * 0.65, w - width);
        y = forceOffscreen ? h + fontSize + 20 : rnd(-h * 0.1, h * 1.1);
        attempts++;
      } while (attempts < 15 && checkOverlap(x, y, width, height));

      const el = document.createElement('span');
      el.className    = 'word';
      el.textContent  = vw.text;
      el.style.fontSize  = `${fontSize}px`;
      el.style.opacity   = '0';
      el.style.left      = `${x}px`;
      el.style.top       = `${y}px`;
      el.setAttribute('lang', vw.lang);
      container!.appendChild(el);

      if (!forceOffscreen) {
        setTimeout(() => { if (el) el.style.opacity = String(opacity); }, rnd(0, 1200));
      }

      return {
        el, x, y, speed, drift, opacity, fontSize, depth: rnd(0.3, 1.0), exitY: -fontSize - 60,
        width, height
      };
    }

    for (let i = 0; i < activeCount; i++) {
      particles.push(createParticle(false));
    }

    let mouseX = 0, mouseY = 0;
    let targetMX = 0, targetMY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      targetMX = (e.clientX / window.innerWidth  - 0.5) * 2;
      targetMY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    if (PARALLAX_STRENGTH > 0 && !reduceMotion) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    let lastTime = 0;
    function animate(ts: number) {
      if (!isActive) return;
      
      const dt = lastTime ? Math.min((ts - lastTime) / 16.67, 3) : 1; 
      lastTime = ts;

      if (PARALLAX_STRENGTH > 0 && !reduceMotion) {
        mouseX += (targetMX - mouseX) * 0.04;
        mouseY += (targetMY - mouseY) * 0.04;
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!reduceMotion) {
          p.y -= p.speed * dt;
          p.x += p.drift * dt;
        }

        const px = p.x + mouseX * PARALLAX_STRENGTH * p.depth;
        const py = p.y + mouseY * PARALLAX_STRENGTH * 0.4 * p.depth;

        p.el.style.transform = `translate(${px - p.x}px, ${py - p.y}px)`;
        p.el.style.left = `${p.x}px`;
        p.el.style.top  = `${p.y}px`;

        if (p.y < p.exitY) {
          p.el.style.opacity = '0';
          ((idx: number) => {
            setTimeout(() => {
              const pp = particles[idx];
              if (!pp || !isActive) return;
              const vw = nextWord();
              pp.el.textContent  = vw.text;
              pp.el.setAttribute('lang', vw.lang);
              pp.y = window.innerHeight + pp.fontSize + 10;
              let attempts = 0;
              do {
                pp.x = Math.random() < 0.5 ? rnd(0, window.innerWidth * 0.35 - pp.width) : rnd(window.innerWidth * 0.65, window.innerWidth - pp.width);
                attempts++;
              } while (attempts < 15 && checkOverlap(pp.x, pp.y, pp.width, pp.height, idx));
              
              pp.speed = reduceMotion ? 0 : rnd(SPEED_MIN, SPEED_MAX);
              pp.drift = reduceMotion ? 0 : rnd(-DRIFT_MAX, DRIFT_MAX);
              pp.el.style.left = `${pp.x}px`;
              pp.el.style.top  = `${pp.y}px`;
              pp.el.style.opacity = String(rnd(OPACITY_MIN, OPACITY_MAX));
            }, 2600);
          })(i);
        }

        const margin = 60;
        if (p.x > window.innerWidth + margin)  p.x = -margin;
        if (p.x < -margin) p.x = window.innerWidth + margin;
      }

      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);

    const handleResize = () => {
      const w = window.innerWidth;
      particles.forEach(p => {
        if (p.x > w + 100) p.x = rnd(0, w);
      });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isActive = false;
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      container!.innerHTML = '';
    };
  }, []);

  return (
    <>
      <div id="compat-bg" aria-hidden="true" ref={containerRef}></div>
    </>
  );
}
