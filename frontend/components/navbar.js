import Link from 'next/link'
import styles from '../styles/Home.module.css'

const Navbar = () => (
    <div className={styles.center}>
        <h1  className={styles.header}>Students Information</h1>
        <Link href="/"><a> Home </a></Link> |
        <Link href="/showStudents"><a> Students </a></Link> |
        <Link href="/register"><a> Register </a></Link>  |
        <Link href="/login"><a> Login </a></Link> |
        <Link href="/profile"><a> Profile </a></Link> | 
        <Link href="/getConfig"><a> Config </a></Link> |  
        <Link href="/logout"><a> Logout </a></Link> 
        
    </div>
)

export default Navbar