const calculateReadingTime = (text) => {
    if (!text) return 0;
    
    const words = text.trim().split(/\s+/).length;
    const wordsPerMinute = 256;

    const readingTime = words / wordsPerMinute;
    return Math.ceil(readingTime);
}

module.exports = { calculateReadingTime };
