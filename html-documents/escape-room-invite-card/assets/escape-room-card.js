(() => {
    const inviteData = window.escapeRoomInviteData;
    if (!inviteData) return;

    const atStartOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const addDays = (date, days) => {
      const next = atStartOfDay(date);
      next.setDate(next.getDate() + days);
      return next;
    };

    const isSameDay = (a, b) => (
      a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate()
    );

    const startOfWeek = (date, weekStartsOn = 0) => {
      const start = atStartOfDay(date);
      const diff = (start.getDay() - weekStartsOn + 7) % 7;
      start.setDate(start.getDate() - diff);
      return start;
    };

    const parseKoreanMonthDay = (text, baseYear) => {
      const match = text.match(/(\d+)월\s*(\d+)일/);
      if (!match) return null;
      return new Date(baseYear, Number(match[1]) - 1, Number(match[2]));
    };

    const reservationQueryKey = "m";
    const cardReservationTokens = {
      "1.html": "v8k2",
      "2.html": "q4n7",
      "3.html": "p6w1",
      "4.html": "z9c3",
      "5.html": "n3t8",
      "6.html": "h7r5",
      "7.html": "d2m9",
      "8.html": "x5a4"
    };
    const currentCardFile = window.location.pathname.split("/").pop();
    const reservationQueryValue = cardReservationTokens[currentCardFile] || "";
    const searchParams = new URLSearchParams(window.location.search);
    const showReservation = searchParams.get(reservationQueryKey) === reservationQueryValue;
    const hasReservationTime = Boolean(inviteData.reservedDate && inviteData.reservedTime);
    const shouldShowReservation = hasReservationTime && showReservation;
    const today = new Date();
    const hasReservedYear = Number.isInteger(inviteData.reservedYear);
    const eventDate = hasReservationTime
      ? parseKoreanMonthDay(inviteData.reservedDate, hasReservedYear ? inviteData.reservedYear : today.getFullYear())
      : null;

    if (eventDate && !hasReservedYear && eventDate < atStartOfDay(today)) {
      eventDate.setFullYear(eventDate.getFullYear() + 1);
    }

    const reservationStatus = () => {
      if (!eventDate) return "status-undated";

      const todayStart = atStartOfDay(today);
      const eventStart = atStartOfDay(eventDate);
      if (isSameDay(eventStart, todayStart)) return "status-today";
      return eventStart < todayStart ? "status-past" : "status-upcoming";
    };

    document.querySelector(".invite")?.classList.add("reservation-status", reservationStatus());

    if (!shouldShowReservation) {
      document.querySelectorAll(".intro-reservation").forEach((node) => {
        node.remove();
      });
    } else {
      document.querySelectorAll(".intro-reservation").forEach((node) => {
        node.removeAttribute("hidden");
      });
    }

    document.title = inviteData.label;
    document.documentElement.style.setProperty("--poster-url", `url("${inviteData.posterUrl}")`);
    if (inviteData.posterAspectRatio) {
      document.documentElement.style.setProperty("--poster-aspect-ratio", inviteData.posterAspectRatio);
    }

    document.querySelectorAll("[data-field]").forEach((node) => {
      const key = node.dataset.field;
      node.textContent = inviteData[key] || "";
    });

    const toggleReservationQuery = () => {
      const url = new URL(window.location.href);
      if (showReservation) {
        url.searchParams.delete(reservationQueryKey);
      } else {
        url.searchParams.set(reservationQueryKey, reservationQueryValue);
      }
      window.location.replace(url.toString());
    };

    document.querySelectorAll('[data-field="price"]').forEach((node) => {
      node.addEventListener("dblclick", (event) => {
        event.preventDefault();
        toggleReservationQuery();
      });
    });

    document.querySelectorAll("[data-image]").forEach((node) => {
      const key = node.dataset.image;
      node.src = inviteData[key] || "";
      node.alt = `${inviteData.title} 포스터`;
    });

    document.querySelectorAll("[data-link]").forEach((node) => {
      const key = node.dataset.link;
      if (inviteData[key]) {
        node.href = inviteData[key];
      } else {
        node.removeAttribute("href");
      }
    });

    document.querySelectorAll("[data-time-range]").forEach((node) => {
      if (!hasReservationTime) {
        node.hidden = true;
        node.textContent = "";
        return;
      }

      const [hour, minute] = inviteData.reservedTime.split(":").map(Number);
      const start = hour * 60 + minute;
      const end = start + inviteData.playMinutes;
      const format = (value) => {
        const dayMinutes = ((value % 1440) + 1440) % 1440;
        return `${String(Math.floor(dayMinutes / 60)).padStart(2, "0")}:${String(dayMinutes % 60).padStart(2, "0")}`;
      };
      node.textContent = `${format(start)} - ${format(end)}`;
    });

    document.querySelectorAll("[data-play-minutes]").forEach((node) => {
      node.textContent = `${inviteData.playMinutes}분`;
    });

    const statTone = (label, value) => {
      const text = String(value || "").replace(/\s/g, "");

      if (text.includes("없음") || text.includes("낮음")) return "stat-none";
      if (text.includes("쉬움") || text.includes("적음")) return "stat-low";
      if (text.includes("보통") || text.includes("중간")) return "stat-mid";
      if (text.includes("높음") || text.includes("어려움") || text.includes("많음")) return "stat-high";
      if (label === "공포도") return "stat-none";
      return "stat-mid";
    };

    const buildStatPill = (label, value) => {
      const pill = document.createElement("span");
      const name = document.createElement("span");
      const text = document.createElement("strong");

      pill.className = `stat-pill ${statTone(label, value)}`;
      name.textContent = label;
      text.textContent = value;
      pill.append(name, text);
      return pill;
    };

    document.querySelectorAll("[data-stat-pills]").forEach((node) => {
      node.replaceChildren(
        buildStatPill("난이도", inviteData.difficulty),
        buildStatPill("공포도", inviteData.fear),
        buildStatPill("활동성", inviteData.activity)
      );
    });

    const buildWeekDotCalendar = ({
      todayDate = new Date(),
      eventDate,
      weekStartsOn = 0
    }) => {
      const todayStart = atStartOfDay(todayDate);
      const eventStart = atStartOfDay(eventDate);
      const isPastEvent = eventStart < todayStart;
      const firstWeek = startOfWeek(isPastEvent ? eventStart : todayStart, weekStartsOn);
      const lastWeek = startOfWeek(eventStart, weekStartsOn);
      const weekCount = isPastEvent ? 1 : Math.max(1, Math.round((lastWeek - firstWeek) / (7 * 24 * 60 * 60 * 1000)) + 1);
      const root = document.createElement("div");

      root.className = "week-calendar-inner";

      for (let week = 0; week < weekCount; week += 1) {
        const row = document.createElement("div");
        row.className = "week-row";

        for (let day = 0; day < 7; day += 1) {
          const date = addDays(firstWeek, week * 7 + day);
          const dot = document.createElement("span");
          const isToday = isSameDay(date, todayStart);
          const isEvent = isSameDay(date, eventStart);
          const dayOfWeek = date.getDay();

          dot.className = "week-dot";
          if (dayOfWeek === 0) dot.classList.add("is-sunday");
          if (dayOfWeek === 6) dot.classList.add("is-saturday");
          if (isToday) dot.classList.add("today");
          if (isEvent) dot.classList.add("event");
          dot.setAttribute("aria-label", `${date.getMonth() + 1}월 ${date.getDate()}일${isToday ? " 오늘" : ""}${isEvent ? " 예약 당일" : ""}`);
          row.append(dot);
        }

        root.append(row);
      }

      return root;
    };

    const buildCalendarLegend = () => {
      const legend = document.createElement("div");
      const todayItem = document.createElement("span");
      const eventItem = document.createElement("span");

      legend.className = "week-calendar-legend";
      todayItem.innerHTML = '<span class="legend-dot legend-today" aria-hidden="true"></span><span>오늘</span>';
      eventItem.innerHTML = '<span class="legend-dot legend-event" aria-hidden="true"></span><span>예약</span>';
      legend.append(todayItem, eventItem);
      return legend;
    };

    const renderWeekDotCalendar = (selector, options) => {
      document.querySelectorAll(selector).forEach((node) => {
        node.replaceChildren(buildWeekDotCalendar(options), buildCalendarLegend());
      });
    };

    if (eventDate && shouldShowReservation) {
      renderWeekDotCalendar("[data-week-calendar]", {
        todayDate: today,
        eventDate,
        weekStartsOn: 0
      });
    } else {
      document.querySelectorAll("[data-week-calendar]").forEach((node) => {
        node.hidden = true;
      });
    }

    const showToast = (message) => {
      const snackbar = document.querySelector("[data-snackbar]");
      if (!snackbar) return;

      snackbar.textContent = message;
      snackbar.classList.add("is-visible");
      clearTimeout(showToast.timer);
      showToast.timer = setTimeout(() => {
        snackbar.classList.remove("is-visible");
      }, 2100);
    };

    const setButtonDone = (button, message) => {
      const originalTitle = button.title;
      button.classList.add("is-done");
      button.title = message;
      setTimeout(() => {
        button.classList.remove("is-done");
        button.title = originalTitle;
      }, 1400);
    };

    const copyUrl = () => {
      const url = new URL(window.location.href);
      url.search = "";
      url.hash = "";

      if (shouldShowReservation) {
        url.searchParams.set(reservationQueryKey, reservationQueryValue);
      }

      return url.toString();
    };

    const invitationText = () => {
      const time = document.querySelector("[data-time-range]")?.textContent || "";
      const lines = [
        `🎆 테마: ${inviteData.title}`,
        `📍 매장: ${inviteData.store} (${inviteData.area})`,
        `🎭 정보: ${inviteData.genre} · ${inviteData.playMinutes}분 · ${inviteData.price}`,
        `🧩 난이도: ${inviteData.difficulty} / 공포도: ${inviteData.fear} / 활동성: ${inviteData.activity}`,
        "",
        copyUrl()
      ];

      if (shouldShowReservation) {
        lines.splice(2, 0, `🗓️ 예약: ${inviteData.reservedDate} ${time}`);
      }

      return lines.join("\n");
    };

    const copyText = async (text) => {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
      }

      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.append(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    };

    const closeCopyMenu = () => {
      document.querySelector(".copy-menu")?.remove();
      document.querySelector("[data-copy-info]")?.setAttribute("aria-expanded", "false");
    };

    const copyByMode = async (mode, button) => {
      const text = mode === "link" ? copyUrl() : invitationText();
      try {
        await copyText(text);
        setButtonDone(button, "복사했어요");
        showToast("복사 완료");
      } catch {
        setButtonDone(button, "복사 실패");
        showToast("복사에 실패했어요");
      }
    };

    const openCopyMenu = (button) => {
      closeCopyMenu();

      const menu = document.createElement("div");
      const linkButton = document.createElement("button");
      const fullButton = document.createElement("button");

      menu.className = "copy-menu";
      menu.setAttribute("role", "menu");
      menu.setAttribute("aria-label", "복사 방식 선택");
      linkButton.type = "button";
      linkButton.textContent = "링크만 복사";
      linkButton.dataset.copyMode = "link";
      fullButton.type = "button";
      fullButton.textContent = "전체 정보 복사";
      fullButton.dataset.copyMode = "full";
      menu.append(linkButton, fullButton);
      button.closest(".action-dock")?.append(menu);
      button.setAttribute("aria-expanded", "true");
      linkButton.focus();
    };

    document.querySelector("[data-copy-info]")?.addEventListener("click", (event) => {
      event.stopPropagation();
      const button = event.currentTarget;
      const isOpen = Boolean(document.querySelector(".copy-menu"));

      if (isOpen) {
        closeCopyMenu();
        return;
      }

      openCopyMenu(button);
    });

    document.addEventListener("click", async (event) => {
      const modeButton = event.target.closest("[data-copy-mode]");
      if (!modeButton) {
        closeCopyMenu();
        return;
      }

      event.stopPropagation();
      const copyButton = document.querySelector("[data-copy-info]");
      const mode = modeButton.dataset.copyMode;
      closeCopyMenu();
      if (copyButton) await copyByMode(mode, copyButton);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeCopyMenu();
    });

    document.querySelectorAll("[data-list-link]").forEach((node) => {
      const listUrl = new URL(node.href);
      listUrl.search = "";
      listUrl.hash = "";
      node.href = listUrl.toString();
    });
})();
