export default function getRandomNumber(min: number, max: number): number {
  return Math.ceil(Math.random() * (max - min) + min);
}
