import React, {useEffect, useRef, useState} from 'react';
import { useForm } from "react-hook-form"
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import Container from "@mui/material/Container";
import {
    currentUser,
    friendList,
    requestSend, acceptFriendRequest
} from "../../api/user";
import {userInfo} from "../../utils/auth";

import {useNavigate, useParams} from "react-router-dom";
import {getMessage, messageStore} from "../../api/message";
import Message from "./child/Message";
import moment from "moment";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    chatSection: {
        width: '100%',
        height: '80vh'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '70vh',
        overflowY: 'auto'
    }
});

const Chat= (props) => {




    const receiverId = props.conversation.id2
    const { register, handleSubmit } = useForm({ shouldUseNativeValidation: true });
    const [user, setUser] = useState({})
    const [friends, setFriends] = useState([])
    const [messagess, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("");
    const [currentChat, setCurrentChat] = useState("");
    const {id, token} = userInfo()

    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [fireMessage, setFireMessage] = useState([])
    useEffect(async () => {
        await currentUser(id, token).then(res => {
            setUser(res.data)
        })
    }, [])
    //Get all Friends
    useEffect(async () => {
        await friendList(id, token).then(res => {
            setFriends(res.data)
        })
    }, [friends])
    //get Messages

    const getMyMessages = async () => {
        await getMessage(id, receiverId, token).then(res => {
            setFireMessage(res.data)
            setMessages(res.data[0].messages)
        })
    }
    useEffect(async () => {
        // ← the trick
       await getMyMessages()

    }, [fireMessage])
    console.log(messagess, fireMessage)

    // console.log(messages)
    const onSubmit = async (data) => {
        try {
            const msg = {
                conversationId: id,
                chatIds: [id, receiverId],
                messageBody: data.messageBody,
                time: moment().unix()
            }
            console.log(msg)
            await messageStore(id, token, msg).then(res => {
                setMessages(res.data[0].messages)
                setNewMessage("")
            })

        } catch (err) {
            console.log(err)
        }
    }







    const RenderFunction = () => {


        return (
            <>
                <Container >
                    <Grid container>
                    </Grid>
                    <Grid container >
                        <Grid xs={12} item>
                            {messagess?.map((data, index)=>(
                                <Message key={index} message={data} own={data.conversationId===id}/>
                            ))}

                            <Divider/>

                            <Grid container style={{padding: '20px'}}>
                                <Grid item xs={11}>
                                    <form >
                                        <TextField
                                            autoFocus
                                            placeholder="Type your message"
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            {...register("messageBody", { required: "Please enter your first name." })}
                                        />
                                    </form>
                                </Grid>
                                <Grid xs={1} align="right">
                                    <Fab color="primary" aria-label="add"
                                         onClick={handleSubmit(onSubmit)}
                                    ><SendIcon/></Fab>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </>
        )
    }

    return (
        <>
            <RenderFunction/>
        </>
    )
}

export default Chat