/* =========================================================
   스토리 데이터 — 클립을 받으면 여기만 채우면 됩니다.

   장면 타입
   ─ clip       영상 클립. src 없으면 플레이스홀더(색 배경)로 duration초 재생.
                subs:   [[시작초, 끝초, '자막'], [시작초, 끝초, '속마음', 'think'], ...]
                        'think' 를 붙이면 노란 속마음 자막
                choice: { at: 초 } → 그 시점부터 선택지 노출, 영상은 정상 속도로 계속, 끝나면 처음부터 반복
                        { loop:[시작,끝] } → 시작초에 선택지 + 그 구간을 느리게 반복 (rate 로 속도 지정)
                        공통: prompt:'질문 자막', timeout:초(선택), default:번호,
                          options:[{ text, next, set:{플래그:값}, if:(f)=>조건 }] }  최대 6개
                next:   choice 없을 때 다음 장면 id (문자열 또는 (flags)=>id). '@title' 은 타이틀로
   ─ narration  검은 화면 + 한 줄씩 타이핑되는 서술. 터치로 진행.
                lines: ['줄', ...]   subs: ['줄별 하단 보조 문구', ...](선택)
   ─ call       폰 목업 + 영상통화 수신.
                from(발신자), initial(프로필 글자) 또는 avatar(이미지)
                · answer 가 있으면: 받기 → 폰이 확대되며 그 장면(전체화면 클립)으로 전환
                · answer 가 없으면: 받기 → 폰 화면 안에서 src/subs/choice 재생 → 통화 종료 → next
                endLine: 통화 종료 후 노란 속마음 자막
                decline: 거절 시 갈 장면(없으면 "지금은 받아야 할 것 같다…" 토스트)
   ─ chat       폰 목업 + 문자.
                title(방 이름), icon(프로필 글자), group(단톡이면 true → 말풍선 위 이름 표시)
                thread: 같은 값이면 대화가 이어짐
                msgs: [['보낸사람', '내용'], ['me', '내가 보낸 내용'], ...]  ← 'me' 는 입력창에 타이핑 후 전송
                notify: { from, text }            잠금화면 알림 → 탭하면 채팅
                notify: { from, text, overlay:true } 직전 폰 화면(통화 종료 등) 위로 배너가 내려옴
                         text: '' 이면 알림에 발신자만 표시
                pre: n   앞의 n개 메시지는 채팅을 열었을 때 이미 와 있는 상태
                choice: 고르면 그 문장이 타이핑·전송됨. reply:false 면 전송 없이 다음 장면으로
                auto: 메시지가 다 오고 n ms 뒤 자동으로 next (없으면 터치)
   ─ ending     엔딩 화면.  title, desc('\n' 줄바꿈), bg / src(배경)
                voice: { name, initial|avatar, src(음성 파일), duration(초, 파일 없을 때), subs:[[s,e,'자막']] }
                → "남겨진 한마디" 버튼 → 재생하며 자막 표시

   폰 장면(call/chat)끼리는 검은 화면 없이 폰 안에서만 전환되고, 선택지는 폰 오른쪽에 세로로 뜹니다.
   공통: chapter({ no:'01', title:'장 제목' } 또는 '장 제목'), set(진입 시 플래그 변경), bg:[색1,색2]
   루트 화면: 선택지가 있는 장면·엔딩에 route: { title:'노드 이름', thumb:'썸네일 이미지' }

   ※ src 가 null 인 클립은 전부 플레이스홀더입니다. 대사/길이는 클립 받으면 교체.
   ========================================================= */
// 전화 앱 '최근 기록' (전화 거는 장면 공용)
const RECENTS = [
  { name: '원빈', time: '오후 11:02', video: true },
  { name: '엄마', time: '오후 9:47', missed: true, count: 2 },
  { name: '앤톤', time: '오후 8:15' },
  { name: '쇼타로', time: '어제' },
  { name: '은석', time: '어제', video: true },
  { name: '성찬', time: '금요일' },
  { name: '소희', time: '금요일', missed: true },
  { name: '엄마', time: '목요일' },
];

// 멤버에게 전화 → 통화 클립 (1-1 도와준다 갈래)
const memberCall = (who, josa, key) => ({
  [`p_${key}`]: {
    type: 'dial', to: who, recents: RECENTS,
    prompt: `${who}${josa}에게 전화해보자.`,
    wrongText: `${who}${josa}에게 전화하는 게 좋을 것 같다`,
    callTime: 5,
    noHint: true,   // 자막이 떠 있으니 '전화를 걸어요' 안내는 생략
    next: `c_${key}`,
  },
});

