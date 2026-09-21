
export class UnauthorizedError extends Error {
    constructor(message = "Authentication required") {
        super(message);

        this.name = "UnauthorizedError";
    }
}

export class ForbiddenError extends Error {
    constructor(message = "Access denied") {
        super(message);

        this.name = "ForbiddenError";
    }
}
