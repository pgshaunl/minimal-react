//React Element

import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import type {
  Type,
  Key,
  Props,
  Ref,
  ReactElementType,
  ElementType
} from "shared/ReactTypes";

/**
 * Creates a React element from a given `type` and `props`.
 *
 * @param type The type of element to be created. Can be a React component,
 *   a DOM tag name, or a React fragment.
 * @param key The key to assign to the element. If `null`, no key is assigned.
 * @param ref The ref to assign to the element. If `null`, no ref is assigned.
 * @param props The props to assign to the element.
 * @returns A ReactElement.
 */
const ReactElement = function (
  type: Type,
  key: Key,
  ref: Ref,
  props: Props
): ReactElementType {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    __mark: "Shaun Li"
  };

  return element;
};

/**
 * Creates a React element from a given `type` and `config`.
 *
 * @param type The type of element to be created. Can be a React component,
 *   a DOM tag name, or a React fragment.
 * @param config The config object to be used to create the element.
 * @param maybeChildren The children of the element. Can be an array of React
 *   elements or a single React element.
 * @returns A ReactElement.
 */
export const jsx = (type: ElementType, config: any, ...maybeChildren: any) => {
  let key: Key = null;
  const props: Props = {};
  let ref: Ref = null;

  for (const prop in config) {
    const val = config[prop];

    if (prop === "key") {
      if (val !== undefined) {
        key = "" + val;
      }
      continue;
    }
    if (prop === "ref") {
      if (val !== undefined) {
        ref = val;
      }
      continue;
    }
    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val;
    }
  }

  const maybeChildrenLength = maybeChildren.length;
  if (maybeChildrenLength) {
    props.children = maybeChildren[0];
  } else {
    props.children = maybeChildren;
  }
  return ReactElement(type, key, ref, props);
};

/**
 * Creates a React element from a given `type` and `config` in development
 * mode.
 *
 * @param type The type of element to be created. Can be a React component,
 *   a DOM tag name, or a React fragment.
 * @param config The config object to be used to create the element.
 * @returns A ReactElement.
 */
export const jsxDEV = (type: ElementType, config: any) => {
  let key: Key = null;
  const props: Props = {};
  let ref: Ref = null;

  for (const prop in config) {
    const val = config[prop];
    if (prop === "key") {
      if (val !== undefined) {
        key = "" + val;
      }
      continue;
    }
    if (prop === "ref") {
      if (val !== undefined) {
        ref = val;
      }
      continue;
    }
    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val;
    }
  }

  return ReactElement(type, key, ref, props);
};
