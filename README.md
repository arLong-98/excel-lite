# excel-lite 

The project features a simple *grid UI* inspired by **google sheets**.
I started working on this project so as to test my vanilla js, algorithms and problem tackling skills.

Tech Stack
- Javascript
- HTML5
- CSS

## Features 🚀
- Implemented a two way binding for grid cells. Created a data layer to represent the grid in memory and binding the ui with the data and vice-versa.
- Apply formulas on cells just like **excel**. 
- Implemented a **graph data structure** to work with *formula* evaluation on cells.
- Implemented a **cycle detection** algorithm for a *directed graph*.
- Implemented a **cycle trace** algorithm so the end user can trace the cause of a cycle in a sheet with multiple formulas.
- Implemented a **sheet management** script that allows us to *add* and *remove* sheets with synchronous storage.
- Download your sheet as a json file or upload a json file and use it as a sheet,
   implemented using **fileReader** webApi.
- Cut, copy and paste cell data alongwith style updates.

### Pending 🧑‍💻
- Mobile UI
- Input validations and error ui

### Problems faced/Learnings
- Creating a scrollable grid with a fixed address column and row - 🚀CSS Position, z-index and scroll.🧑‍💻
- Adding various properties such as bold, italics, font styles, background color etc for each cell and maintaining a data layer to keep the ui in sync.
- Took care of initial states when firing up the application.
- When implementing formula evaluation, adding simple formula such as (10 + 10) to a cell was easy. When adding a formula with dependency on other cells (1B = 1A + 2A), I was forced to look into parent-child relations of different cells that led me to maintain a Parent-child relation in my data layer as it allowed me to directly access child cells and update values. The two way binding of ui and data layer that I earlier created helped in achieving this efficiently.
- While working on  formula evaluation, I came across a 🪲stack overflow🪲 bug created by cyclic formulas. Created a matrix representaion of the grid cells in memory to deal with cycle detection. Resolved this by implementing a ✨DFS✨ based approach to find a cycle in directed graph.
