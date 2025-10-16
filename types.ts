
export interface Content {
    type: 'list' | 'code';
    items: string[];
}

export interface Section {
    emoji: string;
    title: string;
    description: string;
    content: Content;
}

export interface Principle {
    emoji: string;
    title: string;
    description: string;
}
