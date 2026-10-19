import {componentIdFor} from './component-model.js?v=20261019-library7';
import {conceptForItem} from './site-concepts.js?v=20261019-library7';
// Stable IDs retain existing deep links; names describe the current website pattern.
const row=(name,description,kind,use,behavior,hint,keyboard,duration=220)=>({name,description,kind,use,behavior,hint,keyboard,duration});
export const siteCatalog={
'dark-ai--beam':row('버튼','저장·오류·재시도와 토글 버튼의 상태를 확인합니다.','feedback','편집 화면에서 저장 결과와 다음 행동을 명확하게 전달할 때 사용합니다.','저장 중 중복 실행을 막고, 완료 또는 오류를 같은 자리에서 알려 줍니다. 북마크와 팔로우는 독립된 선택입니다.','저장과 오류 상태를 눌러보세요.','Tab으로 이동하고 Enter·Space로 실행합니다.'),
'dark-ai--prompt':row('입력 폼','입력 검증부터 제출과 완료까지 이어지는 구독 폼.','form','사이트의 구독 신청과 간단한 가입 흐름에 사용합니다.','이름·이메일·동의를 검증하고 오류 입력에 초점을 옮깁니다. 올바르게 제출하면 완료 상태를 표시합니다. 실제 메일은 발송하지 않습니다.','빈 폼과 올바른 입력을 제출해 보세요.','Tab으로 이름·이메일·동의·제출을 이동합니다.'),
'dark-ai--controls':row('탭','탭별 설정을 변경하고 저장 결과를 확인합니다.','selection','계정·알림·보안처럼 관련 설정을 한 화면에 구분할 때 사용합니다.','탭을 바꿔도 입력한 설정을 유지합니다. 변경한 값을 저장하면 완료 피드백을 표시합니다.','탭을 바꾸고 설정을 저장해 보세요.','탭에서 방향키·Home·End로 선택하고 Tab으로 설정에 들어갑니다.',180),
'dark-ai--layers':row('드롭다운 액션 메뉴','복제·이름 변경·보관이 실제 목록에 반영됩니다.','selection','목록의 보조 행동을 작은 메뉴에 모을 때 사용합니다.','메뉴를 열고 행동을 선택하면 프로젝트 정보가 바뀝니다. 바깥 클릭과 Escape로 닫고 원래 버튼으로 초점을 돌립니다.','프로젝트 메뉴의 행동을 실행해 보세요.','방향키·Home·End로 메뉴 항목을 탐색하고 Enter로 실행합니다.',170),
'light-project--tasks':row('자주 묻는 질문','여러 답변을 펼쳐 읽는 FAQ 아코디언.','panel','가격·결제·이용 안내의 질문과 긴 답변을 정돈할 때 사용합니다.','질문마다 독립적으로 열고 닫습니다. 여러 답변을 동시에 읽을 수 있고 긴 문장도 자연스럽게 줄바꿈합니다.','질문을 눌러 답변을 펼쳐보세요.','Tab으로 질문에 이동하고 Enter·Space로 펼치거나 접습니다.',220),
'light-project--quick-add':row('태그 입력','키워드 추가·중복 검증·삭제·추천 태그를 체험합니다.','form','게시물이나 자료에 여러 키워드를 입력할 때 사용합니다.','Enter와 쉼표로 태그를 추가합니다. 중복·최대 개수를 검증하며 각 삭제 버튼과 Backspace를 제공합니다.','Enter로 추가하고 삭제해 보세요.','입력 후 Enter·쉼표로 추가, 빈 입력에서 Backspace로 마지막 태그를 지웁니다.',180),
'dark-ai--process':row('파일 업로더','파일 검증·진행·취소·재시도를 한 흐름으로.','form','문서나 이미지를 제출하는 폼에서 선택한 파일과 처리 결과를 보여 줍니다.','PNG·JPG·PDF의 형식과 5MB 제한을 확인합니다. 파일 선택 또는 샘플로 진행·취소·재시도·완료를 체험합니다. 서버로 전송하지 않는 로컬 시뮬레이션입니다.','샘플 업로드와 취소를 눌러보세요.','드래그 대신 파일 선택 버튼 또는 샘플 업로드 버튼을 사용할 수 있습니다.',180),
'light-project--filters':row('주문 검색과 필터','검색·상태·정렬·일괄 처리가 연결된 주문 표.','data','관리 페이지에서 많은 항목을 찾고 선택해 처리할 때 사용합니다.','고객명·주문번호 검색, 상태 필터와 정렬이 같은 주문 데이터에 적용됩니다. 선택한 주문의 배송 상태를 일괄 변경합니다.','검색하거나 주문을 선택해 보세요.','Tab으로 검색·필터·정렬·선택·처리 버튼을 탐색합니다.',200),
'light-project--calendar':row('상담 예약 피커','가능한 날짜와 시간을 고르고 예약을 확정합니다.','calendar','상담이나 방문 예약에서 가능한 시간대를 선택할 때 사용합니다.','14일 예시 일정에서 예약 가능한 날짜와 시간을 고릅니다. 선택 요약과 확정 결과를 같은 화면에서 확인합니다.','날짜와 시간을 고른 뒤 확정하세요.','Tab과 Enter·Space로 날짜·시간을 선택합니다. 예약 불가 날짜는 비활성화합니다.',180),
'light-project--chart':row('매출 분석 차트','기간에 따라 수치와 막대가 함께 바뀌는 분석 UI.','data','운영 지표나 매출의 기간별 변화를 비교할 때 사용합니다.','최근 7일과 4주의 매출·주문 수를 함께 변경합니다. 막대마다 실제 금액을 텍스트로 읽을 수 있습니다.','기간과 막대를 선택해 보세요.','막대에서 방향키·Home·End로 이동하고 Escape로 상세 값을 닫습니다.',300),
'dark-ai--dialog':row('드로어','상품 담기부터 수량·삭제·합계·주문 완료까지.','overlay','상품 목록의 맥락을 유지하며 장바구니를 확인할 때 사용합니다.','상품을 담고 드로어에서 수량을 조절하거나 삭제합니다. 합계를 갱신하며 빈 상태와 로컬 주문 완료를 제공합니다.','상품을 담고 장바구니를 열어보세요.','모달 안에서 Tab·Shift+Tab으로 이동합니다. Escape·닫기로 닫고 열었던 버튼으로 돌아옵니다.',240),
'light-project--dialog':row('삭제 확인 다이얼로그','이름 확인·삭제·실행 취소로 이어지는 확인창.','overlay','파일처럼 삭제 전에 대상과 결과를 확인해야 하는 행동에 사용합니다.','파일 이름이 일치해야 삭제할 수 있습니다. 삭제 후 목록과 건수가 바뀌고 실행 취소로 복구합니다.','파일을 삭제한 뒤 실행 취소해 보세요.','열리면 확인 입력에 초점이 갑니다. Escape·취소로 닫고 열었던 버튼으로 돌아옵니다.',240)
};
export const siteOrder=['dark-ai--beam','dark-ai--prompt','dark-ai--controls','dark-ai--dialog',...Object.keys(siteCatalog).filter(id=>!['dark-ai--beam','dark-ai--prompt','dark-ai--controls','dark-ai--dialog'].includes(id))];
const motionDescription={
 'dark-ai--beam':'버튼 색 150ms·눌림 y 1px 140ms. 900ms 로컬 처리 후 결과 opacity .5→1 180ms.',
 'dark-ai--prompt':'900ms 로컬 제출 후 결과 opacity .5→1 180ms. 입력 오류는 즉시 표시하고 첫 오류로 초점을 옮깁니다.',
 'dark-ai--controls':'탭 내용 opacity .45→1, y 5→0px 180ms. 토글은 180ms, 저장 결과는 opacity .5→1 180ms.',
 'dark-ai--layers':'메뉴 opacity 0→1, y -7→0px 170ms. 닫힘은 즉시 반영합니다.',
 'light-project--tasks':'답변 opacity 0→1, y -7→0px 220ms. 접기는 즉시 반영하고 플러스 표시는 220ms 회전합니다.',
 'light-project--quick-add':'추가한 태그 opacity 0→1, scale .85→1 180ms. 오류와 삭제는 즉시 반영합니다.',
 'dark-ai--process':'130ms마다 10%씩 로컬 진행합니다. 진행 막대는 transform scaleX와 130ms linear 전환을 사용합니다.',
 'light-project--filters':'검색·필터·정렬·일괄 처리 결과는 즉시 반영합니다. 버튼 색은 150ms, 눌림은 y 1px 140ms입니다.',
 'light-project--calendar':'날짜·시간 선택은 즉시 반영합니다. 예약 결과 opacity .5→1 180ms.',
 'light-project--chart':'기간별 막대 높이를 현재 값에서 새 값으로 scaleY 전환, 300ms. 선택 수치·축·요약은 즉시 갱신합니다.',
 'dark-ai--dialog':'드로어 opacity 0→1, x 24→0px 240ms / 닫힘 역방향 140ms. 담기 배지 scale .82→1, opacity .6→1 160ms.',
 'light-project--dialog':'확인창 opacity 0→1, y 12→0px, scale .98→1 240ms / 닫힘 역방향 140ms. 이전 닫기 완료는 새 열림을 덮어쓰지 않습니다.'
};
const libraryMotion={
 button:m=>`누름 scale .97→1 ${m.press}ms, 결과 opacity .45→1 ${m.result}ms. 900ms 로컬 저장 후 성공·오류를 같은 위치에 표시합니다.`,
 form:m=>`검증 오류는 즉시 표시하고 첫 오류에 초점을 옮깁니다. 900ms 로컬 제출 후 결과 opacity .45→1 ${m.result}ms.`,
 tabs:m=>`선택 표시의 현재 x·폭에서 새 탭까지 ${m.tab}ms, 패널 opacity .45→1 및 y 5→0px ${m.content}ms. 빠른 역선택은 현재 위치에서 이어 갑니다.`,
 drawer:m=>`패널 opacity 0→1 및 x ${m.drawerDistance}→0px ${m.drawerOpen}ms / 닫힘은 현재 위치에서 역방향 ${m.drawerClose}ms. 퇴장 뒤 닫고 초점을 복원합니다.`,
 accordion:m=>`현재 높이에서 펼친 본문 높이 또는 summary 높이까지 ${m.content}ms. 중간에 반대로 누르면 현재 높이에서 목표를 바꾸고 여러 답변을 독립적으로 유지합니다.`
};
export function siteRules(item){const concept=conceptForItem(item);return [
['스타일',`${concept.name} · ${concept.summary}`],
['사용 맥락',`${(item.contexts||[]).join(' · ')}. ${item.use}`],['직접 체험',item.behavior],['키보드',item.keyboard],
['구조·스타일',`${concept.type.scale}. ${concept.type.body}. 간격 ${concept.spacing}. 모서리 ${concept.radius}. 바탕 ${concept.colors.paper}, 표면 ${concept.colors.surface}, 본문 ${concept.colors.ink}, 강조 ${concept.colors.accent}. 목록·상세·실행 HTML은 같은 구현을 사용합니다.`],
['모션',`${libraryMotion[item.componentId]?.(concept.styleMotion)||motionDescription[item.id]||concept.motion} easing ${['button','form','tabs','drawer','accordion'].includes(item.componentId)?concept.styleMotion.ease:item.motion.ease}. 모션 줄이기에서는 중간 이동을 생략하고 결과를 표시합니다.`],
['서비스 연결','브라우저 안에서 체험하는 예시 데이터입니다. 실제 서비스에서는 저장·제출·주문·예약을 해당 서비스의 API와 연결하세요.']
];}

