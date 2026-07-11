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
  Menu
} from 'lucide-react';
import { ALGORITHMS } from '../data/visualizerData';

// --- ALL TRACE GENERATORS ---

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
  let curr = 0; // index of current node

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

const generateInorderTrace = (values) => {
  const steps = [];

  function Node(val, id) {
    this.id = id;
    this.value = val;
    this.left = null;
    this.right = null;
  }

  // Create tree structure
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

const generateBFSTrace = (startNode = 'A') => {
  const steps = [];
  const nodes = ['A', 'B', 'C', 'D', 'E', 'F'];
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

  // Start initialization
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

// Layout BST tree nodes
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
  const [selectedAlgoKey, setSelectedAlgoKey] = useState('binary_search');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [speed, setSpeed] = useState(700); // ms per step (1x = 700ms)
  
  // Sidebar categories collapsing/expanding
  const [expandedCategories, setExpandedCategories] = useState({
    'Fundamentals': true,
    'Arrays': true,
    'Linked Lists': true,
    'Stacks & Queues': true,
    'Searching': true,
    'Sorting': true,
    'Trees': true,
    'Graphs': true,
    'Dynamic Programming': true,
    'Backtracking': true,
    'Bit Manipulation': true
  });

  // Category descriptions and icons matching image.png
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

  // Generate trace steps dynamically based on selected algorithm and inputs
  const steps = useMemo(() => {
    try {
      const inputs = customInputs[selectedAlgoKey];
      if (!inputs) return [];

      switch (selectedAlgoKey) {
        case 'fibonacci': {
          return generateFibonacciTrace(parseInt(inputs.n) || 6);
        }
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
        case 'stack_ops': {
          return generateStackTrace(inputs.opsStr);
        }
        case 'queue_ops': {
          return generateQueueTrace(inputs.opsStr);
        }
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
        case 'dijkstra': {
          return generateDijkstraTrace(inputs.startNode);
        }
        case 'graph_bfs': {
          return generateBFSTrace(inputs.startNode);
        }
        case 'lcs_dp': {
          return generateLcsTrace(inputs.text1 || "ABC", inputs.text2 || "AC");
        }
        case 'knapsack_dp': {
          return generateKnapsackTrace(inputs.wtStr, inputs.valStr, parseInt(inputs.capacity) || 5);
        }
        case 'n_queens': {
          return generateNQueensTrace(parseInt(inputs.n) || 4);
        }
        case 'single_number': {
          const arr = inputs.arrayStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
          return generateSingleNumberTrace(arr);
        }
        case 'count_set_bits': {
          return generateCountBitsTrace(parseInt(inputs.n) || 13);
        }
        default:
          return [];
      }
    } catch (e) {
      console.error("Failed to generate trace", e);
      return [{ step: 'error', explanation: `Error generating trace: ${e.message}`, variables: {} }];
    }
  }, [selectedAlgoKey, customInputs]);

  // Reset steps counter on algorithm change
  useEffect(() => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [selectedAlgoKey]);

  // Interval timer for playback control
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
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, steps, speed]);

  const activeStep = steps[currentStepIdx] || { step: 'init', explanation: '', variables: {} };

  // Calculate highlighted code line based on activeStep and selected language
  const highlightedLines = useMemo(() => {
    if (!algoDef || !algoDef.stepMapping || !activeStep.step) return [];
    const mapping = algoDef.stepMapping[activeStep.step];
    if (!mapping) return [];
    return mapping[selectedLanguage] || [];
  }, [algoDef, activeStep, selectedLanguage]);

  // --- HANDLERS FOR INPUT UPDATES ---
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
    setExpandedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  // Dijkstra graph layout helper coordinates
  const dijkstraNodeCoords = {
    A: { x: 55, y: 150 },
    B: { x: 180, y: 70 },
    C: { x: 180, y: 230 },
    D: { x: 310, y: 70 },
    E: { x: 310, y: 230 },
    F: { x: 430, y: 150 }
  };

  const dijkstraEdges = [
    { u: 'A', v: 'B', w: 4 },
    { u: 'A', v: 'C', w: 2 },
    { u: 'B', v: 'C', w: 1 },
    { u: 'B', v: 'D', w: 5 },
    { u: 'C', v: 'D', w: 8 },
    { u: 'C', v: 'E', w: 10 },
    { u: 'D', v: 'E', w: 2 },
    { u: 'D', v: 'F', w: 6 },
    { u: 'E', v: 'F', w: 3 }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
      
      {/* SIDEBAR: 11 CATEGORIES ACCORDION (3 cols) */}
      <div className="xl:col-span-3 space-y-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md max-h-[780px] overflow-y-auto">
        <div className="flex items-center gap-2 mb-4 px-2">
          <Menu className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">DSA Curriculum</h3>
        </div>
        
        {categories.map((cat) => {
          const IconComponent = cat.icon;
          const isExpanded = expandedCategories[cat.name];
          // Get algorithms belonging to this category
          const catAlgos = Object.entries(ALGORITHMS).filter(([_, def]) => def.category === cat.name);

          return (
            <div key={cat.name} className="border border-slate-800/40 rounded-xl overflow-hidden bg-slate-950/30">
              <button
                onClick={() => toggleCategory(cat.name)}
                className="w-full flex items-center justify-between p-3.5 hover:bg-slate-850/60 transition-all"
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`w-4 h-4 ${cat.color}`} />
                  <span className="text-xs font-semibold text-slate-350">{cat.name}</span>
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

      {/* DETAILED WORKSPACE (9 cols) */}
      <div className="xl:col-span-9 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* WORKSPACE MIDDLE: CANVAS & LOGS (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          {/* Main Visualizer screen */}
          <div className="bg-slate-950/80 border border-slate-850 rounded-3xl p-6 min-h-[440px] flex items-center justify-center relative overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.06),transparent_60%)] pointer-events-none"></div>

            <div className="w-full h-full flex flex-col items-center justify-center z-10 select-none">
              
              {/* Category details Badge */}
              <div className="absolute top-5 left-5 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 bg-slate-900/60 border border-slate-800/80 px-3 py-1 rounded-full">
                {algoDef.category} <span className="text-slate-650">/</span> <span className="text-blue-400">{algoDef.name}</span>
              </div>

              {/* 1. FIBONACCI */}
              {selectedAlgoKey === 'fibonacci' && (() => {
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
                              <div className="absolute -top-7 text-[10px] font-extrabold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 animate-pulse">
                                +
                              </div>
                            )}
                            <div className={`w-11 h-11 flex items-center justify-center rounded-xl border text-sm font-bold transition-all duration-300 ${
                              isComputed
                                ? 'bg-blue-600 border-blue-400 text-white scale-110 shadow-lg shadow-blue-500/30'
                                : isSumPart
                                ? 'bg-indigo-950/65 border-indigo-500/60 text-indigo-200'
                                : valExists
                                ? 'bg-slate-850 border-slate-800 text-slate-350'
                                : 'bg-slate-900/15 border-slate-850 text-slate-700 opacity-20'
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
              })()}

              {/* 2. TWO SUM */}
              {selectedAlgoKey === 'two_sum' && (() => {
                const arr = customInputs.two_sum.arrayStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x)).sort((a,b) => a-b);
                const { left, right, sum } = activeStep.variables;
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
                              isFound
                                ? 'bg-emerald-600 border-emerald-500 text-white scale-110 shadow-md shadow-emerald-500/30'
                                : isLeft
                                ? 'bg-purple-950/70 border-purple-500 text-purple-200'
                                : isRight
                                ? 'bg-rose-950/70 border-rose-500 text-rose-200'
                                : 'bg-slate-850 border-slate-800 text-slate-400 opacity-60'
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
              })()}

              {/* 3. REVERSE LINKED LIST */}
              {selectedAlgoKey === 'reverse_linked_list' && (() => {
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
                            {/* Pointers above node */}
                            <div className="absolute -top-11 left-1/2 -translate-x-1/2 flex flex-col gap-1 text-[9px] font-bold uppercase">
                              {isPrev && <span className="text-purple-400 bg-purple-500/10 px-1 rounded border border-purple-500/20">Prev</span>}
                              {isCurr && <span className="text-blue-400 bg-blue-500/10 px-1 rounded border border-blue-500/20">Curr</span>}
                              {isNext && <span className="text-amber-400 bg-amber-500/10 px-1 rounded border border-amber-500/20">Next</span>}
                            </div>

                            {/* Node Circle */}
                            <div className={`w-12 h-12 rounded-full border flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-md ${
                              isCurr 
                                ? 'bg-blue-600 border-blue-400 text-white scale-110 shadow-blue-500/30 animate-pulse'
                                : isPrev 
                                ? 'bg-purple-950/70 border-purple-500 text-purple-200'
                                : 'bg-slate-850 border-slate-700 text-slate-350'
                            }`}>
                              {node.value}
                            </div>

                            {/* Arrow indicator */}
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
              })()}

              {/* 4. STACK OPERATIONS */}
              {selectedAlgoKey === 'stack_ops' && (() => {
                const stackState = activeStep.stackState || [];
                const actionItem = activeStep.actionItem;

                return (
                  <div className="space-y-6 w-full max-w-[280px] text-center">
                    <div className="border-4 border-slate-850 border-t-0 bg-slate-900/40 p-4 min-h-[180px] flex flex-col-reverse justify-start gap-2.5 rounded-b-2xl shadow-inner relative overflow-hidden">
                      <div className="absolute top-2 left-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Stack (Top)</div>
                      
                      {stackState.length === 0 ? (
                        <div className="text-slate-600 text-xs italic py-10">Empty Stack</div>
                      ) : (
                        stackState.map((val, idx) => {
                          const isTop = idx === stackState.length - 1;
                          const isNew = isTop && actionItem?.type === 'push';

                          return (
                            <div 
                              key={idx}
                              className={`w-full py-2.5 rounded-xl border text-sm font-extrabold transition-all duration-300 shadow-md ${
                                isNew 
                                  ? 'bg-emerald-600 border-emerald-500 text-white scale-102 shadow-emerald-500/25 animate-bounce' 
                                  : isTop 
                                  ? 'bg-blue-600/35 border-blue-500 text-blue-200' 
                                  : 'bg-slate-850 border-slate-800 text-slate-400'
                              }`}
                            >
                              {val}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* 5. QUEUE OPERATIONS */}
              {selectedAlgoKey === 'queue_ops' && (() => {
                const queueState = activeStep.queueState || [];
                const actionItem = activeStep.actionItem;

                return (
                  <div className="space-y-6 w-full text-center">
                    <div className="flex border-4 border-slate-850 border-l-0 border-r-0 bg-slate-900/40 p-4 min-h-[75px] items-center justify-start gap-3 rounded-xl shadow-inner relative overflow-x-auto">
                      <div className="absolute top-1.5 left-2.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Front (out)</div>
                      <div className="absolute top-1.5 right-2.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Rear (in)</div>

                      {queueState.length === 0 ? (
                        <div className="w-full text-slate-650 text-xs italic text-center">Empty Queue</div>
                      ) : (
                        queueState.map((val, idx) => {
                          const isFront = idx === 0;
                          const isRear = idx === queueState.length - 1;
                          const isNew = isRear && actionItem?.type === 'enqueue';

                          return (
                            <div 
                              key={idx}
                              className={`w-12 h-12 flex items-center justify-center rounded-xl border text-xs font-bold shrink-0 transition-all duration-300 shadow-md ${
                                isNew 
                                  ? 'bg-emerald-600 border-emerald-500 text-white scale-105 animate-pulse'
                                  : isFront 
                                  ? 'bg-blue-600/35 border-blue-500 text-blue-200' 
                                  : 'bg-slate-850 border-slate-800 text-slate-400'
                              }`}
                            >
                              {val}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* 6. LINEAR SEARCH */}
              {selectedAlgoKey === 'linear_search' && (() => {
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
                              isFound 
                                ? 'bg-emerald-600 border-emerald-500 text-white scale-110 shadow-emerald-500/30'
                                : isActive
                                ? 'bg-blue-600 border-blue-400 text-white scale-108 animate-pulse shadow-blue-500/25'
                                : isScanned
                                ? 'bg-slate-900/35 border-slate-850 text-slate-650 opacity-40'
                                : 'bg-slate-850 border-slate-800 text-slate-350'
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
              })()}

              {/* 7. QUICK SORT */}
              {selectedAlgoKey === 'quick_sort' && (() => {
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
                                isPivot 
                                  ? 'bg-purple-600 border-purple-500 shadow-purple-500/25'
                                  : isI 
                                  ? 'bg-purple-950/70 border-purple-500'
                                  : isJ
                                  ? swapped 
                                    ? 'bg-amber-500 border-amber-400 shadow-amber-500/20' 
                                    : 'bg-blue-500 border-blue-400 shadow-blue-500/20'
                                  : 'bg-slate-800 border-slate-700/80'
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
              })()}

              {/* 8. BST INORDER TRAVERSAL */}
              {selectedAlgoKey === 'bst_inorder' && (() => {
                const treeCoordinates = getBSTLayout(activeStep.tree);
                const activeNodeId = activeStep.activeNodeId;
                const visitedNodeIds = activeStep.visitedNodeIds || [];
                const visitedList = activeStep.variables.visited || [];

                return (
                  <div className="w-full flex flex-col items-center gap-6">
                    <div className="w-full h-[240px] overflow-hidden flex items-center justify-center">
                      {treeCoordinates.length === 0 ? (
                        <div className="text-slate-600 text-xs italic">No tree nodes.</div>
                      ) : (
                        <svg className="w-full h-full max-w-[480px] max-h-[220px]">
                          {/* Lines */}
                          {treeCoordinates.map((node) => {
                            if (node.parentX === null) return null;
                            const isPathVisited = visitedNodeIds.includes(node.id) && visitedNodeIds.includes(treeCoordinates.find(n => n.x === node.parentX && n.y === node.parentY)?.id);
                            return (
                              <line
                                key={`line-${node.id}`}
                                x1={node.parentX}
                                y1={node.parentY}
                                x2={node.x}
                                y2={node.y}
                                stroke={isPathVisited ? '#10b981' : '#334155'}
                                strokeWidth="2.5"
                                className="transition-all duration-350"
                              />
                            );
                          })}
                          {/* Nodes */}
                          {treeCoordinates.map((node) => {
                            const isActive = node.id === activeNodeId;
                            const isVisited = visitedNodeIds.includes(node.id);

                            return (
                              <g key={`node-${node.id}`} className="transition-all duration-350">
                                <circle
                                  cx={node.x}
                                  cy={node.y}
                                  r="14"
                                  fill={isActive ? '#3b82f6' : isVisited ? '#10b981' : '#1e293b'}
                                  stroke={isActive ? '#60a5fa' : isVisited ? '#34d399' : '#475569'}
                                  strokeWidth="2"
                                  className={`transition-all duration-300 ${isActive ? 'animate-pulse' : ''}`}
                                />
                                <text
                                  x={node.x}
                                  y={node.y + 3.5}
                                  fill="#ffffff"
                                  fontSize="9.5"
                                  fontWeight="bold"
                                  textAnchor="middle"
                                >
                                  {node.val}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      )}
                    </div>
                    {/* Traversal Output list */}
                    <div className="w-full text-center space-y-1 bg-slate-900/50 p-3.5 border border-slate-800/80 rounded-2xl max-w-sm">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inorder Output</span>
                      <div className="font-mono text-sm text-emerald-400 font-bold">
                        [{visitedList.join(', ')}]
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 9. GRAPH BFS TRAVERSAL */}
              {selectedAlgoKey === 'graph_bfs' && (() => {
                const activeNode = activeStep.activeNode;
                const visitingNode = activeStep.visitingNode;
                const visitedNodes = activeStep.visitedNodes || [];
                const queueState = activeStep.queueState || [];

                return (
                  <div className="w-full flex flex-col items-center gap-6">
                    <div className="w-full h-[240px] flex items-center justify-center">
                      <svg className="w-full h-full max-w-[460px] max-h-[220px]">
                        {/* Edges */}
                        {dijkstraEdges.map((edge, idx) => {
                          const uCoords = dijkstraNodeCoords[edge.u];
                          const vCoords = dijkstraNodeCoords[edge.v];
                          const bothVisited = visitedNodes.includes(edge.u) && visitedNodes.includes(edge.v);

                          return (
                            <line
                              key={`edge-${idx}`}
                              x1={uCoords.x}
                              y1={uCoords.y}
                              x2={vCoords.x}
                              y2={vCoords.y}
                              stroke={bothVisited ? '#10b981' : '#334155'}
                              strokeWidth="2"
                              className="transition-all duration-300"
                            />
                          );
                        })}

                        {/* Nodes */}
                        {Object.keys(dijkstraNodeCoords).map((nodeName) => {
                          const coords = dijkstraNodeCoords[nodeName];
                          const isActive = nodeName === activeNode;
                          const isVisiting = nodeName === visitingNode;
                          const isVisited = visitedNodes.includes(nodeName);

                          return (
                            <g key={`node-${nodeName}`} className="transition-all duration-300">
                              <circle
                                cx={coords.x}
                                cy={coords.y}
                                r="14"
                                fill={isActive ? '#3b82f6' : isVisiting ? '#10b981' : isVisited ? '#166534' : '#1e293b'}
                                stroke={isActive ? '#60a5fa' : isVisiting ? '#34d399' : isVisited ? '#22c55e' : '#475569'}
                                strokeWidth="2"
                                className="transition-all duration-300"
                              />
                              <text
                                x={coords.x}
                                y={coords.y + 3.5}
                                fill="#ffffff"
                                fontSize="10"
                                fontWeight="bold"
                                textAnchor="middle"
                              >
                                {nodeName}
                              </text>
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
              })()}

              {/* 10. 0/1 KNAPSACK DP */}
              {selectedAlgoKey === 'knapsack_dp' && (() => {
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
                              <td className="px-2 py-1.5 border border-slate-800 bg-slate-900 font-bold text-purple-400 text-[10px]">
                                {rIdx === 0 ? 'Ø' : `i=${rIdx} (${wt[rIdx-1]}, ${val[rIdx-1]})`}
                              </td>
                              {row.map((cellVal, cIdx) => {
                                const isActive = activeCell && activeCell[0] === rIdx && activeCell[1] === cIdx;
                                const isLookup = lookupCells.some(cell => cell[0] === rIdx && cell[1] === cIdx);

                                return (
                                  <td 
                                    key={cIdx} 
                                    className={`w-8 h-8 border border-slate-800 transition-all duration-300 ${
                                      isActive 
                                        ? 'bg-blue-600 font-bold text-white shadow-inner scale-105' 
                                        : isLookup 
                                        ? 'bg-purple-900/60 font-semibold text-purple-200' 
                                        : 'bg-slate-900/35 text-slate-400'
                                    }`}
                                  >
                                    {cellVal}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              {/* 11. SINGLE NUMBER (XOR) */}
              {selectedAlgoKey === 'single_number' && (() => {
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
                              isActive 
                                ? 'bg-blue-600 border-blue-400 text-white scale-110 shadow-blue-500/25'
                                : isProcessed 
                                ? 'bg-slate-900/35 border-slate-850 text-slate-650 opacity-40'
                                : 'bg-slate-850 border-slate-800 text-slate-450'
                            }`}>
                              {val}
                            </div>
                            <span className="text-[9px] text-slate-650">{idx}</span>
                          </div>
                        );
                      })}
                    </div>

                    {activeIdx !== null && (
                      <div className="bg-slate-900/50 p-4 border border-slate-800 rounded-2xl max-w-sm mx-auto space-y-2 text-xs font-mono">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Current result:</span>
                          <span className="text-purple-300 font-bold">{result_binary}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">XOR Active ({num}):</span>
                          <span className="text-blue-300 font-bold">^ {num_binary}</span>
                        </div>
                        <div className="border-t border-slate-850 pt-2 flex justify-between">
                          <span className="text-slate-500">New result:</span>
                          <span className="text-emerald-400 font-extrabold">{result.toString(2).padStart(4, '0')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* 12. COUNT SET BITS */}
              {selectedAlgoKey === 'count_set_bits' && (() => {
                const { count, n, n_binary, bit } = activeStep.variables;

                return (
                  <div className="space-y-10 w-full text-center">
                    <div className="bg-slate-900/50 p-4 border border-slate-850 rounded-2xl max-w-xs mx-auto space-y-3 font-mono text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">N (decimal):</span>
                        <span className="text-blue-400 font-bold">{customInputs.count_set_bits.n}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">N (binary):</span>
                        <span className="text-purple-300 font-extrabold">{n_binary}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-850 pt-2">
                        <span className="text-slate-500">Hamming Weight:</span>
                        <span className="text-emerald-400 font-extrabold text-sm">{count}</span>
                      </div>
                    </div>

                    {activeStep.step === 'check_bit' && (
                      <div className="text-xs text-blue-300 animate-fade-in font-mono">
                        bit = n & 1 = <strong className="text-emerald-400 font-bold">{bit}</strong>. (Adds {bit} to count).
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ORIGINAL VISUALIZERS (BINARY SEARCH, BUBBLE SORT, SLIDING WINDOW, BST INSERTION, DIJKSTRA, LCS DP, N-QUEENS) ARE ALREADY SUPPORTED UNDER THEIR CORRESPONDING IF STATEMENT CHECKS ABOVE! */}

            </div>
          </div>

          {/* Execution Narrative Log console */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col backdrop-blur-md">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-blue-400" /> Explanation Log
            </h3>
            <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl min-h-[90px] flex items-center text-sm leading-relaxed text-slate-350 transition-all duration-300">
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
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" /> Trace Controls
            </h3>
            
            <div className="mb-4">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Steps</span>
                <span>{currentStepIdx + 1} / {steps.length}</span>
              </div>
              <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentStepIdx + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between gap-2 mb-3">
              <button
                onClick={() => setCurrentStepIdx(p => Math.max(0, p - 1))}
                disabled={currentStepIdx === 0}
                className="flex-1 bg-slate-850 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed py-2 rounded-xl flex items-center justify-center border border-slate-800 transition-all text-slate-200"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex-[2] py-2 rounded-xl flex items-center justify-center font-bold text-white transition-all ${
                  isPlaying 
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-500/20' 
                    : 'bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-1.5" /> : <Play className="w-4 h-4 mr-1.5" />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>

              <button
                onClick={() => setCurrentStepIdx(p => Math.min(steps.length - 1, p + 1))}
                disabled={currentStepIdx === steps.length - 1}
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
              className="w-full bg-slate-850 hover:bg-slate-800 py-2.5 rounded-xl border border-slate-800 flex items-center justify-center text-xs font-semibold transition-all text-slate-350 mb-4"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Reset Tracing
            </button>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Speed: {speed === 1200 ? '0.5x' : speed === 700 ? '1x' : speed === 350 ? '2x' : '4x'}
              </label>
              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={speed === 1200 ? 0 : speed === 700 ? 1 : speed === 350 ? 2 : 3}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  const speeds = [1200, 700, 350, 150];
                  setSpeed(speeds[val]);
                }}
                className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>

          {/* DYNAMIC CUSTOM INPUTS PANEL */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" /> Custom Inputs
            </h3>
            
            <div className="space-y-4">
              {selectedAlgoKey === 'fibonacci' && (
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Compute N-th Fibonacci (2 to 12)</label>
                  <input 
                    type="number"
                    min="2"
                    max="12"
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
                      type="text" 
                      value={customInputs.sliding_window.arrayStr}
                      onChange={(e) => handleInputChange('arrayStr', e.target.value)}
                      className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Window Size K</label>
                    <input 
                      type="number" 
                      min="1"
                      max="10"
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
                      type="text" 
                      value={customInputs.two_sum.arrayStr}
                      onChange={(e) => handleInputChange('arrayStr', e.target.value)}
                      className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Target sum</label>
                    <input 
                      type="number" 
                      value={customInputs.two_sum.target}
                      onChange={(e) => handleInputChange('target', e.target.value)}
                      className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {selectedAlgoKey === 'reverse_linked_list' && (
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">List values (comma separated, max 6)</label>
                  <input 
                    type="text" 
                    value={customInputs.reverse_linked_list.arrayStr}
                    onChange={(e) => handleInputChange('arrayStr', e.target.value)}
                    className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {selectedAlgoKey === 'stack_ops' && (
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Operations sequence</label>
                  <input 
                    type="text" 
                    value={customInputs.stack_ops.opsStr}
                    onChange={(e) => handleInputChange('opsStr', e.target.value)}
                    className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {selectedAlgoKey === 'queue_ops' && (
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Operations sequence</label>
                  <input 
                    type="text" 
                    value={customInputs.queue_ops.opsStr}
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
                      type="text" 
                      value={customInputs.binary_search.arrayStr}
                      onChange={(e) => handleInputChange('arrayStr', e.target.value)}
                      className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Search Target</label>
                    <input 
                      type="number" 
                      value={customInputs.binary_search.target}
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
                      type="text" 
                      value={customInputs.linear_search.arrayStr}
                      onChange={(e) => handleInputChange('arrayStr', e.target.value)}
                      className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Search Target</label>
                    <input 
                      type="number" 
                      value={customInputs.linear_search.target}
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
                    type="text" 
                    value={customInputs.bubble_sort.arrayStr}
                    onChange={(e) => handleInputChange('arrayStr', e.target.value)}
                    className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {selectedAlgoKey === 'quick_sort' && (
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Unsorted Array</label>
                  <input 
                    type="text" 
                    value={customInputs.quick_sort.arrayStr}
                    onChange={(e) => handleInputChange('arrayStr', e.target.value)}
                    className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {selectedAlgoKey === 'bst_insertion' && (
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Insert Sequence (comma separated)</label>
                  <input 
                    type="text" 
                    value={customInputs.bst_insertion.arrayStr}
                    onChange={(e) => handleInputChange('arrayStr', e.target.value)}
                    className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {selectedAlgoKey === 'bst_inorder' && (
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Nodes insert sequence</label>
                  <input 
                    type="text" 
                    value={customInputs.bst_inorder.arrayStr}
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
                    {['A', 'B', 'C', 'D', 'E', 'F'].map(node => (
                      <option key={node} value={node}>{node}</option>
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
                    {['A', 'B', 'C', 'D', 'E', 'F'].map(node => (
                      <option key={node} value={node}>{node}</option>
                    ))}
                  </select>
                </div>
              )}

              {selectedAlgoKey === 'lcs_dp' && (
                <>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">String 1 (max 6 chars)</label>
                    <input 
                      type="text" 
                      maxLength="6"
                      value={customInputs.lcs_dp.text1}
                      onChange={(e) => handleInputChange('text1', e.target.value.toUpperCase())}
                      className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">String 2 (max 6 chars)</label>
                    <input 
                      type="text" 
                      maxLength="6"
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
                    <label className="block text-[10px] text-slate-500 mb-1">Item Weights (comma separated)</label>
                    <input 
                      type="text" 
                      value={customInputs.knapsack_dp.wtStr}
                      onChange={(e) => handleInputChange('wtStr', e.target.value)}
                      className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Item Values (comma separated)</label>
                    <input 
                      type="text" 
                      value={customInputs.knapsack_dp.valStr}
                      onChange={(e) => handleInputChange('valStr', e.target.value)}
                      className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Knapsack Capacity W (max 10)</label>
                    <input 
                      type="number"
                      min="1"
                      max="10"
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
                  <label className="block text-[10px] text-slate-500 mb-1">Array (each number twice, except one)</label>
                  <input 
                    type="text" 
                    value={customInputs.single_number.arrayStr}
                    onChange={(e) => handleInputChange('arrayStr', e.target.value)}
                    className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {selectedAlgoKey === 'count_set_bits' && (
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Integer N (1 to 255)</label>
                  <input 
                    type="number" 
                    min="1"
                    max="255"
                    value={customInputs.count_set_bits.n}
                    onChange={(e) => handleInputChange('n', parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* DYNAMIC COMPLEXITY PROFILE CARD */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
            <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-400" /> Complexity Profile
            </h3>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-slate-950/40 p-2.5 border border-slate-800/80 rounded-xl">
                <span className="text-slate-500 block text-[9px] mb-0.5 uppercase">Worst Case</span>
                <span className="font-semibold text-rose-400">{algoDef.timeComplexity.worst}</span>
              </div>
              <div className="bg-slate-950/40 p-2.5 border border-slate-800/80 rounded-xl">
                <span className="text-slate-500 block text-[9px] mb-0.5 uppercase">Average Case</span>
                <span className="font-semibold text-blue-400">{algoDef.timeComplexity.avg}</span>
              </div>
              <div className="bg-slate-950/40 p-2.5 border border-slate-800/80 rounded-xl">
                <span className="text-slate-500 block text-[9px] mb-0.5 uppercase">Best Case</span>
                <span className="font-semibold text-emerald-400">{algoDef.timeComplexity.best}</span>
              </div>
              <div className="bg-slate-950/40 p-2.5 border border-slate-800/80 rounded-xl">
                <span className="text-slate-500 block text-[9px] mb-0.5 uppercase">Space Complexity</span>
                <span className="font-semibold text-purple-400">{algoDef.spaceComplexity}</span>
              </div>
            </div>
          </div>

          {/* CODE HIGH-LIGHTER PANEL */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden flex flex-col backdrop-blur-md min-h-[300px]">
            <div className="bg-slate-900/80 border-b border-slate-800 px-4 py-3 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-350 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-indigo-400" /> Traced Source Code
              </span>
              
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850">
                {['javascript', 'python', 'java', 'cpp'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-2 py-0.5 text-[9px] font-bold rounded capitalize transition-all ${
                      selectedLanguage === lang
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {lang === 'javascript' ? 'JS' : lang === 'cpp' ? 'C++' : lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-950/90 font-mono text-[10.5px] leading-5.5 overflow-y-auto max-h-[280px] flex-1 select-text">
              {algoDef.code[selectedLanguage].map((line, idx) => {
                const isHighlighted = highlightedLines.includes(idx);
                return (
                  <div 
                    key={idx}
                    className={`flex items-start -mx-4 px-4 transition-all duration-200 ${
                      isHighlighted 
                        ? 'bg-blue-900/40 border-l-[3px] border-blue-500 text-white font-bold' 
                        : 'text-slate-500'
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
