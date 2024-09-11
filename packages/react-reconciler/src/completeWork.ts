/**
 * This function is responsible for traversing the fiber tree and completing the work for each node.
 *
 * - For each node, `completeWork` will call `completeUnitOfWork` to complete the work.
 * - If the node is a host component, `completeWork` will call `completeHostComponent` to complete the work.
 * - If the node is a function component, `completeWork` will call `completeFunctionComponent` to complete the work.
 *
 */
export const completeWork = () => {};
