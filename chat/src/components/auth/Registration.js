import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useForm} from "react-hook-form";
import {registration} from "../../api/auth";
import {authenticate} from "../../utils/auth";
import { useNavigate } from "react-router-dom";

function Copyright(props: any) {


    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

export default function Registration() {
    let history = useNavigate();
    const {register, handleSubmit, setError, formState: {errors}} = useForm();

    const onSubmit = data => {
        if (data.password === data.rePassword) {
            const registerData = {
                fullName: data.fullName,
                email: data.email,
                phoneNumber: data.number,
                password: data.password
            }
            console.log(registerData)
            registration(registerData).then(res => {
                authenticate(res.data.token, () => {
                    history({
                        pathname: '/home'
                    })
                })
            })
        } else {
            setError("re_password", {
                type: "server",
                message: "Passwords do not match",
            })
        }

    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">

                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Registration
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            fullWidth
                            id="fullName"
                            label="Full Name"
                            name="fullName"
                            autoComplete="fullName"
                            autoFocus
                            {...register("fullName", {required: "Full Name is required"})}
                            error={Boolean(errors.fullName)}
                            helperText={errors.fullName?.message}
                        />
                        <TextField
                            margin="normal"

                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            {...register("email", {required: "Email is required"})}
                            error={Boolean(errors.email)}
                            helperText={errors.email?.message}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="number"
                            label="Phone Number"
                            name="number"
                            autoComplete="number"
                            {...register("number", {required: "PhoneNumber is required"})}
                            error={Boolean(errors.number)}
                            helperText={errors.number?.message}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            {...register("password", {required: "Password is required"})}
                            error={Boolean(errors.password)}
                            helperText={errors.password?.message}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            name="rePassword"
                            label="Re-enter Password"
                            type="Password"
                            id="rePassword"
                            autoComplete="current-password"
                            {...register("rePassword", {required: "Re-Enter Password is required"})}
                            error={Boolean(errors.rePassword)}
                            helperText={errors.rePassword?.message}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary"/>}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            onClick={handleSubmit(onSubmit)}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to="/" href='/' variant="body2">
                                    {"Already have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
        </ThemeProvider>
    );
}