export const formatTimeDelta = (time: number) => {
  const seconds = Math.floor(time % 60)
  const minutes = Math.floor((time / 60) % 60)
  const hours = Math.floor((time / (60 * 60)) % 60)
  return `${hours}h ${minutes}m ${seconds}s`
}
