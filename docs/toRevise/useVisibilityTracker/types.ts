import React from "react";

export interface TrackerParams {
    readonly scrollableContainer: HTMLElement | Window;
    readonly contentElementRef: React.RefObject<HTMLElement>;
}

export interface TrackerReturnValues {
    readonly getScrollDepth: () => number;
    readonly getVisibilityPercentage: () => number;
    readonly getMaxScrollDepth: () => number;
    readonly getMaxVisibilityPercentage: () => number;
    readonly resetVisibilityData: () => void;
}
