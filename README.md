# 🔢 DSA Visualizer

> Watch sorting algorithms think in real-time. A sleek, interactive visualizer for Bubble Sort, Merge Sort, and Quick Sort — built with vanilla HTML, CSS, and JavaScript.


---

## ✨ Features

- **3 Sorting Algorithms** — Bubble Sort, Merge Sort, Quick Sort
- **Color-coded animation states** — Comparing, Swapping, Sorted, Pivot, Merging
- **Live statistics** — Comparisons, swaps, and elapsed time tracked in real-time
- **Adjustable speed** — 0.5×, 1×, 2×, 5× playback speeds
- **Variable array size** — 10 to 100 elements
- **Completion modal** — Full run summary after sorting
- **Keyboard shortcuts** — `Space` to sort, `R` to reset, `N` for new array
- **Algorithm info panel** — Descriptions and Big-O complexity for each algorithm
- **Zero dependencies** — Pure vanilla JS, no frameworks, no bundlers

---

## 🎨 Tech Stack

| Layer | Tech |
|-------|------|
| Markup | HTML5 (Semantic) |
| Styling | CSS3 (Custom Properties, Grid, Flexbox, Animations) |
| Logic | Vanilla JavaScript (ES6+) |
| Fonts | Google Fonts (Syne + Space Mono) |

---

## 🚀 Getting Started

### Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/PrathamSaxena123/dsa-visualizer.git

# 2. Navigate into the project
cd dsa-visualizer

# 3. Open index.html in your browser
# Just double-click index.html OR use a local server:
npx serve .
```

No build step. No npm install. Just open and run.

---

## 📂 Project Structure

```
dsa-visualizer/
│
├── index.html          ← App shell and layout
├── css/
│   └── style.css       ← All styling (dark theme, animations)
├── js/
│   ├── bubble.js       ← Bubble Sort animation generator
│   ├── merge.js        ← Merge Sort animation generator
│   ├── quick.js        ← Quick Sort animation generator
│   └── main.js         ← App controller (state, rendering, events)
└── README.md
```

---

## 🧠 How It Works

Each sorting algorithm runs **completely** on the original array first, recording every comparison and swap as a "frame" in an animation queue. Then, the visualizer **replays** that queue with configurable delays — updating bar heights and colors to reflect each state.

This two-phase approach ensures:
- The animation speed slider works correctly (no re-sorting needed)
- Statistics are accurate
- The UI stays smooth and responsive

### Animation Frame Types

| Frame Type | Color | Meaning |
|---|---|---|
| `compare` | 🟡 Yellow | Two elements are being compared |
| `swap` | 🔴 Red | Two elements are being swapped |
| `sorted` | 🟢 Green | Element is in its final position |
| `pivot` | 🩷 Pink | Current pivot (Quick Sort) |
| `mergeplace` | 🔵 Blue | Element placed during merge |

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Start Sort |
| `R` | Reset current array |
| `N` | Generate new array |

---

## 📊 Algorithm Complexity

| Algorithm | Best | Average | Worst | Space |
|-----------|------|---------|-------|-------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |

---

## 📸 Screenshots

![alt text](<Screenshot (243).png>) 
![alt text](<Screenshot (244).png>) 
![alt text](<Screenshot (245).png>) 
![alt text](<Screenshot (246).png>)

---

## 🛣️ Roadmap

- [ ] Selection Sort
- [ ] Insertion Sort
- [ ] Heap Sort
- [ ] Audio feedback (sound tones per comparison)
- [ ] Side-by-side algorithm comparison mode
- [ ] Dark/Light theme toggle

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/heap-sort`
3. Commit: `git commit -m 'Add Heap Sort visualization'`
4. Push: `git push origin feature/heap-sort`
5. Open a Pull Request

---

## 📄 License

MIT © [Pratham Saxena](https://github.com/PrathamSaxena123)

---

<p align="center">Built with ❤️ using vanilla JavaScript</p>
