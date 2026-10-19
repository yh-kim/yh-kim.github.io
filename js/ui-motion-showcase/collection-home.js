const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const featured = {paper:'dark-ai--prompt',object:'dark-ai--dialog',frame:'light-project--chart'};

/** Render the expandable collection index. Demos are mounted by the gallery controller. */
export function collectionMarkup(concepts, hrefFor) {
  const entries = concepts || [];
  const count = entries.reduce((sum, concept) => sum + (Number(concept.count) || concept.componentIds?.length || 0), 0);
  const cards = entries.map((concept, index) => {
    const id = escapeHTML(concept.id);
    const name = escapeHTML(concept.name || concept.id);
    const label = escapeHTML(concept.label || '새 컨셉');
    const componentCount = Number(concept.count) || concept.componentIds?.length || 0;
    const demoId = featured[concept.id] || concept.componentIds?.[0];
    return `<article class="home-card home-card--${id}" aria-labelledby="home-${id}">
      <div class="home-card__head"><span class="home-card__index">${String(index + 1).padStart(2, '0')}</span><div><p class="home-card__type">${label}</p><h2 id="home-${id}">${name}</h2></div><span class="home-card__count">${componentCount}개 컴포넌트</span></div>
      <nav class="home-card__links" aria-label="${name} 탐색"><a class="home-card__primary" href="${escapeHTML(hrefFor(concept.id, 'components'))}">컴포넌트 <span aria-hidden="true">↗</span></a><a class="home-card__secondary" href="${escapeHTML(hrefFor(concept.id, 'design'))}">디자인 가이드 <span aria-hidden="true">↗</span></a></nav>
      <div class="home-card__stage">${demoId ? `<div class="home-demo-host" data-home-demo="${escapeHTML(demoId)}"><p class="home-demo-pending">미리보기를 불러오는 중입니다.</p></div>` : `<p class="home-demo-pending">컴포넌트를 추가하면 이곳에서 미리 볼 수 있습니다.</p>`}</div>
    </article>`;
  }).join('');
  return `<section class="collection-home" aria-labelledby="collection-title">
    <header class="home-hero"><div><p class="home-hero__eyebrow">UI / MOTION LIBRARY</p><h1 id="collection-title">컨셉 컬렉션</h1></div><span class="home-hero__count">${entries.length}개 컨셉 <b>·</b> ${count}개 컴포넌트</span></header>
    <div class="home-grid">${cards}</div>
  </section>`;
}
