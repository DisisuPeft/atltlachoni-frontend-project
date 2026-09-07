/**
 * Utility functions to download or display PDF blobs in the browser.
 */

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export function openOrDownloadBlob(blob: Blob, fallbackFilename: string) {
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (!win || win.closed || typeof win.closed === "undefined") {
    URL.revokeObjectURL(url);
    downloadBlob(blob, fallbackFilename);
  } else {
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
}
