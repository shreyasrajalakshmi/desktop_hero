// Personal banter built from the user's profile, in the three languages written by hand.
//   profile      : clean, family-friendly lines     profileAdult : raw lines, used ONLY when 18+ mode is on
//   relationship : single | relationship | married  status       : working | student | idle
// {name} {addr} {eda} work as everywhere else. The 18+ lines use street-level slang and swearing, meant for
// banter between close friends; they never appear unless the user is 18+ and has switched the mode on.

const PROFILE_LINES = {
  english: {
    profile: {
      relationship: {
        single: [
          "Still single, {name}? The only thing you're matching with is your own reflection in the monitor.",
          "Scrolling reels at midnight isn't dating, {addr}. It's a hostage situation with your thumb.",
          "Desktop romance update: you and your laptop are in the longest relationship you've had. It's not healthy."
        ],
        relationship: [
          "Texting your partner back, {name}? Don't leave them on 'seen'. That's a crime in this house.",
          "Reminder: a relationship needs actual conversations, not just 'ok' and a thumbs-up emoji.",
          "Go ask your partner what's for dinner. Then act surprised when you hear 'whatever you want'."
        ],
        married: [
          "Surviving marriage like a champ, {name}. The dishes won't wash themselves, and neither will the argument go away.",
          "Married life tip: when your spouse says 'I'm fine', save yourself. Close the laptop and listen.",
          "The household chores called. They said you've been 'busy' for three years."
        ]
      },
      status: {
        working: [
          "Deadline stress? Breathe, {name}. A client who says 'quick change' never means quick.",
          "Corporate slavery update: you've been in this chair longer than the office plant has been alive. Water yourself too.",
          "Has the salary been credited yet, {addr}? No? Then stand up and stare out of the window dramatically."
        ],
        student: [
          "Exam fear is just procrastination in a nicer outfit, {name}. Open the book, not another tab.",
          "Pending assignment: yes. Backlog count: don't ask. Sit up and do ONE page, {addr}.",
          "Semester backlogs don't clear themselves, {addr}. Believe me, I've watched."
        ],
        idle: [
          "Sleeping all day is not a career, {name}. Although you'd be employee of the year.",
          "Job hunt reality check: 200 tabs open, zero applications sent. Pick one and apply.",
          "Nothing to do? Congratulations, you have free time. Use it before it uses you, {addr}."
        ]
      }
    },
    profileAdult: {
      relationship: {
        single: [
          "Still single, {name}? Shocking. Your charm is as dry as a reel with no audio.",
          "You've swiped so much your thumb deserves a pension. And still no date? Damn, {addr}.",
          "Desktop romance? Mate, even your Wi-Fi left you. Go outside and talk to an actual human, you legend of loneliness."
        ],
        relationship: [
          "Texting your partner, or stalling with memes, {name}? Reply, you coward, before they notice who you really are.",
          "Your status says 'taken' but your screen time says 'cheating with a laptop'. Hell of a look.",
          "Be a hero: do the dishes without being asked. Yes, that's the whole bar. It's low, {addr}."
        ],
        married: [
          "Surviving marriage? You're not surviving, {name}, you're 'yes dear'-ing your way to retirement.",
          "Congrats on the ring, {addr}. Now do the chores before the evidence disappears into an argument.",
          "Married life: the only place you lose every fight and still wake up next to the winner. Apologise, damn it."
        ]
      },
      status: {
        working: [
          "Corporate slavery has a nice salary slip, {name}, but your soul called. It wants a refund.",
          "Client says 'urgent', they mean 'I forgot until now'. Don't let them screw up your evening, {addr}.",
          "Salary credited yet? No? Then why the hell are you still working late? Close the laptop."
        ],
        student: [
          "Exams in a week and a backlog you're scared to look at. Classic. Open the damn book, {name}.",
          "You're so close to failing it's an art form. One chapter. Now. Stop being a legend of procrastination.",
          "Assignment due? Of course it is. You'll finish it at 3 AM crying into chai. Start now, {addr}."
        ],
        idle: [
          "Sleeping all day, scrolling all night. You're a vampire with Wi-Fi, {name}. Get a job.",
          "Job hunt reality check: your CV is thinner than your excuses. Apply somewhere. Anywhere. Please.",
          "Lazy pro roast: you'd win gold for doing nothing and still be late to the ceremony, {addr}."
        ]
      }
    }
  },

  manglish: {
    profile: {
      relationship: {
        single: [
          "Single aano {name}? Ninte matching oke ninte monitor-ile reflection-umaayi aanu... Eneettu purathirangu!",
          "Reels nokki nokki midnight aayi {addr}. Athu dating alla, ninte viralinte hostage aanu!",
          "Desktop romance: nee-yum laptop-um aanu ee varshathe ettavum neenda relationship. Healthy alla ketto!"
        ],
        relationship: [
          "Partner-ine reply ayachooo {name}? 'Seen' aakki iduthu ketto... veettil athu kuttam aanu!",
          "Relationship-inu 'ok' pinne thumbs-up emoji alla, sheriyaaya samsaram venam {addr}.",
          "Phone cheythu chodikku innu enthaa kazhikkaan ennu. Pinne 'ninakku ishtam pole' ennu kekkumbol athbhutham kaanikku!"
        ],
        married: [
          "Kalyaanam survive cheyyunnu {name}, kollaam! Paathram thaanaayittu kazhukilla, vaadam thaanaayittu theerunnumilla.",
          "Marriage tip {addr}: 'onnumilla' ennu paranjaal athu onnumilla ennalla. Laptop adachittu kelkku.",
          "Veetile joli-kal vilichu. Nee moonnu varshamayi 'busy' aanennu avarod paranju!"
        ]
      },
      status: {
        working: [
          "Deadline stress aano {name}? Shwasam ullilekku... client 'oru cheriya change' ennu parayumbol athu cheriyath alla!",
          "Corporate adimathwam: aa office chedi-yekkaal neram ee chair-il irunnu. Chediyude koode ninakkum vellam!",
          "Salary credit aayo {addr}? Illa? Appo eneettu jaalakathil nokki drama kaanikku!"
        ],
        student: [
          "Exam pedi ennu parayunnathu procrastination-inte vere peru aanu {name}. Pusthakam thurakku, vere tab alla!",
          "Pending assignment: undu. Backlog: chodikkalle. Nere irunnu oru page cheyy {addr}!",
          "Semester backlog thaanaayittu theerilla {addr}. Njan ithu orupaad kandittundu, vishwasikku!"
        ],
        idle: [
          "Ennum urangiyal career aavilla {name}. Pakshe 'Employee of the Year' aavaam!",
          "Job hunt reality check: 200 tab open, ennittum oru application poyilla. Onnu thiranjedutthu apply cheyy!",
          "Onnum cheyyaan illalle? Congrats, free time undu {addr}. Athu ninne upayogikkunnathinu munpu upayogikku!"
        ]
      }
    },
    profileAdult: {
      relationship: {
        single: [
          "Single aano {name}, myre? Ninte profile kandittu AI polum 'swipe left' adikkum. Onnu mukham kazhuki purathirangu!",
          "Reels nokki nokki viral theernnu, enittum oru date illa. Ninte karyam oombiya scene thanne {addr}!",
          "Theppu kittiyo ennu chodikkunnilla, pakshe theppu kittaan polum aarum ninne ishtappettilla {name}. Poda poy vallathum cheyy!"
        ],
        relationship: [
          "Partner-inu reply cheyyaathe meme kaanunno {name}? Poda patti, ippol thanne reply ayakku!",
          "Relationship status 'taken', pakshe screen time-il laptop-inodu cheat cheyyunnu. Myre, nee valare mosham aanu {addr}!",
          "Veettile paathram kazhukkaathe ivide irunno? Ninte oombiya scene aanu athu. Eneettu poda!"
        ],
        married: [
          "Kalyaanam kazhinju, ippo 'athe, shariyaanu' ennu mathram parayunnu. Nee survive cheyyunnilla {name}, nee adangi irikkunnu, myre!",
          "Ninte partner enthu paranjaalum nee 'ok' ennu paranjaal athu ok alla. Laptop adachu kelkku, thendi!",
          "Veettile joli cheyyaathe ivide irunnaal aadyam adi kittum, appol 'ente theppu' ennu paranjittu karyam illa {addr}!"
        ]
      },
      status: {
        working: [
          "Corporate adimathwam, myre! Salary slip nannaayittundu, pakshe ninte jeevitham oombi poyi {name}. Purathirangu!",
          "Client 'urgent' ennu paranjaal avarodu njan 'poda' ennu parayum. Ninte raathri nashtappeduthaan avare anuvadikkaruthu {addr}!",
          "Salary credit aayo ennu chodichu... illenkil pinne enthinu ee dhaaruna overtime, myre? Adachu poda!"
        ],
        student: [
          "Exam aduthu, backlog kandaal pedi aavum. Classic scene {name}. Pusthakam thurakkada oombiya!",
          "Fail aakan polum ninakku oru kala undu. Oru chapter... ippol thanne. Procrastination-inte raajaavu aavaruthu {addr}!",
          "Assignment submit cheyyanam? Mathiyaayi. 3 manikku chaayayum karanju cheyyaam ennu karuthunno? Ippo thudangu myre!"
        ],
        idle: [
          "Pakal muzhuvan urakkam, raathri muzhuvan reels. Nee oru vampire aanu {name}, Wi-Fi ulla vampire. Joli nokku poda!",
          "Job hunt reality check: ninte CV ninte bahaanangalekkaal cheruthaanu. Evideyenkilum apply cheyy myre!",
          "Onnum cheyyaathe irikkunnathinu gold medal kittum {addr}, pakshe ceremony-kku late aayi varum. Eneettu poda!"
        ]
      }
    }
  },

  malayalam: {
    profile: {
      relationship: {
        single: [
          "ഇപ്പോഴും സിംഗിൾ ആണോ {name}? നിന്റെ മോണിറ്ററിലെ പ്രതിബിംബവുമായാണ് നിന്റെ മാച്ചിംഗ്... എഴുന്നേറ്റ് പുറത്തിറങ്ങ്!",
          "അർദ്ധരാത്രി വരെ റീൽസ് നോക്കുന്നത് ഡേറ്റിംഗ് അല്ല {addr}, നിന്റെ വിരലിന്റെ ബന്ദിയാകലാണ്!",
          "ഡെസ്ക്ടോപ്പ് റൊമാൻസ്: നീയും ലാപ്ടോപ്പുമാണ് ഈ വർഷത്തെ ഏറ്റവും നീണ്ട റിലേഷൻഷിപ്പ്. ആരോഗ്യകരമല്ല കേട്ടോ!"
        ],
        relationship: [
          "പാർട്ണറിന് റിപ്ലൈ അയച്ചോ {name}? 'സീൻ' ആക്കി ഇടല്ലേ... വീട്ടിൽ അത് കുറ്റമാണ്!",
          "ബന്ധത്തിന് 'ഓക്കെ'യും തംപ്സ്-അപ്പ് ഇമോജിയുമല്ല, ശരിയായ സംസാരമാണ് വേണ്ടത് {addr}.",
          "ഫോൺ ചെയ്ത് ചോദിക്ക് ഇന്ന് എന്താണ് കഴിക്കാൻ എന്ന്. പിന്നെ 'നിനക്ക് ഇഷ്ടം പോലെ' എന്ന് കേൾക്കുമ്പോൾ അത്ഭുതം കാണിക്ക്!"
        ],
        married: [
          "കല്യാണം അതിജീവിക്കുന്നു {name}, കൊള്ളാം! പാത്രം താനേ കഴുകില്ല, വഴക്ക് താനേ തീരുകയുമില്ല.",
          "മാരേജ് ടിപ്പ് {addr}: 'ഒന്നുമില്ല' എന്ന് പറഞ്ഞാൽ അത് ഒന്നുമില്ല എന്നല്ല. ലാപ്ടോപ്പ് അടച്ച് കേൾക്ക്.",
          "വീട്ടുജോലികൾ വിളിച്ചു. നീ മൂന്ന് വർഷമായി 'ബിസി'യാണെന്ന് അവരോട് പറഞ്ഞു!"
        ]
      },
      status: {
        working: [
          "ഡെഡ്‌ലൈൻ സ്ട്രെസ്സ് ആണോ {name}? ശ്വാസം ഉള്ളിലേക്ക്... ക്ലയന്റ് 'ഒരു ചെറിയ മാറ്റം' എന്ന് പറഞ്ഞാൽ അത് ചെറുതല്ല!",
          "കോർപ്പറേറ്റ് അടിമത്തം: ആ ഓഫീസ് ചെടിയേക്കാൾ നേരം നീ ഈ ചെയറിൽ ഇരുന്നു. ചെടിയോടൊപ്പം നിനക്കും വെള്ളം!",
          "സാലറി ക്രെഡിറ്റ് ആയോ {addr}? ഇല്ലേ? എങ്കിൽ എഴുന്നേറ്റ് ജനലിലൂടെ നോക്കി ഡ്രാമ കാണിക്ക്!"
        ],
        student: [
          "എക്സാം പേടി എന്ന് പറയുന്നത് ചുമ്മാ ഇരിക്കലിന്റെ വേറെ പേരാണ് {name}. പുസ്തകം തുറക്ക്, വേറെ ടാബല്ല!",
          "പെൻഡിംഗ് അസൈൻമെന്റ്: ഉണ്ട്. ബാക്ക്‌ലോഗ്: ചോദിക്കരുത്. നേരെ ഇരുന്ന് ഒരു പേജ് ചെയ്യ് {addr}!",
          "സെമസ്റ്റർ ബാക്ക്‌ലോഗ് താനേ തീരില്ല {addr}. ഞാൻ ഇത് ഒരുപാട് കണ്ടിട്ടുണ്ട്, വിശ്വസിക്ക്!"
        ],
        idle: [
          "എന്നും ഉറങ്ങിയാൽ കരിയർ ആവില്ല {name}. പക്ഷേ 'എംപ്ലോയി ഓഫ് ദി ഇയർ' ആവാം!",
          "ജോബ് ഹണ്ട് റിയാലിറ്റി ചെക്ക്: 200 ടാബ് തുറന്നിട്ടുണ്ട്, ഒരു അപേക്ഷ പോലും പോയിട്ടില്ല. ഒന്ന് തിരഞ്ഞെടുത്ത് അപ്ലൈ ചെയ്യ്!",
          "ഒന്നും ചെയ്യാനില്ലേ? അഭിനന്ദനങ്ങൾ, ഫ്രീ ടൈം ഉണ്ട് {addr}. അത് നിന്നെ ഉപയോഗിക്കുന്നതിന് മുമ്പ് ഉപയോഗിക്ക്!"
        ]
      }
    },
    profileAdult: {
      relationship: {
        single: [
          "സിംഗിൾ ആണോ {name}, മൈര്? നിന്റെ പ്രൊഫൈൽ കണ്ടാൽ AI പോലും 'സ്വൈപ്പ് ലെഫ്റ്റ്' അടിക്കും. ഒന്ന് മുഖം കഴുകി പുറത്തിറങ്ങ്!",
          "റീൽസ് നോക്കി നോക്കി വിരൽ തീർന്നു, എന്നിട്ടും ഒരു ഡേറ്റ് ഇല്ല. നിന്റെ കാര്യം ഊമ്പിയ സീൻ തന്നെ {addr}!",
          "തെപ്പ് കിട്ടിയോ എന്ന് ചോദിക്കുന്നില്ല, പക്ഷേ തെപ്പ് കിട്ടാൻ പോലും ആരും നിന്നെ ഇഷ്ടപ്പെട്ടിട്ടില്ല {name}. പോടാ പോയി വല്ലതും ചെയ്യ്!"
        ],
        relationship: [
          "പാർട്ണറിന് റിപ്ലൈ ചെയ്യാതെ മീം കാണുന്നോ {name}? പോടാ പട്ടി, ഇപ്പോൾ തന്നെ റിപ്ലൈ അയക്ക്!",
          "റിലേഷൻഷിപ്പ് സ്റ്റാറ്റസ് 'ടേക്കൻ', പക്ഷേ സ്ക്രീൻ ടൈമിൽ ലാപ്ടോപ്പിനോട് ചീറ്റ് ചെയ്യുന്നു. മൈര്, നീ വളരെ മോശമാണ് {addr}!",
          "വീട്ടിലെ പാത്രം കഴുകാതെ ഇവിടെ ഇരിക്കുന്നോ? നിന്റെ ഊമ്പിയ സീൻ ആണത്. എഴുന്നേറ്റ് പോടാ!"
        ],
        married: [
          "കല്യാണം കഴിഞ്ഞു, ഇപ്പോൾ 'അതെ, ശരിയാണ്' എന്ന് മാത്രം പറയുന്നു. നീ അതിജീവിക്കുന്നില്ല {name}, നീ അടങ്ങിയിരിക്കുന്നു, മൈര്!",
          "നിന്റെ പാർട്ണർ എന്ത് പറഞ്ഞാലും നീ 'ഓക്കെ' എന്ന് പറഞ്ഞാൽ അത് ഓക്കെ അല്ല. ലാപ്ടോപ്പ് അടച്ച് കേൾക്ക്, തെണ്ടി!",
          "വീട്ടുജോലി ചെയ്യാതെ ഇവിടെ ഇരുന്നാൽ ആദ്യം അടി കിട്ടും, അപ്പോൾ 'എന്റെ തെപ്പ്' എന്ന് പറഞ്ഞിട്ട് കാര്യമില്ല {addr}!"
        ]
      },
      status: {
        working: [
          "കോർപ്പറേറ്റ് അടിമത്തം, മൈര്! സാലറി സ്ലിപ്പ് നന്നായിട്ടുണ്ട്, പക്ഷേ നിന്റെ ജീവിതം ഊമ്പി പോയി {name}. പുറത്തിറങ്ങ്!",
          "ക്ലയന്റ് 'അർജന്റ്' എന്ന് പറഞ്ഞാൽ അവരോട് ഞാൻ 'പോടാ' എന്ന് പറയും. നിന്റെ രാത്രി നശിപ്പിക്കാൻ അവരെ അനുവദിക്കരുത് {addr}!",
          "സാലറി ക്രെഡിറ്റ് ആയോ എന്ന് ചോദിച്ചു... ഇല്ലെങ്കിൽ പിന്നെ എന്തിനാണ് ഈ ദാരുണ ഓവർടൈം, മൈര്? അടച്ചിട്ട് പോടാ!"
        ],
        student: [
          "എക്സാം അടുത്തു, ബാക്ക്‌ലോഗ് കണ്ടാൽ പേടി ആകും. ക്ലാസിക് സീൻ {name}. പുസ്തകം തുറക്കടാ ഊമ്പിയ!",
          "തോൽക്കാൻ പോലും നിനക്ക് ഒരു കലയുണ്ട്. ഒരു ചാപ്റ്റർ... ഇപ്പോൾ തന്നെ. നീട്ടിവെപ്പിന്റെ രാജാവാകരുത് {addr}!",
          "അസൈൻമെന്റ് സബ്മിറ്റ് ചെയ്യണോ? മതിയായി. 3 മണിക്ക് ചായയും കരഞ്ഞ് ചെയ്യാം എന്ന് കരുതുന്നോ? ഇപ്പോൾ തുടങ്ങ് മൈര്!"
        ],
        idle: [
          "പകൽ മുഴുവൻ ഉറക്കം, രാത്രി മുഴുവൻ റീൽസ്. നീ ഒരു വാമ്പയറാണ് {name}, വൈഫൈ ഉള്ള വാമ്പയർ. ജോലി നോക്ക് പോടാ!",
          "ജോബ് ഹണ്ട് റിയാലിറ്റി ചെക്ക്: നിന്റെ സിവി നിന്റെ ഒഴിവുകഴിവുകളേക്കാൾ ചെറുതാണ്. എവിടെയെങ്കിലും അപ്ലൈ ചെയ്യ് മൈര്!",
          "ഒന്നും ചെയ്യാതിരിക്കുന്നതിന് ഗോൾഡ് മെഡൽ കിട്ടും {addr}, പക്ഷേ ചടങ്ങിന് വൈകി വരും. എഴുന്നേൽക്ക് പോടാ!"
        ]
      }
    }
  }
};

