/**
 * The main loop of the reconciler, iterating over the fiber tree and calling
 * beginWork and completeWork. Keeps track of the next unit of work to do and
 * handles errors.
 */

import { beginWork } from "./beginWork";
import { completeWork } from "./completeWork";
import { FiberNode } from "./fiber";
import { HostRoot } from "./workTags";

let workInProgress: FiberNode | null = null;

/**
 * Prepares a fresh stack for the given fiber by setting `workInProgress` to
 * the given fiber.
 *
 * This is used by the reconciler to start a new render on a given fiber.
 */
function prepareFreshStack(fiber: FiberNode) {
  workInProgress = fiber;
}

/**
 * Schedules an update on the given fiber by finding its root and scheduling
 * a render on that root.
 */
export function scheduleUpdateOnFiber(fiber: FiberNode) {
  const root = markUpdateFromFiberToRoot(fiber);
  renderRoot(root);
}

/**
 * Find the root node of the fiber tree by traversing upwards from
 * the given fiber until it reaches the root (a fiber with a tag of HostRoot).
 *
 * Return the stateNode of the root node as the entry point forrendering and reconciliation
 */
function markUpdateFromFiberToRoot(fiber: FiberNode) {
  let node = fiber;
  let parent = node.return;
  while (parent !== null) {
    node = parent;
    parent = node.return;
  }
  if (node.tag === HostRoot) {
    return node.stateNode;
  }
  return null;
}

/**
 * Renders the given root fiber by repeatedly calling `workLoop` until it is complete.
 */
function renderRoot(root: FiberNode) {
  prepareFreshStack(root);

  do {
    try {
      workLoop();
      break;
    } catch (e) {
      //prevent the error from being re-thrown every time this function is called.
      console.warn("Error in workLoop: ", e);
      workInProgress = null;
    }
  } while (true);
}

/**
 * Loops through the current unit of work until it is complete.
 */
function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

/**
 * Performs a unit of work on the given fiber by calling `beginWork` to
 * generate a new fiber node, and then either calling `completeUnitOfWork` to
 * traverse upwards from the fiber if the new fiber node is null, or setting
 * `workInProgress` to the new fiber node to continue rendering.
 */
function performUnitOfWork(fiber: FiberNode) {
  const next = beginWork(fiber);
  fiber.memorizedProps = fiber.pendingProps;

  if (next === null) {
    completeUnitOfWork(fiber);
  } else {
    workInProgress = next;
  }
}

/**
 * This function is responsible for traversing the fiber tree and completing the work for each node.
 */
function completeUnitOfWork(fiber: FiberNode) {
  let node: FiberNode | null = fiber;

  do {
    completeWork(node);
    const sibling = node.sibling;

    if (sibling !== null) {
      workInProgress = sibling;
      return;
    }
    node = node.return;
    workInProgress = node;
  } while (node !== null);
}
