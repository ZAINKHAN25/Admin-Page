import axios from 'axios';
import './App.css';

import { useNavigate } from 'react-router-dom';
import myApi from '../../myApi';
import { useState } from 'react';

// this is comment

function App() {
    let [myemail, setmyemail] = useState('')
    let [txterr, settxterr] = useState('')
    let [myPassword, setmyPassword] = useState('')


    async function loginfoo() {
        try {
            var res = await axios.post(`${myApi}login-admin`, { email: myemail, password: myPassword })
            console.log(res);
            const restwo = await res.data;

            localStorage.setItem('logintoken', JSON.stringify(restwo.logintoken));
            navigateTo('/')
        } catch (error) {
            console.log(error);
            settxterr("Invalid error or Password")
            setTimeout(()=>{
                settxterr()
            }, 4000)
        }
    }

    const navigateTo = useNavigate();
    return (
        <div className='loginpage'>
            <div className="logincard">
                <div className='signUpOrSignInDiv'>
                    <button className='acitvebtn'>
                        <span><i className="fa-solid fa-user"></i></span>
                        <span>Admin Sign In Page</span>
                    </button>
                </div>
                <div className='inputDivlogin UserNameInputDiv'>
                    <i className="fa-regular fa-envelope"></i>
                    <input placeholder='Email' value={myemail} onChange={(e) => setmyemail(e.target.value)} type="text" />
                </div>
                <div className='inputDivlogin PassworInputDiv'>
                    <i className="fa-solid fa-keyboard"></i>
                    <input placeholder='Password' value={myPassword} onChange={(e) => setmyPassword(e.target.value)} type="password" />
                </div>
                <div>
                    <span style={{ color: '#6f11f5', cursor: 'pointer', textDecoration: 'underline' }}>Forget Password?</span>
                </div>
                <div className='my-3'>
                    <input className="form-check-input me-1 ms-3" type="checkbox" value="" id="flexCheckDefault" />
                    <span>Remember Me</span>
                </div>
                <div style={{color: 'red'}}>
                    {txterr}
                </div>
                <div className='loginBtn mt-2' onClick={loginfoo}>
                    <button><i className="fa-solid fa-right-to-bracket me-1"></i> Sign In</button>
                </div>
            </div>
        </div>
    )
}

export default App;