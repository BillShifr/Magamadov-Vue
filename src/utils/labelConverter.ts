import type { LabelItem } from '@/types/account'

export function stringToLabelArray(labelString: string): LabelItem[] {
  if (!labelString || labelString.trim() === '') {
    return []
  }

  return labelString
    .split(';')
    .map(item => item.trim())
    .filter(item => item.length > 0)
    .map(text => ({ text }))
}

export function labelArrayToString(labelArray: LabelItem[]): string {
  if (!labelArray || labelArray.length === 0) {
    return ''
  }

  return labelArray.map(item => item.text).join('; ')
}
