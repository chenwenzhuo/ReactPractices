export const generateRandomHexColor = () => {
  const characters = '0123456789abcdef'
  let result = '#';
  for (let i = 0; i < 6; i++) {
    const idx = Math.floor(Math.random() * characters.length);
    result += characters[idx];
  }
  return result;
}

export const getRandomInteger = (range: number) => Math.floor(Math.random() * range);
