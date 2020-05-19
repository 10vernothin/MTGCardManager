class SessionInfo {

    static #LoginUser;
    static #LoginUserID;
    static #isAuth;
    static #CollectionName;
    static #CollectionID;

    static initializeSession() {
        if ((this.#LoginUser === undefined) && (this.#isAuth === undefined) && (this.#CollectionName === undefined)) {
            SessionInfo.resetSession();
        }
    }
    static getSessionUser() {
        SessionInfo.initializeSession()
        return this.#LoginUser;
    };

    static getSessionUserID() {
        SessionInfo.initializeSession()
        return this.#LoginUserID;
    };

    static getCollectionName() {
        SessionInfo.initializeSession()
        return this.#CollectionName;
    };

    static getCollectionID() {
        SessionInfo.initializeSession()
        return this.#CollectionID;
    };

    static getSessionStatus() {
        SessionInfo.initializeSession()
        return this.#isAuth;
    }

    static resetSession() {
        this.#CollectionName = '';
        this.#LoginUserID = 0;
        this.#CollectionID = 0;
        this.#LoginUser = '';
        this.#isAuth = false;
    }

    static getSessionInfo() { 
        SessionInfo.initializeSession()
        return ({
            ColName: this.#CollectionName, 
            LoginID: this.#LoginUserID, 
            ColID: this.#CollectionID, 
            LoginName: this.#LoginUser, 
            isAuth: this.#isAuth})
    }
    
    static setSessionState(auth) {
        SessionInfo.initializeSession()
        this.#isAuth = auth;
    }

    static setLoginUser(LoginUser) {
        SessionInfo.initializeSession()
        this.#LoginUser = LoginUser;
    }

    static setCollectionName(CollectionName) {
        SessionInfo.initializeSession()
        this.#CollectionName = CollectionName;
    }

    static setCollectionID(CollectionID) {
        SessionInfo.initializeSession()
        this.#CollectionID = CollectionID;
    }

    static setLoginUserID(UserID) {
        SessionInfo.initializeSession()
        this.#LoginUserID = UserID;
    }

};

export default SessionInfo;