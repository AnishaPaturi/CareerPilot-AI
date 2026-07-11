import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  Info, 
  Sliders, 
  Code2, 
  Layers, 
  Terminal, 
  ArrowRight, 
  Sparkles,
  Award,
  Binary,
  GitCommit,
  Hash,
  Search,
  SlidersHorizontal,
  Network,
  Share2,
  Table,
  CornerUpLeft,
  Brain,
  Menu,
  Cpu
} from 'lucide-react';
import { ALGORITHMS } from '../data/visualizerData';
import { dsaPlannerAPI } from '../services/api';

// --- ALL 19 TRACE GENERATORS ---

const generateFibonacciTrace = (n) => {
  const steps = [];
  const fib = [0, 1];

  steps.push({
    step: 'init',
    explanation: `Initialize fib[0] = 0 and fib[1] = 1.`,
    variables: { n, i: null, 'fib[i-1]': null, 'fib[i-2]': null, val: null },
    fibState: [0, 1],
    activeIdx: null,
    sumIdxs: []
  });

  if (n <= 1) {
    steps.push({
      step: 'completed',
      explanation: `For n <= 1, return n directly. Fibonacci(${n}) = ${n}.`,
      variables: { n, i: null, val: n },
      fibState: n === 0 ? [0] : [0, 1],
      activeIdx: n,
      sumIdxs: []
    });
    return steps;
  }

  for (let i = 2; i <= n; i++) {
    steps.push({
      step: 'loop_start',
      explanation: `Loop iteration i = ${i}. We will compute fib[${i}] = fib[${i - 1}] + fib[${i - 2}].`,
      variables: { n, i, 'fib[i-1]': fib[i - 1], 'fib[i-2]': fib[i - 2], val: null },
      fibState: [...fib],
      activeIdx: i,
      sumIdxs: [i - 1, i - 2]
    });

    fib[i] = fib[i - 1] + fib[i - 2];

    steps.push({
      step: 'calculate',
      explanation: `Compute: fib[${i}] = fib[${i - 1}] (${fib[i - 1]}) + fib[${i - 2}] (${fib[i - 2]}) = ${fib[i]}.`,
      variables: { n, i, 'fib[i-1]': fib[i - 1], 'fib[i-2]': fib[i - 2], val: fib[i] },
      fibState: [...fib],
      activeIdx: i,
      sumIdxs: [i - 1, i - 2]
    });
  }

  steps.push({
    step: 'completed',
    explanation: `Loop finished. Return fib[${n}] = ${fib[n]}.`,
    variables: { n, i: n, val: fib[n] },
    fibState: [...fib],
    activeIdx: n,
    sumIdxs: []
  });

  return steps;
};

const generateSlidingWindowTrace = (arr, k) => {
  const steps = [];
  const n = arr.length;
  if (n < k || k <= 0) {
    return [{
      step: 'error',
      explanation: `Array length must be greater than or equal to window size K.`,
      variables: { max_sum: 0, window_sum: 0 }
    }];
  }

  let max_sum = 0;
  let window_sum = 0;

  steps.push({
    step: 'init',
    explanation: `Initialize max_sum = 0 and window_sum = 0. Window size K = ${k}.`,
    variables: { max_sum, window_sum, i: 0 },
    windowRange: null
  });

  for (let i = 0; i < k; i++) {
    window_sum += arr[i];
    steps.push({
      step: 'first_window',
      explanation: `Compute first window: add arr[${i}] (${arr[i]}) to sum. Current window sum = ${window_sum}.`,
      variables: { max_sum: 0, window_sum, i },
      windowRange: [0, i]
    });
  }

  max_sum = window_sum;
  steps.push({
    step: 'update_max',
    explanation: `Set max_sum to initial window sum = ${max_sum}.`,
    variables: { max_sum, window_sum, i: k - 1 },
    windowRange: [0, k - 1]
  });

  for (let i = k; i < n; i++) {
    const oldVal = arr[i - k];
    const newVal = arr[i];
    window_sum = window_sum - oldVal + newVal;

    steps.push({
      step: 'slide',
      explanation: `Slide window to include index ${i}. Subtract arr[${i - k}] (${oldVal}) and add arr[${i}] (${newVal}). New window sum = ${window_sum}.`,
      variables: { max_sum, window_sum, i },
      windowRange: [i - k + 1, i]
    });

    if (window_sum > max_sum) {
      max_sum = window_sum;
      steps.push({
        step: 'update_max',
        explanation: `New window sum (${window_sum}) > max_sum. Update max_sum = ${max_sum}.`,
        variables: { max_sum, window_sum, i },
        windowRange: [i - k + 1, i]
      });
    } else {
      steps.push({
        step: 'no_update',
        explanation: `New window sum (${window_sum}) <= max_sum (${max_sum}). Keep max_sum unchanged.`,
        variables: { max_sum, window_sum, i },
        windowRange: [i - k + 1, i]
      });
    }
  }

  steps.push({
    step: 'completed',
    explanation: `Sliding window completed. Maximum subarray sum of size ${k} is ${max_sum}.`,
    variables: { max_sum, window_sum, i: n - 1 },
    windowRange: [n - k, n - 1]
  });

  return steps;
};

const generateTwoSumTrace = (arr, target) => {
  const steps = [];
  let left = 0;
  let right = arr.length - 1;

  steps.push({
    step: 'init',
    explanation: `Initialize left pointer at index 0 and right pointer at index ${right}.`,
    variables: { left, right, sum: null, target, status: 'initializing' },
    activeIndices: [left, right],
    foundIndices: null
  });

  let safety = 0;
  while (safety++ < 100) {
    steps.push({
      step: 'check_loop',
      explanation: `Check loop condition: is left (${left}) < right (${right})? Yes.`,
      variables: { left, right, sum: null, target, status: 'checking pointers' },
      activeIndices: [left, right],
      foundIndices: null
    });

    if (left >= right) break;

    const sum = arr[left] + arr[right];

    steps.push({
      step: 'calc_sum',
      explanation: `Compute current sum: arr[left] (${arr[left]}) + arr[right] (${arr[right]}) = ${sum}.`,
      variables: { left, right, sum, target, status: 'sum calculated' },
      activeIndices: [left, right],
      foundIndices: null
    });

    steps.push({
      step: 'compare_eq',
      explanation: `Compare sum (${sum}) with target (${target}).`,
      variables: { left, right, sum, target, status: 'comparing' },
      activeIndices: [left, right],
      foundIndices: null
    });

    if (sum === target) {
      steps.push({
        step: 'found',
        explanation: `Sum (${sum}) matches target (${target})! Return indices [${left}, ${right}].`,
        variables: { left, right, sum, target, status: 'matches found' },
        activeIndices: [left, right],
        foundIndices: [left, right]
      });
      return steps;
    }

    steps.push({
      step: 'compare_lt',
      explanation: `Check if sum (${sum}) < target (${target}).`,
      variables: { left, right, sum, target, status: 'comparing' },
      activeIndices: [left, right],
      foundIndices: null
    });

    if (sum < target) {
      left++;
      steps.push({
        step: 'move_left',
        explanation: `Since sum (${sum}) < target (${target}), we need a larger sum. Move left pointer right to index ${left}.`,
        variables: { left, right, sum, target, status: 'moving left pointer' },
        activeIndices: [left, right],
        foundIndices: null
      });
    } else {
      right--;
      steps.push({
        step: 'move_right',
        explanation: `Since sum (${sum}) > target (${target}), we need a smaller sum. Move right pointer left to index ${right}.`,
        variables: { left, right, sum, target, status: 'moving right pointer' },
        activeIndices: [left, right],
        foundIndices: null
      });
    }
  }

  steps.push({
    step: 'not_found',
    explanation: `Pointers met (left >= right). No pair sum equals target (${target}). Return [-1, -1].`,
    variables: { left, right, sum: null, target, status: 'not found' },
    activeIndices: [],
    foundIndices: null
  });

  return steps;
};

const generateReverseListTrace = (arr) => {
  const steps = [];
  const nodes = arr.map((val, idx) => ({ id: idx, value: val, nextId: idx + 1 < arr.length ? idx + 1 : null }));

  let prev = null;
  let curr = 0;

  steps.push({
    step: 'init',
    explanation: `Initialize prev = null, curr = node 0 (${nodes[0]?.value}).`,
    variables: { prev: null, curr: 0, next: null },
    nodes: JSON.parse(JSON.stringify(nodes)),
    pointers: { prev, curr, next: null }
  });

  let safety = 0;
  while (curr !== null && safety++ < 20) {
    steps.push({
      step: 'check_loop',
      explanation: `Check if curr is not null. Current node is ${nodes[curr].value}.`,
      variables: { prev: prev !== null ? nodes[prev].value : 'null', curr: nodes[curr].value, next: 'null' },
      nodes: JSON.parse(JSON.stringify(nodes)),
      pointers: { prev, curr, next: null }
    });

    const next = nodes[curr].nextId;

    steps.push({
      step: 'save_next',
      explanation: `Save next node: next = curr.next (${next !== null ? nodes[next].value : 'null'}).`,
      variables: { prev: prev !== null ? nodes[prev].value : 'null', curr: nodes[curr].value, next: next !== null ? nodes[next].value : 'null' },
      nodes: JSON.parse(JSON.stringify(nodes)),
      pointers: { prev, curr, next }
    });

    nodes[curr].nextId = prev;

    steps.push({
      step: 'flip_link',
      explanation: `Reverse link: set curr.next to prev (${prev !== null ? nodes[prev].value : 'null'}).`,
      variables: { prev: prev !== null ? nodes[prev].value : 'null', curr: nodes[curr].value, next: next !== null ? nodes[next].value : 'null' },
      nodes: JSON.parse(JSON.stringify(nodes)),
      pointers: { prev, curr, next }
    });

    prev = curr;

    steps.push({
      step: 'move_prev',
      explanation: `Move prev pointer forward to curr (${nodes[curr].value}).`,
      variables: { prev: nodes[prev].value, curr: nodes[curr].value, next: next !== null ? nodes[next].value : 'null' },
      nodes: JSON.parse(JSON.stringify(nodes)),
      pointers: { prev, curr, next }
    });

    curr = next;

    steps.push({
      step: 'move_curr',
      explanation: `Move curr pointer forward to next (${curr !== null ? nodes[curr].value : 'null'}).`,
      variables: { prev: nodes[prev].value, curr: curr !== null ? nodes[curr].value : 'null', next: curr !== null ? nodes[curr].value : 'null' },
      nodes: JSON.parse(JSON.stringify(nodes)),
      pointers: { prev, curr, next: curr }
    });
  }

  steps.push({
    step: 'completed',
    explanation: `List reversal complete. Return new head pointer prev (${prev !== null ? nodes[prev].value : 'null'}).`,
    variables: { prev: prev !== null ? nodes[prev].value : 'null', curr: 'null', next: 'null' },
    nodes: JSON.parse(JSON.stringify(nodes)),
    pointers: { prev, curr: null, next: null }
  });

  return steps;
};

const generateStackTrace = (opsStr) => {
  const steps = [];
  const ops = opsStr.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  const stack = [];

  steps.push({
    step: 'init',
    explanation: `Initialize empty stack.`,
    variables: { operation: 'initialize', val: null, size: 0 },
    stackState: []
  });

  ops.forEach(op => {
    if (op.startsWith('push')) {
      const val = parseInt(op.split(' ')[1]) || 0;
      stack.push(val);
      steps.push({
        step: 'push',
        explanation: `Push operation: Add element ${val} to the top of stack.`,
        variables: { operation: `push(${val})`, val, size: stack.length },
        stackState: [...stack],
        actionItem: { type: 'push', val }
      });
    } else if (op.startsWith('pop')) {
      const val = stack.pop();
      steps.push({
        step: 'pop',
        explanation: val !== undefined 
          ? `Pop operation: Remove top element (${val}) from the stack.`
          : `Pop operation: Stack is empty. Cannot pop (Underflow).`,
        variables: { operation: 'pop()', val: val !== undefined ? val : 'underflow', size: stack.length },
        stackState: [...stack],
        actionItem: { type: 'pop', val }
      });
    }
  });

  return steps;
};

const generateQueueTrace = (opsStr) => {
  const steps = [];
  const ops = opsStr.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  const queue = [];

  steps.push({
    step: 'init',
    explanation: `Initialize empty queue.`,
    variables: { operation: 'initialize', val: null, size: 0 },
    queueState: []
  });

  ops.forEach(op => {
    if (op.startsWith('enqueue')) {
      const val = parseInt(op.split(' ')[1]) || 0;
      queue.push(val);
      steps.push({
        step: 'enqueue',
        explanation: `Enqueue operation: Add element ${val} at the rear (end) of queue.`,
        variables: { operation: `enqueue(${val})`, val, size: queue.length },
        queueState: [...queue],
        actionItem: { type: 'enqueue', val }
      });
    } else if (op.startsWith('dequeue')) {
      const val = queue.shift();
      steps.push({
        step: 'dequeue',
        explanation: val !== undefined
          ? `Dequeue operation: Remove front element (${val}) from the queue.`
          : `Dequeue operation: Queue is empty. Cannot dequeue (Underflow).`,
        variables: { operation: 'dequeue()', val: val !== undefined ? val : 'underflow', size: queue.length },
        queueState: [...queue],
        actionItem: { type: 'dequeue', val }
      });
    }
  });

  return steps;
};

