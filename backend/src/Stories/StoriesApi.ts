type StoryJson = {

}

export const storiesApi = {
    routes: (deps = dependencies) => [
        createRoute(deps),
        addRoute(deps),
    ],
};
