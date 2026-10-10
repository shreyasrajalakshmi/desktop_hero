// Character-specific dialogue in the three languages written by hand: English, Manglish (Malayalam in
// English letters) and Malayalam. Every hero has his own voice; nothing is cloned between characters.
//   {name} the user's name        {addr} a friendly noun by gender (bro / machane / mole ...)
//   {eda}  an informal call by gender (Hey / Eda / Edi ...)     {time}, {task} as elsewhere
// Other languages (Hindi, Tamil, Kannada, in both scripts) keep their own sets and fall back to the
// neutral `generic` lines for the newer heroes.
const heroSame = lines => ({ male: lines, female: lines, other: lines });

// ----------------------------------------------------------------------------- clean quips
const HERO_QUIPS = {
  english: {
    spiderman: [
      "Friendly neighbourhood reminder, {name}: water. Your brain is 70% tabs and 30% water. Fix the ratio!",
      "With great power comes great screen time. Stretch it out, {addr}!",
      "My spider-sense is tingling... it says your posture is a crime scene.",
      "Just swinging by to say: blink, {name}. You're staring at that screen like it owes you money."
    ],
    robobuddy: [
      "Beep boop! Hydration.exe has stopped responding. Please drink water, {name}.",
      "Warning: human battery at 23%. Recommended action: sit back, stretch, repeat.",
      "Calculating... result: you need a break. Confidence: 99.7%.",
      "Error 404: good posture not found. Please sit up straight, {addr}."
    ],
    hoodbot: [
      "...Systems nominal. You, however, are not. Water. Now, {name}.",
      "I run on silence and 8% battery. You run on coffee. We are not the same, {addr}.",
      "Glitch detected: you've been sitting for 90 minutes. Reboot by standing.",
      "Low-power mode suggested. For you. Go outside. Photosynthesize."
    ],
    deadpool: [
      "Hey {name}! Yes, you. Not the screen. Drink water, I can't do CPR through a monitor.",
      "Fourth wall check: still broken. Developer, if you're reading this, I want a sequel. And a raise.",
      "Maximum effort! ...is not what you're giving that desk job, {addr}. Stretch!",
      "I'm a desktop pet. You're a desktop... sitter. Let's both get up and do something with our lives."
    ],
    zoro: [
      "Where's the exit on this screen? ...I swear it was left. Anyway, drink water, {name}. I'm out of sake.",
      "I'd say take a nap, but I'm the one who sleeps around here. Stretch, {addr}.",
      "Lost again. Not on the screen, in my own head. Water helps, {name}.",
      "Three swords, zero sense of direction. You have a taskbar and still get lost. Focus."
    ],
    luffy: [
      "{name}, I'm hungry! Is it meat time? ...No? Okay, water then.",
      "I'm gonna be King of the Pirates! You're gonna be King of... staying hydrated! Drink!",
      "Shishishi! Stretch time! Gum-gum... STRETCH!",
      "Is there meat in that tab? No? Then close it and go eat, {addr}!"
    ],
    kakashi: [
      "Sorry I'm late, {name}. I got lost on the path of life... and in this book. Anyway, hydrate.",
      "Eyes tired? Turn your Sharingan off, {addr}. Look at something far away. Wise ninjas rest.",
      "A shinobi must look underneath the underneath... of the screen glare. Take a break.",
      "I'm just reading 'Make-Out Paradise' for the plot, {name}. Don't peek. Go drink some water."
    ],
    hulk: [
      "HULK SMASH THIRST! Drink water, {name}!",
      "Hulk no like tired posture. Hulk SMASH bad posture. Sit up!",
      "Hulk angry. Hulk angry because you not drink water. DRINK!",
      "Puny human need break. Hulk say STRETCH. Hulk not ask twice."
    ],
    alien: [
      "Greetings, Earthling {name}. Your species is dehydrated. Intake water.",
      "I come in peace, and with concern about your spine. Sit up, {addr}.",
      "On my planet we blink twice per second. You blink twice per hour. Concerning.",
      "Take me to your leader. ...Oh, you're the leader? Then lead yourself to the water."
    ],
    bigears: [
      "I heard that. ...Big ears. I heard you haven't had water in hours, {name}.",
      "My ears picked up your stomach growling from here. Eat something, {addr}.",
      "I'm told I look sad. I'm not. I'm just worried you're not blinking.",
      "Whispers carry far. Hear this one: stand up and stretch, {name}."
    ],
    ninjazen: [
      "Breathe in... breathe out... now drink water, {name}. This is the way.",
      "A calm mind needs a straight spine. Sit up, {addr}. Silently.",
      "I do not speak much. But I will say: blink. And stretch.",
      "Even the sword rests in its sheath. You may rest too."
    ],
    ninjakid: [
      "Ninja kid reporting! Mission: get {name} to drink water! Hi-yah!",
      "My hands are on fire but YOU need to cool down. Water! Now!",
      "Stealth tip: ninjas never slouch. Sit up, {addr}!",
      "Mission complete when you stretch. I'm counting... 3, 2, 1... go!"
    ],
    laptopguy: [
      "Pushing to prod at this hour? Respect, {name}. But hydrate before you crash.",
      "Have you tried turning yourself off and on again? Stand up. Sit down. Better.",
      "Your battery's at 20%, and I'm not talking about the laptop, {addr}.",
      "Peace out, for five minutes. Go drink water, then git commit."
    ],
    neonscout: [
      "Scouting report: target {name} is dehydrated. Recommended action: water. Over.",
      "Neon eyes on. Detecting slouch at 3 o'clock. Correct your posture, {addr}.",
      "Mission briefing: stand, stretch, sip. Execute.",
      "All quiet on the digital front. Except your eyes. They're screaming. Rest them."
    ]
  },

  manglish: {
    spiderman: [
      "{eda} {name}, kore neramaayallo lap-il thala vechirikkunnu... oru 2 minute eneettu nadakk!",
      "{addr}, vellam kudi... dehydration aayi scene aavaruthu!",
      "Ente spider-sense parayunnu, ninte irippu oru scene aanu. Nere irikk, {name}!",
      "Chumma irikkathe {addr}, onnu stretch cheyy. Njan ivide thookki kidannu ellaa sahichu irikkunnu!"
    ],
    robobuddy: [
      "Beep boop! Hydration.exe respond cheyyunnilla. Vellam kudi {name}, please!",
      "Warning: ninte battery 23% aanu {addr}. Oru stretch edukku, recharge aavum!",
      "Calculating... result: ninakku oru break venam. Confidence 99.7%!",
      "Error 404: nalla posture kandethan pattunnilla. Nere irikku {name}!"
    ],
    hoodbot: [
      "...Sistem okke ok aanu. Pakshe ninte karyam ok alla. Vellam kudi {name}, ippol thanne.",
      "Njan 8% battery-yil, silence-il odunnu. Nee kaappiyil. Nammal onnalla {addr}.",
      "Glitch kandethi: 90 minute aayi irikkunnu. Reboot cheyyaan eneettu ninnu nokku.",
      "Low-power mode nallathaanu... ninakku. Purathirangi oru veyil kollu {name}."
    ],
    deadpool: [
      "Eda {name}! Athe, ninnodu thanne. Screen-ine alla. Vellam kudi, monitor-ilude CPR tharaan ennikku pattilla!",
      "Fourth wall check: ippozhum pottiyirikkunnu. Developer enganum ithu vaayikkunnundenkil: ennikku oru sequel venam. Pinne oru salary hike-um!",
      "Maximum effort! ...ninte ee desk job-il athu kaanunnilla {addr}. Onnu stretch cheyy!",
      "Njan desktop pet, nee desktop-il ingane irippu. Randaalum onnu eneettu enthenkilum cheyyaam, kollaamo?"
    ],
    zoro: [
      "Screen-il evideyaada vazhi? Njan ivide dock-il kooduthal neram irunnaal urangi pokum... pinne {name}, vellam kudi, sake theernnu!",
      "Urangaan parayanam ennundu, pakshe ivide urakkam ente pani aanu {addr}. Ninakku stretch mathi!",
      "Veendum vazhi thetti... screen-il alla, ente thalayil. Vellam kudikku {name}, nallathaanu.",
      "Moonnu vaal, oru dik-bodhavum illa. Ninakku taskbar undu, enittum vazhi thetti. Shraddhikku!"
    ],
    luffy: [
      "Eda {name}! Vellamalla, irachi vallaathum edukkanundo? Vishannittu vayya!",
      "Njan Pirate King aavum! Nee 'vellam kudikkunna raja' aavu {name}. Kudi!",
      "Shishishi! Stretch time! Gum-gum... STRETCH!",
      "Ee tab-il irachi undo? Illa? Appo adachittu pova, bhakshanam kazhikku {addr}!"
    ],
    kakashi: [
      "Kshamikkanam {name}, njan vaikippoyi. Jeevithathinte vazhiyil... pinne ee pusthakathilum vazhi thetti. Anyway, vellam kudi!",
      "Kannu thalarnno? Sharingan off aakku bro. Dooreyulla enthenkilum nokku. Gyaaniyaaya ninja vishramikkum!",
      "Oru shinobi screen-inte glare-inte ullilum kaananam... ippo oru break edukku {name}.",
      "Njan 'Make-Out Paradise' vaayikkunnu, kathakkuvendi mathram {name}. Ottunokkalle. Vellam kudi!"
    ],
    hulk: [
      "HULK SMASH THIRST! Vellam kudi {name}, illenkil Hulk smash cheyyum!",
      "Hulk-inu ee kshinitha posture ishtamalla. Hulk SMASH bad posture! Nere irikku {addr}!",
      "Hulk ksheebham! Nee vellam kudikkaathathu kondu. KUDI!",
      "Cheriya manushyaa, break venam. Hulk parayunnu: STRETCH! Hulk randu thavana parayilla!"
    ],
    alien: [
      "Namaskaram, Bhoomiyile {name}. Ninte vargam dehydrated aanu. Vellam kudikku!",
      "Njan samadhanathode vannathaa, pakshe ninte muthuku orupaadu vishamam. Nere irikku {addr}!",
      "Ente grahathil njangal oru second-il randu thavana kannu chimmum. Nee oru manikkoorinu randu thavana. Pedikkenda karyam!",
      "Ninte netaavine kaanikku... aha, nee thanneyaano netaavu? Appo vellathinte adutthekku nadakku!"
    ],
    bigears: [
      "Njan kettu. Valiya chevi alle... ninte oru manikkoor-aayi vellam kudichittilla ennu {name}.",
      "Ente chevi ivide ninnu ninte vayarinte kaalal kettu. Enthenkilum kazhikku {addr}!",
      "Njan vishamam aanu ennu paranjittu. Alla, ninte kannu chimmunnillallo ennu pedi aanu.",
      "Chevi kooduthalaayathu kondu parayaam: eneettu onnu stretch cheyyu {name}, ippol!"
    ],
    ninjazen: [
      "Shwasam ullilekku... purathekku... ippol vellam kudi {name}. Ithaanu vazhi.",
      "Shaanthamaaya manassinu nere ulla muthuku venam. Nere irikku {addr}. Shabdamillathe!",
      "Njan kooduthal samsarikkilla. Pakshe parayaam: kannu chimmu, pinne stretch cheyyu.",
      "Vaal polum urayil vishramikkum. Ninakkum vishramikkaam {name}."
    ],
    ninjakid: [
      "Ninja kutti reporting! Mission: {name}-ne vellam kudippikkuka! Hi-yah!",
      "Ente kaiyil thee aanu, pakshe cool aakendath nee aanu. Vellam, ippol thanne!",
      "Stealth tip: ninjakal orikkalum kunjirikkilla. Nere irikku {addr}!",
      "Nee stretch cheythaal mission complete. Njan ennam: moonnu, randu, onnu... go!"
    ],
    laptopguy: [
      "Ee time-il prod-il push cheyyunno? Respect {name}. Pakshe crash aakunnathinu munpu vellam kudi!",
      "Ninne thanne off cheythu on cheythu nokkiyo? Eneettu nikku, veendum irikku. Nallathaanu!",
      "Ninte battery 20% aanu {addr}, laptop-inte alla!",
      "Peace out — 5 minute-ne. Vellam kudikku, pinne git commit cheyyu."
    ],
    neonscout: [
      "Scouting report: lakshyam {name} dehydrated aanu. Nirdesham: vellam. Over.",
      "Neon kannukal on. 3 o'clock-il slouch kandethi. Posture sheriyakku {addr}!",
      "Mission briefing: nikku, stretch cheyyu, vellam kudikku. Execute.",
      "Digital front-il ellaam shaanthamaanu. Ninte kannukal ozhike. Avarkku vishramam kodukku."
    ]
  },

  malayalam: {
    spiderman: [
      "{eda} {name}, കുറേ നേരമായല്ലോ ലാപ്പിൽ തല വെച്ചിരിക്കുന്നു... രണ്ട് മിനിറ്റ് എഴുന്നേറ്റ് ഒന്ന് നടക്ക്!",
      "{addr}, വെള്ളം കുടിക്ക്... ഡീഹൈഡ്രേഷൻ വന്ന് സീൻ ആക്കരുത്!",
      "എന്റെ സ്പൈഡർ-സെൻസ് പറയുന്നു, നിന്റെ ഇരിപ്പ് ഒരു സീനാണ്. നേരെ ഇരിക്ക്, {name}!",
      "ചുമ്മാ ഇരിക്കാതെ {addr}, ഒന്ന് സ്ട്രെച്ച് ചെയ്യ്. ഞാൻ ഇവിടെ തൂങ്ങിക്കിടന്ന് എല്ലാം സഹിക്കുന്നുണ്ട്!"
    ],
    robobuddy: [
      "ബീപ് ബൂപ്! ഹൈഡ്രേഷൻ.exe റെസ്പോണ്ട് ചെയ്യുന്നില്ല. വെള്ളം കുടിക്ക് {name}, പ്ലീസ്!",
      "വാണിംഗ്: നിന്റെ ബാറ്ററി 23% ആണ് {addr}. ഒരു സ്ട്രെച്ച് എടുക്ക്, റീചാർജ് ആകും!",
      "കണക്കുകൂട്ടുന്നു... ഫലം: നിനക്ക് ഒരു ബ്രേക്ക് വേണം. കോൺഫിഡൻസ് 99.7%!",
      "എറർ 404: നല്ല പോസ്ചർ കണ്ടെത്താനായില്ല. നേരെ ഇരിക്ക് {name}!"
    ],
    hoodbot: [
      "...സിസ്റ്റം എല്ലാം ഓക്കെയാണ്. പക്ഷേ നിന്റെ കാര്യം ഓക്കെയല്ല. വെള്ളം കുടിക്ക് {name}, ഇപ്പോൾ തന്നെ.",
      "ഞാൻ 8% ബാറ്ററിയിൽ, നിശബ്ദതയിൽ ഓടുന്നു. നീ കാപ്പിയിൽ. നമ്മൾ ഒരുപോലെയല്ല {addr}.",
      "ഗ്ലിച്ച് കണ്ടെത്തി: 90 മിനിറ്റായി ഇരിക്കുന്നു. റീബൂട്ട് ചെയ്യാൻ എഴുന്നേറ്റ് നിൽക്ക്.",
      "ലോ-പവർ മോഡ് നല്ലതാണ്... നിനക്ക്. പുറത്തിറങ്ങി ഒരു വെയിൽ കൊള്ളൂ {name}."
    ],
    deadpool: [
      "എടാ {name}! അതെ, നിന്നോട് തന്നെ. സ്ക്രീനിനോടല്ല. വെള്ളം കുടിക്ക്, മോണിറ്ററിലൂടെ CPR തരാൻ എനിക്ക് പറ്റില്ല!",
      "ഫോർത്ത് വാൾ ചെക്ക്: ഇപ്പോഴും പൊട്ടിയിരിക്കുന്നു. ഡെവലപ്പർ ഇത് വായിക്കുന്നുണ്ടെങ്കിൽ: എനിക്ക് ഒരു സീക്വൽ വേണം. പിന്നെ ഒരു സാലറി ഹൈക്കും!",
      "മാക്സിമം എഫർട്ട്! ...നിന്റെ ഈ ഡെസ്ക് ജോലിയിൽ അത് കാണുന്നില്ല {addr}. ഒന്ന് സ്ട്രെച്ച് ചെയ്യ്!",
      "ഞാൻ ഡെസ്ക്ടോപ്പ് പെറ്റ്, നീ ഡെസ്ക്ടോപ്പിൽ ഇങ്ങനെ ഇരിപ്പ്. രണ്ടാളും ഒന്ന് എഴുന്നേറ്റ് എന്തെങ്കിലും ചെയ്യാം, കൊള്ളാമോ?"
    ],
    zoro: [
      "സ്ക്രീനിൽ എവിടെയാടാ വഴി? ഞാൻ ഇവിടെ ഡോക്കിൽ കൂടുതൽ നേരം ഇരുന്നാൽ ഉറങ്ങിപ്പോകും... പിന്നെ {name}, വെള്ളം കുടിക്ക്, സാക്കെ തീർന്നു!",
      "ഉറങ്ങാൻ പറയണം എന്നുണ്ട്, പക്ഷേ ഇവിടെ ഉറക്കം എന്റെ പണിയാണ് {addr}. നിനക്ക് സ്ട്രെച്ച് മതി!",
      "വീണ്ടും വഴി തെറ്റി... സ്ക്രീനിൽ അല്ല, എന്റെ തലയിൽ. വെള്ളം കുടിക്ക് {name}, നല്ലതാണ്.",
      "മൂന്ന് വാൾ, ഒരു ദിശാബോധവുമില്ല. നിനക്ക് ടാസ്ക്ബാർ ഉണ്ട്, എന്നിട്ടും വഴി തെറ്റി. ശ്രദ്ധിക്ക്!"
    ],
    luffy: [
      "എടാ {name}! വെള്ളമല്ല, ഇറച്ചി വല്ലതും എടുക്കാനുണ്ടോ? വിശന്നിട്ട് വയ്യ!",
      "ഞാൻ പൈറേറ്റ് കിംഗ് ആകും! നീ 'വെള്ളം കുടിക്കുന്ന രാജാവ്' ആകൂ {name}. കുടിക്ക്!",
      "ശിശിശി! സ്ട്രെച്ച് ടൈം! ഗം-ഗം... സ്ട്രെച്ച്!",
      "ഈ ടാബിൽ ഇറച്ചിയുണ്ടോ? ഇല്ലേ? എങ്കിൽ അടച്ചിട്ട് പോയി ഭക്ഷണം കഴിക്ക് {addr}!"
    ],
    kakashi: [
      "ക്ഷമിക്കണം {name}, ഞാൻ വൈകിപ്പോയി. ജീവിതത്തിന്റെ വഴിയിൽ... പിന്നെ ഈ പുസ്തകത്തിലും വഴി തെറ്റി. എന്തായാലും വെള്ളം കുടിക്ക്!",
      "കണ്ണ് തളർന്നോ? ഷാരിംഗൻ ഓഫ് ആക്ക് ബ്രോ. ദൂരെയുള്ള എന്തെങ്കിലും നോക്ക്. ജ്ഞാനിയായ നിഞ്ച വിശ്രമിക്കും!",
      "ഒരു ഷിനോബി സ്ക്രീനിന്റെ ഗ്ലെയറിനുള്ളിലും കാണണം... ഇപ്പോൾ ഒരു ബ്രേക്ക് എടുക്ക് {name}.",
      "ഞാൻ 'മേക്ക്-ഔട്ട് പാരഡൈസ്' വായിക്കുന്നത് കഥയ്ക്കുവേണ്ടി മാത്രമാണ് {name}. ഒളിഞ്ഞുനോക്കല്ലേ. വെള്ളം കുടിക്ക്!"
    ],
    hulk: [
      "ഹൾക്ക് സ്മാഷ് ദാഹം! വെള്ളം കുടിക്ക് {name}, ഇല്ലെങ്കിൽ ഹൾക്ക് സ്മാഷ് ചെയ്യും!",
      "ഹൾക്കിന് ഈ ക്ഷീണിച്ച ഇരിപ്പ് ഇഷ്ടമല്ല. ഹൾക്ക് സ്മാഷ് മോശം പോസ്ചർ! നേരെ ഇരിക്ക് {addr}!",
      "ഹൾക്കിന് ദേഷ്യം! നീ വെള്ളം കുടിക്കാത്തതുകൊണ്ട്. കുടിക്ക്!",
      "ചെറിയ മനുഷ്യാ, ബ്രേക്ക് വേണം. ഹൾക്ക് പറയുന്നു: സ്ട്രെച്ച്! ഹൾക്ക് രണ്ട് തവണ പറയില്ല!"
    ],
    alien: [
      "നമസ്കാരം, ഭൂമിയിലെ {name}. നിന്റെ വർഗ്ഗം ഡീഹൈഡ്രേറ്റഡ് ആണ്. വെള്ളം കുടിക്ക്!",
      "ഞാൻ സമാധാനത്തോടെ വന്നതാണ്, പക്ഷേ നിന്റെ നട്ടെല്ലിന്റെ കാര്യത്തിൽ ആശങ്കയുണ്ട്. നേരെ ഇരിക്ക് {addr}!",
      "എന്റെ ഗ്രഹത്തിൽ ഞങ്ങൾ ഒരു സെക്കൻഡിൽ രണ്ടു തവണ കണ്ണ് ചിമ്മും. നീ ഒരു മണിക്കൂറിൽ രണ്ടു തവണ. പേടിക്കേണ്ട കാര്യം!",
      "നിന്റെ നേതാവിനെ കാണിക്ക്... ആഹ്, നീ തന്നെയാണോ നേതാവ്? എങ്കിൽ വെള്ളത്തിന്റെ അടുത്തേക്ക് നടക്ക്!"
    ],
    bigears: [
      "ഞാൻ കേട്ടു. വലിയ ചെവിയല്ലേ... നീ മണിക്കൂറുകളായി വെള്ളം കുടിച്ചിട്ടില്ലെന്ന് {name}.",
      "എന്റെ ചെവി ഇവിടെ നിന്ന് നിന്റെ വയറിന്റെ കാളൽ കേട്ടു. എന്തെങ്കിലും കഴിക്ക് {addr}!",
      "ഞാൻ സങ്കടത്തിലാണെന്ന് പറയുന്നു. അല്ല, നീ കണ്ണ് ചിമ്മുന്നില്ലല്ലോ എന്ന പേടിയാണ്.",
      "ചെവി കൂടുതലായതുകൊണ്ട് പറയാം: എഴുന്നേറ്റ് ഒന്ന് സ്ട്രെച്ച് ചെയ്യ് {name}, ഇപ്പോൾ!"
    ],
    ninjazen: [
      "ശ്വാസം ഉള്ളിലേക്ക്... പുറത്തേക്ക്... ഇപ്പോൾ വെള്ളം കുടിക്ക് {name}. ഇതാണ് വഴി.",
      "ശാന്തമായ മനസ്സിന് നേരെയുള്ള നട്ടെല്ല് വേണം. നേരെ ഇരിക്ക് {addr}. ശബ്ദമില്ലാതെ!",
      "ഞാൻ കൂടുതൽ സംസാരിക്കില്ല. പക്ഷേ പറയാം: കണ്ണ് ചിമ്മ്, പിന്നെ സ്ട്രെച്ച് ചെയ്യ്.",
      "വാൾ പോലും ഉറയിൽ വിശ്രമിക്കും. നിനക്കും വിശ്രമിക്കാം {name}."
    ],
    ninjakid: [
      "നിഞ്ച കുട്ടി റിപ്പോർട്ടിംഗ്! മിഷൻ: {name}-നെ വെള്ളം കുടിപ്പിക്കുക! ഹായ്-യാ!",
      "എന്റെ കയ്യിൽ തീയാണ്, പക്ഷേ തണുക്കേണ്ടത് നീയാണ്. വെള്ളം, ഇപ്പോൾ തന്നെ!",
      "സ്റ്റെൽത്ത് ടിപ്പ്: നിഞ്ചകൾ ഒരിക്കലും കുനിഞ്ഞിരിക്കില്ല. നേരെ ഇരിക്ക് {addr}!",
      "നീ സ്ട്രെച്ച് ചെയ്താൽ മിഷൻ കംപ്ലീറ്റ്. ഞാൻ എണ്ണാം: മൂന്ന്, രണ്ട്, ഒന്ന്... പോ!"
    ],
    laptopguy: [
      "ഈ സമയത്ത് പ്രൊഡിൽ പുഷ് ചെയ്യുന്നോ? റെസ്പെക്റ്റ് {name}. പക്ഷേ ക്രാഷ് ആകുന്നതിന് മുമ്പ് വെള്ളം കുടിക്ക്!",
      "നിന്നെ തന്നെ ഓഫ് ചെയ്ത് ഓൺ ചെയ്ത് നോക്കിയോ? എഴുന്നേറ്റ് നിൽക്ക്, വീണ്ടും ഇരിക്ക്. നല്ലതാണ്!",
      "നിന്റെ ബാറ്ററി 20% ആണ് {addr}, ലാപ്ടോപ്പിന്റെതല്ല!",
      "പീസ് ഔട്ട് — 5 മിനിറ്റ് നേരത്തേക്ക്. വെള്ളം കുടിക്ക്, പിന്നെ git commit ചെയ്യ്."
    ],
    neonscout: [
      "സ്കൗട്ടിംഗ് റിപ്പോർട്ട്: ലക്ഷ്യം {name} ഡീഹൈഡ്രേറ്റഡ് ആണ്. നിർദ്ദേശം: വെള്ളം. ഓവർ.",
      "നിയോൺ കണ്ണുകൾ ഓൺ. 3 ഓക്ലോക്കിൽ സ്ലൗച്ച് കണ്ടെത്തി. പോസ്ചർ ശരിയാക്ക് {addr}!",
      "മിഷൻ ബ്രീഫിംഗ്: എഴുന്നേൽക്ക്, സ്ട്രെച്ച് ചെയ്യ്, വെള്ളം കുടിക്ക്. എക്സിക്യൂട്ട്.",
      "ഡിജിറ്റൽ ഫ്രണ്ടിൽ എല്ലാം ശാന്തമാണ്. നിന്റെ കണ്ണുകൾ ഒഴികെ. അവ നിലവിളിക്കുന്നു. വിശ്രമം കൊടുക്ക്."
    ]
  }
};

