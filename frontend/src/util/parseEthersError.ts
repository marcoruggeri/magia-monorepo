export const parseEthersError = (err: string) => {
  if (err.indexOf('reason=') > -1) {
    return err.split('reason=')[1].substring(1).split('"')[0]
  }

  return err
}
