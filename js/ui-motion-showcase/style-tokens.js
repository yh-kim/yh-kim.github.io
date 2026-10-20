// Canonical style data shared by home, guide, runtime, and exports.
const font = 'system-ui, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Segoe UI", sans-serif';
const editorialFont = '"Iowan Old Style", "AppleMyungjo", "Batang", Georgia, serif';

const tokenSet = ({paper,surface,ink,muted,line,accent,onAccent,selected,error,success,disabled,controlBorder,radius,pad,gap,fontSize,lineHeight,labelSize,headingSize,headingWeight,headingLeading,headingFont=font,metaSize,buttonRadius=radius,panelRadius=radius,shellRadius=radius,fieldHeight="44px",fieldSurface=surface,chromeSurface=paper}) => ({
  bg:paper, surface, ink, text:ink, muted, line, accent, 'on-accent':onAccent,
  selected, error, success, disabled, 'control-border':controlBorder, radius, pad, gap,
  'font-size':fontSize,'line-height':lineHeight,'label-size':labelSize,'heading-size':headingSize,'heading-weight':headingWeight,'heading-leading':headingLeading,'heading-font':headingFont,'meta-size':metaSize,
  'focus-ring':accent, 'control-radius':radius, 'control-min-height':'44px', 'input-font-size':'16px',
  'button-radius':buttonRadius,'panel-radius':panelRadius,'shell-radius':shellRadius,'field-min-height':fieldHeight,'field-surface':fieldSurface,'chrome-surface':chromeSurface,
  'mobile-pad-y':'14px','mobile-pad-x':'12px','space-1':'4px','space-2':'8px','space-3':'12px','space-4':'16px','space-6':'24px','space-8':'32px'
});

