import life from './life'
import need from './need'

export default function install (Vuet) {
  Vuet
    .rule('life', life)
    .rule('need', need)
}
