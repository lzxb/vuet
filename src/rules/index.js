import life from './life'
import need from './need'
import once from './once'

export default function install (Vuet) {
  Vuet
    .rule('life', life)
    .rule('need', need)
    .rule('once', once)
}
