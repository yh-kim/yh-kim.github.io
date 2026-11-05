(() => {
  const digest = async (text) => {
    const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
  };

  const koreaDate = (date = new Date()) => new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit"
  }).format(date);

  const masterToken = (date = new Date()) => digest(`escape-master-v1|l8s2|${koreaDate(date)}`);

  const parseCards = (value, tokens) => {
    if (!value || !/^\d+(,\d+)*$/.test(value)) return [];
    const ids = Array.from(new Set(value.split(",")));
    if (ids.some((id) => !tokens[`${id}.html`])) return [];
    return ids.sort((a, b) => Number(a) - Number(b));
  };

  const selectionToken = (ids, tokens) => digest("escape-selection-v1|" + ids
    .map((id) => `${id}:${tokens[`${id}.html`]}`).join("|"));

  window.escapeListAccess = { masterToken, parseCards, selectionToken };
})();
