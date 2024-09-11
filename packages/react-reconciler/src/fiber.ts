import { Key, Props, Ref } from "shared/ReactTypes";
import { WorkTag } from "./workTags";
import { Flags, NoFlags } from "./fiberFlags";
import { Container } from "./hostConfig";

/**
 * Represents a node in the fiber data structure used by React's reconciliation algorithm.
 * A fiber node contains information about a React component or DOM element, such as its type, props, and relationships to other nodes.
 */
export class FiberNode {
  /**
   * The type of the fiber node, can be a string (for DOM elements) or an object (for React components)
   */
  type: any;

  /**
   * The tag of the fiber node, used for efficient reconciliation and comparison
   */
  tag: WorkTag;

  /**
   * The key of the fiber node, used to identify the component or element in the reconciliation algorithm
   */
  key: Key;

  /**
   * Holds the actual instance of a React component or DOM element, where state is stored and rendering occurs
   */
  stateNode: any;

  /**
   * The parent fiber node of the current fiber node
   */
  return: FiberNode | null;

  /**
   * The next fiber node in the sibling list
   */
  sibling: FiberNode | null;

  /**
   * The first child fiber node of the current fiber node
   */
  child: FiberNode | null;

  /**
   * The index of the current fiber node in its parent's child list
   */
  index: number;

  /**
   * Used to store a reference to the component or element, and it is used to trigger events
   */
  ref: Ref;

  /**
   * Props that are waiting to be applied to the component or element
   */
  pendingProps: Props;

  /**
   * The props that are cached in the fiber node used to optimize the reconciliation algorithm.
   */
  memorizedProps: Props | null;

  /**
   * The state that is cached in the fiber node used to optimize the reconciliation algorithm.
   */
  memorizedState: any;

  /**
   * Used to store the updates that are waiting to be processed by the reconciliation algorithm.
   */
  updateQueue: unknown;

  /**
   * For reconciliation to store the previous state and compute the diff
   */
  alternate: FiberNode | null;

  /**
   * To indicate the side effects of the node
   */
  flags: Flags;

  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    // Actual instance
    this.tag = tag;
    this.key = key;
    this.stateNode = null;
    this.type = null;

    // Fiber tree
    this.return = null;
    this.sibling = null;
    this.child = null;
    this.index = 0;

    this.ref = null;

    // unit of work
    this.pendingProps = pendingProps;
    this.memorizedProps = null;
    this.memorizedState = null;
    this.updateQueue = null;
    this.alternate = null;

    // Side Effect
    this.flags = NoFlags;
  }
}

/**
 * Represents the root of a fiber tree in React's reconciliation algorithm.
 */
export class FiberRootNode {
  container: Container;
  current: FiberNode;
  finishedWork: FiberNode | null;
  constructor(container: Container, hostRootFiber: FiberNode) {
    this.container = container;
    this.current = hostRootFiber;
    hostRootFiber.stateNode = this;
    this.finishedWork = null;
  }
}

/**
 * Creates a work-in-progress fiber by cloning the current fiber and reseting some fields.
 * The main purpose of this function is to create a new fiber which is used to do the diff.
 *
 * @philosophy
 *   - Incremental updates: Compare old and new fiber nodes to determine which parts need to be updated.
 *   - Concurrent updates: Use WIP fiber nodes to maintain multiple versions of the fiber tree, enabling concurrent updates.
 *   - Interruptible updates: If an update is interrupted, discard the WIP fiber node and restore the old fiber node.
 */
export const createWorkInProgress = (
  current: FiberNode,
  pendingProps: Props
): FiberNode => {
  let wip = current.alternate;

  if (wip === null) {
    // Mount a new fiber node with the same tag, key, and state node as the current fiber.
    wip = new FiberNode(current.tag, pendingProps, current.key);
    wip.stateNode = current.stateNode;
    // Set up the alternate relationship between the two fibers.
    wip.alternate = current;
    current.alternate = wip;
  } else {
    // Update the pending props and flags of the alternate fiber.
    wip.pendingProps = pendingProps;
    wip.flags = NoFlags;
  }
  // Copy properties from the current fiber to the WIP fiber.
  wip.type = current.type;
  wip.updateQueue = current.updateQueue;
  wip.child = current.child;
  wip.memorizedProps = current.memorizedProps;
  wip.memorizedState = current.memorizedState;

  return wip;
};
