
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require('mongoose')
const keys = require("../config/keys.js");


const User = mongoose.model('users');
passport.serializeUser((user, done)=> {
done(null, user.id); // user.id is id of mongodb id
});

passport.deserializeUser((id, done)=> {
User.findById(id).then(user =>{
    done(null, user);
});
});

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSeceret,
            callbackURL: "/auth/google/callback",
            proxy: true
        },
        (accessToken, refreshToken, profile, done) => {
            console.log('access token', accessToken);
            console.log('access refresh', refreshToken);
            console.log('access profile:', profile);

            User.findOne({ googleId: profile.id})
            .then((existingUser)=> {
                if(existingUser){
                    done(null, existingUser);

                }else{
                    new User({
                        googleId: profile.id
                    }).save().then(user => done(null, user))
                }

            })


        }
    )
);