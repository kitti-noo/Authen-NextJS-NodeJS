
const express = require('express'),
    app = express(),
    passport = require('passport'),
    port = process.env.PORT || 80,
    cors = require('cors'),
    cookie = require('cookie')

const bcrypt = require('bcrypt')

const db = require('./database.js')
let users = db.users

let students = {
    list:
        [
            { id: "6135512001", name: 'Kitti', surname: 'Noo', major: "CoE", GPA: 3.3 },
            { id: "6135512002", name: 'John', surname: 'Lennon', major: "SE", GPA: 2.87 },

        ]
}

require('./passport.js')

const router = require('express').Router(),
    jwt = require('jsonwebtoken')

app.use('/api', router)
router.use(cors({ origin: 'http://localhost:3000', credentials: true }))
// router.use(cors())
router.use(express.json())
router.use(express.urlencoded({ extended: false }))

//-----------------------------------------------------------------------------------------// 
//Students

router.route('/students')
    .get((req, res) => res.json(students))
    .post((req, res) => {
        console.log(req.body)
        //let id = (students.list.length)? students.list[students.list.length-1].id+1:1
        let newStudent = {}
        newStudent.id = (students.list.length) ? students.list[students.list.length-1].id+1 : 1
        newStudent.name = req.body.name
        newStudent.surname = req.body.surname
        newStudent.major = req.body.major
        newStudent.GPA  = req.body.GPA
        students = { list: [...students.list, newStudent] }
        res.json(students)
    })

router.route('/students/:student_id') //params
    .get((req, res) => {
        let id = students.list.findIndex((item) => (+item.id === +req.params.student_id))
        
        if (id === -1) {
            res.send('Not Found')
        }
        else {
            res.json(students.list[id])
        }
        

    })
    .put((req, res) => {
        let id = students.list.findIndex((item) => (+item.id === +req.params.student_id))
        if (id === -1) {
            res.send('Not Found')
        }
        else {
            students.list[id].name = req.body.name
            students.list[id].surname = req.body.surname
            students.list[id].major = req.body.major
            students.list[id].GPA = req.body.GPA
            res.json(students)
        }


    })
    .delete((req, res) => {
       
        let id = students.list.findIndex((item) => (+item.id === +req.params.student_id))
        if (id === -1) {
            res.send('Not Found')
        }
        else {
            students.list = students.list.filter((item) => +item.id !== +req.params.student_id)
            res.json(students)
        }
    })


//-----------------------------------------------------------------------------------------// 


router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        console.log('Login: ', req.body, user, err, info)
        if (err) return next(err)
        if (user) {
            const token = jwt.sign(user, db.SECRET, {
                expiresIn: (req.body.rememberme === "on") ?'7d' : '1d'
            })
            // req.cookie.token = token
            res.setHeader(
                "Set-Cookie",
                cookie.serialize("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    maxAge: 60 * 60,
                    sameSite: "strict",
                    path: "/",
                })
            );
            res.statusCode = 200
            return res.json({ user, token })
        } else
            return res.status(422).json(info)
    })(req, res, next)
})

router.get('/logout', (req, res) => { 
    res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", '', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: -1,
            sameSite: "strict",
            path: "/",
        })
    );
    res.statusCode = 200
    return res.json({ message: 'Logout successful' })
})

/* GET user profile. */
router.get('/profile',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        res.send(req.user)
    });

router.get('/foo',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        return res.json({ message: "Foo" })
    });

router.post('/register',
    async (req, res) => {
        try {
            const SALT_ROUND = 10
            const { username, email, password } = req.body 
            if (!username || !email || !password)
                return res.json( {message: "Cannot register with empty string"})
            if (db.checkExistingUser(username) !== db.NOT_FOUND)
                return res.json({ message: "Duplicated user" })

            let id = (users.users.length) ? users.users[users.users.length - 1].id + 1 : 1
            hash = await bcrypt.hash(password, SALT_ROUND)
            users.users.push({ id, username, password: hash, email })
            res.status(200).json({ message: "Register success" })
        } catch {
            res.status(422).json({ message: "Cannot register" })
        }
    })

router.get('/alluser', (req,res) => res.json(db.users.users))

router.get('/', (req, res, next) => {
    res.send('Respond without authentication');
});


// Error Handler
app.use((err, req, res, next) => {
    let statusCode = err.status || 500
    res.status(statusCode);
    res.json({
        error: {
            status: statusCode,
            message: err.message,
        }
    });
});

// Start Server
app.listen(port, () => console.log(`Server is running on port ${port}`))