// Raw 18+ lines for the heroes who have an adult set; added to the cheekier ones already there.
const HERO_RAW = {
  english: {
    deadpool: [
      "Your ass has been in that chair so long it deserves tenure, {name}. Get up, you magnificent couch-potato bastard.",
      "I've seen your browser history, {name}. We're not friends anymore. Drink water and think about what you've done.",
      "Fourth-wall break: the developer coded me to roast you, so don't blame me. Blame the guy who needs a hobby."
    ],
    zoro: [
      "I've cut down men with three swords and you can't even move off a damn chair, {name}. Pathetic.",
      "Lost? You haven't moved since breakfast, you lazy bastard. Even I found my way to the dock.",
      "Drink water. Not sake, not coffee. WATER. Do I have to cut the glass for you to get it?"
    ],
    spiderman: [
      "With great power comes great responsibility, and you're using yours to doomscroll reels at 2 AM. Damn it, {name}.",
      "I swing between buildings and still have better cardio than your lazy ass. Get up, {addr}.",
      "Your chair gets more action than your love life. Sorry, someone had to say it. Now stretch."
    ]
  },
  manglish: {
    deadpool: [
      "Ninte irippu chair-il tenure kittiyo {name}, myre? Eneettu poda!",
      "Njan ninte browser history kandu {name}. Ini nammal kootillaa. Vellam kudichittu ninte paapangalekkurichu chindikku, thendi!",
      "Developer ennod parayaan paranjathaan ninne roast cheyyaan. Ennod deshyam vendaa, ithu ezhuthiyavan oru hobby nokkatte!"
    ],
    zoro: [
      "Moonnu vaalumaayi njan aale vettiyittu, nee oru chair-il ninnu eneettaan pattaathe irikkunnu {name}, myre. Kashtam!",
      "Vazhi thettiyo? Break-fast muthal nee oru sthalathu thanne aanu thendi! Njan polum dock-ilekku vazhi kandupidichu!",
      "Vellam kudi. Sake alla, kaappi alla. VELLAM. Glass vettitharano njan, poda?"
    ],
    spiderman: [
      "Valiya shakthikku valiya uttharavaadithwam, pakshe nee ninte shakthi 2 manikku reels-il kalayunnu, myre {name}!",
      "Njan kettidangal thammil chaadi nadakkunnu, ennittum ninte kuthiyirippinekkaal nallathaanu ente cardio. Eneettu poda {addr}!",
      "Ninte chair-inu ninte prema jeevithathekkaal action undu. Kshamikkanam, aarenkilum paranjuthaneyaanu. Ippol stretch cheyy!"
    ]
  },
  malayalam: {
    deadpool: [
      "നിന്റെ ഇരിപ്പ് ചെയറിൽ ടെനുർ കിട്ടിയോ {name}, മൈര്? എഴുന്നേൽക്ക് പോടാ!",
      "ഞാൻ നിന്റെ ബ്രൗസർ ഹിസ്റ്ററി കണ്ടു {name}. ഇനി നമ്മൾ കൂട്ടില്ല. വെള്ളം കുടിച്ചിട്ട് നിന്റെ പാപങ്ങളെക്കുറിച്ച് ചിന്തിക്ക്, തെണ്ടി!",
      "ഡെവലപ്പർ എന്നോട് പറഞ്ഞത് നിന്നെ റോസ്റ്റ് ചെയ്യാനാണ്. എന്നോട് ദേഷ്യം വേണ്ട, ഇത് എഴുതിയവൻ ഒരു ഹോബി നോക്കട്ടെ!"
    ],
    zoro: [
      "മൂന്ന് വാളുമായി ഞാൻ ആളുകളെ വെട്ടിയിട്ടും, നീ ഒരു ചെയറിൽ നിന്ന് എഴുന്നേൽക്കാൻ പറ്റാതെ ഇരിക്കുന്നു {name}, മൈര്. കഷ്ടം!",
      "വഴി തെറ്റിയോ? ബ്രേക്ക്ഫാസ്റ്റ് മുതൽ നീ ഒരു സ്ഥലത്ത് തന്നെയാണ് തെണ്ടി! ഞാൻ പോലും ഡോക്കിലേക്ക് വഴി കണ്ടുപിടിച്ചു!",
      "വെള്ളം കുടിക്ക്. സാക്കെ അല്ല, കാപ്പി അല്ല. വെള്ളം. ഗ്ലാസ് വെട്ടിത്തരണോ ഞാൻ, പോടാ?"
    ],
    spiderman: [
      "വലിയ ശക്തിക്ക് വലിയ ഉത്തരവാദിത്വം, പക്ഷേ നീ നിന്റെ ശക്തി 2 മണിക്ക് റീൽസിൽ കളയുന്നു, മൈര് {name}!",
      "ഞാൻ കെട്ടിടങ്ങൾ തമ്മിൽ ചാടി നടക്കുന്നു, എന്നിട്ടും നിന്റെ കുത്തിയിരിപ്പിനേക്കാൾ നല്ലതാണ് എന്റെ കാർഡിയോ. എഴുന്നേൽക്ക് പോടാ {addr}!",
      "നിന്റെ ചെയറിന് നിന്റെ പ്രേമ ജീവിതത്തേക്കാൾ ആക്ഷൻ ഉണ്ട്. ക്ഷമിക്കണം, ആരെങ്കിലും പറയണമായിരുന്നു. ഇപ്പോൾ സ്ട്രെച്ച് ചെയ്യ്!"
    ]
  }
};