// ----------------------------------------------------------------------------- 18+ mode (cheeky roasts)
// Used only when "18+ adult mode" is on. Sarcastic, savage and a little naughty, never explicit.
const HERO_ADULT = {
  english: {
    deadpool: [
      "You've been sitting so long your chair is basically filing for a restraining order, {name}.",
      "Spicy desktop confession: I've seen your browser history. We don't talk about it. Drink water.",
      "That's the same position you've held since 9 AM. Even my back hurts and I'm a sprite.",
      "Your posture says 'broken'. Your screen time says 'toxic relationship'. Let's break up with the laptop for 5 minutes, {addr}."
    ],
    zoro: [
      "I can cut through steel but I can't cut through your procrastination. Pathetic, {name}.",
      "You sit like a man who lost an argument with his own chair. Stand up and lose it properly.",
      "Drinking? Only if it's sake. But fine, water, you disgrace to the crew.",
      "Lost? You haven't moved in hours. That's not 'lost', that's 'stuck'."
    ],
    spiderman: [
      "Hanging upside down all day and I still have better blood flow than you, {name}. Move!",
      "I've got web-shooters; you've got a keyboard and trust issues. Wash your hands, {name}.",
      "Great power, great responsibility... and you're using yours to scroll at 2 AM. Bold.",
      "Not to be rude, {addr}, but your chair is the longest relationship you've had this year."
    ]
  },
  manglish: {
    deadpool: [
      "Screen-il entharannu ingane nokki tharichirikkunnath? Eneettu valla paniyum edukku bro!",
      "Ninte chair ippo restraining order-inu apeksha kodukkum {name}... athrayum neram aayi irippu!",
      "Njan ninte browser history kandu. Nammal athu samsarikkaruthu. Vellam kudi, athre ullu!",
      "Ninte posture 'pottiya' ennu parayunnu, screen time 'toxic relationship' ennum. 5 minute laptop-ine break-up cheyyaam {addr}!"
    ],
    zoro: [
      "Ennikku irumbu murikkaan pattum, pakshe ninte pani-vaikkal murikkaan pattilla. Kashtam {name}!",
      "Chair-umayulla vaadathil thottavane pole aanu ninte irippu. Eneettu nikku, athu nannaayirikkum {name}!",
      "Kudikkaan sake mathram... pinne vellam. Kashtam, ninte karyam {addr}.",
      "Njan vazhi thetti ennu parayum, pakshe nee? Maniyoorukalaayi nee oru sthalathu thanne. Athu vazhi thettal alla, 'stuck' aanu!"
    ],
    spiderman: [
      "Njan thala keezhaayi thookki kidannittum ninakkulla blood flow-yekkaal nallathaanu, {name}. Eneettu nadakk!",
      "Ennikku web-shooter undu, ninakku keyboard-um pinne aarum kaanatha 'research' tabs-um. Kollaam {addr}.",
      "Valiya shakthi, valiya uttharavaadithwam... ninte shakthi 2 manikku reels nokkaan upayogikkunno? Kashtam!",
      "Ninte chair-aanu ee varshathe ninte ettavum neenda relationship, {name}. Onnu purathirangu!"
    ]
  },
  malayalam: {
    deadpool: [
      "സ്ക്രീനിൽ എന്താണ് ഇങ്ങനെ നോക്കി തറച്ചിരിക്കുന്നത്? എഴുന്നേറ്റ് വല്ല പണിയും എടുക്ക് ബ്രോ!",
      "നിന്റെ ചെയർ ഇപ്പോൾ റെസ്ട്രെയിനിംഗ് ഓർഡറിന് അപേക്ഷ കൊടുക്കും {name}... അത്രയും നേരമായി ഇരിപ്പ്!",
      "ഞാൻ നിന്റെ ബ്രൗസർ ഹിസ്റ്ററി കണ്ടു. നമ്മൾ അതിനെക്കുറിച്ച് സംസാരിക്കരുത്. വെള്ളം കുടിക്ക്, അത്രേ ഉള്ളൂ!",
      "നിന്റെ പോസ്ചർ 'പൊട്ടി' എന്ന് പറയുന്നു, സ്ക്രീൻ ടൈം 'ടോക്സിക് റിലേഷൻഷിപ്പ്' എന്നും. 5 മിനിറ്റ് ലാപ്ടോപ്പുമായി ബ്രേക്കപ്പ് ആകാം {addr}!"
    ],
    zoro: [
      "എനിക്ക് ഇരുമ്പ് മുറിക്കാൻ പറ്റും, പക്ഷേ നിന്റെ നീട്ടിവെപ്പ് മുറിക്കാൻ പറ്റില്ല. കഷ്ടം {name}!",
      "ചെയറുമായുള്ള വാദത്തിൽ തോറ്റവനെപ്പോലെയാണ് നിന്റെ ഇരിപ്പ്. എഴുന്നേറ്റ് നിൽക്ക്, അത് നന്നായിരിക്കും {name}!",
      "കുടിക്കാൻ സാക്കെ മാത്രം... പിന്നെ വെള്ളം. കഷ്ടം, നിന്റെ കാര്യം {addr}.",
      "ഞാൻ വഴി തെറ്റി എന്ന് പറയും, പക്ഷേ നീ? മണിക്കൂറുകളായി നീ ഒരു സ്ഥലത്ത് തന്നെ. അത് വഴി തെറ്റലല്ല, 'സ്റ്റക്ക്' ആണ്!"
    ],
    spiderman: [
      "ഞാൻ തലകീഴായി തൂങ്ങിക്കിടന്നിട്ടും നിന്നേക്കാൾ നല്ല ബ്ലഡ് ഫ്ലോ ഉണ്ട്, {name}. എഴുന്നേറ്റ് നടക്ക്!",
      "എനിക്ക് വെബ്-ഷൂട്ടർ ഉണ്ട്, നിനക്ക് കീബോർഡും ആരും കാണാത്ത 'റിസർച്ച്' ടാബുകളും. കൊള്ളാം {addr}!",
      "വലിയ ശക്തി, വലിയ ഉത്തരവാദിത്വം... നിന്റെ ശക്തി രണ്ട് മണിക്ക് റീൽസ് കാണാനാണോ? കഷ്ടം!",
      "നിന്റെ ചെയറാണ് ഈ വർഷത്തെ നിന്റെ ഏറ്റവും നീണ്ട റിലേഷൻഷിപ്പ്, {name}. ഒന്ന് പുറത്തിറങ്ങ്!"
    ]
  }
};

