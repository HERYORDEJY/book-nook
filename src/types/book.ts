export interface BookDataType {
    id:          string;
    title:       string;
    author:      string;
    price:       number;
    coverUrl:    CoverUrlDataType;
    description: string;
    rating:      number;
    reviews:     ReviewDataType[];
    stock:       number;
}

export interface CoverUrlDataType {
    thumbnail: string;
    full:      string;
}

export interface ReviewDataType {
    id:      string;
    author:  string;
    rating:  number;
    comment: string;
    date:    Date | string;
}
