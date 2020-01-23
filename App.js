import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentGen: createGrid(14, 18),
      emptyBoard: createEmptyBoard(14, 18),
      visited: createEmptyBoard(14, 18),
      setIntervalId: null
    }
  }

  renderBoard = (grid) => {

    const rows = grid.map((row, rowIndex) => {
      return (
        <View key={rowIndex} style={styles.row}>
          {this.renderColumns(row, rowIndex)}
        </View>)
    });
  
    return rows;
  }
  
  renderColumns = (row, rowIndex) => {
  
    const columns = row.map((col, colIndex) => {
      return (
        <View key={colIndex}>
          {this.cell(col, rowIndex, colIndex)}
        </View>
      );
    })
  
    return columns;
  }

  cell = (alive, rowIndex, colIndex) => {

    return (
      <TouchableOpacity style={[styles.square, { backgroundColor: alive === -1 ? '#FF0000' : '#fff' }]} onPress={()=>this.zeroClicked(rowIndex, colIndex)}>
        <Text>{alive}</Text>
      </TouchableOpacity>
    );
  
  }

  zeroClicked = (x, y) => {

    let board = [...this.state.currentGen];
    let displayBoard = [...this.state.emptyBoard];
    let visited = [...this.state.visited];
    visited[x][y] = 1;
  
    let row = board.length, col = board[0].length;
  
    dirs.forEach(dir => {
      let newX = dir[0] + x;
      let newY = dir[1] + y;
  
      if(newX >= 0 && newX < row && newY < col && newY >= 0 && !visited[newX][newY]) {
  
        this.setState({visited});
        
        if(board[newX][newY] > 0) {
          displayBoard[newX][newY] = board[newX][newY];
        }else{
          this.zeroClicked(newX, newY);
        }
      }
  
    });
  
    this.setState({emptyBoard: displayBoard});    
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          {this.renderBoard(this.state.emptyBoard)}
        </View>
        <TouchableOpacity onPress={this.startGameOfLife}>
          <Text>Start Game of Life</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.endGameOfLife}>
          <Text>End game of life and start a new Generation</Text>
        </TouchableOpacity>
      </View>
    );
  }
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  square: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    width: 21,
    height: 22,
    borderColor: '#000000'
  },
  row: {
    flexDirection: 'row',
  },
});

const createGrid = (row, col) => {
  
  const grid = createEmptyBoard(row, col);
  
  addMines(grid);
  addMineCount(grid);

  return grid;
}

const addMines = (grid) => {

  let mines = 40;
  while (mines > 0) {
    let x = Math.floor(Math.random() * 14), y = Math.floor(Math.random() * 18);
    if (!grid[x][y]) {
      grid[x][y] = -1;
      mines--;
    }
  }

}

const addMineCount = (grid) => {

  let x = 0, row = grid.length, col = grid[0].length;
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

    if(newX >= 0 && newX < row && newY < col && newY >= 0 && grid[newX][newY] === -1) {
      sum += 1;
    }

  });

  return sum;
}

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