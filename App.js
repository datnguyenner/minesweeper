import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { createGrid, createEmptyBoard, Settings } from './Board'

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentGen: createGrid(Settings.rows, Settings.columns),
      emptyBoard: createEmptyBoard(Settings.rows, Settings.columns),
      visited: createEmptyBoard(Settings.rows, Settings.columns),
      flags: Settings.totalMines,
      isFlag: false,
      mines: 0
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

    let visited = this.state.visited[rowIndex][colIndex];
    let displayBoard = this.state.emptyBoard[rowIndex][colIndex];

    return (
      <TouchableOpacity style={[styles.square, { backgroundColor: alive === 'F' ? '#FF0000' : '#fff' }, visited && !displayBoard ? styles.visitedSquare : '']} onPress={() => this.clickCell(rowIndex, colIndex)} disabled={visited ? true : false}>
        <Text>{alive ? alive : ''}</Text>
      </TouchableOpacity>
    );

  }

  clickCell = (x, y) => {

    let board = [...this.state.currentGen];
    let displayBoard = [...this.state.emptyBoard];
    let { isFlag, flags, mines } = this.state;

    if (isFlag) {
      if (board[x][y] === -1) {
        mines++;
        if (mines === Settings.totalMines) {
          alert("Winner!");
        }
      }
      displayBoard[x][y] = "F";
      flags--;
      this.setState({ emptyBoard: displayBoard, flags, mines });
    } else if (board[x][y] === 0) {
      this.zeroClicked(x, y);
    } else if (board[x][y] === -1) {
      alert("You hit a mine! you lose");
    } else {
      displayBoard[x][y] = board[x][y];
      this.setState({ emptyBoard: displayBoard });
    }

  }

  zeroClicked = (x, y) => {

    let board = [...this.state.currentGen];
    let displayBoard = [...this.state.emptyBoard];
    let visited = [...this.state.visited];
    visited[x][y] = 1;

    let row = board.length, col = board[0].length;

    Settings.dirs.forEach(dir => {
      let newX = dir[0] + x;
      let newY = dir[1] + y;

      if (newX >= 0 && newX < row && newY < col && newY >= 0 && !visited[newX][newY]) {

        this.setState({ visited });

        if (board[newX][newY] > 0) {
          displayBoard[newX][newY] = board[newX][newY];
          visited[newX][newY] = 1;
          this.setState({ visited });
        } else {
          this.zeroClicked(newX, newY);
        }
      }

    });

    this.setState({ emptyBoard: displayBoard });
  }

  toggleIsFlag = () => {
    let { isFlag } = this.state;
    this.setState({ isFlag: !isFlag });
  }

  restartGame = () => {

    this.setState({
      currentGen: createGrid(Settings.rows, Settings.columns),
      emptyBoard: createEmptyBoard(Settings.rows, Settings.columns),
      visited: createEmptyBoard(Settings.rows, Settings.columns),
      flags: Settings.totalMines,
      isFlag: false,
      mines: 0
    });

  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          {this.renderBoard(this.state.emptyBoard)}
        </View>
        <TouchableOpacity onPress={this.toggleIsFlag}>
          <Text>Flag</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.restartGame}>
          <Text>Restart Game</Text>
        </TouchableOpacity>
      </View>
    );
  }
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
    justifyContent: 'space-evenly',
    width: 21,
    height: 22,
    borderColor: '#808080',
    borderWidth: 1,
  },
  visitedSquare: {
    borderWidth: 0,
    backgroundColor: '#808080'
  },
  row: {
    flexDirection: 'row',
  },
});