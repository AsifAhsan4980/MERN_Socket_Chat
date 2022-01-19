import axios from "axios";

export const currentUser= (id, token) => {
    return axios.get(`http://localhost:5000/api/user/${id}`,   {
        headers: {
            'Content-Type': 'application/json',
            "Authorization":`Bearer ${token}`
        }
    })
}
export const allUserExceptCurrentUser= (id, token) => {
    return axios.get(`http://localhost:5000/api/user/except/${id}`,   {
        headers: {
            'Content-Type': 'application/json',
            "Authorization":`Bearer ${token}`
        }
    })
}


//Suggestion List
export const addFriendList= (id, token) => {
    return axios.get(`http://localhost:5000/api/user/chat/suggestionList/${id}`,   {
        headers: {
            'Content-Type': 'application/json',
            "Authorization":`Bearer ${token}`
        }
    })
}

//friend list
export const friendList= (id, token) => {
    return axios.get(`http://localhost:5000/api/user/chat/${id}`,   {
        headers: {
            'Content-Type': 'application/json',
            "Authorization":`Bearer ${token}`
        }
    })
}

//send request from suggestion
export const requestSend= (id, token, data) => {
    return axios.put(`http://localhost:5000/api/user/chat/sendRequest/${id}`, data,{
        headers: {
            'Content-Type': 'application/json',
            "Authorization":`Bearer ${token}`
        }
    })
}

//all friend Request
export const requestList= (id, token) => {
    return axios.get(`http://localhost:5000/api/user/chat/requestList/${id}`,   {
        headers: {
            'Content-Type': 'application/json',
            "Authorization":`Bearer ${token}`
        }
    })
}

//accept friend request
export const acceptFriendRequest = (id, token, data) => {
    return axios.put(`http://localhost:5000/api/user/chat/acceptFriends/${id}`, data,{
        headers: {
            'Content-Type': 'application/json',
            "Authorization":`Bearer ${token}`
        }
    })
}
