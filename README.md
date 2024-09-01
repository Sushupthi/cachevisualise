# Cache Visualization Project

## Overview

This project provides a web-based interactive tool for visualizing cache management policies, specifically Least Recently Used (LRU) and Least Frequently Used (LFU). The application allows users to perform basic cache operations, such as `GET`, `PUT`, and `DELETE`, and visually displays the cache content and frequency queue.

The project consists of:

- A C++ based cache implementation supporting LRU and LFU policies.
- An interactive webpage using HTML, CSS, and JavaScript to visualize cache operations and data.

## Features

- **Cache Operations**: Perform `GET`, `PUT`, and `DELETE` operations on the cache.
- **LRU Policy Visualization**: Displays cache items in the order of their recent use.
- **LFU Policy Visualization**: Displays cache items sorted by their access frequency, with the least frequently accessed items at the top.
- **Dynamic Updates**: The cache and frequency queue are updated in real-time based on user interactions.
