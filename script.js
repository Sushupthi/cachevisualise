class Cache {
  constructor(maxSize, policy) {
    this.maxSize = maxSize;
    this.policy = policy;
    this.cache = new Map();
    this.frequency = new Map();
  }

  get(key) {
    if (this.cache.has(key)) {
      this.updateFrequency(key);
      this.logOperation(`GET ${key}: Found`);
      this.render();
      return this.cache.get(key);
    }
    this.logOperation(`GET ${key}: Not Found`);
    return -1;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.set(key, value);
      this.updateFrequency(key);
    } else {
      if (this.cache.size >= this.maxSize) {
        this.evict();
      }
      this.cache.set(key, value);
      this.frequency.set(key, 1);
    }
    this.render();
    this.logOperation(`PUT ${key}: ${value}`);
  }

  delete(key) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
      this.frequency.delete(key);
      this.render();
      this.logOperation(`DELETE ${key}`);
    }
  }

  updateFrequency(key) {
    if (this.policy === "LRU") {
      const value = this.cache.get(key); // Get the current value of the key
      this.cache.delete(key); // Delete the key to remove its old position
      this.cache.set(key, value); // Reinsert the key-value pair to move it to the top
    } else if (this.policy === "LFU") {
      this.frequency.set(key, (this.frequency.get(key) || 0) + 1); // Increment frequency for LFU
      //this.cache.set(key,value);
    }
  }

  evict() {
    let evictedKey;
    if (this.policy === "LRU") {
      evictedKey = this.cache.keys().next().value;
    } else if (this.policy === "LFU") {
      let minFreq = Infinity;
      for (const [key, freq] of this.frequency) {
        if (freq < minFreq) {
          minFreq = freq;
          evictedKey = key;
        }
      }
    }
    this.cache.delete(evictedKey);
    this.frequency.delete(evictedKey);
    this.logOperation(`EVICT ${evictedKey}`);
  }

  render() {
    const cacheContainer = document.getElementById("cacheContainer");
    const frequencyContainer = document.getElementById("frequencyContainer");

    // Clear existing content in both containers
    cacheContainer.innerHTML = "";
    frequencyContainer.innerHTML = "";

    // Render based on eviction policy
    if (this.policy === "LRU") {
      // Display items in the order of their access for LRU
      this.cache.forEach((value, key) => {
        const item = document.createElement("div");
        item.className = "cache-item";
        item.textContent = `${key}: ${value}`;
        cacheContainer.appendChild(item);
      });
    } else if (this.policy === "LFU") {
      // Create an array from the cache to sort by frequency
      const cacheArray = Array.from(this.cache.entries());

      // Sort the array by frequency in ascending order
      cacheArray.sort((a, b) => {
        const freqA = this.frequency.get(a[0]) || 0;
        const freqB = this.frequency.get(b[0]) || 0;
        return freqA - freqB; // Ascending order: least frequent first
      });

      // Render sorted items based on frequency
      cacheArray.forEach(([key, value]) => {
        const item = document.createElement("div");
        item.className = "frequency-item";
        item.textContent = `${key}: ${value} (Freq: ${this.frequency.get(
          key
        )})`;
        frequencyContainer.appendChild(item);
      });
    }
  }

  logOperation(message) {
    const logList = document.getElementById("logList");
    const logItem = document.createElement("li");
    logItem.textContent = message;
    logList.appendChild(logItem);
  }
}

let cache = new Cache(5, "LRU");

function performOperation(operation) {
  const key = prompt("Enter key:");
  if (operation === "get") {
    cache.get(key);
  } else if (operation === "put") {
    const value = prompt("Enter value:");
    cache.put(key, value);
  } else if (operation === "delete") {
    cache.delete(key);
  }
}

function changePolicy(policy) {
  cache.policy = policy;
  cache.render();
}
