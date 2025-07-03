"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

interface FileSystemItem {
  path: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileSystemItem[];
}

interface FileSystemContextType {
  fileSystem: FileSystemItem | null;
  createFile: (parentPath: string, name: string) => void;
  createFolder: (parentPath: string, name: string) => void;
  deleteItem: (path: string) => void;
  renameItem: (path: string, parentPath: string, newName: string) => void;
  updateFileContent: (path: string, content: string) => void;
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined);

export function useFileSystem() {
  const context = useContext(FileSystemContext);
  if (!context) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  return context;
}

export function FileSystemProvider({ children }: { children: React.ReactNode }) {
  const [fileSystem, setFileSystem] = useState<FileSystemItem>({
    path: '/',
    name: 'workspace',
    type: 'folder',
    children: [
      {
        path: '/src',
        name: 'src',
        type: 'folder',
        children: [
          {
            path: '/src/index.js',
            name: 'index.js',
            type: 'file',
            content: `// Welcome to JavaScript Development
console.log('Hello, World! 🌍');

// Function to greet users
function greetUser(name) {
  return \`Hello, \${name}! Welcome to coding! 🚀\`;
}

// Array of programming languages
const languages = ['JavaScript', 'Python', 'Java', 'C++', 'Go'];

// Display greeting
const userName = 'Developer';
console.log(greetUser(userName));

// Loop through languages
languages.forEach((lang, index) => {
  console.log(\`\${index + 1}. \${lang}\`);
});

// Modern JavaScript features
const asyncFunction = async () => {
  try {
    const response = await fetch('https://api.github.com');
    const data = await response.json();
    console.log('API Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Export for use in other modules
export { greetUser, languages, asyncFunction };
`
          },
          {
            path: '/src/styles.css',
            name: 'styles.css',
            type: 'file',
            content: `/* Modern CSS Styles */
:root {
  --primary-color: #007acc;
  --secondary-color: #f0f0f0;
  --text-color: #333;
  --background-color: #ffffff;
  --border-radius: 8px;
  --box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--background-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

h1, h2, h3 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

h1 {
  font-size: 2.5rem;
  font-weight: 300;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.5rem;
}

.button {
  background: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s ease;
}

.button:hover {
  background: #005a9e;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 122, 204, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
    margin: 1rem;
  }
  
  h1 {
    font-size: 2rem;
  }
}
`
          },
          {
            path: '/src/app.py',
            name: 'app.py',
            type: 'file',
            content: `#!/usr/bin/env python3
"""
Python Web Application Example
A simple Flask web application demonstrating Python best practices
"""

from flask import Flask, render_template, jsonify
import os
from datetime import datetime

# Initialize Flask application
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
app.config['DEBUG'] = True

# Sample data
users = [
    {'id': 1, 'name': 'Alice Johnson', 'email': 'alice@example.com'},
    {'id': 2, 'name': 'Bob Smith', 'email': 'bob@example.com'},
    {'id': 3, 'name': 'Charlie Brown', 'email': 'charlie@example.com'}
]

@app.route('/')
def home():
    """Home page route"""
    return render_template('index.html', 
                         title='Python Flask App',
                         current_time=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

@app.route('/api/users')
def get_users():
    """API endpoint to get all users"""
    return jsonify({
        'status': 'success',
        'data': users,
        'count': len(users)
    })

@app.route('/api/users/<int:user_id>')
def get_user(user_id):
    """API endpoint to get a specific user"""
    user = next((u for u in users if u['id'] == user_id), None)
    if user:
        return jsonify({'status': 'success', 'data': user})
    return jsonify({'status': 'error', 'message': 'User not found'}), 404

class UserManager:
    """Class to manage user operations"""
    
    def __init__(self):
        self.users = users
    
    def add_user(self, name, email):
        """Add a new user"""
        new_id = max(u['id'] for u in self.users) + 1
        new_user = {'id': new_id, 'name': name, 'email': email}
        self.users.append(new_user)
        return new_user
    
    def find_user_by_email(self, email):
        """Find user by email address"""
        return next((u for u in self.users if u['email'] == email), None)

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'status': 'error', 'message': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'status': 'error', 'message': 'Internal server error'}), 500

if __name__ == '__main__':
    print("🚀 Starting Python Flask Application...")
    print(f"📅 Started at: {datetime.now()}")
    app.run(host='0.0.0.0', port=5000, debug=True)
`
          },
          {
            path: '/src/Main.java',
            name: 'Main.java',
            type: 'file',
            content: `/**
 * Java Application Example
 * Demonstrates object-oriented programming concepts
 * @author Developer
 * @version 1.0
 */

import java.util.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Main {
    private static final String APP_NAME = "Java Demo Application";
    private static final String VERSION = "1.0.0";
    
    public static void main(String[] args) {
        System.out.println("🚀 " + APP_NAME + " v" + VERSION);
        System.out.println("📅 Started at: " + getCurrentTime());
        
        // Create and demonstrate user management
        UserManager userManager = new UserManager();
        demonstrateUserOperations(userManager);
        
        // Demonstrate collections and streams
        demonstrateCollections();
        
        // Demonstrate exception handling
        demonstrateExceptionHandling();
    }
    
    private static void demonstrateUserOperations(UserManager manager) {
        System.out.println("\\n👥 User Management Demo:");
        
        // Add users
        manager.addUser(new User("Alice Johnson", "alice@example.com", 28));
        manager.addUser(new User("Bob Smith", "bob@example.com", 32));
        manager.addUser(new User("Charlie Brown", "charlie@example.com", 25));
        
        // Display all users
        manager.displayAllUsers();
        
        // Find user by email
        User foundUser = manager.findUserByEmail("alice@example.com");
        if (foundUser != null) {
            System.out.println("🔍 Found user: " + foundUser.getName());
        }
    }
    
    private static void demonstrateCollections() {
        System.out.println("\\n📊 Collections Demo:");
        
        List<String> languages = Arrays.asList("Java", "Python", "JavaScript", "C++", "Go");
        
        // Using streams and lambda expressions
        languages.stream()
                .filter(lang -> lang.length() > 4)
                .map(String::toUpperCase)
                .sorted()
                .forEach(lang -> System.out.println("📝 " + lang));
    }
    
    private static void demonstrateExceptionHandling() {
        System.out.println("\\n⚠️ Exception Handling Demo:");
        
        try {
            int result = divideNumbers(10, 0);
            System.out.println("Result: " + result);
        } catch (ArithmeticException e) {
            System.out.println("❌ Error: " + e.getMessage());
        } finally {
            System.out.println("✅ Exception handling completed");
        }
    }
    
    private static int divideNumbers(int a, int b) throws ArithmeticException {
        if (b == 0) {
            throw new ArithmeticException("Division by zero is not allowed");
        }
        return a / b;
    }
    
    private static String getCurrentTime() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
}

/**
 * User class representing a user entity
 */
class User {
    private String name;
    private String email;
    private int age;
    
    public User(String name, String email, int age) {
        this.name = name;
        this.email = email;
        this.age = age;
    }
    
    // Getters
    public String getName() { return name; }
    public String getEmail() { return email; }
    public int getAge() { return age; }
    
    // Setters
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setAge(int age) { this.age = age; }
    
    @Override
    public String toString() {
        return String.format("User{name='%s', email='%s', age=%d}", name, email, age);
    }
}

/**
 * UserManager class for managing user operations
 */
class UserManager {
    private List<User> users;
    
    public UserManager() {
        this.users = new ArrayList<>();
    }
    
    public void addUser(User user) {
        users.add(user);
        System.out.println("✅ Added user: " + user.getName());
    }
    
    public User findUserByEmail(String email) {
        return users.stream()
                   .filter(user -> user.getEmail().equals(email))
                   .findFirst()
                   .orElse(null);
    }
    
    public void displayAllUsers() {
        System.out.println("📋 All Users:");
        users.forEach(user -> System.out.println("  " + user));
    }
    
    public int getUserCount() {
        return users.size();
    }
}
`
          },
          {
            path: '/src/main.cpp',
            name: 'main.cpp',
            type: 'file',
            content: `/**
 * C++ Application Example
 * Demonstrates modern C++ features and best practices
 * @author Developer
 * @version 1.0
 */

#include <iostream>
#include <vector>
#include <string>
#include <memory>
#include <algorithm>
#include <map>
#include <chrono>
#include <iomanip>

class User {
private:
    std::string name;
    std::string email;
    int age;

public:
    // Constructor
    User(const std::string& name, const std::string& email, int age)
        : name(name), email(email), age(age) {}
    
    // Getters
    const std::string& getName() const { return name; }
    const std::string& getEmail() const { return email; }
    int getAge() const { return age; }
    
    // Setters
    void setName(const std::string& newName) { name = newName; }
    void setEmail(const std::string& newEmail) { email = newEmail; }
    void setAge(int newAge) { age = newAge; }
    
    // Display user information
    void display() const {
        std::cout << "👤 " << name << " (" << email << ") - Age: " << age << std::endl;
    }
};

class UserManager {
private:
    std::vector<std::unique_ptr<User>> users;

public:
    // Add a new user
    void addUser(const std::string& name, const std::string& email, int age) {
        users.push_back(std::make_unique<User>(name, email, age));
        std::cout << "✅ Added user: " << name << std::endl;
    }
    
    // Find user by email
    User* findUserByEmail(const std::string& email) {
        auto it = std::find_if(users.begin(), users.end(),
            [&email](const std::unique_ptr<User>& user) {
                return user->getEmail() == email;
            });
        
        return (it != users.end()) ? it->get() : nullptr;
    }
    
    // Display all users
    void displayAllUsers() const {
        std::cout << "\\n📋 All Users:" << std::endl;
        for (const auto& user : users) {
            user->display();
        }
    }
    
    // Get user count
    size_t getUserCount() const {
        return users.size();
    }
    
    // Sort users by age
    void sortUsersByAge() {
        std::sort(users.begin(), users.end(),
            [](const std::unique_ptr<User>& a, const std::unique_ptr<User>& b) {
                return a->getAge() < b->getAge();
            });
        std::cout << "📊 Users sorted by age" << std::endl;
    }
};

// Function to demonstrate STL containers
void demonstrateSTL() {
    std::cout << "\\n📚 STL Containers Demo:" << std::endl;
    
    // Vector example
    std::vector<std::string> languages = {"C++", "Python", "Java", "JavaScript", "Go"};
    
    std::cout << "Programming Languages:" << std::endl;
    for (size_t i = 0; i < languages.size(); ++i) {
        std::cout << "  " << (i + 1) << ". " << languages[i] << std::endl;
    }
    
    // Map example
    std::map<std::string, int> languageYears = {
        {"C++", 1985},
        {"Python", 1991},
        {"Java", 1995},
        {"JavaScript", 1995},
        {"Go", 2009}
    };
    
    std::cout << "\\nLanguage Release Years:" << std::endl;
    for (const auto& pair : languageYears) {
        std::cout << "  " << pair.first << ": " << pair.second << std::endl;
    }
}

// Function to demonstrate modern C++ features
void demonstrateModernCpp() {
    std::cout << "\\n🚀 Modern C++ Features Demo:" << std::endl;
    
    // Lambda expressions
    auto greet = [](const std::string& name) {
        return "Hello, " + name + "! 👋";
    };
    
    std::cout << greet("C++ Developer") << std::endl;
    
    // Range-based for loop
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    std::cout << "Numbers: ";
    for (const auto& num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    // Auto keyword
    auto message = "This is automatically typed!";
    std::cout << "Auto message: " << message << std::endl;
}

// Function to get current timestamp
std::string getCurrentTime() {
    auto now = std::chrono::system_clock::now();
    auto time_t = std::chrono::system_clock::to_time_t(now);
    
    std::stringstream ss;
    ss << std::put_time(std::localtime(&time_t), "%Y-%m-%d %H:%M:%S");
    return ss.str();
}

int main() {
    std::cout << "🚀 C++ Demo Application v1.0" << std::endl;
    std::cout << "📅 Started at: " << getCurrentTime() << std::endl;
    
    // Create user manager and add users
    UserManager userManager;
    userManager.addUser("Alice Johnson", "alice@example.com", 28);
    userManager.addUser("Bob Smith", "bob@example.com", 32);
    userManager.addUser("Charlie Brown", "charlie@example.com", 25);
    
    // Display users
    userManager.displayAllUsers();
    
    // Sort users by age
    userManager.sortUsersByAge();
    userManager.displayAllUsers();
    
    // Find user by email
    User* foundUser = userManager.findUserByEmail("alice@example.com");
    if (foundUser) {
        std::cout << "\\n🔍 Found user: " << foundUser->getName() << std::endl;
    }
    
    // Demonstrate STL
    demonstrateSTL();
    
    // Demonstrate modern C++ features
    demonstrateModernCpp();
    
    std::cout << "\\n✅ Application completed successfully!" << std::endl;
    
    return 0;
}
`
          },
          {
            path: '/src/main.go',
            name: 'main.go',
            type: 'file',
            content: `// Go Application Example
// Demonstrates Go language features and best practices
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sort"
	"strconv"
	"time"
)

// User represents a user in our system
type User struct {
	ID    int    \`json:"id"\`
	Name  string \`json:"name"\`
	Email string \`json:"email"\`
	Age   int    \`json:"age"\`
}

// UserManager manages user operations
type UserManager struct {
	users []User
	nextID int
}

// NewUserManager creates a new UserManager instance
func NewUserManager() *UserManager {
	return &UserManager{
		users:  make([]User, 0),
		nextID: 1,
	}
}

// AddUser adds a new user to the manager
func (um *UserManager) AddUser(name, email string, age int) User {
	user := User{
		ID:    um.nextID,
		Name:  name,
		Email: email,
		Age:   age,
	}
	um.users = append(um.users, user)
	um.nextID++
	fmt.Printf("✅ Added user: %s\\n", name)
	return user
}

// GetAllUsers returns all users
func (um *UserManager) GetAllUsers() []User {
	return um.users
}

// FindUserByEmail finds a user by email address
func (um *UserManager) FindUserByEmail(email string) *User {
	for i := range um.users {
		if um.users[i].Email == email {
			return &um.users[i]
		}
	}
	return nil
}

// SortUsersByAge sorts users by age
func (um *UserManager) SortUsersByAge() {
	sort.Slice(um.users, func(i, j int) bool {
		return um.users[i].Age < um.users[j].Age
	})
	fmt.Println("📊 Users sorted by age")
}

// DisplayAllUsers prints all users
func (um *UserManager) DisplayAllUsers() {
	fmt.Println("\\n📋 All Users:")
	for _, user := range um.users {
		fmt.Printf("  👤 %s (%s) - Age: %d\\n", user.Name, user.Email, user.Age)
	}
}

// HTTP Handlers

// usersHandler handles requests to /api/users
func (um *UserManager) usersHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	switch r.Method {
	case http.MethodGet:
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status": "success",
			"data":   um.GetAllUsers(),
			"count":  len(um.users),
		})
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// userHandler handles requests to /api/users/{id}
func (um *UserManager) userHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	// Extract user ID from URL (simplified)
	idStr := r.URL.Path[len("/api/users/"):]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}
	
	// Find user by ID
	for _, user := range um.users {
		if user.ID == id {
			json.NewEncoder(w).Encode(map[string]interface{}{
				"status": "success",
				"data":   user,
			})
			return
		}
	}
	
	http.Error(w, "User not found", http.StatusNotFound)
}

// homeHandler handles requests to /
func homeHandler(w http.ResponseWriter, r *http.Request) {
	html := \`
<!DOCTYPE html>
<html>
<head>
    <title>Go Web Application</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 800px; margin: 0 auto; }
        .header { color: #007acc; border-bottom: 2px solid #007acc; padding-bottom: 10px; }
        .endpoint { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="header">🚀 Go Web Application</h1>
        <p>Welcome to the Go web server! Current time: <strong>%s</strong></p>
        
        <h2>Available Endpoints:</h2>
        <div class="endpoint">
            <strong>GET /api/users</strong> - Get all users
        </div>
        <div class="endpoint">
            <strong>GET /api/users/{id}</strong> - Get user by ID
        </div>
        
        <h2>Features Demonstrated:</h2>
        <ul>
            <li>✅ Structs and Methods</li>
            <li>✅ HTTP Server</li>
            <li>✅ JSON Handling</li>
            <li>✅ Goroutines and Channels</li>
            <li>✅ Error Handling</li>
            <li>✅ Package Management</li>
        </ul>
    </div>
</body>
</html>
\`
	fmt.Fprintf(w, html, time.Now().Format("2006-01-02 15:04:05"))
}

// demonstrateGoroutines shows goroutines and channels
func demonstrateGoroutines() {
	fmt.Println("\\n🔄 Goroutines and Channels Demo:")
	
	// Create a channel
	messages := make(chan string, 3)
	
	// Start goroutines
	go func() {
		messages <- "Hello from goroutine 1! 👋"
	}()
	
	go func() {
		messages <- "Hello from goroutine 2! 🚀"
	}()
	
	go func() {
		messages <- "Hello from goroutine 3! ⭐"
	}()
	
	// Receive messages
	for i := 0; i < 3; i++ {
		msg := <-messages
		fmt.Printf("  📨 %s\\n", msg)
	}
}

// demonstrateSlicesAndMaps shows Go's built-in data structures
func demonstrateSlicesAndMaps() {
	fmt.Println("\\n📊 Slices and Maps Demo:")
	
	// Slice example
	languages := []string{"Go", "Python", "JavaScript", "Rust", "TypeScript"}
	fmt.Println("Programming Languages:")
	for i, lang := range languages {
		fmt.Printf("  %d. %s\\n", i+1, lang)
	}
	
	// Map example
	languageYears := map[string]int{
		"Go":         2009,
		"Python":     1991,
		"JavaScript": 1995,
		"Rust":       2010,
		"TypeScript": 2012,
	}
	
	fmt.Println("\\nLanguage Release Years:")
	for lang, year := range languageYears {
		fmt.Printf("  %s: %d\\n", lang, year)
	}
}

func main() {
	fmt.Println("🚀 Go Demo Application v1.0")
	fmt.Printf("📅 Started at: %s\\n", time.Now().Format("2006-01-02 15:04:05"))
	
	// Create user manager and add sample users
	userManager := NewUserManager()
	userManager.AddUser("Alice Johnson", "alice@example.com", 28)
	userManager.AddUser("Bob Smith", "bob@example.com", 32)
	userManager.AddUser("Charlie Brown", "charlie@example.com", 25)
	
	// Display users
	userManager.DisplayAllUsers()
	
	// Sort users by age
	userManager.SortUsersByAge()
	userManager.DisplayAllUsers()
	
	// Find user by email
	foundUser := userManager.FindUserByEmail("alice@example.com")
	if foundUser != nil {
		fmt.Printf("\\n🔍 Found user: %s\\n", foundUser.Name)
	}
	
	// Demonstrate Go features
	demonstrateGoroutines()
	demonstrateSlicesAndMaps()
	
	// Setup HTTP routes
	http.HandleFunc("/", homeHandler)
	http.HandleFunc("/api/users", userManager.usersHandler)
	http.HandleFunc("/api/users/", userManager.userHandler)
	
	// Start server
	port := ":8080"
	fmt.Printf("\\n🌐 Starting HTTP server on port %s\\n", port)
	fmt.Println("📡 Visit http://localhost:8080 to see the web interface")
	
	log.Fatal(http.ListenAndServe(port, nil))
}
`
          }
        ]
      },
      {
        path: '/package.json',
        name: 'package.json',
        type: 'file',
        content: `{
  "name": "modern-development-workspace",
  "version": "1.0.0",
  "description": "A comprehensive development workspace with multiple programming languages",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "build": "webpack --mode production",
    "test": "jest",
    "lint": "eslint src/",
    "format": "prettier --write src/",
    "python": "python src/app.py",
    "java": "javac src/Main.java && java -cp src Main",
    "cpp": "g++ -o src/main src/main.cpp && ./src/main",
    "go": "go run src/main.go"
  },
  "dependencies": {
    "express": "^4.18.2",
    "lodash": "^4.17.21",
    "axios": "^1.6.0",
    "moment": "^2.29.4",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.4",
    "jest": "^29.7.0",
    "eslint": "^8.52.0",
    "prettier": "^3.0.3",
    "@babel/core": "^7.23.2",
    "@babel/preset-env": "^7.23.2"
  },
  "keywords": [
    "javascript",
    "nodejs",
    "python",
    "java",
    "cpp",
    "go",
    "development",
    "programming",
    "multi-language"
  ],
  "author": "Developer",
  "license": "MIT",
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/developer/modern-workspace.git"
  },
  "bugs": {
    "url": "https://github.com/developer/modern-workspace/issues"
  },
  "homepage": "https://github.com/developer/modern-workspace#readme"
}
`
      },
      {
        path: '/README.md',
        name: 'README.md',
        type: 'file',
        content: `# 🚀 Modern Development Workspace

Welcome to the **Modern Development Workspace** - a comprehensive environment showcasing multiple programming languages and modern development practices!

## 🌟 Features

This workspace demonstrates:

- ✨ **JavaScript/Node.js** - Modern ES6+ features and async programming
- 🐍 **Python** - Flask web application with clean architecture
- ☕ **Java** - Object-oriented programming with modern Java features
- ⚡ **C++** - Modern C++17 features and STL usage
- 🔥 **Go** - Concurrent programming and web services
- 🎨 **CSS** - Modern styling with CSS Grid and Flexbox
- 📦 **Package Management** - npm, pip, Maven, and Go modules

## 🛠️ Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v16+) and npm
- **Python** (v3.8+) and pip
- **Java** (JDK 11+)
- **GCC/G++** compiler
- **Go** (v1.19+)

### Installation

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/developer/modern-workspace.git
   cd modern-workspace
   \`\`\`

2. **Install JavaScript dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Install Python dependencies:**
   \`\`\`bash
   pip install flask requests
   \`\`\`

## 🚀 Running the Applications

### JavaScript/Node.js
\`\`\`bash
npm start          # Run the main application
npm run dev        # Run with nodemon for development
npm test           # Run tests
npm run lint       # Lint the code
\`\`\`

### Python
\`\`\`bash
npm run python     # Run the Flask application
# or
python src/app.py
\`\`\`

### Java
\`\`\`bash
npm run java       # Compile and run Java application
# or
javac src/Main.java && java -cp src Main
\`\`\`

### C++
\`\`\`bash
npm run cpp        # Compile and run C++ application
# or
g++ -o src/main src/main.cpp && ./src/main
\`\`\`

### Go
\`\`\`bash
npm run go         # Run Go application
# or
go run src/main.go
\`\`\`

## 📁 Project Structure

\`\`\`
workspace/
├── src/
│   ├── index.js      # JavaScript/Node.js main file
│   ├── styles.css    # Modern CSS styles
│   ├── app.py        # Python Flask application
│   ├── Main.java     # Java application
│   ├── main.cpp      # C++ application
│   └── main.go       # Go application
├── package.json      # Node.js dependencies and scripts
└── README.md         # This file
\`\`\`

## 🎯 What You'll Learn

### JavaScript Features
- ✅ ES6+ syntax (arrow functions, destructuring, modules)
- ✅ Async/await and Promises
- ✅ Modern array methods (map, filter, reduce)
- ✅ Template literals and string interpolation

### Python Features
- ✅ Flask web framework
- ✅ RESTful API design
- ✅ Object-oriented programming
- ✅ Error handling and logging

### Java Features
- ✅ Object-oriented design patterns
- ✅ Collections framework
- ✅ Lambda expressions and streams
- ✅ Exception handling

### C++ Features
- ✅ Modern C++17 features
- ✅ STL containers and algorithms
- ✅ Smart pointers and memory management
- ✅ Lambda expressions

### Go Features
- ✅ Goroutines and channels
- ✅ HTTP server and routing
- ✅ JSON handling
- ✅ Package management

## 🔧 Development Tools

This workspace includes configuration for:

- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **Jest** - JavaScript testing
- **Webpack** - Module bundling
- **Nodemon** - Development server

## 📚 Learning Resources

- [JavaScript MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Python Official Documentation](https://docs.python.org/3/)
- [Java Oracle Documentation](https://docs.oracle.com/en/java/)
- [C++ Reference](https://en.cppreference.com/)
- [Go Documentation](https://golang.org/doc/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to the open-source community for amazing tools and libraries
- Inspired by modern development practices and clean code principles
- Built with ❤️ for developers learning multiple programming languages

---

**Happy Coding! 🎉**

*This workspace is designed to help you explore and learn multiple programming languages in a single, organized environment.*
`
      },
      {
        path: '/.gitignore',
        name: '.gitignore',
        type: 'file',
        content: `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage
.grunt

# Bower dependency directory
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons
build/Release

# Dependency directories
jspm_packages/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test
.env.production

# parcel-bundler cache
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage

# Grunt intermediate storage
.grunt

# Compiled binary addons
build/Release

# Users Environment Variables
.lock-wscript

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Java
*.class
*.jar
*.war
*.ear
*.zip
*.tar.gz
*.rar
hs_err_pid*

# C++
*.exe
*.out
*.app
*.i*86
*.x86_64
*.hex
*.o
*.obj
*.so
*.dylib
*.dll

# Go
*.exe~
*.test
*.prof
vendor/
`
      },
      {
        path: '/tsconfig.json',
        name: 'tsconfig.json',
        type: 'file',
        content: `{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "src/**/*",
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": [
    "node_modules",
    "build",
    "dist"
  ]
}
`
      }
    ]
  });

  const findItem = useCallback((path: string, root: FileSystemItem = fileSystem): FileSystemItem | null => {
    if (root.path === path) return root;
    if (root.children) {
      for (const child of root.children) {
        const found = findItem(path, child);
        if (found) return found;
      }
    }
    return null;
  }, [fileSystem]);

  const createFile = useCallback((parentPath: string, name: string) => {
    setFileSystem(prev => {
      const newFileSystem = JSON.parse(JSON.stringify(prev));
      const parent = findItem(parentPath, newFileSystem);
      if (parent && parent.type === 'folder') {
        if (!parent.children) parent.children = [];
        const newPath = parentPath === '/' ? `/${name}` : `${parentPath}/${name}`;
        parent.children.push({
          path: newPath,
          name,
          type: 'file',
          content: ''
        });
      }
      return newFileSystem;
    });
  }, [findItem]);

  const createFolder = useCallback((parentPath: string, name: string) => {
    setFileSystem(prev => {
      const newFileSystem = JSON.parse(JSON.stringify(prev));
      const parent = findItem(parentPath, newFileSystem);
      if (parent && parent.type === 'folder') {
        if (!parent.children) parent.children = [];
        const newPath = parentPath === '/' ? `/${name}` : `${parentPath}/${name}`;
        parent.children.push({
          path: newPath,
          name,
          type: 'folder',
          children: []
        });
      }
      return newFileSystem;
    });
  }, [findItem]);

  const deleteItem = useCallback((path: string) => {
    setFileSystem(prev => {
      const newFileSystem = JSON.parse(JSON.stringify(prev));
      const pathParts = path.split('/').filter(p => p);
      const parentPath = pathParts.length > 1 ? '/' + pathParts.slice(0, -1).join('/') : '/';
      const parent = findItem(parentPath, newFileSystem);
      
      if (parent && parent.children) {
        parent.children = parent.children.filter(child => child.path !== path);
      }
      return newFileSystem;
    });
  }, [findItem]);

  const renameItem = useCallback((path: string, parentPath: string, newName: string) => {
    setFileSystem(prev => {
      const newFileSystem = JSON.parse(JSON.stringify(prev));
      const item = findItem(path, newFileSystem);
      if (item) {
        const newPath = parentPath === '/' ? `/${newName}` : `${parentPath}/${newName}`;
        item.name = newName;
        item.path = newPath;
      }
      return newFileSystem;
    });
  }, [findItem]);

  const updateFileContent = useCallback((path: string, content: string) => {
    setFileSystem(prev => {
      const newFileSystem = JSON.parse(JSON.stringify(prev));
      const file = findItem(path, newFileSystem);
      if (file && file.type === 'file') {
        file.content = content;
      }
      return newFileSystem;
    });
  }, [findItem]);

  return (
    <FileSystemContext.Provider
      value={{
        fileSystem,
        createFile,
        createFolder,
        deleteItem,
        renameItem,
        updateFileContent,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
}