# Easy Chinese for Myanmar — MVP

ဒီ project သည် HTML/CSS/JavaScript ဖြင့်ရေးထားသော PWA prototype ဖြစ်သည်။

## ယခုအလုပ်လုပ်သောအရာများ
- HSK 1–3 အတွက် နမူနာ vocabulary ၂၀ ခု
- Chinese, Pinyin, မြန်မာအဓိပ္ပာယ်နှင့် search/level filter
- Browser Text-to-Speech ရရှိပါက Mandarin အသံဖွင့်ခြင်း
- Flashcards, မှတ်မိ/ပြန်လေ့ကျင့်ရန်
- ၅ မေးခွန်း Quiz နှင့် local result
- localStorage ဖြင့် progress ကို ဒီ browser/device ထဲသိမ်းခြင်း
- Service Worker ဖြင့် HTTPS/localhost ပေါ်တွင် app files cache လုပ်ခြင်း
- နေ့စဉ်သုံး စကားပြောနှင့် grammar နမူနာ

## မပြီးသေးသောအရာများ
- HSK 1–3 vocabulary အပြည့်အစုံမပါသေးပါ။ ယခုသည် နမူနာ ၂၀ ခုသာဖြစ်သည်။
- AI conversation backend မချိတ်ရသေးပါ။
- Speaking feature သည် browser Speech Recognition ရှိလျှင်သာ transcript စမ်းပြနိုင်ပြီး pronunciation scoring မလုပ်ပါ။
- Offline mode တွင် cached app နှင့် သင်ခန်းစာဒေတာကို အသုံးပြုနိုင်သော်လည်း device/browser အလိုက် Chinese voice မရနိုင်ပါ။
- User account, cloud sync, notifications မပါသေးပါ။

## ဖုန်းတစ်လုံးဖြင့် စမ်းသပ်ရန် (အလွယ်ဆုံး)
1. ZIP ကို extract လုပ်ပါ။
2. `index.html`, `styles.css`, `app.js`, `sw.js`, `manifest.webmanifest`, `icon.svg` ကို HTTPS static hosting တစ်ခုသို့ တင်ပါ။
3. Hosting service က HTTPS URL ပေးမည်။ URL ကို Android Chrome သို့မဟုတ် iPhone Safari တွင်ဖွင့်ပါ။
4. Android Chrome: menu (⋮) → Install app / Add to Home screen။
5. iPhone Safari: Share → Add to Home Screen။
6. App ကို online ရှိစဉ် အရင်ဖွင့်ထားပြီးမှ offline စမ်းပါ။ Service Worker ပထမဆုံး cache လုပ်ရန် online load လိုသည်။

## Local development
Service Worker သည် `file://` URL မှ အလုပ်лахгүй။ Local server သုံးပါ:
- Computer: `python -m http.server 8000`, ပြီးလျှင် `http://localhost:8000`
- Phone-only: ဖိုင်ကို HTTPS static hosting သို့တင်ခြင်းသည် ပိုလွယ်သည်။

## အခမဲ့ hosting
GitHub Pages သို့မဟုတ် Cloudflare Pages ကဲ့သို့ static hosting ကို အသုံးပြုနိုင်သည်။ Platform UI ပြောင်းလဲနိုင်သောကြောင့် hosting provider ၏ လက်ရှိလမ်းညွှန်ကိုလိုက်နာပါ။

## Security note
နောင် AI chat ထည့်သည့်အခါ API key ကို `app.js` ထဲ မထည့်ပါနှင့်။ Backend/server-side function မှတစ်ဆင့် ခေါ်ပါ။