const legacy={
'dark-ai--process':[3,'처리 상태'],'dark-ai--layers':[4,'레이어 패널'],'light-project--chart':[5,'막대 차트'],'dark-ai--controls':[6,'프리셋'],'light-project--tasks':[7,'작업 상세'],'light-project--filters':[8,'작업 필터'],'light-project--calendar':[9,'캘린더'],'dark-ai--beam':[10,'선택 상태'],'dark-ai--prompt':[11,'프롬프트 입력'],'light-project--quick-add':[12,'작업 추가'],'dark-ai--dialog':[13,'결과 검토'],'light-project--dialog':[14,'작업 검토']
};
export const siteKinds={all:'전체',panel:'콘텐츠',selection:'탐색·설정',feedback:'피드백',data:'데이터',calendar:'예약',form:'입력',overlay:'확인창'};
export const siteContexts={all:'모든 사용 맥락',content:'콘텐츠 사이트',store:'온라인 스토어',work:'업무 도구'};
const contextIds={button:['content','store','work'],form:['content','store','work'],tabs:['content','store','work'],drawer:['store'],menu:['content','work'],accordion:['content','store','work'],tags:['content','work'],upload:['content','work'],table:['store','work'],calendar:['content','store','work'],chart:['store','work'],dialog:['content','store','work']};
export const websiteItems=siteOrder.map(id=>{const spec=siteCatalog[id],[themeId,key]=id.split('--');return {id,themeId,key,componentId:componentIdFor(id),contextIds:contextIds[componentIdFor(id)],contexts:contextIds[componentIdFor(id)].map(key=>siteContexts[key]),conceptId:conceptForItem(id)?.id,number:String(legacy[id][0]).padStart(2,'0'),legacyName:legacy[id][1],...spec,motion:{duration:spec.duration,ease:key==='process'?'linear':key==='chart'?'cubic-bezier(.2,0,.2,1)':key==='layers'?'cubic-bezier(.16,1,.3,1)':['dialog','tasks'].includes(key)?'cubic-bezier(.22,1,.36,1)':'cubic-bezier(.2,.8,.2,1)',trigger:spec.hint,target:spec.name,from:'이전 상태',to:'사용자가 선택한 새 상태',delay:0},auto:[]};});
export function sitePrompt(item){return `${item.name}을 현재 프로젝트의 데이터와 이벤트에 맞게 구현하세요. 기존 ID ${item.id}와 경로를 보존하세요.\n\n${siteRules(item).map(([heading,value])=>`## ${heading}\n${value}`).join('\n\n')}\n\n목록에서 모든 핵심 동작을 사용할 수 있어야 하며 상세 이동은 명시적인 자세히 보기 버튼만 담당합니다. 입력한 내용을 서버에 전송하지 않는 로컬 예제라는 사실을 표시하세요. 실행 HTML에는 스타일과 동작을 모두 포함하고 필요한 상태와 키보드·터치·reduced-motion을 확인하세요.`;}
