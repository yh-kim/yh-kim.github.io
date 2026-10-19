#!/usr/bin/env node
// Contract checks for the shared component/style matrix. Browser rendering remains a separate check.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Script} from 'node:vm';

const source=path=>readFile(new URL(path,import.meta.url),'utf8');
const moduleCache=new Map();
async function moduleURL(url){
 const key=new URL(url);key.search='';if(moduleCache.has(key.href))return moduleCache.get(key.href);
 let code=await readFile(key,'utf8');const imports=[...code.matchAll(/from\s+['"]([^'"]+)['"]/g)];
 for(const match of imports){if(!match[1].startsWith('.'))continue;const child=await moduleURL(new URL(match[1],key));code=code.replace(match[0],`from '${child}'`);}
 const result='data:text/javascript;base64,'+Buffer.from(code).toString('base64');moduleCache.set(key.href,result);return result;
}
const load=async name=>import(await moduleURL(new URL('../js/ui-motion-showcase/'+name+'.js',import.meta.url)));
const {styles,styleById,styleCSS,styleGuide}=await load('style-system');
const {componentIds,legacyStyles,componentIdFor,styleIdFor,withStyle}=await load('component-model');
const {componentDefinitions}=await load('library-components');
const {websiteItems,siteOrder}=await load('site-catalog');
const {siteMarkup,siteCSS,standaloneSite,wireSite,mountSite}=await load('site-runtime');
const gallery=await source('../js/ui-motion-showcase/gallery.js');
const runtime=await source('../js/ui-motion-showcase/site-runtime.js');
const componentSource=await source('../js/ui-motion-showcase/library-components.js');
const styleSource=await source('../js/ui-motion-showcase/style-system.js');
const hiddenConceptPages=Object.fromEntries(await Promise.all(['paper','object','frame'].map(async id=>[id,await source('../p/ui-motion/'+id+'/index.html')])));

