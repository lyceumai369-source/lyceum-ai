const Brain = {
    // This function looks at what the user said and finds an answer
    getResponse: (input) => {
        const msg = input.toLowerCase();

        // 1. Basic Greetings
        if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey")) {
            return "Hello, bro! I am Lyceum AI v2. How can I help your vision today?";
        }

        // 2. About the Developer
        if (msg.includes("who made you") || msg.includes("developer")) {
            return "I was developed by Ananthu Shaji. He built me to be a private, offline guide for visionaries.";
        }

        // 3. About the Version
        if (msg.includes("version")) {
            return "You are currently running Lyceum AI Version 2.0.0. We just added the Theme Engine!";
        }

        // 4. About the Theme
        if (msg.includes("color") || msg.includes("theme")) {
            return "You can change my overall look! Just touch the 'Settings' button in the sidebar and go to 'Themes'.";
        }

        // 5. Default Response if it doesn't understand
        return "I'm still learning, bro. Your vision is moving forward! Ask me about my developer or how to change my colors.";
    }
};
