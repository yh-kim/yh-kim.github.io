---
layout:     post
title:      "Toolbar 사용하기"
subtitle:   "안드로이드에서 Toolbar를 다루어봅니다"
date:       2017-09-23 00:00:00
author:     "Pimi"
header-img: "img/in-post/start-toolbar/header.jpg"
header-mask: 0.3
catalog:    true
tags:
    - Android
---

>아래의 나오는 코드들은 Support Library-v7과 Kotlin 언어를 사용했습니다.

## 개요

기존에는 Actionbar를 이용했지만 시간이 지날수록 더 많은 기능을 요구했다. 결국 제한적이던 Actionibar는 deprecated 되고 Toolbar가 등장했다. Toolbar는 위치 변경이 유연하며 애니메이션을 추가하는 등 커스텀할 수 있다.

Toolbar API 문서 : <https://developer.android.com/reference/android/support/v7/widget/Toolbar.html>{:target="_blank"}




<br>
## 시작

#### dependency 추가

다음의 코드가 없는 사람은 추가해야 한다. 최신 버전은 <a href="https://developer.android.com/topic/libraries/support-library/revisions.html" target="_blank">여기</a>에서 확인할 수 있다.
``` gradle
// app/build.gradle

dependencies {
    compile 'com.android.support:appcompat-v7:25.4.0'
}
```

#### 테마 설정
Toolbar를 사용하려면 Actionbar를 사용하지 않는 테마를 써야한다. 다음의 코드를 추가하자.

``` xml
<!-- app/src/main/res/values/styles.xml -->

<style name="AppTheme.NoTitle">
	<item name="windowActionBar">false</item>
</style>
```

만든 테마의 이름으로 적용시켜준다.
``` xml
<!-- app/src/main/AndroidManifest.xml -->

<application
        android:allowBackup="true"
        android:icon="@mipmap/ic_gachi_launcher"
        android:label="@string/app_name"
        android:theme="@style/AppTheme.NoTitle">
```

#### Toolbar 추가

layout에 Toolbar를 추가시켜준다.
``` xml
<!-- app/src/main/res/layout/activity_main.xml -->

<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
	xmlns:app="http://schemas.android.com/apk/res-auto"
	android:orientation="vertical"
	android:layout_width="match_parent"
	android:layout_height="match_parent">

	<android.support.v7.widget.Toolbar
		android:id="@+id/toolbar"
		android:background="@color/colorPrimary"
		android:layout_width="match_parent"
		android:layout_height="?attr/actionBarSize" />

</LinearLayout>
```
> **android:layout_height="?attr/actionBarSize"**<br>
> layout_height는 자유롭게 변경이 가능하다.<br>
> ?attr/actionBarSize 값을 바꾸려면 사용하는 Theme에 item을 추가한다.
> ``` xml
><style name="AppTheme.NoTitle">
>	<item name="android:actionBarSize">49dp</item>
>	<item name="actionBarSize">49dp</item>
></style>
>```

Activity에서 toolbar를 actionbar로 설정해준다.
``` java
// app/src/main/kotlin/com/test/MainActivity.kt

class MainActivity : AppCompatActivity() {
	override fun onCreate(savedInstanceState: Bundle?) {
		super.onCreate(savedInstanceState)
		setContentView(R.layout.activity_main)

		// actionbar
		setSupportActionBar(toolbar)
	}	
}
```




<br>
## 활용

