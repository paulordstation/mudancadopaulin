import StrokeText from './StrokeText/StrokeText';

export function Logo() {
  return (
    <div className="logo">
      <StrokeText
        text="NOVAROTA"
        strokeColor="#A78BFA"
        fillColor="#F8FAFC"
        strokeWidth={1.4}
        drawDuration={1.6}
        fillDelay={0.2}
        stagger={0.05}
        ease="power2.out"
        trigger="mount"
        fillMode="wipe"
        fontSize={96}
        fontWeight={800}
        letterSpacing={-3}
        reverse={false}
      />
    </div>
  );
}