let count=0;const failures=[];
const check=(name,run)=>{count++;try{run();}catch(error){failures.push(name+': '+error.message);}};
const expectedComponents={
 'dark-ai--beam':'button','dark-ai--prompt':'form','dark-ai--controls':'tabs','dark-ai--dialog':'drawer',
 'dark-ai--layers':'menu','light-project--tasks':'accordion','light-project--quick-add':'tags','dark-ai--process':'upload',
 'light-project--filters':'table','light-project--calendar':'calendar','light-project--chart':'chart','light-project--dialog':'dialog'
};
const expectedLegacyStyles={
 'dark-ai--beam':'object','dark-ai--prompt':'paper','dark-ai--controls':'frame','dark-ai--dialog':'object',
 'dark-ai--layers':'paper','light-project--tasks':'paper','light-project--quick-add':'paper','dark-ai--process':'frame',
 'light-project--filters':'object','light-project--calendar':'object','light-project--chart':'frame','light-project--dialog':'frame'
};
const expectedMotion={
 paper:{press:150,content:200,tab:180,result:180,drawerOpen:230,drawerClose:150,drawerDistance:24,ease:'cubic-bezier(.2,.8,.2,1)'},
 object:{press:150,content:220,tab:180,result:200,drawerOpen:240,drawerClose:150,drawerDistance:28,ease:'cubic-bezier(.22,1,.36,1)'},
 frame:{press:140,content:180,tab:180,result:180,drawerOpen:220,drawerClose:140,drawerDistance:20,ease:'cubic-bezier(.2,.8,.2,1)'}
};
const components=['button','form','tabs','drawer'];
const componentSelector=component=>`.ui-demo--${component}`;
const scopedRules=(css,component)=>[...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(([,selector])=>selector.includes(componentSelector(component)));
const withoutColors=rules=>rules.map(([,selector,declarations])=>{
 const kept=declarations.split(';').map(part=>part.trim()).filter(part=>part&&!/^(?:color|background(?:-[\w-]+)?|border(?:-[\w-]+)?|outline(?:-[\w-]+)?|accent-color|fill|stroke)\s*:/i.test(part));
 return selector.replace(/\s+/g,' ')+`{${kept.join(';')}}`;
}).join('\n');

check('three styles have the canonical records and all required role tokens',()=>{
 assert.deepEqual(styles.map(style=>style.id),['paper','object','frame']);
 assert.deepEqual(styles.map(style=>style.name),['Paper','Object','Frame']);
 for(const style of styles){
  assert.ok(style.summary&&style.thumbnail&&style.contexts.length>=4);
  for(const key of ['paper','surface','ink','muted','line','accent','onAccent','selected','error','success','disabled'])assert.ok(style.colors[key],style.id+'.colors.'+key);
  for(const key of ['bg','surface','ink','text','muted','line','accent','on-accent','selected','error','success','disabled','radius','pad','gap'])assert.ok(style.tokens[key],style.id+'.tokens.'+key);
  assert.ok(style.type.display&&style.type.heading&&style.type.body&&style.type.scale);
  assert.ok(style.spacing&&style.radius&&style.shadow&&style.motion&&style.principles.length>=3&&style.sampleTitle&&style.sampleText);
  assert.equal(styleById(style.id),style);
 }
 assert.equal(styleById('missing'),null);
});

check('legacy component anchors and default style assignments stay stable',()=>{
 assert.deepEqual(componentIds,expectedComponents);assert.deepEqual(legacyStyles,expectedLegacyStyles);
 assert.deepEqual(new Set(Object.keys(componentIds)),new Set(siteOrder));assert.equal(websiteItems.length,12);
 for(const item of websiteItems){assert.equal(componentIdFor(item.id),expectedComponents[item.id]);assert.equal(styleIdFor(item.id),expectedLegacyStyles[item.id]);}
 assert.match(gallery,/item=>'ui-'\+item\.themeId\+'-'\+item\.key===hash/);
 assert.match(gallery,/new URL\(conceptForItem\(item\)\.id\+'\/#'\+item\.id,base\)/);
});

check('all twelve legacy component IDs render across all three styles',()=>{
 assert.equal(websiteItems.length*styles.length,36);
 for(const item of websiteItems)for(const style of styles){
  const css=styleCSS(style.id,item.componentId);
  assert.ok(css.includes(`--bg:${style.colors.paper}`),item.id+'/'+style.id+' root token missing');
  if(components.includes(item.componentId))assert.ok(css.includes(componentSelector(item.componentId)),item.id+'/'+style.id+' component rule missing');
  for(const other of components)if(other!==item.componentId)assert.doesNotMatch(css,new RegExp(`\\.ui-demo--${other}(?:\\s|\\.|\\[|:)`),item.id+'/'+style.id+' leaked '+other+' rules');
 }
});

check('four shared DOM trees are byte-identical in each visual style',()=>{
 const byComponent=new Map();
 for(const component of components){
  const records=websiteItems.filter(item=>item.componentId===component);assert.ok(records.length>=1,component+' has no legacy anchor');
  const item=records[0],markupByStyle=styles.map(style=>siteMarkup({...withStyle(item,style.id),styleMotion:style.styleMotion}));
  assert.equal(new Set(markupByStyle).size,1,component+' DOM changed with style');
  byComponent.set(component,markupByStyle[0]);
 }
 assert.equal(new Set(byComponent.values()).size,4,'the four component studies should have distinct DOM');
});

check('component styles differ in layout and surface structure beyond color values',()=>{
 for(const component of components){
  const versions=styles.map(style=>{
   const rules=scopedRules(styleCSS(style.id,component),component);assert.ok(rules.length>=3,style.id+'/'+component+' has too few scoped rules');
   return withoutColors(rules);
  });
  assert.equal(new Set(versions).size,3,component+' varies only in color or repeats another style');
 }
});

check('selected component exports contain no unrelated component CSS or wire branches',()=>{
 for(const component of components){
  const definition=componentDefinitions[component];assert.ok(definition,component);
  for(const style of styles){
   const css=styleCSS(style.id,component);
   for(const other of components)if(other!==component)assert.doesNotMatch(css,new RegExp(`\\.ui-demo--${other}(?:\\s|\\.|\\[|:)`));
  }
  const wire=definition.wire.toString();new Script('('+wire+')',{filename:'wire-'+component+'.js'});
  assert.doesNotMatch(wire,/componentDefinitions|componentIdFor|styleById|['"](?:paper|object|frame)['"]/);
 }
 assert.ok(componentDefinitions.button.css.includes('.ui-demo{'),'common helper CSS remains available');
 assert.ok(componentDefinitions.button.css.includes('.ui-demo .ui-actions'));
 for(const component of components){const css=componentDefinitions[component].css;for(const other of components)if(other!==component)assert.doesNotMatch(css,new RegExp(`\\.ui-demo--${other}(?:\\s|\\.|\\[|:)`));}
});

check('selected standalone exports parse and need no remote scripts, fonts, or imports',()=>{
 assert.match(styleSource,/from '\.\/style-tokens\.js/);assert.doesNotMatch(componentSource,/^\s*import\s/m);
 for(const component of components){
  const item=websiteItems.find(value=>value.componentId===component);
  const html=standaloneSite({...withStyle(item,'object'),styleMotion:styleById('object').styleMotion});
  assert.match(html,/^<!doctype html><html lang="ko">/i);
  assert.doesNotMatch(html,/<(?:script|link)\b[^>]*(?:src|href)\s*=|@import\s|url\(\s*['"]?https?:|\b(?:fetch|XMLHttpRequest)\s*\(/i);
  const script=html.match(/<script>([\s\S]*?)<\/script>/i);assert.ok(script,component+' script missing');
  new Script(script[1],{filename:'standalone-'+component+'.js'});
  new Script('('+componentDefinitions[component].wire.toString()+')',{filename:'wire-'+component+'.js'});
 }
});

check('style motion values are assigned to the shared controllers and stylesheets',()=>{
 assert.deepEqual(Object.fromEntries(styles.map(style=>[style.id,style.styleMotion])),expectedMotion);
 assert.match(runtime,/item\.styleMotion=styleById\(item\.styleId\)\?\.styleMotion/);
 assert.match(runtime,/styleMotion:styleById\(styleIdFor\(source\)\)\?\.styleMotion/);
 assert.match(mountSite.toString(),/setStyle=id=>/);assert.match(mountSite.toString(),/styleMotion:styleById\(id\)\.styleMotion/);
 for(const style of styles){
  const buttonCSS=styleCSS(style.id,'button');assert.ok(buttonCSS.includes(`transform ${style.styleMotion.press}ms ${style.styleMotion.ease}`));
  const guide=styleGuide[style.id];assert.deepEqual(guide.motionFromTo.duration,{press:style.styleMotion.press,content:style.styleMotion.content,tab:style.styleMotion.tab,result:style.styleMotion.result,drawerOpen:style.styleMotion.drawerOpen,drawerClose:style.styleMotion.drawerClose});
  assert.equal(guide.motionFromTo.ease,style.styleMotion.ease);
 }
});

check('guide token and color values come from the exact style registry records',()=>{
 for(const style of styles){const guide=styleGuide[style.id];assert.ok(guide);assert.deepEqual(guide.tokens,style.tokens);assert.deepEqual(guide.colors,style.colors);assert.deepEqual(guide.type,style.type);assert.equal(guide.thumbnail,style.thumbnail);assert.ok(guide.colorProportion&&guide.layout.good&&guide.layout.avoid&&guide.colorUse&&guide.avoid);assert.equal(guide.control.minimumHeight,'44px');}
});

check('reduced motion skips animation and interruption starts from all current dimensions',()=>{
 const css=styleCSS('paper','button');assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);assert.match(css,/transition-duration:\.01ms!important/);
 const wireSource=wireSite.toString();for(const marker of ['prefers-reduced-motion: reduce','if(reduced())return null','previous.cancel()','getComputedStyle(node)','\'transform\',\'opacity\',\'height\',\'width\'','animations.forEach(a=>a.finish())'])assert.ok(wireSource.includes(marker),marker);
 const names=['matchMedia','document','IntersectionObserver','MutationObserver','getComputedStyle'];const saved=names.map(name=>[name,globalThis[name]]);
 try{
  globalThis.matchMedia=()=>({matches:false,addEventListener(){}});globalThis.document={hidden:false,addEventListener(){}};
  globalThis.IntersectionObserver=class{observe(){}disconnect(){}};globalThis.MutationObserver=class{observe(){}disconnect(){}};
  globalThis.getComputedStyle=()=>({opacity:'0.45',transform:'matrix(1, 0, 0, 1, 0, 8)',height:'31px',width:'47px'});
  let animate;const root={dataset:{},style:{setProperty(){}},querySelector(){return null;},querySelectorAll(){return [];}};
  root.addEventListener=()=>{};const api=wireSite(root,{motion:{ease:'linear'}},(_root,_item,helpers)=>{animate=helpers.animate;return {};});
  const calls=[],node={animate(frames){const animation={playState:'running',cancels:0,finished:new Promise(()=>{}),cancel(){this.cancels++;this.playState='idle';},pause(){},play(){},finish(){this.playState='finished';}};calls.push({frames,animation});return animation;}};
  animate(node,[{opacity:0,transform:'translateY(8px)',height:'10px',width:'30px'},{opacity:1,transform:'none',height:'20px',width:'40px'}],200);
  animate(node,[{opacity:0,transform:'translateY(12px)',height:'8px',width:'25px'},{opacity:1,transform:'none',height:'24px',width:'55px'}],200);
  assert.equal(calls.length,2);assert.equal(calls[0].animation.cancels,1);
  assert.deepEqual(calls[1].frames[0],{opacity:'0.45',transform:'matrix(1, 0, 0, 1, 0, 8)',height:'31px',width:'47px'});
  api.destroy();
 }finally{for(const [name,value] of saved){if(value===undefined)delete globalThis[name];else globalThis[name]=value;}}
});

check('modal Tab wraps both directions and modeless comparison stays navigable',()=>{
 const names=['matchMedia','document','IntersectionObserver','MutationObserver'];const saved=names.map(name=>[name,globalThis[name]]);
 try{
  globalThis.matchMedia=()=>({matches:false,addEventListener(){}});globalThis.document={hidden:false,addEventListener(){}};
  globalThis.IntersectionObserver=class{observe(){}disconnect(){}};globalThis.MutationObserver=class{observe(){}disconnect(){}};
  const listeners={};let focused;
  const controls=[0,1].map(index=>({index,getClientRects:()=>[{}],focus(){focused=this;}}));
  const modal={querySelectorAll:()=>controls};const target={closest:()=>modal};
  const root={dataset:{},style:{setProperty(){}},querySelector:()=>null,querySelectorAll:()=>[],getRootNode:()=>({activeElement:focused}),addEventListener(type,fn){listeners[type]=fn;}};
  const api=wireSite(root,{},()=>({}));let prevented=0;
  focused=controls[0];listeners.keydown({key:'Tab',shiftKey:true,target,preventDefault(){prevented++;}});assert.equal(focused,controls[1]);
  listeners.keydown({key:'Tab',shiftKey:false,target,preventDefault(){prevented++;}});assert.equal(focused,controls[0]);assert.equal(prevented,2);
  api.setComparison(true);listeners.keydown({key:'Tab',shiftKey:true,target,preventDefault(){prevented++;}});assert.equal(prevented,2);api.destroy();
 }finally{for(const [name,value] of saved){if(value===undefined)delete globalThis[name];else globalThis[name]=value;}}
});

check('legacy exports preserve hidden URLs and every style thumbnail has a registry entry',()=>{
 for(const style of styles){assert.match(style.thumbnail,new RegExp(`/p/ui-motion/assets/style-${style.id}\\.png$`));}
 for(const id of ['paper','object','frame']){
  const html=hiddenConceptPages[id];assert.match(html,new RegExp('data-gallery-concept="'+id+'"'));assert.match(html,/html-document-listing" content="hidden"/);
 }
});

if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}else console.log(`PASS: ${count} UI motion style contracts (browser verification remains separate).`);
