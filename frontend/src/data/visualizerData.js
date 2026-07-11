export const ALGORITHMS = {
  fibonacci: {
    name: "Fibonacci (Iterative)",
    category: "Fundamentals",
    description: "Computes the N-th Fibonacci number iteratively, storing intermediate results in an array. Visualizes building up terms from F(0) and F(1).",
    timeComplexity: { best: "O(1)", avg: "O(N)", worst: "O(N)" },
    spaceComplexity: "O(N)",
    defaultInput: {
      n: 6
    },
    code: {
      javascript: [
        "function fibonacci(n) {",
        "    if (n <= 1) return n;",
        "    let fib = [0, 1];",
        "    for (let i = 2; i <= n; i++) {",
        "        fib[i] = fib[i - 1] + fib[i - 2];",
        "    }",
        "    return fib[n];",
        "}"
      ],
      python: [
        "def fibonacci(n):",
        "    if n <= 1: return n",
        "    fib = [0, 1]",
        "    for i in range(2, n + 1):",
        "        fib.append(fib[i - 1] + fib[i - 2])",
        "    return fib[n]"
      ],
      java: [
        "int fibonacci(int n) {",
        "    if (n <= 1) return n;",
        "    int[] fib = new int[n + 1];",
        "    fib[0] = 0; fib[1] = 1;",
        "    for (int i = 2; i <= n; i++) {",
        "        fib[i] = fib[i - 1] + fib[i - 2];",
        "    }",
        "    return fib[n];",
        "}"
      ],
      cpp: [
        "int fibonacci(int n) {",
        "    if (n <= 1) return n;",
        "    vector<int> fib(n + 1);",
        "    fib[0] = 0; fib[1] = 1;",
        "    for (int i = 2; i <= n; i++) {",
        "        fib[i] = fib[i - 1] + fib[i - 2];",
        "    }",
        "    return fib[n];",
        "}"
      ]
    },
    stepMapping: {
      init: { javascript: [1, 2], python: [1, 2], java: [1, 2, 3], cpp: [1, 2, 3] },
      loop_start: { javascript: [3, 4], python: [3, 4], java: [4, 5], cpp: [4, 5] },
      calculate: { javascript: [5], python: [5], java: [6], cpp: [6] },
      completed: { javascript: [7], python: [6], java: [8], cpp: [8] }
    }
  },
  sliding_window: {
    name: "Sliding Window",
    category: "Arrays",
    description: "Calculates the maximum sum subarray of size K using a sliding window technique to optimize from O(N*K) brute-force to O(N) linear time.",
    timeComplexity: { best: "O(N)", avg: "O(N)", worst: "O(N)" },
    spaceComplexity: "O(1)",
    defaultInput: {
      array: [2, 1, 5, 1, 3, 2],
      k: 3
    },
    code: {
      javascript: [
        "function maxSubarraySum(arr, k) {",
        "    let n = arr.length;",
        "    let max_sum = 0, window_sum = 0;",
        "    for (let i = 0; i < k; i++) {",
        "        window_sum += arr[i];",
        "    }",
        "    max_sum = window_sum;",
        "    for (let i = k; i < n; i++) {",
        "        window_sum += arr[i] - arr[i - k];",
        "        if (window_sum > max_sum) {",
        "            max_sum = window_sum;",
        "        }",
        "    }",
        "    return max_sum;",
        "}"
      ],
      python: [
        "def max_subarray_sum(arr, k):",
        "    n = len(arr)",
        "    max_sum = 0",
        "    window_sum = 0",
        "    for i in range(k):",
        "        window_sum += arr[i]",
        "    max_sum = window_sum",
        "    for i in range(k, n):",
        "        window_sum += arr[i] - arr[i - k]",
        "        if window_sum > max_sum:",
        "            max_sum = window_sum",
        "    return max_sum"
      ],
      java: [
        "int maxSubarraySum(int[] arr, int k) {",
        "    int n = arr.length;",
        "    int max_sum = 0, window_sum = 0;",
        "    for (int i = 0; i < k; i++) {",
        "        window_sum += arr[i];",
        "    }",
        "    max_sum = window_sum;",
        "    for (int i = k; i < n; i++) {",
        "        window_sum += arr[i] - arr[i - k];",
        "        if (window_sum > max_sum) {",
        "            max_sum = window_sum;",
        "        }",
        "    }",
        "    return max_sum;",
        "}"
      ],
      cpp: [
        "int maxSubarraySum(vector<int>& arr, int k) {",
        "    int n = arr.size();",
        "    int max_sum = 0, window_sum = 0;",
        "    for (int i = 0; i < k; i++) {",
        "        window_sum += arr[i];",
        "    }",
        "    max_sum = window_sum;",
        "    for (int i = k; i < n; i++) {",
        "        window_sum += arr[i] - arr[i - k];",
        "        if (window_sum > max_sum) {",
        "            max_sum = window_sum;",
        "        }",
        "    }",
        "    return max_sum;",
        "}"
      ]
    },
    stepMapping: {
      init: { javascript: [1, 2], python: [1, 2, 3], java: [1, 2], cpp: [1, 2] },
      first_window: { javascript: [3, 4], python: [5, 6], java: [3, 4], cpp: [3, 4] },
      update_max: { javascript: [6], python: [7], java: [6], cpp: [6] },
      slide: { javascript: [7, 8], python: [8, 9], java: [7, 8], cpp: [7, 8] },
      no_update: { javascript: [9], python: [10], java: [9], cpp: [9] },
      completed: { javascript: [14], python: [12], java: [14], cpp: [14] }
    }
  },
  two_sum: {
    name: "Two Sum (Two Pointers)",
    category: "Arrays",
    description: "Finds two indices in a sorted array that sum up to a target value using two pointers scanning from left and right.",
    timeComplexity: { best: "O(1)", avg: "O(N)", worst: "O(N)" },
    spaceComplexity: "O(1)",
    defaultInput: {
      array: [1, 2, 4, 6, 8, 9, 14, 15],
      target: 13
    },
    code: {
      javascript: [
        "function twoSum(arr, target) {",
        "    let left = 0, right = arr.length - 1;",
        "    while (left < right) {",
        "        let sum = arr[left] + arr[right];",
        "        if (sum === target) {",
        "            return [left, right];",
        "        } else if (sum < target) {",
        "            left++; // Move left pointer right",
        "        } else {",
        "            right--; // Move right pointer left",
        "        }",
        "    }",
        "    return [-1, -1];",
        "}"
      ],
      python: [
        "def two_sum(arr, target):",
        "    left, right = 0, len(arr) - 1",
        "    while left < right:",
        "        curr_sum = arr[left] + arr[right]",
        "        if curr_sum == target:",
        "            return [left, right]",
        "        elif curr_sum < target:",
        "            left += 1",
        "        else:",
        "            right -= 1",
        "    return [-1, -1]"
      ],
      java: [
        "int[] twoSum(int[] arr, int target) {",
        "    int left = 0, right = arr.length - 1;",
        "    while (left < right) {",
        "        int sum = arr[left] + arr[right];",
        "        if (sum == target) {",
        "            return new int[]{left, right};",
        "        } else if (sum < target) {",
        "            left++;",
        "        } else {",
        "            right--;",
        "        }",
        "    }",
        "    return new int[]{-1, -1};",
        "}"
      ],
      cpp: [
        "pair<int, int> twoSum(vector<int>& arr, int target) {",
        "    int left = 0, right = arr.size() - 1;",
        "    while (left < right) {",
        "        int sum = arr[left] + arr[right];",
        "        if (sum == target) {",
        "            return {left, right};",
        "        } else if (sum < target) {",
        "            left++;",
        "        } else {",
        "            right--;",
        "        }",
        "    }",
        "    return {-1, -1};",
        "}"
      ]
    },
    stepMapping: {
      init: { javascript: [1], python: [1], java: [1], cpp: [1] },
      check_loop: { javascript: [2], python: [2], java: [2], cpp: [2] },
      calc_sum: { javascript: [3], python: [3], java: [3], cpp: [3] },
      compare_eq: { javascript: [4], python: [4], java: [4], cpp: [4] },
      found: { javascript: [5], python: [5], java: [5], cpp: [5] },
      compare_lt: { javascript: [6], python: [6], java: [6], cpp: [6] },
      move_left: { javascript: [7], python: [7], java: [7], cpp: [7] },
      move_right: { javascript: [9], python: [9], java: [9], cpp: [9] },
      not_found: { javascript: [12], python: [11], java: [12], cpp: [12] }
    }
  },
  reverse_linked_list: {
    name: "Reverse Linked List",
    category: "Linked Lists",
    description: "Reverses a singly linked list in-place by flipping the next pointers of nodes one-by-step.",
    timeComplexity: { best: "O(N)", avg: "O(N)", worst: "O(N)" },
    spaceComplexity: "O(1)",
    defaultInput: {
      array: [1, 2, 3, 4, 5]
    },
    code: {
      javascript: [
        "function reverseList(head) {",
        "    let prev = null, curr = head;",
        "    while (curr !== null) {",
        "        let next = curr.next; // Store next node",
        "        curr.next = prev;     // Reverse link",
        "        prev = curr;          // Move prev forward",
        "        curr = next;          // Move curr forward",
        "    }",
        "    return prev;",
        "}"
      ],
      python: [
        "def reverse_list(head):",
        "    prev, curr = None, head",
        "    while curr is not None:",
        "        nxt = curr.next  # Store next",
        "        curr.next = prev  # Reverse link",
        "        prev = curr  # Move prev",
        "        curr = nxt  # Move curr",
        "    return prev"
      ],
      java: [
        "ListNode reverseList(ListNode head) {",
        "    ListNode prev = null, curr = head;",
        "    while (curr != null) {",
        "        ListNode next = curr.next;",
        "        curr.next = prev;",
        "        prev = curr;",
        "        curr = next;",
        "    }",
        "    return prev;",
        "}"
      ],
      cpp: [
        "ListNode* reverseList(ListNode* head) {",
        "    ListNode* prev = nullptr; ListNode* curr = head;",
        "    while (curr != nullptr) {",
        "        ListNode* next = curr->next;",
        "        curr->next = prev;",
        "        prev = curr;",
        "        curr = next;",
        "    }",
        "    return prev;",
        "}"
      ]
    },
    stepMapping: {
      init: { javascript: [1], python: [1], java: [1], cpp: [1] },
      check_loop: { javascript: [2], python: [2], java: [2], cpp: [2] },
      save_next: { javascript: [3], python: [3], java: [3], cpp: [3] },
      flip_link: { javascript: [4], python: [4], java: [4], cpp: [4] },
      move_prev: { javascript: [5], python: [5], java: [5], cpp: [5] },
      move_curr: { javascript: [6], python: [6], java: [6], cpp: [6] },
      completed: { javascript: [8], python: [7], java: [8], cpp: [8] }
    }
  },
  stack_ops: {
    name: "Stack Operations",
    category: "Stacks & Queues",
    description: "Visualizes the Last-In-First-Out (LIFO) stack operations: Push (adding to the top) and Pop (removing from the top).",
    timeComplexity: { best: "O(1)", avg: "O(1)", worst: "O(1)" },
    spaceComplexity: "O(N)",
    defaultInput: {
      opsStr: "push 10, push 20, pop, push 30, pop, push 40"
    },
    code: {
      javascript: [
        "let stack = [];",
        "stack.push(val); // Add element to top",
        "let val = stack.pop(); // Remove element from top"
      ],
      python: [
        "stack = []",
        "stack.append(val)  # Push to top",
        "val = stack.pop()  # Pop from top"
      ],
      java: [
        "Stack<Integer> stack = new Stack<>();",
        "stack.push(val);",
        "int val = stack.pop();"
      ],
      cpp: [
        "stack<int> stack;",
        "stack.push(val);",
        "stack.pop();"
      ]
    },
    stepMapping: {
      push: { javascript: [1], python: [1], java: [1], cpp: [1] },
      pop: { javascript: [2], python: [2], java: [2], cpp: [2] },
      init: { javascript: [0], python: [0], java: [0], cpp: [0] }
    }
  },
  queue_ops: {
    name: "Queue Operations",
    category: "Stacks & Queues",
    description: "Visualizes First-In-First-Out (FIFO) queue operations: Enqueue (adding to the rear) and Dequeue (removing from the front).",
    timeComplexity: { best: "O(1)", avg: "O(1)", worst: "O(1)" },
    spaceComplexity: "O(N)",
    defaultInput: {
      opsStr: "enqueue 10, enqueue 20, dequeue, enqueue 30, dequeue, enqueue 40"
    },
    code: {
      javascript: [
        "let queue = [];",
        "queue.push(val); // Enqueue (add to rear)",
        "let val = queue.shift(); // Dequeue (remove from front)"
      ],
      python: [
        "from collections import deque",
        "queue = deque()",
        "queue.append(val)  # Enqueue",
        "val = queue.popleft()  # Dequeue"
      ],
      java: [
        "Queue<Integer> queue = new LinkedList<>();",
        "queue.add(val); // Enqueue",
        "int val = queue.poll(); // Dequeue"
      ],
      cpp: [
        "queue<int> queue;",
        "queue.push(val); // Enqueue",
        "queue.pop(); // Dequeue"
      ]
    },
    stepMapping: {
      enqueue: { javascript: [1], python: [2], java: [1], cpp: [1] },
      dequeue: { javascript: [2], python: [3], java: [2], cpp: [2] },
      init: { javascript: [0], python: [1], java: [0], cpp: [0] }
    }
  },
  binary_search: {
    name: "Binary Search",
    category: "Searching",
    description: "An efficient search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.",
    timeComplexity: { best: "O(1)", avg: "O(log N)", worst: "O(log N)" },
    spaceComplexity: "O(1)",
    defaultInput: {
      array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91],
      target: 23
    },
    code: {
      javascript: [
        "function binarySearch(arr, target) {",
        "    let low = 0;",
        "    let high = arr.length - 1;",
        "    while (low <= high) {",
        "        let mid = Math.floor((low + high) / 2);",
        "        if (arr[mid] === target) {",
        "            return mid; // Target found",
        "        } else if (arr[mid] < target) {",
        "            low = mid + 1; // Search right half",
        "        } else {",
        "            high = mid - 1; // Search left half",
        "        }",
        "    }",
        "    return -1; // Target not found",
        "}"
      ],
      python: [
        "def binary_search(arr, target):",
        "    low = 0",
        "    high = len(arr) - 1",
        "    while low <= high:",
        "        mid = (low + high) // 2",
        "        if arr[mid] == target:",
        "            return mid  # Target found",
        "        elif arr[mid] < target:",
        "            low = mid + 1  # Search right",
        "        else:",
        "            high = mid - 1  # Search left",
        "    return -1  # Target not found"
      ],
      java: [
        "int binarySearch(int[] arr, int target) {",
        "    int low = 0;",
        "    int high = arr.length - 1;",
        "    while (low <= high) {",
        "        int mid = low + (high - low) / 2;",
        "        if (arr[mid] == target) {",
        "            return mid; // Target found",
        "        } else if (arr[mid] < target) {",
        "            low = mid + 1; // Search right",
        "        } else {",
        "            high = mid - 1; // Search left",
        "        }",
        "    }",
        "    return -1; // Target not found",
        "}"
      ],
      cpp: [
        "int binarySearch(vector<int>& arr, int target) {",
        "    int low = 0;",
        "    int high = arr.size() - 1;",
        "    while (low <= high) {",
        "        int mid = low + (high - low) / 2;",
        "        if (arr[mid] == target) {",
        "            return mid; // Target found",
        "        } else if (arr[mid] < target) {",
        "            low = mid + 1; // Search right",
        "        } else {",
        "            high = mid - 1; // Search left",
        "        }",
        "    }",
        "    return -1; // Target not found",
        "}"
      ]
    },
    stepMapping: {
      init: { javascript: [1, 2], python: [1, 2], java: [1, 2], cpp: [1, 2] },
      loop_condition: { javascript: [3], python: [3], java: [3], cpp: [3] },
      mid_calc: { javascript: [4], python: [4], java: [4], cpp: [4] },
      compare_eq: { javascript: [5], python: [5], java: [5], cpp: [5] },
      found: { javascript: [6], python: [6], java: [6], cpp: [6] },
      compare_lt: { javascript: [7], python: [7], java: [7], cpp: [7] },
      update_low: { javascript: [8], python: [8], java: [8], cpp: [8] },
      update_high: { javascript: [10], python: [10], java: [10], cpp: [10] },
      not_found: { javascript: [13], python: [11], java: [13], cpp: [13] }
    }
  },
  linear_search: {
    name: "Linear Search",
    category: "Searching",
    description: "The simplest searching method that checks each element of the array sequentially from start to end until a match is found.",
    timeComplexity: { best: "O(1)", avg: "O(N)", worst: "O(N)" },
    spaceComplexity: "O(1)",
    defaultInput: {
      array: [12, 5, 8, 19, 23, 7, 14],
      target: 23
    },
    code: {
      javascript: [
        "function linearSearch(arr, target) {",
        "    let n = arr.length;",
        "    for (let i = 0; i < n; i++) {",
        "        if (arr[i] === target) {",
        "            return i; // Found target",
        "        }",
        "    }",
        "    return -1; // Target not found",
        "}"
      ],
      python: [
        "def linear_search(arr, target):",
        "    for i in range(len(arr)):",
        "        if arr[i] == target:",
        "            return i  # Found target",
        "    return -1  # Target not found"
      ],
      java: [
        "int linearSearch(int[] arr, int target) {",
        "    int n = arr.length;",
        "    for (int i = 0; i < n; i++) {",
        "        if (arr[i] == target) return i;",
        "    }",
        "    return -1;",
        "}"
      ],
      cpp: [
        "int linearSearch(vector<int>& arr, int target) {",
        "    for (int i = 0; i < arr.size(); i++) {",
        "        if (arr[i] == target) return i;",
        "    }",
        "    return -1;",
        "}"
      ]
    },
    stepMapping: {
      init: { javascript: [1], python: [0], java: [1], cpp: [0] },
      loop_check: { javascript: [2], python: [1], java: [2], cpp: [1] },
      compare: { javascript: [3], python: [2], java: [3], cpp: [2] },
      found: { javascript: [4], python: [3], java: [3], cpp: [2] },
      not_found: { javascript: [7], python: [4], java: [5], cpp: [4] }
    }
  },
  bubble_sort: {
    name: "Bubble Sort",
    category: "Sorting",
    description: "A simple sorting algorithm that repeatedly steps through the input list, compares adjacent elements, and swaps them if they are in the wrong order.",
    timeComplexity: { best: "O(N)", avg: "O(N²)", worst: "O(N²)" },
    spaceComplexity: "O(1)",
    defaultInput: {
      array: [38, 27, 43, 3, 9, 82, 10]
    },
    code: {
      javascript: [
        "function bubbleSort(arr) {",
        "    let n = arr.length;",
        "    for (let i = 0; i < n - 1; i++) {",
        "        let swapped = false;",
        "        for (let j = 0; j < n - i - 1; j++) {",
        "            if (arr[j] > arr[j + 1]) {",
        "                let temp = arr[j];",
        "                arr[j] = arr[j + 1];",
        "                arr[j + 1] = temp;",
        "                swapped = true;",
        "            }",
        "        }",
        "        if (!swapped) break; // Optimized exit",
        "    }",
        "    return arr;",
        "}"
      ],
      python: [
        "def bubble_sort(arr):",
        "    n = len(arr)",
        "    for i in range(n - 1):",
        "        swapped = False",
        "        for j in range(n - i - 1):",
        "            if arr[j] > arr[j + 1]:",
        "                arr[j], arr[j + 1] = arr[j + 1], arr[j]",
        "                swapped = True",
        "        if not swapped:",
        "            break  # Optimized exit",
        "    return arr"
      ],
      java: [
        "void bubbleSort(int[] arr) {",
        "    int n = arr.length;",
        "    for (int i = 0; i < n - 1; i++) {",
        "        boolean swapped = false;",
        "        for (int j = 0; j < n - i - 1; j++) {",
        "            if (arr[j] > arr[j + 1]) {",
        "                int temp = arr[j];",
        "                arr[j] = arr[j + 1];",
        "                arr[j + 1] = temp;",
        "                swapped = true;",
        "            }",
        "        }",
        "        if (!swapped) break; // Optimized exit",
        "    }",
        "}"
      ],
      cpp: [
        "void bubbleSort(vector<int>& arr) {",
        "    int n = arr.size();",
        "    for (int i = 0; i < n - 1; i++) {",
        "        bool swapped = false;",
        "        for (int j = 0; j < n - i - 1; j++) {",
        "            if (arr[j] > arr[j + 1]) {",
        "                swap(arr[j], arr[j + 1]);",
        "                swapped = true;",
        "            }",
        "        }",
        "        if (!swapped) break; // Optimized exit",
        "    }",
        "}"
      ]
    },
    stepMapping: {
      init: { javascript: [1], python: [1], java: [1], cpp: [1] },
      outer_loop: { javascript: [2, 3], python: [2, 3], java: [2, 3], cpp: [2, 3] },
      inner_loop: { javascript: [4], python: [4], java: [4], cpp: [4] },
      compare: { javascript: [5], python: [5], java: [5], cpp: [5] },
      swap: { javascript: [6, 7, 8, 9], python: [6, 7], java: [6, 7, 8, 9], cpp: [6, 7] },
      no_swap: { javascript: [5], python: [5], java: [5], cpp: [5] },
      sorted: { javascript: [14], python: [10], java: [13], cpp: [13] }
    }
  },
  quick_sort: {
    name: "Quick Sort",
    category: "Sorting",
    description: "An efficient, divide-and-conquer sorting algorithm that selects a 'pivot' and partitions the array such that left elements are smaller and right elements are larger.",
    timeComplexity: { best: "O(N log N)", avg: "O(N log N)", worst: "O(N²)" },
    spaceComplexity: "O(log N)",
    defaultInput: {
      array: [24, 9, 29, 14, 19, 27]
    },
    code: {
      javascript: [
        "function partition(arr, low, high) {",
        "    let pivot = arr[high]; // Select last element as pivot",
        "    let i = low - 1;",
        "    for (let j = low; j < high; j++) {",
        "        if (arr[j] < pivot) {",
        "            i++;",
        "            swap(arr, i, j);",
        "        }",
        "    }",
        "    swap(arr, i + 1, high);",
        "    return i + 1;",
        "}"
      ],
      python: [
        "def partition(arr, low, high):",
        "    pivot = arr[high]  # Pivot",
        "    i = low - 1",
        "    for j in range(low, high):",
        "        if arr[j] < pivot:",
        "            i += 1",
        "            arr[i], arr[j] = arr[j], arr[i]",
        "    arr[i + 1], arr[high] = arr[high], arr[i + 1]",
        "    return i + 1"
      ],
      java: [
        "int partition(int[] arr, int low, int high) {",
        "    int pivot = arr[high];",
        "    int i = low - 1;",
        "    for (int j = low; j < high; j++) {",
        "        if (arr[j] < pivot) {",
        "            i++;",
        "            int temp = arr[i];",
        "            arr[i] = arr[j]; arr[j] = temp;",
        "        }",
        "    }",
        "    int temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;",
        "    return i + 1;",
        "}"
      ],
      cpp: [
        "int partition(vector<int>& arr, int low, int high) {",
        "    int pivot = arr[high];",
        "    int i = low - 1;",
        "    for (int j = low; j < high; j++) {",
        "        if (arr[j] < pivot) {",
        "            i++;",
        "            swap(arr[i], arr[j]);",
        "        }",
        "    }",
        "    swap(arr[i + 1], arr[high]);",
        "    return i + 1;",
        "}"
      ]
    },
    stepMapping: {
      init: { javascript: [1, 2], python: [1, 2], java: [1, 2], cpp: [1, 2] },
      compare: { javascript: [4, 5], python: [4, 5], java: [4, 5], cpp: [4, 5] },
      swap_left: { javascript: [5, 6, 7], python: [5, 6], java: [5, 6, 7], cpp: [5, 6] },
      no_swap: { javascript: [4], python: [4], java: [4], cpp: [4] },
      swap_pivot: { javascript: [9], python: [7], java: [10], cpp: [9] },
      completed: { javascript: [10], python: [8], java: [11], cpp: [10] }
    }
  },
  bst_insertion: {
    name: "BST Insertion",
    category: "Trees",
    description: "Inserts keys into a Binary Search Tree (BST). BST property ensures that for each node, its left child is smaller and its right child is greater.",
    timeComplexity: { best: "O(log N)", avg: "O(log N)", worst: "O(N)" },
    spaceComplexity: "O(N)",
    defaultInput: {
      values: [15, 10, 20, 8, 12, 18, 25]
    },
    code: {
      javascript: [
        "class Node {",
        "    constructor(val) {",
        "        this.value = val;",
        "        this.left = null; this.right = null;",
        "    }",
        "}",
        "function insertBST(root, val) {",
        "    if (root === null) return new Node(val);",
        "    let curr = root;",
        "    while (true) {",
        "        if (val < curr.value) {",
        "            if (curr.left === null) {",
        "                curr.left = new Node(val);",
        "                break;",
        "            }",
        "            curr = curr.left;",
        "        } else {",
        "            if (curr.right === null) {",
        "                curr.right = new Node(val);",
        "                break;",
        "            }",
        "            curr = curr.right;",
        "        }",
        "    }",
        "    return root;",
        "}"
      ],
      python: [
        "class Node:",
        "    def __init__(self, val):",
        "        self.value = val",
        "        self.left = None; self.right = None",
        "",
        "def insert_bst(root, val):",
        "    if root is None:",
        "        return Node(val)",
        "    curr = root",
        "    while True:",
        "        if val < curr.value:",
        "            if curr.left is None:",
        "                curr.left = Node(val)",
        "                break",
        "            curr = curr.left",
        "        else:",
        "            if curr.right is None:",
        "                curr.right = Node(val)",
        "                break",
        "            curr = curr.right",
        "    return root"
      ],
      java: [
        "class Node {",
        "    int value;",
        "    Node left, right;",
        "    Node(int val) { value = val; }",
        "}",
        "Node insertBST(Node root, int val) {",
        "    if (root == null) return new Node(val);",
        "    Node curr = root;",
        "    while (true) {",
        "        if (val < curr.value) {",
        "            if (curr.left == null) {",
        "                curr.left = new Node(val);",
        "                break;",
        "            }",
        "            curr = curr.left;",
        "        } else {",
        "            if (curr.right == null) {",
        "                curr.right = new Node(val);",
        "                break;",
        "            }",
        "            curr = curr.right;",
        "        }",
        "    }",
        "    return root;",
        "}"
      ],
      cpp: [
        "struct Node {",
        "    int value;",
        "    Node* left = nullptr; Node* right = nullptr;",
        "    Node(int val) : value(val) {}",
        "};",
        "Node* insertBST(Node* root, int val) {",
        "    if (root == nullptr) return new Node(val);",
        "    Node* curr = root;",
        "    while (true) {",
        "        if (val < curr->value) {",
        "            if (curr->left == nullptr) {",
        "                curr->left = new Node(val);",
        "                break;",
        "            }",
        "            curr = curr->left;",
        "        } else {",
        "            if (curr->right == nullptr) {",
        "                curr->right = new Node(val);",
        "                break;",
        "            }",
        "            curr = curr->right;",
        "        }",
        "    }",
        "    return root;",
        "}"
      ]
    },
    stepMapping: {
      init_empty: { javascript: [6], python: [5], java: [5], cpp: [5] },
      insert_root: { javascript: [7], python: [6, 7], java: [6], cpp: [6] },
      start_search: { javascript: [8], python: [8], java: [7], cpp: [7] },
      compare: { javascript: [10], python: [10], java: [9], cpp: [9] },
      go_left_check: { javascript: [11], python: [11], java: [10], cpp: [10] },
      insert_left: { javascript: [12, 13], python: [12, 13], java: [11, 12], cpp: [11, 12] },
      go_left: { javascript: [15], python: [14], java: [14], cpp: [14] },
      go_right_check: { javascript: [17], python: [16], java: [16], cpp: [16] },
      insert_right: { javascript: [18, 19], python: [17, 18], java: [17, 18], cpp: [17, 18] },
      go_right: { javascript: [21], python: [20], java: [20], cpp: [20] },
      completed: { javascript: [24], python: [21], java: [23], cpp: [23] }
    }
  },
  bst_inorder: {
    name: "Inorder Traversal",
    category: "Trees",
    description: "Traverses a Binary Tree recursively in order (Left Subtree, Root, Right Subtree), yielding sorted keys for a Binary Search Tree.",
    timeComplexity: { best: "O(N)", avg: "O(N)", worst: "O(N)" },
    spaceComplexity: "O(N)",
    defaultInput: {
      values: [15, 10, 20, 8, 12, 18, 25]
    },
    code: {
      javascript: [
        "function inorder(node) {",
        "    if (node === null) return;",
        "    inorder(node.left);  // Traverse Left",
        "    visit(node.value);   // Visit Root",
        "    inorder(node.right); // Traverse Right",
        "}"
      ],
      python: [
        "def inorder(node):",
        "    if node is None: return",
        "    inorder(node.left)   # Traverse Left",
        "    visit(node.value)    # Visit Root",
        "    inorder(node.right)  # Traverse Right"
      ],
      java: [
        "void inorder(Node node) {",
        "    if (node == null) return;",
        "    inorder(node.left);",
        "    visit(node.value);",
        "    inorder(node.right);",
        "}"
      ],
      cpp: [
        "void inorder(Node* node) {",
        "    if (node == nullptr) return;",
        "    inorder(node->left);",
        "    visit(node->value);",
        "    inorder(node->right);",
        "}"
      ]
    },
    stepMapping: {
      call: { javascript: [0], python: [0], java: [0], cpp: [0] },
      null_check: { javascript: [1], python: [1], java: [1], cpp: [1] },
      left_recurse: { javascript: [2], python: [2], java: [2], cpp: [2] },
      visit: { javascript: [3], python: [3], java: [3], cpp: [3] },
      right_recurse: { javascript: [4], python: [4], java: [4], cpp: [4] }
    }
  },
  dijkstra: {
    name: "Dijkstra's Algorithm",
    category: "Graphs",
    description: "Computes the shortest path from a starting source node to all other nodes in a weighted graph with non-negative edge weights.",
    timeComplexity: { best: "O(V + E log V)", avg: "O(V + E log V)", worst: "O(V²)" },
    spaceComplexity: "O(V + E)",
    defaultInput: {
      startNode: "A"
    },
    code: {
      javascript: [
        "function dijkstra(graph, start) {",
        "    let dist = {}; let visited = new Set();",
        "    for (let node in graph) dist[node] = Infinity;",
        "    dist[start] = 0;",
        "    while (visited.size < Object.keys(graph).length) {",
        "        let curr = getMinDistanceNode(dist, visited);",
        "        if (curr === null) break;",
        "        visited.add(curr);",
        "        for (let neighbor in graph[curr]) {",
        "            let weight = graph[curr][neighbor];",
        "            let alt = dist[curr] + weight;",
        "            if (alt < dist[neighbor]) {",
        "                dist[neighbor] = alt; // Relax edge",
        "            }",
        "        }",
        "    }",
        "    return dist;",
        "}"
      ],
      python: [
        "def dijkstra(graph, start):",
        "    dist = {node: float('inf') for node in graph}",
        "    visited = set()",
        "    dist[start] = 0",
        "    while len(visited) < len(graph):",
        "        curr = min_dist_node(dist, visited)",
        "        if curr is None: break",
        "        visited.add(curr)",
        "        for neighbor, weight in graph[curr].items():",
        "            alt = dist[curr] + weight",
        "            if alt < dist[neighbor]:",
        "                dist[neighbor] = alt  # Relax edge",
        "    return dist"
      ],
      java: [
        "Map<String, Integer> dijkstra(Map<String, Map<String, Integer>> graph, String start) {",
        "    Map<String, Integer> dist = new HashMap<>();",
        "    Set<String> visited = new HashSet<>();",
        "    for (String node : graph.keySet()) dist.put(node, Integer.MAX_VALUE);",
        "    dist.put(start, 0);",
        "    while (visited.size() < graph.size()) {",
        "        String curr = getMinDistanceNode(dist, visited);",
        "        if (curr == null) break;",
        "        visited.add(curr);",
        "        for (String neighbor : graph.get(curr).keySet()) {",
        "            int weight = graph.get(curr).get(neighbor);",
        "            int alt = dist.get(curr) + weight;",
        "            if (alt < dist.get(neighbor)) {",
        "                dist.put(neighbor, alt); // Relax edge",
        "            }",
        "        }",
        "    }",
        "    return dist;",
        "}"
      ],
      cpp: [
        "unordered_map<string, int> dijkstra(unordered_map<string, unordered_map<string, int>>& graph, string start) {",
        "    unordered_map<string, int> dist;",
        "    unordered_set<string> visited;",
        "    for (auto& pair : graph) dist[pair.first] = INT_MAX;",
        "    dist[start] = 0;",
        "    while (visited.size() < graph.size()) {",
        "        string curr = getMinDistanceNode(dist, visited);",
        "        if (curr == \"\") break;",
        "        visited.insert(curr);",
        "        for (auto& edge : graph[curr]) {",
        "            string neighbor = edge.first;",
        "            int weight = edge.second;",
        "            int alt = dist[curr] + weight;",
        "            if (alt < dist[neighbor]) {",
        "                dist[neighbor] = alt; // Relax edge",
        "            }",
        "        }",
        "    }",
        "    return dist;",
        "}"
      ]
    },
    stepMapping: {
      init: { javascript: [1, 2, 3], python: [1, 2, 3], java: [1, 2, 3, 4], cpp: [1, 2, 3, 4] },
      select_min: { javascript: [4, 5, 6, 7], python: [4, 5, 6, 7], java: [5, 6, 7, 8], cpp: [5, 6, 7, 8] },
      check_neighbor: { javascript: [8, 9, 10, 11], python: [8, 9, 10], java: [9, 10, 11, 12], cpp: [9, 10, 11, 12] },
      relax_edge: { javascript: [12], python: [11], java: [13], cpp: [13] },
      no_relax: { javascript: [11], python: [10], java: [12], cpp: [12] },
      completed: { javascript: [16], python: [13], java: [17], cpp: [17] }
    }
  },
  graph_bfs: {
    name: "Breadth-First Search (BFS)",
    category: "Graphs",
    description: "Traverses a graph level-by-level starting from a source node, utilizing a Queue to visit neighbor nodes in FIFO order.",
    timeComplexity: { best: "O(V + E)", avg: "O(V + E)", worst: "O(V + E)" },
    spaceComplexity: "O(V)",
    defaultInput: {
      startNode: "A"
    },
    code: {
      javascript: [
        "function bfs(graph, start) {",
        "    let visited = new Set([start]);",
        "    let queue = [start];",
        "    while (queue.length > 0) {",
        "        let curr = queue.shift(); // Dequeue",
        "        visit(curr);",
        "        for (let neighbor of graph[curr]) {",
        "            if (!visited.has(neighbor)) {",
        "                visited.add(neighbor); // Mark visited",
        "                queue.push(neighbor);  // Enqueue",
        "            }",
        "        }",
        "    }",
        "}"
      ],
      python: [
        "def bfs(graph, start):",
        "    visited = {start}",
        "    queue = [start]",
        "    while queue:",
        "        curr = queue.pop(0)  # Dequeue",
        "        visit(curr)",
        "        for neighbor in graph[curr]:",
        "            if neighbor not in visited:",
        "                visited.add(neighbor)",
        "                queue.append(neighbor)  # Enqueue"
      ],
      java: [
        "void bfs(Map<String, List<String>> graph, String start) {",
        "    Set<String> visited = new HashSet<>();",
        "    Queue<String> queue = new LinkedList<>();",
        "    visited.add(start); queue.add(start);",
        "    while (!queue.isEmpty()) {",
        "        String curr = queue.poll();",
        "        visit(curr);",
        "        for (String neighbor : graph.get(curr)) {",
        "            if (!visited.contains(neighbor)) {",
        "                visited.add(neighbor);",
        "                queue.add(neighbor);",
        "            }",
        "        }",
        "    }",
        "}"
      ],
      cpp: [
        "void bfs(unordered_map<string, vector<string>>& graph, string start) {",
        "    unordered_set<string> visited = {start};",
        "    queue<string> q;",
        "    q.push(start);",
        "    while (!q.empty()) {",
        "        string curr = q.front(); q.pop();",
        "        visit(curr);",
        "        for (string neighbor : graph[curr]) {",
        "            if (visited.find(neighbor) == visited.end()) {",
        "                visited.insert(neighbor);",
        "                q.push(neighbor);",
        "            }",
        "        }",
        "    }",
        "}"
      ]
    },
    stepMapping: {
      init: { javascript: [1, 2], python: [1, 2], java: [1, 2, 3], cpp: [1, 2, 3] },
      check_queue: { javascript: [3], python: [3], java: [4], cpp: [4] },
      dequeue: { javascript: [4], python: [4], java: [5], cpp: [5] },
      visit: { javascript: [5], python: [5], java: [6], cpp: [6] },
      check_neighbor: { javascript: [6, 7], python: [6, 7], java: [7, 8], cpp: [7, 8] },
      enqueue: { javascript: [8, 9], python: [8, 9], java: [9, 10], cpp: [9, 10] },
      completed: { javascript: [13], python: [9], java: [14], cpp: [14] }
    }
  },
  lcs_dp: {
    name: "Longest Common Subsequence",
    category: "Dynamic Programming",
    description: "Solves the Longest Common Subsequence (LCS) problem using dynamic programming (tabulation) to find the length of the longest subsequence present in both strings.",
    timeComplexity: { best: "O(M * N)", avg: "O(M * N)", worst: "O(M * N)" },
    spaceComplexity: "O(M * N)",
    defaultInput: {
      text1: "STONE",
      text2: "LONGEST"
    },
    code: {
      javascript: [
        "function lcs(text1, text2) {",
        "    let m = text1.length, n = text2.length;",
        "    let dp = Array.from({length: m + 1}, () => Array(n + 1).fill(0));",
        "    for (let i = 1; i <= m; i++) {",
        "        for (let j = 1; j <= n; j++) {",
        "            if (text1[i - 1] === text2[j - 1]) {",
        "                dp[i][j] = dp[i - 1][j - 1] + 1; // Match",
        "            } else {",
        "                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); // Mismatch",
        "            }",
        "        }",
        "    }",
        "    return dp[m][n];",
        "}"
      ],
      python: [
        "def lcs(text1, text2):",
        "    m, n = len(text1), len(text2)",
        "    dp = [[0] * (n + 1) for _ in range(m + 1)]",
        "    for i in range(1, m + 1):",
        "        for j in range(1, n + 1):",
        "            if text1[i - 1] == text2[j - 1]:",
        "                dp[i][j] = dp[i - 1][j - 1] + 1  # Match",
        "            else:",
        "                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])  # Mismatch",
        "    return dp[m][n]"
      ],
      java: [
        "int lcs(String text1, String text2) {",
        "    int m = text1.length(), n = text2.length();",
        "    int[][] dp = new int[m + 1][n + 1];",
        "    for (int i = 1; i <= m; i++) {",
        "        for (int j = 1; j <= n; j++) {",
        "            if (text1.charAt(i - 1) == text2.charAt(j - 1)) {",
        "                dp[i][j] = dp[i - 1][j - 1] + 1;",
        "            } else {",
        "                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);",
        "            }",
        "        }",
        "    }",
        "    return dp[m][n];",
        "}"
      ],
      cpp: [
        "int lcs(string text1, string text2) {",
        "    int m = text1.length(), n = text2.length();",
        "    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));",
        "    for (int i = 1; i <= m; i++) {",
        "        for (int j = 1; j <= n; j++) {",
        "            if (text1[i - 1] == text2[j - 1]) {",
        "                dp[i][j] = dp[i - 1][j - 1] + 1;",
        "            } else {",
        "                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);",
        "            }",
        "        }",
        "    }",
        "    return dp[m][n];",
        "}"
      ]
    },
    stepMapping: {
      init: { javascript: [1, 2], python: [1, 2], java: [1, 2], cpp: [1, 2] },
      compare_match: { javascript: [3, 4, 5], python: [3, 4, 5], java: [3, 4, 5], cpp: [3, 4, 5] },
      fill_match: { javascript: [6], python: [6], java: [6], cpp: [6] },
      compare_mismatch: { javascript: [3, 4, 5], python: [3, 4, 5], java: [3, 4, 5], cpp: [3, 4, 5] },
      fill_mismatch: { javascript: [8], python: [8], java: [8], cpp: [8] },
      completed: { javascript: [12], python: [10], java: [12], cpp: [12] }
    }
  },
  knapsack_dp: {
    name: "0/1 Knapsack (DP)",
    category: "Dynamic Programming",
    description: "Computes the maximum value subset of items such that total weight does not exceed capacity W, using dynamic programming.",
    timeComplexity: { best: "O(N * W)", avg: "O(N * W)", worst: "O(N * W)" },
    spaceComplexity: "O(N * W)",
    defaultInput: {
      wtStr: "1, 2, 3",
      valStr: "60, 100, 120",
      capacity: 5
    },
    code: {
      javascript: [
        "function knapsack(W, wt, val, n) {",
        "    let dp = Array.from({length: n + 1}, () => Array(W + 1).fill(0));",
        "    for (let i = 1; i <= n; i++) {",
        "        for (let w = 1; w <= W; w++) {",
        "            if (wt[i - 1] <= w) {",
        "                dp[i][w] = Math.max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);",
        "            } else {",
        "                dp[i][w] = dp[i - 1][w];",
        "            }",
        "        }",
        "    }",
        "    return dp[n][W];",
        "}"
      ],
      python: [
        "def knapsack(W, wt, val, n):",
        "    dp = [[0] * (W + 1) for _ in range(n + 1)]",
        "    for i in range(1, n + 1):",
        "        for w in range(1, W + 1):",
        "            if wt[i - 1] <= w:",
        "                dp[i][w] = max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w])",
        "            else:",
        "                dp[i][w] = dp[i - 1][w]",
        "    return dp[n][W]"
      ],
      java: [
        "int knapsack(int W, int[] wt, int[] val, int n) {",
        "    int[][] dp = new int[n + 1][W + 1];",
        "    for (int i = 1; i <= n; i++) {",
        "        for (int w = 1; w <= W; w++) {",
        "            if (wt[i - 1] <= w) {",
        "                dp[i][w] = Math.max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);",
        "            } else {",
        "                dp[i][w] = dp[i - 1][w];",
        "            }",
        "        }",
        "    }",
        "    return dp[n][W];",
        "}"
      ],
      cpp: [
        "int knapsack(int W, vector<int>& wt, vector<int>& val, int n) {",
        "    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));",
        "    for (int i = 1; i <= n; i++) {",
        "        for (int w = 1; w <= W; w++) {",
        "            if (wt[i - 1] <= w) {",
        "                dp[i][w] = max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);",
        "            } else {",
        "                dp[i][w] = dp[i - 1][w];",
        "            }",
        "        }",
        "    }",
        "    return dp[n][W];",
        "}"
      ]
    },
    stepMapping: {
      init: { javascript: [1], python: [1], java: [1], cpp: [1] },
      check_fit: { javascript: [4], python: [4], java: [4], cpp: [4] },
      fill_take: { javascript: [5], python: [5], java: [5], cpp: [5] },
      fill_leave: { javascript: [7], python: [7], java: [7], cpp: [7] },
      completed: { javascript: [11], python: [8], java: [11], cpp: [11] }
    }
  },
  n_queens: {
    name: "N-Queens Backtracking",
    category: "Backtracking",
    description: "Places N queens on an N x N chessboard such that no two queens threaten each other. Highlights recursive path finding and backtracking.",
    timeComplexity: { best: "O(N!)", avg: "O(N!)", worst: "O(N!)" },
    spaceComplexity: "O(N²)",
    defaultInput: {
      n: 4
    },
    code: {
      javascript: [
        "function solveNQueens(n) {",
        "    let board = Array.from({length: n}, () => Array(n).fill('.'));",
        "    function isSafe(row, col) {",
        "        for (let i = 0; i < row; i++) if (board[i][col] === 'Q') return false;",
        "        for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) if (board[i][j] === 'Q') return false;",
        "        for (let i = row, j = col; i >= 0 && j < n; i--, j++) if (board[i][j] === 'Q') return false;",
        "        return true;",
        "    }",
        "    function backtrack(row) {",
        "        if (row === n) return true; // Solution found",
        "        for (let col = 0; col < n; col++) {",
        "            if (isSafe(row, col)) {",
        "                board[row][col] = 'Q'; // Place queen",
        "                if (backtrack(row + 1)) return true;",
        "                board[row][col] = '.'; // Backtrack",
        "            }",
        "        }",
        "        return false;",
        "    }",
        "    backtrack(0);",
        "    return board;",
        "}"
      ],
      python: [
        "def solve_n_queens(n):",
        "    board = [['.'] * n for _ in range(n)]",
        "    def is_safe(row, col):",
        "        for i in range(row):",
        "            if board[i][col] == 'Q': return False",
        "        for i, j in zip(range(row, -1, -1), range(col, -1, -1)):",
        "            if board[i][j] == 'Q': return False",
        "        for i, j in zip(range(row, -1, -1), range(col, n)):",
        "            if board[i][j] == 'Q': return False",
        "        return True",
        "",
        "    def backtrack(row):",
        "        if row == n: return True  # Solution found",
        "        for col in range(n):",
        "            if is_safe(row, col):",
        "                board[row][col] = 'Q'  # Place queen",
        "                if backtrack(row + 1): return True",
        "                board[row][col] = '.'  # Backtrack",
        "        return False",
        "",
        "    backtrack(0)",
        "    return board"
      ],
      java: [
        "class NQueens {",
        "    char[][] board;",
        "    int n;",
        "    boolean isSafe(int row, int col) {",
        "        for (int i = 0; i < row; i++) if (board[i][col] == 'Q') return false;",
        "        for (int i = row, j = col; i >= 0 && j >= 0; i--, j--) if (board[i][j] == 'Q') return false;",
        "        for (int i = row, j = col; i >= 0 && j < n; i--, j++) if (board[i][j] == 'Q') return false;",
        "        return true;",
        "    }",
        "    boolean backtrack(int row) {",
        "        if (row == n) return true; // Solution found",
        "        for (int col = 0; col < n; col++) {",
        "            if (isSafe(row, col)) {",
        "                board[row][col] = 'Q'; // Place queen",
        "                if (backtrack(row + 1)) return true;",
        "                board[row][col] = '.'; // Backtrack",
        "            }",
        "        }",
        "        return false;",
        "    }",
        "}"
      ],
      cpp: [
        "class NQueens {",
        "    vector<vector<char>> board;",
        "    int n;",
        "    bool isSafe(int row, int col) {",
        "        for (int i = 0; i < row; i++) if (board[i][col] == 'Q') return false;",
        "        for (int i = row, j = col; i >= 0 && j >= 0; i--, j--) if (board[i][j] == 'Q') return false;",
        "        for (int i = row, j = col; i >= 0 && j < n; i--, j++) if (board[i][j] == 'Q') return false;",
        "        return true;",
        "    }",
        "    bool backtrack(int row) {",
        "        if (row == n) return true; // Solution found",
        "        for (int col = 0; col < n; col++) {",
        "            if (isSafe(row, col)) {",
        "                board[row][col] = 'Q'; // Place queen",
        "                if (backtrack(row + 1)) return true;",
        "                board[row][col] = '.'; // Backtrack",
        "            }",
        "        }",
        "        return false;",
        "    }",
        "};"
      ]
    },
    stepMapping: {
      init: { javascript: [1], python: [1], java: [1, 2], cpp: [1, 2] },
      try_col: { javascript: [10], python: [13], java: [11], cpp: [11] },
      check_safe: { javascript: [2, 3, 4, 5, 6, 11], python: [2, 3, 4, 5, 6, 7, 8, 14], java: [3, 4, 5, 6, 12], cpp: [3, 4, 5, 6, 12] },
      place_queen: { javascript: [12], python: [15], java: [13], cpp: [13] },
      backtrack: { javascript: [14], python: [17], java: [15], cpp: [15] },
      found_solution: { javascript: [9], python: [12], java: [10], cpp: [10] },
      completed: { javascript: [19], python: [20], java: [19], cpp: [19] }
    }
  },
  single_number: {
    name: "Single Number (XOR)",
    category: "Bit Manipulation",
    description: "Given a non-empty array of integers where every element appears twice except for one, finds that unique single element using bitwise XOR operator in linear time and constant space.",
    timeComplexity: { best: "O(N)", avg: "O(N)", worst: "O(N)" },
    spaceComplexity: "O(1)",
    defaultInput: {
      array: [4, 1, 2, 1, 2]
    },
    code: {
      javascript: [
        "function singleNumber(nums) {",
        "    let result = 0;",
        "    for (let num of nums) {",
        "        result ^= num; // XOR operation",
        "    }",
        "    return result;",
        "}"
      ],
      python: [
        "def single_number(nums):",
        "    result = 0",
        "    for num in nums:",
        "        result ^= num  # XOR",
        "    return result"
      ],
      java: [
        "int singleNumber(int[] nums) {",
        "    int result = 0;",
        "    for (int num : nums) {",
        "        result ^= num;",
        "    }",
        "    return result;",
        "}"
      ],
      cpp: [
        "int singleNumber(vector<int>& nums) {",
        "    int result = 0;",
        "    for (int num : nums) {",
        "        result ^= num;",
        "    }",
        "    return result;",
        "}"
      ]
    },
    stepMapping: {
      init: { javascript: [1], python: [1], java: [1], cpp: [1] },
      loop_check: { javascript: [2], python: [2], java: [2], cpp: [2] },
      xor_op: { javascript: [3], python: [3], java: [3], cpp: [3] },
      completed: { javascript: [5], python: [4], java: [5], cpp: [5] }
    }
  },
  count_set_bits: {
    name: "Count Set Bits",
    category: "Bit Manipulation",
    description: "Counts the number of '1' bits in the binary representation of a positive integer (also known as Hamming Weight) using bitwise masking and shifting.",
    timeComplexity: { best: "O(1)", avg: "O(log N)", worst: "O(log N)" },
    spaceComplexity: "O(1)",
    defaultInput: {
      n: 13
    },
    code: {
      javascript: [
        "function countSetBits(n) {",
        "    let count = 0;",
        "    while (n > 0) {",
        "        count += (n & 1); // Check last bit",
        "        n = n >> 1;       // Right shift bitwise",
        "    }",
        "    return count;",
        "}"
      ],
      python: [
        "def count_set_bits(n):",
        "    count = 0",
        "    while n > 0:",
        "        count += (n & 1)  # Check last bit",
        "        n = n >> 1        # Right shift",
        "    return count"
      ],
      java: [
        "int countSetBits(int n) {",
        "    int count = 0;",
        "    while (n > 0) {",
        "        count += (n & 1);",
        "        n = n >> 1;",
        "    }",
        "    return count;",
        "}"
      ],
      cpp: [
        "int countSetBits(int n) {",
        "    int count = 0;",
        "    while (n > 0) {",
        "        count += (n & 1);",
        "        n = n >> 1;",
        "    }",
        "    return count;",
        "}"
      ]
    },
    stepMapping: {
      init: { javascript: [1], python: [1], java: [1], cpp: [1] },
      check_loop: { javascript: [2], python: [2], java: [2], cpp: [2] },
      check_bit: { javascript: [3], python: [3], java: [3], cpp: [3] },
      shift: { javascript: [4], python: [4], java: [4], cpp: [4] },
      completed: { javascript: [6], python: [5], java: [6], cpp: [6] }
    }
  }
};
