(function () {
  "use strict";

  var STORAGE_KEY = "switchon-diet-plan-v1";
  var PROGRAM_DAYS = 28;
  var DAY_MS = 86400000;
  var stageOrder = ["reset", "week1", "week2", "week3", "week4", "maintenance"];
  var stageMeta = {
    reset: { name: "1–3일차", shake: "1회 단백질 약 20g · 하루 4회", meal: "먹지 않음 · 아침·점심·오후 간식·저녁을 쉐이크로 구성" },
    week1: { name: "1주차", shake: "아침·오후 간식·저녁 · 하루 3회", meal: "점심 1끼 · 현미·잡곡밥 반 공기 + 단백질 충분히 + 채소·해조류·버섯" },
    week2: { name: "2주차", shake: "아침·오후 간식 · 하루 2회", meal: "점심은 밥 반 공기 저탄수식 · 저녁은 밥 없이 단백질·채소 중심" },
    week3: { name: "3주차", shake: "아침·오후 간식 · 하루 2회", meal: "점심은 밥 반 공기 저탄수식 · 저녁은 밥 없이 단백질·채소 중심" },
    week4: { name: "4주차", shake: "일반식으로 단백질이 부족할 때 보완", meal: "점심은 밥 한 공기까지 · 저녁은 밥 반 공기까지 + 단백질·채소" },
    maintenance: { name: "유지기" }
  };
  var basisGuides = {
    reset: {
      intro: "이 3일은 식품을 넓히는 기간이 아닙니다. 목록에 없다면 새 음식보다 허용 재료 안에서 해결하는 것이 우선입니다.",
      items: [
        ["목록과 거의 같은가", "두부·연두부·무가당 플레인요거트 또는 명시된 채소처럼 재료와 성격이 거의 같은 경우만 검토합니다."],
        ["일반식으로 바뀌지 않는가", "고기·생선·계란·밥을 더해 한 끼 일반식으로 만들지 않습니다. 이 기간의 중심은 하루 4회 쉐이크입니다."],
        ["조리가 단순한가", "찌기·데치기·생식처럼 단순하게 먹고 볶음, 복합 양념, 배달·외식 메뉴는 다음 단계로 미룹니다."],
        ["숨은 성분이 없는가", "요거트와 쉐이크는 원재료와 당류를 보고, 소스·분말에 밀가루나 술이 숨어 있지 않은지 확인합니다."],
        ["애매하면 기다릴 수 있는가", "허용 목록과 유사성이 분명하지 않다면 4일차 이후 다시 판단하는 편이 이 단계의 목적에 맞습니다."]
      ],
      note: "가장 엄격한 구간 · 새 식품과 일반식은 추가하지 않습니다."
    },
    week1: {
      intro: "4일차부터 점심 한 끼가 일반식으로 바뀝니다. 목록 밖 음식은 점심의 저탄수 식사 구조를 지키는지부터 봅니다.",
      items: [
        ["점심 한 끼에 들어가는가", "일반식은 점심 1회로 두고 아침·오후 간식·저녁은 쉐이크 흐름을 유지합니다."],
        ["밥 양이 맞는가", "현미밥이나 잡곡밥은 반 공기 정도로 두고, 다른 곡물·감자·면과 한 끼에 겹치지 않게 합니다."],
        ["단백질이 중심인가", "닭고기·생선·계란·두부·수육·해산물처럼 단순 조리한 자연식 단백질을 충분히 확보합니다."],
        ["채소가 비슷한가", "목록 밖이어도 상추·깻잎·애호박처럼 저당 비전분성 채소라면 조리법과 양을 보고 검토할 수 있습니다."],
        ["아직 이른 음식은 아닌가", "과일, 고구마·단호박 같은 전분성 식품, 달콤한 양념과 고가공 식품은 뒤 단계로 미룹니다."]
      ],
      note: "점심 1끼 · 밥 반 공기 · 단백질과 채소를 충분히"
    },
    week2: {
      intro: "일반식이 점심과 저녁으로 늘어납니다. 같은 음식도 점심에는 가능하지만 저녁에는 탄수화물 때문에 맞지 않을 수 있습니다.",
      items: [
        ["어느 끼니에 먹는가", "점심은 밥 반 공기를 곁들인 저탄수식, 저녁은 밥·곡물·전분 없이 단백질과 채소로 구성합니다."],
        ["탄수화물이 겹치지 않는가", "점심에 현미·잡곡·흰쌀밥 중 하나를 고르고 다른 탄수화물 공급원은 함께 넣지 않습니다."],
        ["견과류는 무첨가인가", "견과류와 견과버터는 설탕·시럽·밀가루가 없는 제품인지 확인하고 식사의 일부로 적정량 사용합니다."],
        ["저녁에 덜어낼 수 있는가", "외식 메뉴는 밥·면·튀김옷을 빼고 소스와 국물을 줄였을 때 단백질·채소 식사가 되는지 봅니다."],
        ["가공보다 원재료가 중심인가", "제품 이름보다 원재료를 보고, 자연식 단백질과 채소보다 가공 성분이 많으면 더 단순한 대안을 고릅니다."]
      ],
      note: "점심은 밥 반 공기 · 저녁은 탄수화물 없이"
    },
    week3: {
      intro: "과일과 탄수화물 선택지가 넓어지지만 한 끼에 여러 공급원을 쌓는 단계는 아닙니다. 종류와 양, 먹는 끼니를 함께 봅니다.",
      items: [
        ["기본 식사 구조를 지키는가", "점심은 밥 반 공기 저탄수식, 저녁은 밥 없이 단백질·채소 중심이라는 기본 흐름을 유지합니다."],
        ["추가된 탄수화물인가", "고구마·단호박·바나나·밤은 사용할 수 있지만 밥이나 다른 과일과 같은 끼니에 겹치지 않게 합니다."],
        ["목록 밖 과일의 양이 작은가", "사과·참외·자몽 등은 자동 허용하지 않고 1회 양과 하루 전체 탄수화물을 보고 소량 조건부로 판단합니다."],
        ["단백질이 충분한가", "저지방 소고기까지 선택지를 넓히되 지방이 많은 부위와 소스가 식사의 중심이 되지 않게 합니다."],
        ["형태가 원물에 가까운가", "생과일은 주스·청·말린 과일과 다르게 보고, 곡물도 밀가루 혼합 여부와 가공도를 확인합니다."]
      ],
      note: "탄수화물은 한 끼에 한 종류 · 목록 밖 과일은 소량부터"
    },
    week4: {
      intro: "허용식품을 더 외우기보다 실제 한 끼의 구조와 하루 전체 흐름을 점검하는 단계입니다.",
      items: [
        ["끼니별 밥 양이 맞는가", "점심은 밥 한 공기까지, 저녁은 반 공기까지를 기준으로 활동량과 허기에 맞춰 줄여서 조절합니다."],
        ["매끼 단백질이 있는가", "고기·생선·계란·두부·해산물 등 자연식 단백질을 매끼 확보하고 쉐이크는 부족할 때만 보완합니다."],
        ["채소와 함께 먹는가", "탄수화물만 단독으로 먹지 않고 비전분성 채소와 단백질을 함께 구성해 한 끼 균형을 맞춥니다."],
        ["외식도 구조가 같은가", "메뉴 이름보다 단백질 주재료, 채소, 탄수화물 양을 보고 소스·국물·튀김옷을 조절합니다."],
        ["한 끼보다 하루가 안정적인가", "한 번의 선택보다 하루 전체의 단백질, 채소, 탄수화물 중복과 식사 지속성을 함께 봅니다."]
      ],
      note: "점심 밥 한 공기까지 · 저녁 반 공기까지 · 매끼 단백질"
    }
  };
  var additions = {
    reset: ["양배추", "당근", "두부", "마늘", "무", "양파", "연두부", "오이", "무가당 플레인요거트", "브로콜리"],
    week1: ["간장", "계란", "버섯", "강황", "닭고기", "고추냉이", "생선", "올리브오일", "고춧가루", "생선회", "들기름", "수육", "녹차", "식초", "해산물", "아보카도", "잡곡밥", "현미밥", "해조류", "코코넛오일", "후추", "허브티"],
    week2: ["견과류", "흰쌀밥"],
    week3: ["고구마", "단호박", "바나나", "토마토", "저지방 소고기", "밤"],
    week4: [],
    maintenance: []
  };

  var plan = null;
  var storedPlan = null;
  var isOwner = false;
  var editMode = false;
  var newPlanMode = false;
  var viewStage = "reset";
  var collator = typeof Intl !== "undefined" && Intl.Collator ? new Intl.Collator("ko") : null;
  var startButton = document.getElementById("start-button");
  var startSetup = document.getElementById("start-setup");
  var startForm = document.getElementById("start-form");
  var startDateInput = document.getElementById("start-date");
  var startDateLabel = document.getElementById("start-date-label");
  var startSubmit = document.getElementById("start-submit");
  var planResetButton = document.getElementById("plan-reset");
  var setupCancel = document.getElementById("setup-cancel");
  var sharedActions = document.getElementById("shared-actions");
  var adoptPlanButton = document.getElementById("adopt-plan");
  var newPlanButton = document.getElementById("new-plan");
  var schedule = document.getElementById("schedule");
  var calendar = document.getElementById("calendar");
  var calendarHint = document.getElementById("calendar-hint");
  var schedulePeriod = document.getElementById("schedule-period");
  var shareButton = document.getElementById("share-button");
  var snackbar = document.getElementById("snackbar");
  var confirmLayer = document.getElementById("confirm-layer");
  var confirmTitle = document.getElementById("confirm-title");
  var confirmCancel = document.getElementById("confirm-cancel");
  var confirmAccept = document.getElementById("confirm-accept");
  var confirmResolve = null;
  var confirmPreviousFocus = null;
  var stageTabs = Array.prototype.slice.call(document.querySelectorAll("[data-stage]"));
  var shakeLine = document.getElementById("shake-line");
  var basisTitle = document.getElementById("basis-title");
  var stageBasis = document.getElementById("stage-basis");
  var basisChecklist = document.querySelector(".basis-checklist");
  var commonBasis = document.querySelector(".common-basis");
  var selectionBasis = document.querySelector(".selection-basis");
  var maintenanceGuide = document.getElementById("maintenance-guide");
  var stageMealGuide = document.getElementById("stage-meal-guide");
  var newFoodBlock = document.getElementById("new-food-block");
  var newFoodList = document.getElementById("new-food-list");
  var foodList = document.getElementById("food-list");
  var mealLine = document.getElementById("meal-line");

  function pad(value) { return String(value).padStart(2, "0"); }

  function toDateKey(date) {
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
  }

  function parseDate(value) {
    var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
    if (!match) { return null; }
    var date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    return toDateKey(date) === value ? date : null;
  }

  function addDays(date, amount) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
  }

  function dayDifference(left, right) {
    var leftUtc = Date.UTC(left.getFullYear(), left.getMonth(), left.getDate());
    var rightUtc = Date.UTC(right.getFullYear(), right.getMonth(), right.getDate());
    return Math.round((leftUtc - rightUtc) / DAY_MS);
  }

  function isPlan(value) {
    return value && parseDate(value.start) && Array.isArray(value.fasting);
  }

  function normalizePlan(value) {
    var start = parseDate(value.start);
    var end = addDays(start, PROGRAM_DAYS - 1);
    var fasting = value.fasting.filter(function (dateKey, index, items) {
      var date = parseDate(dateKey);
      return date && date >= start && date <= end && items.indexOf(dateKey) === index;
    }).sort();
    fasting = fasting.filter(function (dateKey, index, items) {
      return index === 0 || dayDifference(parseDate(dateKey), parseDate(items[index - 1])) > 1;
    });
    return { start: value.start, fasting: fasting };
  }

  function plansEqual(left, right) {
    return Boolean(left && right && JSON.stringify(normalizePlan(left)) === JSON.stringify(normalizePlan(right)));
  }

  function readCookie() {
    var prefix = encodeURIComponent(STORAGE_KEY) + "=";
    var pairs = document.cookie ? document.cookie.split(";") : [];
    for (var index = 0; index < pairs.length; index += 1) {
      var pair = pairs[index].trim();
      if (pair.indexOf(prefix) === 0) {
        try { return JSON.parse(decodeURIComponent(pair.slice(prefix.length))); } catch (error) { return null; }
      }
    }
    return null;
  }

  function readStoredPlan() {
    var value = null;
    try { value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null"); } catch (error) { value = null; }
    if (!isPlan(value)) { value = readCookie(); }
    return isPlan(value) ? normalizePlan(value) : null;
  }

  function decodeCompactPlan(value) {
    if (!value) { return null; }
    var sections = value.split("-");
    if (sections.length > 2 || !/^\d{6}$/.test(sections[0])) { return null; }
    var start = "20" + sections[0].slice(0, 2) + "-" + sections[0].slice(2, 4) + "-" + sections[0].slice(4, 6);
    var startDate = parseDate(start);
    if (!startDate) { return null; }
    var fasting = [];
    if (sections[1]) {
      var offsets = sections[1].split(".");
      for (var index = 0; index < offsets.length; index += 1) {
        var offset = Number(offsets[index]);
        if (!/^\d{1,2}$/.test(offsets[index]) || offset < 1 || offset > PROGRAM_DAYS) { return null; }
        fasting.push(toDateKey(addDays(startDate, offset - 1)));
      }
    }
    return normalizePlan({ start: start, fasting: fasting });
  }

  function readUrlPlan() {
    var params = new URLSearchParams(window.location.search);
    var compact = decodeCompactPlan(params.get("p"));
    if (compact) { return compact; }
    var start = params.get("start") || "";
    var fast = params.get("fast") || "";
    var legacy = { start: start, fasting: fast ? fast.split(",") : [] };
    return isPlan(legacy) ? normalizePlan(legacy) : null;
  }

  function encodeCompactPlan(value) {
    var start = parseDate(value.start);
    var datePart = String(start.getFullYear()).slice(-2) + pad(start.getMonth() + 1) + pad(start.getDate());
    var offsets = value.fasting.map(function (dateKey) {
      return dayDifference(parseDate(dateKey), start) + 1;
    }).filter(function (offset) { return offset >= 1 && offset <= PROGRAM_DAYS; });
    return datePart + (offsets.length ? "-" + offsets.join(".") : "");
  }

  function savePlan() {
    var serialized = JSON.stringify(plan);
    try { window.localStorage.setItem(STORAGE_KEY, serialized); } catch (error) { /* cookie fallback below */ }
    document.cookie = encodeURIComponent(STORAGE_KEY) + "=" + encodeURIComponent(serialized) + "; max-age=31536000; path=/; SameSite=Lax";
    storedPlan = normalizePlan(plan);
    isOwner = true;
  }

  function sortFoods(items) {
    return items.sort(function (left, right) { return collator ? collator.compare(left, right) : left.localeCompare(right); });
  }

  function unique(items) { return items.filter(function (item, index) { return items.indexOf(item) === index; }); }

  function getStage(dayNumber) {
    if (dayNumber <= 3) { return "reset"; }
    if (dayNumber <= 7) { return "week1"; }
    if (dayNumber <= 14) { return "week2"; }
    if (dayNumber <= 21) { return "week3"; }
    return "week4";
  }

  function getStageFoods(stage) {
    var selectedIndex = stageOrder.indexOf(stage);
    var earlier = [];
    stageOrder.slice(0, selectedIndex).forEach(function (stageName) { earlier = earlier.concat(additions[stageName]); });
    return {
      added: stage === "reset" ? [] : sortFoods(unique(additions[stage].slice())),
      available: sortFoods(unique((stage === "reset" ? additions.reset : earlier).slice()))
    };
  }

  function formatLong(date) { return (date.getMonth() + 1) + "월 " + date.getDate() + "일"; }

  function formatPeriod(start, end) {
    var startText = start.getFullYear() + ". " + (start.getMonth() + 1) + ". " + start.getDate();
    var endText = (start.getFullYear() === end.getFullYear() ? "" : end.getFullYear() + ". ") + (end.getMonth() + 1) + ". " + end.getDate();
    return startText + " — " + endText;
  }

  function createFoodItem(food) {
    var item = document.createElement("li");
    item.textContent = food;
    return item;
  }

  function appendFastHalf(node, position) {
    var half = document.createElement("i");
    node.classList.add("has-fast-half");
    half.className = "fast-half fast-half-" + position;
    half.setAttribute("aria-hidden", "true");
    node.appendChild(half);
  }

  function renderFoods(stage) {
    var isMaintenance = stage === "maintenance";
    maintenanceGuide.hidden = !isMaintenance;
    stageMealGuide.hidden = isMaintenance;
    foodList.hidden = isMaintenance;
    selectionBasis.hidden = isMaintenance;
    if (isMaintenance) {
      newFoodBlock.hidden = true;
      return;
    }
    var foods = getStageFoods(stage);
    newFoodList.innerHTML = "";
    foodList.innerHTML = "";
    foods.added.forEach(function (food) { newFoodList.appendChild(createFoodItem(food)); });
    foods.available.forEach(function (food) { foodList.appendChild(createFoodItem(food)); });
    newFoodBlock.hidden = foods.added.length === 0;
    shakeLine.textContent = stageMeta[stage].shake;
    mealLine.textContent = stageMeta[stage].meal;
    stageBasis.textContent = basisGuides[stage].intro;
    basisTitle.textContent = stageMeta[stage].name + " · 목록에 없다면";
    basisChecklist.innerHTML = "";
    basisGuides[stage].items.forEach(function (guide, index) {
      var item = document.createElement("li");
      item.innerHTML = "<b>" + pad(index + 1) + "</b><div><strong></strong><p></p></div>";
      item.querySelector("strong").textContent = guide[0];
      item.querySelector("p").textContent = guide[1];
      basisChecklist.appendChild(item);
    });
    commonBasis.innerHTML = "<strong>이 단계의 기준</strong> " + basisGuides[stage].note;
  }

  function getTimelineState() {
    if (!plan) { return null; }
    var start = parseDate(plan.start);
    var dayNumber = dayDifference(new Date(), start) + 1;
    if (dayNumber < 1) {
      return { stage: "reset" };
    }
    if (dayNumber > PROGRAM_DAYS) {
      return { stage: "maintenance" };
    }
    return { stage: getStage(dayNumber) };
  }

  function renderStageBrowser() {
    stageTabs.forEach(function (button) {
      var selected = button.dataset.stage === viewStage;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", selected ? "true" : "false");
      button.tabIndex = selected ? 0 : -1;
    });
    renderFoods(viewStage);
  }

  function renderCalendarHint(start) {
    if (editMode) {
      calendarHint.innerHTML = "<i aria-hidden=\"true\"></i> 날짜를 눌러 단식 시작일을 선택하세요";
      return;
    }
    if (!plan.fasting.length) {
      calendarHint.textContent = "단식일 없음";
      return;
    }
    var days = plan.fasting.map(function (dateKey) { return dayDifference(parseDate(dateKey), start) + 1; });
    calendarHint.innerHTML = "<i aria-hidden=\"true\"></i>24시간 단식 · " + days.map(function (day) { return day + "일째 오후 → " + (day + 1) + "일째 오전"; }).join(" · ");
  }

  function renderReadCalendar(start, todayKey) {
    var stages = [
      { key: "reset", start: 0, end: 2 },
      { key: "week1", start: 3, end: 6 },
      { key: "week2", start: 7, end: 13 },
      { key: "week3", start: 14, end: 20 },
      { key: "week4", start: 21, end: 27 }
    ];
    var weekdayNames = ["일", "월", "화", "수", "목", "금", "토"];
    var today = parseDate(todayKey);
    var phaseKey = document.createElement("div");
    var weekdayRow = document.createElement("div");
    var monthGrid = document.createElement("div");

    phaseKey.className = "calendar-phase-key";
    stages.forEach(function (range) {
      var rangeStart = addDays(start, range.start);
      var rangeEnd = addDays(start, range.end);
      var name = document.createElement("strong");
      var dates = document.createElement("span");
      var item = document.createElement("div");
      item.className = "calendar-phase stage-" + range.key;
      if (today >= rangeStart && today <= rangeEnd) {
        item.classList.add("is-current");
        item.setAttribute("aria-current", "step");
      }
      name.textContent = range.key === "reset" ? "1–3일" : stageMeta[range.key].name.replace("차", "");
      dates.textContent = (rangeStart.getMonth() + 1) + "." + rangeStart.getDate() + "–" + (rangeEnd.getMonth() + 1) + "." + rangeEnd.getDate();
      item.appendChild(name);
      item.appendChild(dates);
      phaseKey.appendChild(item);
    });

    weekdayRow.className = "calendar-read-weekdays";
    weekdayNames.forEach(function (weekday) {
      var label = document.createElement("span");
      label.textContent = weekday;
      weekdayRow.appendChild(label);
    });

    monthGrid.className = "calendar-read-grid";
    for (var blankIndex = 0; blankIndex < start.getDay(); blankIndex += 1) {
      var blank = document.createElement("span");
      blank.className = "calendar-month-blank";
      blank.setAttribute("aria-hidden", "true");
      monthGrid.appendChild(blank);
    }
    for (var index = 0; index < PROGRAM_DAYS; index += 1) {
      var date = addDays(start, index);
      var dateKey = toDateKey(date);
      var stage = getStage(index + 1);
      var isFastStart = plan.fasting.indexOf(dateKey) !== -1;
      var isFastEnd = plan.fasting.indexOf(toDateKey(addDays(date, -1))) !== -1;
      var day = document.createElement("span");
      var month = document.createElement("small");
      var dayNumber = document.createElement("strong");

      day.className = "calendar-month-day stage-" + stage;
      day.setAttribute("aria-label", formatLong(date) + ", " + stageMeta[stage].name + (isFastStart ? ", 오후부터 단식 시작" : "") + (isFastEnd ? ", 오전까지 단식" : ""));
      month.textContent = index === 0 || date.getDate() === 1 ? (date.getMonth() + 1) + "월" : "";
      dayNumber.textContent = date.getDate();
      day.appendChild(month);
      day.appendChild(dayNumber);
      if (isFastEnd) { appendFastHalf(day, "end"); }
      if (isFastStart) { appendFastHalf(day, "start"); }
      if (dateKey === todayKey) { day.classList.add("is-today"); }
      monthGrid.appendChild(day);
    }

    calendar.appendChild(phaseKey);
    calendar.appendChild(weekdayRow);
    calendar.appendChild(monthGrid);
  }

  function renderCalendar() {
    var start = parseDate(plan.start);
    var end = addDays(start, PROGRAM_DAYS - 1);
    var todayKey = toDateKey(new Date());
    var weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    calendar.innerHTML = "";
    calendar.classList.toggle("is-editing", editMode);
    calendar.classList.toggle("is-reading", !editMode);
    if (!editMode) {
      renderReadCalendar(start, todayKey);
      schedulePeriod.textContent = formatPeriod(start, end);
      renderCalendarHint(start);
      return;
    }
    weekdays.forEach(function (weekday) {
      var label = document.createElement("span");
      label.className = "weekday";
      label.textContent = weekday;
      calendar.appendChild(label);
    });
    for (var blankIndex = 0; blankIndex < start.getDay(); blankIndex += 1) {
      var blank = document.createElement("span");
      blank.className = "calendar-blank";
      blank.setAttribute("aria-hidden", "true");
      calendar.appendChild(blank);
    }
    for (var index = 0; index < PROGRAM_DAYS; index += 1) {
      var date = addDays(start, index);
      var dateKey = toDateKey(date);
      var stage = getStage(index + 1);
      var isFastStart = plan.fasting.indexOf(dateKey) !== -1;
      var isFastEnd = plan.fasting.indexOf(toDateKey(addDays(date, -1))) !== -1;
      var button = document.createElement("button");
      button.type = "button";
      button.className = "calendar-day stage-" + stage;
      button.dataset.date = dateKey;
      button.disabled = false;
      button.setAttribute("aria-pressed", isFastStart ? "true" : "false");
      button.setAttribute("aria-label", formatLong(date) + (isFastStart ? " 오후부터 단식 시작" : isFastEnd ? " 오전까지 단식, 새로운 단식 시작일로 선택할 수 없음" : " 단식 시작일로 선택"));
      if (isFastEnd) { appendFastHalf(button, "end"); }
      if (isFastStart) { appendFastHalf(button, "start"); }
      if (dateKey === todayKey) { button.classList.add("is-today"); }
      if (index === 0 || index === 3 || index === 7 || index === 14 || index === 21) {
        var stageMark = document.createElement("small");
        stageMark.textContent = stageMeta[stage].name;
        button.appendChild(stageMark);
      }
      var day = document.createElement("strong");
      day.textContent = date.getDate();
      button.appendChild(day);
      if (date.getDate() === 1 || index === 0) {
        var month = document.createElement("span");
        month.textContent = (date.getMonth() + 1) + "월";
        button.appendChild(month);
      }
      calendar.appendChild(button);
    }
    schedulePeriod.textContent = formatPeriod(start, end);
    renderCalendarHint(start);
  }

  function updateOwnerControls() {
    var hasPlan = Boolean(plan);
    var isSharedPlan = hasPlan && !isOwner;
    startButton.hidden = isSharedPlan;
    sharedActions.hidden = !isSharedPlan;
    if (!hasPlan) {
      startButton.textContent = "내 다이어트 시작";
      startButton.setAttribute("aria-pressed", "false");
      return;
    }
    startButton.textContent = editMode ? "완료" : "편집";
    startButton.setAttribute("aria-pressed", editMode ? "true" : "false");
  }

  function renderPlanner() {
    var hasPlan = Boolean(plan);
    schedule.hidden = !hasPlan;
    shareButton.hidden = !hasPlan;
    document.body.classList.toggle("has-plan", hasPlan);
    document.body.classList.toggle("is-editing", editMode);
    planResetButton.hidden = !(hasPlan && isOwner && editMode);
    updateOwnerControls();
    if (hasPlan) {
      startDateInput.value = plan.start;
      startDateLabel.textContent = "시작일 변경";
      startSubmit.textContent = "변경";
      startSetup.hidden = !(isOwner && editMode);
      renderCalendar();
    }
    renderStageBrowser();
  }

  function openNewPlanSetup(fromSharedPlan) {
    newPlanMode = Boolean(fromSharedPlan);
    startDateInput.value = toDateKey(new Date());
    startDateLabel.textContent = "내 다이어트 시작일";
    startSubmit.textContent = "다이어트 시작";
    planResetButton.hidden = true;
    startSetup.hidden = false;
    startButton.setAttribute("aria-expanded", "true");
    startDateInput.focus();
  }

  function toggleEditMode() {
    if (!plan || !isOwner) { return; }
    editMode = !editMode;
    startSetup.hidden = !editMode;
    startButton.setAttribute("aria-expanded", editMode ? "true" : "false");
    renderPlanner();
  }

  function closeSetup() {
    newPlanMode = false;
    if (plan && isOwner) {
      editMode = false;
      renderPlanner();
    } else {
      startSetup.hidden = true;
      startButton.setAttribute("aria-expanded", "false");
    }
  }

  function closeConfirm(accepted) {
    if (confirmLayer.hidden || !confirmResolve) { return; }
    var resolve = confirmResolve;
    confirmResolve = null;
    confirmLayer.hidden = true;
    document.body.classList.remove("has-confirm");
    resolve(accepted);
    if (confirmPreviousFocus && confirmPreviousFocus.isConnected) { confirmPreviousFocus.focus(); }
    confirmPreviousFocus = null;
  }

  function askConfirm(message, acceptLabel, danger) {
    if (confirmResolve) { closeConfirm(false); }
    confirmPreviousFocus = document.activeElement;
    confirmTitle.textContent = message;
    confirmAccept.textContent = acceptLabel;
    confirmAccept.classList.toggle("is-danger", Boolean(danger));
    confirmLayer.hidden = false;
    document.body.classList.add("has-confirm");
    window.setTimeout(function () { confirmCancel.focus(); }, 0);
    return new Promise(function (resolve) { confirmResolve = resolve; });
  }

  async function resetPlan() {
    if (!(await askConfirm("저장된 일정을 초기화할까요?", "초기화", true))) { return; }
    try { window.localStorage.removeItem(STORAGE_KEY); } catch (error) { /* cookie removal below */ }
    document.cookie = encodeURIComponent(STORAGE_KEY) + "=; max-age=0; path=/; SameSite=Lax";
    plan = null;
    storedPlan = null;
    isOwner = false;
    editMode = false;
    newPlanMode = false;
    viewStage = "reset";
    startSetup.hidden = true;
    window.history.replaceState(null, "", window.location.pathname);
    renderPlanner();
    showSnackbar("일정을 초기화했어요");
  }

  function buildShareUrl() {
    var url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("p", encodeCompactPlan(plan));
    return url.toString();
  }

  function fallbackCopy(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    var copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    return copied;
  }

  function showCopied() {
    shareButton.classList.add("is-done");
    showSnackbar("일정 링크를 복사했어요");
    window.setTimeout(function () {
      shareButton.classList.remove("is-done");
    }, 1400);
  }

  function showSnackbar(message) {
    snackbar.textContent = message;
    snackbar.classList.add("is-visible");
    window.clearTimeout(showSnackbar.timer);
    showSnackbar.timer = window.setTimeout(function () {
      snackbar.classList.remove("is-visible");
    }, 2100);
  }

  function copyShareUrl() {
    var shareUrl = buildShareUrl();
    var copyPromise;
    if (navigator.clipboard && window.isSecureContext) {
      copyPromise = navigator.clipboard.writeText(shareUrl);
    } else {
      copyPromise = fallbackCopy(shareUrl) ? Promise.resolve() : Promise.reject(new Error("copy failed"));
    }
    copyPromise.then(showCopied).catch(function () {
      if (fallbackCopy(shareUrl)) { showCopied(); } else { showSnackbar("복사하지 못했어요"); }
    });
  }

  startButton.addEventListener("click", function () {
    if (plan) { toggleEditMode(); } else { openNewPlanSetup(false); }
  });
  newPlanButton.addEventListener("click", function () { openNewPlanSetup(true); });
  adoptPlanButton.addEventListener("click", async function () {
    if (!plan || isOwner) { return; }
    if (!(await askConfirm("이 일정으로 시작할까요?", "시작", false))) { return; }
    savePlan();
    editMode = false;
    newPlanMode = false;
    window.history.replaceState(null, "", window.location.pathname);
    renderPlanner();
    showSnackbar("내 일정으로 저장했어요");
  });
  stageTabs.forEach(function (button) {
    button.addEventListener("click", function () {
      viewStage = button.dataset.stage;
      renderStageBrowser();
    });
  });
  setupCancel.addEventListener("click", closeSetup);
  planResetButton.addEventListener("click", resetPlan);
  confirmCancel.addEventListener("click", function () { closeConfirm(false); });
  confirmAccept.addEventListener("click", function () { closeConfirm(true); });
  confirmLayer.addEventListener("click", function (event) {
    if (event.target === confirmLayer) { closeConfirm(false); }
  });
  document.addEventListener("keydown", function (event) {
    if (confirmLayer.hidden) { return; }
    if (event.key === "Escape") {
      event.preventDefault();
      closeConfirm(false);
      return;
    }
    if (event.key === "Tab") {
      if (event.shiftKey && document.activeElement === confirmCancel) {
        event.preventDefault();
        confirmAccept.focus();
      } else if (!event.shiftKey && document.activeElement === confirmAccept) {
        event.preventDefault();
        confirmCancel.focus();
      }
    }
  });
  startForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!parseDate(startDateInput.value)) { return; }
    var keepFasting = !newPlanMode && plan && plan.start === startDateInput.value ? plan.fasting : [];
    plan = normalizePlan({ start: startDateInput.value, fasting: keepFasting });
    savePlan();
    window.history.replaceState(null, "", window.location.pathname);
    newPlanMode = false;
    viewStage = getTimelineState().stage;
    editMode = true;
    renderPlanner();
  });
  calendar.addEventListener("click", function (event) {
    var button = event.target.closest(".calendar-day");
    if (!button || !editMode || !isOwner) { return; }
    var dateKey = button.dataset.date;
    var index = plan.fasting.indexOf(dateKey);
    if (index === -1) {
      var date = parseDate(dateKey);
      var previousKey = toDateKey(addDays(date, -1));
      var nextKey = toDateKey(addDays(date, 1));
      if (plan.fasting.indexOf(previousKey) !== -1 || plan.fasting.indexOf(nextKey) !== -1) {
        showSnackbar("단식 시작일은 연속으로 선택할 수 없어요");
        return;
      }
      plan.fasting.push(dateKey);
    } else {
      plan.fasting.splice(index, 1);
    }
    plan.fasting.sort();
    savePlan();
    renderCalendar();
  });
  shareButton.addEventListener("click", copyShareUrl);

  storedPlan = readStoredPlan();
  var urlPlan = readUrlPlan();
  plan = urlPlan || storedPlan;
  isOwner = Boolean(storedPlan && (!urlPlan || plansEqual(urlPlan, storedPlan)));
  if (plan) { viewStage = getTimelineState().stage; }
  renderPlanner();
}());
