const enum SomeEvent {
click = 'click',
dbclick = 'dbclick',
mousedown = 'mousedown ',
mouseover = 'mouseover',
mouseenter = 'mouseenter',
}

const handleEvents = (event: SomeEvent): void => {
if (event === SomeEvent.click || event === SomeEvent.dbclick) {
console.log('Mouse clicked');
}

if (event === SomeEvent.mouseenter || event === SomeEvent.mouseover) {
console.log('Mouse hover');
}
};

const isOneOf = <T extends string, M extends string>(event: T, ...matchers: M[]) =>
event.match(new RegExp(matchers.join('|'), 'gi'));

const isOneOfWithoutIteration = <T extends string>(event: T, matchers: string) => event.match(new RegExp(matchers, 'gi'));

const handleEvents2 = (ev: SomeEvent) => {
if (isOneOf(ev, SomeEvent.click, SomeEvent.dbclick)) {
console.log('Mouse clicked');
}
const union = `${SomeEvent.mouseenter}|${SomeEvent.mouseover}`;

if (isOneOfWithoutIteration(ev, union)) {
console.log('Mouse hover');
}
};
