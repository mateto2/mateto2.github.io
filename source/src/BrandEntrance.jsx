import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function BrandEntrance({ targetRef, painted, instant, onDock, onAsset }) {
  const [geometry, setGeometry] = useState(null);
  const [docked, setDocked] = useState(instant);
  const [blinkDone, setBlinkDone] = useState(instant);
  const [letters, setLetters] = useState(instant ? 7 : 0);
  const completed = useRef(instant);
  useLayoutEffect(() => {
    const measure = () => {
      const target = targetRef.current;
      const box = target.querySelector('.brand-avatar').getBoundingClientRect();
      const word = target.getBoundingClientRect();
      const font = parseFloat(getComputedStyle(target).fontSize);
      const height = Math.min(330, window.innerHeight * .46, window.innerWidth * .63);
      setGeometry({ x: box.left, y: box.top + window.scrollY, width: box.width, height: box.height,
        textX: box.right + font * .14, textY: word.top + window.scrollY, font,
        centerX: (window.innerWidth - height * 1.16 / 1.3) / 2,
        centerY: (window.innerHeight - height) / 2, largeHeight: height });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [targetRef]);
  useEffect(() => {
    if (instant) { completed.current = true; setDocked(true); setLetters(7); return; }
    if (!docked) return;
    let count = 0;
    const timer = setInterval(() => { count++; setLetters(count); if (count === 7) clearInterval(timer); }, 115);
    return () => clearInterval(timer);
  }, [docked, instant]);
  const arrive = () => {
    if (!blinkDone || completed.current) return;
    completed.current = true;
    setDocked(true);
    onDock();
  };
  const small = blinkDone || instant;
  return <div className="brand-entrance" aria-label="Matheus">
    {geometry && <motion.div className="entrance-portrait" initial={false}
      animate={geometry ? { opacity: 1, x: small ? geometry.x : geometry.centerX,
        y: small ? geometry.y : geometry.centerY,
        width: small ? geometry.width : geometry.largeHeight * 1.16 / 1.3,
        height: small ? geometry.height : geometry.largeHeight } : { opacity: 0 }}
      transition={instant ? { duration: 0 } : { duration: .95, ease: [.45, 0, .15, 1], delay: blinkDone && !docked ? .14 : 0 }}
      onAnimationComplete={arrive}>
      <img className="portrait-open" src="/media/matheus-avatar.png" alt="" fetchPriority="high"
        onLoad={() => onAsset('brand:avatar', true)} onError={() => onAsset('brand:avatar', false)} />
      {painted && !instant && !blinkDone && <svg className="portrait-eyelid" viewBox="0 0 1080 1350" aria-hidden="true">
        <defs><clipPath id="wink-lens"><path d="M594 643 Q622 606 679 613 Q749 611 778 651 L765 762 Q705 785 608 770 L588 700Z" /></clipPath>
          <linearGradient id="lid-skin" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffcb9b" /><stop offset="1" stopColor="#ffc695" /></linearGradient></defs>
        <g clipPath="url(#wink-lens)">
          <motion.g initial={{ scaleY: 0 }} animate={{ scaleY: [0, 1, 1, 0] }}
            style={{ transformOrigin: '675px 616px' }}
            transition={{ duration: .5, times: [0, .24, .48, 1], ease: 'easeInOut' }}
            onAnimationComplete={() => setBlinkDone(true)}>
            <path d="M605 762 C590 731 605 661 632 634 C661 605 705 612 730 646 C754 679 769 740 756 766 Q680 780 605 762Z" fill="url(#lid-skin)" stroke="url(#lid-skin)" strokeWidth="7" />
            <path d="M610 739 Q673 676 747 739 Q681 695 610 739Z" fill="#151310" />
            <path d="M618 704 Q641 682 663 680" stroke="#8a6347" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </motion.g>
        </g>
      </svg>}
    </motion.div>}
    {geometry && <span aria-hidden="true" className="entrance-name wordmark" style={{ left: geometry.textX, top: geometry.textY, fontSize: geometry.font }}>
      {'Matheus'.slice(0, letters)}{docked && letters < 7 && <span className="typing-cursor">|</span>}
    </span>}
  </div>;
}
