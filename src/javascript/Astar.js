import {FlatQueue} from './FlatQueue.js';

export class Astar extends EventTarget {
  constructor (options) {
    super();
    this.options = options;
    this.queue = new FlatQueue();
    this.graph = this.options.graph;
    this.start = this.findNode(...this.options.start);
    this.goal = this.findNode(...this.options.goal);
    this.queue.push(this.start, null);

    this.cameFrom = {};
    this.costSoFar = {};
    this.cameFrom[this.start] = null;
    this.costSoFar[this.start] = 0;
  }

  findNode (x, y) {
    return this.graph.find(node => node.x === x && node.y === y);
  }

  run () {
    let counter = 0;
    while (this.queue.length) {
      let current = this.queue.pop();

      if (current === this.goal) { break; }

      this.getNeighbours(current).forEach(neighbour => {
        let newCost = this.costSoFar[current] + this.getCost(current, neighbour);
        if (!this.costSoFar[neighbour] || newCost < this.costSoFar[neighbour]) {
          this.costSoFar[neighbour] = newCost;
          let priority = newCost + this.getHeuristic(neighbour);
          this.queue.push(neighbour, priority);
          this.cameFrom[neighbour] = current;
        }
      });
    }

    console.log(this.getPath())
    // this.dispatchEvent(new CustomEvent('test'));
  }

  getPath () {
    let current = this.goal;
    let path = [];

    while (current && current !== this.start) {
      path.push(current);
      current = this.cameFrom[current];
    }

    return path;
  }

  getCost (current, neighbour) {
    return 3;
  }

  getHeuristic (node) {
    return Math.abs(this.goal.x - node.x) + Math.abs(this.goal.y - node.y);
  }

  getNeighbours (current) {
    let neighbours = [
      (current.y - 1) + '|' + (current.x),
      (current.y) + '|' + (current.x - 1),
      (current.y + 1) + '|' + (current.x - 1),
      (current.y + 1) + '|' + (current.x),
      (current.y) + '|' + (current.x + 1),
      (current.y - 1) + '|' + (current.x + 1),
    ];

    return this.graph.filter(node => neighbours.includes(node.toString()));
  }
}

export class GraphNode {
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }

  toString () {
    return this.x + '|' + this.y;
  }
}