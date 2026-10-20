// Compatibility API. The gallery and exports use the selected definition directly.
import {componentIdFor} from './component-model.js?v=20261020-expression9';
import {componentDefinitions} from './library-components.js?v=20261020-expression9';
import {legacyDefinitions} from './legacy-components.js?v=20261020-expression9';
const keys=['upload','menu','tabs','button','form','tags'];
const definition=item=>{const key=componentIdFor(item);return keys.includes(key)?componentDefinitions[key]||legacyDefinitions[key]:null;};
export const inputsMarkup=item=>definition(item)?.markup(item)||'';
export const inputsCSS=item=>item?definition(item)?.css||'':keys.map(key=>(componentDefinitions[key]||legacyDefinitions[key]).css).join('\n');
export function inputsWire(root,item,helpers){return definition(item)?.wire(root,item,helpers);}
