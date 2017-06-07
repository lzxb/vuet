import life from './life'
import need from './need'
import once from './once'
import route from './route'

export default function install (_Vue, Vuet) {
  Vuet
    .mixin('life', life)
    .mixin('need', need)
    .mixin('once', once)
    .mixin('route', route)
}
