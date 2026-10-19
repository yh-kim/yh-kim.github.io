/** The visual reference is intentionally static: every live control lives in the gallery. */
export function designMarkup() {
  return `
    <div class="design-system">
      <header class="design-lead">
        <div>
          <p class="eyebrow">VISUAL SYSTEM / 01</p>
          <h1>화면을 읽고, 조작하고,<br>다시 가져가기 위한 기준</h1>
        </div>
        <p>갤러리는 컴포넌트의 작업 공간입니다. 바깥 구조는 조용하게 유지하고, 제품마다 필요한 밀도와 색은 실제 미리보기 안에서 결정합니다.</p>
      </header>

      <section class="design-chapter" aria-labelledby="design-type">
        <div class="design-heading">
          <p class="design-index">01 / TYPE</p>
          <div><h2 id="design-type">문장은 먼저 읽혀야 합니다</h2><p>시스템 글꼴 한 벌로 제목, 본문, 보조 정보를 구분합니다. 긴 한국어 제목과 작업명은 자연스럽게 줄바꿈합니다.</p></div>
        </div>
        <div class="design-content type-samples">
          <div class="type-sample"><span class="type-label">페이지 제목</span><strong class="type-display">컴포넌트 갤러리</strong><span class="type-measure">32 / 1.3</span></div>
          <div class="type-sample"><span class="type-label">목록 제목</span><strong class="type-title">주문 내역과 현재 상태</strong><span class="type-measure">20 / 1.4</span></div>
          <div class="type-sample"><span class="type-label">본문</span><span class="type-body">현재 상태와 결과를 가까이 두어, 선택한 동작이 무엇을 바꿨는지 바로 확인합니다.</span><span class="type-measure">14 / 1.6</span></div>
          <div class="type-sample"><span class="type-label">보조 정보</span><span class="type-caption">선택 결과 · 마지막 업데이트 · 사용 방법</span><span class="type-measure">12 / 1.6</span></div>
        </div>
      </section>

      <section class="design-chapter" aria-labelledby="design-color">
        <div class="design-heading">
          <p class="design-index">02 / COLOR</p>
          <div><h2 id="design-color">분류와 행동에만 강조색을 씁니다</h2><p>종이색, 잉크, 경계선이 기본 구조를 만듭니다. 인디고는 현재 위치와 명시적인 행동에 사용합니다.</p></div>
        </div>
        <div class="design-content">
          <div class="color-list" aria-label="갤러리 색상 토큰">
            <div class="color-chip"><div class="color-swatch" style="--sample:#fffefa"></div><div class="color-desc"><b>표면</b><span>#FFFEFA</span></div></div>
            <div class="color-chip"><div class="color-swatch" style="--sample:#232632"></div><div class="color-desc"><b>본문</b><span>#232632</span></div></div>
            <div class="color-chip"><div class="color-swatch" style="--sample:#e0e0dc"></div><div class="color-desc"><b>경계</b><span>#E0E0DC</span></div></div>
            <div class="color-chip"><div class="color-swatch" style="--sample:#454da4"></div><div class="color-desc"><b>선택·행동</b><span>#454DA4</span></div></div>
          </div>
          <p class="design-caption">이 색은 탐색 화면의 바탕입니다. 차트, 캘린더, 검토창처럼 목적이 다른 컴포넌트에는 각자의 상태 색과 표면을 둡니다.</p>
        </div>
      </section>

      <section class="design-chapter" aria-labelledby="design-space">
        <div class="design-heading">
          <p class="design-index">03 / SPACE</p>
          <div><h2 id="design-space">공간으로 정보의 관계를 만듭니다</h2><p>작은 간격은 같은 제어 안에서, 큰 간격은 제목과 실제 작업 영역 사이에서 사용합니다.</p></div>
        </div>
        <div class="design-content spacing-list" aria-label="간격 기준">
          <div class="spacing-row"><code>08</code><span class="spacing-bar" style="--sample-width:8px"></span><span>아이콘과 라벨</span></div>
          <div class="spacing-row"><code>12</code><span class="spacing-bar" style="--sample-width:12px"></span><span>연관된 정보</span></div>
          <div class="spacing-row"><code>16</code><span class="spacing-bar" style="--sample-width:16px"></span><span>입력과 결과</span></div>
          <div class="spacing-row"><code>24</code><span class="spacing-bar" style="--sample-width:24px"></span><span>카드 안의 구획</span></div>
          <div class="spacing-row"><code>36</code><span class="spacing-bar" style="--sample-width:36px"></span><span>독립된 섹션</span></div>
        </div>
      </section>

      <section class="design-chapter" aria-labelledby="design-usage">
        <div class="design-heading">
          <p class="design-index">04 / APPLICATION</p>
          <div><h2 id="design-usage">같은 원칙, 서로 다른 제품</h2><p>모션은 장식보다 상태의 연결에 사용합니다. 컴포넌트 목록의 미리보기에서 아래 행동을 실제로 확인할 수 있습니다.</p></div>
        </div>
        <div class="design-content">
          <div class="application-list">
            <article class="application"><p class="eyebrow">CONTENT / FAQ</p><h3>질문과 답을 한 흐름에서 읽기</h3><p>자주 묻는 질문은 항목을 열어 답을 확인하고 다시 접을 수 있습니다. 긴 답도 잘리지 않고 주변 내용이 자연스럽게 이동합니다.</p></article>
            <article class="application"><p class="eyebrow">DATA / ORDERS</p><h3>필터와 주문 결과를 연결</h3><p>고객·주문 검색, 상태 필터, 정렬이 같은 주문 목록에 적용됩니다. 선택한 주문은 한 번에 배송 완료로 바꿀 수 있습니다.</p></article>
            <article class="application"><p class="eyebrow">FORM / NEWSLETTER</p><h3>입력 바로 곁에서 결과 알리기</h3><p>구독 폼은 이름·이메일·동의를 확인하고 오류를 입력 곁에 설명합니다. 올바른 제출 뒤에는 성공 상태를 같은 영역에 보여 줍니다.</p></article>
            <article class="application"><p class="eyebrow">INPUT / TAGS</p><h3>입력과 선택을 한곳에 모으기</h3><p>태그는 입력, 추천, 칩 삭제로 편집합니다. 중복·글자 수·최대 개수 오류를 알리고 현재 태그를 미리보기에도 반영합니다.</p></article>
            <article class="application"><p class="eyebrow">COMMERCE / CART</p><h3>수량과 소계를 함께 계산</h3><p>장바구니 드로어에서 상품을 추가하거나 수량을 바꾸면 소계가 곧바로 갱신됩니다. 삭제한 상품도 목록에서 다시 담을 수 있습니다.</p></article>
            <article class="application"><p class="eyebrow">OVERLAY / DELETE</p><h3>대상을 확인한 뒤 삭제</h3><p>파일 삭제창은 정확한 파일명을 입력해야 완료할 수 있습니다. 닫으면 초점이 돌아오고, 완료 뒤에는 실행 취소가 나타납니다.</p></article>
          </div>
          <div class="design-details">
            <details><summary>동작 시간과 접근성 기준</summary><p>대부분의 상태 변화는 약 140–280ms, 차트 수치 전환은 약 300ms를 기준으로 합니다. 주요 제어는 44px 이상이며 키보드 초점을 분명하게 표시합니다. 동작 줄이기를 선택하면 중간 이동을 건너뛰고 최종 데이터와 결과는 그대로 보여 줍니다.</p></details>
            <details><summary>반응형 구성 기준</summary><p>넓은 화면의 갤러리는 두 열입니다. 좁은 화면에서는 한 열로 바뀌며, 미리보기의 모든 주요 제어가 보입니다. 컴포넌트 내부도 자신의 사용 가능한 폭을 기준으로 다시 배치합니다.</p></details>
          </div>
        </div>
      </section>
    </div>`;
}

export function designWire() {
  return () => {};
}
