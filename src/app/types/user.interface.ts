export interface IUserSignUp {
    username: string, 
    email: string, 
    password: string, 
    confirmPassword: string
}


export interface IUserLogin {
    username: string, 
    password: string,
    [key: string]: string
}

export interface IToken {
    access_token: string
    refresh_token: string
    tokenType: string
}

export interface IUser {
    id: number
    username: string
    roles: string[]
}