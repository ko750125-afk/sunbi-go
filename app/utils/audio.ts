'use client'

/**
 * 선비의 공부방 - 고품질 바둑 소리 엔진 (Web Audio API)
 * 외부 라이브러리 없이 순수 오디오 합성으로 현실적인 목재 공명음을 구현합니다.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

/**
 * 바둑돌 착수 소리 (Wood "Tak")
 * - @param isAI: AI 응수 시 약간 다른 톤으로 출력
 * - @param volume: 볼륨 (0.0 ~ 1.0)
 */
export const playStoneSound = (isAI = false, volume = 0.4) => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    
    // 1. 묵직한 목재 타격음 (Low-frequency Thud)
    const thud = ctx.createOscillator();
    const thudGain = ctx.createGain();
    
    thud.type = 'triangle';
    thud.frequency.setValueAtTime(isAI ? 180 : 200, now);
    thud.frequency.exponentialRampToValueAtTime(isAI ? 80 : 100, now + 0.1);

    thudGain.gain.setValueAtTime(volume * 0.7, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    thud.connect(thudGain);
    thudGain.connect(ctx.destination);

    // 2. 고주파 타격 "딱" 소리 (Transient click)
    const click = ctx.createOscillator();
    const clickGain = ctx.createGain();
    
    click.type = 'sine';
    click.frequency.setValueAtTime(1100, now);
    click.frequency.exponentialRampToValueAtTime(700, now + 0.02);

    clickGain.gain.setValueAtTime(volume * 0.5, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    click.connect(clickGain);
    clickGain.connect(ctx.destination);

    // 3. 목재 공명 (Mid-range Resonance)
    const res = ctx.createOscillator();
    const resGain = ctx.createGain();
    
    res.type = 'triangle';
    res.frequency.setValueAtTime(isAI ? 340 : 380, now);

    resGain.gain.setValueAtTime(volume * 0.25, now);
    resGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    res.connect(resGain);
    resGain.connect(ctx.destination);

    // Start and Stop
    thud.start(now);
    thud.stop(now + 0.12);
    click.start(now);
    click.stop(now + 0.03);
    res.start(now);
    res.stop(now + 0.08);

  } catch (e) {
    console.error('Audio play failed:', e);
  }
};

/**
 * UI 버튼 클릭 소리
 */
export const playClickSound = (volume = 0.2) => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  } catch (e) {}
};

/**
 * 성공/축하 소리
 */
export const playSuccessSound = (volume = 0.3) => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    [440, 554.37, 659.25].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      
      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(volume, now + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.5);
    });
  } catch (e) {}
};