const generateBinarySearchTrace = (arr, target) => {
  const steps = [];
  let low = 0;
  let high = arr.length - 1;
  
  steps.push({
    step: 'init',
    explanation: `Initialize 'low' pointer to index 0 and 'high' pointer to the last index (${arr.length - 1}).`,
    variables: { low, high, mid: null, status: 'initializing' },
    highlightRange: [low, high],
    midIndex: null,
    foundIndex: null
  });

  let safetyCounter = 0;
  while (safetyCounter++ < 100) {
    steps.push({
      step: 'loop_condition',
      explanation: `Check if 'low' (${low}) <= 'high' (${high}). The search interval is valid.`,
      variables: { low, high, mid: null, status: 'checking loop condition' },
      highlightRange: [low, high],
      midIndex: null,
      foundIndex: null
    });

    if (low > high) break;

    let mid = Math.floor((low + high) / 2);
    
    steps.push({
      step: 'mid_calc',
      explanation: `Calculate mid-point: mid = floor((${low} + ${high}) / 2) = ${mid}. Value at mid is arr[${mid}] = ${arr[mid]}.`,
      variables: { low, high, mid, status: 'mid-calculated' },
      highlightRange: [low, high],
      midIndex: mid,
      foundIndex: null
    });

    steps.push({
      step: 'compare_eq',
      explanation: `Compare arr[mid] (${arr[mid]}) with target (${target}).`,
      variables: { low, high, mid, status: 'comparing' },
      highlightRange: [low, high],
      midIndex: mid,
      foundIndex: null
    });

    if (arr[mid] === target) {
      steps.push({
        step: 'found',
        explanation: `Success! arr[mid] (${arr[mid]}) equals target (${target}). Return index ${mid}.`,
        variables: { low, high, mid, status: 'target found' },
        highlightRange: [low, high],
        midIndex: mid,
        foundIndex: mid
      });
      return steps;
    }

    steps.push({
      step: 'compare_lt',
      explanation: `Check if arr[mid] (${arr[mid]}) < target (${target}).`,
      variables: { low, high, mid, status: 'comparing' },
      highlightRange: [low, high],
      midIndex: mid,
      foundIndex: null
    });

    if (arr[mid] < target) {
      low = mid + 1;
      steps.push({
        step: 'update_low',
        explanation: `Since arr[mid] (${arr[mid]}) < target (${target}), target must be in the right half. Update 'low' to mid + 1 (${low}).`,
        variables: { low, high, mid, status: 'updating low pointer' },
        highlightRange: [low, high],
        midIndex: mid,
        foundIndex: null
      });
    } else {
      high = mid - 1;
      steps.push({
        step: 'update_high',
        explanation: `Since arr[mid] (${arr[mid]}) > target (${target}), target must be in the left half. Update 'high' to mid - 1 (${high}).`,
        variables: { low, high, mid, status: 'updating high pointer' },
        highlightRange: [low, high],
        midIndex: mid,
        foundIndex: null
      });
    }
  }

  steps.push({
    step: 'not_found',
    explanation: `Search interval empty ('low' > 'high'). Target ${target} not found in the array. Return -1.`,
    variables: { low, high, mid: null, status: 'not found' },
    highlightRange: [],
    midIndex: null,
    foundIndex: null
  });

  return steps;
};

const generateLinearSearchTrace = (arr, target) => {
  const steps = [];
  const n = arr.length;

  steps.push({
    step: 'init',
    explanation: `Initialize linear search. Target value is ${target}.`,
    variables: { i: null, target, status: 'initializing' },
    activeIdx: null,
    foundIdx: null
  });

  for (let i = 0; i < n; i++) {
    steps.push({
      step: 'loop_check',
      explanation: `Loop check: index i = ${i} < length (${n}). Compare arr[${i}] (${arr[i]}) with target (${target}).`,
      variables: { i, target, status: 'scanning' },
      activeIdx: i,
      foundIdx: null
    });

    steps.push({
      step: 'compare',
      explanation: `Is arr[${i}] (${arr[i]}) === target (${target})?`,
      variables: { i, target, status: 'comparing' },
      activeIdx: i,
      foundIdx: null
    });

    if (arr[i] === target) {
      steps.push({
        step: 'found',
        explanation: `Match found! arr[${i}] equals target (${target}). Return index ${i}.`,
        variables: { i, target, status: 'target found' },
        activeIdx: i,
        foundIdx: i
      });
      return steps;
    }
  }

  steps.push({
    step: 'not_found',
    explanation: `Scanned entire array. Target ${target} not found. Return -1.`,
    variables: { i: n, target, status: 'not found' },
    activeIdx: null,
    foundIdx: null
  });

  return steps;
};

const generateBubbleSortTrace = (arr) => {
  const steps = [];
  const A = [...arr];
  const n = A.length;

  steps.push({
    step: 'init',
    explanation: `Starting Bubble Sort on an array of size ${n}.`,
    variables: { i: 0, j: 0, swapped: false },
    arrayState: [...A],
    activeIndices: [],
    sortedIndices: []
  });

  for (let i = 0; i < n - 1; i++) {
    steps.push({
      step: 'outer_loop',
      explanation: `Outer loop iteration i = ${i}. Largest ${i} elements are already positioned.`,
      variables: { i, j: 0, swapped: false },
      arrayState: [...A],
      activeIndices: [],
      sortedIndices: Array.from({ length: i }, (_, k) => n - 1 - k)
    });

    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        step: 'inner_loop',
        explanation: `Inner loop j = ${j}. Compare arr[j] (${A[j]}) and arr[j+1] (${A[j+1]}).`,
        variables: { i, j, swapped },
        arrayState: [...A],
        activeIndices: [j, j + 1],
        sortedIndices: Array.from({ length: i }, (_, k) => n - 1 - k)
      });

      steps.push({
        step: 'compare',
        explanation: `Is arr[j] (${A[j]}) > arr[j+1] (${A[j+1]})?`,
        variables: { i, j, swapped },
        arrayState: [...A],
        activeIndices: [j, j + 1],
        sortedIndices: Array.from({ length: i }, (_, k) => n - 1 - k)
      });

      if (A[j] > A[j + 1]) {
        const temp = A[j];
        A[j] = A[j + 1];
        A[j + 1] = temp;
        swapped = true;

        steps.push({
          step: 'swap',
          explanation: `Yes, ${A[j+1]} < ${A[j]}. Swap them.`,
          variables: { i, j, swapped: true },
          arrayState: [...A],
          activeIndices: [j, j + 1],
          sortedIndices: Array.from({ length: i }, (_, k) => n - 1 - k)
        });
      } else {
        steps.push({
          step: 'no_swap',
          explanation: `No swap needed since ${A[j]} <= ${A[j+1]}.`,
          variables: { i, j, swapped },
          arrayState: [...A],
          activeIndices: [j, j + 1],
          sortedIndices: Array.from({ length: i }, (_, k) => n - 1 - k)
        });
      }
    }
  }

  steps.push({
    step: 'sorted',
    explanation: `Array is fully sorted! Bubble Sort completed.`,
    variables: { i: n - 1, j: n - 1 },
    arrayState: [...A],
    activeIndices: [],
    sortedIndices: Array.from({ length: n }, (_, k) => k)
  });

  return steps;
};

const generateQuickSortTrace = (arr) => {
  const steps = [];
  const A = [...arr];

  steps.push({
    step: 'init',
    explanation: `Starting Quick Sort partition step on array of size ${A.length}.`,
    variables: { low: 0, high: A.length - 1, pivot: A[A.length - 1], i: -1, j: 0 },
    arrayState: [...A],
    activeRange: [0, A.length - 1],
    pivotIdx: A.length - 1,
    iIdx: -1,
    jIdx: 0,
    swapped: false
  });

  const partition = (low, high) => {
    const pivot = A[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({
        step: 'compare',
        explanation: `Compare arr[j] (${A[j]}) with pivot (${pivot}).`,
        variables: { low, high, pivot, i, j },
        arrayState: [...A],
        activeRange: [low, high],
        pivotIdx: high,
        iIdx: i,
        jIdx: j,
        swapped: false
      });

      if (A[j] < pivot) {
        i++;
        const temp = A[i];
        A[i] = A[j];
        A[j] = temp;
        steps.push({
          step: 'swap_left',
          explanation: `Since arr[j] (${A[j]}) < pivot (${pivot}), increment i to ${i} and swap arr[i] with arr[j].`,
          variables: { low, high, pivot, i, j },
          arrayState: [...A],
          activeRange: [low, high],
          pivotIdx: high,
          iIdx: i,
          jIdx: j,
          swapped: true
        });
      } else {
        steps.push({
          step: 'no_swap',
          explanation: `Since arr[j] (${A[j]}) >= pivot (${pivot}), no swap.`,
          variables: { low, high, pivot, i, j },
          arrayState: [...A],
          activeRange: [low, high],
          pivotIdx: high,
          iIdx: i,
          jIdx: j,
          swapped: false
        });
      }
    }

    const temp = A[i + 1];
    A[i + 1] = A[high];
    A[high] = temp;

    steps.push({
      step: 'swap_pivot',
      explanation: `Loop complete. Swap pivot at index ${high} with index i + 1 (${i + 1}).`,
      variables: { low, high, pivot, i: i + 1, j: high },
      arrayState: [...A],
      activeRange: [low, high],
      pivotIdx: i + 1,
      iIdx: i + 1,
      jIdx: high,
      swapped: true
    });

    return i + 1;
  };

  partition(0, A.length - 1);

  steps.push({
    step: 'completed',
    explanation: `Partition step complete. Pivot is placed at its final sorted position.`,
    variables: { low: 0, high: A.length - 1, pivot: null, i: null, j: null },
    arrayState: [...A],
    activeRange: [],
    pivotIdx: null,
    iIdx: null,
    jIdx: null,
    swapped: false
  });

  return steps;
};

const generateBSTTrace = (values) => {
  const steps = [];
  
  function Node(val, id) {
    this.id = id;
    this.value = val;
    this.left = null;
    this.right = null;
  }

  function cloneTree(root) {
    if (!root) return null;
    const cloned = new Node(root.value, root.id);
    cloned.left = cloneTree(root.left);
    cloned.right = cloneTree(root.right);
    return cloned;
  }

  let root = null;
  let nodeId = 0;

  steps.push({
    step: 'init_empty',
    explanation: `Start inserting values [${values.join(', ')}] into the Binary Search Tree. Tree is empty.`,
    variables: { val: null, current: null },
    tree: null,
    activeNodeId: null,
    newNodeId: null
  });

  values.forEach((val) => {
    const id = nodeId++;
    const newNode = new Node(val, id);
    
    if (!root) {
      root = newNode;
      steps.push({
        step: 'insert_root',
        explanation: `Insert first value ${val} as the root node of the tree.`,
        variables: { val, current: 'root' },
        tree: cloneTree(root),
        activeNodeId: id,
        newNodeId: id
      });
      return;
    }

    let curr = root;
    steps.push({
      step: 'start_search',
      explanation: `Insert value ${val}. Start search at root node (${root.value}).`,
      variables: { val, current: curr.value },
      tree: cloneTree(root),
      activeNodeId: curr.id,
      newNodeId: null
    });

    let safety = 0;
    while (safety++ < 50) {
      steps.push({
        step: 'compare',
        explanation: `Compare new value ${val} with current node value ${curr.value}.`,
        variables: { val, current: curr.value },
        tree: cloneTree(root),
        activeNodeId: curr.id,
        newNodeId: null
      });

      if (val < curr.value) {
        steps.push({
          step: 'go_left_check',
          explanation: `Since ${val} < ${curr.value}, check left subtree.`,
          variables: { val, current: curr.value },
          tree: cloneTree(root),
          activeNodeId: curr.id,
          newNodeId: null
        });

        if (!curr.left) {
          curr.left = newNode;
          steps.push({
            step: 'insert_left',
            explanation: `Left child is empty. Insert ${val} as the left child of ${curr.value}.`,
            variables: { val, current: curr.value },
            tree: cloneTree(root),
            activeNodeId: id,
            newNodeId: id
          });
          break;
        } else {
          curr = curr.left;
          steps.push({
            step: 'go_left',
            explanation: `Move to left child (${curr.value}).`,
            variables: { val, current: curr.value },
            tree: cloneTree(root),
            activeNodeId: curr.id,
            newNodeId: null
          });
        }
      } else {
        steps.push({
          step: 'go_right_check',
          explanation: `Since ${val} >= ${curr.value}, check right subtree.`,
          variables: { val, current: curr.value },
          tree: cloneTree(root),
          activeNodeId: curr.id,
          newNodeId: null
        });

        if (!curr.right) {
          curr.right = newNode;
          steps.push({
            step: 'insert_right',
            explanation: `Right child is empty. Insert ${val} as the right child of ${curr.value}.`,
            variables: { val, current: curr.value },
            tree: cloneTree(root),
            activeNodeId: id,
            newNodeId: id
          });
          break;
        } else {
          curr = curr.right;
          steps.push({
            step: 'go_right',
            explanation: `Move to right child (${curr.value}).`,
            variables: { val, current: curr.value },
            tree: cloneTree(root),
            activeNodeId: curr.id,
            newNodeId: null
          });
        }
      }
    }
  });

  steps.push({
    step: 'completed',
    explanation: `All values [${values.join(', ')}] successfully inserted into the BST!`,
    variables: { val: null, current: null },
    tree: cloneTree(root),
    activeNodeId: null,
    newNodeId: null
  });

  return steps;
};

