export class Astar {
  constructor (graph, startX, startY) {
    this.graph = graph;
    this.frontier = new Queue();
    this.frontier.add(startX, startY);
    this.visited = {};
    this.visited[startX + '|' + startY] = true;
  }

  run () {
    while (!this.frontier.empty) {
      let current = this.frontier.get();

      if (current) {
        let neighbours = this.getNeighbours(current.x, current.y);

        neighbours.forEach(neighbour => {
          if (!this.visited[neighbour.x + '|' + neighbour.y]) {
            this.frontier.add(neighbour.x, neighbour.y);
            this.visited[current.x + '|' + current.y] = true;
          }
        });
      }
    }

    console.log(this.visited)
  }
  
  getNeighbours (x, y) {
    let neighbours =  [
      {y: y - 1, x: x},
      {y: y + 1, x: x},
      {y: y, x: x - 1},
      {y: y, x: x + 1},
      {y: y + 1, x: x - 1},
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