for (const [lang, pack] of Object.entries(PROFILE_LINES)) {
  if (!LOCALES[lang]) continue;
  LOCALES[lang].profile = pack.profile;
  LOCALES[lang].profileAdult = pack.profileAdult;
}
for (const [lang, heroes] of Object.entries(HERO_RAW)) {
  if (!LOCALES[lang] || !LOCALES[lang].adult) continue;
  for (const [hero, lines] of Object.entries(heroes)) {
    LOCALES[lang].adult[hero] = (LOCALES[lang].adult[hero] || []).concat(lines);
  }
}

// Office / manager banter for "Job / Working". Clean sets are family-friendly; the adult sets only show with 18+ mode on.
const JOB_LINES = {
  english: {
    clean: [
      "No call from your manager yet, {name}? Give it a minute. He'll find a way to make your evening 'quick sync' too.",
      "Appraisal season: a 2% raise and a 'great attitude' sticker. Stay hydrated, {addr}, it's the only perk that's real.",
      "Client reported a bug, manager is typing... that's the corporate horror movie, {name}. Deep breath.",
      "Escape plan from the 9-to-5: save a bit, learn a bit, quit with style. Until then, stretch. Your chair isn't a hostage taker.",
      "Survival tip: 'per my last email' is a polite way of saying 'read it again'. Use it daily, {addr}.",
      "Overtime is free motivation for the company, {name}. Log off on time. Your life is not a sprint ticket."
    ],
    adult: [
      "Manager called again at 9 PM? Mute the damn phone, {name}. Your free time isn't in the contract.",
      "2% appraisal? That's not a raise, {addr}, that's an insult with a bow on it. Update your CV.",
      "Client bug, manager panicking, you're the one fixing it. Corporate bullshit at its finest, {name}. Take a break.",
      "OT till midnight for nothing? Don't be a damn doormat. Close the laptop and go live a little.",
      "9-to-5 slavery with a fancy job title. Plan your escape, {name}, and drink some water while you do it."
    ]
  },
  manglish: {
    clean: [
      "Manager-nte call vannille ithuvare? Veedil irunnum pani eduppichu kollumallo avan!",
      "Eda {name}, appraisal-il 2% tharan manager kaanikkunna ahankaaram orthu valla vellavum kudi!",
      "Client bug paranju thudangi, manager ippo message ayakkum... scene aano {name}?",
      "OT cheythu jeevitham kalayukayano? Kurachu rest edukku {name}, laptop onnu adakku!",
      "9-to-5 adimathwathil ninnu rakshappedan oru plan undakku {name}. Appo vare vellam kudi, stretch cheyy!",
      "Survival tip: 'as per my last email' ennu paranjaal 'vaayichu nokkada' ennanu artham. Daily upayogikku {addr}!"
    ],
    adult: [
      "Manager-nte call vannille ithuvare? Veedil irunnum pani eduppichu kollumallo avan, myre!",
      "Eda {name}, appraisal-il 2% tharan manager kaanikkunna ahankaaram orthu valla vellavum kudi, theppu!",
      "Client bug paranju thudangi, manager ippo message ayakkum... scene aano machane? Myre!",
      "OT cheythu jeevitham kalayukayano? Kurachu rest edukk myre!",
      "9-to-5 adimathwam, oombiya salary... escape plan ready aakku {name}. Appo vare vellam kudi!"
    ]
  },
  malayalam: {
    clean: [
      "മാനേജറുടെ കോൾ വന്നില്ലേ ഇതുവരെ? വീട്ടിൽ ഇരുന്നും പണി എടുപ്പിച്ചു കൊല്ലുമല്ലോ അവൻ!",
      "ഡാ {name}, അപ്രൈസലിൽ 2% തരാൻ മാനേജർ കാണിക്കുന്ന അഹങ്കാരം ഓർത്ത് വല്ല വെള്ളവും കുടിക്ക്!",
      "ക്ലയന്റ് ബഗ് പറഞ്ഞു തുടങ്ങി, മാനേജർ ഇപ്പോൾ മെസ്സേജ് അയക്കും... സീൻ ആണോ {name}?",
      "ഓവർടൈം ചെയ്ത് ജീവിതം കളയുകയാണോ? കുറച്ച് റെസ്റ്റ് എടുക്ക് {name}, ലാപ്ടോപ്പ് അടയ്ക്ക്!",
      "9-to-5 അടിമത്തത്തിൽ നിന്ന് രക്ഷപ്പെടാൻ ഒരു പ്ലാൻ ഉണ്ടാക്ക് {name}. അതുവരെ വെള്ളം കുടിക്ക്, സ്ട്രെച്ച് ചെയ്യ്!"
    ],
    adult: [
      "മാനേജറുടെ കോൾ വന്നില്ലേ ഇതുവരെ? വീട്ടിൽ ഇരുന്നും പണി എടുപ്പിച്ചു കൊല്ലുമല്ലോ അവൻ, മൈര്!",
      "ഡാ {name}, അപ്രൈസലിൽ 2% തരാൻ മാനേജർ കാണിക്കുന്ന അഹങ്കാരം ഓർത്ത് വല്ല വെള്ളവും കുടിക്ക്, തെപ്പ്!",
      "ക്ലയന്റ് ബഗ് പറഞ്ഞു തുടങ്ങി, മാനേജർ ഇപ്പോൾ മെസ്സേജ് അയക്കും... സീൻ ആണോ മച്ചാനേ? മൈര്!",
      "OT ചെയ്ത് ജീവിതം കളയുകയാണോ? കുറച്ച് റെസ്റ്റ് എടുക്ക് മൈര്!"
    ]
  }
};
for (const [lang, set] of Object.entries(JOB_LINES)) {
  const L = LOCALES[lang];
  if (!L) continue;
  if (L.profile && L.profile.status) L.profile.status.working = (L.profile.status.working || []).concat(set.clean);
  if (L.profileAdult && L.profileAdult.status) L.profileAdult.status.working = (L.profileAdult.status.working || []).concat(set.adult);
}

