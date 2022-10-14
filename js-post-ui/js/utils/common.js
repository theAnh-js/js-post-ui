export function setTextContent(parent, selector, text) {
  if (!parent) return;

  const element = parent.querySelector(selector);
  if (element) element.textContent = text;
}

export function truncatedText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

export function setFieldValue(form, selector, value) {
  if (!form) return;
  const field = form.querySelector(selector);
  // console.log("field", field);
  if (field) field.value = value;
}

export function setBackgroundImage(parent, selector, imageUrl) {
  const element = parent.querySelector(selector);
  if (element) element.style.backgroundImage = `url("${imageUrl}")`;
}

// random number from 0 to n
export function randomNumber(n) {
  if (n <= 0) return -1;

  const random = Math.random() * n;
  return Math.round(random);
}
