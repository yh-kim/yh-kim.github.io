// Compatibility API for existing theme pages; live components use the site runtime.
import {siteTokens,siteMarkup,siteCSS,siteEnhancer} from './site-runtime.js?v=20261019-refine5';
export const componentTokens=siteTokens;
const itemFor=(themeId,key)=>({id:themeId+'--'+key,themeId,key});
export const componentMarkup=(theme,key)=>siteMarkup(itemFor(theme.id,key));
export const componentCSS=(key,themeId)=>siteCSS(key?itemFor(themeId,key):null);
export const componentEnhancer=(theme,key)=>siteEnhancer(itemFor(theme.id,key));
