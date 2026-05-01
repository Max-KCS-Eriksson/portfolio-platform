export function renderLinebreaks(text) {
  return text?.split(/\r?\n/).map((line, index) => <p key={index}>{line}</p>);
}
