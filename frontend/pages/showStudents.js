import Head from 'next/head'
import Layout from '../components/layout'
import Navbar from '../components/navbar'
import { useEffect, useState } from 'react'
import styles from '../styles/std.module.css'
import axios from 'axios'
import stdAuth from '../components/stdAuth'
import config from '../config/config'


const URL = `${config.URL}/students`

const showStudents = ({ token }) => {

    const [students, setStudents] = useState( {
        list:
            [
                { id: "001", name: 'test', surname: 'kup', major: "CoE", GPA: 2.3 },
            ]
    })

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
               GPA : {(student) ? student.GPA : '-'}  <br></br> 
            </li>)
            ))
        else {
            return (<h2>No students</h2>)
        }
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
                
            </div>
        </Layout>
    )
}
export default stdAuth(showStudents)

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}