const generateInorderTrace = (values) => {
  const steps = [];

  function Node(val, id) {
    this.id = id;
    this.value = val;
    this.left = null;
    this.right = null;
  }

  let root = null;
  let nodeId = 0;

  const insert = (node, val) => {
    if (!node) return new Node(val, nodeId++);
    if (val < node.value) {
      node.left = insert(node.left, val);
    } else {
      node.right = insert(node.right, val);
    }
    return node;
  };

  values.forEach(v => {
    root = insert(root, v);
  });

  function cloneTree(node) {
    if (!node) return null;
    const cloned = new Node(node.value, node.id);
    cloned.left = cloneTree(node.left);
    cloned.right = cloneTree(node.right);
    return cloned;
  }

  const visited = [];

  const traverse = (node) => {
    if (!node) {
      steps.push({
        step: 'null_check',
        explanation: `Current node is null. Return up stack.`,
        variables: { current: 'null', visited: [...visited] },
        tree: cloneTree(root),
        activeNodeId: null,
        visitedNodeIds: visited.map(n => n.id)
      });
      return;
    }

    steps.push({
      step: 'call',
      explanation: `Call inorder traversal on node ${node.value}.`,
      variables: { current: node.value, visited: visited.map(n => n.value) },
      tree: cloneTree(root),
      activeNodeId: node.id,
      visitedNodeIds: visited.map(n => n.id)
    });

    steps.push({
      step: 'left_recurse',
      explanation: `Traverse left subtree of node ${node.value}.`,
      variables: { current: node.value, visited: visited.map(n => n.value) },
      tree: cloneTree(root),
      activeNodeId: node.id,
      visitedNodeIds: visited.map(n => n.id)
    });
    traverse(node.left);

    visited.push(node);

    steps.push({
      step: 'visit',
      explanation: `Visit root value: Add ${node.value} to inorder result.`,
      variables: { current: node.value, visited: visited.map(n => n.value) },
      tree: cloneTree(root),
      activeNodeId: node.id,
      visitedNodeIds: visited.map(n => n.id)
    });

    steps.push({
      step: 'right_recurse',
      explanation: `Traverse right subtree of node ${node.value}.`,
      variables: { current: node.value, visited: visited.map(n => n.value) },
      tree: cloneTree(root),
      activeNodeId: node.id,
      visitedNodeIds: visited.map(n => n.id)
    });
    traverse(node.right);
  };

  traverse(root);

  steps.push({
    step: 'null_check',
    explanation: `Traversal complete. Full inorder output: [${visited.map(n => n.value).join(', ')}].`,
    variables: { current: 'null', visited: visited.map(n => n.value) },
    tree: cloneTree(root),
    activeNodeId: null,
    visitedNodeIds: visited.map(n => n.id)
  });

  return steps;
};

const generateDijkstraTrace = (startNode = 'A') => {
  const steps = [];
  const nodes = ['A', 'B', 'C', 'D', 'E', 'F'];
  const graph = {
    A: { B: 4, C: 2 },
    B: { A: 4, C: 1, D: 5 },
    C: { A: 2, B: 1, D: 8, E: 10 },
    D: { B: 5, C: 8, E: 2, F: 6 },
    E: { C: 10, D: 2, F: 3 },
    F: { D: 6, E: 3 }
  };

  const dist = {};
  const prev = {};
  const visited = new Set();

  nodes.forEach(node => {
    dist[node] = Infinity;
    prev[node] = null;
  });
  dist[startNode] = 0;

  steps.push({
    step: 'init',
    explanation: `Initialize distances: set dist[${startNode}] = 0 and all other node distances to Infinity.`,
    variables: { current: null, dist: { ...dist }, visited: [], queue: [...nodes] },
    activeNode: null,
    visitingNode: null,
    distances: { ...dist },
    relaxedEdges: []
  });

  const getMinNode = () => {
    let minNode = null;
    let minDist = Infinity;
    nodes.forEach(node => {
      if (!visited.has(node) && dist[node] < minDist) {
        minDist = dist[node];
        minNode = node;
      }
    });
    return minNode;
  };

  let safety = 0;
  while (safety++ < 10) {
    const curr = getMinNode();
    if (!curr) break;

    steps.push({
      step: 'select_min',
      explanation: `Select unvisited node '${curr}' with the minimum distance (${dist[curr]}).`,
      variables: { current: curr, dist: { ...dist }, visited: Array.from(visited), queue: nodes.filter(n => !visited.has(n)) },
      activeNode: curr,
      visitingNode: null,
      distances: { ...dist },
      relaxedEdges: []
    });

    visited.add(curr);

    const neighbors = graph[curr];
    for (const neighbor in neighbors) {
      if (visited.has(neighbor)) continue;

      const weight = neighbors[neighbor];
      const alt = dist[curr] + weight;

      steps.push({
        step: 'check_neighbor',
        explanation: `Examine neighbor '${neighbor}'. Edge ${curr} -> ${neighbor} weight is ${weight}. Path length = ${dist[curr]} + ${weight} = ${alt}.`,
        variables: { current: curr, neighbor, alt, dist: { ...dist } },
        activeNode: curr,
        visitingNode: neighbor,
        distances: { ...dist },
        relaxedEdges: []
      });

      if (alt < dist[neighbor]) {
        const oldDist = dist[neighbor];
        dist[neighbor] = alt;
        prev[neighbor] = curr;
        steps.push({
          step: 'relax_edge',
          explanation: `Since ${alt} < dist[${neighbor}] (${oldDist === Infinity ? 'Infinity' : oldDist}), update dist[${neighbor}] = ${alt}. (Relax edge)`,
          variables: { current: curr, neighbor, alt, dist: { ...dist } },
          activeNode: curr,
          visitingNode: neighbor,
          distances: { ...dist },
          relaxedEdges: [[curr, neighbor]]
        });
      } else {
        steps.push({
          step: 'no_relax',
          explanation: `Since ${alt} >= dist[${neighbor}] (${dist[neighbor]}), keep current path. No update.`,
          variables: { current: curr, neighbor, alt, dist: { ...dist } },
          activeNode: curr,
          visitingNode: neighbor,
          distances: { ...dist },
          relaxedEdges: []
        });
      }
    }
  }

  steps.push({
    step: 'completed',
    explanation: `Dijkstra's shortest path search completed. All shortest paths from source '${startNode}' are computed.`,
    variables: { current: null, dist: { ...dist }, visited: Array.from(visited), queue: [] },
    activeNode: null,
    visitingNode: null,
    distances: { ...dist },
    relaxedEdges: []
  });

  return steps;
};

const generateBFSTrace = (startNode = 'A') => {
  const steps = [];
  const adjList = {
    A: ['B', 'C'],
    B: ['A', 'C', 'D'],
    C: ['A', 'B', 'D', 'E'],
    D: ['B', 'C', 'E', 'F'],
    E: ['C', 'D', 'F'],
    F: ['D', 'E']
  };

  const visited = new Set();
  const queue = [];

  visited.add(startNode);
  queue.push(startNode);

  steps.push({
    step: 'init',
    explanation: `Initialize BFS: Add start node '${startNode}' to Visited set and push to Queue.`,
    variables: { current: null, visited: [startNode], queue: [startNode] },
    activeNode: null,
    visitingNode: null,
    visitedNodes: [startNode],
    queueState: [startNode]
  });

  let safety = 0;
  while (queue.length > 0 && safety++ < 30) {
    steps.push({
      step: 'check_queue',
      explanation: `Check queue: is queue empty? No. Next element is '${queue[0]}'.`,
      variables: { current: null, visited: Array.from(visited), queue: [...queue] },
      activeNode: null,
      visitingNode: null,
      visitedNodes: Array.from(visited),
      queueState: [...queue]
    });

    const curr = queue.shift();

    steps.push({
      step: 'dequeue',
      explanation: `Dequeue node '${curr}' from front of queue to process.`,
      variables: { current: curr, visited: Array.from(visited), queue: [...queue] },
      activeNode: curr,
      visitingNode: null,
      visitedNodes: Array.from(visited),
      queueState: [...queue]
    });

    steps.push({
      step: 'visit',
      explanation: `Visit node '${curr}'.`,
      variables: { current: curr, visited: Array.from(visited), queue: [...queue] },
      activeNode: curr,
      visitingNode: null,
      visitedNodes: Array.from(visited),
      queueState: [...queue]
    });

    const neighbors = adjList[curr] || [];
    for (const neighbor of neighbors) {
      steps.push({
        step: 'check_neighbor',
        explanation: `Examine neighbor '${neighbor}' of node '${curr}'.`,
        variables: { current: curr, neighbor, visited: Array.from(visited), queue: [...queue] },
        activeNode: curr,
        visitingNode: neighbor,
        visitedNodes: Array.from(visited),
        queueState: [...queue]
      });

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);

        steps.push({
          step: 'enqueue',
          explanation: `Neighbor '${neighbor}' is unvisited. Add to Visited set and push to Queue.`,
          variables: { current: curr, neighbor, visited: Array.from(visited), queue: [...queue] },
          activeNode: curr,
          visitingNode: neighbor,
          visitedNodes: Array.from(visited),
          queueState: [...queue]
        });
      }
    }
  }

  steps.push({
    step: 'completed',
    explanation: `BFS complete. Visited all reachable nodes in level-order.`,
    variables: { current: null, visited: Array.from(visited), queue: [] },
    activeNode: null,
    visitingNode: null,
    visitedNodes: Array.from(visited),
    queueState: []
  });

  return steps;
};

const generateLcsTrace = (text1, text2) => {
  const steps = [];
  const m = text1.length;
  const n = text2.length;

  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  steps.push({
    step: 'init',
    explanation: `Initialize DP table of size (${m + 1} x ${n + 1}) with 0s. Row corresponds to '${text1}', Col to '${text2}'.`,
    variables: { i: 0, j: 0, dp: JSON.parse(JSON.stringify(dp)) },
    activeCell: null,
    lookupCells: [],
    match: null
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const char1 = text1[i - 1];
      const char2 = text2[j - 1];
      const isMatch = char1 === char2;

      steps.push({
        step: isMatch ? 'compare_match' : 'compare_mismatch',
        explanation: `Compare text1[${i-1}] ('${char1}') and text2[${j-1}] ('${char2}'). ${isMatch ? "They match!" : "Mismatch."}`,
        variables: { i, j, char1, char2, match: isMatch, dp: JSON.parse(JSON.stringify(dp)) },
        activeCell: [i, j],
        lookupCells: isMatch ? [[i - 1, j - 1]] : [[i - 1, j], [i, j - 1]],
        match: isMatch
      });

      if (isMatch) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        steps.push({
          step: 'fill_match',
          explanation: `Since characters match, set dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${dp[i-1][j-1]} + 1 = ${dp[i][j]}.`,
          variables: { i, j, char1, char2, match: isMatch, dp: JSON.parse(JSON.stringify(dp)) },
          activeCell: [i, j],
          lookupCells: [[i - 1, j - 1]],
          match: isMatch
        });
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        steps.push({
          step: 'fill_mismatch',
          explanation: `Characters mismatch. Set dp[${i}][${j}] = max(dp[${i-1}][${j}] (${dp[i-1][j]}), dp[${i}][${j-1}] (${dp[i][j-1]})) = ${dp[i][j]}.`,
          variables: { i, j, char1, char2, match: isMatch, dp: JSON.parse(JSON.stringify(dp)) },
          activeCell: [i, j],
          lookupCells: [[i - 1, j], [i, j - 1]],
          match: isMatch
        });
      }
    }
  }

  steps.push({
    step: 'completed',
    explanation: `DP matrix complete. Longest Common Subsequence length is ${dp[m][n]}.`,
    variables: { i: m, j: n, dp: JSON.parse(JSON.stringify(dp)) },
    activeCell: [m, n],
    lookupCells: [],
    match: null
  });

  return steps;
};

const generateKnapsackTrace = (wtStr, valStr, capacity) => {
  const steps = [];
  const wt = wtStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
  const val = valStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
  const n = wt.length;
  const W = capacity;

  const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

  steps.push({
    step: 'init',
    explanation: `Initialize DP table size (${n+1} x ${W+1}) with 0s. Row corresponds to items, Col to Knapsack capacity.`,
    variables: { i: 0, w: 0, dp: JSON.parse(JSON.stringify(dp)) },
    activeCell: null,
    lookupCells: []
  });

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= W; w++) {
      steps.push({
        step: 'check_fit',
        explanation: `Does item ${i} weight (${wt[i-1]}) <= current capacity (${w})?`,
        variables: { i, w, dp: JSON.parse(JSON.stringify(dp)), currentWeight: wt[i-1], currentValue: val[i-1] },
        activeCell: [i, w],
        lookupCells: []
      });

      if (wt[i - 1] <= w) {
        dp[i][w] = Math.max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
        steps.push({
          step: 'fill_take',
          explanation: `Item fits. dp[${i}][${w}] = max(val[${i-1}] + dp[${i-1}][${w - wt[i-1]}] (${val[i-1]} + ${dp[i-1][w-wt[i-1]]}), dp[${i-1}][${w}] (${dp[i-1][w]})) = ${dp[i][w]}.`,
          variables: { i, w, dp: JSON.parse(JSON.stringify(dp)) },
          activeCell: [i, w],
          lookupCells: [[i - 1, w - wt[i - 1]], [i - 1, w]]
        });
      } else {
        dp[i][w] = dp[i - 1][w];
        steps.push({
          step: 'fill_leave',
          explanation: `Item weight ${wt[i-1]} exceeds capacity ${w}. Carry forward previous value: dp[${i}][${w}] = dp[${i-1}][${w}] = ${dp[i][w]}.`,
          variables: { i, w, dp: JSON.parse(JSON.stringify(dp)) },
          activeCell: [i, w],
          lookupCells: [[i - 1, w]]
        });
      }
    }
  }

  steps.push({
    step: 'completed',
    explanation: `Knapsack calculation complete. Max value subset weight fits in W (${W}) is ${dp[n][W]}.`,
    variables: { i: n, w: W, dp: JSON.parse(JSON.stringify(dp)) },
    activeCell: [n, W],
    lookupCells: []
  });

  return steps;
};

