import Head from 'next/head'
import Layout from '../components/layout'
import Navbar from '../components/navbar'
import { useEffect, useState } from 'react'
import styles from '../styles/std.module.css'
import axios from 'axios'
import stdAuth from '../components/stdAuth'
import config from '../config/config'

const URL = `${config.URL}/students`
const editStudents = ({ token }) => {

    const [students, setStudents] = useState({
        list:
            [
                { id: "001", name: 'test', surname: 'kup', major: "CoE", GPA: 2.3 },
            ]
    })
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [major, setMajor] = useState('')
    const [GPA, setGPA] = useState(0)

    useEffect(() => {
        getStudents()
    }, [])

    const getStudents = async () => {
        let student = await axios.get(URL)
        setStudents(student.data)
    }
    const printStudents = () => {
        console.log('Students:', students)
        if (students.list && students.list.length)
            return (students.list.map((student, index) =>
            (<li key={index} className={styles.listItem}>
                Name : {(student) ? student.name : '-'} <br></br>
                Surname : {(student) ? student.surname : '-'}  <br></br>
                Major : {(student) ? student.major : '-'}  <br></br>
                GPA : {(student) ? student.GPA : '-'} 
                <button onClick={() => updateStudent(student.id)} className={`${styles.button} ${styles.btnEdit}`}>Update</button>
                <button onClick={() => deleteStudent(student.id)} className={`${styles.button} ${styles.btnDelete}`}> Delete </button>
            </li>)
            ))
        else {
            return (<h2>No students</h2>)
        }
    }

    const addStudent = async (name, surname, major, GPA) => {
        let result = await axios.post(URL, { name, surname, major, GPA })
        console.log(result.data)
        setStudents(result.data)
    }

    const deleteStudent = async (id) => {
        const result = await axios.delete(`${URL}/${id}`)
        console.log(result.data)
        setStudents(result.data)
    }
    const updateStudent = async (id) => {
        const result = await axios.put(`${URL}/${id}`, {
            name,
            surname,
            major,
            GPA
        })
        console.log('student id update: ', result.data)
        setStudents(result.data)
    }

    return (
        <Layout>
            <Head>
                <title>Students</title>
            </Head>
            <div className={styles.container}>
                <Navbar />
                {JSON.stringify(students.students)}
                <ul className={styles.list}>
                    {printStudents()}
                </ul>
                <h1>Add student</h1>
                <div className={styles.list}>
                    Name : <input type="text" onChange={(e) => setName(e.target.value)} className={styles.textInput} />
                    Surname : <input type="text" onChange={(e) => setSurname(e.target.value)} className={styles.textInput}/> 
                    Major : <input type="text" onChange={(e) => setMajor(e.target.value)}className={styles.textInput} /> 
                    GPA : <input type="number" onChange={(e) => setGPA(e.target.value)} className={styles.textInput}/> 
                    <button onClick={() => addStudent(name, surname, major, GPA)} className={`${styles.button} ${styles.btnAdd}`}>Add new student</button>
                </div>

            </div>
        </Layout>
    )
}

export default stdAuth(editStudents)

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}
