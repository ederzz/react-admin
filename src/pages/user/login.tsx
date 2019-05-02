import * as React from 'react'
import { connect } from 'dva'
import { drawRibbon } from '@/utils'
import user from '@/assets/person.png'
import pwd from '@/assets/password.png'
import styles from './login.less'
import { routerRedux } from 'dva/router'

const { useRef, useEffect, useState } = React

const Login = ({
    dispatch
}) => {
    const canvasRef = useRef(null)
    const [
        account,
        setAccount
    ] = useState({
        userName: '',
        password: ''
    })

    useEffect(() => {
        const canvas = canvasRef.current
        drawRibbon(canvas)
    })

    const setUserName = ({
        target: {
            value
        }
    }) => {
        setAccount({
            ...account,
            userName: value
        })
    }
    const setPwd = ({
        target: {
            value
        }
    }) => {
        setAccount({
            ...account,
            password: value
        })
    }

    const _login = () => {
        const {
            userName,
            password
        } = account
        if (!userName || !password) {
            return null
        }
        dispatch({
            type: 'user/login',
            userName,
            password,
            callback: () => {
                dispatch(routerRedux.push('/'))
            }
        })
    }
    
    return (
        <div className={styles.login}>
            <div className={styles.logo}>logo</div>
            <div className={styles.userName}>
                <label>
                    <img src={user} />
                </label>
                <input 
                    autoComplete="off"
                    className={styles.inputEle}
                    value={ account.userName }
                    onChange={ setUserName }
                    placeholder="guest"
                />
            </div>
            <div className={styles.password}>
                <label>
                    <img src={pwd} />
                </label>
                <input 
                    autoComplete="off"
                    className={styles.inputEle}
                    type="password"
                    value={ account.password }
                    onChange={ setPwd }
                    placeholder="guest"
                />
            </div>
            <button onClick={_login} className={styles.loginBtn}>Login In</button>
            <small className={styles.tip}>
                Don't have an account?
                <a className={styles.signUp}>Sign Up</a>
            </small>
            <canvas 
                ref={ canvasRef }
                id="bg-ribbon" 
            />
        </div>
    )
}

export default connect()(Login)
