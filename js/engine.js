(() => {
  const STORY = window.STORY;
  const CFG = STORY.config;
  const SC = STORY.scenes;
  const $ = (s, r = document) => r.querySelector(s);

  const stage = $('#stage'), video = $('#video'), ph = $('#ph'), vignette = $('#vignette'), sub = $('#sub');
  const choicesEl = $('#choices'), narr = $('#narr'), endingEl = $('#ending'), hint = $('#hint');
  const titleEl = $('#title'), fade = $('#fade'), chapterEl = $('#chapter'), tapPlay = $('#tap-play');
  const routeEl = $('#route'), tapzone = $('#tapzone'), pauseInd = $('#pause-ind'), scrub = $('#scrub');
  const pstage = $('#pstage'), phone = $('#phone'), pscreen = $('#pscreen'), sideInfo = $('#side-info');

  const ENDING_IDS = Object.keys(SC).filter((id) => SC[id].type === 'ending');
  const MI = 'media/images/alone/';
  const MISSION_IMGS = ['matchbox.png', 'stick_off.png', 'stick_on.png', 'candle_off.jpg', 'candle_on.jpg', 'switch_up.jpg', 'switch_down.jpg'].map((f) => MI + f);
  const PHONE_TYPES = new Set(['call', 'chat', 'dial']);
  const isPhone = (id) => !!SC[id] && PHONE_TYPES.has(SC[id].type);
  const pad2 = (n) => String(n).padStart(2, '0');
  const IS_IOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const mmss = (s) => `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`;
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const ICON = {
    phone: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    video: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2.5"/></svg>',
    mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></svg>',
    camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
    torch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M8 2h8v5l-2 4v11h-4V11L8 7z"/></svg>',
    bubble: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.5 3 2 6.6 2 11c0 2.4 1.3 4.6 3.4 6.1L4.5 21l4.2-2.2c1 .3 2.1.4 3.3.4 5.5 0 10-3.6 10-8.1S17.5 3 12 3z"/></svg>',
    sound: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none"/><path d="M9.5 8.5a5 5 0 0 1 0 7M13.5 5.5a9 9 0 0 1 0 13"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13"/></svg>',
    replay: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    speaker: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 4V5L7 9H3z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    micFill: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="8.5" y="2" width="7" height="13" rx="3.5"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    vidFill: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="6" width="13.5" height="12" rx="3"/><path d="M17 10.5l5-3v9l-5-3z"/></svg>',
    people: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 19c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5z"/><circle cx="17" cy="9" r="2.7"/><path d="M16.5 13.6c2.7.2 4.6 1.9 5 4.9h-4.4"/></svg>',
    waveform: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2"/></svg>',
  };

  /* ---------- 저장 (브라우저 로컬, 실패해도 게임은 동작) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  const ENDINGS_KEY = 'hbd.endings';

  /* ---------- 상태 ---------- */
  let state = freshState();
  let cleanup = null;
  let token = 0;
  let muted = false;
  let currentId = null;
  let gate = null;           // 지금 장면의 영상이 재생 시작되면 풀리는 약속
  const defaultSub = (t, cls = '') => {
    if (sub.dataset.multi) { delete sub.dataset.multi; sub.textContent = ''; }
    if (sub.textContent !== t) sub.textContent = t;
    sub.classList.toggle('think', cls === 'think' || cls === 'idle');
    sub.classList.toggle('idle', cls === 'idle');
  };
  // 자막 두 줄 동시에 (예: 내 말 + 아래 줄에 속마음)
  const multiSub = (list) => {
    const key = list.map((e) => e[2] + '|' + (e[3] || '')).join('\n');
    if (sub.dataset.multi === key) return;
    sub.dataset.multi = key;
    sub.classList.remove('think', 'idle');
    sub.innerHTML = list.map((e) => `<span class="l${e[3] === 'think' ? ' think' : ''}">${esc(e[2])}</span>`).join('');
  };
  let subOut = defaultSub;   // 자막 출력 위치 (영상통화 중에는 폰 안 캡션)

  function freshState() {
    return { flags: { ...(CFG.flags || {}) }, path: [], threads: {}, checkpoint: null };
  }
  const resolve = (n) => (typeof n === 'function' ? n(state.flags) : n);
  function applySet(set) {
    if (!set) return;
    for (const [k, v] of Object.entries(set)) {
      state.flags[k] = typeof v === 'number' && typeof state.flags[k] === 'number' ? state.flags[k] + v : v;
    }
  }

  /* ---------- 효과음 (파일 없으면 WebAudio로 합성) ---------- */
  // 아이폰: 무음 모드(옆 스위치)여도 효과음이 영상 소리처럼 나오게 (iOS 16.4+)
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch {}

  const Sound = (() => {
    let ctx = null;
    const ac = () => {
      if (!ctx) { const C = window.AudioContext || window.webkitAudioContext; if (C) ctx = new C(); }
      return ctx;
    };
    const note = (f, at, dur, vol = .15, type = 'sine') => {
      const c = ac(); if (!c || muted) return;
      const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + at;
      o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + .012);
      g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + .05);
    };
    // 효과음 파일은 미리 받아서 WebAudio로 재생 (연타·아이폰에서도 지연 없이)
    const buffers = {};
    const load = (src) => {
      if (!src || buffers[src]) return;
      buffers[src] = 'loading';
      fetch(src).then((r) => { if (!r.ok) throw new Error('no file'); return r.arrayBuffer(); })
        .then((b) => new Promise((ok, no) => { const p = ac().decodeAudioData(b, ok, no); p?.catch?.(no); }))
        .then((buf) => { buffers[src] = buf; }).catch(() => { delete buffers[src]; });
    };
    const file = (src, loop = false, vol = 1) => {
      const c = ac(), buf = buffers[src];
      if (c && buf && buf !== 'loading') {
        if (muted) return () => {};
        const n = c.createBufferSource(), g = c.createGain();
        n.buffer = buf; n.loop = loop; g.gain.value = vol;
        n.connect(g); g.connect(c.destination); n.start();
        return () => { try { n.stop(); } catch {} };
      }
      load(src);
      const a = new Audio(src); a.loop = loop; a.muted = muted; a.volume = vol; a.play().catch(() => {});
      return () => a.pause();
    };
    const S = CFG.sounds || {};
    let lastClick = 0;
    const clicks = new Set();
    setTimeout(() => { if (ac()) Object.values(S).forEach(load); }, 0);
    return {
      unlock() {
        try {
          const c = ac(); if (!c) return;
          Object.values(S).forEach(load);
          if (c.state !== 'running') c.resume();   // 'suspended' / 'interrupted'(전화·앱 전환 후) 모두 다시 켬
          try { if (navigator.audioSession && navigator.audioSession.type !== 'playback') navigator.audioSession.type = 'playback'; } catch {}
          // iOS: 터치 순간 무음 1샘플 재생해야 이후 소리가 남
          const s = c.createBufferSource(); s.buffer = c.createBuffer(1, 1, 22050); s.connect(c.destination); s.start(0);
        } catch {}
      },
      ring() {
        if (S.ring) return file(S.ring, true);
        const pattern = () => [[1318.5, 0], [987.8, .15], [1318.5, .3], [1568, .45], [1318.5, .8], [987.8, .95], [1318.5, 1.1], [1568, 1.25]]
          .forEach(([f, t]) => note(f, t, .32, .1, 'triangle'));
        pattern();
        const iv = setInterval(pattern, 2600);
        return () => clearInterval(iv);
      },
      ding() { S.message ? file(S.message) : (note(1568, 0, .25, .12), note(2093, .09, .45, .1)); },
      pop() { note(1568, 0, .25, .12); note(2093, .09, .45, .1); },   // 대화방 안: 처음 만든 '띵' 합성음
      ringback() {
        // 연결음 파일(2.5초 울림 + 1초 쉼)을 계속 반복
        const c = ac(), buf = buffers[S.ringback];
        if (S.ringback && c && buf && buf !== 'loading') {
          if (muted) return () => {};
          const n = c.createBufferSource(), g = c.createGain();
          n.buffer = buf; n.loop = true;   // 파일 자체가 '2.5초 울림 + 1초 쉼' 한 묶음
          g.gain.value = .8; n.connect(g); g.connect(c.destination); n.start(0, 0);
          return () => { try { n.stop(); } catch {} };
        }
        const beep = () => { note(440, 0, 1, .07); note(480, 0, 1, .07); };
        beep();
        const iv = setInterval(beep, 3000);
        return () => clearInterval(iv);
      },
      // 타이핑 소리: click 파일의 1.0~1.35초 구간을 글자마다 (너무 촘촘하면 건너뜀)
      click() {
        const now = performance.now();
        const c = ac(), buf = buffers[S.click];
        if (muted || !c || !buf || buf === 'loading' || now - lastClick < 40) return;
        lastClick = now;
        const n = c.createBufferSource(), g = c.createGain();
        n.buffer = buf; g.gain.value = .55;
        n.connect(g); g.connect(c.destination);
        n.start(0, 1.0, .35);
        clicks.add(n); n.onended = () => clicks.delete(n);
      },
      stopClicks() { clicks.forEach((n) => { try { n.stop(); } catch {} }); clicks.clear(); },
      // 짧은 잡음(성냥 긋기·셔터·스위치)
      noise(dur, { f = 3000, q = 1, vol = .4, type = 'bandpass', at = 0, sweep } = {}) {
        const c = ac(); if (!c || muted) return;
        const len = Math.max(1, Math.floor(c.sampleRate * dur)), b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        const n = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain(), t = c.currentTime + at;
        n.buffer = b; fl.type = type; fl.frequency.setValueAtTime(f, t); fl.Q.value = q;
        if (sweep) fl.frequency.exponentialRampToValueAtTime(sweep, t + dur);
        g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + Math.min(.012, dur / 3)); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
        n.connect(fl); fl.connect(g); g.connect(c.destination); n.start(t); n.stop(t + dur + .02);
      },
      strike() { this.noise(.07, { f: 2600 + Math.random() * 900, q: .8, vol: .55 }); this.noise(.05, { f: 4200, q: 1.2, vol: .3, at: .05 }); },
      ignite() { this.noise(.7, { f: 500, q: .6, vol: .5, type: 'lowpass', sweep: 3200 }); this.noise(.12, { f: 3500, vol: .4 }); },
      flick() { this.noise(.025, { f: 2400, q: 2, vol: .7 }); note(1900, .005, .04, .08, 'square'); this.noise(.03, { f: 1400, q: 2, vol: .45, at: .06 }); },
      shutter() { this.noise(.045, { f: 3000, q: 1.4, vol: .7 }); this.noise(.08, { f: 1800, q: 1, vol: .55, at: .09 }); },
      tick() { note(1250, 0, .07, .09, 'square'); },
      buzz() { note(196, 0, .5, .12, 'sawtooth'); note(147, .18, .6, .12, 'sawtooth'); },
      tada() { [[784, 0], [988, .09], [1175, .18], [1568, .27]].forEach(([f, t]) => note(f, t, .4, .1, 'triangle')); },
      send() { S.send ? file(S.send) : (note(880, 0, .1, .06), note(1318.5, .05, .16, .06)); },
      hangup() { S.hangup ? file(S.hangup) : (note(480, 0, .22, .1), note(480, .3, .22, .1)); },
    };
  })();
  const vibrate = (p) => { try { navigator.vibrate?.(p); } catch {} };
  // 연타하는 화면: 아이폰에서 두 번 탭하면 확대되는 것 막기 (손가락 떼는 순간의 기본 동작 취소 → 확대·클릭 지연 없음)
  const noZoom = (el) => {
    const stop = (e) => { if (e.cancelable) e.preventDefault(); };
    el.addEventListener('touchend', stop, { passive: false });
    el.addEventListener('dblclick', stop);
    el.addEventListener('gesturestart', stop);
    el.addEventListener('touchmove', (e) => { if (e.touches.length > 1 || e.scale !== undefined && e.scale !== 1) stop(e); }, { passive: false });
  };

  /* ---------- 장면 전환 ---------- */
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  async function go(id, opts = {}) {
    if (id === '@title' || id === '@route') {
      ++token; fade.classList.add('on'); await wait(320);
      id === '@title' ? showTitle() : showRoute();
      fade.classList.remove('on'); return;
    }
    const sc = SC[id];
    if (!sc) { console.error('[story] 없는 장면:', id); return; }
    const my = ++token;
    clearCtas();
    // 직전 폰 화면 위로 배너만 내려오는 문자 장면
    if (isPhone(currentId) && sc.type === 'chat' && sc.notify?.overlay && !opts.atChoice) opts = { ...opts, keepScreen: true, instant: true };
    // 같은 대화방에서 이어지는 문자 장면: 화면 전환 없이 그 자리에서 메시지만 이어서
    const cur = SC[currentId];
    if (cur?.type === 'chat' && sc.type === 'chat' && !opts.atChoice && (cur.thread || currentId) === (sc.thread || id) && !sc.notify)
      opts = { ...opts, keepScreen: true, instant: true, cont: true };
    if (!opts.instant) {
      // 폰 → 폰 장면은 검은 화면 없이 폰 안에서만 전환
      if (isPhone(currentId) && PHONE_TYPES.has(sc.type)) { pscreen.classList.add('swap'); await wait(220); }
      else { fade.classList.add('on'); await wait(320); }
      if (my !== token) return;
    }
    gate = null;
    enter(id, sc, opts);
    if (gate) {
      // 영상 첫 프레임이 나올 때까지 검은 화면 유지 (오래 걸리면 로딩 표시)
      fade.classList.add('on');
      const spin = setTimeout(() => fade.classList.add('loading'), 700);
      await gate;
      clearTimeout(spin); fade.classList.remove('loading');
      if (my !== token) return;
    }
    requestAnimationFrame(() => { fade.classList.remove('on'); pscreen.classList.remove('swap'); });
    // 지금 영상이 끝까지 받아질 만큼 되면(또는 6초 뒤) 다음 장면들 미리 받기 → 지금 영상과 인터넷을 나눠 쓰지 않게
    const playingClip = !video.hidden && video.getAttribute('src') && !video.getAttribute('src').startsWith('blob:');
    if (playingClip) {
      let fired = false;
      const ahead = () => { if (fired || my !== token) return; fired = true; Preload.ahead(id); };
      video.addEventListener('canplaythrough', ahead, { once: true });
      setTimeout(ahead, 6000);
    } else Preload.ahead(id);
  }

  function teardown(keepScreen = false) {
    sceneNo++; clearCtas();
    if (cleanup) { cleanup(); cleanup = null; }
    Confetti.stop();
    subOut = defaultSub;
    if (!keepScreen) defaultSub('');   // 배너 장면에서는 직전 속마음 자막 유지
    choicesEl.innerHTML = ''; choicesEl.className = '';
    narr.hidden = true; narr.innerHTML = '';
    endingEl.hidden = true; endingEl.innerHTML = '';
    titleEl.hidden = true;
    routeEl.hidden = true; routeEl.innerHTML = '';
    tapPlay.hidden = true;
    hint.hidden = true;
    stage.classList.remove('slowmo', 'clip-full');
    // 폰 안으로 옮겨 둔 영상/플레이스홀더를 무대로 복귀
    if (video.parentNode !== stage) stage.insertBefore(video, vignette);
    if (ph.parentNode !== stage) stage.insertBefore(ph, vignette);
    if (!keepScreen) pscreen.innerHTML = '';
    pscreen.onclick = null;
    $('.toast', stage)?.remove(); $('.mash', stage)?.remove(); $('.mission', stage)?.remove();
    phone.classList.remove('ringing');
    sideInfo.innerHTML = '';
  }

  function enter(id, sc, opts) {
    teardown(opts.keepScreen);
    currentId = id;
    stage.dataset.type = sc.type;
    if (sc.chapter) setChapter(sc.chapter);
    applySet(sc.set);

    const toPhone = PHONE_TYPES.has(sc.type);
    stage.classList.toggle('phone-mode', toPhone);
    if (toPhone && pstage.hidden) {
      pstage.hidden = false;
      phone.classList.remove('enter', 'zoom'); void phone.offsetWidth; phone.classList.add('enter');
    } else if (!toPhone) pstage.hidden = true;

    if (sc.type === 'clip') playClip(id, sc, opts);
    else if (sc.type === 'narration') showNarration(sc, opts, id);
    else if (sc.type === 'ending') showEnding(id, sc, opts);
    else if (sc.type === 'call') showCall(id, sc, opts);
    else if (sc.type === 'chat') showChat(id, sc, opts);
    else if (sc.type === 'dial') showDial(id, sc, opts);
    else if (sc.type === 'mission') showMission(id, sc, opts);
    Dev.update(id);
  }

  function setChapter(ch) {
    const { no, title } = typeof ch === 'string' ? { title: ch } : ch;
    chapterEl.innerHTML = `${no ? `<span class="no">CH.${no}</span>` : ''}<span>${title}</span>`;
    chapterEl.classList.remove('flash'); void chapterEl.offsetWidth; chapterEl.classList.add('flash');
  }

  // 안내(CTA)는 지금 장면에서만 유효. 장면이 바뀐 뒤 늦게 도착한 요청은 무시
  // 사용자가 뭔가 하면(탭·선택·다음 장면) clearCtas() → ctaNo 가 바뀌어서 예약돼 있던 안내도 전부 취소됨
  let sceneNo = 0, ctaNo = 0;
  function showHint(text, no = sceneNo, c = ctaNo) { if (no !== sceneNo || c !== ctaNo) return; hint.textContent = text; hint.hidden = false; }
  function hintLater(text, ms) { const no = sceneNo, c = ctaNo; setTimeout(() => showHint(text, no, c), ms); }
  function clearCtas() {
    ctaNo++;
    hint.hidden = true; hint.textContent = '';
    document.querySelectorAll('.r-cta, .n-cta').forEach((el) => el.classList.remove('show'));
  }
  function side(label, name, meta = '') {
    sideInfo.innerHTML = `<div class="si-label">${label}</div><div class="si-name">${esc(name)}</div><div class="si-meta">${meta}</div>`;
  }
  const sideMeta = (html) => { const m = $('.si-meta', sideInfo); if (m) m.innerHTML = html; };

  /* ---------- 플레이어: 실제 영상 / 플레이스홀더 공통 인터페이스 ---------- */
  function makePlayer(sc, { loop = false, quick = false } = {}) {
    if (sc.src) {
      // src 가 배열이면 순서대로 이어서 재생 (시간은 전체 기준으로 계산)
      const list = [].concat(sc.src);
      let idx = 0, offset = 0;
      video.hidden = false; ph.hidden = true;
      video.removeAttribute('poster');
      Preload.focus();
      const want0 = Preload.url(list[0]);
      if (video.getAttribute('src') !== want0) video.src = want0;
      video.loop = loop && list.length === 1;
      const nextPart = () => {
        if (idx >= list.length - 1) return;
        // 다음 파일 로딩 동안 마지막 프레임을 포스터로 덮어 끊김을 가림
        try {
          const c = document.createElement('canvas');
          c.width = video.videoWidth; c.height = video.videoHeight;
          c.getContext('2d').drawImage(video, 0, 0);
          video.poster = c.toDataURL('image/jpeg', .8);
        } catch {}
        offset += video.duration || 0;
        video.src = Preload.url(list[++idx]);
        video.play().catch(() => {});
        video.addEventListener('playing', () => video.removeAttribute('poster'), { once: true });
      };
      video.addEventListener('ended', nextPart);
      let release;
      if (quick) {
        // 선택지 화면으로 바로 이동: 썸네일을 먼저 깔고 바로 보여줌 (영상은 뒤에서 이어서 로딩)
        release = () => {};
        if (sc.route?.thumb) video.poster = sc.route.thumb;
        video.addEventListener('playing', () => video.removeAttribute('poster'), { once: true });
      } else {
        gate = new Promise((r) => { release = r; });
        video.addEventListener('playing', release, { once: true });
        setTimeout(release, 10000);
      }
      // 세로 영상은 위쪽 칸 대신 화면 가득 채워서
      const fitPortrait = () => stage.classList.toggle('clip-full', stage.dataset.type === 'clip' && video.videoHeight > video.videoWidth);
      stage.classList.remove('clip-full');
      if (video.readyState >= 1) fitPortrait(); else video.addEventListener('loadedmetadata', fitPortrait, { once: true });
      video.muted = muted;
      video.playbackRate = 1;
      if (!(quick && !video.paused)) { try { video.currentTime = sc.start || 0; } catch {} }
      const play = () => video.play().then(() => { tapPlay.hidden = true; }).catch(() => {
        release();              // 검은 화면은 걷고
        tapPlay.hidden = false; // 자동재생 차단 시 터치 유도
        tapPlay.onclick = () => play();
      });
      play();
      const last = () => idx === list.length - 1;
      return {
        tick() {},
        time: () => offset + video.currentTime,
        end: () => sc.end ?? (last() ? offset + video.duration : Infinity),
        ended: () => last() && video.ended,
        seek(t) { video.currentTime = Math.max(0, t - offset); if (video.paused) video.play().catch(() => {}); },
        rate(r) { video.playbackRate = r; },
        stop() { video.pause(); video.removeEventListener('ended', nextPart); },
        pause() { video.pause(); },
        setTime(t) { video.currentTime = Math.max(0, t - offset); },
        resume() { video.play().catch(() => {}); },
        paused: () => video.paused,
      };
    }
    // 플레이스홀더: 가짜 시계로 같은 흐름을 재현
    video.hidden = true; ph.hidden = false;
    const [c1, c2] = sc.bg || ['#2a3c4f', '#0c1620'];
    ph.style.setProperty('--ph-c1', c1); ph.style.setProperty('--ph-c2', c2);
    $('.ph-label', ph).innerHTML = `<b>▶ ${sc.label || currentId}</b>영상 클립 자리 · ${sc.duration || 5}s`;
    let t = sc.start || 0, r = 1, last = performance.now();
    const dur = sc.duration || 5;
    return {
      tick() { const now = performance.now(); t += ((now - last) / 1000) * r; last = now; if (loop && t > dur) t = 0; },
      time: () => t,
      end: () => dur,
      ended: () => !loop && t >= dur,
      seek(v) { t = v; },
      rate(v) { r = v; },
      stop() {},
      pause() {}, resume() {}, paused: () => false, setTime(v) { t = v; },
    };
  }

  function currentSub(subs, t) {
    if (subs) for (const e of subs) if (t >= e[0] && t < e[1]) return e;
    return null;
  }

  /* 연타 이벤트: 마지막 장면에서 버튼 → 제한 시간 안에 n번 누르면 성공 */
  function startMash(id, m) {
    const my = token, need = m.taps || 10, ms = (m.window || 1.5) * 1000;
    state.checkpoint = { id, flags: { ...state.flags }, path: state.path.slice(), threads: JSON.parse(JSON.stringify(state.threads)) };
    Route.snap(id, state.checkpoint);
    const el = document.createElement('div');
    el.className = 'mash';
    el.innerHTML = `<button class="mash-btn"><b>${esc(m.text || '빠르게 연타하세요!')}</b><span class="mash-n">0 / ${need}</span></button><i class="mash-bar"><s></s></i>`;
    stage.append(el);
    noZoom(el);
    const btn = $('.mash-btn', el), nEl = $('.mash-n', el), bar = $('.mash-bar s', el);
    let n = 0, done = false;
    vibrate(200);
    const end = (ok) => {
      if (done) return; done = true;
      el.classList.add(ok ? 'win' : 'lose');
      Route.pick(id, ok ? 0 : 1);
      setTimeout(() => { if (my === token) go(resolve(ok ? m.success : m.fail)); }, 600);
    };
    requestAnimationFrame(() => {
      bar.style.transition = `transform ${ms}ms linear`; bar.style.transform = 'scaleX(0)';
    });
    setTimeout(() => end(n >= need), ms);
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault(); e.stopPropagation();
      if (done) return;
      n++; nEl.textContent = `${Math.min(n, need)} / ${need}`;
      btn.classList.remove('hit'); void btn.offsetWidth; btn.classList.add('hit');
      vibrate(15);
      if (n >= need) end(true);
    });
  }

  /* 클립 재생 + 자막 + (선택지 구간 느린 반복) 공통 루프 */
  function runClip(id, sc, P, opts, { layout, onEnd, onChoice, onTick } = {}) {
    const ch = sc.choice;
    let mode = 'play';
    let raf;
    // at: 선택지가 뜨는 시점. 있으면 → 정상 속도로 계속 재생, 끝까지 가면 처음부터 반복
    // at 없이 loop:[a,b] 만 있으면 → a초에 선택지 + a~b 느리게 반복 (예전 방식)
    const atEnd = ch?.at === 'end';
    const showAt = ch ? (atEnd ? Infinity : ch.at ?? ch.loop?.[0] ?? 0) : 0;
    const rate = ch ? (ch.rate ?? (ch.at != null ? 1 : CFG.loopRate ?? 0.5)) : 1;
    // 선택지 지점으로 바로 들어올 때: 끝에서 고르는 선택지면 처음부터 재생, 아니면 선택지 시점으로
    if (opts.atChoice && ch && !atEnd) P.seek(showAt);
    if (opts.atChoice && sc.urgent) P.seek(Math.max(0, sc.urgent.at - 4));   // 루트에서 바로: 긴급상황 조금 전부터

    let holdT = null;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      P.tick();
      const t = P.time();
      if (mode === 'play' || (mode === 'choice' && !ch.prompt)) {
        const e = currentSub(sc.subs, t);
        const all = (sc.subs || []).filter((x) => t >= x[0] && t < x[1]);
        // 대사가 없는 동안엔 idleSub(예: '멤버들의 말을 들어보자...')를 계속 띄움
        if (all.length > 1 && subOut === defaultSub) multiSub(all);
        else if (e) subOut(e[2], e[3]);
        else if (sc.idleSub && mode === 'play') subOut(sc.idleSub, 'idle');
        else subOut('');
      }
      if (mode === 'play') {
        if (ch && (t >= showAt || (atEnd && (t >= P.end() - .08 || P.ended())))) {
          if (atEnd) P.pause();   // 마지막 장면에서 멈춘 채 선택
          mode = 'choice';
          if (rate !== 1) { P.rate(rate); stage.classList.add('slowmo'); }
          if (ch.prompt) subOut(ch.prompt);
          onChoice?.();
          openChoice(id, ch, { layout });
        } else if (!ch && (t >= P.end() || P.ended())) {
          mode = 'done';
          const finish = () => (onEnd ? onEnd() : go(resolve(sc.next)));
          // holdEnd: 마지막 프레임·마지막 자막 그대로 n초 멈췄다가 넘어감
          if (sc.mash) { P.pause(); startMash(id, sc.mash); }
          else if (sc.urgent) P.pause();   // 긴급상황 답장 결과로 넘어감 (마지막 장면에서 멈춤)
          else if (sc.holdEnd) { P.pause(); holdT = setTimeout(finish, sc.holdEnd * 1000); }
          else finish();
        }
      } else if (mode === 'choice' && !atEnd) {
        const a = ch.loop?.[0] ?? 0, b = ch.loop?.[1] ?? P.end();
        if (t >= b - 0.06 || P.ended()) P.seek(a);
      }
      onTick?.(t);
    };
    frame();
    return () => { cancelAnimationFrame(raf); clearTimeout(holdT); P.stop(); closeChoice(); };
  }

  /* 영상 재생 중 문자 알림(위쪽 미리보기) + 긴급상황 답장
     texts: { from, thread, list: [[초, '내용'], ...] }
     urgent: { at, text, placeholder, answer, time, success, fail } → at초에 화면 dim + 알림 강조, time초 안에 알림 눌러 answer 를 쳐서 보내야 성공 */
  function clipTexts(id, sc, P, opts) {
    const my = token, T = sc.texts || { list: [] }, U = sc.urgent;
    const from = T.from || '메시지', initial = [...from][0];
    const hist = T.thread ? (state.threads[T.thread] ||= []) : null;
    const wrap = document.createElement('div');
    wrap.className = 'cnoti';
    stage.append(wrap);
    let shown = 0, urgentOn = false, sheet = null, input = null, done = false, raf = 0, t0 = 0, vvOff = null;
    const recv = [];
    const banner = (text, quiet) => {
      wrap.querySelectorAll('.cn').forEach((b) => b.classList.add('old'));
      [...wrap.querySelectorAll('.cn.old')].slice(0, -1).forEach((b) => b.remove());
      const b = document.createElement('div');
      b.className = 'cn';
      b.innerHTML = `<div class="b-icon">${ICON.bubble}</div><div class="b-body"><div class="b-row"><b>${esc(from)}</b><span>지금</span></div><p></p></div>`;
      $('p', b).textContent = text;
      wrap.append(b);
      requestAnimationFrame(() => b.classList.add('in'));
      if (!quiet) { Sound.ding(); vibrate(120); }
    };
    // 루트에서 바로 들어온 경우: 이미 지난 알림은 소리 없이 마지막 것만
    const skip = opts.atChoice && U ? Math.max(0, U.at - 4) : 0;
    const tick = (t) => {
      while (shown < T.list.length && t >= T.list[shown][0]) {
        const [at, text] = T.list[shown++];
        recv.push(text); hist?.push([from, text]);
        if (at >= skip || shown === T.list.length || T.list[shown][0] > skip) banner(text, at < skip);
      }
      if (U && !urgentOn && t >= U.at) startUrgent();
    };

    function startUrgent() {
      urgentOn = true;
      state.checkpoint = { id, flags: { ...state.flags }, path: state.path.slice(), threads: JSON.parse(JSON.stringify(state.threads)) };
      // 체크포인트는 알림이 쌓이기 전 상태로 (루트에서 다시 들어오면 영상에서 다시 받음)
      if (hist) state.checkpoint.threads[T.thread] = hist.slice(0, hist.length - recv.length);
      Route.snap(id, state.checkpoint);
      const LIMIT = (U.time || 3) * 1000;
      stage.classList.add('urgent');
      const ov = document.createElement('div');
      ov.className = 'ur-ov';
      ov.innerHTML = `<div class="ur-box"><span class="ur-tag">🚨 긴급상황</span><p>${esc(U.text || '답장해주세요!')}</p>
        <div class="ur-bar"><s></s></div><small>알림을 눌러서 답장!</small></div>`;
      wrap.append(ov);
      const last = wrap.querySelector('.cn:not(.old)');
      last?.classList.add('hot');
      Sound.buzz(); vibrate([300, 100, 300]);
      // 답장 화면 (미리 만들어 두고 숨김 → 알림 누르는 순간 바로 키보드)
      sheet = document.createElement('div');
      sheet.className = 'ur-sheet';
      sheet.innerHTML = `
        <div class="ur-time"><s></s></div>
        <div class="ur-head"><span class="back">${ICON.chev}</span><div class="m-av">${esc(initial)}</div><b>${esc(from)}</b></div>
        <div class="ur-body">${recv.slice(-5).map((x) => `<div class="ur-b them"><span>${esc(x)}</span></div>`).join('')}</div>
        <form class="ur-input"><span class="plus">${ICON.plus}</span>
          <label class="field"><input type="text" placeholder="${esc(U.placeholder || '')}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="send">
          <button type="submit" class="send" aria-label="보내기">${ICON.up}</button></label></form>`;
      document.body.append(sheet);
      input = $('input', sheet);
      const bars = [$('.ur-bar s', ov), $('.ur-time s', sheet)];
      // 키보드가 올라오면 보이는 영역에 맞춤
      const vv = window.visualViewport;
      const fit = () => { if (vv) { sheet.style.top = vv.offsetTop + 'px'; sheet.style.height = vv.height + 'px'; } };
      if (vv) { vv.addEventListener('resize', fit); vv.addEventListener('scroll', fit); vvOff = () => { vv.removeEventListener('resize', fit); vv.removeEventListener('scroll', fit); }; }
      fit();
      const open = (e) => {
        e?.preventDefault?.();
        if (done || sheet.classList.contains('open')) return;
        sheet.classList.add('open');
        input.focus();   // 누른 순간(사용자 동작 안)에 포커스해야 아이폰 키보드가 뜸
        clearCtas();
      };
      (last || wrap).addEventListener('click', open);   // 클릭(손 뗄 때)에 포커스해야 아이폰 키보드가 확실히 뜸
      input.addEventListener('input', () => sheet.classList.toggle('typed', !!input.value));
      const norm = (x) => x.replace(/\s+/g, '');
      $('form', sheet).addEventListener('submit', (e) => {
        e.preventDefault();
        if (done) return;
        if (norm(input.value) === norm(U.answer || U.placeholder || '')) finish(true);
        else { sheet.classList.remove('wrong'); void sheet.offsetWidth; sheet.classList.add('wrong'); vibrate(80); }
      });
      $('.send', sheet).addEventListener('pointerdown', (e) => e.preventDefault());   // 보내기 눌러도 키보드 유지
      t0 = performance.now();
      const loop = () => {
        raf = requestAnimationFrame(loop);
        const left = Math.max(0, LIMIT - (performance.now() - t0));
        bars.forEach((b) => { b.style.transform = `scaleX(${left / LIMIT})`; });
        if (left <= 0) finish(false);
      };
      loop();
    }

    function finish(ok) {
      if (done) return; done = true;
      cancelAnimationFrame(raf);
      Route.pick(id, ok ? 0 : 1);
      if (ok) {
        const b = document.createElement('div');
        b.className = 'ur-b me pop'; b.innerHTML = '<span></span>';
        b.firstChild.textContent = input.value.trim();
        $('.ur-body', sheet).append(b);
        input.value = ''; sheet.classList.remove('typed');
        Sound.send();
      } else {
        Sound.buzz(); vibrate([200, 80, 200]);
        sheet.classList.add('late'); wrap.classList.add('late');
      }
      input?.blur();
      setTimeout(() => { if (my === token) go(resolve(ok ? U.success : U.fail)); }, ok ? 1100 : 1300);
    }

    return {
      tick,
      cleanup() {
        cancelAnimationFrame(raf); vvOff?.(); input?.blur();
        sheet?.remove(); wrap.remove(); stage.classList.remove('urgent');
      },
    };
  }

  /* ---------- 클립 장면 (전체화면) ---------- */
  function playClip(id, sc, opts) {
    const P = makePlayer(sc, { quick: !!opts.atChoice && !!(sc.choice || sc.mash || sc.urgent) });   // 루트에서 바로: 썸네일 먼저 깔고 즉시 시작
    // 영상 뒤 화면 전체: 같은 영상을 작게 그려서 흐리게 (CSS blur)
    const bgc = $('#clip-bg'), bgx = bgc.getContext('2d');
    bgx.clearRect(0, 0, bgc.width, bgc.height);
    const bgTimer = sc.src ? setInterval(() => {
      if (video.readyState >= 2) { try { bgx.drawImage(video, 0, 0, bgc.width, bgc.height); } catch {} }
    }, 1200) : null;   // 자주 그리면 폰에서 영상·소리가 버벅여서 가끔만 (배경은 흐려서 티 안 남)
    // noSkip: 일시정지·진행 바 없이 끝까지 (긴급상황 영상 등)
    const ctl = sc.noSkip ? (scrub.hidden = true, { onTick: null, choosing: null, cleanup() {} }) : clipControls(sc, P);
    const tx = sc.texts || sc.urgent ? clipTexts(id, sc, P, opts) : null;
    const stop = runClip(id, sc, P, opts, { onTick: (t) => { ctl.onTick?.(t); tx?.tick(t); }, onChoice: ctl.choosing });
    cleanup = () => { stop(); ctl.cleanup(); tx?.cleanup(); clearInterval(bgTimer); };
  }

  /* 영상 조작: 탭 → 일시정지/재생, 진행 바 끌어서 이동 (일반 클립·영상통화 공용) */
  function clipControls(sc, P) {
    let choosing = false, dragging = false, wasPaused = false, hideT;
    stage.classList.add('ctl');
    const showPaused = (on) => pauseInd.classList.toggle('on', on);
    const fill = $('.sb-fill', scrub), timeEl = $('.sb-time', scrub), track = $('.sb-track', scrub);
    // 진행 바: 탭/일시정지/조작 중에는 굵게 + 시간 표시, 평소엔 얇게
    const wake = (ms = 2500) => { scrub.classList.add('active'); clearTimeout(hideT); hideT = setTimeout(() => { if (!dragging && !P.paused()) scrub.classList.remove('active'); }, ms); };
    const onTick = (t) => {
      const d = P.end();
      if (!isFinite(d) || d <= 0) return;
      fill.style.setProperty('--f', Math.min(1, t / d));
      timeEl.textContent = `${mmss(Math.floor(t))} / ${mmss(Math.floor(d))}`;
    };
    const toggle = () => {
      wake();
      if (choosing || !sc.src) return;   // 선택지 대기 중에는 멈추지 않음
      if (P.paused()) { P.resume(); showPaused(false); } else { P.pause(); showPaused(true); }
    };
    const seekAt = (e) => {
      const r = track.getBoundingClientRect(), d = P.end();
      if (!isFinite(d)) return;
      const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      P.setTime(f * d * .999);
      onTick(f * d);
    };
    scrub.onpointerdown = (e) => {
      if (!sc.src) return;
      e.stopPropagation();
      dragging = true; wasPaused = P.paused(); P.pause();
      scrub.setPointerCapture?.(e.pointerId);
      wake(); seekAt(e);
    };
    scrub.onpointermove = (e) => { if (dragging) seekAt(e); };
    scrub.onpointerup = scrub.onpointercancel = () => {
      if (!dragging) return;
      dragging = false;
      if (!wasPaused) P.resume();
      wake();
    };
    const key = (e) => { if (e.key === ' ') { e.preventDefault(); toggle(); } };
    tapzone.onclick = toggle;
    window.addEventListener('keydown', key);
    scrub.hidden = !sc.src;
    return {
      onTick,
      choosing: () => { choosing = true; showPaused(false); },
      cleanup() {
        clearTimeout(hideT); stage.classList.remove('ctl');
        tapzone.onclick = null; scrub.onpointerdown = scrub.onpointermove = scrub.onpointerup = scrub.onpointercancel = null;
        scrub.classList.remove('active'); showPaused(false);
        window.removeEventListener('keydown', key);
      },
    };
  }

  /* ---------- 선택지 ---------- */
  let choiceTimer = null, keyHandler = null;

  function openChoice(id, ch, { layout, onPick } = {}) {
    const my = token;
    // 엔딩 화면의 "마지막 선택으로"용 체크포인트
    state.checkpoint = { id, flags: { ...state.flags }, path: state.path.slice(), threads: JSON.parse(JSON.stringify(state.threads)) };
    Route.snap(id, state.checkpoint);   // 루트 화면에서 여기로 바로 돌아올 수 있게
    const seen = Route.picked(id);

    const options = ch.options.map((o, i) => ({ ...o, i })).filter((o) => !o.if || o.if(state.flags));
    choicesEl.className = `${layout === 'side' ? 'side ' : ''}n${options.length}`;
    const head = ch.head ? `<div class="c-head sub-style">${esc(ch.head)}</div>`   // 선택지 위 고정 문구
      : layout === 'side' && ch.prompt ? `<div class="c-head"><span>${ch.label || 'CHOICE'}</span>${esc(ch.prompt)}</div>` : '';
    choicesEl.innerHTML = head + options.map((o, k) =>
      `<button class="opt${seen.includes(o.i) ? ' seen' : ''}" style="--i:${k}" data-k="${k}"><span class="txt">${esc(o.text)}</span><span class="arrow">${seen.includes(o.i) ? '◜◡◝' : '›'}</span></button>`
    ).join('') + (ch.timeout ? '<div class="c-timer"><i></i><span></span></div>' : '');

    let locked = false;
    const pick = (k) => {
      if (locked || !options[k]) return;
      locked = true;
      clearInterval(choiceTimer);
      clearCtas();
      const o = options[k];
      choicesEl.querySelector(`[data-k="${k}"]`).classList.add('picked');
      choicesEl.classList.add('decided');
      applySet(o.set);
      state.path.push(o.text);
      Route.pick(id, o.i);
      const proceed = () => { if (my === token) go(resolve(o.next)); };
      if (onPick) Promise.resolve(onPick(o)).then(proceed);
      else setTimeout(proceed, 650);
    };
    choicesEl.onclick = (e) => { const b = e.target.closest('.opt'); if (b) pick(+b.dataset.k); };
    keyHandler = (e) => { const n = parseInt(e.key, 10); if (n >= 1 && n <= options.length) pick(n - 1); };
    window.addEventListener('keydown', keyHandler);

    if (ch.timeout) {
      const total = ch.timeout * 1000, t0 = performance.now();
      const tEl = $('.c-timer', choicesEl), label = $('span', tEl);
      const def = Math.max(0, options.findIndex((o) => o.i === (ch.default ?? 0)));
      const update = () => {
        const left = Math.max(0, total - (performance.now() - t0));
        tEl.style.setProperty('--p', left / total);
        label.textContent = pad2(Math.ceil(left / 1000));
        tEl.classList.toggle('hurry', left <= 3000);
        if (left <= 0) pick(def);
      };
      update();
      choiceTimer = setInterval(update, 100);
    }
  }
  function closeChoice() {
    clearInterval(choiceTimer); choiceTimer = null;
    if (keyHandler) window.removeEventListener('keydown', keyHandler);
    keyHandler = null; choicesEl.onclick = null;
  }

  /* ---------- 영상통화 (폰 목업) ---------- */
  function showCall(id, sc, opts) {
    const name = sc.from || '알 수 없음';
    const initial = sc.initial || [...name][0];
    const [c1, c2] = sc.bg || ['#3b5a7a', '#0b1018'];
    const avatar = sc.avatar ? `<img src="${sc.avatar}" alt="">` : `<span>${esc(initial)}</span>`;
    const timers = [];
    let alive = true, stopRing = () => {}, clipCleanup = null, clockTimer = null, bgTimer = null, declineTimer = null;
    const later = (fn, ms) => timers.push(setTimeout(() => alive && fn(), ms));

    let ringing = false;
    const ring = () => {
      ringing = true;
      side('INCOMING · VIDEO CALL', name, '<i class="dot"></i>수신 중');
      pscreen.innerHTML = `
        <div class="v-ring" style="--c1:${c1};--c2:${c2}">
          <div class="r-head">
            <div class="r-kind">${ICON.vidFill}FaceTime 비디오…</div>
            <div class="r-name">${esc(name)}</div>
          </div>
          ${CFG.phone?.selfImage ? `<div class="r-self" style="background-image:url('${CFG.phone.selfImage}')"></div>` : ''}
          <div class="r-extra">
            <button class="rx later"><b>${ICON.clock}</b><span>나중에 알림</span></button>
            <button class="rx msg"><b>${ICON.bubble}</b><span>메시지</span></button>
          </div>
          <div class="r-btns">
            <button class="rb decline"><b>${ICON.phone}</b><span>거절</span></button>
            <button class="rb accept"><b>${ICON.vidFill}</b><span>${sc.acceptLabel || '수락'}</span></button>
          </div>
        </div>`;
      phone.classList.add('ringing');
      stopRing = Sound.ring();
      vibrate([600, 400, 600, 400, 600, 400, 600]);
      $('.accept', pscreen).onclick = accept;
      $('.decline', pscreen).onclick = decline;
      pscreen.querySelectorAll('.rx').forEach((b) => (b.onclick = decline));
    };

    const decline = () => {
      if (sc.decline) { stopRing(); go(resolve(sc.decline)); return; }
      defaultSub(''); void sub.offsetWidth;   // 다시 눌러도 등장 효과가 다시 보이게
      defaultSub(sc.declineText || '지금은 받아야 할 것 같다…', 'think');
      clearTimeout(declineTimer);
      declineTimer = setTimeout(() => defaultSub(''), 2400);
    };

    const accept = () => {
      ringing = false;
      $('.r-cta', pscreen)?.remove();
      stopRing(); vibrate(0);
      phone.classList.remove('ringing');
      clearCtas();
      if (sc.answer) {
        // 받기 → 폰이 화면 가득 확대되며 전체화면 클립으로
        side('VIDEO CALL', name, '<i class="dot on"></i>연결됨');
        phone.classList.remove('enter'); phone.classList.add('zoom');
        later(() => go(resolve(sc.answer)), 650);
        return;
      }
      connect(false);
    };

    const connect = (instant) => {
      pscreen.innerHTML = `
        <div class="v-call" style="--c1:${c1};--c2:${c2}">
          <div class="media">${sc.callBg ? `<div class="media-bg on" style="background-image:url('${sc.callBg}')"></div>` : '<canvas class="media-bg" width="36" height="64"></canvas>'}</div>
          <div class="panel">
            <div class="c-top">
              <div class="c-av">${avatar}</div>
              <div class="c-who"><b>${esc(name)}</b><span class="c-time"><i></i><span>연결 중…</span></span></div>
            </div>
            <div class="c-btns">
              <button class="pi">${ICON.speaker}</button>
              <button class="pi">${ICON.vidFill}</button>
              <button class="pi">${ICON.micFill}</button>
              <button class="pi">${ICON.people}</button>
              <button class="pi hang">${ICON.phone}</button>
            </div>
          </div>
          <div class="pip">${CFG.phone?.selfImage ? `<img src="${CFG.phone.selfImage}" alt="">` : ICON.user}</div>
          <div class="caption"><span></span></div>
        </div>`;
      side('VIDEO CALL', name, '<i class="dot"></i>연결 중');
      $('.media', pscreen).append(video, ph);
      // 뒤 배경: 영상 한 장면만 떠서 흐리게 깔아둠 (계속 바뀌지 않게 → 울렁거림 없음)
      const bg = $('.media-bg', pscreen);
      const snap = () => {
        if (!alive || video.readyState < 2 || !bg.getContext) return;
        try { bg.getContext('2d').drawImage(video, 0, 0, bg.width, bg.height); bg.classList.add('on'); } catch {}
      };
      video.addEventListener('playing', () => later(snap, 600), { once: true });
      later(snap, 1500);
      // 영상은 잘리지 않게 전체 표시, 남는 위아래는 같은 영상을 흐리게 깔아 채움

      const cap = $('.caption span', pscreen);
      // 일반 대사는 폰 안 캡션, 속마음(think)은 화면 아래 노란 자막
      subOut = (t, cls) => {
        const inCap = cls === 'think' ? '' : t;
        if (cap.textContent !== inCap) cap.textContent = inCap;
        defaultSub(cls === 'think' ? t : '', cls);
      };
      // 종료 버튼은 연출용 (이야기 도중 끊기 방지)
      const hang = $('.hang', pscreen);
      hang.onclick = () => hang.animate([{ transform: 'none' }, { transform: 'translateX(-8%)' }, { transform: 'translateX(8%)' }, { transform: 'none' }], { duration: 260 });

      later(() => {
        let started = null;
        const startClock = () => {
          if (!alive || started) return;
          started = performance.now();
          const tick = () => {
            const txt = mmss(Math.floor((performance.now() - started) / 1000));
            const el = $('.c-time > span', pscreen);
            if (el) el.textContent = txt;
            sideMeta(`<i class="dot on"></i>${txt}`);
          };
          tick();
          clockTimer = setInterval(tick, 500);
        };
        // 영상이 실제로 나오기 전까지는 "연결 중…" 상태 유지
        if (sc.src) video.addEventListener('playing', startClock, { once: true }); else startClock();
        const CP = makePlayer(sc);
        const ctl = sc.src ? clipControls(sc, CP) : null;
        const stopClip = runClip(id, sc, CP, opts, { layout: 'side', onTick: ctl?.onTick, onChoice: ctl?.choosing,
          onEnd: () => { ctl?.cleanup(); end(started ?? performance.now()); } });
        clipCleanup = () => { stopClip(); ctl?.cleanup(); };
      }, instant ? 0 : 700);
    };

    const end = (started) => {
      clearInterval(clockTimer);
      const dur = mmss(Math.floor((performance.now() - started) / 1000));
      subOut('');
      $('.v-call', pscreen).insertAdjacentHTML('beforeend', `<div class="ended"><div class="c-av">${avatar}</div><b>${esc(name)}</b><span>FaceTime 종료됨 · ${dur}</span></div>`);
      side('CALL ENDED', name, `<i class="dot red on"></i>${dur}`);
      Sound.hangup();
      if (sc.endLine) later(() => defaultSub(sc.endLine, 'think'), 500);
      later(() => go(resolve(sc.next)), sc.endHold ?? (sc.endLine ? 2600 : 1500));
    };

    if (opts.atChoice || sc.answered) connect(true); else ring();
    cleanup = () => {
      alive = false; timers.forEach(clearTimeout); clearInterval(clockTimer); clearInterval(bgTimer); clearTimeout(declineTimer);
      stopRing(); vibrate(0); clipCleanup?.();
    };
  }

  /* ---------- 문자 (잠금화면 알림 → 채팅) ---------- */
  function showChat(id, sc, opts) {
    const thread = sc.thread || id;
    const hist = (state.threads[thread] ||= []);
    // 같은 장면에 다시 들어온 경우(마지막 선택으로 등) 그 시점 이후 기록은 지움
    const seen = hist.findIndex((e) => e.scene === id);
    if (seen >= 0 && !opts.cont) hist.length = seen;

    const title = sc.title || sc.from || '메시지';
    const instant = !!opts.atChoice;
    const timers = [];
    let alive = true, tapNext = null;
    const pause = (ms) => new Promise((r) => timers.push(setTimeout(r, ms)));

    const bubble = (who, text, prev, anim) => {
      const el = document.createElement('div');
      el.className = `bub ${who === 'me' ? 'me' : 'them'}${anim ? ' pop' : ''}`;
      const showName = sc.group && who !== 'me' && who !== prev;
      if (showName) el.classList.add('named');
      if (text && typeof text === 'object' && 'voice' in text) {   // 음성 메시지
        el.classList.add('vm');
        const bars = Array.from({ length: 26 }, (_, k) => `<i style="--h:${(.25 + .75 * Math.abs(Math.sin(k * 1.7) * Math.cos(k * .55 + 1))).toFixed(2)}"></i>`).join('');
        el.innerHTML = `${showName ? `<small>${esc(who)}</small>` : ''}<span><button class="vm-play" aria-label="재생"><i></i></button><b class="vm-wave">${bars}</b><em class="vm-dur">0:${pad2(Math.round(text.dur || 0))}</em></span>`;
        return el;
      }
      if (text && typeof text === 'object' && text.video) {   // 영상 메시지 (누르면 재생)
        el.classList.add('pic', 'vid');
        el.dataset.video = text.video;
        el.innerHTML = `${showName ? `<small>${esc(who)}</small>` : ''}<span><img src="${text.thumb || ''}" alt=""><i class="vid-play"></i></span>`;
        return el;
      }
      if (text && typeof text === 'object' && text.img) {   // 사진 메시지
        el.classList.add('pic');
        el.innerHTML = `${showName ? `<small>${esc(who)}</small>` : ''}<span><img src="${text.img}" alt=""></span>`;
        return el;
      }
      el.innerHTML = `${showName ? `<small>${esc(who)}</small>` : ''}<span></span>`;
      el.lastChild.textContent = text;
      return el;
    };

    // 영상 메시지 보기: 폰 화면 위에 꽉 차게 재생, 끝나거나 화면을 누르면 닫힘
    let vidsDone = null;
    const leftVids = () => [...pscreen.querySelectorAll('.bub.vid')].filter((b) => b.dataset.scene === id && !b.classList.contains('viewed'));
    const checkVids = () => { if (!leftVids().length && vidsDone) { const f = vidsDone; vidsDone = null; f(); } };
    const openVideo = (b) => {
      clearCtas();
      const ov = document.createElement('div');
      ov.className = 'vviewer';
      ov.innerHTML = `<video playsinline webkit-playsinline src="${b.dataset.video}"></video><button class="vv-x" aria-label="닫기">✕</button>`;
      pscreen.append(ov);
      const v = $('video', ov);
      v.muted = muted;
      v.play().catch(() => { v.muted = true; v.play().catch(() => {}); });
      let closed = false;
      const close = () => {
        if (closed) return; closed = true;
        v.pause(); ov.classList.add('out'); setTimeout(() => ov.remove(), 250);
        b.classList.add('viewed'); checkVids();
        if (leftVids().length) hintLater('영상을 눌러서 확인하세요', 900);
      };
      v.addEventListener('ended', close);
      ov.addEventListener('click', (e) => { e.stopPropagation(); close(); });
    };
    const onVidTap = (e) => {
      const b = e.target.closest('.bub.vid');
      if (b && alive && !e.target.closest('.vviewer')) { e.stopPropagation(); openVideo(b); }
    };
    pscreen.addEventListener('click', onVidTap);

    // 음성 메시지: 재생 버튼을 눌러야 듣고, 다 들으면 다음으로
    const listenVoice = (el, m) => new Promise((done) => {
      const btn = $('.vm-play', el);
      el.classList.add('wait');
      hintLater('▶ 눌러서 듣기', 3000);   // 도착하고 3초 뒤에 안내
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        el.classList.remove('wait'); el.classList.add('playing'); clearCtas();
        const dur = m.dur || 4, bars = [...el.querySelectorAll('.vm-wave i')];
        let audio = null, t0 = performance.now(), r;
        if (m.voice) { audio = new Audio(m.voice); audio.muted = muted; audio.play().catch(() => {}); }
        const tick = () => {
          if (!alive) { audio?.pause(); return done(false); }
          const t = audio && audio.currentTime > 0 ? audio.currentTime : (performance.now() - t0) / 1000;
          const end = audio && isFinite(audio.duration) ? audio.duration : dur;
          const on = Math.floor(Math.min(1, t / end) * bars.length);
          bars.forEach((b, k) => b.classList.toggle('on', k < on));
          const e = currentSub(m.subs, t);
          defaultSub(e ? e[2] : '', e ? e[3] : '');
          if (t >= end || audio?.ended) { el.classList.remove('playing'); setTimeout(() => { defaultSub(''); done(true); }, 700); return; }
          r = requestAnimationFrame(tick);
        };
        tick();
      }, { once: true });
    });

    // 내 메시지: 입력창에 한 글자씩 타이핑 → 전송
    const typeAndSend = async (body, text, prev) => {
      const bar = $('.m-input', pscreen), typed = $('.typed', bar), phEl = $('.ph', bar);
      await pause(350);
      if (!alive) return false;
      phEl.hidden = true; bar.classList.add('active');
      for (let k = 1; k <= text.length; k++) {
        typed.textContent = text.slice(0, k);
        if (text[k - 1] !== ' ') Sound.click();
        await pause(55);
        if (!alive) return false;
      }
      await pause(300);
      if (!alive) return false;
      typed.textContent = ''; phEl.hidden = false; bar.classList.remove('active');
      body.append(bubble('me', text, prev, true));
      body.querySelectorAll('.m-recv').forEach((r) => r.remove());
      body.insertAdjacentHTML('beforeend', '<div class="m-recv">전송됨</div>');
      Sound.send();
      return true;
    };

    const openChat = (anim) => {
      defaultSub('');
      side(sc.group ? 'GROUP CHAT' : 'MESSAGE', title, sc.members || '');
      const initial = sc.icon || [...title][0] || '?';
      pscreen.innerHTML = `
        <div class="v-chat${anim ? ' open' : ''}">
          <div class="m-head">
            <span class="back">${ICON.chev}</span>
            <div class="m-av">${sc.avatar ? `<img src="${sc.avatar}" alt="">` : esc(initial)}</div>
            <div class="m-title">${esc(title)}<i>›</i></div>
            <span class="facetime">${ICON.vidFill}</span>
          </div>
          <div class="m-body"><div class="m-ts"><b>iMessage</b>${esc(sc.time || '오늘')}</div></div>
          <div class="m-input">
            <span class="plus">${ICON.plus}</span>
            <div class="field"><span class="ph">iMessage</span><span class="typed"></span><i class="mic">${ICON.waveform}</i><b class="send">${ICON.up}</b></div>
          </div>
        </div>`;
      const body = $('.m-body', pscreen);
      // 이전 기록 (같은 thread)
      let prev = null;
      const dateRow = (label) => { const d = document.createElement('div'); d.className = 'm-ts m-date'; d.textContent = label; return d; };
      for (const e of hist) {
        if (e.scene && SC[e.scene].dateLabel) { body.append(dateRow(SC[e.scene].dateLabel)); prev = null; }
        const list = e.scene ? SC[e.scene].msgs || [] : [e];
        for (const [who, text] of list) { body.append(bubble(who, text, prev)); prev = who; }
      }
      // 위로 스크롤해서 지난 메시지 볼 수 있게, 새 내용이 생기면 항상 맨 아래로
      const stick = () => { body.scrollTop = body.scrollHeight; };
      new MutationObserver(stick).observe(body, { childList: true });
      if (window.ResizeObserver) new ResizeObserver(stick).observe(body);
      requestAnimationFrame(stick);
      hist.push({ scene: id });
      if (sc.dateLabel) { body.append(dateRow(sc.dateLabel)); prev = null; }
      run(body, prev);
    };

    const run = async (body, prev) => {
      for (const [k, [who, text]] of (sc.msgs || []).entries()) {
        if (!alive) return;
        if (instant || k < (sc.pre || 0)) { body.append(bubble(who, text, prev)); prev = who; continue; }
        if (who === 'me') {
          if (!(await typeAndSend(body, text, prev))) return;
        } else {
          const typing = document.createElement('div');
          typing.className = 'bub them typing pop';
          if (sc.group && who !== prev) typing.classList.add('named');
          typing.innerHTML = `${sc.group && who !== prev ? `<small>${esc(who)}</small>` : ''}<span><i></i><i></i><i></i></span>`;
          body.append(typing);
          await pause(typeof text === 'string' ? Math.min(1700, 500 + text.length * 45) : 1500);
          if (!alive) return;
          typing.remove();
          const bEl = bubble(who, text, prev, true);
          bEl.dataset.scene = id;
          body.append(bEl);
          Sound.pop();   // 대화방 안에서는 짧은 합성음 (receive 파일은 알림 때만)
          if (text && typeof text === 'object' && 'voice' in text) { await pause(400); if (!(await listenVoice(bEl, text))) return; }
        }
        prev = who;
        await pause(380);
      }
      if (!alive) return;

      // 영상 메시지가 있으면 전부 눌러서 본 뒤에 선택지
      const vids = [...body.querySelectorAll('.bub.vid')].filter((b) => b.dataset.scene === id);
      if (vids.some((b) => !b.classList.contains('viewed'))) {
        hintLater('영상을 눌러서 확인하세요', 600);
        await new Promise((ok) => { vidsDone = ok; checkVids(); });
        if (!alive) return;
        await pause(500);
      }

      if (sc.choice) {
        // 선택지 시트가 올라오면 대화창을 그만큼 위로 (마지막 메시지가 가려지지 않게)
        const raise = () => { const v = $('.v-chat', pscreen); if (v) v.style.setProperty('--sheet', `${choicesEl.offsetHeight}px`); };
        requestAnimationFrame(raise); setTimeout(raise, 450);
        openChoice(id, sc.choice, {
          layout: 'side',
          onPick: async (o) => {
            if (o.reply === false) { await pause(550); return; }   // 버튼 그대로 두고 다음 화면으로
            // 메시지를 보내는 선택지: 선택지는 바로 치우고 입력창 타이핑 → 전송부터
            choicesEl.innerHTML = ''; choicesEl.className = '';
            $('.v-chat', pscreen)?.style.removeProperty('--sheet');
            const reply = o.reply ?? o.text;
            if (await typeAndSend(body, reply, prev)) {
              hist.push(['me', reply]);
              await pause(1000);
            }
          },
        });
      } else {
        tapNext = () => go(resolve(sc.next));
        if (sc.auto) timers.push(setTimeout(tapNext, sc.auto));
        else {
          hintLater('TAP ▸ 계속', 0);
          pstage.addEventListener('click', tapNext, { once: true });
        }
      }
    };

    const notify = () => {
      const n = sc.notify === true ? {} : sc.notify;
      const preview = n.text ?? (sc.msgs?.[0] ? `${sc.group ? `${sc.msgs[0][0]}: ` : ''}${sc.msgs[0][1]}` : '');
      const banner = `
        <div class="banner${n.overlay ? ' top' : ''}">
          <div class="b-icon">${ICON.bubble}</div>
          <div class="b-body"><div class="b-row"><b>${esc(n.from || title)}</b><span>지금</span></div>${preview ? `<p>${esc(preview)}</p>` : ''}</div>
        </div>`;
      side('NEW MESSAGE', n.from || title, '<i class="dot"></i>지금');
      if (n.overlay && opts.keepScreen && pscreen.firstElementChild) {
        pscreen.insertAdjacentHTML('beforeend', banner);   // 지금 화면 위로 배너만
      } else {
        pscreen.innerHTML = `
          <div class="v-lock">
            <div class="l-top"><div class="l-lock"><svg viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="10.5" width="14" height="10.5" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" stroke-width="2.2"/></svg></div><div class="l-date">${dateText()}</div><div class="l-clock">${clockText()}</div></div>
            ${banner}
            <div class="l-bottom"><i>${ICON.torch}</i><i>${ICON.camera}</i></div>
            <span class="l-home"></span>
          </div>`;
      }
      timers.push(setTimeout(() => {
        if (!alive) return;
        $('.banner', pscreen).classList.add('in');
        Sound.ding(); vibrate([200, 100, 200]);
        hintLater('알림을 탭하세요', 1200);
      }, sc.notifyDelay ?? (n.overlay ? 300 : 900)));
      pscreen.onclick = () => {
        if (!$('.banner.in', pscreen)) return;
        pscreen.onclick = null; clearCtas();
        openChat(true);
      };
    };

    const contBody = opts.cont && $('.v-chat .m-body', pscreen);
    if (contBody) {
      $('.v-chat', pscreen)?.style.removeProperty('--sheet');   // 앞 장면 선택지 자리만큼 올려둔 것 원위치 (아래가 까맣게 비지 않게)
      // 이어서: 이미 있는 화면에 이번 장면 메시지만 추가
      const last = [...hist].reverse().find(Boolean);
      const lastList = last ? (last.scene ? SC[last.scene].msgs || [] : [last]) : [];
      const prev = lastList.length ? lastList[lastList.length - 1][0] : null;
      hist.push({ scene: id });
      run(contBody, prev);
    } else if (sc.notify && !instant) notify(); else openChat(false);
    cleanup = () => {
      alive = false; timers.forEach(clearTimeout); closeChoice();
      if (tapNext) pstage.removeEventListener('click', tapNext);
      pscreen.removeEventListener('click', onVidTap);
    };
  }

  /* ---------- 전화 걸기 (최근 기록 → 발신 화면) ---------- */
  function showDial(id, sc, opts) {
    const timers = [];
    let alive = true, stopTone = () => {};
    const later = (fn, ms) => timers.push(setTimeout(() => alive && fn(), ms));
    const target = sc.to || '쇼타로';
    const recents = sc.recents || [];
    const say = (t) => { defaultSub(''); void sub.offsetWidth; defaultSub(t, 'think'); };

    const list = () => {
      stage.classList.remove('dial-calling');
      pscreen.innerHTML = `
        <div class="v-recents">
          <div class="rc-top"><span class="rc-edit">편집</span></div>
          <h1>최근 기록</h1>
          <div class="rc-seg"><b>모두</b><span>부재중</span></div>
          <ul class="rc-list">
            ${recents.map((r, k) => `
              <li class="rc-row${r.missed ? ' missed' : ''}" data-k="${k}">
                <span class="rc-av">${esc(r.initial || [...r.name][0])}</span>
                <span class="rc-main"><b>${esc(r.name)}${r.count ? ` (${r.count})` : ''}</b><small>${r.video ? '<i class="rc-vid">' + ICON.vidFill + '</i>FaceTime 비디오' : '휴대전화'}</small></span>
                <span class="rc-time">${esc(r.time || '')}</span>
                <span class="rc-info">i</span>
              </li>`).join('')}
          </ul>
          <nav class="rc-tabs">
            <span><i>★</i>즐겨찾기</span><span class="on"><i>${ICON.clock}</i>최근 기록</span><span><i>${ICON.user}</i>연락처</span><span><i>⠿</i>키패드</span><span><i>${ICON.waveform}</i>음성 사서함</span>
          </nav>
        </div>`;
      if (sc.prompt) later(() => say(sc.prompt), 500);
      if (!sc.noHint) hintLater(`${target}에게 전화를 걸어요`, 2600);
      pscreen.querySelectorAll('.rc-row').forEach((row) => {
        row.onclick = () => {
          const r = recents[+row.dataset.k];
          if (r.name !== target) { say(sc.wrongText || `지금은 ${target}에게 걸어야 해.`); return; }
          clearCtas();
          row.classList.add('tapped');
          later(() => calling(r), 180);
        };
      });
    };

    const calling = (r) => {
      defaultSub('');
      stage.classList.add('dial-calling');
      pscreen.innerHTML = `
        <div class="v-dial">
          <div class="d-head"><small>휴대전화</small><b>${esc(r.name)}</b><span class="d-status">전화 거는 중…</span></div>
          <div class="d-grid">
            <span><b>${ICON.speaker}</b>스피커</span><span><b>${ICON.vidFill}</b>FaceTime</span><span><b>${ICON.micFill}</b>소리 끔</span>
            <span><b>${ICON.plus}</b>통화 추가</span><span class="end"><b>${ICON.phone}</b>종료</span><span><b>⠿</b>키패드</span>
          </div>
        </div>`;
      stopTone = Sound.ringback();
      // [시작초, 끝초, '자막'] 또는 [시작초, '자막']
      (sc.subs || []).forEach((e) => {
        const [t, end, text] = typeof e[1] === 'string' ? [e[0], null, e[1]] : e;
        later(() => say(text), t * 1000);
        if (end != null) later(() => { if (sub.textContent === text) defaultSub(''); }, end * 1000);
      });
      later(() => { stopTone(); go(resolve(sc.next)); }, (sc.callTime ?? 3.2) * 1000);
    };

    if (opts.atChoice) {
      const r = recents.find((x) => x.name === target) || { name: target };
      calling(r);
    } else list();
    cleanup = () => { alive = false; timers.forEach(clearTimeout); stopTone(); stage.classList.remove('dial-calling'); };
  }

  /* 폰 시계 / 날짜 */
  function clockText() {
    if (CFG.phone?.clock) return CFG.phone.clock;
    const d = new Date();
    return `${d.getHours()}:${pad2(d.getMinutes())}`;
  }
  function dateText() {
    if (CFG.phone?.date) return CFG.phone.date;
    const d = new Date();
    return `${d.getMonth() + 1}월 ${d.getDate()}일 ${'일월화수목금토'[d.getDay()]}요일`;
  }
  const updateClock = () => { const c = $('.sbar .clock'); if (c) c.textContent = clockText(); };
  updateClock();
  setInterval(updateClock, 20000);

  /* ---------- 내레이션(검은 화면): 한 줄씩 타이핑 ---------- */
  function showNarration(sc, opts = {}, id) {
    narr.hidden = false;
    narr.innerHTML = `<div class="lines"></div><div class="nsub-wrap"></div>
      <div class="n-cta"><span class="ring"></span><span class="txt">화면을 탭해서 계속</span></div>`;
    const linesEl = $('.lines', narr), subWrap = $('.nsub-wrap', narr), cta = $('.n-cta', narr);
    let i = 0, typing = null, leaving = false, ctaT = null;
    const stopType = () => Sound.stopClicks();

    // 한 줄이 다 나온 뒤 한동안 터치가 없으면 가운데에 탭 유도 표시
    let choiceShown = false;
    const timers = [];
    const armCta = () => {
      clearTimeout(ctaT);
      // 마지막 줄까지 나왔고 선택지가 있으면 → 탭 유도 대신 선택 버튼
      if (sc.choice && i >= sc.lines.length) {
        if (!choiceShown) { choiceShown = true; timers.push(setTimeout(() => openChoice(id, sc.choice), 350)); }
        return;
      }
      ctaT = setTimeout(() => cta.classList.add('show'), sc.ctaDelay ?? 500);
    };
    const lineDone = () => { typing = null; stopType(); armCta(); };
    const finishTyping = () => {
      if (!typing) return false;
      clearInterval(typing.timer);
      typing.el.textContent = typing.text;
      typing.el.classList.remove('typing');
      lineDone();
      return true;
    };
    const next = () => {
      clearTimeout(ctaT); cta.classList.remove('show');
      if (finishTyping()) return;          // 타이핑 중 터치 → 줄 즉시 완성
      if (i >= sc.lines.length && sc.choice) return;   // 선택해야만 넘어감
      if (i >= sc.lines.length) {
        if (!leaving) { leaving = true; go(resolve(sc.next)); }   // 넘어가는 중 연타 무시
        return;
      }
      linesEl.querySelectorAll('.line').forEach((l) => l.classList.add('past'));
      const el = document.createElement('div');
      el.className = 'line typing';
      linesEl.appendChild(el);
      const text = sc.lines[i];
      let n = 0;
      const speed = sc.speed || 45;
      stopType();
      typing = { el, text, timer: setInterval(() => {
        el.textContent = text.slice(0, ++n);
        if (text[n - 1] !== ' ') Sound.click();
        if (n >= text.length) { clearInterval(typing.timer); el.classList.remove('typing'); typing = null; armCta(); }
      }, speed) };
      const s = sc.subs?.[i];
      subWrap.innerHTML = s ? `<div class="nsub">${s}</div>` : '';
      i++;
    };
    next();
    if (opts.atChoice) while (i < sc.lines.length || typing) next(); // 개발용: 전체 줄 미리보기

    const key = (e) => { if (e.key === ' ' || e.key === 'Enter') next(); };
    narr.addEventListener('click', next);
    window.addEventListener('keydown', key);
    const auto = sc.auto ? setInterval(next, sc.auto) : null;
    cleanup = () => {
      clearTimeout(ctaT); stopType(); closeChoice(); timers.forEach(clearTimeout);
      narr.removeEventListener('click', next);
      window.removeEventListener('keydown', key);
      clearInterval(auto);
      if (typing) clearInterval(typing.timer);
    };
  }

  /* ---------- 10초 미션 (혼자 준비한다) ----------
     ① 성냥갑에 성냥 연타(1초 안에 taps번) → 불 ② 불붙은 성냥을 초 심지에 3초 대기(떼면 처음부터) ③ 스위치 내려서 불 끄기 */
  function showMission(id, sc, opts) {
    const my = token, LIMIT = (sc.time || 10) * 1000, TAPS = sc.taps || 6, HOLD = (sc.hold || 3) * 1000;
    state.checkpoint = { id, flags: { ...state.flags }, path: state.path.slice(), threads: JSON.parse(JSON.stringify(state.threads)) };
    Route.snap(id, state.checkpoint);
    video.hidden = true; ph.hidden = true;
    const el = document.createElement('div');
    el.className = 'mission';
    el.innerHTML = `
      <div class="ms-sw"><img class="up" src="${MI}switch_up.jpg" alt=""><img class="down" src="${MI}switch_down.jpg" alt=""></div>
      <i class="ms-pull">↓</i>
      <div class="ms-top">
        <div class="ms-steps"><i class="on"></i><i></i><i></i></div>
        <div class="ms-time"><b>${(LIMIT / 1000).toFixed(1)}</b></div>
        <div class="ms-bar"><s></s></div>
      </div>
      <div class="ms-title"></div>
      <div class="ms-play">
        <img class="ms-box" src="${MI}matchbox.png" alt="">
        <img class="ms-candle off" src="${MI}candle_off.jpg" alt="">
        <img class="ms-candle on" src="${MI}candle_on.jpg" alt="">
        <i class="ms-target"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17"/><circle class="p" cx="20" cy="20" r="17"/></svg></i>
        <div class="ms-stick"><img class="off" src="${MI}stick_off.png" alt=""><img class="on" src="${MI}stick_on.png" alt=""></div>
        <div class="ms-sparks"></div>
        <div class="ms-heat"><s></s></div>
      </div>
      <div class="ms-cta"></div>
      <i class="ms-dark"></i>
      <div class="ms-flash"></div>`;
    stage.append(el);
    noZoom(el);
    const q = (s) => $(s, el);
    const play = q('.ms-play'), stick = q('.ms-stick'), title = q('.ms-title'), cta = q('.ms-cta');
    const timeEl = q('.ms-time b'), bar = q('.ms-bar s'), flash = q('.ms-flash'), heat = q('.ms-heat s');
    const ring = q('.ms-target .p'), RING = 2 * Math.PI * 17;
    ring.style.strokeDasharray = RING; ring.style.strokeDashoffset = RING;
    const cq = () => play.getBoundingClientRect().width / 100;   // 1cqw (놀이판 가로의 1%)
    let step = 0, t0 = 0, raf = 0, over = false, lastSec = 99;
    const timers = [];
    const later = (fn, ms) => timers.push(setTimeout(() => { if (my === token) fn(); }, ms));
    const say = (t, c) => { title.textContent = t; cta.innerHTML = c; cta.classList.remove('in'); void cta.offsetWidth; cta.classList.add('in'); };
    const setStep = (n) => {
      step = n; el.dataset.step = n;
      el.querySelectorAll('.ms-steps i').forEach((d, k) => { d.classList.toggle('on', k <= n - 1); d.classList.toggle('done', k < n - 1); });
    };
    const big = (t, cls = '') => { flash.textContent = t; flash.className = 'ms-flash ' + cls; void flash.offsetWidth; flash.classList.add('show'); };

    // ── 시간
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!t0 || over) return;
      const left = Math.max(0, LIMIT - (performance.now() - t0));
      timeEl.textContent = (left / 1000).toFixed(1);
      bar.style.transform = `scaleX(${left / LIMIT})`;
      const HURRY = Math.min(3000, LIMIT * .35);
      el.classList.toggle('hurry', left < HURRY);
      const sec = Math.ceil(left / 1000);
      if (sec <= HURRY / 1000 && sec !== lastSec && left > 0) { lastSec = sec; Sound.tick(); }
      if (step === 1) {   // 성냥 열기: 최근 1초 동안 친 횟수
        const now = performance.now();
        while (taps.length && now - taps[0] > 1000) taps.shift();
        heat.style.transform = `scaleX(${Math.min(1, taps.length / TAPS)})`;
      }
      if (step === 2) holdTick();
      if (left <= 0) finish(false);
    };
    const finish = (ok) => {
      if (over) return; over = true;
      Route.pick(id, ok ? 0 : 1);
      cta.innerHTML = '';
      if (ok) { Sound.tada(); later(() => go(resolve(sc.success)), 1500); }
      else {
        Sound.buzz(); vibrate([200, 80, 200]);
        el.classList.add('fail'); big('TIME OVER', 'bad');
        later(() => go(resolve(sc.fail)), 1600);
      }
    };

    // ── ① 성냥 긋기
    const taps = [];
    const sparks = q('.ms-sparks');
    const strike = () => {
      Sound.strike(); vibrate(12);
      taps.push(performance.now());
      stick.getAnimations().forEach((a) => a.cancel());
      const c = cq();
      stick.animate({ translate: ['0 0', `${-3.4 * c}px ${-5 * c}px`, `${-3.4 * c}px ${5 * c}px`, '0 0'], offset: [0, .3, .75, 1] },
        { duration: 150, easing: 'ease-out' });
      for (let k = 0; k < 4; k++) {
        const sp = document.createElement('i');
        sp.style.cssText = `--x:${(Math.random() * 2 - 1) * 7}cqw;--y:${-Math.random() * 7}cqw`;
        sparks.append(sp); setTimeout(() => sp.remove(), 450);
      }
      const now = performance.now();
      while (taps.length && now - taps[0] > 1000) taps.shift();
      if (taps.length >= TAPS) {
        step = 1.5; el.classList.add('lit'); Sound.ignite(); vibrate(60);
        heat.style.transform = 'scaleX(1)';
        t0 += 600;   // 넘어가는 연출 시간은 빼 줌
        later(step2, 600);
      }
    };

    // ── ② 초에 불 붙이기 (드래그)
    let drag = null, holdMs = 0, holdLast = 0, near = false;
    const home = () => { stick.style.transition = 'translate .35s cubic-bezier(.3,1.4,.5,1), rotate .3s ease'; stick.style.translate = ''; };
    // 위치는 놀이판 기준 cqw 로 계산 (CSS 와 같은 숫자): 성냥 불꽃 기본 위치 → 끈 만큼 이동, 심지 위치
    // 잡으면 성냥을 손으로 든 것처럼 대각선으로 기울임 — 불꽃을 축으로 돌아서 불붙은 부분은 제자리
    const FLAME = { x: 74.5, y: 59 }, WICK = { x: 51.7, y: 20.2 };
    const candleOn = q('.ms-candle.on');
    function holdTick() {
      const now = performance.now();
      if (drag) {
        const c = cq();
        near = Math.hypot(FLAME.x + drag.dx / c - WICK.x, FLAME.y + drag.dy / c - WICK.y) < 9;
      } else near = false;
      if (near) holdMs += now - (holdLast || now); else holdMs = 0;
      holdLast = now;
      el.classList.toggle('near', near);
      ring.style.strokeDashoffset = RING * (1 - Math.min(1, holdMs / HOLD));
      // 대고 있는 동안 심지에 불이 조금씩 옮겨붙음
      candleOn.style.opacity = near ? (Math.min(1, holdMs / HOLD) * .75 * (.85 + Math.random() * .15)).toFixed(3) : '';
      if (holdMs >= HOLD) {
        step = 2.5; el.classList.add('candle-lit'); Sound.ignite(); vibrate(60);
        candleOn.style.opacity = '';
        drag = null; el.classList.remove('near', 'held');
        t0 += 600;
        later(step3, 600);
      }
    }
    function step2() {
      setStep(2);
      say('2단계 · 초에 불을 붙여주세요!', `불붙은 성냥을 끌어다 <b>심지에 ${HOLD / 1000}초간</b> 대고 있어요`);
    }

    // ── ③ 불 끄기 (스위치 내리기)
    let pull = null;
    function step3() {
      setStep(3);
      say('3단계 · 불을 꺼주세요!', '스위치를 잡고 <b>아래로 쭉</b> 내려요');
      // 화면을 꽉 채운 스위치 사진(cover)에서 스위치 손잡이 위치 → 화살표
      const r = el.getBoundingClientRect(), k = Math.max(r.width / 452, r.height / 602);
      const ox = (r.width - 452 * k) / 2, oy = (r.height - 602 * k) / 2;
      const pull = q('.ms-pull');
      pull.style.left = `${ox + .545 * 452 * k + 14}px`; pull.style.top = `${oy + .48 * 602 * k}px`;
    }
    const lightsOff = () => {
      step = 3.5; el.classList.add('off'); Sound.flick(); vibrate(30);
      finish(true);
      later(() => { el.classList.add('dark'); big('준비 완료!', 'good'); }, 450);
    };

    // ── 입력
    el.addEventListener('pointerdown', (e) => {
      if (over || !t0) return;
      e.preventDefault();
      if (step === 1) strike();
      else if (step === 2) {
        drag = { x: e.clientX, y: e.clientY, dx: 0, dy: 0 }; holdMs = 0; holdLast = performance.now();
        stick.style.transition = 'rotate .2s ease'; stick.getAnimations().forEach((a) => a.cancel());
        el.classList.add('held');
        try { el.setPointerCapture(e.pointerId); } catch {}
      } else if (step === 3) {
        pull = { y: e.clientY };
        try { el.setPointerCapture(e.pointerId); } catch {}
      }
    });
    el.addEventListener('pointermove', (e) => {
      if (step === 2 && drag) {
        drag.dx = e.clientX - drag.x; drag.dy = e.clientY - drag.y;
        stick.style.translate = `${drag.dx}px ${drag.dy}px`;
      }
      if (step === 3 && pull) {
        const dy = Math.max(0, e.clientY - pull.y);
        q('.ms-pull').style.setProperty('--dy', Math.min(dy, cq() * 10) + 'px');
        if (dy > cq() * 6) { pull = null; lightsOff(); }
      }
    });
    const up = () => {
      if (step === 2 && drag) { drag = null; holdMs = 0; el.classList.remove('held', 'near'); candleOn.style.opacity = ''; home(); }
      if (step === 3) { pull = null; q('.ms-pull').style.removeProperty('--dy'); }
    };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);

    // ── 시작
    setStep(1);
    say('1단계 · 성냥에 불을 붙여주세요!', '성냥을 <b>빠르게 연타</b>해서 불을 붙여요!');
    big('START!');
    later(() => { t0 = performance.now(); }, opts.atChoice ? 500 : 900);
    loop();
    cleanup = () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); };
  }

  /* ---------- 엔딩 ---------- */
  function showEnding(id, sc, opts = {}) {
    const good = sc.kind === 'good';   // 엔딩 종류: 'good' 이 아니면 배드 엔딩
    const unlocked = new Set(store.get(ENDINGS_KEY, []));
    unlocked.add(id);
    store.set(ENDINGS_KEY, [...unlocked]);

    const P = makePlayer(sc, { loop: !sc.src });
    let raf;
    const frame = () => { raf = requestAnimationFrame(frame); P.tick(); };
    frame();

    const v = sc.voice;
    const vAvatar = v ? (v.avatar ? `<img src="${v.avatar}" alt="">` : esc(v.initial || [...v.name][0])) : '';
    // 음성 메시지 파형: 처음엔 임시 모양, 음성 파일을 분석해서 실제 파형으로 교체
    const NBARS = 46;
    const bars = Array.from({ length: NBARS }, (_, k) => {
      const env = Math.sin(Math.PI * (k + .5) / NBARS) ** .6;            // 가운데가 큰 말소리 모양
      const jitter = .45 + .55 * Math.abs(Math.sin(k * 2.3) * Math.cos(k * .7 + 1));
      return `<i style="--h:${Math.max(.12, env * jitter).toFixed(2)}"></i>`;
    }).join('');

    let voiceStop = () => {};
    // 그림을 먼저 준비(디코딩)해 두고 카드를 한 번에 표시
    const artSrc = sc.polaroid || `media/images/end_${good ? 'good' : 'bad'}.png`;
    const artCls = sc.polaroid ? 'polaroid' : good ? 'good' : 'bad';
    const artImg = new Image(); artImg.src = artSrc;
    const artReady = Promise.race([artImg.decode?.().catch(() => {}) ?? Promise.resolve(), wait(1500)]);
    const showCard = async () => {
      await artReady;
      if (!endingEl.isConnected || currentId !== id) return;
      if (introT) { clearTimeout(introT); introT = null; }
      const keepFx = $('.end-fx', endingEl);   // 폴라로이드 화면에서 돌던 컨페티는 끊기지 않게 그대로
      endingEl.innerHTML = `
        <div class="end-card">
          <div class="end-head">
            <img class="end-art ${artCls}" src="${artSrc}" alt="${good ? 'GOOD END' : 'BAD END'}">
            <span class="end-kind ${good ? 'good' : 'bad'}">${good ? 'GOOD ENDING' : 'BAD ENDING'}</span>
            <span class="end-count">ENDING ${pad2(ENDING_IDS.indexOf(id) + 1)} / ${pad2(ENDING_IDS.length)}</span>
          </div>
          <div class="end-main">
            <h1><i></i><span>${esc(sc.title)}</span><i></i></h1>
            <p class="end-desc">${esc(sc.desc || '').replace(/\n/g, '<br>')}</p>
          </div>
          <div class="end-actions">
            ${v ? `<button class="voice-pill" data-act="voice">
                <span class="vp-av">${vAvatar}</span>
                <span class="vp-ic">${ICON.sound}</span>${esc(v.label || '남겨진 한마디')}
              </button>` : ''}
            <div class="end-btns">
              <button class="btn" data-act="restart">${ICON.replay}다시 하기</button>
              <button class="btn ghost" data-act="share">${ICON.share}이 엔딩 공유하기</button>
            </div>
          </div>
          ${v ? `
          <div class="voice-panel">
            <div class="vc-person"><div class="vc-av">${vAvatar}</div><span>${esc(v.name)}</span></div>
            <div class="vc-bubble">
              <div class="vc-player">
                <button class="vc-btn" data-act="replay" aria-label="다시 듣기"><i></i></button>
                <div class="wave">${bars}</div>
                <span class="vc-dur">0:00</span>
              </div>
              <div class="vc-sub"></div>
            </div>
          </div>
          <button class="vc-stop" data-act="stop"><b>»</b>그만 듣기</button>` : ''}
        </div>`;
      const card = $('.end-card', endingEl);
      // 굿 엔딩: 컨페티 / 배드 엔딩: 눈물이 뚝뚝
      const fx = keepFx || document.createElement(good ? 'canvas' : 'div');
      fx.className = 'end-fx';
      endingEl.prepend(fx);
      if (good && !keepFx) Confetti.start(fx);
      else fx.innerHTML = Array.from({ length: 14 }, (_, k) => {
        // 😢 는 글자를 가리지 않게 양옆으로, 작은 💧 는 어디든
        const face = k % 2 === 0;
        const x = face ? (Math.random() < .5 ? Math.random() * 16 : 80 + Math.random() * 16) : Math.random() * 96;
        return `<i class="${face ? '' : 'drop'}" style="left:${x.toFixed(1)}%;--d:${(3.4 + Math.random() * 2.6).toFixed(2)}s;--w:${(-Math.random() * 6).toFixed(2)}s;--s:${(0.8 + Math.random() * .5).toFixed(2)}">${face ? '😢' : '💧'}</i>`;
      }).join('');

      const barEls = [...card.querySelectorAll('.wave i')];
      const durEl = $('.vc-dur', card);
      const fmt = (s) => `${Math.floor(s / 60)}:${pad2(Math.floor(s % 60))}`;
      let total = v.duration || 0;
      if (v.src) {
        voicePeaks(v.src, NBARS).then((p) => {
          if (!p) return;
          p.peaks.forEach((h, k) => barEls[k]?.style.setProperty('--h', h.toFixed(2)));
          total = p.duration; durEl.textContent = fmt(total);
        });
      }
      durEl.textContent = fmt(total);

      const playVoice = () => {
        voiceStop();
        const subEl = $('.vc-sub', card), panel = $('.voice-panel', card);
        let audio = null, t0 = performance.now(), vraf;
        if (v.src) { audio = new Audio(v.src); audio.muted = muted; audio.play().catch(() => {}); }
        panel.classList.add('playing');
        const tick = () => {
          const t = audio ? audio.currentTime : (performance.now() - t0) / 1000;
          const d = (audio && isFinite(audio.duration) ? audio.duration : total) || 1;
          const e = currentSub(v.subs, t);
          if (e && subEl.textContent !== e[2]) { subEl.textContent = e[2]; subEl.classList.remove('in'); void subEl.offsetWidth; subEl.classList.add('in'); }
          // 재생된 만큼 파형 채우기 + 재생 위치 근처 막대는 살짝 출렁
          const at = (t / d) * barEls.length;
          barEls.forEach((b, k) => { b.classList.toggle('played', k < at); b.classList.toggle('hot', Math.abs(k - at) < 1.6); });
          durEl.textContent = fmt(Math.min(t, d));
          const done = audio ? audio.ended : t >= d;
          if (done) {   // 끝나도 마지막 자막은 남김
            panel.classList.remove('playing');
            barEls.forEach((b) => b.classList.remove('hot'));
            durEl.textContent = fmt(d);
            return;
          }
          vraf = requestAnimationFrame(tick);
        };
        tick();
        voiceStop = () => { cancelAnimationFrame(vraf); audio?.pause(); panel.classList.remove('playing'); barEls.forEach((b) => b.classList.remove('hot')); };
      };

      endingEl.onclick = (e) => {
        const act = e.target.closest('[data-act]')?.dataset.act;
        if (act === 'restart') { voiceStop(); go('@route'); }
        if (act === 'share') shareEnding(sc, id);
        if (act === 'voice') { card.classList.add('listening'); $('.vc-sub', card).textContent = ''; playVoice(); }
        if (act === 'replay') playVoice();
        if (act === 'stop') { voiceStop(); card.classList.remove('listening'); }
      };
      if (opts.atChoice && v) $('[data-act="voice"]', card).click();   // 개발용: 듣기 화면 바로 보기
    };

    endingEl.hidden = false;
    // 영상이 있으면 cardAt초(기본: 영상 끝)에 카드 표시
    let cardTimer, introT = null;
    if (sc.polaroid && !opts.atChoice) {
      // 찰칵! → 폴라로이드가 천천히 나오며 현상 → 엔딩 카드
      // 엔딩 배경·컨페티 그대로 두고, 빈 폴라로이드 필름에 사진이 천천히 드러남
      endingEl.innerHTML = `<canvas class="end-fx"></canvas><div class="pola-intro"><i class="pi-flash"></i>
        <div class="pi-photo"><img src="${sc.polaroid}" alt=""><i class="pi-dev"></i></div></div>`;
      if (good) Confetti.start($('.end-fx', endingEl));
      Sound.shutter(); vibrate(40);
      const intro = $('.pola-intro', endingEl);
      introT = setTimeout(() => { intro.classList.add('leave'); introT = setTimeout(showCard, 450); }, 5600);
      intro.onclick = () => { if (!introT) return; clearTimeout(introT); intro.classList.add('leave'); introT = setTimeout(showCard, 300); };
    } else if (sc.src) {
      const check = () => {
        const at = sc.cardAt ?? P.end();
        if (P.time() >= at || P.ended()) showCard(); else cardTimer = setTimeout(check, 200);
      };
      check();
    } else {
      cardTimer = setTimeout(showCard, 500);
    }
    cleanup = () => { cancelAnimationFrame(raf); clearTimeout(cardTimer); clearTimeout(introT); P.stop(); voiceStop(); endingEl.onclick = null; };
  }

  // 음성 파일을 분석해 막대 높이(소리 크기) 계산
  async function voicePeaks(src, n) {
    try {
      const buf = await (await fetch(src)).arrayBuffer();
      const C = window.AudioContext || window.webkitAudioContext;
      const ac = new C();
      const data = await ac.decodeAudioData(buf);
      ac.close?.();
      const ch = data.getChannelData(0), size = Math.floor(ch.length / n);
      const rms = Array.from({ length: n }, (_, i) => {
        let sum = 0, cnt = 0;
        for (let j = i * size; j < (i + 1) * size; j += 16) { sum += ch[j] * ch[j]; cnt++; }
        return Math.sqrt(sum / Math.max(1, cnt));
      });
      const max = Math.max(...rms) || 1;
      return { peaks: rms.map((r) => Math.max(.1, (r / max) ** .7)), duration: data.duration };
    } catch { return null; }
  }

  // 엔딩 공유: X(트위터) 글쓰기 화면을 문구가 채워진 상태로 열기 → '게시하기'만 누르면 됨
  // 링크는 엔딩별 페이지(e/<id>.html) → X가 그 엔딩 전용 미리보기 이미지를 붙임, 누르면 게임으로 이동
  const SITE = 'https://sho-priize.github.io';
  function shareEnding(sc, id) {
    const got = ENDING_IDS.filter((e) => new Set(store.get(ENDINGS_KEY, [])).has(e)).length;
    const kind = sc.kind === 'good' ? '🎉 GOOD ENDING' : '😢 BAD ENDING';
    const text = `${kind} : ${sc.title}\n현재까지 ${got}/${ENDING_IDS.length}개 엔딩 수집!\n라이즈와 함께 쇼타로의 생일파티 준비하기⬇️⬇️\n${SITE}/e/${id}.html`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    const w = window.open(url, '_blank');
    if (!w) location.href = url;   // 새 창이 막히면(인앱 브라우저 등) 지금 창에서
  }

  function toast(msg) {
    $('.toast', stage)?.remove();
    const el = document.createElement('div');
    el.className = 'toast'; el.textContent = msg;
    stage.appendChild(el);
    setTimeout(() => el.remove(), 2400);
  }

  /* ---------- 스토리 루트 (세이브포인트) ----------
     선택지가 나온 순간의 상태를 저장해 두고, 루트 화면에서 그 지점으로 바로 돌아감.
     간 길 / 안 간 길 / 아직 못 본 노드를 구분해서 보여줌. */
  const ROUTE_KEY = 'hbd.route';
  const Route = {
    data: (() => { const d = store.get(ROUTE_KEY, {}); return { snaps: d.snaps || {}, picks: d.picks || {} }; })(),
    save() { store.set(ROUTE_KEY, this.data); },
    snap(id, cp) { this.data.snaps[id] = cp; this.save(); },
    pick(id, i) { const a = (this.data.picks[id] ||= []); if (!a.includes(i)) { a.push(i); this.save(); } },
    picked(id) { return this.data.picks[id] || []; },
    any() { return Object.keys(this.data.snaps).length > 0; },
  };

  // 다음 장면을 따라가서 처음 만나는 "선택지 장면 / 엔딩 / 끝(준비 중)"을 찾음
  function followRoute(next) {
    let id = next;
    const seen = new Set();
    while (typeof id === 'string' && SC[id] && !seen.has(id)) {
      seen.add(id);
      const sc = SC[id];
      // 루트에는 고를 게 2개 이상인 선택지만 (버튼 하나짜리는 건너뜀)
      if ((sc.choice && sc.choice.options.length >= 2) || sc.mash || sc.urgent || sc.type === 'mission') return { kind: 'choice', id };
      if (sc.type === 'ending') return { kind: 'ending', id };
      id = sc.choice ? sc.choice.options[0].next : sc.answer || sc.next;
    }
    return { kind: 'open' };
  }

  // 루트에서 갈라지는 길: 선택지, 또는 연타 이벤트(성공/실패)
  const routeOptions = (sc) => sc.choice ? sc.choice.options
    : sc.type === 'mission' ? [{ text: '미션 성공', next: sc.success }, { text: '미션 실패', next: sc.fail }]
    : sc.urgent ? [{ text: '답장 성공', next: sc.urgent.success }, { text: '답장 실패', next: sc.urgent.fail }]
    : [{ text: '연타 성공', next: sc.mash.success }, { text: '연타 실패', next: sc.mash.fail }];

  function routeGraph() {
    const nodes = [], edges = [], byKey = new Map();
    const add = (n) => { nodes.push(n); byKey.set(n.key, n); return n; };
    const make = (target, depth, parentKey, edgeKey) => {
      const key = target.kind === 'open' ? `open:${edgeKey}` : target.id;
      if (byKey.has(key)) {
        const ex = byKey.get(key);
        // 위쪽(앞쪽)에 이미 있는 지점으로 되돌아가는 길: 선을 거꾸로 긋지 않고 '↩ 그 지점' 작은 칸
        if (ex.depth < depth) return add({ key: `back:${edgeKey}`, kind: 'back', id: ex.id, depth, parentKey, children: [] });
        return ex;   // 여러 길이 같은 장면으로 모이는 경우
      }
      const n = add({ key, kind: target.kind, id: target.id, depth, parentKey, children: [] });
      if (target.kind === 'choice') {
        const picked = Route.picked(target.id);
        routeOptions(SC[target.id]).forEach((o, i) => {
          // 아직 안 고른 선택지는 어디로 이어지는지 숨김 (엔딩 스포 방지) → '?' 칸만
          const child = picked.includes(i)
            ? make(followRoute(o.next), depth + 1, key, `${key}#${i}`)
            : make({ kind: 'open' }, depth + 1, key, `${key}#${i}`);
          n.children.push(child);
          edges.push({ from: n, to: child, label: o.text, scene: target.id, opt: i });
        });
      }
      return n;
    };
    const root = add({ key: 'start', kind: 'start', depth: 0, children: [] });
    const first = make(followRoute(CFG.start), 1, 'start', 'start');
    root.children.push(first);
    edges.push({ from: root, to: first, label: null });

    // 가로 배치: 잎 노드를 왼쪽부터 나란히, 부모는 자식들의 가운데 (깊이는 위→아래)
    const SLOT = { card: 42, small: 22 };   // cqw
    let cursor = 0;
    const place = (n) => {
      const own = n.children.filter((c) => c.parentKey === n.key);
      own.forEach(place);
      n.size = n.kind === 'open' || n.kind === 'back' ? 'small' : 'card';
      n.slot = SLOT[n.size];
      if (own.length) n.x = (own[0].x + own[own.length - 1].x) / 2;
      else { n.x = cursor + SLOT[n.size] / 2; cursor += SLOT[n.size]; }
    };
    place(root);
    return { nodes, edges, width: cursor, depth: Math.max(...nodes.map((n) => n.depth)) };
  }

  function showRoute() {
    teardown();
    currentId = null;
    stage.dataset.type = 'route';
    stage.classList.remove('phone-mode');
    pstage.hidden = true;
    video.hidden = true; ph.hidden = true;
    routeEl.hidden = false;

    const { nodes, edges, width, depth } = routeGraph();
    const unlocked = new Set(store.get(ENDINGS_KEY, []));
    const snaps = Route.data.snaps;
    const DY = 46, PAD_X = 6, PAD_Y = 6;   // cqw (화면 너비 기준)
    const W = Math.max(100, width + PAD_X * 2), H = PAD_Y * 2 + depth * DY + 32;
    const shift = (W - width) / 2;   // 좁으면 가운데 정렬
    nodes.forEach((n) => { n.x += shift; n.cy = PAD_Y + n.depth * DY + 15; });

    const reached = (n) => n.kind === 'start' || (n.kind === 'choice' && !!snaps[n.id]) || (n.kind === 'ending' && unlocked.has(n.id));
    const taken = (e) => (e.scene ? Route.picked(e.scene).includes(e.opt) : reached(e.to));
    const halfH = (n) => (n.size === 'small' ? 8 : 15);   // 노드 위아래 반 높이 (cqw)
    const cx = (n) => n.x;

    // 선: 부모 아래 → 자식 위 (간 길: 강조 / 안 간 길: 흐린 점선)
    // 합류하는 선(여러 층을 건너뛰는 선)은 중간 카드 옆으로 돌아가는 길(lane)로
    const LANE = 25;
    const laneX = (e) => e.from.x + (Math.sign(e.to.x - e.from.x) || -1) * LANE;
    const paths = edges.map((e) => {
      const x1 = e.from.x, y1 = e.from.cy + halfH(e.from);
      const x2 = e.to.x, y2 = e.to.cy - halfH(e.to);
      const tree = e.to.parentKey === e.from.key;
      if (tree || e.to.depth - e.from.depth <= 1) {
        const ym = y1 + (y2 - y1) * .5;
        return `<path class="${taken(e) ? 'on' : ''}" d="M${x1},${y1} C${x1},${ym} ${x2},${ym} ${x2},${y2}"/>`;
      }
      const lx = laneX(e);
      return `<path class="${taken(e) ? 'on' : ''}" d="M${x1},${y1} C${x1},${y1 + 8} ${lx},${y1 + 4} ${lx},${y1 + 14} L${lx},${y2 - 14} C${lx},${y2 - 4} ${x2},${y2 - 8} ${x2},${y2}"/>`;
    }).join('');

    // 선택지 이름 (부모 지점에 도달했을 때만 공개)
    // - 나무 가지(자식이 처음 생긴 길): 자식 바로 위
    // - 다른 길이 합류하는 선: 선의 가운데 (같은 자리에 겹치지 않게)
    const chips = edges.filter((e) => e.label).map((e) => {
      const tree = e.to.parentKey === e.from.key;
      const twins = edges.filter((o) => o.label && o.from === e.from && o.to === e.to);
      const ti = twins.indexOf(e), tn = twins.length;
      // 합류하는 선은 옆으로 돌아가는 길 바깥쪽 가운데 / 같은 곳으로 가는 선택지가 여럿이면 나란히
      const x = tree ? e.to.x + (tn > 1 ? (ti - (tn - 1) / 2) * (e.to.slot / tn) : 0) : laneX(e);
      // 가지 이름표는 아래쪽 끝을 자식 칸 바로 위에 붙임 → 줄이 늘어도 위로만 커져서 칸과 안 겹침
      const y = tree ? e.to.cy - halfH(e.to) - 1.5 : (e.from.cy + e.to.cy) / 2;
      const open = reached(e.from);
      const mw = tree ? (tn > 1 ? e.to.slot / tn - 1.5 : e.to.slot - 1) : 30;
      return `<span class="r-chip ${taken(e) ? 'on' : ''}${tree ? ' tree' : ' merge'}" style="left:${x.toFixed(2)}cqw;top:${y.toFixed(2)}cqw;--mw:${mw.toFixed(1)}cqw">${open ? esc(e.label) : '?'}</span>`;
    }).join('');

    const cards = nodes.map((n) => {
      const ok = reached(n);
      const sc = SC[n.id] || {};
      const style = `left:${n.x.toFixed(2)}cqw;top:${n.cy.toFixed(2)}cqw`;
      if (n.kind === 'back') {
        const via = edges.find((e) => e.to === n);
        const got = via && taken(via);
        const tt = SC[n.id]?.route?.title || n.id;
        return `<div class="r-node small back ${got ? 'reached' : ''}" style="${style}"><i>↩</i><span>${got ? esc(tt) : ''}</span></div>`;
      }
      if (n.kind === 'open') {
        const via = edges.find((e) => e.to === n);
        const got = via && taken(via);
        return `<div class="r-node small ${got ? 'reached' : ''}" style="${style}"><i>${got ? '…' : '?'}</i><span>${got ? '준비 중' : ''}</span></div>`;
      }
      const info = n.kind === 'start' ? CFG.routeStart || {} : sc.route || {};
      const title = n.kind === 'ending' ? sc.title : info.title || n.id;
      const thumb = info.thumb ? `style="background-image:url('${info.thumb}')"` : '';
      return `<button class="r-node card ${n.kind} ${ok ? 'reached' : 'locked'}" data-key="${n.key}" style="${style}" ${ok ? '' : 'disabled'}>
          <span class="r-thumb" ${thumb}>${ok ? '<i class="r-play"></i>' : '<i class="r-lock">?</i>'}</span>
          <span class="r-label">${n.kind === 'ending' ? '<em>END</em>' : ''}${ok ? esc(title) : '???'}</span>
        </button>`;
    }).join('');

    // 진행도: 고른 선택지 수 + 본 엔딩 수
    const totalOpts = edges.filter((e) => e.scene).length;
    const gotOpts = edges.filter((e) => e.scene && taken(e)).length;
    const gotEnd = ENDING_IDS.filter((e) => unlocked.has(e)).length;
    const pct = Math.round(((gotOpts + gotEnd) / Math.max(1, totalOpts + ENDING_IDS.length)) * 100);

    routeEl.innerHTML = `
      <div class="r-top">
        <div><div class="r-kicker">STORY ROUTE</div><h2>${esc(CFG.title)}</h2></div>
        <div class="r-stats"><span>엔딩 <b>${gotEnd}/${ENDING_IDS.length}</b></span><span>선택지 <b>${gotOpts}/${totalOpts}</b></span></div>
      </div>
      <div class="r-map"><div class="r-canvas" style="width:${W}cqw;height:${H}cqw">
        <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${paths}</svg>${chips}${cards}
      </div>
        <button class="r-pan l" data-pan="l" aria-label="왼쪽">‹</button>
        <button class="r-pan r" data-pan="r" aria-label="오른쪽">›</button>
        <button class="r-pan u" data-pan="u" aria-label="위">‹</button>
        <button class="r-pan d" data-pan="d" aria-label="아래">›</button>
      </div>
      <div class="r-bottom">
        <div class="r-progress"><span>진행도 <b>${pct}%</b></span><i><s style="width:${pct}%"></s></i></div>
        <div class="r-hint">▶ 표시된 지점을 누르면 그 선택지부터 다시 할 수 있어요</div>
        <div class="rt-btns">
          <button class="btn ghost" data-act="title">타이틀로</button>
          <button class="btn" data-act="restart">처음부터</button>
        </div>
      </div>`;

    // 끌어서 지도 이동 (회전된 화면에서도 방향이 맞도록 직접 처리)
    const map = $('.r-map', routeEl), canvas = $('.r-canvas', routeEl);
    let ox = 0, oy = 0, drag = null, moved = false;
    const clamp = () => {
      const mw = map.offsetWidth, mh = map.offsetHeight, cw = canvas.offsetWidth, ch = canvas.offsetHeight;
      ox = cw <= mw ? (mw - cw) / 2 : Math.min(0, Math.max(mw - cw, ox));
      oy = ch <= mh ? (mh - ch) / 2 : Math.min(0, Math.max(mh - ch, oy));
      canvas.style.transform = `translate(${ox}px, ${oy}px)`;
      // 더 갈 수 있는 방향에만 이동 버튼 표시 (밀기가 막힌 브라우저 대비)
      map.classList.toggle('can-l', ox < -1);
      map.classList.toggle('can-r', ox > mw - cw + 1);
      map.classList.toggle('can-u', oy < -1);
      map.classList.toggle('can-d', oy > mh - ch + 1);
    };
    map.addEventListener('pointerdown', (e) => {
      moved = false;   // 새 터치가 시작되면 직전 끌기 기록은 리셋 (끈 직후 첫 탭이 무시되지 않게)
      if (e.target.closest('.r-pan')) return;
      canvas.classList.remove('anim');
      drag = { x: e.clientX, y: e.clientY, ox, oy }; moved = false;
    });
    map.addEventListener('pointermove', (e) => {
      if (!drag) return;
      let dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
      ox = drag.ox + dx; oy = drag.oy + dy; clamp();
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((t) => map.addEventListener(t, () => { drag = null; }));
    map.addEventListener('wheel', (e) => { ox -= e.deltaX || (e.shiftKey ? e.deltaY : 0); oy -= e.shiftKey ? 0 : e.deltaY; clamp(); e.preventDefault(); }, { passive: false });
    // 처음엔 가장 오른쪽에 도달한 지점이 보이게
    requestAnimationFrame(() => {
      // 가장 깊이 도달한 지점이 화면 가운데쯤 오게
      const last = nodes.filter(reached).sort((a, b) => b.cy - a.cy)[0];
      const unit = stage.offsetWidth / 100;
      ox = map.offsetWidth / 2 - (last ? last.x * unit : 0);
      oy = map.offsetHeight * .4 - (last ? last.cy * unit : 0);
      clamp();
    });

    routeEl.onclick = (e) => {
      if (moved) { moved = false; return; }
      const pan = e.target.closest('[data-pan]')?.dataset.pan;
      if (pan) {
        canvas.classList.add('anim');
        const sx = map.offsetWidth * .55, sy = map.offsetHeight * .55;
        if (pan === 'l') ox += sx; if (pan === 'r') ox -= sx; if (pan === 'u') oy += sy; if (pan === 'd') oy -= sy;
        clamp(); return;
      }
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (act === 'title') return go('@title');
      if (act === 'restart') { state = freshState(); return go(CFG.start); }
      const key = e.target.closest('.r-node.reached')?.dataset.key;
      if (!key) return;
      const n = nodes.find((x) => x.key === key);
      primeVideo(n.kind === 'start' ? CFG.start : n.id, n.kind === 'choice');
      if (n.kind === 'start') { state = freshState(); go(CFG.start); }
      else if (n.kind === 'ending') go(n.id);
      else if (n.kind === 'choice') jumpTo(n.id);
    };
    // 다시 들어갈 수 있는 지점의 영상을 미리 받아 둠 (누르면 바로 시작되게)
    nodes.filter(reached).filter((n) => SC[n.id]?.src).slice(-4).forEach((n) => [].concat(SC[n.id].src).forEach(Preload.add));
    Dev.update('(route)');
  }

  // 터치한 그 순간에 영상을 먼저 재생시켜 둠 (화면 전환 뒤 재생하면 폰에서 막히는 경우가 있어서)
  function primeVideo(id, atChoice) {
    const sc = SC[id];
    if (!sc?.src || sc.type !== 'clip') return;
    const src = [].concat(sc.src)[0];
    Preload.focus();
    if (video.getAttribute('src') !== Preload.url(src)) video.src = Preload.url(src);
    video.muted = muted;
    if (atChoice && sc.choice) { const t = sc.choice.at; try { video.currentTime = typeof t === 'number' ? t : 0; } catch {} }
    video.play().catch(() => {});
    mediaUnlocked = true;
  }

  // 세이브포인트로 이동: 그 선택지가 이미 떠 있는 상태로 시작
  function jumpTo(id) {
    const cp = Route.data.snaps[id];
    if (!cp) return;
    state = { flags: { ...cp.flags }, path: cp.path.slice(), threads: JSON.parse(JSON.stringify(cp.threads || {})), checkpoint: null };
    go(id, { atChoice: true });
  }

  /* ---------- 타이틀 ---------- */
  function showTitle() {
    teardown();
    currentId = null;
    stage.dataset.type = 'title';
    stage.classList.remove('phone-mode');
    pstage.hidden = true;
    video.hidden = true; ph.hidden = true;
    titleEl.hidden = false;
    const got = store.get(ENDINGS_KEY, []).filter((e) => ENDING_IDS.includes(e)).length;
    titleEl.innerHTML = `
      <canvas class="confetti"></canvas>
      <div class="t-left">
        <div class="t-kicker">${CFG.kicker || ''}</div>
        <h1 class="t-logo">${CFG.title}</h1>
        <div class="t-tag">${esc(CFG.tagline || '').replace(/\n/g, '<br>')}</div>
        <div class="t-menu">
          <button class="btn" id="btn-start">▶ 시작하기</button>
          ${Route.any() ? '<button class="btn ghost" id="btn-route">스토리 루트</button>' : ''}
          <span class="t-count">ENDINGS ${got}/${ENDING_IDS.length}</span>
        </div>
      </div>
      <div class="t-right">${titleMedia()}</div>`;
    $('#btn-start').onclick = start;
    const rb = $('#btn-route'); if (rb) rb.onclick = () => { Sound.unlock(); go('@route'); };
    Confetti.start($('.confetti', titleEl));
    Preload.ahead(CFG.start); [].concat(SC[CFG.start]?.src || []).forEach(Preload.add);
    Dev.update('(title)');
  }

  function titleMedia() {
    const m = CFG.titleMedia;
    if (!m) return '<div class="ph-label">타이틀 이미지 / 영상 자리</div>';
    return /\.(png|jpe?g|webp|gif)$/i.test(m)
      ? `<img class="t-media" src="${m}" alt="" onload="this.classList.add('ready')">`
      : `<video class="t-media" src="${m}" muted loop autoplay playsinline webkit-playsinline onplaying="this.classList.add('ready')"></video>`;
  }

  /* ---------- 미리 불러오기: 다음에 나올 영상·이미지를 미리 받아 둠 ---------- */
  const Preload = (() => {
    // 영상은 통째로 받아서 메모리(blob)에 넣어 둠 → 그 장면이 오면 네트워크 기다림 없이 바로 재생 (아이폰 포함)
    const blobs = new Map();      // 원래 주소 → blob 주소 (또는 받는 중이면 Promise)
    const ctls = new Map();       // 받는 중인 것 → 취소용
    const order = [];
    const MAX = 7;                // 동시에 들고 있을 영상 수
    const imgs = new Set();
    const isVideo = (u) => /\.(mp4|mov|m4v|webm)(\?|$)/i.test(u);
    const add = (url) => {
      if (!url) return;
      if (/\.(jpe?g|png|webp|gif)$/i.test(url)) { if (!imgs.has(url)) { imgs.add(url); new Image().src = url; } return; }
      if (!isVideo(url) || blobs.has(url)) return;
      const ctl = new AbortController();
      const job = fetch(url, { signal: ctl.signal }).then((r) => { if (!r.ok) throw 0; return r.blob(); })
        .then((b) => { const u = URL.createObjectURL(b); blobs.set(url, u); ctls.delete(url); return u; })
        .catch(() => { blobs.delete(url); ctls.delete(url); const i = order.indexOf(url); if (i >= 0) order.splice(i, 1); });
      blobs.set(url, job); ctls.set(url, ctl);
      order.push(url);
      while (order.length > MAX) {
        const old = order.shift(), v = blobs.get(old);
        if (typeof v === 'string' && video.getAttribute('src') !== v) URL.revokeObjectURL(v);
        if (video.getAttribute('src') !== v) blobs.delete(old); else order.push(old);
        if (order.length <= MAX) break;
      }
    };
    const mediaOf = (sc) => [...[].concat(sc.src || []), sc.avatar, sc.voice?.src, sc.voice?.avatar, sc.route?.thumb, sc.polaroid,
      ...(sc.type === 'mission' ? MISSION_IMGS : [])];
    const nextsOf = (sc) => [sc.next, sc.answer, sc.decline, sc.success, sc.fail, sc.mash?.success, sc.mash?.fail, sc.urgent?.success, sc.urgent?.fail, ...(sc.choice?.options || []).map((o) => o.next)]
      .filter((n) => typeof n === 'string' && SC[n]);
    return {
      add,
      // 받아 둔 게 있으면 blob 주소, 아니면 원래 주소
      url: (u) => { const v = blobs.get(u); return typeof v === 'string' ? v : u; },
      // 지금 바로 볼 영상에 인터넷을 몰아줌: 아직 받는 중인 미리받기는 전부 취소
      // (지금 영상이 다 받아지지 않았으면 원래 주소로 바로 스트리밍 → 처음 프레임이 빨리 나옴)
      focus() { for (const [u, c] of ctls) { c.abort(); blobs.delete(u); } ctls.clear(); },
      // 앞으로 나올 수 있는 장면들을 가까운 순서로 (영상 3개 정도 앞까지)
      ahead(id) {
        const seen = new Set([id]); let q = [id], found = 0;
        for (let d = 0; d < 6 && q.length && found < 4; d++) {
          const nq = [];
          for (const k of q) for (const n of nextsOf(SC[k] || {})) {
            if (seen.has(n)) continue; seen.add(n); nq.push(n);
            const m = mediaOf(SC[n]); m.forEach(add); if (m.some((x) => x && isVideo(x))) found++;
          }
          q = nq;
        }
      },
    };
  })();

  /* ---------- 타이틀 컨페티 ---------- */
  const Confetti = (() => {
    const COLORS = ['#ff8a3d', '#ffd84d', '#ff6cc7', '#9b7bff', '#ffffff', '#7fe3ff'];
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const AMBIENT = calm ? 40 : 55;
    let cv, ctx, raf = 0, parts = [], w = 0, h = 0, unit = 1;
    const resize = () => {
      // offsetWidth 는 회전(transform) 영향을 받지 않는 실제 무대 크기
      const d = Math.min(devicePixelRatio || 1, 2);
      const nw = cv.offsetWidth * d, nh = cv.offsetHeight * d;
      if (!nw || !nh) return false;
      // 화면 크기가 바뀌면(폰 회전 등) 조각 위치도 같은 비율로 옮김 → 한쪽에 몰리지 않게
      if (w && h) parts.forEach((p) => { p.x *= nw / w; p.y *= nh / h; });
      w = cv.width = nw; h = cv.height = nh; unit = w / 900;
      return true;
    };
    const piece = (burst, spreadY) => ({
      burst,
      x: burst ? w * (.1 + Math.random() * .8) : Math.random() * w,
      // 처음 깔리는 조각은 화면 전체에 흩어 두고, 다시 위에서 나올 땐 높이를 들쭉날쭉하게
      y: burst ? h * (.6 + Math.random() * .3) : spreadY ? Math.random() * h : -Math.random() * h * .6,
      vx: (burst ? (Math.random() - .5) * 10 : (Math.random() - .5) * .8) * unit,
      vy: (burst ? -(Math.random() * 10 + 5) : Math.random() * 1.2 + .8) * unit,
      size: (Math.random() * 5 + 5) * unit,
      rot: Math.random() * 6.3, vr: (Math.random() - .5) * .2,
      flip: Math.random() * 6.3, vf: Math.random() * .12 + .05,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      round: Math.random() < .22,
    });
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!w && !resize()) return;   // 아직 크기가 안 잡혔으면 다음 프레임에
      ctx.clearRect(0, 0, w, h);
      for (let k = parts.length - 1; k >= 0; k--) {
        const p = parts[k];
        p.vy = Math.min(p.vy + .12 * unit, 1.9 * unit);   // 중력 + 종단속도 → 팔랑팔랑
        p.vx *= .985;
        p.x += p.vx + Math.sin(p.flip) * .5 * unit; p.y += p.vy;
        p.rot += p.vr; p.flip += p.vf;
        if (p.y > h + 20 * unit) {
          // 처음 팡 터진 조각은 사라지고, 잔잔한 조각만 위에서 다시 (한꺼번에 몰려 내려오지 않게)
          if (p.burst) { parts.splice(k, 1); continue; }
          Object.assign(p, piece(false));
        }
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color; ctx.globalAlpha = .9;
        if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.size * .35, 0, 6.3); ctx.fill(); }
        else ctx.fillRect(-p.size / 2, -p.size * .22 * Math.abs(Math.cos(p.flip)), p.size, p.size * .45 * Math.abs(Math.cos(p.flip)) + .5);
        ctx.restore();
      }
    };
    const onResize = () => cv && resize();
    return {
      start(canvas) {
        this.stop();
        cv = canvas; ctx = cv.getContext('2d'); w = h = 0;
        if (resize()) {
          parts = [
            ...(calm ? [] : Array.from({ length: 90 }, () => piece(true))),
            ...Array.from({ length: AMBIENT }, () => piece(false, true)),
          ];
        } else {
          parts = [];
          requestAnimationFrame(() => { if (resize()) parts = Array.from({ length: AMBIENT }, () => piece(false, true)); });
        }
        addEventListener('resize', onResize);
        addEventListener('orientationchange', onResize);
        frame();
      },
      stop() {
        cancelAnimationFrame(raf); raf = 0;
        removeEventListener('resize', onResize);
        removeEventListener('orientationchange', onResize);
        parts = [];
      },
    };
  })();

  function start() {
    // 사용자 터치 순간에 오디오/비디오를 깨워 둬야 이후 소리 있는 재생이 허용됨(iOS)
    unlockMedia();
    const el = document.documentElement;
    if (el.requestFullscreen && !document.fullscreenElement) {
      el.requestFullscreen().then(() => screen.orientation?.lock?.('landscape')).catch(() => {});
    }
    state = freshState();
    go(CFG.start);
  }

  /* ---------- 아이폰 등: 첫 터치 때 영상·소리 재생 권한 얻기 ----------
     iOS는 "사용자가 누른 순간 소리 있는 재생을 시작한" 영상만 이후 자동 재생을 허락함.
     첫 터치에서 같은 <video>로 소리 켜고 play() → 바로 pause() 해두면 이후 장면 전환 때 자동 재생 가능. */
  let mediaUnlocked = false;
  function unlockMedia() {
    Sound.unlock();
    if (mediaUnlocked) return;
    const src = [].concat(Object.values(SC).find((s) => s.src)?.src || [])[0];
    if (!src) return;
    if (!video.getAttribute('src')) video.src = src;
    else if (!video.paused) { mediaUnlocked = true; return; }   // 이미 재생 중이면 끝
    video.muted = false;
    const p = video.play();
    video.pause();
    p?.catch?.(() => {});
    video.muted = muted;
    mediaUnlocked = true;
  }
  ['pointerdown', 'touchend', 'click'].forEach((t) => addEventListener(t, unlockMedia, { capture: true, passive: true }));

  /* ---------- HUD ---------- */
  $('#btn-mute').onclick = (e) => {
    muted = !muted; video.muted = muted; e.currentTarget.classList.toggle('off', muted);
  };
  $('#btn-fs').onclick = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  };
  if (!document.documentElement.requestFullscreen) $('#btn-fs').hidden = true; // iPhone Safari 미지원

  $('#logo').textContent = CFG.title;
  document.title = CFG.title;

  /* ---------- 개발용: ?dev → 장면 점프 패널, #장면id 또는 #장면id@choice ---------- */
  const Dev = (() => {
    if (!/[?&]dev\b/.test(location.search)) return { update() {} };
    document.documentElement.classList.add('dev');   // 플레이스홀더 라벨은 개발 모드에서만
    const box = document.createElement('div');
    box.id = 'dev';
    box.innerHTML = `<select><option value="">(타이틀)</option>${Object.keys(SC).map((id) =>
      `<option value="${id}">${id} · ${SC[id].type}${SC[id].choice ? ` · 선택${SC[id].choice.options.length}` : ''}</option>`).join('')}</select>
      <button data-c>선택지로 ▶</button><code></code>`;
    document.body.appendChild(box);
    const sel = $('select', box), code = $('code', box);
    sel.onchange = () => { Sound.unlock(); sel.value ? go(sel.value) : showTitle(); };
    $('[data-c]', box).onclick = () => sel.value && go(sel.value, { atChoice: true });
    return { update(id) { sel.value = SC[id] ? id : ''; code.textContent = JSON.stringify(state.flags); } };
  })();

  /* ---------- 시작 ---------- */
  if (/[?&]shot\b/.test(location.search)) document.documentElement.classList.add('noanim');
  const fromHash = (instant) => {
    const [hid, hmode] = decodeURIComponent(location.hash.slice(1)).split('@');
    if (SC[hid]) go(hid, { instant, atChoice: hmode === 'choice' });
    else if (hid === 'route') showRoute();
    else showTitle();
  };
  addEventListener('hashchange', () => fromHash(false));
  // 폰트가 준비된 뒤 첫 화면 표시 (기본 글꼴로 잠깐 보이는 것 방지)
  Preload.add(CFG.titleMedia); Preload.add(CFG.phone?.selfImage);
  ['media/images/end_good.png', 'media/images/end_bad.png', 'media/images/voicephoto.jpg'].forEach(Preload.add);
  Object.values(SC).forEach((x) => x.polaroid && Preload.add(x.polaroid));   // 엔딩 그림은 처음에 받아둠
  Promise.race([document.fonts?.ready, wait(2500)]).then(() => {
    fromHash(true);
    if (!gate) requestAnimationFrame(() => fade.classList.remove('on'));
  });
})();
