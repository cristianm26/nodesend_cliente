import React, { useReducer } from 'react';
import authContext from './authContext';
import authReducer from './authReducer';

import {
    REGISTRO_EXITOSO,
    USUARIO_AUTENTICADO,
    REGISTRO_ERROR,
    LIMPIAR_ALERTA,
    LOGIN_EXITOSO,
    LOGIN_ERROR,
    CERRAR_SESION
} from '../../types/index.js';
import clienteAxios from '../../config/axios';
import tokenAuth from '../../config/tokenAuth';






const AuthState = ({ children }) => {

    // Definir un state inicial
    const initialState = {
        token: typeof window !== 'undefined' ? localStorage.getItem('token') : '',
        autenticado: null,
        usuario: null,
        mensaje: null

    }

    // Definir el reducer
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Registrar nuevos Usuarios
    const registrarUsuario = async (datos) => {
        try {
            const respuesta = await clienteAxios.post('/api/usuarios', datos);
            dispatch({
                type: REGISTRO_EXITOSO,
                payload: respuesta.data.msg
            })


        } catch (error) {
            // console.log(error.response.data.msg)
            dispatch({
                type: REGISTRO_ERROR,
                payload: error.response.data.msg
            })

        }
        //console.log(datos)
        // Limpiar la Alerta despues de 3 segundos
        setTimeout(() => {
            dispatch({
                type: LIMPIAR_ALERTA,

            })
        }, 3000);
    }

    // Autenticar Usuario
    const iniciarSesion = async (datos) => {
        try {
            const respuesta = await clienteAxios.post('/api/auth', datos);
            dispatch({
                type: LOGIN_EXITOSO,
                payload: respuesta.data.token
            })
        } catch (error) {
            console.log(error.response)
            dispatch({
                type: LOGIN_ERROR,
                //payload: error.response.data.msg
            })

        }
        // Limpiar la Alerta despues de 3 segundos
        setTimeout(() => {
            dispatch({
                type: LIMPIAR_ALERTA,

            })
        }, 3000);
    }

    // Retorne el usuario autenticado en base al JWT
    const usuarioAutenticado = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            tokenAuth(token)
        }
        try {
            const respuesta = await clienteAxios.get('/api/auth');
            if (respuesta.data.usuario) {
                dispatch({
                    type: USUARIO_AUTENTICADO,
                    payload: respuesta.data.usuario
                })
            }

        } catch (error) {
            console.log(error.response)
            dispatch({
                type: LOGIN_ERROR,
                payload: error.response.data.msg
            })

        }
    }


    // Cerrar Sesión
    const cerrarSesion = () => {
        dispatch({
            type: CERRAR_SESION
        })
    }

    return (
        <authContext.Provider
            value={{
                token: state.token,
                autenticado: state.autenticado,
                usuario: state.usuario,
                mensaje: state.mensaje,
                registrarUsuario,
                usuarioAutenticado,
                iniciarSesion,
                cerrarSesion
            }}
        >
            {children}
        </authContext.Provider>
    )
}
export default AuthState;