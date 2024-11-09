interface AccessoryConfig {
    offset: [number, number];
    scale: number;
}

export const accessoriesConfig: Record<string, Record<string, AccessoryConfig>> = {
    'bored_apes': {
        'hat': {
            offset: [120, 0],
            scale: 0.5,
        },
        't-shirt': {
            offset: [155, 260],
            scale: 0.3,
        },
    },
    'oxford': {
        'hat': {
            offset: [0, 0],
            scale: 1.0,
        },
    },
}