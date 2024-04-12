const twilio = require('twilio')
const nodemailer = require('nodemailer')

const signToken = require('../../services/authorization/signToken')
const hashing = require('../../services/authentication/hashing')
const authCompare = require('../../services/authentication/authCompare')
const UserService = require('./service')

class UserController {
    constructor() {
        this.service = new UserService()
    }

    async get(req, res) {
        const { isError, result } = await this.service.getAll()
        if (isError) return res.status(500).send('Something went wrong!')

        res.json(result)
    }

    async getMe(req, res) {
        const { isError, result } = await this.service.getById(req.userId)
        if (isError) return res.status(500).send('Something went wrong!')

        res.json(result)
    }

    async getUserById(req, res) {
        let request = Object.keys(req.body).length > 0 ? req.body : req.query

        if (!request.userId) return res.status(406).send('all request needed')

        const { isError, result } = await this.service.getById(request.userId)
        if (isError) return res.status(500).send('Something went wrong!')

        res.json(result)
    }

    async getUserByUserName(req, res) {
        let request = Object.keys(req.body).length > 0 ? req.body : req.query

        if (!request.userName) return res.status(406).send('all request needed')

        let sql = 'SELECT * FROM users WHERE UserName = ?'
        const { isError, result } = await this.service.smartQuery(
            sql,
            request.userName
        )
        if (isError) return res.status(500).send('Something went wrong!')

        res.json(result)
    }

    async create(req, res) {
        let request = Object.keys(req.body).length > 0 ? req.body : req.query

        if (
            !(
                request.userName &&
                request.password &&
                request.confirmedPassword
            )
        )
            return res.status(406).send('all request needed')

        if (request.password !== request.confirmedPassword)
            return res.status(400).send('password not confirmed')

        let sql = 'SELECT * FROM users WHERE UserName = ?'
        const { isError: selectIsError, result: selectResult } =
            await this.service.smartQuery(sql, request.userName)
        if (selectIsError) return res.status(500).send('Something went wrong!')
        if (selectResult.length)
            return res.status(400).send('Username is already taken')

        let random = Math.random()
        let url = `/profile${
            (random * 10 - ((random * 10) % 1)) % 4
        }.webp`
        let currentDate = new Date()
        let user = {
            UserName: request.userName,
            ProfilePicture: url,
            PhoneNumber: request.phoneNumber || null,
            Email: request.email || null,
            Password: await hashing(request.password),
            CreatedDate: new Date(),
        }
        const { isError: finalIsError, result: finalResult } =
            await this.service.create(user)
        if (finalIsError) return res.status(500).send('Something went wrong!')

        res.header({ token: signToken(req, res, finalResult.id) }).json(
            finalResult
        )
    }

    async update(req, res) {
        let request = Object.keys(req.body).length > 0 ? req.body : req.query

        const { isError: selectIsError, result: result } =
            await this.service.getById(req.userId)
        if (selectIsError) return res.status(500).send('something went wrong')
        if (!result) return res.status(406).send('no user')

        let user = {
            UserName: request.userName || result.UserName,
            PhoneNumber: request.phoneNumber || result.PhoneNumber,
            Email: request.email || result.Email,
            FullName: request.fullName || result.FullName,
            UpdatedDate: new Date(),
        }
        const { isError: finalIsError, result: finalResult } =
            await this.service.updateById(req.userId, user)
        if (finalIsError) return res.status(500).send('Something went wrong!')

        res.json(finalResult)
    }

    async changePassword(req, res) {
        let request = Object.keys(req.body).length > 0 ? req.body : req.query

        if (!(request.password && request.confirmedPassword))
            return res.status(406).send('all request needed')

        if (request.password !== request.confirmedPassword)
            return res.status(400).send('password not confirmed')

        let user = {
            Password: hashing(request.password),
            UpdatedDate: new Date(),
        }
        const { finalIsError, finalResult } = await this.service.updateById(
            req.userId,
            user
        )
        if (finalIsError) return res.status(500).send('Something went wrong!')

        res.json(finalResult)
    }

    async changeProfilePicture(req, res) {
        let user = {
            ProfilePicture: `/profiles/${req.file.filename}`,
            UpdatedDate: new Date(),
        }
        const { isError, result } = await this.service.updateById(
            req.userId,
            user
        )
        if (isError) return res.status(500).send('Something went wrong!')

        res.json(result)
    }

