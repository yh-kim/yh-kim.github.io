---
layout:     post
title:      "Java와 IntelliJ 시작하기"
subtitle:   "Java 설치, IntelliJ 설치 방법에 대해 알아봅니다"
date:       2017-09-26 00:00:00
author:     "Yonghoon"
header-img: "img/home-bg.jpg"
header-mask: 0.3
catalog:    true
tags:
    - Java
    - IntelliJ
---

<br>
<iframe width="560" height="315" src="https://www.youtube.com/embed/m7mvpe1fVa4?rel=0" frameborder="0" allowfullscreen></iframe>

## Java

#### 설치

Java 설치 : <http://www.oracle.com/technetwork/java/javase/downloads/index.html>{:target="_blank"}

------------------------

[차이점](https://www.java.com/ko/download/faq/techinfo.xml){:tartget="_blank"}

Java SE는 일반적인 개발을 도와준다.

JAVA SE (Java Platform Standard Edition)
데스크톱, 서버, 임베디드시스템을 위한 표준 자바 플랫폼. 자바 가상머신 규격 및 API집합을 포함 JAVA EE,ME는 목적에 따라 SE를 기반으로 기존의 일부를 택하거나 API를 추가하여 구성된다. SE는 가장 일반적으로 사용된다. JDBC나 기본적인 기능이 모두 포함되어 있기 때문에 Android개발할때 주로 SE를 사용한다.

------------------------

Java EE는 SE 버전에서 더 나아가 Enterprise 개발도 할 수 있게 해준다.

JAVA EE (Java Platform EnterPrise Edition)
1. 자바를 이용한 서버측 개발을 위한 플랫폼. 기존 SE에 웹 애플리케이션 서버에서 동작하는 분산 멀티미디어를 제공하는 자바의 기능을 추가한 서버를 위한 플랫폼. JAVA SE에 서버측을 위한 기능을 부가하였기 때문에 SE기능을 모두 포함한다.

2. 엔터프라이즈 환경을 위한 도구로 EJB, JSP, Servlet, JNDI같은 기능을 지원하며 웹 애플리케이션 서버를 이용하는 프로그램 개발시 많이 사용한다. J2EE는 웹기반의 엔터프라이즈 애플리케이션을 구축하기 위한 썬의 플랫폼이다. J2EE 서비스는 사용자의 브라우저와, 엔터프라이즈 데이터베이스 및 레거시 정보시스템 사이의 중간계층에서 수행된다. J2EE의 핵심요소는, JSP와 자바 서블릿, 그리고 기업내의 정보자원을 하나로 묶기 위한 다양한 인터페이스들의 뒤를 이은 EJB이다. J2EE 인터페이스는 데이터베이스를 위해 JDBC를, 디렉토리를 위해서는 JNDI를, 트랜잭션을 위해서는 JTA를, 메시징을 위해서는 JMS를, 전자우편시스템을 위해서는 JavaMail을, 그리고 CORBA와의 접속을 위해서는 JavaIDL을 각각 포함한다. 1999년 12월에, 최초의 공식적인 버전으로는 최초로 J2EE 버전 1.2가 발표되었으며, 다양한 레거시 애플리케이션과의 인터페이스를 위한 자바커넥터는 2000년 중에 발표될 것으로 예상된다.

자바 version별 차이점 -> 테이블 형식

* [JDK5~7](http://docs.oracle.com/javase/7/docs/technotes/guides/language/enhancements.html){:target="_blank"}
* [JDK8](http://www.oracle.com/technetwork/java/javase/8-whats-new-2157071.html){:target="_blank"}
* [JDK9](http://docs.oracle.com/javase/9/whatsnew/toc.htm){:target="_blank"}

1. JDK 1.5
- 2004년
- 기능적으로 가장 많은 변화가 생긴버전 (Generics가 가장 대표적)
- LanguageI: Generics , annotation, auto boxing, enum,vararg ,foreach, static imports 도입
- API : java.util.concurrent API, scanner class

2. JDK 1.6
- 2006년도
- 기능에 별 차이 없음 - 보안, 성능강화 주력. 
- JVM/Swing에 있어 많은 Performance 향상(synchronization, compiler, GC,start-up time)
- G1(Garbage First) GC도입.

3. JDK 1.7
- 2011 
- JVM : Dynamic Language support (invokedynamic - new byte operation)
- Language : Switch에서 String, try-resource, generics에서 타입추론, 숫자에서 underscore사용
- API:Concurrency 강화, NIO 강화, sort강화, crypto강화, GPU강화, 
- JavaFX가 기본으로 포함
- 안정적인 ARM지원


4. JDK 1.8
- 2014
- 오라클로 인수된 후 첫번째 버전
-  JDK 1.5이후 가장 큰 언어적 변화(Lambda및 함수형프로그래밍,default method)이며 러닝커브가 크다.
- JEP에 의해서 새로운 기능들이 발의되기 시작.
- Language : Lambda expression, Default Method Interface, functional programming for MapReduce style 지원, default method이용한 다중상속지원,메소드 참조
- API : Nashorn (JS엔진), new Date and Time API, stream api,Collection에 대한 함수형화 (Interface에 default가 생김으로서 가능)
- 병철처리에 접합한 구조로 진화

5. JDK 1.9
- 2016 예정
- Modular System (Jigsaw)지원예정
- Money API지원예정
- Java Shell지원예정
- 변수에 대한 타입 추론 지원예정(var,val)
- OpenCL이용한 자동화된 병렬 프로그래밍 지원예정
- value 타입 지원예정


|      | Samsung 64 GB | Intel X25-M | Samsung 840 EVO | Micron P420m | HDD |
|------|---------------|-------------|-----------------|--------------|-----|
| Brand/Model | Samsung (MCCDE64G5MPP-OVA) | Intel X25-M (SSDSA2MH080G1GC) | Samsung (SSD 840 EVO mSATA) | Micron P420m | Western Digital Black 7200 rpm | 
| Memory cell type | MLC | MLC | TLC | MLC | * |
| Release year | 2008 | 2008 | 2013 | 2013 | 2013 |
| Interface | SATA 2.0 | SATA 2.0 | SATA 3.0 | PCIe 2.0 | SATA 3.0 |
| Total capacity | 64 GB | 80 GB | 1 TB | 1.4 TB | 4 TB |
| Pages per block | 128 | 128 | 256 | 512 | * |
| Page size | 4 KB | 4 KB | 8 KB | 16 KB | * |

설치하고

## IntelliJ

#### 설치
[설치](https://www.jetbrains.com/idea/download/#section=windows){:target="_blank"}

#### 활용

Java 프로젝트 Import

Java 프로젝트 Export

[꿀팁](http://www.kwangsiklee.com/ko/2016/12/인텔리j-활용꿀팁-42가지/){:target="_blank"}