export const styles = [
  {
    id:'paper', name:'Paper', thumbnail:'inline:form/paper', summary:'가는 선과 큰 활자로 읽는 흐름을 만듭니다.',
    contexts:['구독 설정','문의 입력','분류 전환','배송 확인'],
    colors:{paper:'#f7f7f5',surface:'#ffffff',ink:'#171717',muted:'#66645f',line:'#deded8',accent:'#a72f24',onAccent:'#ffffff',selected:'#f8e9e6',error:'#a32620',success:'#17633f',disabled:'#65645f',controlBorder:'#85847e'},
    tokens:tokenSet({paper:'#f7f7f5',surface:'#ffffff',ink:'#171717',muted:'#66645f',line:'#deded8',accent:'#a72f24',onAccent:'#ffffff',selected:'#f8e9e6',error:'#a32620',success:'#17633f',disabled:'#65645f',controlBorder:'#85847e',radius:'0px',pad:'16px',gap:'12px',fontSize:'14px',lineHeight:'1.65',labelSize:'12px',headingSize:'26px',headingWeight:'600',headingLeading:'1.22',headingFont:editorialFont,metaSize:'11px',buttonRadius:'0px',panelRadius:'0px',shellRadius:'0px',fieldHeight:'48px',fieldSurface:'transparent',chromeSurface:'#ffffff'}),
    type:{display:font,headingFamily:editorialFont,heading:'600 26px / 1.22',body:'14px / 1.65',scale:'명조 제목 26px · 산세리프 본문 14px · 보조 11px'},
    spacing:'4 · 8 · 12 · 16 · 24 · 32px',radius:'입력·버튼 0px · 면보다 선으로 구획',shadow:'없음 · 겹치는 면은 선으로 구분',motion:'누름 150ms · 내용 200ms · 탭 선 220ms · 결과 180ms · 패널 열기 230ms / 닫기 150ms',
    principles:['큰 제목과 얇은 규칙선으로 읽는 순서를 잡습니다.','입력은 라벨과 가까이 두고 보조 설명은 짧게 씁니다.','빨간색은 작은 행동과 현재 선택에만 사용합니다.'],
    sampleTitle:'받아볼 소식 고르기',sampleText:'관심 있는 주제를 선택하면 다음 발행부터 반영됩니다.',
    styleMotion:{press:150,content:200,tab:220,tabPanel:'fade',tabPanelDistance:0,result:180,drawerOpen:230,drawerClose:150,drawerDistance:40,drawerScale:1,ease:'cubic-bezier(.2,.8,.2,1)'}
  },
  {
    id:'object', name:'Object', thumbnail:'inline:form/object', summary:'짙은 재료감과 얕은 깊이로 선택을 드러냅니다.',
    contexts:['수량 조절','주소 입력','구성 선택','담은 항목 확인'],
    colors:{paper:'#f1efea',surface:'#ffffff',ink:'#242321',muted:'#625d55',line:'#d6d1c8',accent:'#39352f',onAccent:'#ffffff',selected:'#e8e3da',error:'#a12622',success:'#17613f',disabled:'#625e58',controlBorder:'#858078'},
    tokens:tokenSet({paper:'#f1efea',surface:'#ffffff',ink:'#242321',muted:'#625d55',line:'#d6d1c8',accent:'#39352f',onAccent:'#ffffff',selected:'#e8e3da',error:'#a12622',success:'#17613f',disabled:'#625e58',controlBorder:'#858078',radius:'8px',pad:'16px',gap:'12px',fontSize:'14px',lineHeight:'1.55',labelSize:'13px',headingSize:'22px',headingWeight:'700',headingLeading:'1.22',metaSize:'12px',buttonRadius:'9px',panelRadius:'14px',shellRadius:'16px',fieldHeight:'48px',fieldSurface:'#f7f5f1',chromeSurface:'#f1efea'}),
    type:{display:font,heading:'700 22px / 1.22',body:'14px / 1.55',scale:'제목 22px · 값 15px · 본문 14px · 보조 12px'},
    spacing:'4 · 8 · 12 · 16 · 24 · 32px',radius:'버튼 9px · 입력 8px · 묶음 14px · 바탕 16px',shadow:'기본 면에 짧은 내부 강조 · 주요 제어에 낮은 그림자',motion:'누름 150ms · 내용 220ms · 탭 면 220ms · 결과 200ms · 패널 열기 280ms / 닫기 190ms',
    principles:['선택 항목을 면과 간격으로 묶어 하나의 물건처럼 보이게 합니다.','차콜 행동 버튼은 단단하게, 주변 입력은 밝고 평평하게 둡니다.','수량과 합계는 한 줄에서 함께 확인하게 합니다.'],
    sampleTitle:'주문 구성을 확인하세요',sampleText:'수량과 배송 정보를 바꾸면 주문 요약에 바로 반영됩니다.',
    styleMotion:{press:150,content:220,tab:220,tabPanel:'slide',tabPanelDistance:10,result:200,drawerOpen:280,drawerClose:190,drawerDistance:28,drawerScale:.98,ease:'cubic-bezier(.22,1,.36,1)'}
  },
  {
    id:'frame', name:'Frame', thumbnail:'inline:form/frame', summary:'정렬된 값과 선택 면으로 작업 상태를 보여줍니다.',
    contexts:['작업 필터','정보 입력','보기 전환','변경 결과 확인'],
    colors:{paper:'#f2f5f9',surface:'#ffffff',ink:'#17243a',muted:'#596b80',line:'#d8e0e9',accent:'#1748b8',onAccent:'#ffffff',selected:'#e5edff',error:'#a3262e',success:'#17633f',disabled:'#586a7d',controlBorder:'#7d8b9d'},
    tokens:tokenSet({paper:'#f2f5f9',surface:'#ffffff',ink:'#17243a',muted:'#596b80',line:'#d8e0e9',accent:'#1748b8',onAccent:'#ffffff',selected:'#e5edff',error:'#a3262e',success:'#17633f',disabled:'#586a7d',controlBorder:'#7d8b9d',radius:'4px',pad:'12px',gap:'8px',fontSize:'13px',lineHeight:'1.55',labelSize:'12px',headingSize:'18px',headingWeight:'700',headingLeading:'1.35',metaSize:'11px',buttonRadius:'4px',panelRadius:'0px',shellRadius:'3px',fieldHeight:'44px',fieldSurface:'#ffffff',chromeSurface:'#f7f9fc'}),
    type:{display:font,heading:'700 18px / 1.35',body:'13px / 1.55',scale:'제목 18px · 라벨 12px · 값 13px · 보조 11px'},
    spacing:'4 · 8 · 12 · 16 · 24 · 32px',radius:'입력·버튼 4px · 바탕 3px · 표와 행은 직선 구획',shadow:'없음 · 선택 상태는 옅은 면과 테두리로 표시',motion:'누름 140ms · 내용 160ms · 탭 선 160ms · 결과 160ms · 패널 열기 180ms / 닫기 140ms',
    principles:['짧은 라벨과 값을 나란히 두고 숫자는 정렬합니다.','옅은 파랑 선택 면과 테두리로 현재 위치를 함께 표시합니다.','제어를 일정한 높이로 맞춰 좁은 폭에서도 빠르게 훑게 합니다.'],
    sampleTitle:'표시 조건을 설정합니다',sampleText:'현재 보기와 적용 결과를 같은 작업 영역에서 확인합니다.',
    styleMotion:{press:140,content:160,tab:160,tabPanel:'snap',tabPanelDistance:4,result:160,drawerOpen:180,drawerClose:140,drawerDistance:20,drawerScale:1,ease:'cubic-bezier(.2,.7,.2,1)'}
  }
];

