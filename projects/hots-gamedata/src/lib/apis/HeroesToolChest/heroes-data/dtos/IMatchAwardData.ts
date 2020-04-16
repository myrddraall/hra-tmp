export interface IMatchAwardsDTO{
    [key:string]: IMatchAwardDTO;
}

export interface IMatchAwardDTO{
    gameLink: string;
    tag: string;
    mvpScreenIcon: string;
    scoreScreenIcon: string;
}