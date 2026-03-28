export function getRenderableUrl(value: string) {
  return value.startsWith("asset:") ? "" : value;
}

export function shouldOpenInNewTab(value: string, download = false) {
  if (!value || download) {
    return false;
  }

  return (
    value.startsWith("http") ||
    value.startsWith("blob:") ||
    value.startsWith("data:")
  );
}
