export declare namespace Story {

    type Difficulty = 0 | 1 | 2 | 3

    type Type =
        | {name: 'feature', difficulty: Difficulty}
        | {name: 'bug'}

    type ValidatedFields = {
        title: string
        description: string
        type: Story.Type
    }
}

export type Story = {
    id: string
    title: string
    description: string
    type: Story.Type
}
