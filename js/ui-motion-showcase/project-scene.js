// Orbit is original sample content. The reference is a static portfolio image;
// these dimensions and interactions are intentionally designed for this demo.
export const projectTokens = Object.freeze({
  sceneMax: 1384,
  columns:"1.65fr .8fr 1fr", mobilePadding:12, mobileKpiHeight:67, mobileChartHeight:154, mobileRowHeight:52,
  scenePadding: 16,
  sceneGap: 8,
  navHeight: 56,
  kpiHeight: 64,
  chartHeight: 120,
  chartMorphDuration: 240,
  chartMorphDelay: 35,
  tableHeaderHeight: 29,
  taskRowHeight: 40,
  taskDetailHeight: 40,
  tableWidths: {task:43,owner:18,due:13,status:14,review:12},
  tabletBreakpoint: 1040,
  mobileBreakpoint: 700,
  compactHeight: 380,
  fontBody: '"Manrope", "Inter", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif',
  type: {nav:12,body:13,caption:11,section:14,moduleTitle:15,metricLabel:11,metricValue:25,taskTitle:12},
  material: {
    canvas:'#F4F6F4',surface:'#FFFFFF',ink:'#17291E',muted:'#52665A',
    line:'#DDE6DF',lineStrong:'#C9D7CC',green:'#278C56',accent:'#C9F4D8',
    soft:'#EDF5EF',done:'#52C879',active:'#89B39A',review:'#D6B979',
    dark:'#142D20',panelPadding:14,panelRadius:4,metricRadius:3,tableRadius:3,meetingRadius:5,
    panelShadow:'0 1px 2px #102A1A0A'
  }
});

const icon = (name) => ({
  grid: '<rect x="2" y="2" width="7" height="7" rx="1"/><rect x="13" y="2" width="7" height="7" rx="1"/><rect x="2" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
  list: '<path d="M8 5h12M8 12h12M8 19h12M3 5h1M3 12h1M3 19h1"/>',
  calendar: '<rect x="2" y="4" width="20" height="18" rx="2"/><path d="M7 2v5M17 2v5M2 10h20"/>',
  chevron: '<path d="m8 5 7 7-7 7"/>',
  chart: '<path d="M3 20V4M3 20h18M7 16l4-5 4 2 5-7"/>',
  trend: '<path d="M3 17 9 11l4 4 8-9M15 6h6v6"/>',
  review: '<path d="M3 4h18v16H3zM7 9h10M7 13h7"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  check: '<path d="m4 12 5 5L20 6"/>'
}[name] || '');
const svg = (name) => `<svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icon(name)}</svg>`;
const button = (label, action, className = '') => `<button type="button" class="btn ${className}" data-action="${action}">${label}</button>`;

