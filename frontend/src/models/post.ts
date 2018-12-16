export interface Post {
    id: number, // id of the post
    content: string, // content of the post
    tags: number[], // ids of the users tagged
    author?: number, // id of the author
    createdTime?: string, // post creation time
    likes?: number[], // array of ids of users
    comments?: number[] // ids of the comments
}