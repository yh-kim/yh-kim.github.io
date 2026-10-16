// 이 가이드에서 의도적으로 설계한 값. 참고 사이트의 실측값이 아니다.
export const themes = [{
  id: 'warm', name: 'Warm Minimal', subtitle: '여백으로 만드는 편안한 집중', number: '01',
  intent: '차분한 예약 서비스, 라이프스타일 브랜드, 작은 스튜디오에 적합합니다. 정보 사이에 숨 쉴 공간을 두고 필요한 행동 하나만 강조합니다.',
  colors: { background:'#F4F0E8', surface:'#FFFCF7', text:'#302D27', muted:'#696259', accent:'#66533C', onAccent:'#FFFFFF', border:'#B0A698', soft:'#E8E0D3', success:'#276047', error:'#A02E35', focus:'#775312', hover:'#4E3E2B', disabled:'#D8D2C8', onDisabled:'#5C554C' },
  type: { body:'"Avenir Next", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif', display:'"Avenir Next", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif', mono:'"SFMono-Regular", Consolas, monospace', size:15, title:40, mobileTitle:30, weight:500, line:1.75, titleLine:1.2, tracking:'-0.035em' },
  layout:{ max:1040, padding:32, mobilePadding:20, gap:28, section:48, columns:'1.1fr 1fr', breakpoint:600, imageOrder:'after' },
  element:{ height:48, padding:20, radius:16, border:1, shadow:'0 8px 24px #302d270d', hoverY:-2, press:1, disabledOpacity:1, cardPadding:24, imageRadius:12, imageFilter:'saturate(.65)', tabStyle:'pill', dialogWidth:440 },
  motion:{ duration:320, ease:'cubic-bezier(.2,.7,.2,1)', y:12, scale:0.98, stagger:70, tabX:0, close:180 },
  layoutNote:'대표 화면은 글/그림 1.1:1, 갤러리 카드는 세로형. 이미지는 낮은 채도와 12px 모서리, 제목은 500 두께. 그림자보다 여백을 먼저 사용합니다.'
}, {
  id: 'editorial', name: 'Editorial', subtitle: '활자와 장면의 명확한 순서', number: '02',
  intent: '문화 공간, 매거진, 사진 중심의 서비스에 적합합니다. 큰 세리프 제목과 절제된 선으로 읽는 순서를 만들고, 이미지를 기사처럼 다룹니다.',
  colors: { background:'#F5F1E7', surface:'#FFFCF5', text:'#261F1A', muted:'#60574F', accent:'#6F2F32', onAccent:'#FFFFFF', border:'#9F8F7D', soft:'#E8DDD0', success:'#245A42', error:'#A22C31', focus:'#6F2F32', hover:'#512125', disabled:'#D6CEC1', onDisabled:'#4E443C' },
  type: { body:'"Helvetica Neue", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif', display:'"Iowan Old Style", Baskerville, "Times New Roman", "Noto Serif KR", serif', mono:'"SFMono-Regular", Consolas, monospace', size:15, title:44, mobileTitle:32, weight:400, line:1.8, titleLine:1.12, tracking:'-0.045em' },
  layout:{ max:1020, padding:30, mobilePadding:18, gap:32, section:42, columns:'0.82fr 1.18fr', breakpoint:620, imageOrder:'before' },
  element:{ height:50, padding:24, radius:2, border:1, shadow:'none', hoverY:-1, press:1, disabledOpacity:1, cardPadding:22, imageRadius:0, imageFilter:'grayscale(.25) sepia(.18) contrast(1.08)', tabStyle:'underline', dialogWidth:480 },
  motion:{ duration:220, ease:'cubic-bezier(.22,.61,.36,1)', y:6, scale:1, stagger:80, tabX:4, close:160 },
  layoutNote:'넓은 화면에서 이미지는 왼쪽 0.82, 본문은 오른쪽 1.18 비율로 배치합니다. 작은 화면에서는 읽기 순서를 위해 본문 다음에 그림을 둡니다. 사진처럼 약한 흑백·세피아 처리를 하고, 작은 모서리와 수평선을 사용하며 그림자는 쓰지 않습니다.'
}, {
  id: 'technical', name: 'Technical', subtitle: '상태와 구조가 먼저 보이는 화면', number: '03',
  intent: '개발 도구, 분석 화면, 예약 관리 콘솔에 적합합니다. 촘촘한 그리드와 모노스페이스 라벨을 써서 위치·상태·행동을 빠르게 구분합니다.',
  colors: { background:'#E9EEF0', surface:'#FFFFFF', text:'#17232A', muted:'#43525B', accent:'#07526A', onAccent:'#FFFFFF', border:'#70828A', soft:'#DCE6E9', success:'#176046', error:'#A82636', focus:'#05465B', hover:'#043F52', disabled:'#CAD5D9', onDisabled:'#3F4D54' },
  type: { body:'Inter, Arial, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif', display:'"IBM Plex Sans", Arial, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif', mono:'"IBM Plex Mono", "SFMono-Regular", Consolas, monospace', size:14, title:36, mobileTitle:28, weight:700, line:1.55, titleLine:1.15, tracking:'-0.045em' },
  layout:{ max:1080, padding:24, mobilePadding:16, gap:16, section:24, columns:'1.35fr .9fr', breakpoint:600, imageOrder:'after' },
  element:{ height:44, padding:14, radius:2, border:1, shadow:'0 1px 0 #17232A22', hoverY:0, press:1, disabledOpacity:1, cardPadding:16, imageRadius:0, imageFilter:'grayscale(.65) contrast(1.12)', tabStyle:'underline', dialogWidth:520 },
  motion:{ duration:160, ease:'cubic-bezier(.2,0,0,1)', y:4, scale:1, stagger:40, tabX:8, close:120 },
  layoutNote:'24px 눈금 배경 위에 본문 1.35, 그림 .9 비율을 놓습니다. 카드 썸네일은 60px, 정보 간격은 12px로 압축합니다. 이미지 채도를 낮추고 직각 모서리와 뚜렷한 상태선을 사용합니다.'
}, {
  id: 'bold', name: 'Bold Graphic', subtitle: '큰 활자와 눌리는 그래픽', number: '04',
  intent: '행사 예약, 젊은 브랜드, 캠페인 페이지에 적합합니다. 큰 제목·강한 대비·두꺼운 테두리와 단단한 그림자로 핵심 행동을 즉시 드러냅니다.',
  colors: { background:'#F4E74F', surface:'#FFFDF2', text:'#171717', muted:'#3F3F39', accent:'#B42A1B', onAccent:'#FFFFFF', border:'#171717', soft:'#EFC75E', success:'#14613A', error:'#9F1D26', focus:'#171717', hover:'#7E180F', disabled:'#D7CEA7', onDisabled:'#3D3931' },
  type: { body:'Arial, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif', display:'"Arial Black", Impact, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif', mono:'"SFMono-Regular", Consolas, monospace', size:16, title:50, mobileTitle:34, weight:900, line:1.55, titleLine:1.03, tracking:'-0.055em' },
  layout:{ max:1060, padding:30, mobilePadding:18, gap:20, section:36, columns:'1fr', breakpoint:640, imageOrder:'after' },
  element:{ height:52, padding:22, radius:0, border:3, shadow:'6px 6px 0 #171717', hoverY:-3, press:3, disabledOpacity:1, cardPadding:24, imageRadius:0, imageFilter:'saturate(1.5) contrast(1.1)', tabStyle:'filled', dialogWidth:500 },
  motion:{ duration:280, ease:'cubic-bezier(.18,.85,.25,1.25)', y:20, scale:0.96, stagger:90, tabX:14, close:180 },
  layoutNote:'대표 화면은 한 열로 읽고, 그림은 오른쪽으로 18% 들여 놓아 겹친 포스터처럼 보이게 합니다. 카드는 한 열이며 그림을 가로 3:1로 씁니다. 3px 테두리와 6px 오프셋 그림자가 누를 때 함께 움직입니다.'
}];
export const elements = [
  {id:'button', name:'버튼과 상태', use:'예약 확정처럼 우선순위가 분명한 행동. 하나의 주 버튼과 보조 동작을 구분합니다.', behavior:'누르면 선택 상태와 문구가 바뀝니다. 상태 선택기로 hover·focus·active·disabled를 터치에서도 비교합니다. disabled는 실제 disabled 속성으로 클릭을 차단합니다.'},
  {id:'form', name:'입력폼과 피드백', use:'예약 알림 이메일처럼 짧은 정보 수집. 라벨과 오류 문장을 입력창 가까이에 둡니다.', behavior:'빈 값·잘못된 이메일은 오류, 유효한 이메일은 성공. 입력 시 오류를 해제합니다. 메시지는 aria-live로 알리며 서버로 전송하지 않습니다.'},
  {id:'card', name:'카드와 등장 모션', use:'공간·상품·콘텐츠의 비교. 저장 버튼은 독립 행동이며 aria-pressed로 선택 여부를 알립니다.', behavior:'카드 3장의 등장 순서를 재생·일시정지·다시 보기·초기화합니다. 초기화 후 콘텐츠는 보이는 상태를 유지합니다. 저장은 현재 체험 중에만 유지합니다.'},
  {id:'tabs', name:'탭과 화면 전환', use:'같은 맥락의 공간 정보와 이용 일정을 교체할 때 사용합니다.', behavior:'선택 탭만 tabindex=0. 좌우 화살표·Home·End로 이동하고 자동 선택합니다. 탭과 panel을 aria-controls/labelledby로 연결합니다.'},
  {id:'accordion', name:'아코디언과 정보 위계', use:'예약 전에 확인할 수칙·취소 규칙처럼 필요할 때 펼치는 보조 정보.', behavior:'기본 details/summary의 Enter·Space 조작을 유지합니다. 여러 항목을 동시에 열 수 있습니다. 높이는 즉시 변하고 본문만 등장합니다.'},
  {id:'dialog', name:'다이얼로그와 확인', use:'예약 내용의 최종 확인처럼 맥락을 잠시 좁히는 행동. 작은 화면에서는 하단 시트로 배치합니다.', behavior:'기본 dialog.showModal()로 배경을 비활성화하고 초점을 가둡니다. Esc·취소·바깥 클릭으로 닫고 실행 버튼으로 초점을 돌립니다. 확인 시 로컬 완료 문구를 표시합니다.'},
  {id:'scroll', name:'내부 스크롤과 진입', use:'목록을 읽는 흐름에서 새 항목이 들어오는 위치를 짚어 주는 모션.', behavior:'240px 높이의 내부 영역만 스크롤합니다. 항목이 25% 진입하면 1회 재생합니다. 다시 보기로 스크롤과 진입 기록을 초기화합니다. 본문 스크롤은 가로채지 않습니다.'}
];
