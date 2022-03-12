export type ApiError = {
    message: string
    field?: string
}

const create = (message: string, field?: string): ApiError =>
    ({message, field});

export const apiError = {
    create,
};
