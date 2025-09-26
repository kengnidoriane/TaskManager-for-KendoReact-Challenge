export const motivationalQuotes = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "Your limitation is only your imagination.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn't come to you, you go to it.",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "It is never too late to be what you might have been. - George Eliot"
];

export const getRandomQuote = (): string => {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
};

export const getCelebrationMessage = (completedCount: number): string => {
  if (completedCount === 1) return "🎉 First task completed! Great start!";
  if (completedCount === 5) return "🔥 5 tasks completed! You're on fire!";
  if (completedCount === 10) return "⭐ 10 tasks! You're a productivity machine!";
  return `🚀 ${completedCount} tasks completed! Keep it up!`;
};