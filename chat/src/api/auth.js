import axios from "axios";


export const login = (user) => {
    console.log(user)
    return axios.post(`http://localhost:5000/api/auth/login`, user, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const registration = (user) => {
    return axios.post(`http://localhost:5000/api/auth/register`, user, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
};