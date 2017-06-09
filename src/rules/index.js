import life from './life'
import manual from './manual'
import need from './need'
import once from './once'
import route from './route/index'

export default function install (_Vue, Vuet) {
  Vuet
    .rule('life', life)
    .rule('manual', manual)
    .rule('need', need)
    .rule('once', once)
    .rule('route', route)
}