// ----------------------------------------------------------------------------- 18+ mode: harder profile pools
// Adult mode only (age 18+). Abuse is aimed at the user's own habits, never at groups of people.
// Languages without a clean profile set (everything except English/Manglish/Malayalam) get these only in 18+ mode.
const PROFILE_ADULT_HARD = {
  english: {
    relationship: {
      single: ["Still single, {name}? Fuck, even your hand is thinking of leaving you.", "You put months of effort into one person and got ghosted. Wasted effort, dumbass. Learn something."],
      relationship: ["Left your partner on 'seen' again, you inconsiderate shit? Reply before they find someone who actually shows up."],
      married: ["Married and still dodging chores, {name}? Do the damn dishes, you useless fuck."]
    },
    status: {
      working: [
        "Your manager is a parasite with a calendar invite, {name}. Mute him and live.",
        "2% appraisal after killing yourself all year? Fuck that. Update the CV, corporate bitch.",
        "Working overtime for free so some asshole can buy a bigger car. Think about that, {name}."
      ],
      student: ["Backlog the size of a goddamn mountain and you're on your phone? Open the fucking book, {name}."],
      idle: ["You're rotting in that chair, {name}. Life's passing you by and you're scrolling like a dead-eyed shithead. Get up."]
    }
  },
  manglish: {
    relationship: {
      single: ["Single aano {name}? Ninte kayyum ninne vittu pokaan nokkunnu, patti. Purathirangu!", "Oru aalkku vendi maasangal kalanju, avasanam ghost aayi. Waste effort, thendi {name}!"],
      relationship: ["Partner-nte message seen-il idu, kunna? Reply ayakku, allenkil vere aalu ennu varum myre!"],
      married: ["Kalyaanam kazhinjittum veettu joli ozhiyunno {name}? Paathram kazhuku, poori mone!"]
    },
    status: {
      working: [
        "Manager oru parasite aanu {name}, myre. Phone silent aakki jeevikku!",
        "Varsham muzhuvan pani eduthittu 2% appraisal? Poda patti, CV update cheyy!",
        "Free-yil OT cheythu aa thendikku puthiya car vaangikkoduthu, {name}. Chindikku myre!"
      ],
      student: ["Backlog mala pole, ninte kayyil phone, myre {name}. Pusthakam thurakkada thendi!"],
      idle: ["Chair-il kidannu chaakunnu {name}, jeevitham poyi, nee reels nokki irikkunnu, patti. Eneettu poda!"]
    }
  },
  malayalam: {
    relationship: {
      single: ["സിംഗിൾ ആണോ {name}? നിന്റെ കൈ പോലും നിന്നെ വിട്ടു പോകാൻ നോക്കുന്നു, പട്ടി. പുറത്തിറങ്ങ്!", "ഒരാൾക്ക് വേണ്ടി മാസങ്ങൾ കളഞ്ഞു, അവസാനം ഗോസ്റ്റ് ആയി. വേസ്റ്റ് എഫർട്ട്, തെണ്ടി {name}!"],
      relationship: ["പാർട്ണറുടെ മെസ്സേജ് സീനിൽ ഇടുന്നോ, കുണ്ണേ? റിപ്ലൈ അയക്ക്, അല്ലെങ്കിൽ വേറെ ആള് വരും മൈര്!"],
      married: ["കല്യാണം കഴിഞ്ഞിട്ടും വീട്ടുജോലി ഒഴിയുന്നോ {name}? പാത്രം കഴുക്, പൂറിമോനേ!"]
    },
    status: {
      working: [
        "മാനേജർ ഒരു പാരസൈറ്റ് ആണ് {name}, മൈര്. ഫോൺ സൈലന്റ് ആക്കി ജീവിക്ക്!",
        "വർഷം മുഴുവൻ പണി എടുത്തിട്ട് 2% അപ്രൈസൽ? പോടാ പട്ടി, സിവി അപ്ഡേറ്റ് ചെയ്യ്!",
        "ഫ്രീയായി OT ചെയ്ത് ആ തെണ്ടിക്ക് പുതിയ കാർ വാങ്ങിക്കൊടുത്തു, {name}. ചിന്തിക്ക് മൈര്!"
      ],
      student: ["ബാക്ക്‌ലോഗ് മല പോലെ, നിന്റെ കയ്യിൽ ഫോൺ, മൈര് {name}. പുസ്തകം തുറക്കടാ തെണ്ടി!"],
      idle: ["ചെയറിൽ കിടന്ന് ചാവുന്നു {name}, ജീവിതം പോയി, നീ റീൽസ് നോക്കിയിരിക്കുന്നു, പട്ടി. എഴുന്നേൽക്ക് പോടാ!"]
    }
  },
  hinglish: {
    relationship: {
      single: ["Abhi bhi single, {name}? Teri profile dekh ke toh AI bhi left swipe maar de. Shakal dhoke bahar nikal, saale.", "Reels scroll kar kar ke angootha pension maangega aur date ek nahi. Teri love life ki gaand mari hui hai.", "Itni mehnat ek insaan ko impress karne mein ki, aur wo block karke chala gaya. Waste of effort, chutiye."],
      relationship: ["Partner ke message ka reply nahi diya, {name}? Seen pe chhodna bhi gunah hai, kamine. Abhi reply kar.", "Status 'taken', screen time bolta hai 'laptop ke saath cheating'. Sharam kar, chutiye."],
      married: ["Shaadi ke baad 'haan ji haan ji' karte karte retire ho jayega, {name}. Zinda nahi hai tu, sirf adjust kar raha hai.", "Partner bole 'kuch nahi' toh matlab sab kuch hai, gadhe. Laptop band kar aur sun."]
    },
    status: {
      working: [
        "Manager ka call aaya kya abhi tak? Ghar baithe bhi tera khoon choos raha hai saala.",
        "Appraisal mein 2%? Ye raise nahi, muh pe thappad hai, {name}. CV update kar, majdoor.",
        "Client bola 'urgent', matlab usko ab yaad aaya. Teri shaam kyun barbaad karne de, chutiye?",
        "Corporate majdoori ki salary slip sundar hai par teri aatma ki gaand phat chuki hai, {name}. Nikal yahan se.",
        "Bug client ne bataya, blame tera, credit manager ka. Corporate bhosdi ka system hai ye, {name}."
      ],
      student: ["Exam sir pe, backlog dekhne ki himmat nahi. Kitaab khol, chutiye {name}!", "Assignment raat ke 3 baje chai peete peete rota hua karega, saale. Abhi shuru kar.", "Fail hone mein bhi teri mehnat nahi hai. Ek chapter, abhi. Procrastination ka raja mat ban."],
      idle: ["Din bhar sona, raat bhar reels. Wi-Fi wala vampire hai tu, {name}. Kaam dhoondh, nikamme.", "Teri CV tere bahanon se bhi patli hai. Kahin apply kar, bhosdike.", "Chair mein sad raha hai tu, saala. Zindagi nikal rahi hai, uth ja!"]
    }
  },
  hindi: {
    relationship: {
      single: ["अभी भी सिंगल, {name}? तेरी प्रोफ़ाइल देख के तो AI भी लेफ़्ट स्वाइप मार दे। शक्ल धोके बाहर निकल, साले।", "रील्स स्क्रॉल कर-कर के अंगूठा पेंशन माँगेगा और डेट एक नहीं। तेरी लव लाइफ की गांड मारी हुई है।", "इतनी मेहनत एक इंसान को इम्प्रेस करने में की, और वो ब्लॉक करके चला गया। वेस्ट ऑफ एफर्ट, चूतिये।"],
      relationship: ["पार्टनर के मैसेज का रिप्लाई नहीं दिया, {name}? सीन पे छोड़ना भी गुनाह है, कमीने। अभी रिप्लाई कर।", "स्टेटस 'टेकन', स्क्रीन टाइम बोलता है 'लैपटॉप के साथ चीटिंग'। शर्म कर, चूतिये।"],
      married: ["शादी के बाद 'हाँ जी हाँ जी' करते-करते रिटायर हो जाएगा, {name}। ज़िंदा नहीं है तू, सिर्फ़ एडजस्ट कर रहा है।", "पार्टनर बोले 'कुछ नहीं' तो मतलब सब कुछ है, गधे। लैपटॉप बंद कर और सुन।"]
    },
    status: {
      working: [
        "मैनेजर का कॉल आया क्या अभी तक? घर बैठे भी तेरा खून चूस रहा है साला।",
        "अप्रेज़ल में 2%? ये रेज़ नहीं, मुँह पे थप्पड़ है, {name}। सीवी अपडेट कर, मजदूर।",
        "क्लाइंट बोला 'अर्जेंट', मतलब उसको अब याद आया। तेरी शाम क्यों बर्बाद करने दे, चूतिये?",
        "कॉर्पोरेट मजदूरी की सैलरी स्लिप सुंदर है पर तेरी आत्मा की गांड फट चुकी है, {name}। निकल यहाँ से।",
        "बग क्लाइंट ने बताया, ब्लेम तेरा, क्रेडिट मैनेजर का। ये कॉर्पोरेट भोसड़ी का सिस्टम है, {name}।"
      ],
      student: ["एग्ज़ाम सिर पे, बैकलॉग देखने की हिम्मत नहीं। किताब खोल, चूतिये {name}!", "असाइनमेंट रात के 3 बजे चाय पीते-पीते रोता हुआ करेगा, साले। अभी शुरू कर।", "फ़ेल होने में भी तेरी मेहनत नहीं है। एक चैप्टर, अभी। प्रोक्रैस्टिनेशन का राजा मत बन।"],
      idle: ["दिन भर सोना, रात भर रील्स। वाई-फ़ाई वाला वैम्पायर है तू, {name}। काम ढूँढ, निकम्मे।", "तेरा सीवी तेरे बहानों से भी पतला है। कहीं अप्लाई कर, भोसड़ीके।", "चेयर में सड़ रहा है तू, साले। ज़िंदगी निकल रही है, उठ जा!"]
    }
  },
  tanglish: {
    relationship: {
      single: ["Innum single-a {name}? Un kaiyum unna vittu pogalaamnu paakkuthu, punda. Veliya po da!", "Oru aalukkaaga maasa kanakka mehnat pannita, kadaisila ghost pannitaanga. Waste of effort, loosu pundai!", "Un profile paartha AI kooda left swipe adikkum, thevidiya payale. Mugam kazhuvittu po!"],
      relationship: ["Partner message-ku seen vittutu irukka, naaye {name}? Reply pannu, illati vera aal vandhurum, oombu!"],
      married: ["Kalyaanam aagitum veetu velai thappikkara {name}? Paathiram kazhuvu da, soothu!"]
    },
    status: {
      working: [
        "Un manager oru parasite da {name}, thevidiya payale. Phone-a silent pannitu vaazhu!",
        "Varusham muzhukka velai senjutu 2% appraisal-a? Punda, CV update pannu!",
        "Free-ya OT pannitu antha oombu-ku pudhu car vaangi kuduthutta, {name}. Yosi!",
        "Corporate adimai salary slip azhagaa irukku, aana un aathma soothu kizhinjiduchu {name}. Veliya vaa!",
        "Client bug sonnaan, blame unakku, credit manager-ku. Idhu corporate oombu system {name}!"
      ],
      student: ["Backlog malai maadhiri, un kaila phone, naaye {name}. Book-a thira da!", "Assignment 3 manikku chai kudichitu azhuthukittu pannuviya, loosu? Ippove aarambi!"],
      idle: ["Chair-la sethuttu irukka {name}, vaazhkai pogudhu, nee reels paakkura, punda. Ezhunthiru da!", "Un CV un bayaanam vida sinnadhu, thevidiya payale. Enga aavadhu apply pannu!"]
    }
  },
  tamil: {
    relationship: {
      single: ["இன்னும் சிங்கிளா {name}? உன் கையும் உன்னை விட்டு போகலாம்னு பாக்குது, புண்டை. வெளிய போ டா!", "ஒரு ஆளுக்காக மாசக்கணக்குல உழைச்ச, கடைசில கோஸ்ட் பண்ணிட்டாங்க. வேஸ்ட் ஆஃப் எஃபர்ட், லூசு!", "உன் ப்ரொஃபைல் பார்த்தா AI கூட லெஃப்ட் ஸ்வைப் அடிக்கும், தேவிடியா பயலே. முகத்தை கழுவிட்டு போ!"],
      relationship: ["பார்ட்னர் மெசேஜுக்கு சீன் விட்டுட்டு இருக்க, நாயே {name}? ரிப்ளை பண்ணு, இல்லன்னா வேற ஆள் வந்துடும், ஓம்பு!"],
      married: ["கல்யாணம் ஆகியும் வீட்டு வேலை தப்பிக்கிற {name}? பாத்திரம் கழுவு டா, சூத்து!"]
    },
    status: {
      working: [
        "உன் மேனேஜர் ஒரு பாராசைட் டா {name}, தேவிடியா பயலே. போனை சைலன்ட் பண்ணிட்டு வாழு!",
        "வருஷம் முழுக்க வேலை செஞ்சுட்டு 2% அப்ரைசலா? புண்டை, சிவி அப்டேட் பண்ணு!",
        "ஃப்ரீயா ஓடி பண்ணிட்டு அந்த ஓம்புக்கு புது கார் வாங்கி குடுத்துட்ட, {name}. யோசி!",
        "கார்ப்பரேட் அடிமை சாலரி ஸ்லிப் அழகா இருக்கு, ஆனா உன் ஆத்மா சூத்து கிழிஞ்சிடுச்சு {name}. வெளிய வா!",
        "க்ளையன்ட் பக் சொன்னான், பழி உனக்கு, கிரெடிட் மேனேஜருக்கு. இது கார்ப்பரேட் ஓம்பு சிஸ்டம் {name}!"
      ],
      student: ["பேக்லாக் மலை மாதிரி, உன் கையில போன், நாயே {name}. புக்கை தொற!", "அசைன்மென்ட் 3 மணிக்கு சாய் குடிச்சுட்டு அழுதுகிட்டு பண்ணுவியா, லூசு? இப்பவே ஆரம்பி!"],
      idle: ["சேர்ல செத்துட்டு இருக்க {name}, வாழ்க்கை போகுது, நீ ரீல்ஸ் பாக்குற, புண்டை. எழுந்திரு டா!", "உன் சிவி உன் சாக்குகளை விட சின்னது, தேவிடியா பயலே. எங்கயாவது அப்ளை பண்ணு!"]
    }
  },
  kanglish: {
    relationship: {
      single: ["Innu single-a {name}? Ninna kai kooda ninna bittu hogtini antide, nayi. Horage hogu!", "Obba vyakthigaagi tingalu kalde, kone-ge ghost maadbittru. Waste of effort, bolimaga!", "Ninna profile nodidre AI kooda left swipe maaDutte, sule magane. Mukha tholkondu hogu!"],
      relationship: ["Partner message-ge seen-alli bittiya, nayi {name}? Reply maadu, illandre bere yaaradru barthare, bevarsi!"],
      married: ["Maduve aadru mane kelasa tappisikotiya {name}? Paatre tholi, gaandu!"]
    },
    status: {
      working: [
        "Ninna manager obba parasite {name}, sule magane. Phone silent maadi baalu!",
        "Varsha full kelasa maadi 2% appraisal-a? Bolimaga, CV update maadu!",
        "Free-aagi OT maadi aa bevarsi-ge hosa car tandu kotte, {name}. Yochane maadu!",
        "Corporate gulami salary slip chennagide, aadre ninna aatma gaandu hodiyitu {name}. Horage baa!",
        "Client bug helida, blame ninnadu, credit manager-ge. Idu corporate bolimaga system {name}!"
      ],
      student: ["Backlog betta thara, ninna kaiyalli phone, nayi {name}. Pustaka tegeyo!", "Assignment 3 gantege chai kudidu aluttha maadtiya, hucchane? Ee kshanave shuru maadu!"],
      idle: ["Chair-alli satthu hogtiya {name}, jeevana hogthide, nee reels nodtiya, bevarsi. Eddu hogu!", "Ninna CV ninna bahanegalinta chikkadu, sule magane. Yellaadru apply maadu!"]
    }
  },
  kannada: {
    relationship: {
      single: ["ಇನ್ನೂ ಸಿಂಗಲ್ಲಾ {name}? ನಿನ್ನ ಕೈ ಕೂಡ ನಿನ್ನ ಬಿಟ್ಟು ಹೋಗ್ತೀನಿ ಅಂತಿದೆ, ನಾಯಿ. ಹೊರಗೆ ಹೋಗು!", "ಒಬ್ಬ ವ್ಯಕ್ತಿಗಾಗಿ ತಿಂಗಳು ಕಳೆದೆ, ಕೊನೆಗೆ ಘೋಸ್ಟ್ ಮಾಡಿಬಿಟ್ರು. ವೇಸ್ಟ್ ಆಫ್ ಎಫರ್ಟ್, ಬೋಳಿಮಗ!", "ನಿನ್ನ ಪ್ರೊಫೈಲ್ ನೋಡಿದ್ರೆ AI ಕೂಡ ಲೆಫ್ಟ್ ಸ್ವೈಪ್ ಮಾಡುತ್ತೆ, ಸೂಳೆ ಮಗನೇ. ಮುಖ ತೊಳ್ಕೊಂಡು ಹೋಗು!"],
      relationship: ["ಪಾರ್ಟ್ನರ್ ಮೆಸೇಜ್‌ಗೆ ಸೀನ್‌ನಲ್ಲಿ ಬಿಟ್ಟಿಯಾ, ನಾಯಿ {name}? ರಿಪ್ಲೈ ಮಾಡು, ಇಲ್ಲಾಂದ್ರೆ ಬೇರೆ ಯಾರಾದ್ರೂ ಬರ್ತಾರೆ, ಬೇವರ್ಸಿ!"],
      married: ["ಮದುವೆ ಆದ್ರೂ ಮನೆ ಕೆಲಸ ತಪ್ಪಿಸ್ಕೋತೀಯ {name}? ಪಾತ್ರೆ ತೊಳಿ, ಗಾಂಡು!"]
    },
    status: {
      working: [
        "ನಿನ್ನ ಮ್ಯಾನೇಜರ್ ಒಬ್ಬ ಪ್ಯಾರಾಸೈಟ್ {name}, ಸೂಳೆ ಮಗನೇ. ಫೋನ್ ಸೈಲೆಂಟ್ ಮಾಡಿ ಬಾಳು!",
        "ವರ್ಷ ಫುಲ್ ಕೆಲಸ ಮಾಡಿ 2% ಅಪ್ರೈಸಲ್ಲಾ? ಬೋಳಿಮಗ, ಸಿವಿ ಅಪ್ಡೇಟ್ ಮಾಡು!",
        "ಫ್ರೀಯಾಗಿ ಓಟಿ ಮಾಡಿ ಆ ಬೇವರ್ಸಿಗೆ ಹೊಸ ಕಾರ್ ತಂದು ಕೊಟ್ಟೆ, {name}. ಯೋಚನೆ ಮಾಡು!",
        "ಕಾರ್ಪೊರೇಟ್ ಗುಲಾಮಗಿರಿ ಸ್ಯಾಲರಿ ಸ್ಲಿಪ್ ಚೆನ್ನಾಗಿದೆ, ಆದ್ರೆ ನಿನ್ನ ಆತ್ಮದ ಗಾಂಡು ಹರಿದಿದೆ {name}. ಹೊರಗೆ ಬಾ!",
        "ಕ್ಲೈಂಟ್ ಬಗ್ ಹೇಳ್ದ, ಬ್ಲೇಮ್ ನಿನ್ನದು, ಕ್ರೆಡಿಟ್ ಮ್ಯಾನೇಜರ್‌ಗೆ. ಇದು ಕಾರ್ಪೊರೇಟ್ ಬೋಳಿಮಗ ಸಿಸ್ಟಮ್ {name}!"
      ],
      student: ["ಬ್ಯಾಕ್‌ಲಾಗ್ ಬೆಟ್ಟದ ತರ, ನಿನ್ನ ಕೈಯಲ್ಲಿ ಫೋನ್, ನಾಯಿ {name}. ಪುಸ್ತಕ ತೆಗಿ!", "ಅಸೈನ್ಮೆಂಟ್ 3 ಗಂಟೆಗೆ ಚಾ ಕುಡಿದು ಅಳ್ತಾ ಮಾಡ್ತೀಯ, ಹುಚ್ಚನೇ? ಈ ಕ್ಷಣವೇ ಶುರು ಮಾಡು!"],
      idle: ["ಚೇರ್‌ನಲ್ಲಿ ಸತ್ತು ಹೋಗ್ತಿಯ {name}, ಜೀವನ ಹೋಗ್ತಿದೆ, ನೀನು ರೀಲ್ಸ್ ನೋಡ್ತಿಯ, ಬೇವರ್ಸಿ. ಎದ್ದು ಹೋಗು!", "ನಿನ್ನ ಸಿವಿ ನಿನ್ನ ನೆಪಗಳಿಗಿಂತ ಚಿಕ್ಕದು, ಸೂಳೆ ಮಗನೇ. ಎಲ್ಲಾದ್ರೂ ಅಪ್ಲೈ ಮಾಡು!"]
    }
  }
};
for (const [lang, pack] of Object.entries(PROFILE_ADULT_HARD)) {
  const L = LOCALES[lang];
  if (!L) continue;
  L.profileAdult = L.profileAdult || { relationship: {}, status: {} };
  for (const [group, keys] of Object.entries(pack)) {
    L.profileAdult[group] = L.profileAdult[group] || {};
    for (const [key, lines] of Object.entries(keys)) {
      L.profileAdult[group][key] = (L.profileAdult[group][key] || []).concat(lines);
    }
  }
}

