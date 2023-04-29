const ApiError = require('../error/ApiError');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Basket } = require('../models/modules');

const generateJWT = (user) => jwt.sign({id: user.id, email: user.email, role: user.role}, process.env.JWT_KEY, {expiresIn: "24h"})
class UserController {
    async registration(req, res, next) {
        const { email, password, role } = req.body;
        if (!email || !password) {
            return next(ApiError.badRequest('Password or email required'));
        }
        const candidate = await User.findOne({where: {email}});
        if (candidate) {
            return  next(ApiError.badRequest('Bunday email bor'));
        }
        const hasPassword = await bcrypt.hash(password, 5);
        const user = await User.create({email, role, password: hasPassword});
        const basket = await Basket.create({userId: user.id});
        const token = generateJWT(user);
        return res.json({token, success: true});
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({where: {email}});
            if (!user) {
                return next(ApiError.internal("Foyladanuvchi topilmadi"));
            }
            let comparePassword = bcrypt.compareSync(password, user.password);
            if (!comparePassword) {
                return next(ApiError.internal("Parol to'g'ri kelmadi"));
            }
            const token = generateJWT(user);
            return res.json({token});
        } catch (e) {
            return res.json({message: e.message, type: "catch"})
        }
    }
    async check(req, res, next) {
        try {
            return res.status(200).json({token: generateJWT(req.user)});
        } catch (e) {
            return res.status(500).json({message: e.message, type: "catch"});
        }
    }
}

module.exports = new UserController();