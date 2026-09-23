import type { Level } from './engine';
export const levels: Level[] = [
  {
    "id": "return-01",
    "chapter": 0,
    "name": [
      "Ein gemeinsamer Schritt",
      "One shared step"
    ],
    "thought": [
      "Zwei Wege, ein Rhythmus.",
      "Two paths, one rhythm."
    ],
    "hint": [
      "Eine Wand hält nur die Figur davor auf.",
      "A wall stops only the walker facing it."
    ],
    "rows": [
      "#######",
      "#A..a.#",
      "#######",
      "#B.b###",
      "#######"
    ]
  },
  {
    "id": "return-02",
    "chapter": 0,
    "name": [
      "Erst auseinander",
      "Apart, then together"
    ],
    "thought": [
      "Manchmal beginnt Gemeinsamkeit mit Abstand.",
      "Sometimes togetherness begins with distance."
    ],
    "hint": [
      "Geht zuerst nach rechts. Eine Figur wartet am Rand, die andere läuft weiter.",
      "Go right first. One walker waits at the edge while the other keeps going."
    ],
    "rows": [
      "#######",
      "#a.A###",
      "#######",
      "#B.b..#",
      "#######"
    ]
  },
  {
    "id": "return-03",
    "chapter": 0,
    "name": [
      "Ein Platz zum Warten",
      "A place to wait"
    ],
    "thought": [
      "Auch Stillstehen verÃƒÂ¤ndert etwas.",
      "Standing still changes things, too."
    ],
    "hint": [
      "Lass eine Figur an einer Wand warten, wÃƒÂ¤hrend die andere weitergeht.",
      "Let one walker wait at a wall while the other keeps moving."
    ],
    "rows": [
      "#######",
      "#A.a..#",
      "###.#.#",
      "#B....#",
      "#.#...#",
      "#...b.#",
      "#######"
    ]
  },
  {
    "id": "return-04",
    "chapter": 1,
    "name": [
      "Gärtnern beginnt",
      "A little gardening"
    ],
    "thought": [
      "Manche Grenzen lassen sich verschieben.",
      "Some boundaries can move."
    ],
    "hint": [
      "Gehe gegen den Pflanzkasten. Dahinter muss ein Feld frei sein.",
      "Walk into the planter. The tile behind it must be free."
    ],
    "rows": [
      "#######",
      "#A.Xa.#",
      "#######"
    ]
  },
  {
    "id": "return-05",
    "chapter": 1,
    "name": [
      "Eine Grenze für zwei",
      "A boundary for two"
    ],
    "thought": [
      "Ein Pflanzkasten verändert euren Abstand.",
      "A planter changes the distance between you."
    ],
    "hint": [
      "Schiebe den Kasten an den Rand. Er wird dort zur Wand.",
      "Push the planter to the edge. There it becomes a wall."
    ],
    "rows": [
      "########",
      "#AXa...#",
      "########",
      "#B..b..#",
      "########"
    ]
  },
  {
    "id": "return-06",
    "chapter": 1,
    "name": [
      "Platz schaffen",
      "Making space"
    ],
    "thought": [
      "Ein freier Weg beginnt manchmal mit einem Umweg.",
      "An open path sometimes begins with a detour."
    ],
    "hint": [
      "Schiebe den Kasten an der Abzweigung vorbei. Dann kannst du seitlich zum Ziel gehen.",
      "Push the planter past the junction. Then take the side path home."
    ],
    "rows": [
      "########",
      "#A.....#",
      "###X####",
      "###.a###",
      "###.####",
      "########"
    ]
  },
  {
    "id": "return-07",
    "chapter": 2,
    "name": [
      "Jemand hält offen",
      "Someone holds the way"
    ],
    "thought": [
      "Jemand hÃƒÂ¤lt den Weg offen.",
      "Someone keeps the way open."
    ],
    "hint": [
      "Eine Figur oder ein Kasten auf der runden Platte ÃƒÂ¶ffnet alle Tore. Sie gilt zu Beginn eines Zuges.",
      "A walker or planter on the round plate opens every gate. Its state at the start of a step counts."
    ],
    "rows": [
      "#######",
      "#A.o#.#",
      "#.b.|B#",
      "#.#.#.#",
      "#...#.#",
      "#a..#.#",
      "#######"
    ]
  },
  {
    "id": "return-08",
    "chapter": 2,
    "name": [
      "Bleib einen Moment",
      "Stay a moment"
    ],
    "thought": [
      "Manchmal ist Warten die halbe LÃƒÂ¶sung.",
      "Sometimes waiting is half the answer."
    ],
    "hint": [
      "Nutze die Wand neben der Platte, um eine Figur dort stehenzulassen.",
      "Use the wall next to the plate to keep one walker in place."
    ],
    "rows": [
      "########",
      "#Aoa#..#",
      "#.#.|B.#",
      "#...#..#",
      "##..#..#",
      "#b..#..#",
      "########"
    ]
  },
  {
    "id": "return-09",
    "chapter": 2,
    "name": [
      "Ein Garten für alle",
      "A garden for everyone"
    ],
    "thought": [
      "Auch ein stiller Helfer gehört dazu.",
      "A quiet helper belongs here too."
    ],
    "hint": [
      "Ein Pflanzkasten kann die Platte fÃƒÂ¼r euch besetzen.",
      "A planter can hold down the plate for you."
    ],
    "rows": [
      "########",
      "#A..#.a#",
      "#.Xo#..#",
      "#b..|.B#",
      "#.#.#..#",
      "#...#..#",
      "########"
    ]
  }
];
