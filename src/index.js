import Vuet from './vuet'
import VuetStatic from './vuet-static'

VuetStatic(Vuet)

export const mapRules = Vuet.mapRules.bind(Vuet)
export const mapModules = Vuet.mapModules.bind(Vuet)

export default Vuet