// ----------------------------------------------------------------------------- Birthday greetings
// Spoken by the companion on the user's birthday (the renderer asks for kind 'birthday'); same lines for every gender.
const BIRTHDAY_LINES = {
  english:   ["Happy Birthday, {name}! 🎂 I'd bring cake, but I'm a sprite. Have a wonderful day!", "It's your birthday, {name}! Take a break, you've earned it. 🎉", "Many happy returns, {name}! May this year be your best one yet."],
  manglish:  ["Janmadina aashamsakal, {name}! 🎂 Njan cake kondu varaan pattilla, sprite alle. Nalloru divasam aakatte!", "Innu ninte birthday aanu {name}! Oru break edukku, athinu arhathayundu. 🎉", "Happy Birthday {name}! Ee varsham ninte ettavum nalla varsham aakatte."],
  malayalam: ["ജന്മദിനാശംസകൾ, {name}! 🎂 കേക്ക് കൊണ്ടുവരാൻ പറ്റില്ല, ഞാനൊരു സ്പ്രൈറ്റല്ലേ. നല്ലൊരു ദിവസം ആകട്ടെ!", "ഇന്ന് നിന്റെ പിറന്നാളാണ് {name}! ഒരു ബ്രേക്ക് എടുക്കൂ, അതിനുള്ള അർഹതയുണ്ട്. 🎉", "ഹാപ്പി ബർത്ത്ഡേ {name}! ഈ വർഷം നിന്റെ ഏറ്റവും നല്ല വർഷമാകട്ടെ."],
  hinglish:  ["Happy Birthday, {name}! 🎂 Cake laata, par main sprite hoon. Din badhiya guzre!", "Aaj tumhara birthday hai, {name}! Break lo, tumne kamaya hai. 🎉", "Janamdin mubarak {name}! Yeh saal tumhara ab tak ka sabse achha saal ho."],
  hindi:     ["जन्मदिन मुबारक, {name}! 🎂 केक लाता, पर मैं स्प्राइट हूँ। दिन बढ़िया गुज़रे!", "आज तुम्हारा जन्मदिन है, {name}! ब्रेक लो, तुमने कमाया है। 🎉", "हैप्पी बर्थडे {name}! यह साल तुम्हारा अब तक का सबसे अच्छा साल हो।"],
  tanglish:  ["Pirandha naal nalvaazhthukkal, {name}! 🎂 Cake kondu varalaam, aana naan oru sprite. Nalla naala amaiyattum!", "Innaiku un birthday {name}! Oru break edu, adhukku nee thaguthi. 🎉", "Happy Birthday {name}! Indha varusham un ippo varaikum nalla varushama irukkattum."],
  tamil:     ["பிறந்தநாள் வாழ்த்துகள், {name}! 🎂 கேக் கொண்டு வரலாம், ஆனா நான் ஒரு ஸ்பிரைட். நல்ல நாளா அமையட்டும்!", "இன்னைக்கு உன் பிறந்தநாள் {name}! ஒரு பிரேக் எடு, அதுக்கு தகுதி இருக்கு. 🎉", "ஹேப்பி பர்த்டே {name}! இந்த வருஷம் இதுவரை உன்னோட சிறந்த வருஷமா இருக்கட்டும்."],
  kanglish:  ["Huttu habbada shubhaashayagalu, {name}! 🎂 Cake tarbahudu, aadre naanu sprite. Olle dina aagali!", "Ivattu ninna birthday {name}! Break tegedko, adakke arhate ide. 🎉", "Happy Birthday {name}! Ee varsha ninna ee tanakada ati olle varsha aagali."],
  kannada:   ["ಹುಟ್ಟುಹಬ್ಬದ ಶುಭಾಶಯಗಳು, {name}! 🎂 ಕೇಕ್ ತರಬಹುದಿತ್ತು, ಆದ್ರೆ ನಾನು ಸ್ಪ್ರೈಟ್. ಒಳ್ಳೆಯ ದಿನ ಆಗಲಿ!", "ಇವತ್ತು ನಿನ್ನ ಹುಟ್ಟುಹಬ್ಬ {name}! ಬ್ರೇಕ್ ತಗೋ, ಅದಕ್ಕೆ ಅರ್ಹತೆ ಇದೆ. 🎉", "ಹ್ಯಾಪಿ ಬರ್ತ್‌ಡೇ {name}! ಈ ವರ್ಷ ನಿನ್ನ ಇದುವರೆಗಿನ ಅತ್ಯುತ್ತಮ ವರ್ಷ ಆಗಲಿ."]
};
for (const [lang, lines] of Object.entries(BIRTHDAY_LINES)) {
  if (LOCALES[lang]) LOCALES[lang].birthday = { male: lines, female: lines, other: lines };
}
