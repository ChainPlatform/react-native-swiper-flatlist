# Swiper
@chainplatform/swiper support react-native and react-native-web

<p align="center">
  <a href="https://github.com/ChainPlatform/react-native-swiper-flatlist/blob/HEAD/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  </a>
  <a href="https://www.npmjs.com/package/@chainplatform/swiper">
    <img src="https://img.shields.io/npm/v/@chainplatform/swiper?color=brightgreen&label=npm%20package" alt="Current npm package version." />
  </a>
  <a href="https://www.npmjs.com/package/@chainplatform/swiper">
    <img src="https://img.shields.io/npm/dt/@chainplatform/swiper.svg"></img>
  </a>
  <a href="https://www.npmjs.com/package/@chainplatform/swiper">
    <img src="https://img.shields.io/badge/platform-android%20%7C%20ios%20%7C%20web-blue"></img>
  </a>
  <a href="https://github.com/ChainPlatform/react-native-swiper-flatlist/pulls">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=doansan">
    <img src="https://img.shields.io/twitter/follow/doansan.svg?label=Follow%20@doansan" alt="Follow @doansan" />
  </a>
</p>

### Install
```
npm install @chainplatform/swiper --save
```
or
```
yarn add @chainplatform/swiper
```


### Usage

```js
import React from 'react';
import {Swiper} from '@chainplatform/swiper';

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
          
        };
    }

  render() {
    return (
      <View style={{flex:1}}>
        <Swiper
          paginationTapDisabled={true}
          disableGesture={true}
          autoplayLoopKeepAnimation={true}
          autoplayInvertDirection={false}
          autoplay={true}
          autoplayDelay={5}
          autoplayLoop={true}
          bannerWidth={200}
          bannerOnScreen={1}
          index={0}
          showPagination={true}
          paginationActiveColor={"red"}
        >
      </View>
    );
  }
}
```