import { useRouter } from 'next/router'
import { useEffect } from 'react'

const stdAuth= WrappedComponent => {
    const Wrapper = props => {
        const { token } = props
        const router = useRouter()
        useEffect(() => {
            if (!token)
                router.push('/showStudents')
        }, [token])
        return (<WrappedComponent {...props} />)
    }
    return Wrapper
}

export default stdAuth