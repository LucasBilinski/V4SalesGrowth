export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}

export function getFullYear() {
  return new Date().getFullYear()
}
