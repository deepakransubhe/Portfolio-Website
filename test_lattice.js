const W = 18, H = 12;
const lattice = new Int8Array(W * H).fill(-1);

function setCell(col, row, id) {
  const x = (col % W + W) % W;
  const y = (row % H + H) % H;
  lattice[y * W + x] = id;
}

function getCell(col, row) {
  const x = (col % W + W) % W;
  const y = (row % H + H) % H;
  return lattice[y * W + x];
}

// User reference arrangement around (0,0):
// Row -1:
setCell(-3, -1, 6); // NHS Covid
setCell(-2, -1, 5); // Safekeeper
setCell(-1, -1, 4); // Travel Companion
setCell(0, -1, 8);  // Unlaced
setCell(1, -1, 3);  // Transfer Room
setCell(2, -1, 4);  // Travel Companion
setCell(3, -1, 3);  // Transfer Room

// Row 0:
setCell(-3, 0, 6);  // NHS Covid
setCell(-2, 0, 7);  // Lace
setCell(-1, 0, 9);  // Bridge SEA
setCell(0, 0, 0);   // NightNight (CENTER)
setCell(1, 0, 1);   // allan.ltd
setCell(2, 0, 2);   // Retro Player
setCell(3, 0, 3);   // Transfer Room

// Row 1:
setCell(-3, 1, 0);  // NightNight
setCell(-2, 1, 4);  // Travel Companion
setCell(-1, 1, 2);  // Retro Player
setCell(0, 1, 7);   // Lace
setCell(1, 1, 9);   // Bridge SEA
setCell(2, 1, 8);   // Unlaced
setCell(3, 1, 5);   // Safekeeper

// Fill the remaining cells so no adjacent cells have the same id:
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (lattice[y * W + x] !== -1) continue;
    // Find an id from 0..9 that is not used in 8-neighbors
    for (let id = 0; id < 10; id++) {
      let conflict = false;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = (x + dx + W) % W;
          const ny = (y + dy + H) % H;
          if (lattice[ny * W + nx] === id) {
            conflict = true;
            break;
          }
        }
        if (conflict) break;
      }
      if (!conflict) {
        lattice[y * W + x] = id;
        break;
      }
    }
    if (lattice[y * W + x] === -1) {
      // Fallback
      lattice[y * W + x] = (x + y * 2) % 10;
    }
  }
}

console.log('Lattice successfully filled. Checking sample around center:');
for (let r = -1; r <= 1; r++) {
  let rowStr = `Row ${r}: `;
  for (let c = -3; c <= 3; c++) {
    rowStr += `${getCell(c, r)} `;
  }
  console.log(rowStr);
}
console.log('Total cells:', lattice.length);
