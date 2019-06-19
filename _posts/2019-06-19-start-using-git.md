---
layout:     post
title:      "Git 기본 조작 방법"
date:       2019-06-19 00:00:00
author:     "Pimi"
header-img: "img/home-bg.jpg"
header-mask: 0.3
catalog:    true
tags:
    - [Git]
---

> 자세한 가이드 내용은 Git [홈페이지 문서](https://git-scm.com/book/ko/v2)에서 확인이 가능하다.

## 설치
[Git 홈페이지](https://git-scm.com/)에서 설치

## 명령어
#### 생성
Git 생성 `$ git init`  
Git 클론 `$ git clone 'URL'`

#### 저장
###### 작성자 정보 입력
``` bash
$ git config --global user.name 'NAME'
$ git config --global user.email 'EMAIL'

# 조회
$ git config --global -list
```
> - 해당 저장소에만 작성자 정보를 입력하기 위해선 --global을 빼고 입력  
> - 이미 커밋한 작성자 정보를 변경하기 위해선 [여기](#작성자(Author)-변경) 참조

###### 변경사항 관리
``` bash
# 브랜치 정보
$ git branch

# 브랜치 생성 -> Git을 생성(init)하면 초기 커밋 이후 브랜치 생성 가능
$ git branch NAME

# 브랜치 변경
$ git checkout NAME

# 서버에 있는 branch checkout
$ git checkout -b dev origin/dev

# 변경사항 추가. 모든 파일 반영시 파일명을 '.'으로 입력
$ git add 파일명

# 커밋
$ git commit -m "커밋내용"

# Remote 추가 (git remote add 리모트명 URL)
$ git remote add origin https://github.com/name/repository.git

# Push (git push 리모트명 -u 브랜치명)
$ git push origin -u master

# Fetch
$ git fetch

# Pull (-r은 리베이스)
$ git pull -r
```

#### Git 상태 확인
[참고](https://git-scm.com/book/ko/v1/Git%EC%9D%98-%EA%B8%B0%EC%B4%88-%EC%BB%A4%EB%B0%8B-%ED%9E%88%EC%8A%A4%ED%86%A0%EB%A6%AC-%EC%A1%B0%ED%9A%8C%ED%95%98%EA%B8%B0)
``` bash
$ git log
$ git show
# working tree status
$ git status
```

## TIP

#### gitignore 적용이 안될 때
``` bash
$ git rm -r --cached .
$ git add .
```

#### 작성자(Author) 변경
``` bash
# 변경할 커밋 hash 확인(변경하고 싶은 커밋의 이전 커밋 해시 확인)
$ git log

# 특정 커밋 이후부터 변경하는 경우
$ git rebase -i -p HASH값

# 초기 커밋부터 변경하는 경우
$ git rebase -i --root
```