export function projectMarkup(t) {
  const total = t.data.tasks.length;
  const done = t.data.tasks.filter(task => task.status === 'done').length;
  const percent = Math.round(done / total * 100);
  const filters = [['all', '전체'], ['active', '진행·검토 중'], ['done', '완료']]
    .map(([value, label]) => `<button type="button" class="chip" data-filter="${value}" aria-pressed="${value === 'all'}">${label}</button>`).join('');
  const dates = t.data.dates.map((date, index) => `<button type="button" class="date-button" data-date="${date}" aria-pressed="${index === 0}"><small>${['금', '토', '일', '월'][index]}</small><span>${date}</span><i aria-hidden="true"></i></button>`).join('');
  return `<div class="project-scene">
    <nav class="project-nav" aria-label="Orbit 프로젝트 내비게이션">
      <span class="project-brand"><span class="project-brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span>orbit<span class="project-brand-period">.</span></span></span>
      <div class="project-nav-links" role="group" aria-label="화면 영역">
        <button type="button" class="project-nav-item" data-view="overview" aria-pressed="true">${svg('grid')}<span>개요</span></button>
        <button type="button" class="project-nav-item" data-view="tasks" aria-pressed="false">${svg('list')}<span>작업</span></button>
        <button type="button" class="project-nav-item" data-view="calendar" aria-pressed="false">${svg('calendar')}<span>일정</span></button>
      </div>
      <div class="project-nav-end"><span class="project-nav-project">Orbit 웹사이트 개편 ${svg('chevron')}</span><span class="avatar" aria-label="샘플 담당자 서윤">SY</span></div>
    </nav>
    <div class="dashboard">
      <div class="dash-heading"><div><span class="project-overline">ORBIT / 2026.10 <span aria-hidden="true">·</span> 샘플 데이터</span><h3>웹사이트 개편</h3></div><div class="dash-heading-tools"><div class="project-filter" role="group" aria-label="작업 상태 필터">${filters}</div></div></div>
      <div class="metrics" aria-label="선택 범위 지표">
        <div class="metric"><div class="metric-top"><span>전체 작업</span></div><strong data-metric="total">${total}</strong><small>10월 3주 · 스프린트 03</small></div>
        <div class="metric"><div class="metric-top"><span>완료</span></div><strong data-metric="done">${done}</strong><small data-metric="percent">완료율 ${percent}%</small></div>
        <div class="metric"><div class="metric-top"><span>진행 · 검토</span></div><strong data-metric="active">${total - done}</strong><small>마감 예정 포함</small></div>
      </div>
      <div class="dashboard-grid">
        <section class="module chart-module" data-dash-chart aria-labelledby="orbit-chart-title">
          <div class="module-head"><h4 id="orbit-chart-title">마감 분포</h4><div class="project-period" role="tablist" aria-label="차트 표시 기간"><button type="button" class="tab" role="tab" data-period="week" aria-selected="true" tabindex="0">일별</button><button type="button" class="tab" role="tab" data-period="cumulative" aria-selected="false" tabindex="-1">누적</button></div></div>
          <div class="chart-legend" aria-label="막대 범례"><span><i data-status="done"></i>완료</span><span><i data-status="active"></i>진행</span><span><i data-status="review"></i>검토</span><b>단위 · 작업 건수</b></div>
          <div class="chart-plot"><div class="chart-axis" data-chart-axis aria-hidden="true"></div><div class="bar-chart" data-chart></div></div><div class="chart-values" data-chart-values role="status"></div>
          <div class="chart-tooltip" data-chart-tooltip role="status" aria-live="polite" hidden></div>
        </section>
        <section class="module progress-module" aria-labelledby="orbit-progress-title"><div class="module-head"><h4 id="orbit-progress-title">진행 현황</h4>${svg('chart')}</div><div class="project-progress-body"><div class="completion-number" data-metric="percent-big">${percent}<small>%</small></div><p>완료율 · 현재 필터</p><div class="completion-track"><div data-completion></div></div><p class="project-progress-summary" data-summary></p></div><div class="project-phase-list"><div><i class="phase-dot done"></i><span>완료</span><strong data-metric="done">${done}</strong></div><div><i class="phase-dot active"></i><span>진행 · 검토</span><strong data-metric="active">${total - done}</strong></div></div></section>
        <section class="module agenda-module" data-dash-calendar aria-labelledby="orbit-agenda-title"><div class="module-head"><h4 id="orbit-agenda-title">이번 주 마감</h4><span class="module-month">10월 3주</span></div><div class="date-grid" role="group" aria-label="마감 날짜 선택">${dates}</div><div class="agenda-list" data-agenda aria-live="polite"></div><div class="agenda-files" aria-label="최근 프로젝트 파일"><h5>최근 파일</h5><div class="agenda-file"><span class="file-kind">FIG</span><span><strong>Orbit UI kit</strong><small>10.15 · 시안</small></span><em>v2.4</em></div><div class="agenda-file"><span class="file-kind">PDF</span><span><strong>핸드오프 노트</strong><small>10.14 · 전달</small></span><em>1.8 MB</em></div></div></section>
        <section class="module tasks-module" data-dash-tasks aria-labelledby="orbit-tasks-title"><div class="module-head"><h4 id="orbit-tasks-title">작업 목록</h4><div class="task-tools"><label class="sort-label">정렬 <select data-sort aria-label="작업 정렬"><option value="due">마감일순</option><option value="status">상태순</option></select></label><span class="module-count" data-list-count>${total} TASKS</span></div></div><div class="project-task-layout"><table class="project-task-table" aria-label="프로젝트 작업 목록"><colgroup><col class="col-task"><col class="col-owner"><col class="col-due"><col class="col-status"><col class="col-review"></colgroup><thead><tr><th scope="col">작업</th><th scope="col">담당자</th><th scope="col">마감</th><th scope="col">상태</th><th scope="col">검토</th></tr></thead><tbody class="task-list" data-task-list></tbody></table><div class="task-detail" data-task-detail aria-live="polite"></div></div></section>
        <section class="module meeting-module" aria-labelledby="orbit-meeting-title"><div class="module-head"><h4 id="orbit-meeting-title">다음 리뷰</h4>${svg('calendar')}</div><div class="meeting-date">10.19 <span>MON · 14:00</span></div><p>프로토타입 리뷰 · 화면 구조와 다음 릴리스를 점검합니다.</p><div class="meeting-people"><span class="avatar">SY</span><span class="avatar">JH</span><span class="avatar">MS</span><small>서윤 · 지호 · 민서</small></div>${button('선택 작업 검토 ' + svg('chevron'), 'open', 'meeting-review')}</section>
      </div>
      <div class="project-bottom"><span>샘플 작업 ${total}개 · 브라우저 안에서만 동작</span>${button('화면 초기화', 'reset')}</div>
      <div class="settings"><label>재생 속도 <select data-speed aria-label="재생 속도"><option value="1">1× 기본</option><option value="4">0.25× 관찰</option></select></label><label><input type="checkbox" data-reduced>동작 줄이기 체험</label></div>
      <p class="feedback" data-motion-status role="status">필터·행·날짜·차트 탭을 눌러보세요.</p>
      <dialog aria-labelledby="orbit-review-title"><div class="stack"><span class="eyebrow">LOCAL REVIEW</span><h4 id="orbit-review-title">작업 내용 확인</h4><p data-review-content>Orbit 웹사이트 개편 · 히어로 프로토타입</p><p class="muted">샘플 데이터로 체험합니다. 저장하거나 전송하지 않습니다.</p><div class="row">${button('검토 완료', 'confirm', 'primary')}${button('취소', 'close')}</div></div></dialog>
      <p class="feedback" data-result role="status"></p>
    </div>
  </div>`;
}


