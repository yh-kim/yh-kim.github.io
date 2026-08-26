(function () {
  'use strict';

  var MAX_FILE_BYTES = 10 * 1024 * 1024;
  var HTML_EXTENSION = /\.html?$/i;
  var RESOURCE_SELECTOR = [
    'link[href]',
    'script[src]',
    'img[src]',
    'img[srcset]',
    'source[src]',
    'source[srcset]',
    'video[src]',
    'video[poster]',
    'audio[src]',
    'iframe[src]',
    'embed[src]',
    'object[data]',
    'input[type="image"][src]'
  ].join(',');

  var app = document.getElementById('app');
  var emptyView = document.getElementById('empty-view');
  var viewerView = document.getElementById('viewer-view');
  var fileInput = document.getElementById('html-file-input');
  var emptyError = document.getElementById('empty-error');
  var fileName = document.getElementById('file-name');
  var fileMeta = document.getElementById('file-meta');
  var renderFrame = document.getElementById('render-frame');
  var renderPanel = document.getElementById('render-panel');
  var sourcePanel = document.getElementById('source-panel');
  var sourceCode = document.getElementById('source-code');
  var notice = document.getElementById('notice');
  var noticeText = document.getElementById('notice-text');
  var liveStatus = document.getElementById('live-status');
  var renderButton = document.getElementById('render-button');
  var sourceButton = document.getElementById('source-button');
  var reloadButton = document.getElementById('reload-button');
  var openFileButton = document.getElementById('open-file-button');
  var expandButton = document.getElementById('expand-button');
  var closeButton = document.getElementById('close-button');
  var dismissNotice = document.getElementById('dismiss-notice');
  var copyButton = document.getElementById('copy-button');

  var state = {
    source: '',
    name: '',
    size: 0,
    mode: 'render',
    monitorToken: '',
    expanded: false
  };

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(bytes < 10240 ? 1 : 0) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function announce(message) {
    liveStatus.textContent = '';
    window.setTimeout(function () { liveStatus.textContent = message; }, 20);
  }

  function showEmptyError(message) {
    emptyError.textContent = message;
    emptyError.hidden = false;
    announce(message);
  }

  function clearEmptyError() {
    emptyError.textContent = '';
    emptyError.hidden = true;
  }

  function showNotice(message) {
    noticeText.textContent = message;
    notice.hidden = false;
  }

  function clearNotice() {
    noticeText.textContent = '';
    notice.hidden = true;
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function highlightSource(source) {
    var pattern = /<!--[\s\S]*?-->|<!doctype\s[^>]*>|<\/?[A-Za-z][^>]*>/gi;
    var result = '';
    var cursor = 0;
    var match;

    while ((match = pattern.exec(source))) {
      result += escapeHtml(source.slice(cursor, match.index));
      result += '<span class="' + (match[0].slice(0, 4) === '<!--' ? 'syntax-comment' : 'syntax-tag') + '">' + escapeHtml(match[0]) + '</span>';
      cursor = match.index + match[0].length;
    }

    return result + escapeHtml(source.slice(cursor));
  }

  function isLocalReference(value) {
    var trimmed = String(value || '').trim();
    if (!trimmed || trimmed.charAt(0) === '#') return false;
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(trimmed)) return false;
    return true;
  }

  function srcsetHasLocalReference(value) {
    return String(value || '').split(',').some(function (candidate) {
      return isLocalReference(candidate.trim().split(/\s+/)[0]);
    });
  }

  function findLocalResources(source) {
    var findings = [];

    try {
      var parsed = new DOMParser().parseFromString(source, 'text/html');
      parsed.querySelectorAll(RESOURCE_SELECTOR).forEach(function (node) {
        Array.from(node.attributes).forEach(function (attribute) {
          var isResourceAttribute = /^(?:src|href|poster|data)$/i.test(attribute.name);
          var isSrcset = attribute.name.toLowerCase() === 'srcset';
          if ((isResourceAttribute && isLocalReference(attribute.value)) || (isSrcset && srcsetHasLocalReference(attribute.value))) {
            findings.push(attribute.value);
          }
        });
      });
    } catch (_) {
      // DOMParser failures should never stop the viewer.
    }

    var cssPattern = /(?:url\(\s*['"]?([^'"\)]+)|@import\s+(?:url\()?\s*['"]([^'"]+))/gi;
    var cssMatch;
    while ((cssMatch = cssPattern.exec(source))) {
      var cssReference = cssMatch[1] || cssMatch[2];
      if (isLocalReference(cssReference)) findings.push(cssReference);
    }

    return Array.from(new Set(findings));
  }

  function createMonitorToken() {
    if (window.crypto && window.crypto.getRandomValues) {
      var values = new Uint32Array(2);
      window.crypto.getRandomValues(values);
      return values[0].toString(16) + values[1].toString(16);
    }
    return Date.now().toString(16) + Math.random().toString(16).slice(2);
  }

  function withErrorMonitor(source, token) {
    var script = '<script>(function(){var t=' + JSON.stringify(token) + ';function s(m){try{parent.postMessage({type:"html-viewer-error",token:t,message:String(m||"알 수 없는 오류")},"*")}catch(_){}}addEventListener("error",function(e){s(e.message)});addEventListener("unhandledrejection",function(e){s(e.reason&&e.reason.message||e.reason)});})();<\/script>';
    var headPattern = /<head(?:\s[^>]*)?>/i;
    if (headPattern.test(source)) return source.replace(headPattern, function (head) { return head + script; });

    var doctypePattern = /<!doctype[^>]*>/i;
    if (doctypePattern.test(source)) return source.replace(doctypePattern, function (doctype) { return doctype + script; });
    return script + source;
  }

  function renderSource() {
    state.monitorToken = createMonitorToken();
    renderFrame.removeAttribute('srcdoc');
    renderFrame.src = 'about:blank';

    window.setTimeout(function () {
      renderFrame.srcdoc = withErrorMonitor(state.source, state.monitorToken);
    }, 0);
  }

  function setMode(mode) {
    state.mode = mode;
    var sourceIsActive = mode === 'source';
    sourcePanel.hidden = !sourceIsActive;
    renderPanel.hidden = sourceIsActive;
    sourceButton.classList.toggle('is-active', sourceIsActive);
    sourceButton.setAttribute('aria-pressed', String(sourceIsActive));
    renderButton.classList.toggle('is-active', !sourceIsActive);
    renderButton.setAttribute('aria-pressed', String(!sourceIsActive));
    announce(sourceIsActive ? '소스 보기' : '결과 보기');
  }

  function setExpanded(expanded) {
    state.expanded = expanded;
    viewerView.classList.toggle('is-expanded', expanded);
    document.body.classList.toggle('viewer-expanded', expanded);
    expandButton.classList.toggle('is-active', expanded);
    expandButton.setAttribute('aria-pressed', String(expanded));
    expandButton.querySelector('span').textContent = expanded ? '축소' : '넓게';
    announce(expanded ? '넓게 보기' : '기본 크기 보기');
  }

  function openViewer(file, source) {
    var localResources = findLocalResources(source);
    state.source = source;
    state.name = file.name;
    state.size = file.size;
    fileName.textContent = file.name;
    fileMeta.textContent = formatBytes(file.size) + ' · 기기에서만 처리';
    sourceCode.innerHTML = highlightSource(source);
    clearEmptyError();
    clearNotice();

    if (localResources.length) {
      showNotice('이 HTML은 별도의 CSS/JS/이미지 파일을 참조하고 있어 일부 내용이 정상적으로 표시되지 않을 수 있습니다.');
    }

    emptyView.hidden = true;
    viewerView.hidden = false;
    setMode('render');
    renderSource();
    document.title = file.name + ' · HTML Viewer';
    announce(file.name + ' 파일을 열었습니다.');
  }

  function readFile(file) {
    if (file.text) return file.text();

    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(String(reader.result || '')); };
      reader.onerror = function () { reject(reader.error || new Error('파일 읽기 실패')); };
      reader.readAsText(file);
    });
  }

  async function handleFile(file) {
    clearEmptyError();
    if (!file) return;

    if (!HTML_EXTENSION.test(file.name)) {
      showEmptyError('HTML 또는 HTM 파일만 선택할 수 있습니다.');
      fileInput.value = '';
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      showEmptyError('파일이 너무 큽니다. 10MB 이하의 HTML 파일을 선택하세요.');
      fileInput.value = '';
      return;
    }

    try {
      var source = await readFile(file);
      if (!source.trim()) {
        showEmptyError('파일이 비어 있습니다. 내용이 있는 HTML 파일을 선택하세요.');
        fileInput.value = '';
        return;
      }
      openViewer(file, source);
    } catch (_) {
      showEmptyError('파일을 읽지 못했습니다. 파일을 다시 선택해 주세요.');
      fileInput.value = '';
    }
  }

  function closeViewer() {
    state.source = '';
    state.name = '';
    state.size = 0;
    state.monitorToken = '';
    renderFrame.removeAttribute('srcdoc');
    renderFrame.src = 'about:blank';
    sourceCode.textContent = '';
    clearNotice();
    setExpanded(false);
    viewerView.hidden = true;
    emptyView.hidden = false;
    fileInput.value = '';
    document.title = 'HTML Viewer';
    announce('초기 화면으로 돌아왔습니다.');
  }

  async function copySource() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(state.source);
      } else {
        var textarea = document.createElement('textarea');
        textarea.value = state.source;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
      copyButton.textContent = '복사됨';
      announce('소스를 복사했습니다.');
      window.setTimeout(function () { copyButton.textContent = '복사'; }, 1200);
    } catch (_) {
      showNotice('소스를 복사하지 못했습니다. 길게 눌러 직접 선택해 주세요.');
    }
  }

  fileInput.addEventListener('change', function () {
    handleFile(fileInput.files && fileInput.files[0]);
  });
  openFileButton.addEventListener('click', function () { fileInput.click(); });
  reloadButton.addEventListener('click', function () {
    clearNotice();
    var localResources = findLocalResources(state.source);
    if (localResources.length) showNotice('이 HTML은 별도의 CSS/JS/이미지 파일을 참조하고 있어 일부 내용이 정상적으로 표시되지 않을 수 있습니다.');
    renderSource();
    setMode('render');
    announce('HTML을 새로 렌더링했습니다.');
  });
  renderButton.addEventListener('click', function () { setMode('render'); });
  sourceButton.addEventListener('click', function () { setMode('source'); });
  expandButton.addEventListener('click', function () { setExpanded(!state.expanded); });
  closeButton.addEventListener('click', closeViewer);
  dismissNotice.addEventListener('click', clearNotice);
  copyButton.addEventListener('click', copySource);

  window.addEventListener('message', function (event) {
    if (event.source !== renderFrame.contentWindow || !event.data || event.data.type !== 'html-viewer-error') return;
    if (event.data.token !== state.monitorToken) return;
    showNotice('HTML 내부 JavaScript 오류: ' + String(event.data.message || '알 수 없는 오류'));
  });

  window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && state.expanded) setExpanded(false);
  });

  if ('serviceWorker' in navigator && window.isSecureContext) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js', { scope: './', updateViaCache: 'none' }).catch(function () {
        // Offline support is optional at runtime; a registration failure must not break viewing.
      });
    });
  }
}());
