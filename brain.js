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

    /* ===== FALLBACKS ===== */
    const fallback = [
      "I’m still learning, bro. Try asking about my features or my creator.",
      "That’s interesting. I’ll get smarter with time.",
      "I may not know everything yet, but I’m built to grow.",
      "Ask me about themes, voice, or who built me."
    ];

    return fallback[Math.floor(Math.random() * fallback.length)];
  }

};
