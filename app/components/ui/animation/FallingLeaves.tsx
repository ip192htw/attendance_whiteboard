'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

// 確定性偽隨機數輔助函式（純函式，避免 SSR Hydration 不一致與 React 19 ESLint 報錯）
const seededRandom = (seed: number, min: number, max: number) => {
    let h = seed >>> 0;
    h ^= h >>> 16;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return ((h >>> 0) / 4294967296) * (max - min) + min;
};

interface Leaf {
    id: number;
    x: number;          // 起始 X 軸位置 (%)
    size: number;       // 葉子大小
    duration: number;   // 飄落時間 (秒)
    delay: number;      // 延遲時間 (秒)
    rotate: number;     // 旋轉角度
    leafType: string;   // 葉子圖案
}

const LEAF_TYPES = ['🍁', '🍂', '🍃'];

export function FallingLeaves({ count = 15 }: { count?: number }) {
    const leaves = useMemo<Leaf[]>(() => {
        return Array.from({ length: count }).map((_, i) => {
            const baseSeed = (i + 1) * 7;
            const typeIndex = Math.floor(seededRandom(baseSeed + 6, 0, LEAF_TYPES.length));

            return {
                id: i,
                x: seededRandom(baseSeed + 1, 0, 100),
                size: seededRandom(baseSeed + 2, 1.2, 2.5),
                duration: seededRandom(baseSeed + 3, 12, 24),
                delay: seededRandom(baseSeed + 4, 0, 3),
                rotate: seededRandom(baseSeed + 5, 0, 360),
                leafType: LEAF_TYPES[typeIndex],
            };
        });
    }, [count]);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            {leaves.map((leaf) => (
                <motion.div
                    key={leaf.id}
                    style={{
                        position: 'absolute',
                        left: `${leaf.x}vw`,
                        top: '-50px',
                        fontSize: `${leaf.size}rem`,
                    }}
                    initial={{
                        y: -50,
                        x: 0,
                        opacity: 0,
                        rotate: 0,
                    }}
                    animate={{
                        y: '105vh',                            // 從頂部飄到畫面底部外
                        x: [0, 40, -40, 20, 0],                // 左右搖擺軌跡 (S型飄落)
                        rotate: [0, leaf.rotate, leaf.rotate * 2], // 旋轉效果
                        opacity: [0, 1, 1, 0.8, 0],            // 淡入與淡出
                    }}
                    transition={{
                        duration: leaf.duration,
                        repeat: Infinity,                      // 無限循環
                        delay: leaf.delay,
                        ease: 'easeInOut',
                    }}
                >
                    {leaf.leafType}
                </motion.div>
            ))}
        </div>
    );
}