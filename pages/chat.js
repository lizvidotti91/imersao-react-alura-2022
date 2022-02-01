import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import { useRouter } from 'next/router';
import appConfig from '../config.json';

import { createClient } from '@supabase/supabase-js';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzY2OTU3MSwiZXhwIjoxOTU5MjQ1NTcxfQ.xQZKGkkZjrHwl0u_f66QGlnUF6xLmOkBJq5KS8h3Y8I';
const SUPABASE_URL = 'https://gzdolgyubfmflpvnubar.supabase.co';
const supabase_client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function ChatPage() {
    const [message, setMessage] = React.useState('');
    const [list, setList] = React.useState([]);
    const query = useRouter();
    const name = query.query.name;

    // Tudo que foge do fluxo padrão do meu componente
    // Quando a página carrega, ele é executado
    // o [] significa que o supabase_client só executa quando a página carrega
    React.useEffect(() => {
        // Na minha tabela mensagem, selecionar todos os campos
        supabase_client.from('mensagens')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                console.log('dados da consulta: ', data);
                setList(data);
            });
    }, []);

    function newMessage(value) {
        const message = {
            // id: list.length + 1,
            from: name,
            text: value
        }

        // Gravar a nova mensagem no banco de dados do Supabase
        supabase_client.from('mensagens')
            .insert([
                // Tem que ser um objeto com os MESMOS CAMPOS do Supabase
                message
            ])
            .then(({ data }) => {
                console.log('Gravei: ', data);
                /* 
                * Setar todos os valores que eu já tinha
                * Pega tudo o que já existia na lista de mensagens
                * Mais a nova mensagem
            */
                setList([
                    data[0],
                    ...list
                ]);
            });

        setMessage('');
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[100],
                backgroundImage: `url(https://cdn2.unrealengine.com/tga-guestcostumes-10beanlineup-final-export-3840x2160-efeb0818b672.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList mensagens={list} />
                    {/* {list.map((msg) => {
                        return (
                            <li key={msg.id}>
                                {msg.from}: {msg.text}
                            </li>
                        );
                    })} */}

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        onSubmit={(event) => {
                            event.preventDefault();
                            newMessage(message);
                        }}
                    >
                        <TextField
                            value={message}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setMessage(newValue);
                            }}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    // Prevenir o comportamento padrão, que é a quebra de linha quando dá enter
                                    e.preventDefault();
                                    newMessage(message);
                                }
                            }}
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />

                        {/* Criando botão de enviar mensagem */}
                        <Button
                            type='submit'
                            label='Enviar'
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.primary[500],
                                mainColorLight: appConfig.theme.colors.primary[100],
                                mainColorStrong: appConfig.theme.colors.primary[900],
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    const routes = useRouter();
    var messages = props.mensagens;

    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >

            {messages.map((mensagem) => {
                return (
                    <Text
                        onClick={(e) => {
                            const index = e.target.getAttribute('data-key')
                            //const index = e.target
                            console.log('clicou: ', index);

                            //index.style.display = 'none'
                            function deleteMsg(value) {
                                return props.mensagens.filter((el) => {
                                    return el.id != value
                                })
                            }

                            messages = deleteMsg(index);
                            console.log(messages)
                        }}
                        key={mensagem.id}
                        data-key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            position: 'relative',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.from}.png`}
                            />
                            <Text tag="strong">
                                {mensagem.from}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {mensagem.created_at.substring(0, 10).split('-').reverse().join('/')}
                            </Text>
                        </Box>
                        {mensagem.text}

                        {/* Botão Fechar */}
                        {/* <Button
                            styleSheet={{
                                position: 'absolute',
                                right: '0',
                                top: '0'
                            }}
                            variant='primary'
                            colorVariant='neutral'
                            label='X'
                        // onClick={(e) => {
                        //     var x = e.mensagem.id
                        //     alert('clicou: ', x);

                        // }}
                        /> */}
                    </Text>
                );
            })}
        </Box>
    )
}