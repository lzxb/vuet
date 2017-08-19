import need from './need'
import once from './once'
import reset from './reset'
import temp from './temp'

export default function install (Vuet) {
  Vuet
    .rule('need', need)
    .rule('once', once)
    .rule('temp', temp)
    .rule('reset', reset)
}
