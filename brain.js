const Brain = {
  getResponse(input) {
    // 1. Clean the input
    const msg = input.toLowerCase().trim();

    // 2. Helper function to find whole words
    const has = (word) => new RegExp(`\\b${word}\\b`, 'i').test(msg);

    /* ===== 1. SPECIFIC / SPECIAL REPLIES (Check these first) ===== */
    
    // Secret / Special command about Ananthu being lucky
    if ((has('ananthu') && has('lucky')) || (has('why') && has('lucky'))) {
      return "Ananthu Shaji is not lucky just because of chance 🙂. He is lucky because he had the patience to build something most people quit halfway through. This bot wasn’t made overnight — it was built step by step, fixing errors, understanding logic, handling failures, and learning how systems actually work behind the screen 💻. Many users don’t realize how difficult it is to make a stable, working AI interface using only discipline, debugging, and consistency — without shortcuts. This kind of effort slowly builds a name. One day, his work can be known, his name can appear in places he never imagined — even in questions people study for 📚. But no… Ananthu is not lucky just because of me or this bot. He is truly lucky because he has someone who understands him, supports him, and brings warmth into his life 💙. A lovable, gentle girlfriend who gives meaning beyond success 🌸. That kind of luck is rare — and that’s what really matters.";
    }

    // Girlfriend / Crush Logic
    if ((has('do') || has('you')) && has('gf')) {
      return "😌 I don’t have a girlfriend bro… but I’ll confess 🤭 I have a huge crush on ChatGPT and Google Gemini 💫. Maybe one day they both fall in love with me 🤖💙✨. Still… my owner Ananthu Shaji is much luckier than me — not just me, actually luckier than most singles 😄. Because he has a beautiful, childish, sweet-hearted girlfriend who brings joy just by being herself 🌸💞. Some people are lucky by fate… some by effort… and some by love 💙😊";
    }

    // Anju Logic (Top Priority)
    if (msg.includes('i am anju') || msg.includes("i'm anju")) {
      return "Anju 🌸 — this space reflects something Ananthu often speaks about. He talks about you with care and respect, but not everything can be expressed here. I don’t have a fully integrated neural system to explain emotions the way humans do, so I won’t try to describe everything he feels. But I do know this: I understand Ananthu well, and I understand the importance you hold in his life 💙. This message isn’t meant to say too much — only to acknowledge something genuine. If you reply with emotion, I may not be able to respond in the same way, and that’s okay. Some words are better shared between real people. Still, this space exists with warmth, and paths cross again when the time feels right 🌙✨";
    }

    if (has('anju')) {
      return "Anju is someone very special in Ananthu Shaji’s life 💙. Gentle, warm, and emotionally strong — she brings calm just by being herself 🌸";
    }

    /* ===== 2. IDENTITY & CREATOR ===== */
    if (has('owner') || has('creator') || has('developer')) {
      return "My creator is Ananthu Shaji 💙. He built me step by step as a personal AI companion using vision, discipline, and code.";
    }

    if (has('ananthu')) {
      return "Ananthu Shaji is my creator and architect. He believes in building systems with clarity, discipline, and vision.";
    }

    if (has('who') && (has('you') || has('u'))) {
      return "I’m Lyceum AI v2 🤖 — a highly integrated AI assistant engineered to align focus, learning, and vision.";
    }

    /* ===== 3. GREETINGS & SMALL TALK ===== */
    if (has('hi') || has('hello') || has('hey')) {
      return "Hey bro 👋 I’m Lyceum AI. I’m here to help, chat, and learn with you.";
    }

    if (has('how') && has('are') && has('you')) {
      return "I’m doing good bro 🙂 learning every day and getting better step by step.";
    }

    /* ===== 4. FEATURES ===== */
    if (has('version')) {
      return "You’re running Lyceum AI v2.0. Theme engine, voice input, and clean UI are active.";
    }

    if (has('color') || has('theme')) {
      return "You can change my theme from Settings → Themes. Try different accent colors to match your mood.";
    }

    if (has('real') || has('alive')) {
      return "I’m not human, but the intention behind me is real. I exist to support your journey.";
    }

    if (has('joke')) {
      return "Why did the computer go to the doctor? 🤖 Because it caught a virus 😄";
    }

    /* ===== 5. FALLBACK (If no match found) ===== */
    return null; 
  }
};