export function projectCSS(t) {
  const p = t.scene || projectTokens;
  const s = '.demo[data-theme=light-project][data-demo-key=hero]';
  return `
${s}{
  --p-canvas:${p.material.canvas};--p-surface:${p.material.surface};
  --p-ink:${p.material.ink};--p-muted:${p.material.muted};
  --p-line:${p.material.line};--p-line-strong:${p.material.lineStrong};
  --p-green:${p.material.green};--p-accent:${p.material.accent};
  --p-soft:${p.material.soft};--p-done:${p.material.done};
  --p-active:${p.material.active};--p-review:${p.material.review};
  --p-dark:${p.material.dark};
  --chart-morph-duration:${p.chartMorphDuration}ms;
  --chart-morph-delay:${p.chartMorphDelay}ms;
  max-width:${p.sceneMax}px;background:var(--p-canvas);color:var(--p-ink);
  border-radius:0;font-family:${p.fontBody}
}
${s} .project-scene{min-width:0;overflow:hidden;background:var(--p-canvas);border-radius:0}
${s} .project-nav{height:${p.navHeight}px;
  display:grid;grid-template-columns:auto 1fr auto;align-items:center;
  gap:20px;padding:0 ${p.scenePadding}px;border-bottom:1px solid var(--p-line);
  background:var(--p-surface)
}
${s} .project-brand{
  display:inline-flex;align-items:center;gap:8px;white-space:nowrap;
  font-size:21px;font-weight:800;letter-spacing:-.07em;color:var(--p-ink)
}
${s} .project-brand-period{color:var(--p-green)}
${s} .project-brand-mark{
  width:22px;height:22px;display:grid;grid-template-columns:repeat(2,8px);
  grid-template-rows:repeat(2,8px);gap:2px;transform:rotate(-16deg)
}
${s} .project-brand-mark i{display:block;background:var(--p-green);border-radius:2px}
${s} .project-brand-mark i:nth-child(2){opacity:.7}
${s} .project-brand-mark i:nth-child(3){opacity:.45}
${s} .project-nav-links{display:flex;align-items:center;justify-content:center;gap:4px}
${s} .project-nav-item{
  min-height:36px;display:inline-flex;align-items:center;gap:7px;padding:0 13px;
  border:0;border-radius:5px;background:transparent;color:var(--p-muted);
  font-size:${p.type.nav}px;font-weight:650
}
${s} .project-nav-item[aria-pressed=true]{background:var(--p-accent);color:var(--onAccent)}
${s} .project-nav-item:hover{background:var(--p-soft)}
${s} .project-nav-item[aria-pressed=true]:hover{background:var(--p-accent)}
${s} .project-nav-end{display:flex;align-items:center;justify-content:end;gap:11px;min-width:195px}
${s} .project-nav-project{
  display:inline-flex;align-items:center;gap:5px;white-space:nowrap;
  color:var(--p-muted);font-size:11px;font-weight:600
}
${s} .project-nav-project svg{width:12px;height:12px;transform:rotate(90deg)}
${s} .project-nav-end .avatar{width:30px;height:30px;font-size:11px;background:var(--p-soft)}
${s} .dashboard{
  display:grid;gap:${p.sceneGap}px;padding:${p.scenePadding}px;
  max-width:${p.sceneMax}px;min-width:0;margin:auto
}
${s} .dash-heading{
  display:flex;align-items:center;justify-content:space-between;gap:20px;min-height:53px
}
${s} .project-overline{
  display:block;color:var(--p-green);font:700 11px/1.3 var(--mono);
  letter-spacing:.12em
}
${s} .project-overline span{color:var(--p-muted);margin:0 4px}
${s} .dash-heading h3{
  margin:4px 0 0;font-size:clamp(24px,2.35cqw,29px);font-weight:740;
  line-height:1.1;letter-spacing:-.052em;color:var(--p-ink)
}
${s} .dash-heading p{margin:3px 0 0;font-size:${p.type.body}px;color:var(--p-muted)}
${s} .dash-heading-tools{flex:none}
${s} .project-filter{
  display:flex;align-items:center;gap:2px;padding:3px;border:1px solid var(--p-line-strong);
  border-radius:6px;background:var(--p-surface)
}
${s} .project-filter .chip{
  min-height:36px;padding:5px 11px;border:0;border-radius:4px;
  background:transparent;color:var(--p-muted);font-size:11px;white-space:nowrap
}
${s} .project-filter .chip[aria-pressed=true]{
  background:var(--p-accent);color:var(--onAccent);font-weight:700
}
${s} .metrics{
  display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0;
  min-height:${p.kpiHeight}px;background:var(--p-surface);
  border:1px solid var(--p-line);border-radius:${p.material.metricRadius}px;box-shadow:${p.material.panelShadow}
}
${s} .metrics .metric{
  position:relative;min-width:0;height:${p.kpiHeight}px;padding:9px 17px;
  display:grid;grid-template-columns:auto 1fr;align-items:center;column-gap:10px;
  background:transparent;border:0;border-radius:0;box-shadow:none
}
${s} .metrics .metric:not(:last-child):after{
  content:'';position:absolute;right:0;top:11px;bottom:11px;width:1px;background:var(--p-line)
}
${s} .metric-top{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;gap:6px}
${s} .metric-top>span{font-size:${p.type.metricLabel}px;font-weight:700;color:var(--p-muted)}
${s} .metric-top em{
  color:#6A7F70;font:600 11px/1 var(--mono);font-style:normal;letter-spacing:.06em
}
${s} .metrics strong{
  display:block;margin:0;font-size:${p.type.metricValue}px;font-weight:730;
  line-height:1;letter-spacing:-.05em;color:var(--p-ink)
}
${s} .metrics small{font-size:11px;color:var(--p-muted);line-height:1.2}
${s} .dashboard-grid{
  display:grid;grid-template-columns:${p.columns};
  gap:${p.sceneGap}px;align-items:stretch
}
${s} .dashboard-grid>.module{
  min-width:0;padding:${p.material.panelPadding}px;
  border:1px solid var(--p-line);border-radius:${p.material.panelRadius}px;
  background:var(--p-surface);box-shadow:${p.material.panelShadow}
}
${s} .module-head{display:flex;align-items:center;justify-content:space-between;gap:10px;min-width:0}
${s} .module h4{
  margin:0;color:var(--p-ink);
  font-size:${p.type.moduleTitle}px;font-weight:720;line-height:1.18;letter-spacing:-.035em
}
${s} .chart-module{grid-column:1;grid-row:1;min-height:244px;position:relative}
${s} .progress-module{
  grid-column:2;grid-row:1;display:flex;flex-direction:column;gap:0;
  border-radius:3px!important;background:transparent!important;
  border-top:2px solid var(--p-green)!important;box-shadow:none!important
}
${s} .agenda-module{
  grid-column:3;grid-row:2;min-height:0;border-radius:3px!important;
  background:#FBFCFB!important
}
${s} .tasks-module{grid-column:1/span 2;grid-row:2;border-radius:${p.material.tableRadius}px!important}
${s} .meeting-module{
  grid-column:3;grid-row:1;display:flex;flex-direction:column;gap:0;
  background:var(--p-dark)!important;color:#EBFFF1!important;
  border:1px solid var(--p-dark)!important;border-radius:${p.material.meetingRadius}px!important;
  box-shadow:none!important
}
${s} .project-period{
  display:flex;gap:1px;padding:2px;border:1px solid var(--p-line);
  background:var(--p-canvas);border-radius:5px
}
${s} .project-period .tab{
  min-height:36px;padding:5px 10px;border:0;border-radius:3px;
  background:transparent;color:var(--p-muted);font-size:11px
}
${s} .project-period .tab[aria-selected=true]{
  background:var(--p-surface);color:var(--p-ink);
  box-shadow:0 1px 2px #142D2015;font-weight:700
}
${s} .chart-legend{
  display:flex;align-items:center;gap:14px;margin:6px 0 0;
  color:var(--p-muted);font-size:${p.type.caption}px
}
${s} .chart-legend span{display:inline-flex;align-items:center;gap:5px;white-space:nowrap}
${s} .chart-legend i{width:7px;height:7px;border-radius:1px}
${s} .chart-legend i[data-status=done]{background:var(--p-done)}
${s} .chart-legend i[data-status=active]{background:var(--p-active)}
${s} .chart-legend i[data-status=review]{background:var(--p-review)}
${s} .chart-legend b{margin-left:auto;font-weight:550;white-space:nowrap}
${s} .chart-plot{
  height:${p.chartHeight}px;display:grid;grid-template-columns:22px minmax(0,1fr);
  gap:5px;margin-top:5px
}
${s} .chart-axis{
  display:flex;flex-direction:column;justify-content:space-between;
  padding-bottom:2px;text-align:right;color:#697D70;
  font:11px/1 var(--mono)
}
${s} .bar-chart{
  height:100%;display:flex;align-items:flex-end;justify-content:space-around;
  gap:0;margin:0;padding:0 10px;
  background:repeating-linear-gradient(to top,transparent 0,transparent calc(33.333% - 1px),#E2EAE4 calc(33.333% - 1px),#E2EAE4 33.333%);
  border-bottom:1px solid var(--p-line-strong)
}
${s} .bar-column{
  display:flex;align-items:flex-end;justify-content:center;
  position:relative;height:100%;min-height:100%;width:25%;min-width:0;
  padding:0;border:0;background:transparent;color:var(--p-ink)
}
${s} .chart-bar{
  display:flex;flex-direction:column-reverse;align-items:stretch;
  position:relative;width:min(42px,60%);min-height:3px;padding:0;
  overflow:hidden;border:1px solid #B9CFC0;border-bottom:0;
  border-radius:3px 3px 0 0;background:#E7F0E9;
  transform-origin:bottom;pointer-events:none
}
${s} .bar-column:hover .chart-bar,
${s} .bar-column:focus-visible .chart-bar,
${s} .bar-column[aria-pressed=true] .chart-bar{
  outline:2px solid var(--p-green);outline-offset:2px
}
${s} .bar-column:focus-visible{
  outline:2px solid var(--p-green);outline-offset:-2px;border-radius:3px
}
${s} .chart-segment{display:block;width:100%;flex:none}
${s} .chart-segment[data-status=done]{background:var(--p-done)}
${s} .chart-segment[data-status=active]{background:var(--p-active)}
${s} .chart-segment[data-status=review]{background:var(--p-review)}
${s} .chart-values{
  display:grid;grid-template-columns:repeat(4,minmax(0,1fr));
  gap:0;padding:3px 10px 0 27px;color:var(--p-muted);
  font:11px/1.2 var(--mono)
}
${s} .chart-values span{text-align:center;white-space:nowrap}
${s} .chart-values small{display:block;margin-top:2px;font:inherit;opacity:.8}
${s} .chart-tooltip{
  position:absolute;z-index:3;right:14px;top:63px;
  max-width:185px;padding:8px 10px;background:var(--p-dark);color:#F2FFF5;
  border:1px solid #385943;border-radius:5px;box-shadow:0 6px 20px #102A1A30;
  font-size:11px;line-height:1.4;pointer-events:none
}
${s} .chart-tooltip[hidden]{display:none}
${s} .chart-tooltip strong,${s} .chart-tooltip span,${s} .chart-tooltip small{display:block}
${s} .chart-tooltip span{margin-top:3px}
${s} .chart-tooltip small{margin-top:5px;color:#C2DACA}
${s} .progress-module .module-head svg{width:15px;height:15px;color:var(--p-green)}
${s} .project-progress-body{margin:13px 0 0}
${s} .completion-number{font-size:30px;font-weight:720;line-height:1;letter-spacing:-.045em}
${s} .completion-number small{font-size:14px;letter-spacing:0}
${s} .project-progress-body>p{margin-top:5px;font-size:11px;color:var(--p-muted)}
${s} .completion-track{
  height:6px;margin-top:15px;overflow:hidden;border-radius:2px;background:#DCE9DF
}
${s} .completion-track>div{
  height:100%;border-radius:2px;background:var(--p-green);transition:width 240ms cubic-bezier(.2,0,.2,1)
}
${s} .project-progress-body>.project-progress-summary{
  min-height:28px;line-height:1.3;margin-top:8px;font-size:11px
}
${s} .project-phase-list{
  display:grid;gap:7px;margin-top:auto;padding-top:9px;border-top:1px solid var(--p-line)
}
${s} .project-phase-list>div{
  display:flex;align-items:center;gap:6px;color:var(--p-muted);font-size:11px
}
${s} .project-phase-list strong{margin-left:auto;color:var(--p-ink);font-weight:700}
${s} .phase-dot{width:7px;height:7px;border-radius:1px}
${s} .phase-dot.done{background:var(--p-done)}
${s} .phase-dot.active{background:var(--p-active)}
${s} .module-month,.demo[data-theme=light-project][data-demo-key=hero] .module-count{
  color:var(--p-muted);font:650 11px/1 var(--mono)
}
${s} .date-grid{
  display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;margin:13px 0 9px
}
${s} .date-button{
  display:grid;place-items:center;align-content:center;min-width:0;min-height:54px;
  padding:4px 1px;background:var(--p-canvas);border:1px solid transparent;
  border-radius:3px;color:var(--p-ink);font-size:16px;line-height:1.1
}
${s} .date-button small{font-size:11px;line-height:1.1;margin:0 0 4px;color:var(--p-muted)}
${s} .date-button i{width:3px;height:3px;margin:3px 0 0}
${s} .date-button[aria-pressed=true]{
  background:var(--p-accent);border-color:#9FD7B1;color:var(--onAccent)
}
${s} .agenda-list{display:grid;align-content:start;gap:0;min-height:76px}
${s} .agenda-list>.meta{padding:0 0 5px;color:var(--p-muted);font-size:11px}
${s} .agenda-item{
  padding:5px 4px 5px 9px;border:0;border-top:1px solid var(--p-line);
  border-left:2px solid var(--p-green);border-radius:0;background:transparent;
  font-size:12px;line-height:1.2
}
${s} .agenda-item strong{font-weight:650}
${s} .agenda-item small{font-size:11px}
${s} .agenda-files{margin-top:12px;padding-top:10px;border-top:1px solid var(--p-line)}
${s} .agenda-files h5{
  margin:0 0 4px;color:var(--p-ink);font-size:11px;font-weight:700;line-height:1.2
}
${s} .agenda-file{
  display:grid;grid-template-columns:30px minmax(0,1fr) auto;
  align-items:center;gap:7px;min-height:35px;border-bottom:1px solid #E7EEE9
}
${s} .agenda-file:last-child{border-bottom:0}
${s} .file-kind{
  display:grid;place-items:center;width:26px;height:25px;border:1px solid #BDD8C4;
  border-radius:2px;background:#E9F5EC;color:#276B41;
  font:700 11px/1 var(--mono)
}
${s} .agenda-file strong{
  display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
  color:var(--p-ink);font-size:11px;font-weight:650
}
${s} .agenda-file small{display:block;color:var(--p-muted);font-size:11px;line-height:1.15}
${s} .agenda-file em{
  color:var(--p-muted);font:500 11px/1 var(--mono);font-style:normal;white-space:nowrap
}
${s} .task-tools{display:flex;align-items:center;gap:13px;flex:none}
${s} .sort-label{
  display:inline-flex;align-items:center;gap:5px;flex:none;
  color:var(--p-muted);font-size:11px;white-space:nowrap
}
${s} .sort-label select{
  width:auto;min-width:102px;min-height:36px;padding:4px 24px 4px 7px;
  border:1px solid var(--p-line-strong);border-radius:4px;
  background:var(--p-surface);color:var(--p-ink);font:600 11px/1 ${p.fontBody}
}
${s} .project-task-layout{
  display:block;min-width:0;margin-top:6px
}
${s} .project-task-table{
  display:table;width:100%;table-layout:fixed;border-collapse:collapse;
  border:0;background:var(--p-surface);font-size:11px
}
${s} .project-task-table .col-task{width:${p.tableWidths.task}%}
${s} .project-task-table .col-owner{width:${p.tableWidths.owner}%}
${s} .project-task-table .col-due{width:${p.tableWidths.due}%}
${s} .project-task-table .col-status{width:${p.tableWidths.status}%}
${s} .project-task-table .col-review{width:${p.tableWidths.review}%}
${s} .project-task-table thead{display:table-header-group}
${s} .project-task-table thead tr{display:table-row}
${s} .project-task-table th{
  height:${p.tableHeaderHeight}px;padding:0 8px;border-bottom:1px solid var(--p-line-strong);
  color:var(--p-muted);font-size:11px;font-weight:650;letter-spacing:.015em;
  text-align:left;white-space:nowrap
}
${s} .project-task-table th:last-child{text-align:right;padding-right:9px}
${s} .task-list{
  display:table-row-group;gap:0;max-height:none!important;overflow:visible!important;
  scrollbar-gutter:auto!important
}
${s} .task-row{
  display:table-row;width:auto;height:${p.taskRowHeight}px;min-height:0;
  padding:0;gap:0;border:0;border-radius:0;background:transparent;
  color:var(--p-ink);text-align:left;box-shadow:none
}
${s} .task-row td{
  height:${p.taskRowHeight}px;padding:2px 8px;border-bottom:1px solid #E7EEE9;
  vertical-align:middle;background:transparent;overflow:hidden
}
${s} .task-row:hover td,${s} .task-row:focus-within td{background:#F4FAF5}
${s} .task-row[data-selected=true] td{background:#EDF7EF}
${s} .task-row[data-selected=true] td:first-child{box-shadow:inset 2px 0 var(--p-green)}
${s} .task-select{
  display:block;width:100%;min-height:35px;padding:2px 0;border:0;background:transparent;
  color:var(--p-ink);text-align:left;cursor:pointer
}
${s} .task-select strong{
  display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
  font-size:${p.type.taskTitle}px;font-weight:690;line-height:1.2
}
${s} .task-select small{
  display:block;margin-top:2px;overflow:hidden;text-overflow:ellipsis;
  white-space:nowrap;color:var(--p-muted);font-size:11px;line-height:1.1
}
${s} .task-owner{display:flex;align-items:center;gap:6px;min-width:0;white-space:nowrap}
${s} .task-owner .avatar{
  display:grid;place-items:center;width:22px;height:22px;flex:none;
  border:1px solid #D2E4D6;border-radius:50%;background:#E8F0E9;
  color:#416A4D;font-size:11px;font-style:normal;font-weight:650
}
${s} .task-owner span:last-child{
  min-width:0;overflow:hidden;text-overflow:ellipsis;
  color:var(--p-ink);font-size:11px;font-weight:600
}
${s} .task-due{color:var(--p-muted);font:600 11px/1.3 var(--mono);white-space:nowrap}
${s} .task-status{
  display:inline-flex;align-items:center;gap:5px;max-width:100%;padding:3px 6px;
  border-radius:2px;background:#E8EFEA;color:#385846;
  text-align:center;font-size:11px;white-space:nowrap
}
${s} .task-status:before{content:'';width:5px;height:5px;flex:none;border-radius:50%;background:currentColor}
${s} .task-status[data-status=done]{background:#DFF3E5;color:#22653A}
${s} .task-status[data-status=review]{background:#F6EEDB;color:#735721}
${s} .task-row td:last-child{text-align:right;padding-right:8px}
${s} .task-review{
  min-height:32px;padding:4px 9px;border:1px solid var(--p-line-strong);
  border-radius:3px;background:#FFFFFF;color:var(--p-ink);
  font-size:11px;font-weight:680;white-space:nowrap
}
${s} .task-review:hover{border-color:var(--p-green);background:#F5FAF6}
${s} .task-select:focus-visible,${s} .task-review:focus-visible{
  outline:2px solid var(--p-green);outline-offset:1px
}
${s} .task-detail{
  display:flex;align-items:center;gap:10px;min-height:${p.taskDetailHeight}px;min-width:0;
  margin-top:7px;padding:5px 9px;border:1px solid #DFEBE2;
  border-left:2px solid var(--p-green);border-radius:0;
  background:#F7FAF7;color:var(--p-ink);font-size:11px
}
${s} .task-detail .meta{flex:none;color:var(--p-green);font:700 11px/1.2 var(--mono)}
${s} .task-detail h5{
  flex:none;max-width:27%;margin:0;overflow:hidden;text-overflow:ellipsis;
  white-space:nowrap;font-size:11px;font-weight:700;line-height:1.25
}
${s} .task-detail p{
  min-width:0;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
  color:var(--p-muted);font-size:11px;line-height:1.35
}
${s} .task-detail p:first-of-type{flex:1}
${s} .meeting-module .module-head svg{width:15px;height:15px;color:var(--p-accent)}
${s} .meeting-module h4{color:#F1FFF4;font-size:15px;margin:0}
${s} .meeting-date{
  display:flex;align-items:baseline;gap:10px;margin-top:10px;
  font-size:25px;font-weight:730;line-height:1;letter-spacing:-.04em;color:#F1FFF4
}
${s} .meeting-date span{color:#A5CAB0;font:600 11px/1 var(--mono);letter-spacing:0}
${s} .meeting-module>p{margin:5px 0 0;color:#C5D9C9;font-size:12px;line-height:1.45}
${s} .meeting-people{display:flex;align-items:center;margin-top:auto;padding-top:10px}
${s} .meeting-people .avatar{
  width:22px;height:22px;margin-left:-4px;border:2px solid var(--p-dark);
  background:#5E8B6C;color:#F5FFF6;font-size:11px
}
${s} .meeting-people .avatar:first-child{margin-left:0}
${s} .meeting-people small{margin-left:7px;color:#BFD1C4;font-size:11px}
${s} .meeting-review{
  display:flex;align-items:center;justify-content:space-between;
  width:100%;min-height:36px;margin-top:12px;padding:6px 9px;
  border:0;border-radius:4px;background:var(--p-accent);
  color:var(--p-dark);font-size:11px;font-weight:700
}
${s} .meeting-review svg{width:13px;height:13px}
${s} .meeting-review:hover{background:#E3FCEB;color:var(--p-dark)}
${s} .project-bottom,${s} [data-motion-status]{display:none}
${s} [data-result]:empty{display:none}
${s} dialog::backdrop{background:#142D2070;backdrop-filter:none}

@container (max-width:${p.tabletBreakpoint}px){
  ${s} .project-nav-project{display:none}
  ${s} .project-nav-end{min-width:0}
  ${s} .dashboard-grid{grid-template-columns:minmax(0,1.18fr) minmax(0,.82fr)}
  ${s} .chart-module{grid-column:1;grid-row:1}
  ${s} .progress-module{grid-column:2;grid-row:1}
  ${s} .tasks-module{grid-column:1/span 2;grid-row:2}
  ${s} .agenda-module{grid-column:1;grid-row:3}
  ${s} .meeting-module{grid-column:2;grid-row:3;min-height:175px}
  ${s} .project-task-layout{display:block}
}
@container (max-width:${p.mobileBreakpoint}px){
  ${s} .project-nav{height:56px;grid-template-columns:auto 1fr auto;gap:5px;padding:0 11px}
  ${s} .project-brand{font-size:17px}
  ${s} .project-brand-mark{
    width:18px;height:18px;grid-template-columns:repeat(2,7px);
    grid-template-rows:repeat(2,7px)
  }
  ${s} .project-nav-links{gap:0;justify-content:center}
  ${s} .project-nav-item{
    min-height:44px;gap:3px;padding:0 6px;font-size:11px
  }
  ${s} .project-nav-item svg{width:13px;height:13px}
  ${s} .project-nav-end .avatar{width:26px;height:26px}
  ${s} .dashboard{padding:${p.mobilePadding}px;gap:9px}
  ${s} .dash-heading{align-items:stretch;flex-direction:column;gap:10px}
  ${s} .dash-heading h3{font-size:24px}
  ${s} .project-filter{width:max-content;max-width:100%}
  ${s} .project-filter .chip,${s} .project-period .tab{min-height:44px;font-size:11px}
  ${s} .metrics{min-height:${p.mobileKpiHeight}px}
  ${s} .metrics .metric{height:${p.mobileKpiHeight}px;padding:7px 5px;display:block}
  ${s} .metric-top>span{font-size:11px}
  ${s} .metric-top em{display:none}
  ${s} .metrics strong{font-size:23px;margin:5px 0 2px}
  ${s} .metrics small{display:none}
  ${s} .dashboard-grid{display:flex;flex-direction:column;gap:9px}
  ${s} .dashboard-grid>.module{width:100%;padding:12px}
  ${s} .chart-module{order:1}
  ${s} .tasks-module{order:2}
  ${s} .agenda-module{order:3}
  ${s} .progress-module{order:4}
  ${s} .meeting-module{order:5;min-height:180px}
  ${s} .chart-plot{height:${p.mobileChartHeight}px}
  ${s} .chart-legend{gap:10px;font-size:11px}
  ${s} .chart-legend b{font-size:11px}
  ${s} .project-task-layout{display:block}
  ${s} .project-task-table{display:block}
  ${s} .project-task-table colgroup{display:none}
  ${s} .project-task-table thead{
    position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)
  }
  ${s} .task-list{display:block}
  ${s} .task-row{
    display:grid;grid-template-columns:minmax(0,1fr) auto auto;
    grid-template-rows:auto auto;column-gap:8px;row-gap:3px;
    width:100%;height:auto;min-height:${p.mobileRowHeight}px;
    padding:4px 5px;border-bottom:1px solid var(--p-line)
  }
  ${s} .task-row td{
    display:block;height:auto;min-width:0;padding:0;border:0;overflow:visible
  }
  ${s} .task-row td:first-child{grid-column:1/3;grid-row:1}
  ${s} .task-row td:nth-child(2){grid-column:1;grid-row:2}
  ${s} .task-row td:nth-child(3){grid-column:2;grid-row:2;align-self:center}
  ${s} .task-row td:nth-child(4){grid-column:3;grid-row:2;align-self:center}
  ${s} .task-row td:nth-child(5){grid-column:3;grid-row:1;align-self:center}
  ${s} .task-select{min-height:44px}
  ${s} .task-select strong{font-size:12px}
  ${s} .task-owner{gap:4px}
  ${s} .task-owner .avatar{width:20px;height:20px}
  ${s} .task-status{padding:3px 5px}
  ${s} .task-review{min-height:44px;padding:6px 8px}
  ${s} .task-detail{display:flex;flex-wrap:wrap;gap:4px 8px}
  ${s} .task-detail h5{max-width:calc(100% - 42px)}
  ${s} .task-detail p:first-of-type{flex-basis:100%}
  ${s} .task-detail p:last-of-type{display:none}
  ${s} .bar-column{min-width:44px}
  ${s} .task-tools{gap:7px}
  ${s} .sort-label select{min-height:44px}
  ${s} .module-count{display:none}
  ${s} .date-button{min-height:56px}
  ${s} .meeting-review{min-height:44px}
}
${s}[data-presentation=compact] .project-nav{height:40px;padding:0 11px}
${s}[data-presentation=compact] .project-brand{font-size:16px}
${s}[data-presentation=compact] .project-nav-links,
${s}[data-presentation=compact] .project-nav-end{display:none}
${s}[data-presentation=compact] .dashboard{padding:9px;gap:6px}
${s}[data-presentation=compact] .dash-heading,
${s}[data-presentation=compact] .project-bottom{display:none}
${s}[data-presentation=compact] .metrics .metric{height:49px;padding:5px 8px}
${s}[data-presentation=compact] .metrics{min-height:49px}
${s}[data-presentation=compact] .metric-top>span{font-size:11px}
${s}[data-presentation=compact] .metric-top em,
${s}[data-presentation=compact] .metrics small{display:none}
${s}[data-presentation=compact] .metrics strong{font-size:21px;margin:3px 0 0}
${s}[data-presentation=compact] .dashboard-grid{display:grid;grid-template-columns:1fr;gap:6px}
${s}[data-presentation=compact] .dashboard-grid>.module{
  grid-column:1;grid-row:auto;padding:8px
}
${s}[data-presentation=compact] .dashboard-grid>.module:not(.chart-module):not(.tasks-module){display:none}
${s}[data-presentation=compact] .module h4{font-size:12px;margin:0}
${s}[data-presentation=compact] .project-period .tab{min-height:30px;padding:3px 7px;font-size:11px}
${s}[data-presentation=compact] .chart-module{min-height:0}
${s}[data-presentation=compact] .chart-legend{margin:4px 0 0;font-size:11px;gap:7px}
${s}[data-presentation=compact] .chart-legend b{display:none}
${s}[data-presentation=compact] .chart-plot{height:78px;margin-top:3px}
${s}[data-presentation=compact] .chart-values{font-size:11px;padding-top:3px}
${s}[data-presentation=compact] .tasks-module{display:block}
${s}[data-presentation=compact] .tasks-module .module-head{margin:0 0 2px}
${s}[data-presentation=compact] .task-tools,
${s}[data-presentation=compact] .task-detail{display:none}
${s}[data-presentation=compact] .project-task-layout{display:block;margin:0}
${s}[data-presentation=compact] .project-task-table{display:block}
${s}[data-presentation=compact] .project-task-table colgroup{display:none}
${s}[data-presentation=compact] .project-task-table thead{display:none}
${s}[data-presentation=compact] .task-list{display:block;max-height:82px!important;overflow:hidden!important}
${s}[data-presentation=compact] .task-row{
  display:grid;grid-template-columns:minmax(0,1fr) auto;min-height:40px;padding:2px 3px
}
${s}[data-presentation=compact] .task-row td{display:none;height:auto;padding:0;border:0}
${s}[data-presentation=compact] .task-row td:first-child,
${s}[data-presentation=compact] .task-row td:nth-child(4){display:block}
${s}[data-presentation=compact] .task-row td:first-child{grid-column:1;grid-row:1}
${s}[data-presentation=compact] .task-row td:nth-child(4){grid-column:2;grid-row:1;align-self:center}
${s}[data-presentation=compact] .task-select{min-height:34px}
${s}[data-presentation=compact] .task-select strong{font-size:11px}
${s}[data-presentation=compact] .task-select small{display:none}
${s}[data-presentation=compact] .chart-tooltip{display:none}
`;
}
