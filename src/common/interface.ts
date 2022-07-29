export enum VoteState {
    novote,
    upvoted,
    downvoted
}

export interface AllQuotes{
    curPageIdx : number
    pageSize : number
    quotes : Quote[]
}

export interface User {
    id: number,
    username: string,
    profileImg: {
        thumbnailUrl: string
    },
    karmaPoints: number
}

export interface Quote {
    id: number
    voteCount: number
    voteState: VoteState,
    text: string,
    user: User
}