const generateNQueensTrace = (n = 4) => {
  const steps = [];
  const board = Array.from({ length: n }, () => Array(n).fill(false));

  const getBoardCopy = (b) => b.map(r => [...r]);

  steps.push({
    step: 'init',
    explanation: `Initialize an empty ${n}x${n} chessboard. We will place one queen in each row.`,
    variables: { row: 0, col: 0, board: getBoardCopy(board) },
    board: getBoardCopy(board),
    activeCell: null,
    safeCells: [],
    conflictCells: []
  });

  const solve = (row) => {
    if (row === n) {
      steps.push({
        step: 'found_solution',
        explanation: `All ${n} queens placed successfully! Solution found.`,
        variables: { row, col: 0, board: getBoardCopy(board) },
        board: getBoardCopy(board),
        activeCell: null,
        safeCells: [],
        conflictCells: []
      });
      return true;
    }

    for (let col = 0; col < n; col++) {
      steps.push({
        step: 'try_col',
        explanation: `Row ${row}: Try placing a queen in column ${col}.`,
        variables: { row, col, board: getBoardCopy(board) },
        board: getBoardCopy(board),
        activeCell: [row, col],
        safeCells: [],
        conflictCells: []
      });

      const conflicts = [];
      for (let i = 0; i < row; i++) {
        if (board[i][col]) conflicts.push([i, col]);
      }
      for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j]) conflicts.push([i, j]);
      }
      for (let i = row, j = col; i >= 0 && j < n; i--, j++) {
        if (board[i][j]) conflicts.push([i, j]);
      }

      const safe = conflicts.length === 0;

      steps.push({
        step: 'check_safe',
        explanation: `Checking safety at (${row}, ${col}). ${safe ? "No conflicts found." : `Conflict found at ${conflicts.map(c => `(${c[0]},${c[1]})`).join(', ')}.`}`,
        variables: { row, col, board: getBoardCopy(board) },
        board: getBoardCopy(board),
        activeCell: [row, col],
        safeCells: safe ? [[row, col]] : [],
        conflictCells: conflicts
      });

      if (safe) {
        board[row][col] = true;
        steps.push({
          step: 'place_queen',
          explanation: `Position is safe. Place queen at (${row}, ${col}) and proceed to row ${row + 1}.`,
          variables: { row: row + 1, col: 0, board: getBoardCopy(board) },
          board: getBoardCopy(board),
          activeCell: [row, col],
          safeCells: [],
          conflictCells: []
        });

        const res = solve(row + 1);
        if (res) return true;

        board[row][col] = false;
        steps.push({
          step: 'backtrack',
          explanation: `Backtrack: remove queen from (${row}, ${col}) and try the next column.`,
          variables: { row, col, board: getBoardCopy(board) },
          board: getBoardCopy(board),
          activeCell: [row, col],
          safeCells: [],
          conflictCells: []
        });
      }
    }
    return false;
  };

  solve(0);

  steps.push({
    step: 'completed',
    explanation: `Search completed.`,
    variables: { row: n, col: n, board: getBoardCopy(board) },
    board: getBoardCopy(board),
    activeCell: null,
    safeCells: [],
    conflictCells: []
  });

  return steps;
};

const generateSingleNumberTrace = (nums) => {
  const steps = [];
  let result = 0;

  steps.push({
    step: 'init',
    explanation: `Initialize result = 0.`,
    variables: { result, num: null, 'result_binary': '0000', 'num_binary': null },
    activeIdx: null
  });

  nums.forEach((num, idx) => {
    steps.push({
      step: 'loop_check',
      explanation: `Process element index ${idx}: val = ${num}.`,
      variables: { result, num, 'result_binary': result.toString(2).padStart(4, '0'), 'num_binary': num.toString(2).padStart(4, '0') },
      activeIdx: idx
    });

    const prevResult = result;
    result ^= num;

    steps.push({
      step: 'xor_op',
      explanation: `XOR result: ${prevResult} (${prevResult.toString(2).padStart(4, '0')}) ^ ${num} (${num.toString(2).padStart(4, '0')}) = ${result} (${result.toString(2).padStart(4, '0')}).`,
      variables: { result, num, 'result_binary': result.toString(2).padStart(4, '0'), 'num_binary': num.toString(2).padStart(4, '0') },
      activeIdx: idx
    });
  });

  steps.push({
    step: 'completed',
    explanation: `Iteration finished. Unique single number is ${result}.`,
    variables: { result, num: null, 'result_binary': result.toString(2).padStart(4, '0') },
    activeIdx: null
  });

  return steps;
};

const generateCountBitsTrace = (nVal) => {
  const steps = [];
  let count = 0;
  let n = nVal;

  steps.push({
    step: 'init',
    explanation: `Initialize count = 0. We will check set bits of n = ${nVal} (${nVal.toString(2).padStart(4, '0')}).`,
    variables: { count, n, 'n_binary': n.toString(2).padStart(4, '0'), status: 'initializing' }
  });

  let safety = 0;
  while (n > 0 && safety++ < 20) {
    steps.push({
      step: 'check_loop',
      explanation: `Check loop: is n (${n}) > 0? Yes. Check rightmost bit.`,
      variables: { count, n, 'n_binary': n.toString(2).padStart(4, '0'), status: 'loop check' }
    });

    const bit = n & 1;
    count += bit;

    steps.push({
      step: 'check_bit',
      explanation: `Evaluate last bit (n & 1): ${n} & 1 = ${bit}. Count is now ${count}.`,
      variables: { count, n, 'n_binary': n.toString(2).padStart(4, '0'), bit, status: 'bit evaluated' }
    });

    n = n >> 1;

    steps.push({
      step: 'shift',
      explanation: `Right shift n bitwise (n = n >> 1): value is now ${n} (${n.toString(2).padStart(4, '0')}).`,
      variables: { count, n, 'n_binary': n.toString(2).padStart(4, '0'), status: 'shifted' }
    });
  }

  steps.push({
    step: 'completed',
    explanation: `Loop ended (n is 0). Total set bits (1s) count is ${count}.`,
    variables: { count, n, 'n_binary': n.toString(2).padStart(4, '0'), status: 'completed' }
  });

  return steps;
};

const getBSTLayout = (node, x = 240, y = 35, level = 0, parentX = null, parentY = null) => {
  if (!node) return [];
  const offset = 120 / Math.pow(1.7, level);
  const left = getBSTLayout(node.left, x - offset, y + 55, level + 1, x, y);
  const right = getBSTLayout(node.right, x + offset, y + 55, level + 1, x, y);
  return [
    { id: node.id, val: node.value, x, y, parentX, parentY, hasLeft: !!node.left, hasRight: !!node.right },
    ...left,
    ...right
  ];
};

