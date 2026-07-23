// ============================================================
// CORE ENGINE: Stream Generator
// ============================================================
// ⚠️ IMMUTABLE CORE ENGINE (Charter Article 3)
// Based on the Principle of Separation of Structure and Logic,
// strictly NO MODIFICATIONS are allowed to this generator function.
// All custom splitting logic must be defined within `splistRule`.
// ============================================================
'use strict';

/**
 * Core generator engine that processes text lines and yields chunked strings.
 * @internal
 * @param {AsyncIterable<string>|Iterable<string>} splistLines
 * @param {{ test: (line: string) => boolean }} splistRule
 * @returns {AsyncGenerator<string>}
 */
exports.splistEngine = async function* (splistLines, splistRule) {
    let splistChunk = [];
    for await (const splistLine of splistLines) {
        if (splistRule.test(splistLine) && splistChunk.length) {
            yield splistChunk.join('\n');
            splistChunk = [];
        }
        splistChunk.push(splistLine);
    }
    if (splistChunk.length) yield splistChunk.join('\n');
};