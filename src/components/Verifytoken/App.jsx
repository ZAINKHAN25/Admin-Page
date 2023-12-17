import axios from "axios";
import { useEffect, useState } from "react";
import myApi from "../../myApi.js";
import { useLocation, useNavigate } from "react-router-dom";

function App() {
    const navigateTo = useNavigate();
    const location = useLocation();

    let [successTxt, setSuccessTxt] = useState('');
    let [errTxt, setErrTxt] = useState('');

    useEffect(() => {
        let isMounted = true;  // Flag to track component mount status
    
        const fetchData = async () => {
            const params = new URLSearchParams(location.search);
            const tokensearch = params.get('token');
            console.log(tokensearch, "Token wala data");
    
            try {
                const res = await axios.post(`${myApi}verfiy-token`, { logintoken: tokensearch });
                const apiData = res?.data;
                console.log(apiData);
    
                // Check if the component is still mounted before updating state
                if (isMounted) {
                    console.log(res.status, "res status");
                    if (res.status === 200) {
                        setSuccessTxt('Your account has been successfully completed');
                        setErrTxt('');
                        // console.log('Your account has been successfully completed');
                    } else if (res.status === 401) {
                        setErrTxt(apiData || 'Account already has been made');
                        setSuccessTxt('');
                        // console.log('Account already has been made');
                    }
                }
            } catch (error) {
                console.error(error.response.data);
    
                // Check if the component is still mounted before updating state
                if (isMounted) {
                    setErrTxt(error.response.data);
                }
            }
        };
    
        fetchData();
    
        // Cleanup function to update the mounted status
        return () => {
            isMounted = false;
        };
    }, [location.search]);
    

    return (
        <div className="container mt-5">
            <div className="fs-3 text-danger">{errTxt}</div>
            <div className="fs-3 text-success">{successTxt}</div>
            <div className="mt-5" onClick={() => navigateTo('/login')}>
                <button className="btnofnotfound"><i className="fa-solid fa-arrow-left"></i> Back to Login Page</button>
            </div>
        </div>
    );
}

export default App;
