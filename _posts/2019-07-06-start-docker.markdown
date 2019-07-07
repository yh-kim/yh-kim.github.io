---
layout:     post
title:      "Docker로 간편하게 Spring Boot 실행하기"
date:       2019-06-19 00:00:00
author:     "Pimi"
header-img: "img/home-bg.jpg"
header-mask: 0.3
catalog:    true
tags:
    - [Docker]
---

## Docker, Spring Boot 설치 및 개발환경 설정

#### Docker 설치
다음 링크에서 Docker Hub에 가입 후 Docker 다운로드
[Docker Hub](https://hub.docker.com/editions/community/docker-ce-desktop-mac)

#### Visual Studio Code에 Spring Boot 환경 설정
1. Visual Studio Code 설치
[Visual Studio Code - Code Editing. Redefined](https://code.visualstudio.com)
2. Spring 관련 Extensions 설치
[Spring Boot Tools](https://marketplace.visualstudio.com/items?itemName=Pivotal.vscode-spring-boot)
[Spring Initializr Java Support](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-spring-initializr)
[Spring Boot Dashboard](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-spring-boot-dashboard)
[Java Extension Pack](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack)
3. Gradle Spring Project 생성
	* File - New Window
	* Command Palette(⌘⇧P) 실행 후
	* Spring Initializr : Generate a Gradle Project 선택
	* Java
	* 프로젝트 패키지 입력
	* 프로젝트 명 입력
	* 상단 버전 선택
	* Web, DevTools 선택(Web - Tomcat 기반의 서블릿 API 사용가능한 프로젝트, DevTools - 클래스 소스 변경시 재시작 등의 기능)


#### 간단한 API 개발
1. Object 생성
``` java
package com.example.test.demo;

public class Greeting {

    private final long id;
    private final String content;

    public Greeting(long *id*, String *content*) {
        this.id = id;
        this.content = content;
    }

    public long getId() {
        return id;
    }

    public String getContent() {
        return content;
    }
}
```

2. Controller 생성
``` java
package com.example.test.demo;

import java.util.concurrent.atomic.AtomicLong;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GreetingController {

    private static final String template = "Hello, %s!";
    private final AtomicLong counter = new AtomicLong();

    @RequestMapping("/greeting")
    public Greeting greeting(@RequestParam(value="name", defaultValue="World") String *name*) {
        return new Greeting(counter.incrementAndGet(), String.format(template, name));
    }

    @RequestMapping("/")
    public String index() {
      return "Greetings from Spring Boot!";
    }
}
```


#### 도커 이미지 생성 스크립트 작성
1. build.gradle 열기

최상단에 docker 라이브러리 의존성 설정
``` groovy
buildscript {
  dependencies {
    classpath('se.transmode.gradle:gradle-docker:1.2')
  }
}
```
  
최하단에 docker 플러그인 적용 및 태스크 입력
``` groovy
apply plugin: 'docker'

task buildDocker(type: Docker, dependsOn: build) {
  // push = true
  applicationName = jar.baseName
  dockerfile = file('src/main/docker/Dockerfile')
  doFirst {
    copy {
      from jar
      into stageDir
    }
  }
}
```
  
전체 소스
``` groovy
buildscript {
  dependencies {
    classpath('se.transmode.gradle:gradle-docker:1.2')
  }
}

plugins {
  id 'org.springframework.boot' version '2.1.3.RELEASE'
  id 'java'
}

apply plugin: 'io.spring.dependency-management'

group = 'com.example.test'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '1.8'

repositories {
  mavenCentral()
}

dependencies {
  implementation 'org.springframework.boot:spring-boot-starter-web'
  runtimeOnly 'org.springframework.boot:spring-boot-devtools'
  testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

apply plugin: 'docker'

task buildDocker(type: Docker, dependsOn: build) {
  // push = true
  applicationName = jar.baseName
  dockerfile = file('src/main/docker/Dockerfile')
  doFirst {
    copy {
      from jar
      into stageDir
    }
  }
}
```

2. Dockerfile 생성
* src/main/docker/ 경로에 Dockerfile 생성

``` dockerfile
FROM openjdk:8-jdk
# 어떤 이미지로부터 새로운 이미지를 생성할 지 지정. 플랫폼 : 버전 형태로 작성
MAINTAINER yonghoon <btc_yh@naver.com>
# Dockerfile을 생성-관리하는 사람
VOLUME /tmp
# 호스트의 directory를 docker 컨테이너에 연결. 즉 소스코드나 외부 설정파일을 커밋하지 않고 docker container에서 사용가능하도록 함
RUN mkdir -p /app/
# 도커 이미지 생성시 실행
ADD demo-0.0.1-SNAPSHOT.jar /app/app.jar
# 파일이나 디렉토리를 docker image로 복사
EXPOSE 8080
# 외부에 노출할 포트 지정
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
# docker image가 실행될 때 기본으로 실행될 command
``` 

#### 도커 이미지 생성 & 컨테이너 실행

``` bash
$ ./gradlew clean
$ ./gradlew build buildDocker

# 이미지 확인(이미지아이디, 리파지토리명, 태그 확인)
$ docker images -a

# 컨테이너 실행
# docker run -p 로컬포트:8080(톰캣포트) --name 컨테이너명 -t 리파지토리명:태그
$ docker run -p 8883:8080 --name demo -t com.example.test/demo:0.0.1-SNAPSHOT

# 컨테이너 연결 종료
control(⌃) + z

# 컨테이너 아이디 확인
$ docker ps -a

# 컨테이너 정지 및 삭제
$ docker stop 컨테이너아이디
$ docker rm 컨테이너아이디
```
