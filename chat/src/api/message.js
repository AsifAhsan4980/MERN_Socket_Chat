import axios from "axios";

//send request from suggestion
export const messageStore= (id, token, data) => {
    return axios.put(`http://localhost:5000/api/user/messages/${id}`, data,{
        headers: {
            'Content-Type': 'application/json',
            "Authorization":`Bearer ${token}`
        }
    })
}

export const getMessage= (id1, id2, token) => {
    return axios.get(`http://localhost:5000/api/user/messages/get/?id1=${id1}&id2=${id2}`,{
        headers: {
            "Authorization":`Bearer ${token}`
        }
    })
}
