export function generateOTP(): number {
  const min = 1000; // Minimum four-digit number (1000)
  const max = 9999; // Maximum four-digit number (9999)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export default generateOTP