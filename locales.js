// Dialogue for the speech bubbles: language -> category -> gender -> lines.
//   water / rest : periodic reminders      time  : hourly chime      greet : hello on launch / new name
//   quips        : funny lines said by each hero (on click, and now and then on their own)
// Genders are 'male' | 'female' | 'other' (neutral, also the fallback).
// Placeholders:  {name}  the user's name. When no name is set it is dropped and the sentence tidied.
//                {time}  the current time, e.g. "3:00 PM"
// Keep each line short: it has to fit a comic speech bubble.
const LOCALES = {
  english: {
    water: {
      male: [
        "Dude {name}, grab some water. Hydration is a superpower.",
        "Bro, you've been at it for ages. Water break, {name}!",
        "Hey {name}, a glass of water now saves a headache later."
      ],
      female: [
        "Hey {name}, time for a sip! Stay hydrated, you've got this.",
        "Water break, {name}! Your brain will thank you.",
        "Hey {name}, hydration is key. Grab a glass of water!"
      ],
      other: [
        "Hey {name}, time for a quick water break!",
        "Water check, {name}! Grab a glass.",
        "Stay hydrated, {name}: a few sips go a long way."
      ]
    },
    rest: {
      male: [
        "Dude {name}, you've been staring at the screen forever. Stand up and stretch!",
        "Bro, rest those eyes: look far away for 20 seconds.",
        "Time to move, {name}! Walk it off, man."
      ],
      female: [
        "Hey {name}, you've been working so hard. Take a short screen break!",
        "Rest those eyes, {name}: look far away for 20 seconds, then stretch.",
        "Hey {name}, time to move a little. A short walk will feel great!"
      ],
      other: [
        "Hey {name}, time for a quick screen break!",
        "Stretch time, {name}! Roll your shoulders and look away from the screen.",
        "Eyes need a rest, {name}: look far away for 20 seconds."
      ]
    },
    time: {
      male: [
        "Bro {name}, it's {time} now!",
        "Dude, it's {time}. Time flies!",
        "Heads up {name}, the clock says {time}."
      ],
      female: [
        "Hey {name}, it's {time} now!",
        "Just so you know, {name}: it's {time}.",
        "Time check, {name}: {time}!"
      ],
      other: [
        "Hey {name}, it's {time} now.",
        "The time is {time}, {name}.",
        "Heads up, it's {time}!"
      ]
    },
    greet: {
      male: [
        "Hey {name}, my man! Ready for a great day?",
        "Welcome back, bro! I've been hanging around.",
        "Yo {name}! Your friendly neighbourhood companion is here."
      ],
      female: [
        "Hey {name}! Ready for a great day?",
        "Welcome back, {name}! I've been hanging around.",
        "Hi {name}! Your friendly companion is here."
      ],
      other: [
        "Hey {name}! Ready for a great day?",
        "Welcome back, {name}! I've been hanging around.",
        "Hi {name}! Your friendly companion is here."
      ]
    },
    quips: {
      spiderman: {
        male: [
          "Just hanging around, bro... as usual!",
          "With great power comes great boredom. Entertain me, {name}!",
          "My spider-sense says you need a snack, dude.",
          "Don't mind me, buddy, just dangling at the edge of your screen!"
        ],
        female: [
          "Hey {name}, just hanging around... as usual!",
          "With great power comes great boredom. Entertain me, {name}!",
          "My spider-sense says you need a snack. Trust me, sis!",
          "Don't mind me, just dangling at the edge of your screen!"
        ],
        other: [
          "Just hanging around, {name}... as usual!",
          "With great power comes great boredom. Entertain me!",
          "My spider-sense says you need a snack.",
          "Don't mind me, just dangling at the edge of your screen!"
        ]
      },
    }
  },

  // Malayalam written in English letters
  manglish: {
    water: {
      male: [
        "Machane {name}, kurachu vellam kudi!",
        "Eda {name}, kore aayallo, vellam kudikku!",
        "Bro, dehydration varum, oru glass vellam kudichittu vaa!"
      ],
      female: [
        "Hey {name}, hydration mukhyam, vellam kudikk pennu!",
        "Hey {name}, kore neramaayi work cheyyunnu, kurachu vellam kudi!",
        "Mole {name}, oru glass vellam kudichittu varoo, utsaaham kittum!"
      ],
      other: [
        "Hey {name}, kurachu vellam kudikkaan neram aayi!",
        "Vellam kudikkaan marakkalle, {name}!",
        "Oru glass vellam kudichittu varoo, {name}, utsaaham kittum!"
      ]
    },
    rest: {
      male: [
        "Eda {name}, screen nokki irunnathu mathi, eneettu nadakku!",
        "Machane, kannu thalarnnu, kurachu dooreyku nokku!",
        "Bro, oru chinna stretch cheythaal nannaayirikkum, vaa {name}!"
      ],
      female: [
        "Hey {name}, kore neramaayi work cheyyunnu, kurachu rest edukkoo!",
        "Hey {name}, kannu thalarnnu poyi, kurachu dooreyku nokku!",
        "Mole {name}, oru chinna stretch cheythu nokku, nannaayirikkum!"
      ],
      other: [
        "Hey {name}, oru quick screen break edukkaam!",
        "Kurachu nadannu varoo, {name}!",
        "Kannu thalarnnu poyi, {name}, kurachu dooreyku nokku!"
      ]
    },
    time: {
      male: [
        "Machane {name}, ippol samayam {time} aayi!",
        "Eda, samayam {time} aayallo!",
        "Nokkiyo bro, {time} aayi!"
      ],
      female: [
        "Hey {name}, ippol samayam {time} aayi!",
        "Samayam {time} aayallo, {name}, ariyunnundo?",
        "Nokkiyo, {time} aayi!"
      ],
      other: [
        "Hey {name}, ippol samayam {time} aayi!",
        "Samayam {time} aayi, {name}.",
        "Nokkiyo, {time} aayi!"
      ]
    },
    greet: {
      male: [
        "Machane {name}! Innu nalla divasam aavatte!",
        "Eda {name}, swagatham! Njan ivide thanne undaayirunnu.",
        "Hey bro! Ninte companion ready aanu!"
      ],
      female: [
        "Hey {name}! Innu nalla divasam aavatte!",
        "Swagatham {name}! Njan ivide thanne undaayirunnu.",
        "Hi {name}! Ninte companion ready aanu!"
      ],
      other: [
        "Hey {name}! Innu nalla divasam aavatte!",
        "Swagatham {name}! Njan ivide thanne undaayirunnu.",
        "Hi {name}! Njan ready aanu!"
      ]
    },
    quips: {
      spiderman: {
        male: [
          "Machane, njan ingane thookki kidakkunnu, ninakku enthaa paniyaa, {name}?",
          "Valiya shakthikku valiya uttharavaadithwam... pinne oru chaya kudichaalo, bro?",
          "Ente spider-sense parayunnu, ninakku vishakkunnundu, eda!",
          "Ee web-il kudungiyaal pinne rakshayilla, {name}!"
        ],
        female: [
          "Hey {name}, njan ingane thookki kidakkunnu, ninakku enthaa paniyaa?",
          "Valiya shakthikku valiya uttharavaadithwam... pinne oru chaya kudichaalo, {name}?",
          "Ente spider-sense parayunnu, ninakku vishakkunnundu, mole!",
          "Ee web-il kudungiyaal pinne rakshayilla, {name}!"
        ],
        other: [
          "Njan thala keezhaayaanu, athaanu ente style, {name}!",
          "Ente spider-sense parayunnu, ninakku vishakkunnundu!",
          "Ee web-il kudungiyaal pinne rakshayilla, {name}!",
          "Valiya shakthikku valiya uttharavaadithwam... pinne oru chaya kudichaalo?"
        ]
      },
    }
  },

  malayalam: {
    water: {
      male: [
        "മച്ചാനേ {name}, കുറച്ച് വെള്ളം കുടിക്ക്!",
        "ഡാ {name}, കുറേ നേരമായല്ലോ, വെള്ളം കുടിക്ക്!",
        "ബ്രോ, ഒരു ഗ്ലാസ് വെള്ളം കുടിച്ചിട്ട് വാ, ഉന്മേഷം കിട്ടും!"
      ],
      female: [
        "ഹേയ് {name}, വെള്ളം കുടിക്കുന്നത് പ്രധാനമാണ്, വെള്ളം കുടിക്ക് മോളേ!",
        "ഹേയ് {name}, കുറേ നേരമായി ജോലി ചെയ്യുന്നു, കുറച്ച് വെള്ളം കുടിക്കൂ!",
        "മോളേ {name}, ഒരു ഗ്ലാസ് വെള്ളം കുടിച്ചിട്ട് വരൂ, ഉന്മേഷം കിട്ടും!"
      ],
      other: [
        "ഹേയ് {name}, ഒരു ചെറിയ വെള്ളം കുടിക്കാനുള്ള സമയമായി!",
        "വെള്ളം കുടിക്കാൻ മറക്കല്ലേ, {name}!",
        "ഒരു ഗ്ലാസ് വെള്ളം കുടിച്ചിട്ട് വരൂ, {name}, ഉന്മേഷം കിട്ടും!"
      ]
    },
    rest: {
      male: [
        "ഡാ {name}, സ്ക്രീൻ നോക്കി ഇരുന്നത് മതി, എഴുന്നേറ്റ് നടക്ക്!",
        "മച്ചാനേ, കണ്ണ് തളർന്നു, കുറച്ച് ദൂരേക്ക് നോക്ക്!",
        "ബ്രോ, ഒരു ചെറിയ സ്ട്രെച്ച് ചെയ്താൽ നല്ലതായിരിക്കും, വാ {name}!"
      ],
      female: [
        "ഹേയ് {name}, കുറേ നേരമായി ജോലി ചെയ്യുന്നു, കുറച്ച് വിശ്രമിക്കൂ!",
        "ഹേയ് {name}, കണ്ണ് തളർന്നു, കുറച്ച് ദൂരേക്ക് നോക്കൂ!",
        "മോളേ {name}, ഒരു ചെറിയ സ്ട്രെച്ച് ചെയ്തു നോക്കൂ, നല്ലതായിരിക്കും!"
      ],
      other: [
        "ഹേയ് {name}, ഒരു ചെറിയ സ്ക്രീൻ ബ്രേക്ക് എടുക്കാം!",
        "കുറച്ച് നടന്നിട്ട് വരൂ, {name}!",
        "കണ്ണ് തളർന്നു, {name}, കുറച്ച് ദൂരേക്ക് നോക്കൂ!"
      ]
    },
    time: {
      male: [
        "മച്ചാനേ {name}, ഇപ്പോൾ സമയം {time} ആയി!",
        "ഡാ, സമയം {time} ആയല്ലോ!",
        "നോക്ക് ബ്രോ, {time} ആയി!"
      ],
      female: [
        "ഹേയ് {name}, ഇപ്പോൾ സമയം {time} ആയി!",
        "സമയം {time} ആയല്ലോ, {name}, അറിഞ്ഞോ?",
        "നോക്കൂ, {time} ആയി!"
      ],
      other: [
        "ഹേയ് {name}, ഇപ്പോൾ സമയം {time} ആയി!",
        "സമയം {time} ആയി, {name}.",
        "നോക്കൂ, {time} ആയി!"
      ]
    },
    greet: {
      male: [
        "മച്ചാനേ {name}! ഇന്ന് ഒരു നല്ല ദിവസമാകട്ടെ!",
        "ഡാ {name}, സ്വാഗതം! ഞാൻ ഇവിടെത്തന്നെ ഉണ്ടായിരുന്നു.",
        "ഹേയ് ബ്രോ! നിന്റെ കൂട്ടുകാരൻ തയ്യാറാണ്!"
      ],
      female: [
        "ഹേയ് {name}! ഇന്ന് ഒരു നല്ല ദിവസമാകട്ടെ!",
        "സ്വാഗതം {name}! ഞാൻ ഇവിടെത്തന്നെ ഉണ്ടായിരുന്നു.",
        "ഹായ് {name}! നിന്റെ കൂട്ടുകാരൻ തയ്യാറാണ്!"
      ],
      other: [
        "ഹേയ് {name}! ഇന്ന് ഒരു നല്ല ദിവസമാകട്ടെ!",
        "സ്വാഗതം {name}! ഞാൻ ഇവിടെത്തന്നെ ഉണ്ടായിരുന്നു.",
        "ഹായ് {name}! ഞാൻ തയ്യാറാണ്!"
      ]
    },
    quips: {
      spiderman: {
        male: [
          "മച്ചാനേ, ഞാൻ ഇങ്ങനെ തൂങ്ങിക്കിടക്കുകയാണ്, നിനക്കെന്താ പണി, {name}?",
          "വലിയ ശക്തിക്കൊപ്പം വലിയ ഉത്തരവാദിത്വവും വരും... പിന്നെ ഒരു ചായ കുടിച്ചാലോ, ബ്രോ?",
          "എന്റെ സ്പൈഡർ-സെൻസ് പറയുന്നു, നിനക്ക് വിശക്കുന്നുണ്ട്, ഡാ!",
          "ഈ വെബ്ബിൽ കുടുങ്ങിയാൽ പിന്നെ രക്ഷയില്ല, {name}!"
        ],
        female: [
          "ഹേയ് {name}, ഞാൻ ഇങ്ങനെ തൂങ്ങിക്കിടക്കുകയാണ്, നിനക്കെന്താ പണി?",
          "വലിയ ശക്തിക്കൊപ്പം വലിയ ഉത്തരവാദിത്വവും വരും... പിന്നെ ഒരു ചായ കുടിച്ചാലോ, {name}?",
          "എന്റെ സ്പൈഡർ-സെൻസ് പറയുന്നു, നിനക്ക് വിശക്കുന്നുണ്ട്, മോളേ!",
          "ഈ വെബ്ബിൽ കുടുങ്ങിയാൽ പിന്നെ രക്ഷയില്ല, {name}!"
        ],
        other: [
          "ഞാൻ തലകീഴായാണ്, അതാണ് എന്റെ സ്റ്റൈൽ, {name}!",
          "എന്റെ സ്പൈഡർ-സെൻസ് പറയുന്നു, നിനക്ക് വിശക്കുന്നുണ്ട്!",
          "ഈ വെബ്ബിൽ കുടുങ്ങിയാൽ പിന്നെ രക്ഷയില്ല, {name}!",
          "വലിയ ശക്തിക്കൊപ്പം വലിയ ഉത്തരവാദിത്വവും വരും... പിന്നെ ഒരു ചായ കുടിച്ചാലോ?"
        ]
      },
    }
  }
};
