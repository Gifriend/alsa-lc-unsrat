import { Timestamp } from "firebase-admin/firestore"

export function convertTimestampToString(value: any): any {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString()
  }
  if (Array.isArray(value)) {
    return value.map(convertTimestampToString)
  }
  if (value !== null && typeof value === "object") {
    return Object.entries(value).reduce(
      (acc, [key, val]) => {
        acc[key] = convertTimestampToString(val)
        return acc
      },
      {} as Record<string, any>,
    )
  }
  return value
}

export function parseFormDate(dateString: string): Date {
  return new Date(dateString + "T00:00:00Z")
}
