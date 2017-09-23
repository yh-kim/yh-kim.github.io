---
layout:     post
title:      "[안드로이드] 메뉴 아이콘 색상 넣기"
subtitle:   "xml에서 색상 넣는 방법"
date:       2017-09-23 00:00:00
author:     "Yonghoon"
header-img: "img/in-post/post-eleme-pwa/eleme-at-io.jpg"
header-mask: 0.3
catalog:    true
tags:
    - Android
    - 안드로이드
    - Java
    - Color
    - Icon
---

툴바에 아이콘을 넣을 때 색상을 변경하려면 styles.xml에 아래와 같이 입력하면 된다.

```
<style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
	<item name="colorPrimary">@color/colorPrimary</item>
	<item name="colorPrimaryDark">@color/colorPrimaryDark</item>
	<item name="colorAccent">@color/colorAccent</item>


	<!-- Customize color of menu icon in toolbar. -->
	<item name="android:textColorSecondary">@color/colorWhite</item>
		
</style>
```

<script src="https://gist.github.com/yh-kim/686056f70ef497560c929cae57b7fcb9.js"></script>