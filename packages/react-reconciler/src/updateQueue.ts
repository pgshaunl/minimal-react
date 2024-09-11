import { Action } from "shared/ReactTypes";

export interface Update<State> {
  action: Action<State>;
}

export const createUpdate = <State>(action: Action<State>): Update<State> => {
  return {
    action
  };
};

/**
 * An update queue is a mutable, shared data structure that stores all
 * updates scheduled during the render phase. It's used by the reconciler
 * to batch and deduplicate updates.
 */
export interface UpdateQueue<State> {
  shared: {
    pending: Update<State> | null;
  };
}

export const createUpdateQueue = <Action>() => {
  return {
    shared: {
      pending: null
    }
  } as UpdateQueue<Action>;
};

/**
 * Enqueue an update into the given updateQueue.
 */
export const enqueueUpdate = <Action>(
  updateQueue: UpdateQueue<Action>,
  update: Update<Action>
) => {
  updateQueue.shared.pending = update;
};

/**
 * Process the update queue and return the new memorized state.
 *
 * This method is a key part of React's Reconciler, which aims to minimize changes to the DOM.
 * By caching the updated state, we can avoid recalculating the entire state tree on subsequent updates.
 *
 * @philosophy
 *   - Minimize changes: Reduce the number of DOM mutations to improve performance.
 *   - Immutable data: Store updated states in new objects to ensure immutability.
 *   - Functional programming: Update states through pure functions for easier composition.
 */
export const processUpdateQueue = <State>(
  baseState: State,
  pendingUpdate: Update<State> | null
): { memorizedState: State } => {
  const result: ReturnType<typeof processUpdateQueue<State>> = {
    memorizedState: baseState
  };

  if (pendingUpdate !== null) {
    const action = pendingUpdate.action;
    if (action instanceof Function) {
      // baseState 1 update (x) => 4x -> memorizedState 4
      result.memorizedState = action(baseState);
    } else {
      // baseState 1 update 2 -> memorizedState 2
      result.memorizedState = action;
    }
  }

  return result;
};
