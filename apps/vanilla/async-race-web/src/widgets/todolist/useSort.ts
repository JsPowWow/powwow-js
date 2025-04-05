import { Reely } from '@pw-internals/jsx-runtime';
import { isSomeFunction, RecordKey } from '@powwow-js/core';

//import { compareObjectsByKey } from './utils';
export type SortDirection = 'asc' | 'desc';
export type ItemKey<T> = keyof T;
export type SortOption<T> = {
  label: T[ItemKey<T>];
  value: ItemKey<T>;
};

export interface SortProps<T> {
  data: T[];
  onSortChange(data: T[]): void;
  sortOptions: SortOption<T>[];
}

/**
 * TODO AR check/move to core (?)
 * First-order function that rearranges an indexed array of objects by the specified key,
 * extending functionality of `Array.sort()`.
 * based on a key of the object.
 * @param key the {keyof T} index of the object being sorted
 * @param ascending the {boolean} value specifying sort direction - Defaults to `true`
 * @type T - generic type - defaults to `Record<any, any>
 * @returns sorted array of {T} objects
 * @example
 *    myArrayOfObjects = [{id: 1, name:'Pam'},{id: 2, name:'Sue'},{id: 3, name:'Lucy'}]
 *    myArrayOfObjects.sort(compareObjectsByKey('name'))
 *    result: myArrayOfObjects = [{id: 3, name:'Lucy'},{id: 1, name:'Pam'},{id: 2, name:'Sue'}]
 */
export function compareObjectsByKey<T = Record<RecordKey, unknown>>(key: keyof T, ascending = true) {
  return function innerSort(objectA: T, objectB: T) {
    let sortValue: -1 | 0 | 1;
    if (objectA[key] < objectB[key]) {
      sortValue = objectA[key] > objectB[key] ? 1 : -1;
    } else {
      sortValue = objectA[key] > objectB[key] ? 1 : 0;
    }
    return ascending ? sortValue : -1 * sortValue;
  };
}

export function useSort<T>({ data, onSortChange, sortOptions }: SortProps<T>) {
  // Local state
  const [sortDirection, setSortDirection] = Reely.useState<SortDirection>('asc');
  const initialSortKey = sortOptions[0].value as ItemKey<T>;
  const [sortKey, setSortKey] = Reely.useState<ItemKey<T>>(initialSortKey);

  // TODO AR implement useCallback and reuse here instead useRef trick
  const onSortChangeSaved = Reely.useRef(onSortChange);
  onSortChangeSaved.current = onSortChange;

  // Execute the sort and callback when local state
  // or supplied props have changed.
  Reely.useEffect(() => {
    // Create a copy before sorting, as the original array is frozen in strict mode.
    // console.log('Do sort', sortKey, sortDirection);
    const sortedData = [...data];
    if (sortedData?.length) {
      sortedData.sort(compareObjectsByKey(sortKey, sortDirection === 'asc'));

      if (isSomeFunction(onSortChangeSaved.current)) {
        onSortChangeSaved.current(sortedData);
      }
    }
  }, [data, sortDirection, sortKey]);

  /**
   * Handle changes to the sort key.
   * @param newSortKey
   */
  const handleSortKeyChange = (newSortKey: ItemKey<T>) => {
    if (sortKey === newSortKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(newSortKey);
    }
  };

  /**
   * Handle changes to the sort direction.
   */
  const handleDirectionToggle = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  return {
    handleDirectionToggle,
    handleSortKeyChange,
    sortDirection,
    sortKey,
  };
}
