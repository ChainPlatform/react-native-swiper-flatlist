# 🌀 Swiper
`@chainplatform/swiper` — supports **React Native** and **React Native Web**  
High-performance, smooth, and customizable cross-platform swiper ⚡

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

---

## 📦 Installation

```bash
npm install @chainplatform/swiper --save
```

or

```bash
yarn add @chainplatform/swiper
```

---

## ⚙️ Usage

```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Swiper } from '@chainplatform/swiper';

export default class App extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Swiper
          paginationTapDisabled={true}
          disableGesture={false}
          autoplay={true}
          autoplayDelay={3}
          autoplayLoop={true}
          autoplayLoopKeepAnimation={true}
          autoplayInvertDirection={false}
          bannerWidth={200}
          bannerOnScreen={2}
          index={0}
          showPagination={true}
          paginationActiveColor={"#ff4d4d"}
          paginationDefaultColor={"#cccccc"}
        >
          <View style={styles.slide}><Text style={styles.text}>Slide 1</Text></View>
          <View style={styles.slide}><Text style={styles.text}>Slide 2</Text></View>
          <View style={styles.slide}><Text style={styles.text}>Slide 3</Text></View>
        </Swiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e90ff',
    borderRadius: 12,
    marginHorizontal: 10,
  },
  text: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
```

---

## ✨ Features

✅ Works seamlessly with **React Native** and **React Native Web**  
✅ Supports **autoplay**, **loop**, **gesture control**, and **pagination**  
✅ Fully customizable **colors, size, and position**  
✅ Display **multiple pages at once** using `bannerOnScreen`  
✅ Written in pure React Native – **no webpack config required**  
✅ RTL support with `I18nManager.isRTL`  

---

## 🔧 Main Props

| Prop | Type | Default | Description |
|------|------|----------|-------------|
| `autoplay` | `boolean` | `false` | Enable automatic slide switching |
| `autoplayDelay` | `number` | `3` | Time interval between slides (seconds) |
| `autoplayLoop` | `boolean` | `false` | Loop back to the first slide |
| `disableGesture` | `boolean` | `false` | Disable swipe gestures |
| `showPagination` | `boolean` | `true` | Show pagination dots |
| `paginationTapDisabled` | `boolean` | `false` | Disable pagination dot press |
| `paginationActiveColor` | `string` | `white` | Active dot color |
| `paginationDefaultColor` | `string` | `gray` | Inactive dot color |
| `bannerWidth` | `number` | `auto` | Width of each banner item |
| `bannerOnScreen` | `number` | `1` | Number of banners visible on screen |

---

## 🧩 Pagination Component

The `Pagination` component is fully customizable and supports interaction:

```jsx
<Pagination
  size={5}
  paginationIndex={1}
  paginationActiveColor="#ff4d4d"
  paginationDefaultColor="#999"
  onPaginationSelectedIndex={(index) => console.log('Selected', index)}
/>
```

---

## 📜 License

MIT © 2025 [Chain Platform](https://chainplatform.net)

---

## 💖 Support & Donate

If you find this package helpful, consider supporting the development:

| Cryptocurrency | Address |
|----------------|----------|
| **Bitcoin (BTC)** | `17grbSNSEcEybS1nHh4TGYVodBwT16cWtc` |
![alt text](image-1.png)
| **Ethereum (ETH)** | `0xa2fd119a619908d53928e5848b49bf1cc15689d4` |
![alt text](image-2.png)
| **Tron (TRX)** | `TYL8p2PLCLDfq3CgGBp58WdUvvg9zsJ8pd` |
![alt text](image.png)
| **DOGE (DOGE)** | `DDfKN2ys4frNaUkvPKcAdfL6SiVss5Bm19` |
| **USDT (SOLANA)** | `cPUZsb7T9tMfiZFqXbWbRvrUktxgZQXQ2Ni1HiVXgFm` |

Your contribution helps maintain open-source development under the Chain Platform ecosystem 🚀