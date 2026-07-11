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
  Award
} from 'lucide-react';
import { ALGORITHMS } from '../data/visualizerData';

// --- TRACE GENERATORS ---

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
      const prevLow = low;
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
      const prevHigh = high;
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
    const prevSum = window_sum;
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
        explanation: `New window sum (${window_sum}) > max_sum (${max_sum - (window_sum - max_sum)}). Update max_sum = ${max_sum}.`,
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

const generateNQueensTrace = (n = 4) => {
  const steps = [];
  const board = Array.from({ length: n }, () => Array(n).fill(false));

  const isSafe = (board, row, col) => {
    for (let i = 0; i < row; i++) {
      if (board[i][col]) return false;
    }
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j]) return false;
    }
    for (let i = row, j = col; i >= 0 && j < n; i--, j++) {
      if (board[i][j]) return false;
    }
    return true;
  };

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

// Helper to layout BST node coordinates
const getTreeCoordinates = (node, x = 250, y = 40, level = 0, parentX = null, parentY = null) => {
  if (!node) return [];
  // Dynamic offset based on depth to avoid overlap
  const childOffset = 140 / Math.pow(1.8, level);
  const leftCoords = getTreeCoordinates(node.left, x - childOffset, y + 60, level + 1, x, y);
  const rightCoords = getTreeCoordinates(node.right, x + childOffset, y + 60, level + 1, x, y);
  
  return [
    { 
      id: node.id, 
      val: node.value, 
      x, 
      y, 
      parentX, 
      parentY,
      hasLeft: !!node.left, 
      hasRight: !!node.right 
    },
    ...leftCoords,
    ...rightCoords
  ];
};

