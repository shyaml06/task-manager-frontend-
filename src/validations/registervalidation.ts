import * as yup from 'yup'



export const registerValidation = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required'),
    confirmPassword: yup.string().required('Confirm password is required'),
})

