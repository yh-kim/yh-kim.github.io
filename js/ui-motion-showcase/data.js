import {themes, elementsFor, colorLabels} from '../ui-motion-guide/themes.js?v=20261016-r2';
export {themes};
export const presentation={compact:{height:380,padding:16}};
export const kinds={all:'전체',screen:'완성 화면',panel:'패널',selection:'선택·전환',feedback:'처리·피드백',data:'목록·차트',calendar:'일정',form:'입력'};
const descriptions={
 'dark-ai/hero':['Dark AI Workspace','빛과 겹친 레이어 안에서 아이디어를 생성하세요.','screen','scene'],
 'light-project/hero':['Light Project Dashboard','같은 업무 데이터로 연결된 지표와 일정.','screen','scene'],
 'dark-ai/process':['생성 중에서 결과까지','단계가 채워지고, 결과가 선명해지는 순간.','feedback','process'],
 'dark-ai/layers':['앞뒤를 지키는 패널','뒤 레이어부터 차례로 자리 잡는 작업 공간.','panel','depth'],
 'light-project/chart':['주간에서 누적으로','같은 작업의 분포를 막대와 수치로 비교하세요.','data','bars'],
 'dark-ai/controls':['고르면 바뀌는 프리뷰','오브젝트와 포스터, 하나의 형태가 다른 장면으로.','selection','tilt'],
 'light-project/tasks':['업무를 열어보는 흐름','선택한 행 옆으로 나타나는 작업 상세.','panel','slide'],
 'light-project/filters':['필터와 함께 다시 정렬','목록, 개수와 완료율이 함께 바뀝니다.','data','reflow'],
 'light-project/calendar':['날짜에서 업무로','선택 날짜의 일정이 한 장씩 펼쳐집니다.','calendar','clip'],
 'dark-ai/beam':['선택한 곳에만 빛','잠깐의 광원으로 현재 위치를 짚어주세요.','selection','beam'],
 'dark-ai/prompt':['지시를 확인하는 입력','짧은 오류, 명확한 성공. 전송 없는 입력 체험.','form','feedback'],
 'light-project/quick-add':['작업 하나를 더하면','추가한 업무가 목록과 지표에 바로 반영됩니다.','form','insert']
};
const motionText={
 scene:['대표 화면 조작·다시 재생','선택한 화면의 프리뷰·차트','각 기능의 최종 상태','동작별 상태로 전환'],
 process:['생성 시작','진행 막대 → 단계 → 결과','scaleX(0), 결과 blur(8px)/scale(.98)','scaleX(1), 결과 blur(0)/scale(1)'],
 depth:['재생·화면 진입 1회','뒤 정보 패널 → 프리뷰 → 앞 제어부','translateY(18px), scale(.97), opacity 0','원래 회전·배치, scale(1), opacity 1'],
 bars:['주간/누적 탭 변경','마감일별 차트 막대','scaleY(0)','scaleY(1), 데이터별 높이'],
 tilt:['오브젝트/포스터 선택','결과 프리뷰','rotate(-3deg) scale(.96)','rotate(0deg) scale(1)'],
 slide:['작업 행 선택','선택 작업 상세 패널','translateX(24px)','translateX(0)'],
 reflow:['상태 필터 선택','목록 높이와 남은 행','기존 목록 높이, 행 translateY(12px)','새 목록 높이, 행 translateY(0)'],
 clip:['날짜 선택','해당 날짜 일정','clip-path inset(0 0 100% 0)','clip-path inset(0 0 0 0)'],
 beam:['제어 타일 선택','선택 경계 광원','그림자 0px','그림자 28px → 0px, 선택 경계 유지'],
 feedback:['유효/오류 입력 제출','성공 메시지 / 오류 입력','성공 clip-path inset(0 100% 0 0) / 오류 X 0','성공 inset(0) / 오류 X -4→4→0px'],
 insert:['유효한 작업 추가','갱신 목록','translateY(-12px)','translateY(0), 선택한 새 행 강조']
};
const ordered=Object.entries(descriptions).map(([id,[name,description,kind,technique]],i)=>{
 const [themeId,key]=id.split('/'),theme=themes.find(t=>t.id===themeId),element=elementsFor(theme).find(e=>e.id===key),base=theme.motion.records[key];
 const [trigger,target,from,to]=motionText[technique];
 return {id:id.replace('/','--'),number:String(i+1).padStart(2,'0'),themeId,key,name,description,kind,use:element?.use||theme.intent,behavior:key==='filters'?'목록과 지표가 같은 필터를 적용합니다. 선택한 작업이 사라지면 첫 결과를 선택합니다. 대표 화면에서는 같은 필터가 차트와 일정에도 연결됩니다.':element?.behavior||theme.composition,
 motion:{technique,trigger,target,from,to,duration:base?.duration||theme.motion.duration,ease:theme.motion.ease,delay:['depth','bars'].includes(technique)?theme.motion.stagger:technique==='reflow'?30:0,resultDuration:theme.motion.duration,errorDuration:theme.motion.close},
 auto:technique==='process'?[{at:300,action:'generate'}]:technique==='scene'?themeId==='dark-ai'?[{at:300,selector:'[data-mode="poster"]'},{at:1300,selector:'[data-mode="object"]'}]:[{at:300,selector:'[data-period="cumulative"]'},{at:1300,selector:'[data-period="week"]'}]:technique==='depth'?[{at:300,action:'play'}]:technique==='bars'?[{at:300,selector:'[data-period="cumulative"]'},{at:1300,selector:'[data-period="week"]'}]:technique==='tilt'?[{at:300,selector:'[data-mode="poster"]'},{at:1300,selector:'[data-mode="object"]'}]:technique==='slide'?[{at:300,selector:'[data-task="T-03"]'}]:technique==='reflow'?[{at:300,selector:'[data-filter="done"]'},{at:1500,selector:'[data-filter="all"]'}]:technique==='clip'?[{at:300,selector:'[data-date="18"]'}]:technique==='beam'?[{at:300,selector:'[data-beam="1"]'}]:[]};
});
// Ordered after the three-example layout and visual review.
export const catalog=ordered;
export const fullCatalog=ordered;
export const themeFor=item=>themes.find(t=>t.id===item.themeId);
export function detailRules(item){const t=themeFor(item),m=item.motion;return [
 ['이 예시의 동작',item.behavior+(item.key==='quick-add'?' 다시 재생은 중복되지 않는 체험 작업을 하나 추가하며 초기화는 최초 6개 업무로 되돌립니다.':'')],
 ['색과 표면',Object.entries(t.colors).map(([k,v])=>`${colorLabels[k]} ${v}`).join(' · ')],
 ['재료와 레이어',`패널 padding ${t.element.panelPadding}px, radius ${t.element.radius}px, 경계 ${t.element.border}px, shadow ${t.element.shadow}. ${Object.entries(t.material).map(([key,value])=>key+': '+value).join(' · ')}. ${t.id==='dark-ai'?'뒤 패널 → 결과 → 제어부 순서. 대표 화면의 얇은 점 격자 14px, 제어 패널 backdrop blur 18px.':'표면·모듈 경계·선택선으로 깊이를 구분합니다. 민트는 선택·진척에 사용합니다.'}`],
 ['타이포',`${t.type.body}. 본문 ${t.type.size}px/${t.type.line}, 제목 ${t.type.title}px/${t.type.weight}/${t.type.titleLine}, 자간 ${t.type.tracking}. 한글 keep-all + anywhere. 카드에서 전체 화면을 축소하지 않고 핵심 영역만 보입니다.`],
 ['크기와 반응형',`full 최대 ${t.layout.max}px, padding ${t.layout.padding}px(작은 화면 ${t.layout.mobilePadding}px), gap ${t.layout.gap}px. 컨테이너 ${t.layout.breakpoint}px 이하 한 열. 카드 compact 높이 ${presentation.compact.height}px, padding ${presentation.compact.padding}px, 조작 목표 ${t.element.height}px. 갤러리는 1100px부터 3열/680px부터 2열/그 미만 1열. 상세는 800px부터 데모+320px 설명, 그 미만 한 열·설명 접힘.`],
 ['요소와 상태',`표준 버튼 높이 ${t.element.height}px, padding 10px ${t.element.padding}px, radius ${t.element.controlRadius}px, 1px ${t.colors.border}. focus 3px ${t.colors.focus}/offset 3px. disabled ${t.colors.disabled}/${t.colors.onDisabled}. 입력은 라벨·오류/성공 문구·aria-invalid. Hover ${t.colors.hover}, active translateY(1px).`],
 ['모션 사양',`${item.key==='hero'?(t.id==='dark-ai'?`복합 화면: 모드 전환 ${t.motion.duration}ms, 생성 ${t.motion.records.process.duration}ms + 결과 ${t.motion.duration}ms, 검토 열기 ${t.motion.records.dialog.duration}ms / 닫기 ${t.motion.close}ms.\n`:`복합 화면: 차트 ${t.motion.records.chart.duration}ms / 지연 ${t.motion.records.chart.delay}ms, 선택·필터·일정 ${t.motion.duration}ms, 검토 닫기 ${t.motion.close}ms.\n`):''}trigger: ${m.trigger}\n대상: ${m.target}\n시작: ${m.from}\n종료: ${m.to}\nduration: ${m.duration}ms${m.technique==='process'?` + 결과 ${m.resultDuration}ms`:''}${m.technique==='feedback'?` / 오류 ${m.errorDuration}ms`:''}\neasing: ${m.ease}\ndelay: ${m.delay}ms(순서별)\n반복 없음. 재생은 기존 실행을 취소하고 처음부터. 정지 중 새 선택은 최종 상태. 0.25× 관찰은 duration/delay 4배이며 기본 사양과 다릅니다.`],
 ['자동 시연과 접근성','보이는 비입력 카드만 1회 시연하며 400ms 간격으로 시연을 시작하고 무한 반복하지 않습니다. 입력 예시는 직접 제출합니다. 첫 pointer/keyboard/input 조작 후 해당 카드의 자동 시연은 종료됩니다. 화면 밖·문서 숨김에서는 정지합니다. 동작 줄이기는 이동 없이 최종 상태. 탭은 화살표/Home/End, native dialog는 Esc·초점 가두기·복귀. 상세 열기 시 배경 스크롤 잠금과 원래 목록 위치 복원.'],
 ['출처와 전제',`${t.source} A/B 모션은 정지 이미지에서 미확인. 이 디자인에 맞춰 설계한 구현 예시이며 원본 복원이 아닙니다. 로컬 샘플 데이터·현재 브라우저 ES modules/Shadow DOM/dialog/WAAPI/IntersectionObserver. 서버·외부 라이브러리·API키·웹폰트 요청 없음.`]
 ];}
