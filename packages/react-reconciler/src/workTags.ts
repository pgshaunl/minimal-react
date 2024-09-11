/**
 * WorkTag: a numeric type representing React element or component types.
 *
 * Used for efficient reconciliation and comparison by perform a simple integer comparison
 * to determine the type of the element or component, which is faster than comparing strings or objects.
 *
 * - FunctionComponent: A React component that is implemented as a function.
 * - ClassComponent: A React component that is implemented as a class.
 * - HostRoot: A root of the fiber tree.
 * - HostComponent: A DOM component, such as a <div> element.
 * - HostText: A DOM text node.
 * - Fragment: A special component that represents a collection of children.
 */

export type WorkTag =
  | typeof FunctionComponent
  | typeof ClassComponent
  | typeof HostRoot
  | typeof HostComponent
  | typeof HostText
  | typeof Fragment;

export const FunctionComponent = 0;
export const ClassComponent = 1;
export const HostRoot = 3;
export const HostComponent = 5;
export const HostText = 6;
export const Fragment = 7;
