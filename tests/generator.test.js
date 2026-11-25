const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function loadGame(seed) {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const script = html.match(/<script>\s*([\s\S]*?)<\/script>/);
  assert.ok(script, 'Le script du jeu est introuvable');
  const stateStart = script[1].indexOf('    let state = {');
  assert.notEqual(stateStart, -1, "Le début de l'état du jeu est introuvable");

  const context = vm.createContext({ seed });
  vm.runInContext(`
    Math.random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    ${script[1].slice(0, stateStart)}
    globalThis.game = { PuzzleGenerator, CSPSolver, ClueRules };
  `, context);
  return context.game;
}

for (const size of [6, 7, 8, 9]) {
  for (const requiresHypothesis of [false, true]) {
    test(`Grille ${size}×${size}, hypothèse ${requiresHypothesis ? 'requise' : 'non requise'}`, () => {
      const { PuzzleGenerator, CSPSolver, ClueRules } = loadGame(size * 10 + Number(requiresHypothesis));
      const addForcedClues = PuzzleGenerator.addForcedClues;
      PuzzleGenerator.addForcedClues = function (chapter, target) {
        const landmarks = JSON.stringify(chapter.landmarks);
        const result = addForcedClues.call(this, chapter, target);
        assert.equal(JSON.stringify(chapter.landmarks), landmarks, 'Les indices ne doivent pas ajouter de repères');
        return result;
      };

      let chapter;
      for (let attempt = 0; attempt < 10 && !chapter; attempt++) {
        chapter = PuzzleGenerator.generate(size, requiresHypothesis);
      }
      assert.ok(chapter, 'La génération a échoué');
      if (!requiresHypothesis) {
        assert.ok(chapter.clues.some(clue => clue.id.startsWith('gen_forced_')), 'Les indices supplémentaires doivent être exercés');
      }

      const proof = CSPSolver.solve(chapter, {}, 2, 30000);
      assert.equal(proof.timedOut, false);
      assert.equal(proof.solutions.length, 1);
      assert.equal(CSPSolver.canSolveWithoutGuessing(chapter), !requiresHypothesis);
      assert.equal(new Set(Object.values(chapter.landmarks)).size, Object.keys(chapter.landmarks).length);
      for (const clue of chapter.clues) {
        assert.doesNotMatch(clue.text, /\bL\d+\s*[-·]\s*C\d+/i);
        assert.equal(ClueRules.evaluate(clue.rule, proof.solutions[0], chapter), true, clue.text);
      }
    });
  }
}
