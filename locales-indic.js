// Hindi, Tamil and Kannada dialogue. Each language comes in two forms, like Manglish/Malayalam:
//   hinglish / tanglish / kanglish : the language written in English letters
//   hindi / tamil / kannada        : the language in its own script
// Same shape as locales.js: category -> gender ('male' | 'female' | 'other') -> lines,
// placeholders {name} and {time}. Added to the shared LOCALES object.
Object.assign(LOCALES, {

  // ------------------------------------------------------------------ Hindi (Latin letters)
  hinglish: {
    water: {
      male: [
        "{name} bhai, thoda paani pee lo, hydration zaroori hai!",
        "Arre yaar {name}, bahut der ho gayi, ek glass paani pee lo!",
        "Bhai, dehydration ho jayega, paani pee le!"
      ],
      female: [
        "{name}, thoda paani pee lo, hydration zaroori hai!",
        "Hey {name}, bahut der se kaam kar rahi ho, thoda paani pee lo!",
        "Arre {name}, ek glass paani pee lo, fresh feel hoga!"
      ],
      other: [
        "Hey {name}, paani peene ka time ho gaya!",
        "{name}, paani peena mat bhoolna!",
        "Ek glass paani pee lo, {name}, achha lagega!"
      ]
    },
    rest: {
      male: [
        "Bahut der se screen dekh rahe ho, {name}, thoda break lo aur stretch karo!",
        "Bhai, aankhon ko aaram do, 20 second door dekho!",
        "Chalo {name}, thoda ghoom aao, fresh ho jaoge!"
      ],
      female: [
        "Bahut der se screen dekh rahi ho, {name}, thoda break lo aur stretch karo!",
        "Hey {name}, aankhon ko aaram do, thodi door dekho!",
        "Chalo {name}, thoda tehal aao, achha lagega!"
      ],
      other: [
        "Hey {name}, screen se ek chhota break le lo!",
        "Stretch time, {name}! Kandhe ghumao aur door dekho.",
        "Aankhon ko aaram do, {name}, 20 second door dekho!"
      ]
    },
    time: {
      male: [
        "{name} bhai, {time} ho gaya!",
        "Yaar, {time} ho gaye, time kaise udta hai!",
        "Dhyan do {name}, ghadi mein {time} hai."
      ],
      female: [
        "Hey {name}, {time} ho gaya!",
        "Bas bata doon, {name}, {time} ho gaya hai.",
        "Time check, {name}: {time}!"
      ],
      other: [
        "Hey {name}, {time} ho gaya!",
        "Abhi {time} hai, {name}.",
        "Dhyan do, {time} ho gaya!"
      ]
    },
    greet: {
      male: [
        "Kya haal hai {name} bhai! Aaj ka din mast jaye!",
        "Welcome back, bhai! Main yahin latka hua tha.",
        "Hey {name}! Tumhara companion hazir hai!"
      ],
      female: [
        "Hey {name}! Aaj ka din shaandaar ho!",
        "Welcome back, {name}! Main yahin latka hua tha.",
        "Hi {name}! Tumhara companion hazir hai!"
      ],
      other: [
        "Hey {name}! Aaj ka din shaandaar ho!",
        "Welcome back, {name}! Main yahin latka hua tha.",
        "Hi {name}! Main hazir hoon!"
      ]
    },
    quips: {
      spiderman: {
        male: [
          "Bas yahin latka hua hoon, bhai... roz ki tarah!",
          "Bade power ke saath badi boredom aati hai. Entertain karo, {name}!",
          "Mera spider-sense kehta hai, tumhe bhookh lagi hai, yaar!"
        ],
        female: [
          "Hey {name}, bas yahin latka hua hoon... roz ki tarah!",
          "Bade power ke saath badi boredom aati hai. Entertain karo, {name}!",
          "Mera spider-sense kehta hai, tumhe bhookh lagi hai!"
        ],
        other: [
          "Bas yahin latka hua hoon, {name}... roz ki tarah!",
          "Bade power ke saath badi boredom aati hai. Entertain karo!",
          "Mera spider-sense kehta hai, kuch khana chahiye."
        ]
      },
    }
  },

  // ------------------------------------------------------------------ Hindi (हिंदी)
  hindi: {
    water: {
      male: [
        "{name} भाई, थोड़ा पानी पी लो, हाइड्रेशन ज़रूरी है!",
        "अरे यार {name}, बहुत देर हो गई, एक गिलास पानी पी लो!",
        "भाई, डिहाइड्रेशन हो जाएगा, पानी पी ले!"
      ],
      female: [
        "{name}, थोड़ा पानी पी लो, हाइड्रेशन ज़रूरी है!",
        "हे {name}, बहुत देर से काम कर रही हो, थोड़ा पानी पी लो!",
        "अरे {name}, एक गिलास पानी पी लो, फ्रेश फील होगा!"
      ],
      other: [
        "हे {name}, पानी पीने का टाइम हो गया!",
        "{name}, पानी पीना मत भूलना!",
        "एक गिलास पानी पी लो, {name}, अच्छा लगेगा!"
      ]
    },
    rest: {
      male: [
        "बहुत देर से स्क्रीन देख रहे हो, {name}, थोड़ा ब्रेक लो और स्ट्रेच करो!",
        "भाई, आँखों को आराम दो, 20 सेकंड दूर देखो!",
        "चलो {name}, थोड़ा घूम आओ, फ्रेश हो जाओगे!"
      ],
      female: [
        "बहुत देर से स्क्रीन देख रही हो, {name}, थोड़ा ब्रेक लो और स्ट्रेच करो!",
        "हे {name}, आँखों को आराम दो, थोड़ी दूर देखो!",
        "चलो {name}, थोड़ा टहल आओ, अच्छा लगेगा!"
      ],
      other: [
        "हे {name}, स्क्रीन से एक छोटा ब्रेक ले लो!",
        "स्ट्रेच का टाइम, {name}! कंधे घुमाओ और दूर देखो।",
        "आँखों को आराम दो, {name}, 20 सेकंड दूर देखो!"
      ]
    },
    time: {
      male: [
        "{name} भाई, {time} हो गया!",
        "यार, {time} हो गए, वक़्त कैसे उड़ता है!",
        "ध्यान दो {name}, घड़ी में {time} है।"
      ],
      female: [
        "हे {name}, {time} हो गया!",
        "बस बता दूँ, {name}, {time} हो गया है।",
        "टाइम चेक, {name}: {time}!"
      ],
      other: [
        "हे {name}, {time} हो गया!",
        "अभी {time} है, {name}।",
        "ध्यान दो, {time} हो गया!"
      ]
    },
    greet: {
      male: [
        "क्या हाल है {name} भाई! आज का दिन मस्त जाए!",
        "वेलकम बैक, भाई! मैं यहीं लटका हुआ था।",
        "हे {name}! तुम्हारा कंपैनियन हाज़िर है!"
      ],
      female: [
        "हे {name}! आज का दिन शानदार हो!",
        "वेलकम बैक, {name}! मैं यहीं लटका हुआ था।",
        "हाय {name}! तुम्हारा कंपैनियन हाज़िर है!"
      ],
      other: [
        "हे {name}! आज का दिन शानदार हो!",
        "वेलकम बैक, {name}! मैं यहीं लटका हुआ था।",
        "हाय {name}! मैं हाज़िर हूँ!"
      ]
    },
    quips: {
      spiderman: {
        male: [
          "बस यहीं लटका हुआ हूँ, भाई... रोज़ की तरह!",
          "बड़े पावर के साथ बड़ी बोरियत आती है। एंटरटेन करो, {name}!",
          "मेरा स्पाइडर-सेंस कहता है, तुम्हें भूख लगी है, यार!"
        ],
        female: [
          "हे {name}, बस यहीं लटका हुआ हूँ... रोज़ की तरह!",
          "बड़े पावर के साथ बड़ी बोरियत आती है। एंटरटेन करो, {name}!",
          "मेरा स्पाइडर-सेंस कहता है, तुम्हें भूख लगी है!"
        ],
        other: [
          "बस यहीं लटका हुआ हूँ, {name}... रोज़ की तरह!",
          "बड़े पावर के साथ बड़ी बोरियत आती है। एंटरटेन करो!",
          "मेरा स्पाइडर-सेंस कहता है, कुछ खाना चाहिए।"
        ]
      },
    }
  },

  // ------------------------------------------------------------------ Tamil (Latin letters)
  tanglish: {
    water: {
      male: [
        "{name} machan, konjam thanni kudi pa, romba neram aachu!",
        "Dei {name}, thanni kudikka marakkaadha!",
        "Machan, dehydration aayidum, oru glass thanni kudichitu vaa!"
      ],
      female: [
        "{name}, konjam thanni kudi pa, romba neram aachu!",
        "Hey {name}, romba neram velai pannura, konjam thanni kudi!",
        "{name} ma, oru glass thanni kudichitu vaa, fresh-a irukkum!"
      ],
      other: [
        "Hey {name}, thanni kudikka neram aachu!",
        "{name}, thanni kudikka marakkaadheenga!",
        "Oru glass thanni kudinga, {name}, nalla irukkum!"
      ]
    },
    rest: {
      male: [
        "Romba nerama screen pakara, {name}, konjam rest eduthu stretch pannu!",
        "Machan, kannukku rest kudu, konjam dhoorama paaru!",
        "Dei {name}, konjam nadandhutu vaa, fresh-a irukkum!"
      ],
      female: [
        "Romba nerama screen pakkura, {name}, konjam rest eduthu stretch pannu!",
        "Hey {name}, kannukku rest kudu, konjam dhoorama paaru!",
        "{name} ma, konjam nadandhutu vaa, nalla irukkum!"
      ],
      other: [
        "Hey {name}, screen-la irundhu oru chinna break edunga!",
        "Stretch time, {name}! Thozhai suthi, dhoorama paarunga.",
        "Kannukku rest kudunga, {name}, 20 second dhoorama paarunga!"
      ]
    },
    time: {
      male: [
        "{name} machan, {time} aachu!",
        "Dei, {time} aachu, neram eppadi parakkudhu!",
        "Gavanam {name}, clock-la {time} aachu."
      ],
      female: [
        "Hey {name}, {time} aachu!",
        "Sollanum nu, {name}, {time} aachu.",
        "Time check, {name}: {time}!"
      ],
      other: [
        "Hey {name}, {time} aachu!",
        "Ippo {time}, {name}.",
        "Gavanam, {time} aachu!"
      ]
    },
    greet: {
      male: [
        "Enna {name} machan! Innikku nalla naal-a irukkattum!",
        "Welcome back, machan! Naan inga dhaan thongitu irundhen.",
        "Hey {name}! Un companion ready!"
      ],
      female: [
        "Hey {name}! Innikku arumaiyana naal-a irukkattum!",
        "Welcome back, {name}! Naan inga dhaan thongitu irundhen.",
        "Hi {name}! Un companion ready!"
      ],
      other: [
        "Hey {name}! Innikku nalla naal-a irukkattum!",
        "Welcome back, {name}! Naan inga dhaan thongitu irundhen.",
        "Hi {name}! Naan ready!"
      ]
    },
    quips: {
      spiderman: {
        male: [
          "Machan, naan ippadi thongitu irukken, unakku enna velai, {name}?",
          "Periya power-oda periya boredom varum. Entertain pannu, {name}!",
          "En spider-sense solludhu, unakku pasikkudhu, dei!"
        ],
        female: [
          "Hey {name}, naan ippadi thongitu irukken, unakku enna velai?",
          "Periya power-oda periya boredom varum. Entertain pannu, {name}!",
          "En spider-sense solludhu, unakku pasikkudhu, {name}!"
        ],
        other: [
          "Naan thala keezha thongitu irukken, adhu dhaan en style, {name}!",
          "En spider-sense solludhu, edhavadhu saapdalaam.",
          "Periya power-oda periya boredom varum. Entertain pannunga!"
        ]
      },
    }
  },

  // ------------------------------------------------------------------ Tamil (தமிழ்)
  tamil: {
    water: {
      male: [
        "{name} மச்சான், கொஞ்சம் தண்ணி குடி பா, ரொம்ப நேரம் ஆச்சு!",
        "டேய் {name}, தண்ணி குடிக்க மறக்காதே!",
        "மச்சான், டீஹைட்ரேஷன் ஆயிடும், ஒரு கிளாஸ் தண்ணி குடிச்சிட்டு வா!"
      ],
      female: [
        "{name}, கொஞ்சம் தண்ணி குடி பா, ரொம்ப நேரம் ஆச்சு!",
        "ஹே {name}, ரொம்ப நேரம் வேலை பண்றே, கொஞ்சம் தண்ணி குடி!",
        "{name} மா, ஒரு கிளாஸ் தண்ணி குடிச்சிட்டு வா, ஃப்ரெஷ்ஷா இருக்கும்!"
      ],
      other: [
        "ஹே {name}, தண்ணி குடிக்க நேரம் ஆச்சு!",
        "{name}, தண்ணி குடிக்க மறக்காதீங்க!",
        "ஒரு கிளாஸ் தண்ணி குடிங்க, {name}, நல்லா இருக்கும்!"
      ]
    },
    rest: {
      male: [
        "ரொம்ப நேரமா ஸ்கிரீன் பாக்குற, {name}, கொஞ்சம் ரெஸ்ட் எடுத்து ஸ்ட்ரெட்ச் பண்ணு!",
        "மச்சான், கண்ணுக்கு ரெஸ்ட் குடு, கொஞ்சம் தூரமா பாரு!",
        "டேய் {name}, கொஞ்சம் நடந்துட்டு வா, ஃப்ரெஷ்ஷா இருக்கும்!"
      ],
      female: [
        "ரொம்ப நேரமா ஸ்கிரீன் பாக்குற, {name}, கொஞ்சம் ரெஸ்ட் எடுத்து ஸ்ட்ரெட்ச் பண்ணு!",
        "ஹே {name}, கண்ணுக்கு ரெஸ்ட் குடு, கொஞ்சம் தூரமா பாரு!",
        "{name} மா, கொஞ்சம் நடந்துட்டு வா, நல்லா இருக்கும்!"
      ],
      other: [
        "ஹே {name}, ஸ்கிரீன்ல இருந்து ஒரு சின்ன பிரேக் எடுங்க!",
        "ஸ்ட்ரெட்ச் டைம், {name}! தோள்களை சுத்தி, தூரமா பாருங்க.",
        "கண்ணுக்கு ரெஸ்ட் குடுங்க, {name}, 20 செகண்ட் தூரமா பாருங்க!"
      ]
    },
    time: {
      male: [
        "{name} மச்சான், {time} ஆச்சு!",
        "டேய், {time} ஆச்சு, நேரம் எப்படி பறக்குது!",
        "கவனி {name}, கிளாக்ல {time} ஆச்சு."
      ],
      female: [
        "ஹே {name}, {time} ஆச்சு!",
        "சொல்லணும்னு, {name}, {time} ஆச்சு.",
        "டைம் செக், {name}: {time}!"
      ],
      other: [
        "ஹே {name}, {time} ஆச்சு!",
        "இப்போ {time}, {name}.",
        "கவனிங்க, {time} ஆச்சு!"
      ]
    },
    greet: {
      male: [
        "என்ன {name} மச்சான்! இன்னைக்கு நல்ல நாளா இருக்கட்டும்!",
        "வெல்கம் பேக், மச்சான்! நான் இங்கதான் தொங்கிட்டு இருந்தேன்.",
        "ஹே {name}! உன் கம்பானியன் ரெடி!"
      ],
      female: [
        "ஹே {name}! இன்னைக்கு அருமையான நாளா இருக்கட்டும்!",
        "வெல்கம் பேக், {name}! நான் இங்கதான் தொங்கிட்டு இருந்தேன்.",
        "ஹாய் {name}! உன் கம்பானியன் ரெடி!"
      ],
      other: [
        "ஹே {name}! இன்னைக்கு நல்ல நாளா இருக்கட்டும்!",
        "வெல்கம் பேக், {name}! நான் இங்கதான் தொங்கிட்டு இருந்தேன்.",
        "ஹாய் {name}! நான் ரெடி!"
      ]
    },
    quips: {
      spiderman: {
        male: [
          "மச்சான், நான் இப்படி தொங்கிட்டு இருக்கேன், உனக்கு என்ன வேலை, {name}?",
          "பெரிய பவர்-ஓட பெரிய போரடிப்பும் வரும். என்டர்டெயின் பண்ணு, {name}!",
          "என் ஸ்பைடர்-சென்ஸ் சொல்லுது, உனக்கு பசிக்குது, டேய்!"
        ],
        female: [
          "ஹே {name}, நான் இப்படி தொங்கிட்டு இருக்கேன், உனக்கு என்ன வேலை?",
          "பெரிய பவர்-ஓட பெரிய போரடிப்பும் வரும். என்டர்டெயின் பண்ணு, {name}!",
          "என் ஸ்பைடர்-சென்ஸ் சொல்லுது, உனக்கு பசிக்குது, {name}!"
        ],
        other: [
          "நான் தலைகீழா தொங்கிட்டு இருக்கேன், அதுதான் என் ஸ்டைல், {name}!",
          "என் ஸ்பைடர்-சென்ஸ் சொல்லுது, ஏதாவது சாப்பிடலாம்.",
          "பெரிய பவர்-ஓட பெரிய போரடிப்பும் வரும். என்டர்டெயின் பண்ணுங்க!"
        ]
      },
    }
  },

  // ------------------------------------------------------------------ Kannada (Latin letters)
  kanglish: {
    water: {
      male: [
        "{name} guru, swalpa neeru kudi, thumba hothu aayithu!",
        "Eno {name}, neeru kudiyodu marithya?",
        "Guru, dehydration aagutthe, ond glass neeru kudidhu baa!"
      ],
      female: [
        "{name}, swalpa neeru kudi, thumba hothu aayithu!",
        "Hey {name}, thumba hothininda kelsa maadthidya, swalpa neeru kudi!",
        "{name}, ond glass neeru kudidhu baa, fresh aagtheera!"
      ],
      other: [
        "Hey {name}, neeru kudiyo samaya aayithu!",
        "{name}, neeru kudiyodu marebedi!",
        "Ond glass neeru kudiri, {name}, chennagirutthe!"
      ]
    },
    rest: {
      male: [
        "Thumba hothu screen nodtidya, {name}, swalpa break thagolu!",
        "Guru, kannige rest kodu, swalpa doora nodu!",
        "Eno {name}, swalpa oddaadi baa, fresh aagtheera!"
      ],
      female: [
        "Thumba hothu screen nodtidya, {name}, swalpa break thagolu!",
        "Hey {name}, kannige rest kodi, swalpa doora nodi!",
        "{name}, swalpa oddaadi baa, chennagirutthe!"
      ],
      other: [
        "Hey {name}, screen ninda ond chikka break thagoli!",
        "Stretch time, {name}! Bhuja thiruguvi, doora nodi.",
        "Kannige rest kodi, {name}, 20 second doora nodi!"
      ]
    },
    time: {
      male: [
        "{name} guru, {time} aayithu!",
        "Eno, {time} aayithu, samaya hege hogutthe!",
        "Gamana kodu {name}, clock alli {time} aagide."
      ],
      female: [
        "Hey {name}, {time} aayithu!",
        "Heli bidthini, {name}, {time} aagide.",
        "Time check, {name}: {time}!"
      ],
      other: [
        "Hey {name}, {time} aayithu!",
        "Eega {time}, {name}.",
        "Gamana kodi, {time} aayithu!"
      ]
    },
    greet: {
      male: [
        "Hegiddira {name} guru! Ivattu olle dina aagli!",
        "Welcome back, guru! Naanu illi thaane thongkidde.",
        "Hey {name}! Nimma companion ready!"
      ],
      female: [
        "Hey {name}! Ivattu olle dina aagli!",
        "Welcome back, {name}! Naanu illi thaane thongkidde.",
        "Hi {name}! Nimma companion ready!"
      ],
      other: [
        "Hey {name}! Ivattu olle dina aagli!",
        "Welcome back, {name}! Naanu illi thaane thongkidde.",
        "Hi {name}! Naanu ready!"
      ]
    },
    quips: {
      spiderman: {
        male: [
          "Guru, naanu hige thongkondu iddini, ninge enu kelsa, {name}?",
          "Doddha shakthi jothege doddha boredom bartthe. Entertain madu, {name}!",
          "Nanna spider-sense helthide, ninge hasivu aagide, eno!"
        ],
        female: [
          "Hey {name}, naanu hige thongkondu iddini, ninge enu kelsa?",
          "Doddha shakthi jothege doddha boredom bartthe. Entertain maadi, {name}!",
          "Nanna spider-sense helthide, ninge hasivu aagide, {name}!"
        ],
        other: [
          "Naanu thale kelege thongkondu iddini, adhe nanna style, {name}!",
          "Nanna spider-sense helthide, yenaadru thinnu.",
          "Doddha shakthi jothege doddha boredom bartthe. Entertain maadi!"
        ]
      },
    }
  },

  // ------------------------------------------------------------------ Kannada (ಕನ್ನಡ)
  kannada: {
    water: {
      male: [
        "{name} ಗುರು, ಸ್ವಲ್ಪ ನೀರು ಕುಡಿ, ತುಂಬಾ ಹೊತ್ತು ಆಯಿತು!",
        "ಏನೋ {name}, ನೀರು ಕುಡಿಯೋದು ಮರೆತೆಯಾ?",
        "ಗುರು, ಡಿಹೈಡ್ರೇಷನ್ ಆಗುತ್ತೆ, ಒಂದು ಗ್ಲಾಸ್ ನೀರು ಕುಡಿದು ಬಾ!"
      ],
      female: [
        "{name}, ಸ್ವಲ್ಪ ನೀರು ಕುಡಿ, ತುಂಬಾ ಹೊತ್ತು ಆಯಿತು!",
        "ಹೇ {name}, ತುಂಬಾ ಹೊತ್ತಿನಿಂದ ಕೆಲಸ ಮಾಡ್ತಿದ್ದೀಯ, ಸ್ವಲ್ಪ ನೀರು ಕುಡಿ!",
        "{name}, ಒಂದು ಗ್ಲಾಸ್ ನೀರು ಕುಡಿದು ಬಾ, ಫ್ರೆಶ್ ಆಗ್ತೀಯ!"
      ],
      other: [
        "ಹೇ {name}, ನೀರು ಕುಡಿಯೋ ಸಮಯ ಆಯಿತು!",
        "{name}, ನೀರು ಕುಡಿಯೋದು ಮರೆಯಬೇಡಿ!",
        "ಒಂದು ಗ್ಲಾಸ್ ನೀರು ಕುಡಿಯಿರಿ, {name}, ಚೆನ್ನಾಗಿರುತ್ತೆ!"
      ]
    },
    rest: {
      male: [
        "ತುಂಬಾ ಹೊತ್ತು ಸ್ಕ್ರೀನ್ ನೋಡ್ತಿದ್ದೀಯ, {name}, ಸ್ವಲ್ಪ ಬ್ರೇಕ್ ತಗೋ!",
        "ಗುರು, ಕಣ್ಣಿಗೆ ರೆಸ್ಟ್ ಕೊಡು, ಸ್ವಲ್ಪ ದೂರ ನೋಡು!",
        "ಏನೋ {name}, ಸ್ವಲ್ಪ ಓಡಾಡಿ ಬಾ, ಫ್ರೆಶ್ ಆಗ್ತೀಯ!"
      ],
      female: [
        "ತುಂಬಾ ಹೊತ್ತು ಸ್ಕ್ರೀನ್ ನೋಡ್ತಿದ್ದೀಯ, {name}, ಸ್ವಲ್ಪ ಬ್ರೇಕ್ ತಗೋ!",
        "ಹೇ {name}, ಕಣ್ಣಿಗೆ ರೆಸ್ಟ್ ಕೊಡಿ, ಸ್ವಲ್ಪ ದೂರ ನೋಡಿ!",
        "{name}, ಸ್ವಲ್ಪ ಓಡಾಡಿ ಬಾ, ಚೆನ್ನಾಗಿರುತ್ತೆ!"
      ],
      other: [
        "ಹೇ {name}, ಸ್ಕ್ರೀನ್‌ನಿಂದ ಒಂದು ಚಿಕ್ಕ ಬ್ರೇಕ್ ತಗೊಳ್ಳಿ!",
        "ಸ್ಟ್ರೆಚ್ ಟೈಮ್, {name}! ಭುಜ ತಿರುಗಿಸಿ, ದೂರ ನೋಡಿ.",
        "ಕಣ್ಣಿಗೆ ರೆಸ್ಟ್ ಕೊಡಿ, {name}, 20 ಸೆಕೆಂಡ್ ದೂರ ನೋಡಿ!"
      ]
    },
    time: {
      male: [
        "{name} ಗುರು, {time} ಆಯಿತು!",
        "ಏನೋ, {time} ಆಯಿತು, ಸಮಯ ಹೇಗೆ ಹೋಗುತ್ತೆ!",
        "ಗಮನ ಕೊಡು {name}, ಗಡಿಯಾರದಲ್ಲಿ {time} ಆಗಿದೆ."
      ],
      female: [
        "ಹೇ {name}, {time} ಆಯಿತು!",
        "ಹೇಳಿ ಬಿಡ್ತೀನಿ, {name}, {time} ಆಗಿದೆ.",
        "ಟೈಮ್ ಚೆಕ್, {name}: {time}!"
      ],
      other: [
        "ಹೇ {name}, {time} ಆಯಿತು!",
        "ಈಗ {time}, {name}.",
        "ಗಮನ ಕೊಡಿ, {time} ಆಯಿತು!"
      ]
    },
    greet: {
      male: [
        "ಹೇಗಿದ್ದೀರಾ {name} ಗುರು! ಇವತ್ತು ಒಳ್ಳೆ ದಿನ ಆಗ್ಲಿ!",
        "ವೆಲ್ಕಮ್ ಬ್ಯಾಕ್, ಗುರು! ನಾನು ಇಲ್ಲೇ ತೂಗಾಡ್ತಿದ್ದೆ.",
        "ಹೇ {name}! ನಿಮ್ಮ ಕಂಪ್ಯಾನಿಯನ್ ರೆಡಿ!"
      ],
      female: [
        "ಹೇ {name}! ಇವತ್ತು ಒಳ್ಳೆ ದಿನ ಆಗ್ಲಿ!",
        "ವೆಲ್ಕಮ್ ಬ್ಯಾಕ್, {name}! ನಾನು ಇಲ್ಲೇ ತೂಗಾಡ್ತಿದ್ದೆ.",
        "ಹಾಯ್ {name}! ನಿಮ್ಮ ಕಂಪ್ಯಾನಿಯನ್ ರೆಡಿ!"
      ],
      other: [
        "ಹೇ {name}! ಇವತ್ತು ಒಳ್ಳೆ ದಿನ ಆಗ್ಲಿ!",
        "ವೆಲ್ಕಮ್ ಬ್ಯಾಕ್, {name}! ನಾನು ಇಲ್ಲೇ ತೂಗಾಡ್ತಿದ್ದೆ.",
        "ಹಾಯ್ {name}! ನಾನು ರೆಡಿ!"
      ]
    },
    quips: {
      spiderman: {
        male: [
          "ಗುರು, ನಾನು ಹೀಗೆ ತೂಗಾಡ್ತಿದ್ದೀನಿ, ನಿನಗೆ ಏನು ಕೆಲಸ, {name}?",
          "ದೊಡ್ಡ ಶಕ್ತಿ ಜೊತೆಗೆ ದೊಡ್ಡ ಬೋರ್ ಬರುತ್ತೆ. ಎಂಟರ್‌ಟೇನ್ ಮಾಡು, {name}!",
          "ನನ್ನ ಸ್ಪೈಡರ್-ಸೆನ್ಸ್ ಹೇಳ್ತಿದೆ, ನಿನಗೆ ಹಸಿವಾಗಿದೆ, ಏನೋ!"
        ],
        female: [
          "ಹೇ {name}, ನಾನು ಹೀಗೆ ತೂಗಾಡ್ತಿದ್ದೀನಿ, ನಿನಗೆ ಏನು ಕೆಲಸ?",
          "ದೊಡ್ಡ ಶಕ್ತಿ ಜೊತೆಗೆ ದೊಡ್ಡ ಬೋರ್ ಬರುತ್ತೆ. ಎಂಟರ್‌ಟೇನ್ ಮಾಡಿ, {name}!",
          "ನನ್ನ ಸ್ಪೈಡರ್-ಸೆನ್ಸ್ ಹೇಳ್ತಿದೆ, ನಿನಗೆ ಹಸಿವಾಗಿದೆ, {name}!"
        ],
        other: [
          "ನಾನು ತಲೆಕೆಳಗಾಗಿ ತೂಗಾಡ್ತಿದ್ದೀನಿ, ಅದೇ ನನ್ನ ಸ್ಟೈಲ್, {name}!",
          "ನನ್ನ ಸ್ಪೈಡರ್-ಸೆನ್ಸ್ ಹೇಳ್ತಿದೆ, ಏನಾದ್ರೂ ತಿನ್ನು.",
          "ದೊಡ್ಡ ಶಕ್ತಿ ಜೊತೆಗೆ ದೊಡ್ಡ ಬೋರ್ ಬರುತ್ತೆ. ಎಂಟರ್‌ಟೇನ್ ಮಾಡಿ!"
        ]
      },
    }
  }
});
