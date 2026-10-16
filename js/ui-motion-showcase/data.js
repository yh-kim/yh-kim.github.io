import {themes as originalThemes, elementsFor, colorLabels} from '../ui-motion-guide/themes.js?v=20261016-r2';
import {aiTokens} from './ai-scene.js?v=20261016-foundation2';
import {projectTokens} from './project-scene.js?v=20261016-foundation2';
export const themes=structuredClone(originalThemes);
Object.assign(themes[0],{scene:aiTokens,intent:'ARC 제품 캠페인을 위한 로컬 창작 작업 화면. 후보 선택·프롬프트·속성 조정·생성 상태가 중앙 결과에 연결됩니다.',composition:`${aiTokens.navHeight}px 내비게이션과 ARC Campaign 작업 제목 아래 폭 최대 ${aiTokens.studioMax}px·높이 ${aiTokens.studioHeight+aiTokens.stageExtra}px 장면. 중앙 ${aiTokens.previewHeight}px 결과(좌우 여백 ${aiTokens.canvasLeft}/${aiTokens.canvasRight}px), 왼쪽 ${aiTokens.choiceCount}개 수직 후보(각 ${aiTokens.choiceHeight}px), 오른쪽 ${aiTokens.inspectorWidth}px 속성 패널, 중앙 아래 최대 ${aiTokens.composerWidth}px 떠 있는 프롬프트. ${aiTokens.breakpoint}px 이하에서는 ${aiTokens.mobileTitle}px 제목 → 프리뷰 → 가로 후보 → 프롬프트 → 속성 순서. 제품 이미지는 자체 제작 ARC 스피커 SVG.`});
Object.assign(themes[0].layout,{breakpoint:aiTokens.breakpoint,max:aiTokens.studioMax,columns:`${aiTokens.railWidth}px minmax(0,1fr) ${aiTokens.inspectorWidth}px`,gap:aiTokens.gap});
Object.assign(themes[0].type,{title:aiTokens.title,mobileTitle:aiTokens.mobileTitle});
Object.assign(themes[0].colors,{background:'#060D19',surface:aiTokens.panelSurface,accent:aiTokens.blue,border:aiTokens.panelBorder});
themes[0].motion.records.controls.duration=aiTokens.selectionDuration;
Object.assign(themes[1],{scene:projectTokens,composition:`${projectTokens.navHeight}px 가로 내비게이션 → 프로젝트 제목 → 높이 ${projectTokens.kpiHeight}px의 지표 스트립. 최대 ${projectTokens.sceneMax}px/바깥 ${projectTokens.scenePadding}px/간격 ${projectTokens.sceneGap}px. 위 ${projectTokens.columns} 그리드는 마감 분포 차트(플롯 ${projectTokens.chartHeight}px), 진행 통계, 어두운 다음 리뷰. 아래는 왼쪽 두 열의 5열 작업 표와 오른쪽 선택일 일정·최근 파일. 같은 6개 샘플 작업이 필터·차트·일정·정렬에 연결된다. ${projectTokens.tabletBreakpoint}px 이하 2열, ${projectTokens.mobileBreakpoint}px 이하 차트 → 작업 표 → 일정 → 진척 → 리뷰 1열.`});
Object.assign(themes[1].layout,{max:projectTokens.sceneMax,padding:projectTokens.scenePadding,gap:projectTokens.sceneGap,columns:projectTokens.columns,breakpoint:projectTokens.mobileBreakpoint});
Object.assign(themes[1].colors,{background:projectTokens.material.canvas,surface:projectTokens.material.surface,text:projectTokens.material.ink,muted:projectTokens.material.muted,border:projectTokens.material.line,accent:projectTokens.material.accent,success:projectTokens.material.green});
themes[1].motion.records.chart.duration=projectTokens.chartMorphDuration;
themes[1].motion.records.chart.delay=projectTokens.chartMorphDelay;
export const presentation={compact:{height:380,padding:16}};
export const kinds={all:'전체',screen:'완성 화면',panel:'패널',selection:'선택·전환',feedback:'처리·피드백',data:'목록·차트',calendar:'일정',form:'입력'};
const descriptions={
 'dark-ai/hero':['Dark AI Workspace','ARC 제품 후보·프롬프트·속성을 조정합니다.','screen','scene'],
 'light-project/hero':['Light Project Dashboard','같은 샘플 업무의 지표·차트·표·일정.','screen','scene'],
 'dark-ai/process':['생성 상태','진행률과 완료 결과를 확인합니다.','feedback','process'],
 'dark-ai/layers':['레이어 패널','작업 패널의 앞뒤 관계를 재생합니다.','panel','depth'],
 'light-project/chart':['막대 차트','같은 작업의 일별·누적 분포를 비교합니다.','data','bars'],
 'dark-ai/controls':['프리셋','오브젝트와 포스터 구성을 전환합니다.','selection','tilt'],
 'light-project/tasks':['작업 상세','작업을 선택해 세부 정보를 봅니다.','panel','slide'],
 'light-project/filters':['작업 필터','목록과 지표가 함께 바뀝니다.','data','reflow'],
 'light-project/calendar':['캘린더','날짜에 맞는 업무를 확인합니다.','calendar','clip'],
 'dark-ai/beam':['선택 강조','선택한 제어부에만 빛을 표시합니다.','selection','beam'],
 'dark-ai/prompt':['프롬프트 입력','작업 지시의 오류·성공 상태를 확인합니다.','form','feedback'],
 'light-project/quick-add':['작업 추가','새 업무를 목록과 지표에 반영합니다.','form','insert']
};
const motionText={
 scene:['대표 화면의 조작·다시 재생','선택 상태, 프리뷰 또는 차트와 관련 정보','기존 선택·데이터·결과','새 선택·데이터·결과로 연결'],
 process:['생성 시작','진행 막대·완료 결과','진행률 0, 완료 결과 숨김·blur(8px)/scale(.98)','진행률 100%, 완료 결과 표시·blur(0)/scale(1)'],
 depth:['재생·화면 진입 1회','뒤 정보 패널 → 프리뷰 → 앞 제어부','translateY(18px), scale(.97), opacity 0','원래 회전·배치, scale(1), opacity 1'],
 bars:['일별/누적 탭 또는 상태 필터 변경','차트 막대·축·값','새 막대 scaleY(0), 축·값은 새 데이터로 갱신','막대 scaleY(1), 새 축·값을 유지'],
 tilt:['오브젝트/포스터 선택','결과 프리뷰','rotate(-3deg) scale(.96)','기본 회전·배치로 복귀, scale(1); 최신 모드 선택'],
 slide:['작업 행 선택','선택 작업 상세 패널','translateX(24px)','translateX(0)'],
 reflow:['상태 필터 선택','목록 높이·행·연결 지표','기존 목록 높이, 새 행 translateY(12px)','새 목록 높이, 새 행 translateY(0); 지표·차트·일정은 같은 필터 데이터'],
 clip:['날짜 선택','해당 날짜 일정','clip-path inset(0 0 100% 0)','clip-path inset(0 0 0 0)'],
 beam:['제어 타일 선택','선택 경계 광원','그림자 0px','그림자 28px → 0px, 선택 경계 유지'],
 feedback:['유효/오류 입력 제출','성공 메시지 / 오류 입력','성공 clip-path inset(0 100% 0 0) / 오류 X 0','성공 inset(0) / 오류 X -4→4→0px'],
 insert:['유효한 작업 추가','갱신 목록','translateY(-12px)','원래 위치로 복귀, 선택한 새 행 강조']
};
const ordered=Object.entries(descriptions).map(([id,[name,description,kind,technique]],i)=>{
 const [themeId,key]=id.split('/'),theme=themes.find(t=>t.id===themeId),element=elementsFor(theme).find(e=>e.id===key),base=theme.motion.records[key];
 let [trigger,target,from,to]=motionText[technique];
 const ai=themeId==='dark-ai',scene=theme.scene;
 if(key==='hero'){
  if(ai){from=`오브젝트·후보 01·광원 ${scene.lightDefault}%·생성 대기`;to='선택한 모드·후보·광원, 생성 중 진행률과 완료 결과가 같은 프리뷰에 반영';}
  else{from=`전체 ${theme.data.tasks.length}개 작업·일별 차트·10월 ${theme.data.dates[0]}일`;to='필터·기간·작업·날짜 선택에 맞춰 지표·차트·상세·일정 갱신';}
 }
 const duration=ai&&['scene','tilt'].includes(technique)?scene.selectionDuration:base?.duration||theme.motion.duration;
 const delay=!ai&&technique==='bars'?(scene.chartMorphDelay??base?.delay??theme.motion.stagger):technique==='depth'?base?.delay??theme.motion.stagger:technique==='reflow'?30:0;
 return {id:id.replace('/','--'),number:String(i+1).padStart(2,'0'),themeId,key,name,description,kind,use:element?.use||theme.intent,behavior:key==='filters'?'목록과 지표가 같은 필터를 적용합니다. 선택한 작업이 사라지면 첫 결과를 선택합니다. 대표 화면에서는 작업 표·차트·일정에도 연결됩니다.':element?.behavior||theme.composition,
 motion:{technique,trigger,target,from,to,duration,ease:theme.motion.ease,delay,resultDuration:ai?scene.revealDuration:theme.motion.duration,errorDuration:theme.motion.close,interrupt:ai&&key==='hero'?'생성 중 중복 시작·후보 선택을 무시합니다. 출력 구성 변경은 최신 선택으로 전환합니다.':base?.reverse||'새 입력에서 진행 중 전환을 취소하고 최신 상태로 갱신',reset:'진행 중 작업을 취소하고 기본 샘플 상태로 복귀',reduced:'이동·노이즈를 생략하고 계산한 최종 상태를 즉시 표시'},
 auto:technique==='process'?[{at:300,action:'generate'}]:technique==='scene'?themeId==='dark-ai'?[{at:300,selector:'[data-mode="poster"]'},{at:1300,selector:'[data-mode="object"]'}]:[{at:300,selector:'[data-period="cumulative"]'},{at:1300,selector:'[data-period="week"]'}]:technique==='depth'?[{at:300,action:'play'}]:technique==='bars'?[{at:300,selector:'[data-period="cumulative"]'},{at:1300,selector:'[data-period="week"]'}]:technique==='tilt'?[{at:300,selector:'[data-mode="poster"]'},{at:1300,selector:'[data-mode="object"]'}]:technique==='slide'?[{at:300,selector:'[data-task="T-03"]'}]:technique==='reflow'?[{at:300,selector:'[data-filter="done"]'},{at:1500,selector:'[data-filter="all"]'}]:technique==='clip'?[{at:300,selector:'[data-date="18"]'}]:technique==='beam'?[{at:300,selector:'[data-beam="1"]'}]:[]};
});
// Ordered after the three-example layout and visual review.
export const catalog=ordered;
export const fullCatalog=ordered;
export const themeFor=item=>themes.find(t=>t.id===item.themeId);
export function detailRules(item){
 const t=themeFor(item),m=item.motion,s=t.scene,ai=t.id==='dark-ai',hero=item.key==='hero';
 const rows=entries=>entries.map(([key,value])=>key+': '+value).join('\n');
 const motionRows=[
  ['trigger',m.trigger],['대상',m.target],['시작',m.from],['종료',m.to],
  ['duration',m.duration+'ms'],['easing',m.ease],['delay',m.delay+'ms'],
  ['중단·역방향',m.interrupt],['초기화',m.reset],['reduced-motion',m.reduced]
 ];
 const sourceRows=rows([
  ['원본 A/B 모션','정지 이미지에서 미확인. 아래 시간·이동 값은 새로 설계'],
  ['C',ai?'#280의 MIT 노이즈 표면을 조정해 사용':'#095 차트·키보드, #273 선택 행·상세 패턴을 참고해 자체 구현'],
  ['원본','https://lucianlabs.dev/uxui-prompt/#'+(ai?'280':'095')],
  ['라이선스','https://github.com/Seokwoooo/lucian-uxui-prompt/blob/036fe0a67048bc135115ae2ed283130567a15357/LICENSE'],
  ['실행','ES modules·Shadow DOM·dialog·WAAPI·IntersectionObserver; 서버/API/웹폰트 요청 없음']
 ]);
 if(hero){
  const layout=ai?rows([
   ['시선','ARC Campaign 작업 제목 → 중앙 결과 → 후보·속성·프롬프트'],
   ['장면',s.studioMax+'px 최대 폭 / '+(s.studioHeight+s.stageExtra)+'px 높이'],
   ['프리뷰',s.previewHeight+'px 높이 / 좌·우 '+s.canvasLeft+'·'+s.canvasRight+'px'],
   ['전경','왼쪽 '+s.choiceCount+'개 후보(각 '+s.choiceHeight+'px) / 오른쪽 속성 '+s.inspectorWidth+'px'],
   ['프롬프트','중앙 하단에 최대 '+s.composerWidth+'px 폭으로 겹침']
  ]):rows([
   ['시선','프로젝트·지표 → 마감 분포 → 작업 표·일정'],
   ['컨테이너',s.sceneMax+'px 최대 폭 / 바깥 '+s.scenePadding+'px / 모듈 간 '+s.sceneGap+'px'],
   ['상단',s.columns+'; 차트·진척·어두운 리뷰'],
   ['하단','작업 표 좌 2열 + 선택일 일정·최근 파일 우 1열'],
   ['표','작업/담당자/마감/상태/검토 = '+Object.values(s.tableWidths).join('/')+'%'],
   ['크기','내비게이션 '+s.navHeight+'px / 지표 '+s.kpiHeight+'px / 차트 '+s.chartHeight+'px / 표 머리 '+s.tableHeaderHeight+'px / 행 '+s.taskRowHeight+'px']
  ]);
  const typeSurface=ai?rows([
   ['제목',t.type.body+' / clamp(32px,3.8cqw,'+s.title+'px) / 500 / '+s.headingLine+' / '+s.headingTracking],
   ['설명·라벨',s.text+'px / 1.7 · '+s.label+'px / 소형 mono'],
   ['배경·캔버스',t.colors.background+' · '+s.frameSurface],
   ['표면','후보 '+s.candidateSurface+' / 프롬프트 '+s.panelSurface+' / 속성 '+s.refineSurface],
   ['모서리·깊이','캔버스 '+s.frameRadius+'px / 후보 '+s.candidateRadius+'px / 프롬프트 '+s.composerRadius+'px / 속성 '+s.inspectorRadius+'px; 그림자 '+s.frameShadow],
   ['강조·버튼·초점',s.blue+' · '+s.actionBlue+' / 흰 글자 대비 5.22:1 · '+t.colors.focus]
  ]):rows([
   ['폰트',s.fontBody],
   ['제목·본문','clamp(24px,2.35cqw,29px)/740 · '+s.type.body+'px'],
   ['지표·라벨',s.type.metricValue+'px/730 · '+s.type.caption+'px'],
   ['배경·표면',s.material.canvas+' · '+s.material.surface+' · 1px '+s.material.line],
   ['본문·민트',s.material.ink+' · '+s.material.accent+' (선택·진척)'],
   ['표면 반경','지표 '+s.material.metricRadius+'px / 업무 모듈 '+s.material.panelRadius+'px / 표 '+s.material.tableRadius+'px / 리뷰 '+s.material.meetingRadius+'px'],
   ['모듈',s.material.panelPadding+'px padding / '+s.material.panelShadow]
  ]);
  const responsive=ai?rows([
   ['태블릿',s.tabletBreakpoint+'px 이하 후보 '+s.tabletCandidateWidth+'px / 속성 '+s.tabletPropertyWidth+'px / 제목 36px'],
   ['모바일',s.breakpoint+'px 이하 제목 '+s.mobileTitle+'px / 프레임 '+s.mobileFrame+'px / 프리뷰 '+s.mobilePreview+'px'],
   ['순서','프리뷰 → 가로 후보 '+s.mobileChoiceHeight+'px → 프롬프트 → 속성']
  ]):rows([
   ['태블릿',s.tabletBreakpoint+'px 이하 2열'],
   ['모바일',s.mobileBreakpoint+'px 이하 1열 / 바깥 '+s.mobilePadding+'px'],
   ['순서','차트 → 작업 표 → 일정·최근 파일 → 진척 → 리뷰'],
   ['모바일 높이','지표 '+s.mobileKpiHeight+'px / 차트 '+s.mobileChartHeight+'px / 작업 행 최소 '+s.mobileRowHeight+'px']
  ]);
  const states=ai?rows([
   ['입력','8–120자; 오류 aria-invalid·문구; 유효한 지시는 현재 방향에 반영'],
   ['선택','오브젝트·포스터 aria-selected / 후보 '+s.choiceCount+'개 aria-pressed'],
   ['광원',s.lightMin+'–'+s.lightMax+'%; 기본 '+s.lightDefault+'%'],
   ['처리','대기 → 진행 → 완료; 진행 중 중복 실행·후보 선택 차단'],
   ['검토','native dialog / Escape / 초점 복귀']
  ]):rows([
   ['데이터',t.data.tasks.length+'개 샘플 업무를 필터·차트·목록·일정에 공통 적용'],
   ['선택','기간 aria-selected / 작업·날짜·필터 aria-pressed'],
   ['차트','막대 hover·focus·touch·click; 방향키·Home·End / Escape 해제'],
   ['표','5열; 작업 행 선택→하단 '+s.taskDetailHeight+'px 요약, 검토 버튼→dialog'],
   ['정렬','마감일순·상태순; 유효한 작업 선택 유지'],
   ['파일','최근 파일은 로컬 고정 샘플; 필터 집계 대상 아님'],
   ['검토','native dialog / Escape / 초점 복귀']
  ]);
  const extraMotion=ai?rows([
   ['생성',t.motion.records.process.duration+'ms 진행 후 제품 blur('+s.revealBlur+'px)→0 / scale('+s.revealScale+')→1 / '+s.revealDuration+'ms'],
   ['후보',s.revealDelay+'ms 순차; 변형은 선택 후보 유지'],
   ['선택','후보·모드 '+s.selectionDuration+'ms / y 8→0; 중복 생성 무시']
  ]):rows([
   ['차트','기존 막대 높이→새 높이 / '+s.chartMorphDuration+'ms / 막대별 '+s.chartMorphDelay+'ms'],
   ['동기화','축·건수·툴팁 갱신; 중간 입력은 이전 전환 취소']
  ]);
  return [
   ['구획·정렬',layout],
   ['타이포·표면',typeSurface],
   ['반응형',responsive],
   ['상태·접근성',states],
   ['모션 사양',extraMotion+'\n'+rows(motionRows)+'\n관찰 속도 0.25×는 기본 시간의 4배'],
   ['토큰 원본',JSON.stringify(s,null,2)],
   ['출처·전제',sourceRows]
  ];
 }
 return [
  ['구성',rows([['용도',item.use],['동작',item.behavior]])],
  ['규격·표면',rows([
   ['컨테이너',t.layout.max+'px 최대 / '+t.layout.padding+'px 바깥 / '+t.layout.gap+'px 간격'],
   ['요소',t.element.height+'px 제어 / '+t.element.padding+'px 좌우 / '+t.element.controlRadius+'px 반경'],
   ['색',t.colors.surface+' 표면 / '+t.colors.text+' 본문 / '+t.colors.accent+' 강조 / 1px '+t.colors.border+' 경계'],
   ['상태',t.colors.focus+' 초점 / '+t.colors.disabled+' 비활성']
  ])],
  ['반응형·접근성',rows([
   ['모바일',t.layout.breakpoint+'px 이하 1열 / 바깥 '+t.layout.mobilePadding+'px'],
   ['카드·상세','compact '+presentation.compact.height+'px; 전체는 실제 폭으로 재배치'],
   ['키보드','Tab·화살표·Home·End / focus 3px / dialog Escape·초점 복귀'],
   ['자동 시연','보이는 비입력 카드 1회; 사용자 조작·화면 숨김 시 정지']
  ])],
  ['모션 사양',rows(motionRows)+'\n관찰 속도 0.25×는 기본 시간의 4배; 반복 없음'],
  ['토큰 원본',JSON.stringify(s,null,2)],
  ['출처·전제',sourceRows]
 ];
}
export function promptFor(item){const t=themeFor(item);return `기존 프로젝트의 프레임워크·라우팅·데이터와 이벤트를 확인하고 유지하면서 ${item.name}을 구현하세요. ${item.use}\n\n${detailRules(item).map(([h,v])=>`## ${h}\n${v}`).join('\n\n')}\n\n## 화면 구성\n${t.composition}\n\n## 토큰과 적용 우선순위\n대표 화면은 scene(및 scene.material)의 전용 배치·재질 수치가 공통 layout·element·material보다 우선합니다. 개별 구성요소에는 공통 colors·material·element 값을 적용하고, 해당 요소의 실제 상태·모션 명세를 따르세요. 같은 이름의 공통 토큰을 대표 화면의 패널에 기계적으로 적용하지 마세요.\n${JSON.stringify({colors:t.colors,material:t.material,type:t.type,layout:t.layout,scene:t.scene,presentation,element:t.element,motion:item.motion},null,2)}\n\n${t.data?'## 샘플 데이터\n'+JSON.stringify(t.data,null,2):`ARC 휴대용 스피커의 자체 제작 SVG. 후보 ${t.scene.choiceCount}개, 오브젝트/포스터 선택, 광원 ${t.scene.lightMin}–${t.scene.lightMax}%(기본 ${t.scene.lightDefault}%), 8–120자 지시, ${t.motion.records.process.duration}ms 로컬 생성과 검토. 후보 선택은 미리보기의 색상·위치를 바꾸고 변형은 선택한 후보를 유지한다.`}\n\n금지: A/B 원본 로고·문구·이미지 무단 복제, 가져온 C MIT 코드의 출처/허가문 제거, 외부 URL 자동 분석, 로그인·서버 요청, 무한 자동재생, 사용자 조작 후 자동 개입, 전역 CSS 오염, 축소만 한 모바일. 390×844/1024×768/1440×900px, 키보드·빠른 반복·초기화·reduced-motion을 검증하고 미확인 사항은 명시하세요. 코드는 필수 토큰·스타일·동작을 포함한 단일 HTML로 제공하고, 제3자 MIT 코드가 포함되면 저작권·허가문도 함께 제공하세요.`;}