export default function CodeSketchVisualizer() {
  const [activeWorkspaceMode, setActiveWorkspaceMode] = useState('curated'); // 'curated' or 'ai_sandbox'
  const [selectedAlgoKey, setSelectedAlgoKey] = useState('binary_search');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [speed, setSpeed] = useState(700);

  // AI sandbox state variables
  const [aiProblemQuery, setAiProblemQuery] = useState('LeetCode 20: Valid Parentheses');
  const [aiCustomInput, setAiCustomInput] = useState('()[]{}');
  const [aiLanguage, setAiLanguage] = useState('javascript');
  const [aiTraceData, setAiTraceData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Sidebar categories collapsing/expanding
  const [expandedCategories, setExpandedCategories] = useState({
    'Fundamentals': true, 'Arrays': true, 'Linked Lists': true, 'Stacks & Queues': true,
    'Searching': true, 'Sorting': true, 'Trees': true, 'Graphs': true,
    'Dynamic Programming': true, 'Backtracking': true, 'Bit Manipulation': true
  });

  const categories = [
    { name: 'Fundamentals', icon: Brain, count: 1, color: 'text-indigo-400' },
    { name: 'Arrays', icon: Table, count: 2, color: 'text-blue-400' },
    { name: 'Linked Lists', icon: GitCommit, count: 1, color: 'text-cyan-400' },
    { name: 'Stacks & Queues', icon: Layers, count: 2, color: 'text-teal-400' },
    { name: 'Searching', icon: Search, count: 2, color: 'text-yellow-400' },
    { name: 'Sorting', icon: SlidersHorizontal, count: 2, color: 'text-amber-400' },
    { name: 'Trees', icon: Network, count: 2, color: 'text-emerald-400' },
    { name: 'Graphs', icon: Share2, count: 2, color: 'text-purple-400' },
    { name: 'Dynamic Programming', icon: Layers, count: 2, color: 'text-pink-400' },
    { name: 'Backtracking', icon: CornerUpLeft, count: 1, color: 'text-rose-400' },
    { name: 'Bit Manipulation', icon: Binary, count: 2, color: 'text-violet-400' }
  ];

  const [customInputs, setCustomInputs] = useState({
    fibonacci: { n: 6 },
    sliding_window: { arrayStr: "2, 1, 5, 1, 3, 2", k: 3 },
    two_sum: { arrayStr: "1, 2, 4, 6, 8, 9, 14, 15", target: 13 },
    reverse_linked_list: { arrayStr: "1, 2, 3, 4, 5" },
    stack_ops: { opsStr: "push 10, push 20, pop, push 30, pop, push 40" },
    queue_ops: { opsStr: "enqueue 10, enqueue 20, dequeue, enqueue 30, dequeue, enqueue 40" },
    binary_search: { arrayStr: "2, 5, 8, 12, 16, 23, 38, 56, 72, 91", target: 23 },
    linear_search: { arrayStr: "12, 5, 8, 19, 23, 7, 14", target: 23 },
    bubble_sort: { arrayStr: "38, 27, 43, 3, 9, 82, 10" },
    quick_sort: { arrayStr: "24, 9, 29, 14, 19, 27" },
    bst_insertion: { arrayStr: "15, 10, 20, 8, 12, 18, 25" },
    bst_inorder: { arrayStr: "15, 10, 20, 8, 12, 18, 25" },
    dijkstra: { startNode: "A" },
    graph_bfs: { startNode: "A" },
    lcs_dp: { text1: "STONE", text2: "LONGEST" },
    knapsack_dp: { wtStr: "1, 2, 3", valStr: "60, 100, 120", capacity: 5 },
    n_queens: { n: 4 },
    single_number: { arrayStr: "4, 1, 2, 1, 2" },
    count_set_bits: { n: 13 }
  });

  const algoDef = ALGORITHMS[selectedAlgoKey] || ALGORITHMS.binary_search;

  const steps = useMemo(() => {
    if (activeWorkspaceMode === 'ai_sandbox') {
      return aiTraceData?.steps || [];
    }
    
    try {
      const inputs = customInputs[selectedAlgoKey];
      if (!inputs) return [];

      switch (selectedAlgoKey) {
        case 'fibonacci': return generateFibonacciTrace(parseInt(inputs.n) || 6);
        case 'sliding_window': {
          const arr = inputs.arrayStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
          const k = parseInt(inputs.k);
          return generateSlidingWindowTrace(arr, isNaN(k) ? 3 : k);
        }
        case 'two_sum': {
          const arr = inputs.arrayStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x)).sort((a, b) => a - b);
          const target = parseInt(inputs.target);
          return generateTwoSumTrace(arr, isNaN(target) ? 0 : target);
        }
        case 'reverse_linked_list': {
          const arr = inputs.arrayStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
          return generateReverseListTrace(arr.length ? arr : [1, 2, 3, 4]);
        }
        case 'stack_ops': return generateStackTrace(inputs.opsStr);
        case 'queue_ops': return generateQueueTrace(inputs.opsStr);
        case 'binary_search': {
          const arr = inputs.arrayStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x)).sort((a, b) => a - b);
          const target = parseInt(inputs.target);
          return generateBinarySearchTrace(arr, isNaN(target) ? 0 : target);
        }
        case 'linear_search': {
          const arr = inputs.arrayStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
          const target = parseInt(inputs.target);
          return generateLinearSearchTrace(arr, isNaN(target) ? 0 : target);
        }
        case 'bubble_sort': {
          const arr = inputs.arrayStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
          return generateBubbleSortTrace(arr.length ? arr : [5, 4, 3, 2, 1]);
        }
        case 'quick_sort': {
          const arr = inputs.arrayStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
          return generateQuickSortTrace(arr.length ? arr : [5, 4, 3, 2, 1]);
        }
        case 'bst_insertion': {
          const arr = inputs.arrayStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
          return generateBSTTrace(arr);
        }
        case 'bst_inorder': {
          const arr = inputs.arrayStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
          return generateInorderTrace(arr);
        }
        case 'dijkstra': return generateDijkstraTrace(inputs.startNode);
        case 'graph_bfs': return generateBFSTrace(inputs.startNode);
        case 'lcs_dp': return generateLcsTrace(inputs.text1 || "ABC", inputs.text2 || "AC");
        case 'knapsack_dp': return generateKnapsackTrace(inputs.wtStr, inputs.valStr, parseInt(inputs.capacity) || 5);
        case 'n_queens': return generateNQueensTrace(parseInt(inputs.n) || 4);
        case 'single_number': {
          const arr = inputs.arrayStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
          return generateSingleNumberTrace(arr);
        }
        case 'count_set_bits': return generateCountBitsTrace(parseInt(inputs.n) || 13);
        default: return [];
      }
    } catch (e) {
      console.error(e);
      return [{ step: 'error', explanation: `Error generating trace: ${e.message}`, variables: {} }];
    }
  }, [activeWorkspaceMode, aiTraceData, selectedAlgoKey, customInputs]);

  // Reset steps counter on algorithm change
  useEffect(() => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [selectedAlgoKey, activeWorkspaceMode]);

  // Playback timer interval
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIdx(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [isPlaying, steps, speed]);

  const activeStep = steps[currentStepIdx] || { step: 'init', explanation: '', variables: {} };

  // Generate source code lines array based on workspace mode
  const codeLines = useMemo(() => {
    if (activeWorkspaceMode === 'ai_sandbox') {
      return aiTraceData?.code_lines || ["// No AI code trace generated yet.", "// Type a LeetCode problem on the left and click 'Generate'."];
    }
    return algoDef.code[selectedLanguage] || [];
  }, [activeWorkspaceMode, aiTraceData, algoDef, selectedLanguage]);

  // Determine highlighted line index
  const highlightedLines = useMemo(() => {
    if (activeWorkspaceMode === 'ai_sandbox') {
      return activeStep.lineIndex !== undefined ? [activeStep.lineIndex] : [];
    }
    if (!algoDef || !algoDef.stepMapping || !activeStep.step) return [];
    const mapping = algoDef.stepMapping[activeStep.step];
    return mapping ? (mapping[selectedLanguage] || []) : [];
  }, [activeWorkspaceMode, algoDef, activeStep, selectedLanguage]);

  // Trigger API call to generate trace using FastAPI backend
  const handleGenerateAITrace = async (e) => {
    if (e) e.preventDefault();
    setAiLoading(true);
    setIsPlaying(false);
    setCurrentStepIdx(0);
    try {
      const data = await dsaPlannerAPI.generateTrace(aiProblemQuery, aiLanguage, aiCustomInput);
      setAiTraceData(data);
      setActiveWorkspaceMode('ai_sandbox');
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to generate trace from AI");
    } finally {
      setAiLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCustomInputs(prev => ({
      ...prev,
      [selectedAlgoKey]: {
        ...prev[selectedAlgoKey],
        [field]: value
      }
    }));
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  const toggleCategory = (catName) => {
    setExpandedCategories(prev => ({ ...prev, [catName]: !prev[catName] }));
  };

  // Dijkstra coordinates & edges
  const dijkstraNodeCoords = {
    A: { x: 55, y: 150 }, B: { x: 180, y: 70 }, C: { x: 180, y: 230 },
    D: { x: 310, y: 70 }, E: { x: 310, y: 230 }, F: { x: 430, y: 150 }
  };
  const dijkstraEdges = [
    { u: 'A', v: 'B', w: 4 }, { u: 'A', v: 'C', w: 2 }, { u: 'B', v: 'C', w: 1 },
    { u: 'B', v: 'D', w: 5 }, { u: 'C', v: 'D', w: 8 }, { u: 'C', v: 'E', w: 10 },
    { u: 'D', v: 'E', w: 2 }, { u: 'D', v: 'F', w: 6 }, { u: 'E', v: 'F', w: 3 }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
      
      {/* SIDEBAR NAVIGATION: CURATED CURRICULUM VS AI SANDBOX (3 cols) */}
      <div className="xl:col-span-3 space-y-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md max-h-[820px] overflow-y-auto">
        
        {/* Toggle Workspace Modes */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850">
          <button
            onClick={() => setActiveWorkspaceMode('curated')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeWorkspaceMode === 'curated'
                ? 'bg-blue-600 text-white'
                : 'text-slate-500 hover:text-slate-305'
            }`}
          >
            <Menu className="w-3.5 h-3.5" /> Curated
          </button>
          <button
            onClick={() => {
              setActiveWorkspaceMode('ai_sandbox');
              if (aiTraceData) setSelectedLanguage(aiLanguage);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeWorkspaceMode === 'ai_sandbox'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-305'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> AI Playground
          </button>
        </div>

        {activeWorkspaceMode === 'curated' ? (
          /* CURATED MODULES LIST */
          <div className="space-y-3">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              const isExpanded = expandedCategories[cat.name];
              const catAlgos = Object.entries(ALGORITHMS).filter(([_, def]) => def.category === cat.name);

              return (
                <div key={cat.name} className="border border-slate-800/40 rounded-xl overflow-hidden bg-slate-950/30">
                  <button
                    onClick={() => toggleCategory(cat.name)}
                    className="w-full flex items-center justify-between p-3.5 hover:bg-slate-850/60 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-4 h-4 ${cat.color}`} />
                      <span className="text-xs font-semibold text-slate-300">{cat.name}</span>
                    </div>
                    <span className="text-[10px] bg-slate-900 border border-slate-800/60 px-2 py-0.5 rounded-full text-slate-500 font-bold">
                      {catAlgos.length}
                    </span>
                  </button>
                  
                  {isExpanded && (
                    <div className="border-t border-slate-900/60 bg-slate-950/45 p-1.5 space-y-1.5">
                      {catAlgos.map(([key, def]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedAlgoKey(key)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                            selectedAlgoKey === key
                              ? 'bg-blue-600/15 border border-blue-500/20 text-blue-400 font-bold'
                              : 'text-slate-500 hover:bg-slate-850 hover:text-slate-350'
                          }`}
                        >
                          <span>{def.name}</span>
                          {selectedAlgoKey === key && <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* AI SANDBOX TUTOR CONFIG PANEL */
          <form onSubmit={handleGenerateAITrace} className="space-y-4 p-1">
            <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-3 text-xs leading-relaxed text-blue-300 flex gap-2">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>Type <strong>any</strong> LeetCode problem. The AI Tutor will solve it and create a line-by-line tracing canvas!</span>
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">LeetCode Title / Desc</label>
              <input
                type="text"
                value={aiProblemQuery}
                onChange={(e) => setAiProblemQuery(e.target.value)}
                className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Language</label>
              <select
                value={aiLanguage}
                onChange={(e) => setAiLanguage(e.target.value)}
                className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Test Case Input</label>
              <input
                type="text"
                value={aiCustomInput}
                onChange={(e) => setAiCustomInput(e.target.value)}
                placeholder="e.g. ()[]{}"
                className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={aiLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed py-2.5 rounded-xl font-bold text-xs text-white shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
            >
              {aiLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Analyzing Code...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate AI Trace
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* DETAILED WORKSPACE (9 cols) */}
      <div className="xl:col-span-9 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* WORKSPACE MIDDLE: CANVAS & LOGS (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <div className="bg-slate-950/80 border border-slate-850 rounded-3xl p-6 min-h-[440px] flex items-center justify-center relative overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.06),transparent_60%)] pointer-events-none"></div>

            <div className="w-full h-full flex flex-col items-center justify-center z-10 select-none">
              
              {/* Category Details Badge */}
              <div className="absolute top-5 left-5 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 bg-slate-900/60 border border-slate-800/80 px-3 py-1 rounded-full">
                {activeWorkspaceMode === 'ai_sandbox' ? (
                  <>
                    <Cpu className="w-3 h-3 text-blue-400" /> AI Sandbox <span className="text-slate-650">/</span> <span className="text-blue-400">{aiTraceData?.problem_title || 'Tutor Playground'}</span>
                  </>
                ) : (
                  <>
                    {algoDef.category} <span className="text-slate-650">/</span> <span className="text-blue-400">{algoDef.name}</span>
                  </>
                )}
              </div>

              {aiLoading && (
                /* LOADING OVERLAY */
                <div className="text-center space-y-4 animate-pulse">
                  <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                  <div className="text-sm text-blue-400 font-bold">AI Tutor is solving the problem and preparing trace frames...</div>
                </div>
              )}

              {/* RENDER AI PLAYGROUND GENERAL VARIABLE INSPECTOR */}
              {!aiLoading && activeWorkspaceMode === 'ai_sandbox' && (() => {
                if (!aiTraceData) {
                  return (
                    <div className="text-center space-y-4">
                      <Cpu className="w-12 h-12 text-slate-700 mx-auto animate-bounce" />
                      <div className="text-sm text-slate-500 italic max-w-xs mx-auto">Enter a LeetCode problem description in the left panel to load the AI visualizer.</div>
                    </div>
                  );
                }

                const variables = activeStep.variables || {};
                
                return (
                  <div className="space-y-6 w-full text-center p-4">
                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Memory Heap State (Step {currentStepIdx + 1})</div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto items-stretch">
                      {Object.entries(variables).map(([name, val]) => {
                        const valStr = val === null ? 'null' : typeof val === 'object' ? JSON.stringify(val) : String(val);
                        const isCollection = Array.isArray(val);

                        return (
                          <div key={name} className="bg-slate-900/50 border border-slate-850 p-3 rounded-2xl flex flex-col justify-between items-start gap-1 font-mono shadow-md hover:border-slate-800 transition-all text-left">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">{name}</span>
                            
                            {isCollection ? (
                              <div className="flex flex-wrap gap-1 mt-1 w-full">
                                {val.map((item, idx) => (
                                  <span key={idx} className="bg-blue-600/10 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-bold text-blue-400 shadow-sm">
                                    {String(item)}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-sm font-extrabold text-purple-300 mt-1 break-all">{valStr}</span>
                            )}
                          </div>
                        );
                      })}
                      {Object.keys(variables).length === 0 && (
                        <div className="col-span-2 text-slate-655 text-xs italic py-6">No active local variables at this execution line.</div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* RENDER CURATED HIGHLAND LAYER CANVAS */}
              {!aiLoading && activeWorkspaceMode === 'curated' && (() => {
                switch (selectedAlgoKey) {
                  case 'fibonacci': {
                    const { n } = customInputs.fibonacci;
                    const fibState = activeStep.fibState || [0, 1];
                    const activeIdx = activeStep.activeIdx;
                    const sumIdxs = activeStep.sumIdxs || [];

                    return (
                      <div className="space-y-12 w-full text-center">
                        <div className="text-slate-500 text-xs uppercase tracking-wider font-semibold">
                          Fibonacci Sequence (N = {n})
                        </div>
                        <div className="flex flex-wrap justify-center gap-2.5 items-center">
                          {Array.from({ length: parseInt(n) + 1 }).map((_, idx) => {
                            const valExists = idx < fibState.length;
                            const isComputed = idx === activeIdx;
                            const isSumPart = sumIdxs.includes(idx);
                            
                            return (
                              <div key={idx} className="flex flex-col items-center gap-1.5 relative">
                                {isSumPart && (
                                  <div className="absolute -top-7 text-[10px] font-extrabold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 animate-pulse">+</div>
                                )}
                                <div className={`w-11 h-11 flex items-center justify-center rounded-xl border text-sm font-bold transition-all duration-300 ${
                                  isComputed ? 'bg-blue-600 border-blue-400 text-white scale-110 shadow-lg shadow-blue-500/30' :
                                  isSumPart ? 'bg-indigo-950/65 border-indigo-500/60 text-indigo-200' :
                                  valExists ? 'bg-slate-850 border-slate-800 text-slate-350' :
                                  'bg-slate-900/15 border-slate-850 text-slate-700 opacity-20'
                                }`}>
                                  {valExists ? fibState[idx] : '?'}
                                </div>
                                <span className="text-[10px] text-slate-650">F({idx})</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  case 'sliding_window': {
                    const arr = customInputs.sliding_window.arrayStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
                    const windowRange = activeStep.windowRange;
                    const { max_sum, window_sum } = activeStep.variables;

                    return (
                      <div className="space-y-10 w-full text-center">
                        <div className="flex justify-center gap-8 text-xs">
                          <div className="bg-slate-900/60 px-4 py-2 border border-slate-800 rounded-xl">
                            <span className="text-slate-500 block">Window Sum</span>
                            <strong className="text-blue-400 text-sm">{window_sum}</strong>
                          </div>
                          <div className="bg-slate-900/60 px-4 py-2 border border-slate-800 rounded-xl">
                            <span className="text-slate-500 block">Max Sum</span>
                            <strong className="text-emerald-400 text-sm">{max_sum}</strong>
                          </div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2 items-center">
                          {arr.map((val, idx) => {
                            const inWindow = windowRange && idx >= windowRange[0] && idx <= windowRange[1];

                            return (
                              <div key={idx} className="flex flex-col items-center gap-1.5">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-xl border text-sm font-bold transition-all duration-300 ${
                                  inWindow ? 'bg-blue-600/20 border-blue-500 text-white scale-105 shadow-[0_0_12px_rgba(59,130,246,0.35)]' :
                                  'bg-slate-850 border-slate-800 text-slate-400 opacity-60'
                                }`}>
                                  {val}
                                </div>
                                <span className="text-[9px] text-slate-500">{idx}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  case 'two_sum': {
                    const arr = customInputs.two_sum.arrayStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x)).sort((a,b) => a-b);
                    const { left, right } = activeStep.variables;
                    const foundIndices = activeStep.foundIndices;

                    return (
                      <div className="space-y-12 w-full text-center">
                        <div className="text-slate-500 text-xs">
                          Target Sum: <span className="text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-sm ml-1">{customInputs.two_sum.target}</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 items-end">
                          {arr.map((val, idx) => {
                            const isLeft = idx === left;
                            const isRight = idx === right;
                            const isFound = foundIndices && foundIndices.includes(idx);
                            
                            return (
                              <div key={idx} className="flex flex-col items-center gap-2 relative">
                                <div className="absolute -top-7 text-[9px] font-bold uppercase">
                                  {isLeft && <span className="text-purple-400 bg-purple-500/10 px-1 rounded border border-purple-500/20">Left</span>}
                                  {isRight && <span className="text-rose-400 bg-rose-500/10 px-1 rounded border border-rose-500/20">Right</span>}
                                </div>
                                <div className={`w-10 h-11 flex items-center justify-center rounded-xl border text-sm font-bold transition-all duration-300 ${
                                  isFound ? 'bg-emerald-600 border-emerald-500 text-white scale-110 shadow-md shadow-emerald-500/30' :
                                  isLeft ? 'bg-purple-950/70 border-purple-500 text-purple-200' :
                                  isRight ? 'bg-rose-950/70 border-rose-500 text-rose-200' :
                                  'bg-slate-850 border-slate-800 text-slate-400 opacity-60'
                                }`}>
                                  {val}
                                </div>
                                <span className="text-[10px] text-slate-550">{idx}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  case 'reverse_linked_list': {
                    const nodesList = activeStep.nodes || [];
                    const pointers = activeStep.pointers || {};

                    return (
                      <div className="w-full flex flex-col items-center gap-10">
                        <div className="flex flex-wrap justify-center items-center gap-10">
                          {nodesList.map((node) => {
                            const isPrev = node.id === pointers.prev;
                            const isCurr = node.id === pointers.curr;
                            const isNext = node.id === pointers.next;

                            return (
                              <div key={node.id} className="flex items-center relative">
                                <div className="absolute -top-11 left-1/2 -translate-x-1/2 flex flex-col gap-1 text-[9px] font-bold uppercase">
                                  {isPrev && <span className="text-purple-400 bg-purple-500/10 px-1 rounded border border-purple-500/20">Prev</span>}
                                  {isCurr && <span className="text-blue-400 bg-blue-500/10 px-1 rounded border border-blue-500/20">Curr</span>}
                                  {isNext && <span className="text-amber-400 bg-amber-500/10 px-1 rounded border border-amber-500/20">Next</span>}
                                </div>
                                <div className={`w-12 h-12 rounded-full border flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-md ${
                                  isCurr ? 'bg-blue-600 border-blue-400 text-white scale-110 shadow-blue-500/30 animate-pulse' :
                                  isPrev ? 'bg-purple-950/70 border-purple-500 text-purple-200' :
                                  'bg-slate-850 border-slate-700 text-slate-350'
                                }`}>
                                  {node.value}
                                </div>
                                {node.nextId !== null && (
                                  <div className="absolute -right-8 w-6 h-0.5 bg-slate-700 flex items-center justify-end">
                                    <div className="w-1.5 h-1.5 border-t-2 border-r-2 border-slate-700 rotate-45 -translate-y-[0.5px]"></div>
                                  </div>
                                )}
                                {node.nextId === null && node.id !== nodesList.length - 1 && (
                                  <div className="absolute -left-8 w-6 h-0.5 bg-purple-500 flex items-center justify-start">
                                    <div className="w-1.5 h-1.5 border-t-2 border-l-2 border-purple-500 -rotate-45 -translate-y-[0.5px]"></div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  case 'stack_ops': {
                    const stackState = activeStep.stackState || [];
                    const actionItem = activeStep.actionItem;

                    return (
                      <div className="space-y-6 w-full max-w-[280px] text-center">
                        <div className="border-4 border-slate-850 border-t-0 bg-slate-900/40 p-4 min-h-[180px] flex flex-col-reverse justify-start gap-2.5 rounded-b-2xl shadow-inner relative overflow-hidden">
                          <div className="absolute top-2 left-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Stack (Top)</div>
                          {stackState.length === 0 ? (
                            <div className="text-slate-655 text-xs italic py-10">Empty Stack</div>
                          ) : (
                            stackState.map((val, idx) => {
                              const isTop = idx === stackState.length - 1;
                              const isNew = isTop && actionItem?.type === 'push';

                              return (
                                <div key={idx} className={`w-full py-2.5 rounded-xl border text-sm font-extrabold transition-all duration-300 shadow-md ${
                                  isNew ? 'bg-emerald-600 border-emerald-500 text-white scale-102 shadow-emerald-500/25 animate-bounce' :
                                  isTop ? 'bg-blue-600/35 border-blue-500 text-blue-200' :
                                  'bg-slate-850 border-slate-800 text-slate-400'
                                }`}>
                                  {val}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  }
                  case 'queue_ops': {
                    const queueState = activeStep.queueState || [];
                    const actionItem = activeStep.actionItem;

                    return (
                      <div className="space-y-6 w-full text-center">
                        <div className="flex border-4 border-slate-850 border-l-0 border-r-0 bg-slate-900/40 p-4 min-h-[75px] items-center justify-start gap-3 rounded-xl shadow-inner relative overflow-x-auto">
                          <div className="absolute top-1.5 left-2.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Front</div>
                          <div className="absolute top-1.5 right-2.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Rear</div>
                          {queueState.length === 0 ? (
                            <div className="w-full text-slate-655 text-xs italic text-center">Empty Queue</div>
                          ) : (
                            queueState.map((val, idx) => {
                              const isFront = idx === 0;
                              const isRear = idx === queueState.length - 1;
                              const isNew = isRear && actionItem?.type === 'enqueue';

                              return (
                                <div key={idx} className={`w-12 h-12 flex items-center justify-center rounded-xl border text-xs font-bold shrink-0 transition-all duration-300 shadow-md ${
                                  isNew ? 'bg-emerald-600 border-emerald-500 text-white scale-105 animate-pulse' :
                                  isFront ? 'bg-blue-600/35 border-blue-500 text-blue-200' :
                                  'bg-slate-850 border-slate-800 text-slate-400'
                                }`}>
                                  {val}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  }
                  case 'binary_search': {
                    const arr = customInputs.binary_search.arrayStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x)).sort((a,b) => a-b);
                    const { low, high, mid, status } = activeStep.variables;
                    const foundIdx = activeStep.foundIndex;
                    
                    return (
                      <div className="space-y-12 w-full text-center">
                        <div className="text-slate-400 text-xs font-semibold">
                          Target: <span className="text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full text-sm ml-1">{customInputs.binary_search.target}</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 items-end">
                          {arr.map((val, idx) => {
                            const isMid = idx === mid;
                            const isFound = idx === foundIdx;
                            const inRange = idx >= low && idx <= high;
                            const isDimmed = !inRange && status !== 'initializing' && status !== 'not found' && foundIdx === null;

                            return (
                              <div key={idx} className="flex flex-col items-center gap-2 relative">
                                <div className="absolute -top-7 text-[10px] font-bold tracking-wider uppercase">
                                  {idx === low && <span className="text-purple-400 bg-purple-500/10 px-1 rounded border border-purple-500/20">Low</span>}
                                  {idx === high && <span className="text-rose-400 bg-rose-500/10 px-1 rounded border border-rose-500/20 ml-1">High</span>}
                                </div>
                                <div className={`w-10 h-12 flex items-center justify-center rounded-xl border text-sm font-bold transition-all duration-300 shadow-md ${
                                  isFound ? 'bg-emerald-600 border-emerald-500 text-white scale-110 shadow-emerald-500/30' :
                                  isMid ? 'bg-blue-600 border-blue-400 text-white scale-115 shadow-blue-500/40 animate-pulse' :
                                  isDimmed ? 'bg-slate-900/30 border-slate-805 text-slate-650 opacity-30' :
                                  inRange ? 'bg-slate-850 border-slate-700 text-slate-200' :
                                  'bg-slate-800 border-slate-705 text-slate-350'
                                }`}>
                                  {val}
                                </div>
                                <span className="text-[10px] text-slate-550">{idx}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  case 'linear_search': {
                    const arr = customInputs.linear_search.arrayStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
                    const activeIdx = activeStep.activeIdx;
                    const foundIdx = activeStep.foundIdx;

                    return (
                      <div className="space-y-12 w-full text-center">
                        <div className="text-slate-400 text-xs">
                          Target: <span className="text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full text-sm ml-1">{customInputs.linear_search.target}</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 items-center">
                          {arr.map((val, idx) => {
                            const isActive = idx === activeIdx;
                            const isFound = idx === foundIdx;
                            const isScanned = activeIdx !== null && idx < activeIdx && !isFound;

                            return (
                              <div key={idx} className="flex flex-col items-center gap-1.5">
                                <div className={`w-10 h-11 flex items-center justify-center rounded-xl border text-sm font-bold transition-all duration-300 shadow-md ${
                                  isFound ? 'bg-emerald-600 border-emerald-500 text-white scale-110 shadow-emerald-500/30' :
                                  isActive ? 'bg-blue-600 border-blue-400 text-white scale-108 animate-pulse shadow-blue-500/25' :
                                  isScanned ? 'bg-slate-900/35 border-slate-850 text-slate-650 opacity-40' :
                                  'bg-slate-850 border-slate-800 text-slate-350'
                                }`}>
                                  {val}
                                </div>
                                <span className="text-[10px] text-slate-650">{idx}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  case 'bubble_sort': {
                    const arrayState = activeStep.arrayState || [];
                    const activeIndices = activeStep.activeIndices || [];
                    const sortedIndices = activeStep.sortedIndices || [];
                    const { swapped } = activeStep.variables;
                    const maxVal = Math.max(...arrayState, 1);

                    return (
                      <div className="w-full flex flex-col items-center justify-end h-[240px] gap-8">
                        <div className="w-full flex items-end justify-center gap-2.5 h-[160px]">
                          {arrayState.map((val, idx) => {
                            const isActive = activeIndices.includes(idx);
                            const isSorted = sortedIndices.includes(idx);
                            const barHeight = `${(val / maxVal) * 100}%`;

                            return (
                              <div key={idx} className="flex flex-col items-center flex-1 max-w-[40px] h-full justify-end">
                                <span className="text-slate-400 text-[10px] font-bold mb-1">{val}</span>
                                <div 
                                  className={`w-full rounded-t-lg transition-all duration-300 border shadow-lg ${
                                    isActive ? (swapped ? 'bg-amber-500 border-amber-400 shadow-amber-500/20' : 'bg-blue-500 border-blue-400 shadow-blue-500/20') :
                                    isSorted ? 'bg-emerald-600 border-emerald-500 shadow-emerald-500/10' :
                                    'bg-slate-800 border-slate-700/80'
                                  }`}
                                  style={{ height: barHeight }}
                                ></div>
                                <span className="text-slate-600 text-[10px] mt-1.5">{idx}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  case 'quick_sort': {
                    const arrayState = activeStep.arrayState || [];
                    const pivotIdx = activeStep.pivotIdx;
                    const iIdx = activeStep.iIdx;
                    const jIdx = activeStep.jIdx;
                    const { swapped } = activeStep.variables;
                    const maxVal = Math.max(...arrayState, 1);

                    return (
                      <div className="w-full flex flex-col items-center justify-end h-[240px] gap-8">
                        <div className="w-full flex items-end justify-center gap-3 h-[170px]">
                          {arrayState.map((val, idx) => {
                            const isPivot = idx === pivotIdx;
                            const isI = idx === iIdx;
                            const isJ = idx === jIdx;
                            const barHeight = `${(val / maxVal) * 100}%`;

                            return (
                              <div key={idx} className="flex flex-col items-center flex-1 max-w-[40px] h-full justify-end relative">
                                <div className="absolute -top-7 text-[8px] font-bold uppercase tracking-wider flex gap-0.5">
                                  {isI && <span className="text-purple-400">i</span>}
                                  {isJ && <span className="text-blue-400">j</span>}
                                </div>
                                <span className="text-slate-400 text-[10px] font-bold mb-1">{val}</span>
                                <div 
                                  className={`w-full rounded-t-lg transition-all duration-300 border shadow-md ${
                                    isPivot ? 'bg-purple-600 border-purple-500 shadow-purple-500/25' :
                                    isI ? 'bg-purple-950/70 border-purple-500' :
                                    isJ ? (swapped ? 'bg-amber-500 border-amber-400 shadow-amber-500/20' : 'bg-blue-500 border-blue-400 shadow-blue-500/20') :
                                    'bg-slate-800 border-slate-700/80'
                                  }`}
                                  style={{ height: barHeight }}
                                ></div>
                                <span className="text-slate-650 text-[10px] mt-1.5">{idx}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  case 'bst_insertion': {
                    const treeCoordinates = getBSTLayout(activeStep.tree);
                    const activeNodeId = activeStep.activeNodeId;
                    const newNodeId = activeStep.newNodeId;

                    return (
                      <div className="w-full h-[280px] overflow-hidden flex items-center justify-center relative">
                        {treeCoordinates.length === 0 ? (
                          <div className="text-slate-500 text-sm italic">BST is empty. Start insertion to view nodes.</div>
                        ) : (
                          <svg className="w-full h-full max-w-[480px] max-h-[260px]">
                            {treeCoordinates.map((node) => {
                              if (node.parentX === null) return null;
                              return (
                                <line
                                  key={`line-${node.id}`}
                                  x1={node.parentX}
                                  y1={node.parentY}
                                  x2={node.x}
                                  y2={node.y}
                                  stroke="#334155"
                                  strokeWidth="2.5"
                                  className="transition-all duration-300"
                                />
                              );
                            })}
                            {treeCoordinates.map((node) => {
                              const isActive = node.id === activeNodeId;
                              const isNew = node.id === newNodeId;

                              return (
                                <g key={`node-${node.id}`} className="transition-all duration-300">
                                  <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="15"
                                    fill={isNew ? '#10b981' : isActive ? '#3b82f6' : '#1e293b'}
                                    stroke={isNew ? '#34d399' : isActive ? '#60a5fa' : '#475569'}
                                    strokeWidth="2"
                                    className={`transition-all duration-300 ${isActive ? 'animate-pulse' : ''}`}
                                  />
                                  <text x={node.x} y={node.y + 4} fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                                    {node.val}
                                  </text>
                                </g>
                              );
                            })}
                          </svg>
                        )}
                      </div>
                    );
                  }
                  case 'bst_inorder': {
                    const treeCoordinates = getBSTLayout(activeStep.tree);
                    const activeNodeId = activeStep.activeNodeId;
                    const visitedNodeIds = activeStep.visitedNodeIds || [];
                    const visitedList = activeStep.variables.visited || [];

                    return (
                      <div className="w-full flex flex-col items-center gap-6">
                        <div className="w-full h-[240px] overflow-hidden flex items-center justify-center">
                          <svg className="w-full h-full max-w-[480px] max-h-[220px]">
                            {treeCoordinates.map((node) => {
                              if (node.parentX === null) return null;
                              const isPathVisited = visitedNodeIds.includes(node.id) && visitedNodeIds.includes(treeCoordinates.find(n => n.x === node.parentX && n.y === node.parentY)?.id);
                              return (
                                <line
                                  key={`line-${node.id}`}
                                  x1={node.parentX} y1={node.parentY} x2={node.x} y2={node.y}
                                  stroke={isPathVisited ? '#10b981' : '#334155'}
                                  strokeWidth="2.5"
                                  className="transition-all duration-350"
                                />
                              );
                            })}
                            {treeCoordinates.map((node) => {
                              const isActive = node.id === activeNodeId;
                              const isVisited = visitedNodeIds.includes(node.id);

                              return (
                                <g key={`node-${node.id}`} className="transition-all duration-350">
                                  <circle
                                    cx={node.x} cy={node.y} r="13"
                                    fill={isActive ? '#3b82f6' : isVisited ? '#10b981' : '#1e293b'}
                                    stroke={isActive ? '#60a5fa' : isVisited ? '#34d399' : '#475569'}
                                    strokeWidth="2"
                                    className={`transition-all duration-300 ${isActive ? 'animate-pulse' : ''}`}
                                  />
                                  <text x={node.x} y={node.y + 3.5} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                                    {node.val}
                                  </text>
                                </g>
                              );
                            })}
                          </svg>
                        </div>
                        <div className="w-full text-center space-y-1 bg-slate-900/50 p-3.5 border border-slate-800/80 rounded-2xl max-w-sm">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inorder Output</span>
                          <div className="font-mono text-sm text-emerald-400 font-bold">[{visitedList.join(', ')}]</div>
                        </div>
                      </div>
                    );
                  }
                  case 'dijkstra': {
                    const activeNode = activeStep.activeNode;
                    const visitingNode = activeStep.visitingNode;
                    const distances = activeStep.distances || {};
                    const relaxedEdges = activeStep.relaxedEdges || [];

                    return (
                      <div className="w-full h-[280px] flex items-center justify-center">
                        <svg className="w-full h-full max-w-[460px] max-h-[260px]">
                          {dijkstraEdges.map((edge, idx) => {
                            const uCoords = dijkstraNodeCoords[edge.u];
                            const vCoords = dijkstraNodeCoords[edge.v];
                            const isRelaxed = relaxedEdges.some(e => (e[0] === edge.u && e[1] === edge.v) || (e[0] === edge.v && e[1] === edge.u));

                            return (
                              <g key={`edge-${idx}`}>
                                <line
                                  x1={uCoords.x} y1={uCoords.y} x2={vCoords.x} y2={vCoords.y}
                                  stroke={isRelaxed ? '#10b981' : '#334155'}
                                  strokeWidth={isRelaxed ? '3.5' : '2'}
                                  strokeDasharray={isRelaxed ? '4 2' : 'none'}
                                  className="transition-all duration-300"
                                />
                                <rect x={(uCoords.x + vCoords.x) / 2 - 8} y={(uCoords.y + vCoords.y) / 2 - 8} width="16" height="16" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                                <text x={(uCoords.x + vCoords.x) / 2} y={(uCoords.y + vCoords.y) / 2 + 4} fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">{edge.w}</text>
                              </g>
                            );
                          })}
                          {Object.keys(dijkstraNodeCoords).map((nodeName) => {
                            const coords = dijkstraNodeCoords[nodeName];
                            const isActive = nodeName === activeNode;
                            const isVisiting = nodeName === visitingNode;
                            const distVal = distances[nodeName];
                            const distStr = distVal === Infinity ? '∞' : distVal;

                            return (
                              <g key={`node-${nodeName}`} className="transition-all duration-300">
                                <circle cx={coords.x} cy={coords.y} r="16" fill={isActive ? 'rgba(59,130,246,0.2)' : isVisiting ? 'rgba(16,185,129,0.2)' : 'transparent'} className={`transition-all duration-300 ${isActive || isVisiting ? 'animate-ping' : ''}`} />
                                <circle cx={coords.x} cy={coords.y} r="14" fill={isActive ? '#3b82f6' : isVisiting ? '#10b981' : '#1e293b'} stroke={isActive ? '#60a5fa' : isVisiting ? '#34d399' : '#475569'} strokeWidth="2" className="transition-all duration-300" />
                                <text x={coords.x} y={coords.y + 3.5} fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">{nodeName}</text>
                                <rect x={coords.x - 14} y={coords.y - 32} width="28" height="12" rx="3" fill="#090d16" stroke={isActive ? '#3b82f6' : '#1e293b'} strokeWidth="1" />
                                <text x={coords.x} y={coords.y - 23} fill={distVal === 0 ? '#10b981' : distVal === Infinity ? '#64748b' : '#38bdf8'} fontSize="8" fontWeight="bold" textAnchor="middle">{distStr}</text>
                              </g>
                            );
                          })}
                        </svg>
                      </div>
                    );
                  }
                  case 'graph_bfs': {
                    const activeNode = activeStep.activeNode;
                    const visitingNode = activeStep.visitingNode;
                    const visitedNodes = activeStep.visitedNodes || [];
                    const queueState = activeStep.queueState || [];

                    return (
                      <div className="w-full flex flex-col items-center gap-6">
                        <div className="w-full h-[240px] flex items-center justify-center">
                          <svg className="w-full h-full max-w-[460px] max-h-[220px]">
                            {dijkstraEdges.map((edge, idx) => {
                              const uCoords = dijkstraNodeCoords[edge.u];
                              const vCoords = dijkstraNodeCoords[edge.v];
                              const bothVisited = visitedNodes.includes(edge.u) && visitedNodes.includes(edge.v);
                              return (
                                <line key={`edge-${idx}`} x1={uCoords.x} y1={uCoords.y} x2={vCoords.x} y2={vCoords.y} stroke={bothVisited ? '#10b981' : '#334155'} strokeWidth="2" className="transition-all duration-300" />
                              );
                            })}
                            {Object.keys(dijkstraNodeCoords).map((nodeName) => {
                              const coords = dijkstraNodeCoords[nodeName];
                              const isActive = nodeName === activeNode;
                              const isVisiting = nodeName === visitingNode;
                              const isVisited = visitedNodes.includes(nodeName);

                              return (
                                <g key={`node-${nodeName}`} className="transition-all duration-300">
                                  <circle cx={coords.x} cy={coords.y} r="13" fill={isActive ? '#3b82f6' : isVisiting ? '#10b981' : isVisited ? '#166534' : '#1e293b'} stroke={isActive ? '#60a5fa' : isVisiting ? '#34d399' : isVisited ? '#22c55e' : '#475569'} strokeWidth="2" className="transition-all duration-300" />
                                  <text x={coords.x} y={coords.y + 3.5} fill="#ffffff" fontSize="9.5" fontWeight="bold" textAnchor="middle">{nodeName}</text>
                                </g>
                              );
                            })}
                          </svg>
                        </div>
                        <div className="w-full flex gap-4 max-w-md justify-center text-xs">
                          <div className="flex-1 bg-slate-900/60 p-2.5 border border-slate-800 rounded-xl font-mono text-center">
                            <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-1">Queue (FIFO)</span>
                            <span className="text-blue-400 font-extrabold">{JSON.stringify(queueState)}</span>
                          </div>
                          <div className="flex-1 bg-slate-900/60 p-2.5 border border-slate-800 rounded-xl font-mono text-center">
                            <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-1">Visited Set</span>
                            <span className="text-emerald-400 font-extrabold">{JSON.stringify(visitedNodes)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  case 'lcs_dp': {
                    const text1 = customInputs.lcs_dp.text1 || "STONE";
                    const text2 = customInputs.lcs_dp.text2 || "LONGEST";
                    const dpTable = activeStep.variables.dp || [];
                    const activeCell = activeStep.activeCell;
                    const lookupCells = activeStep.lookupCells || [];

                    return (
                      <div className="w-full flex flex-col items-center justify-center p-2">
                        <div className="overflow-x-auto max-w-full">
                          <table className="border-collapse border border-slate-800 text-center font-mono text-xs">
                            <thead>
                              <tr>
                                <th className="w-8 h-8 border border-slate-800 bg-slate-900"></th>
                                <th className="w-8 h-8 border border-slate-800 bg-slate-900 text-slate-500">Ø</th>
                                {text2.split('').map((char, colIdx) => (
                                  <th key={colIdx} className="w-8 h-8 border border-slate-800 bg-slate-900 text-blue-400 font-bold">{char}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {dpTable.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  <td className="w-8 h-8 border border-slate-800 bg-slate-900 font-bold text-purple-400">{rIdx === 0 ? 'Ø' : text1[rIdx - 1]}</td>
                                  {row.map((val, cIdx) => {
                                    const isActive = activeCell && activeCell[0] === rIdx && activeCell[1] === cIdx;
                                    const isLookup = lookupCells.some(cell => cell[0] === rIdx && cell[1] === cIdx);

                                    return (
                                      <td key={cIdx} className={`w-8 h-8 border border-slate-800 transition-all duration-300 ${
                                        isActive ? 'bg-blue-600 font-bold text-white shadow-inner scale-105' :
                                        isLookup ? 'bg-purple-900/60 font-semibold text-purple-200' :
                                        'bg-slate-900/35 text-slate-400'
                                      }`}>{val}</td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  }
                  case 'knapsack_dp': {
                    const wt = customInputs.knapsack_dp.wtStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
                    const val = customInputs.knapsack_dp.valStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
                    const dpTable = activeStep.variables.dp || [];
                    const activeCell = activeStep.activeCell;
                    const lookupCells = activeStep.lookupCells || [];

                    return (
                      <div className="w-full flex flex-col items-center justify-center p-2">
                        <div className="overflow-x-auto max-w-full">
                          <table className="border-collapse border border-slate-800 text-center font-mono text-xs">
                            <thead>
                              <tr>
                                <th className="px-2 py-1.5 border border-slate-800 bg-slate-900 text-[10px] text-slate-500">Item (wt,val)</th>
                                <th className="w-8 h-8 border border-slate-800 bg-slate-900 text-slate-500">0</th>
                                {Array.from({ length: dpTable[0]?.length - 1 || 0 }).map((_, cIdx) => (
                                  <th key={cIdx} className="w-8 h-8 border border-slate-800 bg-slate-900 text-blue-400 font-bold">{cIdx + 1}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {dpTable.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  <td className="px-2 py-1.5 border border-slate-800 bg-slate-900 font-bold text-purple-400 text-[10px]">{rIdx === 0 ? 'Ø' : `i=${rIdx} (${wt[rIdx-1]}, ${val[rIdx-1]})`}</td>
                                  {row.map((cellVal, cIdx) => {
                                    const isActive = activeCell && activeCell[0] === rIdx && activeCell[1] === cIdx;
                                    const isLookup = lookupCells.some(cell => cell[0] === rIdx && cell[1] === cIdx);

                                    return (
                                      <td key={cIdx} className={`w-8 h-8 border border-slate-800 transition-all duration-300 ${
                                        isActive ? 'bg-blue-600 font-bold text-white shadow-inner scale-105' :
                                        isLookup ? 'bg-purple-900/60 font-semibold text-purple-200' :
                                        'bg-slate-900/35 text-slate-400'
                                      }`}>{cellVal}</td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  }
                  case 'n_queens': {
                    const n = customInputs.n_queens.n;
                    const board = activeStep.board || Array.from({ length: n }, () => Array(n).fill(false));
                    const activeCell = activeStep.activeCell;
                    const conflictCells = activeStep.conflictCells || [];
                    const safeCells = activeStep.safeCells || [];

                    return (
                      <div className="w-full flex flex-col items-center justify-center p-2">
                        <div className="grid gap-1 border-4 border-slate-800 rounded-xl bg-slate-900 p-2 shadow-2xl" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
                          {board.map((row, rIdx) => 
                            row.map((hasQueen, cIdx) => {
                              const isWhite = (rIdx + cIdx) % 2 === 0;
                              const isActive = activeCell && activeCell[0] === rIdx && activeCell[1] === cIdx;
                              const isConflict = conflictCells.some(cell => cell[0] === rIdx && cell[1] === cIdx);
                              const isSafeCell = safeCells.some(cell => cell[0] === rIdx && cell[1] === cIdx);

                              return (
                                <div key={`${rIdx}-${cIdx}`} className={`w-12 h-12 flex items-center justify-center rounded transition-all duration-300 text-xl font-bold shadow-sm relative ${
                                  isSafeCell ? 'bg-emerald-600/80 border-2 border-emerald-400 text-white' :
                                  isConflict ? 'bg-rose-900/60 border-2 border-rose-500 text-rose-200' :
                                  isActive ? 'bg-blue-600 border-2 border-blue-400 text-white animate-pulse' :
                                  isWhite ? 'bg-slate-750 border border-slate-800' : 'bg-slate-800 border border-slate-850'
                                }`}>
                                  {hasQueen && <span className="z-10 text-amber-400 drop-shadow-md animate-bounce">👑</span>}
                                  {!hasQueen && isActive && <span className="text-xs text-blue-300 animate-pulse">?</span>}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  }
                  case 'single_number': {
                    const nums = customInputs.single_number.arrayStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
                    const activeIdx = activeStep.activeIdx;
                    const { result, num, result_binary, num_binary } = activeStep.variables;

                    return (
                      <div className="space-y-10 w-full text-center">
                        <div className="flex justify-center gap-2 items-center">
                          {nums.map((val, idx) => {
                            const isActive = idx === activeIdx;
                            const isProcessed = activeIdx !== null && idx < activeIdx;

                            return (
                              <div key={idx} className="flex flex-col items-center gap-1.5">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-xl border text-sm font-bold transition-all duration-300 ${
                                  isActive ? 'bg-blue-600 border-blue-400 text-white scale-110 shadow-blue-500/25' :
                                  isProcessed ? 'bg-slate-900/35 border-slate-850 text-slate-650 opacity-40' :
                                  'bg-slate-850 border-slate-800 text-slate-455'
                                }`}>
                                  {val}
                                </div>
                                <span className="text-[9px] text-slate-655">{idx}</span>
                              </div>
                            );
                          })}
                        </div>
                        {activeIdx !== null && (
                          <div className="bg-slate-900/50 p-4 border border-slate-850 rounded-2xl max-w-sm mx-auto space-y-2 text-xs font-mono">
                            <div className="flex justify-between"><span className="text-slate-500">Result:</span><span className="text-purple-300 font-bold">{result_binary}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">XOR Active ({num}):</span><span className="text-blue-300 font-bold">^ {num_binary}</span></div>
                            <div className="border-t border-slate-850 pt-2 flex justify-between"><span className="text-slate-500">New result:</span><span className="text-emerald-400 font-extrabold">{result.toString(2).padStart(4, '0')}</span></div>
                          </div>
                        )}
                      </div>
                    );
                  }
                  case 'count_set_bits': {
                    const { count, n_binary, bit } = activeStep.variables;

                    return (
                      <div className="space-y-10 w-full text-center">
                        <div className="bg-slate-900/50 p-4 border border-slate-850 rounded-2xl max-w-xs mx-auto space-y-3 font-mono text-xs">
                          <div className="flex justify-between"><span className="text-slate-500">N (decimal):</span><span className="text-blue-400 font-bold">{customInputs.count_set_bits.n}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">N (binary):</span><span className="text-purple-300 font-extrabold">{n_binary}</span></div>
                          <div className="flex justify-between border-t border-slate-850 pt-2"><span className="text-slate-500">Set Bits Count:</span><span className="text-emerald-400 font-extrabold text-sm">{count}</span></div>
                        </div>
                        {activeStep.step === 'check_bit' && (
                          <div className="text-xs text-blue-300 animate-fade-in font-mono">bit = n & 1 = <strong className="text-emerald-400 font-bold">{bit}</strong>.</div>
                        )}
                      </div>
                    );
                  }
                  default: return null;
                }
              })()}

            </div>
          </div>

          {/* LOGS */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col backdrop-blur-md">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-blue-400" /> Explanation Log
            </h3>
            <div className="bg-slate-950/80 border border-slate-855 p-4 rounded-xl min-h-[90px] flex items-center text-sm leading-relaxed text-slate-350 transition-all duration-300">
              {activeStep.explanation ? (
                <div className="flex gap-2.5 items-start">
                  <span className="text-blue-400 mt-1 font-bold">➔</span>
                  <span>{activeStep.explanation}</span>
                </div>
              ) : (
                <span className="text-slate-550 italic">No execution trace started. Click play.</span>
              )}
            </div>
          </div>
        </div>

        {/* WORKSPACE RIGHT: CONTROL PANELS & SOURCE CODE (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          
          {/* PLAYBACK CONTROL BUTTONS */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
            <h3 className="text-sm font-bold text-slate-350 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" /> Trace Controls
            </h3>
            
            <div className="mb-4">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Steps</span>
                <span>{steps.length > 0 ? currentStepIdx + 1 : 0} / {steps.length}</span>
              </div>
              <div className="w-full bg-slate-855 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${steps.length > 0 ? ((currentStepIdx + 1) / steps.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between gap-2 mb-3">
              <button
                onClick={() => setCurrentStepIdx(p => Math.max(0, p - 1))}
                disabled={currentStepIdx === 0 || steps.length === 0}
                className="flex-1 bg-slate-850 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed py-2 rounded-xl flex items-center justify-center border border-slate-800 transition-all text-slate-200"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={steps.length === 0}
                className={`flex-[2] py-2 rounded-xl flex items-center justify-center font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  isPlaying ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-1.5" /> : <Play className="w-4 h-4 mr-1.5" />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>

              <button
                onClick={() => setCurrentStepIdx(p => Math.min(steps.length - 1, p + 1))}
                disabled={currentStepIdx === steps.length - 1 || steps.length === 0}
                className="flex-1 bg-slate-850 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed py-2 rounded-xl flex items-center justify-center border border-slate-800 transition-all text-slate-200"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => {
                setCurrentStepIdx(0);
                setIsPlaying(false);
              }}
              className="w-full bg-slate-850 hover:bg-slate-800 py-2.5 rounded-xl border border-slate-800 flex items-center justify-center text-xs font-semibold transition-all text-slate-355"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Reset Tracing
            </button>
          </div>

          {/* DYNAMIC CUSTOM INPUTS (ONLY SHOWN FOR CURATED MODE) */}
          {activeWorkspaceMode === 'curated' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
              <h3 className="text-xs font-bold text-slate-305 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" /> Custom Inputs
              </h3>
              
              <div className="space-y-4">
                {selectedAlgoKey === 'fibonacci' && (
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Compute N-th Fibonacci (2 to 12)</label>
                    <input 
                      type="number" min="2" max="12"
                      value={customInputs.fibonacci.n}
                      onChange={(e) => handleInputChange('n', parseInt(e.target.value) || 2)}
                      className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                {selectedAlgoKey === 'sliding_window' && (
                  <>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Array (comma separated)</label>
                      <input 
                        type="text" value={customInputs.sliding_window.arrayStr}
                        onChange={(e) => handleInputChange('arrayStr', e.target.value)}
                        className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Window Size K</label>
                      <input 
                        type="number" min="1" max="10"
                        value={customInputs.sliding_window.k}
                        onChange={(e) => handleInputChange('k', e.target.value)}
                        className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </>
                )}

                {selectedAlgoKey === 'two_sum' && (
                  <>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Array (comma separated)</label>
                      <input 
                        type="text" value={customInputs.two_sum.arrayStr}
                        onChange={(e) => handleInputChange('arrayStr', e.target.value)}
                        className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Target sum</label>
                      <input 
                        type="number" value={customInputs.two_sum.target}
                        onChange={(e) => handleInputChange('target', e.target.value)}
                        className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </>
                )}

                {selectedAlgoKey === 'reverse_linked_list' && (
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">List values (comma separated)</label>
                    <input 
                      type="text" value={customInputs.reverse_linked_list.arrayStr}
                      onChange={(e) => handleInputChange('arrayStr', e.target.value)}
                      className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                {selectedAlgoKey === 'stack_ops' && (
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Operations sequence</label>
                    <input 
                      type="text" value={customInputs.stack_ops.opsStr}
                      onChange={(e) => handleInputChange('opsStr', e.target.value)}
                      className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                {selectedAlgoKey === 'queue_ops' && (
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Operations sequence</label>
                    <input 
                      type="text" value={customInputs.queue_ops.opsStr}
                      onChange={(e) => handleInputChange('opsStr', e.target.value)}
                      className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                {selectedAlgoKey === 'binary_search' && (
                  <>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Sorted Array</label>
                      <input 
                        type="text" value={customInputs.binary_search.arrayStr}
                        onChange={(e) => handleInputChange('arrayStr', e.target.value)}
                        className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Target</label>
                      <input 
                        type="number" value={customInputs.binary_search.target}
                        onChange={(e) => handleInputChange('target', e.target.value)}
                        className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </>
                )}

                {selectedAlgoKey === 'linear_search' && (
                  <>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Array (comma separated)</label>
                      <input 
                        type="text" value={customInputs.linear_search.arrayStr}
                        onChange={(e) => handleInputChange('arrayStr', e.target.value)}
                        className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Search Target</label>
                      <input 
                        type="number" value={customInputs.linear_search.target}
                        onChange={(e) => handleInputChange('target', e.target.value)}
                        className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </>
                )}

                {selectedAlgoKey === 'bubble_sort' && (
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Unsorted Array</label>
                    <input 
                      type="text" value={customInputs.bubble_sort.arrayStr}
                      onChange={(e) => handleInputChange('arrayStr', e.target.value)}
                      className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                {selectedAlgoKey === 'quick_sort' && (
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Unsorted Array</label>
                    <input 
                      type="text" value={customInputs.quick_sort.arrayStr}
                      onChange={(e) => handleInputChange('arrayStr', e.target.value)}
                      className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                {selectedAlgoKey === 'bst_insertion' && (
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Insert Sequence</label>
                    <input 
                      type="text" value={customInputs.bst_insertion.arrayStr}
                      onChange={(e) => handleInputChange('arrayStr', e.target.value)}
                      className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                {selectedAlgoKey === 'bst_inorder' && (
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Nodes insert sequence</label>
                    <input 
                      type="text" value={customInputs.bst_inorder.arrayStr}
                      onChange={(e) => handleInputChange('arrayStr', e.target.value)}
                      className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                {selectedAlgoKey === 'dijkstra' && (
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Start Node (A to F)</label>
                    <select
                      value={customInputs.dijkstra.startNode}
                      onChange={(e) => handleInputChange('startNode', e.target.value)}
                      className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      {['A', 'B', 'C', 'D', 'E', 'F'].map(nVal => (
                        <option key={nVal} value={nVal}>{nVal}</option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedAlgoKey === 'graph_bfs' && (
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Start Node (A to F)</label>
                    <select
                      value={customInputs.graph_bfs.startNode}
                      onChange={(e) => handleInputChange('startNode', e.target.value)}
                      className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      {['A', 'B', 'C', 'D', 'E', 'F'].map(nVal => (
                        <option key={nVal} value={nVal}>{nVal}</option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedAlgoKey === 'lcs_dp' && (
                  <>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">String 1 (max 6 chars)</label>
                      <input 
                        type="text" maxLength="6"
                        value={customInputs.lcs_dp.text1}
                        onChange={(e) => handleInputChange('text1', e.target.value.toUpperCase())}
                        className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">String 2 (max 6 chars)</label>
                      <input 
                        type="text" maxLength="6"
                        value={customInputs.lcs_dp.text2}
                        onChange={(e) => handleInputChange('text2', e.target.value.toUpperCase())}
                        className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </>
                )}

                {selectedAlgoKey === 'knapsack_dp' && (
                  <>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Weights (comma separated)</label>
                      <input 
                        type="text" value={customInputs.knapsack_dp.wtStr}
                        onChange={(e) => handleInputChange('wtStr', e.target.value)}
                        className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Values (comma separated)</label>
                      <input 
                        type="text" value={customInputs.knapsack_dp.valStr}
                        onChange={(e) => handleInputChange('valStr', e.target.value)}
                        className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Knapsack Capacity</label>
                      <input 
                        type="number" min="1" max="10"
                        value={customInputs.knapsack_dp.capacity}
                        onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 1)}
                        className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </>
                )}

                {selectedAlgoKey === 'n_queens' && (
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Board size N</label>
                    <select
                      value={customInputs.n_queens.n}
                      onChange={(e) => handleInputChange('n', parseInt(e.target.value))}
                      className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      {[4, 5, 6].map(nVal => (
                        <option key={nVal} value={nVal}>{nVal} x {nVal}</option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedAlgoKey === 'single_number' && (
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Array (each twice except one)</label>
                    <input 
                      type="text" value={customInputs.single_number.arrayStr}
                      onChange={(e) => handleInputChange('arrayStr', e.target.value)}
                      className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                {selectedAlgoKey === 'count_set_bits' && (
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Integer N (1 to 255)</label>
                    <input 
                      type="number" min="1" max="255"
                      value={customInputs.count_set_bits.n}
                      onChange={(e) => handleInputChange('n', parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-205 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DYNAMIC COMPLEXITY PROFILE CARD */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
            <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-400" /> Complexity Profile
            </h3>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-slate-950/40 p-2.5 border border-slate-800/80 rounded-xl">
                <span className="text-slate-500 block text-[9px] mb-0.5 uppercase">Worst Case</span>
                <span className="font-semibold text-rose-400">
                  {activeWorkspaceMode === 'ai_sandbox' ? (aiTraceData?.space_complexity ? aiTraceData.time_complexity : 'O(N)') : algoDef.timeComplexity.worst}
                </span>
              </div>
              <div className="bg-slate-950/40 p-2.5 border border-slate-800/80 rounded-xl">
                <span className="text-slate-500 block text-[9px] mb-0.5 uppercase">Average Case</span>
                <span className="font-semibold text-blue-400">
                  {activeWorkspaceMode === 'ai_sandbox' ? (aiTraceData?.space_complexity ? aiTraceData.time_complexity : 'O(N)') : algoDef.timeComplexity.avg}
                </span>
              </div>
              <div className="bg-slate-950/40 p-2.5 border border-slate-800/80 rounded-xl">
                <span className="text-slate-500 block text-[9px] mb-0.5 uppercase">Best Case</span>
                <span className="font-semibold text-emerald-400">
                  {activeWorkspaceMode === 'ai_sandbox' ? 'O(1)' : algoDef.timeComplexity.best}
                </span>
              </div>
              <div className="bg-slate-950/40 p-2.5 border border-slate-800/80 rounded-xl">
                <span className="text-slate-500 block text-[9px] mb-0.5 uppercase">Space Complexity</span>
                <span className="font-semibold text-purple-400">
                  {activeWorkspaceMode === 'ai_sandbox' ? (aiTraceData?.space_complexity ? aiTraceData.space_complexity : 'O(N)') : algoDef.spaceComplexity}
                </span>
              </div>
            </div>
          </div>

          {/* CODE HIGH-LIGHTER PANEL */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden flex flex-col backdrop-blur-md min-h-[300px]">
            <div className="bg-slate-900/80 border-b border-slate-800 px-4 py-3 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-355 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-indigo-400" /> Traced Source Code
              </span>
              
              {activeWorkspaceMode === 'curated' && (
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850">
                  {['javascript', 'python', 'java', 'cpp'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-2 py-0.5 text-[9px] font-bold rounded capitalize transition-all ${
                        selectedLanguage === lang ? 'bg-blue-600 text-white' : 'text-slate-505 hover:text-slate-300'
                      }`}
                    >
                      {lang === 'javascript' ? 'JS' : lang === 'cpp' ? 'C++' : lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-950/90 font-mono text-[10.5px] leading-5.5 overflow-y-auto max-h-[280px] flex-1 select-text">
              {codeLines.map((line, idx) => {
                const isHighlighted = highlightedLines.includes(idx);
                return (
                  <div 
                    key={idx}
                    className={`flex items-start -mx-4 px-4 transition-all duration-200 ${
                      isHighlighted ? 'bg-blue-900/40 border-l-[3px] border-blue-500 text-white font-bold' : 'text-slate-500'
                    }`}
                  >
                    <span className={`w-6 select-none inline-block text-right pr-2.5 text-[8.5px] ${
                      isHighlighted ? 'text-blue-400' : 'text-slate-700'
                    }`}>
                      {idx + 1}
                    </span>
                    <pre className="whitespace-pre overflow-x-auto flex-1 font-mono">{line}</pre>
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
