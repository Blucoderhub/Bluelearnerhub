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
  Sparkles
} from 'lucide-react'
import Header from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const topics = [
  { id: 'python', name: 'Python', lessons: ['Introduction', 'Variables', 'Data Types', 'Operators', 'Strings', 'Lists', 'Tuples', 'Dictionaries', 'Conditionals', 'Loops', 'Functions', 'Classes'] },
  { id: 'javascript', name: 'JavaScript', lessons: ['Introduction', 'Variables', 'Data Types', 'Operators', 'Strings', 'Arrays', 'Objects', 'Conditionals', 'Loops', 'Functions', 'DOM', 'Events'] },
  { id: 'data-structures', name: 'Data Structures', lessons: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees', 'Graphs', 'Hash Tables', 'Heaps'] },
  { id: 'algorithms', name: 'Algorithms', lessons: ['Sorting', 'Searching', 'Recursion', 'Dynamic Programming', 'Greedy', 'Graph Algorithms'] },
  { id: 'web-dev', name: 'Web Development', lessons: ['HTML Basics', 'CSS Basics', 'Flexbox', 'Grid', 'Responsive Design', 'JavaScript DOM'] },
  { id: 'ml', name: 'Machine Learning', lessons: ['Intro to ML', 'Linear Regression', 'Logistic Regression', 'Neural Networks', 'Scikit-learn'] }
]

const tutorialContent = {
  python: {
    Introduction: {
      title: 'Python Introduction',
      content: `Python is a popular programming language. It was created by Guido van Rossum, and released in 1991.

Python is used for:
- Web development (server-side)
- Software development
- Mathematics
- System scripting`,
      code: `print("Hello, World!")

# This is a comment
name = "BlueLearnerHub"
print(f"Welcome to {name}")`,
      tryIt: true
    },
    Variables: {
      title: 'Python Variables',
      content: `Variables are containers for storing data values. Python has no command for declaring a variable.

A variable is created the moment you first assign a value to it.`,
      code: `# Creating variables
x = 5
y = "John"
z = 3.14

# Print variables
print(x)
print(y)
print(z)

# Check types
print(type(x))  # <class 'int'>
print(type(y))  # <class 'str'>`,
      tryIt: true
    },
    Strings: {
      title: 'Python Strings',
      content: `Strings in Python are surrounded by either single or double quotation marks.

You can use triple quotes for multi-line strings.`,
      code: `# String examples
a = "Hello"
b = 'World'

# String methods
text = "  Hello, Python!  "
print(text.strip())    # Remove whitespace
print(text.upper())    # UPPERCASE
print(text.lower())    # lowercase
print(text.replace("Python", "World"))

# String slicing
msg = "BlueLearnerHub"
print(msg[0:4])    # Blue
print(msg[-4:])    # erHub`,
      tryIt: true
    },
    Lists: {
      title: 'Python Lists',
      content: `Lists are used to store multiple items in a single variable.

Lists are one of 4 built-in data types in Python used to store collections of data.`,
      code: `# Create a list
fruits = ["apple", "banana", "cherry"]

# Access items
print(fruits[0])   # apple

# Modify
fruits[0] = "orange"
fruits.append("mango")
fruits.remove("banana")

# Loop through list
for fruit in fruits:
    print(fruit)`,
      tryIt: true
    },
    Functions: {
      title: 'Python Functions',
      content: `A function is a block of code which only runs when it is called.

You can pass data, known as parameters, into a function.`,
      code: `# Define a function
def greet(name):
    return f"Hello, {name}!"

# Call function
message = greet("BlueLearnerHub")
print(message)

# Function with default parameter
def power(base, exponent=2):
    return base ** exponent

print(power(3))     # 9
print(power(3, 3))  # 27`,
      tryIt: true
    }
  },
  javascript: {
    Introduction: {
      title: 'JavaScript Introduction',
      content: `JavaScript is the world's most popular programming language.

JavaScript is the language of the Web. It is used to make websites interactive.`,
      code: `// Hello World
console.log("Hello, World!");

// Variables
let name = "BlueLearnerHub";
const PI = 3.14159;

console.log(\`Welcome to \${name}\`);`,
      tryIt: true
    },
    Variables: {
      title: 'JavaScript Variables',
      content: `JavaScript variables are containers for storing data values.

Use let for variables that can change, const for constants.`,
      code: `// Variable declarations
let age = 25;        // Can be reassigned
const name = "John"; // Cannot be reassigned

// Different data types
let num = 42;           // Number
let text = "Hello";     // String
let isActive = true;    // Boolean
let items = [1, 2, 3];  // Array
let person = {          // Object
  name: "John",
  age: 25
};`,
      tryIt: true
    },
    Arrays: {
      title: 'JavaScript Arrays',
      content: `JavaScript arrays are used to store multiple values in a single variable.

Array indexes are zero-based, meaning the first item is [0].`,
      code: `// Create an array
const fruits = ["apple", "banana", "cherry"];

// Access elements
console.log(fruits[0]);  // apple

// Add element
fruits.push("orange");

// Loop through array
fruits.forEach((fruit, index) => {
  console.log(index + ": " + fruit);
});

// Array methods
console.log(fruits.length);
console.log(fruits.sort());`,
      tryIt: true
    },
    Functions: {
      title: 'JavaScript Functions',
      content: `A JavaScript function is a block of code designed to perform a particular task.

A JavaScript function is executed when "something" invokes it (calls it).`,
      code: `// Function declaration
function greet(name) {
  return "Hello, " + name + "!";
}

// Arrow function
const add = (a, b) => a + b;

// Call functions
console.log(greet("World"));
console.log(add(5, 3));

// Function with default parameter
function power(base, exponent = 2) {
  return Math.pow(base, exponent);
}`,
      tryIt: true
    }
  },
  'data-structures': {
    Arrays: {
      title: 'Arrays Data Structure',
      content: `An array is a collection of elements stored at contiguous memory locations.

Arrays are the simplest and most widely used data structure.`,
      code: `// Array implementation in Python
class Array:
    def __init__(self, size):
        self.size = size
        self.array = [None] * size
    
    def get(self, index):
        if 0 <= index < self.size:
            return self.array[index]
        return "Index out of bounds"
    
    def set(self, index, value):
        if 0 <= index < self.size:
            self.array[index] = value
        else:
            print("Index out of bounds")

# Usage
arr = Array(5)
arr.set(0, 10)
arr.set(1, 20)
print(arr.get(0))  # 10`,
      tryIt: true
    },
    'Linked Lists': {
      title: 'Linked Lists',
      content: `A linked list is a linear data structure where elements are not stored at contiguous memory locations.

The elements in a linked list are linked using pointers.`,
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
        current = self.head
        while current:
            print(current.data, end -> )
            current = current.next
        print("None")

# Usage
ll = LinkedList()
ll.append(10)
ll.append(20)
ll.append(30)
ll.display()  # 10 -> 20 -> 30 -> None`,
      tryIt: true
    },
    Stacks: {
      title: 'Stacks',
      content: `A stack is a linear data structure which follows a particular order in which the operations are performed.

The order is LIFO (Last In First Out).`,
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
        return "Stack is empty"
    
    def is_empty(self):
        return len(self.items) == 0

# Usage
stack = Stack()
stack.push(10)
stack.push(20)
stack.push(30)
print(stack.pop())    # 30
print(stack.peek())   # 20`,
      tryIt: true
    }
  },
  algorithms: {
    Sorting: {
      title: 'Sorting Algorithms',
      content: `Sorting algorithms are used to arrange data in a particular order.

Common sorting algorithms include Bubble Sort, Quick Sort, Merge Sort, and Insertion Sort.`,
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
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

# Test
arr = [64, 34, 25, 12, 22, 11, 90]
print(quick_sort(arr))  # [11, 12, 22, 25, 34, 64, 90]`,
      tryIt: true
    },
    Searching: {
      title: 'Searching Algorithms',
      content: `Searching algorithms are used to find a target element in a collection.

Common searching algorithms include Linear Search and Binary Search.`,
      code: `# Linear Search
def linear_search(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i
    return -1

# Binary Search (sorted array)
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
print(binary_search(arr, 6))   # -1`,
      tryIt: true
    },
    Recursion: {
      title: 'Recursion',
      content: `Recursion is a method where the solution to a problem depends on solutions to smaller instances of the same problem.`,
      code: `# Factorial using recursion
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# Fibonacci using recursion
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Fibonacci with memoization
def fibonacci_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci_memo(n-1, memo) + fibonacci_memo(n-2, memo)
    return memo[n]

# Test
print(factorial(5))           # 120
print(fibonacci(10))          # 55
print(fibonacci_memo(50))    # 12586269025`,
      tryIt: true
    }
  },
  'web-dev': {
    'HTML Basics': {
      title: 'HTML Basics',
      content: `HTML (HyperText Markup Language) is the standard markup language for creating web pages.

HTML describes the structure of a web page.`,
      code: `<!DOCTYPE html>
<html>
<head>
    <title>My First Page</title>
</head>
<body>
    <h1>Welcome to BlueLearnerHub</h1>
    <p>This is my first webpage!</p>
    <a href="https://example.com">Click Here</a>
    <ul>
        <li>Item 1</li>
        <li>Item 2</li>
    </ul>
</body>
</html>`,
      tryIt: true
    },
    'CSS Basics': {
      title: 'CSS Basics',
      content: `CSS (Cascading Style Sheets) is used to style and layout web pages.

CSS can change fonts, colors, spacing, and much more.`,
      code: `/* Internal CSS */
<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f0f0f0;
    }
    
    h1 {
        color: #333;
        text-align: center;
    }
    
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }
    
    .btn {
        background-color: blue;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
    }
</style>`,
      tryIt: true
    },
    Flexbox: {
      title: 'CSS Flexbox',
      content: `Flexbox is a CSS layout module designed for one-dimensional layouts.

It excels at distributing space along a single axis.`,
      code: `/* Flexbox container */
.container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
}

/* Flex items */
.item {
    flex: 1;
}

/* Center alignment */
.center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

/* Responsive flex */
.responsive {
    display: flex;
    flex-wrap: wrap;
}

.responsive > * {
    flex: 1 1 300px;
}`,
      tryIt: true
    },
    Grid: {
      title: 'CSS Grid',
      content: `CSS Grid Layout is a two-dimensional layout system for the web.

It lets you lay out items in rows and columns.`,
      code: `/* Grid container */
.grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto;
    gap: 20px;
}

/* Spanning columns */
.card {
    grid-column: span 2;
}

/* Grid template areas */
.layout {
    display: grid;
    grid-template-areas:
        "header header"
        "sidebar main"
        "footer footer";
    grid-template-columns: 200px 1fr;
    grid-template-rows: auto 1fr auto;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }`,
      tryIt: true
    }
  },
  ml: {
    'Intro to ML': {
      title: 'Introduction to Machine Learning',
      content: `Machine Learning is a subset of artificial intelligence that enables systems to learn from data.

ML algorithms build models based on sample data to make predictions.`,
      code: `import numpy as np
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Load data
iris = load_iris()
X, y = iris.data, iris.target

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Predict
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"Accuracy: {accuracy:.2f}")`,
      tryIt: true
    },
    'Linear Regression': {
      title: 'Linear Regression',
      content: `Linear Regression is a supervised learning algorithm used for predicting continuous values.

It finds the relationship between independent and dependent variables.`,
      code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

# Sample data
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 5, 4, 5])

# Create and train model
model = LinearRegression()
model.fit(X, y)

# Predictions
y_pred = model.predict(X)

# Coefficients
print(f"Slope: {model.coef_[0]:.2f}")
print(f"Intercept: {model.intercept_:.2f}")

# Predict for new value
new_x = np.array([[6]])
print(f"Prediction for x=6: {model.predict(new_x)[0]:.2f}")`,
      tryIt: true
    }
  }
}

const sidebarTopics = [
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'javascript', name: 'JavaScript', icon: '📜' },
  { id: 'data-structures', name: 'Data Structures', icon: '📊' },
  { id: 'algorithms', name: 'Algorithms', icon: '⚡' },
  { id: 'web-dev', name: 'Web Development', icon: '🌐' },
  { id: 'ml', name: 'Machine Learning', icon: '🤖' }
]

export default function ComputerSciencePage() {
  const [selectedTopic, setSelectedTopic] = useState('python')
  const [selectedLesson, setSelectedLesson] = useState('Introduction')
  const [copied, setCopied] = useState(false)

  const currentContent = tutorialContent[selectedTopic as keyof typeof tutorialContent] as Record<string, any>
  const lessonData = currentContent?.[selectedLesson] as any

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
      
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-border bg-background overflow-y-auto">
          <div className="p-4">
            <Link href="/library" className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Library
            </Link>
            
            <h2 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Topics</h2>
            
            <nav className="space-y-1">
              {sidebarTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => {
                    setSelectedTopic(topic.id)
                    const firstLesson = topics.find(t => t.id === topic.id)?.lessons[0]
                    if (firstLesson) setSelectedLesson(firstLesson)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors text-left ${
                    selectedTopic === topic.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <span>{topic.icon}</span>
                  {topic.name}
                </button>
              ))}
            </nav>

            {/* Lessons sub-menu */}
            <div className="mt-6">
              <h3 className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {sidebarTopics.find(t => t.id === selectedTopic)?.name} Lessons
              </h3>
              <div className="space-y-0.5">
                {topics.find(t => t.id === selectedTopic)?.lessons.map((lesson) => (
                  <button
                    key={lesson}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      selectedLesson === lesson
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                  >
                    {lesson}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 min-h-[calc(100vh-4rem)] flex-1 p-8">
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                  <Code2 className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Computer Science</h1>
                  <p className="text-sm text-muted-foreground">{tutorialContent[selectedTopic as keyof typeof tutorialContent] ? Object.keys(tutorialContent[selectedTopic as keyof typeof tutorialContent]).length : 0} tutorials in {selectedTopic}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  Free
                </Badge>
                <Badge variant="outline">
                  <BookOpen className="h-3 w-3 mr-1" />
                  No Login
                </Badge>
              </div>
            </div>

            {/* Tutorial Content */}
            {lessonData ? (
              <motion.div
                key={`${selectedTopic}-${selectedLesson}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/50">
                  <CardContent className="p-8">
                    <h2 className="mb-4 text-2xl font-bold">{lessonData.title}</h2>
                    
                    <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
                      <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                        {lessonData.content}
                      </div>
                    </div>

                    {/* Code Example */}
                    <div className="relative rounded-xl bg-[#1e1e1e] overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 bg-[#2d2d2d] border-b border-[#3d3d3d]">
                        <span className="text-sm font-medium text-muted-foreground">Example</span>
                        <button
                          onClick={copyCode}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <pre className="p-4 overflow-x-auto">
                        <code className="text-sm font-mono text-foreground">
                          {lessonData.code}
                        </code>
                      </pre>
                    </div>

                    {/* Try It Button */}
                    {lessonData.tryIt && (
                      <div className="mt-6 flex items-center justify-between">
                        <Button className="gap-2">
                          <Play className="h-4 w-4" />
                          Try it Yourself
                        </Button>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Free to use
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Navigation */}
                <div className="mt-6 flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => {
                      const currentLessons = topics.find(t => t.id === selectedTopic)?.lessons || []
                      const currentIndex = currentLessons.indexOf(selectedLesson)
                      if (currentIndex > 0) {
                        setSelectedLesson(currentLessons[currentIndex - 1])
                      }
                    }}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <Button 
                    className="gap-2"
                    onClick={() => {
                      const currentLessons = topics.find(t => t.id === selectedTopic)?.lessons || []
                      const currentIndex = currentLessons.indexOf(selectedLesson)
                      if (currentIndex < currentLessons.length - 1) {
                        setSelectedLesson(currentLessons[currentIndex + 1])
                      }
                    }}
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <Card className="border-border/50">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Select a topic to start learning</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
