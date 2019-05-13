export class Astar {
  constructor (graph, startX, startY, goalX, goalY, onTick = null, onPath = null, onBarrier = null) {
    this.graph = graph;
    this.frontier = new Queue();
    this.frontier.add(startX, startY);
    this.cameFrom = {};
    this.cameFrom[startX + '|' + startY] = true;
    this.costs = {};
    this.costs[startX + '|' + startY] = 0;
    this.onTick = onTick;
    this.onPath = onPath;
    this.start = { x: startX, y: startY };
    this.goal = { x: goalX, y: goalY };
    this.onBarrier = onBarrier;
    this.barriers = [
      {x: -3, y: 1},
      {x: -3, y: 2},
      {x: -3, y: 3},
    ];

    this.barriers.forEach(barrier => {
      if (this.onBarrier && typeof this.onBarrier === 'function') {
        this.onBarrier(barrier.x, barrier.y);
      }
    });

    if (this.onPath && typeof this.onPath === 'function') {
      this.onPath(this.start.x, this.start.y);
      this.onPath(this.goal.x, this.goal.y);
    }
  }

  run () {
    this.interval = setInterval(() => {

      this.doTick();

      if (this.frontier.empty) {
        this.finish();
      }
    }, 40);
  }

  finish () {
    clearInterval(this.interval);
    this.getPathTo(this.goal.x, this.goal.y);
  }

  getPathTo (x, y) {
    let current = { x: x, y: y };
    let path = [this.start];
    while (current && !(current.x === this.start.x && current.y === this.start.y)) {
      path.push(current);
      current = this.cameFrom[current.x + '|' + current.y] ? this.cameFrom[current.x + '|' + current.y] : false;
    }

    path.reverse();

    path.forEach(node => {
      if (this.onPath && typeof this.onPath === 'function') {
        this.onPath(node.x, node.y);
      }
    });
  }

  doTick () {
    let current = this.frontier.get();

    if (current) {

      if (this.goal.x === current.x && this.goal.y === current.y) {
        this.finish();
      }

      let neighbours = this.getNeighbours(current.x, current.y);

      if (this.onTick && typeof this.onTick === 'function') {
        this.onTick(current.x, current.y);
      }

      neighbours.forEach(neighbour => {

        let newCost = this.costs[current.x + '|' + current.y] + this.cost(current, neighbour);

        if (!this.cameFrom[neighbour.x + '|' + neighbour.y]) {
          this.frontier.add(neighbour.x, neighbour.y);
          this.cameFrom[neighbour.x + '|' + neighbour.y] = current;
        }
      });
    }
  }

  cost (current, next) {
    let isBarrier = (node) => this.barriers.find(barrier => barrier.x === node.x && barrier.y === node.y);
    let currentIsBarrier = isBarrier(current);
    let nextIsBarrier = isBarrier(next);

    if (nextIsBarrier && !currentIsBarrier) {
      return 3;
    }

    if (nextIsBarrier && currentIsBarrier) {
       return 2;
    }

    return 0;
  }

  getNeighbours (x, y) {
    let neighbours =  [
      {y: y - 1, x: x},
      {y: y, x: x - 1},
      {y: y + 1, x: x - 1},
      {y: y + 1, x: x},
      {y: y, x: x + 1},
      {y: y - 1, x: x + 1},
    ];

    return neighbours.filter(neighbour => {
      return this.graph.find(node => {
        return node.x === neighbour.x && node.y === neighbour.y;
      });
    });
  }
}

class Queue {
  constructor () {
    this.list = [];
  }
  add (x, y) {
    this.list.push({x: x, y: y});
  }

  get empty () {
    return this.list.length === 0;
  }

  get () {
    return this.list.shift();
  }
}