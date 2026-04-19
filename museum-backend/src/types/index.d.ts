export interface Museum {
    id: number;
    name: string;
    location: string;
    description: string;
    establishedYear: number;
}

export interface GetAllMuseumsResponse {
    museums: Museum[];
}

export interface GetMuseumByIdResponse {
    museum: Museum;
}

export interface ErrorResponse {
    error: string;
}