import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styleSheet/styles.css';

const ROWS = 20;
const COLS = 40;
const START_NODE = [0, 0];
const END_NODE = [ROWS - 1, COLS - 1];

const createGrid = () => {
  const grid = [];
  for (let row = 0; row < ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < COLS; col++) {
      currentRow.push({
        row,
        col,
        isStart: row === START_NODE[0] && col === START_NODE[1],
        isEnd: row === END_NODE[0] && col === END_NODE[1],
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
      });
    }
    grid.push(currentRow);
  }
  return grid;
};

const Dijkstra = () => {
  const [grid, setGrid] = useState(createGrid());
  const [mousePressed, setMousePressed] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseUp = () => setMousePressed(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const handleMouseDown = (row, col) => {
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
    setMousePressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mousePressed) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  };

  const clearAll = () => {
    setGrid(createGrid());
    for(let row =0; row <ROWS; row++){
      for(let col =0; col < COLS; col++){
        document.getElementById(`grid-node-${row}-${col}`).className = 'grid-node';
      }
    }
    document.getElementById(`grid-node-${START_NODE[0]}-${START_NODE[1]}`).className = 'grid-node grid-node-start';
    document.getElementById(`grid-node-${END_NODE[0]}-${END_NODE[1]}`).className = 'grid-node grid-node-end';
  };

  const visualizeDijkstra = () => {
    const newGrid = [...grid];
    const startNode = newGrid[START_NODE[0]][START_NODE[1]];
    const endNode = newGrid[END_NODE[0]][END_NODE[1]];
    const visitedNodesInOrder = dijkstra(newGrid, startNode, endNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(endNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`grid-node-${node.row}-${node.col}`).className = 'grid-node grid-node-visited';
      }, 10 * i);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`grid-node-${node.row}-${node.col}`).className = 'grid-node grid-node-shortest-path';
      }, 50 * i);
    }
  };

  return (
    <div>
      <h1 className="head-name">Pathfinding Visualizer</h1>
      <div className="grid">
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="grid-row">
            {row.map((node, nodeIdx) => {
              const { row, col, isStart, isEnd, isWall } = node;
              const extraClassName = isStart
                ? 'grid-node-start'
                : isEnd
                ? 'grid-node-end'
                : isWall
                ? 'grid-node-wall'
                : '';
              return (
                <div
                  id={`grid-node-${row}-${col}`}
                  key={nodeIdx}
                  className={`grid-node ${extraClassName}`}
                  onMouseDown={() => handleMouseDown(row, col)}
                  onMouseEnter={() => handleMouseEnter(row, col)}
                ></div>
              );
            })}
          </div>
        ))}
      </div>
      <div className='controls'> 
        <button onClick={visualizeDijkstra}>Find Path</button>
        <button onClick={clearAll}>Clear</button>
        <button onClick={() => navigate('/')}>Home</button>
      </div>
    </div>
  );
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const dijkstra = (grid, startNode, endNode) => {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);

  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    if (closestNode.isWall) continue;
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === endNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid);
  }
};

const sortNodesByDistance = (unvisitedNodes) => {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
};

const updateUnvisitedNeighbors = (node, grid) => {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
};

const getUnvisitedNeighbors = (node, grid) => {
  const neighbors = [];
  const { row, col } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
};

const getAllNodes = (grid) => {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
};

const getNodesInShortestPathOrder = (endNode) => {
  const nodesInShortestPathOrder = [];
  let currentNode = endNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
};

export default Dijkstra;
