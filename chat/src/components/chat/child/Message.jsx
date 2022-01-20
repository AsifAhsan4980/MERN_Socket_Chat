import "./message.css";
import moment from "moment";
import {Paper} from "@mui/material";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {currentUser} from "../../../api/user";
import {userInfo} from "../../../utils/auth";


export default function Message({message, own}) {
    const value = message.time

    function formatDate() {
        const t = moment.unix(value).fromNow()
        return t
    }
    function stringToColor(string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.substr(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }
    const {id, token} = userInfo()
    async function stringAvatar(data) {

        const n = await currentUser(data , token)
        const name = n.data.fullName
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }

    return (

        <div className={own ? "message own" : "message"}>
            {
                own && (
                    <>
                        <Avatar style={{marginRight: 10}}
                                {...stringAvatar(message.conversationId)}
                        />
                        <Paper style={{
                            maxWidth: 300,
                            minWidth: 250,
                            marginTop: -10,
                            marginRight: 35,
                            backgroundColor: "#00756a",
                            color: "white",
                            padding: 10
                        }} className="message own" align="left">
                            <Box>
                                <Typography style={{textAlign: 'right',}}>{message.message}</Typography>
                                <Typography style={{textAlign: 'right', fontSize: "small"}}>{formatDate()}</Typography>
                            </Box>
                        </Paper>
                    </>
                 )
            }

            {
                !own && (<>
                    <Avatar style={{marginLeft: 10}} {...stringAvatar(message.conversationId)}/>
                        <Paper style={{
                            maxWidth: 300,
                            minWidth: 250,
                            marginTop: -10,
                            backgroundColor: "whitesmoke",
                            marginLeft: 35,
                            color: "black",
                            padding: 10
                        }} className="own" align="right">
                            <Box>
                                <Typography style={{textAlign: 'left',}}>{message.message}</Typography>
                                <Typography style={{textAlign: 'left', fontSize: "small"}}>{formatDate()}</Typography>
                            </Box>
                        </Paper>
                </>
                    )
            }
        </div>
    );
}
