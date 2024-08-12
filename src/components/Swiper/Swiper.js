import React, { useRef } from "react"
import {
    FlatList as RNFlatList,
    I18nManager,
    Platform,
    useWindowDimensions
} from "react-native"

import { Pagination } from "../Pagination/Pagination"

const MILLISECONDS = 1000
const FIRST_INDEX = 0
const ITEM_VISIBLE_PERCENT_THRESHOLD = 60

export const Swiper = React.forwardRef(
    (
        {
            vertical = false,
            children,
            data = [],
            renderItem,
            renderAll = false,
            index = I18nManager.isRTL ? data.length - 1 : FIRST_INDEX,
            useReactNativeGestureHandler = false,

            // Pagination
            showPagination = false,
            bannerOnScreen = 1,
            bannerWidth = 0,

            PaginationComponent = Pagination,
            paginationActiveColor,
            paginationDefaultColor,
            paginationStyle,
            paginationStyleItem,
            paginationStyleItemActive,
            paginationStyleItemInactive,
            onPaginationSelectedIndex,
            paginationTapDisabled = false,

            // Autoplay
            autoplayDelay = 3,

            autoplay = false,
            autoplayLoop = false,
            autoplayLoopKeepAnimation = false,
            autoplayInvertDirection = I18nManager.isRTL,

            // Functions
            onChangeIndex,

            onMomentumScrollEnd,
            onViewableItemsChanged,
            viewabilityConfig = {},
            disableGesture = false,
            e2eID,
            paginationAccessibilityLabels,
            ...props
        },
        ref
    ) => {
        let _data = []
        let _renderItem

        if (children) {
            // github.com/gusgard/react-native-swiper-flatlist/issues/40
            _data = Array.isArray(children) ? children : [children]
            _renderItem = ({ item }) => item
        } else if (data) {
            _data = data
            _renderItem = renderItem
        } else {
            console.error("Invalid props, `data` or `children` is required")
        }
        const size = Math.ceil(_data.length / bannerOnScreen);
        // Items to render in the initial batch.
        const _initialNumToRender = renderAll ? size : 1
        const [currentIndexes, setCurrentIndexes] = React.useState({
            index,
            prevIndex: index
        })
        const [
            ignoreOnMomentumScrollEnd,
            setIgnoreOnMomentumScrollEnd
        ] = React.useState(false)
        const flatListElement = React.useRef(null)
        const [scrollEnabled, setScrollEnabled] = React.useState(!disableGesture)

        React.useEffect(() => {
            setScrollEnabled(!disableGesture)
        }, [disableGesture])

        const _onChangeIndex = React.useCallback(
            ({ index: _index, prevIndex: _prevIndex }) => {
                if (_index !== _prevIndex) {
                    onChangeIndex?.({ index: _index, prevIndex: _prevIndex })
                }
            },
            [onChangeIndex]
        )

        const _scrollToIndex = React.useCallback(
            params => {
                const { index: indexToScroll, animated = true } = params
                const newParams = { animated, index: indexToScroll }

                setIgnoreOnMomentumScrollEnd(true)

                const next = {
                    index: indexToScroll,
                    prevIndex: currentIndexes.index
                }
                if (
                    currentIndexes.index !== next.index &&
                    currentIndexes.prevIndex !== next.prevIndex
                ) {
                    setCurrentIndexes({ index: next.index, prevIndex: next.prevIndex })
                } else if (currentIndexes.index !== next.index) {
                    setCurrentIndexes(prevState => ({ ...prevState, index: next.index }))
                } else if (currentIndexes.prevIndex !== next.prevIndex) {
                    setCurrentIndexes(prevState => ({
                        ...prevState,
                        prevIndex: next.prevIndex
                    }))
                }

                // When execute "scrollToIndex", we ignore the method "onMomentumScrollEnd"
                // because it not working on Android
                // https://github.com/facebook/react-native/issues/21718
                flatListElement?.current?.scrollToIndex(newParams)
            },
            [currentIndexes.index, currentIndexes.prevIndex]
        )

        // change the index when the user swipe the items
        React.useEffect(() => {
            _onChangeIndex({
                index: currentIndexes.index,
                prevIndex: currentIndexes.prevIndex
            })
        }, [_onChangeIndex, currentIndexes.index, currentIndexes.prevIndex])

        React.useImperativeHandle(ref, () => ({
            scrollToIndex: item => {
                setScrollEnabled(true)
                _scrollToIndex(item)
                setScrollEnabled(!disableGesture)
            },
            getCurrentIndex: () => currentIndexes.index,
            getPrevIndex: () => currentIndexes.prevIndex,
            goToLastIndex: () => {
                setScrollEnabled(true)
                _scrollToIndex({ index: I18nManager.isRTL ? FIRST_INDEX : size - 1 })
                setScrollEnabled(!disableGesture)
            },
            goToFirstIndex: () => {
                setScrollEnabled(true)
                _scrollToIndex({ index: I18nManager.isRTL ? size - 1 : FIRST_INDEX })
                setScrollEnabled(!disableGesture)
            }
        }))

        React.useEffect(() => {
            const isLastIndexEnd = autoplayInvertDirection
                ? currentIndexes.index === FIRST_INDEX
                : currentIndexes.index === Math.ceil(_data.length / bannerOnScreen) - 1
            const shouldContinuoWithAutoplay = autoplay && !isLastIndexEnd
            let autoplayTimer
            if (shouldContinuoWithAutoplay || autoplayLoop) {
                autoplayTimer = setTimeout(() => {
                    if (Math.ceil(_data.length / bannerOnScreen) < 1) {
                        // avoid nextIndex being set to NaN
                        return
                    }

                    if (!autoplay) {
                        // disabled if autoplay is off
                        return
                    }

                    const nextIncrement = autoplayInvertDirection ? -1 : +1

                    let nextIndex = (currentIndexes.index + nextIncrement) % Math.ceil(_data.length / bannerOnScreen)
                    if (autoplayInvertDirection && nextIndex < FIRST_INDEX) {
                        nextIndex = Math.ceil(_data.length / bannerOnScreen) - 1
                    }

                    // Disable end loop animation unless `autoplayLoopKeepAnimation` prop configured
                    const animate = !isLastIndexEnd || autoplayLoopKeepAnimation

                    _scrollToIndex({ index: nextIndex, animated: animate })
                }, autoplayDelay * MILLISECONDS)
            }
            // https://upmostly.com/tutorials/settimeout-in-react-components-using-hooks
            return () => clearTimeout(autoplayTimer)
        }, [
            autoplay,
            currentIndexes.index,
            Math.ceil(_data.length / bannerOnScreen),
            autoplayInvertDirection,
            autoplayLoop,
            autoplayDelay,
            autoplayLoopKeepAnimation,
            _scrollToIndex
        ])

        const _onMomentumScrollEnd = event => {
            // NOTE: Method not executed when call "flatListElement?.current?.scrollToIndex"
            if (ignoreOnMomentumScrollEnd) {
                setIgnoreOnMomentumScrollEnd(false)
                return
            }

            onMomentumScrollEnd?.({ index: currentIndexes.index }, event)
        }

        const _onViewableItemsChanged = React.useMemo(
            () => params => {
                const { changed } = params
                const newItem = changed?.[FIRST_INDEX]
                if (newItem !== undefined) {
                    const nextIndex = newItem.index
                    if (newItem.isViewable) {
                        setCurrentIndexes(prevState => ({ ...prevState, index: nextIndex }))
                    } else {
                        setCurrentIndexes(prevState => ({
                            ...prevState,
                            prevIndex: nextIndex
                        }))
                    }
                }
                onViewableItemsChanged?.(params)
            },
            [onViewableItemsChanged]
        )

        const viewabilityConfigCallbackPairs = useRef([
            {
                onViewableItemsChanged: _onViewableItemsChanged,
                viewabilityConfig: {
                    // https://facebook.github.io/react-native/docs/flatlist#minimumviewtime
                    minimumViewTime: 200,
                    itemVisiblePercentThreshold: ITEM_VISIBLE_PERCENT_THRESHOLD,
                    ...viewabilityConfig
                }
            }
        ])

        const flatListProps = {
            scrollEnabled,
            ref: flatListElement,
            keyExtractor: (_item, _index) => {
                const item = _item
                const key = item?.key ?? item?.id ?? _index.toString()
                return key
            },
            horizontal: !vertical,
            showsHorizontalScrollIndicator: false,
            showsVerticalScrollIndicator: false,
            pagingEnabled: true,
            ...props,
            onMomentumScrollEnd: _onMomentumScrollEnd,
            onScrollToIndexFailed: info =>
                setTimeout(() =>
                    _scrollToIndex({ index: info.index, animated: false })
                ),
            data: _data,
            renderItem: _renderItem,
            initialNumToRender: _initialNumToRender,
            initialScrollIndex: index, // used with onScrollToIndexFailed
            viewabilityConfig: {
                // https://facebook.github.io/react-native/docs/flatlist#minimumviewtime
                minimumViewTime: 200,
                itemVisiblePercentThreshold: ITEM_VISIBLE_PERCENT_THRESHOLD,
                ...viewabilityConfig
            },
            viewabilityConfigCallbackPairs:
                Platform.OS === "ios"
                    ? viewabilityConfigCallbackPairs.current
                    : undefined,
            onViewableItemsChanged:
                Platform.OS === "android" ? _onViewableItemsChanged : undefined,
            // debug: true, // for debug
            testID: e2eID
        }

        let { width, height } = useWindowDimensions();
        if (bannerWidth) {
            width = bannerWidth;
        }
        if (props.getItemLayout === undefined) {
            const itemDimension = vertical ? height : width
            flatListProps.getItemLayout = (__data, ItemIndex) => ({
                length: itemDimension,
                offset: itemDimension * ItemIndex,
                index: ItemIndex
            })
        }
        if (Platform.OS === "web") {
            // TODO: do we need this anymore? check 3.1.0
            flatListProps.dataSet = { "paging-enabled-fix": true }
        }

        //NOTE: quick fix for the new version of metro bundler
        // we should remove this console.warn in the next version (3.2.4)
        if (useReactNativeGestureHandler) {
            console.warn(
                "Please remove `useReactNativeGestureHandler` and import the library like:"
            )
            console.warn(
                "import { SwiperFlatListWithGestureHandler } from 'react-native-swiper-flatlist/WithGestureHandler';"
            )
        }

        return (
            <React.Fragment>
                <RNFlatList {...flatListProps} />
                {showPagination ? (
                    <PaginationComponent
                        size={size}
                        paginationIndex={currentIndexes.index}
                        scrollToIndex={params => {
                            _scrollToIndex(params)
                        }}
                        paginationActiveColor={paginationActiveColor}
                        paginationDefaultColor={paginationDefaultColor}
                        paginationStyle={paginationStyle}
                        paginationStyleItem={paginationStyleItem}
                        paginationStyleItemActive={paginationStyleItemActive}
                        paginationStyleItemInactive={paginationStyleItemInactive}
                        onPaginationSelectedIndex={onPaginationSelectedIndex}
                        paginationTapDisabled={paginationTapDisabled}
                        e2eID={e2eID}
                        paginationAccessibilityLabels={paginationAccessibilityLabels}
                    />
                ) : null}
            </React.Fragment>
        )
    }
)