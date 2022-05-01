import {Story} from './Stories';

type StoriesRepo = {
    add: (fields: Story.ValidatedFields) => Promise<Story>
    findAll: () => Promise<Story[]>
    remove: (id: string) => Promise<void>
}

const create = (): StoriesRepo => {
    let stories: Story[] = [];

    return {
        add: async fields => {
            const id = `${stories.length}`;
            const newStory = {id, ...fields};

            stories.push(newStory);

            return newStory;
        },
        findAll: async () => stories.slice(),
        remove: async id => {
            stories = stories.filter(story => story.id !== id);
        },
    };
};

const storiesRepo = {
    create,
    singleton,
};
