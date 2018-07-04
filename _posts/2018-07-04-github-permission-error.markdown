---
layout:     post
title:      "소스트리 Github remote: Permission to 에러"
date:       2018-07-04 00:00:00
author:     "Pimi"
header-img: "img/home-bg.jpg"
header-mask: 0.3
catalog:    true
tags:
    - Github
---

다른 사람 노트북으로 Push하려고 했는데 에러가 났다!!

<http://recoveryman.tistory.com/392>{:target="_blank"}
<br>이 블로그에 SSH키 추가하는 방법, 자격증명 변경 방법이 나온다.
이 두 방법 다 나한텐 안먹혔다.


해결 방법
1. 켜져있는 소스트리는 종료한다.
2. C:\Users\username\AppData\Local\Atlassian\SourceTree 폴더로 가서 userhosts, passwd 삭제한 후 소스트리를 킨다.(accounts.json 파일에는 아틀라시안 로그인 정보, 깃허브 정보 등이 있음. 삭제해도 무관하며 해결이 안되면 삭제 해보길)
3. Push할 때 깃허브 아이디와 비밀번호를 치면 해결.

참고로
![](/img/in-post/github-permission-error/capture1.JPG)
이 부분의 이메일이 깃허브의 이메일과 다르면
![](/img/in-post/github-permission-error/capture2.JPG)
깃허브에 이렇게 표시된다. 그뿐만 아니라 daily commit 수에도 집계되지 않는다.