export function promptFor(item){const t=themeFor(item);return `기존 프로젝트의 프레임워크·라우팅·데이터와 이벤트를 확인하고 유지하면서 ${item.name}을 구현하세요. ${item.use}\n\n${detailRules(item).map(([h,v])=>`## ${h}\n${v}`).join('\n\n')}\n\n## 화면 구성\n${t.composition}\n\n## 모든 공통 토큰\n${JSON.stringify({colors:t.colors,material:t.material,type:t.type,layout:t.layout,presentation,element:t.element,motion:item.motion},null,2)}\n\n${t.data?'## 샘플 데이터\n'+JSON.stringify(t.data,null,2):'FRAME / 로컬 창작 실험실. 파란 고리 조형물 CSS 미리보기, 오브젝트/포스터 선택, 8–120자 입력, 로컬 생성과 검토.'}\n\n금지: 원본 로고/문구/이미지/소스 복제, 외부 URL 자동 분석, 로그인·서버 요청, 무한 자동재생, 사용자 조작 후 자동 개입, 전역 CSS 오염, 축소만 한 모바일. 360/768/1440px, 키보드·빠른 반복·초기화·reduced-motion을 검증하고 미확인 사항은 명시하세요. 코드는 필수 토큰·스타일·동작을 포함한 단일 HTML로 제공하세요.`;}
