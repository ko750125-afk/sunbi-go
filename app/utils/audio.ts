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
    
    // 1. 목재 타격음 (Noise Burst)
    const bufferSize = ctx.sampleRate * 0.05; // 50ms noise
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(isAI ? 800 : 1000, now);
    noiseFilter.Q.setValueAtTime(1, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(volume * 0.5, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    // 2. 목재 공명음 (Resonance)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    
    // 바둑판의 두께와 재질을 시뮬레이션하는 주파수 믹스
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isAI ? 380 : 440, now);
    osc.frequency.exponentialRampToValueAtTime(isAI ? 180 : 220, now + 0.08);

    oscGain.gain.setValueAtTime(volume, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    // 실행
    noise.start(now);
    noise.stop(now + 0.05);
    osc.start(now);
    osc.stop(now + 0.15);

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
