export class Astar {
  constructor (graph, startX, startY, onTick = null, onPath = null) {
    this.graph = graph;
    this.frontier = new Queue();
    this.frontier.add(startX, startY);
    this.cameFrom = {};
    this.cameFrom[startX + '|' + startY] = true;
    this.onTick = onTick;
    this.onPath = onPath;
  }

  run () {
    this.interval = setInterval(() => {

      this.doTick();

      if (this.frontier.empty) {
        clearInterval(this.interval);
        this.getPathTo(4, -2);
      }
    }, 40);
  }

  getPathTo (x, y) {
    let start = { x: 0, y: 0 };
    let current = { x: x, y: y };
    let path = [start];
    while (current && !(current.x === start.x && current.y === start.y)) {
      path.push(current);
      current = this.cameFrom[current.x + '|' + current.y] ? this.cameFrom[current.x + '|' + current.y] : false;
    }

    path.reverse();

    path.forEach(node => {
      if (this.onPath && typeof this.onPath === 'function') {
        this.onPath(node.x, node.y);
      }
    })

    console.log(this.cameFrom)
  }

  doTick () {
    let current = this.frontier.get();

    if (current) {
      let neighbours = this.getNeighbours(current.x, current.y);

      if (this.onTick && typeof this.onTick === 'function') {
        this.onTick(current.x, current.y);
      }

      neighbours.forEach(neighbour => {
        if (!this.cameFrom[neighbour.x + '|' + neighbour.y]) {
          this.frontier.add(neighbour.x, neighbour.y);
          this.cameFrom[neighbour.x + '|' + neighbour.y] = current;
        }
      });
    }
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