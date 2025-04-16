import {useCallback, useState} from "react";

export function useVisibility(initialVisibility = false): [boolean, () => void, () => void] {
    const [isVisible, setIsVisible] = useState(initialVisibility);

    const show = useCallback(() => {
        setIsVisible(true);
    }, []);

    const hide = useCallback(() => {
        setIsVisible(false);
    }, []);

    return [isVisible, show, hide];
}
