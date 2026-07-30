const SVG_NS = 'http://www.w3.org/2000/svg';

const COLOURS = {
    card: '#2b2650',
    ink: '#f2eefc',
    muted: '#a79fc9',
};

const START_SEQUENCE = [
    'easy', 'easy', 'easy',
    'medium', 'medium', 'medium',
    'difficult', 'difficult', 'difficult',
    'extra-hard', 'extra-hard', 'extra-hard',
];

let currentDifficulty = 'easy';
let currentPuzzle = null;
let gameMode = null;
let startIndex = 0;
let checkLocked = false;

function hashString(value) {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i++) {
        hash ^= value.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

function mulberry32(seed) {
    let t = seed >>> 0;
    return () => {
        t += 0x6D2B79F5;
        let x = t;
        x = Math.imul(x ^ (x >>> 15), x | 1);
        x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
        return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
}

function pick(rng, items) {
    return items[Math.floor(rng() * items.length)];
}

function jitter(rng, amount) {
    return (rng() * 2 - 1) * amount;
}

function shape(type, x, y, size, extra = {}) {
    return {
        type,
        x,
        y,
        size,
        rotation: extra.rotation ?? 0,
        fill: extra.fill ?? COLOURS.ink,
        stroke: extra.stroke ?? 'none',
        strokeWidth: extra.strokeWidth ?? 0,
    };
}

function scene(shapes, extra = {}) {
    return {
        shapes,
        frame: extra.frame ?? false,
        frameStyle: extra.frameStyle ?? 'solid',
    };
}

function renderScene(sceneData, mount) {
    mount.innerHTML = '';

    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('scene-svg');

    const bg = document.createElementNS(SVG_NS, 'rect');
    bg.setAttribute('x', '2');
    bg.setAttribute('y', '2');
    bg.setAttribute('width', '96');
    bg.setAttribute('height', '96');
    bg.setAttribute('rx', '16');
    bg.setAttribute('fill', COLOURS.card);
    bg.setAttribute('stroke', 'rgba(255, 255, 255, 0.10)');
    bg.setAttribute('stroke-width', '2');
    svg.appendChild(bg);

    if (sceneData.frame) {
        const frame = document.createElementNS(SVG_NS, 'rect');
        frame.setAttribute('x', '18');
        frame.setAttribute('y', '18');
        frame.setAttribute('width', '64');
        frame.setAttribute('height', '64');
        frame.setAttribute('rx', '8');
        frame.setAttribute('fill', 'none');
        frame.setAttribute('stroke', 'rgba(255, 255, 255, 0.32)');
        frame.setAttribute('stroke-width', '2');
        frame.setAttribute('stroke-dasharray', sceneData.frameStyle === 'dashed' ? '4 4' : '0');
        svg.appendChild(frame);
    }

    for (const item of sceneData.shapes) {
        let node = null;
        if (item.type === 'circle') {
            node = document.createElementNS(SVG_NS, 'circle');
            node.setAttribute('cx', item.x);
            node.setAttribute('cy', item.y);
            node.setAttribute('r', item.size / 2);
        } else if (item.type === 'square') {
            node = document.createElementNS(SVG_NS, 'rect');
            node.setAttribute('x', item.x - item.size / 2);
            node.setAttribute('y', item.y - item.size / 2);
            node.setAttribute('width', item.size);
            node.setAttribute('height', item.size);
            node.setAttribute('rx', item.size * 0.08);
        } else if (item.type === 'triangle') {
            node = document.createElementNS(SVG_NS, 'polygon');
            const half = item.size / 2;
            const points = [
                `${item.x},${item.y - half}`,
                `${item.x - half * 0.92},${item.y + half * 0.82}`,
                `${item.x + half * 0.92},${item.y + half * 0.82}`,
            ].join(' ');
            node.setAttribute('points', points);
        }

        if (!node) continue;
        node.setAttribute('fill', item.fill);
        node.setAttribute('stroke', item.stroke);
        node.setAttribute('stroke-width', item.strokeWidth);
        if (item.rotation) {
            node.setAttribute('transform', `rotate(${item.rotation} ${item.x} ${item.y})`);
        }
        svg.appendChild(node);
    }

    mount.appendChild(svg);
}

function singleScene(type, x, y, size, extra = {}) {
    return scene([shape(type, x, y, size, extra)], extra.scene ?? {});
}

function pairScene(typeA, typeB, first, second, extra = {}) {
    return scene([
        shape(typeA, first.x, first.y, first.size, first.extra ?? {}),
        shape(typeB, second.x, second.y, second.size, second.extra ?? {}),
    ], extra.scene ?? {});
}

function tripleScene(items, extra = {}) {
    return scene(items.map(item => shape(item.type, item.x, item.y, item.size, item.extra ?? {})), extra.scene ?? {});
}

function makeScenes(labelId, seed) {
    const generator = LABELS[labelId];
    const scenes = [];
    for (let i = 0; i < 3; i++) {
        const rng = mulberry32(seed + i * 1013);
        scenes.push(generator.makeScene(rng));
    }
    return scenes;
}

function renderSceneRow(mount, labelId, seed) {
    const scenes = makeScenes(labelId, seed);
    mount.innerHTML = '';
    for (const sceneData of scenes) {
        const card = document.createElement('div');
        card.className = 'scene-card';
        renderScene(sceneData, card);
        mount.appendChild(card);
    }
}

const LABELS = {
    circles_only: {
        text: 'circles only',
        group: 'Easy',
        makeScene(rng) {
            const count = rng() < 0.5 ? 1 : 2;
            if (count === 1) {
                return singleScene('circle', 50 + jitter(rng, 7), 50 + jitter(rng, 7), 28 + jitter(rng, 4));
            }
            return tripleScene([
                { type: 'circle', x: 36 + jitter(rng, 3), y: 50 + jitter(rng, 4), size: 18 + jitter(rng, 2) },
                { type: 'circle', x: 64 + jitter(rng, 3), y: 50 + jitter(rng, 4), size: 18 + jitter(rng, 2) },
            ]);
        },
    },
    squares_only: {
        text: 'squares only',
        group: 'Easy',
        makeScene(rng) {
            return pick(rng, [
                () => singleScene('square', 50 + jitter(rng, 6), 50 + jitter(rng, 6), 26 + jitter(rng, 4)),
                () => tripleScene([
                    { type: 'square', x: 35 + jitter(rng, 3), y: 50 + jitter(rng, 3), size: 18 + jitter(rng, 2) },
                    { type: 'square', x: 65 + jitter(rng, 3), y: 50 + jitter(rng, 3), size: 18 + jitter(rng, 2) },
                ]),
            ])();
        },
    },
    triangles_only: {
        text: 'triangles only',
        group: 'Easy',
        makeScene(rng) {
            return pick(rng, [
                () => singleScene('triangle', 50 + jitter(rng, 6), 50 + jitter(rng, 6), 30 + jitter(rng, 3)),
                () => tripleScene([
                    { type: 'triangle', x: 35 + jitter(rng, 3), y: 50 + jitter(rng, 3), size: 18 + jitter(rng, 2) },
                    { type: 'triangle', x: 65 + jitter(rng, 3), y: 50 + jitter(rng, 3), size: 18 + jitter(rng, 2) },
                ]),
            ])();
        },
    },
    big_shapes_only: {
        text: 'big shapes only',
        group: 'Easy',
        makeScene(rng) {
            const type = pick(rng, ['circle', 'square', 'triangle']);
            return singleScene(type, 50 + jitter(rng, 4), 50 + jitter(rng, 4), 40 + jitter(rng, 4));
        },
    },
    small_shapes_only: {
        text: 'small shapes only',
        group: 'Easy',
        makeScene(rng) {
            const type = pick(rng, ['circle', 'square', 'triangle']);
            return singleScene(type, 50 + jitter(rng, 5), 50 + jitter(rng, 5), 16 + jitter(rng, 2));
        },
    },
    top_shape: {
        text: 'the main shape at the top',
        group: 'Easy',
        makeScene(rng) {
            const type = pick(rng, ['circle', 'square', 'triangle']);
            return singleScene(type, 50 + jitter(rng, 6), 28 + jitter(rng, 2), 26 + jitter(rng, 3));
        },
    },
    bottom_shape: {
        text: 'the main shape at the bottom',
        group: 'Easy',
        makeScene(rng) {
            const type = pick(rng, ['circle', 'square', 'triangle']);
            return singleScene(type, 50 + jitter(rng, 6), 72 + jitter(rng, 2), 26 + jitter(rng, 3));
        },
    },
    inside_frame: {
        text: 'shapes inside a frame',
        group: 'Easy',
        makeScene(rng) {
            const type = pick(rng, ['circle', 'square', 'triangle']);
            return scene([
                shape(type, 50 + jitter(rng, 4), 50 + jitter(rng, 4), 26 + jitter(rng, 2)),
            ], { frame: true, frameStyle: 'dashed' });
        },
    },
    outside_frame: {
        text: 'shapes outside a frame',
        group: 'Easy',
        makeScene(rng) {
            const type = pick(rng, ['circle', 'square', 'triangle']);
            return scene([
                shape(type, 24 + jitter(rng, 3), 24 + jitter(rng, 3), 20 + jitter(rng, 2)),
                shape(type, 78 + jitter(rng, 3), 78 + jitter(rng, 3), 20 + jitter(rng, 2)),
            ], { frame: true, frameStyle: 'dashed' });
        },
    },
    one_object: {
        text: 'one object',
        group: 'Easy',
        makeScene(rng) {
            const type = pick(rng, ['circle', 'square', 'triangle']);
            return singleScene(type, 50 + jitter(rng, 4), 50 + jitter(rng, 4), 28 + jitter(rng, 3));
        },
    },
    many_objects: {
        text: 'many objects',
        group: 'Easy',
        makeScene(rng) {
            return tripleScene([
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 28 + jitter(rng, 2), y: 30 + jitter(rng, 2), size: 14 + jitter(rng, 1) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 50 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 14 + jitter(rng, 1) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 72 + jitter(rng, 2), y: 70 + jitter(rng, 2), size: 14 + jitter(rng, 1) },
            ]);
        },
    },
    symmetric_lr: {
        text: 'objects that are symmetric left-to-right',
        group: 'Easy',
        makeScene(rng) {
            const type = pick(rng, ['circle', 'square', 'triangle']);
            return tripleScene([
                { type, x: 32, y: 34, size: 16 + jitter(rng, 1) },
                { type, x: 68, y: 34, size: 16 + jitter(rng, 1) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 50, y: 68, size: 16 + jitter(rng, 1) },
            ]);
        },
    },
    asymmetric: {
        text: 'objects that are not symmetric',
        group: 'Easy',
        makeScene(rng) {
            return tripleScene([
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 24 + jitter(rng, 3), y: 26 + jitter(rng, 3), size: 16 + jitter(rng, 1) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 62 + jitter(rng, 3), y: 54 + jitter(rng, 3), size: 20 + jitter(rng, 1) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 78 + jitter(rng, 3), y: 74 + jitter(rng, 3), size: 12 + jitter(rng, 1) },
            ]);
        },
    },

    mixed_circles_triangles: {
        text: 'circles and triangles',
        group: 'Easy',
        makeScene(rng) {
            return pairScene(
                'circle',
                'triangle',
                { x: 35 + jitter(rng, 3), y: 50 + jitter(rng, 3), size: 22 + jitter(rng, 2) },
                { x: 66 + jitter(rng, 3), y: 50 + jitter(rng, 3), size: 22 + jitter(rng, 2) },
            );
        },
    },
    mixed_squares_circles: {
        text: 'squares and circles',
        group: 'Medium',
        makeScene(rng) {
            return pairScene(
                'square',
                'circle',
                { x: 35 + jitter(rng, 3), y: 50 + jitter(rng, 3), size: 22 + jitter(rng, 2) },
                { x: 66 + jitter(rng, 3), y: 50 + jitter(rng, 3), size: 22 + jitter(rng, 2) },
            );
        },
    },
    mixed_squares_triangles: {
        text: 'squares and triangles',
        group: 'Medium',
        makeScene(rng) {
            return pairScene(
                'square',
                'triangle',
                { x: 35 + jitter(rng, 3), y: 50 + jitter(rng, 3), size: 22 + jitter(rng, 2) },
                { x: 66 + jitter(rng, 3), y: 50 + jitter(rng, 3), size: 22 + jitter(rng, 2) },
            );
        },
    },
    one_big_one_small: {
        text: 'one big shape and one small shape',
        group: 'Medium',
        makeScene(rng) {
            const bigType = pick(rng, ['circle', 'square', 'triangle']);
            const smallType = pick(rng, ['circle', 'square', 'triangle']);
            return pairScene(
                bigType,
                smallType,
                { x: 35 + jitter(rng, 3), y: 50 + jitter(rng, 3), size: 28 + jitter(rng, 3) },
                { x: 68 + jitter(rng, 3), y: 50 + jitter(rng, 3), size: 15 + jitter(rng, 2) },
            );
        },
    },
    two_equal_sizes: {
        text: 'two shapes of equal size',
        group: 'Medium',
        makeScene(rng) {
            const first = pick(rng, ['circle', 'square', 'triangle']);
            const second = pick(rng, ['circle', 'square', 'triangle']);
            return pairScene(
                first,
                second,
                { x: 35 + jitter(rng, 3), y: 50 + jitter(rng, 3), size: 22 + jitter(rng, 2) },
                { x: 66 + jitter(rng, 3), y: 50 + jitter(rng, 3), size: 22 + jitter(rng, 2) },
            );
        },
    },
    largest_above_smallest: {
        text: 'the largest shape above the smallest',
        group: 'Medium',
        makeScene(rng) {
            return tripleScene([
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 50, y: 30 + jitter(rng, 2), size: 28 + jitter(rng, 2) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 50, y: 70 + jitter(rng, 2), size: 14 + jitter(rng, 1) },
            ]);
        },
    },
    largest_below_smallest: {
        text: 'the largest shape below the smallest',
        group: 'Medium',
        makeScene(rng) {
            return tripleScene([
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 50, y: 30 + jitter(rng, 2), size: 14 + jitter(rng, 1) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 50, y: 70 + jitter(rng, 2), size: 28 + jitter(rng, 2) },
            ]);
        },
    },
    left_half_only: {
        text: 'shapes on the left half only',
        group: 'Medium',
        makeScene(rng) {
            return tripleScene([
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 28 + jitter(rng, 3), y: 30 + jitter(rng, 3), size: 18 + jitter(rng, 2) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 28 + jitter(rng, 3), y: 68 + jitter(rng, 3), size: 18 + jitter(rng, 2) },
            ]);
        },
    },
    right_half_only: {
        text: 'shapes on the right half only',
        group: 'Medium',
        makeScene(rng) {
            return tripleScene([
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 72 + jitter(rng, 3), y: 30 + jitter(rng, 3), size: 18 + jitter(rng, 2) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 72 + jitter(rng, 3), y: 68 + jitter(rng, 3), size: 18 + jitter(rng, 2) },
            ]);
        },
    },
    odd_number_of_objects: {
        text: 'an odd number of objects',
        group: 'Medium',
        makeScene(rng) {
            return tripleScene([
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 28 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 2) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 50 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 2) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 72 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 2) },
            ]);
        },
    },
    even_number_of_objects: {
        text: 'an even number of objects',
        group: 'Medium',
        makeScene(rng) {
            return tripleScene([
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 24 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 14 + jitter(rng, 2) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 42 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 14 + jitter(rng, 2) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 58 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 14 + jitter(rng, 2) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 76 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 14 + jitter(rng, 2) },
            ]);
        },
    },
    central_with_satellites: {
        text: 'one central object with satellites',
        group: 'Medium',
        makeScene(rng) {
            const centerType = pick(rng, ['circle', 'square', 'triangle']);
            const satelliteType = pick(rng, ['circle', 'square', 'triangle']);
            return tripleScene([
                { type: centerType, x: 50, y: 50, size: 24 + jitter(rng, 2) },
                { type: satelliteType, x: 50, y: 24, size: 10 + jitter(rng, 1) },
                { type: satelliteType, x: 50, y: 76, size: 10 + jitter(rng, 1) },
                { type: satelliteType, x: 24, y: 50, size: 10 + jitter(rng, 1) },
                { type: satelliteType, x: 76, y: 50, size: 10 + jitter(rng, 1) },
            ]);
        },
    },
    scattered_layout: {
        text: 'a scattered layout',
        group: 'Medium',
        makeScene(rng) {
            return tripleScene([
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 28 + jitter(rng, 4), y: 30 + jitter(rng, 4), size: 16 + jitter(rng, 2) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 73 + jitter(rng, 4), y: 28 + jitter(rng, 4), size: 16 + jitter(rng, 2) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 55 + jitter(rng, 4), y: 72 + jitter(rng, 4), size: 16 + jitter(rng, 2) },
            ]);
        },
    },
    repeat_same_shape_twice: {
        text: 'the same shape twice',
        group: 'Medium',
        makeScene(rng) {
            const repeated = pick(rng, ['circle', 'square', 'triangle']);
            const other = pick(rng, ['circle', 'square', 'triangle'].filter(type => type !== repeated));
            return tripleScene([
                { type: repeated, x: 31 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 2) },
                { type: repeated, x: 50 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 2) },
                { type: other, x: 70 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 2) },
            ]);
        },
    },
    three_different_shapes: {
        text: 'three different shapes',
        group: 'Medium',
        makeScene(rng) {
            const types = ['circle', 'square', 'triangle'];
            return tripleScene([
                { type: types[0], x: 30 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 2) },
                { type: types[1], x: 50 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 2) },
                { type: types[2], x: 70 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 2) },
            ]);
        },
    },

    curved_only: {
        text: 'only curved shapes',
        group: 'Difficult',
        makeScene(rng) {
            return tripleScene([
                { type: 'circle', x: 30 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 18 + jitter(rng, 2) },
                { type: 'circle', x: 50 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 18 + jitter(rng, 2) },
                { type: 'circle', x: 70 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 18 + jitter(rng, 2) },
            ]);
        },
    },
    straight_edged_only: {
        text: 'only straight-edged shapes',
        group: 'Difficult',
        makeScene(rng) {
            return tripleScene([
                { type: pick(rng, ['square', 'triangle']), x: 30 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 18 + jitter(rng, 2) },
                { type: pick(rng, ['square', 'triangle']), x: 50 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 18 + jitter(rng, 2) },
                { type: pick(rng, ['square', 'triangle']), x: 70 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 18 + jitter(rng, 2) },
            ]);
        },
    },
    alternating_big_small_big: {
        text: 'alternates big / small / big',
        group: 'Difficult',
        makeScene(rng) {
            return tripleScene([
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 24 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 24 + jitter(rng, 2) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 50 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 12 + jitter(rng, 1) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 76 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 24 + jitter(rng, 2) },
            ]);
        },
    },
    alternating_small_big_small: {
        text: 'alternates small / big / small',
        group: 'Difficult',
        makeScene(rng) {
            return tripleScene([
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 24 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 12 + jitter(rng, 1) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 50 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 24 + jitter(rng, 2) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 76 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 12 + jitter(rng, 1) },
            ]);
        },
    },
    touch_top_boundary: {
        text: 'all shapes touching the top boundary',
        group: 'Difficult',
        makeScene(rng) {
            return tripleScene([
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 24 + jitter(rng, 2), y: 18 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 50 + jitter(rng, 2), y: 18 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 76 + jitter(rng, 2), y: 18 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
            ]);
        },
    },
    touch_bottom_boundary: {
        text: 'all shapes touching the bottom boundary',
        group: 'Difficult',
        makeScene(rng) {
            return tripleScene([
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 24 + jitter(rng, 2), y: 82 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 50 + jitter(rng, 2), y: 82 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 76 + jitter(rng, 2), y: 82 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
            ]);
        },
    },
    odd_one_inside_group: {
        text: 'the odd one out inside the group',
        group: 'Difficult',
        makeScene(rng) {
            const common = pick(rng, ['circle', 'square', 'triangle']);
            const odd = pick(rng, ['circle', 'square', 'triangle'].filter(type => type !== common));
            return tripleScene([
                { type: common, x: 35 + jitter(rng, 2), y: 35 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type: odd, x: 50 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type: common, x: 65 + jitter(rng, 2), y: 35 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
            ]);
        },
    },
    odd_one_outside_group: {
        text: 'the odd one out outside the group',
        group: 'Difficult',
        makeScene(rng) {
            const common = pick(rng, ['circle', 'square', 'triangle']);
            const odd = pick(rng, ['circle', 'square', 'triangle'].filter(type => type !== common));
            return tripleScene([
                { type: common, x: 35 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type: common, x: 50 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type: odd, x: 78 + jitter(rng, 2), y: 24 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
            ]);
        },
    },
    more_circles_than_squares: {
        text: 'more circles than squares',
        group: 'Difficult',
        makeScene(rng) {
            return tripleScene([
                { type: 'circle', x: 30 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type: 'circle', x: 50 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type: 'square', x: 70 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
            ]);
        },
    },
    more_squares_than_circles: {
        text: 'more squares than circles',
        group: 'Difficult',
        makeScene(rng) {
            return tripleScene([
                { type: 'square', x: 30 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type: 'square', x: 50 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type: 'circle', x: 70 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
            ]);
        },
    },
    vertical_line: {
        text: 'a vertical line',
        group: 'Difficult',
        makeScene(rng) {
            const type = pick(rng, ['circle', 'square', 'triangle']);
            return tripleScene([
                { type, x: 50 + jitter(rng, 2), y: 24 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type, x: 50 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type, x: 50 + jitter(rng, 2), y: 76 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
            ]);
        },
    },
    horizontal_line: {
        text: 'a horizontal line',
        group: 'Difficult',
        makeScene(rng) {
            const type = pick(rng, ['circle', 'square', 'triangle']);
            return tripleScene([
                { type, x: 24 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type, x: 50 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type, x: 76 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
            ]);
        },
    },
    nested_shapes: {
        text: 'nested shapes',
        group: 'Difficult',
        makeScene(rng) {
            const outer = pick(rng, ['circle', 'square']);
            const inner = outer === 'circle' ? 'square' : 'circle';
            return scene([
                shape(outer, 50, 50, 52, { fill: 'none', stroke: COLOURS.ink, strokeWidth: 3 }),
                shape(inner, 50, 50, 18 + jitter(rng, 1)),
            ]);
        },
    },
    separate_shapes: {
        text: 'separate shapes',
        group: 'Difficult',
        makeScene(rng) {
            return tripleScene([
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 24 + jitter(rng, 2), y: 24 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 76 + jitter(rng, 2), y: 24 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 50 + jitter(rng, 2), y: 74 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
            ]);
        },
    },

    same_family_diff_sizes: {
        text: 'the same shape family, different sizes',
        group: 'Extra Hard',
        makeScene(rng) {
            const type = pick(rng, ['circle', 'square', 'triangle']);
            return tripleScene([
                { type, x: 30 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 14 + jitter(rng, 1) },
                { type, x: 50 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 22 + jitter(rng, 1) },
                { type, x: 70 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 30 + jitter(rng, 1) },
            ]);
        },
    },
    different_families_same_size: {
        text: 'different shape families, same size',
        group: 'Extra Hard',
        makeScene(rng) {
            return tripleScene([
                { type: 'circle', x: 30 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 18 + jitter(rng, 1) },
                { type: 'square', x: 50 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 18 + jitter(rng, 1) },
                { type: 'triangle', x: 70 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 18 + jitter(rng, 1) },
            ]);
        },
    },
    increasing_left_to_right: {
        text: 'sizes increasing left to right',
        group: 'Extra Hard',
        makeScene(rng) {
            const type = pick(rng, ['circle', 'square', 'triangle']);
            return tripleScene([
                { type, x: 28 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 14 + jitter(rng, 1) },
                { type, x: 50 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 20 + jitter(rng, 1) },
                { type, x: 72 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 28 + jitter(rng, 1) },
            ]);
        },
    },
    decreasing_left_to_right: {
        text: 'sizes decreasing left to right',
        group: 'Extra Hard',
        makeScene(rng) {
            const type = pick(rng, ['circle', 'square', 'triangle']);
            return tripleScene([
                { type, x: 28 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 28 + jitter(rng, 1) },
                { type, x: 50 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 20 + jitter(rng, 1) },
                { type, x: 72 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 14 + jitter(rng, 1) },
            ]);
        },
    },
    largest_closest_to_center: {
        text: 'largest shape closest to the center',
        group: 'Extra Hard',
        makeScene(rng) {
            return tripleScene([
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 50, y: 50, size: 28 + jitter(rng, 1) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 28, y: 28, size: 14 + jitter(rng, 1) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 72, y: 72, size: 14 + jitter(rng, 1) },
            ]);
        },
    },
    largest_farthest_from_center: {
        text: 'largest shape farthest from the center',
        group: 'Extra Hard',
        makeScene(rng) {
            return tripleScene([
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 50, y: 50, size: 14 + jitter(rng, 1) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 28, y: 28, size: 28 + jitter(rng, 1) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 72, y: 72, size: 14 + jitter(rng, 1) },
            ]);
        },
    },
    top_left_bottom_right_diagonal: {
        text: 'a top-left / bottom-right diagonal',
        group: 'Extra Hard',
        makeScene(rng) {
            const type = pick(rng, ['circle', 'square', 'triangle']);
            return tripleScene([
                { type, x: 28 + jitter(rng, 2), y: 28 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type, x: 50 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type, x: 72 + jitter(rng, 2), y: 72 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
            ]);
        },
    },
    top_right_bottom_left_diagonal: {
        text: 'a top-right / bottom-left diagonal',
        group: 'Extra Hard',
        makeScene(rng) {
            const type = pick(rng, ['circle', 'square', 'triangle']);
            return tripleScene([
                { type, x: 72 + jitter(rng, 2), y: 28 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type, x: 50 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type, x: 28 + jitter(rng, 2), y: 72 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
            ]);
        },
    },
    prime_number_of_shapes: {
        text: 'a prime number of shapes',
        group: 'Extra Hard',
        makeScene(rng) {
            return tripleScene([
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 30 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 50 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 70 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
            ]);
        },
    },
    composite_number_of_shapes: {
        text: 'a composite number of shapes',
        group: 'Extra Hard',
        makeScene(rng) {
            return tripleScene([
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 24 + jitter(rng, 2), y: 38 + jitter(rng, 2), size: 14 + jitter(rng, 1) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 40 + jitter(rng, 2), y: 38 + jitter(rng, 2), size: 14 + jitter(rng, 1) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 60 + jitter(rng, 2), y: 62 + jitter(rng, 2), size: 14 + jitter(rng, 1) },
                { type: pick(rng, ['circle', 'square', 'triangle']), x: 76 + jitter(rng, 2), y: 62 + jitter(rng, 2), size: 14 + jitter(rng, 1) },
            ]);
        },
    },
    rotational_symmetry: {
        text: 'rotational symmetry',
        group: 'Extra Hard',
        makeScene(rng) {
            const type = pick(rng, ['circle', 'square', 'triangle']);
            return tripleScene([
                { type, x: 30, y: 30, size: 16 + jitter(rng, 1) },
                { type, x: 70, y: 30, size: 16 + jitter(rng, 1) },
                { type, x: 30, y: 70, size: 16 + jitter(rng, 1) },
                { type, x: 70, y: 70, size: 16 + jitter(rng, 1) },
            ]);
        },
    },
    mirror_symmetry_only: {
        text: 'mirror symmetry only',
        group: 'Extra Hard',
        makeScene(rng) {
            const type = pick(rng, ['circle', 'square', 'triangle']);
            const extraType = pick(rng, ['circle', 'square', 'triangle']);
            return tripleScene([
                { type, x: 28, y: 52, size: 16 + jitter(rng, 1) },
                { type, x: 72, y: 52, size: 16 + jitter(rng, 1) },
                { type: extraType, x: 50, y: 26, size: 16 + jitter(rng, 1) },
            ]);
        },
    },
    one_of_each: {
        text: 'one of each',
        group: 'Extra Hard',
        makeScene(rng) {
            return tripleScene([
                { type: 'circle', x: 30 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type: 'square', x: 50 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type: 'triangle', x: 70 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
            ]);
        },
    },
    two_of_one_one_of_another: {
        text: 'two of one shape, one of another',
        group: 'Extra Hard',
        makeScene(rng) {
            const repeated = pick(rng, ['circle', 'square', 'triangle']);
            const other = pick(rng, ['circle', 'square', 'triangle'].filter(type => type !== repeated));
            return tripleScene([
                { type: repeated, x: 30 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type: repeated, x: 50 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
                { type: other, x: 70 + jitter(rng, 2), y: 50 + jitter(rng, 2), size: 16 + jitter(rng, 1) },
            ]);
        },
    },
};

const RULES = {
    easy: [
        { left: 'circles_only', right: 'squares_only' },
        { left: 'triangles_only', right: 'mixed_circles_triangles' },
        { left: 'big_shapes_only', right: 'small_shapes_only' },
        { left: 'top_shape', right: 'bottom_shape' },
        { left: 'inside_frame', right: 'outside_frame' },
        { left: 'one_object', right: 'many_objects' },
        { left: 'symmetric_lr', right: 'asymmetric' },
    ],
    medium: [
        { left: 'mixed_squares_triangles', right: 'mixed_squares_circles' },
        { left: 'one_big_one_small', right: 'two_equal_sizes' },
        { left: 'largest_above_smallest', right: 'largest_below_smallest' },
        { left: 'left_half_only', right: 'right_half_only' },
        { left: 'odd_number_of_objects', right: 'even_number_of_objects' },
        { left: 'central_with_satellites', right: 'scattered_layout' },
        { left: 'repeat_same_shape_twice', right: 'three_different_shapes' },
    ],
    difficult: [
        { left: 'curved_only', right: 'straight_edged_only' },
        { left: 'alternating_big_small_big', right: 'alternating_small_big_small' },
        { left: 'touch_top_boundary', right: 'touch_bottom_boundary' },
        { left: 'odd_one_inside_group', right: 'odd_one_outside_group' },
        { left: 'more_circles_than_squares', right: 'more_squares_than_circles' },
        { left: 'vertical_line', right: 'horizontal_line' },
        { left: 'nested_shapes', right: 'separate_shapes' },
    ],
    'extra-hard': [
        { left: 'same_family_diff_sizes', right: 'different_families_same_size' },
        { left: 'increasing_left_to_right', right: 'decreasing_left_to_right' },
        { left: 'largest_closest_to_center', right: 'largest_farthest_from_center' },
        { left: 'top_left_bottom_right_diagonal', right: 'top_right_bottom_left_diagonal' },
        { left: 'prime_number_of_shapes', right: 'composite_number_of_shapes' },
        { left: 'rotational_symmetry', right: 'mirror_symmetry_only' },
        { left: 'one_of_each', right: 'two_of_one_one_of_another' },
    ],
};

function buildAnswerOptions(difficulty) {
    const selectIds = ['left-select', 'right-select'];
    const difficultyLabel = {
        easy: 'Easy',
        medium: 'Medium',
        difficult: 'Difficult',
        'extra-hard': 'Extra Hard',
    }[difficulty];

    const options = Object.entries(LABELS).filter(([, label]) => label.group === difficultyLabel);

    for (const selectId of selectIds) {
        const select = document.getElementById(selectId);
        select.innerHTML = '';

        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = 'choose…';
        placeholder.selected = true;
        placeholder.disabled = true;
        select.appendChild(placeholder);

        for (const [labelId, label] of options) {
            const option = document.createElement('option');
            option.value = labelId;
            option.textContent = label.text;
            select.appendChild(option);
        }

        select.onchange = hideResult;
    }
}

function hideResult() {
    const result = document.getElementById('result');
    result.style.display = 'none';
}

function showResult(text, className) {
    const result = document.getElementById('result');
    result.style.display = 'inline-block';
    result.className = className;
    result.textContent = text;
}

function renderComparisonRow(mount, leftLabel, rightLabel, seedBase) {
    const leftMount = mount.querySelector('.left');
    const rightMount = mount.querySelector('.right');
    renderSceneRow(leftMount, leftLabel, seedBase + 17);
    renderSceneRow(rightMount, rightLabel, seedBase + 997);
}

function populateDifficultyButtons() {
    document.querySelectorAll('#difficulty-btns button').forEach(btn => {
        btn.addEventListener('click', () => {
            currentDifficulty = btn.dataset.difficulty;
            document.querySelectorAll('#difficulty-btns button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadPuzzle(currentDifficulty);
        });
    });
}

function loadPuzzle(difficulty) {
    currentDifficulty = difficulty;
    checkLocked = false;
    hideResult();
    buildAnswerOptions(difficulty);

    const pool = RULES[difficulty];
    const rule = pool[Math.floor(Math.random() * pool.length)];
    currentPuzzle = rule;

    const seedBase = hashString(`${difficulty}:${rule.left}:${rule.right}:${Date.now()}`);
    renderComparisonRow(document.querySelector('#example-1 .comparison'), rule.left, rule.right, seedBase);
    renderComparisonRow(document.querySelector('#example-2 .comparison'), rule.left, rule.right, seedBase + 5000);

    document.getElementById('left-select').value = '';
    document.getElementById('right-select').value = '';

    if (gameMode === 'infinite') {
        document.querySelectorAll('#difficulty-btns button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.difficulty === difficulty);
        });
    }
}

function startPuzzleMode() {
    gameMode = 'start';
    startIndex = 0;
    document.getElementById('difficulty-toolbar').style.display = 'none';
    loadPuzzle(START_SEQUENCE[startIndex]);
}

function startInfiniteMode() {
    gameMode = 'infinite';
    document.getElementById('difficulty-toolbar').style.display = 'flex';
    document.querySelectorAll('#difficulty-btns button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.difficulty === currentDifficulty);
    });
    loadPuzzle(currentDifficulty);
}

function checkAnswer() {
    if (checkLocked) return;

    const selectedLeft = document.getElementById('left-select').value;
    const selectedRight = document.getElementById('right-select').value;

    if (!selectedLeft || !selectedRight) {
        showResult('Pick both sides first', 'wrong');
        return;
    }

    const ok = selectedLeft === currentPuzzle.left && selectedRight === currentPuzzle.right;

    if (!ok) {
        showResult('Not quite — try again', 'wrong');
        return;
    }

    checkLocked = true;

    if (gameMode === 'start') {
        startIndex++;
        if (startIndex >= START_SEQUENCE.length) {
            showResult('Sequence complete! Well done!', 'correct');
            setTimeout(() => {
                document.getElementById('puzzle').style.display = 'none';
                document.getElementById('menu').style.display = 'flex';
            }, 2000);
        } else {
            showResult('Correct!', 'correct');
            setTimeout(() => loadPuzzle(START_SEQUENCE[startIndex]), 2000);
        }
    } else {
        showResult('Correct!', 'correct');
        setTimeout(() => loadPuzzle(currentDifficulty), 2000);
    }
}

buildAnswerOptions();
populateDifficultyButtons();

document.getElementById('check-btn').addEventListener('click', checkAnswer);

window.startPuzzleMode = startPuzzleMode;
window.startInfiniteMode = startInfiniteMode;