window.STORY = {
  config: {
    title: 'SHO-PRIIZE!',
    kicker: 'Happy birthday, ショウちゃん!',
    tagline: '라이즈와 함께 쇼타로의 생일파티를 준비하세요\n목표는 하나: 절대 들키지 말 것!',
    start: 'p_call1',
    titleMedia: 'media/clips/main.mp4',   // 타이틀 오른쪽 영상/이미지 (jpg·png도 가능)
    routeStart: { title: '시작', thumb: 'media/images/thumbs/start.jpg' },   // 루트 화면 첫 노드
    loopRate: 0.5,              // 선택지 대기 중 기본 재생 속도
    flags: {},                  // 초기 플래그
    phone: {
      clock: null,              // 폰 상단 시계. null이면 현재 시각, 예: '23:42'
      date: null,               // 잠금화면 날짜. null이면 오늘, 예: '10월 1일 수요일'
      selfImage: 'media/images/self.jpg',   // 영상통화 내 화면(PIP) — 흐리게 표시
    },
    sounds: {                   // 비워두면 기본 합성음 사용. 예: ring: 'assets/sfx/ring.mp3'
      ring: null, hangup: null,
      message: 'sound/receive.mp3',     // 문자 받을 때 (알림 포함)
      send: 'sound/send.mp3',           // 문자 보낼 때
      click: 'sound/key_press_click.mp3', // 문자 타이핑 · 내레이션 글자 나올 때
      ringback: 'sound/ringback.mp3',   // 전화 거는 중 연결음: assets/ringback.mp4 의 0~2.5초 + 1초 쉼, 반복
    },
  },

  scenes: {
    /* ══════════ 공통 도입 ══════════ */

    // RIIZE 영상통화 → 폰 안에서 통화 → 끊김
    p_call1: {
      type: 'call',
      from: 'RIIZE', initial: 'R',
      bg: ['#ff7a3d', '#1a0b05'],
      src: 'media/clips/call1-1.mp4',   // call1.1 만 사용
      callBg: 'media/images/callbg_call1.jpg',   // 영상 뒤 흐린 배경 (고정 이미지)
      subs: [],
      endLine: '앗. 끊겼다.',
      next: 'p_chat1',
    },

    // 통화 종료 화면 위로 문자 배너 → 단톡방
    p_chat1: {
      type: 'chat',
      thread: 'riize',
      title: 'RIIZE', icon: 'R', group: true,
      route: { title: '도와줄까, 말까', thumb: 'media/images/thumbs/p_chat1.jpg' },
      notify: { from: 'RIIZE', text: '', overlay: true },   // text 비우면 발신자만 표시
      pre: 1,                                                // 첫 메시지는 열었을 때 이미 와 있음
      time: '오늘',
      msgs: [
        ['원빈', '미안 끊겼다잉'],
        ['성찬', '그래서 아이디어 누가 낼거야'],
        ['앤톤', '도와달라 해?'],
        ['은석', '도와주면 좋긴 해'],
        ['소희', '걍 물어봐'],
        ['소희', '할래 말래'],
      ],
      choice: {
        options: [
          { text: '도와준다', reply: false, next: 'n_help1' },          // 1-1
          { text: '알아서 하라고 한다', reply: false, next: 'n_free' },  // 1-2
        ],
      },
    },

    /* ══════════ 1-2. 알아서 하라고 한다 ══════════ */

    n_free: {
      type: 'narration',
      lines: [
        '어쩐지 좋지 않은 예감이 들지만…',
        '알아서 하라고 해보자',
      ],
      next: 'p_chat2',
    },

    p_chat2: {
      type: 'chat',
      thread: 'riize',
      title: 'RIIZE', icon: 'R', group: true,
      msgs: [
        ['me', '자유롭게 해'],
        ['앤톤', '그래?'],
        ['앤톤', '나랑 원빈이형이 생각한거 있긴 한데'],
        ['me', '뭔데?'],
      ],
      auto: 1400,
      next: 'p_call2',
    },

    // 다시 영상통화 → 받기 누르면 전체화면 클립으로
    p_call2: {
      type: 'call',
      from: 'RIIZE', initial: 'R',
      answer: 'c_plan',
    },

    c_plan: {
      type: 'clip',
      src: 'media/clips/call2.mp4',   // 0~33초만 (원본에서 잘라냄)
      subs: [],
      idleSub: '멤버들의 말을 들어보자...',   // 대사·선택지 없는 동안 계속 표시
      next: 'n_check',
    },

    n_trust: {
      type: 'narration',
      lines: [
        '잘할 수 있을지 걱정되지만 맡겨보았다.',
        '다같이 모인 저녁 시간에 두 사람의 연기가 시작된다.',
        '일단 지켜보자.',
      ],
      next: 'c_act',
    },

    n_check: {
      type: 'narration',
      route: { title: '마지막 체크', thumb: 'media/images/thumbs/n_check.jpg' },
      lines: [
        '잘할 수 있을지 걱정되지만 맡겨보았다.',
        '이제 깜짝파티 날...',
        '마지막 체크를 해볼까?',
      ],
      choice: {   // 버튼 하나 — 눌러야만 넘어감
        options: [{ text: '체크한다', next: 'p_chat3' }],
      },
    },

    // 단톡방에 진행 상황 확인 → 앤톤 셀카 → 쇼타로 불러달라는 부탁
    p_chat3: {
      type: 'chat',
      thread: 'riize',
      title: 'RIIZE', icon: 'R', group: true,
      route: { title: '쇼타로를 불러줄까', thumb: 'media/images/thumbs/p_chat1.jpg' },
      dateLabel: '11월 25일',   // 이 장면 메시지 위에 날짜 구분
      msgs: [
        ['me', '잘 돼가고 있어?'],
        ['앤톤', { img: 'media/images/anton_photo.jpg' }],   // ← 셀카 받으면 교체
        ['앤톤', '지금 준비 다했어요 ㅋㅋ'],
        ['앤톤', '타로 형한테 전화해서 불러주면 안돼요 ?'],
      ],
      choice: {
        options: [
          { text: '불러준다', reply: false, next: 'p_dial' },
          { text: '이것도 맡긴다', reply: false, next: 'n_trust' },
        ],
      },
    },

    // 최근 기록에서 쇼타로에게 전화 → 발신 화면 3초
    p_dial: {
      type: 'dial',
      to: '쇼타로',
      prompt: '쇼타로에게 전화해보자.',
      recents: RECENTS,
      subs: [
        [1, 3, '그나저나 뭐라고 불러낼지 생각을 안 했는데....'],
        [3, 5, '어떤 핑계가 좋을까?'],
      ],
      callTime: 5,
      next: 'c_shotaro_call',
    },

    // 쇼타로가 전화 받는 영상 → 끝나면 핑계 선택
    c_shotaro_call: {
      type: 'clip',
      src: 'media/clips/sho1.mp4',
      route: { title: '어떤 핑계를 댈까?', thumb: 'media/images/thumbs/c_shotaro_call.jpg' },
      subs: [],
      choice: {
        at: 'end',
        prompt: '어떤 핑계를 댈까?',
        options: [
          { text: '애들이 싸우고 있다고 한다', next: 'c_excuse_fight' },
          { text: '사랑한다고 한다', next: 'c_excuse_love' },
        ],
      },
    },

    c_excuse_fight: {
      type: 'clip',
      src: 'media/clips/sho2.mp4',
      subs: [],
      next: 'n_fight',
    },
    n_fight: {
      type: 'narration',
      lines: [
        '쇼타로를 긴장감있게 불러냈다.',
        '사전 준비는 잘 끝냈다.',
        '이제 원빈이와 찬영이의 연기를 믿어보자..',
      ],
      next: 'c_act',
    },

    c_excuse_love: {
      type: 'clip',
      src: 'media/clips/sho1-1x2.mp4',   // sho1-1 의 0~1초를 두 번 이어 붙인 파일
      subs: [],
      next: 'n_love1',
    },
    n_love1: {
      type: 'narration',
      lines: [
        '쇼타로가 장난전화인 줄 알고 그냥 끊었다.',
        '다시 전화해도 받지 않는다.',
      ],
      next: 'n_love2',
    },
    n_love2: {
      type: 'narration',
      lines: [
        '당신의 선택 때문에 쇼타로의 등장 시점이 늦어져',
        '깜짝파티는 처음부터 실패하고 말았다.',
      ],
      next: 'e_love',
    },

    c_act: {
      type: 'clip',
      src: 'media/clips/act1.mp4',
      subs: [],
      idleSub: '원빈이와 찬영이의 연기를 지켜보자....',
      next: 'n_act',
    },

    n_act: {
      type: 'narration',
      lines: [
        '계획대로 흘러가고 있는데',
        '왠지 불안하다...',
        '자리를 비운 쇼타로가 돌아오길 기다려보자',
      ],
      next: 'c_caught',
    },

    c_caught: {
      type: 'clip',
      src: 'media/clips/caught1.mp4',
      subs: [],
      next: 'n_caught',
    },

    n_caught: {
      type: 'narration',
      lines: [
        '모든 걸 눈치챈 쇼타로가 “아 알았다” 를 시전해 깜짝 파티에 차질이 생겼다',
        '동생들의 어쩔 줄 모르는 표정을 보니 전략이 잘못된 듯 하다',
      ],
      next: 'e_shotaro',
    },

    e_love: {
      type: 'ending',
      title: '어떠까쥬?',
      route: { thumb: 'media/images/thumbs/e_love.jpg' },
      desc: '당신의 욕심으로 깜짝파티가 실패했다.\n그래도 쇼타로는 기분이 좋았을지도...',
      bg: ['#4a2a3a', '#0c060a'],
      voice: {
        name: '쇼타로', avatar: 'media/images/voicephoto.jpg',
        src: null, duration: 3,                        // ← 음성 받으면 src 에 경로
        subs: [[0, 3, '(쇼타로의 한마디 — 추후 제공)']],
      },
    },

    e_shotaro: {
      type: 'ending',
      title: '힘을 숨긴 쇼타로에게 들킴',
      route: { thumb: 'media/images/thumbs/e_shotaro.jpg' },
      desc: '쇼타로에게 동생들의 이상 행동은 너무나도 쉬웠다\n깜짝파티는 살짝 아쉽게 되었다',
      bg: ['#3a2a4a', '#08060c'],
      voice: {
        name: '쇼타로', avatar: 'media/images/voicephoto.jpg',
        src: 'media/voices/voice1.m4a',
        subs: [[0, 3, '눈만 보면 그 날 기분을 알아']],
      },
    },

    /* ══════════ 1-1. 도와준다 ══════════ */

    n_help1: {
      type: 'narration',
      lines: [
        '이 일의 적임자는 나다',
        '3주년 In a loop 떼창 이벤트도 성공한 나…',
        '이 정도면 이벤트 마스터라고 할 수 있지..',
      ],
      next: 'n_help2',
    },

    n_help2: {
      type: 'narration',
      lines: [
        '자신 있게 말했지만 막상 혼자 하려니 걱정되는데...',
        '멤버들에게 도움을 청해볼까?',
      ],
      next: 'c_pick',
    },

    c_pick: {
      type: 'clip',
      src: 'media/clips/pick1.mp4',
      route: { title: '누구에게 도움을 청할까', thumb: 'media/images/thumbs/c_pick.jpg' },
      subs: [
        [1, 11, '누구에게 도움을 요청해볼까?', 'think'],
        [11, 16, '생일자는 제외하고..', 'think'],
        [16, 19, '다들 자신의 파티력을 뽐내고 있으니', 'think'],
        [19, 22, '잘 보고 결정하는 게 좋을 것 같다', 'think'],
      ],
      choice: {
        at: 22,   // 0:22부터 선택지 노출. 영상은 정상 속도로 계속, 끝나면 처음부터 반복
        head: '누구와 같이 생일파티를 준비할까?',   // 선택지 위에 계속 표시
        options: [
          { text: '은석', next: 'p_eunseok', set: { helper: '은석' } },
          { text: '성찬', next: 'p_sungchan', set: { helper: '성찬' } },
          { text: '원빈', next: 'p_wonbin', set: { helper: '원빈' } },
          { text: '소희', next: 'p_sohee', set: { helper: '소희' } },
          { text: '앤톤', next: 'p_anton', set: { helper: '앤톤' } },
          { text: '혼자 준비한다', next: 'n_alone1', set: { helper: null } },
        ],
      },
    },

    ...memberCall('은석', '이', 'eunseok'),
    c_eunseok: {
      type: 'clip', src: 'media/clips/eunseok.mp4',
      holdEnd: 1,   // 끝나면 마지막 프레임·자막으로 1초 멈춤
      subs: [
        [1.5, 3, '생일파티 준비 같이 하자.'],
        [4, 99, '널 믿기로 했어.'],
      ],
      next: 'n_eunseok1',
    },

    /* ── 은석 갈래 ── */
    n_eunseok1: {
      type: 'narration',
      route: { title: '은석에게 뭘 의뢰할까', thumb: 'media/images/thumbs/n_eunseok1.jpg' },
      lines: [
        '얼마나 감동받았는지 감도 안 온다.',
        '쇼타로를 감동시킬 계획이 필요한데...',
        '그렇게 의뢰해볼까?',
      ],
      choice: {
        options: [
          { text: '쇼타로를 감동시키자고 한다', next: 'p_eunseok1' },
          { text: '뭐가 자신 있는지 물어본다', next: 'c_eunseok2' },
        ],
      },
    },

    // 은석 개인 문자: 음성 메시지 → (재생 버튼 눌러 듣기) → 대화
    p_eunseok1: {
      type: 'chat', thread: 'eunseok',
      title: '은석', icon: '은',
      msgs: [
        ['은석', {
          voice: 'media/voices/eunseok1.m4a',   // eunseok1 영상에서 소리만 뽑음
          dur: 6,
          subs: [],   // 자막 없이 소리만
        }],
      ],
      choice: { options: [{ text: '어떻게 할 건데?', next: 'p_eunseok2' }] },
    },

    // (eunseok2 클립에서도 여기로 바로 들어옴)
    p_eunseok2: {
      type: 'chat', thread: 'eunseok',
      title: '은석', icon: '은',
      msgs: [
        ['은석', '쇼타로는 감동스러운 말 좋아해'],
        ['은석', '일단 밑밥 깔게'],
      ],
      choice: { options: [{ text: '의심 받을 것 같다고 한다', reply: '의심 받을 것 같은데...', next: 'p_eunseok3' }] },
    },
    p_eunseok3: {
      type: 'chat', thread: 'eunseok',
      title: '은석', icon: '은',
      msgs: [
        ['은석', '아 부정적인 생각'],
        ['은석', '내쫓애'],
      ],
      choice: { options: [{ text: '알겠어', reply: '알겠어...', next: 'p_eunseok4' }] },
    },
    p_eunseok4: {
      type: 'chat', thread: 'eunseok',
      title: '은석', icon: '은',
      route: { title: '고마워? 사랑해?', thumb: 'media/images/thumbs/p_eunseok4.jpg' },
      msgs: [
        ['은석', '아 마지막 고민'],
        ['은석', '고마워 사랑해 중에 뭐라고 하지?'],
      ],
      choice: {
        options: [
          { text: '고마워 추천', reply: false, next: 'n_eunseok4' },
          { text: '사랑해 추천', reply: false, next: 'n_eunseok5' },
        ],
      },
    },

    c_eunseok2: {
      type: 'clip', src: 'media/clips/eunseok2.mp4',
      next: 'p_eunseok2',
    },

    n_eunseok4: { type: 'narration', lines: ['이제 은석이에게 맡겨보자...'], next: 'c_eunseok4' },
    c_eunseok4: { type: 'clip', src: 'media/clips/eunseok4.mp4', next: 'n_bad1' },
    n_eunseok5: { type: 'narration', lines: ['이제 은석이에게 맡겨보자...'], next: 'c_eunseok5' },
    c_eunseok5: { type: 'clip', src: 'media/clips/eunseok5.mp4', next: 'n_bad1' },

    n_bad1: {
      type: 'narration',
      lines: [
        '역효과가 발생했다.',
        '무리한 발언으로 멤버들의 기세가 떨어져',
        '쇼타로의 깜짝파티 준비에 차질이 생겼다.',
      ],
      next: 'c_e_bad1',
    },

    // 엔딩 들어가기 전에 보여주는 영상
    c_e_bad1: { type: 'clip', src: 'media/clips/e_bad1.mp4', next: 'e_bad1' },

    e_bad1: {
      type: 'ending',
      title: '준비 실패',
      route: { thumb: 'media/images/thumbs/e_bad1.jpg' },
      desc: '그래도 쇼타로는 즐거웠을지도?',
      bg: ['#4a2a1a', '#0c0806'],
      voice: {
        name: '쇼타로', avatar: 'media/images/voicephoto.jpg',
        src: 'media/voices/e_bad1.m4a',   // e_bad1 영상의 소리 0:03.19~끝
        subs: [[0, 99, '깔깔깔']],
      },
    },

    ...memberCall('성찬', '이', 'sungchan'),
    c_sungchan: {
      type: 'clip', src: 'media/clips/sungchan.mp4',
      holdEnd: 1,   // 끝나면 마지막 프레임·자막으로 1초 멈춤
      subs: [
        [0, 4, '성찬아 생일파티 준비 같이 하자.'],
        [4, 99, '아무래도 너만한 사람이 없어.'],
        [6, 99, '아주 좋아하는 것 같다', 'think'],   // 아래 줄에 함께
      ],
      next: 'n_tbd',
    },

    ...memberCall('원빈', '이', 'wonbin'),
    c_wonbin: {
      type: 'clip', src: 'media/clips/wonbin.mp4',
      holdEnd: 1,   // 끝나면 마지막 프레임·자막으로 1초 멈춤
      subs: [
        [0, 3, '원빈아? 생일파티 준비 같이 하자.'],
        [3, 99, '선택받아서 감격한 것 같다', 'think'],
      ],
      next: 'n_wonbin1',
    },

    /* ── 원빈 갈래 ── */
    n_wonbin1: {
      type: 'narration',
      lines: [
        '원빈이와 심도 깊은 토론을 했다.',
        '쇼타로는 자기가 잘 아니 걱정 말라고 한다.',
        '믿어보자.',
      ],
      next: 'p_wonbin1',
    },
    p_wonbin1: {
      type: 'chat', thread: 'wonbin', title: '원빈', icon: '원',
      msgs: [
        ['원빈', '준비하고 있는데 타로형 심심하다고 계속 연락와'],
        ['원빈', '형좀 맡아봐'],
      ],
      choice: { options: [{ text: '내가?', next: 'p_wonbin2' }] },   // '내가?' 전송
    },
    p_wonbin2: {
      type: 'chat', thread: 'wonbin', title: '원빈', icon: '원',
      msgs: [
        ['원빈', '아 전화왔잖아'],
        ['원빈', 'ㅏㅣㅏㅣㅏㅣ어떡하지'],
      ],
      choice: { options: [{ text: '들키지 말고 받아', reply: false, next: 'c_wonbin1' }] },
    },
    c_wonbin1: { type: 'clip', src: 'media/clips/wonbin1.mp4', next: 'p_wonbin3' },
    // 영상 뒤 다시 문자: 내가 보낸 답장 2개는 이미 있음 → 원빈 문자 → 내 메시지 자동 전송
    p_wonbin3: {
      type: 'chat', thread: 'wonbin', title: '원빈', icon: '원',
      pre: 2,
      msgs: [
        ['me', '일단 받아'],
        ['me', '들키지 말고ㅋㅋㅋ'],
        ['원빈', '아니 이 형 뭐 알고 전화한거 아니야?'],
        ['me', '일단 평소처럼 통화해'],
      ],
      auto: 1000,
      next: 'c_wonbin2',
    },
    // 건너뛰기 불가. 재생 중 원빈 문자가 위에 알림으로 → 19초 뒤 긴급상황: 6초 안에 알림 눌러 'ㄴㄴ 끊지마' 전송
    c_wonbin2: {
      type: 'clip', src: 'media/clips/wonbin2.mp4',
      noSkip: true,
      route: { title: '긴급상황!', thumb: 'media/images/thumbs/c_wonbin2.jpg' },
      texts: {
        from: '원빈', thread: 'wonbin',
        list: [
          [1, '와보라는데?'],
          [4, '같이 밥먹자그러잖아'],
          [8, '아니 일로 온다는데?'],
          [10, '진짜 오면 어떡해'],
          [12, '아니 이 형 안 끊어'],
          [14, '아 걍 끊을까?'],
          [19, '걍 끊는다?'],
        ],
      },
      urgent: {
        at: 19.6,
        text: '원빈이에게 끊지 말라고 답장해주세요!',
        placeholder: 'ㄴㄴ 끊지마', answer: 'ㄴㄴ 끊지마',   // 띄어쓰기는 상관없음
        time: 6,   // 긴급상황 뜬 뒤 알림 누르고 입력·전송까지 6초
        success: 'n_wonbin_ok', fail: 'c_wonbin3',
      },
    },

    // 실패
    c_wonbin3: { type: 'clip', src: 'media/clips/wonbin3.mp4', next: 'n_wonbin_fail' },
    n_wonbin_fail: {
      type: 'narration',
      lines: ['수상하게 생각한 타로가 방을 급습해서 깜짝파티에 실패했다. 거의 다 왔는데….'],
      next: 'e_bad_wonbin',
    },
    e_bad_wonbin: {
      type: 'ending',
      title: '또하꾸마',
      route: { thumb: 'media/images/thumbs/e_bad_wonbin.jpg' },
      desc: '좀 더 빠르게 원빈이를 말리는 게 좋겠다.',
      bg: ['#2a2a3a', '#06060c'],
      voice: {
        name: '쇼타로', avatar: 'media/images/voicephoto.jpg',
        src: 'media/voices/bad_wonbin.m4a',   // voice_bad_wonbin 영상에서 소리만
        subs: [[0, 99, '왜 안 나올까? 뭐하고 있을까?']],
      },
    },

    // 성공
    n_wonbin_ok: {
      type: 'narration',
      lines: ['원빈이를 성공적으로 진정시켰다. 잘 마무리한 뒤 연락 주기로 했다. 기다려보자.'],
      next: 'p_wonbin5',
    },
    p_wonbin5: {
      type: 'chat', thread: 'wonbin', title: '원빈', icon: '원',
      notify: { from: '원빈', text: '준비 완료ㅋㅋㅋ' },   // 새 문자 알림 → 눌러서 열기
      pre: 4,
      msgs: [
        ['me', 'ㄴㄴ 끊지마'],
        ['me', '얘기 좀 하다가 다시 전화한다해'],
        ['원빈', '알겠어'],
        ['원빈', '전화 끊고 연락할게'],
        ['원빈', '준비 완료ㅋㅋㅋ'],
        ['원빈', '타로형 부르자'],
      ],
      auto: 1400,
      next: 'c_wonbin4',
    },
    c_wonbin4: { type: 'clip', src: 'media/clips/wonbin4-2.mp4', next: 'n_wonbin_good' },
    n_wonbin_good: {
      type: 'narration',
      lines: ['생일파티가 성공적이었다.', '쇼타로는 아주 신나 보인다!'],
      next: 'e_good_wonbin',
    },
    e_good_wonbin: {
      type: 'ending',
      title: '댄스타임',
      kind: 'good',
      route: { thumb: 'media/images/thumbs/e_good_wonbin.jpg' },
      desc: '원빈과 쇼타로 둘 다 많이 신나보인다.',
      bg: ['#4a3a1a', '#0c0a04'],
      voice: {
        name: '쇼타로', avatar: 'media/images/voicephoto.jpg',
        src: null, duration: 3,   // ← 음성 받으면 연결
        subs: [[0, 3, '(쇼타로의 한마디 — 추후 제공)']],
      },
    },

    ...memberCall('소희', '', 'sohee'),
    c_sohee: {
      type: 'clip', src: 'media/clips/sohee.mp4',
      holdEnd: 1,   // 끝나면 마지막 프레임·자막으로 1초 멈춤
      subs: [
        [0, 3, '여보세요? 소희야?'],
        [3, 99, '생일파티 준비 같이 하자.'],
        [4.5, 99, '얼마나 준비된건지 감도 안온다', 'think'],   // 아래 줄에 함께
      ],
      next: 'n_sohee1',
    },

    /* ── 소희 갈래 ── */
    n_sohee1: {
      type: 'narration',
      lines: [
        '소희가 자기만 믿으라고 했다.',
        '뭔가 야무지다.',
        '하지만 아무래도 참견을 해야겠다.',
      ],
      choice: { options: [{ text: '참견하기', next: 'p_sohee1' }] },
    },

    // 소희 개인 문자 (같은 대화방에서 화면 그대로 이어짐)
    p_sohee1: {
      type: 'chat', thread: 'sohee', title: '소희', icon: '소',
      msgs: [
        ['me', '소희야 잘 돼가고 있어?'],
        ['소희', '아~ 당연한 거 아니야?'],
        ['소희', '두개중에 골라봐'],
      ],
      choice: { options: [{ text: '뭔데?', next: 'p_sohee1b' }] },
    },
    p_sohee1b: {
      type: 'chat', thread: 'sohee', title: '소희', icon: '소',
      route: { title: '열받게? 감동받게?', thumb: 'media/images/thumbs/p_sohee1b.jpg' },
      msgs: [['소희', '쇼타로 열받게 하기 vs 쇼타로 감동받게 하기']],
      choice: {
        options: [
          { text: '쇼타로 열받게 하기', reply: false, next: 'p_sohee2' },
          { text: '쇼타로 감동받게 하기', reply: false, next: 'p_sohee3' },
        ],
      },
    },
    p_sohee2: {
      type: 'chat', thread: 'sohee', title: '소희', icon: '소',
      route: { title: '소희를 믿을까', thumb: 'media/images/thumbs/p_sohee2.jpg' },
      msgs: [
        ['me', '잠만'],
        ['me', '근데 어떻게 열받게 하게?'],
        ['소희', '다 방법이 있지'],
        ['소희', '걍 믿고 따라와'],
      ],
      choice: {
        options: [
          { text: '마음을 바꿔서 감동받게 하자고 한다', reply: false, next: 'p_sohee3' },
          { text: '믿고 따라간다', reply: false, next: 'n_sohee2' },
        ],
      },
    },
    p_sohee3: {
      type: 'chat', thread: 'sohee', title: '소희', icon: '소',
      route: { title: '소희의 멘트', thumb: 'media/images/thumbs/p_sohee3.jpg' },
      msgs: [
        ['me', '아니 이건 감동으로 가야지'],
        ['소희', '그러면 골라봐'],
        ['소희', '나의 멘트를'],
        ['소희', { video: 'media/clips/sohee_3_1.mp4', thumb: 'media/images/sohee_3_1.jpg' }],   // 눌러서 보기
        ['소희', { video: 'media/clips/sohee_3_2.mp4', thumb: 'media/images/sohee_3_2.jpg' }],
        ['소희', { video: 'media/clips/sohee_3_3.mp4', thumb: 'media/images/sohee_3_3.jpg' }],   // 셋 다 본 뒤 선택지
      ],
      choice: {
        options: [
          { text: '마음을 바꿔서 열받게 하자고 한다', reply: false, next: 'p_sohee2' },
          { text: '다 괜찮은 것 같다', reply: false, next: 'n_sohee3' },
        ],
      },
    },

    // 열받게 하기 → 실패
    n_sohee2: { type: 'narration', lines: ['뭔가 믿음이 간다..', '소희의 계획을 지켜보자'], next: 'c_sohee2' },
    c_sohee2: { type: 'clip', src: 'media/clips/sohee2.mp4', next: 'n_sohee2b' },
    n_sohee2b: {
      type: 'narration',
      lines: [
        '최선을 다해 쇼타로를 귀찮게 하는 소희의 노력을 봤지만 쇼타로가 열받지 않아서 깜짝파티가 흐지부지되었다..',
      ],
      next: 'e_bad_sohee',
    },
    e_bad_sohee: {
      type: 'ending',
      title: '예열 실패',
      route: { thumb: 'media/images/thumbs/e_bad_sohee.jpg' },
      desc: '아니키만의 소희인 것만 더 증명되었다..\n그래도 사이는 더 좋아진 것 같다',
      bg: ['#3a2a4a', '#08060c'],
      voice: {
        name: '쇼타로', avatar: 'media/images/voicephoto.jpg',
        src: null, duration: 3,   // ← 음성 받으면 연결
        subs: [[0, 3, '(쇼타로의 한마디 — 추후 제공)']],
      },
    },

    // 감동받게 하기 → 응급상황 연타
    n_sohee3: {
      type: 'narration',
      lines: [
        '뭔가 준비가 제대로다..',
        '마음 편하게 모든 것을 맡기고 깜짝파티를 즐기기로 했다',
      ],
      next: 'c_sohee3',
    },
    c_sohee3: {
      type: 'clip', src: 'media/clips/sohee3.mp4',
      route: { title: '응급상황!', thumb: 'media/images/thumbs/c_sohee3.jpg' },
      // 영상 끝 장면에서 버튼 → 1.7초 안에 10번
      mash: { text: '응급상황! 빠르게 연타하세요!', taps: 10, window: 1.7, success: 'c_sohee4', fail: 'n_sohee4' },
    },
    c_sohee4: { type: 'clip', src: 'media/clips/sohee4.mp4', next: 'e_good_sohee1' },
    n_sohee4: {
      type: 'narration',
      lines: [
        '이런.. 예상치 못한 상황에서 민첩하게 대처하지 못했습니다',
        '깜짝파티의 흥이 다 깨져버렸습니다.....',
      ],
      next: 'e_bad_sohee1',
    },
    e_bad_sohee1: {
      type: 'ending',
      title: '민첩한 하루 되세요',
      route: { thumb: 'media/images/thumbs/e_bad_sohee1.jpg' },
      desc: '민첩했다면 다른 결과가 있었을지도?',
      bg: ['#2a3a4a', '#06080c'],
      voice: {
        name: '쇼타로', avatar: 'media/images/voicephoto.jpg',
        src: null, duration: 3,   // ← 음성 받으면 연결
        subs: [[0, 3, '(쇼타로의 한마디 — 추후 제공)']],
      },
    },
    e_good_sohee1: {
      type: 'ending',
      title: '나의 사랑을 받아줘!',
      kind: 'good',   // 굿 엔딩 (나머지는 배드 엔딩)
      route: { thumb: 'media/images/thumbs/e_good_sohee1.jpg' },
      desc: '민첩한 임기응변으로 깜짝파티를 성공했습니다!',
      bg: ['#4a3a1a', '#0c0a04'],
      voice: {
        name: '쇼타로', avatar: 'media/images/voicephoto.jpg',
        src: 'media/voices/good_sohee1.m4a',   // voice_good_sohee1 영상에서 소리만
        subs: [[0, 99, '우와~ 우와.. 진~짜 예상치 못했다']],
      },
    },

    /* ── 혼자 준비한다 ── */
    n_alone1: {
      type: 'narration',
      lines: [
        '진심을 전하기 위해 쇼타로의 생일을 혼자 열심히 준비해보기로 했습니다.',
        '미리 할 수 있는 모든 준비를 마쳤으니 쇼타로를 기다립니다..',
      ],
      next: 'c_alone1',
    },
    c_alone1: { type: 'clip', src: 'media/clips/alone_1.mp4', next: 'n_alone2' },
    n_alone2: {
      type: 'narration',
      lines: [
        '앗! 쇼타로의 발걸음이 예상보다 빨랐습니다.',
        '6초 안에 준비를 마쳐주세요!',
      ],
      next: 'm_alone',
    },
    // 미션: ① 성냥 연타(1초에 taps번) ② 성냥을 초 심지에 hold초 ③ 스위치 내려서 불 끄기 — 전부 time초 안에
    m_alone: {
      type: 'mission',
      time: 6,    // 제한 시간(초)
      taps: 6,    // 1단계: 1초 안에 몇 번 연타
      hold: 2,    // 2단계: 심지에 대고 있을 시간(초)
      route: { title: '6초 미션', thumb: 'media/images/thumbs/m_alone.jpg' },
      success: 'c_alone_good',
      fail: 'n_alone_fail',
    },
    n_alone_fail: {
      type: 'narration',
      lines: [
        '쇼타로가 한 발 빨랐습니다..',
        '준비가 되기 전에 쇼타로가 들어와 깜짝파티를 실패했습니다…',
      ],
      next: 'e_bad_alone',
    },
    e_bad_alone: {
      type: 'ending',
      title: '느려서 실패',
      route: { thumb: 'media/images/thumbs/e_bad_alone.jpg' },
      desc: '팔척수달의 발걸음은 보기보다 빠르답니다',
      bg: ['#3a2418', '#0c0604'],
      voice: {
        name: '쇼타로', avatar: 'media/images/voicephoto.jpg',
        src: null, duration: 3,   // ← 음성 받으면 연결
        subs: [[0, 3, '(쇼타로의 한마디 — 추후 제공)']],
      },
    },
    c_alone_good: { type: 'clip', src: 'media/clips/shotaro_alone.mp4', next: 'e_good_alone' },
    e_good_alone: {
      type: 'ending',
      title: '쇼짱 생일 축하해!',
      kind: 'good',
      // 굿 그림 대신 폴라로이드: 찰칵 → 사진이 천천히 나온 뒤 엔딩 카드
      polaroid: 'media/images/alone/polaroid.webp',
      route: { thumb: 'media/images/thumbs/e_good_alone.jpg' },
      desc: '우리 팀에 쇼타로 있다!',
      bg: ['#4a3a1a', '#0c0a04'],
      voice: {
        name: '쇼타로', avatar: 'media/images/voicephoto.jpg',
        src: null, duration: 3,   // ← 음성 받으면 연결
        subs: [[0, 3, '(쇼타로의 한마디 — 추후 제공)']],
      },
    },

    ...memberCall('앤톤', '', 'anton'),
    c_anton: {
      type: 'clip', src: 'media/clips/anton.mp4',
      holdEnd: 1,   // 끝나면 마지막 프레임·자막으로 1초 멈춤
      subs: [
        [1, 3.5, '찬영아? 생일파티 준비 같이 할까?'],
        [3.5, 99, '...들었니?'],
      ],
      next: 'n_tbd',
    },

    // 아직 안 짜인 구간 (임시)
    n_tbd: {
      type: 'narration',
      lines: ['🚧 여기부터는 아직 준비 중이에요.'],
      next: '@title',
    },
  },
};
