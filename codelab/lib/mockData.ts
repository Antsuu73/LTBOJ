// lib/mockData.ts
export const MOCK_PROBLEMS = [
  {
    id: '1',
    title: 'Hello World',
    difficulty: 'Easy',
    category: 'Basics',
    description: `# Hello World

Viết chương trình in ra màn hình dòng chữ **"Hello, World!"**

Đây là bài đầu tiên dành cho những bạn mới bắt đầu học lập trình. Mục tiêu là làm quen với cú pháp cơ bản của ngôn ngữ lập trình.`,
    input_format: 'Không có input.',
    output_format: 'In ra một dòng: `Hello, World!`',
    constraints: '- Không có ràng buộc đặc biệt.',
    time_limit: 1000,
    memory_limit: 256,
    test_cases: [
      { id: '1', input: '', expected_output: 'Hello, World!', is_sample: true, order_index: 0 },
      { id: '2', input: '', expected_output: 'Hello, World!', is_sample: false, order_index: 1 },
    ],
    solved_count: 1024,
    author: 'Admin',
  },
  {
    id: '2',
    title: 'Sum of Two Numbers',
    difficulty: 'Easy',
    category: 'Math',
    description: `# Sum of Two Numbers

Cho hai số nguyên $a$ và $b$. Hãy tính tổng $a + b$.

## Ví dụ

Nếu $a = 3$ và $b = 5$, thì kết quả là $8$.

## Ghi chú

Đây là bài toán kinh điển để làm quen với việc đọc input và in output.`,
    input_format: 'Một dòng chứa hai số nguyên $a$ và $b$ $(1 \\le a, b \\le 10^9)$.',
    output_format: 'In ra một số nguyên duy nhất là tổng $a + b$.',
    constraints: `- $1 \\le a, b \\le 10^9$
- Các số nguyên dương`,
    time_limit: 1000,
    memory_limit: 256,
    test_cases: [
      { id: '1', input: '3 5', expected_output: '8', is_sample: true, order_index: 0 },
      { id: '2', input: '100 200', expected_output: '300', is_sample: true, order_index: 1 },
      { id: '3', input: '999999999 1', expected_output: '1000000000', is_sample: false, order_index: 2 },
      { id: '4', input: '1 1', expected_output: '2', is_sample: false, order_index: 3 },
    ],
    solved_count: 856,
    author: 'Admin',
  },
  {
    id: '3',
    title: 'FizzBuzz',
    difficulty: 'Easy',
    category: 'Basics',
    description: `# FizzBuzz

Cho số nguyên $n$. In ra các số từ $1$ đến $n$, nhưng:
- Nếu số chia hết cho **3**, in ra **"Fizz"**
- Nếu số chia hết cho **5**, in ra **"Buzz"**  
- Nếu số chia hết cho **cả 3 và 5**, in ra **"FizzBuzz"**
- Ngược lại, in ra chính số đó

Bài toán này là một trong những bài phỏng vấn phổ biến nhất!`,
    input_format: 'Một số nguyên $n$ $(1 \\le n \\le 100)$.',
    output_format: 'In ra $n$ dòng theo quy tắc trên.',
    constraints: `- $1 \\le n \\le 100$`,
    time_limit: 1000,
    memory_limit: 256,
    test_cases: [
      { id: '1', input: '15', expected_output: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz', is_sample: true, order_index: 0 },
      { id: '2', input: '5', expected_output: '1\n2\nFizz\n4\nBuzz', is_sample: false, order_index: 1 },
    ],
    solved_count: 743,
    author: 'Admin',
  },
  {
    id: '4',
    title: 'Fibonacci Sequence',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    description: `# Fibonacci Sequence

Dãy Fibonacci được định nghĩa như sau:
$$F(1) = 1, \\quad F(2) = 1, \\quad F(n) = F(n-1) + F(n-2) \\text{ với } n > 2$$

Cho $n$, hãy tính $F(n)$.

## Dãy Fibonacci đầu tiên

$$1, 1, 2, 3, 5, 8, 13, 21, 34, 55, \\ldots$$

## Lưu ý

Hãy dùng **Dynamic Programming** để tránh tính toán lặp lại, đảm bảo độ phức tạp $O(n)$.`,
    input_format: 'Một số nguyên $n$ $(1 \\le n \\le 50)$.',
    output_format: 'In ra số Fibonacci thứ $n$.',
    constraints: `- $1 \\le n \\le 50$
- Kết quả không vượt quá $10^{12}$`,
    time_limit: 1000,
    memory_limit: 256,
    test_cases: [
      { id: '1', input: '6', expected_output: '8', is_sample: true, order_index: 0 },
      { id: '2', input: '10', expected_output: '55', is_sample: true, order_index: 1 },
      { id: '3', input: '1', expected_output: '1', is_sample: false, order_index: 2 },
      { id: '4', input: '50', expected_output: '12586269025', is_sample: false, order_index: 3 },
    ],
    solved_count: 512,
    author: 'Admin',
  },
  {
    id: '5',
    title: 'Binary Search',
    difficulty: 'Medium',
    category: 'Algorithms',
    description: `# Binary Search

Cho một mảng $n$ phần tử đã được **sắp xếp tăng dần** và một số $x$. Hãy tìm vị trí (index, bắt đầu từ 1) của $x$ trong mảng.

## Thuật toán

Binary Search hoạt động bằng cách chia đôi khoảng tìm kiếm:
1. So sánh $x$ với phần tử giữa
2. Nếu bằng → trả về vị trí
3. Nếu $x$ nhỏ hơn → tìm ở nửa trái
4. Nếu $x$ lớn hơn → tìm ở nửa phải

Độ phức tạp: $O(\\log n)$`,
    input_format: `Dòng 1: Hai số nguyên $n$ và $x$ $(1 \\le n \\le 10^5,\\ 1 \\le x \\le 10^9)$.
Dòng 2: $n$ số nguyên đã sắp xếp tăng dần.`,
    output_format: 'In ra vị trí của $x$ trong mảng (bắt đầu từ 1), hoặc -1 nếu không tìm thấy.',
    constraints: `- $1 \\le n \\le 10^5$
- $1 \\le a_i \\le 10^9$
- Mảng đã được sắp xếp tăng dần`,
    time_limit: 1000,
    memory_limit: 256,
    test_cases: [
      { id: '1', input: '5 3\n1 2 3 4 5', expected_output: '3', is_sample: true, order_index: 0 },
      { id: '2', input: '5 6\n1 2 3 4 5', expected_output: '-1', is_sample: true, order_index: 1 },
      { id: '3', input: '1 1\n1', expected_output: '1', is_sample: false, order_index: 2 },
    ],
    solved_count: 321,
    author: 'Admin',
  },
  {
    id: '6',
    title: 'Longest Common Subsequence',
    difficulty: 'Hard',
    category: 'Dynamic Programming',
    description: `# Longest Common Subsequence (LCS)

Cho hai chuỗi $s$ và $t$. Tìm độ dài của **dãy con chung dài nhất** (LCS).

## Định nghĩa

Dãy con (subsequence) là dãy thu được bằng cách xóa một số phần tử (có thể không xóa) mà không thay đổi thứ tự các phần tử còn lại.

## Ví dụ

$s = $ "ABCBDAB", $t = $ "BDCABA"

LCS = "BCBA" hoặc "BDAB" → độ dài = **4**

## Công thức DP

$$dp[i][j] = \\begin{cases} dp[i-1][j-1] + 1 & \\text{nếu } s[i] = t[j] \\\\ \\max(dp[i-1][j], dp[i][j-1]) & \\text{ngược lại} \\end{cases}$$`,
    input_format: `Dòng 1: Chuỗi $s$ (độ dài $\\le 1000$).
Dòng 2: Chuỗi $t$ (độ dài $\\le 1000$).`,
    output_format: 'In ra một số nguyên là độ dài LCS.',
    constraints: `- Độ dài mỗi chuỗi $\\le 1000$
- Chỉ gồm chữ hoa tiếng Anh`,
    time_limit: 2000,
    memory_limit: 256,
    test_cases: [
      { id: '1', input: 'ABCBDAB\nBDCABA', expected_output: '4', is_sample: true, order_index: 0 },
      { id: '2', input: 'AGGTAB\nGXTXAYB', expected_output: '4', is_sample: true, order_index: 1 },
      { id: '3', input: 'ABC\nABC', expected_output: '3', is_sample: false, order_index: 2 },
    ],
    solved_count: 189,
    author: 'Admin',
  },
]

export const MOCK_POSTS = [
  {
    id: '1',
    title: 'Giới thiệu về Dynamic Programming - Từ cơ bản đến nâng cao',
    content: `# Dynamic Programming là gì?

**Dynamic Programming (DP)** là một kỹ thuật tối ưu hóa bằng cách chia bài toán lớn thành các bài toán con nhỏ hơn và lưu kết quả để tránh tính toán lặp lại.

## Hai đặc điểm chính

### 1. Optimal Substructure (Cấu trúc con tối ưu)
Bài toán lớn có thể được giải qua lời giải tối ưu của các bài toán con.

### 2. Overlapping Subproblems (Bài toán con lặp lại)
Các bài toán con được giải nhiều lần, nên cần **memoization** hoặc **tabulation**.

## Ví dụ: Fibonacci

\`\`\`python
# Cách naive - O(2^n)
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)

# DP - O(n)
def fib_dp(n):
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
\`\`\`

## Các bài DP kinh điển

1. **Knapsack Problem** - Tối ưu chọn vật phẩm
2. **LCS** - Dãy con chung dài nhất  
3. **Edit Distance** - Khoảng cách chỉnh sửa
4. **Matrix Chain Multiplication**

DP là một trong những kỹ năng quan trọng nhất trong lập trình thi đấu!`,
    author: 'CodeMaster',
    author_id: 'user1',
    tags: ['Dynamic Programming', 'Algorithms', 'Tutorial'],
    likes: 142,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    views: 1240,
  },
  {
    id: '2',
    title: 'STL trong C++ - Những container bạn phải biết',
    content: `# STL (Standard Template Library) trong C++

STL là thư viện chuẩn của C++ cung cấp các cấu trúc dữ liệu và thuật toán mạnh mẽ.

## Các Container quan trọng

### vector - Mảng động
\`\`\`cpp
#include <vector>
vector<int> v = {1, 2, 3};
v.push_back(4);    // Thêm cuối
v.pop_back();      // Xóa cuối
v.size();          // Kích thước
\`\`\`

### map - Từ điển (BST)
\`\`\`cpp
#include <map>
map<string, int> mp;
mp["alice"] = 1;
mp["bob"] = 2;
// Độ phức tạp: O(log n)
\`\`\`

### unordered_map - Hash map
\`\`\`cpp
#include <unordered_map>
unordered_map<string, int> ump;
// Độ phức tạp: O(1) trung bình
\`\`\`

### priority_queue - Heap
\`\`\`cpp
#include <queue>
priority_queue<int> pq;  // Max heap
priority_queue<int, vector<int>, greater<int>> minpq;  // Min heap
\`\`\`

## Thuật toán STL

\`\`\`cpp
sort(v.begin(), v.end());              // O(n log n)
binary_search(v.begin(), v.end(), x); // O(log n)
lower_bound(v.begin(), v.end(), x);   // Iterator đến phần tử >= x
\`\`\`

Nắm vững STL sẽ giúp bạn code nhanh hơn 3-5 lần trong thi đấu!`,
    author: 'CppWizard',
    author_id: 'user2',
    tags: ['C++', 'STL', 'Data Structures'],
    likes: 98,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    views: 876,
  },
  {
    id: '3',
    title: 'Time & Space Complexity - Hướng dẫn phân tích Big O',
    content: `# Big O Notation

Phân tích độ phức tạp là kỹ năng cơ bản giúp bạn đánh giá hiệu năng thuật toán.

## Các độ phức tạp thường gặp

| Ký hiệu | Tên | Ví dụ |
|---------|-----|-------|
| O(1) | Constant | Array access |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Linear scan |
| O(n log n) | Linearithmic | Merge sort |
| O(n²) | Quadratic | Bubble sort |
| O(2^n) | Exponential | Brute force subset |

## Quy tắc tính Big O

1. **Bỏ hằng số**: O(2n) → O(n)
2. **Lấy hạng cao nhất**: O(n² + n) → O(n²)
3. **Vòng lặp lồng nhau**: O(n) × O(n) = O(n²)

## Ước lượng thực tế

Với time limit **1 giây**, CPU thực hiện khoảng **10^8 operations**:
- n = 10^6 → cần O(n) hoặc O(n log n)
- n = 10^3 → chấp nhận O(n²)
- n = 20 → có thể O(2^n)`,
    author: 'AlgoAnalyst',
    author_id: 'user3',
    tags: ['Algorithms', 'Big O', 'Tutorial'],
    likes: 215,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    views: 2100,
  },
]
