import { Container } from "./hostConfig";
import { ReactElementType } from "shared/ReactTypes";
import { FiberNode, FiberRootNode } from "./fiber";
import {
  createUpdate,
  createUpdateQueue,
  enqueueUpdate,
  UpdateQueue
} from "./updateQueue";
import { scheduleUpdateOnFiber } from "./workLoop";
import { HostRoot } from "./workTags";

/**
 * Creates a container, which is an object that holds the state of the root
 * fiber with empty update queue.
 *
 * The container is the topmost object in the fiber tree, and it is used
 * to schedule updates on the root fiber.
 */
export function createContainer(container: Container) {
  const hostRootFiber = new FiberNode(HostRoot, {}, null);
  const root = new FiberRootNode(container, hostRootFiber);
  hostRootFiber.updateQueue = createUpdateQueue();
  return root;
}

/**
 * Schedules an update on the root fiber of the given `root` by adding an
 * update into the root's update queue and scheduling a call to `renderRoot` on
 * the root.
 */
export function updateContainer(
  element: ReactElementType | null,
  root: FiberRootNode
) {
  const hostRootFiber = root.current;
  const update = createUpdate<ReactElementType | null>(element);
  enqueueUpdate(
    hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
    update
  );
  scheduleUpdateOnFiber(hostRootFiber);
  return element;
}
