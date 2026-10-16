// A/B는 정적 시각 자료. 아래 수치는 원본 CSS 실측이 아닌 의도적 재설계다.
const body='"Manrope", "Inter", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
const mono='"SFMono-Regular", Consolas, monospace';
const common={height:44,padding:16,border:1,dialogWidth:500,controlRadius:10,panelPadding:20};
export const themes=[{
 id:'dark-ai',name:'Dark AI Workspace',number:'01',subtitle:'빛과 레이어로 드러내는 창작의 흐름',intent:'히어로의 여백과 작업 패널의 밀도를 대비시킨 AI 창작 도구. 제어 → 로컬 처리 → 결과 확인의 관계를 체험합니다.',
 colors:{background:'#070C18',surface:'#101B2E',raised:'#182741',text:'#F1F5FF',muted:'#A8B8D4',accent:'#82ACFF',onAccent:'#071426',border:'#344663',soft:'#142441',success:'#8FE6BA',error:'#FFB4AD',focus:'#B5D0FF',hover:'#A9C6FF',disabled:'#26354D',onDisabled:'#AAB9D0'},
 type:{body,display:body,mono,size:14,title:56,mobileTitle:34,weight:600,line:1.6,titleLine:1.05,tracking:'-0.045em'},
 layout:{max:1280,padding:28,mobilePadding:16,gap:20,section:32,columns:'1.1fr 1fr',breakpoint:680},
 element:{...common,radius:18,shadow:'0 24px 72px #00000066'},
 material:{glowCore:'#90C3FF',glowBlue:'#245BE7',glowFalloff:'#0D2254',grid:'#778DAF44',canvas:'#0B1221',preview:'#0C1830',poster:'#101D38',glass:'#182741E8',glassBorder:'#8299C866',orb:'#5091FF',orbHighlight:'#CCE6FFBB',orbShade:'#123ABF',orbGlow:'#498EFF55',beam:'#82ACFF44',lightStrip:'#E6EDFA',stripText:'#142644',stripMuted:'#485B78'},
 motion:{duration:420,ease:'cubic-bezier(.2,.75,.25,1)',y:18,scale:.97,stagger:70,close:180,
 records:{layers:{trigger:'재생·다시 보기',target:'뒤 패널 → 미리보기 → 앞 제어부',from:'opacity 0, translateY 18px, scale .97',to:'opacity 1, translateY 0px, scale 1',duration:420,delay:70,reverse:'초기화는 취소 후 최종 배치. 다시 보기는 기존 실행 취소 후 처음부터.'},controls:{trigger:'작업 선택',target:'창작 결과',from:'opacity 0, translateY 18px, scale .97',to:'opacity 1, translateY 0px, scale 1',duration:420,delay:0,reverse:'새 선택이 기존 전환을 취소하고 최신 작업을 표시.'},process:{trigger:'생성 시작',target:'로컬 처리 진행 막대',from:'scaleX 0',to:'scaleX 1',duration:1800,delay:0,reverse:'초기화는 진행 취소 → 대기. 반복 클릭은 실행 중 무시. 완료 후 재실행 가능.'},beam:{trigger:'강조 영역 선택',target:'선택된 제어 타일의 광원',from:'box-shadow 0 0 0px #82ACFF00',to:'box-shadow 0 0 28px #82ACFF44 → 0 0 0px #82ACFF00',duration:650,delay:0,reverse:'새 선택 시 이전 광원 취소. 선택 테두리는 계속 유지.'},prompt:{trigger:'유효한 폼 제출',target:'상태 문구',from:'opacity 0, translateY 18px, scale .97',to:'opacity 1, translateY 0px, scale 1',duration:420,delay:0,reverse:'입력 변경은 검증 초기화. 오류 시 입력으로 초점 이동.'},dialog:{trigger:'검토 열기·닫기',target:'검토 dialog',from:'opacity 0, translateY 18px, scale .97',to:'opacity 1, translateY 0px, scale 1',duration:420,delay:0,reverse:'닫기는 반대 방향 180ms. 닫는 중 중복 실행 무시, 종료 후 실행 버튼 초점 복귀.'}}},
 composition:'히어로/작업실 1.1:1의 두 구획. 왼쪽은 중앙 정렬 대형 제목, 아래 광원과 밝은 보조 지표 띠. 오른쪽은 격자 캔버스 위 결과 미리보기, 뒤쪽 정보 패널과 앞쪽 제어 패널. 장식 광원은 텍스트 뒤를 피한다. 원본 브랜드·제품 사진 대신 CSS로 직접 만든 고리 조형물을 사용한다.',
 source:'A · Dribbble shot 27748221. 3200×2400 정적 원본을 확대 관찰. 큰 히어로/작은 제어부의 대비, 블루 광원, 격자와 겹침을 참고. 이 구현의 비율·색·간격·모션은 새 설계.'
},{
 id:'light-project',name:'Light Project Dashboard',number:'02',subtitle:'연결된 데이터가 만드는 업무의 질서',intent:'가로 내비게이션과 정렬된 업무 모듈을 갖춘 프로젝트 관리 화면. 필터·작업·일정·차트가 동일한 샘플 작업을 함께 참조합니다.',
 colors:{background:'#F1F4F2',surface:'#FFFFFF',raised:'#E7EDE9',text:'#182B24',muted:'#52645C',accent:'#B8F2CB',onAccent:'#123A25',border:'#C6D2CB',soft:'#EDF5EF',success:'#23643C',error:'#A62D27',focus:'#216B43',hover:'#9DE3B7',disabled:'#E0E7E2',onDisabled:'#59695F'},
 type:{body,display:body,mono,size:14,title:30,mobileTitle:26,weight:650,line:1.6,titleLine:1.2,tracking:'-0.035em'},
 layout:{max:1280,padding:24,mobilePadding:14,gap:16,section:24,columns:'1fr 1fr .85fr',breakpoint:680},
 element:{...common,radius:14,shadow:'0 4px 16px #182B2408'},
 material:{grid:'#EAF0EC',moduleBorder:'#DAE3DC',progress:'#438B5F',agendaBorder:'#6DA880',rowDivider:'#E6ECE8',selectedLine:'#4C9B69',doneSurface:'#DCF4E3',doneText:'#23643C',reviewSurface:'#F6EED5',reviewText:'#705219',meetingSurface:'#182B24',meetingText:'#F1FFF5',meetingMuted:'#BBCDC2'},
 motion:{duration:240,ease:'cubic-bezier(.2,0,.2,1)',y:8,scale:1,stagger:40,close:160,
 records:{tasks:{trigger:'작업 행 선택',target:'선택한 작업 상세',from:'opacity 0, translateY 8px, scale 1',to:'opacity 1, translateY 0px, scale 1',duration:240,delay:0,reverse:'새 선택이 전환 취소 후 최신 상세 표시. 행 선택은 유지.'},filters:{trigger:'상태 필터 선택',target:'작업 목록·차트',from:'opacity 0, translateY 8px, scale 1',to:'opacity 1, translateY 0px, scale 1',duration:240,delay:0,reverse:'필터는 즉시 데이터 갱신. 선택 항목이 사라지면 첫 결과 선택. 빈 결과도 명시.'},chart:{trigger:'주간·누적 탭 선택',target:'차트 막대',from:'scaleY 0',to:'scaleY 1',duration:240,delay:40,reverse:'다음 탭은 진행 중 전환 취소 후 최신 데이터. 누적은 같은 작업의 마감일별 누계.'},calendar:{trigger:'날짜 선택',target:'해당 날짜 일정 목록',from:'opacity 0, translateY 8px, scale 1',to:'opacity 1, translateY 0px, scale 1',duration:240,delay:0,reverse:'다른 날짜 선택 시 이전 전환 취소. 선택된 날짜는 계속 유지.'},'quick-add':{trigger:'유효한 폼 제출',target:'로컬 작업 목록',from:'opacity 0, translateY 8px, scale 1',to:'opacity 1, translateY 0px, scale 1',duration:240,delay:0,reverse:'중복 제목 거부. 데모 초기화 시 추가한 로컬 작업 제거. 입력 초기화는 폼만 비움.'},dialog:{trigger:'작업 검토 열기·닫기',target:'확인 dialog',from:'opacity 0, translateY 8px, scale 1',to:'opacity 1, translateY 0px, scale 1',duration:240,delay:0,reverse:'닫기는 반대 방향 160ms. Esc와 취소 동일, 초점 복귀.'}}},
 composition:'가로 상단 내비게이션 → 인사/필터 → 지표 띠 → 업무 모듈. 큰 화면은 3열(1:1:.85), 차트와 목록은 왼쪽 2열, 일정과 회의는 오른쪽 열. 강조 민트는 선택·막대·진척에만 쓰고 큰 배경은 흰색/옅은 회색. 통계·선택 상세·일정은 같은 6개 샘플 작업에서 파생한다.',
 source:'B · Behance project 251693759. 1400×1907 커버의 노트북 UI와 1400×3835 캘린더/타이포 모듈 확대 관찰. 실제 상단 가로 메뉴·3개 지표·차트·목록·오른쪽 보조 패널을 참고. 원본 Manrope·팔레트 표기는 확인했지만 아래 토큰과 레이아웃은 독립 재설계.'
}];
// Shared entrance values are derived once; records are the documented run settings.
for(const t of themes){
 for(const [key,m] of Object.entries(t.motion.records)){
  if(!['process','beam','chart'].includes(key)){
   m.from=`opacity 0, translateY ${t.motion.y}px, scale ${t.motion.scale}`;
   m.to='opacity 1, translateY 0px, scale 1';
   m.duration=t.motion.duration;
  }
  if(key==='chart')m.duration=t.motion.duration;
  if(key==='layers'||key==='chart')m.delay=t.motion.stagger;
 }
}
export const projectData={name:'Orbit 웹사이트 개편',month:'2026년 10월',dates:[16,17,18,19],tasks:[
 {id:'T-01',title:'브랜드 방향 정리',owner:'서윤',initial:'SY',status:'done',date:16,category:'리서치',detail:'핵심 메시지와 시각 방향을 팀과 합의합니다.'},
 {id:'T-02',title:'히어로 프로토타입',owner:'지호',initial:'JH',status:'active',date:16,category:'디자인',detail:'모바일과 데스크톱 히어로의 위계를 검토합니다.'},
 {id:'T-03',title:'컴포넌트 접근성',owner:'민서',initial:'MS',status:'review',date:17,category:'개발',detail:'초점 순서, 대비와 키보드 상태를 확인합니다.'},
 {id:'T-04',title:'프로젝트 썸네일',owner:'서윤',initial:'SY',status:'done',date:18,category:'디자인',detail:'이미지 비율과 대체 텍스트를 함께 정리합니다.'},
 {id:'T-05',title:'태블릿 레이아웃',owner:'지호',initial:'JH',status:'active',date:18,category:'개발',detail:'업무 모듈의 두 열 전환을 조정합니다.'},
 {id:'T-06',title:'릴리스 체크리스트',owner:'민서',initial:'MS',status:'active',date:19,category:'검토',detail:'링크와 자산 경로, 정적 빌드를 확인합니다.'}
]};
themes[1].data=projectData;
const definitions={
 'dark-ai':[
 ['layers','겹친 패널의 등장','창작 도구의 앞뒤 관계를 보존하며 작업 맥락을 소개합니다.','뒤쪽 메타 패널 → 조형물 미리보기 → 앞쪽 제어 패널. 재생·일시정지·다시 보기·초기화, 0.25× 관찰을 지원합니다.'],
 ['controls','작업과 미리보기 연결','선택이 무엇을 바꾸는지 결과와 가까운 위치에서 확인합니다.','오브젝트/포스터 탭이 결과 배치와 라벨을 함께 바꿉니다. 화살표/Home/End 조작을 지원합니다.'],
 ['process','대기 → 처리 → 완료','AI 작업의 피드백과 중복 실행 방지에 적합합니다.','실행 중 생성 버튼은 실제 disabled. 진행·일시정지·재생·초기화가 로컬에서 동작하며 네트워크 호출은 없습니다.'],
 ['beam','선택을 따라가는 빛','작은 제어부의 활성 위치를 얇은 경계와 한 번의 광원으로 짚습니다.','선택 시에만 1회 광원. 터치/키보드 동일. hover/focus/active/disabled 상태 선택기로 비교합니다.'],
 ['prompt','프롬프트 입력과 검증','짧은 작업 지시를 오류·성공과 연결합니다.','8–120자. 빈 값/짧은 값은 오류, 유효한 값은 로컬 성공. 입력 중 오류 해제, 초기화 지원.'],
 ['dialog','결과 검토 다이얼로그','생성 결과를 확정하기 전에 맥락을 한 번 좁힙니다.','native dialog, Esc·취소·바깥 클릭, 닫은 뒤 실행 버튼 초점 복귀. 완료는 로컬 상태입니다.']
 ],'light-project':[
 ['tasks','작업 선택과 상세','행·담당자·마감일·상태가 이어지는 업무 탐색.','행 선택 시 옆/아래 상세를 갱신합니다. 행은 버튼이라 Enter/Space로 조작하며 현재 선택을 aria-pressed로 알립니다.'],
 ['filters','필터와 연결된 지표','전체/진행·검토 중/완료가 하나의 데이터 집합을 필터합니다.','목록 수·완료율·차트가 같은 필터를 적용합니다. 선택한 작업이 사라지면 첫 작업을 선택합니다.'],
 ['chart','기간과 차트 전환','마감일별 작업 분포와 같은 데이터의 누적 분포를 비교합니다.','주간/누적 탭은 표와 차트를 함께 바꿉니다. 막대는 0에서 목표 비율로 등장, 수치는 텍스트로 항상 제공.'],
 ['calendar','날짜와 일정 연결','업무의 마감 날짜와 목록을 함께 살펴봅니다.','16–19일 선택 시 해당 날짜의 같은 작업을 표시합니다. 선택 표시와 일정 문구를 함께 제공.'],
 ['quick-add','로컬 작업 추가','작은 폼이 목록과 지표에 영향을 주는 흐름.','3–40자, 중복 제목 오류. 추가 작업은 19일/진행 중/나 담당으로 같은 메모리 데이터에 반영. 초기화로 제거.'],
 ['dialog','작업 검토와 확인','중요한 변경 직전 내용을 한 번 확인합니다.','현재 선택 작업을 dialog에서 확인. 실제 저장·전송 없음. 키보드 초점 가두기·Esc·복귀 지원.']
 ]};