export default function CodeSketchVisualizer() {
  const [selectedAlgoKey, setSelectedAlgoKey] = useState('binary_search');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [speed, setSpeed] = useState(700); // ms per step (1x = 700ms)

  // Manage custom input states separately for each algorithm to prevent loss
  const [customInputs, setCustomInputs] = useState({
    binary_search: {
      arrayStr: "2, 5, 8, 12, 16, 23, 38, 56, 72, 91",
      target: "23"
    },
    bubble_sort: {
      arrayStr: "38, 27, 43, 3, 9, 82, 10"
    },
    sliding_window: {
      arrayStr: "2, 1, 5, 1, 3, 2",
      k: 3
    },
    bst_insertion: {
      arrayStr: "15, 10, 20, 8, 12, 18, 25"
    },
    dijkstra: {
      startNode: "A"
    },
    lcs_dp: {
      text1: "STONE",
      text2: "LONGEST"
    },
    n_queens: {
      n: 4
    }
  });

  const algoDef = ALGORITHMS[selectedAlgoKey];

  // Dynamic steps generation memoized on current inputs
  const steps = useMemo(() => {
    try {
      const inputs = customInputs[selectedAlgoKey];
      switch (selectedAlgoKey) {
        case 'binary_search': {
          const arr = inputs.arrayStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x)).sort((a,b) => a-b);
          const target = parseInt(inputs.target);
          return generateBinarySearchTrace(arr, isNaN(target) ? 0 : target);
        }
        case 'bubble_sort': {
          const arr = inputs.arrayStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
          return generateBubbleSortTrace(arr.length ? arr : [5, 4, 3, 2, 1]);
        }
        case 'sliding_window': {
          const arr = inputs.arrayStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
          const k = parseInt(inputs.k);
          return generateSlidingWindowTrace(arr, isNaN(k) ? 3 : k);
        }
        case 'bst_insertion': {
          const arr = inputs.arrayStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
          return generateBSTTrace(arr);
        }
        case 'dijkstra': {
          return generateDijkstraTrace(inputs.startNode);
        }
        case 'lcs_dp': {
          return generateLcsTrace(inputs.text1 || "ABC", inputs.text2 || "AC");
        }
        case 'n_queens': {
          return generateNQueensTrace(parseInt(inputs.n) || 4);
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

  // Dijkstra graph layout helper coordinates
  const dijkstraNodeCoords = {
    A: { x: 60, y: 150 },
    B: { x: 180, y: 70 },
    C: { x: 180, y: 230 },
    D: { x: 320, y: 70 },
    E: { x: 320, y: 230 },
    F: { x: 440, y: 150 }
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
    <div className="space-y-6">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Interactive CodeSketch Visualizer
            </h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Trace execution, modify inputs, and master complex algorithms with step-by-step visualizations.
          </p>
        </div>
        
        {/* Algo Selector tabs */}
        <div className="flex flex-wrap gap-2">
          {Object.keys(ALGORITHMS).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedAlgoKey(key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                selectedAlgoKey === key
                  ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                  : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {ALGORITHMS[key].name}
            </button>
          ))}
        </div>
      </div>

      {/* THREE COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: CONTROLS & INPUTS (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* CONTROL SUITE CARD */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" /> Controls
            </h3>
            
            {/* Playback Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Execution Steps</span>
                <span>{currentStepIdx + 1} / {steps.length}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentStepIdx + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Play, Pause, Next, Prev Buttons */}
            <div className="flex justify-between gap-2 mb-4">
              <button
                onClick={() => setCurrentStepIdx(p => Math.max(0, p - 1))}
                disabled={currentStepIdx === 0}
                className="flex-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed py-2 rounded-xl flex items-center justify-center border border-slate-700 transition-all text-slate-200"
                title="Step Backward"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex-[2] py-2 rounded-xl flex items-center justify-center font-bold text-white transition-all ${
                  isPlaying 
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-[0_0_15px_rgba(217,119,6,0.3)]' 
                    : 'bg-blue-600 hover:bg-blue-700 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                }`}
              >
                {isPlaying ? <Pause className="w-5 h-5 mr-1" /> : <Play className="w-5 h-5 mr-1" />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>

              <button
                onClick={() => setCurrentStepIdx(p => Math.min(steps.length - 1, p + 1))}
                disabled={currentStepIdx === steps.length - 1}
                className="flex-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed py-2 rounded-xl flex items-center justify-center border border-slate-700 transition-all text-slate-200"
                title="Step Forward"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                setCurrentStepIdx(0);
                setIsPlaying(false);
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl border border-slate-700 flex items-center justify-center text-sm font-semibold transition-all text-slate-300 mb-6"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Reset Animation
            </button>

            {/* Speed Control Slider */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Playback Speed: {speed === 1200 ? '0.5x' : speed === 700 ? '1x' : speed === 350 ? '2x' : '4x'}
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
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0.5x</span>
                <span>1.0x</span>
                <span>2.0x</span>
                <span>4.0x</span>
              </div>
            </div>
          </div>

          {/* DYNAMIC CUSTOM INPUTS CARD */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" /> Customize Data
            </h3>
            
            <div className="space-y-4">
              {selectedAlgoKey === 'binary_search' && (
                <>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Sorted Array (numbers)</label>
                    <input 
                      type="text" 
                      value={customInputs.binary_search.arrayStr}
                      onChange={(e) => handleInputChange('arrayStr', e.target.value)}
                      className="w-full bg-slate-850 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Search Target</label>
                    <input 
                      type="number" 
                      value={customInputs.binary_search.target}
                      onChange={(e) => handleInputChange('target', e.target.value)}
                      className="w-full bg-slate-850 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {selectedAlgoKey === 'bubble_sort' && (
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Unsorted Array (comma separated)</label>
                  <input 
                    type="text" 
                    value={customInputs.bubble_sort.arrayStr}
                    onChange={(e) => handleInputChange('arrayStr', e.target.value)}
                    className="w-full bg-slate-850 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {selectedAlgoKey === 'sliding_window' && (
                <>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Array (comma separated)</label>
                    <input 
                      type="text" 
                      value={customInputs.sliding_window.arrayStr}
                      onChange={(e) => handleInputChange('arrayStr', e.target.value)}
                      className="w-full bg-slate-850 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Window Size K</label>
                    <input 
                      type="number" 
                      min="1"
                      max="10"
                      value={customInputs.sliding_window.k}
                      onChange={(e) => handleInputChange('k', e.target.value)}
                      className="w-full bg-slate-850 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {selectedAlgoKey === 'bst_insertion' && (
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Insert Sequence (comma separated)</label>
                  <input 
                    type="text" 
                    value={customInputs.bst_insertion.arrayStr}
                    onChange={(e) => handleInputChange('arrayStr', e.target.value)}
                    className="w-full bg-slate-850 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {selectedAlgoKey === 'dijkstra' && (
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Source Node</label>
                  <select
                    value={customInputs.dijkstra.startNode}
                    onChange={(e) => handleInputChange('startNode', e.target.value)}
                    className="w-full bg-slate-850 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-250 focus:outline-none focus:border-blue-500"
                  >
                    {['A', 'B', 'C', 'D', 'E', 'F'].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              )}

              {selectedAlgoKey === 'lcs_dp' && (
                <>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">String 1 (up to 7 chars)</label>
                    <input 
                      type="text" 
                      maxLength="7"
                      value={customInputs.lcs_dp.text1}
                      onChange={(e) => handleInputChange('text1', e.target.value.toUpperCase())}
                      className="w-full bg-slate-850 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">String 2 (up to 7 chars)</label>
                    <input 
                      type="text" 
                      maxLength="7"
                      value={customInputs.lcs_dp.text2}
                      onChange={(e) => handleInputChange('text2', e.target.value.toUpperCase())}
                      className="w-full bg-slate-850 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {selectedAlgoKey === 'n_queens' && (
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Board Size N</label>
                  <select
                    value={customInputs.n_queens.n}
                    onChange={(e) => handleInputChange('n', parseInt(e.target.value))}
                    className="w-full bg-slate-850 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    {[4, 5, 6].map(val => (
                      <option key={val} value={val}>{val} x {val}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* COMPLEXITY ANALYSIS CARD */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" /> Complexity
            </h3>
            
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-slate-800/40 p-2 border border-slate-800 rounded-xl">
                <span className="text-slate-500 block mb-0.5">Worst Time</span>
                <span className="font-semibold text-amber-400 text-sm">{algoDef.timeComplexity.worst}</span>
              </div>
              <div className="bg-slate-800/40 p-2 border border-slate-800 rounded-xl">
                <span className="text-slate-500 block mb-0.5">Average Time</span>
                <span className="font-semibold text-blue-400 text-sm">{algoDef.timeComplexity.avg}</span>
              </div>
              <div className="bg-slate-800/40 p-2 border border-slate-800 rounded-xl">
                <span className="text-slate-500 block mb-0.5">Best Time</span>
                <span className="font-semibold text-emerald-400 text-sm">{algoDef.timeComplexity.best}</span>
              </div>
              <div className="bg-slate-800/40 p-2 border border-slate-800 rounded-xl">
                <span className="text-slate-500 block mb-0.5">Space Complexity</span>
                <span className="font-semibold text-purple-400 text-sm">{algoDef.spaceComplexity}</span>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: VISUALIZER CANVAS (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="flex-1 bg-slate-950/80 border border-slate-850 rounded-3xl p-6 min-h-[380px] flex items-center justify-center relative overflow-hidden shadow-2xl backdrop-blur-md">
            
            {/* GRID GRAPHIC OR ACCENT GLOWS */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.06),transparent_60%)] pointer-events-none"></div>

            {/* DYNAMIC CANVAS RENDERER */}
            <div className="w-full h-full flex flex-col items-center justify-center z-10 select-none">
              
              {/* 1. BINARY SEARCH VISUALIZATION */}
              {selectedAlgoKey === 'binary_search' && (() => {
                const arr = customInputs.binary_search.arrayStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x)).sort((a,b) => a-b);
                const { low, high, mid, status } = activeStep.variables;
                const foundIdx = activeStep.foundIndex;
                
                return (
                  <div className="space-y-12 w-full text-center">
                    <div className="text-slate-400 text-xs">
                      Target: <span className="text-blue-400 font-bold text-sm bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">{customInputs.binary_search.target}</span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 items-end">
                      {arr.map((val, idx) => {
                        const isMid = idx === mid;
                        const isFound = idx === foundIdx;
                        const inRange = idx >= low && idx <= high;
                        const isDimmed = !inRange && status !== 'initializing' && status !== 'not found' && foundIdx === null;

                        return (
                          <div key={idx} className="flex flex-col items-center gap-2 relative">
                            {/* Pointers overlays */}
                            <div className="absolute -top-7 text-[10px] font-bold tracking-wider uppercase transition-all duration-300">
                              {idx === low && <span className="text-purple-400 bg-purple-500/10 px-1 rounded border border-purple-500/20">Low</span>}
                              {idx === high && <span className="text-rose-400 bg-rose-500/10 px-1 rounded border border-rose-500/20 ml-1">High</span>}
                            </div>

                            {/* Node box */}
                            <div className={`w-10 h-12 flex items-center justify-center rounded-xl border text-sm font-bold transition-all duration-300 shadow-md ${
                              isFound 
                                ? 'bg-emerald-600 border-emerald-500 text-white scale-110 shadow-emerald-500/30'
                                : isMid
                                ? 'bg-blue-600 border-blue-400 text-white scale-115 shadow-blue-500/40 animate-pulse'
                                : isDimmed
                                ? 'bg-slate-900/30 border-slate-800 text-slate-600 opacity-30'
                                : inRange
                                ? 'bg-slate-850 border-slate-700 text-slate-200'
                                : 'bg-slate-800 border-slate-700 text-slate-300'
                            }`}>
                              {val}
                            </div>
                            <span className="text-[10px] text-slate-500">{idx}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Mid indicator detail */}
                    {mid !== null && (
                      <div className="text-xs text-blue-300/80 animate-fade-in">
                        mid = Math.floor(({low} + {high}) / 2) = <strong className="text-blue-400 text-sm">{mid}</strong>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* 2. BUBBLE SORT VISUALIZATION */}
              {selectedAlgoKey === 'bubble_sort' && (() => {
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
                                isActive 
                                  ? swapped 
                                    ? 'bg-amber-500 border-amber-400 shadow-amber-500/20' 
                                    : 'bg-blue-500 border-blue-400 shadow-blue-500/20'
                                  : isSorted 
                                  ? 'bg-emerald-600 border-emerald-500 shadow-emerald-500/10'
                                  : 'bg-slate-800 border-slate-700/80'
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
              })()}

              {/* 3. SLIDING WINDOW VISUALIZATION */}
              {selectedAlgoKey === 'sliding_window' && (() => {
                const arr = customInputs.sliding_window.arrayStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
                const windowRange = activeStep.windowRange;
                const { max_sum, window_sum, i } = activeStep.variables;

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
                              inWindow
                                ? 'bg-blue-600/20 border-blue-500 text-white scale-105 shadow-[0_0_12px_rgba(59,130,246,0.35)]'
                                : 'bg-slate-850 border-slate-800 text-slate-400 opacity-60'
                            }`}>
                              {val}
                            </div>
                            <span className="text-[9px] text-slate-500">{idx}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="text-[10px] text-slate-500">
                      Window Size: <span className="text-blue-400 font-semibold">{customInputs.sliding_window.k}</span>
                    </div>
                  </div>
                );
              })()}

              {/* 4. BST INSERTION VISUALIZATION */}
              {selectedAlgoKey === 'bst_insertion' && (() => {
                const treeCoordinates = getTreeCoordinates(activeStep.tree);
                const activeNodeId = activeStep.activeNodeId;
                const newNodeId = activeStep.newNodeId;

                return (
                  <div className="w-full h-[280px] overflow-hidden flex items-center justify-center relative">
                    {treeCoordinates.length === 0 ? (
                      <div className="text-slate-500 text-sm italic">BST is empty. Start insertion to view nodes.</div>
                    ) : (
                      <svg className="w-full h-full max-w-[480px] max-h-[260px]">
                        {/* Draw edge lines */}
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
                        {/* Draw node circles */}
                        {treeCoordinates.map((node) => {
                          const isActive = node.id === activeNodeId;
                          const isNew = node.id === newNodeId;

                          return (
                            <g key={`node-${node.id}`} className="transition-all duration-300 cursor-pointer">
                              <circle
                                cx={node.x}
                                cy={node.y}
                                r="16"
                                fill={isNew ? '#10b981' : isActive ? '#3b82f6' : '#1e293b'}
                                stroke={isNew ? '#34d399' : isActive ? '#60a5fa' : '#475569'}
                                strokeWidth="2"
                                className={`transition-all duration-300 ${isActive ? 'animate-pulse' : ''}`}
                              />
                              <text
                                x={node.x}
                                y={node.y + 4}
                                fill="#ffffff"
                                fontSize="11"
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
                );
              })()}

              {/* 5. DIJKSTRA VISUALIZATION */}
              {selectedAlgoKey === 'dijkstra' && (() => {
                const activeNode = activeStep.activeNode;
                const visitingNode = activeStep.visitingNode;
                const distances = activeStep.distances || {};
                const relaxedEdges = activeStep.relaxedEdges || [];

                return (
                  <div className="w-full h-[280px] flex items-center justify-center">
                    <svg className="w-full h-full max-w-[460px] max-h-[260px]">
                      {/* Edges */}
                      {dijkstraEdges.map((edge, idx) => {
                        const uCoords = dijkstraNodeCoords[edge.u];
                        const vCoords = dijkstraNodeCoords[edge.v];
                        const isRelaxed = relaxedEdges.some(
                          (e) => (e[0] === edge.u && e[1] === edge.v) || (e[0] === edge.v && e[1] === edge.u)
                        );

                        return (
                          <g key={`edge-${idx}`}>
                            <line
                              x1={uCoords.x}
                              y1={uCoords.y}
                              x2={vCoords.x}
                              y2={vCoords.y}
                              stroke={isRelaxed ? '#10b981' : '#334155'}
                              strokeWidth={isRelaxed ? '3.5' : '2'}
                              strokeDasharray={isRelaxed ? '4 2' : 'none'}
                              className="transition-all duration-300"
                            />
                            {/* Weight Text box */}
                            <rect
                              x={(uCoords.x + vCoords.x) / 2 - 8}
                              y={(uCoords.y + vCoords.y) / 2 - 8}
                              width="16"
                              height="16"
                              rx="4"
                              fill="#0f172a"
                              stroke="#334155"
                              strokeWidth="1"
                            />
                            <text
                              x={(uCoords.x + vCoords.x) / 2}
                              y={(uCoords.y + vCoords.y) / 2 + 4}
                              fill="#94a3b8"
                              fontSize="9"
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              {edge.w}
                            </text>
                          </g>
                        );
                      })}

                      {/* Nodes */}
                      {Object.keys(dijkstraNodeCoords).map((nodeName) => {
                        const coords = dijkstraNodeCoords[nodeName];
                        const isActive = nodeName === activeNode;
                        const isVisiting = nodeName === visitingNode;
                        
                        const distVal = distances[nodeName];
                        const distStr = distVal === Infinity ? '∞' : distVal;

                        return (
                          <g key={`node-${nodeName}`} className="transition-all duration-300">
                            {/* Outer Glow */}
                            <circle
                              cx={coords.x}
                              cy={coords.y}
                              r="18"
                              fill={isActive ? 'rgba(59,130,246,0.2)' : isVisiting ? 'rgba(16,185,129,0.2)' : 'transparent'}
                              className={`transition-all duration-300 ${isActive || isVisiting ? 'animate-ping' : ''}`}
                            />
                            {/* Base circle */}
                            <circle
                              cx={coords.x}
                              cy={coords.y}
                              r="15"
                              fill={isActive ? '#3b82f6' : isVisiting ? '#10b981' : '#1e293b'}
                              stroke={isActive ? '#60a5fa' : isVisiting ? '#34d399' : '#475569'}
                              strokeWidth="2"
                              className="transition-all duration-300"
                            />
                            <text
                              x={coords.x}
                              y={coords.y + 4}
                              fill="#ffffff"
                              fontSize="11"
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              {nodeName}
                            </text>
                            {/* Distance Badge */}
                            <rect
                              x={coords.x - 14}
                              y={coords.y - 32}
                              width="28"
                              height="12"
                              rx="3"
                              fill="#090d16"
                              stroke={isActive ? '#3b82f6' : '#1e293b'}
                              strokeWidth="1"
                            />
                            <text
                              x={coords.x}
                              y={coords.y - 23}
                              fill={distVal === 0 ? '#10b981' : distVal === Infinity ? '#64748b' : '#38bdf8'}
                              fontSize="8"
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              {distStr}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                );
              })()}

              {/* 6. LCS DP TABULATION VISUALIZATION */}
              {selectedAlgoKey === 'lcs_dp' && (() => {
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
                              <td className="w-8 h-8 border border-slate-800 bg-slate-900 font-bold text-purple-400">
                                {rIdx === 0 ? 'Ø' : text1[rIdx - 1]}
                              </td>
                              {row.map((val, cIdx) => {
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
                                    {val}
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

              {/* 7. N-QUEENS BACKTRACKING VISUALIZATION */}
              {selectedAlgoKey === 'n_queens' && (() => {
                const n = customInputs.n_queens.n;
                const board = activeStep.board || Array.from({ length: n }, () => Array(n).fill(false));
                const activeCell = activeStep.activeCell;
                const conflictCells = activeStep.conflictCells || [];
                const safeCells = activeStep.safeCells || [];

                return (
                  <div className="w-full flex flex-col items-center justify-center p-2">
                    <div 
                      className="grid gap-1 border-4 border-slate-800 rounded-xl bg-slate-900 p-2 shadow-2xl"
                      style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
                    >
                      {board.map((row, rIdx) => 
                        row.map((hasQueen, cIdx) => {
                          const isWhite = (rIdx + cIdx) % 2 === 0;
                          const isActive = activeCell && activeCell[0] === rIdx && activeCell[1] === cIdx;
                          
                          const isConflict = conflictCells.some(cell => cell[0] === rIdx && cell[1] === cIdx);
                          const isSafeCell = safeCells.some(cell => cell[0] === rIdx && cell[1] === cIdx);

                          return (
                            <div 
                              key={`${rIdx}-${cIdx}`}
                              className={`w-12 h-12 flex items-center justify-center rounded transition-all duration-300 text-xl font-bold shadow-sm relative ${
                                isSafeCell
                                  ? 'bg-emerald-600/80 border-2 border-emerald-400 text-white'
                                  : isConflict
                                  ? 'bg-rose-900/60 border-2 border-rose-500 text-rose-200'
                                  : isActive
                                  ? 'bg-blue-600 border-2 border-blue-400 text-white animate-pulse'
                                  : isWhite 
                                  ? 'bg-slate-750 border border-slate-800' 
                                  : 'bg-slate-800 border border-slate-850'
                              }`}
                            >
                              {hasQueen && (
                                <span className="z-10 text-amber-400 drop-shadow-md animate-bounce">👑</span>
                              )}
                              {!hasQueen && isActive && (
                                <span className="text-xs text-blue-300 animate-pulse">?</span>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })()}

            </div>
          </div>

          {/* LOWER NARRATIVE LOG / STATE INSPECTOR */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col backdrop-blur-md">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-blue-400" /> Explanation Log
            </h3>
            <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl min-h-[90px] flex items-center text-sm leading-relaxed text-slate-300 transition-all duration-300">
              {activeStep.explanation ? (
                <div className="flex gap-2.5 items-start">
                  <span className="text-blue-400 mt-1 font-bold">➔</span>
                  <span>{activeStep.explanation}</span>
                </div>
              ) : (
                <span className="text-slate-500 italic">No execution trace started. Click play.</span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CODE HIGH-LIGHTER & VARIABLES (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          
          {/* SYNCHRONIZED CODE VIEWER */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden flex flex-col backdrop-blur-md flex-1">
            <div className="bg-slate-900/80 border-b border-slate-800 px-4 py-3 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-indigo-400" /> Source Code
              </span>
              
              {/* Language toggler */}
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800/80">
                {['javascript', 'python', 'java', 'cpp'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-2 py-1 text-[10px] font-bold rounded capitalize transition-all ${
                      selectedLanguage === lang
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-500 hover:text-slate-350'
                    }`}
                  >
                    {lang === 'javascript' ? 'JS' : lang === 'cpp' ? 'C++' : lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Lines Display */}
            <div className="p-4 bg-slate-950/90 font-mono text-[11px] leading-6 overflow-y-auto max-h-[340px] flex-1 select-text">
              {algoDef.code[selectedLanguage].map((line, idx) => {
                const isHighlighted = highlightedLines.includes(idx);
                return (
                  <div 
                    key={idx}
                    className={`flex items-start -mx-4 px-4 transition-all duration-200 ${
                      isHighlighted 
                        ? 'bg-blue-900/40 border-l-[3px] border-blue-500 text-white font-bold' 
                        : 'text-slate-400'
                    }`}
                  >
                    <span className={`w-6 select-none inline-block text-right pr-2.5 text-[9px] ${
                      isHighlighted ? 'text-blue-400' : 'text-slate-600'
                    }`}>
                      {idx + 1}
                    </span>
                    <pre className="whitespace-pre overflow-x-auto flex-1 font-mono">{line}</pre>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DYNAMIC VARIABLES CARDS */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" /> State Variables
            </h3>
            
            <div className="bg-slate-950/70 border border-slate-850 p-3.5 rounded-xl font-mono text-[11px] space-y-2.5 max-h-[140px] overflow-y-auto">
              {Object.keys(activeStep.variables).length > 0 ? (
                Object.entries(activeStep.variables).map(([key, val]) => {
                  if (key === 'board' || key === 'dp') return null; // Avoid rendering raw structures
                  return (
                    <div key={key} className="flex justify-between border-b border-slate-900 pb-1.5">
                      <span className="text-slate-500 font-semibold">{key}:</span>
                      <span className="text-purple-300 font-bold">
                        {val === null ? 'null' : typeof val === 'object' ? JSON.stringify(val) : String(val)}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-slate-650 text-center py-2 italic">Variables uninitialized</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