    async sendCodeToPhone(req, res) {
        const { isError, result } = await this.service.getById(req.userId)
        if (isError) return res.status(500).send('Something went wrong!')

        let number = Math.random()
        let code = number * 10000 - ((number * 10000) % 1)
        const accountSid = 'AC19886d848d33ee1085d319878d1e52d2'
        const authToken = 'c4e7c126a07b29eadc8305dbc404dd39'
        const client = twilio(accountSid, authToken)

        let data = {
            VerificationCode: code,
        }

        const { finalIsError, finalResult } = await this.service.updateById(
            req.userId,
            data
        )
        if (finalIsError) return res.status(500).send('something went wrong')

        client.messages
            .create({
                body: `Your verification code from fnana is ${code}`,
                to: `+${result[0].PhoneNumber}`, // Text your number
                from: '+13613264572', // From a valid Twilio number
            })
            .then()
            .catch((error) => console.log('sth went wrong!'))

        res.json(finalResult)
    }

    async sendCodeToEmail(req, res) {
        const { isError, result } = await this.service.getById(req.userId)
        if (isError) return res.status(500).send('Something went wrong!')

        let number = Math.random()
        let code = number * 10000 - ((number * 10000) % 1)

        let data = {
            VerificationCode: code,
        }

        const { finalIsError, finalResult } = await this.service.updateById(
            req.userId,
            data
        )
        if (finalIsError) return res.status(500).send('something went wrong')

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                clientId:
                    '1022540122382-7n1ieib5p6vnqeqfsgv63g73fp215oo9.apps.googleusercontent.com',
                clientSecret: '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',
            },
        })
        // Define the email options
        const mailOptions = {
            from: 'pseudosocial2023@gmail.com',  //the email should be changed
            to: result.Email,
            subject: 'Account Verification',
            text: `Your verification code is: ${
                code.length < 4 ? 0 : ''
            } ${code}`,
            auth: {
                user: 'pseudosocial2023@gmail.com',
                refreshToken:
                    '1//04cqajXSfCudgCgYIARAAGAQSNwF-L9IrWMpbXKiQe9DdO3WgYlhaeLhrmWdfYeThTy-spM7b28jFlgxUVgXjnJ2P70HllR7ANJU',
                expires: 1484314697598,
            },
        }

        // Send the email using the transporter object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(500).send('Email error')
                console.error(error)
            } else {
                res.status(200).send('check email')
                console.log('Email sent: ' + info.response)
            }
        })
    }

    async checkVerificationCode(req, res) {
        let request = Object.keys(req.body).length > 0 ? req.body : req.query

        if (!request.code) return res.status(406).send('all request needed')

        const { isError, result } = await this.service.getById(req.userId)
        if (isError) return res.status(500).send('Something went wrong!')

        if (result.VerificationCode !== require.code)
            return res.status(400).send('wrong code')

        res.send('code correct')
    }

    async loginUser(req, res) {
        let request = Object.keys(req.body).length > 0 ? req.body : req.query
        console.log({ request })

        if (!(request.userName && request.password))
            return res.status(406).send('all request needed')

        let sql = `SELECT * FROM users WHERE UserName = ?`
        const { isError, result, err } = await this.service.smartQuery(
            sql,
            request.userName
        )
        if (isError) return res.status(500).send('Something went wrong!')
        if (!result.length) return res.status(400).send('no user')
        
        if(result[0].ExpiresIn <= new Date()) return res.status(400).send('user expired')
        
        const validPass = await authCompare(
            request.password,
            result[0].Password
        )
        if (!validPass) return res.status(400).send('wrong password')

        res.header({ token: signToken(req, res, result[0].id) }).json(result)
    }

    async activate(req, res) {
        let request = Object.keys(req.body).length > 0 ? req.body : req.query

        if (!request.userId) return res.status(406).send('all request needed')

        let user = {
            State: 1,
            UpdatedDate: new Date(),
            DeletedDate: null,
        }
        const { isError, result } = await this.service.updateById(
            request.userId,
            user
        )
        if (isError) return res.status(500).send('Something went wrong!')

        res.json(result)
    }

    async deactivate(req, res) {
        let request = Object.keys(req.body).length > 0 ? req.body : req.query

        if (!request.userId) return res.status(406).send('all request needed')

        let user = {
            State: 0,
            DeletedDate: new Date(),
        }
        const { isError, result } = await this.service.updateById(
            request.userId,
            user
        )
        if (isError) return res.status(500).send('Something went wrong!')

        res.json(result)
    }

    async delete(req, res) {
        let request = Object.keys(req.body).length > 0 ? req.body : req.query

        if (!request.userId) return res.status(406).send('all request needed')

        const { isError, result } = await this.service.deleteById(
            request.userId
        )
        if (isError) return res.status(500).send('Something went wrong!')

        res.json(result)
    }
}

module.exports = UserController
