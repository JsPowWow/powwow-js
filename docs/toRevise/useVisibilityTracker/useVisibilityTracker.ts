import {useCallback, useEffect, useRef} from "react";

import {TrackerParams, TrackerReturnValues} from "./types";
import {isDesktop} from "../../device";

export const useVisibilityTracker = ({scrollableContainer, contentElementRef}: TrackerParams): TrackerReturnValues => {
    const scrollDepthRef = useRef<number>(0);
    const visibilityPercentageRef = useRef<number>(0);
    const maxScrollDepthRef = useRef<number>(0);
    const maxVisibilityPercentageRef = useRef<number>(0);

    const handleScroll = useCallback(() => {
        if (contentElementRef.current) {
            let scrollDepthPercent, visibilityPercent;
            if (isDesktop()) {
                const desktopScrollableContainer = scrollableContainer as HTMLElement;
                const containerHeight = desktopScrollableContainer.clientHeight;
                const featurePageScrollHeight = contentElementRef.current.scrollHeight;
                const featurePageOffsetTop = contentElementRef.current.offsetTop;
                const headerHeight = window.innerHeight - containerHeight;
                const elementOffsetFromHeader = featurePageOffsetTop - headerHeight;

                visibilityPercent = Math.min(
                    Math.round(
                        ((desktopScrollableContainer.clientHeight -
                            elementOffsetFromHeader +
                            desktopScrollableContainer.scrollTop) /
                            contentElementRef.current?.scrollHeight) *
                            100
                    ),
                    100
                );

                const needToScroll = featurePageScrollHeight - (containerHeight - elementOffsetFromHeader);
                scrollDepthPercent = Math.min(
                    Math.round((desktopScrollableContainer.scrollTop / needToScroll) * 100),
                    100
                );
            } else {
                const mobileScrollableContainer = scrollableContainer as Window;
                const viewportHeight =
                    window.innerHeight - document.body.scrollHeight + contentElementRef.current.scrollHeight;

                visibilityPercent = Math.round(
                    ((viewportHeight + mobileScrollableContainer.scrollY) / contentElementRef.current.scrollHeight) *
                        100
                );

                const needToScroll = contentElementRef.current?.scrollHeight - viewportHeight;
                scrollDepthPercent = Math.round((mobileScrollableContainer.scrollY / needToScroll) * 100);
            }

            scrollDepthRef.current = scrollDepthPercent;
            visibilityPercentageRef.current = visibilityPercent;

            if (scrollDepthPercent > maxScrollDepthRef.current) {
                maxScrollDepthRef.current = scrollDepthPercent;
            }

            if (visibilityPercent > maxVisibilityPercentageRef.current) {
                maxVisibilityPercentageRef.current = visibilityPercent;
            }
        }
    }, [
        scrollableContainer,
        contentElementRef,
        scrollDepthRef,
        visibilityPercentageRef,
        maxScrollDepthRef,
        maxVisibilityPercentageRef
    ]);

    useEffect(() => {
        scrollableContainer.addEventListener("scroll", handleScroll);

        return () => {
            scrollableContainer.removeEventListener("scroll", handleScroll);
        };
    }, [scrollableContainer]);

    const resetVisibilityData = useCallback(() => {
        scrollDepthRef.current = 0;
        visibilityPercentageRef.current = 0;
        maxScrollDepthRef.current = 0;
        maxVisibilityPercentageRef.current = 0;
    }, [scrollDepthRef, visibilityPercentageRef, maxScrollDepthRef, maxVisibilityPercentageRef]);

    return {
        getScrollDepth: useCallback(() => scrollDepthRef.current, [scrollDepthRef]),
        getVisibilityPercentage: useCallback(() => visibilityPercentageRef.current, [visibilityPercentageRef]),
        getMaxScrollDepth: useCallback(() => maxScrollDepthRef.current, [maxScrollDepthRef]),
        getMaxVisibilityPercentage: useCallback(() => maxVisibilityPercentageRef.current, [maxVisibilityPercentageRef]),
        resetVisibilityData
    };
};
