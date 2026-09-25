type ClassValue = string | number | null | undefined | false | Record<string, boolean>

export function cn(...inputs: Array<ClassValue>): string {
  const classes: Array<string> = []

  for (const input of inputs) {
    if (!input) continue
    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input))
    } else {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key)
      }
    }
  }

  return classes.join(' ')
}
