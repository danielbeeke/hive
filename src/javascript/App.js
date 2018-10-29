import './oneTransitionEnd.js';

import './insects/Highlight.js';
import './insects/Ant.js';
import './insects/Beetle.js';
import './insects/Grasshopper.js';
import './insects/Ladybug.js';
import './insects/Mosquito.js';
import './insects/Pillbug.js';
import './insects/Queen.js';
import './insects/Spider.js';

import './HiveBoard.js';
import './HivePlayerDeck.js';
import './Snapshot.js';

import { Helpers } from './Helpers.js';

let json = {"a":{"column":1,"row":0},"b":{"column":-2,"row":0},"grid":[{"column":-1,"row":0},{"column":0,"row":1},{"column":1,"row":-1},{"column":-2,"row":1},{"column":-2,"row":2},{"column":0,"row":-2},{"column":1,"row":-2},{"column":-2,"row":3},{"column":-1,"row":-2},{"column":1,"row":1},{"column":-3,"row":-1},{"column":-2,"row":-2},{"column":-3,"row":0},{"column":1,"row":3},{"column":0,"row":4},{"column":-1,"row":4},{"column":-3,"row":1},{"column":-2,"row":4},{"column":2,"row":0},{"column":2,"row":-1},{"column":2,"row":2},{"column":2,"row":1}]};

Helpers.getPathToCoordinate(json.a, json.b, json.grid);