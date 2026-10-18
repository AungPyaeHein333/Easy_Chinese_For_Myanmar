const WORDS = [
 {id:1,level:1,hanzi:"你好",pinyin:"nǐ hǎo",meaning:"မင်္ဂလာပါ",example:"你好！"},
 {id:2,level:1,hanzi:"谢谢",pinyin:"xièxie",meaning:"ကျေးဇူးတင်ပါတယ်",example:"谢谢你！"},
 {id:3,level:1,hanzi:"再见",pinyin:"zàijiàn",meaning:"ပြန်တွေ့မယ် / နှုတ်ဆက်ပါတယ်",example:"明天再见。"},
 {id:4,level:1,hanzi:"我",pinyin:"wǒ",meaning:"ကျွန်တော် / ကျွန်မ",example:"我是学生。"},
 {id:5,level:1,hanzi:"你",pinyin:"nǐ",meaning:"မင်း / သင်",example:"你好吗？"},
 {id:6,level:1,hanzi:"是",pinyin:"shì",meaning:"ဖြစ်သည် / ဟုတ်သည်",example:"我是学生。"},
 {id:7,level:1,hanzi:"不",pinyin:"bù",meaning:"မ… / မဟုတ်",example:"我不是老师。"},
 {id:8,level:1,hanzi:"人",pinyin:"rén",meaning:"လူ",example:"中国人。"},
 {id:9,level:1,hanzi:"好",pinyin:"hǎo",meaning:"ကောင်းသော / ကောင်းတယ်",example:"很好。"},
 {id:10,level:1,hanzi:"中国",pinyin:"Zhōngguó",meaning:"တရုတ်နိုင်ငံ",example:"我去中国。"},
 {id:11,level:2,hanzi:"朋友",pinyin:"péngyou",meaning:"သူငယ်ချင်း",example:"他是我的朋友。"},
 {id:12,level:2,hanzi:"喜欢",pinyin:"xǐhuan",meaning:"နှစ်သက်သည် / ကြိုက်သည်",example:"我喜欢中文。"},
 {id:13,level:2,hanzi:"学习",pinyin:"xuéxí",meaning:"လေ့လာသည် / သင်ယူသည်",example:"我学习汉语。"},
 {id:14,level:2,hanzi:"今天",pinyin:"jīntiān",meaning:"ဒီနေ့",example:"今天很热。"},
 {id:15,level:2,hanzi:"因为",pinyin:"yīnwèi",meaning:"အကြောင်းမှာ / ဘာကြောင့်လဲဆိုတော့",example:"因为我很忙。"},
 {id:16,level:2,hanzi:"觉得",pinyin:"juéde",meaning:"ထင်သည် / ခံစားရသည်",example:"我觉得很好。"},
 {id:17,level:3,hanzi:"准备",pinyin:"zhǔnbèi",meaning:"ပြင်ဆင်သည်",example:"我准备好了。"},
 {id:18,level:3,hanzi:"开始",pinyin:"kāishǐ",meaning:"စတင်သည်",example:"现在开始。"},
 {id:19,level:3,hanzi:"帮助",pinyin:"bāngzhù",meaning:"ကူညီသည်",example:"谢谢你的帮助。"},
 {id:20,level:3,hanzi:"重要",pinyin:"zhòngyào",meaning:"အရေးကြီးသော",example:"学习很重要。"}
];
const $ = id => document.getElementById(id);
const load = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
let learned = load("ecm-learned", []);
let mastered = load("ecm-mastered", []);
let cardIndex = 0, cardRevealed = false;
let quizQuestions = [], quizIndex = 0, quizCorrect = 0, quizAnswered = false;

