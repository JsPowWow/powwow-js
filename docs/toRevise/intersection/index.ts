export const observeItemsIntersection = ({
    items,
    onChange
}: {
    items: Element[];
    onChange: (newPercentage: number) => void;
}) => {
    let itemsMaxVisibility: number[] = [];
    let accumulatedPercentage = 0;

    const observer = new IntersectionObserver(
        entries => {
            for (const entry of entries) {
                const itemIndex = items.indexOf(entry.target);
                itemsMaxVisibility[itemIndex] = Math.max(entry.intersectionRatio, itemsMaxVisibility[itemIndex] || 0);
                const accumulatedVisibilities = itemsMaxVisibility.reduce((acc, value) => acc + value, 0);
                const percentage = Math.floor(((accumulatedVisibilities / items.length) * 100) / 25) * 25;

                if (percentage > accumulatedPercentage) {
                    accumulatedPercentage = percentage;
                    onChange(accumulatedPercentage);
                }
            }
        },
        {threshold: [0.25, 0.5, 0.75, 1]}
    );

    items.forEach(item => item && observer.observe(item));

    return () => {
        observer.disconnect();
        itemsMaxVisibility = [];
        accumulatedPercentage = 0;
    };
};
