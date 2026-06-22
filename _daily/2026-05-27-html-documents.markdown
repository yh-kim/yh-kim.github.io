---
layout:     post
title:      "HTML 문서 모음"
subtitle:   "별도 HTML로 배포한 문서 목록"
date:       2026-05-27 00:00:00
permalink:  /daily/p/
author:     "Pimi"
header-img: "img/home-bg.jpg"
header-mask: 0.3
catalog:    true
tags:
    - HTML
---

블로그 글 안에 넣기보다 별도 HTML 페이지로 보는 편이 좋은 문서들을 모아둡니다.

{% assign documents = site.data.html_documents | sort: "date" | reverse %}

<div class="html-document-list">
{% for document in documents %}
<a class="html-document-item" href="{{ document.path | relative_url }}" target="_blank" rel="noopener">
  <span class="html-document-main">
    <strong class="html-document-title">{{ document.title }}</strong>
    <span class="html-document-description">{{ document.description }}</span>
  </span>
  <span class="html-document-meta">
    {% if document.tags %}
    <span class="html-document-tags">{{ document.tags | join: " · " }}</span>
    {% endif %}
    {% if document.date %}
    <time class="html-document-date" datetime="{{ document.date }}">{{ document.date }}</time>
    {% endif %}
  </span>
</a>
{% endfor %}
</div>
