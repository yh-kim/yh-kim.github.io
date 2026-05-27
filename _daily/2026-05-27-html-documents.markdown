---
layout:     post
title:      "HTML 문서 모음"
subtitle:   "별도 HTML로 배포한 문서 목록"
date:       2026-05-27 00:00:00
permalink:  /daily/html-documents/
author:     "Pimi"
header-img: "img/home-bg.jpg"
header-mask: 0.3
catalog:    true
tags:
    - HTML
---

블로그 글 안에 넣기보다 별도 HTML 페이지로 보는 편이 좋은 문서들을 모아둡니다.

{% assign documents = site.data.html_documents | sort: "date" | reverse %}

{% for document in documents %}
### [{{ document.title }}]({{ document.path | relative_url }}){:target="_blank"}

{{ document.description }}

{% if document.tags %}
`{{ document.tags | join: "`, `" }}`
{% endif %}

{% if document.date %}
<span class="post-meta">{{ document.date }}</span>
{% endif %}

---
{% endfor %}