export function elementsFor(t){return definitions[t.id].map(([id,name,use,behavior])=>({id,name,use,behavior,motionKey:id}));}
export const colorLabels={background:'페이지 배경',surface:'기본 표면',raised:'높은 표면',text:'본문',muted:'보조 문구',accent:'선택·주요 행동',onAccent:'강조 위 글자',border:'경계',soft:'보조 표면',success:'성공',error:'오류',focus:'키보드 초점',hover:'Hover 배경',disabled:'비활성 배경',onDisabled:'비활성 글자'};
export function spec(t,key){const e=elementsFor(t).find(e=>e.id===key),m=t.motion.records[key];return `${e?e.behavior:t.composition}\n\n공통: 제어 높이 ${t.element.height}px, 좌우 padding ${t.element.padding}px, 버튼 모서리 ${t.element.controlRadius}px / 컨테이너 ${t.element.radius}px, border ${t.element.border}px ${t.colors.border}, 그림자 ${t.element.shadow}. 표면 ${t.colors.surface}, 본문 ${t.colors.text}, 보조 ${t.colors.muted}. hover ${t.colors.hover}, active translateY(1px), disabled ${t.colors.disabled}/${t.colors.onDisabled}. focus 3px ${t.colors.focus}, offset 3px. 표준 버튼 상하 padding 10px; 모션 제어는 8px 12px, AI 작업 탭은 8px 11px. 패널 padding ${t.element.panelPadding}px.\n${m?motionSpec(t,m):Object.entries(t.motion.records).map(([k,v])=>`${k}: ${motionSpec(t,v)}`).join('\n')}\n컨테이너 ${t.layout.breakpoint}px 이하: 한 열, 패널은 겹침 해제, 제목 ${t.type.mobileTitle}px. 681–980px 대시보드는 2열, 981px 이상 3열. 본문은 강제 스크롤 없음.\n모션은 이 디자인에 맞춰 새로 설계했으며 원본 모션 실측이 아닙니다.`;}
function motionSpec(t,m){return `trigger ${m.trigger}; 대상 ${m.target}; ${m.from} → ${m.to}; duration ${m.duration}ms; easing ${t.motion.ease}; delay ${m.delay}ms(순서별). ${m.reverse} 반복 없음. 화면 밖/문서 숨김은 정지 후 보일 때 이어 재생, 사용자 일시정지는 유지하며, 정지 중 새 선택은 최종 상태로 즉시 표시. 닫기 도중 문서가 숨겨지면 즉시 닫힘. 0.25×는 duration/delay 4배의 관찰 모드. reduced-motion은 중간 이동 없이 최종 상태 즉시 표시.`;}
export function design(t){return `# ${t.name} / DESIGN\n\n${t.intent}\n\n## 출처와 확인 수준\n${t.source}\nA/B는 정적 포트폴리오 이미지로 모션 시간/easing 미확인. 구현 수치 전체는 의도적 재설계. C는 데모 탐색·반복 체험·프롬프트/코드 복사 흐름만 참고. 원본 로고·문구·이미지·코드 사용 없음.\n\n## 색상 역할\n${Object.entries(t.colors).map(([k,v])=>`${k} / ${colorLabels[k]}: ${v}`).join('\n')}\n\n## 재료와 레이어\n${Object.entries(t.material).map(([k,v])=>`${k}: ${v}`).join('\n')}\n${t.id==='dark-ai'?'광원 ellipse 130% 35%, 중심 50% 77%, 밝은 중심 0%/블루 34%/감쇠 63%/배경 100%. 격자 14px, 점 .7px. 앞 제어 패널은 glass 색상, blur 18px, 위로 30px 겹침. 히어로 강조는 Georgia/serif italic 1.03em/line-height 1.':'모듈은 얇은 moduleBorder, 표면 그림자와 선택 상태선으로 위계를 만든다. 선택 영역 외 큰 민트 배경 금지. 차트 높이 120px, 작업 행 최소 62px, 대표 목록 최대 240px 내부 스크롤. 작업 상세는 선택 행 아래 배치.'}\n\n## 타이포그래피\n본문/제목 ${t.type.body}; 수치 ${t.type.mono}. 설치된 폰트 순서대로 사용, 외부 폰트 요청 없음. 본문 ${t.type.size}px/400/${t.type.line}. 제목 ${t.type.title}px/${t.type.weight}/${t.type.titleLine}/${t.type.tracking}; 모바일 ${t.type.mobileTitle}px. 패널 제목 18px/600, 메타 12px/500/1.6. 한글 word-break:keep-all; overflow-wrap:anywhere.\n\n## 배치\n${t.composition}\n최대 ${t.layout.max}px, 바깥 padding ${t.layout.padding}px/모바일 ${t.layout.mobilePadding}px, gap ${t.layout.gap}px, 히어로 구획 간격 ${t.layout.section}px. 기준은 뷰포트가 아닌 데모 컨테이너. ${t.layout.breakpoint}px 이하 한 열, 광원/패널 겹침 해제. 대시보드 681–980px 두 열, 981px 이상 세 열. inline에서는 실제 글 너비에 맞추고 확장 dialog는 최대 1280px/95vw.\n\n## 요소·상태·모션\n${elementsFor(t).map(e=>`### ${e.name}\n${e.use}\n${spec(t,e.id)}`).join('\n\n')}\n\n## 접근성\n제어 목표 최소 44px. 키보드 focus 3px/offset 3px. 탭은 좌우/Home/End, 선택 탭만 tabindex=0. dialog.showModal로 배경 비활성·초점 가두기, Esc/취소/바깥 클릭, 실행 버튼으로 복귀. 입력 라벨·오류 문구·aria-invalid·aria-live. 숫자 차트는 동등한 텍스트 표. 상태는 색+문구. OS prefers-reduced-motion과 체험 체크박스가 이동을 생략. 애니메이션은 사용자 재생만, 무한 반복 없음.\n\n## 전제와 금지사항\n최신 브라우저, ES modules/Shadow DOM/dialog/WAAPI/IntersectionObserver/container queries. 서버·DB·API키·라이브러리·웹폰트 의존성 없음. 모든 데이터는 메모리의 샘플, 새로고침 시 초기화. 원본 제휴/공식 구현 표기, 원본 자산 복제, 임의 URL 분석, 무한 광원 반복, 전체 스크롤 가로채기, 전역 CSS·라우팅 변경 금지. 작은 글씨 대비 4.5:1 이상, focus 3:1 이상 유지.\n`;}
export function prompt(t,key='theme'){const e=elementsFor(t).find(e=>e.id===key);return `기존 프로젝트 구조와 데이터·이벤트·라우팅을 먼저 확인하고 유지하면서 ${t.name}의 ${e?e.name:key==='hero'?'대표 화면':'전체 화면과 6개 상호작용 요소'}를 구현하세요. 다음 명세는 외부 링크 없이 이해할 수 있는 독립적인 구현 지시입니다. CSS/JS를 컴포넌트 안에 격리하세요.\n\n${design(t)}\n${t.id==='dark-ai'?'대표 콘텐츠: FRAME 창작 실험실. “작은 생각을, 다음 장면으로.” 오브젝트/포스터 선택, CSS 고리 조형물 미리보기, 8–120자 입력, 생성 시 1800ms 로컬 진행, 완료 결과 검토. 프롬프트와 작은 제어부는 결과와 함께 보이게 배치.':'대표 콘텐츠: Orbit 웹사이트 개편. 개요/작업/일정 가로 메뉴. 전체/진행·검토 중/완료 필터 → 지표/차트/목록 동시 갱신. 작업 행 선택 → 상세. 16–19일 → 같은 작업의 일정. 주간/누적 차트. 로컬 작업 추가. 샘플 데이터: '+JSON.stringify(projectData)}\n${e?'이번 요소의 필수 동작: '+e.behavior+'\n'+spec(t,key):''}\n완성 조건: 360/768/1440px에서 실제 재배치, 빠른 반복 클릭, 초기화, reduced-motion, 키보드, 초점 복귀, 필터/차트 수치와 데이터 일치. 원본 모션 복원을 주장하지 마세요. 검증하지 못한 항목은 명시하세요.\n코드는 공통 토큰·스타일·동작이 들어간 단일 HTML로 제공하고 부분 코드를 완성본처럼 표시하지 마세요.`;}
