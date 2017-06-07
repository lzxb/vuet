import life from './life'
import need from './need'
import once from './once'
import route from './route'

export default function install (_Vue, Vuet) {
  Vuet
    .rule('life', life)
    .rule('need', need)
    .rule('once', once)
    .rule('route', route)
}
