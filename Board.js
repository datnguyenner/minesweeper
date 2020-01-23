const dirs = [
    [1, -1],
    [1, 0],
    [1, 1],
    [0, -1],
    [0, 1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
];

const Settings = {
    dirs,
    rows: 10,
    columns: 10,
    totalMines: 10
}

const createEmptyBoard = (row, col) => {
    let x = 0;
    const grid = [];
    while (x++ < row) {
  
      const row = [];
      let y = 0;
      while (y++ < col) {
        row.push(0);
      }
  
      grid.push(row);
    }
    return grid;
  }

const createGrid = (row, col) => {

    const grid = createEmptyBoard(row, col);

    addMines(grid, row, col);
    addMineCount(grid, row, col);

    return grid;
}

const addMines = (grid, row, col) => {

    let mines = Settings.totalMines;
    while (mines > 0) {
        let x = Math.floor(Math.random() * row), y = Math.floor(Math.random() * col);
        if (!grid[x][y]) {
            grid[x][y] = -1;
            mines--;
        }
    }

}

const addMineCount = (grid, row, col) => {

    let x = 0;
    while (x < row) {
        let y = 0;
        while (y < col) {
            let mine = grid[x][y];
            if (mine !== -1) {
                let mines = countMines(grid, x, y);
                grid[x][y] = mines;
            }
            y++;
        }
        x++;
    }

}

const countMines = (grid, x, y) => {

    let sum = 0, row = grid.length, col = grid[0].length;

    dirs.forEach(dir => {
        let newX = dir[0] + x;
        let newY = dir[1] + y;

        if (newX >= 0 && newX < row && newY < col && newY >= 0 && grid[newX][newY] === -1) {
            sum += 1;
        }

    });

    return sum;
}

export { createGrid, createEmptyBoard, Settings }