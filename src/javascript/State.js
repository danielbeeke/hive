export class State {
  constructor() {
    this.state = 'empty-board';

    this.transitions = {
      'empty-board': ['white-placed-queen', 'first-piece-queen'],
      'first-piece-plain': ['second-piece'],
    };
  }
}