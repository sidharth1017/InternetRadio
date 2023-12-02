const otpService = require('../services/otp-service');
const hashService = require('../services/hash-service');
const userService = require('../services/user-service');
const tokenService = require('../services/token-service');
const UserDto = require('../dtos/user-dto');

class AuthController {
    async sendOtp(req, res) {
        const { phone, email } = req.body;
        const phoneEmail = phone || email;

        if(!phoneEmail){
            return res.status(400).json({message: 'Phone no. or email is required!'})
        }

        const otp = await otpService.generateOtp();     
        const ttl = 1000 * 60 * 5;
        const expires = Date.now() + ttl;
        const data = `${phoneEmail}.${otp}.${expires}`;
        const hash = hashService.hashOtp(data);

        try{
            if (email){
                await otpService.sendByMail(email, otp);
            }else {
                // await otpService.sendBySms(phone, otp);
            }

            return res.status(200).json({
                hash: `${hash}.${expires}`,
                phone,
                email,
            })
        }
        catch(err){
            console.log(err);
            return res.status(500).json({message: 'Message sending failed'})
        }

        // res.json({hash:hash});
    }

    async verifyOtp(req, res) {
        const { otp, hash, phone, email } = req.body;
        const phoneEmail = phone || email;

        if(!otp || !hash || !phoneEmail){
            res.status(400).json({message: "All fields are required!"});
        }

        const [hashedOtp, expires] = hash.split('.');
        if (Date.now() > +expires) {
            res.status(400).json({message: 'OTP expired!'});
        }

        const data = `${phoneEmail}.${otp}.${expires}`;   
        const isValid = otpService.verifyOtp(hashedOtp, data);
        
        if(!isValid) {
            res.status(400).json({message: "Invaild OTP"})
        }

        let user;

        try {
            user = await userService.findUser({email, phone});
            if(!user) {
                user = await userService.createUser({email, phone});
            }
        } catch(err){
            res.status(500).json({ message: 'Db Error'})
        }

        const { accessToken, refreshToken } = tokenService.genrateTokens({_id: user._id, activated: false });

        await tokenService.storeRefreshToken(refreshToken, user._id);

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        const userDto = new UserDto(user);
        res.json({ user: userDto, auth: true });

    }

    async refresh(req, res){
        // get refresh token from cookie
        const { refreshToken: refreshTokenFromCookie } = req.cookies;

        // check if token is valid
        let userData;
        try{
            userData =  await tokenService.verifyRefreshToken(refreshTokenFromCookie);
        }catch(err) {
            return res.status(401).json({message: "Invalid Token"});
        }

        // Check if token is in db
        try{
            const token = await tokenService.findRefreshToken(userData._id, refreshTokenFromCookie);
            if(!token){
                return res.status(401).json({message: "Invalid Token"});
            }

        }catch(err) {
            return res.status(500).json({message: "Internal Error"});
        }

        // Check if valid user
        const user = await userService.findUser({_id: userData._id});
        if(!user){
            return res.status(404).json({message: "No User"});
        }

        // genrate new tokens
        const { refreshToken, accessToken } = await tokenService.genrateTokens({_id: userData._id });

        // Update refresh token 
        try{
           await tokenService.updateRefreshToken(userData._id, refreshToken)
        }catch(err){
            return res.status(500).json({message: "Internal Error"});
        }

        // put in cookie        
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        // response send 
        const userDto = new UserDto(user);
        res.json({ user: userDto, auth: true });

    }

    async logout(req, res){
        const { refreshToken } = req.cookies;

        // delete refresh token from db
        await tokenService.removeToken(refreshToken); 
        // delete cookies
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        res.json({user: null, auth: false})

    }

}

module.exports = new AuthController();