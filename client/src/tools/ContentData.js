class SessionInfo {

    LoginUser;
    LoginUserID;
    isAuth;
    CollectionName;
    CollectionID;

    static initializeSession() {
        if ((this.LoginUser === undefined) && (this.isAuth === undefined) && (this.CollectionName === undefined)) {
            SessionInfo.resetSession();
        }
    }
    static getSessionUser() {
        return this.LoginUser;
    };

    static getSessionUserID() {
        return this.LoginUserID;
    };

    static getCollectionID() {
        return this.CollectionID;
    };

    static getSessionStatus() {
        return this.isAuth;
    }

    static resetSession() {
        this.CollectionName = '';
        this.LoginUserID = 0;
        this.CollectionID = 0;
        this.LoginUser = '';
        this.isAuth = false;
    }
    
    static setSessionState(auth) {
        this.isAuth = auth;
    }

    static setLoginUser(LoginUser) {
        this.LoginUser = LoginUser;
    }

    static setCollectionName(CollectionName) {
        this.CollectionName = CollectionName;
    }

    static setCollectionID(CollectionID) {
        this.CollectionID = CollectionID;
    }

    static setLoginUserID(UserID) {
        this.LoginUserID = UserID;
    }

    static logSession() {

    }

};

export default SessionInfo;