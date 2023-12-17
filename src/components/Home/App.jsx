/* global $ */


import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import myApi from '../../myApi.js';
import { useNavigate } from 'react-router-dom';
import { ref, storage, getDownloadURL, uploadBytesResumable } from "../../firebaseConfig.js"


function App() {
    const navigateTo = useNavigate();
    const loginLocalStorage = JSON.parse(localStorage.getItem('logintoken'));

    const [studentsData, setstudentsData] = useState([]);
    const [cuurentSinglestudent, setcuurentSinglestudent] = useState([]);
    const [studentsNameInput, setstudentsNameInput] = useState('');
    const [studentdescriptionInput, setstudentdescriptionInput] = useState('');
    const [studentrupeesInput, setstudentrupeesInput] = useState('');
    const [searchInput, setsearchInput] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [course, setcourse] = useState([]);
    const [selectedcourse, setselectedcourse] = useState();
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState('');
    const [progress, setProgress] = useState(0);
    const [errTxt, seterrTxt] = useState('');

    useEffect(() => {
        gettingdata();
        if (!loginLocalStorage) {
            navigateTo('login');
        }
    }, []);

    async function addStudentData() {
        try {
            const imagefile = document.querySelector('#uploadimage');
            const storageRef = ref(storage, `image/${imagefile.files[0].name}`);
    
            const uploadTask = uploadBytesResumable(storageRef, imagefile.files[0]);
    
            const imgurl = await new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                    },
                    (error) => {
                        console.log(error);
                        reject(error);
                    },
                    async () => {
                        try {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            console.log('File available at', downloadURL);
                            resolve(downloadURL);
                        } catch (error) {
                            reject(error);
                        }
                    }
                );
            });
    
            console.log(selectedcourse);
            const res = await axios.post(`${myApi}add-student`, {
                studentname: studentsNameInput,
                pic: imgurl || '',
                course: selectedcourse,
            });
    
            const resTwo = await res.data;
            $('#staticBackdrop').modal('hide');
            gettingdata();
        } catch (error) {
            console.error(error);
        }
    }
    

    async function gettingdata() {
        try {
            var res = await axios.get(`${myApi}getallstudents`);
            var data = await res.data;
            setstudentsData(data);
        } catch (error) {
            console.log(error);
        }
    }

    async function gettingallcourses() {
        try {
            var res = await axios.get(`${myApi}getallcourse`);
            var data = await res.data;
            setcourse(data);
        } catch (error) {
            console.log(error);
        }
    }
    gettingallcourses();

    function Singlestudentdata({ data }) {
        return (
            <div
                onClick={() => {
                    setcuurentSinglestudent(data);
                }}
                className='singleData d-flex'
                data-bs-toggle='modal'
                data-bs-target='#Singlestudent'
            >
                <p style={{ flex: 3 }}>{data.studentname}</p>
                <p style={{ flex: 1 }}>{data.id}</p>
                <p style={{ flex: 1 }}>{data.course}</p>
            </div>
        );
    }

    async function addstudentData() {
        const date = new Date();

        if (studentsNameInput === '' || studentdescriptionInput === '' || studentrupeesInput === '') {
            seterrTxt('Please fill out the form completely');
            setTimeout(() => {
                seterrTxt('');
            }, 4000);
        } else {
            try {
                var res = await axios.post(`${myApi}add-ptnt-data`, {
                    studentName: studentsNameInput,
                });

                var resTwo = await res.data;
                $('#staticBackdrop').modal('hide');
                gettingdata();
            } catch (error) {
                console.log(error);
            }
        }
    }

    async function seacrhFoo() {
        try {
            var res = await axios.post(`${myApi}search-student`, { logintoken: loginLocalStorage, search: searchInput });
            var restwo = await res.data.result;
            setstudentsData(restwo);
        } catch (error) {
            console.log(error);
            if (searchInput === '') {
                gettingdata();
            } else {
                setstudentsData([]);
            }
        }
    }

    return (
        <div className='homePage'>
            {/* modal of Add data */}
            <div
                className='modal fade'
                id='staticBackdrop'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                tabIndex='-1'
                aria-labelledby='staticBackdropLabel'
                aria-hidden='true'
            >
                <div className='modal-dialog modal-dialog-scrollable'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h1 className='modal-title fs-2' id='staticBackdropLabel'>
                                Add Student Data
                            </h1>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div className='modal-body add-studentData-body'>
                            <div className='studentNamediv d-flex justify-content-center'>
                                <h4>Student Name:</h4>
                                <input
                                    value={studentsNameInput}
                                    onChange={(e) => setstudentsNameInput(e.target.value)}
                                    className='form-control'
                                    placeholder='Please enter student Name'
                                    type='text'
                                />
                            </div>
                            <div className='studentrupeesdiv d-flex justify-content-center'>
                                <h4>Student Course</h4>
                                <select className='form-select' onChange={(e) => setselectedcourse(e.target.value)} aria-label='Default select example'>
                                    {course == [] ? (`<div>Something went wrong</div>`) : course.map((x, i) => {
                                        return (
                                            <option>{x.coursename}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className='studentdescriptiondiv d-flex justify-content-center'>
                                <h4>Student Image:</h4>
                                <input type='file' id="uploadimage" />
                            </div>
                            <div style={{ color: 'red' }}>{errTxt}</div>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                                Close
                            </button>
                            <button type='button' className='btn btn-primary' onClick={addStudentData}>
                                Add Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* modal of single student */}
            <div
                className='modal fade'
                id='Singlestudent'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                tabIndex='-1'
                aria-labelledby='staticBackdropLabel'
                aria-hidden='true'
            >
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h1 className='modal-title fs-3' id='staticBackdropLabel'>
                                {cuurentSinglestudent.studentName}'s data
                            </h1>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>

                        <div className='modal-body singlestudentDataModalBody d-flex flex-column'>
                            <span>
                                student Name: <span className='mainWordsinSPDMB'>{cuurentSinglestudent.studentName}</span>
                            </span>
                            <span>
                                student Id: <span className='mainWordsinSPDMB'>{cuurentSinglestudent.studentrupees}</span>
                            </span>
                            <span>
                                student Description: <span className='mainWordsinSPDMB'>{cuurentSinglestudent.studentdescription}</span>
                            </span>
                            <span>
                                Date: <span className='mainWordsinSPDMB'>{cuurentSinglestudent.studentmonth}/{cuurentSinglestudent.studentday}/{cuurentSinglestudent.studentyear}</span>
                            </span>
                        </div>

                        <div className='modal-footer'>
                            <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='homeWrapper'>
                <div className='headingArea d-flex align-items-center'>
                    <h3 style={{ color: '#6f11f5' }}> All students</h3>
                    <div>
                        <button className='addPtnBtn' data-bs-toggle='modal' data-bs-target='#staticBackdrop'>
                            Add Student
                        </button>
                        <button
                            className='searchBtnOfstudent ms-3'
                            onClick={() => {
                                localStorage.setItem('logintoken', JSON.stringify(''));
                                navigateTo('/login');
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className={`searchDiv d-flex ${isSearchFocused ? 'focused' : ''}`}>
                    <input
                        className='searchInputOfstudent'
                        type='text'
                        placeholder='Search'
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        onChange={(e) => setsearchInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                seacrhFoo();
                            }
                        }}
                        value={searchInput}
                    />

                    <button className='searchBtnOfstudent' onClick={seacrhFoo}>
                        <i className='fa-solid fa-magnifying-glass me-1'></i> Search
                    </button>
                </div>

                <div className='allProducts my-4 px-4 py-3'>
                    <div className='navofstudentData d-flex mb-3'>
                        <h5 style={{ flex: 3 }}>Name</h5>
                        <h5 style={{ flex: 1 }}>Student Id</h5>
                        <h5 style={{ flex: 1 }}>Student Course</h5>
                    </div>
                    {!studentsData.length ? 'No data!' : studentsData.map((x, i) => <Singlestudentdata key={i} data={x} />)}
                </div>
            </div>
        </div>
    );
}

export default App;
