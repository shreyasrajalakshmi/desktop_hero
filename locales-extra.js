// Lines for Robo Buddy. Same shape as the other heroes (gender -> lines), placeholders {name}.
// He speaks the same way to everyone, so the lines are shared across genders.
const same = lines => ({ male: lines, female: lines, other: lines });

const ROBOBUDDY_QUIPS = {
  english:   ["Beep boop! Hydration levels low, {name}. Please drink water.", "System check: posture suboptimal. Sit up straight, {name}!", "I calculated a 100% chance you deserve a break."],
  manglish:  ["Beep boop! {name}, vellam kudikkaan neram aayi, please!", "System check: posture shariyalla. Nere irikku, {name}!", "Njan kanakkaakki: ninakku oru break venam, 100% sure!"],
  malayalam: ["ബീപ് ബൂപ്! {name}, വെള്ളം കുടിക്കാൻ സമയമായി, ദയവായി!", "സിസ്റ്റം ചെക്ക്: പോസ്ചർ ശരിയല്ല. നേരെ ഇരിക്കൂ, {name}!", "ഞാൻ കണക്കുകൂട്ടി: നിനക്ക് ഒരു ബ്രേക്ക് വേണം, 100% ഉറപ്പ്!"],
  hinglish:  ["Beep boop! {name}, paani peene ka time ho gaya, please!", "System check: posture theek nahi hai. Seedha baitho, {name}!", "Maine calculate kiya: tumhe break chahiye, 100% pakka!"],
  hindi:     ["बीप बूप! {name}, पानी पीने का टाइम हो गया, प्लीज़!", "सिस्टम चेक: पोस्चर ठीक नहीं है। सीधे बैठो, {name}!", "मैंने कैलकुलेट किया: तुम्हें ब्रेक चाहिए, 100% पक्का!"],
  tanglish:  ["Beep boop! {name}, thanni kudikka neram aachu, please!", "System check: posture sariyilla. Nimirndhu ukkaarunga, {name}!", "Naan calculate pannitten: ungalukku break venum, 100% sure!"],
  tamil:     ["பீப் பூப்! {name}, தண்ணி குடிக்க நேரம் ஆச்சு, ப்ளீஸ்!", "சிஸ்டம் செக்: போஸ்சர் சரியில்ல. நிமிர்ந்து உக்காருங்க, {name}!", "நான் கணக்கு பண்ணிட்டேன்: உங்களுக்கு ப்ரேக் வேணும், 100% உறுதி!"],
  kanglish:  ["Beep boop! {name}, neeru kudiyo samaya aayithu, please!", "System check: posture sari illa. Neraagi kooturi, {name}!", "Naanu lekka haakide: nimge break beku, 100% khachita!"],
  kannada:   ["ಬೀಪ್ ಬೂಪ್! {name}, ನೀರು ಕುಡಿಯೋ ಸಮಯ ಆಯಿತು, ಪ್ಲೀಸ್!", "ಸಿಸ್ಟಮ್ ಚೆಕ್: ಪೋಸ್ಚರ್ ಸರಿ ಇಲ್ಲ. ನೇರವಾಗಿ ಕೂತ್ಕೊಳ್ಳಿ, {name}!", "ನಾನು ಲೆಕ್ಕ ಹಾಕಿದ್ದೇನೆ: ನಿಮಗೆ ಬ್ರೇಕ್ ಬೇಕು, 100% ಖಚಿತ!"]
};

for (const [lang, lines] of Object.entries(ROBOBUDDY_QUIPS)) {
  if (LOCALES[lang]) LOCALES[lang].quips.robobuddy = same(lines);
}

// Characters without lines of their own (everyone added later) share this neutral set.
const GENERIC_QUIPS = {
  english:   ["Just hanging around, {name}! Don't forget to drink some water.", "Psst, {name}: sit up straight and rest your eyes for a moment!", "I'm on break-reminder duty. Stretch time, {name}!"],
  manglish:  ["Njan ingane thookki kidakkunnu, {name}! Vellam kudikkaan marakkalle.", "Psst, {name}: nere irikku, kannu onnu vishramikkatte!", "Njan break-reminder duty-yil aanu. Stretch cheyyaan neram aayi, {name}!"],
  malayalam: ["ഞാൻ ഇങ്ങനെ തൂങ്ങിക്കിടക്കുകയാണ്, {name}! വെള്ളം കുടിക്കാൻ മറക്കല്ലേ.", "ശ്ശ്, {name}: നേരെ ഇരിക്കൂ, കണ്ണിന് ഒരു വിശ്രമം കൊടുക്കൂ!", "ഞാൻ ബ്രേക്ക് ഓർമ്മപ്പെടുത്തുന്ന ഡ്യൂട്ടിയിലാണ്. സ്ട്രെച്ച് ചെയ്യാനുള്ള സമയമായി, {name}!"],
  hinglish:  ["Bas yahin latka hua hoon, {name}! Paani peena mat bhoolna.", "Psst, {name}: seedha baitho aur aankhon ko thoda aaram do!", "Main break-reminder duty par hoon. Stretch time, {name}!"],
  hindi:     ["बस यहीं लटका हुआ हूँ, {name}! पानी पीना मत भूलना।", "श्श, {name}: सीधे बैठो और आँखों को थोड़ा आराम दो!", "मैं ब्रेक-रिमाइंडर ड्यूटी पर हूँ। स्ट्रेच का टाइम, {name}!"],
  tanglish:  ["Naan inga thongitu irukken, {name}! Thanni kudikka marakkaadheenga.", "Psst, {name}: nimirndhu ukkaarunga, kannukku konjam rest kudunga!", "Naan break-reminder duty-la irukken. Stretch neram, {name}!"],
  tamil:     ["நான் இங்க தொங்கிட்டு இருக்கேன், {name}! தண்ணி குடிக்க மறக்காதீங்க.", "ஷ்ஷ், {name}: நிமிர்ந்து உக்காருங்க, கண்ணுக்கு கொஞ்சம் ரெஸ்ட் குடுங்க!", "நான் ப்ரேக் ரிமைண்டர் டியூட்டில இருக்கேன். ஸ்ட்ரெட்ச் நேரம், {name}!"],
  kanglish:  ["Naanu illi thongkondu iddini, {name}! Neeru kudiyodu marebedi.", "Psst, {name}: neraagi kooturi, kannige swalpa rest kodi!", "Naanu break-reminder duty alli iddini. Stretch samaya, {name}!"],
  kannada:   ["ನಾನು ಇಲ್ಲಿ ತೂಗಾಡ್ತಿದ್ದೀನಿ, {name}! ನೀರು ಕುಡಿಯೋದು ಮರೀಬೇಡಿ.", "ಶ್ಶ್, {name}: ನೇರವಾಗಿ ಕೂತ್ಕೊಳ್ಳಿ, ಕಣ್ಣಿಗೆ ಸ್ವಲ್ಪ ರೆಸ್ಟ್ ಕೊಡಿ!", "ನಾನು ಬ್ರೇಕ್ ರಿಮೈಂಡರ್ ಡ್ಯೂಟಿಯಲ್ಲಿದ್ದೀನಿ. ಸ್ಟ್ರೆಚ್ ಸಮಯ, {name}!"]
};
for (const [lang, lines] of Object.entries(GENERIC_QUIPS)) {
  if (LOCALES[lang]) LOCALES[lang].quips.generic = same(lines);
}
