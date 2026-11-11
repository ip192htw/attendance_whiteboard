'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// 隨機數輔助函式
const random = (min: number, max: number) => Math.random() * (max - min) + min;

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
    const [leaves, setLeaves] = useState<Leaf[]>([]);

    useEffect(() => {
        // 於 Client 端產生隨機的葉子資料
        const generatedLeaves: Leaf[] = Array.from({ length: count }).map((_, i) => ({
            id: i,
            x: random(0, 100),
            size: random(1.2, 2.5),
            duration: random(12, 24),
            delay: random(0, 3),
            rotate: random(0, 360),
            leafType: LEAF_TYPES[Math.floor(Math.random() * LEAF_TYPES.length)],
        }));
        setLeaves(generatedLeaves);
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
                        y: '105vh',                             // 從頂部飄到畫面底部外
                        x: [0, 40, -40, 20, 0],                  // 左右搖擺軌跡 (S型飄落)
                        rotate: [0, leaf.rotate, leaf.rotate * 2], // 旋轉效果
                        opacity: [0, 1, 1, 0.8, 0],             // 淡入與淡出
                    }}
                    transition={{
                        duration: leaf.duration,
                        repeat: Infinity,                        // 無限循環
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