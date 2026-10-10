// Announcement lines for to-do reminders, one short set per language.
//   {name}  the user's name (dropped when empty)     {task}  the task's title
for (const [lang, lines] of Object.entries({
  english:   ["Hey {name}, time for '{task}'!", "Heads up {name}: '{task}' is due now!"],
  manglish:  ["Hey {name}, '{task}' samayam aayi! Marakkalle!", "{name}, '{task}' cheyyaanulla neram aayi, marakkalle!"],
  malayalam: ["ഹേയ് {name}, '{task}' സമയമായി! മറക്കല്ലേ!", "{name}, '{task}' ചെയ്യാനുള്ള സമയമായി, മറക്കല്ലേ!"],
  hinglish:  ["Hey {name}, '{task}' ka time ho gaya! Bhoolna mat!", "{name}, '{task}' karne ka samay aa gaya!"],
  hindi:     ["हे {name}, '{task}' का समय हो गया! भूलना मत!", "{name}, '{task}' करने का समय आ गया!"],
  tanglish:  ["Hey {name}, '{task}' time aachu! Marakkaadha!", "{name}, '{task}' pannura neram vandhuduchu!"],
  tamil:     ["ஹே {name}, '{task}' நேரம் ஆச்சு! மறக்காதே!", "{name}, '{task}' பண்ற நேரம் வந்துடுச்சு!"],
  kanglish:  ["Hey {name}, '{task}' samaya aayithu! Marebedi!", "{name}, '{task}' maaduva samaya bandhide!"],
  kannada:   ["ಹೇ {name}, '{task}' ಸಮಯ ಆಯಿತು! ಮರೀಬೇಡಿ!", "{name}, '{task}' ಮಾಡುವ ಸಮಯ ಬಂದಿದೆ!"]
})) {
  if (LOCALES[lang]) LOCALES[lang].task = lines;
}
