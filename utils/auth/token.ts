class Token{
    static getToken(){
        return localStorage.getItem('token')
    }
    static setToken(token:string){
        localStorage.setItem('token', token)
        localStorage.removeItem('token')
    }
    static rmToken(){
        localStorage.removeItem('token')
    }
    static setIsLogin(status:boolean){
        localStorage.setItem('isLogin', String(status))
    }
    static getIsLogin(){
        return Boolean(localStorage.getItem('isLogin'))
    }
    static login(token:string){
        Token.setToken(token)
        Token.setIsLogin(true)
    }
    static logout(){
        Token.rmToken()
        Token.setIsLogin(false)
    }
}


export default Token