export const styleById = id => styles.find(style => style.id === id) || null;

// Guide data is intentionally explicit so the parent guide can render tokens and motion endpoints.
export const styleGuide = Object.fromEntries(styles.map(style=>[style.id,{
  id:style.id,name:style.name,thumbnail:style.thumbnail,summary:style.summary,contexts:style.contexts,colors:style.colors,tokens:style.tokens,
  type:style.type,spacing:style.spacing,radius:style.radius,shadow:style.shadow,motion:style.motion,
  principles:style.principles,sampleTitle:style.sampleTitle,sampleText:style.sampleText,
  pairings:{inkOnPaper:'normal text uses ink on paper',mutedOnPaper:'metadata uses muted on paper',onAccent:'primary action text uses onAccent on accent',selected:'selected controls pair selected surface with ink and an indicator'},
  avoid:style.id==='paper'?'넓은 강조색 면, 두꺼운 그림자, 작은 본문을 피합니다.':style.id==='object'?'모든 면을 베이지로 채우거나 모든 제어에 같은 그림자를 주지 않습니다.':'카드에 그림자를 더하거나 값과 상태를 서로 다른 기준선에 놓지 않습니다.',
  colorUse:style.id==='paper'?'흰색·종이색 면을 대부분 유지하고 강조색은 버튼과 얇은 선택 표시에 제한합니다.':style.id==='object'?'밝은 면을 주로 쓰고 차콜은 주요 행동과 소량의 표면 깊이에 씁니다.':'밝은 작업 면과 선을 주로 쓰고 파랑은 선택과 주요 행동에 씁니다.',
  colorProportion:style.id==='paper'?'종이·흰 면 약 78% · 잉크와 선 18% · 빨강 4%':style.id==='object'?'밝은 면 약 76% · 차콜과 경계 20% · 강조 4%':'작업 면 약 80% · 잉크와 경계 16% · 파랑 4%',
  layout:{good:style.id==='paper'?'제목을 위에 두고 구분선 아래에 입력과 행동을 세로로 배치합니다.':style.id==='object'?'관련 상품과 수량을 한 면 안에서 묶고 합계를 가장자리에서 분리합니다.':'짧은 라벨과 값을 두 열에 정렬하고 상태를 같은 행 끝에 둡니다.',avoid:style.id==='paper'?'큰 컬러 카드와 여러 겹의 테두리를 피합니다.':style.id==='object'?'서로 무관한 내용을 한 카드 안에 합치거나 과한 그림자를 피합니다.':'라벨·값의 기준선을 섞거나 행마다 다른 패딩을 주지 않습니다.'},
  control:{minimumHeight:'44px',inputFontSize:style.tokens['input-font-size'],focus:'강조색 3px 외곽선',disabled:'비활성 글자색과 disabled 상태를 함께 표시'},
  motionFromTo:{press:'기본 위치 → y 1px 눌림 → 기본 위치',content:style.styleMotion.tabPanel==='fade'?'이동 없이 opacity .36 → 1':style.styleMotion.tabPanel==='slide'?`선택 방향 x ±${style.styleMotion.tabPanelDistance}px → 0, opacity .72 → 1`:`x ${style.styleMotion.tabPanelDistance}px → 0, opacity .84 → 1`,tab:style.id==='frame'?'선택 선이 세로 목록을 따라 이동 · 좁은 폭에서는 가로 이동':style.id==='object'?'선택 면이 가로로 이동':'밑줄이 가로로 이동',result:'대기 상태 → 텍스트가 포함된 성공 또는 오류 상태',drawerOpen:`x ${style.styleMotion.drawerDistance}px${style.styleMotion.drawerScale===1?'':`, scale ${style.styleMotion.drawerScale}`} · opacity 0 → x 0px, scale 1 · opacity 1`,drawerClose:`현재 x·scale·opacity → x ${style.styleMotion.drawerDistance}px, scale ${style.styleMotion.drawerScale}, opacity 0`,duration:{press:style.styleMotion.press,content:style.styleMotion.content,tab:style.styleMotion.tab,result:style.styleMotion.result,drawerOpen:style.styleMotion.drawerOpen,drawerClose:style.styleMotion.drawerClose},ease:style.styleMotion.ease,reduced:'prefers-reduced-motion에서는 위치 애니메이션을 건너뛰고 텍스트·상태는 즉시 갱신합니다.'}
}]));
