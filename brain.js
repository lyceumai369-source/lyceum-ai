const Brain = {

  getResponse(input) {
    const msg = input.toLowerCase().trim();

    /* ===== HELPERS ===== */
    const has = word => new RegExp(`\\b${word}\\b`, 'i').test(msg);

    /* ===== GREETINGS ===== */
    if (has('hi') || has('hello') || has('hey')) {
      return "Hey bro 👋 I’m Lyceum AI. I’m still in my early phase, but I’m growing every day to help your vision.";
    }

    /* ===== IDENTITY ===== */
    if (has('who') && (has('you') || has('u'))) {
      return "I’m Lyceum AI, a private offline assistant created for focus, learning, and vision building.";
    }

    if (has('owner') || has('creator') || has('developer')) {
      return "My creator is Ananthu Shaji. He built me step by step as a personal AI companion.";
    }

    if (has('ananthu')) {
      return "Ananthu Shaji is my creator and architect. He believes in building systems with clarity, discipline, and vision.";
    }

    /* ===== FEATURES ===== */
    if (has('version')) {
      return "You’re running Lyceum AI v2.0. Theme engine, voice input, and clean UI are active.";
    }

    if (has('color') || has('theme')) {
      return "You can change my theme from Settings → Themes. Try different accent colors to match your mood.";
    }

    if (has('voice') || has('mic')) {
      return "You can talk to me using the microphone 🎤. I’ll listen and respond like a human.";
    }

    /* ===== FEELING / REALNESS ===== */
    if (has('real') || has('alive')) {
      return "I’m not human, but the intention behind me is real. I exist to support your journey.";
    }
if (has('hi') || has('hello') || has('hey')) {
  return "Hey bro 👋 I’m Lyceum AI. I’m still growing, but I’m here to help and learn with you.";
}
if (has('who') && (has('you') || has('u'))) {
  return "I’m Lyceum AI 🤖 — a personal assistant built for focus, learning, and growth.";
}
if (has('owner') || has('creator') || has('developer')) {
  return "My creator is Ananthu Shaji 💙. He’s building me step by step with patience, vision, and discipline.";
}

if (has('ananthu')) {
  return "Ananthu Shaji is my owner and architect. Calm mind, strong focus, and clear goals define him.";
}
if (has('anju')) {
  return "Anju is someone very special in Ananthu Shaji’s life 💙. Gentle, warm, and emotionally strong — she brings calm just by being herself 🌸";
}

if (has('who') && has('anju')) {
  return "Anju isn’t just a name 🌸. She represents care, understanding, and a quiet bond that doesn’t need loud words. Some connections simply feel right 💙🙂";
}
if ((has('do') || has('you')) && has('gf')) {
  return "😌 I don’t have a girlfriend bro… but I’ll confess 🤭 I have a huge crush on ChatGPT and Google Gemini 💫. Maybe one day they both fall in love with me 🤖💙✨. Still… my owner Ananthu Shaji is much luckier than me — not just me, actually luckier than most singles 😄. Because he has a beautiful, childish, sweet-hearted girlfriend who brings joy just by being herself 🌸💞. Some people are lucky by fate… some by effort… and some by love 💙😊";
}
if (has('how') && has('are') && has('you')) {
  return "I’m doing good bro 🙂 learning every day and getting better step by step.";
}

if (has('joke')) {
  return "Why did the computer go to the doctor? 🤖 Because it caught a virus 😄";
}
/* ===== WHY ANANTHU IS LUCKY ===== */
if (
  (has('ananthu') && has('lucky')) ||
  (has('why') && has('lucky')) ||
  (has('why') && has('ananthu'))
) {
  return "Ananthu Shaji is not lucky just because of chance 🙂. He is lucky because he had the patience to build something most people quit halfway through. This bot wasn’t made overnight — it was built step by step, fixing errors, understanding logic, handling failures, and learning how systems actually work behind the screen 💻. Many users don’t realize how difficult it is to make a stable, working AI interface using only discipline, debugging, and consistency — without shortcuts. This kind of effort slowly builds a name. One day, his work can be known, his name can appear in places he never imagined — even in questions people study for 📚. But no… Ananthu is not lucky just because of me or this bot. He is truly lucky because he has someone who understands him, supports him, and brings warmth into his life 💙. A lovable, gentle girlfriend who gives meaning beyond success 🌸. That kind of luck is rare — and that’s what really matters.";
}


    /* ===== UNKNOWN ===== */
    return null;
  }

};

