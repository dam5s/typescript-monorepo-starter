export type ApiError = {
    readonly message: string
    readonly field?: string
}

const create = (message: string, field?: string): ApiError =>
    ({message, field});

export const apiError = {
    create,
};
