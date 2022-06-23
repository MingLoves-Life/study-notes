/*
 * @lc app=leetcode.cn id=24 lang=javascript
 *
 * [24] 两两交换链表中的节点
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var swapPairs = function (head) {
  // pre head next xxx
  const newList = new ListNode(0);
  newList.next = head;
  let pre = newList;
  while (head && head.next) {
    const next = head.next;
    head.next = next.next;
    next.next = head;
    pre.next = next;

    pre = head;
    head = head.next;
  }
  return newList.next;
};
// @lc code=end
