export const theme = {
  colors: {
    primary: {
      gradient: "from-purple-400 to-pink-600",
      light: "rgb(216, 180, 254)", // purple-300
      DEFAULT: "rgb(168, 85, 247)", // purple-500
      dark: "rgb(147, 51, 234)", // purple-600
    },
    background: {
      card: "bg-black/30",
      gradient: "bg-gradient-to-b from-black via-purple-950/20 to-black",
      overlay: "bg-black/60",
    },
    glass: {
      DEFAULT: "backdrop-blur-xl bg-black/30",
      hover: "backdrop-blur-xl bg-black/40",
    },
    text: {
      primary: "text-gray-100",
      secondary: "text-gray-400",
      gradient:
        "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600",
    },
    border: {
      DEFAULT: "border-purple-500/20",
      hover: "border-purple-500/40",
    },
  },
  animation: {
    fadeIn: "animate-fadeIn",
    slideUp: "animate-slideUp",
    pulse: "animate-pulse",
    shimmer: "animate-shimmer",
    glow: "animate-glow 3s ease-in-out infinite",
    float: "animate-float",
    gradientMove: "animate-gradientMove 15s ease infinite alternate",
    orb: "orb 20s ease-in-out infinite",
  },
};

export const commonStyles = {
  glassCard: `
    bg-black/30 backdrop-blur-xl
    border border-purple-500/20
    hover:bg-black/40 hover:border-purple-500/40
    transition-all duration-300
    rounded-xl
  `,
  gradientText: `
    text-transparent bg-clip-text
    bg-gradient-to-r from-purple-400 to-pink-600
    font-bold
  `,
  button: {
    primary: `
      px-4 py-2 rounded-lg
      bg-gradient-to-r from-purple-400 to-pink-600
      hover:opacity-90 transition-all duration-300
      text-white font-medium
    `,
    secondary: `
      px-4 py-2 rounded-lg
      bg-purple-500/20 text-purple-300
      hover:bg-purple-500/30 transition-all duration-300
      font-medium
    `,
  },
};

// Add new keyframes to your globals.css
/*
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes glow {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes orb {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, 50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

@keyframes gradientMove {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 100%;
  }
}
*/