// ----------------------------------------------------------------------------- natural reminders
// Everyday Kerala youth speech for the reminders, chimes, greetings and task alerts.
const NATURAL_REMINDERS = {
  manglish: {
    water: [
      "{eda} {name}, kore neramaayallo... oru glass vellam kudikkathe pattilla {addr}!",
      "{addr}, vellam kudi... dehydration aayi scene aavaruthu!",
      "Chumma irikkathe {name}, oru glass vellam kudi. Allenkil thalavedana vannu scene aavum!"
    ],
    rest: [
      "{eda} {name}, kore neramaayallo lap-il thala vechirikkunnu... oru 2 minute eneettu nadakk!",
      "Kannu thalarnnu poyi {addr}. Oru nimisham dooreyku nokku, pinne onnu stretch cheyy.",
      "Alambakkalle {name}, ee irippu athra shariyalla. Eneettu onnu nadannittu vaa!"
    ],
    time: [
      "{eda}, {time} aayi {name}! Samayam parakkunnu!",
      "Nokkiyo {addr}, {time} aayi. Scene onnum illa, njan parayaan vannathaa!",
      "{time} aayallo {name}... samayam enthaanu ithra vegam?"
    ],
    greet: [
      "{eda} {name}! Njan ivide undu, innu nannaayi pokatte!",
      "Aah, {name} vannallo! Innathe scene enthaa? Njan ready!",
      "Hi {addr}! Innu kalakkaam, vellam kudikkaan marakkaruthu!"
    ],
    task: [
      "{eda} {name}, '{task}' samayam aayi! Marakkalle, scene aakum!",
      "'{task}' cheyyendathu ippol aanu {addr}. Eneettu pova!"
    ]
  },
  malayalam: {
    water: [
      "{eda} {name}, കുറേ നേരമായല്ലോ... ഒരു ഗ്ലാസ് വെള്ളം കുടിക്കാതെ പറ്റില്ല {addr}!",
      "{addr}, വെള്ളം കുടിക്ക്... ഡീഹൈഡ്രേഷൻ വന്ന് സീൻ ആക്കരുത്!",
      "ചുമ്മാ ഇരിക്കാതെ {name}, ഒരു ഗ്ലാസ് വെള്ളം കുടിക്ക്. അല്ലെങ്കിൽ തലവേദന വന്ന് സീൻ ആകും!"
    ],
    rest: [
      "{eda} {name}, കുറേ നേരമായല്ലോ ലാപ്പിൽ തല വെച്ചിരിക്കുന്നു... രണ്ട് മിനിറ്റ് എഴുന്നേറ്റ് നടക്ക്!",
      "കണ്ണ് തളർന്നുപോയി {addr}. ഒരു നിമിഷം ദൂരേക്ക് നോക്ക്, പിന്നെ ഒന്ന് സ്ട്രെച്ച് ചെയ്യ്.",
      "അലമ്പാക്കല്ലേ {name}, ഈ ഇരിപ്പ് അത്ര ശരിയല്ല. എഴുന്നേറ്റ് ഒന്ന് നടന്നിട്ട് വാ!"
    ],
    time: [
      "{eda}, {time} ആയി {name}! സമയം പറക്കുന്നു!",
      "നോക്കിയോ {addr}, {time} ആയി. സീൻ ഒന്നുമില്ല, ഞാൻ പറയാൻ വന്നതാ!",
      "{time} ആയല്ലോ {name}... സമയത്തിന് എന്താ ഇത്ര വേഗം?"
    ],
    greet: [
      "{eda} {name}! ഞാൻ ഇവിടെ ഉണ്ട്, ഇന്ന് നന്നായി പോകട്ടെ!",
      "ആഹ്, {name} വന്നല്ലോ! ഇന്നത്തെ സീൻ എന്താ? ഞാൻ റെഡി!",
      "ഹായ് {addr}! ഇന്ന് കലക്കാം, വെള്ളം കുടിക്കാൻ മറക്കരുത്!"
    ],
    task: [
      "{eda} {name}, '{task}' സമയമായി! മറക്കല്ലേ, സീൻ ആകും!",
      "'{task}' ചെയ്യേണ്ടത് ഇപ്പോഴാണ് {addr}. എഴുന്നേറ്റ് പോ!"
    ]
  }
};

