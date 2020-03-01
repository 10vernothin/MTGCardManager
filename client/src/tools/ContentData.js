


class SessionInfo {

    LoginUser;
    isAuth;

    static initializeSession() {
        if ((this.LoginUser === undefined) && (this.isAuth === undefined)) {
            SessionInfo.resetSession();
        }
    }
    static getSessionUser() {
        return this.LoginUser;
    };

    static getSessionStatus() {
        return this.isAuth;
    }

    static resetSession() {
        this.LoginUser = '';
        this.isAuth = false;
    }

    
    static changeSessionState(auth) {
        this.isAuth = auth;
    }

    static changeLoginUser(LoginUser) {
        this.LoginUser = LoginUser;
    }

};

export default SessionInfo;