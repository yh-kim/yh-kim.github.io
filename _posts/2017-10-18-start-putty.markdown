---
layout:     post
title:      "PuTTY 설치와 폰트, 배경, 기본 설정하기"
date:       2017-10-17 00:00:00
author:     "Yonghoon"
header-img: "img/in-post/start-putty/download.png"
header-mask: 0.3
catalog:    true
tags:
    - linux
    - putty
---

## 설치

PuTTY는 리눅스의 터미널 창으로 접근할 수 있게 해주는 도구다.

설치 작업이 필요 없는 실행 파일이라 어디서든 부담없이 사용할 수 있다.

다운받는 사이트 - <https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html>{:target="_blank"}

![](/img/in-post/start-putty/download.png)

PuTTY에서는 여러개의 연결 정보를 저장해 놓을 수 있다.

>Host Name에는 접속할 IP주소를 입력하고 Saved Sessions에는 IP주소와 다른 설정 정보들을 저장할 이름을 넣는다.<br>
>참고로 Saved Sessions에 이름을 넣지 않고 저장하면 Default Settings에 저장되어 다른 세션을 만들 때도 설정이 이어진다.

![](/img/in-post/start-putty/session.png)

## 설정

기본적인 설정을 해보자.

<br>
#### 1.Bell
시스템 소리는 좋아하지 않기 때문에 Bell에서 효과를 없애준다.
![](/img/in-post/start-putty/1-bell.png)

<br>
#### 2.Window
명령어를 실행하면 보여줄 수 있는 라인 수를 넉넉히 10000으로 설정하자.

스크롤 바도 보여줄 수 있게 체크
![](/img/in-post/start-putty/2-window.png)

<br>
#### 3.Appearance
Consolas 폰트 같은 경우 소문자 l과 1이 좀 헷갈리지만 쓸만하다.

Change 버튼을 눌러서 원하는 폰트로 변경할 수 있다.
![](/img/in-post/start-putty/3-appearance.png)

<br>
#### 4.Behaviour
창 닫기 전에 경고표시가 안나오게 체크

Alt + Enter를 누르면 전체 화면으로 전환하기 체크
![](/img/in-post/start-putty/4-behaviour.png)

<br>
#### 5.Translation
한글이 깨지는 경우를 방지하기 위해 인코딩은 UTF-8로 설정
![](/img/in-post/start-putty/5-translation.jpg)

<br>
#### 6.Colours
터미널 안에서 사용되는 텍스트와 배경의 색을 바꿔준다.

Select a colour to adjust에서 선택 후 RGB를 바꿔주면 된다.
![](/img/in-post/start-putty/6-colours.png)

색상은 다른 블로그를 참고했다.

이렇게 바꿔주자
![](/img/in-post/start-putty/color-list.jpg)
출처 - <http://looselytyped.blogspot.kr/2013/02/zenburn-pleasant-color-scheme-for-putty.html>{:target="_blank"}

<br>
#### 7.Save

마지막으로 까먹지말고 저장을 하자
![](/img/in-post/start-putty/7-save.png)