#### 메뉴 추가(오른쪽 버튼)
버튼을 추가하는 방법은 두가지가 있다. 메뉴를 추가하는 방법과 Toolbar에 위젯을 넣는 방법이다.
(Toolbar에 위젯을 넣는 방법은 [여기](#toolbar-custom)를 참조)<br>

메뉴를 추가하려면 menu 파일을 만들어서 적용해야한다.
app/src/main/res/ 경로에 menu 폴더가 없다면 폴더를 만들고 아래의 menu.xml 파일을 만든다.
``` xml
<!-- app/src/main/res/menu/menu.xml -->

<menu xmlns:android="http://schemas.android.com/apk/res/android"
	xmlns:app="http://schemas.android.com/apk/res-auto">

	<item
		android:id="@+id/menu_add_person"
		android:title="@string/add_person"
		app:showAsAction="always"
		android:icon="@drawable/ic_add_person" />

</menu>
```

> **android:icon**<br>
> 아이콘은 생략 가능
> **app:showAsAction**
> - always : 항상 표시
> - never : 더보기 버튼 안에 표시
> - ifRoom : actionbar에 공간이 있을 때 표시
> - withText : icon과 text 둘다 표시

생성한 menu 파일을 Activity에 적용한다.
``` java
// app/src/main/kotlin/com/test/MainActivity.kt

class MainActivity : AppCompatActivity() {

	override fun onCreateOptionsMenu(menu: Menu?): Boolean {
		menuInflater.inflate(R.menu.menu, menu)
		return super.onCreateOptionsMenu(menu)
	}

}
```


#### 메뉴 이벤트

activity에 등록된 menu들의 이벤트를 등록할 수 있다.
``` java
// app/src/main/kotlin/com/test/MainActivity.kt

class MainActivity : AppCompatActivity() {

	override fun onOptionsItemSelected(item: MenuItem?): Boolean {
		when(item?.itemId) {
			R.id.menu_add_person -> {
				// do something
			}

			android.R.id.home -> {
				// do something
			}
		}

		return super.onOptionsItemSelected(item)
	}

}
```

> **android.R.id.home**<br>
> Toolbar 좌측에 있는 버튼을 가리킴 ([좌측 버튼 만드는 방법](#왼쪽에-버튼-타이틀-추가) 참조)


#### 왼쪽에 버튼, 타이틀 추가
actionbar의 기능을 사용하여 button, text를 추가할 수 있다.


**타이틀 추가**
<br>
title이 보이도록 설정하고 텍스트를 입력하면 된다.
``` java
// app/src/main/kotlin/com/test/MainActivity.kt

class MainActivity : AppCompatActivity() {

	override fun onCreate(savedInstanceState: Bundle?) {
		super.onCreate(savedInstanceState)
		setContentView(R.layout.activity_main)

		// actionbar
		setSupportActionBar(toolbar)
		supportActionBar?.setDisplayShowTitleEnabled(true)
		title = "타이틀"
	}

}
```


**버튼 추가**
<br>
네비게이션(햄버거 버튼) 이나 뒤로가기 등의 버튼을 추가하는 방법이다.
사용할 아이콘을 등록하고 보이도록 설정한다.
``` java
// MainActivity.kt

class MainActivity : AppCompatActivity() {

	override fun onCreate(savedInstanceState: Bundle?) {
		super.onCreate(savedInstanceState)
		setContentView(R.layout.activity_main)

		// actionbar
		setSupportActionBar(toolbar)
		supportActionBar?.setHomeAsUpIndicator(R.drawable.ic_back)
		supportActionBar?.setDisplayHomeAsUpEnabled(true)
	}

}
```
> icon을 vector 파일로 사용할 때는 코드에서 색을 바꿀 수 있다. ([아이콘 색 변경](#아이콘-색-변경) 참조)

애니메이션이 있는 햄버거 버튼을 사용하려면 따로 아이콘을 만들 필요가 없다.<br>
<a target="_blank" href="https://stackoverflow.com/a/26447144">출처</a>
``` java
// MainActivity.kt

val mDrawerToggle = ActionBarDrawerToggle(this,
				drawerLayout,
				mToolbar,
 				R.string.nav_open,
				R.string.nav_close)
drawerLayout.addDrawerListener(mDrawerToggle)
mDrawerToggle.syncState()
```
``` xml
<!-- styles.xml -->

<style name="AppTheme" parent="Theme.AppCompat.Light">
    <item name="drawerArrowStyle">@style/DrawerArrowStyle</item>
</style>

<style name="DrawerArrowStyle" parent="Widget.AppCompat.DrawerArrowToggle">
    <item name="spinBars">true</item>
    <item name="color">@android:color/white</item>
</style>
```
> spinBars 의 true/false 값에 따라 애니메이션이 켜지거나 꺼진다.


#### Custom Toolbar
layout에서 Toolbar안에 LinearLayout, Buttom 등의 위젯을 넣어서 원하는 형태의 Toolbar를 사용할 수 있다.
``` xml
<android.support.v7.widget.Toolbar
	android:id="@+id/toolbar"
	android:layout_width="match_parent"
	android:layout_height="?attr/actionBarSize">

	<!-- 가운데 텍스트 넣기 -->
	<TextView
		android:id="@+id/tv_toolbar"
		android:layout_width="wrap_content"
		android:layout_height="wrap_content"
		android:layout_gravity="center"
		android:clickable="false"
		android:focusable="false"
		android:longClickable="false" />

	<!-- 오른쪽 버튼 넣기 -->
	<ImageView
		android:id="@+id/iv_setting"
		android:layout_width="wrap_content"
		android:layout_height="wrap_content"
		android:layout_gravity="right|center"
		android:src="@drawable/ic_setting"/>

</android.support.v7.widget.Toolbar>
```

#### 타이틀 스타일 변경
styles.xml 에 아래 코드의 형태로 스타일을 추가한다.
``` xml
<style name="TitleText">
	<item name="android:textColor">@color/colorPrimary</item>
	<item name="android:textSize">15sp</item>
	<item name="android:fontFamily">@font/noto_bold</item>
</style>
```

layout에 *app:titleTextAppearance*로 스타일을 적용하면 된다.
``` xml
<android.support.v7.widget.Toolbar
	android:id="@+id/main_toolbar"
	android:layout_width="match_parent"
	android:layout_height="?attr/actionBarSize"

	app:titleTextAppearance="@style/TitleText" />
```


#### 아이콘 색 변경

Home에 들어가는 아이콘이 vector 파일 이라면 색을 코드에서 변경할 수 있다.
``` java
val icon = AppCompatResources.getDrawable(this, R.drawable.ic_back)!!
DrawableCompat.setTint(icon, ContextCompat.getColor(this, R.color.colorWhite))

// actionbar
setSupportActionBar(toolbar)
supportActionBar?.run {
	setHomeAsUpIndicator(icon)
	setDisplayShowTitleEnabled(false)
	setDisplayHomeAsUpEnabled(true)
}
```

메뉴의 아이콘 색을 변경하려면 Theme에 아래와 같이 입력하면 된다.
``` xml
<style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">

	<item name="colorPrimary">@color/colorPrimary</item>
	<item name="colorPrimaryDark">@color/colorPrimaryDark</item>
	<item name="colorAccent">@color/colorAccent</item>

	<!-- Customize color of menu icon in toolbar. -->
	<item name="android:textColorSecondary">@color/colorWhite</item>
	
</style>
```