function updateStats(){
  $("learned-count").textContent = learned.length;
  $("mastered-count").textContent = mastered.length;
  const score = load("ecm-last-score", null);
  $("quiz-score").textContent = score === null ? "—" : `${score}%`;
}
function filteredWords(){
  const level = $("level-filter").value, q = $("search").value.trim().toLowerCase();
  return WORDS.filter(w => (level === "all" || String(w.level) === level) &&
    (!q || `${w.hanzi} ${w.pinyin} ${w.meaning}`.toLowerCase().includes(q)));
}
function renderWords(){
  const words = filteredWords();
  $("word-list").innerHTML = words.length ? words.map(w => `
    <article class="word-card">
      <div class="hanzi">${w.hanzi}</div>
      <div class="word-info"><strong>${w.meaning}</strong><p class="pinyin">${w.pinyin}</p><span class="meaning">HSK ${w.level} · ${w.example}</span></div>
      <div class="word-actions"><button class="icon-btn" data-speak="${w.id}" aria-label="အသံထွက်နားထောင်ရန်">🔊</button><button class="icon-btn ${learned.includes(w.id) ? "done" : ""}" data-learn="${w.id}" aria-label="သင်ပြီးမှတ်ရန်">${learned.includes(w.id) ? "✓" : "+"}</button></div>
    </article>`).join("") : `<p class="muted">ရှာဖွေမှုနဲ့ ကိုက်ညီတဲ့ စကားလုံးမရှိပါ။</p>`;
}
function speak(text){
  if (!("speechSynthesis" in window)) { alert("ဒီ browser မှာ Text-to-Speech မပံ့ပိုးပါ။"); return; }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN"; utterance.rate = 0.82;
  const voices = window.speechSynthesis.getVoices();
  const zhVoice = voices.find(v => v.lang.toLowerCase().startsWith("zh"));
  if (zhVoice) utterance.voice = zhVoice;
  window.speechSynthesis.speak(utterance);
}
function switchView(view){
  document.querySelectorAll(".view").forEach(el => el.classList.add("hidden"));
  $(`${view}-view`).classList.remove("hidden");
  document.querySelectorAll(".tab").forEach(el => el.classList.toggle("active", el.dataset.view === view));
  if(view === "flashcards") renderCard();
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll(".tab").forEach(btn => btn.addEventListener("click", () => switchView(btn.dataset.view)));
$("search").addEventListener("input", renderWords);
$("level-filter").addEventListener("change", renderWords);
$("word-list").addEventListener("click", e => {
  const speakBtn = e.target.closest("[data-speak]");
  const learnBtn = e.target.closest("[data-learn]");
  if(speakBtn){ const w = WORDS.find(x => x.id === Number(speakBtn.dataset.speak)); if(w) speak(w.hanzi); }
  if(learnBtn){ const id = Number(learnBtn.dataset.learn); learned = learned.includes(id) ? learned.filter(x=>x!==id) : [...learned,id]; save("ecm-learned",learned); renderWords(); updateStats(); }
});
function cardWords(){ return WORDS; }
function renderCard(){
  const words = cardWords(); if(!words.length) return;
  cardIndex = (cardIndex + words.length) % words.length;
  const w = words[cardIndex]; cardRevealed = false;
  $("card-label").textContent = `HSK ${w.level} · စကားလုံး`;
  $("card-hanzi").textContent = w.hanzi; $("card-pinyin").textContent = w.pinyin;
  $("card-answer").textContent = w.meaning; $("card-answer").classList.add("hidden");
  $("flip-card").textContent = "အဖြေကြည့်ရန်";
  $("tap-hint").textContent = "အဖြေကြည့်ရန် ကတ်ကိုနှိပ်ပါ";
  $("card-position").textContent = `${cardIndex+1} / ${words.length}`;
}
function flipCard(){
  cardRevealed = !cardRevealed;
  $("card-answer").classList.toggle("hidden", !cardRevealed);
  $("flip-card").textContent = cardRevealed ? "မေးခွန်းပြန်ကြည့်ရန်" : "အဖြေကြည့်ရန်";
}
$("flashcard").addEventListener("click", flipCard);
$("flashcard").addEventListener("keydown", e => {if(e.key==="Enter"||e.key===" "){e.preventDefault();flipCard();}});
$("flip-card").addEventListener("click", flipCard);
$("prev-card").addEventListener("click",()=>{cardIndex--;renderCard();});
$("next-card").addEventListener("click",()=>{cardIndex++;renderCard();});
$("mark-known").addEventListener("click",()=>{const id=cardWords()[cardIndex].id;if(!mastered.includes(id))mastered.push(id);if(!learned.includes(id))learned.push(id);save("ecm-mastered",mastered);save("ecm-learned",learned);updateStats();renderWords();cardIndex++;renderCard();});
$("mark-review").addEventListener("click",()=>{const id=cardWords()[cardIndex].id;mastered=mastered.filter(x=>x!==id);save("ecm-mastered",mastered);updateStats();cardIndex++;renderCard();});

function makeQuiz(){
  quizQuestions = [...WORDS].sort(()=>Math.random()-.5).slice(0,5).map(w=>{
    const wrong = WORDS.filter(x=>x.id!==w.id).sort(()=>Math.random()-.5).slice(0,3);
    const options = [...wrong,w].sort(()=>Math.random()-.5);
    return {word:w,options};
  });
  quizIndex=0;quizCorrect=0;quizAnswered=false;renderQuestion();
}
function renderQuestion(){
  const q=quizQuestions[quizIndex]; if(!q) return;
  $("question-number").textContent=`မေးခွန်း ${quizIndex+1} / ${quizQuestions.length}`;
  $("quiz-progress").textContent=`${quizCorrect} မှန်`;
  $("quiz-question").textContent=`“${q.word.meaning}” ကို တရုတ်လို ဘယ်လိုရေးသလဲ?`;
  $("quiz-options").innerHTML=q.options.map(w=>`<button class="option" data-answer="${w.id}">${w.hanzi} <span class="muted">· ${w.pinyin}</span></button>`).join("");
  $("quiz-feedback").textContent=""; $("next-question").classList.add("hidden"); $("restart-quiz").classList.add("hidden");
  quizAnswered=false;
}
$("quiz-options").addEventListener("click",e=>{
  const btn=e.target.closest("[data-answer]");if(!btn||quizAnswered)return;quizAnswered=true;
  const selected=Number(btn.dataset.answer), correct=quizQuestions[quizIndex].word.id;
  document.querySelectorAll(".option").forEach(b=>{b.disabled=true;if(Number(b.dataset.answer)===correct)b.classList.add("correct");});
  if(selected===correct){quizCorrect++;$("quiz-feedback").textContent="မှန်ပါတယ်! 很好！";}else{btn.classList.add("wrong");$("quiz-feedback").textContent=`အဖြေမှန်က ${quizQuestions[quizIndex].word.hanzi} (${quizQuestions[quizIndex].word.pinyin}) ဖြစ်ပါတယ်။`;}
  $("quiz-progress").textContent=`${quizCorrect} မှန်`;
  if(quizIndex<quizQuestions.length-1)$("next-question").classList.remove("hidden");
  else{$("restart-quiz").classList.remove("hidden");const score=Math.round(quizCorrect/quizQuestions.length*100);save("ecm-last-score",score);updateStats();$("quiz-feedback").textContent+=` နောက်ဆုံးရမှတ် ${score}%`; }
});
$("next-question").addEventListener("click",()=>{quizIndex++;renderQuestion();});
$("restart-quiz").addEventListener("click",makeQuiz);
$("speak-dialogue").addEventListener("click",()=>speak("你好！你好吗？"));
$("start-speaking").addEventListener("click",()=>{
  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!Recognition){$("speech-result").textContent="ဒီ browser မှာ Speech Recognition မရနိုင်ပါ။ အပေါ်က 🔊 ခလုတ်နဲ့ နားထောင်ပြီး ကိုယ်တိုင် လိုက်ပြောနိုင်ပါတယ်။";return;}
  const rec=new Recognition();rec.lang="zh-CN";rec.interimResults=false;rec.maxAlternatives=3;
  $("speech-result").textContent="နားထောင်နေပါတယ်… တရုတ်လို “谢谢你” လို့ ပြောပါ။";
  rec.onresult=e=>{const text=e.results[0][0].transcript;$("speech-result").textContent=`Browser ကြားလိုက်တာ — ${text}. အသံထွက်ကို ဒီ MVP မှာ အလိုအလျောက် အမှတ်မပေးသေးပါ။`;};
  rec.onerror=()=>{$("speech-result").textContent="အသံမဖတ်နိုင်ပါ။ Microphone permission နဲ့ Internet connection ကို စစ်ပါ။";};
  try{rec.start();}catch{$("speech-result").textContent="Speech Recognition စတင်မရပါ။ ထပ်စမ်းကြည့်ပါ။";}
});
$("ai-info").addEventListener("click",()=>$("ai-note").classList.toggle("hidden"));

function updateConnection(){
  const online=navigator.onLine;
  $("connection").textContent=online?"● Online":"● Offline";
  $("connection").style.background=online?"var(--mint)":"#fff0d7";
  $("connection").style.color=online?"var(--green)":"#875c12";
}
window.addEventListener("online",updateConnection);window.addEventListener("offline",updateConnection);
if("serviceWorker" in navigator && (location.protocol==="https:"||location.hostname==="localhost")){
  window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(err=>console.warn("SW registration failed",err)));
}
renderWords();updateStats();renderCard();makeQuiz();updateConnection();
