
class User{
    constructor(email,name,photo,userid){
        this.email=email
        this.name=name
        this.photo=photo
        this.userid=userid
    }
    toString(){
        return this.name + "==>" + this.email
    }
}

export const userConverter={
    toFirestore: (user) => {
        return {
            email: user.email,
            name: user.name,
            photo: user.photo,
            userid: user.userid,
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new User(data.email,data.name,data.photo,data.userid);
    }
}