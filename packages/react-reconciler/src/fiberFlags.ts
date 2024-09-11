/**
 * The flags of the fiber node are used to indicate the side effects of the node.
 *
 * The flags can be one of the following values:
 * - NoFlags: No side effects.
 * - Placement: The fiber node has been placed.
 * - Update: The fiber node has been updated.
 * - Deletion: The fiber node has been deleted.
 * - ContentReset: The fiber node has been reset.
 */

export type Flags = number;

export const NoFlags = 0b0000001;
export const Placement = 0b0000010;
export const Update = 0b0000100;
export const Deletion = 0b0001000;
export const ContentReset = 0b0010000;

// Using binary flags for efficient storage and fast operations:
// - Multiple flags can be packed into a single number
// - Fast bitwise operations (&, |, ^) for combining and testing flags
// - Easy combination of flags using bitwise OR (|)
// - Simple testing of flags using bitwise AND (&)

//  This allows for efficient storage and manipulation of the fiber node's side effects,
//  which is important for performance-critical code like React's reconciliation algorithm.