// ----------------------------------------------------------------------------- install
for (const [lang, heroes] of Object.entries(HERO_QUIPS)) {
  if (!LOCALES[lang]) continue;
  for (const [hero, lines] of Object.entries(heroes)) LOCALES[lang].quips[hero] = heroSame(lines);
}
for (const [lang, heroes] of Object.entries(HERO_ADULT)) {
  if (LOCALES[lang]) LOCALES[lang].adult = heroes;
}
for (const [lang, cats] of Object.entries(NATURAL_REMINDERS)) {
  if (!LOCALES[lang]) continue;
  for (const [cat, lines] of Object.entries(cats)) {
    LOCALES[lang][cat] = cat === 'task' ? lines : heroSame(lines);
  }
}

// ----------------------------------------------------------------------------- 18+ mode: harder pools
// Same rules as above (only with adult mode on, age 18+). Roast the user, never anyone else: no slurs about
// religion, caste, race or gender, just street-level abuse between friends. Added on top of any existing lines.
const HERO_ADULT_HARD = {
  english: {
    deadpool: [
      "Fuck me, {name}, your ass has fused with that chair. Get up, you sedentary piece of shit.",
      "Your screen time is a goddamn cry for help. Close the laptop, dumbass, and drink water.",
      "I'd call you a lazy fuck, but that insults the lazy. Move, {name}."
    ],
    zoro: [
      "Three swords and not one can cut through your bullshit excuses, {name}. Get off your ass.",
      "You sit there rotting like a dead fish and call it 'work'? Stand up, you useless shit.",
      "Drink water, you dehydrated dumbass. I'm not carrying your sorry carcass to the dock."
    ],
    spiderman: [
      "Great power, great responsibility, and you're using yours to jerk around on reels at 2 AM. Fuck's sake, {name}.",
      "Your chair has seen more action than you, you sad bastard. Stretch.",
      "I web-swing through hell every night and you can't walk to the kitchen? Get up, asshole."
    ]
  },
  manglish: {
    deadpool: [
      "Eda {name}, ninte kunna chair-il urachu poyallo, patti. Eneettu poda, vellam kudi!",
      "Screen time kandaal theri vilikkaan thonnum, thendi. Laptop adachu poda!",
      "Njan polum ninne kandu pedichu, myre. Eneettu nikku, poorimone!"
    ],
    zoro: [
      "Moonnu vaalu undu, pakshe ninte pani-vaikkal murikkaan pattilla, thendi {name}. Eneettu poda myre!",
      "Chathu kidakkunna meen pole irikkunnu, ennittu 'work' ennu parayunnu. Poda patti!",
      "Vellam kudi, kunna. Ninte shavam dock-il etthikkaan njan illa!"
    ],
    spiderman: [
      "Valiya shakthi, valiya uttharavaadithwam... nee reels-il kunna theduvano 2 manikku, myre {name}?",
      "Ninte chair-inu ninte jeevithathekkaal action undu, poori mone. Stretch cheyy!",
      "Njan raathri muzhuvan kettidangal chaadi nadakkunnu, nee kitchen-il polum pogunnilla, thendi. Eneettu poda!"
    ]
  },
  malayalam: {
    deadpool: [
      "എടാ {name}, നിന്റെ കുണ്ടി ചെയറിൽ ഒട്ടിപ്പോയല്ലോ, പട്ടി. എഴുന്നേറ്റ് വെള്ളം കുടിക്ക്!",
      "സ്ക്രീൻ ടൈം കണ്ടാൽ തെറി വിളിക്കാൻ തോന്നും, തെണ്ടി. ലാപ്ടോപ്പ് അടച്ച് പോടാ!",
      "ഞാൻ പോലും നിന്നെ കണ്ട് പേടിച്ചു, മൈര്. എഴുന്നേറ്റ് നിൽക്ക്, പൂറിമോനേ!"
    ],
    zoro: [
      "മൂന്ന് വാൾ ഉണ്ട്, പക്ഷേ നിന്റെ നീട്ടിവെപ്പ് മുറിക്കാൻ പറ്റില്ല, തെണ്ടി {name}. എഴുന്നേൽക്ക് മൈര്!",
      "ചത്ത മീൻ പോലെ ഇരിക്കുന്നു, എന്നിട്ട് 'ജോലി' എന്ന് പറയുന്നു. പോടാ പട്ടി!",
      "വെള്ളം കുടിക്ക്, കുണ്ണേ. നിന്റെ ശവം ഡോക്കിലേക്ക് ചുമക്കാൻ ഞാനില്ല!"
    ],
    spiderman: [
      "വലിയ ശക്തി, വലിയ ഉത്തരവാദിത്വം... നീ രണ്ട് മണിക്ക് റീൽസിൽ കുണ്ണ തപ്പുന്നോ, മൈര് {name}?",
      "നിന്റെ ചെയറിന് നിന്നേക്കാൾ ആക്ഷൻ ഉണ്ട്, പൂറിമോനേ. സ്ട്രെച്ച് ചെയ്യ്!",
      "ഞാൻ രാത്രി മുഴുവൻ കെട്ടിടങ്ങൾ ചാടി നടക്കുന്നു, നീ അടുക്കളയിൽ പോലും പോകുന്നില്ല, തെണ്ടി. എഴുന്നേൽക്ക് പോടാ!"
    ]
  },
  hinglish: {
    deadpool: [
      "Saale {name}, teri chair ko teri gaand se pyaar ho gaya hai. Uth ja, kamine, paani pi!",
      "Maine teri browser history dekhi, chutiya hai tu. Ab hum dost nahi. Paani pi aur apne gunahon ka soch.",
      "Fourth wall tod ke bol raha hoon: developer ne mujhe tujhe roast karne ke liye likha hai. Gaali usko de, bhosdike.",
      "Ghanto se ek hi position mein sada hua hai, saale. Teri posture ki bhi gaand phat gayi hai. Stretch kar!"
    ],
    zoro: [
      "Main teen talwaron se aadmi kaat deta hoon aur tu ek chair se uth nahi sakta, {name}? Gaand mein dum nahi kya?",
      "Raasta bhatak gaya? Subah se ek jagah baitha hai, chutiye. Dock tak toh main bhi pahunch gaya tha.",
      "Sake nahi, coffee nahi. PAANI pi, saale. Glass kaat ke doon kya?",
      "Chair se haar gaya tu. Pathetic. Khada ho, nikamme!"
    ],
    spiderman: [
      "Ulta latak ke bhi mera blood flow tujhse acha hai, {name}. Uth ja, nikamme!",
      "Great power, great responsibility, aur tu raat ke 2 baje reels dekh raha hai? Chutiyapa band kar.",
      "Teri chair ki tere love life se zyada action hoti hai, saale. Chal stretch kar.",
      "Main building-building kood ke cardio karta hoon, aur tu baitha baitha sad gaya. Gaand utha, {name}!"
    ]
  },
  hindi: {
    deadpool: [
      "साले {name}, तेरी चेयर को तेरी गांड से प्यार हो गया है। उठ जा, कमीने, पानी पी!",
      "मैंने तेरी ब्राउज़र हिस्ट्री देखी, चूतिया है तू। अब हम दोस्त नहीं। पानी पी और अपने गुनाहों का सोच।",
      "फोर्थ वॉल तोड़ के बोल रहा हूँ: डेवलपर ने मुझे तुझे रोस्ट करने के लिए लिखा है। गाली उसको दे, भोसड़ीके।",
      "घंटों से एक ही पोज़िशन में सड़ा हुआ है, साले। तेरी पोस्चर की भी गांड फट गई है। स्ट्रेच कर!"
    ],
    zoro: [
      "मैं तीन तलवारों से आदमी काट देता हूँ और तू एक चेयर से उठ नहीं सकता, {name}? गांड में दम नहीं क्या?",
      "रास्ता भटक गया? सुबह से एक जगह बैठा है, चूतिये। डॉक तक तो मैं भी पहुँच गया था।",
      "साके नहीं, कॉफी नहीं। पानी पी, साले। ग्लास काट के दूँ क्या?",
      "चेयर से हार गया तू। पैथेटिक। खड़ा हो, निकम्मे!"
    ],
    spiderman: [
      "उल्टा लटक के भी मेरा ब्लड फ्लो तुझसे अच्छा है, {name}। उठ जा, निकम्मे!",
      "ग्रेट पावर, ग्रेट रिस्पॉन्सिबिलिटी, और तू रात के 2 बजे रील्स देख रहा है? चूतियापा बंद कर।",
      "तेरी चेयर की तेरी लव लाइफ से ज़्यादा एक्शन होती है, साले। चल स्ट्रेच कर।",
      "मैं बिल्डिंग-बिल्डिंग कूद के कार्डियो करता हूँ, और तू बैठा-बैठा सड़ गया। गांड उठा, {name}!"
    ]
  },
  tanglish: {
    deadpool: [
      "Eda {name}, un soothu chair-oda ottikichu da, thevidiya payale. Ezhunthu thanni kudi!",
      "Un screen time paartha ennakku thitta thonudhu, oombu. Laptop-a moodu da!",
      "Naane unna paartha bayandhutten, punda. Ezhunthu nill!"
    ],
    zoro: [
      "Moonu kathi iruku, aana un laziness-a vetta mudiyala, naaye {name}. Ezhunthiru da!",
      "Saavuna meen maadhiri okkandhutu 'work' nu solra, thevidiya payale. Po da!",
      "Thanni kudi, loosu. Un body-a dock varaikum thookitu pogamaatten!"
    ],
    spiderman: [
      "Periya shakthi, periya poruppu... nee 2 manikku reels-la mayiru paakkura, {name}. Karumam!",
      "Un chair-ku un love life vida action athigam, punda. Stretch pannu!",
      "Naan raathiri full-a building-ku building thaavuren, nee kitchen-ku kooda pogala, oombu. Ezhunthiru da!"
    ]
  },
  tamil: {
    deadpool: [
      "டேய் {name}, உன் சூத்து சேர்-ஓட ஒட்டிக்கிச்சு டா, தேவிடியா பயலே. எழுந்து தண்ணி குடி!",
      "உன் ஸ்கிரீன் டைம் பார்த்தா எனக்கு திட்டத் தோணுது, ஓம்பு. லேப்டாப்பை மூடு டா!",
      "நானே உன்னைப் பார்த்து பயந்துட்டேன், புண்டை. எழுந்து நில்லு!"
    ],
    zoro: [
      "மூணு கத்தி இருக்கு, ஆனா உன் சோம்பேறித்தனத்தை வெட்ட முடியல, நாயே {name}. எழுந்திரு டா!",
      "செத்த மீன் மாதிரி உக்காந்துட்டு 'வேலை'ன்னு சொல்ற, தேவிடியா பயலே. போடா!",
      "தண்ணி குடி, லூசு. உன் உடம்பை டாக் வரைக்கும் தூக்கிட்டு போக மாட்டேன்!"
    ],
    spiderman: [
      "பெரிய சக்தி, பெரிய பொறுப்பு... நீ 2 மணிக்கு ரீல்ஸ்ல மயிரு பார்க்கிற, {name}. கருமம்!",
      "உன் சேருக்கு உன் காதல் வாழ்க்கையை விட ஆக்ஷன் அதிகம், புண்டை. ஸ்ட்ரெட்ச் பண்ணு!",
      "நான் ராத்திரி முழுக்க பில்டிங்கு பில்டிங் தாவுறேன், நீ கிச்சனுக்கு கூட போகல, ஓம்பு. எழுந்திரு டா!"
    ]
  },
  kanglish: {
    deadpool: [
      "Eno {name}, ninna gaandu chair-ge antkondu bittide, sule magane. Eddu neeru kudi!",
      "Ninna screen time nodidre bayyabeku anstide, bolimaga. Laptop muchchu!",
      "Naane ninna nodi bedari hodhe, nayi. Eddu nillu!"
    ],
    zoro: [
      "Mooru kathi ide, aadre ninna somberitana kattarisoke aagalla, nayi {name}. Eddu hogu, bevarsi!",
      "Satta meenu thara kootkondu 'work' antiya, sule magane. Hogu!",
      "Neeru kudi, hucchane. Ninna shava dock thanaka hottukondu hogalla naanu!"
    ],
    spiderman: [
      "Dodda shakthi, dodda javabdari... nee 2 gantege reels-alli nodtiya, bolimaga {name}. Tale kedisikobyeda!",
      "Ninna chair-ge ninna love life-ginta action jaasti, bevarsi. Stretch maadu!",
      "Naanu raatri full building-alli jumping maadtini, nee adigemane-ge kooda hogalla, thika. Eddu hogu!"
    ]
  },
  kannada: {
    deadpool: [
      "ಏನೋ {name}, ನಿನ್ನ ಗಾಂಡು ಚೇರ್‌ಗೆ ಅಂಟ್ಕೊಂಡು ಬಿಟ್ಟಿದೆ, ಸೂಳೆ ಮಗನೇ. ಎದ್ದು ನೀರು ಕುಡಿ!",
      "ನಿನ್ನ ಸ್ಕ್ರೀನ್ ಟೈಮ್ ನೋಡಿದ್ರೆ ಬೈಯ್ಯಬೇಕು ಅನ್ಸುತ್ತೆ, ಬೋಳಿಮಗ. ಲ್ಯಾಪ್‌ಟಾಪ್ ಮುಚ್ಚು!",
      "ನಾನೇ ನಿನ್ನ ನೋಡಿ ಬೆದರಿ ಹೋದೆ, ನಾಯಿ. ಎದ್ದು ನಿಲ್ಲು!"
    ],
    zoro: [
      "ಮೂರು ಕತ್ತಿ ಇದೆ, ಆದ್ರೆ ನಿನ್ನ ಸೋಮಾರಿತನ ಕತ್ತರಿಸೋಕೆ ಆಗಲ್ಲ, ನಾಯಿ {name}. ಎದ್ದು ಹೋಗು, ಬೇವರ್ಸಿ!",
      "ಸತ್ತ ಮೀನು ತರ ಕೂತ್ಕೊಂಡು 'ಕೆಲಸ' ಅಂತೀಯ, ಸೂಳೆ ಮಗನೇ. ಹೋಗು!",
      "ನೀರು ಕುಡಿ, ಹುಚ್ಚನೇ. ನಿನ್ನ ಶವ ಡಾಕ್ ತನಕ ಹೊತ್ಕೊಂಡು ಹೋಗಲ್ಲ ನಾನು!"
    ],
    spiderman: [
      "ದೊಡ್ಡ ಶಕ್ತಿ, ದೊಡ್ಡ ಜವಾಬ್ದಾರಿ... ನೀನು 2 ಗಂಟೆಗೆ ರೀಲ್ಸ್‌ನಲ್ಲಿ ನೋಡ್ತೀಯ, ಬೋಳಿಮಗ {name}. ತಲೆ ಕೆಡಿಸ್ಕೋಬೇಡ!",
      "ನಿನ್ನ ಚೇರ್‌ಗೆ ನಿನ್ನ ಲವ್ ಲೈಫ್‌ಗಿಂತ ಆಕ್ಷನ್ ಜಾಸ್ತಿ, ಬೇವರ್ಸಿ. ಸ್ಟ್ರೆಚ್ ಮಾಡು!",
      "ನಾನು ರಾತ್ರಿ ಫುಲ್ ಬಿಲ್ಡಿಂಗ್‌ನಲ್ಲಿ ಜಂಪ್ ಮಾಡ್ತೀನಿ, ನೀನು ಅಡುಗೆಮನೆಗೂ ಹೋಗಲ್ಲ, ತಿಕ. ಎದ್ದು ಹೋಗು!"
    ]
  }
};
for (const [lang, heroes] of Object.entries(HERO_ADULT_HARD)) {
  if (!LOCALES[lang]) continue;
  LOCALES[lang].adult = LOCALES[lang].adult || {};
  for (const [hero, lines] of Object.entries(heroes)) {
    LOCALES[lang].adult[hero] = (LOCALES[lang].adult[hero] || []).concat(lines);
  }
}
