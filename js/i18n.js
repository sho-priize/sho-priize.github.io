/* =========================================================
   다국어 (기계번역): 한국어 원문 → [영어, 일본어, 중국어(간체)]
   - story.js 를 읽은 뒤 장면 데이터의 글자를 통째로 바꿔 둠 (타이핑 연출도 그대로 동작)
   - 영상에 박힌 자막, 쇼타로의 한마디(음성) 자막은 번역하지 않음
   - 언어: 주소의 ?lang=en > 메인 화면에서 고른 값(localStorage 'hbd.lang') > 한국어
   - 원문을 고치면 여기 키도 같이 고쳐야 번역이 붙음 (없으면 한국어로 나옴)
   ========================================================= */
(function () {
  const LANGS = ['ko', 'en', 'ja', 'zh'];
  const q = /[?&]lang=(ko|en|ja|zh)\b/.exec(location.search);
  let saved = null; try { saved = localStorage.getItem('hbd.lang'); } catch (e) {}
  const auto = 'ko';   // 번역은 옵션: 고르기 전엔 항상 한국어
  const LANG = (q && q[1]) || (LANGS.includes(saved) ? saved : auto);
  const IDX = { en: 0, ja: 1, zh: 2 }[LANG];
  document.documentElement.lang = LANG === 'zh' ? 'zh-CN' : LANG;
  document.documentElement.dataset.lang = LANG;

  const D = {
    /* ── 이름 ── */
    '원빈': ['Wonbin', 'ウォンビン', '元彬'],
    '성찬': ['Sungchan', 'ソンチャン', '圣灿'],
    '앤톤': ['Anton', 'アントン', '安东'],
    '은석': ['Eunseok', 'ウンソク', '银硕'],
    '소희': ['Sohee', 'ソヒ', '炤熙'],
    '쇼타로': ['Shotaro', 'ショウタロウ', '将太郎'],
    '엄마': ['Mom', 'ママ', '妈妈'],

    /* ── 설정 · 폰 ── */
    '라이즈와 함께 쇼타로의 생일파티를 준비하세요\n목표는 하나: 절대 들키지 말 것!': ["Plan Shotaro's birthday party with RIIZE\nOne goal: don't get caught!", 'RIIZEと一緒にショウタロウの誕生日パーティーを準備しよう\n目標はひとつ：絶対にバレないこと！', '和RIIZE一起准备将太郎的生日派对\n目标只有一个：绝对不能被发现！'],
    '시작': ['Start', 'スタート', '开始'],
    '11월 25일 수요일': ['Wednesday, November 25', '11月25日 水曜日', '11月25日 星期三'],
    '11월 25일': ['November 25', '11月25日', '11月25日'],
    '오늘': ['Today', '今日', '今天'],
    '오후 11:02': ['11:02 PM', '午後11:02', '下午11:02'],
    '오후 9:47': ['9:47 PM', '午後9:47', '下午9:47'],
    '오후 8:15': ['8:15 PM', '午後8:15', '下午8:15'],
    '어제': ['Yesterday', '昨日', '昨天'],
    '금요일': ['Friday', '金曜日', '星期五'],
    '목요일': ['Thursday', '木曜日', '星期四'],

    /* ── 공통 도입 ── */
    '앗. 끊겼다.': ['Oops. The call dropped.', 'あっ。切れちゃった。', '啊，断线了。'],
    '도와줄까, 말까': ['Help or not?', '手伝う？手伝わない？', '帮还是不帮？'],
    '미안 끊겼다잉': ['sorry it cut out lol', 'ごめん切れちゃった〜', '抱歉断了嘛'],
    '그래서 아이디어 누가 낼거야': ["so who's coming up with ideas", 'で、アイデア誰が出すの', '所以谁来出主意'],
    '도와달라 해?': ['should we ask for help?', '手伝ってって頼む？', '要不要找人帮忙？'],
    '도와주면 좋긴 해': ['help would be nice tbh', '手伝ってくれたら助かるけど', '有人帮的话是挺好的'],
    '걍 물어봐': ['just ask', 'とりあえず聞いてみて', '直接问呗'],
    '할래 말래': ['you in or not?', 'やる？やらない？', '干不干？'],
    '도와준다': ['Help them', '手伝う', '帮忙'],
    '알아서 하라고 한다': ['Let them handle it', '好きにやってと言う', '让他们自己看着办'],

    /* ── 알아서 하라고 한다 ── */
    '어쩐지 좋지 않은 예감이 들지만…': ['I have a bad feeling about this…', 'なんだか嫌な予感がするけど…', '总觉得有种不好的预感…'],
    '알아서 하라고 해보자': ["Let's let them handle it", '好きにやってもらおう', '就让他们自己看着办吧'],
    '자유롭게 해': ['do whatever you want', '自由にやって', '你们随意'],
    '그래?': ['really?', 'そう？', '是吗？'],
    '나랑 원빈이형이 생각한거 있긴 한데': ['wonbin hyung and i do have an idea', '僕とウォンビンヒョンで考えてることはあるんだけど', '我和元彬哥倒是想了个点子'],
    '뭔데?': ['what is it?', 'なになに？', '什么？'],
    '멤버들의 말을 들어보자...': ["Let's hear what the members have to say...", 'メンバーの話を聞いてみよう...', '听听成员们怎么说...'],
    '라이즈에게 다 맡겼다.': ['I left everything to RIIZE.', 'RIIZEに全部任せた。', '全都交给RIIZE了。'],
    '지금까지는 다 순조로운 듯 하다.': ['So far everything seems to be going smoothly.', '今のところ順調みたいだ。', '目前看来一切顺利。'],
    '이제부터가 중요하니 지켜보자..': ["The real test starts now, let's watch..", 'ここからが大事だから見守ろう..', '接下来才是关键，看着吧..'],
    '마지막 체크': ['Final check', '最終チェック', '最后检查'],
    '잘할 수 있을지 걱정되지만 맡겨보았다.': ["I'm worried they can't pull it off, but I trusted them.", 'うまくできるか心配だけど任せてみた。', '虽然担心他们能不能做好，还是交给他们了。'],
    '깜짝파티 날...': ['The day of the surprise party...', 'サプライズパーティー当日...', '惊喜派对当天...'],
    '마지막 체크를 해볼까?': ['Should I do one last check?', '最後にチェックしてみようか？', '要不要最后检查一下？'],
    '체크한다': ['Check', 'チェックする', '检查'],
    '쇼타로를 불러줄까': ['Call Shotaro over?', 'ショウタロウを呼び出す？', '要把将太郎叫来吗'],
    '잘 돼가고 있어?': ["how's it going?", '順調？', '进行得怎么样？'],
    '지금 준비 다했음 ㅋㅋ': ["we're all ready lol", 'もう準備できたよｗ', '我们都准备好了哈哈'],
    '타로 형한테 전화해서 불러주면 안돼요 ?': ['can you call taro hyung and bring him over?', 'タロヒョンに電話して呼んでくれない？', '能给太郎哥打电话叫他过来吗？'],
    '불러준다': ['Call him over', '呼び出す', '叫他过来'],
    '이것도 맡긴다': ['Leave this to them too', 'これも任せる', '这个也交给他们'],
    '쇼타로에게 전화해보자.': ["Let's call Shotaro.", 'ショウタロウに電話してみよう。', '给将太郎打个电话吧。'],
    '그나저나 뭐라고 불러낼지 생각을 안 했는데....': ['Come to think of it, I never figured out how to get him over....', 'そういえば、なんて言って呼び出すか考えてなかった....', '话说我还没想好用什么理由叫他出来....'],
    '어떤 핑계가 좋을까?': ['What excuse would work?', 'どんな口実がいいかな？', '用什么借口好呢？'],
    '어떤 핑계를 댈까?': ['What excuse to use?', 'どんな口実にする？', '找什么借口？'],
    '애들이 싸우고 있다고 한다': ['Say the kids are fighting', '弟たちがケンカしてると言う', '说弟弟们在吵架'],
    '사랑한다고 한다': ['Say I love him', '愛してると言う', '说我爱他'],
    '쇼타로를 긴장감있게 불러냈다.': ['Got Shotaro to come over, nice and tense.', 'ショウタロウを緊張感たっぷりに呼び出した。', '成功把将太郎紧张兮兮地叫了出来。'],
    '사전 준비는 잘 끝냈다.': ['The prep went well.', '事前準備はばっちり。', '事前准备都做好了。'],
    '이제 원빈이와 찬영이의 연기를 믿어보자..': ["Now let's trust Wonbin and Chanyoung's acting..", 'あとはウォンビンとチャニョンの演技を信じよう..', '现在就相信元彬和灿荣的演技吧..'],
    '쇼타로가 장난전화인 줄 알고 그냥 끊었다.': ['Shotaro thought it was a prank call and hung up.', 'ショウタロウはいたずら電話だと思って切ってしまった。', '将太郎以为是恶作剧电话，直接挂了。'],
    '다시 전화해도 받지 않는다.': ["He won't pick up even if I call again.", 'かけ直しても出てくれない。', '再打也不接了。'],
    '원빈이와 찬영이의 연기를 지켜보자....': ["Let's watch Wonbin and Chanyoung's acting....", 'ウォンビンとチャニョンの演技を見守ろう....', '看看元彬和灿荣的演技吧....'],
    '계획대로 흘러가고 있는데': ['Things are going according to plan, but', '計画通りに進んでるけど', '一切都按计划进行，但是'],
    '왠지 불안하다...': ["somehow I'm nervous...", 'なんだか不安だ...', '总觉得不安...'],
    '자리를 비운 쇼타로가 돌아오길 기다려보자': ["Let's wait for Shotaro to come back", '席を外したショウタロウが戻るのを待とう', '等离开的将太郎回来吧'],
    '모든 걸 눈치챈 쇼타로가 “아 알았다” 를 시전해 깜짝 파티에 차질이 생겼다': ['Shotaro saw through everything and went “Ah, I get it,” throwing the surprise party off track', '全てを察したショウタロウが「あ、わかった」を発動し、サプライズパーティーに支障が出た', '看穿一切的将太郎来了一句“啊，我懂了”，惊喜派对出了岔子'],
    '동생들의 어쩔 줄 모르는 표정을 보니 전략이 잘못된 듯 하다': ["Judging by the younger members' panicked faces, the strategy was wrong", 'どうしていいかわからない弟たちの顔を見るに、作戦ミスだったようだ', '看弟弟们手足无措的表情，战略好像出错了'],
    '어떠까쥬?': ["How 'bout it?", 'どうでしょ？', '怎么样嘛？'],
    '아직 끝이 아니다.. 다시 해보자': ["It's not over yet.. let's try again", 'まだ終わりじゃない..もう一度やってみよう', '还没结束.. 再试一次吧'],
    '체포하겠어🚨🚓': ["You're under arrest🚨🚓", '逮捕する🚨🚓', '我要逮捕你们🚨🚓'],
    '쇼타로에게 동생들의 이상 행동은 너무나도 쉬웠다': ["Spotting the younger members' weird behavior was way too easy for Shotaro", '弟たちの怪しい行動はショウタロウには簡単すぎた', '弟弟们的反常举动对将太郎来说太好识破了'],

    /* ── 도와준다 ── */
    '이 일의 적임자는 나다': ["I'm the right person for this job", 'この仕事の適任者は僕だ', '这件事的最佳人选就是我'],
    '3주년 In a loop 떼창 이벤트도 성공한 나…': ['The one who pulled off the 3rd anniversary “In a loop” sing-along event…', '3周年のIn a loop合唱イベントも成功させた僕…', '连3周年In a loop合唱活动都成功了的我…'],
    '이 정도면 이벤트 마스터라고 할 수 있지..': ["I'd call that an event master..", 'これならイベントマスターと言えるでしょ..', '这样也算是活动大师了吧..'],
    '자신 있게 말했지만 막상 혼자 하려니 걱정되는데...': ['I said it confidently, but doing it alone is worrying...', '自信満々に言ったけど、いざ一人でやるとなると心配だな...', '虽然说得很有自信，但真要一个人做还是有点担心...'],
    '멤버들에게 도움을 청해볼까?': ['Should I ask the members for help?', 'メンバーに助けを求めようか？', '要不要找成员们帮忙？'],
    '누구에게 도움을 청할까': ['Who to ask for help', '誰に助けを求める？', '向谁求助'],
    '누구에게 도움을 요청해볼까?': ['Who should I ask for help?', '誰に手伝ってもらおうかな？', '找谁帮忙好呢？'],
    '생일자는 제외하고..': ['Except the birthday boy..', '誕生日の本人は除いて..', '寿星除外..'],
    '다들 자신의 파티력을 뽐내고 있으니': ["Everyone's showing off their party skills", 'みんなパーティー力をアピールしてるから', '大家都在展示自己的派对实力'],
    '잘 보고 결정하는 게 좋을 것 같다': ["I'd better watch carefully and decide", 'よく見て決めたほうがよさそうだ', '还是看清楚再决定比较好'],
    '누구와 같이 생일파티를 준비할까?': ['Who should I plan the birthday party with?', '誰と一緒に誕生日パーティーを準備する？', '要和谁一起准备生日派对？'],
    '혼자 준비한다': ['Do it alone', '一人で準備する', '自己准备'],
    '생일파티 준비 같이 하자.': ["Let's plan the birthday party together.", '誕生日パーティーの準備、一緒にしよう。', '一起准备生日派对吧。'],

    /* ── 은석 ── */
    '은석이에게 전화해보자.': ["Let's call Eunseok.", 'ウンソクに電話してみよう。', '给银硕打个电话吧。'],
    '은석이에게 전화하는 게 좋을 것 같다': ['I should call Eunseok', 'ウンソクに電話したほうがよさそう', '还是给银硕打电话比较好'],
    '널 믿기로 했어.': ["I've decided to trust you.", '君を信じることにした。', '我决定相信你了。'],
    '은석에게 뭘 의뢰할까': ['What to ask Eunseok', 'ウンソクに何を頼む？', '拜托银硕做什么'],
    '얼마나 감동받았는지 감도 안 온다.': ["I can't even tell how touched he is.", 'どれだけ感動してるのか見当もつかない。', '完全看不出他有多感动。'],
    '쇼타로를 감동시킬 계획이 필요한데...': ['We need a plan to move Shotaro...', 'ショウタロウを感動させる計画が必要なんだけど...', '需要一个让将太郎感动的计划...'],
    '그렇게 의뢰해볼까?': ['Should I ask him for that?', 'そうお願いしてみる？', '就这样拜托他吧？'],
    '쇼타로를 감동시키자고 한다': ['Ask him to move Shotaro', 'ショウタロウを感動させようと言う', '说要让将太郎感动'],
    '뭐가 자신 있는지 물어본다': ["Ask what he's good at", '何が得意か聞いてみる', '问他擅长什么'],
    '어떻게 할 건데?': ["what's your plan?", 'どうするつもり？', '你打算怎么做？'],
    '쇼타로는 감동스러운 말 좋아해': ['shotaro loves heartfelt words', 'ショウタロウは感動する言葉が好きだよ', '将太郎喜欢感人的话'],
    '일단 밑밥 깔게': ["i'll lay the groundwork first", 'とりあえず伏線張っとく', '我先铺垫一下'],
    '의심 받을 것 같다고 한다': ['Say he might get suspicious', '怪しまれそうだと言う', '说可能会被怀疑'],
    '의심 받을 것 같은데...': ["i feel like he'll get suspicious...", '怪しまれそうだけど...', '感觉会被怀疑...'],
    '아 부정적인 생각': ['ugh negative thoughts', 'あ、ネガティブ思考', '啊 负面想法'],
    '내쫓애': ['kick em out', '追い出せ', '赶出去'],
    '알겠어? 신나는 파티?': ['Okay? Fun party?', 'わかった？楽しいパーティー？', '知道了？欢乐派对？'],
    '알겠어...': ['okay...', 'わかった...', '知道了...'],
    '생각해봤는데 그냥 신나는 파티가 좋겠어': ['on second thought a fun party would be better', '考えたんだけど、やっぱり楽しいパーティーがいいな', '我想了想，还是开心的派对比较好'],
    '그럴 수도 있겠네': ['fair enough', 'それもアリだね', '也有道理'],
    '뭐 필요한데?': ['what do you need?', '何が必要？', '需要什么？'],
    '쇼타로를 맡아줘': ['Keep Shotaro busy', 'ショウタロウを引き留めて', '帮我拖住将太郎'],
    '들키면 안되니까': ["since we can't get caught", 'バレちゃダメだから', '因为不能被发现'],
    '쉽지ㅋㅋ': ['easy lol', '簡単ｗｗ', '简单哈哈'],
    '자신감을 보니 딱 맞는 사람에게 부탁한 것 같다. 파티 준비만 신경쓰자.': ["Judging by that confidence, I asked the right person. Let's just focus on the party prep.", 'あの自信を見るに、ぴったりの人に頼んだみたいだ。パーティーの準備に集中しよう。', '看他那么有自信，看来是找对人了。专心准备派对吧。'],
    '계속 잡고 있어? 교대?': ['Keep him? Switch?', '引き留め続ける？交代？', '继续拖着？换班？'],
    '내가 놀아주는 중ㅋㅋㅋ': ["im hanging out with him rn lol", '僕が遊んであげてるとこｗｗｗ', '我正在陪他玩哈哈哈'],
    '의심 1도 못하는데?': ["he doesn't suspect a thing", '1ミリも疑ってないよ？', '他一点都没怀疑'],
    '굿 계속 잡고 있어': ['good keep him busy', 'いいね、そのまま引き留めて', '很好继续拖着'],
    '이제 교대하고 파티 준비 도와줘': ['switch out now and help with the party', 'そろそろ交代してパーティーの準備手伝って', '现在换班来帮忙准备派对'],
    '아... 근데 문제가 있어': ["ah... but there's a problem", 'あ...でも問題があって', '啊...不过有个问题'],
    '이거 찍다가 케이크 들켰는데?': ['he saw the cake while i was filming this?', 'これ撮ってたらケーキバレたんだけど？', '拍这个的时候蛋糕被发现了？'],
    '뭐라고?': ['what??', 'なんだって？', '你说什么？'],
    '은석과 쇼타로가 온갖 곳을 돌아다니며 놀다가 케이크를 발견해버렸다..': ['Eunseok and Shotaro wandered all over the place and stumbled upon the cake..', 'ウンソクとショウタロウがあちこち遊び回っているうちにケーキを見つけてしまった..', '银硕和将太郎到处闲逛，结果发现了蛋糕..'],
    '꼭꼭 숨어라': ['Hide and seek', 'かくれんぼ', '藏好哦'],
    '어디로 가?': ['where to?', 'どこ行くの？', '去哪儿？'],
    '손발이 딱딱 맞아 깜짝파티 준비가 순조로웠다': ['We were perfectly in sync and the surprise party prep went smoothly', '息ぴったりでサプライズパーティーの準備は順調だった', '配合得天衣无缝，惊喜派对准备得很顺利'],
    '아이고 사랑해~♡': ['Aww love you~♡', 'あらら愛してる〜♡', '哎哟爱你~♡'],
    '고마워? 사랑해?': ['Thank you? Love you?', 'ありがとう？愛してる？', '谢谢？爱你？'],
    '아 마지막 고민': ['ah one last dilemma', 'あ、最後の悩み', '啊 最后的烦恼'],
    '고마워 사랑해 중에 뭐라고 하지?': ['should i say thank you or i love you?', 'ありがとうと愛してる、どっち言おう？', '说谢谢还是说爱你？'],
    '고마워 추천': ['Recommend “thank you”', '「ありがとう」推し', '推荐说谢谢'],
    '사랑해 추천': ['Recommend “I love you”', '「愛してる」推し', '推荐说爱你'],
    '이제 은석이에게 맡겨보자...': ["Now let's leave it to Eunseok...", 'あとはウンソクに任せよう...', '现在就交给银硕吧...'],
    '역효과가 발생했다.': ['It backfired.', '逆効果になった。', '适得其反了。'],
    '무리한 발언으로 멤버들의 기세가 떨어져': ["The overbearing remark killed the members' momentum", '無理な発言でメンバーの勢いが落ちて', '过分的发言让成员们士气低落'],
    '쇼타로의 깜짝파티 준비에 차질이 생겼다.': ["and Shotaro's surprise party prep hit a snag.", 'ショウタロウのサプライズパーティーの準備に支障が出た。', '将太郎的惊喜派对准备出了岔子。'],
    '준비 실패': ['Prep failed', '準備失敗', '准备失败'],
    '그래도 쇼타로는 즐거웠을지도?': ['Still, maybe Shotaro had fun?', 'それでもショウタロウは楽しかったかも？', '不过将太郎说不定玩得很开心？'],

    /* ── 성찬 ── */
    '성찬이에게 전화해보자.': ["Let's call Sungchan.", 'ソンチャンに電話してみよう。', '给圣灿打个电话吧。'],
    '성찬이에게 전화하는 게 좋을 것 같다': ['I should call Sungchan', 'ソンチャンに電話したほうがよさそう', '还是给圣灿打电话比较好'],
    '성찬아 생일파티 준비 같이 하자.': ["Sungchan, let's plan the birthday party together.", 'ソンチャン、誕生日パーティーの準備一緒にしよう。', '圣灿，一起准备生日派对吧。'],
    '아무래도 너만한 사람이 없어.': ["Nobody's better for this than you.", 'やっぱり君ほどの人はいないよ。', '果然没人比你更合适。'],
    '아주 좋아하는 것 같다': ['He seems really happy', 'すごく喜んでるみたい', '他好像很开心'],
    '광란? 감동?': ['Wild? Touching?', '狂乱？感動？', '狂欢？感动？'],
    '어떤 생일파티 해주고 싶은데?': ['what kind of birthday party do you wanna throw?', 'どんな誕生日パーティーにしたい？', '想办什么样的生日派对？'],
    '광란의 생일파티': ['A wild birthday party', '狂乱の誕生日パーティー', '狂欢生日派对'],
    '제일 신나는 역대급 생일파티로 부탁해': ['make it the most hype birthday party ever', '最高に盛り上がる伝説の誕生日パーティーでお願い', '拜托办一个史上最嗨的生日派对'],
    '감동의 생일파티': ['A touching birthday party', '感動の誕生日パーティー', '感动生日派对'],
    '눈물의 생일파티로 부탁해': ['make it a tearjerker birthday party', '涙の誕生日パーティーでお願い', '拜托办一个催泪的生日派对'],
    '잘 골랐네ㅎㅎ': ['good choice hehe', 'いいの選んだね笑', '选得好嘿嘿'],
    '그건 나지': ["that's my thing", 'それは僕の担当でしょ', '那可是我的拿手好戏'],
    '타로 텐션 미리 올려줘': ['get taro hyped up in advance', 'タロのテンション先に上げといて', '提前把太郎的情绪调动起来'],
    '기대해': ['look forward to it', '期待してて', '敬请期待'],
    '음… 많이 시끄러워질 것 같다.': ["Hmm… it's going to get very loud.", 'うーん…かなりうるさくなりそうだ。', '嗯…感觉会很吵。'],
    '그래도 재밌을 듯 하다.': ["But it'll probably be fun.", 'でも楽しそうだ。', '不过应该会很好玩。'],
    '더 올려? ①': ['Hype? ①', '上げる？①', '再嗨一点？①'],
    '더 올려? ②': ['Hype? ②', '上げる？②', '再嗨一点？②'],
    '더 올려? ③': ['Hype? ③', '上げる？③', '再嗨一点？③'],
    '어때 더 올려?': ["how's this, more?", 'どう、もっと上げる？', '怎么样，再嗨一点？'],
    '더 올려달라고 한다': ['Ask for more', 'もっと上げてと言う', '让他再嗨一点'],
    '더 올려야지': ['gotta go higher', 'もっと上げなきゃ', '当然要再嗨一点'],
    '음.. 충분하다': ["Hmm.. that's enough", 'うーん..十分だ', '嗯..够了'],
    '어때': ["how's this", 'どう', '怎么样'],
    '아 좀만 더 올리자': ['ah just a bit more', 'あともうちょっと上げよう', '啊再嗨一点点'],
    '이만큼?': ['this much?', 'これくらい？', '这样？'],
    '쫌만 더': ['a lil more', 'もうちょい', '再来一点'],
    '오마이갓 비상사태': ['omg emergency', 'オーマイガー緊急事態', '我的天紧急情况'],
    '타로형 기빨렸다': ['taro hyung is drained', 'タロヒョン、気力吸われた', '太郎哥被榨干了'],
    '쇼타로의 텐션보다 성찬의 의욕이 앞서버렸다': ["Sungchan's enthusiasm outran Shotaro's energy", 'ショウタロウのテンションよりソンチャンのやる気が勝ってしまった', '圣灿的干劲超过了将太郎的情绪'],
    '쇼타로가 외면해버렸다..': ['Shotaro tuned out..', 'ショウタロウがそっぽを向いてしまった..', '将太郎不理人了..'],
    '쇼타로도 기가 빨리나요?': ['Does Shotaro get drained too?', 'ショウタロウも気力吸われるんですか？', '将太郎也会被榨干吗？'],
    '쇼타로의 텐션을 충분히 올렸다': ['Got Shotaro plenty hyped up', 'ショウタロウのテンションを十分に上げた', '把将太郎的情绪充分调动起来了'],
    '이제 파티를 진행해보자': ["Now let's get the party going", 'さあパーティーを始めよう', '现在开始派对吧'],
    '타로생일 축하해야징 푸하': ["Gotta celebrate Taro's birthday puha", 'タロの誕生日お祝いしなきゃ ぷはっ', '要给太郎庆生啦 噗哈'],
    '1초 안에 번복!': ['Take it back in 1 second!', '1秒以内に撤回！', '1秒内反悔！'],
    '아': ['ah', 'あ', '啊'],
    '그건 나 아닌데?': ["that's not me though?", 'それ僕じゃなくない？', '那不是我吧？'],
    '빨리 판단하세요!': ['Decide fast!', '早く決めて！', '快做决定！'],
    '광란의 생일파티로 번복한다': ['Switch to the wild birthday party', '狂乱の誕生日パーティーに変更する', '改成狂欢生日派对'],
    '나는 신나는게 자신 있지': ['hype is my specialty', '盛り上げるのは自信あるよ', '我擅长的是嗨'],
    '이런.. 의뢰가 잘못됐다': ['Oops.. I asked for the wrong thing', 'あらら..頼み方を間違えた', '糟糕..拜托错事了'],
    '다시 해보자': ["Let's try again", 'もう一度やってみよう', '再试一次吧'],
    '전략 실패': ['Strategy failed', '作戦失敗', '战略失败'],
    '다른 요청을 해봐야 될 것 같다': ['Maybe I should ask for something else', '別のお願いをしたほうがよさそう', '看来得换个请求了'],

    /* ── 원빈 ── */
    '원빈이에게 전화해보자.': ["Let's call Wonbin.", 'ウォンビンに電話してみよう。', '给元彬打个电话吧。'],
    '원빈이에게 전화하는 게 좋을 것 같다': ['I should call Wonbin', 'ウォンビンに電話したほうがよさそう', '还是给元彬打电话比较好'],
    '원빈아? 생일파티 준비 같이 하자.': ["Wonbin? Let's plan the birthday party together.", 'ウォンビン？誕生日パーティーの準備一緒にしよう。', '元彬？一起准备生日派对吧。'],
    '선택받아서 감격한 것 같다': ['He seems moved to be chosen', '選ばれて感激してるみたい', '被选中好像很感动'],
    '원빈이와 심도 깊은 토론을 했다.': ['Had an in-depth discussion with Wonbin.', 'ウォンビンと深い議論をした。', '和元彬进行了深入讨论。'],
    '쇼타로는 자기가 잘 아니 걱정 말라고 한다.': ['He says not to worry because he knows Shotaro well.', 'ショウタロウのことはよくわかってるから心配するなと言う。', '他说自己很了解将太郎，让我别担心。'],
    '믿어보자.': ["Let's trust him.", '信じてみよう。', '相信他吧。'],
    '준비하고 있는데 타로형 심심하다고 계속 연락와': ["i'm prepping but taro hyung keeps texting me cuz he's bored", '準備してるのにタロヒョンが暇だってずっと連絡してくる', '我在准备，太郎哥一直说无聊联系我'],
    '형좀 맡아봐': ['can you handle hyung', 'ヒョンの相手してて', '你来应付一下哥'],
    '내가?': ['me?', '僕が？', '我？'],
    '아 전화왔는데?': ["ah he's calling?", 'あ、電話きたんだけど？', '啊他打电话来了？'],
    'ㅏㅣㅏㅣㅏㅣ어떡하지': ['AAAAA what do i do', 'あああああどうしよう', '啊啊啊啊怎么办'],
    '들키지 말고 받아': ['Answer without getting caught', 'バレないように出て', '接吧别露馅'],
    '일단 받아': ['just answer', 'とりあえず出て', '先接吧'],
    '들키지 말고ㅋㅋㅋ': ["don't get caught lol", 'バレないようにｗｗｗ', '别露馅哈哈哈'],
    '아니 이 형 뭐 알고 전화한거 아니야?': ["wait does he know something?? why's he calling", 'え、この人なんか知ってて電話してきたんじゃない？', '等下 他是不是知道什么才打来的？'],
    '일단 평소처럼 통화해': ['Just talk like normal', 'とりあえずいつも通り話して', '先像平常一样聊'],
    '긴급상황!': ['Emergency!', '緊急事態！', '紧急情况！'],
    '와보라는데?': ["he's telling me to come over?", '来いって言ってるんだけど？', '他叫我过去？'],
    '같이 밥먹자그러잖아': ['he wants to grab food together', '一緒にご飯食べようって', '他说要一起吃饭'],
    '아니 일로 온다는데?': ["wait he says he's coming here?", 'え、こっち来るって言ってるんだけど？', '等等他说要过来？'],
    '진짜 오면 어떡해': ['what if he actually comes', 'ほんとに来たらどうしよう', '真来了怎么办'],
    '아니 이 형 안 끊어': ["he won't hang up", 'この人全然切らない', '这哥不挂电话'],
    '아 걍 끊을까?': ['should i just hang up?', 'もう切っちゃおうかな？', '要不直接挂了？'],
    '걍 끊는다?': ['hanging up?', '切るよ？', '我挂了啊？'],
    '원빈이에게 끊지 말라고 답장해주세요!': ["Reply to Wonbin: don't hang up!", 'ウォンビンに切らないでと返信して！', '快回复元彬别挂电话！'],
    'ㄴㄴ 끊지마': ['no dont', 'だめ', '别挂'],
    '알겠어': ['ok', 'わかった', '好'],
    '해결하고 연락할게': ["i'll fix it and text you", 'なんとかしたら連絡する', '搞定了再联系你'],
    '수상하게 생각한 타로가 방을 급습해서 깜짝파티에 실패했다. 거의 다 왔는데….': ['Suspicious, Taro raided the room and the surprise party failed. We were so close….', '怪しんだタロが部屋に突撃してきてサプライズパーティーは失敗した。あと少しだったのに….', '起了疑心的太郎突袭了房间，惊喜派对失败了。明明就差一点….'],
    '또하꾸마': ['Again!', 'もう一回！', '再来一次！'],
    '좀 더 빠르게 원빈이를 말려보자.\n다시 하면 돼~': ["Let's stop Wonbin faster.\nJust try again~", 'もっと早くウォンビンを止めよう。\nもう一回やればいいよ〜', '要更快阻止元彬才行。\n再来一次就好啦~'],
    '원빈이를 성공적으로 진정시켰다. 잘 마무리한 뒤 연락 주기로 했다. 기다려보자.': ["Calmed Wonbin down. He'll text when everything's wrapped up. Let's wait.", 'ウォンビンをうまく落ち着かせた。片付いたら連絡をくれるそうだ。待ってみよう。', '成功让元彬冷静下来了。他说处理好后会联系我。等等看吧。'],
    '준비 완료ㅋㅋㅋ': ['all set lol', '準備完了ｗｗｗ', '准备完毕哈哈哈'],
    '타로형 부르자': ["let's call taro hyung", 'タロヒョン呼ぼう', '叫太郎哥来吧'],
    '생일파티가 성공적이었다.': ['The birthday party was a success.', '誕生日パーティーは大成功だった。', '生日派对很成功。'],
    '둘 다 아주 신나 보인다!': ['They both look so hyped!', '二人ともすごく楽しそう！', '两个人都超嗨的！'],
    '댄스타임': ['Dance Time', 'ダンスタイム', '舞蹈时间'],
    '우리 아이가 많이 신이 났어요!': ['Our kid is having so much fun!', 'うちの子がすごくはしゃいでます！', '我家孩子玩得可开心了！'],

    /* ── 소희 ── */
    '소희에게 전화해보자.': ["Let's call Sohee.", 'ソヒに電話してみよう。', '给炤熙打个电话吧。'],
    '소희에게 전화하는 게 좋을 것 같다': ['I should call Sohee', 'ソヒに電話したほうがよさそう', '还是给炤熙打电话比较好'],
    '여보세요? 소희야?': ['Hello? Sohee?', 'もしもし？ソヒ？', '喂？炤熙？'],
    '얼마나 준비된건지 감도 안온다': ["I can't even tell how ready he is", 'どこまで準備できてるのか見当もつかない', '完全看不出准备到什么程度了'],
    '소희가 자기만 믿으라고 했다.': ['Sohee told me to just trust him.', 'ソヒが自分に任せろと言った。', '炤熙说只管相信他。'],
    '뭔가 야무지다.': ['Somehow he seems on top of it.', 'なんだかしっかりしてる。', '感觉挺靠谱的。'],
    '하지만 아무래도 참견을 해야겠다.': ['But I still have to butt in.', 'でもやっぱり口出ししなきゃ。', '不过还是得插一手。'],
    '참견하기': ['Butt in', '口出しする', '插手'],
    '소희야 잘 돼가고 있어?': ["sohee how's it going?", 'ソヒ、順調？', '炤熙进行得怎么样？'],
    '아~ 당연한 거 아니야?': ['ah~ obviously?', 'あ〜当たり前じゃん？', '啊~那还用说？'],
    '두개중에 골라봐': ['pick one of two', '二つから選んで', '二选一吧'],
    '열받게? 감동받게?': ['Annoy? Touch?', '怒らせる？感動させる？', '惹火？感动？'],
    '쇼타로 열받게 하기 vs 쇼타로 감동받게 하기': ['make shotaro mad vs make shotaro touched', 'ショウタロウを怒らせる vs ショウタロウを感動させる', '让将太郎生气 vs 让将太郎感动'],
    '쇼타로 열받게 하기': ['Make Shotaro mad', 'ショウタロウを怒らせる', '让将太郎生气'],
    '쇼타로 감동받게 하기': ['Make Shotaro touched', 'ショウタロウを感動させる', '让将太郎感动'],
    '소희를 믿을까': ['Trust Sohee?', 'ソヒを信じる？', '相信炤熙吗'],
    '잠만': ['wait', 'ちょっと待って', '等下'],
    '근데 어떻게 열받게 하게?': ['but how are you gonna make him mad?', 'でもどうやって怒らせるの？', '但你要怎么让他生气？'],
    '다 방법이 있지': ["i've got my ways", 'ちゃんと方法があるの', '我自有办法'],
    '걍 믿고 따라와': ['just trust me and follow', '黙って信じてついてきて', '相信我跟着来就行'],
    '마음을 바꿔서 감동받게 하자고 한다': ["Change my mind: let's touch his heart", 'やっぱり感動させようと言う', '改主意说要让他感动'],
    '믿고 따라간다': ['Trust him and follow', '信じてついていく', '相信他跟着走'],
    '소희의 멘트': ["Sohee's lines", 'ソヒのセリフ', '炤熙的台词'],
    '아니 이건 감동으로 가야지': ['no this has to be the touching route', 'いや、これは感動でいかなきゃ', '不 这必须走感动路线'],
    '그러면 골라봐': ['then pick', 'じゃあ選んで', '那你选吧'],
    '나의 멘트를': ['my lines', '僕のセリフを', '我的台词'],
    '마음을 바꿔서 열받게 하자고 한다': ["Change my mind: let's make him mad", 'やっぱり怒らせようと言う', '改主意说要让他生气'],
    '다 괜찮은 것 같다': ['They all seem fine', 'どれも良さそう', '好像都不错'],
    '뭔가 믿음이 간다..': ['Somehow I trust him..', 'なんだか信頼できる..', '莫名觉得可以信任..'],
    '소희의 계획을 지켜보자': ["Let's watch Sohee's plan", 'ソヒの計画を見守ろう', '看看炤熙的计划吧'],
    '최선을 다해 쇼타로를 귀찮게 하는 소희의 노력을 봤지만 쇼타로가 열받지 않아서 깜짝파티가 흐지부지되었다..': ['Sohee tried his best to bug Shotaro, but Shotaro never got mad and the surprise party fizzled out..', 'ソヒが全力でショウタロウを困らせる努力を見たけど、ショウタロウが怒らなかったのでサプライズパーティーはうやむやになった..', '看到了炤熙拼命烦将太郎的努力，但将太郎没生气，惊喜派对就不了了之了..'],
    '예열 실패': ['Warm-up failed', 'ウォームアップ失敗', '预热失败'],
    '아니키만의 소희인 것만 더 증명되었다..\n그래도 사이는 더 좋아진 것 같다': ['It just proved Sohee only belongs to his aniki..\nBut they seem closer than ever', 'アニキだけのソヒだということがさらに証明された..\nでも仲はもっと良くなったみたい', '只是更加证明了炤熙是大哥专属..\n不过关系好像更好了'],
    '뭔가 준비가 제대로다..': ['The prep is the real deal..', 'なんだか準備が本格的だ..', '准备得还真像样..'],
    '마음 편하게 모든 것을 맡기고 깜짝파티를 즐기기로 했다': ['I decided to leave everything to them and enjoy the surprise party', '安心して全部任せて、サプライズパーティーを楽しむことにした', '决定放心交给他们，好好享受惊喜派对'],
    '긴급상황! 빠르게 연타하세요!': ['Emergency! Tap fast!', '緊急事態！早く連打して！', '紧急情况！快速连点！'],
    '이런.. 예상치 못한 상황에서 민첩하게 대처하지 못했다': ["Oops.. I couldn't react fast enough to the unexpected situation", 'あらら..予想外の状況に素早く対応できなかった', '糟糕..没能在意外情况下迅速应对'],
    '깜짝파티의 흥이 다 깨져버렸다..': ["The surprise party's vibe was completely ruined..", 'サプライズパーティーの盛り上がりが台無しになった..', '惊喜派对的气氛全被破坏了..'],
    '민첩한 하루 되세요': ['Have an agile day', '俊敏な一日を', '祝你度过敏捷的一天'],
    '민첩했다면 다른 결과가 있었을지도?': ["If I'd been quicker, maybe it'd have ended differently?", '俊敏だったら違う結果になったかも？', '如果够敏捷，也许会有不同的结局？'],
    '나의 사랑을 받아줘!': ['Accept my love!', '僕の愛を受け取って！', '接受我的爱吧！'],
    '민첩한 임기응변으로 깜짝파티를 성공했다!': ['Quick thinking saved the surprise party!', '俊敏な機転でサプライズパーティー成功！', '凭借敏捷的随机应变，惊喜派对成功了！'],

    /* ── 혼자 준비 ── */
    '진심을 전하기 위해 쇼타로의 생일을 혼자 열심히 준비해보기로 했다. 계획은 완벽하니까 쇼타로를 기다리자.': ["To show how I really feel, I decided to prepare Shotaro's birthday all by myself. The plan is perfect, so let's wait for Shotaro.", '気持ちを伝えるため、ショウタロウの誕生日を一人で頑張って準備することにした。計画は完璧だから、ショウタロウを待とう。', '为了传达心意，决定独自用心准备将太郎的生日。计划很完美，等将太郎来吧。'],
    '앗! 쇼타로의 발걸음이 예상보다 빠르다.': ['Oh! Shotaro is coming faster than expected.', 'あっ！ショウタロウの足取りが予想より速い。', '啊！将太郎的脚步比预想的快。'],
    '시간에 맞춰 준비해줘!': ['Get ready in time!', '時間内に準備して！', '在时间内准备好！'],
    '6초 미션': ['6-sec mission', '6秒ミッション', '6秒任务'],
    '사스가 댄서 쇼타로는 민첩했다..': ['As expected of a dancer, Shotaro was quick..', 'さすがダンサーのショウタロウは俊敏だった..', '不愧是舞者将太郎，真敏捷..'],
    '준비가 되기 전에 쇼타로가 들어와 깜짝파티를 실패했다…': ['Shotaro walked in before everything was ready and the surprise party failed…', '準備が終わる前にショウタロウが入ってきてサプライズパーティーは失敗した…', '还没准备好将太郎就进来了，惊喜派对失败了…'],
    '팔척수달의 발걸음은 보기보다 빠르답니다': ['The giant otter walks faster than he looks', '八尺カワウソの足取りは見た目より速いんです', '八尺水獭的脚步比看起来快哦'],
    '쇼짱 생일 축하해!': ['Happy birthday, Sho-chan!', 'ショウちゃん誕生日おめでとう！', '小将生日快乐！'],
    '우리 팀에 쇼타로 있다!': ["We've got Shotaro on our team!", 'うちのチームにはショウタロウがいる！', '我们队有将太郎！'],

    /* ── 앤톤 ── */
    '앤톤에게 전화해보자.': ["Let's call Anton.", 'アントンに電話してみよう。', '给安东打个电话吧。'],
    '앤톤에게 전화하는 게 좋을 것 같다': ['I should call Anton', 'アントンに電話したほうがよさそう', '还是给安东打电话比较好'],
    '찬영아? 생일파티 준비 같이 할까?': ['Chanyoung? Wanna plan the birthday party together?', 'チャニョン？誕生日パーティーの準備一緒にする？', '灿荣？要一起准备生日派对吗？'],
    '...들었니?': ['...did you hear?', '...聞いた？', '...听到了吗？'],
    '찬영이가 적극 협조하기로 했다. 행운을 빌어보자.': ["Chanyoung agreed to help all out. Let's wish him luck.", 'チャニョンが全力で協力してくれることになった。幸運を祈ろう。', '灿荣决定全力配合。祝他好运吧。'],
    '찬영이는 선물때문에 고민이 많은것같다..': ['Chanyoung seems to be stressing over the gift..', 'チャニョンはプレゼントのことでかなり悩んでいるみたい..', '灿荣好像在为礼物的事很烦恼..'],
    '잘 해결했는지 연락해보자': ["Let's text him to see if he sorted it out", 'うまく解決したか連絡してみよう', '联系一下看看解决了没'],
    '진행상황을 물어본다': ["Ask how it's going", '進み具合を聞く', '询问进展'],
    '사진 더? 재밌게 놀아?': ['More pics? Have fun?', '写真もっと？楽しんで？', '多发照片？好好玩？'],
    '준비 잘하고 있어?': ['you prepping well?', '準備ちゃんとしてる？', '准备得还好吗？'],
    '형들이 하고 있는데 ㅋㅋㅋ': ['the hyungs are doing it lol', 'ヒョンたちがやってるよｗｗｗ', '哥哥们在弄呢哈哈哈'],
    '우린 데이트중': ["we're on a date", '僕たちはデート中', '我们在约会'],
    '타로형 못보게 내가 데리고 나왔어요 ㅋㅋ': ["i took taro hyung out so he can't see lol", 'タロヒョンに見られないように連れ出しました笑', '我把太郎哥带出来了免得他看到哈哈'],
    '귀여우니까 사진 더 보내': ["You're cute, send more pics", 'かわいいから写真もっと送って', '好可爱 再多发点照片'],
    '재밌게 놀아': ['Have fun', '楽しんでね', '好好玩'],
    '괜히 사진보내다 들키지말구ㅋㅋ': ["don't get caught sending pics lol", '写真送っててバレないようにね笑', '别发照片发到露馅哈哈'],
    '그냥 노는 거 아닌가? 어쨌든 타로에게 들키지는 않을 것 같다..': ["Aren't they just hanging out? Anyway, Taro probably won't find out..", 'ただ遊んでるだけじゃない？とにかくタロにはバレなさそう..', '这不就是在玩吗？总之应该不会被太郎发现..'],
    '이제 감': ['heading over now', '今から行く', '现在过去'],
    '성공 😎': ['success 😎', '成功 😎', '成功 😎'],
    '고기~!': ['Meat~!', 'お肉〜！', '吃肉~！'],
    '고만해라! 기분이 더 좋아지면 어떡하냐!': ['Stop it! What if I get even happier!', 'もうやめて！これ以上機嫌良くなったらどうするの！', '够了！心情再好下去怎么办！'],
    '귀엽네': ['cute', 'かわいいね', '好可爱'],
    '그쵸': ['right?', 'でしょ', '对吧'],
    '그러다 들킨다': ["you'll get caught like that", 'そんなことしてたらバレるよ', '这样会被发现的'],
    '아…': ['ah…', 'あ…', '啊…'],
    '타로형 봄..': ['taro hyung saw..', 'タロヒョン見た..', '太郎哥看到了..'],
    '아….': ['ah….', 'あ….', '啊….'],
    '정확히 걱정하던 일이 벌어졌다': ['Exactly what I was worried about happened', '心配してたことがまさに起きた', '担心的事情果然发生了'],
    '찬영이가 들켜버렸다..': ['Chanyoung got caught..', 'チャニョンがバレてしまった..', '灿荣被发现了..'],
    '너는 아직 어리다': ["You're still young", '君はまだ若い', '你还太嫩了'],
    '🚧 여기부터는 아직 준비 중이에요.': ["🚧 This part isn't ready yet.", '🚧 ここから先はまだ準備中です。', '🚧 这里之后还在准备中。'],

    /* ══════════ 화면 글자 (engine.js / index.html) ══════════ */
    '빠르게 연타하세요!': ['Tap fast!', '早く連打して！', '快速连点！'],
    '메시지': ['Messages', 'メッセージ', '信息'],
    '지금': ['now', '今', '现在'],
    '🎤 음성 메시지': ['🎤 Voice message', '🎤 ボイスメッセージ', '🎤 语音消息'],
    '🚨 긴급상황': ['🚨 Emergency', '🚨 緊急事態', '🚨 紧急情况'],
    '답장해주세요!': ['Reply now!', '返信して！', '请回复！'],
    '알림을 눌러서 답장!': ['Tap the notification to reply!', '通知をタップして返信！', '点击通知回复！'],
    '보내기': ['Send', '送信', '发送'],
    '알 수 없음': ['Unknown', '不明', '未知'],
    '수신 중': ['Incoming', '着信中', '来电中'],
    'FaceTime 비디오…': ['FaceTime Video…', 'FaceTimeビデオ…', 'FaceTime视频…'],
    'FaceTime 비디오': ['FaceTime Video', 'FaceTimeビデオ', 'FaceTime视频'],
    '나중에 알림': ['Remind Me', '後で通知', '稍后提醒'],
    '거절': ['Decline', '拒否', '拒绝'],
    '수락': ['Accept', '応答', '接受'],
    '지금은 받아야 할 것 같다…': ['I should probably answer this…', '今は出たほうがよさそう…', '现在好像得接…'],
    '연결됨': ['Connected', '接続済み', '已连接'],
    '연결 중…': ['Connecting…', '接続中…', '连接中…'],
    '연결 중': ['Connecting', '接続中', '连接中'],
    'FaceTime 종료됨': ['FaceTime Ended', 'FaceTime終了', 'FaceTime已结束'],
    '재생': ['Play', '再生', '播放'],
    '닫기': ['Close', '閉じる', '关闭'],
    '영상을 눌러서 확인하세요': ['Tap the video to watch', '動画をタップして確認しよう', '点击视频查看'],
    '▶ 눌러서 듣기': ['▶ Tap to listen', '▶ タップして聴く', '▶ 点击收听'],
    '전송됨': ['Delivered', '配信済み', '已送达'],
    'TAP ▸ 계속': ['TAP ▸ continue', 'TAP ▸ 続ける', 'TAP ▸ 继续'],
    '알림을 탭하세요': ['Tap the notification', '通知をタップして', '点击通知'],
    '편집': ['Edit', '編集', '编辑'],
    '최근 기록': ['Recents', '履歴', '最近通话'],
    '모두': ['All', 'すべて', '所有'],
    '부재중': ['Missed', '不在着信', '未接来电'],
    '휴대전화': ['mobile', '携帯電話', '手机'],
    '즐겨찾기': ['Favorites', 'よく使う項目', '个人收藏'],
    '연락처': ['Contacts', '連絡先', '通讯录'],
    '키패드': ['Keypad', 'キーパッド', '拨号键盘'],
    '음성 사서함': ['Voicemail', '留守番電話', '语音留言'],
    '{0}에게 전화를 걸어요': ['Call {0}', '{0}に電話をかけよう', '给{0}打电话'],
    '지금은 {0}에게 걸어야 해.': ['I need to call {0} right now.', '今は{0}にかけないと。', '现在得打给{0}。'],
    '전화 거는 중…': ['calling…', '発信中…', '正在呼叫…'],
    '스피커': ['speaker', 'スピーカー', '扬声器'],
    '소리 끔': ['mute', '消音', '静音'],
    '통화 추가': ['add call', '通話追加', '添加通话'],
    '종료': ['end', '終了', '结束'],
    '화면을 탭해서 계속': ['Tap the screen to continue', '画面をタップして続ける', '点击屏幕继续'],
    '1단계 · 성냥에 불을 붙여주세요!': ['Step 1 · Light the match!', 'ステップ1・マッチに火をつけて！', '第1步 · 点燃火柴！'],
    '성냥을 <b>빠르게 연타</b>해서 불을 붙여요!': ['<b>Tap the match fast</b> to light it!', 'マッチを<b>素早く連打</b>して火をつけよう！', '<b>快速连点</b>火柴把它点燃！'],
    '2단계 · 초에 불을 붙여주세요!': ['Step 2 · Light the candle!', 'ステップ2・ろうそくに火をつけて！', '第2步 · 点燃蜡烛！'],
    '불붙은 성냥을 끌어다 <b>심지에 {0}초간</b> 대고 있어요': ['Drag the lit match and hold it <b>on the wick for {0}s</b>', '火のついたマッチをドラッグして<b>芯に{0}秒</b>当ててね', '把点燃的火柴拖过去，<b>在烛芯上停留{0}秒</b>'],
    '3단계 · 불을 꺼주세요!': ['Step 3 · Turn off the lights!', 'ステップ3・電気を消して！', '第3步 · 关灯！'],
    '준비 완료!': ['All set!', '準備完了！', '准备完毕！'],
    '남겨진 한마디': ['A last word', '残された一言', '留下的一句话'],
    '다시 하기': ['Play again', 'もう一度', '再玩一次'],
    '이 엔딩 공유하기': ['Share this ending', 'このエンディングをシェア', '分享这个结局'],
    '다시 듣기': ['Listen again', 'もう一度聴く', '再听一次'],
    '그만 듣기': ['Stop', '聴くのをやめる', '停止收听'],
    '현재까지 {0}/{1}개 엔딩 수집!': ['{0}/{1} endings collected so far!', '現在{0}/{1}個のエンディングを収集！', '目前已收集{0}/{1}个结局！'],
    '라이즈와 함께 쇼타로의 생일파티 준비하기⬇️⬇️': ["Plan Shotaro's birthday party with RIIZE⬇️⬇️", 'RIIZEと一緒にショウタロウの誕生日パーティーを準備しよう⬇️⬇️', '和RIIZE一起准备将太郎的生日派对⬇️⬇️'],
    '시간 초과': ['Time out', '時間切れ', '超时'],
    '미션 성공': ['Mission clear', 'ミッション成功', '任务成功'],
    '미션 실패': ['Mission failed', 'ミッション失敗', '任务失败'],
    '답장 성공': ['Reply sent', '返信成功', '回复成功'],
    '답장 실패': ['Reply failed', '返信失敗', '回复失败'],
    '연타 성공': ['Tapped in time', '連打成功', '连点成功'],
    '연타 실패': ['Too slow', '連打失敗', '连点失败'],
    '준비 중': ['Coming soon', '準備中', '准备中'],
    '엔딩': ['Endings', 'エンディング', '结局'],
    '선택지': ['Choices', '選択肢', '选项'],
    '진행도': ['Progress', '進行度', '进度'],
    '▶ 표시된 지점을 누르면 그 선택지부터 다시 할 수 있어요': ['▶ Tap a marked point to replay from that choice', '▶ マークされた地点をタップすると、その選択肢からやり直せます', '▶ 点击标记的位置，可从该选项重新开始'],
    '타이틀로': ['Title', 'タイトルへ', '返回标题'],
    '처음부터': ['Restart', '最初から', '从头开始'],
    '▶ 시작하기': ['▶ Start', '▶ スタート', '▶ 开始'],
    '스토리 루트': ['Story route', 'ストーリールート', '故事路线'],
    '일시정지됨 · 탭하면 계속': ['Paused · tap to continue', '一時停止中・タップで再開', '已暂停 · 点击继续'],
    '▶ 터치하여 재생': ['▶ Tap to play', '▶ タップして再生', '▶ 点击播放'],
    '소리 끄기/켜기': ['Sound on/off', 'サウンドオン/オフ', '声音开/关'],
    '전체화면': ['Fullscreen', '全画面', '全屏'],
  };

  const fill = (s, a) => a.length ? s.replace(/\{(\d)\}/g, (_, i) => a[+i] ?? '') : s;
  window.LANG = LANG;
  window.LANG_NAMES = { ko: '한국어', en: 'English', ja: '日本語', zh: '中文' };
  window.tr = (s, ...a) => { const t = IDX === undefined ? null : D[s]?.[IDX]; return fill(t ?? s, a); };
  window.setLang = (l) => { try { localStorage.setItem('hbd.lang', l); } catch (e) {} };

  // 지금 시각 문자열 (문자 날짜 구분선)
  window.trNow = (d) => {
    const h = d.getHours(), m = String(d.getMinutes()).padStart(2, '0'), h12 = h % 12 || 12;
    if (LANG === 'en') return `Today ${h12}:${m} ${h < 12 ? 'AM' : 'PM'}`;
    if (LANG === 'ja') return `今日 ${h < 12 ? '午前' : '午後'}${h12}:${m}`;
    if (LANG === 'zh') return `今天 ${h < 12 ? '上午' : '下午'}${h12}:${m}`;
    return `오늘 ${h < 12 ? '오전' : '오후'} ${h12}:${m}`;
  };
  window.trDate = (d) => {
    if (LANG === 'ko') return `${d.getMonth() + 1}월 ${d.getDate()}일 ${'일월화수목금토'[d.getDay()]}요일`;
    return d.toLocaleDateString({ en: 'en-US', ja: 'ja-JP', zh: 'zh-CN' }[LANG], { weekday: 'long', month: 'long', day: 'numeric' });
  };

  if (LANG === 'ko' || !window.STORY) return;

  // index.html 에 박힌 글자
  const pi = document.querySelector('#pause-ind span'); if (pi) pi.textContent = window.tr('일시정지됨 · 탭하면 계속');
  const tp = document.querySelector('#tap-play'); if (tp) tp.textContent = window.tr('▶ 터치하여 재생');
  const bm = document.querySelector('#btn-mute'); if (bm) bm.setAttribute('aria-label', window.tr('소리 끄기/켜기'));
  const bf = document.querySelector('#btn-fs'); if (bf) bf.setAttribute('aria-label', window.tr('전체화면'));

  // 장면 데이터 번역 (그 자리에서 바꿈). 파일 경로·장면 id·플래그 값·쇼타로 음성 자막은 그대로
  const SKIP = new Set(['src', 'thumb', 'avatar', 'callBg', 'next', 'success', 'fail', 'thread', 'set', 'flags', 'sounds', 'titleMedia', 'selfImage', 'start', 'bg', 'type', 'id', 'timeoutNext', 'default', 'initial', 'icon', 'img', 'image', 'poster', 'shareTag', 'kicker', 'title_ko']);
  const seen = new WeakSet();
  const walk = (o) => {
    if (!o || typeof o !== 'object' || seen.has(o)) return;
    seen.add(o);
    for (const k of Object.keys(o)) {
      if (SKIP.has(k)) continue;
      const v = o[k];
      if (k === 'voice' && v && typeof v === 'object') { const { subs, ...rest } = v; walk(rest); Object.assign(v, rest); continue; }
      if (typeof v === 'string') { const t = D[v]?.[IDX]; if (t != null) o[k] = t; }
      else walk(v);
    }
    // 채팅방 프로필 글자: 번역된 방 이름의 첫 글자
    if (typeof o.icon === 'string' && typeof o.title === 'string' && o.icon !== 'R') o.icon = [...o.title][0].toUpperCase();
  };
  // 루트 지도에서 다른 칸과 겹치는 긴 선택지 → 지도에만 짧은 이름
  const SHORT = {
    '광란의 생일파티로 번복한다': ['Wild party!', '狂乱に変更', '改成狂欢派对'],
    '마음을 바꿔서 열받게 하자고 한다': ['Make him mad', 'やっぱり怒らせる', '改成让他生气'],
    '마음을 바꿔서 감동받게 하자고 한다': ['Touch his heart instead', 'やっぱり感動させる', '改成让他感动'],
  };
  for (const sc of Object.values(window.STORY.scenes)) for (const o of sc.choice?.options || []) if (SHORT[o.text]) o.routeText = SHORT[o.text][IDX];
  walk(window.STORY.scenes);
  const C = window.STORY.config;
  ['tagline'].forEach((k) => { if (D[C[k]]) C[k] = D[C[k]][IDX]; });
  if (C.routeStart && D[C.routeStart.title]) C.routeStart.title = D[C.routeStart.title][IDX];
  if (C.phone && D[C.phone.date]) C.phone.date = D[C.phone.date][IDX];
})();
