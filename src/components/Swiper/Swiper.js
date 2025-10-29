import React, { useRef } from "react";
import {
    FlatList as RNFlatList,
    I18nManager,
    Platform,
    useWindowDimensions,
} from "react-native";
import { Pagination } from "../Pagination/Pagination";

const MILLISECONDS = 1000;
const FIRST_INDEX = 0;
const ITEM_VISIBLE_PERCENT_THRESHOLD = 60;

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
        let _data = [];
        let _renderItem;

        if (children) {
            _data = Array.isArray(children) ? children : [children];
            _renderItem = ({ item }) => item;
        } else if (data) {
            _data = data;
            _renderItem = renderItem;
        } else {
            console.error("Invalid props, `data` or `children` is required");
        }

        const totalPage = Math.ceil(_data.length / bannerOnScreen);
        const _initialNumToRender = renderAll ? totalPage : 1;

        const [currentIndexes, setCurrentIndexes] = React.useState({
            index,
            prevIndex: index,
        });
        const [ignoreOnMomentumScrollEnd, setIgnoreOnMomentumScrollEnd] =
            React.useState(false);
        const flatListElement = React.useRef(null);
        const [scrollEnabled, setScrollEnabled] = React.useState(!disableGesture);

        React.useEffect(() => {
            setScrollEnabled(!disableGesture);
        }, [disableGesture]);

        const _onChangeIndex = React.useCallback(
            ({ index: _index, prevIndex: _prevIndex }) => {
                if (_index !== _prevIndex) {
                    onChangeIndex?.({ index: _index, prevIndex: _prevIndex });
                }
            },
            [onChangeIndex]
        );

        const _scrollToIndex = React.useCallback(
            (params) => {
                const { index: indexToScroll, animated = true } = params;
                setIgnoreOnMomentumScrollEnd(true);
                const next = {
                    index: indexToScroll,
                    prevIndex: currentIndexes.index,
                };

                setCurrentIndexes((prev) => ({
                    index: next.index,
                    prevIndex: next.prevIndex,
                }));

                flatListElement?.current?.scrollToIndex({
                    animated,
                    index: indexToScroll,
                });
            },
            [currentIndexes.index]
        );

        React.useEffect(() => {
            _onChangeIndex({
                index: currentIndexes.index,
                prevIndex: currentIndexes.prevIndex,
            });
        }, [_onChangeIndex, currentIndexes.index, currentIndexes.prevIndex]);

        React.useImperativeHandle(ref, () => ({
            scrollToIndex: (item) => {
                setScrollEnabled(true);
                _scrollToIndex(item);
                setScrollEnabled(!disableGesture);
            },
            getCurrentIndex: () => currentIndexes.index,
            getPrevIndex: () => currentIndexes.prevIndex,
            goToLastIndex: () => {
                setScrollEnabled(true);
                _scrollToIndex({
                    index: I18nManager.isRTL ? FIRST_INDEX : totalPage - 1,
                });
                setScrollEnabled(!disableGesture);
            },
            goToFirstIndex: () => {
                setScrollEnabled(true);
                _scrollToIndex({
                    index: I18nManager.isRTL ? totalPage - 1 : FIRST_INDEX,
                });
                setScrollEnabled(!disableGesture);
            },
        }));

        // Autoplay
        React.useEffect(() => {
            const isLastIndexEnd = autoplayInvertDirection
                ? currentIndexes.index === FIRST_INDEX
                : currentIndexes.index === totalPage - 1;
            const shouldContinueAutoplay = autoplay && !isLastIndexEnd;
            let autoplayTimer;
            if (shouldContinueAutoplay || autoplayLoop) {
                autoplayTimer = setTimeout(() => {
                    if (totalPage < 1) return;
                    if (!autoplay) return;

                    const nextIncrement = autoplayInvertDirection ? -1 : +1;
                    let nextIndex =
                        (currentIndexes.index + nextIncrement) % totalPage;
                    if (autoplayInvertDirection && nextIndex < FIRST_INDEX) {
                        nextIndex = totalPage - 1;
                    }

                    const animate = !isLastIndexEnd || autoplayLoopKeepAnimation;
                    _scrollToIndex({ index: nextIndex, animated: animate });
                }, autoplayDelay * MILLISECONDS);
            }
            return () => clearTimeout(autoplayTimer);
        }, [
            autoplay,
            currentIndexes.index,
            totalPage,
            autoplayInvertDirection,
            autoplayLoop,
            autoplayDelay,
            autoplayLoopKeepAnimation,
            _scrollToIndex,
        ]);

        // Event scroll end
        const _onMomentumScrollEnd = (event) => {
            if (ignoreOnMomentumScrollEnd) {
                setIgnoreOnMomentumScrollEnd(false);
                return;
            }
            onMomentumScrollEnd?.({ index: currentIndexes.index }, event);
        };

        // Viewable change
        const _onViewableItemsChanged = React.useMemo(
            () => (params) => {
                const { changed } = params;
                const newItem = changed?.[FIRST_INDEX];
                if (newItem !== undefined) {
                    const nextIndex = newItem.index;
                    if (newItem.isViewable) {
                        setCurrentIndexes((prev) => ({ ...prev, index: nextIndex }));
                    } else {
                        setCurrentIndexes((prev) => ({ ...prev, prevIndex: nextIndex }));
                    }
                }
                onViewableItemsChanged?.(params);
            },
            [onViewableItemsChanged]
        );

        const viewabilityConfigCallbackPairs = useRef([
            {
                onViewableItemsChanged: _onViewableItemsChanged,
                viewabilityConfig: {
                    minimumViewTime: 200,
                    itemVisiblePercentThreshold: ITEM_VISIBLE_PERCENT_THRESHOLD,
                    ...viewabilityConfig,
                },
            },
        ]);

        const flatListProps = {
            scrollEnabled,
            ref: flatListElement,
            keyExtractor: (_item, _index) =>
                _item?.key ?? _item?.id ?? _index.toString(),
            horizontal: !vertical,
            showsHorizontalScrollIndicator: false,
            showsVerticalScrollIndicator: false,
            pagingEnabled: true,
            ...props,
            onMomentumScrollEnd: _onMomentumScrollEnd,
            onScrollToIndexFailed: (info) =>
                setTimeout(() => _scrollToIndex({ index: info.index, animated: false })),
            data: _data,
            renderItem: _renderItem,
            initialNumToRender: _initialNumToRender,
            initialScrollIndex: index,
            viewabilityConfig: {
                minimumViewTime: 200,
                itemVisiblePercentThreshold: ITEM_VISIBLE_PERCENT_THRESHOLD,
                ...viewabilityConfig,
            },
            viewabilityConfigCallbackPairs:
                Platform.OS === "ios"
                    ? viewabilityConfigCallbackPairs.current
                    : undefined,
            onViewableItemsChanged:
                Platform.OS === "android" ? _onViewableItemsChanged : undefined,
            testID: e2eID,
        };

        let { width, height } = useWindowDimensions();
        if (bannerWidth) width = bannerWidth;
        const itemDimension = (vertical ? height : width) / bannerOnScreen;

        if (props.getItemLayout === undefined) {
            flatListProps.getItemLayout = (_data, itemIndex) => ({
                length: itemDimension,
                offset: itemDimension * itemIndex,
                index: itemIndex,
            });
        }

        if (Platform.OS === "web") {
            flatListProps.dataSet = { "paging-enabled-fix": true };
        }

        if (useReactNativeGestureHandler) {
            console.warn(
                "Please remove `useReactNativeGestureHandler` and import `SwiperFlatListWithGestureHandler` if needed."
            );
        }

        return (
            <>
                <RNFlatList
                    {...flatListProps}
                    getItemLayout={flatListProps.getItemLayout}
                    snapToInterval={itemDimension}
                    decelerationRate="fast"
                />
                {showPagination ? (
                    <PaginationComponent
                        size={totalPage}
                        paginationIndex={currentIndexes.index}
                        scrollToIndex={(params) => _scrollToIndex(params)}
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
            </>
        );
    }
);
